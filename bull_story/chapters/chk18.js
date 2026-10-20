// 完全版 第18章「人を信じることと、判断を変えること」（期待材料と、保有の判断）
// 台本: story/k/k18_人を信じることと、判断を変えること.md　元資料 p42・p44（A17・A18）。説明の補足に p21・p22・p23・p37・p40・p41
// 有名投資家の名前は出さない。「難しさの理由」は元資料の分析。オリンパスは「事案は異なる」を付ける
// 師匠の昔話はフィクション（X・助言契約・株主提案の要素を入れない）
// 用語は章の中で最初に出る時に、一般的な説明を付ける。結論の言葉は、何と何を比べたのかを同じ場面で文で言う（説明を短くしすぎない：ルール15〜17）
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
    E.at(L.end + .4);
    E.say('hat', 'ここでの前提は、その株を、持ち続ける理由に、なっていた見込みのことだ。', { yomi: 'ここでの、ぜんていは、その株を、持ち続ける理由に、なっていた、見込みのことだ。' });
    E.say('hat', '両立する、というのは、人を信頼したままでも、判断は変えられる、ということだ。', { yomi: 'りょうりつする、というのは、ひとを、しんらいしたままでも、判断は、変えられる、ということだ。' });
    E.wait(.5);
  });

  /* ============================================================ S3 最終確認にしない */
  E.scene({ name: 'check' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '「この人が関わっているから大丈夫」を、最終確認にしない', 60);
    E.show(tt, .3);
    const A = box(g, { x: 120, y: 200, w: 640, h: 420, top: '期待材料', main: '経営交代<br>ある有名投資家との関わり', sub: '', c: '#2b68d8', border: '5px solid #2b68d8', size: 42 });
    const arr = E.div(g, { left: 790, top: 360, font: '900 80px/1 Zen', color: '#ffd84a' }, '▶').ini({ o: 0 });
    const chk = (y, t, s) => E.div(g, { left: 920, top: y, width: 880, height: 120, borderRadius: 22, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', gap: '24px', padding: '0 34px', boxShadow: '0 10px 20px rgba(0,0,0,.3)', boxSizing: 'border-box' },
      `<span style="flex:none;width:52px;height:52px;border-radius:12px;border:4px solid #1b8a5a;font:900 40px/48px Zen;color:#1b8a5a;text-align:center">✓</span><span style="display:flex;flex-direction:column"><span style="font:900 40px/1.2 Zen;color:#262236">${t}</span><span style="font:800 24px/1.4 Round;color:#4a4552;margin-top:4px">${s}</span></span><span style="margin-left:auto;font:800 24px/1.2 Round;color:#6a6066">会社の資料で確かめる</span>`).ini({ o: 0 });
    const c1 = chk(195, '取引の実態', '取引が、本当に行われたか'), c2 = chk(350, '資金の入金', 'お金が、実際に会社に入ったか'), c3 = chk(505, '監査の結果', '会社の外の監査人が確かめた結果');
    E.wait(.3);
    let L = E.say('hat', '元資料は、経営の交代や、有名な投資家との関わりを、期待の材料としている。', { wait: false, yomi: 'もとしりょうは、けいえいの、こうたいや、ゆうめいな投資家との、かかわりを、期待の材料としている。' });
    rise(A, .3);
    E.at(L.end);
    E.say('hat', '期待の材料は、この先、良くなるかもしれない、と期待させる知らせのことだ。', { yomi: 'きたいの、ざいりょうは、この先、良くなるかもしれない、と、きたいさせる、知らせのことだ。' });
    L = E.say('hat', 'でも、そのあとの3つは、それぞれ、会社の資料で確かめる、としている。', { wait: false, yomi: 'でも、そのあとの、みっつは、それぞれ、会社の資料で確かめる、としている。' });
    E.show(arr, .3, .3);
    E.at(L.end);
    L = E.say('hat', '1つ目は、取引の実態。取引が、本当に行われたか、ということだ。', { wait: false, yomi: 'ひとつめは、取引の、じったい。取引が、本当に、おこなわれたか、ということだ。' });
    rise(c1, .2);
    E.at(L.end);
    L = E.say('hat', '2つ目は、資金の入金。お金が、実際に、会社に入ったか、ということだ。', { wait: false, yomi: 'ふたつめは、しきんの、にゅうきん。お金が、実際に、会社に入ったか、ということだ。' });
    rise(c2, .2);
    E.at(L.end);
    L = E.say('hat', '3つ目は、監査の結果。会社の外の監査人が、決算の数字を、確かめた結果だ。', { wait: false, yomi: 'みっつめは、かんさの結果。会社の外の、かんさにんが、決算の数字を、確かめた結果だ。' });
    rise(c3, .2);
    E.at(L.end);
    const nb = panel(g, { x: 210, y: 690, w: 1500, h: 110, size: 34, dark: true, html: '関わっている人がいる、というだけで、確かめるのを終わりにしない' });
    L = E.say('hat', 'この人が関わっているから大丈夫、を、最後の確認にしない。', { wait: false });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .6); E.sfx('ding', { delay: L.dur * .6, gain: .5 });
    E.at(L.end);
    E.say('hat', '関わっている人がいる、というだけで、確かめるのを、終わりにしない、という意味だ。', { yomi: 'かかわっている人がいる、というだけで、確かめるのを、終わりにしない、という意味だ。' });
    E.wait(.4);
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
    // 用語の説明（一般的な説明）。表の下に1つずつ出して消す
    const term = (k, t) => panel(g, { x: 100, y: 758, w: 1720, h: 80, size: 26, html: `<span><span style="color:#b8651a">${k}</span><span style="font:800 24px Round;color:#4a4552">${t}（一般的な説明）</span></span>` });
    const say1 = (n, text, o) => { const L = E.say('hat', text, { ...o, wait: false }); E.tw(n, .3, { o: [0, 1], y: [12, 0] }, 'out', .15); E.at(L.end); E.hide(n, .25); };
    E.show(hd, .3, .2);
    E.wait(.3);
    E.say('hat', '元資料は、短い目で見るときと、長い目で見るときに、分けている。', { yomi: 'もとしりょうは、みじかい目で見るときと、ながい目で見るときに、分けている。' });
    E.say('hat', '表の真ん中の、難しさの理由は、元資料の分析だ。', { yomi: 'ひょうの、まんなかの、むずかしさの理由は、もとしりょうの、ぶんせきだ。' });
    let L = E.say('hat', 'まず、短い目では、一時的に、売りを吸収して、反発しても、', { wait: false, yomi: 'まず、みじかい目では、いちじてきに、売りを、きゅうしゅうして、はんぱつしても、' });
    slide(r1);
    E.at(L.end);
    say1(term('売りを吸収する', 'は、出てきた売り注文を、買いが受け止めること'), '売りを吸収する、というのは、出てきた売り注文を、買いが受け止めることだ。', { yomi: '売りを、きゅうしゅうする、というのは、出てきた、売りちゅうもんを、買いが、受け止めることだ。' });
    say1(term('反発', 'は、下がっていた株価が、上がること'), '反発は、下がっていた株価が、上がることだ。', { yomi: 'はんぱつは、下がっていた、かぶかが、上がることだ。' });
    E.say('hat', 'そうして反発しても、新しい、監査や開示の問題が出れば、追加の売り手が、生まれ得る。', { yomi: 'そうして、はんぱつしても、新しい、かんさや、かいじの問題が出れば、ついかの、うりてが、うまれうる。' });
    E.say('hat', '新しく、売りたい人が、出てくることがある、という意味だ。', { yomi: '新しく、売りたい人が、出てくることがある、という意味だ。' });
    E.say('hat', 'だから、判断を更新する材料として、確かめるのは、2つだ。', { yomi: 'だから、判断を、こうしんする材料として、確かめるのは、ふたつだ。' });
    E.say('hat', '1つは、反発が、そのあとも、続くか。', { yomi: 'ひとつは、はんぱつが、そのあとも、続くか。' });
    E.say('hat', 'もう1つは、問題が解消した、と会社が開示したか、だ。', { yomi: 'もうひとつは、問題が、かいしょうした、と、会社が、かいじしたか、だ。' });
    E.say('hat', 'この両方を、確かめる。材料の数だけで、評価しない。', { yomi: 'この、りょうほうを、確かめる。材料の数だけで、評価しない。' });
    E.say('hat', '知らせが、いくつ出たか、という数だけで、良し悪しを、決めない、ということだ。', { yomi: '知らせが、いくつ出たか、という数だけで、よしあしを、決めない、ということだ。' });
    L = E.say('hat', '次に、長い目では、持つ期間が、長くなっても、', { wait: false, yomi: '次に、ながい目では、持つ期間が、長くなっても、' });
    slide(r2);
    E.at(L.end);
    E.say('hat', '利益の裏付けや、資金繰りは、自動的には、良くならない。', { yomi: '利益の、うらづけや、しきんぐりは、じどうてきには、良くならない。' });
    say1(term('利益の裏付け', 'は、決算の利益が、本当にあった取引から出ているか、ということ'), '利益の裏付けは、決算の利益が、本当にあった取引から、出ているか、ということだ。', { yomi: '利益の、うらづけは、決算の利益が、本当にあった取引から、出ているか、ということだ。' });
    say1(term('資金繰り', 'は、支払いに必要なお金を、やりくりすること'), '資金繰りは、支払いに必要なお金を、やりくりすることだ。', { yomi: 'しきんぐりは、しはらいに必要なお金を、やりくりすることだ。' });
    E.say('hat', 'だから、長い目では、次のことを、追う。', { yomi: 'だから、ながい目では、次のことを、追う。' });
    E.say('hat', '監査で見つかった問題が、解消したか。', { yomi: 'かんさで、見つかった問題が、かいしょうしたか。' });
    E.say('hat', '決算の訂正と、同じことを、くり返さないための、再発防止が、実行されたか。', { yomi: '決算の、ていせいと、同じことを、くり返さないための、さいはつぼうしが、実行されたか。' });
    E.say('hat', 'お金の調達が、最後まで終わったか。そして、事業から、お金が入ってきたか。', { yomi: 'お金の、ちょうたつが、最後まで終わったか。そして、事業から、お金が入ってきたか。' });
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
    const s3 = step(1010, '2013/5', '株価が問題発覚前の<br>水準へ', 'オリンパスの年次報告書の説明');
    const s4 = step(1470, '2013/6/11', '特設注意市場銘柄<br>の指定解除', '東証による<br>内部管理体制の確認を経て');
    const ar = [500, 960, 1420].map(x => E.div(g, { left: x, top: 420, font: '900 40px/1 Zen', color: '#ffd84a' }, '▶').ini({ o: 0 }));
    // 用語の説明（一般的な説明）。年表の下に1つずつ出して消す
    const term = (k, t) => panel(g, { x: 160, y: 620, w: 1600, h: 96, size: 28, html: `<span><span style="color:#b8651a">${k}</span><span style="font:800 24px Round;color:#4a4552">${t}（一般的な説明）</span></span>` });
    const d1 = term('損失計上の先送り', 'は、出た損失を、決算に載せるのを、あとの期に回すこと');
    const d2 = term('内部管理体制', 'は、会社が、仕事やお金の扱いを、自分で点検する仕組み');
    L = E.say('hat', 'オリンパスでは、損失の計上を、先送りする問題があった。', { wait: false, yomi: 'オリンパスでは、そんしつの、けいじょうを、さきおくりする問題があった。' });
    rise(s1, .2);
    E.at(L.end);
    L = E.say('hat', '損失の計上を先送りする、というのは、出た損失を、決算に載せるのを、あとに回すことだ。', { wait: false, yomi: 'そんしつの、けいじょうを、さきおくりする、というのは、出た、そんしつを、決算に、のせるのを、あとに回すことだ。' });
    rise(d1, .2);
    E.at(L.end);
    E.hide(d1, .3);
    L = E.say('hat', 'その問題のあと、オリンパスは、内部の管理の体制を、立て直した。', { wait: false, yomi: 'その問題のあと、オリンパスは、ないぶの、かんりの、たいせいを、立て直した。' });
    E.show(ar[0], .2, .2); rise(s2, .4);
    E.at(L.end);
    L = E.say('hat', '内部の管理の体制は、会社が、仕事や、お金の扱いを、自分で点検する、仕組みのことだ。', { wait: false, yomi: 'ないぶの、かんりの、たいせいは、会社が、仕事や、お金の、あつかいを、自分で、てんけんする、しくみのことだ。' });
    rise(d2, .2);
    E.at(L.end);
    E.hide(d2, .3);
    L = E.say('hat', 'そして、2013年6月11日付で、特設注意市場銘柄の指定が、解除された。', { wait: false, yomi: 'そして、2013年6月11日づけで、とくせつ、ちゅうい、しじょうめいがらの、指定が、かいじょされた。' });
    E.show(ar[2], .2, .2); rise(s4, .3);
    E.at(L.end);
    const de = term('特設注意市場銘柄', 'は、内部管理体制などに問題があり、取引所が、改善を求めて指定する銘柄');
    L = E.say('hat', '特設注意市場銘柄は、内部の管理に問題があるとして、取引所が、改善を求めて指定する銘柄だ。', { wait: false, yomi: 'とくせつ、ちゅうい、しじょうめいがらは、ないぶの、かんりに、問題があるとして、とりひきじょが、改善を求めて、指定する、めいがらだ。' });
    rise(de, .2);
    E.at(L.end);
    E.say('hat', '解除の前に、東証が、オリンパスの、内部の管理の体制を、確認している。', { yomi: 'かいじょの前に、東証が、オリンパスの、ないぶの、かんりの、たいせいを、確認している。' });
    E.say('hat', '東証は、東京証券取引所のことだ。', { yomi: '東証は、とうきょう、しょうけんとりひきじょのことだ。' });
    E.hide(de, .3);
    const d3 = term('年次報告書', 'は、会社が、1年間の活動や業績を、まとめて出す報告書');
    L = E.say('hat', 'オリンパスの年次報告書は、こう説明している。', { wait: false, yomi: 'オリンパスの、ねんじほうこくしょは、こう説明している。' });
    rise(d3, .2);
    E.at(L.end);
    E.say('hat', '年次報告書は、会社が、1年間の活動や、業績を、まとめて出す報告書だ。', { yomi: 'ねんじほうこくしょは、会社が、いちねんかんの、活動や、ぎょうせきを、まとめて出す、ほうこくしょだ。' });
    E.hide(d3, .3);
    L = E.say('hat', '2013年5月に、株価が、問題が分かる前の水準に戻った。', { wait: false, yomi: '2013年5月に、かぶかが、問題が分かる前の、すいじゅんに戻った。' });
    E.show(ar[1], .2, .2); rise(s3, .3);
    E.at(L.end);
    E.say('hat', 'ただし、元資料は、オリンパスの事案は、エスポアとは異なる、としている。', { yomi: 'ただし、もとしりょうは、オリンパスの、じあんは、エスポアとは、ことなる、としている。' });
    E.say('hat', 'どう異なるかは、このページには、書かれていない。', { yomi: 'どう、ことなるかは、このページには、書かれていない。' });
    E.say('hat', 'ここでは、元資料の、別のページの記述と、並べて見る。', { yomi: 'ここでは、もとしりょうの、べつのページの、きじゅつと、ならべて見る。' });
    // 2つの事案の中身を文で並べる（オリンパスは p42、エスポアは p41 の記述）
    const cmp = panel(g, { x: 160, y: 610, w: 1600, h: 150, size: 30, html: '<div style="text-align:left;line-height:1.6">オリンパスの問題は、損失計上の先送り<span style="font:800 22px Round;color:#6a6066">（元資料 p42）</span><br>エスポアの問題の中心は、収益取引の実在性と計上時期<span style="font:800 22px Round;color:#6a6066">（元資料 p41）</span></div>' });
    L = E.say('hat', 'オリンパスの問題は、損失の計上の、先送りだった。', { wait: false, yomi: 'オリンパスの問題は、そんしつの、けいじょうの、さきおくりだった。' });
    rise(cmp, .2);
    E.at(L.end);
    E.say('hat', '元資料は、エスポアの問題の中心を、収益の取引の、実在性と、計上の時期、としている。', { yomi: 'もとしりょうは、エスポアの問題の、ちゅうしんを、しゅうえきの取引の、じつざいせいと、けいじょうの時期、としている。' });
    E.say('hat', '取引が、実際にあったか、と、どの期の決算に入れるか、という問題だ。', { yomi: '取引が、実際にあったか、と、どの、きの、決算に入れるか、という問題だ。' });
    E.hide(cmp, .3);
    const nb = panel(g, { x: 160, y: 640, w: 1600, h: 110, size: 34, dark: true, html: '<span style="font:800 26px Round;color:#f3e6c8">元資料の分析</span>事案は異なる。見るべきは、時間の経過より、実際の改善' });
    L = E.say('hat', 'それでも、見るべきは、時間の経過より、実際の改善だ。', { wait: false, yomi: 'それでも、見るべきは、時間の、けいかより、実際の改善だ。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '時間がたつのを、待つより、実際に、何が改善したかを、見る、ということだ。', { yomi: '時間が、たつのを、待つより、実際に、何が、かいぜんしたかを、見る、ということだ。' });
    E.say('hat', 'オリンパスの例では、内部の管理の体制の、立て直しが、それにあたる。', { yomi: 'オリンパスの例では、ないぶの、かんりの、たいせいの、立て直しが、それにあたる。' });
    E.wait(.4);
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
    const top = panel(g, { x: 160, y: 170, w: 1600, h: 100, size: 34, html: '新経営陣への期待や、ある有名投資家への信頼があっても' });
    const chip = (x, t) => E.div(g, { left: x, top: 300, width: 500, height: 110, borderRadius: 22, background: '#fff', border: '5px solid #c62828', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 40px/1.2 Zen', color: '#c62828', boxShadow: '0 10px 20px rgba(0,0,0,.3)', boxSizing: 'border-box' }, t).ini({ o: 0 });
    const k1 = chip(160, '収益の証拠不足'), k2 = chip(710, '再延期'), k3 = chip(1260, '調査対応の悪化');
    // 3つそれぞれに、エスポアで何があったか（元資料 p37・p21・p22・p23・p40）
    const det = (x, t) => E.div(g, { left: x, top: 425, width: 500, height: 235, borderRadius: 18, background: 'rgba(255,255,255,.92)', padding: '16px 22px', boxSizing: 'border-box', font: '800 25px/1.5 Round', color: '#3d3540', boxShadow: '0 8px 16px rgba(0,0,0,.25)' }, t).ini({ o: 0 });
    const e1 = det(160, '4月24日、監査人は、期末の月の<br>3つの取引で、サービスを提供した<br>証拠が足りないとして、意見を<br>出さなかった（意見不表明）');
    const e2 = det(710, '決算の発表は、4月13日に、<br>4月20日へ延期された。<br>4月20日に、もう一度、<br>4月24日へ延期された');
    const e3 = det(1260, '6月30日、第三者委員会の<br>調査の中断を公表した。<br>8月20日、報告書の提出を延期した。<br>9月16日、名証は、会社が委員会に<br>虚偽説明や証拠隠蔽をした、とした');
    const res = panel(g, { x: 260, y: 680, w: 1400, h: 110, size: 38, dark: true, html: 'これらが続いた時点で、保有の前提を見直せる' });
    E.wait(.3);
    E.say('hat', '元資料は、今回の学びを、こうまとめている。', { yomi: 'もとしりょうは、今回の学びを、こうまとめている。' });
    let L = E.say('hat', '新しい経営陣への期待や、ある有名投資家への信頼があっても。', { wait: false, yomi: '新しい、けいえいじんへの、期待や、ある、ゆうめい、とうしかへの、しんらいがあっても。' });
    rise(top, .3);
    E.at(L.end);
    L = E.say('hat', '収益の証拠不足、再延期、調査への対応の悪化。', { wait: false, yomi: 'しゅうえきの、しょうこぶそく、さいえんき、ちょうさへの、対応の、あっか。' });
    rise(k1, .2); rise(k2, L.dur * .3); rise(k3, L.dur * .55);
    E.at(L.end);
    L = E.say('hat', 'これらが続いた時点で、保有の前提を、見直せる。', { wait: false, yomi: 'これらが、続いた時点で、ほゆうの、ぜんていを、見直せる。' });
    E.tw(res, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '見直す、というのは、持ち続ける理由が、まだ成り立つかを、考え直すことだ。', { yomi: '見直す、というのは、持ち続ける理由が、まだ、なりたつかを、考え直すことだ。' });
    E.say('hat', '元資料の、このページは、3つが、どの出来事かまでは、書いていない。', { yomi: 'もとしりょうの、このページは、みっつが、どの、できごとかまでは、書いていない。' });
    E.say('hat', 'ここでは、元資料の、ほかのページの記録から、近い出来事を、並べる。', { yomi: 'ここでは、もとしりょうの、ほかのページの、きろくから、ちかい、できごとを、ならべる。' });
    // 1つ目：収益の証拠不足（p37・I33）
    L = E.say('hat', '1つ目の、収益の証拠不足。', { wait: false, yomi: 'ひとつめの、しゅうえきの、しょうこぶそく。' });
    E.tw(e1, .4, { o: [0, 1], y: [16, 0] }, 'out', .2); E.sfx('pop', { delay: .2, gain: .4 });
    E.at(L.end);
    E.say('hat', '4月24日、監査人は、期末の月の、3つの取引で、証拠が足りない、とした。', { yomi: '4月24日、かんさにんは、きまつの月の、みっつの取引で、しょうこが、足りない、とした。' });
    E.say('hat', '足りなかったのは、サービスを、実際に提供した、という証拠だ。', { yomi: '足りなかったのは、サービスを、実際に、ていきょうした、という、しょうこだ。' });
    E.say('hat', '監査人は、このときの監査で、意見を出さなかった。意見不表明だ。', { yomi: 'かんさにんは、このときの、かんさで、意見を出さなかった。いけんふひょうめいだ。' });
    E.say('hat', '意見不表明は、十分な証拠が得られず、監査人が、決算について、意見を出さないことだ。', { yomi: 'いけんふひょうめいは、十分な証拠が得られず、かんさにんが、決算について、意見を出さないことだ。' });
    // 2つ目：再延期（p37・A01・A02）
    L = E.say('hat', '2つ目の、再延期。', { wait: false, yomi: 'ふたつめの、さいえんき。' });
    E.tw(e2, .4, { o: [0, 1], y: [16, 0] }, 'out', .2); E.sfx('pop', { delay: .2, gain: .4 });
    E.at(L.end);
    E.say('hat', '決算の発表は、4月13日に、4月20日へ、延期された。', { yomi: '決算の発表は、4月13日に、4月20日へ、えんきされた。' });
    E.say('hat', '4月20日には、もう一度、4月24日へ、延期された。これが、再延期だ。', { yomi: '4月20日には、もう一度、4月24日へ、えんきされた。これが、さいえんきだ。' });
    E.say('hat', '会社は、サービスの内容に、代金が、見合っているかを、くわしく調べる、とした。', { yomi: '会社は、サービスの内容に、だいきんが、見合っているかを、くわしく調べる、とした。' });
    // 3つ目：調査への対応の悪化（I41・I43・I45・p40）。中断と延期の理由は当時の会社の説明。会社の対応が原因とするのは、のちの名証の判断（p40）
    L = E.say('hat', '3つ目の、調査への対応の悪化。', { wait: false, yomi: 'みっつめの、ちょうさへの、対応の、あっか。' });
    E.tw(e3, .4, { o: [0, 1], y: [16, 0] }, 'out', .2); E.sfx('pop', { delay: .2, gain: .4 });
    E.at(L.end);
    E.say('hat', '6月30日、会社は、第三者委員会の調査が、中断した、と公表した。', { yomi: '6月30日、会社は、第三者委員会の調査が、ちゅうだんした、と、こうひょうした。' });
    E.say('hat', '理由は、諸般の事情、とされた。', { yomi: '理由は、しょはんの、じじょう、とされた。' });
    E.say('hat', '諸般の事情は、いろいろな事情、という意味の言葉だ。', { yomi: 'しょはんの、じじょうは、いろいろな事情、という意味の言葉だ。' });
    E.say('hat', '第三者委員会は、会社から独立した、外部の専門家で作る、調査の委員会だ。', { yomi: '第三者委員会は、会社から独立した、外部の専門家で作る、調査の委員会だ。' });
    E.say('hat', '7月中旬を目途にしていた、報告書の受け取りは、難しくなった、とした。', { yomi: 'しちがつ、ちゅうじゅんを、めどにしていた、ほうこくしょの、受け取りは、難しくなった、とした。' });
    E.say('hat', '7月10日、会社は、第三者委員会を、設置し直した、と公表した。', { yomi: 'しちがつとおか、会社は、第三者委員会を、せっちしなおした、と、こうひょうした。' });
    E.say('hat', '8月20日には、報告書の提出が、8月中旬の目途から、9月初旬の目途へ、延期された。', { yomi: '8月20日には、ほうこくしょの、ていしゅつが、はちがつ、ちゅうじゅんの、めどから、くがつ、しょじゅんの、めどへ、えんきされた。' });
    E.say('hat', '理由は、追加の調査が必要になったため、とされた。', { yomi: '理由は、ついかの調査が、必要になったため、とされた。' });
    E.say('hat', '名証は、エスポアの株が売り買いされていた、名古屋証券取引所のことだ。', { yomi: 'めいしょうは、エスポアの株が、売り買いされていた、なごやしょうけんとりひきじょのことだ。' });
    E.say('hat', 'のちの9月16日の判断で、名証は、会社が、監査の証拠の入手を、妨げた、とした。', { yomi: 'のちの、9月16日の判断で、めいしょうは、会社が、かんさの、しょうこの、にゅうしゅを、さまたげた、とした。' });
    E.say('hat', '第三者委員会に、虚偽の説明や、証拠の隠蔽を行った、ともしている。', { yomi: '第三者委員会に、きょぎの説明や、証拠の、いんぺいを行った、ともしている。' });
    E.say('hat', '虚偽は、事実と違うこと。隠蔽は、隠すことだ。', { yomi: 'きょぎは、事実と違うこと。いんぺいは、隠すことだ。' });
    E.say('hat', '会社の対応が原因で、報告書の受け取りが、延びた、ともしている。', { yomi: '会社の対応が原因で、ほうこくしょの、受け取りが、のびた、ともしている。' });
    E.wait(.4);
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
    E.at(L.end);
    E.say('hat', '監査人から、指摘があった、というだけで、意見不表明や、不正と、同じには扱わない。', { yomi: 'かんさにんから、してきがあった、というだけで、いけんふひょうめいや、ふせいと、同じには、あつかわない。' });
    // 同じ考え方で、元資料はエスポアの4月と9月を区別している（p37）
    const c = panel(g, { x: 160, y: 450, w: 1600, h: 200, size: 30, html: '<div style="text-align:center;line-height:1.5"><span style="font:800 24px Round;color:#6a6066">元資料 p37</span><br>4月は、監査人が、証拠が足りないとした段階。<br>9月は、第三者委員会の調査の結果が出た段階。<br><span style="color:#b8651a">元資料は、この2つを区別している</span></div>' });
    L = E.say('hat', '元資料は、エスポアについても、4月と9月を、区別している。', { wait: false, yomi: 'もとしりょうは、エスポアについても、しがつと、くがつを、区別している。' });
    rise(c, .3);
    E.at(L.end);
    E.say('hat', '4月は、監査人が、証拠が足りない、とした段階だ。', { yomi: 'しがつは、かんさにんが、しょうこが、足りない、とした段階だ。' });
    E.say('hat', '9月は、第三者委員会の、調査の結果が出た段階だ。', { yomi: 'くがつは、第三者委員会の、調査の結果が出た、だんかいだ。' });
    E.say('hat', '9月に、第三者委員会は、実在性を伴わない収益1件と、利益の前倒し1件を、認定した。', { yomi: 'くがつに、第三者委員会は、じつざいせいを、ともなわない、しゅうえき、いっけんと、りえきの、まえだおし、いっけんを、にんていした。' });
    E.say('hat', '利益の前倒しは、本来は、あとの期に入る利益を、前の期に入れることだ。', { yomi: 'りえきの、まえだおしは、ほんらいは、あとの期に入る利益を、まえの期に、いれることだ。' });
    E.say('hat', '4月の、証拠が足りない、という段階で、9月と同じ認定があった、とは扱わない。', { yomi: 'しがつの、しょうこが、足りない、という段階で、くがつと、同じ、にんていがあった、とは、あつかわない。' });
    E.wait(.4);
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
