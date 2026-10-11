// episodes/<ep>/index.html を 1 コマずつ撮影して MP4 にする。
//
//   node render.js ep01                    → build/ep01/ep01.mp4（1920x1080・30fps・音つき）
//   node render.js ep01 --stills 10,42.5   → build/ep01/stills/*.png（確認用の静止画）
//   node render.js ep01 --from 60 --to 90  → その区間だけ（音なしの確認用 build/ep01/part.mp4）
//   WORKERS=4 node render.js ep01          → 並列で撮る数（既定は CPU 数）
//
// 音は先に tools/mix_audio.py が build/<ep>/audio.wav を作る（このスクリプトが呼ぶ）。
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn, spawnSync } = require('child_process');

function loadPlaywright() {
  for (const p of ['playwright', '/opt/node-tools/node_modules/playwright']) {
    try { return require(p); } catch (_) { /* 次を試す */ }
  }
  throw new Error('playwright が見つかりません（npm i playwright）');
}
const { chromium } = loadPlaywright();

const W = 1920, H = 1080;
const EP = process.argv[2] || 'ep01';
const arg = name => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; };
const ROOT = __dirname;
const OUT = path.join(ROOT, 'build', EP);
const PAGE = 'file://' + path.join(ROOT, 'episodes', EP, 'index.html');

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(PAGE);
  await page.evaluate(() => window.ready);
  if (errors.length) console.warn('ページのエラー:\n  ' + errors.join('\n  '));
  return page;
}

async function shoot(page, t, png = false) {
  await page.evaluate(t => window.renderFrame(t), t);
  // 動画用は JPEG（PNG の圧縮が 1 コマあたり数百ミリ秒かかるため）。確認用の静止画だけ PNG
  return png ? page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } })
    : page.screenshot({ type: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: W, height: H } });
}

async function stills(times) {
  const browser = await chromium.launch();
  const page = await openPage(browser);
  const dir = path.join(OUT, 'stills');
  fs.mkdirSync(dir, { recursive: true });
  for (const t of times) {
    const file = path.join(dir, `t${t.toFixed(2).padStart(7, '0')}.png`);
    fs.writeFileSync(file, await shoot(page, t, true));
    console.log(file);
  }
  await browser.close();
}

function encoder(out, fps) {
  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-tune', 'animation',
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((ok, ng) => ff.on('close', c => (c === 0 ? ok() : ng(new Error(`ffmpeg exit ${c}`)))));
  return { ff, done };
}

async function renderRange(browser, f0, f1, fps, out, tick) {
  const page = await openPage(browser);
  const { ff, done } = encoder(out, fps);
  for (let i = f0; i < f1; i++) {
    const buf = await shoot(page, i / fps);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    tick();
  }
  ff.stdin.end();
  await done;
  await page.close();
}

async function video() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const probe = await openPage(browser);
  const duration = await probe.evaluate(() => window.DURATION);
  const fps = await probe.evaluate(() => window.EP.fps);
  const sfx = await probe.evaluate(() => window.SFX_EVENTS);
  await probe.close();
  fs.writeFileSync(path.join(OUT, 'sfx.json'), JSON.stringify(sfx, null, 1));

  const from = arg('--from'), to = arg('--to');
  const partial = from !== null || to !== null;
  const F0 = Math.round((from ? Number(from) : 0) * fps);
  const F1 = Math.round((to ? Number(to) : duration) * fps);

  if (!partial) {
    const r = spawnSync('python3', [path.join(ROOT, 'tools', 'mix_audio.py'), EP], { stdio: 'inherit' });
    if (r.status !== 0) throw new Error('音のミックスに失敗');
  }

  const workers = Math.max(1, Number(process.env.WORKERS || os.cpus().length));
  const per = Math.ceil((F1 - F0) / workers);
  const parts = [];
  let doneFrames = 0;
  const start = Date.now();
  const tick = () => {
    doneFrames++;
    if (doneFrames % fps === 0) {
      const el = (Date.now() - start) / 1000;
      process.stdout.write(`\r${doneFrames}/${F1 - F0} フレーム  ${el.toFixed(0)} 秒経過  残り約 ${((F1 - F0 - doneFrames) * el / doneFrames).toFixed(0)} 秒   `);
    }
  };
  const jobs = [];
  for (let w = 0; w < workers; w++) {
    const a = F0 + w * per, b = Math.min(F1, a + per);
    if (a >= b) break;
    const out = path.join(OUT, `part_${String(w).padStart(2, '0')}.mp4`);
    parts.push(out);
    jobs.push(renderRange(browser, a, b, fps, out, tick));
  }
  await Promise.all(jobs);
  await browser.close();

  const list = path.join(OUT, 'parts.txt');
  fs.writeFileSync(list, parts.map(p => `file '${p}'`).join('\n'));
  const final = partial ? path.join(OUT, 'part.mp4') : path.join(OUT, `${EP}.mp4`);
  const args = ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list];
  if (!partial) args.push('-i', path.join(OUT, 'audio.wav'), '-c:a', 'aac', '-b:a', '192k', '-shortest');
  args.push('-c:v', 'copy', '-movflags', '+faststart', final);
  const r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('結合に失敗');
  parts.forEach(p => fs.unlinkSync(p));
  fs.unlinkSync(list);
  console.log(`\n書き出し完了: ${final}`);
}

const st = arg('--stills');
(st ? stills(st.split(',').map(Number)) : video()).catch(e => {
  console.error(e);
  process.exit(1);
});
