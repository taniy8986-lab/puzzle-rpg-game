// 完全版 第18章「人を信じることと、判断を変えること」（期待材料と、保有の判断）
// 台本: story/k/k18_人を信じることと、判断を変えること.md　元資料 p42・p44（A17・A18）
// 有名投資家の名前は出さない。「難しさの理由」は元資料の分析。オリンパスは「事案は異なる」を付ける
// 師匠の昔話はフィクション（X・助言契約・株主提案の要素を入れない）
'use strict';
E.chapter('k18');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const box = (g, { x, y, w = 700, h = 280, top = '', main = '', sub = '', c = '#262236', border = 'none', size = 50 }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 26, background: 'rgba(255,255,255,.95)', border, boxShadow: '0 12px 24px rgba(0,0,0,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 30px' },
    `${top ? `<div style="font:800 28px/1.3 Round;color:#6a6066">${top}</div>` : ''}<div style="font:900 ${size}px/1.3 Zen;color:${c};white-space:nowrap">${main}</div>${sub ? `<div style="font:800 30px/1.5 Round;color:#4a4552;margin-top:14px">${sub}</div>` : ''}`).ini({ o: 0 });
  const rise = (n, d = 0) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', d); E.sfx('pop', { delay: d, gain: .5 }); };
  const fiction = sc => P.note(sc.root, 'ブルちゃんの売買はフィクションです', { x: 1440, y: 40, size: 24, dark: true });
  const OLD = { chip: '押し目おじさん（昔）', chipColor: '#25386b' };

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

  /* ============================================================ S0 アバン：師匠の写真 */
  E.scene({ name: 'avant' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: 1.0, gain: .75 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '10/17 上場廃止予定'], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    E.wait(.6);
    E.narr('10月16日の夜。明日、エスポアは、上場廃止になる。');
    P.look(sc.cam, { s: 1.7, cx: 880, cy: 700, dur: 2.4 });
    E.narr('私は、師匠の写真を見ていた。師匠も、昔、何かを信じて、判断を変えなかったのだろうか。');
    E.wait(.3);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 18, title: '人を信じることと、判断を変えること', sub: '期待材料と、保有の判断', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 元資料 p42 の一文 */
  E.scene({ name: 'line' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const card = E.div(g, { left: 160, top: 260, width: 1600, height: 330, borderRadius: 28, background: 'rgba(255,255,255,.96)', boxShadow: '0 16px 32px rgba(0,0,0,.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
      `<div style="font:900 50px/1.55 Zen;color:#262236">人を信頼することと、<br>保有株の前提が崩れたときに判断を変えることは<span style="color:#c62828">両立する</span>。</div><div style="font:800 26px/1.4 Round;color:#6a6066;margin-top:18px">元資料 p42</div>`).ini({ o: 0 });
    E.wait(.3);
    E.say('hat', '元資料には、こう書いてある。', { yomi: 'もとしりょうには、こう書いてある。' });
    const L = E.say('hat', '人を信頼することと、持っている株の前提が崩れたときに、判断を変えることは、両立する。', { wait: false, yomi: 'ひとを、しんらいすることと、持っている株の、ぜんていが、崩れたときに、判断を変えることは、りょうりつする。' });
    E.tw(card, .6, { o: [0, 1], s: [.94, 1] }, 'out', .2); E.sfx('shine', { delay: .2, gain: .5 });
    E.at(L.end + .6);
  });

  /* ============================================================ S3 最終確認にしない */
  E.scene({ name: 'check' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '「この人が関わっているから大丈夫」を、最終確認にしない', 60);
    E.show(tt, .3);
    const A = box(g, { x: 120, y: 200, w: 640, h: 420, top: '期待材料', main: '経営交代<br>ある有名投資家との関わり', sub: '', c: '#2b68d8', border: '5px solid #2b68d8', size: 42 });
    const arr = E.div(g, { left: 790, top: 360, font: '900 80px/1 Zen', color: '#ffd84a' }, '▶').ini({ o: 0 });
    const chk = (y, t) => E.div(g, { left: 920, top: y, width: 880, height: 110, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', gap: '24px', padding: '0 34px', boxShadow: '0 10px 20px rgba(0,0,0,.3)', boxSizing: 'border-box' },
      `<span style="flex:none;width:52px;height:52px;border-radius:12px;border:4px solid #1b8a5a;font:900 40px/48px Zen;color:#1b8a5a;text-align:center">✓</span><span style="font:900 40px/1.2 Zen;color:#262236">${t}</span><span style="margin-left:auto;font:800 24px/1.2 Round;color:#6a6066">会社の資料で確かめる</span>`).ini({ o: 0 });
    const c1 = chk(200, '取引の実態'), c2 = chk(355, '資金の入金'), c3 = chk(510, '監査の結果');
    E.wait(.3);
    let L = E.say('hat', '元資料は、経営の交代や、有名な投資家との関わりを、期待の材料としている。', { wait: false, yomi: 'もとしりょうは、けいえいの、こうたいや、ゆうめいな投資家との、かかわりを、期待の材料としている。' });
    rise(A, .3);
    E.at(L.end);
    L = E.say('hat', 'でも、そのあとの取引の実態、お金の入金、監査の結果は、それぞれ、会社の資料で確かめる。', { wait: false, yomi: 'でも、そのあとの、取引の、じったい、お金の、にゅうきん、かんさの結果は、それぞれ、会社の資料で確かめる。' });
    E.show(arr, .3, .1); rise(c1, L.dur * .2); rise(c2, L.dur * .38); rise(c3, L.dur * .56);
    E.at(L.end);
    const nb = panel(g, { x: 260, y: 690, w: 1400, h: 110, size: 34, dark: true, html: '「この人が関わっているから大丈夫」　≠　最後の確認' });
    L = E.say('hat', 'この人が関わっているから大丈夫、を、最後の確認にしない。', { wait: false });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S4 短期と長期 */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'terms' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '短期と長期で、判断を更新する', 44);
    E.show(tt, .3);
    const hd = E.div(g, { left: 100, top: 130, width: 1720, height: 64, display: 'flex', alignItems: 'center', font: '900 26px/1.2 Zen', color: '#f3e6c8' },
      '<div style="width:200px;text-align:center">時間軸</div><div style="width:760px;padding-left:24px">難しさの理由<span style="margin-left:14px;padding:2px 12px;border-radius:8px;background:#ffd84a;color:#2a2430;font:900 20px Round">元資料の分析</span></div><div style="flex:1;padding-left:24px">判断を更新する材料</div>').ini({ o: 0 });
    const row = (y, t, a, b) => E.div(g, { left: 100, top: y, width: 1720, height: 250, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="flex:none;width:200px;text-align:center;font:900 46px/1.2 Zen;color:#b8651a">${t}</div><div style="flex:none;width:760px;padding:0 24px;box-sizing:border-box;font:800 28px/1.55 Round;color:#3d3540;border-left:3px solid #eadfcf">${a}</div><div style="flex:1;padding:0 24px;font:800 28px/1.55 Round;color:#1b4ea8;border-left:3px solid #eadfcf">${b}</div>`).ini({ o: 0 });
    const r1 = row(210, '短期', '一時的に売りを吸収して反発しても、<br>新たな監査・開示問題が出れば、<br>追加の売り手が生まれ得る', '反発の持続と、問題解消の開示を<br>両方確認する。<br>材料の数だけで評価しない');
    const r2 = row(490, '長期', '保有期間が長くなっても、<br>利益の裏付けや資金繰りは<br>自動的に改善しない', '監査上の問題の解消、訂正・再発防止の実行、<br>調達完了と事業からの入金を追う');
    const slide = (n, d = .2) => { E.tw(n, .4, { o: [0, 1], x: [-40, 0] }, 'back', d); E.sfx('slide', { delay: d }); };
    E.show(hd, .3, .2);
    E.wait(.3);
    E.say('hat', '元資料は、短い目で見るときと、長い目で見るときに、分けている。', { yomi: 'もとしりょうは、みじかい目で見るときと、ながい目で見るときに、分けている。' });
    let L = E.say('hat', '短い目では、一時的に売りを吸収して反発しても、新しい監査や開示の問題が出れば、', { wait: false, yomi: 'みじかい目では、いちじてきに、売りを、きゅうしゅうして、はんぱつしても、新しい、かんさや、かいじの問題が出れば、' });
    slide(r1);
    E.at(L.end);
    E.say('hat', '追加の売り手が、生まれ得る。', { yomi: 'ついかの、うりてが、うまれうる。' });
    E.say('hat', '確かめるのは、反発が続くかと、問題が解消したという開示の、両方だ。', { yomi: '確かめるのは、はんぱつが続くかと、問題が、かいしょうしたという開示の、両方だ。' });
    E.say('hat', '材料の数だけで、評価しない。');
    L = E.say('hat', '長い目では、持つ期間が長くなっても、利益の裏付けや資金繰りは、自動的には良くならない。', { wait: false, yomi: 'ながい目では、持つ期間が長くなっても、利益の、うらづけや、しきんぐりは、じどうてきには、良くならない。' });
    slide(r2);
    E.at(L.end);
    E.say('hat', '追うのは、監査の問題の解消、訂正と再発防止の実行、調達の完了と、事業からの入金だ。', { yomi: '追うのは、かんさの問題の、かいしょう、ていせいと、さいはつぼうしの実行、ちょうたつの完了と、事業からの、にゅうきんだ。' });
    E.wait(.4);
  });

  /* ============================================================ S5 永久に回復できないのか */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'recover' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const q = P.heading(g, '監査・会計問題があれば、永久に回復できないのか', 60);
    E.show(q, .3);
    E.wait(.3);
    E.say('hat', 'では、監査や会計の問題があれば、永久に、回復できないのか。', { yomi: 'では、かんさや、かいけいの問題があれば、えいきゅうに、回復できないのか。' });
    const ex = panel(g, { x: 260, y: 170, w: 1400, h: 96, size: 34, html: '回復例はある　<span style="font:800 26px Round;color:#c62828">（事案は異なる）</span>' });
    let L = E.say('hat', '回復の例は、ある。オリンパスだ。', { wait: false });
    rise(ex, .2);
    E.at(L.end);
    const step = (x, d, t, s) => E.div(g, { left: x, top: 320, width: 380, height: 260, borderRadius: 22, background: 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)', padding: '0 18px', boxSizing: 'border-box' },
      `<div style="font:900 30px/1.3 Noto;color:#6b5a40;padding-top:26px">${d}</div><div style="font:900 30px/1.4 Zen;color:#262236;margin-top:10px">${t}</div><div style="font:800 21px/1.4 Round;color:#6a6066;margin-top:8px">${s}</div>`).ini({ o: 0 });
    const s1 = step(90, '問題', '損失計上の<br>先送り問題', '');
    const s2 = step(550, 'その後', '内部管理体制を<br>再構築', '');
    const s3 = step(1010, '2013/5', '株価が問題発覚前の<br>水準へ', '同社の年次報告書の説明');
    const s4 = step(1470, '2013/6/11', '特設注意市場銘柄<br>の指定解除', '東証の確認を経て');
    const ar = [500, 960, 1420].map(x => E.div(g, { left: x, top: 420, font: '900 40px/1 Zen', color: '#ffd84a' }, '▶').ini({ o: 0 }));
    L = E.say('hat', '損失の計上を先送りした問題のあと、内部の管理の体制を、立て直した。', { wait: false, yomi: 'そんしつの、けいじょうを、さきおくりした問題のあと、ないぶの、かんりの、たいせいを、立て直した。' });
    rise(s1, .2); E.show(ar[0], .2, L.dur * .5); rise(s2, L.dur * .55);
    E.at(L.end);
    L = E.say('hat', '東証の確認を経て、2013年6月11日に、特設注意市場銘柄の指定が、解除された。', { wait: false, yomi: 'とうしょうの、確認を経て、2013年6月11日に、とくせつ、ちゅうい、しじょうめいがらの、指定が、かいじょされた。' });
    E.show(ar[2], .2, .2); rise(s4, .3);
    E.at(L.end);
    const de = panel(g, { x: 160, y: 620, w: 1600, h: 96, size: 28, html: '<span style="color:#b8651a">特設注意市場銘柄</span><span style="font:800 24px Round;color:#4a4552">＝ 内部管理体制などに問題があり、取引所が改善を求めて指定する銘柄（一般的な説明）</span>' });
    L = E.say('hat', '特設注意市場銘柄は、内部の管理に問題があるとして、取引所が、改善を求めて指定する銘柄だ。', { wait: false, yomi: 'とくせつ、ちゅうい、しじょうめいがらは、ないぶの、かんりに、問題があるとして、とりひきじょが、改善を求めて、指定する、めいがらだ。' });
    rise(de, .2);
    E.at(L.end);
    E.hide(de, .3);
    E.say('hat', '同社の年次報告書は、こう説明している。', { yomi: 'どうしゃの、ねんじほうこくしょは、こう説明している。' });
    L = E.say('hat', '2013年5月に、株価が、問題が分かる前の水準に戻った。', { wait: false, yomi: '2013年5月に、かぶかが、問題が分かる前の、すいじゅんに戻った。' });
    E.show(ar[1], .2, .2); rise(s3, .3);
    E.at(L.end);
    const nb = panel(g, { x: 160, y: 640, w: 1600, h: 110, size: 34, dark: true, html: '<span style="font:800 26px Round;color:#f3e6c8">元資料の分析</span>事案は異なる。見るべきは、時間の経過より、実際の改善' });
    L = E.say('hat', '事案は、エスポアとは異なる。見るべきは、時間の経過より、実際の改善だ。', { wait: false, yomi: 'じあんは、エスポアとは、ことなる。見るべきは、時間の、けいかより、実際の改善だ。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S6 師匠の昔話（フィクション） */
  E.trans('fade', { dur: .8, color: '#000' });
  E.scene({ name: 'past' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: 1.2, gain: .85 });
    P.sepia(g);
    const m = P.mentor(g, { x: 1500, y: 1060, h: 860 });
    E.breathe(m, .006, 1.4);
    E.grain(g, .09);
    E.vignette(g, .5, '70,35,10');
    P.note(sc.root, '昔話（フィクション）', { x: 50, y: 40, size: 28, dark: true });
    const paper = E.div(g, { left: 120, top: 160, width: 1000, height: 620, borderRadius: 18, background: 'rgba(255,250,236,.92)', boxShadow: '0 20px 40px rgba(80,40,10,.3)' }).ini({ o: 0 });
    E.div(paper, { left: 30, top: 20, font: '900 34px/1.2 Zen', color: '#6b4a2a' }, 'ある会社（イメージ）');
    const ceo = E.div(paper, { left: 60, top: 100, width: 380, height: 160, borderRadius: 16, border: '4px solid #8a6a40', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 40px/1.3 Zen', color: '#6b4a2a' }, '社長').ini({ o: 0 });
    const fan = E.div(paper, { left: 480, top: 130, padding: '14px 26px', borderRadius: 26, background: '#fff', border: '3px solid #8a6a40', font: '900 36px/1.3 Zen', color: '#3a2a18' }, '尊敬している').ini({ o: 0 });
    const delay = E.div(paper, { left: 60, top: 320, padding: '12px 24px', borderRadius: 10, background: '#c62828', font: '900 36px/1.3 Zen', color: '#fff', transform: 'rotate(-3deg)' }, '工場の停止').ini({ o: 0 });
    const ok = E.div(paper, { left: 420, top: 420, padding: '16px 28px', borderRadius: 30, background: '#fff', border: '3px solid #8a6a40', font: '900 40px/1.3 Zen', color: '#3a2a18' }, '「あの人なら大丈夫」').ini({ o: 0 });
    E.tw(paper, .6, { o: [0, 1], y: [40, 0] }, 'quint', .3);
    E.wait(.8);
    let L = E.say('baron', '若い頃、私は、ある会社の社長を、心から尊敬していた。', { talk: m, talkAmp: 2, wait: false, ...OLD });
    E.show(ceo, .4, .4); E.pop(fan, .4, L.dur * .6);
    E.at(L.end);
    L = E.say('baron', '主力の工場が止まっても、あの人なら大丈夫だ、と、確かめなかった。', { talk: m, talkAmp: 2, wait: false, ...OLD, yomi: 'しゅりょくの、こうじょうが、止まっても、あの人なら、大丈夫だ、と、確かめなかった。' });
    E.pop(delay, .4, .3); E.sfx('stamp', { delay: .3, gain: .5 }); E.pop(ok, .4, L.dur * .5);
    E.at(L.end);
    E.say('baron', '前提が崩れても、私は、判断を変えなかった。', { talk: m, talkAmp: 2, ...OLD, yomi: 'ぜんていが、崩れても、私は、判断を、変えなかった。' });
    const crack = P.crack(g, { cx: 620, cy: 470, n: 9, len: 520, seed: 18 });
    L = E.say('baron', '大きな損をしたあと、私は、もう誰も信じない、と決めた。', { talk: m, talkAmp: 2, wait: false, ...OLD });
    P.crackIn(crack, L.dur * .4); E.sfx('glitch', { delay: L.dur * .4, gain: .5 });
    E.at(L.end + .3);
    E.say('baron', 'ノートの最後のページは、ずっと、あとになって書いた。', { talk: m, talkAmp: 2, ...OLD });
    E.wait(.6);
  });

  /* ============================================================ S7 信じることと、確かめること */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'reply' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .8 });
    P.slate(g);
    const hat = E.actor(g, 'hat', { x: 380, y: 1060, h: 780, pose: 'front' });
    E.breathe(hat, .008, 2);
    const A = box(g, { x: 760, y: 170, w: 1040, h: 190, top: 'まちがいではない', main: '信じたこと', sub: '', c: '#2b68d8', border: '5px solid #2b68d8', size: 50 });
    const B = box(g, { x: 760, y: 400, w: 1040, h: 190, top: '問題だった', main: '前提が崩れても、判断を変えなかった', sub: '', c: '#c62828', border: '5px solid #c62828', size: 44 });
    const C = box(g, { x: 760, y: 630, w: 1040, h: 190, top: '確かめることの代わりにはならない', main: '誰も信じない', sub: '', c: '#4a4552', border: '5px dashed #4a4552', size: 50 });
    E.wait(.4);
    let L = E.say('hat', '信じたことが、まちがいだったわけじゃない。', { talk: hat, talkAmp: 2, wait: false });
    rise(A, .3);
    E.at(L.end);
    L = E.say('hat', '前提が崩れたときに、判断を変えなかった。そこが、問題だった。', { talk: hat, talkAmp: 2, wait: false, yomi: 'ぜんていが、崩れたときに、判断を変えなかった。そこが、問題だった。' });
    rise(B, .3);
    E.at(L.end);
    L = E.say('hat', '誰も信じない、と決めることも、確かめることの、代わりにはならない。', { talk: hat, talkAmp: 2, wait: false });
    rise(C, .3);
    E.at(L.end + .4);
  });

  /* ============================================================ S8 今回の学び */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'learn' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '今回の学び（元資料 p42）', 60);
    E.show(tt, .3);
    const top = panel(g, { x: 160, y: 180, w: 1600, h: 110, size: 34, html: '新経営陣への期待や、ある有名投資家への信頼があっても' });
    const chip = (x, t) => E.div(g, { left: x, top: 350, width: 440, height: 130, borderRadius: 22, background: '#fff', border: '5px solid #c62828', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 40px/1.2 Zen', color: '#c62828', boxShadow: '0 10px 20px rgba(0,0,0,.3)' }, t).ini({ o: 0 });
    const k1 = chip(160, '収益の証拠不足'), k2 = chip(740, '再延期'), k3 = chip(1320, '調査対応の悪化');
    const res = panel(g, { x: 260, y: 560, w: 1400, h: 120, size: 40, dark: true, html: 'が続いた時点で　▶　保有の前提を見直せる' });
    E.wait(.3);
    E.say('hat', '元資料は、今回の学びを、こうまとめている。', { yomi: 'もとしりょうは、今回の学びを、こうまとめている。' });
    let L = E.say('hat', '新しい経営陣への期待や、ある有名投資家への信頼があっても。', { wait: false, yomi: '新しい、けいえいじんへの、期待や、ある、ゆうめい、とうしかへの、しんらいがあっても。' });
    rise(top, .3);
    E.at(L.end);
    L = E.say('hat', '収益の証拠不足、再延期、調査への対応の悪化が続いた時点で、保有の前提を、見直せる。', { wait: false, yomi: 'しゅうえきの、しょうこぶそく、さいえんき、ちょうさへの、対応の、あっかが、続いた時点で、ほゆうの、ぜんていを、見直せる。' });
    rise(k1, .2); rise(k2, L.dur * .14); rise(k3, L.dur * .26);
    E.tw(res, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .55); E.sfx('ding', { delay: L.dur * .55, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S9 元資料が、扱っていないこと */
  E.scene({ name: 'notdo' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '元資料が、扱っていないこと（p42）', 60);
    E.show(tt, .3);
    const a = E.div(g, { left: 160, top: 200, width: 1600, height: 200, borderRadius: 24, background: 'rgba(255,255,255,.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: '900 38px/1.55 Zen', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      '<div>元資料は、会社との関係や投稿だけを根拠に、<br>この投資家が会計問題を知っていた・関与したとは<span style="color:#c62828">扱っていない</span></div>').ini({ o: 0 });
    const b = panel(g, { x: 160, y: 300, w: 1600, h: 110, size: 34, dark: true, html: '<span style="font:800 24px Round;color:#cfc6b0">元資料の注記</span>監査の指摘すべてを、意見不表明や不正と同列にしない' });
    E.wait(.3);
    E.say('hat', 'そして、元資料は、こうも書いている。', { yomi: 'そして、もとしりょうは、こうも書いている。' });
    let L = E.say('hat', '会社との関係や、投稿だけを根拠に、', { wait: false, yomi: '会社との、かんけいや、投稿だけを、こんきょに、' });
    rise(a, .3);
    E.at(L.end);
    E.say('hat', 'この投資家が、会計の問題を知っていた、関与した、とは扱っていない。', { yomi: 'この投資家が、かいけいの問題を、知っていた、かんよした、とは、あつかっていない。' });
    E.wait(.4);
    E.hide(a, .3);
    E.wait(.3);
    E.say('hat', 'もう一つ、元資料は、監査について、こう書いている。', { yomi: 'もうひとつ、もとしりょうは、かんさについて、こう書いている。' });
    L = E.say('hat', '監査の指摘すべてを、意見不表明や、不正と、同じ列に並べることは、しない。', { wait: false, yomi: 'かんさの、してき、すべてを、いけんふひょうめいや、ふせいと、同じ列に、ならべることは、しない。' });
    E.tw(b, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S10 ブルちゃんの部屋 */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_room' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '10/17 上場廃止予定'], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 4, delay: .3 });
    E.wait(.6);
    E.narr('私は、事業の知らせが続けば、まだ上がる、と信じていた。');
    E.narr('前提が崩れたのに、判断を変えなかった。私が、まちがえたのは、そこだった。', { yomi: 'ぜんていが、崩れたのに、判断を変えなかった。私が、まちがえたのは、そこだった。' });
    E.wait(.3);
  });

  /* ============================================================ S11 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート　最後のページ');
    const line = E.chars(paper, '信じることと、判断を変えることは、両立する', { left: 120, top: 120, font: '900 56px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .06));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const nb = (x, t, s, c) => E.div(paper, { left: x, top: 330, width: 520, height: 280, borderRadius: 20, border: `4px solid ${c}`, textAlign: 'center' },
      `<div style="font:900 40px/1.3 Zen;color:${c};padding-top:40px">${t}</div><div style="font:900 32px/1.45 Zen;color:#2a2230;margin-top:16px">${s}</div>`).ini({ o: 0 });
    const b1 = nb(150, '信頼', '人への期待', '#2b68d8'), b2 = nb(730, '判断', '会社の資料で確かめ、<br>前提が崩れたら変える', '#1b6a3a');
    E.wait(2.6);
    E.narr('師匠のノートの、最後のページには、こう書いてあった。');
    const L = E.narr('「信じることと、判断を変えることは、両立する」。', { wait: false, yomi: '信じることと、判断を変えることは、りょうりつする。' });
    E.show(b1, .3, .3); E.show(b2, .3, L.dur * .5); E.sfx('stamp', { delay: L.dur * .5, gain: .5 });
    E.at(L.end + 1.0);
  });

  /* ============================================================ S12 男爵 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .75 });
    const C = P.closeup(g, CH('baron_e_normal'), { bg: 'radial-gradient(ellipse at 50% 40%, #4a1622 0%, #200a10 75%)', imgH: 860, panelBg: 'linear-gradient(180deg,#3a121b,#1a070c)' });
    E.from(C.img, { s: .94, y: 30 }, .6, 0, 'out');
    E.wait(.5);
    E.say('baron', '信じるか、信じないか。人は、その二つだけで、決めたがる。', { talk: C.img, talkAmp: 2, yomi: '信じるか、信じないか。人は、その、ふたつだけで、決めたがる。' });
    C.swap(CH('baron_e_scheme'));
    E.say('baron', 'だが、答えは、会社の資料の中にある。', { talk: C.img, talkAmp: 2 });
    E.wait(.5);
  });

  /* ============================================================ S13 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 1818 });
    [['T', P.T_BLUE], ['I', P.I_ORANGE]].forEach(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
    });
    const st = P.sticky(g, '最終章　第19章<br>答え合わせ（完全版）', { x: 1260, y: 120, w: 580, h: 250, rot: 5, size: 40 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、最終章だブー。', { talk: pig, talkAmp: 5, yomi: 'ブヒッ。次は、さいしゅうしょうだブー。' });
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
