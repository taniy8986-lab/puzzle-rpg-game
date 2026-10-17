// 完全版 第6章「売りが出ない」（2026年3月19日〜4月10日）
// 台本: story/k/k06_売りが出ない.md　元資料 p6・p13・p14・p20・p28・p29・p35
// 投稿は元資料の要約（本人の見解）。有名投資家の名前・アカウントは出さない。
// ブルちゃんの売買はフィクション（3/24 場中に700円で買う。終値は710円）。投稿を見て買う場面は作らない
'use strict';
E.chapter('k06');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;
  const bar = (g, from, to) => P.monthBar(g, { year: 2026, start: 3, months: 2, from, to, x: 460, w: 1000 });
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const box = (g, { x, y, w = 380, h = 200, top = '', main = '', c = '#262236', bg = 'rgba(255,255,255,.95)', border = 'none', size = 46 }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: bg, border, boxShadow: '0 12px 24px rgba(0,0,0,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
    `<div style="font:800 28px/1.3 Round;color:#6a6066">${top}</div><div style="font:900 ${size}px/1.35 Zen;color:${c};white-space:nowrap">${main}</div>`).ini({ o: 0 });
  const rise = (n, d = 0) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', d); E.sfx('pop', { delay: d, gain: .5 }); };
  const chartTitle = (sc, t) => E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, t);
  const tag = (g, pt, txt, dx, dy, c = '#262236') => E.div(g, { left: pt.x + dx, top: pt.y + dy, padding: '3px 10px', borderRadius: 8, background: 'rgba(255,255,255,.96)', font: '900 17px/1.3 Noto', color: c, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }, txt).ini({ o: 0 });
  const fiction = sc => P.note(sc.root, 'ブルちゃんの売買はフィクションです', { x: 1440, y: 40, size: 24, dark: true });

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
    E.say('hat', '完成と引渡しは、6月の予定。収益は、2027年2月期に計上する見込みだ。', { yomi: '完成と引渡しは、6月の予定。収益は、2027年2月期に、けいじょうする見込みだ。' });
    E.say('hat', '金額は非公表。3,000万円以上、という説明だ。', { yomi: '金額は、ひこうひょう。さんぜんまんえん以上、という説明だ。' });
    E.tw(i29, .4, { o: 0, y: -30 }, 'in2');
    const tl = P.timeLink(g, { x: 260, y: 150, w: 1400, a: { id: 'I29', time: '15:30', sub: '会社の開示', color: P.I_ORANGE }, b: { id: 'T18', time: '15:35', sub: '投稿', color: P.T_BLUE }, label: '5分後' });
    tl.in(.4);
    const t18 = P.tcard(g, { id: 'T18', when: '2026/3/19 15:35', kind: '事業', session: '引け後', text: '系統用蓄電所の完成案件売却を紹介', note: '会社開示の共有。事業材料と株価反応を分けて表示', x: 300, y: 330, w: 1320, size: 40 });
    E.tw(t18, .45, { o: [0, 1], y: [30, 0] }, 'back', 1.5); E.sfx('notify', { delay: 1.5 });
    E.wait(1.9);
    E.narr('公表の5分後に、投稿で共有された。');
    E.say('hat', '会社の開示の共有だ。事業の材料と、株価の反応は、分けて見る。');
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
    const memos = [['増資：払込済み（I28）', -3], ['蓄電所の売却：岡山・長野（I27・I29）', 2], ['改善期間：2/28で終わり', -2], ['決算：まだ出ていない', 3]].map(([t, r], i) => E.div(g, { left: 1000, top: 110 + i * 120, padding: '12px 28px 14px', borderRadius: 16, background: i === 3 ? '#2a2430' : 'rgba(255,255,255,.96)', font: '900 36px/1.3 Zen', color: i === 3 ? '#ffd84a' : '#3a3236', boxShadow: '0 8px 18px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }, t).ini({ o: 0, r }));
    E.wait(.6);
    E.narr('3月24日。私は、自分で集めた材料を、並べてみた。');
    const L = E.narr('増資のお金は、入っていた。蓄電所の売却の発表も、続いていた。', { wait: false });
    [0, 1, 2].forEach(i => { E.tw(memos[i], .35, { o: [0, 1], x: [40, 0] }, 'back', .2 + i * L.dur * .3); E.sfx('slide', { delay: .2 + i * L.dur * .3, gain: .4 }); });
    E.at(L.end);
    const L2 = E.narr('決算は、まだ出ていない。分からないことも、たくさんあった。', { wait: false });
    E.tw(memos[3], .35, { o: [0, 1], x: [40, 0] }, 'back', .3); E.sfx('slide', { delay: .3, gain: .4 });
    E.at(L2.end + .2);
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
    let L = E.say('hat', '次の日、3月25日の終値は、805円。前の日の710円から、上がった。', { wait: false, yomi: '次の日、3月25日の、おわりねは、はっぴゃくごえん。前の日の、ななひゃくじゅうえんから、上がった。' });
    E.pop(la, .3, .2); E.pop(lb, .3, L.dur * .3);
    P.circle(g, { x: b.x, y: b.y, w: 22, h: 22, sw: 3, delay: L.dur * .3, dur: .3 });
    E.at(L.end);
    L = E.say('hat', '出来高も、4,800株から、35,700株に増えた。', { wait: false, yomi: 'できだかも、よんせんはっぴゃくかぶから、さんまんごせんななひゃくかぶに増えた。' });
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
    E.narr('3月25日の11時02分。買いが増えたというより、売りが出ない形だ、と評価する投稿があった。', { yomi: '3月25日の11時2分。買いが増えたというより、売りが出ない形だ、と評価する投稿があった。' });
    // 出来高＝成立した売買
    const buy = box(g, { x: 300, y: 430, w: 520, h: 230, top: '買った株', main: '35,700株', c: '#d22d68' });
    const sell = box(g, { x: 1100, y: 430, w: 520, h: 230, top: '売った株', main: '35,700株', c: '#2b68d8' });
    const eq = E.div(g, { left: 820, top: 480, width: 280, textAlign: 'center', font: '900 90px/1.2 Zen', color: '#ffd84a' }, '＝').ini({ o: 0 });
    const cap = E.div(g, { left: 0, top: 690, width: W, textAlign: 'center', font: '900 34px/1.3 Zen', color: '#f3e6c8' }, '出来高＝売買が成立した株の数（3/25）').ini({ o: 0 });
    E.tw(t19, .4, { y: -20, s: .92 }, 'inOut');
    const L = E.say('hat', '出来高は、売買が成立した株の数だ。買った株の数と、売った株の数は、必ず同じになる。', { wait: false, yomi: 'できだかは、売買が成立した株の数だ。買った株の数と、売った株の数は、必ず同じになる。' });
    rise(buy, .3); E.pop(eq, .35, L.dur * .5, .5); rise(sell, L.dur * .55); E.show(cap, .3, L.dur * .7);
    E.at(L.end);
    E.say('hat', '売り注文が、全部でどれだけあったかを確かめるデータは、元資料にはない。');
    E.wait(.3);
  });

  E.scene({ name: 't20' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [3, 25], [3, 25]);
    const t20 = P.tcard(g, { id: 'T20', when: '2026/3/25 13:33', kind: '需給', session: '取引時間内', text: '守られる価格帯が700円から800円へ上がったと評価', note: '当日安値720円。800円が終日維持されたという意味には置き換えない', x: 260, y: 120, w: 1400, size: 40 });
    E.tw(t20, .45, { o: [0, 1], x: [60, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.narr('13時33分には、守られる値段の帯が、700円から800円に上がった、という評価。', { yomi: '13時33分には、守られる値段の帯が、ななひゃくえんから、はっぴゃくえんに上がった、という評価。' });
    // 値段の物差し
    const y = v => 820 - (v - 680) * 2.6;
    E.div(g, { left: 700, top: y(840), width: 8, height: y(680) - y(840), background: 'rgba(243,230,200,.6)', borderRadius: 4 });
    const line800 = E.div(g, { left: 560, top: y(800) - 3, width: 300, height: 0, borderTop: '6px dashed #ffd84a' }).ini({ o: 0 });
    const l800 = E.div(g, { left: 880, top: y(800) - 26, font: '900 36px/1.3 Noto', color: '#ffd84a', whiteSpace: 'nowrap' }, '800円').ini({ o: 0 });
    const low = E.div(g, { left: 690, top: y(720) - 14, width: 28, height: 28, borderRadius: '50%', background: '#c62828', boxShadow: '0 0 0 5px rgba(255,255,255,.9)' }).ini({ o: 0 });
    const llow = E.div(g, { left: 880, top: y(720) - 26, font: '900 36px/1.3 Noto', color: '#ff8a8a', whiteSpace: 'nowrap' }, '当日安値 720円').ini({ o: 0 });
    const cl = E.div(g, { left: 690, top: y(805) - 14, width: 28, height: 28, borderRadius: '50%', background: '#2b68d8', boxShadow: '0 0 0 5px rgba(255,255,255,.9)' }).ini({ o: 0 });
    const lcl = E.div(g, { left: 360, top: y(805) - 60, width: 300, textAlign: 'right', font: '900 32px/1.3 Noto', color: '#9ec5f0', whiteSpace: 'nowrap' }, '終値 805円').ini({ o: 0 });
    E.tw(t20, .4, { y: -20, s: .9 }, 'inOut');
    const L = E.say('hat', 'その日の安値は、720円。800円より下でも、取引があった日だ。', { wait: false, yomi: 'その日の安値は、ななひゃくにじゅうえん。はっぴゃくえんより下でも、取引があった日だ。' });
    E.show(line800, .3, .1); E.show(l800, .3, .2); E.show(cl, .3, .3); E.show(lcl, .3, .3);
    E.pop(low, .35, L.dur * .3, .5); E.show(llow, .3, L.dur * .35); E.sfx('pop', { delay: L.dur * .3 });
    E.at(L.end);
    const call = P.eveCall(g, ['normal', 'surprise'], { x: 1560, y: 560, w: 320, h: 250 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '800円が、一日中守られたわけじゃないんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: 'はっぴゃくえんが、いちにちじゅう、守られたわけじゃないんだねー。' });
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

  /* ============================================================ S6 T21　3月27日 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 't21' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    bar(g, [3, 25], [3, 27]);
    const t21 = P.tcard(g, { id: 'T21', when: '2026/3/27 11:22', kind: '需給', session: '取引時間内', text: '市場に出る株は5万～10万株程度と推測', note: '発行株数と浮動株の推定を区別。日々の約定株数から固定保有量は逆算できない', x: 260, y: 120, w: 1400, size: 40 });
    E.tw(t21, .45, { o: [0, 1], x: [60, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.narr('3月27日。市場に出る株は、5万から10万株くらいだ、と推測する投稿があった。', { yomi: '3月27日。市場に出る株は、ごまんから、じゅうまんかぶくらいだ、と推測する投稿があった。' });
    E.tw(t21, .4, { y: -20, s: .92 }, 'inOut');
    const b1 = box(g, { x: 300, y: 440, w: 560, h: 230, top: '会社の開示', main: '発行されている株の数', c: '#b8651a', size: 40 });
    const b2 = box(g, { x: 1060, y: 440, w: 560, h: 230, top: '本人の推測', main: '市場に出る株の推定', c: '#2b68d8', size: 40 });
    const ne = E.div(g, { left: 860, top: 500, width: 200, textAlign: 'center', font: '900 90px/1.2 Zen', color: '#ffd84a' }, '≠').ini({ o: 0 });
    let L = E.say('hat', '発行されている株の数と、市場に出てくる株の推定は、別のものだ。', { wait: false });
    rise(b1, .2); E.pop(ne, .35, L.dur * .4, .5); rise(b2, L.dur * .5);
    E.at(L.end);
    const no = panel(g, { x: 310, y: 720, w: 1300, h: 100, size: 34, dark: true, html: '毎日の出来高　→　売られずに持たれている株の量　は逆算できない' });
    L = E.say('hat', '毎日の出来高から、売られずに持たれている株の量は、逆算できない。', { wait: false, yomi: '毎日の、できだかから、売られずに持たれている株の量は、逆算できない。' });
    E.tw(no, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .3);
  });

  /* ============================================================ S7 T22と、細っていく売買 */
  E.scene({ name: 't22' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [3, 27], [3, 30]);
    const t22 = P.tcard(g, { id: 'T22', when: '2026/3/30 10:30', kind: '需給', session: '取引時間内', text: '朝の現物短期売りと市場全体への反応を説明', note: '信用取引ができないとの表現も本人の説明。一般信用・相対貸株等の不存在までは示さない', x: 260, y: 120, w: 1400, size: 40 });
    E.tw(t22, .45, { o: [0, 1], x: [60, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.narr('3月30日。朝の、現物株の短期売りと、市場全体の動きへの反応を、説明する投稿があった。');
    const m = P.mark(g, '本人の説明', { x: 380, y: 520, color: P.T_BLUE, size: .75, rot: -6 });
    let L = E.say('hat', '信用取引ができない、という言い方も、本人の説明だ。', { wait: false });
    P.stampIn(m, L.dur * .5);
    E.at(L.end);
    const no = panel(g, { x: 840, y: 520, w: 820, h: 110, size: 32, html: 'ほかのやり方の売りが「ない」とまでは示していない' });
    L = E.say('hat', 'ほかのやり方での売りが、まったくないことまでは、示していない。', { wait: false });
    E.tw(no, .4, { o: [0, 1], x: [40, 0] }, 'back', .3); E.sfx('slide', { delay: .3 });
    E.at(L.end + .3);
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
    let L = E.say('hat', '売買が細っていったのは、数字で見える。3月27日の37,700株から、4月2日の1,000株へ。', { wait: false, yomi: '売買が細っていったのは、数字で見える。3月27日の、さんまんななせんななひゃくかぶから、4月2日の、せんかぶへ。' });
    bars.forEach((r, i) => { const d = .2 + i * L.dur * .3; E.tw(r.b, .6, { sy: [0, 1] }, 'out', d); E.show(r.lv, .3, d + .4); E.show(r.ld, .3, d); E.sfx('pop', { delay: d, gain: .4 }); });
    E.at(L.end);
    E.say('hat', '値段は、930円の手前で、横ばいになった。', { yomi: '値段は、きゅうひゃくさんじゅうえんの手前で、横ばいになった。' });
    E.wait(.4);
  });

  /* ============================================================ S8 I30　4月6日 */
  E.scene({ name: 'i30' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [3, 30], [4, 6]);
    const i30 = P.icard(g, { id: 'I30', when: '2026/4/6 16:00', session: '引け後', title: '豊橋・完成後引渡し案件', text: '愛知県豊橋市の蓄電所売却を決議。<br>完成・引渡しは9月予定、引渡し時に収益計上予定', note: '完成予定・契約・引渡しを分けて読む', x: 260, y: 120, w: 1400, size: 32 });
    E.tw(i30, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '4月6日、16時の開示。愛知県豊橋市の、蓄電所の売却も、決議された。', { yomi: '4月6日、16時の開示。あいちけん、とよはし市の、ちくでんしょの売却も、決議された。' });
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
    E.wait(.4);
  });

  /* ============================================================ S9 T23　4月8日 */
  E.scene({ name: 't23' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 6], [4, 8]);
    const t23 = P.tcard(g, { id: 'T23', when: '2026/4/8 13:39', kind: 'チャート', session: '取引時間内', text: '930円近辺の売り圧力が和らいだと評価', note: '4月3日から9日の高値は930～931円。4月10日に935円、14日に1,000円へ', x: 260, y: 120, w: 1400, size: 40 });
    E.tw(t23, .45, { o: [0, 1], x: [60, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.narr('4月8日。930円のあたりの売りの圧力が、和らいだ、と評価する投稿があった。', { yomi: '4月8日。きゅうひゃくさんじゅうえんのあたりの売りの圧力が、和らいだ、と評価する投稿があった。' });
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
    L = E.say('hat', 'そのあと、4月10日に935円、14日に1,000円をつけた。値動きは、この見方と合っている。', { wait: false, yomi: 'そのあと、4月10日に、きゅうひゃくさんじゅうごえん、14日に、せんえんをつけた。値動きは、この見方と合っている。' });
    P.circle(g, { x: h10.x, y: h10.y, w: 22, h: 22, sw: 3, delay: .3, dur: .3 }); E.pop(t10, .3, .4);
    P.circle(g, { x: h14.x, y: h14.y, w: 22, h: 22, sw: 3, delay: L.dur * .35, dur: .3 }); E.pop(t14, .3, L.dur * .4);
    E.at(L.end);
    const no = E.div(sc.root, { left: 360, top: 780, width: 1200, height: 100, borderRadius: 22, background: '#2a2430', border: '3px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 34px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '誰が売り、どれだけ吸収されたか　→　裏付けはない').ini({ o: 0 });
    L = E.say('hat', 'ただ、誰が売っていて、どれだけ吸収されたのか、その裏付けはない。', { wait: false });
    E.tw(no, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
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
    let L = E.say('hat', 'これは、上がった日と、下がった日に分けて、出来高を足した表だ。', { wait: false, yomi: 'これは、上がった日と、下がった日に分けて、できだかを足したひょーだ。' });
    cells.forEach((c, i) => { E.tw(c, .35, { o: [0, 1], y: [20, 0] }, 'back', .2 + i * L.dur * .12); E.sfx('pop', { delay: .2 + i * L.dur * .12, gain: .35 }); });
    E.at(L.end);
    const rule = panel(g, { x: 260, y: 540, w: 1400, h: 110, size: 32, html: '上がった日＝前の日の終値より高く終わった日　（ローソク足の赤・緑とは別の決め方）' });
    L = E.say('hat', 'ここでの上がった日は、前の日の終値より、高く終わった日。ローソク足の、赤と緑とは、決め方が違う。', { wait: false, yomi: 'ここでの上がった日は、前の日の、おわりねより、高く終わった日。ローソクあしの、赤と緑とは、決め方が違う。' });
    E.tw(rule, .4, { o: [0, 1], y: [20, 0] }, 'back', .2);
    E.at(L.end);
    L = E.say('hat', '3月18日から4月20日は、上がった日の出来高が、大きい。', { wait: false, yomi: '3月18日から4月20日は、上がった日の、できだかが、大きい。' });
    P.circle(g, { x: 160 + 340 + 250 + 105, y: 360, w: 200, h: 120, delay: L.dur * .5 });
    E.at(L.end);
    E.hide(rule, .3);
    const no = panel(g, { x: 260, y: 540, w: 1400, h: 150, size: 32, dark: true, html: '同じ株が何度も売買される<br>→ 合計を「売られない株」や「誰かの持ち株」に読み替えられない' });
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
    const n = P.kNotice(g, { x: 100, y: 330, w: 1720, size: 32 });
    E.show(n, .6, .2);
    E.wait(6.0);
  });
  E.bgmStop(2.5, -2.5);
  E.finish();
}
