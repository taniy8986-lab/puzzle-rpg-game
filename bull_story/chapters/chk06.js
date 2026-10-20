// 完全版 第6章「売りが出ない」（2026年3月19日〜4月10日）
// 台本: story/k/k06_売りが出ない.md　元資料 p6・p13・p14・p20・p28・p29・p35、ユーザー提供の投稿スクリーンショット（2026/10/18）
// 投稿は元資料の要約（本人の見解）。画面のある投稿は、本文の画面と添付画像をそのまま出し（P.postShot）、本文は声のない字幕（E.cap）で出す。
// 有名投資家の名前・ハンドル・アイコンは出さない。元資料の一覧にない投稿（3/26・3/30 11:32・4/3×2・4/7）は1件ずつ「一覧外」の場面にする。
// ブルちゃんの売買はフィクション（3/24 場中に700円で買う。終値は710円）。投稿を見て買う場面は作らない
'use strict';
E.chapter('k06');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;
  const bar = (g, from, to) => P.monthBar(g, { year: 2026, start: 3, months: 2, from, to, x: 460, w: 1000 });
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const box = (g, { x, y, w = 380, h = 200, top = '', main = '', sub = '', c = '#262236', bg = 'rgba(255,255,255,.95)', border = 'none', size = 46 }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: bg, border, boxShadow: '0 12px 24px rgba(0,0,0,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
    `<div style="font:800 28px/1.3 Round;color:#6a6066">${top}</div><div style="font:900 ${size}px/1.35 Zen;color:${c};white-space:nowrap">${main}</div>${sub ? `<div style="font:800 24px/1.35 Round;color:#6a6066;white-space:nowrap">${sub}</div>` : ''}`).ini({ o: 0 });
  const rise = (n, d = 0) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', d); E.sfx('pop', { delay: d, gain: .5 }); };
  const chartTitle = (sc, t) => E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, t);
  const tag = (g, pt, txt, dx, dy, c = '#262236') => E.div(g, { left: pt.x + dx, top: pt.y + dy, padding: '3px 10px', borderRadius: 8, background: 'rgba(255,255,255,.96)', font: '900 17px/1.3 Noto', color: c, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }, txt).ini({ o: 0 });
  const fiction = sc => P.note(sc.root, 'ブルちゃんの売買はフィクションです', { x: 1440, y: 40, size: 24, dark: true });

  // 投稿の画面（ユーザー提供のスクリーンショット）。上に月の帯があるので y 110 から、字幕の帯（850）より上に収める
  const MEMO = '#5a6b88';
  const shot = (g, o) => P.postShot(g, Object.assign({ x: 80, y: 110, h: 730 }, o));
  const enter = (card, d = .4) => { E.tw(card, .45, { o: [0, 1], y: [30, 0] }, 'back', d); E.sfx('notify', { delay: d }); };
  // 添付画像の中の場所を示す黄色い四角の枠（投稿者の手書きの丸と区別するため四角にする）。[x0, y0, x1, y1] は切り出し画像の画素
  const frame = (g, card, i, [x0, y0, x1, y1], d = 0) => {
    // card.at は左の青い縁（12px）を含まないので、その分だけ右へずらす
    const a = card.at(i, x0, y0), b = card.at(i, x1, y1);
    const n = E.div(g, { left: a.x + 12 - 6, top: a.y - 6, width: b.x - a.x + 12, height: b.y - a.y + 12, borderRadius: 8, border: '4px solid #ffd84a', boxShadow: '0 0 14px rgba(255,216,74,.85)', boxSizing: 'border-box' }).ini({ o: 0 });
    E.show(n, .25, d); E.sfx('pop', { delay: d, gain: .35 });
    return n;
  };
  // 右の余白に置く説明の札
  const fact = (g, { x, y, w, html, size = 28 }) => E.div(g, { left: x, top: y, width: w, padding: '12px 20px 14px', borderRadius: 16, background: 'rgba(255,255,255,.95)', font: `900 ${size}px/1.4 Zen`, color: '#262236', boxShadow: '0 8px 18px rgba(0,0,0,.3)', boxSizing: 'border-box' }, html).ini({ o: 0 });
  const small = t => `<div style="font:800 21px/1.35 Round;color:#5a6476">${t}</div>`;
  // 丸の中の売り注文を、画像の時刻ごとに並べた札（値段・株数は添付画像の表示）
  const circledTable = (g, { x, y, w, rows }) => {
    const n = E.div(g, { left: x, top: y, width: w, padding: '14px 20px 16px', borderRadius: 16, background: 'rgba(255,255,255,.95)', boxShadow: '0 8px 18px rgba(0,0,0,.3)', boxSizing: 'border-box' },
      `<div style="font:900 26px/1.3 Zen;color:#262236;margin-bottom:4px">手書きの丸の中の売り注文</div>${small('値段と株数は、それぞれの画像の表示（その時刻の一場面）')}` +
      rows.map(([d, t, v, now]) => `<div style="margin-top:10px;padding-top:8px;border-top:2px solid #e3e8f0;white-space:nowrap"><div style="font:900 22px/1.3 Noto;color:${P.T_BLUE}">${d}　${t}の画像${now ? `<span style="color:#5a6476">（この時の値段 ${now}）</span>` : ''}</div><div style="font:900 27px/1.35 Noto;color:#262236">${v}</div></div>`).join('')).ini({ o: 0 });
    return n;
  };

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

  /* ============================================================ S0 アバン：3月19日の通知 */
  P.phoneScene((ph, sc) => {
    E.bgm('daily', { fadeIn: 1.0, gain: .7 });
    P.lock(ph, { date: '3月19日', week: '木曜日', time: '15:31' });
    const n = P.notice(ph, { title: 'エスポア（3260）', body: '長野県佐久市の<br>蓄電所の売却について', y: 330 });
    P.notifyIn(n, 1.0);
    E.wait(1.6);
    E.narr('3月19日の夕方。エスポアの開示が、また届いた。');
    E.narr('この1か月で、私は、初めてエスポアを買うことになる。');
  }, { name: 'avant_phone', wait: .4 });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 6, title: '売りが出ない', sub: '2026年3月19日〜4月10日', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 I29 → T18 */
  E.scene({ name: 'i29' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    bar(g, [3, 1], [3, 19]);
    const i29 = P.icard(g, { id: 'I29', when: '2026/3/19 15:30', session: '引け後', title: '長野・完成後引渡し案件', text: '長野県佐久市の蓄電所売却を決議。<br>完成・引渡しは6月予定、2027年2月期に収益計上見込み', note: '金額は非公表で3,000万円以上', x: 260, y: 120, w: 1400, size: 32 });
    E.tw(i29, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '3月19日、15時30分。会社は、長野県佐久市の、蓄電所の売却を決議したと、公表した。', { yomi: '3月19日、15時30分。会社は、ながのけん、さくしの、ちくでんしょの売却を決議したと、公表した。' });
    E.say('hat', 'この蓄電所は、まだ完成していない。完成と、買い手への引渡しは、6月の予定だ。', { yomi: 'この、ちくでんしょは、まだ完成していない。完成と、買い手への、ひきわたしは、6月の予定だ。' });
    E.say('hat', '収益は、2027年2月期に、計上する見込みだ。', { yomi: '収益は、2027年2月期に、けいじょうする見込みだ。' });
    E.say('hat', '計上は、売上などを、決算の数字に入れることだ。', { yomi: 'けいじょうは、うりあげなどを、決算の数字に入れることだ。' });
    E.say('hat', '2027年2月期は、2026年3月に始まって、2027年2月末に終わる、1年間の決算だ。', { yomi: '2027年2月期は、2026年3月に始まって、2027年2月末に終わる、いちねんかんの決算だ。' });
    E.say('hat', '売却の金額は、公表されていない。会社は、3,000万円以上だ、と説明している。', { yomi: '売却の金額は、こうひょうされていない。会社は、さんぜんまんえん以上だ、と説明している。' });
    E.say('hat', 'カードの引け後は、その日の取引が、終わったあと、という意味だ。', { yomi: 'カードの、ひけごは、その日の取引が、終わったあと、という意味だ。' });
    E.tw(i29, .4, { o: 0, y: -30 }, 'in2');
    const tl = P.timeLink(g, { x: 260, y: 150, w: 1400, a: { id: 'I29', time: '15:30', sub: '会社の開示', color: P.I_ORANGE }, b: { id: 'T18', time: '15:35', sub: '投稿', color: P.T_BLUE }, label: '5分後' });
    tl.in(.4);
    const t18 = P.tcard(g, { id: 'T18', when: '2026/3/19 15:35', kind: '事業', session: '引け後', text: '系統用蓄電所の完成案件売却を紹介', note: '会社開示の共有。事業材料と株価反応を分けて表示', x: 300, y: 330, w: 1320, size: 40 });
    E.tw(t18, .45, { o: [0, 1], y: [30, 0] }, 'back', 1.5); E.sfx('notify', { delay: 1.5 });
    E.wait(1.9);
    E.narr('公表の5分後に、投稿があった。この投稿は、元資料の要約だけで、画面はない。', { yomi: '公表の5分後に、投稿があった。この投稿は、もとしりょうの要約だけで、画面はない。' });
    E.say('hat', '元資料の要約では、系統用蓄電所の、完成案件の売却を、紹介した投稿だ。', { yomi: 'もとしりょうの要約では、けいとうようちくでんしょの、かんせいあんけんの売却を、紹介した投稿だ。' });
    E.say('hat', '系統用蓄電所は、電力の送電網につないで、電気をためたり、出したりする施設だ。', { yomi: 'けいとうようちくでんしょは、電力の、そうでんもうにつないで、電気をためたり、出したりする、しせつだ。' });
    E.say('hat', '要約の、完成案件という言葉は、もう完成した、という意味ではない。完成は、6月の予定だ。', { yomi: 'ようやくの、かんせいあんけんという言葉は、もう完成した、という意味ではない。完成は、6月の予定だ。' });
    E.say('hat', '元資料の検証メモは、会社の開示を、共有した投稿だとしている。', { yomi: 'もとしりょうの、けんしょうメモは、会社の開示を、共有した投稿だとしている。' });
    E.say('hat', '検証メモには、事業の材料と、株価の反応を、分けて表示する、とも書いてある。', { yomi: 'けんしょうメモには、事業の材料と、株価の反応を、分けて表示する、とも書いてある。' });
    E.say('hat', '売却が決まった、という会社の話と、そのあとの株価の動きを、別々に扱う、ということだ。', { yomi: 'ばいきゃくが決まった、という会社の話と、そのあとの株価の動きを、べつべつに扱う、ということだ。' });
    E.wait(.3);
  });

  /* ============================================================ S3 3月24日　ブルちゃん、買う */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_buy' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .7 });
    const R = P.room(g);
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 560, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    const tg = E.div(g, { left: 120, top: 120, padding: '10px 28px', borderRadius: 14, background: 'rgba(255,255,255,.9)', color: '#2a2430', font: '900 38px/1.3 Zen', boxShadow: '0 8px 18px rgba(0,0,0,.2)' }, '2026年3月24日').ini({ o: 0 });
    E.pop(tg, .4, .3);
    const memos = [['増資のお金は、払い込まれた（I28）', -3], ['蓄電所の売却を、岡山と長野で決議（I27・I29）', 2], ['債務超過を解消する改善期間は、2月28日まで', -2], ['2026年2月期の決算は、まだ出ていない', 3]].map(([t, r], i) => E.div(g, { left: 990, top: 110 + i * 120, padding: '12px 26px 14px', borderRadius: 16, background: i === 3 ? '#2a2430' : 'rgba(255,255,255,.96)', font: '900 34px/1.3 Zen', color: i === 3 ? '#ffd84a' : '#3a3236', boxShadow: '0 8px 18px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }, t).ini({ o: 0, r }));
    E.wait(.6);
    E.narr('3月24日。私は、自分で集めた材料を、並べてみた。');
    const L = E.narr('増資のお金は、入っていた。蓄電所の売却の発表も、続いていた。', { wait: false });
    [0, 1].forEach(i => { E.tw(memos[i], .35, { o: [0, 1], x: [40, 0] }, 'back', .2 + i * L.dur * .45); E.sfx('slide', { delay: .2 + i * L.dur * .45, gain: .4 }); });
    E.at(L.end);
    const L1 = E.narr('債務超過を解消するための、改善期間は、2月28日で終わっていた。', { wait: false, yomi: 'さいむちょうかを、かいしょうするための、かいぜんきかんは、2月28日で終わっていた。' });
    E.tw(memos[2], .35, { o: [0, 1], x: [40, 0] }, 'back', .3); E.sfx('slide', { delay: .3, gain: .4 });
    E.at(L1.end);
    E.narr('債務超過は、会社の持ち物を全部足しても、借りているものに足りない状態だ。', { yomi: 'さいむちょうかは、会社の持ち物を、全部足しても、借りているものに、足りない状態だ。' });
    const L2 = E.narr('でも、2026年2月期の決算は、まだ出ていない。', { wait: false });
    E.tw(memos[3], .35, { o: [0, 1], x: [40, 0] }, 'back', .3); E.sfx('slide', { delay: .3, gain: .4 });
    E.at(L2.end);
    E.narr('債務超過が解消したかは、決算と監査を待たないと、分からなかった。', { yomi: 'さいむちょうかが、かいしょうしたかは、決算と、かんさを待たないと、分からなかった。' });
    E.narr('ほかにも、分からないことが、たくさんあった。');
    E.wait(.2);
  });

  P.phoneScene((ph, sc) => {
    fiction(sc);
    const scr = ph.screen, sw = ph.sw;
    const form = E.div(scr, { left: 0, top: 0, width: sw, height: 1000, background: '#f4f6f9' });
    E.div(form, { left: 0, top: 70, width: sw, textAlign: 'center', font: '900 30px/1.4 Zen', color: '#22252b' }, '注文の確認');
    E.div(form, { left: 24, top: 150, width: sw - 48, borderRadius: 18, background: '#fff', padding: '22px 24px', font: '800 26px/1.8 Round', color: '#2b2f36', boxShadow: '0 4px 12px rgba(0,0,0,.08)' },
      'エスポア（3260）<br><span style="color:#d22d68;font:900 32px Zen">買い</span>　指値 <b style="font:900 34px Noto">700円</b><br><span style="color:#8b919c;font-size:22px">取引時間中</span>');
    const btn = E.div(form, { left: 60, top: 470, width: sw - 120, height: 90, borderRadius: 45, background: '#d22d68', textAlign: 'center', font: '900 34px/90px Zen', color: '#fff', boxShadow: '0 8px 16px rgba(210,45,104,.35)' }, '注文する');
    E.squash(btn, .12, .3, 1.6); E.sfx('click', { delay: 1.6 });
    const ok = P.order(ph, { name: 'エスポア（3260）　700円', side: '買い', note: '' });
    E.show(ok, .3, 2.0); E.sfx('chime', { delay: 2.1, gain: .6 });
    E.wait(.8);
    E.narr('それでも、私は決めた。少しだけ、買ってみよう、と。');
    E.narr('取引時間の中で、700円で買えた。その日の終値は、710円だった。', { yomi: '取引時間の中で、ななひゃくえんで買えた。その日の、おわりねは、ななひゃくじゅうえんだった。' });
  }, { name: 'bull_order', wait: .4 });

  /* ============================================================ S4 T19・T20　3月25日 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'mar25_chart' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .7 });
    P.slate(g);
    const C = P.chart(g, CHART('06'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, '日足　2026年3月24日・25日');
    P.note(sc.root, '分割後の値段（元資料 p6）', { x: 1540, y: 896, size: 22, dark: true });
    const a = C.at(1808.5, 445.1), b = C.at(1839.5, 396.4), va = C.at(1808.5, 912), vb = C.at(1839.5, 869);
    P.look(sc.cam, { s: 2.0, cx: C.at(1830, 0).x, cy: C.at(0, 640).y, dur: 1.4, delay: .2 });
    const la = tag(g, a, '3/24 終値 710円', -160, 10), lb = tag(g, b, '3/25 終値 805円', -150, -40, '#c62828');
    const lva = tag(g, va, '4,800株', -90, -30), lvb = tag(g, vb, '35,700株', 10, -30, '#2b68d8');
    E.wait(1.6);
    E.say('hat', 'これは、日足のチャートだ。1日の値動きを、1本のローソク足にして、並べている。', { yomi: 'これは、ひあしのチャートだ。いちにちの値動きを、いっぽんの、ローソクあしにして、並べている。' });
    let L = E.say('hat', '次の日、3月25日の終値は、805円。前の日の710円から、上がった。', { wait: false, yomi: '次の日、3月25日の、おわりねは、はっぴゃくごえん。前の日の、ななひゃくじゅうえんから、上がった。' });
    E.pop(la, .3, .2); E.pop(lb, .3, L.dur * .3);
    P.circle(g, { x: b.x, y: b.y, w: 22, h: 22, sw: 3, delay: L.dur * .3, dur: .3 });
    E.at(L.end);
    L = E.say('hat', '売買が成立した株の数、つまり出来高も、4,800株から、35,700株に増えた。', { wait: false, yomi: 'ばいばいが成立した株の数、つまり、できだかも、よんせんはっぴゃくかぶから、さんまんごせんななひゃくかぶに増えた。' });
    E.pop(lva, .3, .2); E.pop(lvb, .3, L.dur * .5);
    E.at(L.end + .3);
  });

  E.scene({ name: 't19' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [3, 24], [3, 25]);
    const t19 = P.tcard(g, { id: 'T19', when: '2026/3/25 11:02', kind: '需給', session: '取引時間内', text: '買いの増加よりも売りが出ない形と評価', note: '同日終値805円、出来高35,700株。売り注文の全量を独立に検証できるデータは未取得', x: 260, y: 120, w: 1400, size: 40 });
    E.tw(t19, .45, { o: [0, 1], x: [60, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.narr('3月25日の、11時02分の投稿。これも、元資料の要約だけで、画面はない。', { yomi: '3月25日の、11時2分の投稿。これも、もとしりょうの要約だけで、画面はない。' });
    E.say('hat', '元資料の要約では、買いが増えたというより、売りが出ない形だ、という見方を書いた投稿だ。', { yomi: 'もとしりょうの要約では、買いが増えたというより、売りが出ない形だ、という見方を書いた投稿だ。' });
    E.say('hat', '区分の需給は、買いたい人と、売りたい人の、釣り合いのことだ。', { yomi: 'くぶんの、じゅきゅうは、かいたい、ひとと、うりたい、ひとの、つりあいのことだ。' });
    // 出来高＝成立した売買
    const buy = box(g, { x: 300, y: 430, w: 520, h: 230, top: '買った株', main: '35,700株', c: '#d22d68' });
    const sell = box(g, { x: 1100, y: 430, w: 520, h: 230, top: '売った株', main: '35,700株', c: '#2b68d8' });
    const eq = E.div(g, { left: 820, top: 480, width: 280, textAlign: 'center', font: '900 90px/1.2 Zen', color: '#ffd84a' }, '＝').ini({ o: 0 });
    const cap = E.div(g, { left: 0, top: 690, width: W, textAlign: 'center', font: '900 34px/1.3 Zen', color: '#f3e6c8' }, '出来高は、売買が成立した株の数（3/25）。買った株と売った株は、同じ数になる').ini({ o: 0 });
    E.tw(t19, .4, { y: -20, s: .92 }, 'inOut');
    const L = E.say('hat', '出来高は、売買が成立した株の数だ。買った株の数と、売った株の数は、必ず同じになる。', { wait: false, yomi: 'できだかは、売買が成立した株の数だ。買った株の数と、売った株の数は、必ず同じになる。' });
    rise(buy, .3); E.pop(eq, .35, L.dur * .5, .5); rise(sell, L.dur * .55); E.show(cap, .3, L.dur * .7);
    E.at(L.end);
    E.say('hat', '出来高に出てくるのは、成立した売買だけだ。', { yomi: 'できだかに出てくるのは、成立した売買だけだ。' });
    E.say('hat', '出されたまま、成立しなかった売り注文の量は、出来高からは分からない。', { yomi: '出されたまま、成立しなかった売り注文の量は、できだかからは分からない。' });
    E.say('hat', '元資料の検証メモは、この日の終値805円と、出来高35,700株を、挙げている。', { yomi: 'もとしりょうの、けんしょうメモは、この日の、おわりね、はっぴゃくごえんと、できだか、さんまんごせんななひゃくかぶを、挙げている。' });
    E.say('hat', 'この2つは、取引が終わった時の数字で、11時2分の投稿より、あとに決まった。', { yomi: 'この、ふたつは、取引が終わった時の数字で、11時2分の投稿より、あとに決まった。' });
    E.say('hat', '検証メモは、そのうえで、こう書いている。', { yomi: 'けんしょうメモは、そのうえで、こう書いている。' });
    E.say('hat', '売り注文が、全部でどれだけあったかを、別に確かめられるデータは、取れていない。', { yomi: '売り注文が、全部でどれだけあったかを、べつに確かめられるデータは、取れていない。' });
    E.say('hat', 'だから、売りが出ない形だったかどうかを、別のデータで確かめることは、できていない。');
    E.wait(.3);
  });


  /* ------------------------------------------------------------ T20（P01）投稿の画面　3月25日 13:33 */
  E.scene({ name: 't20' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [3, 25], [3, 25]);
    const card = shot(g, { id: 'T20', when: '2026/3/25 13:33', text: 'p01_text', imgs: ['p01_img'],
      rows: [{ label: '元資料の要約', text: '守られる価格帯が700円から800円へ上がったと評価' }, { label: '検証メモ', text: '当日安値720円。800円が終日維持されたという意味には置き換えない。', show: false }] });
    enter(card);
    // 右の物差し（3月25日の値段の位置）。767・797〜810・720 は 13:31 の画像、805 は元資料の終値
    const RX = 1480, ry = v => 540 - (v - 700) * 3.0;
    const rt = E.div(g, { left: 1250, top: 92, width: 630, textAlign: 'center', font: '900 28px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '3月25日の値段の位置').ini({ o: 0 });
    const rb = E.div(g, { left: RX, top: ry(830), width: 8, height: ry(700) - ry(830), borderRadius: 4, background: 'rgba(243,230,200,.6)' }).ini({ o: 0 });
    const band = E.div(g, { left: RX - 30, top: ry(810), width: 68, height: ry(797) - ry(810), borderRadius: 6, background: 'rgba(255,216,74,.55)', border: '2px solid #ffd84a', boxSizing: 'border-box' }).ini({ o: 0 });
    const lband = E.div(g, { left: RX + 50, top: ry(810) - 14, font: '900 28px/1.25 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '売り注文　797〜810円<div style="font:800 20px/1.3 Round;color:#f3e6c8">13:31の画像の、手書きの丸の中</div>').ini({ o: 0 });
    const dot = (v, c) => E.div(g, { left: RX - 10, top: ry(v) - 14, width: 28, height: 28, borderRadius: '50%', background: c, boxShadow: '0 0 0 5px rgba(255,255,255,.9)' }).ini({ o: 0 });
    const d767 = dot(767, '#f3e6c8'), d720 = dot(720, '#c62828'), d805 = dot(805, '#2b68d8');
    const l767 = E.div(g, { left: RX + 50, top: ry(767) - 22, font: '900 30px/1.3 Noto', color: '#f3e6c8', whiteSpace: 'nowrap' }, '13:31の値段　767円').ini({ o: 0 });
    const l720 = E.div(g, { left: RX + 50, top: ry(720) - 22, font: '900 30px/1.3 Noto', color: '#ff8a8a', whiteSpace: 'nowrap' }, '安値　720円<div style="font:800 20px/1.3 Round;color:#f3e6c8">13:31の画像では、始値と同じ値段</div>').ini({ o: 0 });
    const l805 = E.div(g, { left: 1196, top: ry(805) - 66, width: RX - 1196 - 44, textAlign: 'right', font: '900 30px/1.3 Noto', color: '#9ec5f0', whiteSpace: 'nowrap' }, '終値　805円<div style="font:800 20px/1.3 Round;color:#f3e6c8">元資料</div>').ini({ o: 0 });
    E.wait(1.0);
    E.narr('同じ日の、13時33分の投稿。この投稿は、画面で見ることができる。');
    E.cap('先週まで防御ライン700やったのに1週間もせんうちに800ですか\nそれだけ売り物ないってこと', { dur: 7.0 });
    E.say('hat', 'この投稿は、板の画面を1枚付けて、800円のあたりの値段について、書いたものだ。', { yomi: 'この投稿は、いたの画面を、いちまい付けて、はっぴゃくえんのあたりの値段について、書いたものだ。' });
    E.say('hat', '板は、売りと買いの注文を、値段ごとに並べた表だ。', { yomi: 'いたは、うりと、かいの注文を、ねだんごとに、ならべた、ひょーだ。' });
    E.say('hat', 'まだ売買が成立していない注文が、どの値段に、何株あるかが分かる。', { yomi: 'まだ、ばいばいが成立していない注文が、どの値段に、なんかぶあるかが分かる。' });
    E.say('hat', '元資料の要約では、守られる値段の帯が、700円から800円へ上がった、という見方だ。', { yomi: 'もとしりょうの要約では、守られる値段の帯が、ななひゃくえんから、はっぴゃくえんへ上がった、という見方だ。' });
    E.say('hat', '守られる値段の帯は、そこより下には、下がりにくい値段のあたり、という意味だ。', { yomi: 'まもられる、ねだんの帯は、そこより下には、さがりにくい、ねだんのあたり、という意味だ。' });
    E.say('hat', '付いている画面は、13時31分の板だ。投稿の2分前になる。', { yomi: '付いている画面は、13時31分の、いただ。投稿の、にふんまえになる。' });
    let L = E.say('hat', 'この時点の値段は、767円だった。', { wait: false, yomi: 'この時点の値段は、ななひゃくろくじゅうななえんだった。' });
    frame(g, card, 0, [8, 186, 445, 272], .3);
    E.show(rt, .3, .5); E.show(rb, .3, .5); E.pop(d767, .35, L.dur * .55, .5); E.show(l767, .3, L.dur * .6);
    E.at(L.end);
    E.say('hat', '手書きの丸は、767円より上に並んだ、売り注文を囲んでいる。', { yomi: '手書きの丸は、ななひゃくろくじゅうななえんより上に並んだ、売り注文を囲んでいる。' });
    L = E.say('hat', '797円から810円のあたりだ。', { wait: false, yomi: 'ななひゃくきゅうじゅうななえんから、はっぴゃくじゅうえんのあたりだ。' });
    E.show(band, .4, .2); E.show(lband, .3, .3); E.sfx('pop', { delay: .2, gain: .4 });
    E.at(L.end);
    L = E.say('hat', '13時31分の時点の高値は、799円。800円では、まだ売買が成立していなかった。', { wait: false, yomi: '13時31分の時点の、たかねは、ななひゃくきゅうじゅうきゅうえん。はっぴゃくえんでは、まだ売買が成立していなかった。' });
    frame(g, card, 0, [6, 364, 190, 406], .4);
    E.at(L.end);
    L = E.say('hat', 'この画像では、始値も安値も、720円。この日の安値は、朝の始まりの値段だった。', { wait: false, yomi: 'この画像では、はじめねも、やすねも、ななひゃくにじゅうえん。この日の、やすねは、朝の始まりの値段だった。' });
    frame(g, card, 0, [6, 416, 190, 456], .3); frame(g, card, 0, [240, 364, 425, 406], .5);
    E.pop(d720, .35, L.dur * .5, .5); E.show(l720, .3, L.dur * .55);
    E.at(L.end);
    E.show(card.rows[1], .3, .1);
    E.say('hat', '元資料の検証メモは、この日の安値が720円で、800円より下だったことを挙げている。', { delay: .2, yomi: 'もとしりょうの、けんしょうメモは、この日の、やすねが、ななひゃくにじゅうえんで、はっぴゃくえんより下だったことを挙げている。' });
    E.say('hat', 'そのうえで、800円が一日中守られた、という意味には読み替えない、としている。', { yomi: 'そのうえで、はっぴゃくえんが、いちにちじゅう守られた、という意味には、読み替えない、としている。' });
    L = E.say('hat', 'その日の終値は、805円だった。', { wait: false, yomi: 'その日の、おわりねは、はっぴゃくごえんだった。' });
    E.pop(d805, .35, .3, .5); E.show(l805, .3, .4);
    E.at(L.end);
    E.say('hat', 'ただ、丸の中の売り注文を、誰が出したのかは、確認できない。');
    E.say('hat', 'この画像は、13時31分の板の、その一瞬だけを写したものだ。', { yomi: 'この画像は、13時31分の、いたの、その、いっしゅんだけを写したものだ。' });
    E.say('hat', '約定は、出ていた注文が、実際に売買として成立することだ。', { yomi: 'やくじょうは、出ていた注文が、実際に、ばいばいとして成立することだ。' });
    E.say('hat', '丸の中の注文が、そのあと約定したのか、取り消されたのかは、この画像からは、分からない。', { yomi: '丸の中の注文が、そのあと、やくじょうしたのか、取り消されたのかは、この画像からは、分からない。' });
    E.say('hat', 'その日一日の、板の動きのデータは、元資料にもない。', { yomi: 'その日いちにちの、いたの動きのデータは、もとしりょうにもない。' });
    const call = P.eveCall(g, ['normal', 'surprise'], { x: 1560, y: 600, w: 320, h: 240 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '13時31分の画像だと、800円は、値段より上の、売り注文が並ぶところだったんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: '13時31分の画像だと、はっぴゃくえんは、値段より上の、売り注文が並ぶところだったんだねー。' });
    E.wait(.3);
  });

  /* ============================================================ S5 ブルちゃん（含み益） */
  P.phoneScene((ph, sc) => {
    fiction(sc);
    const scr = ph.screen, sw = ph.sw;
    E.div(scr, { left: 0, top: 0, width: sw, height: 1000, background: '#f4f6f9' });
    E.div(scr, { left: 0, top: 70, width: sw, textAlign: 'center', font: '900 30px/1.4 Zen', color: '#22252b' }, '保有している株');
    const card = E.div(scr, { left: 24, top: 150, width: sw - 48, borderRadius: 18, background: '#fff', padding: '22px 24px', font: '800 26px/1.8 Round', color: '#2b2f36', boxShadow: '0 4px 12px rgba(0,0,0,.08)' });
    E.div(card, { left: 24, top: 20, font: '900 30px/1.4 Zen', color: '#22252b' }, 'エスポア（3260）');
    E.div(card, { left: 24, top: 80, font: '800 24px/1.6 Round', color: '#6a6066' }, '取得単価　700円');
    const now = E.text(card, { left: 24, top: 130, font: '900 52px/1.2 Noto', color: '#d22d68' }, '710円');
    E.div(card, { left: 0, top: 0, width: 1, height: 230 });
    E.set(now, { line: E.line('805円') }, 1.4); E.sfx('rise', { delay: 1.4, gain: .5 });
    E.wait(.8);
    E.narr('私の700円の株は、1日で805円になった。', { yomi: '私の、ななひゃくえんの株は、いちにちで、はっぴゃくごえんになった。' });
    E.narr('うれしかった。でも、なぜ上がったのかは、自分でも、うまく説明できなかった。');
  }, { name: 'bull_gain', wait: .4 });

  /* ============================================================ S6a 3月26日の投稿（一覧外・P02） */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'p02' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    bar(g, [3, 25], [3, 26]);
    const card = shot(g, { id: '一覧外', listed: false, when: '2026/3/26（画像 13:55）', text: 'p02_text', imgs: ['p02_img'],
      rows: [{ label: '確認メモ', color: MEMO, text: '元資料の投稿の一覧（50件）にない投稿。投稿の時刻は画面に出ていない。添付画像の時刻は13:55。' },
        { label: '確認メモ', color: MEMO, show: false, text: '13:55の画像では始値803円・安値741円で、その差の62円が下ヒゲ。大きく出ている834円は13:55の値段で、終値ではない。' }] });
    enter(card);
    const FX = 1270, FW = 600;
    const f1 = fact(g, { x: FX, y: 150, w: FW, html: '13:55の画像　始値 803円・安値 741円' + small('高値 850円も、13:55の時点の値') });
    const f2 = fact(g, { x: FX, y: 300, w: FW, html: '始値と安値の差の 62円が、下ヒゲ' + small('下ヒゲは、ローソク足の太い部分の下に伸びた、細い線（一般的な説明）') });
    const f3 = fact(g, { x: FX, y: 450, w: FW, html: '834円は、13:55の値段' + small('この日の終値ではない。3月26日の終値は、元資料の本文に載っていない') });
    E.wait(1.0);
    E.narr('次の日、3月26日の投稿。これは、元資料の投稿の一覧には、載っていない。', { yomi: '次の日、3月26日の投稿。これは、もとしりょうの、投稿の一覧には、載っていない。' });
    E.cap('今日の下ヒゲ\n短期組の投げが作ってくれたw', { dur: 4.6 });
    E.say('hat', 'この投稿は、日足のチャートの画面を付けて、この日の下ヒゲについて、書いたものだ。', { yomi: 'この投稿は、ひあしのチャートの画面を付けて、この日の、したヒゲについて、書いたものだ。' });
    E.say('hat', '下ヒゲは、ローソク足の、太い部分の下に伸びた、細い線だ。', { yomi: 'したヒゲは、ローソクあしの、ふとい部分の、したに伸びた、ほそい線だ。' });
    E.say('hat', 'その日、値段が一度下がってから、戻ったことを表す。', { yomi: 'その日、ねだんが、いちど下がってから、戻ったことを表す。' });
    E.say('hat', '投稿の時刻は、画面に出ていない。');
    let L = E.say('hat', '添付の画像に出ている時刻は、13時55分だ。', { wait: false });
    frame(g, card, 0, [12, 222, 482, 312], .4);
    E.at(L.end);
    L =E.say('hat', '13時55分の画像では、始値が803円、安値が741円。', { wait: false, yomi: '13時55分の画像では、はじめねが、はっぴゃくさんえん、やすねが、ななひゃくよんじゅういちえん。' });
    frame(g, card, 0, [238, 503, 650, 549], .3); rise(f1, L.dur * .4);
    E.at(L.end);
    L = E.say('hat', '始値と安値の差の、62円が、この時点の下ヒゲだ。', { wait: false, yomi: 'はじめねと、やすねの差の、ろくじゅうにえんが、この時点の、したヒゲだ。' });
    frame(g, card, 0, [612, 676, 698, 1030], .3); rise(f2, L.dur * .5);
    E.at(L.end);
    E.say('hat', 'この日は、803円で始まり、741円まで下がった。', { yomi: 'この日は、はっぴゃくさんえんで始まり、ななひゃくよんじゅういちえんまで下がった。' });
    E.say('hat', 'そこから戻って、13時55分には、834円になっていた。', { yomi: 'そこから戻って、13時55分には、はっぴゃくさんじゅうよえんになっていた。' });
    E.show(card.rows[1], .3, .1);
    L = E.say('hat', '画面に大きく出ている834円は、13時55分の値段で、この日の終値ではない。', { wait: false, delay: .2, yomi: '画面に大きく出ている、はっぴゃくさんじゅうよえんは、13時55分の値段で、この日の、おわりねではない。' });
    rise(f3, L.dur * .5);
    E.at(L.end);
    E.say('hat', '3月26日の終値は、元資料の本文には、載っていない。', { yomi: '3月26日の、おわりねは、もとしりょうの本文には、載っていない。' });
    E.say('hat', '13時55分の時点で、下ヒゲがあったことは、この画像で確かめられる。', { yomi: '13時55分の時点で、したヒゲがあったことは、この画像で確かめられる。' });
    E.say('hat', 'でも、安値のあたりで、誰が、どんな理由で売ったのかは、値段の画面からは、確認できない。', { yomi: 'でも、やすねのあたりで、誰が、どんな理由で売ったのかは、値段の画面からは、確認できない。' });
    E.wait(.3);
  });

  /* ============================================================ S6b T21（P03）　3月27日 11:22 */
  E.scene({ name: 't21' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [3, 26], [3, 27]);
    const card = shot(g, { id: 'T21', when: '2026/3/27 11:22（最終更新）', text: 'p03_text', imgs: ['p03_img'],
      rows: [{ label: '元資料の要約', text: '市場に出る株は5万～10万株程度と推測' }, { label: '検証メモ', text: '発行株数と浮動株の推定を区別。日々の約定株数から固定保有量は逆算できない。', show: false }] });
    enter(card);
    E.wait(1.0);
    E.narr('3月27日の投稿。元資料の一覧では、11時22分の投稿だ。', { yomi: '3月27日の投稿。もとしりょうの一覧では、11時22分の投稿だ。' });
    E.narr('これも、画面がある。本文が長いので、順に出す。');
    E.cap('エスポアの特徴として発行株式が570万程\nちょうど海帆の1/10程海帆の板と見比べたらよくわかるけど', { dur: 6.4 });
    E.cap('海帆も浮動株が吸収されて続け発行株式の割には薄板ではあるが', { dur: 5.0 });
    E.cap('仕上がったエスポアは完全に浮動株が吸い上げられて\n5万から10万程しかマーケットに出てないやろ', { dur: 6.6 });
    E.cap('尚且つ名証だからパン信がいない', { dur: 3.6 });
    E.say('hat', 'この投稿は、エスポアと海帆の、2つの板の画面を付けている。', { yomi: 'この投稿は、エスポアと海帆の、ふたつの、いたの画面を付けている。' });
    E.say('hat', '右の画像の海帆は、東証、つまり東京証券取引所に上場している、別の会社だ。', { yomi: 'みぎの画像の海帆は、とうしょう、つまり、とうきょうしょうけんとりひきじょに、じょうじょうしている、べつの会社だ。' });
    E.say('hat', '書いているのは、エスポアの株の数と、市場に出ている株の量についてだ。');
    E.say('hat', '画面の11時22分は、最後に編集された時刻だ。最初に投稿された時刻は、画面に出ていない。');
    E.say('hat', '元資料の要約では、市場に出る株は、5万から10万株くらいだ、という推測を書いた投稿だ。', { yomi: 'もとしりょうの要約では、市場に出る株は、ごまんから、じゅうまんかぶくらいだ、という推測を書いた投稿だ。' });
    E.say('hat', '本文の浮動株は、大株主などが長く持つ株を除いた、売り買いされやすい株だ。', { yomi: 'ほんぶんの、ふどうかぶは、おおかぶぬしなどが、長く持つ株を、のぞいた、売り買いされやすい株だ。' });
    let L = E.say('hat', '左の画像は、11時5分のエスポアの板。値段は875円、この時点の高値は890円だった。', { wait: false, yomi: '左の画像は、11時5分の、エスポアの、いた。値段は、はっぴゃくななじゅうごえん、この時点の、たかねは、はっぴゃくきゅうじゅうえんだった。' });
    frame(g, card, 0, [4, 126, 300, 190], .3); frame(g, card, 0, [4, 243, 114, 282], L.dur * .55);
    E.at(L.end);
    E.say('hat', '画像で確かめられるのは、11時5分に、どの値段に、どれだけの注文が出ていたか、までだ。');
    L = E.say('hat', 'エスポアの板に見えている売り注文は、890円から922円までで、合わせて9,000株だ。', { wait: false, yomi: 'エスポアの、いたに見えている売り注文は、はっぴゃくきゅうじゅうえんから、きゅうひゃくにじゅうにえんまでで、合わせて、きゅうせんかぶだ。' });
    frame(g, card, 0, [4, 384, 376, 714], .3);
    E.at(L.end);
    E.say('hat', 'ただ、板に出ているのは、その時に出されていた注文だけだ。', { yomi: 'ただ、いたに出ているのは、その時に出されていた注文だけだ。' });
    E.say('hat', '売らずに持たれている株が、どれだけあるかは、板からは分からない。', { yomi: '売らずに持たれている株が、どれだけあるかは、いたからは分からない。' });
    E.show(card.rows[1], .3, .1);
    E.say('hat', '元資料の検証メモは、2つの数を、分けて考える、としている。', { delay: .2, yomi: 'もとしりょうの、けんしょうメモは、ふたつの数を、分けて考える、としている。' });
    E.say('hat', '発行されている株の数と、市場に出てくる株の推定だ。');
    E.wait(.3);
  });

  E.scene({ name: 't21_check' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '発行されている株の数と、市場に出る株の推定', 60);
    E.show(tt, .3);
    const b1 = box(g, { x: 240, y: 190, w: 640, h: 270, top: '会社の開示から計算した、発行株式の数', main: '574.2万株', sub: '分割後の565.2万株に、増資の9万株を足した数', c: '#b8651a', size: 54 });
    const b2 = box(g, { x: 1040, y: 190, w: 640, h: 270, top: '本人の推測', main: '5万〜10万株', sub: '市場に出ている株の量', c: '#2b68d8', size: 54 });
    const ne = E.div(g, { left: 880, top: 260, width: 160, textAlign: 'center', font: '900 90px/1.2 Zen', color: '#ffd84a' }, '≠').ini({ o: 0 });
    E.wait(.3);
    let L = E.say('hat', '本文の、発行株式が570万程、という数は、会社の開示の数字と、ほぼ合う。', { wait: false, yomi: '本文の、はっこうかぶしきが、ごひゃくななじゅうまんほど、という数は、会社の開示の数字と、ほぼ合う。' });
    rise(b1, L.dur * .5);
    E.at(L.end);
    E.say('hat', '分割のあとの565.2万株に、増資の9万株を足すと、574.2万株になる。', { yomi: '分割のあとの、ごひゃくろくじゅうごてんにまんかぶに、増資の、きゅうまんかぶを足すと、ごひゃくななじゅうよんてんにまんかぶになる。' });
    L = E.say('hat', '一方、5万から10万株しか市場に出ていない、という部分は、本人の推測だ。', { wait: false, yomi: '一方、ごまんから、じゅうまんかぶしか、市場に出ていない、という部分は、本人の推測だ。' });
    E.pop(ne, .35, L.dur * .3, .5); rise(b2, L.dur * .45);
    E.at(L.end);
    E.say('hat', '発行されている株の数と、市場に出てくる株の推定は、別のものだ。');
    const no = panel(g, { x: 240, y: 510, w: 1440, h: 100, size: 34, dark: true, html: '毎日の出来高から、売られずに持たれている株の量は、逆算できない' });
    E.say('hat', '出来高は、その日に成立した売買の数だ。同じ株が、何度も売り買いされることもある。', { yomi: 'できだかは、その日に成立した売買の数だ。同じ株が、何度も売り買いされることもある。' });
    L = E.say('hat', 'だから、毎日の出来高から、売られずに持たれている株の量は、逆算できない。', { wait: false, yomi: 'だから、毎日の、できだかから、売られずに持たれている株の量は、逆算できない。' });
    E.tw(no, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    const p2 = panel(g, { x: 240, y: 630, w: 1440, h: 90, size: 30, html: '海帆の発行株式の数は元資料にないので、「海帆の1/10」という比べ方は確かめられない' });
    L = E.say('hat', '本文の、海帆の10分の1、という比べ方は、ここでは確かめられない。', { wait: false, yomi: '本文の、海帆の、じゅうぶんのいち、という比べ方は、ここでは確かめられない。' });
    E.tw(p2, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('slide', { delay: .3, gain: .4 });
    E.at(L.end);
    E.say('hat', '海帆の発行株式の数が、元資料に載っていないからだ。', { yomi: '海帆の、はっこうかぶしきの数が、もとしりょうに載っていないからだ。' });
    const p3 = panel(g, { x: 240, y: 740, w: 1440, h: 80, size: 30, html: '「名証だから」の一文は、名証の銘柄なので一般信用で売る人がいない、という本人の見方' });
    L = E.say('hat', '最後の、名証だから、という一文も、本人の見方だ。', { wait: false, yomi: '最後の、めいしょうだから、という、いちぶんも、本人の見方だ。' });
    E.tw(p3, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('slide', { delay: .3, gain: .4 });
    E.at(L.end);
    E.say('hat', '名証は、名古屋証券取引所のことだ。エスポアの株は、名証で売買されている。', { yomi: 'めいしょうは、なごやしょうけんとりひきじょのことだ。エスポアの株は、めいしょうで、ばいばいされている。' });
    E.say('hat', '名証の銘柄なので、一般信用で売る人がいない、という見方だ。', { yomi: 'めいしょうの銘柄なので、いっぱんしんようで売る人がいない、という見方だ。' });
    // 言葉の説明（一般的な説明）。上の2枚の札を下げて、その場所に出す
    const defs = E.div(g, { left: 240, top: 510, width: 1440, height: 210, borderRadius: 24, background: '#2a2430', border: '3px solid #ffd84a', boxShadow: '0 12px 24px rgba(0,0,0,.35)', boxSizing: 'border-box', padding: '20px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', font: '900 31px/1.35 Zen', color: '#ffd84a' },
      '<div>信用取引は、証券会社から、お金や株を借りて、売り買いすること</div><div>一般信用は、返す期限などの条件を、証券会社と客が決める、信用取引のやり方</div><div style="font:800 23px/1.3 Round;color:#f3e6c8;text-align:right">一般的な説明</div>').ini({ o: 0 });
    E.hide(no, .3); E.hide(p2, .3);
    L = E.say('hat', '信用取引は、証券会社から、お金や株を借りて、売り買いすることだ。', { wait: false, delay: .2, yomi: 'しんようとりひきは、しょうけんがいしゃから、お金や株を借りて、売り買いすることだ。' });
    E.tw(defs, .4, { o: [0, 1], y: [20, 0] }, 'back', .4); E.sfx('slide', { delay: .4, gain: .4 });
    E.at(L.end);
    E.say('hat', '一般信用は、そのうち、返す期限などの条件を、証券会社と客が決めるやり方だ。', { yomi: 'いっぱんしんようは、そのうち、かえす期限などの条件を、しょうけんがいしゃと、きゃくが決める、やり方だ。' });
    E.say('hat', '一般信用で売る、というのは、この仕組みで株を借りて、売ることを指す。', { yomi: 'いっぱんしんようで売る、というのは、この仕組みで、株を借りて、売ることを指す。' });
    E.say('hat', '一般信用などの売りが、本当にないかどうかは、元資料でも、確かめられていない。', { yomi: 'いっぱんしんようなどの売りが、本当にないかどうかは、もとしりょうでも、確かめられていない。' });
    E.wait(.3);
  });

  /* ============================================================ S7 T22と、細っていく売買 */
  E.scene({ name: 't22' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [3, 27], [3, 30]);
    const t22 = P.tcard(g, { id: 'T22', when: '2026/3/30 10:30', kind: '需給', session: '取引時間内', text: '朝の現物短期売りと市場全体への反応を説明', note: '信用取引ができないとの表現も本人の説明。一般信用・相対貸株等の不存在までは示さない', x: 260, y: 120, w: 1400, size: 40 });
    E.tw(t22, .45, { o: [0, 1], x: [60, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.narr('3月30日、10時30分の投稿。これは、画面がなく、元資料の要約だけがある。', { yomi: '3月30日、10時30分の投稿。これは、画面がなく、もとしりょうの要約だけがある。' });
    E.say('hat', '元資料の要約では、朝に出た、現物株の短期の売りについて、本人が説明した投稿だ。', { yomi: 'もとしりょうの要約では、朝に出た、げんぶつかぶの、短期の売りについて、本人が説明した投稿だ。' });
    E.say('hat', '市場全体の動きへの、反応についても、説明している。', { yomi: 'しじょうぜんたいの動きへの、はんのうについても、説明している。' });
    // 言葉の説明（一般的な説明）
    const def = (y, t) => E.div(g, { left: 300, top: y, width: 1360, padding: '14px 32px', borderRadius: 18, background: '#2a2430', border: '3px solid #ffd84a', boxShadow: '0 12px 24px rgba(0,0,0,.35)', boxSizing: 'border-box', font: '900 28px/1.35 Zen', color: '#ffd84a', whiteSpace: 'nowrap' },
      `${t}<span style="font:800 22px Round;color:#f3e6c8">（一般的な説明）</span>`).ini({ o: 0 });
    const defs = def(656, '現物株は、お金や株を借りずに、自分のお金で買って、持っている株');
    const defs2 = def(748, '相対の貸株は、取引所を通さずに、貸す人と借りる人が直接決める、株の貸し借り');
    let L = E.say('hat', '現物株は、お金や株を借りずに、自分のお金で買って、持っている株のことだ。', { wait: false, yomi: 'げんぶつかぶは、お金や株を借りずに、自分のお金で買って、持っている株のことだ。' });
    E.tw(defs, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('slide', { delay: .3, gain: .4 });
    E.at(L.end);
    const m = P.mark(g, '本人の説明', { x: 300, y: 520, color: P.T_BLUE, size: .75, rot: -6 });
    E.say('hat', '検証メモによると、この投稿には、信用取引ができない、という言い方もある。', { yomi: 'けんしょうメモによると、この投稿には、しんようとりひきができない、という言い方もある。' });
    L = E.say('hat', '検証メモは、それも、本人の説明だ、としている。', { wait: false, yomi: 'けんしょうメモは、それも、本人の説明だ、としている。' });
    P.stampIn(m, L.dur * .4);
    E.at(L.end);
    const no = panel(g, { x: 600, y: 520, w: 1060, h: 110, size: 30, html: '一般信用や相対の貸株などの売りが、ないことまでは示していない' });
    E.say('hat', '元資料の検証メモは、さらに、こう書いている。', { yomi: 'もとしりょうの、けんしょうメモは、さらに、こう書いている。' });
    L = E.say('hat', '一般信用や、相対の貸株などによる売りが、ないことまでは、示していない。', { wait: false, yomi: 'いっぱんしんようや、あいたいの、かしかぶなどによる売りが、ないことまでは、示していない。' });
    E.tw(no, .4, { o: [0, 1], x: [40, 0] }, 'back', .3); E.sfx('slide', { delay: .3 });
    E.at(L.end);
    L = E.say('hat', '相対の貸株は、取引所を通さずに、貸す人と借りる人が、直接決める株の貸し借りだ。', { wait: false, yomi: 'あいたいの、かしかぶは、とりひきじょを通さずに、貸す人と、借りる人が、直接決める、株の、かしかりだ。' });
    E.tw(defs2, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('slide', { delay: .3, gain: .4 });
    E.at(L.end);
    E.say('hat', 'つまり、ほかのやり方で株を借りて売る人が、いないかどうかは、確かめられていない。', { yomi: 'つまり、ほかのやり方で、株を借りて売る人が、いないかどうかは、確かめられていない。' });
    E.wait(.3);
  });

  /* ------------------------------------------------------------ 3月30日 11:32 の投稿（一覧外・P04） */
  E.scene({ name: 'p04' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [3, 30], [3, 30]);
    const card = shot(g, { id: '一覧外', listed: false, when: '2026/3/30 11:32', text: 'p04_text', imgs: ['p04_img'],
      rows: [{ label: '確認メモ', color: MEMO, text: '元資料の投稿の一覧（50件）にない投稿。同じ日の10:30の投稿（T22）とは別の投稿で、3月25日のT20の投稿を引用している。' },
        { label: '確認メモ', color: MEMO, show: false, text: '11:28の画像の丸の中は、910〜914円の売り注文で、合わせて5,100株。注文を出した人と、そのあと約定したか取り消されたかは、確認できない。' }] });
    enter(card);
    const tbl = circledTable(g, { x: 1250, y: 150, w: 630, rows: [['3/25', '13:31', '797〜810円のあたり　約5,000〜5,600株', '767円'], ['3/30', '11:28', '910〜914円　5,100株', '910円']] });
    E.wait(1.0);
    E.narr('同じ3月30日の、11時32分。これも、元資料の一覧にない投稿だ。', { yomi: '同じ3月30日の、11時32分。これも、もとしりょうの一覧にない投稿だ。' });
    E.cap('今度は910で同じ5000株でやっとるなw', { dur: 4.4 });
    E.say('hat', 'この投稿は、板の画面を付けて、910円のあたりの売り注文について、書いたものだ。', { yomi: 'この投稿は、いたの画面を付けて、きゅうひゃくじゅうえんのあたりの、売り注文について、書いたものだ。' });
    E.say('hat', 'そして、3月25日の、13時33分の投稿、T20を、引用している。', { yomi: 'そして、3月25日の、13時33分の投稿、ティーにじゅうを、引用している。' });
    E.say('hat', '引用は、前の投稿を、自分の投稿の中に、付けて見せることだ。');
    E.say('hat', '引用された部分は、ここに出している画面の、切り出しの外にある。');
    E.say('hat', '付いている板の時刻は、11時28分。投稿の4分前だ。', { yomi: '付いている、いたの時刻は、11時28分。投稿の、よんぷんまえだ。' });
    let L = E.say('hat', '11時28分の画像では、値段は910円。この時点の高値は912円、安値は880円だった。', { wait: false, yomi: '11時28分の画像では、値段は、きゅうひゃくじゅうえん。この時点の、たかねは、きゅうひゃくじゅうにえん、やすねは、はっぴゃくはちじゅうえんだった。' });
    frame(g, card, 0, [12, 198, 452, 288], .3); frame(g, card, 0, [6, 382, 186, 484], L.dur * .45);
    E.at(L.end);
    L = E.say('hat', '丸の中は、910円から914円の、売り注文だ。足すと、5,100株になる。', { wait: false, yomi: '丸の中は、きゅうひゃくじゅうえんから、きゅうひゃくじゅうよえんの、売り注文だ。足すと、ごせんひゃくかぶになる。' });
    E.tw(tbl, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .4); E.sfx('slide', { delay: L.dur * .4, gain: .4 });
    E.at(L.end);
    E.say('hat', '本文の5000株に、近い数だ。', { yomi: 'ほんぶんの、ごせんかぶに、近い数だ。' });
    E.say('hat', '引用した、3月25日の画像の丸と、比べてみる。');
    E.say('hat', '3月25日の画像の丸の中は、797円から810円のあたりだった。', { yomi: '3月25日の画像の、丸の中は、ななひゃくきゅうじゅうななえんから、はっぴゃくじゅうえんのあたりだった。' });
    E.say('hat', '株の数は、どの値段の行まで数えるかで、5,000株から5,600株ほどになる。', { yomi: '株の数は、どの値段の、ぎょうまで数えるかで、ごせんかぶから、ごせんろっぴゃくかぶほどになる。' });
    E.say('hat', 'どちらの丸も、中の売り注文は、5,000株ほどで、近い数になっている。', { yomi: 'どちらの丸も、中の売り注文は、ごせんかぶほどで、近い数になっている。' });
    E.show(card.rows[1], .3, .1);
    E.say('hat', 'ただ、どちらの画像も、その時刻の板の、一瞬だけを写したものだ。', { delay: .2, yomi: 'ただ、どちらの画像も、その時刻の、いたの、いっしゅんだけを写したものだ。' });
    E.say('hat', 'この売り注文を、誰が出したのかは、確認できない。');
    E.say('hat', 'そのあと約定したのか、取り消されたのかも、一日分の板のデータがないので、分からない。', { yomi: 'そのあと、やくじょうしたのか、取り消されたのかも、いちにちぶんの、いたのデータがないので、分からない。' });
    E.wait(.3);
  });

  E.scene({ name: 'shrink' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '細っていく売買（出来高）', 44);
    E.show(tt, .3);
    const base = 760, sc2 = .0105;
    const bars = [['3/27', 37700], ['3/30', 11900], ['4/2', 1000]].map(([d, v], i) => {
      const x = 420 + i * 420;
      const b = E.div(g, { left: x, top: base - v * sc2, width: 240, height: v * sc2, borderRadius: '14px 14px 0 0', background: 'linear-gradient(180deg,#7fb0ea,#2b68d8)', transformOrigin: '50% 100%' }).ini({ sy: 0 });
      const lv = E.div(g, { left: x - 80, top: base - v * sc2 - 64, width: 400, textAlign: 'center', font: '900 44px/1.2 Noto', color: '#fff', whiteSpace: 'nowrap' }, `${v.toLocaleString('en-US')}株`).ini({ o: 0 });
      const ld = E.div(g, { left: x - 80, top: base + 16, width: 400, textAlign: 'center', font: '900 36px/1.2 Noto', color: '#f3e6c8' }, d).ini({ o: 0 });
      return { b, lv, ld };
    });
    E.div(g, { left: 300, top: base, width: 1320, height: 6, background: '#f3e6c8' });
    E.wait(.3);
    E.say('hat', '売買が細っていったことは、出来高の数字で、確かめられる。', { yomi: 'ばいばいが、ほそっていったことは、できだかの数字で、確かめられる。' });
    let L = E.say('hat', '3月27日は37,700株。3月30日は11,900株。4月2日は、1,000株だった。', { wait: false, yomi: '3月27日は、さんまんななせんななひゃくかぶ。3月30日は、いちまんせんきゅうひゃくかぶ。4月2日は、せんかぶだった。' });
    bars.forEach((r, i) => { const d = .2 + i * L.dur * .3; E.tw(r.b, .6, { sy: [0, 1] }, 'out', d); E.show(r.lv, .3, d + .4); E.show(r.ld, .3, d); E.sfx('pop', { delay: d, gain: .4 }); });
    E.at(L.end);
    E.say('hat', 'この3つの日の出来高は、元資料が、挙げている数字だ。', { yomi: 'この、みっつの日の、できだかは、もとしりょうが、挙げている数字だ。' });
    E.say('hat', '元資料は、この間の値段を、930円の手前で、持ち合った、と書いている。', { yomi: 'もとしりょうは、この間の値段を、きゅうひゃくさんじゅうえんの手前で、もちあった、と書いている。' });
    E.say('hat', '持ち合いは、値段が、ある幅の中で上下して、大きくは動かないことだ。', { yomi: 'もちあいは、値段が、ある、はばの中で、じょうげして、大きくは動かないことだ。' });
    E.say('hat', '元資料の日足の図では、3月27日の高値は、930円だ。', { yomi: 'もとしりょうの、ひあしの図では、3月27日の、たかねは、きゅうひゃくさんじゅうえんだ。' });
    E.say('hat', 'このあとの、4月3日、7日、8日の高値も、930円だった、と書いてある。', { yomi: 'このあとの、4月3日、なのか、ようかの、たかねも、きゅうひゃくさんじゅうえんだった、と書いてある。' });
    E.say('hat', '値段は、930円を大きく超えずに、その下で、上がったり下がったりした、ということだ。', { yomi: '値段は、きゅうひゃくさんじゅうえんを、大きく超えずに、そのしたで、上がったり、下がったりした、ということだ。' });
    E.say('hat', 'ただ、なぜ売買が減ったのかは、出来高の数字だけでは、分からない。', { yomi: 'ただ、なぜ、ばいばいが減ったのかは、できだかの数字だけでは、分からない。' });
    E.wait(.4);
  });

  /* ------------------------------------------------------------ 4月3日の投稿（一覧外・P05） */
  E.scene({ name: 'p05' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [3, 30], [4, 3]);
    const card = shot(g, { id: '一覧外', listed: false, when: '2026/4/3（最終更新 11:42）', text: 'p05_text', imgs: ['p05_img'],
      rows: [{ label: '確認メモ', color: MEMO, text: '元資料の投稿の一覧（50件）にない投稿。画面の11:42は最後に編集した時刻で、最初に投稿した時刻は画面に出ていない。' },
        { label: '確認メモ', color: MEMO, show: false, text: '添付画像は、どちらも9:00の時点の歩み値と板。867円で700株の売買が1回だけ出ていて、前日比は0円。投稿した時点の値段は、画面からは分からない。' }] });
    enter(card);
    E.wait(1.0);
    E.narr('4月3日の投稿。これも、元資料の一覧にない投稿だ。', { yomi: '4月3日の投稿。これも、もとしりょうの一覧にない投稿だ。' });
    E.cap('調整終わったかな', { dur: 3.0 });
    E.say('hat', 'この投稿は、歩み値と板の、2つの画面を付けている。', { yomi: 'この投稿は、あゆみねと、いたの、ふたつの画面を付けている。' });
    E.say('hat', '本文は、調整という言葉を使った、短い一言だ。', { yomi: 'ほんぶんは、ちょうせいという言葉を使った、短い、ひとことだ。' });
    E.say('hat', '調整は、ふつう、上がったあとに、値段が下がったり、横ばいになったりすることを言う。', { yomi: 'ちょうせいは、ふつう、上がったあとに、値段が下がったり、横ばいになったりすることを言う。' });
    E.say('hat', '画面の11時42分は、最後に編集された時刻だ。最初に投稿された時刻は、画面に出ていない。');
    E.say('hat', '左の歩み値は、売買が成立した時刻と、株の数と、値段の一覧だ。', { yomi: '左の、あゆみねは、売買が成立した時刻と、株の数と、値段の一覧だ。' });
    let L = E.say('hat', '9時の画像では、867円で700株の売買が、1回だけ出ている。', { wait: false, yomi: '9時の画像では、はっぴゃくろくじゅうななえんで、ななひゃくかぶの売買が、いっかいだけ出ている。' });
    frame(g, card, 0, [4, 358, 648, 422], .3);
    E.at(L.end);
    E.say('hat', 'その日の取引が始まった、9時の、最初の売買だ。');
    L = E.say('hat', '画面の前日比は、0円。前の日の終値と、同じ値段だ。', { wait: false, yomi: '画面の、ぜんじつひは、ゼロえん。前の日の、おわりねと、同じ値段だ。' });
    frame(g, card, 0, [190, 158, 646, 228], .3);
    E.at(L.end);
    E.show(card.rows[1], .3, .1);
    E.say('hat', '画像に出ている時刻は9時で、投稿した時刻ではない。', { delay: .2 });
    E.say('hat', '最初に投稿した時刻も、画面に出ていないので、投稿した時点の値段は、分からない。');
    E.say('hat', 'それに、本文の調整が、どの期間の、どんな値動きを指すのかは、本文だけでは分からない。', { yomi: 'それに、ほんぶんの、ちょうせいが、どの期間の、どんな値動きを指すのかは、本文だけでは分からない。' });
    E.wait(.3);
  });

  /* ------------------------------------------------------------ 4月3日 13:03 の投稿（一覧外・P06） */
  E.scene({ name: 'p06' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 3], [4, 3]);
    const card = shot(g, { id: '一覧外', listed: false, when: '2026/4/3 13:03', text: 'p06_text', imgs: ['p06_img'],
      rows: [{ label: '確認メモ', color: MEMO, text: '元資料の投稿の一覧（50件）にない投稿。添付画像は、12:53の板と、価格帯別出来高を重ねた日足。' },
        { label: '確認メモ', color: MEMO, show: false, text: '12:53の時点で895円、高値も895円。丸の中は897〜911円のあたりの売り注文。この日の高値が13:03より前か後かは、分足のデータがないので分からない。' }] });
    enter(card);
    E.wait(1.0);
    E.narr('同じ4月3日の、13時3分。これも、元資料の一覧にない投稿だ。', { yomi: '同じ4月3日の、13時3分。これも、もとしりょうの一覧にない投稿だ。' });
    E.cap('この辺の蓋を抜いたら、価格帯出来高見てもわかる通り、\n重いところをブチ抜くことになる', { dur: 6.4 });
    E.say('hat', 'この投稿は、板と日足の、2つの画面を付けている。', { yomi: 'この投稿は、いたと、ひあしの、ふたつの画面を付けている。' });
    E.say('hat', 'どちらも、12時53分の画面だ。投稿の10分前になる。', { yomi: 'どちらも、12時53分の画面だ。投稿の、じっぷんまえになる。' });
    E.say('hat', '上に並んだ売り注文と、価格帯別の出来高について、書いたものだ。', { yomi: '上に並んだ売り注文と、かかくたいべつの、できだかについて、書いたものだ。' });
    let L = E.say('hat', '12時53分の画像では、値段は895円。この時点の高値も、895円だった。', { wait: false, yomi: '12時53分の画像では、値段は、はっぴゃくきゅうじゅうごえん。この時点の、たかねも、はっぴゃくきゅうじゅうごえんだった。' });
    frame(g, card, 0, [4, 102, 500, 158], .3); frame(g, card, 0, [2, 206, 116, 240], L.dur * .55);
    E.at(L.end);
    E.say('hat', '丸の中は、895円より上の、897円から911円のあたりの、売り注文だ。', { yomi: '丸の中は、はっぴゃくきゅうじゅうごえんより上の、はっぴゃくきゅうじゅうななえんから、きゅうひゃくじゅういちえんのあたりの、売り注文だ。' });
    L = E.say('hat', '右の日足の、横に伸びる棒が、価格帯別の出来高だ。', { wait: false, yomi: '右の、ひあしの、横に伸びる棒が、かかくたいべつの、できだかだ。' });
    frame(g, card, 0, [520, 412, 1014, 838], .4);
    E.at(L.end);
    E.say('hat', 'それぞれの値段のあたりで、どれだけの株が売買されたかを、表している。');
    E.say('hat', 'ただ、どの期間の売買を足した棒なのかは、画面に出ていない。');
    E.show(card.rows[1], .3, .1);
    E.say('hat', '元資料の日足の図では、4月3日の高値は、930円だ。', { delay: .2, yomi: 'もとしりょうの、ひあしの図では、4月3日の、たかねは、きゅうひゃくさんじゅうえんだ。' });
    E.say('hat', 'この日は、12時53分の高値の895円より、上の値段でも、売買が成立した。', { yomi: 'この日は、12時53分の、たかねの、はっぴゃくきゅうじゅうごえんより、上の値段でも、売買が成立した。' });
    E.say('hat', 'でも、930円が付いたのが、13時3分の投稿より前か、後かは、分からない。', { yomi: 'でも、きゅうひゃくさんじゅうえんが付いたのが、13時3分の投稿より前か、後かは、分からない。' });
    E.say('hat', '1分ごとの値段のデータが、元資料にないからだ。', { yomi: 'いっぷんごとの値段のデータが、もとしりょうにないからだ。' });
    E.say('hat', '丸の中の売り注文を、誰が出したのかも、確認できない。');
    E.say('hat', 'そのあと約定したのか、取り消されたのかも、この画像からは分からない。', { yomi: 'そのあと、やくじょうしたのか、取り消されたのかも、この画像からは分からない。' });
    E.wait(.3);
  });

  /* ============================================================ S8 I30　4月6日 */
  E.scene({ name: 'i30' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 3], [4, 6]);
    const i30 = P.icard(g, { id: 'I30', when: '2026/4/6 16:00', session: '引け後', title: '豊橋・完成後引渡し案件', text: '愛知県豊橋市の蓄電所売却を決議。<br>完成・引渡しは9月予定、引渡し時に収益計上予定', note: '完成予定・契約・引渡しを分けて読む', x: 260, y: 120, w: 1400, size: 32 });
    E.tw(i30, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '4月6日、16時の開示。愛知県豊橋市の、蓄電所の売却も、決議された。', { yomi: '4月6日、16時の開示。あいちけん、とよはし市の、ちくでんしょの売却も、決議された。' });
    E.say('hat', '完成と引渡しは、9月の予定。収益は、引き渡した時に、計上する予定だ。', { yomi: '完成と、ひきわたしは、9月の予定。収益は、引き渡した時に、けいじょうする予定だ。' });
    E.tw(i30, .4, { o: 0, y: -30 }, 'in2');
    const head = E.div(g, { left: 360, top: 200, width: 1200, height: 70, display: 'flex', alignItems: 'center', font: '900 30px/1 Zen', color: '#ffd84a' },
      '<span style="width:380px;text-align:center">案件</span><span style="width:380px;text-align:center">公表した日</span><span style="width:440px;text-align:center">完成・引渡しの予定</span>').ini({ o: 0 });
    const rows = [['岡山（I27）', '2/26', '7月'], ['長野（I29）', '3/19', '6月'], ['豊橋（I30）', '4/6', '9月']].map(([a, b, c], i) => E.div(g, { left: 360, top: 290 + i * 130, width: 1200, height: 110, borderRadius: 20, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', font: '900 40px/1 Zen', color: '#262236', boxShadow: '0 10px 20px rgba(0,0,0,.3)' },
      `<span style="width:380px;text-align:center">${a}</span><span style="width:380px;text-align:center;font-family:Noto">${b}</span><span style="width:440px;text-align:center;color:#2b68d8">${c}（予定）</span>`).ini({ o: 0 }));
    let L = E.say('hat', '岡山、長野、豊橋。完成のあとに引き渡す案件が、これで3件だ。', { wait: false, yomi: 'おかやま、ながの、とよはし。完成のあとに引き渡す案件が、これで、さんけんだ。' });
    E.show(head, .3, .1);
    rows.forEach((r, i) => { E.tw(r, .35, { o: [0, 1], x: [-30, 0] }, 'back', .2 + i * L.dur * .22); E.sfx('slide', { delay: .2 + i * L.dur * .22, gain: .4 }); });
    E.at(L.end);
    E.say('hat', 'どれも、完成も引渡しも、これからの予定だ。');
    const sep = panel(g, { x: 260, y: 690, w: 1400, h: 120, size: 30, dark: true, html: '<div style="text-align:center">売却の契約、蓄電所の完成、買い手への引渡しは、それぞれ別の段階<div style="font:800 23px/1.4 Round;color:#f3e6c8">I30の読み方「完成予定・契約・引渡しを分けて読む」（元資料 p20）</div></div>' });
    E.say('hat', '元資料は、完成の予定と、契約と、引渡しを、分けて読む、としている。', { yomi: 'もとしりょうは、完成の予定と、けいやくと、ひきわたしを、わけて読む、としている。' });
    L = E.say('hat', '売却の契約と、蓄電所の完成と、買い手への引渡しは、それぞれ、別の段階だ。', { wait: false, yomi: 'ばいきゃくの、けいやくと、ちくでんしょの完成と、買い手への、ひきわたしは、それぞれ、べつの段階だ。' });
    E.tw(sep, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '売却を決めても、それだけでは、まだ完成も、引渡しも、済んでいない。', { yomi: 'ばいきゃくを決めても、それだけでは、まだ完成も、ひきわたしも、すんでいない。' });
    E.wait(.4);
  });

  /* ------------------------------------------------------------ 4月7日 10:40 の投稿（一覧外・P07） */
  E.scene({ name: 'p07' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 6], [4, 7]);
    const card = shot(g, { id: '一覧外', listed: false, when: '2026/4/7 10:40', text: 'p07_text', imgs: ['p07_img'],
      rows: [{ label: '確認メモ', color: MEMO, text: '元資料の投稿の一覧（50件）にない投稿。添付画像は10:37の板。' },
        { label: '確認メモ', color: MEMO, show: false, text: '10:37の時点で928円、高値930円・安値920円。丸の中は928〜938円の売り注文で、合わせて12,900株。前の日の板は、画像にも元資料にもない。' }] });
    enter(card);
    const tbl = circledTable(g, { x: 1210, y: 110, w: 670, rows: [['3/25', '13:31', '797〜810円のあたり', '767円'], ['3/30', '11:28', '910〜914円', '910円'], ['4/3', '12:53', '897〜911円のあたり', '895円'], ['4/7', '10:37', '928〜938円', '928円']] });
    const tnote = fact(g, { x: 1210, y: 620, w: 670, size: 26, html: 'どれも、その時刻の値段か、それより上に並んだ売り注文' + small('注文を出した人と、そのあと約定したか取り消されたかは、どの画像でも確認できない') });
    E.wait(1.0);
    E.narr('4月7日の、10時40分。これも、元資料の一覧にない投稿だ。', { yomi: '4月7日の、10時40分。これも、もとしりょうの一覧にない投稿だ。' });
    E.cap('お、性懲りも無く今日もやっとんなぁーw', { dur: 4.4 });
    E.say('hat', 'この投稿は、板の画面を付けて、上に並んだ売り注文について、書いたものだ。', { yomi: 'この投稿は、いたの画面を付けて、上に並んだ売り注文について、書いたものだ。' });
    E.say('hat', '板の時刻は、10時37分。投稿の3分前だ。', { yomi: 'いたの時刻は、10時37分。投稿の、さんぷんまえだ。' });
    let L = E.say('hat', '10時37分の画像では、値段は928円。この時点の高値は930円、安値は920円だった。', { wait: false, yomi: '10時37分の画像では、値段は、きゅうひゃくにじゅうハチえん。この時点の、たかねは、きゅうひゃくさんじゅうえん、やすねは、きゅうひゃくにじゅうえんだった。' });
    frame(g, card, 0, [12, 176, 524, 260], .3); frame(g, card, 0, [6, 341, 172, 434], L.dur * .45);
    E.at(L.end);
    E.say('hat', '丸の中は、928円から938円の売り注文。足すと、12,900株になる。', { yomi: '丸の中は、きゅうひゃくにじゅうハチえんから、きゅうひゃくさんじゅうハチえんの売り注文。足すと、いちまんにせんきゅうひゃくかぶになる。' });
    L = E.say('hat', 'これまでの画像の丸を、並べてみる。', { wait: false });
    E.tw(tbl, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('slide', { delay: .3, gain: .4 });
    E.at(L.end);
    L = E.say('hat', 'どれも、その時刻の値段か、それより上に並んだ、売り注文だ。', { wait: false });
    E.tw(tnote, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .4);
    E.at(L.end);
    E.say('hat', 'その時刻の値段が、767円から928円へ上がるのと一緒に、丸の値段も、上がっている。', { yomi: 'その時刻の値段が、ななひゃくろくじゅうななえんから、きゅうひゃくにじゅうハチえんへ上がるのと一緒に、丸の値段も、上がっている。' });
    E.show(card.rows[1], .3, .1);
    E.say('hat', '本文には、今日も、とある。', { delay: .2, yomi: 'ほんぶんには、きょうも、とある。' });
    E.say('hat', 'でも、前の日にも、同じような売り注文が並んでいたかどうかは、確かめられない。');
    E.say('hat', '前の日の板が、この画像にも、元資料にもないからだ。', { yomi: '前の日の、いたが、この画像にも、もとしりょうにもないからだ。' });
    E.say('hat', 'この売り注文を、誰が出したのかも、確認できない。');
    E.say('hat', 'そのあと約定したのか、取り消されたのかも、この一場面の画像からは、分からない。', { yomi: 'そのあと、やくじょうしたのか、取り消されたのかも、この、ひとばめんの画像からは、分からない。' });
    E.wait(.3);
  });

  /* ============================================================ S9 T23　4月8日 */
  E.scene({ name: 't23' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 7], [4, 8]);
    const t23 = P.tcard(g, { id: 'T23', when: '2026/4/8 13:39', kind: 'チャート', session: '取引時間内', text: '930円近辺の売り圧力が和らいだと評価', note: '4月3日から9日の高値は930～931円。4月10日に935円、14日に1,000円へ', x: 260, y: 120, w: 1400, size: 40 });
    E.tw(t23, .45, { o: [0, 1], x: [60, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.narr('4月8日、13時39分の投稿。これは、画面がなく、元資料の要約だけがある。', { yomi: '4月8日、13時39分の投稿。これは、画面がなく、もとしりょうの要約だけがある。' });
    E.say('hat', '元資料の要約では、930円のあたりの売りの圧力が、和らいだ、という見方を書いた投稿だ。', { yomi: 'もとしりょうの要約では、きゅうひゃくさんじゅうえんのあたりの、売りの圧力が、やわらいだ、という見方を書いた投稿だ。' });
    E.say('hat', '売りの圧力は、売り注文が多くて、値段が上がりにくい状態のことだ。', { yomi: 'うりの、あつりょくは、売り注文が多くて、値段が上がりにくい状態のことだ。' });
    E.say('hat', '元資料の検証メモは、投稿の前と、あとの高値を、並べている。', { yomi: 'もとしりょうの、けんしょうメモは、投稿の前と、あとの、たかねを、並べている。' });
    E.wait(.2);
  });

  E.scene({ name: 't23_chart' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('06'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, '日足　2026年4月　930円と、その後');
    P.note(sc.root, '分割後の値段（元資料 p6・p13）', { x: 1500, y: 896, size: 22, dark: true });
    const h10 = C.at(2211.5, 329.8), h14 = C.at(2273.5, 296.5), l930 = C.at(2056.5, 332.4);
    P.look(sc.cam, { s: 1.9, cx: C.at(2160, 0).x, cy: C.at(0, 330).y + 30, dur: 1.4, delay: .2 });
    const lb = E.div(sc.root, { left: 1180, top: 110, padding: '8px 20px', borderRadius: 12, background: 'rgba(255,255,255,.96)', font: '900 30px/1.3 Noto', color: '#262236', whiteSpace: 'nowrap', boxShadow: '0 6px 14px rgba(0,0,0,.3)' }, '<span style="color:#d9a400">━</span> 4/3〜4/9 の高値　930〜931円').ini({ o: 0 });
    const br = E.div(g, { left: C.at(2040, 0).x, top: l930.y - 4, width: C.at(2196, 0).x - C.at(2040, 0).x, height: 8, borderRadius: 4, background: '#ffd84a', boxShadow: '0 0 10px rgba(255,216,74,.9)', transformOrigin: '0 50%' }).ini({ sx: 0 });
    const t10 = tag(g, h10, '4/10 高値 935円', -150, -42, '#c62828'), t14 = tag(g, h14, '4/14 高値 1,000円', -60, -44, '#c62828');
    E.wait(1.6);
    let L = E.say('hat', '4月3日から9日の高値は、930円から931円。', { wait: false, yomi: '4月3日から9日の高値は、きゅうひゃくさんじゅうえんから、きゅうひゃくさんじゅういちえん。' });
    E.pop(lb, .3, .3); E.tw(br, .6, { sx: [0, 1] }, 'out', .3);
    E.at(L.end);
    L = E.say('hat', 'そのあと、4月10日に935円、14日に1,000円をつけた。', { wait: false, yomi: 'そのあと、4月10日に、きゅうひゃくさんじゅうごえん、14日に、せんえんをつけた。' });
    P.circle(g, { x: h10.x, y: h10.y, w: 22, h: 22, sw: 3, delay: .3, dur: .3 }); E.pop(t10, .3, .4);
    P.circle(g, { x: h14.x, y: h14.y, w: 22, h: 22, sw: 3, delay: L.dur * .55, dur: .3 }); E.pop(t14, .3, L.dur * .6);
    E.at(L.end);
    E.say('hat', '930円より上でも、売買が成立した。', { yomi: 'きゅうひゃくさんじゅうえんより上でも、売買が成立した。' });
    E.say('hat', '元資料の検証結果は、この値動きを、投稿の見方と比べて、合っている、とした。', { yomi: 'もとしりょうの、けんしょうけっかは、この値動きを、投稿の見方と比べて、合っている、とした。' });
    E.say('hat', 'ただ、見方と値動きが合っていても、投稿が値動きの原因だった、という証明にはならない。', { yomi: 'ただ、見方と、値動きが合っていても、投稿が、値動きの原因だった、という証明にはならない。' });
    const no = E.div(sc.root, { left: 300, top: 736, width: 1320, height: 100, borderRadius: 22, background: '#2a2430', border: '3px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 32px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '誰が売っていたのか、どれだけ買われて吸収されたのかは、確認できていない').ini({ o: 0 });
    L = E.say('hat', 'ただ、誰が売っていたのかは、元資料でも、確認できていない。', { wait: false, yomi: 'ただ、誰が売っていたのかは、もとしりょうでも、確認できていない。' });
    E.tw(no, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', 'どれだけの売りが、買われて吸収されたのかも、日足と出来高からは分からない。', { yomi: 'どれだけの売りが、買われて吸収されたのかも、ひあしと、できだかからは分からない。' });
    E.say('hat', '日足と出来高が示すのは、成立した売買の、値段と株の数だけだからだ。', { yomi: 'ひあしと、できだかが示すのは、成立した売買の、値段と、株の数だけだからだ。' });
    E.wait(.4);
  });

  /* ============================================================ S10 累計出来高の表 */
  E.scene({ name: 'cumvol' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '累計出来高の表（元資料 p14 の1行）', 44);
    E.show(tt, .3);
    const cols = [['対象期間', '03/18〜04/20', 340], ['価格変化', '+38.43%', 250], ['上昇日', '33.06', 220], ['下落日', '12.49', 220], ['変わらず', '1.98', 220], ['総出来高', '47.53', 230]];
    let x = 160;
    const cells = cols.map(([h, v, w], i) => {
      const n = E.div(g, { left: x, top: 220, width: w - 10, height: 230, borderRadius: 18, background: i === 2 ? '#fdecec' : 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,.3)' },
        `<div style="font:800 28px/1.3 Round;color:#6a6066;padding-top:34px">${h}</div><div style="font:900 44px/1.6 Noto;color:${i === 1 ? '#c62828' : i === 2 ? '#c62828' : '#262236'}">${v}</div>`).ini({ o: 0 });
      x += w; return n;
    });
    E.div(g, { left: 160, top: 470, width: 1500, textAlign: 'right', font: '800 24px/1.3 Round', color: 'rgba(243,230,200,.8)' }, '単位：万株（分割調整後）。全期間とも2026年');
    E.wait(.3);
    let L = E.say('hat', '累計出来高は、ある期間の、毎日の出来高を、足し合わせた数だ。', { wait: false, yomi: 'るいけい、できだかは、ある期間の、毎日の、できだかを、足し合わせた数だ。' });
    cells.forEach((c, i) => { E.tw(c, .35, { o: [0, 1], y: [20, 0] }, 'back', .2 + i * L.dur * .12); E.sfx('pop', { delay: .2 + i * L.dur * .12, gain: .35 }); });
    E.at(L.end);
    E.say('hat', 'この表は、それを、上がった日、下がった日、変わらなかった日に、分けて足している。', { yomi: 'この、ひょーは、それを、上がった日、下がった日、変わらなかった日に、分けて足している。' });
    E.say('hat', '総出来高は、その全部を足した数だ。単位は、万株だ。', { yomi: 'そうできだかは、その全部を足した数だ。単位は、まんかぶだ。' });
    E.say('hat', '期間の区切りは、元資料が、あとから、局面に合わせて決めたものだ。', { yomi: '期間の区切りは、もとしりょうが、あとから、きょくめんに合わせて決めたものだ。' });
    const rule = panel(g, { x: 220, y: 540, w: 1480, h: 130, size: 30, html: '<div style="text-align:center">この表の上がった日は、前の日の終値より、高く終わった日<br><span style="font-size:26px">ローソク足の赤と緑は、その日の始値と終値で決めるので、決め方が違う</span></div>' });
    L = E.say('hat', 'ここでの上がった日は、前の日の終値より、高く終わった日。', { wait: false, yomi: 'ここでの上がった日は、前の日の、おわりねより、高く終わった日。' });
    E.tw(rule, .4, { o: [0, 1], y: [20, 0] }, 'back', .2);
    E.at(L.end);
    E.say('hat', 'ローソク足の、赤と緑とは、決め方が違う。', { yomi: 'ローソクあしの、赤と緑とは、決め方が違う。' });
    E.say('hat', 'ローソク足の赤は、その日の終値が、その日の始値と同じか、それより高い日だ。', { yomi: 'ローソクあしの赤は、その日の、おわりねが、その日の、はじめねと同じか、それより高い日だ。' });
    E.say('hat', '比べる相手が違うので、同じ日でも、分け方が変わることがある。', { yomi: 'くらべる相手が違うので、同じ日でも、分け方が変わることがある。' });
    L = E.say('hat', '3月18日から4月20日は、上がった日の出来高が、33.06万株だ。', { wait: false, yomi: '3月18日から4月20日は、上がった日の、できだかが、サンジューサンテンゼロロクまんかぶだ。' });
    P.circle(g, { x: 160 + 340 + 250 + 105, y: 360, w: 200, h: 120, delay: L.dur * .5 });
    E.at(L.end);
    E.say('hat', '下がった日の12.49万株より、大きい。', { yomi: '下がった日の、ジューニテンヨンキューまんかぶより、大きい。' });
    L = E.say('hat', 'この期間の価格変化は、プラス38.43%だ。', { wait: false, yomi: 'この期間の、かかくへんかは、プラス、サンジューハッテンヨンサンパーセントだ。' });
    P.circle(g, { x: 160 + 340 + 125, y: 360, w: 210, h: 120, delay: L.dur * .5 });
    E.at(L.end);
    E.say('hat', '期間の直前の終値から、期間の最後の終値まで、38.43%上がった、ということだ。', { yomi: '期間の、ちょくぜんの、おわりねから、期間の最後の、おわりねまで、サンジューハッテンヨンサンパーセント上がった、ということだ。' });
    E.say('hat', '元資料は、出来高を、こうした値段の動きと一緒に読む、としている。', { yomi: 'もとしりょうは、できだかを、こうした値段の動きと、一緒に読む、としている。' });
    E.hide(rule, .3);
    const no = panel(g, { x: 220, y: 540, w: 1480, h: 150, size: 30, dark: true, html: '同じ株が、何度も売買される。<br>だから、この合計を「売られない株」や「誰かの持ち株」には読み替えられない' });
    no.el.style.flexDirection = 'column'; no.el.style.gap = '6px'; no.el.style.textAlign = 'center';
    E.say('hat', 'ただ、同じ株が、何度も売り買いされる。');
    L = E.say('hat', 'だから、この合計を、売られない株の数や、誰かの持ち株に、読み替えることはできない。', { wait: false });
    E.tw(no, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('ding', { delay: .2, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S11 ブルちゃんの部屋 */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_room' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: '保有', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    const q = E.div(g, { left: 1180, top: 120, padding: '10px 28px', borderRadius: 999, background: 'rgba(255,255,255,.95)', font: '900 40px/1.3 Zen', color: '#3a3236', boxShadow: '0 8px 18px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }, 'なぜ上がっている？').ini({ o: 0, r: -3 });
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 4, delay: .3 });
    E.wait(.6);
    E.narr('値段は、私が買った700円より、上にあった。', { yomi: '値段は、私が買った、ななひゃくえんより、上にあった。' });
    const L = E.narr('でも、私は、なぜ上がっているのかを、まだ説明できなかった。', { wait: false });
    E.pop(q, .4, L.dur * .4, .6); E.sfx('pop', { delay: L.dur * .4, gain: .4 }); E.float(q, 6, 1.6);
    E.at(L.end + .3);
  });

  /* ============================================================ S12 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '買われた株の数だけ、売られた株がある', { left: 120, top: 120, font: '900 64px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .07));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const ss = P.seesaw(paper, { x: 700, y: 640, w: 1000, left: '買い<br>35,700株', right: '売り<br>35,700株', lc: '#d22d68', rc: '#2b68d8' });
    E.wait(2.8);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「買われた株の数だけ、売られた株がある」。', { wait: false, yomi: '買われた株の数だけ、売られた株がある。' });
    E.pop(ss.l, .4, .3, .6); E.pop(ss.r, .4, L.dur * .45, .6); E.sfx('pop', { delay: .3, gain: .4 }); E.sfx('pop', { delay: L.dur * .45, gain: .4 });
    E.at(L.end + 1.0);
  });

  /* ============================================================ S13 男爵 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .75 });
    const C = P.closeup(g, CH('baron_e_scheme'), { bg: 'radial-gradient(ellipse at 50% 40%, #4a1622 0%, #200a10 75%)', imgH: 860, panelBg: 'linear-gradient(180deg,#3a121b,#1a070c)' });
    E.from(C.img, { s: .94, y: 30 }, .6, 0, 'out');
    E.wait(.5);
    E.say('baron', '値段が上がると、人は、買った側だけを見たがる。', { talk: C.img, talkAmp: 2 });
    C.swap(CH('baron_e_normal'));
    E.say('baron', 'だが、買われた株の数だけ、売られた株もあった。', { talk: C.img, talkAmp: 2 });
    E.wait(.5);
  });

  /* ============================================================ S14 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 606 });
    [['T', P.T_BLUE], ['I', P.I_ORANGE]].forEach(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
    });
    const st = P.sticky(g, '第7章<br>決算延期', { x: 1360, y: 120, w: 460, h: 250, rot: 5, size: 48 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第7章だブー。', { talk: pig, talkAmp: 5 });
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
