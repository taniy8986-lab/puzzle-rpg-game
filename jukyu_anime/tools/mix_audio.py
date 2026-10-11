"""声・BGM・効果音を合成してミックスする（外部の音素材は使わない）。

    python3 tools/mix_audio.py ep01      # build/ep01/audio.wav（48 kHz ステレオ）

入力:
  build/<ep>/timeline.json … voice.py が作る。各セリフの wav と開始時刻
  build/<ep>/sfx.json      … render.js がページから取り出す効果音の時刻表
BGM は F メジャー・96 BPM のゆったりしたループ（エレピ・ベース・マリンバ・軽いドラム）を
その場で合成し、声が出ている間は自動で下げる。
"""
import json
import sys
import wave
from pathlib import Path

import numpy as np
from scipy import signal

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(7)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(dur):
    return np.arange(int(dur * SR)) / SR


def adsr(n, a=0.005, d=0.1, s=0.6, r=0.2):
    a, d, r = max(int(a * SR), 1), max(int(d * SR), 1), max(int(r * SR), 1)
    sus = max(n - a - d - r, 0)
    e = np.concatenate([np.linspace(0, 1, a), np.linspace(1, s, d), np.full(sus, s), np.linspace(s, 0, r)])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))


class Bus:
    def __init__(self, dur):
        self.n = int(dur * SR) + SR * 3
        self.L = np.zeros(self.n)
        self.R = np.zeros(self.n)

    def add(self, t, x, gain=1.0, pan=0.0):
        i = int(round(t * SR))
        if i < 0:
            x, i = x[-i:], 0
        m = min(len(x), self.n - i)
        if m <= 0:
            return
        gl = np.cos((pan + 1) * np.pi / 4) * gain
        gr = np.sin((pan + 1) * np.pi / 4) * gain
        self.L[i:i + m] += x[:m] * gl
        self.R[i:i + m] += x[:m] * gr


# ---------------- 楽器 ----------------
def epiano(freq, dur, vel=1.0):
    t = tt(dur)
    env = np.exp(-t * 2.2) * (1 - np.exp(-t * 400))
    x = (np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 5)
         + 0.12 * np.sin(2 * np.pi * freq * 3 * t) * np.exp(-t * 9))
    x *= 1 + 0.08 * np.sin(2 * np.pi * 4.5 * t)
    return x * env * vel


def bass(freq, dur, vel=1.0):
    t = tt(dur)
    env = adsr(len(t), 0.004, 0.12, 0.7, 0.08)
    x = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * freq * 2 * t)
    return np.tanh(x * 1.3) * env * vel


def marimba(freq, dur=0.5, vel=1.0):
    t = tt(dur)
    x = np.sin(2 * np.pi * freq * t) * np.exp(-t * 9) + 0.3 * np.sin(2 * np.pi * freq * 3.9 * t) * np.exp(-t * 30)
    return x * vel * (1 - np.exp(-t * 800))


def kick(vel=1.0):
    t = tt(0.35)
    f = 50 + 70 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * vel


def noise(dur):
    return rng.standard_normal(int(dur * SR))


def bandpass(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def highpass(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype="high", fs=SR, output="sos"), x)


def lowpass(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype="low", fs=SR, output="sos"), x)


def snare(vel=1.0):
    t = tt(0.22)
    n = bandpass(noise(0.22), 1200, 6000) * np.exp(-t * 22)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.5
    return (n * 0.8 + tone) * vel


def shaker(vel=1.0):
    t = tt(0.07)
    return highpass(noise(0.07), 6000) * np.exp(-t * 60) * vel


# ---------------- 効果音 ----------------
def sfx_whoosh():
    d = 0.6
    t = tt(d)
    x = noise(d)
    out = np.zeros_like(x)
    # 周波数が上がって下がるバンドパスを近似（区間ごとに）
    seg = 12
    for k in range(seg):
        a, b = k * len(x) // seg, (k + 1) * len(x) // seg
        f = 400 + 3000 * np.sin(np.pi * (k + .5) / seg)
        out[a:b] = bandpass(x, f * .6, min(f * 1.6, 20000))[a:b]
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return out * env * 0.9


def sfx_pop():
    t = tt(0.16)
    f = 520 + 900 * np.exp(-t * 40)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 28) * 0.8


def sfx_ding():
    t = tt(1.6)
    x = sum(a * np.sin(2 * np.pi * 1318.5 * r * t) * np.exp(-t * d) for a, r, d in
            [(1, 1, 3), (.5, 2.76, 5), (.3, 5.4, 8), (.2, 8.9, 12)])
    return x * 0.5 * (1 - np.exp(-t * 2000))


