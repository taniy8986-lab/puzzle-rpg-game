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
  // 好きな文字と色のハンコ（判定など）
  P.mark = (parent, label, { x, y, color = '#c62828', size = 1, rot = -9, w = 210 } = {}) => E.div(parent, {
    left: x, top: y, minWidth: w * size, height: 104 * size, padding: `0 ${22 * size}px`, borderRadius: 20 * size,
    border: `${9 * size}px solid ${color}`, color, background: 'rgba(255,255,255,.9)', textAlign: 'center', whiteSpace: 'nowrap',
    font: `900 ${56 * size}px/${86 * size}px Zen`, letterSpacing: '.04em', boxShadow: '0 8px 18px rgba(0,0,0,.2)',
  }, label).ini({ o: 0, r: rot });
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
  P.committee = (parent, { x, y, w = 420, h = 300, label = '第三者委員会', sub = '会社の外の専門家', color = '#f3e6c8', n: count = 3 } = {}) => {
    const n = E.div(parent, { left: x, top: y, width: w, height: h, borderRadius: 26, background: 'rgba(255,255,255,.1)', border: `4px solid ${color}` });
    n.people = Array.from({ length: count }, (_, i) => E.svg(n, { left: w / 2 - count * 50 + i * 100, top: 40, width: 100, height: 112 }, '0 0 100 112', PERSON(color)));
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

  /* ================================================================ SNS・チャット・注文画面 */
  // スマホのタイムライン（投稿は要約したイメージ。アカウントは架空）
  P.sns = (ph, posts, { y = 84, title = 'タイムライン' } = {}) => {
    const sw = ph.sw;
    E.div(ph.screen, { left: 0, top: 0, width: sw, height: 1000, background: '#f6f7f9' });
    E.div(ph.screen, { left: 0, top: 54, width: sw, height: 64, background: '#fff', borderBottom: '2px solid #e6e8ec' },
      `<div style="position:absolute;left:0;top:0;width:100%;text-align:center;font:900 26px/64px Zen;color:#2a2d33">${title}</div>`);
    let yy = y + 50;
    return posts.map(p => {
      const n = E.div(ph.screen, { left: 12, top: yy, width: sw - 24, borderRadius: 18, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,.08)', padding: '16px 18px 14px' },
        `<div style="display:flex;align-items:center;gap:10px">
           <span style="flex:none;width:44px;height:44px;border-radius:50%;background:${p.color || '#7aa7d9'};color:#fff;font:900 22px/44px Zen;text-align:center">${p.icon || p.name[0]}</span>
           <span style="font:900 21px/1.2 Zen;color:#22252b;white-space:nowrap">${p.name}</span>
           <span style="font:800 17px/1.2 Round;color:#8b919c;white-space:nowrap">${p.handle || ''}</span></div>
         <div style="margin-top:10px;font:800 23px/1.5 Round;color:#2b2f36">${p.text}</div>
         <div style="margin-top:8px;font:800 18px/1 Round;color:#e0457b">♥ <span style="color:#8b919c">${p.likes || ''}</span></div>`).ini({ o: 0 });
      yy += p.h || 210;
      return n;
    });
  };
  // チャットの窓（大きめのパネル）
  P.chat = (parent, { x = 360, y = 60, w = 1200, h = 760, title = 'オープンチャット' } = {}) => {
    const n = E.div(parent, { left: x, top: y, width: w, height: h, borderRadius: 30, background: '#c9d6e6', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,.45)' });
    E.div(n, { left: 0, top: 0, width: w, height: 76, background: '#2f3a4c' },
      `<div style="position:absolute;left:0;top:0;width:100%;text-align:center;font:900 30px/76px Zen;color:#fff">${title}</div>`);
    n.w = w;
    return n;
  };
  P.chatMsg = (win, { name, text, y, color = '#8aa1c2', icon = null, w = 860, size = 34 } = {}) => {
    const n = E.div(win, { left: 30, top: y, width: win.w - 60 },
      `<div style="display:flex;gap:18px;align-items:flex-start">
         <span style="flex:none;width:70px;height:70px;border-radius:50%;background:${color};color:#fff;font:900 34px/70px Zen;text-align:center">${icon || name[0]}</span>
         <div><div style="font:800 24px/1.2 Round;color:#3d4757;margin:2px 0 8px 6px">${name}</div>
           <div style="display:inline-block;max-width:${w}px;background:#fff;border-radius:6px 28px 28px 28px;padding:18px 26px;font:800 ${size}px/1.5 Round;color:#222833;box-shadow:0 4px 10px rgba(0,0,0,.1)">${text}</div></div>
       </div>`).ini({ o: 0 });
    return n;
  };
  // 注文が成立した画面
  P.order = (ph, { name = 'エスポア（3260）', side = '買い', note = '追加' } = {}) => {
    const sw = ph.sw;
    const n = E.div(ph.screen, { left: 0, top: 0, width: sw, height: 1000, background: '#f4f6f9' }).ini({ o: 0 });
    E.svg(n, { left: sw / 2 - 70, top: 200, width: 140, height: 140 }, '0 0 100 100', '<circle cx="50" cy="50" r="44" fill="#17915a"/><path d="M28 52 L44 67 L73 36" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>');
    E.div(n, { left: 0, top: 370, width: sw, textAlign: 'center', font: '900 32px/1.4 Zen', color: '#22252b' }, '注文が成立しました');
    E.div(n, { left: 30, top: 450, width: sw - 60, borderRadius: 18, background: '#fff', padding: '22px 24px', font: '800 26px/1.7 Round', color: '#2b2f36', boxShadow: '0 4px 12px rgba(0,0,0,.08)' },
      `${name}<br><span style="color:#d22d68;font:900 30px Zen">${side}</span>　<span style="color:#8b919c;font-size:22px">${note ? `（${note}）` : ''}</span>`);
    return n;
  };

  /* ================================================================ チェックリスト・シーソー */
  P.checklist = (parent, items, { x, y, w = 1000, rowH = 110, size = 40 } = {}) => items.map((t, i) => {
    const n = E.div(parent, { left: x, top: y + i * rowH, width: w, height: rowH - 18, borderRadius: 18, background: 'rgba(255,255,255,.96)', boxShadow: '0 8px 18px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', paddingLeft: 30, font: `900 ${size}px/1.2 Zen`, color: '#262236', whiteSpace: 'nowrap' },
      `<span style="flex:none;display:inline-block;width:${size}px;height:${size}px;border-radius:8px;border:5px solid #8a8070;margin-right:24px"></span>${t}`).ini({ o: 0 });
    n.q = E.div(n, { left: w - 100, top: 0, width: 80, height: rowH - 18, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `900 ${size * 1.5}px/1 Zen`, color: '#e0353f' }, '？').ini({ o: 0 });
    return n;
  });
  // シーソー。beam を回すと左右の箱も一緒に傾く
  P.seesaw = (parent, { x = 960, y = 640, w = 1300, left = '', right = '', lc = '#e0457b', rc = '#b3122b' } = {}) => {
    E.svg(parent, { left: x - 90, top: y, width: 180, height: 150 }, '0 0 180 150', '<path d="M90 0 L176 150 L4 150Z" fill="#c9a24a"/>');
    const beam = E.div(parent, { left: x - w / 2, top: y - 26, width: w, height: 26, borderRadius: 13, background: '#e8dcc0', boxShadow: '0 6px 14px rgba(0,0,0,.3)' });
    beam.el.style.transformOrigin = '50% 100%';
    const box = (bx, text, c, bw) => E.div(beam, { left: bx, top: -200, width: bw, height: 200, borderRadius: 22, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', font: '900 40px/1.35 Zen', color: '#fff', boxShadow: '0 12px 24px rgba(0,0,0,.3)' }, `<div>${text}</div>`).ini({ o: 0 });
    beam.l = box(40, left, lc, 420);
    beam.r = box(w - 560, right, rc, 520);
    return beam;
  };

  /* ================================================================ 場面の型（章をまたいで使う） */
  // 解説用の黒板っぽい背景と見出し
  P.slate = g => {
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 40%, #2d3e5e 0%, #1d2942 65%, #121a2c 100%)' });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.035) 2px, transparent 2px)', backgroundSize: '60px 60px' });
  };
  P.heading = (g, text, y = 60) => E.div(g, { left: 0, top: y, width: W, textAlign: 'center', font: '900 58px/1.2 Zen', color: '#f3e6c8', textShadow: '0 4px 10px rgba(0,0,0,.4)' }, text).ini({ o: 0 });
  P.nightBg = g => E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 40%, #26305a 0%, #141a36 70%, #0b0f22 100%)' });
  // アジトの中の白いボード（左にハット、右にイブの通話）
  P.boardScene = (g, faces = ['normal', 'smile', 'surprise', 'anxious']) => {
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 50% 35%, #3d1b22 0%, #200d10 70%, #140707 100%)' });
    const hat = E.actor(g, 'hat', { x: 230, y: 1100, h: 640, pose: 'front' });
    E.breathe(hat, .01, 1.9);
    const call = P.call(g, { x: 1530, y: 560, w: 360, h: 290, faces });
    const bd = E.div(g, { left: 450, top: 50, width: 1020, height: 760, borderRadius: 20, background: '#fbf9f4', boxShadow: '0 24px 60px rgba(0,0,0,.55)' });
    E.from(bd, { y: 50, s: .97 }, .5, 0, 'quint');
    return { hat, call, bd };
  };
  // ぼかした部屋の前のスマホ。fill(ph) で画面の中身を作る（通知なら P.lock＋P.notice）
  P.phoneScene = (fill, { name = 'phone', zoom = true, wait = 3.9, night = false, bg = null } = {}) => {
    E.scene({ name }, sc => {
      const g = sc.cam;
      const back = E.div(g, { left: 0, top: 0, width: W, height: H }).ini({ blur: 12, bright: night ? .7 : .85 });
      const R = P.room(back, { night });
      P.watchlist(R.screen, [['エスポア', '3260 ｜ 名証']], { hi: 0 });
      const ph = P.phone(g, { x: 750, y: 110, w: 420, h: 850, bg: bg || (night ? 'linear-gradient(180deg,#1d2650,#0e1430)' : undefined) });
      E.from(ph, { y: 760 }, .6, 0, 'quint');
      E.sfx('whoosh');
      if (zoom) P.look(sc.cam, { s: 1.18, cx: 960, cy: 430, dur: 3.4, delay: 1.4 });
      fill(ph, sc);
      E.wait(wait);
    });
  };

  /* ================================================================ 第4章の図解 */
  // 画面のひび割れ（中心から放射状に伸びる線）。P.crackIn で一気に走らせる
  P.crack = (parent, { cx = W / 2, cy = H / 2, n = 11, len = 900, color = 'rgba(255,255,255,.9)', sw = 4, seed = 5 } = {}) => {
    const lines = [];
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2 + rnd(i + seed) * .4;
      const pts = [[0, 0]];
      let x = 0, y = 0, a = a0;
      const L = len * (.55 + rnd(i * 3 + seed) * .6), steps = 7;
      for (let k = 1; k <= steps; k++) {
        a += (rnd(i * 11 + k + seed) - .5) * .7;
        x += Math.cos(a) * L / steps; y += Math.sin(a) * L / steps;
        pts.push([x, y]);
      }
      const minx = Math.min(...pts.map(p => p[0])) - 10, miny = Math.min(...pts.map(p => p[1])) - 10;
      const maxx = Math.max(...pts.map(p => p[0])) + 10, maxy = Math.max(...pts.map(p => p[1])) + 10;
      const ln = E.polyline(parent, pts.map(p => [p[0] - minx, p[1] - miny]), { left: cx + minx, top: cy + miny, width: maxx - minx, height: maxy - miny, color, sw: sw * (.6 + rnd(i) * .8), glow: 6 }).ini({ draw: 0 });
      lines.push(ln);
    }
    return lines;
  };
  P.crackIn = (lines, delay = 0, dur = .22) => {
    lines.forEach((ln, i) => E.tw(ln, dur, { draw: [0, 1] }, 'out', delay + i * .012));
    E.sfx('shatter', { delay, gain: .8 });
  };
  // 万円の数を「1億868.2万円」「2,131.8万円」の形に
  const manFmt = v => {
    const a = Math.abs(v), sign = v < -.05 ? '▲' : (v > .05 ? '+' : '');
    const oku = Math.floor(a / 10000), rest = a - oku * 10000;
    const restS = rest.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/, ',');
    return sign + (oku ? `${oku}億${rest.toFixed(1)}` : restS) + '万円';
  };
  P.manFmt = manFmt;
  // 純資産の棒（p.v を動かす。単位は万円）。ゼロの線をまたぐと赤になる
  P.netBar = (parent, { x, y0, w = 220, scale = .03, label = '' } = {}) => {
    const bar = E.div(parent, { left: x, top: y0, width: w, height: 0, borderRadius: 10 });
    const val = E.div(parent, { left: x - 200, top: y0, width: w + 400, textAlign: 'center', font: '900 54px/1.2 Noto', whiteSpace: 'nowrap' });
    bar.ini({ v: 0 });
    bar.hook(p => {
      const v = p.v, h = Math.abs(v) * scale, neg = v < 0;
      const key = v.toFixed(1);
      if (bar.c.key === key) return; bar.c.key = key;
      const st = bar.el.style;
      st.top = (neg ? y0 : y0 - h) + 'px'; st.height = h + 'px';
      st.background = neg ? 'linear-gradient(180deg,#e04848,#b3122b)' : 'linear-gradient(180deg,#2ec27e,#17915a)';
      st.borderRadius = neg ? '0 0 10px 10px' : '10px 10px 0 0';
      val.el.textContent = manFmt(v);
      val.el.style.color = neg ? '#c62828' : '#17915a';
      val.el.style.top = (neg ? y0 + h + 16 : y0 - h - 74) + 'px';
    });
    bar.val = val;
    return bar;
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
  // time を渡すと時計を大きく、日付を小さく出す（夜は白い文字）。戻り値の time は E.set(..., { line: E.line('1:15') }) で変えられる
  P.lock = (ph, { date = '', week = '', time = null, night = false } = {}) => {
    const s = ph.screen, sw = ph.sw;
    const ink = night ? 'rgba(235,240,255,.92)' : 'rgba(50,32,32,.88)', sub = night ? 'rgba(220,228,255,.75)' : 'rgba(60,40,40,.75)';
    if (time == null) {
      E.div(s, { left: 0, top: 96, width: sw, textAlign: 'center', font: '800 28px/1.2 Round', color: sub }, week);
      E.div(s, { left: 0, top: 136, width: sw, textAlign: 'center', font: `900 ${date.length > 5 ? 80 : 96}px/1.1 Noto`, color: ink, letterSpacing: '-.02em', whiteSpace: 'nowrap' }, date);
      return {};
    }
    E.div(s, { left: 0, top: 92, width: sw, textAlign: 'center', font: '800 28px/1.2 Round', color: sub }, `${date}　${week}`);
    const tm = E.text(s, { left: 0, top: 128, width: sw, textAlign: 'center', font: '900 120px/1.1 Noto', color: ink, letterSpacing: '-.02em' }, time);
    return { time: tm };
  };
  // 通知カード（最初は隠れている。P.notifyIn で出す）
  P.notice = (ph, { app = '適時開示アラート', title = '', body = '', y = 300, icon = '開', iconBg = '#e04848', ago = '今' } = {}) => {
    const sw = ph.sw;
    const n = E.div(ph.screen, { left: 16, top: y, width: sw - 32, borderRadius: 26, background: 'rgba(255,255,255,.93)', boxShadow: '0 10px 24px rgba(60,30,30,.18)', padding: '18px 20px 20px' },
      `<div style="display:flex;align-items:center;gap:12px;font:800 20px/1.2 Round;color:#7a6f6f">
         <span style="display:inline-block;width:36px;height:36px;border-radius:9px;background:${iconBg};color:#fff;font:900 22px/36px Zen;text-align:center">${icon}</span>
         <span style="flex:1">${app}</span><span>${ago}</span></div>
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

  // 大画面に出す「適時開示」の一覧（玉座に隠れないよう上の方に並べる。3 行以上は詰めて小さく）
  P.board = (screen, title, rows) => {
    const compact = rows.length >= 3, hh = compact ? 54 : 60, rh = compact ? 46 : 60;
    const fd = compact ? 23 : 26, ft = compact ? 25 : 28;
    E.div(screen, { left: 0, top: 0, width: 840, height: hh, background: '#ebe6dc', borderBottom: '2px solid #d8d0c2' },
      `<div style="position:absolute;left:26px;top:0;font:900 ${compact ? 28 : 30}px/${hh}px Zen;color:#3a3236">${title}</div>`);
    return rows.map((r, i) => E.div(screen, { left: 0, top: hh + i * rh, width: 840, height: rh, borderBottom: '2px solid #ece7de' },
      `<div style="position:absolute;left:26px;top:0;font:800 ${fd}px/${rh}px Round;color:#8a8070">${r[0]}</div>
       <div style="position:absolute;left:118px;top:0;width:700px;font:900 ${ft}px/${rh}px Zen;color:${r[2] || '#2c2630'};white-space:nowrap">${r[1]}</div>`).ini({ o: 0 }));
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
  P.chapterCard = ({ n = 1, title = '', sub = '', dur = 3.6, subTop = false } = {}) => {
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
      if (sub) { const s = E.div(g, subTop ? { left: 0, top: 432, width: W - 200, textAlign: 'right', font: '800 38px/1.2 Round', color: 'rgba(255,255,255,.8)', whiteSpace: 'nowrap' } : { left: 1100, top: 620, font: '800 38px/1.2 Round', color: 'rgba(255,255,255,.8)', whiteSpace: 'nowrap' }, sub).ini({ o: 0 }); E.show(s, .5, 1.2); }
      E.sfx('dun', { delay: .45, gain: .7 });
      E.wait(dur);
    });
  };


  /* ================================================================ 完全版：投稿・IR・時刻・チャート */
  const T_BLUE = '#2b68d8', I_ORANGE = '#d9822b';
  P.T_BLUE = T_BLUE; P.I_ORANGE = I_ORANGE;
  const pill = (t, bg, ink) => `<span style="flex:none;padding:2px 14px 3px;border-radius:999px;background:${bg};color:${ink};font:800 20px/1.4 Round;white-space:nowrap">${t}</span>`;

  // 有名投資家の投稿カード（青 T）。本文は元資料の要約。名前・アカウントは出さない
  P.tcard = (parent, { id, when = '', kind = '', session = '', text = '', note = '', x, y, w = 820, size = 30 } = {}) => E.div(parent, {
    left: x, top: y, width: w, borderRadius: 20, background: '#fbfcff', overflow: 'hidden',
    boxShadow: '0 14px 30px rgba(0,0,0,.38)', borderLeft: `14px solid ${T_BLUE}`,
  }, `<div style="display:flex;align-items:center;gap:12px;padding:16px 22px 4px">
        <span style="flex:none;padding:3px 14px 4px;border-radius:10px;background:${T_BLUE};color:#fff;font:900 30px/1.2 Noto">${id}</span>
        <span style="font:900 24px/1.2 Zen;color:#22252b;white-space:nowrap">ある有名投資家の投稿</span>
        <span style="margin-left:auto;font:800 25px/1.2 Noto;color:${T_BLUE};white-space:nowrap">${when}</span></div>
      <div style="display:flex;gap:8px;padding:6px 22px 0">${[kind, session, '要約'].filter(Boolean).map(t => pill(t, '#e5eefc', '#1b4ea8')).join('')}</div>
      <div style="padding:10px 22px 16px;font:800 ${size}px/1.5 Round;color:#22252b">${text}</div>
      ${note ? `<div style="padding:12px 22px 16px;background:#eef2f8;font:800 23px/1.5 Round;color:#4a5466"><b style="color:${T_BLUE}">検証メモ</b>　${note}</div>` : ''}`).ini({ o: 0 });

  // 会社のIRカード（橙 I）
  P.icard = (parent, { id, when = '', session = '', title = '', text = '', note = '', x, y, w = 820, size = 28 } = {}) => E.div(parent, {
    left: x, top: y, width: w, borderRadius: 20, background: '#fffcf7', overflow: 'hidden',
    boxShadow: '0 14px 30px rgba(0,0,0,.38)', borderLeft: `14px solid ${I_ORANGE}`,
  }, `<div style="display:flex;align-items:center;gap:12px;padding:16px 22px 4px">
        <span style="flex:none;padding:3px 14px 4px;border-radius:10px;background:${I_ORANGE};color:#fff;font:900 30px/1.2 Noto">${id}</span>
        <span style="font:900 24px/1.2 Zen;color:#6b5a40;white-space:nowrap">エスポア　適時開示</span>
        <span style="margin-left:auto;font:800 25px/1.2 Noto;color:#b8651a;white-space:nowrap">${when}</span></div>
      <div style="display:flex;gap:8px;padding:6px 22px 0">${[session, '要約'].filter(Boolean).map(t => pill(t, '#fbeedd', '#9a5414')).join('')}</div>
      <div style="padding:10px 22px 2px;font:900 ${size + 4}px/1.4 Zen;color:#2a2230">${title}</div>
      <div style="padding:4px 22px 16px;font:800 ${size}px/1.5 Round;color:#3d3540">${text}</div>
      ${note ? `<div style="padding:12px 22px 16px;background:#f7efe3;font:800 23px/1.5 Round;color:#5c4a33"><b style="color:${I_ORANGE}">読み方</b>　${note}</div>` : ''}`).ini({ o: 0 });

  // 時刻を並べる帯：[I13 15:10] ──1分後──▶ [T11 15:11]
  P.timeLink = (parent, { x, y, w = 1300, a, b, label = '', ink = '#f3e6c8' } = {}) => {
    const chip = (c, left) => E.div(parent, { left, top: y, width: 420, height: 104, borderRadius: 20, background: '#fff', display: 'flex', alignItems: 'center', boxShadow: '0 10px 22px rgba(0,0,0,.35)', borderLeft: `12px solid ${c.color}` },
      `<span style="flex:none;margin-left:18px;padding:3px 12px 4px;border-radius:10px;background:${c.color};color:#fff;font:900 28px/1.2 Noto">${c.id}</span>
       <div style="margin-left:16px"><div style="font:900 40px/1.1 Noto;color:#22252b;white-space:nowrap">${c.time}</div><div style="font:800 21px/1.3 Round;color:#6a6066;white-space:nowrap">${c.sub || ''}</div></div>`).ini({ o: 0 });
    const A = chip(a, x), B = chip(b, x + w - 420);
    const ax = x + 430, aw = w - 860;
    const line = E.div(parent, { left: ax, top: y + 50, width: aw, height: 6, borderRadius: 3, background: ink, transformOrigin: '0 50%' }).ini({ sx: 0 });
    const head = E.div(parent, { left: ax + aw - 26, top: y + 34, font: '900 38px/1 Zen', color: ink }, '▶').ini({ o: 0 });
    const lab = E.div(parent, { left: ax, top: y - 4, width: aw, textAlign: 'center', font: '900 30px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, label).ini({ o: 0 });
    const R = { A, B, line, head, lab };
    R.in = (delay = 0) => {
      E.tw(A, .35, { o: [0, 1], x: [-30, 0] }, 'back', delay); E.sfx('pop', { delay, gain: .5 });
      E.tw(line, .45, { sx: [0, 1] }, 'out', delay + .35); E.show(head, .2, delay + .7); E.show(lab, .3, delay + .5);
      E.tw(B, .35, { o: [0, 1], x: [30, 0] }, 'back', delay + .8); E.sfx('pop', { delay: delay + .8, gain: .5 });
    };
    return R;
  };

  // 時計（min＝0:00 からの分。E.tw(clock, 1, { min: [0, 780] }) で 13:00 まで針を回す）
  P.clock = (parent, { x, y, size = 220, min = 0, face = '#fffdf8', ink = '#262230', label = '' } = {}) => {
    const n = E.div(parent, { left: x, top: y, width: size, height: size }).ini({ min });
    let ticks = '';
    for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180; ticks += `<line x1="${50 + Math.sin(a) * 40}" y1="${50 - Math.cos(a) * 40}" x2="${50 + Math.sin(a) * 45}" y2="${50 - Math.cos(a) * 45}" stroke="${ink}" stroke-width="${i % 3 ? 1.6 : 3}" stroke-linecap="round"/>`; }
    const sv = E.svg(n, { left: 0, top: 0, width: size, height: size }, '0 0 100 100',
      `<circle cx="50" cy="50" r="48" fill="${face}" stroke="${ink}" stroke-width="3"/>${ticks}
       <line class="hh" x1="50" y1="50" x2="50" y2="26" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"/>
       <line class="mm" x1="50" y1="50" x2="50" y2="13" stroke="#d42a2a" stroke-width="3" stroke-linecap="round"/>
       <circle cx="50" cy="50" r="4" fill="${ink}"/>`);
    const hh = sv.el.querySelector('.hh'), mm = sv.el.querySelector('.mm');
    if (label) E.div(n, { left: -60, top: size + 10, width: size + 120, textAlign: 'center', font: '900 34px/1.2 Noto', color: '#f3e6c8', whiteSpace: 'nowrap' }, label);
    n.hook(p => { const m = p.min; if (n.c.min === m) return; n.c.min = m; hh.setAttribute('transform', `rotate(${((m / 720) * 360).toFixed(2)} 50 50)`); mm.setAttribute('transform', `rotate(${((m % 60) * 6).toFixed(2)} 50 50)`); });
    return n;
  };

  // 元資料のチャート画像（2508×1026）を枠に入れる。crop は元画像の [x, y, 幅, 高さ]
  // n.at(px, py) で元画像の座標 → 親の座標、n.draw() で左から描き出す
  P.CHART_W = 2508; P.CHART_H = 1026;
  P.chart = (parent, src, { x = 0, y = 0, w = 1600, crop = [0, 0, 2508, 1026], bg = '#fff', radius = 18, shadow = true } = {}) => {
    const [cx, cy, cw, chh] = crop;
    const k = w / cw, h = chh * k;
    const n = E.div(parent, { left: x, top: y, width: w, height: h, borderRadius: radius, background: bg, overflow: 'hidden', boxShadow: shadow ? '0 20px 44px rgba(0,0,0,.45)' : 'none' });
    const inner = E.div(n, { left: 0, top: 0, width: w, height: h, overflow: 'hidden' }).ini({ reveal: 1 });
    E.img(inner, src, { left: -cx * k, top: -cy * k, width: P.CHART_W * k, height: P.CHART_H * k });
    inner.hook(p => { const r = Math.max(0, Math.min(1, p.reveal)); if (inner.c.reveal === r) return; inner.c.reveal = r; inner.el.style.clipPath = r >= 1 ? 'none' : `inset(0 ${((1 - r) * 100).toFixed(2)}% 0 0)`; });
    n.inner = inner; n.k = k; n.w = w; n.h = h;
    n.at = (px, py) => ({ x: x + (px - cx) * k, y: y + (py - cy) * k });
    n.draw = (dur = 2.5, delay = 0) => { inner.ini({ reveal: 0 }); E.tw(inner, dur, { reveal: [0, 1] }, 'inOut', delay); E.sfx('slide', { delay, gain: .4 }); };
    return n;
  };

  // 板（売数量・値段・買数量）。book は [['sell'|'buy', 値段, 数量], ...] を上から
  P.orderBook = (parent, { x, y, w = 800, book, last = null, rh = 52 } = {}) => {
    const hh = 70;
    const panel = E.div(parent, { left: x, top: y, width: w, height: hh + 20 + book.length * rh, borderRadius: 24, background: '#0f1a2e', boxShadow: '0 20px 40px rgba(0,0,0,.45)', overflow: 'hidden' }).ini({ o: 0 });
    const cw = w * .375, pw = w - cw * 2;
    E.div(panel, { left: 0, top: 0, width: w, height: hh, background: '#1b7a3a' },
      `<div style="display:flex;height:${hh}px;align-items:center;font:900 28px/1 Zen;color:#fff"><div style="width:${cw}px;text-align:center">売数量</div><div style="width:${pw}px;text-align:center">値段</div><div style="width:${cw}px;text-align:center">買数量</div></div>`);
    const rows = book.map(([side, p, v], i) => E.div(panel, { left: 0, top: hh + 10 + i * rh, width: w, height: rh, display: 'flex', alignItems: 'center', background: p === last ? 'rgba(255,216,74,.2)' : 'transparent', font: '800 32px/1 Noto' },
      `<div style="width:${cw}px;text-align:right;padding-right:40px;color:#ff8a8a">${side === 'sell' ? v.toLocaleString('en-US') : ''}</div>
       <div style="width:${pw}px;text-align:center;font-weight:900;color:${p === last ? '#ffd84a' : '#f3e6c8'}">${p}</div>
       <div style="width:${cw}px;text-align:left;padding-left:40px;color:#8ec5ff">${side === 'buy' ? v.toLocaleString('en-US') : ''}</div>`).ini({ o: 0 }));
    panel.rows = rows;
    panel.rowY = i => y + hh + 10 + i * rh + rh / 2;
    panel.in = (delay = 0) => { E.tw(panel, .45, { o: [0, 1], s: [.94, 1] }, 'back', delay); E.sfx('whoosh', { delay, gain: .6 }); rows.forEach((r, i) => E.tw(r, .3, { o: [0, 1], x: [-30, 0] }, 'out', delay + .4 + i * .07)); };
    return panel;
  };

  // 番号つきの小さな丸印（チャートの上に置く T・I の印）
  P.dot = (parent, { x, y, kind = 'T', label = '', size = 30 } = {}) => {
    const c = kind === 'T' ? T_BLUE : I_ORANGE;
    return E.div(parent, { left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: '50%', background: c, boxShadow: `0 0 0 5px rgba(255,255,255,.9), 0 0 18px ${c}` },
      label ? `<div style="position:absolute;left:${size + 8}px;top:-6px;padding:2px 10px;border-radius:8px;background:${c};color:#fff;font:900 24px/1.3 Noto;white-space:nowrap">${label}</div>` : '').ini({ o: 0 });
  };

  // 上の月の帯と「いまここ」の印。from/to は [月, 日]（start より小さい月は翌年）
  P.monthBar = (g, { year = 2024, start = 7, months = 6, from, to, x = 260, w = 1400, y = 52, delay = .2 } = {}) => {
    const ym = m => (m >= start ? [year, m] : [year + 1, m]);
    const idx = m => (m - start + 12) % 12;
    const dim = m => { const [yy, mm] = ym(m); return new Date(yy, mm, 0).getDate(); };
    const dayX = ([m, d]) => x + (idx(m) + (d - 1) / dim(m)) * (w / months);
    E.div(g, { left: x, top: y, width: w, height: 8, borderRadius: 4, background: 'rgba(243,230,200,.35)' });
    for (let i = 0; i < months; i++) {
      const m = (start - 1 + i) % 12 + 1;
      E.div(g, { left: x + i * w / months, top: y - 6, width: 3, height: 20, background: 'rgba(243,230,200,.55)' });
      E.div(g, { left: x + i * w / months, top: y + 16, width: w / months, textAlign: 'center', font: '800 22px/1.2 Round', color: 'rgba(243,230,200,.75)' }, `${m}月`);
    }
    const x0 = dayX(from), x1 = dayX(to);
    const fill = E.div(g, { left: x, top: y, width: Math.max(1, x1 - x), height: 8, borderRadius: 4, background: '#ffd84a', transformOrigin: '0 50%' }).ini({ sx: Math.max(.001, Math.min(1, (x0 - x) / Math.max(1, x1 - x))) });
    const ptr = E.div(g, { left: x0 - 60, top: y - 48, width: 120, textAlign: 'center', font: '900 26px/1.2 Noto', color: '#ffd84a', whiteSpace: 'nowrap' }, `${to[0]}/${to[1]}<div style="font-size:20px;line-height:16px">▼</div>`);
    E.tw(ptr, .8, { x: [0, x1 - x0] }, 'inOut', delay);
    E.tw(fill, .8, { sx: 1 }, 'inOut', delay);
    return ptr;
  };

  // 時刻のチップを矢印でつなぐ（3つ以上も並べられる）。R.in(i, delay) で i 番目を出す
  P.chain = (g, { x = 80, y = 150, w = 1760, items, gaps = [], cw = 420, ink = '#f3e6c8' }) => {
    const n = items.length, gap = (w - cw * n) / Math.max(1, n - 1);
    const chips = items.map((c, i) => E.div(g, { left: x + i * (cw + gap), top: y, width: cw, height: 104, borderRadius: 20, background: '#fff', display: 'flex', alignItems: 'center', boxShadow: '0 10px 22px rgba(0,0,0,.35)', borderLeft: `12px solid ${c.color}` },
      `<span style="flex:none;margin-left:18px;padding:3px 12px 4px;border-radius:10px;background:${c.color};color:#fff;font:900 28px/1.2 Noto">${c.id}</span>
       <div style="margin-left:16px"><div style="font:900 40px/1.1 Noto;color:#22252b;white-space:nowrap">${c.time}</div><div style="font:800 21px/1.3 Round;color:#6a6066;white-space:nowrap">${c.sub || ''}</div></div>`).ini({ o: 0 }));
    const arrows = items.slice(1).map((_, i) => {
      const ax = x + i * (cw + gap) + cw + 10, aw = gap - 20;
      const line = E.div(g, { left: ax, top: y + 50, width: aw, height: 6, borderRadius: 3, background: ink, transformOrigin: '0 50%' }).ini({ sx: 0 });
      const head = E.div(g, { left: ax + aw - 26, top: y + 34, font: '900 38px/1 Zen', color: ink }, '▶').ini({ o: 0 });
      const tx = E.div(g, { left: ax - 40, top: y - 6, width: aw + 80, textAlign: 'center', font: '900 28px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, gaps[i] || '').ini({ o: 0 });
      return { line, head, tx };
    });
    const R = { chips, arrows };
    R.in = (i, delay = 0) => {
      if (i > 0) { const a = arrows[i - 1]; E.tw(a.line, .45, { sx: [0, 1] }, 'out', delay); E.show(a.head, .2, delay + .35); E.show(a.tx, .3, delay + .15); delay += .45; }
      E.tw(chips[i], .35, { o: [0, 1], x: [i ? 30 : -30, 0] }, 'back', delay); E.sfx('pop', { delay, gain: .5 });
    };
    return R;
  };

  // 1日の時間の軸（m＝0:00 からの分 → x）。band＝[始, 終] で取引時間の帯、[[始, 終, 名前], ...] で前場・後場
  P.dayAxis = (g, { x = 160, y = 330, w = 1600, from = 420, to = 960, open = null, band = null, ink = '#f3e6c8' } = {}) => {
    const tx = m => x + (m - from) / (to - from) * w;
    const root = E.div(g, { left: 0, top: 0, width: W, height: H }).ini({ o: 0 });
    const bands = !band ? [] : Array.isArray(band[0]) ? band : [[band[0], band[1], '取引時間']];
    bands.forEach(([b0, b1, name], i) => {
      E.div(root, { left: tx(b0), top: y - 60, width: tx(b1) - tx(b0), height: 120, borderRadius: 14, background: 'rgba(255,216,74,.13)', border: '2px dashed rgba(255,216,74,.55)' });
      E.div(root, { left: tx(b0), top: y - 98, width: tx(b1) - tx(b0), textAlign: 'center', font: '900 28px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, name);
      const nx = bands[i + 1];
      if (nx) E.div(root, { left: tx(b1), top: y - 92, width: tx(nx[0]) - tx(b1), textAlign: 'center', font: '800 20px/1.2 Round', color: 'rgba(243,230,200,.7)', whiteSpace: 'nowrap' }, '昼休み');
    });
    E.div(root, { left: x, top: y - 3, width: w, height: 6, borderRadius: 3, background: ink });
    for (let m = Math.ceil(from / 60) * 60; m <= to; m += 60) {
      E.div(root, { left: tx(m) - 2, top: y - 14, width: 4, height: 28, background: ink });
      E.div(root, { left: tx(m) - 60, top: y + 22, width: 120, textAlign: 'center', font: '800 26px/1.2 Noto', color: 'rgba(243,230,200,.85)' }, `${m / 60}:00`);
    }
    if (open != null) E.div(root, { left: tx(open) - 90, top: y + 56, width: 180, textAlign: 'center', font: '900 24px/1.2 Zen', color: '#ffd84a' }, '取引開始');
    return { root, tx };
  };
  // 時間の軸の上の T・I の印（lift で名札を上へずらす）
  P.axisDot = (g, ax, { m, y, kind, label, up = true, lift = 0 }) => {
    const c = kind === 'T' ? T_BLUE : I_ORANGE;
    return E.div(g, { left: ax.tx(m) - 15, top: y - 15, width: 30, height: 30, borderRadius: '50%', background: c, boxShadow: `0 0 0 5px rgba(255,255,255,.9), 0 0 18px ${c}` },
      `<div style="position:absolute;left:50%;transform:translateX(-50%);${up ? `bottom:${44 + lift}px` : 'top:44px'};padding:3px 12px;border-radius:10px;background:${c};color:#fff;font:900 26px/1.3 Noto;white-space:nowrap">${label}</div>`).ini({ o: 0 });
  };
  // 小さなビデオ通話の窓（イブ）。最初は隠れている
  P.eveCall = (g, faces = ['normal'], { x = 1540, y = 560, w = 340, h = 270 } = {}) => P.call(g, { x, y, w, h, faces }).ini({ o: 0 });

  /* ================================================================ 投稿の画面（ユーザー提供のスクリーンショット） */
  // assets/posts/ の切り出し（名前・ハンドル・アイコン・表示回数・他の人の返信は切り出しの外）。大きさは切り出した画像のもの
  P.POST_SIZES = {"p01_img": [853, 1386], "p01_text": [1170, 378], "p02_img": [947, 1386], "p02_text": [1170, 177], "p03_img": [1114, 868], "p03_text": [1170, 601], "p04_img": [889, 1326], "p04_text": [1170, 234], "p05_img": [1114, 651], "p05_text": [1170, 234], "p06_img": [1114, 865], "p06_text": [1170, 297], "p07_img": [795, 1387], "p07_text": [1170, 70], "p08_img": [1063, 1248], "p08_text": [1170, 297], "p09_text": [1170, 449], "p10_img": [1170, 1779], "p10_text": [1170, 247], "p11_img": [1170, 2032], "p11_text": [1170, 373], "p12_img": [814, 1386], "p12_text": [1170, 298], "p13_img": [1170, 1728], "p13_text": [1170, 292], "p14_img": [1170, 1703], "p14_img2": [1170, 1741], "p14_text": [1170, 221], "p15_img": [1114, 1001], "p15_text": [1170, 228], "p16_img": [798, 1386], "p16_text": [1170, 76]};
  // 投稿の画面のカード。左に本文の画面、右に添付画像（そのまま）。
  //   id: 'T20' や '一覧外'、when: '2026/3/25 13:33' など、imgs: ['p01_img'] など
  P.postShot = (parent, { id = '', when = '', text = null, imgs = [], x = 80, y = 100, h = 780, textW = 620, maxW = 1760, listed = true, rows = [] } = {}) => {
    const SZ = P.POST_SIZES;
    const pad = 22, head = 64, foot = 40;
    const ih = h - pad * 2;
    let iw = imgs.map(k => SZ[k][0] * ih / SZ[k][1]);
    const tw = text ? textW : 0;
    const room = maxW - tw - pad * (imgs.length + (text ? 2 : 1));
    const sumw = iw.reduce((a, b) => a + b, 0);
    const k = sumw > room ? room / sumw : 1;
    iw = iw.map(w => w * k);
    const ihh = ih * k;
    const W = tw + iw.reduce((a, b) => a + b, 0) + pad * (imgs.length + (text ? 2 : 1));
    const card = E.div(parent, { left: x, top: y, width: W, height: h, borderRadius: 22, background: '#fbfcff', overflow: 'hidden', boxShadow: '0 16px 34px rgba(0,0,0,.42)', borderLeft: `12px solid ${T_BLUE}` }).ini({ o: 0 });
    let cx = pad;
    if (text) {
      const hd = E.div(card, { left: pad, top: pad, width: tw, height: head - 10, display: 'flex', alignItems: 'center', gap: '10px' },
        `<span style="flex:none;padding:3px 12px 4px;border-radius:10px;background:${listed ? T_BLUE : '#5a6b88'};color:#fff;font:900 24px/1.2 Noto">${id}</span>
         <span style="font:900 21px/1.2 Zen;color:#22252b;white-space:nowrap">ある有名投資家の投稿（画面）</span>`);
      E.div(card, { left: pad, top: pad + head - 8, width: tw, font: '800 22px/1.2 Noto', color: T_BLUE, whiteSpace: 'nowrap' }, when);
      const th = SZ[text][1] * tw / SZ[text][0];
      card.textImg = E.img(card, `assets/posts/${text}.png`, { left: pad, top: pad + head + 26, width: tw, height: th, borderRadius: 10, border: '2px solid #e3e8f0' });
      // 本文の下の札（元資料の要約・検証メモ、この動画の確認メモなど）。rows: [{ label, text, color }]
      const box = E.div(card, { left: pad, top: pad + head + 26 + th + 14, width: tw, display: 'flex', flexDirection: 'column', gap: '10px' });
      card.rows = rows.map(r => {
        const n = E.div(box, { position: 'relative', borderRadius: 12, background: r.bg || '#eef2f8', padding: '10px 16px 12px', boxSizing: 'border-box', font: '800 21px/1.5 Round', color: '#3d4556' },
          `<b style="color:${r.color || T_BLUE}">${r.label}</b>　${r.text}`).ini({ o: r.show === false ? 0 : 1 });
        return n;
      });
      E.div(card, { left: pad, top: h - foot - 6, width: tw, font: '800 15px/1.35 Round', color: '#6a7488' }, 'ユーザー提供のスクリーンショット。名前・アイコン・表示回数は隠しています');
      cx += tw + pad;
    }
    const lefts = [];
    card.imgs = imgs.map((kk, i) => {
      lefts.push(cx);
      const n = E.img(card, `assets/posts/${kk}.png`, { left: cx, top: pad + (ih - ihh) / 2, width: iw[i], height: ihh, borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,.25)' });
      cx += iw[i] + pad;
      return n;
    });
    card.W = W; card.H = h;
    // 添付画像の中の位置（切り出し画像の画素 px,py）→ 親の座標
    card.at = (i, px, py) => { const kk = imgs[i], sc = iw[i] / SZ[kk][0]; return { x: x + lefts[i] + px * sc, y: y + pad + (ih - ihh) / 2 + py * sc }; };
    return card;
  };

  // 完全版の注意書き（各章の最初と最後）
  P.K_NOTICE = ['ブルちゃん・空売り軍団とその売買・会話はフィクションで、実在の人物・団体とは関係ありません。',
    'エスポアの出来事・数値・投稿の要約は元資料（会社・名証の公表資料など）に基づきます。',
    '投稿の要約は投稿者本人の見解の要約です。投資助言ではありません。'];
  // 投稿の画面（ユーザー提供のスクリーンショット）を使う章の注意書き
  P.K_NOTICE_POSTS = ['ブルちゃん・空売り軍団とその売買・会話はフィクションで、実在の人物・団体とは関係ありません。',
    'エスポアの出来事・数値は元資料（会社・名証の公表資料など）に基づきます。投稿の画面はユーザー提供のスクリーンショットで、',
    '名前・アイコンは隠しています（元資料の一覧にない投稿を含む）。投稿の本文と要約は投稿者本人の見解です。投資助言ではありません。'];
  P.kNotice = (parent, { x = 160, y = 330, w = 1600, size = 34, dark = true, posts = false } = {}) => E.div(parent, {
    left: x, top: y, width: w, padding: '40px 50px', borderRadius: 28, background: dark ? 'rgba(10,14,30,.82)' : 'rgba(255,255,255,.92)',
    border: '3px solid rgba(255,216,74,.7)', textAlign: 'center', font: `800 ${size}px/1.7 Round`, color: dark ? '#f3e6c8' : '#262230',
  }, (posts ? P.K_NOTICE_POSTS : P.K_NOTICE).join('<br>')).ini({ o: 0 });

  return P;
})();
