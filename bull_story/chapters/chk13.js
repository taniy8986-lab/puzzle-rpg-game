// 完全版 第13章「480円と、売れていく用地」（2026年7月13日〜9月15日）
// 台本: story/k/k13_480円と、売れていく用地.md　元資料 p8・p9・p12・p14・p23・p34・p38
// 投稿は元資料の要約（本人の見解）。有名投資家の名前・アカウントは出さない。ブルちゃんの保有はフィクション
// T48 のあとの急騰は「投稿が原因かは分からない」。値動きが続かないことは「手掛かり」まで
'use strict';
E.chapter('k13');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;
  const bar = (g, from, to) => P.monthBar(g, { year: 2026, start: 7, months: 3, from, to, x: 410, w: 1100 });
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const rise = (n, d = 0) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', d); E.sfx('pop', { delay: d, gain: .5 }); };
  const chartTitle = (sc, t) => E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, t);
  const tag = (g, pt, txt, dx, dy, c = '#262236', size = 17) => E.div(g, { left: pt.x + dx, top: pt.y + dy, padding: '3px 10px', borderRadius: 8, background: 'rgba(255,255,255,.96)', font: `900 ${size}px/1.3 Noto`, color: c, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }, txt).ini({ o: 0 });
  const fiction = sc => P.note(sc.root, 'ブルちゃんの売買はフィクションです', { x: 1440, y: 40, size: 24, dark: true });
  const tIn = (n, d = .5) => { E.tw(n, .45, { o: [0, 1], x: [60, 0] }, 'back', d); E.sfx('notify', { delay: d }); };
  const swap = (a, b) => { E.tw(a, .35, { o: 0, x: -60 }, 'in2'); tIn(b, .4); };
  // p08 日足（5/25 から 32.375px/取引日、600円が y=469.5、0.5825 px/円）。取引日の番号
  const IDX = { '7/23': 42, '7/24': 43, '7/28': 45, '7/30': 47, '8/25': 64 };
  const X08 = d => 194.5 + 32.375 * IDX[d];
  const PY08 = p => 469.5 + (600 - p) * 0.5825;
  const dailyChart = (sc, title) => {
    const C = P.chart(sc.cam, CHART('08'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, title);
    P.note(sc.root, '分割後の値段（元資料 p8）', { x: 1540, y: 896, size: 22, dark: true });
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

  /* ============================================================ S0 アバン：7月23日 */
  P.phoneScene((ph, sc) => {
    E.bgm('memory', { fadeIn: 1.0, gain: .7 });
    fiction(sc);
    const scr = ph.screen, sw = ph.sw;
    E.div(scr, { left: 0, top: 0, width: sw, height: 1000, background: '#f4f6f9' });
    E.div(scr, { left: 0, top: 70, width: sw, textAlign: 'center', font: '900 30px/1.4 Zen', color: '#22252b' }, '保有している株');
    const card = E.div(scr, { left: 24, top: 150, width: sw - 48, height: 240, borderRadius: 18, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,.08)' });
    E.div(card, { left: 24, top: 20, font: '900 30px/1.4 Zen', color: '#22252b' }, 'エスポア（3260）');
    E.div(card, { left: 24, top: 80, font: '800 24px/1.6 Round', color: '#6a6066' }, '取得単価　700円');
    const low = E.div(card, { left: 24, top: 130, font: '800 24px/1.6 Round', color: '#6a6066' }, '7/23 安値　<b style="font:900 40px Noto;color:#1b8a5a">480円</b>').ini({ o: 0 });
    E.wait(1.0);
    const L = E.narr('7月23日。安値は、480円。', { wait: false, yomi: '7月23日。安値は、よんひゃくはちじゅうえん。' });
    E.show(low, .4, L.dur * .5); E.sfx('drop', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    E.narr('6月の516円も、下回った。', { yomi: '6月の、ごひゃくじゅうろくえんも、下回った。' });
    E.wait(.3);
  }, { name: 'avant_phone', wait: .4 });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 13, title: '480円と、売れていく用地', sub: '2026年7月13日〜9月15日', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 7月23日　480円 */
  E.scene({ name: 'jul23' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const C = dailyChart(sc, '日足　2026年7月23日');
    P.look(sc.cam, { s: 2.0, cx: C.at(1450, 0).x, cy: C.at(0, 440).y, dur: 1.4, delay: .2 });
    const lo = C.at(X08('7/23'), PY08(480)), cl = C.at(X08('7/23'), PY08(542));
    const t1 = tag(g, lo, '7/23 安値 480円', -170, -6, '#1b8a5a'), t2 = tag(g, cl, '終値 542円', 16, -10, '#2b68d8');
    E.wait(1.6);
    let L = E.say('hat', '7月23日の安値は480円。終値は542円。', { wait: false, yomi: '7月23日の安値は、よんひゃくはちじゅうえん。おわりねは、ごひゃくよんじゅうにえん。' });
    P.circle(g, { x: lo.x, y: lo.y, w: 24, h: 24, sw: 3, delay: .2, dur: .3 }); E.pop(t1, .3, .3);
    E.pop(t2, .3, L.dur * .6);
    E.at(L.end);
    const nb = E.div(sc.root, { left: 360, top: 780, width: 1200, height: 100, borderRadius: 22, background: '#2a2430', border: '3px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 34px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '6月の516円のあたりを下に抜けた（元資料 p12）').ini({ o: 0 });
    L = E.say('hat', '6月の516円のあたりを、下に抜けた。底を守る形には、ならなかった。', { wait: false, yomi: '6月の、ごひゃくじゅうろくえんのあたりを、下に抜けた。そこを守る形には、ならなかった。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('drop', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S3 T48　7月24日 */
  E.scene({ name: 't48' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [7, 23], [7, 24]);
    const t48 = P.tcard(g, { id: 'T48', when: '2026/7/24 13:49', kind: '需給', session: '取引時間内', text: 'エスポアの買い気配を示す板画像を投稿', note: '13時46分の画像は575円、585円に特別買い気配。当日終値642円。全日板の復元はできない', x: 260, y: 140, w: 1400, size: 40 });
    tIn(t48);
    E.wait(1.0);
    E.narr('7月24日、13時49分。買い気配を示す、板の画像の投稿があった。', { yomi: '7月24日、13時49分。かいけはいを示す、いたの画像の投稿があった。' });
    E.say('hat', '13時46分の画像には、575円と、585円の、特別買い気配が写っていた。', { yomi: '13時46分の画像には、ごひゃくななじゅうごえんと、ごひゃくはちじゅうごえんの、とくべつかいけはいが、写っていた。' });
    const ex = panel(g, { x: 260, y: 520, w: 1400, h: 110, size: 32, html: '<span style="color:#d22d68">特別買い気配</span><span style="font:800 28px Round;color:#4a4552">＝ 買い注文が売り注文より多く、すぐには売買が成り立たないときの表示</span>' });
    let L = E.say('hat', '特別買い気配は、買い注文が売り注文より多く、すぐには売買が成り立たないときの表示だ。', { wait: false, yomi: 'とくべつかいけはいは、かいちゅうもんが、うりちゅうもんより多く、すぐには、ばいばいが成り立たないときの表示だ。' });
    rise(ex, .2);
    E.at(L.end);
    E.say('hat', 'この日の終値は642円。一日分の板の動きは、元資料でも、復元できない。', { yomi: 'この日の、おわりねは、ろっぴゃくよんじゅうにえん。いちにちぶんの、いたの動きは、もとしりょうでも、復元できない。' });
    E.wait(.3);
  });

  /* ============================================================ S4 7月28日　892円 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'jul28' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = dailyChart(sc, '日足　2026年7月24日〜28日');
    P.look(sc.cam, { s: 2.0, cx: C.at(1560, 0).x, cy: C.at(0, 400).y, dur: 1.4, delay: .2 });
    const a = C.at(X08('7/24'), PY08(642)), b = C.at(X08('7/28'), PY08(892));
    const ta = tag(g, a, '7/24 終値 642円', -170, 6, '#2b68d8'), tb = tag(g, b, '7/28 高値 892円', 16, -14, '#c62828');
    E.wait(1.6);
    E.show(ta, .3, 0);
    let L = E.say('hat', '7月28日には、高値892円をつけた。', { wait: false, yomi: '7月28日には、高値、はっぴゃくきゅうじゅうにえんを、つけた。' });
    P.circle(g, { x: b.x, y: b.y, w: 24, h: 24, sw: 3, delay: .3, dur: .3 }); E.pop(tb, .3, .4);
    E.at(L.end);
    const nb = E.div(sc.root, { left: 300, top: 780, width: 1320, height: 100, borderRadius: 22, background: '#2a2430', border: '3px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 34px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '投稿が上げの原因かは　この比較だけでは分からない').ini({ o: 0 });
    L = E.say('hat', 'ただ、投稿が、この上げの原因かは、この比較だけでは分からない。', { wait: false });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S5 ブルちゃん（892円） */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_892' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    const scr = E.div(R.screen, { left: 0, top: 0, width: 492, height: 290, background: '#f4f6f9' });
    E.div(scr, { left: 20, top: 18, font: '800 20px/1.3 Round', color: '#6a6066' }, '保有：エスポア（3260）');
    E.div(scr, { left: 20, top: 70, font: '900 34px/1.5 Noto', color: '#22252b' }, '取得 700円<br><span style="color:#d22d68">7/28 高値 892円</span>');
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    P.look(sc.cam, { s: 1.25, cx: 1200, cy: 420, dur: 4, delay: .3 });
    E.wait(.6);
    E.narr('892円。私の700円より、ずっと上だった。', { yomi: 'はっぴゃくきゅうじゅうにえん。私の、ななひゃくえんより、ずっと上だった。' });
    E.narr('ここで売れば、利益が出た。でも、私は、事業の知らせが続けば、まだ上がると思っていた。');
    E.wait(.3);
  });

  /* ============================================================ S6 I44 → T49 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'i44' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    bar(g, [7, 28], [7, 30]);
    const i44 = P.icard(g, { id: 'I44', when: '2026/7/30 15:30', session: '引け後', title: '七飯町仁山・用地売却', text: '北海道七飯町仁山の用地・系統権利を売却。<br>7/30決済予定、2027年2月期業績への寄与を見込む', note: '売却価格5,500万円以上と利益額を区別', x: 260, y: 130, w: 1400, size: 32 });
    E.tw(i44, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '7月30日、15時30分。七飯町、仁山の、用地と系統の権利の売却を、開示した。', { yomi: '7月30日、15時30分。ななえちょう、にやまの、用地と、けいとうの権利の売却を、開示した。' });
    E.say('hat', '売却の価格は、5,500万円以上。これは、利益の額とは違う。', { yomi: '売却の価格は、ごせんごひゃくまんえん以上。これは、利益の額とは違う。' });
    E.tw(i44, .35, { o: 0, y: -30 }, 'in2');
    const tl = P.timeLink(g, { x: 260, y: 150, w: 1400, a: { id: 'I44', time: '15:30', sub: '会社の開示', color: P.I_ORANGE }, b: { id: 'T49', time: '15:34', sub: '投稿', color: P.T_BLUE }, label: '4分後' });
    tl.in(.4);
    const t49 = P.tcard(g, { id: 'T49', when: '2026/7/30 15:34', kind: '事業', session: '引け後', text: '蓄電池用地・送電系統権利の売却を紹介', note: '7月30日15時34分。7月28日の高値892円を付けた後の投稿', x: 300, y: 330, w: 1320, size: 40 });
    tIn(t49, 1.5);
    E.wait(2.0);
    E.narr('公表の4分後に、用地と、送電の系統の権利の売却を、紹介する投稿があった。', { yomi: '公表の4分後に、用地と、そうでんの、けいとうの権利の売却を、紹介する投稿があった。' });
    E.say('hat', '7月28日の、高値892円をつけた、あとの投稿だ。', { yomi: '7月28日の、高値、はっぴゃくきゅうじゅうにえんを、つけた、あとの投稿だ。' });
    E.wait(.3);
  });

  /* ============================================================ S7 I45　8月20日 */
  E.scene({ name: 'i45' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .7 });
    P.slate(g);
    bar(g, [7, 30], [8, 20]);
    const i45 = P.icard(g, { id: 'I45', when: '2026/8/20 15:50', session: '引け後', title: '調査報告書を延期', text: '追加調査が必要となり、<br>8月中旬目途から9月初旬目途へ提出を延期', note: '監査問題の解消が事業IRと並行して遅れていた', x: 260, y: 140, w: 1400, size: 34 });
    E.tw(i45, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '8月20日、15時50分。調査の報告書の提出が、延びた。');
    E.say('hat', '追加の調査が必要になり、8月中旬のめどから、9月初旬のめどに、延ばした。', { yomi: '追加の調査が必要になり、はちがつちゅうじゅんの、めどから、くがつしょじゅんの、めどに、延ばした。' });
    const nb = panel(g, { x: 220, y: 560, w: 1480, h: 110, size: 32, dark: true, html: '<span style="font:800 28px Round;color:#f3e6c8">元資料の分析</span><span>事業の開示が続く一方で、監査の問題の解消は遅れていた</span>' });
    const L = E.say('hat', '元資料は、事業の開示が続く一方で、監査の問題の解消は、遅れていた、と読んでいる。', { wait: false, yomi: 'もとしりょうは、事業の開示が続く一方で、監査の問題の解消は、遅れていた、と読んでいる。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S8 I46 → T50 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'i46' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    bar(g, [8, 20], [8, 25]);
    const i46 = P.icard(g, { id: 'I46', when: '2026/8/25 16:00', session: '引け後', title: '伊賀市・用地権利を売却', text: '三重県伊賀市佐那具町の用地・系統権利を売却。<br>8/28決済予定、価格は非公表で5,500万円以上', x: 260, y: 130, w: 1400, size: 32 });
    E.tw(i46, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '8月25日、16時。三重県伊賀市、佐那具町の、用地と系統の権利の売却を、開示した。', { yomi: '8月25日、16時。みえけん、いがし、さなぐちょうの、用地と、けいとうの権利の売却を、開示した。' });
    E.say('hat', '価格は非公表で、5,500万円以上、という説明だ。', { yomi: '価格は、ひこうひょうで、ごせんごひゃくまんえん以上、という説明だ。' });
    E.tw(i46, .35, { o: 0, y: -30 }, 'in2');
    const tl = P.timeLink(g, { x: 260, y: 150, w: 1400, a: { id: 'I46', time: '16:00', sub: '会社の開示', color: P.I_ORANGE }, b: { id: 'T50', time: '16:42', sub: '投稿', color: P.T_BLUE }, label: '42分後' });
    tl.in(.4);
    const t50 = P.tcard(g, { id: 'T50', when: '2026/8/25 16:42', kind: '事業', session: '引け後', text: '伊賀市の蓄電池用地・系統権利売却のIR画像を掲載', note: '8月25日16時42分。画像の売却日は8月28日予定。価格は3本の移動平均線より下', x: 300, y: 330, w: 1320, size: 40 });
    tIn(t50, 1.5);
    E.wait(2.0);
    E.narr('公表の42分後に、その開示の画像を、載せた投稿があった。');
    E.wait(.3);
  });

  E.scene({ name: 'aug25' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = dailyChart(sc, '日足　2026年8月25日');
    P.look(sc.cam, { s: 2.0, cx: C.at(2140, 0).x, cy: C.at(0, 440).y, dur: 1.4, delay: .2 });
    const cl = C.at(X08('8/25'), PY08(570)), ma = C.at(X08('8/25'), PY08(693.8));
    const a = C.at(X08('8/25') - 80, PY08(693.8)), b = C.at(X08('8/25') + 40, PY08(693.8));
    const ln = E.div(g, { left: a.x, top: a.y - 1.5, width: b.x - a.x, height: 0, borderTop: '3px dashed #e8a33a', transformOrigin: '0 50%' }).ini({ sx: 0 });
    const tm = tag(g, a, '25日線 693.80円', -150, -12, '#b8651a'), tc = tag(g, cl, '8/25 終値 570円', -170, 10, '#2b68d8');
    E.wait(1.6);
    let L = E.say('hat', 'この日の終値は570円。25日線は693.80円。値段は、線の下にあった。', { wait: false, yomi: 'この日の、おわりねは、ごひゃくななじゅうえん。にじゅうごにちせんは、ロッピャクキュージューサンテンハチゼロエン。値段は、線の下にあった。' });
    P.circle(g, { x: cl.x, y: cl.y, w: 24, h: 24, sw: 3, color: '#2b68d8', delay: .3, dur: .3 }); E.pop(tc, .3, .4);
    E.tw(ln, .6, { sx: [0, 1] }, 'inOut', L.dur * .4); E.pop(tm, .3, L.dur * .45);
    E.at(L.end);
    const nb = E.div(sc.root, { left: 300, top: 780, width: 1320, height: 100, borderRadius: 22, background: '#2a2430', border: '3px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 34px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '<span style="font:800 26px Round;color:#f3e6c8">元資料の分析</span>　事業の開示の共有　≠　下がる流れの改善').ini({ o: 0 });
    L = E.say('hat', '元資料は、事業の開示を共有することと、下がる流れが良くなることは、別だ、としている。', { wait: false, yomi: 'もとしりょうは、事業の開示を共有することと、下がる流れが良くなることは、別だ、としている。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S9 材料のあとの値動き（p38） */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'p38' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '蓄電池の開示のあとの終値（元資料 p38）', 46);
    E.show(tt, .3);
    const hd = E.div(g, { left: 160, top: 160, width: 1600, display: 'flex', font: '900 28px/1.2 Zen', color: '#ffd84a', textAlign: 'center' }, '<span style="width:400px">公表日の終値</span><span style="width:600px">翌取引日</span><span style="width:600px">5取引日後</span>').ini({ o: 0 });
    const row = (y, a, b, c, cb, cc, dim) => E.div(g, { left: 160, top: y, width: 1600, height: 120, borderRadius: 20, background: dim ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', textAlign: 'center', font: '900 40px/1.2 Noto', color: '#262236', boxShadow: '0 10px 22px rgba(0,0,0,.3)' },
      `<span style="width:400px">${a}</span><span style="width:600px;color:${cb}">${b}</span><span style="width:600px;color:${cc}">${c}</span>`).ini({ o: 0 });
    const r0 = row(210, '6/30　600円', '7/1　700円　+16.67%', '7/7　700円　+16.67%', '#d22d68', '#d22d68', true);
    const r1 = row(350, '7/30　754円', '7/31　750円　−0.53%', '8/6　729円　−3.32%', '#1b8a5a', '#1b8a5a');
    const r2 = row(490, '8/25　570円', '8/26　581円　+1.93%', '9/1　527円　−7.54%', '#d22d68', '#1b8a5a');
    E.show(hd, .3, .2); E.tw(r0, .4, { o: [0, .85], x: [-40, 0] }, 'back', .4);
    E.wait(.6);
    let L = E.say('hat', '7月30日の開示のあと、5取引日後の終値は、3.32％下がった。', { wait: false, yomi: '7月30日の開示のあと、ごとりひきびごの、おわりねは、サンテンサンニパーセント、下がった。' });
    E.tw(r1, .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    L = E.say('hat', '8月25日の開示のあとは、5取引日後に、7.54％下がった。', { wait: false, yomi: '8月25日の開示のあとは、ごとりひきびごに、ナナテンゴヨンパーセント、下がった。' });
    E.tw(r2, .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    const nb0 = panel(g, { x: 160, y: 650, w: 1600, h: 110, size: 30, dark: true, html: '騰落率には、ほかの情報や需給も含まれる（6/30は調査中断も同日開示）' });
    L = E.say('hat', 'この騰落率には、ほかの情報や、需給も、含まれている。', { wait: false, yomi: 'この、とうらくりつには、ほかの情報や、じゅきゅうも、含まれている。' });
    E.tw(nb0, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('ding', { delay: .2, gain: .5 });
    E.at(L.end + .2);
    E.hide(nb0, .3);
    const an = panel(g, { x: 160, y: 650, w: 1600, h: 110, size: 30, dark: true, html: '<span style="font:800 26px Round;color:#f3e6c8">元資料の分析</span><span>7/1は上げたが、7/30・8/25の材料のあとは続かなかった</span>' });
    E.say('hat', '元資料は、こう読んでいる。', { yomi: 'もとしりょうは、こう読んでいる。' });
    L = E.say('hat', '7月1日は上がったが、7月30日と、8月25日の材料のあとは、続かなかった。', { wait: false });
    E.tw(an, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('ding', { delay: .2, gain: .5 });
    E.at(L.end);
    E.say('hat', '評価が続かない点は、異変の手掛かりだ。');
    E.hide(an, .3);
    const an2 = panel(g, { x: 160, y: 650, w: 1600, h: 110, size: 30, dark: true, html: 'ただし　市場が、未公表の問題を知っていた証拠にはならない' });
    L = E.say('hat', 'ただし、市場が、まだ公表されていない問題を、知っていた証拠にはならない。', { wait: false });
    E.tw(an2, .4, { o: [0, 1], y: [20, 0] }, 'back', .2);
    E.at(L.end);
    E.hide(an2, .3);
    const an3 = panel(g, { x: 160, y: 650, w: 1600, h: 110, size: 30, dark: true, html: '<span style="font:800 26px Round;color:#f3e6c8">元資料の分析</span><span>売却価格 5,500万円以上　≠　利益額　（2027年2月期への寄与の見込み）</span>' });
    L = E.say('hat', '売った値段は、利益の額ではない。この開示は、2027年2月期への寄与の見込みだ。', { wait: false, yomi: '売った値段は、利益の額ではない。この開示は、2027年2月期への、きよの見込みだ。' });
    E.tw(an3, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('ding', { delay: .2, gain: .5 });
    E.at(L.end);
    E.say('hat', '元資料は、前の期の取引を、裏付ける資料とは違う、と読んでいる。', { yomi: 'もとしりょうは、前の期の取引を、裏付ける資料とは違う、と読んでいる。' });
    E.wait(.4);
  });

  /* ============================================================ S10 I47　8月30日（日曜） */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'i47' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .7 });
    P.slate(g);
    bar(g, [8, 25], [8, 30]);
    const i47 = P.icard(g, { id: 'I47', when: '2026/8/30 10:10', session: '休場日', title: '委員辞任・再延期', text: '委員1名が辞任し、残る3名で調査を継続。<br>報告書の提出期限を9/15とすると公表', note: '日曜10:10の開示。市場での比較は翌8/31から', x: 260, y: 140, w: 1400, size: 34 });
    E.tw(i47, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '8月30日、日曜日の、10時10分の開示だ。');
    E.say('hat', '委員の1人が辞任し、残る3人で、調査を続けると公表した。', { yomi: '委員の、ひとりが辞任し、残る、さんにんで、調査を続けると公表した。' });
    E.say('hat', '報告書の提出の期限は、9月15日になった。');
    const nb = panel(g, { x: 260, y: 600, w: 1400, h: 110, size: 34, dark: true, html: '市場が休みの日の開示 → 値段と比べるのは 8/31 から' });
    const L = E.say('hat', '市場が休みの日の開示だから、値段と比べるのは、次の日の、8月31日からだ。', { wait: false });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S11 9月15日まで */
  E.scene({ name: 'to915' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [8, 30], [9, 15]);
    const card = (x, d, v, sub, c) => E.div(g, { left: x, top: 260, width: 500, height: 320, borderRadius: 26, background: 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="font:900 40px/1.3 Noto;color:#262236;padding-top:44px">${d}</div><div style="font:900 72px/1.4 Noto;color:${c}">${v}</div><div style="font:800 28px/1.4 Round;color:#6a6066">${sub}</div>`).ini({ o: 0 });
    const c1 = card(160, '8月', '510円', '安値', '#1b8a5a'), c2 = card(710, '9月1日', '527円', '終値', '#262236'), c3 = card(1260, '9月15日', '471円', '終値（報告書の提出期限）', '#c62828');
    const a1 = E.div(g, { left: 664, top: 380, width: 46, font: '900 50px/1 Zen', color: '#f3e6c8' }, '▶').ini({ o: 0 }), a2 = E.div(g, { left: 1214, top: 380, width: 46, font: '900 50px/1 Zen', color: '#f3e6c8' }, '▶').ini({ o: 0 });
    E.wait(.4);
    let L = E.say('hat', '8月には、510円をつけた。9月1日の終値は、527円。', { wait: false, yomi: '8月には、ごひゃくじゅうえんを、つけた。9月1日の、おわりねは、ごひゃくにじゅうななえん。' });
    rise(c1, .2); E.show(a1, .3, L.dur * .5); rise(c2, L.dur * .55);
    E.at(L.end);
    L = E.say('hat', 'そして、報告書の期限の、9月15日。終値は、471円だった。', { wait: false, yomi: 'そして、報告書の期限の、9月15日。おわりねは、よんひゃくななじゅういちえんだった。' });
    E.show(a2, .3, .2); rise(c3, .4); E.sfx('drop', { delay: .4, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S12 累計出来高 7/13〜9/15 */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'cumvol' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '累計出来高の表（元資料 p14 の1行）', 44);
    E.show(tt, .3);
    const cols = [['対象期間', '07/13〜09/15', 340], ['価格変化', '−31.74%', 250], ['上昇日', '27.42', 220], ['下落日', '37.04', 220], ['変わらず', '1.23', 220], ['総出来高', '65.69', 230]];
    let x = 160;
    const cells = cols.map(([h, v, w], i) => {
      const n = E.div(g, { left: x, top: 220, width: w - 10, height: 230, borderRadius: 18, background: 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,.3)' },
        `<div style="font:800 28px/1.3 Round;color:#6a6066;padding-top:34px">${h}</div><div style="font:900 44px/1.6 Noto;color:#262236">${v}</div>`).ini({ o: 0 });
      x += w; return n;
    });
    E.div(g, { left: 120, top: 470, width: 1540, textAlign: 'right', font: '800 20px/1.3 Round', color: 'rgba(243,230,200,.8)', whiteSpace: 'nowrap' }, '単位：万株（分割調整後）。上昇日・下落日は終値の前日比で判定（ローソク足の赤・緑とは別）。価格変化は期間直前の終値→期間最終終値');
    E.wait(.3);
    let L = E.say('hat', '7月13日から、9月15日までの、累計出来高の表だ。', { wait: false, yomi: '7月13日から、9月15日までの、るいけいできだかの、ひょうだ。' });
    cells.forEach((c, i) => { E.tw(c, .35, { o: [0, 1], y: [20, 0] }, 'back', .2 + i * L.dur * .12); E.sfx('pop', { delay: .2 + i * L.dur * .12, gain: .35 }); });
    E.at(L.end);
    L = E.say('hat', '下がった日の出来高が、37.04万株と、大きい。終値も、31.74％下がった。', { wait: false, yomi: '下がった日の、できだかが、サンジューナナテンゼロヨンまんかぶと、大きい。おわりねも、サンジューイッテンナナヨンパーセント、下がった。' });
    P.circle(g, { x: 160 + 340 + 250 + 220 + 105, y: 360, w: 200, h: 120, delay: L.dur * .2 });
    P.circle(g, { x: 160 + 340 + 120, y: 360, w: 220, h: 110, delay: L.dur * .6 });
    E.at(L.end);
    const no = panel(g, { x: 260, y: 560, w: 1400, h: 110, size: 32, dark: true, html: '出来高は、値段と一緒に読む（元資料 p14）' });
    L = E.say('hat', '元資料は、出来高は、値段と一緒に読む、としている。', { wait: false, yomi: 'もとしりょうは、できだかは、値段と一緒に読む、としている。' });
    E.tw(no, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S13 ブルちゃんの部屋 */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_room' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: '保有', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    const cal = E.div(g, { left: 1150, top: 100, padding: '10px 26px', borderRadius: 14, background: 'rgba(255,255,255,.95)', font: '900 36px/1.4 Zen', color: '#3a3236', boxShadow: '0 8px 18px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }, '報告書の期限：9/15').ini({ o: 0, r: -2 });
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 4, delay: .3 });
    E.wait(.6);
    E.narr('用地は、次々と売れていった。でも、値段は、下がっていった。');
    const L = E.narr('報告書の期限まで、私は、ただ待っていた。', { wait: false });
    E.pop(cal, .4, L.dur * .3, .6); E.sfx('page', { delay: L.dur * .3, gain: .5 });
    E.at(L.end + .3);
  });

  /* ============================================================ S14 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '売った値段と、残る利益は、別の数字', { left: 120, top: 120, font: '900 64px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .07));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const d1 = E.div(paper, { left: 140, top: 380, width: 520, height: 260, borderRadius: 20, border: '5px dashed #a09070', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#a09070', paddingTop: 60 }, '売った値段<br><span style="font-size:32px">5,500万円以上</span>').ini({ o: 0 });
    const d2 = E.div(paper, { left: 760, top: 380, width: 520, height: 260, borderRadius: 20, border: '6px solid #c62828', background: 'rgba(255,255,255,.6)', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#c62828', paddingTop: 60 }, '残る利益<br><span style="font-size:34px">？</span>').ini({ o: 0 });
    E.wait(2.6);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「売った値段と、残る利益は、別の数字」。', { wait: false, yomi: '売った値段と、残る利益は、別の数字。' });
    E.show(d1, .4, .2); E.tw(d2, .45, { o: [0, 1], s: [1.2, 1] }, 'back', L.dur * .5); E.sfx('stamp', { delay: L.dur * .5 + .2, gain: .5 });
    E.at(L.end + 1.0);
  });

  /* ============================================================ S15 男爵 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .75 });
    const C = P.closeup(g, CH('baron_e_normal'), { bg: 'radial-gradient(ellipse at 50% 40%, #4a1622 0%, #200a10 75%)', imgH: 860, panelBg: 'linear-gradient(180deg,#3a121b,#1a070c)' });
    E.from(C.img, { s: .94, y: 30 }, .6, 0, 'out');
    E.wait(.5);
    E.say('baron', '売れた、という言葉は、もうかった、と聞こえる。', { talk: C.img, talkAmp: 2 });
    C.swap(CH('baron_e_scheme'));
    E.say('baron', 'だが、売った値段と、残る利益は、別の数字だ。', { talk: C.img, talkAmp: 2 });
    E.wait(.5);
  });

  /* ============================================================ S16 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #3a2c24 0%, #1d1612 75%, #120d0a 100%)' });
    const items = [['01:15', '調査の結果'], ['16:00', '報告書'], ['17:00', '？']];
    const x0 = 260, x1 = 1200, y = 470;
    const line = E.div(g, { left: x0, top: y, width: x1 - x0, height: 8, borderRadius: 4, background: '#c9a24a' }).ini({ cr: 100 });
    E.tw(line, 1.0, { cr: [100, 0] }, 'inOut', .2);
    items.forEach(([d, t], i) => {
      const xx = x0 + i * (x1 - x0) / (items.length - 1);
      const dot = E.div(g, { left: xx - 22, top: y - 18, width: 44, height: 44, borderRadius: '50%', background: i === 2 ? '#e0353f' : '#f3e6c8', border: '6px solid #c9a24a' }).ini({ o: 0 });
      const dl = E.div(g, { left: xx - 150, top: y - 90, width: 300, textAlign: 'center', font: '900 44px/1.2 Noto', color: '#f3e6c8' }, d).ini({ o: 0 });
      const tl = E.div(g, { left: xx - 190, top: y + 54, width: 380, textAlign: 'center', font: '800 32px/1.35 Round', color: i === 2 ? '#ff8a8a' : '#e8dcc0' }, t).ini({ o: 0 });
      [dot, dl, tl].forEach(n => E.pop(n, .4, .4 + i * .4, .6));
      E.sfx('click', { delay: .4 + i * .4 });
    });
    const st = P.sticky(g, '第14章<br>9月16日、三つの時刻', { x: 1300, y: 120, w: 540, h: 250, rot: 5, size: 42 });
    P.slap(st, 2.0);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.6);
    E.sfx('snort', { delay: 2.8 });
    E.wait(3.2);
    E.say('pig', 'ブヒッ。次は、第14章だブー。', { talk: pig, talkAmp: 5, yomi: 'ブヒッ。次は、だいじゅうよんしょうだブー。' });
    E.unsub(.4);
    const tsu = E.div(g, { left: 0, top: 760, width: W, textAlign: 'center', font: '900 64px/1.2 Zen', color: '#f3e6c8', letterSpacing: '.3em' }, 'つづく').ini({ o: 0 });
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