def sfx_impact():
    t = tt(1.2)
    boom = np.sin(2 * np.pi * np.cumsum(40 + 90 * np.exp(-t * 12)) / SR) * np.exp(-t * 4)
    crash = highpass(noise(1.2), 3000) * np.exp(-t * 3) * 0.35
    swell = np.zeros(int(0.3 * SR))
    pre = highpass(noise(0.3), 2000) * np.linspace(0, 1, len(swell)) ** 2 * 0.4
    return np.concatenate([pre, boom * 1.1 + crash])


def sfx_coin():
    t = tt(0.4)
    x = (np.sin(2 * np.pi * 1975 * t) + 0.6 * np.sin(2 * np.pi * 2637 * t)) * np.exp(-t * 12)
    x[int(0.06 * SR):] += (np.sin(2 * np.pi * 2637 * t) * np.exp(-t * 12))[:len(x) - int(0.06 * SR)] * 0.7
    return x * 0.35


def sfx_stamp():
    t = tt(0.4)
    thump = np.sin(2 * np.pi * np.cumsum(60 + 160 * np.exp(-t * 40)) / SR) * np.exp(-t * 14)
    click = bandpass(noise(0.4), 800, 4000) * np.exp(-t * 50) * 0.6
    return (thump + click) * 0.9


def sfx_tick():
    t = tt(0.05)
    return np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 120) * 0.35


def sfx_sparkle():
    out = np.zeros(int(1.0 * SR))
    for i, m in enumerate([84, 88, 91, 96, 100]):
        x = marimba(mtof(m), 0.6, 0.35)
        a = int(i * 0.06 * SR)
        out[a:a + len(x)] += x[:len(out) - a]
    return out


def sfx_boing():
    t = tt(0.5)
    f = 180 + 120 * np.sin(2 * np.pi * 7 * t) * np.exp(-t * 4)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5) * 0.6


def sfx_buzz():
    t = tt(0.45)
    x = signal.sawtooth(2 * np.pi * 110 * t) * 0.5 + signal.sawtooth(2 * np.pi * 116 * t) * 0.5
    return lowpass(x, 1800) * adsr(len(t), 0.01, 0.05, 0.8, 0.08) * 0.35


def sfx_count():
    """カウンターが回る音（細かいティック）。"""
    out = np.zeros(int(0.9 * SR))
    for i in range(14):
        x = sfx_tick()
        a = int(i * 0.06 * SR)
        out[a:a + len(x)] += x * (0.6 + 0.4 * i / 14)
    return out


def sfx_jingle():
    out = np.zeros(int(2.4 * SR))
    notes = [65, 69, 72, 77, 81, 84]
    for i, m in enumerate(notes):
        x = marimba(mtof(m), 0.8, 0.55)
        a = int(i * 0.075 * SR)
        out[a:a + len(x)] += x[:len(out) - a]
    for m in (53, 60, 65, 69, 72):
        x = epiano(mtof(m), 1.8, 0.28)
        a = int(0.5 * SR)
        out[a:a + len(x)] += x[:len(out) - a]
    return out


def sfx_notify():
    """スマホの通知音（ピポン）。"""
    out = np.zeros(int(0.9 * SR))
    for i, (f, a) in enumerate(((1568, 0.0), (2093, 0.13))):
        t = tt(0.7)
        x = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2 * t)) * np.exp(-t * 7) * (1 - np.exp(-t * 3000))
        s = int(a * SR)
        out[s:s + len(x)] += x[:len(out) - s] * 0.45
    return out


def sfx_paper():
    t = tt(0.45)
    x = bandpass(noise(0.45), 1500, 7000) * np.sin(np.pi * np.clip(t / 0.45, 0, 1)) ** 1.5
    return x * 0.55


def sfx_pen():
    """マーカーで丸を描く音。"""
    t = tt(0.7)
    mod = 0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 6 * t))
    x = bandpass(noise(0.7), 2500, 9000) * mod * np.sin(np.pi * np.clip(t / 0.7, 0, 1))
    return x * 0.4


def sfx_thud():
    t = tt(0.3)
    x = np.sin(2 * np.pi * np.cumsum(90 + 120 * np.exp(-t * 30)) / SR) * np.exp(-t * 18)
    x += lowpass(noise(0.3), 900) * np.exp(-t * 25) * 0.6
    return x * 0.7


