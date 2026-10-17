// 完全版 第4章「蓄電池と65億円」（2025年6〜12月）
// 台本: story/k/k04_蓄電池と65億円.md　元資料 p5・p10・p15・p18・p19・p27・p35
// 投稿は元資料の要約（本人の見解）。有名投資家の名前・アカウントは出さない。役員・個人の名前も出さない。価格は分割調整後
'use strict';
E.chapter('k04');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;
  const bar = (g, from, to) => P.monthBar(g, { year: 2025, start: 6, months: 7, from, to });
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const box = (g, { x, y, w = 380, h = 200, top = '', main = '', c = '#262236', bg = 'rgba(255,255,255,.95)', border = 'none' }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: bg, border, boxShadow: '0 12px 24px rgba(0,0,0,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
    `<div style="font:800 28px/1.3 Round;color:#6a6066">${top}</div><div style="font:900 46px/1.35 Zen;color:${c};white-space:nowrap">${main}</div>`).ini({ o: 0 });
  // 元のチャート画像の点を通る折れ線
  const trend = (g, C, pts, { color = '#e0353f', sw = 7 } = {}) => {
    const q = pts.map(([px, py]) => C.at(px, py));
    const minx = Math.min(...q.map(p => p.x)) - 10, miny = Math.min(...q.map(p => p.y)) - 10;
    const maxx = Math.max(...q.map(p => p.x)) + 10, maxy = Math.max(...q.map(p => p.y)) + 10;
    return E.polyline(g, q.map(p => [p.x - minx, p.y - miny]), { left: minx, top: miny, width: maxx - minx, height: maxy - miny, color, sw, glow: 6 }).ini({ draw: 0 });
  };

  /* ============================================================ 注意書き */
  E.scene({ name: 'notice', bg: '#0b1022' }, sc => {
    const g = sc.cam;
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(ellipse at 50% 45%, #1d2a4a 0%, #0b1022 75%)' });
    const n = P.kNotice(g, { x: 100, y: 330, w: 1720, size: 32 });
    E.show(n, .6, .2);
    E.wait(6.0);
    E.hide(n, .5);
    E.wait(.5);
  });

  /* ============================================================ S0 アバン：2025年の夏 */
  E.scene({ name: 'avant_room' }, sc => {
    const g = sc.cam;
    E.bgm('daily', { fadeIn: 1.0, gain: .75 });
    const R = P.room(g);
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    const tag = E.div(g, { left: 120, top: 120, padding: '10px 28px', borderRadius: 14, background: 'rgba(255,255,255,.9)', color: '#2a2430', font: '900 38px/1.3 Zen', boxShadow: '0 8px 18px rgba(0,0,0,.2)' }, '2025年夏').ini({ o: 0 });
    E.pop(tag, .4, .3);
    const words = [['蓄電池', 1150, 130, -5], ['M&A・不動産', 1450, 90, 4], ['分割', 1330, 30, -2]].map(([t, x, y, r]) => E.div(g, { left: x, top: y, padding: '10px 26px 12px', borderRadius: 999, background: 'rgba(255,255,255,.95)', font: '900 40px/1.2 Zen', color: '#3a3236', boxShadow: '0 8px 18px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }, t).ini({ o: 0, r }));
    P.look(sc.cam, { s: 1.22, cx: 1200, cy: 430, dur: 6, delay: .3 });
    E.wait(.6);
    E.narr('2025年の夏。エスポアから、発表が、続いた。');
    const L = E.narr('蓄電池の事業、M&Aと不動産のマッチング、そして、株の分割。', { wait: false, yomi: 'ちくでんちの事業、エムアンドエーと不動産のマッチング、そして、株の分割。' });
    words.forEach((w, i) => { E.pop(w, .35, .2 + i * L.dur * .3, .5); E.sfx('pop', { delay: .2 + i * L.dur * .3, gain: .4 }); E.float(w, 6, 1.6, i); });
    E.at(L.end);
    E.narr('大きな数字も、出てきた。でも、それは、何の数字だったのか。');
    E.wait(.2);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 4, title: '蓄電池と65億円', sub: '2025年6月〜12月', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 I16　6月4日 */
  E.scene({ name: 'i16' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    bar(g, [6, 1], [6, 4]);
    const i04 = P.icard(g, { id: 'I04', when: '2024/7/5 16:30', session: '引け後', title: '買収への対応方針を導入（第2章）', text: '大規模買付行為への対応方針を、取締役会で導入', x: 260, y: 130, w: 1000, size: 26 });
    const i16 = P.icard(g, { id: 'I16', when: '2025/6/4 17:00', session: '引け後', title: '買収対応方針を廃止', text: '2024年7月に導入した大規模買付行為への対応方針を<br>継続せず、廃止すると開示', note: '新経営体制への移行後のガバナンス上の変化', x: 420, y: 430, w: 1240, size: 32 });
    E.tw(i04, .4, { o: [0, .75], y: [20, 0] }, 'out', .4);
    E.tw(i16, .45, { o: [0, 1], y: [30, 0] }, 'back', 1.0); E.sfx('notify', { delay: 1.0 });
    const ar = E.div(g, { left: 300, top: 360, font: '900 64px/1 Zen', color: '#ffd84a' }, '↓').ini({ o: 0 });
    E.show(ar, .3, .8);
    E.wait(1.4);
    E.say('hat', '6月4日、引け後。会社は、買収への対応方針を、廃止すると開示した。', { yomi: '6月4日、ひけご。会社は、買収への対応方針を、廃止すると開示した。' });
    const L = E.say('hat', '第2章で見た、2024年7月のI04。あの方針を、続けないということだ。', { wait: false, yomi: '第2章で見た、2024年7月の、アイゼロヨン。あの方針を、続けないということだ。' });
    const end = P.mark(g, '廃止', { x: 1060, y: 170, color: '#c62828', size: .7, rot: -8, w: 160 });
    P.stampIn(end, L.dur * .7);
    E.at(L.end);
    E.say('hat', '新しい経営体制になったあとの、会社の仕組みの変化だ。');
    E.wait(.3);
  });

  /* ============================================================ S3 2025年7〜12月の日足 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'daily' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('05'), { x: 80, y: 150, w: 1760 });
    const ttl = E.div(g, { left: 80, top: 82, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '日足　2025年7月〜12月（25・75・200日線）').ini({ o: 0 });
    E.show(ttl, .4, .1);
    P.note(sc.root, '分割調整後の値段（元資料 p5）', { x: 1500, y: 896, size: 22, dark: true });
    C.draw(3.0, .3);
    E.wait(1.0);
    E.say('hat', 'これが、2025年7月から12月の日足だ。');
    const L = E.say('hat', '新しい事業、株の分割、そして協業。発表が、並んでいる。', { wait: false });
    [[182.5, 753.5], [366, 753], [1142.5, 753.5], [1253.5, 753.5], [1457, 753], [1826.5, 753.5]].forEach(([px, py], i) => { const p = C.at(px, py); P.circle(g, { x: p.x, y: p.y, w: 38, h: 38, color: P.I_ORANGE, sw: 5, delay: .2 + i * L.dur / 7, dur: .3, sound: i % 2 === 0, seed: i }); });
    E.at(L.end + .4);
  });

  /* ============================================================ S4 I17　6月30日 19時 */
  E.scene({ name: 'i17' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [6, 4], [6, 30]);
    const i17 = P.icard(g, { id: 'I17', when: '2025/6/30 19:00', session: '引け後', title: '蓄電池用地・権利7件', text: '系統用蓄電池の開発販売に着手し、<br>7件の用地・系統接続に係る権利等の取得を決議', note: '設備・工事の資金調達や完成時期は案件ごとに確認する', x: 260, y: 120, w: 1400, size: 32 });
    E.tw(i17, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '6月30日、19時。会社は、系統用蓄電池の、開発と販売に乗り出した。', { yomi: '6月30日、じゅうくじ。会社は、けいとうようちくでんちの、開発と販売に乗り出した。' });
    E.tw(i17, .4, { o: 0, y: -30 }, 'in2');
    // 系統用蓄電池の図
    const tt = E.div(g, { left: 0, top: 130, width: W, textAlign: 'center', font: '900 44px/1.2 Zen', color: '#f3e6c8' }, '系統用蓄電池（しくみの図）').ini({ o: 0 });
    const tower = E.svg(g, { left: 300, top: 300, width: 300, height: 420 }, '0 0 300 420',
      '<path d="M150 10 L60 410 M150 10 L240 410 M90 280 L210 280 M105 200 L195 200 M120 120 L180 120 M60 410 L240 410" stroke="#c9d2e3" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M20 120 L280 120 M40 200 L260 200" stroke="#c9d2e3" stroke-width="8"/>').ini({ o: 0 });
    const tlab = E.div(g, { left: 250, top: 730, width: 400, textAlign: 'center', font: '900 34px/1.3 Zen', color: '#f3e6c8' }, '電力の送電網').ini({ o: 0 });
    const batt = E.div(g, { left: 1240, top: 360, width: 380, height: 300, borderRadius: 24, background: 'linear-gradient(180deg,#3b4a63,#232d40)', border: '6px solid #c9d2e3', overflow: 'hidden' }).ini({ o: 0 });
    const lvl = E.div(batt, { left: 0, top: 0, width: 368, height: 288, background: 'linear-gradient(180deg,#5ee39a,#17915a)', transformOrigin: '50% 100%' }).ini({ sy: .2 });
    E.div(batt, { left: 0, top: 110, width: 368, textAlign: 'center', font: '900 40px/1.3 Zen', color: '#fff', textShadow: '0 3px 8px rgba(0,0,0,.5)' }, '大きな蓄電池');
    const blab = E.div(g, { left: 1230, top: 730, width: 400, textAlign: 'center', font: '900 34px/1.3 Zen', color: '#f3e6c8' }, 'ためる・出す').ini({ o: 0 });
    const a1 = P.arrow(g, { x1: 640, y1: 450, x2: 1220, y2: 450, color: '#ffd84a', sw: 10, bend: -40 });
    const a2 = P.arrow(g, { x1: 1220, y1: 580, x2: 640, y2: 580, color: '#7fd0ff', sw: 10, bend: -40 });
    let L = E.say('hat', '系統用蓄電池は、電力の送電網につないで、電気をためたり、出したりする、大きな蓄電池だ。', { wait: false, yomi: 'けいとうようちくでんちは、電力の送電網につないで、電気をためたり、出したりする、大きな、ちくでんちだ。' });
    E.show(tt, .3, .1); E.show(tower, .4, .3); E.show(tlab, .3, .5);
    E.show(batt, .4, L.dur * .3); E.show(blab, .3, L.dur * .35);
    P.drawArrow(a1, .5, L.dur * .45); E.tw(lvl, 1.2, { sy: [.2, .85] }, 'inOut', L.dur * .5);
    P.drawArrow(a2, .5, L.dur * .7); E.tw(lvl, 1.0, { sy: [.85, .45] }, 'inOut', L.dur * .75);
    E.at(L.end);
    E.say('hat', 'そのための、7件の用地と、送電網につなぐ権利などを、取得すると決めた。');
    [tt, tower, tlab, batt, blab, a1, a1.head, a2, a2.head].forEach(n => E.hide(n, .3));
    const memo = panel(g, { x: 210, y: 300, w: 1500, h: 130, size: 36, html: '設備・工事のお金　／　いつ完成するか　→　<span style="color:#c62828">案件ごと</span>に確かめる' });
    L = E.say('hat', '設備や工事のお金、いつ完成するかは、案件ごとに確かめる必要がある。', { wait: false, delay: .3 });
    E.tw(memo, .4, { o: [0, 1], y: [20, 0] }, 'back', .1); E.sfx('pop', { delay: .1 });
    E.at(L.end);
    const clk = P.clock(g, { x: 330, y: 500, size: 220, min: 1080, label: '6/30 19:00' }).ini({ o: 0 });
    E.show(clk, .3, 0); E.tw(clk, .9, { min: [1080, 1140] }, 'inOut', .2); E.sfx('tick', { delay: .2, gain: .6 });
    const nx = panel(g, { x: 700, y: 560, w: 900, h: 120, size: 38, dark: true, html: '値動きと比べるのは　7月1日から' });
    L = E.say('hat', '発表は、夜の19時。値動きと比べるのは、次の取引日の、7月1日からだ。', { wait: false, yomi: '発表は、夜のじゅうくじ。値動きと比べるのは、次の取引日の、7月1日からだ。' });
    E.tw(nx, .4, { o: [0, 1], x: [40, 0] }, 'back', L.dur * .45); E.sfx('ding', { delay: L.dur * .45, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S5 I18　7月15日 */
  E.scene({ name: 'i18' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [6, 30], [7, 15]);
    const i18 = P.icard(g, { id: 'I18', when: '2025/7/15 15:30', session: '引け後', title: 'M&A・不動産の新事業', text: 'M&Aと不動産のマッチングサービスを開始すると発表。<br>Maaapとの使用許諾契約で展開', note: '当期業績への影響は軽微との会社見込み', x: 260, y: 140, w: 1400, size: 32 });
    E.tw(i18, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '7月15日には、M&Aと不動産の、マッチングサービスを始めると発表した。', { yomi: '7月15日には、エムアンドエーと不動産の、マッチングサービスを始めると発表した。' });
    E.say('hat', '当期の業績への影響は、軽い、という会社の見込みだ。');
    E.wait(.2);
  });

  E.scene({ name: 'highs' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('05'), { x: 80, y: 150, w: 1760 });
    E.div(g, { left: 80, top: 82, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '日足　2025年7月〜9月の高値');
    P.note(sc.root, '分割調整後の値段（元資料 p5）', { x: 1500, y: 896, size: 22, dark: true });
    const tl = trend(g, C, [[181.5, 393], [365.5, 397], [735.5, 404], [975.5, 422], [1160.5, 434]]);
    const lab = E.div(g, { left: C.at(560, 0).x, top: C.at(0, 350).y - 50, padding: '4px 16px', borderRadius: 12, background: 'rgba(20,12,16,.85)', font: '900 30px/1.3 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '高値の切り下げ').ini({ o: 0 });
    P.look(sc.cam, { s: 1.35, cx: C.at(680, 0).x, cy: C.at(0, 420).y, dur: 1.2, delay: .2 });
    E.wait(1.0);
    const L = E.say('hat', '新しい事業の発表のあとも、株価は、高値を切り下げていった。', { wait: false });
    E.tw(tl, 1.6, { draw: [0, 1] }, 'inOut', .2); E.sfx('slide', { delay: .2, gain: .5 });
    E.show(lab, .3, L.dur * .5);
    E.at(L.end + .6);
  });

  /* ============================================================ S6 I19　9月18日　1株を3株に */
  E.scene({ name: 'i19' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [7, 15], [9, 18]);
    const i19 = P.icard(g, { id: 'I19', when: '2025/9/18 15:30', session: '引け後', title: '1株を3株に分割', text: '基準日10/23、効力発生日10/24。<br>発行済株式は188.4万株から565.2万株へ', x: 260, y: 140, w: 1400, size: 34 });
    E.tw(i19, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '9月18日、会社は、1株を3株に分けると発表した。', { yomi: '9月18日、会社は、いっかぶを、さんかぶに分けると発表した。' });
    const n1 = box(g, { x: 360, y: 520, w: 460, h: 200, top: '発行済株式（分割前）', main: '188.4万株' });
    const n2 = box(g, { x: 1100, y: 520, w: 460, h: 200, top: '分割後', main: '565.2万株', c: '#2b68d8' });
    const x3 = E.div(g, { left: 840, top: 570, width: 240, textAlign: 'center', font: '900 64px/1.2 Zen', color: '#ffd84a' }, '× 3').ini({ o: 0 });
    const L = E.say('hat', '株の数は、188.4万株から、565.2万株になる。', { wait: false, yomi: '株の数は、ひゃくはちじゅうはってんよんまんかぶから、ごひゃくろくじゅうごてんにまんかぶになる。' });
    E.tw(n1, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2 });
    E.show(x3, .3, L.dur * .45);
    E.tw(n2, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .55); E.sfx('cash', { delay: L.dur * .55, gain: .5 });
    E.at(L.end + .3);
  });

  E.scene({ name: 'split_chart' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('05'), { x: 80, y: 150, w: 1760 });
    E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '日足　2025年10月（分割の権利落ち）');
    P.note(sc.root, '分割調整後の値段（元資料 p5）', { x: 1500, y: 896, size: 22, dark: true });
    const sp = C.at(1545, 375);
    P.look(sc.cam, { s: 1.6, cx: sp.x, cy: sp.y + 20, dur: 1.4, delay: .2 });
    P.circle(g, { x: sp.x - 3, y: sp.y + 10, w: 60, h: 90, delay: 1.4, dur: .4 });
    const rule = E.div(sc.root, { left: 360, top: 700, width: 1200, height: 110, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', font: '900 36px/1.2 Zen', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' },
      '<span>10/21まで　値段 <b style="color:#c62828">÷ 3</b>・出来高 <b style="color:#2b68d8">× 3</b></span><span style="color:#6a6066">10/22から　そのまま</span>').ini({ o: 0 });
    E.wait(1.2);
    const L = E.say('hat', '権利落ちは、10月22日。このチャートは、それより前の値段を3で割って、つないである。', { wait: false, yomi: 'けんりおちは、10月22日。このチャートは、それより前の値段を、3で割って、つないである。' });
    E.tw(rule, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .5); E.sfx('ding', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    const pig = E.actor(sc.root, 'pig', { x: 1760, y: 1130, h: 460, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .5, { x: [420, 0] }, 'back'); E.sfx('snort', { delay: .2 });
    E.say('pig', 'ブヒッ。ピザを3つに切っても、ピザの量は同じだブー。', { talk: pig, talkAmp: 4, delay: .4, yomi: 'ブヒッ。ピザをみっつに切っても、ピザの量は同じだブー。' });
    E.wait(.3);
  });

  /* ============================================================ S7 I20　9月29日　3.8億円の借入 */
  E.scene({ name: 'i20' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .7 });
    P.slate(g);
    bar(g, [9, 18], [9, 29]);
    const i20 = P.icard(g, { id: 'I20', when: '2025/9/29 17:00', session: '引け後', title: '蓄電池事業で3.8億円借入', text: '工事会社から3.8億円、固定金利3%、期限2026/9/28の借入を決議。設備購入等に充当', note: '借入は資金調達であり、売上や自己資本の増加ではない', x: 260, y: 130, w: 1400, size: 30 });
    E.tw(i20, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '9月29日。蓄電池の事業のために、工事会社から、3.8億円を借りると決めた。', { yomi: '9月29日。ちくでんちの事業のために、工事会社から、サンテンハチおくえんを借りると決めた。' });
    const k = [['金利', '固定 3％'], ['返す期限', '2026/9/28'], ['使い道', '設備の購入など']].map(([a, b], i) => box(g, { x: 300 + i * 460, y: 470, w: 400, h: 170, top: a, main: b }));
    let L = E.say('hat', '金利は3％で固定。返す期限は、2026年9月28日だ。', { wait: false, yomi: '金利は、さんパーセントで固定。返す期限は、2026年9月28日だ。' });
    k.forEach((n, i) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', .2 + i * L.dur * .3); E.sfx('pop', { delay: .2 + i * L.dur * .3, gain: .5 }); });
    E.at(L.end);
    k.forEach(n => E.hide(n, .3));
    const money = box(g, { x: 260, y: 470, w: 460, h: 220, top: '借りたお金', main: '3.8億円', c: '#2b68d8' });
    const no1 = box(g, { x: 840, y: 470, w: 380, h: 220, top: 'これは', main: '売上', c: '#262236' });
    const no2 = box(g, { x: 1280, y: 470, w: 380, h: 220, top: 'これは', main: '自己資本の増加', c: '#262236' });
    E.wait(.3);
    L = E.say('hat', '借りたお金は、売上でも、自己資本が増えたのでもない。返す約束のある、お金だ。', { wait: false });
    E.tw(money, .4, { o: [0, 1], y: [20, 0] }, 'back', .1); E.sfx('cash', { delay: .1, gain: .5 });
    E.tw(no1, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .2); P.cross(g, { x: 1180, y: 490, s: 80, sw: 12, delay: L.dur * .25 });
    E.tw(no2, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .4); P.cross(g, { x: 1620, y: 490, s: 80, sw: 12, delay: L.dur * .45 });
    E.at(L.end + .4);
  });

  /* ============================================================ S8 I21　10月15日 */
  E.scene({ name: 'i21' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [9, 29], [10, 15]);
    const i21 = P.icard(g, { id: 'I21', when: '2025/10/15 17:00', session: '引け後', title: '債務超過計画の進捗', text: '中間期の営業損失8,250万円を説明。<br>蓄電池開発や資本増強の協議を進めると報告', note: '8月目途としていた利益計画は策定中と説明', x: 260, y: 140, w: 1400, size: 32 });
    E.tw(i21, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '10月15日には、債務超過を解消する計画の、進み具合を報告した。');
    const loss = box(g, { x: 360, y: 560, w: 520, h: 200, top: '中間期の営業損失', main: '8,250万円', c: '#c62828' });
    const plan = box(g, { x: 1040, y: 560, w: 520, h: 200, top: '8月をめどの利益計画', main: 'まだ策定中', c: '#b8651a' });
    let L = E.say('hat', '中間期の営業損失は、8,250万円。', { wait: false, yomi: 'ちゅうかんきの営業損失は、はっせんにひゃくごじゅうまんえん。' });
    E.tw(loss, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('drop', { delay: .3, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '8月をめどにしていた利益の計画は、まだ作っている途中、という説明だ。', { wait: false });
    E.tw(plan, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('pop', { delay: .3 });
    E.at(L.end + .4);
  });

  /* ============================================================ S9 I22　11月13日 */
  E.scene({ name: 'i22' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [10, 15], [11, 13]);
    const i22 = P.icard(g, { id: 'I22', when: '2025/11/13 16:30', session: '引け後', title: 'Sigenergyと包括合意', text: '2026年末までに少なくとも80MWh・約10か所の<br>販売・設置を目標とする協業。個別案件の契約は順次協議', x: 260, y: 140, w: 1400, size: 32 });
    E.tw(i22, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '11月13日、16時30分。会社は、Sigenergyとの、包括的な合意を発表した。', { yomi: '11月13日、16時30分。会社は、シグエナジーとの、包括的な合意を発表した。' });
    const goal = box(g, { x: 260, y: 470, w: 640, h: 220, top: '2026年末までの目標', main: '80MWh・約10か所', c: '#2b68d8' });
    const each = box(g, { x: 1020, y: 470, w: 640, h: 220, top: '一つ一つの案件の契約', main: 'これから順に協議', c: '#b8651a' });
    let L = E.say('hat', '2026年の末までに、少なくとも80メガワットアワー、およそ10か所の、販売と設置を目指す協業だ。', { wait: false, yomi: '2026年の末までに、少なくとも、はちじゅうメガワットアワー、およそ、じっかしょの、販売と設置を目指す協業だ。' });
    E.tw(goal, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .3); E.sfx('pop', { delay: L.dur * .3 });
    E.at(L.end);
    L = E.say('hat', '一つ一つの案件の契約は、これから順に話し合う。', { wait: false });
    E.tw(each, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2 });
    E.at(L.end);
    const unit = panel(g, { x: 460, y: 740, w: 1000, h: 90, size: 32, dark: true, html: 'MWh（メガワットアワー）＝ためられる電気の量の単位' });
    const call = P.eveCall(g, ['normal', 'smile'], { x: 1600, y: 690, w: 280, h: 220 });
    E.show(unit, .4, .1);
    E.pop(call, .4, .2, .6);
    E.say('eve', 'メガワットアワーって、電気をためられる量なんだね〜。', { talk: call, talkAmp: 3, delay: .4, yomi: 'メガワットアワーって、電気をためられる量なんだねー。' });
    E.wait(.3);
  });

  /* ============================================================ S10 T14　11月14日 11:36 */
  E.scene({ name: 't14' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [11, 13], [11, 14]);
    const tl = P.timeLink(g, { x: 260, y: 150, w: 1400, a: { id: 'I22', time: '11/13 16:30', sub: '会社の発表（引け後）', color: P.I_ORANGE }, b: { id: 'T14', time: '11/14 11:36', sub: '投稿（昼休み）', color: P.T_BLUE }, label: '翌日の昼' });
    tl.in(.2);
    const t14 = P.tcard(g, { id: 'T14', when: '2025/11/14 11:36', kind: '事業', session: '昼休み', text: '蓄電池案件の金額を65億円に訂正', note: '会社PRでは80MWh案件の販売見込金額。確定売上や当期利益ではない', x: 300, y: 340, w: 1320, size: 40 });
    E.tw(t14, .45, { o: [0, 1], y: [30, 0] }, 'back', 1.3); E.sfx('notify', { delay: 1.3 });
    E.wait(1.7);
    E.narr('次の日の昼休み、11時36分。蓄電池の案件の金額を、65億円に訂正する投稿があった。', { yomi: '次の日の昼休み、11時36分。ちくでんちの案件の金額を、ろくじゅうごおくえんに訂正する投稿があった。' });
    E.say('hat', '65億円は、会社のPRにある、80MWhの案件の、販売見込金額だ。', { yomi: 'ろくじゅうごおくえんは、会社の、ピーアールにある、はちじゅうメガワットアワーの案件の、販売見込金額だ。' });
    E.wait(.2);
  });

  E.scene({ name: 'not_sales' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '65億円は、何の数字か', 44);
    E.show(tt, .3);
    const goal = box(g, { x: 160, y: 220, w: 560, h: 200, top: '目標', main: '80MWh・約10か所', c: '#2b68d8' });
    const est = box(g, { x: 900, y: 220, w: 640, h: 200, top: '会社PRの販売見込金額', main: '65億円', c: '#2b68d8', border: '6px solid #2b68d8' });
    const arr = E.div(g, { left: 740, top: 270, width: 140, textAlign: 'center', font: '900 70px/1 Zen', color: '#ffd84a' }, '→').ini({ o: 0 });
    const s1 = box(g, { x: 360, y: 520, w: 520, h: 200, top: 'これは', main: '確定した売上' });
    const s2 = box(g, { x: 1040, y: 520, w: 520, h: 200, top: 'これは', main: '今期の利益' });
    E.wait(.3);
    E.tw(goal, .4, { o: [0, 1], y: [20, 0] }, 'back', .1); E.sfx('pop', { delay: .1 });
    E.show(arr, .3, .5);
    E.tw(est, .4, { o: [0, 1], y: [20, 0] }, 'back', .7); E.sfx('pop', { delay: .7 });
    E.wait(1.2);
    const L = E.say('hat', '決まった売上でも、今期の利益でもない。', { wait: false });
    E.tw(s1, .4, { o: [0, 1], y: [20, 0] }, 'back', .1); P.cross(g, { x: 840, y: 540, s: 80, sw: 12, delay: L.dur * .3 });
    E.tw(s2, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .45); P.cross(g, { x: 1520, y: 540, s: 80, sw: 12, delay: L.dur * .7 });
    E.at(L.end);
    const call = P.eveCall(g, ['normal', 'surprise'], { x: 1590, y: 560, w: 300, h: 240 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '65億円って、もう入ってきたお金じゃないんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: 'ろくじゅうごおくえんって、もう入ってきたお金じゃないんだねー。' });
    E.say('hat', 'そうだ。目標の数字と、計上された売上は、分けて読む。');
    E.wait(.3);
  });

  /* ============================================================ S11 その後の値段 */
  E.scene({ name: 'after' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('05'), { x: 80, y: 150, w: 1760 });
    E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '日足　2025年11月〜12月');
    P.note(sc.root, '分割調整後の値段（元資料 p5）', { x: 1500, y: 896, size: 22, dark: true });
    const a = C.at(2010.5, 466), b = C.at(2417, 520);
    P.look(sc.cam, { s: 1.6, cx: (a.x + b.x) / 2 - 80, cy: (a.y + b.y) / 2 - 20, dur: 1.4, delay: .2 });
    const lab = (pt, txt, dx, dy) => E.div(g, { left: pt.x + dx, top: pt.y + dy, padding: '4px 12px', borderRadius: 10, background: 'rgba(255,255,255,.96)', font: '900 22px/1.3 Noto', color: '#262236', whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }, txt).ini({ o: 0 });
    const la = lab(a, '11月の終値 797円', -80, -78), lb = lab(b, '12月の終値 680円', -210, 34);
    E.wait(1.5);
    let L = E.say('hat', '11月の終値は、797円。12月の終値は、680円だ。', { wait: false, yomi: '11月の、おわりねは、ななひゃくきゅうじゅうななえん。12月の、おわりねは、ろっぴゃくはちじゅうえんだ。' });
    P.circle(g, { x: a.x, y: a.y, w: 30, h: 30, sw: 4, delay: .2, dur: .3 }); E.pop(la, .3, .3);
    P.circle(g, { x: b.x, y: b.y, w: 30, h: 30, sw: 4, delay: L.dur * .55, dur: .3 }); E.pop(lb, .3, L.dur * .6);
    E.at(L.end);
    E.say('hat', '上がり続けた、とは確かめられない。');
    E.wait(.4);
  });

  /* ============================================================ S12 ブルちゃんの部屋 */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_room' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    const tags = [['蓄電池', 1120, 150, -5], ['借入', 1360, 90, 3], ['協業', 1560, 150, -3]].map(([t, x, y, r]) => E.div(g, { left: x, top: y, padding: '10px 26px 12px', borderRadius: 999, background: 'rgba(255,255,255,.95)', font: '900 38px/1.2 Zen', color: '#3a3236', boxShadow: '0 8px 18px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }, t).ini({ o: 0, r }));
    const no = E.div(g, { left: 1150, top: 240, padding: '8px 24px', borderRadius: 14, background: '#c62828', font: '900 34px/1.3 Zen', color: '#fff', whiteSpace: 'nowrap' }, 'どれも、売上ではない').ini({ o: 0, r: -2 });
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 4, delay: .3 });
    E.wait(.6);
    const L = E.narr('蓄電池、借入、協業。大きな数字が、続いた。', { wait: false, yomi: 'ちくでんち、借入、協業。大きな数字が、続いた。' });
    tags.forEach((t, i) => { E.pop(t, .35, .2 + i * L.dur * .25, .5); E.sfx('pop', { delay: .2 + i * L.dur * .25, gain: .4 }); E.float(t, 6, 1.6, i); });
    E.at(L.end);
    const L2 = E.narr('でも、どれも、売上ではなかった。', { wait: false });
    E.tw(no, .35, { o: [0, 1], s: [1.4, 1] }, 'in2', L2.dur * .5); E.sfx('stamp', { delay: L2.dur * .5 + .2, gain: .6 });
    E.at(L2.end + .3);
  });

  /* ============================================================ S13 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '見込みも、借りたお金も、売上の箱には入らない', { left: 120, top: 120, font: '900 54px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .06));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const sales = E.div(paper, { left: 820, top: 330, width: 460, height: 420, borderRadius: 20, border: '6px solid #17915a', background: 'rgba(255,255,255,.6)' },
      '<div style="position:absolute;left:0;top:-56px;width:460px;text-align:center;font:900 40px/1.2 Zen;color:#17915a">売上の箱</div><div style="position:absolute;left:0;top:170px;width:460px;text-align:center;font:900 34px/1.4 Zen;color:rgba(23,145,90,.55)">（3つとも入らない）</div>').ini({ o: 0 });
    const chips = [['65億円＝販売見込金額', 330], ['3.8億円＝借入', 470], ['80MWh＝目標', 610]].map(([t, y]) => E.div(paper, { left: 120, top: y, width: 560, height: 92, borderRadius: 14, background: '#fffaf0', border: '3px solid #8a7050', textAlign: 'center', font: '900 36px/86px Zen', color: '#3a3236', whiteSpace: 'nowrap', boxShadow: '0 6px 12px rgba(0,0,0,.18)' }, t).ini({ o: 0 }));
    E.wait(2.8);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「見込みも、借りたお金も、売上の箱には入らない」。', { wait: false, yomi: '見込みも、借りたお金も、売上の箱には入らない。' });
    E.show(sales, .4, .1); E.sfx('pop', { delay: .1, gain: .5 });
    chips.forEach((c, i) => { E.tw(c, .4, { o: [0, 1], x: [-40, 0] }, 'back', .4 + i * L.dur * .22); E.sfx('slide', { delay: .4 + i * L.dur * .22, gain: .4 }); });
    E.at(L.end + 1.0);
  });

  /* ============================================================ S14 男爵 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .75 });
    const C = P.closeup(g, CH('baron_e_scheme'), { bg: 'radial-gradient(ellipse at 50% 40%, #4a1622 0%, #200a10 75%)', imgH: 860, panelBg: 'linear-gradient(180deg,#3a121b,#1a070c)' });
    E.from(C.img, { s: .94, y: 30 }, .6, 0, 'out');
    E.wait(.5);
    E.say('baron', '大きな数字を見ると、人は、もう売上になったように読む。', { talk: C.img, talkAmp: 2 });
    C.swap(CH('baron_e_normal'));
    E.say('baron', 'だが、目標の欄と、売上の欄は、別の欄だ。', { talk: C.img, talkAmp: 2 });
    E.wait(.5);
  });

  /* ============================================================ S15 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 404 });
    [['T', P.T_BLUE], ['I', P.I_ORANGE]].forEach(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
    });
    const st = P.sticky(g, '第5章<br>増資の決議と払込', { x: 1320, y: 120, w: 520, h: 250, rot: 5, size: 44 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第5章だブー。', { talk: pig, talkAmp: 5 });
    E.unsub(.4);
    const tsu = E.div(g, { left: 0, top: 660, width: W, textAlign: 'center', font: '900 64px/1.2 Zen', color: '#f3e6c8', letterSpacing: '.3em' }, 'つづく').ini({ o: 0 });
    E.show(tsu, .8, .9);
    E.wait(3.0);
  });
  E.scene({ name: 'notice_end', bg: '#0b1022' }, sc => {
    const g = sc.cam;
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(ellipse at 50% 45%, #1d2a4a 0%, #0b1022 75%)' });
    const n = P.kNotice(g, { x: 100, y: 330, w: 1720, size: 32 });
    E.show(n, .6, .2);
    E.wait(6.0);
  });
  E.bgmStop(2.5, -2.5);
  E.finish();
}
