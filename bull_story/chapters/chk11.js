// 完全版 第11章「516円のトリプルボトム」（2026年6月1日〜6月29日）
// 台本: story/k/k11_516円のトリプルボトム.md　元資料 p7・p8・p11・p12・p13・p22・p33・p35・p38・ユーザー提供の投稿スクリーンショット（2026/10/18）
// 投稿は元資料の要約（本人の見解）。T44 と 6/5 の2件（一覧外）は投稿の画面（P.postShot）と本文の字幕（E.cap・声なし）。
// T44 の 11:51 は最終更新（編集）の時刻。6/5 の2件は投稿の時刻が画面になく、添付画像の時刻（10:36・13:17）を「画像」として書く
// 有名投資家の名前・アカウント・アイコンは出さない。ブルちゃんの保有はフィクション
// 月足の6月の足は、6/4の時点では月の途中（月末の終値600円を6/4の情報として扱わない）
'use strict';
E.chapter('k11');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;
  const bar = (g, from, to) => P.monthBar(g, { year: 2026, start: 6, months: 1, from, to, x: 560, w: 800 });
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const box = (g, { x, y, w = 700, h = 280, top = '', main = '', sub = '', c = '#262236', border = 'none', size = 50 }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 26, background: 'rgba(255,255,255,.95)', border, boxShadow: '0 12px 24px rgba(0,0,0,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 30px' },
    `${top ? `<div style="font:800 28px/1.3 Round;color:#6a6066">${top}</div>` : ''}<div style="font:900 ${size}px/1.3 Zen;color:${c};white-space:nowrap">${main}</div>${sub ? `<div style="font:800 30px/1.5 Round;color:#4a4552;margin-top:14px">${sub}</div>` : ''}`).ini({ o: 0 });
  const rise = (n, d = 0) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', d); E.sfx('pop', { delay: d, gain: .5 }); };
  const chartTitle = (sc, t) => E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, t);
  const tag = (g, pt, txt, dx, dy, c = '#262236', size = 17) => E.div(g, { left: pt.x + dx, top: pt.y + dy, padding: '3px 10px', borderRadius: 8, background: 'rgba(255,255,255,.96)', font: `900 ${size}px/1.3 Noto`, color: c, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }, txt).ini({ o: 0 });
  const fiction = sc => P.note(sc.root, 'ブルちゃんの売買はフィクションです', { x: 1440, y: 40, size: 24, dark: true });
  const tIn = (n, d = .5) => { E.tw(n, .45, { o: [0, 1], x: [60, 0] }, 'back', d); E.sfx('notify', { delay: d }); };
  // p12 月足（2024/01 から 68.2px/月、500円が y=533.5、0.207 px/円）
  const X12 = (y, m) => 230.5 + 68.2 * ((y - 2024) * 12 + (m - 1));
  const PY12 = p => 533.5 - (p - 500) * 0.207;
  // p08 日足（5/25 から 32.375px/取引日、600円が y=469.5、0.5825 px/円）
  const DAYS = ['5/25', '5/26', '5/27', '5/28', '5/29', '6/1', '6/2', '6/3', '6/4', '6/5', '6/8', '6/9', '6/10', '6/11', '6/12', '6/15', '6/16', '6/17', '6/18'];
  const X08 = d => 194.5 + 32.375 * DAYS.indexOf(d);
  const PY08 = p => 469.5 + (600 - p) * 0.5825;
  // p07 日足（4/1〜6/8、約49.5px/取引日、1,000円が y=296.5、0.51 px/円）。6/4 は x 2273、6/5 は x 2322
  const PY07 = p => 296.5 + (1000 - p) * 0.51;

  // 投稿の画面（ユーザー提供のスクリーンショット）。上に月の帯があるので y 110 から、字幕の帯（850）より上に収める
  const MEMO = '#5a6b88';
  const shot = (g, o) => P.postShot(g, Object.assign({ x: 80, y: 110, h: 730 }, o));
  const enter = (card, d = .4) => { E.tw(card, .45, { o: [0, 1], y: [30, 0] }, 'back', d); E.sfx('notify', { delay: d }); };
  // 添付画像の中の位置（切り出し画像の画素）→ 親の座標。card.at はカードの左の太線 12px の分を含まないので足す
  const atImg = (card, i, px, py) => { const q = card.at(i, px, py); return { x: q.x + 12, y: q.y }; };
  // 添付画像の中の場所を示す黄色い四角の枠（投稿者の手書きの丸と区別するため四角にする）。[x0, y0, x1, y1] は切り出し画像の画素
  const frame = (g, card, i, [x0, y0, x1, y1], d = 0) => {
    const a = atImg(card, i, x0, y0), b = atImg(card, i, x1, y1);
    const n = E.div(g, { left: a.x - 6, top: a.y - 6, width: b.x - a.x + 12, height: b.y - a.y + 12, borderRadius: 8, border: '4px solid #ffd84a', boxShadow: '0 0 14px rgba(255,216,74,.85)', boxSizing: 'border-box' }).ini({ o: 0 });
    E.show(n, .25, d); E.sfx('pop', { delay: d, gain: .35 });
    return n;
  };
  // 右の余白に置く説明の札
  const fact = (g, { x, y, w, html, size = 28 }) => E.div(g, { left: x, top: y, width: w, padding: '12px 20px 14px', borderRadius: 16, background: 'rgba(255,255,255,.95)', font: `900 ${size}px/1.4 Zen`, color: '#262236', boxShadow: '0 8px 18px rgba(0,0,0,.3)', boxSizing: 'border-box' }, html).ini({ o: 0 });
  const small = t => `<div style="font:800 21px/1.4 Round;color:#5a6476;margin-top:4px">${t}</div>`;

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

  /* ============================================================ S0 アバン：6月2日 */
  P.phoneScene((ph, sc) => {
    E.bgm('memory', { fadeIn: 1.0, gain: .7 });
    fiction(sc);
    const scr = ph.screen, sw = ph.sw;
    E.div(scr, { left: 0, top: 0, width: sw, height: 1000, background: '#f4f6f9' });
    E.div(scr, { left: 0, top: 70, width: sw, textAlign: 'center', font: '900 30px/1.4 Zen', color: '#22252b' }, '保有している株');
    const card = E.div(scr, { left: 24, top: 150, width: sw - 48, height: 240, borderRadius: 18, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,.08)' });
    E.div(card, { left: 24, top: 20, font: '900 30px/1.4 Zen', color: '#22252b' }, 'エスポア（3260）');
    E.div(card, { left: 24, top: 80, font: '800 24px/1.6 Round', color: '#6a6066' }, '取得単価　700円');
    const low = E.div(card, { left: 24, top: 130, font: '800 24px/1.6 Round', color: '#6a6066' }, '6/1・6/2 安値　<b style="font:900 40px Noto;color:#1b8a5a">516円</b>').ini({ o: 0 });
    E.wait(1.0);
    const L = E.narr('6月1日と、2日。値段は、516円まで下がった。', { wait: false, yomi: '6月1日と、2日。値段は、ごひゃくじゅうろくえんまで下がった。' });
    E.show(low, .4, L.dur * .5); E.sfx('drop', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    E.narr('5月29日の587円より、さらに下だった。', { yomi: '5月29日の、ごひゃくはちじゅうななえんより、さらに下だった。' });
    E.wait(.3);
  }, { name: 'avant_phone', wait: .4 });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 11, title: '516円のトリプルボトム', sub: '2026年6月1日〜6月29日', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 T44（P14）投稿の画面　6月4日 11:51（最終更新） */
  E.scene({ name: 't44' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    bar(g, [6, 1], [6, 4]);
    const card = shot(g, { id: 'T44', x: 140, when: '2026/6/4 11:51（最終更新）', text: 'p14_text', imgs: ['p14_img', 'p14_img2'],
      rows: [{ label: '元資料の要約', text: '516円のトリプルボトムが完成したと評価' },
        { label: '確認メモ', color: MEMO, text: '11:51は最終更新（投稿を編集した時刻）の表示。最初に投稿した時刻は、画面に出ていない。' },
        { label: '確認メモ', color: MEMO, show: false, text: '2枚の画像の現在値は、どちらも11:28の690円（前日比+70円）。投稿した時点や、11:51の時点の値段ではない。' },
        { label: '検証メモ', show: false, text: '添付は月足と日足。月足の540・520・516円という3度の安値圏と対応するが、長期の上値突破は未確認。' }] });
    enter(card);
    E.wait(1.0);
    E.narr('6月4日の投稿。この投稿は、画面で見ることができる。');
    E.narr('画面の時刻は、最終更新の11時51分。昼休みの時刻だ。', { yomi: '画面の時刻は、さいしゅうこうしんの、11時51分。ひるやすみの時刻だ。' });
    E.cap('3260 エスポア\nトリプルボトム516円完成');
    E.say('hat', 'この投稿は、月足と日足の、2枚のチャートの画面を、付けている。', { yomi: 'この投稿は、つきあしと、ひあしの、にまいのチャートの画面を、付けている。' });
    E.say('hat', '元資料の要約では、516円のトリプルボトムが完成した、という評価だ。', { yomi: 'もとしりょうの要約では、ごひゃくじゅうろくえんの、トリプルボトムが完成した、という評価だ。' });
    E.say('hat', '最終更新とは、投稿を、あとから編集した時刻のことだ。', { yomi: 'さいしゅうこうしんとは、投稿を、あとから編集した時刻のことだ。' });
    E.say('hat', '最初に投稿した時刻は、画面に出ていない。元資料の一覧の時刻も、11時51分だ。', { yomi: '最初に投稿した時刻は、画面に出ていない。もとしりょうの一覧の時刻も、11時51分だ。' });
    E.say('hat', '名証の午前の取引は、11時30分まで。11時51分は、昼休みの時刻になる。', { yomi: 'めいしょうの、ごぜんの取引は、11時30分まで。11時51分は、ひるやすみの時刻になる。' });
    let L = E.say('hat', '2枚の画像の、いちばん上の時刻は、どちらも11時28分だ。', { wait: false, yomi: 'にまいの画像の、いちばん、うえの時刻は、どちらも、11時28分だ。' });
    frame(g, card, 0, [20, 264, 165, 372], .3); frame(g, card, 1, [20, 264, 165, 372], .5);
    E.at(L.end);
    L = E.say('hat', '値段は690円で、前の日の終値より、70円高い。', { wait: false, yomi: '値段は、ろっぴゃくきゅうじゅうえんで、前の日の、おわりねより、ななじゅうえん高い。' });
    frame(g, card, 0, [360, 264, 1150, 372], .3); frame(g, card, 1, [360, 264, 1150, 372], .5);
    E.at(L.end);
    E.show(card.rows[2], .3, .1);
    E.say('hat', 'これは、11時28分の値段だ。投稿した時点や、11時51分の時点の値段では、ない。', { delay: .2 });
    L = E.say('hat', '1枚目は、月足の画像だ。', { wait: false, yomi: 'いちまいめは、つきあしの画像だ。' });
    frame(g, card, 0, [36, 512, 320, 606], .3);
    E.at(L.end);
    L = E.say('hat', '白い手書きの、516という数字と、下の横の線は、この月足の画像に、書き込まれている。', { wait: false, yomi: '白い手書きの、ごひゃくじゅうろくという数字と、下の、よこの線は、この、つきあしの画像に、書き込まれている。' });
    frame(g, card, 0, [232, 716, 878, 1108], .3); frame(g, card, 0, [30, 1396, 1168, 1506], L.dur * .55);
    E.at(L.end);
    L = E.say('hat', '2枚目は、日足の画像だ。6月4日は、630円で始まり、この時点の安値は579円だった。', { wait: false, yomi: 'にまいめは、ひあしの画像だ。6月4日は、ろっぴゃくさんじゅうえんで始まり、この時点の、やすねは、ごひゃくななじゅうきゅうえんだった。' });
    frame(g, card, 1, [36, 512, 320, 606], .3); frame(g, card, 1, [280, 612, 790, 668], L.dur * .45);
    E.at(L.end);
    E.show(card.rows[3], .3, .1);
    E.say('hat', '元資料の検証メモは、この投稿を、月足の、3回の安値のあたりと、照らし合わせている。', { delay: .2, yomi: 'もとしりょうの、けんしょうメモは、この投稿を、つきあしの、さんかいの安値のあたりと、照らし合わせている。' });
    E.say('hat', '540円、520円、516円の、3回だ。', { yomi: 'ごひゃくよんじゅうえん、ごひゃくにじゅうえん、ごひゃくじゅうろくえんの、さんかいだ。' });
    E.say('hat', 'ただし、長い期間で見て、上の値段を抜けたことまでは、確認されていない、としている。');
    E.wait(.3);
  });

  // トリプルボトムの形（しくみの図）
  E.scene({ name: 't44_shape' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, 'トリプルボトム', 110);
    E.show(tt, .3);
    const pts = [[0, 30], [150, 250], [270, 110], [400, 252], [520, 120], [650, 255], [800, 0]];
    const wl = E.polyline(g, pts, { left: 560, top: 300, width: 800, height: 300, color: '#e8a33a', sw: 10 }).ini({ draw: 0 });
    const lb = E.div(g, { left: 460, top: 630, width: 1000, textAlign: 'center', font: '900 32px/1.2 Zen', color: '#f5c46a' }, 'トリプルボトム（しくみの図・一般的な説明）').ini({ o: 0 });
    E.wait(.4);
    const L = E.say('hat', 'トリプルボトムは、同じくらいの安値を、3回つけて、底になる形のことだ。', { wait: false, yomi: 'トリプルボトムは、同じくらいの安値を、さんかいつけて、そこになる形のことだ。' });
    E.tw(wl, 1.4, { draw: [0, 1] }, 'inOut', .2); E.show(lb, .3, .4);
    [150, 400, 650].forEach((x, i) => P.circle(g, { x: 560 + x, y: 300 + 250, w: 64, h: 64, delay: L.dur * .45 + i * .3, dur: .3 }));
    E.at(L.end);
    E.say('hat', '元資料は、この投稿を、日足の3回の安値と限って読むと、取り違える、と書いている。', { yomi: 'もとしりょうは、この投稿を、ひあしの、さんかいの安値と、かぎって読むと、取り違える、と書いている。' });
    E.say('hat', 'この投稿の、516の書き込みと横線も、月足の画像のほうに、あった。', { yomi: 'この投稿の、ごひゃくじゅうろくの書き込みと、よこの線も、つきあしの画像のほうに、あった。' });
    E.say('hat', 'だから、次は、月足で、3回の安値を見ていく。', { yomi: 'だから、次は、つきあしで、さんかいの安値を見ていく。' });
    E.wait(.3);
  });

  /* ============================================================ S3 月足の3回の安値 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'monthly' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('12'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, '月足　2024年1月〜2026年8月');
    P.note(sc.root, '分割調整後の値段（元資料 p12）', { x: 1480, y: 896, size: 22, dark: true });
    C.draw(1.8, .2);
    const p1 = C.at(X12(2024, 5), PY12(540)), p2 = C.at(X12(2026, 2), PY12(520)), p3 = C.at(X12(2026, 6), PY12(516));
    const t1 = tag(g, p1, '2024/5 540円', -60, 16, '#1b8a5a', 22), t2 = tag(g, p2, '2026/2 520円', -150, 16, '#1b8a5a', 22), t3 = tag(g, p3, '2026/6 516円', -40, 20, '#1b8a5a', 22);
    E.wait(2.0);
    let L = E.say('hat', '月足で見ると、3回の安値は、2024年5月の540円、2026年2月の520円。', { wait: false, yomi: 'つきあしで見ると、さんかいの安値は、2024年5月の、ごひゃくよんじゅうえん、2026年2月の、ごひゃくにじゅうえん。' });
    P.circle(g, { x: p1.x, y: p1.y, w: 44, h: 44, sw: 4, delay: .3, dur: .35 }); E.pop(t1, .3, .4);
    P.circle(g, { x: p2.x, y: p2.y, w: 44, h: 44, sw: 4, delay: L.dur * .6, dur: .35 }); E.pop(t2, .3, L.dur * .65);
    E.at(L.end);
    L = E.say('hat', 'そして、6月1日と2日の、516円だ。完全に同じ値段では、ない。', { wait: false, yomi: 'そして、6月1日と2日の、ごひゃくじゅうろくえんだ。完全に同じ値段では、ない。' });
    P.circle(g, { x: p3.x, y: p3.y, w: 44, h: 44, sw: 4, delay: .3, dur: .35 }); E.pop(t3, .3, .4);
    E.at(L.end + .2);
    // 6月の足に寄る
    P.look(sc.cam, { s: 2.4, cx: C.at(X12(2026, 5), 0).x, cy: C.at(0, 470).y, dur: 1.2 });
    const jun = C.at(X12(2026, 6), 470);
    const fr = E.div(g, { left: jun.x - 22, top: C.at(0, 395).y, width: 44, height: C.at(0, 545).y - C.at(0, 395).y, borderRadius: 6, border: '3px dashed #c62828' }).ini({ o: 0 });
    const nt = P.note(sc.root, 'この図の6月足は月末まで。6/4の時点では、月の途中', { x: 520, y: 820, size: 30, dark: true }).ini({ o: 0 });
    E.wait(1.2);
    L = E.say('hat', 'この図の6月の足は、月末まで入った形だ。6月4日の時点では、まだ月の途中だった。', { wait: false, yomi: 'この図の、6月の足は、げつまつまで入った形だ。6月4日の時点では、まだ、月の途中だった。' });
    E.show(fr, .3, .2); E.show(nt, .3, L.dur * .4);
    E.at(L.end);
    // 投稿の月足の画像（11:28の表示）の6月の足
    const m4 = fact(sc.root, { x: 1262, y: 262, w: 450, size: 26, html: '投稿の月足の画像の6月の足' + small('11:28の表示。始値 607円・高値 694円') + small('安値 516円。6月4日の、月の途中の形') });
    L = E.say('hat', 'さっきの投稿の、月足の画像で、11時28分の時点の6月の足を見る。', { wait: false, yomi: 'さっきの投稿の、つきあしの画像で、11時28分の時点の、ろくがつの足を見る。' });
    E.tw(m4, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('pop', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '始値607円、高値694円、安値516円。まだ、月の途中の形だ。', { yomi: 'はじめね、ろっぴゃくななえん、たかね、ろっぴゃくきゅうじゅうよえん、やすね、ごひゃくじゅうろくえん。まだ、月の途中の形だ。' });
    const cl = tag(g, C.at(X12(2026, 6), PY12(600)), '6月末の終値 600円', 30, -12, '#c62828', 13);
    L = E.say('hat', '月末の終値600円は、6月の最後の取引の日に、決まった値段だ。', { wait: false, yomi: 'げつまつの、おわりね、ろっぴゃくえんは、ろくがつの、最後の取引の日に、決まった値段だ。' });
    E.pop(cl, .3, .3);
    E.at(L.end);
    L = E.say('hat', '6月4日には、まだ分からなかった。だから、6月4日に分かっていた情報としては、扱わない。', { wait: false, yomi: '6月4日には、まだ分からなかった。だから、6月4日に分かっていた情報としては、あつかわない。' });
    const st = P.mark(sc.root, '6/4には未確定', { x: 1380, y: 140, color: '#c62828', size: .8, rot: 7, w: 300 });
    P.stampIn(st, L.dur * .6);
    E.at(L.end + .4);
  });

  /* ============================================================ S4 底を試したことと、流れが変わったこと */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'test_vs_trend' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '底を試したこと　と　流れが変わったこと', 60);
    E.show(tt, .3);
    const b1 = box(g, { x: 160, y: 200, w: 760, h: 300, top: 'これは確かめられる', main: '底値を試した', sub: '安値の近くで、反発した', c: '#1b8a5a' });
    const b2 = box(g, { x: 1000, y: 200, w: 760, h: 300, top: 'これは別の確認が要る', main: '上昇の流れが完成した', sub: '過去の戻りの高値を<br>抜くかどうか', c: '#c62828', border: '5px solid #c62828', size: 46 });
    E.wait(.3);
    let L = E.say('hat', '底を試したことと、上がる流れが完成したことは、別だ。', { wait: false, yomi: 'そこを試したことと、上がる流れが完成したことは、別だ。' });
    rise(b1, .2); rise(b2, L.dur * .5);
    E.at(L.end);
    E.say('hat', '完成と言うには、過去の戻りの高値を、抜くかどうかの確認が要る。');
    E.wait(.3);
  });

  E.scene({ name: 'jun5' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('08'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, '日足　2026年6月1日〜6月5日');
    P.note(sc.root, '分割後の値段（元資料 p8）', { x: 1540, y: 896, size: 22, dark: true });
    P.look(sc.cam, { s: 2.0, cx: C.at(560, 0).x, cy: C.at(0, 360).y, dur: 1.4, delay: .2 });
    const c4 = C.at(X08('6/4'), PY08(720)), h5 = C.at(X08('6/5'), PY08(854)), m4 = C.at(X08('6/4'), PY08(690));
    const a = C.at(X08('5/25') - 20, PY08(1000)), b = C.at(X08('6/12'), PY08(1000));
    const ln = E.div(g, { left: a.x, top: a.y - 1.5, width: b.x - a.x, height: 0, borderTop: '3px dashed #c62828', transformOrigin: '0 50%' }).ini({ sx: 0 });
    const tl = tag(g, C.at(X08('5/25'), PY08(1000)), '4月の高値 1,000円', 0, -30, '#c62828');
    const t4 = tag(g, c4, '6/4 終値 720円', -150, -14, '#2b68d8'), t5 = tag(g, h5, '6/5 高値 854円', 14, -16, '#c62828');
    const tm = tag(g, m4, '6/4 11:28の画像 690円', 16, 12, '#6a4a00');
    E.wait(1.6);
    let L = E.say('hat', '6月4日の、11時28分の画像の値段は、690円。これは、取引の途中の値段だ。', { wait: false, yomi: '6月4日の、11時28分の画像の値段は、ろっぴゃくきゅうじゅうえん。これは、取引の途中の値段だ。' });
    P.circle(g, { x: m4.x, y: m4.y, w: 20, h: 20, sw: 3, color: '#b8860b', delay: L.dur * .35, dur: .3 }); E.pop(tm, .3, L.dur * .4);
    E.at(L.end);
    L = E.say('hat', 'この日の終値は、720円。引けの値段は、11時28分の値段とは、別だ。', { wait: false, yomi: 'この日の、おわりねは、ななひゃくにじゅうえん。ひけの値段は、11時28分の値段とは、べつだ。' });
    P.circle(g, { x: c4.x, y: c4.y, w: 24, h: 24, sw: 3, color: '#2b68d8', delay: .3, dur: .3 }); E.pop(t4, .3, .35);
    E.at(L.end);
    L = E.say('hat', '次の日、6月5日の高値は854円。反発は、実際にあった。', { wait: false, yomi: '次の日、6月5日の、たかねは、はっぴゃくごじゅうよえん。反発は、実際にあった。' });
    P.circle(g, { x: h5.x, y: h5.y, w: 24, h: 24, sw: 3, delay: .3, dur: .3 }); E.pop(t5, .3, .35);
    E.at(L.end);
    L = E.say('hat', 'でも、4月の高値、1,000円には、届かなかった。', { wait: false, yomi: 'でも、4月の高値、せんえんには、届かなかった。' });
    E.tw(ln, .8, { sx: [0, 1] }, 'inOut', .2); E.pop(tl, .3, .6);
    E.at(L.end + .4);
  });

  /* ------------------------------------------------------------ 6月5日の投稿①（一覧外・P10）　画像 10:36 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'p10' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [6, 4], [6, 5]);
    const card = shot(g, { id: '一覧外', listed: false, when: '2026/6/5（画像 10:36）', text: 'p10_text', imgs: ['p10_img'],
      rows: [{ label: '確認メモ', color: MEMO, text: '元資料の投稿の一覧（50件）にない投稿。投稿の時刻は画面に出ていない。添付画像の時刻は10:36。' },
        { label: '確認メモ', color: MEMO, show: false, text: '10:36の画像では835円（前日比+115円）。高値854円・安値719円は、この時点で付いていた。「終値835.0」の欄は10:36の値段で、この日の終値ではない。' },
        { label: '確認メモ', color: MEMO, show: false, text: '手書きの丸は、4月20日〜24日のあたり。4月20日の安値969円と21日の高値934円のあいだの窓（元資料 p7）の位置にあたる。' }] });
    enter(card);
    const FX = 1250, FW = 630;
    const f1 = fact(g, { x: FX, y: 150, w: FW, html: '10:36の画像の値段は、835円' + small('前の日の終値より115円高い。この時点の高値は854円、安値は719円、始値は750円') });
    const f2 = fact(g, { x: FX, y: 330, w: FW, html: '「終値 835.0」は、10:36の時点の値段' + small('取引の途中なので、その時点の値段が入っている。この日の終値ではない') });
    const f3 = fact(g, { x: FX, y: 510, w: FW, html: '白い丸は、添付画像の書き込み' + small('4月20日〜24日のあたり。4月20日の安値969円と、21日の高値934円のあいだの窓の位置') });
    E.wait(1.0);
    E.narr('次の日、6月5日の投稿。これは、元資料の投稿の一覧には、載っていない。', { yomi: '次の日、6月5日の投稿。これは、もとしりょうの、投稿の一覧には、載っていない。' });
    E.cap('3260 エスポア\n意味なく開けた窓をまず埋めに行きたいところ');
    E.say('hat', 'この投稿は、日足のチャートの画面を付けて、チャートの窓について、書いたものだ。', { yomi: 'この投稿は、ひあしのチャートの画面を付けて、チャートの、まどについて、書いたものだ。' });
    let L = E.say('hat', '投稿の時刻は、画面に出ていない。添付の画像に出ている時刻は、10時36分だ。', { wait: false });
    frame(g, card, 0, [20, 278, 165, 384], L.dur * .55);
    E.at(L.end);
    L = E.say('hat', '10時36分の画像では、値段は835円。前の日の終値より、115円高い。', { wait: false, yomi: '10時36分の画像では、値段は、はっぴゃくさんじゅうごえん。前の日の、おわりねより、ひゃくじゅうごえん高い。' });
    frame(g, card, 0, [360, 278, 1150, 384], .3); E.tw(f1, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .5); E.sfx('pop', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    L = E.say('hat', 'この時点で、高値の854円と、安値の719円は、もう付いていた。始値は750円だ。', { wait: false, yomi: 'この時点で、たかねの、はっぴゃくごじゅうよえんと、やすねの、ななひゃくじゅうきゅうえんは、もう付いていた。はじめねは、ななひゃくごじゅうえんだ。' });
    frame(g, card, 0, [12, 624, 790, 678], .3);
    E.at(L.end);
    E.show(card.rows[1], .3, .1);
    L = E.say('hat', '終値の欄にも835円とあるが、取引の途中なので、10時36分の値段が入っている。', { wait: false, delay: .2, yomi: 'おわりねの欄にも、はっぴゃくさんじゅうごえんとあるが、取引の途中なので、10時36分の値段が入っている。' });
    frame(g, card, 0, [862, 624, 1068, 678], .3); E.tw(f2, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .5); E.sfx('pop', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    E.say('hat', 'この日の終値は、名証の取引が終わる、15時30分に決まる。あとで、元資料の日足で見る。', { yomi: 'この日の、おわりねは、めいしょうの取引が終わる、15時30分に決まる。あとで、もとしりょうの、ひあしで見る。' });
    L = E.say('hat', '白い手書きの丸は、チャートの、4月20日から24日のあたりを、囲んでいる。', { wait: false });
    frame(g, card, 0, [408, 704, 540, 896], .3); E.tw(f3, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .5); E.sfx('pop', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    E.show(card.rows[2], .3, .1);
    E.say('hat', 'そこは、第7章で見た、4月21日にできた窓の位置だ。', { delay: .2, yomi: 'そこは、だいななしょうで見た、4月21日にできた、まどの位置だ。' });
    E.say('hat', '4月20日の安値969円と、21日の高値934円の、あいだの値段の帯だ。', { yomi: '4月20日の、やすね、きゅうひゃくろくじゅうきゅうえんと、21日の、たかね、きゅうひゃくさんじゅうよえんの、あいだの値段の帯だ。' });
    E.say('hat', 'この画像は、10時36分の、一場面だ。', { yomi: 'この画像は、10時36分の、ひとばめんだ。' });
    E.say('hat', '窓が、そのあとどうなったのかは、この画像からは、分からない。', { yomi: 'まどが、そのあと、どうなったのかは、この画像からは、分からない。' });
    E.wait(.3);
  });

  /* ------------------------------------------------------------ 6月5日の投稿②（一覧外・P11）　画像 13:17 の板 */
  E.scene({ name: 'p11' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [6, 4], [6, 5]);
    const card = shot(g, { id: '一覧外', listed: false, when: '2026/6/5（画像 13:17）', text: 'p11_text', imgs: ['p11_img'],
      rows: [{ label: '確認メモ', color: MEMO, text: '元資料の投稿の一覧（50件）にない投稿。投稿の時刻は画面に出ていない。添付画像は13:17の板。' },
        { label: '確認メモ', color: MEMO, show: false, text: '画面に写っている範囲では、売り注文は850〜870円で計8,200株、買い注文は837〜800円で計1,400株。800円より下の買い注文は画面の外。' },
        { label: '確認メモ', color: MEMO, show: false, text: '注文を出した人と、そのあと約定したか取り消されたかは、確認できない。一日分の板のデータは、元資料にもない。' }] });
    enter(card);
    const FX = 1195, FW = 685;
    const f1 = fact(g, { x: FX, y: 150, w: FW, html: '13:17の画像の値段は、850円' + small('前の日の終値より130円高い。この時点の高値は854円、安値は719円、始値は750円') });
    const f2 = fact(g, { x: FX, y: 330, w: FW, html: '「終値 720」は、前の日（6/4）の終値' + small('この画面の終値の欄は、前の日の値段。6月5日の終値ではない') });
    const row = (c, t, v) => `<div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:6px;border-top:2px solid #e3e8f0;white-space:nowrap"><span style="color:${c}">${t}</span><span>${v}</span></div>`;
    const f3 = fact(g, { x: FX, y: 510, w: FW, html: '画面に写っている注文（13:17）' + row('#c62828', '売り　850〜870円', '計 8,200株') + row('#2b68d8', '買い　837〜800円', '計 1,400株') + small('800円より下の買い注文は、画面の外で、確かめられない') });
    E.wait(1.0);
    E.narr('同じ6月5日の、もう1つの投稿。これも、元資料の一覧にない投稿だ。', { yomi: '同じ6月5日の、もうひとつの投稿。これも、もとしりょうの一覧にない投稿だ。' });
    E.cap('3260 エスポア\n板の厚い方へ動く');
    E.cap('の典型');
    E.say('hat', 'この投稿は、板の画面を付けて、板の注文と、値段の動きについて、書いたものだ。', { yomi: 'この投稿は、いたの画面を付けて、いたの注文と、値段の動きについて、書いたものだ。' });
    let L = E.say('hat', '投稿の時刻は、画面に出ていない。添付の板の画像の時刻は、13時17分だ。', { wait: false, yomi: '投稿の時刻は、画面に出ていない。添付の、いたの画像の時刻は、13時17分だ。' });
    frame(g, card, 0, [20, 262, 160, 372], L.dur * .55);
    E.at(L.end);
    L = E.say('hat', '13時17分の画像では、値段は850円。前の日の終値より、130円高い。', { wait: false, yomi: '13時17分の画像では、値段は、はっぴゃくごじゅうえん。前の日の、おわりねより、ひゃくさんじゅうえん高い。' });
    frame(g, card, 0, [360, 262, 1150, 372], .3); E.tw(f1, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .5); E.sfx('pop', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    L = E.say('hat', 'この時点で、高値の854円と、安値の719円は、もう付いていた。', { wait: false, yomi: 'この時点で、たかねの、はっぴゃくごじゅうよえんと、やすねの、ななひゃくじゅうきゅうえんは、もう付いていた。' });
    frame(g, card, 0, [14, 500, 232, 626], .3);
    E.at(L.end);
    L = E.say('hat', 'この画面の、終値の欄の720円は、前の日、6月4日の終値だ。6月5日の終値では、ない。', { wait: false, yomi: 'この画面の、おわりねの欄の、ななひゃくにじゅうえんは、前の日、6月4日の、おわりねだ。6月5日の、おわりねでは、ない。' });
    frame(g, card, 0, [336, 566, 558, 626], .3); E.tw(f2, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .5); E.sfx('pop', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    E.show(card.rows[1], .3, .1);
    L = E.say('hat', '画面に写っている売り注文は、850円から870円で、合わせて8,200株。', { wait: false, delay: .2, yomi: '画面に写っている売り注文は、はっぴゃくごじゅうえんから、はっぴゃくななじゅうえんで、あわせて、はっせんにひゃくかぶ。' });
    frame(g, card, 0, [0, 862, 1170, 1454], .3); E.tw(f3, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .5); E.sfx('pop', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '買い注文は、837円から800円で、合わせて1,400株だ。', { wait: false, yomi: '買い注文は、はっぴゃくさんじゅうななえんから、はっぴゃくえんで、あわせて、せんよんひゃくかぶだ。' });
    frame(g, card, 0, [0, 1458, 1170, 2028], .3);
    E.at(L.end);
    E.say('hat', '画面に写っている範囲では、売り注文の株数のほうが、多い。');
    E.say('hat', 'ただ、800円より下の買い注文は、画面の外にあって、確かめられない。', { yomi: 'ただ、はっぴゃくえんより下の買い注文は、画面の外にあって、確かめられない。' });
    E.show(card.rows[2], .3, .1);
    E.say('hat', 'この注文を、誰が出したのかは、確認できない。', { delay: .2 });
    E.say('hat', 'そのあと約定したのか、取り消されたのかも、この一場面の画像からは、分からない。', { yomi: 'そのあと、やくじょうしたのか、取り消されたのかも、この、ひとばめんの画像からは、分からない。' });
    E.say('hat', '注文の多さが、値段の動きの原因になったのかも、この画像だけでは、確かめられない。');
    E.wait(.3);
  });

  /* ------------------------------------------------------------ 6月5日の日足と、4月21日の窓（元資料 p7「未充足の窓 934〜969円」） */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'gap_band' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('07'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, '日足　2026年4月〜6月8日と、4月21日の窓');
    P.note(sc.root, '分割後の値段（元資料 p7・p13）', { x: 1500, y: 896, size: 22, dark: true });
    // 元資料の図にある「未充足の窓 934〜969円」の帯（4/21〜6/8の右端まで）
    const bA = C.at(901, PY07(969)), bB = C.at(2419, PY07(934));
    const bf = E.div(g, { left: bA.x - 5, top: bA.y - 5, width: bB.x - bA.x + 10, height: bB.y - bA.y + 10, borderRadius: 6, border: '4px solid #ffd84a', boxShadow: '0 0 14px rgba(255,216,74,.85)', boxSizing: 'border-box' }).ini({ o: 0 });
    const tTop = tag(g, C.at(1500, PY07(969)), '窓の上の端　969円（4/20の安値）', 0, -34, '#b8651a'), tBot = tag(g, C.at(1500, PY07(934)), '窓の下の端　934円（4/21の高値）', 0, 8, '#b8651a');
    E.wait(1.0);
    let L = E.say('hat', '元資料の7ページの日足には、4月21日にできた窓が、帯で描かれている。', { wait: false, yomi: 'もとしりょうの、ななページの、ひあしには、4月21日にできた、まどが、帯で描かれている。' });
    E.show(bf, .3, L.dur * .5); E.sfx('pop', { delay: L.dur * .5, gain: .4 });
    E.at(L.end);
    L = E.say('hat', '934円から969円までの、取引のなかった値段の帯だ。', { wait: false, yomi: 'きゅうひゃくさんじゅうよえんから、きゅうひゃくろくじゅうきゅうえんまでの、取引のなかった値段の帯だ。' });
    E.pop(tTop, .3, .3); E.pop(tBot, .3, L.dur * .5);
    E.at(L.end);
    E.say('hat', '元資料は、これを「未充足の窓」と書いている。まだ埋まっていない窓、という意味だ。', { yomi: 'もとしりょうは、これを、みじゅうそくの、まど、と書いている。まだ、うまっていない、まど、という意味だ。' });
    E.say('hat', '窓が埋まるのは、値段が戻って、窓の上の969円に届いた時だ。', { yomi: 'まどが、うまるのは、値段が戻って、まどの上の、きゅうひゃくろくじゅうきゅうえんに届いた時だ。' });
    // 6/5 の足に寄る
    E.hide(tTop, .3); E.hide(tBot, .3);
    P.look(sc.cam, { s: 2.2, cx: C.at(2230, 0).x, cy: C.at(0, 370).y, dur: 1.2 });
    const h5 = C.at(2322, PY07(854)), c5 = C.at(2322, 394), lo = C.at(2342, PY07(934));
    const t5 = tag(g, h5, '6/5 高値 854円', -150, -16, '#c62828');
    const gapL = E.div(g, { left: h5.x + 18, top: lo.y, width: 0, height: h5.y - lo.y, borderLeft: '3px solid #c62828' }).ini({ o: 0 });
    const gapT = tag(g, { x: h5.x + 18, y: (h5.y + lo.y) / 2 }, '934円まで 80円', 8, -12, '#c62828');
    // 終値は元資料の本文にない。p7 の実体の上の端（y 394 ≒ 809円）と p08（≒ 807円）から読んだ、およその値
    const tc = fact(sc.root, { x: 40, y: 738, w: 1010, size: 27, html: '<span style="color:#2b68d8">6/5 の終値　805〜810円ほど</span>' + small('元資料の本文には載っていない。元資料の日足のチャートから読み取った、およその値') });
    E.wait(1.2);
    L = E.say('hat', '6月5日の足を見る。この日の高値は、854円だった。', { wait: false, yomi: '6月5日の足を見る。この日の、たかねは、はっぴゃくごじゅうよえんだった。' });
    P.circle(g, { x: h5.x, y: h5.y, w: 18, h: 18, sw: 3, delay: L.dur * .5, dur: .3 }); E.pop(t5, .3, L.dur * .55);
    E.at(L.end);
    L = E.say('hat', '854円は、窓の下の端の934円より、80円低い。窓の下の端にも、届かなかった。', { wait: false, yomi: 'はっぴゃくごじゅうよえんは、まどの下の端の、きゅうひゃくさんじゅうよえんより、はちじゅうえん低い。まどの下の端にも、届かなかった。' });
    E.show(gapL, .3, .3); E.pop(gapT, .3, L.dur * .5);
    E.at(L.end);
    E.say('hat', '13時17分の板の画像の850円は、取引の途中の値段で、この日の終値ではない。', { yomi: '13時17分の、いたの画像の、はっぴゃくごじゅうえんは、取引の途中の値段で、この日の、おわりねではない。' });
    E.say('hat', '6月5日の終値は、元資料の本文には、載っていない。', { yomi: '6月5日の、おわりねは、もとしりょうの本文には、載っていない。' });
    L = E.say('hat', '元資料のこのチャートから読むと、終値は、805円から810円ほど。およその値段だ。', { wait: false, yomi: 'もとしりょうの、このチャートから読むと、おわりねは、はっぴゃくごえんから、はっぴゃくじゅうえんほど。およその値段だ。' });
    P.circle(g, { x: c5.x, y: c5.y, w: 18, h: 18, sw: 3, color: '#2b68d8', delay: L.dur * .4, dur: .3 }); E.tw(tc, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .45); E.sfx('pop', { delay: L.dur * .45, gain: .5 });
    E.at(L.end);
    E.say('hat', '第7章では、4月22日から24日の高値も、969円に届かなかったことを見た。', { yomi: 'だいななしょうでは、4月22日から24日の、たかねも、きゅうひゃくろくじゅうきゅうえんに届かなかったことを見た。' });
    L = E.say('hat', 'この窓は、そのあとも、最後の売買の日まで、埋まらなかった。', { wait: false, yomi: 'この、まどは、そのあとも、最後の売買の日まで、うまらなかった。' });
    const st = P.mark(sc.root, '最後の売買の日まで未充足', { x: 1180, y: 140, color: '#c62828', size: .7, rot: 6, w: 560 });
    P.stampIn(st, L.dur * .6);
    E.at(L.end + .4);
  });

  /* ============================================================ S5 I39・I40　6月11日 17:00 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'i39i40' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .75 });
    P.slate(g);
    const clk = P.clock(g, { x: 110, y: 170, size: 250, min: 930 });
    E.div(g, { left: 85, top: 440, width: 300, textAlign: 'center', font: '900 52px/1.2 Noto', color: '#ffd84a' }, '17:00');
    E.div(g, { left: 85, top: 510, width: 300, textAlign: 'center', font: '800 26px/1.3 Round', color: 'rgba(243,230,200,.8)' }, '同時に公表');
    const i39 = P.icard(g, { id: 'I39', when: '2026/6/11 17:00', session: '引け後', title: '第三者委員会を設置', text: '監査意見不表明に至った特定取引の挙証資料不足等を<br>調査する委員会を設置。7月中旬の報告を予定', x: 440, y: 100, w: 1400, size: 30 });
    const i40 = P.icard(g, { id: 'I40', when: '2026/6/11 17:00', session: '引け後', title: '長野の用地・権利を売却', text: '信濃町の2案件の用地・系統権利を売却。<br>6/12決済予定、2027年2月期業績に寄与する見込み', note: '価格は非公表。売却価格が5,500万円以上という記載は利益額ではない', x: 440, y: 470, w: 1400, size: 30 });
    E.tw(clk, 1.2, { min: [930, 1020] }, 'inOut', .3); E.sfx('tick', { delay: .3, gain: .5 });
    E.wait(1.6);
    E.say('hat', '6月11日、17時。会社は、2つの開示を、同時に出した。', { yomi: '6月11日、17時。会社は、ふたつの開示を、同時に出した。' });
    let L = E.say('hat', '1つは、第三者委員会の設置。', { wait: false, yomi: 'ひとつは、だいさんしゃいいんかいの設置。' });
    E.tw(i39, .45, { o: [0, 1], y: [30, 0] }, 'back', .2); E.sfx('notify', { delay: .2 });
    E.at(L.end);
    E.say('hat', '監査意見の不表明に至った、特定の取引の、裏付けの資料が足りないことなどを、調べる。', { yomi: '監査意見の、ふひょうめいに至った、特定の取引の、うらづけの資料が足りないことなどを、調べる。' });
    E.say('hat', '7月中旬に、報告の予定だ。', { yomi: 'しちがつちゅうじゅんに、報告の予定だ。' });
    const ex = panel(g, { x: 440, y: 470, w: 1400, h: 110, size: 32, html: '<span style="color:#b8651a">第三者委員会</span><span style="font:800 28px Round;color:#4a4552">＝ 会社から独立した、外部の専門家で作る調査の委員会</span>' });
    L = E.say('hat', '第三者委員会は、会社から独立した、外部の専門家で作る、調査の委員会だ。', { wait: false, yomi: 'だいさんしゃいいんかいは、会社から独立した、外部の専門家で作る、調査の委員会だ。' });
    rise(ex, .2);
    E.at(L.end);
    E.hide(ex, .3);
    L = E.say('hat', 'もう1つは、長野県信濃町の、2つの案件の、用地と系統の権利の売却だ。', { wait: false, yomi: 'もうひとつは、ながのけん、しなのまちの、ふたつの案件の、用地と、けいとうの権利の売却だ。' });
    E.tw(i40, .45, { o: [0, 1], y: [30, 0] }, 'back', .4); E.sfx('notify', { delay: .4 });
    E.at(L.end);
    E.say('hat', '2027年2月期の業績に、寄与する見込み。売った値段は、利益の額とは違う。', { yomi: '2027年2月期の業績に、きよする見込み。売った値段は、利益の額とは違う。' });
    const nb = E.div(g, { left: 440, top: 860, width: 1400, height: 80, borderRadius: 18, background: '#2a2430', border: '3px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 30px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '事業の進み具合と、監査の問題は、別々に追う').ini({ o: 0 });
    L = E.say('hat', '元資料は、事業の進み具合と、監査の問題を、別々に追っている。', { wait: false, yomi: 'もとしりょうは、事業の進み具合と、監査の問題を、別々に追っている。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('ding', { delay: .2, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S6 T45　17:04 */
  E.scene({ name: 't45' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tl = P.timeLink(g, { x: 260, y: 150, w: 1400, a: { id: 'I39', time: '17:00', sub: '会社の開示', color: P.I_ORANGE }, b: { id: 'T45', time: '17:04', sub: '投稿', color: P.T_BLUE }, label: '4分後' });
    tl.in(.2);
    const t45 = P.tcard(g, { id: 'T45', when: '2026/6/11 17:04', kind: '財務', session: '引け後', text: '第三者委員会で精査し潔白を示すよう求める', note: '日本時間6月11日17時04分。9月の名証判断とは結果が異なった', x: 300, y: 330, w: 1320, size: 40 });
    tIn(t45, 1.3);
    E.wait(1.8);
    E.narr('公表の4分後に、第三者委員会で調べて、潔白を示すように求める投稿があった。', { yomi: '公表の4分後に、だいさんしゃいいんかいで調べて、けっぱくを示すように求める投稿があった。' });
    E.say('hat', '9月の、名証の判断とは、結果が異なった。それは、第14章で見る。', { yomi: 'くがつの、めいしょうの判断とは、結果が異なった。それは、だいじゅうよんしょうで見る。' });
    E.wait(.3);
  });

  /* ============================================================ S7 I40のあとの値段（p38） */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'reaction' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '6月11日の開示のあとの終値（元資料 p38）', 50);
    E.show(tt, .3);
    const col = (x, d, sub, v, pct, c) => E.div(g, { left: x, top: 190, width: 480, height: 300, borderRadius: 24, background: 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="font:900 40px/1.3 Noto;color:#262236;padding-top:30px">${d}</div><div style="font:800 26px/1.4 Round;color:#6a6066">${sub}</div><div style="font:900 64px/1.3 Noto;color:#262236">${v}</div><div style="font:900 46px/1.2 Noto;color:${c}">${pct}</div>`).ini({ o: 0 });
    const c1 = col(160, '6/11', '公表日の終値', '739円', '', '#262236'), c2 = col(720, '6/12', '翌取引日', '776円', '+5.01%', '#d22d68'), c3 = col(1280, '6/18', '5取引日後', '682円', '−7.71%', '#1b8a5a');
    const a1 = E.div(g, { left: 648, top: 300, width: 60, font: '900 56px/1 Zen', color: '#f3e6c8' }, '▶').ini({ o: 0 }), a2 = E.div(g, { left: 1208, top: 300, width: 60, font: '900 56px/1 Zen', color: '#f3e6c8' }, '▶').ini({ o: 0 });
    const fm = E.div(g, { left: 160, top: 520, width: 1600, textAlign: 'center', font: '800 28px/1.3 Round', color: 'rgba(243,230,200,.85)' }, '騰落率 ＝（比較日の終値 ÷ 公表日の終値 − 1）× 100').ini({ o: 0 });
    E.wait(.3);
    E.say('hat', '引けのあとの公表だから、比べるのは、次の取引日からだ。', { yomi: 'ひけのあとの公表だから、比べるのは、次の取引日からだ。' });
    let L = E.say('hat', '6月11日の終値は739円。次の取引日の、6月12日は776円で、5.01％高い。', { wait: false, yomi: '6月11日の、おわりねは、ななひゃくさんじゅうきゅうえん。次の取引日の、6月12日は、ななひゃくななじゅうろくえんで、ゴテンゼロイチパーセント高い。' });
    rise(c1, .2); E.show(a1, .3, L.dur * .45); rise(c2, L.dur * .5); E.show(fm, .3, L.dur * .7);
    E.at(L.end);
    L = E.say('hat', '5取引日後の、6月18日は682円で、7.71％低い。', { wait: false, yomi: 'ごとりひきびごの、6月18日は、ろっぴゃくはちじゅうにえんで、ナナテンナナイチパーセント低い。' });
    E.show(a2, .3, .2); rise(c3, .3);
    E.at(L.end);
    const lo = panel(g, { x: 360, y: 600, w: 1200, h: 100, size: 34, html: '<span style="font:800 28px Round;color:#6a6066">そのあいだ</span><span style="color:#1b8a5a">6/17 安値 526円</span>' });
    L = E.say('hat', 'そのあいだの、6月17日には、安値526円をつけていた。', { wait: false, yomi: 'そのあいだの、6月17日には、安値、ごひゃくにじゅうろくえんを、つけていた。' });
    rise(lo, .2);
    E.at(L.end);
    const nb = panel(g, { x: 360, y: 740, w: 1200, h: 100, size: 32, dark: true, html: '騰落率には、ほかの情報や需給も含まれる' });
    L = E.say('hat', 'この騰落率には、ほかの情報や、需給も、含まれている。', { wait: false, yomi: 'この、とうらくりつには、ほかの情報や、じゅきゅうも、含まれている。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('ding', { delay: .2, gain: .5 });
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
    const memo = E.div(g, { left: 1150, top: 100, padding: '10px 26px', borderRadius: 14, background: 'rgba(255,255,255,.95)', font: '900 36px/1.4 Noto', color: '#3a3236', boxShadow: '0 8px 18px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }, '540・520・516…').ini({ o: 0, r: -2 });
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 4, delay: .3 });
    E.wait(.6);
    const L = E.narr('月足の安値を、自分で見比べた。540円、520円、516円。', { wait: false, yomi: 'つきあしの安値を、自分で見比べた。ごひゃくよんじゅうえん、ごひゃくにじゅうえん、ごひゃくじゅうろくえん。' });
    E.pop(memo, .4, L.dur * .3, .6); E.sfx('page', { delay: L.dur * .3, gain: .5 });
    E.at(L.end);
    E.narr('私は、もう下がらない、と思いたかった。');
    E.narr('でも、6月の足は、まだ月の途中だった。');
    E.wait(.3);
  });

  /* ============================================================ S9 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '月の途中の足は、まだ答えではない', { left: 120, top: 120, font: '900 64px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .07));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    // 描きかけの月足
    const cs = [[300, 380, 160, '#2a2230'], [480, 420, 120, '#2a2230']].map(([x, y, h, c]) => E.div(paper, { left: x, top: y, width: 70, height: h, borderRadius: 6, background: c }).ini({ o: 0 }));
    const half = E.div(paper, { left: 660, top: 400, width: 70, height: 220, borderRadius: 6, border: '5px dashed #c62828' }).ini({ o: 0 });
    const hl = E.div(paper, { left: 760, top: 470, font: '900 46px/1.3 Zen', color: '#c62828', whiteSpace: 'nowrap' }, '← まだ途中').ini({ o: 0 });
    E.wait(2.6);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「月の途中の足は、まだ答えではない」。', { wait: false, yomi: '月の途中の足は、まだ答えではない。' });
    cs.forEach((c, i) => E.show(c, .3, .2 + i * .2)); E.show(half, .4, L.dur * .45); E.show(hl, .3, L.dur * .55); E.sfx('stamp', { delay: L.dur * .5, gain: .5 });
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
    E.say('baron', '形に名前が付くと、人は、その先を見なくなる。', { talk: C.img, talkAmp: 2 });
    C.swap(CH('baron_e_scheme'));
    E.say('baron', '月の答えは、月が終わるまで、出ない。', { talk: C.img, talkAmp: 2 });
    E.wait(.5);
  });

  /* ============================================================ S11 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 1111 });
    [['T', P.T_BLUE], ['I', P.I_ORANGE]].forEach(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
    });
    const st = P.sticky(g, '第12章<br>調査中断と、監理（審査中）', { x: 1240, y: 120, w: 600, h: 250, rot: 5, size: 40 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第12章だブー。', { talk: pig, talkAmp: 5, yomi: 'ブヒッ。次は、だいじゅうにしょうだブー。' });
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
