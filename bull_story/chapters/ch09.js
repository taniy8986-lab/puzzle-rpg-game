// 番外編「市場の外で」（2026年10月17日・上場廃止の日の夜）
// 台本: story/09_番外編_市場の外で.md
// 会社の開示（2026/10/16「株式の上場廃止及び上場廃止後の株式の取扱いに関するお知らせ」）、
// 10/16 15:30 の板（証券会社アプリの表示）、元資料 p18〜19 から。
// ブタの売買（最終売買日に4円で1万株）と電話の相手は物語上の設定
'use strict';
E.chapter('09');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const DISCLAIMER = 'この物語はフィクションです　｜　エスポア（3260）の事実関係は公開資料に基づきます　｜　投資助言ではありません';
  const LAST = 3, PREV_CLOSE = 13;
  // 10/16 15:30 の板（売り: 4〜11円、買い: 1〜3円）
  const BOOK = [['sell', 11, 11700], ['sell', 10, 20400], ['sell', 9, 3200], ['sell', 8, 21000], ['sell', 7, 1300], ['sell', 6, 11000], ['sell', 5, 32100], ['sell', 4, 12700], ['buy', 3, 52300], ['buy', 2, 210000], ['buy', 1, 376000]];
  const SELL_TOTAL = BOOK.filter(r => r[0] === 'sell').reduce((a, r) => a + r[2], 0);   // 113,400株
  const yen = v => `${v.toLocaleString('en-US')}円`;
  const f2 = v => Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const darkBg = (g, c1 = '#2b3a63', c2 = '#141c38', c3 = '#0b1022') =>
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: `radial-gradient(ellipse at 45% 45%, ${c1} 0%, ${c2} 75%, ${c3} 100%)` });
  // 白いカード（見出しの色帯つき）
  const card = (g, { x, y, w, h, head, body, color, headSize = 34, bodySize = 26 }) => {
    const n = E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: '#fffdf8', overflow: 'hidden', boxShadow: '0 14px 28px rgba(0,0,0,.4)' }).ini({ o: 0 });
    E.div(n, { left: 0, top: 0, width: w, height: 74, background: color },
      `<div style="position:absolute;left:0;top:0;width:100%;text-align:center;font:900 ${headSize}px/74px Zen;color:#fff;white-space:nowrap">${head}</div>`);
    E.div(n, { left: 22, top: 100, width: w - 44, textAlign: 'center', font: `800 ${bodySize}px/1.55 Round`, color: '#3d3540' }, body);
    return n;
  };

  /* ============================================================ S0 アバン：夜のアジト */
  E.scene({ name: 'avant' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: 1.2, gain: .7 });
    const R = P.lair(g, { screen: false, call: false });
    R.baron.ini({ o: 0 }); R.hat.ini({ o: 0 }); R.pigs.forEach(p => p.ini({ o: 0 }));
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'rgba(6,2,10,.5)' });
    const pig = E.actor(g, 'pig', { x: 960, y: 1060, h: 640, pose: 'front' });
    E.breathe(pig, .012, 2.0);
    const note = P.note(sc.root, DISCLAIMER, { x: 40, y: 30, size: 22 }).ini({ o: 0 });
    E.show(note, .6, .4);
    const place = E.div(g, { left: 120, top: 150, padding: '10px 28px', borderRadius: 14, background: 'rgba(10,6,14,.72)', border: '2px solid rgba(255,216,74,.6)', color: '#ffd84a', font: '900 38px/1.3 Zen', whiteSpace: 'nowrap' }, '10月17日（土）夜　空売り軍団のアジト').ini({ o: 0 });
    E.tw(place, .5, { o: [0, 1], x: [-30, 0] }, 'out', .6);
    P.look(sc.cam, { s: 1.15, cx: 960, cy: 560, dur: 4.5, delay: .3 });
    E.wait(1.6);
    E.sfx('vibrate', { gain: .9 }); E.shake(pig, .5, 6, 0);
    E.sfx('vibrate', { delay: 1.1, gain: .9 }); E.shake(pig, .5, 6, 1.1);
    E.wait(.8);
    E.hide(note, .5);
    E.say('pig', 'ブヒッ？　知らない番号だブー……。', { talk: pig, talkAmp: 4, yomi: 'ブヒッ？知らない番号だブー。' });
    E.wait(.3);
  });

  /* ============================================================ S0b 非通知の電話 */
  E.scene({ name: 'call' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .4, gain: .7 });
    darkBg(g, '#2a1a2e', '#140b18', '#08040b');
    const ph = P.phone(g, { x: 750, y: 110, w: 420, h: 850, bg: 'linear-gradient(180deg,#2b3550,#0f1320)' });
    const s = ph.screen, sw = ph.sw;
    E.div(s, { left: 0, top: 140, width: sw, textAlign: 'center', font: '800 26px/1.2 Round', color: 'rgba(220,228,255,.75)' }, '着信');
    E.div(s, { left: 0, top: 186, width: sw, textAlign: 'center', font: '900 64px/1.2 Zen', color: '#fff' }, '非通知');
    const ringing = E.div(s, { left: 0, top: 290, width: sw, textAlign: 'center', font: '800 26px/1.2 Round', color: 'rgba(220,228,255,.8)' }, '呼び出し中…');
    const talking = E.div(s, { left: 0, top: 290, width: sw, textAlign: 'center', font: '800 26px/1.2 Round', color: '#7be3a1' }, '通話中').ini({ o: 0 });
    const handset = c => `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="50" fill="${c}"/><path d="M33 26 C28 26 24 30 24 36 C26 56 44 74 64 76 C70 76 74 72 74 67 L74 60 L62 55 L57 62 C49 58 42 51 38 43 L45 38 L40 26 Z" fill="#fff"/></svg>`;
    const red = E.div(s, { left: 46, top: 600, width: 112, height: 112 }, handset('#e04848'));
    const green = E.div(s, { left: sw - 158, top: 600, width: 112, height: 112 }, handset('#22b35e'));
    E.div(s, { left: 46, top: 724, width: 112, textAlign: 'center', font: '800 22px/1 Round', color: 'rgba(220,228,255,.75)' }, '拒否');
    E.div(s, { left: sw - 158, top: 724, width: 112, textAlign: 'center', font: '800 22px/1 Round', color: 'rgba(220,228,255,.75)' }, '応答');
    E.from(ph, { y: 760 }, .6, 0, 'quint');
    E.sfx('whoosh');
    E.sfx('vibrate', { delay: .5, gain: .9 }); E.shake(ph, .45, 5, .5);
    E.hop(green, 14, .3, .8, 3);
    E.wait(2.1);
    E.tw(green, .18, { s: [1, .82] }, 'out'); E.sfx('click', { gain: .8 });
    E.hide(ringing, .2, .1); E.show(talking, .2, .15);
    E.hide(red, .25, .2); E.hide(green, .25, .2);
    P.look(sc.cam, { s: 1.2, cx: 960, cy: 400, dur: 1.2, delay: .2 });
    E.wait(.6);
    E.say('crowd', 'エスポアの株を、お持ちですよね？　1株50円で、買い取りますよ。', { chip: '知らない番号', chipColor: '#5a6474', yomi: 'エスポアの株を、お持ちですよね？いっかぶごじゅうえんで、買い取りますよ。' });
    E.wait(.3);
  });

  /* ============================================================ S0c ブタ、驚く */
  E.scene({ name: 'pig_shock' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('pig_e_shock'), { burst: { c1: '#fff4e6', c2: '#ffd9c4', spin: 10 }, imgH: 820, panelBg: 'linear-gradient(180deg,#fff8ef,#f8e2d4)' });
    E.from(C.img, { s: .86, y: 60 }, .4, 0, 'back');
    E.sfx('impact', { gain: .5 });
    const mark = E.div(g, { left: 1250, top: 170, font: '900 150px/1 Zen', color: '#e0353f', textShadow: '0 6px 0 #fff, 0 10px 18px rgba(0,0,0,.2)' }, '!?').ini({ o: 0, r: 12 });
    E.pop(mark, .4, .25);
    E.say('pig', 'ブヒッ！？　ご、50円！？', { talk: C.img, talkAmp: 6, delay: .3, yomi: 'ブヒッ！？ご、ごじゅうえん！？' });
    E.wait(.5);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編', catchCopy: '〜 番外編 〜', dur: 4.6 });
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'chapter', bg: '#f6efe2' }, sc => {
    const g = sc.cam;
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'repeating-linear-gradient(90deg,#f8f1e5 0 66px,#f2e7d6 66px 132px)' });
    const band = E.div(g, { left: 0, top: 380, width: W, height: 320, background: '#3a1d2b' }).ini({ sx: 0 });
    band.el.style.transformOrigin = '0 50%';
    E.tw(band, .55, { sx: [0, 1] }, 'quint', .1);
    const num = E.div(g, { left: 200, top: 410, font: '900 84px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '番外編').ini({ o: 0 });
    E.tw(num, .45, { o: [0, 1], x: [-60, 0] }, 'out', .45);
    const tt_ = E.chars(g, '市場の外で', { left: 200, top: 510, font: '900 120px/1.2 Zen', color: '#fff' });
    tt_.spans.forEach((sp, i) => E.tw(sp, .45, { o: [0, 1], y: [40, 0] }, 'back', .7 + i * .06));
    const s = E.div(g, { left: 1100, top: 620, font: '800 38px/1.2 Round', color: 'rgba(255,255,255,.8)', whiteSpace: 'nowrap' }, '2026年10月17日 夜').ini({ o: 0 });
    E.show(s, .5, 1.2);
    E.sfx('dun', { delay: .45, gain: .7 });
    E.wait(3.4);
  });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 ブタの告白 */
  E.scene({ name: 'confess' }, sc => {
    const g = sc.cam;
    E.bgm('villain', { fadeIn: .6, gain: .8 });
    const R = P.lair(g, { screen: false, call: true, faces: ['surprise', 'normal', 'anxious', 'laugh', 'despair'] });
    R.baron.ini({ o: 0 });
    R.pigs.forEach(p => p.ini({ o: 0 }));
    const pig = E.actor(g, 'pig', { x: 1160, y: 1090, h: 600, pose: 'front' });
    E.breathe(pig, .012, 2.0);
    const scr = E.div(g, { left: 520, top: 40, width: 880, height: 400, borderRadius: 20, background: '#f8f6f2', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,.6), 0 0 0 10px #140b0d' });
    E.div(scr, { left: 0, top: 0, width: 880, height: 64, background: '#3a1d2b' },
      `<div style="position:absolute;left:28px;top:0;font:900 30px/64px Zen;color:#ffd84a">10/16（最終売買日）ブタのメモ</div>`);
    const memo = [
      ['ブタの買い', '4円 × 1万株 ＝ <b>4万円</b>', '#262230'],
      ['終値', '3円 × 1万株 ＝ <b>3万円</b>', '#262230'],
      ['電話の相手', '「1株50円で買い取ります」→ <b style="color:#c62828">50万円？</b>', '#262230'],
    ].map(([k, v, c], i) => E.div(scr, { left: 30, top: 86 + i * 92, width: 820, height: 78, borderRadius: 14, background: '#f1ece2', display: 'flex', alignItems: 'center' },
      `<div style="width:200px;padding-left:24px;font:800 26px/1.2 Round;color:#8a8070;flex:none">${k}</div><div style="font:900 32px/1.2 Noto;color:${c};white-space:nowrap">${v}</div>`).ini({ o: 0 }));
    E.div(scr, { left: 30, top: 364, width: 820, font: '800 20px/1.3 Round', color: '#9a8f80', textAlign: 'right' }, '※ブタの売買と電話の相手は物語上の設定');
    E.wait(.5);
    E.say('hat', 'おい。今の電話は、何だ。', { talk: R.hat, talkAmp: 2 });
    let L = E.say('pig', 'じ、実は……最後の日に、4円で、1万株、買ってたブー。', { talk: pig, talkAmp: 4, wait: false, yomi: 'じ、実は、最後の日に、よえんで、いちまんかぶ、買ってたブー。' });
    E.tw(memo[0], .4, { o: [0, 1], x: [-40, 0] }, 'back', L.dur * .55); E.sfx('slide', { delay: L.dur * .55 });
    E.at(L.end);
    E.set(R.call, { face: 'surprise' });
    E.say('eve', 'えっ、買ってたの〜！？', { talk: R.call, talkAmp: 3, yomi: 'えっ、買ってたのー！？' });
    E.say('pig', '下に、何十万株も買いが並んでたから、もう下がらないと思ったブー。', { talk: pig, talkAmp: 4 });
    L = E.say('hat', '……で、終値は3円だ。', { talk: R.hat, talkAmp: 2, wait: false, yomi: 'で、終値は3円だ。' });
    E.tw(memo[1], .4, { o: [0, 1], x: [-40, 0] }, 'back', .3); E.sfx('slide', { delay: .3 });
    E.at(L.end);
    L = E.say('pig', 'でも、50円で買い取るって！　50万円になるブー！', { talk: pig, talkAmp: 5, wait: false, yomi: 'でも、ごじゅうえんで買い取るって！ごじゅうまんえんになるブー！' });
    E.tw(memo[2], .4, { o: [0, 1], x: [-40, 0] }, 'back', .3); E.sfx('cash', { delay: .5, gain: .6 });
    E.hop(pig, 26, .32, .4, 2);
    E.at(L.end);
    E.set(R.call, { face: 'normal' });
    E.say('hat', '落ち着け。上場廃止のあと、その株がどうなるのかが、先だ。', { talk: R.hat, talkAmp: 2 });
    E.wait(.3);
  });

  /* ============================================================ S3 上場廃止のあと、株を売るには */
  E.scene({ name: 'howto' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    const { hat, call, bd } = P.boardScene(g, ['normal', 'despair', 'anxious']);
    E.div(bd, { left: 0, top: 26, width: 1020, textAlign: 'center', font: '900 40px/1.2 Zen', color: '#2a2430' }, '上場廃止のあと、株を売るには');
    E.div(bd, { left: 0, top: 80, width: 1020, textAlign: 'center', font: '800 22px/1.2 Round', color: '#8a8070' }, '会社の開示（2026年10月16日）より');
    const steps = [
      ['①', '売る人 → 会社', '「株主名簿記載事項証明書請求書」を出す<br>実印を押し、印鑑証明書をつける', '#2b68d8'],
      ['②', '会社 → 売る人', '「株主名簿記載事項証明書」を出す<br>発行に1〜2週間程度かかる場合も', '#17915a'],
      ['③', '売る人と買う人', '株式譲渡契約を結ぶ', '#d9822b'],
      ['④', '2人で → 会社', '「名義書換請求書」を出す<br>2人の署名・実印・印鑑証明書と、②の証明書', '#c62828'],
    ].map(([n, who, what, c], i) => {
      const r = E.div(bd, { left: 40, top: 130 + i * 152, width: 940, height: 132, borderRadius: 18, background: '#f3eee4', display: 'flex', alignItems: 'center' },
        `<div style="flex:none;width:76px;height:76px;margin-left:20px;border-radius:50%;background:${c};color:#fff;font:900 40px/76px Noto;text-align:center">${n}</div>
         <div style="flex:none;width:250px;padding-left:22px;font:900 28px/1.3 Zen;color:${c};white-space:nowrap">${who}</div>
         <div style="flex:1;font:800 25px/1.45 Round;color:#262230;white-space:nowrap">${what}</div>`).ini({ o: 0 });
      return r;
    });
    E.wait(.5);
    E.say('hat', '取引所での売買は、10月16日で終わった。', { talk: hat, talkAmp: 2 });
    E.say('hat', '10月21日には、保振機構の取扱いも、終わる予定だ。', { talk: hat, talkAmp: 2, yomi: '10月21日には、ほふりきこうの取扱いも、終わる予定だ。' });
    E.say('hat', 'そうなると、証券会社でも扱えない。残るのは、相対取引だけだ。', { talk: hat, talkAmp: 2, yomi: 'そうなると、証券会社でも扱えない。残るのは、あいたいとりひきだけだ。' });
    let L = E.say('hat', '売る人がまず、実印と印鑑証明書をつけて、会社に、株主名簿記載事項証明書を請求する。', { talk: hat, talkAmp: 2, wait: false, yomi: '売る人がまず、実印と印鑑証明書をつけて、会社に、かぶぬしめいぼきさいじこうしょうめいしょを請求する。' });
    E.tw(steps[0], .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    L = E.say('hat', '証明書の発行には、1〜2週間かかることもある。', { talk: hat, talkAmp: 2, wait: false, yomi: '証明書の発行には、いっしゅうかんからにしゅうかん、かかることもある。' });
    E.tw(steps[1], .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    L = E.say('hat', 'それから、買う人と株式譲渡契約を結んで、二人で名義書換を請求する。', { talk: hat, talkAmp: 2, wait: false, yomi: 'それから、買う人と、かぶしきじょうとけいやくを結んで、二人で、めいぎかきかえを請求する。' });
    E.tw(steps[2], .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.tw(steps[3], .4, { o: [0, 1], x: [-40, 0] }, 'back', L.dur * .6); E.sfx('slide', { delay: L.dur * .6 });
    E.at(L.end);
    E.say('hat', '二人とも、実印と印鑑証明書が要る。', { talk: hat, talkAmp: 2 });
    E.set(call, { face: 'despair' });
    E.say('eve', 'めんどくさ〜い……。で、買ってくれる人は、どこで探すの〜？', { talk: call, talkAmp: 3, yomi: 'めんどくさーい。で、買ってくれる人は、どこで探すのー？' });
    E.say('hat', 'そこだ。開示には、買い手の探し方は、書いてない。', { talk: hat, talkAmp: 2 });
    E.wait(.4);
  });

  /* ============================================================ S4 ふつうの個人には、難しすぎる */
  E.scene({ name: 'hard' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, 'ふつうの個人には、難しすぎる', 50);
    E.show(tt, .3);
    const items = [
      ['場所がない', '取引所も、<br>証券会社も<br>使えない', '#2b68d8'],
      ['値段がない', '板がなく、<br>目安の値段も<br>ない', '#17915a'],
      ['手続きが重い', '証明書・契約書<br>実印・印鑑証明書', '#d9822b'],
      ['個人情報', '知らない相手と<br>住所入りの書類を<br>交わす', '#7a5ad8'],
      ['割に合わない', 'ブタの1万株は<br>終値で<br><b style="color:#c62828">3万円</b>', '#c62828'],
    ].map(([head, body, color], i) => card(g, { x: 70 + i * 360, y: 210, w: 340, h: 350, head, body, color, headSize: 32, bodySize: 28 }));
    const pro = E.div(g, { left: 260, top: 700, width: 1400, height: 96, borderRadius: 20, background: 'rgba(255,255,255,.1)', border: '2px solid rgba(243,230,200,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 34px/1.3 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' },
      'プロや大口：相手を探すつても、手続きに慣れた人もいる').ini({ o: 0 });
    E.wait(.5);
    let L = E.say('hat', 'プロや大口なら、相手を探すつても、手続きに慣れた人もいる。', { wait: false, yomi: 'プロや、おおぐちなら、相手を探すつても、手続きに慣れた人もいる。' });
    E.tw(pro, .4, { o: [0, 1], y: [20, 0] }, 'out', .3); E.sfx('slide', { delay: .3 });
    E.at(L.end);
    L = E.say('hat', 'でも、ふつうの個人には、難しすぎる。', { wait: false });
    E.hide(pro, .3, .1);
    items.forEach((n, i) => { E.tw(n, .4, { o: [0, 1], y: [40, 0] }, 'back', .3 + i * .22); E.sfx('page', { delay: .3 + i * .22, gain: .5 }); });
    E.at(Math.max(L.end, E.T + .3 + 5 * .22 + .3));
    E.say('hat', '売る場所がない。値段の目安もない。');
    E.say('hat', '手続きは重いし、知らない相手と、住所の入った書類を、やりとりすることになる。');
    E.say('hat', 'それで手に入るのが、いくらなのかも、考えな。');
    P.circle(g, { x: 70 + 4 * 360 + 170, y: 210 + 100 + 28 * 1.55 * 2.5, w: 170, h: 64, dur: .45, delay: .2 });
    E.say('pig', 'オレの1万株は……終値で、3万円だブー。', { delay: .3, yomi: 'オレのいちまんかぶは、終値で、さんまんえんだブー。' });
    E.wait(.4);
  });

  /* ============================================================ S5 なんで、市場で買わなかった？ */
  E.scene({ name: 'whymarket' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, 'なんで、市場で買わなかった？', 40);
    E.show(tt, .3);
    P.note(sc.root, '※10月16日 15:30 の板（証券会社アプリの表示から）', { x: 1220, y: 836, size: 22, dark: true });
    const px = 560, py = 130, pw = 800, rh = 52, hh = 70;
    const panel = E.div(g, { left: px, top: py, width: pw, height: hh + 20 + BOOK.length * rh, borderRadius: 24, background: '#0f1a2e', boxShadow: '0 20px 40px rgba(0,0,0,.45)', overflow: 'hidden' }).ini({ o: 0 });
    E.div(panel, { left: 0, top: 0, width: pw, height: hh, background: '#1b7a3a' },
      `<div style="display:flex;height:${hh}px;align-items:center;font:900 28px/1 Zen;color:#fff"><div style="width:300px;text-align:center">売数量</div><div style="width:200px;text-align:center">値段</div><div style="width:300px;text-align:center">買数量</div></div>`);
    const rowY = i => py + hh + 10 + i * rh;
    const rows = BOOK.map(([side, p, v], i) => E.div(panel, { left: 0, top: hh + 10 + i * rh, width: pw, height: rh, display: 'flex', alignItems: 'center', background: p === LAST ? 'rgba(255,216,74,.2)' : 'transparent', font: '800 32px/1 Noto' },
      `<div style="width:300px;text-align:right;padding-right:40px;color:#ff8a8a">${side === 'sell' ? v.toLocaleString('en-US') : ''}</div>
       <div style="width:200px;text-align:center;font-weight:900;color:${p === LAST ? '#ffd84a' : '#f3e6c8'}">${p}</div>
       <div style="width:300px;text-align:left;padding-left:40px;color:#8ec5ff">${side === 'buy' ? v.toLocaleString('en-US') : ''}</div>`).ini({ o: 0 }));
    const pill = E.div(g, { left: 70, top: 300, width: 440, height: 170, borderRadius: 24, background: '#ffd84a', color: '#3a2c10', textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="font:900 60px/1.1 Noto;padding-top:26px">終値 ${yen(LAST)}</div><div style="font:800 26px/1.4 Round;margin-top:10px">前日比 −${PREV_CLOSE - LAST}円（−${f2((LAST / PREV_CLOSE - 1) * 100)}%）</div>`).ini({ o: 0 });
    const lblSell = E.div(g, { left: 1400, top: rowY(3) - 10, width: 480, font: '900 32px/1.35 Zen', color: '#ff8a8a', whiteSpace: 'nowrap' }, `◀ 4〜11円の売り<br><span style="font-size:28px">合計 ${SELL_TOTAL.toLocaleString('en-US')}株</span>`).ini({ o: 0 });
    const lblBuy = E.div(g, { left: 1400, top: rowY(10) - 6, width: 480, font: '900 32px/1.3 Zen', color: '#8ec5ff', whiteSpace: 'nowrap' }, '◀ 買いたい人の値段').ini({ o: 0 });
    E.tw(panel, .45, { o: [0, 1], s: [.94, 1] }, 'back', .2); E.sfx('whoosh', { delay: .2, gain: .6 });
    rows.forEach((r, i) => { E.tw(r, .3, { o: [0, 1], x: [-30, 0] }, 'out', .6 + i * .08); if (i % 2 === 0) E.sfx('slide', { delay: .6 + i * .08, gain: .3 }); });
    E.tw(pill, .4, { o: [0, 1], y: [30, 0] }, 'back', 1.0); E.sfx('pop', { delay: 1.0, gain: .6 });
    E.wait(1.8);
    E.say('hat', 'その「50円で買う」相手に、聞いてみな。なんで、10月16日に、市場で買わなかったのか。', { yomi: 'その、ごじゅうえんで買う、相手に、聞いてみな。なんで、10月16日に、しじょうで買わなかったのか。' });
    let L = E.say('hat', '最後の日は、4円で、誰でも買えた。売りは、4円から11円まで、11万株あまり並んでいた。', { wait: false, yomi: '最後の日は、よえんで、誰でも買えた。売りは、よえんから、じゅういちえんまで、じゅういちまんかぶあまり並んでいた。' });
    E.tw(lblSell, .35, { o: [0, 1], x: [30, 0] }, 'out', L.dur * .5); E.sfx('ding', { delay: L.dur * .5, gain: .5 });
    P.circle(g, { x: px + 150, y: rowY(7) + rh / 2, w: 230, h: 58, dur: .45, delay: L.dur * .25 });
    E.at(L.end);
    L = E.say('hat', '買いたい人がつけた値段は、1円。37万6千株の買いが、そこで待っていた。', { wait: false, yomi: '買いたい人がつけた値段は、いちえん。さんじゅうななまんろくせんかぶの買いが、そこで待っていた。' });
    E.tw(lblBuy, .35, { o: [0, 1], x: [30, 0] }, 'out', .3); E.sfx('ding', { delay: .3, gain: .5 });
    P.circle(g, { x: px + 500 + 40 + 72, y: rowY(10) + rh / 2, w: 210, h: 60, dur: .45, delay: L.dur * .5 });
    E.at(L.end);
    E.say('pig', '……市場なら4円で買えたのに、わざわざ、50円……？', { yomi: 'しじょうなら、よえんで買えたのに、わざわざ、ごじゅうえん？' });
    E.say('hat', 'そういうことだ。安く買えた人が、わざわざ高く買う理由はない。');
    E.wait(.4);
  });

  /* ============================================================ S6 「高く買い取ります」の、よくある形 */
  E.scene({ name: 'scam' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .75 });
    P.slate(g);
    const tt = P.heading(g, '「高く買い取ります」の、よくある形', 44);
    E.show(tt, .3);
    P.note(sc.root, '※手口は一般的な例です。困ったら消費者ホットライン「188」へ', { x: 640, y: 836, size: 22, dark: true });
    const cards = [
      ['先にお金', '手数料・保証金などの<br>名目で、売る側に<br>先に払わせる', '#c62828'],
      ['個人情報', '実印や印鑑証明書を<br>送らせて、<br>別のことに使う', '#7a5ad8'],
      ['別の話へ', '「高く売るには、<br>まずこっちを」と、<br>ほかの株を売りつける', '#d9822b'],
    ].map(([head, body, color], i) => card(g, { x: 150 + i * 560, y: 180, w: 500, h: 400, head, body, color, headSize: 40, bodySize: 32 }));
    const real = E.div(g, { left: 150, top: 640, width: 1620, height: 130, borderRadius: 22, background: '#17915a', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: '900 34px/1.4 Zen', color: '#fff', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      '<div>本気で株を集めるなら、公告や公開買付けで、<br>全員に同じ条件を示すのがふつう</div>').ini({ o: 0 });
    E.wait(.5);
    E.say('hat', '上場廃止のあとに来る「高く買い取ります」には、よくある形がある。', { yomi: '上場廃止のあとに来る、高く買い取ります、には、よくある形がある。' });
    let L = E.say('hat', '手数料や保証金の名目で、先にお金を払わせる。', { wait: false });
    E.tw(cards[0], .4, { o: [0, 1], y: [40, 0] }, 'back', .2); E.sfx('buzz', { delay: .3, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '実印や印鑑証明書を、送らせる。', { wait: false });
    E.tw(cards[1], .4, { o: [0, 1], y: [40, 0] }, 'back', .2); E.sfx('buzz', { delay: .3, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '「高く売るには、まずこっちを」と、別の株を売りつける。', { wait: false, yomi: '高く売るには、まずこっちを、と、別の株を売りつける。' });
    E.tw(cards[2], .4, { o: [0, 1], y: [40, 0] }, 'back', .2); E.sfx('buzz', { delay: .3, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '本気で株を集めたいなら、公告や公開買付けで、全員に同じ条件を示すのがふつうだ。', { wait: false, yomi: '本気で株を集めたいなら、こうこくや、こうかいかいつけで、全員に同じ条件を示すのがふつうだ。' });
    E.tw(real, .45, { o: [0, 1], y: [30, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .6 });
    E.at(L.end);
    E.say('hat', '知らない番号から、一人ずつ電話してきたりはしない。');
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 520, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .5, { x: [420, 0] }, 'back');
    E.sfx('snort', { delay: .2 });
    E.say('pig', 'あぶなかったブー……。実印、送るところだったブー。', { talk: pig, talkAmp: 4, delay: .3, yomi: 'あぶなかったブー。実印、送るところだったブー。' });
    E.wait(.3);
  });

  /* ============================================================ S7 あの頃の盛り上がり（元資料 p18〜19） */
  P.phoneScene((ph, sc) => {
    const posts = P.sns(ph, [
      { name: 'ガチホ太郎', handle: '@gachiho', icon: 'ガ', color: '#2b68d8', text: '大株主は市場で売らないって。<br>浮動株が減るぞ', likes: 88, h: 200 },
      { name: '握力ゴリラ', handle: '@gorilla', icon: '握', color: '#5a6474', text: '何か次の手があるはず。<br>MBOかTOBか', likes: 64, h: 200 },
      { name: '夢見る株主', handle: '@yume', icon: '夢', color: '#e0457b', text: '上場廃止のあとも、<br>買い取りがあるかも', likes: 51, h: 200 },
    ]);
    P.note(sc.root, '※元資料にある投稿の要約（アカウント名は架空）', { x: 1240, y: 30, size: 22 });
    posts.forEach((p, i) => { E.tw(p, .45, { o: [0, 1], y: [40, 0] }, 'back', .8 + i * .6); E.sfx('notify', { delay: .8 + i * .6, gain: .7 }); });
    E.wait(2.6);
    E.narr('あの頃、チャットや掲示板は、こんな言葉で盛り上がっていた。');
    E.wait(.4);
  }, { name: 'sns', wait: 0, zoom: true, night: true });

  E.scene({ name: 'chain' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '話が進むほど、確かめていない前提が増えた', 40);
    E.show(tt, .3);
    P.note(sc.root, '※元資料 p19 の整理より', { x: 1560, y: 836, size: 22, dark: true });
    const chain = [
      ['「大株主は<br>市場で売らない」', '発言', P.KIND.fact.c],
      ['「浮動株が<br>減る」', '解釈', P.KIND.interp.c],
      ['「何か次の手が<br>ある」', '期待', '#c25a8e'],
      ['「MBO・TOB・<br>買い取りがあるかも」', '期待', P.KIND.hope.c],
    ];
    const boxes = chain.map(([t, k, c], i) => {
      const x = 70 + i * 460;
      const b = E.div(g, { left: x, top: 150, width: 400, height: 190, borderRadius: 22, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: '900 33px/1.4 Zen', color: '#fff', boxShadow: '0 12px 24px rgba(0,0,0,.35)' }, `<div>${t}</div>`).ini({ o: 0 });
      const lab = E.div(g, { left: x, top: 352, width: 400, textAlign: 'center', font: '800 26px/1 Round', color: '#e8dcc0' }, k).ini({ o: 0 });
      const ar = i < 3 ? E.div(g, { left: x + 404, top: 214, width: 52, textAlign: 'center', font: '900 48px/1 Zen', color: '#ffd84a' }, '→').ini({ o: 0 }) : null;
      return [b, lab, ar];
    });
    const facts = [
      'MBO・TOBの開示は、10月16日まで一つもなかった',
      '「売らない」は「買う」ではない。最後の買いは1円まで',
      '買いたい人は、市場で4円で買えた',
    ].map((t, i) => E.div(g, { left: 200, top: 430 + i * 104, width: 1520, height: 86, borderRadius: 16, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', boxShadow: '0 8px 16px rgba(0,0,0,.3)' },
      `<div style="flex:none;width:90px;text-align:center;font:900 40px/1 Zen;color:#17915a">✔</div><div style="font:900 34px/1 Zen;color:#262236;white-space:nowrap">${t}</div>`).ini({ o: 0 }));
    E.wait(.4);
    let L = E.say('hat', '始まりは、「大株主は市場で売らない」という、ひと言だった。', { wait: false, yomi: '始まりは、おおかぶぬしは、しじょうで売らない、という、ひと言だった。' });
    E.pop(boxes[0][0], .4, .3); E.show(boxes[0][1], .3, .5); E.sfx('pop', { delay: .3 });
    E.at(L.end);
    L = E.say('hat', 'それが、「浮動株が減る」、「何か次の手がある」、「MBOやTOBがあるかも」と、', { wait: false, gap: .05, yomi: 'それが、浮動株が減る、何か次の手がある、エムビーオーやティーオービーがあるかも、と、' });
    [1, 2, 3].forEach((k, j) => {
      const d = .3 + j * (L.dur * .3);
      E.show(boxes[k - 1][2], .25, d - .1);
      E.pop(boxes[k][0], .4, d); E.show(boxes[k][1], .3, d + .2); E.sfx('pop', { delay: d });
    });
    E.at(L.end);
    E.say('hat', '話が進むほど、確かめていない前提が増えていった。');
    E.say('hat', 'MBOもTOBも、誰かがお金を出して、開示して、初めて始まる。');
    L = E.say('hat', 'そんな開示は、最後まで、一つもなかった。', { wait: false });
    E.tw(facts[0], .4, { o: [0, 1], x: [-40, 0] }, 'back', .3); E.sfx('stamp', { delay: .4, gain: .5 });
    E.at(L.end);
    L = E.say('hat', '売らないことは、買うことじゃない。最後の板でも、買いは1円まで下がっていた。', { wait: false });
    E.tw(facts[1], .4, { o: [0, 1], x: [-40, 0] }, 'back', .3); E.sfx('stamp', { delay: .4, gain: .5 });
    E.tw(facts[2], .4, { o: [0, 1], x: [-40, 0] }, 'back', L.dur * .7); E.sfx('stamp', { delay: L.dur * .7 + .1, gain: .5 });
    E.at(L.end);
    E.say('eve', 'ふつうに考えたら、分かってたはずなのにね〜……。', { yomi: 'ふつうに考えたら、分かってたはずなのにねー。' });
    E.say('hat', '後からなら、誰でも言える。だから、買う前に、撤退の条件を決めておくんだ。');
    E.wait(.4);
  });

  /* ============================================================ S8 100万円分を買っていたら */
  E.scene({ name: 'million' }, sc => {
    const g = sc.cam;
    E.bgm('sad', { fadeIn: .8, gain: .8 });
    P.slate(g);
    const tt = P.heading(g, '100万円分を買っていたら', 40);
    E.show(tt, .3);
    const sub = E.div(g, { left: 0, top: 122, width: W, textAlign: 'center', font: '800 30px/1.2 Round', color: '#e8dcc0' }, `最後の値段 ${yen(LAST)} で計算`).ini({ o: 0 });
    E.show(sub, .4, .5);
    P.note(sc.root, '※取得単価700円・売値55円は物語上の設定／1,270円は元資料の例／手数料・税金は含まない', { x: 860, y: 836, size: 22, dark: true });
    const BAR_X = 760, BAR_W = 1000;
    const base = 1000000;
    const rows = [
      ['買った時', base, '100万円', '#8a93a3', ''],
      ['700円で買い、<br>55円で投げた（ブルちゃん）', Math.round(base / 700 * 55), '', '#2b68d8', ''],
      ['700円で買い、<br>最後まで持った', Math.round(base / 700 * LAST), '', '#d9822b', '市場では、もう売れない'],
      ['1,270円で買い、<br>最後まで持った', Math.round(base / 1270 * LAST), '', '#c62828', '市場では、もう売れない'],
    ].map(([label, v, txt, c, tag], i) => {
      const y = 190 + i * 150;
      const lab = E.div(g, { left: 80, top: y, width: 660, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'right', font: '900 32px/1.35 Zen', color: '#f3e6c8' }, `<div>${label}</div>`).ini({ o: 0 });
      const wpx = Math.max(6, BAR_W * v / base);
      const bar = E.div(g, { left: BAR_X, top: y + 30, width: wpx, height: 60, borderRadius: 8, background: c, transformOrigin: '0 50%' }).ini({ sx: 0 });
      const val = E.div(g, { left: BAR_X + Math.min(wpx, BAR_W - 260) + 22, top: y + 26, font: '900 46px/1.2 Noto', color: i === 0 ? '#e8dcc0' : '#ffd84a', whiteSpace: 'nowrap' }, txt || yen(v)).ini({ o: 0 });
      const tg = tag ? E.div(g, { left: BAR_X + Math.min(wpx, BAR_W - 260) + 22, top: y + 86, font: '800 24px/1.2 Round', color: '#ff8a8a', whiteSpace: 'nowrap' }, tag).ini({ o: 0 }) : null;
      return { lab, bar, val, tg };
    });
    const showRow = (r, d) => { E.show(r.lab, .3, d); E.tw(r.bar, .6, { sx: [0, 1] }, 'quint', d + .1); E.show(r.val, .3, d + .5); if (r.tg) E.show(r.tg, .3, d + .7); E.sfx('slide', { delay: d + .1, gain: .5 }); };
    E.wait(.6);
    let L = E.say('hat', '100万円分、買っていたとする。最後の値段、3円で計算するぞ。', { wait: false, yomi: 'ひゃくまんえんぶん、買っていたとする。最後の値段、さんえんで計算するぞ。' });
    showRow(rows[0], .3);
    E.at(L.end);
    L = E.say('hat', '700円で買って、55円で投げた人には、約7万9千円が残った。', { wait: false, yomi: 'ななひゃくえんで買って、ごじゅうごえんで投げた人には、やく、ななまんきゅうせんえんが残った。' });
    showRow(rows[1], .3);
    E.at(L.end);
    L = E.say('hat', '最後まで持った人は、約4千3百円。1,270円で買った人なら、約2千4百円だ。', { wait: false, yomi: '最後まで持った人は、やく、よんせんさんびゃくえん。せんにひゃくななじゅうえんで買った人なら、やく、にせんよんひゃくえんだ。' });
    showRow(rows[2], .3);
    showRow(rows[3], L.dur * .55);
    E.at(L.end);
    E.say('hat', 'しかも、その数千円は、もう市場では売れない。', { yomi: 'しかも、その数千円は、もう、しじょうでは売れない。' });
    E.narr('私も、あの日投げていなかったら、こっち側だった。');
    E.wait(.4);
  });

  /* ============================================================ S9 最後まで持っていた人に、残る道 */
  E.scene({ name: 'roads' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    const { hat, call, bd } = P.boardScene(g, ['normal', 'laugh', 'smile']);
    E.div(bd, { left: 0, top: 30, width: 1020, textAlign: 'center', font: '900 40px/1.2 Zen', color: '#2a2430' }, '最後まで持っていた人に、残る道');
    const roads = [
      ['株主のまま持つ', '株主の権利は残る。株主総会の案内などは<br>郵送で届く（会社の開示より）', '#2b68d8'],
      ['身元の分かる相手と', '売るなら、家族や知人など、<br>信頼できる相手と相対で', '#17915a'],
      ['特定口座だったなら', '証券会社に<br>「特定管理口座」の扱いを確認する', '#d9822b'],
      ['知らない相手の<br>「買い取ります」', '応じない。困ったら<br>消費者ホットライン「188」', '#c62828'],
    ].map(([k, v, c], i) => E.div(bd, { left: 40, top: 110 + i * 158, width: 940, height: 138, borderRadius: 18, background: '#f3eee4', display: 'flex', alignItems: 'center' },
      `<div style="flex:none;width:12px;height:100px;margin-left:18px;border-radius:6px;background:${c}"></div>
       <div style="flex:none;width:330px;padding-left:22px;font:900 29px/1.3 Zen;color:${c}">${k}</div>
       <div style="flex:1;font:800 25px/1.45 Round;color:#262230;white-space:nowrap">${v}</div>`).ini({ o: 0 }));
    E.wait(.5);
    E.say('hat', '最後まで持っていた、ふつうの個人に、残る道は多くない。', { talk: hat, talkAmp: 2 });
    let L = E.say('hat', '株主のまま、持ち続ける。株主の権利は残るし、株主総会の案内なんかは、郵送で届く。', { talk: hat, talkAmp: 2, wait: false });
    E.tw(roads[0], .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    L = E.say('hat', '売るなら、家族や知人みたいに、身元の分かる相手とだけだ。', { talk: hat, talkAmp: 2, wait: false });
    E.tw(roads[1], .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    L = E.say('hat', '特定口座で持っていたなら、証券会社に聞いてみな。', { talk: hat, talkAmp: 2, wait: false });
    E.tw(roads[2], .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    E.say('hat', '特定管理口座っていう扱いが、あるかもしれない。', { talk: hat, talkAmp: 2, yomi: 'とくていかんりこうざっていう扱いが、あるかもしれない。' });
    L = E.say('hat', 'そして、知らない相手の「買い取ります」には、乗らない。', { talk: hat, talkAmp: 2, wait: false, yomi: 'そして、知らない相手の、買い取ります、には、乗らない。' });
    E.tw(roads[3], .4, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    E.say('hat', '困ったら、消費者ホットラインの188だ。', { talk: hat, talkAmp: 2, yomi: '困ったら、消費者ホットラインの、イチハチハチだ。' });
    E.set(call, { face: 'laugh' });
    E.say('eve', 'ブタくんは、まず、その番号を着信拒否だね〜。', { talk: call, talkAmp: 3, yomi: 'ブタくんは、まず、その番号を、ちゃくしんきょひだねー。' });
    E.wait(.4);
  });

  /* ============================================================ S10 男爵 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .75 });
    const C = P.closeup(g, CH('baron_e_normal'), { bg: 'radial-gradient(ellipse at 50% 40%, #4a1622 0%, #200a10 75%)', imgH: 860, panelBg: 'linear-gradient(180deg,#3a121b,#1a070c)' });
    E.from(C.img, { s: .94, y: 30 }, .6, 0, 'out');
    E.wait(.5);
    E.say('baron', '市場は、いつでも、知らない誰かに売れる場所だった。', { talk: C.img, talkAmp: 2, yomi: 'しじょうは、いつでも、知らない誰かに売れる場所だった。' });
    E.say('baron', 'それを失って、初めて、人はその値段に気づく。', { talk: C.img, talkAmp: 2 });
    E.wait(.4);
  });

  /* ============================================================ S11 ブルちゃん（夜の部屋） */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'bull_night' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['・・・', ''], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト' });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    P.look(sc.cam, { s: 1.2, cx: 900, cy: 520, dur: 6, delay: .3 });
    E.wait(.6);
    E.narr('いつでも、すぐに売れる。それも、株の値段の一部だった。');
    E.narr('だから、買う前に決める。何が起きたら、手放すか。');
    E.wait(.6);
  });

  /* ============================================================ S12 エンドカード */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'end', bg: '#10224a' }, sc => {
    const g = sc.cam;
    E.bgm('title', { fadeIn: .6, gain: .8 });
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(circle at 50% 40%, #2c5596 0%, #1d3766 48%, #0e1d40 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#fff6c8', area: [0, 0, W, H], speed: .6, seed: 91 });
    const t1 = E.div(g, { left: 0, top: 150, width: W, textAlign: 'center', font: '900 40px/1.2 Zen', color: '#27b4c2' }, 'ブルちゃん証券 〜株価の向こう側〜　エスポア（3260）編').ini({ o: 0 });
    const t2 = E.div(g, { left: 0, top: 220, width: W, textAlign: 'center', font: '900 96px/1.2 Zen', color: '#fff', textShadow: '0 8px 0 #27b4c2' }, '番外編　市場の外で').ini({ o: 0 });
    const kan = E.div(g, { left: 0, top: 380, width: W, textAlign: 'center', font: '900 150px/1 Zen', color: '#ffd84a', textShadow: '0 0 40px rgba(255,216,74,.6)' }, '完').ini({ o: 0 });
    const disc = E.div(g, { left: 0, top: 640, width: 1720, textAlign: 'center', font: '800 24px/1.5 Round', color: 'rgba(255,255,255,.78)' }, DISCLAIMER).ini({ o: 0 });
    const sub = E.div(g, { left: 0, top: 690, width: 1720, textAlign: 'center', font: '800 22px/1.6 Round', color: 'rgba(255,255,255,.68)' },
      '※ブタの売買と電話の相手は物語上の設定です　｜　上場廃止後の手続きは会社の開示（2026年10月16日）の要約です').ini({ o: 0 });
    E.show(t1, .5, .3); E.show(t2, .6, .6);
    E.tw(kan, .6, { o: [0, 1], s: [2.2, 1] }, 'in2', 1.2); E.sfx('fanfare', { delay: 1.0, gain: .8 }); E.sfx('impact', { delay: 1.75, gain: .5 });
    E.show(disc, .6, 2.2); E.show(sub, .6, 2.5);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 520, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.8);
    E.sfx('snort', { delay: 3.0 });
    E.wait(3.6);
    E.say('pig', 'ブヒッ。株主総会の案内、待ってるブー。', { talk: pig, talkAmp: 5 });
    E.unsub(.4);
    E.wait(4.0);
  });
  E.bgmStop(3.0, -3.0);
  E.finish();
}
