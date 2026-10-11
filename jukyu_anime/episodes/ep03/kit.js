/* 第3章の小道具の部品。第1章・第2章の部品（../ep01/kit.js, ../ep02/kit.js）に足す。
 * どの部品も { build(box, ctx, W), update(t, ctx, st, W) } を返す。
 */
(function () {
  'use strict';
  const K = window.KIT;
  const P = () => window.PROPS;
  const E = () => window.E;

  // n 行目の頭（その行がこのカットに無ければ、カットの長さを等分した時刻）
  const at = (ctx, n, parts = 1) => {
    if (ctx.cut.lines[n]) return ctx.L(n);
    const D = ctx.cut.end - ctx.cut.start;
    return ctx.cut.start + .3 + n * (D - .6) / Math.max(1, parts);
  };
  const note = (box, text, st = {}) => {
    const el = E().mk(box, Object.assign({ fontSize: '30px', color: '#5a4630', whiteSpace: 'nowrap' }, st), 'a noto', text);
    el.style.fontWeight = 900;
    return el;
  };
  const fakeNote = (box, x, y, color = '#999', size = 20) => note(box, '※架空の銘柄です', { left: `${x}px`, top: `${y}px`, fontSize: `${size}px`, color });

  /* ---------- データ（すべて架空） ---------- */
  // ネムノキ化学の週足：3 年前に 800 円まで上げて大出来高 → 下げて 300 円台で 2 年以上 → ここ 8 週は出来高が増えている
  const NEM = (() => {
    const d = [], v = [];
    let p = 320;
    const push = (to, vol, wig = 6) => { const o = p; p = to; const hi = Math.max(o, p) + wig, lo = Math.min(o, p) - wig; d.push([o, hi, lo, p]); v.push(vol); };
    for (let i = 0; i < 20; i++) push(320 + (i + 1) * 24 + Math.sin(i * 1.7) * 8, 18 + i * 4.5 + (i > 15 ? 25 : 0), 14);
    for (let i = 0; i < 25; i++) push(800 - (i + 1) * 19 + Math.sin(i * 1.3) * 10, 40 - i, 12);
    for (let i = 0; i < 106; i++) push(315 + Math.sin(i * .9) * 14 + Math.sin(i * .23) * 8, 6 + (i % 4) * 1.5, 7);
    for (let i = 0; i < 8; i++) push(312 + Math.sin(i * 1.4) * 9 + i * 1.5, 12 + i * 4 + (i % 2) * 2, 8);
    return { d, v };
  })();
  K.NEM = NEM;

  // 週足のチャート（タブレットの画面に描く）。opts.from/to で拡大する範囲
  const nemChart = (box, { x = 70, y = 140, w = 1300, h = 470, volH = 150, from = 0, to = NEM.d.length, lo = 230, hi = 880, dark = true } = {}) => {
    const d = NEM.d.slice(from, to), v = NEM.v.slice(from, to);
    const ch = E().W_.candles(box, x, y, w, h, d, { lo, hi, up: '#ff6b6b', down: '#5aa9ff', vol: v, volH,
      volColor: i => (from + i >= NEM.d.length - 8 ? 'rgba(255,214,74,.85)' : 'rgba(150,180,230,.55)'), grid: dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)' });
    const Yp = price => y + ch.Y(price);
    const Xi = i => x + (i - from) * ch.cw + ch.cw / 2;
    return { ch, Yp, Xi, x, y, w, h, volH };
  };
  const darkText = (box, text, st = {}) => note(box, text, Object.assign({ color: '#e6eeff' }, st));

  /* ---------- スマホ：ミライ製菓の今（買値 500 円の点線） ---------- */
  K.phoneMiraiNow = () => {
    const D = K.DATA;
    const data = [...D.MIRAI_NEXT, [438, 446, 430, 441], [441, 450, 436, 446], [446, 453, 440, 444], [444, 456, 441, 452]];
    const vol = [...D.MIRAI_NEXT_VOL, 40, 30, 22, 18];
    return K.phoneStock({ from: 438, to: 452, change: '+8（+1.8%）', up: true, data, vol, buyLine: 500 });
  };

  /* ---------- スマホ：出来高急増ランキング ---------- */
  K.phoneRanking = () => ({
    build(box) {
      const { mk } = E();
      box.style.background = '#fff';
      mk(box, { left: 0, top: '96px', width: '100%', textAlign: 'center', fontSize: '30px', color: '#222' }, 'a noto', '出来高急増ランキング').style.fontWeight = 900;
      const rows = [
        ['1', 'ネムノキ化学', '3年ぶりの水準', true],
        ['2', 'カゼマチ物産', '前週の2.1倍', false],
        ['3', 'ユメノ電機', '前週の1.8倍', false],
        ['4', 'ミライ製菓', '前週の0.6倍', false],
      ].map((r, i) => {
        const el = mk(box, { left: '24px', top: `${170 + i * 150}px`, width: '508px', height: '130px', borderRadius: '18px', background: r[3] ? '#fff3d6' : '#f6f7fb',
          border: r[3] ? '4px solid #f2a900' : '2px solid #eceef4' }, 'a');
        el.innerHTML = `<div class="noto" style="position:absolute;left:22px;top:30px;width:56px;height:56px;border-radius:50%;background:${r[3] ? '#e0312f' : '#9aa5b5'};color:#fff;text-align:center;line-height:56px;font-size:30px;font-weight:900">${r[0]}</div>
          <div class="noto" style="position:absolute;left:100px;top:22px;font-size:34px;font-weight:900;color:#222">${r[1]}</div>
          <div class="noto" style="position:absolute;left:100px;top:74px;font-size:24px;font-weight:700;color:${r[3] ? '#c0392b' : '#777'}">出来高 ${r[2]}</div>`;
        return el;
      });
      fakeNote(box, 30, 975);
      return { rows };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      st.rows.forEach((r, i) => W.slide(r, prog(t, ctx.cut.start + .2 + i * .18, ctx.cut.start + .55 + i * .18), 0, 40, { s: i === 0 ? 1 + Math.max(0, Math.sin((t - ctx.cut.start) * 4)) * .015 : 1 }));
    },
  });

  /* ---------- タブレット：ネムノキ化学の 3 年の週足 ---------- */
  K.nemOverview = () => ({
    build(box) {
      const { mk } = E();
      const c = nemChart(box, {});
      const title = darkText(box, 'ネムノキ化学（※架空）　週足・3年', { left: '70px', top: '40px', fontSize: '40px' });
      const peak = darkText(box, '3年前　800円', { left: `${c.Xi(19) - 90}px`, top: `${c.Yp(840) - 50}px`, fontSize: '32px', color: '#ffd24a' });
      const flat = darkText(box, 'それから2年以上、300円台', { left: `${c.Xi(80)}px`, top: `${c.Yp(420) - 20}px`, fontSize: '32px', color: '#cfe0ff' });
      const ring = P().circle(box, c.Xi(NEM.d.length - 4), c.y + c.h + 20 + c.volH * .6, 70, c.volH * .55, { color: '#ffd24a', width: 6 });
      const ringL = darkText(box, 'ここ数週、出来高が増えている', { left: `${c.Xi(NEM.d.length - 4) - 470}px`, top: `${c.y + c.h + 20}px`, fontSize: '28px', color: '#ffd24a' });
      return { c, title, peak, flat, ring, ringL };
    },
    update(t, ctx, st, W) {
      const { prog, ease } = E();
      const s0 = ctx.cut.start;
      W.fade(st.title, prog(t, s0, s0 + .4));
      st.c.ch.reveal(ease.out(prog(t, s0 + .2, s0 + 2.0)));
      W.pop(st.peak, prog(t, s0 + .9, s0 + 1.3));
      W.fade(st.flat, prog(t, s0 + 1.6, s0 + 2.0));
      st.ring.draw(prog(t, s0 + 2.2, s0 + 2.8));
      W.fade(st.ringL, prog(t, s0 + 2.6, s0 + 3.0));
    },
  });

  // 3 年前の出来高帯と、今の実売りをつなぐ線が、年ごとに細くなる
  K.nemBand = () => ({
    build(box) {
      const { mk, svg } = E();
      const c = nemChart(box, { h: 400, volH: 120 });
      c.ch.reveal(1);
      const y1 = c.Yp(840), y2 = c.Yp(700);
      const band = mk(box, { left: `${c.x}px`, top: `${y1}px`, width: `${c.w}px`, height: `${y2 - y1}px`, background: 'linear-gradient(90deg, rgba(255,150,60,.55), rgba(255,150,60,.08))',
        borderTop: '3px solid rgba(255,170,90,.9)', borderBottom: '3px solid rgba(255,170,90,.9)', transformOrigin: '0 50%' }, 'a');
      const bandL = darkText(box, '3年前の出来高帯（800円付近）', { left: `${c.x + 520}px`, top: `${y1 - 52}px`, fontSize: '32px', color: '#ffb36b' });
      const now = mk(box, { left: '1150px', top: `${c.Yp(330) - 70}px`, width: '230px', height: '86px', borderRadius: '14px', background: '#26365e', border: '3px solid #cfe0ff',
        color: '#fff', fontSize: '30px', textAlign: 'center', lineHeight: '80px' }, 'a noto', '今の実売り');
      now.style.fontWeight = 900;
      const link = svg(box, 1440, 880, `<path class="lk" d="M ${c.x + 380} ${(y1 + y2) / 2} C 900 ${(y1 + y2) / 2 + 40}, 1000 ${c.Yp(330) - 150}, 1265 ${c.Yp(330) - 70}" fill="none" stroke="#ffd24a" stroke-width="16" stroke-dasharray="20 14" stroke-linecap="round"/>`, { left: 0, top: 0 });
      link.className = 'a';
      const years = ['1年後', '2年後', '3年後'].map((yy, i) => darkText(box, yy, { left: `${c.Xi(45 + i * 38)}px`, top: `${c.y + c.h + c.volH + 26}px`, fontSize: '30px', color: '#cfe0ff' }));
      const weak = darkText(box, '結び付きは、弱くなりやすい', { left: '700px', top: '56px', fontSize: '40px', color: '#ffd24a' });
      const def = darkText(box, '出来高帯＝その値段のあたりで、たくさん売り買いされた所', { left: '70px', top: '740px', fontSize: '26px', color: '#9fb4dd' });
      return { c, band, bandL, now, link, lk: link.querySelector('.lk'), years, weak, def };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, lerp } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      T(st.band, { sx: ease.out(prog(t, s0, s0 + .6)), sy: 1 });
      W.fade(st.bandL, prog(t, s0 + .3, s0 + .7));
      W.pop(st.now, prog(t, s0 + .6, s0 + 1.0));
      W.fade(st.def, prog(t, s0 + .5, s0 + .9));
      const yk = prog(t, s0 + 1.2, s0 + Math.max(2.4, D - .8));
      st.years.forEach((y, i) => W.fade(y, prog(yk, i / 3, i / 3 + .15)));
      st.lk.setAttribute('stroke-width', lerp(16, 2.5, ease.inOut(yk)).toFixed(1));
      st.lk.setAttribute('opacity', lerp(1, .35, yk).toFixed(2));
      st.link.style.opacity = prog(t, s0 + .9, s0 + 1.2);
      W.fade(st.weak, prog(t, s0 + D * .7, s0 + D * .7 + .4));
    },
  });

  /* ---------- 想像の空間：3 年前に 800 円で買った人たち ---------- */
  const holderRow = (box, list, { y = 470, size = 150, tag = '' } = {}) => {
    const { mk, W_ } = E();
    return list.map((h, i) => {
      const x = 170 + i * 270;
      const g = mk(box, { left: `${x}px`, top: `${y}px`, width: '1px', height: '1px' }, 'a');
      let body;
      if (h.kind === 'mina') {
        body = E().pic(g, `${E().CHARA}mina/chibi.png`, { left: '-20px', top: '-40px', height: `${size * 1.45}px` }, 'a');
      } else body = W_.person(g, 0, 0, h.kind || 'gray', size, '');
      const tg = mk(g, { left: `${size / 2 - 120}px`, top: `${size * 1.3}px`, width: '240px', padding: '6px 0', borderRadius: '10px', background: '#fff3d6', color: '#7a4a10',
        fontSize: '20px', textAlign: 'center', whiteSpace: 'nowrap' }, 'a noto', h.tag || tag);
      tg.style.fontWeight = 900;
      const st = h.state ? mk(g, { left: `${size * .62}px`, top: `${-size * .38}px`, fontSize: `${size * .38}px` }, 'a', h.state) : null;
      const stL = h.stateL ? mk(g, { left: `${size / 2 - 120}px`, top: `${-size * .62}px`, width: '240px', textAlign: 'center', fontSize: '22px', color: '#ffe9a8', whiteSpace: 'nowrap' }, 'a noto', h.stateL) : null;
      if (stL) stL.style.fontWeight = 900;
      const sell = mk(g, { left: `${size / 2 - 50}px`, top: `${-size * .9}px`, width: '100px', height: '64px', borderRadius: '10px', background: '#e0312f', color: '#fff', fontSize: '34px',
        textAlign: 'center', lineHeight: '64px', border: '4px solid #fff' }, 'a noto', '売り');
      sell.style.fontWeight = 900;
      sell.style.opacity = 0;
      return { g, body, tg, st, stL, sell, x };
    });
  };
  const priceBoard = (box, { x = 1460, y = 90, label = '', from = 300, to = 800 } = {}) => {
    const { mk } = E();
    const el = mk(box, { left: `${x}px`, top: `${y}px`, width: '360px', height: '150px', borderRadius: '20px', background: 'rgba(10,20,50,.85)', border: '3px solid rgba(255,255,255,.35)' }, 'a');
    mk(el, { left: 0, top: '14px', width: '100%', textAlign: 'center', fontSize: '24px', color: '#cfe0ff' }, 'a noto', label).style.fontWeight = 900;
    const num = mk(el, { left: 0, top: '52px', width: '100%', textAlign: 'center', fontSize: '66px', color: '#ff7a7a' }, 'a noto', `${from}円`);
    num.style.fontWeight = 900;
    return { el, num, from, to };
  };

  K.oldHolders = () => ({
    build(box) {
      const hs = holderRow(box, [
        { kind: 'gray', state: '💤', stateL: '寝ている' },
        { kind: 'gray', state: '🍳', stateL: '別のことに夢中' },
        { kind: 'gray', state: '👀', stateL: '毎日見ている' },
        { kind: 'gray', state: '❓', stateL: '持っているのを忘れた' },
        { kind: 'gray', state: '💤', stateL: '寝ている' },
        { kind: 'gray', state: '📺', stateL: '別のことに夢中' },
      ], { tag: '800円で買った（3年前）' });
      const board = priceBoard(box, { label: 'ネムノキ化学（※架空）', from: 310, to: 800 });
      const lab = P().label(box, '3年前の持ち主たち', '', { x: 700, y: 60, size: 40 });
      const msg = darkText(box, '売りがそろいにくい', { left: '0', top: '200px', width: '1920px', textAlign: 'center', fontSize: '50px', color: '#ffd24a' });
      return { hs, board, lab, msg };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, lerp } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.pop(st.lab, prog(t, s0, s0 + .4));
      W.slide(st.board.el, prog(t, s0 + .1, s0 + .5), 80, 0);
      st.hs.forEach((h, i) => {
        W.pop(h.g, prog(t, s0 + .2 + i * .12, s0 + .6 + i * .12), { y: h.st && h.st.textContent === '💤' ? Math.sin(t * 1.5 + i) * 4 : 0 });
        if (h.st) W.pop(h.st, prog(t, s0 + .9 + i * .12, s0 + 1.2 + i * .12), { y: Math.sin(t * 2 + i) * 6 });
        if (h.stL) W.fade(h.stL, prog(t, s0 + 1.1 + i * .12, s0 + 1.4 + i * .12));
      });
      // 2 行目：値段が 800 円に近づいても、売りの札はばらばらに上がる
      const a1 = ctx.cut.lines[1] ? ctx.L(1) : s0 + D * .55;
      const pk = ease.inOut(prog(t, a1, a1 + Math.min(3.2, ctx.cut.end - a1 - .4)));
      st.board.num.textContent = `${Math.round(lerp(st.board.from, 780, pk))}円`;
      const when = [ .95, .25, .45, 1.6, 1.6, .8 ];   // 1 を超えるものは上がらない
      st.hs.forEach((h, i) => { const k = prog(pk, when[i], when[i] + .1); T(h.sell, { y: (1 - ease.back(k)) * 30, s: ease.back(k), o: Math.min(1, k * 3) }); });
      W.pop(st.msg, prog(t, a1 + 2.2, a1 + 2.6));
    },
  });

  /* ---------- 想像の空間：最近の急騰高値（500 円）で買った人たち（ミナもいる） ---------- */
  K.freshHolders = () => ({
    build(box) {
      const hs = holderRow(box, [
        { kind: 'indiv', state: '👀' }, { kind: 'margin', state: '👀', tag: '信用で買った' }, { kind: 'mina', state: '👀', tag: 'ミナ（500円）' },
        { kind: 'day', state: '👀', tag: '短期で回す' }, { kind: 'indiv', state: '💤' }, { kind: 'indiv', state: '👀' },
      ], { tag: '500円で買った（最近）' });
      const board = priceBoard(box, { label: 'ミライ製菓（※架空）', from: 452, to: 500 });
      const lab = P().label(box, '最近の急騰高値で買った人たち', '', { x: 700, y: 60, size: 40 });
      const kinds = ['やれやれ売り', '信用の整理', '短期の回転'].map((k, i) => darkText(box, k, { left: `${360 + i * 420}px`, top: '200px', fontSize: '44px', color: '#ffd24a' }));
      const msg = darkText(box, 'そろって出やすい（同期しやすい）', { left: '0', top: '742px', width: '1920px', textAlign: 'center', fontSize: '44px', color: '#ff9a9a' });
      const n1 = darkText(box, '捕まる＝高く買って値下がりし、売るに売れないこと', { left: '140px', top: '818px', fontSize: '26px', color: '#cfe0ff' });
      const n2 = darkText(box, '信用の整理＝お金を借りて買った株を、返すために売ること', { left: '140px', top: '856px', fontSize: '26px', color: '#cfe0ff' });
      return { hs, board, lab, kinds, msg, n1, n2 };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, lerp } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.pop(st.lab, prog(t, s0, s0 + .4));
      W.slide(st.board.el, prog(t, s0 + .1, s0 + .5), 80, 0);
      st.hs.forEach((h, i) => {
        W.pop(h.g, prog(t, s0 + .2 + i * .1, s0 + .6 + i * .1), { y: Math.sin(t * 3 + i) * 3 });
        if (h.st) W.pop(h.st, prog(t, s0 + .8 + i * .05, s0 + 1.1 + i * .05), { y: Math.sin(t * 4 + i) * 4 });
      });
      const a1 = ctx.cut.lines[1] ? ctx.L(1) : s0 + D * .5;
      const pk = ease.inOut(prog(t, a1, a1 + 1.6));
      st.board.num.textContent = `${Math.round(lerp(st.board.from, st.board.to, pk))}円`;
      // 売りの札は、まとまって次々に上がる（寝ている人だけは上げない）
      const when = [.8, .86, .82, .9, null, .94];
      st.hs.forEach((h, i) => { const k = when[i] == null ? 0 : prog(pk, when[i], when[i] + .06); T(h.sell, { y: (1 - ease.back(k)) * 30, s: ease.back(k), o: Math.min(1, k * 3) }); });
      st.kinds.forEach((k, i) => W.pop(k, prog(t, a1 + 1.7 + i * .25, a1 + 2.0 + i * .25)));
      W.fade(st.msg, prog(t, a1 + 2.6, a1 + 3.0));
      W.fade(st.n1, prog(t, s0 + 1.2, s0 + 1.6));
      W.fade(st.n2, prog(t, a1 + 2.0, a1 + 2.4));
    },
  });

  /* ---------- 比較：古いシコリ と 新しいシコリ（鮮度） ---------- */
  K.freshCompare = () => ({
    build(box) {
      const { mk } = E();
      const card = (x, title, color) => {
        const c = mk(box, { left: `${x}px`, top: '150px', width: '780px', height: '640px', background: '#fff', borderRadius: '26px', boxShadow: '0 16px 30px rgba(40,30,20,.2)', overflow: 'hidden' }, 'a');
        mk(c, { left: 0, top: 0, width: '100%', height: '96px', background: color }, 'a');
        mk(c, { left: '30px', top: '20px', fontSize: '42px', color: '#fff', whiteSpace: 'nowrap' }, 'a noto', title).style.fontWeight = 900;
        return c;
      };
      const L = card(140, 'ネムノキ化学　3年前の高値', '#7f8c8d');
      const R = card(1000, 'ミライ製菓　最近の急騰高値', '#d6392f');
      const nd = NEM.d.slice(0, 80);
      const lc = E().W_.candles(L, 30, 150, 720, 330, nd, { lo: 230, hi: 880, up: '#e0453a', down: '#2f7ad6', grid: 'rgba(0,0,0,.05)' });
      const rc = E().W_.candles(R, 30, 150, 720, 330, [...K.DATA.MIRAI_NEXT, [438, 446, 430, 441], [441, 450, 436, 446], [446, 453, 440, 444], [444, 456, 441, 452]], { lo: 330, hi: 520, up: '#e0453a', down: '#2f7ad6', grid: 'rgba(0,0,0,.05)' });
      const lb = mk(L, { left: '30px', top: `${150 + lc.Y(840)}px`, width: '720px', height: `${lc.Y(700) - lc.Y(840)}px`, background: 'rgba(150,150,150,.25)', borderRadius: '6px' }, 'a');
      const rb = mk(R, { left: '30px', top: `${150 + rc.Y(512)}px`, width: '720px', height: `${rc.Y(488) - rc.Y(512)}px`, background: 'rgba(255,90,60,.45)', borderRadius: '6px',
        boxShadow: '0 0 24px rgba(255,90,60,.8)' }, 'a');
      const lt = mk(L, { left: 0, top: '510px', width: '100%', textAlign: 'center', fontSize: '40px', color: '#7f8c8d' }, 'a noto', '古いシコリ');
      const rt = mk(R, { left: 0, top: '510px', width: '100%', textAlign: 'center', fontSize: '40px', color: '#d6392f' }, 'a noto', '新しいシコリ');
      const lf = mk(L, { left: 0, top: '566px', width: '100%', textAlign: 'center', fontSize: '32px', color: '#555' }, 'a noto', '鮮度が落ちている');
      const rf = mk(R, { left: 0, top: '566px', width: '100%', textAlign: 'center', fontSize: '32px', color: '#555' }, 'a noto', '鮮度が高い・活発');
      [lt, rt, lf, rf].forEach(e => { e.style.fontWeight = 900; });
      const def = note(box, 'シコリ＝高値で買われて損したまま残り、戻ると売りになり得る株', { left: '0', top: '830px', width: '1920px', textAlign: 'center', fontSize: '32px', color: '#5a4630' });
      const ex = note(box, '※どちらも架空の銘柄・値動きはイメージ', { left: '1480px', top: '880px', fontSize: '22px', color: '#7a6a55' });
      return { L, R, lc, rc, lb, rb, lt, rt, lf, rf, def, ex };
    },
    update(t, ctx, st, W) {
      const { prog, ease } = E();
      const s0 = ctx.cut.start;
      W.slide(st.L, prog(t, s0, s0 + .45), -80, 0);
      W.slide(st.R, prog(t, s0 + .15, s0 + .6), 80, 0);
      st.lc.reveal(ease.out(prog(t, s0 + .3, s0 + 1.5)));
      st.rc.reveal(ease.out(prog(t, s0 + .4, s0 + 1.6)));
      W.fade(st.lb, prog(t, s0 + 1.4, s0 + 1.8) * .9);
      st.rb.style.opacity = prog(t, s0 + 1.5, s0 + 1.9) * (.7 + .3 * Math.sin(t * 5));
      W.pop(st.lt, prog(t, s0 + 1.8, s0 + 2.1)); W.pop(st.rt, prog(t, s0 + 1.9, s0 + 2.2));
      W.fade(st.def, prog(t, s0 + .8, s0 + 1.2));
      W.fade(st.ex, prog(t, s0 + .8, s0 + 1.2));
      const a1 = ctx.cut.lines[1] ? ctx.L(1) : s0 + 3;
      W.pop(st.lf, prog(t, a1 + .2, a1 + .5)); W.pop(st.rf, prog(t, a1 + .5, a1 + .8));
    },
  });

  /* ---------- 表：状態と需給上の見方（3 行） ---------- */
  K.freshTable = ({ rowLine = [0, 2, 3], hiLine = 1 } = {}) => ({
    build(box) {
      const tb = P().table(box, ['状態', '需給上の見方'], [
        ['2〜3年前の\n出来高帯', '保有者が残っていても、売りの同期性は低下しやすい。\n実売りは再接近時に確認。'],
        ['直近1〜3か月の\n急騰高値', '高値掴み・信用・短期参加者がまだ能動的。\n戻り売りが出やすい。'],
        ['長期休眠＋\n最近の好材料', '古いシコリの鮮度が落ちた所へ、\n新しい買い手を呼ぶ触媒になり得る。'],
      ], { x: 120, y: 200, colW: [440, 1240], rowH: 160, font: 34, title: 'シコリの鮮度' });
      const hl = E().mk(tb.rows[0], { left: '466px', top: '86px', width: '420px', height: '44px', background: 'rgba(242,182,50,.45)', borderRadius: '6px', transformOrigin: '0 50%' }, 'a');
      tb.rows[0].insertBefore(hl, tb.rows[0].firstChild);
      const n1 = note(box, '同期性＝売りがそろって出ること／再接近＝その値段にまた近づくこと', { left: '140px', top: '842px', fontSize: '26px' });
      const n2 = note(box, '好材料＝株価が上がるきっかけになりそうなニュース', { left: '140px', top: '880px', fontSize: '26px' });
      const n3 = note(box, '戻り売り＝値段が戻ったところで出る売り', { left: '1040px', top: '842px', fontSize: '26px' });
      return { tb, hl, n1, n2, n3 };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T } = E();
      const s0 = ctx.cut.start;
      W.pop(st.tb.title, prog(t, s0, s0 + .4));
      W.fade(st.tb.head, prog(t, s0 + .1, s0 + .4));
      st.tb.rows.forEach((r, i) => { const a = at(ctx, rowLine[i], 4) + .15; W.slide(r, prog(t, a, a + .45), -80, 0); });
      const h = at(ctx, hiLine, 4) + .3;
      T(st.hl, { sx: ease.out(prog(t, h, h + .6)), sy: 1 });
      W.fade(st.n1, prog(t, s0 + .8, s0 + 1.2));
      W.fade(st.n2, prog(t, at(ctx, rowLine[2], 4), at(ctx, rowLine[2], 4) + .4));
      W.fade(st.n3, prog(t, at(ctx, rowLine[1], 4) + .3, at(ctx, rowLine[1], 4) + .7));
    },
  });

  /* ---------- メモ：長期停滞＝昔の捕まり玉が消えた、とは決めつけない ---------- */
  K.conclusionMemo = () => ({
    build(box) {
      const W_ = E().W_;
      const paper = P().paper(box, { x: 300, y: 70, w: 1320, h: 860, rot: -1 });
      const l1 = W_.write(paper, '長期停滞 ＝ 昔の捕まり玉が投げて消えた', { left: '70px', top: '90px', fontSize: '56px', color: '#2b2b38' });
      const x = E().mk(paper, { left: '60px', top: '124px', width: '1140px', height: '9px', borderRadius: '5px', background: '#e0312f', transformOrigin: '0 50%' }, 'a');
      const l2 = W_.write(paper, '→ 決めつけない', { left: '760px', top: '220px', fontSize: '50px', color: '#e0312f' });
      const l3 = W_.write(paper, '時間 … シコリが動きにくくなる（行動性が弱まる）', { left: '70px', top: '390px', fontSize: '44px', color: '#2b2b38' });
      const l4 = W_.write(paper, '答え合わせ … その後の実売り', { left: '70px', top: '500px', fontSize: '44px', color: '#2b2b38' });
      const l5 = W_.write(paper, '捕まり玉＝高値で買って、損をかかえたまま残っている株', { left: '70px', top: '680px', fontSize: '30px', color: '#5a6a85' });
      const l6 = W_.write(paper, '投げる＝損を覚悟で売ること', { left: '70px', top: '730px', fontSize: '30px', color: '#5a6a85' });
      return { paper, l1, x, l2, l3, l4, l5, l6 };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.slide(st.paper, prog(t, s0 - .1, s0 + .4), 0, 60, { r: -1 });
      st.l1.show(prog(t, s0 + .2, s0 + 1.4));
      E().T(st.x, { sx: E().ease.out(prog(t, s0 + 1.5, s0 + 1.9)), sy: 1, r: -1.5 });
      st.l2.show(prog(t, s0 + 1.9, s0 + 2.4));
      st.l5.show(prog(t, s0 + 2.2, s0 + 2.8));
      st.l6.show(prog(t, s0 + 2.6, s0 + 3.0));
      st.l3.show(prog(t, s0 + D * .7, s0 + D * .7 + .8));
      st.l4.show(prog(t, s0 + D * .8, s0 + D * .8 + .6));
    },
  });

  /* ---------- タブレット：底の拡大（週足の説明と、出来高の塊） ---------- */
  K.nemBottom = () => ({
    build(box) {
      const from = NEM.d.length - 30;
      const c = nemChart(box, { from, lo: 270, hi: 360, y: 150, h: 420, volH: 170 });
      const title = darkText(box, 'ネムノキ化学（※架空）　週足・底のあたり', { left: '70px', top: '40px', fontSize: '38px' });
      const wk = E().mk(box, { left: '880px', top: '30px', padding: '10px 24px', borderRadius: '14px', background: '#ffd24a', color: '#26365e', fontSize: '32px', whiteSpace: 'nowrap' }, 'a noto', '週足＝ローソク足1本が1週間');
      wk.style.fontWeight = 900;
      const one = E().mk(box, { left: `${c.Xi(from + 10) - c.ch.cw / 2 - 6}px`, top: `${c.y - 10}px`, width: `${c.ch.cw + 12}px`, height: `${c.h + c.volH + 40}px`, border: '4px dashed #ffd24a', borderRadius: '10px' }, 'a');
      const oneL = darkText(box, '1本＝1週間', { left: `${c.Xi(from + 10) - 70}px`, top: `${c.y + c.h + c.volH + 40}px`, fontSize: '28px', color: '#ffd24a' });
      const rx = c.Xi(NEM.d.length - 4);
      const ring = P().circle(box, rx, c.y + c.h + 20 + c.volH * .55, 190, c.volH * .62, { color: '#ff6b6b', width: 7 });
      const ringL = darkText(box, 'いつもと違う出来高の塊が、続いている', { left: `${rx - 560}px`, top: `${c.y + c.h - 40}px`, fontSize: '32px', color: '#ff9a9a' });
      const zone = darkText(box, '底値圏（300円台）', { left: '70px', top: '96px', fontSize: '30px', color: '#cfe0ff' });
      return { c, title, wk, one, oneL, ring, ringL, zone };
    },
    update(t, ctx, st, W) {
      const { prog, ease } = E();
      const s0 = ctx.cut.start;
      W.fade(st.title, prog(t, s0, s0 + .4));
      st.c.ch.reveal(ease.out(prog(t, s0 + .2, s0 + 1.6)));
      W.fade(st.zone, prog(t, s0 + 1.2, s0 + 1.6));
      const a1 = at(ctx, 1, 3), a2 = at(ctx, 2, 3);
      W.pop(st.wk, prog(t, a1, a1 + .4));
      W.fade(st.one, prog(t, a1 + .3, a1 + .6)); W.fade(st.oneL, prog(t, a1 + .4, a1 + .7));
      st.ring.draw(prog(t, a2 + .1, a2 + .7));
      W.fade(st.ringL, prog(t, a2 + .5, a2 + .9));
    },
  });

  /* ---------- 比較：高値圏の大出来高 と 底値圏の出来高増 ---------- */
  K.highLow = ({ step = 'both' } = {}) => ({
    build(box) {
      const { mk } = E();
      const card = (x, title, color) => {
        const c = mk(box, { left: `${x}px`, top: '130px', width: '800px', height: '700px', background: '#fff', borderRadius: '26px', boxShadow: '0 16px 30px rgba(40,30,20,.2)', overflow: 'hidden' }, 'a');
        mk(c, { left: 0, top: 0, width: '100%', height: '96px', background: color }, 'a');
        mk(c, { left: 0, top: '20px', width: '100%', textAlign: 'center', fontSize: '44px', color: '#fff' }, 'a noto', title).style.fontWeight = 900;
        return c;
      };
      const L = card(130, '高値圏の大出来高', '#d6392f');
      const R = card(990, '底値圏の出来高増', '#26365e');
      // 左：上から売りの箱が降ってきて、買いのお金（コイン）で受け止める
      const coins = Array.from({ length: 12 }, (_, i) => mk(L, { left: `${120 + (i % 6) * 95}px`, top: `${540 - Math.floor(i / 6) * 70}px`, width: '80px', height: '60px', borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #ffe68a, #f2a900)', border: '3px solid #b07a00', fontSize: '30px', textAlign: 'center', lineHeight: '54px', color: '#7a5a00' }, 'a noto', '¥'));
      const drops = P().boxes(L, { cols: 6, rows: 1, cx: 400, bottom: 230, bw: 80, bh: 64, gap: 15, label: '売り' });
      const lt = mk(L, { left: 0, top: '620px', width: '100%', textAlign: 'center', fontSize: '32px', color: '#c0392b' }, 'a noto', '買うお金を使って、売り物をさばく');
      // 右：浮動玉の箱が、安く強い手の金庫へ
      const floats = P().boxes(R, { cols: 6, rows: 1, cx: 300, bottom: 600, bw: 70, bh: 56, gap: 8, label: '浮動', color: '#ffd24a' });
      const vault = mk(R, { left: '530px', top: '300px', width: '230px', height: '300px', background: 'linear-gradient(#8e98ab, #6b7488)', borderRadius: '18px', border: '7px solid #4d5568' }, 'a');
      mk(vault, { left: 0, top: '200px', width: '100%', textAlign: 'center', fontSize: '30px', color: '#fff' }, 'a noto', '強い手').style.fontWeight = 900;
      const rt = mk(R, { left: 0, top: '620px', width: '100%', textAlign: 'center', fontSize: '32px', color: '#26365e' }, 'a noto', '浮動玉を安く、強い手へ移す');
      const def = note(box, '強い手＝すぐには売らない持ち主', { left: '1300px', top: '850px', fontSize: '28px' });
      [lt, rt].forEach(e => { e.style.fontWeight = 900; });
      return { L, R, coins, drops, lt, floats, vault, rt, def };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, lerp } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.slide(st.L, prog(t, s0, s0 + .45), -80, 0);
      W.slide(st.R, prog(t, s0 + .15, s0 + .6), 80, 0);
      const doL = step === 'both' || step === 'anim';
      const aL = step === 'anim' ? at(ctx, 0, 2) : s0 + .6;
      const aR = step === 'anim' ? at(ctx, 1, 2) : s0 + .9;
      st.coins.forEach(c => W.fade(c, prog(t, s0 + .4, s0 + .7)));
      st.drops.forEach((b, i) => {
        if (step === 'intro') { T(b.el, { y: 120 }); return; }
        const k = ease.in(prog(t, aL + i * .25, aL + .7 + i * .25));
        T(b.el, { y: lerp(-200, 300, k), o: k < 1 ? 1 : 0 });
        const coin = st.coins[11 - i * 2];
        if (coin) coin.style.opacity = k >= 1 ? .15 : coin.style.opacity;
      });
      W.fade(st.lt, step === 'intro' ? 0 : prog(t, aL + .5, aL + .9));
      st.floats.forEach((b, i) => {
        if (step === 'intro') { T(b.el, {}); return; }
        const k = ease.inOut(prog(t, aR + i * .2, aR + .7 + i * .2));
        T(b.el, { x: lerp(0, 560 + (i % 3) * 60 - b.x, k), y: lerp(0, 360 + Math.floor(i / 3) * 60 - b.y, k) - Math.sin(k * Math.PI) * 120, s: lerp(1, .8, k) });
      });
      W.fade(st.rt, step === 'intro' ? 0 : prog(t, aR + .8, aR + 1.2));
      W.fade(st.def, step === 'intro' ? 0 : prog(t, aR + 1.0, aR + 1.4));
    },
  });

  /* ---------- 箱：安値で出る売り物を、集めたい側が拾う（取得単価を抑える） ---------- */
  K.bottomCollect = () => ({
    build(box) {
      const { mk, W_ } = E();
      const floor = note(box, '安値（300円付近）', { left: '820px', top: '880px', fontSize: '30px', color: '#5a4630' });
      const sellers = [0, 1, 2].map(i => W_.person(box, 150 + i * 170, 520, 'gray', 130, ''));
      const bx = P().boxes(box, { cols: 6, rows: 1, cx: 760, bottom: 850, bw: 90, bh: 70, label: '売り' });
      const col = W_.person(box, 1330, 470, 'long', 170, '集めたい側', '#3b2c1a');
      const vault = mk(box, { left: '1620px', top: '560px', width: '240px', height: '290px', background: 'linear-gradient(#8e98ab, #6b7488)', borderRadius: '18px', border: '7px solid #4d5568' }, 'a');
      const meter = mk(box, { left: '1250px', top: '170px', width: '520px', height: '170px', borderRadius: '22px', background: '#26365e' }, 'a');
      mk(meter, { left: 0, top: '18px', width: '100%', textAlign: 'center', fontSize: '30px', color: '#cfd6e6' }, 'a noto', '取得単価（買った株の平均の値段）');
      const num = mk(meter, { left: 0, top: '62px', width: '100%', textAlign: 'center', fontSize: '74px', color: '#ffd24a' }, 'a noto', '—');
      num.style.fontWeight = 900;
      const lab = P().label(box, '安値で出る売り物 ＝ 集めたい側には収集機会', '', { x: 700, y: 60, size: 38 });
      return { floor, sellers, bx, col, vault, meter, num, lab };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, lerp } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.pop(st.lab, prog(t, s0, s0 + .4));
      st.sellers.forEach((p, i) => W.slide(p, prog(t, s0 + .1 + i * .1, s0 + .5 + i * .1), -80, 0));
      W.slide(st.col, prog(t, s0 + .2, s0 + .6), 80, 0);
      W.fade(st.vault, prog(t, s0 + .3, s0 + .6));
      W.slide(st.meter, prog(t, s0 + .4, s0 + .8), 0, -40);
      W.fade(st.floor, prog(t, s0 + .4, s0 + .8));
      let got = 0;
      st.bx.forEach((b, i) => {
        const k0 = prog(t, s0 + .5 + i * .1, s0 + .8 + i * .1);
        const k = ease.inOut(prog(t, s0 + 1.2 + i * (D - 2.2) / 6, s0 + 1.8 + i * (D - 2.2) / 6));
        if (k >= 1) got++;
        T(b.el, { x: lerp(0, 1640 + (i % 3) * 64 - b.x, k), y: (1 - ease.out(k0)) * -200 + lerp(0, 640 + Math.floor(i / 3) * 70 - b.y, k) - Math.sin(k * Math.PI) * 140, s: lerp(1, .7, k), o: Math.min(1, k0 * 3) });
      });
      st.num.textContent = got ? `${[0, 305, 303, 304, 302, 303, 303][got]}円` : '—';
    },
  });

  /* ---------- 比較：1 日だけの急増 と 週ごとに増える出来高 ---------- */
  K.weeklyVsSpike = () => ({
    build(box) {
      const { mk } = E();
      const card = (x, title) => {
        const c = mk(box, { left: `${x}px`, top: '160px', width: '780px', height: '620px', background: '#fff', borderRadius: '26px', boxShadow: '0 16px 30px rgba(40,30,20,.2)' }, 'a');
        mk(c, { left: 0, top: '26px', width: '100%', textAlign: 'center', fontSize: '42px', color: '#26365e' }, 'a noto', title).style.fontWeight = 900;
        return c;
      };
      const L = card(140, '1日だけの急増');
      const R = card(1000, '週ごとに増えていく');
      const barsL = [6, 7, 6, 8, 40, 7, 6, 7].map((v, i) => mk(L, { left: `${80 + i * 80}px`, top: `${560 - v * 9}px`, width: '56px', height: `${v * 9}px`, background: i === 4 ? '#e0453a' : '#9fb4dd', borderRadius: '6px 6px 0 0', transformOrigin: '50% 100%' }, 'a'));
      const barsR = [6, 8, 11, 15, 19, 24, 29, 34].map((v, i) => mk(R, { left: `${80 + i * 80}px`, top: `${560 - v * 9}px`, width: '56px', height: `${v * 9}px`, background: '#ffb000', borderRadius: '6px 6px 0 0', transformOrigin: '50% 100%' }, 'a'));
      const ring = P().circle(box, 1390, 470, 420, 300, { color: '#e0312f', width: 9 });
      const msg = note(box, '1日だけの急増より、続いているか（継続性）を見る', { left: '0', top: '820px', width: '1920px', textAlign: 'center', fontSize: '40px', color: '#c0392b' });
      return { L, R, barsL, barsR, ring, msg };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.slide(st.L, prog(t, s0, s0 + .45), -80, 0);
      W.slide(st.R, prog(t, s0 + .15, s0 + .6), 80, 0);
      st.barsL.forEach((b, i) => T(b, { sy: ease.out(prog(t, s0 + .5 + i * .1, s0 + .8 + i * .1)), sx: 1 }));
      st.barsR.forEach((b, i) => T(b, { sy: ease.out(prog(t, s0 + 1.2 + i * .15, s0 + 1.5 + i * .15)), sx: 1 }));
      st.ring.draw(prog(t, s0 + D * .65, s0 + D * .65 + .6));
      W.fade(st.msg, prog(t, s0 + D * .55, s0 + D * .55 + .4));
    },
  });

  /* ---------- タブレット：小さな陽線のあとの大陽線（その日の出来高は小さくてもよい） ---------- */
  K.bigYang = () => ({
    build(box) {
      const { mk } = E();
      const data = [[300, 306, 296, 304], [304, 310, 301, 308], [308, 313, 305, 311], [311, 317, 308, 315], [315, 320, 312, 318], [318, 362, 316, 358]];
      const vol = [10, 11, 10, 12, 11, 13];
      const ch = E().W_.candles(box, 200, 170, 900, 430, data, { lo: 285, hi: 370, up: '#ff6b6b', down: '#5aa9ff', vol, volH: 150, volColor: i => (i === 5 ? '#ffd24a' : 'rgba(150,180,230,.6)'), grid: 'rgba(255,255,255,.07)' });
      const title = darkText(box, '日足の例（ローソク足1本＝1日）', { left: '70px', top: '30px', fontSize: '36px' });
      const small = darkText(box, '小さな陽線が続く', { left: '230px', top: '150px', fontSize: '34px', color: '#cfe0ff' });
      const big = darkText(box, '大陽線', { left: '1000px', top: '150px', fontSize: '44px', color: '#ff9a9a' });
      const def = darkText(box, '陽線＝始値より終値が高いローソク足（赤）／大陽線＝大きく上がった長い陽線', { left: '70px', top: '86px', fontSize: '28px', color: '#cfe0ff' });
      const ring = P().circle(box, 200 + 900 / 6 * 5.5, 170 + 430 + 20 + 150 - 30, 70, 50, { color: '#ffd24a', width: 6 });
      const vl = darkText(box, 'その日の出来高は、大きくなくてもいい', { left: '600px', top: '800px', fontSize: '36px', color: '#ffd24a' });
      return { ch, title, small, big, def, ring, vl };
    },
    update(t, ctx, st, W) {
      const { prog, ease } = E();
      const s0 = ctx.cut.start;
      W.fade(st.title, prog(t, s0, s0 + .4));
      st.ch.reveal(ease.lin(prog(t, s0 + .3, s0 + 2.2)));
      W.fade(st.small, prog(t, s0 + .8, s0 + 1.1));
      W.pop(st.big, prog(t, s0 + 2.0, s0 + 2.4));
      W.fade(st.def, prog(t, s0 + 1.2, s0 + 1.6));
      const a1 = at(ctx, 1, 2);
      st.ring.draw(prog(t, a1 + .1, a1 + .6));
      W.fade(st.vl, prog(t, a1 + .4, a1 + .8));
    },
  });

  /* ---------- 箱：売り物が薄い棚。少しの買いで上の段へ ---------- */
  K.thinShelf = () => ({
    build(box) {
      const { mk } = E();
      const shelf = mk(box, { left: '520px', top: '170px', width: '800px', height: '680px', background: 'rgba(138,106,72,.12)', borderRadius: '12px', border: '6px solid #8a6a48' }, 'a');
      const rungs = [0, 1, 2, 3, 4].map(i => {
        const y = 110 + i * 130;
        mk(shelf, { left: '20px', top: `${y}px`, width: '750px', height: '14px', background: '#8a6a48', borderRadius: '7px' }, 'a');
        const p = mk(shelf, { left: '-150px', top: `${y - 22}px`, fontSize: '32px', color: '#5a4630', whiteSpace: 'nowrap' }, 'a noto', `${360 - i * 15}円`);
        p.style.fontWeight = 900;
        return y;
      });
      const sells = [[1, 0], [3, 2]].map(([r, c]) => mk(shelf, { left: `${200 + c * 140}px`, top: `${rungs[r] - 60}px`, width: '110px', height: '56px', background: '#ffd24a', border: '3px solid #a87a48',
        borderRadius: '6px', fontSize: '22px', textAlign: 'center', lineHeight: '50px', color: '#7a5a20' }, 'a noto', '売り'));
      const marker = mk(shelf, { left: '640px', top: `${rungs[4] - 70}px`, width: '110px', height: '70px', borderRadius: '50%', background: '#e0312f', color: '#fff', fontSize: '24px',
        textAlign: 'center', lineHeight: '70px' }, 'a noto', 'いま');
      marker.style.fontWeight = 900;
      const buy = note(box, '少しの買い', { left: '1360px', top: '700px', fontSize: '36px', color: '#c0392b' });
      const msg = note(box, '売り物が薄い → 少ない出来高でも大きく上がる', { left: '0', top: '90px', width: '1920px', textAlign: 'center', fontSize: '42px', color: '#26365e' });
      const thin = note(box, '売り物が少ない（薄い）棚', { left: '700px', top: '870px', fontSize: '28px', color: '#7a6a55' });
      return { shelf, rungs, sells, marker, buy, msg, thin };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, lerp } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.fade(st.shelf, prog(t, s0, s0 + .4));
      st.sells.forEach((s, i) => W.pop(s, prog(t, s0 + .4 + i * .15, s0 + .7 + i * .15)));
      W.fade(st.thin, prog(t, s0 + .6, s0 + 1.0));
      W.pop(st.marker, prog(t, s0 + .7, s0 + 1.0));
      W.slide(st.buy, prog(t, s0 + 1.1, s0 + 1.4), 60, 0);
      const k = ease.inOut(prog(t, s0 + 1.5, s0 + Math.min(D - .6, 3.0)));
      T(st.marker, { y: lerp(0, st.rungs[0] - st.rungs[4], k), s: 1 + Math.sin(k * Math.PI) * .2 });
      W.fade(st.msg, prog(t, s0 + D * .6, s0 + D * .6 + .4));
    },
  });

  /* ---------- タブレット：下落途中の出来高急増。『仕込み？』と決めつけない ---------- */
  K.fallingSpike = () => ({
    build(box) {
      const data = [];
      let p = 420;
      for (let i = 0; i < 16; i++) { const o = p; p = p - 8 - Math.sin(i) * 4 + (i === 8 ? -10 : 0); data.push([o, o + 5, p - 6, p]); }
      const vol = data.map((_, i) => (i === 8 ? 60 : 8 + (i % 3) * 2));
      const ch = E().W_.candles(box, 160, 170, 1000, 420, data, { lo: 260, hi: 430, up: '#ff6b6b', down: '#5aa9ff', vol, volH: 160, volColor: i => (i === 8 ? '#ff6b6b' : 'rgba(150,180,230,.6)'), grid: 'rgba(255,255,255,.07)' });
      const title = darkText(box, '下がる途中の、出来高急増（例）', { left: '160px', top: '60px', fontSize: '38px' });
      const q = E().mk(box, { left: '520px', top: '640px', padding: '10px 28px', borderRadius: '16px', background: '#fff', color: '#26365e', fontSize: '48px', whiteSpace: 'nowrap' }, 'a noto', '仕込み？');
      q.style.fontWeight = 900;
      const x = E().W_.stamp(box, 540, 560, 'x', 220);
      x.querySelector('path').setAttribute('stroke', '#ff4d4d');
      const msg = darkText(box, '価格の反応を確かめずに、断定しない', { left: '0', top: '820px', width: '1440px', textAlign: 'center', fontSize: '40px', color: '#ffd24a' });
      return { ch, title, q, x, msg };
    },
    update(t, ctx, st, W) {
      const { prog, ease } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.fade(st.title, prog(t, s0, s0 + .3));
      st.ch.reveal(ease.lin(prog(t, s0 + .2, s0 + 1.6)));
      W.pop(st.q, prog(t, s0 + 1.6, s0 + 1.9));
      W.pop(st.x, prog(t, s0 + D * .55, s0 + D * .55 + .3), { r: -6 });
      W.fade(st.msg, prog(t, s0 + D * .6, s0 + D * .6 + .4));
    },
  });

  window.KIT = K;
})();
