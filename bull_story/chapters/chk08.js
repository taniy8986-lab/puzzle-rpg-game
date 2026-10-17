// 完全版 第8章「4月24日 17時45分」（2026年4月24日）
// 台本: story/k/k08_4月24日17時45分.md　元資料 p7・p13・p15・p21・p31・p37
// 投稿は元資料の要約（本人の見解）。有名投資家の名前・アカウントは出さない。ブルちゃんの保有と男爵の正体はフィクション
// T33（営業外収益などの開示の共有）と A03 の3取引は線で結ばず、場面を離す
'use strict';
E.chapter('k08');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;
  const MASK = '#5a0a14';
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const box = (g, { x, y, w = 700, h = 280, top = '', main = '', sub = '', c = '#262236', border = 'none', size = 50 }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 26, background: 'rgba(255,255,255,.95)', border, boxShadow: '0 12px 24px rgba(0,0,0,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 30px' },
    `${top ? `<div style="font:800 28px/1.3 Round;color:#6a6066">${top}</div>` : ''}<div style="font:900 ${size}px/1.3 Zen;color:${c};white-space:nowrap">${main}</div>${sub ? `<div style="font:800 30px/1.5 Round;color:#4a4552;margin-top:14px">${sub}</div>` : ''}`).ini({ o: 0 });
  const rise = (n, d = 0) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', d); E.sfx('pop', { delay: d, gain: .5 }); };
  const chartTitle = (sc, t) => E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, t);
  const tag = (g, pt, txt, dx, dy, c = '#262236', size = 17) => E.div(g, { left: pt.x + dx, top: pt.y + dy, padding: '3px 10px', borderRadius: 8, background: 'rgba(255,255,255,.96)', font: `900 ${size}px/1.3 Noto`, color: c, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }, txt).ini({ o: 0 });
  const fiction = sc => P.note(sc.root, 'ブルちゃんの売買はフィクションです', { x: 1440, y: 40, size: 24, dark: true });
  const tIn = (n, d = .5) => { E.tw(n, .45, { o: [0, 1], x: [60, 0] }, 'back', d); E.sfx('notify', { delay: d }); };
  const swap = (a, b) => { E.tw(a, .35, { o: 0, x: -60 }, 'in2'); tIn(b, .4); };
  // 4月24日の時間の軸（8:00〜19:30）
  const axis = (g, y) => P.dayAxis(g, { x: 160, y, w: 1600, from: 480, to: 1170, open: 540, band: [[540, 690, '前場'], [750, 930, '後場']] });
  const DOTS = [
    { m: 760, kind: 'T', label: 'T31 12:40' },
    { m: 1065, kind: 'I', label: 'I33・I34 17:45' },
    { m: 1078, kind: 'T', label: 'T32 17:58', lift: 52 },
    { m: 1080, kind: 'T', label: 'T33 18:00', lift: 104 },
    { m: 1125, kind: 'T', label: 'T34 18:45', lift: 156 },
  ];

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

  /* ============================================================ S0 アバン：4月24日の通知 */
  P.phoneScene((ph, sc) => {
    E.bgm('tension', { fadeIn: 1.0, gain: .7 });
    P.lock(ph, { date: '4月24日', week: '金曜日', time: '17:46' });
    const n1 = P.notice(ph, { title: 'エスポア（3260）', body: '2026年2月期の<br>決算短信', y: 330 });
    const n2 = P.notice(ph, { title: 'エスポア（3260）', body: '会社法監査の<br>意見不表明', y: 540 });
    P.notifyIn(n1, 1.0);
    E.wait(1.6);
    E.narr('4月24日、金曜日の夕方。延びていた決算が、やっと発表された。');
    const L = E.narr('同じ時刻に、もう一つ、開示が届いていた。', { wait: false });
    P.notifyIn(n2, L.dur * .3);
    E.at(L.end + .3);
  }, { name: 'avant_phone', wait: .4 });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 8, title: '4月24日 17時45分', sub: '2026年4月24日', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 4月24日を、時刻の順に */
  E.scene({ name: 'apr24' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    E.div(g, { left: 80, top: 60, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '2026年4月24日（金）　時刻の順番');
    const ax = axis(g, 440);
    E.show(ax.root, .5, .2);
    const dots = DOTS.map(d => P.axisDot(g, ax, { ...d, y: 440 }));
    E.wait(.6);
    E.say('hat', '4月24日を、時刻の順に並べる。');
    const L = E.say('hat', '取引時間の中に、投稿が1つ。引けのあと、17時45分に、会社の開示が2つ。そのあとに、投稿が3つだ。', { wait: false, yomi: '取引時間の中に、投稿が、ひとつ。ひけのあと、17時45分に、会社の開示が、ふたつ。そのあとに、投稿が、みっつだ。' });
    E.pop(dots[0], .4, .3); E.sfx('pop', { delay: .3 });
    E.pop(dots[1], .4, L.dur * .38); E.sfx('notify', { delay: L.dur * .38 });
    [2, 3, 4].forEach((i, k) => { E.pop(dots[i], .4, L.dur * .72 + k * .3); E.sfx('pop', { delay: L.dur * .72 + k * .3, gain: .5 }); });
    E.at(L.end + .5);
  });

  /* ============================================================ S3 T31　12:40 */
  E.scene({ name: 't31' }, sc => {
    const g = sc.cam;
    P.slate(g);
    E.div(g, { left: 80, top: 60, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '2026年4月24日（金）　時刻の順番');
    const ax = axis(g, 280);
    ax.root.ini({ o: 1 });
    const d = P.axisDot(g, ax, { ...DOTS[0], y: 280 }).ini({ o: 1 });
    const t31 = P.tcard(g, { id: 'T31', when: '2026/4/24 12:40', kind: '財務', session: '取引時間内', text: '決算延期時の急落と発表時の反応に言及', note: '単純にストップ高になるとは本人も断定していない', x: 300, y: 420, w: 1320, size: 38 });
    tIn(t31, .4);
    E.wait(1.0);
    E.narr('12時40分。決算が延びたときの急落と、発表のときの反応に、触れる投稿があった。');
    const ex = panel(g, { x: 300, y: 720, w: 1320, h: 110, size: 34, html: '<span style="color:#d22d68">ストップ高</span><span style="font:800 30px Round;color:#4a4552">＝ その日に上がれる値幅の上限まで、上がること</span>' });
    let L = E.say('hat', 'ストップ高は、その日に上がれる、値幅の上限まで、上がることだ。', { wait: false, yomi: 'ストップだかは、その日に上がれる、ネハバの上限まで、上がることだ。' });
    rise(ex, .2);
    E.at(L.end);
    E.say('hat', '単純に、ストップ高になる、とは、本人も断定していない。', { yomi: '単純に、ストップだかになる、とは、本人も断定していない。' });
    E.hide(ex, .3);
    const ord = panel(g, { x: 300, y: 720, w: 1320, h: 110, size: 34, dark: true, html: '投稿の時点（12:40）では、決算と監査の結果は　未公表' });
    L = E.say('hat', '投稿は、12時40分。その時点で、決算と、監査の結果は、まだ公表されていない。', { wait: false });
    E.tw(ord, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .35); E.sfx('ding', { delay: L.dur * .35, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S4 15時30分　この日の値段 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'close' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('07'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, '日足　2026年4月24日まで');
    P.note(sc.root, '分割後の値段（元資料 p7）', { x: 1540, y: 896, size: 22, dark: true });
    const clk = P.clock(sc.root, { x: 1640, y: 120, size: 180, min: 900 });
    const clkLab = E.div(sc.root, { left: 1580, top: 310, width: 300, textAlign: 'center', font: '900 40px/1.2 Noto', color: '#ffd84a' }, '15:30');
    P.look(sc.cam, { s: 1.8, cx: C.at(990, 0).x, cy: C.at(0, 470).y, dur: 1.4, delay: .2 });
    const cdl = C.at(1046.5, 367), t34 = C.at(1046.5, 349.5), iq = C.at(1046.5, 753);
    // 4/27 から右は、次の章まで隠す
    const c0 = C.at(1071, 140), c1 = C.at(2508, 1026);
    const curtain = E.div(g, { left: c0.x, top: c0.y, width: c1.x - c0.x, height: c1.y - c0.y, background: 'linear-gradient(90deg, rgba(20,16,30,.96), rgba(20,16,30,.92))', borderLeft: '3px dashed #ffd84a', transformOrigin: '0 50%' }).ini({ sx: 0 });
    const cl = E.div(g, { left: c0.x + 30, top: C.at(0, 400).y - 30, font: '900 26px/1.4 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '4/27から<br><span style="font-size:20px;color:#f3e6c8">第9章で見る</span>').ini({ o: 0 });
    const it = tag(g, iq, 'I33・I34 4/24 17:45（引け後）', -20, -36, '#b8651a');
    E.wait(1.4);
    let L = E.say('hat', '15時30分。この日の取引が、終わった。', { wait: false });
    E.tw(clk, .9, { min: [900, 930] }, 'inOut', .1); E.sfx('tick', { delay: .1, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '4月24日の値段は、17時45分の、2つの開示より前に、決まった値段だ。', { wait: false, yomi: '4月24日の値段は、17時45分の、ふたつの開示より前に、決まった値段だ。' });
    P.circle(g, { x: cdl.x, y: cdl.y, w: 44, h: 64, sw: 4, delay: .3, dur: .4 });
    E.tw(curtain, .7, { sx: [0, 1] }, 'out', L.dur * .45); E.sfx('slide', { delay: L.dur * .45, gain: .5 });
    E.pop(it, .3, L.dur * .6);
    E.hide(clk, .3, L.dur * .45); E.hide(clkLab, .3, L.dur * .45);
    E.at(L.end);
    const nt = P.note(sc.root, 'Tの印 ＝ 投稿を含む日の終値の位置', { x: 1100, y: 600, size: 28, dark: true }).ini({ o: 0 });
    L = E.say('hat', 'チャートのT34の印は、投稿を含む日の、終値の位置だ。投稿した瞬間の値段ではない。', { wait: false, yomi: 'チャートの、ティーさんじゅうよんの印は、投稿を含む日の、おわりねの位置だ。投稿した瞬間の値段ではない。' });
    P.circle(g, { x: t34.x, y: t34.y, w: 30, h: 30, sw: 3, color: '#2b68d8', delay: .4, dur: .35 });
    E.show(nt, .3, L.dur * .3);
    E.at(L.end);
    L = E.say('hat', '引けのあとの発表だから、値段の反応は、次の営業日の、4月27日から見る。', { wait: false, yomi: 'ひけのあとの発表だから、値段の反応は、次の営業日の、4月27日から見る。' });
    E.hide(nt, .3, .1);
    E.show(cl, .3, L.dur * .5);
    E.at(L.end);
    E.say('hat', 'それは、次の章で。');
    E.wait(.3);
  });

  /* ============================================================ S5 I33・I34　17時45分 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'i33i34' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .75 });
    P.slate(g);
    const clk = P.clock(g, { x: 110, y: 170, size: 250, min: 930 });
    E.div(g, { left: 85, top: 440, width: 300, textAlign: 'center', font: '900 52px/1.2 Noto', color: '#ffd84a' }, '17:45');
    E.div(g, { left: 85, top: 510, width: 300, textAlign: 'center', font: '800 26px/1.3 Round', color: 'rgba(243,230,200,.8)' }, '同時に公表');
    const i34 = P.icard(g, { id: 'I34', when: '2026/4/24 17:45', session: '引け後', title: '黒字・純資産プラスを発表', text: '当時の短信は売上5.56億円、純利益1,100万円、純資産2,100万円。<br>監査意見不表明と同時公表', note: '後に訂正対象となる当時の会社発表値', x: 440, y: 100, w: 1400, size: 30 });
    const i33 = P.icard(g, { id: 'I33', when: '2026/4/24 17:45', session: '引け後', title: '会社法監査・意見不表明', text: '期末の役務提供に関する3件の取引について監査証拠不足。<br>会社法の計算書類の監査意見を表明せず', note: '有報の監査は精査中とされた', x: 440, y: 480, w: 1400, size: 30 });
    E.tw(clk, 1.2, { min: [930, 1065] }, 'inOut', .3); E.sfx('tick', { delay: .3, gain: .5 });
    E.wait(1.6);
    E.say('hat', '17時45分。会社は、2つの開示を、同時に出した。', { yomi: '17時45分。会社は、ふたつの開示を、同時に出した。' });
    let L = E.say('hat', '1つは、決算の発表。当時の発表では、売上5.56億円、純利益1,100万円。', { wait: false, yomi: 'ひとつは、決算の発表。当時の発表では、うりあげ、ゴテンゴロクおくえん、じゅんりえき、せんひゃくまんえん。' });
    E.tw(i34, .45, { o: [0, 1], y: [30, 0] }, 'back', .2); E.sfx('notify', { delay: .2 });
    E.at(L.end);
    E.say('hat', '純資産は、2,100万円の、プラス、という発表だ。', { yomi: 'じゅんしさんは、にせんひゃくまんえんの、プラス、という発表だ。' });
    L = E.say('hat', 'もう1つは、監査の結果。会社法の監査で、監査人は、意見を表明しなかった。', { wait: false, yomi: 'もうひとつは、監査の結果。会社法の監査で、監査人は、意見を表明しなかった。' });
    E.tw(i33, .45, { o: [0, 1], y: [30, 0] }, 'back', .2); E.sfx('notify', { delay: .2 });
    E.at(L.end);
    E.say('hat', '期末の、サービスの提供に関する、3件の取引で、監査の証拠が、足りなかった。', { yomi: 'きまつの、サービスの提供に関する、さんけんの取引で、監査の証拠が、足りなかった。' });
    const call = P.eveCall(g, ['normal', 'surprise'], { x: 95, y: 600, w: 300, h: 240 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '黒字の発表と、監査の不表明が、同じ時刻に出たんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: 'くろじの発表と、監査の、ふひょうめいが、同じ時刻に出たんだねー。' });
    const m = P.mark(g, '当時の発表値', { x: 1470, y: 335, color: '#b8651a', size: .75, rot: 7, w: 230 });
    L = E.say('hat', 'この黒字や、純資産の数字は、のちに、訂正の対象になる。当時の、会社の発表の値だ。', { wait: false, yomi: 'この、くろじや、じゅんしさんの数字は、のちに、訂正の対象になる。当時の、会社の発表の、あたいだ。' });
    P.stampIn(m, L.dur * .55);
    E.at(L.end + .4);
  });

  /* ============================================================ S6 監査の意見（しくみの図） */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'opinion' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '監査の意見（しくみの図）', 60);
    E.show(tt, .3);
    const b1 = box(g, { x: 200, y: 200, main: '適正意見', sub: '数字が正しく作られている、と<br>監査人が認める', c: '#2b68d8' });
    const b2 = box(g, { x: 1020, y: 200, main: '意見不表明', sub: '十分な証拠が得られず、<br>意見を出さない', c: '#c62828', border: '5px solid #c62828' });
    const nb = panel(g, { x: 260, y: 540, w: 1400, h: 110, size: 36, dark: true, html: '「正しい」とも「間違っている」とも　言っていない' });
    E.wait(.4);
    E.say('hat', '監査人は、決算の数字が、正しく作られているかを確かめて、意見を出す。');
    let L = E.say('hat', '正しく作られている、と認めるのが、適正意見だ。', { wait: false });
    rise(b1, .2);
    E.at(L.end);
    L = E.say('hat', '意見を出すための、十分な証拠が得られないと、意見を表明しない。これが、意見不表明。', { wait: false });
    rise(b2, L.dur * .5);
    E.at(L.end);
    L = E.say('hat', '数字が正しい、とも、間違っている、とも、言っていない、ということだ。', { wait: false });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .3);
    [b1, b2, nb, tt].forEach(n => E.hide(n, .3));
    const tt2 = P.heading(g, '会社法の監査と、有価証券報告書の監査', 60);
    E.show(tt2, .3, .2);
    const b3 = box(g, { x: 200, y: 200, top: '4月24日', main: '会社法の監査', sub: '株主総会に出す、<br>計算書類が対象', c: '#b8651a' });
    const b4 = box(g, { x: 1020, y: 200, top: '別の監査', main: '有価証券報告書の監査', size: 44, sub: 'この時点では<br>精査中とされた', c: '#4a4552' });
    const s3 = P.mark(g, '不表明', { x: 700, y: 205, color: '#c62828', size: .7, rot: -8, w: 180 });
    L = E.say('hat', 'この日の監査は、会社法の監査。株主総会に出す、計算書類が対象だ。', { wait: false });
    rise(b3, .2); P.stampIn(s3, L.dur * .7);
    E.at(L.end);
    L = E.say('hat', '有価証券報告書の監査は、別にある。この時点では、まだ精査中、とされていた。', { wait: false });
    rise(b4, .3);
    E.at(L.end + .4);
  });

  /* ============================================================ S7 T32・T33 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 't32t33' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .7 });
    P.slate(g);
    const ch = P.chain(g, { x: 80, y: 110, w: 1760, cw: 340, gaps: ['13分後', '2分後', '45分後'], items: [
      { id: 'I33・I34', time: '17:45', sub: '会社の開示', color: P.I_ORANGE },
      { id: 'T32', time: '17:58', sub: '投稿', color: P.T_BLUE },
      { id: 'T33', time: '18:00', sub: '投稿', color: P.T_BLUE },
      { id: 'T34', time: '18:45', sub: '投稿', color: P.T_BLUE }] });
    ch.in(0, .2); ch.in(1, .8);
    const t32 = P.tcard(g, { id: 'T32', when: '2026/4/24 17:58', kind: '財務', session: '引け後', text: '前期最終黒字・今期予想非開示の記事を共有', note: '4月24日17時58分。当日終値は記事投稿より前の値', x: 260, y: 300, w: 1400, size: 40 });
    tIn(t32, 1.6);
    E.wait(2.2);
    E.narr('公表の13分後に、前の期の最終黒字と、今期の予想は出さない、という記事が、共有された。', { yomi: '公表の13分後に、前の期の、さいしゅう、くろじと、こんきの予想は出さない、という記事が、共有された。' });
    E.say('hat', 'この日の終値は、この投稿より前に、もう決まっていた値段だ。', { yomi: 'この日の、おわりねは、この投稿より前に、もう決まっていた値段だ。' });
    const t33 = P.tcard(g, { id: 'T33', when: '2026/4/24 18:00', kind: '財務', session: '引け後', text: '営業外収益などの会社開示を共有', note: '4月24日18時00分', x: 260, y: 300, w: 1400, size: 40 });
    ch.in(2, .1);
    swap(t32, t33);
    E.narr('公表の15分後には、営業外収益などの、会社の開示が、共有された。', { delay: .8 });
    E.say('hat', '営業外収益は、本業の外で得た、収益のことだ。');
    E.wait(.3);
  });

  /* ============================================================ S8 T34　18:45 */
  E.scene({ name: 't34' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tl = P.timeLink(g, { x: 260, y: 110, w: 1400, a: { id: 'I33・I34', time: '17:45', sub: '会社の開示', color: P.I_ORANGE }, b: { id: 'T34', time: '18:45', sub: '投稿', color: P.T_BLUE }, label: '1時間後' });
    tl.in(.2);
    const t34 = P.tcard(g, { id: 'T34', when: '2026/4/24 18:45', kind: '財務', session: '引け後', text: '債務超過解消と有報までの適正意見を見込む', note: '5月27日会社発表・28日有報では意見不表明。この見通しは実現しなかった', x: 260, y: 290, w: 1400, size: 40 });
    tIn(t34, 1.2);
    E.wait(1.8);
    E.narr('18時45分。債務超過の解消と、有価証券報告書までの、適正意見を見込む投稿があった。');
    E.say('hat', 'すでに出ていた、会社法の監査の、不表明を踏まえた投稿だ。', { yomi: 'すでに出ていた、会社法の監査の、ふひょうめいを踏まえた投稿だ。' });
    E.say('hat', '有報の監査では、適正意見が得られる、という予想だった。', { yomi: 'ゆうほうの監査では、適正意見が得られる、という予想だった。' });
    E.tw(t34, .4, { y: -20, s: .92 }, 'inOut');
    const st = (x, d, t) => E.div(g, { left: x, top: 600, width: 620, height: 200, borderRadius: 24, background: 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="font:800 30px/1.4 Round;color:#6a6066;padding-top:30px">${d}</div><div style="font:900 40px/1.4 Zen;color:#262236">${t}</div><div style="font:900 44px/1.3 Zen;color:#c62828">意見不表明</div>`).ini({ o: 0 });
    const s1 = st(260, '4月24日', '会社法の監査'), s2 = st(1040, '5月27日 発表・28日 提出', '有価証券報告書の監査');
    const ar = E.div(g, { left: 890, top: 660, width: 140, textAlign: 'center', font: '900 70px/1 Zen', color: '#f3e6c8' }, '▶').ini({ o: 0 });
    let L = E.say('hat', '結果は、5月27日の会社の発表と、28日に出た有報でも、意見不表明だった。', { wait: false, yomi: '結果は、5月27日の会社の発表と、28日に出た、ゆうほうでも、意見、ふひょうめいだった。' });
    rise(s1, .2); E.show(ar, .3, L.dur * .35); rise(s2, L.dur * .45);
    E.at(L.end);
    const mk = P.mark(sc.root, '結果と不一致', { x: 1380, y: 820, color: '#c62828', size: .8, rot: 8, w: 300 });
    L = E.say('hat', 'この見通しは、実現しなかった。', { wait: false });
    P.stampIn(mk, L.dur * .4);
    E.at(L.end + .5);
  });

  /* ============================================================ S9 17時45分の開示に、書かれていたこと */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'a03' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '17時45分の開示に、書かれていたこと（元資料 p37）', 50);
    E.show(tt, .3);
    const row = (y, n, html) => E.div(g, { left: 160, top: y, width: 1600, height: 150, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<span style="flex:none;width:130px;text-align:center;font:900 52px/1 Noto;color:#b8651a">${n}</span><div style="flex:1;font:900 36px/1.45 Zen;color:#262236;padding-right:30px">${html}</div>`).ini({ o: 0 });
    const r1 = row(170, '1', '期末月の3つの取引　<span style="color:#b8651a">売上 1億5,545.4万円</span>・<span style="color:#b8651a">営業外収益 2,000万円</span>');
    const r2 = row(350, '2', '役務の証拠が不足。一部の外部確認も、実現しなかった');
    const r3 = row(530, '3', '修正すれば、2期連続の債務超過となる可能性が高い<span style="font:800 28px Round;color:#6a6066">（監査人の指摘）</span>');
    E.wait(.3);
    E.say('hat', '17時45分の、監査の開示には、こうも書かれていた。');
    let L = E.say('hat', '期末の月の、3つの取引。売上が1億5,545.4万円と、営業外収益が2,000万円。', { wait: false, yomi: 'きまつの月の、みっつの取引。うりあげが、イチオクゴセンゴヒャクヨンジューゴテンヨンマンエンと、営業外収益が、にせんまんえん。' });
    E.tw(r1, .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    L = E.say('hat', 'サービスを提供した証拠が足りず、一部の外部確認も、実現しなかった。', { wait: false });
    E.tw(r2, .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    L = E.say('hat', '修正すれば、2期連続の債務超過となる可能性が高い、と監査人は指摘していた。', { wait: false, yomi: '修正すれば、にきれんぞくの、さいむちょうかとなる可能性が高い、と監査人は指摘していた。' });
    E.tw(r3, .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end + .3);
    [r1, r2, r3, tt].forEach(n => E.hide(n, .3));
    const tt2 = P.heading(g, '同じ 17時45分', 60);
    E.show(tt2, .3, .2);
    const lb = box(g, { x: 160, y: 190, w: 760, h: 340, top: '会社の発表（I34）', main: '純資産 ＋2,100万円', c: '#2b68d8', size: 56 });
    const rb = box(g, { x: 1000, y: 190, w: 760, h: 340, top: '監査人の指摘（I33）', main: '修正すれば', sub: '2期連続の債務超過となる<br>可能性が高い', c: '#c62828', border: '5px solid #c62828', size: 50 });
    L = E.say('hat', '同じ17時45分に、プラスの数字と、その数字への警告が、並んで出ていた。', { wait: false });
    rise(lb, .2); rise(rb, L.dur * .5);
    E.at(L.end);
    const nb = panel(g, { x: 260, y: 590, w: 1400, h: 110, size: 36, dark: true, html: '決算の発表が済んでも、監査上の問題が解消したわけではない' });
    L = E.say('hat', '決算の発表が済んでも、監査上の問題が、解消したわけではない。', { wait: false, yomi: '決算の発表が済んでも、かんさじょうの問題が、解消したわけではない。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('ding', { delay: .2, gain: .5 });
    E.at(L.end + .3);
    [lb, rb, nb, tt2].forEach(n => E.hide(n, .3));
    const tt3 = P.heading(g, '4月の段階と、9月の段階', 60);
    E.show(tt3, .3, .2);
    const sa = box(g, { x: 160, y: 220, w: 700, h: 260, top: '4月24日', main: '証拠が足りない段階', c: '#b8651a', size: 48 });
    const sb = box(g, { x: 1060, y: 220, w: 700, h: 260, top: '9月（第14章）', main: '調査の結果の段階', c: '#4a4552', size: 48 });
    const ar = E.div(g, { left: 880, top: 300, width: 160, textAlign: 'center', font: '900 80px/1 Zen', color: '#f3e6c8' }, '▶').ini({ o: 0 });
    L = E.say('hat', '4月は、証拠が足りない、という段階。調査の結果が出るのは、9月だ。', { wait: false });
    rise(sa, .2); E.show(ar, .3, L.dur * .5); rise(sb, L.dur * .6);
    E.at(L.end);
    E.say('hat', '2つは、分けて読む。', { yomi: 'ふたつは、分けて読む。' });
    const nb2 = panel(g, { x: 260, y: 560, w: 1400, h: 110, size: 34, html: '元資料も、3つの取引すべてを「架空」とは整理していない' });
    L = E.say('hat', '元資料も、3つの取引すべてを、架空とは、整理していない。', { wait: false, yomi: 'もとしりょうも、みっつの取引すべてを、かくうとは、整理していない。' });
    rise(nb2, .3);
    E.at(L.end + .5);
  });

  /* ============================================================ S10 ブルちゃんの部屋（夜） */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_room' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    const scr = E.div(R.screen, { left: 0, top: 0, width: 492, height: 290, background: '#f4f6f9' });
    E.div(scr, { left: 20, top: 18, font: '800 18px/1.3 Round', color: '#6a6066' }, 'エスポア（3260）　4/24 17:45');
    E.div(scr, { left: 20, top: 56, font: '900 40px/1.25 Zen', color: '#d22d68' }, '決算短信<br>黒字・純資産プラス');
    const sub = E.div(scr, { left: 20, top: 210, font: '800 18px/1.4 Round', color: '#9a9096' }, '会社法監査の意見不表明について…');
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    P.look(sc.cam, { s: 1.25, cx: 1200, cy: 420, dur: 4, delay: .3 });
    E.wait(.6);
    E.narr('あの夜、私は、黒字、という文字だけを見ていた。', { yomi: 'あの夜、私は、くろじ、という文字だけを見ていた。' });
    E.narr('純資産も、プラス。債務超過は、終わったと思った。');
    const L = E.narr('同じ時刻に出ていた、監査の開示を、私は、最後まで読まなかった。', { wait: false });
    E.tw(sub, .8, { o: [1, .25] }, 'inOut', L.dur * .4);
    E.at(L.end + .3);
  });

  /* ============================================================ S11 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '数字を読む前に、監査の意見を読め', { left: 120, top: 120, font: '900 64px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .07));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const d1 = E.div(paper, { left: 140, top: 380, width: 520, height: 260, borderRadius: 20, border: '5px dashed #a09070', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#a09070', paddingTop: 60 }, '数字<br><span style="font-size:32px">黒字・純資産プラス</span>').ini({ o: 0 });
    const d2 = E.div(paper, { left: 760, top: 380, width: 520, height: 260, borderRadius: 20, border: '6px solid #c62828', background: 'rgba(255,255,255,.6)', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#c62828', paddingTop: 60 }, '監査の意見<br><span style="font-size:34px">不表明</span>').ini({ o: 0 });
    E.wait(2.6);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「数字を読む前に、監査の意見を読め」。', { wait: false, yomi: '数字を読む前に、監査の意見を読め。' });
    E.show(d1, .4, .2); E.tw(d2, .45, { o: [0, 1], s: [1.2, 1] }, 'back', L.dur * .5); E.sfx('stamp', { delay: L.dur * .5 + .2, gain: .5 });
    E.at(L.end + 1.0);
  });

  /* ============================================================ S12 正体 */
  E.trans('fade', { dur: .8, color: '#000' });
  E.scene({ name: 'dark_room' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .6, gain: 1 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: '保有', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 760, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 1.8);
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse 700px 500px at 1760px 659px, rgba(4,6,14,.15) 0%, rgba(4,6,14,.7) 70%)' });
    // モニターが勝手に点き、赤い目が映る
    const black = E.div(R.screen, { left: 0, top: 0, width: 492, height: 290, background: '#050304' }).ini({ o: 0 });
    const eyes = E.img(R.screen, CH('baron_eyes'), { left: 76, top: 80, height: 400 }).ini({ o: 0 });
    const glow = E.div(g, { left: 700, top: 0, width: 1400, height: 1000, background: 'radial-gradient(ellipse at 50% 45%, rgba(255,40,40,.32), rgba(255,40,40,0) 60%)', mixBlendMode: 'screen' }).ini({ o: 0 });
    E.wait(1.0);
    E.sfx('glitch', { gain: .7 });
    E.fn(.6, (k, t) => { black.p.o = Math.sin(t * 60) > 0 ? 1 : 0; }, 0, true);
    E.set(black, { o: 1 }, .6);
    E.tw(eyes, .8, { o: [0, 1] }, 'in2', .9);
    E.tw(glow, .8, { o: [0, 1] }, 'in2', .9);
    E.sfx('heartbeat', { delay: 1.0 });
    E.shake(bull, .3, 6, 1.0);
    P.look(sc.cam, { s: 1.35, cx: 1250, cy: 470, dur: 2.4, delay: .9 });
    E.wait(1.9);
    E.say('baron', '黒字の二文字は、大きく見える。', { chip: '？？？', chipColor: MASK, yomi: 'くろじの、ふたもじは、大きく見える。', gap: .5 });
    E.say('mentor', '……数字を読む前に、監査の意見を読め。', { chip: '？？？', chipColor: MASK, yomi: '数字を読む前に、監査の意見を読め。', gap: .5 });
  });

  E.scene({ name: 'bull_realize' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_surprise'), { bg: 'linear-gradient(180deg,#2a0c12,#0d0406)', panelBg: 'linear-gradient(180deg,#3a1018,#14060a)', imgH: 820 });
    E.from(C.img, { s: .9 }, .3, 0, 'back');
    E.sfx('impact', { gain: .35 });
    E.say('bull', 'その言葉……師匠の、ノートの……。', { talk: C.img, talkAmp: 2, yomi: 'その言葉。ししょうの、ノートの。', gap: .4 });
  });

  E.scene({ name: 'monitor' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: '#050304' });
    const eyes = E.img(g, CH('baron_eyes'), { left: -60, top: 80, height: 2400 });
    E.tw(eyes, 5, { s: [1, 1.08] }, 'linear');
    E.div(g, { left: 0, top: 0, width: W, height: H, backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,.05) 0 2px, transparent 2px 6px)' });
    E.vignette(g, .8);
    E.shake(eyes, .4, 14, 0);
    E.sfx('glitch', { gain: .5 });
    E.wait(.5);
    E.say('baron', 'そう書いておいたはずだがな、ブル。', { chip: '？？？', chipColor: MASK, gap: .5 });
  });

  E.scene({ name: 'photo' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #2b1c14 0%, #0b0705 80%)' });
    const fr = E.div(g, { left: 960 - 330, top: 70, width: 660, height: 690, borderRadius: 14, background: '#8a5a30', boxShadow: '0 30px 60px rgba(0,0,0,.6), inset 0 0 0 6px #6b4220' }).ini({ r: -3 });
    E.img(fr, CH('mentor_photo'), { left: 40, top: 40, width: 580, height: 610, objectFit: 'cover', borderRadius: 4 });
    const col = E.img(fr, CH('mentor_photo_color'), { left: 40, top: 40, width: 580, height: 610, objectFit: 'cover', borderRadius: 4 }).ini({ o: 0 });
    E.from(fr, { s: .55, y: 260 }, 1.0, 0, 'quint');
    E.tw(fr, 9, { s: [1, 1.1] }, 'linear', 1.0);
    E.grain(g, .1);
    E.wait(1.2);
    const L = E.say('bull', '師匠……？', { yomi: 'ししょう？', gap: .6, wait: false });
    E.at(L.end);
    // セピアから色が戻る
    E.tw(col, 1.6, { o: [0, 1] }, 'inOut');
    E.sfx('swell', { gain: .6 });
    E.wait(1.6);
    E.flash('#fff', .4, .95);
    E.sfx('thunder', { gain: .9 });
    E.wait(.35);
  });

  E.scene({ name: 'baron_reveal' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .1, gain: 1 });
    const C = P.closeup(g, CH('baron_face_big'), { bg: 'radial-gradient(ellipse at 50% 40%, #6a1420, #140707)', panelBg: 'linear-gradient(180deg,#3a0f16,#120607)', imgH: 1020 });
    E.from(C.img, { s: 1.25 }, .5, 0, 'quint');
    E.tw(C.img, 9, { s: [1, 1.08] }, 'linear', .5);
    E.particles(g, { n: 60, kind: 'ember', color: '#ff5a4a', area: [0, 0, W, H], speed: 1, seed: 23 });
    E.wait(.6);
    E.say('baron', '押し目おじさんは、もういない。', { talk: C.img, talkAmp: 1.5, chip: '？？？', chipColor: MASK, gap: .5 });
    const cr = P.crack(g, { cx: 960, cy: 430, n: 13, len: 1100, seed: 7 });
    const L = E.say('baron', '私は、空売り男爵だ。', { talk: C.img, talkAmp: 1.5, chip: '空売り男爵', wait: false });
    E.flash('#ff2a2a', .6, .5, L.dur * .55);
    P.crackIn(cr, L.dur * .55);
    E.sfx('boom', { delay: L.dur * .55, gain: .9 });
    E.shake(sc.cam, .6, 16, L.dur * .55);
    E.at(L.end + 1.2);
  });

  // 押し目おじさん ＝ 空売り男爵
  E.scene({ name: 'equal' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #3a1018 0%, #120507 80%)' });
    const lf = E.div(g, { left: 170, top: 130, width: 560, height: 560, borderRadius: 14, background: '#8a5a30', boxShadow: '0 24px 50px rgba(0,0,0,.6)' }).ini({ r: -4, o: 0 });
    E.img(lf, CH('mentor_photo'), { left: 30, top: 30, width: 500, height: 500, objectFit: 'cover' });
    const rf = E.div(g, { left: 1190, top: 130, width: 560, height: 560, borderRadius: 14, background: '#2a0c12', overflow: 'hidden', boxShadow: '0 24px 50px rgba(0,0,0,.6), inset 0 0 0 6px #c9a24a' }).ini({ r: 4, o: 0 });
    E.img(rf, CH('baron_e_normal'), { left: 30, top: 10, width: 500 });
    const eq = E.div(g, { left: 0, top: 300, width: W, textAlign: 'center', font: '900 200px/1 Zen', color: '#ffd84a', textShadow: '0 0 30px rgba(255,216,74,.6)' }, '＝').ini({ o: 0 });
    const l1 = E.div(g, { left: 170, top: 730, width: 560, textAlign: 'center', font: '900 58px/1.2 Zen', color: '#f3e6c8' }, '押し目おじさん').ini({ o: 0 });
    const l2 = E.div(g, { left: 1190, top: 730, width: 560, textAlign: 'center', font: '900 58px/1.2 Zen', color: '#ff8a8a' }, '空売り男爵').ini({ o: 0 });
    E.tw(lf, .6, { o: [0, 1], x: [-200, 0] }, 'quint', .2);
    E.tw(rf, .6, { o: [0, 1], x: [200, 0] }, 'quint', .2);
    E.sfx('whoosh_big', { delay: .2 });
    E.tw(eq, .45, { o: [0, 1], s: [2.4, 1] }, 'in2', .9);
    E.sfx('dun', { delay: 1.2, gain: .9 });
    E.show(l1, .5, 1.6); E.show(l2, .5, 1.8);
    E.wait(4.6);
  });

  /* ============================================================ S13 次回予告 */
  E.trans('fade', { dur: .9, color: '#000' });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #3a2c24 0%, #1d1612 75%, #120d0a 100%)' });
    [['T', P.T_BLUE], ['I', P.I_ORANGE]].forEach(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
    });
    const st = P.sticky(g, '第9章<br>二番底', { x: 1380, y: 120, w: 440, h: 250, rot: 5, size: 48 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第9章だブー。', { talk: pig, talkAmp: 5 });
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
