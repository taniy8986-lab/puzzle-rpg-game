// 完全版 第3章「経営交代」（2025年1〜5月）
// 台本: story/k/k03_経営交代.md　元資料 p4・p10・p15・p17・p18・p26・p27・p35
// 投稿は元資料の要約（本人の見解）。有名投資家の名前・アカウントは出さない。会社の役員の名前も出さない。価格は分割調整後
'use strict';
E.chapter('k03');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;
  const MB = { year: 2025, start: 1, months: 6 };
  const bar = (g, from, to) => P.monthBar(g, { ...MB, from, to });

  // ドーナツ（小数2桁で表示する）
  const donut = (g, { x, y, r = 150, sw = 60, color = P.T_BLUE, pct = 99.88, label = '' }) => {
    const R = r + sw, C = 2 * Math.PI * r;
    const n = E.svg(g, { left: x - R, top: y - R, width: 2 * R, height: 2 * R }, `0 0 ${2 * R} ${2 * R}`,
      `<circle cx="${R}" cy="${R}" r="${r}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="${sw}"/>
       <circle class="arc" cx="${R}" cy="${R}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-dasharray="0 ${C}" transform="rotate(-90 ${R} ${R})"/>`).ini({ o: 0, pct: 0 });
    const arc = n.el.querySelector('.arc');
    const lab = E.div(g, { left: x - 200, top: y - 50, width: 400, textAlign: 'center', font: '900 72px/1.2 Noto', color: '#fff' }).ini({ o: 0 });
    const cap = E.div(g, { left: x - 260, top: y + R + 16, width: 520, textAlign: 'center', font: '900 34px/1.3 Zen', color: '#f3e6c8' }, label).ini({ o: 0 });
    n.hook(p => { const v = Math.max(0, Math.min(100, p.pct)); if (n.c.pct === v) return; n.c.pct = v; arc.setAttribute('stroke-dasharray', `${(C * v / 100).toFixed(2)} ${C.toFixed(2)}`); lab.el.innerHTML = `${v.toFixed(2)}<span style="font-size:.5em">％</span>`; });
    n.in = (d = 0) => { E.show(n, .3, d); E.show(lab, .3, d); E.tw(n, 1.2, { pct: [0, pct] }, 'out', d + .1); E.show(cap, .3, d + .6); };
    n.lab = lab; n.cap = cap;
    return n;
  };
  // 横棒（左から伸びる）
  const hbar = (g, { x = 600, y, w, color, label, val, lx = 300 }) => {
    const lab = E.div(g, { left: lx, top: y, width: x - lx - 20, height: 60, textAlign: 'right', font: '800 28px/60px Round', color: 'rgba(243,230,200,.85)' }, label).ini({ o: 0 });
    const b = E.div(g, { left: x, top: y + 6, width: w, height: 48, borderRadius: 10, background: color, transformOrigin: '0 50%' }).ini({ sx: 0 });
    const v = E.div(g, { left: x + w + 20, top: y, font: '900 36px/60px Noto', color: '#fff', whiteSpace: 'nowrap' }, val).ini({ o: 0 });
    return { show: d => { E.show(lab, .3, d); E.tw(b, .7, { sx: [0, 1] }, 'out', d + .1); E.show(v, .3, d + .6); }, nodes: [lab, b, v] };
  };
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });

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

  /* ============================================================ S0 アバン：2025年1月 */
  E.scene({ name: 'avant_room' }, sc => {
    const g = sc.cam;
    E.bgm('daily', { fadeIn: 1.0, gain: .7 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    const tag = E.div(g, { left: 120, top: 120, padding: '10px 28px', borderRadius: 14, background: 'rgba(255,255,255,.9)', color: '#2a2430', font: '900 38px/1.3 Zen', boxShadow: '0 8px 18px rgba(0,0,0,.2)' }, '2025年1月').ini({ o: 0 });
    E.pop(tag, .4, .3);
    P.look(sc.cam, { s: 1.25, cx: 1250, cy: 450, dur: 6, delay: .3 });
    E.wait(.6);
    E.narr('2025年1月。エスポアは、まだ、私のウォッチリストにあった。');
    E.narr('この年の春、会社の経営陣が、入れ替わる。');
    E.narr('でも、経営陣が替わることと、数字が良くなることは、別の話だった。');
    E.wait(.2);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 3, title: '経営交代', sub: '2025年1月〜5月', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 2025年1〜6月の日足 */
  E.scene({ name: 'daily' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const C = P.chart(g, CHART('04'), { x: 80, y: 150, w: 1760 });
    const ttl = E.div(g, { left: 80, top: 82, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '日足　2025年1月〜6月（25・75・200日線）').ini({ o: 0 });
    E.show(ttl, .4, .1);
    P.note(sc.root, '分割調整後の値段（元資料 p4）', { x: 1500, y: 896, size: 22, dark: true });
    C.draw(3.0, .3);
    E.wait(1.0);
    E.say('hat', 'これが、2025年1月から6月の日足だ。値段は、分割調整後だ。');
    E.say('hat', 'この半年は、業績の悪化と、経営の交代だ。');
    const L = E.say('hat', '再びの下方修正、JPIWとの合意、債務超過、そして役員の交代。', { wait: false, yomi: 'ふたたびの下方修正、ジェーピーアイダブリューとの合意、債務超過、そして役員の交代。' });
    [[277.5, 753.5], [826.5, 753.5], [1432.5, 753.5], [1489.5, 753.5]].forEach(([px, py], i) => { const p = C.at(px, py); P.circle(g, { x: p.x, y: p.y, w: 40, h: 40, color: P.I_ORANGE, sw: 5, delay: .2 + i * L.dur / 4.6, dur: .3, sound: true, seed: i }); });
    E.at(L.end + .4);
  });

  /* ============================================================ S3 I10　1月14日 */
  E.scene({ name: 'i10' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [1, 1], [1, 14]);
    const i10 = P.icard(g, { id: 'I10', when: '2025/1/14 14:50', session: '取引時間内', title: '通期予想を再下方修正', text: '大型物件・在庫物件の販売遅れと、太陽光案件の会計処理変更などを説明', x: 260, y: 120, w: 1400, size: 30 });
    E.tw(i10, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '1月14日、取引時間中の14時50分。会社は、通期の予想を、また下方修正した。');
    const sec = (y, t) => E.div(g, { left: 260, top: y, font: '900 34px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, t).ini({ o: 0 });
    const s1 = sec(400, '売上の予想');
    const a1 = hbar(g, { y: 450, w: 921, color: 'linear-gradient(90deg,#9ec5f0,#5b8fd6)', label: '修正前', val: '9.21億円' });
    const a2 = hbar(g, { y: 520, w: 292, color: 'linear-gradient(90deg,#7fb0ea,#2b68d8)', label: '修正後', val: '2.92億円' });
    E.div(g, { left: 260, top: 605, width: 1400, height: 2, background: 'rgba(243,230,200,.3)' });
    const s2 = sec(620, '営業損失の予想');
    const b1 = hbar(g, { y: 670, w: 930 * .4, color: 'linear-gradient(90deg,#e8a0a0,#d96a6a)', label: '修正前', val: '9,300万円' });
    const b2 = hbar(g, { y: 740, w: 1840 * .4, color: 'linear-gradient(90deg,#e04848,#b3122b)', label: '修正後', val: '1.84億円' });
    const scl = E.div(g, { left: 1300, top: 400, font: '800 24px/1.2 Round', color: 'rgba(243,230,200,.75)', whiteSpace: 'nowrap' }, '※ 上と下で、棒の目盛りは別').ini({ o: 0 });
    let L = E.say('hat', '売上の予想は、9.21億円から、2.92億円へ。', { wait: false, yomi: '売上の予想は、きゅうおく、にせんひゃくまんえんから、におく、きゅうせんにひゃくまんえんへ。' });
    E.show(s1, .3, .1); E.show(scl, .3, .2); a1.show(.3); a2.show(L.dur * .55); E.sfx('drop', { delay: L.dur * .55 + .2, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '営業損失の予想は、9,300万円から、1.84億円に広がった。', { wait: false, yomi: '営業損失の予想は、きゅうせんさんびゃくまんえんから、いちおく、はっせんよんひゃくまんえんに広がった。' });
    E.show(s2, .3, .1); b1.show(.3); b2.show(L.dur * .5);
    E.at(L.end);
    E.say('hat', '大きな物件や在庫の販売の遅れと、太陽光の案件の会計処理の変更などを、理由にしている。');
    const call = P.eveCall(g, ['normal', 'anxious'], { x: 1560, y: 560, w: 320, h: 250 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '去年の10月に続いて、また下方修正なんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: '去年の10月に続いて、また下方修正なんだねー。' });
    E.wait(.3);
  });

  /* ============================================================ S4 I11　2月26日 */
  E.scene({ name: 'i11' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [1, 14], [2, 26]);
    const i11 = P.icard(g, { id: 'I11', when: '2025/2/26 14:45', session: '取引時間内', title: 'JPIWと新体制で合意', text: '協議を経て新たな経営体制を構築する合意書を締結し、<br>取締役選任の臨時総会開催を決議', note: '2024年の対立から2025年4月の役員交代につながる正式開示', x: 260, y: 120, w: 1400, size: 32 });
    E.tw(i11, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '2月26日。会社は、JPIWとの協議を経て、新しい経営体制をつくる合意書を結んだ。', { yomi: '2月26日。会社は、ジェーピーアイダブリューとの協議を経て、新しい経営体制をつくる合意書を結んだ。' });
    E.say('hat', '取締役を選ぶ、臨時総会を開くことも、決めた。');
    const steps = [['2024年', '対立'], ['2025/2/26', '合意（I11）'], ['2025年4月', '役員交代']].map(([d, t], i) => E.div(g, { left: 200 + i * 560, top: 600, width: 420, height: 150, borderRadius: 24, background: i === 1 ? '#fffcf7' : 'rgba(255,255,255,.12)', border: i === 1 ? `6px solid ${P.I_ORANGE}` : '3px solid rgba(243,230,200,.55)', textAlign: 'center' },
      `<div style="font:800 28px/1.2 Noto;color:${i === 1 ? '#b8651a' : 'rgba(243,230,200,.8)'};padding-top:22px">${d}</div><div style="font:900 44px/1.4 Zen;color:${i === 1 ? '#2a2230' : '#f3e6c8'}">${t}</div>`).ini({ o: 0 }));
    const arrows = [0, 1].map(i => E.div(g, { left: 640 + i * 560, top: 640, width: 100, textAlign: 'center', font: '900 60px/1 Zen', color: '#ffd84a' }, '→').ini({ o: 0 }));
    const L = E.say('hat', '2024年の対立から、4月の役員交代へ。その間をつなぐ、正式な開示だ。', { wait: false });
    steps.forEach((s, i) => { E.tw(s, .4, { o: [0, 1], y: [20, 0] }, 'back', .2 + i * L.dur * .28); E.sfx('pop', { delay: .2 + i * L.dur * .28, gain: .5 }); if (i) E.show(arrows[i - 1], .3, .1 + i * L.dur * .28); });
    E.at(L.end + .4);
  });

  /* ============================================================ S5 I12　4月14日　債務超過 */
  E.scene({ name: 'i12' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .7 });
    P.slate(g);
    bar(g, [2, 26], [4, 14]);
    const i12 = P.icard(g, { id: 'I12', when: '2025/4/14 14:00', session: '取引時間内', title: '2025年2月期の決算・債務超過', text: '当時の連結短信は売上3.06億円、営業損失2.11億円、純損失2.47億円、<br>純資産マイナス4,000万円。同日、固定資産の減損損失と業績予想との差異も開示', x: 260, y: 120, w: 1400, size: 30 });
    E.tw(i12, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '4月14日、14時。2025年2月期の決算が出た。');
    const nums = [['売上', '3.06億円', '#2b68d8'], ['営業損失', '2.11億円', '#c62828'], ['純損失', '2.47億円', '#c62828']].map(([k, v, c], i) => E.div(g, { left: 260 + i * 480, top: 470, width: 440, height: 150, borderRadius: 22, background: 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="font:800 30px/1.2 Round;color:#6a6066;padding-top:22px">${k}</div><div style="font:900 56px/1.4 Noto;color:${c}">${v}</div>`).ini({ o: 0 }));
    let L = E.say('hat', '当時の発表で、売上3.06億円、営業損失2.11億円、純損失2.47億円。', { wait: false, yomi: '当時の発表で、売上、さんおく、ろっぴゃくまんえん、営業損失、におく、いっせんひゃくまんえん、純損失、におく、よんせんななひゃくまんえん。' });
    nums.forEach((n, i) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', .3 + i * L.dur * .3); E.sfx('pop', { delay: .3 + i * L.dur * .3, gain: .5 }); });
    E.at(L.end);
    const neg = panel(g, { x: 460, y: 660, w: 1000, h: 130, size: 46, html: '<span>純資産</span><span style="font:900 60px Noto;color:#c62828">−4,000万円</span><span style="padding:4px 18px;border-radius:12px;background:#c62828;color:#fff">債務超過</span>' });
    L = E.say('hat', 'そして、純資産は、マイナス4,000万円。債務超過だ。', { wait: false, yomi: 'そして、純資産は、マイナス、よんせんまんえん。債務超過だ。' });
    E.tw(neg, .4, { o: [0, 1], s: [1.3, 1] }, 'in2', L.dur * .4); E.sfx('stamp', { delay: L.dur * .4 + .3 }); E.shake(g, .3, 6, L.dur * .4 + .35);
    E.at(L.end + .3);
  });

  E.scene({ name: 'balance' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '債務超過とは（しくみの図）', 44);
    E.show(tt, .3);
    const base = 760;
    const col = (x, w, h, c, t) => { const n = E.div(g, { left: x, top: base - h, width: w, height: h, borderRadius: '16px 16px 0 0', background: c, transformOrigin: '50% 100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: '900 40px/1.35 Zen', color: '#fff' }, t).ini({ sy: 0 }); return n; };
    const asset = col(420, 420, 380, 'linear-gradient(180deg,#5b8fd6,#2b68d8)', '持ち物<br><span style="font-size:28px">（資産）</span>');
    const debt = col(1080, 420, 470, 'linear-gradient(180deg,#e06a6a,#b3122b)', '借りているもの<br><span style="font-size:28px">（負債）</span>');
    E.div(g, { left: 300, top: base, width: 1320, height: 6, background: '#f3e6c8' });
    const gapL = E.div(g, { left: 840, top: base - 470, width: 240, height: 90, borderTop: '4px dashed #ffd84a', borderBottom: '4px dashed #ffd84a', textAlign: 'center', font: '900 30px/82px Zen', color: '#ffd84a' }, '足りない').ini({ o: 0 });
    const note = E.div(g, { left: 0, top: 800, width: W, textAlign: 'center', font: '800 26px/1.4 Round', color: 'rgba(243,230,200,.8)' }, '大きさはイメージ。エスポアの資産・負債の金額ではない').ini({ o: 0 });
    E.wait(.3);
    const L = E.say('hat', '債務超過は、会社の持ち物を全部足しても、借りているものに足りない状態だ。', { wait: false });
    E.tw(asset, .7, { sy: [0, 1] }, 'out', .2); E.sfx('rise', { delay: .2, gain: .4 });
    E.tw(debt, .8, { sy: [0, 1] }, 'out', L.dur * .4); E.sfx('rise', { delay: L.dur * .4, gain: .4 });
    E.show(gapL, .3, L.dur * .8); E.show(note, .3, L.dur * .8);
    E.at(L.end);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 460, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .5, { x: [420, 0] }, 'back'); E.sfx('snort', { delay: .2 });
    E.say('pig', 'ブヒッ。持ち物より、借りが多いってことだブー。', { talk: pig, talkAmp: 4, delay: .4 });
    E.say('hat', '同じ日に、固定資産の減損と、予想との差も、開示している。');
    E.wait(.3);
  });

  /* ============================================================ S6 T10　4月16日 */
  E.scene({ name: 't10' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 14], [4, 16]);
    const clk = P.clock(g, { x: 150, y: 220, size: 260, min: 540, label: '2025/4/16' });
    E.tw(clk, 1.0, { min: [540, 622] }, 'inOut', .3); E.sfx('tick', { delay: .3, gain: .6 });
    const t10 = P.tcard(g, { id: 'T10', when: '2025/4/16 10:22', kind: '経営', session: '取引時間内', text: '総会での株主提案可決の可能性に言及', note: '否決を見込む売りがあるとの解釈。翌日の結果を断定した投稿ではない', x: 540, y: 200, w: 1240, size: 38 });
    E.tw(t10, .45, { o: [0, 1], x: [60, 0] }, 'back', 1.3); E.sfx('notify', { delay: 1.3 });
    E.wait(1.7);
    E.narr('4月16日の朝。総会の前の日に、株主提案が可決される可能性に触れる投稿があった。');
    const m1 = P.mark(g, '本人の解釈', { x: 640, y: 600, color: P.T_BLUE, size: .8, rot: -6 });
    const no = panel(g, { x: 1060, y: 610, w: 720, h: 110, size: 34, html: '翌日の結果を、言い切った投稿ではない' });
    let L = E.say('hat', '否決を見込んだ売りがある、という本人の解釈だ。', { wait: false });
    P.stampIn(m1, L.dur * .5);
    E.at(L.end);
    L = E.say('hat', '翌日の結果を、言い切った投稿ではない。', { wait: false });
    E.tw(no, .4, { o: [0, 1], x: [40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end + .4);
  });

  /* ============================================================ S7 4月17日　15:10 → 15:11 → 16:28 */
  E.scene({ name: 'apr17' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 16], [4, 17]);
    const clk = P.clock(g, { x: 150, y: 220, size: 260, min: 840, label: '2025/4/17' });
    E.tw(clk, 1.2, { min: [840, 910] }, 'inOut', .3); E.sfx('tick', { delay: .3, gain: .6 }); E.sfx('tick', { delay: .9, gain: .6 });
    const i13 = P.icard(g, { id: 'I13', when: '2025/4/17 15:10', session: '取引時間内', title: '株主提案可決・役員交代', text: '取締役4名の選任議案が可決、従前の取締役5名が辞任', x: 540, y: 200, w: 1240, size: 34 });
    E.tw(i13, .45, { o: [0, 1], x: [60, 0] }, 'back', 1.4); E.sfx('notify', { delay: 1.4 });
    E.wait(1.8);
    E.say('hat', '4月17日、15時10分。会社は、総会の結果を開示した。');
    const people = (x, n, c, lab) => { const box = E.div(g, { left: x, top: 560, width: 560, height: 220, borderRadius: 22, background: 'rgba(255,255,255,.1)', border: '3px solid rgba(243,230,200,.5)' }).ini({ o: 0 });
      for (let i = 0; i < n; i++) E.svg(box, { left: 280 - n * 45 + i * 90, top: 30, width: 80, height: 90 }, '0 0 100 112', `<circle cx="50" cy="32" r="22" fill="${c}"/><path d="M10 112 Q12 62 50 60 Q88 62 90 112Z" fill="${c}"/>`);
      E.div(box, { left: 0, top: 140, width: 560, textAlign: 'center', font: '900 36px/1.3 Zen', color: '#f3e6c8' }, lab); return box; };
    const pOld = people(320, 5, '#8a93a3', '従前の取締役5人　辞任'), pNew = people(1040, 4, '#ffd84a', '取締役4人　選任（可決）');
    const L = E.say('hat', '取締役4人を選ぶ議案が可決されて、それまでの取締役5人が辞任した。', { wait: false });
    E.tw(pNew, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('pop', { delay: .3 });
    E.tw(pOld, .4, { o: [0, .55], y: [20, 0] }, 'back', L.dur * .6); E.sfx('pop', { delay: L.dur * .6 });
    E.at(L.end + .3);
  });

  E.scene({ name: 'apr17_posts' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 17], [4, 17]);
    const ch = P.chain(g, { y: 150, items: [{ id: 'I13', time: '15:10', sub: '会社の開示（取引時間内）', color: P.I_ORANGE }, { id: 'T11', time: '15:11', sub: '投稿', color: P.T_BLUE }, { id: 'T12', time: '16:28', sub: '投稿（引け後）', color: P.T_BLUE }], gaps: ['1分後', ''] });
    ch.in(0, .2); ch.in(1, .7);
    const t11 = P.tcard(g, { id: 'T11', when: '2025/4/17 15:11', kind: '経営', session: '取引時間内', text: '株主提案可決・役員交代を速報', note: '投稿は15時11分。翌日以降も継続上昇したかを別に確認', x: 300, y: 340, w: 1320, size: 38 });
    E.tw(t11, .45, { o: [0, 1], y: [30, 0] }, 'back', 1.4); E.sfx('notify', { delay: 1.4 });
    E.wait(1.8);
    E.narr('その1分後、15時11分。会社の公表を、投稿で共有した。');
    E.tw(t11, .35, { o: 0, x: -60 }, 'in2');
    ch.in(2, .2);
    const t12 = P.tcard(g, { id: 'T12', when: '2025/4/17 16:28', kind: '経営', session: '引け後', text: '旧経営陣に謝意を表明', note: 'MSワラントに頼らなかった点などを評価。価格予想は記載されていない', x: 300, y: 340, w: 1320, size: 38 });
    E.tw(t12, .45, { o: [0, 1], x: [60, 0] }, 'back', .8); E.sfx('notify', { delay: .8 });
    E.wait(1.2);
    E.narr('16時28分には、それまでの経営陣に、感謝を伝える投稿。');
    E.say('hat', 'MSワラントに頼らなかった点などを、評価している。値段の予想は、書いていない。', { yomi: 'エムエスワラントに頼らなかった点などを、評価している。値段の予想は、書いていない。' });
    E.wait(.3);
  });

  E.scene({ name: 'ms' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, 'MSワラントとは（しくみの図）', 44);
    E.show(tt, .3);
    const steps = ['株価が動く', '行使の値段も<br>合わせて変わる', '新しい株が<br>増える', '1株の価値が<br>薄まりやすい'].map((t, i) => E.div(g, { left: 120 + i * 440, top: 360, width: 360, height: 230, borderRadius: 26, background: i === 3 ? '#fdecec' : 'rgba(255,255,255,.95)', border: i === 3 ? '5px solid #c62828' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: '900 38px/1.4 Zen', color: i === 3 ? '#a31f1f' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)' }, t).ini({ o: 0 }));
    const ar = [0, 1, 2].map(i => E.div(g, { left: 482 + i * 440, top: 440, width: 76, textAlign: 'center', font: '900 56px/1 Zen', color: '#ffd84a' }, '→').ini({ o: 0 }));
    E.wait(.3);
    let L = E.say('hat', 'MSワラントは、株価に合わせて、行使の値段が変わる新株予約権だ。', { wait: false, yomi: 'エムエスワラントは、株価に合わせて、行使の値段が変わる、しんかぶよやくけんだ。' });
    E.tw(steps[0], .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2, gain: .5 });
    E.show(ar[0], .3, L.dur * .45); E.tw(steps[1], .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .5); E.sfx('pop', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '株が増えるので、1株の価値が薄まりやすい。', { wait: false, yomi: '株が増えるので、ひとかぶの価値が薄まりやすい。' });
    E.show(ar[1], .3, .1); E.tw(steps[2], .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2, gain: .5 });
    E.show(ar[2], .3, L.dur * .5); E.tw(steps[3], .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .55); E.sfx('drop', { delay: L.dur * .55, gain: .5 });
    E.at(L.end + .5);
  });

  /* ============================================================ S8 +7.95％を、日足でどう読むか */
  E.scene({ name: 'plus795' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    const C = P.chart(g, CHART('04'), { x: 80, y: 150, w: 1760 });
    E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '日足　2025年4月16日・17日');
    P.note(sc.root, '分割調整後の値段（元資料 p4）', { x: 1500, y: 896, size: 22, dark: true });
    const a = C.at(1470, 392), b = C.at(1489, 352);
    P.look(sc.cam, { s: 2.0, cx: (a.x + b.x) / 2 - 40, cy: (a.y + b.y) / 2 + 20, dur: 1.4, delay: .3 });
    const lab = (pt, txt, dx, dy, c) => E.div(g, { left: pt.x + dx, top: pt.y + dy, padding: '3px 10px', borderRadius: 8, background: 'rgba(255,255,255,.96)', font: '900 17px/1.3 Noto', color: c, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }, txt).ini({ o: 0 });
    const la = lab(a, '4/16 終値 1,173.33円', -205, 6, '#262236'), lb = lab(b, '4/17 終値 1,266.67円（+7.95％）', 14, -34, '#c62828');
    E.wait(1.6);
    let L = E.say('hat', '4月16日の終値は、1,173.33円。4月17日は、1,266.67円。', { wait: false, yomi: '4月16日の、おわりねは、せんひゃくななじゅうさんてんさんさんえん。4月17日は、せんにひゃくろくじゅうろくてんろくななえん。' });
    E.pop(la, .3, .2); P.circle(g, { x: a.x, y: a.y, w: 24, h: 24, sw: 3, color: '#ffd84a', delay: .2, dur: .3 });
    E.pop(lb, .3, L.dur * .55); P.circle(g, { x: b.x, y: b.y, w: 24, h: 24, sw: 3, delay: L.dur * .55, dur: .3 });
    E.at(L.end);
    E.say('hat', 'プラス7.95％だ。', { yomi: 'プラス、ななてんきゅうごパーセントだ。' });
    E.wait(.3);
  });

  E.scene({ name: 'plus795_clock' }, sc => {
    const g = sc.cam;
    P.slate(g);
    E.div(g, { left: 80, top: 80, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '2025年4月17日　時刻の順番');
    const ax = P.dayAxis(g, { x: 180, y: 330, w: 1560, from: 480, to: 1020, open: 540, band: [[540, 690, '前場'], [750, 930, '後場']] });
    E.show(ax.root, .5, .2);
    const dI13 = P.axisDot(g, ax, { m: 910, y: 330, kind: 'I', label: 'I13 15:10' });
    const dT11 = P.axisDot(g, ax, { m: 911, y: 330, kind: 'T', label: 'T11 15:11', lift: 48 });
    const q = E.div(g, { left: ax.tx(540), top: 470, width: ax.tx(930) - ax.tx(540), textAlign: 'center', font: '900 34px/1.4 Zen', color: '#f3e6c8' },
      'その日の +7.95％ は、<span style="color:#ffd84a">発表の前？</span>　それとも　<span style="color:#ffd84a">後？</span><div style="font:800 26px/1.5 Round;color:rgba(243,230,200,.8)">日足だけでは分からない（元資料には分足のデータがない）</div><div style="font:800 26px/1.5 Round;color:rgba(243,230,200,.8)">前後の値動きは、投稿が原因だった証明ではない（元資料 p35）</div>').ini({ o: 0 });
    E.wait(.8);
    E.pop(dI13, .4, 0); E.sfx('pop');
    E.say('hat', 'ただ、会社の発表は、取引時間の中の15時10分。', { delay: .3 });
    E.pop(dT11, .4, 0); E.sfx('pop', { gain: .5 });
    const L = E.say('hat', '日足だけでは、その日の上昇が、発表の前だったか、後だったかは、分からない。', { wait: false, delay: .3 });
    E.tw(q, .45, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .4); E.sfx('ding', { delay: L.dur * .4, gain: .5 });
    E.at(L.end);
    const call = P.eveCall(g, ['normal', 'smile'], { x: 1560, y: 600, w: 320, h: 250 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '分足の記録がないと、そこは、決められないんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: 'ふんあしの記録がないと、そこは、決められないんだねー。' });
    E.say('hat', 'どちらだったとしても、値動きは、投稿が原因だった証明にはならない。');
    E.say('hat', 'それに、元資料は、翌日以降も上がり続けたかは、別に確認する、と書いている。');
    E.wait(.3);
  });

  /* ============================================================ S9 I14　4月22日 */
  E.scene({ name: 'i14' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 17], [4, 22]);
    const i14 = P.icard(g, { id: 'I14', when: '2025/4/22 18:30', session: '引け後', title: '監査法人アリアを選任へ', text: '5/28総会に監査法人アリアの選任を付議。<br>従前の海南監査法人は任期満了予定と説明', note: '後の意見不表明を出す監査人の就任経緯', x: 260, y: 140, w: 1400, size: 34 });
    E.tw(i14, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '4月22日、引け後。会社は、監査法人アリアを、新しい監査人に選ぶ議案を出した。', { yomi: '4月22日、ひけご。会社は、監査法人アリアを、新しい、かんさにんに選ぶ議案を出した。' });
    E.say('hat', 'それまでの海南監査法人は、任期満了の予定、という説明だ。', { yomi: 'それまでの、かいなん監査法人は、任期満了の予定、という説明だ。' });
    const fw = panel(g, { x: 360, y: 640, w: 1200, h: 120, size: 38, dark: true, html: '監査法人アリアが、のちに「意見不表明」を出す' });
    const L = E.say('hat', '監査法人アリアが、のちに、意見不表明を出すことになる。', { wait: false });
    E.tw(fw, .45, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('dun', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S10 T13　4月28日　99.88％ */
  E.scene({ name: 't13' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 22], [4, 28]);
    const t13 = P.tcard(g, { id: 'T13', when: '2025/4/28 17:02', kind: '経営', session: '引け後', text: '賛成票99.88%を挙げ企業価値向上を求める', note: '議決権賛成率と、市場で売られない株式の比率は別の数値', x: 260, y: 140, w: 1400, size: 38 });
    E.tw(t13, .45, { o: [0, 1], x: [60, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.narr('4月28日。賛成票99.88％を挙げて、企業価値の向上を求める投稿があった。', { yomi: '4月28日。賛成票、キュージューキューテンハチハチパーセントを挙げて、企業価値の向上を求める投稿があった。' });
    E.tw(t13, .4, { o: 0, y: -30 }, 'in2');
    const d = donut(g, { x: 560, y: 520, r: 150, sw: 56, pct: 99.88, label: '総会での、議決権の賛成率' });
    const ne = E.div(g, { left: 900, top: 470, width: 120, textAlign: 'center', font: '900 90px/1 Zen', color: '#ffd84a' }, '≠').ini({ o: 0 });
    const other = E.div(g, { left: 1080, top: 340, width: 640, height: 360, borderRadius: 30, border: '5px dashed rgba(243,230,200,.7)', background: 'rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
      '<div style="font:900 40px/1.4 Zen;color:#f3e6c8">市場で売られない<br>株の割合</div><div style="font:900 64px/1.4 Zen;color:#ffd84a">別の数字</div>').ini({ o: 0 });
    let L = E.say('hat', '99.88％は、総会での、議決権の賛成の割合だ。', { wait: false, yomi: 'キュージューキューテンハチハチパーセントは、総会での、議決権の賛成の割合だ。' });
    d.in(.2); E.sfx('rise', { delay: .3, gain: .4 });
    E.at(L.end);
    L = E.say('hat', '市場で売られない株の割合とは、別の数字だ。読み替えちゃいけない。', { wait: false });
    E.pop(ne, .35, .2, .5); E.sfx('pop', { delay: .2 });
    E.tw(other, .45, { o: [0, 1], x: [40, 0] }, 'back', L.dur * .3); E.sfx('slide', { delay: L.dur * .3 });
    E.at(L.end + .4);
  });

  /* ============================================================ S11 I15　5月29日 */
  E.scene({ name: 'i15' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [4, 28], [5, 29]);
    const i15 = P.icard(g, { id: 'I15', when: '2025/5/29 16:30', session: '引け後', title: '債務超過解消計画', text: '純資産マイナス4,045.7万円を説明。<br>業務改善・第三者割当などの資本増強を検討', note: '計画の発表自体は債務超過解消の確定ではない', x: 260, y: 120, w: 1400, size: 34 });
    E.tw(i15, .45, { o: [0, 1], y: [30, 0] }, 'back', .5); E.sfx('notify', { delay: .5 });
    E.wait(1.0);
    E.say('hat', '5月29日には、債務超過を解消するための、計画を出した。');
    E.say('hat', '純資産は、マイナス4,045.7万円。', { yomi: '純資産は、マイナス、よんせんよんじゅうごてんななまんえん。' });
    E.say('hat', '業務の改善や、第三者割当などで、資本を増やすことを、検討する、という中身だ。');
    // 改善期間の帯
    const x0 = 260, x1 = 1660, y = 640;
    const days = (a, b) => (b - a) / 86400000;
    const T0 = Date.UTC(2025, 2, 1), T1 = Date.UTC(2026, 1, 28);
    const xt = t => x0 + days(T0, t) / days(T0, T1) * (x1 - x0);
    const rail = E.div(g, { left: x0, top: y, width: x1 - x0, height: 26, borderRadius: 13, background: 'linear-gradient(90deg,#d9822b,#c62828)', transformOrigin: '0 50%' }).ini({ sx: 0 });
    const lab = (x, t, up) => E.div(g, { left: x - 160, top: up ? y - 70 : y + 40, width: 320, textAlign: 'center', font: '900 30px/1.3 Noto', color: '#f3e6c8', whiteSpace: 'nowrap' }, t).ini({ o: 0 });
    const l0 = lab(x0 + 60, '2025/3/1', true), l1 = lab(x1 - 60, '2026/2/28', true);
    const ttl = E.div(g, { left: x0, top: y + 100, width: x1 - x0, textAlign: 'center', font: '900 36px/1.3 Zen', color: '#ffd84a' }, '改善期間').ini({ o: 0 });
    const pin = E.div(g, { left: xt(Date.UTC(2025, 4, 29)) - 110, top: y + 34, width: 220, textAlign: 'center' }, `<div style="font:900 30px/1 Zen;color:${P.I_ORANGE}">▲</div><div style="font:900 26px/1.3 Noto;color:#fff;background:${P.I_ORANGE};border-radius:10px;padding:2px 0">5/29 計画（I15）</div>`).ini({ o: 0 });
    E.tw(i15, .4, { y: -20, s: .92 }, 'inOut');
    let L = E.say('hat', '改善期間は、2025年3月1日から、2026年2月28日まで。', { wait: false });
    E.show(l0, .3, .2); E.tw(rail, 1.2, { sx: [0, 1] }, 'inOut', .3); E.sfx('slide', { delay: .3, gain: .5 }); E.show(l1, .3, 1.4); E.show(ttl, .3, 1.5);
    E.at(L.end);
    L = E.say('hat', '計画を出したことと、債務超過が解消したことは、別だ。', { wait: false });
    E.tw(pin, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('pop', { delay: .2 });
    E.at(L.end + .5);
  });

  /* ============================================================ S11 週足：上値の切り下げ */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'weekly' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const C = P.chart(g, CHART('10'), { x: 80, y: 150, w: 1760 });
    E.div(g, { left: 80, top: 82, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '週足　2024年1月〜2026年10月（13・26・52週線）');
    P.note(sc.root, '分割調整後の値段（元資料 p10）', { x: 1500, y: 896, size: 22, dark: true });
    C.draw(2.4, .2);
    const a = C.at(1214.5, 348), b = C.at(1586, 442);
    const len = Math.hypot(b.x - a.x, b.y - a.y), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    const ln = E.div(g, { left: a.x, top: a.y - 3, width: len, height: 0, borderTop: '6px dashed #ffd84a', transformOrigin: '0 50%' }).ini({ r: ang, sx: 0 });
    ln.el.style.transformOrigin = '0 0';
    const lab = E.div(g, { left: a.x + 40, top: a.y - 90, padding: '4px 16px', borderRadius: 12, background: 'rgba(20,12,16,.85)', font: '900 30px/1.3 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '役員交代（I13）のあとも、上値は切り下がった').ini({ o: 0 });
    const pk = C.at(735.5, 240);
    const pkLab = E.div(g, { left: pk.x + 30, top: pk.y - 66, padding: '4px 16px', borderRadius: 12, background: '#c62828', font: '900 30px/1.3 Noto', color: '#fff', whiteSpace: 'nowrap' }, '2024/9 の高値 1,880円').ini({ o: 0 });
    E.wait(2.6);
    let L = E.say('hat', '週足で見ると、役員交代のあとも、高値は、少しずつ切り下がっていった。', { wait: false, yomi: '週足で見ると、役員交代のあとも、高値は、少しずつ、きりさがっていった。' });
    P.circle(g, { x: a.x, y: a.y, w: 60, h: 60, color: '#ffd84a', delay: .2, dur: .35 });
    const i13 = C.at(1211, 750);
    P.circle(g, { x: i13.x, y: i13.y, w: 40, h: 40, color: P.I_ORANGE, sw: 5, delay: .5, dur: .3, sound: false });
    E.tw(ln, 1.4, { sx: [0, 1] }, 'inOut', .5); E.sfx('slide', { delay: .5, gain: .5 });
    E.show(lab, .3, L.dur * .6);
    E.at(L.end);
    L = E.say('hat', '2024年9月の1,880円には、戻っていない。', { wait: false, yomi: '2024年9月の、せんはっぴゃくはちじゅうえんには、戻っていない。' });
    P.circle(g, { x: pk.x, y: pk.y, w: 60, h: 60, delay: .2, dur: .35 });
    E.pop(pkLab, .35, .3);
    E.at(L.end + .6);
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
    const memo = E.div(g, { left: 1150, top: 90, padding: '12px 30px 14px', borderRadius: 18, background: 'rgba(255,255,255,.95)', font: '900 38px/1.4 Zen', color: '#3a3236', boxShadow: '0 8px 18px rgba(0,0,0,.25)', whiteSpace: 'nowrap' }, '経営陣：交代　／　債務超過：<span style="color:#c62828">まだ</span>').ini({ o: 0, r: -2 });
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 4, delay: .3 });
    E.wait(.6);
    const L = E.narr('新しい経営陣。でも、債務超過は、まだ解消していなかった。', { wait: false });
    E.pop(memo, .4, L.dur * .4, .6); E.sfx('pop', { delay: L.dur * .4, gain: .4 });
    E.at(L.end);
    E.narr('計画は、発表された。解消したかどうかは、まだ、分からなかった。');
    E.wait(.3);
  });

  /* ============================================================ S13 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '計画の日と、結果の日は、別の日', { left: 120, top: 120, font: '900 64px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .07));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    E.wait(2.8);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「計画の日と、結果の日は、別の日」。', { wait: false, yomi: '計画の日と、結果の日は、別の日。' });
    const cal = (x, y, m, yr, d, txt, c, delay) => {
      const wrap = E.div(paper, { left: x, top: y, width: 820, height: 650 }).ini({ s: .62, o: 0 });
      const cl = P.calendar(wrap, { x: 0, y: 0, w: 820, year: yr, month: m });
      const p = cl.pos(d);
      E.tw(wrap, .45, { o: [0, 1], y: [30, 0] }, 'back', delay); E.sfx('page', { delay, gain: .6 });
      P.circle(wrap, { x: p.x, y: p.y, w: 110, h: 84, sw: 9, color: c, delay: delay + .4, dur: .35 });
      const tag = E.div(paper, { left: x + 160, top: y + 538, width: 500, textAlign: 'center', font: '900 36px/1.3 Zen', color: c, whiteSpace: 'nowrap' }, txt).ini({ o: 0 });
      E.show(tag, .3, delay + .6);
    };
    cal(-36, 107, 5, 2025, 29, '2025/5/29　計画', P.I_ORANGE, .2);
    cal(604, 107, 2, 2026, 28, '2026/2/28　改善期間の終わり', '#c62828', .2 + L.dur * .45);
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
    E.say('baron', '顔ぶれが替わると、人は、値段も替わると思いたがる。', { talk: C.img, talkAmp: 2 });
    C.swap(CH('baron_e_scheme'));
    E.say('baron', 'だが、決算の数字は、ひと晩では良くならん。', { talk: C.img, talkAmp: 2 });
    E.wait(.5);
  });

  /* ============================================================ S15 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 303 });
    [['T', P.T_BLUE], ['I', P.I_ORANGE]].forEach(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
    });
    const st = P.sticky(g, '第4章<br>蓄電池と65億円', { x: 1340, y: 120, w: 500, h: 250, rot: 5, size: 44 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第4章だブー。', { talk: pig, talkAmp: 5 });
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
