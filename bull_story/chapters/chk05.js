// 完全版 第5章「増資の決議と払込」（2026年1〜2月）
// 台本: story/k/k05_増資の決議と払込.md　元資料 p6・p11・p12・p18・p19・p20・p27・p28・p39
// 投稿は元資料の要約（本人の見解）。有名投資家の名前・アカウントは出さない。割当先は「個人1名」。
// 増資（I24→I28）と成功報酬契約（I25・I26）は別の場面にし、比べたり矢印で結んだりしない
'use strict';
E.chapter('k05');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;
  const bar = (g, from, to) => P.monthBar(g, { year: 2026, start: 1, months: 2, from, to, x: 460, w: 1000 });
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const box = (g, { x, y, w = 380, h = 200, top = '', main = '', c = '#262236', bg = 'rgba(255,255,255,.95)', border = 'none', size = 46 }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: bg, border, boxShadow: '0 12px 24px rgba(0,0,0,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
    `<div style="font:800 28px/1.3 Round;color:#6a6066">${top}</div><div style="font:900 ${size}px/1.35 Zen;color:${c};white-space:nowrap">${main}</div>`).ini({ o: 0 });
  const rise = (n, d = 0) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', d); E.sfx('pop', { delay: d, gain: .5 }); };

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

  /* ============================================================ S0 アバン：2026年1月 */
  E.scene({ name: 'avant_room' }, sc => {
    const g = sc.cam;
    E.bgm('daily', { fadeIn: 1.0, gain: .7 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    const tag = E.div(g, { left: 120, top: 120, padding: '10px 28px', borderRadius: 14, background: 'rgba(255,255,255,.9)', color: '#2a2430', font: '900 38px/1.3 Zen', boxShadow: '0 8px 18px rgba(0,0,0,.2)' }, '2026年1月').ini({ o: 0 });
    E.pop(tag, .4, .3);
    const wrap = E.div(g, { left: 1240, top: -60, width: 820, height: 650 }).ini({ s: .5, o: 0, r: 3 });
    const cal = P.calendar(wrap, { x: 0, y: 0, w: 820, year: 2026, month: 2 });
    const p28 = cal.pos(28);
    const lab = E.div(g, { left: 1360, top: 300, padding: '6px 18px', borderRadius: 12, background: '#c62828', font: '900 28px/1.3 Zen', color: '#fff', whiteSpace: 'nowrap' }, '2/28 改善期間の終わり').ini({ o: 0 });
    P.look(sc.cam, { s: 1.15, cx: 1150, cy: 430, dur: 6, delay: .3 });
    E.wait(.6);
    E.narr('2026年1月。エスポアは、まだ、債務超過だった。');
    E.narr('債務超過は、会社の持ち物を全部足しても、借りているものに、足りない状態だ。');
    E.narr('改善期間は、債務超過を、解消するための期間。2025年3月1日に、始まっていた。');
    const L = E.narr('改善期間の終わりは、2026年2月28日。', { wait: false });
    E.tw(wrap, .45, { o: [0, 1], y: [-40, 0] }, 'back', .2); E.sfx('page', { delay: .2, gain: .6 });
    P.circle(wrap, { x: p28.x, y: p28.y, w: 110, h: 84, sw: 9, delay: L.dur * .55, dur: .35 });
    E.show(lab, .3, L.dur * .7);
    E.at(L.end);
    E.narr('そこへ、増資の発表が来る。');
    E.wait(.3);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 5, title: '増資の決議と払込', sub: '2026年1月〜2月', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 日足 */
  E.scene({ name: 'daily' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const C = P.chart(g, CHART('06'), { x: 80, y: 150, w: 1760 });
    E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '日足　2026年1月〜4月20日（25・75・200日線）');
    P.note(sc.root, '分割後の値段（元資料 p6）', { x: 1540, y: 896, size: 22, dark: true });
    C.draw(3.0, .3);
    E.wait(1.0);
    E.say('hat', 'これが、2026年1月から4月の日足だ。');
    E.say('hat', '日足は、1日の値動きを、1本のローソク足にした、チャートだ。', { yomi: 'ひあしは、いちにちの値動きを、いっぽんの、ローソク足にした、チャートだ。' });
    E.say('hat', '線は、25日、75日、200日の、終値の平均を、つないだものだ。', { yomi: 'せんは、にじゅうごにち、ななじゅうごにち、にひゃくにちの、おわりねの平均を、つないだものだ。' });
    E.say('hat', '終値は、その日の取引で、最後に付いた値段だ。', { yomi: 'おわりねは、その日の取引で、最後に付いた値段だ。' });
    E.say('hat', 'エスポアは、2025年10月に、1株を3株に分けた。この値段は、分けたあとのものだ。', { yomi: 'エスポアは、2025年10月に、いっかぶを、さんかぶに分けた。この値段は、分けたあとのものだ。' });
    const L = E.say('hat', 'この章では、1月と2月を見る。', { wait: false });
    P.look(sc.cam, { s: 1.45, cx: C.at(760, 0).x, cy: C.at(0, 480).y, dur: 1.4, delay: .2 });
    E.at(L.end + .8);
  });

  /* ============================================================ S3 I23　1月14日 */
  E.scene({ name: 'i23' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [1, 1], [1, 14]);
    const i23 = P.icard(g, { id: 'I23', when: '2026/1/14 15:30', session: '引け後', title: '第3四半期も債務超過', text: '当時の第3四半期短信は売上2.77億円、営業損失1.11億円、<br>純資産マイナス1.64億円', note: '当期予想は未開示。債務超過解消計画の進捗も同時公表', x: 260, y: 120, w: 1400, size: 32 });
    E.tw(i23, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '1月14日、引け後。第3四半期の決算が出た。', { yomi: '1月14日、ひけご。第3四半期の決算が出た。' });
    E.say('hat', '引け後は、その日の取引が、終わったあと、という意味だ。', { yomi: 'ひけごは、その日の取引が、終わったあと、という意味だ。' });
    E.say('hat', 'エスポアの決算の1年は、3月に始まって、次の年の2月末に終わる。', { yomi: 'エスポアの、決算の、いちねんは、3月に始まって、次の年の、2月末に終わる。' });
    E.say('hat', '第3四半期の決算は、その1年のうち、最初の9か月の、成績のまとめだ。', { yomi: 'だいさんしはんきの決算は、その、いちねんのうち、最初の、きゅうかげつの、成績のまとめだ。' });
    E.say('hat', '短信は、決算短信のことだ。決算の数字の要点を、早めにまとめて出す、発表だ。', { yomi: 'たんしんは、けっさんたんしんのことだ。決算の数字の要点を、早めにまとめて出す、発表だ。' });
    E.say('hat', '発表した当時の短信では、売上は、2.77億円だった。', { yomi: '発表した当時の、たんしんでは、うりあげは、におく、ななせんななひゃくまんえんだった。' });
    E.say('hat', '営業損失は、本業で出た赤字だ。それが、1.11億円あった。', { yomi: 'えいぎょうそんしつは、本業で出た赤字だ。それが、いちおく、いっせんひゃくまんえん、あった。' });
    E.say('hat', '当期は、今の決算の1年間のことだ。カードの当期予想は、この1年の予想だ。', { yomi: 'とうきは、今の決算の、いちねんかんのことだ。カードの、とうきよそうは、この、いちねんの予想だ。' });
    E.say('hat', '会社は、この1年の、売上や利益の予想を、まだ出していなかった。');
    E.say('hat', '同じ発表で、債務超過を解消する計画の、進み具合も、公表した。');
    E.say('hat', 'この計画は、2025年5月に、会社が出したものだ。第3章で見た。');
    E.tw(i23, .4, { o: 0, y: -30 }, 'in2');
    const zero = 360;
    const zl = E.div(g, { left: 300, top: zero - 3, width: 1320, height: 6, background: '#f3e6c8' }).ini({ o: 0 });
    const z0 = E.div(g, { left: 1640, top: zero - 18, font: '800 26px/1.2 Round', color: '#f3e6c8' }, '0').ini({ o: 0 });
    const nb1 = P.netBar(g, { x: 520, y0: zero, w: 260, scale: .025 });
    const nb2 = P.netBar(g, { x: 1120, y0: zero, w: 260, scale: .025 });
    nb1.val.ini({ o: 0 }); nb2.val.ini({ o: 0 });
    const h1 = E.div(g, { left: 420, top: 200, width: 460, textAlign: 'center', font: '900 32px/1.3 Zen', color: '#f3e6c8' }, '2025年2月末（第3章）').ini({ o: 0 });
    const h2 = E.div(g, { left: 1020, top: 200, width: 460, textAlign: 'center', font: '900 32px/1.3 Zen', color: '#f3e6c8' }, '第3四半期（当時の発表）').ini({ o: 0 });
    const v1 = E.div(g, { left: 400, top: zero + 4045.7 * .025 + 14, width: 500, textAlign: 'center', font: '900 50px/1.2 Noto', color: '#ff6b6b' }, '−4,045.7万円').ini({ o: 0 });
    const v2 = E.div(g, { left: 1000, top: zero + 16400 * .025 + 14, width: 500, textAlign: 'center', font: '900 50px/1.2 Noto', color: '#ff6b6b' }, '−1.64億円').ini({ o: 0 });
    const ttl = E.div(g, { left: 0, top: 130, width: W, textAlign: 'center', font: '900 40px/1.2 Zen', color: '#ffd84a' }, '純資産').ini({ o: 0 });
    [ttl, zl, z0, h1, h2].forEach((n, i) => E.show(n, .3, .2 + i * .05));
    E.say('hat', '純資産は、会社の持ち物から、借りているものを、引いた残りだ。', { delay: .6 });
    let L = E.say('hat', '左は、2025年2月末の純資産だ。マイナス4,045.7万円だった。', { wait: false, yomi: 'ひだりは、2025年2月末の、じゅんしさんだ。マイナス、ヨンセンヨンジューゴテンナナまんえんだった。' });
    E.tw(nb1, .8, { v: [0, -4045.7] }, 'out', .3); E.show(v1, .3, 1.0);
    E.at(L.end);
    L = E.say('hat', '右は、第3四半期。純資産は、マイナス1.64億円だ。', { wait: false, yomi: 'みぎは、だいさんしはんき。じゅんしさんは、マイナス、いちおく、ろくせんよんひゃくまんえんだ。' });
    E.tw(nb2, 1.0, { v: [0, -16400] }, 'out', .3); E.sfx('drop', { delay: 1.0, gain: .5 }); E.show(v2, .3, 1.3);
    E.at(L.end);
    E.say('hat', 'マイナスの幅は、広がっていた。純資産がマイナスだから、まだ、債務超過だ。');
    const call = P.eveCall(g, ['normal', 'anxious'], { x: 1600, y: 600, w: 290, h: 230 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '改善期間の終わりまで、あと1か月半なんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: '改善期間の終わりまで、あと、1か月半なんだねー。' });
    E.wait(.3);
  });

  /* ============================================================ S4 I24　2月12日 18:10 */
  E.scene({ name: 'i24' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .7 });
    P.slate(g);
    bar(g, [1, 14], [2, 12]);
    const i24 = P.icard(g, { id: 'I24', when: '2026/2/12 18:10', session: '引け後', title: '第三者割当増資を決議', text: '9万株を1株555円、総額4,995万円で個人1名に割当予定。<br>発行済株式に対する比率1.59%', note: '増資額だけで期末損益まで確定するものではない', x: 260, y: 120, w: 1400, size: 32 });
    E.tw(i24, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '2月12日、18時10分。会社は、第三者割当増資を決議した。', { yomi: '2月12日、18時10分。会社は、だいさんしゃわりあて、ぞうしを決議した。' });
    E.say('hat', '増資は、会社が、新しい株を出して、お金を集めることだ。', { yomi: 'ぞうしは、会社が、新しい株を出して、お金を集めることだ。' });
    E.say('hat', '決議は、会社として、正式に決めることだ。', { yomi: 'けつぎは、会社として、正式に決めることだ。' });
    E.tw(i24, .4, { o: 0, y: -30 }, 'in2');
    // 第三者割当の図
    const tt = E.div(g, { left: 0, top: 130, width: W, textAlign: 'center', font: '900 44px/1.2 Zen', color: '#f3e6c8' }, '第三者割当（しくみの図）').ini({ o: 0 });
    const co = P.building(g, { x: 300, y: 270, w: 260, h: 330, label: '会社' }).ini({ o: 0 });
    const ps = E.svg(g, { left: 1360, top: 300, width: 220, height: 250 }, '0 0 100 112', '<circle cx="50" cy="32" r="22" fill="#e0a96d"/><path d="M10 112 Q12 62 50 60 Q88 62 90 112Z" fill="#e0a96d"/>').ini({ o: 0 });
    const psl = E.div(g, { left: 1270, top: 570, width: 400, textAlign: 'center', font: '900 36px/1.3 Zen', color: '#f3e6c8' }, '決まった相手').ini({ o: 0 });
    const a1 = P.arrow(g, { x1: 600, y1: 380, x2: 1330, y2: 380, color: '#ffd84a', sw: 10, bend: -30 });
    const l1 = E.div(g, { left: 760, top: 290, width: 400, textAlign: 'center', font: '900 32px/1.2 Zen', color: '#ffd84a' }, '新しい株').ini({ o: 0 });
    const a2 = P.arrow(g, { x1: 1330, y1: 520, x2: 600, y2: 520, color: '#7fe0a8', sw: 10, bend: -30 });
    const l2 = E.div(g, { left: 710, top: 560, width: 500, textAlign: 'center', font: '900 32px/1.2 Zen', color: '#7fe0a8' }, 'お金（会社の資本が増える）').ini({ o: 0 });
    let L = E.say('hat', '第三者割当は、決まった相手に、新しい株を買ってもらって、資本を増やすやり方だ。', { wait: false, yomi: 'だいさんしゃわりあては、決まった相手に、新しい株を買ってもらって、資本を増やすやり方だ。' });
    E.show(tt, .3, .1); E.show(co, .4, .2); E.show(ps, .4, .4); E.show(psl, .3, .5);
    P.drawArrow(a1, .5, L.dur * .35); E.show(l1, .3, L.dur * .4);
    P.drawArrow(a2, .5, L.dur * .6); E.show(l2, .3, L.dur * .65);
    E.at(L.end);
    E.say('hat', '資本は、会社の元手になるお金だ。借りたお金と違って、返す約束はない。', { yomi: 'しほんは、会社の、もとでになるお金だ。借りたお金と違って、返す約束はない。' });
    [tt, co, ps, psl, a1, a1.head, l1, a2, a2.head, l2].forEach(n => E.hide(n, .3));
    const calc = panel(g, { x: 260, y: 220, w: 1400, h: 150, size: 58, html: '<span style="font-family:Noto">90,000株</span><span>×</span><span style="font-family:Noto">555円</span><span>＝</span><span style="font-family:Noto;color:#2b68d8">49,950,000円</span>' });
    L = E.say('hat', '新しく出す株は、9万株。1株の値段は、555円だ。', { wait: false, delay: .3, yomi: '新しく出す株は、きゅうまんかぶ。ひとかぶの値段は、ごひゃくごじゅうごえんだ。' });
    E.tw(calc, .45, { o: [0, 1], s: [.9, 1] }, 'back', .1);
    E.at(L.end);
    L = E.say('hat', '9万株に、555円をかけると、合わせて、4,995万円になる。', { wait: false, yomi: 'きゅうまんかぶに、ごひゃくごじゅうごえんをかけると、合わせて、よんせんきゅうひゃくきゅうじゅうごまんえんになる。' });
    E.sfx('cash', { delay: L.dur * .6, gain: .5 });
    E.at(L.end);
    const who = box(g, { x: 360, y: 430, w: 560, h: 180, top: '割り当てる相手', main: '個人1名' });
    const pct = box(g, { x: 1000, y: 430, w: 560, h: 180, top: '発行済株式に対する比率', main: '1.59％', c: '#2b68d8' });
    L = E.say('hat', '割り当てる相手は、個人1名だ。', { wait: false, yomi: '割り当てる相手は、こじん、いちめいだ。' });
    rise(who, .2);
    E.at(L.end);
    E.say('hat', '発行済株式は、会社が、すでに出している、株の全部の数だ。', { yomi: '発行済株式は、会社が、すでに出している、株の全部の数だ。' });
    L = E.say('hat', '新しい9万株は、その1.59％にあたる。', { wait: false, yomi: '新しい、きゅうまんかぶは、その、イッテンゴキューパーセントにあたる。' });
    rise(pct, .2);
    E.at(L.end);
    const other = E.div(g, { left: 460, top: 670, width: 1000, height: 90, borderRadius: 18, border: '3px dashed rgba(243,230,200,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 30px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '同じ 18:10 に、別の開示（I25）も出ていた。別の場面で見る').ini({ o: 0 });
    L = E.say('hat', '同じ18時10分には、別の開示も出ていた。それは、別の場面で見る。', { wait: false });
    E.show(other, .4, .3);
    E.at(L.end + .4);
  });

  /* ============================================================ S5 T15　2月13日 8:06 */
  E.scene({ name: 't15' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [2, 12], [2, 13]);
    const tl = P.timeLink(g, { x: 260, y: 150, w: 1400, a: { id: 'I24', time: '2/12 18:10', sub: '会社の開示（引け後）', color: P.I_ORANGE }, b: { id: 'T15', time: '2/13 8:06', sub: '投稿（寄り前）', color: P.T_BLUE }, label: '翌朝' });
    tl.in(.2);
    const t15 = P.tcard(g, { id: 'T15', when: '2026/2/13 8:06', kind: '財務', session: '寄り前', text: '5,000万円の引受けで債務超過解消を見込む', note: 'サムライカーボンへの言及。投稿は2月13日8時06分。解消確定の監査意見ではない', x: 300, y: 330, w: 1320, size: 40 });
    E.tw(t15, .45, { o: [0, 1], y: [30, 0] }, 'back', 1.3); E.sfx('notify', { delay: 1.3 });
    E.wait(1.7);
    E.narr('翌朝、2月13日の、8時06分。ある有名投資家の投稿があった。', { yomi: '翌朝、2月13日の、8時6分。ある有名投資家の投稿があった。' });
    E.say('hat', '会社の増資の開示は、前の日の、18時10分。取引が終わった、あとだった。', { yomi: '会社の、ぞうしの開示は、前の日の、18時10分。取引が終わった、あとだった。' });
    E.say('hat', '投稿は、次の日の、寄り前だ。寄り前は、その日の取引が、始まる前のことだ。', { yomi: '投稿は、次の日の、よりまえだ。よりまえは、その日の取引が、始まる前のことだ。' });
    E.say('hat', '元資料の要約では、5,000万円の引受けで、債務超過が解消する、という見方の投稿だ。', { yomi: '元資料の要約では、ごせんまんえんの、ひきうけで、債務超過が解消する、という見方の投稿だ。' });
    E.say('hat', '引受けは、会社が新しく出す株を、買うと約束することだ。', { yomi: 'ひきうけは、会社が新しく出す株を、買うと約束することだ。' });
    E.say('hat', '実際にお金を払うのは、払込みといって、そのあとの段階になる。', { yomi: '実際にお金を払うのは、はらいこみといって、そのあとの段階になる。' });
    E.say('hat', '元資料の検証メモは、この投稿が、サムライカーボンに、触れている、としている。');
    E.say('hat', 'どのように触れたかは、元資料の要約には、書かれていない。');
    E.say('hat', '投稿の時刻も、2月13日の、8時06分と、確かめている。', { yomi: '投稿の時刻も、2月13日の、8時6分と、確かめている。' });
    E.say('hat', '検証メモの最後には、解消確定の監査意見ではない、とある。', { yomi: 'けんしょうメモの最後には、解消、確定の、監査意見ではない、とある。' });
    E.say('hat', '監査は、会社の外の監査人が、決算の数字を調べて、意見を出すことだ。');
    E.say('hat', '期末は、決算の1年の、最後の日だ。この期の期末は、2026年2月末だ。', { yomi: 'きまつは、決算の、いちねんの、最後の日だ。この期の、きまつは、2026年2月末だ。' });
    const pre = panel(g, { x: 260, y: 640, w: 1400, h: 100, size: 32, dark: true, html: '投稿の2月13日は、期末の2月末より前。期末の決算も、監査の意見も、まだ出ていない' });
    let Lp = E.say('hat', '投稿の2月13日は、まだ、期末の前だ。', { wait: false, yomi: '投稿の、2月13日は、まだ、きまつの前だ。' });
    E.tw(pre, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2, gain: .4 });
    E.at(Lp.end);
    E.say('hat', '投稿の時点で、期末の決算も、監査の意見も、まだ出ていなかった。', { yomi: '投稿の時点で、きまつの決算も、監査の意見も、まだ出ていなかった。' });
    E.hide(pre, .3);
    const m = P.mark(g, '本人の見込み', { x: 360, y: 640, color: P.T_BLUE, size: .75, rot: -6 });
    const no = panel(g, { x: 900, y: 650, w: 760, h: 110, size: 32, html: '解消を確かめた、監査の意見ではない' });
    const L = E.say('hat', 'これは、本人の見込みだ。債務超過が解消したと確かめる、監査の意見ではない。', { wait: false });
    P.stampIn(m, .4);
    E.tw(no, .4, { o: [0, 1], x: [40, 0] }, 'back', L.dur * .5); E.sfx('slide', { delay: L.dur * .5 });
    E.at(L.end + .3);
  });

  E.scene({ name: 'equation' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '期末の純資産は、どう決まるか', 44);
    E.show(tt, .3);
    const parts = [['期末の純資産', '#ffd84a', '#2a2430'], ['＝', null], ['前の期末', '#fff', '#262236'], ['＋', null], ['増資', '#fff', '#2b68d8'], ['＋', null], ['その期の損益', '#fff', '#c62828']];
    let x = 120;
    const nodes = parts.map(([t, bg, c]) => {
      const w = bg ? 40 * t.length + 80 : 80;
      const n = bg ? E.div(g, { left: x, top: 400, width: w, height: 140, borderRadius: 24, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 48px/1 Zen', color: c, boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, t).ini({ o: 0 })
        : E.div(g, { left: x, top: 420, width: w, textAlign: 'center', font: '900 70px/1.4 Zen', color: '#ffd84a' }, t).ini({ o: 0 });
      x += w + 16; return n;
    });
    const note = E.div(g, { left: 0, top: 600, width: W, textAlign: 'center', font: '800 28px/1.5 Round', color: 'rgba(243,230,200,.85)' }, '損益がマイナスなら、増資で増えた分は、それだけ減る（一般的な説明）').ini({ o: 0 });
    E.wait(.3);
    E.say('hat', '元資料は、I24について、増資の額だけで期末の損益まで確定しない、と書いている。', { yomi: 'もとしりょうは、アイにじゅうよんについて、ぞうしの額だけで、きまつの、そんえきまで、確定しない、と書いている。' });
    E.say('hat', '損益は、その1年で出た、利益か、損失のことだ。', { yomi: 'そんえきは、その、いちねんで出た、利益か、損失のことだ。' });
    let L = E.say('hat', '期末の純資産は、前の期末の純資産に、増資と、その期の損益を、足し引きして決まる。', { wait: false, yomi: 'きまつの純資産は、前の、きまつの純資産に、ぞうしと、その期の、そんえきを、たしひきして決まる。' });
    nodes.forEach((n, i) => { E.tw(n, .35, { o: [0, 1], y: [20, 0] }, 'back', .2 + i * L.dur * .11); E.sfx('pop', { delay: .2 + i * L.dur * .11, gain: .35 }); });
    E.at(L.end);
    L = E.say('hat', '損益がマイナスなら、増資で増えた分は、その分だけ、減ってしまう。', { wait: false, yomi: 'そんえきが、マイナスなら、ぞうしで増えた分は、その分だけ、減ってしまう。' });
    E.show(note, .4, L.dur * .3);
    E.at(L.end);
    E.say('hat', 'だから、増資の額だけを見ても、期末の純資産は、決まらない。', { yomi: 'だから、ぞうしの額だけを見ても、きまつの純資産は、決まらない。' });
    E.wait(.6);
  });

  /* ============================================================ S6 T16・T17　2月19日 */
  E.scene({ name: 't16t17' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [2, 13], [2, 19]);
    const ch = P.chain(g, { x: 360, y: 150, w: 1200, items: [{ id: 'T16', time: '15:22', sub: '投稿（取引時間内）', color: P.T_BLUE }, { id: 'T17', time: '15:24', sub: '投稿（取引時間内）', color: P.T_BLUE }], gaps: ['2分後'] });
    ch.in(0, .2);
    const t16 = P.tcard(g, { id: 'T16', when: '2026/2/19 15:22', kind: '需給', session: '取引時間内', text: 'エスポアの売却に否定的な発言', note: '独立した根拠はこの短文に記載されていない', x: 300, y: 330, w: 1320, size: 40 });
    E.tw(t16, .45, { o: [0, 1], y: [30, 0] }, 'back', .8); E.sfx('notify', { delay: .8 });
    E.wait(1.2);
    E.narr('2月19日の、15時22分。ある有名投資家の投稿があった。');
    E.say('hat', '15時22分は、取引時間の中だ。取引時間は、株の売り買いが、できる時間のことだ。', { yomi: 'じゅうごじ、にじゅうにふんは、取引時間の中だ。取引時間は、株の売り買いが、できる時間のことだ。' });
    E.say('hat', '元資料の要約では、エスポアの株を、売ることに、否定的な見方を書いた投稿だ。');
    E.say('hat', '区分の、需給は、株を買いたい人と、売りたい人の、量のつり合いのことだ。', { yomi: 'くぶんの、じゅきゅうは、株を買いたい人と、売りたい人の、量のつり合いのことだ。' });
    E.say('hat', '独立した根拠は、本人の言葉とは別に、ほかの人も確かめられる、数字や資料のことだ。', { yomi: 'どくりつした、こんきょは、本人の言葉とは別に、ほかの人も確かめられる、数字や資料のことだ。' });
    E.say('hat', '元資料の検証メモは、この短い投稿に、そうした根拠は、書かれていない、としている。');
    E.tw(t16, .35, { o: 0, x: -60 }, 'in2');
    ch.in(1, .2);
    const t17 = P.tcard(g, { id: 'T17', when: '2026/2/19 15:24', kind: '財務', session: '取引時間内', text: '資金調達から少なくとも1.5億円の利益を推測', note: '直前のエスポア投稿と一連の内容。資金調達額だけでは利益は確定しない', x: 300, y: 330, w: 1320, size: 40 });
    E.tw(t17, .45, { o: [0, 1], x: [60, 0] }, 'back', .8); E.sfx('notify', { delay: .8 });
    E.wait(1.2);
    E.narr('その2分後の、15時24分。もう1件の投稿があった。', { yomi: 'その、にふんごの、じゅうごじ、にじゅうよんぷん。もう1件の投稿があった。' });
    E.say('hat', '元資料の要約では、資金調達のことから、利益を推測した投稿だ。', { yomi: '元資料の要約では、しきんちょうたつのことから、利益を推測した投稿だ。' });
    E.say('hat', '少なくとも1.5億円の利益がある、という見方を書いている。', { yomi: '少なくとも、イッテンゴおくえんの利益がある、という見方を書いている。' });
    E.say('hat', '資金調達は、会社が、事業に使うお金を、集めることだ。増資や、借入がある。', { yomi: 'しきんちょうたつは、会社が、事業に使うお金を、集めることだ。ぞうしや、かりいれがある。' });
    E.say('hat', '元資料の検証メモは、すぐ前の、エスポアについての投稿と、ひと続きの内容だ、としている。');
    E.say('hat', 'そして、資金調達の額だけでは、利益は確定しない、と書いている。', { yomi: 'そして、しきんちょうたつの額だけでは、利益は確定しない、と書いている。' });
    E.tw(t17, .35, { o: 0, y: -20 }, 'in2');
    const b1 = box(g, { x: 360, y: 400, w: 520, h: 260, top: '集めたお金', main: '資金調達の額', c: '#2b68d8' });
    const b2 = box(g, { x: 1040, y: 400, w: 520, h: 260, top: '稼いだお金', main: '利益', c: '#17915a' });
    const ne = E.div(g, { left: 880, top: 460, width: 160, textAlign: 'center', font: '900 90px/1 Zen', color: '#ffd84a' }, '≠').ini({ o: 0 });
    const neNote = E.div(g, { left: 0, top: 700, width: W, textAlign: 'center', font: '900 32px/1.3 Zen', color: '#ffd84a' }, '集めたお金の額を見ても、稼いだお金の利益がいくらかは、決まらない').ini({ o: 0 });
    let L = E.say('hat', '左は、集めたお金。増資や借入で、会社に入ってくるお金だ。', { wait: false, delay: .3, yomi: 'ひだりは、集めたお金。ぞうしや、かりいれで、会社に入ってくるお金だ。' });
    rise(b1, .2);
    E.at(L.end);
    L = E.say('hat', '右は、稼いだお金。売上から、かかったお金を引いた、残りが利益だ。', { wait: false, yomi: 'みぎは、稼いだお金。うりあげから、かかったお金を引いた、残りが利益だ。' });
    rise(b2, .2);
    E.at(L.end);
    L = E.say('hat', '集めたお金の額を見ても、利益がいくらになるかは、決まらない。', { wait: false });
    E.pop(ne, .35, L.dur * .3, .5);
    E.show(neNote, .4, L.dur * .5);
    E.at(L.end + .5);
  });

  /* ============================================================ S8 I27　2月26日 */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'i27' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .8 });
    P.slate(g);
    bar(g, [2, 19], [2, 26]);
    const i27 = P.icard(g, { id: 'I27', when: '2026/2/26 17:10', session: '引け後', title: '岡山・完成後引渡し案件', text: '岡山県矢掛町の蓄電所売却を決議。<br>完成・引渡しは7月予定、収益は引渡し完了時に計上予定', note: '開示タイトルの「完成案件」を、当日完成・引渡済みと読み違えない', x: 260, y: 120, w: 1400, size: 32 });
    E.tw(i27, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '2月26日、引け後の17時10分。会社は、岡山県矢掛町の、蓄電所の売却を決議した。', { yomi: '2月26日、ひけごの、17時10分。会社は、おかやまけん、やかげちょうの、ちくでんしょの売却を決議した。' });
    E.say('hat', '蓄電所は、大きな蓄電池に、電気をためておく施設だ。', { yomi: 'ちくでんしょは、大きな、ちくでんちに、電気をためておく施設だ。' });
    const st = [['2026/2/26', '売却を決議', '#b8651a'], ['7月（予定）', '完成・引渡し', '#2b68d8'], ['引渡し完了のとき', '収益を計上（予定）', '#17915a']].map(([d, t, c], i) => box(g, { x: 160 + i * 560, y: 520, w: 480, h: 190, top: d, main: t, c, size: 38 }));
    const ar = [0, 1].map(i => E.div(g, { left: 650 + i * 560, top: 575, width: 60, textAlign: 'center', font: '900 60px/1 Zen', color: '#ffd84a' }, '→').ini({ o: 0 }));
    const L = E.say('hat', '完成と引渡しは、7月の予定。収益は、引渡しが終わったときに計上する予定だ。', { wait: false });
    st.forEach((s, i) => { rise(s, .2 + i * L.dur * .3); if (i) E.show(ar[i - 1], .3, .1 + i * L.dur * .3); });
    E.at(L.end);
    E.say('hat', '収益は、売上など、会社が、ものやサービスを売って、得る金額だ。', { yomi: 'しゅうえきは、うりあげなど、会社が、ものや、サービスを売って、える金額だ。' });
    E.say('hat', '計上は、それを、決算の数字に、入れることだ。', { yomi: 'けいじょうは、それを、決算の数字に、入れることだ。' });
    E.say('hat', '増資や借入で集めたお金は、収益には入らない。', { yomi: 'ぞうしや、かりいれで集めたお金は、しゅうえきには入らない。' });
    E.say('hat', '開示の題名には、完成案件、という言葉がある。', { yomi: '開示の題名には、かんせいあんけん、という言葉がある。' });
    E.say('hat', '元資料は、この案件を、完成後引渡し案件と書いている。', { yomi: '元資料は、この案件を、かんせいご、ひきわたし、あんけんと書いている。' });
    E.say('hat', '完成させてから、引き渡す案件、という意味だ。');
    E.say('hat', 'その完成と引渡しは、7月の予定だ。2月26日には、まだ、完成していない。');
    const warn = panel(g, { x: 260, y: 740, w: 1400, h: 100, size: 32, dark: true, html: '題名に「完成案件」とあっても、2月26日に完成して引き渡したのではない' });
    const L2 = E.say('hat', '題名に「完成案件」とあっても、その日に完成して、引き渡したわけじゃない。', { wait: false, yomi: '題名に、完成案件とあっても、その日に完成して、引き渡したわけじゃない。' });
    E.tw(warn, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L2.end + .4);
  });

  /* ============================================================ S9 I28　2月27日 11:30 */
  E.scene({ name: 'i28' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [2, 26], [2, 27]);
    const i28 = P.icard(g, { id: 'I28', when: '2026/2/27 11:30', session: '取引時間内', title: '増資4,995万円の払込完了', text: '第三者割当9万株の払込みを確認。個人1名に全株式を割当', note: '発行決議I24と払込完了I28は異なる段階', x: 260, y: 120, w: 1400, size: 32 });
    E.tw(i28, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '2月27日、取引時間中の11時30分。増資の払込みが、完了した。');
    E.say('hat', '払込みは、株を引き受けた人が、会社に、お金を払い込むことだ。');
    E.say('hat', '9万株の払込みが確かめられ、全部の株が、個人1名に、割り当てられた。', { yomi: 'きゅうまんかぶの払込みが確かめられ、全部の株が、こじん、いちめいに、割り当てられた。' });
    const s1 = box(g, { x: 300, y: 450, w: 560, h: 200, top: '2/12　I24　決議', main: '増資をすると決めた', c: '#b8651a', size: 40 });
    const s2 = box(g, { x: 1060, y: 450, w: 560, h: 200, top: '2/27　I28　払込完了', main: 'お金が実際に入った', c: '#17915a', size: 40 });
    const ar = E.div(g, { left: 880, top: 505, width: 160, textAlign: 'center', font: '900 70px/1 Zen', color: '#ffd84a' }, '→').ini({ o: 0 });
    let L = E.say('hat', '2月12日のI24は、増資をする、と決めた段階だ。まだ、お金は入っていない。', { wait: false, yomi: '2月12日の、アイにじゅうよんは、ぞうしをする、と決めた段階だ。まだ、お金は入っていない。' });
    rise(s1, .2);
    E.at(L.end);
    L = E.say('hat', '2月27日のI28は、そのお金が、実際に、会社に入った段階だ。', { wait: false, yomi: '2月27日の、アイニジューハチは、そのお金が、実際に、会社に入った段階だ。' });
    E.show(ar, .3, .1); rise(s2, .3); E.sfx('cash', { delay: .4, gain: .5 });
    E.at(L.end);
    E.say('hat', '元資料は、この二つを、異なる段階、として分けて書いている。');
    const ok = P.mark(g, '払込済み', { x: 1300, y: 380, color: '#17915a', size: .7, rot: 8 });
    L = E.say('hat', 'この4,995万円は、実際に払い込まれていた。', { wait: false, yomi: 'この、よんせんきゅうひゃくきゅうじゅうごまんえんは、実際に払い込まれていた。' });
    P.stampIn(ok, L.dur * .5);
    E.at(L.end);
    E.say('hat', '元資料の追記も、払込みは完了していて、この開示で確かめられる、としている。');
    const nx = panel(g, { x: 410, y: 720, w: 1100, h: 100, size: 34, dark: true, html: 'その結果、純資産がどうなったかは、第15章で計算する' });
    L = E.say('hat', 'それで純資産がどうなったかは、第15章で、計算する。', { wait: false });
    E.tw(nx, .4, { o: [0, 1], y: [20, 0] }, 'back', .3);
    E.at(L.end + .4);
  });

  /* ============================================================ S10 2月25日の安値 */
  E.scene({ name: 'low520' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('06'), { x: 80, y: 150, w: 1760 });
    E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '日足　2026年2月25日の安値');
    P.note(sc.root, '分割後の値段（元資料 p6・p12）', { x: 1500, y: 896, size: 22, dark: true });
    const lo = C.at(1249.5, 542);
    P.look(sc.cam, { s: 1.8, cx: lo.x, cy: lo.y - 60, dur: 1.4, delay: .2 });
    const lab = E.div(g, { left: lo.x + 24, top: lo.y - 40, padding: '4px 12px', borderRadius: 10, background: 'rgba(255,255,255,.96)', font: '900 22px/1.3 Noto', color: '#c62828', whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }, '2/25 安値 520円').ini({ o: 0 });
    E.wait(1.5);
    let L = E.say('hat', 'もう一つ。2月25日の安値は、520円だった。', { wait: false, yomi: 'もう一つ。2月25日の安値は、ごひゃくにじゅうえんだった。' });
    P.circle(g, { x: lo.x, y: lo.y - 4, w: 30, h: 30, sw: 4, delay: L.dur * .5, dur: .3 }); E.pop(lab, .3, L.dur * .6);
    E.at(L.end);
    E.say('hat', '安値は、その日に付いた、いちばん低い値段だ。', { yomi: 'やすねは、その日に付いた、いちばん低い値段だ。' });
    const memo = E.div(sc.root, { left: 210, top: 690, width: 1500, height: 140, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', font: '900 36px/1.2 Zen', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' },
      '<span>2024年5月27日の安値は540円、2026年2月25日の安値は<span style="color:#c62828">520円</span></span><span style="font:800 28px/1.2 Round;color:#6a6066">同じ値段ではないが、近い。元資料は、どちらも安値圏として並べている</span>').ini({ o: 0 });
    L = E.say('hat', '2024年5月27日の安値は、540円だった。第1章で見た値段だ。', { wait: false, yomi: '2024年5月27日の、やすねは、ごひゃくよんじゅうえんだった。だいいっしょうで見た値段だ。' });
    E.tw(memo, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('ding', { delay: .2, gain: .5 });
    E.at(L.end);
    E.say('hat', 'この540円は、株の分割に合わせて、3で割った値段だ。', { yomi: 'この、ごひゃくよんじゅうえんは、株の分割に合わせて、さんで割った値段だ。' });
    E.say('hat', '2月25日の520円は、540円より、少し低い。同じ値段ではないが、近い。', { yomi: '2月25日の、ごひゃくにじゅうえんは、ごひゃくよんじゅうえんより、少し低い。同じ値段ではないが、近い。' });
    E.say('hat', '元資料は、この二つを、安値圏として並べている。安値圏は、値段が低いあたりの範囲だ。', { yomi: 'もとしりょうは、この二つを、やすねけんとして並べている。やすねけんは、値段が低いあたりの範囲だ。' });
    E.say('hat', 'この値段は、あとで、また出てくる。');
    E.wait(.5);
  });

  /* ============================================================ S10b 別の場面：成功報酬の契約 */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'fee' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const hd = E.div(g, { left: 0, top: 40, width: W, textAlign: 'center' }, '<span style="padding:8px 30px;border-radius:999px;border:3px solid #f3e6c8;font:900 40px/1.3 Zen;color:#f3e6c8">別の開示：成功報酬の契約</span>').ini({ o: 0 });
    E.show(hd, .4, .2);
    const i25 = P.icard(g, { id: 'I25', when: '2026/2/12 18:10', session: '引け後', title: '成功報酬5,000万円の契約', text: '不動産の販売協力・支援について<br>税込5,000万円の成功報酬契約を決議', note: '報酬は進捗・条件成就を前提に発生すると会社が説明', x: 260, y: 160, w: 1400, size: 32 });
    E.tw(i25, .45, { o: [0, 1], y: [30, 0] }, 'back', .6); E.sfx('notify', { delay: .6 });
    E.wait(1.0);
    E.say('hat', 'ここからは、増資とは別の開示だ。');
    E.say('hat', '2月12日、引け後の18時10分。会社は、成功報酬の契約を決議した。', { yomi: '2月12日、ひけごの、18時10分。会社は、成功報酬の契約を決議した。' });
    E.say('hat', '成功報酬は、仕事が、うまくいった時に、払う約束の報酬だ。');
    E.say('hat', '契約の中身は、不動産の販売の、協力と支援だ。金額は、税込みで、5,000万円。', { yomi: '契約の中身は、ふどうさんの販売の、協力と支援だ。金額は、ぜいこみで、ごせんまんえん。' });
    E.say('hat', '報酬は、進み具合や、条件がそろうことを前提に発生する、と会社は説明している。');
    E.tw(i25, .35, { o: 0, x: -60 }, 'in2');
    const i26 = P.icard(g, { id: 'I26', when: '2026/2/19 16:20', session: '引け後', title: '成功報酬1.21億円の契約', text: '不動産の販売協力・支援について<br>税込1.21億円の成功報酬契約を締結', note: '元資料の分析：後の監査・調査対象となった期末収益認識とのつながりを確認する材料', x: 260, y: 160, w: 1400, size: 32 });
    E.tw(i26, .45, { o: [0, 1], x: [60, 0] }, 'back', .4); E.sfx('notify', { delay: .4 });
    E.say('hat', '2月19日、引け後の16時20分。会社は、同じ種類の契約を、もう1件結んだ。', { delay: .6, yomi: '2月19日、ひけごの、16時20分。会社は、同じ種類の契約を、もう1件結んだ。' });
    E.say('hat', '中身は、同じく、不動産の販売の、協力と支援。金額は、税込みで、1.21億円だ。', { yomi: '中身は、同じく、ふどうさんの販売の、協力と支援。金額は、ぜいこみで、いちおく、にせんひゃくまんえんだ。' });
    E.say('hat', 'この期の、期末の収益の計上は、のちに、監査や、調査の対象になった。', { yomi: 'この期の、きまつの、しゅうえきの、けいじょうは、のちに、監査や、調査の対象になった。' });
    E.say('hat', '元資料の分析では、この契約は、その計上とのつながりを、確かめる材料だ。', { yomi: 'もとしりょうの分析では、この契約は、その、けいじょうとのつながりを、確かめる材料だ。' });
    E.wait(.4);
  });

  /* ============================================================ S11 ブルちゃんの部屋 */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_room' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    const tag = E.div(g, { left: 1150, top: 100, padding: '10px 28px', borderRadius: 14, background: 'rgba(255,255,255,.95)', font: '900 38px/1.3 Zen', color: '#3a3236', boxShadow: '0 8px 18px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }, '2/28　改善期間の終わり').ini({ o: 0, r: -2 });
    const memo = E.div(g, { left: 1180, top: 200, padding: '8px 24px', borderRadius: 14, background: '#2a2430', font: '900 32px/1.4 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '解消したかは、決算と監査で分かる').ini({ o: 0, r: -2 });
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 5, delay: .3 });
    E.wait(.6);
    const L = E.narr('2月28日。改善期間の、終わりの日が来た。', { wait: false });
    E.pop(tag, .4, L.dur * .3, .6); E.sfx('page', { delay: L.dur * .3, gain: .5 });
    E.at(L.end);
    E.narr('増資のお金は、入った。');
    const L2 = E.narr('でも、債務超過が解消したかは、決算と監査を待たないと、分からなかった。', { wait: false });
    E.pop(memo, .4, L2.dur * .55, .6); E.sfx('pop', { delay: L2.dur * .55, gain: .4 });
    E.at(L2.end);
    E.narr('期末の純資産は、その期の損益でも、変わるからだ。', { yomi: 'きまつの純資産は、その期の、そんえきでも、変わるからだ。' });
    E.narr('私は、前よりも毎日、エスポアのチャートを見るようになった。');
    E.wait(.3);
  });

  /* ============================================================ S12 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '集めたお金と、稼いだお金は、別のお金', { left: 120, top: 120, font: '900 60px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .06));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const wallet = (x, t, sub, c) => E.div(paper, { left: x, top: 330, width: 500, height: 380, borderRadius: 30, border: `6px solid ${c}`, background: 'rgba(255,255,255,.6)', textAlign: 'center' },
      `<div style="font:900 46px/1.3 Zen;color:${c};padding-top:70px">${t}</div><div style="font:800 32px/1.6 Round;color:#5a4a3a;margin-top:20px">${sub}</div>`).ini({ o: 0 });
    const w1 = wallet(150, '集めたお金', '増資・借入', P.T_BLUE), w2 = wallet(760, '稼いだお金', '利益', '#17915a');
    E.wait(2.8);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「集めたお金と、稼いだお金は、別のお金」。', { wait: false, yomi: '集めたお金と、稼いだお金は、別のお金。' });
    E.tw(w1, .45, { o: [0, 1], y: [30, 0] }, 'back', .3); E.sfx('cash', { delay: .3, gain: .4 });
    E.tw(w2, .45, { o: [0, 1], y: [30, 0] }, 'back', L.dur * .55); E.sfx('cash', { delay: L.dur * .55, gain: .4 });
    E.at(L.end + 1.0);
  });

  /* ============================================================ S13 男爵 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .75 });
    const C = P.closeup(g, CH('baron_e_normal'), { bg: 'radial-gradient(ellipse at 50% 40%, #4a1622 0%, #200a10 75%)', imgH: 860, panelBg: 'linear-gradient(180deg,#3a121b,#1a070c)' });
    E.from(C.img, { s: .94, y: 30 }, .6, 0, 'out');
    E.wait(.5);
    E.say('baron', 'お金が入ると、人は、もう大丈夫だと思いたがる。', { talk: C.img, talkAmp: 2 });
    C.swap(CH('baron_e_scheme'));
    E.say('baron', 'だが、足りたかどうかは、決算と監査が決める。', { talk: C.img, talkAmp: 2 });
    E.wait(.5);
  });

  /* ============================================================ S14 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 505 });
    [['T', P.T_BLUE], ['I', P.I_ORANGE]].forEach(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
    });
    const st = P.sticky(g, '第6章<br>売りが出ない', { x: 1360, y: 120, w: 460, h: 250, rot: 5, size: 46 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第6章だブー。', { talk: pig, talkAmp: 5 });
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
