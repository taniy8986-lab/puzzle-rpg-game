// 完全版 第4章「蓄電池と65億円」（2025年6〜12月）
// 台本: story/k/k04_蓄電池と65億円.md　元資料 p4・p5・p10・p15・p18・p19・p27・p35・p36
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
    E.say('hat', '引け後は、その日の取引が、終わったあと、という意味だ。', { yomi: 'ひけごは、その日の取引が、終わったあと、という意味だ。' });
    const L = E.say('hat', '第2章で見た、2024年7月のI04。あの方針を、続けないということだ。', { wait: false, yomi: '第2章で見た、2024年7月の、アイゼロヨン。あの方針を、続けないということだ。' });
    const end = P.mark(g, '廃止', { x: 1060, y: 170, color: '#c62828', size: .7, rot: -8, w: 160 });
    P.stampIn(end, L.dur * .7);
    E.at(L.end);
    E.say('hat', 'この方針は、株を大きく買い付ける動きに、会社がどう対応するか、を決めたものだ。');
    E.say('hat', '第3章で見たとおり、2025年4月に、取締役が入れ替わって、新しい経営体制になった。');
    E.say('hat', '元資料は、この廃止を、新しい経営体制での、ガバナンスの変化、としている。');
    E.say('hat', 'ガバナンスは、会社を、どう動かし、どうチェックするか、という仕組みのことだ。');
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
    E.say('hat', '日足は、1日の値動きを、1本のローソク足にした、チャートだ。', { yomi: 'ひあしは、いちにちの値動きを、いっぽんの、ローソク足にした、チャートだ。' });
    E.say('hat', '線は、25日、75日、200日の、終値の平均を、つないだものだ。', { yomi: 'せんは、にじゅうごにち、ななじゅうごにち、にひゃくにちの、おわりねの平均を、つないだものだ。' });
    E.say('hat', '値段は、このあと出てくる、株の分割に合わせて、単位をそろえてある。', { yomi: '値段は、このあと出てくる、株の分割に合わせて、たんいを、そろえてある。' });
    // 下の段の IR の印（大きな印 I17・I19・I20・I22、小さな印 I18・I21）
    const M = [[182.5, 753.5], [366, 753], [1142.5, 753.5], [1253.5, 753.5], [1457, 753], [1826.5, 753.5]];
    const mk = (i, delay, sound) => { const p = C.at(...M[i]); P.circle(g, { x: p.x, y: p.y, w: 38, h: 38, color: P.I_ORANGE, sw: 5, delay, dur: .3, sound, seed: i }); };
    E.say('hat', 'チャートの下の段の、橙の印が、会社の発表、IRの位置だ。', { yomi: 'チャートの、下の段の、だいだいの、しるしが、会社の発表、アイアールの位置だ。' });
    let L = E.say('hat', '大きな印は、6月30日の蓄電池と、9月18日の、株の分割。', { wait: false, yomi: '大きな、しるしは、6月30日の、ちくでんちと、9月18日の、株の分割。' });
    mk(0, L.dur * .3, true); mk(2, L.dur * .75, false);
    E.at(L.end);
    L = E.say('hat', '9月29日の借入と、11月13日の、協業の発表だ。', { wait: false });
    mk(3, L.dur * .2, true); mk(5, L.dur * .65, false);
    E.at(L.end);
    L = E.say('hat', '小さな印は、7月15日と、10月15日の発表だ。', { wait: false, yomi: '小さな、しるしは、7月15日と、10月15日の発表だ。' });
    mk(1, L.dur * .3, true); mk(4, L.dur * .7, false);
    E.at(L.end);
    E.say('hat', 'この順に、一つずつ見ていく。');
    E.wait(.4);
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
    const done = panel(g, { x: 210, y: 250, w: 1500, h: 110, size: 36, html: '<span>この発表で決めたのは、用地と権利などの取得</span>' });
    const memo = panel(g, { x: 210, y: 390, w: 1500, h: 120, size: 36, html: '<span>設備や工事のお金の用意と、いつ完成するかは、<span style="color:#c62828">案件ごと</span>に確かめる</span>' });
    E.tw(done, .4, { o: [0, 1], y: [20, 0] }, 'back', .5); E.sfx('pop', { delay: .5 });
    E.say('hat', 'この発表で、会社が決めたのは、用地と権利などを、取得することだ。', { delay: .3 });
    L = E.say('hat', '蓄電池の設備や、工事のお金を、どう用意するか。いつ完成するか。', { wait: false, yomi: 'ちくでんちの設備や、工事のお金を、どう用意するか。いつ完成するか。' });
    E.tw(memo, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .3); E.sfx('pop', { delay: L.dur * .3 });
    E.at(L.end);
    E.say('hat', '元資料は、それを、一つ一つの案件ごとに、確かめる点だ、としている。');
    const clk = P.clock(g, { x: 330, y: 550, size: 220, min: 1080, label: '6/30 19:00' }).ini({ o: 0 });
    E.show(clk, .3, 0); E.tw(clk, .9, { min: [1080, 1140] }, 'inOut', .2); E.sfx('tick', { delay: .2, gain: .6 });
    E.say('hat', '発表は、夜の19時。その日の取引が、終わったあとだ。', { yomi: '発表は、夜のじゅうくじ。その日の取引が、終わったあとだ。' });
    E.say('hat', '6月30日の値段は、この発表の前に、もう付いていた。');
    const nx = panel(g, { x: 700, y: 600, w: 900, h: 120, size: 38, dark: true, html: '値動きと比べるのは　7月1日から' });
    L = E.say('hat', 'だから、値動きと比べるのは、次の取引日の、7月1日からだ。', { wait: false });
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
    // 言葉の説明（一般的な説明）
    const defs = ['M&Aは、会社や事業を、買ったり、売ったりすること', 'マッチングは、売りたい人と、買いたい人を、引き合わせること', '使用許諾契約は、ある権利などを、使ってよいと認める契約', '当期は、今の決算の1年間。業績は、売上や利益の成績']
      .map((t, i) => E.div(g, { left: 300, top: 520 + i * 64, font: '800 32px/1.3 Round', color: '#f3e6c8', whiteSpace: 'nowrap' }, t).ini({ o: 0 }));
    const gen = E.div(g, { left: 260, top: 790, width: 1400, textAlign: 'right', font: '800 22px/1.3 Round', color: 'rgba(243,230,200,.8)', whiteSpace: 'nowrap' }, '一般的な説明').ini({ o: 0 });
    E.show(defs[0], .3, .2); E.show(gen, .3, .2);
    E.say('hat', 'M&Aは、会社や事業を、買ったり、売ったりすることだ。', { yomi: 'エムアンドエーは、会社や事業を、買ったり、売ったりすることだ。' });
    E.show(defs[1], .3, .2);
    E.say('hat', 'マッチングは、売りたい人と、買いたい人を、引き合わせることだ。');
    E.say('hat', 'サービスは、カードにある、使用許諾契約で、展開する。', { yomi: 'サービスは、カードにある、しようきょだくけいやくで、展開する。' });
    E.show(defs[2], .3, .2);
    E.say('hat', '使用許諾契約は、ある権利などを、使ってよいと、認める契約だ。', { yomi: 'しようきょだくけいやくは、ある権利などを、使ってよいと、認める契約だ。' });
    E.say('hat', '当期の業績への影響は、軽い、という会社の見込みだ。');
    E.show(defs[3], .3, .2);
    E.say('hat', '当期は、今の決算の、1年間。業績は、売上や利益の、成績のことだ。', { yomi: 'とうきは、今の決算の、いちねんかん。業績は、売上や利益の、成績のことだ。' });
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
    const L = E.say('hat', '元資料によると、新しい事業の発表のあとも、株価は、高値を切り下げた。', { wait: false });
    E.tw(tl, 1.6, { draw: [0, 1] }, 'inOut', .2); E.sfx('slide', { delay: .2, gain: .5 });
    E.show(lab, .3, L.dur * .5);
    E.at(L.end);
    E.say('hat', '高値の切り下げは、山のてっぺんの値段が、前の山より、低くなっていくことだ。', { yomi: 'たかねの切り下げは、山のてっぺんの値段が、前の山より、低くなっていくことだ。' });
    E.say('hat', '赤い線は、7月から9月の、高値をつないだ線だ。右に行くほど、下がっている。', { yomi: '赤い線は、7月から9月の、たかねを、つないだ線だ。右に行くほど、下がっている。' });
    E.wait(.6);
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
    E.say('hat', 'これを、株式の分割という。会社の中身は、そのままで、株の数だけが増える。', { yomi: 'これを、かぶしきの、ぶんかつという。会社の中身は、そのままで、株の数だけが増える。' });
    E.say('hat', '発行済株式は、会社が出している、株の全部の数だ。', { yomi: 'はっこうずみかぶしきは、会社が出している、株の全部の数だ。' });
    const n1 = box(g, { x: 360, y: 520, w: 460, h: 200, top: '発行済株式（分割前）', main: '188.4万株' });
    const n2 = box(g, { x: 1100, y: 520, w: 460, h: 200, top: '分割後', main: '565.2万株', c: '#2b68d8' });
    const x3 = E.div(g, { left: 840, top: 570, width: 240, textAlign: 'center', font: '900 64px/1.2 Zen', color: '#ffd84a' }, '× 3').ini({ o: 0 });
    const L = E.say('hat', '株の数は、188.4万株から、565.2万株になる。', { wait: false, yomi: '株の数は、ひゃくはちじゅうはってんよんまんかぶから、ごひゃくろくじゅうごてんにまんかぶになる。' });
    E.tw(n1, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2 });
    E.show(x3, .3, L.dur * .45);
    E.tw(n2, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .55); E.sfx('cash', { delay: L.dur * .55, gain: .5 });
    E.at(L.end);
    E.say('hat', '基準日は、10月23日。この日の株主名簿に載っている株が、分割の対象になる。', { yomi: 'きじゅんびは、10月23日。この日の、かぶぬしめいぼに載っている株が、分割の対象になる。' });
    E.say('hat', '実際に、株が3株に分かれるのは、10月24日。これを、効力発生という。', { yomi: 'じっさいに、株が、さんかぶに分かれるのは、10月24日。これを、こうりょくはっせいという。' });
    E.wait(.3);
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
    const rule = E.div(sc.root, { left: 330, top: 676, width: 1230, height: 144, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', font: '900 34px/1.2 Zen', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' },
      '<span>10月21日までは、値段を<b style="color:#c62828">3で割り</b>、出来高を<b style="color:#2b68d8">3倍</b>にした</span><span style="color:#6a6066">10月22日からは、値段も出来高も、そのまま</span>').ini({ o: 0 });
    E.wait(1.2);
    E.say('hat', '株を買ってから、株主名簿に載るまでには、取引のある日で、2日かかる。', { yomi: '株を買ってから、かぶぬしめいぼに載るまでには、取引のある日で、ふつか、かかる。' });
    E.say('hat', 'だから、10月22日からは、買っても、基準日の名簿に、間に合わない。', { yomi: 'だから、10月22日からは、買っても、きじゅんびの名簿に、間に合わない。' });
    E.say('hat', 'この日から、値段は、分けたあとの単位で付いた。これを、権利落ちという。', { yomi: 'この日から、値段は、分けたあとの、たんいで付いた。これを、けんりおちという。' });
    let L = E.say('hat', 'このチャートは、10月21日までの値段を、3で割って、あとの値段と、つないである。', { wait: false });
    E.tw(rule, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .5); E.sfx('ding', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    E.say('hat', '出来高は、売り買いが成立した、株の数だ。前の1株は、今の3株にあたる。', { yomi: 'できだかは、売り買いが成立した、株の数だ。前の、いっかぶは、今の、さんかぶにあたる。' });
    E.say('hat', 'だから、10月21日までの出来高は、3倍にしてある。', { yomi: 'だから、10月21日までの、できだかは、さんばいにしてある。' });
    E.say('hat', '割らずに並べると、10月22日を境に、暴落したように、見えてしまう。', { yomi: 'わらずに並べると、10月22日を、さかいに、暴落したように、見えてしまう。' });
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
    E.say('hat', '固定は、返し終わるまで、金利が変わらない、という意味だ。');
    E.say('hat', '借りたお金の使い道は、設備の購入などだ。');
    k.forEach(n => E.hide(n, .3));
    const money = box(g, { x: 260, y: 470, w: 460, h: 220, top: '借りたお金', main: '3.8億円', c: '#2b68d8' });
    const no1 = box(g, { x: 840, y: 470, w: 380, h: 220, top: '借りたお金は', main: '売上ではない', c: '#262236' });
    const no2 = box(g, { x: 1280, y: 470, w: 380, h: 220, top: '自己資本は', main: '増えない', c: '#262236' });
    E.wait(.3);
    L = E.say('hat', '元資料の読み方では、借入は、事業に使うお金を集める、資金調達だ。', { wait: false, yomi: '元資料の読み方では、かりいれは、事業に使うお金を集める、しきんちょうたつだ。' });
    E.tw(money, .4, { o: [0, 1], y: [20, 0] }, 'back', .1); E.sfx('cash', { delay: .1, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '借りたお金は、売上ではない。売上は、商品やサービスを売って、得るお金だ。', { wait: false });
    E.tw(no1, .4, { o: [0, 1], y: [20, 0] }, 'back', .1);
    E.at(L.end);
    L = E.say('hat', '自己資本が、増えたのでもない。', { wait: false });
    E.tw(no2, .4, { o: [0, 1], y: [20, 0] }, 'back', .1);
    E.at(L.end);
    E.say('hat', '自己資本は、会社の持ち物から、借りているものを、引いた残りだ。');
    E.say('hat', 'お金を借りると、手元のお金は、増える。でも、同じだけ、返す義務も増える。');
    E.say('hat', 'だから、差し引きの、自己資本は、増えない。返す約束のある、お金だ。');
    E.wait(.4);
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
    const dd = panel(g, { x: 260, y: 560, w: 1400, h: 100, size: 30, dark: true, html: '<span>債務超過は、会社の持ち物を全部足しても、借りているものに足りない状態（一般的な説明）</span>' });
    E.tw(dd, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('pop', { delay: .3 });
    E.say('hat', '債務超過は、会社の持ち物を全部足しても、借りているものに、足りない状態だ。');
    E.say('hat', 'エスポアは、2025年4月に、債務超過を公表していた。');
    E.say('hat', '5月29日には、それを解消するための、計画を出している。第3章で見た話だ。');
    E.hide(dd, .3);
    const loss = box(g, { x: 360, y: 560, w: 520, h: 200, top: '中間期の営業損失', main: '8,250万円', c: '#c62828' });
    const plan = box(g, { x: 1040, y: 560, w: 520, h: 200, top: '8月をめどの利益計画', main: 'まだ策定中', c: '#b8651a' });
    E.say('hat', '中間期は、決算の1年のうち、前半の半年のことだ。', { yomi: 'ちゅうかんきは、決算の、いちねんのうち、前半の半年のことだ。' });
    let L = E.say('hat', '営業損失は、本業で出た赤字だ。中間期の営業損失は、8,250万円。', { wait: false, yomi: 'えいぎょうそんしつは、本業で出た赤字だ。ちゅうかんきの、えいぎょうそんしつは、ハッセンニヒャクゴジュウまんえん。' });
    E.tw(loss, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .5); E.sfx('drop', { delay: L.dur * .5 + .1, gain: .5 });
    E.at(L.end);
    E.say('hat', '蓄電池の開発や、資本の増強の、話し合いを進める、とも報告した。', { yomi: 'ちくでんちの開発や、資本の増強の、話し合いを進める、とも報告した。' });
    E.say('hat', '資本の増強は、新しい株を出すなどして、自己資本を増やすことだ。');
    E.say('hat', 'もともと、利益の計画は、8月をめどに、作るとしていた。');
    L = E.say('hat', 'でも、10月15日の報告でも、まだ作っている途中だ、という説明だった。', { wait: false });
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
    E.say('hat', '包括的な合意は、細かい契約の前に、協業の、大きな枠組みを、決めておく合意だ。', { yomi: 'ほうかつてきな合意は、細かい契約の前に、きょうぎょうの、大きな枠組みを、決めておく合意だ。' });
    E.say('hat', '協業は、ほかの会社と組んで、一緒に事業をすることだ。', { yomi: 'きょうぎょうは、ほかの会社と組んで、一緒に事業をすることだ。' });
    const goal = box(g, { x: 260, y: 470, w: 640, h: 220, top: '2026年末までの目標', main: '80MWh・約10か所', c: '#2b68d8' });
    const each = box(g, { x: 1020, y: 470, w: 640, h: 220, top: '一つ一つの案件の契約', main: 'これから順に協議', c: '#b8651a' });
    let L = E.say('hat', '目標は、2026年の末までに、少なくとも80メガワットアワー。', { wait: false, yomi: '目標は、2026年の末までに、少なくとも、ハチジューメガワットアワー。' });
    E.tw(goal, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .4); E.sfx('pop', { delay: L.dur * .4 });
    E.at(L.end);
    E.say('hat', 'およそ10か所で、蓄電池の、販売と設置を、目指す。', { yomi: 'およそ、じっかしょで、ちくでんちの、販売と設置を、目指す。' });
    L = E.say('hat', '一つ一つの案件の契約は、これから順に話し合う。', { wait: false });
    E.tw(each, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2 });
    E.at(L.end);
    E.say('hat', 'この発表の時点では、一つ一つの契約は、これから決める段階だった。');
    const unit = panel(g, { x: 160, y: 740, w: 1400, h: 90, size: 30, dark: true, html: 'MWh（メガワットアワー）は、蓄電池がためられる、電気の量の単位（一般的な説明）' });
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
    E.narr('次の日、11月14日の、11時36分。昼休みに、ある有名投資家の投稿があった。', { yomi: '次の日、11月14日の、11時36分。ひるやすみに、ある有名投資家の投稿があった。' });
    E.say('hat', '会社の発表は、前の日の16時30分。投稿は、その次の日の、昼だ。');
    E.say('hat', '昼休みは、午前と午後の取引の、間の時間だ。この間は、売り買いが止まっている。', { yomi: 'ひるやすみは、午前と午後の取引の、あいだの時間だ。このあいだは、売り買いが止まっている。' });
    E.say('hat', '元資料の要約では、蓄電池の案件の金額を、65億円に訂正した投稿だ。', { yomi: '元資料の要約では、ちくでんちの案件の金額を、ろくじゅうごおくえんに、訂正した投稿だ。' });
    E.say('hat', 'いくらから、65億円に直したのかは、元資料の要約には、書かれていない。', { yomi: 'いくらから、ろくじゅうごおくえんに直したのかは、もとしりょうの要約には、書かれていない。' });
    const pr = panel(g, { x: 300, y: 620, w: 1320, h: 84, size: 28, dark: true, html: '<span>会社のPRは、11月14日にエスポアが出した、Sigenergy Japanとの包括基本合意の発表</span>' });
    const em = panel(g, { x: 300, y: 724, w: 1320, h: 84, size: 28, html: '<span>販売見込金額は、売れた時に、これだけの金額になると見込んだ数字（一般的な説明）</span>' });
    E.say('hat', '元資料によると、この訂正は、11月14日に会社が出した、PRに関わる話だ。', { yomi: '元資料によると、この訂正は、11月14日に会社が出した、ピーアールに関わる話だ。' });
    E.tw(pr, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2 });
    E.say('hat', 'このPRは、エスポアが出した、Sigenergy Japanとの、包括基本合意の発表だ。', { yomi: 'このピーアールは、エスポアが出した、シグエナジー、ジャパンとの、ほうかつきほんごういの発表だ。' });
    E.say('hat', '元資料が、そのPRで確かめると、65億円は、80MWhの案件の、販売見込金額だった。', { yomi: 'もとしりょうが、そのピーアールで確かめると、ろくじゅうごおくえんは、ハチジューメガワットアワーの案件の、販売見込金額だった。' });
    E.tw(em, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2 });
    E.say('hat', '販売見込金額は、売れた時に、これだけの金額になる、と見込んだ数字だ。', { yomi: 'はんばいみこみきんがくは、売れた時に、これだけの金額になる、と見込んだ数字だ。' });
    E.wait(.2);
  });

  E.scene({ name: 'not_sales' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '65億円は、何の数字か', 44);
    E.show(tt, .3);
    const goal = box(g, { x: 160, y: 220, w: 560, h: 200, top: '目標', main: '80MWh・約10か所', c: '#2b68d8' });
    const est = box(g, { x: 900, y: 220, w: 640, h: 200, top: 'その案件の、会社PRの販売見込金額', main: '65億円', c: '#2b68d8', border: '6px solid #2b68d8' });
    const arr = E.div(g, { left: 740, top: 270, width: 140, textAlign: 'center', font: '900 70px/1 Zen', color: '#ffd84a' }, '→').ini({ o: 0 });
    const s1 = box(g, { x: 360, y: 520, w: 520, h: 200, top: '65億円は', main: '確定した売上ではない' });
    const s2 = box(g, { x: 1040, y: 520, w: 520, h: 200, top: '65億円は', main: '当期の利益でもない' });
    E.wait(.3);
    let L = E.say('hat', '左は、目標。80MWh、およそ10か所の、販売と設置だ。', { wait: false, yomi: 'ひだりは、目標。ハチジューメガワットアワー、およそ、じっかしょの、販売と設置だ。' });
    E.tw(goal, .4, { o: [0, 1], y: [20, 0] }, 'back', .1); E.sfx('pop', { delay: .1 });
    E.at(L.end);
    L = E.say('hat', '右は、その案件の、販売見込金額。65億円だ。', { wait: false, yomi: 'みぎは、その案件の、販売見込金額。ろくじゅうごおくえんだ。' });
    E.show(arr, .3, .1);
    E.tw(est, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('pop', { delay: .3 });
    E.at(L.end + .3);
    L = E.say('hat', '検証メモのとおり、65億円は、確定した売上ではない。', { wait: false, yomi: 'けんしょうメモのとおり、ろくじゅうごおくえんは、確定した売上ではない。' });
    E.tw(s1, .4, { o: [0, 1], y: [20, 0] }, 'back', .1);
    E.at(L.end);
    E.say('hat', '売上は、実際に売れて、決算の数字に入れて、初めて売上になる。');
    E.say('hat', '決算の数字に入れることを、計上という。', { yomi: '決算の数字に入れることを、けいじょうという。' });
    E.say('hat', '前の日の発表では、一つ一つの案件の契約は、これから順に話し合う、とされていた。');
    E.say('hat', '契約が、これから決まる段階なので、65億円は、計上された売上ではない。', { yomi: '契約が、これから決まる段階なので、ろくじゅうごおくえんは、けいじょうされた売上ではない。' });
    L = E.say('hat', '当期の利益でもない。利益は、売上から、かかったお金を、引いた残りだ。', { wait: false, yomi: 'とうきの利益でもない。利益は、売上から、かかったお金を、引いた残りだ。' });
    E.tw(s2, .4, { o: [0, 1], y: [20, 0] }, 'back', .1);
    E.at(L.end);
    E.say('hat', '65億円は、売れた時の金額の見込みで、かかるお金を、引く前の数字だ。', { yomi: 'ろくじゅうごおくえんは、売れた時の金額の見込みで、かかるお金を、引く前の数字だ。' });
    const call = P.eveCall(g, ['normal', 'surprise'], { x: 1590, y: 560, w: 300, h: 240 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '65億円って、もう入ってきたお金じゃないんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: 'ろくじゅうごおくえんって、もう入ってきたお金じゃないんだねー。' });
    E.say('hat', 'そうだ。目標や見込みは、これから目指す数字だ。');
    E.say('hat', '計上された売上は、もう売れて、決算に入った数字だ。', { yomi: 'けいじょうされた売上は、もう売れて、決算に入った数字だ。' });
    E.say('hat', 'だから、目標や見込みと、計上された売上を、混ぜずに、分けて読む。', { yomi: 'だから、目標や見込みと、けいじょうされた売上を、混ぜずに、分けて読む。' });
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
    E.say('hat', '元資料は、この投稿のあと、株価が上がり続けたかどうかを、確かめている。');
    let L = E.say('hat', '11月の終値は、797円。12月の終値は、680円だ。', { wait: false, yomi: '11月の、おわりねは、ななひゃくきゅうじゅうななえん。12月の、おわりねは、ろっぴゃくはちじゅうえんだ。' });
    P.circle(g, { x: a.x, y: a.y, w: 30, h: 30, sw: 4, delay: .2, dur: .3 }); E.pop(la, .3, .3);
    P.circle(g, { x: b.x, y: b.y, w: 30, h: 30, sw: 4, delay: L.dur * .55, dur: .3 }); E.pop(lb, .3, L.dur * .6);
    E.at(L.end);
    E.say('hat', '月の終値は、その月の、最後の取引日の値段だ。', { yomi: 'つきの、おわりねは、その月の、最後の取引日の値段だ。' });
    E.say('hat', '12月の終値は、11月の終値より、低い。', { yomi: '12月の、おわりねは、11月の、おわりねより、低い。' });
    E.say('hat', 'だから、元資料は、上がり続けた、とは確認できない、としている。');
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
    const L = E.narr('蓄電池の事業、3.8億円の借入、Sigenergyとの協業。', { wait: false, yomi: 'ちくでんちの事業、サンテンハチおくえんの、かりいれ、シグエナジーとの、きょうぎょう。' });
    tags.forEach((t, i) => { E.pop(t, .35, .2 + i * L.dur * .3, .5); E.sfx('pop', { delay: .2 + i * L.dur * .3, gain: .4 }); E.float(t, 6, 1.6, i); });
    E.at(L.end);
    E.narr('80MWhの目標に、65億円という金額。大きな数字が、続いた。', { yomi: 'ハチジューメガワットアワーの目標に、ろくじゅうごおくえんという金額。大きな数字が、続いた。' });
    const L2 = E.narr('でも、借りたお金も、目標も、見込みの金額も、売れて決算に入った、売上ではなかった。', { wait: false });
    E.tw(no, .35, { o: [0, 1], s: [1.4, 1] }, 'in2', L2.dur * .7); E.sfx('stamp', { delay: L2.dur * .7 + .2, gain: .6 });
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
    const chips = [['65億円は、販売見込金額', 330], ['3.8億円は、借りたお金', 470], ['80MWhは、販売と設置の目標', 610]].map(([t, y]) => E.div(paper, { left: 120, top: y, width: 560, height: 92, borderRadius: 14, background: '#fffaf0', border: '3px solid #8a7050', textAlign: 'center', font: '900 36px/86px Zen', color: '#3a3236', whiteSpace: 'nowrap', boxShadow: '0 6px 12px rgba(0,0,0,.18)' }, t).ini({ o: 0 }));
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
