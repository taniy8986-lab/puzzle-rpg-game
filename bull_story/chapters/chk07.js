// 完全版 第7章「決算延期」（2026年4月13日〜4月23日）
// 台本: story/k/k07_決算延期.md　元資料 p6・p7・p10・p13・p15・p21・p29・p30・p35・p37／ユーザー提供の投稿スクリーンショット（2026/10/18）
// 投稿は元資料の要約（本人の見解）。4/15（一覧外）と T27 は投稿の画面（P.postShot）と本文の字幕（E.cap・声なし）。
// 有名投資家の名前・アカウント・アイコンは出さない。ブルちゃんの保有はフィクション
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
    const n = P.kNotice(g, { x: 40, y: 340, w: 1840, size: 26, posts: true });
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
    E.narr('4月13日の、10時22分の投稿。', { delay: .6 });
    E.say('hat', '元資料の要約では、25日線と200日線が交わる、ゴールデンクロスに触れた投稿だ。', { yomi: 'もとしりょうの、ようやくでは、にじゅうごにちせんと、にひゃくにちせんが交わる、ゴールデンクロスに触れた投稿だ。' });
    E.say('hat', '取引時間の途中に、チャートについて書いた投稿だ。');
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
    const gn = E.div(g, { left: X0, top: Y1 + 14, width: X1 - X0, textAlign: 'right', font: '800 24px/1.3 Round', color: 'rgba(243,230,200,.8)', whiteSpace: 'nowrap' }, '線の形はイメージ。平均線の計算は元資料 p35 のとおり。ゴールデンクロスの意味は、一般的な説明').ini({ o: 0 });
    E.show(gn, .3, .3);
    E.wait(.3);
    let L = E.say('hat', '25日線は、その日までの、25日分の終値を、平均してつないだ線だ。', { wait: false, yomi: 'にじゅうごにちせんは、その日までの、にじゅうごにちぶんの、おわりねを、平均して、つないだ線だ。' });
    E.tw(st, 1.6, { draw: [0, 1] }, 'inOut', .3); E.show(sl, .3, .8);
    E.at(L.end);
    L = E.say('hat', '200日線は、同じように、200日分の終値を、平均してつないだ線だ。', { wait: false, yomi: 'にひゃくにちせんは、おなじように、にひゃくにちぶんの、おわりねを、平均して、つないだ線だ。' });
    E.tw(lg, 1.2, { draw: [0, 1] }, 'inOut', .2); E.show(ll, .3, .8);
    E.at(L.end);
    E.say('hat', '終値は、その日の取引で、最後に付いた値段だ。', { yomi: 'おわりねは、その日の取引で、最後に付いた値段だ。' });
    L = E.say('hat', 'ゴールデンクロスは、短い期間の平均線が、長い期間の平均線を、下から上に抜けることだ。', { wait: false });
    const gx = P.circle(g, { x: X0 + cx, y: Y0 + cy, w: 90, h: 90, color: '#ffd84a', delay: L.dur * .6, dur: .4 });
    E.at(L.end);
    [lg, st, ll, sl, tt, gx, gn].forEach(n => E.hide(n, .3));
    const v13 = panel(g, { x: 260, y: 300, w: 1400, h: 150, size: 44, html: '<span style="font:800 30px Round;color:#6a6066">4/13 終値で</span><span style="color:#e8a33a">25日線 803.60円</span><span style="font:800 30px Round;color:#6a6066">が、</span><span style="color:#7d4fc2">200日線 799.42円</span><span style="font:800 30px Round;color:#6a6066">を上回った</span>' });
    const v10 = panel(g, { x: 260, y: 500, w: 1400, h: 130, size: 38, html: '<span style="font:800 28px Round;color:#6a6066">4/10は、</span><span style="color:#e8a33a">25日線 790.92円</span><span style="font:800 28px Round;color:#6a6066">が、</span><span style="color:#7d4fc2">200日線 799.48円</span><span style="font:800 28px Round;color:#6a6066">より、まだ下</span>' });
    const pre = panel(g, { x: 260, y: 370, w: 1400, h: 130, size: 38, dark: true, html: '投稿は 10:22。取引の途中で、4/13 の終値は、まだ出ていない' });
    L = E.say('hat', '投稿は、10時22分。取引の途中で、その日の終値は、まだ出ていない。', { wait: false, delay: .3, yomi: '投稿は、10時22分。取引の途中で、その日の、おわりねは、まだ出ていない。' });
    E.tw(pre, .4, { o: [0, 1], y: [20, 0] }, 'back', .5);
    E.at(L.end);
    E.hide(pre, .3);
    L = E.say('hat', '元資料は、その日の終値を使って、平均線を、計算し直している。', { wait: false, yomi: 'もとしりょうは、その日の、おわりねを使って、平均線を、計算し直している。' });
    E.tw(v13, .45, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '4月13日の終値で計算すると、25日線は、803.60円。', { yomi: '4月13日の、おわりねで計算すると、にじゅうごにちせんは、ハッピャクサンテンロクマルえん。' });
    E.say('hat', '200日線は、799.42円で、25日線のほうが、上にあった。', { yomi: 'にひゃくにちせんは、ナナヒャクキュージューキューテンヨンニえんで、にじゅうごにちせんのほうが、うえにあった。' });
    L = E.say('hat', '一つ前の取引日の、4月10日は、25日線が、790.92円。', { wait: false, yomi: 'ひとつまえの、とりひきびの、4月10日は、にじゅうごにちせんが、ナナヒャクキュージューテンキューニえん。' });
    E.tw(v10, .45, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2, gain: .5 });
    E.at(L.end);
    E.say('hat', '200日線は、799.48円で、25日線のほうが、まだ下だった。', { yomi: 'にひゃくにちせんは、ナナヒャクキュージューキューテンヨンハチえんで、にじゅうごにちせんのほうが、まだ、しただった。' });
    E.say('hat', '4月10日は下で、4月13日は上。だから、下から上に抜けたのは、4月13日だ。', { yomi: '4月10日は、したで、4月13日は、うえ。だから、したから、うえに抜けたのは、4月13日だ。' });
    E.say('hat', '投稿が触れたゴールデンクロスは、終値で計算しても、起きていた。', { yomi: '投稿が触れた、ゴールデンクロスは、おわりねで計算しても、起きていた。' });
    E.say('hat', '元資料も、この点は、数字で確かめられた、としている。', { yomi: 'もとしりょうも、この点は、すうじで、確かめられた、としている。' });
    E.wait(.3);
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
    E.say('hat', '同じ日の、16時30分。取引が終わったあとに、会社が開示を出した。', { delay: .6 });
    E.say('hat', '決算の発表を延ばし、新しい発表の日は、4月20日を見込む、という内容だ。');
    E.say('hat', '理由は、一部の取引の、収益の計上について、監査法人が、追加の確認を求めたことだ。', { yomi: 'りゆうは、一部の取引の、しゅうえきの、けいじょうについて、監査法人が、追加の確認を求めたことだ。' });
    const gen = panel(g, { x: 260, y: 730, w: 1400, h: 110, size: 27, html: '<div style="text-align:center">収益認識は、売上などを、どの期の決算に、いくら入れるかを決めること<br>監査法人は、会社の決算が正しいかを、外から確かめる法人<span style="font:800 22px Round;color:#6a6066">（一般的な説明）</span></div>' });
    let L = E.say('hat', 'カードの収益認識は、売上などを、どの期の決算に、いくら入れるかを、決めることだ。', { wait: false, yomi: 'カードの、しゅうえきにんしきは、うりあげなどを、どのきの、けっさんに、いくら入れるかを、決めることだ。' });
    E.tw(i31, .3, { y: -40 }, 'inOut', .1);
    E.tw(gen, .4, { o: [0, 1], y: [20, 0] }, 'back', .3);
    E.at(L.end);
    E.say('hat', '監査法人は、会社の決算が正しいかを、外から確かめる立場の法人だ。', { yomi: 'かんさほうじんは、会社の決算が、正しいかを、そとから確かめる、立場の、ほうじんだ。' });
    E.hide(gen, .3);
    const ord = panel(g, { x: 260, y: 730, w: 1400, h: 100, size: 34, dark: true, html: '投稿の時点（10:22）では、決算の延期は、まだ公表されていなかった' });
    L = E.say('hat', '投稿は、10時22分。その時点で、決算の延期は、まだ公表されていない。', { wait: false, delay: .2 });
    E.tw(ord, .4, { o: [0, 1], y: [20, 0] }, 'back', .2 + L.dur * .4); E.sfx('ding', { delay: .2 + L.dur * .4, gain: .5 });
    E.at(L.end);
    E.say('hat', '同じ日でも、チャートについての投稿が先で、延期の公表は、取引が終わったあとだった。');
    E.wait(.4);
  });

  /* ============================================================ S3 4月14日・15日・17日 */
  E.scene({ name: 't25' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    bar(g, [4, 13], [4, 14]);
    const t25 = P.tcard(g, { id: 'T25', when: '2026/4/14 10:41', kind: '需給', session: '取引時間内', text: '総会賛成者の長期保有と浮動株減少を推測', note: '賛成率から実際の保有継続や売買主体までは確認できない', x: 260, y: 140, w: 1400, size: 40 });
    tIn(t25);
    E.wait(1.0);
    E.narr('4月14日の、10時41分の投稿。');
    E.say('hat', '元資料の要約では、総会で賛成した株主が、長く持ち続ける、と推測した投稿だ。', { yomi: 'もとしりょうの、ようやくでは、総会で賛成した株主が、長く持ち続ける、と推測した投稿だ。' });
    E.say('hat', 'そうなれば、市場に出回る株が減る、という推測も書いている。');
    E.say('hat', 'カードの浮動株は、大株主などが長く持つ株を除いた、売り買いされやすい株だ。', { yomi: 'カードの、ふどうかぶは、おおかぶぬしなどが、長く持つ株を、のぞいた、売り買いされやすい株だ。' });
    E.say('hat', '区分の需給は、買いたい人と、売りたい人の、釣り合いのことだ。', { yomi: 'くぶんの、じゅきゅうは、かいたいひとと、うりたいひとの、つりあいのことだ。' });
    E.say('hat', 'でも、賛成の割合は、総会の時に、議案に賛成した票の割合だ。');
    E.say('hat', 'その株主が、今も持ち続けているのかは、賛成の割合からは、分からない。');
    E.say('hat', '誰が売り買いしているのかも、そこからは、確かめられない。');
    E.wait(.2);
  });

  // 4月15日：元資料の一覧にない投稿（ユーザー提供の画面）。投稿の時刻は画面にない（添付画像は 14:39）
  E.scene({ name: 'p08' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 14], [4, 15]);
    const card = P.postShot(g, {
      id: '一覧外', listed: false, when: '2026/4/15（画像 14:39）', text: 'p08_text', imgs: ['p08_img'], x: 322, y: 108, h: 736,
      rows: [
        { label: '確認メモ', text: '投稿の時刻は画面に出ていない。添付の画面は4/15の14:39のもので、この時点で、<span style="white-space:nowrap">始値は993円、</span><span style="white-space:nowrap">安値は970円、</span><span style="white-space:nowrap">現在値は989円</span>', color: '#5a6b88' },
        { label: '確認メモ', text: '元資料の日足（p7）でも、4/15の足に下ヒゲがある。指値の買いが待っているかは、画面に板が写っておらず、元資料も一日を通した板のデータを調べていないため、確認できない', color: '#5a6b88', show: false },
      ],
    });
    E.tw(card, .45, { o: [0, 1], y: [30, 0] }, 'back', .4); E.sfx('notify', { delay: .4 });
    E.wait(1.2);
    E.narr('4月15日。元資料の一覧には載っていない、投稿がある。', { yomi: '4月15日。もとしりょうの一覧には載っていない、投稿がある。' });
    E.narr('投稿の時刻は、画面に出ていない。添付の画面は、14時39分のものだ。');
    E.cap('3260 エスポア\n日々、下髭つけてるけど');
    E.cap('買いは指値で投げ物待ってる状態');
    E.say('hat', 'この投稿は、エスポアの、日足のチャートの画面を付けている。');
    E.say('hat', '日足は、1日の値動きを、1本のローソク足にした、チャートだ。', { yomi: 'ひあしは、いちにちの値動きを、いっぽんの、ローソク足にした、チャートだ。' });
    E.say('hat', '書いているのは、毎日のように、下ヒゲが付いていること。', { yomi: '書いているのは、毎日のように、したヒゲが付いていること。' });
    E.say('hat', '下ヒゲは、ローソク足の、太い部分の下に伸びた、細い線だ。', { yomi: 'したヒゲは、ローソクあしの、ふとい部分の、したに伸びた、ほそい線だ。' });
    E.say('hat', 'その日、値段が一度下がってから、戻ったことを表す。', { yomi: 'その日、ねだんが、いちど下がってから、戻ったことを表す。' });
    E.say('hat', 'そして、買いの注文は指値で、売りが出るのを待っている、という見方だ。', { yomi: 'そして、買いの注文は、さしねで、売りが出るのを待っている、という見方だ。' });
    E.say('hat', '指値は、買う値段や売る値段を、決めて出す注文だ。', { yomi: 'さしねは、かう値段や、うる値段を、決めて出す注文だ。' });
    let L = E.say('hat', '14時39分の画像では、この日は993円で始まり、970円まで下がった。', { wait: false, yomi: '14時39分の画像では、この日は、きゅうひゃくきゅうじゅうさんえんで始まり、きゅうひゃくななじゅうえんまで下がった。' });
    // 添付画像の中の位置（card.at はカードの左の太線 12px の分を含まないので足す）
    const at = (px, py) => { const q = card.at(0, px, py); return { x: q.x + 12, y: q.y }; };
    const hl = (q, w, h, d) => { const n = E.div(g, { left: q.x - w / 2, top: q.y - h / 2, width: w, height: h, borderRadius: 10, border: '4px solid #ffd84a', boxShadow: '0 0 12px rgba(255,216,74,.7)' }).ini({ o: 0 }); E.pop(n, .3, d, .7); E.sfx('pop', { delay: d, gain: .4 }); return n; };
    hl(at(618, 571), 118, 34, L.dur * .3);
    hl(at(361, 571), 118, 34, L.dur * .65);
    E.at(L.end);
    L = E.say('hat', 'そして、14時39分には、989円まで戻している。', { wait: false, yomi: 'そして、14時39分には、きゅうひゃくはちじゅうきゅうえんまで戻している。' });
    hl(at(282, 277), 300, 58, .2);
    E.at(L.end);
    L = E.say('hat', '安値の970円から、989円までの線が、この時点の下ヒゲだ。', { wait: false, yomi: 'やすねの、きゅうひゃくななじゅうえんから、きゅうひゃくはちじゅうきゅうえんまでの線が、この時点の、したヒゲだ。' });
    const wk = at(690, 732);
    P.circle(g, { x: wk.x, y: wk.y, w: 36, h: 52, sw: 5, color: '#ffd84a', delay: L.dur * .45, dur: .35, seed: 5 });
    E.at(L.end);
    L = E.say('hat', '元資料の日足のチャートでも、4月15日の足には、下ヒゲがある。', { wait: false, yomi: 'もとしりょうの、ひあしのチャートでも、4月15日の足には、したヒゲがある。' });
    E.show(card.rows[1], .3, L.dur * .3);
    E.at(L.end);
    E.say('hat', 'だから、この日に下ヒゲが付いたことは、確かめられる。', { yomi: 'だから、この日に、したヒゲが付いたことは、確かめられる。' });
    E.say('hat', '確かめられないのは、指値の買いが、待っているかどうかだ。', { yomi: '確かめられないのは、さしねの買いが、待っているかどうかだ。' });
    E.say('hat', 'まだ成立していない注文は、板に並ぶ。', { yomi: 'まだ、成立していない注文は、いたに並ぶ。' });
    E.say('hat', '板は、売りと買いの注文を、値段ごとに並べた表だ。', { yomi: 'いたは、うりと、かいの注文を、ねだんごとに、ならべた、ひょうだ。' });
    E.say('hat', 'でも、この画面はチャートで、板は写っていない。', { yomi: 'でも、この画面は、チャートで、いたは写っていない。' });
    E.say('hat', '元資料も、一日を通した板のデータは、調べた範囲に入っていない、と書いている。', { yomi: 'もとしりょうも、いちにちを通した、いたのデータは、しらべた、はんいに、入っていない、と書いている。' });
    E.say('hat', 'だから、指値の買いが待っていたかどうかは、確認できない。', { yomi: 'だから、さしねの買いが、待っていたかどうかは、確認できない。' });
    E.say('hat', '買いの注文を、誰が、どんなつもりで出していたのかも、確認できない。');
    E.wait(.3);
  });

  E.scene({ name: 't26' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 15], [4, 17]);
    const t26 = P.tcard(g, { id: 'T26', when: '2026/4/17 9:16', kind: '需給', session: '取引時間内', text: '買い戻しとみられる買いに売りが出ないと発言', note: '実際の買い戻しか、新規買いかは日足・出来高だけでは識別できない', x: 260, y: 140, w: 1400, size: 40 });
    tIn(t26);
    E.wait(1.0);
    E.narr('4月17日の、9時16分の投稿。');
    E.say('hat', '元資料の要約では、買い戻しとみられる買いに、売りが出ない、という見方を書いた投稿だ。', { yomi: 'もとしりょうの、ようやくでは、買い戻しとみられる買いに、売りが出ない、という見方を書いた投稿だ。' });
    E.wait(.2);
  });

  E.scene({ name: 'buyback' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 17], [4, 17]);
    const tt = P.heading(g, '「買い戻し」か「新しい買い」か', 110);
    E.show(tt, .3);
    const box = (x, t, sub, c) => E.div(g, { left: x, top: 250, width: 620, height: 300, borderRadius: 26, background: 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="font:900 46px/1.3 Zen;color:${c};padding-top:50px">${t}</div><div style="font:800 28px/1.6 Round;color:#4a4552;margin-top:20px">${sub}</div>`).ini({ o: 0 });
    const b1 = box(280, '買い戻し', '空売りしていた人が、<br>株を買って返す', '#2b68d8'), b2 = box(1020, '新しい買い', '空売りとは関係なく、<br>新しく株を買う', '#d22d68');
    const gen = E.div(g, { left: 280, top: 560, width: 1360, textAlign: 'right', font: '800 24px/1.3 Round', color: 'rgba(243,230,200,.8)', whiteSpace: 'nowrap' }, '空売りは、株を借りて先に売り、あとで買って返す取引（一般的な説明）').ini({ o: 0 });
    const same = panel(g, { x: 310, y: 620, w: 1300, h: 120, size: 36, html: '日足と出来高だけでは、買い戻しか、新しい買いかは、見分けられない' });
    E.wait(.3);
    let L = E.say('hat', '空売りは、株を借りて先に売り、あとで買って返す、取引だ。', { wait: false, yomi: 'からうりは、かぶを借りて、さきに売り、あとで、かって返す、取引だ。' });
    E.show(gen, .3, .3);
    E.at(L.end);
    L = E.say('hat', '買い戻しは、空売りをしていた人が、株を買って返すことだ。', { wait: false });
    E.tw(b1, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2 });
    E.at(L.end);
    L = E.say('hat', '新しい買いは、空売りとは関係なく、新しく株を買うことだ。', { wait: false });
    E.tw(b2, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2 });
    E.at(L.end);
    E.say('hat', 'ある買いが、買い戻しなのか、新しい買いなのか。');
    L = E.say('hat', 'それは、日足と出来高だけでは、見分けられない。', { wait: false, yomi: 'それは、日足と、できだかだけでは、見分けられない。' });
    E.tw(same, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .4); E.sfx('ding', { delay: L.dur * .4, gain: .5 });
    E.at(L.end);
    E.say('hat', '日足と出来高に残るのは、その日の値段と、売り買いされた株の数だけだ。', { yomi: '日足と、できだかに残るのは、その日の値段と、売り買いされた株の数だけだ。' });
    E.say('hat', '買った人が、空売りを返すために買ったのかどうかは、そこには残らない。');
    E.say('hat', '元資料の検証メモも、日足と出来高だけでは、見分けられない、としている。', { yomi: 'もとしりょうの検証メモも、日足と、できだかだけでは、見分けられない、としている。' });
    E.wait(.3);
  });

  // T27：投稿の画面（添付画像なし）。元資料の要約と検証メモを並べる
  E.scene({ name: 't27' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 17], [4, 17]);
    const card = P.postShot(g, {
      id: 'T27', when: '2026/4/17 9:52', text: 'p09_text', imgs: [], x: 388, y: 108, h: 720, textW: 1100,
      rows: [
        { label: '元資料の要約', text: '売り方が急いでいるとの見方' },
        { label: '検証メモ', text: '売買主体の動機は本人の推測。', show: false },
      ],
    });
    E.tw(card, .45, { o: [0, 1], y: [30, 0] }, 'back', .4); E.sfx('notify', { delay: .4 });
    E.wait(1.2);
    E.narr('同じ日の、9時52分の投稿。');
    E.cap('3260 エスポア\n売り方のバタバタ具合見てたら何か知らんけど急いでるんやろ');
    E.cap('まあどっちにしても\n無茶してたらしんどなるわな');
    E.say('hat', 'この投稿には、画像が付いていない。文だけの投稿だ。');
    E.say('hat', '画面の日時は、4月17日の9時52分だ。');
    E.say('hat', '元資料の一覧のT27と、日付も時刻も、同じだ。', { yomi: 'もとしりょうの一覧の、ティーにじゅうななと、日付も時刻も、同じだ。' });
    E.say('hat', '前半は、売っている側が、急いでいるようだ、という見方だ。');
    E.say('hat', '元資料の要約も、この投稿を、そういう見方の投稿としている。', { yomi: 'もとしりょうの、ようやくも、この投稿を、そういう見方の投稿としている。' });
    E.say('hat', '急いでいる理由は、投稿の中でも、示されていない。');
    E.say('hat', '後半は、売っている側が無理をしていれば、あとで苦しくなる、という見通しだ。');
    E.say('hat', '売り注文には、出した人の名前は出ない。', { yomi: '売り注文には、出した人の、なまえは出ない。' });
    E.say('hat', '売っていたのが誰なのか、空売りをしていた人なのかは、確かめられない。');
    E.say('hat', '板なのか、値動きなのか。何を見てそう書いたのかも、本文には書かれていない。', { yomi: 'いたなのか、値動きなのか。何を見てそう書いたのかも、ほんぶんには書かれていない。' });
    const m = P.mark(g, '本人の推測', { x: 1190, y: 684, color: P.T_BLUE, size: .8, rot: -5 });
    const L = E.say('hat', '元資料の検証メモも、売り買いしている人の動機は、本人の推測だ、としている。', { wait: false, yomi: 'もとしりょうの検証メモも、売り買いしている人の動機は、本人の推測だ、としている。' });
    E.show(card.rows[1], .3, .2);
    P.stampIn(m, L.dur * .55);
    E.at(L.end);
    E.say('hat', '元資料によると、値段と出来高だけでは、売り買いの相手や意図は、決められない。', { yomi: 'もとしりょうによると、値段と、できだかだけでは、売り買いの相手や、意図は、決められない。' });
    E.wait(.3);
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
    E.say('hat', '週足は、1週間の値動きを、1本のローソク足にした、チャートだ。', { yomi: 'しゅうあしは、いっしゅうかんの値動きを、いっぽんの、ローソク足にした、チャートだ。' });
    E.say('hat', '3本の線は、13週、26週、52週の、終値の平均をつないだ線だ。', { yomi: 'さんぼんの線は、じゅうさんしゅう、にじゅうろくしゅう、ごじゅうにしゅうの、おわりねの、平均を、つないだ線だ。' });
    let L = E.say('hat', '2026年に、値段が上がって戻ったのは、1,000円までだった。', { wait: false, yomi: '2026年に、ねだんが、上がって戻ったのは、せんえんまでだった。' });
    E.tw(ln, 1.0, { sx: [0, 1] }, 'inOut', .3); P.circle(g, { x: p.x, y: p.y, w: 60, h: 60, color: '#ffd84a', delay: L.dur * .6, dur: .35 });
    E.at(L.end);
    L = E.say('hat', '4月14日と17日に、1,000円をつけている。', { wait: false, yomi: '4月14日と17日に、せんえんをつけている。' });
    E.pop(lb, .35, .2);
    E.at(L.end);
    L = E.say('hat', '1,000円は、2024年の高値、1,880円より、46.81％低い水準だ。', { wait: false, yomi: 'せんえんは、2024年の高値、せんはっぴゃくはちじゅうえんより、ヨンジューロクテンハチイチパーセント低い水準だ。' });
    P.circle(g, { x: pk.x, y: pk.y, w: 60, h: 60, delay: .2, dur: .35 }); E.pop(pkLab, .35, .3);
    E.at(L.end);
    E.say('hat', '日足では、4月13日に、25日線が200日線を、下から上に抜けた。', { yomi: '日足では、4月13日に、にじゅうごにちせんが、にひゃくにちせんを、下から上に抜けた。' });
    E.say('hat', 'でも、週足で見ると、値段は、2024年の高値より、まだずっと下にある。');
    const no = E.div(sc.root, { left: 360, top: 740, width: 1200, height: 100, borderRadius: 22, background: '#2a2430', border: '3px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 34px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '日足のゴールデンクロスだけで、流れが変わったとは言い切れない').ini({ o: 0 });
    L = E.say('hat', '元資料は、日足のゴールデンクロスだけで、週足の流れが変わったとは、決めていない。', { wait: false, yomi: 'もとしりょうは、日足の、ゴールデンクロスだけで、しゅうあしの流れが、変わったとは、決めていない。' });
    E.tw(no, .4, { o: [0, 1], y: [20, 0] }, 'back', .3);
    E.at(L.end);
    E.say('hat', '実際に、4月の短い改善のあと、値段は、また下がり始めた。', { yomi: 'じっさいに、4月の、みじかい改善のあと、ねだんは、また下がり始めた。' });
    E.say('hat', 'ただ、元資料は、あとの結果と、その時のチャートの形は、分けて評価する、としている。', { yomi: 'ただ、もとしりょうは、あとの結果と、その時のチャートの形は、分けて評価する、としている。' });
    E.wait(.4);
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
    E.say('hat', '4月20日の、17時45分。取引が終わったあとの開示だ。');
    E.say('hat', '会社は、4月20日に予定していた決算の発表を、4月24日に延ばした。');
    E.say('hat', '決算の発表が延びたのは、これで2回目だ。', { yomi: '決算の発表が延びたのは、これで、にかいめだ。' });
    const pair = [['サービスの中身（役務）', '#2b68d8'], ['取引の代金（対価）', '#b8651a']].map(([t, c], i) => E.div(g, { left: 260 + i * 760, top: 480, width: 640, height: 150, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 40px/1.2 Zen', color: c, boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, t).ini({ o: 0 }));
    const q = E.div(g, { left: 900, top: 500, width: 120, textAlign: 'center', font: '900 80px/1.2 Zen', color: '#ffd84a' }, '？').ini({ o: 0 });
    const gen = E.div(g, { left: 260, top: 660, width: 1400, textAlign: 'center', font: '800 26px/1.4 Round', color: 'rgba(243,230,200,.85)', whiteSpace: 'nowrap' }, '役務は、サービスや作業のこと。対価は、その代わりに受け取るお金のこと（一般的な説明）').ini({ o: 0 });
    E.say('hat', '理由は、ある取引について、追加の精査、つまり、さらに詳しく調べる必要が出たことだ。', { yomi: 'りゆうは、ある取引について、追加の、せいさ、つまり、さらに詳しく調べる必要が出たことだ。' });
    let L = E.say('hat', '調べるのは、提供したサービスの中身と、その代金が、見合っているかどうかだ。', { wait: false });
    pair.forEach((p, i) => { E.tw(p, .4, { o: [0, 1], y: [20, 0] }, 'back', .2 + i * L.dur * .3); E.sfx('pop', { delay: .2 + i * L.dur * .3, gain: .5 }); });
    E.pop(q, .35, L.dur * .65, .5);
    E.at(L.end);
    L = E.say('hat', 'カードの役務は、サービスや作業のこと。対価は、その代わりに受け取るお金のことだ。', { wait: false, yomi: 'カードの、えきむは、サービスや作業のこと。たいかは、その代わりに受け取る、お金のことだ。' });
    E.show(gen, .3, .3);
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
    E.narr('4月20日の、18時07分の投稿。再延期の公表の、22分後だ。', { yomi: '4月20日の、18時7分の投稿。再延期の公表の、22分後だ。' });
    E.say('hat', '元資料の要約では、決算の延期を、仕込みの機会と捉える見方を書いた投稿だ。', { yomi: 'もとしりょうの、ようやくでは、決算の延期を、しこみの機会と捉える、見方を書いた投稿だ。' });
    E.say('hat', '仕込みは、株の言葉で、値上がりを見込んで、株を買っておくことだ。', { yomi: 'しこみは、かぶの言葉で、ねあがりを見込んで、かぶを買っておくことだ。' });
    E.say('hat', '検証メモは、投稿の時刻と、次の日の値動きを、書き留めている。', { yomi: '検証メモは、投稿の時刻と、次の日の、ねうごきを、書き留めている。' });
    E.say('hat', '次の日の4月21日は、安値が819円まで下がり、終値は892円だった。', { yomi: '次の日の4月21日は、やすねが、はっぴゃくじゅうきゅうえんまで下がり、おわりねは、はっぴゃくきゅうじゅうにえんだった。' });
    E.say('hat', 'カードの892円引けは、終値が892円だった、という意味だ。', { yomi: 'カードの、はっぴゃくきゅうじゅうにえん、ひけは、おわりねが、はっぴゃくきゅうじゅうにえんだった、という意味だ。' });
    E.say('hat', '元資料は、投稿の前後の値動きは、投稿が原因だった証明ではない、としている。', { yomi: 'もとしりょうは、投稿の前後の、ねうごきは、投稿が原因だった、証明ではない、としている。' });
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
    let L = E.say('hat', '4月20日の安値は、969円だった。', { wait: false, yomi: '4月20日の、やすねは、きゅうひゃくろくじゅうきゅうえんだった。' });
    E.pop(t1, .3, .2);
    E.at(L.end);
    L = E.say('hat', '次の日の4月21日は、高値でも、934円までだった。', { wait: false, yomi: '次の日の4月21日は、たかねでも、きゅうひゃくさんじゅうよえんまでだった。' });
    E.pop(t2, .3, L.dur * .4);
    E.at(L.end);
    L = E.say('hat', '934円から969円のあいだでは、この2日間、売り買いが一度も成立していない。', { wait: false, yomi: 'きゅうひゃくさんじゅうよえんから、きゅうひゃくろくじゅうきゅうえんの、あいだでは、このふつかかん、売り買いが、いちども、成立していない。' });
    E.tw(band, .8, { sx: [0, 1] }, 'out', .2); E.sfx('slide', { delay: .2, gain: .5 });
    E.at(L.end);
    L = E.say('hat', 'このように、ローソク足とローソク足のあいだに空いた、すき間を、窓という。', { wait: false, yomi: 'このように、ローソクあしと、ローソクあしの、あいだに空いた、すきまを、まどという。' });
    E.pop(wl, .3, L.dur * .6);
    E.at(L.end + .4);
  });

  E.scene({ name: 't29t30' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 20], [4, 21]);
    const t29 = P.tcard(g, { id: 'T29', when: '2026/4/21 10:02', kind: '需給', session: '取引時間内', text: '寄り前の大口売り注文と買い戻しの必要性を推測', note: '注文主体や見せ板との同一性は未確認。日足には819円からの戻りが記録される', x: 260, y: 140, w: 1400, size: 40 });
    tIn(t29);
    E.wait(1.0);
    E.narr('4月21日の、10時02分の投稿。', { yomi: '4月21日の、10時2分の投稿。' });
    E.say('hat', '元資料の要約では、取引が始まる前の、大きな売り注文について書いた投稿だ。', { yomi: 'もとしりょうの、ようやくでは、取引が始まる前の、大きな売り注文について書いた投稿だ。' });
    E.say('hat', 'そして、買い戻しが必要になる、と推測している。');
    E.say('hat', '板に出る注文には、出した人の名前は付いていない。', { yomi: 'いたに出る注文には、出した人の、なまえは付いていない。' });
    E.say('hat', '検証メモによると、大きな売り注文を、誰が出したのかは、確かめられていない。');
    E.say('hat', 'その注文が、本人の見方どおりの注文だったのかも、確かめられていない。', { yomi: 'その注文が、本人の見方どおりの、注文だったのかも、確かめられていない。' });
    E.say('hat', 'さっきと同じで、値段と出来高だけでは、注文の相手や意図は、決められない。', { yomi: 'さっきと同じで、値段と、できだかだけでは、注文の相手や、意図は、決められない。' });
    E.say('hat', '日足に残っているのは、この日、819円まで下がってから、892円まで戻したことだ。', { yomi: '日足に残っているのは、この日、はっぴゃくじゅうきゅうえんまで下がってから、はっぴゃくきゅうじゅうにえんまで戻したことだ。' });
    E.say('hat', 'この戻りが、買い戻しによるものかどうかも、日足からは、見分けられない。', { yomi: 'この戻りが、かいもどしによるものかどうかも、ひあしからは、見分けられない。' });
    const t30 = P.tcard(g, { id: 'T30', when: '2026/4/21 15:02', kind: 'チャート', session: '取引時間内', text: '数日以内に上方の窓を埋めると予想', note: '添付はエスポア日足。4月20日安値969円と21日高値934円の窓は、その後も埋まらなかった', x: 260, y: 140, w: 1400, size: 40 });
    swap(t29, t30);
    E.narr('同じ日の、15時02分。まだ、取引時間の中の投稿だ。', { delay: .8, yomi: '同じ日の、15時2分。まだ、取引時間の中の投稿だ。' });
    E.say('hat', '元資料の要約では、数日のうちに、上にある窓を埋める、と予想した投稿だ。', { yomi: 'もとしりょうの、ようやくでは、数日のうちに、上にある窓を埋める、と予想した投稿だ。' });
    E.say('hat', '元資料によると、この投稿には、エスポアの日足が付いていた。', { yomi: 'もとしりょうによると、この投稿には、エスポアの日足が付いていた。' });
    E.say('hat', '元資料は、この窓を、さっき見た、934円から969円のすき間として、確かめている。', { yomi: 'もとしりょうは、この、まどを、さっき見た、きゅうひゃくさんじゅうよえんから、きゅうひゃくろくじゅうきゅうえんの、すきまとして、確かめている。' });
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
    E.say('hat', '窓が埋まるのは、値段が戻って、窓の上の969円に届いた時だ。', { yomi: '窓がうまるのは、値段が戻って、窓の上の、きゅうひゃくろくじゅうきゅうえんに届いた時だ。' });
    let L = E.say('hat', '4月22日から24日の高値は、885円、875円、913円。', { wait: false, yomi: '4月22日から24日の高値は、はっぴゃくはちじゅうごえん、はっぴゃくななじゅうごえん、きゅうひゃくじゅうさんえん。' });
    hs.forEach((h, i) => { const d = .2 + i * L.dur * .28; P.circle(g, { x: h.p.x, y: h.p.y, w: 22, h: 22, sw: 3, delay: d, dur: .3 }); E.pop(h.n, .3, d + .1); });
    E.at(L.end);
    const st = P.mark(sc.root, '未達', { x: 1460, y: 140, color: '#c62828', size: .8, rot: 8, w: 160 });
    E.say('hat', 'どの日も、窓の上の969円には、届かなかった。', { yomi: 'どの日も、窓の上の、きゅうひゃくろくじゅうきゅうえんには、届かなかった。' });
    L = E.say('hat', '元資料の検証は、数日のうちに窓を埋める、という予想を、未達としている。', { wait: false, yomi: 'もとしりょうの検証は、すうじつのうちに、まどを、うめる、という予想を、みたつとしている。' });
    P.stampIn(st, L.dur * .75);
    E.at(L.end);
    E.say('hat', '予想した数日のうちに、969円まで戻ることは、なかったからだ。', { yomi: '予想した、すうじつのうちに、きゅうひゃくろくじゅうきゅうえんまで、戻ることは、なかったからだ。' });
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
    const r1 = row(200, '4/13', '収益の計上に追加の確認が必要になり、決算発表を4/20へ延期した', '対象の取引の資料や、関係者への確認が、まだ終わっていなかった');
    const r2 = row(420, '4/20', '役務の内容と対価の対応を精査し、監査法人・名証との協議を踏まえて、4/24へ再延期した', '予定日が変わっただけでなく、計上した利益が妥当かどうかが論点になった');
    E.wait(.3);
    E.tw(r1, .4, { o: [0, 1], x: [-40, 0] }, 'back', .1); E.sfx('slide', { delay: .1 });
    E.say('hat', '延期で止まっていたのは、日付だけじゃない。', { delay: .3 });
    E.say('hat', '1回目の、4月13日の延期では、収益の計上に、追加の確認が必要になった。', { yomi: 'いっかいめの、4月13日の延期では、収益の、けいじょうに、追加の確認が必要になった。' });
    E.say('hat', '元資料は、この時点を、次のように読んでいる。', { yomi: 'もとしりょうは、この時点を、次のように読んでいる。' });
    E.say('hat', '対象の取引の資料や、関係者への確認が、まだ終わっていなかった。');
    E.say('hat', '元資料によると、確かめていたのは、利益のもとになる、取引の実態だ。', { yomi: 'もとしりょうによると、確かめていたのは、りえきの、もとになる、取引の、じったいだ。' });
    const q = panel(g, { x: 260, y: 650, w: 1400, h: 110, size: 36, html: '<span>サービスを、本当に提供したのか。</span><span>その中身に見合う、対価だったのか。</span>' });
    let L = E.say('hat', 'サービスを、本当に提供したのか。その中身に見合う、対価だったのか。', { wait: false });
    E.tw(q, .4, { o: [0, 1], y: [20, 0] }, 'back', .2);
    E.at(L.end);
    E.say('hat', 'その取引の売上を、決算に入れてよいかで、利益の額が変わる。', { yomi: 'その取引の、うりあげを、決算に入れてよいかで、りえきの額が変わる。' });
    E.say('hat', '純資産は、会社の持ち物から、借りているものを、引いた残りだ。', { yomi: 'じゅんしさんは、会社の持ち物から、借りているものを、引いた残りだ。' });
    E.say('hat', 'その期の利益は、純資産に足される。だから、利益が変われば、純資産も変わる。', { yomi: 'その期の、りえきは、じゅんしさんに、足される。だから、りえきが変われば、じゅんしさんも変わる。' });
    E.say('hat', '元資料は、利益と、純資産の両方を左右する、確認だった、としている。', { yomi: 'もとしりょうは、りえきと、じゅんしさんの、両方を左右する、確認だった、としている。' });
    L = E.say('hat', '2回目の、4月20日の延期では、会社は、役務の内容と対価の対応を、詳しく調べた。', { wait: false, yomi: 'にかいめの、4月20日の延期では、会社は、えきむの内容と、たいかの対応を、詳しく調べた。' });
    E.tw(r2, .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    E.say('hat', 'そして、監査法人や名証と話し合ったうえで、4月24日に延ばした。', { yomi: 'そして、監査法人や、めいしょうと、話し合ったうえで、4月24日に延ばした。' });
    E.say('hat', '元資料は、2回目の延期を、ただ予定の日が変わっただけではない、と読んでいる。', { yomi: 'もとしりょうは、にかいめの延期を、ただ、予定の日が変わっただけではない、と読んでいる。' });
    E.say('hat', 'すでに計上した利益が、妥当かどうか。それが、論点になっていた、という読み方だ。', { yomi: 'すでに、けいじょうした利益が、妥当かどうか。それが、論点になっていた、という読み方だ。' });
    E.wait(.4);
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
    const cal = E.div(g, { left: 1150, top: 100, padding: '10px 26px', borderRadius: 14, background: 'rgba(255,255,255,.95)', font: '900 38px/1.4 Zen', color: '#3a3236', boxShadow: '0 8px 18px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }, '決算発表は、<br><s>4/20</s> の予定から、4/24 に延びた').ini({ o: 0, r: -2 });
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 4, delay: .3 });
    E.wait(.6);
    const L = E.narr('延期の知らせ。それでも、私は、売らなかった。', { wait: false });
    E.pop(cal, .4, L.dur * .3, .6); E.sfx('page', { delay: L.dur * .3, gain: .5 });
    E.at(L.end);
    E.narr('延期は、ただの日付の変更だと思っていた。');
    E.narr('何の確認が止まっていたのかを、私は、読もうとしなかった。');
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
    const d1 = E.div(paper, { left: 140, top: 380, width: 480, height: 260, borderRadius: 20, border: '5px dashed #a09070', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#a09070', paddingTop: 60 }, '日付<br><span style="font-size:34px">4/20から、4/24へ</span>').ini({ o: 0 });
    const d2 = E.div(paper, { left: 760, top: 380, width: 520, height: 260, borderRadius: 20, border: '6px solid #c62828', background: 'rgba(255,255,255,.6)', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#c62828', paddingTop: 60 }, '中身<br><span style="font-size:32px">取引の実態と、対価</span>').ini({ o: 0 });
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
    const n = P.kNotice(g, { x: 40, y: 340, w: 1840, size: 26, posts: true });
    E.show(n, .6, .2);
    E.wait(6.0);
  });
  E.bgmStop(2.5, -2.5);
  E.finish();
}
