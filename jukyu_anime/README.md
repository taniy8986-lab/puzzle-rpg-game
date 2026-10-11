# 押し目おじさんの弟子になりました（需給相場ストーリーアニメ）

『需給相場・玉集め・仕手戦 完全教科書 第4版』（学習用ノート）の内容を、ブルちゃん・ミナ・押し目おじさんの
師弟ドラマとして見せる解説アニメ。1 章ずつ作って確認してから次へ進む。

## 章立て（予定）

| 章 | 題 | 原典 |
|---|---|---|
| 1 | 上がっている株を買った日（済） | 1・2 |
| 2 | 出来高100万株の正体？（済） | 3・4 |
| 3 | 眠っていた銘柄 | 5・6 |
| 4 | 一度、仕掛ける理由 | 7・8 |
| 5 | 下がっても、動いていない | 9・10 |
| 6 | 上がった分と下がった分の交換量 | 11・12 |
| 7 | 真空地帯の重さ | 13・14・34 |
| 8 | 大株主が売るとき | 15 |
| 9 | 空売りの逆回転 | 16・17 |
| 10 | 信用買いは弱い玉／消えた板 | 18・19 |
| 11 | 材料と公開の仕手戦 | 20・21 |
| 12 | 受け皿とハシゴ | 22・23 |
| 13 | 陽線二本と最初のハシゴ | 24 |
| 14 | 心理で買う | 25（図解ページ） |
| 15 | 待つという武器 | 26・27・28 |
| 16 | 卒業試験 | 29〜33・35 |

## 作り方

```sh
# 1. キャラクターシート 3 枚から素材を切り出す（waifu2x で拡大して背景を抜き、白いフチを焼き込む）
python3 tools/extract_chara.py ブルちゃん.png ミナ.png 押し目おじさん.jpg
python3 tools/upscale_faces.py bull mina
python3 tools/outline.py

# 2. 台本（episodes/ep01/script.json）のセリフを Open JTalk で読み上げ、時刻表を作る
sudo apt-get install open-jtalk open-jtalk-mecab-naist-jdic hts-voice-nitech-jp-atr503-m001
python3 tools/voice.py ep01

# 3. 撮影して MP4 に（音のミックスも自動）
node render.js ep01                    # build/ep01/ep01.mp4
node render.js ep01 --stills 10,42.5   # 確認用の静止画
```

- `engine/` … 背景（`backgrounds.js`）、小道具（`props.js`）、カット割りと演出（`story.js`）
- `episodes/epXX/` … 台本（`script.json`）・小道具の割り当てとカットの上書き（`content.js`）・章専用の部品（`kit.js`。第2章以降は第1章の部品も読み込む）
- `tools/` … 素材の切り出し、声、音のミックス

## クレジット

音声：Open JTalk、HTS voice “Mei”（名古屋工業大学, CC BY 3.0）、HTS voice “nitech_jp_atr503_m001”（名古屋工業大学, CC BY 3.0）／
絵の拡大：waifu2x（MIT）／フォント：M PLUS Rounded 1c、Zen Maru Gothic、Dela Gothic One、Noto Sans JP（SIL OFL）。
教育目的のフィクションで、登場する銘柄・数字は架空。売買を推奨するものではない。
