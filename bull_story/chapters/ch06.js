// 第6章「信じる者は救われる？」（2026年9月18日の夜〜）
// 台本: story/06_第6章_信じる者は救われる.md　元資料 p19〜23
// チャットの声は要約（名前は架空）。投稿者の心理は決めつけない。ブルちゃんの取得単価は物語上の設定
'use strict';
E.chapter('06');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const DISCLAIMER = 'この物語はフィクションです　｜　エスポア（3260）の事実関係は公開資料に基づきます　｜　投資助言ではありません';
  const CHAT_NOTE = '※会話は要約したイメージです（名前は架空）';

  /* ============================================================ S0 アバン：眠らないチャット */
  E.scene({ name: 'avant', bg: '#0f152c' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: 1.5, gain: .9 });
    P.nightBg(g);
    const note = P.note(sc.root, DISCLAIMER, { x: 40, y: 30, size: 22, dark: true }).ini({ o: 0 });
    E.show(note, .6, .4);
    // 通知が次々に積み重なる
    const msgs = ['大株主は売らないって！', '浮動株が減る', '何か次の手があるはず', 'MBO？', 'TOB？', '買い取りも？', '信じてる', '最後まで持つ'];
    const ns = msgs.map((t, i) => E.div(g, {
      left: [140, 760, 1340][i % 3] + (i % 2) * 30, top: 150 + Math.floor(i / 3) * 220 + (i % 2) * 24, padding: '18px 30px', borderRadius: 26,
      background: 'rgba(255,255,255,.93)', font: '900 40px/1.3 Zen', color: '#262236', whiteSpace: 'nowrap', boxShadow: '0 12px 24px rgba(0,0,0,.45)',
    }, `<span style="color:#e0457b;margin-right:12px">●</span>${t}`).ini({ o: 0, r: -3 + (i % 3) * 3 }));
    ns.forEach((n, i) => { E.pop(n, .35, .6 + i * .32, .5); E.sfx('notify', { delay: .6 + i * .32, gain: .45 }); E.float(n, 6, 1.4 + (i % 3) * .3, i); });
    E.tw(sc.cam, 9, { s: [1, 1.07] }, 'linear');
    E.wait(2.6);
    E.narr('9月18日の夜。チャットは、眠らなかった。');
    E.hide(note, .5);
    E.wait(.6);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編', catchCopy: '〜 期待が事実を追い越すとき 〜', dur: 4.6 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 6, title: '信じる者は救われる？', sub: '2026年9月18日の夜〜', dur: 3.4 });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 「売らない」が「救済」に変わるまで */
  E.scene({ name: 'chat' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .8, gain: .75 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'linear-gradient(180deg,#1b2446,#0f152c)' });
    const win = P.chat(g, { x: 360, y: 50, w: 1200, h: 780, title: 'オープンチャット（夜）' });
    E.from(win, { y: 60 }, .5, 0, 'quint');
    P.note(sc.root, CHAT_NOTE, { x: 1300, y: 860, size: 22, dark: true });
    const msgs = [
      ['メンバーA', '大株主は売らないって！', '#e0a04a'],
      ['メンバーB', '浮動株が減るね', '#6a9bd8'],
      ['メンバーC', '何か次の手があるはず', '#7cc29a'],
      ['メンバーD', 'MBO？TOB？買い取りもあるかも？', '#c27cb8'],
    ].map(([n, t, c], i) => P.chatMsg(win, { name: n, text: t, y: 100 + i * 165, color: c, size: 36 }));
    msgs.forEach((m, i) => { E.tw(m, .4, { o: [0, 1], y: [30, 0] }, 'back', .5 + i * .8); E.sfx('pop', { delay: .5 + i * .8 }); });
    E.wait(3.9);
  });

  E.scene({ name: 'stairs' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '「売らない」が「救済」に変わるまで', 40);
    E.show(tt, .3);
    const steps = [
      ['大株主は、市場では売らない', '元の投稿', '#17915a'],
      ['浮動株が減る', '', '#2b68d8'],
      ['何か次の手がある', '', '#7a5ad8'],
      ['MBO・TOB・買い取りがあるかも', '', '#e0457b'],
    ];
    const S = steps.map(([t, tag, c], i) => {
      const n = E.div(g, { left: 140 + i * 230, top: 650 - i * 150, width: 860, height: 120, borderRadius: 20, background: '#fffdf8', borderLeft: `18px solid ${c}`, display: 'flex', alignItems: 'center', paddingLeft: 30, font: '900 44px/1.2 Zen', color: '#262236', whiteSpace: 'nowrap', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
        `${t}${tag ? `<span style="margin-left:18px;padding:4px 14px;border-radius:10px;background:${c};color:#fff;font:800 24px/1.2 Round">${tag}</span>` : ''}`).ini({ o: 0 });
      return n;
    });
    // 確かめていない前提の数（0 → 3）
    const cnt = E.div(g, { left: 1290, top: 620, width: 520, height: 140, borderRadius: 22, background: 'rgba(224,53,63,.16)', border: '4px solid #e0353f', boxShadow: '0 10px 20px rgba(0,0,0,.3)' },
      '<div style="position:absolute;left:30px;top:0;height:132px;display:flex;align-items:center;font:900 34px/1.3 Zen;color:#ffb3b3">確かめていない<br>前提の数</div>').ini({ o: 0 });
    const num = E.text(cnt, { left: 330, top: 4, width: 160, textAlign: 'center', font: '900 110px/1.15 Noto', color: '#ff6b6b' }, '0');
    const bump = (k, delay) => { E.set(num, { line: E.line(String(k)) }, delay); E.tw(num, .35, { s: [1.6, 1] }, 'back', delay); E.sfx('pop', { delay }); };
    const dist = P.arrow(g, { x1: 200, y1: 790, x2: 1700, y2: 790, color: '#ffd84a', sw: 8, head: 28 });
    const dl = E.div(g, { left: 1300, top: 800, width: 500, textAlign: 'right', font: '800 28px/1.3 Round', color: '#ffd84a' }, '元の投稿から、どんどん離れる').ini({ o: 0 });
    E.tw(S[0], .45, { o: [0, 1], x: [-60, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.show(cnt, .4, .5);
    E.wait(.8);
    E.say('hat', '元の投稿は、「大株主は、市場では売らない」。それだけだった。', { yomi: '元の投稿は、大株主は、市場では売らない。それだけだった。' });
    let L = E.say('hat', 'それが「浮動株が減る」になり、「何か次の手がある」になり、', { wait: false, gap: .1, yomi: 'それが、浮動株が減る、になり、何か次の手がある、になり、' });
    E.tw(S[1], .45, { o: [0, 1], x: [-60, 0] }, 'back', .2); E.sfx('slide', { delay: .2 }); bump(1, .6);
    E.tw(S[2], .45, { o: [0, 1], x: [-60, 0] }, 'back', L.dur * .55); E.sfx('slide', { delay: L.dur * .55 }); bump(2, L.dur * .55 + .4);
    E.at(L.end);
    L = E.say('hat', '最後は「MBOやTOBがあるかも」になった。', { wait: false, yomi: '最後は、MBOやTOBがあるかも、になった。' });
    E.tw(S[3], .45, { o: [0, 1], x: [-60, 0] }, 'back', .2); E.sfx('slide', { delay: .2 }); bump(3, .6); E.sfx('buzz', { delay: .7, gain: .3 });
    E.at(L.end);
    L = E.say('hat', '後ろに行くほど、元の投稿から離れて、確かめていない前提が増えていく。', { wait: false });
    P.drawArrow(dist, 1.2, .2); E.show(dl, .4, 1.2);
    E.at(L.end + .4);
  });

  /* ============================================================ S3 「信じる者は救われる」 */
  E.scene({ name: 'believe_chat' }, sc => {
    const g = sc.cam;
    E.bgm('sad', { fadeIn: .8, gain: .75 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'linear-gradient(180deg,#1b2446,#0f152c)' });
    const win = P.chat(g, { x: 360, y: 50, w: 1200, h: 780, title: 'オープンチャット（夜）' });
    P.note(sc.root, CHAT_NOTE, { x: 1300, y: 860, size: 22, dark: true });
    const msgs = [['メンバーE', '最後まで優しい……', '#e0a04a'], ['メンバーF', '何かありそう', '#6a9bd8'], ['メンバーG', '信じる者は救われる', '#c27cb8']]
      .map(([n, t, c], i) => P.chatMsg(win, { name: n, text: t, y: 120 + i * 200, color: c, size: 40 }));
    msgs.forEach((m, i) => { E.tw(m, .4, { o: [0, 1], y: [30, 0] }, 'back', .4 + i * .8); E.sfx('pop', { delay: .4 + i * .8 }); });
    E.wait(2.4);
    E.particles(g, { n: 30, kind: 'sparkle', color: '#ffe9a8', area: [360, 400, 1200, 400], speed: .5, seed: 41 });
  });

  E.scene({ name: 'eve_trust' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('eve_e_shy'), { fit: 'cover', pos: '50% 30%', bg: 'linear-gradient(180deg,#2c1316,#170909)' });
    E.from(C.img, { s: 1.06 }, .4);
    E.wait(.2);
    E.say('eve', 'みんな、あの人のこと、すごく信じてるんだね〜。', { talk: C.img, talkAmp: 2, yomi: 'みんな、あの人のこと、すごく信じてるんだねー。' });
    E.wait(.2);
  });

  E.scene({ name: 'four_w' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    const { hat, call, bd } = P.boardScene(g, ['normal', 'smile', 'surprise']);
    E.div(bd, { left: 0, top: 36, width: 1020, textAlign: 'center', font: '900 46px/1.2 Zen', color: '#2a2430' }, '信頼の前に、確かめること');
    const qs = ['誰が', '何を', 'いつ', 'いくらで'].map((t, i) => E.div(bd, { left: 60 + i * 230, top: 150, width: 200, height: 200, borderRadius: 26, background: ['#2b68d8', '#17915a', '#d9822b', '#b3122b'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 54px/1.2 Zen', color: '#fff', boxShadow: '0 10px 20px rgba(0,0,0,.25)' }, t).ini({ o: 0 }));
    const pub = E.div(bd, { left: 60, top: 400, width: 900, height: 130, borderRadius: 22, background: '#f3eee4', border: '5px dashed #8a8070', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 50px/1.2 Zen', color: '#2a2430' }, 'やると「公表」した？').ini({ o: 0 });
    E.wait(.6);
    E.say('hat', '人を信じるのも、感謝するのも、悪いことじゃない。それは人間関係の話だ。', { talk: hat, talkAmp: 2 });
    E.say('hat', 'でも投資では、別に確かめることがある。', { talk: hat, talkAmp: 2, gap: .15 });
    const L = E.say('hat', '誰が、何を、いつ、いくらで、やると発表したのか。', { talk: hat, talkAmp: 2, wait: false });
    qs.forEach((q, i) => { E.pop(q, .35, .1 + i * L.dur * .17, .5); E.sfx('pop', { delay: .1 + i * L.dur * .17 }); });
    E.tw(pub, .45, { o: [0, 1], y: [30, 0] }, 'back', L.dur * .78); E.sfx('stamp', { delay: L.dur * .78 + .2, gain: .5 });
    E.at(L.end + .4);
  });

  E.scene({ name: 'neq' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '似ているようで、ちがうこと', 40);
    E.show(tt, .3);
    const pairs = [
      ['大株主が売らない', '個人株主を買い取る'],
      ['有名人が残る', '自分の損失が回復する'],
      ['仲間が信じている', '新しい証拠が増えた'],
    ];
    const rows = pairs.map(([a, b], i) => {
      const y = 160 + i * 220;
      const l = E.div(g, { left: 140, top: y, width: 700, height: 160, borderRadius: 24, background: '#fffdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 50px/1.2 Zen', color: '#262236', whiteSpace: 'nowrap', boxShadow: '0 12px 24px rgba(0,0,0,.35)' }, `「${a}」`).ini({ o: 0 });
      const ne = E.div(g, { left: 880, top: y + 20, width: 160, textAlign: 'center', font: '900 110px/1 Zen', color: '#ffd84a', textShadow: '0 0 20px rgba(255,216,74,.5)' }, '≠').ini({ o: 0 });
      const r = E.div(g, { left: 1080, top: y, width: 700, height: 160, borderRadius: 24, background: '#fdecec', border: '5px solid #c62828', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 50px/1.2 Zen', color: '#a31f1f', whiteSpace: 'nowrap', boxShadow: '0 12px 24px rgba(0,0,0,.35)' }, `「${b}」`).ini({ o: 0 });
      return [l, ne, r];
    });
    E.wait(.4);
    const lines = [
      ['大株主が売らないことと、個人の株を買い取ることは、別の話だ。', null],
      ['有名人が残ることと、自分の損が戻ることも。', null],
      ['仲間が信じていることと、新しい証拠が増えたことも、違う。', null],
    ];
    lines.forEach(([t], i) => {
      const L = E.say('hat', t, { wait: false });
      const [l, ne, r] = rows[i];
      E.tw(l, .4, { o: [0, 1], x: [-60, 0] }, 'back', .1); E.sfx('slide', { delay: .1 });
      E.pop(ne, .35, L.dur * .45, .3); E.sfx('pop', { delay: L.dur * .45 });
      E.tw(r, .4, { o: [0, 1], x: [60, 0] }, 'back', L.dur * .5);
      E.at(L.end);
    });
    E.wait(.5);
  });

  /* ============================================================ S4 ブルちゃんの含み損 */
  E.trans('fade', { dur: .8, color: '#000' });
  E.scene({ name: 'account' }, sc => {
    const g = sc.cam;
    E.bgm('sad', { fadeIn: 1.0, gain: .8 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '保有中'], ['・・・', ''], ['・・・', '']], { hi: 0 });
    const bull = E.actor(g, 'bull', { x: 760, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 1.9);
    P.look(sc.cam, { s: 1.25, cx: 1100, cy: 520, dur: 3.5 });
    E.wait(.7);
    E.say('bull', '私の取得単価は、700円……。', { talk: bull, talkAmp: 2, yomi: '私の取得単価は、700円。' });
  });

  E.scene({ name: 'account_screen' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: '#0d1220' });
    const win = E.div(g, { left: 260, top: 70, width: 1400, height: 720, borderRadius: 26, background: '#f4f6f9', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,.6)' });
    E.div(win, { left: 0, top: 0, width: 1400, height: 90, background: '#2a3a5a' }, '<div style="position:absolute;left:40px;top:0;font:900 36px/90px Zen;color:#fff">保有銘柄（ブルちゃんの口座・物語上の設定）</div>');
    const row = (y, k, v, c = '#22252b') => E.div(win, { left: 80, top: y, width: 1240, height: 110, borderBottom: '2px solid #e2e6ee', display: 'flex', alignItems: 'center', font: '800 40px/1 Round', color: '#6b7280' },
      `<div style="width:420px">${k}</div><div style="font:900 64px/1 Noto;color:${c}">${v}</div>`);
    row(130, '銘柄', '<span style="font-family:Zen">エスポア（3260）</span>');
    row(250, '取得単価', '700円');
    row(370, '現在値（9/18 終値）', '70円');
    const pct = E.div(win, { left: 80, top: 500, width: 1240, height: 160, display: 'flex', alignItems: 'center', font: '800 40px/1 Round', color: '#6b7280' }, '<div style="width:420px">評価損益率</div>');
    const num = E.text(pct, { left: 420, top: 30, font: '900 110px/1 Noto', color: '#c62828' }, '0.00%');
    const formula = E.div(g, { left: 0, top: 820, width: W, textAlign: 'center', font: '800 34px/1.2 Noto', color: '#e8dcc0' }, '(70÷700−1)×100 ＝ −90.00％').ini({ o: 0 });
    // 0% から −90% へ数える
    num.ini({ v: 0 });
    num.hook(p => { const v = p.v; const key = v.toFixed(2); if (num.c.key === key) return; num.c.key = key; num.el.textContent = (v < 0 ? '−' : '') + Math.abs(v).toFixed(2) + '%'; });
    E.tw(num, 2.0, { v: [0, -90] }, 'out', .8);
    E.sfx('drop', { delay: .8, gain: .6 });
    E.show(formula, .5, 2.6);
    E.wait(2.8);
    E.narr('マイナス90％。画面の数字を、私はまっすぐ見られなかった。', { yomi: 'マイナス90パーセント。画面の数字を、私はまっすぐ見られなかった。' });
    E.wait(.4);
  });

  E.scene({ name: 'costs' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    const { hat, call, bd } = P.boardScene(g, ['anxious', 'cry', 'normal']);
    E.div(bd, { left: 0, top: 36, width: 1020, textAlign: 'center', font: '900 44px/1.2 Zen', color: '#2a2430' }, '70円で見ると（取得単価べつ）');
    const rows = [['500円', '(70÷500−1)×100', '−86.00%'], ['700円', '(70÷700−1)×100', '−90.00%'], ['1,000円', '(70÷1,000−1)×100', '−93.00%']].map(([a, f, r], i) =>
      E.div(bd, { left: 60, top: 140 + i * 130, width: 900, height: 110, borderRadius: 18, background: '#f3eee4', display: 'flex', alignItems: 'center', font: '800 30px/1 Noto', color: '#6b6252' },
        `<div style="width:220px;padding-left:30px;font:900 44px/1 Noto;color:#262230">${a}</div><div style="width:380px">${f}</div><div style="width:270px;text-align:right;font:900 54px/1 Noto;color:#c62828">${r}</div>`).ini({ o: 0 }));
    const heart = E.div(bd, { left: 60, top: 560, width: 900, height: 150, borderRadius: 22, background: '#fde7ef', border: '5px solid #e0457b', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: '900 44px/1.4 Zen', color: '#b72a5c' }, '「ここまで持ったんだから、<br>報われたい」').ini({ o: 0 });
    rows.forEach((r, i) => { E.tw(r, .4, { o: [0, 1], x: [-40, 0] }, 'back', .3 + i * .2); E.sfx('slide', { delay: .3 + i * .2 }); });
    E.wait(1.1);
    E.say('hat', 'ここ数年で買った人は、70円なら、ほとんどが大きな含み損だ。', { talk: hat, talkAmp: 2 });
    const L = E.say('hat', '損が大きいほど、「ここまで持ったんだから、報われたい」って気持ちが強くなる。', { talk: hat, talkAmp: 2, wait: false, yomi: '損が大きいほど、ここまで持ったんだから、報われたい、って気持ちが強くなる。' });
    E.pop(heart, .45, L.dur * .3, .6); E.sfx('heartbeat', { delay: L.dur * .3 });
    E.at(L.end);
    E.say('hat', 'そうなると、今の会社の価値より、昔の自分の判断を正しいと言ってくれる情報を、探しやすくなる。', { talk: hat, talkAmp: 2 });
    E.wait(.3);
  });

  /* ============================================================ S5 楽観がふくらむしくみ */
  E.scene({ name: 'biases' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '同じ立場の仲間で、楽観がふくらむ6つのしくみ', 34);
    E.show(tt, .3);
    P.note(sc.root, '※特定の人の心理を診断する話ではありません', { x: 1300, y: 830, size: 22, dark: true });
    const ICONS = {
      fuk: '<path d="M30 30 L70 70 M70 30 L30 70" stroke="#fff" stroke-width="10" stroke-linecap="round"/><circle cx="50" cy="50" r="38" fill="none" stroke="#fff" stroke-width="7"/>',
      kak: '<circle cx="42" cy="42" r="24" fill="none" stroke="#fff" stroke-width="9"/><path d="M60 60 L84 84" stroke="#fff" stroke-width="11" stroke-linecap="round"/><path d="M32 42 L40 50 L54 34" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>',
      sun: '<path d="M30 18 L70 18 L52 50 L70 82 L30 82 L48 50Z" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><path d="M40 74 L60 74 L50 62Z" fill="#fff"/>',
      sha: '<circle cx="30" cy="34" r="10" fill="#fff"/><circle cx="50" cy="28" r="12" fill="#fff"/><circle cx="70" cy="34" r="10" fill="#fff"/><path d="M14 80 Q16 50 30 50 Q44 50 46 80Z M34 80 Q36 44 50 44 Q64 44 66 80Z M54 80 Q56 50 70 50 Q84 50 86 80Z" fill="#fff"/>',
      ken: '<path d="M20 70 L26 34 L40 52 L50 24 L60 52 L74 34 L80 70Z" fill="#fff"/><rect x="20" y="74" width="60" height="10" rx="4" fill="#fff"/>',
      shu: '<path d="M20 50 L44 50 M80 50 L56 50" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M36 38 L48 50 L36 62 M64 38 L52 50 L64 62" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="50" r="40" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="6 8"/>',
    };
    const cards = [
      ['fuk', '認知的不協和', '「自分は正しい」と「大損した」を同時に持てない', '「まだ終わっていない」が楽になる', '#7a5ad8'],
      ['kak', '確証バイアス', '自分のシナリオに合う情報だけ重く見る', '「売らない」は拾い、上場廃止・70円は小さく見る', '#2b68d8'],
      ['sun', 'サンクコスト', 'もう失ったお金と時間に引っ張られる', '「ここまで持ったから最後まで」', '#d9822b'],
      ['sha', '社会的証明', 'みんな同じことをしていると安心する', '「私も持つ」「買い増す」が根拠に見える', '#17915a'],
      ['ken', '権威バイアス', '有名人の言葉を、自分の確認より優先する', '書いていない意味まで補ってしまう', '#b3122b'],
      ['shu', '集団極性化', '似た立場が集まると、意見が強くなる', '「何かある」が「MBO・TOB」に', '#e0457b'],
    ].map(([ic, name, def, obs, c], i) => {
      const x = 100 + (i % 3) * 580, y = 130 + Math.floor(i / 3) * 350;
      const n = E.div(g, { left: x, top: y, width: 560, height: 320, borderRadius: 26, background: '#fffdf8', overflow: 'hidden', boxShadow: '0 16px 30px rgba(0,0,0,.4)' }).ini({ o: 0 });
      E.div(n, { left: 0, top: 0, width: 560, height: 96, background: c },
        `<svg viewBox="0 0 100 100" style="position:absolute;left:22px;top:10px;width:76px;height:76px">${ICONS[ic]}</svg><div style="position:absolute;left:112px;top:0;font:900 40px/96px Zen;color:#fff;white-space:nowrap">${name}</div>`);
      E.div(n, { left: 26, top: 116, width: 508, font: '800 26px/1.5 Round', color: '#3d3540' }, def);
      E.div(n, { left: 26, top: 212, width: 508, font: '900 26px/1.5 Zen', color: c }, `→ ${obs}`);
      n.el.style.transformOrigin = '50% 50%';
      return n;
    });
    E.wait(.6);
    const lines = [
      ['eve', '認知的不協和。「自分は正しい」と「大損した」は、同時に持てない。', '認知的不協和。自分は正しい、と、大損した、は、同時に持てない。'],
      ['hat', 'だから「まだ終わっていない」って物語が、楽になる。', 'だから、まだ終わっていない、って物語が、楽になる。'],
      ['eve', '確証バイアス。自分のシナリオに合う情報だけ、重く見ちゃう。', null],
      ['hat', '「売らない」は拾うのに、上場廃止や70円の引けは、小さく見える。', '売らない、は拾うのに、上場廃止や70円の引けは、小さく見える。'],
      ['eve', 'サンクコスト。もう失ったお金や時間に、引っ張られる。', null],
      ['hat', '「ここまで持ったんだから、最後まで」ってね。', 'ここまで持ったんだから、最後まで、ってね。'],
      ['eve', '社会的証明。みんなが同じことをしてると、安心しちゃう。', null],
      ['hat', '「私も持つ」「買い増しする」が、新しい根拠みたいに見えてくる。', '私も持つ、買い増しする、が、新しい根拠みたいに見えてくる。'],
      ['eve', '権威バイアス。有名な人の言葉を、自分で確かめるより優先しちゃう。', null],
      ['hat', '書いていない意味まで、補ってしまうのさ。', null],
      ['eve', '集団極性化。似た立場の人が集まると、意見がどんどん強くなる。', null],
      ['hat', '「何かある」が、いつの間にか「MBOだ、TOBだ」になる。', '何かある、が、いつの間にか、MBOだ、TOBだ、になる。'],
    ];
    lines.forEach(([who, t, y], i) => {
      const L = E.say(who, t, { wait: false, yomi: y || undefined, gap: i % 2 ? .3 : .12 });
      if (i % 2 === 0) {
        const c = cards[i / 2];
        E.tw(c, .5, { o: [0, 1], sx: [0, 1], s: [.8, 1] }, 'back', .05);
        E.sfx('page', { delay: .05 });
        cards.forEach((o, j) => { if (j < i / 2) E.tw(o, .3, { bright: .55, s: .97 }, 'out', .05); });
      }
      E.at(L.end);
    });
    cards.forEach(o => E.tw(o, .4, { bright: 1, s: 1 }, 'out'));
    E.wait(.6);
  });

  E.scene({ name: 'not_malice' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('hat_e_normal'), { fit: 'cover', pos: '50% 40%', bg: 'linear-gradient(180deg,#2c1316,#170909)' });
    E.tw(C.img, 10, { s: [1.02, 1.07] }, 'linear');
    E.say('hat', 'これは悪意じゃない。人の心が、そういうふうにできてるってことだ。', { talk: C.img, talkAmp: 2 });
    E.say('hat', '同じ立場の仲間だけで答え合わせをすると、楽観は、どんどんふくらむ。', { talk: C.img, talkAmp: 2 });
    E.wait(.3);
  });

  /* ============================================================ S6 AIに、どう聞く？ */
  // 架空のAIアシスタントの画面
  const aiWin = (g, title = 'AIアシスタント（架空の画面）') => {
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 40%, #1a2240 0%, #0b0f1e 80%)' });
    const win = E.div(g, { left: 200, top: 50, width: 1520, height: 770, borderRadius: 28, background: '#141a2a', border: '3px solid #2d3550', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,.6)' });
    E.div(win, { left: 0, top: 0, width: 1520, height: 76, background: '#1c2338', borderBottom: '2px solid #2d3550' },
      `<div style="position:absolute;left:30px;top:0;font:900 30px/76px Zen;color:#cfd8ef">${title}</div>`);
    return win;
  };
  const userBubble = (win, y, text, h = 110) => {
    const b = E.div(win, { left: 520, top: y, width: 960, minHeight: h, borderRadius: '28px 8px 28px 28px', background: '#2f5aa8', padding: '22px 30px', boxShadow: '0 8px 18px rgba(0,0,0,.35)' }).ini({ o: 0 });
    const tx = E.text(b, { position: 'relative', font: '800 34px/1.5 Round', color: '#fff' }, null);
    b.text = tx; b.src = text;
    return b;
  };
  const aiBubble = (win, y, h = 200) => {
    const b = E.div(win, { left: 40, top: y, width: 1200, minHeight: h, borderRadius: '8px 28px 28px 28px', background: '#232a3d', padding: '22px 30px 22px 100px', boxShadow: '0 8px 18px rgba(0,0,0,.35)' }).ini({ o: 0 });
    E.div(b, { left: 24, top: 22, width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#27b4c2,#7a5ad8)', textAlign: 'center', font: '900 26px/56px Zen', color: '#fff' }, 'AI');
    const tx = E.text(b, { position: 'relative', font: '800 32px/1.55 Round', color: '#e3e9f8' }, null);
    b.text = tx;
    return b;
  };
  const typeIn = (b, src, cps, delay = 0) => {
    E.show(b, .25, delay);
    const keep = E.T; E.T += delay + .25;
    const end = E.type(b.text, src, { cps });
    const n = Math.floor((end - E.T) * 9);
    for (let i = 0; i < n; i++) E.sfx('type', { delay: i / 9, gain: .35 });
    E.T = keep;
    return end;
  };

  E.scene({ name: 'ai_ask' }, sc => {
    const g = sc.cam;
    E.bgm('daily', { fadeIn: .8, gain: .7 });
    const win = aiWin(g);
    const q = userBubble(win, 110, 'MBOやTOBで助かる可能性を、詳しく解説して');
    const a = aiBubble(win, 270, 420);
    E.wait(.4);
    E.narr('その夜、私はAIに聞いてみた。', { gap: .1 });
    const e1 = typeIn(q, q.src, 14, 0);
    E.at(e1 + .5);
    const ans = 'MBOやTOBが行われれば、少数株主の株が一定の価格で買い取られる可能性があります。「大株主は市場で売らない」という発言は、その前ぶれと読むこともできます。浮動株が少ない銘柄では、買い取りの条件が有利になる場合も……';
    const e2 = typeIn(a, ans, 34, 0);
    E.at(e2 + .8);
  });

  E.scene({ name: 'bull_ai_hope' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_smile'), { burst: { c1: '#eef3ff', c2: '#dfe8ff', spin: 6 }, imgH: 820, panelBg: 'linear-gradient(180deg,#f6f9ff,#e3ebfb)' });
    E.from(C.img, { s: .9, y: 30 }, .35, 0, 'back');
    E.sfx('sparkle', { gain: .4 });
    E.wait(.3);
    E.say('bull', 'やっぱり、可能性はあるんだ……！', { talk: C.img, talkAmp: 2.5, yomi: 'やっぱり、可能性はあるんだ！' });
    E.wait(.2);
  });

  E.scene({ name: 'ai_pairs' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, 'AIへの聞き方で、答えは変わる', 34);
    E.show(tt, .3);
    E.div(g, { left: 60, top: 112, width: 830, textAlign: 'center', font: '900 36px/1 Zen', color: '#ff8a8a' }, '✕ 危険な聞き方');
    E.div(g, { left: 1000, top: 112, width: 860, textAlign: 'center', font: '900 36px/1 Zen', color: '#9ee6c0' }, '○ 確かめる聞き方');
    const pairs = [
      ['MBOやTOBで助かる可能性を、詳しく解説して', 'MBO・TOBが計画されている一次資料はある？なければ「ない」と答えて'],
      ['大株主が売らないなら、上がるよね？', '売りが減ることと、買いが足りないリスクを、分けて検証して'],
      ['この強気シナリオを、補強して', 'このシナリオを否定する証拠を先に探して。否定の条件も書いて'],
      ['みんなが期待している理由を教えて', '事実・解釈・期待の3列に分けて、根拠のない飛躍を指摘して'],
    ];
    const rows = pairs.map(([a, b], i) => {
      const y = 160 + i * 165;
      const l = E.div(g, { left: 60, top: y, width: 830, height: 140, borderRadius: 20, background: '#fdecec', border: '4px solid #c62828', display: 'flex', alignItems: 'center', padding: '0 26px', font: '800 31px/1.4 Round', color: '#7a1a1a' }, `「${a}」`).ini({ o: 0 });
      const ar = E.div(g, { left: 895, top: y + 30, width: 100, textAlign: 'center', font: '900 70px/1 Zen', color: '#ffd84a' }, '→').ini({ o: 0 });
      const r = E.div(g, { left: 1000, top: y, width: 860, height: 140, borderRadius: 20, background: '#eaf7f0', border: '4px solid #17915a', display: 'flex', alignItems: 'center', padding: '0 28px', font: '800 30px/1.45 Round', color: '#0e5a38' }, `「${b}」`).ini({ o: 0 });
      return [l, ar, r];
    });
    E.wait(.4);
    E.say('hat', '聞き方で、答えは変わる。', { gap: .15 });
    rows.forEach(([l, ar, r], i) => { E.tw(l, .35, { o: [0, 1], x: [-40, 0] }, 'back', .1 + i * .5); E.pop(ar, .3, .3 + i * .5, .5); E.tw(r, .35, { o: [0, 1], x: [40, 0] }, 'back', .4 + i * .5); E.sfx('slide', { delay: .1 + i * .5, gain: .6 }); });
    E.wait(.6);
    E.say('hat', '「助かる話を詳しく」と聞けば、AIは、それらしい物語を作ってくれる。', { yomi: '助かる話を詳しく、と聞けば、AIは、それらしい物語を作ってくれる。' });
    E.tw(rows[0][2], .35, { s: 1.04 }, 'back');
    E.say('hat', 'でも「一次資料はあるか。なければ、ないと答えて」と聞けば、答えは変わる。', { yomi: 'でも、一次資料はあるか。なければ、ないと答えて、と聞けば、答えは変わる。' });
    E.tw(rows[0][2], .3, { s: 1 }, 'out');
    E.wait(.3);
  });

  E.scene({ name: 'ai_reask' }, sc => {
    const g = sc.cam;
    const win = aiWin(g);
    const q = userBubble(win, 110, 'MBO・TOBが計画されている一次資料（会社や取引所の発表）はある？なければ「ない」と答えて', 150);
    const a = aiBubble(win, 320, 200);
    E.wait(.3);
    const e1 = typeIn(q, q.src, 18, 0);
    E.at(e1 + .5);
    const e2 = typeIn(a, '確認できる一次資料（会社や取引所の発表）は、見当たりません。現時点では「ない」と答えます。', 26, 0);
    E.at(e2 + 1.0);
  });

  E.scene({ name: 'bull_none' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_trouble'), { bg: 'linear-gradient(180deg,#1b2446,#0f152c)', panelBg: 'linear-gradient(180deg,#2a3560,#1a2244)', imgH: 820 });
    E.tw(C.img, 5, { s: [1, 1.04] }, 'linear');
    E.wait(.4);
    E.say('bull', '……ない、んだ。', { talk: C.img, talkAmp: 1.5, yomi: 'ない、んだ。', gap: .6 });
  });

  E.scene({ name: 'ai_roles' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, 'AIの正しい使い方', 50);
    E.show(tt, .3);
    const roles = [
      ['一次資料を探す', '<rect x="22" y="14" width="48" height="64" rx="6" fill="none" stroke="#fff" stroke-width="7"/><circle cx="62" cy="62" r="16" fill="#1d2942" stroke="#fff" stroke-width="7"/><path d="M73 73 L86 86" stroke="#fff" stroke-width="9" stroke-linecap="round"/>', '#2b68d8'],
      ['計算する', '<rect x="20" y="12" width="60" height="76" rx="10" fill="none" stroke="#fff" stroke-width="7"/><rect x="30" y="22" width="40" height="16" rx="3" fill="#fff"/><circle cx="36" cy="52" r="5" fill="#fff"/><circle cx="50" cy="52" r="5" fill="#fff"/><circle cx="64" cy="52" r="5" fill="#fff"/><circle cx="36" cy="70" r="5" fill="#fff"/><circle cx="50" cy="70" r="5" fill="#fff"/><circle cx="64" cy="70" r="5" fill="#fff"/>', '#17915a'],
      ['反対の証拠を集める', '<path d="M50 14 L86 80 L14 80Z" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><path d="M50 38 L50 60" stroke="#fff" stroke-width="8" stroke-linecap="round"/><circle cx="50" cy="70" r="5" fill="#fff"/>', '#b3122b'],
      ['前提を分ける', '<rect x="12" y="20" width="22" height="60" rx="5" fill="#fff"/><rect x="39" y="20" width="22" height="60" rx="5" fill="#fff" opacity=".75"/><rect x="66" y="20" width="22" height="60" rx="5" fill="#fff" opacity=".5"/>', '#d9822b'],
    ];
    const R = roles.map(([t, ic, c], i) => {
      const n = E.div(g, { left: 120 + i * 430, top: 230, width: 390, height: 420, borderRadius: 28, background: c, textAlign: 'center', boxShadow: '0 16px 30px rgba(0,0,0,.4)' }).ini({ o: 0 });
      E.svg(n, { left: 95, top: 50, width: 200, height: 200 }, '0 0 100 100', ic);
      E.div(n, { left: 0, top: 290, width: 390, textAlign: 'center', font: '900 40px/1.3 Zen', color: '#fff' }, t);
      return n;
    });
    const x = E.div(g, { left: 0, top: 700, width: W, textAlign: 'center', font: '900 40px/1.3 Zen', color: '#ff9a9a' }, '✕ 納得できる物語を作らせる').ini({ o: 0 });
    E.wait(.3);
    let L = E.say('hat', 'AIの役目は、納得できる物語を作ることじゃない。', { wait: false });
    E.show(x, .4, L.dur * .5);
    E.at(L.end);
    L = E.say('hat', '一次資料を探して、計算して、反対の証拠を集めて、前提を分けることだ。', { wait: false });
    R.forEach((n, i) => { E.pop(n, .4, .1 + i * L.dur * .22, .6); E.sfx('pop', { delay: .1 + i * L.dur * .22 }); });
    E.at(L.end + .6);
  });

  /* ============================================================ S7 男爵 */
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .6 });
    const C = P.closeup(g, CH('baron_face_big'), { bg: 'radial-gradient(ellipse at 50% 40%, #4c1820, #140707)', panelBg: 'linear-gradient(180deg,#2c0f14,#120607)', imgH: 1020 });
    E.tw(C.img, 9, { s: [1, 1.1] }, 'linear');
    E.particles(g, { n: 40, kind: 'ember', color: '#ff5a4a', area: [0, 0, W, H], speed: .7, seed: 43 });
    E.sfx('heartbeat', { delay: .2 });
    E.wait(.6);
    E.say('baron', '……信じる者は救われる、か。', { talk: C.img, talkAmp: 1.5, yomi: '信じる者は救われる、か。', gap: .5 });
    const L = E.say('baron', '昔、私も、そう言われた側だった。', { talk: C.img, talkAmp: 1.5, wait: false });
    E.tw(C.img, 1.2, { sep: [0, .6] }, 'inOut', L.dur * .5);
    E.sfx('swell', { delay: L.dur * .4, gain: .4 });
    E.at(L.end + .8);
    E.tw(C.img, .45, { s: 1.6, blur: 24, o: 0 }, 'in');
    E.sfx('whoosh_big', { gain: .8 });
    E.wait(.45);
  });

  /* ============================================================ S8 次回予告 */
  E.trans('fade', { dur: .8, color: '#000' });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .8 });
    P.sepia(g);
    const m = P.mentor(g, { x: 760, y: 1040, h: 760 });
    m.ini({ o: 0 });
    E.show(m, 1.2, .3);
    E.grain(g, .09);
    E.vignette(g, .5, '70,35,10');
    const st = P.sticky(g, '第7章<br>投げる勇気', { x: 1380, y: 130, w: 420, h: 250, rot: 5, size: 46 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.4);
    E.sfx('snort', { delay: 2.6 });
    E.wait(3.0);
    E.say('pig', 'ブヒッ。次は、ついに師匠の昔話だブー。', { talk: pig, talkAmp: 5 });
    E.unsub(.4);
    const end = E.div(g, { left: 0, top: 860, width: W, textAlign: 'center', font: '800 26px/1.5 Round', color: 'rgba(70,40,15,.9)' }, DISCLAIMER).ini({ o: 0 });
    E.show(end, .8, .5);
    const tsu = E.div(g, { left: 0, top: 700, width: W, textAlign: 'center', font: '900 64px/1.2 Zen', color: '#fff6e0', letterSpacing: '.3em', textShadow: '0 4px 12px rgba(80,40,10,.7)' }, 'つづく').ini({ o: 0 });
    E.show(tsu, .8, .9);
    E.wait(4.2);
  });
  E.bgmStop(2.5, -2.5);
  E.finish();
}
