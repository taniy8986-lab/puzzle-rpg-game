/* 第1章：セリフ（id ＝ シーン番号_行番号）ごとの小道具の割り当て */
(function () {
  const K = window.KIT;
  const keep = def => Object.assign({ newCut: false }, def);   // 続く同じ種類のカットとつなげる
  window.EP_CONTENT = {
    '00_00': K.phoneNight({ time: '10:12', date: '10月14日（火）', items: [
      { title: 'ミライ製菓　株価上昇中 +19%', ago: '3分前' },
      { title: 'ミライ製菓　出来高が急増しています', ago: '1分前' },
      { title: '注目ランキング 1位：ミライ製菓', ago: '今', icon: '★', color: '#f2a900', app: '株ニュース' },
    ] }),
    '00_01': K.phoneStock({ from: 420, change: '+80（+19.0%）', badge: '出来高急増', volLabel: '出来高 100万株（例）', volBlink: true }),
    '00_03': K.phoneSNS([
      { name: 'うさぎ投資', id: '@usa_kabu', text: 'ミライ製菓きてる！🚀', likes: 312, color: '#f6a6bd' },
      { name: '株クラ・まめ', id: '@kabu_mame', text: '出来高すごい＝人気の証拠でしょ', likes: 528, color: '#7bc4c4' },
      { name: '急騰ウォッチ', id: '@kyuto_w', text: '乗り遅れるな！まだ上がる', likes: 941, color: '#f2b632' },
    ]),
    '00_04': K.calendar({ marks: [{ day: 14 }], notes: [{ text: 'はじめての株！\nミライ製菓を\n500円で買った', x: 1360, y: 140 }] }),
    '01_00': K.phoneStock({ from: 500, to: 438, change: '−62（−12.4%）', up: false, badge: '急落', data: K.DATA.MIRAI_NEXT, vol: K.DATA.MIRAI_NEXT_VOL, buyLine: 500 }),
    '02_04': K.boxOwners({ title: '問い①今の価格で誰が売れる？　②実際に何株出た？', mode: 'market' }),
    '02_05': K.boxForced(),
    '03_01': K.phoneWho(),
    '03_02': K.factMemo(),
    '04_00': K.compareAB(),
    '04_01': K.boxA(),
    '04_03': keep(K.boxB()),
    '04_05': K.boxAB(),
    '05_00': K.cards([['ストック', 'いまどこに株券が\n固定されているか'], ['フロー', 'その日に実際に\n動いた株数'], ['価格反応', '割れたか・\n止まったか・\n跳ねたか'], ['強制フロー', 'いずれ売買せざるを\n得ない力']], { title: '見るものは 4つ' }),
    '05_01': K.boxStock(),
    '05_02': K.phoneTape(),
    '05_03': K.reactMemo(),
    '05_04': K.forcedCalendar(),
    '05_05': K.boxShort(),
    '06_01': K.cards([['売れる玉の在庫', ''], ['実売りの量', ''], ['買い戻し余力', '']], { title: '価格 ＝ 結果　／　原因は？', h: 200, y: 360 }),
    '06_02': K.boardMemo(),
    '06_03': K.phoneQuestion(),
    '06_04': K.sticky('第2章\n出来高100万株\nの正体？', '本尊・提灯・大提灯／出来高は交換量'),
  };
  // 聞いている人の表情（話していないキャラの反応）
  window.EP_REACT = {};
  window.EP_CREDITS = [
    ['原案', '『需給相場・玉集め・仕手戦 完全教科書 第4版』（学習用ノート）\n参考：TAKA.K『伝説の相場師の教え』'],
    ['キャラクター', 'ブルちゃん／ミナ／押し目おじさん'],
    ['音声合成', 'Open JTalk ／ HTS voice “Mei”（MMDAgent, 名古屋工業大学, CC BY 3.0）／ HTS voice “nitech_jp_atr503_m001”（名古屋工業大学, CC BY 3.0）'],
    ['絵の拡大', 'waifu2x（nagadomi, MIT License）'],
    ['フォント', 'M PLUS Rounded 1c ／ Zen Maru Gothic ／ Dela Gothic One ／ Noto Sans JP（SIL OFL）'],
    ['音楽・効果音', 'プログラムで合成'],
    ['注意', '教育目的のフィクションです。登場する銘柄・数字は架空で、売買を推奨するものではありません。'],
  ];
})();
