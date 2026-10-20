// 完全版 第14章「9月16日、三つの時刻」（2026年9月16日〜9月17日）
// 台本: story/k/k14_9月16日、三つの時刻.md　元資料 p9・p14・p15・p23・p24・p35・p37・p39・p40・p41・p43
// 委員会・名証の判断には主語を付ける。「3件とも架空」とは言わない。−1億868.2万円は委員会の試算
// 9/16・9/17の極小出来高を、供給枯渇の買い根拠にしない。ブルちゃんの売買はフィクション
'use strict';
E.chapter('k14');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const box = (g, { x, y, w = 700, h = 280, top = '', main = '', sub = '', c = '#262236', border = 'none', size = 50 }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 26, background: 'rgba(255,255,255,.95)', border, boxShadow: '0 12px 24px rgba(0,0,0,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 30px' },
    `${top ? `<div style="font:800 28px/1.3 Round;color:#6a6066">${top}</div>` : ''}<div style="font:900 ${size}px/1.3 Zen;color:${c};white-space:nowrap">${main}</div>${sub ? `<div style="font:800 30px/1.5 Round;color:#4a4552;margin-top:14px">${sub}</div>` : ''}`).ini({ o: 0 });
  const rise = (n, d = 0) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', d); E.sfx('pop', { delay: d, gain: .5 }); };
  const chartTitle = (sc, t) => E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, t);
  const tag = (g, pt, txt, dx, dy, c = '#262236', size = 17) => E.div(g, { left: pt.x + dx, top: pt.y + dy, padding: '3px 10px', borderRadius: 8, background: 'rgba(255,255,255,.96)', font: `900 ${size}px/1.3 Noto`, color: c, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }, txt).ini({ o: 0 });
  const fiction = sc => P.note(sc.root, 'ブルちゃんの売買はフィクションです', { x: 1440, y: 40, size: 24, dark: true });
  const card = (g, n, d = .5) => { E.tw(n, .45, { o: [0, 1], y: [30, 0] }, 'back', d); E.sfx('notify', { delay: d }); };
  const bar = (g, from, to) => P.monthBar(g, { year: 2026, start: 9, months: 2, from, to, x: 460, w: 1000 });
  // p09 日足（対数の目盛り）。9/1 から 72.5px/取引日、1,000円が y=120.5、1けた 175px
  const X09 = { '9/14': 887, '9/15': 959.5, '9/16': 1032, '9/17': 1104.5, '9/18': 1177 };
  const PY09 = p => 120.5 + (3 - Math.log10(p)) * 175;
  const dailyChart = (sc, title) => {
    const C = P.chart(sc.cam, CHART('09'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, title);
    P.note(sc.root, '分割後の値段・対数の目盛り（元資料 p9）', { x: 1380, y: 896, size: 22, dark: true });
    // 9/18 から右は、第16章まで隠す
    const c0 = C.at(1140, 95), c1 = C.at(2508, 1026);
    E.div(sc.cam, { left: c0.x, top: c0.y, width: c1.x - c0.x, height: c1.y - c0.y, background: 'linear-gradient(90deg, rgba(20,16,30,.96), rgba(20,16,30,.92))', borderLeft: '3px dashed #ffd84a' });
    E.div(sc.cam, { left: c0.x + 30, top: C.at(0, 300).y, font: '900 26px/1.4 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '9/18から<br><span style="font-size:20px;color:#f3e6c8">第16章で見る</span>');
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

  /* ============================================================ S0 アバン：9月16日の朝 */
  P.phoneScene((ph, sc) => {
    E.bgm('dark', { fadeIn: 1.0, gain: .8 });
    P.lock(ph, { date: '9月16日', week: '水曜日', time: '7:30' });
    const n1 = P.notice(ph, { title: 'エスポア（3260）　1:15', body: '調査報告書の受領と<br>調査結果', y: 330, ago: '6時間前' });
    P.notifyIn(n1, 1.0);
    E.wait(1.6);
    E.narr('9月16日の朝。目を覚ますと、夜中の1時15分に、開示が出ていた。');
    E.narr('第三者委員会の、調査の結果だった。', { yomi: 'だいさんしゃいいんかいの、調査の結果だった。' });
  }, { name: 'avant_phone', wait: .4 });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 14, title: '9月16日、三つの時刻', sub: '2026年9月16日〜9月17日', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 三つの時刻 */
  E.scene({ name: 'three_times' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .75 });
    P.slate(g);
    E.div(g, { left: 80, top: 60, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '2026年9月16日（水）　三つの時刻');
    const ax = P.dayAxis(g, { x: 160, y: 460, w: 1600, from: 0, to: 1140, open: 540, band: [[540, 690, '前場'], [750, 930, '後場']] });
    E.show(ax.root, .5, .2);
    const d1 = P.axisDot(g, ax, { m: 75, y: 460, kind: 'I', label: 'I48 01:15 調査の結果' });
    const d2 = P.axisDot(g, ax, { m: 960, y: 460, kind: 'I', label: 'I49 16:00 報告書' });
    const d3 = P.axisDot(g, ax, { m: 1020, y: 460, kind: 'I', label: 'I50 17:00 上場廃止決定', lift: 52 });
    const t1 = E.div(g, { left: 160, top: 640, width: 520, textAlign: 'center', font: '900 34px/1.3 Zen', color: '#ffd84a' }, '寄り前').ini({ o: 0 });
    const t2 = E.div(g, { left: 1300, top: 640, width: 460, textAlign: 'center', font: '900 34px/1.3 Zen', color: '#ffd84a' }, '引けのあと').ini({ o: 0 });
    E.wait(.6);
    E.say('hat', '9月16日には、3つの時刻がある。', { yomi: '9月16日には、みっつの時刻がある。' });
    let L = E.say('hat', '1つ目は、1時15分。その日の取引が始まる前の、寄り前だ。', { wait: false, yomi: 'ひとつめは、1時15分。その日の取引が始まる前の、よりまえだ。' });
    E.pop(d1, .4, L.dur * .3); E.sfx('notify', { delay: L.dur * .3 }); E.show(t1, .3, L.dur * .6);
    E.at(L.end);
    E.say('hat', 'この時刻に出たのは、第三者委員会の、調査の結果だ。', { yomi: 'この時刻に出たのは、第三者委員会の、調査の結果だ。' });
    L = E.say('hat', '2つ目は、16時。調査報告書の、全文が、公表された。', { wait: false, yomi: 'ふたつめは、16時。ちょうさほうこくしょの、全文が、公表された。' });
    E.pop(d2, .4, L.dur * .3); E.sfx('notify', { delay: L.dur * .3 });
    E.at(L.end);
    L = E.say('hat', '3つ目は、17時。会社は、上場廃止の決定を、開示した。', { wait: false, yomi: 'みっつめは、17時。会社は、上場廃止の決定を、開示した。' });
    E.pop(d3, .4, L.dur * .3); E.sfx('notify', { delay: L.dur * .3 });
    E.at(L.end);
    L = E.say('hat', '16時と17時は、どちらも、その日の取引が終わった、引けのあとだ。', { wait: false, yomi: '16時と17時は、どちらも、その日の取引が終わった、ひけのあとだ。' });
    E.show(t2, .3, L.dur * .5);
    E.at(L.end);
    E.say('hat', '9月16日の取引時間に付いた値段は、391円で、前の日の終値の471円より、安かった。', { yomi: '9月16日の取引時間についた値段は、さんびゃくきゅうじゅういちえんで、前の日の、おわりねの、よんひゃくななじゅういちえんより、安かった。' });
    E.say('hat', 'この値下がりは、17時の決定より、前に起きている。', { yomi: 'この、ねさがりは、17時の決定より、前に起きている。' });
    E.say('hat', 'だから、寄り前の知らせと、引けのあとの決定を、一つにまとめずに、分けて見る。', { yomi: 'だから、よりまえの知らせと、ひけのあとの決定を、ひとつにまとめずに、分けて見る。' });
    E.wait(.4);
  });

  /* ============================================================ S3 I48　01:15 */
  E.scene({ name: 'i48' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [9, 15], [9, 16]);
    const i48 = P.icard(g, { id: 'I48', when: '2026/9/16 01:15', session: '寄り前', title: '調査結果を寄り前に公表', text: '対象3取引のうち1件は実在性が認められず、<br>1件は当期収益計上が認められないとの調査結果', note: '委員会試算では連結純資産マイナス1億868.2万円。最終確定値ではない', x: 260, y: 130, w: 1400, size: 32 });
    card(g, i48, .5);
    E.wait(1.0);
    E.say('hat', '1時15分。会社は、第三者委員会の、調査の結果を公表した。', { yomi: '1時15分。会社は、第三者委員会の、調査の結果を公表した。' });
    E.say('hat', '第三者委員会は、一般に、会社から独立した、外部の専門家で作る、調査の委員会だ。', { yomi: '第三者委員会は、いっぱんに、会社から独立した、外部の専門家で作る、調査の委員会だ。' });
    E.say('hat', '調べていたのは、期末の月、2026年2月の、3つの取引だ。', { yomi: '調べていたのは、きまつの月、2026年2月の、みっつの取引だ。' });
    E.tw(i48, .4, { y: -20, s: .9 }, 'inOut');
    const bx = (x, t, s, c, dashed) => E.div(g, { left: x, top: 470, width: 480, height: 220, borderRadius: 24, background: 'rgba(255,255,255,.95)', border: dashed ? '4px dashed #a09070' : `5px solid ${c}`, textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="font:900 34px/1.3 Zen;color:#6a6066;padding-top:34px">${t}</div><div style="font:900 38px/1.35 Zen;color:${c};margin-top:10px">${s}</div>`).ini({ o: 0 });
    const b1 = bx(180, '1件', '実在性が<br>認められない', '#c62828'), b2 = bx(720, 'もう1件', '当期の収益計上が<br>認められない', '#b8651a'), b3 = bx(1260, '残りの1件', '左の2つの<br>どちらにも入らない', '#a09070', true);
    let L = E.say('hat', '委員会の調査では、対象の3つの取引のうち、1件は、実在性が認められなかった。', { wait: false, yomi: 'いいんかいの調査では、対象の、みっつの取引のうち、いっけんは、じつざいせいが、認められなかった。' });
    rise(b1, L.dur * .5);
    E.at(L.end);
    E.say('hat', '実在性は、その取引が、実際にあった、と言えるか、ということだ。', { yomi: 'じつざいせいは、その取引が、実際にあった、と言えるか、ということだ。' });
    L = E.say('hat', 'もう1件は、その期の収益として、計上することが、認められなかった。', { wait: false, yomi: 'もういっけんは、その期の収益として、けいじょうすることが、認められなかった。' });
    rise(b2, L.dur * .4);
    E.at(L.end);
    E.say('hat', '計上は、決算の数字に、入れることだ。', { yomi: 'けいじょうは、決算の数字に、入れることだ。' });
    E.say('hat', 'この1件で、問われたのは、収益を、どの期の決算に入れるか、という時期だ。', { yomi: 'この、いっけんで、問われたのは、収益を、どの期の決算に入れるか、という時期だ。' });
    E.say('hat', '元資料によると、委員会は、これを、利益の前倒し、と認定している。', { yomi: 'もとしりょうによると、いいんかいは、これを、利益の、まえだおし、と、にんていしている。' });
    E.say('hat', '利益の前倒しは、本来は、あとの期に入る利益を、前の期に入れることだ。', { yomi: '利益の、まえだおしは、本来は、あとの期に入る利益を、前の期に入れることだ。' });
    L = E.say('hat', '残りの1件は、この2つの、どちらにも、入っていない。', { wait: false, yomi: 'のこりの、いっけんは、この、ふたつの、どちらにも、入っていない。' });
    E.show(b3, .3, .3);
    E.at(L.end);
    E.say('hat', '3件のうち、実在性が認められなかったのは、1件だ。', { yomi: 'さんけんのうち、じつざいせいが、認められなかったのは、いっけんだ。' });
    const nb = panel(g, { x: 360, y: 730, w: 1200, h: 100, size: 34, dark: true, html: '3件すべてが「架空」とは　されていない' });
    L = E.say('hat', 'だから、3件すべてが架空、とは、されていない。', { wait: false, yomi: 'だから、さんけん、すべてが、かくう、とは、されていない。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('ding', { delay: .2, gain: .5 });
    E.at(L.end + .3);
    [b1, b2, b3, nb].forEach(n => E.hide(n, .3));
    const cal = panel(g, { x: 260, y: 500, w: 1400, h: 140, size: 40, html: '<span style="font:800 28px Round;color:#6a6066">委員会の試算</span><span style="color:#c62828">連結純資産 −1億868.2万円</span><span style="font:800 26px Round;color:#6a6066">確定値ではない</span>' });
    L = E.say('hat', '委員会の試算では、連結純資産は、マイナス1億868.2万円になる。', { wait: false, yomi: 'いいんかいの、しさんでは、れんけつじゅんしさんは、マイナス、イチオクハッピャクロクジューハッテンニまんえんになる。' });
    rise(cal, .3);
    E.at(L.end);
    // 連結純資産とは（一般的な説明）
    const dj = panel(g, { x: 260, y: 690, w: 1400, h: 110, size: 30, dark: true, html: '<span>連結純資産は、グループの会社を合わせた、持ち物から借りているものを引いた残り<span style="font:800 22px Round;color:#f3e6c8">（一般的な説明）</span></span>' });
    L = E.say('hat', '連結純資産は、グループの会社を合わせた、持ち物から、借りているものを、引いた残りだ。', { wait: false, yomi: 'れんけつじゅんしさんは、グループの会社を合わせた、持ち物から、借りているものを、引いた残りだ。' });
    E.tw(dj, .4, { o: [0, 1], y: [20, 0] }, 'back', .2);
    E.at(L.end);
    E.say('hat', 'マイナスは、借りているもののほうが、持ち物より、多い、ということだ。');
    E.say('hat', '4月24日に、会社が発表した時の、連結純資産は、プラスだった。', { yomi: '4月24日に、会社が発表した時の、れんけつじゅんしさんは、プラスだった。' });
    E.hide(dj, .3);
    const why = panel(g, { x: 260, y: 690, w: 1400, h: 110, size: 30, dark: true, html: '委員会が2つの取引を直して計算した値。会社が監査を受けて直した決算ではない' });
    L = E.say('hat', 'この数字は、委員会が、2つの取引を直して、計算し直したものだ。', { wait: false, yomi: 'この数字は、いいんかいが、ふたつの取引を直して、計算し直したものだ。' });
    E.tw(why, .4, { o: [0, 1], y: [20, 0] }, 'back', .2);
    E.at(L.end);
    E.say('hat', '会社が、監査を受けて、直した決算ではない。だから、確定値ではない。', { yomi: '会社が、監査を受けて、直した決算ではない。だから、かくていちではない。' });
    E.say('hat', '計算の中身は、第15章で、くわしく見る。', { yomi: '計算の中身は、だいじゅうごしょうで、くわしく見る。' });
    E.hide(why, .3);
    const st = panel(g, { x: 260, y: 670, w: 1400, h: 150, size: 30, dark: true, html: '<div style="text-align:center">4月24日は、監査人が、サービスを提供した証拠が足りない、とした段階<br>9月16日は、第三者委員会が調べた、調査の結果が出た段階</div>' });
    L = E.say('hat', '4月24日の時点では、監査人が、この3つの取引で、証拠が足りない、としていた。', { wait: false, yomi: '4月24日の時点では、かんさにんが、この、みっつの取引で、証拠が足りない、としていた。' });
    E.tw(st, .4, { o: [0, 1], y: [20, 0] }, 'back', .2);
    E.at(L.end);
    E.say('hat', 'サービスを、本当に提供したのか、確かめる証拠が、足りない段階だった。');
    E.say('hat', '9月16日は、第三者委員会が調べて、その結果が出た段階だ。', { yomi: '9月16日は、第三者委員会が調べて、その結果が出た段階だ。' });
    E.say('hat', '同じ3つの取引でも、4月と9月では、分かっていることの段階が違う。', { yomi: '同じ、みっつの取引でも、4月と9月では、分かっていることの段階が違う。' });
    E.wait(.4);
  });

  /* ============================================================ S4 9月16日の取引 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'mkt916' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = dailyChart(sc, '日足　2026年9月15日・16日');
    P.look(sc.cam, { s: 2.0, cx: C.at(1000, 0).x, cy: C.at(0, 300).y, dur: 1.4, delay: .2 });
    const p15 = C.at(X09['9/15'], PY09(471)), p16 = C.at(X09['9/16'], PY09(391));
    const m15 = E.div(g, { left: p15.x - 14, top: p15.y - 2, width: 28, height: 4, background: '#2b68d8' }).ini({ o: 0 });
    const t15 = tag(g, p15, '9/15 終値 471円', -158, 10, '#2b68d8'), t16 = tag(g, p16, '9/16　391円・400株', -40, 16, '#c62828');
    E.wait(1.6);
    let L = E.say('hat', '9月15日の終値は、471円。', { wait: false, yomi: '9月15日の、おわりねは、よんひゃくななじゅういちえん。' });
    E.pop(m15, .3, .3); E.pop(t15, .3, .3);
    E.at(L.end);
    L = E.say('hat', '9月16日の値段は、391円。出来高は、400株だけだった。', { wait: false, yomi: '9月16日の値段は、さんびゃくきゅうじゅういちえん。できだかは、よんひゃくかぶだけだった。' });
    P.circle(g, { x: p16.x, y: p16.y, w: 40, h: 22, sw: 3, delay: .3, dur: .3 }); E.pop(t16, .3, .4);
    E.at(L.end);
    E.say('hat', '出来高は、その日に、売り買いが成立した、株の数だ。', { yomi: 'できだかは、その日に、売り買いが成立した、株の数だ。' });
    E.say('hat', '始値は、その日の最初の値段、終値は、最後の値段だ。', { yomi: 'はじめねは、その日の最初の値段、おわりねは、最後の値段だ。' });
    E.say('hat', '高値は、一番高い値段、安値は、一番安い値段だ。', { yomi: 'たかねは、一番高い値段、やすねは、一番安い値段だ。' });
    E.say('hat', '9月16日は、この4つが、全部、391円で、同じだった。', { yomi: '9月16日は、この、よっつが、全部、さんびゃくきゅうじゅういちえんで、同じだった。' });
    E.say('hat', 'つまり、その日は、391円の、1つの値段でしか、売買が成立しなかった。', { yomi: 'つまり、その日は、さんびゃくきゅうじゅういちえんの、ひとつの値段でしか、売買が成立しなかった。' });
    E.wait(.4);
  });

  /* ============================================================ S5 ブルちゃん（売ろうとする） */
  E.trans('fade', { dur: .6, color: '#fff' });
  P.phoneScene((ph, sc) => {
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    fiction(sc);
    const scr = ph.screen, sw = ph.sw;
    E.div(scr, { left: 0, top: 0, width: sw, height: 1000, background: '#f4f6f9' });
    E.div(scr, { left: 0, top: 70, width: sw, textAlign: 'center', font: '900 30px/1.4 Zen', color: '#22252b' }, '注文の状況');
    const cd = E.div(scr, { left: 24, top: 150, width: sw - 48, height: 260, borderRadius: 18, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,.08)' });
    E.div(cd, { left: 24, top: 20, font: '900 30px/1.4 Zen', color: '#22252b' }, 'エスポア（3260）');
    E.div(cd, { left: 24, top: 80, font: '900 34px/1.4 Zen', color: '#1b8a5a' }, '売り　9/16');
    const st = E.div(cd, { left: 24, top: 150, padding: '6px 18px', borderRadius: 12, background: '#eef0f4', font: '900 32px/1.4 Zen', color: '#6a6066' }, '未約定').ini({ o: 0 });
    E.wait(1.0);
    E.narr('9月16日。私は、初めて、売ろうとした。');
    E.narr('でも、その日に成立した売買は、400株だけ。', { yomi: 'でも、その日に成立した売買は、よんひゃくかぶだけ。' });
    let L = E.narr('私の注文は、成立しなかった。', { wait: false });
    E.pop(st, .4, L.dur * .5); E.sfx('buzz', { delay: L.dur * .5, gain: .4 });
    E.at(L.end);
    E.narr('画面には、未約定、と出ていた。注文が、まだ成立していない、という意味だ。', { yomi: '画面には、みやくじょう、と出ていた。注文が、まだ成立していない、という意味だ。' });
    E.wait(.3);
  }, { name: 'bull_916', wait: .4 });

  /* ============================================================ S6 I49　16:00 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'i49' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .75 });
    P.slate(g);
    bar(g, [9, 16], [9, 16]);
    const i49 = P.icard(g, { id: 'I49', when: '2026/9/16 16:00', session: '引け後', title: '調査報告書の全文を公表', text: '匿名化等を施した調査報告書を公表。会社は従前見解との相違を述べ、<br>訂正要否・範囲を精査すると説明', note: '報告書受領・概要I48は同日01:15に先行している', x: 260, y: 140, w: 1400, size: 32 });
    card(g, i49, .5);
    E.wait(1.0);
    E.say('hat', '16時。会社は、名前などを伏せた、調査報告書の全文を公表した。');
    E.say('hat', '報告書を受け取ったことと、その概要は、1時15分に、もう公表されていた。', { yomi: '報告書を受け取ったことと、その、がいようは、1時15分に、もう公表されていた。' });
    E.say('hat', '16時に出たのは、その報告書の、全文だ。');
    E.say('hat', '会社は、報告書の内容と、会社の、これまでの見解に、違いがある、と述べた。');
    E.say('hat', 'そのうえで、訂正が必要か、必要なら、どこまでかを、精査する、と説明した。', { yomi: 'そのうえで、ていせいが必要か、必要なら、どこまでかを、せいさする、と説明した。' });
    // 訂正・精査とは（一般的な説明）
    const ex = panel(g, { x: 260, y: 640, w: 1400, h: 140, size: 30, dark: true, html: '<div style="text-align:center">訂正は、一度出した書類の中身を、直すこと<br>精査は、細かく調べること<span style="font:800 22px Round;color:#f3e6c8">（一般的な説明）</span></div>' });
    let L = E.say('hat', '訂正は、一度出した書類の中身を、直すことだ。精査は、細かく調べることだ。', { wait: false, yomi: 'ていせいは、一度出した書類の中身を、直すことだ。せいさは、細かく調べることだ。' });
    rise(ex, .2);
    E.at(L.end);
    E.say('hat', 'つまり、この時点では、訂正するかどうかも、まだ決まっていなかった。', { yomi: 'つまり、この時点では、ていせいするかどうかも、まだ決まっていなかった。' });
    E.wait(.3);
  });

  /* ============================================================ S7 I50　17:00 */
  E.scene({ name: 'i50' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [9, 16], [9, 16]);
    const i50 = P.icard(g, { id: 'I50', when: '2026/9/16 17:00', session: '引け後', title: '上場廃止決定を公表', text: '整理銘柄期間9/16～10/16、上場廃止日10/17と開示。<br>名証の廃止決定資料とも照合', note: '17:00の会社IR。9/16の場中下落より後。寄り前の調査結果I48と区別する', x: 260, y: 140, w: 1400, size: 32 });
    card(g, i50, .5);
    E.wait(1.0);
    E.say('hat', '17時。会社は、上場廃止の決定を、開示した。');
    E.say('hat', 'その日の取引が、終わったあとだ。');
    // 上場廃止・整理銘柄とは（一般的な説明）
    const exRow = (y, html) => E.div(g, { left: 260, top: y, width: 1400, height: 96, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 30px/1.3 Zen', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
    const ex1 = exRow(540, '<span><span style="color:#c62828">上場廃止</span>は、取引所で、その株の売り買いができなくなること</span>');
    const ex2 = exRow(652, '<span><span style="color:#c62828">整理銘柄</span>は、上場廃止が決まった株を、廃止の日の前日まで売り買いできる区分</span>');
    const exg = E.div(g, { left: 260, top: 758, width: 1400, textAlign: 'right', font: '800 22px/1.3 Round', color: 'rgba(243,230,200,.8)' }, '一般的な説明').ini({ o: 0 });
    let L = E.say('hat', '上場廃止は、取引所で、その株の、売り買いが、できなくなることだ。', { wait: false });
    rise(ex1, .2); E.show(exg, .3, .3);
    E.at(L.end);
    E.say('hat', '上場廃止と、整理銘柄の指定を、決めたのは、名証だ。', { yomi: '上場廃止と、せいりめいがらの指定を、決めたのは、めいしょうだ。' });
    E.say('hat', '元資料は、この会社の開示を、名証の、決定の資料とも、照らし合わせている。', { yomi: 'もとしりょうは、この会社の開示を、めいしょうの、決定の資料とも、照らし合わせている。' });
    L = E.say('hat', '整理銘柄は、上場廃止が決まった株の、区分だ。', { wait: false, yomi: 'せいりめいがらは、上場廃止が決まった株の、区分だ。' });
    rise(ex2, .2);
    E.at(L.end);
    E.say('hat', '廃止の日の前日まで、売り買いが、できるようにしておくためのものだ。', { yomi: 'はいしの日の、前日まで、売り買いが、できるようにしておくためのものだ。' });
    [ex1, ex2, exg].forEach(n => E.hide(n, .3));
    const tl = panel(g, { x: 260, y: 600, w: 1400, h: 150, size: 32, dark: true, html: '<div style="text-align:center">9月16日から10月16日までは、整理銘柄として、まだ売り買いできる<br>10月16日が最終売買日で、10月17日に上場廃止になる</div>' });
    L = E.say('hat', '整理銘柄の期間は、9月16日から10月16日まで。その間は、まだ売り買いができる。', { wait: false, yomi: 'せいりめいがらの期間は、9月16日から10月16日まで。そのあいだは、まだ売り買いができる。' });
    E.tw(tl, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('dun', { delay: .2, gain: .6 });
    E.at(L.end);
    E.say('hat', '最後に売り買いできる日、最終売買日は、10月16日だ。', { yomi: '最後に売り買いできる日、最終売買日は、10月16日だ。' });
    E.say('hat', 'そして、10月17日に、上場廃止になる。');
    E.wait(.4);
  });

  /* ============================================================ S8 名証の判断（A07） */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'meisho' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '名証が9月16日の判断で挙げた事実（元資料 p40 の要約）', 44);
    E.show(tt, .3);
    const row = (y, h, a, b) => E.div(g, { left: 120, top: y, width: 1680, height: h, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<span style="flex:none;width:300px;text-align:center;font:900 32px/1.3 Zen;color:#b8651a">${a}</span><div style="flex:1;font:900 30px/1.5 Zen;color:#262236;padding-right:30px">${b}</div>`).ini({ o: 0 });
    const r1 = row(150, 140, '収益の内容', '実在性を伴わない収益1件、代表者が関与した利益の前倒し1件');
    const r2 = row(310, 170, '監査・調査への<br>対応', '監査証拠の入手を妨げ、第三者委員会へ虚偽説明や証拠隠蔽を行った。<br>名証への照会回答にも虚偽報告が認められた');
    const r3 = row(500, 170, '問題が続いた期間', '会社の対応に起因して報告書受領を2度延期。期末から半年以上経っても<br>決算内容が適正化されず、早期解消も見込めない');
    E.wait(.3);
    E.say('hat', '名証は、エスポアの株が売り買いされている、名古屋証券取引所のことだ。', { yomi: 'めいしょうは、エスポアの株が売り買いされている、なごやしょうけんとりひきじょのことだ。' });
    E.say('hat', '名証は、9月16日の判断で、こうした事実を挙げた。', { yomi: 'めいしょうは、9月16日の判断で、こうした事実を挙げた。' });
    let L = E.say('hat', '1つ目は、収益の内容。実在性を伴わない収益が、1件あった、とした。', { wait: false, yomi: 'ひとつめは、収益の内容。じつざいせいを伴わない収益が、いっけんあった、とした。' });
    E.tw(r1, .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    E.say('hat', 'もう1件は、代表者が関与した、利益の前倒しだ、とした。', { yomi: 'もういっけんは、だいひょうしゃが関与した、利益の、まえだおしだ、とした。' });
    L = E.say('hat', '2つ目は、監査と調査への対応。監査の証拠の入手を、妨げた、とした。', { wait: false, yomi: 'ふたつめは、監査と調査への対応。監査の証拠の、にゅうしゅを、妨げた、とした。' });
    E.tw(r2, .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    E.say('hat', '監査の証拠は、監査人が、決算の数字を確かめるために、集める資料だ。', { yomi: '監査の証拠は、かんさにんが、決算の数字を確かめるために、集める資料だ。' });
    E.say('hat', '第三者委員会に、虚偽の説明や、証拠の隠蔽を行った、ともしている。', { yomi: '第三者委員会に、きょぎの説明や、証拠の、いんぺいを行った、ともしている。' });
    E.say('hat', '虚偽は、事実と違うこと。隠蔽は、隠すことだ。', { yomi: 'きょぎは、事実と違うこと。いんぺいは、隠すことだ。' });
    E.say('hat', '名証が、会社に問い合わせた、照会への回答にも、虚偽の報告が認められた、としている。', { yomi: 'めいしょうが、会社に問い合わせた、しょうかいへの回答にも、きょぎの報告が認められた、としている。' });
    L = E.say('hat', '3つ目は、問題が続いた期間だ。', { wait: false, yomi: 'みっつめは、問題が続いた期間だ。' });
    E.tw(r3, .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    E.say('hat', '会社の対応が原因で、第三者委員会の、報告書の受け取りは、2度延びた、とした。', { yomi: '会社の対応が原因で、第三者委員会の、報告書の受け取りは、にど延びた、とした。' });
    E.say('hat', '決算の期末は、2026年2月末だ。9月16日には、もう、半年以上たっていた。', { yomi: '決算の、きまつは、2026年2月末だ。9月16日には、もう、はんとしいじょう、たっていた。' });
    E.say('hat', 'それでも、決算の内容は、適正化されず、正しい形に、なっていなかった、とした。', { yomi: 'それでも、決算の内容は、てきせいかされず、正しい形に、なっていなかった、とした。' });
    E.say('hat', 'そして、名証は、この状態が、早く解消する見込みもない、と判断した。', { yomi: 'そして、めいしょうは、この状態が、早く解消する見込みもない、と判断した。' });
    // 意見不表明とは（一般的な説明）。名証の判断の札が出る前に、同じ場所に出して消す
    const ex = panel(g, { x: 120, y: 710, w: 1680, h: 120, size: 30, html: '<span>意見不表明は、十分な証拠が得られず、監査人が、決算について意見を出さないこと<span style="font:800 22px Round;color:#4a4552">（一般的な説明）</span></span>' });
    L = E.say('hat', '意見不表明は、十分な証拠が得られず、監査人が、決算について、意見を出さないことだ。', { wait: false, yomi: 'いけんふひょうめいは、十分な証拠が得られず、かんさにんが、決算について、意見を出さないことだ。' });
    rise(ex, .2);
    E.at(L.end);
    E.say('hat', 'エスポアでは、監査人が、2つの監査で、意見不表明としていた。', { yomi: 'エスポアでは、かんさにんが、ふたつの監査で、いけんふひょうめいとしていた。' });
    E.say('hat', '4月24日の、会社法の監査と、5月27日の、有価証券報告書の監査だ。', { yomi: '4月24日の、かいしゃほうの監査と、5月27日の、ゆうかしょうけんほうこくしょの監査だ。' });
    E.hide(ex, .3);
    const nb = panel(g, { x: 120, y: 710, w: 1680, h: 120, size: 30, dark: true, html: '名証は、意見不表明に加え、市場の秩序の維持が困難な場合に当たると判断（有価証券上場規程 601条8号）' });
    L = E.say('hat', '名証は、意見不表明に加えて、市場の秩序の維持が、難しい場合に当たる、と判断した。', { wait: false, yomi: 'めいしょうは、意見不表明に加えて、しじょうの、ちつじょの維持が、難しい場合に当たる、と判断した。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('dun', { delay: .2, gain: .6 });
    E.at(L.end);
    E.say('hat', 'その判断の中で、名証が挙げたのが、上の3つの事実だ。', { yomi: 'その判断の中で、めいしょうが挙げたのが、上の、みっつの事実だ。' });
    E.say('hat', '適用したのは、有価証券上場規程の、601条8号だ。', { yomi: '適用したのは、ゆうかしょうけん、じょうじょうきていの、ロッピャクイチジョウ、ハチゴウだ。' });
    E.say('hat', '有価証券上場規程は、名証が決めている、上場についての規則だ。', { yomi: 'ゆうかしょうけん、じょうじょうきていは、めいしょうが決めている、じょうじょうについての規則だ。' });
    E.wait(.4);
  });

  /* ============================================================ S9 9月17日と、細い売買 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'mkt917' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = dailyChart(sc, '日足　2026年9月15日〜17日');
    P.look(sc.cam, { s: 2.0, cx: C.at(1030, 0).x, cy: C.at(0, 300).y, dur: .01 });
    const p15 = C.at(X09['9/15'], PY09(471)), p16 = C.at(X09['9/16'], PY09(391)), p17 = C.at(X09['9/17'], PY09(311));
    E.div(g, { left: p15.x - 14, top: p15.y - 2, width: 28, height: 4, background: '#2b68d8' });
    tag(g, p15, '9/15 終値 471円', -158, 10, '#2b68d8').ini({ o: 1 });
    tag(g, p16, '9/16　391円・400株', -40, 16, '#c62828').ini({ o: 1 });
    const t17 = tag(g, p17, '9/17　311円・900株', -40, 30, '#c62828');
    E.wait(.6);
    let L = E.say('hat', '9月17日も、値段は、311円で、出来高は、900株だけだった。', { wait: false, yomi: '9月17日も、値段は、さんびゃくじゅういちえんで、できだかは、きゅうひゃくかぶだけだった。' });
    P.circle(g, { x: p17.x, y: p17.y, w: 40, h: 22, sw: 3, delay: .3, dur: .3 }); E.pop(t17, .3, .4);
    E.at(L.end);
    E.say('hat', 'この日も、始値と、高値と、安値と、終値が、全部、同じ311円だった。', { yomi: 'この日も、はじめねと、たかねと、やすねと、おわりねが、全部、同じ、さんびゃくじゅういちえんだった。' });
    E.say('hat', '9月16日と17日の、2日の出来高を、合わせても、1,300株だ。', { yomi: '9月16日と17日の、ふつかの、できだかを、合わせても、せんさんびゃくかぶだ。' });
    E.say('hat', 'その少ない売買の中で、値段は、2日で、471円から、311円まで下がった。', { yomi: 'その少ない売買の中で、値段は、ふつかで、よんひゃくななじゅういちえんから、さんびゃくじゅういちえんまで下がった。' });
    E.say('hat', '9月15日の終値と比べて、33.97％の下落だ。', { yomi: '9月15日の、おわりねと比べて、サンジューサンテンキューナナパーセントの、げらくだ。' });
    E.wait(.3);
  });

  E.scene({ name: 'thin' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '累計出来高の表（元資料 p14 の1行）', 44);
    E.show(tt, .3);
    const cols = [['対象期間', '09/16〜09/17', 340], ['価格変化', '−33.97%', 250], ['上昇日', '0.00', 220], ['下落日', '0.13', 220], ['変わらず', '0.00', 220], ['総出来高', '0.13', 230]];
    let x = 160;
    const cells = cols.map(([h, v, w], i) => {
      const n = E.div(g, { left: x, top: 200, width: w - 10, height: 220, borderRadius: 18, background: 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,.3)' },
        `<div style="font:800 28px/1.3 Round;color:#6a6066;padding-top:34px">${h}</div><div style="font:900 44px/1.6 Noto;color:#262236">${v}</div>`).ini({ o: 0 });
      x += w; return n;
    });
    E.div(g, { left: 120, top: 440, width: 1540, textAlign: 'right', font: '800 20px/1.3 Round', color: 'rgba(243,230,200,.8)', whiteSpace: 'nowrap' }, '単位：万株（分割調整後）。上昇日・下落日は、終値の前日比で分ける。価格変化は、期間の直前の終値から、期間の最後の終値までの変化');
    cells.forEach((c, i) => { E.tw(c, .35, { o: [0, 1], y: [20, 0] }, 'back', .2 + i * .15); E.sfx('pop', { delay: .2 + i * .15, gain: .35 }); });
    E.wait(1.4);
    E.say('hat', '元資料の、累計出来高の表では、この2日を、1つの期間として、まとめている。', { yomi: 'もとしりょうの、るいけいできだかの表では、この、ふつかを、ひとつの期間として、まとめている。' });
    E.say('hat', '出来高を、終値が、前の日より上がった日、下がった日、変わらない日に、分けて足した表だ。', { yomi: 'できだかを、おわりねが、前の日より上がった日、下がった日、変わらない日に、分けて足した表だ。' });
    let L = E.say('hat', '9月16日も17日も、終値は、前の日より下がった。だから、全部が、下落日に入る。', { wait: false, yomi: '9月16日も17日も、おわりねは、前の日より下がった。だから、全部が、げらくびに入る。' });
    P.circle(g, { x: 1075, y: 310, w: 205, h: 225, sw: 5, delay: L.dur * .6, dur: .4 });
    E.at(L.end);
    L = E.say('hat', '単位は、万株だ。0.13万株は、1,300株のことだ。', { wait: false, yomi: 'たんいは、まんかぶだ。レーテンイチサンまんかぶは、せんさんびゃくかぶのことだ。' });
    P.circle(g, { x: 1520, y: 310, w: 215, h: 225, sw: 5, delay: L.dur * .4, dur: .4, seed: 2 });
    E.at(L.end);
    L = E.say('hat', '価格変化の、マイナス33.97％は、9月15日の終値から、9月17日の終値までの変化だ。', { wait: false, yomi: 'かかくへんかの、マイナス、サンジューサンテンキューナナパーセントは、9月15日の、おわりねから、9月17日の、おわりねまでの変化だ。' });
    P.circle(g, { x: 620, y: 310, w: 235, h: 225, sw: 5, delay: L.dur * .2, dur: .4, seed: 3 });
    E.at(L.end);
    const nb = panel(g, { x: 260, y: 520, w: 1400, h: 110, size: 34, html: '値段が下がりながら、売買が細っている' });
    L = E.say('hat', '値段が下がりながら、売買が細っている。', { wait: false });
    rise(nb, .2);
    E.at(L.end);
    E.say('hat', '元資料の表の、1つ前の期間は、7月13日から9月15日までだ。', { yomi: 'もとしりょうの、ひょうの、ひとつ前の期間は、7月13日から9月15日までだ。' });
    E.say('hat', 'その期間の総出来高は、およそ2か月で、65.69万株だった。', { yomi: 'その期間の、そうできだかは、およそ、にかげつで、ろくじゅうごてんろくきゅうまんかぶだった。' });
    E.say('hat', 'この2日は、合わせても、0.13万株しかない。', { yomi: 'この、ふつかは、合わせても、れいてんいちさんまんかぶしかない。' });
    E.say('hat', '元資料は、これを、値段の安定を伴わない、出来高の減少、としている。', { yomi: 'もとしりょうは、これを、値段の安定を伴わない、できだかの、げんしょう、としている。' });
    E.say('hat', '売買が少なくなっても、値段は、落ち着かずに、2日とも下がった、ということだ。', { yomi: '売買が少なくなっても、値段は、落ち着かずに、ふつかとも下がった、ということだ。' });
    const no = panel(g, { x: 260, y: 670, w: 1400, h: 110, size: 30, dark: true, html: '<span style="font:800 26px Round;color:#f3e6c8">元資料の分析</span><span>出来高が少ないことを、「売る人がいなくなった」と読んで、買う理由にはしない</span>' });
    L = E.say('hat', 'だから、元資料の分析では、これを、売る人がいなくなった、と読んで、買う理由にはしない。', { wait: false, yomi: 'だから、もとしりょうの、ぶんせきでは、これを、売る人がいなくなった、と読んで、買う理由にはしない。' });
    E.tw(no, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
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
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 4, delay: .3 });
    E.wait(.6);
    E.narr('9月17日も、私の注文は、成立しなかった。');
    E.narr('売買が少ないのは、もう底が近いから。そう考えたかった。');
    E.narr('でも、値段は、下がっていた。');
    E.wait(.3);
  });

  /* ============================================================ S11 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '売買が少ないことは、底の印ではない', { left: 120, top: 120, font: '900 64px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .07));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const bars = [[300, 160], [420, 120], [540, 70], [660, 24], [780, 14]].map(([x, h]) => E.div(paper, { left: x, top: 640 - h, width: 70, height: h, borderRadius: 6, background: '#a09070' }).ini({ o: 0 }));
    const pr = E.polyline(paper, [[300, 330], [420, 380], [540, 430], [660, 470], [780, 520]].map(([x, y]) => [x + 35, y]), { left: 0, top: 0, width: 1400, height: 820, color: '#c62828', sw: 6 }).ini({ draw: 0 });
    const lb = E.div(paper, { left: 900, top: 450, font: '900 40px/1.4 Zen', color: '#c62828', whiteSpace: 'nowrap' }, '値段も　下がっている').ini({ o: 0 });
    E.wait(2.6);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「売買が少ないことは、底の印ではない」。', { wait: false, yomi: '売買が少ないことは、そこの、しるしではない。' });
    bars.forEach((b, i) => E.show(b, .3, .2 + i * .15)); E.tw(pr, 1.0, { draw: [0, 1] }, 'inOut', L.dur * .4); E.show(lb, .3, L.dur * .6); E.sfx('stamp', { delay: L.dur * .6, gain: .5 });
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
    E.say('baron', '三つの時刻を、一つにまとめる者は、多い。', { talk: C.img, talkAmp: 2, yomi: 'みっつの時刻を、ひとつにまとめる者は、多い。' });
    C.swap(CH('baron_e_scheme'));
    E.say('baron', 'だが、寄り前の知らせと、引けのあとの決定は、別の時刻だ。', { talk: C.img, talkAmp: 2, yomi: 'だが、よりまえの知らせと、ひけのあとの決定は、別の時刻だ。' });
    E.wait(.5);
  });

  /* ============================================================ S13 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 1414 });
    [['T', P.T_BLUE], ['I', P.I_ORANGE]].forEach(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
    });
    const st = P.sticky(g, '第15章<br>増資は、払い込まれていた', { x: 1260, y: 120, w: 580, h: 250, rot: 5, size: 40 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第15章だブー。', { talk: pig, talkAmp: 5, yomi: 'ブヒッ。次は、だいじゅうごしょうだブー。' });
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