def sfx_shimmer():
    """回想に入る時のきらきらした上昇音。"""
    out = np.zeros(int(1.4 * SR))
    for i, m in enumerate([72, 76, 79, 84, 88, 91]):
        x = marimba(mtof(m), 0.9, 0.18) + epiano(mtof(m), 0.9, 0.08)
        a = int(i * 0.08 * SR)
        out[a:a + len(x)] += x[:len(out) - a]
    sw = highpass(noise(1.4), 5000) * np.linspace(0, 1, len(out)) ** 2 * 0.08
    return out + sw


def sfx_tap():
    t = tt(0.06)
    return bandpass(noise(0.06), 2000, 8000) * np.exp(-t * 90) * 0.5


SFX = {
    "notify": sfx_notify, "paper": sfx_paper, "pen": sfx_pen, "thud": sfx_thud, "shimmer": sfx_shimmer, "tap": sfx_tap,
    "whoosh": sfx_whoosh, "pop": sfx_pop, "ding": sfx_ding, "impact": sfx_impact, "coin": sfx_coin,
    "stamp": sfx_stamp, "tick": sfx_tick, "sparkle": sfx_sparkle, "boing": sfx_boing, "buzz": sfx_buzz,
    "count": sfx_count, "jingle": sfx_jingle,
}
_cache = {}


def get_sfx(name):
    if name not in _cache:
        _cache[name] = SFX[name]()
    return _cache[name]


# ---------------- BGM ----------------
BPM = 96
BEAT = 60 / BPM
BAR = BEAT * 4
# F メジャー： Fmaj7 / Dm7 / Bbmaj7 / C7sus4→C7 （ルート, 和音の構成音）
PROG = [
    (41, [57, 60, 64, 65]),
    (38, [57, 60, 62, 65]),
    (46, [57, 58, 62, 65]),
    (36, [55, 58, 60, 65]),
    (41, [57, 60, 64, 65]),
    (38, [57, 60, 62, 65]),
    (46, [57, 58, 62, 65]),
    (36, [55, 58, 60, 64]),
]
ARP = [0, 2, 1, 3, 2, 1, 3, 2]


def bgm(dur):
    bus = Bus(dur)
    nbars = int(np.ceil(dur / BAR)) + 1
    for b in range(nbars):
        t0 = b * BAR
        root, chord = PROG[b % len(PROG)]
        # エレピのコード（1 拍目と 2 拍目の裏）
        for off, vel in ((0, .2), (BEAT * 1.5, .14), (BEAT * 3, .12)):
            for m in chord:
                bus.add(t0 + off, epiano(mtof(m), BEAT * 2.2, vel), 0.5, -0.2 + (m % 5) * 0.1)
        # ベース
        for off, m, l in ((0, root, BEAT * 1.4), (BEAT * 1.5, root + 12, BEAT * .45), (BEAT * 2, root, BEAT * 1.4),
                          (BEAT * 3.5, root + 7, BEAT * .45)):
            bus.add(t0 + off, bass(mtof(m), l, .5), 0.55)
        # マリンバのアルペジオ（2 小節に 1 回、休みを入れる）
        if b % 2 == 0:
            for i, ai in enumerate(ARP):
                bus.add(t0 + i * BEAT / 2, marimba(mtof(chord[ai] + 12), 0.5, .22), 0.6, 0.3)
        # ドラム
        for beat in range(4):
            if beat in (0, 2):
                bus.add(t0 + beat * BEAT, kick(.55), 0.7)
            if beat in (1, 3):
                bus.add(t0 + beat * BEAT, snare(.18), 0.6, 0.1)
            for s in range(2):
                bus.add(t0 + beat * BEAT + s * BEAT / 2, shaker(.16 if s else .1), 0.6, 0.35)
    return bus


CALM_BPM = 74
CALM_BEAT = 60 / CALM_BPM
CALM_BAR = CALM_BEAT * 4
# F メジャー： Fmaj7 / Em7 / Dm7 / Cmaj7 / Bbmaj7 / Am7 / Gm7 / C7sus4
CALM_PROG = [(41, [57, 60, 64, 65]), (40, [55, 59, 62, 64]), (38, [53, 57, 60, 62]), (36, [52, 55, 59, 60]),
             (46, [53, 57, 58, 62]), (45, [52, 55, 57, 60]), (43, [50, 53, 55, 58]), (36, [53, 55, 58, 60])]


