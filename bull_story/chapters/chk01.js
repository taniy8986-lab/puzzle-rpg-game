// 完全版 第1章「上昇は、投稿より前に」（2024年1〜6月。冒頭は2026年10月16日）
// 台本: story/k/k01_上昇は、投稿より前に.md　元資料 p1・p2・p5・p9・p11・p16・p19・p24・p25・p35（冒頭の板は証券会社アプリの表示）
// 投稿は元資料の要約（本人の見解）。有名投資家の名前・アカウントは出さない。価格は分割調整後
'use strict';
E.chapter('k01');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;
  // 10/16 15:30 の板（証券会社アプリの表示）
  const BOOK = [['sell', 11, 11700], ['sell', 10, 20400], ['sell', 9, 3200], ['sell', 8, 21000], ['sell', 7, 1300], ['sell', 6, 11000], ['sell', 5, 32100], ['sell', 4, 12700], ['buy', 3, 52300], ['buy', 2, 210000], ['buy', 1, 376000]];

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

  /* ============================================================ S0 アバン：最後の板 */
  E.scene({ name: 'avant_board' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: 1.2, gain: .7 });
    P.slate(g);
    const tt = E.div(g, { left: 0, top: 80, width: W, textAlign: 'center', font: '900 44px/1.2 Zen', color: '#f3e6c8' }, '2026年10月16日 15:30　最後の板').ini({ o: 0 });
    E.show(tt, .5, .5);
    const bd = P.orderBook(g, { x: 560, y: 160, book: BOOK, last: 3, rh: 50 });
    bd.in(.6);
    const pill = E.div(g, { left: 80, top: 360, width: 420, height: 150, borderRadius: 24, background: '#ffd84a', color: '#3a2c10', textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      '<div style="font:900 64px/1.1 Noto;padding-top:22px">終値 3円</div><div style="font:800 26px/1.4 Round;margin-top:8px">最終売買日</div>').ini({ o: 0 });
    E.tw(pill, .4, { o: [0, 1], y: [30, 0] }, 'back', 1.6); E.sfx('dun', { delay: 1.6, gain: .6 });
    P.note(sc.root, '板：2026/10/16 15:30 証券会社アプリの表示（元資料の外）', { x: 1180, y: 896, size: 22, dark: true });
    E.wait(2.2);
    E.narr('2026年10月16日。エスポアの、最後の値段は、3円だった。');
    E.narr('この日は、最終売買日。市場で、この株を売り買いできる、最後の日だった。');
    E.narr('これは、その日の15時30分の板。値段ごとに、売りと買いの注文の株数が、並んでいる。', { yomi: 'これは、その日の、15時30分の、いた。値段ごとに、売りと買いの、注文の株数が、並んでいる。' });
    E.wait(.3);
  });

  /* ============================================================ S0b 月足で、2年前へ */
  E.scene({ name: 'avant_monthly' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('11'), { x: 80, y: 150, w: 1760 });
    P.note(sc.root, '月足（分割調整後）2018年1月〜2026年10月（元資料 p11）', { x: 1180, y: 896, size: 22, dark: true });
    C.draw(3.0, .3);
    E.wait(1.2);
    E.narr('でも、2年前。この株は、ずっと上にいた。');
    const peak = C.at(1882.5, 240), low = C.at(1691, 572), last = C.at(2413, 605);
    P.look(sc.cam, { s: 1.45, cx: (peak.x + last.x) / 2 - 60, cy: 420, dur: 1.4, delay: .1 });
    let L = E.narr('195円から、1,880円へ。そして、3円へ。', { wait: false, yomi: 'ひゃくきゅうじゅうごえんから、せんはっぴゃくはちじゅうえんへ。そして、さんえんへ。' });
    const lab = (pt, txt, c, d, dx = 0, dy = -70) => {
      const n = E.div(g, { left: pt.x + dx - 110, top: pt.y + dy, width: 220, textAlign: 'center', font: '900 34px/1.2 Noto', color: '#fff', textShadow: `0 0 10px ${c}, 0 3px 0 ${c}`, whiteSpace: 'nowrap' }, txt).ini({ o: 0 });
      E.pop(n, .35, d); E.sfx('pop', { delay: d, gain: .5 });
      P.circle(g, { x: pt.x, y: pt.y, w: 70, h: 70, color: c, dur: .35, delay: d, sound: false });
      return n;
    };
    lab(low, '195円', '#2b68d8', .4, -90, -100);
    lab(peak, '1,880円', '#c62828', L.dur * .45, 0, -80);
    lab(last, '3円', '#c62828', L.dur * .8, -40, -90);
    E.at(L.end);
    E.say('hat', '195円は、2023年の年末の値段。1,880円は、2024年の高値だ。', { yomi: 'ひゃくきゅうじゅうごえんは、2023年の、年末の値段。せんはっぴゃくはちじゅうえんは、2024年の高値だ。' });
    E.say('hat', 'その高値から、最後の終値の3円まで、マイナス99.84％だ。', { yomi: 'その高値から、最後のおわりねの、さんえんまで、マイナス、キュージューキューテンハチヨンパーセントだ。' });
    E.say('hat', '値段は、どれも、あとで話す株の分割に合わせて、単位をそろえてある。', { yomi: '値段は、どれも、あとで話す、株の分割に合わせて、たんいを、そろえてある。' });
    E.narr('何が起きていたのか。投稿と、会社の発表と、ローソク足を、時刻で並べてみる。');
    E.wait(.4);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 5.0 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 1, title: '上昇は、投稿より前に', sub: '2024年1月〜6月', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 三つの道具 */
  E.scene({ name: 'tools' }, sc => {
    const g = sc.cam;
    E.bgm('villain', { fadeIn: .6, gain: .8 });
    const { hat, call, bd } = P.boardScene(g, ['normal', 'surprise', 'anxious']);
    E.div(bd, { left: 0, top: 26, width: 1020, textAlign: 'center', font: '900 40px/1.2 Zen', color: '#2a2430' }, '三つを、時刻で並べて読む');
    const rowT = E.div(bd, { left: 40, top: 88, width: 940, height: 162, borderRadius: 18, background: '#eef3fc', display: 'flex', alignItems: 'center' },
      `<span style="flex:none;margin-left:24px;width:96px;height:96px;border-radius:50%;background:${P.T_BLUE};color:#fff;font:900 56px/96px Noto;text-align:center">T</span>
       <div style="margin-left:26px"><div style="font:900 36px/1.3 Zen;color:${P.T_BLUE}">ある有名投資家の投稿</div><div style="font:800 25px/1.45 Round;color:#3d4757">カードの文は、元資料がまとめた要約で、本人の見解。<br>チャートの印は、投稿を含む日の終値の位置。<br>投稿した瞬間の値段ではない</div></div>`).ini({ o: 0 });
    const rowI = E.div(bd, { left: 40, top: 258, width: 940, height: 166, borderRadius: 18, background: '#fdf3e6', display: 'flex', alignItems: 'center' },
      `<span style="flex:none;margin-left:24px;width:96px;height:96px;border-radius:50%;background:${P.I_ORANGE};color:#fff;font:900 56px/96px Noto;text-align:center">I</span>
       <div style="margin-left:26px"><div style="font:900 36px/1.3 Zen;color:#b8651a">会社のIR（適時開示）</div><div style="font:800 25px/1.45 Round;color:#5c4a33">発表した時刻つき。チャートの印は、公表した日の位置。<br>引け後の発表は、値動きを、次の取引日から比べる<br>引け後は、その日の取引が終わったあと（一般的な説明）</div></div>`).ini({ o: 0 });
    const candle = (c, up) => `<svg viewBox="0 0 40 100" width="40" height="100"><rect x="18" y="4" width="4" height="92" fill="${c}"/><rect x="6" y="${up ? 22 : 30}" width="28" height="${up ? 50 : 44}" rx="3" fill="${c}"/></svg>`;
    const rowC = E.div(bd, { left: 40, top: 432, width: 940, height: 222, borderRadius: 18, background: '#f3eee4', display: 'flex', alignItems: 'center' },
      `<div style="flex:none;margin-left:22px;display:flex;gap:8px">${candle('#d9525e', true)}${candle('#17906f', false)}</div>
       <div style="margin-left:26px"><div style="font:900 36px/1.3 Zen;color:#2a2430">ローソク足</div>
       <div style="font:800 25px/1.5 Round;color:#3d3540">1本が、ある期間の値動き（日足は1日、月足は1か月）<br>始値は期間の最初の値段、終値は最後の値段<br><b style="color:#d9525e">赤</b>は、終値が始値と同じか上<br><b style="color:#17906f">緑</b>は、終値が始値より下</div></div>`).ini({ o: 0 });
    const warn = E.div(bd, { left: 40, top: 664, width: 940, height: 76, borderRadius: 14, background: '#2a2430', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 28px/1.3 Zen', color: '#ffd84a', whiteSpace: 'nowrap' },
      '前後の値動きは、投稿が原因だった証明ではない').ini({ o: 0 });
    const tk = { talk: hat, talkAmp: 2 };
    E.wait(.5);
    E.say('hat', '今回は、三つを並べて読む。', { ...tk, yomi: '今回は、みっつを、ならべて読む。' });
    let L = E.say('hat', '青いTは、ある有名投資家の投稿だ。', { ...tk, wait: false, yomi: '青いティーは、ある有名投資家の投稿だ。' });
    E.tw(rowT, .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    E.say('hat', 'カードに書くのは、投稿の文そのものではない。元資料が、投稿をまとめた要約だ。', tk);
    E.say('hat', '元資料は、この動画のもとにした、調査の資料だ。', tk);
    E.say('hat', '投稿と、会社のIRと、ローソク足を、時刻で照合している。', { ...tk, yomi: '投稿と、会社のアイアールと、ローソクあしを、時刻で照合している。' });
    E.say('hat', '要約に書かれている見方は、投稿した本人のものだ。', tk);
    E.say('hat', 'チャートのTの印は、投稿を含む日の終値の位置だ。投稿した瞬間の値段じゃない。', { ...tk, yomi: 'チャートの、ティーのしるしは、投稿を含む日の、おわりねの位置だ。投稿した瞬間の値段じゃない。' });
    L = E.say('hat', '橙のIは、会社のIRだ。ここでは、適時開示という、会社の正式な発表を使う。', { ...tk, wait: false, yomi: 'だいだいのアイは、会社のアイアールだ。ここでは、てきじかいじという、会社の正式な発表を使う。' });
    E.tw(rowI, .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    E.say('hat', '適時開示は、投資の判断に関わる情報を、会社が、すぐに公表する仕組みだ。', { ...tk, yomi: 'てきじかいじは、投資の判断に関わる情報を、会社が、すぐに公表する仕組みだ。' });
    E.say('hat', 'Iのカードには、発表した時刻が付いている。チャートのIの印は、公表した日の位置だ。', { ...tk, yomi: 'アイのカードには、発表した、じこくが付いている。チャートの、アイのしるしは、公表した日の位置だ。' });
    E.say('hat', '引け後というのは、その日の取引が、終わったあと、という意味だ。', { ...tk, yomi: 'ひけごというのは、その日の取引が、終わったあと、という意味だ。' });
    E.say('hat', '取引時間内というのは、市場で、売り買いが続いている時間の中だ。', { ...tk, yomi: 'とりひきじかんないというのは、市場で、売り買いが続いている時間の中だ。' });
    E.say('hat', '引け後に発表した日の値段は、発表の前に、もう付いている。', { ...tk, yomi: 'ひけごに発表した日の値段は、発表の前に、もう付いている。' });
    E.say('hat', 'だから、引け後の発表は、次の取引日の値動きから比べる。', { ...tk, yomi: 'だから、ひけごの発表は、次の取引日の、値動きから比べる。' });
    L = E.say('hat', 'そして、ローソク足。ある期間の値動きを、1本で表したものだ。', { ...tk, wait: false, yomi: 'そして、ローソクあし。ある期間の値動きを、いっぽんで表したものだ。' });
    E.tw(rowC, .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    E.say('hat', '日足は、1日で1本。週足は、1週間で1本。月足は、1か月で1本だ。', { ...tk, yomi: 'ひあしは、いちにちで、いっぽん。しゅうあしは、いっしゅうかんで、いっぽん。つきあしは、いっかげつで、いっぽんだ。' });
    E.say('hat', '最初に見たチャートは、月足だ。', { ...tk, yomi: '最初に見たチャートは、つきあしだ。' });
    E.say('hat', '始値は、その期間の、最初の値段。終値は、最後の値段だ。', { ...tk, yomi: 'はじめねは、その期間の、最初の値段。おわりねは、最後の値段だ。' });
    E.say('hat', '高値は、いちばん高い値段。安値は、いちばん低い値段だ。', { ...tk, yomi: 'たかねは、いちばん高い値段。やすねは、いちばん低い値段だ。' });
    E.say('hat', '赤は、終値が始値と同じか上。緑は、終値が始値より下。', { ...tk, yomi: '赤は、おわりねが、はじめねと同じか上。緑は、おわりねが、はじめねより下。' });
    E.set(call, { face: 'surprise' });
    E.say('eve', '投稿のあとに上がってたら、その投稿で上がったってこと〜？', { talk: call, talkAmp: 3, yomi: '投稿のあとに上がってたら、その投稿で上がったってことー？' });
    L = E.say('hat', 'そうとは限らない。前後の値動きだけでは、原因かどうかは分からない。', { ...tk, wait: false });
    E.tw(warn, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .4); E.sfx('ding', { delay: L.dur * .4, gain: .5 });
    E.at(L.end);
    E.set(call, { face: 'normal' });
    E.say('hat', '同じころには、会社の発表など、ほかの出来事も起きている。', tk);
    E.say('hat', '値動きだけでは、どの出来事が効いたのかを、区別できない。', tk);
    E.say('hat', 'だから、時刻を一つずつ並べる。投稿の時刻、発表の時刻、値段がついた日。', tk);
    E.say('hat', '並べて分かるのは、どれが先で、どれが後か、という順番だ。', { ...tk, yomi: 'ならべて、わかるのは、どれが先で、どれが後か、という順番だ。' });
    E.wait(.4);
  });

  /* ============================================================ S3 1株→3株 */
  E.scene({ name: 'split' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '1株を、3株に分けた（2025年10月）', 44);
    E.show(tt, .3);
    const coin = (x, y, s, txt, sub) => E.div(g, { left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #ffe9a3, #e0b23c 60%, #b8861c)', boxShadow: '0 10px 24px rgba(0,0,0,.4), inset 0 -6px 0 rgba(0,0,0,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', color: '#5a3d08' },
      `<div style="font:900 ${s * .2}px/1.1 Zen">${txt}</div><div style="font:900 ${s * .13}px/1.2 Noto">${sub}</div>`).ini({ o: 0 });
    const big = coin(560, 400, 300, '1株', '分ける前');
    const smalls = [0, 1, 2].map(i => coin(1180 + i * 230, 400, 200, '1株', '分けたあと'));
    const arrow = E.div(g, { left: 760, top: 350, font: '900 90px/1 Zen', color: '#ffd84a' }, '→').ini({ o: 0 });
    const rule = E.div(g, { left: 200, top: 586, width: 1280, height: 100, borderRadius: 20, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', font: '900 40px/1 Zen', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      '<span>10月22日より前の値段は、<b style="color:#c62828">3で割る</b></span><span>前の出来高は、<b style="color:#2b68d8">3倍にする</b></span>').ini({ o: 0 });
    const exA = E.div(g, { left: 200, top: 704, width: 1280, textAlign: 'left', font: '800 26px/1.45 Round', color: '#e8dcc0', whiteSpace: 'nowrap' }, '2025/10/22　権利落ち：この日から、値段は、分けたあとの単位で付く<br>2025/10/24　効力発生：株が、実際に3株に分かれる（一般的な説明）').ini({ o: 0 });
    const exB = E.div(g, { left: 200, top: 786, width: 1280, textAlign: 'left', font: '800 26px/1.45 Round', color: '#ffd84a', whiteSpace: 'nowrap' }, '例：2024年6月18日の終値は、当時 4,955円。3で割ると、1,651.67円').ini({ o: 0 });
    E.wait(.4);
    let L = E.say('hat', 'もう一つ。エスポアは、2025年10月に、1株を3株に分けた。', { wait: false, yomi: 'もう一つ。エスポアは、2025年10月に、いっかぶを、さんかぶに分けた。' });
    E.pop(big, .45, .3); E.sfx('pop', { delay: .3 });
    E.show(arrow, .3, L.dur * .6);
    smalls.forEach((c, i) => { E.tw(c, .45, { o: [0, 1], x: [-(620 + i * 230) + 560, 0], s: [.6, 1] }, 'back', L.dur * .65 + i * .15); E.sfx('cash', { delay: L.dur * .65 + i * .15, gain: .4 }); });
    E.at(L.end);
    E.say('hat', '分けたあとの1株は、分ける前の1株の、3分の1にあたる。', { yomi: '分けたあとの、いっかぶは、分ける前の、いっかぶの、さんぶんのいちに、あたる。' });
    L = E.say('hat', '株が、実際に3株に分かれたのは、10月24日だ。これを、効力発生という。', { wait: false, yomi: '株が、じっさいに、さんかぶに分かれたのは、10月24日だ。これを、こうりょくはっせいという。' });
    E.tw(exA, .4, { o: [0, 1], y: [16, 0] }, 'out', .3); E.sfx('pop', { delay: .3, gain: .4 });
    E.at(L.end);
    E.say('hat', '市場の値段は、その前の10月22日から、分けたあとの単位で付いた。', { yomi: '市場の値段は、その前の、10月22日から、分けたあとの、たんいで付いた。' });
    E.say('hat', '分けたあとの株を受け取るのは、10月23日の、基準日の株主だ。', { yomi: '分けたあとの株を受け取るのは、10月23日の、きじゅんびの、かぶぬしだ。' });
    E.say('hat', '22日に買った株は、受け渡しが、23日に間に合わない。だから、分割の権利が付かない。', { yomi: 'にじゅうににちに買った株は、受け渡しが、にじゅうさんにちに、間に合わない。だから、分割の権利が付かない。' });
    E.say('hat', 'この、権利が付かなくなる日を、権利落ちという。値段も、この日から変わる。', { yomi: 'この、けんりが付かなくなる日を、けんりおちという。値段も、この日から変わる。' });
    L = E.say('hat', 'だから、10月22日より前の値段は、3で割って、あとの値段と、単位をそろえる。', { wait: false, yomi: 'だから、10月22日より前の値段は、3で割って、あとの値段と、たんいを、そろえる。' });
    E.tw(rule, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '出来高は、売り買いが成立した、株の数だ。');
    E.say('hat', '前の1株は、今の3株にあたる。だから、前の出来高は、3倍にする。', { yomi: '前の、いっかぶは、今の、さんかぶにあたる。だから、前の出来高は、さんばいにする。' });
    L = E.say('hat', 'たとえば、2024年6月18日の終値は、当時の値段で、4,955円。', { wait: false, yomi: 'たとえば、2024年6月18日の終値は、当時の値段で、4955円。' });
    E.show(exB, .4, .3);
    E.at(L.end);
    E.say('hat', '3で割ると、1,651.67円になる。', { yomi: '3で割ると、1651.67円になる。' });
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 480, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .5, { x: [420, 0] }, 'back');
    E.sfx('snort', { delay: .2 });
    E.say('pig', 'ブヒッ。見かけの暴落を、作らないためだブー。', { talk: pig, talkAmp: 4, delay: .3 });
    E.say('hat', 'そうだ。割らずに並べると、10月22日を境に、値段が、急に下がったように見える。', { yomi: 'そうだ。割らずに並べると、10月22日を、さかいに、値段が、急に下がったように見える。' });
    E.say('hat', '株を分けただけなのに、暴落したように、見えてしまうんだ。');
    E.wait(.3);
  });

  /* ============================================================ S4 2024年のブルちゃん */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull2024' }, sc => {
    const g = sc.cam;
    E.bgm('daily', { fadeIn: 1.0, gain: .75 });
    const R = P.room(g);
    P.watchlist(R.screen, [['・・・', ''], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト' });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    const tag = E.div(g, { left: 120, top: 120, padding: '10px 28px', borderRadius: 14, background: 'rgba(255,255,255,.9)', color: '#2a2430', font: '900 38px/1.3 Zen', boxShadow: '0 8px 18px rgba(0,0,0,.2)' }, '2024年').ini({ o: 0 });
    E.pop(tag, .4, .3);
    P.look(sc.cam, { s: 1.2, cx: 1100, cy: 480, dur: 4, delay: .3 });
    E.wait(.6);
    E.narr('2024年。私はまだ、エスポアという名前も、知らなかった。');
    E.wait(.4);
  });

  /* ============================================================ S5 2024年1〜6月の日足 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'daily2024h1' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const C = P.chart(g, CHART('02'), { x: 80, y: 150, w: 1760 });
    const ttl = E.div(g, { left: 80, top: 82, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '日足　2024年1月〜6月（25・75・200日線）').ini({ o: 0 });
    E.show(ttl, .4, .1);
    P.note(sc.root, '分割調整後の値段（元資料 p2）', { x: 1500, y: 896, size: 22, dark: true });
    C.draw(3.2, .3);
    E.wait(1.0);
    E.say('hat', 'これは日足だ。チャートの3本の線は、移動平均線という。', { yomi: 'これは、ひあしだ。チャートの、さんぼんの線は、いどうへいきんせんという。' });
    E.say('hat', '25日線は、その日までの、25日分の終値を、平均してつないだ線だ。', { yomi: 'にじゅうごにちせんは、その日までの、にじゅうごにちぶんの、おわりねを、平均して、つないだ線だ。' });
    E.say('hat', '75日線と、200日線も、同じ作り方だ。', { yomi: 'ななじゅうごにちせんと、にひゃくにちせんも、同じ作り方だ。' });
    E.say('hat', '2023年の年末、エスポアは195円だった。', { yomi: '2023年の年末、エスポアは、ひゃくきゅうじゅうごえんだった。' });
    E.say('hat', 'そこから、6月17日の終値1,550円まで、上がっていった。', { yomi: 'そこから、6月17日の終値、せんごひゃくごじゅうえんまで、上がっていった。' });
    // I01
    const i01 = P.icard(g, { id: 'I01', when: '2024/3/7 16:30', session: '引け後', title: '時間貸し駐車場の事業開始を発表', text: '首都圏を中心に37か所（開始予定）。<br>運営機材・権利等への投資額は約9,400万円', x: 120, y: 190, w: 760 });
    const p1 = C.at(907, 753);
    E.tw(i01, .45, { o: [0, 1], y: [30, 0] }, 'back', .2); E.sfx('notify', { delay: .2, gain: .6 });
    P.circle(g, { x: p1.x, y: p1.y, w: 60, h: 60, color: P.I_ORANGE, dur: .35, delay: .5 });
    E.say('hat', '3月7日、引け後。会社は、時間貸し駐車場の事業を始めると発表した。', { delay: .3, yomi: '3月7日、ひけご。会社は、じかんがし、ちゅうしゃじょうの事業を始めると発表した。' });
    E.say('hat', '首都圏を中心に、37か所で、始める予定だ、という内容だ。', { yomi: 'しゅとけんを中心に、37か所で、始める予定だ、という内容だ。' });
    E.say('hat', '運営の機材や、権利などへの投資額は、およそ9,400万円だ。', { yomi: '運営の、きざいや、権利などへの投資額は、およそ9400万円だ。' });
    E.say('hat', '2024年の春、値段が上がっていた時期に、会社からは、こうした事業の発表も出ていた。');
    E.tw(i01, .3, { o: 0, y: -20 }, 'in2');
    // I02
    const i02 = P.icard(g, { id: 'I02', when: '2024/3/18 17:00', session: '引け後', title: '提携の報道について説明', text: '相手先（サムライカーボンズ）から事業提携の<br>意向は示されたが、決定した事実はない', note: '報道・提案と、会社の正式決定を区別する', x: 120, y: 190, w: 760 });
    const p2 = C.at(1045, 753);
    E.tw(i02, .45, { o: [0, 1], y: [30, 0] }, 'back', .2); E.sfx('notify', { delay: .2, gain: .6 });
    P.circle(g, { x: p2.x, y: p2.y, w: 60, h: 60, color: P.I_ORANGE, dur: .35, delay: .5 });
    E.say('hat', '3月18日には、提携の報道について、説明を出している。', { delay: .3 });
    E.say('hat', '相手先の、サムライカーボンズから、事業提携の意向は、示された。');
    E.say('hat', 'でも、提携を決めた事実は、ない。会社は、そう説明した。');
    E.say('eve', '報道と、会社が決めたことは、別なんだね〜。', { yomi: '報道と、会社が決めたことは、別なんだねー。' });
    E.say('hat', 'そうだ。意向が示された、というのは、相手から、組みたいという話が来た段階だ。');
    E.say('hat', '会社が正式に決めるまでは、決まったことには、ならない。');
    E.say('hat', 'だから、提案や報道と、会社の正式な決定を、分けて読め。');
    E.tw(i02, .3, { o: 0, y: -20 }, 'in2');
    // 5/27 安値
    const lowPt = C.at(1945.5, 516);
    P.circle(g, { x: lowPt.x, y: lowPt.y, w: 90, h: 90, dur: .45, delay: .2 });
    P.look(sc.cam, { s: 1.35, cx: lowPt.x - 100, cy: lowPt.y - 120, dur: 1.2, delay: .1 });
    E.say('hat', '5月27日には、安値540円まで、下げている。', { delay: .3, yomi: '5月27日には、安値、ごひゃくよんじゅうえんまで、下げている。' });
    E.say('hat', 'そこから、また上がって、6月17日に、終値1,550円をつけた。', { yomi: 'そこから、また、あがって、6月17日に、おわりね、せんごひゃくごじゅうえんを、つけた。' });
    P.look(sc.cam, { s: 1, cx: W / 2, cy: H / 2, dur: 1.0 });
    E.wait(1.0);
  });

  /* ============================================================ S6 T01　6月18日 13時 */
  E.scene({ name: 't01' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .7 });
    P.slate(g);
    const clk = P.clock(g, { x: 180, y: 250, size: 300, min: 0, label: '2024/6/18 13:00' });
    E.tw(clk, 1.4, { min: [540, 780] }, 'inOut', .3); E.sfx('tick', { delay: .3, gain: .6 }); E.sfx('tick', { delay: .9, gain: .6 });
    const t01 = P.tcard(g, { id: 'T01', when: '2024/6/18 13:00', kind: '助言契約・株主提案', session: '取引時間内', text: 'JPIWとの助言契約を公表', note: '添付は、投資運用方針・株主提案・議決権行使などの助言契約の書面。<br>本人の保有株数や買付日は示されていない', x: 620, y: 200, w: 1160, size: 40 });
    E.tw(t01, .5, { o: [0, 1], x: [60, 0] }, 'back', 1.6); E.sfx('notify', { delay: 1.6 });
    const close = E.div(g, { left: 620, top: 690, width: 1160, height: 110, borderRadius: 20, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', font: '900 38px/1 Noto', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      '<span style="font:800 28px/1 Round;color:#6a6066">その日の終値</span><span>1,651.67円</span><span style="font:800 28px/1 Round;color:#6a6066">（当時 4,955円）</span>').ini({ o: 0 });
    E.wait(1.8);
    E.narr('6月18日、13時。ある有名投資家が、投稿した。');
    E.say('hat', 'T01は、取引時間内の投稿だ。', { yomi: 'ティーゼロイチは、とりひきじかんないの、投稿だ。' });
    E.say('hat', '元資料の要約では、JPIWとの、助言契約を公表した投稿だ。');
    E.say('hat', '投稿には、その契約の書面が、添付されていた。');
    E.say('hat', '運用の方針や、株主提案、議決権の使い方について、助言をする契約だ。');
    E.say('hat', '株主提案は、株主が、株主総会に、議案を出すことだ。');
    E.say('hat', '議決権は、株主総会で、賛成や反対を、投じる権利だ。');
    E.say('hat', '元資料は、この添付の書面も、確かめている。');
    E.say('hat', '書面には、本人が何株持っているかも、いつ買ったかも、示されていない。');
    E.say('hat', 'だから、この投稿は、契約についての投稿だ。本人が買った記録とは、別のものだ。');
    const L = E.say('hat', 'その日の終値は、1,651.67円。当時の値段で、4,955円だ。', { wait: false });
    E.tw(close, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .3);
  });

  E.scene({ name: 'before_post' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('02'), { x: 110, y: 196, w: 1700 });
    E.div(g, { left: 80, top: 82, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '上昇は、投稿より前に始まっていた');
    const a = C.at(182.5, 595), b = C.at(2239, 287), t = C.at(2259, 264);
    const dot = P.dot(g, { x: t.x, y: t.y, kind: 'T', label: 'T01 6/18 13:00', size: 30 });
    // 195 → 1,550 の区間（投稿の前）
    const span = E.div(g, { left: a.x, top: 170, width: b.x - a.x, height: 8, borderRadius: 4, background: '#ffd84a', transformOrigin: '0 50%', boxShadow: '0 0 12px rgba(255,216,74,.8)' }).ini({ sx: 0 });
    const spanLab = E.div(g, { left: 0, top: 84, width: W - 110, textAlign: 'right', font: '900 36px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '投稿の前：2023年末 195円 → 6/17 1,550円').ini({ o: 0 });
    E.wait(.6);
    let L = E.say('hat', 'よく見な。上昇は、この投稿より、ずっと前に始まっていた。', { wait: false });
    E.pop(dot, .4, .3); E.sfx('pop', { delay: .3 });
    E.tw(span, 1.4, { sx: [0, 1] }, 'inOut', L.dur * .45); E.sfx('rise', { delay: L.dur * .45, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '2023年の年末の195円から、6月17日の終値1,550円まで。', { wait: false, yomi: '2023年の年末の、ひゃくきゅうじゅうごえんから、6月17日の、おわりね、せんごひゃくごじゅうえんまで。' });
    E.show(spanLab, .4, .2);
    P.circle(g, { x: b.x, y: b.y, w: 70, h: 70, color: '#c62828', dur: .35, delay: L.dur * .6 });
    E.at(L.end);
    E.say('hat', 'ここまでの上昇は、全部、6月18日の投稿より前だ。');
    E.say('hat', 'だから、元資料の分析では、この投稿を、上昇全体の出発点としては、読めない。');
    E.say('eve', '投稿の日と、上がり始めた日は、別なんだね〜。', { yomi: '投稿の日と、上がり始めた日は、別なんだねー。' });
    E.wait(.4);
  });

  /* ============================================================ S7 I03　出来事の日と、公表日 */
  E.scene({ name: 'i03' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '出来事の日と、公表日を分ける', 44);
    E.show(tt, .3);
    const i03 = P.icard(g, { id: 'I03', when: '2024/6/19 15:00', session: '引け後', title: 'JPIWの臨時総会招集請求', text: '取締役5名の解任と、6名の選任を求める<br>臨時株主総会の招集請求を受領', x: 360, y: 150, w: 1200, size: 30 });
    // 6/18 と 6/19 の帯
    const days = [['6月18日', 220], ['6月19日', 1060]].map(([d, x]) => E.div(g, { left: x, top: 498, width: 640, height: 60, borderRadius: 14, background: 'rgba(255,255,255,.12)', border: '2px solid rgba(243,230,200,.5)', textAlign: 'center', font: '900 34px/60px Zen', color: '#f3e6c8' }, d).ini({ o: 0 }));
    const ev = (x, y, kind, id, txt) => E.div(g, { left: x, top: y, width: 600, height: 110, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', boxShadow: '0 10px 20px rgba(0,0,0,.35)', borderLeft: `12px solid ${kind === 'T' ? P.T_BLUE : kind === 'I' ? P.I_ORANGE : '#8a93a3'}` },
      `<span style="flex:none;margin-left:16px;padding:2px 12px 4px;border-radius:10px;background:${kind === 'T' ? P.T_BLUE : kind === 'I' ? P.I_ORANGE : '#8a93a3'};color:#fff;font:900 26px/1.2 Noto">${id}</span><div style="margin-left:16px;font:800 27px/1.4 Round;color:#22252b">${txt}</div>`).ini({ o: 0 });
    const e1 = ev(240, 582, 'T', 'T01', '13:00　助言契約の投稿');
    const e2 = ev(240, 706, 'x', '受領', '会社が、JPIWの請求を受け取る<br><span style="font-size:21px;color:#6a6066">（受け取った時刻の記載はない）</span>');
    const e3 = ev(1080, 582, 'I', 'I03', '15:00　会社が開示');
    E.wait(.4);
    let L = E.say('hat', '次の日、6月19日の15時。', { wait: false });
    E.tw(i03, .45, { o: [0, 1], y: [30, 0] }, 'back', .2); E.sfx('notify', { delay: .2 });
    E.at(L.end);
    E.say('hat', '会社は、JPIWから、臨時株主総会の招集請求を受けたと開示した。');
    E.say('hat', '株主総会は、株主が集まって、取締役を選ぶことなどを、決める場だ。');
    E.say('hat', '臨時株主総会は、毎年の決まった総会とは別に、開く総会だ。');
    E.say('hat', '招集請求は、会社に、総会を開くよう、求めることだ。');
    E.say('hat', '求めたのは、取締役5人の解任と、6人の選任だ。');
    E.say('hat', '今の取締役5人を辞めさせて、取締役を6人選ぶ、という中身だ。');
    L = E.say('hat', '会社が受け取ったのは、6月18日。発表は、6月19日。', { wait: false });
    days.forEach((d, i) => E.show(d, .3, .1 + i * .2));
    E.at(L.end);
    L = E.say('hat', '6月18日の欄には、13時の投稿と、会社が請求を受け取ったことを、置いた。', { wait: false });
    E.tw(e1, .35, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('pop', { delay: .3, gain: .5 });
    E.tw(e2, .35, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .55); E.sfx('pop', { delay: L.dur * .55, gain: .5 });
    E.at(L.end);
    E.say('hat', '会社が受け取った時刻は、書かれていない。');
    E.say('hat', 'だから、18日の中で、投稿と、請求の受け取りの、どちらが先かは、分からない。');
    L = E.say('hat', '6月19日の欄には、15時の、会社の開示を置いた。', { wait: false });
    E.tw(e3, .35, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('pop', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '請求が届いたのは18日でも、会社がそれを公表したのは、19日だ。');
    E.say('hat', 'だから、チャートのIの印は、公表した19日に置く。', { yomi: 'だから、チャートの、アイのしるしは、公表した19日に置く。' });
    E.say('hat', '出来事の日と、公表された日を、分けて置く。それが、この完全版のルールだ。');
    [...days, e1, e2, e3].forEach(n => E.hide(n, .3));
    const t02 = P.tcard(g, { id: 'T02', when: '2024/6/28 21:13', kind: '株主提案・総会', session: '引け後', text: 'JPIWの臨時総会招集請求資料を案内', note: 'リンク先の文書名でエスポアへの言及を確認', x: 460, y: 560, w: 1000, size: 30 });
    E.tw(t02, .4, { o: [0, 1], y: [30, 0] }, 'back', .35); E.sfx('notify', { delay: .35, gain: .6 });
    E.narr('6月28日の夜には、その請求の資料も、投稿で案内されていた。', { delay: .3 });
    E.say('hat', 'T02は、6月28日の、21時13分の投稿だ。引け後に出ている。', { yomi: 'ティーゼロニは、6月28日の、21時13分の投稿だ。ひけごに出ている。' });
    E.say('hat', '元資料の要約では、JPIWの、臨時総会の招集請求の資料を、案内した投稿だ。');
    E.say('hat', '元資料は、リンク先の文書の名前で、エスポアに触れた資料だと、確かめている。');
    E.wait(.4);
  });

  /* ============================================================ S8 ブルちゃんと師匠のノート */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_watch' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g);
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    P.look(sc.cam, { s: 1.3, cx: 1300, cy: 470, dur: 3.5, delay: .3 });
    E.wait(.8);
    E.narr('6月19日の会社の開示を読んで、私はエスポアを、ウォッチリストに入れた。');
    E.narr('臨時総会の請求を受けた会社。何が起きるのか、見ておきたかった。');
    E.wait(.3);
  });
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 360, y: 120, w: 1200, h: 760, rot: -2, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 40, font: '900 40px/1.2 Zen', color: '#6b5a40' }, '師匠（押し目おじさん）のノート');
    const line = E.chars(paper, '上がった理由は、時計で確かめろ', { left: 120, top: 300, font: '900 64px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .07));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const clk = P.clock(paper, { x: 880, y: 470, size: 200, min: 780 });
    E.tw(clk, 2.4, { min: [780, 900] }, 'inOut', 1.6);
    E.wait(1.2);
    E.narr('でも、師匠の押し目おじさんのノートには、こう書いてあった。', { yomi: 'でも、ししょうの、おしめおじさんの、ノートには、こう書いてあった。' });
    E.narr('「上がった理由は、時計で確かめろ」。', { yomi: '上がった理由は、時計で確かめろ。' });
    E.wait(.6);
  });

  /* ============================================================ S9 男爵 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .75 });
    const C = P.closeup(g, CH('baron_e_normal'), { bg: 'radial-gradient(ellipse at 50% 40%, #4a1622 0%, #200a10 75%)', imgH: 860, panelBg: 'linear-gradient(180deg,#3a121b,#1a070c)' });
    E.from(C.img, { s: .94, y: 30 }, .6, 0, 'out');
    E.wait(.5);
    E.say('baron', '値が動くと、人は、あとから理由を探す。', { talk: C.img, talkAmp: 2, yomi: 'ねが動くと、人は、あとから理由を探す。' });
    E.say('baron', 'その理由が、時計と合っているか。……確かめる者は、少ない。', { talk: C.img, talkAmp: 2, yomi: 'その理由が、時計と合っているか。確かめる者は、少ない。' });
    E.wait(.5);
  });

  /* ============================================================ S10 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 101 });
    const marks = [['T', P.T_BLUE], ['I', P.I_ORANGE]].map(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
      return n;
    });
    const st = P.sticky(g, '第2章<br>総会と、買収提案', { x: 1360, y: 120, w: 460, h: 250, rot: 5, size: 44 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第2章だブー。', { talk: pig, talkAmp: 5 });
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
