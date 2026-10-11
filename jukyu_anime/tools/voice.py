"""台本（episodes/epXX/script.json）のセリフを Open JTalk で読み上げ、タイムラインを作る。

    python3 tools/voice.py ep01

出力:
  build/ep01/voice/<scene>_<n>.wav   … 1 セリフ 1 ファイル（48 kHz モノラル）
  build/ep01/timeline.js             … 動画（HTML）が読む時刻表。各セリフの開始・長さ・口パク用の音量
  build/ep01/timeline.json           … 音のミックス（mix_audio.py）が読む同じ内容

声:
  ミナ        HTS voice "Mei"（happy / sad / angry / bashful を表情で切り替え）高め・少し速め
  ブルちゃん  HTS voice "Mei"（normal / bashful / sad / angry）落ち着いた高さ
  おじさん    HTS voice "nitech_jp_atr503_m001"（男声）
  ナレーション Mei normal を低めに
Mei は Nagoya Institute of Technology（MMDAgent）、m001 は Nagoya Institute of Technology の
CC BY 3.0。クレジットはエンドカードに出す。
"""
import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
DIC = "/var/lib/mecab/dic/open-jtalk/naist-jdic"
VOICES = ROOT / "build" / "voices"
M001 = "/usr/share/hts-voice/nitech-jp-atr503-m001/nitech_jp_atr503_m001.htsvoice"
FPS = 30

# 尺の決まり（秒）
INTRO = 1.0        # 暗転から明けるまで
SCENE_IN = 0.75    # シーンの頭（暗転明け）〜最初のセリフ
GAP = 0.22         # セリフの間
GAP_SWITCH = 0.30  # 話者が替わる時
GAP_CUTIN = 0.35   # カットインの前のため
SCENE_OUT = 0.8    # 最後のセリフ〜次のシーン
EYECATCH = 3.2     # 途中のアイキャッチ
OUTRO = 7.0        # クレジット


def voice_args(speaker, expr):
    """話者と表情から Open JTalk の引数を決める。"""
    if speaker == "oji":
        tone = {"hot": 1.5, "fist": 1.0, "surprised": 2.0, "troubled": -0.5}.get(expr, 0.0)
        speed = {"hot": 1.14, "fist": 1.12, "troubled": 1.04}.get(expr, 1.09)
        return ["-m", M001, "-fm", str(tone - 1.0), "-r", str(speed), "-a", "0.55", "-jf", "1.2"]
    if speaker == "mina":
        style = {"teary": "sad", "troubled": "sad", "burger": "sad", "pout": "angry",
                 "shy": "bashful", "sleepy": "bashful"}.get(expr, "happy")
        tone = {"surprised": 4.0, "excited": 3.5, "sparkle": 3.5}.get(expr, 3.0)
        return ["-m", str(VOICES / f"mei_{style}.htsvoice"), "-fm", str(tone), "-r", "1.12", "-a", "0.55"]
    if speaker == "bull":
        style = {"shy": "bashful", "relax": "bashful", "tea": "bashful", "sad": "sad", "cry": "sad",
                 "angry": "angry", "fist": "happy", "excited": "happy", "sparkle": "happy",
                 "wink": "happy", "wave": "happy"}.get(expr, "normal")
        tone = {"surprised": 1.5}.get(expr, 0.0)
        return ["-m", str(VOICES / f"mei_{style}.htsvoice"), "-fm", str(tone - 0.5), "-r", "1.07", "-a", "0.54"]
    # ナレーション（ミナの一人語り。会話より落ち着いた声）
    style = {"teary": "sad", "troubled": "sad", "sad": "sad", "shy": "bashful"}.get(expr, "normal")
    return ["-m", str(VOICES / f"mei_{style}.htsvoice"), "-fm", "2.0", "-r", "1.08", "-a", "0.55"]


def synth(text, args, out):
    txt = out.with_suffix(".txt")
    txt.write_text(text, encoding="utf-8")
    subprocess.run(["open_jtalk", "-x", DIC, *args, "-g", "0", "-ow", str(out), str(txt)], check=True)
    txt.unlink()


def read_wav(path):
    with wave.open(str(path)) as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    return x, sr


