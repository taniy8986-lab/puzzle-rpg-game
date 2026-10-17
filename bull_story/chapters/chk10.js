// 完全版 第10章「5月27日 18時10分」（2026年5月27日〜5月29日）
// 台本: story/k/k10_5月27日18時10分.md　元資料 p7・p13・p14・p15・p22・p32・p33・p36
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
    const L = E.say('hat', '取引時間の中に、投稿が1つ。引けのあと、18時10分に会社の開示、18時28分に投稿だ。', { wait: false, yomi: '取引時間の中に、投稿が、ひとつ。ひけのあと、18時10分に、会社の開示、18時28分に、投稿だ。' });
    E.pop(dots[0], .4, .3); E.sfx('pop', { delay: .3 });
    E.pop(dots[1], .4, L.dur * .45); E.sfx('notify', { delay: L.dur * .45 });
    E.pop(dots[2], .4, L.dur * .8); E.sfx('pop', { delay: L.dur * .8, gain: .5 });
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
    E.narr('5月27日、10時46分。株主総会で、倒産が発表されることはない、と否定する投稿があった。');
    E.say('hat', 'これは、上場が続くことや、監査の意見を、保証するものではない。');
    const ord = panel(g, { x: 300, y: 720, w: 1320, h: 110, size: 34, dark: true, html: '投稿の時点（10:46）では、有報の監査の結果は　未公表' });
    const L = E.say('hat', '投稿は、10時46分。その時点で、有報の監査の結果は、まだ公表されていない。', { wait: false, yomi: '投稿は、10時46分。その時点で、ゆうほうの監査の結果は、まだ公表されていない。' });
    E.tw(ord, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .35); E.sfx('ding', { delay: L.dur * .35, gain: .5 });
    E.at(L.end + .4);
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
    E.say('hat', '財務諸表の監査と、内部統制の監査の、両方だ。', { yomi: 'ざいむしょひょうの監査と、ないぶとうせいの監査の、両方だ。' });
    const ex = panel(g, { x: 440, y: 520, w: 1400, h: 110, size: 32, html: '<span style="color:#b8651a">内部統制の監査</span><span style="font:800 28px Round;color:#4a4552">＝ 会社の中のチェックの仕組みが、働いているかを見る監査</span>' });
    let L = E.say('hat', '内部統制の監査は、会社の中の、チェックの仕組みが、働いているかを見る監査だ。', { wait: false, yomi: 'ないぶとうせいの監査は、会社の中の、チェックの仕組みが、働いているかを見る監査だ。' });
    rise(ex, .2);
    E.at(L.end);
    E.say('hat', '同じ時刻に、監査法人アリアから、辞任届を受け取ったことも、開示した。', { yomi: '同じ時刻に、監査法人アリアから、じにんとどけを受け取ったことも、開示した。' });
    E.hide(ex, .3);
    const st = (x, d, t) => E.div(g, { left: x, top: 680, width: 620, height: 190, borderRadius: 24, background: 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="font:800 28px/1.4 Round;color:#6a6066;padding-top:26px">${d}</div><div style="font:900 38px/1.4 Zen;color:#262236">${t}</div><div style="font:900 42px/1.3 Zen;color:#c62828">意見不表明</div>`).ini({ o: 0 });
    const s1 = st(480, '4月24日', '会社法の監査'), s2 = st(1220, '5月27日', '有価証券報告書の監査');
    const ar = E.div(g, { left: 1100, top: 740, width: 120, textAlign: 'center', font: '900 64px/1 Zen', color: '#f3e6c8' }, '▶').ini({ o: 0 });
    L = E.say('hat', '4月24日の会社法の監査とは、対象の書類が違う。2度目の、意見不表明だ。', { wait: false, yomi: '4月24日の、会社法の監査とは、対象の書類が違う。にどめの、意見不表明だ。' });
    rise(s1, .2); E.show(ar, .3, L.dur * .4); rise(s2, L.dur * .5);
    E.at(L.end + .4);
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
    E.narr('公表の18分後に、監査人の辞任に対して、別の監査人がよい、という投稿があった。', { yomi: '公表の18分後に、かんさにんの辞任に対して、別の、かんさにんがよい、という投稿があった。' });
    E.say('hat', '監査人が替わるだけで、問題が解消するわけではない。');
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
    E.narr('5月28日、16時56分。監理銘柄の指定について、紹介する投稿があった。', { yomi: '5月28日、16時56分。かんりめいがらの指定について、紹介する投稿があった。' });
    E.narr('指定には、終わりの日の決まりがない、という点だ。');
    let L = E.say('hat', '会社の開示は、そのあとの、17時だ。', { wait: false });
    ch.in(1, .2);
    E.at(L.end);
    const nt = panel(g, { x: 260, y: 640, w: 1400, h: 100, size: 32, dark: true, html: '名証の指定の公表時刻は元資料にない　示すのは、投稿と開示の順番だけ' });
    L = E.say('hat', '名証が指定を公表した時刻は、元資料にない。', { wait: false, yomi: 'めいしょうが、指定を公表した時刻は、もとしりょうにない。' });
    E.tw(nt, .4, { o: [0, 1], y: [20, 0] }, 'back', .2);
    E.at(L.end);
    L = E.say('hat', 'ここで示すのは、投稿と、会社の開示の、順番だけだ。', { wait: false });
    E.at(L.end + .3);
    E.hide(nt, .3);
    const i38 = P.icard(g, { id: 'I38', when: '2026/5/28 17:00', session: '引け後', title: '監理銘柄・確認中', text: '意見不表明の監査報告書付き有報を提出。<br>改善期間入りは解除されず、監理銘柄（確認中）に指定', note: 'T41・T42の上場継続に関する解釈と、公式指定の理由を並べて読む', x: 260, y: 320, w: 1400, size: 32 });
    E.tw(t41, .35, { o: 0, x: -60 }, 'in2');
    E.tw(i38, .45, { o: [0, 1], y: [30, 0] }, 'back', .4); E.sfx('notify', { delay: .4 });
    E.wait(.6);
    E.say('hat', '17時。会社は、意見不表明の監査報告書が付いた、有価証券報告書を、提出したと開示した。', { yomi: '17時。会社は、意見、ふひょうめいの、監査報告書が付いた、有価証券報告書を、提出したと開示した。' });
    E.say('hat', '名証は、この日、監理銘柄（確認中）に指定した。', { yomi: 'めいしょうは、この日、かんりめいがら、かくにんちゅうに、指定した。' });
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
    E.wait(.3);
    let L = E.say('hat', '監理銘柄は、上場廃止の基準に当たるおそれがあるときに、', { wait: false, yomi: 'かんりめいがらは、上場廃止の基準に当たるおそれがあるときに、' });
    rise(b1, .3);
    E.at(L.end);
    E.say('hat', '取引所が、投資家に知らせるために指定する銘柄だ。', { yomi: 'とりひきじょが、投資家に知らせるために指定する銘柄だ。' });
    L = E.say('hat', '確認中は、その基準に当たるかを、確認している段階。', { wait: false });
    rise(b2, .2);
    E.at(L.end);
    const nb = panel(g, { x: 260, y: 590, w: 1400, h: 110, size: 34, dark: true, html: '終わりの日が決まっていない　≠　上場廃止の心配が消えた' });
    L = E.say('hat', '確認が終わるまでの指定だ。上場廃止の心配が消えた、という意味ではない。', { wait: false });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S8 T42　19:54 */
  E.scene({ name: 't42' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [5, 28], [5, 28]);
    const t42 = P.tcard(g, { id: 'T42', when: '2026/5/28 19:54', kind: '財務', session: '引け後', text: '調査資料を示せば新監査人から適正意見を得られるとの見方', note: '本人の制度・監査に関する解釈。後の経過とは分けて記録', x: 260, y: 160, w: 1400, size: 40 });
    tIn(t42, .5);
    E.wait(1.0);
    E.narr('19時54分。調査の資料を示せば、新しい監査人から、適正意見を得られる、という見方の投稿。', { yomi: '19時54分。調査の資料を示せば、新しい、かんさにんから、適正意見を得られる、という見方の投稿。' });
    const m = P.mark(g, '本人の解釈', { x: 1300, y: 470, color: P.T_BLUE, size: .8, rot: 7, w: 240 });
    const L = E.say('hat', 'これは、本人の、制度と監査についての解釈だ。あとの経過とは、分けて記録する。', { wait: false });
    P.stampIn(m, L.dur * .3);
    E.at(L.end + .3);
  });

  /* ============================================================ S9 T43　5月29日 13:28 */
  E.scene({ name: 't43' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [5, 28], [5, 29]);
    const t43 = P.tcard(g, { id: 'T43', when: '2026/5/29 13:28', kind: '財務', session: '取引時間内', text: '総会議案中の監査意見不表明に関する記述を引用', note: '長文の取得できた範囲を確認。不表明自体を投稿している', x: 260, y: 160, w: 1400, size: 40 });
    tIn(t43, .5);
    E.wait(1.0);
    E.narr('5月29日、13時28分。株主総会の議案の中から、引用する投稿があった。');
    E.narr('監査意見の不表明について、書かれた部分だ。', { yomi: '監査意見の、ふひょうめいについて、書かれた部分だ。' });
    E.say('hat', '元資料は、長い投稿の、取得できた範囲を確かめている。不表明そのものを、投稿していた。', { yomi: 'もとしりょうは、長い投稿の、取得できた範囲を確かめている。ふひょうめい、そのものを、投稿していた。' });
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
    E.wait(1.5);
    E.show(a, .3, 0); E.show(b, .3, .2); E.tw(ln, .8, { sx: [0, 1] }, 'inOut', .3);
    let L = E.say('hat', '5月29日の安値は、587円。4月28日の、625円を下回った。', { wait: false, yomi: '5月29日の安値は、ごひゃくはちじゅうななえん。4月28日の、ろっぴゃくにじゅうごえんを、下回った。' });
    P.circle(g, { x: l3.x, y: l3.y, w: 26, h: 26, sw: 3, delay: L.dur * .2, dur: .3 }); E.pop(c, .3, L.dur * .25); E.sfx('drop', { delay: L.dur * .25, gain: .5 });
    E.at(L.end);
    E.say('hat', '5月13日の、長い下ヒゲのあとも、底は、更新された。', { yomi: '5月13日の、長い、したヒゲのあとも、そこは、更新された。' });
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
    E.div(g, { left: 120, top: 470, width: 1540, textAlign: 'right', font: '800 20px/1.3 Round', color: 'rgba(243,230,200,.8)', whiteSpace: 'nowrap' }, '単位：万株（分割調整後）。上昇日・下落日は終値の前日比で判定（ローソク足の赤・緑とは別）。価格変化は期間直前の終値→期間最終終値');
    E.wait(.3);
    let L = E.say('hat', '4月21日から、5月28日までの、累計出来高の表だ。', { wait: false, yomi: '4月21日から、5月28日までの、るいけい、できだかの、ひょうだ。' });
    cells.forEach((c, i) => { E.tw(c, .35, { o: [0, 1], y: [20, 0] }, 'back', .2 + i * L.dur * .12); E.sfx('pop', { delay: .2 + i * L.dur * .12, gain: .35 }); });
    E.at(L.end);
    L = E.say('hat', 'この間に、終値は、33.13％下がった。', { wait: false, yomi: 'この間に、おわりねは、サンジューサンテンイチサンパーセント、下がった。' });
    P.circle(g, { x: 160 + 340 + 120, y: 360, w: 220, h: 110, delay: L.dur * .4 });
    E.at(L.end);
    L = E.say('hat', '下がった日の出来高は36.02万株。上がった日は32.18万株だった。', { wait: false, yomi: '下がった日の、できだかは、サンジューロクテンゼロニまんかぶ。上がった日は、サンジューニテンイチハチまんかぶだった。' });
    P.circle(g, { x: 160 + 340 + 250 + 220 + 105, y: 360, w: 200, h: 120, delay: L.dur * .3 });
    E.at(L.end);
    const rule = panel(g, { x: 260, y: 540, w: 1400, h: 110, size: 32, html: '期間の区切りは、元資料が局面に合わせて、あとから決めたもの' });
    L = E.say('hat', 'この区切りは、元資料が、あとから局面に合わせて決めたものだ。', { wait: false, yomi: 'この区切りは、もとしりょうが、あとから、きょくめんに合わせて決めたものだ。' });
    E.tw(rule, .4, { o: [0, 1], y: [20, 0] }, 'back', .2);
    E.at(L.end);
    E.hide(rule, .3);
    const no = panel(g, { x: 260, y: 540, w: 1400, h: 110, size: 32, dark: true, html: '同じ株が何度も売買される → 合計を「誰かの持ち株」に読み替えられない' });
    E.say('hat', 'ここでも、同じ株が、何度も売り買いされる。');
    L = E.say('hat', '合計を、誰かの持ち株に、読み替えることはできない。', { wait: false });
    E.tw(no, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
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
    E.at(L.end + 1.0);
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
