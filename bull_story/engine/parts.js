// 章をまたいで使う舞台と小道具。
// 部屋（昼・夜）、空売り軍団のアジト、セピアの回想、スマホ、付箋、ノート、書類、カレンダー、
// 手描きの丸、事実・解釈・期待のハンコとカード、円グラフ、アップの画面、ビデオ通話の窓など。
// どれも E.scene の組み立て中に呼ぶ（部品はそのシーンに属する）。
'use strict';

const P = (() => {
  const { W, H, lerp, clamp, EASE, rnd } = E;
  const CH = n => `assets/chara/${n}.png`;
  const P = {};

  /* ================================================================ カメラ */
  // (cx, cy) を画面の中央へ寄せる。画面の外（黒）が見えないように移動量を制限する
  P.look = (cam, { s = 1.2, cx = W / 2, cy = H / 2, dur = 1, ease = 'inOut', delay = 0 } = {}) => {
    const mx = Math.max(0, (s - 1) * W / 2), my = Math.max(0, (s - 1) * H / 2);
    const x = clamp(-s * (cx - W / 2), -mx, mx), y = clamp(-s * (cy - H / 2), -my, my);
    return E.tw(cam, dur, { s, x, y }, ease, delay);
  };

  /* ================================================================ 共通の小物 */
  // 事実・解釈・期待
  const KIND = {
    fact: { label: '事実', c: '#17915a', l: '#e2f5ea', d: '#0e6b42' },
    interp: { label: '解釈', c: '#2b68d8', l: '#e5eefc', d: '#1b4ea8' },
    hope: { label: '期待', c: '#e0457b', l: '#fde7ef', d: '#b72a5c' },
  };
  P.KIND = KIND;

  // 小さな注意書きラベル（「※イメージです」など）
  P.note = (parent, text, { x = 1480, y = 26, size = 26, dark = false } = {}) => E.div(parent, {
    left: x, top: y, padding: '6px 18px 7px', borderRadius: 12, whiteSpace: 'nowrap',
    background: dark ? 'rgba(20,12,16,.7)' : 'rgba(255,255,255,.9)', color: dark ? '#f2e6e6' : '#4a4a55',
    font: `800 ${size}px/1.3 Round`, boxShadow: '0 4px 10px rgba(0,0,0,.15)',
  }, text);

  // 文字のチップ（「悪い決算」「意見を出せない」など）
  P.chip = (parent, text, { x, y, color = '#25386b', size = 44, ink = '#fff' } = {}) => E.div(parent, {
    left: x, top: y, padding: `${size * .22}px ${size * .55}px ${size * .28}px`, borderRadius: size * .32, whiteSpace: 'nowrap',
    background: color, color: ink, font: `900 ${size}px/1.2 Zen`, boxShadow: '0 8px 18px rgba(0,0,0,.28)',
  }, text).ini({ o: 0 });

  // 付箋
  P.sticky = (parent, html, { x, y, w = 300, h = 210, rot = -4, color = '#ffe274', size = 36, ink = '#4b3a1c' } = {}) => {
    const n = E.div(parent, {
      left: x, top: y, width: w, height: h, padding: '26px 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', background: `linear-gradient(170deg, ${color} 0%, ${color} 70%, #f5cf55 100%)`,
      boxShadow: '0 14px 22px rgba(40,30,10,.28)', font: `900 ${size}px/1.35 Zen`, color: ink,
    }, html).ini({ o: 0, r: rot });
    E.div(n, { left: w / 2 - 58, top: -18, width: 116, height: 36, background: 'rgba(255,255,255,.62)', boxShadow: '0 1px 3px rgba(0,0,0,.1)' }).ini({ r: -4 });
    return n;
  };
  P.slap = (n, delay = 0) => {
    E.tw(n, .34, { o: [0, 1], s: [1.45, 1] }, 'back', delay);
    E.sfx('tape', { delay: delay + .1 });
  };

  // ノートの紙
  P.paper = (parent, { x, y, w = 900, h = 640, rot = 0, lineGap = 52 } = {}) => E.div(parent, {
    left: x, top: y, width: w, height: h, borderRadius: 6,
    background: `linear-gradient(90deg, transparent 86px, rgba(222,90,90,.55) 86px, rgba(222,90,90,.55) 89px, transparent 89px),
      repeating-linear-gradient(180deg, #fffdf6 0 ${lineGap - 2}px, #cfe0f0 ${lineGap - 2}px ${lineGap}px)`,
    boxShadow: '0 22px 40px rgba(40,25,10,.3), 0 2px 4px rgba(0,0,0,.1)',
  }).ini({ r: rot });

  // 書類（適時開示のお知らせ風。ロゴなどは描かない）
  P.doc = (parent, { x, y, w = 860, h = 560, head = '適時開示', date = '', title = '', body = '', rot = 0 } = {}) => {
    const n = E.div(parent, {
      left: x, top: y, width: w, height: h, borderRadius: 8, background: '#fffefb',
      boxShadow: '0 24px 44px rgba(30,20,10,.3), 0 2px 4px rgba(0,0,0,.1)', overflow: 'hidden',
    }).ini({ r: rot });
    E.div(n, { left: 0, top: 0, width: w, height: 70, background: '#f3efe6', borderBottom: '2px solid #e2dccf' },
      `<div style="position:absolute;left:34px;top:14px;font:800 30px/40px Round;color:#6b6252">${head}</div>
       <div style="position:absolute;right:34px;top:16px;font:800 26px/40px Round;color:#8a8070">${date}</div>`);
    E.div(n, { left: 44, top: 104, width: w - 88, font: '900 36px/1.45 Zen', color: '#262230' }, title);
    E.div(n, { left: 44, top: 104 + 140, width: w - 88, font: '800 30px/1.7 Round', color: '#4a4552' }, body);
    return n;
  };

  // カレンダー（月曜始まりではなく日曜始まり）
  P.calendar = (parent, { x, y, w = 820, year = 2026, month = 5, rot = 0 } = {}) => {
    const cell = w / 7, headH = 150, rowH = cell * .7;
    const first = new Date(year, month - 1, 1).getDay();
    const days = new Date(year, month, 0).getDate();
    const rows = Math.ceil((first + days) / 7);
    const h = headH + 60 + rows * rowH + 30;
    const n = E.div(parent, { left: x, top: y, width: w, height: h, borderRadius: 10, background: '#fffdf8', boxShadow: '0 24px 44px rgba(30,20,10,.28)' }).ini({ r: rot });
    for (let i = 0; i < 9; i++) E.div(n, { left: 40 + i * (w - 80) / 8 - 9, top: -14, width: 18, height: 36, borderRadius: 9, background: '#7a7d86', boxShadow: 'inset 0 -4px 0 #5b5e66' });
    E.div(n, { left: 44, top: 40, font: '900 76px/1 Zen', color: '#2a2a33', whiteSpace: 'nowrap' }, `${month}<span style="font-size:40px">月</span> <span style="font:800 30px Round;color:#8a8478">${year}</span>`);
    const wk = ['日', '月', '火', '水', '木', '金', '土'];
    wk.forEach((d, i) => E.div(n, { left: i * cell, top: headH, width: cell, textAlign: 'center', font: '800 26px/1 Round', color: i === 0 ? '#d64545' : i === 6 ? '#2f73c9' : '#8a8478' }, d));
    for (let d = 1; d <= days; d++) {
      const k = first + d - 1, col = k % 7, row = Math.floor(k / 7);
      E.div(n, { left: col * cell, top: headH + 52 + row * rowH, width: cell, textAlign: 'center', font: '800 40px/1.2 Round', color: col === 0 ? '#d64545' : col === 6 ? '#2f73c9' : '#33333d' }, String(d));
    }
    n.pos = d => {
      const k = first + d - 1, col = k % 7, row = Math.floor(k / 7);
      return { x: x + col * cell + cell / 2, y: y + headH + 52 + row * rowH + 24 };
    };
    n.h = h;
    return n;
  };

  // 手描きの丸（描き込むアニメーション付き）
  P.circle = (parent, { x, y, w = 110, h = 80, color = '#e0353f', sw = 6, delay = 0, dur = .45, seed = 1, sound = true } = {}) => {
    const pad = 16, pts = [];
    const rx = w / 2, ry = h / 2, cx = rx + pad, cy = ry + pad;
    for (let i = 0; i <= 64; i++) {
      const a = -.5 + (i / 64) * (Math.PI * 2 + .75);
      const r = 1 + .045 * Math.sin(a * 3 + seed) + (i / 64) * .07;
      pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
    }
    const n = E.polyline(parent, pts, { left: x - cx, top: y - cy, width: w + pad * 2, height: h + pad * 2, color, sw }).ini({ draw: 0, r: -6 });
    E.tw(n, dur, { draw: [0, 1] }, 'inOut', delay);
    if (sound) E.sfx('pen', { delay, gain: .7 });
    return n;
  };

  // 下線を引く
  P.underline = (parent, { x, y, w, color = '#e0353f', sw = 7, delay = 0, dur = .35 } = {}) => {
    const n = E.polyline(parent, [[6, 10], [w * .5, 13], [w - 6, 8]], { left: x, top: y - 10, width: w, height: 24, color, sw }).ini({ draw: 0 });
    E.tw(n, dur, { draw: [0, 1] }, 'out', delay);
    E.sfx('pen', { delay, gain: .5 });
    return n;
  };

  // 赤い×
  P.cross = (parent, { x, y, s = 180, color = '#e0353f', sw = 16, delay = 0 } = {}) => {
    const a = E.polyline(parent, [[10, 10], [s - 10, s - 10]], { left: x - s / 2, top: y - s / 2, width: s, height: s, color, sw }).ini({ draw: 0 });
    const b = E.polyline(parent, [[s - 10, 10], [10, s - 10]], { left: x - s / 2, top: y - s / 2, width: s, height: s, color, sw }).ini({ draw: 0 });
    E.tw(a, .18, { draw: [0, 1] }, 'out', delay);
    E.tw(b, .18, { draw: [0, 1] }, 'out', delay + .16);
    E.sfx('buzz', { delay: delay + .1, gain: .6 });
    return [a, b];
  };

  // ハンコ（事実・解釈・期待）
  P.stamp = (parent, kind, { x, y, size = 1, rot = -9 } = {}) => {
    const k = KIND[kind];
    return E.div(parent, {
      left: x, top: y, width: 210 * size, height: 104 * size, borderRadius: 20 * size,
      border: `${9 * size}px solid ${k.c}`, color: k.c, background: 'rgba(255,255,255,.88)', textAlign: 'center',
      font: `900 ${60 * size}px/${86 * size}px Zen`, letterSpacing: '.08em', boxShadow: '0 8px 18px rgba(0,0,0,.2)',
    }, k.label).ini({ o: 0, r: rot });
  };
  P.stampIn = (n, delay = 0) => {
    E.tw(n, .26, { o: [0, 1], s: [2.3, 1] }, 'in2', delay);
    E.shake(n, .28, 7, delay + .26);
    E.sfx('stamp', { delay: delay + .24 });
  };

  // 事実・解釈・期待のカード
  const ICON = {
    fact: '<circle cx="42" cy="42" r="26" fill="none" stroke="#fff" stroke-width="9"/><path d="M62 62 L86 86" stroke="#fff" stroke-width="12" stroke-linecap="round"/>',
    interp: '<path d="M14 30 Q14 14 30 14 L78 14 Q94 14 94 30 L94 58 Q94 74 78 74 L46 74 L26 92 L30 74 Q14 74 14 58Z" fill="none" stroke="#fff" stroke-width="8" stroke-linejoin="round"/><circle cx="36" cy="44" r="6" fill="#fff"/><circle cx="54" cy="44" r="6" fill="#fff"/><circle cx="72" cy="44" r="6" fill="#fff"/>',
    hope: '<path d="M52 10 L63 38 L94 40 L70 59 L78 90 L52 73 L26 90 L34 59 L10 40 L41 38Z" fill="none" stroke="#fff" stroke-width="8" stroke-linejoin="round"/>',
  };
  P.card3 = (parent, kind, { x, y, w = 520, h = 360, body = '' } = {}) => {
    const k = KIND[kind];
    const n = E.div(parent, { left: x, top: y, width: w, height: h, borderRadius: 30, background: '#fffdf8', overflow: 'hidden', boxShadow: '0 20px 40px rgba(50,25,8,.28)' }).ini({ o: 0 });
    E.div(n, { left: 0, top: 0, width: w, height: 104, background: k.c },
      `<svg viewBox="0 0 104 104" style="position:absolute;left:26px;top:12px;width:80px;height:80px">${ICON[kind]}</svg>
       <div style="position:absolute;left:122px;top:0;font:900 62px/104px Zen;color:#fff;letter-spacing:.1em">${k.label}</div>`);
    E.div(n, { left: 34, top: 132, width: w - 68, font: '800 36px/1.55 Round', color: '#2c2a33' }, body);
    E.div(n, { left: 0, top: h - 14, width: w, height: 14, background: k.l });
    return n;
  };

  // 円グラフ（ドーナツ）。node.p.pct を 0→値 に動かす
  P.pie = (parent, { x, y, r = 130, sw = 58, color = '#e0457b', track = '#ece3d6', size = 76 } = {}) => {
    const R = r + sw, C = 2 * Math.PI * r;
    const n = E.svg(parent, { left: x - R, top: y - R, width: 2 * R, height: 2 * R }, `0 0 ${2 * R} ${2 * R}`,
      `<circle cx="${R}" cy="${R}" r="${r}" fill="none" stroke="${track}" stroke-width="${sw}"/>
       <circle class="arc" cx="${R}" cy="${R}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-dasharray="0 ${C}" transform="rotate(-90 ${R} ${R})"/>`);
    const arc = n.el.querySelector('.arc');
    const lab = E.div(parent, { left: x - 160, top: y - size * .62, width: 320, textAlign: 'center', font: `900 ${size}px/1.2 Noto`, color });
    n.ini({ pct: 0 });
    n.hook(p => {
      const v = clamp(p.pct, 0, 100);
      if (n.c.pct === v) return;
      arc.setAttribute('stroke-dasharray', `${(C * v / 100).toFixed(2)} ${C.toFixed(2)}`);
      lab.el.innerHTML = `${Math.round(v)}<span style="font-size:.55em">％</span>`;
      n.c.pct = v;
    });
    n.label = lab;
    return n;
  };

  /* ================================================================ 図解の部品 */
  // 会社のビル
  P.building = (parent, { x, y, w = 300, h = 380, label = '', color = '#3c4a66' } = {}) => {
    let win = '';
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) win += `<rect x="${48 + c * 72}" y="${70 + r * 56}" width="44" height="34" rx="4" fill="#ffe7a8" opacity="${.55 + ((r * 3 + c) % 3) * .15}"/>`;
    const n = E.div(parent, { left: x, top: y, width: w, height: h + 70 });
    E.svg(n, { left: 0, top: 0, width: w, height: h }, '0 0 300 380',
      `<rect x="20" y="30" width="260" height="350" rx="10" fill="${color}"/><rect x="0" y="16" width="300" height="26" rx="8" fill="#26324a"/>${win}
       <rect x="118" y="318" width="64" height="62" rx="6" fill="#26324a"/>`);
    if (label) E.div(n, { left: -100, top: h + 10, width: w + 200, textAlign: 'center', font: '900 40px/1.2 Zen', color: '#fff', textShadow: '0 3px 8px rgba(0,0,0,.4)', whiteSpace: 'nowrap' }, label);
    return n;
  };
  // 人のアイコン（委員会など）
  const PERSON = (c) => `<circle cx="50" cy="32" r="22" fill="${c}"/><path d="M10 112 Q12 62 50 60 Q88 62 90 112Z" fill="${c}"/>`;
  P.committee = (parent, { x, y, w = 420, h = 300, label = '第三者委員会', sub = '会社の外の専門家', color = '#f3e6c8' } = {}) => {
    const n = E.div(parent, { left: x, top: y, width: w, height: h, borderRadius: 26, background: 'rgba(255,255,255,.1)', border: `4px solid ${color}` });
    n.people = [0, 1, 2].map(i => E.svg(n, { left: w / 2 - 150 + i * 100, top: 40, width: 100, height: 112 }, '0 0 100 112', PERSON(color)));
    E.div(n, { left: 0, top: 170, width: w, textAlign: 'center', font: '900 40px/1.2 Zen', color }, label);
    if (sub) E.div(n, { left: 0, top: 222, width: w, textAlign: 'center', font: '800 26px/1.3 Round', color: 'rgba(243,230,200,.8)' }, sub);
    return n;
  };
  // 虫めがね
  P.magnifier = (parent, { x, y, size = 160, color = '#f3e6c8' } = {}) => E.svg(parent, { left: x - size / 2, top: y - size / 2, width: size, height: size }, '0 0 100 100',
    `<circle cx="40" cy="40" r="28" fill="rgba(200,230,255,.25)" stroke="${color}" stroke-width="9"/><path d="M61 61 L90 90" stroke="${color}" stroke-width="13" stroke-linecap="round"/>`);
  // 一時停止のマーク
  P.pauseMark = (parent, { x, y, size = 300, color = '#e0353f', label = '' } = {}) => {
    const n = E.div(parent, { left: x - size / 2, top: y - size / 2, width: size, height: size + (label ? 80 : 0) }).ini({ o: 0 });
    E.svg(n, { left: 0, top: 0, width: size, height: size }, '0 0 100 100',
      `<circle cx="50" cy="50" r="44" fill="rgba(255,255,255,.95)" stroke="${color}" stroke-width="7"/><rect x="34" y="28" width="11" height="44" rx="3" fill="${color}"/><rect x="55" y="28" width="11" height="44" rx="3" fill="${color}"/>`);
    if (label) E.div(n, { left: -100, top: size + 6, width: size + 200, textAlign: 'center', font: '900 52px/1.2 Zen', color: '#fff', textShadow: '0 4px 10px rgba(0,0,0,.5)' }, label);
    return n;
  };
  // 銘柄カードと赤い札
  P.stockCard = (parent, { x, y, w = 640, name = 'エスポア', code = '3260 ｜ 名証' } = {}) => {
    const n = E.div(parent, { left: x, top: y, width: w, height: 190, borderRadius: 24, background: '#fffdf8', boxShadow: '0 20px 40px rgba(0,0,0,.35)' });
    E.div(n, { left: 36, top: 30, font: '900 70px/1.2 Zen', color: '#262230', whiteSpace: 'nowrap' }, name);
    E.div(n, { left: 40, top: 126, font: '800 30px/1.2 Round', color: '#8a8070', whiteSpace: 'nowrap' }, code);
    return n;
  };
  P.tag = (parent, text, { x, y, rot = -4, color = '#c62828', size = 34 } = {}) => {
    const n = E.div(parent, {
      left: x, top: y, padding: `${size * .25}px ${size * .6}px ${size * .3}px ${size * .9}px`, borderRadius: 10, background: color, color: '#fff',
      font: `900 ${size}px/1.25 Zen`, whiteSpace: 'nowrap', boxShadow: '0 8px 16px rgba(0,0,0,.3)',
    }, text).ini({ o: 0, r: rot });
    E.div(n, { left: size * .3, top: '50%', width: size * .34, height: size * .34, borderRadius: '50%', background: '#fff', marginTop: -size * .17 });
    return n;
  };
  // 矢印（描き進める）
  P.arrow = (parent, { x1, y1, x2, y2, color = '#f3e6c8', sw = 10, head = 30, bend = 0 } = {}) => {
    const left = Math.min(x1, x2) - head - 20, top = Math.min(y1, y2) - head - 20 - Math.abs(bend);
    const w = Math.abs(x2 - x1) + (head + 20) * 2, h = Math.abs(y2 - y1) + (head + 20) * 2 + Math.abs(bend) * 2;
    const ax = x1 - left, ay = y1 - top, bx = x2 - left, by = y2 - top;
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const k = i / 24, mx = lerp(ax, bx, k), my = lerp(ay, by, k);
      const nx = -(by - ay), ny = bx - ax, L = Math.hypot(nx, ny) || 1;
      const b = Math.sin(k * Math.PI) * bend;
      pts.push([mx + nx / L * b, my + ny / L * b]);
    }
    const n = E.polyline(parent, pts, { left, top, width: w, height: h, color, sw });
    const ang = Math.atan2(pts[24][1] - pts[22][1], pts[24][0] - pts[22][0]) * 180 / Math.PI;
    const hd = E.svg(parent, { left: x2 - head, top: y2 - head, width: head * 2, height: head * 2 }, '-50 -50 100 100',
      `<path d="M50 0 L-30 -38 L-12 0 L-30 38Z" fill="${color}"/>`).ini({ r: ang, o: 0 });
    n.ini({ draw: 0 });
    n.head = hd;
    return n;
  };
  P.drawArrow = (a, dur = .5, delay = 0) => {
    E.tw(a, dur, { draw: [0, 1] }, 'out', delay);
    E.tw(a.head, .15, { o: [0, 1], s: [.4, 1] }, 'back', delay + dur * .85);
  };

  /* ================================================================ 背景・演出 */
  // 放射状の集中背景（驚き・喜びのアップ用）
  P.burst = (parent, { cx = W / 2, cy = H / 2, n = 26, c1 = '#fff1de', c2 = '#ffd9b3', spin = 5 } = {}) => {
    const R = 2300;
    let d = '';
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, a1 = ((i + .5) / n) * Math.PI * 2;
      d += `M0 0L${(R * Math.cos(a0)).toFixed(0)} ${(R * Math.sin(a0)).toFixed(0)}L${(R * Math.cos(a1)).toFixed(0)} ${(R * Math.sin(a1)).toFixed(0)}Z`;
    }
    const node = E.svg(parent, { left: cx - R, top: cy - R, width: 2 * R, height: 2 * R }, `${-R} ${-R} ${2 * R} ${2 * R}`,
      `<rect x="${-R}" y="${-R}" width="${2 * R}" height="${2 * R}" fill="${c1}"/><path d="${d}" fill="${c2}"/>`);
    E.spin(node, spin);
    return node;
  };

  // アップの画面（中央の縦長パネル＋左右の白い二重線）
  P.closeup = (parent, src, { bg = 'linear-gradient(180deg,#efe3d2,#e2d1bb)', panelW = 1040, panelBg = null, imgH = 1000, imgX = 0, imgY = 0, flip = false, burst = null, frame = true, fit = 'bust', pos = '50% 30%' } = {}) => {
    const R = {};
    R.bg = E.div(parent, { left: 0, top: 0, width: W, height: H, background: bg });
    if (burst) R.burst = P.burst(parent, burst);
    const left = (W - panelW) / 2;
    R.panel = E.div(parent, { left, top: 0, width: panelW, height: H, overflow: 'hidden', background: panelBg || 'transparent' });
    // 画像は中央下にそろえる（外側の箱を動かす）
    R.img = E.div(R.panel, { left: imgX, top: imgY, width: panelW, height: H, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' });
    R.img.el.style.transformOrigin = '50% 100%';
    const im = document.createElement('img');
    im.src = src; im.decoding = 'sync';
    Object.assign(im.style, fit === 'cover'
      ? { width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, display: 'block' }
      : { height: imgH + 'px', display: 'block', flex: 'none' });
    R.img.el.appendChild(im); E.registerImg(im); R.imgEl = im;
    if (flip) R.img.ini({ sx: -1 });
    // 表情の差し替え（同じ枠のまま画像だけ変える）
    R.swap = (src2, delay = 0) => { E.preload(src2); const t = E.T + delay; E.act(t, t, () => { R.img.p.src = src2; }, false, R.img.owner); };
    R.img.ini({ src });
    R.img.hook(p => { if (R.img.c.src !== p.src) { im.src = p.src; R.img.c.src = p.src; } });
    if (frame) {
      for (const side of [-1, 1]) {
        const lx = side < 0 ? left : left + panelW;
        E.div(parent, { left: lx - 3, top: 0, width: 6, height: H, background: '#fff', boxShadow: '0 0 12px rgba(0,0,0,.25)' });
        E.div(parent, { left: lx + side * 16 - 1, top: 0, width: 3, height: H, background: 'rgba(255,255,255,.85)' });
      }
    }
    return R;
  };

  /* ================================================================ ブルちゃんの部屋 */
  P.room = (parent, { night = false } = {}) => {
    const R = {};
    const g = parent;
    E.div(g, { left: -400, top: -200, width: W + 800, height: 1000, background: 'repeating-linear-gradient(90deg,#f8f0e4 0 66px,#f1e5d3 66px 132px)' });
    E.div(g, { left: -400, top: 0, width: W + 800, height: 800, background: 'linear-gradient(180deg, rgba(140,100,60,.16), rgba(140,100,60,0) 45%)' });
    E.div(g, { left: -400, top: 0, width: W + 800, height: 24, background: '#eadcc6', boxShadow: '0 3px 6px rgba(0,0,0,.08)' });
    // 窓
    const wx = 150, wy = 120, ww = 480, wh = 430;
    E.div(g, { left: wx - 70, top: wy - 46, width: ww + 140, height: 14, borderRadius: 7, background: '#b98f62' });
    R.sky = E.div(g, { left: wx, top: wy, width: ww, height: wh, overflow: 'hidden', background: night ? 'linear-gradient(180deg,#0b1430,#22305a)' : 'linear-gradient(180deg,#8ccdf0,#d4f0fb)' });
    if (night) {
      for (let i = 0; i < 22; i++) {
        const s = E.div(R.sky, { left: rnd(i + 3) * ww, top: rnd(i + 40) * wh * .8, width: 3 + rnd(i + 9) * 3, height: 3 + rnd(i + 9) * 3, borderRadius: '50%', background: '#fff' });
        E.post(t => { s.p.o = .4 + .6 * Math.abs(Math.sin(t * (.8 + rnd(i) * 1.5) + i)); });
      }
      E.div(R.sky, { left: ww - 170, top: 50, width: 86, height: 86, borderRadius: '50%', background: '#fff6c9', boxShadow: '0 0 40px 14px rgba(255,246,201,.45)' });
      E.div(R.sky, { left: ww - 150, top: 40, width: 80, height: 80, borderRadius: '50%', background: '#16224a' });
    } else {
      const clouds = [[40, 90, 1], [300, 200, .8], [-80, 300, 1.2]];
      clouds.forEach(([cx, cy, sc], i) => {
        const c = E.div(R.sky, { left: cx, top: cy, width: 220 * sc, height: 80 * sc },
          `<div style="position:absolute;left:0;top:${30 * sc}px;width:${220 * sc}px;height:${50 * sc}px;border-radius:${25 * sc}px;background:#fff"></div>
           <div style="position:absolute;left:${40 * sc}px;top:${8 * sc}px;width:${80 * sc}px;height:${70 * sc}px;border-radius:50%;background:#fff"></div>
           <div style="position:absolute;left:${100 * sc}px;top:0;width:${90 * sc}px;height:${80 * sc}px;border-radius:50%;background:#fff"></div>`);
        E.post(t => { c.p.x += ((t * (6 + i * 3)) % (ww + 400)) - 60; });
      });
    }
    E.div(g, { left: wx, top: wy, width: ww, height: wh, border: '18px solid #fbf9f4', boxShadow: 'inset 0 0 0 3px #e3dccd, 0 8px 16px rgba(80,50,20,.18)' });
    E.div(g, { left: wx + ww / 2 - 6, top: wy, width: 12, height: wh, background: '#fbf9f4' });
    E.div(g, { left: wx, top: wy + wh / 2 - 6, width: ww, height: 12, background: '#fbf9f4' });
    E.div(g, { left: wx - 26, top: wy + wh - 4, width: ww + 52, height: 26, borderRadius: 6, background: '#f6f2ea', boxShadow: '0 8px 12px rgba(80,50,20,.2)' });
    for (const side of [0, 1]) {
      E.div(g, {
        left: side ? wx + ww - 40 : wx - 90, top: wy - 40, width: 130, height: wh + 90, borderRadius: '0 0 30px 30px',
        background: 'repeating-linear-gradient(90deg, #f1b9b3 0 20px, #e7a49e 20px 34px)', boxShadow: '0 10px 18px rgba(80,40,30,.2)',
      });
    }
    // 棚と本
    E.div(g, { left: 1240, top: 262, width: 500, height: 20, borderRadius: 4, background: 'linear-gradient(180deg,#d2a573,#b98a58)', boxShadow: '0 8px 12px rgba(60,35,10,.22)' });
    const books = [['#d9534f', 120], ['#f0ad4e', 104], ['#5bc0de', 126], ['#5cb85c', 98], ['#8e6fb5', 116], ['#e8d5b7', 110], ['#3e6aa8', 124], ['#c96f53', 100]];
    let bx = 1268;
    books.forEach(([c, bh], i) => { const bw = 30 + (i % 3) * 6; E.div(g, { left: bx, top: 262 - bh, width: bw, height: bh, borderRadius: 3, background: c, boxShadow: 'inset -4px 0 0 rgba(0,0,0,.12)' }); bx += bw + 3; });
    E.div(g, { left: 1640, top: 196, width: 60, height: 66, borderRadius: '6px 6px 14px 14px', background: '#d98c5f' });
    for (let i = 0; i < 6; i++) E.div(g, { left: 1630 + (i % 3) * 22, top: 130 + Math.floor(i / 3) * 30, width: 44, height: 72, borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%', background: i % 2 ? '#5aa469' : '#6fbf7c' }).ini({ r: -30 + i * 14 });
    // 床
    E.div(g, { left: -400, top: 800, width: W + 800, height: 480, background: 'linear-gradient(180deg,#dbb68b,#c4966a)' });
    E.div(g, { left: -400, top: 800, width: W + 800, height: 480, background: 'repeating-linear-gradient(90deg, rgba(110,70,35,.15) 0 3px, transparent 3px 240px)' });
    E.div(g, { left: -400, top: 774, width: W + 800, height: 30, background: '#f0e3cd', boxShadow: '0 5px 8px rgba(80,50,20,.16)' });
    // 机
    E.div(g, { left: 990, top: 670, width: 22, height: 270, background: '#9c7046' });
    E.div(g, { left: 1708, top: 670, width: 22, height: 270, background: '#9c7046' });
    E.div(g, { left: 1000, top: 664, width: 720, height: 96, background: 'linear-gradient(180deg,#bd8d5c,#a97b4c)', borderRadius: '0 0 8px 8px' });
    E.div(g, { left: 1060, top: 690, width: 250, height: 44, borderRadius: 6, border: '3px solid rgba(80,50,20,.25)' });
    E.div(g, { left: 1170, top: 708, width: 34, height: 8, borderRadius: 4, background: '#e7c9a0' });
    E.div(g, { left: 950, top: 640, width: 820, height: 30, borderRadius: 8, background: 'linear-gradient(180deg,#d9ad7c,#c39363)', boxShadow: '0 8px 12px rgba(60,35,10,.25)' });
    // モニター
    E.div(g, { left: 1342, top: 610, width: 36, height: 34, background: '#2a2c32' });
    E.div(g, { left: 1290, top: 634, width: 140, height: 10, borderRadius: 5, background: '#2a2c32' });
    E.div(g, { left: 1100, top: 300, width: 520, height: 318, borderRadius: 16, background: '#1c1e24', boxShadow: '0 16px 26px rgba(30,20,10,.3)' });
    R.screen = E.div(g, { left: 1114, top: 314, width: 492, height: 290, borderRadius: 6, overflow: 'hidden', background: '#fbfcfe' });
    // 写真立て（師匠）
    R.photo = E.div(g, { left: 1000, top: 520, width: 100, height: 122, borderRadius: 6, background: '#8a5a30', boxShadow: '0 8px 12px rgba(40,20,5,.3)' }).ini({ r: -4 });
    E.img(R.photo, CH('mentor_photo'), { left: 9, top: 9, width: 82, height: 104, objectFit: 'cover', borderRadius: 2 });
    // マグカップ
    E.div(g, { left: 1640, top: 590, width: 56, height: 54, borderRadius: '6px 6px 14px 14px', background: '#3aa6a0', boxShadow: 'inset -8px 0 0 rgba(0,0,0,.12)' });
    E.div(g, { left: 1688, top: 600, width: 28, height: 30, borderRadius: '0 16px 16px 0', border: '7px solid #3aa6a0', borderLeft: 'none' });
    // 光
    if (night) {
      E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'rgba(16,22,58,.52)', mixBlendMode: 'multiply' });
      R.glow = E.div(g, { left: 900, top: 120, width: 920, height: 760, background: 'radial-gradient(ellipse at 50% 45%, rgba(190,215,255,.42), rgba(190,215,255,0) 62%)', mixBlendMode: 'screen' });
    } else {
      E.div(g, { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(ellipse at 22% 30%, rgba(255,244,214,.38), rgba(255,244,214,0) 55%)' });
    }
    return R;
  };

  // 部屋のモニターに出すウォッチリスト
  P.watchlist = (screen, rows, { title = 'ウォッチリスト', hi = -1 } = {}) => {
    E.div(screen, { left: 0, top: 0, width: 492, height: 48, background: '#eef2f8', borderBottom: '2px solid #dbe2ee' },
      `<div style="position:absolute;left:18px;top:0;font:800 24px/48px Round;color:#4a5466">${title}</div>`);
    return rows.map((r, i) => E.div(screen, {
      left: 0, top: 48 + i * 58, width: 492, height: 58, borderBottom: '1px solid #e6eaf1',
      background: i === hi ? 'rgba(255,214,90,.25)' : 'transparent',
    }, `<div style="position:absolute;left:18px;top:0;font:800 26px/58px Round;color:#262c38">${r[0]}</div>
        <div style="position:absolute;left:250px;top:0;font:800 22px/58px Round;color:#8a93a3">${r[1]}</div>`));
  };

  /* ================================================================ スマホ */
  P.phone = (parent, { x = 760, y = 110, w = 420, h = 840, bg = 'linear-gradient(180deg,#f9e8de,#f1d0c3)' } = {}) => {
    const n = E.div(parent, { left: x, top: y, width: w, height: h, borderRadius: 66, background: '#15161a', boxShadow: '0 34px 60px rgba(0,0,0,.42), inset 0 0 0 3px #40434c' });
    const scr = E.div(n, { left: 16, top: 16, width: w - 32, height: h - 32, borderRadius: 52, overflow: 'hidden', background: bg });
    E.div(scr, { left: (w - 32) / 2 - 62, top: 14, width: 124, height: 36, borderRadius: 20, background: '#0c0c0e' });
    n.screen = scr; n.sw = w - 32; n.sh = h - 32;
    return n;
  };
  P.lock = (ph, { date = '', week = '' } = {}) => {
    const s = ph.screen, sw = ph.sw;
    E.div(s, { left: 0, top: 96, width: sw, textAlign: 'center', font: '800 28px/1.2 Round', color: 'rgba(60,40,40,.75)' }, week);
    E.div(s, { left: 0, top: 136, width: sw, textAlign: 'center', font: '900 96px/1.1 Noto', color: 'rgba(50,32,32,.88)', letterSpacing: '-.02em' }, date);
  };
  // 通知カード（最初は隠れている。P.notifyIn で出す）
  P.notice = (ph, { app = '適時開示アラート', title = '', body = '', y = 300, icon = '開', iconBg = '#e04848' } = {}) => {
    const sw = ph.sw;
    const n = E.div(ph.screen, { left: 16, top: y, width: sw - 32, borderRadius: 26, background: 'rgba(255,255,255,.93)', boxShadow: '0 10px 24px rgba(60,30,30,.18)', padding: '18px 20px 20px' },
      `<div style="display:flex;align-items:center;gap:12px;font:800 20px/1.2 Round;color:#7a6f6f">
         <span style="display:inline-block;width:36px;height:36px;border-radius:9px;background:${iconBg};color:#fff;font:900 22px/36px Zen;text-align:center">${icon}</span>
         <span style="flex:1">${app}</span><span>今</span></div>
       <div style="margin-top:12px;font:900 26px/1.35 Zen;color:#2a2228">${title}</div>
       <div style="margin-top:6px;font:800 24px/1.45 Round;color:#3d3438">${body}</div>`).ini({ o: 0 });
    return n;
  };
  P.notifyIn = (n, delay = 0) => {
    E.tw(n, .45, { o: [0, 1], y: [-60, 0], s: [.92, 1] }, 'back', delay);
    E.sfx('notify', { delay });
  };

  /* ================================================================ ビデオ通話の窓 */
  P.call = (parent, { x, y, w = 430, h = 350, who = 'eve', faces = ['normal'], name = 'イブ' } = {}) => {
    const n = E.div(parent, { left: x, top: y, width: w, height: h, borderRadius: 22, background: '#1a1216', boxShadow: '0 0 0 6px #2c1d23, 0 20px 44px rgba(0,0,0,.55)' });
    const view = E.div(n, { left: 12, top: 12, width: w - 24, height: h - 24, borderRadius: 14, overflow: 'hidden', background: '#f7d9e4' });
    const imgs = {};
    for (const f of faces) {
      const im = document.createElement('img');
      im.src = CH(`${who}_e_${f}`); im.decoding = 'sync';
      Object.assign(im.style, { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'none' });
      view.el.appendChild(im); imgs[f] = im;
      E.registerImg(im);
    }
    n.ini({ face: faces[0] });
    n.hook(p => {
      if (n.c.face === p.face) return;
      for (const k in imgs) imgs[k].style.display = k === p.face ? 'block' : 'none';
      n.c.face = p.face;
    });
    E.div(n, { left: 24, top: 24, padding: '4px 16px 6px 12px', borderRadius: 999, background: 'rgba(20,10,14,.72)', color: '#fff', font: '800 24px/1.3 Round', whiteSpace: 'nowrap' },
      `<span style="color:#ff4d5e">●</span> 通話中 ${name}`);
    n.view = view;
    return n;
  };

  /* ================================================================ 空売り軍団のアジト */
  P.lair = (parent, { screen = true, call = true, faces = ['normal'] } = {}) => {
    const R = {};
    const g = parent;
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 34%, #3d1b22 0%, #261013 52%, #150808 100%)' });
    // 壁のうっすらしたローソク足と縦の光
    let candles = '';
    for (let i = 0; i < 46; i++) {
      const x = i * 42 + 10, up = rnd(i * 3.3) > .45, hgt = 30 + rnd(i * 1.7) * 120, y = 120 + rnd(i * 2.9) * 640;
      candles += `<rect x="${x}" y="${y}" width="16" height="${hgt}" fill="${up ? '#c0392b' : '#2a8c86'}"/><rect x="${x + 7}" y="${y - 20}" width="2" height="${hgt + 40}" fill="${up ? '#c0392b' : '#2a8c86'}"/>`;
    }
    E.svg(g, { left: 0, top: 0, width: W, height: H, opacity: .16 }, `0 0 ${W} ${H}`, candles);
    for (let i = 0; i < 18; i++) {
      const s = E.div(g, { left: rnd(i + 70) * W, top: 0, width: 3 + rnd(i + 5) * 5, height: H, background: 'linear-gradient(180deg, rgba(220,60,80,0), rgba(220,60,80,.22), rgba(220,60,80,0))' });
      E.post(t => { s.p.o = .4 + .6 * Math.abs(Math.sin(t * (.4 + rnd(i) * .5) + i)); });
    }
    // 大画面
    if (screen) {
      E.div(g, { left: 520, top: 70, width: 880, height: 520, borderRadius: 20, background: '#140b0d', boxShadow: '0 20px 50px rgba(0,0,0,.6)' });
      R.screen = E.div(g, { left: 540, top: 90, width: 840, height: 480, borderRadius: 8, overflow: 'hidden', background: '#f8f6f2' });
    }
    // 左のモニター（ローソク足のイメージ）
    let lc = '';
    for (let i = 0; i < 14; i++) {
      const up = rnd(i + 11) > .5, y = 60 + rnd(i * 5.1) * 170, hh = 40 + rnd(i * 2.2) * 90;
      lc += `<rect x="${24 + i * 28}" y="${y}" width="14" height="${hh}" fill="${up ? '#d0463c' : '#2f9c95'}"/><rect x="${30 + i * 28}" y="${y - 14}" width="2" height="${hh + 28}" fill="${up ? '#d0463c' : '#2f9c95'}"/>`;
    }
    E.div(g, { left: -20, top: 150, width: 450, height: 360, borderRadius: 18, background: '#120a0c', boxShadow: '0 16px 40px rgba(0,0,0,.6)' });
    E.svg(g, { left: 0, top: 170, width: 420, height: 320 }, '0 0 420 320', lc);
    // 玉座
    E.svg(g, { left: 730, top: 262, width: 460, height: 700 }, '0 0 460 700',
      `<path d="M40 700 L40 230 Q40 50 230 36 Q420 50 420 230 L420 700Z" fill="#5a0f1c" stroke="#c9a24a" stroke-width="12"/>
       <path d="M80 700 L80 250 Q80 100 230 88 Q380 100 380 250 L380 700Z" fill="#7a1527"/>
       <circle cx="230" cy="64" r="30" fill="#d9b25a"/>`);
    E.div(g, { left: 700, top: 650, width: 120, height: 110, borderRadius: 24, background: '#5a0f1c', border: '8px solid #c9a24a' });
    E.div(g, { left: 1100, top: 650, width: 120, height: 110, borderRadius: 24, background: '#5a0f1c', border: '8px solid #c9a24a' });
    // 段と赤い絨毯
    for (let i = 0; i < 4; i++) E.div(g, { left: 260, top: 880 + i * 50, width: 1400, height: 50, background: i % 2 ? '#2a1315' : '#311618', borderTop: '3px solid #9a7434' });
    E.svg(g, { left: 0, top: 860, width: W, height: 220 }, `0 0 ${W} 220`, `<path d="M880 0 L1040 0 L1110 220 L810 220Z" fill="#8c1626"/>`);
    // キャラクター
    R.baron = E.actor(g, 'baron', { x: 960, y: 930, h: 630, pose: 'front' });
    R.hat = E.actor(g, 'hat', { x: 380, y: 1090, h: 720, pose: 'front' });
    R.pigs = [];
    const pigPos = [[1560, 1030, 470, .55], [1760, 1030, 470, .55], [1660, 1060, 520, .7], [1470, 1110, 560, 1], [1820, 1110, 560, 1]];
    pigPos.forEach(([x, y, h, br], i) => {
      const pg = E.actor(g, 'pig', { x, y, h, pose: 'main', shadow: br > .9 });
      pg.ini({ bright: br });
      if (i === 4) pg.ini({ sx: -1 });
      R.pigs.push(pg);
    });
    if (call) R.call = P.call(g, { x: 1470, y: 150, w: 430, h: 350, who: 'eve', faces, name: 'イブ' });
    E.vignette(g, .5);
    return R;
  };

  // 大画面に出す「適時開示」の一覧（玉座に隠れないよう上の方に小さめに並べる）
  P.board = (screen, title, rows) => {
    E.div(screen, { left: 0, top: 0, width: 840, height: 60, background: '#ebe6dc', borderBottom: '2px solid #d8d0c2' },
      `<div style="position:absolute;left:26px;top:0;font:900 30px/60px Zen;color:#3a3236">${title}</div>`);
    return rows.map((r, i) => E.div(screen, { left: 0, top: 60 + i * 60, width: 840, height: 60, borderBottom: '2px solid #ece7de' },
      `<div style="position:absolute;left:26px;top:0;font:800 26px/60px Round;color:#8a8070">${r[0]}</div>
       <div style="position:absolute;left:118px;top:0;width:700px;font:900 28px/60px Zen;color:${r[2] || '#2c2630'};white-space:nowrap">${r[1]}</div>`).ini({ o: 0 }));
  };

  /* ================================================================ 回想（セピア） */
  P.sepia = (parent) => {
    E.div(parent, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 64% 38%, #fff0d2 0%, #f0c68e 38%, #b57d45 78%, #7d4f25 100%)' });
    for (let i = 0; i < 16; i++) {
      const r = 40 + rnd(i * 4.4) * 110;
      const b = E.div(parent, { left: rnd(i * 2.2) * W - r, top: rnd(i * 6.6) * H * .8 - r / 2, width: r * 2, height: r * 2, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,240,205,.55), rgba(255,240,205,0) 70%)' });
      E.post(t => { b.p.x += Math.sin(t * .3 + i) * 14; b.p.y += Math.cos(t * .25 + i) * 10; b.p.o = .5 + .5 * Math.sin(t * .6 + i * 1.3); });
    }
    const rays = E.svg(parent, { left: 1180 - 1400, top: 300 - 1400, width: 2800, height: 2800, opacity: .1 }, '-1400 -1400 2800 2800',
      Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2, b = a + .07; return `<path d="M0 0L${1400 * Math.cos(a)} ${1400 * Math.sin(a)}L${1400 * Math.cos(b)} ${1400 * Math.sin(b)}Z" fill="#fff6dc"/>`; }).join(''));
    E.spin(rays, 2);
  };
  // 師匠のシルエット（逆光）。腕は別の部品にして、上げ下げできるようにする
  const SIL = '#2a1a10';
  P.MENTOR_SVG = () => `
    <svg viewBox="0 0 300 620" width="100%" height="100%" style="overflow:visible"><g fill="${SIL}">
      <ellipse cx="150" cy="92" rx="56" ry="62"/>
      <path d="M100 104 Q104 168 150 196 Q196 168 200 104 Q186 140 150 146 Q114 140 100 104Z"/>
      <ellipse cx="94" cy="100" rx="11" ry="17"/><ellipse cx="206" cy="100" rx="11" ry="17"/>
      <path d="M124 170 L176 170 L182 196 L118 196Z"/>
      <path d="M150 190 C70 192 56 226 58 300 L74 470 L226 470 L242 300 C244 226 230 192 150 190Z"/>
      <path d="M236 214 Q262 228 266 300 L278 430 Q280 470 250 470 L238 466 L232 330 Z"/>
      <path d="M84 462 L216 462 L222 520 L78 520Z"/>
      <path d="M82 512 L144 512 L140 600 L92 600Z"/><path d="M156 512 L218 512 L208 600 L160 600Z"/>
      <ellipse cx="112" cy="604" rx="38" ry="14"/><ellipse cx="190" cy="604" rx="38" ry="14"/>
    </g></svg>`;
  const ARM_SVG = `<svg viewBox="0 0 300 620" width="100%" height="100%" style="overflow:visible"><g fill="${SIL}">
      <path d="M64 214 Q38 228 34 300 L22 430 Q20 466 48 470 L62 466 L68 330 Z"/>
      <ellipse cx="38" cy="476" rx="22" ry="20"/></g></svg>`;
  const FINGERS_SVG = `<svg viewBox="0 0 300 620" width="100%" height="100%" style="overflow:visible"><g fill="${SIL}">
      <rect x="18" y="478" width="11" height="40" rx="5.5"/><rect x="32" y="482" width="11" height="44" rx="5.5"/><rect x="46" y="478" width="11" height="40" rx="5.5"/></g></svg>`;
  P.mentor = (parent, { x = 1200, y = 1000, h = 820 } = {}) => {
    const box = { left: x - h * .25, top: y - h, width: h * .5, height: h };
    const n = E.div(parent, box, null, 'a rimglow');
    n.el.style.transformOrigin = '50% 100%';
    E.div(n, { left: 0, top: 0, width: h * .5, height: h }, P.MENTOR_SVG());
    // 肩（64, 222）を軸に回す
    n.arm = E.div(n, { left: 0, top: 0, width: h * .5, height: h }, ARM_SVG);
    n.arm.el.style.transformOrigin = `${(64 / 300 * 100).toFixed(2)}% ${(222 / 620 * 100).toFixed(2)}%`;
    n.fingers = E.div(n.arm, { left: 0, top: 0, width: h * .5, height: h }, FINGERS_SVG).ini({ o: 0 });
    return n;
  };
  // 腕を上げて指を三本立てる / 下ろす
  P.raiseArm = (m, delay = 0, deg = 152) => {
    E.tw(m.arm, .55, { r: [0, deg] }, 'back', delay);
    E.show(m.fingers, .25, delay + .4);
  };
  P.lowerArm = (m, delay = 0) => {
    E.tw(m.arm, .5, { r: 0 }, 'inOut', delay);
    E.hide(m.fingers, .2, delay);
  };

  /* ================================================================ タイトル・章扉 */
  P.titleScene = ({ series = 'ブルちゃん証券', title = '株価の向こう側', arc = '', catchCopy = '', dur = 6.5 } = {}) => {
    E.scene({ name: 'title', bg: '#10224a' }, sc => {
      const g = sc.cam;
      E.div(g, { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(circle at 70% 45%, #2c5596 0%, #1d3766 48%, #0e1d40 100%)' });
      E.div(g, { left: 0, top: 0, width: W, height: H, backgroundImage: 'radial-gradient(rgba(255,255,255,.07) 2px, transparent 2.6px)', backgroundSize: '38px 38px' });
      const rays = P.burst(g, { cx: 1440, cy: 520, n: 22, c1: 'rgba(0,0,0,0)', c2: 'rgba(255,255,255,.06)', spin: 6 });
      E.show(rays, 1.2);
      const ring = E.div(g, { left: 1170, top: 250, width: 540, height: 540, borderRadius: '50%', border: '6px solid rgba(39,180,194,.55)' }).ini({ o: 0 });
      E.tw(ring, .9, { o: [0, 1], s: [.6, 1] }, 'back', .5);
      E.spin(ring, 18);
      const bull = E.img(g, CH('bull_front'), { left: 1310, top: 120, height: 880 }, 'a sticker').ini({ o: 0 });
      E.tw(bull, .9, { o: [0, 1], y: [400, 0] }, 'quint', .7);
      E.float(bull, 7, 2.2);
      E.particles(g, { n: 36, kind: 'sparkle', color: '#fff6c8', area: [0, 0, W, H], speed: .8, seed: 7 });
      const pill = E.div(g, { left: 150, top: 230, padding: '8px 34px 10px', borderRadius: 999, background: '#27b4c2', color: '#fff', font: '900 40px/1.2 Zen', whiteSpace: 'nowrap' }, series).ini({ o: 0 });
      E.tw(pill, .5, { o: [0, 1], x: [-60, 0] }, 'out', .4);
      const ttl = E.chars(g, title, { left: 130, top: 300, font: '900 150px/1.3 Zen', color: '#fff', textShadow: '0 10px 0 #27b4c2', padding: '0 20px 30px' });
      ttl.spans.forEach((sp, i) => E.tw(sp, .6, { o: [0, 1], y: [-120, 0], s: [.4, 1], r: [-14, 0] }, 'back', .6 + i * .07));
      const line = E.div(g, { left: 150, top: 560, width: 900, height: 8, borderRadius: 4, background: '#27b4c2', transformOrigin: '0 50%' }).ini({ sx: 0 });
      E.tw(line, .7, { sx: [0, 1] }, 'inOut', 1.4);
      if (arc) { const a = E.div(g, { left: 150, top: 600, font: '900 56px/1.3 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, arc).ini({ o: 0 }); E.tw(a, .6, { o: [0, 1], y: [30, 0] }, 'out', 1.7); }
      if (catchCopy) { const c = E.div(g, { left: 150, top: 690, font: '800 48px/1.3 Round', color: '#fff', whiteSpace: 'nowrap' }, catchCopy).ini({ o: 0 }); E.tw(c, .6, { o: [0, 1], y: [30, 0] }, 'out', 2.1); }
      E.sfx('fanfare', { delay: .5, gain: .8 });
      E.sfx('sparkle', { delay: 1.0, gain: .6 });
      E.tw(sc.cam, dur, { s: [1, 1.04] }, 'linear');
      E.wait(dur);
    });
  };
  P.chapterCard = ({ n = 1, title = '', sub = '', dur = 3.6 } = {}) => {
    E.scene({ name: 'chapter', bg: '#f6efe2' }, sc => {
      const g = sc.cam;
      E.div(g, { left: 0, top: 0, width: W, height: H, background: 'repeating-linear-gradient(90deg,#f8f1e5 0 66px,#f2e7d6 66px 132px)' });
      const band = E.div(g, { left: 0, top: 380, width: W, height: 320, background: '#1d3766' }).ini({ sx: 0 });
      band.el.style.transformOrigin = '0 50%';
      E.tw(band, .55, { sx: [0, 1] }, 'quint', .1);
      const num = E.div(g, { left: 200, top: 410, font: '900 84px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, `第${n}章`).ini({ o: 0 });
      E.tw(num, .45, { o: [0, 1], x: [-60, 0] }, 'out', .45);
      const tt_ = E.chars(g, title, { left: 200, top: 510, font: '900 120px/1.2 Zen', color: '#fff' });
      tt_.spans.forEach((sp, i) => E.tw(sp, .45, { o: [0, 1], y: [40, 0] }, 'back', .7 + i * .06));
      if (sub) { const s = E.div(g, { left: 1100, top: 620, font: '800 38px/1.2 Round', color: 'rgba(255,255,255,.8)', whiteSpace: 'nowrap' }, sub).ini({ o: 0 }); E.show(s, .5, 1.2); }
      E.sfx('dun', { delay: .45, gain: .7 });
      E.wait(dur);
    });
  };

  return P;
})();
