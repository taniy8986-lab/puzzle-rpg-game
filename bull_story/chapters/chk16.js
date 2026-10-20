// 完全版 第16章「最後の1か月」（2026年9月18日〜10月16日）
// 台本: story/k/k16_最後の1か月.md　元資料 p9・p10・p11・p14・p24・p35・p36
// 9/18 8:58 の「大株主は市場で売らない」はエスポアの話として扱う（ユーザー確認）。供給側の話で、需要や出口の保証ではない
// 投稿の時刻と値動きを原因と結果として結びつけない。累計出来高を持ち株・空売り残に読み替えない。ブルちゃんの売買はフィクション
'use strict';
E.chapter('k16');
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
  const X09 = { '9/16': 1032, '9/17': 1104.5, '9/18': 1177, '9/24': 1249.5, '9/25': 1322, '10/16': 2337 };
  const PY09 = p => 120.5 + (3 - Math.log10(p)) * 175;
  const dailyChart = (sc, title, curtain = null) => {
    const C = P.chart(sc.cam, CHART('09'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, title);
    P.note(sc.root, '分割後の値段・対数の目盛り（元資料 p9）', { x: 1380, y: 896, size: 22, dark: true });
    if (curtain) {
      // 9/24 から右は、あとで見る
      const c0 = C.at(curtain, 95), c1 = C.at(2508, 1026);
      E.div(sc.cam, { left: c0.x, top: c0.y, width: c1.x - c0.x, height: c1.y - c0.y, background: 'linear-gradient(90deg, rgba(20,16,30,.96), rgba(20,16,30,.92))', borderLeft: '3px dashed #ffd84a' });
    }
    return C;
  };
  // p11 月足。2018/01 から 21.131px/月、0円が y=607.8、0.19563px/円
  const X11 = m => 183.75 + 21.131 * m;
  const PY11 = p => 607.8 - p * 0.19563;

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

  /* ============================================================ S0 アバン：9月18日の朝 */
  P.phoneScene((ph, sc) => {
    E.bgm('dark', { fadeIn: 1.0, gain: .8 });
    P.lock(ph, { date: '9月18日', week: '金曜日', time: '8:30' });
    E.wait(1.2);
    E.narr('9月18日の朝。上場廃止が決まって、2日がたっていた。', { yomi: '9月18日の朝。上場廃止が決まって、ふつかが、たっていた。' });
    E.narr('上場廃止になると、その株は、取引所で、売り買いできなくなる。', { yomi: '上場廃止になると、その株は、とりひきじょで、売り買いできなくなる。' });
    E.narr('2日続けて、私の売りの注文は、成立しなかった。', { yomi: 'ふつか続けて、私の売りの注文は、成立しなかった。' });
    E.narr('注文は、9月16日に出した値段のまま、残っていた。', { yomi: '注文は、9月16日に出した、値段のまま、残っていた。' });
  }, { name: 'avant_phone', wait: .4 });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 16, title: '最後の1か月', sub: '2026年9月18日〜10月16日', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 9月18日 8:58 の投稿 */
  E.scene({ name: 'post918' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .75 });
    P.slate(g);
    bar(g, [9, 18], [9, 18]);
    const clk = P.clock(g, { x: 120, y: 170, size: 230, min: 538, label: '8:58' });
    E.show(clk, .4, .2);
    const t = P.tcard(g, { id: '投稿', when: '2026/9/18 8:58', kind: '需給', session: '寄り前', text: '船の絵文字付きで「大株主は市場で売らない」と投稿', note: '元資料の投稿一覧（50件・2024/6/18〜2026/8/25）の外。<br>元資料は、エスポアの保有継続を示す根拠として採用していない', x: 420, y: 150, w: 1380, size: 38 });
    card(g, t, .6);
    E.wait(1.2);
    E.narr('9月18日、8時58分。取引が始まる前に、大株主は市場で売らない、という投稿があった。', { yomi: '9月18日、8時58分。取引が始まる前に、だいかぶぬしは、しじょうで、うらない、という投稿があった。' });
    // 画面のない投稿：要約を言い直し、検証メモ（一覧の範囲）を文で言う
    E.say('hat', '元資料の要約では、大株主は、市場で売らない、という見方を書いた投稿だ。', { yomi: 'もとしりょうの要約では、だいかぶぬしは、しじょうで、うらない、という見方を書いた投稿だ。' });
    E.say('hat', '投稿には、船の絵文字が、付いていた。', { yomi: '投稿には、ふねの、えもじが、付いていた。' });
    E.say('hat', '元資料が確かめた投稿は、2024年6月18日から、2026年8月25日までの50件。', { yomi: 'もとしりょうが、確かめた投稿は、2024年6月18日から、2026年8月25日までの、ごじゅっけん。' });
    E.say('hat', 'この投稿は、9月18日なので、その一覧の外にある。', { yomi: 'この投稿は、9月18日なので、その、いちらんの、そとにある。' });
    E.tw(t, .45, { y: -40, s: .82 }, 'inOut'); E.hide(clk, .3);
    const L0 = box(g, { x: 160, y: 520, w: 760, h: 300, top: '書かれていること', main: '大株主は市場で売らない', sub: '売る側（供給）の話', c: '#1b6a3a', border: '5px solid #1b8a5a', size: 44 });
    const R0 = box(g, { x: 1000, y: 520, w: 760, h: 300, top: '書かれていないこと', main: '買う人がいるか（需要）', sub: '個人株主が売れる値段（出口）', c: '#c62828', border: '5px dashed #c62828', size: 44 });
    let L = E.say('hat', '書かれているのは、大株主は、市場で売らない、ということだ。', { wait: false, yomi: '書かれているのは、だいかぶぬしは、しじょうで、うらない、ということだ。' });
    rise(L0, L.dur * .3);
    E.at(L.end);
    E.say('hat', 'これは、売る側、つまり、供給の話だ。', { yomi: 'これは、うる側、つまり、きょうきゅうの話だ。' });
    L = E.say('hat', '買う人がいるかどうか、という、需要の話ではない。', { wait: false, yomi: '買う人がいるかどうか、という、じゅようの話ではない。' });
    rise(R0, L.dur * .3);
    E.at(L.end);
    E.say('hat', '個人の株主が、どの値段で売れるか、という出口を、保証する言葉でもない。', { yomi: 'こじんの、かぶぬしが、どの値段で売れるか、という、でぐちを、保証する言葉でもない。' });
    E.say('hat', '元資料は、この投稿を、エスポアの株を持ち続けていることの根拠としては、使っていない。', { yomi: 'もとしりょうは、この投稿を、エスポアの株を、持ち続けていることの、根拠としては、使っていない。' });
    E.wait(.4);
  });

  /* ============================================================ S4 9月18日の取引 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'mkt918' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .75 });
    P.slate(g);
    const C = dailyChart(sc, '日足　2026年9月16日〜18日', 1213);
    const p17 = C.at(X09['9/17'], PY09(311)), p18 = C.at(X09['9/18'], PY09(70));
    const t17 = tag(g, p17, '9/17 終値 311円', -60, 16, '#2b68d8').ini({ o: 1 });
    const t18 = tag(g, p18, '9/18　219.05万株・終値 70円', -30, 18, '#c62828');
    E.wait(.8);
    // 対数の目盛り（寄る前に、左の目盛りを見せる）
    E.say('hat', 'このチャートは、対数の目盛りだ。', { yomi: 'このチャートは、たいすうの、めもりだ。' });
    let L = E.say('hat', '1,000円と100円の間と、100円と10円の間が、同じ高さになっている。', { wait: false, yomi: 'せんえんと、ひゃくえんの、あいだと、ひゃくえんと、じゅうえんの、あいだが、同じ高さになっている。' });
    // 左の目盛りの文字（右寄せ）に丸を付ける。[値段, 文字の中心のx, 丸の幅]
    [[1000, 110, 74], [100, 118, 56], [10, 126, 46]].forEach(([p, ax, w], i) => { const a = C.at(ax, PY09(p)); P.circle(g, { x: a.x, y: a.y, w, h: 34, sw: 3, delay: .2 + i * L.dur * .3, dur: .3, seed: 11 + i }); });
    E.at(L.end);
    P.look(sc.cam, { s: 2.0, cx: C.at(1120, 0).x, cy: C.at(0, 300).y, dur: 1.4, delay: .1 });
    E.wait(1.5);
    E.say('hat', '出来高は、その日に、売り買いが成立した、株の数だ。', { yomi: 'できだかは、その日に、売り買いが成立した、株の数だ。' });
    E.say('hat', '9月16日と17日の出来高は、とても少なかった。2日で、合わせて1,300株だ。', { yomi: '9月16日と、17日の、できだかは、とても少なかった。ふつかで、合わせて、せんさんびゃくかぶだ。' });
    L = E.say('hat', '9月18日。売買は、ようやく、たくさん成立した。出来高は、219.05万株。', { wait: false, yomi: '9月18日。売買は、ようやく、たくさん成立した。できだかは、ニヒャクジューキューテンゼロゴまんかぶ。' });
    E.pop(t18, .3, L.dur * .6);
    E.at(L.end);
    E.say('hat', '終値は、その日の取引で、最後に付いた値段だ。', { yomi: 'おわりねは、その日の取引で、最後に付いた値段だ。' });
    L = E.say('hat', 'この日の終値は、70円。前の日の311円から、大きく下がった。', { wait: false, yomi: 'この日の、おわりねは、ななじゅうえん。前の日の、さんびゃくじゅういちえんから、大きく下がった。' });
    P.circle(g, { x: p18.x, y: p18.y, w: 40, h: 22, sw: 3, delay: .3, dur: .3 });
    E.at(L.end);
    E.say('hat', 'この日からは、売買が増えながら、急に下がった。');
    P.look(sc.cam, { s: 1, cx: 960, cy: 540, dur: .8 });
    const nb = E.div(sc.root, { left: 260, top: 690, width: 1400, height: 130, borderRadius: 24, background: '#2a2430', border: '3px solid #ffd84a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="font:900 34px/1.3 Zen;color:#f3e6c8;white-space:nowrap">8:58の投稿は、取引が始まる前。この日の終値は、70円</div><div style="font:900 32px/1.4 Zen;color:#ffd84a;white-space:nowrap">時刻の順番は、原因の証明ではない</div>`).ini({ o: 0 });
    E.say('hat', '投稿は、8時58分。その日の取引が、始まる前だった。');
    L = E.say('hat', 'でも、時刻の順番だけでは、その日の値動きの原因は、分からない。', { wait: false });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .4); E.sfx('ding', { delay: .4, gain: .5 });
    E.at(L.end);
    E.say('hat', '元資料も、前後の値動きは、投稿が原因だという、証明にはならない、としている。', { yomi: 'もとしりょうも、ぜんごの、ねうごきは、投稿が原因だという、証明にはならない、としている。' });
    E.wait(.4);
  });

  /* ============================================================ S5 売る側と、買う側 */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'supply' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '売る側と、買う側', 60);
    E.show(tt, .3);
    const A = box(g, { x: 160, y: 200, w: 760, h: 320, top: '売る側（供給）', main: '大株主は<br>市場で売らない', sub: '投稿に書かれている', c: '#1b6a3a', border: '5px solid #1b8a5a', size: 48 });
    const B = box(g, { x: 1000, y: 200, w: 760, h: 320, top: '買う側（需要）', main: '？', sub: '投稿には書かれていない', c: '#c62828', border: '5px dashed #c62828', size: 90 });
    E.div(g, { left: 260, top: 732, width: 1400, textAlign: 'right', font: '800 22px/1.3 Round', color: 'rgba(243,230,200,.8)', whiteSpace: 'nowrap' }, '一般的な説明');
    rise(A, .3); rise(B, .7);
    E.wait(1.2);
    const nb = panel(g, { x: 260, y: 600, w: 1400, h: 120, size: 38, html: '売買は、売る人と買う人が、両方いて成立する' });
    let L = E.say('hat', '売買は、売る人と、買う人が、両方いて、初めて成立する。', { wait: false });
    rise(nb, .3);
    E.at(L.end);
    E.say('hat', 'この投稿に、書かれているのは、売る側の、大株主のことだけだ。', { yomi: 'この投稿に、書かれているのは、うる側の、だいかぶぬしのことだけだ。' });
    E.say('hat', '買う側に、どれだけの人がいるかは、書かれていない。', { yomi: 'かう側に、どれだけの人がいるかは、書かれていない。' });
    E.say('hat', 'だから、売る側の話を聞いても、買う側のことは、分からない。', { yomi: 'だから、うる側の話を聞いても、かう側のことは、分からない。' });
    E.wait(.4);
  });

  /* ============================================================ S6 9月18日〜10月16日 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'month' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .75 });
    P.slate(g);
    const C = dailyChart(sc, '日足　2026年9月18日〜10月16日');
    P.look(sc.cam, { s: 1.55, cx: C.at(1760, 0).x, cy: C.at(0, 420).y, dur: 1.4, delay: .2 });
    const p18 = C.at(X09['9/18'], PY09(70)), p16 = C.at(X09['10/16'], PY09(3));
    const t18 = tag(g, p18, '9/18 終値 70円', -150, 14, '#c62828', 19);
    E.wait(1.6);
    let L = E.say('hat', '9月18日から、最終売買日の、10月16日まで。', { wait: false, yomi: '9月18日から、最終売買日の、10月16日まで。' });
    E.pop(t18, .3, .3);
    E.at(L.end);
    E.say('hat', '最終売買日は、上場廃止の前に、取引所で、売り買いできる、最後の日だ。', { yomi: '最終売買日は、上場廃止の前に、とりひきじょで、売り買いできる、最後の日だ。' });
    L = E.say('hat', '最後の日の終値は、3円。その日の出来高は、391万株だった。', { wait: false, yomi: '最後の日の、おわりねは、さんえん。その日の、できだかは、さんびゃくきゅうじゅういちまんかぶだった。' });
    P.circle(g, { x: p16.x, y: p16.y, w: 46, h: 26, sw: 3, delay: .3, dur: .3 });
    const ann = C.at(2027, 387);
    P.circle(g, { x: ann.x, y: ann.y, w: 200, h: 72, sw: 3, delay: L.dur * .55, dur: .4, seed: 3 });
    E.at(L.end + .4);
  });

  /* ============================================================ S7 累計出来高　9月18日〜10月16日 */
  E.scene({ name: 'table' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '累計出来高の表（元資料 p14 の1行）', 44);
    E.show(tt, .3);
    const cols = [['対象期間', '09/18〜10/16', 340], ['価格変化', '−99.04%', 250], ['上昇日', '157.11', 230], ['下落日', '1,481.49', 260], ['変わらず', '0.00', 220], ['総出来高', '1,638.60', 270]];
    let x = 110;
    const cells = cols.map(([h, v, w]) => {
      const n = E.div(g, { left: x, top: 180, width: w - 10, height: 200, borderRadius: 18, background: 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,.3)' },
        `<div style="font:800 28px/1.3 Round;color:#6a6066;padding-top:30px">${h}</div><div style="font:900 42px/1.6 Noto;color:#262236">${v}</div>`).ini({ o: 0 });
      x += w; return n;
    });
    E.div(g, { left: 110, top: 400, width: 1560, textAlign: 'right', font: '800 20px/1.3 Round', color: 'rgba(243,230,200,.8)', whiteSpace: 'nowrap' }, '単位：万株（分割調整後）。上昇日・下落日は終値の前日比で判定。価格変化は、期間の直前の終値から、期間の最後の終値まで');
    cells.forEach((c, i) => { E.tw(c, .35, { o: [0, 1], y: [20, 0] }, 'back', .2 + i * .15); E.sfx('pop', { delay: .2 + i * .15, gain: .35 }); });
    E.wait(1.4);
    E.say('hat', '累計出来高は、ある期間の、毎日の出来高を、足し合わせた数だ。', { yomi: 'るいけい、できだかは、ある期間の、毎日の、できだかを、足し合わせた数だ。' });
    E.say('hat', '9月18日から、10月16日までの、累計出来高は、1,638.60万株。', { yomi: '9月18日から、10月16日までの、るいけい、できだかは、センロッピャクサンジューハッテンロクまんかぶ。' });
    const pc = panel(g, { x: 260, y: 450, w: 1400, h: 90, size: 34, html: '9月17日の終値311円から、10月16日の終値3円まで　<span style="color:#c62828">−99.04%</span>' });
    let L = E.say('hat', '終値は、9月17日の311円から、10月16日の3円へ、99.04％下がった。', { wait: false, yomi: 'おわりねは、9月17日の、さんびゃくじゅういちえんから、10月16日の、さんえんへ、キュージューキューテンゼロヨンパーセント、下がった。' });
    rise(pc, .2);
    E.at(L.end);
    E.say('hat', '上がった日と、下がった日は、終値が、前の日より、高いか、低いかで分けている。', { yomi: '上がった日と、下がった日は、おわりねが、前の日より、高いか、低いかで、分けている。' });
    E.say('hat', '終値が下がった日の出来高は、合わせて、1,481.49万株。', { yomi: 'おわりねが、下がった日の、できだかは、合わせて、センヨンヒャクハチジューイッテンヨンキューまんかぶ。' });
    E.say('hat', '上がった日の出来高は、157.11万株。変わらなかった日は、0.00万株。', { yomi: '上がった日の、できだかは、ヒャクゴジューナナテンイチイチまんかぶ。変わらなかった日は、ゼロテンゼロゼロまんかぶ。' });
    E.say('hat', '下がった日の出来高のほうが、ずっと多い。', { yomi: '下がった日の、できだかのほうが、ずっと多い。' });
    E.say('hat', 'その前の、9月16日と17日は、2日で、1,300株だった。', { yomi: 'その前の、9月16日と、17日は、ふつかで、せんさんびゃくかぶだった。' });
    const nb = panel(g, { x: 260, y: 560, w: 1400, h: 90, size: 34, html: '売買が大きく増えても、終値は311円に戻らず、最後は3円' });
    L = E.say('hat', '売買は、大きく増えた。でも、最後の終値は、3円。311円には、戻らなかった。', { wait: false, yomi: '売買は、大きく増えた。でも、最後の、おわりねは、さんえん。さんびゃくじゅういちえんには、戻らなかった。' });
    rise(nb, .2);
    E.at(L.end);
    const no = panel(g, { x: 260, y: 670, w: 1400, h: 150, size: 30, dark: true, html: '<div style="text-align:center">同じ株が何度も売買されると、そのたびに出来高に数えられる<br>だから累計を、実際の株数・空売り残・特定の人の持ち株に読み替えられない</div>' });
    L = E.say('hat', 'ここでも、この合計を、実際にある株の数や、誰かの持ち株に、読み替えることはできない。', { wait: false, yomi: 'ここでも、この合計を、実際にある、株の数や、誰かの、もちかぶに、読み替えることはできない。' });
    E.tw(no, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '空売りの残高にも、読み替えられない。', { yomi: 'からうりの、ざんだかにも、読み替えられない。' });
    E.say('hat', '空売りの残高は、借りて売った株のうち、まだ買い戻していない株の数だ。', { yomi: 'からうりの、ざんだかは、借りて売った株のうち、まだ、かいもどしていない株の数だ。' });
    E.say('hat', '元資料は、その理由を、同じ株が、何度も売買されるため、としている。', { yomi: 'もとしりょうは、その理由を、同じ株が、なんども、売買されるため、としている。' });
    E.say('hat', 'つまり、1つの株が、売り買いのたびに、何度も数えられる。', { yomi: 'つまり、ひとつの株が、売り買いのたびに、なんども、数えられる。' });
    E.wait(.4);
  });

  /* ============================================================ S8 ブルちゃん（9月25日に売る） */
  E.trans('fade', { dur: .6, color: '#fff' });
  P.phoneScene((ph, sc) => {
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    fiction(sc);
    const scr = ph.screen, sw = ph.sw;
    E.div(scr, { left: 0, top: 0, width: sw, height: 1000, background: '#f4f6f9' });
    E.div(scr, { left: 0, top: 70, width: sw, textAlign: 'center', font: '900 30px/1.4 Zen', color: '#22252b' }, '注文の状況');
    const cd = E.div(scr, { left: 24, top: 150, width: sw - 48, height: 260, borderRadius: 18, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,.08)' });
    E.div(cd, { left: 24, top: 20, font: '900 30px/1.4 Zen', color: '#22252b' }, 'エスポア（3260）');
    E.div(cd, { left: 24, top: 80, font: '900 34px/1.4 Zen', color: '#1b8a5a' }, '売り　9/25');
    const st = E.div(cd, { left: 24, top: 150, padding: '6px 18px', borderRadius: 12, background: '#e3f4ea', font: '900 32px/1.4 Zen', color: '#1b6a3a' }, '約定　55円').ini({ o: 0 });
    const fm = E.div(scr, { left: 24, top: 450, width: sw - 48, height: 210, borderRadius: 18, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,.08)', textAlign: 'center' },
      `<div style="font:800 22px/1.4 Round;color:#6a6066;padding-top:22px;white-space:nowrap">買値 700円　→　売値 55円</div><div style="font:900 28px/1.5 Noto;color:#22252b;margin-top:8px">（55 ÷ 700 − 1）× 100</div><div style="font:900 40px/1.4 Noto;color:#c62828">＝ −92.14%</div>`).ini({ o: 0 });
    E.wait(1.0);
    let L = E.narr('9月25日。私は、自分で値段を決め直して、55円で売った。', { wait: false, yomi: '9月25日。私は、自分で値段を決め直して、ごじゅうごえんで売った。' });
    E.pop(st, .4, L.dur * .6); E.sfx('ding', { delay: L.dur * .6, gain: .4 });
    E.at(L.end);
    E.narr('3月24日に、700円で買った株だった。', { yomi: '3月24日に、ななひゃくえんで買った株だった。' });
    L = E.narr('買った値段の、700円から見ると、マイナス、92.14％だった。', { wait: false, yomi: '買った値段の、ななひゃくえんから見ると、マイナス、キュージューニテンイチヨンパーセントだった。' });
    E.tw(fm, .4, { o: [0, 1], y: [20, 0] }, 'back', .1);
    E.at(L.end + .6);
  }, { name: 'bull_sell', wait: .4 });

  /* ============================================================ S9 I51　10月15日 15:30 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'i51' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .75 });
    P.slate(g);
    bar(g, [10, 15], [10, 15]);
    const i51 = P.icard(g, { id: 'I51', when: '2026/10/15 15:30', session: '引け後', title: '半期報告書遅延・訂正方針', text: '前期の訂正と半期報告書の提出が未完了。<br>会計監査人不在により訂正有報の提出時期も未定と説明', note: '4/24の黒字・純資産プラスを、後日も有効な確定値として使わない', x: 260, y: 130, w: 1400, size: 32 });
    card(g, i51, .5);
    E.wait(1.0);
    // 言葉の説明（一般的な説明）。同じ場所に1枚ずつ出して消す
    const exP = (term, body) => panel(g, { x: 260, y: 600, w: 1400, h: 110, size: 30, html: `<span><span style="color:#b8651a">${term}</span>${body}<span style="font:800 22px Round;color:#4a4552">（一般的な説明）</span></span>` });
    E.say('hat', '10月15日、15時30分。取引が終わったあとの、会社の開示だ。');
    E.say('hat', '会社は、前の期の訂正が、まだ終わっていない、とした。', { yomi: '会社は、前の期の、ていせいが、まだ終わっていない、とした。' });
    E.tw(i51, .4, { y: -20, s: .92 }, 'inOut');
    const ex1 = exP('訂正', 'は、一度出した書類の中身を、直すこと');
    let L = E.say('hat', '訂正は、一度出した書類の中身を、直すことだ。', { wait: false, yomi: 'ていせいは、一度出した書類の中身を、直すことだ。' });
    rise(ex1, .2);
    E.at(L.end);
    E.say('hat', '9月16日に、会社は、第三者委員会の、調査報告書を公表していた。', { yomi: '9月16日に、会社は、第三者委員会の、ちょうさほうこくしょを、公表していた。' });
    E.say('hat', 'そして、訂正が要るか、どこまで直すかを、くわしく調べる、と説明していた。', { yomi: 'そして、ていせいが、いるか、どこまで直すかを、くわしく調べる、と説明していた。' });
    E.hide(ex1, .3);
    E.say('hat', '半期報告書の提出も、まだ終わっていない、とした。', { yomi: 'はんきほうこくしょの提出も、まだ終わっていない、とした。' });
    const ex2 = exP('半期報告書', 'は、会社の1年の、前半の6か月の決算などを、まとめた報告書');
    L = E.say('hat', '半期報告書は、会社の1年の、前半の6か月の、決算などを、まとめた報告書だ。', { wait: false, yomi: 'はんきほうこくしょは、会社の、いちねんの、ぜんはんの、ろっかげつの、決算などを、まとめた報告書だ。' });
    rise(ex2, .2);
    E.at(L.end);
    E.hide(ex2, .3);
    E.say('hat', '訂正した有価証券報告書を、出す時期も、決まっていない、と説明した。', { yomi: 'ていせいした、ゆうかしょうけんほうこくしょを、出す時期も、決まっていない、と説明した。' });
    E.say('hat', '理由は、会計監査人が、いないためだ、とした。', { yomi: '理由は、かいけいかんさにんが、いないためだ、とした。' });
    const ex3 = exP('有価証券報告書（有報）', 'は、会社が事業や決算を書いて、毎年出す報告書');
    L = E.say('hat', '有価証券報告書は、会社が、事業や決算を、くわしく書いて、毎年出す報告書だ。', { wait: false, yomi: 'ゆうかしょうけんほうこくしょは、会社が、事業や決算を、くわしく書いて、毎年出す報告書だ。' });
    rise(ex3, .2);
    E.at(L.end);
    E.say('hat', 'カードの、訂正有報は、訂正した有価証券報告書の、略だ。', { yomi: 'カードの、ていせいゆうほうは、ていせいした、ゆうかしょうけんほうこくしょの、りゃくだ。' });
    E.hide(ex3, .3);
    const ex4 = exP('会計監査人', 'は、会社の決算書を監査する、外部の監査法人や公認会計士');
    L = E.say('hat', '会計監査人は、会社の決算書を監査する、外部の監査法人や、公認会計士のことだ。', { wait: false, yomi: 'かいけいかんさにんは、会社の、けっさんしょを監査する、外部の、かんさほうじんや、こうにんかいけいしのことだ。' });
    rise(ex4, .2);
    E.at(L.end);
    E.hide(ex4, .3);
    // 4月24日の値が、確定の値として使えない理由（元資料 p21・p24）
    E.say('hat', '4月24日に、会社は、黒字で、純資産もプラスだ、という決算を、発表していた。', { yomi: '4月24日に、会社は、くろじで、じゅんしさんも、プラスだ、という決算を、発表していた。' });
    const ex5 = exP('純資産', 'は、会社の持ち物から、借りているものを引いた残り');
    L = E.say('hat', '純資産は、会社の持ち物から、借りているものを、引いた残りだ。', { wait: false, yomi: 'じゅんしさんは、会社の持ち物から、借りているものを、引いた残りだ。' });
    rise(ex5, .2);
    E.at(L.end);
    E.hide(ex5, .3);
    const nb = panel(g, { x: 260, y: 600, w: 1400, h: 140, size: 30, dark: true, html: '<div style="text-align:center">4月24日の黒字と純資産のプラスは、当時の会社の発表の値<br>のちに訂正の対象になる<span style="font:800 22px Round;color:#f3e6c8">（元資料 p21）</span></div>' });
    L = E.say('hat', '元資料は、この値を、のちに訂正の対象になる、当時の会社の発表の値、としている。', { wait: false, yomi: 'もとしりょうは、この、あたいを、のちに、訂正の対象になる、当時の、会社の発表の、あたい、としている。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '10月15日の時点でも、前の期の訂正は、まだ終わっていなかった。', { yomi: '10月15日の時点でも、前の期の、ていせいは、まだ終わっていなかった。' });
    E.say('hat', 'だから、元資料は、4月24日の値を、あとからも有効な、確定の値としては、使わない。', { yomi: 'だから、もとしりょうは、4月24日の、あたいを、あとからも有効な、確定の、あたいとしては、使わない。' });
    E.wait(.4);
  });

  /* ============================================================ S10 I52　10月16日 15:30 */
  E.scene({ name: 'i52' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [10, 16], [10, 16]);
    const i52 = P.icard(g, { id: 'I52', when: '2026/10/16 15:30', session: '引け後', title: '最終売買・廃止後の扱い', text: '10/16取引終了、10/17上場廃止、<br>保振での取扱廃止は10/21予定と案内', note: 'このIRは最終取引日の15:30。チャート最終終値は3円', x: 260, y: 130, w: 1400, size: 32 });
    card(g, i52, .5);
    E.wait(1.0);
    E.say('hat', '10月16日、15時30分。最終売買日の、取引が終わったあとだ。', { yomi: '10月16日、15時30分。最終売買日の、取引が終わったあとだ。' });
    E.say('hat', 'チャートの、最後の終値の、3円は、この開示より、前についた値段だ。', { yomi: 'チャートの、最後の、おわりねの、さんえんは、この開示より、前についた値段だ。' });
    E.say('hat', 'このあと、取引所で、売り買いできる日は、もうなかった。', { yomi: 'このあと、とりひきじょで、売り買いできる日は、もうなかった。' });
    E.tw(i52, .4, { y: -20, s: .92 }, 'inOut');
    const tl = panel(g, { x: 80, y: 560, w: 1760, h: 100, size: 28, dark: true, html: '9/16 名証が上場廃止を決定　▶　10/16 最終売買　▶　10/17 上場廃止　▶　10/21 保振での取扱廃止（予定）' });
    let L = E.say('hat', '名証は、9月16日に、上場廃止を、決めていた。', { wait: false, yomi: 'めいしょうは、9月16日に、上場廃止を、決めていた。' });
    E.tw(tl, .4, { o: [0, 1], y: [20, 0] }, 'back', .1); E.sfx('dun', { delay: .1, gain: .6 });
    E.at(L.end);
    E.say('hat', '名証は、エスポアの株が売り買いされている、名古屋証券取引所のことだ。', { yomi: 'めいしょうは、エスポアの株が売り買いされている、なごやしょうけんとりひきじょのことだ。' });
    E.say('hat', '会社は、10月16日で、取引が終わる、と案内した。');
    E.say('hat', 'そして、10月17日に、上場廃止になる、とした。');
    E.say('hat', '保振での取り扱いの廃止は、10月21日の予定だ。', { yomi: 'ほふりでの、とりあつかいの廃止は、10月21日の予定だ。' });
    const ex = panel(g, { x: 260, y: 700, w: 1400, h: 110, size: 30, html: '<span><span style="color:#b8651a">保振</span>は、証券保管振替機構。株の持ち主の記録を、電子的に管理する機関<span style="font:800 22px Round;color:#4a4552">（一般的な説明）</span></span>' });
    L = E.say('hat', '保振は、証券保管振替機構のことだ。株の持ち主の記録を、電子的に管理している。', { wait: false, yomi: 'ほふりは、しょうけん、ほかん、ふりかえ、きこうのことだ。株の、もちぬしの記録を、でんしてきに、管理している。' });
    rise(ex, .3);
    E.at(L.end + .4);
  });

  /* ============================================================ S11 月足で、もう一度 */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'monthly' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    const C = P.chart(g, CHART('11'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, '月足　2018年1月〜2026年10月');
    P.note(sc.root, '分割後の値段・最終月は10/16まで（元資料 p11）', { x: 1300, y: 896, size: 22, dark: true });
    C.draw(2.0, .2);
    E.wait(2.0);
    E.say('hat', '最後に、月足で、長い流れを見る。', { yomi: '最後に、つきあしで、長い流れを見る。' });
    E.say('hat', '月足は、1か月の値動きを、1本のローソク足にしたものだ。', { yomi: 'つきあしは、いっかげつの、ねうごきを、いっぽんの、ローソクあしに、したものだ。' });
    P.look(sc.cam, { s: 1.5, cx: C.at(2080, 0).x, cy: C.at(0, 330).y, dur: 1.2 });
    const hi = C.at(X11(80), PY11(1880)), lo = C.at(X11(105), PY11(3));
    E.say('hat', '2024年9月11日の、実際の高値は、5,640円だった。', { yomi: '2024年9月11日の、実際の、たかねは、ごせんろっぴゃくよんじゅうえんだった。' });
    E.say('hat', '2025年10月の、株の分割で、1株が、3株になった。', { yomi: '2025年10月の、株の分割で、いっかぶが、さんかぶになった。' });
    E.say('hat', 'それより前の値段は、3で割って、今と比べられるように、そろえてある。', { yomi: 'それより前の値段は、さんで割って、今と比べられるように、そろえてある。' });
    let L = E.say('hat', '5,640円を、3で割ると、1,880円。これが、この図の、2024年9月の高値だ。', { wait: false, yomi: 'ごせんろっぴゃくよんじゅうえんを、さんで割ると、せんはっぴゃくはちじゅうえん。これが、この図の、2024年9月の、たかねだ。' });
    P.circle(g, { x: hi.x, y: hi.y, w: 44, h: 30, sw: 3, delay: L.dur * .5, dur: .3 });
    E.at(L.end);
    // 札は、寄った図の左の空いたところ（2018〜2023年の上）に出し、2026年のローソク足を隠さない
    const leftCard = (html, dark = false) => E.div(sc.root, { left: 60, top: 420, width: 900, height: 140, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: '900 32px/1.45 Zen', color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
    const pc = leftCard('<div>1,880円から、最後の終値の3円までの下落率は<br><span style="font-size:40px;color:#c62828">−99.84%</span></div>');
    L = E.say('hat', '1,880円から、最後の終値の、3円までの、下落率は、99.84％だ。', { wait: false, yomi: 'せんはっぴゃくはちじゅうえんから、最後の、おわりねの、さんえんまでの、げらくりつは、キュージューキューテンハチヨンパーセントだ。' });
    P.circle(g, { x: lo.x, y: lo.y, w: 40, h: 30, sw: 3, delay: .3, dur: .3, seed: 4 }); rise(pc, .5);
    E.at(L.end);
    E.hide(pc, .3);
    const sp1 = C.at(X11(98.5), PY11(900)), sp2 = C.at(X11(102.3), PY11(820));
    L = E.say('hat', '2026年の、春や夏にも、上がる場面は、あった。', { wait: false });
    P.circle(g, { x: sp1.x, y: sp1.y, w: 50, h: 80, sw: 3, delay: .3, dur: .4, seed: 7 });
    P.circle(g, { x: sp2.x, y: sp2.y, w: 34, h: 56, sw: 3, delay: L.dur * .55, dur: .4, seed: 8 });
    E.at(L.end);
    // 2026年の戻りの高さ（元資料 p10）
    const rb = leftCard('<div>2026年の戻りは、4/14・4/17の1,000円まで<br>2024年の高値より、46.81%低い<span style="font:800 22px Round;color:#6a6066">（元資料 p10）</span></div>');
    L = E.say('hat', '2026年の戻りは、4月14日と、17日の、1,000円までだった。', { wait: false, yomi: '2026年の、もどりは、4月14日と、17日の、せんえんまでだった。' });
    rise(rb, .3);
    E.at(L.end);
    E.say('hat', '2024年の高値の、1,880円より、46.81％低い水準だ。', { yomi: '2024年の、たかねの、せんはっぴゃくはちじゅうえんより、ヨンジューロクテンハチイチパーセント、低い水準だ。' });
    E.say('hat', 'どの上昇も、2024年の高値を超える、長い上昇には、戻らなかった。', { yomi: 'どの上昇も、2024年の、たかねを超える、長い上昇には、戻らなかった。' });
    E.hide(rb, .3);
    const nb = leftCard('<div><span style="font:800 26px Round;color:#f3e6c8">元資料の分析</span><br>長い流れと、一時的な反発を、区別する</div>', true);
    L = E.say('hat', '反発は、下がったあとに、値段が、いったん上がることだ。', { wait: false, yomi: 'はんぱつは、下がったあとに、値段が、いったん、上がることだ。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('ding', { delay: .2, gain: .5 });
    E.at(L.end);
    E.say('hat', '元資料の分析は、こうした上昇を、一時的な反発として、長い流れと区別している。', { yomi: 'もとしりょうの分析は、こうした上昇を、いちじてきな、はんぱつとして、長い流れと、区別している。' });
    E.wait(.4);
  });

  /* ============================================================ S12 ブルちゃんの部屋 */
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
    E.narr('10月16日。最後の日の終値は、3円だった。', { yomi: '10月16日。最後の日の、おわりねは、さんえんだった。' });
    E.narr('私の値段で、買う人は、いなかった。私は、値段を決め直すのが、遅かった。', { yomi: 'わたしの値段で、かう人は、いなかった。私は、値段を、決め直すのが、遅かった。' });
    E.wait(.3);
  });

  /* ============================================================ S13 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '売らない、は、買う、ではない', { left: 120, top: 120, font: '900 64px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .07));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const nb = (x, t, s, c, dashed) => E.div(paper, { left: x, top: 330, width: 520, height: 260, borderRadius: 20, border: dashed ? `4px dashed ${c}` : `4px solid ${c}`, textAlign: 'center' },
      `<div style="font:900 40px/1.3 Zen;color:${c};padding-top:44px">${t}</div><div style="font:900 34px/1.45 Zen;color:#2a2230;margin-top:16px">${s}</div>`).ini({ o: 0 });
    const b1 = nb(150, '供給', '大株主は<br>市場で売らない', '#1b6a3a'), b2 = nb(730, '需要', '買う人がいるかは<br>別', '#c62828', true);
    E.wait(2.4);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「売らない、は、買う、ではない」。', { wait: false, yomi: 'うらないは、かう、ではない。' });
    E.show(b1, .3, .3); E.show(b2, .3, L.dur * .5); E.sfx('stamp', { delay: L.dur * .5, gain: .5 });
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
    E.say('baron', '売らない、という言葉を聞くと、人は、買い手まで、見えた気になる。', { talk: C.img, talkAmp: 2, yomi: 'うらない、という言葉を聞くと、人は、かいてまで、見えた気になる。' });
    C.swap(CH('baron_e_scheme'));
    E.say('baron', 'だが、買い手は、その言葉の中には、いない。', { talk: C.img, talkAmp: 2, yomi: 'だが、かいては、その言葉の中には、いない。' });
    E.wait(.5);
  });

  /* ============================================================ S15 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 1616 });
    [['T', P.T_BLUE], ['I', P.I_ORANGE]].forEach(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
    });
    const st = P.sticky(g, '第17章<br>海帆との比較', { x: 1260, y: 120, w: 580, h: 250, rot: 5, size: 40 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第17章だブー。', { talk: pig, talkAmp: 5, yomi: 'ブヒッ。次は、だいじゅうななしょうだブー。' });
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
