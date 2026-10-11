/* 背景（場所）。どれも 1920x1080 の DOM/SVG で描き、far / mid / near の 3 層に分けてパンで視差が出るようにする。
 * window.BACKGROUNDS[id](parent) → { el, layers: {far, mid, near}, floor, update(t) }
 */
(function () {
  'use strict';
  const W = 1920, H = 1080;
  const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  function layer(parent, inner, extra = '') {
    const d = document.createElement('div');
    d.className = 'a';
    d.style.left = '-160px'; d.style.top = '-60px';
    d.style.width = `${W + 320}px`; d.style.height = `${H + 120}px`;
    d.innerHTML = `<svg viewBox="-160 -60 ${W + 320} ${H + 120}" width="${W + 320}" height="${H + 120}" ${extra}>${inner}</svg>`;
    parent.appendChild(d);
    return d;
  }
  function base(parent) {
    const el = document.createElement('div');
    el.className = 'layer';
    el.style.overflow = 'hidden';
    parent.appendChild(el);
    return el;
  }

  /* ---------- ミナの部屋 ---------- */
  function room(parent, night) {
    const el = base(parent);
    const wall = night ? ['#2b3561', '#1d2547'] : ['#fff1ec', '#ffe2d9'];
    const sky = night ? ['#0f1838', '#26346b'] : ['#9fd8ff', '#e6f6ff'];
    const far = layer(el, `
      <defs>
        <linearGradient id="rw${night}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${wall[0]}"/><stop offset="1" stop-color="${wall[1]}"/></linearGradient>
        <linearGradient id="rs${night}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
        <pattern id="rp${night}" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="5" fill="${night ? 'rgba(255,255,255,.05)' : 'rgba(240,120,150,.12)'}"/></pattern>
      </defs>
      <rect x="-160" y="-60" width="${W + 320}" height="900" fill="url(#rw${night})"/>
      <rect x="-160" y="-60" width="${W + 320}" height="900" fill="url(#rp${night})"/>
      <!-- 窓 -->
      <rect x="1180" y="120" width="560" height="430" rx="14" fill="url(#rs${night})"/>
      ${night ? `<circle cx="1600" cy="220" r="52" fill="#fff7d6"/><circle cx="1622" cy="206" r="46" fill="#26346b" opacity=".0"/>
        ${Array.from({ length: 30 }, (_, i) => `<circle cx="${1190 + hash(i) * 540}" cy="${130 + hash(i + 40) * 230}" r="${1 + hash(i + 7) * 2.2}" fill="#fff" opacity="${.4 + hash(i + 3) * .6}"/>`).join('')}
        ${Array.from({ length: 14 }, (_, i) => { const x = 1180 + i * 40, h = 60 + hash(i + 90) * 120; return `<rect x="${x}" y="${550 - h}" width="38" height="${h}" fill="#141c3d"/>${Array.from({ length: 6 }, (_, j) => hash(i * 9 + j) > .55 ? `<rect x="${x + 8 + (j % 2) * 14}" y="${560 - h + 14 + Math.floor(j / 2) * 22}" width="8" height="10" fill="#ffd77a" opacity=".9"/>` : '').join('')}`; }).join('')}`
        : `<circle cx="1640" cy="190" r="70" fill="#fff8d8" opacity=".9"/>
        ${[0, 1, 2].map(i => `<ellipse cx="${1260 + i * 170}" cy="${300 + (i % 2) * 40}" rx="${70 + i * 10}" ry="26" fill="#fff" opacity=".9"/>`).join('')}`}
      <rect x="1180" y="120" width="560" height="430" rx="14" fill="none" stroke="#fff" stroke-width="20"/>
      <rect x="1452" y="120" width="16" height="430" fill="#fff"/>
      <rect x="1180" y="328" width="560" height="14" fill="#fff"/>
      <!-- カーテン -->
      <path d="M1130 90 Q1170 340 1140 600 L1220 600 Q1250 330 1210 90 Z" fill="${night ? '#7c4d7e' : '#f6a6bd'}"/>
      <path d="M1790 90 Q1750 340 1780 600 L1700 600 Q1670 330 1710 90 Z" fill="${night ? '#7c4d7e' : '#f6a6bd'}"/>
      <rect x="1110" y="80" width="700" height="18" rx="9" fill="${night ? '#5b3a5c' : '#d9869e'}"/>
      <!-- 壁の飾り -->
      <rect x="220" y="150" width="210" height="270" rx="10" fill="${night ? '#3a4677' : '#fff'}" stroke="${night ? '#55639a' : '#f2c2cf'}" stroke-width="8"/>
      <path d="M250 380 L300 300 L340 340 L380 260 L410 380 Z" fill="${night ? '#5867a8' : '#ffd3de'}"/>
      <circle cx="380" cy="210" r="22" fill="${night ? '#8090cc' : '#ffb3c6'}"/>
      <path d="M560 140 q30 -40 60 0 q30 -40 60 0 q0 40 -60 80 q-60 -40 -60 -80z" fill="${night ? '#6d5b8c' : '#ff9eb8'}"/>
      <!-- 床 -->
      <rect x="-160" y="840" width="${W + 320}" height="300" fill="${night ? '#3a2f4a' : '#e8c7a8'}"/>
      ${Array.from({ length: 12 }, (_, i) => `<line x1="${-160 + i * 200}" y1="840" x2="${-260 + i * 240}" y2="1140" stroke="${night ? 'rgba(0,0,0,.15)' : 'rgba(150,100,60,.15)'}" stroke-width="4"/>`).join('')}
      <rect x="-160" y="832" width="${W + 320}" height="14" fill="${night ? '#2a2238' : '#c99f7c'}"/>
    `);
    const mid = layer(el, `
      <!-- ベッド -->
      <rect x="-80" y="610" width="620" height="260" rx="30" fill="${night ? '#6a5d8f' : '#ffd6e2'}"/>
      <rect x="-80" y="560" width="160" height="320" rx="20" fill="${night ? '#4e426e' : '#f4a9bf'}"/>
      <ellipse cx="200" cy="610" rx="120" ry="40" fill="${night ? '#8a7bb4' : '#fff'}"/>
      <path d="M100 640 Q300 600 540 650 L540 870 L100 870 Z" fill="${night ? '#7d6aa8' : '#ffb7cb'}"/>
      <!-- 牛のぬいぐるみ -->
      <ellipse cx="420" cy="590" rx="70" ry="56" fill="#fff"/><ellipse cx="400" cy="575" rx="22" ry="18" fill="#333"/>
      <ellipse cx="420" cy="612" rx="34" ry="20" fill="#ffc2cf"/><circle cx="398" cy="585" r="5" fill="#fff"/>
      <!-- 机とライト -->
      <rect x="760" y="600" width="420" height="24" rx="6" fill="${night ? '#5b4a3e' : '#c79a72'}"/>
      <rect x="780" y="624" width="20" height="230" fill="${night ? '#4a3c32' : '#a87e59'}"/>
      <rect x="1140" y="624" width="20" height="230" fill="${night ? '#4a3c32' : '#a87e59'}"/>
      <path d="M1080 600 L1080 470 L1020 430" stroke="${night ? '#ddd' : '#888'}" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M970 410 L1060 440 L1040 470 L960 450 Z" fill="${night ? '#ffe9a8' : '#f2b632'}"/>
      ${night ? '<ellipse cx="980" cy="590" rx="190" ry="40" fill="rgba(255,230,150,.28)"/>' : ''}
      <rect x="840" y="560" width="120" height="40" rx="6" fill="${night ? '#8e8ab8' : '#9fd0f0'}"/>
      <rect x="860" y="540" width="80" height="22" rx="4" fill="${night ? '#b3a7d6' : '#ffd3de'}"/>
    `);
    const near = layer(el, night ? `<rect x="-160" y="-60" width="${W + 320}" height="${H + 120}" fill="url(#vg)" opacity=".6"/>
      <defs><radialGradient id="vg" cx="50%" cy="50%" r="70%"><stop offset=".55" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(5,8,25,.85)"/></radialGradient></defs>` : '');
    return { el, layers: { far, mid, near }, floor: 1010, scale: 1.0, update() {} };
  }

  /* ---------- 商店街 ---------- */
  function street(parent) {
    const el = base(parent);
    const shops = [
      { x: -120, w: 380, c: '#e8735a', sign: 'パン工房' },
      { x: 270, w: 360, c: '#5aa0e8', sign: '本屋' },
      { x: 640, w: 420, c: '#7a4e2d', sign: '喫茶 押し目' },
      { x: 1070, w: 360, c: '#e8b85a', sign: '八百屋' },
      { x: 1440, w: 380, c: '#9b6ad6', sign: '洋服' },
      { x: 1830, w: 320, c: '#5ac2a0', sign: '花屋' },
    ];
    const far = layer(el, `
      <defs><linearGradient id="sts" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8ff"/><stop offset="1" stop-color="#d9f1ff"/></linearGradient></defs>
      <rect x="-160" y="-60" width="${W + 320}" height="700" fill="url(#sts)"/>
      ${[0, 1, 2, 3].map(i => `<ellipse cx="${100 + i * 560}" cy="${80 + (i % 2) * 50}" rx="${110 + i * 12}" ry="34" fill="#fff" opacity=".85"/>`).join('')}
      ${Array.from({ length: 10 }, (_, i) => `<rect x="${-160 + i * 230}" y="${150 + hash(i) * 120}" width="${170 + hash(i + 4) * 60}" height="400" fill="#b9d4ea"/>`).join('')}
    `);
    const mid = layer(el, `
      ${shops.map((s, i) => `
        <rect x="${s.x}" y="230" width="${s.w}" height="560" fill="#f7efe4"/>
        <rect x="${s.x}" y="230" width="${s.w}" height="34" fill="#d8cbb8"/>
        <rect x="${s.x + 20}" y="290" width="${s.w - 40}" height="90" rx="10" fill="${s.c}"/>
        <text x="${s.x + s.w / 2}" y="350" font-family="Zen" font-weight="900" font-size="46" fill="#fff" text-anchor="middle">${s.sign}</text>
        <path d="M${s.x + 10} 400 L${s.x + s.w - 10} 400 L${s.x + s.w + 10} 470 L${s.x - 10} 470 Z" fill="${s.c}"/>
        ${Array.from({ length: Math.floor(s.w / 60) }, (_, j) => `<path d="M${s.x + j * 60} 470 q30 26 60 0" fill="${j % 2 ? '#fff' : s.c}"/>`).join('')}
        <rect x="${s.x + 30}" y="500" width="${s.w - 60}" height="270" fill="${i === 2 ? '#3b2a1e' : '#cfe3f2'}"/>
        <rect x="${s.x + s.w / 2 - 6}" y="500" width="12" height="270" fill="#f7efe4"/>
        ${i === 2 ? `<rect x="${s.x + 60}" y="540" width="120" height="80" rx="6" fill="#ffd88a" opacity=".8"/><rect x="${s.x + s.w - 180}" y="540" width="120" height="80" rx="6" fill="#ffd88a" opacity=".8"/>` : ''}
      `).join('')}
      <!-- のぼり旗 -->
      ${[180, 980, 1700].map((x, i) => `<rect x="${x}" y="420" width="8" height="420" fill="#888"/><rect x="${x + 8}" y="430" width="70" height="250" fill="${['#d62839', '#1d3766', '#f2b632'][i]}"/>
        <text x="${x + 43}" y="480" font-family="Zen" font-weight="900" font-size="44" fill="#fff" text-anchor="middle" writing-mode="tb">${['大売出', '特価', '新装'][i]}</text>`).join('')}
    `);
    const near = layer(el, `
      <rect x="-160" y="790" width="${W + 320}" height="400" fill="#c9c2b6"/>
      ${Array.from({ length: 22 }, (_, i) => `<rect x="${-160 + i * 110}" y="790" width="106" height="60" fill="${i % 2 ? '#d6cfc3' : '#beb6a8'}"/>`).join('')}
      <rect x="-160" y="850" width="${W + 320}" height="8" fill="#a59d90"/>
      <!-- アーケードの屋根の柱 -->
      ${[-60, 900, 1860].map(x => `<rect x="${x}" y="-60" width="34" height="910" fill="#7d8a99"/>`).join('')}
      <rect x="-160" y="-60" width="${W + 320}" height="70" fill="#8d9aab"/>
    `);
    return { el, layers: { far, mid, near }, floor: 1000, scale: 1.0, update() {} };
  }

  /* ---------- 夕暮れの公園 ---------- */
  function park(parent) {
    const el = base(parent);
    const far = layer(el, `
      <defs>
        <linearGradient id="pk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2d6b"/><stop offset=".45" stop-color="#d4648a"/><stop offset=".75" stop-color="#ffb26b"/><stop offset="1" stop-color="#ffd59a"/></linearGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff3c4"/><stop offset=".4" stop-color="#ffcf7a"/><stop offset="1" stop-color="rgba(255,180,90,0)"/></radialGradient>
      </defs>
      <rect x="-160" y="-60" width="${W + 320}" height="800" fill="url(#pk)"/>
      <circle cx="1350" cy="560" r="260" fill="url(#sun)"/>
      <circle cx="1350" cy="560" r="80" fill="#fff0c0"/>
      ${Array.from({ length: 18 }, (_, i) => { const x = -160 + i * 130, h = 120 + hash(i + 3) * 220; return `<rect x="${x}" y="${700 - h}" width="${100 + hash(i) * 40}" height="${h}" fill="#5a3b6e" opacity=".75"/>`; }).join('')}
    `);
    const mid = layer(el, `
      <rect x="-160" y="690" width="${W + 320}" height="500" fill="#4c3a5e"/>
      ${Array.from({ length: 9 }, (_, i) => { const x = -100 + i * 260; return `<rect x="${x + 50}" y="430" width="26" height="280" fill="#2f2440"/><circle cx="${x + 63}" cy="420" r="${110 + hash(i) * 40}" fill="#3a2b4f"/><circle cx="${x + 20}" cy="470" r="80" fill="#35284a"/>`; }).join('')}
      <path d="M-160 820 Q960 760 ${W + 160} 830 L${W + 160} 1140 L-160 1140 Z" fill="#8b6a73"/>
    `);
    const near = layer(el, `
      <!-- ベンチ -->
      <rect x="560" y="800" width="560" height="26" rx="8" fill="#6b4a3a"/>
      <rect x="560" y="740" width="560" height="22" rx="8" fill="#7d5845"/>
      <rect x="600" y="826" width="18" height="120" fill="#3d2a22"/><rect x="1060" y="826" width="18" height="120" fill="#3d2a22"/>
      <!-- 街灯 -->
      <rect x="1500" y="380" width="22" height="600" fill="#2f2a3a"/>
      <rect x="1470" y="350" width="82" height="50" rx="10" fill="#2f2a3a"/>
      <ellipse cx="1511" cy="410" rx="30" ry="16" fill="#ffe7a8"/>
      <circle class="lamp" cx="1511" cy="430" r="190" fill="rgba(255,220,140,.22)"/>
      <rect x="-160" y="980" width="${W + 320}" height="160" fill="#5e4652"/>
    `);
    const lamp = near.querySelector('.lamp');
    return { el, layers: { far, mid, near }, floor: 1000, scale: 1.0,
      update(t) { lamp.setAttribute('opacity', (.85 + Math.sin(t * 3) * .1).toFixed(3)); } };
  }

  /* ---------- 喫茶「押し目」 ---------- */
  function cafe(parent, night) {
    const el = base(parent);
    const far = layer(el, `
      <defs>
        <linearGradient id="cw${night}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night ? '#4a3326' : '#8a5a3c'}"/><stop offset="1" stop-color="${night ? '#33231a' : '#6e452c'}"/></linearGradient>
        <radialGradient id="cl${night}" cx="50%" cy="0%" r="60%"><stop offset="0" stop-color="rgba(255,214,140,.65)"/><stop offset="1" stop-color="rgba(255,214,140,0)"/></radialGradient>
      </defs>
      <rect x="-160" y="-60" width="${W + 320}" height="900" fill="url(#cw${night})"/>
      ${Array.from({ length: 24 }, (_, i) => `<rect x="${-160 + i * 100}" y="-60" width="4" height="900" fill="rgba(0,0,0,.12)"/>`).join('')}
      <!-- 窓 -->
      <rect x="-60" y="120" width="420" height="420" rx="12" fill="${night ? '#1a2142' : '#bfe6ff'}"/>
      ${night ? Array.from({ length: 20 }, (_, i) => `<circle cx="${-40 + hash(i) * 380}" cy="${140 + hash(i + 9) * 200}" r="2" fill="#fff" opacity=".7"/>`).join('') : '<ellipse cx="120" cy="250" rx="110" ry="30" fill="#fff" opacity=".85"/>'}
      <rect x="-60" y="120" width="420" height="420" rx="12" fill="none" stroke="#3a2418" stroke-width="18"/>
      <rect x="142" y="120" width="14" height="420" fill="#3a2418"/>
      <!-- 棚とカップ -->
      ${[230, 390].map(y => `<rect x="560" y="${y}" width="760" height="18" fill="#3a2418"/>`).join('')}
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${590 + i * 80} 190 h50 v34 q0 8 -8 8 h-34 q-8 0 -8 -8 z" fill="${['#fff', '#f6d7a8', '#d9ecff'][i % 3]}"/>`).join('')}
      ${Array.from({ length: 7 }, (_, i) => `<rect x="${600 + i * 100}" y="${310}" width="56" height="80" rx="8" fill="#c7a77a" opacity=".9"/><rect x="${600 + i * 100}" y="${300}" width="56" height="16" rx="4" fill="#5c3b26"/>`).join('')}
      <!-- 黒板メニュー -->
      <rect x="1400" y="140" width="380" height="300" rx="10" fill="#2f3b33" stroke="#6b4a33" stroke-width="14"/>
      <text x="1590" y="210" font-family="Zen" font-weight="900" font-size="40" fill="#f5f0e0" text-anchor="middle">本日のおすすめ</text>
      <text x="1430" y="280" font-family="Zen" font-weight="700" font-size="32" fill="#f5f0e0">押し目ブレンド</text>
      <text x="1430" y="340" font-family="Zen" font-weight="700" font-size="32" fill="#f5f0e0">ナポリタン</text>
      <text x="1430" y="400" font-family="Zen" font-weight="700" font-size="32" fill="#f5f0e0">特製パフェ</text>
      <!-- 小さな株価モニター -->
      <rect x="1440" y="480" width="320" height="180" rx="10" fill="#111a2e" stroke="#555" stroke-width="8"/>
      <polyline points="1460,620 1500,600 1540,612 1580,570 1620,585 1660,540 1700,555 1740,520" fill="none" stroke="#4fd1a5" stroke-width="5"/>
      <rect x="1440" y="480" width="320" height="34" fill="#1d2a48"/>
      <!-- 照明の光 -->
      <rect x="-160" y="-60" width="${W + 320}" height="900" fill="url(#cl${night})" opacity="${night ? .9 : .6}"/>
    `);
    const mid = layer(el, `
      <!-- ペンダントライト -->
      ${[520, 960, 1400].map(x => `<line x1="${x}" y1="-60" x2="${x}" y2="70" stroke="#222" stroke-width="4"/><path d="M${x - 60} 120 Q${x} 40 ${x + 60} 120 Z" fill="#3a2418"/><ellipse cx="${x}" cy="122" rx="40" ry="12" fill="#ffe2a0"/>`).join('')}
      <!-- 観葉植物 -->
      <rect x="1700" y="700" width="120" height="140" rx="12" fill="#b5653c"/>
      ${Array.from({ length: 9 }, (_, i) => `<ellipse cx="${1760 + Math.cos(i) * 60}" cy="${640 - i * 18}" rx="26" ry="60" fill="${i % 2 ? '#2e7d4f' : '#3fa266'}" transform="rotate(${-40 + i * 10} ${1760 + Math.cos(i) * 60} ${640 - i * 18})"/>`).join('')}
      <!-- 床 -->
      <rect x="-160" y="840" width="${W + 320}" height="300" fill="${night ? '#3b2a20' : '#5b3a26'}"/>
      ${Array.from({ length: 16 }, (_, i) => `<rect x="${-160 + i * 150}" y="840" width="146" height="300" fill="${i % 2 ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.06)'}"/>`).join('')}
    `);
    const near = layer(el, `
      <!-- カウンター -->
      <rect x="380" y="640" width="1100" height="40" rx="10" fill="#c4874f"/>
      <rect x="400" y="680" width="1060" height="200" fill="#8a5632"/>
      ${Array.from({ length: 11 }, (_, i) => `<rect x="${410 + i * 96}" y="700" width="84" height="160" rx="6" fill="rgba(0,0,0,.12)"/>`).join('')}
      <!-- コーヒーカップ -->
      <ellipse cx="760" cy="636" rx="70" ry="12" fill="#fff"/>
      <path d="M720 590 h80 v34 q0 14 -14 14 h-52 q-14 0 -14 -14 z" fill="#fff"/><path d="M800 600 q24 0 24 14 q0 14 -24 14" stroke="#fff" stroke-width="8" fill="none"/>
      <ellipse cx="760" cy="592" rx="38" ry="8" fill="#5b3420"/>
      <path class="steam" d="M748 570 q-14 -30 4 -50 q16 -20 0 -46" stroke="rgba(255,255,255,.6)" stroke-width="6" fill="none" stroke-linecap="round"/>
    `);
    const steam = near.querySelector('.steam');
    return { el, layers: { far, mid, near }, floor: 1010, scale: 1.0,
      update(t) { steam.setAttribute('transform', `translate(${Math.sin(t * 1.6) * 6} ${-((t * 20) % 20)})`); steam.setAttribute('opacity', (.5 + .4 * Math.sin(t * 2)).toFixed(2)); } };
  }

  /* ---------- 想像の世界 ---------- */
  function imagine(parent) {
    const el = base(parent);
    const far = layer(el, `
      <defs>
        <radialGradient id="im" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#2d4d92"/><stop offset=".6" stop-color="#16285a"/><stop offset="1" stop-color="#0a1230"/></radialGradient>
      </defs>
      <rect x="-160" y="-60" width="${W + 320}" height="${H + 120}" fill="url(#im)"/>
      ${Array.from({ length: 70 }, (_, i) => `<circle cx="${-160 + hash(i) * (W + 320)}" cy="${-60 + hash(i + 70) * (H + 120)}" r="${1 + hash(i + 140) * 3}" fill="#bcd3ff" opacity="${.2 + hash(i + 210) * .6}"/>`).join('')}
    `);
    const mid = layer(el, `
      ${Array.from({ length: 14 }, (_, i) => `<line x1="${-160 + i * 160}" y1="820" x2="${960 + (i - 7) * 520}" y2="1180" stroke="rgba(120,170,255,.22)" stroke-width="3"/>`).join('')}
      ${Array.from({ length: 6 }, (_, i) => `<line x1="-160" y1="${830 + i * i * 12}" x2="${W + 160}" y2="${830 + i * i * 12}" stroke="rgba(120,170,255,.2)" stroke-width="3"/>`).join('')}
    `);
    const near = layer(el, '');
    return { el, layers: { far, mid, near }, floor: 960, scale: 1.0, update() {} };
  }

  /* ---------- 縞の壁紙と床（小道具を見せる舞台） ---------- */
  function wall(parent, tone) {
    const el = base(parent);
    const c = tone === 'dark' ? ['#3a2a26', '#33241f', '#2a1d19'] : tone === 'sepia' ? ['#d9c09a', '#d0b48c', '#b8996e'] : ['#f4eadb', '#efe3d0', '#e3cba8'];
    const far = layer(el, `
      <rect x="-160" y="-60" width="${W + 320}" height="${H + 120}" fill="${c[0]}"/>
      ${Array.from({ length: 34 }, (_, i) => `<rect x="${-160 + i * 70}" y="-60" width="34" height="${H + 120}" fill="${c[1]}"/>`).join('')}
    `);
    const mid = layer(el, `<rect x="-160" y="850" width="${W + 320}" height="300" fill="${c[2]}"/><rect x="-160" y="850" width="${W + 320}" height="4" fill="${tone === 'dark' ? '#1f1512' : '#b79c7c'}"/>`);
    const near = layer(el, `<defs><radialGradient id="wv${tone}" cx="50%" cy="45%" r="75%"><stop offset=".6" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(60,40,20,${tone === 'dark' ? .55 : .22})"/></radialGradient></defs>
      <rect x="-160" y="-60" width="${W + 320}" height="${H + 120}" fill="url(#wv${tone})"/>`);
    return { el, layers: { far, mid, near }, floor: 850, scale: 1.0, update() {} };
  }
  // 机の上（メモ用紙など）
  function desk(parent) {
    const el = base(parent);
    const far = layer(el, `
      <defs><linearGradient id="dk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b98a5e"/><stop offset="1" stop-color="#946640"/></linearGradient></defs>
      <rect x="-160" y="-60" width="${W + 320}" height="${H + 120}" fill="url(#dk)"/>
      ${Array.from({ length: 26 }, (_, i) => `<path d="M-160 ${-40 + i * 46} Q 600 ${-60 + i * 46 + (i % 3) * 14} ${W + 160} ${-30 + i * 46}" stroke="rgba(80,45,20,.16)" stroke-width="${2 + (i % 4)}" fill="none"/>`).join('')}
    `);
    const mid = layer(el, '');
    const near = layer(el, `<defs><radialGradient id="dkv" cx="50%" cy="45%" r="75%"><stop offset=".55" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(40,20,5,.5)"/></radialGradient></defs>
      <rect x="-160" y="-60" width="${W + 320}" height="${H + 120}" fill="url(#dkv)"/>`);
    return { el, layers: { far, mid, near }, floor: 1000, scale: 1.0, update() {} };
  }

  window.BACKGROUNDS = {
    wall: p => wall(p, 'light'),
    wall_dark: p => wall(p, 'dark'),
    wall_sepia: p => wall(p, 'sepia'),
    desk,
    room_night: p => room(p, 1),
    room_morning: p => room(p, 0),
    street,
    park_dusk: park,
    cafe: p => cafe(p, 0),
    cafe_night: p => cafe(p, 1),
    imagine,
  };
})();
