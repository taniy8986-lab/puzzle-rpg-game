// motion.html を 1 フレームずつ撮影して FFmpeg で MP4 にし、元トレーラーの音を同期させて重ねる。
//
//   node render.js <元トレーラー.mp4>                  → out/eve_jiji_news.mp4（1920x1080・60fps・40 秒・音つき）
//   node render.js <元トレーラー.mp4> --stills 2,9,17  → out/stills/*.png（確認用の静止画だけ）
//   FPS=30 node render.js <元トレーラー.mp4>           → フレームレートを変える
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
const FPS = Number(process.env.FPS || 60);
const OFFSET = 1.2; // motion.html の OFFSET と同じ値（元トレーラーを何秒うしろにずらすか）
const OUT_DIR = path.join(__dirname, 'out');
const PAGE = 'file://' + path.join(__dirname, 'motion.html');

function run(cmd, args) {
  return new Promise((ok, ng) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'] });
    p.on('close', c => (c === 0 ? ok() : ng(new Error(`${cmd} exit ${c}`))));
  });
}

async function openPage() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto(PAGE);
  await page.evaluate(() => window.ready);
  return { browser, page };
}

async function shoot(page, t) {
  await page.evaluate(t => window.renderFrame(t), t);
  return page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
}

async function stills(times) {
  const { browser, page } = await openPage();
  const dir = path.join(OUT_DIR, 'stills');
  fs.mkdirSync(dir, { recursive: true });
  for (const t of times) {
    const file = path.join(dir, `t${t.toFixed(2).padStart(5, '0')}.png`);
    fs.writeFileSync(file, await shoot(page, t));
    console.log(file);
  }
  await browser.close();
}

async function video(trailer) {
  const { browser, page } = await openPage();
  const duration = await page.evaluate(() => window.DURATION);
  const frames = Math.round(duration * FPS);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const silent = path.join(OUT_DIR, 'video_only.mp4');
  const out = path.join(OUT_DIR, 'eve_jiji_news.mp4');

  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', silent,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((ok, ng) => ff.on('close', c => (c === 0 ? ok() : ng(new Error(`ffmpeg exit ${c}`)))));

  const start = Date.now();
  for (let i = 0; i < frames; i++) {
    const buf = await shoot(page, i / FPS);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % FPS === 0) process.stdout.write(`\r${i}/${frames} フレーム  ${((Date.now() - start) / 1000).toFixed(0)} 秒経過`);
  }
  ff.stdin.end();
  await done;
  await browser.close();

  // 音：冒頭のチャイム（自作）＋ OFFSET 秒ずらした元トレーラーの音
  const d = Math.round(OFFSET * 1000);
  const notes = [[0.05, 880], [0.17, 1108.7], [0.29, 1318.5], [0.41, 1760]];
  const chime = notes.map(([s, f]) => `sin(2*PI*${f}*t)*exp(-5*(t-${s}))*gte(t,${s})`).join('+')
    + '+0.9*sin(2*PI*55*t)*exp(-3*t)';
  await run('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', silent, '-i', trailer,
    '-filter_complex',
    `aevalsrc='0.18*(${chime})':d=${OFFSET + 0.4}:s=48000,aformat=channel_layouts=stereo,afade=t=out:st=${OFFSET - 0.2}:d=0.6[c];` +
    `[1:a]adelay=${d}|${d}[tr];` +
    `[c][tr]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur=${duration},afade=t=out:st=${duration - 0.8}:d=0.8[a]`,
    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
    '-t', String(duration), '-movflags', '+faststart', out,
  ]);
  fs.unlinkSync(silent);
  console.log(`\n書き出し完了: ${out}`);
}

const trailer = process.argv[2];
if (!trailer || !fs.existsSync(trailer)) {
  console.error('使い方: node render.js <元トレーラー.mp4> [--stills t1,t2,...]');
  process.exit(1);
}
const i = process.argv.indexOf('--stills');
(i >= 0 ? stills(process.argv[i + 1].split(',').map(Number)) : video(trailer)).catch(e => {
  console.error(e);
  process.exit(1);
});