def trim_silence(x, sr, path):
    """前後の無音を詰める（口パクとタイミングが合うように）。"""
    level = np.abs(x)
    idx = np.nonzero(level > 0.01)[0]
    if len(idx) == 0:
        return x
    a = max(idx[0] - int(0.03 * sr), 0)
    b = min(idx[-1] + int(0.08 * sr), len(x))
    x = x[a:b]
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
    return x


def envelope(x, sr):
    """フレームごとの音量（0〜9 の整数列）。口パクと話者の揺れに使う。"""
    hop = sr // FPS
    n = int(np.ceil(len(x) / hop))
    env = []
    for i in range(n):
        seg = x[i * hop:(i + 1) * hop]
        env.append(float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.0)
    env = np.asarray(env)
    peak = np.percentile(env, 95) if len(env) else 1
    return [int(v) for v in np.clip(np.round(env / max(peak, 1e-4) * 9), 0, 9)]


def ensure_voices():
    """Mei の声（npm の openjtalk パッケージに同梱、CC BY 3.0）を build/voices に用意する。"""
    if (VOICES / "mei_normal.htsvoice").exists():
        return
    VOICES.mkdir(parents=True, exist_ok=True)
    subprocess.run(["npm", "pack", "openjtalk@0.1.6", "--silent", "--pack-destination", str(VOICES)], check=True)
    tgz = VOICES / "openjtalk-0.1.6.tgz"
    subprocess.run(["tar", "xzf", str(tgz), "-C", str(VOICES), "--strip-components=3",
                    "package/voice/mei"], check=True)
    tgz.unlink()


def main(ep):
    ensure_voices()
    script = json.loads((ROOT / "episodes" / ep / "script.json").read_text(encoding="utf-8"))
    out = ROOT / "build" / ep
    vdir = out / "voice"
    vdir.mkdir(parents=True, exist_ok=True)

    scenes_in = script["scenes"]
    # アイキャッチは真ん中あたりのシーンの前（脚本で eyecatch_before を指定してもよい）
    eye_id = script.get("eyecatch_before")
    t = INTRO
    scenes, lines = [], []
    eyecatch = None
    prev = None
    for si, scene in enumerate(scenes_in):
        if scene["id"] == eye_id and si > 0:
            eyecatch = {"start": round(t, 3), "end": round(t + EYECATCH, 3)}
            t += EYECATCH
        s_start = t
        t += SCENE_IN
        prev = None
        for li, line in enumerate(scene["lines"]):
            if prev is not None:
                t += GAP if prev == line["speaker"] else GAP_SWITCH
                if (line.get("shot") or {}).get("type") == "cutin":
                    t += GAP_CUTIN
            t += float(line.get("pause_before", 0))
            name = f"{si:02d}_{li:02d}"
            wav = vdir / f"{name}.wav"
            text = line.get("yomi") or line["text"]
            synth(text, voice_args(line["speaker"], line["expr"]), wav)
            x, sr = read_wav(wav)
            x = trim_silence(x, sr, wav)
            dur = len(x) / sr
            lines.append({
                "id": name, "scene": si, "idx": li, "speaker": line["speaker"], "expr": line["expr"],
                "text": line["text"], "shot": line.get("shot") or {"type": "close"}, "start": round(t, 3), "dur": round(dur, 3),
                "env": envelope(x, sr), "wav": str(wav.relative_to(ROOT)),
            })
            t += dur
            prev = line["speaker"]
            print(f"{name} {line['speaker']:5s} {dur:5.2f}s  {line['text']}")
        t += SCENE_OUT
        scenes.append({"id": scene["id"], "place": scene.get("place", ""), "start": round(s_start, 3), "end": round(t, 3)})
    total = t + OUTRO
    data = {"ep": ep, "fps": FPS, "intro": INTRO, "outro": OUTRO, "outroStart": round(t, 3), "duration": round(total, 3),
            "title": script.get("chapter_title") or script.get("episode_title", ""),
            "subtitle": script.get("chapter_subtitle") or script.get("episode_subtitle", ""),
            "eyecatch": eyecatch, "scenes": scenes, "lines": lines}
    (out / "timeline.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    (out / "timeline.js").write_text("window.EP = " + json.dumps(data, ensure_ascii=False) + ";\n", encoding="utf-8")
    print(f"合計 {total:.1f} 秒（{total / 60:.1f} 分）  セリフ {len(lines)} 行")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "ep01")
