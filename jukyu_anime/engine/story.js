/* ストーリーアニメ用エンジン
 *
 * episodes/epXX/index.html が次の順に読み込む:
 *   build/epXX/timeline.js  … 声の長さから作った時刻表（window.EP）。各セリフに shot（カット）が付く
 *   episodes/epXX/content.js … スマホ・タブレット・ノート・イメージ映像の中身（window.EP_CONTENT など）
 *   engine/backgrounds.js    … 場所の背景
 *   engine/story.js          … このファイル
 * window.renderFrame(t) が t 秒の 1 コマを描く。乱数や現在時刻は使わない。
 */
(function () {
  'use strict';
  const W = 1920, H = 1080;

  /* ---------- 数学・イージング ---------- */
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const ease = {
    lin: k => k,
    out: k => 1 - Math.pow(1 - k, 3),
    quint: k => 1 - Math.pow(1 - k, 5),
    inOut: k => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    sine: k => .5 - Math.cos(k * Math.PI) / 2,
    in: k => k * k * k,
    back: k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
    backSoft: k => { const c1 = 1.1, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
  };
  const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  /* ---------- DOM ---------- */
  function mk(parent, style = {}, cls = 'a', html = '') {
    const e = document.createElement('div');
    if (cls) e.className = cls;
    Object.assign(e.style, style);
    if (html) e.innerHTML = html;
    parent.appendChild(e);
    return e;
  }
  function pic(parent, src, style = {}, cls = 'a') {
    const e = document.createElement('img');
    e.src = src; e.className = cls; e.decoding = 'sync';
    Object.assign(e.style, style);
    parent.appendChild(e);
    return e;
  }
  function svg(parent, w, h, inner, style = {}) {
    const box = mk(parent, Object.assign({ width: `${w}px`, height: `${h}px` }, style));
    box.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="overflow:visible">${inner}</svg>`;
    return box;
  }
  function T(e, { x = 0, y = 0, s = 1, sx = null, sy = null, r = 0, o = 1 } = {}) {
    e.style.transform = `translate(${x}px,${y}px) rotate(${r}deg) scale(${sx ?? s},${sy ?? s})`;
    e.style.opacity = o;
  }
  const show = (e, v) => { e.style.display = v ? '' : 'none'; };

  /* ---------- キャラ素材 ---------- */
  const CHARA = '../../assets/chara_o/';   // 白いフチを焼き込んだ版（tools/outline.py）
  const FACE_ALIAS = {
    mina: { pout: 'troubled', normal: 'smile', happy: 'smile', sad: 'teary', cry: 'teary', angry: 'troubled', worried: 'troubled' },
    bull: { normal: 'smile', happy: 'smile', calm: 'relax', tired: 'sleepy', troubled: 'sad', worried: 'sad' },
    oji: { angry: 'hot', serious: 'normal', think: 'normal', sad: 'troubled', excited: 'hot', wink: 'smile', grin: 'smile' },
  };
  const FACES = {
    mina: ['smile', 'grin', 'wink', 'excited', 'sparkle', 'shy', 'think', 'surprised', 'burger', 'troubled', 'sleepy', 'teary', 'eat', 'fight', 'relax', 'thanks'],
    bull: ['smile', 'grin', 'wink', 'excited', 'sparkle', 'smug', 'think', 'surprised', 'puzzled', 'sleepy', 'sad', 'cry', 'shy', 'angry', 'fist', 'relax', 'tea', 'wave'],
    oji: ['normal', 'smile', 'hot', 'surprised', 'troubled', 'fist'],
  };
  const DEFAULT_EXPR = { mina: 'smile', bull: 'smile', oji: 'normal' };
  function faceFile(who, expr) {
    let e = (FACE_ALIAS[who] && FACE_ALIAS[who][expr]) || expr;
    if (!FACES[who] || !FACES[who].includes(e)) e = DEFAULT_EXPR[who] || 'smile';
    if (who === 'bull' && (e === 'tea' || e === 'wave')) return `${CHARA}bull/${e}.png`;
    return `${CHARA}${who}/face_${e}.png`;
  }
  // 全身の絵。facing は元の絵が向いている向き
  const BODY = {
    mina: { front: [0.291, null], side: [0.246, 'right'], back: [0.292, null], chibi: [0.612, null] },
    bull: { front: [0.281, null], side: [0.243, 'left'], back: [0.231, null], chibi: [0.617, null] },
    oji: { front: [0.488, null], side: [0.275, 'left'], back: [0.473, null] },
  };
  const BODY_H = { mina: 640, bull: 700, oji: 830 };
  const CHIBI_H = { mina: 520, bull: 560, oji: 600 };
  const NAME = { mina: 'ミナ', bull: 'ブルちゃん', oji: '押し目おじさん', narr: '' };
  const COLOR = {
    mina: { main: '#ef6f93', deep: '#c84a70' },
    bull: { main: '#2f5ea8', deep: '#1d3766' },
    oji: { main: '#d62839', deep: '#13287a' },
    narr: { main: '#5d6b82', deep: '#36425a' },
  };
  const SIDE = { mina: -1, bull: 0, oji: 1 };   // 画面の中での定位置（左 -1 … 右 +1）

  /* ---------- スタイル ---------- */
  const F = '../../../';
  const style = document.createElement('style');
  style.textContent = `
  @font-face { font-family: "Round"; src: url(${F}bull_chan/assets/fonts/MPLUSRounded1c-500.ttf); font-weight: 500; }
  @font-face { font-family: "Round"; src: url(${F}bull_chan/assets/fonts/MPLUSRounded1c-800.ttf); font-weight: 800; }
  @font-face { font-family: "Zen"; src: url(${F}bull_chan/assets/fonts/ZenMaruGothic-700.ttf); font-weight: 700; }
  @font-face { font-family: "Zen"; src: url(${F}bull_chan/assets/fonts/ZenMaruGothic-900.ttf); font-weight: 900; }
  @font-face { font-family: "Dela"; src: url(${F}eve_jiji/assets/fonts/DelaGothicOne.ttf); }
  @font-face { font-family: "Noto"; src: url(${F}eve_jiji/assets/fonts/NotoSansJP-700.ttf); font-weight: 700; }
  @font-face { font-family: "Noto"; src: url(${F}eve_jiji/assets/fonts/NotoSansJP-900.ttf); font-weight: 900; }
  html, body { margin: 0; background: #000; }
  #stage { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; background: #000;
    font-family: "Round", sans-serif; font-weight: 800; color: #1d3766; }
  #stage div, #stage img, #stage span, #stage svg { box-sizing: border-box; }
  .a { position: absolute; transform-origin: 50% 50%; }
  .layer { position: absolute; inset: 0; }
  .zen { font-family: "Zen", sans-serif; font-weight: 900; }
  .dela { font-family: "Dela", sans-serif; font-weight: 400; }
  .noto { font-family: "Noto", sans-serif; }
  .nowrap { white-space: nowrap; }
  .sticker { }
  .body { }
  .pill { display: inline-block; border-radius: 999px; white-space: nowrap; }
  .card { background: #fff; border-radius: 22px; box-shadow: 0 10px 26px rgba(29,55,102,.16), 0 2px 5px rgba(29,55,102,.08); }
  .chip { position: absolute; width: 46px; height: 30px; border-radius: 7px; background: linear-gradient(#fffaf0, #f3e3c4);
          border: 3px solid #b88a3c; box-shadow: 0 3px 0 #8f6a2b; font-family: "Zen"; font-weight: 900; font-size: 17px;
          color: #8f6a2b; text-align: center; line-height: 24px; }
  .q { color: #ffe066; }
  `;
  document.head.appendChild(style);

  const stage = document.getElementById('stage');
  const EP = window.EP;
  const LINES = EP.lines;
  // 章ごとの content.js から、カットの指定を上書きできる（例：{ '01_05': { type: 'imagine' } }）
  Object.entries(window.EP_SHOT || {}).forEach(([id, o]) => { const l = LINES.find(x => x.id === id); if (l) l.shot = Object.assign({}, l.shot, o); });
  const SCENES = EP.scenes;
  const lineEnd = l => l.start + l.dur;
  const SFX = [];
  const sfx = (name, time, gain = 1, pan = 0) => { SFX.push({ name, time: Math.round(time * 1000) / 1000, gain, pan }); };

  /* ---------- 小道具（content.js から使う） ---------- */
  const W_ = {};
  W_.text = (parent, html, st = {}, cls = 'a zen') => mk(parent, Object.assign({ whiteSpace: 'nowrap' }, st), cls, html);
  W_.pill = (parent, html, st = {}) => mk(parent, Object.assign({ fontSize: '30px', padding: '8px 26px', background: '#1d3766', color: '#fff' }, st), 'a pill zen', html);
  W_.card = (parent, st = {}) => mk(parent, st, 'a card');
  W_.line = (parent, pts, { color = '#1d3766', width = 7, glow = false } = {}) => {
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const minx = Math.min(...xs) - 20, miny = Math.min(...ys) - 20;
    const w = Math.max(...xs) - minx + 40, h = Math.max(...ys) - miny + 40;
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0] - minx} ${p[1] - miny}`).join(' ');
    const box = svg(parent, w, h, `${glow ? `<path d="${d}" fill="none" stroke="${color}" stroke-opacity=".25" stroke-width="${width * 3}" stroke-linecap="round" stroke-linejoin="round" class="g" stroke-dasharray="${len}" stroke-dashoffset="${len}"/>` : ''}
      <path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" class="m" stroke-dasharray="${len}" stroke-dashoffset="${len}"/>`,
      { left: `${minx}px`, top: `${miny}px` });
    box.className = 'a';
    const paths = [...box.querySelectorAll('path')];
    return { el: box, len, draw(k) { paths.forEach(p => p.setAttribute('stroke-dashoffset', len * (1 - clamp(k)))); },
      tip(k) {
        let rem = len * clamp(k);
        for (let i = 1; i < pts.length; i++) {
          const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
          if (rem <= seg) { const f = seg ? rem / seg : 0; return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; }
          rem -= seg;
        }
        return pts[pts.length - 1];
      } };
  };
  W_.arrow = (parent, x1, y1, x2, y2, { color = '#d62839', width = 8, bend = 0, head = 22 } = {}) => {
    const minx = Math.min(x1, x2) - 60, miny = Math.min(y1, y2) - 60 - Math.abs(bend);
    const w = Math.abs(x2 - x1) + 120, h = Math.abs(y2 - y1) + 120 + Math.abs(bend) * 2;
    const ax = x1 - minx, ay = y1 - miny, bx = x2 - minx, by = y2 - miny;
    const nl = Math.max(1, Math.hypot(bx - ax, by - ay));
    const mx = (ax + bx) / 2 - (by - ay) * bend / nl, my = (ay + by) / 2 + (bx - ax) * bend / nl;
    const ang = Math.atan2(by - my, bx - mx);
    const hx1 = bx - head * Math.cos(ang - .45), hy1 = by - head * Math.sin(ang - .45);
    const hx2 = bx - head * Math.cos(ang + .45), hy2 = by - head * Math.sin(ang + .45);
    const len = Math.hypot(mx - ax, my - ay) + Math.hypot(bx - mx, by - my);
    const box = svg(parent, w, h, `<path class="s" d="M${ax} ${ay} Q${mx} ${my} ${bx} ${by}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-dasharray="${len + 4}" stroke-dashoffset="${len + 4}"/>
      <path class="h" d="M${hx1} ${hy1} L${bx} ${by} L${hx2} ${hy2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`,
      { left: `${minx}px`, top: `${miny}px` });
    box.className = 'a';
    const s = box.querySelector('.s'), hd = box.querySelector('.h');
    return { el: box, draw(k) { s.setAttribute('stroke-dashoffset', (len + 4) * (1 - clamp(k))); hd.setAttribute('opacity', prog(k, .85, 1)); } };
  };
  W_.chip = (parent, x, y, label = '株') => mk(parent, { left: `${x}px`, top: `${y}px` }, 'chip', label);
  const PERSON_COL = { indiv: '#4aa3df', day: '#f39c12', short: '#8e44ad', big: '#16a085', honzon: '#e74c3c', long: '#5d7fa3', gray: '#9aa5b5', margin: '#e67e22', glow: '#bcd3ff' };
  W_.person = (parent, x, y, kind = 'indiv', size = 70, label = '', labelColor = '#fff') => {
    const c = PERSON_COL[kind] || kind;
    const box = svg(parent, size, size * 1.25, `
      <circle cx="${size / 2}" cy="${size * .3}" r="${size * .22}" fill="${c}"/>
      <path d="M${size * .1} ${size * 1.2} Q${size * .1} ${size * .58} ${size / 2} ${size * .58} Q${size * .9} ${size * .58} ${size * .9} ${size * 1.2} Z" fill="${c}"/>
      ${kind === 'honzon' ? `<path d="M${size * .26} ${size * .1} L${size * .34} ${-size * .06} L${size * .5} ${size * .06} L${size * .66} ${-size * .06} L${size * .74} ${size * .1} Z" fill="#f2b632"/>` : ''}`,
      { left: `${x}px`, top: `${y}px` });
    box.className = 'a';
    if (label) mk(box, { left: '50%', top: `${size * 1.3}px`, transform: 'translateX(-50%)', fontSize: `${Math.max(18, Math.round(size * .3))}px`, whiteSpace: 'nowrap', color: labelColor }, 'a zen', label);
    return box;
  };
  W_.lantern = (parent, x, y, size = 60, big = false) => {
    const s = size;
    const box = svg(parent, s, s * 1.5, `
      <circle cx="${s / 2}" cy="${s * .72}" r="${s * .9}" fill="${big ? 'rgba(255,120,80,.25)' : 'rgba(255,170,90,.22)'}"/>
      <rect x="${s * .3}" y="0" width="${s * .4}" height="${s * .12}" rx="2" fill="#333"/>
      <ellipse cx="${s / 2}" cy="${s * .72}" rx="${s * .46}" ry="${s * .6}" fill="${big ? '#e74c3c' : '#ff8a50'}" stroke="#7a2a12" stroke-width="3"/>
      ${[.42, .62, .82, 1.02].map(yy => `<path d="M${s * .08} ${s * yy} Q${s / 2} ${s * (yy + .07)} ${s * .92} ${s * yy}" stroke="#7a2a12" stroke-width="2" fill="none" opacity=".6"/>`).join('')}
      <rect x="${s * .3}" y="${s * 1.3}" width="${s * .4}" height="${s * .12}" rx="2" fill="#333"/>`,
      { left: `${x}px`, top: `${y}px` });
    box.className = 'a';
    return box;
  };
  W_.stamp = (parent, x, y, kind = 'o', size = 120) => {
    const col = kind === 'o' ? '#d62839' : '#1d3766';
    const inner = kind === 'o'
      ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size * .38}" fill="none" stroke="${col}" stroke-width="${size * .12}"/>`
      : `<path d="M${size * .18} ${size * .18} L${size * .82} ${size * .82} M${size * .82} ${size * .18} L${size * .18} ${size * .82}" stroke="${col}" stroke-width="${size * .13}" stroke-linecap="round"/>`;
    const box = svg(parent, size, size, inner, { left: `${x}px`, top: `${y}px` });
    box.className = 'a';
    return box;
  };
  W_.counter = (el, from, to, k, fmt = v => Math.round(v).toLocaleString('ja-JP')) => { el.textContent = fmt(lerp(from, to, clamp(k))); };
  W_.pop = (el, k, base = {}) => { const e = ease.back(clamp(k)); T(el, Object.assign({ s: Math.max(0, e), o: clamp(k * 3) }, base)); };
  W_.slide = (el, k, dx = 0, dy = 40, base = {}) => {
    const e = ease.quint(clamp(k));
    T(el, Object.assign({}, base, { x: (base.x || 0) + dx * (1 - e), y: (base.y || 0) + dy * (1 - e), o: clamp(k * 2.2) * (base.o ?? 1) }));
  };
  W_.fade = (el, k) => { el.style.opacity = clamp(k); };
  // ローソク足チャート（SVG）。data は [始値, 高値, 安値, 終値] の配列。reveal(k) で左から描く
  W_.candles = (parent, x, y, w, h, data, { lo = null, hi = null, up = '#ff5a5a', down = '#4aa3ff', vol = null, volH = 0, volColor = 'rgba(120,200,255,.7)', grid = 'rgba(255,255,255,.08)' } = {}) => {
    const vals = data.flat();
    const L = lo ?? Math.min(...vals), Hh = hi ?? Math.max(...vals);
    const n = data.length, cw = w / n;
    const Y = v => h - (v - L) / (Hh - L) * h;
    const vmax = vol ? Math.max(...vol) : 1;
    let inner = Array.from({ length: 5 }, (_, i) => `<line x1="0" x2="${w}" y1="${h * i / 4}" y2="${h * i / 4}" stroke="${grid}" stroke-width="2"/>`).join('');
    data.forEach((c, i) => {
      const [o, hi2, lo2, cl] = c;
      const col = cl >= o ? up : down;
      const cx = i * cw + cw / 2;
      inner += `<g class="c" opacity="0"><line x1="${cx}" x2="${cx}" y1="${Y(hi2)}" y2="${Y(lo2)}" stroke="${col}" stroke-width="${Math.max(2, cw * .12)}"/>
        <rect x="${cx - cw * .32}" y="${Math.min(Y(o), Y(cl))}" width="${cw * .64}" height="${Math.max(3, Math.abs(Y(o) - Y(cl)))}" rx="2" fill="${col}"/>
        ${vol ? `<rect x="${cx - cw * .32}" y="${h + 20 + volH - vol[i] / vmax * volH}" width="${cw * .64}" height="${vol[i] / vmax * volH}" fill="${typeof volColor === 'function' ? volColor(i) : volColor}"/>` : ''}</g>`;
    });
    const box = svg(parent, w, h + (vol ? volH + 20 : 0), inner, { left: `${x}px`, top: `${y}px` });
    box.className = 'a';
    const gs = [...box.querySelectorAll('.c')];
    return { el: box, Y, cw, n, reveal(k) { const m = k * n; gs.forEach((g, i) => g.setAttribute('opacity', clamp(m - i))); } };
  };
  W_.marker = (parent, x, y, w, color = 'rgba(242,182,50,.55)', h = 22) => mk(parent, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`,
    background: color, borderRadius: '6px', transformOrigin: '0 50%' }, 'a');
  // 手書き風に 1 文字ずつ出す文字
  W_.write = (parent, text, st = {}) => {
    const el = mk(parent, Object.assign({ whiteSpace: 'pre', fontFamily: '"Zen"', fontWeight: 700 }, st), 'a');
    const spans = [...text].map(ch => { const s = document.createElement('span'); s.textContent = ch; s.style.visibility = 'hidden'; el.appendChild(s); return s; });
    return { el, spans, show(k) { const m = Math.ceil(spans.length * clamp(k)); spans.forEach((s, i) => { s.style.visibility = i < m ? 'visible' : 'hidden'; }); } };
  };

  window.E = { W, H, clamp, lerp, prog, ease, hash, mk, pic, svg, T, show, W_: W_, sfx, COLOR, NAME, faceFile, CHARA };

  /* ---------- 画面の層 ---------- */
  const shotRoot = mk(stage, { left: 0, top: 0, width: `${W}px`, height: `${H}px`, transformOrigin: '50% 50%' }, 'a');
  const bgHost = mk(shotRoot, {}, 'layer');
  const veil = mk(shotRoot, { background: 'rgba(250,244,236,1)', opacity: 0 }, 'layer');
  const bodyLayer = mk(shotRoot, {}, 'layer');
  const bustLayer = mk(shotRoot, {}, 'layer');
  const deviceLayer = mk(shotRoot, {}, 'layer');
  const chibiLayer = mk(shotRoot, {}, 'layer');
  const titleLayer = mk(shotRoot, {}, 'layer');
  const fxLayer = mk(stage, {}, 'layer');
  const cutLayer = mk(stage, { zIndex: 8 }, 'layer');
  const subLayer = mk(stage, { zIndex: 9 }, 'layer');
  const transLayer = mk(stage, { zIndex: 10, background: '#000' }, 'layer');
  const eyeLayer = mk(stage, { zIndex: 11 }, 'layer');
  const introLayer = mk(stage, { zIndex: 12 }, 'layer');
  const outroLayer = mk(stage, { zIndex: 12 }, 'layer');

  /* ---------- 背景 ---------- */
  const BG = {};
  Object.entries(window.BACKGROUNDS).forEach(([id, fn]) => {
    const b = fn(bgHost);
    show(b.el, false);
    BG[id] = b;
  });
  const bgId = id => (BG[id] ? id : 'cafe');
  function placeBg(place) {
    const p = place || '';
    if (/部屋/.test(p)) return /朝/.test(p) ? 'room_morning' : 'room_night';
    if (/喫茶|押し目|カウンター|テーブル/.test(p)) return (/夜/.test(p) ? 'cafe_night' : 'cafe').replace('cafe', /祭/.test(p) ? 'cafe_fest' : 'cafe');
    if (/公園/.test(p)) return 'park_dusk';
    if (/祭/.test(p)) return 'festival';
    if (/商店街|駅|街/.test(p)) return 'street';
    if (/回想|余白/.test(p)) return 'wall';
    return null;
  }

  /* ---------- 全身のキャラ ---------- */
  const bodies = {};
  ['mina', 'bull', 'oji'].forEach(who => {
    const wrap = mk(bodyLayer, { left: 0, top: 0, width: '1px', height: '1px', transformOrigin: '0 0' }, 'a');
    const flip = mk(wrap, { left: 0, top: 0, width: '1px', height: '1px', transformOrigin: '0 0' }, 'a');
    const img = pic(flip, `${CHARA}${who}/front.png`, { left: 0, top: 0 }, 'a body');
    const shadow = mk(wrap, { left: '-90px', top: '-18px', width: '180px', height: '36px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,.28), rgba(0,0,0,0) 70%)' }, 'a');
    bodies[who] = { wrap, flip, img, shadow, src: '' };
  });

  /* ---------- バストアップ（2 枠） ---------- */
  function bustSlot() {
    const wrap = mk(bustLayer, { left: 0, top: 0, width: '1px', height: '1px', transformOrigin: '0 100%' }, 'a');
    const a = pic(wrap, '', { left: 0, bottom: 0, transform: 'translateX(-50%)' }, 'a sticker');
    const b = pic(wrap, '', { left: 0, bottom: 0, transform: 'translateX(-50%)' }, 'a sticker');
    return { wrap, a, b, sa: '', sb: '' };
  }
  const busts = [bustSlot(), bustSlot()];

  /* ---------- 端末（スマホ・タブレット・ノート）とイメージ映像の器 ---------- */
  const dim = mk(deviceLayer, { inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(10,15,35,.35), rgba(10,15,35,.75))' }, 'layer');
  const phone = mk(deviceLayer, { left: `${W / 2 - 300}px`, top: '40px', width: '600px', height: '1060px', borderRadius: '70px', background: '#111',
    boxShadow: '0 30px 60px rgba(0,0,0,.5), inset 0 0 0 4px #333' }, 'a');
  const phoneScreen = mk(phone, { left: '22px', top: '22px', width: '556px', height: '1016px', borderRadius: '52px', overflow: 'hidden', background: '#fff' }, 'a');
  const shoulder = pic(deviceLayer, `${CHARA}mina/back.png`, { left: '-120px', top: '560px', height: '2300px', filter: 'brightness(.9)' }, 'a');
  mk(phone, { left: '230px', top: '34px', width: '140px', height: '34px', borderRadius: '20px', background: '#000' }, 'a');
  const tablet = mk(deviceLayer, { left: '210px', top: '70px', width: '1500px', height: '940px', borderRadius: '50px', background: '#1a1a1f',
    boxShadow: '0 30px 60px rgba(0,0,0,.45), inset 0 0 0 4px #333' }, 'a');
  const tabletScreen = mk(tablet, { left: '30px', top: '30px', width: '1440px', height: '880px', borderRadius: '24px', overflow: 'hidden', background: '#0f1a33' }, 'a');
  const notebook = mk(deviceLayer, { left: '260px', top: '40px', width: '1400px', height: '1000px', borderRadius: '12px', background: '#fffdf6',
    boxShadow: '0 30px 60px rgba(0,0,0,.4)', overflow: 'hidden',
    backgroundImage: 'linear-gradient(rgba(70,130,200,.22) 2px, transparent 2px)', backgroundSize: '100% 64px', backgroundPosition: '0 30px' }, 'a');
  mk(notebook, { left: '120px', top: 0, width: '3px', height: '100%', background: 'rgba(214,40,57,.35)' }, 'a');
  const notebookPage = mk(notebook, { inset: 0 }, 'layer');
  const imagineHost = mk(deviceLayer, {}, 'layer');
  const propHost = mk(shotRoot, {}, 'layer');
  const PROP_TYPES = ['memo', 'calendar', 'boxes', 'compare', 'cards', 'sticky', 'memory', 'table'];
  const DEVICE_HOST = { phone: phoneScreen, tablet: tabletScreen, notebook: notebookPage, imagine: imagineHost };
  PROP_TYPES.forEach(k => { DEVICE_HOST[k] = propHost; });

  /* ---------- ちびキャラ ---------- */
  const chibiBg = mk(chibiLayer, { inset: 0 }, 'layer');
  const chibiRays = svg(chibiLayer, W, H, Array.from({ length: 24 }, (_, i) => {
    const a = i / 24 * Math.PI * 2, a2 = a + Math.PI / 24;
    return `<path d="M${W / 2} ${H / 2} L${W / 2 + Math.cos(a) * 1600} ${H / 2 + Math.sin(a) * 1600} L${W / 2 + Math.cos(a2) * 1600} ${H / 2 + Math.sin(a2) * 1600} Z" fill="rgba(255,255,255,.35)"/>`;
  }).join(''), { left: 0, top: 0 });
  chibiRays.className = 'a';
  const chibiImg = pic(chibiLayer, '', { left: `${W / 2}px`, bottom: '170px', height: '660px', transform: 'translateX(-50%)' }, 'a sticker');
  const FOOD_SVG = {
    takoyaki: `<svg viewBox="0 0 120 120" width="120" height="120"><path d="M10 70 L110 70 L96 98 L24 98 Z" fill="#d9b27a" stroke="#8a6a3a" stroke-width="4"/>
      ${[[30, 58], [52, 52], [74, 52], [96, 58], [41, 40], [63, 36], [85, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="#c98a3a" stroke="#7a4a1a" stroke-width="3"/><path d="M${x - 9} ${y - 3} q9 -8 18 0" stroke="#5a2a10" stroke-width="5" fill="none"/>`).join('')}
      <path d="M30 45 q30 -14 60 0" stroke="#7bc47b" stroke-width="3" fill="none" stroke-dasharray="3 5"/></svg>`,
    ringoame: `<svg viewBox="0 0 120 120" width="120" height="120"><rect x="56" y="70" width="8" height="46" rx="3" fill="#e8d3a8"/>
      <circle cx="60" cy="50" r="34" fill="#e0233a"/><path d="M60 16 q6 -10 14 -6" stroke="#6b3a1a" stroke-width="4" fill="none"/>
      <ellipse cx="46" cy="38" rx="9" ry="14" fill="#fff" opacity=".55" transform="rotate(-25 46 38)"/></svg>`,
    yakisoba: `<svg viewBox="0 0 120 120" width="120" height="120"><path d="M10 60 L110 60 L100 100 L20 100 Z" fill="#f2f2f2" stroke="#999" stroke-width="3"/>
      <path d="M16 62 q10 -20 20 -4 q10 -20 20 -4 q10 -20 20 -4 q10 -20 20 -4 q6 -10 10 0" stroke="#b5651d" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle cx="40" cy="56" r="5" fill="#e33"/><circle cx="76" cy="52" r="5" fill="#3a3"/></svg>`,
    purin: `<svg viewBox="0 0 120 120" width="120" height="120"><ellipse cx="60" cy="98" rx="52" ry="12" fill="#eef5fa" stroke="#9fb3c0" stroke-width="3"/>
      <path d="M36 34 Q60 26 84 34 L96 92 Q60 102 24 92 Z" fill="#ffd66b" stroke="#c9952e" stroke-width="3"/>
      <path d="M36 34 Q60 26 84 34 L87 48 Q72 56 60 50 Q48 56 33 48 Z" fill="#8a4a1c"/>
      <ellipse cx="44" cy="68" rx="5" ry="13" fill="#fff" opacity=".5"/></svg>`,
  };
  const FOODS = [[/たこ焼/, FOOD_SVG.takoyaki], [/りんご飴/, FOOD_SVG.ringoame], [/焼きそば/, FOOD_SVG.yakisoba], [/ハンバーガー/, '🍔'], [/かき氷/, '🍧'], [/パフェ/, '🍨'], [/ナポリタン/, '🍝'], [/プリン/, FOOD_SVG.purin]];
  const dream = mk(chibiLayer, { left: '1180px', top: '90px', width: '620px', height: '360px' }, 'a');
  const dreamCloud = svg(dream, 620, 360, `<g fill="#fff" stroke="#e7b3c3" stroke-width="6">
      <circle cx="-60" cy="420" r="22"/><circle cx="-10" cy="360" r="34"/>
      <ellipse cx="310" cy="180" rx="290" ry="160"/></g>`, { left: 0, top: 0 });
  dreamCloud.className = 'a';
  const dreamItems = mk(dream, { left: '60px', top: '110px', width: '500px', display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '110px' }, 'a');

  /* ---------- 文字カード ---------- */
  titleLayer.style.background = 'radial-gradient(circle at 50% 45%, #2b4f8c 0%, #1d3766 55%, #0d1b44 100%)';
  const titleText = W_.text(titleLayer, '', { left: 0, top: '420px', width: `${W}px`, textAlign: 'center', fontSize: '72px', color: '#fff', whiteSpace: 'pre-line', lineHeight: 1.4 }, 'a zen');
  const titleSub = W_.text(titleLayer, '', { left: 0, top: '640px', width: `${W}px`, textAlign: 'center', fontSize: '36px', color: '#bcd3f5', whiteSpace: 'pre-line' }, 'a zen');

  /* ---------- カットの組み立て ---------- */
  const CONTENT = window.EP_CONTENT || {};
  function shotKey(l) {
    const s = l.shot || { type: 'close' };
    const o = { type: s.type, bg: s.bg };
    if (s.type === 'wide') o.cast = (s.cast || []).map(c => [c.who, c.pose, c.x, c.facing, c.move]);
    if (s.type === 'close') o.who = s.who || l.speaker;
    if (s.type === 'two') { o.l = s.left; o.r = s.right; }
    if (s.type === 'chibi') o.who = s.who || l.speaker;
    if (s.type === 'cutin') o.id = l.id;
    if (s.type === 'title') o.text = s.screen || l.text;
    if (['imagine', 'phone', 'tablet', 'notebook', 'memo', 'calendar', 'boxes', 'compare', 'cards', 'sticky', 'table'].includes(s.type)) {
      // 中身の担当（content.js）が切り替えを指定していれば新しいカット
      if (CONTENT[l.id] && CONTENT[l.id].newCut !== false) o.id = l.id;
    }
    return JSON.stringify(o);
  }
  const CUTS = [];
  LINES.forEach((l, i) => {
    const key = shotKey(l);
    const last = CUTS[CUTS.length - 1];
    if (last && last.key === key && last.scene === l.scene && !(l.shot && l.shot.cut)) { last.lines.push(l); return; }
    const sc = SCENES[l.scene];
    const first = !last || last.scene !== l.scene;
    CUTS.push({ key, scene: l.scene, shot: Object.assign({}, l.shot || { type: 'close' }), lines: [l], start: first ? sc.start : l.start - 0.18, first });
  });
  CUTS.forEach((c, i) => {
    const next = CUTS[i + 1];
    c.end = next ? next.start : SCENES[c.scene].end;
    if (next && next.scene !== c.scene) c.end = SCENES[c.scene].end;
    const sceneBg = placeBg(SCENES[c.scene].place);
    let shotBg = c.shot.bg;
    const fest = /祭/.test(SCENES[c.scene].place || '') || /祭/.test(c.shot.screen || '');
    if (shotBg && fest && /^cafe/.test(shotBg) && !/fest/.test(shotBg)) shotBg = shotBg.replace('cafe', 'cafe_fest');
    if (shotBg === 'street' && fest) shotBg = 'festival';
    c.bg = bgId(shotBg || sceneBg || (CUTS[i - 1] && CUTS[i - 1].bg) || 'cafe');
    if (!shotBg && !sceneBg) {
      // bg が無いカット（端末など）は同じシーンの直前の場所を使う
      for (let j = i - 1; j >= 0 && CUTS[j].scene === c.scene; j--) if (CUTS[j].shot.bg) { c.bg = CUTS[j].bg; break; }
    }
    c.content = null;
    const owner = c.lines.find(l => CONTENT[l.id]);
    if (owner) {
      const host = DEVICE_HOST[c.shot.type] || imagineHost;
      const box = mk(host, {}, 'layer');
      show(box, false);
      const ctx = {
        cut: c, box, sfx,
        L: n => (c.lines[n] ? c.lines[n].start : lineEnd(c.lines[c.lines.length - 1])),
        E: n => (c.lines[n] ? lineEnd(c.lines[n]) : c.end),
        k: (t, n, dur = .6, delay = 0) => { const s = (c.lines[n] ? c.lines[n].start : c.start) + delay; return prog(t, s, s + dur); },
      };
      const def = CONTENT[owner.id];
      c.content = { def, ctx, box, state: def.build ? def.build(box, ctx, W_) : null };
    } else if (DEVICE_HOST[c.shot.type] && c.shot.type !== 'memory') {
      // 中身が用意されていない時は screen の文から下書きの絵を作る
      const host = DEVICE_HOST[c.shot.type];
      const box = mk(host, {}, 'layer');
      show(box, false);
      const def = window.PROPS.fallback(c.shot.type, c.shot.screen || c.lines[0].text);
      const ctx = { cut: c, box, sfx, L: n => (c.lines[n] ? c.lines[n].start : c.end), E: n => (c.lines[n] ? lineEnd(c.lines[n]) : c.end),
        k: (t, n, dur = .6, delay = 0) => { const s = (c.lines[n] ? c.lines[n].start : c.start) + delay; return prog(t, s, s + dur); } };
      c.content = { def, ctx, box, state: def.build(box, ctx, W_) };
    }
    // 効果音（カットの種類ごとの決まりの音＋脚本の指定）
    const t0 = c.start;
    const ty = c.shot.type;
    if (ty === 'phone') sfx(/^通知/.test(c.shot.screen || '') ? 'notify' : 'tap', t0 + 0.15, .8);
    if (ty === 'memo' || ty === 'sticky' || ty === 'calendar') sfx('paper', t0 + 0.05, .7);
    if (ty === 'memory') sfx('shimmer', t0, .6);
    if (ty === 'chibi') sfx('boing', t0 + 0.1, .7);
    if (ty === 'close' && c.shot.bubble) sfx('pop', t0 + 0.28, .6);
    if (c.shot.camera === 'blur_in') sfx('whoosh', t0 - 0.1, .7);
    if (c.shot.sfx) sfx(c.shot.sfx, c.lines[0].start - 0.1, .9);
    c.lines.forEach(l => { if (l !== c.lines[0] && l.shot && l.shot.sfx) sfx(l.shot.sfx, l.start - 0.1, .9); });
    if (c.shot.camera === 'shake') sfx('impact', c.start, .5);
  });

  /* ---------- 表情（セリフごと） ---------- */
  const REACT = window.EP_REACT || {};
  const exprChanges = { mina: [], bull: [], oji: [] };
  LINES.forEach(l => {
    if (exprChanges[l.speaker]) exprChanges[l.speaker].push({ t: l.start - 0.2, expr: l.expr });
    const r = REACT[l.id];
    if (r) Object.entries(r).forEach(([who, v]) => {
      const [expr, delay] = Array.isArray(v) ? v : [v, 0.3];
      exprChanges[who].push({ t: l.start + delay, expr });
    });
  });
  Object.values(exprChanges).forEach(a => a.sort((p, q) => p.t - q.t));
  function exprAt(who, t) {
    const ch = exprChanges[who];
    let j = -1;
    for (let i = 0; i < ch.length; i++) { if (ch[i].t <= t) j = i; else break; }
    return { cur: j >= 0 ? ch[j].expr : DEFAULT_EXPR[who], prev: j > 0 ? ch[j - 1].expr : DEFAULT_EXPR[who], since: j >= 0 ? t - ch[j].t : 99 };
  }
  const linesOf = { mina: [], bull: [], oji: [], narr: [] };
  LINES.forEach(l => linesOf[l.speaker] && linesOf[l.speaker].push(l));
  function talkLevel(who, t) {
    for (const l of linesOf[who] || []) {
      if (t >= l.start && t < lineEnd(l)) {
        const i = Math.floor((t - l.start) * EP.fps);
        const a = l.env[i] || 0, b = l.env[i + 1] || 0;
        return lerp(a, b, (t - l.start) * EP.fps - i) / 9;
      }
    }
    return 0;
  }
  function speakingLine(t) {
    for (const l of LINES) if (t >= l.start && t < lineEnd(l)) return l;
    return null;
  }

  /* ---------- 漫画の記号（効果） ---------- */
  const FX = {};
  function fxEl(name, inner, w, h) {
    const e = svg(fxLayer, w, h, inner, { left: 0, top: 0 });
    e.className = 'a';
    show(e, false);
    FX[name] = e;
  }
  fxEl('sweat', `<path d="M40 10 Q70 60 60 90 Q40 120 20 90 Q10 60 40 10 Z" fill="#8fd3ff" stroke="#3a8fd0" stroke-width="5"/><ellipse cx="32" cy="76" rx="7" ry="12" fill="#fff" opacity=".8"/>`, 80, 130);
  fxEl('shock', Array.from({ length: 9 }, (_, i) => `<line x1="${20 + i * 40}" y1="0" x2="${20 + i * 40}" y2="${160 + (i % 3) * 60}" stroke="#2a2f55" stroke-width="${i % 2 ? 5 : 9}" opacity=".75"/>`).join(''), 360, 300);
  fxEl('sparkle', [[40, 40, 34], [150, 20, 22], [110, 110, 28], [10, 140, 16]].map(([x, y, r]) => `<path d="M${x} ${y - r} Q${x + r * .2} ${y - r * .2} ${x + r} ${y} Q${x + r * .2} ${y + r * .2} ${x} ${y + r} Q${x - r * .2} ${y + r * .2} ${x - r} ${y} Q${x - r * .2} ${y - r * .2} ${x} ${y - r} Z" fill="#ffe066" stroke="#f2a900" stroke-width="3"/>`).join(''), 200, 180);
  fxEl('question', `<text x="0" y="110" font-family="Dela" font-size="120" fill="#2f5ea8" stroke="#fff" stroke-width="6" paint-order="stroke">?</text>`, 90, 130);
  fxEl('heart', `<path d="M60 105 C10 70 0 35 25 18 C42 6 58 18 60 30 C62 18 78 6 95 18 C120 35 110 70 60 105 Z" fill="#ff6f91" stroke="#fff" stroke-width="6"/>`, 120, 115);
  fxEl('anger', `<g stroke="#e0312f" stroke-width="12" stroke-linecap="round" fill="none"><path d="M20 40 Q40 40 40 20"/><path d="M80 20 Q80 40 100 40"/><path d="M100 80 Q80 80 80 100"/><path d="M40 100 Q40 80 20 80"/></g>`, 120, 120);
  fxEl('gloom', Array.from({ length: 14 }, (_, i) => `<line x1="${i * 140}" y1="0" x2="${i * 140}" y2="${380 + hash(i) * 260}" stroke="rgba(40,30,80,.35)" stroke-width="${10 + hash(i + 3) * 18}"/>`).join(''), W, 700);
  fxEl('tears', `<g fill="#8fd3ff" stroke="#3a8fd0" stroke-width="3">${[0, 1, 2, 3].map(i => `<path d="M${20 + i * 24} ${i * 30} q10 20 0 30 q-10 -10 0 -30z"/>`).join('')}</g>`, 120, 140);
  fxEl('rain', Array.from({ length: 90 }, (_, i) => `<line x1="${hash(i) * W}" y1="${hash(i + 90) * H}" x2="${hash(i) * W - 30}" y2="${hash(i + 90) * H + 90}" stroke="rgba(200,220,255,.45)" stroke-width="3"/>`).join(''), W, H);
  fxEl('wind', Array.from({ length: 14 }, (_, i) => `<path d="M${hash(i) * W} ${hash(i + 30) * H} q120 -20 260 0" stroke="rgba(255,255,255,.6)" stroke-width="5" fill="none" stroke-linecap="round"/>`).join(''), W, H);
  fxEl('shine', `<circle cx="150" cy="150" r="140" fill="rgba(255,240,180,.35)"/>`, 300, 300);

  function drawFx(t, cut, headAt) {
    Object.values(FX).forEach(e => show(e, false));
    const l = speakingLine(t) || cut.lines.find(x => t >= x.start - 0.2 && t < lineEnd(x) + 0.6);
    if (!l || !l.shot || !l.shot.fx || !l.shot.fx.length) return;
    const k = prog(t, l.start - 0.1, l.start + 0.25);
    const u = t - l.start;
    const head = headAt(l.speaker);
    const pos = head || [W / 2, 260];
    l.shot.fx.forEach((name, i) => {
      const e = FX[name];
      if (!e) return;
      if (!head && !['gloom', 'rain', 'wind'].includes(name)) return;
      show(e, true);
      const [hx, hy] = pos;
      if (name === 'gloom') T(e, { x: 0, y: lerp(-700, 0, ease.out(k)), o: .9 });
      else if (name === 'rain') T(e, { x: (u * 300) % 120 - 60, y: (u * 900) % 160 - 80, o: k });
      else if (name === 'wind') T(e, { x: (u * 600) % 400 - 200, y: 0, o: k * .8 });
      else if (name === 'shock') T(e, { x: hx - 180, y: hy - 430, sy: ease.out(k), o: k });
      else if (name === 'sweat') T(e, { x: hx + 110, y: hy - 40 + u * 18, s: ease.back(k), o: k });
      else if (name === 'sparkle') T(e, { x: hx + 90 + i * 10, y: hy - 160, r: Math.sin(u * 4) * 8, s: ease.back(k) * (1 + Math.sin(u * 6) * .06), o: k });
      else if (name === 'question') T(e, { x: hx + 120, y: hy - 180 + Math.sin(u * 4) * 8, r: Math.sin(u * 3) * 8, s: ease.back(k), o: k });
      else if (name === 'heart') T(e, { x: hx + 110, y: hy - 170 - u * 12, s: ease.back(k) * (1 + Math.sin(u * 8) * .08), o: k });
      else if (name === 'anger') T(e, { x: hx + 100, y: hy - 150, s: ease.back(k) * (1 + Math.abs(Math.sin(u * 9)) * .12), o: k });
      else if (name === 'tears') T(e, { x: hx - 60, y: hy + 40 + (u * 60) % 40, o: k * .9 });
      else if (name === 'shine') T(e, { x: hx - 150, y: hy - 200, s: 1 + Math.sin(u * 3) * .05, o: k * .8 });
    });
  }

  /* ---------- カット描画の部品 ---------- */
  function showBg(id, t, { blur = 0, zoom = 1, ox = 0, oy = 0, panK = 0, dark = 0 } = {}) {
    Object.entries(BG).forEach(([k, b]) => show(b.el, k === id));
    const b = BG[id];
    b.update(t);
    const par = [0.35, 0.7, 1.0];
    ['far', 'mid', 'near'].forEach((n, i) => {
      const L = b.layers[n];
      L.style.transform = `translate(${-panK * 120 * par[i] + ox}px, ${oy}px)`;
    });
    b.el.style.transform = `scale(${zoom})`;
    b.el.style.filter = b.keepFilter ? b.el.style.filter : '';
    veil.style.opacity = blur ? Math.min(.55, blur * .05) + dark : dark;
    veil.style.background = blur ? 'rgba(250,244,236,1)' : 'rgba(10,15,30,1)';
    return b;
  }
  function setBody(who, pose, t) {
    const b = bodies[who];
    b.img.style.filter = '';
    const p = BODY[who][pose] ? pose : 'front';
    const src = p === 'chibi' ? `${CHARA}${who}/chibi.png` : `${CHARA}${who}/${p}.png`;
    if (b.src !== src) { b.img.src = src; b.src = src; }
    const h = p === 'chibi' ? CHIBI_H[who] * .8 : BODY_H[who];
    const w = h * BODY[who][p][0];
    b.img.style.height = `${h}px`;
    b.img.style.left = `${-w / 2}px`;
    b.img.style.top = `${-h}px`;
    return { h, w, natural: BODY[who][p][1] };
  }

  // 全身のカット
  function drawWide(cut, t) {
    const sh = cut.shot;
    const u = t - cut.start, D = cut.end - cut.start;
    const cam = cut.shot.camera;
    const panK = cam === 'pan_left' ? lerp(-1, 1, ease.sine(clamp(u / D))) : cam === 'pan_right' ? lerp(1, -1, ease.sine(clamp(u / D))) : 0;
    const b = showBg(cut.bg, t, { panK });
    Object.values(bodies).forEach(x => show(x.wrap, false));
    const heads = {};
    const speaking = speakingLine(t);
    (sh.cast || []).forEach((c, i) => {
      if (!bodies[c.who]) return;
      const bo = bodies[c.who];
      show(bo.wrap, true);
      let x = clamp(c.x ?? .5, -0.3, 1.3) * W - panK * 120;
      let pose = c.pose || 'front';
      let facing = c.facing || (x < W / 2 ? 'right' : 'left');
      let walk = 0;
      const mv = c.move || '';
      const WALK = 1.5;
      if (mv.startsWith('enter')) {
        const from = mv.endsWith('left') ? -0.15 : 1.15;
        const k = clamp(u / WALK);
        if (k < 1) { x = lerp(from * W, x, ease.out(k)); pose = 'side'; facing = from < 0 ? 'right' : 'left'; walk = 1; }
      } else if (mv.startsWith('exit')) {
        const to = mv.endsWith('left') ? -0.2 : 1.2;
        const k = clamp((u - (D - WALK - .2)) / WALK);
        if (k > 0) { x = lerp(x, to * W, ease.in(k)); pose = 'side'; facing = to < 0 ? 'left' : 'right'; walk = 1; }
      }
      if (pose === 'chibi' && !BODY[c.who].chibi) pose = 'front';
      const info = setBody(c.who, pose, t);
      const flip = info.natural && info.natural !== facing ? -1 : 1;
      const talk = speaking && speaking.speaker === c.who ? talkLevel(c.who, t) : 0;
      const hop = walk ? Math.abs(Math.sin(u * 9)) * 14 : 0;
      const breathe = Math.sin(t * 2 + i) * .006;
      const y = Math.min(b.floor, 905);
      T(bo.wrap, { x, y: y - hop - talk * 6, sx: .92, sy: .92 * (1 + breathe + talk * .01), r: walk ? Math.sin(u * 9) * 1.6 : 0 });
      bo.flip.style.transform = `scaleX(${flip})`;
      bo.shadow.style.transform = `scale(${info.w / 160}, 1)`;
      heads[c.who] = [x, y - info.h * .92 * .82];
    });
    return who => heads[who];
  }

  // バストアップ 1 人・2 人
  function placeBust(slot, who, t, { cx, h, dimK = 0, bottom = H + 30 }) {
    const { cur, prev, since } = exprAt(who, t);
    const sa = faceFile(who, prev), sb = faceFile(who, cur);
    if (slot.sa !== sa) { slot.a.src = sa; slot.sa = sa; }
    if (slot.sb !== sb) { slot.b.src = sb; slot.sb = sb; }
    const fade = clamp(since / 0.1);
    slot.a.style.opacity = sa === sb ? 0 : 1 - fade;
    slot.b.style.opacity = sa === sb ? 1 : fade;
    [slot.a, slot.b].forEach(im => { im.style.height = `${h}px`; });
    const bk = clamp(since / 0.3);
    const bounce = since >= 0 && since < 0.3 ? Math.sin(bk * Math.PI) : 0;
    const talk = talkLevel(who, t);
    const breathe = Math.sin(t * 2.1 + cx * .01) * .006;
    T(slot.wrap, { x: cx, y: bottom - bounce * 14 - talk * 5, sx: 1 - bounce * .015, sy: 1 + breathe + bounce * .025 + talk * .012 });
    slot.wrap.style.filter = dimK ? `brightness(${1 - dimK * .25}) saturate(${1 - dimK * .2})` : '';
    show(slot.wrap, true);
    return [cx, bottom - h * .7];
  }
  // 額縁（左右の縦線）と、その内側だけに顔を出す窓
  const frameWin = mk(bustLayer, { left: '420px', top: 0, width: '1080px', height: `${H}px`, overflow: 'hidden' }, 'a');
  const frameBack = mk(frameWin, { inset: 0 }, 'layer');
  const frameRays = svg(frameWin, 1080, H, Array.from({ length: 28 }, (_, i) => {
    const a = i / 28 * Math.PI * 2, a2 = a + Math.PI / 28, cx = 540, cy = 420;
    return `<path d="M${cx} ${cy} L${cx + Math.cos(a) * 1500} ${cy + Math.sin(a) * 1500} L${cx + Math.cos(a2) * 1500} ${cy + Math.sin(a2) * 1500} Z" fill="rgba(255,150,60,.28)"/>`;
  }).join(''), { left: 0, top: 0 });
  frameRays.className = 'a';
  const frameGloom = mk(frameWin, { inset: 0, background: 'linear-gradient(180deg, rgba(40,40,90,.35), rgba(40,40,90,0) 70%)' }, 'layer');
  const frameBustHost = mk(frameWin, { inset: 0 }, 'layer');
  // 額縁の外側は縞の壁紙（参考動画と同じく、コマの外を壁紙にする）
  const STRIPE = 'repeating-linear-gradient(90deg, #f4eadb 0 36px, #efe3d0 36px 70px)';
  const matteL = mk(bustLayer, { left: 0, top: 0, width: '420px', height: `${H}px`, background: STRIPE }, 'a');
  const matteR = mk(bustLayer, { left: '1500px', top: 0, width: '420px', height: `${H}px`, background: STRIPE }, 'a');
  bustLayer.insertBefore(matteL, frameWin); bustLayer.insertBefore(matteR, frameWin);
  const frameL = mk(bustLayer, { left: '414px', top: 0, width: '6px', height: `${H}px`, background: '#3a3330' }, 'a');
  const frameR = mk(bustLayer, { left: '1500px', top: 0, width: '6px', height: `${H}px`, background: '#3a3330' }, 'a');
  const bubbleHost = mk(bustLayer, {}, 'layer');
  let bubbleEl = null, bubbleText = '';
  function drawClose(cut, t) {
    const sh = cut.shot;
    const who = sh.who || (cut.lines[0].speaker === 'narr' ? 'mina' : cut.lines[0].speaker);
    const u = t - cut.start, D = cut.end - cut.start;
    const plain = cut.bg === 'wall' || cut.bg === 'wall_dark';
    showBg(cut.bg, t, { blur: plain ? 0 : 9, zoom: plain ? 1 : 1.3, dark: plain ? 0 : .08 });
    // 額縁の幅は顔の絵の幅より少し狭くして、素材の端（パネルの切れ目）を枠の外に出す
    const push = sh.camera === 'push' ? ease.sine(clamp(u / D)) * 60 : 0;
    const h = (who === 'oji' ? 1180 : 1300) + push;
    const im = busts[0].b;
    const aspect = im.naturalWidth ? im.naturalWidth / im.naturalHeight : 0.8;
    const fw = Math.round(Math.min(1180, h * aspect * ({ mina: .84, bull: .82, oji: .9 }[who] || .9)));
    const off = (SIDE[who] ?? 0) * 120;
    const fx = Math.round(W / 2 + off - fw / 2);
    frameWin.style.left = `${fx}px`; frameWin.style.width = `${fw}px`;
    frameL.style.left = `${fx - 6}px`; frameR.style.left = `${fx + fw}px`;
    matteL.style.width = `${fx}px`; matteR.style.left = `${fx + fw}px`; matteR.style.width = `${W - fx - fw}px`;
    show(frameRays, sh.emote === 'rays'); show(frameGloom, sh.emote === 'gloom');
    T(frameRays, { x: fw / 2 - 540, r: u * 6, s: 1.2 });
    frameBack.style.background = sh.emote === 'rays' ? '#ffe9d6' : 'transparent';
    if (busts[0].wrap.parentNode !== frameBustHost) frameBustHost.appendChild(busts[0].wrap);
    const head = placeBust(busts[0], who, t, { cx: fw / 2, h, bottom: H + (who === 'oji' ? 60 : 30) + push * .3 });
    show(busts[1].wrap, false);
    // 吹き出し
    const bt = sh.bubble || '';
    show(bubbleHost, !!bt);
    if (bt && bt !== bubbleText) { bubbleHost.innerHTML = ''; bubbleEl = window.PROPS.bubble(bubbleHost, bt, { x: Math.min(fx + fw - 260, W - 420), y: 230 }); bubbleText = bt; }
    if (bt) W_.pop(bubbleEl, prog(u, .25, .55), { r: -3 });
    return w => (w === who ? [fx + head[0], head[1]] : null);
  }
  function drawTwo(cut, t) {
    const sh = cut.shot;
    if (busts[0].wrap.parentNode !== bustLayer) bustLayer.appendChild(busts[0].wrap);
    [frameWin, frameL, frameR, bubbleHost, matteL, matteR].forEach(e => show(e, false));
    const L = sh.left || 'mina', R = sh.right || 'oji';
    showBg(cut.bg, t, { blur: 6, zoom: 1.25, oy: 40 });
    const sp = speakingLine(t);
    const heads = {};
    heads[L] = placeBust(busts[0], L, t, { cx: W * .3, h: L === 'oji' ? 760 : 780, dimK: sp && sp.speaker === R ? 1 : 0 });
    heads[R] = placeBust(busts[1], R, t, { cx: W * .7, h: R === 'oji' ? 760 : 780, dimK: sp && sp.speaker === L ? 1 : 0 });
    return w => heads[w];
  }
  function drawDevice(cut, t) {
    const type = cut.shot.type;
    const u = t - cut.start;
    const isProp = PROP_TYPES.includes(type);
    show(propHost, isProp);
    [phone, tablet, notebook, imagineHost, shoulder].forEach(e => show(e, false));
    if (isProp) {
      const def = { memo: 'desk', calendar: 'wall', boxes: 'wall', compare: 'wall', cards: 'wall', sticky: 'wall', memory: 'wall', table: 'wall' }[type];
      showBg(cut.shot.bg ? cut.bg : def, t, {});
      show(dim, false);
      if (cut.content) {
        show(cut.content.box, true);
        if (cut.content.def && cut.content.def.update) cut.content.def.update(t, cut.content.ctx, cut.content.state, W_);
      }
      return () => null;
    }
    showBg(cut.bg, t, { blur: 10, zoom: 1.3, dark: type === 'imagine' ? 0 : .12 });
    show(dim, type !== 'imagine' && type !== 'phone');
    show(shoulder, type === 'phone');
    if (type === 'phone') T(shoulder, { x: lerp(-60, 0, ease.quint(prog(u, 0, .5))), y: Math.sin(t * 1.2) * 4 });
    show(phone, type === 'phone');
    show(tablet, type === 'tablet');
    show(notebook, type === 'notebook');
    show(imagineHost, type === 'imagine');
    const enter = ease.quint(prog(u, 0, .45));
    if (type === 'phone') T(phone, { x: 120, y: lerp(300, -60, enter) + Math.sin(t * 1.3) * 5, r: lerp(6, 0, enter) + Math.sin(t * .9) * .4, s: .86 });
    if (type === 'tablet') T(tablet, { y: lerp(200, 0, enter) + Math.sin(t * 1.1) * 4, s: lerp(.92, 1, enter) });
    if (type === 'notebook') T(notebook, { y: lerp(160, 0, enter), r: lerp(-4, -1.2, enter) });
    if (type === 'imagine') {
      veil.style.opacity = 0;
      Object.values(BG).forEach(b => show(b.el, false));
      const b = BG.imagine;
      show(b.el, true);
      b.el.style.filter = '';
      b.el.style.transform = `scale(${1 + u * .006})`;
      ['far', 'mid', 'near'].forEach((n, i) => { b.layers[n].style.transform = `translate(${-u * (6 + i * 8)}px, 0)`; });
      imagineHost.style.opacity = ease.out(prog(u, 0, .5));
    }
    if (cut.content) {
      show(cut.content.box, true);
      if (cut.content.def && cut.content.def.update) cut.content.def.update(t, cut.content.ctx, cut.content.state, W_);
    }
    return () => null;
  }
  const memoryVeil = mk(stage, { inset: 0, zIndex: 7, pointerEvents: 'none',
    background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(40,20,5,.65) 100%)' }, 'layer');
  const memoryGrain = svg(memoryVeil, W, H, Array.from({ length: 40 }, (_, i) => `<line x1="${hash(i) * W}" y1="0" x2="${hash(i) * W + 2}" y2="${H}" stroke="rgba(255,240,210,${.04 + hash(i + 5) * .06})" stroke-width="${1 + hash(i + 9) * 2}"/>`).join(''), { left: 0, top: 0 });
  memoryGrain.className = 'a';
  const memoryText = mk(memoryVeil, { left: '1120px', top: '540px', width: '760px', fontSize: '80px', color: '#fff3dc', lineHeight: 1.3, whiteSpace: 'nowrap',
    textShadow: '0 4px 0 rgba(80,40,10,.6), 0 0 20px rgba(80,40,10,.5)' }, 'a zen', '');
  show(memoryVeil, false);
  function drawMemory(cut, t) {
    const sh = cut.shot;
    const who = sh.who || 'oji';
    const pose = sh.pose || 'front';
    const u = t - cut.start, D = cut.end - cut.start;
    const mbg = sh.bg ? cut.bg : 'cafe';
    const b = showBg(mbg, t, {});
    b.el.style.filter = 'grayscale(.6) sepia(1) brightness(.9) contrast(1.05)';
    show(bodyLayer, true);
    Object.values(bodies).forEach(x => show(x.wrap, false));
    const bo = bodies[who];
    show(bo.wrap, true);
    const info = setBody(who, pose, t);
    const sc = (who === 'oji' ? 1.25 : 1.45) * (1 + .05 * ease.sine(clamp(u / D)));
    T(bo.wrap, { x: W / 2, y: 1080 + info.h * .18 * sc, s: sc });
    bo.flip.style.transform = '';
    bo.img.style.filter = 'grayscale(.6) sepia(1) saturate(1.1) brightness(.95)';
    show(memoryVeil, true);
    const q = (sh.screen || '').match(/『(.+?)』/);
    memoryText.textContent = q ? q[1] : '';
    W_.fade(memoryText, prog(u, .25, .7));
    T(memoryText, { o: ease.out(prog(u, .25, .7)) * .95, r: -4, y: lerp(20, 0, ease.out(prog(u, .25, .7))) });
    T(memoryGrain, { x: (Math.floor(t * 12) % 7) * 9 - 30 });
    return w => (w === who ? [W / 2, 1080 - info.h * sc * .78] : null);
  }
  function drawChibi(cut, t) {
    const who = cut.shot.who || cut.lines[0].speaker;
    const u = t - cut.start;
    Object.values(BG).forEach(b => show(b.el, false));
    chibiBg.style.background = who === 'mina' ? 'radial-gradient(circle, #ffe3ec, #ffb3c8)' : 'radial-gradient(circle, #e3efff, #a9c7f5)';
    const src = `${CHARA}${BODY[who] && BODY[who].chibi ? who : 'bull'}/chibi.png`;
    if (chibiImg.dataset.src !== src) { chibiImg.src = src; chibiImg.dataset.src = src; }
    T(chibiRays, { r: u * 20 });
    const k = prog(u, 0, .35);
    const talk = talkLevel(who, t);
    T(chibiImg, { x: -chibiImg.width / 2 || 0, y: -Math.abs(Math.sin(u * 7)) * 30 - talk * 10, s: ease.back(k), r: Math.sin(u * 5) * 4 });
    chibiImg.style.transform = `translateX(-50%) translateY(${-Math.abs(Math.sin(u * 7)) * 30 - talk * 10}px) rotate(${Math.sin(u * 5) * 4}deg) scale(${ease.back(k)})`;
    const foods = FOODS.filter(([re]) => re.test(cut.shot.screen || '') || re.test(cut.lines[0].text)).map(f => f[1]).slice(0, 3);
    show(dream, foods.length > 0);
    if (foods.length) {
      if (dreamItems.dataset.k !== foods.join('')) {
        dreamItems.innerHTML = foods.map(f => `<span style="display:inline-block">${f}</span>`).join('');
        dreamItems.dataset.k = foods.join('');
      }
      W_.pop(dream, prog(u, .3, .7));
      const big = foods.length === 1 ? 1.6 : 1;   // ひとつだけなら大きく
      [...dreamItems.children].forEach((e, i) => { e.style.transform = `translateY(${Math.sin(u * 4 + i * 1.3) * 10}px) scale(${big * ease.back(prog(u, .5 + i * .25, .8 + i * .25))})`; });
    }
    return w => [W / 2, H - 560];
  }
  function drawTitle(cut, t) {
    const u = t - cut.start;
    Object.values(BG).forEach(b => show(b.el, false));
    const s = cut.shot.screen || cut.lines[0].text;
    const [a, b] = s.split(/\n|｜/);
    titleText.textContent = a || '';
    titleSub.textContent = b || '';
    W_.slide(titleText, prog(u, .1, .7), 0, 40);
    W_.slide(titleSub, prog(u, .4, 1.0), 0, 30);
    return () => null;
  }

  /* ---------- カットイン ---------- */
  const cutBg = mk(cutLayer, { inset: 0, background: 'radial-gradient(circle at 60% 50%, #2b4f8c 0%, #13287a 55%, #0b1640 100%)' }, 'layer');
  const cutRays = svg(cutLayer, W, H, Array.from({ length: 48 }, (_, i) => {
    const a = i / 48 * Math.PI * 2, a2 = a + .035 + hash(i) * .03;
    const r1 = 300 + hash(i + 3) * 160, r2 = 1500, cx = W * .6, cy = H * .5;
    return `<path d="M${cx + Math.cos(a) * r1} ${cy + Math.sin(a) * r1} L${cx + Math.cos(a) * r2} ${cy + Math.sin(a) * r2} L${cx + Math.cos(a2) * r2} ${cy + Math.sin(a2) * r2} Z" fill="rgba(255,255,255,${.08 + hash(i + 7) * .14})"/>`;
  }).join(''), { left: 0, top: 0 });
  cutRays.className = 'a';
  const cutArt = pic(cutLayer, '', { left: '-40px', bottom: '-60px',
    webkitMaskImage: 'linear-gradient(90deg, #000 78%, transparent 99%), linear-gradient(0deg, transparent 0%, #000 12%)', webkitMaskComposite: 'source-in',
    maskImage: 'linear-gradient(90deg, #000 78%, transparent 99%), linear-gradient(0deg, transparent 0%, #000 12%)', maskComposite: 'intersect' }, 'a');
  const cutText = mk(cutLayer, { left: '760px', top: '300px', width: '1100px', fontSize: '92px', lineHeight: 1.3, color: '#fff', textAlign: 'center',
    textShadow: '0 8px 0 #d62839, 0 0 30px rgba(0,0,0,.35)', whiteSpace: 'pre-line' }, 'a dela', '');
  const cutBand = mk(cutLayer, { left: '-100px', top: '850px', width: `${W + 200}px`, height: '110px', background: '#d62839', transformOrigin: '0 50%' }, 'a');
  const cutBandText = mk(cutBand, { left: '160px', top: '16px', fontSize: '54px', color: '#fff', whiteSpace: 'nowrap', letterSpacing: '.06em' }, 'a dela', '');
  show(cutLayer, false);
  const CUT_ART = { oji: ['oji/main.png', 980], bull: ['bull/main.png', 1040], mina: ['mina/main.png', 960] };
  CUTS.filter(c => c.shot.type === 'cutin').forEach(c => sfx('impact', c.start, .9));
  function drawCutin(cut, t) {
    const on = cut && cut.shot.type === 'cutin';
    show(cutLayer, on);
    if (!on) return false;
    const who = cut.shot.who || cut.lines[0].speaker;
    const u = t - cut.start;
    const [art, h] = CUT_ART[who] || CUT_ART.oji;
    if (cutArt.dataset.src !== art) { cutArt.src = CHARA + art; cutArt.dataset.src = art; cutArt.style.height = `${h}px`; }
    const k = prog(u, 0, .3);
    cutLayer.style.clipPath = `polygon(${lerp(100, -20, ease.quint(k))}% 0, 120% 0, 120% 100%, ${lerp(120, 0, ease.quint(k)) - 20}% 100%)`;
    T(cutRays, { r: u * 8, s: 1.05 });
    const ak = ease.quint(prog(u, .05, .55));
    T(cutArt, { x: lerp(-420, 0, ak) + u * 10, y: Math.sin(t * 3) * 4, s: 1 + u * .012 });
    const quoted = (cut.shot.screen || '').match(/『(.+?)』/);
    let ct = quoted ? quoted[1] : cut.lines[0].text;
    // 長い時は、真ん中に近い読点で 2 行に分ける。文字の大きさは一番長い行が枠に収まるように
    if ([...ct].length > 12 && !ct.includes('\n')) {
      const chars = [...ct], mid = chars.length / 2;
      let best = -1;
      chars.forEach((c, i) => { if ('、，。！？'.includes(c) && i < chars.length - 3 && (best < 0 || Math.abs(i + 1 - mid) < Math.abs(best - mid))) best = i + 1; });
      if (best < 0) chars.forEach((c, i) => { if ('はがをにでとも'.includes(c) && i > 3 && i < chars.length - 4 && (best < 0 || Math.abs(i + 1 - mid) < Math.abs(best - mid))) best = i + 1; });
      if (best > 0) ct = chars.slice(0, best).join('') + '\n' + chars.slice(best).join('');
    }
    cutText.textContent = ct;
    const longest = Math.max(...ct.split('\n').map(x => [...x].length));
    cutText.style.fontSize = `${Math.min(110, Math.floor(1060 / longest))}px`;
    const tk = ease.back(prog(u, .2, .6));
    T(cutText, { s: lerp(1.6, 1, tk), o: clamp(tk * 2), y: Math.sin(u * 9) * Math.max(0, 1 - u * 2) * 6 });
    cutBandText.textContent = NAME[who] || '';
    T(cutBand, { sx: ease.quint(prog(u, .15, .5)), sy: 1, r: -3 });
    return true;
  }

  /* ---------- 字幕 ---------- */
  const subShade = mk(subLayer, { left: 0, top: '820px', width: `${W}px`, height: '260px', background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.42))' }, 'a');
  const subWrap = mk(subLayer, { left: '0', top: '0', width: `${W}px`, height: `${H}px` }, 'a');
  const subLine = mk(subWrap, { left: '120px', right: '120px', bottom: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }, 'a');
  const subName = mk(subLine, { position: 'relative', fontSize: '24px', padding: '4px 16px', color: '#fff', borderRadius: '10px', whiteSpace: 'nowrap', flexShrink: 0 }, 'noto', '');
  subName.style.fontWeight = 900;
  const subText = mk(subLine, { position: 'relative', fontSize: '54px', lineHeight: 1.3, color: '#fff', letterSpacing: '.02em',
    textShadow: '0 0 6px rgba(0,0,0,.85), 0 3px 0 rgba(0,0,0,.6), 2px 2px 0 rgba(0,0,0,.5), -2px 2px 0 rgba(0,0,0,.5)' }, 'noto', '');
  subText.style.fontWeight = 900;
  let subLineId = null, subSpans = [];
  function currentLine(t) {
    for (let i = 0; i < LINES.length; i++) {
      const l = LINES[i], next = LINES[i + 1];
      const until = Math.min(next ? next.start - 0.04 : Infinity, lineEnd(l) + 1.4);
      if (t >= l.start - 0.04 && t < until) return l;
    }
    return null;
  }
  function drawSub(t, hidden) {
    const l = hidden ? null : currentLine(t);
    show(subWrap, !!l);
    if (!l) { subShade.style.opacity = 0; return; }
    if (subLineId !== l.id) {
      subText.innerHTML = '';
      subSpans = [];
      // 名前札のぶんだけ字幕に使える幅が減る
      show(subName, l.speaker !== 'narr');
      subName.textContent = NAME[l.speaker];
      const avail = Math.min(1460, 1680 - (l.speaker === 'narr' ? 0 : subName.offsetWidth + 16));
      let inQ = 0;
      const chars = [...l.text];
      const n0 = chars.length;
      let fsz = n0 > 34 ? 44 : n0 > 26 ? 48 : 54;
      const cap = Math.floor(avail / (fsz * 1.03));
      let brk = -1;
      if (n0 > cap) {
        const mid = n0 / 2;
        const pick = set => {
          let b = -1;
          chars.forEach((c, i) => {
            const at = i + 1;
            if (!set.includes(c) || at < 4 || n0 - at < 3 || at > cap || n0 - at > cap) return;
            if (chars[i + 1] === c || chars[i + 1] === '」' || chars[i + 1] === '』') return;   // ——、……、閉じかっこの前では切らない
            if (b < 0 || Math.abs(at - mid) < Math.abs(b - mid)) b = at;
          });
          return b;
        };
        brk = pick('、。！？…—');
        if (brk < 0) brk = pick('はがをにでとものへやか');
      }
      chars.forEach((ch, idx) => {
        if (idx === brk) subText.appendChild(document.createElement('br'));
        const s = document.createElement('span');
        s.textContent = ch;
        if (ch === '「' || ch === '『') inQ++;
        if (inQ > 0) s.className = 'q';
        if (ch === '」' || ch === '』') inQ = Math.max(0, inQ - 1);
        subText.appendChild(s);
        subSpans.push(s);
      });
      subText.style.fontSize = `${fsz}px`;
      subText.style.textAlign = 'center';
      subText.style.maxWidth = '1460px';
      // それでも予定外の折り返しが出たら、収まるまで文字を小さくする
      const rows = brk >= 0 ? 2 : 1;
      while (fsz > 34 && subText.offsetHeight > fsz * 1.3 * rows + 4) { fsz -= 2; subText.style.fontSize = `${fsz}px`; }
      subLineId = l.id;
    }
    const narr = l.speaker === 'narr';
    show(subName, !narr);
    subName.textContent = NAME[l.speaker];
    subName.style.background = COLOR[l.speaker].main;

    const n = subSpans.length;
    const k = prog(t, l.start - 0.06, l.start + 0.14);
    subLine.style.opacity = k;
    subLine.style.transform = `translateY(${lerp(10, 0, ease.out(k))}px)`;
    // 全身のカットだけ、字幕の後ろを少し暗くして足元と重なっても読めるように
    const cut = findCut(t);
    subShade.style.opacity = cut && (cut.shot.type === 'wide' || cut.shot.type === 'phone' || cut.shot.type === 'memory') ? 1 : 0;
  }

  /* ---------- 場面転換（暗転）とアイキャッチ ---------- */
  const EYE = EP.eyecatch;  // {start, end} または null
  const eyeBg = mk(eyeLayer, { inset: 0, background: 'linear-gradient(135deg, #ffe3ec 0%, #e3efff 100%)' }, 'layer');
  const eyeStripe = svg(eyeLayer, W * 2, H, Array.from({ length: 40 }, (_, i) => `<rect x="${i * 100}" y="0" width="40" height="${H}" fill="rgba(255,255,255,.45)" transform="skewX(-20)"/>`).join(''), { left: 0, top: 0 });
  eyeStripe.className = 'a';
  const eyeBull = pic(eyeLayer, `${CHARA}bull/chibi.png`, { left: '380px', top: '300px', height: '620px' }, 'a sticker');
  const eyeMina = pic(eyeLayer, `${CHARA}mina/chibi.png`, { left: '1060px', top: '330px', height: '600px' }, 'a sticker');
  const eyeLogo = W_.text(eyeLayer, '押し目おじさんの弟子になりました', { left: 0, top: '110px', width: `${W}px`, textAlign: 'center', fontSize: '76px', color: '#1d3766',
    textShadow: '0 6px 0 #fff' }, 'a dela');
  show(eyeLayer, false);
  if (EYE) { sfx('jingle', EYE.start + .1, .7); }
  function drawEyecatch(t) {
    const on = EYE && t >= EYE.start && t < EYE.end;
    show(eyeLayer, !!on);
    if (!on) return false;
    const u = t - EYE.start, D = EYE.end - EYE.start;
    const k = ease.quint(prog(u, 0, .4)), out = ease.in(prog(u, D - .4, D));
    eyeLayer.style.clipPath = `circle(${lerp(0, 120, k) * (1 - out)}% at 50% 50%)`;
    T(eyeStripe, { x: -(u * 120) % 200 });
    W_.pop(eyeBull, prog(u, .2, .6), { y: Math.sin(u * 4) * 10, r: Math.sin(u * 3) * 3 });
    W_.pop(eyeMina, prog(u, .35, .75), { y: Math.sin(u * 4 + 1) * 10, r: -Math.sin(u * 3) * 3 });
    W_.pop(eyeLogo, prog(u, .1, .5));
    return true;
  }
  function drawTransition(t) {
    // シーンの頭で暗転から明ける。直前のシーンの終わりで暗くなる
    let a = 0;
    SCENES.forEach((sc, i) => {
      if (i === 0) return;
      a = Math.max(a, prog(t, sc.start - 0.45, sc.start) * (1 - prog(t, sc.start + 0.05, sc.start + 0.5)));
    });
    transLayer.style.opacity = a;
    show(transLayer, a > 0);
  }

  /* ---------- タイトル ---------- */
  const INTRO = EP.intro;
  introLayer.style.background = 'radial-gradient(circle at 70% 40%, #2b4f8c 0%, #1d3766 50%, #0d1b44 100%)';
  const candles = svg(introLayer, W * 2, 520, Array.from({ length: 64 }, (_, i) => {
    const x = 20 + i * 60, base = 330 - Math.sin(i * .35) * 90 - i * 2.2, h = 30 + hash(i) * 70, up = hash(i + 4) > .38;
    return `<line x1="${x + 14}" y1="${base - h / 2 - 26}" x2="${x + 14}" y2="${base + h / 2 + 26}" stroke="rgba(255,255,255,.18)" stroke-width="4"/>
            <rect x="${x}" y="${base - h / 2}" width="28" height="${h}" rx="4" fill="${up ? 'rgba(255,90,90,.30)' : 'rgba(90,200,255,.25)'}"/>`;
  }).join(''), { left: 0, top: '300px' });
  candles.className = 'a';
  const introGlow = mk(introLayer, { left: '1080px', top: '80px', width: '900px', height: '900px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(242,182,50,.35) 0%, rgba(242,182,50,0) 65%)' }, 'a');
  const introOji = pic(introLayer, `${CHARA}oji/front.png`, { left: '1360px', top: '170px', height: '880px' }, 'a sticker');
  const introBull = pic(introLayer, `${CHARA}bull/chibi.png`, { left: '1040px', top: '600px', height: '460px' }, 'a sticker');
  const introMina = pic(introLayer, `${CHARA}mina/chibi.png`, { left: '1650px', top: '640px', height: '420px' }, 'a sticker');
  const TITLE1 = '押し目おじさんの', TITLE2 = '弟子になりました';
  const introSmall = W_.text(introLayer, TITLE1, { left: '110px', top: '120px', fontSize: '96px', color: '#f2b632', textShadow: '0 8px 0 rgba(0,0,0,.25)' }, 'a dela');
  const logoChars = [...TITLE2].map((c, i) => W_.text(introLayer, c, { left: `${100 + i * 128}px`, top: '250px', fontSize: '128px', color: '#fff',
    textShadow: '0 9px 0 #d62839, 0 20px 26px rgba(0,0,0,.35)' }, 'a dela'));
  const chapNo = parseInt(String(EP.ep).replace(/\D/g, ''), 10) || 1;
  const epBadge = W_.pill(introLayer, `第${chapNo}章`, { left: '116px', top: '520px', fontSize: '46px', padding: '10px 38px', background: '#d62839' });
  const epTitle = W_.text(introLayer, EP.title, { left: '116px', top: '610px', fontSize: '84px', color: '#fff' });
  const epSub = W_.text(introLayer, EP.subtitle || '', { left: '120px', top: '730px', fontSize: '38px', color: '#bcd3f5', width: '1000px', whiteSpace: 'normal', lineHeight: 1.4 });
  const introNote = W_.text(introLayer, '※教育目的のフィクションです。登場する銘柄は架空のもので、個別銘柄の売買を推奨するものではありません。', { left: '120px', top: '990px', fontSize: '26px', color: 'rgba(255,255,255,.78)' });
  if (window.EP_SIMPLE_INTRO === false) {
    sfx('jingle', 0.0, 1);
    sfx('whoosh', 0.35, .7);
    [...TITLE2].forEach((_, i) => sfx('pop', 1.0 + i * .08, .45, -.5 + i * .14));
    sfx('ding', 2.6, .8);
  }

  let chapTitle = String(EP.title).replace(/^第\S+章[\s　]*/, '');
  if (chapTitle.length > 9 && !chapTitle.includes('\n')) {
    // 真ん中に近い助詞の後ろで改行する
    const mid = chapTitle.length / 2;
    let best = -1;
    [...chapTitle].forEach((c, i) => { if ('をのはがでとに'.includes(c) && i < chapTitle.length - 2 && (best < 0 || Math.abs(i + 1 - mid) < Math.abs(best - mid))) best = i + 1; });
    if (best > 0) chapTitle = chapTitle.slice(0, best) + '\n' + chapTitle.slice(best);
  }
  const chapSticky = window.PROPS.sticky(stage, `第${chapNo}章\n${chapTitle}`, { x: 1440, y: 40, w: 420, h: 300, size: 36, rot: 3,
    sub: '※教育目的のフィクション。\n銘柄は架空です' });
  chapSticky.style.zIndex = 6;
  sfx('pop', INTRO + 0.5, .6);
  function drawChapSticky(t) {
    const k = prog(t, INTRO + 0.4, INTRO + 0.8), out = prog(t, INTRO + 7.5, INTRO + 8.0);
    show(chapSticky, k > 0 && out < 1);
    T(chapSticky, { s: ease.back(k) * (1 - ease.in(out)), r: 3, o: 1 - out });
  }
  function drawIntro(t) {
    drawChapSticky(t);
    if (window.EP_SIMPLE_INTRO !== false) {
      show(introLayer, false);
      transLayer.style.opacity = Math.max(+transLayer.style.opacity || 0, 1 - prog(t, 0, INTRO));
      show(transLayer, t < INTRO);
      return false;
    }
    if (t > INTRO + 0.6) { show(introLayer, false); return false; }
    show(introLayer, true);
    T(candles, { x: -t * 70, y: Math.sin(t) * 6, o: ease.out(prog(t, 0, 1)) });
    T(introGlow, { s: 1 + Math.sin(t * 2) * .04, o: ease.out(prog(t, .3, 1.2)) });
    const ok = ease.quint(prog(t, .45, 1.2));
    T(introOji, { x: lerp(500, 0, ok), y: Math.sin(t * 2.4) * 5, o: clamp(ok * 2) });
    W_.pop(introBull, prog(t, 1.4, 1.9), { y: Math.sin(t * 3) * 6, r: Math.sin(t * 2) * 2 });
    W_.pop(introMina, prog(t, 1.6, 2.1), { y: Math.sin(t * 3 + 1) * 6, r: -Math.sin(t * 2) * 2 });
    W_.slide(introSmall, prog(t, .55, 1.1), -80, 0);
    logoChars.forEach((el, i) => {
      const k = prog(t, 1.0 + i * .08, 1.55 + i * .08);
      T(el, { y: lerp(-200, 0, ease.back(k)), r: lerp(-20, 0, ease.out(k)), s: lerp(.4, 1, ease.back(k)), o: clamp(k * 3) });
    });
    W_.pop(epBadge, prog(t, 2.5, 2.9));
    W_.slide(epTitle, prog(t, 2.7, 3.3), -80, 0);
    W_.slide(epSub, prog(t, 3.0, 3.6), -60, 0);
    W_.fade(introNote, prog(t, 3.4, 4.0));
    const out = prog(t, INTRO - 0.5, INTRO + 0.3);
    introLayer.style.opacity = 1 - ease.inOut(out);
    return true;
  }

  /* ---------- エンド（次回予告・クレジット） ---------- */
  const OUT_START = EP.outroStart;
  outroLayer.style.background = 'radial-gradient(circle at 30% 40%, #2b4f8c 0%, #1d3766 55%, #0d1b44 100%)';
  const outCandles = candles.cloneNode(true);
  outroLayer.appendChild(outCandles);
  const credits = mk(outroLayer, { left: '1180px', top: '60px', width: '680px', height: '960px' }, 'a');
  const CREDIT = window.EP_CREDITS || [];
  const creditEls = CREDIT.map(([k, v], i) => {
    const row = mk(credits, { left: 0, top: `${i * 118}px`, width: '680px' }, 'a');
    W_.text(row, k, { left: 0, top: 0, fontSize: '24px', color: '#f2b632' });
    W_.text(row, v, { left: 0, top: '34px', width: '680px', fontSize: '25px', color: '#fff', whiteSpace: 'normal', lineHeight: 1.35 });
    return row;
  });
  const outThanks = W_.text(outroLayer, 'つづく', { left: '120px', top: '860px', fontSize: '64px', color: '#f2b632' }, 'a dela');
  const outChars = [
    pic(outroLayer, `${CHARA}bull/chibi.png`, { left: '120px', top: '330px', height: '480px' }, 'a sticker'),
    pic(outroLayer, `${CHARA}mina/chibi.png`, { left: '430px', top: '370px', height: '440px' }, 'a sticker'),
    pic(outroLayer, `${CHARA}oji/front.png`, { left: '760px', top: '160px', height: '680px' }, 'a sticker'),
  ];
  const outNote = W_.text(outroLayer, '※教育目的のフィクションです。投資の判断はご自身で行ってください。', { left: '120px', top: '980px', fontSize: '24px', color: 'rgba(255,255,255,.7)' });
  show(outroLayer, false);
  sfx('jingle', OUT_START + 0.1, .7);
  function drawOutro(t) {
    if (t < OUT_START) { show(outroLayer, false); return false; }
    show(outroLayer, true);
    const L = t - OUT_START;
    outroLayer.style.opacity = ease.out(prog(L, 0, .6));
    T(outCandles, { x: -L * 60, o: .9 });
    outChars.forEach((el, i) => W_.pop(el, prog(L, .3 + i * .2, .8 + i * .2), { y: Math.sin(t * 3 + i) * 6 }));
    creditEls.forEach((el, i) => W_.slide(el, prog(L, .8 + i * .15, 1.4 + i * .15), 60, 0));
    W_.pop(outThanks, prog(L, 2.0, 2.5));
    W_.fade(outNote, prog(L, 2.4, 3.0));
    const fade = prog(t, EP.duration - 1.2, EP.duration);
    outroLayer.style.filter = fade > 0 ? `brightness(${1 - fade})` : '';
    return true;
  }

  /* ---------- 1 コマ ---------- */
  let lastCut = null;
  function findCut(t) {
    for (const c of CUTS) if (t >= c.start && t < c.end) return c;
    return null;
  }
  function renderFrame(t) {
    drawTransition(t);
    const intro = drawIntro(t);
    const outro = drawOutro(t);
    const eye = drawEyecatch(t);
    const cut = findCut(t) || (t < (CUTS[0] ? CUTS[0].start : 0) ? CUTS[0] : null);
    if (lastCut && lastCut !== cut && lastCut.content) show(lastCut.content.box, false);
    lastCut = cut;
    [bodyLayer, bustLayer, deviceLayer, chibiLayer, titleLayer, propHost].forEach(L => show(L, false));
    Object.values(bodies).forEach(b => show(b.wrap, false));
    busts.forEach(b => show(b.wrap, false));
    let headAt = () => null;
    if (cut) {
      const type = cut.shot.type;
      const u = t - cut.start, D = cut.end - cut.start;
      // カメラ
      const cam = cut.shot.camera;
      let cs = 1, cx = 0, cy = 0;
      if (cam === 'push') cs = 1 + .07 * ease.sine(clamp(u / D));
      // カメラ指定がなくても、絵が止まって見えないようにごくゆっくり寄る
      else if (!cam && (type === 'wide' || type === 'close' || type === 'two')) cs = 1 + .022 * clamp(u / D);
      if (cam === 'shake') { const k = Math.max(0, 1 - u / .5); cx = Math.sin(u * 70) * 18 * k; cy = Math.cos(u * 55) * 12 * k; }
      shotRoot.style.filter = '';
      show(memoryVeil, false);
      if (cam === 'blur_in') {
        const k = ease.out(prog(u, 0, .4));
        cx += (1 - k) * -160;
        shotRoot.style.filter = `blur(${(1 - k) * 16}px)`;
      }
      shotRoot.style.transform = `translate(${cx}px, ${cy}px) scale(${cs})`;
      if (type !== 'close') [frameWin, frameL, frameR, bubbleHost, matteL, matteR].forEach(e => show(e, false));
      else [frameWin, frameL, frameR, matteL, matteR].forEach(e => show(e, true));
      if (type === 'memory') { headAt = drawMemory(cut, t); }
      else if (type === 'wide') { show(bodyLayer, true); headAt = drawWide(cut, t); }
      else if (type === 'close') { show(bustLayer, true); headAt = drawClose(cut, t); }
      else if (PROP_TYPES.includes(type)) { show(deviceLayer, true); headAt = drawDevice(cut, t); }
      else if (type === 'two') { show(bustLayer, true); headAt = drawTwo(cut, t); }
      else if (type === 'chibi') { show(chibiLayer, true); headAt = drawChibi(cut, t); }
      else if (type === 'title') { show(titleLayer, true); headAt = drawTitle(cut, t); }
      else if (type === 'cutin') { showBg(cut.bg, t, {}); }
      else { show(deviceLayer, true); headAt = drawDevice(cut, t); }
    }
    const cutin = drawCutin(cut, t);
    show(fxLayer, !!cut && !intro && !eye);
    if (cut) drawFx(t, cut, headAt);
    drawSub(t, intro && t < INTRO - 0.3 || outro && t > OUT_START + 0.4 || eye);
  }

  window.renderFrame = renderFrame;
  window.DURATION = EP.duration;
  window.SFX_EVENTS = SFX;
  window.CUTS = CUTS.map(c => ({ start: c.start, end: c.end, type: c.shot.type, bg: c.bg, lines: c.lines.map(l => l.id) }));
  window.ready = (async () => {
    await document.fonts.ready;
    const all = new Set();
    Object.entries(exprChanges).forEach(([who, a]) => a.forEach(c => all.add(faceFile(who, c.expr))));
    Object.keys(DEFAULT_EXPR).forEach(w => all.add(faceFile(w, DEFAULT_EXPR[w])));
    Object.values(CUT_ART).forEach(([a]) => all.add(CHARA + a));
    ['mina', 'bull', 'oji'].forEach(w => Object.keys(BODY[w]).forEach(p => all.add(`${CHARA}${w}/${p}.png`)));
    await Promise.all([...all].map(src => new Promise(r => { const im = new Image(); im.onload = im.onerror = r; im.src = src; })));
    await Promise.all([...document.images].map(im => (im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; }))));
    renderFrame(0);
    return true;
  })();
})();
