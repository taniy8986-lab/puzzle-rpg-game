"""セリフの声を音声合成で作る（Open JTalk の mei の声を、キャラごとに高さ・声道の長さ・速さを変えて使う）。

    python3 tools/make_voice.py build/ch01_lines.json
      → build/voice/<ハッシュ>.wav（48 kHz・モノラル）
      → build/ch01_voice.json / build/ch01_voice.js（行ごとのファイルと長さ。js はページが読む）
      → out/ch01_台本.csv（行番号・話者・字幕・読み。別の音声に差し替える時の台本）

差し替え: voice_override/ch01/012.wav のように「行番号.wav」を置くと、その行は合成せずにそのファイルを使う
（VOICEVOX などで作った声に入れ替えたい時用。長さに合わせて映像のタイミングも自動で変わる）。

声の作り方: 声道の長さ（フォルマント）を F 倍にするため、F 倍速く/遅く合成してから 1/F 倍に伸び縮みさせる。
高さ P 半音・話す速さ S 倍は、合成時の half_tone と speed で打ち消し合うように決める。
"""
import csv
import hashlib
import json
import math
import re
import sys
import wave
from fractions import Fraction
from pathlib import Path

import numpy as np
import pyopenjtalk
from scipy.io import wavfile
from scipy.signal import resample_poly, butter, sosfilt

HERE = Path(__file__).resolve().parent.parent
SR = 48000
VERSION = "v4"

# F: 声道の長さ（>1 で子どもっぽく、<1 で大人の男性っぽく）, P: 高さ（半音）, S: 速さ, gain: 音量の補正
PRESETS = {
    "bull":   dict(F=1.07, P=2.5, S=1.08, gain=1.0),
    "narr":   dict(F=1.06, P=1.0, S=1.06, gain=0.95),
    "eve":    dict(F=1.11, P=5.0, S=1.12, gain=0.95),
    "mentor": dict(F=0.76, P=-15.0, S=0.95, gain=1.05),
    "baron":  dict(F=0.72, P=-18.0, S=0.90, gain=1.1),
    "hat":    dict(F=0.80, P=-13.0, S=1.02, gain=1.05),
    "pig":    dict(F=0.84, P=-9.5, S=1.10, gain=1.0),
    "crowd":  dict(F=1.00, P=0.0, S=1.08, gain=0.9),
}


def normalize(text):
    """字幕の文字列を読み上げ用に整える。"""
    s = re.sub(r"\{\w+\|([^}]*)\}", r"\1", text)      # 強調の記法を外す
    s = s.replace("\n", "、")
    s = re.sub(r"(?<=\d),(?=\d{3})", "", s)           # 1,000 → 1000
    s = re.sub(r"[—―]{1,}", "、", s)
    s = re.sub(r"[…‥]+(?=[？！?!。])", "", s)        # 「……？」の三点リーダーは読まない
    s = re.sub(r"…+|‥+", "、", s)
    s = s.replace("〜", "ー").replace("～", "ー")
    s = s.replace("≠", "とは違う")
    s = s.replace("取引所", "とりひきじょ")             # 単独では「とりひきしょ」と読まれるため
    s = s.replace("監査人", "かんさにん")               # 「かんさじん」と読まれるため
    s = s.replace("中間期", "ちゅうかんき")             # 「ちゅうげんき」と読まれるため
    s = s.replace("埋まら", "うまら")                   # 窓が「うずまらない」と読まれるため
    s = re.sub(r"、+", "、", s).strip("、 ")
    return s


def trim(x, thr=0.01, pad=0.03):
    """前後の無音を切る（少しだけ余白を残す）。"""
    env = np.abs(x)
    idx = np.where(env > thr * env.max())[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(pad * SR))
    b = min(len(x), idx[-1] + int(pad * SR))
    return x[a:b]


