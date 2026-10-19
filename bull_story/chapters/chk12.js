// 完全版 第12章「調査中断と、監理（審査中）」（2026年6月30日〜7月10日）
// 台本: story/k/k12_調査中断と、監理（審査中）.md　元資料 p8・p14・p15・p22・p23・p34・p36・p38・ユーザー提供の投稿スクリーンショット（2026/10/18）
// 投稿は元資料の要約（本人の見解）。7/10 13:33（一覧外）は投稿の画面（P.postShot）と本文の字幕（E.cap・声なし）。
// 有名投資家の名前・アカウント・アイコンは出さない。ブルちゃんの保有はフィクション
// 7/10 13:33 の添付の表（週次信用残）の数字は画像のもので、元資料にはない。7/23 の480円・値動きとは結びつけない
// I41・I42 は同じ17:45。事業と監査の問題は別々に追う。7/1の上げを1つの材料の効果としない
'use strict';
E.chapter('k12');
{
  const { W, H } = E;
  const CH = n => `assets/chara/${n}.png`;
  const CHART = n => `assets/charts_k/p${n}.png`;
  const bar = (g, from, to) => P.monthBar(g, { year: 2026, start: 6, months: 2, from, to, x: 460, w: 1000 });
  const panel = (g, { x, y, w, h = 120, html, size = 40, dark = false }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 24, background: dark ? '#2a2430' : 'rgba(255,255,255,.95)', border: dark ? '3px solid #ffd84a' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', font: `900 ${size}px/1.25 Zen`, color: dark ? '#ffd84a' : '#262236', boxShadow: '0 12px 24px rgba(0,0,0,.35)', whiteSpace: 'nowrap' }, html).ini({ o: 0 });
  const box = (g, { x, y, w = 700, h = 280, top = '', main = '', sub = '', c = '#262236', border = 'none', size = 50 }) => E.div(g, { left: x, top: y, width: w, height: h, borderRadius: 26, background: 'rgba(255,255,255,.95)', border, boxShadow: '0 12px 24px rgba(0,0,0,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 30px' },
    `${top ? `<div style="font:800 28px/1.3 Round;color:#6a6066">${top}</div>` : ''}<div style="font:900 ${size}px/1.3 Zen;color:${c};white-space:nowrap">${main}</div>${sub ? `<div style="font:800 30px/1.5 Round;color:#4a4552;margin-top:14px">${sub}</div>` : ''}`).ini({ o: 0 });
  const rise = (n, d = 0) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', d); E.sfx('pop', { delay: d, gain: .5 }); };
  const chartTitle = (sc, t) => E.div(sc.root, { left: 0, top: 26, padding: '8px 24px 8px 60px', borderRadius: '0 14px 14px 0', background: 'rgba(20,12,16,.85)', font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, t);
  const tag = (g, pt, txt, dx, dy, c = '#262236', size = 17) => E.div(g, { left: pt.x + dx, top: pt.y + dy, padding: '3px 10px', borderRadius: 8, background: 'rgba(255,255,255,.96)', font: `900 ${size}px/1.3 Noto`, color: c, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }, txt).ini({ o: 0 });
  const fiction = sc => P.note(sc.root, 'ブルちゃんの売買はフィクションです', { x: 1440, y: 40, size: 24, dark: true });
  const tIn = (n, d = .5) => { E.tw(n, .45, { o: [0, 1], x: [60, 0] }, 'back', d); E.sfx('notify', { delay: d }); };
  // p08 日足（5/25 から 32.375px/取引日、600円が y=469.5、0.5825 px/円）
  const DAYS = ['5/25', '5/26', '5/27', '5/28', '5/29', '6/1', '6/2', '6/3', '6/4', '6/5', '6/8', '6/9', '6/10', '6/11', '6/12', '6/15', '6/16', '6/17', '6/18', '6/19', '6/22', '6/23', '6/24', '6/25', '6/26', '6/29', '6/30', '7/1', '7/2', '7/3', '7/6', '7/7', '7/8', '7/9', '7/10'];
  const X08 = d => 194.5 + 32.375 * DAYS.indexOf(d);
  const PY08 = p => 469.5 + (600 - p) * 0.5825;

  // 投稿の画面（ユーザー提供のスクリーンショット）。上に月の帯があるので y 110 から、字幕の帯（850）より上に収める
  const MEMO = '#5a6b88';
  const enter = (card, d = .4) => { E.tw(card, .45, { o: [0, 1], y: [30, 0] }, 'back', d); E.sfx('notify', { delay: d }); };
  // 添付画像の中の位置（切り出し画像の画素）→ 親の座標。card.at はカードの左の太線 12px の分を含まないので足す
  const atImg = (card, i, px, py) => { const q = card.at(i, px, py); return { x: q.x + 12, y: q.y }; };
  // 添付画像の中の場所を示す黄色い四角の枠（投稿の画面の一部と区別するため四角にする）。[x0, y0, x1, y1] は切り出し画像の画素
  const frame = (g, card, i, [x0, y0, x1, y1], d = 0) => {
    const a = atImg(card, i, x0, y0), b = atImg(card, i, x1, y1);
    const n = E.div(g, { left: a.x - 6, top: a.y - 6, width: b.x - a.x + 12, height: b.y - a.y + 12, borderRadius: 8, border: '4px solid #ffd84a', boxShadow: '0 0 14px rgba(255,216,74,.85)', boxSizing: 'border-box' }).ini({ o: 0 });
    E.show(n, .25, d); E.sfx('pop', { delay: d, gain: .35 });
    return n;
  };
  // 右の余白に置く説明の札（上に小さなラベル）
  const fact = (g, { x, y, w, lab = '', html, size = 24 }) => E.div(g, { left: x, top: y, width: w, padding: '12px 20px 14px', borderRadius: 16, background: 'rgba(255,255,255,.95)', font: `900 ${size}px/1.4 Zen`, color: '#262236', boxShadow: '0 8px 18px rgba(0,0,0,.3)', boxSizing: 'border-box' },
    (lab ? `<div style="display:inline-block;margin-bottom:6px;padding:2px 10px;border-radius:8px;background:#4a4552;color:#fff;font:800 18px/1.3 Round">${lab}</div><br>` : '') + html).ini({ o: 0 });
  const small = t => `<div style="font:800 20px/1.45 Round;color:#5a6476;margin-top:4px">${t}</div>`;
  const pin = (n, d = 0) => { E.tw(n, .4, { o: [0, 1], y: [20, 0] }, 'back', d); E.sfx('pop', { delay: d, gain: .5 }); };

  /* ============================================================ 注意書き */
  E.scene({ name: 'notice', bg: '#0b1022' }, sc => {
    const g = sc.cam;
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(ellipse at 50% 45%, #1d2a4a 0%, #0b1022 75%)' });
    const n = P.kNotice(g, { x: 40, y: 340, w: 1840, size: 26, posts: true });
    E.show(n, .6, .2);
    E.wait(6.0);
    E.hide(n, .5);
    E.wait(.5);
  });

  /* ============================================================ S0 アバン：6月30日の通知 */
  P.phoneScene((ph, sc) => {
    E.bgm('tension', { fadeIn: 1.0, gain: .7 });
    E.div(ph.screen, { left: 0, top: 60, width: ph.sw, textAlign: 'center', font: '900 34px/1.3 Noto', color: 'rgba(50,32,32,.88)' }, '6月30日（火）　17:46');
    const n1 = P.notice(ph, { title: 'エスポア（3260）', body: '第三者委員会の調査の中断', y: 140 });
    const n2 = P.notice(ph, { title: 'エスポア（3260）', body: '系統用蓄電池の権利取得', y: 305 });
    const n3 = P.notice(ph, { title: 'エスポア（3260）', body: '蓄電池用地・権利の売却', y: 470 });
    P.notifyIn(n1, 1.0); P.notifyIn(n2, 1.3); P.notifyIn(n3, 1.6);
    E.wait(2.1);
    E.narr('6月30日の夕方。同じ時刻に、3つの開示が届いた。', { yomi: '6月30日の夕方。同じ時刻に、みっつの開示が届いた。' });
    E.narr('1つは、調査の知らせ。あとの2つは、事業の知らせだった。', { yomi: 'ひとつは、調査の知らせ。あとのふたつは、事業の知らせだった。' });
  }, { name: 'avant_phone', wait: .4 });

  /* ============================================================ S1 タイトル・章扉 */
  E.trans('flash', { dur: .5 });
  E.bgm('title', { fadeIn: .1, fadeOut: .6 });
  P.titleScene({ arc: 'エスポア（3260）編・完全版', catchCopy: '〜 投稿と、IRと、ローソク足 〜', dur: 3.8 });
  E.trans('stripes', { dur: .9 });
  P.chapterCard({ n: 12, title: '調査中断と、監理（審査中）', sub: '2026年6月30日〜7月10日', dur: 3.6, subTop: true });
  E.trans('fade', { dur: .7, color: '#000' });

  /* ============================================================ S2 I41・I42　17:45 */
  E.scene({ name: 'i41i42' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .75 });
    P.slate(g);
    const clk = P.clock(g, { x: 110, y: 170, size: 250, min: 930 });
    E.div(g, { left: 85, top: 440, width: 300, textAlign: 'center', font: '900 52px/1.2 Noto', color: '#ffd84a' }, '17:45');
    E.div(g, { left: 85, top: 510, width: 300, textAlign: 'center', font: '800 26px/1.3 Round', color: 'rgba(243,230,200,.8)' }, '同時に公表');
    const i41 = P.icard(g, { id: 'I41', when: '2026/6/30 17:45', session: '引け後', title: '第三者委員会の調査中断', text: '諸般の事情で調査が中断し、<br>7月中旬目途の報告書受領が困難と公表', note: '同日には事業IRもある。事業進捗と監査問題を別々に追う', x: 440, y: 100, w: 1400, size: 30 });
    const i42 = P.icard(g, { id: 'I42', when: '2026/6/30 17:45', session: '引け後', title: '系統権利取得・用地売却', text: '栃木県佐野市の系統権利取得を発表。<br>同時に七飯町上軍川の用地・権利売却を公表', x: 440, y: 480, w: 1400, size: 30 });
    E.tw(clk, 1.2, { min: [930, 1065] }, 'inOut', .3); E.sfx('tick', { delay: .3, gain: .5 });
    E.wait(1.6);
    E.say('hat', '6月30日、17時45分。会社は、3つの開示を、同時に出した。', { yomi: '6月30日、17時45分。会社は、みっつの開示を、同時に出した。' });
    let L = E.say('hat', '1つは、第三者委員会の、調査の中断。諸般の事情で、調査が止まった。', { wait: false, yomi: 'ひとつは、だいさんしゃいいんかいの、調査の中断。しょはんの事情で、調査が止まった。' });
    E.tw(i41, .45, { o: [0, 1], y: [30, 0] }, 'back', .2); E.sfx('notify', { delay: .2 });
    E.at(L.end);
    E.say('hat', '7月中旬をめどにしていた、報告書の受け取りは、難しくなった、と公表した。', { yomi: 'しちがつちゅうじゅんを、めどにしていた、報告書の受け取りは、難しくなった、と公表した。' });
    L = E.say('hat', 'もう1つは、栃木県佐野市の、系統の権利の取得。', { wait: false, yomi: 'もうひとつは、とちぎけん、さのしの、けいとうの権利の取得。' });
    E.tw(i42, .45, { o: [0, 1], y: [30, 0] }, 'back', .2); E.sfx('notify', { delay: .2 });
    E.at(L.end);
    E.say('hat', 'さらに別の開示で、七飯町、上軍川の、用地と権利の売却も、公表した。', { yomi: 'さらに、べつの開示で、ななえちょう、かみいくさがわの、用地と権利の売却も、公表した。' });
    const nb = E.div(g, { left: 440, top: 860, width: 1400, height: 80, borderRadius: 18, background: '#2a2430', border: '3px solid #ffd84a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 30px/1.2 Zen', color: '#ffd84a', whiteSpace: 'nowrap' }, '事業の進み具合と、監査の問題は、別々に追う').ini({ o: 0 });
    L = E.say('hat', '元資料は、事業の進み具合と、監査の問題を、別々に追っている。', { wait: false, yomi: 'もとしりょうは、事業の進み具合と、監査の問題を、別々に追っている。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('ding', { delay: .2, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S3 T46　18:44 */
  E.scene({ name: 't46' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tl = P.timeLink(g, { x: 260, y: 150, w: 1400, a: { id: 'I42', time: '17:45', sub: '会社の開示', color: P.I_ORANGE }, b: { id: 'T46', time: '18:44', sub: '投稿', color: P.T_BLUE }, label: '59分後' });
    tl.in(.2);
    const t46 = P.tcard(g, { id: 'T46', when: '2026/6/30 18:44', kind: '事業', session: '引け後', text: '蓄電池向け送電系統の権利取得を紹介', note: '6月30日18時44分', x: 300, y: 330, w: 1320, size: 40 });
    tIn(t46, 1.3);
    E.wait(1.8);
    E.narr('公表の59分後に、蓄電池向けの、送電の系統の権利の取得を、紹介する投稿があった。', { yomi: '公表の59分後に、ちくでんちむけの、そうでんの、けいとうの権利の取得を、紹介する投稿があった。' });
    const nb = panel(g, { x: 300, y: 640, w: 1320, h: 110, size: 34, dark: true, html: '同じ17:45には　調査の中断（I41）も開示' });
    const L = E.say('hat', '同じ17時45分には、調査の中断も、開示されていた。2つを、並べて見る。', { wait: false, yomi: '同じ17時45分には、調査の中断も、開示されていた。ふたつを、ならべて見る。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S4 7月1日の終値 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'jul1' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    const C = P.chart(g, CHART('08'), { x: 80, y: 150, w: 1760 });
    chartTitle(sc, '日足　2026年6月30日〜7月7日');
    P.note(sc.root, '分割後の値段（元資料 p8）', { x: 1540, y: 896, size: 22, dark: true });
    P.look(sc.cam, { s: 2.2, cx: C.at(1110, 0).x, cy: C.at(0, 440).y, dur: 1.4, delay: .2 });
    const a = C.at(X08('6/30'), PY08(600)), b = C.at(X08('7/1'), PY08(700)), c = C.at(X08('7/7'), PY08(700));
    const ta = tag(g, a, '6/30 終値 600円', -120, 10, '#262236', 15), tb = tag(g, b, '7/1 終値 700円', -150, -36, '#d22d68', 15), tc = tag(g, c, '7/7 終値 700円', 10, -36, '#d22d68', 15);
    E.wait(1.6);
    let L = E.say('hat', '6月30日の終値は600円。次の取引日、7月1日の終値は700円。16.67％高い。', { wait: false, yomi: '6月30日の、おわりねは、ろっぴゃくえん。次の取引日、7月1日の、おわりねは、ななひゃくえん。ジューロクテンロクナナパーセント高い。' });
    P.circle(g, { x: a.x, y: a.y, w: 22, h: 22, sw: 3, delay: .2, dur: .3 }); E.pop(ta, .3, .3);
    P.circle(g, { x: b.x, y: b.y, w: 22, h: 22, sw: 3, color: '#d22d68', delay: L.dur * .45, dur: .3 }); E.pop(tb, .3, L.dur * .5);
    E.at(L.end);
    L = E.say('hat', '5取引日後の、7月7日も、700円だった。', { wait: false, yomi: 'ごとりひきびごの、7月7日も、ななひゃくえんだった。' });
    P.circle(g, { x: c.x, y: c.y, w: 22, h: 22, sw: 3, color: '#d22d68', delay: .3, dur: .3 }); E.pop(tc, .3, .4);
    E.at(L.end + .4);
  });

  E.scene({ name: 'reaction' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '6月30日の開示のあとの終値（元資料 p38）', 50);
    E.show(tt, .3);
    const col = (x, d, sub, v, pct, c) => E.div(g, { left: x, top: 180, width: 480, height: 300, borderRadius: 24, background: 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,.35)' },
      `<div style="font:900 40px/1.3 Noto;color:#262236;padding-top:30px">${d}</div><div style="font:800 26px/1.4 Round;color:#6a6066">${sub}</div><div style="font:900 64px/1.3 Noto;color:#262236">${v}</div><div style="font:900 46px/1.2 Noto;color:${c}">${pct}</div>`).ini({ o: 0 });
    const c1 = col(160, '6/30', '公表日の終値', '600円', '', '#262236'), c2 = col(720, '7/1', '翌取引日', '700円', '+16.67%', '#d22d68'), c3 = col(1280, '7/7', '5取引日後', '700円', '+16.67%', '#d22d68');
    const a1 = E.div(g, { left: 648, top: 290, width: 60, font: '900 56px/1 Zen', color: '#f3e6c8' }, '▶').ini({ o: 0 }), a2 = E.div(g, { left: 1208, top: 290, width: 60, font: '900 56px/1 Zen', color: '#f3e6c8' }, '▶').ini({ o: 0 });
    const fm = E.div(g, { left: 160, top: 510, width: 1600, textAlign: 'center', font: '800 30px/1.3 Round', color: 'rgba(243,230,200,.9)' }, '計算の例：（700 ÷ 600 − 1）× 100 ＝ +16.67%').ini({ o: 0 });
    rise(c1, .3); E.show(a1, .3, .7); rise(c2, .9); E.show(a2, .3, 1.3); rise(c3, 1.5); E.show(fm, .3, 1.9);
    E.wait(2.4);
    const nb = panel(g, { x: 260, y: 600, w: 1400, h: 110, size: 34, dark: true, html: 'この上げ ≠ 1つの開示の効果　（同じ日に調査の中断も開示）' });
    let L = E.say('hat', 'ただ、この上げを、1つの開示の効果とは言えない。', { wait: false, yomi: 'ただ、この上げを、ひとつの開示の効果とは言えない。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('ding', { delay: .2, gain: .5 });
    E.at(L.end);
    E.say('hat', '同じ日には、調査の中断も開示されていた。騰落率には、ほかの情報や、需給も含まれる。', { yomi: '同じ日には、調査の中断も開示されていた。とうらくりつには、ほかの情報や、じゅきゅうも含まれる。' });
    const nb2 = panel(g, { x: 360, y: 740, w: 1200, h: 100, size: 32, dark: true, html: '18:44の投稿が上げの原因かは　この比較だけでは分からない' });
    L = E.say('hat', '18時44分の投稿が、この上げの原因かは、この比較だけでは分からない。', { wait: false });
    E.tw(nb2, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('ding', { delay: .2, gain: .5 });
    E.at(L.end);
    E.wait(.4);
  });

  /* ============================================================ S5 ブルちゃん（700円に戻る） */
  E.trans('fade', { dur: .6, color: '#fff' });
  E.scene({ name: 'bull_700' }, sc => {
    const g = sc.cam;
    E.bgm('memory', { fadeIn: .8, gain: .75 });
    const R = P.room(g, { night: true });
    const scr = E.div(R.screen, { left: 0, top: 0, width: 492, height: 290, background: '#f4f6f9' });
    E.div(scr, { left: 20, top: 18, font: '800 20px/1.3 Round', color: '#6a6066' }, '保有：エスポア（3260）');
    E.div(scr, { left: 20, top: 70, font: '900 34px/1.5 Noto', color: '#22252b' }, '取得 700円<br><span style="color:#d22d68">7/1 終値 700円</span>');
    const bull = E.actor(g, 'bull', { x: 770, y: 1012, h: 690, pose: 'side' }).ini({ sx: -1 });
    E.breathe(bull, .01, 2.2);
    fiction(sc);
    P.look(sc.cam, { s: 1.25, cx: 1200, cy: 420, dur: 4, delay: .3 });
    E.wait(.6);
    E.narr('7月1日。終値は700円。私が買った値段に、戻った。', { yomi: '7月1日。おわりねは、ななひゃくえん。私が買った値段に、戻った。' });
    E.narr('売れば、損はなかった。でも、私は、もっと上がると思っていた。');
    E.wait(.3);
  });

  /* ============================================================ S6 T47　7月7日 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 't47' }, sc => {
    const g = sc.cam;
    E.bgm('lesson', { fadeIn: .5, gain: .85 });
    P.slate(g);
    bar(g, [7, 1], [7, 7]);
    const t47 = P.tcard(g, { id: 'T47', when: '2026/7/7 13:16', kind: 'チャート', session: '取引時間内', text: '日足の複数の安値に丸印を付けて投稿', note: '画像は6月以降の安値切り上げを示唆。7月23日には480円まで下落', x: 260, y: 140, w: 1400, size: 40 });
    tIn(t47);
    E.wait(1.0);
    E.narr('7月7日、13時16分。日足の、いくつかの安値に、丸を付けた画像の投稿があった。', { yomi: '7月7日、13時16分。ひあしの、いくつかの安値に、丸を付けた画像の投稿があった。' });
    E.say('hat', '画像は、6月からの、安値の切り上げを、示唆している。');
    E.tw(t47, .4, { y: -30, s: .9 }, 'inOut');
    const pts = [[0, 60], [140, 250], [280, 120], [420, 210], [560, 100], [700, 170], [840, 20]];
    const wl = E.polyline(g, pts, { left: 540, top: 470, width: 840, height: 280, color: '#e8a33a', sw: 10 }).ini({ draw: 0 });
    const lb = E.div(g, { left: 340, top: 770, width: 1240, textAlign: 'center', font: '900 28px/1.2 Zen', color: '#f5c46a' }, '安値の切り上げ（一般的なしくみの図・投稿の画像ではありません）').ini({ o: 0 });
    let L = E.say('hat', '安値の切り上げは、安値が、前の安値より、高いところで止まることだ。', { wait: false });
    E.tw(wl, 1.3, { draw: [0, 1] }, 'inOut', .2); E.show(lb, .3, .4);
    E.at(L.end);
    const nb = panel(g, { x: 360, y: 840, w: 1200, h: 90, size: 32, dark: true, html: 'そのあと 7/23 安値 480円（第13章）' });
    L = E.say('hat', 'ただ、そのあと、7月23日には、480円まで下がった。それは、次の章で見る。', { wait: false, yomi: 'ただ、そのあと、7月23日には、よんひゃくはちじゅうえんまで下がった。それは、次の章で見る。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .2); E.sfx('drop', { delay: .2, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S6b 7月10日 13:33 の投稿（元資料の一覧外・P15） */
  // ユーザー提供の投稿の画面。添付の表「週次信用残」の数字は画像のもので、元資料にはない（元資料では確かめられない）
  // 7/23 の480円とも、この日の値動きとも結びつけない。同じ日の15:30・18:20の開示とは、次の場面で順番だけを並べる
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'p15' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [7, 7], [7, 10]);
    const card = P.postShot(g, { id: '一覧外', listed: false, when: '2026/7/10 13:33', text: 'p15_text', imgs: ['p15_img'], x: 70, y: 110, h: 720, textW: 560,
      rows: [{ label: '確認メモ', color: MEMO, text: '元資料の投稿の一覧（50件）にない投稿。投稿の時刻は、画面のとおり13:33で、取引時間の中。' },
        { label: '確認メモ', color: MEMO, show: false, text: '添付の表の数字は、画像に写っている値。元資料には信用残の数字がないので、買い残・売り残は、元資料では確かめられない。表のいちばん新しい行は7/3で、7/10の行はない。' }] });
    enter(card);
    const FX = 1468, FW = 422;
    const f1 = fact(g, { x: FX, y: 130, w: FW, lab: '一般的な説明', html: '買い残は、信用取引で買われて、まだ決済されていない株の数' + small('売り残は、信用取引で売られて、まだ決済されていない株の数') });
    const f2 = fact(g, { x: FX, y: 130, w: FW, lab: '添付の表の数字', html: '5/29の買い残は、274,700株<br>7/3の買い残は、120,700株' + small('5週間で、154,000株減った。<br>残りは、およそ44%。<br>半分より、少し少ない') });
    const f3 = fact(g, { x: FX, y: 382, w: FW, lab: '添付の表の数字', html: '4週間前の6/5は173,800株' + small('7/3までに53,100株減った。減り方は、およそ31%で、半分までは減っていない') });
    const f4 = fact(g, { x: FX, y: 594, w: FW, lab: '添付の表の数字', html: '売り残は、読める週は、どれも0' + small('5/8の行は「—」。<br>5/1の行は、下が切れていて読めない') });
    const f5 = fact(g, { x: FX, y: 130, w: FW, lab: '元資料との照合', html: '買い残・売り残の数字は、<br>元資料では確かめられない' + small('元資料には、信用残の数字が載っていない') });
    const f6 = fact(g, { x: FX, y: 330, w: FW, lab: '元資料との照合', html: '売買高の列は、元資料の日足の<br>出来高と、おおよそ同じ' + small('日足の出来高の棒を、週ごとに足した。<br>棒の高さから読んだ、およその値での比較') });
    E.wait(1.0);
    E.narr('7月10日、13時33分の投稿。これは、元資料の投稿の一覧には、載っていない。', { yomi: '7月10日、13時33分の投稿。これは、もとしりょうの、投稿の一覧には、載っていない。' });
    E.cap('3260 エスポア\n約一ヶ月で買い残が半分に減っとるな', { dur: 5.0 });
    let L = E.say('hat', 'この投稿は、「週次信用残」という題の、表の画面を、1枚付けている。', { wait: false, yomi: 'この投稿は、しゅうじ、しんようざん、という題の、ひょうの画面を、いちまい付けている。' });
    let fr = [frame(g, card, 0, [14, 14, 290, 80], L.dur * .3)];
    E.at(L.end);
    E.say('hat', '表を見て、約1か月で、買い残が、半分に減った、という見方を書いている。', { yomi: 'ひょうを見て、やく、いっかげつで、かいざんが、はんぶんに減った、という見方を書いている。' });
    fr.forEach(n => E.hide(n, .2));
    // 買い残・売り残とは（一般的な説明）
    L = E.say('hat', '買い残は、信用取引で買われて、まだ決済されていない、株の数だ。', { wait: false, delay: .2, yomi: 'かいざんは、しんようとりひきで買われて、まだ、けっさいされていない、株の数だ。' });
    pin(f1, .3);
    fr = [frame(g, card, 0, [796, 128, 990, 966], L.dur * .4)];
    E.at(L.end);
    L = E.say('hat', '売り残は、信用取引で売られて、まだ決済されていない、株の数だ。', { wait: false, yomi: 'うりざんは、しんようとりひきで売られて、まだ、けっさいされていない、株の数だ。' });
    fr.push(frame(g, card, 0, [600, 128, 786, 966], L.dur * .4));
    E.at(L.end);
    fr.forEach(n => E.hide(n, .2));
    L = E.say('hat', '表は、週ごとに、1行ある。いちばん新しい行は、7月3日だ。', { wait: false, delay: .2, yomi: 'ひょうは、週ごとに、いちぎょうある。いちばん新しい行は、7月3日だ。' });
    fr = [frame(g, card, 0, [0, 196, 1114, 280], L.dur * .5)];
    E.at(L.end);
    E.say('hat', '投稿の日の、7月10日の行は、この表にはない。');
    fr.forEach(n => E.hide(n, .2)); E.hide(f1, .3);
    // 買い残の数字（添付の表のとおり）
    L = E.say('hat', '5月29日の行の買い残は、27万4700株。7月3日の行は、12万700株だ。', { wait: false, delay: .3, yomi: '5月29日の行の、かいざんは、にじゅうななまん、よんせんななひゃくかぶ。7月3日の行は、じゅうにまん、ななひゃくかぶだ。' });
    fr = [frame(g, card, 0, [0, 624, 1114, 706], .3), frame(g, card, 0, [0, 196, 1114, 280], L.dur * .6)];
    pin(f2, L.dur * .3);
    E.at(L.end);
    E.say('hat', 'この5週間で、15万4000株減った。残りは、およそ44％だ。', { yomi: 'この、ごしゅうかんで、じゅうごまん、よんせんかぶ減った。残りは、およそ、よんじゅうよんパーセントだ。' });
    E.say('hat', '5月29日の行から数えると、買い残は、半分より少し少なくなっていた。', { yomi: '5月29日の行から数えると、かいざんは、はんぶんより、少し少なくなっていた。' });
    fr[0] && E.hide(fr[0], .2);
    L = E.say('hat', 'ちょうど4週間前の、6月5日の行と比べると、17万3800株から、12万700株。', { wait: false, delay: .2, yomi: 'ちょうど、よんしゅうかん前の、6月5日の行と比べると、じゅうななまん、さんぜんはっぴゃくかぶから、じゅうにまん、ななひゃくかぶ。' });
    fr.push(frame(g, card, 0, [0, 538, 1114, 622], .3));
    pin(f3, L.dur * .4);
    E.at(L.end);
    E.say('hat', '減ったのは、5万3100株で、およそ31％。半分までは、減っていない。', { yomi: '減ったのは、ごまん、さんぜんひゃっかぶで、およそ、さんじゅういちパーセント。はんぶんまでは、減っていない。' });
    E.say('hat', 'いちばん大きく減ったのは、5月29日から、6月5日までの1週間だ。', { yomi: 'いちばん大きく減ったのは、5月29日から、6月5日までの、いっしゅうかんだ。' });
    E.say('hat', '1週間で、10万900株減っていた。', { yomi: 'いっしゅうかんで、じゅうまん、きゅうひゃくかぶ減っていた。' });
    fr.forEach(n => E.hide(n, .2));
    // 売り残
    L = E.say('hat', '売り残は、読める週は、どれも0だった。', { wait: false, delay: .2, yomi: 'うりざんは、読める週は、どれも、ゼロだった。' });
    fr = [frame(g, card, 0, [600, 196, 786, 870], .3)];
    pin(f4, L.dur * .4);
    E.at(L.end);
    L = E.say('hat', '5月8日の行は、線だけで、5月1日の行は、下が切れていて、読めない。', { wait: false, yomi: '5月8日の行は、せんだけで、5月1日の行は、下が切れていて、読めない。' });
    fr.push(frame(g, card, 0, [0, 888, 1114, 1001], .3));
    E.at(L.end);
    fr.forEach(n => E.hide(n, .2)); [f2, f3, f4].forEach(n => E.hide(n, .3));
    // 画像の数字で、元資料の数字ではない
    E.show(card.rows[1], .3, .2);
    E.say('hat', 'ここで読んだ数字は、どれも、添付の画像に写っている数字だ。', { delay: .2 });
    L = E.say('hat', '元資料には、信用残の数字が、載っていない。', { wait: false, yomi: 'もとしりょうには、しんようざんの数字が、載っていない。' });
    pin(f5, .3);
    E.at(L.end);
    E.say('hat', 'だから、買い残と売り残の数字は、元資料では、確かめられない。', { yomi: 'だから、かいざんと、うりざんの数字は、もとしりょうでは、確かめられない。' });
    L = E.say('hat', '売買高の列だけは、元資料の日足の、出来高の棒と、比べられる。', { wait: false, yomi: 'ばいばいだかの列だけは、もとしりょうの、ひあしの、できだかの棒と、比べられる。' });
    fr = [frame(g, card, 0, [392, 128, 586, 966], .3)];
    pin(f6, L.dur * .4);
    E.at(L.end);
    E.say('hat', '週ごとに、棒を足してみると、表の売買高と、おおよそ同じだった。', { yomi: '週ごとに、棒を足してみると、ひょうの、ばいばいだかと、おおよそ同じだった。' });
    E.wait(.4);
  });

  // 買い残が減る、ということ（一般的な説明）。誰が・なぜ・需給がどうなったかは、表からは分からない
  E.scene({ name: 'p15_read' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '買い残が減る、ということ', 60);
    E.show(tt, .3);
    P.note(sc.root, '一般的な説明', { x: 1650, y: 40, size: 24, dark: true });
    const p1 = E.div(g, { left: 160, top: 190, width: 1360, padding: '26px 40px 30px', borderRadius: 24, background: 'rgba(255,255,255,.96)', boxShadow: '0 12px 24px rgba(0,0,0,.35)', boxSizing: 'border-box', textAlign: 'center' },
      '<div style="font:900 40px/1.4 Zen;color:#262236">信用取引で買われた株は、あとで、決済される</div><div style="font:800 28px/1.5 Round;color:#4a4552;margin-top:8px">株を売って決済する場合も、お金を払って、株を引き取る場合もある。<br>どちらでも、買い残は減る</div>').ini({ o: 0 });
    const p2 = E.div(g, { left: 160, top: 470, width: 1360, padding: '22px 40px 26px', borderRadius: 24, background: '#2a2430', border: '3px solid #ffd84a', boxShadow: '0 12px 24px rgba(0,0,0,.35)', boxSizing: 'border-box', textAlign: 'center' },
      '<div style="font:800 26px/1.4 Round;color:#f3e6c8">この表からは、分からないこと</div><div style="font:900 36px/1.5 Zen;color:#ffd84a;margin-top:6px">誰が、なぜ決済したのかは、表には出ていない</div><div style="font:800 26px/1.5 Round;color:#f3e6c8;margin-top:6px">売り買いのバランスが良くなったかどうかも、この表だけでは言えない</div>').ini({ o: 0 });
    E.wait(.5);
    let L = E.say('hat', '買い残が減るのは、信用取引で買われた株が、決済されたときだ。', { wait: false, yomi: 'かいざんが減るのは、しんようとりひきで買われた株が、けっさいされたときだ。' });
    pin(p1, .3);
    E.at(L.end);
    E.say('hat', '決済には、株を売る方法と、お金を払って、株を引き取る方法がある。', { yomi: 'けっさいには、株を売る方法と、お金を払って、株を引き取る方法がある。' });
    E.say('hat', 'どちらでも、買い残は減る。どちらだったかは、この表からは分からない。', { yomi: 'どちらでも、かいざんは減る。どちらだったかは、このひょうからは、分からない。' });
    L = E.say('hat', '誰が、なぜ決済したのかも、この表には、出ていない。', { wait: false, yomi: '誰が、なぜ、けっさいしたのかも、このひょうには、出ていない。' });
    pin(p2, .3);
    E.at(L.end);
    E.say('hat', '売り買いのバランスが、良くなったかどうかも、この表だけでは、言えない。', { yomi: '売り買いのバランスが、良くなったかどうかも、このひょうだけでは、言えない。' });
    const call = P.eveCall(sc.root, ['normal', 'surprise'], { x: 1560, y: 580, w: 300, h: 240 });
    E.pop(call, .4, 0, .6);
    E.say('eve', '買い残が減ったことは、画像で読めるけど、その理由までは、分からないんだね〜。', { talk: call, talkAmp: 3, delay: .3, yomi: 'かいざんが減ったことは、画像で読めるけど、その理由までは、分からないんだねー。' });
    E.wait(.3);
  });

  // 7月10日を時刻の順に（順番だけ。投稿が先なので「投稿の時点で未公表」とだけ言う）
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'p15_order' }, sc => {
    const g = sc.cam;
    E.bgm('tension', { fadeIn: .6, gain: .75 });
    P.slate(g);
    E.div(g, { left: 80, top: 60, font: '900 40px/1.2 Zen', color: '#f3e6c8', whiteSpace: 'nowrap' }, '2026年7月10日（金）　時刻の順番');
    const ax = P.dayAxis(g, { x: 160, y: 330, w: 1600, from: 480, to: 1170, open: 540, band: [[540, 690, '前場'], [750, 930, '後場']] });
    E.show(ax.root, .5, .2);
    const dots = [
      P.axisDot(g, ax, { m: 813, y: 330, kind: 'T', label: '一覧外 13:33' }),
      P.axisDot(g, ax, { m: 930, y: 330, kind: 'I', label: '会社 15:30' }),
      P.axisDot(g, ax, { m: 1100, y: 330, kind: 'I', label: 'I43 18:20' })];
    const row = (t, c, a, b) => `<div style="display:flex;align-items:center;gap:20px;padding:8px 0"><span style="flex:none;width:120px;font:900 36px/1.2 Noto;color:#22252b">${t}</span><span style="flex:none;padding:3px 12px 4px;border-radius:10px;background:${c};color:#fff;font:900 24px/1.2 Noto">${a}</span><span style="font:800 28px/1.3 Round;color:#3d4556;white-space:nowrap">${b}</span></div>`;
    const list = E.div(g, { left: 260, top: 450, width: 1400, padding: '16px 40px', borderRadius: 22, background: 'rgba(255,255,255,.95)', boxShadow: '0 12px 24px rgba(0,0,0,.35)', boxSizing: 'border-box' },
      row('13:33', MEMO, '投稿（一覧外）', '週ごとの信用残の表を付けた投稿') + row('15:30', P.I_ORANGE, '会社の開示', '第三者委員会の再設置・第1四半期の開示の遅れ') + row('18:20', P.I_ORANGE, 'I43', '名証が監理銘柄（審査中）に指定したことの開示')).ini({ o: 0 });
    const ord = E.div(g, { left: 260, top: 700, width: 1400, padding: '16px 30px', borderRadius: 22, background: '#2a2430', border: '3px solid #ffd84a', boxShadow: '0 12px 24px rgba(0,0,0,.35)', boxSizing: 'border-box', textAlign: 'center', font: '900 32px/1.4 Zen', color: '#ffd84a' },
      '投稿の時点（13:33）では、委員会の再設置と、<br>監理銘柄（審査中）の指定は、まだ公表されていなかった').ini({ o: 0 });
    E.wait(.6);
    E.say('hat', '7月10日を、時刻の順に並べる。');
    let L = E.say('hat', '13時33分の投稿は、取引時間の中、後場の時間だ。', { wait: false, yomi: '13時33分の投稿は、取引時間の中、ごばの時間だ。' });
    E.pop(dots[0], .4, .3); E.sfx('pop', { delay: .3 });
    E.at(L.end);
    L = E.say('hat', '取引時間のあと、15時30分と、18時20分に、会社の開示があった。', { wait: false, yomi: '取引時間のあと、15時30分と、18時20分に、会社の開示があった。' });
    E.pop(dots[1], .4, L.dur * .35); E.sfx('notify', { delay: L.dur * .35 });
    E.pop(dots[2], .4, L.dur * .7); E.sfx('notify', { delay: L.dur * .7 });
    pin(list, L.dur * .9);
    E.at(L.end);
    L = E.say('hat', 'この投稿の時点で、委員会の再設置は、まだ公表されていなかった。', { wait: false, yomi: 'この投稿の時点で、いいんかいの、さいせっちは、まだ公表されていなかった。' });
    E.tw(ord, .4, { o: [0, 1], y: [20, 0] }, 'back', L.dur * .3); E.sfx('ding', { delay: L.dur * .3, gain: .5 });
    E.at(L.end);
    E.say('hat', '監理銘柄（審査中）の指定も、まだ公表されていなかった。', { yomi: 'かんりめいがら、しんさちゅうの、指定も、まだ公表されていなかった。' });
    E.say('hat', 'この投稿の本文と表は、信用残のことで、開示の中身には、触れていない。', { yomi: 'この投稿の本文と、ひょうは、しんようざんのことで、開示の中身には、触れていない。' });
    E.say('hat', '並べて言えるのは、時刻の順番だけだ。開示の中身を、次に見る。', { yomi: 'ならべて言えるのは、時刻の順番だけだ。開示の中身を、次に見る。' });
    E.wait(.3);
  });

  /* ============================================================ S7 7月10日　15:30 → 18:20 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'jul10' }, sc => {
    const g = sc.cam;
    P.slate(g);
    bar(g, [7, 10], [7, 10]);
    const ch = P.chain(g, { x: 260, y: 130, w: 1400, cw: 520, gaps: [''], items: [
      { id: '会社', time: '15:30', sub: '委員会の再設置・第1四半期の遅れ', color: P.I_ORANGE },
      { id: 'I43', time: '18:20', sub: '監理銘柄（審査中）の指定', color: P.I_ORANGE }] });
    ch.in(0, .3);
    E.wait(.8);
    E.say('hat', '7月10日。15時30分に、会社は、第三者委員会を、もう一度設置すると公表した。', { yomi: '7月10日。15時30分に、会社は、だいさんしゃいいんかいを、もう一度、設置すると公表した。' });
    E.say('hat', '第1四半期の開示が、遅れることも、同時に公表した。', { yomi: 'だいいちしはんきの開示が、遅れることも、同時に公表した。' });
    ch.in(1, .1);
    const i43 = P.icard(g, { id: 'I43', when: '2026/7/10 18:20', session: '引け後', title: '監理銘柄・審査中を追加', text: '決算の信頼性が長期に確保されない状況等を理由に、<br>監理銘柄（審査中）に指定', note: '15:30に委員会再設置・第1四半期開示遅延、18:20に監理指定の会社IR', x: 260, y: 320, w: 1400, size: 32 });
    E.tw(i43, .45, { o: [0, 1], y: [30, 0] }, 'back', .7); E.sfx('notify', { delay: .7 });
    E.wait(1.2);
    E.say('hat', '18時20分。名証が、監理銘柄（審査中）に指定したことを、会社が開示した。', { yomi: '18時20分。めいしょうが、かんりめいがら、しんさちゅうに、指定したことを、会社が開示した。' });
    E.say('hat', '会社の開示では、理由は、決算の信頼性が、長い期間、確保されない状況など、とされた。', { yomi: '会社の開示では、理由は、決算の、しんらいせいが、長い期間、確保されない状況など、とされた。' });
    E.wait(.3);
  });

  /* ============================================================ S8 確認中と、審査中 */
  E.trans('stripes', { dur: .7 });
  E.scene({ name: 'kanri2' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '監理銘柄：確認中と、審査中', 60);
    E.show(tt, .3);
    const b1 = box(g, { x: 160, y: 190, w: 700, h: 300, top: '5月28日', main: '確認中', sub: '基準に当たるかを<br>確認している段階', c: '#b8651a' });
    const b2 = box(g, { x: 1060, y: 190, w: 700, h: 300, top: '7月10日に追加', main: '審査中', sub: '上場廃止にするかどうかを<br>審査している段階', c: '#c62828', border: '5px solid #c62828' });
    const ar = E.div(g, { left: 880, top: 290, width: 160, textAlign: 'center', font: '900 80px/1 Zen', color: '#f3e6c8' }, '＋').ini({ o: 0 });
    E.wait(.3);
    let L = E.say('hat', '5月28日に、名証は、確認中に指定した。7月10日に、審査中が加わった。', { wait: false, yomi: '5月28日に、めいしょうは、かくにんちゅうに指定した。7月10日に、しんさちゅうが、加わった。' });
    rise(b1, .2); E.show(ar, .3, L.dur * .5); rise(b2, L.dur * .55);
    E.at(L.end);
    E.say('hat', '審査中は、上場廃止にするかどうかを、取引所が、審査している段階だ。', { yomi: '審査中は、上場廃止にするかどうかを、とりひきじょが、審査している段階だ。' });
    const nb = panel(g, { x: 220, y: 580, w: 1480, h: 110, size: 32, dark: true, html: '<span style="font:800 28px Round;color:#f3e6c8">元資料の分析</span><span>事業の開示が続いても、監査の問題は解決していなかった</span>' });
    L = E.say('hat', '元資料は、事業の開示が続いても、監査の問題は、解決していなかった、と読んでいる。', { wait: false, yomi: 'もとしりょうは、事業の開示が続いても、監査の問題は、解決していなかった、と読んでいる。' });
    E.tw(nb, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S9 累計出来高 6/5〜7/10 */
  E.scene({ name: 'cumvol' }, sc => {
    const g = sc.cam;
    P.slate(g);
    const tt = P.heading(g, '累計出来高の表（元資料 p14 の1行）', 44);
    E.show(tt, .3);
    const cols = [['対象期間', '06/05〜07/10', 340], ['価格変化', '−4.17%', 250], ['上昇日', '16.10', 220], ['下落日', '20.19', 220], ['変わらず', '0.00', 220], ['総出来高', '36.29', 230]];
    let x = 160;
    const cells = cols.map(([h, v, w], i) => {
      const n = E.div(g, { left: x, top: 220, width: w - 10, height: 230, borderRadius: 18, background: 'rgba(255,255,255,.95)', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,.3)' },
        `<div style="font:800 28px/1.3 Round;color:#6a6066;padding-top:34px">${h}</div><div style="font:900 44px/1.6 Noto;color:#262236">${v}</div>`).ini({ o: 0 });
      x += w; return n;
    });
    E.div(g, { left: 120, top: 470, width: 1540, textAlign: 'right', font: '800 20px/1.3 Round', color: 'rgba(243,230,200,.8)', whiteSpace: 'nowrap' }, '単位：万株（分割調整後）。上昇日・下落日は終値の前日比で判定（ローソク足の赤・緑とは別）。価格変化は期間直前の終値→期間最終終値');
    E.wait(.3);
    let L = E.say('hat', '6月5日から、7月10日までの、累計出来高の表だ。', { wait: false, yomi: '6月5日から、7月10日までの、るいけい、できだかの、ひょうだ。' });
    cells.forEach((c, i) => { E.tw(c, .35, { o: [0, 1], y: [20, 0] }, 'back', .2 + i * L.dur * .12); E.sfx('pop', { delay: .2 + i * L.dur * .12, gain: .35 }); });
    E.at(L.end);
    E.say('hat', 'この間の終値は、4.17％下がった。', { yomi: 'この間の、おわりねは、ヨンテンイチナナパーセント、下がった。' });
    E.say('hat', '下がった日の出来高は20.19万株、上がった日は16.10万株。', { yomi: '下がった日の、できだかは、ニジュッテンイチキューまんかぶ、上がった日は、ジューロクテンイチゼロまんかぶ。' });
    const no = panel(g, { x: 260, y: 560, w: 1400, h: 110, size: 32, dark: true, html: '同じ株が何度も売買される → 合計を「誰かの持ち株」に読み替えられない' });
    L = E.say('hat', 'ここでも、合計を、誰かの持ち株に、読み替えることはできない。', { wait: false });
    E.tw(no, .4, { o: [0, 1], y: [20, 0] }, 'back', .3); E.sfx('ding', { delay: .3, gain: .5 });
    E.at(L.end + .4);
  });

  /* ============================================================ S10 ブルちゃんの部屋 */
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
    E.narr('事業の知らせは、続いていた。私は、そちらばかりを、読んでいた。');
    E.narr('調査の知らせは、読んだつもりで、読み飛ばしていた。');
    E.wait(.3);
  });

  /* ============================================================ S11 師匠のノート */
  E.scene({ name: 'note' }, sc => {
    const g = sc.cam;
    E.div(g, { left: -200, top: -200, width: W + 400, height: H + 400, background: 'radial-gradient(ellipse at 50% 45%, #6b4a2b 0%, #3a2616 70%, #24170c 100%)' });
    const paper = P.paper(g, { x: 260, y: 70, w: 1400, h: 820, rot: -1.5, lineGap: 92 });
    E.from(paper, { y: 80, r: 4 }, .6, 0, 'quint');
    E.div(paper, { left: 120, top: 30, font: '900 38px/1.2 Zen', color: '#6b5a40' }, '師匠のノート');
    const line = E.chars(paper, '同じ時刻の開示は、別々に読め', { left: 120, top: 120, font: '900 64px/1.3 Zen', color: '#2a2230' });
    line.spans.forEach((sp, i) => E.tw(sp, .2, { o: [0, 1] }, 'out', 1.0 + i * .07));
    E.sfx('pen', { delay: 1.0, gain: .6 });
    const d1 = E.div(paper, { left: 140, top: 380, width: 520, height: 260, borderRadius: 20, border: '5px solid #d9822b', background: 'rgba(255,255,255,.6)', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#b8651a', paddingTop: 60 }, '事業<br><span style="font-size:30px">権利取得・用地売却</span>').ini({ o: 0 });
    const d2 = E.div(paper, { left: 760, top: 380, width: 520, height: 260, borderRadius: 20, border: '6px solid #c62828', background: 'rgba(255,255,255,.6)', textAlign: 'center', font: '900 50px/1.4 Zen', color: '#c62828', paddingTop: 60 }, '監査<br><span style="font-size:30px">調査の中断</span>').ini({ o: 0 });
    E.wait(2.4);
    E.narr('師匠のノートには、こう書いてあった。');
    const L = E.narr('「同じ時刻の開示は、別々に読め」。', { wait: false, yomi: '同じ時刻の開示は、別々に読め。' });
    E.show(d1, .4, .2); E.tw(d2, .45, { o: [0, 1], s: [1.2, 1] }, 'back', L.dur * .5); E.sfx('stamp', { delay: L.dur * .5 + .2, gain: .5 });
    E.at(L.end + 1.0);
  });

  /* ============================================================ S12 男爵 */
  E.trans('fade', { dur: .6, color: '#000' });
  E.scene({ name: 'baron' }, sc => {
    const g = sc.cam;
    E.bgm('boss', { fadeIn: .6, gain: .75 });
    const C = P.closeup(g, CH('baron_e_normal'), { bg: 'radial-gradient(ellipse at 50% 40%, #4a1622 0%, #200a10 75%)', imgH: 860, panelBg: 'linear-gradient(180deg,#3a121b,#1a070c)' });
    E.from(C.img, { s: .94, y: 30 }, .6, 0, 'out');
    E.wait(.5);
    E.say('baron', '同じ時刻に届いた知らせを、人は、一つにまとめて読みたがる。', { talk: C.img, talkAmp: 2, yomi: '同じ時刻に届いた知らせを、人は、ひとつにまとめて読みたがる。' });
    C.swap(CH('baron_e_scheme'));
    E.say('baron', 'だが、別々に追わなければ、答えは出ない。', { talk: C.img, talkAmp: 2 });
    E.wait(.5);
  });

  /* ============================================================ S13 次回予告 */
  E.trans('stripes', { dur: .9 });
  E.scene({ name: 'next' }, sc => {
    const g = sc.cam;
    E.bgm('resolve', { fadeIn: .8, gain: .8 });
    E.div(g, { left: -400, top: -200, width: W + 800, height: H + 400, background: 'radial-gradient(ellipse at 45% 45%, #2b3a63 0%, #141c38 75%, #0b1022 100%)' });
    E.particles(g, { n: 40, kind: 'sparkle', color: '#ffd84a', area: [0, 0, W, H], speed: .6, seed: 1212 });
    [['T', P.T_BLUE], ['I', P.I_ORANGE]].forEach(([t, c], i) => {
      const n = E.div(g, { left: 260 + i * 380, top: 260, width: 300, height: 300, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '900 150px/1 Noto', color: '#fff', boxShadow: '0 16px 32px rgba(0,0,0,.4)' }, t).ini({ o: 0 });
      E.pop(n, .4, .4 + i * .3, .5); E.sfx('pop', { delay: .4 + i * .3 }); E.float(n, 8, 1.4, i);
    });
    const st = P.sticky(g, '第13章<br>480円と、売れていく用地', { x: 1260, y: 120, w: 580, h: 250, rot: 5, size: 40 });
    P.slap(st, 1.6);
    const pig = E.actor(g, 'pig', { x: 1760, y: 1130, h: 560, pose: 'front', shadow: false }).ini({ x: 420 });
    E.tw(pig, .7, { x: [420, 0] }, 'back', 2.2);
    E.sfx('snort', { delay: 2.4 });
    E.wait(2.8);
    E.say('pig', 'ブヒッ。次は、第13章だブー。', { talk: pig, talkAmp: 5, yomi: 'ブヒッ。次は、だいじゅうさんしょうだブー。' });
    E.unsub(.4);
    const tsu = E.div(g, { left: 0, top: 660, width: W, textAlign: 'center', font: '900 64px/1.2 Zen', color: '#f3e6c8', letterSpacing: '.3em' }, 'つづく').ini({ o: 0 });
    E.show(tsu, .8, .9);
    E.wait(3.0);
  });
  E.scene({ name: 'notice_end', bg: '#0b1022' }, sc => {
    const g = sc.cam;
    E.div(g, { left: 0, top: 0, width: W, height: H, background: 'radial-gradient(ellipse at 50% 45%, #1d2a4a 0%, #0b1022 75%)' });
    const n = P.kNotice(g, { x: 40, y: 340, w: 1840, size: 26, posts: true });
    E.show(n, .6, .2);
    E.wait(6.0);
  });
  E.bgmStop(2.5, -2.5);
  E.finish();
}
