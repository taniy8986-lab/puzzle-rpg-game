/* 第2章：セリフ（id ＝ シーン番号_行番号）ごとの小道具の割り当て */
(function () {
  const K = window.KIT;
  const keep = def => Object.assign({ newCut: false }, def);   // 続く同じ種類のカットとつなげる
  const MIRAI_ROWS = [
    { n: 0, text: '価格位置：420円から一日で500円', tag: '事実', line: 0 },
    { n: 1, text: '出来高の増減：急増、100万株（例）', tag: '事実', line: 0 },
    { n: -1, text: '翌朝は438円（500円割れ）', tag: '事実', line: 0 },
    { n: 2, text: '終値・下髭・安値更新：まだ見ていない', tag: 'これから', line: 1 },
    { n: 3, text: '玉の質：私みたいな飛びつきが多そう？', tag: '推測', line: 1 },
    { n: 4, text: '誰の純保有が増減したか', tag: '不明', line: 1, ring: true },
    { n: 5, text: '同じ値幅に必要な出来高', tag: 'これから', line: 1 },
  ];
  const READ_SUBS = ['今どのあたりの値段か', '増えたか、減ったか', 'その日の最後と、下の線', '長期の現物か、短期の回転か', '公開情報がなければ不明', '値幅＝値段の動いた幅'];
  window.EP_CONTENT = {
    '00_00': K.phoneQuestion(),
    '01_00': K.procession({ followers: 0, title: '本尊', defs: ['本尊＝相場の中心になって株を集める人・資金'], boxes: true }),
    '01_01': K.procession({ followers: 7, defs: ['提灯＝本尊の動きに乗っかって買う人', '大提灯＝大きな資金でついてくる人'] }),
    '01_04': K.participants({ sub: '参加者が増える ＝ 全員が本尊について行くわけではない' }),
    '02_00': K.stage(0),
    '02_01': K.stage(1),
    '02_02': K.stage(2, { aside: false }),
    '02_04': K.stage(2, { aside: true }),
    '02_05': K.stage(3),
    '03_00': K.mythX('本尊が売った\n→ 即終了？', '本尊が少し買った\n→ 仕込み継続？', { sub: '仕込み＝先に株を集めておくこと' }),
    '03_02': K.netFormula({ numbers: false, head: '見るのは“方向”', formula: '売買差額 ＝ 買い − 売り（どっちが多い？）', sum: '株数の積み上がり ＝ 純保有', ask: '増える方向？\n減る方向？' }),
    '04_02': K.rotation({ sub: '回転＝同じ株が何度も売り買いされること／デイトレ＝その日のうちに売り買いを終える取引' }),
    '04_03': keep(K.table3({ from: 0, to: 1 })),
    '04_07': K.table3({ from: 2, to: 2 }),
    '04_08': K.bigRelease(),
    '05_00': K.readOrder({ from: 0, to: 2, subs: READ_SUBS }),
    '05_01': K.shitahige(),
    '05_02': K.readOrder({ from: 3, to: 5, subs: READ_SUBS }),
    '06_00': keep(K.miraiNote(MIRAI_ROWS)),
    '07_01': K.sticky('第3章\n眠っていた\n銘柄？', 'シコリの鮮度／底値圏の出来高'),
  };
  // 脚本の指定を絵に合わせて少し変える（ちびキャラは笑顔の 1 枚しかないので、困り顔・驚き顔はアップで）
  window.EP_SHOT = {
    '00_03': { bg: 'festival', cast: [{ who: 'mina', pose: 'back', x: 0.36 }, { who: 'bull', pose: 'back', x: 0.52 }, { who: 'oji', pose: 'back', x: 0.7 }] },
    '02_03': { type: 'close', who: 'mina', bubble: '迷子に！？', emote: 'rays', fx: ['sweat'] },
    '03_01': { type: 'close', who: 'mina', bubble: '何を見るの？', emote: 'gloom', fx: ['question'] },
    '04_05': { type: 'close', who: 'mina', bubble: '消えちゃう！？', emote: 'rays', fx: ['shock'] },
  };
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
