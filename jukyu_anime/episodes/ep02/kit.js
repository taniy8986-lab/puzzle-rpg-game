/* 第2章の小道具の部品。第1章の部品（../ep01/kit.js）に足す。
 * どの部品も { build(box, ctx, W), update(t, ctx, st, W) } を返す。
 */
(function () {
  'use strict';
  const K = window.KIT;
  const P = () => window.PROPS;
  const E = () => window.E;

  // n 行目の頭（カットが 1 行だけなら、カットの長さを等分した時刻）
  const at = (ctx, n, parts = 1) => {
    if (ctx.cut.lines[n]) return ctx.L(n);
    const D = ctx.cut.end - ctx.cut.start;
    return ctx.cut.start + .3 + n * (D - .6) / Math.max(1, parts);
  };
  const pill = (box, text, st = {}) => {
    const el = E().mk(box, Object.assign({ padding: '8px 26px', borderRadius: '999px', background: '#26365e', color: '#fff', fontSize: '34px', whiteSpace: 'nowrap' }, st), 'a noto', text);
    el.style.fontWeight = 900;
    return el;
  };
  const note = (box, text, st = {}) => {
    const el = E().mk(box, Object.assign({ fontSize: '30px', color: '#5a4630', whiteSpace: 'nowrap' }, st), 'a noto', text);
    el.style.fontWeight = 900;
    return el;
  };
  const counterBox = (box, x, y, title, { dark = false, w = 380 } = {}) => {
    const { mk } = E();
    const el = mk(box, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: '170px', background: dark ? 'rgba(255,255,255,.08)' : '#26365e', borderRadius: '22px',
      border: dark ? '3px solid rgba(255,255,255,.3)' : 'none' }, 'a');
    mk(el, { left: 0, top: '18px', width: '100%', textAlign: 'center', fontSize: '30px', color: '#cfd6e6' }, 'a noto', title);
    const num = mk(el, { left: 0, top: '62px', width: '100%', textAlign: 'center', fontSize: '74px', color: '#ffd24a' }, 'a noto', '0');
    num.style.fontWeight = 900;
    return { el, num };
  };

  /* ---------- 同じ 10 万株が 10 回転して出来高 100 万株 ---------- */
  K.rotation = ({ turns = 10, title = '同じ10万株が10回転すると…', sub = '' } = {}) => ({
    build(box) {
      const { W_ } = E();
      const a = W_.person(box, 160, 360, 'day', 200, 'デイトレA', '#3b2c1a');
      const b = W_.person(box, 1560, 360, 'day', 200, 'デイトレB', '#3b2c1a');
      const bx = P().boxes(box, { cols: 5, rows: 2, cx: 560, bottom: 850, bw: 86, bh: 70, gap: 4 });
      const vol = counterBox(box, 770, 170, '出来高');
      const real = note(box, '動いた株は、ずっと同じ10万株', { left: '640px', top: '380px', fontSize: '36px', color: '#c0392b' });
      const lab = P().label(box, title, '', { y: 40, size: 38 });
      const unit = note(box, '1箱＝1万株（例）', { left: '1560px', top: '880px', fontSize: '26px', color: '#7a6a55' });
      const sb = sub ? note(box, sub, { left: '0', top: '120px', width: '1920px', textAlign: 'center', fontSize: '32px', color: '#7a6a55' }) : null;
      return { a, b, bx, vol, real, lab, unit, sb };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, lerp } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.pop(st.lab, prog(t, s0, s0 + .4));
      W.slide(st.a, prog(t, s0 + .1, s0 + .5), -80, 0);
      W.slide(st.b, prog(t, s0 + .2, s0 + .6), 80, 0);
      W.slide(st.vol.el, prog(t, s0 + .3, s0 + .7), 0, -40);
      // 往復：区間 1 回ごとに 10 万株ぶん出来高が増える
      const t0 = s0 + .8, span = Math.max(2.4, D - 1.8);
      const per = span / turns;
      const u = (t - t0) / per;
      const done = Math.max(0, Math.min(turns, Math.floor(u)));
      const frac = ease.inOut(Math.max(0, Math.min(1, u - done)));
      const leg = Math.min(done, turns - 1);
      const going = u >= turns ? (turns % 2 === 1) : (leg % 2 === 0);
      const k = u >= turns ? 1 : (u < 0 ? 0 : frac);
      const pos = going ? k : 1 - k;            // 0＝A の足元、1＝B の足元
      const shift = 1360 - 560;
      st.bx.forEach((b, i) => T(b.el, { x: pos * shift, y: -Math.sin(k * Math.PI) * (80 + (i % 5) * 6) * (u >= 0 && u < turns ? 1 : 0) }));
      const traded = Math.min(turns, Math.max(0, u)) * 10;
      st.vol.num.textContent = `${Math.round(Math.min(turns * 10, Math.floor(traded / 10) * 10 + (frac > .5 && u < turns ? 10 : 0)))}万株`;
      W.fade(st.real, prog(t, t0 + span * .55, t0 + span * .55 + .4));
      W.fade(st.unit, prog(t, s0 + .5, s0 + .9));
      if (st.sb) W.fade(st.sb, prog(t, s0 + .4, s0 + .8));
    },
  });

  /* ---------- 同じ出来高 100 万株でも：一方向に固定 と 10 回転 ---------- */
  K.volumeCompare = () => ({
    build(box) {
      const { mk, W_ } = E();
      const div = mk(box, { left: '958px', top: '160px', width: '4px', height: '700px', background: 'rgba(60,40,20,.2)' }, 'a');
      // 左：100 万株が新しい持ち主の金庫へ（1 箱＝10 万株）
      const vault = mk(box, { left: '560px', top: '560px', width: '320px', height: '290px', background: 'linear-gradient(#8e98ab, #6b7488)', borderRadius: '20px', border: '7px solid #4d5568' }, 'a');
      mk(vault, { left: 0, top: '200px', width: '100%', textAlign: 'center', fontSize: '28px', color: '#fff' }, 'a noto', '新しい持ち主').style.fontWeight = 900;
      const L = P().boxes(box, { cols: 5, rows: 2, cx: 300, bottom: 850, bw: 92, bh: 76, gap: 4, label: '10万' });
      const vL = counterBox(box, 110, 200, '出来高', { w: 360 });
      const cL = note(box, '一方向に固定', { left: '540px', top: '250px', fontSize: '40px', color: '#26365e' });
      // 右：10 万株が 2 人の間を 10 往復
      const pa = W_.person(box, 1040, 600, 'day', 150, '', '#3b2c1a');
      const pb = W_.person(box, 1690, 600, 'day', 150, '', '#3b2c1a');
      const R = P().boxes(box, { cols: 1, rows: 1, cx: 1250, bottom: 850, bw: 92, bh: 76, label: '10万' });
      const vR = counterBox(box, 1450, 200, '出来高', { w: 360 });
      const cR = note(box, '10回転', { left: '1110px', top: '250px', fontSize: '40px', color: '#c0392b' });
      const unit = note(box, '1箱＝10万株（例）', { left: '1560px', top: '880px', fontSize: '26px', color: '#7a6a55' });
      return { div, vault, L, vL, cL, pa, pb, R, vR, cR, unit };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, lerp } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.slide(st.vault, prog(t, s0, s0 + .4), 0, 60);
      [st.vL.el, st.vR.el].forEach((e, i) => W.slide(e, prog(t, s0 + .1 + i * .1, s0 + .5 + i * .1), 0, -40));
      W.fade(st.cL, prog(t, s0 + .3, s0 + .7)); W.fade(st.cR, prog(t, s0 + .4, s0 + .8));
      W.fade(st.pa, prog(t, s0 + .2, s0 + .5)); W.fade(st.pb, prog(t, s0 + .2, s0 + .5));
      W.fade(st.unit, prog(t, s0 + .5, s0 + .9));
      const t0 = s0 + .8, span = Math.max(2.4, D - 1.6);
      // 左：10 箱が順に金庫へ
      let movedL = 0;
      st.L.forEach((b, i) => {
        const k = ease.inOut(prog(t, t0 + i * span / 10, t0 + (i + .8) * span / 10));
        if (k >= 1) movedL++;
        T(b.el, { x: lerp(0, 640 + (i % 3) * 70 - b.x, k), y: lerp(0, 620 + Math.floor(i / 3) * 40 - b.y, k) - Math.sin(k * Math.PI) * 120, s: lerp(1, .7, k), o: 1 - prog(k, .92, 1) * .0 });
      });
      st.vL.num.textContent = `${movedL * 10}万株`;
      // 右：1 箱が 10 往復
      const u = Math.max(0, Math.min(10, (t - t0) / (span / 10)));
      const leg = Math.min(9, Math.floor(u)), f = ease.inOut(u >= 10 ? 1 : u - Math.floor(u));
      const pos = leg % 2 === 0 ? f : 1 - f;
      const b = st.R[0];
      T(b.el, { x: lerp(-160, 470, u >= 10 ? 0 : pos) + (u >= 10 ? 470 : 0), y: -Math.sin(f * Math.PI) * 90 * (u < 10 ? 1 : 0) });
      st.vR.num.textContent = `${Math.floor(u) * 10}万株`;
    },
  });

  /* ---------- 表（例・当日出来高・翌日に残る需給）を 1 行ずつ ---------- */
  K.table3 = ({ highlight = -1, from = 0, to = 2 } = {}) => ({
    build(box) {
      const tb = P().table(box, ['例', '当日出来高\n（フロー）', '翌日に残る需給（ストック）'], [
        ['長期現物が\n100万株を吸収', '100万株', '売りに戻りにくい玉が\n増える可能性'],
        ['デイトレ10万株が\n10回転', '100万株', '回転が止まれば\n出来高だけが消える'],
        ['大株主が50万株を放出\n＋短期が回転', '100万株超', '浮動玉が増え、見た目以上に\n上値が重くなり得る'],
      ], { x: 120, y: 200, colW: [600, 300, 780], rowH: 150, font: 36, title: '同じ「100万株」でも…' });
      const n1 = note(box, '長期現物＝長く持つつもりで、お金を借りずに買った株', { left: '140px', top: '800px', fontSize: '28px', color: '#5a4630' });
      const n2 = note(box, 'フロー（その日の交換量）とストック（残った株券）を混同しない', { left: '140px', top: '842px', fontSize: '28px', color: '#5a4630' });
      const ring = highlight >= 0 ? P().circle(box, 120 + 600 + 150, 200 + 150 * .7 + highlight * 150 + 75, 150, 56) : null;
      const ex = note(box, '※架空・数字は例です', { left: '1500px', top: '842px', fontSize: '26px', color: '#7a6a55' });
      return { tb, ring, ex, n1, n2 };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const s0 = ctx.cut.start;
      if (st.tb.title) W.pop(st.tb.title, prog(t, s0, s0 + .4));
      W.fade(st.tb.head, prog(t, s0 + .1, s0 + .4));
      st.tb.rows.forEach((r, i) => {
        if (i > to) { r.style.opacity = 0; return; }
        if (i < from) { W.slide(r, 1, 0, 0); return; }
        const a = at(ctx, i - from, to - from + 1) + (ctx.cut.lines[i - from] ? .15 : 0);
        W.slide(r, prog(t, a, a + .45), -80, 0);
      });
      if (from > 0) W.pop(st.tb.title, 1);
      if (st.ring) st.ring.draw(prog(t, s0 + 1.2, s0 + 1.8));
      W.fade(st.n1, from > 0 ? 1 : prog(t, s0 + .8, s0 + 1.2));
      W.fade(st.n2, from > 0 ? 1 : prog(t, s0 + 1.2, s0 + 1.6));
      W.fade(st.ex, prog(t, s0 + .5, s0 + .9));
    },
  });

  /* ---------- 読む順番 ①〜⑥ ---------- */
  K.readOrder = ({ notes = null, unknown = [], title = '読む順番', from = 0, to = 5, subs = null } = {}) => ({
    build(box) {
      const { mk, W_ } = E();
      const steps = ['価格位置', '出来高の増減', '終値・下髭・安値更新', '玉の質', '誰の純保有が\n増減したか', '同じ値幅を作るのに\n必要な出来高'];
      const els = steps.map((s, i) => {
        const c = i % 3, r = Math.floor(i / 3);
        const x = 150 + c * 560, y = 210 + r * 330;
        const el = P().card(box, `${'①②③④⑤⑥'[i]}`, '', { x, y, w: 480, h: notes || subs ? 280 : 240 });
        const head = el.children[1];
        head.style.fontSize = '50px';
        const body = mk(el, { left: '24px', top: '110px', width: '432px', fontSize: '38px', color: '#1d2a44', lineHeight: 1.3, whiteSpace: 'pre-line' }, 'a noto', s);
        body.style.fontWeight = 900;
        if (subs && subs[i]) {
          const sb = mk(el, { left: '24px', top: `${118 + s.split('\n').length * 50}px`, width: '432px', fontSize: '27px', color: '#5a6a85', whiteSpace: 'nowrap' }, 'a noto', subs[i]);
          sb.style.fontWeight = 700;
        }
        let n = null;
        if (notes && notes[i]) {
          n = mk(el, { left: '24px', top: notes ? '200px' : '180px', width: '432px', fontSize: '28px', color: '#c0392b', whiteSpace: 'nowrap' }, 'a noto', `→ ${notes[i]}`);
          n.style.fontWeight = 900;
        }
        const arrow = i < 5 && c < 2 ? W_.arrow(box, x + 486, y + 120, x + 552, y + 120, { color: '#c0392b', width: 8, head: 16 }) : null;
        return { el, n, arrow };
      });
      const down = W_.arrow(box, 1530, 470, 290, 540, { color: '#c0392b', width: 6, head: 16, bend: -20 });
      const stamps = unknown.map(i => {
        const s = mk(box, { left: `${150 + (i % 3) * 560 + 300}px`, top: `${210 + Math.floor(i / 3) * 330 + 20}px`, padding: '6px 18px', border: '6px solid #c0392b',
          color: '#c0392b', fontSize: '44px', borderRadius: '12px', transform: 'rotate(-12deg)', background: 'rgba(255,255,255,.85)' }, 'a noto', '不明');
        s.style.fontWeight = 900;
        return s;
      });
      const lab = P().label(box, title, '', { y: 50, size: 40 });
      return { els, down, stamps, lab };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.pop(st.lab, prog(t, s0, s0 + .4));
      const cnt = to - from + 1;
      const per = Math.min(.9, (D - 1.2) / cnt);
      const when = i => (i < from ? -99 : s0 + .3 + (i - from) * per);
      st.els.forEach((e, i) => {
        if (i > to) { e.el.style.opacity = 0; if (e.arrow) e.arrow.draw(0); return; }
        const a = when(i);
        W.slide(e.el, prog(t, a, a + .4), 0, 60);
        if (e.arrow && i < to) e.arrow.draw(prog(t, when(i + 1) - .2, when(i + 1)));
        else if (e.arrow) e.arrow.draw(0);
        if (e.n) W.fade(e.n, prog(t, a + .3, a + .6));
      });
      st.down.draw(to >= 3 ? prog(t, when(3) - .3, when(3)) : 0);
      st.stamps.forEach((s, i) => W.pop(s, prog(t, s0 + .3 + 6 * per + i * .2, s0 + .6 + 6 * per + i * .2), { r: -12 }));
    },
  });

  /* ---------- 想像の空間：相場に集まる人たち ---------- */
  const KINDS = [
    ['honzon', '安値で集める中心（本尊）'],
    ['indiv', '材料で飛びつく個人'],
    ['short', '空売り'],
    ['day', '短期回転'],
    ['big', '長期の大口'],
  ];
  K.participants = ({ sub = '' } = {}) => ({
    build(box) {
      const { W_ } = E();
      const LBL = ['安値で集める\n中心（本尊）', '材料で飛びつく\n個人', '空売り', '短期回転', '長期の大口'];
      const ppl = KINDS.map(([k], i) => {
        const g = W_.person(box, 210 + i * 320, 380, k, 180, '');
        const l = E().mk(g, { left: '50%', top: '240px', transform: 'translateX(-50%)', width: '300px', textAlign: 'center', fontSize: '36px', color: '#fff', whiteSpace: 'pre-line', lineHeight: 1.3 }, 'a noto', LBL[i]);
        l.style.fontWeight = 900;
        return g;
      });
      const lab = P().label(box, '相場が育つほど、参加者が増える', '', { y: 90, size: 40 });
      const sb = sub ? note(box, sub, { left: '0', top: '760px', width: '1920px', textAlign: 'center', fontSize: '40px', color: '#ffe9a8' }) : null;
      return { ppl, lab, sb };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.pop(st.lab, prog(t, s0, s0 + .4));
      st.ppl.forEach((p, i) => W.pop(p, prog(t, s0 + .3 + i * Math.min(.5, (D - .8) / 5), s0 + .7 + i * Math.min(.5, (D - .8) / 5)), { y: Math.sin(t * 2 + i) * 6 }));
      if (st.sb) W.fade(st.sb, prog(t, s0 + D * .7, s0 + D * .7 + .4));
    },
  });

  // 提灯の行列：先頭の本尊のうしろに、提灯を持った人が並んでいく
  K.procession = ({ followers = 7, big = true, mixed = false, defs = null, title = '本尊・提灯・大提灯', boxes = false } = {}) => ({
    build(box) {
      const { W_, mk } = E();
      const head = W_.person(box, 1500, 470, 'honzon', 210, '本尊');
      const MIX = ['indiv', 'short', 'day', 'big', 'indiv', 'day', 'short', 'indiv', 'big', 'day'];
      const fl = Array.from({ length: followers }, (_, i) => {
        const x = 1330 - i * 165, isBig = big && i === 3;
        const kind = mixed ? MIX[i % MIX.length] : (isBig ? 'big' : 'indiv');
        const g = mk(box, { left: `${x}px`, top: `${isBig ? 410 : 500}px`, width: '1px', height: '1px' }, 'a');
        W_.person(g, 0, isBig ? 60 : 40, kind, isBig ? 210 : 150, mixed ? '' : (isBig ? '大提灯' : (i === 0 ? '提灯' : '')));
        if (!mixed || i % 3 === 0) W_.lantern(g, isBig ? 150 : 110, isBig ? -10 : 0, isBig ? 90 : 56, isBig);
        return { g, x };
      });
      const lab = P().label(box, title, '', { y: 90, size: 42 });
      const dl = (defs || []).map((d, i) => {
        const el = mk(box, { left: '0', top: `${170 + i * 66}px`, width: '1920px', textAlign: 'center', fontSize: '44px', color: '#ffe9a8', whiteSpace: 'nowrap' }, 'a noto', d);
        el.style.fontWeight = 900;
        return el;
      });
      const bx = boxes ? P().boxes(box, { cols: 3, rows: 1, cx: 1330, bottom: 760, bw: 80, bh: 64 }) : [];
      return { head, fl, lab, dl, bx };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.pop(st.lab, prog(t, s0, s0 + .4));
      W.pop(st.head, prog(t, s0 + .2, s0 + .6), { y: Math.sin(t * 3) * 5 });
      const per = Math.min(.55, (D - 1.0) / Math.max(1, st.fl.length));
      st.fl.forEach((f, i) => {
        const k = ease.out(prog(t, s0 + .6 + i * per, s0 + 1.3 + i * per));
        T(f.g, { x: (1 - k) * -900, y: Math.abs(Math.sin(t * 6 + i)) * -8 * (k < 1 ? 1 : .4), o: Math.min(1, k * 3) });
      });
      // 定義のラベルは、行が 2 つあれば 2 行目の頭で 2 つ目を出す
      st.dl.forEach((d, i) => { const a = i === 0 ? s0 + .8 : s0 + .6 + 3.5 * per; W.slide(d, prog(t, a, a + .4), 0, 30); });
      st.bx.forEach((b, i) => W.pop(b.el, prog(t, s0 + .5 + i * .1, s0 + .8 + i * .1)));
    },
  });

  // 「本尊が全部買い上げる」と考えると、資金が足りない
  K.allBuy = () => ({
    build(box) {
      const { mk, W_ } = E();
      const hz = W_.person(box, 180, 420, 'honzon', 220, '本尊');
      const wallet = mk(box, { left: '440px', top: '430px', width: '120px', height: '320px', borderRadius: '18px', border: '6px solid #f2b632', background: 'rgba(255,255,255,.08)' }, 'a');
      const fill = mk(wallet, { left: 0, bottom: 0, width: '100%', height: '100%', background: 'linear-gradient(#ffd24a, #f2a900)', borderRadius: '10px' }, 'a');
      const wl = note(box, '資金', { left: '455px', top: '770px', color: '#ffd24a', fontSize: '34px' });
      const bx = P().boxes(box, { cols: 8, rows: 5, cx: 1180, bottom: 850, bw: 96, bh: 72, gap: 4 });
      const lab = P().label(box, '「本尊が全部買い上げる」と考えると…', '', { y: 90, size: 40 });
      const ng = mk(box, { left: '330px', top: '250px', padding: '8px 26px', background: '#e0312f', color: '#fff', borderRadius: '14px', fontSize: '44px', whiteSpace: 'nowrap' }, 'a noto', '資金計算が合わない');
      ng.style.fontWeight = 900;
      return { hz, wallet, fill, wl, bx, lab, ng };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, clamp } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.pop(st.lab, prog(t, s0, s0 + .4));
      W.pop(st.hz, prog(t, s0 + .1, s0 + .5));
      W.fade(st.wallet, prog(t, s0 + .2, s0 + .5)); W.fade(st.wl, prog(t, s0 + .2, s0 + .5));
      const grow = prog(t, s0 + .5, s0 + Math.max(1.5, D * .7));
      const n = Math.floor(grow * st.bx.length);
      st.bx.forEach((b, i) => { const k = clamp((grow * st.bx.length - i) * 1.5); T(b.el, { y: (1 - ease.out(k)) * -200, o: k }); });
      st.fill.style.height = `${Math.max(0, 100 - grow * 160)}%`;
      W.pop(st.ng, prog(t, s0 + D * .7, s0 + D * .7 + .4), { r: -4 });
    },
  });

  /* ---------- 4 段階（想像の空間）。stage: 0 初期 / 1 中盤 / 2 人気化後 / 3 終盤 ---------- */
  const STAGE_NAMES = ['初期', '中盤', '人気化後', '終盤'];
  const STAGE_TEXT = [
    '中心保有者は安値で時間を使い、浮動玉を固定する',
    '価格を動かして、眠った売り物と新しい資金を市場へ出す',
    '主役は個人・空売り・大口。本尊は必要な時だけ援護する脇役へ',
    '中心保有者が売り始めた時、誰がその玉を固定するか',
  ];
  K.stage = (stage, { aside = true } = {}) => ({
    build(box) {
      const { mk, W_ } = E();
      const st = { stage, aside };
      // 段階の目印（4 つの丸）
      st.dots = STAGE_NAMES.map((n, i) => {
        const d = mk(box, { left: `${560 + i * 220}px`, top: '40px', width: '200px', height: '64px', borderRadius: '32px', textAlign: 'center', lineHeight: '64px', fontSize: '32px',
          background: i === stage ? '#ffd24a' : 'rgba(255,255,255,.12)', color: i === stage ? '#26365e' : 'rgba(255,255,255,.6)' }, 'a noto', n);
        d.style.fontWeight = 900;
        return d;
      });
      const txt = stage === 2 ? (aside ? '本尊は、必要な局面だけ援護する脇役へ（移り得る）' : '主役は、個人・空売り・大口の売買') : STAGE_TEXT[stage];
      st.text = mk(box, { left: '0', top: '130px', width: '1920px', textAlign: 'center', fontSize: '42px', color: '#fff', whiteSpace: 'nowrap' }, 'a noto', txt);
      st.text.style.fontWeight = 900;
      // 値動きの線（段階ごとに伸びる）
      const P0 = [[160, 520], [520, 530], [760, 515]], P1 = [[760, 515], [980, 440], [1140, 380]], P2 = [[1140, 380], [1300, 300], [1450, 330], [1600, 260]], P3 = [[1600, 260], [1700, 300], [1780, 360]];
      const all = [P0, P1, P2, P3];
      const pts = all.slice(0, stage + 1).flat();
      st.line = W_.line(box, pts, { color: '#ff7a7a', width: 7, glow: true });
      st.prevLen = all.slice(0, stage).flat().length ? (() => { const L0 = W_.line(document.createElement('div'), all.slice(0, stage).flat()); return L0.len; })() : 0;
      if (stage === 0) {
        st.hz = W_.person(box, 300, 600, 'honzon', 180, '中心保有者（本尊）');
        st.vault = mk(box, { left: '560px', top: '640px', width: '260px', height: '210px', background: 'linear-gradient(#8e98ab, #6b7488)', borderRadius: '18px', border: '6px solid #4d5568' }, 'a');
        mk(st.vault, { left: 0, top: '130px', width: '100%', textAlign: 'center', fontSize: '26px', color: '#fff' }, 'a noto', '固定').style.fontWeight = 900;
        st.bx = P().boxes(box, { cols: 6, rows: 1, cx: 1350, bottom: 850, bw: 92, bh: 74, color: '#ffd24a' });
        st.bxl = note(box, '浮動玉', { left: '1290px', top: '700px', color: '#ffd24a', fontSize: '36px' });
        st.clock = mk(box, { left: '880px', top: '600px', fontSize: '90px' }, 'a', '⏳');
      }
      if (stage === 1) {
        st.hz = W_.person(box, 200, 620, 'honzon', 150, '本尊');
        st.market = mk(box, { left: '820px', top: '600px', width: '340px', height: '250px', background: '#26365e', borderRadius: '20px 20px 0 0', border: '3px solid rgba(255,255,255,.3)' }, 'a');
        mk(st.market, { left: 0, top: '20px', width: '100%', textAlign: 'center', fontSize: '40px', color: '#fff' }, 'a noto', '市場').style.fontWeight = 900;
        st.sleep = P().boxes(box, { cols: 3, rows: 2, cx: 520, bottom: 850, bw: 84, bh: 68, color: '#9aa0aa', label: '眠' });
        st.sleepL = note(box, '眠った売り物', { left: '400px', top: '700px', color: '#cfd6e6', fontSize: '30px' });
        st.newp = [0, 1, 2].map(i => W_.person(box, 1350 + i * 170, 640, ['indiv', 'big', 'indiv'][i], 130, i === 1 ? '新しい資金' : ''));
      }
      if (stage === 2) {
        st.hz = W_.person(box, 120, 700, 'honzon', 110, '本尊（脇役）');
        const kinds = ['indiv', 'short', 'big', 'day', 'indiv', 'short', 'indiv', 'big', 'day', 'indiv'];
        st.crowd = kinds.map((k, i) => W_.person(box, 420 + (i % 5) * 270, i < 5 ? 520 : 700, k, 140));
        st.legend = ['個人', '空売り', '大口', '短期回転'].map((n, i) => {
          const el = E().mk(box, { left: `${560 + i * 260}px`, top: '880px', fontSize: '28px', color: '#fff', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '10px' }, 'a noto',
            `<span style="display:inline-block;width:26px;height:26px;border-radius:50%;background:${['#4aa3df', '#8e44ad', '#16a085', '#f39c12'][i]}"></span>${n}`);
          el.style.fontWeight = 900;
          return el;
        });
        st.chips = Array.from({ length: 8 }, (_, i) => W_.chip(box, 560 + (i % 4) * 270, i < 4 ? 600 : 780));
      }
      if (stage === 3) {
        st.hz = W_.person(box, 260, 560, 'honzon', 200, '本尊');
        st.bx = P().boxes(box, { cols: 3, rows: 2, cx: 400, bottom: 850, bw: 84, bh: 68 });
        st.recv = [0, 1, 2].map(i => W_.person(box, 1150 + i * 230, 600, ['long', 'day', 'indiv'][i], 150, ['長期の現物', '短期', '個人'][i]));
        st.q = mk(box, { left: '930px', top: '420px', fontSize: '150px', color: '#ffd24a' }, 'a dela', '？');
        st.vault = mk(box, { left: '1120px', top: '420px', fontSize: '40px', color: '#ffd24a', whiteSpace: 'nowrap' }, 'a noto', '誰が受け取って、持ち続ける？');
        st.vault.style.fontWeight = 900;
      }
      return st;
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, lerp, clamp } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      st.dots.forEach((d, i) => W.pop(d, prog(t, s0 + i * .06, s0 + .3 + i * .06), { s: i === st.stage ? 1.08 : 1 }));
      W.fade(st.text, prog(t, s0 + .3, s0 + .7));
      const lk = ease.out(prog(t, s0 + .2, s0 + 1.4));
      st.line.draw(lerp(st.prevLen / st.line.len, 1, lk));
      if (st.stage === 0) {
        W.pop(st.hz, prog(t, s0 + .2, s0 + .6));
        W.fade(st.vault, prog(t, s0 + .3, s0 + .6));
        W.fade(st.bxl, prog(t, s0 + .4, s0 + .7) * (1 - prog(t, s0 + D * .5, s0 + D * .6)));
        W.pop(st.clock, prog(t, s0 + .6, s0 + 1.0), { r: (t * 40) % 360 * 0 + Math.sin(t * 2) * 10 });
        st.bx.forEach((b, i) => {
          const k = ease.inOut(prog(t, s0 + .9 + i * (D - 1.4) / 6, s0 + 1.4 + i * (D - 1.4) / 6));
          T(b.el, { x: lerp(0, 600 + (i % 3) * 60 - b.x, k), y: lerp(0, 700 + Math.floor(i / 3) * 40 - b.y, k) - Math.sin(k * Math.PI) * 90, s: lerp(1, .55, k) });
        });
      }
      if (st.stage === 1) {
        W.pop(st.hz, prog(t, s0 + .2, s0 + .6));
        W.slide(st.market, prog(t, s0 + .3, s0 + .7), 0, 60);
        W.fade(st.sleepL, prog(t, s0 + .4, s0 + .8));
        st.sleep.forEach((b, i) => {
          const k = ease.inOut(prog(t, s0 + 1.0 + i * .25, s0 + 1.6 + i * .25));
          b.el.style.background = k > .5 ? '#d8a46a' : '#9aa0aa';
          T(b.el, { x: lerp(0, 860 + (i % 3) * 80 - b.x, k), y: lerp(0, 700 + Math.floor(i / 3) * 60 - b.y, k) - Math.sin(k * Math.PI) * 100, s: lerp(1, .8, k) });
        });
        st.newp.forEach((p, i) => W.slide(p, prog(t, s0 + 1.4 + i * .3, s0 + 1.9 + i * .3), 300, 0));
      }
      if (st.stage === 2) {
        const shrink = st.aside ? ease.inOut(prog(t, s0 + .8, s0 + 1.8)) : 0;
        // 脇役版：ときどき横から箱を 1 つ押し出して支える
        const help = st.aside ? Math.max(0, Math.sin((t - s0) * 2.2)) : 0;
        W.pop(st.hz, prog(t, s0 + .1, s0 + .5), { x: st.aside ? 0 : 500, y: st.aside ? -help * 12 : -120, s: st.aside ? lerp(1.4, 1, shrink) : 1.3, o: st.aside ? lerp(1, .75, shrink) : 1 });
        st.hz.lastChild && (st.hz.lastChild.textContent = st.aside ? '本尊（脇役へ移り得る）' : '本尊');
        st.crowd.forEach((p, i) => W.pop(p, prog(t, s0 + .3 + i * .1, s0 + .7 + i * .1), { y: Math.sin(t * 4 + i) * 6 }));
        st.legend.forEach((l, i) => W.fade(l, prog(t, s0 + 1.2 + i * .1, s0 + 1.5 + i * .1)));
        st.chips.forEach((c, i) => {
          const ph = (t * .9 + i * .37) % 1;
          T(c, { x: Math.sin(ph * Math.PI * 2) * 120, y: -Math.abs(Math.sin(ph * Math.PI * 2)) * 60, o: prog(t, s0 + 1.0, s0 + 1.3) });
        });
      }
      if (st.stage === 3) {
        W.pop(st.hz, prog(t, s0 + .2, s0 + .6));
        st.recv.forEach((p, i) => W.slide(p, prog(t, s0 + .4 + i * .15, s0 + .8 + i * .15), 120, 0));
        st.bx.forEach((b, i) => {
          const k = ease.inOut(prog(t, s0 + 1.0 + i * .25, s0 + 1.7 + i * .25));
          const tx = 1183 + (i % 3) * 230 - b.x - 8 + Math.floor(i / 3) * 16;
          T(b.el, { x: lerp(0, tx, k), y: lerp(0, 690 - Math.floor(i / 3) * 20 - b.y, k) - Math.sin(k * Math.PI) * 180, s: lerp(1, .8, k) });
        });
        W.pop(st.q, prog(t, s0 + 1.6, s0 + 2.0), { r: Math.sin(t * 3) * 8 });
        W.fade(st.vault, prog(t, s0 + 1.8, s0 + 2.2));
      }
    },
  });

  /* ---------- 売買差額と純保有の方向 ---------- */
  K.netHold = () => ({
    build(box) {
      const { mk } = E();
      const mkCase = (x, title, buy, sell, verdict) => {
        const card = mk(box, { left: `${x}px`, top: '200px', width: '760px', height: '660px', background: '#fff', borderRadius: '26px', boxShadow: '0 16px 30px rgba(40,30,20,.2)' }, 'a');
        const t = mk(card, { left: '30px', top: '24px', width: '700px', fontSize: '40px', color: '#26365e', whiteSpace: 'nowrap' }, 'a noto', title);
        t.style.fontWeight = 900;
        const base = 520, scale = 6;
        const bar = (bx, v, color, label) => {
          const b = mk(card, { left: `${bx}px`, top: `${base - v * scale}px`, width: '150px', height: `${v * scale}px`, background: color, borderRadius: '10px 10px 0 0', transformOrigin: '50% 100%' }, 'a');
          const l = mk(card, { left: `${bx - 30}px`, top: `${base + 10}px`, width: '210px', textAlign: 'center', fontSize: '30px', color: '#333' }, 'a noto', label);
          const n = mk(card, { left: `${bx - 30}px`, top: `${base - v * scale - 50}px`, width: '210px', textAlign: 'center', fontSize: '34px', color }, 'a noto', `${v}万株`);
          [l, n].forEach(e => { e.style.fontWeight = 900; });
          return { b, l, n };
        };
        const B = bar(100, buy, '#e0453a', '買った');
        const S = bar(320, sell, '#2f7ad6', '売った');
        const net = buy - sell;
        const v = mk(card, { left: '520px', top: '250px', width: '220px', textAlign: 'center' }, 'a');
        v.innerHTML = `<div class="noto" style="font-size:28px;font-weight:900;color:#555">純保有</div><div class="noto" style="font-size:62px;font-weight:900;color:${net >= 0 ? '#e0453a' : '#2f7ad6'}">${net >= 0 ? '+' : '−'}${Math.abs(net)}</div><div class="noto" style="font-size:24px;font-weight:900;color:#555">万株（例）</div><div style="font-size:70px;line-height:1">${net >= 0 ? '⬆' : '⬇'}</div>`;
        const vd = mk(card, { left: '30px', top: '596px', width: '700px', fontSize: '32px', color: '#c0392b', whiteSpace: 'nowrap' }, 'a noto', verdict);
        vd.style.fontWeight = 900;
        return { card, B, S, v, vd };
      };
      const A = mkCase(160, '「本尊が売った」けれど…', 50, 20, '→ 売っても、純保有は増えている');
      const Bc = mkCase(1000, '「本尊が少し買った」けれど…', 10, 60, '→ 買っても、純保有は減っている');
      const lab = P().label(box, '売買差額と、純保有の方向を見る', '', { y: 50, size: 40 });
      return { A, Bc, lab };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.pop(st.lab, prog(t, s0, s0 + .4));
      [st.A, st.Bc].forEach((c, i) => {
        const a = at(ctx, i, 2) - (i === 0 ? .2 : 0);
        W.slide(c.card, prog(t, a, a + .4), i ? 80 : -80, 0);
        [c.S, c.B].forEach((x, j) => { const k = ease.out(prog(t, a + .4 + j * .3, a + .9 + j * .3)); T(x.b, { sy: k, sx: 1 }); W.fade(x.n, k); W.fade(x.l, prog(t, a + .3, a + .5)); });
        W.pop(c.v, prog(t, a + 1.1, a + 1.5));
        W.fade(c.vd, prog(t, a + 1.4, a + 1.8));
      });
    },
  });


  /* ---------- 思い込みに × ：左右 2 枚のカードに赤い × ---------- */
  K.mythX = (a, b, { sub = '' } = {}) => ({
    build(box) {
      const { mk, W_ } = E();
      const cards = [a, b].map((txt, i) => {
        const c = mk(box, { left: `${170 + i * 840}px`, top: '230px', width: '740px', height: '460px', background: '#fff', borderRadius: '26px',
          boxShadow: '0 16px 30px rgba(40,30,20,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          fontSize: '62px', color: '#26365e', whiteSpace: 'pre-line', lineHeight: 1.35, padding: '30px' }, 'a noto', txt);
        c.style.fontWeight = 900;
        return c;
      });
      const xs = [0, 1].map(i => { const x = W_.stamp(box, 380 + i * 840, 300, 'x', 320); x.querySelector('path').setAttribute('stroke', '#e0312f'); return x; });
      const s2 = sub ? note(box, sub, { left: '0', top: '760px', width: '1920px', textAlign: 'center', fontSize: '34px', color: '#7a6a55' }) : null;
      return { cards, xs, s2 };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      st.cards.forEach((c, i) => W.slide(c, prog(t, s0 + i * .25, s0 + .45 + i * .25), i ? 80 : -80, 0));
      st.xs.forEach((x, i) => W.pop(x, prog(t, s0 + D * .45 + i * .35, s0 + D * .45 + .3 + i * .35), { r: -8 }));
      if (st.s2) W.fade(st.s2, prog(t, s0 + .6, s0 + 1.0));
    },
  });

  /* ---------- 100 万株が一方向に固定…ではない（金庫へ全部移る絵に ×） ---------- */
  K.oneWayX = ({ question = false } = {}) => ({
    build(box) {
      const { mk, W_ } = E();
      const sellers = P().boxes(box, { cols: 10, rows: 5, cx: 560, bottom: 850, bw: 60, bh: 46, gap: 3, label: '' });
      const vault = mk(box, { left: '1220px', top: '420px', width: '520px', height: '430px', background: 'linear-gradient(#8e98ab, #6b7488)', borderRadius: '26px', border: '9px solid #4d5568' }, 'a');
      mk(vault, { left: '190px', top: '120px', width: '130px', height: '130px', borderRadius: '50%', border: '14px solid #3d4455', background: '#c7ccd8' }, 'a');
      mk(vault, { left: 0, top: '300px', width: '100%', textAlign: 'center', fontSize: '36px', color: '#fff' }, 'a noto', '新しい持ち主').style.fontWeight = 900;
      const ar = W_.arrow(box, 900, 560, 1200, 560, { color: '#26365e', width: 14 });
      const lab = P().label(box, '100万株が、一方向に新しい持ち主へ固定？', '', { y: 70, size: 40 });
      const x = W_.stamp(box, 760, 250, 'x', 420); x.querySelector('path').setAttribute('stroke', '#e0312f');
      const no = note(box, 'そういう意味ではない', { left: '0', top: '200px', width: '1920px', textAlign: 'center', fontSize: '56px', color: '#e0312f' });
      const q = mk(box, { left: '880px', top: '240px', fontSize: '220px', color: '#e0312f', textShadow: '0 6px 0 rgba(0,0,0,.15)' }, 'a dela', '？');
      if (question) { x.style.display = 'none'; no.style.display = 'none'; } else q.style.display = 'none';
      return { sellers, vault, ar, lab, x, no, q };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, lerp } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.pop(st.lab, prog(t, s0, s0 + .4));
      W.slide(st.vault, prog(t, s0 + .1, s0 + .5), 100, 0);
      st.ar.draw(prog(t, s0 + .4, s0 + .8));
      const span = D * .5;
      st.sellers.forEach((b, i) => {
        const k = ease.inOut(prog(t, s0 + .6 + (i / st.sellers.length) * span, s0 + .9 + (i / st.sellers.length) * span));
        T(b.el, { x: lerp(0, 1300 + (i % 6) * 60 - b.x, k), y: lerp(0, 560 + Math.floor((i % 30) / 6) * 50 - b.y, k) - Math.sin(k * Math.PI) * 100, s: lerp(1, .8, k), o: 1 - prog(k, .95, 1) * .6 });
      });
      W.pop(st.x, prog(t, s0 + D * .72, s0 + D * .72 + .3), { r: -6 });
      W.pop(st.no, prog(t, s0 + D * .78, s0 + D * .78 + .3));
      W.pop(st.q, prog(t, s0 + D * .7, s0 + D * .7 + .3), { r: Math.sin(t * 3) * 8 });
    },
  });

  /* ---------- フローとストック（今日の出来高 と 翌日に残る売り物） ---------- */
  K.flowStock = ({ leftTitle = 'フロー＝その日の交換量', rightTitle = 'ストック＝翌日に残る売り物' } = {}) => ({
    build(box) {
      const { mk } = E();
      const L = mk(box, { left: '170px', top: '180px', width: '740px', height: '650px', background: '#fff', borderRadius: '26px', boxShadow: '0 16px 30px rgba(40,30,20,.2)' }, 'a');
      const R = mk(box, { left: '1010px', top: '180px', width: '740px', height: '650px', background: '#fff', borderRadius: '26px', boxShadow: '0 16px 30px rgba(40,30,20,.2)' }, 'a');
      [[L, leftTitle, '#26365e'], [R, rightTitle, '#c0392b']].forEach(([c, tt, col]) => {
        mk(c, { left: 0, top: 0, width: '100%', height: '100px', background: col, borderRadius: '26px 26px 0 0' }, 'a');
        mk(c, { left: 0, top: '22px', width: '100%', textAlign: 'center', fontSize: '42px', color: '#fff', whiteSpace: 'nowrap' }, 'a noto', tt).style.fontWeight = 900;
      });
      const bar = mk(L, { left: '250px', top: '170px', width: '240px', height: '400px', background: 'linear-gradient(#5d8bd6, #26365e)', borderRadius: '14px 14px 0 0', transformOrigin: '50% 100%' }, 'a');
      const num = mk(L, { left: 0, top: '580px', width: '100%', textAlign: 'center', fontSize: '48px', color: '#26365e' }, 'a noto', '出来高 100万株（例）');
      num.style.fontWeight = 900;
      const crate = mk(R, { left: '170px', top: '200px', width: '400px', height: '320px', background: '#d8a46a', border: '8px solid #a87a48', borderRadius: '12px' }, 'a');
      const q = mk(R, { left: '0', top: '230px', width: '100%', textAlign: 'center', fontSize: '200px', color: '#fff', textShadow: '0 6px 0 rgba(0,0,0,.2)' }, 'a dela', '？');
      const rn = mk(R, { left: 0, top: '560px', width: '100%', textAlign: 'center', fontSize: '40px', color: '#c0392b' }, 'a noto', '出来高だけでは決められない');
      rn.style.fontWeight = 900;
      return { L, R, bar, num, crate, q, rn };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.slide(st.L, prog(t, s0, s0 + .45), -80, 0);
      W.slide(st.R, prog(t, s0 + .2, s0 + .65), 80, 0);
      T(st.bar, { sy: ease.out(prog(t, s0 + .5, s0 + 1.3)), sx: 1 });
      W.fade(st.num, prog(t, s0 + 1.0, s0 + 1.3));
      W.fade(st.crate, prog(t, s0 + .7, s0 + 1.0));
      W.pop(st.q, prog(t, s0 + D * .45, s0 + D * .45 + .35), { r: Math.sin(t * 3) * 6 });
      W.fade(st.rn, prog(t, s0 + D * .55, s0 + D * .55 + .4));
    },
  });

  /* ---------- 大株主が 50 万株を放出：金庫から出口の前へ、浮動玉に変わる。上値が重い ---------- */
  K.bigRelease = () => ({
    build(box) {
      const { mk, W_ } = E();
      const vault = mk(box, { left: '120px', top: '440px', width: '360px', height: '410px', background: 'linear-gradient(#8e98ab, #6b7488)', borderRadius: '22px', border: '8px solid #4d5568' }, 'a');
      mk(vault, { left: 0, top: '20px', width: '100%', textAlign: 'center', fontSize: '38px', color: '#fff' }, 'a noto', '大株主').style.fontWeight = 900;
      const bx = P().boxes(box, { cols: 5, rows: 2, cx: 300, bottom: 830, bw: 56, bh: 46, gap: 4, label: '5万', color: '#9fc1ff' });
      const exit = mk(box, { left: '1716px', top: '470px', width: '180px', height: '380px', background: '#3e5a7d', borderRadius: '14px 14px 0 0', border: '8px solid #2b3f59' }, 'a');
      mk(exit, { left: 0, top: '20px', width: '100%', textAlign: 'center', fontSize: '34px', color: '#fff', lineHeight: 1.2 }, 'a noto', '出口<br><span style="font-size:22px">（売りに戻る）</span>').style.fontWeight = 900;
      // 値段のはしご：上の段ほど売り物が並ぶ
      const ladder = mk(box, { left: '620px', top: '180px', width: '820px', height: '660px' }, 'a');
      mk(ladder, { left: '40px', top: 0, width: '740px', height: '660px', background: 'rgba(138,106,72,.12)', borderRadius: '12px', border: '6px solid #8a6a48' }, 'a');
      const rungs = [0, 1, 2, 3, 4].map(i => {
        const y = 80 + i * 130;
        mk(ladder, { left: '60px', top: `${y}px`, width: '700px', height: '14px', background: '#8a6a48', borderRadius: '7px' }, 'a');
        const price = mk(ladder, { left: '-140px', top: `${y - 22}px`, fontSize: '32px', color: '#5a4630', whiteSpace: 'nowrap' }, 'a noto', `${560 - i * 20}円`);
        price.style.fontWeight = 900;
        const sells = Array.from({ length: 5 - i }, (_, j) => mk(ladder, { left: `${120 + j * 120}px`, top: `${y - 58}px`, width: '100px', height: '56px', background: '#ffd24a', border: '3px solid #a87a48', borderRadius: '6px',
          fontSize: '20px', textAlign: 'center', lineHeight: '52px', color: '#7a5a20' }, 'a noto', '売り'));
        return { price, sells };
      });
      const heavy = note(box, '浮動玉が増え、見た目以上に上値が重くなり得る', { left: '0', top: '60px', width: '1920px', textAlign: 'center', fontSize: '40px', color: '#c0392b' });
      const ue = note(box, '上値＝これより上の値段／上値が重い＝上がりにくい', { left: '620px', top: '120px', fontSize: '30px', color: '#7a6a55' });
      const shelfL = note(box, '値段の棚', { left: '980px', top: '860px', fontSize: '28px', color: '#7a6a55' });
      const fl = note(box, '浮動玉（1箱＝5万株・例）', { left: '1400px', top: '696px', fontSize: '24px', color: '#c0392b' });
      const now = note(box, '← いまの値段', { left: '1408px', top: '630px', fontSize: '28px', color: '#c0392b' });
      return { vault, bx, exit, ladder, rungs, heavy, ue, shelfL, fl, now };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, lerp } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.slide(st.vault, prog(t, s0, s0 + .4), -80, 0);
      W.slide(st.exit, prog(t, s0 + .1, s0 + .5), 80, 0);
      W.fade(st.ladder, prog(t, s0 + .2, s0 + .6));
      st.bx.forEach((b, i) => {
        const k = ease.inOut(prog(t, s0 + .7 + i * .12, s0 + 1.3 + i * .12));
        b.el.style.background = k > .6 ? '#ffd24a' : '#9fc1ff';
        T(b.el, { x: lerp(0, 1414 + (i % 5) * 58 - b.x, k), y: lerp(0, 784 - Math.floor(i / 5) * 50 - b.y, k) - Math.sin(k * Math.PI) * 140 });
      });
      st.rungs.forEach((r, i) => r.sells.forEach((sb, j) => W.pop(sb, prog(t, s0 + 1.6 + (4 - i) * .15 + j * .05, s0 + 1.9 + (4 - i) * .15 + j * .05))));
      const sag = ease.out(prog(t, s0 + 2.4, s0 + 3.0));
      T(st.ladder, { y: sag * 14, r: sag * .6, o: prog(t, s0 + .2, s0 + .6) });
      W.fade(st.heavy, prog(t, s0 + 2.4, s0 + 2.8));
      W.fade(st.ue, prog(t, s0 + 1.4, s0 + 1.8));
      W.fade(st.shelfL, prog(t, s0 + .4, s0 + .8));
      W.pop(st.fl, prog(t, s0 + 2.2, s0 + 2.5));
      W.fade(st.now, prog(t, s0 + .8, s0 + 1.2));
    },
  });

  /* ---------- 下髭（手書きのローソク足） ---------- */
  K.shitahige = () => ({
    build(box) {
      const { mk, W_ } = E();
      const paper = P().paper(box, { x: 460, y: 90, w: 1000, h: 800, rot: 1 });
      const wick = W_.line(paper, [[420, 120], [420, 640]], { color: '#2b2b38', width: 10 });
      const body = mk(paper, { left: '340px', top: '200px', width: '160px', height: '250px', background: '#e0453a', border: '6px solid #2b2b38', borderRadius: '6px' }, 'a');
      const ar = W_.arrow(paper, 700, 600, 450, 560, { color: '#e0312f', width: 8 });
      const lb = W_.write(paper, '下髭', { left: '720px', top: '560px', fontSize: '70px', color: '#e0312f' });
      const lb2 = W_.write(paper, 'ローソク足の下に伸びた線', { left: '500px', top: '660px', fontSize: '34px', color: '#2b2b38' });
      const lb3 = W_.write(paper, '終値＝その日の最後の値段', { left: '540px', top: '200px', fontSize: '34px', color: '#2b2b38' });
      return { paper, wick, body, ar, lb, lb2, lb3 };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const s0 = ctx.cut.start;
      W.slide(st.paper, prog(t, s0 - .1, s0 + .4), 0, 60, { r: 1 });
      st.wick.draw(prog(t, s0 + .3, s0 + .8));
      W.fade(st.body, prog(t, s0 + .5, s0 + .8));
      st.ar.draw(prog(t, s0 + .9, s0 + 1.3));
      st.lb.show(prog(t, s0 + 1.1, s0 + 1.4));
      st.lb2.show(prog(t, s0 + 1.3, s0 + 1.9));
      st.lb3.show(prog(t, s0 + 1.8, s0 + 2.4));
    },
  });

  /* ---------- 売買差額と純保有（ノート：式と積み上がり） ---------- */
  K.netFormula = ({ numbers = true, head = '', formula = '買った株数 − 売った株数 ＝ 売買差額', sum = '積み上がり ＝ 純保有', ask = '' } = {}) => ({
    build(box) {
      const { mk } = E();
      const W_ = E().W_;
      const paper = P().paper(box, { x: 300, y: 70, w: 1320, h: 860, rot: -1 });
      const hd = head ? W_.write(paper, head, { left: '70px', top: '30px', fontSize: '44px', color: '#c0392b' }) : null;
      const f1 = W_.write(paper, formula, { left: '70px', top: head ? '110px' : '60px', fontSize: '50px', color: '#2b2b38' });
      const days = [['1日目', 3], ['2日目', -1], ['3日目', 2], ['4日目', 1]];
      let acc = 0;
      const cols = days.map(([d, v], i) => {
        const x = 140 + i * 250;
        const sign = numbers ? `${v >= 0 ? '+' : '−'}${Math.abs(v)}` : (v >= 0 ? '買い＞売り' : '買い＜売り');
        const lb = mk(paper, { left: `${x - 20}px`, top: '700px', width: '240px', textAlign: 'center', fontSize: '32px', color: '#2b2b38' }, 'a zen', `${d}<br><span style="color:${v >= 0 ? '#e0312f' : '#2f7ad6'}">${sign}</span>`);
        const prev = acc;
        acc += v;
        const blocks = Array.from({ length: Math.max(0, acc) }, (_, j) => mk(paper, { left: `${x + 40}px`, top: `${620 - (j + 1) * 66}px`, width: '120px', height: '60px', background: '#ffd24a',
          border: '3px solid #a87a48', borderRadius: '6px' }, 'a'));
        const ghosts = v < 0 ? Array.from({ length: -v }, (_, j) => mk(paper, { left: `${x + 40}px`, top: `${620 - (acc + j + 1) * 66}px`, width: '120px', height: '60px',
          border: '4px dashed #2f7ad6', borderRadius: '6px' }, 'a')) : [];
        const minus = v < 0 ? mk(paper, { left: `${x + 170}px`, top: `${620 - (prev) * 66 - 6}px`, fontSize: '40px', color: '#2f7ad6' }, 'a zen', '↓') : null;
        return { lb, blocks, ghosts, minus };
      });
      const f2 = W_.write(paper, sum, { left: '70px', top: head ? '185px' : '140px', fontSize: '48px', color: '#e0312f' });
      const ex = mk(paper, { left: '1000px', top: '790px', fontSize: '24px', color: '#777' }, 'a zen', numbers ? '※数字は例（万株）' : '※イメージ');
      const ak = ask ? W_.write(paper, ask, { left: '1065px', top: '420px', fontSize: '40px', color: '#2b2b38', whiteSpace: 'pre' }) : null;
      const ring = ask ? P().circle(paper, 1180, 468, 150, 92) : null;
      return { paper, hd, f1, cols, f2, ex, ak, ring };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.slide(st.paper, prog(t, s0 - .1, s0 + .4), 0, 60, { r: -1 });
      st.f1.show(prog(t, s0 + .2, s0 + 1.2));
      st.cols.forEach((c, i) => {
        const a = s0 + 1.2 + i * Math.min(.6, (D - 2.2) / 4);
        W.fade(c.lb, prog(t, a, a + .3));
        c.blocks.forEach((b, j) => W.pop(b, prog(t, a + .1 + j * .06, a + .35 + j * .06)));
        c.ghosts.forEach(g => W.fade(g, prog(t, a + .3, a + .6)));
        if (c.minus) W.pop(c.minus, prog(t, a + .4, a + .7));
      });
      st.f2.show(prog(t, s0 + D * .6, s0 + D * .6 + .6));
      W.fade(st.ex, prog(t, s0 + 1.2, s0 + 1.5));
      if (st.hd) st.hd.show(prog(t, s0 + .1, s0 + .6));
      if (st.ak) { st.ak.show(prog(t, s0 + D * .75, s0 + D * .75 + .5)); st.ring.draw(prog(t, s0 + D * .82, s0 + D * .82 + .5)); }
    },
  });

  /* ---------- ミナのノート：ミライ製菓を ①〜⑥ で、事実・推測・不明に分ける ---------- */
  K.miraiNote = (rows, { instant = false, praise = false } = {}) => ({
    build(box) {
      const { mk } = E();
      const W_ = E().W_;
      const paper = P().paper(box, { x: 220, y: 60, w: 1480, h: 880, rot: -.8, lines: false });
      const head = W_.write(paper, 'ミライ製菓（※架空）を分けてみる', { left: '60px', top: '36px', fontSize: '48px', color: '#2b2b38' });
      const COL = { '事実': '#2f7ad6', '推測': '#e0a400', '不明': '#e0312f', 'これから': '#16a085', '未確認': '#7f8c8d' };
      const gap = rows.length > 6 ? 100 : 118;
      const els = rows.map((r, i) => {
        const y = 130 + i * gap;
        const num = mk(paper, { left: '60px', top: `${y}px`, fontSize: '46px', color: '#2b2b38' }, 'a zen', r.n >= 0 ? '①②③④⑤⑥'[r.n] : '・');
        const txt = W_.write(paper, r.text, { left: '130px', top: `${y + 6}px`, fontSize: rows.length > 6 ? '37px' : '42px', color: '#2b2b38' });
        const tag = mk(paper, { left: '1200px', top: `${y}px`, width: '200px', height: '72px', borderRadius: '14px', background: COL[r.tag] || '#888', color: '#fff', fontSize: '36px',
          textAlign: 'center', lineHeight: '72px' }, 'a noto', r.tag);
        tag.style.fontWeight = 900;
        const ring = r.ring ? P().circle(paper, 1300, y + 36, 135, 54) : null;
        return { num, txt, tag, ring, line: r.line ?? 0 };
      });
      const burger = mk(paper, { left: '1300px', top: '800px', fontSize: '56px' }, 'a', '🍔');
      let pr = null;
      if (praise) {
        pr = mk(paper, { left: '980px', top: '14px', display: 'flex', alignItems: 'center', gap: '14px' }, 'a');
        pr.innerHTML = `<svg viewBox="0 0 120 120" width="90" height="90">${Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2; return `<circle cx="${60 + Math.cos(a) * 34}" cy="${60 + Math.sin(a) * 34}" r="22" fill="none" stroke="#e0312f" stroke-width="5"/>`; }).join('')}<circle cx="60" cy="60" r="26" fill="none" stroke="#e0312f" stroke-width="6"/></svg>
          <span class="zen" style="font-size:40px;font-weight:700;color:#2f5ea8">よくできました</span>`;
      }
      return { paper, head, els, burger, pr };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const s0 = ctx.cut.start;
      W.slide(st.paper, prog(t, s0 - .1, s0 + .4), 0, 60, { r: -.8 });
      st.head.show(prog(t, s0 + .2, s0 + .9));
      // 行ごとに、そのセリフの頭から書き始める（同じセリフの中では少しずつずらす）
      const seen = {};
      if (instant) {
        st.head.show(1);
        st.els.forEach(e => { W.fade(e.num, 1); e.txt.show(1); W.fade(e.tag, 1); if (e.ring) e.ring.draw(prog(t, s0 + .5, s0 + 1.1)); });
        if (st.pr) W.pop(st.pr, prog(t, s0 + 1.2, s0 + 1.6), { r: -6 });
        W.pop(st.burger, 1, { r: 12 });
        return;
      }
      st.els.forEach((e, i) => {
        const base = ctx.cut.lines[e.line] ? ctx.L(e.line) : s0 + .6;
        const j = (seen[e.line] = (seen[e.line] ?? -1) + 1);
        const a = base + .3 + j * (rows.length > 6 ? .75 : .9);
        W.fade(e.num, prog(t, a, a + .2));
        e.txt.show(prog(t, a, a + .7));
        W.pop(e.tag, prog(t, a + .7, a + 1.0), { r: -3 });
        if (e.ring) e.ring.draw(prog(t, a + 1.1, a + 1.6));
      });
      W.pop(st.burger, prog(t, s0 + 1.5, s0 + 1.8), { r: 12 });
    },
  });

  window.KIT = K;
})();
