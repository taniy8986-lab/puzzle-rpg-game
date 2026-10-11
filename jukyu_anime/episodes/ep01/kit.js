/* 第1章の小道具の部品。content.js がセリフの id ごとにここの部品を割り当てる。
 * どの部品も { build(box, ctx, W), update(t, ctx, st, W) } を返す。
 * ctx.k(t, n, dur, delay) … このカットの n 行目の開始からの進み具合（0→1）
 */
(function () {
  'use strict';
  const K = {};
  const P = () => window.PROPS;
  const E = () => window.E;

  /* ---------- 値動きのデータ（すべて架空） ---------- */
  // ミライ製菓：横ばい→出来高を伴って急騰して 500 円→翌日急落
  const MIRAI = (() => {
    const d = [];
    let p = 352;
    for (let i = 0; i < 26; i++) { const o = p; p = p + Math.sin(i * 1.7) * 6 + (i % 5 === 0 ? -4 : 2); d.push([o, Math.max(o, p) + 5, Math.min(o, p) - 5, p]); }
    [[p, 372, p - 2, 368], [368, 398, 364, 394], [394, 424, 390, 420], [422, 500, 418, 500]].forEach(c => d.push(c));
    return d;
  })();
  const MIRAI_VOL = MIRAI.map((_, i) => (i < 26 ? 8 + (i % 4) * 3 : [40, 62, 80, 100][i - 26]));
  const MIRAI_NEXT = [...MIRAI, [496, 498, 430, 438]];
  const MIRAI_FALL = [...MIRAI_NEXT, [436, 444, 420, 424], [424, 428, 410, 414], [414, 418, 402, 405], [405, 409, 396, 398]];
  const MIRAI_NEXT_VOL = [...MIRAI_VOL, 70];
  // ハルカゼ食品：何年も横ばい→暴落→押し→少ない出来高で 500 円へ
  const HARU = (() => {
    const d = [];
    let p = 330;
    const path = [];
    for (let i = 0; i < 14; i++) path.push(330 + Math.sin(i * 1.3) * 10);
    for (let i = 0; i < 4; i++) path.push(310 - i * 28);
    for (let i = 0; i < 6; i++) path.push(220 + i * 26);
    for (let i = 0; i < 3; i++) path.push(370 - i * 16);
    for (let i = 0; i < 6; i++) path.push(330 + i * 29);
    path.forEach((q, i) => { const o = p; p = q; d.push([o, Math.max(o, p) + 6, Math.min(o, p) - 6, p]); });
    return d;
  })();
  const HARU_VOL = HARU.map((_, i) => (i >= 14 && i < 18 ? 30 : i < 14 ? 10 + (i % 3) * 2 : 12 + (i % 2) * 3));
  K.DATA = { MIRAI, MIRAI_VOL, MIRAI_NEXT, MIRAI_NEXT_VOL, MIRAI_FALL, HARU, HARU_VOL };

  const fakeNote = (box, x, y, color = '#999', size = 20) => {
    const el = E().mk(box, { left: `${x}px`, top: `${y}px`, fontSize: `${size}px`, color, whiteSpace: 'nowrap' }, 'a noto', '※架空の銘柄です');
    return el;
  };

  /* ---------- スマホ ---------- */
  // 夜のロック画面に通知が重なっていく
  K.phoneNight = ({ time = '22:47', date = '10月14日（火）', items = [] } = {}) => ({
    build(box) {
      const { mk } = E();
      box.style.background = 'linear-gradient(180deg, #1b2450 0%, #3a2c63 100%)';
      mk(box, { left: 0, top: '110px', width: '100%', textAlign: 'center', fontSize: '28px', color: '#dfe4ff' }, 'a noto', date);
      const clock = mk(box, { left: 0, top: '150px', width: '100%', textAlign: 'center', fontSize: '124px', color: '#fff', lineHeight: 1.1 }, 'a noto', time);
      clock.style.fontWeight = 700;
      const cards = items.map((it, i) => {
        const n = mk(box, { left: '28px', top: `${340 + i * 150}px`, width: '500px', height: '134px', background: 'rgba(255,255,255,.9)', borderRadius: '26px',
          padding: '18px 22px', boxShadow: '0 8px 20px rgba(0,0,0,.25)' }, 'a');
        n.innerHTML = `<div class="noto" style="display:flex;align-items:center;gap:10px;font-size:20px;color:#777"><span style="display:inline-block;width:34px;height:34px;border-radius:9px;background:${it.color || '#d6392f'};color:#fff;text-align:center;line-height:34px;font-weight:900;font-size:18px">${it.icon || '株'}</span>${it.app || '株アラート'}<span style="margin-left:auto">${it.ago || '今'}</span></div>
          <div class="noto" style="font-size:25px;font-weight:900;color:#222;margin-top:10px;white-space:nowrap">${it.title}</div>`;
        return n;
      });
      fakeNote(box, 30, 960, 'rgba(255,255,255,.7)');
      return { cards };
    },
    update(t, ctx, st, W) {
      const D = ctx.cut.end - ctx.cut.start;
      st.cards.forEach((c, i) => W.slide(c, E().prog(t, ctx.cut.start + .25 + i * Math.min(.55, D / (st.cards.length + 2)), ctx.cut.start + .6 + i * Math.min(.55, D / (st.cards.length + 2))), 0, -40));
    },
  });

  // 株価アプリ（上がる日／下がる朝）
  K.phoneStock = ({ name = 'ミライ製菓', code = '0000', from = 352, to = 500, change = '', up = true, badge = '', badgeAt = .6, data = MIRAI, vol = MIRAI_VOL,
    volLabel = '', volBlink = false, buyLine = null } = {}) => ({
    build(box) {
      const r = P().phoneStock(box, { name, code, price: '', change, up, badge, data, vol });
      fakeNote(box, 30, 975);
      const { mk } = E();
      let vl = null;
      if (volLabel) {
        vl = mk(box, { left: '30px', top: '930px', padding: '4px 14px', borderRadius: '8px', background: '#fff3d6', color: '#c0392b', fontSize: '26px', whiteSpace: 'nowrap' }, 'a noto', volLabel);
        vl.style.fontWeight = 900;
      }
      let bl = null;
      if (buyLine) {
        const y = 500 + r.chart.Y(buyLine);
        bl = mk(box, { left: '30px', top: `${y}px`, width: '496px', height: '0', borderTop: '3px dashed #c0392b' }, 'a');
        mk(bl, { left: '330px', top: '-34px', fontSize: '22px', color: '#c0392b', whiteSpace: 'nowrap' }, 'a noto', `買値 ${buyLine}円`).style.fontWeight = 900;
      }
      return Object.assign(r, { vl, bl });
    },
    update(t, ctx, st, W) {
      const { prog, ease } = E();
      const k = prog(t, ctx.cut.start + .2, ctx.cut.start + 1.6);
      st.chart.reveal(ease.out(k));
      st.price.innerHTML = `${Math.round(E().lerp(from, to, ease.out(k))).toLocaleString('ja-JP')}<span style="font-size:40px">円</span>`;
      if (st.badge) W.pop(st.badge, prog(t, ctx.cut.start + 1.6 * badgeAt + .2, ctx.cut.start + 1.6 * badgeAt + .6));
      if (st.vl) st.vl.style.opacity = volBlink ? (prog(t, ctx.cut.start + 1.2, ctx.cut.start + 1.4) * (.55 + .45 * Math.abs(Math.sin(t * 5)))) : prog(t, ctx.cut.start + 1.2, ctx.cut.start + 1.5);
      if (st.bl) st.bl.style.opacity = prog(t, ctx.cut.start + 1.0, ctx.cut.start + 1.3);
    },
  });

  // SNS のタイムラインが流れる
  K.phoneSNS = (posts) => ({
    build(box) {
      const els = P().phoneSNS(box, posts);
      fakeNote(box, 30, 975);
      return { els };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const D = ctx.cut.end - ctx.cut.start;
      st.els.forEach((e, i) => W.slide(e, prog(t, ctx.cut.start + .15 + i * D * .22, ctx.cut.start + .5 + i * D * .22), 0, 60));
    },
  });

  // 約定通知
  K.phoneFill = ({ time = '23:05', title = '', body = '' } = {}) => ({
    build(box) {
      const n = P().phoneNotify(box, { time, date: '10月14日（火）', app: '証券アプリ', title, body });
      box.style.background = 'linear-gradient(180deg, #1b2450 0%, #3a2c63 100%)';
      [...box.querySelectorAll('.a')].slice(0, 2).forEach(e => { e.style.color = '#fff'; });
      fakeNote(box, 30, 975, 'rgba(255,255,255,.7)');
      return { n };
    },
    update(t, ctx, st, W) { W.slide(st.n, ctx.k(t, 0, .45, .1), 0, -50); },
  });

  /* ---------- カレンダー ---------- */
  K.calendar = ({ marks = [], notes = [] } = {}) => ({
    build(box) {
      const cal = P().calendar(box, { x: 300, y: 50, w: 1000, h: 780, title: '10月', firstDow: 3, days: 31, rot: -1 });
      const circles = marks.map(m => { const [x, y] = cal.cell(m.day); return P().circle(box, x, y, 46, 40, { color: m.color || '#e0312f', width: 7 }); });
      const stickies = notes.map(n => P().sticky(box, n.text, Object.assign({ w: 380, h: 250, size: 36 }, n)));
      return { cal, circles, stickies };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      W.fade(st.cal.el, prog(t, ctx.cut.start - .1, ctx.cut.start + .3));
      st.circles.forEach((c, i) => c.draw(prog(t, ctx.cut.start + .4 + i * .5, ctx.cut.start + .9 + i * .5)));
      st.stickies.forEach((s, i) => W.pop(s, prog(t, ctx.cut.start + .7 + i * .5, ctx.cut.start + 1.1 + i * .5), { r: 4 - i * 6 }));
    },
  });

  /* ---------- カード ---------- */
  K.cards = (items, { title = '', startLine = 0, perLine = false, y = 280, h = 420 } = {}) => ({
    build(box) {
      const n = items.length;
      const w = Math.min(430, (1700 - (n - 1) * 30) / n);
      const cards = items.map((it, i) => P().card(box, it[0], it[1] || '', { x: 960 - (n * (w + 30) - 30) / 2 + i * (w + 30), y, w, h, num: String(i + 1) }));
      const head = title ? P().label(box, title, '', { y: 100, size: 46 }) : null;
      return { cards, head };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      if (st.head) W.pop(st.head, ctx.k(t, 0, .4, -.1));
      const D = ctx.cut.end - ctx.cut.start;
      st.cards.forEach((c, i) => {
        // perLine: i 枚目は i 行目の頭で出す（足りなければ順番に）
        const s = perLine && ctx.cut.lines[startLine + i] ? ctx.L(startLine + i) : ctx.cut.start + .2 + i * Math.min(.6, D / (st.cards.length + 1));
        W.slide(c, prog(t, s, s + .45), 0, 70);
      });
    },
  });

  /* ---------- 事実・推測・不明のメモ ---------- */
  K.factMemo = () => ({
    build(box) {
      const { mk } = E();
      const paper = P().paper(box, { x: 360, y: 80, w: 1200, h: 820, rot: -1, lines: false });
      W_ = E().W_;
      const head = W_.write(paper, 'れんしゅう：分けて書く', { left: '70px', top: '50px', fontSize: '50px', color: '#2b2b38' });
      const rows = [
        ['事実', '出来高5万株で安値更新', '#2f7ad6'],
        ['推測', '売り物を吐かせた？', '#e0a400'],
        ['不明', '誰がやったか', '#e0312f'],
      ].map((r, i) => {
        const y = 190 + i * 200;
        const tag = mk(paper, { left: '70px', top: `${y}px`, width: '170px', height: '110px', borderRadius: '18px', background: r[2], color: '#fff', fontSize: '50px',
          textAlign: 'center', lineHeight: '110px' }, 'a noto', r[0]);
        tag.style.fontWeight = 900;
        const txt = W_.write(paper, r[1], { left: '290px', top: `${y + 22}px`, fontSize: '54px', color: '#2b2b38' });
        const line = mk(paper, { left: '70px', top: `${y + 150}px`, width: '1060px', height: '3px', background: 'rgba(0,0,0,.12)' }, 'a');
        return { tag, txt, line };
      });
      const circ = P().circle(paper, 470, 645, 260, 70, { color: '#e0312f' });
      const note = W_.write(paper, '← チャートだけでは分からない', { left: '760px', top: '610px', fontSize: '36px', color: '#e0312f' });
      const ihou = W_.write(paper, '違法だ！', { left: '880px', top: '48px', fontSize: '54px', color: '#777' });
      const x = E().W_.stamp(paper, 900, 10, 'x', 130);
      x.querySelector('path').setAttribute('stroke', '#e0312f');
      return { paper, head, rows, circ, note, ihou, x };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const D = ctx.cut.end - ctx.cut.start;
      W.slide(st.paper, prog(t, ctx.cut.start - .1, ctx.cut.start + .4), 0, 60, { r: -1 });
      st.head.show(prog(t, ctx.cut.start + .2, ctx.cut.start + .8));
      st.rows.forEach((r, i) => {
        const s = ctx.cut.lines.length > 1 && ctx.cut.lines[i] ? ctx.L(i) + .1 : ctx.cut.start + .6 + i * D * .22;
        W.pop(r.tag, prog(t, s, s + .3));
        r.txt.show(prog(t, s + .2, s + .9));
      });
      const last = ctx.cut.lines.length > 2 ? ctx.L(2) + .9 : ctx.cut.start + D * .75;
      st.circ.draw(prog(t, last, last + .6));
      st.note.show(prog(t, last + .5, last + 1.1));
      st.ihou.show(prog(t, ctx.cut.start + .3, ctx.cut.start + .7));
      W.pop(st.x, prog(t, ctx.cut.start + 1.0, ctx.cut.start + 1.3));
    },
  });
  let W_ = null;

  /* ---------- 箱 ---------- */
  // 持ち主の札が付いた箱の山。sellNow の箱が光る
  K.boxOwners = ({ title = '1箱＝1万株（例）', mode = 'glow' } = {}) => ({
    build(box) {
      const { mk } = E();
      const bx = P().boxes(box, { cols: 6, rows: 3, cx: 640, bottom: 850, bw: 150, bh: 118 });
      const sellNow = new Set([0, 3, 5, 8, 10, 13, 15, 16]);
      const tags = bx.map((b, i) => {
        const s = sellNow.has(i);
        const tag = mk(b.el, { inset: 0, borderRadius: '2px', background: s ? 'rgba(255,214,74,.85)' : 'rgba(160,170,190,.55)' }, 'layer');
        b.el.insertBefore(tag, b.el.firstChild);
        return { tag, s };
      });
      const legend = mk(box, { left: '160px', top: '200px', display: 'flex', gap: '24px', alignItems: 'center' }, 'a');
      legend.innerHTML = `<span class="noto" style="font-weight:900;font-size:34px;padding:6px 20px;border-radius:12px;background:#ffd24a;color:#2a2f45">すぐ売れる</span>
        <span class="noto" style="font-weight:900;font-size:34px;padding:6px 20px;border-radius:12px;background:#b9c1d3;color:#2a2f45">しばらく売らない</span>
        <span class="noto" style="font-weight:900;font-size:30px;color:#7a6a55;margin-left:20px">1箱＝1万株（例）</span>`;
      const belt = mk(box, { left: '1060px', top: '820px', width: '340px', height: '30px', borderRadius: '15px', background: '#555c6b',
        backgroundImage: 'repeating-linear-gradient(90deg, #555c6b 0 24px, #6b7385 24px 30px)' }, 'a');
      const glows = bx.map((b, i) => (tags[i].s ? mk(box, { left: `${b.x - 16}px`, top: `${b.y - 16}px`, width: '182px', height: '150px', borderRadius: '16px',
        background: 'radial-gradient(circle, rgba(255,214,74,.75), rgba(255,214,74,0) 70%)' }, 'a') : null));
      glows.forEach(g => g && box.insertBefore(g, box.firstChild));
      const market = mk(box, { left: '1380px', top: '520px', width: '440px', height: '330px', background: '#26365e', borderRadius: '24px 24px 0 0' }, 'a');
      mk(market, { left: 0, top: '26px', width: '100%', textAlign: 'center', fontSize: '50px', color: '#fff' }, 'a noto', '市場').style.fontWeight = 900;
      const cnt = mk(market, { left: 0, top: '120px', width: '100%', textAlign: 'center', fontSize: '30px', color: '#cfd6e6' }, 'a noto', '実際に出た株数');
      const num = mk(market, { left: 0, top: '170px', width: '100%', textAlign: 'center', fontSize: '76px', color: '#ffd24a' }, 'a noto', '0万株');
      num.style.fontWeight = 900;
      const lab = P().label(box, title, '', { x: 960, y: 90, size: 40 });
      return { bx, tags, glows, market, num, cnt, lab, legend, belt, sellIdx: [...sellNow] };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, clamp, lerp } = E();
      const s0 = ctx.cut.start;
      W.pop(st.lab, prog(t, s0, s0 + .4));
      st.bx.forEach((b, i) => { const k = prog(t, s0 + .05 + i * .02, s0 + .35 + i * .02); T(b.el, { y: (1 - ease.out(k)) * -260, o: clamp(k * 3) }); });
      st.tags.forEach((g, i) => W.fade(g.tag, prog(t, s0 + .6 + i * .015, s0 + .9 + i * .015)));
      W.slide(st.legend, prog(t, s0 + .6, s0 + 1.0), -40, 0);
      const glowK = prog(t, s0 + 1.1, s0 + 1.5);
      st.glows.forEach(g => g && (g.style.opacity = glowK * (.7 + .3 * Math.sin(t * 6))));
      const showMarket = mode !== 'glow' || ctx.cut.lines.length > 1;
      st.market.style.opacity = showMarket ? 1 : 0;
      if (showMarket) {
        // 2 行目：光った箱が市場へ運ばれ、カウンターが回る
        const m0 = ctx.cut.lines.length > 1 ? ctx.L(1) : s0 + 1.6;
        W.slide(st.market, prog(t, m0 - .2, m0 + .3), 120, 0);
        W.fade(st.belt, prog(t, m0 - .2, m0 + .2));
        st.belt.style.backgroundPosition = `${(t * 120) % 30}px 0`;
        st.sellIdx.forEach((i, j) => {
          const b = st.bx[i];
          // 床へ降りる → ベルトに乗って右へ → 市場の中へ
          const k1 = ease.inOut(prog(t, m0 + .3 + j * .3, m0 + .7 + j * .3));
          const k2 = ease.lin(prog(t, m0 + .7 + j * .3, m0 + 1.3 + j * .3));
          const bx0 = 1060 - b.x, by0 = 820 - 118 - b.y;
          const x = lerp(0, bx0, k1) + k2 * (1440 + (j % 4) * 40 - 1060);
          const y = lerp(0, by0, k1) - Math.sin(k1 * Math.PI) * 60 + k2 * (-150 - (j >> 2) * 40);
          T(b.el, { x, y, s: lerp(1, .6, k2) });
        });
        const moved = clamp((t - m0 - .3) / .25 / st.sellIdx.length * st.sellIdx.length);
        W.counter(st.num, 0, 8, prog(t, m0 + .3, m0 + .3 + st.sellIdx.length * .25 + .7), v => `${Math.round(v)}万株`);
      }
    },
  });

  // 返済・期限の赤い札：売らざるを得ない箱は市場へ、買い戻さざるを得ない分は市場から引き戻す
  K.boxForced = () => ({
    build(box) {
      const { mk } = E();
      const market = mk(box, { left: '760px', top: '480px', width: '400px', height: '370px', background: '#26365e', borderRadius: '24px 24px 0 0' }, 'a');
      mk(market, { left: 0, top: '26px', width: '100%', textAlign: 'center', fontSize: '50px', color: '#fff' }, 'a noto', '市場').style.fontWeight = 900;
      const left = P().boxes(box, { cols: 3, rows: 2, cx: 330, bottom: 850, bw: 130, bh: 104, gap: 8 });
      const right = P().boxes(box, { cols: 3, rows: 2, cx: 1590, bottom: 850, bw: 130, bh: 104, gap: 8, color: '#c9d3e8' });
      const tagL = left.map(b => { const g = mk(b.el, { left: '6px', top: '6px', padding: '2px 8px', borderRadius: '8px', background: '#e0312f', color: '#fff', fontSize: '19px', whiteSpace: 'nowrap' }, 'a noto', '返済期限'); g.style.fontWeight = 900; return g; });
      const tagR = right.map(b => { const g = mk(b.el, { left: '6px', top: '6px', padding: '2px 8px', borderRadius: '8px', background: '#2f7ad6', color: '#fff', fontSize: '19px', whiteSpace: 'nowrap' }, 'a noto', '買い戻し'); g.style.fontWeight = 900; return g; });
      const capL = P().label(box, '売らざるを得ない人', '', { x: 330, y: 300, size: 36 });
      const capR = P().label(box, '買い戻さざるを得ない人', '', { x: 1590, y: 300, size: 36 });
      const arL = E().W_.arrow(box, 520, 640, 740, 640, { color: '#e0312f', width: 12 });
      const arR = E().W_.arrow(box, 1180, 700, 1400, 700, { color: '#2f7ad6', width: 12 });
      return { market, left, right, tagL, tagR, capL, capR, arL, arR };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, lerp } = E();
      const s0 = ctx.cut.start;
      W.slide(st.market, prog(t, s0, s0 + .4), 0, 80);
      W.pop(st.capL, prog(t, s0 + .3, s0 + .7));
      W.pop(st.capR, prog(t, s0 + .6, s0 + 1.0));
      st.tagL.concat(st.tagR).forEach((g, i) => W.fade(g, prog(t, s0 + .5 + i * .05, s0 + .8 + i * .05)));
      st.arL.draw(prog(t, s0 + 1.0, s0 + 1.5));
      st.arR.draw(prog(t, s0 + 1.4, s0 + 1.9));
      st.left.forEach((b, i) => { const k = ease.inOut(prog(t, s0 + 1.6 + i * .12, s0 + 2.2 + i * .12)); T(b.el, { x: lerp(0, 790 + (i % 3) * 84 - b.x, k), y: lerp(0, 600 + Math.floor(i / 3) * 74 - b.y, k) - Math.sin(k * Math.PI) * 80, s: lerp(1, .6, k) }); });
      st.right.forEach((b, i) => { const k = ease.inOut(prog(t, s0 + 2.0 + i * .12, s0 + 2.6 + i * .12)); T(b.el, { x: lerp(1000 + (i % 3) * 84 - b.x, 0, k) * 1, y: lerp(600 + Math.floor(i / 3) * 74 - b.y, 0, k) - Math.sin(k * Math.PI) * 80, s: lerp(.6, 1, k), o: E().clamp(k * 4) }); });
    },
  });

  // 同じ 500 円の A と B：A は出口の前に箱が山積み、B は多くが金庫の中
  K.boxAB = ({ step = 'both' } = {}) => ({
    build(box) {
      const { mk } = E();
      const div = mk(box, { left: '958px', top: '120px', width: '4px', height: '740px', background: 'rgba(60,40,20,.25)' }, 'a');
      const A = P().boxes(box, { cols: 5, rows: 3, cx: 560, bottom: 850, bw: 104, bh: 86 });
      const Bout = P().boxes(box, { cols: 2, rows: 1, cx: 1160, bottom: 850, bw: 104, bh: 86 });
      const vault = mk(box, { left: '1340px', top: '470px', width: '420px', height: '380px', background: 'linear-gradient(#8e98ab, #6b7488)', borderRadius: '22px',
        border: '8px solid #4d5568' }, 'a');
      mk(vault, { left: '150px', top: '120px', width: '110px', height: '110px', borderRadius: '50%', border: '12px solid #3d4455', background: '#c7ccd8' }, 'a');
      mk(vault, { left: 0, top: '290px', width: '100%', textAlign: 'center', fontSize: '34px', color: '#fff' }, 'a noto', '長期保有の金庫').style.fontWeight = 900;
      const exitA = mk(box, { left: '250px', top: '520px', padding: '8px 20px', borderRadius: '12px', background: '#e0312f', color: '#fff', fontSize: '32px', whiteSpace: 'nowrap' }, 'a noto', '出口の前に山積み');
      exitA.style.fontWeight = 900;
      const tagA = P().label(box, 'A（※架空）', '500円', { x: 560, y: 70, size: 40 });
      const tagB = P().label(box, 'B（※架空）', '500円', { x: 1440, y: 70, size: 40 });
      const nextA = P().label(box, '次に戻る売り物', '多い', { x: 560, y: 300, size: 34 });
      const nextB = P().label(box, '次に戻る売り物', '少ない', { x: 1440, y: 300, size: 34 });
      return { A, Bout, vault, exitA, tagA, tagB, nextA, nextB };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, clamp } = E();
      const s0 = ctx.cut.start;
      W.pop(st.tagA, prog(t, s0, s0 + .4));
      W.pop(st.tagB, prog(t, s0 + .15, s0 + .55));
      st.A.forEach((b, i) => { const k = prog(t, s0 + .2 + i * .03, s0 + .5 + i * .03); T(b.el, { y: (1 - ease.out(k)) * -240, o: clamp(k * 3) }); });
      st.Bout.forEach((b, i) => { const k = prog(t, s0 + .5 + i * .05, s0 + .8 + i * .05); T(b.el, { y: (1 - ease.out(k)) * -240, o: clamp(k * 3) }); });
      W.slide(st.vault, prog(t, s0 + .4, s0 + .9), 80, 0);
      W.pop(st.exitA, prog(t, s0 + .9, s0 + 1.3), { r: -2 });
      W.pop(st.nextA, prog(t, s0 + 1.3, s0 + 1.7));
      W.pop(st.nextB, prog(t, s0 + 1.6, s0 + 2.0));
    },
  });

  // 持ち主ごとの色ラベル（ストック）
  K.boxStock = () => ({
    build(box) {
      const { mk } = E();
      // 奥の棚（固定）
      const shelf = mk(box, { left: '1000px', top: '470px', width: '840px', height: '20px', background: '#8a6a48', borderRadius: '6px', boxShadow: '0 8px 0 rgba(0,0,0,.12)' }, 'a');
      const legs = [1020, 1800].map(x => mk(box, { left: `${x}px`, top: '490px', width: '20px', height: '360px', background: '#7a5c3c' }, 'a'));
      const exit = mk(box, { left: '60px', top: '430px', width: '160px', height: '420px', background: '#3e5a7d', borderRadius: '14px 14px 0 0', border: '8px solid #2b3f59' }, 'a');
      mk(exit, { left: 0, top: '20px', width: '100%', textAlign: 'center', fontSize: '34px', color: '#fff' }, 'a noto', '出口').style.fontWeight = 900;
      mk(exit, { left: '110px', top: '210px', width: '18px', height: '18px', borderRadius: '50%', background: '#ffd24a' }, 'a');
      const groups = [
        { label: '浮動玉', note: 'すぐ売りに出やすい', color: '#ffd24a', cx: 420, bottom: 850, n: 6, lock: false },
        { label: '信用', note: '返済でいずれ動く', color: '#ffb0a8', cx: 780, bottom: 850, n: 4, lock: false },
        { label: '大株主', note: '固定（めったに動かない）', color: '#9fc1ff', cx: 1210, bottom: 470, n: 6, lock: true },
        { label: '長期の現物', note: '固定（奥の棚）', color: '#b8e0c2', cx: 1630, bottom: 470, n: 6, lock: true },
      ];
      const out = groups.map(g => {
        const bx = P().boxes(box, { cols: 3, rows: 2, cx: g.cx, bottom: g.bottom, bw: 104, bh: 86, count: g.n });
        bx.forEach(b => { b.el.style.background = g.color; });
        const top = g.bottom - 2 * 90;
        const lab = P().label(box, g.label, '', { x: g.cx, y: top - 150, size: 34 });
        const note = mk(box, { left: `${g.cx - 190}px`, top: `${top - 62}px`, width: '380px', textAlign: 'center', fontSize: '28px', color: '#5a4630' }, 'a noto', g.note);
        note.style.fontWeight = 900;
        const lock = g.lock ? mk(box, { left: `${g.cx + 130}px`, top: `${g.bottom - 80}px`, fontSize: '52px' }, 'a', '🔒') : null;
        return { bx, lab, note, lock };
      });
      const head = P().label(box, 'ストック ＝ 株券がどこに固定されているか', '', { y: 40, size: 40 });
      return { out, head, shelf, legs, exit };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, clamp } = E();
      const s0 = ctx.cut.start;
      W.pop(st.head, prog(t, s0, s0 + .4));
      W.fade(st.shelf, prog(t, s0, s0 + .3)); st.legs.forEach(l => W.fade(l, prog(t, s0, s0 + .3)));
      W.slide(st.exit, prog(t, s0 + .1, s0 + .5), -80, 0);
      st.out.forEach((g, gi) => {
        const a = s0 + .3 + gi * .45;
        g.bx.forEach((b, i) => { const k = prog(t, a + i * .03, a + .3 + i * .03); T(b.el, { y: (1 - ease.out(k)) * -220, o: clamp(k * 3) }); });
        W.pop(g.lab, prog(t, a + .2, a + .5));
        W.fade(g.note, prog(t, a + .4, a + .7));
        if (g.lock) W.pop(g.lock, prog(t, a + .6, a + .9));
      });
    },
  });

  /* ---------- 比較（チャートつき） ---------- */
  K.compareAB = ({ focus = null, next = false } = {}) => ({
    build(box) {
      const { mk } = E();
      const mkSide = (x, title, sub, data, vol, color) => {
        const card = mk(box, { left: `${x}px`, top: '90px', width: '760px', height: '760px', background: '#fff', borderRadius: '26px', boxShadow: '0 16px 30px rgba(40,30,20,.2)', overflow: 'hidden' }, 'a');
        mk(card, { left: 0, top: 0, width: '100%', height: '110px', background: color }, 'a');
        mk(card, { left: '34px', top: '18px', fontSize: '50px', color: '#fff', whiteSpace: 'nowrap' }, 'a noto', title).style.fontWeight = 900;
        mk(card, { left: '36px', top: '128px', fontSize: '28px', color: '#5a5f73', whiteSpace: 'nowrap' }, 'a noto', sub);
        const ch = E().W_.candles(card, 40, 190, 680, 330, data, { up: '#e0453a', down: '#2f7ad6', vol, volH: 120, volColor: 'rgba(120,140,170,.55)', grid: 'rgba(0,0,0,.06)' });
        const tag = mk(card, { left: '520px', top: '140px', padding: '6px 18px', background: '#ffd24a', borderRadius: '10px', fontSize: '40px', color: '#2a2f45' }, 'a noto', '500円');
        tag.style.fontWeight = 900;
        return { card, ch, tag };
      };
      const A = mkSide(150, 'A ミライ製菓', '短期の信用買い＋飛びつきで来た', next ? MIRAI_NEXT : MIRAI, next ? MIRAI_NEXT_VOL : MIRAI_VOL, '#d6392f');
      const B = mkSide(1010, 'B ハルカゼ食品', '何年も停滞→売り物が減って戻った', HARU, HARU_VOL, '#26365e');
      mk(box, { left: '150px', top: '880px', fontSize: '24px', color: '#7a6a55' }, 'a noto', '※どちらも架空の銘柄・値動きはイメージです');
      return { A, B };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T } = E();
      const s0 = ctx.cut.start;
      W.slide(st.A.card, prog(t, s0, s0 + .45), -100, 0, { s: focus === 'A' ? 1.03 : focus === 'B' ? .97 : 1, o: focus === 'B' ? .55 : 1 });
      W.slide(st.B.card, prog(t, s0 + .15, s0 + .6), 100, 0, { s: focus === 'B' ? 1.03 : focus === 'A' ? .97 : 1, o: focus === 'A' ? .55 : 1 });
      st.A.ch.reveal(ease.out(prog(t, s0 + .3, s0 + 1.6)));
      st.B.ch.reveal(ease.out(prog(t, s0 + .4, s0 + 1.9)));
      W.pop(st.A.tag, prog(t, s0 + 1.5, s0 + 1.8), { r: -4 });
      W.pop(st.B.tag, prog(t, s0 + 1.8, s0 + 2.1), { r: 4 });
    },
  });

  /* ---------- 付箋 ---------- */
  K.sticky = (text, sub = '') => ({
    build(box) { return { s: P().sticky(box, text, { x: 700, y: 260, w: 520, h: 440, size: 60, rot: -3, sub }) }; },
    update(t, ctx, st, W) { W.pop(st.s, ctx.k(t, 0, .5)); },
  });


  /* ---------- A の山（出口の前、短期の札） ---------- */
  K.boxA = () => ({
    build(box) {
      const { mk } = E();
      const bx = P().boxes(box, { cols: 5, rows: 3, cx: 720, bottom: 850, bw: 140, bh: 104, gap: 6 });
      const words = ['短期の信用買い', '飛びつき'];
      bx.forEach(b => { b.el.firstChild.style.top = '68%'; });
      const tags = bx.map((b, i) => { const g = mk(b.el, { left: '50%', top: '6px', transform: 'translateX(-50%)', padding: '1px 8px', borderRadius: '8px', background: i % 2 ? '#ffd24a' : '#ffb0a8',
        color: '#2a2f45', fontSize: i % 2 ? '20px' : '15px', whiteSpace: 'nowrap' }, 'a noto', words[i % 2]); g.style.fontWeight = 900; return g; });
      const exit = mk(box, { left: '1180px', top: '560px', width: '300px', height: '290px', background: '#26365e', borderRadius: '20px 20px 0 0' }, 'a');
      mk(exit, { left: 0, top: '30px', width: '100%', textAlign: 'center', fontSize: '42px', color: '#fff' }, 'a noto', '出口').style.fontWeight = 900;
      mk(exit, { left: 0, top: '100px', width: '100%', textAlign: 'center', fontSize: '26px', color: '#cfd6e6' }, 'a noto', '（市場へ売りに戻る）');
      const lab = P().label(box, '銘柄A（※架空）', '500円', { x: 760, y: 120, size: 40 });
      // 短い時間軸の急上昇の矢印
      const arrow = E().W_.arrow(box, 330, 470, 600, 250, { color: '#e0312f', width: 12 });
      const arrowLab = mk(box, { left: '170px', top: '300px', fontSize: '30px', color: '#e0312f', whiteSpace: 'nowrap' }, 'a noto', '短い期間で急上昇');
      arrowLab.style.fontWeight = 900;
      return { bx, tags, exit, lab, arrow, arrowLab };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, clamp } = E();
      const s0 = ctx.cut.start;
      W.pop(st.lab, prog(t, s0, s0 + .4));
      st.arrow.draw(prog(t, s0 + .2, s0 + .8));
      W.fade(st.arrowLab, prog(t, s0 + .6, s0 + .9));
      st.bx.forEach((b, i) => { const k = prog(t, s0 + .3 + i * .04, s0 + .6 + i * .04); T(b.el, { y: (1 - ease.out(k)) * -240, o: clamp(k * 3) }); });
      st.tags.forEach((g, i) => W.fade(g, prog(t, s0 + .9 + i * .08, s0 + 1.2 + i * .08)));
      W.slide(st.exit, prog(t, s0 + 1.2, s0 + 1.6), 120, 0);
      // 箱が出口の方へにじり寄る
      const lean = ease.inOut(prog(t, s0 + 1.8, s0 + 2.6));
      st.bx.forEach((b, i) => { if (prog(t, s0 + .3 + i * .04, s0 + .6 + i * .04) >= 1) T(b.el, { x: lean * (60 + b.c * 14) }); });
    },
  });

  /* ---------- B の長い時間軸（停滞→持ち主が替わる→暴落・押し→金庫→500 円） ---------- */
  K.boxB = () => ({
    build(box) {
      const { mk } = E();
      const axis = mk(box, { left: '140px', top: '560px', width: '1640px', height: '6px', background: '#8a7354', borderRadius: '3px' }, 'a');
      const years = ['1年目', '2年目', '3年目', 'いま'].map((y, i) => mk(box, { left: `${150 + i * 500}px`, top: '576px', fontSize: '34px', color: '#7a6a55' }, 'a noto', y));
      // 値動きの線（横ばい→暴落→押し→戻り）
      const pts = [[150, 420], [400, 405], [640, 430], [760, 420], [840, 520], [900, 530], [1020, 450], [1100, 475], [1160, 468], [1300, 380], [1460, 330], [1700, 280]];
      const line = E().W_.line(box, pts, { color: '#26365e', width: 8 });
      const dip1 = mk(box, { left: '930px', top: '505px', fontSize: '36px', color: '#e0312f' }, 'a noto', '暴落');
      const dip2 = mk(box, { left: '1080px', top: '400px', fontSize: '36px', color: '#e0a400' }, 'a noto', '押し');
      [dip1, dip2].forEach(d => { d.style.fontWeight = 900; });
      // 箱：最初は 8 箱。安値で別の倉庫へ、谷を越えるたびに売りに出る箱が減る
      const bx = P().boxes(box, { cols: 4, rows: 2, cx: 420, bottom: 850, bw: 120, bh: 96, color: '#cdb59a' });
      const ware = mk(box, { left: '1250px', top: '700px', width: '560px', height: '170px', background: 'linear-gradient(#8e98ab, #6b7488)', borderRadius: '18px', border: '6px solid #4d5568' }, 'a');
      mk(ware, { left: 0, top: '58px', width: '100%', textAlign: 'center', fontSize: '34px', color: '#fff' }, 'a noto', '鍵付きの金庫（長期保有）').style.fontWeight = 900;
      const lab = P().label(box, '銘柄B（※架空）', '', { x: 960, y: 110, size: 40 });
      const gyoku = mk(box, { left: '150px', top: '200px', padding: '8px 22px', background: '#fff', border: '4px solid #26365e', borderRadius: '14px', fontSize: '32px',
        color: '#26365e' }, 'a noto', '玉（ぎょく）＝ 株券のこと');
      gyoku.style.fontWeight = 900;
      const tag = mk(box, { left: '1620px', top: '190px', padding: '6px 20px', background: '#ffd24a', borderRadius: '10px', fontSize: '46px', color: '#2a2f45' }, 'a noto', '500円');
      tag.style.fontWeight = 900;
      return { axis, years, line, dip1, dip2, bx, ware, lab, gyoku, tag };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, clamp, lerp } = E();
      const s0 = ctx.cut.start;
      const s1 = ctx.cut.lines.length > 1 ? ctx.L(1) : s0 + 3;     // 2 行目（暴落や押しを経て）
      W.pop(st.lab, prog(t, s0, s0 + .4));
      W.fade(st.axis, prog(t, s0, s0 + .3));
      st.years.forEach((y, i) => W.fade(y, prog(t, s0 + .2 + i * .1, s0 + .5 + i * .1)));
      W.pop(st.gyoku, prog(t, s0 + 1.4, s0 + 1.8), { r: -2 });
      st.line.draw(lerp(0, .3, ease.out(prog(t, s0 + .3, s0 + 1.4))) + lerp(0, .7, ease.inOut(prog(t, s1, s1 + 2.4))));
      W.pop(st.dip1, prog(t, s1 + .5, s1 + .8));
      W.pop(st.dip2, prog(t, s1 + 1.1, s1 + 1.4));
      W.slide(st.ware, prog(t, s1 - .2, s1 + .3), 100, 0);
      st.bx.forEach((b, i) => {
        const k0 = prog(t, s0 + .3 + i * .04, s0 + .6 + i * .04);
        // 1 行目の後半：安値で持ち主が替わる（右へ少し移って色が変わる）
        const mv = ease.inOut(prog(t, s0 + 1.8 + i * .06, s0 + 2.4 + i * .06));
        b.el.style.background = mv > .5 ? '#a9c4e8' : '#cdb59a';
        // 2 行目：6 箱は金庫へ、2 箱だけ残る
        const toVault = i < 6 ? ease.inOut(prog(t, s1 + .6 + i * .15, s1 + 1.3 + i * .15)) : 0;
        T(b.el, { x: mv * 300 + toVault * (1300 - b.x - 300 + (i % 4) * 110), y: (1 - ease.out(k0)) * -220 + toVault * (730 - b.y) - Math.sin(toVault * Math.PI) * 120,
          s: lerp(1, .7, toVault), o: clamp(k0 * 3) * (1 - prog(toVault, .9, 1)) });
      });
      W.pop(st.tag, prog(t, s1 + 2.3, s1 + 2.7), { r: 4 });
    },
  });

  /* ---------- 歩値と出来高（フロー） ---------- */
  K.phoneTape = () => ({
    build(box) {
      const { mk } = E();
      box.style.background = '#fff';
      mk(box, { left: '30px', top: '100px', fontSize: '40px', color: '#222' }, 'a noto', 'ミライ製菓 <span style="font-size:22px;color:#999">歩値</span>').style.fontWeight = 900;
      mk(box, { left: '30px', top: '160px', padding: '4px 16px', background: '#26365e', color: '#fff', borderRadius: '8px', fontSize: '26px' }, 'a noto', 'フロー ＝ その日に動いた株数');
      const rows = [];
      const data = [['14:58:42', '501', '300'], ['14:58:40', '500', '1,200'], ['14:58:37', '501', '500'], ['14:58:31', '500', '2,000'], ['14:58:30', '499', '800'],
        ['14:58:22', '500', '100'], ['14:58:15', '502', '3,000'], ['14:58:11', '501', '400'], ['14:58:02', '500', '600']];
      data.forEach((d, i) => {
        const r = mk(box, { left: '30px', top: `${240 + i * 64}px`, width: '496px', height: '56px', display: 'flex', alignItems: 'center', gap: '30px', borderBottom: '2px solid #eee',
          fontSize: '28px', color: '#333' }, 'a noto', `<span style="color:#999">${d[0]}</span><span style="font-weight:900">${d[1]}円</span><span style="margin-left:auto;font-weight:900">${d[2]}株</span>`);
        rows.push(r);
      });
      const vol = mk(box, { left: '30px', top: '840px', width: '496px', fontSize: '30px', color: '#c0392b', textAlign: 'right' }, 'a noto', '');
      vol.style.fontWeight = 900;
      mk(box, { left: '30px', top: '975px', fontSize: '20px', color: '#999' }, 'a noto', '※架空の銘柄・数字はイメージです');
      return { rows, vol };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const s0 = ctx.cut.start;
      st.rows.forEach((r, i) => W.slide(r, prog(t, s0 + .2 + (st.rows.length - i) * .16, s0 + .45 + (st.rows.length - i) * .16), 0, -30));
      W.counter(st.vol, 0, 1000000, prog(t, s0 + .3, s0 + 2.4), v => `出来高 ${Math.round(v / 10000)}万株`);
    },
  });

  /* ---------- 価格反応（割れた・止まった・跳ねた） ---------- */
  K.reactMemo = () => ({
    build(box) {
      const paper = P().paper(box, { x: 360, y: 90, w: 1200, h: 820, rot: 1 });
      const W_ = E().W_;
      const head = W_.write(paper, '価格反応 ＝ その売買を受けて…', { left: '70px', top: '50px', fontSize: '50px', color: '#2b2b38' });
      const items = [
        ['割れた', '#2f7ad6', [[0, 0], [90, 60], [170, 50], [260, 160]]],
        ['止まった', '#e0a400', [[0, 60], [90, 100], [170, 95], [260, 100]]],
        ['跳ねた', '#e0312f', [[0, 140], [90, 100], [170, 110], [260, 0]]],
      ].map((it, i) => {
        const x = 90 + i * 360;
        const ln = W_.line(paper, it[2].map(p => [x + p[0], 260 + p[1]]), { color: it[1], width: 12 });
        const lb = W_.write(paper, it[0], { left: `${x + 50}px`, top: '500px', fontSize: '60px', color: it[1] });
        return { ln, lb };
      });
      return { paper, head, items };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.slide(st.paper, prog(t, s0 - .1, s0 + .4), 0, 60, { r: 1 });
      st.head.show(prog(t, s0 + .2, s0 + .9));
      st.items.forEach((it, i) => { const a = s0 + .9 + i * D * .22; it.ln.draw(prog(t, a, a + .5)); it.lb.show(prog(t, a + .3, a + .7)); });
    },
  });

  /* ---------- 板（値段ごとの注文） ---------- */
  K.boardMemo = () => ({
    build(box) {
      const { mk } = E();
      const paper = P().paper(box, { x: 300, y: 70, w: 1000, h: 860, rot: -1 });
      const W_ = E().W_;
      const head = W_.write(paper, '板 ＝ 値段ごとに並んだ注文', { left: '60px', top: '40px', fontSize: '46px', color: '#2b2b38' });
      const rows = [['', '503', '1,200'], ['', '502', '300'], ['', '501', '8,500'], ['4,000', '500', ''], ['200', '499', ''], ['9,800', '498', '']];
      const cells = rows.map((r, i) => {
        const y = 150 + i * 98;
        const row = mk(paper, { left: '80px', top: `${y}px`, width: '640px', height: '88px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center',
          textAlign: 'center', fontSize: '44px', borderBottom: '3px solid rgba(0,0,0,.15)' }, 'a zen',
          `<span style="color:#2f7ad6">${r[0]}</span><span style="color:#2b2b38">${r[1]}</span><span style="color:#e0312f">${r[2]}</span>`);
        return row;
      });
      const capL = mk(paper, { left: '80px', top: '740px', width: '213px', textAlign: 'center', fontSize: '32px', color: '#2f7ad6' }, 'a zen', '買い注文');
      const capR = mk(paper, { left: '506px', top: '740px', width: '213px', textAlign: 'center', fontSize: '32px', color: '#e0312f' }, 'a zen', '売り注文');
      const thick = P().circle(paper, 610, 390, 110, 46);
      const thickT = W_.write(paper, '厚い', { left: '760px', top: '360px', fontSize: '48px', color: '#e0312f' });
      const thin = P().circle(paper, 610, 292, 110, 46, { color: '#2f7ad6' });
      const thinT = W_.write(paper, '薄い', { left: '760px', top: '262px', fontSize: '48px', color: '#2f7ad6' });
      const card = P().card(box, '板の厚薄', '注文の厚さ・薄さ', { x: 1380, y: 330, w: 400, h: 300, num: '4' });
      return { paper, head, cells, capL, capR, thick, thickT, thin, thinT, card };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const s0 = ctx.cut.start;
      W.slide(st.paper, prog(t, s0 - .1, s0 + .4), 0, 60, { r: -1 });
      st.head.show(prog(t, s0 + .2, s0 + .9));
      st.cells.forEach((c, i) => W.fade(c, prog(t, s0 + .6 + i * .12, s0 + .9 + i * .12)));
      W.fade(st.capL, prog(t, s0 + 1.3, s0 + 1.6)); W.fade(st.capR, prog(t, s0 + 1.3, s0 + 1.6));
      st.thick.draw(prog(t, s0 + 1.8, s0 + 2.3)); st.thickT.show(prog(t, s0 + 2.1, s0 + 2.4));
      st.thin.draw(prog(t, s0 + 2.5, s0 + 3.0)); st.thinT.show(prog(t, s0 + 2.8, s0 + 3.1));
      W.slide(st.card, prog(t, s0 + 3.0, s0 + 3.5), 100, 0, { r: 3 });
    },
  });

  /* ---------- あの日の 100 万株に赤丸 ---------- */
  K.phoneQuestion = () => ({
    build(box) {
      const { mk } = E();
      const r = P().phoneStock(box, { name: 'ミライ製菓', code: '0000', price: '500<span style="font-size:40px">円</span>', change: '+80（+19.0%）', up: true, data: MIRAI, vol: MIRAI_VOL });
      r.chart.reveal(1);
      const v = mk(box, { left: '30px', top: '930px', padding: '4px 14px', borderRadius: '8px', background: '#fff3d6', color: '#c0392b', fontSize: '28px', whiteSpace: 'nowrap' }, 'a noto', '出来高 100万株（例）');
      v.style.fontWeight = 900;
      const c = P().circle(box, 170, 950, 160, 44);
      const q = mk(box, { left: '380px', top: '330px', fontSize: '170px', color: '#e0312f' }, 'a dela', '？');
      fakeNote(box, 330, 990);
      return { c, q };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      st.c.draw(prog(t, ctx.cut.start + .4, ctx.cut.start + 1.0));
      W.pop(st.q, prog(t, ctx.cut.start + 1.0, ctx.cut.start + 1.4), { r: 10 });
    },
  });


  /* ---------- チャートと板（誰がやった？は書いていない） ---------- */
  K.phoneWho = () => ({
    build(box) {
      const { mk } = E();
      box.style.background = '#fff';
      mk(box, { left: '30px', top: '96px', fontSize: '36px', color: '#222' }, 'a noto', 'ミライ製菓 <span style="font-size:20px;color:#999">チャート・板</span>').style.fontWeight = 900;
      const ch = E().W_.candles(box, 30, 160, 496, 300, MIRAI_FALL, { up: '#e0453a', down: '#2f7ad6', grid: 'rgba(0,0,0,.06)' });
      const low = mk(box, { left: '400px', top: '440px', padding: '2px 10px', background: '#2f7ad6', color: '#fff', borderRadius: '8px', fontSize: '20px', whiteSpace: 'nowrap' }, 'a noto', '安値更新');
      low.style.fontWeight = 900;
      ch.reveal(1);
      const board = mk(box, { left: '30px', top: '500px', width: '496px', height: '400px', border: '2px solid #e3e6ee', borderRadius: '14px', overflow: 'hidden' }, 'a');
      const rows = [['', '401', '3,200'], ['', '400', '1,800'], ['', '399', '900'], ['1,500', '398', ''], ['2,600', '397', ''], ['800', '396', '']];
      rows.forEach((r, i) => mk(board, { left: 0, top: `${i * 56 + 6}px`, width: '100%', height: '56px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center',
        textAlign: 'center', fontSize: '28px', borderBottom: '1px solid #eef0f4', fontWeight: 700 }, 'a noto',
        `<span style="color:#2f7ad6">${r[0]}</span><span style="color:#333">${r[1]}</span><span style="color:#e0312f">${r[2]}</span>`));
      mk(board, { left: 0, top: '346px', width: '100%', textAlign: 'center', fontSize: '22px', color: '#777' }, 'a noto', '板 ＝ 値段ごとの注文の並び');
      const bub = P().bubble(box, '誰がやった？', { x: 60, y: 170, size: 40 });
      const q = mk(box, { left: '330px', top: '150px', fontSize: '120px', color: '#e0312f' }, 'a dela', '？');
      fakeNote(box, 30, 975);
      return { ch, board, bub, q };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const s0 = ctx.cut.start;
      W.slide(st.board, prog(t, s0 + .2, s0 + .6), 0, 40);
      W.pop(st.bub, prog(t, s0 + .9, s0 + 1.3), { r: -3 });
      W.pop(st.q, prog(t, s0 + 1.5, s0 + 1.9), { r: 8 });
    },
  });

  /* ---------- 強制フロー：返済期限のカレンダーと、追証の警告 ---------- */
  K.forcedCalendar = () => ({
    build(box) {
      const { mk } = E();
      const cal = P().calendar(box, { x: 200, y: 90, w: 960, h: 730, title: '10月', firstDow: 3, days: 31, rot: 0 });
      const c1 = P().circle(box, ...cal.cell(20), 46, 40, { color: '#2f7ad6' });
      const c2 = P().circle(box, ...cal.cell(27), 46, 40, { color: '#2f7ad6' });
      const s1 = P().sticky(box, '信用買いの\n返済期限', { x: 1220, y: 70, w: 380, h: 220, size: 40 });
      const s2 = P().sticky(box, '空売りの\n返済期限', { x: 1260, y: 330, w: 380, h: 220, size: 40, color: '#ffd1dc' });
      const arrow = E().W_.arrow(box, 1260, 640, 1420, 860, { color: '#2f7ad6', width: 14 });
      const alert = mk(box, { left: '1460px', top: '640px', padding: '16px 30px', background: '#e0312f', color: '#fff', borderRadius: '16px', fontSize: '52px',
        boxShadow: '0 10px 20px rgba(120,0,0,.3)', whiteSpace: 'nowrap' }, 'a noto', '⚠ 追証');
      alert.style.fontWeight = 900;
      const alertNote = mk(box, { left: '1430px', top: '760px', fontSize: '26px', color: '#7a2a2a', whiteSpace: 'nowrap' }, 'a noto', '株価が下がると突然くる');
      alertNote.style.fontWeight = 900;
      const head = P().label(box, '強制フロー', '', { x: 960, y: 10, size: 36 });
      const [x20, y20] = cal.cell(20), [x27, y27] = cal.cell(27);
      const l1 = E().W_.arrow(box, 1220, 180, x20 + 50, y20 - 20, { color: '#e0a400', width: 6, head: 16 });
      const l2 = E().W_.arrow(box, 1260, 440, x27 + 50, y27 - 10, { color: '#e07a9b', width: 6, head: 16 });
      return { cal, c1, c2, s1, s2, arrow, alert, alertNote, head, l1, l2 };
    },
    update(t, ctx, st, W) {
      const { prog } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.fade(st.cal.el, prog(t, s0 - .1, s0 + .3));
      st.c1.draw(prog(t, s0 + .5, s0 + 1.0)); W.pop(st.s1, prog(t, s0 + .7, s0 + 1.1), { r: 4 }); st.l1.draw(prog(t, s0 + 1.0, s0 + 1.3));
      st.c2.draw(prog(t, s0 + 1.2, s0 + 1.7)); W.pop(st.s2, prog(t, s0 + 1.4, s0 + 1.8), { r: -3 }); st.l2.draw(prog(t, s0 + 1.7, s0 + 2.0));
      st.arrow.draw(prog(t, s0 + D * .55, s0 + D * .55 + .5));
      W.pop(st.alert, prog(t, s0 + D * .55 + .4, s0 + D * .55 + .8), { r: -4, x: Math.sin(t * 30) * 3 * (1 - prog(t, s0 + D * .55 + .8, s0 + D * .55 + 1.3)) });
      W.fade(st.alertNote, prog(t, s0 + D * .55 + .8, s0 + D * .55 + 1.1));
      W.pop(st.head, prog(t, s0 + .2, s0 + .6));
    },
  });

  /* ---------- 空売り：借りた株を先に売り、あとで買い戻して返す ---------- */
  K.boxShort = () => ({
    build(box) {
      const { mk } = E();
      const lender = mk(box, { left: '120px', top: '520px', width: '360px', height: '330px', background: '#5d7fa3', borderRadius: '24px 24px 0 0' }, 'a');
      mk(lender, { left: 0, top: '26px', width: '100%', textAlign: 'center', fontSize: '42px', color: '#fff' }, 'a noto', '貸してくれる人').style.fontWeight = 900;
      const market = mk(box, { left: '1440px', top: '520px', width: '360px', height: '330px', background: '#26365e', borderRadius: '24px 24px 0 0' }, 'a');
      mk(market, { left: 0, top: '26px', width: '100%', textAlign: 'center', fontSize: '50px', color: '#fff' }, 'a noto', '市場').style.fontWeight = 900;
      const bx = P().boxes(box, { cols: 3, rows: 1, cx: 300, bottom: 520, bw: 104, bh: 86, color: '#ffb0a8', label: '借' });
      const tag = mk(box, { left: '170px', top: '360px', padding: '4px 14px', background: '#e0312f', color: '#fff', borderRadius: '10px', fontSize: '28px', whiteSpace: 'nowrap' }, 'a noto', '返済期限つき');
      tag.style.fontWeight = 900;
      const a1 = E().W_.arrow(box, 520, 420, 1420, 420, { color: '#e0312f', width: 12, bend: -60 });
      const t1 = mk(box, { left: '820px', top: '280px', fontSize: '40px', color: '#e0312f', whiteSpace: 'nowrap' }, 'a noto', '① 先に売る');
      const a2 = E().W_.arrow(box, 1420, 700, 520, 700, { color: '#2f7ad6', width: 12, bend: -60 });
      const t2 = mk(box, { left: '760px', top: '770px', fontSize: '40px', color: '#2f7ad6', whiteSpace: 'nowrap' }, 'a noto', '② 買い戻して返す');
      [t1, t2].forEach(e => { e.style.fontWeight = 900; });
      const head = P().label(box, '空売り', '', { x: 960, y: 110, size: 44 });
      return { lender, market, bx, tag, a1, t1, a2, t2, head };
    },
    update(t, ctx, st, W) {
      const { prog, ease, T, lerp } = E();
      const s0 = ctx.cut.start, D = ctx.cut.end - s0;
      W.pop(st.head, prog(t, s0, s0 + .4));
      W.slide(st.lender, prog(t, s0, s0 + .4), -80, 0); W.slide(st.market, prog(t, s0 + .1, s0 + .5), 80, 0);
      W.pop(st.tag, prog(t, s0 + .5, s0 + .8));
      st.a1.draw(prog(t, s0 + .8, s0 + 1.4)); W.fade(st.t1, prog(t, s0 + 1.1, s0 + 1.4));
      const go = ease.inOut(prog(t, s0 + 1.0, s0 + 1.8));
      const back = ease.inOut(prog(t, s0 + D * .6, s0 + D * .6 + .8));
      st.bx.forEach((b, i) => T(b.el, { x: lerp(0, 1250 - b.x + i * 20, go) * (1 - back), y: -Math.sin(go * Math.PI) * 120 * (1 - back) + Math.sin(back * Math.PI) * 120 + (back > 0 ? 0 : 0), s: 1 }));
      st.a2.draw(prog(t, s0 + D * .55, s0 + D * .55 + .6)); W.fade(st.t2, prog(t, s0 + D * .55 + .3, s0 + D * .55 + .6));
    },
  });

  window.KIT = K;
})();
