// 物語アニメの共通エンジン。
//
// しくみ: すべての動きを「時刻 t の関数」として組み立てる。
//   ・ノード（画面の部品）は毎フレーム初期値に戻し、t0 <= t の動き（act）を開始時刻順に当て直す。
//   ・だから任意の時刻の静止画がそのまま撮れ、1 フレームずつ撮影しても結果が変わらない。
//   ・章のスクリプトはカーソル E.T を進めながら「セリフ・動き・効果音」を順に並べて書く。
// 音は鳴らさず、効果音・BGM・セリフの「ピッ」音の予定表（E.CUES）を作って tools/make_audio.py に渡す。
'use strict';

const E = (() => {
  const W = 1920, H = 1080;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const EASE = {
    linear: k => k,
    in: k => k * k * k,
    in2: k => k * k,
    out: k => 1 - Math.pow(1 - k, 3),
    out2: k => 1 - (1 - k) * (1 - k),
    inOut: k => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    quint: k => 1 - Math.pow(1 - k, 5),
    sine: k => -(Math.cos(Math.PI * k) - 1) / 2,
    back: k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
    backSoft: k => { const c1 = .9, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
    backIn: k => { const c1 = 1.70158, c3 = c1 + 1; return c3 * k * k * k - c1 * k * k; },
    elastic: k => (k === 0 || k === 1 ? k : Math.pow(2, -10 * k) * Math.sin((k * 10 - .75) * (2 * Math.PI) / 3) + 1),
    bounce: k => {
      const n1 = 7.5625, d1 = 2.75;
      if (k < 1 / d1) return n1 * k * k;
      if (k < 2 / d1) return n1 * (k -= 1.5 / d1) * k + .75;
      if (k < 2.5 / d1) return n1 * (k -= 2.25 / d1) * k + .9375;
      return n1 * (k -= 2.625 / d1) * k + .984375;
    },
  };
  // 決まった値を返す疑似乱数（同じ n なら必ず同じ値）
  const rnd = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ================================================================ ノード */
  const DEF = { x: 0, y: 0, s: 1, sx: 1, sy: 1, r: 0, o: 1, blur: 0, bright: 1, sat: 1, hue: 0, sep: 0, gray: 0, cl: 0, cr: 0, ct: 0, cb: 0 };
  class Node {
    constructor(el, init = {}) { this.el = el; this.init = init; this.p = {}; this.c = {}; this.hooks = []; }
    ini(props) { Object.assign(this.init, props); return this; }
    hook(f) { this.hooks.push(f); return this; }
    reset() { const p = this.p; for (const k in p) delete p[k]; Object.assign(p, DEF, this.init); }
    commit(t) {
      const p = this.p, c = this.c, st = this.el.style;
      for (const h of this.hooks) h(p, t, this);
      const vis = p.o > 0.002;
      if (c.vis !== vis) { st.visibility = vis ? '' : 'hidden'; c.vis = vis; }
      if (!vis) return;
      const tr = `translate(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px) rotate(${p.r.toFixed(3)}deg) scale(${(p.s * p.sx).toFixed(4)},${(p.s * p.sy).toFixed(4)})`;
      if (c.tr !== tr) { st.transform = tr; c.tr = tr; }
      const o = Math.min(1, p.o).toFixed(3);
      if (c.o !== o) { st.opacity = o; c.o = o; }
      let f = '';
      if (p.blur > .05) f += `blur(${p.blur.toFixed(2)}px) `;
      if (p.bright !== 1) f += `brightness(${p.bright.toFixed(3)}) `;
      if (p.sat !== 1) f += `saturate(${p.sat.toFixed(3)}) `;
      if (p.hue) f += `hue-rotate(${p.hue.toFixed(1)}deg) `;
      if (p.sep) f += `sepia(${p.sep.toFixed(3)}) `;
      if (p.gray) f += `grayscale(${p.gray.toFixed(3)}) `;
      if (c.f !== f) { st.filter = f; c.f = f; }
      const cp = (p.cl || p.cr || p.ct || p.cb) ? `inset(${p.ct.toFixed(2)}% ${p.cr.toFixed(2)}% ${p.cb.toFixed(2)}% ${p.cl.toFixed(2)}%)` : '';
      if (c.cp !== cp) { st.clipPath = cp; c.cp = cp; }
    }
  }

  /* ================================================================ 時間軸 */
  const stage = document.getElementById('stage');
  const scenes = [];
  const G = { nodes: [], acts: [], post: [] };   // シーンをまたぐ部品（セリフ窓・画面効果）
  let cur = null;                                // 組み立て中のシーン
  let seq = 0;
  const CUES = { bgm: [], sfx: [], blips: [] };
  const IMGS = [];

  const E = { T: 0, W, H, clamp, lerp, EASE, rnd, Node, CUES, stage };
  const holder = () => cur || G;
  const reg = n => { const h = holder(); n.owner = h; h.nodes.push(n); return n; };
  // 動きの登録。live なら t1 を過ぎたら当てない（揺れなど一時的な足し算に使う）。
  // 部品を動かす時は、その部品が属する層（シーンか全体）に登録する
  const act = (t0, t1, fn, live = false, owner = null) => { const a = { t0, t1, fn, live, seq: seq++ }; (owner || holder()).acts.push(a); return a; };
  // 毎フレーム最後に当てる足し算（呼吸・浮遊など）
  const post = (fn, owner = null) => (owner || holder()).post.push(fn);
  const own = n => (n && n.owner) || holder();
  E.act = act; E.post = post;

  E.wait = d => (E.T += d);
  E.at = t => (E.T = t);
  // 中で進めたカーソルを元に戻す（並行に置きたい時）
  E.par = fn => { const t = E.T; fn(); const end = E.T; E.T = t; return end; };
  // fn の中でカーソルを進めても、後で max を取る
  E.mark = () => E.T;

  /* ================================================================ 部品づくり */
  const NOUNIT = new Set(['opacity', 'zIndex', 'fontWeight', 'lineHeight', 'flex', 'zoom', 'order']);
  function css(e, o) { for (const k in o) { const v = o[k]; e.style[k] = (typeof v === 'number' && !NOUNIT.has(k)) ? v + 'px' : v; } }
  function parentEl(p) { return p ? (p.el || p) : (cur ? cur.cam.el : E.ui); }
  function mkEl(tag, parent, style, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (style) css(e, style);
    if (html != null) e.innerHTML = html;
    parentEl(parent).appendChild(e);
    return e;
  }
  E.css = css;
  E.div = (parent, style = {}, html = null, cls = 'a') => reg(new Node(mkEl('div', parent, style, cls, html)));
  E.img = (parent, src, style = {}, cls = 'a') => {
    const n = reg(new Node(mkEl('img', parent, style, cls)));
    n.el.decoding = 'sync'; n.el.src = src; IMGS.push(n.el);
    return n;
  };
  E.registerImg = im => { IMGS.push(im); return im; };
  // 途中で差し替える画像を先に読み込んでおく
  E.preload = src => { const im = new Image(); im.decoding = 'sync'; im.src = src; IMGS.push(im); return im; };
  E.svg = (parent, style, viewBox, inner, cls = 'a') => {
    const n = E.div(parent, style, `<svg viewBox="${viewBox}" width="100%" height="100%" preserveAspectRatio="none" style="overflow:visible;display:block">${inner}</svg>`, cls);
    n.svg = n.el.firstChild;
    return n;
  };
  E.canvas = (parent, style, draw, cls = 'a') => {
    const n = reg(new Node(mkEl('canvas', parent, style, cls)));
    n.el.width = parseInt(style.width, 10) || W; n.el.height = parseInt(style.height, 10) || H;
    n.ctx = n.el.getContext('2d');
    n.hook((p, t) => { if (p.o > .002) draw(n.ctx, t, p, n); });
    return n;
  };
  // 1 文字ずつ動かせる文字列
  E.chars = (parent, text, style = {}, cls = 'a nowrap') => {
    const box = E.div(parent, style, null, cls);
    const spans = [...text].map(ch => {
      const n = reg(new Node(mkEl('span', box, null, 'ch', ch === ' ' ? '&nbsp;' : esc(ch))));
      return n;
    });
    return { box, spans };
  };

  /* ================================================================ 動き */
  const easeOf = e => (typeof e === 'function' ? e : EASE[e || 'out']);
  // to の値: 数値 → 今の値から / [a, b] → a から b へ / それ以外 → 最初に代入
  E.tw = (node, dur, to, ease = 'out', delay = 0) => {
    const t0 = E.T + delay, ef = easeOf(ease), keys = Object.keys(to);
    act(t0, t0 + Math.max(dur, 1e-4), k => {
      const kk = ef(k), p = node.p;
      for (const key of keys) {
        const v = to[key];
        if (Array.isArray(v)) p[key] = lerp(v[0], v[1], kk);
        else if (typeof v === 'number') p[key] = lerp(p[key] ?? 0, v, kk);
        else p[key] = v;
      }
    }, false, own(node));
    return t0 + dur;
  };
  E.set = (node, props, delay = 0) => { const t = E.T + delay; act(t, t, () => Object.assign(node.p, props), false, own(node)); };
  E.fn = (dur, f, delay = 0, live = false) => { const t0 = E.T + delay; act(t0, t0 + dur, f, live); return t0 + dur; };
  E.show = (node, dur = .4, delay = 0, ease = 'out') => E.tw(node, dur, { o: [0, 1] }, ease, delay);
  E.hide = (node, dur = .4, delay = 0, ease = 'out') => E.tw(node, dur, { o: 0 }, ease, delay);
  E.pop = (node, dur = .5, delay = 0, from = .3) => E.tw(node, dur, { s: [from, 1], o: [0, 1] }, 'back', delay);
  E.popOut = (node, dur = .3, delay = 0) => E.tw(node, dur, { s: .4, o: 0 }, 'backIn', delay);
  E.from = (node, props, dur = .6, delay = 0, ease = 'out') => {
    // props の位置から今の位置（初期値）へ
    const to = {};
    for (const k in props) to[k] = [props[k], node.init[k] ?? DEF[k] ?? 0];
    if (!('o' in props)) to.o = [0, node.init.o ?? 1];
    // 登場するまでは見えないようにしておく
    node.ini({ o: 0 });
    return E.tw(node, dur, to, ease, delay);
  };
  // 一時的な揺れ・跳ね（足し算。終わったら効かない）
  E.shake = (node, dur = .5, amp = 14, delay = 0) => {
    const t0 = E.T + delay, sd = seq;
    act(t0, t0 + dur, (k, t) => {
      const f = Math.floor(t * 30), a = amp * (1 - k);
      node.p.x += (rnd(f + sd) * 2 - 1) * a;
      node.p.y += (rnd(f * 1.7 + sd + 3) * 2 - 1) * a;
    }, true, own(node));
  };
  E.hop = (node, h = 26, dur = .34, delay = 0, times = 1) => {
    const t0 = E.T + delay;
    act(t0, t0 + dur * times, k => {
      const kk = (k * times) % 1;
      node.p.lift = (node.p.lift || 0) + Math.sin(kk * Math.PI) * h;
      if (!node.isActor) node.p.y -= Math.sin(kk * Math.PI) * h;
    }, true, own(node));
  };
  E.squash = (node, amt = .1, dur = .3, delay = 0) => {
    const t0 = E.T + delay;
    act(t0, t0 + dur, k => { const w = Math.sin(k * Math.PI) * amt; node.p.sy *= 1 - w; node.p.sx *= 1 + w * .8; }, true, own(node));
  };
  E.wobble = (node, deg = 6, dur = .6, delay = 0) => {
    const t0 = E.T + delay;
    act(t0, t0 + dur, k => { node.p.r += Math.sin(k * Math.PI * 5) * deg * (1 - k); }, true, own(node));
  };
  // ずっと続く足し算
  E.float = (node, amp = 10, speed = 1.6, phase = 0) => post(t => { node.p.y += Math.sin(t * speed + phase) * amp; }, own(node));
  E.spin = (node, degPerSec = 20) => post(t => { node.p.r += t * degPerSec; }, own(node));
  E.pulse = (node, amp = .04, speed = 3, phase = 0) => post(t => { node.p.s *= 1 + Math.sin(t * speed + phase) * amp; }, own(node));
  E.breathe = (node, amp = .012, speed = 2.3, phase = 0) => post(t => {
    node.p.sy *= 1 + Math.sin(t * speed + phase) * amp; node.p.sx *= 1 - Math.sin(t * speed + phase) * amp * .45;
  }, own(node));

  /* ================================================================ 文字（タイプライター） */
  // 記法: {g|事実}{b|解釈}{p|期待}{r|赤}{y|黄マーカー}{k|太黒}、\n で改行
  E.line = (src) => {
    const segs = []; const re = /\{(\w+)\|([^}]*)\}/g; let last = 0, m;
    const push = (text, cls) => {
      const parts = text.split('\n');
      parts.forEach((part, i) => { if (i) segs.push({ br: true }); if (part) segs.push({ chars: [...part], cls }); });
    };
    while ((m = re.exec(src))) { push(src.slice(last, m.index), ''); push(m[2], m[1]); last = re.lastIndex; }
    push(src.slice(last), '');
    const chars = segs.flatMap(s => s.chars || []);
    return { segs, chars, len: chars.length, src };
  };
  function textHook(p, t, node) {
    const L = p.line;
    if (!L) { if (node.c.line !== null) { node.el.innerHTML = ''; node.c.line = null; } return; }
    const n = p.n == null ? 1e9 : Math.floor(p.n + 1e-6);
    if (node.c.line === L && node.c.n === n) return;
    node.c.line = L; node.c.n = n;
    let left = n, html = '';
    for (const s of L.segs) {
      if (s.br) { html += '<br>'; continue; }
      const k = clamp(left, 0, s.chars.length);
      const shown = s.chars.slice(0, k).join(''), hidden = s.chars.slice(k).join('');
      left -= s.chars.length;
      if (shown) html += `<span class="${s.cls}">${esc(shown)}</span>`;
      if (hidden) html += `<span class="${s.cls} hid">${esc(hidden)}</span>`;
    }
    node.el.innerHTML = html;
  }
  E.text = (parent, style = {}, src = null, cls = 'a') => {
    const n = E.div(parent, style, null, cls).hook(textHook);
    if (src != null) n.ini({ line: E.line(src) });
    return n;
  };
  // 声のピッ音（句読点・空白は鳴らさない）
  const SILENT = /[\s、。，．！？!?…‥・「」『』（）()【】〈〉《》―ー〜~♡♪☆★→←↑↓＝=＋+\-−％%：:；;,."'”“’‘／/]/;
  function blips(t0, L, cps, voice) {
    if (!voice) return;
    L.chars.forEach((ch, i) => { if (!SILENT.test(ch)) CUES.blips.push({ t: +(t0 + i / cps).toFixed(4), voice }); });
  }
  // 文字を打ち出す（カーソルは進めない）。戻り値は打ち終わる時刻
  E.type = (node, src, { cps = 22, voice = null, delay = 0 } = {}) => {
    const L = typeof src === 'string' ? E.line(src) : src, t0 = E.T + delay, d = L.len / cps;
    act(t0, t0, () => { node.p.line = L; node.p.n = 0; }, false, own(node));
    act(t0, t0 + d, k => { node.p.n = k * L.len; }, false, own(node));
    blips(t0, L, cps, voice);
    return t0 + d;
  };
  // 読み終わるまでの目安（秒）
  E.readTime = (L, cps = 22) => L.len / cps + Math.max(.9, L.len * .088);

  /* ================================================================ 音の予定 */
  E.sfx = (name, { delay = 0, gain = 1, pan = 0 } = {}) => { CUES.sfx.push({ t: +(E.T + delay).toFixed(4), name, gain, pan }); };
  let bgmOpen = null;
  E.bgm = (track, { fadeIn = .6, gain = 1, fadeOut = 1.2, delay = 0 } = {}) => {
    const t = E.T + delay;
    if (bgmOpen) { bgmOpen.t1 = t + Math.min(fadeOut, .8); bgmOpen.fadeOut = fadeOut; }
    bgmOpen = track ? { t0: +t.toFixed(3), t1: null, track, gain, fadeIn, fadeOut: 1.2 } : null;
    if (bgmOpen) CUES.bgm.push(bgmOpen);
  };
  E.bgmStop = (fadeOut = 1.5, delay = 0) => {
    if (bgmOpen) { bgmOpen.t1 = E.T + delay + fadeOut; bgmOpen.fadeOut = fadeOut; bgmOpen = null; }
  };

  /* ================================================================ シーン */
  // opts.bg: 背景, opts.fade: 前のシーンと重ねてフェードする秒数
  E.scene = (opts, build) => {
    if (typeof opts === 'function') { build = opts; opts = {}; }
    const prev = scenes[scenes.length - 1];
    const sc = { t0: E.T, t1: null, nodes: [], acts: [], post: [], name: opts.name || `s${scenes.length + 1}`, on: null };
    sc.el = mkEl('div', stage, { background: opts.bg || '#000', zIndex: scenes.length + 1 }, 'scene');
    cur = sc;
    sc.root = reg(new Node(sc.el));
    sc.cam = E.div(sc.el, { left: 0, top: 0, width: W, height: H });
    if (opts.fade && prev) {
      prev.t1 = Math.max(prev.t1, E.T + opts.fade);
      E.tw(sc.root, opts.fade, { o: [0, 1] }, 'inOut');
    }
    scenes.push(sc);
    // 場面が変わったら前の字幕は消す
    if (!opts.keepSub) E.unsub();
    build(sc);
    sc.t1 = E.T;
    cur = null;
    return sc;
  };
  E.inScene = (sc, fn) => { const keep = cur; cur = sc; fn(); cur = keep; };

  /* ================================================================ 描画 */
  function runActs(list, t) {
    for (const a of list) {
      if (a.t0 > t) break;
      if (a.live && t > a.t1) continue;
      a.fn(a.t1 > a.t0 ? clamp((t - a.t0) / (a.t1 - a.t0)) : 1, t);
    }
  }
  E.renderFrame = (t) => {
    const active = [];
    for (const sc of scenes) {
      const on = t >= sc.t0 && t < sc.t1;
      if (sc.on !== on) { sc.el.style.display = on ? 'block' : 'none'; sc.on = on; }
      if (on) active.push(sc);
    }
    const groups = [G, ...active];
    for (const g of groups) for (const n of g.nodes) n.reset();
    for (const g of groups) runActs(g.acts, t);
    for (const g of groups) for (const f of g.post) f(t);
    for (const g of groups) for (const n of g.nodes) n.commit(t);
  };
  E.finish = () => {
    if (bgmOpen) E.bgmStop(1.5);
    const end = E.T;
    for (const g of [G, ...scenes]) g.acts.sort((a, b) => a.t0 - b.t0 || a.seq - b.seq);
    for (const b of CUES.bgm) if (b.t1 == null || b.t1 > end) b.t1 = end;
    CUES.duration = +end.toFixed(3);
    E.DURATION = end;
    window.DURATION = end;
    window.CUES = CUES;
    window.LINES = LINES;
    window.renderFrame = E.renderFrame;
    window.ready = Promise.all([
      document.fonts.ready,
      ...IMGS.map(i => (i.complete ? Promise.resolve() : new Promise(r => { i.onload = r; i.onerror = r; }))),
    ]).then(() => Promise.all(IMGS.map(i => i.decode().catch(() => null)))).then(() => { E.renderFrame(0); return true; });
    return end;
  };

  /* ================================================================ 画面全体の層 */
  E.ui = mkEl('div', stage, {}, null); E.ui.id = 'ui';
  E.fxl = mkEl('div', stage, {}, null); E.fxl.id = 'fx';

  // 画面効果: 白フラッシュ
  const flashN = reg(new Node(mkEl('div', E.fxl, { left: 0, top: 0, width: W, height: H, background: '#fff' }, 'a'))).ini({ o: 0 });
  E.flash = (color = '#fff', dur = .35, peak = .9, delay = 0) => {
    const t0 = E.T + delay;
    act(t0, t0 + dur, k => { flashN.p.o = Math.max(flashN.p.o, peak * (1 - k) * (k < .12 ? k / .12 : 1)); flashN.el.style.background = color; }, true, G);
  };
  // 画面転換: 画面を覆う瞬間が E.T（その時刻でシーンを切り替える）
  const wipeEls = [];
  for (let i = 0; i < 7; i++) wipeEls.push(reg(new Node(mkEl('div', E.fxl, { left: -400, top: i * 190 - 130, width: 2720, height: 222 }, 'a'))).ini({ o: 0 }));
  const cover = reg(new Node(mkEl('div', E.fxl, { left: 0, top: 0, width: W, height: H, background: '#05070d' }, 'a'))).ini({ o: 0 });
  E.trans = (kind = 'stripes', { dur = 1.0, colors = ['#1d3766', '#27b4c2', '#f0b24a', '#1d3766', '#e0457b', '#27b4c2', '#1d3766'], color = '#05070d', sfx = true } = {}) => {
    const t0 = E.T - dur / 2, t1 = E.T + dur / 2;
    if (kind === 'stripes') {
      wipeEls.forEach((w, i) => {
        const d = i * .035, e = i * .03;
        act(t0, t1, k => {
          const kin = clamp((k - d) / (.5 - d)), kout = clamp((k - .5 - e) / (.5 - e));
          w.p.o = (kin > 0 && kout < 1) ? 1 : 0;
          w.p.x = kout > 0 ? lerp(0, 2900, EASE.in(kout)) : lerp(-2900, 0, EASE.out(kin));
          w.p.r = -6;
          if (w.c.bg !== colors[i % colors.length]) { w.el.style.background = colors[i % colors.length]; w.c.bg = colors[i % colors.length]; }
        }, true, G);
      });
      if (sfx) E.sfx('whoosh_big', { delay: -dur / 2 + .05, gain: .7 });
    } else if (kind === 'iris') {
      act(t0, t1, k => {
        cover.p.o = 1;
        const r = k < .5 ? lerp(1250, 0, EASE.in(k * 2)) : lerp(0, 1250, EASE.out((k - .5) * 2));
        cover.el.style.background = `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) ${r.toFixed(1)}px, ${color} ${(r + 2).toFixed(1)}px)`;
      }, true, G);
      if (sfx) E.sfx('whoosh', { delay: -dur / 2, gain: .6 });
    } else {
      // fade（暗転）/ flash（白）
      const bg = kind === 'flash' ? '#fff' : color;
      act(t0, t1, k => { cover.p.o = Math.sin(k * Math.PI); if (cover.c.bg !== bg) { cover.el.style.background = bg; cover.c.bg = bg; } }, true, G);
    }
  };

  // フィルムの粒子（ノイズ画像を毎フレームずらす）
  const noiseURL = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d'), d = x.createImageData(256, 256);
    for (let i = 0; i < 256 * 256; i++) { const v = Math.floor(rnd(i * .37 + 1) * 255); d.data[i * 4] = d.data[i * 4 + 1] = d.data[i * 4 + 2] = v; d.data[i * 4 + 3] = 255; }
    x.putImageData(d, 0, 0); return c.toDataURL();
  })();
  E.grain = (parent, amount = .08) => {
    const n = E.div(parent, { left: 0, top: 0, width: W, height: H, backgroundImage: `url(${noiseURL})`, mixBlendMode: 'overlay', opacity: amount }).ini({ o: amount });
    n.hook((p, t) => { const f = Math.floor(t * 24); n.el.style.backgroundPosition = `${Math.floor(rnd(f) * 256)}px ${Math.floor(rnd(f + 9) * 256)}px`; });
    return n;
  };
  E.vignette = (parent, strength = .55, color = '0,0,0') => E.div(parent, {
    left: 0, top: 0, width: W, height: H,
    background: `radial-gradient(ellipse at 50% 50%, rgba(${color},0) 55%, rgba(${color},${strength}) 100%)`,
  });

  // 集中線
  E.speedLines = (parent, { cx = W / 2, cy = H / 2, color = '#1d2a44', n = 70, inner = 330, outer = 1500, width = 1, seed = 1 } = {}) => {
    const node = E.svg(parent, { left: 0, top: 0, width: W, height: H }, `0 0 ${W} ${H}`, '<path/>');
    const path = node.svg.firstChild;
    path.setAttribute('fill', color);
    node.hook((p, t) => {
      if (p.o <= .002) return;
      const f = Math.floor(t * 20);
      let d = '';
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rnd(i * 7 + f * 13 + seed) * .08;
        const r0 = inner * (.75 + rnd(i * 3 + f * 5 + seed) * .6), w = (.004 + rnd(i + f * 2 + seed) * .012) * width;
        const x0 = cx + Math.cos(a) * r0, y0 = cy + Math.sin(a) * r0;
        const xa = cx + Math.cos(a - w) * outer, ya = cy + Math.sin(a - w) * outer;
        const xb = cx + Math.cos(a + w) * outer, yb = cy + Math.sin(a + w) * outer;
        d += `M${x0.toFixed(1)} ${y0.toFixed(1)}L${xa.toFixed(1)} ${ya.toFixed(1)}L${xb.toFixed(1)} ${yb.toFixed(1)}Z`;
      }
      path.setAttribute('d', d);
    });
    return node;
  };

  // 粒子（キャンバスに毎フレーム描く）
  E.particles = (parent, opts) => {
    const o = Object.assign({ n: 40, kind: 'sparkle', color: '#fff', area: [0, 0, W, H], speed: 1, size: 1, seed: 3 }, opts);
    const [ax, ay, aw, ah] = o.area;
    return E.canvas(parent, { left: ax, top: ay, width: aw, height: ah }, (ctx, t) => {
      ctx.clearRect(0, 0, aw, ah);
      for (let i = 0; i < o.n; i++) {
        const r1 = rnd(i * 3.1 + o.seed), r2 = rnd(i * 7.3 + o.seed), r3 = rnd(i * 1.7 + o.seed), r4 = rnd(i * 5.9 + o.seed);
        if (o.kind === 'sparkle') {
          const x = r1 * aw, y = (r2 * ah - t * 30 * o.speed * (.4 + r3)) % ah, yy = y < 0 ? y + ah : y;
          const tw = Math.max(0, Math.sin(t * (2 + r4 * 3) + i));
          const s = (3 + r3 * 7) * o.size * tw;
          ctx.fillStyle = o.color; ctx.globalAlpha = .85 * tw;
          ctx.beginPath(); ctx.moveTo(x, yy - s * 2); ctx.lineTo(x + s * .5, yy - s * .5); ctx.lineTo(x + s * 2, yy); ctx.lineTo(x + s * .5, yy + s * .5);
          ctx.lineTo(x, yy + s * 2); ctx.lineTo(x - s * .5, yy + s * .5); ctx.lineTo(x - s * 2, yy); ctx.lineTo(x - s * .5, yy - s * .5); ctx.closePath(); ctx.fill();
        } else if (o.kind === 'dust') {
          const x = (r1 * aw + Math.sin(t * .5 + i) * 30 + t * 12 * o.speed) % aw, y = (r2 * ah - t * 8 * o.speed * (.5 + r3) + ah * 10) % ah;
          ctx.globalAlpha = (.25 + .45 * r4) * (.6 + .4 * Math.sin(t * 1.3 + i));
          ctx.fillStyle = o.color; ctx.beginPath(); ctx.arc(x, y, (1.2 + r3 * 3.2) * o.size, 0, Math.PI * 2); ctx.fill();
        } else if (o.kind === 'ember') {
          const life = 3 + r3 * 3, ph = ((t * o.speed + r4 * life) % life) / life;
          const x = r1 * aw + Math.sin(t * 1.5 + i) * 20, y = ah * (1 - ph) + r2 * 40;
          ctx.globalAlpha = Math.sin(ph * Math.PI) * .9;
          ctx.fillStyle = o.color; ctx.beginPath(); ctx.arc(x, y, (1.5 + r2 * 3) * o.size, 0, Math.PI * 2); ctx.fill();
        } else if (o.kind === 'rain') {
          const x = (r1 * aw + t * 260 * o.speed * .25) % aw, y = (r2 * ah + t * 1300 * o.speed * (.8 + r3 * .4)) % ah;
          ctx.globalAlpha = .35 + r4 * .3; ctx.strokeStyle = o.color; ctx.lineWidth = 2 * o.size;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y - 46 * o.size); ctx.stroke();
        } else if (o.kind === 'confetti') {
          const x = (r1 * aw + Math.sin(t * 2 + i) * 40), y = (r2 * ah * -1 + t * 260 * o.speed * (.6 + r3)) % (ah + 200) - 100;
          ctx.save(); ctx.translate(x, y); ctx.rotate(t * (2 + r4 * 4) + i);
          ctx.globalAlpha = .95; ctx.fillStyle = o.colors ? o.colors[i % o.colors.length] : o.color;
          ctx.fillRect(-8 * o.size, -4 * o.size, 16 * o.size, 8 * o.size); ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
    });
  };

  /* ================================================================ 折れ線（描き進めるグラフ） */
  // pts: [[x, y], ...]（ローカル座標）。node.p.draw = 0〜1 で描く量
  E.polyline = (parent, pts, { left = 0, top = 0, width = W, height = H, color = '#fff', sw = 8, glow = 0, cap = 'round', dash = null, fill = null } = {}) => {
    let len = 0; const seg = [0];
    for (let i = 1; i < pts.length; i++) { len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(len); }
    const d = 'M' + pts.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L');
    const cid = `cp${seq++}`;
    const inner = (fill ? `<clipPath id="${cid}"><rect class="cr" x="0" y="-50" width="${width}" height="${height + 100}"/></clipPath><path d="${d}L${pts[pts.length - 1][0]} ${height}L${pts[0][0]} ${height}Z" fill="${fill}" stroke="none" clip-path="url(#${cid})"/>` : '')
      + `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="${cap}" stroke-linejoin="round" class="ln"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
    const node = E.svg(parent, { left, top, width, height }, `0 0 ${width} ${height}`, inner);
    node.el.firstChild.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    if (glow) node.el.style.filter = `drop-shadow(0 0 ${glow}px ${color})`;
    const ln = node.el.querySelector('.ln'), area = node.el.querySelector('.cr');
    if (!dash) { ln.setAttribute('stroke-dasharray', `${len + 1} ${len + 1}`); }
    node.ini({ draw: 1 });
    node.hook(p => {
      const dr = clamp(p.draw);
      if (node.c.dr === dr) return; node.c.dr = dr;
      // 丸い線端は長さ 0 でも点が残るので、描き始める前は隠す
      ln.style.visibility = dr > .001 ? '' : 'hidden';
      if (!dash) ln.setAttribute('stroke-dashoffset', ((1 - dr) * (len + 1)).toFixed(2));
      if (area) area.setAttribute('width', (dr * width).toFixed(1));
    });
    node.len = len;
    // 描き進めた先端の座標
    node.at = f => {
      const L = clamp(f) * len; let i = 1;
      while (i < seg.length - 1 && seg[i] < L) i++;
      const a = pts[i - 1], b = pts[i], k = (L - seg[i - 1]) / Math.max(1e-6, seg[i] - seg[i - 1]);
      return [left + lerp(a[0], b[0], k), top + lerp(a[1], b[1], k)];
    };
    return node;
  };

  /* ================================================================ 立ち絵 */
  const CH = n => `assets/chara/${n}.png`;
  const POSES = {
    bull: ['front', 'side', 'back', 'face_big'],
    baron: ['front', 'side', 'back', 'face_big', 'eyes'],
    pig: ['main', 'front', 'side', 'back'],
    hat: ['front', 'side', 'back'],
  };
  // x: 足元の中心, y: 足元の高さ, h: 表示する高さ
  E.actor = (parent, who, { x = W / 2, y = 980, h = 700, pose = POSES[who][0], shadow = true, sticker = false } = {}) => {
    const n = E.div(parent, { left: x, top: y - h, height: h }, null, 'a actor');
    n.isActor = true;
    n.el.style.transformOrigin = '0 100%';
    if (shadow) mkEl('div', n, { width: h * .42 }, 'shadow');
    const body = mkEl('div', n, {}, 'body');
    const imgs = {};
    for (const ps of POSES[who]) {
      const im = mkEl('img', body, {}, sticker ? 'sticker' : null);
      im.decoding = 'sync'; im.src = CH(ps === 'eyes' ? 'baron_eyes' : `${who}_${ps}`); IMGS.push(im); imgs[ps] = im;
    }
    n.ini({ pose, lift: 0 });
    n.hook(p => {
      if (n.c.pose !== p.pose) { for (const k in imgs) imgs[k].style.display = k === p.pose ? 'block' : 'none'; n.c.pose = p.pose; }
      const lift = p.lift || 0;
      if (n.c.lift !== lift) { body.style.transform = `translateY(${-lift}px)`; n.c.lift = lift; }
    });
    return n;
  };

  /* ================================================================ 字幕と声 */
  // 話者ごとの名前チップ（narr はナレーションなのでチップなし）
  const CAST = {
    narr: { chip: null, voice: 'narr' },
    bull: { chip: 'ブル', color: '#2f5aa8', voice: 'bull' },
    mentor: { chip: '押し目おじさん', color: '#25386b', voice: 'mentor' },
    baron: { chip: '男爵', color: '#8e1b2b', voice: 'baron' },
    hat: { chip: 'ハット', color: '#a57b3c', voice: 'hat' },
    eve: { chip: 'イブ', color: '#e0609a', voice: 'eve' },
    pig: { chip: 'ブタ', color: '#d0596a', voice: 'pig' },
    crowd: { chip: 'SNS', color: '#6b7a90', voice: 'crowd' },
  };
  E.CAST = CAST;
  let CHAP = '00';
  const LINES = [];
  E.LINES = LINES;
  E.chapter = id => { CHAP = id; window.CHAPTER = id; };
  // 声がまだ無い時（1 回目の読み込み）の長さの見積もり
  const estimate = src => {
    const plain = src.replace(/\{\w+\|([^}]*)\}/g, '$1');
    const n = [...plain].filter(c => !SILENT.test(c)).length;
    return .35 + n * .135;
  };
  const subBand = reg(new Node(mkEl('div', E.ui, {}, 'a'))).ini({ o: 0 });
  subBand.el.id = 'subband';
  const SUB = reg(new Node(mkEl('div', E.ui, {}, 'a')));
  SUB.el.id = 'sub';
  const subHTML = (who, src) => {
    const c = CAST[who] || CAST.narr;
    const L = E.line(src);
    let f = '', o = '';
    for (const sg of L.segs) {
      if (sg.br) { f += '<br>'; o += '<br>'; continue; }
      const tx = esc(sg.chars.join(''));
      f += sg.cls ? `<span class="s${sg.cls}">${tx}</span>` : tx;
      o += tx;
    }
    const chip = c.chip ? `<span class="chip" style="background:${c.color}">${esc(c.chip)}</span>` : '';
    return `<div class="row">${chip}<span class="st"><span class="o">${o}</span><span class="f">${f}</span></span></div>`;
  };
  SUB.hook(p => {
    const L = p.line;
    const key = L ? L.key : null;
    if (SUB.c.key !== key) {
      SUB.el.innerHTML = L ? subHTML(L.who, L.text) : '';
      SUB.c.key = key;
      // 1 行に収まらない時は文字を小さくする（折り返さない）
      const row = SUB.el.firstChild;
      if (row) {
        const st = row.querySelector('.st');
        const w = row.scrollWidth;
        if (w > 1760) st.style.fontSize = Math.max(34, 47 * 1740 / w).toFixed(1) + 'px';
      }
    }
    if (!L) p.o = 0;
  });
  subBand.hook(() => { subBand.p.o = SUB.p.line ? Math.max(subBand.p.o, 1) : 0; });
  // セリフ（字幕＋声）。カーソルは声が終わるまで進む（wait:false なら進めない）
  //   o.yomi: 読み上げ用の文字列（字幕と読みを変えたい時）, o.gap: 次のセリフまでの間, o.talk: 喋っている間ゆれる部品
  E.say = (who, src, o = {}) => {
    const id = `${CHAP}_${String(LINES.length + 1).padStart(3, '0')}`;
    LINES.push({ id, who, text: src, yomi: o.yomi || null });
    const V = window.VOICE || {};
    const dur = V[id] != null ? V[id] : estimate(o.yomi || src);
    const t0 = E.T + (o.delay || 0);
    act(t0, t0, () => { SUB.p.line = { who, text: src, key: id }; }, false, G);
    act(t0, t0 + .16, k => { SUB.p.o = Math.min(SUB.p.o, EASE.out(k)); SUB.p.y += (1 - EASE.out(k)) * 10; }, true, G);
    CUES.voices.push({ t: +t0.toFixed(4), id, who });
    if (o.talk) {
      const nd = o.talk;
      act(t0, t0 + dur, (k, t) => { nd.p.y += -Math.abs(Math.sin(t * 11)) * (o.talkAmp || 4); }, true, own(nd));
    }
    const end = t0 + dur + (o.gap != null ? o.gap : .32);
    if (o.wait !== false) E.T = end;
    return { t0, end, dur };
  };
  E.narr = (src, o = {}) => E.say('narr', src, o);
  E.unsub = (delay = 0) => { const t = E.T + delay; act(t, t, () => { SUB.p.line = null; }, false, G); };
  CUES.voices = [];

  /* ================================================================ 吹き出し */
  const spikePath = (w, h, n = 22, depth = .16, seed = 1) => {
    let d = '';
    for (let i = 0; i <= n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2, out = i % 2 === 0;
      const rr = out ? 1 + depth * (.6 + rnd(i + seed) * .8) : 1 - depth * .3;
      const x = w / 2 + Math.cos(a) * (w / 2) * rr * .98, y = h / 2 + Math.sin(a) * (h / 2) * rr * .98;
      d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    return d + 'Z';
  };
  // 吹き出し（カーソルは進めない）。o.life 秒で消える（0 なら消さない）
  E.bubble = (parent, src, o = {}) => {
    const { x = 200, y = 200, w = 520, kind = 'round', tail = 'bl', voice = null, cps = 26, life = 3, delay = 0, size = null, color = '#fff', border = '#1d2a44', ink = '#1d2a44', type = true, rot = 0 } = o;
    const n = E.div(parent, { left: x, top: y, width: w }, null, `a bub ${kind}`);
    const bx = mkEl('div', n, {}, 'bx');
    if (size) bx.style.fontSize = size + 'px';
    bx.style.background = kind === 'shout' ? 'transparent' : color; bx.style.borderColor = border; bx.style.color = ink;
    if (kind === 'shout') {
      const s = mkEl('div', bx, { left: 0, top: 0, width: '100%', height: '100%', position: 'absolute' }, null,
        `<svg class="spike" viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%"><path d="${spikePath(100, 100, 18, .2, x)}" fill="${color}" stroke="${border}" stroke-width="1.6" vector-effect="non-scaling-stroke" style="stroke-width:6px"/></svg>`);
      s.style.zIndex = 0;
    }
    const tx = reg(new Node(mkEl('div', bx, { position: 'relative', zIndex: 1 }, null))).hook(textHook);
    if (tail && kind !== 'shout') {
      const right = tail.includes('r'), up = tail.includes('t');
      const t = mkEl('div', n, {}, 'tail',
        kind === 'think'
          ? `<svg viewBox="0 0 70 56" width="100%" height="100%"><circle cx="${right ? 44 : 26}" cy="16" r="12" fill="${color}" stroke="${border}" stroke-width="5"/><circle cx="${right ? 58 : 12}" cy="44" r="7" fill="${color}" stroke="${border}" stroke-width="4"/></svg>`
          : `<svg viewBox="0 0 70 56" width="100%" height="100%"><path d="${right ? 'M8 0 L62 0 L66 52 Z' : 'M8 0 L62 0 L4 52 Z'}" fill="${color}" stroke="${border}" stroke-width="6" stroke-linejoin="round"/><rect x="4" y="-8" width="62" height="12" fill="${color}"/></svg>`);
      t.style[right ? 'right' : 'left'] = '60px';
      if (up) { t.style.top = 'auto'; t.style.bottom = '100%'; t.style.transform = 'scaleY(-1)'; t.style.marginBottom = '-7px'; }
    }
    n.ini({ o: 0, r: rot });
    const t0 = E.T + delay;
    E.tw(n, .32, { o: [0, 1], s: [.5, 1] }, 'back', delay);
    if (type) {
      const keep = E.T; E.T = t0; E.type(tx, src, { cps, voice }); E.T = keep;
    } else tx.ini({ line: E.line(src) });
    if (life) E.tw(n, .25, { o: 0, s: .8 }, 'in2', delay + life);
    n.text = tx;
    return n;
  };

  return E;
})();
