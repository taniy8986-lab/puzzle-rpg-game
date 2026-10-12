// 最終章「答え合わせ」（2026年9月25日〜）
// 台本: story/08_最終章_答え合わせ.md　元資料 p24〜25・p31・p44・p49〜50・p55
// 「投げられない理由」の8つの型は元資料が比較のために集めた別の銘柄の掲示板の言葉（要約・銘柄名は出さない）
'use strict';
E.chapter('08');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const DISCLAIMER = 'この物語はフィクションです　｜　エスポア（3260）の事実関係は公開資料に基づきます　｜　投資助言ではありません';

  /* ============================================================ S0 アバン：朝の部屋 */
  E.scene({ name: 'avant' }, sc => {
    const g = sc.cam;
    E.bgm('daily', { fadeIn: 1.5, gain: .75 });
    const R = P.room(g);
    P.watchlist(R.screen, [['・・・', ''], ['・・・', ''], ['・・・', '']], { title: 'ウォッチリスト' });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    const note = P.note(sc.root, DISCLAIMER, { x: 40, y: 30, size: 22 }).ini({ o: 0 });
    E.show(note, .6, .4);
    P.look(sc.cam, { s: 1.3, cx: 1300, cy: 470, dur: 4.0, delay: .5 });
    E.wait(1.0);
    E.narr('エスポアを売った次の朝。ウォッチリストは、少しだけ軽くなっていた。');
    E.hide(note, .5);
    E.narr('でも、終わりじゃない。ここからが、答え合わせだ。');
    E.wait(.4);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編', catchCopy: '〜 期待が事実を追い越すとき 〜', dur: 4.6 });
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'chapter', bg: '#f6efe2' }, sc => {
    const g = sc.cam;
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'repeating-linear-gradient(90deg,#f8f1e5 0 66px,#f2e7d6 66px 132px)' });
    const band = E.div(g, { left: 0, top: 380, width: W, height: 320, background: '#1d3766' }).ini({ sx: 0 });
    band.el.style.transformOrigin = '0 50%';
    E.tw(band, .55, { sx: [0, 1] }, 'quint', .1);
    const num = E.div(g, { left: 200, top: 410, font: '900 84px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '最終章').ini({ o: 0 });
    E.tw(num, .45, { o: [0, 1], x: [-60, 0] }, 'out', .45);
    const tt_ = E.chars(g, '答え合わせ', { left: 200, top: 510, font: '900 120px/1.2 Zen', color: '#fff' });
    tt_.spans.forEach((sp, i) => E.tw(sp, .45, { o: [0, 1], y: [40, 0] }, 'back', .7 + i * .06));
    const s = E.div(g, { left: 1100, top: 620, font: '800 38px/1.2 Round', color: 'rgba(255,255,255,.8)', whiteSpace: 'nowrap' }, '2026年9月25日 〜').ini({ o: 0 });
    E.show(s, .5, 1.2);
    E.sfx('dun', { delay: .45, gain: .7 });
    E.wait(3.4);
  });
  E.trans('fade', { dur: .7, color: '#fff' });

  /* ============================================================ S2 投げた後の答え合わせ（7つの手順） */
  E.scene({ name: 'notebook' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .8, gain: .85 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 42% 42%, #7a5f46 0%, #4a3829 55%, #241b14 100%)' });
    const paper = P.paper(g, { x: 120, y: 60, w: 1120, h: 790, rot: 0, lineGap: 90 });
    E.div(paper, { left: 110, top: 14, font: '900 40px/1.2 Zen', color: '#3a2c1a' }, '投げた後の、答え合わせ');
    const items = [
      '① 買った時の主シナリオを、1文で書く',
      '② そのシナリオを支えた、一次資料・数字を並べる',
      '③ 最初に異変が出た日を、特定する',
      '④ その時、なぜ判断を変えなかったかを書く',
      '⑤ 有名人・仲間の発言が、判断を上書きしていなかったか',
      '⑥ 「何が起きたら撤退するか」を、次は買う前に決める',
      '⑦ 損切り後も同じ基準で答え合わせし、プロセスを採点する',
    ].map((t, i) => E.div(paper, { left: 110, top: 96 + i * 90, width: 980, font: '800 34px/90px Round', color: '#2a2430', whiteSpace: 'nowrap' }, t).ini({ o: 0 }));
    const bull = E.actor(g, 'bull', { x: 1580, y: 1090, h: 760, pose: 'front' });
    E.breathe(bull, .01, 2.2);
    const pen = E.div(g, { left: 1210, top: 700, width: 420, height: 22, borderRadius: 11, background: 'linear-gradient(180deg,#2e3a52,#1a2233)' }).ini({ r: -30 });
    E.wait(.6);
    E.narr('師匠のノートの最後のページに、書いてあったこと。');
    E.narr('損切りを「授業料」で終わらせず、次のルールに変える。', { yomi: '損切りを、授業料で終わらせず、次のルールに変える。' });
    const answers = [
      ['私のシナリオは、「第三者委員会が調べて、きっと大丈夫」。', '私のシナリオは、第三者委員会が調べて、きっと大丈夫。'],
      ['支えていた資料は……なかった。あったのは、SNSの声と、私の希望。', '支えていた資料は、なかった。あったのは、SNSの声と、私の希望。'],
      ['最初の異変は、5月27日。意見不表明。', null],
      ['「悪い決算かな」で、済ませてしまったから。', '悪い決算かな、で、済ませてしまったから。'],
      ['していた。「丁寧に調べている」も、「大株主は売らない」も。', 'していた。丁寧に調べている、も、大株主は売らない、も。'],
      ['次は、買う前に決める。監査意見、上場基準、延期……何が起きたら、前提を捨てるか。', '次は、買う前に決める。監査意見、上場基準、延期。何が起きたら、前提を捨てるか。'],
    ];
    answers.forEach(([t, y], i) => {
      E.tw(items[i], .4, { o: [0, 1], x: [-30, 0] }, 'out'); E.sfx('pen', { gain: .5 });
      E.say('bull', t, { talk: bull, talkAmp: 2, yomi: y || undefined, delay: .5 });
    });
    E.tw(items[6], .4, { o: [0, 1], x: [-30, 0] }, 'out'); E.sfx('pen', { gain: .5 });
    E.narr('投げたのは、負けじゃない。間違った前提から、お金と判断基準を取り戻したこと。', { delay: .4 });
    E.wait(.4);
  });

  /* ============================================================ S3 投げられない理由は、一つじゃない */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'types' }, sc => {
    const g = sc.cam;
    E.bgm('villain', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '「投げられない理由」は、一つじゃなかった', 36);
    E.show(tt, .3);
    P.note(sc.root, '※元資料が比較のために集めた、別の銘柄の掲示板の言葉（要約）', { x: 1130, y: 830, size: 22, dark: true });
    const types = [
      ['人物型', '「信じる者が救われる」', '人物への信頼', '#2b68d8'],
      ['値動き型', '「上がる前の屈伸運動」', '下落そのもの', '#17915a'],
      ['集団型', '「みんなでゴリラ（握力）」', '仲間の握力', '#d9822b'],
      ['時間型', '「現物なら無期限」', '時間', '#7a5ad8'],
      ['数学型', '「300倍すれば戻る」', '巨大な倍率の可能性', '#b3122b'],
      ['生活型', '「笑って毎日過ごせる」', '損益と幸福の分離', '#e0457b'],
      ['不可知型', '「この先は誰にもわからない」', '不確実性そのもの', '#5a6474'],
      ['人生観型', '「失敗して這い上がるのが醍醐味」', '失敗の物語化', '#8a5a2b'],
    ].map(([k, q, w, c], i) => {
      const x = 90 + (i % 4) * 440, y = 130 + Math.floor(i / 4) * 340;
      const n = E.div(g, { left: x, top: y, width: 410, height: 310, borderRadius: 24, background: '#fffdf8', overflow: 'hidden', boxShadow: '0 14px 28px rgba(0,0,0,.4)' }).ini({ o: 0 });
      E.div(n, { left: 0, top: 0, width: 410, height: 70, background: c }, `<div style="position:absolute;left:0;top:0;width:100%;text-align:center;font:900 34px/70px Zen;color:#fff">${k}</div>`);
      E.div(n, { left: 20, top: 96, width: 370, textAlign: 'center', font: '800 27px/1.5 Round', color: '#3d3540' }, q);
      E.div(n, { left: 20, top: 210, width: 370, textAlign: 'center', font: '900 26px/1.4 Zen', color: c }, `→ ${w}`);
      return n;
    });
    E.wait(.5);
    const L = E.narr('同じ頃、別の銘柄の掲示板には、こんな言葉が並んでいた。', { wait: false });
    types.forEach((n, i) => { E.tw(n, .4, { o: [0, 1], y: [40, 0] }, 'back', .3 + i * .28); E.sfx('page', { delay: .3 + i * .28, gain: .5 }); });
    E.at(Math.max(L.end, E.T + .3 + 8 * .28 + .5));
    E.say('hat', '同じ「売らない」でも、理由は、全員ちがう。', { yomi: '同じ、売らない、でも、理由は、全員ちがう。' });
    E.say('eve', '人を信じたり、「みんなで持とう」ってなったり、「現物なら期限はない」って思ったり……。', { yomi: '人を信じたり、みんなで持とう、ってなったり、現物なら期限はない、って思ったり。' });
    E.say('hat', 'どれも、人の気持ちとしては自然だ。でも、株を持つ理由にはならない。');
    E.say('hat', 'だから、判断を一つにそろえる質問がある。');
    E.wait(.2);
  });

  /* ============================================================ S4 ゼロベース質問 */
  E.scene({ name: 'zero' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, 'ゼロベース質問', 50);
    E.show(tt, .3);
    const q = E.div(g, { left: 210, top: 150, width: 1500, height: 260, borderRadius: 30, background: '#fffdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: '900 44px/1.6 Zen', color: '#262236', boxShadow: '0 20px 40px rgba(0,0,0,.4)' },
      '今のポジションの時価を、全部現金でもらったとして——<br><span style="color:#b3122b">今日、この銘柄を、同じ金額だけ、新しく買うか？</span>').ini({ o: 0 });
    const yes = E.div(g, { left: 210, top: 470, width: 720, height: 300, borderRadius: 26, background: 'rgba(23,145,90,.18)', border: '5px solid #17915a', padding: '24px 30px', font: '800 30px/1.6 Round', color: '#cfeedd' },
      '<div style="font:900 50px/1.2 Zen;color:#9ee6c0;margin-bottom:14px">YES なら</div>根拠を、出来高・板・歩値・浮動株・<br>信用・貸株・会社の事実で書く').ini({ o: 0 });
    const no = E.div(g, { left: 990, top: 470, width: 720, height: 300, borderRadius: 26, background: 'rgba(198,40,40,.18)', border: '5px solid #c62828', padding: '24px 30px', font: '800 30px/1.6 Round', color: '#ffd6d6' },
      '<div style="font:900 50px/1.2 Zen;color:#ff8a8a;margin-bottom:14px">NO なら</div>取得単価・仲間・人物への信頼・<br>耐えた時間が、保有を固定していないか点検').ini({ o: 0 });
    E.tw(q, .5, { o: [0, 1], s: [.9, 1] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .6 });
    E.wait(.9);
    E.say('hat', '今のポジションを、全部現金でもらったとする。今日、この銘柄を、同じ金額だけ、新しく買うか？');
    let L = E.say('hat', 'イエスなら、根拠を、出来高・板・会社の事実で書く。', { wait: false });
    E.tw(yes, .45, { o: [0, 1], x: [-40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    L = E.say('hat', 'ノーなら、取得単価や、仲間や、耐えた時間が、保有を固定していないか、点検する。', { wait: false });
    E.tw(no, .45, { o: [0, 1], x: [40, 0] }, 'back', .2); E.sfx('slide', { delay: .2 });
    E.at(L.end);
    const pig = E.img(g, CH('pig_e_shock'), { left: 1520, top: 760, height: 330 }).ini({ o: 0 });
    E.tw(pig, .4, { o: [0, 1], y: [200, 0] }, 'back');
    E.sfx('snort', { delay: .1 });
    E.say('pig', 'ブヒッ。オレは……ノーだブー。', { talk: pig, talkAmp: 4, delay: .2, yomi: 'ブヒッ。オレは、ノーだブー。' });
    E.tw(pig, .3, { o: 0, y: 200 }, 'in2');
    E.wait(.4);
  });

  /* ============================================================ S5 自分が助かる価格と、新しく買う人の価格 */
  E.scene({ name: 'prices' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '同じ55円を、3人が見ている', 40);
    E.show(tt, .3);
    P.note(sc.root, '※取得単価700円は物語上の設定。計算は元資料の数字から', { x: 1180, y: 830, size: 22, dark: true });
    const price = E.div(g, { left: 760, top: 130, width: 400, height: 110, borderRadius: 22, background: '#ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 60px/1 Noto', color: '#3a2c10', boxShadow: '0 12px 24px rgba(0,0,0,.35)' }, '9/25 終値 55円').ini({ o: 0 });
    const views = [
      ['新しく買う人', '55円から先の<br>出来高・板・会社の事実と<br>期待リターン', '', '#2b68d8'],
      ['700円で買った人', '55円 → 700円', '12.73倍（＋1,172.73%）<br>で損益ゼロ', '#d9822b'],
      ['1,270円で買った人', '55円 → 1,270円', '23.09倍（＋2,209.09%）<br>で損益ゼロ', '#c62828'],
    ].map(([who, a, b, c], i) => {
      const n = E.div(g, { left: 120 + i * 580, top: 300, width: 540, height: 470, borderRadius: 26, background: '#fffdf8', overflow: 'hidden', boxShadow: '0 16px 30px rgba(0,0,0,.4)' }).ini({ o: 0 });
      E.div(n, { left: 0, top: 0, width: 540, height: 90, background: c }, `<div style="position:absolute;left:0;top:0;width:100%;text-align:center;font:900 38px/90px Zen;color:#fff">${who}</div>`);
      E.div(n, { left: 30, top: 120, width: 480, textAlign: 'center', font: '800 32px/1.6 Round', color: '#3d3540' }, a);
      if (b) E.div(n, { left: 30, top: 300, width: 480, textAlign: 'center', font: '900 36px/1.5 Noto', color: c }, b);
      return n;
    });
    E.pop(price, .4, .3); E.sfx('pop', { delay: .3 });
    E.wait(.8);
    let L = E.say('hat', '同じ55円でも、見ている「必要な価格」がちがう。', { wait: false, yomi: '同じ55円でも、見ている、必要な価格、がちがう。' });
    views.forEach((n, i) => { E.tw(n, .45, { o: [0, 1], y: [40, 0] }, 'back', .2 + i * .35); E.sfx('slide', { delay: .2 + i * .35 }); });
    E.at(L.end);
    E.say('hat', '新しく買う人にとって、2倍は大きい。でも、深い含み損の人には、2倍でも救済の途中だ。');
    E.say('hat', '上がる途中では、上で買った人の戻り売りも、吸収しなきゃならない。');
    E.say('hat', '「自分が助かる価格」と、「新しい人が買いたい価格」は、同じじゃない。', { yomi: '自分が助かる価格、と、新しい人が買いたい価格、は、同じじゃない。' });
    E.wait(.3);
  });

  /* ============================================================ S6 再発防止チェックリスト */
  E.scene({ name: 'checklist' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '再発防止チェックリスト（8項目）', 36);
    E.show(tt, .3);
    const items = [
      '① 発言を、原文のまま書く（言っていないことを足さない）',
      '② 一次資料を確認する（会社の発表・取引所・EDINET）',
      '③ 事実／解釈／期待に分ける（MBO・TOB・救済は、開示がなければ期待）',
      '④ 反証を先に探す（間違いなら、どんな資料・値動きが出るか）',
      '⑤ 価格ではなく期待値（外れた時の損失幅も置く）',
      '⑥ 撤退条件を先に決める（延期・監査・上場基準）',
      '⑦ 同じポジションの仲間だけで、答え合わせしない',
      '⑧ AIには反証役をやらせる（「この仮説を壊して」）',
    ];
    const rows = items.map((t, i) => {
      const n = E.div(g, { left: 160, top: 120 + i * 86, width: 1600, height: 74, borderRadius: 16, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', paddingLeft: 24, font: '900 30px/1.2 Zen', color: '#262236', whiteSpace: 'nowrap', boxShadow: '0 8px 16px rgba(0,0,0,.3)' },
        `<span class="bx" style="flex:none;display:inline-block;width:40px;height:40px;border-radius:8px;border:5px solid #8a8070;margin-right:22px;position:relative"></span>${t}`).ini({ o: 0 });
      const chk = E.svg(n, { left: 20, top: 10, width: 54, height: 54 }, '0 0 100 100', '<path d="M18 52 L42 76 L86 24" fill="none" stroke="#17915a" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>').ini({ o: 0 });
      n.chk = chk;
      return n;
    });
    rows.forEach((n, i) => E.tw(n, .35, { o: [0, 1], x: [-40, 0] }, 'back', .2 + i * .1));
    E.wait(1.4);
    const lines = [
      ['eve', '① 発言は原文のまま。言っていないことを、足さない。', 'いち。発言は原文のまま。言っていないことを、足さない。'],
      ['hat', '② 一次資料を確かめる。会社の発表、取引所、EDINET。', 'に。一次資料を確かめる。会社の発表、取引所、エディネット。'],
      ['eve', '③ 事実、解釈、期待に分ける。MBOやTOBは、開示がなければ期待。', 'さん。事実、解釈、期待に分ける。MBOやTOBは、開示がなければ期待。'],
      ['hat', '④ 反証を先に探す。自分が間違いなら、どんな資料や値動きが出るか。', 'よん。反証を先に探す。自分が間違いなら、どんな資料や値動きが出るか。'],
      ['eve', '⑤ 値段じゃなく、期待値。上がる幅だけじゃなく、外れた時の損も置く。', 'ご。値段じゃなく、期待値。上がる幅だけじゃなく、外れた時の損も置く。'],
      ['hat', '⑥ 撤退の条件を、先に決める。延期、監査、上場基準。', 'ろく。撤退の条件を、先に決める。延期、監査、上場基準。'],
      ['eve', '⑦ 同じポジションの仲間だけで、答え合わせしない。', 'なな。同じポジションの仲間だけで、答え合わせしない。'],
      ['hat', '⑧ AIには、反証役をやらせる。「この仮説を壊して」ってね。', 'はち。AIには、反証役をやらせる。この仮説を壊して、ってね。'],
    ];
    lines.forEach(([who, t, y], i) => {
      rows.forEach((n, j) => E.tw(n, .25, j === i ? { s: 1.02, bright: 1 } : { bright: .6, s: 1 }, 'out'));
      const L = E.say(who, t, { wait: false, yomi: y, gap: .25 });
      E.tw(rows[i].chk, .3, { o: [0, 1], s: [1.8, 1] }, 'back', L.dur * .7); E.sfx('click', { delay: L.dur * .7, gain: .8 });
      E.at(L.end);
    });
    rows.forEach(n => E.tw(n, .3, { bright: 1, s: 1 }, 'out'));
    E.say('hat', 'この8つを守るだけで、延期＝良い、辞任＝良い、売らない＝救済……って癖は、かなり抑えられる。', { yomi: 'この8つを守るだけで、延期イコール良い、辞任イコール良い、売らないイコール救済、って癖は、かなり抑えられる。' });
    E.wait(.3);
  });

  /* ============================================================ S7 最終原則 */
  E.scene({ name: 'principles' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .9 });
    P.nightBg(g);
    E.particles(g, { n: 36, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .5, seed: 61 });
    const lines = ['事実は、一次資料で確認する', '数字は、計算する', '期待は、期待とラベルを貼る', '有名人の発言でも、自分の撤退条件を上書きさせない'];
    const L = lines.map((t, i) => E.div(g, { left: 0, top: 150 + i * 140, width: W, textAlign: 'center', font: '900 56px/1.3 Zen', color: '#f3e6c8', textShadow: '0 4px 14px rgba(0,0,0,.5)' }, t).ini({ o: 0 }));
    const glow = i => { E.tw(L[i], .5, { o: [0, 1], y: [20, 0] }, 'out'); E.sfx('shine', { gain: .45 }); };
    E.wait(.5);
    glow(0); E.narr('事実は、一次資料で確認する。', { gap: .1 });
    glow(1); E.narr('数字は、計算する。');
    glow(2); E.narr('期待は、期待とラベルを貼る。');
    glow(3); E.narr('有名人の発言でも、自分の撤退条件を、上書きさせない。');
    L.forEach(n => E.tw(n, .5, { o: .35 }, 'out'));
    const last = E.div(g, { left: 0, top: 290, width: W, textAlign: 'center', font: '900 72px/1.5 Zen', color: '#ffd84a', textShadow: '0 0 30px rgba(255,216,74,.6)' }, '失敗は、次の判断基準に変えた時に<br>初めて資産になる').ini({ o: 0 });
    const L2 = E.narr('失敗は、次の判断基準に変えた時に、初めて資産になる。', { wait: false });
    E.tw(last, .8, { o: [0, 1], s: [.92, 1] }, 'out', .2); E.sfx('chime', { delay: .2, gain: .6 });
    E.at(L2.end + 1.2);
  });

  /* ============================================================ S8 最後の対面 */
  E.trans('fade', { dur: .9, color: '#000' });
  E.scene({ name: 'face_off' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .85 });
    const L = P.lair(g, { screen: false, faces: ['normal', 'smile', 'surprise'] });
    E.breathe(L.baron, .008, 1.5);
    E.breathe(L.hat, .01, 1.9);
    L.pigs.forEach((p, i) => E.breathe(p, .012, 2.3, i));
    const bull = E.actor(g, 'bull', { x: 700, y: 1080, h: 640, pose: 'back' });
    E.breathe(bull, .01, 2.0);
    E.from(bull, { x: -500 }, 1.4, .3, 'out');
    for (let i = 0; i < 4; i++) E.sfx('footstep', { delay: .4 + i * .32, gain: .6 });
    E.tw(sc.cam, 2.0, { s: [1.15, 1], y: [80, 0] }, 'inOut');
    E.wait(2.0);
    E.say('baron', '……来たか。', { talk: L.baron, talkAmp: 1.5, yomi: '来たか。', gap: .5 });
  });

  E.scene({ name: 'bull_vow' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_normal'), { bg: 'radial-gradient(ellipse at 50% 40%, #4c1820, #140707)', panelBg: 'linear-gradient(180deg,#3a1018,#14060a)', imgH: 820 });
    E.tw(C.img, 9, { s: [1, 1.05] }, 'linear');
    E.wait(.3);
    E.say('bull', '師匠。私は、希望を捨てません。', { talk: C.img, talkAmp: 2 });
    E.say('bull', 'でも、希望を、事実の代わりには使わない。', { talk: C.img, talkAmp: 2 });
    E.wait(.3);
  });

  E.scene({ name: 'baron_photo' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: 1.2, gain: .8 });
    const C = P.closeup(g, CH('baron_e_normal'), { bg: 'radial-gradient(ellipse at 50% 40%, #4c1820, #140707)', panelBg: 'linear-gradient(180deg,#2c0f14,#120607)', imgH: 820 });
    E.tw(C.img, 10, { s: [1, 1.04] }, 'linear');
    // 手元の写真に色が戻る
    const fr = E.div(g, { left: 1300, top: 300, width: 300, height: 330, borderRadius: 10, background: '#8a5a30', boxShadow: '0 20px 40px rgba(0,0,0,.6)' }).ini({ r: 6, o: 0 });
    E.img(fr, CH('mentor_photo'), { left: 18, top: 18, width: 264, height: 294, objectFit: 'cover' });
    const col = E.img(fr, CH('mentor_photo_color'), { left: 18, top: 18, width: 264, height: 294, objectFit: 'cover' }).ini({ o: 0 });
    E.wait(1.2);
    E.show(fr, .6);
    E.tw(col, 2.0, { o: [0, .55] }, 'inOut', .8);
    E.sfx('swell', { delay: .6, gain: .35 });
    E.wait(2.6);
    E.say('baron', '押し目おじさんは、もういない。……今は、まだ。', { talk: C.img, talkAmp: 1.5, yomi: '押し目おじさんは、もういない。今は、まだ。', gap: .6 });
  });

  E.scene({ name: 'wait_for' }, sc => {
    const g = sc.cam;
    const C = P.closeup(g, CH('bull_e_smile'), { bg: 'radial-gradient(ellipse at 50% 40%, #4c1820, #140707)', panelBg: 'linear-gradient(180deg,#3a1018,#14060a)', imgH: 820 });
    E.from(C.img, { s: .94 }, .4, 0, 'back');
    E.wait(.3);
    E.say('bull', '待ってます。', { talk: C.img, talkAmp: 2, gap: .6 });
  });

  E.scene({ name: 'lair_end' }, sc => {
    const g = sc.cam;
    E.bgm('daily', { fadeIn: 1.0, gain: .75 });
    const L = P.lair(g, { screen: false, faces: ['smile', 'laugh', 'normal'] });
    E.breathe(L.baron, .008, 1.5);
    E.breathe(L.hat, .01, 1.9);
    L.pigs.forEach((p, i) => E.breathe(p, .012, 2.3, i));
    const bull = E.actor(g, 'bull', { x: 700, y: 1080, h: 640, pose: 'back' });
    E.breathe(bull, .01, 2.0);
    P.look(sc.cam, { s: 1.25, cx: 380, cy: 720, dur: 1.0 });
    E.say('hat', '……いい弟子じゃないか。', { talk: L.hat, yomi: 'いい弟子じゃないか。', delay: .4 });
    P.look(sc.cam, { s: 1.3, cx: 1685, cy: 330, dur: .9 });
    E.set(L.call, { face: 'laugh' }, .3);
    E.say('eve', 'ねえねえ、次はどの銘柄を見る〜？', { talk: L.call, talkAmp: 3, delay: .3, yomi: 'ねえねえ、次はどの銘柄を見るー？' });
    E.unsub(.3);
    P.look(sc.cam, { s: 1, cx: 960, cy: 540, dur: 1.2 });
    E.wait(1.6);
  });

  /* ============================================================ S9 エンドカード */
  E.trans('fade', { dur: 1.0, color: '#000' });
  E.scene({ name: 'end', bg: '#10224a' }, sc => {
    const g = sc.cam;
    E.bgm('title', { fadeIn: .6, gain: .8 });
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(circle at 50% 40%, #2c5596 0%, #1d3766 48%, #0e1d40 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#fff6c8', area: [0, 0, W, H], speed: .6, seed: 63 });
    const t1 = E.div(g, { left: 0, top: 110, width: W, textAlign: 'center', font: '900 40px/1.2 Zen', color: '#27b4c2' }, 'ブルちゃん証券 〜株価の向こう側〜').ini({ o: 0 });
    const t2 = E.div(g, { left: 0, top: 170, width: W, textAlign: 'center', font: '900 92px/1.2 Zen', color: '#fff', textShadow: '0 8px 0 #27b4c2' }, 'エスポア（3260）編').ini({ o: 0 });
    const kan = E.div(g, { left: 0, top: 300, width: W, textAlign: 'center', font: '900 150px/1 Zen', color: '#ffd84a', textShadow: '0 0 40px rgba(255,216,74,.6)' }, '完').ini({ o: 0 });
    const chapters = ['第1章 意見不表明', '第2章 調査は止まった', '第3章 延期の呪文', '第4章 審判の日', '第5章 9月18日の幻', '第6章 信じる者は救われる？', '第7章 投げる勇気', '最終章 答え合わせ'];
    const list = chapters.map((t, i) => E.div(g, { left: 220 + (i % 2) * 760, top: 500 + Math.floor(i / 2) * 60, width: 720, font: '800 32px/1.3 Round', color: 'rgba(255,255,255,.9)', whiteSpace: 'nowrap' }, t).ini({ o: 0 }));
    const disc = E.div(g, { left: 0, top: 770, width: W, textAlign: 'center', font: '800 24px/1.5 Round', color: 'rgba(255,255,255,.75)' }, DISCLAIMER).ini({ o: 0 });
    const credit = E.div(g, { left: 0, top: 820, width: W, textAlign: 'center', font: '800 20px/1.6 Round', color: 'rgba(255,255,255,.65)' },
      'フォント：M PLUS Rounded 1c ／ Zen Maru Gothic ／ Dela Gothic One ／ Noto Sans JP ／ Anton（SIL Open Font License）<br>声：Open JTalk（名古屋工業大学）＋ HTS Voice "Mei"（MMDAgent, Nagoya Institute of Technology, CC BY 3.0）　音楽・効果音：オリジナル（合成）').ini({ o: 0 });
    E.show(t1, .5, .3); E.show(t2, .6, .6);
    E.tw(kan, .6, { o: [0, 1], s: [2.2, 1] }, 'in2', 1.2); E.sfx('fanfare', { delay: 1.0, gain: .8 }); E.sfx('impact', { delay: 1.75, gain: .5 });
    list.forEach((n, i) => E.show(n, .4, 2.2 + i * .15));
    E.show(disc, .6, 3.6); E.show(credit, .6, 4.0);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 520, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 4.2);
    E.sfx('snort', { delay: 4.4 });
    E.wait(5.0);
    E.say('pig', 'ブヒッ。最後まで見てくれて、ありがとうだブー。', { talk: pig, talkAmp: 5 });
    E.unsub(.4);
    E.wait(5.0);
  });
  E.bgmStop(3.0, -3.0);
  E.finish();
}
