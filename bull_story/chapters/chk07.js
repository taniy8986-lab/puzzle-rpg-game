// 完全版 第7章「決算延期」（2026年4月13日〜4月23日）
// 台本: story/k/k07_決算延期.md　元資料 p6・p7・p10・p13・p15・p21・p29・p30・p37
// 投稿は元資料の要約（本人の見解）。有名投資家の名前・アカウントは出さない。ブルちゃんの保有はフィクション
'use strict';
E.chapter('k07');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;
  const bar = (g, from, to) => P.monthBar(g, { year: 2026, start: 4, months: 1, from, to, x: 560, w: 800 });
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const chartTitle = (sc, t) => E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, t);
  const tag = (g, pt, txt, dx, dy, c = '#262236', size = 17) => E.div(g, { left: pt.x + dx, top: pt.y + dy, padding: '3px 10px', borderRadius: 8, background: 'rgba(255,255,255,.96)', font: `900 ${size}px/1.3 Noto`, color: c, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }, txt).ini({ o: 0 });
  const fiction = sc => P.note(sc.root, 'ブルちゃんの売買はフィクションです', { x: 1440, y: 40, size: 24, dark: true });
  const tIn = (n, d = .5) => { E.tw(n, .45, { o: [0, 1], x: [60, 0] }, 'back', d); E.sfx('notify', { delay: d }); };
  const swap = (a, b) => { E.tw(a, .35, { o: 0, x: -60 }, 'in2'); tIn(b, .4); };

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

  /* ============================================================ S0 アバン：4月13日の朝 */
  P.phoneScene((ph, sc) => {
    E.bgm('daily', { fadeIn: 1.0, gain: .7 });
    fiction(sc);
    const scr = ph.screen, sw = ph.sw;
    E.div(scr, { left: 0, top: 0, width: sw, height: 1000, background: '#f4f6f9' });
    E.div(scr, { left: 0, top: 70, width: sw, textAlign: 'center', font: '900 30px/1.4 Zen', color: '#22252b' }, '保有している株');
    const card = E.div(scr, { left: 24, top: 150, width: sw - 48, height: 240, borderRadius: 18, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,.08)' });
    E.div(card, { left: 24, top: 20, font: '900 30px/1.4 Zen', color: '#22252b' }, 'エスポア（3260）');
    E.div(card, { left: 24, top: 80, font: '800 24px/1.6 Round', color: '#6a6066' }, '取得単価　700円');
    E.div(card, { left: 24, top: 130, font: '800 24px/1.6 Round', color: '#6a6066' }, '4/10 高値　<b style="font:900 40px Noto;color:#d22d68">935円</b>');
    E.wait(1.0);
    E.narr('4月10日の高値は、935円。私が買った700円より、ずっと上だった。', { yomi: '4月10日の高値は、きゅうひゃくさんじゅうごえん。私が買った、ななひゃくえんより、ずっと上だった。' });
    E.narr('4月13日。その日の夕方、決算の発表が、延びることになる。');
  }, { name: 'avant_phone', wait: .4 });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 7, title: '決算延期', sub: '2026年4月13日〜4月24日（引けまで）', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 4月13日　10:22 → 16:30 */
  E.scene({ name: 'apr13' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    E.div(g, { left: 80, top: 60, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '2026年4月13日　時刻の順番');
    const ax = P.dayAxis(g, { x: 180, y: 260, w: 1560, from: 480, to: 1080, open: 540, band: [[540, 690, '前場'], [750, 930, '後場']] });
    E.show(ax.root, .5, .2);
    const dT = P.axisDot(g, ax, { m: 622, y: 260, kind: 'T', label: 'T24 10:22' });
    const dI = P.axisDot(g, ax, { m: 990, y: 260, kind: 'I', label: 'I31 16:30' });
    const t24 = P.tcard(g, { id: 'T24', when: '2026/4/13 10:22', kind: 'チャート', session: '取引時間内', text: '25日線と200日線のゴールデンクロスに言及', note: '4月13日終値ベースでも25日線803.60円が200日線799.42円を上回る', x: 300, y: 420, w: 1320, size: 38 });
    E.wait(.6);
    E.pop(dT, .4, 0); E.sfx('pop');
    tIn(t24, .3);
    E.narr('4月13日の10時22分。25日線と200日線の、ゴールデンクロスに触れる投稿があった。', { delay: .6, yomi: '4月13日の10時22分。にじゅうごにちせんと、にひゃくにちせんの、ゴールデンクロスに触れる投稿があった。' });
    E.wait(.2);
  });

  E.scene({ name: 'gc' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, 'ゴールデンクロス（しくみの図）', 44);
    E.show(tt, .3);
    const X0 = 260, X1 = 1660, Y0 = 220, Y1 = 700;
    E.div(g, { left: X0, top: Y0, width: X1 - X0, height: Y1 - Y0, borderRadius: 18, background: 'rgba(255,255,255,.06)', border: '2px solid rgba(243,230,200,.3)' });
    const longPts = [[0, 300], [1400, 230]].map(([x, y]) => [x, y]);
    const shortPts = []; for (let i = 0; i <= 28; i++) { const x = i * 50; shortPts.push([x, 380 - 260 * Math.pow(i / 28, 1.6) + Math.sin(i * .9) * 12]); }
    const lg = E.polyline(g, longPts, { left: X0, top: Y0, width: X1 - X0, height: Y1 - Y0, color: '#9b6fd6', sw: 8 }).ini({ draw: 0 });
    const st = E.polyline(g, shortPts, { left: X0, top: Y0, width: X1 - X0, height: Y1 - Y0, color: '#e8a33a', sw: 8 }).ini({ draw: 0 });
    const ll = E.div(g, { left: X1 - 300, top: Y0 + 180, font: '900 30px/1.2 Zen', color: '#c9a7f2', whiteSpace: 'nowrap' }, '200日線（長い期間）').ini({ o: 0 });
    const sl = E.div(g, { left: X0 + 40, top: Y0 + 400, font: '900 30px/1.2 Zen', color: '#f5c46a', whiteSpace: 'nowrap' }, '25日線（短い期間）').ini({ o: 0 });
    // 交点（x を数値で求める）
    let cx = 0; for (let i = 1; i < shortPts.length; i++) { const yl = 300 - 70 * shortPts[i][0] / 1400; if (shortPts[i][1] < yl) { cx = shortPts[i][0]; break; } }
    const cy = 300 - 70 * cx / 1400;
    E.wait(.3);
    let L = E.say('hat', 'ゴールデンクロスは、短い期間の平均線が、長い期間の平均線を、下から上に抜けることだ。', { wait: false });
    E.tw(lg, 1.2, { draw: [0, 1] }, 'inOut', .2); E.show(ll, .3, .8);
    E.tw(st, 1.6, { draw: [0, 1] }, 'inOut', L.dur * .35); E.show(sl, .3, L.dur * .4);
    P.circle(g, { x: X0 + cx, y: Y0 + cy, w: 90, h: 90, color: '#ffd84a', delay: L.dur * .35 + 1.5, dur: .4 });
    E.at(L.end);
    [lg, st, ll, sl, tt].forEach(n => E.hide(n, .3));
    const v13 = panel(g, { x: 260, y: 300, w: 1400, h: 150, size: 44, html: '<span style="font:800 30px Round;color:#6a6066">4/13 終値で</span><span style="color:#e8a33a">25日線 803.60円</span><span>＞</span><span style="color:#7d4fc2">200日線 799.42円</span>' });
    const v10 = panel(g, { x: 260, y: 500, w: 1400, h: 130, size: 38, html: '<span style="font:800 28px Round;color:#6a6066">4/10 は</span><span style="color:#e8a33a">790.92円</span><span>＜</span><span style="color:#7d4fc2">799.48円</span><span style="font:800 28px Round;color:#6a6066">まだ下</span>' });
    L = E.say('hat', '元資料が計算し直すと、4月13日の終値で、25日線803.60円が、200日線799.42円を上回っていた。', { wait: false, yomi: 'もとしりょうが計算し直すと、4月13日の、おわりねで、にじゅうごにちせん、はっぴゃくさんてんろくまるえんが、にひゃくにちせん、ななひゃくきゅうじゅうきゅうてんよんにえんを、上回っていた。' });
    E.tw(v13, .45, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '4月10日は、まだ下だった。交わったのは、4月13日だ。', { wait: false });
    E.tw(v10, .45, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2, gain: .5 });
    E.at(L.end + .3);
  });

  E.scene({ name: 'i31' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .7 });
    P.slate(g);
    E.div(g, { left: 80, top: 60, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '2026年4月13日　時刻の順番');
    const ax = P.dayAxis(g, { x: 180, y: 260, w: 1560, from: 480, to: 1080, open: 540, band: [[540, 690, '前場'], [750, 930, '後場']] });
    ax.root.ini({ o: 1 });
    const dT = P.axisDot(g, ax, { m: 622, y: 260, kind: 'T', label: 'T24 10:22' }).ini({ o: 1 });
    const dI = P.axisDot(g, ax, { m: 990, y: 260, kind: 'I', label: 'I31 16:30' });
    const i31 = P.icard(g, { id: 'I31', when: '2026/4/13 16:30', session: '引け後', title: '決算発表を4/20へ延期', text: '一部取引の収益認識について監査法人が追加確認を求め、<br>決算発表を4/20と見込む', x: 260, y: 420, w: 1400, size: 32 });
    E.wait(.4);
    E.pop(dI, .4, 0); E.sfx('pop');
    E.tw(i31, .45, { o: [0, 1], y: [30, 0] }, 'back', .3); E.sfx('notify', { delay: .3 });
    E.say('hat', '同じ日の16時30分。会社は、決算の発表を延ばし、4月20日を見込むと開示した。', { delay: .6 });
    E.say('hat', '一部の取引の、収益の計上について、監査法人が、追加の確認を求めた。', { yomi: '一部の取引の、収益の、けいじょうについて、監査法人が、追加の確認を求めた。' });
    const ord = panel(g, { x: 260, y: 760, w: 1400, h: 100, size: 34, dark: true, html: '投稿の時点（10:22）では、決算の延期は　未公表' });
    const L = E.say('hat', '投稿は、10時22分。その時点で、決算の延期は、まだ公表されていない。', { wait: false });
    E.tw(i31, .3, { y: -40 }, 'inOut', .1);
    E.tw(ord, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .4); E.sfx('ding', { delay: L.dur * .4, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S3 4月14日・17日 */
  E.scene({ name: 't25' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    bar(g, [4, 13], [4, 14]);
    const t25 = P.tcard(g, { id: 'T25', when: '2026/4/14 10:41', kind: '需給', session: '取引時間内', text: '総会賛成者の長期保有と浮動株減少を推測', note: '賛成率から実際の保有継続や売買主体までは確認できない', x: 260, y: 140, w: 1400, size: 40 });
    tIn(t25);
    E.wait(1.0);
    E.narr('4月14日。総会で賛成した株主が、長く持ち続けて、市場に出る株が減る、と推測する投稿。');
    E.say('hat', '賛成の割合から、本当に持ち続けているのか、誰が売り買いしているのかは、確かめられない。');
    const t26 = P.tcard(g, { id: 'T26', when: '2026/4/17 9:16', kind: '需給', session: '取引時間内', text: '買い戻しとみられる買いに売りが出ないと発言', note: '実際の買い戻しか、新規買いかは日足・出来高だけでは識別できない', x: 260, y: 140, w: 1400, size: 40 });
    swap(t25, t26);
    E.narr('4月17日の朝には、買い戻しとみられる買いに、売りが出ない、という投稿。', { delay: .8 });
    E.wait(.2);
  });

  E.scene({ name: 'buyback' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 14], [4, 17]);
    const tt = P.heading(g, '「買い戻し」か「新しい買い」か', 110);
    E.show(tt, .3);
    const box = (x, t, sub, c) => E.div(g, { left: x, top: 250, width: 620, height: 300, borderRadius: 26, background: 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="font:900 46px/1.3 Zen;color:${c};padding-top:50px">${t}</div><div style="font:800 28px/1.6 Round;color:#4a4552;margin-top:20px">${sub}</div>`).ini({ o: 0 });
    const b1 = box(280, '買い戻し', '空売りしていた人が、<br>株を買って返す', '#2b68d8'), b2 = box(1020, '新しい買い', '新しく株を買う', '#d22d68');
    const same = panel(g, { x: 360, y: 600, w: 1200, h: 130, size: 36, html: '日足・出来高では　買い戻しか新しい買いかは区別されない' });
    E.wait(.3);
    let L = E.say('hat', '買い戻しは、空売りをしていた人が、株を買って返すことだ。', { wait: false });
    E.tw(b1, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2 });
    E.at(L.end);
    L = E.say('hat', 'でも、それが買い戻しなのか、新しい買いなのかは、日足と出来高だけでは、見分けられない。', { wait: false, yomi: 'でも、それが買い戻しなのか、新しい買いなのかは、日足と、できだかだけでは、見分けられない。' });
    E.tw(b2, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2 });
    E.tw(same, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .55); E.sfx('ding', { delay: L.dur * .55, gain: .5 });
    E.at(L.end + .3);
    [b1, b2, same, tt].forEach(n => E.hide(n, .3));
    const t27 = P.tcard(g, { id: 'T27', when: '2026/4/17 9:52', kind: '需給', session: '取引時間内', text: '売り方が急いでいるとの見方', note: '売買主体の動機は本人の推測', x: 260, y: 160, w: 1400, size: 40 });
    tIn(t27, .4);
    E.narr('9時52分には、売り方が急いでいる、という見方。', { delay: .8 });
    const m = P.mark(g, '本人の推測', { x: 760, y: 520, color: P.T_BLUE, size: .8, rot: -5 });
    const L2 = E.say('hat', '売り買いしている人の動機は、本人の推測だ。', { wait: false });
    P.stampIn(m, L2.dur * .5);
    E.at(L2.end + .3);
  });

  /* ============================================================ S4 週足：1,000円 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'weekly' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('10'), { x: 80, y: 150, w: 1760 });
    E.div(g, { left: 80, top: 82, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '週足　2024年1月〜2026年10月（13・26・52週線）');
    P.note(sc.root, '分割調整後の値段（元資料 p10）', { x: 1500, y: 896, size: 22, dark: true });
    C.draw(2.0, .2);
    const a = C.at(1700, 414.5), b = C.at(2437, 414.5), p = C.at(2012.5, 414);
    const ln = E.div(g, { left: a.x, top: a.y - 3, width: b.x - a.x, height: 0, borderTop: '6px dashed #ffd84a', transformOrigin: '0 50%' }).ini({ sx: 0 });
    const lb = E.div(g, { left: p.x - 60, top: p.y - 120, padding: '4px 16px', borderRadius: 12, background: 'rgba(20,12,16,.85)', font: '900 30px/1.3 Noto', color: '#ffd84a', whiteSpace: 'nowrap' }, '1,000円（4/14・4/17）').ini({ o: 0 });
    const pk = C.at(735.5, 240);
    const pkLab = E.div(g, { left: pk.x + 30, top: pk.y - 66, padding: '4px 16px', borderRadius: 12, background: '#c62828', font: '900 30px/1.3 Noto', color: '#fff', whiteSpace: 'nowrap' }, '2024年の高値 1,880円').ini({ o: 0 });
    E.wait(2.2);
    let L = E.say('hat', '週足で見ると、2026年の戻りは、1,000円まで。4月14日と17日に、1,000円をつけた。', { wait: false, yomi: '週足で見ると、2026年の戻りは、せんえんまで。4月14日と17日に、せんえんをつけた。' });
    E.tw(ln, 1.0, { sx: [0, 1] }, 'inOut', .3); P.circle(g, { x: p.x, y: p.y, w: 60, h: 60, color: '#ffd84a', delay: L.dur * .5, dur: .35 }); E.pop(lb, .35, L.dur * .55);
    E.at(L.end);
    L = E.say('hat', '2024年の高値、1,880円より、46.81％低い水準だ。', { wait: false, yomi: '2024年の高値、せんはっぴゃくはちじゅうえんより、ヨンジューロクテンハチイチパーセント低い水準だ。' });
    P.circle(g, { x: pk.x, y: pk.y, w: 60, h: 60, delay: .2, dur: .35 }); E.pop(pkLab, .35, .3);
    E.at(L.end);
    const no = E.div(sc.root, { left: 360, top: 790, width: 1200, height: 100, borderRadius: 22, background: '#2a2430', border: '3px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 34px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '日足のゴールデンクロスだけで、流れが変わったとは言い切れない').ini({ o: 0 });
    L = E.say('hat', '日足のゴールデンクロスだけで、流れが変わったとは、言い切れない。', { wait: false });
    E.tw(no, .4, { o: [0, 1], y: [20, 0] }, 'back', .3);
    E.at(L.end + .4);
  });

  /* ============================================================ S5 4月20日　再延期 */
  E.scene({ name: 'i32' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .7 });
    P.slate(g);
    bar(g, [4, 17], [4, 20]);
    const i32 = P.icard(g, { id: 'I32', when: '2026/4/20 17:45', session: '引け後', title: '決算を4/24へ再延期', text: '特定取引の役務内容と対価の対応関係を追加精査し、<br>4/20予定を4/24へ再延期', x: 260, y: 130, w: 1400, size: 34 });
    E.tw(i32, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '4月20日、17時45分。会社は、決算の発表を、もう一度延ばした。今度は、4月24日だ。');
    const pair = [['サービスの中身（役務）', '#2b68d8'], ['取引の代金（対価）', '#b8651a']].map(([t, c], i) => E.div(g, { left: 260 + i * 760, top: 480, width: 640, height: 150, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 40px/1.2 Zen', color: c, boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, t).ini({ o: 0 }));
    const q = E.div(g, { left: 900, top: 500, width: 120, textAlign: 'center', font: '900 80px/1.2 Zen', color: '#ffd84a' }, '？').ini({ o: 0 });
    E.say('hat', 'ある取引の、サービスの中身と、その対価。');
    const L = E.say('hat', 'それが見合っているかを、さらに調べる、という理由だ。', { wait: false });
    pair.forEach((p, i) => { E.tw(p, .4, { o: [0, 1], y: [20, 0] }, 'back', .2 + i * L.dur * .3); E.sfx('pop', { delay: .2 + i * L.dur * .3, gain: .5 }); });
    E.pop(q, .35, L.dur * .65, .5);
    E.at(L.end + .3);
  });

  E.scene({ name: 't28' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 20], [4, 20]);
    const tl = P.timeLink(g, { x: 260, y: 150, w: 1400, a: { id: 'I32', time: '17:45', sub: '会社の開示', color: P.I_ORANGE }, b: { id: 'T28', time: '18:07', sub: '投稿', color: P.T_BLUE }, label: '22分後' });
    tl.in(.2);
    const t28 = P.tcard(g, { id: 'T28', when: '2026/4/20 18:07', kind: '財務', session: '引け後', text: '決算延期を仕込みの機会と捉える発言', note: '4月20日18時07分。翌21日に819円まで下落し892円引け', x: 300, y: 330, w: 1320, size: 40 });
    E.tw(t28, .45, { o: [0, 1], y: [30, 0] }, 'back', 1.3); E.sfx('notify', { delay: 1.3 });
    E.wait(1.7);
    E.narr('公表の22分後に、決算の延期を、仕込みの機会と捉える投稿があった。');
    E.say('hat', '次の日の4月21日は、819円まで下がって、892円で終わった。', { yomi: '次の日の4月21日は、はっぴゃくじゅうきゅうえんまで下がって、はっぴゃくきゅうじゅうにえんで終わった。' });
    E.wait(.3);
  });

  /* ============================================================ S6 4月21日　窓 */
  E.scene({ name: 'gap' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('07'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, '日足　2026年4月20日〜24日');
    P.note(sc.root, '分割後の値段（元資料 p7）', { x: 1540, y: 896, size: 22, dark: true });
    const lo20 = C.at(850.5, 312.3), hi21 = C.at(899.5, 330.2);
    P.look(sc.cam, { s: 2.0, cx: C.at(940, 0).x, cy: C.at(0, 340).y + 30, dur: 1.4, delay: .2 });
    const band = E.div(g, { left: C.at(860, 0).x, top: lo20.y, width: C.at(1080, 0).x - C.at(860, 0).x, height: hi21.y - lo20.y, background: 'rgba(255,216,74,.45)', border: '2px solid #ffd84a', transformOrigin: '0 50%' }).ini({ sx: 0 });
    const t1 = tag(g, lo20, '4/20 安値 969円', -150, -40, '#262236'), t2 = tag(g, hi21, '4/21 高値 934円', 16, 6, '#262236');
    const wl = tag(g, C.at(1000, 312.3), '窓', 0, -38, '#b8651a', 22);
    E.wait(1.6);
    let L = E.say('hat', '4月20日の安値は969円。4月21日の高値は934円。', { wait: false, yomi: '4月20日の安値は、きゅうひゃくろくじゅうきゅうえん。4月21日の高値は、きゅうひゃくさんじゅうよえん。' });
    E.pop(t1, .3, .2); E.pop(t2, .3, L.dur * .5);
    E.at(L.end);
    L = E.say('hat', 'そのあいだに、取引のない値段の帯ができた。これが、窓だ。', { wait: false });
    E.tw(band, .8, { sx: [0, 1] }, 'out', .2); E.sfx('slide', { delay: .2, gain: .5 }); E.pop(wl, .3, L.dur * .6);
    E.at(L.end + .4);
  });

  E.scene({ name: 't29t30' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 20], [4, 21]);
    const t29 = P.tcard(g, { id: 'T29', when: '2026/4/21 10:02', kind: '需給', session: '取引時間内', text: '寄り前の大口売り注文と買い戻しの必要性を推測', note: '注文主体や見せ板との同一性は未確認。日足には819円からの戻りが記録される', x: 260, y: 140, w: 1400, size: 40 });
    tIn(t29);
    E.wait(1.0);
    E.narr('4月21日の10時02分。寄り前の大きな売り注文と、買い戻しが必要になる、と推測する投稿。', { yomi: '4月21日の10時2分。よりまえの大きな売り注文と、買い戻しが必要になる、と推測する投稿。' });
    E.say('hat', '大きな売り注文を、誰が出したのかは、確かめられていない。');
    const t30 = P.tcard(g, { id: 'T30', when: '2026/4/21 15:02', kind: 'チャート', session: '取引時間内', text: '数日以内に上方の窓を埋めると予想', note: '添付はエスポア日足。4月20日安値969円と21日高値934円の窓は、その後も埋まらなかった', x: 260, y: 140, w: 1400, size: 40 });
    swap(t29, t30);
    E.narr('15時02分には、数日のうちに、上の窓を埋める、と予想する投稿。', { delay: .8, yomi: '15時2分には、数日のうちに、上の窓を埋める、と予想する投稿。' });
    E.wait(.2);
  });

  E.scene({ name: 'gap_after' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('07'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, '日足　4月22日〜24日の高値と、窓');
    P.note(sc.root, '分割後の値段（元資料 p7・p13）', { x: 1500, y: 896, size: 22, dark: true });
    const lo20 = C.at(850.5, 312.3), hi21 = C.at(899.5, 330.2);
    P.look(sc.cam, { s: 2.0, cx: C.at(960, 0).x, cy: C.at(0, 340).y + 30, dur: .01 });
    E.div(g, { left: C.at(860, 0).x, top: lo20.y, width: C.at(1080, 0).x - C.at(860, 0).x, height: hi21.y - lo20.y, background: 'rgba(255,216,74,.45)', border: '2px solid #ffd84a' });
    const hs = [[948.5, 357.5, '4/22 885円', -130, 22], [997.5, 362.4, '4/23 875円', -40, 52], [1046.5, 343, '4/24 913円', 16, 14]].map(([px, py, t, dx, dy]) => { const p = C.at(px, py); return { p, n: tag(g, p, t, dx, dy, '#c62828') }; });
    E.wait(.5);
    let L = E.say('hat', '4月22日から24日の高値は、885円、875円、913円。窓の上の969円には、届かなかった。', { wait: false, yomi: '4月22日から24日の高値は、はっぴゃくはちじゅうごえん、はっぴゃくななじゅうごえん、きゅうひゃくじゅうさんえん。窓の上の、きゅうひゃくろくじゅうきゅうえんには、届かなかった。' });
    hs.forEach((h, i) => { const d = .2 + i * L.dur * .18; P.circle(g, { x: h.p.x, y: h.p.y, w: 22, h: 22, sw: 3, delay: d, dur: .3 }); E.pop(h.n, .3, d + .1); });
    const st = P.mark(sc.root, '未達', { x: 1460, y: 140, color: '#c62828', size: .8, rot: 8, w: 160 });
    P.stampIn(st, L.dur * .8);
    E.at(L.end);
    E.say('hat', 'この窓は、そのあと、最後の売買の日まで、埋まらなかった。', { yomi: 'この窓は、そのあと、最後の売買の日まで、うまらなかった。' });
    E.wait(.4);
  });

  /* ============================================================ S7 延期で、何が止まっていたのか */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'stopped' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '延期で、何が止まっていたのか（元資料 p37）', 44);
    E.show(tt, .3);
    const row = (y, d, a, b) => E.div(g, { left: 160, top: y, width: 1600, height: 190, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<span style="flex:none;width:200px;text-align:center;font:900 44px/1 Noto;color:#b8651a">${d}</span>
       <div style="flex:1;font:900 32px/1.45 Zen;color:#262236;padding-right:20px">${a}<div style="font:800 26px/1.5 Round;color:#6a6066;margin-top:6px">元資料の分析：${b}</div></div>`).ini({ o: 0 });
    const r1 = row(200, '4/13', '収益認識に追加確認が必要 → 決算発表を 4/20 へ延期', '対象取引の資料・関係者確認が未完了');
    const r2 = row(420, '4/20', '役務内容と対価の対応を精査。監査法人・名証との協議を踏まえ 4/24 へ再延期', '予定日の変更だけでなく、計上した利益の妥当性が論点');
    E.wait(.3);
    E.tw(r1, .4, { o: [0, 1], x: [-40, 0] }, 'back', .1); E.sfx('slide', { delay: .1 });
    E.say('hat', '延期で止まっていたのは、日付だけじゃない。', { delay: .3 });
    const q = panel(g, { x: 260, y: 650, w: 1400, h: 110, size: 36, html: '<span>サービスを、本当に提供したのか</span><span style="color:#ffd84a">／</span><span>見合う対価だったのか</span>' });
    let L = E.say('hat', 'サービスを、本当に提供したのか。その中身に見合う、対価だったのか。', { wait: false });
    E.tw(q, .4, { o: [0, 1], y: [20, 0] }, 'back', .2);
    E.at(L.end);
    E.say('hat', '利益と、純資産の両方を左右する、確認だった。');
    E.say('hat', '元資料は、2回目の延期を、こう読んでいる。', { yomi: 'もとしりょうは、2回目の延期を、こう読んでいる。' });
    L = E.say('hat', '予定日の変更だけでなく、計上した利益が妥当かどうかが、論点だった。', { wait: false, yomi: '予定日の変更だけでなく、けいじょうした利益が、妥当かどうかが、論点だった。' });
    E.tw(r2, .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end + .4);
  });

  /* ============================================================ S8 ブルちゃんの部屋 */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_room' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: '保有', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    const cal = E.div(g, { left: 1150, top: 100, padding: '10px 26px', borderRadius: 14, background: 'rgba(255,255,255,.95)', font: '900 38px/1.4 Zen', color: '#3a3236', boxShadow: '0 8px 18px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }, '決算発表：<s>4/20</s> → 4/24').ini({ o: 0, r: -2 });
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 4, delay: .3 });
    E.wait(.6);
    const L = E.narr('延期の知らせ。それでも、私は、売らなかった。', { wait: false });
    E.pop(cal, .4, L.dur * .3, .6); E.sfx('page', { delay: L.dur * .3, gain: .5 });
    E.at(L.end);
    E.narr('延期は、ただの日付の変更だと思っていた。何の確認が止まっていたのかを、私は、読もうとしなかった。');
    E.wait(.3);
  });

  /* ============================================================ S9 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '延期は、日付ではなく、中身を読め', { left: 120, top: 120, font: '900 64px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .07));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const d1 = E.div(paper, { left: 140, top: 380, width: 480, height: 260, borderRadius: 20, border: '5px dashed #a09070', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#a09070', paddingTop: 60 }, '日付<br><span style="font-size:34px">4/20 → 4/24</span>').ini({ o: 0 });
    const d2 = E.div(paper, { left: 760, top: 380, width: 520, height: 260, borderRadius: 20, border: '6px solid #c62828', background: 'rgba(255,255,255,.6)', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#c62828', paddingTop: 60 }, '中身<br><span style="font-size:32px">取引の実態・対価</span>').ini({ o: 0 });
    E.wait(2.6);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「延期は、日付ではなく、中身を読め」。', { wait: false, yomi: '延期は、日付ではなく、中身を読め。' });
    E.show(d1, .4, .2); E.tw(d2, .45, { o: [0, 1], s: [1.2, 1] }, 'back', L.dur * .5); E.sfx('stamp', { delay: L.dur * .5 + .2, gain: .5 });
    E.at(L.end + 1.0);
  });

  /* ============================================================ S10 男爵 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .75 });
    const C = P.closeup(g, CH('baron_e_normal'), { bg: 'radial-gradient(ellipse at 50% 40%, #4a1622 0%, #200a10 75%)', imgH: 860, panelBg: 'linear-gradient(180deg,#3a121b,#1a070c)' });
    E.from(C.img, { s: .94, y: 30 }, .6, 0, 'out');
    E.wait(.5);
    E.say('baron', '延びた日付だけを見る者は、多い。', { talk: C.img, talkAmp: 2 });
    C.swap(CH('baron_e_scheme'));
    E.say('baron', '何が止まったのかを読む者は、少ない。', { talk: C.img, talkAmp: 2 });
    E.wait(.5);
  });

  /* ============================================================ S11 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 707 });
    [['T', P.T_BLUE], ['I', P.I_ORANGE]].forEach(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
    });
    const st = P.sticky(g, '第8章<br>4月24日 17時45分', { x: 1320, y: 120, w: 520, h: 250, rot: 5, size: 44 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第8章だブー。', { talk: pig, talkAmp: 5 });
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
