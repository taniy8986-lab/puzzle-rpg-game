/* 物語の中の小道具（付箋・メモ用紙・赤丸・カレンダー・段ボール箱・ラベルカード・スマホの画面・吹き出し）。
 * content.js から window.PROPS.* で使う。座標は 1920x1080（スマホの中はスマホの画面の座標）。
 * 中身が用意されていないカットのために、screen の文から下書きの絵を作る fallback もここにある。
 */
(function () {
  'use strict';
  const P = {};
  const E = () => window.E;

  P.sticky = (parent, text, { x = 1460, y = 60, w = 360, h = 300, color = '#ffe680', rot = 4, size = 46, sub = '' } = {}) => {
    const { mk } = E();
    const el = mk(parent, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, background: color, transform: `rotate(${rot}deg)`,
      boxShadow: '0 12px 20px rgba(60,40,10,.25)', borderRadius: '4px 4px 18px 4px' }, 'a');
    mk(el, { left: `${w / 2 - 60}px`, top: '-18px', width: '120px', height: '36px', background: 'rgba(255,255,255,.55)', transform: 'rotate(-3deg)',
      boxShadow: '0 2px 4px rgba(0,0,0,.1)' }, 'a');
    mk(el, { left: '24px', top: '40px', width: `${w - 48}px`, fontSize: `${size}px`, lineHeight: 1.3, color: '#3b2c10', textAlign: 'center',
      whiteSpace: 'pre-line' }, 'a zen', text);
    if (sub) mk(el, { left: '20px', top: `${h - 66}px`, width: `${w - 40}px`, fontSize: '20px', color: '#6b5420', textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.3 }, 'a zen', sub);
    return el;
  };

  P.paper = (parent, { x = 460, y = 90, w = 1000, h = 860, rot = -1.2, lines = true } = {}) => {
    const { mk } = E();
    return mk(parent, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, background: '#fffdf7', transform: `rotate(${rot}deg)`,
      boxShadow: '0 22px 40px rgba(50,25,5,.35)', borderRadius: '6px',
      backgroundImage: lines ? 'linear-gradient(rgba(80,130,200,.18) 2px, transparent 2px)' : 'none', backgroundSize: '100% 62px', backgroundPosition: '0 40px' }, 'a');
  };

  // 手で描いたような楕円。draw(k)
  P.circle = (parent, cx, cy, rx, ry, { color = '#e0312f', width = 7 } = {}) => {
    const { svg } = E();
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const a = -Math.PI * .6 + i / 64 * Math.PI * 2.15;
      const wob = 1 + Math.sin(i * .9) * .03;
      pts.push([rx * wob * Math.cos(a) + rx + 20, ry * wob * Math.sin(a) + ry + 20]);
    }
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    const box = svg(parent, rx * 2 + 40, ry * 2 + 40, `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${len}"/>`,
      { left: `${cx - rx - 20}px`, top: `${cy - ry - 20}px` });
    box.className = 'a';
    const path = box.querySelector('path');
    return { el: box, draw(k) { path.setAttribute('stroke-dashoffset', len * (1 - Math.min(1, Math.max(0, k)))); } };
  };

  // 紺色のラベル（上に説明、下に黄色の数字）
  P.label = (parent, title, value, { x = 960, y = 150, size = 46, w = null } = {}) => {
    size *= 1.25;
    const { mk } = E();
    const el = mk(parent, { left: `${x}px`, top: `${y}px`, transform: 'translateX(-50%)', background: '#26365e', borderRadius: '18px',
      padding: '18px 40px 16px', textAlign: 'center', boxShadow: '0 10px 22px rgba(20,30,60,.25)', width: w ? `${w}px` : 'auto' }, 'a');
    el.innerHTML = `<div class="noto" style="font-weight:900;color:#fff;font-size:${size * .8}px;white-space:nowrap;line-height:1.3">${title}</div>` +
      (value ? `<div class="noto" style="font-weight:900;color:#ffd24a;font-size:${size * 1.25}px;white-space:nowrap;line-height:1.25">${value}</div>` : '');
    // translateX(-50%) を T() で上書きしないよう、外側の箱で包む
    const wrap = mk(parent, { left: 0, top: 0, width: '1px', height: '1px' }, 'a');
    wrap.appendChild(el);
    return wrap;
  };

  // 段ボール箱を積む。返り値は各箱 {el, x, y}
  P.boxes = (parent, { cols = 7, rows = 4, cx = 960, bottom = 850, bw = 124, bh = 102, gap = 4, label = '株', color = '#d8a46a', start = 0, count = null, kind = 'box' } = {}) => {
    const { mk } = E();
    const n = count ?? cols * rows;
    const out = [];
    const x0 = cx - (cols * (bw + gap) - gap) / 2;
    for (let i = 0; i < n; i++) {
      const c = i % cols, r = Math.floor(i / cols);
      const x = x0 + c * (bw + gap), y = bottom - (r + 1) * (bh + gap) + gap;
      const el = mk(parent, { left: `${x}px`, top: `${y}px`, width: `${bw}px`, height: `${bh}px`, background: kind === 'big' ? '#3c4f7d' : color,
        border: `3px solid ${kind === 'big' ? '#25335a' : '#a87a48'}`, borderRadius: '4px', boxShadow: 'inset 0 14px 0 rgba(0,0,0,.08)' }, 'a');
      mk(el, { left: '50%', top: '54%', transform: 'translate(-50%,-50%)', minWidth: `${bw * .42}px`, padding: '2px 6px', background: kind === 'big' ? '#ffffff' : '#fff6ea',
        borderRadius: '6px', color: kind === 'big' ? '#25335a' : '#d6392f', fontSize: `${bh * .3}px`, textAlign: 'center', whiteSpace: 'nowrap' }, 'a noto', label);
      el.firstChild.style.fontWeight = 900;
      out.push({ el, x, y, i, c, r });
    }
    return out;
  };

  // 紺のカード（見出し＋説明）
  P.card = (parent, head, body, { x = 200, y = 300, w = 380, h = 300, color = '#26365e', num = '' } = {}) => {
    const { mk } = E();
    const el = mk(parent, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, background: '#fff', borderRadius: '22px',
      boxShadow: '0 14px 28px rgba(40,30,20,.22)', overflow: 'hidden' }, 'a');
    mk(el, { left: 0, top: 0, width: '100%', height: '96px', background: color }, 'a');
    if (num) mk(el, { left: '20px', top: '18px', width: '60px', height: '60px', borderRadius: '50%', background: '#ffd24a', color: color, fontSize: '36px',
      textAlign: 'center', lineHeight: '60px' }, 'a noto', num).style.fontWeight = 900;
    mk(el, { left: num ? '94px' : '0', top: '20px', width: num ? `${w - 110}px` : '100%', textAlign: num ? 'left' : 'center', fontSize: '42px', color: '#fff',
      whiteSpace: 'nowrap' }, 'a noto', head).style.fontWeight = 900;
    mk(el, { left: '28px', top: '122px', width: `${w - 56}px`, fontSize: '36px', lineHeight: 1.4, color: '#2a2f45', whiteSpace: 'pre-line' }, 'a zen', body);
    return el;
  };

  // カレンダー。cell(day) で日付の中心座標を返す
  P.calendar = (parent, { x = 330, y = 40, w = 1000, h = 760, title = '', firstDow = 3, days = 31, rot = 0 } = {}) => {
    const { mk } = E();
    const el = mk(parent, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, background: '#fbfaf7', transform: `rotate(${rot}deg)`,
      boxShadow: '0 18px 36px rgba(50,30,10,.28)', borderRadius: '6px' }, 'a');
    for (let i = 0; i < 12; i++) mk(el, { left: `${60 + i * (w - 120) / 11}px`, top: '-12px', width: '14px', height: '30px', borderRadius: '7px', background: '#8a8a8a' }, 'a');
    mk(el, { left: '60px', top: '30px', fontSize: '60px', color: '#222' }, 'a noto', title).style.fontWeight = 900;
    const DOW = ['日', '月', '火', '水', '木', '金', '土'];
    const cw = (w - 120) / 7, top = 170, ch = (h - top - 50) / 6;
    DOW.forEach((d, i) => mk(el, { left: `${60 + i * cw}px`, top: `${top - 50}px`, width: `${cw}px`, textAlign: 'center', fontSize: '26px',
      color: i === 0 ? '#d6392f' : i === 6 ? '#2a8fbf' : '#666' }, 'a noto', d));
    const pos = {};
    for (let dd = 1; dd <= days; dd++) {
      const k = firstDow + dd - 1, c = k % 7, r = Math.floor(k / 7);
      const cx = 60 + c * cw + cw / 2, cy = top + r * ch + ch / 2;
      mk(el, { left: `${60 + c * cw}px`, top: `${top + r * ch + ch / 2 - 22}px`, width: `${cw}px`, textAlign: 'center', fontSize: '38px',
        color: c === 0 ? '#d6392f' : c === 6 ? '#2a8fbf' : '#333' }, 'a noto', String(dd)).style.fontWeight = 700;
      pos[dd] = [x + cx, y + cy];
    }
    return { el, cell: d => pos[d], cw, ch };
  };

  // 吹き出し
  P.bubble = (parent, text, { x = 1300, y = 180, size = 56, tail = 'left' } = {}) => {
    const { mk } = E();
    const el = mk(parent, { left: `${x}px`, top: `${y}px`, padding: '18px 34px', background: '#fff', border: '6px solid #1d1d28', borderRadius: '60px',
      fontSize: `${size}px`, color: '#1d1d28', whiteSpace: 'nowrap', boxShadow: '0 8px 0 rgba(0,0,0,.12)' }, 'a noto', text);
    el.style.fontWeight = 900;
    const tl = mk(el, { left: tail === 'left' ? '-26px' : 'auto', right: tail === 'left' ? 'auto' : '-26px', bottom: '8px', width: '44px', height: '30px' }, 'a',
      `<svg viewBox="0 0 44 30" width="44" height="30"><path d="${tail === 'left' ? 'M44 2 L2 26 L40 22' : 'M0 2 L42 26 L4 22'}" fill="#fff" stroke="#1d1d28" stroke-width="6" stroke-linejoin="round"/></svg>`);
    return el;
  };

  /* ---------- スマホの画面（白い UI、556x1016） ---------- */
  P.phoneNotify = (box, { time = '15:12', date = '', app = '株アラート', title = '', body = '' } = {}) => {
    const { mk } = E();
    box.style.background = 'linear-gradient(180deg, #ffe4dc 0%, #ffd2c8 100%)';
    mk(box, { left: 0, top: '120px', width: '100%', textAlign: 'center', fontSize: '28px', color: '#3a2a2a' }, 'a noto', date);
    mk(box, { left: 0, top: '160px', width: '100%', textAlign: 'center', fontSize: '120px', color: '#2a1d1d', lineHeight: 1.1 }, 'a noto', time).style.fontWeight = 700;
    const n = mk(box, { left: '30px', top: '340px', width: '496px', minHeight: '180px', background: 'rgba(255,255,255,.92)', borderRadius: '30px', padding: '24px 26px',
      boxShadow: '0 10px 24px rgba(0,0,0,.12)' }, 'a');
    n.innerHTML = `<div style="display:flex;align-items:center;gap:12px;font-size:22px;color:#777" class="noto"><span style="display:inline-block;width:40px;height:40px;border-radius:10px;background:#d6392f;color:#fff;text-align:center;line-height:40px;font-weight:900">株</span>${app}<span style="margin-left:auto">今</span></div>
      <div class="noto" style="font-size:28px;font-weight:900;color:#222;margin-top:14px">${title}</div>
      <div class="noto" style="font-size:28px;font-weight:700;color:#333;margin-top:6px;line-height:1.4">${body}</div>`;
    return n;
  };
  P.phoneStock = (box, { name = '', code = '', price = '', change = '', up = true, badge = '', note = '', data = null, vol = null } = {}) => {
    const { mk } = E();
    box.style.background = '#fff';
    mk(box, { left: '30px', top: '90px', fontSize: '22px', color: '#999' }, 'a noto', '‹ 銘柄');
    mk(box, { left: '30px', top: '130px', fontSize: '40px', color: '#222' }, 'a noto', `${name} <span style="font-size:22px;color:#999">${code}</span>`).style.fontWeight = 900;
    const pr = mk(box, { left: '30px', top: '190px', fontSize: '96px', color: up ? '#d6392f' : '#1d6fd6', lineHeight: 1.1 }, 'a noto', price);
    pr.style.fontWeight = 900;
    const ch = mk(box, { left: '34px', top: '306px', fontSize: '30px', color: up ? '#d6392f' : '#1d6fd6' }, 'a noto', change);
    let bd = null;
    if (badge) {
      bd = mk(box, { left: '30px', top: '360px', padding: '8px 26px', background: up ? '#d6392f' : '#1d6fd6', color: '#fff', borderRadius: '8px', fontSize: '36px' }, 'a noto', badge);
      bd.style.fontWeight = 900;
    }
    if (note) mk(box, { left: '30px', top: '440px', fontSize: '22px', color: '#999' }, 'a noto', note);
    let chart = null;
    if (data) chart = E().W_.candles(box, 30, 500, 496, 300, data, { up: '#e0453a', down: '#2f7ad6', vol, volH: 120, volColor: 'rgba(120,140,170,.55)', grid: 'rgba(0,0,0,.06)' });
    return { price: pr, change: ch, badge: bd, chart };
  };
  P.phoneSNS = (box, posts = []) => {
    const { mk } = E();
    box.style.background = '#fff';
    mk(box, { left: 0, top: '90px', width: '100%', textAlign: 'center', fontSize: '30px', color: '#222' }, 'a noto', 'タイムライン').style.fontWeight = 900;
    return posts.map((p, i) => {
      const el = mk(box, { left: '24px', top: `${160 + i * 270}px`, width: '508px', height: '250px', background: '#fff', borderRadius: '18px', border: '2px solid #eee',
        padding: '18px 22px' }, 'a');
      el.innerHTML = `<div style="display:flex;align-items:center;gap:12px" class="noto"><span style="width:52px;height:52px;border-radius:50%;background:${p.color || '#7bc4c4'};display:inline-block"></span>
        <span style="font-size:24px;font-weight:900;color:#222">${p.name || ''}</span><span style="font-size:18px;color:#999">${p.id || ''}</span></div>
        <div class="noto" style="font-size:27px;font-weight:700;color:#222;margin-top:12px;line-height:1.45">${p.text || ''}</div>
        <div class="noto" style="font-size:20px;color:#e0453a;margin-top:10px">♥ ${p.likes || ''}</div>`;
      return el;
    });
  };

  /* ---------- 下書き（screen の文から） ---------- */
  const split = s => String(s).split(/[／\n]|(?:\s*\/\s*)/).map(x => x.trim()).filter(Boolean);
  P.fallback = (type, screen) => {
    const { W_, prog, ease, T, clamp } = E();
    if (type === 'sticky') return {
      build(box) { return { s: P.sticky(box, screen.replace(/\s+/, '\n'), { x: 760, y: 300, w: 420, h: 380, size: 52, rot: -3 }) }; },
      update(t, ctx, st) { W_.pop(st.s, ctx.k(t, 0, .5)); },
    };
    if (type === 'memo') return {
      build(box) {
        const paper = P.paper(box);
        const items = split(screen);
        const ws = items.map((it, i) => W_.write(paper, it, { left: '70px', top: `${70 + i * 124}px`, fontSize: '50px', color: '#2b2b38', width: '860px', whiteSpace: 'pre-wrap' }));
        return { paper, ws };
      },
      update(t, ctx, st) {
        const D = ctx.cut.end - ctx.cut.start;
        W_.slide(st.paper, ctx.k(t, 0, .5, -.2), 0, 60);
        st.ws.forEach((w, i) => w.show(prog(t, ctx.cut.start + .4 + i * (D * .7 / st.ws.length), ctx.cut.start + .4 + (i + 1) * (D * .7 / st.ws.length))));
      },
    };
    if (type === 'cards') return {
      build(box) {
        const items = split(screen).slice(0, 4);
        const n = items.length, w = Math.min(420, 1600 / n - 30);
        const cards = items.map((it, i) => {
          const [h, ...b] = it.split(/[：:＝=]/);
          return P.card(box, h.trim(), b.join('：').trim(), { x: 960 - (n * (w + 30) - 30) / 2 + i * (w + 30), y: 260, w, h: 420, num: String(i + 1) });
        });
        return { cards };
      },
      update(t, ctx, st) {
        const D = ctx.cut.end - ctx.cut.start;
        st.cards.forEach((c, i) => W_.slide(c, prog(t, ctx.cut.start + .2 + i * D * .18, ctx.cut.start + .7 + i * D * .18), 0, 80));
      },
    };
    if (type === 'compare') return {
      build(box) {
        const parts = String(screen).split(/\s*(?:vs|VS|／|\/|｜)\s*/);
        const a = parts[0] || '', b = parts[1] || '';
        const L = P.card(box, 'A', a, { x: 170, y: 200, w: 740, h: 560, color: '#d6392f' });
        const R = P.card(box, 'B', b, { x: 1010, y: 200, w: 740, h: 560, color: '#26365e' });
        return { L, R };
      },
      update(t, ctx, st) { W_.slide(st.L, ctx.k(t, 0, .5), -80, 0); W_.slide(st.R, ctx.k(t, 0, .5, .3), 80, 0); },
    };
    if (type === 'boxes') return {
      build(box) {
        const bx = P.boxes(box, {});
        const lab = P.label(box, screen.slice(0, 22), '', { y: 140 });
        return { bx, lab };
      },
      update(t, ctx, st) {
        st.bx.forEach((b, i) => { const k = prog(t, ctx.cut.start + .1 + i * .03, ctx.cut.start + .45 + i * .03); T(b.el, { y: (1 - ease.out(k)) * -300, o: clamp(k * 3) }); });
        W_.pop(st.lab, ctx.k(t, 0, .5));
      },
    };
    if (type === 'calendar') return {
      build(box) {
        const cal = P.calendar(box, { title: '' });
        const st = P.sticky(box, screen, { x: 1380, y: 120, w: 400, h: 320, size: 38 });
        return { cal, st };
      },
      update(t, ctx, st) { W_.fade(st.cal.el, ctx.k(t, 0, .4, -.2)); W_.pop(st.st, ctx.k(t, 0, .5, .3)); },
    };
    if (type === 'phone') return {
      build(box) {
        const s = String(screen);
        const body = s.replace(/^(通知|株価|SNS|ニュース)[:：]\s*/, '');
        if (/^通知/.test(s)) return { el: P.phoneNotify(box, { title: body.slice(0, 18), body: body.slice(18) }) };
        if (/^SNS/.test(s)) return { el: P.phoneSNS(box, split(body).slice(0, 3).map((x, i) => ({ name: ['株クラ・まめ', 'はじめて投資', '急騰ウォッチ'][i % 3], text: x, likes: 120 + i * 77 })))[0] };
        return { el: P.phoneStock(box, { name: body.slice(0, 12), price: '' }).price };
      },
      update() {},
    };
    return { build() { return {}; }, update() {} };
  };

  window.PROPS = P;
})();
