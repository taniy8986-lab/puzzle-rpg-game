// 第2章「調査は止まった」（2026年6月11日〜7月10日）
// 台本: story/02_第2章_調査は止まった.md　元資料 p3・p5・p6
'use strict';
E.chapter('02');
{
  const { W, H, rnd } = E;
  const CH = n => `assets/chara/${n}.png`;
  const DISCLAIMER = 'この物語はフィクションです　｜　エスポア（3260）の事実関係は公開資料に基づきます　｜　投資助言ではありません';
  const ROWS = [
    ['5/27', '監査報告書の「意見不表明」に関するお知らせ', '#6b6252'],
    ['6/30', '第三者委員会による調査の一時中断', '#c62828'],
    ['7/10', '第三者委員会の再設置 ／ 名証：監理銘柄（審査中）', '#c62828'],
  ];

  // 解説用の黒板っぽい背景
  const slate = g => {
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 40%, #2d3e5e 0%, #1d2942 65%, #121a2c 100%)' });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.035) 2px, transparent 2px)', backgroundSize: '60px 60px' });
  };
  const title = (g, text, y = 60) => E.div(g, { left: 0, top: y, width: W, textAlign: 'center', font: '900 58px/1.2 Zen', color: '#f3e6c8', textShadow: '0 4px 10px rgba(0,0,0,.4)' }, text).ini({ o: 0 });
  // アジトの中の白いボード（左にハット、右にイブの通話）
  const boardScene = (g, faces = ['normal', 'smile', 'surprise', 'anxious']) => {
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 35%, #3d1b22 0%, #200d10 70%, #140707 100%)' });
    const hat = E.actor(g, 'hat', { x: 230, y: 1100, h: 640, pose: 'front' });
    E.breathe(hat, .01, 1.9);
    const call = P.call(g, { x: 1530, y: 560, w: 360, h: 290, faces });
    const bd = E.div(g, { left: 450, top: 50, width: 1020, height: 760, borderRadius: 20, background: '#fbf9f4', boxShadow: '0 24px 60px rgba(0,0,0,.55)' });
    E.from(bd, { y: 50, s: .97 }, .5, 0, 'quint');
    return { hat, call, bd };
  };
  // ぼかした部屋の前にスマホ
  const phoneScene = ({ date, week, title: tt, body, cx, cy, cw, ch, bg = 'linear-gradient(180deg,#f9e8de,#f1d0c3)' }) => {
    E.scene({ name: 'phone' }, sc => {
      const g = sc.cam;
      const back = E.div(g, { left: 0, top: 0, width: W, height: H }).ini({ blur: 12, bright: .85 });
      const R = P.room(back);
      P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証']], { hi: 0 });
      const ph = P.phone(g, { x: 750, y: 110, w: 420, h: 850, bg });
      P.lock(ph, { date, week });
      E.from(ph, { y: 760 }, .6, 0, 'quint');
      E.sfx('whoosh');
      const nt = P.notice(ph, { app: '適時開示アラート', title: tt, body, y: 330 });
      P.notifyIn(nt, .9);
      P.look(sc.cam, { s: 1.18, cx: 960, cy: 430, dur: 3.4, delay: 1.4 });
      E.wait(2.4);
      P.circle(ph.screen, { x: cx, y: cy, w: cw, h: ch, dur: .45 });
      E.wait(1.5);
    });
  };

  /* ============================================================ S0 アバン */
  E.scene({ name: 'avant', bg: '#2a211b' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: 1.5, gain: .9 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 42% 42%, #7a5f46 0%, #4a3829 55%, #241b14 100%)' });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'repeating-linear-gradient(8deg, rgba(255,230,190,.035) 0 3px, transparent 3px 26px)' });
    const cal = P.calendar(g, { x: 300, y: 150, w: 780, year: 2026, month: 6 });
    E.from(cal, { y: 80 }, .9, .1, 'quint');
    const st = P.sticky(g, '第2章<br>調査は止まった', { x: 1430, y: 160, w: 380, h: 240, rot: 6, size: 42 });
    P.slap(st, 1.4);
    const note = P.note(g, DISCLAIMER, { x: 40, y: 30, size: 22, dark: true }).ini({ o: 0 });
    E.show(note, .6, .4);
    E.tw(sc.cam, 10, { s: [1, 1.08], x: [0, 50], y: [0, 30] }, 'linear');
    E.wait(1.8);
    const p30 = cal.pos(30);
    const L = E.narr('6月30日。調べるはずの人たちが、立ち止まった。', { wait: false });
    P.circle(g, { x: p30.x, y: p30.y, w: 104, h: 76, dur: .5, delay: L.dur * .2 });
    E.hide(note, .5, L.dur * .5);
    E.at(L.end + 1.0);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編', catchCopy: '〜 期待が事実を追い越すとき 〜', dur: 4.6 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 2, title: '調査は止まった', sub: '2026年6月11日 〜 7月10日', dur: 3.4 });
  E.trans('fade', { dur: .7, color: '#fff' });

  /* ============================================================ S2 おさらい：第三者委員会 */
  E.scene({ name: 'committee' }, sc => {
    const g = sc.cam;
    E.bgm('daily', { fadeIn: 1.0, gain: .85 });
    slate(g);
    const tt = title(g, '第三者委員会って？', 70);
    E.show(tt, .5, .2);
    const b = P.building(g, { x: 300, y: 250, w: 300, h: 380, label: 'エスポア（会社）' });
    E.from(b, { y: 80 }, .6, .3, 'back');
    const cm = P.committee(g, { x: 1180, y: 320, w: 460, h: 300 });
    E.from(cm, { x: 200 }, .6, .6, 'back');
    E.sfx('pop', { delay: .3 }); E.sfx('pop', { delay: .6 });
    const day = P.chip(g, '6月11日 設置', { x: 1290, y: 680, color: '#27b4c2', size: 40 });
    E.pop(day, .4, 1.0);
    E.wait(1.0);
    E.narr('意見不表明のあと、エスポアは第三者委員会を作った。');
    const ar = P.arrow(g, { x1: 1160, y1: 470, x2: 650, y2: 470, color: '#f3e6c8', sw: 10, head: 32, bend: -40 });
    const lab = E.div(g, { left: 760, top: 360, width: 300, textAlign: 'center', font: '900 38px/1.2 Zen', color: '#ffd84a' }, '原因を調べる').ini({ o: 0 });
    const mg = P.magnifier(g, { x: 470, y: 420, size: 180, color: '#ffd84a' }).ini({ o: 0 });
    const L = E.narr('会社の外の人たちが、意見不表明の原因を調べる。', { wait: false });
    P.drawArrow(ar, .6, .3); E.sfx('whoosh', { delay: .3, gain: .5 });
    E.show(lab, .4, .7);
    E.show(mg, .4, L.dur * .5);
    E.fn(6, (k, t) => { mg.p.x += Math.sin(t * 1.6) * 70; mg.p.y += Math.cos(t * 2.1) * 90; }, L.dur * .5, true);
    E.at(L.end);
    E.narr('それを聞いて、私は少しほっとしていた。');
    E.wait(.4);
  });

  /* ============================================================ S3 6月30日の通知 */
  phoneScene({ date: '6月30日', week: '火曜日', title: 'エスポア（3260）', body: '第三者委員会による調査の<br><span style="color:#d42a2a">一時中断</span>に関するお知らせ', cx: 92, cy: 495, cw: 122, ch: 48 });

  E.scene({ name: 'bull_surprise' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_surprise'), { burst: { c1: '#fff4e6', c2: '#ffe2c4', spin: 8 }, imgH: 820, panelBg: 'linear-gradient(180deg,#fff8ef,#f8e8d4)' });
    E.from(C.img, { s: .86, y: 60 }, .4, 0, 'back');
    E.sfx('impact', { gain: .45 });
    const mark = E.div(g, { left: 1250, top: 170, font: '900 150px/1 Zen', color: '#e0353f', textShadow: '0 6px 0 #fff, 0 10px 18px rgba(0,0,0,.2)' }, '!?').ini({ o: 0, r: 12 });
    E.pop(mark, .4, .25);
    E.wobble(mark, 8, .8, .6);
    E.wait(.3);
    E.say('bull', 'えっ……止まっちゃったの？', { talk: C.img, talkAmp: 3 });
    E.wait(.2);
  });

  // 調査が止まる図
  E.scene({ name: 'pause' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .8 });
    slate(g);
    const docs = [0, 1, 2].map(i => {
      const d = E.div(g, { left: 520 + i * 300, top: 260 + (i % 2) * 40, width: 280, height: 360, borderRadius: 8, background: '#fbf9f4', boxShadow: '0 16px 30px rgba(0,0,0,.35)' }).ini({ r: -6 + i * 6 });
      for (let j = 0; j < 7; j++) E.div(d, { left: 30, top: 50 + j * 42, width: 220 - (j % 3) * 40, height: 12, borderRadius: 6, background: '#d9d2c4' });
      return d;
    });
    docs.forEach((d, i) => E.from(d, { y: 60 }, .5, i * .12, 'back'));
    const mg = P.magnifier(g, { x: 660, y: 420, size: 220, color: '#ffd84a' });
    E.fn(2.6, (k, t) => { mg.p.x = (k * 1.9 % 1) * 640; mg.p.y = Math.sin(k * 14) * 60; }, 0, false);
    E.sfx('slide', { delay: .2 }); E.sfx('slide', { delay: 1.1 }); E.sfx('slide', { delay: 2.0 });
    E.wait(2.6);
    E.tw(mg, .3, { r: -12, bright: .6 }, 'out');
    const pm = P.pauseMark(g, { x: 960, y: 450, size: 300, label: '調査を一時中断' });
    E.tw(pm, .4, { o: [0, 1], s: [1.8, 1] }, 'in2');
    E.sfx('stamp', { delay: .35 });
    E.shake(sc.cam, .4, 8, .4);
    E.wait(2.2);
  });

  /* ============================================================ S4 ブルちゃんの読み */
  E.scene({ name: 'room_hope' }, sc => {
    const g = sc.cam;
    E.bgm('daily', { fadeIn: .8, gain: .7 });
    const R = P.room(g);
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    E.tw(sc.cam, 8, { s: [1.04, 1] }, 'linear');
    E.wait(.5);
    E.say('bull', 'でも、もっとちゃんと調べるために止めた……んだよね？', { talk: bull, talkAmp: 2, yomi: 'でも、もっとちゃんと調べるために、止めたんだよね？' });
    E.narr('その日の私は、理由を確かめる前に、安心できる読み方を探していた。');
    E.wait(.4);
  });

  /* ============================================================ S5 アジト：止まった理由 */
  E.trans('fade', { dur: .8, color: '#000' });
  E.scene({ name: 'lair' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .3, gain: .9 });
    const L = P.lair(g, { faces: ['normal', 'smile', 'surprise', 'anxious'] });
    const rows = P.board(L.screen, '適時開示 ｜ エスポア（3260）', ROWS);
    rows[0].ini({ o: 1 });
    E.tw(rows[1], .4, { o: [0, 1], x: [60, 0] }, 'back', 1.2);
    E.sfx('dun', { delay: .3, gain: .8 });
    E.tw(sc.cam, 3.2, { s: [1.3, 1], y: [150, 0] }, 'inOut');
    E.breathe(L.baron, .008, 1.5);
    E.breathe(L.hat, .01, 1.9);
    L.pigs.forEach((p, i) => E.breathe(p, .012, 2.3, i));
    E.wait(2.8);
    E.set(L.call, { face: 'surprise' });
    P.look(sc.cam, { s: 1.3, cx: 1685, cy: 330, dur: .8 });
    E.say('eve', 'ねえねえ、調査が止まったって〜。なんで〜？', { talk: L.call, talkAmp: 3, delay: .2 });
  });

  E.scene({ name: 'hat_close' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('hat_e_smirk'), { fit: 'cover', pos: '50% 40%', bg: 'linear-gradient(180deg,#2c1316,#170909)' });
    E.from(C.img, { s: 1.08 }, .5);
    E.tw(C.img, 6, { s: [1, 1.04] }, 'linear', .5);
    E.say('hat', '理由は、会社の発表に書いてある。', { talk: C.img, talkAmp: 2 });
  });

  E.scene({ name: 'reason' }, sc => {
    const g = sc.cam;
    const { hat, call, bd } = boardScene(g, ['surprise', 'normal', 'anxious']);
    E.div(bd, { left: 0, top: 40, width: 1020, textAlign: 'center', font: '800 30px/1.2 Round', color: '#8a8070' }, '6月30日　適時開示（要旨）');
    E.div(bd, { left: 60, top: 96, width: 900, textAlign: 'center', font: '900 46px/1.35 Zen', color: '#2a2430' }, '第三者委員会による<br>調査の一時中断に関するお知らせ');
    const q = E.div(bd, { left: 90, top: 330, width: 840, height: 200, borderRadius: 20, background: '#fdecec', border: '5px solid #c62828', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: '900 46px/1.45 Zen', color: '#a31f1f' }, '委員の「中立性・独立性」について<br>検討を要する状況').ini({ o: 0 });
    E.pop(q, .5, .6, .85); E.sfx('pop', { delay: .6 });
    E.wait(1.2);
    const L = E.say('hat', '調べる側が、本当に中立なのか。そこに疑問が出たのさ。', { talk: hat, talkAmp: 2, wait: false, yomi: '調べるがわが、本当に中立なのか。そこに疑問が出たのさ。' });
    P.circle(bd, { x: 487, y: 396, w: 440, h: 76, delay: L.dur * .35, dur: .5 });
    E.at(L.end + .3);
  });

  // 調べる側と調べられる側の距離
  E.scene({ name: 'thread' }, sc => {
    const g = sc.cam;
    slate(g);
    const tt = title(g, '調べる側は、本当に独立している？', 60);
    E.show(tt, .4);
    const b = P.building(g, { x: 260, y: 270, w: 300, h: 380, label: 'エスポア（会社）' });
    const cm = P.committee(g, { x: 1200, y: 330, w: 460, h: 300 });
    // 見えない糸
    const pts = [];
    for (let i = 0; i <= 40; i++) { const k = i / 40; pts.push([k * 640, 60 + Math.sin(k * Math.PI * 3) * 30 + Math.sin(k * Math.PI) * 50]); }
    const th = E.polyline(g, pts, { left: 570, top: 420, width: 640, height: 200, color: '#ff5a5a', sw: 6, glow: 8 }).ini({ draw: 0 });
    const q = E.div(g, { left: 760, top: 300, width: 400, textAlign: 'center', font: '900 52px/1.2 Zen', color: '#ff7b7b', textShadow: '0 4px 10px rgba(0,0,0,.5)' }, '独立性？').ini({ o: 0 });
    E.wait(.6);
    const L = E.say('hat', '調べる人と、調べられる会社。その間に距離がなきゃ、調査の意味がない。', { wait: false });
    E.tw(th, 1.0, { draw: [0, 1] }, 'inOut', L.dur * .3); E.sfx('rise', { delay: L.dur * .3, gain: .4 });
    E.pop(q, .4, L.dur * .55);
    const ruler = P.arrow(g, { x1: 600, y1: 760, x2: 1170, y2: 760, color: '#ffd84a', sw: 6, head: 22 });
    const ruler2 = P.arrow(g, { x1: 1170, y1: 760, x2: 600, y2: 760, color: '#ffd84a', sw: 6, head: 22 });
    const rl = E.div(g, { left: 685, top: 790, width: 400, textAlign: 'center', font: '900 36px/1.2 Zen', color: '#ffd84a' }, 'この距離が大事').ini({ o: 0 });
    P.drawArrow(ruler, .5, L.dur * .65); P.drawArrow(ruler2, .5, L.dur * .65);
    E.show(rl, .4, L.dur * .75);
    E.at(L.end);
    E.hide(rl, .3); E.hide(ruler, .3); E.hide(ruler2, .3); E.hide(ruler.head, .3); E.hide(ruler2.head, .3);
    const pig = E.img(g, CH('pig_e_shock'), { left: 1500, top: 760, height: 330 }).ini({ o: 0 });
    E.tw(pig, .4, { o: [0, 1], y: [200, 0] }, 'back');
    E.sfx('snort', { delay: .1 });
    E.say('pig', 'ブヒッ。調べる人まで、疑われるんですかい？', { talk: pig, talkAmp: 4, delay: .2 });
    E.tw(pig, .3, { o: 0, y: 200 }, 'in2');
    // 疑いが広がる
    const fog = E.div(g, { left: 410 - 200, top: 460 - 200, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,60,60,.45), rgba(220,60,60,0) 70%)' }).ini({ o: 0 });
    const L2 = E.say('hat', 'そうさ。疑いが、調べる側にまで広がったってことだ。', { wait: false });
    E.tw(fog, 2.0, { o: [0, 1], s: [1, 4.4], x: [0, 520] }, 'inOut', L2.dur * .25);
    E.sfx('swell', { delay: L2.dur * .25, gain: .4 });
    E.at(L2.end + .5);
  });

  /* ============================================================ S6 「時間がかかる＝丁寧＝安心」の罠 */
  E.scene({ name: 'split' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .8, gain: .85 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 40%, #26305a 0%, #141a36 70%, #0b0f22 100%)' });
    E.particles(g, { n: 26, kind: 'dust', color: '#9fb2ff', area: [0, 0, W, H], speed: .6, seed: 5 });
    const parts = [['調査が一時中断した', 'fact'], ['もっと丁寧に調べている', 'interp'], ['だから安心', 'hope']];
    const rows = parts.map(([txt, kind], i) => {
      const r = E.div(g, { left: 300, top: 150 + i * 210, width: 900, height: 160, borderRadius: 24, background: 'rgba(255,255,255,.95)', boxShadow: '0 16px 30px rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', paddingLeft: 50, font: '900 56px/1.2 Zen', color: '#262236' }, `「${txt}」`).ini({ o: 0 });
      const st = P.stamp(g, kind, { x: 1270, y: 178 + i * 210, size: 1, rot: -8 + i * 4 });
      return { r, st };
    });
    rows.forEach((o, i) => { E.tw(o.r, .5, { o: [0, 1], x: [-120, 0] }, 'back', .3 + i * .35); E.sfx('slide', { delay: .3 + i * .35 }); });
    rows.forEach((o, i) => P.stampIn(o.st, 1.6 + i * .7));
    E.wait(4.0);
  });

  E.scene({ name: 'oneway' }, sc => {
    const g = sc.cam;
    slate(g);
    const tt = title(g, '同じ事実、いくつもの読み方', 60);
    E.show(tt, .4);
    const box = (x, y, text, c, w = 360) => E.div(g, { left: x, top: y, width: w, height: 110, borderRadius: 20, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 40px/1.2 Zen', color: '#fff', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, text).ini({ o: 0 });
    const a = box(110, 300, '時間がかかる', '#17915a');
    const b = box(720, 300, '丁寧に調べている', '#2b68d8', 420);
    const c = box(1400, 300, 'だから安心', '#e0457b');
    const a1 = P.arrow(g, { x1: 480, y1: 355, x2: 700, y2: 355, color: '#f3e6c8', sw: 9, head: 26 });
    const a2 = P.arrow(g, { x1: 1150, y1: 355, x2: 1380, y2: 355, color: '#f3e6c8', sw: 9, head: 26 });
    const sign = E.div(g, { left: 760, top: 170, padding: '6px 26px 8px', borderRadius: 10, background: '#e0353f', color: '#fff', font: '900 34px/1.2 Zen', whiteSpace: 'nowrap', boxShadow: '0 8px 16px rgba(0,0,0,.3)' }, '一方通行の読み方').ini({ o: 0, r: -3 });
    E.pop(a, .4, .2); E.sfx('pop', { delay: .2 });
    P.drawArrow(a1, .4, .6);
    E.pop(b, .4, .9); E.sfx('pop', { delay: .9 });
    P.drawArrow(a2, .4, 1.3);
    E.pop(c, .4, 1.6); E.sfx('pop', { delay: 1.6 });
    E.pop(sign, .4, 2.0); E.sfx('buzz', { delay: 2.0, gain: .4 });
    E.wait(2.4);
    E.say('hat', '「時間がかかる、だから丁寧、だから安心」……', { gap: .1 });
    E.say('hat', '一方向にしか読まないのは、危ないね。');
    // 別の読み方へ枝分かれ
    const alts = ['調べる体制に問題があった', '調べることが増えた', 'まだ何もわからない'].map((t, i) => box(560 + i * 0, 520 + i * 150, t, 'rgba(255,255,255,.12)', 620));
    const brs = alts.map((n, i) => P.arrow(g, { x1: 290, y1: 420, x2: 540, y2: 575 + i * 150, color: '#ffd84a', sw: 7, head: 22, bend: 20 }));
    alts.forEach(n => { n.el.style.border = '4px dashed #ffd84a'; n.el.style.color = '#ffe9a8'; });
    const L = E.say('hat', '同じ事実でも、読み方はいくつもある。', { wait: false });
    alts.forEach((n, i) => { P.drawArrow(brs[i], .35, .2 + i * .35); E.tw(n, .4, { o: [0, 1], x: [-40, 0] }, 'back', .4 + i * .35); E.sfx('pop', { delay: .4 + i * .35 }); });
    E.tw(c, .5, { bright: .55, s: .95 }, 'out', 1.4);
    E.at(L.end + 1.4);
  });

  /* ============================================================ S7 7月10日：再設置と「審査中」 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'reform' }, sc => {
    const g = sc.cam;
    E.bgm('daily', { fadeIn: .6, gain: .8 });
    slate(g);
    const tt = title(g, '7月10日　第三者委員会を再設置', 70);
    E.show(tt, .4, .1);
    const cm = P.committee(g, { x: 730, y: 290, w: 460, h: 300, label: '第三者委員会', sub: '新しい委員の顔ぶれ' });
    // 古い委員が抜けて新しい委員が入る
    cm.people.forEach((p, i) => { E.tw(p, .4, { y: [0, -220], o: [1, 0] }, 'in2', .8 + i * .12); });
    const fresh = [0, 1, 2].map(i => E.svg(cm, { left: 80 + i * 100, top: 40, width: 100, height: 112 }, '0 0 100 112',
      `<circle cx="50" cy="32" r="22" fill="#9ee6c0"/><path d="M10 112 Q12 62 50 60 Q88 62 90 112Z" fill="#9ee6c0"/>`).ini({ o: 0 }));
    fresh.forEach((p, i) => { E.tw(p, .45, { y: [220, 0], o: [0, 1] }, 'back', 1.5 + i * .12); E.sfx('pop', { delay: 1.5 + i * .12 }); });
    E.wait(1.0);
    E.narr('7月10日。委員を入れ替えて、第三者委員会が作り直された。');
    E.wait(.3);
  });

  E.scene({ name: 'quote' }, sc => {
    const g = sc.cam;
    const { hat, call, bd } = boardScene(g, ['normal', 'smile', 'surprise']);
    E.div(bd, { left: 0, top: 40, width: 1020, textAlign: 'center', font: '800 30px/1.2 Round', color: '#8a8070' }, '7月10日　会社の説明（要旨）');
    E.div(bd, { left: 0, top: 110, width: 1020, textAlign: 'center', font: '900 44px/1.3 Zen', color: '#2a2430' }, '新しい体制で目指すのは');
    const q = E.div(bd, { left: 70, top: 220, width: 880, height: 220, borderRadius: 22, background: '#eef6f1', border: '5px solid #17915a', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: '900 50px/1.45 Zen', color: '#0e6b42' }, '「外形的にも一抹の疑念の<br>介在する余地のない」体制').ini({ o: 0 });
    const plain = E.div(bd, { left: 70, top: 490, width: 880, textAlign: 'center', font: '800 34px/1.5 Round', color: '#4a4552' }, '＝ 見た目にも、少しの疑いも入りこまない体制').ini({ o: 0 });
    E.pop(q, .5, .5, .85); E.sfx('chime', { delay: .5, gain: .5 });
    E.wait(1.4);
    const L = E.say('hat', '見た目にも、少しの疑いも入りこまない体制、って意味さ。', { talk: hat, talkAmp: 2, wait: false });
    E.show(plain, .5, L.dur * .3);
    E.at(L.end);
    E.set(call, { face: 'smile' });
    E.tw(call, .3, { s: [1, 1.08] }, 'back');
    E.say('eve', 'よかった〜！じゃあ、これで安心だね！', { talk: call, talkAmp: 4 });
    E.set(call, { face: 'normal' });
    E.say('hat', '……同じ日に、もうひとつ発表があっただろ。', { talk: hat, talkAmp: 2, yomi: '同じ日に、もうひとつ発表があっただろ。' });
  });

  E.scene({ name: 'lair_710' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .4, gain: .85 });
    const L = P.lair(g, { faces: ['normal', 'surprise', 'anxious'] });
    const rows = P.board(L.screen, '適時開示 ｜ エスポア（3260）', ROWS);
    rows[0].ini({ o: 1 }); rows[1].ini({ o: 1 });
    E.breathe(L.baron, .008, 1.5);
    L.pigs.forEach((p, i) => E.breathe(p, .012, 2.3, i));
    P.look(sc.cam, { s: 1.45, cx: 960, cy: 250, dur: 1.0 });
    E.wait(.9);
    E.tw(rows[2], .4, { o: [0, 1], x: [60, 0] }, 'back');
    E.sfx('alarm', { gain: .35 });
    const red = E.div(L.screen, { left: 0, top: 180, width: 840, height: 60, background: 'rgba(230,60,60,.2)' }).ini({ o: 0 });
    E.fn(2.6, (k, t) => { red.p.o = .5 + .5 * Math.sin(t * 9); }, 0, true);
    E.set(L.call, { face: 'surprise' }, .6);
    E.wait(2.6);
  });

  // 2 枚の札
  E.scene({ name: 'tags' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    slate(g);
    const card = P.stockCard(g, { x: 640, y: 200, w: 640 });
    E.from(card, { y: 60 }, .5, .1, 'back');
    const t1 = P.tag(g, '監理銘柄（確認中）　5/28〜', { x: 600, y: 440, rot: -5, color: '#d9622b', size: 40 });
    const t2 = P.tag(g, '監理銘柄（審査中）　7/10〜', { x: 690, y: 560, rot: 4, color: '#b3122b', size: 40 });
    E.tw(t1, .35, { o: [0, 1], s: [1.6, 1] }, 'in2', .6); E.sfx('stamp', { delay: .9, gain: .6 });
    E.tw(t2, .35, { o: [0, 1], s: [1.6, 1] }, 'in2', 1.3); E.sfx('stamp', { delay: 1.6, gain: .7 });
    E.shake(sc.cam, .3, 6, 1.6);
    E.wait(2.0);
    E.say('hat', '「確認中」と「審査中」は、別の問題だ。', { yomi: '確認中と、審査中は、別の問題だ。' });
    E.wait(.2);
  });

  // 2 つの関所
  E.scene({ name: 'gates' }, sc => {
    const g = sc.cam;
    slate(g);
    const tt = title(g, '上場を続けるための、2つのチェック', 60);
    E.show(tt, .4);
    const gate = (x, num, name, sub, tagText, c, icon) => {
      const n = E.div(g, { left: x, top: 190, width: 700, height: 560, borderRadius: 30, background: 'rgba(255,255,255,.96)', boxShadow: '0 20px 40px rgba(0,0,0,.4)', overflow: 'hidden' }).ini({ o: 0 });
      E.div(n, { left: 0, top: 0, width: 700, height: 96, background: c }, `<div style="position:absolute;left:30px;top:0;font:900 44px/96px Zen;color:#fff;white-space:nowrap">${num}　${tagText}</div>`);
      E.svg(n, { left: 270, top: 130, width: 160, height: 160 }, '0 0 100 100', icon);
      E.div(n, { left: 30, top: 310, width: 640, textAlign: 'center', font: '900 46px/1.35 Zen', color: '#262230' }, name);
      E.div(n, { left: 30, top: 440, width: 640, textAlign: 'center', font: '800 30px/1.45 Round', color: '#6b6252' }, sub);
      return n;
    };
    const coin = '<circle cx="50" cy="50" r="40" fill="#f0b24a" stroke="#c98a20" stroke-width="6"/><text x="50" y="64" text-anchor="middle" font-size="42" font-weight="900" fill="#fff" font-family="Zen">¥</text>';
    const paper = '<rect x="20" y="10" width="60" height="80" rx="6" fill="#fff" stroke="#b3122b" stroke-width="6"/><text x="50" y="66" text-anchor="middle" font-size="46" font-weight="900" fill="#b3122b" font-family="Zen">？</text>';
    const g1 = gate(150, '①', '純資産の基準を<br>満たせるか', '改善期間の終わりに、基準を<br>満たさないおそれ', '確認中', '#d9622b', coin);
    const g2 = gate(1070, '②', '上場廃止の基準に<br>当たるか', '意見不表明などを受けて<br>取引所が審査する', '審査中', '#b3122b', paper);
    E.tw(g1, .5, { o: [0, 1], y: [60, 0] }, 'back', .2); E.sfx('pop', { delay: .2 });
    E.tw(g2, .5, { o: [0, 1], y: [60, 0] }, 'back', .5); E.sfx('pop', { delay: .5 });
    E.wait(1.0);
    E.tw(g1, .3, { s: 1.04 }, 'back'); E.tw(g2, .3, { bright: .6, s: .97 }, 'out');
    E.say('hat', '確認中は、純資産の基準を満たせるかどうか。');
    E.tw(g1, .3, { s: 1, bright: .6 }, 'out'); E.tw(g2, .3, { bright: 1, s: 1.04 }, 'back');
    E.say('hat', '審査中は、意見不表明などを受けて、', { gap: .1 });
    E.say('hat', '上場廃止の基準に当たるかどうかの審査さ。');
    E.tw(g1, .3, { s: 1, bright: 1 }, 'out'); E.tw(g2, .3, { s: 1 }, 'out');
    E.wait(.4);
  });

  E.scene({ name: 'not_only' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .75 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'linear-gradient(180deg,#f3ece0,#e6dccb)' });
    const a = E.div(g, { left: 260, top: 300, width: 600, height: 220, borderRadius: 26, background: '#d9622b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff', font: '900 60px/1.2 Zen', boxShadow: '0 16px 30px rgba(0,0,0,.2)' }, '債務超過？<div style="font:800 30px/1.5 Round;opacity:.9">純資産が足りるか</div>').ini({ o: 0 });
    const plus = E.div(g, { left: 900, top: 340, font: '900 120px/1 Zen', color: '#6b6252' }, '＋').ini({ o: 0 });
    const b = E.div(g, { left: 1060, top: 300, width: 600, height: 220, borderRadius: 26, background: '#b3122b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff', font: '900 54px/1.2 Zen', boxShadow: '0 16px 30px rgba(0,0,0,.2)' }, '数字を信じていい？<div style="font:800 30px/1.5 Round;opacity:.9">財務諸表の信頼性</div>').ini({ o: 0 });
    E.pop(a, .45, .2); E.sfx('pop', { delay: .2 });
    E.wait(.5);
    const L1 = E.narr('問題は、債務超過だけじゃなかった。', { wait: false });
    E.pop(plus, .4, L1.dur * .6);
    E.at(L1.end);
    const L2 = E.narr('決算の数字を信じていいのか。その審査も、始まっていたんだ。', { wait: false });
    E.pop(b, .5, .2); E.sfx('stamp', { delay: .4, gain: .6 });
    E.shake(b, .4, 6, .5);
    E.at(L2.end + .6);
  });

  /* ============================================================ S8 教訓：まとまっている？広がっている？ */
  E.scene({ name: 'spread' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    slate(g);
    const tt = title(g, '調査は「まとまっている」？「広がっている」？', 60);
    E.show(tt, .4);
    // 左：まとまる（収束）
    const lw = E.div(g, { left: 160, top: 190, width: 700, height: 470, borderRadius: 28, background: 'rgba(255,255,255,.06)', border: '3px solid rgba(158,230,192,.5)' });
    E.div(lw, { left: 0, top: 22, width: 700, textAlign: 'center', font: '900 40px/1.2 Zen', color: '#9ee6c0' }, 'まとまってきている');
    const conv = [0, 1, 2, 3, 4].map(i => P.arrow(lw, { x1: 70, y1: 120 + i * 70, x2: 520, y2: 260, color: '#9ee6c0', sw: 7, head: 20 }));
    const dot = E.div(lw, { left: 540, top: 236, width: 60, height: 60, borderRadius: '50%', background: '#9ee6c0', boxShadow: '0 0 24px rgba(158,230,192,.8)' }).ini({ o: 0 });
    // 右：広がる（拡大）
    const rw = E.div(g, { left: 1060, top: 190, width: 700, height: 470, borderRadius: 28, background: 'rgba(255,255,255,.06)', border: '3px solid rgba(255,123,123,.5)' });
    E.div(rw, { left: 0, top: 22, width: 700, textAlign: 'center', font: '900 40px/1.2 Zen', color: '#ff9a9a' }, '広がっている');
    const div_ = [0, 1, 2, 3, 4].map(i => P.arrow(rw, { x1: 130, y1: 260, x2: 600, y2: 110 + i * 75, color: '#ff8a8a', sw: 7, head: 20 }));
    const src = E.div(rw, { left: 90, top: 236, width: 60, height: 60, borderRadius: '50%', background: '#ff8a8a', boxShadow: '0 0 24px rgba(255,123,123,.8)' }).ini({ o: 0 });
    conv.forEach((a, i) => P.drawArrow(a, .4, .4 + i * .08));
    E.pop(dot, .3, .9);
    E.pop(src, .3, 1.1);
    div_.forEach((a, i) => P.drawArrow(a, .4, 1.2 + i * .08));
    // 今回の出来事
    const evs = [['6/11', '委員会を設置'], ['6/30', '調べる側の独立性に疑問'], ['7/10', '委員を入れ替え＋審査中']];
    const list = E.div(g, { left: 160, top: 700, width: 1600, height: 110, borderRadius: 20, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', font: '900 34px/1.2 Zen', color: '#262236', whiteSpace: 'nowrap' },
      evs.map(([d, t]) => `<span><span style="color:#b3122b">${d}</span>　${t}</span>`).join('<span style="color:#b3122b">→</span>')).ini({ o: 0 });
    E.wait(1.8);
    E.say('hat', '延期も、中断も、作り直しも。', { gap: .1 });
    E.say('hat', 'それだけじゃ、結果のサインにはならない。');
    E.tw(list, .5, { o: [0, 1], y: [40, 0] }, 'back'); E.sfx('slide');
    E.say('hat', '見るべきは理由だ。調査がまとまってきてるのか、広がってるのか。');
    E.tw(lw, .4, { bright: .5, s: .97 }, 'out');
    E.tw(rw, .4, { s: 1.05 }, 'back');
    E.sfx('ding', { gain: .5 });
    E.wait(.6);
  });

  E.scene({ name: 'eve_anx' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('eve_e_anxious'), { fit: 'cover', pos: '50% 30%', bg: 'linear-gradient(180deg,#2c1316,#170909)' });
    E.from(C.img, { s: 1.06 }, .4);
    E.wait(.3);
    E.say('eve', '……広がってる、よね？', { talk: C.img, talkAmp: 2, yomi: '広がってる、よね？' });
    E.wait(.4);
  });

  /* ============================================================ S9 男爵 */
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .6 });
    const C = P.closeup(g, CH('baron_face_big'), { bg: 'radial-gradient(ellipse at 50% 40%, #4c1820, #140707)', panelBg: 'linear-gradient(180deg,#2c0f14,#120607)', imgH: 1020 });
    E.tw(C.img, 9, { s: [1, 1.1] }, 'linear');
    E.particles(g, { n: 40, kind: 'ember', color: '#ff5a4a', area: [0, 0, W, H], speed: .7, seed: 11 });
    E.sfx('heartbeat', { delay: .2 });
    E.wait(.6);
    E.say('baron', '「時間がかかるのは、丁寧だからだ」……か。', { talk: C.img, talkAmp: 1.5, yomi: '時間がかかるのは、丁寧だからだ、か。' });
    E.wait(.3);
    const L = E.say('baron', '……昔、同じ言葉を信じた男がいた。', { talk: C.img, talkAmp: 1.5, wait: false, yomi: '昔、同じ言葉を信じた男がいた。' });
    E.flash('#ff2a2a', .5, .3, L.dur * .7);
    E.sfx('dun', { delay: L.dur * .7, gain: .7 });
    E.at(L.end + .4);
    E.tw(C.img, .45, { s: 1.6, blur: 24, o: 0 }, 'in');
    E.sfx('whoosh_big', { gain: .8 });
    E.wait(.45);
  });

  /* ============================================================ S10 ブルちゃんの部屋（夜） */
  E.scene({ name: 'room_night' }, sc => {
    const g = sc.cam;
    E.bgm('sad', { fadeIn: 1.4, gain: .85 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { hi: 0 });
    const bull = E.actor(g, 'bull', { x: 700, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.0);
    E.tw(sc.cam, 9, { s: [1.02, 1.08] }, 'linear');
    E.wait(.6);
    E.narr('新しい委員会。新しい体制。私はそれを、前に進んだしるしだと思いたかった。');
    E.wait(.2);
  });

  E.scene({ name: 'bull_hope' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_normal'), { bg: 'linear-gradient(180deg,#1b2446,#0f152c)', panelBg: 'linear-gradient(180deg,#2a3560,#1a2244)', imgH: 820 });
    E.tw(C.img, 7, { s: [1, 1.05] }, 'linear');
    E.bubble(g, '……きっと。', { x: 1240, y: 250, w: 400, kind: 'round', tail: 'bl', life: 0, delay: 2.2, cps: 12 });
    E.wait(.4);
    E.say('bull', '今度こそ、ちゃんと調べてくれる。……きっと。', { talk: C.img, talkAmp: 2, yomi: '今度こそ、ちゃんと調べてくれる。きっと。' });
    E.wait(.5);
  });

  // 増えていく「？」
  E.scene({ name: 'questions' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 40%, #26305a 0%, #141a36 70%, #0b0f22 100%)' });
    const card = P.stockCard(g, { x: 640, y: 380, w: 640 });
    E.from(card, { s: .9 }, .5, .1, 'back');
    const qs = [];
    for (let i = 0; i < 22; i++) {
      const a = rnd(i * 3.7) * Math.PI * 2, r = 330 + rnd(i * 1.3) * 380;
      const q = E.div(g, { left: 960 + Math.cos(a) * r * 1.25 - 40, top: 470 + Math.sin(a) * r * .62 - 50, font: `900 ${70 + rnd(i) * 70}px/1 Zen`, color: i % 3 ? '#ff8a8a' : '#ffd84a', textShadow: '0 4px 10px rgba(0,0,0,.5)' }, '？').ini({ o: 0, r: -20 + rnd(i * 2) * 40 });
      qs.push(q);
    }
    E.wait(.3);
    const L = E.narr('でも本当に見るべきだったのは、増えていく「？」の数だった。', { wait: false, yomi: 'でも本当に見るべきだったのは、増えていく、はてな、の数だった。' });
    qs.forEach((q, i) => { E.pop(q, .35, .3 + i * (L.dur * .8 / qs.length), .3); E.float(q, 6, 1.4 + (i % 4) * .3, i); });
    for (let i = 0; i < 6; i++) E.sfx('pop', { delay: .3 + i * L.dur * .13, gain: .5 });
    E.at(L.end + 1.0);
  });

  /* ============================================================ S11 次回予告 */
  E.trans('fade', { dur: .8, color: '#000' });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #3a2c24 0%, #1d1612 75%, #120d0a 100%)' });
    const items = [['6/11', '第三者委員会を設置'], ['6/30', '調査を一時中断'], ['7/10', '再設置＋監理銘柄（審査中）'], ['8/20', '？']];
    const x0 = 200, x1 = 1380, y = 470;
    const line = E.div(g, { left: x0, top: y, width: x1 - x0, height: 8, borderRadius: 4, background: '#c9a24a' }).ini({ cr: 100 });
    E.tw(line, 1.2, { cr: [100, 0] }, 'inOut', .2);
    items.forEach(([d, t], i) => {
      const x = x0 + i * (x1 - x0) / (items.length - 1);
      const dot = E.div(g, { left: x - 22, top: y - 18, width: 44, height: 44, borderRadius: '50%', background: i === 3 ? '#e0353f' : '#f3e6c8', border: '6px solid #c9a24a' }).ini({ o: 0 });
      const dl = E.div(g, { left: x - 150, top: y - 90, width: 300, textAlign: 'center', font: '900 44px/1.2 Noto', color: '#f3e6c8' }, d).ini({ o: 0 });
      const tl = E.div(g, { left: x - 190, top: y + 54, width: 380, textAlign: 'center', font: '800 32px/1.35 Round', color: i === 3 ? '#ff8a8a' : '#e8dcc0' }, t).ini({ o: 0 });
      [dot, dl, tl].forEach(n => E.pop(n, .4, .4 + i * .35, .6));
      E.sfx('click', { delay: .4 + i * .35 });
    });
    const st = P.sticky(g, '第3章<br>延期の呪文', { x: 1430, y: 110, w: 400, h: 250, rot: 5, size: 44 });
    P.slap(st, 2.2);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.8);
    E.sfx('snort', { delay: 3.0 });
    E.wait(3.4);
    E.say('pig', 'ブヒッ。次は、延期の呪文だブー。', { talk: pig, talkAmp: 5 });
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
