// player.html?ch=XX を 1 フレームずつ撮影して MP4 にし、合成した音（tools/make_audio.py）を重ねる。
//
//   node render.js 01                      → out/ch01.mp4（1920x1080・30fps・音つき）
//   node render.js 01 --stills 3,12.5,40   → out/stills/ch01_t*.png（確認用の静止画だけ）
//   node render.js 01 --cues               → 声を合成して build/ch01_cues.json と長さだけ書き出す
//   node render.js 01 --novoice --stills 3 → 声を合成せず（長さは見積もり）すぐに静止画を撮る
//   node render.js 01 --from 30 --to 60    → 一部だけ（音なし）out/ch01_part.mp4
//   FPS=60 WORKERS=4 node render.js 01     → フレームレート・並列数を変える
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

function loadPlaywright() {
  for (const p of ['playwright', '/opt/node-tools/node_modules/playwright']) {
    try { return require(p); } catch (_) { /* 次を試す */ }
  }
  throw new Error('playwright が見つかりません（npm i playwright）');
}
const { chromium } = loadPlaywright();

const W = 1920, H = 1080;
const FPS = Number(process.env.FPS || 30);
const WORKERS = Number(process.env.WORKERS || 3);
const OUT_DIR = path.join(__dirname, 'out');
const BUILD = path.join(__dirname, 'build');

const ch = process.argv[2];
if (!ch || !/^[a-z]?\d+$/.test(ch)) {
  console.error('使い方: node render.js <章番号 例 01・完全版は k01> [--stills t1,t2] [--cues] [--from s --to s]');
  process.exit(1);
}
const opt = name => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; };
const NOVOICE = process.argv.includes('--novoice');
const PAGE = 'file://' + path.join(__dirname, 'player.html') + `?ch=${ch}` + (NOVOICE ? '&novoice' : '') + (process.env.QS ? '&' + process.env.QS : '');

function run(cmd, args) {
  return new Promise((ok, ng) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'] });
    p.on('close', c => (c === 0 ? ok() : ng(new Error(`${cmd} exit ${c}`))));
  });
}

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('ページのエラー:', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  await page.goto(PAGE);
  await page.waitForFunction(() => window.ready);
  await page.evaluate(() => window.ready);
  return page;
}

async function shoot(page, t, fast = false) {
  await page.evaluate(t => window.renderFrame(t), t);
  // 動画用は JPEG（品質 95）で速く撮る。静止画は PNG
  return fast
    ? page.screenshot({ type: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: W, height: H } })
    : page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
}

// [f0, f1) のフレームを 1 本の MP4 に書き出す（描画の取り合いを避けるため、ブラウザは区間ごとに別に立てる）
async function renderRange(f0, f1, out, label, progress) {
  const browser = await chromium.launch();
  const page = await openPage(browser);
  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'faster', '-crf', '18', '-tune', 'animation',
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-g', String(FPS * 2), out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((ok, ng) => ff.on('close', c => (c === 0 ? ok() : ng(new Error(`ffmpeg exit ${c}`)))));
  for (let i = f0; i < f1; i++) {
    const buf = await shoot(page, i / FPS, true);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    progress[label] = i - f0 + 1;
  }
  ff.stdin.end();
  await done;
  await browser.close();
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(BUILD, { recursive: true });
  const browser = await chromium.launch();
  let probe = await openPage(browser);
  if (!NOVOICE) {
    // 1 回目: セリフを集めて声を合成 → 2 回目: 声の長さでタイミングを組み直す
    const lines = await probe.evaluate(() => window.LINES);
    const linesFile = path.join(BUILD, `ch${ch}_lines.json`);
    fs.writeFileSync(linesFile, JSON.stringify({ ch, lines }, null, 1));
    await run('python3', [path.join(__dirname, 'tools', 'make_voice.py'), linesFile]);
    await probe.close();
    probe = await openPage(browser);
  }
  const duration = await probe.evaluate(() => window.DURATION);
  const cues = await probe.evaluate(() => window.CUES);
  const vmap = NOVOICE ? {} : JSON.parse(fs.readFileSync(path.join(BUILD, `ch${ch}_voice.json`), 'utf8'));
  cues.voices = (cues.voices || []).filter(v => vmap[v.id]).map(v => ({ t: v.t, file: vmap[v.id].file, gain: v.gain || 1 }));
  const cueFile = path.join(BUILD, `ch${ch}_cues.json`);
  fs.writeFileSync(cueFile, JSON.stringify(cues));
  console.log(`第${ch}章: ${duration.toFixed(2)} 秒（${Math.floor(duration / 60)}分${(duration % 60).toFixed(1)}秒）`);

  const stills = opt('--stills');
  if (stills) {
    const dir = path.join(OUT_DIR, 'stills');
    fs.mkdirSync(dir, { recursive: true });
    for (const t of stills.split(',').map(Number)) {
      const file = path.join(dir, `ch${ch}_t${t.toFixed(2).padStart(6, '0')}.png`);
      fs.writeFileSync(file, await shoot(probe, t));
      console.log(file);
    }
    await browser.close();
    return;
  }
  if (process.argv.includes('--cues')) { await browser.close(); return; }
  await probe.close();

  const from = Number(opt('--from') || 0), to = Number(opt('--to') || duration);
  const partial = opt('--from') != null || opt('--to') != null;
  const F0 = Math.round(from * FPS), F1 = Math.round(Math.min(to, duration) * FPS);
  const n = Math.max(1, Math.min(WORKERS, Math.ceil((F1 - F0) / FPS)));
  const per = Math.ceil((F1 - F0) / n);
  const parts = [], progress = {};
  const start = Date.now();
  const timer = setInterval(() => {
    const doneF = Object.values(progress).reduce((a, b) => a + b, 0);
    process.stdout.write(`\r${doneF}/${F1 - F0} フレーム  ${((Date.now() - start) / 1000).toFixed(0)} 秒経過   `);
  }, 2000);
  const jobs = [];
  for (let i = 0; i < n; i++) {
    const a = F0 + i * per, b = Math.min(F1, a + per);
    if (a >= b) break;
    const out = path.join(BUILD, `ch${ch}_part${i}.mp4`);
    parts.push(out);
    jobs.push(renderRange(a, b, out, i, progress));
  }
  await browser.close();
  await Promise.all(jobs);
  clearInterval(timer);

  const list = path.join(BUILD, `ch${ch}_parts.txt`);
  fs.writeFileSync(list, parts.map(p => `file '${p}'`).join('\n'));
  const silent = path.join(BUILD, `ch${ch}_video.mp4`);
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);
  parts.forEach(p => fs.unlinkSync(p));

  if (partial) {
    const out = path.join(OUT_DIR, `ch${ch}_part.mp4`);
    fs.renameSync(silent, out);
    console.log(`\n一部の書き出し完了: ${out}`);
    return;
  }
  const wav = path.join(BUILD, `ch${ch}_audio.wav`);
  await run('python3', [path.join(__dirname, 'tools', 'make_audio.py'), cueFile, wav]);
  const out = path.join(OUT_DIR, `ch${ch}.mp4`);
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', wav,
    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out]);
  fs.unlinkSync(silent);
  console.log(`\n書き出し完了: ${out}（${((Date.now() - start) / 1000).toFixed(0)} 秒）`);
}

main().catch(e => { console.error(e); process.exit(1); });
