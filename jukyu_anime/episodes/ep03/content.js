/* 第3章：セリフ（id ＝ シーン番号_行番号）ごとの小道具の割り当て */
(function () {
  const K = window.KIT;
  const keep = def => Object.assign({ newCut: false }, def);   // 続く同じ種類のカットとつなげる
  const NEM_ROWS = [
    { n: -1, text: '3年前に800円と大出来高、その後2年以上300円台', tag: '事実', line: 0 },
    { n: -1, text: '週足で、出来高が増え続けている', tag: '事実', line: 0 },
    { n: -1, text: '800円の古いシコリは、鮮度が落ちている？', tag: '推測', line: 0 },
    { n: -1, text: '安値の売り物が、強い手へ移っている？', tag: '推測', line: 0 },
    { n: -1, text: '仕込みかどうか・誰が買っているか', tag: '不明', line: 1, ring: true },
    { n: -1, text: '値段の反応と、800円に近づいた時の実売り', tag: 'これから', line: 1 },
  ];
  window.EP_CONTENT = {
    '00_00': K.phoneMiraiNow(),
    '00_02': K.phoneRanking(),
    '01_02': K.nemOverview(),
    '01_07': keep(K.oldHolders()),
    '01_09': K.nemBand(),
    '02_01': keep(K.freshHolders()),
    '02_07': keep(K.freshCompare()),
    '02_09': keep(K.freshTable()),
    '02_14': K.conclusionMemo(),
    '03_00': keep(K.nemBottom()),
    '03_03': K.highLow({ step: 'intro' }),
    '03_05': keep(K.highLow({ step: 'anim' })),
    '03_08': K.bottomCollect(),
    '03_09': K.weeklyVsSpike(),
    '03_12': keep(K.bigYang()),
    '03_14': K.thinShelf(),
    '03_16': K.fallingSpike(),
    '03_17': keep(K.miraiNote(NEM_ROWS, { title: 'ネムノキ化学（※架空）を分けてみる', doodle: '🍮' })),
    '04_01': K.sticky('第4章\n一度、仕掛ける\n理由？', '売り物を表面化させるテスト／上髭・押し・再挑戦'),
  };
  window.EP_SHOT = {};
  // 話していない人の表情（2 人のアップで見える）
  window.EP_REACT = {
    '01_01': { oji: ['smile', 1.0] },
    '01_06': { mina: ['troubled', 1.3] },
    '03_11': { mina: ['troubled', 1.2] },
    '03_20': { mina: ['teary', 1.4] },
  };
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
