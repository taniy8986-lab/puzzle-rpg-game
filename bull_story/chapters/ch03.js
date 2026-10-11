// 第3章「延期の呪文」（2026年8月20日〜8月30日）
// 台本: story/03_第3章_延期の呪文.md　元資料 p3・p7〜10
// SNS・チャットの投稿は元資料の投稿の趣旨を要約したもの（アカウント名は架空）
'use strict';
E.chapter('03');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const DISCLAIMER = 'この物語はフィクションです　｜　エスポア（3260）の事実関係は公開資料に基づきます　｜　投資助言ではありません';
  const IMAGE_NOTE = '※投稿は要約したイメージです（アカウント名は架空）';
  const ROWS = [
    ['8/20', '第三者委員会の調査報告書の提出を延期', '#c62828'],
    ['8/30', '委員1名が辞任 ／ 報告書の期限を9/15へ再延期', '#c62828'],
  ];

  /* ============================================================ S0 アバン */
  E.scene({ name: 'avant', bg: '#2a211b' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: 1.5, gain: .9 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 42% 42%, #7a5f46 0%, #4a3829 55%, #241b14 100%)' });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'repeating-linear-gradient(8deg, rgba(255,230,190,.035) 0 3px, transparent 3px 26px)' });
    const cal = P.calendar(g, { x: 300, y: 150, w: 780, year: 2026, month: 8 });
    E.from(cal, { y: 80 }, .9, .1, 'quint');
    const st = P.sticky(g, '第3章<br>延期の呪文', { x: 1440, y: 160, w: 380, h: 240, rot: 6, size: 44 });
    P.slap(st, 1.4);
    const note = P.note(g, DISCLAIMER, { x: 40, y: 30, size: 22, dark: true }).ini({ o: 0 });
    E.show(note, .6, .4);
    E.tw(sc.cam, 10, { s: [1, 1.08], x: [0, 50], y: [0, 30] }, 'linear');
    E.wait(1.8);
    const L = E.narr('8月。待っていた報告書は、届かなかった。', { wait: false });
    const p20 = cal.pos(20), p30 = cal.pos(30);
    P.circle(g, { x: p20.x, y: p20.y, w: 104, h: 76, dur: .45, delay: L.dur * .25 });
    P.circle(g, { x: p30.x, y: p30.y, w: 104, h: 76, dur: .45, delay: L.dur * .6, seed: 3 });
    E.hide(note, .5, L.dur * .5);
    E.at(L.end + 1.0);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編', catchCopy: '〜 期待が事実を追い越すとき 〜', dur: 4.6 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 3, title: '延期の呪文', sub: '2026年8月20日 〜 8月30日', dur: 3.4 });
  E.trans('fade', { dur: .7, color: '#fff' });

  /* ============================================================ S2 8月20日：延期 */
  E.bgm('daily', { fadeIn: 1.0, gain: .8 });
  P.phoneScene((ph, sc) => {
    P.lock(ph, { date: '8月20日', week: '木曜日' });
    const nt = P.notice(ph, { title: 'エスポア（3260）', body: '第三者委員会による<br>調査報告書提出の<br><span style="color:#d42a2a">延期</span>について', y: 330 });
    P.notifyIn(nt, .9);
    E.wait(1.6);
    E.narr('8月20日。報告書の提出が、延期された。');
    P.circle(ph.screen, { x: 62, y: 526, w: 88, h: 46, dur: .4 });
    E.wait(.6);
  }, { name: 'phone820', wait: 0 });

  E.scene({ name: 'facts820' }, sc => {
    const g = sc.cam;
    const { hat, call, bd } = P.boardScene(g, ['smile', 'normal', 'surprise', 'anxious']);
    E.div(bd, { left: 0, top: 40, width: 1020, textAlign: 'center', font: '900 48px/1.2 Zen', color: '#2a2430' }, '8月20日　一次資料で確認できたこと');
    const rows = [
      ['提出の予定', '8月中旬　→　<span style="color:#c62828">約2週間 延期</span>'],
      ['理由', '「<span style="color:#c62828">追加調査</span>の必要性が生じた」'],
      ['新しいめど', '<span style="color:#c62828">9月初旬</span>'],
    ].map(([k, v], i) => {
      const r = E.div(bd, { left: 60, top: 150 + i * 170, width: 900, height: 140, borderRadius: 20, background: '#f3eee4' }).ini({ o: 0 });
      E.div(r, { left: 34, top: 0, height: 140, display: 'flex', alignItems: 'center', font: '800 32px/1.2 Round', color: '#8a8070', whiteSpace: 'nowrap' }, k);
      E.div(r, { left: 220, top: 0, height: 140, display: 'flex', alignItems: 'center', font: '900 44px/1.2 Zen', color: '#2a2430', whiteSpace: 'nowrap' }, v);
      return r;
    });
    E.tw(rows[0], .45, { o: [0, 1], x: [-40, 0] }, 'out', .4); E.sfx('slide', { delay: .4 });
    E.wait(.8);
    const L1 = E.narr('理由は、追加の調査が必要になったから。', { wait: false });
    E.tw(rows[1], .45, { o: [0, 1], x: [-40, 0] }, 'out', .2); E.sfx('slide', { delay: .2 });
    E.at(L1.end);
    const L2 = E.narr('提出のめどは、9月初旬になった。', { wait: false });
    E.tw(rows[2], .45, { o: [0, 1], x: [-40, 0] }, 'out', .2); E.sfx('slide', { delay: .2 });
    E.at(L2.end + .4);
  });

  /* ============================================================ S3 SNSの声 */
  P.phoneScene((ph, sc) => {
    const posts = P.sns(ph, [
      { name: '株クラ・すずらん', handle: '@suzuran', icon: 'す', color: '#7cc29a', text: '延期は残念。でも、それだけ丁寧に調べてるってことだよね', likes: 86, h: 230 },
      { name: 'ロケット待ち', handle: '@rocket', icon: 'ロ', color: '#f0a04a', text: '待てる人だけが、ロケットに乗れるのかも🚀', likes: 152, h: 200 },
    ]);
    const nb = P.note(sc.root, IMAGE_NOTE, { x: 1330, y: 30, size: 22 });
    posts.forEach((p, i) => { E.tw(p, .45, { o: [0, 1], y: [40, 0] }, 'back', .8 + i * 1.2); E.sfx('pop', { delay: .8 + i * 1.2 }); });
    P.look(sc.cam, { s: 1.45, cx: 960, cy: 440, dur: 1.4, delay: .5 });
    E.wait(1.2);
    E.narr('SNSには、延期を前向きに読む声が流れてきた。');
    E.wait(.6);
  }, { name: 'sns820', wait: 0, zoom: false });

  E.scene({ name: 'bull_smile' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_smile'), { burst: { c1: '#fff7ea', c2: '#ffe9cc', spin: 5 }, imgH: 820, panelBg: 'linear-gradient(180deg,#fffaf2,#f8ead8)' });
    E.from(C.img, { s: .9, y: 40 }, .4, 0, 'back');
    E.particles(g, { n: 24, kind: 'sparkle', color: '#ffd84a', area: [440, 0, 1040, 900], speed: .6, seed: 12 });
    E.sfx('sparkle', { delay: .3, gain: .5 });
    E.wait(.3);
    E.say('bull', '……そっか。丁寧に、調べてくれてるんだ。', { talk: C.img, talkAmp: 2, yomi: 'そっか。丁寧に、調べてくれてるんだ。' });
    E.narr('それは、私がいちばん聞きたかった言葉だった。');
    E.wait(.3);
  });

  /* ============================================================ S4 アジト：延期の呪文を分ける */
  E.trans('fade', { dur: .8, color: '#000' });
  E.scene({ name: 'lair' }, sc => {
    const g = sc.cam;
    E.bgm('villain', { fadeIn: .3, gain: .9 });
    const L = P.lair(g, { faces: ['smile', 'laugh', 'normal', 'anxious', 'surprise'] });
    const rows = P.board(L.screen, '適時開示 ｜ エスポア（3260）', ROWS);
    E.tw(rows[0], .4, { o: [0, 1], x: [60, 0] }, 'back', 1.0);
    E.sfx('dun', { delay: .3, gain: .8 });
    E.tw(sc.cam, 3.0, { s: [1.3, 1], y: [150, 0] }, 'inOut');
    E.breathe(L.baron, .008, 1.5);
    E.breathe(L.hat, .01, 1.9);
    L.pigs.forEach((p, i) => E.breathe(p, .012, 2.3, i));
    E.wait(2.6);
    P.look(sc.cam, { s: 1.3, cx: 1685, cy: 330, dur: .8 });
    E.say('eve', 'ねえねえ、SNSで「ロケットに乗れる」って盛り上がってるよ〜！', { talk: L.call, talkAmp: 3, delay: .2 });
    P.look(sc.cam, { s: 1.25, cx: 1650, cy: 820, dur: .7 });
    L.pigs.forEach((p, i) => E.hop(p, 34, .3, i * .06, 2));
    E.sfx('snort', { delay: .1 });
    E.say('pig', 'ブヒッ！ロケット、オレも乗りたいブー！', { talk: L.pigs[3], talkAmp: 5, delay: .2 });
  });

  E.scene({ name: 'hat_close' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('hat_e_scheme'), { fit: 'cover', pos: '50% 38%', bg: 'linear-gradient(180deg,#2c1316,#170909)' });
    E.from(C.img, { s: 1.08 }, .5);
    E.tw(C.img, 9, { s: [1, 1.05] }, 'linear', .5);
    E.say('hat', '……延期ひとつで、もうロケットか。', { talk: C.img, talkAmp: 2, yomi: '延期ひとつで、もうロケットか。' });
    C.swap(CH('hat_e_smirk'));
    E.say('hat', '分けてみな。どこまでが事実で、どこからが期待か。', { talk: C.img, talkAmp: 2 });
  });

  E.scene({ name: 'split' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.nightBg(g);
    E.particles(g, { n: 26, kind: 'dust', color: '#9fb2ff', area: [0, 0, W, H], speed: .6, seed: 6 });
    const parts = [['追加調査が必要になった', 'fact'], ['丁寧に調べている＝良い結果', 'interp'], ['ロケットに乗れる', 'hope']];
    const rows = parts.map(([txt, kind], i) => {
      const r = E.div(g, { left: 260, top: 150 + i * 210, width: 980, height: 160, borderRadius: 24, background: 'rgba(255,255,255,.95)', boxShadow: '0 16px 30px rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', paddingLeft: 50, font: '900 54px/1.2 Zen', color: '#262236', whiteSpace: 'nowrap' }, `「${txt}」`).ini({ o: 0 });
      const st = P.stamp(g, kind, { x: 1300, y: 178 + i * 210, size: 1, rot: -8 + i * 4 });
      return { r, st };
    });
    rows.forEach((o, i) => { E.tw(o.r, .5, { o: [0, 1], x: [-120, 0] }, 'back', .3 + i * .3); E.sfx('slide', { delay: .3 + i * .3 }); });
    E.wait(1.3);
    let L = E.say('hat', '「追加調査が必要」。ここまでが事実だ。', { wait: false, yomi: '追加調査が必要。ここまでが事実だ。' });
    P.stampIn(rows[0].st, L.dur * .65);
    E.at(L.end);
    L = E.say('hat', '「丁寧に調べてる、だから良い結果」は、解釈。', { wait: false, yomi: '丁寧に調べてる、だから良い結果、は、解釈。' });
    P.stampIn(rows[1].st, L.dur * .75);
    E.at(L.end);
    L = E.say('hat', 'ロケットは……ただの期待さ。', { wait: false, yomi: 'ロケットは、ただの期待さ。' });
    P.stampIn(rows[2].st, L.dur * .7);
    E.at(L.end + .6);
  });

  /* ============================================================ S5 8月30日：辞任と再延期 */
  E.trans('stripes', { dur: .9 });
  E.bgm('tension', { fadeIn: .8, gain: .8 });
  P.phoneScene((ph, sc) => {
    P.lock(ph, { date: '8月30日', week: '日曜日' });
    const nt = P.notice(ph, { title: 'エスポア（3260）', body: '第三者委員会の一部委員の<br><span style="color:#d42a2a">辞任</span>及び調査報告書提出の<br><span style="color:#d42a2a">再延期</span>について', y: 330 });
    E.wait(.4);
    const L = E.narr('そして8月30日。もうひとつの「お知らせ」が届いた。', { wait: false, yomi: 'そして8月30日。もうひとつの、お知らせが届いた。' });
    P.notifyIn(nt, .9);
    E.at(L.end + .6);
  }, { name: 'phone830', wait: .6 });

  E.scene({ name: 'resign' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '8月30日　委員の辞任と再延期', 60);
    E.show(tt, .4);
    const cm = P.committee(g, { x: 260, y: 220, w: 620, h: 330, n: 4, label: '第三者委員会', sub: '4人 → 3人で調査を続ける' });
    E.from(cm, { y: 60 }, .5, .2, 'back');
    // 1 人（公認会計士）が抜ける
    const leaving = cm.people[3];
    const tagR = P.tag(g, '辞任（公認会計士）', { x: 640, y: 170, rot: 6, color: '#c62828', size: 32 });
    const none = P.tag(g, '後任なし', { x: 560, y: 590, rot: -4, color: '#5a6474', size: 34 });
    // 期限のカード
    const due = E.div(g, { left: 1080, top: 230, width: 620, height: 300, borderRadius: 26, background: 'rgba(255,255,255,.96)', boxShadow: '0 16px 30px rgba(0,0,0,.35)' }).ini({ o: 0 });
    E.div(due, { left: 0, top: 26, width: 620, textAlign: 'center', font: '800 32px/1.2 Round', color: '#8a8070' }, '報告書の期限');
    const old = E.div(due, { left: 0, top: 90, width: 620, textAlign: 'center', font: '900 64px/1.3 Zen', color: '#9a9184' }, '9月初旬').ini({ o: 1 });
    const strike = E.div(due, { left: 160, top: 136, width: 300, height: 8, borderRadius: 4, background: '#c62828', transformOrigin: '0 50%' }).ini({ sx: 0 });
    const neu = E.div(due, { left: 0, top: 180, width: 620, textAlign: 'center', font: '900 72px/1.3 Zen', color: '#c62828' }, '→ 9月15日').ini({ o: 0 });
    E.wait(.9);
    let L = E.say('hat', '委員の1人、公認会計士が辞任した。', { wait: false, yomi: '委員のひとり、公認会計士が辞任した。' });
    E.pop(tagR, .4, L.dur * .5); E.sfx('stamp', { delay: L.dur * .55, gain: .6 });
    E.tw(leaving, .6, { o: 0, y: -120, r: 20 }, 'in2', L.dur * .7);
    E.at(L.end);
    L = E.say('hat', '後任は入れず、残る3人で調査を続ける。', { wait: false, yomi: '後任は入れず、残る3人で、調査を続ける。' });
    E.pop(none, .4, L.dur * .3); E.sfx('pop', { delay: L.dur * .3 });
    E.at(L.end);
    L = E.say('hat', '報告書の期限は、9月15日に延びた。', { wait: false });
    E.tw(due, .45, { o: [0, 1], x: [60, 0] }, 'back', .1); E.sfx('slide', { delay: .1 });
    E.tw(strike, .35, { sx: [0, 1] }, 'out', L.dur * .4); E.sfx('pen', { delay: L.dur * .4, gain: .5 });
    E.tw(neu, .4, { o: [0, 1], s: [1.5, 1] }, 'back', L.dur * .55); E.sfx('stamp', { delay: L.dur * .6, gain: .6 });
    E.at(L.end + .3);
  });

  E.scene({ name: 'reason_unknown' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('hat_e_normal'), { fit: 'cover', pos: '50% 40%', bg: 'linear-gradient(180deg,#2c1316,#170909)' });
    E.tw(C.img, 10, { s: [1.02, 1.07] }, 'linear');
    const side = E.div(g, { left: 1240, top: 190, width: 620, height: 400, borderRadius: 28, background: 'rgba(24,12,16,.82)', boxShadow: '0 16px 36px rgba(0,0,0,.5)' }).ini({ o: 0 });
    E.show(side, .4, .2);
    const q = E.div(g, { left: 1280, top: 230, width: 540, textAlign: 'center', font: '900 54px/1.4 Zen', color: '#fff' }, '辞任の理由<br><span style="color:#ffd84a">＝ 発表なし</span>').ini({ o: 0 });
    const good = P.chip(g, '良い理由？', { x: 1290, y: 450, color: '#17915a', size: 46 });
    const bad = P.chip(g, '悪い理由？', { x: 1560, y: 450, color: '#c62828', size: 46 });
    let L = E.say('hat', '辞任の理由は、この時点では発表されていない。', { talk: C.img, talkAmp: 2, wait: false });
    E.pop(q, .45, L.dur * .4); E.sfx('pop', { delay: L.dur * .4 });
    E.at(L.end);
    L = E.say('hat', '良い理由か、悪い理由か。決めつける材料は、なかったのさ。', { talk: C.img, talkAmp: 2, wait: false });
    E.pop(good, .4, L.dur * .1); E.pop(bad, .4, L.dur * .25);
    const x1 = P.cross(g, { x: 1405, y: 485, s: 120, delay: L.dur * .7 });
    const x2 = P.cross(g, { x: 1675, y: 485, s: 120, delay: L.dur * .78 });
    E.at(L.end + .4);
  });

  /* ============================================================ S6 オープンチャット */
  E.scene({ name: 'chat' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'linear-gradient(180deg,#e9eef5,#d6dee9)' });
    const win = P.chat(g, { x: 360, y: 50, w: 1200, h: 780 });
    E.from(win, { y: 60 }, .5, 0, 'quint');
    P.note(g, '※会話は要約したイメージです（名前は架空）', { x: 1300, y: 860, size: 22 });
    const m1 = P.chatMsg(win, { name: 'メンバーA', text: '期日がはっきりしたから、逆に良いと思います', y: 110, color: '#e0a04a' });
    const m2 = P.chatMsg(win, { name: 'メンバーB', text: '【妄想】期日が決まった＝方向性はもう出てる。<br>ダメならすぐ終わるはず。<br>認められるから、まとめる時間がかかってる', y: 290, color: '#6a9bd8' });
    E.tw(m1, .45, { o: [0, 1], y: [30, 0] }, 'back', .6); E.sfx('pop', { delay: .6 });
    E.tw(m2, .45, { o: [0, 1], y: [30, 0] }, 'back', 1.8); E.sfx('pop', { delay: 1.8 });
    E.wait(2.6);
    E.narr('チャットでは、期日が決まったことまで、良い知らせとして読まれていった。');
    E.wait(.4);
  });

  E.scene({ name: 'chain' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '「期日が決まった」から「認められる」へ', 50);
    E.show(tt, .4);
    const steps = [
      ['①', '9/15という期限が決まった', '#17915a'],
      ['②', '調査の方向性は、もう出ている', '#2b68d8'],
      ['③', '否定なら、すぐ終わるはず', '#2b68d8'],
      ['④', '延期は「認められる理由」をまとめているから', '#e0457b'],
    ];
    const boxes = steps.map(([n, t, c], i) => E.div(g, { left: 180 + i * 90, top: 160 + i * 175, width: 1240, height: 120, borderRadius: 20, background: '#fff', borderLeft: `18px solid ${c}`, boxShadow: '0 12px 24px rgba(0,0,0,.3)', display: 'flex', alignItems: 'center', paddingLeft: 30, font: '900 46px/1.2 Zen', color: '#262236', whiteSpace: 'nowrap' }, `<span style="color:${c};margin-right:20px">${n}</span>${t}`).ini({ o: 0 }));
    const leaps = [0, 1, 2].map(i => E.div(g, { left: 60 + i * 90, top: 284 + i * 175, padding: '6px 22px 8px', borderRadius: 10, background: '#e0353f', color: '#fff', font: '900 34px/1.2 Zen', whiteSpace: 'nowrap', boxShadow: '0 8px 16px rgba(0,0,0,.3)' }, '飛躍！').ini({ o: 0, r: -6 }));
    boxes.forEach((b, i) => { E.tw(b, .45, { o: [0, 1], x: [-80, 0] }, 'back', .4 + i * .5); E.sfx('slide', { delay: .4 + i * .5 }); });
    E.wait(2.6);
    let L = E.say('hat', 'でも、悪い結論でも、事実の確認や責任の整理には時間がかかる。', { wait: false });
    leaps.forEach((n, i) => { E.tw(n, .3, { o: [0, 1], s: [1.8, 1] }, 'in2', L.dur * (.35 + i * .2)); E.sfx('stamp', { delay: L.dur * (.35 + i * .2) + .25, gain: .55 }); });
    E.at(L.end);
    L = E.say('hat', '期限が決まっただけじゃ、①から④は、何ひとつ証明できない。', { wait: false, yomi: '期限が決まっただけじゃ、いちから、よんは、何ひとつ証明できない。' });
    boxes.slice(1).forEach((b, i) => E.tw(b, .4, { bright: .55, s: .97 }, 'out', L.dur * .5 + i * .1));
    E.at(L.end);
    E.say('hat', '大事なのは、強気か弱気かじゃない。', { gap: .15 });
    E.say('hat', '同じ事実から何通りも読めるなら、まだ結論を決めないことだ。');
    E.wait(.3);
  });

  /* ============================================================ S7 「失望売り＝買い増しチャンス」 */
  P.phoneScene((ph, sc) => {
    const posts = P.sns(ph, [
      { name: 'ホールド太郎', handle: '@hold', icon: 'ホ', color: '#8e7cc3', text: '再延期にはガッカリ……。<br>でも、失望売りは天からの<br>買い増しチャンスかも', likes: 64, h: 260 },
    ]);
    P.note(sc.root, IMAGE_NOTE, { x: 1330, y: 30, size: 22 });
    E.tw(posts[0], .45, { o: [0, 1], y: [40, 0] }, 'back', .8); E.sfx('pop', { delay: .8 });
    P.look(sc.cam, { s: 1.5, cx: 960, cy: 400, dur: 1.4, delay: .5 });
    E.wait(1.3);
    E.narr('再延期のあと、こんな声も見かけた。');
    E.wait(.5);
  }, { name: 'sns830', wait: 0, zoom: false });

  E.scene({ name: 'room_night' }, sc => {
    const g = sc.cam;
    E.bgm('sad', { fadeIn: 1.0, gain: .8 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { hi: 0 });
    const bull = E.actor(g, 'bull', { x: 760, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.0);
    E.tw(sc.cam, 8, { s: [1.02, 1.1], x: [0, -60] }, 'linear');
    E.wait(.6);
    E.say('bull', '下がったところは……押し目。', { talk: bull, talkAmp: 2, yomi: '下がったところは、押し目。' });
    E.tw(R.photo, .5, { s: 1.2 }, 'back');
    E.say('bull', '師匠なら、きっと買うよね。', { talk: bull, talkAmp: 2 });
    E.tw(R.photo, .4, { s: 1 }, 'out');
  });

  P.phoneScene((ph, sc) => {
    const od = P.order(ph);
    E.show(od, .3, .7);
    E.sfx('cash', { delay: .8 });
    E.wait(1.0);
    E.narr('私は、少しだけ買い増した。');
    E.wait(.6);
  }, { name: 'order', wait: 0, zoom: false });

  E.scene({ name: 'lair_buy' }, sc => {
    const g = sc.cam;
    E.bgm('villain', { fadeIn: .4, gain: .85 });
    const L = P.lair(g, { faces: ['smirk', 'scheme', 'anxious'] });
    const rows = P.board(L.screen, '適時開示 ｜ エスポア（3260）', ROWS);
    rows[0].ini({ o: 1 }); rows[1].ini({ o: 1 });
    E.breathe(L.baron, .008, 1.5);
    L.pigs.forEach((p, i) => E.breathe(p, .012, 2.3, i));
    P.look(sc.cam, { s: 1.3, cx: 1685, cy: 330, dur: .01 });
    E.say('eve', 'ねえ、あのブルって子、買い増ししたみたいだよ〜。', { talk: L.call, talkAmp: 3, delay: .3 });
    P.look(sc.cam, { s: 1.2, cx: 380, cy: 720, dur: .8 });
    E.say('hat', '買い場かどうかは、値段だけじゃ決まらない。', { talk: L.hat, delay: .2, yomi: 'かいばかどうかは、値段だけじゃ決まらない。' });
  });

  E.scene({ name: 'checklist' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '「買い場」と言う前に、確かめること', 60);
    E.show(tt, .4);
    const items = P.checklist(g, ['最終報告が、有利になる根拠は？', '監査意見は、解消できる？', '上場廃止の審査を、通れる？', '外れたら、損はどこまで？'], { x: 360, y: 180, w: 1200, rowH: 140, size: 46 });
    items.forEach((n, i) => { E.tw(n, .4, { o: [0, 1], x: [-60, 0] }, 'back', .3 + i * .25); E.sfx('slide', { delay: .3 + i * .25 }); });
    E.wait(1.4);
    let L = E.say('hat', '最終報告が有利になる根拠は？　監査意見は？　取引所の審査は？', { wait: false, yomi: '最終報告が、有利になる根拠は？監査意見は？取引所の審査は？' });
    [0, 1, 2].forEach(i => { E.pop(items[i].q, .35, L.dur * (.2 + i * .28)); E.sfx('buzz', { delay: L.dur * (.2 + i * .28), gain: .3 }); });
    E.at(L.end);
    L = E.say('hat', 'そして、外れた時に、どこまで損をするか。', { wait: false });
    E.pop(items[3].q, .35, L.dur * .5); E.sfx('buzz', { delay: L.dur * .5, gain: .35 });
    const st = E.div(g, { left: 1380, top: 760, padding: '10px 30px 12px', borderRadius: 14, border: '8px solid #e0353f', color: '#e0353f', background: 'rgba(255,255,255,.9)', font: '900 54px/1.2 Zen', whiteSpace: 'nowrap' }, '根拠は？').ini({ o: 0, r: -10 });
    P.stampIn(st, L.dur * .85);
    E.at(L.end + .4);
  });

  E.scene({ name: 'seesaw' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, 'リスクとリターンは、つり合っている？', 60);
    E.show(tt, .4);
    const beam = P.seesaw(g, { x: 960, y: 700, w: 1400, left: '上がるかも<br><span style="font-size:30px">（期待）</span>', right: '外れた時の損<br><span style="font-size:30px">（上場廃止なら深い）</span>' });
    E.pop(beam.l, .4, .4); E.sfx('pop', { delay: .4 });
    E.pop(beam.r, .4, .9); E.sfx('pop', { delay: .9 });
    E.wait(1.3);
    let L = E.say('hat', '「安くなった」は、買う理由じゃない。', { wait: false, yomi: '安くなった、は、買う理由じゃない。' });
    E.at(L.end);
    L = E.say('hat', '上場が続くかどうかが結果しだいの時、', { wait: false, gap: .1 });
    E.tw(beam, 1.2, { r: [0, 9] }, 'bounce', L.dur * .4); E.sfx('footstep', { delay: L.dur * .4 + .5, gain: .8 });
    E.tw(beam.r, .6, { s: 1.12 }, 'back', L.dur * .5);
    E.at(L.end);
    E.say('hat', '外れた時の損は、いつもの決算よりずっと深くなる。');
    E.wait(.4);
  });

  /* ============================================================ S8 男爵 */
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .6 });
    const C = P.closeup(g, CH('baron_face_big'), { bg: 'radial-gradient(ellipse at 50% 40%, #4c1820, #140707)', panelBg: 'linear-gradient(180deg,#2c0f14,#120607)', imgH: 1020 });
    E.tw(C.img, 9, { s: [1, 1.1] }, 'linear');
    E.particles(g, { n: 40, kind: 'ember', color: '#ff5a4a', area: [0, 0, W, H], speed: .7, seed: 13 });
    E.sfx('heartbeat', { delay: .2 });
    E.wait(.7);
    E.say('baron', '……「押し目」、か。', { talk: C.img, talkAmp: 1.5, yomi: '押し目、か。', gap: .5 });
    const L = E.say('baron', '懐かしい言葉だ。', { talk: C.img, talkAmp: 1.5, wait: false });
    E.flash('#ff2a2a', .5, .3, L.dur * .6);
    E.sfx('dun', { delay: L.dur * .6, gain: .7 });
    E.at(L.end + .5);
    E.tw(C.img, .45, { s: 1.6, blur: 24, o: 0 }, 'in');
    E.sfx('whoosh_big', { gain: .8 });
    E.wait(.45);
  });

  /* ============================================================ S9 夜の部屋 */
  E.scene({ name: 'spell' }, sc => {
    const g = sc.cam;
    E.bgm('sad', { fadeIn: 1.0, gain: .8 });
    P.nightBg(g);
    // 「延期」の文字が、光る「安心」の呪文に変わっていく
    const w1 = E.div(g, { left: 0, top: 330, width: W, textAlign: 'center', font: '900 180px/1.2 Zen', color: '#f3e6c8', textShadow: '0 0 30px rgba(255,216,74,.5)' }, '延期').ini({ o: 0 });
    const w2 = E.div(g, { left: 0, top: 330, width: W, textAlign: 'center', font: '900 180px/1.2 Zen', color: '#ffd84a', textShadow: '0 0 40px rgba(255,216,74,.9)' }, '安心').ini({ o: 0 });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [300, 150, 1320, 600], speed: .5, seed: 14 });
    E.show(w1, .6, .2);
    E.wait(.6);
    const L = E.narr('延期という言葉は、いつの間にか、私を安心させる呪文になっていた。', { wait: false });
    E.tw(w1, .8, { o: 0, blur: 12, s: 1.1 }, 'inOut', L.dur * .5);
    E.tw(w2, .8, { o: [0, 1], blur: [12, 0], s: [.9, 1] }, 'inOut', L.dur * .55);
    E.sfx('shine', { delay: L.dur * .55, gain: .5 });
    E.at(L.end + 1.0);
  });

  /* ============================================================ S10 次回予告 */
  E.trans('fade', { dur: .8, color: '#000' });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #3a2c24 0%, #1d1612 75%, #120d0a 100%)' });
    const items = [['8/20', '報告書の提出を延期'], ['8/30', '委員辞任・再延期'], ['9/15', '新しい期限'], ['9/16', '？']];
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
    const st = P.sticky(g, '第4章<br>審判の日', { x: 1440, y: 110, w: 380, h: 250, rot: 5, size: 46 });
    P.slap(st, 2.2);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.8);
    E.sfx('snort', { delay: 3.0 });
    E.wait(3.4);
    E.say('pig', 'ブヒッ。次は、いよいよ審判の日だブー。', { talk: pig, talkAmp: 5 });
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
