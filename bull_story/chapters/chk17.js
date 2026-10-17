// 完全版 第17章「海帆との比較」（海帆の開示 2025年6月〜2026年6月）
// 台本: story/k/k17_海帆との比較.md　元資料 p32・p36・p41
// ルール11：エスポアの監査人・海帆の監査人・T38（保有者の重複は未確認）を線で結ばない。海帆の監査人の名前は出さない
// 全額減損の対象（NHPH取得に伴うのれん）と監査意見を分ける。交代理由から監査人の不正関与を推定しない
'use strict';
E.chapter('k17');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const box = (g, { x, y, w = 700, h = 280, top = '', main = '', sub = '', c = '#262236', border = 'none', size = 50 }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 26, background: 'rgba(255,255,255,.95)', border, boxShadow: '0 12px 24px rgba(0,0,0,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 30px' },
    `${top ? `<div style="font:800 28px/1.3 Round;color:#6a6066">${top}</div>` : ''}<div style="font:900 ${size}px/1.3 Zen;color:${c};white-space:nowrap">${main}</div>${sub ? `<div style="font:800 30px/1.5 Round;color:#4a4552;margin-top:14px">${sub}</div>` : ''}`).ini({ o: 0 });
  const rise = (n, d = 0) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', d); E.sfx('pop', { delay: d, gain: .5 }); };
  const fiction = sc => P.note(sc.root, 'ブルちゃんの売買はフィクションです', { x: 1440, y: 40, size: 24, dark: true });
  const card = (g, n, d = .5) => { E.tw(n, .45, { o: [0, 1], y: [30, 0] }, 'back', d); E.sfx('notify', { delay: d }); };
  const analysis = (g, y, txt) => E.div(g, { left: 160, top: y, width: 1600, height: 110, borderRadius: 24, background: '#2a2430', border: '3px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: '900 34px/1.25 Zen', color: '#ffd84a', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' },
    `<span style="font:800 26px Round;color:#f3e6c8">元資料の分析</span>${txt}`).ini({ o: 0 });

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

  /* ============================================================ S0 アバン：ブルちゃんの部屋 */
  E.scene({ name: 'avant' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: 1.0, gain: .75 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    const memo = E.div(g, { left: 1180, top: 600, width: 400, padding: '16px 22px', background: '#fff7c8', boxShadow: '0 8px 18px rgba(0,0,0,.3)', font: '900 26px/1.5 Zen', color: '#3a3020', transform: 'rotate(-3deg)' }, 'T38　5/18 12:04<br>海帆の名前が<br>出てきた投稿').ini({ o: 0 });
    fiction(sc);
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 520, dur: 4, delay: .3 });
    E.pop(memo, .4, 1.0); E.sfx('page', { delay: 1.0, gain: .5 });
    E.wait(1.2);
    E.narr('上場廃止が決まったあと、私は、5月18日の投稿を、思い出した。');
    E.narr('海帆という会社の名前が、出てきた投稿だ。', { yomi: 'かいはんという会社の名前が、出てきた投稿だ。' });
    E.wait(.3);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 17, title: '海帆との比較', sub: '海帆の開示（2025年6月〜2026年6月）', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 T38　5月18日 12:04 */
  E.scene({ name: 't38' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .75 });
    P.slate(g);
    const t38 = P.tcard(g, { id: 'T38', when: '2026/5/18 12:04', kind: '需給', session: '昼休み', text: '海帆と保有者が重なり朝に売りが出たと推測', note: '保有者の重複や売り手の同定は未確認。5月18日は安値689円、終値779円', x: 260, y: 130, w: 1400, size: 40 });
    card(g, t38, .5);
    E.wait(1.0);
    E.narr('第9章で見た、5月18日の投稿。', { yomi: 'だいきゅうしょうで見た、5月18日の投稿。' });
    E.narr('海帆と、保有者が重なっていて、朝に売りが出た、と推測していた。', { yomi: 'かいはんと、ほゆうしゃが、重なっていて、朝に、売りが出た、と、すいそくしていた。' });
    E.tw(t38, .4, { y: -20, s: .9 }, 'inOut');
    const bx = (x, t, s, c, dashed) => E.div(g, { left: x, top: 480, width: 500, height: 250, borderRadius: 24, background: 'rgba(255,255,255,.95)', border: dashed ? `4px dashed ${c}` : `5px solid ${c}`, textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="font:900 40px/1.3 Zen;color:${c};padding-top:34px">${t}</div><div style="font:900 32px/1.45 Zen;color:#262236;margin-top:14px">${s}</div>`).ini({ o: 0 });
    const b1 = bx(170, '事実', '5/18 安値 689円<br>終値 779円', '#1b8a5a'), b2 = bx(710, '推測', '保有者が重なり、<br>朝に売りが出た', '#2b68d8'), b3 = bx(1250, '未確認', '保有者の重複<br>売り手の同定', '#c62828', true);
    let L = E.say('hat', '確かめられるのは、5月18日の値段だ。安値は689円、終値は779円。', { wait: false, yomi: '確かめられるのは、5月18日の値段だ。やすねは、ろっぴゃくはちじゅうきゅうえん、おわりねは、ななひゃくななじゅうきゅうえん。' });
    rise(b1, .3); rise(b2, L.dur * .6);
    E.at(L.end);
    L = E.say('hat', '保有者が重なっていることも、誰が売ったかも、確かめられていない。', { wait: false, yomi: 'ほゆうしゃが、重なっていることも、誰が売ったかも、確かめられていない。' });
    rise(b3, .4);
    E.at(L.end + .4);
  });

  /* ============================================================ S3 海帆との比較 */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'compare' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '海帆との比較：交代の回数より、残った問題を見る', 70);
    E.show(tt, .3);
    const a = panel(g, { x: 260, y: 260, w: 1400, h: 120, size: 36, html: '<span style="font:800 26px Round;color:#6a6066">比べる対象</span>海帆の 2025/6〜2026/6 の開示（A13〜A16）' });
    const b = panel(g, { x: 260, y: 420, w: 1400, h: 100, size: 32, html: '各交代の理由は、会社の説明' });
    const c = panel(g, { x: 260, y: 560, w: 1400, h: 100, size: 32, dark: true, html: '「全額減損」の対象と、監査意見を、分けて読む' });
    E.wait(.4);
    E.say('hat', '海帆は、別の上場会社だ。', { yomi: 'かいはんは、べつの、じょうじょうがいしゃだ。' });
    let L = E.say('hat', '元資料は、海帆の、2025年6月から、2026年6月の開示を、比べる対象にしている。', { wait: false, yomi: 'もとしりょうは、かいはんの、2025年6月から、2026年6月の開示を、比べる対象にしている。' });
    rise(a, .4);
    E.at(L.end);
    E.say('hat', '交代の回数より、残った問題を見る。それが、元資料の見方だ。', { yomi: 'こうたいの回数より、残った問題を見る。それが、もとしりょうの見方だ。' });
    L = E.say('hat', '交代の理由は、どれも、会社の説明だ。', { wait: false, yomi: 'こうたいの理由は、どれも、会社の説明だ。' });
    rise(b, .3);
    E.at(L.end);
    L = E.say('hat', 'そして、全額減損の対象と、監査意見を、分けて読む。', { wait: false, yomi: 'そして、ぜんがく、げんそんの対象と、かんさいけんを、分けて読む。' });
    E.tw(c, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S4 海帆の4つの開示 */
  E.scene({ name: 'timeline' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '海帆の開示（元資料 p41 の要約）', 36);
    E.show(tt, .3);
    const row = (y, h, d, id, t, b) => E.div(g, { left: 100, top: y, width: 1720, height: h, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="flex:none;width:250px;text-align:center"><div style="font:900 32px/1.3 Noto;color:#b8651a">${d}</div><div style="font:800 21px/1.3 Round;color:#6a6066">${id}</div></div><div style="flex:1;padding-right:28px"><div style="font:900 30px/1.35 Zen;color:#262236">${t}</div><div style="font:800 23px/1.45 Round;color:#4a4552;margin-top:4px">${b}</div></div>`).ini({ o: 0 });
    const r1 = row(120, 160, '2025/6/25', 'A13（6/16公表）', '監査人の交代', '海外法人の連結で監査業務が拡大。前任法人から、人的資源の制約を理由に次期監査の辞退申出');
    const r2 = row(300, 160, '2025/11/14', 'A14', 'ネパール事業を停止・再検討　のれん 20億8,400万円を全額減損', '現地の混乱で、必要資料の提出・確認が難しくなり、監査人と協議');
    const r3 = row(480, 160, '2025/12/24', 'A15', '監査人の交代', '会社が交代を申し出て、それまでの監査人が了承。会社は、ネパール事業の監査で海外ネットワークを使える点を説明');
    const r4 = row(660, 190, '2026/6/26', 'A16', '新しい監査人が意見不表明', '債務と社会保険料の滞納に関する差押えなどで資金が逼迫。<br>改善策・継続性の評価について、十分な監査証拠を得られなかった');
    E.div(g, { left: 100, top: 862, width: 1720, textAlign: 'right', font: '800 20px/1.3 Round', color: 'rgba(243,230,200,.8)', whiteSpace: 'nowrap' }, '各交代の理由は会社の説明（元資料 p41）');
    const slide = (n, d = .2) => { E.tw(n, .4, { o: [0, 1], x: [-40, 0] }, 'back', d); E.sfx('slide', { delay: d }); };
    E.wait(.3);
    let L = E.say('hat', '2025年6月25日。監査人が、交代した。', { wait: false, yomi: '2025年6月25日。かんさにんが、こうたいした。' });
    slide(r1);
    E.at(L.end);
    E.say('hat', '会社の説明では、海外の会社を連結して、監査の仕事が増えた。', { yomi: '会社の説明では、かいがいの会社を、れんけつして、監査の仕事が増えた。' });
    E.say('hat', '前の監査法人から、人手の制約を理由に、次の期の監査を、辞退する申し出があった。', { yomi: '前の、かんさほうじんから、ひとでの、せいやくを理由に、次の期の監査を、じたいする、もうしでがあった。' });
    L = E.say('hat', '11月14日。会社は、ネパールの事業を止めて、見直すと開示した。', { wait: false });
    slide(r2);
    E.at(L.end);
    E.say('hat', 'のれん、20億8,400万円を、全額減損した。', { yomi: 'のれん、にじゅうおく、はっせんよんひゃくまんえんを、ぜんがく、げんそんした。' });
    E.say('hat', '現地の混乱で、必要な資料の提出や確認が難しくなり、監査人と協議した、と説明した。', { yomi: 'げんちの混乱で、必要な資料の、ていしゅつや、確認が難しくなり、かんさにんと、きょうぎした、と説明した。' });
    L = E.say('hat', '12月24日。監査人が、また交代した。会社が申し出て、それまでの監査人が了承した。', { wait: false, yomi: '12月24日。かんさにんが、また、こうたいした。会社が申し出て、それまでの、かんさにんが、りょうしょうした。' });
    slide(r3);
    E.at(L.end);
    L = E.say('hat', '2026年6月26日。新しい監査人が、意見不表明を出した。', { wait: false, yomi: '2026年6月26日。新しい、かんさにんが、いけんふひょうめいを出した。' });
    slide(r4);
    E.at(L.end);
    E.say('hat', '開示によると、差押えなどで、資金が逼迫していた。', { yomi: 'かいじによると、さしおさえなどで、しきんが、ひっぱくしていた。' });
    E.say('hat', '監査人は、改善策や、続けられるかの評価について、十分な監査証拠を、得られなかった。', { yomi: 'かんさにんは、かいぜんさくや、続けられるかの評価について、じゅうぶんな、かんさしょうこを、得られなかった。' });
    E.wait(.4);
  });

  /* ============================================================ S5 全額減損の対象 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'goodwill' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '「全額減損」の対象', 60);
    E.show(tt, .3);
    const e1 = panel(g, { x: 200, y: 200, w: 1520, h: 110, size: 30, html: '<span style="color:#b8651a">のれん</span><span style="font:800 26px Round;color:#4a4552">＝ 会社を買ったときに、相手の純資産より多く払った分</span>' });
    const e2 = panel(g, { x: 200, y: 340, w: 1520, h: 110, size: 30, html: '<span style="color:#b8651a">全額減損</span><span style="font:800 26px Round;color:#4a4552">＝ その価値を、帳簿の上でゼロにする損失</span>' });
    E.div(g, { left: 200, top: 462, width: 1520, textAlign: 'right', font: '800 20px/1.3 Round', color: 'rgba(243,230,200,.8)', whiteSpace: 'nowrap' }, '一般的な説明');
    E.wait(.3);
    let L = E.say('hat', 'のれんは、会社を買ったときに、相手の純資産より、多く払った分のことだ。', { wait: false, yomi: 'のれんは、会社を買ったときに、相手の、じゅんしさんより、多く払った分のことだ。' });
    rise(e1, .2);
    E.at(L.end);
    L = E.say('hat', '全額減損は、その価値を、帳簿の上で、ゼロにすることだ。', { wait: false, yomi: 'ぜんがく、げんそんは、その価値を、ちょうぼの上で、ゼロにすることだ。' });
    rise(e2, .2);
    E.at(L.end);
    const A = box(g, { x: 200, y: 530, w: 900, h: 260, top: '全額減損の対象', main: 'NHPH取得に伴うのれん', sub: '20億8,400万円', c: '#b8651a', border: '5px solid #b8651a', size: 44 });
    const B = box(g, { x: 1180, y: 530, w: 540, h: 260, top: 'ではない', main: '海帆の全資産', sub: '', c: '#c62828', border: '5px dashed #c62828', size: 44 });
    E.say('hat', '全額減損、と聞くと、会社の全部が、無くなったように聞こえる。', { yomi: 'ぜんがく、げんそん、と聞くと、会社の全部が、無くなったように聞こえる。' });
    L = E.say('hat', 'でも、対象は、NHPHという会社を取得したときの、のれんだ。', { wait: false, yomi: 'でも、対象は、エヌエイチピーエイチという会社を、しゅとくしたときの、のれんだ。' });
    rise(A, .4);
    E.at(L.end);
    L = E.say('hat', '海帆の、全部の資産ではない。', { wait: false, yomi: 'かいはんの、全部の資産ではない。' });
    rise(B, .2);
    E.at(L.end);
    E.say('hat', '減損を計上したのは、会社だ。', { yomi: 'げんそんを、けいじょうしたのは、会社だ。' });
    E.wait(.4);
  });

  /* ============================================================ S6 原因の違い */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'diff' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '同じ意見不表明でも', 60);
    E.show(tt, .3);
    const A = box(g, { x: 160, y: 190, w: 760, h: 340, top: 'エスポアの中心', main: '収益取引の<br>実在性・計上時期', sub: '', c: '#c62828', border: '5px solid #c62828', size: 48 });
    const B = box(g, { x: 1000, y: 190, w: 760, h: 340, top: '海帆（6/26の開示）の中心', main: '資金の逼迫と<br>継続性の評価', sub: '', c: '#2b68d8', border: '5px solid #2b68d8', size: 48 });
    const nb = analysis(g, 610, '意見不表明でも、確かめるべき原因は異なる');
    E.wait(.3);
    let L = E.say('hat', '元資料は、こう比べている。エスポアの中心は、収益の取引が、本当にあったか。', { wait: false, yomi: 'もとしりょうは、こう比べている。エスポアの中心は、しゅうえきの取引が、本当にあったか。' });
    rise(A, .3);
    E.at(L.end);
    E.say('hat', 'そして、いつの収益として、計上するかだった。', { yomi: 'そして、いつの収益として、けいじょうするかだった。' });
    L = E.say('hat', '海帆の、6月26日の開示の中心は、資金の逼迫と、会社を続けられるかの評価だ。', { wait: false, yomi: 'かいはんの、6月26日の開示の中心は、しきんの、ひっぱくと、会社を続けられるかの評価だ。' });
    rise(B, .3);
    E.at(L.end);
    L = E.say('hat', '同じ意見不表明でも、確かめるべき原因は、違う。', { wait: false, yomi: '同じ、いけんふひょうめいでも、確かめるべき原因は、違う。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('dun', { delay: .3, gain: .6 });
    E.at(L.end + .4);
  });

  /* ============================================================ S7 共通する学び */
  E.scene({ name: 'lesson' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '共通する学び', 50);
    E.show(tt, .3);
    const a1 = analysis(g, 160, '監査法人が交代しても、事業・資金・証拠の問題は、自動的に解決しない');
    const a2 = analysis(g, 300, '交代理由から、監査人の不正関与を推定しない');
    const a3 = panel(g, { x: 160, y: 440, w: 1600, h: 100, size: 32, html: '減損・監査人の交代・意見不表明を、同じ出来事として扱わない' });
    E.wait(.3);
    E.say('hat', '元資料は、共通する学びを、こうまとめている。', { yomi: 'もとしりょうは、きょうつうする学びを、こうまとめている。' });
    let L = E.say('hat', '監査法人が交代しても、事業や、資金や、証拠の問題は、自動的には、解決しない。', { wait: false, yomi: 'かんさほうじんが、こうたいしても、事業や、しきんや、しょうこの問題は、じどうてきには、解決しない。' });
    E.tw(a1, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    L = E.say('hat', 'そして、交代の理由から、監査人が、不正に関わった、と推定しない。', { wait: false, yomi: 'そして、こうたいの理由から、かんさにんが、ふせいに関わった、と、すいていしない。' });
    E.tw(a2, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '減損と、監査人の交代と、意見不表明は、別の出来事だ。', { wait: false, yomi: 'げんそんと、かんさにんの、こうたいと、いけんふひょうめいは、別の出来事だ。' });
    rise(a3, .3);
    E.at(L.end + .4);
  });

  /* ============================================================ S8 値段と出来高の限界 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'other' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .7 });
    P.slate(g);
    const tt = P.heading(g, '値段と出来高の限界（元資料 p36）', 60);
    E.show(tt, .3);
    const b = panel(g, { x: 260, y: 220, w: 1400, h: 110, size: 38, html: '<span style="color:#1b8a5a">事実</span>・<span style="color:#2b68d8">推測</span>・<span style="color:#c62828">未確認</span>を分ける' });
    const c = panel(g, { x: 260, y: 380, w: 1400, h: 120, size: 32, dark: true, html: '公開されている値段と出来高だけでは、相手・残高・意図は確定できない' });
    E.wait(.3);
    let L = E.say('hat', '元資料は、事実と、推測と、未確認を、分けている。', { wait: false, yomi: 'もとしりょうは、じじつと、すいそくと、みかくにんを、分けている。' });
    rise(b, .3);
    E.at(L.end);
    L = E.say('hat', '公開されている値段と出来高だけでは、売買の相手も、残高も、意図も、確定できない。', { wait: false, yomi: 'こうかいされている値段と、できだかだけでは、売買の相手も、ざんだかも、いとも、確定できない。' });
    E.tw(c, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '5月18日の朝に、誰が売ったのか。それは、分からないままだ。');
    E.wait(.4);
  });

  /* ============================================================ S9 ブルちゃんの部屋 */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_room' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 4, delay: .3 });
    E.wait(.6);
    E.narr('同じ、意見不表明、という言葉を、私は、同じ話だと思っていた。', { yomi: '同じ、いけんふひょうめい、という言葉を、私は、同じ話だと思っていた。' });
    E.narr('でも、確かめるべき原因は、会社ごとに、違っていた。');
    E.wait(.3);
  });

  /* ============================================================ S10 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '同じ言葉でも、原因は別に確かめる', { left: 120, top: 120, font: '900 64px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .07));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const nb = (x, t, s, c) => E.div(paper, { left: x, top: 330, width: 520, height: 260, borderRadius: 20, border: `4px solid ${c}`, textAlign: 'center' },
      `<div style="font:900 40px/1.3 Zen;color:${c};padding-top:44px">${t}</div><div style="font:900 34px/1.45 Zen;color:#2a2230;margin-top:16px">${s}</div>`).ini({ o: 0 });
    const b1 = nb(150, 'エスポア', '収益の実在性<br>計上時期', '#c62828'), b2 = nb(730, '海帆', '資金の逼迫<br>継続性', '#2b68d8');
    E.wait(2.4);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「同じ言葉でも、原因は、別に確かめる」。', { wait: false, yomi: 'おなじ言葉でも、原因は、べつに、確かめる。' });
    E.show(b1, .3, .3); E.show(b2, .3, L.dur * .5); E.sfx('stamp', { delay: L.dur * .5, gain: .5 });
    E.at(L.end + 1.0);
  });

  /* ============================================================ S11 男爵 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .75 });
    const C = P.closeup(g, CH('baron_e_normal'), { bg: 'radial-gradient(ellipse at 50% 40%, #4a1622 0%, #200a10 75%)', imgH: 860, panelBg: 'linear-gradient(180deg,#3a121b,#1a070c)' });
    E.from(C.img, { s: .94, y: 30 }, .6, 0, 'out');
    E.wait(.5);
    E.say('baron', '似た言葉が並ぶと、人は、同じ話だと思いたがる。', { talk: C.img, talkAmp: 2 });
    C.swap(CH('baron_e_scheme'));
    E.say('baron', 'だが、原因を、一つずつ確かめなければ、答えは出ない。', { talk: C.img, talkAmp: 2, yomi: 'だが、原因を、ひとつずつ確かめなければ、答えは出ない。' });
    E.wait(.5);
  });

  /* ============================================================ S12 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 1717 });
    [['T', P.T_BLUE], ['I', P.I_ORANGE]].forEach(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
    });
    const st = P.sticky(g, '第18章<br>人を信じることと、<br>判断を変えること', { x: 1260, y: 110, w: 580, h: 290, rot: 5, size: 38 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第18章だブー。', { talk: pig, talkAmp: 5, yomi: 'ブヒッ。次は、ダイジューハッショーだブー。' });
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
