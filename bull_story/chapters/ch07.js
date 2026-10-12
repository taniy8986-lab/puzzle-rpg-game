// 第7章「投げる勇気」（2026年9月18日〜9月25日、と師匠の昔話）
// 台本: story/07_第7章_投げる勇気.md　元資料 p27〜31・p38〜39・p51〜52
// 師匠の昔話は物語上のフィクション（「ある会社」）。元資料の個人投資家は「ある個人投資家」とし名前を出さない
'use strict';
E.chapter('07');
{
  const { W, H, rnd, lerp, clamp } = E;
  const CH = n => `assets/chara/${n}.png`;
  const DISCLAIMER = 'この物語はフィクションです　｜　エスポア（3260）の事実関係は公開資料に基づきます　｜　投資助言ではありません';
  const MASK = '#5a0a14';

  /* ============================================================ S0 アバン：誰もいない玉座の間 */
  E.scene({ name: 'avant', bg: '#140707' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: 1.5, gain: .9 });
    const L = P.lair(g, { screen: false, call: false });
    // 幹部と豚はいない。男爵だけ
    L.hat.ini({ o: 0 }); L.pigs.forEach(p => p.ini({ o: 0 }));
    E.breathe(L.baron, .008, 1.5);
    const note = P.note(sc.root, DISCLAIMER, { x: 40, y: 30, size: 22, dark: true }).ini({ o: 0 });
    E.show(note, .6, .4);
    // 手元の写真（セピア）
    const ph = E.div(g, { left: 1010, top: 560, width: 150, height: 170, borderRadius: 8, background: '#8a5a30', boxShadow: '0 12px 24px rgba(0,0,0,.5)' }).ini({ r: 8, o: 0 });
    E.img(ph, CH('mentor_photo'), { left: 10, top: 10, width: 130, height: 150, objectFit: 'cover' });
    P.look(sc.cam, { s: 1.6, cx: 1000, cy: 560, dur: 4.0, delay: .4 });
    E.show(ph, .8, 1.2);
    E.wait(3.6);
    E.say('baron', '……あれは、ずっと昔の話だ。', { talk: L.baron, talkAmp: 1.5, yomi: 'あれは、ずっと昔の話だ。' });
    E.hide(note, .5);
    E.wait(.6);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編', catchCopy: '〜 期待が事実を追い越すとき 〜', dur: 4.6 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 7, title: '投げる勇気', sub: '2026年9月18日 〜 9月25日　／　師匠の昔話', dur: 3.4 });
  E.trans('fade', { dur: .9, color: '#fff1d6' });

  /* ============================================================ S2 師匠の昔話（セピア） */
  // 右肩上がり → 延期 → 下がり続けるチャート（形はイメージ）
  const CX = { x0: 160, x1: 1180, y0: 760, y1: 220 };
  const cy = v => CX.y0 - v * (CX.y0 - CX.y1);
  const upPts = [], dnPts = [];
  for (let i = 0; i <= 30; i++) { const k = i / 30; upPts.push([lerp(CX.x0, 620, k), cy(.2 + .6 * k + (i && i < 30 ? (rnd(i * 2.1 + 3) - .5) * .08 : 0))]); }
  for (let i = 0; i <= 40; i++) { const k = i / 40; dnPts.push([lerp(620, CX.x1, k), cy(.8 - .75 * Math.pow(k, .8) + (i && i < 40 ? (rnd(i * 3.3 + 7) - .5) * .07 * (1 - k) : 0))]); }

  E.scene({ name: 'past_rise' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: 1.2, gain: .85 });
    P.sepia(g);
    const m = P.mentor(g, { x: 1500, y: 1060, h: 860 });
    E.breathe(m, .006, 1.4);
    E.grain(g, .09);
    E.vignette(g, .5, '70,35,10');
    P.note(sc.root, '昔話（フィクション）', { x: 50, y: 40, size: 28, dark: true });
    const paper = E.div(g, { left: 120, top: 180, width: 1100, height: 620, borderRadius: 18, background: 'rgba(255,250,236,.9)', boxShadow: '0 20px 40px rgba(80,40,10,.3)' }).ini({ o: 0 });
    E.div(paper, { left: 30, top: 20, font: '900 34px/1.2 Zen', color: '#6b4a2a' }, 'ある会社　株価（イメージ）');
    const up = E.polyline(g, upPts, { left: 0, top: 0, width: W, height: H, color: '#1f8a5a', sw: 9 }).ini({ draw: 0 });
    E.tw(paper, .6, { o: [0, 1], y: [40, 0] }, 'quint', .3);
    E.wait(.8);
    const L = E.say('baron', '若い頃の私は、押し目買いの名人と呼ばれていた。', { talk: m, talkAmp: 2, wait: false, chip: '押し目おじさん（昔）', chipColor: '#25386b', yomi: '若い頃の私は、おしめがいの名人と呼ばれていた。' });
    E.tw(up, Math.max(2.4, L.dur * .9), { draw: [0, 1] }, 'inOut', .3);
    E.sfx('rise', { delay: .4, gain: .4 });
    E.at(L.end + .4);
  });

  E.scene({ name: 'past_delay' }, sc => {
    const g = sc.cam;
    P.sepia(g);
    const m = P.mentor(g, { x: 1500, y: 1060, h: 860 });
    E.breathe(m, .006, 1.4);
    E.grain(g, .09);
    E.vignette(g, .5, '70,35,10');
    const doc = P.doc(g, { x: 200, y: 200, w: 860, h: 460, rot: -2, head: 'ある会社の発表（イメージ）', date: '', title: '報告の延期について', body: '追加の確認が必要となったため、予定していた報告を延期いたします。' });
    E.from(doc, { y: 500, r: 10 }, .7, 0, 'quint');
    E.sfx('slide');
    const stamp = P.mark(doc, '延期', { x: 560, y: 300, color: '#c62828', size: 1, rot: -12, w: 200 });
    E.wait(.8);
    const L = E.say('baron', 'ある会社の発表が、延期された。', { talk: m, talkAmp: 2, wait: false, chip: '押し目おじさん（昔）', chipColor: '#25386b' });
    P.stampIn(stamp, L.dur * .6);
    E.at(L.end + .3);
    // 仲間と憧れの投資家の言葉
    const b1 = E.bubble(g, '丁寧に調べてるんだよ', { x: 110, y: 700, w: 560, kind: 'round', tail: 'tr', life: 0, delay: .2, cps: 18, size: 36 });
    E.say('baron', '仲間は言った。「丁寧に調べているんだ」と。', { talk: m, talkAmp: 2, chip: '押し目おじさん（昔）', chipColor: '#25386b', yomi: '仲間は言った。丁寧に調べているんだ、と。' });
    const b2 = E.bubble(g, '信じる者は救われる', { x: 700, y: 700, w: 600, kind: 'round', tail: 'tl', life: 0, delay: .2, cps: 18, size: 36, color: '#fff3d6', border: '#8a5a2b' });
    E.say('baron', '憧れの投資家は言った。「信じる者は救われる」と。', { talk: m, talkAmp: 2, chip: '押し目おじさん（昔）', chipColor: '#25386b', yomi: '憧れの投資家は言った。信じる者は救われる、と。' });
    E.wait(.3);
  });

  E.scene({ name: 'past_fall' }, sc => {
    const g = sc.cam;
    E.bgm('sad', { fadeIn: 1.0, gain: .85 });
    P.sepia(g);
    const m = P.mentor(g, { x: 1500, y: 1060, h: 860 });
    E.breathe(m, .006, 1.4);
    E.grain(g, .09);
    E.vignette(g, .5, '70,35,10');
    const paper = E.div(g, { left: 120, top: 180, width: 1100, height: 620, borderRadius: 18, background: 'rgba(255,250,236,.9)', boxShadow: '0 20px 40px rgba(80,40,10,.3)' });
    E.div(paper, { left: 30, top: 20, font: '900 34px/1.2 Zen', color: '#6b4a2a' }, 'ある会社　株価（イメージ）');
    E.polyline(g, upPts, { left: 0, top: 0, width: W, height: H, color: '#1f8a5a', sw: 9 });
    const dn = E.polyline(g, dnPts, { left: 0, top: 0, width: W, height: H, color: '#c62828', sw: 9 }).ini({ draw: 0 });
    const tags = [.18, .4, .62, .84].map((k, i) => {
      const [x, y] = [lerp(620, CX.x1, k), cy(.8 - .75 * Math.pow(k, .8))];
      return P.tag(g, '買い増し', { x: x - 60, y: y - 90, rot: -6 + i * 4, color: '#d9622b', size: 30 });
    });
    E.wait(.5);
    let L = E.say('baron', '私は、下がるたびに買い増した。押し目だと、信じて。', { talk: m, talkAmp: 2, wait: false, chip: '押し目おじさん（昔）', chipColor: '#25386b', yomi: '私は、下がるたびに、かいましした。押し目だと、信じて。' });
    const dur = Math.max(3.0, L.dur + .6);
    E.tw(dn, dur, { draw: [0, 1] }, 'inOut', .2);
    tags.forEach((t, i) => { E.tw(t, .3, { o: [0, 1], s: [1.6, 1] }, 'in2', .2 + dur * (.18 + i * .22) * .95); E.sfx('stamp', { delay: .45 + dur * (.18 + i * .22) * .95, gain: .5 }); });
    E.sfx('drop', { delay: .3, gain: .4 });
    E.at(Math.max(L.end, E.T + dur + .3));
    const big = P.mark(g, '上場廃止', { x: 420, y: 380, color: '#c62828', size: 1.6, rot: -10, w: 520 });
    L = E.say('baron', '……そして、その株は、上場廃止になった。', { talk: m, talkAmp: 2, wait: false, chip: '押し目おじさん（昔）', chipColor: '#25386b', yomi: 'そして、その株は、上場廃止になった。' });
    P.stampIn(big, L.dur * .6);
    E.shake(sc.cam, .4, 8, L.dur * .6 + .25);
    E.at(L.end + .6);
  });

  E.scene({ name: 'past_five' }, sc => {
    const g = sc.cam;
    P.sepia(g);
    E.grain(g, .09);
    E.vignette(g, .5, '70,35,10');
    const base = 760;
    const bar = (x, h, c, label, val) => {
      const b = E.div(g, { left: x, top: base - h, width: 260, height: h, borderRadius: '14px 14px 0 0', background: c, boxShadow: '0 12px 24px rgba(80,40,10,.3)', transformOrigin: '50% 100%' }).ini({ sy: 0 });
      E.div(g, { left: x - 60, top: base + 20, width: 380, textAlign: 'center', font: '800 34px/1.3 Round', color: '#5a3a1a' }, label);
      const v = E.div(g, { left: x - 100, top: base - h - 90, width: 460, textAlign: 'center', font: '900 70px/1 Noto', color: c, whiteSpace: 'nowrap' }, val).ini({ o: 0 });
      return [b, v];
    };
    const [b1, v1] = bar(520, 480, '#1f8a5a', '買った時', '100');
    const [b2, v2] = bar(1100, 24, '#c62828', '上場廃止の後', '5');
    E.tw(b1, .6, { sy: [0, 1] }, 'out', .3); E.show(v1, .3, .8);
    E.wait(1.0);
    const L = E.say('baron', '残ったのは、元の5％だけだった。', { wait: false, chip: '押し目おじさん（昔）', chipColor: '#25386b', yomi: '残ったのは、元の5パーセントだけだった。' });
    E.tw(b2, .6, { sy: [0, 1] }, 'out', L.dur * .4); E.show(v2, .3, L.dur * .4 + .4); E.sfx('drop', { delay: L.dur * .4, gain: .5 });
    const pct = E.div(g, { left: 760, top: 300, padding: '12px 36px', borderRadius: 16, background: '#c62828', color: '#fff', font: '900 64px/1.2 Noto', whiteSpace: 'nowrap', boxShadow: '0 12px 24px rgba(80,20,10,.4)' }, '−95%').ini({ o: 0, r: -6 });
    E.tw(pct, .35, { o: [0, 1], s: [1.8, 1] }, 'in2', L.dur * .75); E.sfx('stamp', { delay: L.dur * .75 + .3 });
    E.at(L.end + .8);
  });

  /* ============================================================ S3 マイナス95％の数学 */
  E.scene({ name: 'math95' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .8, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '−95％ の数学', 50);
    E.show(tt, .3);
    const rows = [
      ['100 → 5', '(100−5)÷100×100', '−95%', '#ff6b6b'],
      ['5 → 100', '100÷5', '20倍（＋1,900%）', '#ffd84a'],
      ['5 → 50', '50÷5', '10倍でも、元の50%', '#9fb2c8'],
    ].map(([a, f, r, c], i) => E.div(g, { left: 160, top: 170 + i * 150, width: 1600, height: 126, borderRadius: 20, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', boxShadow: '0 10px 20px rgba(0,0,0,.3)' },
      `<div style="width:400px;padding-left:40px;font:900 50px/1 Noto;color:#262236;white-space:nowrap">${a}</div><div style="width:520px;font:800 36px/1 Noto;color:#8a8070;white-space:nowrap">${f}</div><div style="width:640px;text-align:right;padding-right:40px;font:900 50px/1 Noto;color:${c === '#ffd84a' ? '#b8860b' : c === '#ff6b6b' ? '#c62828' : '#4a5568'};white-space:nowrap">${r}</div>`).ini({ o: 0 }));
    rows.forEach((n, i) => { E.tw(n, .4, { o: [0, 1], x: [-40, 0] }, 'back', .3 + i * .25); E.sfx('slide', { delay: .3 + i * .25 }); });
    E.wait(1.2);
    E.tw(rows[1], .3, { s: 1.03 }, 'back');
    E.say('baron', 'マイナス95％から元に戻すには、20倍が要る。', { chip: '押し目おじさん（昔）', chipColor: '#25386b', yomi: 'マイナス95パーセントから元に戻すには、20倍が要る。' });
    E.tw(rows[1], .3, { s: 1 }, 'out'); E.tw(rows[2], .3, { s: 1.03 }, 'back');
    E.say('baron', '10倍になっても、まだ半分だ。', { chip: '押し目おじさん（昔）', chipColor: '#25386b' });
    E.tw(rows[2], .3, { s: 1 }, 'out');
    // 非対称の図
    const ax = 160, ay = 640;
    const pairs = [['−50%', '+100%', 100], ['−90%', '+900%', 900], ['−95%', '+1,900%', 1900]];
    const asym = pairs.map(([d, u, v], i) => {
      const x = ax + 120 + i * 540;
      const w = 40 + Math.min(440, v / 1900 * 440);
      const n = E.div(g, { left: x, top: ay, width: 460, height: 150 }).ini({ o: 0 });
      E.div(n, { left: 0, top: 0, width: 150, height: 54, borderRadius: 10, background: '#c62828', textAlign: 'center', font: '900 32px/54px Noto', color: '#fff' }, d);
      E.div(n, { left: 0, top: 84, width: w, height: 54, borderRadius: 10, background: '#17915a' });
      E.div(n, { left: w + 14, top: 84, font: '900 32px/54px Noto', color: '#9ee6c0', whiteSpace: 'nowrap' }, `戻すには ${u}`);
      return n;
    });
    asym.forEach((n, i) => { E.tw(n, .4, { o: [0, 1], y: [30, 0] }, 'back', .2 + i * .3); E.sfx('pop', { delay: .2 + i * .3 }); });
    E.wait(2.4);
  });

  /* ============================================================ S4 闇堕ち */
  E.scene({ name: 'fall' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .8, gain: .9 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #2b1c14 0%, #0b0705 80%)' });
    const red = E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, rgba(140,10,20,.7) 0%, rgba(40,0,5,.9) 80%)' }).ini({ o: 0 });
    const fr = E.div(g, { left: 960 - 300, top: 110, width: 600, height: 630, borderRadius: 14, background: '#8a5a30', boxShadow: '0 30px 60px rgba(0,0,0,.6), inset 0 0 0 6px #6b4220' }).ini({ r: -3 });
    const sep = E.img(fr, CH('mentor_photo'), { left: 36, top: 36, width: 528, height: 558, objectFit: 'cover', borderRadius: 4 });
    const col = E.img(fr, CH('mentor_photo_color'), { left: 36, top: 36, width: 528, height: 558, objectFit: 'cover', borderRadius: 4 }).ini({ o: 0 });
    E.grain(g, .1);
    E.tw(fr, 9, { s: [1, 1.08] }, 'linear');
    const cr = P.crack(g, { cx: 960, cy: 420, n: 11, len: 700, seed: 9 });
    E.wait(.6);
    let L = E.say('baron', '希望で負けた私は、希望を売る側に回った。', { wait: false, chip: '押し目おじさん', chipColor: '#25386b' });
    P.crackIn(cr, L.dur * .55);
    E.tw(red, 1.2, { o: [0, 1] }, 'inOut', L.dur * .5);
    E.tw(col, 1.0, { o: [0, 1] }, 'inOut', L.dur * .5);
    E.tw(fr, .5, { hue: [0, -20], sat: [1, 1.4] }, 'inOut', L.dur * .6);
    E.at(L.end + .3);
    L = E.say('baron', '人は、何度でも、同じ物語を信じる。だから私は、空売り男爵になった。', { wait: false, chip: '空売り男爵' });
    E.flash('#ff2a2a', .6, .5, L.dur * .75);
    E.sfx('thunder', { delay: L.dur * .75, gain: .9 });
    E.shake(sc.cam, .6, 14, L.dur * .75);
    E.at(L.end + .8);
  });

  /* ============================================================ S5 9月25日：投げなかった、その後 */
  E.trans('fade', { dur: .9, color: '#000' });
  E.scene({ name: 'sep25' }, sc => {
    const g = sc.cam;
    E.bgm('daily', { fadeIn: 1.0, gain: .7 });
    const R = P.room(g);
    P.watchlist(R.screen, [['エスポア', '保有中'], ['・・・', ''], ['・・・', '']], { hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    const cal = P.calendar(g, { x: 110, y: 90, w: 560, year: 2026, month: 9 }).ini({ o: 0, r: -3 });
    E.tw(cal, .5, { o: [0, 1], y: [40, 0] }, 'quint', .3); E.sfx('slide', { delay: .3 });
    E.wait(.8);
    const L = E.narr('9月25日。あの日から、一週間。', { wait: false });
    const p25 = cal.pos(25);
    P.circle(g, { x: p25.x - 3, y: p25.y + 4, w: 76, h: 56, dur: .45, delay: L.dur * .2 });
    E.at(L.end + .5);
  });

  E.scene({ name: 'sep25_num' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '9月25日の値（9月18日との比較）', 44);
    E.show(tt, .3);
    const box = E.div(g, { left: 150, top: 150, width: 1620, height: 130, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', font: '800 30px/1 Round', color: '#6b6252', boxShadow: '0 10px 20px rgba(0,0,0,.3)' },
      ['始値 73円', '高値 73円', '安値 54円', '<span style="color:#c62828;font:900 46px/1 Noto">終値 55円</span>'].map(t => `<span style="font:900 36px/1 Noto;color:#262236">${t}</span>`).join('')).ini({ o: 0 });
    const rows = [
      ['9/18 終値 70 → 9/25 終値 55', '(55÷70−1)×100', '−21.43%'],
      ['9/18 高値 149 → 9/25 終値 55', '(55÷149−1)×100', '−63.09%'],
    ].map(([a, f, r], i) => E.div(g, { left: 150, top: 320 + i * 140, width: 1620, height: 116, borderRadius: 20, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', boxShadow: '0 10px 20px rgba(0,0,0,.3)' },
      `<div style="width:760px;padding-left:40px;font:900 36px/1 Noto;color:#262236;white-space:nowrap">${a}</div><div style="width:440px;font:800 30px/1 Noto;color:#8a8070;white-space:nowrap">${f}</div><div style="width:380px;text-align:right;padding-right:40px;font:900 54px/1 Noto;color:#c62828">${r}</div>`).ini({ o: 0 }));
    E.tw(box, .45, { o: [0, 1], y: [30, 0] }, 'back', .3); E.sfx('slide', { delay: .3 });
    E.wait(.9);
    const L = E.narr('エスポアは、55円になっていた。', { wait: false });
    E.at(L.end);
    rows.forEach((n, i) => { E.tw(n, .4, { o: [0, 1], x: [-40, 0] }, 'back', .1 + i * .3); E.sfx('slide', { delay: .1 + i * .3 }); });
    E.wait(.8);
    E.say('hat', '「もう十分下がったから、今さら売れない」……その後にも、下落は続く。', { yomi: 'もう十分下がったから、今さら売れない。その後にも、下落は続く。' });
    E.tw(rows[0], .3, { s: 1.03 }, 'back');
    E.say('hat', '9月18日の終値から、さらに21.43％減った。', { yomi: '9月18日の終値から、さらに21.43パーセント減った。' });
    E.tw(rows[0], .3, { s: 1 }, 'out');
    E.wait(.3);
  });

  E.scene({ name: 'volume' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '出来高は減った。でも「位置」がちがう', 44);
    E.show(tt, .3);
    const base = 620;
    const vb = (x, h, c, lab, val) => {
      const b = E.div(g, { left: x, top: base - h, width: 240, height: h, borderRadius: '12px 12px 0 0', background: c, transformOrigin: '50% 100%' }).ini({ sy: 0 });
      E.div(g, { left: x - 80, top: base + 16, width: 400, textAlign: 'center', font: '800 32px/1.3 Round', color: '#e8dcc0' }, lab);
      const v = E.div(g, { left: x - 120, top: base - h - 70, width: 480, textAlign: 'center', font: '900 44px/1 Noto', color: '#fff', whiteSpace: 'nowrap' }, val).ini({ o: 0 });
      return [b, v];
    };
    const [a1, l1] = vb(380, 400, '#4a7fe0', '9/18', '2,190,500株');
    const [a2, l2] = vb(820, 112, '#4a7fe0', '9/25', '614,000株');
    const pct = E.div(g, { left: 770, top: 300, padding: '8px 26px', borderRadius: 12, background: '#ffd84a', color: '#3a2c10', font: '900 36px/1.2 Noto', whiteSpace: 'nowrap' }, '28.03%').ini({ o: 0 });
    // 右：位置の説明（安値更新の途中）
    const panel = E.div(g, { left: 1180, top: 170, width: 620, height: 520, borderRadius: 26, background: 'rgba(255,255,255,.06)', border: '3px solid rgba(255,138,138,.5)' }).ini({ o: 0 });
    E.div(panel, { left: 0, top: 20, width: 620, textAlign: 'center', font: '900 34px/1.2 Zen', color: '#ff9a9a' }, '安値を更新し続けている途中');
    const pts = []; for (let i = 0; i <= 20; i++) { const k = i / 20; pts.push([40 + k * 540, 100 + k * 300 + (i && i < 20 ? (rnd(i * 2.7 + 11) - .5) * 40 : 0)]); }
    E.polyline(panel, pts, { left: 0, top: 60, width: 620, height: 440, color: '#ff8a8a', sw: 7 });
    const order = E.div(g, { left: 150, top: 760, width: 1620, height: 90, borderRadius: 18, background: 'rgba(255,216,74,.12)', border: '3px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 34px/1 Zen', color: '#ffe9a8', whiteSpace: 'nowrap' }, '見る順番：位置 → 先行トレンド → 出来高 → 板・歩値 → 連続性').ini({ o: 0 });
    E.tw(a1, .6, { sy: [0, 1] }, 'out', .3); E.show(l1, .3, .8);
    E.tw(a2, .6, { sy: [0, 1] }, 'out', .8); E.show(l2, .3, 1.3); E.pop(pct, .35, 1.5);
    E.wait(1.8);
    const call = P.call(g, { x: 1480, y: 40, w: 300, h: 240, faces: ['surprise', 'normal'] }).ini({ o: 0 });
    E.show(call, .3);
    E.say('eve', 'でも、出来高は減ってるよ〜？　売る人が減ったってこと？', { talk: call, talkAmp: 3, yomi: 'でも、出来高は減ってるよー？売る人が減ったってこと？' });
    E.hide(call, .3);
    let L = E.say('hat', '減った「位置」を見な。上場廃止が決まって、安値を更新し続けている途中だ。', { wait: false, yomi: '減った、位置、を見な。上場廃止が決まって、安値を更新し続けている途中だ。' });
    E.tw(panel, .45, { o: [0, 1], x: [60, 0] }, 'back', L.dur * .3); E.sfx('slide', { delay: L.dur * .3 });
    E.at(L.end);
    E.say('hat', '売り物が枯れたのか、買う人がいなくなったのか。板と歩値で確かめる。', { yomi: '売り物が枯れたのか、買う人がいなくなったのか。板と、あゆみねで確かめる。' });
    L = E.say('hat', '位置、先行トレンド、出来高、板と歩値、連続性。この順番で見る。', { wait: false, yomi: '位置、先行トレンド、出来高、板と、あゆみね、連続性。この順番で見る。' });
    E.tw(order, .45, { o: [0, 1], y: [30, 0] }, 'back', .2); E.sfx('chime', { delay: .2, gain: .4 });
    E.at(L.end + .5);
  });

  /* ============================================================ S6 「90％だから、売っても意味がない」の罠 */
  P.phoneScene((ph, sc) => {
    const posts = P.sns(ph, [{ name: 'ホールド花子', handle: '@hold2', icon: 'ホ', color: '#8e7cc3', text: '含み損90％くらいだから、<br>売っても意味ない。塩漬けだな', likes: 41, h: 240 }]);
    P.note(sc.root, '※投稿は要約したイメージです（アカウント名は架空）', { x: 1330, y: 30, size: 22 });
    E.tw(posts[0], .45, { o: [0, 1], y: [40, 0] }, 'back', .8); E.sfx('pop', { delay: .8 });
    P.look(sc.cam, { s: 1.5, cx: 960, cy: 400, dur: 1.4, delay: .5 });
    E.wait(2.6);
  }, { name: 'sns90', wait: 0, zoom: false });

  E.scene({ name: 'swap' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '持つ理由が、すり替わっていないか', 44);
    E.show(tt, .3);
    const card = (y, head, body, c) => {
      const n = E.div(g, { left: 260, top: y, width: 1400, height: 200, borderRadius: 24, background: '#fffdf8', overflow: 'hidden', boxShadow: '0 14px 28px rgba(0,0,0,.35)' }).ini({ o: 0 });
      E.div(n, { left: 0, top: 0, width: 260, height: 200, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 44px/1.2 Zen', color: '#fff' }, head);
      E.div(n, { left: 300, top: 0, width: 1060, height: 200, display: 'flex', alignItems: 'center', font: '900 38px/1.5 Zen', color: '#262236' }, body);
      return n;
    };
    const a = card(170, '本来', '企業の価値・材料・需給に<br>上がる余地があるから、持つ', '#17915a');
    const ar = E.div(g, { left: 900, top: 380, width: 120, textAlign: 'center', font: '900 80px/1 Zen', color: '#ffd84a' }, '↓').ini({ o: 0 });
    const b = card(470, 'いま', '損が大きすぎて、<br>今さら売りたくないから、持つ', '#c62828');
    E.tw(a, .45, { o: [0, 1], x: [-60, 0] }, 'back', .3); E.sfx('slide', { delay: .3 });
    E.wait(.9);
    let L = E.say('hat', '持つ理由が、いつの間にか、すり替わってる。', { wait: false });
    E.pop(ar, .35, L.dur * .3); E.tw(b, .45, { o: [0, 1], x: [-60, 0] }, 'back', L.dur * .5); E.sfx('buzz', { delay: L.dur * .5, gain: .35 });
    E.at(L.end);
    E.say('hat', '取得単価は、過去の事実だ。');
    const q = E.div(g, { left: 260, top: 720, width: 1400, height: 110, borderRadius: 20, background: 'rgba(255,216,74,.14)', border: '4px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 38px/1.2 Zen', color: '#ffe9a8', whiteSpace: 'nowrap' }, '残ったお金で、今日もう一度、この株を買いたいか？').ini({ o: 0 });
    L = E.say('hat', '決めるのは、「残ったお金で、今日もう一度、この株を買いたいか」だ。', { wait: false, yomi: '決めるのは、残ったお金で、今日もう一度、この株を買いたいか、だ。' });
    E.tw(q, .45, { o: [0, 1], y: [30, 0] }, 'back', L.dur * .25); E.sfx('ding', { delay: L.dur * .25, gain: .5 });
    E.at(L.end + .5);
  });

  E.scene({ name: 'holder4y' }, sc => {
    const g = sc.cam;
    const { hat, call, bd } = P.boardScene(g, ['anxious', 'normal']);
    E.div(bd, { left: 0, top: 36, width: 1020, textAlign: 'center', font: '900 42px/1.2 Zen', color: '#2a2430' }, '4年持っていた、ある個人投資家の場合');
    P.note(sc.root, '※元資料の投稿より（名前は出していません）', { x: 1300, y: 860, size: 22, dark: true });
    const rows = [
      ['取得 → 現在', '1,270円 → 70円', '#262230'],
      ['損益率', '(70÷1,270−1)×100 ＝ <span style="color:#c62828">−94.49%</span>', '#262230'],
      ['元に戻るには', '(1,270÷70−1)×100 ＝ <span style="color:#c62828">+1,714.29%</span>', '#262230'],
      ['必要な倍率', '<span style="color:#c62828">18.14倍</span>', '#262230'],
    ].map(([k, v, c], i) => {
      const r = E.div(bd, { left: 60, top: 130 + i * 150, width: 900, height: 124, borderRadius: 18, background: '#f3eee4', display: 'flex', alignItems: 'center' },
        `<div style="width:260px;padding-left:30px;font:800 30px/1.2 Round;color:#8a8070">${k}</div><div style="font:900 40px/1.2 Noto;color:${c};white-space:nowrap">${v}</div>`).ini({ o: 0 });
      return r;
    });
    E.wait(.5);
    let L = E.say('hat', '4年持っていた、ある個人投資家は、1,270円から70円。マイナス94.49％だ。', { talk: hat, talkAmp: 2, wait: false, yomi: '4年持っていた、ある個人投資家は、1270円から70円。マイナス94.49パーセントだ。' });
    E.tw(rows[0], .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.tw(rows[1], .4, { o: [0, 1], x: [-40, 0] }, 'back', L.dur * .6); E.sfx('slide', { delay: L.dur * .6 });
    E.at(L.end);
    L = E.say('hat', '元に戻すには、18倍以上が要る。', { talk: hat, talkAmp: 2, wait: false });
    E.tw(rows[2], .4, { o: [0, 1], x: [-40, 0] }, 'back', .1); E.sfx('slide', { delay: .1 });
    E.tw(rows[3], .4, { o: [0, 1], x: [-40, 0] }, 'back', L.dur * .5); E.sfx('stamp', { delay: L.dur * .5 + .2, gain: .5 });
    E.at(L.end + .6);
  });

  /* ============================================================ S7 塩漬けは、こうして作られる */
  E.scene({ name: 'pickle' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '塩漬けは、こうして作られる', 40);
    E.show(tt, .3);
    const steps = [['①', '買う', '上昇シナリオ'], ['②', '下がる', '「一時的」'], ['③', '理由を足す', '「安くなった」「そのうち戻る」'], ['④', 'さらに下がる', '否定条件を更新しない'], ['⑤', '売れなくなる', '「今さら売っても意味がない」']];
    const S = steps.map(([n, t, sub], i) => {
      const x = 120 + i * 350;
      const b = E.div(g, { left: x, top: 150, width: 320, height: 150, borderRadius: 22, background: i < 2 ? '#2b68d8' : i < 4 ? '#d9822b' : '#c62828', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
        `<div style="font:900 30px/1 Noto">${n}</div><div style="font:900 44px/1.3 Zen">${t}</div>`).ini({ o: 0 });
      const s = E.div(g, { left: x - 30, top: 320, width: 380, textAlign: 'center', font: '800 24px/1.45 Round', color: '#e8dcc0' }, sub).ini({ o: 0 });
      return [b, s];
    });
    const conv = [['延期', '「丁寧に調べている」'], ['再延期', '「期日が決まったから良い」'], ['上場廃止', '「大株主は売らない」→「MBO？TOB？再上場？」']].map(([a, b], i) =>
      E.div(g, { left: 160, top: 440 + i * 100, width: 1600, height: 84, borderRadius: 16, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', boxShadow: '0 8px 16px rgba(0,0,0,.3)' },
        `<div style="width:300px;padding-left:30px;font:900 34px/1 Zen;color:#c62828">${a}</div><div style="font:900 34px/1 Zen;color:#ffd84a;width:80px">→</div><div style="font:800 32px/1 Round;color:#262236;white-space:nowrap">${b}</div>`).ini({ o: 0 }));
    S.forEach(([b, s], i) => { E.pop(b, .4, .3 + i * .3, .6); E.show(s, .3, .5 + i * .3); E.sfx('footstep', { delay: .3 + i * .3, gain: .7 }); });
    E.wait(2.2);
    E.narr('エスポアでは、こう変わっていった。', { wait: false });
    conv.forEach((n, i) => { E.tw(n, .4, { o: [0, 1], x: [-40, 0] }, 'back', .3 + i * .5); E.sfx('slide', { delay: .3 + i * .5 }); });
    E.wait(2.4);
    E.say('hat', '事実が悪くなっても、結論を変えずに、理由だけを入れ替える。');
    E.say('hat', 'そうすると、「何が起きたら手放すか」が、永遠になくなる。', { yomi: 'そうすると、何が起きたら手放すか、が、永遠になくなる。' });
    E.wait(.2);
  });

  E.scene({ name: 'strong' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('hat_e_proud'), { fit: 'cover', pos: '50% 38%', bg: 'linear-gradient(180deg,#2c1316,#170909)' });
    E.tw(C.img, 8, { s: [1.02, 1.07] }, 'linear');
    E.say('hat', '強い投資家は、最後まで信じた人じゃない。', { talk: C.img, talkAmp: 2, gap: .15 });
    const q = E.div(g, { left: 1240, top: 300, width: 600, textAlign: 'center', font: '900 52px/1.5 Zen', color: '#fff', textShadow: '0 4px 12px rgba(0,0,0,.7)' }, '前提が壊れた時に<br><span style="color:#ffd84a">自分の仮説を壊せる人</span>').ini({ o: 0 });
    const L = E.say('hat', '前提が壊れた時に、自分の仮説を壊せる人だ。', { talk: C.img, talkAmp: 2, wait: false });
    E.tw(q, .5, { o: [0, 1], y: [20, 0] }, 'out', L.dur * .35); E.sfx('shine', { delay: L.dur * .35, gain: .5 });
    E.at(L.end + .6);
  });

  /* ============================================================ S8 投げる勇気の3段階 */
  E.scene({ name: 'doors' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '投げる勇気の、3段階', 44);
    E.show(tt, .3);
    const doors = [['①', '株', 'ポジション', '#2b68d8'], ['②', '自分の', 'シナリオ', '#d9822b'], ['③', '信じていた人の', '判断', '#c62828']].map(([n, a, b, c], i) => {
      const x = 240 + i * 520;
      const d = E.div(g, { left: x, top: 170, width: 420, height: 540, borderRadius: '210px 210px 20px 20px', background: '#1a1410', border: `10px solid ${c}`, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,.5)' }).ini({ o: 0 });
      // 扉の奥に書いてある文字（扉が開くと見える）
      E.div(d, { left: 0, top: 200, width: 400, textAlign: 'center', font: '900 50px/1.35 Zen', color: '#ffe9a8' }, `${a}<br>${b}`);
      const inner = E.div(d, { left: 0, top: 0, width: 400, height: 520, background: c, transformOrigin: '0 50%' });
      E.div(inner, { left: 0, top: 200, width: 400, textAlign: 'center', font: '900 90px/1 Noto', color: '#fff' }, n);
      E.div(inner, { left: 330, top: 260, width: 24, height: 24, borderRadius: '50%', background: '#ffd84a' });
      return { d, inner };
    });
    const subs = ['お金を取り戻して、<br>損が広がるのを止める', '「戻るはず」を<br>事実より優先しない', '有名人や仲間が強気でも、<br>自分の決めた条件を優先する'].map((t, i) => E.div(g, { left: 240 + i * 520, top: 740, width: 420, textAlign: 'center', font: '800 28px/1.5 Round', color: '#e8dcc0' }, t).ini({ o: 0 }));
    E.wait(.4);
    let L = E.say('hat', '投げるものは、三つある。', { wait: false });
    doors.forEach((o, i) => { E.pop(o.d, .45, .2 + i * .25, .6); E.sfx('pop', { delay: .2 + i * .25 }); });
    E.at(L.end);
    const open = (i, delay) => { E.tw(doors[i].inner, .6, { sx: [1, .08] }, 'inOut', delay); E.sfx('whoosh', { delay, gain: .4 }); E.show(subs[i], .4, delay + .3); };
    L = E.say('hat', '一つ目は、株。お金を取り戻して、損が広がるのを止める。', { wait: false }); open(0, .2); E.at(L.end);
    L = E.say('hat', '二つ目は、自分のシナリオ。「戻るはず」を、事実より優先しない。', { wait: false, yomi: '二つ目は、自分のシナリオ。戻るはず、を、事実より優先しない。' }); open(1, .2); E.at(L.end);
    L = E.say('hat', '三つ目は、信じていた人の判断。……これが、一番難しい。', { wait: false, yomi: '三つ目は、信じていた人の判断。これが、一番難しい。' }); open(2, .2); E.at(L.end);
    const call = P.call(g, { x: 60, y: 30, w: 300, h: 240, faces: ['anxious', 'normal'] }).ini({ o: 0 });
    E.show(call, .3);
    E.say('eve', '有名な人や仲間が強気でも、自分の決めた条件を優先する……ってこと？', { talk: call, talkAmp: 3, yomi: '有名な人や仲間が強気でも、自分の決めた条件を優先する、ってこと？' });
    E.hide(call, .3);
    E.say('hat', 'ああ。「あの人が持ってるから」じゃなく、「自分が資料と数字を確かめたから」持つ。', { yomi: 'ああ。あの人が持ってるから、じゃなく、自分が資料と数字を確かめたから、持つ。' });
    E.wait(.4);
  });

  /* ============================================================ S9 ブルちゃんの決断 */
  E.trans('fade', { dur: .9, color: '#000' });
  E.scene({ name: 'decide_room' }, sc => {
    const g = sc.cam;
    E.bgm('sad', { fadeIn: 1.0, gain: .8 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '保有中'], ['・・・', ''], ['・・・', '']], { hi: 0 });
    const bull = E.actor(g, 'bull', { x: 760, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 1.9);
    P.look(sc.cam, { s: 1.5, cx: 1050, cy: 580, dur: 5.0 });
    E.tw(R.photo, .6, { s: 1.25 }, 'back', 2.0);
    E.wait(.8);
    E.say('bull', '師匠が教えてくれたのは、希望を捨てることじゃなかった。', { talk: bull, talkAmp: 2 });
    E.say('bull', '希望を、事実の代わりに使わないこと。', { talk: bull, talkAmp: 2 });
    E.wait(.3);
  });

  E.scene({ name: 'decide_face' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .9 });
    const C = P.closeup(g, CH('bull_e_normal'), { bg: 'linear-gradient(180deg,#1b2446,#0f152c)', panelBg: 'linear-gradient(180deg,#2a3560,#1a2244)', imgH: 820 });
    E.tw(C.img, 8, { s: [1, 1.06] }, 'linear');
    E.particles(g, { n: 26, kind: 'sparkle', color: '#ffd84a', area: [440, 0, 1040, 900], speed: .4, seed: 51 });
    E.wait(.5);
    E.say('bull', '私が買った理由は、もう、なくなった。……だから。', { talk: C.img, talkAmp: 2, yomi: '私が買った理由は、もう、なくなった。だから。', gap: .8 });
  });

  P.phoneScene((ph, sc) => {
    const od = P.order(ph, { side: '売り', note: '保有分すべて' });
    E.show(od, .3, .6);
    E.sfx('cash', { delay: .7 });
    E.wait(1.2);
    E.narr('私は、エスポアを売った。');
    E.narr('負けを認めたんじゃない。間違った前提から、残ったお金と、判断の基準を取り戻したんだ。');
    E.wait(.4);
  }, { name: 'order_sell', wait: 0, zoom: false, night: true });

  /* ============================================================ S10 男爵 */
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .6 });
    const C = P.closeup(g, CH('baron_e_shock'), { bg: 'radial-gradient(ellipse at 50% 40%, #4c1820, #140707)', panelBg: 'linear-gradient(180deg,#2c0f14,#120607)', imgH: 820 });
    E.from(C.img, { s: .92 }, .35, 0, 'back');
    E.sfx('impact', { gain: .4 });
    E.particles(g, { n: 40, kind: 'ember', color: '#ff5a4a', area: [0, 0, W, H], speed: .7, seed: 53 });
    E.wait(.4);
    E.say('baron', '……投げた、だと？', { talk: C.img, talkAmp: 1.5, yomi: '投げた、だと？', gap: .5 });
    C.swap(CH('baron_e_sore'));
    const L = E.say('baron', 'あの子は、私と同じ道を……選ばなかったのか。', { talk: C.img, talkAmp: 1.5, wait: false, yomi: 'あの子は、私と同じ道を、選ばなかったのか。' });
    E.at(L.end + .8);
    E.tw(C.img, .6, { blur: 16, o: 0 }, 'in');
    E.wait(.6);
  });

  /* ============================================================ S11 次回予告 */
  E.trans('fade', { dur: .8, color: '#000' });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 55 });
    const words = ['事実', '解釈', '期待'].map((t, i) => {
      const c = [P.KIND.fact.c, P.KIND.interp.c, P.KIND.hope.c][i];
      const n = E.div(g, { left: 200 + i * 360, top: 250, width: 300, height: 300, borderRadius: 40, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 90px/1 Zen', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0, r: -4 + i * 4 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
      return n;
    });
    const st = P.sticky(g, '最終章<br>答え合わせ', { x: 1380, y: 120, w: 440, h: 250, rot: 5, size: 48 });
    P.slap(st, 1.8);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.4);
    E.sfx('snort', { delay: 2.6 });
    E.wait(3.0);
    E.say('pig', 'ブヒッ。次は、いよいよ最終章だブー。', { talk: pig, talkAmp: 5 });
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
