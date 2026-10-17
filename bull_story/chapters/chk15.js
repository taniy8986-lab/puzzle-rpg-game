// 完全版 第15章「増資は、払い込まれていた」（純資産の計算）
// 台本: story/k/k15_増資は、払い込まれていた.md　元資料 p24・p39・p40
// −1億868万2,000円は第三者委員会の試算（会社の監査済み訂正決算ではない）。「増資で足りなかった、だけでは説明できない」は元資料の分析
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
    const c1 = box(g, { x: 160, y: 200, w: 760, h: 300, top: '2026年2月27日', main: '払込完了', sub: '割当先：個人1名（開示どおり）', c: '#2b68d8', size: 64 });
    const c2 = box(g, { x: 1000, y: 200, w: 760, h: 300, top: '計算', main: '90,000株 × 555円', sub: '＝ 49,950,000円（4,995万円）', c: '#262236', size: 52 });
    E.wait(.3);
    let L = E.say('hat', 'まず、増資は、払い込まれていた。2月27日に、払込みの完了が、開示されている。', { wait: false, yomi: 'まず、ぞうしは、払い込まれていた。2月27日に、はらいこみの完了が、開示されている。' });
    rise(c1, .3);
    E.at(L.end);
    L = E.say('hat', '9万株、1株555円で、4,995万円だ。', { wait: false, yomi: 'キューマンカブ、ひとかぶ、ゴヒャクゴジューゴエンで、四千九百九十五万円だ。' });
    rise(c2, .2);
    E.at(L.end);
    const nb = panel(g, { x: 260, y: 580, w: 1400, h: 110, size: 34, dark: true, html: '「お金を集められなかった」のではない' });
    L = E.say('hat', 'お金を集められなかったから、ではない。ここは、分けて考える。', { wait: false });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('ding', { delay: .2, gain: .5 });
    E.at(L.end + .4);
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
      { a: -8868.2, b: -10868.2, c: '#d84a4a', n: '委員会：取引③<br>翌期へ', v: '−2,000' },
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
    E.wait(.4);
    let L = E.say('hat', '前の期の終わり、2025年2月末の連結純資産は、マイナス4,045.7万円。', { wait: false, yomi: '前の期の終わり、2025年2月末の、れんけつじゅんしさんは、マイナス、ヨンセン、ヨンジューゴテンナナまんえん。' });
    show(0, .3);
    E.at(L.end);
    L = E.say('hat', 'そこに、増資の4,995万円が、加わる。', { wait: false, yomi: 'そこに、ぞうしの、四千九百九十五万円が、加わる。' });
    show(1, .2);
    E.at(L.end);
    L = E.say('hat', '当初の発表の、当期純利益は、1,182.5万円。', { wait: false, yomi: 'とうしょの発表の、当期純利益は、センヒャクハチジューニテンゴまんえん。' });
    show(2, .2);
    E.at(L.end);
    L = E.say('hat', '足すと、当初の発表の連結純資産は、プラス2,131.8万円。', { wait: false, yomi: '足すと、とうしょの発表の、れんけつじゅんしさんは、プラス、ニセンヒャクサンジューイッテンハチまんえん。' });
    show(3, .2);
    E.at(L.end);
    E.say('hat', '4月24日に発表された数字だ。');
    L = E.say('hat', '第三者委員会は、取引①の売上、1億1,000万円を、取り消して計算した。', { wait: false, yomi: '第三者委員会は、とりひき、いちの、うりあげ、1億、いっせんまんえんを、取り消して計算した。' });
    show(4, .4);
    E.at(L.end);
    L = E.say('hat', '取引③の営業外収益、2,000万円は、次の期に回して計算した。', { wait: false, yomi: 'とりひき、さんの、営業外収益、2000まんえんは、次の期に回して計算した。' });
    show(5, .2);
    E.at(L.end);
    L = E.say('hat', 'その結果、委員会の修正計算では、連結純資産は、マイナス1億868万2,000円。', { wait: false, yomi: 'その結果、いいんかいの修正計算では、れんけつじゅんしさんは、マイナス、イチオクハッピャクロクジューハチマン、ニセンエン。' });
    show(6, .2); E.sfx('dun', { delay: .6, gain: .6 });
    E.at(L.end);
    const st = P.mark(sc.root, '委員会の試算（確定値ではない）', { x: 400, y: 580, color: '#c62828', size: .7, rot: -6, w: 420 });
    const stn = E.div(sc.root, { left: 310, top: 700, width: 600, textAlign: 'center', font: '800 26px/1.4 Round', color: '#f3e6c8', whiteSpace: 'nowrap' }, '会社の監査済み訂正決算ではない').ini({ o: 0 });
    L = E.say('hat', 'これは、第三者委員会の試算で、確定値ではない。会社の、監査済みの訂正決算でも、ない。', { wait: false, yomi: 'これは、第三者委員会の、しさんで、かくていちではない。会社の、かんさずみの、ていせいけっさんでも、ない。' });
    P.stampIn(st, L.dur * .2); E.show(stn, .3, L.dur * .55);
    E.at(L.end + .4);
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
    let L = E.say('hat', '計算のつながりを、確かめる。', { wait: false });
    rise(f1, .2); rise(f2, L.dur * .6); E.show(cap, .3, L.dur * .6 + .3);
    E.at(L.end);
    const nb = panel(g, { x: 260, y: 600, w: 1400, h: 110, size: 34, dark: true, html: '増資 4,995万円は、最初の計算に入っている → もう一度、足さない' });
    L = E.say('hat', '増資の4,995万円は、最初の純資産の計算に、もう入っている。もう一度、足さない。', { wait: false, yomi: 'ぞうしの、四千九百九十五万円は、最初の、じゅんしさんの計算に、もう入っている。もう一度、足さない。' });
    E.show(lb, .3, .3); E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .5); E.sfx('ding', { delay: L.dur * .5, gain: .5 });
    E.at(L.end);
    const call = P.eveCall(g, ['normal', 'surprise'], { x: 1560, y: 740, w: 300, h: 240 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '増資を足したあとの数字から、修正を引いてるんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: 'ぞうしを足したあとの数字から、修正を、引いてるんだねー。' });
    E.wait(.3);
  });

  /* ============================================================ S5 不足の額と、必要なお金 */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'shortfall' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '純資産の不足　と　必要なお金（元資料 p40）', 60);
    E.show(tt, .3);
    const ex = panel(g, { x: 260, y: 170, w: 1400, h: 110, size: 32, html: '<span style="color:#b8651a">純資産</span><span style="font:800 28px Round;color:#4a4552">＝ 会社の持ち物から、借りているものを引いた残り</span>' });
    const b1 = box(g, { x: 160, y: 340, w: 760, h: 320, top: '貸借対照表の上の額', main: '純資産の不足', sub: '1億868.2万円<br>（委員会の試算・確定値ではない）', c: '#c62828' });
    const b2 = box(g, { x: 1000, y: 340, w: 760, h: 320, top: '同じ意味ではない', main: '必要な現金・預金', sub: 'その総額は、<br>不足の額とは別', c: '#4a4552' });
    const ne = E.div(g, { left: 900, top: 450, width: 120, textAlign: 'center', font: '900 90px/1 Zen', color: '#ffd84a' }, '≠').ini({ o: 0 });
    E.wait(.3);
    let L = E.say('hat', '純資産は、会社の持ち物から、借りているものを引いた、残りだ。', { wait: false, yomi: 'じゅんしさんは、会社の持ち物から、借りているものを引いた、残りだ。' });
    rise(ex, .2);
    E.at(L.end);
    L = E.say('hat', 'この1億868.2万円の不足は、貸借対照表の上の、不足の額だ。', { wait: false, yomi: 'この、イチオクハッピャクロクジューハッテンニまんえんの不足は、たいしゃくたいしょうひょうの上の、不足の額だ。' });
    rise(b1, .3);
    E.at(L.end);
    L = E.say('hat', '必要な現金や預金の総額と、同じ意味ではない。', { wait: false });
    E.pop(ne, .35, .2, .5); rise(b2, .4);
    E.at(L.end + .4);
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
    E.wait(.3);
    E.say('hat', '元資料は、問題を3つに分けている。', { yomi: 'もとしりょうは、問題を、みっつに分けている。' });
    let L = E.say('hat', '1つ目は、資本の問題。純資産の不足だ。', { wait: false, yomi: 'ひとつめは、資本の問題。じゅんしさんの不足だ。' });
    rise(k1, .2);
    E.at(L.end);
    L = E.say('hat', '2つ目は、監査の問題。監査人は、収益を認識する根拠を、確かめられなかった。', { wait: false, yomi: 'ふたつめは、監査の問題。かんさにんは、収益を、にんしきする根拠を、確かめられなかった。' });
    rise(k2, .2);
    E.at(L.end);
    E.say('hat', 'お金が入っても、過去に、どんなサービスを提供したか、という証拠の不足は、埋まらない。', { yomi: 'お金が入っても、過去に、どんなサービスを提供したか、という証拠の不足は、うまらない。' });
    L = E.say('hat', '3つ目が、名証の、実際の判断だ。', { wait: false, yomi: 'みっつめが、めいしょうの、実際の判断だ。' });
    rise(k3, .2);
    E.at(L.end);
    E.say('hat', '名証は、意見不表明に加えて、市場の秩序の維持が、難しい場合に当たる、とした。', { yomi: 'めいしょうは、意見不表明に加えて、しじょうの、ちつじょの維持が、難しい場合に当たる、とした。' });
    const an = panel(g, { x: 120, y: 600, w: 1680, h: 110, size: 32, dark: true, html: '<span style="font:800 26px Round;color:#f3e6c8">元資料の分析</span><span>「増資で足りなかった」だけでは説明できない</span>' });
    L = E.say('hat', 'だから、元資料は、こう読んでいる。増資で足りなかった、だけでは、説明できない。', { wait: false, yomi: 'だから、もとしりょうは、こう読んでいる。ぞうしで足りなかった、だけでは、説明できない。' });
    E.tw(an, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end);
    E.say('hat', 'そもそも、監査は、意見不表明だった。');
    E.say('hat', 'そこに、あとからの収益の訂正と、調査への対応の問題が、重なった。', { yomi: 'そこに、あとからの、収益の訂正と、調査への対応の問題が、重なった。' });
    E.say('hat', '純資産の計算だけで、上場が続くかどうかは、決まらない。', { yomi: 'じゅんしさんの計算だけで、上場が続くかどうかは、決まらない。' });
    E.wait(.4);
  });

  /* ============================================================ S7 4月24日の数字（I51の予告） */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'i51pre' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const i51 = P.icard(g, { id: 'I51', when: '2026/10/15 15:30', session: '引け後', title: '半期報告書遅延・訂正方針（第16章）', text: '前期の訂正と半期報告書の提出が未完了。<br>会計監査人不在により訂正有報の提出時期も未定と説明', note: '4/24の黒字・純資産プラスを、後日も有効な確定値として使わない', x: 260, y: 160, w: 1400, size: 32 });
    E.tw(i51, .45, { o: [0, 1], y: [30, 0] }, 'back', .4); E.sfx('notify', { delay: .4 });
    E.wait(1.0);
    E.narr('このあと、10月15日に、会社は、前の期の訂正についての方針を、開示した。');
    E.narr('それは、次の章で見る。');
    E.say('hat', '4月24日の、黒字と純資産プラスを、元資料は、確定の値としては、使わない。', { yomi: '4月24日の、くろじと、じゅんしさんプラスを、もとしりょうは、確定の、あたいとしては、使わない。' });
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
    E.narr('お金は、入っていた。足りなかった、だけではなかった。');
    E.narr('監査人は、収益の根拠を、確かめられなかった。私は、そこを、ずっと読んでいなかった。', { yomi: 'かんさにんは、しゅうえきの根拠を、確かめられなかった。私は、そこを、ずっと読んでいなかった。' });
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
    const d1 = E.div(paper, { left: 140, top: 380, width: 520, height: 260, borderRadius: 20, border: '5px solid #2b68d8', background: 'rgba(255,255,255,.6)', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#2b68d8', paddingTop: 60 }, 'お金<br><span style="font-size:30px">増資 4,995万円（入った）</span>').ini({ o: 0 });
    const d2 = E.div(paper, { left: 760, top: 380, width: 520, height: 260, borderRadius: 20, border: '6px solid #c62828', background: 'rgba(255,255,255,.6)', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#c62828', paddingTop: 60 }, '証拠<br><span style="font-size:30px">収益の根拠（確認できず）</span>').ini({ o: 0 });
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
