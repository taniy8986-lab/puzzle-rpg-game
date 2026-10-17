// 完全版 第11章「516円のトリプルボトム」（2026年6月1日〜6月29日）
// 台本: story/k/k11_516円のトリプルボトム.md　元資料 p8・p11・p12・p13・p22・p33・p38
// 投稿は元資料の要約（本人の見解）。有名投資家の名前・アカウントは出さない。ブルちゃんの保有はフィクション
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

  /* ============================================================ S2 T44　6月4日 11:51 */
  E.scene({ name: 't44' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    bar(g, [6, 1], [6, 4]);
    const t44 = P.tcard(g, { id: 'T44', when: '2026/6/4 11:51', kind: 'チャート', session: '昼休み', text: '516円のトリプルボトムが完成したと評価', note: '添付は月足と日足。月足の540・520・516円という3度の安値圏と対応するが、長期の上値突破は未確認', x: 260, y: 140, w: 1400, size: 40 });
    tIn(t44);
    E.wait(1.0);
    E.narr('6月4日、11時51分。昼休みの投稿だ。', { yomi: '6月4日、11時51分。ひるやすみの投稿だ。' });
    E.narr('516円の、トリプルボトムが完成した、という評価だった。', { yomi: 'ごひゃくじゅうろくえんの、トリプルボトムが完成した、という評価だった。' });
    E.tw(t44, .4, { y: -30, s: .9 }, 'inOut');
    const pts = [[0, 30], [150, 250], [270, 110], [400, 252], [520, 120], [650, 255], [800, 0]];
    const wl = E.polyline(g, pts, { left: 560, top: 470, width: 800, height: 300, color: '#e8a33a', sw: 10 }).ini({ draw: 0 });
    const lb = E.div(g, { left: 560, top: 790, width: 800, textAlign: 'center', font: '900 32px/1.2 Zen', color: '#f5c46a' }, 'トリプルボトム（しくみの図）').ini({ o: 0 });
    let L = E.say('hat', 'トリプルボトムは、同じくらいの安値を、3回つけて、底になる形のことだ。', { wait: false, yomi: 'トリプルボトムは、同じくらいの安値を、さんかいつけて、そこになる形のことだ。' });
    E.tw(wl, 1.4, { draw: [0, 1] }, 'inOut', .2); E.show(lb, .3, .4);
    [150, 400, 650].forEach((x, i) => P.circle(g, { x: 560 + x, y: 470 + 250, w: 64, h: 64, delay: L.dur * .45 + i * .3, dur: .3 }));
    E.at(L.end);
    E.say('hat', '投稿の画像は、月足と日足。日足の、3回の安値だと思うと、取り違える。', { yomi: '投稿の画像は、つきあしと、ひあし。ひあしの、さんかいの安値だと思うと、取り違える。' });
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
    const cl = tag(g, C.at(X12(2026, 6), PY12(600)), '6月末の終値 600円', 30, -12, '#c62828', 13);
    L = E.say('hat', '月末の終値600円を、6月4日に分かっていた情報として、扱わない。', { wait: false, yomi: 'げつまつの、おわりね、ろっぴゃくえんを、6月4日に分かっていた情報として、扱わない。' });
    E.pop(cl, .3, .3);
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
    const c4 = C.at(X08('6/4'), PY08(720)), h5 = C.at(X08('6/5'), PY08(854));
    const a = C.at(X08('5/25') - 20, PY08(1000)), b = C.at(X08('6/18') + 20, PY08(1000));
    const ln = E.div(g, { left: a.x, top: a.y - 1.5, width: b.x - a.x, height: 0, borderTop: '3px dashed #c62828', transformOrigin: '0 50%' }).ini({ sx: 0 });
    const tl = tag(g, C.at(X08('6/9'), PY08(1000)), '4月の高値 1,000円', 0, -30, '#c62828');
    const t4 = tag(g, c4, '6/4 終値 720円', -150, 6, '#2b68d8'), t5 = tag(g, h5, '6/5 高値 854円', 14, -16, '#c62828');
    E.wait(1.6);
    let L = E.say('hat', '6月4日の終値は720円。次の日、6月5日の高値は854円。反発は、実際にあった。', { wait: false, yomi: '6月4日の、おわりねは、ななひゃくにじゅうえん。次の日、6月5日の高値は、はっぴゃくごじゅうよえん。反発は、実際にあった。' });
    P.circle(g, { x: c4.x, y: c4.y, w: 24, h: 24, sw: 3, color: '#2b68d8', delay: .3, dur: .3 }); E.pop(t4, .3, .35);
    P.circle(g, { x: h5.x, y: h5.y, w: 24, h: 24, sw: 3, delay: L.dur * .4, dur: .3 }); E.pop(t5, .3, L.dur * .45);
    E.at(L.end);
    L = E.say('hat', 'でも、4月の高値、1,000円には、届かなかった。', { wait: false, yomi: 'でも、4月の高値、せんえんには、届かなかった。' });
    E.tw(ln, .8, { sx: [0, 1] }, 'inOut', .2); E.pop(tl, .3, .6);
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
    const L = E.narr('516円で、3回目の底。私は、もう下がらない、と思いたかった。', { wait: false, yomi: 'ごひゃくじゅうろくえんで、さんかいめの、そこ。私は、もう下がらない、と思いたかった。' });
    E.pop(memo, .4, L.dur * .3, .6); E.sfx('page', { delay: L.dur * .3, gain: .5 });
    E.at(L.end);
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
    const n = P.kNotice(g, { x: 100, y: 330, w: 1720, size: 32 });
    E.show(n, .6, .2);
    E.wait(6.0);
  });
  E.bgmStop(2.5, -2.5);
  E.finish();
}
