// 第5章「9月18日の幻」（2026年9月17日〜9月18日）
// 台本: story/05_第5章_9月18日の幻.md　元資料 p13〜18・p32〜34
// 有名投資家の名前・アカウントは出さない。値動きのグラフは形がイメージ（数字は始値・高値・安値・終値・VWAP・出来高だけ）
'use strict';
E.chapter('05');
{
  const { W, H, rnd, lerp, clamp } = E;
  const CH = n => `assets/chara/${n}.png`;
  const DISCLAIMER = 'この物語はフィクションです　｜　エスポア（3260）の事実関係は公開資料に基づきます　｜　投資助言ではありません';

  /* ============================================================ S0 アバン */
  E.scene({ name: 'avant', bg: '#2a211b' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: 1.5, gain: .9 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 42% 42%, #7a5f46 0%, #4a3829 55%, #241b14 100%)' });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'repeating-linear-gradient(8deg, rgba(255,230,190,.035) 0 3px, transparent 3px 26px)' });
    const cal = P.calendar(g, { x: 300, y: 150, w: 780, year: 2026, month: 9 });
    E.from(cal, { y: 80 }, .9, .1, 'quint');
    const st = P.sticky(g, '第5章<br>9月18日の幻', { x: 1420, y: 160, w: 420, h: 240, rot: 6, size: 44 });
    P.slap(st, 1.4);
    const note = P.note(g, DISCLAIMER, { x: 40, y: 30, size: 22, dark: true }).ini({ o: 0 });
    E.show(note, .6, .4);
    E.tw(sc.cam, 11, { s: [1, 1.08], x: [0, 50], y: [0, 30] }, 'linear');
    E.wait(1.8);
    E.narr('上場廃止が決まって、二日後。', { gap: .2 });
    const p18 = cal.pos(18);
    const L = E.narr('9月18日。あの日の値動きを、私は一生忘れないと思う。', { wait: false });
    P.circle(g, { x: p18.x, y: p18.y, w: 104, h: 76, dur: .45, delay: L.dur * .2 });
    E.hide(note, .5, L.dur * .5);
    E.at(L.end + .8);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編', catchCopy: '〜 期待が事実を追い越すとき 〜', dur: 4.6 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 5, title: '9月18日の幻', sub: '2026年9月17日 〜 9月18日', dur: 3.4 });
  E.trans('fade', { dur: .7, color: '#fff' });

  /* ============================================================ S2 9月17日：値幅の拡大 */
  E.scene({ name: 'ladder' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .8, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '9月17日　名証「制限値幅の拡大について」', 50);
    E.show(tt, .4);
    const x = 760, top = 160, bot = 780, vmax = 400;
    const Y = v => top + (vmax - v) * (bot - top) / vmax;
    E.div(g, { left: x, top: top - 10, width: 16, height: bot - top + 20, borderRadius: 8, background: 'rgba(255,255,255,.18)' });
    const band = E.div(g, { left: x - 60, top: Y(391), width: 136, height: Y(231) - Y(391), borderRadius: '16px 16px 0 0', background: 'rgba(39,180,194,.55)', border: '4px solid #27b4c2' }).ini({ o: 0 });
    const ext = E.div(g, { left: x - 60, top: Y(231), width: 136, height: Y(1) - Y(231), borderRadius: '0 0 16px 16px', background: 'repeating-linear-gradient(180deg, rgba(224,53,63,.6) 0 14px, rgba(224,53,63,.4) 14px 28px)', border: '4px solid #e0353f', transformOrigin: '50% 0' }).ini({ o: 0, sy: 0 });
    const mark = (v, label, c, big = false) => {
      const n = E.div(g, { left: x + 110, top: Y(v) - 26, height: 52, display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'nowrap' },
        `<span style="display:inline-block;width:60px;height:5px;border-radius:3px;background:${c}"></span><span style="font:900 ${big ? 50 : 40}px/1 Noto;color:${c}">${v}円</span><span style="font:800 30px/1 Round;color:#e8dcc0">${label}</span>`).ini({ o: 0 });
      return n;
    };
    const mBase = mark(311, '基準値段（9/17の終値）', '#f3e6c8', true);
    const mUp = mark(391, '上限', '#27b4c2');
    const mLow = mark(231, '通常の下限', '#9fb2c8');
    const mExt = mark(1, '下限（拡大）', '#ff7b7b', true);
    E.tw(band, .5, { o: [0, 1], sy: [.3, 1] }, 'back', .3);
    E.wait(.8);
    E.say('hat', '上場廃止が決まった後、取引所は、値幅の下限を広げた。');
    let L = E.say('hat', '9月18日の基準は311円。上は391円まで、下は……1円までだ。', { wait: false, yomi: '9月18日の基準は311円。上は391円まで、下は、1円までだ。' });
    E.pop(mBase, .4, .1); E.sfx('pop', { delay: .1 });
    E.pop(mUp, .4, L.dur * .35); E.sfx('pop', { delay: L.dur * .35 });
    E.pop(mLow, .4, L.dur * .5);
    E.tw(ext, 1.1, { o: [0, 1], sy: [0, 1] }, 'out', L.dur * .62); E.sfx('drop', { delay: L.dur * .62, gain: .6 });
    E.pop(mExt, .45, L.dur * .62 + 1.0); E.sfx('stamp', { delay: L.dur * .62 + 1.1, gain: .6 });
    E.tw(mLow, .4, { o: .45 }, 'out', L.dur * .62 + .6);
    E.at(L.end);
    E.say('hat', '前の2日が、ストップ安などの条件に当たったからさ。');
    E.wait(.4);
  });

  /* ============================================================ S3 8時16分：10円前後の気配 */
  E.bgm('tension', { fadeIn: .8, gain: .75 });
  P.phoneScene((ph, sc) => {
    const s = ph.screen, sw = ph.sw;
    E.div(s, { left: 0, top: 0, width: sw, height: 1000, background: '#f4f6f9' });
    E.div(s, { left: 0, top: 54, width: sw, height: 110, background: '#fff', borderBottom: '2px solid #e6e8ec' },
      `<div style="position:absolute;left:24px;top:14px;font:900 30px/1.3 Zen;color:#22252b">エスポア（3260）</div>
       <div style="position:absolute;left:24px;top:60px;font:800 22px/1.3 Round;color:#8b919c">寄り前の気配　8:16</div>`);
    E.div(s, { left: 0, top: 176, width: sw, height: 44, display: 'flex', font: '800 22px/44px Round', color: '#8b919c', textAlign: 'center' },
      '<div style="flex:1">売り</div><div style="flex:1">値段</div><div style="flex:1">買い</div>');
    const rows = [13, 12, 11, 10, 9, 8, 7, 6].map((v, i) => {
      const sell = v === 10, buy = v === 9;
      return E.div(s, { left: 12, top: 226 + i * 58, width: sw - 24, height: 52, borderRadius: 10, display: 'flex', alignItems: 'center', textAlign: 'center', background: sell ? 'rgba(224,53,63,.14)' : buy ? 'rgba(43,104,216,.14)' : '#fff', font: '900 26px/1 Noto', color: '#22252b' },
        `<div style="flex:1;color:#d22d48">${sell ? '売り気配' : ''}</div><div style="flex:1">${v}円</div><div style="flex:1;color:#2b68d8">${buy ? '買い気配' : ''}</div>`).ini({ o: 0 });
    });
    rows.forEach((r, i) => E.tw(r, .3, { o: [0, 1], x: [30, 0] }, 'out', .7 + i * .06));
    const tag = E.div(s, { left: 30, top: 710, width: sw - 60, height: 60, borderRadius: 14, background: '#fff3d6', border: '3px solid #f0b24a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 24px/1 Zen', color: '#8a5a10' }, 'まだ取引は成立していない').ini({ o: 0 });
    E.wait(1.4);
    E.narr('9月18日、朝8時16分。まだ取引の始まる前。');
    const L = E.narr('板には、10円の売りと、9円の買いが並んでいた。', { wait: false });
    P.circle(s, { x: sw / 2, y: 226 + 3 * 58 + 26, w: sw - 60, h: 60, dur: .45, delay: L.dur * .3 });
    P.circle(s, { x: sw / 2, y: 226 + 4 * 58 + 26, w: sw - 60, h: 60, dur: .45, delay: L.dur * .6, color: '#2b68d8', seed: 4 });
    E.show(tag, .4, L.dur * .8);
    E.at(L.end + .4);
  }, { name: 'board816', wait: 0 });

  E.scene({ name: 'bull_cry' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_cry'), { bg: 'linear-gradient(180deg,#1b2446,#0f152c)', panelBg: 'linear-gradient(180deg,#2a3560,#1a2244)', imgH: 820 });
    E.tw(C.img, 5, { s: [1, 1.05] }, 'linear');
    E.particles(g, { n: 50, kind: 'rain', color: '#9fb2ff', area: [0, 0, W, H], speed: .9, seed: 31 });
    E.wait(.4);
    E.say('bull', 'じゅう、えん……。', { talk: C.img, talkAmp: 1.5, yomi: 'じゅう、えん。', gap: .5 });
  });

  E.scene({ name: 'kehai' }, sc => {
    const g = sc.cam;
    const { hat, call, bd } = P.boardScene(g, ['anxious', 'normal', 'surprise']);
    E.div(bd, { left: 0, top: 40, width: 1020, textAlign: 'center', font: '900 48px/1.2 Zen', color: '#2a2430' }, '「気配」と「約定」はちがう');
    const box = (y, head, text, c) => {
      const n = E.div(bd, { left: 70, top: y, width: 880, height: 230, borderRadius: 22, background: '#f3eee4', borderLeft: `16px solid ${c}` }).ini({ o: 0 });
      E.div(n, { left: 40, top: 30, font: `900 52px/1.2 Zen`, color: c }, head);
      E.div(n, { left: 40, top: 110, width: 800, font: '800 34px/1.5 Round', color: '#4a4552' }, text);
      return n;
    };
    const a = box(140, '気配', '売りたい人・買いたい人が出している<br>「この値段なら」という目安', '#d9822b');
    const b = box(410, '約定', '売り買いが実際に成立した値段<br>（ここで初めて「株価」になる）', '#17915a');
    E.tw(a, .45, { o: [0, 1], x: [-40, 0] }, 'back', .3); E.sfx('slide', { delay: .3 });
    E.tw(b, .45, { o: [0, 1], x: [-40, 0] }, 'back', .7); E.sfx('slide', { delay: .7 });
    E.wait(1.0);
    E.say('hat', '気をつけな。これは「気配」だ。まだ値段が決まったわけじゃない。', { talk: hat, talkAmp: 2, yomi: '気をつけな。これは、気配だ。まだ値段が決まったわけじゃない。' });
    E.wait(.4);
  });

  /* ============================================================ S4 8時58分：ある有名投資家のひと言 */
  P.phoneScene((ph, sc) => {
    const posts = P.sns(ph, [
      { name: 'ある有名投資家', handle: '@******', icon: '？', color: '#5a6474', text: 'ウチも含めて大株主連中も皆、マーケットでは売らないってさ', likes: '', h: 260 },
    ]);
    const time = E.div(ph.screen, { left: 0, top: 70, width: ph.sw, textAlign: 'right', paddingRight: 28, font: '800 22px/1 Round', color: '#8b919c' }, '8:58');
    P.note(sc.root, '※投稿の文面は元資料より（アカウントは伏せています）', { x: 1170, y: 30, size: 22 });
    E.tw(posts[0], .45, { o: [0, 1], y: [40, 0] }, 'back', .8); E.sfx('notify', { delay: .8 });
    P.look(sc.cam, { s: 1.5, cx: 960, cy: 380, dur: 1.4, delay: .5 });
    E.wait(1.3);
    E.narr('8時58分。ある有名投資家の投稿が流れてきた。');
    E.wait(.6);
  }, { name: 'sns858', wait: 0, zoom: false });

  // 寄り前の気配が上がっていくメーター（途中の数字は出さない）
  E.scene({ name: 'meter' }, sc => {
    const g = sc.cam;
    P.nightBg(g);
    E.particles(g, { n: 30, kind: 'sparkle', color: '#ffd84a', area: [500, 100, 920, 700], speed: 1.4, seed: 32 });
    const mx = 860, mt = 150, mb = 760;
    E.div(g, { left: mx, top: mt, width: 200, height: mb - mt, borderRadius: 100, background: 'rgba(255,255,255,.1)', border: '6px solid rgba(255,255,255,.35)' });
    const fill = E.div(g, { left: mx + 14, top: mt + 14, width: 172, height: mb - mt - 28, borderRadius: 86, background: 'linear-gradient(0deg,#e0353f,#f0b24a 60%,#ffd84a)', transformOrigin: '50% 100%' }).ini({ sy: .06 });
    E.div(g, { left: mx + 230, top: mb - 60, font: '900 46px/1 Noto', color: '#ff8a8a', whiteSpace: 'nowrap' }, '10円前後');
    E.div(g, { left: mx - 300, top: mt - 10, width: 260, textAlign: 'right', font: '800 30px/1.3 Round', color: '#e8dcc0' }, '寄り前の気配');
    const qs = [0, 1, 2].map(i => E.div(g, { left: mx + 240, top: mt + 80 + i * 140, font: '900 90px/1 Zen', color: '#ffd84a', textShadow: '0 0 20px rgba(255,216,74,.6)' }, '？').ini({ o: 0 }));
    P.note(g, '※途中の気配はイメージ（数字は出していません）', { x: 1240, y: 820, size: 22, dark: true });
    E.wait(.4);
    const L = E.narr('その投稿のあと、寄り前の気配は、みるみる上がっていった。', { wait: false });
    E.tw(fill, Math.max(2.2, L.dur * .8), { sy: [.06, .9] }, 'inOut', .3);
    E.sfx('rise', { delay: .3, gain: .6 }); E.sfx('rise', { delay: 1.4, gain: .5 });
    qs.forEach((q, i) => { E.pop(q, .35, .9 + (2 - i) * .5); E.float(q, 8, 2, i); });
    E.at(L.end + .3);
  });

  E.scene({ name: 'bull_hope' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_surprise'), { burst: { c1: '#fff7ea', c2: '#ffe9cc', spin: 9 }, imgH: 820, panelBg: 'linear-gradient(180deg,#fffaf2,#f8ead8)' });
    E.from(C.img, { s: .9, y: 40 }, .4, 0, 'back');
    E.particles(g, { n: 24, kind: 'sparkle', color: '#ffd84a', area: [440, 0, 1040, 900], speed: .7, seed: 33 });
    E.sfx('sparkle', { delay: .2, gain: .5 });
    E.wait(.3);
    E.say('bull', '助かる……の？', { talk: C.img, talkAmp: 2, yomi: '助かる、の？', gap: .5 });
  });

  /* ============================================================ S5 書かれたこと／書かれていないこと */
  E.scene({ name: 'written' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '投稿に書かれていること ／ 書かれていないこと', 50);
    E.show(tt, .4);
    const left = E.div(g, { left: 120, top: 150, width: 760, height: 640, borderRadius: 28, background: '#fffdf8', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,.4)' }).ini({ o: 0 });
    E.div(left, { left: 0, top: 0, width: 760, height: 90, background: '#17915a' }, '<div style="position:absolute;left:0;top:0;width:100%;text-align:center;font:900 42px/90px Zen;color:#fff">書かれていること</div>');
    E.div(left, { left: 40, top: 200, width: 680, textAlign: 'center', font: '900 60px/1.45 Zen', color: '#262230' }, '大株主は<br>市場では<br><span style="color:#17915a">売らない</span>');
    const right = E.div(g, { left: 1040, top: 150, width: 760, height: 640, borderRadius: 28, background: '#fffdf8', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,.4)' }).ini({ o: 0 });
    E.div(right, { left: 0, top: 0, width: 760, height: 90, background: '#b3122b' }, '<div style="position:absolute;left:0;top:0;width:100%;text-align:center;font:900 42px/90px Zen;color:#fff">書かれていないこと</div>');
    const items = ['MBO（経営陣による買収）', 'TOB（株の公開買付け）', '少数株主からの買い取り', '救済の値段', '再上場', '買い支えの約束'].map((t, i) =>
      E.div(right, { left: 50, top: 120 + i * 84, width: 660, height: 70, display: 'flex', alignItems: 'center', gap: 22, font: '900 38px/1 Zen', color: '#262230', whiteSpace: 'nowrap' },
        `<span style="flex:none;width:52px;height:52px;border-radius:50%;background:#fde6e6;color:#c62828;font:900 40px/52px Zen;text-align:center">✕</span>${t}`).ini({ o: 0 }));
    E.tw(left, .45, { o: [0, 1], x: [-60, 0] }, 'back', .3); E.sfx('slide', { delay: .3 });
    E.tw(right, .45, { o: [0, 1], x: [60, 0] }, 'back', .6); E.sfx('slide', { delay: .6 });
    E.wait(1.2);
    E.say('hat', '分けてみな。書かれているのは、「大株主は、市場では売らない」。それだけだ。', { yomi: '分けてみな。書かれているのは、大株主は、市場では売らない。それだけだ。' });
    const L = E.say('hat', 'MBOも、TOBも、買い取りも、救済の値段も、再上場も。どこにも書いていない。', { wait: false });
    items.forEach((n, i) => { E.tw(n, .3, { o: [0, 1], x: [30, 0] }, 'back', .2 + i * L.dur * .13); E.sfx('buzz', { delay: .2 + i * L.dur * .13, gain: .25 }); });
    E.at(L.end);
    E.say('hat', '「売らない」は、売り物が増えないって意味にはなる。', { yomi: '売らない、は、売り物が増えないって意味にはなる。' });
    E.say('hat', 'でも、ほかの株主の出口を約束する言葉じゃない。');
    E.wait(.3);
  });

  /* ============================================================ S6 「ウチ」って誰？ */
  E.scene({ name: 'uchi' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '「ウチ」って、誰のこと？', 50);
    E.show(tt, .4);
    const list = E.div(g, { left: 120, top: 150, width: 640, height: 620, borderRadius: 24, background: '#fffdf8', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,.4)' }).ini({ o: 0 });
    E.div(list, { left: 0, top: 0, width: 640, height: 80, background: '#3a3340' }, '<div style="position:absolute;left:0;top:0;width:100%;text-align:center;font:900 34px/80px Zen;color:#fff">大株主の一覧（2026年2月末）</div>');
    ['法人A', '法人B', '個人C', '証券会社D', '法人E', '合同会社F'].forEach((n, i) => E.div(list, { left: 40, top: 100 + i * 82, width: 560, height: 66, borderBottom: '2px solid #ece7de', display: 'flex', alignItems: 'center', gap: 20, font: '900 34px/1 Zen', color: '#3a3340' },
      `<span style="flex:none;display:inline-block;width:150px;height:30px;border-radius:6px;background:#3a3340"></span>${n}`));
    P.note(g, '※名前は伏せています', { x: 520, y: 790, size: 22, dark: true });
    const bub = E.div(g, { left: 840, top: 180, padding: '20px 40px', borderRadius: 40, background: '#fff', border: '6px solid #1d2a44', font: '900 70px/1.2 Zen', color: '#1d2a44', whiteSpace: 'nowrap' }, '「ウチ」').ini({ o: 0, r: -4 });
    const qs = E.div(g, { left: 1140, top: 160, font: '900 110px/1 Zen', color: '#ffd84a' }, '？').ini({ o: 0 });
    const concepts = ['名義（名簿の名前）', '実際の持ち主', '助言する人', '一緒に持つ人'];
    const cards = concepts.map((t, i) => E.div(g, { left: 850 + (i % 2) * 500, top: 400 + Math.floor(i / 2) * 200, width: 420, height: 160, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: '900 40px/1.3 Zen', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)' }, t).ini({ o: 0 }));
    const neq = [E.div(g, { left: 1280, top: 435, width: 60, textAlign: 'center', font: '900 70px/1 Zen', color: '#ffd84a' }, '≠').ini({ o: 0 }), E.div(g, { left: 1280, top: 635, width: 60, textAlign: 'center', font: '900 70px/1 Zen', color: '#ffd84a' }, '≠').ini({ o: 0 })];
    E.tw(list, .45, { o: [0, 1], x: [-60, 0] }, 'back', .3); E.sfx('slide', { delay: .3 });
    E.wait(.9);
    const call = P.call(g, { x: 1480, y: 40, w: 300, h: 240, faces: ['surprise', 'normal'] }).ini({ o: 0 });
    E.show(call, .3);
    E.say('eve', 'ねえねえ、「ウチ」って、どの株主のこと〜？', { talk: call, talkAmp: 3, yomi: 'ねえねえ、ウチって、どの株主のことー？' });
    E.hide(call, .3);
    let L = E.say('hat', '投稿には、どの名義で、何株かは書いていない。', { wait: false });
    E.pop(bub, .4, .1); E.sfx('pop', { delay: .1 });
    E.pop(qs, .4, L.dur * .5); E.wobble(qs, 10, 1, L.dur * .6);
    E.at(L.end);
    L = E.say('hat', '名簿の名前と、実際の持ち主と、助言する人は、同じとは限らない。', { wait: false });
    cards.forEach((c, i) => { E.pop(c, .4, .1 + i * L.dur * .2, .6); E.sfx('pop', { delay: .1 + i * L.dur * .2 }); });
    neq.forEach((n, i) => E.pop(n, .35, L.dur * (.5 + i * .3)));
    E.at(L.end);
    E.say('hat', '一人称を見て、持っている量まで、勝手に補っちゃいけないね。');
    E.wait(.3);
  });

  /* ============================================================ S7 10時52分：79円で寄り付き */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'open' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .5, gain: .85 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 40%, #2b3a63 0%, #141c38 70%, #0b1022 100%)' });
    P.burst(g, { cx: 960, cy: 420, n: 24, c1: 'rgba(0,0,0,0)', c2: 'rgba(255,216,74,.08)', spin: 6 });
    const time = E.div(g, { left: 0, top: 120, width: W, textAlign: 'center', font: '900 70px/1 Noto', color: '#e8dcc0' }, '10:52　寄り付き').ini({ o: 0 });
    const price = E.div(g, { left: 0, top: 260, width: W, textAlign: 'center', font: '900 260px/1 Noto', color: '#ffd84a', textShadow: '0 10px 0 #b8860b, 0 0 40px rgba(255,216,74,.5)' }, '79<span style="font-size:110px">円</span>').ini({ o: 0 });
    E.show(time, .4, .2);
    E.tw(price, .45, { o: [0, 1], s: [2.2, 1] }, 'in2', .6);
    E.sfx('ding', { delay: .5, gain: .8 }); E.sfx('impact', { delay: 1.0, gain: .6 });
    E.shake(sc.cam, .4, 10, 1.0);
    E.wait(1.4);
    E.narr('10時52分。エスポアは、79円で寄り付いた。');
    E.wait(.4);
  });

  E.scene({ name: 'not690' }, sc => {
    const g = sc.cam;
    const { hat, call, bd } = P.boardScene(g, ['normal', 'surprise']);
    const wrong = E.div(bd, { left: 60, top: 60, width: 900, height: 170, borderRadius: 22, background: '#fdecec', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 60px/1 Noto', color: '#a31f1f', whiteSpace: 'nowrap' }, '10円 → 79円　＋690％？').ini({ o: 0 });
    const right = E.div(bd, { left: 60, top: 290, width: 900, textAlign: 'center', font: '800 36px/1.65 Round', color: '#3d3540' },
      '<span style="color:#d9822b;font-weight:900">10円＝気配</span>（約定した値段ではない）<br>正しくは<br><span style="font:900 42px/1.5 Zen;color:#17915a">寄り前の、売り買いのつり合う点が<br>大きく上に動いた</span>').ini({ o: 0 });
    E.tw(wrong, .45, { o: [0, 1], y: [30, 0] }, 'back', .3); E.sfx('pop', { delay: .3 });
    E.wait(.8);
    let L = E.say('hat', '「10円から79円で690％上がった」……そう言いたくなるが、それは違う。', { talk: hat, talkAmp: 2, wait: false, yomi: '10円から79円で690パーセント上がった。そう言いたくなるが、それは違う。' });
    P.cross(bd, { x: 840, y: 145, s: 140, delay: L.dur * .75 });
    E.at(L.end);
    L = E.say('hat', '10円は、約定した値段じゃない。寄る前の、気配だ。', { talk: hat, talkAmp: 2, wait: false });
    E.show(right, .5, .2);
    E.at(L.end);
    E.say('hat', '正しくは、寄る前の、売り買いのつり合う場所が、大きく上に動いた、だ。', { talk: hat, talkAmp: 2 });
    E.say('hat', 'それに、買った全員が投稿を見て買った、とまでは言えない。', { talk: hat, talkAmp: 2, gap: .15 });
    E.say('hat', '短い反発を狙った人もいる。', { talk: hat, talkAmp: 2 });
    E.wait(.3);
  });

  /* ============================================================ S8 79円 → 149円 → 70円 */
  // 日中の値動き（形はイメージ。数字は始値・高値・終値だけ）
  const PX = { x0: 280, x1: 1700, y0: 780, y1: 190, p0: 60, p1: 160 };
  const py = p => PX.y0 - (p - PX.p0) / (PX.p1 - PX.p0) * (PX.y0 - PX.y1);
  const T_OPEN = 300, T_HIGH = 930, T_CLOSE = 1660;
  const upPts = [], downPts = [];
  for (let i = 0; i <= 36; i++) {
    const k = i / 36, x = lerp(T_OPEN, T_HIGH, k);
    const base = 79 + (149 - 79) * (k * k * (3 - 2 * k));
    const n = i === 0 || i === 36 ? 0 : (rnd(i * 2.3 + 5) - .5) * 14 * Math.sin(k * Math.PI);
    upPts.push([x, py(base + n)]);
  }
  for (let i = 0; i <= 48; i++) {
    const k = i / 48, x = lerp(T_HIGH, T_CLOSE, k);
    let base = 149 - (149 - 70) * Math.pow(k, .8);
    if (k > .9 && k < .98) base -= (69 - 70) * -1 * Math.sin((k - .9) / .08 * Math.PI);   // 安値69円あたり
    const n = i === 0 || i === 48 ? 0 : (rnd(i * 3.1 + 9) - .5) * 12 * (1 - k * .6);
    downPts.push([x, py(Math.max(69, base + n))]);
  }
  const axes = g => {
    E.div(g, { left: PX.x0 - 20, top: PX.y1 - 30, width: 4, height: PX.y0 - PX.y1 + 40, background: 'rgba(255,255,255,.35)' });
    E.div(g, { left: PX.x0 - 20, top: PX.y0 + 8, width: PX.x1 - PX.x0 + 60, height: 4, background: 'rgba(255,255,255,.35)' });
    [70, 79, 100, 149].forEach(v => {
      E.div(g, { left: PX.x0 - 16, top: py(v), width: PX.x1 - PX.x0 + 40, height: 2, background: 'rgba(255,255,255,.08)' });
      E.div(g, { left: PX.x0 - 150, top: py(v) - 18, width: 120, textAlign: 'right', font: '800 28px/1.2 Noto', color: 'rgba(232,220,192,.8)' }, `${v}円`);
    });
    [[T_OPEN, '10:52'], [T_HIGH, '12:40'], [T_CLOSE, '15:30']].forEach(([x, t]) => E.div(g, { left: x - 80, top: PX.y0 + 22, width: 160, textAlign: 'center', font: '800 28px/1.2 Noto', color: 'rgba(232,220,192,.85)' }, t));
  };
  const dot = (g, x, y, label, c, up = true, dx = 0) => {
    const d = E.div(g, { left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: '50%', background: c, border: '5px solid #fff', boxShadow: `0 0 18px ${c}` }).ini({ o: 0 });
    const l = E.div(g, { left: x - 160 + dx, top: up ? y - 92 : y + 26, width: 320, textAlign: 'center', font: '900 46px/1.2 Noto', color: c, textShadow: '0 4px 10px rgba(0,0,0,.6)', whiteSpace: 'nowrap' }, label).ini({ o: 0 });
    return [d, l];
  };

  E.scene({ name: 'intraday_up' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '9月18日の値動き', 40);
    E.show(tt, .3);
    P.note(g, '※線の形はイメージ（数字は始値・高値・終値）', { x: 1200, y: 106, size: 22, dark: true });
    axes(g);
    const up = E.polyline(g, upPts, { left: 0, top: 0, width: W, height: H, color: '#2ec27e', sw: 8, glow: 10 }).ini({ draw: 0 });
    const tip = E.div(g, { left: -14, top: -14, width: 28, height: 28, borderRadius: '50%', background: '#fff', boxShadow: '0 0 20px #2ec27e' });
    tip.hook(p => { const [x, y] = up.at(clamp(up.p.draw)); p.x = x; p.y = y; p.o = up.p.draw > .01 && up.p.draw < .995 ? 1 : 0; });
    const o = dot(g, T_OPEN, py(79), '始値 79円', '#ffd84a', false, 140);
    const h = dot(g, T_HIGH, py(149), '高値 149円', '#2ec27e');
    o.forEach(n => E.pop(n, .35, .3, .5));
    E.wait(.6);
    const L1 = E.narr('寄ったあとも、買いは続いた。', { wait: false });
    E.tw(up, Math.max(3.6, L1.dur + 1.6), { draw: [0, 1] }, 'inOut', .2);
    E.sfx('rise', { delay: .4, gain: .5 }); E.sfx('rise', { delay: 1.6, gain: .5 });
    E.at(Math.max(L1.end, E.T + 3.8));
    h.forEach(n => E.pop(n, .4, 0, .5)); E.sfx('ding', { gain: .7 });
    E.narr('12時40分。149円。');
    E.wait(.2);
  });

  E.scene({ name: 'bull_believe' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_smile'), { burst: { c1: '#fff7ea', c2: '#ffe2c4', spin: 10 }, imgH: 820, panelBg: 'linear-gradient(180deg,#fffaf2,#f8ead8)' });
    E.from(C.img, { s: .9, y: 30 }, .35, 0, 'back');
    E.particles(g, { n: 30, kind: 'confetti', colors: ['#ffd84a', '#e0457b', '#27b4c2', '#2ec27e'], area: [0, 0, W, H], speed: 1, seed: 34 });
    E.sfx('sparkle', { gain: .5 });
    E.wait(.3);
    E.say('bull', 'やっぱり、何かあるんだ……！', { talk: C.img, talkAmp: 2.5, yomi: 'やっぱり、何かあるんだ！' });
    E.wait(.2);
  });

  E.scene({ name: 'post1240' }, sc => {
    const g = sc.cam;
    P.slate(g);
    axes(g);
    E.polyline(g, upPts, { left: 0, top: 0, width: W, height: H, color: '#2ec27e', sw: 8, glow: 10 });
    dot(g, T_OPEN, py(79), '始値 79円', '#ffd84a', false, 140).forEach(n => n.ini({ o: 1 }));
    dot(g, T_HIGH, py(149), '高値 149円', '#2ec27e').forEach(n => n.ini({ o: 1 }));
    const post = E.div(g, { left: 1120, top: 170, width: 700, borderRadius: 22, background: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)', padding: '20px 26px' },
      `<div style="display:flex;align-items:center;gap:12px"><span style="width:50px;height:50px;border-radius:50%;background:#5a6474;color:#fff;font:900 26px/50px Zen;text-align:center">？</span>
         <span style="font:900 26px/1 Zen;color:#22252b">ある有名投資家</span><span style="margin-left:auto;font:800 24px/1 Noto;color:#c62828">12:40</span></div>
       <div style="margin-top:14px;font:800 30px/1.55 Round;color:#2b2f36">浮動株極小で大株主の売り出しがマーケットに出ないとなると、少数株主が売った後はこーなることが多いんだよな</div>`).ini({ o: 0 });
    P.note(g, '※投稿の文面は元資料より（アカウントは伏せています）', { x: 1130, y: 106, size: 22, dark: true });
    const link = P.arrow(g, { x1: 1110, y1: 360, x2: T_HIGH + 30, y2: py(149) + 14, color: '#ffd84a', sw: 6, head: 22, bend: -30 });
    E.tw(post, .45, { o: [0, 1], x: [60, 0] }, 'back', .3); E.sfx('notify', { delay: .3 });
    P.drawArrow(link, .5, 1.0);
    E.wait(1.4);
    E.say('hat', '高値をつけた12時40分。同じ時刻に、また投稿があった。');
    E.say('hat', '時刻は一致してる。でも、投稿が149円を作った、とまでは断定できない。');
    E.wait(.3);
  });

  E.scene({ name: 'intraday_down' }, sc => {
    const g = sc.cam;
    E.bgm('sad', { fadeIn: .8, gain: .8 });
    P.slate(g);
    axes(g);
    E.polyline(g, upPts, { left: 0, top: 0, width: W, height: H, color: '#2ec27e', sw: 8, glow: 10 });
    const down = E.polyline(g, downPts, { left: 0, top: 0, width: W, height: H, color: '#e0353f', sw: 8, glow: 10 }).ini({ draw: 0 });
    const tip = E.div(g, { left: -14, top: -14, width: 28, height: 28, borderRadius: '50%', background: '#fff', boxShadow: '0 0 20px #e0353f' });
    tip.hook(p => { const [x, y] = down.at(clamp(down.p.draw)); p.x = x; p.y = y; p.o = down.p.draw > .01 && down.p.draw < .995 ? 1 : 0; });
    dot(g, T_OPEN, py(79), '始値 79円', '#ffd84a', false, 140).forEach(n => n.ini({ o: 1 }));
    dot(g, T_HIGH, py(149), '高値 149円', '#2ec27e').forEach(n => n.ini({ o: 1 }));
    const c = dot(g, T_CLOSE, py(70), '終値 70円', '#ff7b7b', false);
    const never = E.div(g, { left: 980, top: py(149) - 28, width: 720, height: 4, background: 'repeating-linear-gradient(90deg, #2ec27e 0 18px, transparent 18px 32px)' }).ini({ o: 0 });
    E.wait(.3);
    const L = E.narr('でも、その後。値段は、二度と149円に戻らなかった。', { wait: false });
    E.show(never, .4, .2);
    E.tw(down, Math.max(3.8, L.dur + 1.2), { draw: [0, 1] }, 'inOut', .3);
    E.sfx('drop', { delay: .6, gain: .5 }); E.sfx('drop', { delay: 2.2, gain: .6 });
    E.at(Math.max(L.end, E.T + 4.2));
    c.forEach(n => E.pop(n, .4, 0, .5)); E.sfx('stamp', { gain: .6 });
    E.wait(1.2);
  });

  /* ============================================================ S9 数字で答え合わせ */
  E.scene({ name: 'calc' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '数字で答え合わせ（9月18日）', 40);
    E.show(tt, .3);
    const rows = [
      ['寄り → 高値', '79 → 149円', '(149÷79−1)×100', '+88.61%', '#2ec27e'],
      ['高値 → 終値', '149 → 70円', '(70÷149−1)×100', '−53.02%', '#ff6b6b'],
      ['寄り → 終値', '79 → 70円', '(70÷79−1)×100', '−11.39%', '#ff6b6b'],
      ['VWAP → 終値', '95.26 → 70円', '(70÷95.26−1)×100', '−26.52%', '#ff6b6b'],
      ['前日終値 → 終値', '311 → 70円', '(70÷311−1)×100', '−77.49%', '#ff6b6b'],
    ];
    E.div(g, { left: 110, top: 128, width: 1700, height: 56, display: 'flex', alignItems: 'center', font: '800 28px/1 Round', color: 'rgba(232,220,192,.8)' },
      '<div style="width:380px;padding-left:30px">項目</div><div style="width:360px">元のデータ</div><div style="width:560px">式</div><div style="width:400px;text-align:right;padding-right:30px">結果</div>');
    const R = rows.map(([a, b, c, d, col], i) => {
      const n = E.div(g, { left: 110, top: 194 + i * 112, width: 1700, height: 96, borderRadius: 18, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', boxShadow: '0 8px 18px rgba(0,0,0,.3)' },
        `<div style="width:380px;padding-left:30px;font:900 36px/1 Zen;color:#262236;white-space:nowrap">${a}</div><div style="width:360px;font:800 34px/1 Noto;color:#4a4552;white-space:nowrap">${b}</div>
         <div style="width:560px;font:800 30px/1 Noto;color:#8a8070;white-space:nowrap">${c}</div><div class="res" style="width:400px;text-align:right;padding-right:30px;font:900 50px/1 Noto;color:${col === '#2ec27e' ? '#17915a' : '#c62828'};white-space:nowrap">${d}</div>`).ini({ o: 0 });
      return n;
    });
    const data = E.div(g, { left: 110, top: 760, width: 1700, textAlign: 'center', font: '800 26px/1.4 Round', color: 'rgba(232,220,192,.85)' }, '元データ：前日終値311円／始値79円／高値149円／安値69円／終値70円／VWAP95.26円／出来高2,190,500株').ini({ o: 0 });
    E.show(data, .4, .2);
    R.forEach((n, i) => { E.tw(n, .35, { o: [0, 1], x: [-40, 0] }, 'back', .4 + i * .15); E.sfx('slide', { delay: .4 + i * .15, gain: .6 }); });
    E.wait(1.4);
    const hl = i => R.forEach((n, j) => E.tw(n, .3, j === i ? { s: 1.03, bright: 1 } : { s: 1, bright: .6 }, 'out'));
    hl(0);
    E.say('hat', '切り取れば、寄りから高値まで、プラス88.61％の急騰だ。', { yomi: '切り取れば、寄りから高値まで、プラス88.61パーセントの急騰だ。' });
    hl(1);
    E.say('hat', 'でも、高値から終値は、マイナス53.02％。', { gap: .1, yomi: 'でも、高値から終値は、マイナス53.02パーセント。' });
    hl(2);
    E.say('hat', '終値は、寄り値より下だ。', { yomi: '終値は、よりねより下だ。' });
    hl(3);
    E.say('hat', 'その日に売買された平均の値段、VWAPの95.26円も、26.52％下回った。', { yomi: 'その日に売買された平均の値段、ブイワップの95.26円も、26.52パーセント下回った。' });
    R.forEach(n => E.tw(n, .3, { s: 1, bright: 1 }, 'out'));
    E.wait(.6);
  });

  E.scene({ name: 'eve_sigh' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('eve_e_anxious'), { fit: 'cover', pos: '50% 30%', bg: 'linear-gradient(180deg,#2c1316,#170909)' });
    E.from(C.img, { s: 1.06 }, .4);
    E.wait(.2);
    E.say('eve', '一日で、上がって、下がって……。', { talk: C.img, talkAmp: 2, yomi: '一日で、上がって、さがって。' });
    E.wait(.3);
  });

  /* ============================================================ S10 固定玉は、上げてはくれない */
  E.scene({ name: 'book' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '「売らない株」は、株価を上げてくれる？', 30);
    E.show(tt, .3);
    // 板（上が売り、下が買い）
    const bx = 760, bw = 420, by = 172, rh = 60;
    const prices = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50];
    prices.forEach((p, i) => {
      E.div(g, { left: bx, top: by + i * rh, width: bw, height: rh - 6, borderRadius: 10, background: 'rgba(255,255,255,.07)' });
      E.div(g, { left: bx + bw / 2 - 60, top: by + i * rh, width: 120, height: rh - 6, textAlign: 'center', font: `800 26px/${rh - 6}px Noto`, color: 'rgba(232,220,192,.8)' }, `${p}`);
    });
    const sells = [0, 1, 2, 3, 4].map(i => E.div(g, { left: bx + bw / 2 + 70, top: by + i * rh + 8, width: 120 - i * 10, height: rh - 22, borderRadius: 8, background: '#e0535f' }).ini({ o: 0 }));
    const buys = [6, 7, 8, 9].map((r, i) => E.div(g, { left: bx + bw / 2 - 70 - (60 + i * 12), top: by + r * rh + 8, width: 60 + i * 12, height: rh - 22, borderRadius: 8, background: '#4a7fe0' }).ini({ o: 0 }));
    E.div(g, { left: bx + bw / 2 + 70, top: by - 46, font: '900 30px/1 Zen', color: '#ff8a8a' }, '売り');
    E.div(g, { left: bx + 20, top: by - 46, font: '900 30px/1 Zen', color: '#9fc0ff' }, '買い');
    // 今の値段
    const cur = E.div(g, { left: bx - 70, top: by + 5 * rh + 6, width: bw + 140, height: rh - 18, borderRadius: 12, border: '5px solid #ffd84a', boxShadow: '0 0 20px rgba(255,216,74,.5)' }).ini({ o: 0 });
    // 板の外：大株主の固定玉
    const lock = E.div(g, { left: 110, top: 300, width: 500, height: 300, borderRadius: 26, background: 'rgba(160,160,170,.18)', border: '4px dashed rgba(220,220,230,.6)', textAlign: 'center' },
      `<svg viewBox="0 0 100 100" style="width:110px;height:110px;margin-top:26px"><rect x="22" y="44" width="56" height="44" rx="8" fill="#c9cdd6"/><path d="M34 44 V32 a16 16 0 0 1 32 0 V44" fill="none" stroke="#c9cdd6" stroke-width="9"/></svg>
       <div style="font:900 40px/1.3 Zen;color:#e8e8ee">大株主の株</div><div style="font:800 28px/1.4 Round;color:#c9cdd6">市場では売らない（板の外）</div>`).ini({ o: 0 });
    // 新しい買い
    const nb = E.div(g, { left: 1320, top: 300, width: 480, height: 300, borderRadius: 26, background: 'rgba(74,127,224,.18)', border: '4px solid #4a7fe0', textAlign: 'center' },
      `<div style="font:900 40px/1.3 Zen;color:#cfe0ff;margin-top:70px">上の値段を<br>買い続ける人</div><div class="q" style="font:900 70px/1.2 Zen;color:#ffd84a">？</div>`).ini({ o: 0 });
    const VH = [60, 90, 150, 220, 180, 110, 70];
    const vols = VH.map((h, i) => E.div(g, { left: 1340 + i * 64, top: 780 - h, width: 46, height: h, background: '#ffd84a', transformOrigin: '50% 100%' }).ini({ o: 0, sy: 0 }));
    E.div(g, { left: 1340, top: 790, width: 440, textAlign: 'center', font: '800 24px/1.2 Round', color: 'rgba(232,220,192,.8)' }, '出来高（イメージ）');
    sells.forEach((n, i) => E.tw(n, .3, { o: [0, 1], sx: [0, 1] }, 'out', .3 + i * .05));
    buys.forEach((n, i) => E.tw(n, .3, { o: [0, 1], sx: [0, 1] }, 'out', .4 + i * .05));
    E.show(cur, .3, .7);
    E.wait(1.0);
    let L = E.say('hat', '「大株主が売らない」は、売る側の話だ。', { wait: false, yomi: '大株主が売らない、は、売る側の話だ。' });
    E.tw(lock, .45, { o: [0, 1], x: [-60, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    L = E.say('hat', '売り物は減るかもしれない。でも、上の値段を買い続ける人は、生まれない。', { wait: false });
    sells.slice(0, 2).forEach((n, i) => E.tw(n, .4, { o: .2, sx: .3 }, 'out', .3 + i * .2));
    E.tw(nb, .45, { o: [0, 1], x: [60, 0] }, 'back', L.dur * .5); E.sfx('pop', { delay: L.dur * .5 });
    E.at(L.end);
    L = E.say('hat', '高値のあたりで売買が膨らんで、それでも上を追えないなら。', { wait: false, gap: .1 });
    vols.forEach((v, i) => E.tw(v, .5, { o: [0, 1], sy: [0, 1] }, 'out', .2 + i * .1));
    E.tw(cur, .5, { y: -rh * 2 }, 'out', L.dur * .4); E.sfx('rise', { delay: L.dur * .4, gain: .4 });
    E.at(L.end);
    E.say('hat', '売り物を、吸収し切れなかったってことさ。');
    L = E.say('hat', '薄い板は、少ない買いで上に飛ぶ。でも、買いが途切れれば、下にも速い。', { wait: false });
    E.tw(cur, .4, { y: -rh * 4 }, 'back', .2); E.sfx('whoosh', { delay: .2, gain: .5 });
    E.tw(nb, .4, { bright: .4 }, 'out', L.dur * .5);
    E.tw(cur, .7, { y: rh * 3.4 }, 'in', L.dur * .6); E.sfx('drop', { delay: L.dur * .6, gain: .8 });
    E.shake(sc.cam, .4, 10, L.dur * .6 + .7);
    E.at(L.end + .6);
  });

  /* ============================================================ S11 男爵 */
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .6 });
    const C = P.closeup(g, CH('baron_face_big'), { bg: 'radial-gradient(ellipse at 50% 40%, #4c1820, #140707)', panelBg: 'linear-gradient(180deg,#2c0f14,#120607)', imgH: 1020 });
    E.tw(C.img, 9, { s: [1, 1.1] }, 'linear');
    E.particles(g, { n: 40, kind: 'ember', color: '#ff5a4a', area: [0, 0, W, H], speed: .7, seed: 35 });
    E.sfx('heartbeat', { delay: .2 });
    E.wait(.6);
    E.say('baron', '……幻は、一日で消える。', { talk: C.img, talkAmp: 1.5, yomi: '幻は、一日で消える。', gap: .4 });
    const L = E.say('baron', 'だが、幻を見た者は、また次の幻を探す。', { talk: C.img, talkAmp: 1.5, wait: false });
    E.flash('#ff2a2a', .5, .3, L.dur * .7);
    E.sfx('dun', { delay: L.dur * .7, gain: .7 });
    E.at(L.end + .5);
    E.tw(C.img, .45, { s: 1.6, blur: 24, o: 0 }, 'in');
    E.sfx('whoosh_big', { gain: .8 });
    E.wait(.45);
  });

  /* ============================================================ S12 夜の部屋 */
  E.scene({ name: 'night' }, sc => {
    const g = sc.cam;
    E.bgm('sad', { fadeIn: 1.0, gain: .8 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '終値 70円'], ['・・・', ''], ['・・・', '']], { hi: 0 });
    const bull = E.actor(g, 'bull', { x: 760, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.0);
    E.tw(sc.cam, 8, { s: [1.02, 1.08] }, 'linear');
    E.wait(.6);
    E.say('bull', '大株主は売らない……。なら、何かが起きるはず……。', { talk: bull, talkAmp: 2, yomi: '大株主は売らない。なら、何かが起きるはず。' });
    E.wait(.2);
  });

  E.scene({ name: 'chat' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'linear-gradient(180deg,#1b2446,#0f152c)' });
    const win = P.chat(g, { x: 360, y: 50, w: 1200, h: 780, title: 'オープンチャット（夜）' });
    E.from(win, { y: 60 }, .5, 0, 'quint');
    P.note(g, '※会話は要約したイメージです（名前は架空）', { x: 1300, y: 860, size: 22, dark: true });
    const msgs = [
      ['メンバーA', '大株主は売らないって！', '#e0a04a'],
      ['メンバーB', 'MBOあるかも？', '#6a9bd8'],
      ['メンバーC', 'TOBかな？', '#7cc29a'],
      ['メンバーD', '上場廃止のあと、買い取ってくれる？', '#c27cb8'],
    ].map(([n, t, c], i) => P.chatMsg(win, { name: n, text: t, y: 100 + i * 165, color: c, size: 36 }));
    E.wait(.4);
    const L = E.narr('その夜、仲間のチャットには、新しい言葉が増えていた。', { wait: false });
    msgs.forEach((m, i) => { E.tw(m, .4, { o: [0, 1], y: [30, 0] }, 'back', .3 + i * Math.max(.6, L.dur * .22)); E.sfx('pop', { delay: .3 + i * Math.max(.6, L.dur * .22) }); });
    E.at(Math.max(L.end, E.T + .3 + 3 * Math.max(.6, L.dur * .22) + .6) + .8);
  });

  /* ============================================================ S13 次回予告 */
  E.trans('fade', { dur: .8, color: '#000' });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #3a2c24 0%, #1d1612 75%, #120d0a 100%)' });
    const words = ['MBO？', 'TOB？', '買い取り？', '信じる者は…'];
    words.forEach((w, i) => {
      const n = E.div(g, { left: 160 + (i % 2) * 520, top: 220 + Math.floor(i / 2) * 200, padding: '18px 34px', borderRadius: 34, background: 'rgba(255,255,255,.92)', font: '900 54px/1.2 Zen', color: '#3a2c24', whiteSpace: 'nowrap', boxShadow: '0 12px 24px rgba(0,0,0,.4)' }, w).ini({ o: 0, r: -4 + i * 3 });
      E.pop(n, .4, .4 + i * .35, .5); E.sfx('pop', { delay: .4 + i * .35 });
      E.float(n, 6, 1.6, i);
    });
    const st = P.sticky(g, '第6章<br>信じる者は救われる？', { x: 1330, y: 120, w: 500, h: 260, rot: 5, size: 42 });
    P.slap(st, 2.0);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.6);
    E.sfx('snort', { delay: 2.8 });
    E.wait(3.2);
    E.say('pig', 'ブヒッ。次は「信じる者は救われる」……のかブー？', { talk: pig, talkAmp: 5, yomi: 'ブヒッ。次は、信じる者は救われる、のかブー？' });
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
