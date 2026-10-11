// 第1章「意見不表明」（2026年5月27日〜6月11日）
// 台本: story/01_第1章_意見不表明.md　元資料 p1〜5
'use strict';
E.chapter('01');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const DISCLAIMER = 'この物語はフィクションです　｜　エスポア（3260）の事実関係は公開資料に基づきます　｜　投資助言ではありません';

  /* ============================================================ S0 アバン：机の上のカレンダー */
  E.scene({ name: 'avant', bg: '#2a211b' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: 1.5, gain: .9 });
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(ellipse at 42% 42%, #7a5f46 0%, #4a3829 55%, #241b14 100%)' });
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'repeating-linear-gradient(8deg, rgba(255,230,190,.035) 0 3px, transparent 3px 26px)' });
    const cal = P.calendar(g, { x: 280, y: 150, w: 780, year: 2026, month: 5 });
    E.from(cal, { y: 80 }, .9, .1, 'quint');
    const pen = E.div(g, { left: 1180, top: 760, width: 520, height: 26, borderRadius: 13, background: 'linear-gradient(180deg,#2e3a52,#1a2233)', boxShadow: '0 10px 14px rgba(0,0,0,.35)' }).ini({ r: -18 });
    E.div(pen, { left: 470, top: 0, width: 50, height: 26, borderRadius: '0 13px 13px 0', background: '#c9a24a' });
    const st = P.sticky(g, '第1章<br>意見不表明', { x: 1500, y: 150, w: 330, h: 230, rot: 6, size: 44 });
    P.slap(st, 1.4);
    const note = P.note(g, DISCLAIMER, { x: 40, y: 30, size: 22, dark: true }).ini({ o: 0 });
    E.show(note, .6, .4);
    E.tw(sc.cam, 13, { s: [1, 1.1], x: [0, 60], y: [0, 30] }, 'linear');
    E.wait(1.6);
    E.narr('最初のサインは、5月の終わりに出ていた。');
    E.hide(note, .5);
    const p27 = cal.pos(27);
    P.circle(g, { x: p27.x, y: p27.y, w: 104, h: 76, dur: .5 });
    E.wait(.3);
    const L = E.narr('2026年5月27日。エスポアが、ひとつの「お知らせ」を出した。', { wait: false, yomi: '2026年5月27日。エスポアが、ひとつの、お知らせを出した。' });
    E.wait(1.2);
    const doc = P.doc(g, {
      x: 560, y: 260, w: 900, h: 560, rot: 2, head: '適時開示（要旨）', date: '2026年5月27日',
      title: 'エスポア（3260）<br>監査報告書の「意見不表明」に関するお知らせ',
      body: '2026年2月期の監査報告書と内部統制監査報告書で、監査法人が「意見を表明しない」とした。',
    });
    E.from(doc, { y: 620, r: 14 }, .7, 0, 'quint');
    E.sfx('slide');
    E.wait(1.4);
    P.circle(doc, { x: 386, y: 182, w: 214, h: 62, dur: .45 });
    E.at(Math.max(E.T, L.end));
    E.wait(2.2);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編', catchCopy: '〜 期待が事実を追い越すとき 〜', dur: 6.2 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 1, title: '意見不表明', sub: '2026年5月27日 〜 6月11日', dur: 3.4 });
  E.trans('fade', { dur: .7, color: '#fff' });

  /* ============================================================ S2 ブルちゃんの部屋（昼） */
  E.scene({ name: 'room_day' }, sc => {
    const g = sc.cam;
    E.bgm('daily', { fadeIn: 1.2, gain: .9 });
    const R = P.room(g);
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    E.tw(sc.cam, 9, { s: [1, 1.05] }, 'linear');
    E.wait(.7);
    E.narr('私はブル。師匠に教わった株の見方で、ひとりで相場と向き合っている。');
    E.tw(R.photo, .5, { s: 1.18 }, 'back', -2.8);
    E.tw(R.photo, .5, { s: 1 }, 'out', -.6);
    P.look(sc.cam, { s: 1.34, cx: 1330, cy: 470, dur: 1.3 });
    E.narr('エスポア。私が持っている株のひとつだ。');
    E.wait(.2);
    E.sfx('vibrate', { gain: .9 });
    E.shake(sc.cam, .5, 6);
    E.wait(.7);
  });

  /* スマホの通知 */
  E.scene({ name: 'phone1' }, sc => {
    const g = sc.cam;
    const back = E.div(g, { left: 0, top: 0, width: W, height: H }).ini({ blur: 12, bright: .85 });
    const R = P.room(back);
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証']], { hi: 0 });
    const ph = P.phone(g, { x: 750, y: 110, w: 420, h: 850 });
    P.lock(ph, { date: '5月27日', week: '水曜日' });
    E.from(ph, { y: 760 }, .6, 0, 'quint');
    E.sfx('whoosh');
    const nt = P.notice(ph, { app: '適時開示アラート', title: 'エスポア（3260）', body: '監査報告書の<span style="color:#d42a2a">意見不表明</span>に関するお知らせ', y: 330 });
    P.notifyIn(nt, .9);
    P.look(sc.cam, { s: 1.18, cx: 960, cy: 430, dur: 3.6, delay: 1.4 });
    E.wait(2.4);
    P.circle(ph.screen, { x: 226, y: 452, w: 150, h: 54, dur: .45 });
    E.wait(1.4);
  });

  /* ブルちゃん、驚く */
  E.scene({ name: 'bull_surprise' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_surprise'), { burst: { c1: '#fff4e6', c2: '#ffe2c4', spin: 8 }, imgH: 820, panelBg: 'linear-gradient(180deg,#fff8ef,#f8e8d4)' });
    E.from(C.img, { s: .86, y: 60 }, .4, 0, 'back');
    E.sfx('impact', { gain: .45 });
    const mark = E.div(g, { left: 1250, top: 170, font: '900 150px/1 Zen', color: '#e0353f', textShadow: '0 6px 0 #fff, 0 10px 18px rgba(0,0,0,.2)' }, '!?').ini({ o: 0, r: 12 });
    E.pop(mark, .4, .25);
    E.wobble(mark, 8, .8, .6);
    E.wait(.3);
    E.say('bull', '意見……不表明？', { talk: C.img, talkAmp: 3 });
    E.wait(.3);
  });

  /* 「悪い決算かな」 */
  E.scene({ name: 'room_day2' }, sc => {
    const g = sc.cam;
    const R = P.room(g);
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    E.tw(sc.cam, 7, { s: [1.04, 1] }, 'linear');
    const b = E.bubble(g, '悪い決算……かな？', { x: 420, y: 150, w: 470, kind: 'think', tail: 'br', life: 0, delay: .5, cps: 18 });
    E.narr('悪い決算、なのかな。そのときの私は、それくらいに思っていた。', { delay: .3 });
    E.wait(.6);
  });

  /* ============================================================ S3 回想（セピア） */
  E.trans('fade', { dur: 1.1, color: '#fff1d6' });
  E.scene({ name: 'memory' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: 1.2 });
    P.sepia(g);
    const m = P.mentor(g, { x: 1320, y: 1070, h: 900 });
    E.breathe(m, .006, 1.4);
    const b = E.actor(g, 'bull', { x: 560, y: 1070, h: 540, pose: 'back' }).ini({ sep: .55, sat: .85, bright: .97 });
    E.breathe(b, .01, 2.2);
    E.grain(g, .09);
    E.vignette(g, .55, '70,35,10');
    P.note(g, '回想', { x: 50, y: 40, size: 28, dark: true });
    E.tw(sc.cam, 9, { s: [1.07, 1] }, 'linear');
    E.wait(.8);
    const L0 = E.say('mentor', 'ブル。ニュースを見たら、まず三つに分けるんだ。', { talk: m, talkAmp: 2, wait: false });
    P.raiseArm(m, L0.dur * .45);
    E.sfx('whoosh', { delay: L0.dur * .45, gain: .4 });
    E.at(L0.end);

    const dim = E.div(g, { left: 0, top: 0, width: W, height: H, background: 'rgba(70,35,10,.5)' }).ini({ o: 0 });
    const cards = [
      P.card3(g, 'fact', { x: 140, y: 160, w: 520, h: 380, body: '誰でも確かめ直せること<div style="margin-top:14px;font-size:30px;color:#8a7f72">発表・実際の株価や出来高</div>' }),
      P.card3(g, 'interp', { x: 700, y: 160, w: 520, h: 380, body: 'その事実を<br>どう読むか<div style="margin-top:14px;font-size:30px;color:#8a7f72">読み方は一つじゃない</div>' }),
      P.card3(g, 'hope', { x: 1260, y: 160, w: 520, h: 380, body: 'まだ起きていない<br>未来の話<div style="margin-top:14px;font-size:30px;color:#8a7f72">確かめられていない</div>' }),
    ];
    E.show(dim, .5);
    const L = E.say('mentor', '事実。解釈。期待だ。', { wait: false });
    cards.forEach((c, i) => { const d = .15 + i * L.dur * .33; E.pop(c, .5, d, .5); E.sfx('pop', { delay: d }); });
    E.at(L.end + .2);
    const focus = i => cards.forEach((c, j) => E.tw(c, .35, j === i ? { s: 1.07, y: -14, bright: 1 } : { s: .95, y: 0, bright: .62 }, 'back'));
    focus(0);
    E.say('mentor', '事実は、誰でも確かめ直せるもの。発表や、実際の株価だ。');
    focus(1);
    E.say('mentor', '解釈は、その読み方。読み方は一つじゃない。');
    focus(2);
    E.say('mentor', '期待は、まだ起きていない未来の話だ。');
    cards.forEach((c, i) => E.tw(c, .45, { o: 0, y: -60, s: .9 }, 'in2', i * .06));
    E.hide(dim, .6, .2);
    P.lowerArm(m, .3);
    E.wait(.5);
    const qb = E.div(g, { left: 0, top: 128, width: W, height: 170, background: 'linear-gradient(90deg, rgba(58,26,6,0), rgba(58,26,6,.66) 22%, rgba(58,26,6,.66) 78%, rgba(58,26,6,0))' }).ini({ o: 0 });
    const q = E.div(g, { left: 0, top: 160, width: W, textAlign: 'center', font: '900 82px/1.3 Zen', color: '#fff9ea', textShadow: '0 4px 12px rgba(40,18,4,.8)' }, '希望を、事実の代わりに使うな。').ini({ o: 0 });
    const L2 = E.say('mentor', '希望を持つのはいい。だが、希望を事実の代わりに使うな。', { talk: m, talkAmp: 2, wait: false });
    E.tw(q, .8, { o: [0, 1], y: [24, 0] }, 'out', L2.dur * .45);
    E.show(qb, .6, L2.dur * .4);
    E.sfx('shine', { delay: L2.dur * .45, gain: .6 });
    E.at(L2.end + .9);
    E.hide(q, .6);
    E.hide(qb, .6);
  });

  E.scene({ name: 'memory_bull', fade: .5 }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_face_big'), { bg: 'radial-gradient(ellipse at 50% 40%, #f7dfb4, #b9844e)', panelBg: 'linear-gradient(180deg,#f9e7c6,#e9c491)', imgH: 1010 });
    C.img.ini({ sep: .4 });
    E.grain(g, .08);
    E.tw(C.img, 6, { s: [1, 1.04] }, 'linear');
    E.wait(.4);
    E.say('bull', '事実、解釈、期待……。うん、覚えてるよ。', { talk: C.img, talkAmp: 1.5 });
    E.wait(.5);
  });

  /* ============================================================ S4 空売り軍団のアジト */
  E.trans('fade', { dur: .9, color: '#000' });
  const ROWS = [['5/27', '監査報告書の「意見不表明」に関するお知らせ', '#c62828'], ['5/28', '名証：監理銘柄（確認中）に指定', '#2c2630']];
  E.scene({ name: 'lair' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .3, gain: .9 });
    const L = P.lair(g, { faces: ['normal', 'smile', 'surprise', 'anxious'] });
    const rows = P.board(L.screen, '適時開示 ｜ エスポア（3260）', ROWS);
    E.show(rows[0], .5, 1.2);
    E.sfx('dun', { delay: .3, gain: .8 });
    E.tw(sc.cam, 3.4, { s: [1.32, 1], y: [150, 0] }, 'inOut');
    E.breathe(L.baron, .008, 1.5);
    E.breathe(L.hat, .01, 1.9);
    L.pigs.forEach((p, i) => E.breathe(p, .012, 2.3, i));
    E.wait(3.0);
    E.set(L.call, { face: 'smile' });
    E.say('eve', 'ねえねえ、エスポアの「意見不表明」って、決算が悪かったってこと〜？', { talk: L.call, talkAmp: 3 });
    E.wait(.1);
  });

  E.scene({ name: 'hat_close' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('hat_e_normal'), { fit: 'cover', pos: '50% 40%', bg: 'linear-gradient(180deg,#2c1316,#170909)' });
    E.from(C.img, { s: 1.08 }, .5);
    E.tw(C.img, 14, { s: [1, 1.05] }, 'linear', .5);
    E.say('hat', '違うね、イブ。', { talk: C.img, talkAmp: 2 });
    C.swap(CH('hat_e_smirk'));
    const a = P.chip(g, '悪い決算', { x: 1330, y: 240, color: '#4a5568', size: 56 });
    const ne = E.div(g, { left: 1440, top: 330, font: '900 96px/1 Zen', color: '#fff', textShadow: '0 4px 10px rgba(0,0,0,.5)' }, '≠').ini({ o: 0 });
    const b = P.chip(g, '意見を出せない', { x: 1250, y: 450, color: '#c62828', size: 56 });
    const L = E.say('hat', '監査人が、決算に「意見を出せなかった」ってことさ。', { talk: C.img, talkAmp: 2, wait: false });
    E.pop(a, .4, .2); E.sfx('pop', { delay: .2 });
    E.pop(ne, .4, L.dur * .45);
    E.pop(b, .45, L.dur * .55); E.sfx('pop', { delay: L.dur * .55 });
    E.at(L.end);
    E.say('hat', '正しいとも、間違っているとも言えない。', { talk: C.img, talkAmp: 2, gap: .15 });
    E.say('hat', '確かめる証拠が、足りなかったんだ。', { talk: C.img, talkAmp: 2 });
  });

  E.scene({ name: 'lair2' }, sc => {
    const g = sc.cam;
    const L = P.lair(g, { faces: ['normal', 'smile', 'surprise', 'anxious'] });
    const rows = P.board(L.screen, '適時開示 ｜ エスポア（3260）', ROWS);
    rows[0].ini({ o: 1 });
    E.breathe(L.baron, .008, 1.5);
    L.pigs.forEach((p, i) => E.breathe(p, .012, 2.3, i));
    P.look(sc.cam, { s: 1.25, cx: 1650, cy: 820, dur: 1.0 });
    L.pigs.forEach((p, i) => E.hop(p, 22, .32, .1 + i * .05));
    E.sfx('snort', { delay: .1 });
    E.say('pig', 'ブヒッ。どこの証拠が足りないんですかい？', { talk: L.pigs[3], delay: .2 });
    P.look(sc.cam, { s: 1.25, cx: 380, cy: 720, dur: 1.0 });
    E.say('hat', '期末の月に計上された、三つの取引だ。', { talk: L.hat, delay: .3 });
  });

  /* ============================================================ S5 解説：確認できなかった3件の取引 */
  E.trans('stripes', { dur: .9, colors: ['#3b1a20', '#c9a24a', '#5a0f1c', '#3b1a20', '#c9a24a', '#5a0f1c', '#3b1a20'] });
  E.scene({ name: 'deals' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .8, gain: .85 });
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(ellipse at 50% 35%, #3d1b22 0%, #200d10 70%, #140707 100%)' });
    const hat = E.actor(g, 'hat', { x: 230, y: 1100, h: 640, pose: 'front' });
    E.breathe(hat, .01, 1.9);
    const call = P.call(g, { x: 1530, y: 560, w: 360, h: 290, faces: ['normal', 'surprise', 'anxious'] });
    const bd = E.div(g, { left: 450, top: 50, width: 1020, height: 760, borderRadius: 20, background: '#fbf9f4', boxShadow: '0 24px 60px rgba(0,0,0,.55)' });
    E.from(bd, { y: 60, s: .96 }, .6, 0, 'quint');
    E.div(bd, { left: 0, top: 34, width: 1020, textAlign: 'center', font: '900 52px/1.2 Zen', color: '#2a2430' }, '確認できなかった <span style="color:#c62828">3件の取引</span>');
    E.div(bd, { left: 0, top: 104, width: 1020, textAlign: 'center', font: '800 28px/1.2 Round', color: '#8a8070' }, '2026年2月期 ・ 期末の月に計上 ・ 不動産コンサルティング等');
    const row = (y, label, amount) => {
      const r = E.div(bd, { left: 60, top: y, width: 900, height: 250, borderRadius: 18, background: '#f3eee4' }).ini({ o: 0 });
      E.div(r, { left: 40, top: 46, font: '800 36px/1.2 Round', color: '#6b6252' }, label);
      E.div(r, { left: 40, top: 104, font: '900 72px/1.2 Noto', color: '#2a2430', whiteSpace: 'nowrap' }, amount);
      return r;
    };
    const r1 = row(160, '売上高として計上', '1億5,545<span style="font-size:42px">万円</span>');
    const r2 = row(440, '営業外収益として計上', '2,000<span style="font-size:42px">万円</span>');
    const q1 = E.div(bd, { left: 60, top: 694, width: 900, textAlign: 'center', font: '800 30px/1.3 Round', color: '#8a3030', whiteSpace: 'nowrap' }, '→ その仕事（役務）が本当にあったのか、証拠が足りなかった').ini({ o: 0 });
    E.wait(.6);
    const L1 = E.say('hat', '不動産コンサルティングなどの取引だ。', { talk: hat, talkAmp: 2, wait: false, gap: .15 });
    E.tw(r1, .45, { o: [0, 1], x: [-40, 0] }, 'out', .3); E.sfx('slide', { delay: .3 });
    E.tw(r2, .45, { o: [0, 1], x: [-40, 0] }, 'out', .9); E.sfx('slide', { delay: .9 });
    E.at(L1.end);
    E.show(q1, .5, .4);
    E.say('hat', 'その仕事が本当にあったのか、証拠がそろわなかった。', { talk: hat, talkAmp: 2 });
    // 円グラフ
    const pie1 = P.pie(bd, { x: 760, y: 272, r: 76, sw: 38, color: '#c62828', size: 48 });
    const pie2 = P.pie(bd, { x: 760, y: 552, r: 76, sw: 38, color: '#c62828', size: 48 });
    const c1 = E.div(bd, { left: 560, top: 380, width: 400, textAlign: 'center', font: '800 24px/1.2 Round', color: '#6b6252' }, '連結売上高に占める割合').ini({ o: 0 });
    const c2 = E.div(bd, { left: 560, top: 660, width: 400, textAlign: 'center', font: '800 24px/1.2 Round', color: '#6b6252' }, '連結営業外収益に占める割合').ini({ o: 0 });
    pie1.ini({ o: 0 }); pie2.ini({ o: 0 }); pie1.label.ini({ o: 0 }); pie2.label.ini({ o: 0 });
    const L2 = E.say('hat', '金額は、売上高の28％。営業外収益の73％。', { talk: hat, talkAmp: 2, wait: false, yomi: '金額は、売上高の28パーセント。営業外収益の73パーセント。' });
    [pie1, pie1.label, c1].forEach(n => E.show(n, .3, .1));
    E.tw(pie1, 1.0, { pct: [0, 28] }, 'out', .3); E.sfx('rise', { delay: .3, gain: .5 });
    [pie2, pie2.label, c2].forEach(n => E.show(n, .3, L2.dur * .45));
    E.tw(pie2, 1.1, { pct: [0, 73] }, 'out', L2.dur * .5); E.sfx('rise', { delay: L2.dur * .5, gain: .6 });
    E.at(L2.end);
    E.set(call, { face: 'surprise' });
    E.tw(call, .3, { s: [1, 1.08] }, 'back');
    E.say('eve', 'えっ、そんなに〜！？', { talk: call, talkAmp: 4 });
    E.wait(.3);
  });

  /* 修正が必要なら：債務超過の可能性 */
  E.scene({ name: 'insolvency' }, sc => {
    const g = sc.cam;
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(ellipse at 50% 35%, #3d1b22 0%, #200d10 70%, #140707 100%)' });
    const hat = E.actor(g, 'hat', { x: 230, y: 1100, h: 640, pose: 'front' });
    E.breathe(hat, .01, 1.9);
    const bd = E.div(g, { left: 450, top: 50, width: 1020, height: 760, borderRadius: 20, background: '#fbf9f4', boxShadow: '0 24px 60px rgba(0,0,0,.55)' });
    E.div(bd, { left: 0, top: 34, width: 1020, textAlign: 'center', font: '900 50px/1.2 Zen', color: '#2a2430' }, 'もし決算の修正が必要になったら？');
    const zeroY = 420;
    E.div(bd, { left: 80, top: zeroY, width: 860, height: 5, background: '#2a2430' });
    E.div(bd, { left: 86, top: zeroY - 46, font: '800 28px/1.2 Round', color: '#6b6252' }, '0');
    const plus = E.div(bd, { left: 250, top: zeroY - 120, width: 200, height: 120, background: '#17915a', borderRadius: '10px 10px 0 0', transformOrigin: '50% 100%' }).ini({ sy: 0 });
    E.div(bd, { left: 180, top: zeroY + 22, width: 340, textAlign: 'center', font: '800 30px/1.35 Round', color: '#17915a', whiteSpace: 'nowrap' }, 'いまの純資産<br>（わずかにプラス）');
    const arrow = E.div(bd, { left: 500, top: zeroY - 50, font: '900 70px/1 Zen', color: '#c62828' }, '→').ini({ o: 0 });
    const minus = E.div(bd, { left: 600, top: zeroY + 5, width: 200, height: 200, background: '#c62828', borderRadius: '0 0 10px 10px', transformOrigin: '50% 0%' }).ini({ sy: 0 });
    const mlab = E.div(bd, { left: 560, top: zeroY - 100, width: 280, textAlign: 'center', font: '900 38px/1.25 Zen', color: '#c62828' }, '債務超過').ini({ o: 0 });
    const tag = P.chip(bd, '2期連続？', { x: 820, y: 520, color: '#c62828', size: 42 });
    E.tw(plus, .6, { sy: [0, 1] }, 'back', .4);
    E.wait(.6);
    const L = E.say('hat', '修正が必要なら、2期連続の債務超過になる可能性が高い。', { talk: hat, talkAmp: 2, wait: false, gap: .15, yomi: '修正が必要なら、2期連続の、債務超過になる可能性が高い。' });
    E.show(arrow, .3, L.dur * .2);
    E.tw(minus, .7, { sy: [0, 1] }, 'out', L.dur * .3); E.sfx('drop', { delay: L.dur * .3, gain: .6 });
    E.show(mlab, .4, L.dur * .45);
    E.pop(tag, .45, L.dur * .7); E.sfx('stamp', { delay: L.dur * .7, gain: .6 });
    E.at(L.end);
    E.say('hat', '……資料には、そう書かれていた。', { talk: hat, talkAmp: 2, yomi: '資料には、そう書かれていた。' });
    E.wait(.2);
  });

  /* 揺れていたのは「前提」 */
  E.scene({ name: 'foundation' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .8, gain: .75 });
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'linear-gradient(180deg,#f3ece0,#e6dccb)' });
    E.div(g, { left: 0, top: 860, width: W, height: 220, background: '#d8ccb6' });
    const tower = E.div(g, { left: 560, top: 140, width: 800, height: 720 });
    tower.el.style.transformOrigin = '50% 100%';
    const block = (y, h, label, c, sub) => E.div(tower, { left: 0, top: y, width: 800, height: h, borderRadius: 16, background: c, boxShadow: 'inset 0 -10px 0 rgba(0,0,0,.12), 0 10px 20px rgba(0,0,0,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff', font: '900 64px/1.15 Zen' }, `${label}${sub ? `<div style="font:800 28px/1.4 Round;opacity:.9">${sub}</div>` : ''}`).ini({ o: 0 });
    const b1 = block(0, 190, '株価', '#3c6fd1');
    const b2 = block(210, 210, '利益', '#e09a2c', '決算の数字');
    const b3 = block(440, 280, '上場の前提', '#7a4a3a', '財務諸表を信頼できること');
    [b3, b2, b1].forEach((b, i) => { E.tw(b, .45, { o: [0, 1], y: [-80, 0] }, 'bounce', .2 + i * .25); E.sfx('footstep', { delay: .5 + i * .25, gain: .7 }); });
    E.wait(1.2);
    const L1 = E.narr('つまり問題は、利益が少し減るかどうか、じゃなかった。', { wait: false });
    E.tw(b2, .3, { s: 1.04 }, 'back', .2);
    E.tw(b2, .3, { s: 1 }, 'out', L1.dur * .55);
    E.at(L1.end);
    const crack = E.polyline(tower, [[380, 440], [360, 520], [410, 580], [370, 650], [400, 720]], { left: 0, top: 0, width: 800, height: 720, color: '#2a1610', sw: 7 }).ini({ draw: 0 });
    const crack2 = E.polyline(tower, [[360, 520], [250, 560], [180, 640]], { left: 0, top: 0, width: 800, height: 720, color: '#2a1610', sw: 5 }).ini({ draw: 0 });
    const L2 = E.narr('上場していられるのか。その前提そのものが、揺れていたんだ。', { wait: false });
    E.tw(b3, .3, { s: 1.03 }, 'back', .1);
    E.tw(crack, .5, { draw: [0, 1] }, 'out', L2.dur * .55); E.sfx('shatter', { delay: L2.dur * .55, gain: .45 });
    E.tw(crack2, .4, { draw: [0, 1] }, 'out', L2.dur * .62);
    E.wobble(tower, 2.2, 2.2, L2.dur * .55);
    E.shake(sc.cam, .6, 8, L2.dur * .55);
    E.at(L2.end + .3);
  });

  /* ハットの念押し */
  E.scene({ name: 'hat_close2' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .5, gain: .8 });
    const C = P.closeup(g, CH('hat_e_proud'), { fit: 'cover', pos: '50% 40%', bg: 'linear-gradient(180deg,#2c1316,#170909)' });
    E.tw(C.img, 12, { s: [1.02, 1.07] }, 'linear');
    const a = P.chip(g, '意見不表明', { x: 1290, y: 230, color: '#4a5568', size: 52 });
    const ne = E.div(g, { left: 1430, top: 320, font: '900 90px/1 Zen', color: '#fff', textShadow: '0 4px 10px rgba(0,0,0,.5)' }, '≠').ini({ o: 0 });
    const b = P.chip(g, '不正だと断定', { x: 1270, y: 430, color: '#4a5568', size: 52 });
    const L = E.say('hat', '勘違いするなよ。不正だと決めつけたわけじゃない。', { talk: C.img, talkAmp: 2, wait: false });
    E.pop(a, .4, .2); E.pop(ne, .4, L.dur * .4); E.pop(b, .45, L.dur * .5); E.sfx('pop', { delay: L.dur * .5 });
    E.at(L.end);
    C.swap(CH('hat_e_normal'));
    E.tw(a, .3, { o: 0 }); E.tw(ne, .3, { o: 0 }); E.tw(b, .3, { o: 0 });
    const c = P.chip(g, '確かめられなかった', { x: 1180, y: 330, color: '#17915a', size: 56 });
    const st = P.stamp(g, 'fact', { x: 1520, y: 450, size: .9, rot: -12 });
    const L2 = E.say('hat', 'ただ、「確かめられなかった」という事実は、重い。', { talk: C.img, talkAmp: 2, wait: false });
    E.pop(c, .45, .3);
    P.stampIn(st, L2.dur * .6);
    E.at(L2.end + .3);
  });

  /* ============================================================ S6 5月28日：監理銘柄（確認中） */
  E.scene({ name: 'lair3' }, sc => {
    const g = sc.cam;
    const L = P.lair(g, { faces: ['normal', 'smile', 'surprise', 'anxious'] });
    const rows = P.board(L.screen, '適時開示 ｜ エスポア（3260）', ROWS);
    rows[0].ini({ o: 1 });
    E.breathe(L.baron, .008, 1.5);
    L.pigs.forEach((p, i) => E.breathe(p, .012, 2.3, i));
    P.look(sc.cam, { s: 1.45, cx: 960, cy: 250, dur: 1.2 });
    E.wait(1.0);
    E.tw(rows[1], .4, { o: [0, 1], x: [60, 0] }, 'back');
    E.sfx('alarm', { gain: .35 });
    const red = E.div(L.screen, { left: 0, top: 120, width: 840, height: 60, background: 'rgba(230,60,60,.2)' }).ini({ o: 0 });
    E.fn(2.4, (k, t) => { red.p.o = .5 + .5 * Math.sin(t * 9); }, 0, true);
    E.wait(1.4);
    P.look(sc.cam, { s: 1.35, cx: 1685, cy: 330, dur: .9 });
    E.set(L.call, { face: 'anxious' }, .3);
    E.say('eve', '監理銘柄……？なんか、こわい名前〜。', { talk: L.call, talkAmp: 3, delay: .3 });
  });

  E.scene({ name: 'kanri' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 35%, #3d1b22 0%, #200d10 70%, #140707 100%)' });
    const hat = E.actor(g, 'hat', { x: 230, y: 1100, h: 640, pose: 'front' });
    E.breathe(hat, .01, 1.9);
    const call = P.call(g, { x: 1530, y: 560, w: 360, h: 290, faces: ['anxious', 'normal'] });
    const bd = E.div(g, { left: 450, top: 50, width: 1020, height: 760, borderRadius: 20, background: '#fbf9f4', boxShadow: '0 24px 60px rgba(0,0,0,.55)' });
    E.from(bd, { y: 50, s: .97 }, .5, 0, 'quint');
    E.div(bd, { left: 0, top: 36, width: 1020, textAlign: 'center', font: '900 50px/1.2 Zen', color: '#2a2430' }, '5月28日　名古屋証券取引所');
    const box = E.div(bd, { left: 90, top: 140, width: 840, height: 170, borderRadius: 22, background: '#fdecec', border: '5px solid #c62828', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 54px/1.3 Zen', color: '#a31f1f', whiteSpace: 'nowrap' }, '監理銘柄（確認中）に指定').ini({ o: 0 });
    const why = E.div(bd, { left: 90, top: 360, width: 840, font: '800 36px/1.6 Round', color: '#3d3540', textAlign: 'center' }, '改善期間の終わりに<br><span style="color:#a31f1f">純資産の基準</span>を満たさないおそれ').ini({ o: 0 });
    const tip = E.div(bd, { left: 90, top: 560, width: 840, font: '800 30px/1.5 Round', color: '#8a8070', textAlign: 'center' }, '＝ 上場廃止の基準に当たるかどうか、取引所が確かめる段階').ini({ o: 0 });
    E.pop(box, .5, .5, .8); E.sfx('alarm', { delay: .5, gain: .3 });
    E.wait(1.1);
    const L1 = E.say('hat', '取引所が「純資産の基準を満たせないかもしれない」と、', { talk: hat, talkAmp: 2, wait: false, gap: .1, yomi: '取引所が、純資産の基準を、満たせないかもしれない、と、' });
    E.tw(why, .5, { o: [0, 1], y: [20, 0] }, 'out', .3);
    E.at(L1.end);
    const L2 = E.say('hat', '確認を始めた印さ。', { talk: hat, talkAmp: 2, wait: false });
    E.show(tip, .5, .1);
    const st = P.stamp(bd, 'fact', { x: 760, y: 112, size: .85, rot: -10 });
    P.stampIn(st, L2.dur * .5);
    E.at(L2.end + 1.0);
  });

  /* ============================================================ S7 男爵 */
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .6 });
    const C = P.closeup(g, CH('baron_face_big'), { bg: 'radial-gradient(ellipse at 50% 40%, #4c1820, #140707)', panelBg: 'linear-gradient(180deg,#2c0f14,#120607)', imgH: 1020 });
    E.tw(C.img, 9, { s: [1, 1.1] }, 'linear');
    E.particles(g, { n: 40, kind: 'ember', color: '#ff5a4a', area: [0, 0, W, H], speed: .7, seed: 9 });
    E.sfx('heartbeat', { delay: .2 });
    E.wait(.6);
    E.say('baron', '……確かめられない時、人は物語で穴を埋める。', { talk: C.img, talkAmp: 1.5 });
    E.wait(.2);
    const L = E.say('baron', 'さて。あの子は、どんな物語を選ぶかな。', { talk: C.img, talkAmp: 1.5, wait: false });
    E.flash('#ff2a2a', .5, .35, L.dur * .6);
    E.sfx('dun', { delay: L.dur * .6, gain: .7 });
    E.at(L.end + .3);
    E.tw(C.img, .45, { s: 1.6, blur: 24, o: 0 }, 'in');
    E.sfx('whoosh_big', { gain: .8 });
    E.wait(.45);
  });

  /* ============================================================ S8 ブルちゃんの部屋（夜） */
  E.scene({ name: 'room_night' }, sc => {
    const g = sc.cam;
    E.bgm('sad', { fadeIn: 1.4, gain: .85 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { hi: 0 });
    const bull = E.actor(g, 'bull', { x: 700, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.0);
    E.tw(sc.cam, 9, { s: [1.02, 1.08] }, 'linear');
    const ph = P.phone(g, { x: 1240, y: 170, w: 380, h: 760 });
    ph.ini({ o: 0 });
    P.lock(ph, { date: '6月11日', week: '木曜日' });
    const nt = P.notice(ph, { app: '適時開示アラート', title: 'エスポア（3260）', body: '第三者委員会の設置に関するお知らせ', y: 300 });
    E.wait(.6);
    const L = E.narr('6月11日。会社は、第三者委員会を作った。', { wait: false });
    E.tw(ph, .6, { o: [0, 1], y: [500, 0] }, 'quint', .2); E.sfx('whoosh', { delay: .2 });
    P.notifyIn(nt, 1.0);
    E.at(L.end + .6);
  });

  E.scene({ name: 'bull_hope' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_trouble'), { bg: 'linear-gradient(180deg,#1b2446,#0f152c)', panelBg: 'linear-gradient(180deg,#2a3560,#1a2244)', imgH: 820 });
    E.tw(C.img, 7, { s: [1, 1.05] }, 'linear');
    const b = E.bubble(g, '……だよね？', { x: 1250, y: 230, w: 330, kind: 'round', tail: 'bl', life: 0, delay: 2.4, cps: 14 });
    E.wait(.4);
    E.say('bull', 'ちゃんと調べてくれるなら……きっと大丈夫、だよね？', { talk: C.img, talkAmp: 2 });
    E.wait(.6);
  });

  /* 自分のセリフを 3 つに分ける */
  E.scene({ name: 'split' }, sc => {
    const g = sc.cam;
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(ellipse at 50% 40%, #26305a 0%, #141a36 70%, #0b0f22 100%)' });
    E.particles(g, { n: 30, kind: 'dust', color: '#9fb2ff', area: [0, 0, W, H], speed: .6, seed: 4 });
    const parts = [
      ['第三者委員会を作った', 'fact'],
      ['ちゃんと調べてくれる', 'interp'],
      ['きっと大丈夫', 'hope'],
    ];
    const rows = parts.map(([txt, kind], i) => {
      const r = E.div(g, { left: 300, top: 150 + i * 210, width: 900, height: 160, borderRadius: 24, background: 'rgba(255,255,255,.95)', boxShadow: '0 16px 30px rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', paddingLeft: 50, font: '900 58px/1.2 Zen', color: '#262236' }, `「${txt}」`).ini({ o: 0 });
      const st = P.stamp(g, kind, { x: 1270, y: 178 + i * 210, size: 1, rot: -8 + i * 4 });
      return { r, st };
    });
    rows.forEach((o, i) => { E.tw(o.r, .5, { o: [0, 1], x: [-120, 0] }, 'back', .3 + i * .35); E.sfx('slide', { delay: .3 + i * .35 }); });
    rows.forEach((o, i) => P.stampIn(o.st, 1.6 + i * .7));
    E.wait(3.9);
    E.narr('——このときの私は、まだ気づいていなかった。', { yomi: 'このときの私は、まだ気づいていなかった。' });
    // 「期待」が「事実」の顔をし始める
    const hope = rows[2];
    const L = E.narr('自分の「期待」が、少しずつ「事実」の顔をし始めていることに。', { wait: false, yomi: '自分の、期待が、少しずつ、事実の顔をし始めていることに。' });
    const t0 = L.dur * .35;
    hope.st.hook(p => {
      const toFact = !!p.toFact, el = hope.st.el;
      if (hope.st.c.toFact === toFact) return;
      const c = toFact ? '#17915a' : '#e0457b';
      el.style.borderColor = c; el.style.color = c; el.textContent = toFact ? '事実' : '期待';
      hope.st.c.toFact = toFact;
    });
    E.act(E.T + t0, E.T + t0 + 2.4, (k, t) => {
      const flick = k < .8 ? Math.sin(t * 40) > .2 : true;
      hope.st.p.toFact = k > .55 && flick;
    }, false, sc);
    E.shake(hope.st, 2.0, 4, t0);
    E.sfx('glitch', { delay: t0 + .6, gain: .5 });
    E.sfx('glitch', { delay: t0 + 1.5, gain: .6 });
    E.at(L.end + 1.0);
  });

  /* ============================================================ S9 次回予告 */
  E.trans('fade', { dur: .8, color: '#000' });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .8 });
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(ellipse at 45% 45%, #3a2c24 0%, #1d1612 75%, #120d0a 100%)' });
    const items = [['5/27', '意見不表明'], ['5/28', '監理銘柄（確認中）'], ['6/11', '第三者委員会を設置'], ['6/30', '？']];
    const x0 = 180, x1 = 1380, y = 470;
    const line = E.div(g, { left: x0, top: y, width: x1 - x0, height: 8, borderRadius: 4, background: '#c9a24a' }).ini({ cr: 100 });
    E.tw(line, 1.2, { cr: [100, 0] }, 'inOut', .2);
    items.forEach(([d, t], i) => {
      const x = x0 + i * (x1 - x0) / (items.length - 1);
      const dot = E.div(g, { left: x - 22, top: y - 18, width: 44, height: 44, borderRadius: '50%', background: i === 3 ? '#e0353f' : '#f3e6c8', border: '6px solid #c9a24a' }).ini({ o: 0 });
      const dl = E.div(g, { left: x - 150, top: y - 90, width: 300, textAlign: 'center', font: '900 44px/1.2 Noto', color: '#f3e6c8' }, d).ini({ o: 0 });
      const tl = E.div(g, { left: x - 170, top: y + 54, width: 340, textAlign: 'center', font: '800 34px/1.35 Round', color: i === 3 ? '#ff8a8a' : '#e8dcc0' }, t).ini({ o: 0 });
      [dot, dl, tl].forEach(n => E.pop(n, .4, .4 + i * .35, .6));
      E.sfx('click', { delay: .4 + i * .35 });
    });
    const st = P.sticky(g, '第2章<br>調査は止まった？', { x: 1400, y: 110, w: 430, h: 250, rot: 5, size: 42 });
    P.slap(st, 2.2);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.8);
    E.sfx('snort', { delay: 3.0 });
    E.wait(3.4);
    E.say('pig', 'ブヒッ。次は、調べる側が止まるブー。', { talk: pig, talkAmp: 5 });
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