def synth(text, preset):
    F, P, S = preset["F"], preset["P"], preset["S"]
    speed = S / F
    half = P - 12 * math.log2(F)
    x, sr = pyopenjtalk.tts(text, speed=speed, half_tone=half)
    assert sr == SR, sr
    x = x.astype(np.float64) / 32768.0
    if abs(F - 1) > 1e-3:
        fr = Fraction(1 / F).limit_denominator(64)
        x = resample_poly(x, fr.numerator, fr.denominator)
    x = trim(x)
    # 低域のこもりを取り、子音を少し立てる
    x = sosfilt(butter(2, 80, "high", fs=SR, output="sos"), x)
    rms = np.sqrt(np.mean(x ** 2)) + 1e-9
    x = x * (10 ** (-18 / 20) / rms) * preset["gain"]
    peak = np.abs(x).max()
    if peak > 0.89:
        x *= 0.89 / peak
    n = int(0.006 * SR)
    x[:n] *= np.linspace(0, 1, n)
    x[-n:] *= np.linspace(1, 0, n)
    return x.astype(np.float32)


def read_wav(path):
    sr, y = wavfile.read(path)
    y = y.astype(np.float64)
    if y.ndim > 1:
        y = y.mean(axis=1)
    if np.abs(y).max() > 2:
        y /= 32768.0
    if sr != SR:
        fr = Fraction(SR, sr).limit_denominator(1000)
        y = resample_poly(y, fr.numerator, fr.denominator)
    return y.astype(np.float32)


def write_wav(path, x):
    y = np.clip(x, -1, 1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((y * 32767).astype(np.int16).tobytes())


def main(lines_json):
    src = Path(lines_json)
    data = json.loads(src.read_text())
    ch = data["ch"]
    vdir = HERE / "build" / "voice"
    vdir.mkdir(parents=True, exist_ok=True)
    odir = HERE / "voice_override" / f"ch{ch}"
    out = {}
    rows = []
    made = 0
    for i, ln in enumerate(data["lines"], start=1):
        who = ln["who"]
        text = normalize(ln.get("yomi") or ln["text"])
        override = odir / f"{i:03d}.wav"
        if override.exists():
            x = read_wav(override)
            key = "override_" + hashlib.sha1(override.read_bytes()).hexdigest()[:16]
            path = vdir / f"{key}.wav"
            if not path.exists():
                write_wav(path, x)
        else:
            preset = PRESETS.get(who, PRESETS["crowd"])
            key = hashlib.sha1(f"{VERSION}|{who}|{json.dumps(preset, sort_keys=True)}|{text}".encode()).hexdigest()[:20]
            path = vdir / f"{key}.wav"
            if not path.exists():
                write_wav(path, synth(text, preset))
                made += 1
            with wave.open(str(path)) as w:
                x = None
                dur = w.getnframes() / w.getframerate()
        if override.exists():
            dur = len(x) / SR
        out[ln["id"]] = {"file": str(path), "dur": round(dur, 3), "line": i}
        rows.append([i, who, re.sub(r"\{\w+\|([^}]*)\}", r"\1", ln["text"]).replace("\n", " "), text,
                     "" if override.exists() else pyopenjtalk.g2p(text, kana=True), f"{dur:.2f}"])

    (HERE / "build" / f"ch{ch}_voice.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
    (HERE / "build" / f"ch{ch}_voice.js").write_text("window.VOICE = " + json.dumps({k: v["dur"] for k, v in out.items()}) + ";\n")
    (HERE / "out").mkdir(exist_ok=True)
    with open(HERE / "out" / f"ch{ch}_台本.csv", "w", newline="", encoding="utf-8-sig") as f:
        wr = csv.writer(f)
        wr.writerow(["行", "話者", "字幕", "読み（合成に使った文字列）", "カナ（読み間違いの確認用）", "秒"])
        wr.writerows(rows)
    total = sum(v["dur"] for v in out.values())
    print(f"声: {len(out)} 行（新しく合成 {made} 行）・合計 {total:.1f} 秒")


if __name__ == "__main__":
    main(sys.argv[1])
