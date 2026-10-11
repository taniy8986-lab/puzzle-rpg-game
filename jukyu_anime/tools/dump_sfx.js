// ページから効果音の時刻表を取り出して build/<ep>/sfx.json に書く（音だけ作り直す時用）
const path = require('path');
const fs = require('fs');
let pw; for (const p of ['playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = require(p); break; } catch (_) {} }
(async () => {
  const ep = process.argv[2] || 'ep01';
  const b = await pw.chromium.launch();
  const page = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.join(__dirname, '..', 'episodes', ep, 'index.html'));
  await page.evaluate(() => window.ready);
  const sfx = await page.evaluate(() => window.SFX_EVENTS);
  const cuts = await page.evaluate(() => window.CUTS);
  fs.writeFileSync(path.join(__dirname, '..', 'build', ep, 'sfx.json'), JSON.stringify(sfx, null, 1));
  console.log(`効果音 ${sfx.length} 個 / カット ${cuts.length} 個`, errs.length ? '\nエラー: ' + errs.join('\n') : '');
  await b.close();
})();