def pad(freq, dur, vel=1.0):
    t = tt(dur)
    x = sum(np.sin(2 * np.pi * freq * d * t + p) for d, p in ((1, 0), (1.003, 1.3), (0.997, 2.1))) / 3
    x += 0.2 * np.sin(2 * np.pi * freq * 2 * t)
    env = np.minimum(1, t / 0.8) * np.minimum(1, (dur - t) / 0.8)
    return lowpass(x, 2200) * env * vel


def bgm_calm(dur):
    bus = Bus(dur)
    nbars = int(np.ceil(dur / CALM_BAR)) + 1
    for b in range(nbars):
        t0 = b * CALM_BAR
        root, chord = CALM_PROG[b % len(CALM_PROG)]
        for m in chord:
            bus.add(t0, pad(mtof(m), CALM_BAR + 0.6, .09), 0.6, -0.3 + (m % 4) * 0.2)
        bus.add(t0, bass(mtof(root), CALM_BEAT * 3.6, .32), 0.5)
        # ピアノのアルペジオ（8 分音符、ところどころ休む）
        pat = [0, 2, 3, 1, 2, 3, 1, 2]
        for i, ai in enumerate(pat):
            if (b + i) % 7 == 6:
                continue
            bus.add(t0 + i * CALM_BEAT / 2, epiano(mtof(chord[ai] + 12), CALM_BEAT * 1.8, .16 - (i % 2) * .04), 0.6, 0.25 - (i % 3) * 0.2)
        # 2 小節に 1 回、高いところで短い旋律
        if b % 2 == 1:
            for j, (off, d) in enumerate(((0, 1.5), (1.5, .5), (2, 2))):
                bus.add(t0 + off * CALM_BEAT, marimba(mtof(chord[(j + b) % 4] + 24), 0.9, .10), 0.6, 0.4)
    return bus


def read_wav(path):
    with wave.open(str(path)) as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
    if sr != SR:
        x = signal.resample_poly(x, SR, sr)
    return x


def main(ep):
    out = ROOT / "build" / ep
    tl = json.loads((out / "timeline.json").read_text(encoding="utf-8"))
    sfx_path = out / "sfx.json"
    sfx = json.loads(sfx_path.read_text()) if sfx_path.exists() else []
    dur = tl["duration"]

    voice = Bus(dur)
    activity = np.zeros(voice.n)
    pan = {"mina": -0.22, "bull": -0.1, "oji": 0.22, "narr": 0.0}
    for l in tl["lines"]:
        x = read_wav(ROOT / l["wav"])
        rms = np.sqrt(np.mean(x ** 2)) + 1e-9
        x = x * (0.11 / rms)  # 声の大きさをそろえる
        x = np.tanh(x * 1.2) / 1.2
        voice.add(l["start"], x, 1.0, pan.get(l["speaker"], 0))
        a = int(l["start"] * SR)
        activity[a:a + len(x)] = 1

    # BGM は声が出ている間だけ下げる（なめらかに）
    if tl.get("bgm", "calm") == "calm":
        music = bgm_calm(dur)
        music.L *= 2.2
        music.R *= 2.2
    else:
        music = bgm(dur)
    k = int(0.25 * SR)
    smooth = np.convolve(activity, np.ones(k) / k, mode="same")
    duck = 1 - 0.62 * np.clip(smooth * 1.5, 0, 1)
    # 頭とお尻は BGM を大きめに・最後はフェードアウト
    t = np.arange(voice.n) / SR
    level = np.where(t < tl["intro"], 0.42, 0.26)
    level = np.where(t > dur - tl["outro"], 0.40, level)
    fade_in = np.clip(t / 0.3, 0, 1)
    fade_out = np.clip((dur - t) / 2.5, 0, 1)
    gain = level * duck * fade_in * fade_out

    fx = Bus(dur)
    for e in sfx:
        if e["name"] in SFX:
            fx.add(e["time"], get_sfx(e["name"]), 0.32 * e.get("gain", 1), e.get("pan", 0))

    L = voice.L + music.L * gain + fx.L
    R = voice.R + music.R * gain + fx.R
    n = int(dur * SR)
    mix = np.stack([L[:n], R[:n]], axis=1)
    mix = np.tanh(mix * 1.1) / 1.1
    peak = np.max(np.abs(mix)) + 1e-9
    mix = mix / peak * 0.89
    pcm = (mix * 32767).astype(np.int16)
    with wave.open(str(out / "audio.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"音を書き出し: {out / 'audio.wav'}  {dur:.1f} 秒  効果音 {len(sfx)} 個")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "ep01")
