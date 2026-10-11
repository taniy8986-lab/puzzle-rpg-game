// 第4章「審判の日」（2026年9月15日〜9月16日）
// 台本: story/04_第4章_審判の日.md　元資料 p3・p11・p12・p25
// 金額は第三者委員会の試算（会社の最終確定の訂正値とは区別）
'use strict';
E.chapter('04');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const DISCLAIMER = 'この物語はフィクションです　｜　エスポア（3260）の事実関係は公開資料に基づきます　｜　投資助言ではありません';
  const TRIAL_NOTE = '※金額は第三者委員会の試算（会社が確定した訂正値とは別）';
  const ROWS = [
    ['1:15', '第三者委員会の調査報告書を受領', '#6b6252'],
    ['16:00', '調査報告書を公表', '#c62828'],
    ['17:00', '名証：上場廃止を決定', '#c62828'],
  ];
  const MASK = '#5a0a14';
  const man = '<span style="font-size:.5em">万円</span>';

  /* ============================================================ S0 アバン */
  E.scene({ name: 'avant', bg: '#2a211b' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: 1.5, gain: .9 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 42% 42%, #7a5f46 0%, #4a3829 55%, #241b14 100%)' });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'repeating-linear-gradient(8deg, rgba(255,230,190,.035) 0 3px, transparent 3px 26px)' });
    const cal = P.calendar(g, { x: 300, y: 150, w: 780, year: 2026, month: 9 });
    E.from(cal, { y: 80 }, .9, .1, 'quint');
    const st = P.sticky(g, '第4章<br>審判の日', { x: 1440, y: 160, w: 380, h: 240, rot: 6, size: 46 });
    P.slap(st, 1.4);
    const note = P.note(g, DISCLAIMER, { x: 40, y: 30, size: 22, dark: true }).ini({ o: 0 });
    E.show(note, .6, .4);
    E.tw(sc.cam, 9, { s: [1, 1.08], x: [0, 50], y: [0, 30] }, 'linear');
    E.wait(1.8);
    const L = E.narr('9月15日。約束の日が来た。', { wait: false });
    const p15 = cal.pos(15), p16 = cal.pos(16);
    P.circle(g, { x: p15.x, y: p15.y, w: 104, h: 76, dur: .45, delay: L.dur * .3 });
    P.circle(g, { x: p16.x, y: p16.y, w: 104, h: 76, dur: .45, delay: L.dur * .7, seed: 3 });
    E.hide(note, .5, L.dur * .5);
    E.at(L.end + .8);
  });

  E.scene({ name: 'sleepless', fade: .6 }, sc => {
    const g = sc.cam;
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { hi: 0 });
    const bull = E.actor(g, 'bull', { x: 760, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 1.8);
    E.tw(sc.cam, 7, { s: [1.02, 1.12], x: [0, -80] }, 'linear');
    for (let i = 0; i < 6; i++) E.sfx('tick', { delay: .4 + i * 1.0, gain: .6 });
    E.wait(.8);
    E.narr('その夜、私は眠れなかった。');
    E.wait(1.2);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編', catchCopy: '〜 期待が事実を追い越すとき 〜', dur: 4.6 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 4, title: '審判の日', sub: '2026年9月15日 〜 9月16日', dur: 3.4 });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 深夜1時15分 */
  E.bgm('tension', { fadeIn: 1.0, gain: .75 });
  P.phoneScene((ph, sc) => {
    const lk = P.lock(ph, { date: '9月16日', week: '水曜日', time: '0:59', night: true });
    E.wait(1.2);
    E.set(lk.time, { line: E.line('1:15') });
    E.tw(lk.time, .3, { s: [1.12, 1] }, 'back');
    E.sfx('tick', { gain: .9 });
    const nt = P.notice(ph, { title: 'エスポア（3260）', body: '第三者委員会の<br>調査報告書の<span style="color:#d42a2a">受領</span>に関するお知らせ', y: 330 });
    P.notifyIn(nt, .6);
    E.wait(1.0);
    E.narr('9月16日、深夜1時15分。会社は、報告書を受け取ったと発表した。');
    E.wait(.3);
  }, { name: 'phone115', wait: 0, night: true });

  E.scene({ name: 'bull_wait' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_trouble'), { bg: 'linear-gradient(180deg,#1b2446,#0f152c)', panelBg: 'linear-gradient(180deg,#2a3560,#1a2244)', imgH: 820 });
    E.tw(C.img, 6, { s: [1, 1.05] }, 'linear');
    E.wait(.3);
    E.say('bull', '中身は……まだ、書いてない。', { talk: C.img, talkAmp: 2, yomi: '中身は、まだ、書いてない。' });
    E.wait(.2);
  });

  // 時計の針が深夜1時15分から夕方4時まで回る
  E.scene({ name: 'clock' }, sc => {
    const g = sc.cam;
    const night = E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'linear-gradient(180deg,#0b1430,#1d2a55)' });
    const day = E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'linear-gradient(180deg,#f7c98a,#e8935a)' }).ini({ o: 0 });
    const cx = 960, cy = 430, R = 300;
    let ticks = '';
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ticks += `<rect x="-6" y="${-R + 26}" width="12" height="${i % 3 ? 26 : 46}" rx="6" fill="#3a3340" transform="rotate(${i * 30})"/>`; }
    E.svg(g, { left: cx - R - 20, top: cy - R - 20, width: 2 * R + 40, height: 2 * R + 40 }, `${-R - 20} ${-R - 20} ${2 * R + 40} ${2 * R + 40}`,
      `<circle r="${R + 10}" fill="#3a3340"/><circle r="${R}" fill="#fffaf0"/>${ticks}`);
    const hh = E.div(g, { left: cx - 10, top: cy - 170, width: 20, height: 180, borderRadius: 10, background: '#2a2430', transformOrigin: '50% 94%' }).ini({ r: (1 + 15 / 60) * 30 });
    const mh = E.div(g, { left: cx - 7, top: cy - 250, width: 14, height: 260, borderRadius: 7, background: '#c62828', transformOrigin: '50% 96%' }).ini({ r: 15 * 6 });
    E.div(g, { left: cx - 20, top: cy - 20, width: 40, height: 40, borderRadius: '50%', background: '#2a2430' });
    const lab = E.text(g, { left: 0, top: cy + R + 40, width: W, textAlign: 'center', font: '900 64px/1.2 Noto', color: '#fff', textShadow: '0 4px 12px rgba(0,0,0,.5)' }, '深夜 1:15');
    E.wait(.4);
    const L = E.narr('中身が公表されたのは、その日の夕方4時だった。', { wait: false });
    const spin = Math.max(2.2, L.dur * .8);
    E.tw(hh, spin, { r: (16) * 30 + 360 }, 'inOut', .2);
    E.tw(mh, spin, { r: 0 * 6 + 360 * 15 }, 'inOut', .2);
    E.tw(day, spin, { o: [0, 1] }, 'inOut', .2);
    E.set(lab, { line: E.line('夕方 4:00') }, spin + .2);
    E.tw(lab, .3, { s: [1.15, 1] }, 'back', spin + .2);
    E.sfx('rise', { delay: .2, gain: .35 });
    E.sfx('ding', { delay: spin + .2, gain: .6 });
    E.at(Math.max(L.end, E.T + spin + .2) + .8);
  });

  /* ============================================================ S3 報告書の答え */
  E.trans('fade', { dur: .7, color: '#000' });
  E.scene({ name: 'lair' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .3, gain: .9 });
    const L = P.lair(g, { faces: ['surprise', 'normal', 'anxious', 'cry'] });
    const rows = P.board(L.screen, '9月16日 ｜ エスポア（3260）', ROWS);
    rows[0].ini({ o: 1 });
    E.tw(rows[1], .4, { o: [0, 1], x: [60, 0] }, 'back', 1.0);
    E.sfx('dun', { delay: .3, gain: .8 });
    E.tw(sc.cam, 3.0, { s: [1.3, 1], y: [150, 0] }, 'inOut');
    E.breathe(L.baron, .008, 1.5);
    E.breathe(L.hat, .01, 1.9);
    L.pigs.forEach((p, i) => E.breathe(p, .012, 2.3, i));
    E.wait(2.6);
    P.look(sc.cam, { s: 1.3, cx: 1685, cy: 330, dur: .8 });
    E.say('eve', 'ねえねえ、報告書、出たよ〜！', { talk: L.call, talkAmp: 3, delay: .2 });
  });

  E.scene({ name: 'hat_close' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('hat_e_proud'), { fit: 'cover', pos: '50% 38%', bg: 'linear-gradient(180deg,#2c1316,#170909)' });
    E.from(C.img, { s: 1.08 }, .5);
    E.tw(C.img, 6, { s: [1, 1.05] }, 'linear', .5);
    E.wait(.2);
    E.say('hat', '答え合わせの時間だ。', { talk: C.img, talkAmp: 2 });
    E.wait(.3);
  });

  E.scene({ name: 'deals' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .8 });
    P.slate(g);
    const tt = P.heading(g, '第三者委員会の答え　3件の取引', 50);
    E.show(tt, .4);
    P.note(g, TRIAL_NOTE, { x: 1180, y: 816, size: 22, dark: true });
    const deals = [
      { n: '①', amt: `1億1,000${man}`, text: '仕事（役務）が本当に<br>あったとは認めない<br><b style="color:#c62828">→ 売上から除外すべき</b>', mark: '認めず', mc: '#c62828' },
      { n: '②', amt: `約4,545${man}`, text: '役務の実在性も<br>2026年2月期の計上も<br><b style="color:#17915a">否定されず</b>', mark: '否定されず', mc: '#17915a' },
      { n: '③', amt: `2,000${man}`, text: '架空とは断定しない<br>でも計上すべきは<br><b style="color:#d9822b">2027年2月期</b>', mark: '時期ちがい', mc: '#d9822b' },
    ];
    const cards = deals.map((d, i) => {
      const c = E.div(g, { left: 110 + i * 580, top: 150, width: 540, height: 630, borderRadius: 28, background: '#fffdf8', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,.4)' }).ini({ o: 0 });
      E.div(c, { left: 0, top: 0, width: 540, height: 90, background: '#3a3340' }, `<div style="position:absolute;left:30px;top:0;font:900 46px/90px Zen;color:#fff;white-space:nowrap">取引 ${d.n}</div>`);
      E.div(c, { left: 0, top: 120, width: 540, textAlign: 'center', font: '900 82px/1.2 Noto', color: '#262230', whiteSpace: 'nowrap' }, d.amt);
      E.div(c, { left: 30, top: 250, width: 480, textAlign: 'center', font: '800 34px/1.6 Round', color: '#4a4552' }, d.text);
      c.mark = P.mark(c, d.mark, { x: 270 - 120, y: 490, color: d.mc, size: .95, rot: -8, w: 240 });
      return c;
    });
    cards.forEach((c, i) => { E.tw(c, .5, { o: [0, 1], y: [80, 0] }, 'back', .3 + i * .25); E.sfx('slide', { delay: .3 + i * .25 }); });
    E.wait(1.3);
    const focus = i => cards.forEach((c, j) => E.tw(c, .35, j === i ? { s: 1.05, bright: 1 } : { s: .96, bright: .55 }, 'back'));
    focus(0);
    let L = E.say('hat', '取引①、1億1,000万円。仕事があったとは、認められなかった。', { wait: false, yomi: 'とりひき、いち。1億1000万円。仕事があったとは、認められなかった。' });
    P.stampIn(cards[0].mark, L.dur * .8);
    E.at(L.end);
    focus(1);
    L = E.say('hat', '取引②、約4,545万円。こっちは、否定されなかった。', { wait: false, yomi: 'とりひき、に。約4545万円。こっちは、否定されなかった。' });
    P.stampIn(cards[1].mark, L.dur * .8);
    E.at(L.end);
    focus(2);
    L = E.say('hat', '取引③、2,000万円。架空とまでは言えないが、計上する年が違う。', { wait: false, yomi: 'とりひき、さん。2000万円。架空とまでは言えないが、計上する年が違う。' });
    P.stampIn(cards[2].mark, L.dur * .82);
    E.at(L.end);
    cards.forEach(c => E.tw(c, .35, { s: 1, bright: 1 }, 'out'));
    E.narr('3件すべてが、同じ答えではなかった。');
    E.wait(.3);
  });

  /* ============================================================ S4 修正の影響 */
  E.scene({ name: 'impact' }, sc => {
    const g = sc.cam;
    P.slate(g);
    P.note(g, TRIAL_NOTE, { x: 1180, y: 816, size: 22, dark: true });
    // 式
    const eq = [
      ['取引①', '1億1,000万円', '#c62828'], ['＋', '', null], ['取引③', '2,000万円', '#d9822b'], ['＝', '', null], ['修正の影響', '1億3,000万円', '#ffd84a'],
    ];
    let ex = 120;
    const parts = eq.map(([a, b, c]) => {
      const w = b ? (a === '修正の影響' ? 470 : 400) : 90;
      const n = b
        ? E.div(g, { left: ex, top: 60, width: w, height: 150, borderRadius: 20, background: 'rgba(255,255,255,.08)', border: `4px solid ${c}`, textAlign: 'center' },
          `<div style="font:800 30px/1.2 Round;color:${c};margin-top:16px">${a}</div><div style="font:900 46px/1.4 Noto;color:#fff;white-space:nowrap">${b}</div>`).ini({ o: 0 })
        : E.div(g, { left: ex, top: 80, width: w, textAlign: 'center', font: '900 80px/1.2 Zen', color: '#f3e6c8' }, a).ini({ o: 0 });
      ex += w + 24;
      return n;
    });
    // 純資産の棒
    const zeroY = 470;
    E.div(g, { left: 360, top: zeroY - 3, width: 1200, height: 6, borderRadius: 3, background: '#f3e6c8' });
    E.div(g, { left: 250, top: zeroY - 22, font: '800 32px/1.2 Round', color: '#f3e6c8' }, '0');
    E.div(g, { left: 560, top: zeroY - 64, width: 260, font: '800 32px/1.4 Round', color: '#f3e6c8', whiteSpace: 'nowrap' }, '連結純資産');
    const bar = P.netBar(g, { x: 850, y0: zeroY, w: 220, scale: .028 }).ini({ v: 2131.8 });
    const tag = E.div(g, { left: 1160, top: 600, padding: '10px 28px 12px', borderRadius: 14, background: '#c62828', color: '#fff', font: '900 46px/1.2 Zen', whiteSpace: 'nowrap', boxShadow: '0 10px 20px rgba(0,0,0,.35)' }, '債務超過（試算）').ini({ o: 0, r: -4 });
    [bar, bar.val].forEach(n => n.ini({ o: 0 }));
    E.wait(.4);
    let L = E.say('hat', '修正の影響は、①と③で、合わせて1億3,000万円。', { wait: false, yomi: '修正の影響は、いちと、さんで、合わせて1億3000万円。' });
    parts.forEach((n, i) => { E.pop(n, .35, .2 + i * L.dur * .16, .6); });
    E.sfx('pop', { delay: .2 }); E.sfx('pop', { delay: .2 + 2 * L.dur * .16 }); E.sfx('cash', { delay: .2 + 4 * L.dur * .16, gain: .6 });
    E.at(L.end);
    E.show(bar, .4); E.show(bar.val, .4);
    L = E.say('hat', '純資産は、プラス2,131.8万円から、マイナス1億868.2万円へ。', { wait: false, yomi: 'じゅんしさんは、プラス2131.8万円から、マイナス1億868.2万円へ。' });
    E.tw(bar, 2.0, { v: [2131.8, -10868.2] }, 'inOut', L.dur * .35);
    E.sfx('drop', { delay: L.dur * .35, gain: .7 });
    E.shake(sc.cam, .5, 8, L.dur * .35 + 1.9);
    E.at(Math.max(L.end, E.T + L.dur * .35 + 2.0));
    L = E.say('hat', '委員会の試算では、債務超過だ。', { wait: false });
    E.tw(tag, .35, { o: [0, 1], s: [1.8, 1] }, 'in2', L.dur * .4);
    E.sfx('stamp', { delay: L.dur * .4 + .3 });
    E.at(L.end + .2);
  });

  E.scene({ name: 'eve_shock' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('eve_e_surprise'), { fit: 'cover', pos: '50% 30%', bg: 'linear-gradient(180deg,#2c1316,#170909)' });
    E.from(C.img, { s: 1.12 }, .35, 0, 'back');
    E.sfx('impact', { gain: .4 });
    E.say('eve', 'えっ……マイナス……？', { talk: C.img, talkAmp: 3, yomi: 'えっ、マイナス？' });
    E.wait(.2);
  });

  /* ============================================================ S5 代表者の関与 */
  E.scene({ name: 'involvement' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .5, gain: .85 });
    const { hat, call, bd } = P.boardScene(g, ['anxious', 'cry', 'normal']);
    E.div(bd, { left: 0, top: 36, width: 1020, textAlign: 'center', font: '900 46px/1.2 Zen', color: '#2a2430' }, '取引③　報告書の認定');
    const yb = (x, t1, t2, c) => {
      const n = E.div(bd, { left: x, top: 140, width: 400, height: 300, borderRadius: 22, background: '#f3eee4', border: `5px solid ${c}` });
      E.div(n, { left: 0, top: 22, width: 400, textAlign: 'center', font: '900 40px/1.2 Zen', color: c }, t1);
      E.div(n, { left: 0, top: 76, width: 400, textAlign: 'center', font: '800 28px/1.2 Round', color: '#8a8070' }, t2);
      return n;
    };
    yb(70, '2026年2月期', '（今年）', '#c62828');
    yb(550, '2027年2月期', '（来年）', '#17915a');
    const money = E.div(bd, { left: 610, top: 300, width: 280, height: 100, borderRadius: 14, background: '#ffd84a', boxShadow: '0 8px 16px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 44px/1 Noto', color: '#3a2c10' }, '2,000万円').ini({ o: 0 });
    const who = E.div(bd, { left: 60, top: 480, width: 900, textAlign: 'center', font: '800 32px/1.6 Round', color: '#4a4552' }, '代表取締役が主体的に関与<br>債務超過の解消を意識し、来年の収益を今年に計上').ini({ o: 0 });
    const mk = P.mark(bd, '不適切な会計処理', { x: 230, y: 610, color: '#c62828', size: .9, rot: -5, w: 560 });
    E.pop(money, .4, .5); E.sfx('pop', { delay: .5 });
    E.wait(1.0);
    E.say('hat', 'しかも報告書は、取引③について、', { talk: hat, talkAmp: 2, gap: .1, yomi: 'しかも報告書は、とりひき、さんについて、' });
    let L = E.say('hat', '代表者自身が関わった、不適切な会計処理だと書いた。', { talk: hat, talkAmp: 2, wait: false });
    E.tw(who, .5, { o: [0, 1], y: [20, 0] }, 'out', .2);
    P.stampIn(mk, L.dur * .75);
    E.at(L.end);
    L = E.say('hat', '債務超過の解消を意識して、来年の分の収益を、今年に入れた。そう認定されたのさ。', { talk: hat, talkAmp: 2, wait: false });
    // 来年の箱から今年の箱へ移る
    E.tw(money, 1.1, { x: -480, y: [0, 0], r: [0, -8] }, 'inOut', L.dur * .3);
    E.fn(1.1, k => { money.p.y -= Math.sin(k * Math.PI) * 90; }, L.dur * .3, true);
    E.sfx('whoosh', { delay: L.dur * .3 });
    E.sfx('stamp', { delay: L.dur * .3 + 1.1, gain: .5 });
    E.set(call, { face: 'cry' }, L.dur * .6);
    E.at(L.end + .3);
  });

  /* ============================================================ S6 17時：上場廃止の決定 */
  E.scene({ name: 'lair_17' }, sc => {
    const g = sc.cam;
    const L = P.lair(g, { faces: ['cry', 'anxious', 'surprise'] });
    const rows = P.board(L.screen, '9月16日 ｜ エスポア（3260）', ROWS);
    rows[0].ini({ o: 1 }); rows[1].ini({ o: 1 });
    E.breathe(L.baron, .008, 1.5);
    L.pigs.forEach((p, i) => E.breathe(p, .012, 2.3, i));
    P.look(sc.cam, { s: 1.45, cx: 960, cy: 250, dur: 1.0 });
    const red = E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 40%, rgba(255,40,40,0) 30%, rgba(255,30,30,.55) 100%)' }).ini({ o: 0 });
    E.wait(.8);
    let T = E.narr('そして、夕方5時。', { wait: false });
    E.tw(rows[2], .4, { o: [0, 1], x: [60, 0] }, 'back', T.dur * .6);
    E.sfx('alarm', { delay: T.dur * .6, gain: .45 });
    E.at(T.end);
    E.fn(4.5, (k, t) => { red.p.o = Math.max(red.p.o, .5 + .5 * Math.sin(t * 7)); }, 0, true);
    E.narr('名古屋証券取引所が、上場廃止を決めた。');
    E.wait(.5);
  });

  E.scene({ name: 'schedule' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '上場廃止までの流れ', 70);
    E.show(tt, .4);
    const x0 = 260, x1 = 1660, y = 470;
    const line = E.div(g, { left: x0, top: y, width: x1 - x0, height: 10, borderRadius: 5, background: '#f3e6c8' }).ini({ cr: 100 });
    E.tw(line, 1.0, { cr: [100, 0] }, 'inOut', .2);
    const band = E.div(g, { left: x0, top: y - 70, width: (x1 - x0) * .7, height: 54, borderRadius: 12, background: 'rgba(217,98,43,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 34px/1 Zen', color: '#fff', whiteSpace: 'nowrap' }, '整理銘柄（9/16〜10/16）').ini({ o: 0, cr: 100 });
    const pts = [[0, '9/16', '整理銘柄に指定'], [.7, '10/16', '整理銘柄の最終日'], [1, '10/17', '上場廃止の予定日']];
    const nodes = pts.map(([k, d, t], i) => {
      const x = x0 + (x1 - x0) * k;
      const dot = E.div(g, { left: x - 26, top: y - 21, width: 52, height: 52, borderRadius: '50%', background: i === 2 ? '#c62828' : '#f3e6c8', border: '8px solid #2a3a5a' }).ini({ o: 0 });
      const dl = E.div(g, { left: x - 160, top: y + 50, width: 320, textAlign: 'center', font: '900 54px/1.2 Noto', color: i === 2 ? '#ff8a8a' : '#fff' }, d).ini({ o: 0 });
      const tl = E.div(g, { left: x - 200, top: y + 120, width: 400, textAlign: 'center', font: '800 32px/1.3 Round', color: '#e8dcc0' }, t).ini({ o: 0 });
      return [dot, dl, tl];
    });
    E.wait(.6);
    const L = E.say('hat', '整理銘柄に指定されて、10月17日に、上場廃止だ。', { wait: false });
    nodes[0].forEach(n => E.pop(n, .4, .1, .6)); E.sfx('click', { delay: .1 });
    E.tw(band, .8, { o: [0, 1], cr: [100, 0] }, 'inOut', L.dur * .2);
    nodes[1].forEach(n => E.pop(n, .4, L.dur * .45, .6)); E.sfx('click', { delay: L.dur * .45 });
    nodes[2].forEach(n => E.pop(n, .45, L.dur * .65, .4)); E.sfx('stamp', { delay: L.dur * .65 + .1, gain: .6 });
    E.at(L.end + .6);
  });

  /* ============================================================ S7 廃止の理由を混同しない */
  E.scene({ name: 'reason' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '上場廃止の「正式な理由」はどっち？', 50);
    E.show(tt, .4);
    const card = (x, head, big, small, c) => {
      const n = E.div(g, { left: x, top: 160, width: 780, height: 560, borderRadius: 28, background: '#fffdf8', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,.4)' }).ini({ o: 0 });
      E.div(n, { left: 0, top: 0, width: 780, height: 92, background: c }, `<div style="position:absolute;left:0;top:0;width:100%;text-align:center;font:900 42px/92px Zen;color:#fff">${head}</div>`);
      E.div(n, { left: 30, top: 140, width: 720, textAlign: 'center', font: '900 60px/1.35 Zen', color: '#262230' }, big);
      E.div(n, { left: 30, top: 390, width: 720, textAlign: 'center', font: '800 30px/1.6 Round', color: '#6b6252' }, small);
      return n;
    };
    const a = card(140, '第三者委員会の試算', '債務超過', '連結純資産　▲1億868.2万円（試算）', '#6b6252');
    const b = card(1000, '名証の正式な理由', '監査報告書に<br>「意見の表明をしない」', '上場廃止理由：虚偽記載又は不適正意見等<br>有価証券上場規程　第601条第8号', '#b3122b');
    E.tw(a, .45, { o: [0, 1], x: [-60, 0] }, 'back', .3); E.sfx('slide', { delay: .3 });
    E.tw(b, .45, { o: [0, 1], x: [60, 0] }, 'back', .6); E.sfx('slide', { delay: .6 });
    const pig = E.img(g, CH('pig_e_shock'), { left: 1520, top: 760, height: 330 }).ini({ o: 0 });
    E.wait(1.2);
    E.tw(pig, .4, { o: [0, 1], y: [200, 0] }, 'back');
    E.sfx('snort', { delay: .1 });
    E.say('pig', 'ブヒッ。債務超過だから、上場廃止なんですかい？', { talk: pig, talkAmp: 4, delay: .2 });
    E.tw(pig, .3, { o: 0, y: 200 }, 'in2');
    E.say('hat', 'そこを混同しちゃいけない。');
    const spot = E.div(g, { left: 900, top: 60, width: 980, height: 780, background: 'radial-gradient(ellipse at 50% 50%, rgba(255,240,190,.28), rgba(255,240,190,0) 65%)' }).ini({ o: 0 });
    E.tw(a, .4, { bright: .45, s: .95 }, 'out');
    E.tw(b, .4, { s: 1.04 }, 'back');
    E.show(spot, .5);
    E.sfx('ding', { gain: .5 });
    E.say('hat', '取引所の正式な理由は、監査報告書に「意見を表明しない」と書かれたことだ。', { yomi: '取引所の正式な理由は、監査報告書に、意見を表明しない、と書かれたことだ。' });
    E.say('hat', 'すぐに上場をやめないと、市場の秩序を守れない。取引所は、そう判断した。');
    E.tw(a, .4, { bright: 1, s: 1 }, 'out');
    E.tw(b, .4, { s: 1 }, 'out');
    E.hide(spot, .4);
    E.say('hat', '債務超過の試算と、正式な廃止の理由。この二つは、分けて覚えておきな。');
    E.wait(.3);
  });

  /* ============================================================ S8 答え合わせ */
  E.scene({ name: 'answers' }, sc => {
    const g = sc.cam;
    P.nightBg(g);
    const tt = P.heading(g, '8月の読み方、答え合わせ', 60);
    E.show(tt, .4);
    const reads = ['「延期」＝ 良い方向', '「期日が決まった」＝ 認められる'];
    const cards = reads.map((t, i) => E.div(g, { left: 260, top: 190 + i * 200, width: 1000, height: 150, borderRadius: 24, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', paddingLeft: 50, font: '900 56px/1.2 Zen', color: '#262236', whiteSpace: 'nowrap', boxShadow: '0 14px 28px rgba(0,0,0,.35)' }, t).ini({ o: 0 }));
    const tags = reads.map((_, i) => P.mark(g, '裏付けられなかった', { x: 1300, y: 210 + i * 200, color: '#c62828', size: .85, rot: -6, w: 420 }));
    const info = E.div(g, { left: 260, top: 610, width: 1400, height: 170, borderRadius: 24, background: 'rgba(255,216,74,.12)', border: '4px solid #ffd84a', textAlign: 'center', paddingTop: 22, font: '800 36px/1.6 Round', color: '#ffe9a8' },
      '再延期のあとの最終報告で、具体的になったこと<br><span style="font:900 44px/1.5 Zen;color:#fff">独立性の問題 ／ 取引・統制の問題</span>').ini({ o: 0 });
    cards.forEach((c, i) => { E.tw(c, .45, { o: [0, 1], x: [-80, 0] }, 'back', .3 + i * .3); E.sfx('slide', { delay: .3 + i * .3 }); });
    E.wait(1.1);
    E.say('hat', '延期は、良い方向。期日が決まったから、認められる。', { gap: .1 });
    const L = E.say('hat', '8月に見かけた読み方は、どれも、結果では裏付けられなかった。', { wait: false });
    tags.forEach((t, i) => P.stampIn(t, L.dur * (.5 + i * .2)));
    E.at(L.end);
    const L2 = E.say('hat', '再延期のあとの最終報告では、独立性や、取引・統制の問題が、具体的に書かれていた。', { wait: false });
    E.tw(info, .5, { o: [0, 1], y: [30, 0] }, 'back', .3); E.sfx('chime', { delay: .3, gain: .4 });
    E.at(L2.end + .4);
  });

  /* ============================================================ S9 ブルちゃんの部屋（夜） */
  E.trans('fade', { dur: .8, color: '#000' });
  E.scene({ name: 'bull_cry' }, sc => {
    const g = sc.cam;
    E.bgm('sad', { fadeIn: 1.0, gain: .85 });
    const C = P.closeup(g, CH('bull_e_cry'), { bg: 'linear-gradient(180deg,#1b2446,#0f152c)', panelBg: 'linear-gradient(180deg,#2a3560,#1a2244)', imgH: 820 });
    E.particles(g, { n: 70, kind: 'rain', color: '#9fb2ff', area: [0, 0, W, H], speed: 1, seed: 21 });
    E.tw(C.img, 9, { s: [1, 1.06] }, 'linear');
    E.wait(.6);
    E.say('bull', '……うそ、だよね。', { talk: C.img, talkAmp: 1.5, yomi: 'うそ、だよね。', gap: .6 });
    E.narr('私が安心のために選んだ読み方は、ひとつも当たっていなかった。');
    E.wait(1.0);
  });

  /* ============================================================ S10 正体 */
  E.scene({ name: 'dark_room' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .6, gain: 1 });
    const R = P.room(g, { night: true });
    const wl = P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { hi: 0 });
    const bull = E.actor(g, 'bull', { x: 760, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 1.8);
    const dark = E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse 700px 500px at 1760px 659px, rgba(4,6,14,.15) 0%, rgba(4,6,14,.7) 70%)' });
    // モニターが勝手に点き、赤い目が映る
    const black = E.div(R.screen, { left: 0, top: 0, width: 492, height: 290, background: '#050304' }).ini({ o: 0 });
    const eyes = E.img(R.screen, CH('baron_eyes'), { left: 76, top: 80, height: 400 }).ini({ o: 0 });
    const glow = E.div(g, { left: 700, top: 0, width: 1400, height: 1000, background: 'radial-gradient(ellipse at 50% 45%, rgba(255,40,40,.32), rgba(255,40,40,0) 60%)', mixBlendMode: 'screen' }).ini({ o: 0 });
    E.wait(1.0);
    E.sfx('glitch', { gain: .7 });
    E.fn(.6, (k, t) => { black.p.o = Math.sin(t * 60) > 0 ? 1 : 0; }, 0, true);
    E.set(black, { o: 1 }, .6);
    E.tw(eyes, .8, { o: [0, 1] }, 'in2', .9);
    E.tw(glow, .8, { o: [0, 1] }, 'in2', .9);
    E.sfx('heartbeat', { delay: 1.0 });
    E.shake(bull, .3, 6, 1.0);
    P.look(sc.cam, { s: 1.35, cx: 1250, cy: 470, dur: 2.4, delay: .9 });
    E.wait(1.9);
    E.say('mentor', '……希望を、事実の代わりに使うな。', { chip: '？？？', chipColor: MASK, yomi: '希望を、事実の代わりに使うな。', gap: .5 });
  });

  E.scene({ name: 'bull_realize' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_surprise'), { bg: 'linear-gradient(180deg,#2a0c12,#0d0406)', panelBg: 'linear-gradient(180deg,#3a1018,#14060a)', imgH: 820 });
    E.from(C.img, { s: .9 }, .3, 0, 'back');
    E.sfx('impact', { gain: .35 });
    E.say('bull', 'その言葉……。', { talk: C.img, talkAmp: 2, yomi: 'その言葉。', gap: .4 });
  });

  E.scene({ name: 'monitor' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: '#050304' });
    const eyes = E.img(g, CH('baron_eyes'), { left: -60, top: 80, height: 2400 });
    E.tw(eyes, 5, { s: [1, 1.08] }, 'linear');
    E.div(g, { left: 0, top: 0, width: W, height: H, backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,.05) 0 2px, transparent 2px 6px)' });
    E.vignette(g, .8);
    E.shake(eyes, .4, 14, 0);
    E.sfx('glitch', { gain: .5 });
    E.wait(.5);
    E.say('baron', 'そう教えたはずだがな、ブル。', { chip: '？？？', chipColor: MASK, gap: .5 });
  });

  E.scene({ name: 'photo' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #2b1c14 0%, #0b0705 80%)' });
    const fr = E.div(g, { left: 960 - 330, top: 70, width: 660, height: 690, borderRadius: 14, background: '#8a5a30', boxShadow: '0 30px 60px rgba(0,0,0,.6), inset 0 0 0 6px #6b4220' }).ini({ r: -3 });
    const sep = E.img(fr, CH('mentor_photo'), { left: 40, top: 40, width: 580, height: 610, objectFit: 'cover', borderRadius: 4 });
    const col = E.img(fr, CH('mentor_photo_color'), { left: 40, top: 40, width: 580, height: 610, objectFit: 'cover', borderRadius: 4 }).ini({ o: 0 });
    E.from(fr, { s: .55, y: 260 }, 1.0, 0, 'quint');
    E.tw(fr, 9, { s: [1, 1.1] }, 'linear', 1.0);
    E.grain(g, .1);
    E.wait(1.2);
    const L = E.say('bull', '師匠……？', { yomi: 'ししょう？', gap: .6, wait: false });
    E.at(L.end);
    // セピアから色が戻る
    E.tw(col, 1.6, { o: [0, 1] }, 'inOut');
    E.sfx('swell', { gain: .6 });
    E.wait(1.6);
    E.flash('#fff', .4, .95);
    E.sfx('thunder', { gain: .9 });
    E.wait(.35);
  });

  E.scene({ name: 'baron_reveal' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .1, gain: 1 });
    const C = P.closeup(g, CH('baron_face_big'), { bg: 'radial-gradient(ellipse at 50% 40%, #6a1420, #140707)', panelBg: 'linear-gradient(180deg,#3a0f16,#120607)', imgH: 1020 });
    E.from(C.img, { s: 1.25 }, .5, 0, 'quint');
    E.tw(C.img, 9, { s: [1, 1.08] }, 'linear', .5);
    E.particles(g, { n: 60, kind: 'ember', color: '#ff5a4a', area: [0, 0, W, H], speed: 1, seed: 23 });
    E.wait(.6);
    E.say('baron', '押し目おじさんは、もういない。', { talk: C.img, talkAmp: 1.5, chip: '？？？', chipColor: MASK, gap: .5 });
    const cr = P.crack(g, { cx: 960, cy: 430, n: 13, len: 1100, seed: 7 });
    const L = E.say('baron', '私は、空売り男爵だ。', { talk: C.img, talkAmp: 1.5, chip: '空売り男爵', wait: false });
    E.flash('#ff2a2a', .6, .5, L.dur * .55);
    P.crackIn(cr, L.dur * .55);
    E.sfx('boom', { delay: L.dur * .55, gain: .9 });
    E.shake(sc.cam, .6, 16, L.dur * .55);
    E.at(L.end + 1.2);
  });

  // 押し目おじさん ＝ 空売り男爵
  E.scene({ name: 'equal' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #3a1018 0%, #120507 80%)' });
    const lf = E.div(g, { left: 170, top: 130, width: 560, height: 560, borderRadius: 14, background: '#8a5a30', boxShadow: '0 24px 50px rgba(0,0,0,.6)' }).ini({ r: -4, o: 0 });
    E.img(lf, CH('mentor_photo'), { left: 30, top: 30, width: 500, height: 500, objectFit: 'cover' });
    const rf = E.div(g, { left: 1190, top: 130, width: 560, height: 560, borderRadius: 14, background: '#2a0c12', overflow: 'hidden', boxShadow: '0 24px 50px rgba(0,0,0,.6), inset 0 0 0 6px #c9a24a' }).ini({ r: 4, o: 0 });
    E.img(rf, CH('baron_e_normal'), { left: 30, top: 10, width: 500 });
    const eq = E.div(g, { left: 0, top: 300, width: W, textAlign: 'center', font: '900 200px/1 Zen', color: '#ffd84a', textShadow: '0 0 30px rgba(255,216,74,.6)' }, '＝').ini({ o: 0 });
    const l1 = E.div(g, { left: 170, top: 730, width: 560, textAlign: 'center', font: '900 58px/1.2 Zen', color: '#f3e6c8' }, '押し目おじさん').ini({ o: 0 });
    const l2 = E.div(g, { left: 1190, top: 730, width: 560, textAlign: 'center', font: '900 58px/1.2 Zen', color: '#ff8a8a' }, '空売り男爵').ini({ o: 0 });
    E.tw(lf, .6, { o: [0, 1], x: [-200, 0] }, 'quint', .2);
    E.tw(rf, .6, { o: [0, 1], x: [200, 0] }, 'quint', .2);
    E.sfx('whoosh_big', { delay: .2 });
    E.tw(eq, .45, { o: [0, 1], s: [2.4, 1] }, 'in2', .9);
    E.sfx('dun', { delay: 1.2, gain: .9 });
    E.show(l1, .5, 1.6); E.show(l2, .5, 1.8);
    E.wait(4.6);
  });

  /* ============================================================ S11 次回予告 */
  E.trans('fade', { dur: .9, color: '#000' });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #3a2c24 0%, #1d1612 75%, #120d0a 100%)' });
    const items = [['9/16', '上場廃止を決定'], ['9/17', '値幅の拡大'], ['9/18', '？']];
    const x0 = 260, x1 = 1300, y = 470;
    const line = E.div(g, { left: x0, top: y, width: x1 - x0, height: 8, borderRadius: 4, background: '#c9a24a' }).ini({ cr: 100 });
    E.tw(line, 1.0, { cr: [100, 0] }, 'inOut', .2);
    items.forEach(([d, t], i) => {
      const x = x0 + i * (x1 - x0) / (items.length - 1);
      const dot = E.div(g, { left: x - 22, top: y - 18, width: 44, height: 44, borderRadius: '50%', background: i === 2 ? '#e0353f' : '#f3e6c8', border: '6px solid #c9a24a' }).ini({ o: 0 });
      const dl = E.div(g, { left: x - 150, top: y - 90, width: 300, textAlign: 'center', font: '900 44px/1.2 Noto', color: '#f3e6c8' }, d).ini({ o: 0 });
      const tl = E.div(g, { left: x - 190, top: y + 54, width: 380, textAlign: 'center', font: '800 32px/1.35 Round', color: i === 2 ? '#ff8a8a' : '#e8dcc0' }, t).ini({ o: 0 });
      [dot, dl, tl].forEach(n => E.pop(n, .4, .4 + i * .4, .6));
      E.sfx('click', { delay: .4 + i * .4 });
    });
    const st = P.sticky(g, '第5章<br>9月18日の幻', { x: 1420, y: 110, w: 420, h: 250, rot: 5, size: 44 });
    P.slap(st, 2.0);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.6);
    E.sfx('snort', { delay: 2.8 });
    E.wait(3.2);
    E.say('pig', 'ブヒッ。次は9月18日。ある有名投資家のひと言だブー。', { talk: pig, talkAmp: 5 });
    E.unsub(.4);
    const end = E.div(g, { left: 0, top: 860, width: W, textAlign: 'center', font: '800 26px/1.5 Round', color: 'rgba(240,228,205,.85)' }, DISCLAIMER).ini({ o: 0 });
    E.show(end, .8, .5);
    const tsu = E.div(g, { left: 0, top: 700, width: W, textAlign: 'center', font: '900 64px/1.2 Zen', color: '#f3e6c8', letterSpacing: '.3em' }, 'つづく').ini({ o: 0 });
    E.show(tsu, .8, .9);
    E.wait(4.2);
  });
  E.bgmStop(2.5, -2.5);
  E.finish();
}
