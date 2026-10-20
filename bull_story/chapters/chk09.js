// 完全版 第9章「二番底」（2026年4月27日〜5月18日）
// 台本: story/k/k09_二番底.md　元資料 p7・p13・p14・p21・p31・p32・p35・p37・ユーザー提供の投稿スクリーンショット（2026/10/18）
// 投稿は元資料の要約（本人の見解）。5/1（一覧外）と T37 は投稿の画面（P.postShot）と本文の字幕（E.cap・声なし）。
// 有名投資家の名前・アカウント・アイコンは出さない。ブルちゃんの保有はフィクション
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
    E.narr('4月24日の夕方。取引が終わったあとに、決算と、監査人の意見不表明が、同時に出た。', { yomi: '4月24日の夕方。取引が終わったあとに、決算と、かんさにんの、いけんふひょうめいが、同時に出た。' });
    E.narr('意見不表明は、十分な証拠が得られず、監査人が、決算について、意見を出さないことだ。', { yomi: 'いけんふひょうめいは、十分な証拠が得られず、かんさにんが、決算について、意見を出さないことだ。' });
    E.narr('4月27日は、その公表のあとの、最初の取引の日だった。');
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
    E.say('hat', '4月24日の公表のあとの、最初の取引の日の、取引時間の途中の投稿だ。');
    E.say('hat', '元資料の要約では、お金がもう入金されている場合について、書いた投稿だ。', { yomi: 'もとしりょうの要約では、お金が、もう、にゅうきんされている場合について、書いた投稿だ。' });
    E.say('hat', 'その場合は、収益の区分が変わっても、利益は変わらない、という主張だ。');
    E.tw(t35, .4, { y: -30, s: .9 }, 'inOut');
    const b1 = box(g, { x: 200, y: 500, w: 720, h: 300, top: '収益の区分', main: '売上か、営業外収益か', sub: '売上は本業の収益、営業外収益は本業以外の収益<span style="font-size:22px;color:#6a6066">（一般的な説明）</span>', c: '#2b68d8', size: 46 });
    const b2 = box(g, { x: 1000, y: 500, w: 720, h: 300, top: '取引の実在性', main: '取引が、本当にあったか', sub: 'あとの監査や、名証の資料が、問題にしたこと（元資料の検証メモ）', c: '#c62828', border: '5px solid #c62828', size: 46 });
    let L = E.say('hat', '収益の区分は、売上か、営業外収益か、といった分け方のことだ。', { wait: false });
    rise(b1, .2);
    E.at(L.end);
    E.say('hat', '売上は、本業で得た収益だ。営業外収益は、本業以外で得た収益だ。', { yomi: 'うりあげは、本業で得た収益だ。えいぎょうがいしゅうえきは、本業以外で得た収益だ。' });
    const m = P.mark(g, '本人の会計解釈', { x: 1380, y: 360, color: P.T_BLUE, size: .75, rot: 7, w: 280 });
    L = E.say('hat', '元資料の検証メモは、これを、本人の会計の解釈だ、としている。', { wait: false, yomi: 'もとしりょうの、けんしょうメモは、これを、本人の会計の解釈だ、としている。' });
    P.stampIn(m, L.dur * .5);
    E.at(L.end);
    E.say('hat', '投稿が話しているのは、収益を、どの区分に入れるか、ということだ。');
    L = E.say('hat', 'でも、あとの監査や、名証の資料が、問題にしたのは、別の点だ。', { wait: false, yomi: 'でも、あとの監査や、めいしょうの資料が、問題にしたのは、別の点だ。' });
    rise(b2, .3);
    E.at(L.end);
    E.say('hat', '名証は、エスポアの株が売り買いされている、名古屋証券取引所のことだ。', { yomi: 'めいしょうは、エスポアの株が売り買いされている、なごやしょうけんとりひきじょのことだ。' });
    E.say('hat', '問題にされたのは、取引そのものが、本当にあったのか、などの点だ。');
    E.say('hat', '取引が本当にあったかどうかを、取引の実在性と言う。', { yomi: '取引が本当にあったかどうかを、取引の、じつざいせいと言う。' });
    E.say('hat', 'だから、元資料の検証メモは、収益の区分を変えるだけの話には、限られない、としている。', { yomi: 'だから、もとしりょうの、けんしょうメモは、収益の区分を変えるだけの話には、限られない、としている。' });
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
    E.say('hat', 'このチャートは、元資料の日足だ。', { yomi: 'このチャートは、もとしりょうの、ひあしだ。' });
    E.say('hat', '日足は、1日の値動きを、1本のローソク足にした、チャートだ。', { yomi: 'ひあしは、いちにちの値動きを、いっぽんのローソクあしにした、チャートだ。' });
    E.say('hat', '高値は、その日についた、いちばん高い値段だ。安値は、いちばん安い値段だ。', { yomi: 'たかねは、その日についた、いちばん高い値段だ。やすねは、いちばん安い値段だ。' });
    E.say('hat', 'チャートの上の、うすい帯は、元資料が書き込んだ、窓だ。', { yomi: 'チャートの上の、うすい帯は、もとしりょうが書き込んだ、まどだ。' });
    E.say('hat', '窓は、値段が飛んで、ローソク足の間に、すき間があいたところのことだ。', { yomi: 'まどは、値段が飛んで、ローソクあしの間に、すきまが、あいたところのことだ。' });
    E.say('hat', 'この窓は、4月20日の安値969円と、21日の高値934円の、間のすき間だ。', { yomi: 'この、まどは、4月20日の、やすね、きゅうひゃくろくじゅうきゅうえんと、21日の、たかね、きゅうひゃくさんじゅうよえんの、あいだの、すきまだ。' });
    E.say('hat', '元資料によると、値段は、最後の売買の日まで969円に戻らず、窓は埋まらなかった。', { yomi: 'もとしりょうによると、値段は、最後の売買の日まで、きゅうひゃくろくじゅうきゅうえんに戻らず、まどは、うまらなかった。' });
    E.say('hat', 'だから、未充足の窓、と書いてある。くわしくは、第7章で見た。', { yomi: 'だから、みじゅうそくの、まど、と書いてある。くわしくは、だいななしょうで見た。' });
    let L = E.say('hat', '4月24日の高値は、913円だった。', { wait: false, yomi: '4月24日の、たかねは、きゅうひゃくじゅうさんえんだった。' });
    P.circle(g, { x: hi.x, y: hi.y, w: 26, h: 26, sw: 3, color: '#c62828', delay: .2, dur: .3 }); E.pop(t1, .3, .3);
    E.at(L.end);
    L = E.say('hat', '4月28日の安値は、625円だった。', { wait: false, yomi: '4月28日の、やすねは、ろっぴゃくにじゅうごえんだった。' });
    P.circle(g, { x: lo.x, y: lo.y, w: 26, h: 26, sw: 3, delay: .2, dur: .3 }); E.pop(t2, .3, .3);
    E.at(L.end);
    E.say('hat', '4月24日の高値から、27日と28日の、2日の取引で、625円まで下げた。', { yomi: '4月24日の、たかねから、27日と28日の、ふつかの取引で、ろっぴゃくにじゅうごえんまで下げた。' });
    const nb = E.div(sc.root, { left: 300, top: 690, width: 1320, padding: '16px 30px 18px', borderRadius: 22, background: '#2a2430', border: '3px solid #ffd84a', boxSizing: 'border-box', textAlign: 'center', font: '900 34px/1.4 Zen', color: '#ffd84a' },
      '決算の発表を、もう一度延ばす開示（再延期）は、4月20日<div style="font:800 26px/1.5 Round;color:#f3e6c8">4月28日に安値625円がついたのとは、別の日の出来事（元資料 p37）</div>').ini({ o: 0 });
    E.say('hat', '日付を整理しておく。');
    L = E.say('hat', '決算の発表を、もう一度延ばした、再延期の開示は、4月20日に出ていた。', { wait: false, yomi: '決算の発表を、もう一度延ばした、さいえんきの開示は、4月20日に出ていた。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .3); E.sfx('ding', { delay: L.dur * .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '4月20日に予定していた決算の発表を、4月24日に延ばす、という内容だった。');
    E.say('hat', '4月28日に、安値の625円がついた日とは、別の日の出来事だ。', { yomi: '4月28日に、やすねの、ろっぴゃくにじゅうごえんがついた日とは、別の日の出来事だ。' });
    E.say('hat', '元資料も、日付の整理として、この2つを、別の出来事だと書いている。', { yomi: 'もとしりょうも、日付の整理として、このふたつを、別の出来事だと書いている。' });
    E.wait(.4);
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
    E.narr('4月30日の、15時00分。チャートについての投稿だ。', { yomi: '4月30日の、15時。チャートについての投稿だ。' });
    E.say('hat', '名証の取引が終わる、15時30分の、30分前の投稿だ。', { yomi: 'めいしょうの取引が終わる、15時30分の、さんじゅっぷん前の投稿だ。' });
    E.say('hat', '元資料の要約では、値段が25日線を超えた、という見方を書いた投稿だ。', { yomi: 'もとしりょうの要約では、値段が、にじゅうごにちせんを超えた、という見方を書いた投稿だ。' });
    const ex = panel(g, { x: 260, y: 560, w: 1400, h: 130, size: 32, html: '<div style="text-align:center"><span style="color:#e8a33a">25日線</span>は、その日までの、25日分の終値を、平均してつないだ線<div style="font:800 24px/1.4 Round;color:#4a4552">終値は、その日の取引で、最後についた値段（計算のしかたは元資料 p35）</div></div>' });
    let L = E.say('hat', '25日線は、その日までの、25日分の終値を、平均してつないだ線だ。', { wait: false, yomi: 'にじゅうごにちせんは、その日までの、にじゅうごにちぶんの、おわりねを、平均してつないだ線だ。' });
    rise(ex, .2);
    E.at(L.end);
    E.say('hat', '終値は、その日の取引で、最後についた値段だ。', { yomi: 'おわりねは、その日の取引で、最後についた値段だ。' });
    E.wait(.3);
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
    E.say('hat', 'チャートの札にある、25MAも、25日線のことだ。', { yomi: 'チャートの札にある、にじゅうごエムエーも、にじゅうごにちせんのことだ。' });
    E.say('hat', '元資料の検証メモは、25日線の値と、この日の高値と、終値を、比べている。', { yomi: 'もとしりょうの、けんしょうメモは、にじゅうごにちせんの値と、この日の、たかねと、おわりねを、比べている。' });
    let L = E.say('hat', 'この日の25日線は、終値をもとに計算すると、905.24円だった。', { wait: false, yomi: 'この日の、にじゅうごにちせんは、おわりねをもとに計算すると、キューヒャクゴテンニヨンエンだった。' });
    E.tw(ln, .6, { sx: [0, 1] }, 'inOut', .2); E.pop(tm, .3, .5);
    E.at(L.end);
    L = E.say('hat', 'この日の高値は、910円で、25日線の905.24円より、上だった。', { wait: false, yomi: 'この日の、たかねは、きゅうひゃくじゅうえんで、にじゅうごにちせんの、キューヒャクゴテンニヨンエンより、上だった。' });
    P.circle(g, { x: hi.x, y: hi.y, w: 14, h: 14, sw: 2, delay: L.dur * .2, dur: .3 }); E.pop(th, .3, L.dur * .25);
    E.at(L.end);
    L = E.say('hat', 'でも、終値の868円は、25日線より、下だった。', { wait: false, yomi: 'でも、おわりねの、はっぴゃくろくじゅうはちえんは、にじゅうごにちせんより、下だった。' });
    P.circle(g, { x: cl.x, y: cl.y, w: 14, h: 14, sw: 2, color: '#2b68d8', delay: .3, dur: .3 }); E.pop(tc, .3, .4);
    E.at(L.end);
    E.say('hat', 'つまり、取引の途中の高値では、25日線を超えていた。', { yomi: 'つまり、取引の途中の、たかねでは、にじゅうごにちせんを超えていた。' });
    E.say('hat', 'でも、取引が終わった時の値段では、25日線の上に、とどまらなかった。', { yomi: 'でも、取引が終わった時の値段では、にじゅうごにちせんの上に、とどまらなかった。' });
    const mk = P.mark(sc.root, '場中と終値を区別', { x: 1380, y: 120, color: '#c62828', size: .75, rot: 7, w: 320 });
    L = E.say('hat', '元資料は、この投稿について、場中と終値を区別する、と書いている。', { wait: false, yomi: 'もとしりょうは、この投稿について、ばちゅうと、おわりねを、区別する、と書いている。' });
    P.stampIn(mk, L.dur * .5);
    E.at(L.end);
    E.say('hat', '場中は、取引が行われている、時間の途中のことだ。', { yomi: 'ばちゅうというのは、取引が行われている、時間の途中のことだ。' });
    E.say('hat', '投稿した15時00分の時点で、値段が25日線より上だったかどうかは、分からない。', { yomi: '投稿した、15時の時点で、値段が、にじゅうごにちせんより上だったかどうかは、分からない。' });
    E.say('hat', '元資料は、15時00分の時点の値段を、取っていないからだ。', { yomi: 'もとしりょうは、15時の時点の値段を、とっていないからだ。' });
    E.say('hat', 'だから、その時点の値段を、推測で補わない、としている。');
    E.wait(.4);
  });

  /* ============================================================ S6 5月1日の投稿（元資料の一覧外・P12） */
  // 投稿の時刻は画面にない（添付画像は 11:21）。同じ日の I35（15:30）とは、時刻の帯で前後を並べない
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'p12' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 30], [5, 1]);
    const card = shot(g, { id: '一覧外', listed: false, when: '2026/5/1（画像 11:21）', text: 'p12_text', imgs: ['p12_img'],
      rows: [{ label: '確認メモ', color: MEMO, text: '元資料の投稿の一覧（50件）にない投稿。投稿の時刻は画面に出ていない。添付画像の時刻は11:21。' },
        { label: '確認メモ', color: MEMO, show: false, text: '11:21の画像では860円で、前日比は−8円。下の段の棒は出来高で、売り買いされた株の数。株主がどれだけ入れ替わったかは、出来高からは確認できない。' }] });
    enter(card);
    const FX = 1222, FW = 640;
    const f1 = fact(g, { x: FX, y: 150, w: FW, html: '11:21の画像の値段は、860円' + small('前日比は−8円。高値・安値・終値の欄も11:21の時点の値で、終値の欄には、その時点の値段が入っている') });
    const f2 = fact(g, { x: FX, y: 340, w: FW, html: '下の段の黄色い棒が、出来高' + small('その日に売り買いされた株の数。同じ株が何度も売り買いされると、その分も足される') });
    E.wait(1.0);
    E.narr('5月1日の投稿。これは、元資料の投稿の一覧には、載っていない。', { yomi: '5月1日の投稿。これは、もとしりょうの、投稿の一覧には、載っていない。' });
    E.cap('3260 エスポア\n出来高みても');
    E.cap('この一週間ほどでダイブン株主が入れ替わったかな', { dur: 4.0 });
    E.say('hat', 'この投稿は、エスポアの日足のチャートの画面を、1枚付けている。', { yomi: 'この投稿は、エスポアの、ひあしのチャートの画面を、いちまい付けている。' });
    E.say('hat', '本文は、出来高を見て、書いたものだ。', { yomi: 'ほんぶんは、できだかを見て、書いたものだ。' });
    E.say('hat', 'この1週間ほどで、株主がだいぶ入れ替わったのでは、という見方を書いている。', { yomi: 'この、いっしゅうかんほどで、株主が、だいぶ入れ替わったのでは、という見方を書いている。' });
    E.say('hat', '投稿の時刻は、画面に出ていない。');
    let L = E.say('hat', '添付の画像に出ている時刻は、11時21分だ。', { wait: false });
    frame(g, card, 0, [10, 190, 124, 266], .4);
    E.at(L.end);
    L = E.say('hat', '11時21分の画像では、860円。前の日の終値より、8円安かった。', { wait: false, yomi: '11時21分の画像では、はっぴゃくろくじゅうえん。前の日の、おわりねより、はちえん、やすかった。' });
    frame(g, card, 0, [245, 188, 802, 268], .3); E.tw(f1, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .4); E.sfx('pop', { delay: L.dur * .4, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '高値や終値の欄も、11時21分の時点のもので、取引が終わった時のものではない。', { wait: false, yomi: 'たかねや、おわりねの欄も、11時21分の時点のもので、取引が終わった時のものではない。' });
    frame(g, card, 0, [6, 436, 808, 472], .3);
    E.at(L.end);
    E.show(card.rows[1], .3, .1);
    L = E.say('hat', '画面の下の段の、黄色い棒が、出来高だ。', { wait: false, delay: .2, yomi: '画面の下の段の、黄色い棒が、できだかだ。' });
    frame(g, card, 0, [0, 1192, 676, 1382], .3); E.tw(f2, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .5); E.sfx('pop', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    E.say('hat', '出来高は、その日に売り買いされた、株の数のことだ。', { yomi: 'できだかは、その日に売り買いされた、株の数のことだ。' });
    E.say('hat', '高い棒が、何本かある。どの日の棒かを、元資料の日足で、確かめる。', { yomi: '高い棒が、何本かある。どの日の棒かを、もとしりょうの、ひあしで、確かめる。' });
    E.wait(.3);
  });

  // 元資料の日足（p7）の出来高の段で、4/17・4/21・4/27・4/28 の棒を指す（棒の高さの数字は読み上げない）
  E.scene({ name: 'p12_vol' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = dailyChart(sc, '日足と出来高　2026年4月13日〜5月1日');
    P.look(sc.cam, { s: 1.8, cx: C.at(1000, 0).x, cy: C.at(0, 690).y, dur: 1.4, delay: .2 });
    // 出来高の棒（p07 の画素：左端・上端・右端。下の段の 0 は y=921）
    const vbar = (x0, top, x1, label, d) => {
      const a = C.at(x0, top), b = C.at(x1, 921);
      const n = E.div(g, { left: a.x - 3, top: a.y - 3, width: b.x - a.x + 6, height: b.y - a.y + 6, borderRadius: 4, border: '2px solid #ffd84a', boxShadow: '0 0 8px rgba(255,216,74,.9)', boxSizing: 'border-box' }).ini({ o: 0 });
      const t = E.div(g, { left: (a.x + b.x) / 2 - 40, top: a.y - 22, width: 80, textAlign: 'center', font: '900 15px/1.2 Noto', color: '#262236', whiteSpace: 'nowrap' }, `<span style="padding:1px 6px;border-radius:6px;background:#ffd84a">${label}</span>`).ini({ o: 0 });
      E.show(n, .25, d); E.show(t, .25, d); E.sfx('pop', { delay: d, gain: .35 });
    };
    E.wait(1.6);
    E.say('hat', '元資料の日足の、下の段が、出来高だ。', { yomi: 'もとしりょうの、ひあしの、下の段が、できだかだ。' });
    const L = E.say('hat', '4月17日と、21日、27日、28日は、出来高の棒が高い。', { wait: false, yomi: '4月17日と、21日、27日、28日は、できだかの棒が高い。' });
    vbar(784, 851, 817, '4/17', .2); vbar(882, 813, 915, '4/21', L.dur * .35); vbar(1078, 857, 1112, '4/27', L.dur * .55); vbar(1127, 797, 1161, '4/28', L.dur * .75);
    E.at(L.end);
    E.say('hat', '出来高が多い日があったことは、元資料の日足でも、確かめられる。', { yomi: 'できだかが多い日があったことは、もとしりょうの、ひあしでも、確かめられる。' });
    // ここから、出来高から分からないこと（元資料 p14・p35）
    const ov = E.div(sc.root, { left: 0, top: 0, width: W, height: H, background: 'rgba(8,10,20,.72)' }).ini({ o: 0 });
    const p1 = E.div(sc.root, { left: 210, top: 150, width: 1500, padding: '26px 40px 30px', borderRadius: 24, background: 'rgba(255,255,255,.96)', boxShadow: '0 12px 24px rgba(0,0,0,.35)', boxSizing: 'border-box', textAlign: 'center' },
      '<div style="font:900 40px/1.4 Zen;color:#262236">出来高は、売り買いされた株の数を、足したもの</div><div style="font:800 28px/1.5 Round;color:#4a4552;margin-top:8px">同じ株が、同じ日のうちに何度も売り買いされると、その分も足される</div>').ini({ o: 0 });
    const p2 = E.div(sc.root, { left: 210, top: 380, width: 1500, padding: '22px 40px 26px', borderRadius: 24, background: '#2a2430', border: '3px solid #ffd84a', boxShadow: '0 12px 24px rgba(0,0,0,.35)', boxSizing: 'border-box', textAlign: 'center' },
      '<div style="font:800 26px/1.4 Round;color:#f3e6c8">元資料（p35・p14）の書き方</div><div style="font:900 34px/1.5 Zen;color:#ffd84a;margin-top:6px">累計出来高は「回転売買を含み、実保有株数ではない」</div><div style="font:800 22px/1.5 Round;color:#f3e6c8;margin-top:6px">「同じ株が何度も売買されるため、累計株数を固定された現物株数・空売り残・特定人物の保有株数に読み替えることはできない」</div>').ini({ o: 0 });
    let L2 = E.say('hat', 'でも、出来高は、売り買いされた株の数を、全部足したものだ。', { wait: false, yomi: 'でも、できだかは、売り買いされた株の数を、全部足したものだ。' });
    E.show(ov, .4, .1); E.tw(p1, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('pop', { delay: .3, gain: .5 });
    E.at(L2.end);
    E.say('hat', '同じ株が、同じ日のうちに、何度も売り買いされることもある。その分も、足される。');
    L2 = E.say('hat', '元資料も、出来高には、同じ株を何度も売り買いした分が、含まれる、としている。', { wait: false, yomi: 'もとしりょうも、できだかには、同じ株を、何度も売り買いした分が、含まれる、としている。' });
    E.tw(p2, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L2.end);
    E.say('hat', 'カードの回転売買は、同じ株を、何度も売り買いすることだ。', { yomi: 'カードの、かいてんばいばいは、同じ株を、何度も売り買いすることだ。' });
    E.say('hat', '累計出来高は、何日分かの出来高を、足し合わせたものだ。', { yomi: 'るいけいできだかは、何日分かの、できだかを、足し合わせたものだ。' });
    E.say('hat', '空売り残は、株を借りて先に売る空売りのうち、まだ買い戻されていない株の数だ。', { yomi: 'からうりざんは、株を借りて先に売る、からうりのうち、まだ買い戻されていない株の数だ。' });
    E.say('hat', '元資料は、足し合わせた株の数を、ほかの数に、読み替えることはできない、としている。', { yomi: 'もとしりょうは、足し合わせた株の数を、ほかの数に、読み替えることはできない、としている。' });
    E.say('hat', '売られずに持たれている株の数にも、空売り残にも、特定の人の持ち株の数にも、だ。', { yomi: '売られずに持たれている株の数にも、からうりざんにも、とくていの人の、持ち株の数にも、だ。' });
    const m = P.mark(sc.root, '出来高からは確認できない', { x: 640, y: 640, color: '#c62828', size: .8, rot: -4, w: 640 });
    L2 = E.say('hat', '出来高が多くても、株主がどれだけ入れ替わったかは、出来高からは、確かめられない。', { wait: false, yomi: 'できだかが多くても、株主が、どれだけ入れ替わったかは、できだかからは、確かめられない。' });
    P.stampIn(m, L2.dur * .5);
    E.at(L2.end);
    E.say('hat', '誰が株を手放して、誰が新しく持ったのかも、出来高にも、投稿の画面にも、出ていない。', { yomi: '誰が株を手放して、誰が新しく持ったのかも、できだかにも、投稿の画面にも、出ていない。' });
    const call = P.eveCall(sc.root, ['normal', 'surprise'], { x: 1560, y: 580, w: 300, h: 240 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '出来高が多い日は確かめられるけど、株主の入れ替わりまでは、分からないんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: 'できだかが多い日は、確かめられるけど、株主の入れ替わりまでは、分からないんだねー。' });
    E.wait(.3);
  });

  /* ============================================================ S6b I35　5月1日 15:30 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'i35' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [5, 1], [5, 1]);
    const i35 = P.icard(g, { id: 'I35', when: '2026/5/1 15:30', session: '引け後', title: '北海道七飯町・用地取得', text: '七飯町上軍川の蓄電池用地・系統権利等の取得を決議。<br>用地・権利の売却を目的とする', x: 260, y: 140, w: 1400, size: 34 });
    E.tw(i35, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '5月1日の、15時30分。会社の開示が出た。', { yomi: '5月1日の、15時30分。会社の、かいじが出た。' });
    E.say('hat', 'エスポアが、北海道の七飯町、上軍川にある、蓄電池の用地の取得を、決議した。', { yomi: 'エスポアが、ほっかいどうの、ななえちょう、かみいくさがわにある、ちくでんちの用地の取得を、決議した。' });
    E.say('hat', '決議は、会社として、正式に決めることだ。', { yomi: 'けつぎは、会社として、正式に決めることだ。' });
    E.say('hat', 'カードの引け後は、その日の取引が、終わったあと、という意味だ。', { yomi: 'カードの、ひけごは、その日の取引が、終わったあと、という意味だ。' });
    E.say('hat', '用地と、系統の権利などを、売却することを、目的とした取得だ。', { yomi: '用地と、けいとうの権利などを、売却することを、目的とした取得だ。' });
    const ex = panel(g, { x: 260, y: 520, w: 1400, h: 110, size: 32, html: '<span><span style="color:#b8651a">系統の権利</span>は、蓄電所などを、電力の網につなぐための権利<span style="font:800 22px Round;color:#4a4552">（一般的な説明）</span></span>' });
    const L = E.say('hat', '系統の権利は、蓄電所などを、電力の網につなぐための権利だ。', { wait: false, yomi: 'けいとうの権利は、ちくでんしょなどを、電力の網につなぐための権利だ。' });
    rise(ex, .2);
    E.at(L.end);
    E.say('hat', 'さっきの5月1日の投稿は、投稿した時刻が、画面に出ていない。', { yomi: 'さっきの、5月1日の投稿は、投稿した時刻が、画面に出ていない。' });
    E.say('hat', '画面にある11時21分は、添付の画像の時刻で、投稿の時刻ではない。');
    E.say('hat', 'だから、投稿と、この開示の、どちらが先だったかは、分からない。', { yomi: 'だから、投稿と、この、かいじの、どちらが先だったかは、分からない。' });
    E.wait(.3);
  });

  /* ============================================================ S7 T37（P13）　5月13日 15:01 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 't37' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [5, 1], [5, 13]);
    const card = shot(g, { id: 'T37', when: '2026/5/13 15:01（画像 15:00）', text: 'p13_text', imgs: ['p13_img'],
      rows: [{ label: '元資料の要約', text: 'ダブルボトムと長い下ヒゲに言及' },
        { label: '確認メモ', color: MEMO, show: false, text: '画面には投稿の時刻が出ていない。15:01は元資料の一覧の時刻。添付画像の時刻は15:00で、高値・安値・終値の欄も15:00の時点の値。' },
        { label: '検証メモ', text: '4月28日安値625円、5月13日安値630円。下ヒゲは確認できるが、その後5月29日に625円を割った。', show: false }] });
    enter(card);
    const FX = 1272, FW = 600;
    const f1 = fact(g, { x: FX, y: 150, w: FW, html: '15:00の画像の値段は、765円' + small('前日比は−15円。この時点までの高値は769円、安値は630円') });
    const f2 = fact(g, { x: FX, y: 320, w: FW, html: '「終値 765.0」は、15:00の時点の値段' + small('名証の取引は15:30まで。この日の終値は、元資料では795円') });
    const f3 = fact(g, { x: FX, y: 490, w: FW, html: '白い丸は、添付画像の書き込み' + small('左の丸は、4/28の長い下ヒゲのあたり。右の丸は、5/13の足のあたり') });
    E.wait(1.0);
    E.narr('5月13日の、15時01分の投稿。この投稿は、画面で見ることができる。', { yomi: '5月13日の、15時1分の投稿。この投稿は、画面で見ることができる。' });
    E.cap('3260 エスポア\nダブルボトム');
    E.cap('超絶下髭');
    E.say('hat', 'この投稿は、エスポアの日足のチャートの画面を、1枚付けている。', { yomi: 'この投稿は、エスポアの、ひあしのチャートの画面を、いちまい付けている。' });
    E.say('hat', 'そして、ダブルボトムと、下ヒゲについて、書いたものだ。', { yomi: 'そして、ダブルボトムと、したヒゲについて、書いたものだ。' });
    E.say('hat', '下ヒゲは、ローソク足の、太い部分の下に伸びた、細い線だ。', { yomi: 'したヒゲは、ローソクあしの、太い部分の下に伸びた、細い線だ。' });
    E.say('hat', 'その日、値段が一度下がってから、戻したことを表す。', { yomi: 'その日、値段が、いちど下がってから、戻したことを表す。' });
    E.say('hat', 'ダブルボトムの形は、このあと、図で見る。');
    E.say('hat', '元資料の要約では、ダブルボトムと、長い下ヒゲに、触れた投稿だ。', { yomi: 'もとしりょうの要約では、ダブルボトムと、長い、したヒゲに、触れた投稿だ。' });
    E.show(card.rows[1], .3, .1);
    E.say('hat', '画面には、投稿の時刻は出ていない。15時01分は、元資料の一覧にある時刻だ。', { delay: .2, yomi: '画面には、投稿の時刻は出ていない。15時1分は、もとしりょうの一覧にある、じこくだ。' });
    let L = E.say('hat', '添付の画像に出ている時刻は、15時00分。値段は、765円だった。', { wait: false, yomi: '添付の画像に出ている時刻は、15時。値段は、ななひゃくろくじゅうごえんだった。' });
    frame(g, card, 0, [20, 210, 172, 318], .3); frame(g, card, 0, [355, 214, 1152, 316], L.dur * .55);
    E.tw(f1, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .6); E.sfx('pop', { delay: L.dur * .6, gain: .5 });
    E.at(L.end);
    E.say('hat', '前の日の終値より、15円安い値段だ。', { yomi: '前の日の、おわりねより、じゅうごえん、やすい値段だ。' });
    L = E.say('hat', 'この時点までの高値は769円、安値は630円だ。', { wait: false, yomi: 'この時点までの、たかねは、ななひゃくろくじゅうきゅうえん、やすねは、ろっぴゃくさんじゅうえんだ。' });
    frame(g, card, 0, [12, 560, 502, 614], L.dur * .3);
    E.at(L.end);
    L = E.say('hat', '終値の欄にも765円とあるが、取引の途中なので、その時点の値段が入っている。', { wait: false, yomi: 'おわりねの欄にも、ななひゃくろくじゅうごえんとあるが、取引の途中なので、その時点の値段が入っている。' });
    frame(g, card, 0, [858, 560, 1068, 614], .3); E.tw(f2, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .5); E.sfx('pop', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    E.say('hat', '名証の取引は、15時30分まで。この日の終値は、元資料では、795円だ。', { yomi: 'めいしょうの取引は、15時30分まで。この日の、おわりねは、もとしりょうでは、ななひゃくきゅうじゅうごえんだ。' });
    L = E.say('hat', '白い丸は、添付の画像に、書き込まれていたものだ。', { wait: false });
    E.tw(f3, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .4); E.sfx('pop', { delay: L.dur * .4, gain: .5 });
    E.at(L.end);
    E.say('hat', '左の丸は、4月28日の、長い下ヒゲのあたりを、囲んでいる。', { yomi: 'ひだりの丸は、4月28日の、長い、したヒゲのあたりを、囲んでいる。' });
    E.say('hat', '右の丸は、この日、5月13日の足のあたりを、囲んでいる。', { yomi: 'みぎの丸は、この日、5月13日の、あしのあたりを、囲んでいる。' });
    E.say('hat', 'この画像で確かめられるのは、15時00分までの、値段と、日足の形だ。', { yomi: 'この画像で確かめられるのは、15時までの、値段と、ひあしの形だ。' });
    E.say('hat', 'そのあと、この安値が、本当に底になったかどうかは、この画像からは、分からない。', { yomi: 'そのあと、この安値が、本当に、そこになったかどうかは、この画像からは、分からない。' });
    E.show(card.rows[2], .3, .1);
    E.say('hat', '元資料の検証メモは、4月28日と、5月13日の、2つの安値を比べている。', { delay: .2, yomi: 'もとしりょうの、けんしょうメモは、4月28日と、5月13日の、ふたつの安値を比べている。' });
    E.say('hat', '長い下ヒゲは確かめられるが、5月29日には、4月28日の625円より下がった、とする。', { yomi: '長い、したヒゲは、確かめられるが、5月29日には、4月28日の、ろっぴゃくにじゅうごえんより下がった、とする。' });
    E.say('hat', 'この中身を、順に見ていく。');
    E.wait(.3);
  });

  // ダブルボトムの形（しくみの図）
  E.scene({ name: 't37_shape' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, 'ダブルボトム', 110);
    E.show(tt, .3);
    const pts = [[0, 40], [180, 250], [330, 110], [480, 255], [700, 0]];
    const wl = E.polyline(g, pts, { left: 610, top: 280, width: 700, height: 300, color: '#e8a33a', sw: 10 }).ini({ draw: 0 });
    const lb = E.div(g, { left: 460, top: 620, width: 1000, textAlign: 'center', font: '900 32px/1.2 Zen', color: '#f5c46a' }, 'しくみの図（実際の値段ではない・一般的な説明）').ini({ o: 0 });
    E.wait(.3);
    const L = E.say('hat', 'ダブルボトムは、同じくらいの安値を、2回つけて、底になる形のことだ。', { wait: false, yomi: 'ダブルボトムは、同じくらいの安値を、にかいつけて、そこになる形のことだ。' });
    E.tw(wl, 1.4, { draw: [0, 1] }, 'inOut', .2); E.show(lb, .3, .4);
    P.circle(g, { x: 790, y: 530, w: 70, h: 70, delay: L.dur * .5, dur: .35 });
    P.circle(g, { x: 1090, y: 535, w: 70, h: 70, delay: L.dur * .65, dur: .35 });
    E.at(L.end);
    E.say('hat', '2回目の安値のところを、二番底と呼ぶことがある。', { yomi: 'にかいめの安値のところを、にばんぞこと呼ぶことがある。' });
    E.say('hat', '投稿の画面の2つの丸も、4月28日と5月13日の、安値のあたりを、囲んでいた。', { yomi: '投稿の画面の、ふたつの丸も、4月28日と5月13日の、やすねのあたりを、囲んでいた。' });
    E.wait(.3);
  });

  E.scene({ name: 't37_chart' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = dailyChart(sc, '日足　2026年4月28日〜5月13日');
    P.look(sc.cam, { s: 1.9, cx: C.at(1316, 0).x, cy: C.at(0, 430).y, dur: 1.4, delay: .2 });
    const l1 = C.at(PX['4/28'], PY(625)), l2 = C.at(PX['5/13'], PY(630));
    const a = tag(g, l1, '4/28 安値 625円', -60, 10, '#1b8a5a'), b = tag(g, l2, '5/13 安値 630円', -60, 10, '#1b8a5a');
    // 元資料のチャートの T37 の青い点（5/13 の終値 795円の位置）
    const tp = C.at(PX['5/13'], PY(795));
    const tt = tag(g, tp, 'T37の印は、5/13の終値 795円の位置', 18, -36, P.T_BLUE, 15);
    const nt = E.div(sc.root, { left: 260, top: 700, width: 1400, padding: '16px 30px 18px', borderRadius: 22, background: '#2a2430', border: '3px solid #ffd84a', boxSizing: 'border-box', textAlign: 'center', font: '900 32px/1.45 Zen', color: '#ffd84a' },
      'Tの印は、投稿した日の終値の位置に置いてある。<br><span style="font:800 26px/1.5 Round;color:#f3e6c8">投稿した時の値段の位置ではない（元資料 p35）。T37の画面の15:00の値段は765円</span>').ini({ o: 0 });
    E.wait(1.6);
    let L = E.say('hat', '1回目の安値は、4月28日の625円だ。', { wait: false, yomi: 'いっかいめの安値は、4月28日の、ろっぴゃくにじゅうごえんだ。' });
    P.circle(g, { x: l1.x, y: l1.y, w: 26, h: 26, sw: 3, delay: .2, dur: .3 }); E.pop(a, .3, .3);
    E.at(L.end);
    L = E.say('hat', '2回目の安値は、5月13日の630円だ。', { wait: false, yomi: 'にかいめの安値は、5月13日の、ろっぴゃくさんじゅうえんだ。' });
    P.circle(g, { x: l2.x, y: l2.y, w: 26, h: 26, sw: 3, delay: .2, dur: .3 }); E.pop(b, .3, .3);
    E.at(L.end);
    E.say('hat', '2つの安値の差は、5円だった。', { yomi: 'ふたつの安値の差は、ごえんだった。' });
    L = E.say('hat', 'このチャートの、5月13日の青い点が、T37の印だ。', { wait: false, yomi: 'このチャートの、5月13日の青い点が、ティーさんじゅうななの、しるしだ。' });
    P.circle(g, { x: tp.x, y: tp.y, w: 22, h: 22, sw: 3, color: '#2b68d8', delay: L.dur * .4, dur: .3 });
    E.at(L.end);
    L = E.say('hat', 'この印は、5月13日の終値、795円の位置に、置いてある。', { wait: false, yomi: 'このしるしは、5月13日の、おわりね、ななひゃくきゅうじゅうごえんの位置に、置いてある。' });
    E.pop(tt, .3, L.dur * .4);
    E.at(L.end);
    L = E.say('hat', '元資料のチャートでは、Tの印は、投稿した日の終値の位置に、置いてある。', { wait: false, yomi: 'もとしりょうのチャートでは、ティーのしるしは、投稿した日の、おわりねの位置に、置いてある。' });
    E.tw(nt, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '投稿した時の値段の、位置ではない。投稿の画面の、15時00分の値段は、765円だった。', { yomi: '投稿した時の値段の、位置ではない。投稿の画面の、15時の値段は、ななひゃくろくじゅうごえんだった。' });
    E.wait(.4);
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
    // 5/13 の高値は元資料の本文にないので、上のヒゲは描かない。そのことを図に書く
    const nh = E.div(g, { left: 180, top: 168, font: '800 22px/1.3 Round', color: 'rgba(243,230,200,.85)', whiteSpace: 'nowrap' }, 'この日の高値の数字は、元資料の本文にないので、上のヒゲは描いていない').ini({ o: 0 });
    // 投稿の画面の時刻（15:00）の値段と、この日の終値（15:30）を分ける札
    const tm = E.div(g, { left: 1000, top: 230, width: 880, padding: '18px 26px 20px', borderRadius: 22, background: 'rgba(255,255,255,.96)', boxShadow: '0 12px 24px rgba(0,0,0,.35)', boxSizing: 'border-box' },
      '<div style="font:900 30px/1.3 Zen;color:#262236;margin-bottom:10px">投稿の画面の値段と、終値は、別の時点</div>' +
      `<div style="font:900 28px/1.45 Noto;color:${P.T_BLUE}">15:00の画像の値段は、765円</div><div style="font:800 21px/1.4 Round;color:#5a6476">その時点までの高値は769円。投稿の添付画像の表示</div>` +
      '<div style="font:900 28px/1.45 Noto;color:#c62828;margin-top:10px">終値の795円は、15:30の取引の終わりの値段</div><div style="font:800 21px/1.4 Round;color:#5a6476">元資料の日足の値段。15:00から、取引が終わる15:30までの値動きは、<br>1分ごとの値段のデータ（分足）が元資料にないので、分からない</div>').ini({ o: 0 });
    E.wait(.4);
    E.say('hat', 'ローソク足は、1日の、始値、高値、安値、終値を、1本で表したものだ。', { yomi: 'ローソクあしは、いちにちのはじめねと、たかねと、やすねと、おわりねを、いっぽんで表したものだ。' });
    let L = E.say('hat', '始値は、その日の最初の値段だ。5月13日の始値は、765円。', { wait: false, yomi: 'はじめねは、その日の最初の値段だ。5月13日のはじめねは、ななひゃくろくじゅうごえん。' });
    E.show(body, .3, .2); E.show(lop, .3, L.dur * .6);
    E.at(L.end);
    L = E.say('hat', '安値は630円で、終値は795円だった。', { wait: false, yomi: 'やすねは、ろっぴゃくさんじゅうえんで、おわりねは、ななひゃくきゅうじゅうごえんだった。' });
    E.tw(wick, .5, { sy: [0, 1] }, 'out', .1); E.show(lol, .3, .2);
    E.show(lo, .3, L.dur * .6);
    E.at(L.end);
    L = E.say('hat', 'この日の高値の数字は、元資料の本文には、書かれていない。', { wait: false, yomi: 'この日の、たかねの数字は、もとしりょうの本文には、書かれていない。' });
    E.show(nh, .3, .3);
    E.at(L.end);
    L = E.say('hat', '下ヒゲは、太い部分の下の端の765円から、安値の630円までで、135円ある。', { wait: false, yomi: 'したヒゲは、太い部分の下の端の、ななひゃくろくじゅうごえんから、やすねの、ろっぴゃくさんじゅうえんまでで、ひゃくさんじゅうごえんある。' });
    E.show(br, .3, .2); E.pop(brl, .4, L.dur * .6); E.sfx('ding', { delay: L.dur * .6, gain: .5 });
    E.at(L.end);
    E.say('hat', 'この日は、630円まで下がったあと、終値では、795円まで戻した。', { yomi: 'この日は、ろっぴゃくさんじゅうえんまで下がったあと、おわりねでは、ななひゃくきゅうじゅうごえんまで戻した。' });
    const mk = P.mark(sc.root, '安値圏の反発は確認', { x: 1340, y: 120, color: '#1b8a5a', size: .75, rot: 7, w: 340 });
    L = E.say('hat', '元資料は、これを、安値圏の反発は確認、としている。', { wait: false, yomi: 'もとしりょうは、これを、やすねけんのはんぱつは確認、としている。' });
    P.stampIn(mk, L.dur * .5);
    E.at(L.end);
    E.say('hat', '安値に近い値段のところから、値段が戻ったことは、確かめられた、という意味だ。', { yomi: 'やすねに近い値段のところから、値段が戻ったことは、確かめられた、という意味だ。' });
    E.hide(mk, .3);
    L = E.say('hat', '投稿の画面の、15時00分の値段は、765円だった。', { wait: false, yomi: '投稿の画面の、15時の値段は、ななひゃくろくじゅうごえんだった。' });
    E.tw(tm, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('pop', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', 'その時点までの高値は、769円だった。', { yomi: 'その時点までの、たかねは、ななひゃくろくじゅうきゅうえんだった。' });
    E.say('hat', '終値の795円は、15時30分に、取引が終わった時の値段だ。', { yomi: 'おわりねの、ななひゃくきゅうじゅうごえんは、15時30分に、取引が終わった時の値段だ。' });
    E.say('hat', '15時00分から、取引の終わりまでに、値段がどう動いたかは、分からない。', { yomi: '15時から、取引の終わりまでに、値段がどう動いたかは、分からない。' });
    E.say('hat', '元資料も、1分ごとの値段のデータは、調べた中に入っていない、と書いている。', { yomi: 'もとしりょうも、いっぷんごとの値段のデータは、しらべた中に入っていない、と書いている。' });
    E.hide(tm, .3);
    const nb = panel(g, { x: 1000, y: 660, w: 860, h: 140, size: 32, dark: true, html: '<div style="text-align:center">5月29日に、安値587円がついた<div style="font:800 23px/1.5 Round;color:#f3e6c8">4月28日の625円よりも、5月13日の630円よりも下（第10章）</div></div>' });
    L = E.say('hat', 'ただ、そのあと、5月29日に、安値587円がついた。', { wait: false, yomi: 'ただ、そのあと、5月29日に、やすね、ごひゃくはちじゅうななえんがついた。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('drop', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '4月28日の625円と、5月13日の630円の、どちらよりも、下の値段だ。', { yomi: '4月28日の、ろっぴゃくにじゅうごえんと、5月13日の、ろっぴゃくさんじゅうえんの、どちらよりも、下の値段だ。' });
    E.say('hat', '元資料の検証メモの、625円を割った、というのは、このことだ。', { yomi: 'もとしりょうの、けんしょうメモの、ろっぴゃくにじゅうごえんを割った、というのは、このことだ。' });
    E.say('hat', '5月29日のことは、第10章で、くわしく見る。', { yomi: '5月29日のことは、だいじゅっしょうで、くわしく見る。' });
    const call = P.eveCall(g, ['normal', 'surprise'], { x: 1560, y: 330, w: 300, h: 240 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '下ヒゲで戻した日はあったけど、そのあと、もっと安い値段がついたんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: 'したヒゲで、戻した日はあったけど、そのあと、もっと安い値段がついたんだねー。' });
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
    E.say('hat', '5月14日の、15時30分。これも、取引が終わったあとの開示だ。', { yomi: '5月14日の、15時30分。これも、取引が終わったあとの、かいじだ。' });
    E.say('hat', 'エスポアは、同じ七飯町の、仁山にある、蓄電池の用地の取得も、決議した。', { yomi: 'エスポアは、同じ、ななえちょうの、にやまにある、ちくでんちの用地の取得も、決議した。' });
    E.say('hat', '取得価格は、非公表だ。いくらで取得するのかは、公表されていない。', { yomi: '取得価格は、ひこうひょうだ。いくらで取得するのかは、公表されていない。' });
    E.tw(i36, .35, { o: 0, y: -30 }, 'in2');
    const hd = E.div(g, { left: 260, top: 200, width: 1400, display: 'flex', font: '900 30px/1.2 Zen', color: '#ffd84a', textAlign: 'center' }, '<span style="width:400px">用地（七飯町）</span><span style="width:500px">取得の決議</span><span style="width:500px">のちの売却の開示（同じ所在地）</span>').ini({ o: 0 });
    const row = (y, a, b, c) => E.div(g, { left: 260, top: y, width: 1400, height: 120, borderRadius: 20, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', textAlign: 'center', font: '900 40px/1.2 Noto', color: '#262236', boxShadow: '0 10px 22px rgba(0,0,0,.3)' }, `<span style="width:400px;font-family:Zen">${a}</span><span style="width:500px;color:#b8651a">${b}</span><span style="width:500px;color:#b8651a">${c}</span>`).ini({ o: 0 });
    const r1 = row(260, '上軍川', '5/1（I35）', '6/30（I42）'), r2 = row(410, '仁山', '5/14（I36）', '7/30（I44）');
    E.show(hd, .3, .3);
    E.tw(r1, .4, { o: [0, 1], x: [-40, 0] }, 'back', .4); E.sfx('slide', { delay: .4 });
    E.tw(r2, .4, { o: [0, 1], x: [-40, 0] }, 'back', .7); E.sfx('slide', { delay: .7 });
    E.wait(1.2);
    E.say('hat', 'この2つの用地は、のちに、同じ場所の、用地と権利を売却する開示が出る。', { yomi: 'このふたつの用地は、のちに、同じ場所の、用地と権利を売却する、かいじが出る。' });
    E.say('hat', '上軍川は、6月30日のI42。仁山は、7月30日のI44だ。', { yomi: 'かみいくさがわは、6月30日の、アイよんじゅうに。にやまは、7月30日の、アイよんじゅうよんだ。' });
    E.say('hat', '元資料も、取得の開示と、のちの売却の開示は、所在地が対応する、としている。', { yomi: 'もとしりょうも、取得の、かいじと、のちの売却の、かいじは、しょざいちが対応する、としている。' });
    E.say('hat', '所在地が対応する、というのは、同じ場所の用地だ、ということだ。', { yomi: 'しょざいちが対応する、というのは、同じ場所の用地だ、ということだ。' });
    E.say('hat', '売却のことは、第12章と、第13章で見る。', { yomi: '売却のことは、だいじゅうにしょうと、だいじゅうさんしょうで見る。' });
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
    E.say('hat', '元資料の要約では、海帆と、エスポアの、株を持つ人が重なっている、という見方だ。', { yomi: 'もとしりょうの要約では、かいはんと、エスポアの、株を持つ人が重なっている、という見方だ。' });
    E.say('hat', 'そのうえで、この日の朝に、売りが出た、と推測した投稿だ。');
    E.say('hat', '海帆は、別の上場会社だ。くわしくは、第17章で見る。', { yomi: 'かいはんは、別の、じょうじょうがいしゃだ。くわしくは、だいじゅうななしょうで見る。' });
    E.say('hat', 'カードの区分の需給は、買いたい人と、売りたい人の、釣り合いのことだ。', { yomi: 'カードの区分の、じゅきゅうは、買いたい人と、売りたい人の、釣り合いのことだ。' });
    const m = P.mark(g, '未確認', { x: 1300, y: 430, color: '#c62828', size: .85, rot: 8, w: 220 });
    E.say('hat', '株を持つ人が、本当に重なっているのかは、確かめられていない。');
    E.say('hat', '朝に売ったのが、誰だったのかも、確かめられていない。');
    let L = E.say('hat', '元資料の検証メモは、この2つを、未確認としている。', { wait: false, yomi: 'もとしりょうの、けんしょうメモは、このふたつを、みかくにんとしている。' });
    P.stampIn(m, L.dur * .5);
    E.at(L.end);
    E.say('hat', '元資料が値動きの確認に使っているのは、公開されている値段と、出来高だ。', { yomi: 'もとしりょうが、値動きの確認に使っているのは、公開されている値段と、できだかだ。' });
    E.say('hat', '元資料は、値段と出来高だけでは、売り買いの相手や、意図は、決められない、としている。', { yomi: 'もとしりょうは、値段と、できだかだけでは、売り買いの相手や、意図は、決められない、としている。' });
    const pr = panel(g, { x: 360, y: 560, w: 1200, h: 130, size: 44, html: '<span style="font:800 30px Round;color:#6a6066">5/18</span><span style="color:#1b8a5a">安値 689円</span><span style="color:#2b68d8">終値 779円</span>' });
    L = E.say('hat', '検証メモにある、この日の値段は、安値が689円、終値が779円だ。', { wait: false, yomi: 'けんしょうメモにある、この日の値段は、やすねが、ろっぴゃくはちじゅうきゅうえん、おわりねが、ななひゃくななじゅうきゅうえんだ。' });
    rise(pr, .2);
    E.at(L.end);
    E.say('hat', '安値の689円が、朝についたのかどうかも、日足の値段からは、分からない。', { yomi: 'やすねの、ろっぴゃくはちじゅうきゅうえんが、朝についたのかどうかも、ひあしの値段からは、分からない。' });
    E.say('hat', '値段の数字は確かめられるが、この数字からも、売った人までは、分からない。');
    E.wait(.4);
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
    const n = P.kNotice(g, { x: 40, y: 340, w: 1840, size: 26, posts: true });
    E.show(n, .6, .2);
    E.wait(6.0);
  });
  E.bgmStop(2.5, -2.5);
  E.finish();
}
