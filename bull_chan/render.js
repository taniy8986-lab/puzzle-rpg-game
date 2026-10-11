// motion.html を 1 フレームずつ撮影し、FFmpeg に流して MP4 にする。
//
//   node render.js                     → out/bull_chan.mp4（1920x1080・60fps・20 秒）
//   node render.js --stills 1.5,5,12   → out/stills/*.png（確認用の静止画だけ）
//   FPS=30 node render.js              → フレームレートを変える
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
const OUT_DIR = path.join(__dirname, 'out');
const PAGE = 'file://' + path.join(__dirname, 'motion.html');

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

async function video() {
  const { browser, page } = await openPage();
  const duration = await page.evaluate(() => window.DURATION);
  const frames = Math.round(duration * FPS);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = path.join(OUT_DIR, 'bull_chan.mp4');

  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-tune', 'animation',
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart',
    out,
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
  console.log(`\n書き出し完了: ${out}`);
}

const i = process.argv.indexOf('--stills');
(i >= 0 ? stills(process.argv[i + 1].split(',').map(Number)) : video()).catch(e => {
  console.error(e);
  process.exit(1);
});
