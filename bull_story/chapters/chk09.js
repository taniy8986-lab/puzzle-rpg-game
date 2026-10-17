// 完全版 第9章「二番底」（2026年4月27日〜5月18日）
// 台本: story/k/k09_二番底.md　元資料 p7・p13・p21・p31・p32・p37
// 投稿は元資料の要約（本人の見解）。有名投資家の名前・アカウントは出さない。ブルちゃんの保有はフィクション
// T38（保有者の重複は未確認）は、監査法人や他社の話と線で結ばない
'use strict';
E.chapter('k09');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;
  const bar = (g, from, to) => P.monthBar(g, { year: 2026, start: 4, months: 2, from, to, x: 460, w: 1000 });
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const box = (g, { x, y, w = 700, h = 280, top = '', main = '', sub = '', c = '#262236', border = 'none', size = 50 }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 26, background: 'rgba(255,255,255,.95)', border, boxShadow: '0 12px 24px rgba(0,0,0,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 30px' },
    `${top ? `<div style="font:800 28px/1.3 Round;color:#6a6066">${top}</div>` : ''}<div style="font:900 ${size}px/1.3 Zen;color:${c};white-space:nowrap">${main}</div>${sub ? `<div style="font:800 30px/1.5 Round;color:#4a4552;margin-top:14px">${sub}</div>` : ''}`).ini({ o: 0 });
  const rise = (n, d = 0) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', d); E.sfx('pop', { delay: d, gain: .5 }); };
  const chartTitle = (sc, t) => E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, t);
  const tag = (g, pt, txt, dx, dy, c = '#262236', size = 17) => E.div(g, { left: pt.x + dx, top: pt.y + dy, padding: '3px 10px', borderRadius: 8, background: 'rgba(255,255,255,.96)', font: `900 ${size}px/1.3 Noto`, color: c, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }, txt).ini({ o: 0 });
  const fiction = sc => P.note(sc.root, 'ブルちゃんの売買はフィクションです', { x: 1440, y: 40, size: 24, dark: true });
  const tIn = (n, d = .5) => { E.tw(n, .45, { o: [0, 1], x: [60, 0] }, 'back', d); E.sfx('notify', { delay: d }); };
  // p07 日足（元画像の座標）。1日 49px、1,000円が y=296.5、0.511 px/円
  const PX = { '4/20': 850.5, '4/24': 1046.5, '4/27': 1095.5, '4/28': 1144.5, '4/30': 1193.5, '5/1': 1242.5, '5/13': 1487.5, '5/14': 1536.5, '5/18': 1634.5 };
  const PY = p => 296.5 + (1000 - p) * 0.511;
  const dailyChart = (sc, title) => {
    const C = P.chart(sc.cam, CHART('07'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, title);
    P.note(sc.root, '分割後の値段（元資料 p7）', { x: 1540, y: 896, size: 22, dark: true });
    return C;
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

  /* ============================================================ S0 アバン：4月28日 */
  P.phoneScene((ph, sc) => {
    E.bgm('memory', { fadeIn: 1.0, gain: .7 });
    fiction(sc);
    const scr = ph.screen, sw = ph.sw;
    E.div(scr, { left: 0, top: 0, width: sw, height: 1000, background: '#f4f6f9' });
    E.div(scr, { left: 0, top: 70, width: sw, textAlign: 'center', font: '900 30px/1.4 Zen', color: '#22252b' }, '保有している株');
    const card = E.div(scr, { left: 24, top: 150, width: sw - 48, height: 240, borderRadius: 18, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,.08)' });
    E.div(card, { left: 24, top: 20, font: '900 30px/1.4 Zen', color: '#22252b' }, 'エスポア（3260）');
    E.div(card, { left: 24, top: 80, font: '800 24px/1.6 Round', color: '#6a6066' }, '取得単価　700円');
    const low = E.div(card, { left: 24, top: 130, font: '800 24px/1.6 Round', color: '#6a6066' }, '4/28 安値　<b style="font:900 40px Noto;color:#1b8a5a">625円</b>').ini({ o: 0 });
    E.wait(1.0);
    E.narr('4月27日。決算と、監査の不表明が出てから、最初の取引の日。', { yomi: '4月27日。決算と、監査の、ふひょうめいが出てから、最初の取引の日。' });
    const L = E.narr('次の日、4月28日。値段は、私が買った700円より、下まで落ちた。', { wait: false, yomi: '次の日、4月28日。値段は、私が買った、ななひゃくえんより、下まで落ちた。' });
    E.show(low, .4, L.dur * .5); E.sfx('drop', { delay: L.dur * .5, gain: .5 });
    E.at(L.end + .3);
  }, { name: 'avant_phone', wait: .4 });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 9, title: '二番底', sub: '2026年4月27日〜5月18日', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 T35　4月27日 10:29 */
  E.scene({ name: 't35' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    bar(g, [4, 24], [4, 27]);
    const t35 = P.tcard(g, { id: 'T35', when: '2026/4/27 10:29', kind: '財務', session: '取引時間内', text: '入金済みなら収益区分が変わっても利益不変と主張', note: '本人の会計解釈。後の監査・名証資料は取引実在性等を問題としており、単なる区分変更の話に限られない', x: 260, y: 140, w: 1400, size: 40 });
    tIn(t35);
    E.wait(1.0);
    E.narr('4月27日、10時29分。会計について、本人の見方を述べる投稿があった。');
    E.say('hat', 'お金が入っているなら、収益の区分が変わっても、利益は変わらない、という主張だ。');
    E.tw(t35, .4, { y: -30, s: .9 }, 'inOut');
    const b1 = box(g, { x: 200, y: 500, w: 720, h: 300, top: '収益の区分', main: '売上 ⇄ 営業外収益', sub: 'どの欄に入れるか', c: '#2b68d8', size: 46 });
    const b2 = box(g, { x: 1000, y: 500, w: 720, h: 300, top: '取引の実在性', main: '本当にあったか', sub: 'あとの監査・名証の資料の論点（実在性など）', c: '#c62828', border: '5px solid #c62828', size: 46 });
    let L = E.say('hat', '収益の区分は、売上か、営業外収益か、といった分け方のことだ。', { wait: false });
    rise(b1, .2);
    E.at(L.end);
    const m = P.mark(g, '本人の会計解釈', { x: 1380, y: 360, color: P.T_BLUE, size: .75, rot: 7, w: 280 });
    L = E.say('hat', 'これは、本人の会計の解釈だ。', { wait: false });
    P.stampIn(m, L.dur * .4);
    E.at(L.end);
    L = E.say('hat', 'あとの監査や、名証の資料は、取引が本当にあったかどうか、などを、問題にしている。', { wait: false, yomi: 'あとの監査や、めいしょうの資料は、取引が本当にあったかどうか、などを、問題にしている。' });
    rise(b2, .3);
    E.at(L.end);
    E.say('hat', '収益の区分を変えるだけの話には、限られない。');
    E.wait(.3);
  });

  /* ============================================================ S3 4月28日　625円 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'apr28' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = dailyChart(sc, '日足　2026年4月24日〜28日');
    P.look(sc.cam, { s: 2.0, cx: C.at(1110, 0).x, cy: C.at(0, 420).y, dur: 1.4, delay: .2 });
    const hi = C.at(PX['4/24'], PY(913)), lo = C.at(PX['4/28'], PY(625));
    const t1 = tag(g, hi, '4/24 高値 913円', -175, 8, '#c62828'), t2 = tag(g, lo, '4/28 安値 625円', 16, -10, '#1b8a5a');
    E.wait(1.6);
    let L = E.say('hat', '4月28日の安値は、625円。4月24日の高値913円から、2営業日で、ここまで下げた。', { wait: false, yomi: '4月28日の安値は、ろっぴゃくにじゅうごえん。4月24日の高値、きゅうひゃくじゅうさんえんから、にえいぎょうびで、ここまで下げた。' });
    P.circle(g, { x: lo.x, y: lo.y, w: 26, h: 26, sw: 3, delay: .2, dur: .3 }); E.pop(t2, .3, .3);
    P.circle(g, { x: hi.x, y: hi.y, w: 26, h: 26, sw: 3, color: '#c62828', delay: L.dur * .45, dur: .3 }); E.pop(t1, .3, L.dur * .5);
    E.at(L.end);
    const nb = E.div(sc.root, { left: 360, top: 780, width: 1200, height: 100, borderRadius: 22, background: '#2a2430', border: '3px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 34px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '再延期の開示は 4/20。4/28 の安値とは別の日').ini({ o: 0 });
    L = E.say('hat', '日付を整理しておく。再延期の開示は、4月20日。4月28日の安値とは、別の日の出来事だ。', { wait: false });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .3); E.sfx('ding', { delay: L.dur * .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S4 ブルちゃん（含み損） */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_low' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    const scr = E.div(R.screen, { left: 0, top: 0, width: 492, height: 290, background: '#f4f6f9' });
    E.div(scr, { left: 20, top: 18, font: '800 20px/1.3 Round', color: '#6a6066' }, '保有：エスポア（3260）');
    E.div(scr, { left: 20, top: 70, font: '900 34px/1.5 Noto', color: '#22252b' }, '取得 700円<br><span style="color:#1b8a5a">4/28 安値 625円</span>');
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    P.look(sc.cam, { s: 1.25, cx: 1200, cy: 420, dur: 4, delay: .3 });
    E.wait(.6);
    E.narr('私の700円の株は、625円まで、下がった日があった。', { yomi: '私の、ななひゃくえんの株は、ろっぴゃくにじゅうごえんまで、下がった日があった。' });
    E.narr('それでも、私は、売らなかった。まだ、戻ると思っていた。');
    E.wait(.3);
  });

  /* ============================================================ S5 T36　4月30日 15:00 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 't36' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    bar(g, [4, 28], [4, 30]);
    const t36 = P.tcard(g, { id: 'T36', when: '2026/4/30 15:00', kind: 'チャート', session: '取引時間内', text: '25日線を超えたと発言', note: '15時00分投稿。高値910円は終値基準25日線905.24円を上回るが、終値868円は下。瞬間値は未取得', x: 260, y: 140, w: 1400, size: 40 });
    tIn(t36);
    E.wait(1.0);
    E.narr('4月30日の15時00分。25日線を超えた、という投稿があった。', { yomi: '4月30日の15時。にじゅうごにちせんを超えた、という投稿があった。' });
    const ex = panel(g, { x: 260, y: 560, w: 1400, h: 110, size: 34, html: '<span style="color:#e8a33a">25日線</span><span style="font:800 30px Round;color:#4a4552">＝ 過去25日の、終値の平均をつないだ線</span>' });
    const L = E.say('hat', '25日線は、過去25日の、終値の平均をつないだ線だ。', { wait: false, yomi: 'にじゅうごにちせんは、過去、にじゅうごにちの、おわりねの平均を、つないだ線だ。' });
    rise(ex, .2);
    E.at(L.end + .3);
  });

  E.scene({ name: 't36_chart' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = dailyChart(sc, '日足　2026年4月30日');
    P.look(sc.cam, { s: 2.3, cx: C.at(PX['4/30'], 0).x, cy: C.at(0, 360).y, dur: 1.4, delay: .2 });
    const ma = C.at(PX['4/30'], PY(905.24)), hi = C.at(PX['4/30'], PY(910)), cl = C.at(PX['4/30'], PY(868));
    const a = C.at(PX['4/30'] - 70, PY(905.24)), b = C.at(PX['4/30'] + 70, PY(905.24));
    const ln = E.div(g, { left: a.x, top: a.y - 1.5, width: b.x - a.x, height: 0, borderTop: '3px dashed #e8a33a', transformOrigin: '0 50%' }).ini({ sx: 0 });
    const tm = tag(g, a, '25日線 905.24円', -150, -10, '#b8651a', 14);
    const th = tag(g, hi, '高値 910円', 16, -34, '#c62828', 14), tc = tag(g, cl, '終値 868円', 16, -6, '#2b68d8', 14);
    E.wait(1.5);
    let L = E.say('hat', 'この日の高値910円は、25日線の905.24円を、上回った。', { wait: false, yomi: 'この日の高値、きゅうひゃくじゅうえんは、にじゅうごにちせんの、キューヒャクゴテンニヨンエンを、上回った。' });
    E.tw(ln, .6, { sx: [0, 1] }, 'inOut', .2); E.pop(tm, .3, .5);
    P.circle(g, { x: hi.x, y: hi.y, w: 14, h: 14, sw: 2, delay: L.dur * .2, dur: .3 }); E.pop(th, .3, L.dur * .25);
    E.at(L.end);
    L = E.say('hat', 'でも、終値の868円は、25日線より下だった。', { wait: false, yomi: 'でも、おわりねの、はっぴゃくろくじゅうはちえんは、にじゅうごにちせんより下だった。' });
    P.circle(g, { x: cl.x, y: cl.y, w: 14, h: 14, sw: 2, color: '#2b68d8', delay: .3, dur: .3 }); E.pop(tc, .3, .4);
    E.at(L.end);
    const mk = P.mark(sc.root, '場中と終値を区別', { x: 1380, y: 120, color: '#c62828', size: .75, rot: 7, w: 320 });
    L = E.say('hat', '投稿した、15時の瞬間の値段は、元資料にない。推測で、補わない。', { wait: false, yomi: '投稿した、15時の瞬間の値段は、もとしりょうにない。推測で、補わない。' });
    P.stampIn(mk, L.dur * .4);
    E.at(L.end + .4);
  });

  /* ============================================================ S6 I35　5月1日 */
  E.scene({ name: 'i35' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 30], [5, 1]);
    const i35 = P.icard(g, { id: 'I35', when: '2026/5/1 15:30', session: '引け後', title: '北海道七飯町・用地取得', text: '七飯町上軍川の蓄電池用地・系統権利等の取得を決議。<br>用地・権利の売却を目的とする', x: 260, y: 140, w: 1400, size: 34 });
    E.tw(i35, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '5月1日、15時30分。北海道七飯町、上軍川の、蓄電池の用地の取得を、決議した。', { yomi: '5月1日、15時30分。ほっかいどう、ななえちょう、かみいくさがわの、ちくでんちの用地の取得を、決議した。' });
    E.say('hat', '系統の権利なども含めて、売却することを、目的とした取得だ。');
    const ex = panel(g, { x: 260, y: 520, w: 1400, h: 110, size: 34, html: '<span style="color:#b8651a">系統の権利</span><span style="font:800 30px Round;color:#4a4552">＝ 蓄電所などを、電力の網につなぐための権利</span>' });
    const L = E.say('hat', '系統の権利は、蓄電所などを、電力の網につなぐための権利だ。', { wait: false, yomi: 'けいとうの権利は、ちくでんしょなどを、電力の網につなぐための権利だ。' });
    rise(ex, .2);
    E.at(L.end + .3);
  });

  /* ============================================================ S7 T37　5月13日 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 't37' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [5, 1], [5, 13]);
    const t37 = P.tcard(g, { id: 'T37', when: '2026/5/13 15:01', kind: 'チャート', session: '取引時間内', text: 'ダブルボトムと長い下ヒゲに言及', note: '4月28日安値625円、5月13日安値630円。下ヒゲは確認できるが、その後5月29日に625円を割った', x: 260, y: 140, w: 1400, size: 40 });
    tIn(t37);
    E.wait(1.0);
    E.narr('5月13日の15時01分。ダブルボトムと、長い下ヒゲに触れる投稿があった。', { yomi: '5月13日の15時1分。ダブルボトムと、長い下ヒゲに触れる投稿があった。' });
    E.tw(t37, .4, { y: -30, s: .9 }, 'inOut');
    // ダブルボトムの形（しくみの図）
    const pts = [[0, 40], [180, 250], [330, 110], [480, 255], [700, 0]];
    const wl = E.polyline(g, pts, { left: 610, top: 470, width: 700, height: 300, color: '#e8a33a', sw: 10 }).ini({ draw: 0 });
    const lb = E.div(g, { left: 610, top: 790, width: 700, textAlign: 'center', font: '900 32px/1.2 Zen', color: '#f5c46a' }, 'ダブルボトム（しくみの図）').ini({ o: 0 });
    const L = E.say('hat', 'ダブルボトムは、同じくらいの安値を、2回つけて、底になる形のことだ。', { wait: false, yomi: 'ダブルボトムは、同じくらいの安値を、にかいつけて、そこになる形のことだ。' });
    E.tw(wl, 1.4, { draw: [0, 1] }, 'inOut', .2); E.show(lb, .3, .4);
    P.circle(g, { x: 790, y: 720, w: 70, h: 70, delay: L.dur * .5, dur: .35 });
    P.circle(g, { x: 1090, y: 725, w: 70, h: 70, delay: L.dur * .65, dur: .35 });
    E.at(L.end + .3);
  });

  E.scene({ name: 't37_chart' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = dailyChart(sc, '日足　2026年4月28日〜5月13日');
    P.look(sc.cam, { s: 1.9, cx: C.at(1316, 0).x, cy: C.at(0, 430).y, dur: 1.4, delay: .2 });
    const l1 = C.at(PX['4/28'], PY(625)), l2 = C.at(PX['5/13'], PY(630));
    const a = tag(g, l1, '4/28 安値 625円', -60, 10, '#1b8a5a'), b = tag(g, l2, '5/13 安値 630円', -60, 10, '#1b8a5a');
    E.wait(1.6);
    const L = E.say('hat', '4月28日の安値は625円。5月13日の安値は630円。', { wait: false, yomi: '4月28日の安値は、ろっぴゃくにじゅうごえん。5月13日の安値は、ろっぴゃくさんじゅうえん。' });
    P.circle(g, { x: l1.x, y: l1.y, w: 26, h: 26, sw: 3, delay: .2, dur: .3 }); E.pop(a, .3, .3);
    P.circle(g, { x: l2.x, y: l2.y, w: 26, h: 26, sw: 3, delay: L.dur * .5, dur: .3 }); E.pop(b, .3, L.dur * .55);
    E.at(L.end + .4);
  });

  E.scene({ name: 'candle' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '5月13日のローソク足', 50);
    E.show(tt, .3);
    // 値段 → 画面の y（600円〜820円を 840〜200 に）
    const y = p => 840 - (p - 600) * (640 / 220);
    const cx = 700;
    const wick = E.div(g, { left: cx - 4, top: y(765), width: 8, height: y(630) - y(765), background: '#e04848', transformOrigin: '50% 0' }).ini({ sy: 0 });
    const body = E.div(g, { left: cx - 70, top: y(795), width: 140, height: y(765) - y(795), borderRadius: 6, background: '#e04848', boxShadow: '0 8px 18px rgba(0,0,0,.35)' }).ini({ o: 0 });
    const lab = (p, t, c) => E.div(g, { left: cx - 520, top: y(p) - 24, width: 400, textAlign: 'right', font: '900 40px/1.2 Noto', color: c, whiteSpace: 'nowrap' }, t).ini({ o: 0 });
    const lo = lab(795, '終値 795円', '#ff8a8a'), lop = lab(765, '始値 765円', '#f3e6c8'), lol = lab(630, '安値 630円', '#8ee0b0');
    const br = E.div(g, { left: cx + 110, top: y(765), width: 30, height: y(630) - y(765), borderTop: '4px solid #ffd84a', borderRight: '4px solid #ffd84a', borderBottom: '4px solid #ffd84a' }).ini({ o: 0 });
    const brl = E.div(g, { left: cx + 170, top: (y(765) + y(630)) / 2 - 40, font: '900 54px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '下ヒゲ 135円<div style="font:800 28px/1.4 Round;color:#f3e6c8">765円 − 630円</div>').ini({ o: 0 });
    E.wait(.4);
    let L = E.say('hat', '5月13日は、始値765円、安値630円、終値795円。', { wait: false, yomi: '5月13日は、はじめね、ななひゃくろくじゅうごえん、安値、ろっぴゃくさんじゅうえん、おわりね、ななひゃくきゅうじゅうごえん。' });
    E.show(body, .3, .2); E.show(lop, .3, .2);
    E.tw(wick, .5, { sy: [0, 1] }, 'out', L.dur * .35); E.show(lol, .3, L.dur * .4);
    E.show(lo, .3, L.dur * .7);
    E.at(L.end);
    const mk = P.mark(sc.root, '安値圏の反発は確認', { x: 1340, y: 120, color: '#1b8a5a', size: .75, rot: 7, w: 340 });
    L = E.say('hat', '下ヒゲは、135円。長い下ヒゲは、実際にあった。', { wait: false, yomi: 'したヒゲは、ひゃくさんじゅうごえん。長い、したヒゲは、実際にあった。' });
    E.show(br, .3, .2); E.pop(brl, .4, .4); E.sfx('ding', { delay: .4, gain: .5 });
    P.stampIn(mk, L.dur * .6);
    E.at(L.end);
    const nb = panel(g, { x: 1040, y: 680, w: 800, h: 110, size: 32, dark: true, html: 'そのあと 5/29 安値 587円で、625円を割る' });
    L = E.say('hat', 'ただ、そのあと、5月29日に、625円を割った。', { wait: false, yomi: 'ただ、そのあと、5月29日に、ろっぴゃくにじゅうごえんを割った。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('drop', { delay: .3, gain: .5 });
    E.at(L.end);
    const call = P.eveCall(g, ['normal', 'surprise'], { x: 1560, y: 330, w: 300, h: 240 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '下ヒゲの反発はあったけど、そのあと、底は更新されたんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: 'したヒゲの、はんぱつはあったけど、そのあと、そこは、こうしんされたんだねー。' });
    E.wait(.3);
  });

  /* ============================================================ S8 I36　5月14日 */
  E.scene({ name: 'i36' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [5, 13], [5, 14]);
    const i36 = P.icard(g, { id: 'I36', when: '2026/5/14 15:30', session: '引け後', title: '北海道七飯町・別用地取得', text: '七飯町仁山の蓄電池用地・系統権利等の取得を決議。<br>取得価格は非公表', x: 260, y: 140, w: 1400, size: 34 });
    E.tw(i36, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '5月14日、15時30分。同じ七飯町の、仁山の用地の取得も、決議した。取得価格は、非公表だ。', { yomi: '5月14日、15時30分。同じ、ななえちょうの、にやまの用地の取得も、決議した。取得価格は、ひこうひょうだ。' });
    E.tw(i36, .35, { o: 0, y: -30 }, 'in2');
    const hd = E.div(g, { left: 260, top: 200, width: 1400, display: 'flex', font: '900 30px/1.2 Zen', color: '#ffd84a', textAlign: 'center' }, '<span style="width:400px">用地（七飯町）</span><span style="width:500px">取得の決議</span><span style="width:500px">のちの売却（所在地が対応）</span>').ini({ o: 0 });
    const row = (y, a, b, c) => E.div(g, { left: 260, top: y, width: 1400, height: 120, borderRadius: 20, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', textAlign: 'center', font: '900 40px/1.2 Noto', color: '#262236', boxShadow: '0 10px 22px rgba(0,0,0,.3)' }, `<span style="width:400px;font-family:Zen">${a}</span><span style="width:500px;color:#b8651a">${b}</span><span style="width:500px;color:#b8651a">${c}</span>`).ini({ o: 0 });
    const r1 = row(260, '上軍川', '5/1（I35）', '6/30（I42）'), r2 = row(410, '仁山', '5/14（I36）', '7/30（I44）');
    E.show(hd, .3, .3);
    E.tw(r1, .4, { o: [0, 1], x: [-40, 0] }, 'back', .4); E.sfx('slide', { delay: .4 });
    E.tw(r2, .4, { o: [0, 1], x: [-40, 0] }, 'back', .7); E.sfx('slide', { delay: .7 });
    E.wait(1.2);
    E.say('hat', 'どちらの場所でも、のちに、用地の売却が開示される。上軍川は6月30日、仁山は7月30日だ。', { yomi: 'どちらの場所でも、のちに、用地の売却が開示される。かみいくさがわは、6月30日、にやまは、7月30日だ。' });
    E.wait(.3);
  });

  /* ============================================================ S9 T38　5月18日 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 't38' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .7 });
    P.slate(g);
    bar(g, [5, 14], [5, 18]);
    const t38 = P.tcard(g, { id: 'T38', when: '2026/5/18 12:04', kind: '需給', session: '昼休み', text: '海帆と保有者が重なり朝に売りが出たと推測', note: '保有者の重複や売り手の同定は未確認。5月18日は安値689円、終値779円', x: 260, y: 140, w: 1400, size: 40 });
    tIn(t38);
    E.wait(1.0);
    E.narr('5月18日、12時04分。昼休みの投稿だ。', { yomi: '5月18日、12時4分。ひるやすみの投稿だ。' });
    E.narr('海帆と、保有者が重なっていて、朝に売りが出た、と推測していた。');
    E.say('hat', '海帆は、別の上場会社だ。くわしくは、第17章で見る。');
    const m = P.mark(g, '未確認', { x: 1300, y: 430, color: '#c62828', size: .85, rot: 8, w: 220 });
    let L = E.say('hat', '保有者が重なっているのか、誰が売ったのかは、確かめられていない。', { wait: false });
    P.stampIn(m, L.dur * .5);
    E.at(L.end);
    const pr = panel(g, { x: 360, y: 560, w: 1200, h: 130, size: 44, html: '<span style="font:800 30px Round;color:#6a6066">5/18</span><span style="color:#1b8a5a">安値 689円</span><span style="color:#2b68d8">終値 779円</span>' });
    L = E.say('hat', 'この日は、安値689円、終値779円だった。', { wait: false, yomi: 'この日は、安値、ろっぴゃくはちじゅうきゅうえん、おわりね、ななひゃくななじゅうきゅうえんだった。' });
    rise(pr, .2);
    E.at(L.end + .4);
  });

  /* ============================================================ S10 ブルちゃんの部屋 */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_room' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: '保有', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    const memo = E.div(g, { left: 1150, top: 100, padding: '10px 26px', borderRadius: 14, background: 'rgba(255,255,255,.95)', font: '900 36px/1.4 Noto', color: '#3a3236', boxShadow: '0 8px 18px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }, '底？　625円・630円').ini({ o: 0, r: -2 });
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 4, delay: .3 });
    E.wait(.6);
    const L = E.narr('625円と、630円。チャートの安値を、自分で見比べて、私は、ほっとしていた。', { wait: false, yomi: 'ろっぴゃくにじゅうごえんと、ろっぴゃくさんじゅうえん。チャートの安値を、じぶんで見比べて、私は、ほっとしていた。' });
    E.pop(memo, .4, L.dur * .3, .6); E.sfx('page', { delay: L.dur * .3, gain: .5 });
    E.at(L.end);
    E.narr('二番底なら、ここから上がる。そう、思いたかった。');
    E.wait(.3);
  });

  /* ============================================================ S11 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '底は、あとからしか分からない', { left: 120, top: 120, font: '900 64px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .07));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const dots = [[260, 560, '4/28<br>625円'], [620, 550, '5/13<br>630円'], [980, 600, '？']].map(([x, y, t], i) => {
      const d = E.div(paper, { left: x - 24, top: y - 24, width: 48, height: 48, borderRadius: '50%', background: i === 2 ? '#c62828' : '#2a2230' }).ini({ o: 0 });
      const l = E.div(paper, { left: x - 120, top: y + 34, width: 240, textAlign: 'center', font: '900 34px/1.3 Zen', color: i === 2 ? '#c62828' : '#2a2230' }, t).ini({ o: 0 });
      return [d, l];
    });
    const path = E.polyline(paper, [[140, 300], [260, 560], [440, 380], [620, 550], [800, 420], [980, 600]], { left: 0, top: 0, width: 1400, height: 820, color: '#a09070', sw: 5 }).ini({ draw: 0 });
    E.wait(2.4);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「底は、あとからしか分からない」。', { wait: false, yomi: 'そこは、あとからしか分からない。' });
    E.tw(path, 1.4, { draw: [0, 1] }, 'inOut', .1);
    dots.forEach(([d, l], i) => { E.pop(d, .3, .3 + i * .45); E.show(l, .3, .35 + i * .45); });
    E.sfx('stamp', { delay: 1.3, gain: .5 });
    E.at(L.end + 1.0);
  });

  /* ============================================================ S12 男爵 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .75 });
    const C = P.closeup(g, CH('baron_e_normal'), { bg: 'radial-gradient(ellipse at 50% 40%, #4a1622 0%, #200a10 75%)', imgH: 860, panelBg: 'linear-gradient(180deg,#3a121b,#1a070c)' });
    E.from(C.img, { s: .94, y: 30 }, .6, 0, 'out');
    E.wait(.5);
    E.say('baron', '底が2つ見えると、人は、3つ目を考えなくなる。', { talk: C.img, talkAmp: 2, yomi: 'そこが、ふたつ見えると、人は、みっつめを、考えなくなる。' });
    C.swap(CH('baron_e_scheme'));
    E.say('baron', '底だったかどうかは、そのあとの値段が決める。', { talk: C.img, talkAmp: 2, yomi: 'そこだったかどうかは、そのあとの値段が決める。' });
    E.wait(.5);
  });

  /* ============================================================ S13 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 909 });
    [['T', P.T_BLUE], ['I', P.I_ORANGE]].forEach(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
    });
    const st = P.sticky(g, '第10章<br>5月27日 18時10分', { x: 1320, y: 120, w: 520, h: 250, rot: 5, size: 44 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第10章だブー。', { talk: pig, talkAmp: 5, yomi: 'ブヒッ。次は、だいじゅっしょうだブー。' });
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
