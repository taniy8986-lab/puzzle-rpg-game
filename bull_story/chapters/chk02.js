// 完全版 第2章「総会と、買収提案」（2024年7〜12月）
// 台本: story/k/k02_総会と、買収提案.md　元資料 p3・p10・p11・p16・p17・p25・p26・p35
// 投稿は元資料の要約（本人の見解）。有名投資家の名前・アカウントは出さない。価格は分割調整後
'use strict';
E.chapter('k02');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;

  const monthBar = (g, from, to) => P.monthBar(g, { year: 2024, start: 7, months: 6, from, to });
  const chain = P.chain, dayAxis = P.dayAxis, axisDot = P.axisDot, eveCall = P.eveCall;

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

  /* ============================================================ S0 アバン：2024年の夏 */
  E.scene({ name: 'avant_room' }, sc => {
    const g = sc.cam;
    E.bgm('daily', { fadeIn: 1.0, gain: .75 });
    const R = P.room(g);
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    const tag = E.div(g, { left: 120, top: 120, padding: '10px 28px', borderRadius: 14, background: 'rgba(255,255,255,.9)', color: '#2a2430', font: '900 38px/1.3 Zen', boxShadow: '0 8px 18px rgba(0,0,0,.2)' }, '2024年7月').ini({ o: 0 });
    E.pop(tag, .4, .3);
    P.look(sc.cam, { s: 1.25, cx: 1250, cy: 450, dur: 5, delay: .3 });
    E.wait(.6);
    E.narr('2024年7月。エスポアは、私のウォッチリストに入っていた。');
    E.narr('ここから半年。総会を求めたJPIWと、会社のあいだで、動きが続いていく。', { yomi: 'ここから半年。総会を求めた、ジェーピーアイダブリューと、会社のあいだで、動きが続いていく。' });
    E.wait(.2);
  });

  // カレンダーがめくれていく
  E.scene({ name: 'calendar' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'repeating-linear-gradient(90deg,#f8f0e4 0 66px,#f1e5d3 66px 132px)' });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, rgba(255,250,235,0) 40%, rgba(120,80,40,.25) 100%)' });
    const X = 550, Y = 150;
    const MARKS = { 7: [5, 23], 8: [15, 27], 9: [10, 11], 10: [1, 10, 15], 11: [], 12: [] };
    const cals = {};
    [12, 11, 10, 9, 8, 7].forEach(m => { cals[m] = P.calendar(g, { x: X, y: Y, w: 820, year: 2024, month: m }); });
    [12, 11, 10, 9, 8, 7].forEach(m => E.from(cals[m], { y: 60, o: 0 }, .5, 0, 'back'));
    let t = .5;
    [7, 8, 9, 10, 11].forEach(m => {
      MARKS[m].forEach((d, i) => { const p = cals[m].pos(d); P.circle(cals[m], { x: p.x - X, y: p.y - Y, w: 96, h: 74, delay: t + i * .25, dur: .3, seed: m + d }); });
      t += .35 + MARKS[m].length * .25;
      E.tw(cals[m], .45, { y: [0, -320], r: [0, m % 2 ? -12 : 10], o: [1, 0] }, 'in2', t);
      E.sfx('page', { delay: t, gain: .7 });
      t += .4;
    });
    E.wait(.4);
    const L = E.narr('総会、買収の提案、そして中止。その順番を、時計で並べていく。', { wait: false });
    E.at(Math.max(L.end, sc.t0 + t + .6));
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 2, title: '総会と、買収提案', sub: '2024年7月〜12月', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 アジト：半年の発表 */
  E.scene({ name: 'lair' }, sc => {
    const g = sc.cam;
    E.bgm('villain', { fadeIn: .6, gain: .8 });
    const L = P.lair(g, { faces: ['normal', 'smile'] });
    E.div(L.screen, { left: 0, top: 0, width: 840, height: 480, background: 'linear-gradient(180deg,#22314f,#121a2c)' },
      '<div style="position:absolute;left:0;top:28px;width:840px;text-align:center;font:900 60px/1.3 Zen;color:#ffd84a;white-space:nowrap">2024年　<span style="color:#f3e6c8">7月 → 12月</span></div>');
    E.breathe(L.baron, .008, 1.5);
    L.pigs.forEach((p, i) => E.breathe(p, .012, 2.3, i));
    E.tw(sc.cam, 3.0, { s: [1.3, 1], y: [150, 0] }, 'inOut');
    E.sfx('dun', { delay: .3, gain: .7 });
    E.wait(1.6);
    E.say('hat', '第2章は、2024年の7月から12月だ。', { talk: L.hat, talkAmp: 2 });
    E.wait(.2);
  });

  E.scene({ name: 'overview' }, sc => {
    const g = sc.cam;
    const { hat, call, bd } = P.boardScene(g, ['normal', 'smile']);
    E.div(bd, { left: 0, top: 22, width: 1020, textAlign: 'center', font: '900 40px/1.2 Zen', color: '#2a2430', whiteSpace: 'nowrap' }, '2024年7月〜12月　会社の主な発表');
    E.div(bd, { left: 0, top: 72, width: 1020, textAlign: 'center', font: '800 22px/1.2 Round', color: '#8a8070' }, '元資料の「主要IR」から');
    const ROWS = [['7/5', 'I04', '買収への対応方針'], ['8/15', 'I05', '総会の招集を許可（東京地裁）'], ['8/27', 'I06', '9/11を議決権の基準日に'], ['9/10', 'I07', 'SNS上の提案に説明'], ['10/10', 'I08', 'JPIWの総会を中止'], ['10/15', 'I09', '通期予想を下方修正']];
    const rows = ROWS.map(([d, id, t], i) => E.div(bd, { left: 60, top: 108 + i * 74, width: 900, height: 62, borderRadius: 14, background: '#fdf3e6', display: 'flex', alignItems: 'center' },
      `<span style="flex:none;width:110px;margin-left:18px;font:800 28px/1 Noto;color:#8a7050">${d}</span>
       <span style="flex:none;padding:2px 12px 4px;border-radius:9px;background:${P.I_ORANGE};color:#fff;font:900 26px/1.2 Noto">${id}</span>
       <span style="margin-left:18px;font:900 32px/1 Zen;color:#2a2230;white-space:nowrap">${t}</span>`).ini({ o: 0 }));
    const tl = E.div(bd, { left: 60, top: 572, width: 900, height: 150, borderRadius: 16, background: '#eef3fc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', padding: '0 20px' },
      ['T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09'].map(t => `<span style="padding:4px 14px 6px;border-radius:10px;background:${P.T_BLUE};color:#fff;font:900 30px/1.2 Noto">${t}</span>`).join('') +
      '<div style="width:100%;text-align:center;font:800 24px/1.3 Round;color:#3d4757">ある有名投資家の投稿（元資料の要約）</div>').ini({ o: 0 });
    E.wait(.4);
    E.say('hat', '元資料が取り上げる、会社の主な発表は、6つ。', { talk: hat, talkAmp: 2, yomi: 'もとしりょうがとりあげる、会社の、おもな発表は、むっつ。' });
    const L = E.say('hat', '買収への対応方針、総会の招集の許可、基準日、提案への説明、総会の中止、そして下方修正だ。', { talk: hat, talkAmp: 2, wait: false });
    rows.forEach((r, i) => { E.tw(r, .35, { o: [0, 1], x: [-30, 0] }, 'back', .1 + i * L.dur / 6.4); E.sfx('slide', { delay: .1 + i * L.dur / 6.4, gain: .4 }); });
    E.at(L.end);
    E.set(call, { face: 'smile' });
    const L2 = E.say('eve', '元資料が確認した投稿は、T03からT09までの、7つだね〜。', { talk: call, talkAmp: 3, wait: false, yomi: 'もとしりょうが確認した投稿は、ティーゼロサンから、ティーゼロキューまでの、ななつだねー。' });
    E.tw(tl, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('pop', { delay: .3 });
    E.at(L2.end);
    E.set(call, { face: 'normal' });
    E.say('hat', '会社の発表と投稿を、時刻の順に並べる。いつも通りだ。', { talk: hat, talkAmp: 2 });
    E.hide(tl, .3);
    const pig = E.actor(g, 'pig', { x: 1330, y: 1200, h: 440, pose: 'front', shadow: false }).ini({ y: 300 });
    E.tw(pig, .45, { y: [300, 0] }, 'back');
    E.sfx('snort', { delay: .2 });
    E.say('pig', 'ブヒッ。並べるだけなら、オレにもできるブー。', { talk: pig, talkAmp: 4, delay: .3 });
    E.wait(.3);
  });

  /* ============================================================ S3 2024年7〜12月の日足 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'daily' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const C = P.chart(g, CHART('03'), { x: 80, y: 150, w: 1760 });
    const ttl = E.div(g, { left: 80, top: 82, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '日足　2024年7月〜12月（25・75・200日線）').ini({ o: 0 });
    E.show(ttl, .4, .1);
    P.note(sc.root, '分割調整後の値段（元資料 p3）', { x: 1500, y: 896, size: 22, dark: true });
    C.draw(3.0, .3);
    E.wait(1.0);
    E.say('hat', 'これが、2024年7月から12月の日足だ。値段は、分割調整後だ。');
    const L = E.say('hat', '上の青い点が投稿、下の橙の四角が、会社の発表だ。', { wait: false });
    [[452, 408.8], [740, 405.9], [1065, 328], [1083, 305]].forEach(([px, py], i) => { const p = C.at(px, py); P.circle(g, { x: p.x, y: p.y, w: 40, h: 40, color: P.T_BLUE, sw: 5, delay: .2 + i * .18, dur: .3, sound: i === 0, seed: i }); });
    [[252.8, 753.2], [739.7, 753.2], [885, 753], [1064.8, 753.1], [1425.8, 753.1], [1461.8, 753]].forEach(([px, py], i) => { const p = C.at(px, py); P.circle(g, { x: p.x, y: p.y, w: 36, h: 36, color: P.I_ORANGE, sw: 5, delay: L.dur * .5 + i * .14, dur: .3, sound: i === 0, seed: i + 5 }); });
    E.at(L.end);
    const hi = C.at(1082.5, 272);
    P.look(sc.cam, { s: 1.4, cx: hi.x + 120, cy: hi.y + 60, dur: 1.2 });
    P.circle(g, { x: hi.x, y: hi.y, w: 90, h: 80, delay: .6, dur: .4 });
    const lab = E.div(g, { left: hi.x + 50, top: hi.y - 70, font: '900 40px/1.2 Noto', color: '#fff', textShadow: '0 0 10px #c62828, 0 3px 0 #c62828', whiteSpace: 'nowrap' }, '9/11　1,880円').ini({ o: 0 });
    E.pop(lab, .35, .9); E.sfx('pop', { delay: .9 });
    E.say('hat', 'そして、9月11日。この日の高値1,880円が、2024年の頂点になる。', { delay: .4 });
    P.look(sc.cam, { s: 1, cx: W / 2, cy: H / 2, dur: 1.0 });
    E.say('hat', 'その日に、何があったのか。7月から、順に見ていく。', { delay: .3 });
    E.wait(.3);
  });

  /* ============================================================ S4 I04　7月5日 */
  E.scene({ name: 'i04' }, sc => {
    const g = sc.cam;
    P.slate(g);
    monthBar(g, [7, 1], [7, 5]);
    const i04 = P.icard(g, { id: 'I04', when: '2024/7/5 16:30', session: '引け後', title: '買収への対応方針を導入', text: 'JPIWなどの動きを踏まえ、大規模買付行為への対応方針を、<br>取締役会で導入', note: '経営陣・株主間の対立については、会社側の説明として読む', x: 260, y: 150, w: 1400, size: 32 });
    E.tw(i04, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5, gain: .6 });
    E.wait(1.0);
    E.say('hat', '7月5日、引け後。会社は、買収への対応方針を、取締役会で導入した。', { yomi: '7月5日、ひけご。会社は、買収への対応方針を、取締役会で導入した。' });
    E.say('hat', '株を大きく買い付ける動きに、会社がどう対応するか、という方針だ。');
    E.say('hat', 'JPIWなどの動きを、踏まえたものだと説明している。');
    const call = eveCall(g, ['anxious', 'normal']);
    E.pop(call, .4, 0, .6);
    E.say('eve', '会社と株主で、ぶつかってるの〜？', { talk: call, talkAmp: 3, delay: .3, yomi: '会社と株主で、ぶつかってるのー？' });
    E.hide(call, .3);
    // 二つの説明
    E.tw(i04, .4, { y: -40, s: .9 }, 'inOut');
    const bub = (x, txt, sub, solid) => E.div(g, { left: x, top: 560, width: 620, height: 220, borderRadius: 30, background: solid ? '#fffcf7' : 'rgba(255,255,255,.08)', border: solid ? `6px solid ${P.I_ORANGE}` : '5px dashed rgba(243,230,200,.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
      `<div style="font:900 44px/1.3 Zen;color:${solid ? '#2a2230' : '#f3e6c8'}">${txt}</div><div style="font:800 26px/1.4 Round;color:${solid ? '#8a7050' : 'rgba(243,230,200,.8)'};margin-top:8px">${sub}</div>`).ini({ o: 0 });
    const b1 = bub(300, '会社の説明', 'この開示（I04）', true), b2 = bub(1000, 'もう一方の説明', '？', false);
    const L = E.say('hat', '対立については、会社側の説明として読む。片方の説明だけで、どちらが正しいかは決めない。', { wait: false });
    E.pop(b1, .4, .3, .7); E.sfx('pop', { delay: .3 });
    E.pop(b2, .4, L.dur * .55, .7); E.sfx('pop', { delay: L.dur * .55 });
    E.at(L.end + .4);
  });

  /* ============================================================ S5 T03　7月23日 */
  E.scene({ name: 't03' }, sc => {
    const g = sc.cam;
    P.slate(g);
    monthBar(g, [7, 5], [7, 23]);
    const t03 = P.tcard(g, { id: 'T03', when: '2024/7/23 17:44', kind: '経営', session: '引け後', text: '旧社長の大量保有変更報告を批判', note: '提出時期などは本人の主張として記録。違法性を本資料で認定するものではない', x: 260, y: 150, w: 1400, size: 38 });
    E.tw(t03, .45, { o: [0, 1], x: [60, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.narr('7月23日の夕方。旧社長の、大量保有の変更報告を、批判する投稿があった。');
    // 大量保有報告のしくみ
    E.tw(t03, .4, { o: 0, y: -30 }, 'in2');
    const gx = 260, gw = 1400, gy = 360;
    const pct = v => gx + v / 10 * gw;
    const gauge = E.div(g, { left: gx, top: gy, width: gw, height: 70, borderRadius: 35, background: 'rgba(255,255,255,.12)', border: '3px solid rgba(243,230,200,.6)', overflow: 'hidden' }).ini({ o: 0 });
    const fill = E.div(gauge, { left: 0, top: 0, width: gw, height: 70, background: 'linear-gradient(90deg,#4b7fd6,#2b68d8)', transformOrigin: '0 50%' }).ini({ sx: 0 });
    const ticks = [0, 5, 10].map(v => E.div(g, { left: pct(v) - 60, top: gy + 84, width: 120, textAlign: 'center', font: '900 32px/1.2 Noto', color: '#f3e6c8' }, `${v}％`).ini({ o: 0 }));
    const line5 = E.div(g, { left: pct(5) - 3, top: gy - 30, width: 6, height: 130, background: '#ffd84a' }).ini({ o: 0 });
    const lab5 = E.div(g, { left: pct(5) - 300, top: gy - 92, width: 600, textAlign: 'center', font: '900 34px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '5％を超えると、大量保有報告').ini({ o: 0 });
    const ttl = E.div(g, { left: 0, top: 150, width: W, textAlign: 'center', font: '900 44px/1.2 Zen', color: '#f3e6c8' }, '株を持つ割合（しくみの図）').ini({ o: 0 });
    const box = E.div(g, { left: 460, top: 560, width: 1000, height: 150, borderRadius: 24, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', font: '900 40px/1.2 Zen', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<span style="padding:6px 18px;border-radius:14px;background:#e5eefc;color:${P.T_BLUE}">±1％以上</span><span>変わったら</span><span style="color:#c62828">変更報告</span>`).ini({ o: 0 });
    let L = E.say('hat', '大量保有の報告は、会社の株を5％より多く持つ人が出す、届け出だ。', { wait: false });
    E.show(ttl, .3, .1); E.show(gauge, .3, .2); ticks.forEach((t, i) => E.show(t, .3, .3 + i * .1));
    E.tw(fill, 1.2, { sx: [0, .62] }, 'inOut', L.dur * .35); E.sfx('rise', { delay: L.dur * .35, gain: .4 });
    E.show(line5, .3, L.dur * .5); E.show(lab5, .3, L.dur * .55); E.sfx('ding', { delay: L.dur * .55, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '持ち分が1％以上変わると、変更報告を出す。', { wait: false });
    E.tw(fill, .6, { sx: [.62, .74] }, 'inOut', .3);
    E.tw(box, .4, { o: [0, 1], y: [20, 0] }, 'back', .5); E.sfx('pop', { delay: .5 });
    E.at(L.end);
    // 本人の主張
    [ttl, gauge, ...ticks, line5, lab5, box].forEach(n => E.hide(n, .3));
    E.tw(t03, .45, { o: [0, 1], y: [-30, 0] }, 'back', .2);
    const m1 = P.mark(g, '本人の主張', { x: 380, y: 600, color: P.T_BLUE, size: .8, rot: -6 });
    const m2 = E.div(g, { left: 880, top: 610, width: 760, height: 110, borderRadius: 20, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 34px/1.3 Zen', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)' }, '違法性は、元資料で認定していない').ini({ o: 0 });
    L = E.say('hat', '提出の時期などへの批判は、本人の主張だ。', { wait: false, delay: .4 });
    P.stampIn(m1, .7);
    E.at(L.end);
    L = E.say('hat', '違法かどうかを、元資料が認めたわけじゃない。', { wait: false });
    E.tw(m2, .4, { o: [0, 1], x: [40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end + .4);
  });

  /* ============================================================ S6 8月15日　17:30 → 18:00 → 18:03 */
  E.scene({ name: 'aug15' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .7 });
    P.slate(g);
    monthBar(g, [7, 23], [8, 15]);
    const clk = P.clock(g, { x: 150, y: 210, size: 280, min: 900, label: '2024/8/15' });
    E.tw(clk, 1.3, { min: [900, 1050] }, 'inOut', .4); E.sfx('tick', { delay: .4, gain: .6 }); E.sfx('tick', { delay: 1.0, gain: .6 });
    const i05 = P.icard(g, { id: 'I05', when: '2024/8/15 17:30', session: '引け後', title: '株主総会の招集を許可', text: '東京地裁が、JPIWによる取締役の解任・選任を<br>議題とする総会の招集を許可', x: 560, y: 170, w: 1200, size: 32 });
    E.tw(i05, .45, { o: [0, 1], x: [60, 0] }, 'back', 1.5); E.sfx('notify', { delay: 1.5 });
    E.wait(1.9);
    E.say('hat', '8月15日、17時30分。会社は、東京地裁の決定を開示した。');
    E.say('hat', 'JPIWが求めていた、取締役の解任と選任の総会。');
    // 「JPIWが開く」ことを許可
    const gavel = E.div(g, { left: 560, top: 560, width: 1200, height: 150, borderRadius: 24, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px', font: '900 40px/1.2 Zen', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      '<span>総会を開くのは</span><span style="padding:6px 18px;border-radius:14px;background:#fdf3e6;color:#b8651a">JPIW</span><span>→</span><span style="color:#17915a">裁判所が許可</span>').ini({ o: 0 });
    let L = E.say('hat', 'その総会をJPIWが開くことを、裁判所が許可した。', { wait: false });
    E.tw(gavel, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('stamp', { delay: L.dur * .7, gain: .6 });
    E.at(L.end + .2);
    [clk, i05, gavel].forEach(n => E.hide(n, .35));
    E.wait(.3);
    // 時刻の帯
    const ch = chain(g, { y: 150, items: [{ id: 'I05', time: '17:30', sub: '会社の開示', color: P.I_ORANGE }, { id: 'T04', time: '18:00', sub: '投稿', color: P.T_BLUE }, { id: 'T05', time: '18:03', sub: '投稿', color: P.T_BLUE }], gaps: ['30分後', '3分後'] });
    ch.in(0, 0); ch.in(1, .5);
    const t04 = P.tcard(g, { id: 'T04', when: '2024/8/15 18:00', kind: '経営', session: '引け後', text: '株主による臨時総会招集の許可決定を紹介', x: 300, y: 340, w: 1320, size: 38 });
    E.tw(t04, .45, { o: [0, 1], y: [30, 0] }, 'back', 1.2); E.sfx('notify', { delay: 1.2 });
    E.wait(1.6);
    E.narr('会社の開示の30分後、18時。許可の決定を紹介する投稿があった。');
    E.tw(t04, .35, { o: 0, x: -60 }, 'in2');
    ch.in(2, .2);
    const t05 = P.tcard(g, { id: 'T05', when: '2024/8/15 18:03', kind: '経営', session: '引け後', text: '臨時総会の基準日設定を巡り会社側を批判', note: '制度の解釈は本人の見解として扱う', x: 300, y: 340, w: 1320, size: 38 });
    E.tw(t05, .45, { o: [0, 1], x: [60, 0] }, 'back', .8); E.sfx('notify', { delay: .8 });
    E.wait(1.2);
    E.narr('その3分後には、基準日の決め方をめぐって、会社側を批判する投稿。');
    E.say('hat', '制度の読み方は、本人の見解として扱う。');
    E.wait(.4);
  });

  /* ============================================================ S7 8月27日　7:58・7:59・14:30 */
  E.scene({ name: 'aug27' }, sc => {
    const g = sc.cam;
    P.slate(g);
    monthBar(g, [8, 15], [8, 27]);
    const ax = dayAxis(g, { x: 180, y: 320, w: 1560, from: 420, to: 960, open: 540 });
    E.show(ax.root, .5, .3);
    const dT06 = axisDot(g, ax, { m: 478, y: 320, kind: 'T', label: 'T06 7:58' });
    const dT07 = axisDot(g, ax, { m: 479, y: 320, kind: 'T', label: 'T07 7:59', lift: 48 });
    const dI06 = axisDot(g, ax, { m: 870, y: 320, kind: 'I', label: 'I06 14:30' });
    const day = E.div(g, { left: 80, top: 130, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '2024年8月27日').ini({ o: 0 });
    E.show(day, .4, .2);
    E.wait(.8);
    E.say('hat', '8月27日。この日は、投稿が先で、会社の開示があとだ。');
    const t06 = P.tcard(g, { id: 'T06', when: '2024/8/27 7:58', kind: '経営', session: '寄り前', text: '臨時総会の議決権基準日を9月11日と告知', x: 300, y: 470, w: 1320, size: 38 });
    E.pop(dT06, .4, .1); E.sfx('pop', { delay: .1 });
    E.tw(t06, .45, { o: [0, 1], y: [30, 0] }, 'back', .4); E.sfx('notify', { delay: .4 });
    E.narr('朝、7時58分。臨時総会の議決権の基準日が、9月11日だと告知する投稿。', { delay: .6 });
    E.tw(t06, .35, { o: 0, x: -60 }, 'in2');
    const t07 = P.tcard(g, { id: 'T07', when: '2024/8/27 7:59', kind: '経営', session: '寄り前', text: '同じ基準日の公示を再掲', note: '直前投稿と実質同内容。独立した材料には数えない', x: 300, y: 470, w: 1320, size: 38 });
    E.pop(dT07, .4, .1); E.sfx('pop', { delay: .1 });
    E.tw(t07, .45, { o: [0, 1], x: [60, 0] }, 'back', .4); E.sfx('notify', { delay: .4 });
    E.narr('1分後の投稿は、同じ公示の再掲だった。', { delay: .6 });
    const same = P.mark(g, '同じ中身', { x: 1420, y: 730, color: '#8a93a3', size: .7, rot: 8 });
    P.stampIn(same, .2);
    E.say('hat', '中身が同じだから、別の材料としては、数えない。', { delay: .3 });
    E.tw(t07, .35, { o: 0, x: -60 }, 'in2'); E.hide(same, .3);
    const i06 = P.icard(g, { id: 'I06', when: '2024/8/27 14:30', session: '取引時間内', title: '9/11を議決権の基準日に', text: 'JPIWによる総会の議決権基準日を9/11とする公告を、会社が確認', x: 300, y: 470, w: 1320, size: 32 });
    E.pop(dI06, .4, .1); E.sfx('pop', { delay: .1 });
    E.tw(i06, .45, { o: [0, 1], x: [60, 0] }, 'back', .4); E.sfx('notify', { delay: .4 });
    E.say('hat', '会社の開示は、取引時間中の14時30分。', { delay: .6 });
    E.say('hat', 'JPIWの公告を、会社が確認した、という内容だ。');
    E.wait(.3);
  });

  // 基準日のしくみ
  E.scene({ name: 'record_date' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '基準日　9月11日', 44);
    E.show(tt, .3);
    // 株主名簿
    const book = E.div(g, { left: 220, top: 200, width: 600, height: 560, borderRadius: 18, background: '#fffdf6', boxShadow: '0 20px 40px rgba(0,0,0,.4)' }).ini({ o: 0 });
    E.div(book, { left: 0, top: 0, width: 600, height: 80, borderRadius: '18px 18px 0 0', background: '#3c4a66', textAlign: 'center', font: '900 40px/80px Zen', color: '#fff' }, '株主名簿（9/11）');
    const PERSON = c => `<svg viewBox="0 0 100 112" width="64" height="72"><circle cx="50" cy="32" r="22" fill="${c}"/><path d="M10 112 Q12 62 50 60 Q88 62 90 112Z" fill="${c}"/></svg>`;
    const ppl = [0, 1, 2, 3].map(i => E.div(book, { left: 60, top: 110 + i * 108, width: 480, height: 90, display: 'flex', alignItems: 'center', gap: '24px', borderBottom: '2px solid #e8e0cf' },
      `${PERSON(['#7aa7d9', '#e0a96d', '#8fc49a', '#c39bd3'][i])}<span style="font:900 34px/1 Zen;color:#3a3236">株主</span><span style="margin-left:auto;font:900 44px/1 Zen;color:#17915a">✓</span>`).ini({ o: 0 }));
    // 投票箱
    const boxN = E.div(g, { left: 1240, top: 330, width: 420, height: 380 }).ini({ o: 0 });
    E.svg(boxN, { left: 0, top: 0, width: 420, height: 380 }, '0 0 420 380',
      '<rect x="30" y="110" width="360" height="260" rx="20" fill="#e8dcc0"/><rect x="30" y="110" width="360" height="60" rx="14" fill="#c9a24a"/><rect x="150" y="128" width="120" height="16" rx="8" fill="#5a4a2a"/><path d="M160 20 L260 20 L270 120 L150 120Z" fill="#fff" stroke="#8a8070" stroke-width="4"/>');
    E.div(boxN, { left: 0, top: 220, width: 420, textAlign: 'center', font: '900 44px/1.2 Zen', color: '#3a3236' }, '総会で投票');
    const arrow = P.arrow(g, { x1: 840, y1: 480, x2: 1220, y2: 520, color: '#ffd84a', sw: 10, bend: -40 });
    const out = E.div(g, { left: 900, top: 760, width: 560, height: 90, borderRadius: 16, background: 'rgba(255,255,255,.12)', border: '3px dashed rgba(243,230,200,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', font: '900 32px/1 Zen', color: '#f3e6c8' },
      `${PERSON('#8a93a3')}<span>名簿に載っていない</span><span style="color:#e0353f;font-size:44px">✕</span>`).ini({ o: 0 });
    E.wait(.3);
    const L = E.say('hat', '基準日は、その日に株主名簿に載っている人が、総会で投票できる、という日だ。', { wait: false });
    E.tw(book, .45, { o: [0, 1], y: [30, 0] }, 'back', .1); E.sfx('page', { delay: .1, gain: .6 });
    ppl.forEach((p, i) => { E.tw(p, .3, { o: [0, 1], x: [-20, 0] }, 'out', .5 + i * .18); });
    E.tw(boxN, .45, { o: [0, 1], s: [.8, 1] }, 'back', L.dur * .5); E.sfx('pop', { delay: L.dur * .5 });
    P.drawArrow(arrow, .5, L.dur * .65);
    E.at(L.end);
    E.say('hat', '株を買って、名簿に載るのは、2営業日あとだ。基準日の当日に買っても、間に合わない。', { yomi: '株を買って、名簿に載るのは、にえいぎょうびあとだ。基準日の当日に買っても、間に合わない。' });
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 460, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .5, { x: [420, 0] }, 'back');
    E.tw(out, .4, { o: [0, 1], y: [20, 0] }, 'back', .3);
    E.sfx('snort', { delay: .2 });
    E.say('pig', 'ブヒッ。名簿に載ってないと、投票できないブー。', { talk: pig, talkAmp: 4, delay: .4 });
    E.wait(.3);
  });

  /* ============================================================ S8 9月10日　15:20 → 19:00 */
  E.scene({ name: 'sep10' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .4, gain: .7 });
    P.slate(g);
    monthBar(g, [8, 27], [9, 10]);
    const i07 = P.icard(g, { id: 'I07', when: '2024/9/10 15:20', session: '引け後', title: 'SNS上の提案について説明', text: '一定の提案行為はあったが、取締役会で<br>真偽の確認や決定をした事実はない', x: 260, y: 160, w: 1400, size: 34 });
    E.tw(i07, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '9月10日、15時20分。会社は、SNS上の提案について、説明を出した。');
    const L0 = E.say('hat', '一定の提案はあったが、取締役会で、真偽を確かめたり、決めたりした事実はない、とな。', { wait: false });
    const chips2 = ['真偽の確認', '決定'].map((t, i) => E.div(g, { left: 360 + i * 640, top: 600, width: 560, height: 110, whiteSpace: 'nowrap', borderRadius: 20, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', font: '900 40px/1 Zen', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<span>${t}</span><span style="color:#e0353f">していない</span>`).ini({ o: 0 }));
    chips2.forEach((c, i) => { E.tw(c, .4, { o: [0, 1], y: [20, 0] }, 'back', L0.dur * (.4 + i * .2)); E.sfx('pop', { delay: L0.dur * (.4 + i * .2), gain: .5 }); });
    E.at(L0.end + .2);
    [i07, ...chips2].forEach(n => E.hide(n, .35));
    E.wait(.3);
    const tl = P.timeLink(g, { x: 260, y: 150, w: 1400, a: { id: 'I07', time: '15:20', sub: '会社の説明', color: P.I_ORANGE }, b: { id: 'T08', time: '19:00', sub: '投稿', color: P.T_BLUE }, label: '同じ日の夜' });
    tl.in(0);
    const t08 = P.tcard(g, { id: 'T08', when: '2024/9/10 19:00', kind: '経営', session: '引け後', text: '6,300円での買収提案を低いと評価', note: '本人による提案受領の説明。正式なTOB成立や買付価格の保証ではない。<br>分割調整後は2,100円相当', x: 300, y: 330, w: 1320, size: 40 });
    E.tw(t08, .45, { o: [0, 1], y: [30, 0] }, 'back', 1.2); E.sfx('notify', { delay: 1.2 });
    E.wait(1.6);
    E.narr('その夜、19時。6,300円での買収提案を、低いと評価する投稿があった。');
    E.say('hat', 'これは、提案を受けた、という本人の説明だ。');
    E.wait(.2);
  });

  E.scene({ name: 'coin2100' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '6,300円を、分割で調整すると', 44);
    E.show(tt, .3);
    const coin = (x, y, s, txt, sub) => E.div(g, { left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #ffe9a3, #e0b23c 60%, #b8861c)', boxShadow: '0 10px 24px rgba(0,0,0,.4), inset 0 -6px 0 rgba(0,0,0,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', color: '#5a3d08' },
      `<div style="font:900 ${s * .17}px/1.1 Noto">${txt}</div><div style="font:900 ${s * .1}px/1.3 Zen">${sub}</div>`).ini({ o: 0 });
    const big = coin(560, 450, 320, '6,300円', '投稿の数字');
    const div3 = E.div(g, { left: 820, top: 390, width: 280, textAlign: 'center', font: '900 70px/1 Zen', color: '#ffd84a' }, '÷ 3').ini({ o: 0 });
    const small = coin(1360, 450, 280, '2,100円', '分割調整後');
    E.wait(.3);
    E.pop(big, .45, .1); E.sfx('pop', { delay: .1 });
    const L = E.say('hat', '分割で調整すると、2,100円にあたる。', { wait: false, delay: .4 });
    E.show(div3, .3, L.dur * .3);
    E.tw(small, .45, { o: [0, 1], x: [-500, 0], s: [.6, 1] }, 'back', L.dur * .5); E.sfx('cash', { delay: L.dur * .5, gain: .5 });
    E.at(L.end + .3);
  });

  E.scene({ name: 'tob' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, 'TOB（公開買付け）とは', 44);
    E.show(tt, .3);
    const board = E.div(g, { left: 760, top: 160, width: 400, height: 220, borderRadius: 18, background: '#fffdf6', boxShadow: '0 16px 32px rgba(0,0,0,.4)', textAlign: 'center' },
      '<div style="font:900 34px/1.2 Zen;color:#3a3236;padding-top:22px">公開買付け</div><div style="font:800 30px/1.6 Round;color:#4a4552;margin-top:10px">値段 ○○円<br>期間 ○月○日まで</div>').ini({ o: 0 });
    const mkt = E.div(g, { left: 160, top: 430, width: 480, height: 300, borderRadius: 24, border: '4px dashed rgba(243,230,200,.6)', textAlign: 'center', font: '900 40px/1.2 Zen', color: 'rgba(243,230,200,.85)', paddingTop: 120 }, '市場（取引所）').ini({ o: 0 });
    const buyer = E.div(g, { left: 1280, top: 450, width: 440, height: 260, borderRadius: 24, background: 'rgba(255,255,255,.95)', textAlign: 'center', font: '900 40px/1.3 Zen', color: '#262236', paddingTop: 80, boxShadow: '0 12px 24px rgba(0,0,0,.35)' }, '買い付ける側').ini({ o: 0 });
    const holders = [0, 1, 2].map(i => E.div(g, { left: 760 + i * 140, top: 640, width: 110, height: 110, borderRadius: '50%', background: ['#7aa7d9', '#e0a96d', '#8fc49a'][i], textAlign: 'center', font: '900 28px/110px Zen', color: '#fff', boxShadow: '0 8px 16px rgba(0,0,0,.3)' }, '株主').ini({ o: 0 }));
    const arr = P.arrow(g, { x1: 1100, y1: 640, x2: 1270, y2: 590, color: '#ffd84a', sw: 10, bend: -30 });
    E.wait(.3);
    const L = E.say('hat', 'TOBは、値段と期間を公表して、市場の外で株を買い集める手続きだ。', { wait: false });
    E.tw(board, .4, { o: [0, 1], y: [-30, 0] }, 'back', .2); E.sfx('pop', { delay: .2 });
    E.show(mkt, .4, L.dur * .45);
    E.tw(buyer, .4, { o: [0, 1], x: [40, 0] }, 'back', L.dur * .55); E.sfx('slide', { delay: L.dur * .55 });
    holders.forEach((h, i) => E.pop(h, .35, L.dur * .6 + i * .12));
    P.drawArrow(arr, .5, L.dur * .8);
    E.at(L.end + .2);
    [board, mkt, buyer, ...holders, arr, arr.head].forEach(n => E.hide(n, .3));
    E.hide(tt, .3);
    const no = (y, txt) => E.div(g, { left: 260, top: y, width: 1400, height: 150, borderRadius: 26, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '26px', font: '900 46px/1.2 Zen', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<span style="font:900 56px/1 Noto;color:${P.T_BLUE}">6,300円</span><span>＝</span><span>${txt}</span>`).ini({ o: 0 });
    const n1 = no(200, '成立したTOBの値段'), n2 = no(420, 'その値段で買い取る保証');
    const L1 = E.say('hat', 'でも、この6,300円は、成立したTOBの値段じゃない。', { wait: false, delay: .4 });
    E.tw(n1, .4, { o: [0, 1], y: [20, 0] }, 'back', .1);
    P.cross(g, { x: 1480, y: 275, s: 130, delay: L1.dur * .75 });
    E.at(L1.end);
    const L2 = E.say('hat', 'その値段で買い取ってもらえる、保証でもない。', { wait: false });
    E.tw(n2, .4, { o: [0, 1], y: [20, 0] }, 'back', .1);
    P.cross(g, { x: 1480, y: 495, s: 130, delay: L2.dur * .7 });
    E.at(L2.end);
    const call = eveCall(g, ['smile', 'anxious'], { x: 1540, y: 620, w: 340, h: 260 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '6,300円は、まだ決まった値段じゃないんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: 'ろくせんさんびゃくえんは、まだ決まった値段じゃないんだねー。' });
    E.set(call, { face: 'anxious' });
    const tip = E.div(g, { left: 260, top: 660, width: 1200, height: 120, borderRadius: 22, background: '#2a2430', border: '3px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 40px/1.2 Zen', color: '#ffd84a' }, '言われた数字　と　決まった数字　を分ける').ini({ o: 0 });
    const L3 = E.say('hat', 'だから、言われた数字と、決まった数字を、分けて置く。', { wait: false });
    E.tw(tip, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L3.end + .4);
  });

  /* ============================================================ S9 9月11日　基準日と、高値 */
  E.scene({ name: 'sep11_chart' }, sc => {
    const g = sc.cam;
    P.slate(g);
    monthBar(g, [9, 10], [9, 11]);
    const C = P.chart(g, CHART('03'), { x: 160, y: 150, w: 1600, crop: [645, 170, 940, 423] });
    P.note(sc.root, '日足（分割調整後）2024年8月上旬〜10月下旬（元資料 p3 の一部）', { x: 1060, y: 896, size: 22, dark: true });
    C.draw(1.6, .2);
    const hi = C.at(1082.5, 272);
    const rd = E.div(g, { left: hi.x - 150, top: 160, width: 300, textAlign: 'center', padding: '6px 0', borderRadius: 12, background: P.I_ORANGE, font: '900 30px/1.2 Zen', color: '#fff', whiteSpace: 'nowrap' }, '議決権の基準日').ini({ o: 0 });
    const tag = (pt, txt, dy) => E.div(g, { left: pt.x - 350, top: pt.y + dy, width: 300, textAlign: 'right' }, `<span style="padding:3px 12px;border-radius:9px;background:${P.T_BLUE};color:#fff;font:900 24px/1.3 Noto;white-space:nowrap">${txt}</span>`).ini({ o: 0 });
    const tg8 = tag(C.at(1065, 328), 'T08 9/10 19:00', -6), tg9 = tag(C.at(1083, 305), 'T09 9/11 15:42', -44);
    E.show(tg8, .3, 1.4); E.show(tg9, .3, 1.6);
    E.wait(1.2);
    let L = E.say('hat', '次の日、9月11日。総会の、議決権の基準日だ。', { wait: false });
    E.tw(rd, .4, { o: [0, 1], y: [-20, 0] }, 'back', L.dur * .5); E.sfx('pop', { delay: L.dur * .5 });
    E.at(L.end);
    P.circle(g, { x: hi.x, y: hi.y, w: 100, h: 90, delay: .2, dur: .4 });
    const lab = E.div(g, { left: hi.x + 70, top: hi.y - 40, padding: '8px 22px', borderRadius: 14, background: 'rgba(255,255,255,.95)', font: '900 44px/1.2 Noto', color: '#c62828', whiteSpace: 'nowrap', boxShadow: '0 8px 18px rgba(0,0,0,.3)' }, '高値 1,880円<span style="font:800 28px Round;color:#6a6066">（当時 5,640円）</span>').ini({ o: 0 });
    L = E.say('hat', 'この日の高値は、1,880円。当時の値段で、5,640円だ。', { wait: false, delay: .3 });
    E.tw(lab, .4, { o: [0, 1], x: [-30, 0] }, 'back', .5); E.sfx('ding', { delay: .5, gain: .5 });
    E.at(L.end + .4);
  });

  E.scene({ name: 'sep11_clock' }, sc => {
    const g = sc.cam;
    P.slate(g);
    E.div(g, { left: 80, top: 80, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '2024年9月11日　時刻の順番');
    const ax = dayAxis(g, { x: 180, y: 330, w: 1560, from: 480, to: 1020, open: 540, band: [540, 900] });
    E.show(ax.root, .5, .2);
    const hiLab = E.div(g, { left: ax.tx(540), top: 140, width: ax.tx(900) - ax.tx(540), textAlign: 'center' },
      '<span style="padding:6px 20px;border-radius:12px;background:#c62828;color:#fff;font:900 32px/1.3 Noto;white-space:nowrap">高値 1,880円</span><div style="font:800 22px/1.6 Round;color:#ffd84a">取引時間の中のどこか（時刻は元資料に示されていない）</div>').ini({ o: 0 });
    const dT09 = axisDot(g, ax, { m: 942, y: 330, kind: 'T', label: 'T09 15:42' });
    E.wait(.6);
    E.tw(hiLab, .4, { o: [0, 1], y: [-20, 0] }, 'back'); E.sfx('pop');
    E.wait(.8);
    const t09 = P.tcard(g, { id: 'T09', when: '2024/9/11 15:42', kind: '助言契約', session: '引け後', text: 'JPIW代表交代がなければ助言契約を解除すると通告', note: '取得できた長文冒頭を確認。当日高値5,640円は投稿15時42分より前の取引', x: 300, y: 520, w: 1320, size: 36 });
    E.pop(dT09, .4, 0); E.sfx('pop');
    E.tw(t09, .45, { o: [0, 1], y: [30, 0] }, 'back', .3); E.sfx('notify', { delay: .3 });
    E.narr('その日の、15時42分。ある有名投資家の投稿。', { delay: .6 });
    E.narr('JPIWの代表が交代しなければ、助言契約を解除する、という通告だった。', { yomi: 'ジェーピーアイダブリューの代表が交代しなければ、助言契約を解除する、という通告だった。' });
    E.say('hat', '高値の1,880円は、この投稿より前の取引で、ついていた。');
    // 逆向きの矢印に×
    E.tw(t09, .35, { o: 0, y: 30 }, 'in2');
    const wrong = E.div(g, { left: 360, top: 560, width: 1200, height: 130, borderRadius: 24, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: '900 42px/1.2 Zen', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<span style="padding:4px 14px;border-radius:10px;background:${P.T_BLUE};color:#fff;font:900 34px Noto">T09</span><span>の投稿で</span><span style="color:#c62828">高値がついた</span>`).ini({ o: 0 });
    const right = E.div(g, { left: 360, top: 720, width: 1200, height: 110, borderRadius: 24, background: '#2a2430', border: '3px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: '900 38px/1.2 Zen', color: '#ffd84a' },
      `<span>高値（取引時間中）</span><span>→</span><span>T09（15:42）</span>`).ini({ o: 0 });
    const L = E.say('hat', 'この投稿で高値がついた、と読むのは、時計が逆だ。', { wait: false, delay: .3 });
    E.tw(wrong, .4, { o: [0, 1], y: [20, 0] }, 'back', .1);
    P.cross(g, { x: 1480, y: 625, s: 120, delay: L.dur * .7 });
    E.tw(right, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .85); E.sfx('ding', { delay: L.dur * .85, gain: .5 });
    E.at(L.end);
    const call = eveCall(g, ['normal', 'surprise'], { x: 1590, y: 560, w: 300, h: 240 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '基準日と、高値の日が、同じ日だったんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: '基準日と、高値の日が、同じ日だったんだねー。' });
    E.say('hat', '重なったのは、事実だ。');
    E.say('hat', 'でも、基準日も、前の晩の投稿も、高値の理由だったかは、値動きだけでは分からない。');
    E.wait(.4);
  });

  /* ============================================================ S10 10月　中止と、下方修正 */
  E.scene({ name: 'oct10' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    monthBar(g, [9, 11], [10, 10]);
    const i08 = P.icard(g, { id: 'I08', when: '2024/10/10 17:00', session: '引け後', title: 'JPIWの総会を中止', text: '提案内容の確認・検討に時間を要するとし、<br>10/1付でJPIW主催の総会の中止に合意したと開示', note: '出来事の日は10/1、投資家への公表日は10/10', x: 260, y: 140, w: 1400, size: 32 });
    E.tw(i08, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '10月10日、17時。会社は、JPIWが開く予定だった総会の、中止を開示した。');
    E.say('hat', '提案の中身の確認と検討に、時間がかかる、という理由だ。');
    E.tw(i08, .4, { o: 0, y: -30 }, 'in2');
    const days = [['10月1日', 220], ['10月10日', 1060]].map(([d, x]) => E.div(g, { left: x, top: 260, width: 640, height: 70, borderRadius: 14, background: 'rgba(255,255,255,.12)', border: '2px solid rgba(243,230,200,.5)', textAlign: 'center', font: '900 38px/70px Zen', color: '#f3e6c8' }, d).ini({ o: 0 }));
    const ev = (x, kind, id, txt) => E.div(g, { left: x, top: 370, width: 600, height: 130, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', boxShadow: '0 10px 20px rgba(0,0,0,.35)', borderLeft: `12px solid ${kind === 'I' ? P.I_ORANGE : '#8a93a3'}` },
      `<span style="flex:none;margin-left:16px;padding:2px 12px 4px;border-radius:10px;background:${kind === 'I' ? P.I_ORANGE : '#8a93a3'};color:#fff;font:900 28px/1.2 Noto">${id}</span><div style="margin-left:16px;font:800 30px/1.4 Round;color:#22252b">${txt}</div>`).ini({ o: 0 });
    const e1 = ev(240, 'x', '合意', '総会の中止に合意'), e2 = ev(1080, 'I', 'I08', '17:00　会社が開示');
    const gapArr = P.arrow(g, { x1: 860, y1: 435, x2: 1060, y2: 435, color: '#ffd84a', sw: 8 });
    const gapLab = E.div(g, { left: 760, top: 520, width: 400, textAlign: 'center', font: '900 30px/1.2 Zen', color: '#ffd84a' }, '9日あと').ini({ o: 0 });
    E.wait(.2);
    const L = E.say('hat', '中止に合意したのは、10月1日。発表は、10月10日。', { wait: false });
    days.forEach((d, i) => E.show(d, .3, .1 + i * .2));
    E.tw(e1, .35, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('pop', { delay: .3, gain: .5 });
    P.drawArrow(gapArr, .5, L.dur * .5); E.show(gapLab, .3, L.dur * .55);
    E.tw(e2, .35, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .7); E.sfx('pop', { delay: L.dur * .7, gain: .5 });
    E.at(L.end);
    E.say('hat', 'ここでも、出来事の日と、公表日を、分けて置く。');
    E.wait(.3);
  });

  E.scene({ name: 'oct15' }, sc => {
    const g = sc.cam;
    P.slate(g);
    monthBar(g, [10, 10], [10, 15]);
    const i09 = P.icard(g, { id: 'I09', when: '2024/10/15 15:30', session: '引け後', title: '通期予想を下方修正（2025年2月期）', text: '保有商業施設の売却後の収益力低下などを説明', x: 260, y: 120, w: 1400, size: 30 });
    E.tw(i09, .45, { o: [0, 1], y: [30, 0] }, 'back', .4); E.sfx('notify', { delay: .4 });
    // 棒グラフ
    const BX = 600, SC = .1;
    const sec = (y, t) => E.div(g, { left: 260, top: y, font: '900 34px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, t).ini({ o: 0 });
    const bar = (y, label, w, color, val) => {
      const lab = E.div(g, { left: 300, top: y, width: 280, height: 60, textAlign: 'right', font: '800 28px/60px Round', color: 'rgba(243,230,200,.85)' }, label).ini({ o: 0 });
      const b = E.div(g, { left: BX, top: y + 6, width: w, height: 48, borderRadius: 10, background: color, transformOrigin: '0 50%' }).ini({ sx: 0 });
      const v = E.div(g, { left: BX + w + 20, top: y, font: '900 36px/60px Noto', color: '#fff', whiteSpace: 'nowrap' }, val).ini({ o: 0 });
      return { lab, b, v, show: d => { E.show(lab, .3, d); E.tw(b, .7, { sx: [0, 1] }, 'out', d + .1); E.show(v, .3, d + .6); } };
    };
    const s1 = sec(400, '営業損失の予想');
    const a1 = bar(450, '修正前', 3800 * SC, 'linear-gradient(90deg,#e8a0a0,#d96a6a)', '3,800万円');
    const a2 = bar(520, '修正後', 9300 * SC, 'linear-gradient(90deg,#e04848,#b3122b)', '9,300万円');
    E.div(g, { left: 260, top: 605, width: 1400, height: 2, background: 'rgba(243,230,200,.3)' });
    const s2 = sec(620, '売上の予想');
    const scl = E.div(g, { left: 1300, top: 400, font: '800 24px/1.2 Round', color: 'rgba(243,230,200,.75)', whiteSpace: 'nowrap' }, '※ 上と下で、棒の目盛りは別').ini({ o: 0 });
    E.show(scl, .3, 1.2);
    const b1 = bar(670, '修正前', 930, 'linear-gradient(90deg,#9ec5f0,#5b8fd6)', '9.30億円');
    const b2 = bar(740, '修正後', 921, 'linear-gradient(90deg,#7fb0ea,#2b68d8)', '9.21億円');
    E.wait(.8);
    E.say('hat', '10月15日には、通期の予想を、下方修正した。');
    let L = E.say('hat', '2025年2月期の営業損失の予想を、3,800万円から、9,300万円に広げた。', { wait: false });
    E.show(s1, .3, .1); a1.show(.3); a2.show(L.dur * .6); E.sfx('drop', { delay: L.dur * .6 + .2, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '売上の予想は、9.30億円から、9.21億円へ。', { wait: false, yomi: '売上の予想は、きゅうおく、さんぜんまんえんから、きゅうおく、にせんひゃくまんえんへ。' });
    E.show(s2, .3, .1); b1.show(.3); b2.show(L.dur * .55);
    E.at(L.end);
    E.say('hat', '保有していた商業施設を売ったあと、稼ぐ力が落ちたことなどを、理由にしている。');
    E.wait(.4);
  });

  /* ============================================================ S11 頂点のあと（週足） */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'weekly' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('10'), { x: 80, y: 150, w: 1760 });
    E.div(g, { left: 80, top: 82, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '週足　2024年1月〜2026年10月（13・26・52週線）');
    P.note(sc.root, '分割調整後の値段（元資料 p10）', { x: 1500, y: 896, size: 22, dark: true });
    C.draw(2.4, .2);
    const pk = C.at(735.5, 240), rt = C.at(2437, 240);
    const dash = E.div(g, { left: pk.x, top: pk.y - 3, width: rt.x - pk.x, height: 0, borderTop: '6px dashed #c62828', transformOrigin: '0 50%' }).ini({ sx: 0 });
    const pkLab = E.div(g, { left: pk.x + 30, top: pk.y - 66, padding: '4px 16px', borderRadius: 12, background: '#c62828', font: '900 32px/1.3 Noto', color: '#fff', whiteSpace: 'nowrap' }, '1,880円（2024/9/11）').ini({ o: 0 });
    E.wait(2.6);
    P.circle(g, { x: pk.x, y: pk.y, w: 70, h: 70, delay: 0, dur: .35 });
    E.pop(pkLab, .35, .2);
    const L = E.say('hat', '9月11日の高値は、そのあと、一度も戻らなかった。', { wait: false, delay: .3 });
    E.tw(dash, 1.6, { sx: [0, 1] }, 'inOut', .5); E.sfx('slide', { delay: .5, gain: .5 });
    E.at(L.end);
    const p4 = C.at(1215, 369);
    P.circle(g, { x: p4.x, y: p4.y + 10, w: 110, h: 100, color: '#ffd84a', delay: .2, dur: .4 });
    const lab4 = E.div(g, { left: p4.x - 200, top: p4.y + 80, width: 400, textAlign: 'center', padding: '4px 0', borderRadius: 12, background: 'rgba(20,12,16,.8)', font: '900 30px/1.3 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '2025年4月　役員交代').ini({ o: 0 });
    E.pop(lab4, .35, .4);
    E.say('hat', '2025年4月の役員交代のあとも、だ。', { delay: .3 });
    E.wait(.8);
  });

  /* ============================================================ S12 ブルちゃんの部屋 */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_room' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g);
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    const qs = [['決まった？', 1150, 150, -6], ['まだ？', 1460, 120, 5], ['提案？', 1300, 40, -2]].map(([t, x, y, r]) => E.div(g, { left: x, top: y, padding: '10px 26px 12px', borderRadius: 999, background: 'rgba(255,255,255,.95)', font: '900 40px/1.2 Zen', color: '#3a3236', boxShadow: '0 8px 18px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }, t).ini({ o: 0, r }));
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 4, delay: .3 });
    E.wait(.6);
    const L = E.narr('総会、提案、中止。発表があるたびに、私はチャートを見に行った。', { wait: false });
    qs.forEach((q, i) => { E.pop(q, .35, L.dur * (.25 + i * .22), .5); E.sfx('pop', { delay: L.dur * (.25 + i * .22), gain: .4 }); E.float(q, 6, 1.6, i); });
    E.at(L.end);
    E.narr('でも、買わなかった。何が決まって、何が決まっていないのか、分からなかったから。');
    E.wait(.3);
  });

  /* ============================================================ S13 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '「提案」と「決定」は、別の箱に入れろ', { left: 120, top: 120, font: '900 62px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .06));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const boxS = (x, t, sub, c) => E.div(paper, { left: x, top: 470, width: 520, height: 300, borderRadius: 18, border: `6px solid ${c}`, background: 'rgba(255,255,255,.6)' },
      `<div style="position:absolute;left:0;top:-58px;width:520px;text-align:center;font:900 40px/1.2 Zen;color:${c}">${t}</div><div style="position:absolute;left:0;bottom:12px;width:520px;text-align:center;font:800 24px/1.2 Round;color:#6b5a40">${sub}</div>`).ini({ o: 0 });
    const bA = boxS(150, '提案の箱', '言われたこと', P.T_BLUE), bB = boxS(760, '決定の箱', '決まったこと', '#17915a');
    const chip = (t) => E.div(paper, { left: 470, top: 300, width: 460, height: 76, borderRadius: 14, background: '#fffaf0', border: '3px solid #8a7050', textAlign: 'center', font: '900 30px/70px Zen', color: '#3a3236', whiteSpace: 'nowrap', boxShadow: '0 6px 12px rgba(0,0,0,.18)' }, t).ini({ o: 0 });
    const c1 = chip('6,300円の買収提案（T08）'), c2 = chip('総会の招集の許可（I05）'), c3 = chip('総会の中止に合意（I08）');
    E.wait(2.6);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「提案」と「決定」は、別の箱に入れろ。', { wait: false, yomi: '提案と、決定は、別の箱に入れろ。' });
    E.show(bA, .4, L.dur * .3); E.show(bB, .4, L.dur * .5); E.sfx('pop', { delay: L.dur * .3, gain: .5 }); E.sfx('pop', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    const L2 = E.narr('6,300円は、提案の箱。招集の許可と、中止の合意は、決定の箱。', { wait: false });
    const fly = (c, dx, dy, d) => { E.show(c, .25, d); E.tw(c, .55, { x: [0, dx], y: [0, dy] }, 'inOut', d + .3); E.sfx('whoosh', { delay: d + .3, gain: .4 }); };
    fly(c1, -310, 250, .1);
    fly(c2, 300, 230, L2.dur * .45);
    fly(c3, 300, 320, L2.dur * .7);
    E.at(L2.end + .6);
  });

  /* ============================================================ S14 男爵 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .75 });
    const C = P.closeup(g, CH('baron_e_scheme'), { bg: 'radial-gradient(ellipse at 50% 40%, #4a1622 0%, #200a10 75%)', imgH: 860, panelBg: 'linear-gradient(180deg,#3a121b,#1a070c)' });
    E.from(C.img, { s: .94, y: 30 }, .6, 0, 'out');
    E.wait(.5);
    E.say('baron', 'まだ決まっていない数字ほど、人は、大きく見る。', { talk: C.img, talkAmp: 2 });
    C.swap(CH('baron_e_normal'));
    E.say('baron', '決まったことだけを、数えろ。……それができる者は、少ないがな。', { talk: C.img, talkAmp: 2, yomi: '決まったことだけを、かぞえろ。それができる者は、少ないがな。' });
    E.wait(.5);
  });

  /* ============================================================ S15 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 202 });
    const marks = [['T', P.T_BLUE], ['I', P.I_ORANGE]].map(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
      return n;
    });
    const st = P.sticky(g, '第3章<br>経営交代', { x: 1360, y: 120, w: 460, h: 250, rot: 5, size: 48 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第3章だブー。', { talk: pig, talkAmp: 5 });
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
