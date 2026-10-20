// 完全版 第15章「増資は、払い込まれていた」（純資産の計算）
// 台本: story/k/k15_増資は、払い込まれていた.md　元資料 p23・p24・p37・p39・p40・p43
// −1億868万2,000円は第三者委員会の試算（会社の監査済み訂正決算ではない）。「監査で認められた利益と増資で足りなかった」だけでは説明できない、は元資料の分析
// 用語は章の中で最初に出る時に、一般的な説明を付ける（説明を短くしすぎない：ルール15〜17）
'use strict';
E.chapter('k15');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const box = (g, { x, y, w = 700, h = 280, top = '', main = '', sub = '', c = '#262236', border = 'none', size = 50 }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 26, background: 'rgba(255,255,255,.95)', border, boxShadow: '0 12px 24px rgba(0,0,0,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 30px' },
    `${top ? `<div style="font:800 28px/1.3 Round;color:#6a6066">${top}</div>` : ''}<div style="font:900 ${size}px/1.3 Zen;color:${c};white-space:nowrap">${main}</div>${sub ? `<div style="font:800 30px/1.5 Round;color:#4a4552;margin-top:14px">${sub}</div>` : ''}`).ini({ o: 0 });
  const rise = (n, d = 0) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', d); E.sfx('pop', { delay: d, gain: .5 }); };
  const fiction = sc => P.note(sc.root, 'ブルちゃんの売買はフィクションです', { x: 1440, y: 40, size: 24, dark: true });

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

  /* ============================================================ S0 アバン：ブルちゃんの部屋 */
  E.scene({ name: 'avant' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: 1.0, gain: .75 });
    const R = P.room(g, { night: true });
    const scr = E.div(R.screen, { left: 0, top: 0, width: 492, height: 290, background: '#f4f6f9' });
    E.div(scr, { left: 20, top: 24, font: '900 30px/1.6 Zen', color: '#22252b' }, '増資　4,995万円<br><span style="font:800 22px Round;color:#6a6066">2/27 払込完了</span>');
    E.div(scr, { left: 20, top: 150, font: '900 30px/1.6 Zen', color: '#c62828' }, '純資産　−1億868.2万円<br><span style="font:800 22px Round;color:#6a6066">第三者委員会の試算（確定値ではない）</span>');
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    P.look(sc.cam, { s: 1.25, cx: 1200, cy: 420, dur: 4, delay: .3 });
    E.wait(.8);
    E.narr('上場廃止が決まったあと、私は、2月の増資を、もう一度調べた。');
    E.narr('お金は、入っていたはずだ。それなのに、なぜ、委員会の試算では、純資産がマイナスなのか。', { yomi: 'お金は、入っていたはずだ。それなのに、なぜ、いいんかいの、しさんでは、じゅんしさんが、マイナスなのか。' });
    E.wait(.3);
  });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 15, title: '増資は、払い込まれていた', sub: '純資産の計算（第三者委員会の試算）', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 増資は、払い込まれていた */
  E.scene({ name: 'paid' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .6, gain: .85 });
    P.slate(g);
    const tt = P.heading(g, '増資は、払い込まれていた（元資料 p39・A04）', 60);
    E.show(tt, .3);
    const c1 = box(g, { x: 160, y: 190, w: 760, h: 300, top: '2026年2月27日', main: '払込完了', sub: '割当先：個人1名（開示どおり）', c: '#2b68d8', size: 64 });
    const c2 = box(g, { x: 1000, y: 190, w: 760, h: 300, top: '計算', main: '90,000株 × 555円', sub: '＝ 49,950,000円（4,995万円）', c: '#262236', size: 52 });
    // 増資・第三者割当・払込みとは（一般的な説明）
    const ex = panel(g, { x: 160, y: 520, w: 1600, h: 170, size: 28, html: '<div style="text-align:left;font:800 28px/1.6 Round;color:#3d3540"><b style="color:#b8651a">増資</b>は、会社が、新しい株を出して、お金を集めること<br><b style="color:#b8651a">第三者割当</b>は、決まった相手に、新しい株を買ってもらうやり方<br><b style="color:#b8651a">払込み</b>は、株を引き受けた人が、会社にお金を払い込むこと<span style="font:800 22px Round;color:#6a6066">（一般的な説明）</span></div>' });
    E.wait(.3);
    let L = E.say('hat', 'まず、2月の増資のお金は、払い込まれていた。', { wait: false, yomi: 'まず、2月の、ぞうしの、お金は、払い込まれていた。' });
    rise(c1, .3);
    E.at(L.end);
    L = E.say('hat', '増資は、会社が、新しい株を出して、お金を集めることだ。', { wait: false, yomi: 'ぞうしは、会社が、新しい株を出して、お金を集めることだ。' });
    rise(ex, .2);
    E.at(L.end);
    E.say('hat', 'この増資は、第三者割当だ。決まった相手に、新しい株を買ってもらう、やり方だ。', { yomi: 'この、ぞうしは、だいさんしゃわりあてだ。決まった相手に、新しい株を買ってもらう、やり方だ。' });
    E.say('hat', '払込みは、株を引き受けた人が、会社に、お金を払い込むことだ。', { yomi: 'はらいこみは、株を引き受けた人が、会社に、お金を払い込むことだ。' });
    E.say('hat', '会社は、2月27日に、払込みが完了した、と開示している。', { yomi: '会社は、2月27日に、はらいこみが完了した、と開示している。' });
    E.say('hat', '新しい株を引き受けたのは、開示どおり、個人1名だ。', { yomi: '新しい株を引き受けたのは、開示どおり、こじん、いちめいだ。' });
    L = E.say('hat', '株の数は、9万株。1株の値段は、555円。', { wait: false, yomi: '株の数は、キューマンカブ。ひとかぶの値段は、ゴヒャクゴジューゴエン。' });
    rise(c2, .2);
    E.at(L.end);
    E.say('hat', 'かけ合わせると、4,995万円になる。', { yomi: 'かけあわせると、四千九百九十五万円になる。' });
    E.say('hat', '元資料も、この額は、払込みの完了の開示で、確かめられる、としている。', { yomi: 'もとしりょうも、この、がくは、はらいこみの完了の開示で、確かめられる、としている。' });
    E.hide(ex, .3);
    const nb = panel(g, { x: 260, y: 600, w: 1400, h: 110, size: 34, dark: true, html: '増資のお金は、入っていた。「お金を集められなかった」のではない' });
    L = E.say('hat', 'お金は、入っていた。それでも、委員会の試算では、純資産がマイナスになる。', { wait: false, yomi: 'お金は、入っていた。それでも、いいんかいの、しさんでは、じゅんしさんが、マイナスになる。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .4); E.sfx('ding', { delay: .4, gain: .5 });
    E.at(L.end);
    E.say('hat', 'つまり、お金を集められなかったせいで、マイナスになった、のではない。');
    E.say('hat', 'なぜ、マイナスになるのかを、次の計算で、確かめる。');
    E.wait(.4);
  });

  /* ============================================================ S3 純資産の計算（滝の図） */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'waterfall' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = E.div(g, { left: 80, top: 40, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '連結純資産の計算（元資料 p39・単位：万円）');
    E.div(g, { left: 1240, top: 48, font: '800 24px/1.2 Round', color: 'rgba(243,230,200,.8)', whiteSpace: 'nowrap' }, '修正値は第三者委員会の試算（確定値ではない）');
    // 金額（万円）→ 画面の y
    const y = v => 170 + (2500 - v) * 0.04214;
    const zero = E.div(g, { left: 120, top: y(0) - 1.5, width: 1680, height: 0, borderTop: '3px dashed rgba(243,230,200,.6)' });
    E.div(g, { left: 70, top: y(0) - 18, font: '900 26px/1.2 Noto', color: 'rgba(243,230,200,.85)' }, '0');
    const items = [
      { a: 0, b: -4045.7, c: '#8a6f78', n: '前期末<br>（2025/2末）', v: '−4,045.7' },
      { a: -4045.7, b: 949.3, c: '#2b68d8', n: '増資', v: '＋4,995.0' },
      { a: 949.3, b: 2131.8, c: '#2b68d8', n: '当初の<br>当期純利益', v: '＋1,182.5' },
      { a: 0, b: 2131.8, c: '#e8a33a', n: '当初の発表<br>（2026/2末）', v: '＋2,131.8' },
      { a: 2131.8, b: -8868.2, c: '#d84a4a', n: '委員会：取引①<br>売上の取消', v: '−1億1,000' },
      { a: -8868.2, b: -10868.2, c: '#d84a4a', n: '委員会：取引③<br>次の期へ回す', v: '−2,000' },
      { a: 0, b: -10868.2, c: '#8e1c24', n: '委員会の<br>修正計算', v: '−1億868.2' },
    ];
    const bars = items.map((it, i) => {
      const x = 140 + i * 240, top = y(Math.max(it.a, it.b)), h = Math.abs(y(it.a) - y(it.b));
      const bar = E.div(g, { left: x, top, width: 180, height: Math.max(4, h), borderRadius: 8, background: it.c, boxShadow: '0 8px 18px rgba(0,0,0,.35)', transformOrigin: it.b < it.a ? '50% 0' : '50% 100%' }).ini({ sy: 0 });
      const val = E.div(g, { left: x - 30, top: it.b < it.a ? top + h + 6 : top - 44, width: 240, textAlign: 'center', font: '900 28px/1.3 Noto', color: '#f3e6c8', whiteSpace: 'nowrap' }, it.v).ini({ o: 0 });
      const nm = E.div(g, { left: x - 30, top: 800, width: 240, textAlign: 'center', font: '800 22px/1.35 Round', color: 'rgba(243,230,200,.92)' }, it.n).ini({ o: 0 });
      // 次の棒へのつなぎ線
      const ln = i < items.length - 1 && i !== 2 && i !== 5 ? E.div(g, { left: x + 180, top: y(it.b) - 1, width: 60, height: 0, borderTop: '2px dashed rgba(243,230,200,.7)' }).ini({ o: 0 }) : null;
      return { bar, val, nm, ln };
    });
    const show = (i, d = .2) => { const b = bars[i]; E.tw(b.bar, .6, { sy: [0, 1] }, 'out', d); E.show(b.val, .3, d + .4); E.show(b.nm, .3, d); if (b.ln) E.show(b.ln, .3, d + .5); E.sfx('slide', { delay: d, gain: .4 }); };
    // 連結純資産とは（一般的な説明）。棒が出る前に、真ん中に出して消す
    const dj = panel(g, { x: 260, y: 400, w: 1400, h: 150, size: 30, dark: true, html: '<div style="text-align:center">連結純資産は、グループの会社を合わせた、持ち物から借りているものを引いた残り<br><span style="font:800 26px Round;color:#f3e6c8">マイナスは、借りているもののほうが、持ち物より多いということ（一般的な説明）</span></div>' });
    E.wait(.4);
    let L = E.say('hat', '連結純資産は、グループの会社を合わせた、持ち物から、借りているものを、引いた残りだ。', { wait: false, yomi: 'れんけつじゅんしさんは、グループの会社を合わせた、持ち物から、借りているものを、引いた残りだ。' });
    rise(dj, .3);
    E.at(L.end);
    E.say('hat', 'マイナスは、借りているもののほうが、持ち物より、多い、ということだ。');
    E.hide(dj, .3);
    L = E.say('hat', '前の期の終わり、2025年2月末の連結純資産は、マイナス4,045.7万円。', { wait: false, yomi: '前の期の終わり、2025年2月末の、れんけつじゅんしさんは、マイナス、ヨンセン、ヨンジューゴテンナナまんえん。' });
    show(0, .3);
    E.at(L.end);
    L = E.say('hat', 'そこに、増資の4,995万円が、加わる。', { wait: false, yomi: 'そこに、ぞうしの、四千九百九十五万円が、加わる。' });
    show(1, .2);
    E.at(L.end);
    E.say('hat', '増資で払い込まれたお金は、借りたお金ではない。だから、純資産を増やす。', { yomi: 'ぞうしで払い込まれたお金は、借りたお金ではない。だから、じゅんしさんを増やす。' });
    E.say('hat', '当初の発表は、4月24日に、会社が、最初に出した、決算の発表のことだ。', { yomi: 'とうしょの発表は、4月24日に、会社が、最初に出した、決算の発表のことだ。' });
    L = E.say('hat', 'そこでは、当期純利益は、1,182.5万円だった。', { wait: false, yomi: 'そこでは、当期純利益は、センヒャクハチジューニテンゴまんえんだった。' });
    show(2, .2);
    E.at(L.end);
    E.say('hat', '当期純利益は、その期の、最後に残った利益だ。プラスなので、黒字だった。', { yomi: '当期純利益は、その期の、最後に残った利益だ。プラスなので、くろじだった。' });
    E.say('hat', '残った利益の分も、純資産に加わる。', { yomi: '残った利益の分も、じゅんしさんに加わる。' });
    L = E.say('hat', '足すと、当初の発表での、2026年2月末の連結純資産は、プラス2,131.8万円。', { wait: false, yomi: '足すと、とうしょの発表での、2026年2月末の、れんけつじゅんしさんは、プラス、ニセンヒャクサンジューイッテンハチまんえん。' });
    show(3, .2);
    E.at(L.end);
    E.say('hat', '第三者委員会は、会社から独立した、外部の専門家で作る、調査の委員会だ。', { yomi: '第三者委員会は、会社から独立した、外部の専門家で作る、調査の委員会だ。' });
    E.say('hat', '委員会が調べたのは、期末の月、2026年2月の、3つの取引だ。', { yomi: 'いいんかいが調べたのは、きまつの月、2026年2月の、みっつの取引だ。' });
    E.say('hat', 'この計算で、委員会が直したのは、そのうちの、2つの取引だ。', { yomi: 'この計算で、いいんかいが直したのは、そのうちの、ふたつの取引だ。' });
    L = E.say('hat', '第三者委員会は、取引①の売上、1億1,000万円を、取り消して計算した。', { wait: false, yomi: '第三者委員会は、とりひき、いちの、うりあげ、1億、いっせんまんえんを、取り消して計算した。' });
    show(4, .4);
    E.at(L.end);
    E.say('hat', '売上を取り消すと、その分、利益が減る。', { yomi: 'うりあげを取り消すと、そのぶん、利益が減る。' });
    E.say('hat', 'この計算では、純資産からも、同じ1億1,000万円を、引いている。', { yomi: 'この計算では、じゅんしさんからも、同じ、1億、いっせんまんえんを、引いている。' });
    L = E.say('hat', '取引③の営業外収益、2,000万円は、次の期に回して計算した。', { wait: false, yomi: 'とりひき、さんの、営業外収益、2000まんえんは、次の期に回して計算した。' });
    show(5, .2);
    E.at(L.end);
    E.say('hat', '営業外収益は、本業の外で得た、収益のことだ。');
    E.say('hat', '次の期に回すと、この期の収益には、入らない。');
    E.say('hat', 'その分、この期の純資産から、2,000万円が、引かれる。', { yomi: 'そのぶん、この期の、じゅんしさんから、2000まんえんが、引かれる。' });
    L = E.say('hat', 'その結果、委員会の修正計算では、連結純資産は、マイナス1億868万2,000円。', { wait: false, yomi: 'その結果、いいんかいの修正計算では、れんけつじゅんしさんは、マイナス、イチオクハッピャクロクジューハチマン、ニセンエン。' });
    show(6, .2); E.sfx('dun', { delay: .6, gain: .6 });
    E.at(L.end);
    const st = P.mark(sc.root, '委員会の試算（確定値ではない）', { x: 400, y: 580, color: '#c62828', size: .7, rot: -6, w: 420 });
    const stn = E.div(sc.root, { left: 310, top: 700, width: 600, textAlign: 'center', font: '800 26px/1.4 Round', color: '#f3e6c8', whiteSpace: 'nowrap' }, '会社の監査済み訂正決算ではない').ini({ o: 0 });
    L = E.say('hat', 'これは、第三者委員会が、2つの取引を直して、計算し直した、試算だ。', { wait: false, yomi: 'これは、第三者委員会が、ふたつの取引を直して、計算し直した、しさんだ。' });
    P.stampIn(st, L.dur * .5);
    E.at(L.end);
    L = E.say('hat', '会社が、決算を直して、監査人の監査を受けた、訂正決算ではない。', { wait: false, yomi: '会社が、決算を直して、監査人の監査を受けた、ていせいけっさんではない。' });
    E.show(stn, .3, L.dur * .4);
    E.at(L.end);
    E.say('hat', 'だから、確定値ではない。', { yomi: 'だから、かくていちではない。' });
    E.wait(.4);
  });

  /* ============================================================ S4 増資を、二重に足さない */
  E.scene({ name: 'nodouble' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '計算のつながり（元資料 p39・単位：千円）', 60);
    E.show(tt, .3);
    const f1 = E.div(g, { left: 160, top: 220, width: 1600, height: 140, borderRadius: 24, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 52px/1.2 Noto', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' },
      '−40,457　<span style="color:#2b68d8;border-bottom:6px solid #ffd84a">＋49,950</span>　＋11,825　＝　<span style="color:#e8a33a">21,318</span>').ini({ o: 0 });
    const f2 = E.div(g, { left: 160, top: 400, width: 1600, height: 140, borderRadius: 24, background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 52px/1.2 Noto', color: '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' },
      '<span style="color:#e8a33a">21,318</span>　−110,000　−20,000　＝　<span style="color:#c62828">−108,682</span>').ini({ o: 0 });
    const lb = E.div(g, { left: 768, top: 168, font: '900 30px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '↓ 増資は、ここで入っている').ini({ o: 0 });
    const cap = E.div(g, { left: 160, top: 552, width: 1600, textAlign: 'center', font: '800 26px/1.2 Round', color: 'rgba(243,230,200,.9)', whiteSpace: 'nowrap' }, '−108,682千円は、第三者委員会の試算（会社の監査済み訂正決算ではない・確定値ではない）').ini({ o: 0 });
    E.wait(.3);
    E.say('hat', '計算のつながりを、確かめる。単位は、千円だ。', { yomi: '計算のつながりを、確かめる。たんいは、せんえんだ。' });
    let L = E.say('hat', '1行目は、前の期末の純資産に、増資と、当初の純利益を、足している。', { wait: false, yomi: 'いちぎょうめは、前の、きまつの、じゅんしさんに、ぞうしと、とうしょの、じゅんりえきを、足している。' });
    rise(f1, .3);
    E.at(L.end);
    E.say('hat', '1行目の答えは、21,318千円。万円にすると、プラス2,131.8万円だ。', { yomi: 'いちぎょうめの答えは、ニマン、イッセンサンビャクジューハッセンエン。まんえんにすると、プラス、ニセンヒャクサンジューイッテンハチまんえんだ。' });
    E.say('hat', 'これが、当初の発表の、連結純資産だ。', { yomi: 'これが、とうしょの発表の、れんけつじゅんしさんだ。' });
    L = E.say('hat', '2行目は、その数字から、委員会の、2つの修正を、引いている。', { wait: false, yomi: 'にぎょうめは、その数字から、いいんかいの、ふたつの修正を、引いている。' });
    rise(f2, .3);
    E.at(L.end);
    L = E.say('hat', '2行目の答えは、マイナス108,682千円。万円にすると、マイナス1億868.2万円だ。', { wait: false, yomi: 'にぎょうめの答えは、マイナス、ジューマン、ハッセンロッピャクハチジューニセンエン。まんえんにすると、マイナス、イチオクハッピャクロクジューハッテンニまんえんだ。' });
    E.show(cap, .3, L.dur * .5);
    E.at(L.end);
    E.say('hat', 'これが、委員会の試算だ。確定値ではない。', { yomi: 'これが、いいんかいの、しさんだ。かくていちではない。' });
    const nb = panel(g, { x: 210, y: 600, w: 1500, h: 110, size: 32, dark: true, html: '増資の4,995万円は、1行目の計算に、もう入っている。だから、もう一度は足さない' });
    L = E.say('hat', '増資の4,995万円は、1行目の計算に、もう入っている。', { wait: false, yomi: 'ぞうしの、四千九百九十五万円は、いちぎょうめの計算に、もう入っている。' });
    E.show(lb, .3, .3); E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .5); E.sfx('ding', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    const call = P.eveCall(g, ['normal', 'surprise'], { x: 1560, y: 740, w: 300, h: 240 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '増資を足したあとの数字から、修正を引いてるんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: 'ぞうしを足したあとの数字から、修正を、引いてるんだねー。' });
    E.say('hat', 'だから、マイナス1億868.2万円に、増資を、もう一度、足さない。', { yomi: 'だから、マイナス、イチオクハッピャクロクジューハッテンニまんえんに、ぞうしを、もう一度、足さない。' });
    E.say('hat', '足すと、同じ4,995万円を、2回、数えることになる。', { yomi: '足すと、同じ、四千九百九十五万円を、にかい、数えることになる。' });
    E.wait(.3);
  });

  /* ============================================================ S5 不足の額と、必要なお金 */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'shortfall' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '純資産の不足　と　必要なお金（元資料 p40）', 60);
    E.show(tt, .3);
    // 純資産・貸借対照表とは（一般的な説明）
    const ex = panel(g, { x: 210, y: 160, w: 1500, h: 140, size: 30, html: '<div style="text-align:left;font:800 28px/1.6 Round;color:#4a4552"><b style="font:900 30px Zen;color:#b8651a">純資産</b>は、会社の持ち物から、借りているものを引いた残り<br><b style="font:900 30px Zen;color:#b8651a">貸借対照表</b>は、ある時点の、持ち物・借りているもの・純資産を並べた表<span style="font:800 22px Round;color:#6a6066">（一般的な説明）</span></div>' });
    const b1 = box(g, { x: 160, y: 340, w: 760, h: 320, top: '貸借対照表の上の額', main: '純資産の不足', sub: '1億868.2万円<br>（委員会の試算・確定値ではない）', c: '#c62828' });
    const b2 = box(g, { x: 1000, y: 340, w: 760, h: 320, top: '同じ意味ではない', main: '必要な現金・預金', sub: 'その総額は、<br>不足の額とは別', c: '#4a4552' });
    const ne = E.div(g, { left: 900, top: 450, width: 120, textAlign: 'center', font: '900 90px/1 Zen', color: '#ffd84a' }, '≠').ini({ o: 0 });
    E.wait(.3);
    let L = E.say('hat', '純資産は、会社の持ち物から、借りているものを引いた、残りだ。', { wait: false, yomi: 'じゅんしさんは、会社の持ち物から、借りているものを引いた、残りだ。' });
    rise(ex, .2);
    E.at(L.end);
    E.say('hat', '貸借対照表は、ある時点の、持ち物と、借りているものと、純資産を、並べた表だ。', { yomi: 'たいしゃくたいしょうひょうは、ある、じてんの、持ち物と、借りているものと、じゅんしさんを、ならべた、ひょうだ。' });
    L = E.say('hat', 'この1億868.2万円の不足は、貸借対照表の上の、不足の額だ。', { wait: false, yomi: 'この、イチオクハッピャクロクジューハッテンニまんえんの不足は、たいしゃくたいしょうひょうの上の、不足の額だ。' });
    rise(b1, .3);
    E.at(L.end);
    E.say('hat', '借りているものの合計が、持ち物の合計より、1億868.2万円多い、ということだ。', { yomi: 'かりているものの、ごうけいが、もちものの、ごうけいより、イチオクハッピャクロクジューハッテンニまんえん、多い、ということだ。' });
    E.say('hat', '持ち物には、現金や預金のほかのものも、入る。', { yomi: '持ち物には、げんきんや、よきんの、ほかのものも、入る。' });
    L = E.say('hat', '元資料によると、この額は、必要な現金や預金の総額と、同じ意味ではない。', { wait: false, yomi: 'もとしりょうによると、この、がくは、必要な、げんきんや、よきんの、そうがくと、同じ意味ではない。' });
    E.pop(ne, .35, .3, .5); rise(b2, .5);
    E.at(L.end);
    E.say('hat', 'つまり、この額のお金を、用意すれば足りた、という数字ではない。', { yomi: 'つまり、この、がくの、お金を、用意すれば足りた、という数字ではない。' });
    E.wait(.4);
  });

  /* ============================================================ S6 三つの問題（p40） */
  E.scene({ name: 'three' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '元資料は、問題を3つに分けている（p40）', 50);
    E.show(tt, .3);
    const col = (x, t, s, c) => E.div(g, { left: x, top: 160, width: 540, height: 400, borderRadius: 24, background: 'rgba(255,255,255,.95)', borderTop: `12px solid ${c}`, boxShadow: '0 12px 24px rgba(0,0,0,.35)', padding: '30px 34px', boxSizing: 'border-box' },
      `<div style="font:900 40px/1.3 Zen;color:${c}">${t}</div><div style="font:800 28px/1.6 Round;color:#3d3540;margin-top:18px">${s}</div>`).ini({ o: 0 });
    const k1 = col(120, '資本の問題', '委員会の試算で、純資産は<br>1億868.2万円の不足<br>（確定値ではない）', '#b8651a');
    const k2 = col(690, '監査の問題', '監査人は、収益を認識する<br>根拠を確認できなかった。<br>資金が入っても、<br>監査証拠の不足は埋まらない', '#c62828');
    const k3 = col(1260, '上場廃止の判断', '名証は、意見不表明に加え、<br>市場の秩序維持が困難な<br>場合に当たると判断<br>（601条8号）', '#4a4552');
    // 名証が9月16日の判断で挙げた事実（名証の説明の要約・A07）。3列の上に重ねて出し、読み終えたら消す
    const rowT = 'font:900 28px/1.45 Zen;color:#c62828';
    const a07 = E.div(g, { left: 120, top: 150, width: 1680, height: 420, borderRadius: 24, background: '#fbf8f2', borderTop: '12px solid #4a4552', boxShadow: '0 16px 32px rgba(0,0,0,.45)', padding: '20px 40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
      `<div style="font:900 34px/1.3 Zen;color:#4a4552">名証が9月16日の判断で挙げた事実<span style="font:800 24px Round;color:#6a6066">（名証の説明の要約・A07）</span></div>
      <div style="display:grid;grid-template-columns:300px 1fr;row-gap:16px;margin-top:22px;font:800 27px/1.45 Round;color:#3d3540">
        <div style="${rowT}">収益の内容</div><div>実在性を伴わない収益1件、代表者が関与した利益の前倒し1件</div>
        <div style="${rowT}">監査・調査への対応</div><div>監査証拠の入手を妨げ、第三者委員会へ虚偽説明や証拠隠蔽を行った。<br>名証への照会回答にも虚偽報告が認められた</div>
        <div style="${rowT}">問題が続いた期間</div><div>会社の対応に起因して報告書受領を2度延期。期末から半年以上経っても<br>決算内容が適正化されず、早期解消も見込めないと判断</div>
      </div>`).ini({ o: 0 });
    E.wait(.3);
    E.say('hat', '元資料は、問題を3つに分けている。', { yomi: 'もとしりょうは、問題を、みっつに分けている。' });
    let L = E.say('hat', '1つ目は、資本の問題。今見てきた、委員会の試算での、純資産の不足だ。', { wait: false, yomi: 'ひとつめは、資本の問題。今見てきた、いいんかいの、しさんでの、じゅんしさんの不足だ。' });
    rise(k1, .2);
    E.at(L.end);
    L = E.say('hat', '2つ目は、監査の問題だ。', { wait: false, yomi: 'ふたつめは、監査の問題だ。' });
    rise(k2, .2);
    E.at(L.end);
    E.say('hat', '監査人は、会社の決算の数字が、正しく作られているかを、外から確かめる役目だ。', { yomi: 'かんさにんは、会社の決算の数字が、正しく作られているかを、外から確かめる役目だ。' });
    E.say('hat', 'その監査人が、収益を認識する根拠を、確かめられなかった。', { yomi: 'その、かんさにんが、収益を、にんしきする根拠を、確かめられなかった。' });
    E.say('hat', '収益を認識する、というのは、収益として、決算の数字に入れることだ。', { yomi: '収益を、にんしきする、というのは、収益として、決算の数字に入れることだ。' });
    E.say('hat', '監査の証拠は、監査人が、決算の数字を確かめるために、集める資料だ。', { yomi: '監査の証拠は、かんさにんが、決算の数字を確かめるために、集める資料だ。' });
    E.say('hat', '足りなかったのは、過去に、どんなサービスを提供したか、という証拠だ。');
    E.say('hat', 'お金が入っても、それは、サービスを提供した、証拠にはならない。');
    E.say('hat', 'だから、監査の証拠の不足は、お金が入っても、埋まらない。', { yomi: 'だから、監査の証拠の不足は、お金が入っても、うまらない。' });
    L = E.say('hat', '3つ目は、実際に、上場廃止を決めた、名証の判断だ。', { wait: false, yomi: 'みっつめは、実際に、上場廃止を決めた、めいしょうの判断だ。' });
    rise(k3, .2);
    E.at(L.end);
    E.say('hat', '名証は、エスポアの株が売り買いされている、名古屋証券取引所のことだ。', { yomi: 'めいしょうは、エスポアの株が売り買いされている、なごやしょうけんとりひきじょのことだ。' });
    E.say('hat', '上場廃止は、取引所で、その株の、売り買いが、できなくなることだ。');
    E.say('hat', '意見不表明は、十分な証拠が得られず、監査人が、決算について、意見を出さないことだ。', { yomi: 'いけんふひょうめいは、十分な証拠が得られず、かんさにんが、決算について、意見を出さないことだ。' });
    E.say('hat', '名証は、意見不表明に加えて、市場の秩序の維持が、難しい場合に当たる、とした。', { yomi: 'めいしょうは、意見不表明に加えて、しじょうの、ちつじょの維持が、難しい場合に当たる、とした。' });
    E.say('hat', '適用したのは、有価証券上場規程の、601条8号だ。', { yomi: '適用したのは、ゆうかしょうけん、じょうじょうきていの、ロッピャクイチジョウ、ハチゴウだ。' });
    E.say('hat', '有価証券上場規程は、名証が決めている、上場についての規則だ。', { yomi: 'ゆうかしょうけん、じょうじょうきていは、めいしょうが決めている、じょうじょうについての規則だ。' });
    L = E.say('hat', '名証は、9月16日の判断で、次の事実を、挙げている。', { wait: false, yomi: 'めいしょうは、9月16日の判断で、次の事実を、挙げている。' });
    E.tw(a07, .45, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('pop', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '収益の内容では、実在性を伴わない収益が、1件あった、とした。', { yomi: '収益の内容では、じつざいせいを伴わない収益が、いっけんあった、とした。' });
    E.say('hat', 'もう1件は、代表者が関与した、利益の前倒しだ、とした。', { yomi: 'もういっけんは、だいひょうしゃが関与した、利益の、まえだおしだ、とした。' });
    E.say('hat', '実在性は、その取引が、実際にあった、と言えるか、ということだ。', { yomi: 'じつざいせいは、その取引が、実際にあった、と言えるか、ということだ。' });
    E.say('hat', '利益の前倒しは、本来は、あとの期に入る利益を、前の期に入れることだ。', { yomi: '利益の、まえだおしは、本来は、あとの期に入る利益を、前の期に入れることだ。' });
    E.say('hat', '監査と調査への対応では、監査の証拠の入手を、妨げた、とした。', { yomi: '監査と調査への対応では、監査の証拠の、にゅうしゅを、妨げた、とした。' });
    E.say('hat', '第三者委員会に、虚偽の説明や、証拠の隠蔽を行った、ともしている。', { yomi: '第三者委員会に、きょぎの説明や、証拠の、いんぺいを行った、ともしている。' });
    E.say('hat', '虚偽は、事実と違うこと。隠蔽は、隠すことだ。', { yomi: 'きょぎは、事実と違うこと。いんぺいは、隠すことだ。' });
    E.say('hat', '名証が、会社に問い合わせた、照会への回答にも、虚偽の報告が認められた、としている。', { yomi: 'めいしょうが、会社に問い合わせた、しょうかいへの回答にも、きょぎの報告が認められた、としている。' });
    E.say('hat', '問題が続いた期間では、会社の対応が原因で、委員会の報告書の受領が、2度延びた、とした。', { yomi: '問題が続いた期間では、会社の対応が原因で、いいんかいの、ほうこくしょの、じゅりょうが、にど延びた、とした。' });
    E.say('hat', '2026年2月の期末から、半年以上たっても、決算の内容は、適正化されなかった、とした。', { yomi: '2026年2月の、きまつから、はんとしいじょう、たっても、決算の内容は、てきせいかされなかった、とした。' });
    E.say('hat', '適正化は、正しい形に、直すことだ。', { yomi: 'てきせいかは、正しい形に、直すことだ。' });
    E.say('hat', 'そして、名証は、早く解消する見込みもない、と判断した。', { yomi: 'そして、めいしょうは、早く解消する見込みもない、と判断した。' });
    E.hide(a07, .4);
    const an = panel(g, { x: 120, y: 600, w: 1680, h: 110, size: 30, dark: true, html: '<span style="font:800 26px Round;color:#f3e6c8">元資料の分析</span><span>上場廃止は、「監査で認められた利益と増資で足りなかった」だけでは、説明できない</span>' });
    L = E.say('hat', '元資料は、ここで、ある見方を、取り上げている。', { wait: false, yomi: 'もとしりょうは、ここで、ある見方を、取り上げている。' });
    E.tw(an, .4, { o: [0, 1], y: [20, 0] }, 'back', .6); E.sfx('ding', { delay: .6, gain: .5 });
    E.at(L.end);
    E.say('hat', '監査で認められた利益と、増資を足しても、純資産が足りなかった、という見方だ。', { yomi: '監査で認められた利益と、ぞうしを足しても、じゅんしさんが足りなかった、という見方だ。' });
    E.say('hat', '追加の増資だけで、上場を守れたのか、という問いでもある。', { yomi: 'ついかの、ぞうしだけで、じょうじょうを守れたのか、という問いでもある。' });
    E.say('hat', '元資料は、上場廃止は、その見方だけでは、説明できない、と分析している。', { yomi: 'もとしりょうは、上場廃止は、その見方だけでは、説明できない、と分析している。' });
    E.say('hat', '理由の1つは、そもそも、監査の結果が、意見不表明だったことだ。', { yomi: '理由のひとつは、そもそも、監査の結果が、いけんふひょうめいだったことだ。' });
    E.say('hat', '監査人は、その決算について、意見を出していなかった。', { yomi: 'かんさにんは、その決算について、意見を出していなかった。' });
    E.say('hat', 'そこに、あとからの、収益の訂正と、監査や調査への対応の問題が、重なった。', { yomi: 'そこに、あとからの、収益の訂正と、監査や、調査への対応の問題が、重なった。' });
    E.say('hat', '元資料は、純資産の不足に加えて、監査と調査への対応が、問題になっていた、とする。', { yomi: 'もとしりょうは、じゅんしさんの不足に加えて、監査と調査への対応が、問題になっていた、とする。' });
    E.say('hat', '財務の情報が、信頼できるか、ということも、上場の判断の問題だった、としている。', { yomi: 'ざいむの情報が、信頼できるか、ということも、じょうじょうの判断の問題だった、としている。' });
    E.say('hat', 'だから、元資料は、純資産の計算だけで、上場を続けられたかを、決めない。', { yomi: 'だから、もとしりょうは、じゅんしさんの計算だけで、じょうじょうを続けられたかを、決めない。' });
    E.wait(.4);
  });

  /* ============================================================ S7 4月24日の数字（I51の予告） */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'i51pre' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const i51 = P.icard(g, { id: 'I51', when: '2026/10/15 15:30', session: '引け後', title: '半期報告書遅延・訂正方針（第16章）', text: '前期の訂正と半期報告書の提出が未完了。<br>会計監査人不在により訂正有報の提出時期も未定と説明', note: '4/24の黒字・純資産プラスを、後日も有効な確定値として使わない', x: 260, y: 160, w: 1400, size: 32 });
    // 半期報告書・会計監査人・有報とは（一般的な説明）
    const kw = 'font:900 27px Zen;color:#b8651a';
    const ex = E.div(g, { left: 260, top: 540, width: 1400, height: 212, borderRadius: 24, background: 'rgba(255,255,255,.95)', boxShadow: '0 12px 24px rgba(0,0,0,.35)', padding: '20px 36px', boxSizing: 'border-box', font: '800 27px/1.6 Round', color: '#3d3540', whiteSpace: 'nowrap' },
      `<span style="${kw}">半期報告書</span>は、決算の1年のうち、前半の半年分について、会社が出す報告書<br><span style="${kw}">会計監査人</span>は、会社の決算書を監査する、外部の監査法人や公認会計士<br><span style="${kw}">有報（有価証券報告書）</span>は、会社が事業や決算をくわしく書いて、毎年出す報告書<div style="text-align:right;font:800 22px/1.2 Round;color:#6a6066">一般的な説明</div>`).ini({ o: 0 });
    E.tw(i51, .45, { o: [0, 1], y: [30, 0] }, 'back', .4); E.sfx('notify', { delay: .4 });
    E.wait(1.0);
    E.narr('このあと、10月15日に、会社は、前の期の訂正についての方針を、開示した。');
    let L = E.say('hat', '前の期の訂正と、半期報告書の提出が、まだ終わっていない、とした。', { wait: false, yomi: '前の期の訂正と、はんきほうこくしょの提出が、まだ終わっていない、とした。' });
    rise(ex, L.dur * .5);
    E.at(L.end);
    E.say('hat', '半期報告書は、決算の1年のうち、前半の半年分について、会社が出す報告書だ。', { yomi: 'はんきほうこくしょは、決算の1年のうち、前半の、はんとしぶんについて、会社が出す報告書だ。' });
    E.say('hat', '会計監査人がいないため、訂正した有報を出す時期も、決まっていない、と説明した。', { yomi: 'かいけいかんさにんが、いないため、訂正した、ゆうほうを出す時期も、決まっていない、と説明した。' });
    E.say('hat', '会計監査人は、会社の決算書を監査する、外部の監査法人や、公認会計士のことだ。', { yomi: 'かいけいかんさにんは、会社の、けっさんしょを監査する、外部の、かんさほうじんや、こうにんかいけいしのことだ。' });
    E.say('hat', '有報は、有価証券報告書のことだ。会社が、事業や決算を、くわしく書いて、毎年出す。', { yomi: 'ゆうほうは、ゆうかしょうけんほうこくしょのことだ。会社が、事業や決算を、くわしく書いて、毎年出す。' });
    E.narr('くわしくは、次の章で見る。');
    E.hide(ex, .3);
    E.say('hat', '4月24日の、黒字と純資産プラスは、会社が、最初に発表した数字だ。', { yomi: '4月24日の、くろじと、じゅんしさんプラスは、会社が、最初に発表した数字だ。' });
    E.say('hat', '委員会の試算では、2つの取引を直すと、純資産は、マイナスになる。', { yomi: 'いいんかいの、しさんでは、ふたつの取引を直すと、じゅんしさんは、マイナスになる。' });
    E.say('hat', '10月15日の時点で、会社の訂正も、まだ終わっていなかった。', { yomi: '10月15日の時点で、会社の、ていせいも、まだ終わっていなかった。' });
    E.say('hat', '元資料は、4月24日の数字を、あとからも有効な、確定の値としては、使わない。', { yomi: 'もとしりょうは、4月24日の数字を、あとからも有効な、確定の、あたいとしては、使わない。' });
    E.wait(.4);
  });

  /* ============================================================ S8 ブルちゃんの部屋 */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_room' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証'], ['・・・', ''], ['・・・', '']], { title: '保有', hi: 0 });
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    P.look(sc.cam, { s: 1.2, cx: 1150, cy: 430, dur: 4, delay: .3 });
    E.wait(.6);
    E.narr('増資のお金は、入っていた。', { yomi: 'ぞうしの、お金は、入っていた。' });
    E.narr('それでも、問題は、お金が足りなかった、ということだけでは、なかった。');
    E.narr('監査人は、収益を、決算に入れてよい、という根拠を、確かめられなかった。', { yomi: 'かんさにんは、しゅうえきを、決算に入れてよい、という根拠を、確かめられなかった。' });
    E.narr('私は、そこを、ずっと読んでいなかった。');
    E.wait(.3);
  });

  /* ============================================================ S9 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, 'お金が入っても、証拠は埋まらない', { left: 120, top: 120, font: '900 64px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .07));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const d1 = E.div(paper, { left: 140, top: 380, width: 520, height: 260, borderRadius: 20, border: '5px solid #2b68d8', background: 'rgba(255,255,255,.6)', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#2b68d8', paddingTop: 48 }, 'お金<div style="font:900 30px/1.5 Zen;margin-top:10px">増資 4,995万円<br>（払い込まれた）</div>').ini({ o: 0 });
    const d2 = E.div(paper, { left: 760, top: 380, width: 520, height: 260, borderRadius: 20, border: '6px solid #c62828', background: 'rgba(255,255,255,.6)', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#c62828', paddingTop: 48 }, '証拠<div style="font:900 30px/1.5 Zen;margin-top:10px">収益の根拠<br>（監査人は確認できなかった）</div>').ini({ o: 0 });
    E.wait(2.6);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「お金が入っても、証拠は埋まらない」。', { wait: false, yomi: 'お金が入っても、証拠は、うまらない。' });
    E.show(d1, .4, .2); E.tw(d2, .45, { o: [0, 1], s: [1.2, 1] }, 'back', L.dur * .5); E.sfx('stamp', { delay: L.dur * .5 + .2, gain: .5 });
    E.at(L.end + 1.0);
  });

  /* ============================================================ S10 男爵 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .75 });
    const C = P.closeup(g, CH('baron_e_normal'), { bg: 'radial-gradient(ellipse at 50% 40%, #4a1622 0%, #200a10 75%)', imgH: 860, panelBg: 'linear-gradient(180deg,#3a121b,#1a070c)' });
    E.from(C.img, { s: .94, y: 30 }, .6, 0, 'out');
    E.wait(.5);
    E.say('baron', '足し算が合うと、人は、安心する。', { talk: C.img, talkAmp: 2 });
    C.swap(CH('baron_e_scheme'));
    E.say('baron', 'だが、足した数字に、裏付けがなければ、答えは出ない。', { talk: C.img, talkAmp: 2 });
    E.wait(.5);
  });

  /* ============================================================ S11 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('dark', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #3a2c24 0%, #1d1612 75%, #120d0a 100%)' });
    const items = [['9/18', '？'], ['9/25', '？'], ['10/16', '最終売買']];
    const x0 = 260, x1 = 1200, yy = 470;
    const line = E.div(g, { left: x0, top: yy, width: x1 - x0, height: 8, borderRadius: 4, background: '#c9a24a' }).ini({ cr: 100 });
    E.tw(line, 1.0, { cr: [100, 0] }, 'inOut', .2);
    items.forEach(([d, t], i) => {
      const xx = x0 + i * (x1 - x0) / (items.length - 1);
      const dot = E.div(g, { left: xx - 22, top: yy - 18, width: 44, height: 44, borderRadius: '50%', background: i === 2 ? '#e0353f' : '#f3e6c8', border: '6px solid #c9a24a' }).ini({ o: 0 });
      const dl = E.div(g, { left: xx - 150, top: yy - 90, width: 300, textAlign: 'center', font: '900 44px/1.2 Noto', color: '#f3e6c8' }, d).ini({ o: 0 });
      const tl = E.div(g, { left: xx - 190, top: yy + 54, width: 380, textAlign: 'center', font: '800 32px/1.35 Round', color: i === 2 ? '#ff8a8a' : '#e8dcc0' }, t).ini({ o: 0 });
      [dot, dl, tl].forEach(n => E.pop(n, .4, .4 + i * .4, .6));
      E.sfx('click', { delay: .4 + i * .4 });
    });
    const st = P.sticky(g, '第16章<br>最後の1か月', { x: 1340, y: 120, w: 500, h: 250, rot: 5, size: 46 });
    P.slap(st, 2.0);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.6);
    E.sfx('snort', { delay: 2.8 });
    E.wait(3.2);
    E.say('pig', 'ブヒッ。次は、第16章だブー。', { talk: pig, talkAmp: 5, yomi: 'ブヒッ。次は、だいじゅうろくしょうだブー。' });
    E.unsub(.4);
    const tsu = E.div(g, { left: 0, top: 760, width: W, textAlign: 'center', font: '900 64px/1.2 Zen', color: '#f3e6c8', letterSpacing: '.3em' }, 'つづく').ini({ o: 0 });
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
