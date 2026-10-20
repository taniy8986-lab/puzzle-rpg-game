// 完全版 第10章「5月27日 18時10分」（2026年5月27日〜5月29日）
// 台本: story/k/k10_5月27日18時10分.md　元資料 p7・p13・p14・p15・p18・p22・p32・p33・p35・p36・p43
// 投稿は元資料の要約（本人の見解）。有名投資家の名前・アカウントは出さない。ブルちゃんの保有はフィクション
// 名証の指定の公表時刻は元資料にない。T41 と I38 は順番だけを示す
'use strict';
E.chapter('k10');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;
  const bar = (g, from, to) => P.monthBar(g, { year: 2026, start: 5, months: 1, from, to, x: 560, w: 800 });
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const box = (g, { x, y, w = 700, h = 280, top = '', main = '', sub = '', c = '#262236', border = 'none', size = 50 }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 26, background: 'rgba(255,255,255,.95)', border, boxShadow: '0 12px 24px rgba(0,0,0,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 30px' },
    `${top ? `<div style="font:800 28px/1.3 Round;color:#6a6066">${top}</div>` : ''}<div style="font:900 ${size}px/1.3 Zen;color:${c};white-space:nowrap">${main}</div>${sub ? `<div style="font:800 30px/1.5 Round;color:#4a4552;margin-top:14px">${sub}</div>` : ''}`).ini({ o: 0 });
  const rise = (n, d = 0) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', d); E.sfx('pop', { delay: d, gain: .5 }); };
  const chartTitle = (sc, t) => E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, t);
  const tag = (g, pt, txt, dx, dy, c = '#262236', size = 17) => E.div(g, { left: pt.x + dx, top: pt.y + dy, padding: '3px 10px', borderRadius: 8, background: 'rgba(255,255,255,.96)', font: `900 ${size}px/1.3 Noto`, color: c, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }, txt).ini({ o: 0 });
  const fiction = sc => P.note(sc.root, 'ブルちゃんの売買はフィクションです', { x: 1440, y: 40, size: 24, dark: true });
  const tIn = (n, d = .5) => { E.tw(n, .45, { o: [0, 1], x: [60, 0] }, 'back', d); E.sfx('notify', { delay: d }); };
  const swap = (a, b) => { E.tw(a, .35, { o: 0, x: -60 }, 'in2'); tIn(b, .4); };
  const axis = (g, y) => P.dayAxis(g, { x: 160, y, w: 1600, from: 480, to: 1170, open: 540, band: [[540, 690, '前場'], [750, 930, '後場']] });
  const DOTS = [
    { m: 646, kind: 'T', label: 'T39 10:46' },
    { m: 1090, kind: 'I', label: 'I37 18:10' },
    { m: 1108, kind: 'T', label: 'T40 18:28', lift: 52 },
  ];
  // p07 日足（元画像の座標）
  const PY = p => 296.5 + (1000 - p) * 0.511;

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

  /* ============================================================ S0 アバン：5月27日の通知 */
  P.phoneScene((ph, sc) => {
    E.bgm('tension', { fadeIn: 1.0, gain: .7 });
    P.lock(ph, { date: '5月27日', week: '水曜日', time: '18:11' });
    const n1 = P.notice(ph, { title: 'エスポア（3260）', body: '有価証券報告書の監査<br>意見不表明', y: 330 });
    const n2 = P.notice(ph, { title: 'エスポア（3260）', body: '会計監査人の<br>辞任届の受領', y: 540 });
    P.notifyIn(n1, 1.0); P.notifyIn(n2, 1.5);
    E.wait(2.0);
    E.narr('5月27日の夕方。また、監査の知らせが届いた。');
    E.narr('今度は、有価証券報告書の監査だった。');
  }, { name: 'avant_phone', wait: .4 });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 10, title: '5月27日 18時10分', sub: '2026年5月27日〜5月29日', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 5月27日を、時刻の順に */
  E.scene({ name: 'may27' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    E.div(g, { left: 80, top: 60, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '2026年5月27日（水）　時刻の順番');
    const ax = axis(g, 440);
    E.show(ax.root, .5, .2);
    const dots = DOTS.map(d => P.axisDot(g, ax, { ...d, y: 440 }));
    E.wait(.6);
    E.say('hat', '5月27日も、時刻の順に並べる。');
    let L = E.say('hat', 'まず、取引時間の中の、10時46分に、投稿が1つ。', { wait: false, yomi: 'まず、取引時間の中の、10時46分に、投稿が、ひとつ。' });
    E.pop(dots[0], .4, L.dur * .5); E.sfx('pop', { delay: L.dur * .5 });
    E.at(L.end);
    L = E.say('hat', '取引が終わった、引けのあとの、18時10分に、会社の開示が出た。', { wait: false, yomi: '取引が終わった、ひけのあとの、18時10分に、会社の開示が出た。' });
    E.pop(dots[1], .4, L.dur * .6); E.sfx('notify', { delay: L.dur * .6 });
    E.at(L.end);
    L = E.say('hat', 'その公表の18分後の、18時28分に、投稿が、もう1つあった。', { wait: false, yomi: 'その公表の、じゅうはっぷんごの、18時28分に、投稿が、もうひとつあった。' });
    E.pop(dots[2], .4, L.dur * .55); E.sfx('pop', { delay: L.dur * .55, gain: .5 });
    E.at(L.end + .5);
  });

  /* ============================================================ S3 T39　10:46 */
  E.scene({ name: 't39' }, sc => {
    const g = sc.cam;
    P.slate(g);
    E.div(g, { left: 80, top: 60, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '2026年5月27日（水）　時刻の順番');
    const ax = axis(g, 280);
    ax.root.ini({ o: 1 });
    P.axisDot(g, ax, { ...DOTS[0], y: 280 }).ini({ o: 1 });
    const t39 = P.tcard(g, { id: 'T39', when: '2026/5/27 10:46', kind: '財務', session: '取引時間内', text: '株主総会での倒産発表を否定する発言', note: '上場維持や監査意見の保証を意味するわけではない', x: 300, y: 420, w: 1320, size: 38 });
    tIn(t39, .4);
    E.wait(1.0);
    E.narr('5月27日の、10時46分の投稿。取引時間の中だ。');
    E.say('hat', '元資料の要約では、株主総会で、倒産が発表されることはない、と否定した投稿だ。', { yomi: 'もとしりょうの要約では、株主総会で、とうさんが、発表されることはない、と否定した投稿だ。' });
    E.say('hat', '元資料の検証メモは、これが、上場が続くことの、保証ではない、としている。', { yomi: 'もとしりょうの、けんしょうメモは、これが、じょうじょうが続くことの、保証ではない、としている。' });
    E.say('hat', '監査で、どんな意見が出るかの、保証でもない。');
    E.say('hat', '倒産の発表がないことと、上場が続くか、監査の意見がどうなるかは、別のことだ。', { yomi: 'とうさんの発表がないことと、じょうじょうが続くか、監査の意見がどうなるかは、別のことだ。' });
    // 有報とは（一般的な説明）
    const yp = panel(g, { x: 300, y: 720, w: 1320, h: 110, size: 28, html: '<span>有価証券報告書（有報）は、会社が事業や決算をくわしく書いて、毎年出す報告書<span style="font:800 22px Round;color:#4a4552">（一般的な説明）</span></span>' });
    let L = E.say('hat', '有報は、有価証券報告書の略だ。', { wait: false, yomi: 'ゆうほうは、ゆうかしょうけんほうこくしょの、りゃくだ。' });
    rise(yp, .2);
    E.at(L.end);
    E.say('hat', '会社が、事業や決算を、くわしく書いて、毎年出す報告書だ。');
    E.say('hat', '有報の決算にも、監査人の監査がある。', { yomi: 'ゆうほうの決算にも、かんさにんの監査がある。' });
    E.hide(yp, .3);
    const ord = panel(g, { x: 300, y: 720, w: 1320, h: 110, size: 34, dark: true, html: '投稿の時点（10:46）では、有報の監査の結果は、まだ公表されていなかった' });
    L = E.say('hat', '投稿は、10時46分。その時点で、有報の監査の結果は、まだ公表されていない。', { wait: false, yomi: '投稿は、10時46分。その時点で、ゆうほうの監査の結果は、まだ公表されていない。' });
    E.tw(ord, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .35); E.sfx('ding', { delay: L.dur * .35, gain: .5 });
    E.at(L.end);
    E.say('hat', '結果が公表されたのは、この日の、引けのあとの、18時10分だ。', { yomi: '結果が公表されたのは、この日の、ひけのあとの、18時10分だ。' });
    E.wait(.4);
  });

  /* ============================================================ S4 I37　18:10 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'i37' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .75 });
    P.slate(g);
    const clk = P.clock(g, { x: 110, y: 170, size: 250, min: 930 });
    E.div(g, { left: 85, top: 440, width: 300, textAlign: 'center', font: '900 52px/1.2 Noto', color: '#ffd84a' }, '18:10');
    E.div(g, { left: 85, top: 510, width: 300, textAlign: 'center', font: '800 26px/1.3 Round', color: 'rgba(243,230,200,.8)' }, '引け後の開示');
    const i37 = P.icard(g, { id: 'I37', when: '2026/5/27 18:10', session: '引け後', title: '有報監査不表明・監査人辞任', text: '有報の財務諸表と内部統制監査でも意見不表明。<br>同時にアリアから辞任届を受領したと開示', note: '4/24の会社法監査とは対象書類が異なる', x: 440, y: 120, w: 1400, size: 32 });
    E.tw(clk, 1.2, { min: [930, 1090] }, 'inOut', .3); E.sfx('tick', { delay: .3, gain: .5 });
    E.tw(i37, .45, { o: [0, 1], y: [30, 0] }, 'back', 1.4); E.sfx('notify', { delay: 1.4 });
    E.wait(1.9);
    E.say('hat', '18時10分。会社は、有価証券報告書の監査でも、意見不表明だったと開示した。');
    // 意見不表明とは（一般的な説明）
    const ex0 = panel(g, { x: 440, y: 520, w: 1400, h: 110, size: 30, html: '<span>意見不表明は、十分な証拠が得られず、監査人が、決算について意見を出さないこと<span style="font:800 22px Round;color:#4a4552">（一般的な説明）</span></span>' });
    let L = E.say('hat', '意見不表明は、十分な証拠が得られず、監査人が、決算について、意見を出さないことだ。', { wait: false, yomi: 'いけんふひょうめいは、十分な証拠が得られず、かんさにんが、決算について、意見を出さないことだ。' });
    rise(ex0, .2);
    E.at(L.end);
    E.hide(ex0, .3);
    E.say('hat', '財務諸表の監査と、内部統制の監査の、両方だ。', { yomi: 'ざいむしょひょうの監査と、ないぶとうせいの監査の、両方だ。' });
    // 財務諸表・内部統制の監査とは（一般的な説明）
    const row = (y, html) => E.div(g, { left: 440, top: y, width: 1400, height: 96, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 30px/1.3 Zen', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
    const ex1 = row(500, '財務諸表は、売上や利益、会社の持ち物や借りているものを、まとめた決算の表');
    const ex2 = row(612, '内部統制の監査は、会社の中のチェックの仕組みが、働いているかを見る監査');
    const exg = E.div(g, { left: 440, top: 718, width: 1400, textAlign: 'right', font: '800 22px/1.3 Round', color: 'rgba(243,230,200,.8)' }, '一般的な説明').ini({ o: 0 });
    L = E.say('hat', '財務諸表は、売上や利益、会社の持ち物や、借りているものを、まとめた決算の表だ。', { wait: false, yomi: 'ざいむしょひょうは、うりあげや利益、会社の持ち物や、借りているものを、まとめた、決算の、ひょうだ。' });
    rise(ex1, .2); E.show(exg, .3, .3);
    E.at(L.end);
    L = E.say('hat', '内部統制の監査は、会社の中の、チェックの仕組みが、働いているかを見る監査だ。', { wait: false, yomi: 'ないぶとうせいの監査は、会社の中の、チェックの仕組みが、働いているかを見る監査だ。' });
    rise(ex2, .2);
    E.at(L.end);
    E.say('hat', '同じ時刻に、監査法人アリアから、辞任届を受け取ったことも、開示した。', { yomi: '同じ時刻に、監査法人アリアから、じにんとどけを受け取ったことも、開示した。' });
    E.hide(ex1, .3); E.hide(ex2, .3); E.hide(exg, .3);
    // 2つの監査：対象の書類が違う
    const st = (x, d, t, s) => E.div(g, { left: x, top: 500, width: 620, height: 250, borderRadius: 24, background: 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="font:800 28px/1.4 Round;color:#6a6066;padding-top:22px">${d}</div><div style="font:900 38px/1.4 Zen;color:#262236">${t}</div><div style="font:800 26px/1.5 Round;color:#4a4552">${s}</div><div style="font:900 42px/1.4 Zen;color:#c62828">意見不表明</div>`).ini({ o: 0 });
    const s1 = st(480, '4月24日', '会社法の監査', '株主総会に出す、計算書類が対象'), s2 = st(1220, '5月27日', '有価証券報告書の監査', '有報の財務諸表と、内部統制が対象');
    const ar = E.div(g, { left: 1100, top: 590, width: 120, textAlign: 'center', font: '900 64px/1 Zen', color: '#f3e6c8' }, '▶').ini({ o: 0 });
    L = E.say('hat', '4月24日の、会社法の監査は、株主総会に出す、決算の書類の、計算書類が対象だった。', { wait: false, yomi: '4月24日の、会社法の監査は、株主総会に出す、決算の書類の、けいさんしょるいが対象だった。' });
    rise(s1, .2);
    E.at(L.end);
    L = E.say('hat', '5月27日の監査は、有価証券報告書の、財務諸表と、内部統制が対象だ。', { wait: false, yomi: '5月27日の監査は、ゆうかしょうけんほうこくしょの、ざいむしょひょうと、ないぶとうせいが対象だ。' });
    E.show(ar, .3, .1); rise(s2, .3);
    E.at(L.end);
    E.say('hat', '対象の書類が違う、別の監査で、監査人の意見不表明は、2度目になった。', { yomi: '対象の書類が違う、別の監査で、かんさにんの、いけんふひょうめいは、にどめになった。' });
    E.wait(.4);
  });

  /* ============================================================ S5 T40　18:28 */
  E.scene({ name: 't40' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tl = P.timeLink(g, { x: 260, y: 150, w: 1400, a: { id: 'I37', time: '18:10', sub: '会社の開示', color: P.I_ORANGE }, b: { id: 'T40', time: '18:28', sub: '投稿', color: P.T_BLUE }, label: '18分後' });
    tl.in(.2);
    const t40 = P.tcard(g, { id: 'T40', when: '2026/5/27 18:28', kind: '財務', session: '引け後', text: '監査人辞任に対し別の監査人がよいと発言', note: '投稿は5月27日18時28分。監査人交代だけで問題解消とはならない', x: 300, y: 330, w: 1320, size: 40 });
    tIn(t40, 1.3);
    E.wait(1.8);
    E.narr('5月27日の、18時28分の投稿。会社の開示の、公表の18分後だ。', { yomi: '5月27日の、18時28分の投稿。会社の開示の、公表の、じゅうはっぷんごだ。' });
    E.say('hat', '元資料の要約では、監査人の辞任について、別の監査人がよい、という見方を書いた投稿だ。', { yomi: 'もとしりょうの要約では、かんさにんの辞任について、別の、かんさにんがよい、という見方を書いた投稿だ。' });
    E.say('hat', '元資料の検証メモは、監査人が替わるだけでは、問題の解消にはならない、としている。', { yomi: 'もとしりょうの、けんしょうメモは、かんさにんが替わるだけでは、問題の解消にはならない、としている。' });
    E.say('hat', 'この日に出たのは、有報の監査でも、監査人が、意見を出さなかった、という結果だ。', { yomi: 'この日に出たのは、ゆうほうの監査でも、かんさにんが、意見を出さなかった、という結果だ。' });
    E.say('hat', '監査人が替わることと、監査で、意見が出るようになることは、別のことだ。', { yomi: 'かんさにんが替わることと、監査で、意見が出るようになることは、別のことだ。' });
    E.wait(.3);
  });

  /* ============================================================ S6 5月28日　T41 → I38 → T42 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'may28' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [5, 27], [5, 28]);
    const ch = P.chain(g, { x: 80, y: 130, w: 1760, cw: 420, gaps: ['', ''], items: [
      { id: 'T41', time: '16:56', sub: '投稿', color: P.T_BLUE },
      { id: 'I38', time: '17:00', sub: '会社の開示', color: P.I_ORANGE },
      { id: 'T42', time: '19:54', sub: '投稿', color: P.T_BLUE }] });
    ch.in(0, .3);
    const t41 = P.tcard(g, { id: 'T41', when: '2026/5/28 16:56', kind: '財務', session: '引け後', text: '監理銘柄指定に終了日の定めがない点を紹介', note: '確認が終わるまでの指定であり、上場廃止懸念が消えたという意味ではない', x: 260, y: 320, w: 1400, size: 40 });
    tIn(t41, .8);
    E.wait(1.4);
    E.narr('5月28日の、16時56分の投稿。取引が終わった、引けのあとだ。', { yomi: '5月28日の、16時56分の投稿。取引が終わった、ひけのあとだ。' });
    E.say('hat', '元資料の要約では、監理銘柄の指定には、終わりの日の定めがない点を、紹介した投稿だ。', { yomi: 'もとしりょうの要約では、かんりめいがらの指定には、終わりの日の、さだめがない点を、紹介した投稿だ。' });
    E.say('hat', '監理銘柄が、どんな指定かは、このあと、くわしく見る。', { yomi: 'かんりめいがらが、どんな指定かは、このあと、くわしく見る。' });
    let L = E.say('hat', '会社の開示は、そのあとの、17時だ。', { wait: false });
    ch.in(1, .2);
    E.at(L.end);
    E.say('hat', '名証は、エスポアの株が売り買いされている、名古屋証券取引所のことだ。', { yomi: 'めいしょうは、エスポアの株が売り買いされている、なごやしょうけんとりひきじょのことだ。' });
    const nt = panel(g, { x: 260, y: 640, w: 1400, h: 140, size: 30, dark: true, html: '<div style="text-align:center">名証が指定を公表した時刻は、元資料に書かれていない<br>だから、ここで並べるのは、投稿と会社の開示の、順番だけ</div>' });
    L = E.say('hat', '名証が、指定を公表した時刻は、元資料に、書かれていない。', { wait: false, yomi: 'めいしょうが、指定を公表した時刻は、もとしりょうに、書かれていない。' });
    E.tw(nt, .4, { o: [0, 1], y: [20, 0] }, 'back', .2);
    E.at(L.end);
    L = E.say('hat', 'だから、ここで並べるのは、投稿と、会社の開示の、順番だけだ。', { wait: false });
    E.at(L.end + .3);
    E.hide(nt, .3);
    const i38 = P.icard(g, { id: 'I38', when: '2026/5/28 17:00', session: '引け後', title: '監理銘柄・確認中', text: '意見不表明の監査報告書付き有報を提出。<br>改善期間入りは解除されず、監理銘柄（確認中）に指定', note: 'T41・T42の上場継続に関する解釈と、公式指定の理由を並べて読む', x: 260, y: 320, w: 1400, size: 32 });
    E.tw(t41, .35, { o: 0, x: -60 }, 'in2');
    E.tw(i38, .45, { o: [0, 1], y: [30, 0] }, 'back', .4); E.sfx('notify', { delay: .4 });
    E.wait(.6);
    E.say('hat', '17時。会社は、意見不表明の監査報告書が付いた、有価証券報告書を、提出したと開示した。', { yomi: '17時。会社は、意見、ふひょうめいの、監査報告書が付いた、有価証券報告書を、提出したと開示した。' });
    E.say('hat', '開示には、改善期間に入った状態は、解除されなかった、とも書かれていた。', { yomi: '開示には、かいぜんきかんに入った状態は、解除されなかった、とも書かれていた。' });
    // 改善期間・債務超過とは（一般的な説明）
    const kp = panel(g, { x: 260, y: 692, w: 1400, h: 130, size: 28, dark: true, html: '<div style="text-align:center">改善期間は、債務超過を解消するための期間<br>債務超過は、会社の持ち物を全部足しても、借りているものに足りない状態<span style="font:800 22px Round;color:#f3e6c8">（一般的な説明）</span></div>' });
    L = E.say('hat', '改善期間は、債務超過を、解消するための期間だ。', { wait: false, yomi: 'かいぜんきかんは、さいむちょうかを、解消するための期間だ。' });
    rise(kp, .2);
    E.at(L.end);
    E.say('hat', '債務超過は、会社の持ち物を全部足しても、借りているものに、足りない状態だ。', { yomi: 'さいむちょうかは、会社の持ち物を全部足しても、借りているものに、足りない状態だ。' });
    E.say('hat', 'エスポアの改善期間は、2025年3月1日から、2026年2月28日までだった。', { yomi: 'エスポアの、かいぜんきかんは、2025年3月1日から、2026年2月28日までだった。' });
    E.say('hat', '今回の有報は、2026年2月期、つまり、この改善期間と同じ1年の、決算の報告書だ。', { yomi: 'こんかいの、ゆうほうは、2026年、にがつき、つまり、この、かいぜんきかんと同じ、いちねんの、決算の報告書だ。' });
    E.hide(kp, .3);
    E.say('hat', '名証は、この日、監理銘柄（確認中）に指定した。', { yomi: 'めいしょうは、この日、かんりめいがら、かくにんちゅうに、指定した。' });
    // I38 の「読み方」の行
    E.say('hat', '元資料の読み方は、T41と、T42の、上場が続くかについての解釈と、', { yomi: 'もとしりょうの読み方は、ティーよんじゅういちと、ティーよんじゅうにの、じょうじょうが続くかについての解釈と、' });
    E.say('hat', '名証の、公式の指定の理由を、並べて読む、というものだ。', { yomi: 'めいしょうの、公式の指定の理由を、ならべて読む、というものだ。' });
    E.say('hat', '指定の理由は、元資料が出典に挙げている、名証の公表で確かめる。', { yomi: '指定の理由は、もとしりょうが、しゅってんに挙げている、めいしょうの公表で、確かめる。' });
    L = E.say('hat', 'T42は、この日の、19時54分の投稿だ。このあと見る。', { wait: false, yomi: 'ティーよんじゅうには、この日の、19時54分の投稿だ。このあと見る。' }); ch.in(2, .3); E.at(L.end);
    E.say('hat', '投稿は、本人の見解だ。上場が続くかは、公式の発表で確かめる、ということだ。', { yomi: '投稿は、本人の見解だ。じょうじょうが続くかは、公式の発表で確かめる、ということだ。' });
    E.wait(.3);
  });

  /* ============================================================ S7 監理銘柄（確認中）とは */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'kanri' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '監理銘柄（確認中）とは', 60);
    E.show(tt, .3);
    const b1 = box(g, { x: 160, y: 190, w: 820, h: 330, top: '監理銘柄', main: '上場廃止のおそれ', sub: '基準に当たるおそれがあるとき、<br>取引所が投資家に知らせるために指定', c: '#c62828', size: 48 });
    const b2 = box(g, { x: 1060, y: 190, w: 700, h: 330, top: '（確認中）', main: '確認している段階', sub: '上場廃止の基準に<br>当たるかどうかを確認', c: '#b8651a', size: 48 });
    const gen = E.div(g, { left: 160, top: 530, width: 1600, textAlign: 'right', font: '800 22px/1.3 Round', color: 'rgba(243,230,200,.8)' }, '一般的な説明').ini({ o: 0 });
    E.wait(.3);
    let L = E.say('hat', '監理銘柄は、上場廃止の基準に当たるおそれがあるときに、', { wait: false, yomi: 'かんりめいがらは、上場廃止の基準に当たるおそれがあるときに、' });
    rise(b1, .3); E.show(gen, .3, .5);
    E.at(L.end);
    E.say('hat', '取引所が、投資家に知らせるために指定する銘柄だ。', { yomi: 'とりひきじょが、投資家に知らせるために指定する銘柄だ。' });
    L = E.say('hat', '確認中は、その基準に当たるかを、確認している段階。', { wait: false });
    rise(b2, .2);
    E.at(L.end);
    E.say('hat', 'T41は、この指定に、終わりの日の定めがない点を、紹介していた。', { yomi: 'ティーよんじゅういちは、この指定に、終わりの日の、さだめがない点を、紹介していた。' });
    const nb = panel(g, { x: 260, y: 590, w: 1400, h: 150, size: 32, dark: true, html: '<div style="text-align:center">終わりの日が決まっていないのは、確認が終わるまで続く指定だから<br>上場廃止の心配が消えた、という意味ではない</div>' });
    L = E.say('hat', '元資料の検証メモは、これを、確認が終わるまでの指定だ、としている。', { wait: false, yomi: 'もとしりょうの、けんしょうメモは、これを、確認が終わるまでの指定だ、としている。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', 'だから、終わりの日がないことは、上場廃止の心配が消えた、という意味ではない。');
    E.wait(.4);
  });

  /* ============================================================ S8 T42　19:54 */
  E.scene({ name: 't42' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [5, 28], [5, 28]);
    const t42 = P.tcard(g, { id: 'T42', when: '2026/5/28 19:54', kind: '財務', session: '引け後', text: '調査資料を示せば新監査人から適正意見を得られるとの見方', note: '本人の制度・監査に関する解釈。後の経過とは分けて記録', x: 260, y: 160, w: 1400, size: 40 });
    tIn(t42, .5);
    E.wait(1.0);
    E.narr('5月28日の、19時54分の投稿。引けのあとだ。', { yomi: '5月28日の、19時54分の投稿。ひけのあとだ。' });
    E.say('hat', '元資料の要約では、調査の資料を示せば、新しい監査人から、', { yomi: 'もとしりょうの要約では、調査の資料を示せば、新しい、かんさにんから、' });
    E.say('hat', '適正意見を得られる、という見方を書いた投稿だ。', { yomi: 'てきせいいけんを得られる、という見方を書いた投稿だ。' });
    // 適正意見とは（一般的な説明）
    const ex = panel(g, { x: 260, y: 470, w: 1400, h: 110, size: 30, html: '<span>適正意見は、決算の数字が正しく作られている、と監査人が認める意見<span style="font:800 22px Round;color:#4a4552">（一般的な説明）</span></span>' });
    let L = E.say('hat', '適正意見は、決算の数字が、正しく作られている、と監査人が認める意見だ。', { wait: false, yomi: 'てきせいいけんは、決算の数字が、正しく作られている、と、かんさにんが認める意見だ。' });
    rise(ex, .2);
    E.at(L.end);
    E.hide(ex, .3);
    const m = P.mark(g, '本人の解釈', { x: 1300, y: 470, color: P.T_BLUE, size: .8, rot: 7, w: 240 });
    L = E.say('hat', '元資料の検証メモは、これを、本人の、制度と監査についての、解釈だ、としている。', { wait: false, yomi: 'もとしりょうの、けんしょうメモは、これを、本人の、制度と監査についての、解釈だ、としている。' });
    P.stampIn(m, L.dur * .5);
    E.at(L.end);
    E.say('hat', 'そして、このあと、実際にどうなったかとは、分けて記録している。');
    E.say('hat', '投稿の時点の見方と、あとから分かったことを、混ぜずに記録する、ということだ。');
    E.wait(.3);
  });

  /* ============================================================ S9 T43　5月29日 13:28 */
  E.scene({ name: 't43' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [5, 28], [5, 29]);
    const t43 = P.tcard(g, { id: 'T43', when: '2026/5/29 13:28', kind: '財務', session: '取引時間内', text: '総会議案中の監査意見不表明に関する記述を引用', note: '長文の取得できた範囲を確認。不表明自体を投稿している', x: 260, y: 160, w: 1400, size: 40 });
    tIn(t43, .5);
    E.wait(1.0);
    E.narr('5月29日の、13時28分の投稿。取引時間の中だ。');
    E.say('hat', '元資料の要約では、株主総会の議案の中から、引用した投稿だ。', { yomi: 'もとしりょうの要約では、株主総会の、ぎあんの中から、引用した投稿だ。' });
    E.say('hat', '引用したのは、監査意見の不表明について、書かれた部分だ。', { yomi: '引用したのは、監査意見の、ふひょうめいについて、書かれた部分だ。' });
    E.say('hat', 'この投稿は、長い文章だ。元資料は、そのうち、取得できた範囲を、確かめている。', { yomi: 'この投稿は、長い文章だ。もとしりょうは、そのうち、しゅとくできた範囲を、確かめている。' });
    E.say('hat', 'その範囲で、投稿は、監査意見が不表明だったこと、そのものを、伝えていた。', { yomi: 'その範囲で、投稿は、監査意見が、ふひょうめいだったこと、そのものを、伝えていた。' });
    E.wait(.3);
  });

  /* ============================================================ S10 5月29日　587円 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'may29' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('07'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, '日足　2026年4月28日〜5月29日');
    P.note(sc.root, '分割後の値段（元資料 p7）', { x: 1540, y: 896, size: 22, dark: true });
    P.look(sc.cam, { s: 1.8, cx: C.at(1610, 0).x, cy: C.at(0, 450).y, dur: 1.4, delay: .2 });
    const l1 = C.at(1144.5, PY(625)), l2 = C.at(1487.5, PY(630)), l3 = C.at(2077.5, PY(587));
    const a = tag(g, l1, '4/28 安値 625円', -60, 10, '#1b8a5a'), b = tag(g, l2, '5/13 安値 630円', -60, 10, '#1b8a5a'), c = tag(g, l3, '5/29 安値 587円', -150, 6, '#c62828');
    const ln = E.div(g, { left: l1.x, top: l1.y - 1.5, width: l3.x - l1.x + 20, height: 0, borderTop: '3px dashed #1b8a5a', transformOrigin: '0 50%' }).ini({ sx: 0 });
    // 下ヒゲとは（一般的な説明）。カメラの外（sc.root）に置く
    const hp = E.div(sc.root, { left: 60, top: 92, width: 1000, padding: '16px 26px 18px', borderRadius: 20, background: '#fff', boxShadow: '0 12px 24px rgba(0,0,0,.35)', boxSizing: 'border-box', font: '900 30px/1.45 Zen', color: '#262236' },
      '下ヒゲは、ローソク足の下に伸びる線<div style="font:800 24px/1.5 Round;color:#4a4552">その日に、値段がそこまで下がってから、戻したことを示す（一般的な説明）</div>').ini({ o: 0 });
    E.wait(1.5);
    E.show(a, .3, 0); E.show(b, .3, .2);
    E.say('hat', '4月28日の安値は、625円。5月13日の安値は、630円だった。', { yomi: '4月28日の、やすねは、ろっぴゃくにじゅうごえん。5月13日の、やすねは、ろっぴゃくさんじゅうえんだった。' });
    let L = E.say('hat', 'ローソク足の、下に伸びる線を、下ヒゲという。', { wait: false, yomi: 'ローソクあしの、下に伸びる線を、したヒゲという。' });
    E.tw(hp, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2, gain: .5 });
    E.at(L.end);
    E.say('hat', 'その日に、値段が、そこまで下がってから、戻したことを示す。');
    E.say('hat', '5月13日は、始値765円、安値630円、終値795円。', { yomi: '5月13日は、はじめね、ななひゃくろくじゅうごえん、安値、ろっぴゃくさんじゅうえん、おわりね、ななひゃくきゅうじゅうごえん。' });
    E.say('hat', 'この日は、終値が始値より高いので、ローソク足の太い部分の下の端は、始値だ。', { yomi: 'この日は、おわりねが、はじめねより高いので、ローソクあしの、太い部分の、下の端は、はじめねだ。' });
    const w0 = C.at(1487.5, PY(765)), w1 = C.at(1487.5, PY(630));
    const wb = E.div(g, { left: w0.x + 10, top: w0.y, width: 12, height: w1.y - w0.y, borderTop: '3px solid #ffd84a', borderRight: '3px solid #ffd84a', borderBottom: '3px solid #ffd84a', boxSizing: 'border-box' }).ini({ o: 0 });
    const wl = tag(g, w0, '下ヒゲ 135円（765円−630円）', 28, (w1.y - w0.y) / 2 - 12, '#b8651a', 15);
    E.show(wb, .3, .3); E.show(wl, .3, .4);
    E.say('hat', '下ヒゲは、始値の765円から、安値の630円までの、135円だった。', { yomi: 'したヒゲは、はじめねの、ななひゃくろくじゅうごえんから、やすねの、ろっぴゃくさんじゅうえんまでの、ひゃくさんじゅうごえんだった。' });
    E.hide(hp, .3); E.hide(wb, .3); E.hide(wl, .3);
    E.tw(ln, .8, { sx: [0, 1] }, 'inOut', .2);
    L = E.say('hat', '5月29日の安値は、587円だった。', { wait: false, yomi: '5月29日の、やすねは、ごひゃくはちじゅうななえんだった。' });
    P.circle(g, { x: l3.x, y: l3.y, w: 26, h: 26, sw: 3, delay: L.dur * .3, dur: .3 }); E.pop(c, .3, L.dur * .35); E.sfx('drop', { delay: L.dur * .35, gain: .5 });
    E.at(L.end);
    E.say('hat', '4月28日の625円も、5月13日の630円も、下回った。', { yomi: '4月28日の、ろっぴゃくにじゅうごえんも、5月13日の、ろっぴゃくさんじゅうえんも、下回った。' });
    E.say('hat', 'だから、元資料は、ここで、底を更新した、としている。', { yomi: 'だから、もとしりょうは、ここで、そこを、こうしんした、としている。' });
    E.wait(.4);
  });

  /* ============================================================ S11 累計出来高 4/21〜5/28 */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'cumvol' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '累計出来高の表（元資料 p14 の1行）', 44);
    E.show(tt, .3);
    const cols = [['対象期間', '04/21〜05/28', 340], ['価格変化', '−33.13%', 250], ['上昇日', '32.18', 220], ['下落日', '36.02', 220], ['変わらず', '2.86', 220], ['総出来高', '71.06', 230]];
    let x = 160;
    const cells = cols.map(([h, v, w], i) => {
      const n = E.div(g, { left: x, top: 220, width: w - 10, height: 230, borderRadius: 18, background: i === 3 ? '#e6f4ec' : 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,.3)' },
        `<div style="font:800 28px/1.3 Round;color:#6a6066;padding-top:34px">${h}</div><div style="font:900 44px/1.6 Noto;color:${i === 1 || i === 3 ? '#1b8a5a' : '#262236'}">${v}</div>`).ini({ o: 0 });
      x += w; return n;
    });
    E.div(g, { left: 120, top: 470, width: 1540, textAlign: 'right', font: '800 20px/1.5 Round', color: 'rgba(243,230,200,.8)', whiteSpace: 'nowrap' }, '単位：万株（分割調整後）。上昇日・下落日は、終値の前日比で判定（ローソク足の赤・緑とは別）<br>価格変化は、期間の直前の終値から、期間の最後の終値までの変化');
    E.wait(.3);
    let L = E.say('hat', '4月21日から、5月28日までの、累計出来高の表だ。', { wait: false, yomi: '4月21日から、5月28日までの、るいけい、できだかの、ひょうだ。' });
    cells.forEach((c, i) => { E.tw(c, .35, { o: [0, 1], y: [20, 0] }, 'back', .2 + i * L.dur * .12); E.sfx('pop', { delay: .2 + i * L.dur * .12, gain: .35 }); });
    E.at(L.end);
    E.say('hat', '出来高は、売り買いされた株の数。この表は、それを、期間の中で足したものだ。', { yomi: 'できだかは、売り買いされた株の数。このひょうは、それを、期間の中で足したものだ。' });
    E.say('hat', '値段が上がった日、下がった日、変わらなかった日に、分けて足している。');
    const rule0 = panel(g, { x: 220, y: 560, w: 1480, h: 110, size: 30, html: '上がった日は、前の日の終値より、高く終わった日。ローソク足の赤・緑とは、別の決め方' });
    L = E.say('hat', '上がった日か、下がった日かは、終値を、前の日の終値と比べて、決めている。', { wait: false, yomi: '上がった日か、下がった日かは、おわりねを、前の日の、おわりねと比べて、決めている。' });
    E.tw(rule0, .4, { o: [0, 1], y: [20, 0] }, 'back', .2);
    E.at(L.end);
    E.say('hat', 'ローソク足の赤と緑は、その日の始値と、終値を比べて決めるので、決め方が違う。', { yomi: 'ローソクあしの、赤と緑は、その日の、はじめねと、おわりねを比べて決めるので、決め方が違う。' });
    E.hide(rule0, .3);
    E.say('hat', '価格変化は、期間の直前の、4月20日の終値と、5月28日の終値を比べたものだ。', { yomi: 'かかくへんかは、期間の直前の、4月20日の、おわりねと、5月28日の、おわりねを、比べたものだ。' });
    L = E.say('hat', 'その間に、終値は、33.13％下がった。', { wait: false, yomi: 'その間に、おわりねは、サンジューサンテンイチサンパーセント、下がった。' });
    P.underline(g, { x: 525, y: 360, w: 210, delay: L.dur * .4 });
    E.at(L.end);
    L = E.say('hat', '下がった日の出来高を足すと、36.02万株。', { wait: false, yomi: '下がった日の、できだかを足すと、サンジューロクテンゼロニまんかぶ。' });
    P.underline(g, { x: 1015, y: 360, w: 120, delay: L.dur * .4 });
    E.at(L.end);
    E.say('hat', '上がった日は、32.18万株。下がった日のほうが、多かった。', { yomi: '上がった日は、サンジューニテンイチハチまんかぶ。下がった日のほうが、多かった。' });
    E.say('hat', '変わらなかった日は、2.86万株。全部で、71.06万株だ。', { yomi: '変わらなかった日は、ニテンハチロクまんかぶ。全部で、ナナジューイチテンゼロロクまんかぶだ。' });
    const rule = panel(g, { x: 220, y: 560, w: 1480, h: 110, size: 30, html: '期間の区切りは、元資料が、投稿・決算・監査・急落の局面に合わせて、あとから決めたもの' });
    L = E.say('hat', 'この期間の区切りは、元資料が、あとから決めたものだ。', { wait: false, yomi: 'この期間の区切りは、もとしりょうが、あとから決めたものだ。' });
    E.tw(rule, .4, { o: [0, 1], y: [20, 0] }, 'back', .2);
    E.at(L.end);
    E.say('hat', '投稿や、決算、監査、急な値下がりが、あった時期に、合わせている。', { yomi: '投稿や、決算、監査、急な、ねさがりが、あった時期に、合わせている。' });
    E.hide(rule, .3);
    const no = panel(g, { x: 220, y: 560, w: 1480, h: 150, size: 30, dark: true, html: '<div style="text-align:center">出来高には、同じ株が何度も売買された分も、足されている<br>だから、合計を「誰かの持ち株」に読み替えることはできない</div>' });
    L = E.say('hat', '出来高には、同じ株が、何度も売り買いされた分も、足されている。', { wait: false, yomi: 'できだかには、同じ株が、何度も売り買いされた分も、足されている。' });
    E.tw(no, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', 'だから、合計を、誰かの持ち株に、読み替えることはできない。');
    E.wait(.4);
  });

  /* ============================================================ S12 ブルちゃんの部屋 */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_room' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: '保有', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    const memo = E.div(g, { left: 1150, top: 100, padding: '10px 26px', borderRadius: 14, background: 'rgba(255,255,255,.95)', font: '900 36px/1.4 Zen', color: '#3a3236', boxShadow: '0 8px 18px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }, '監理銘柄（確認中）…？').ini({ o: 0, r: -2 });
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 4, delay: .3 });
    E.wait(.6);
    const L = E.narr('有報でも、意見不表明。監査人も、辞めた。', { wait: false, yomi: 'ゆうほうでも、意見、ふひょうめい。かんさにんも、辞めた。' });
    E.at(L.end);
    const L2 = E.narr('それでも、私は、まだ持っていた。監理銘柄、という言葉の意味を、調べもしなかった。', { wait: false, yomi: 'それでも、私は、まだ持っていた。かんりめいがら、という言葉の意味を、調べもしなかった。' });
    E.pop(memo, .4, L2.dur * .45, .6); E.sfx('page', { delay: L2.dur * .45, gain: .5 });
    E.at(L2.end + .3);
  });

  /* ============================================================ S13 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '指定の名前より、指定の理由を読め', { left: 120, top: 120, font: '900 64px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .07));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const d1 = E.div(paper, { left: 140, top: 380, width: 520, height: 260, borderRadius: 20, border: '5px dashed #a09070', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#a09070', paddingTop: 60 }, '名前<br><span style="font-size:32px">監理銘柄（確認中）</span>').ini({ o: 0 });
    const d2 = E.div(paper, { left: 760, top: 380, width: 520, height: 260, borderRadius: 20, border: '6px solid #c62828', background: 'rgba(255,255,255,.6)', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#c62828', paddingTop: 60 }, '理由<br><span style="font-size:30px">名証の公表で確かめる</span>').ini({ o: 0 });
    E.wait(2.6);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「指定の名前より、指定の理由を読め」。', { wait: false, yomi: '指定の名前より、指定の理由を読め。' });
    E.show(d1, .4, .2); E.tw(d2, .45, { o: [0, 1], s: [1.2, 1] }, 'back', L.dur * .5); E.sfx('stamp', { delay: L.dur * .5 + .2, gain: .5 });
    E.at(L.end + .4);
    E.narr('名前だけでなく、なぜ指定されたのかを、名証の公表で確かめろ、ということだ。', { yomi: '名前だけでなく、なぜ指定されたのかを、めいしょうの公表で、確かめろ、ということだ。' });
    E.wait(.6);
  });

  /* ============================================================ S14 男爵 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .75 });
    const C = P.closeup(g, CH('baron_e_normal'), { bg: 'radial-gradient(ellipse at 50% 40%, #4a1622 0%, #200a10 75%)', imgH: 860, panelBg: 'linear-gradient(180deg,#3a121b,#1a070c)' });
    E.from(C.img, { s: .94, y: 30 }, .6, 0, 'out');
    E.wait(.5);
    E.say('baron', '監理、という二文字を、人は、見なかったことにしたがる。', { talk: C.img, talkAmp: 2, yomi: 'かんり、という、ふたもじを、人は、見なかったことにしたがる。' });
    C.swap(CH('baron_e_scheme'));
    E.say('baron', 'だが、取引所の確認は、止まらない。', { talk: C.img, talkAmp: 2 });
    E.wait(.5);
  });

  /* ============================================================ S15 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 1010 });
    [['T', P.T_BLUE], ['I', P.I_ORANGE]].forEach(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
    });
    const st = P.sticky(g, '第11章<br>516円のトリプルボトム', { x: 1280, y: 120, w: 560, h: 250, rot: 5, size: 42 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第11章だブー。', { talk: pig, talkAmp: 5, yomi: 'ブヒッ。次は、だいじゅういっしょうだブー。' });
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
