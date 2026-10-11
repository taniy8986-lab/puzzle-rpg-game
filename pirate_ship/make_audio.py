"""動画の音を Python だけで合成する（外部の音素材は使わない）。

    python3 make_audio.py        # build/audio.wav（48 kHz, ステレオ, 23.5 秒）

・6/8 拍子の船乗りの歌（オリジナルの旋律）: 付点四分 = 72 → 1 小節 1.667 秒、本編 20 秒 = 12 小節
  手風琴風の和音・低音・太鼓・合唱風の声（フォルマント合成）
・効果音: 巻物・羽ペン・封蝋・光のきらめき・木槌・鉄の音・索具のきしみ・帆・波・かもめ・船鐘・大砲・題字
効果音の時刻は timeline.py（動画と共通）から取る。
"""
import os
import sys
import wave

import numpy as np
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ship_shape as S  # noqa: E402
import timeline as T  # noqa: E402

SR = 48000
DUR = T.TOTAL / T.FPS
N = int(SR * DUR)
rng = np.random.default_rng(2026)
BAR = 60.0 / 72.0 * 2      # 付点四分 = 72 の 6/8 拍子 1 小節（秒）
E8 = BAR / 6               # 八分音符


def fsec(frame):
    return frame / T.FPS


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env_adsr(n, a, d, s, r, sr=SR):
    a, d, r = int(a * sr), int(d * sr), int(r * sr)
    a, d, r = max(a, 1), max(d, 1), max(r, 1)
    sus = max(n - a - d - r, 0)
    e = np.concatenate([np.linspace(0, 1, a), np.linspace(1, s, d), np.full(sus, s), np.linspace(s, 0, r)])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))


class Bus:
    def __init__(self):
        self.L = np.zeros(N + SR * 4)
        self.R = np.zeros(N + SR * 4)

    def add(self, t, x, gain=1.0, pan=0.0):
        """t 秒に x を置く。pan -1（左）… +1（右）。"""
        i = int(t * SR)
        if i < 0:
            x = x[-i:]
            i = 0
        n = min(len(x), len(self.L) - i)
        if n <= 0:
            return
        gl = np.cos((pan + 1) * np.pi / 4) * gain
        gr = np.sin((pan + 1) * np.pi / 4) * gain
        self.L[i:i + n] += x[:n] * gl
        self.R[i:i + n] += x[:n] * gr

    def stereo(self):
        return np.stack([self.L[:N], self.R[:N]], axis=1)


def noise(n):
    return rng.standard_normal(n)


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def lp(x, f, order=2):
    sos = signal.butter(order, f, btype="low", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def hp(x, f, order=2):
    sos = signal.butter(order, f, btype="high", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def reverb_ir(sec=1.8, decay=3.0, seed=1):
    r = np.random.default_rng(seed)
    n = int(sec * SR)
    t = np.arange(n) / SR
    ir = r.standard_normal((2, n)) * np.exp(-decay * t)
    ir = np.stack([lp(ir[0], 6000), lp(ir[1], 6000)])
    ir[:, :int(0.012 * SR)] = 0
    return ir / np.sqrt((ir ** 2).sum(axis=1, keepdims=True))


def apply_reverb(st, wet, sec=1.8, decay=3.0):
    ir = reverb_ir(sec, decay)
    out = st.copy()
    for c in range(2):
        out[:, c] += wet * signal.fftconvolve(st[:, c], ir[c])[:len(st)]
    return out


# ====================================================================== 楽器
def concertina(freq, dur, vel=1.0):
    """手風琴風: 少しずらした 2 本のリードの矩形波＋のこぎり波。"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for det, w in ((0.996, 0.5), (1.004, 0.5)):
        f = freq * det
        ph = 2 * np.pi * f * t + 0.003 * np.sin(2 * np.pi * 5.2 * t)
        saw = sum(np.sin(k * ph) / k for k in range(1, 9))
        sq = sum(np.sin(k * ph) / k for k in range(1, 12, 2))
        out += w * (0.55 * saw + 0.45 * sq)
    out = lp(out, 3200)
    return out * env_adsr(n, 0.03, 0.08, 0.8, 0.06) * vel * 0.22


def pluck_bass(freq, dur, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(4 * np.pi * freq * t) + 0.12 * np.sin(6 * np.pi * freq * t)
    return x * np.exp(-t * 3.2) * env_adsr(n, 0.005, 0.02, 1.0, 0.05) * vel * 0.5


def bodhran(vel=1.0, low=True):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = (95 if low else 150) * (1 + 0.6 * np.exp(-t * 40))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (9 if low else 16))
    skin = bp(noise(n), 300, 2500) * np.exp(-t * 60) * 0.35
    return (body + skin) * vel * 0.55


def fiddle(freq, dur, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.6 * t) * np.clip(t / 0.25, 0, 1)
    ph = 2 * np.pi * np.cumsum(freq * vib) / SR
    x = sum(np.sin(k * ph) * (1 / k) ** 1.1 for k in range(1, 14))
    x = bp(x, 250, 5000)
    return x * env_adsr(n, 0.05, 0.1, 0.85, 0.08) * vel * 0.15


VOWEL_A = [(730, 90, 1.0), (1090, 110, 0.5), (2440, 160, 0.25), (3400, 250, 0.1)]
VOWEL_O = [(500, 80, 1.0), (850, 100, 0.45), (2600, 170, 0.15), (3300, 250, 0.06)]


def choir(notes, start, vowel, voices=6, vel=1.0):
    """合唱風の声: 声門パルス（のこぎり波）＋フォルマント（バンドパス）。notes = [(秒, 長さ, midi)]。"""
    end = max(s + d for s, d, m in notes) + 0.6
    n = int((end - start) * SR)
    out = np.zeros(n)
    for v in range(voices):
        det = 1 + rng.uniform(-0.006, 0.006)
        octave = 0 if v % 3 else -12
        f = np.zeros(n)
        amp = np.zeros(n)
        for s, d, m in notes:
            i0 = int((s - start + rng.uniform(0, 0.03)) * SR)
            i1 = min(int((s - start + d) * SR), n)
            f[i0:i1] = mtof(m + octave) * det
            k = i1 - i0
            amp[i0:i1] = np.maximum(amp[i0:i1], env_adsr(k, 0.07, 0.1, 0.85, 0.12))
        # 無音部分の周波数を前の音でつなぐ
        last = 220.0
        for i in range(0, n, 256):
            if f[i] == 0:
                f[i:i + 256] = np.where(f[i:i + 256] == 0, last, f[i:i + 256])
            else:
                last = f[i]
        t = np.arange(n) / SR
        vib = 1 + 0.008 * np.sin(2 * np.pi * (5.0 + v * 0.2) * t + v)
        ph = np.cumsum(f * vib) / SR
        saw = 2 * (ph % 1.0) - 1
        out += saw * amp
    y = np.zeros(n)
    for fc, bw, g in vowel:
        y += g * bp(out, fc - bw / 2, fc + bw / 2, order=2)
    y += 0.02 * hp(noise(n), 3000) * (np.abs(out) > 0)
    return start, y * vel * 1.6 / voices


# ====================================================================== 効果音
def mallet(pitch=1.0, vel=1.0):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    knock = bp(noise(n), 500 * pitch, 1600 * pitch, 2) * np.exp(-t * 55)
    body = np.sin(2 * np.pi * 190 * pitch * t) * np.exp(-t * 28) * 0.8
    ring = np.sin(2 * np.pi * 640 * pitch * t) * np.exp(-t * 40) * 0.3
    return (knock * 1.4 + body + ring) * vel * 0.5


def iron_clank(vel=1.0):
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    parts = [(310, 1.0, 9), (847, 0.6, 12), (1390, 0.4, 16), (2210, 0.25, 22)]
    x = sum(a * np.sin(2 * np.pi * f * rng.uniform(0.97, 1.03) * t) * np.exp(-t * d) for f, a, d in parts)
    x += bp(noise(n), 1500, 6000) * np.exp(-t * 80) * 0.6
    return x * vel * 0.3


def creak(dur=0.7, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f0 = 140 + 60 * np.sin(2 * np.pi * 1.3 * t) + 20 * rng.standard_normal(n).cumsum() / np.sqrt(np.arange(1, n + 1))
    pulses = (np.sin(2 * np.pi * np.cumsum(f0) / SR) > 0.97).astype(float)
    x = bp(pulses, 300, 2500) * 3
    return x * env_adsr(n, 0.1, 0.1, 0.8, 0.2) * vel * 0.35


def whoosh(dur=1.0, lo=300, hi=3000, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = bp(noise(n), lo, hi)
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2
    return x * e * vel * 0.25


def sail_flap(dur=1.2, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    am = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * (9 + 4 * t) * t)) * np.exp(-t * 1.5)
    x = lp(noise(n), 900) * am
    thump = np.sin(2 * np.pi * 60 * t) * np.exp(-t * 10)
    return (x * 0.6 + thump * 0.8) * env_adsr(n, 0.01, 0.1, 0.7, 0.4) * vel * 0.6


def paper(dur, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    crack = (rng.random(n) < 0.004).astype(float) * rng.uniform(0.3, 1, n)
    crack = bp(crack, 1500, 9000) * 6
    rust = bp(noise(n), 2000, 8000) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 3.3 * t)))
    return (crack + rust * 0.35) * env_adsr(n, 0.1, 0.1, 0.9, 0.3) * vel * 0.25


def quill(dur, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    strokes = np.clip(np.sin(2 * np.pi * 2.7 * t) + 0.2 * np.sin(2 * np.pi * 7.1 * t), 0, 1) ** 2
    x = bp(noise(n), 3000, 9000) * strokes
    return x * env_adsr(n, 0.2, 0.1, 0.9, 0.3) * vel * 0.12


def seal_thump(vel=1.0):
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 70 * t) * np.exp(-t * 14) + lp(noise(n), 500) * np.exp(-t * 25) * 0.5
    return x * vel * 0.9


def shimmer(dur, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    notes = [62, 69, 74, 77, 81, 86, 89, 93]
    for k, m in enumerate(notes):
        t0 = k * dur / len(notes) * 0.8
        i0 = int(t0 * SR)
        tt = t[i0:] - t0
        out[i0:] += np.sin(2 * np.pi * mtof(m) * tt) * np.exp(-tt * 2.2) * 0.4
    sweep = np.sin(2 * np.pi * np.cumsum(300 + 1500 * (t / dur) ** 2) / SR) * 0.08 * np.sin(np.pi * t / dur)
    return (out + sweep) * vel * 0.5


def waves_bed(dur, vel=1.0, seed=3):
    r = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = lp(r.standard_normal(n), 700) * 0.7 + bp(r.standard_normal(n), 800, 4000) * 0.25
    swell = 0.55 + 0.45 * np.sin(2 * np.pi * 0.19 * t + seed) * np.sin(2 * np.pi * 0.07 * t + 1)
    return x * swell * vel * 0.45


def gull(vel=1.0):
    dur = 0.55
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k in range(2):
        t0 = k * 0.22
        i0 = int(t0 * SR)
        tt = t[i0:] - t0
        d = 0.2 if k == 0 else 0.3
        f = 1250 + 900 * np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 0.7 - 250 * (tt / d)
        ph = 2 * np.pi * np.cumsum(f) / SR
        x = np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.25 * np.sin(3 * ph)
        e = np.clip(tt / 0.02, 0, 1) * np.exp(-np.clip(tt - d, 0, None) * 40) * (tt < d + 0.1)
        out[i0:] += x * e
    out += bp(noise(n), 2000, 5000) * 0.05
    return out * vel * 0.12


def bell(vel=1.0, base=720.0):
    n = int(3.5 * SR)
    t = np.arange(n) / SR
    partials = [(0.5, 0.5, 0.9), (1.0, 1.0, 1.4), (1.19, 0.6, 2.0), (1.56, 0.4, 2.4), (2.0, 0.5, 2.8),
                (2.51, 0.3, 3.5), (2.66, 0.25, 4.0), (3.01, 0.2, 5.0), (4.1, 0.1, 6.5)]
    x = sum(a * np.sin(2 * np.pi * base * r * t) * np.exp(-t * d) for r, a, d in partials)
    x += bp(noise(n), 2000, 8000) * np.exp(-t * 200) * 0.6
    return x * vel * 0.18


def cannon(vel=1.0):
    n = int(3.2 * SR)
    t = np.arange(n) / SR
    crack = hp(noise(n), 800) * np.exp(-t * 90) * 1.2
    f = 48 + 70 * np.exp(-t * 18)
    thump = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.5) * 1.6
    body = lp(noise(n), 400, 4) * np.exp(-t * 3.2) * 2.2
    rumble = lp(noise(n), 180, 4) * np.exp(-t * 1.1) * 1.4
    x = crack + thump + body + rumble
    return np.tanh(x * 1.2) * vel * 0.9


def taiko_swell(vel=1.0):
    n = int(2.2 * SR)
    t = np.arange(n) / SR
    f = 62 * (1 + 0.5 * np.exp(-t * 25))
    hit = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.5)
    cym = hp(noise(n), 5000) * np.clip(1 - t / 2.2, 0, 1) ** 2 * 0.25
    return (hit * 1.1 + cym) * vel * 0.8


def cym_swell(dur, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return hp(noise(n), 4000) * (t / dur) ** 3 * vel * 0.25


def chime(m, vel=1.0):
    n = int(2.5 * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    x = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 3)
    return x * np.exp(-t * 1.8) * vel * 0.18


# ====================================================================== 曲
# (小節番号は 1 から。各小節は八分音符 6 つ)
MELODY = {
    2: [(None, 5), (69, 1)],
    3: [(74, 2), (69, 1), (65, 2), (69, 1)],
    4: [(67, 2), (64, 1), (60, 2), (64, 1)],
    5: [(62, 2), (65, 1), (69, 2), (74, 1)],
    6: [(72, 2), (69, 1), (67, 2), (64, 1)],
    7: [(65, 2), (64, 1), (62, 3)],
    8: [(69, 3), (73, 2), (76, 1)],
    9: [(74, 2), (76, 1), (77, 2), (74, 1)],
    10: [(76, 2), (72, 1), (67, 2), (72, 1)],
    11: [(70, 2), (69, 1), (67, 2), (64, 1)],
    12: [(62, 3), (69, 1), (74, 2)],
}
# 和音（根音, 構成音）。前半・後半で変わる小節は 2 つ
CHORDS = {
    1: [("D", [50, 57, 62, 65])], 2: [("D", [50, 57, 62, 65])], 3: [("D", [50, 57, 62, 65])],
    4: [("C", [48, 55, 60, 64])], 5: [("D", [50, 57, 62, 65])],
    6: [("F", [53, 57, 60, 65]), ("C", [48, 55, 60, 64])], 7: [("D", [50, 57, 62, 65])],
    8: [("A", [45, 57, 61, 64])], 9: [("D", [50, 57, 62, 65])], 10: [("C", [48, 55, 60, 64])],
    11: [("Bb", [46, 58, 62, 65]), ("A", [45, 57, 61, 64])], 12: [("D", [50, 57, 62, 65])],
}


def bar_t(b):
    return (b - 1) * BAR


def music(bus):
    # ドローン（序奏）
    n = int(BAR * 2.4 * SR)
    t = np.arange(n) / SR
    drone = (concertina(mtof(50), BAR * 2.4, 0.5) + concertina(mtof(57), BAR * 2.4, 0.4))
    drone *= np.clip(t / 1.2, 0, 1)
    bus.add(0.05, drone, 0.7)
    for b in range(1, 13):
        chords = CHORDS[b]
        intensity = 0.45 if b <= 2 else 0.7 if b <= 7 else 1.0
        for e in range(6):
            ch = chords[0] if (len(chords) == 1 or e < 3) else chords[1]
            root, notes = ch
            t0 = bar_t(b) + e * E8
            if b >= 3:
                if e in (0, 3):
                    bus.add(t0, pluck_bass(mtof(notes[0] - (12 if e == 0 else 5)), E8 * 2.6, 0.9 * intensity), 1.0)
                else:
                    for m in notes[1:]:
                        bus.add(t0, concertina(mtof(m), E8 * 0.85, 0.5 * intensity), 1.0, pan=-0.25)
            if b >= 3:
                if e in (0, 3):
                    bus.add(t0, bodhran(intensity * (1.0 if e == 0 else 0.8), True), 0.8, pan=0.1)
                elif b >= 5 and e in (2, 5):
                    bus.add(t0, bodhran(0.4 * intensity, False), 0.6, pan=0.15)
        # 旋律（手風琴＋フィドル）
        if b in MELODY:
            pos = 0
            for m, ln in MELODY[b]:
                if m is not None:
                    t0 = bar_t(b) + pos * E8
                    d = ln * E8 * 0.95
                    bus.add(t0, concertina(mtof(m), d, 0.9 * intensity), 0.9, pan=0.2)
                    if b >= 5:
                        bus.add(t0, fiddle(mtof(m + 12), d, 0.8 * intensity), 0.9, pan=0.35)
                pos += ln
    # 合唱（8 小節目から: "ア"、最後は "オ"）
    notes = []
    for b in range(8, 13):
        pos = 0
        for m, ln in MELODY[b]:
            if m is not None:
                notes.append((bar_t(b) + pos * E8, ln * E8 * 0.95, m - 12))
            pos += ln
    st, y = choir(notes, bar_t(8) - 0.05, VOWEL_A, voices=8, vel=1.0)
    bus.add(st, y, 1.2, pan=-0.05)
    # ロゴ: ニ長調の和音を伸ばす（声 "オ" ＋ 手風琴）
    t_logo = T.LOGO[0] / T.FPS
    st, y = choir([(t_logo, 3.0, m) for m in (50, 54, 57, 62)], t_logo - 0.02, VOWEL_O, voices=8, vel=0.8)
    bus.add(st, y * np.linspace(1, 0.2, len(y)), 1.0)
    for m in (50, 57, 62, 66, 69):
        x = concertina(mtof(m), 3.2, 0.45)
        bus.add(t_logo, x * np.linspace(1, 0, len(x)) ** 0.7, 0.9)
    bus.add(t_logo, pluck_bass(mtof(38), 3.0, 1.0), 1.0)
    for k, m in enumerate((74, 78, 81, 86)):
        bus.add(t_logo + 0.35 + k * 0.18, chime(m, 1.0), 1.0, pan=-0.4 + k * 0.25)


def sfx(bus):
    # 1. 巻物・羽ペン・封蝋
    a, b = T.SCROLL
    bus.add(fsec(a), paper(fsec(b - a) + 0.3, 1.0), 1.0, pan=-0.5)
    bus.add(fsec(a) + 0.05, paper(fsec(b - a) + 0.3, 0.9), 1.0, pan=0.5)
    a, b = T.INK
    bus.add(fsec(a), quill(fsec(b - a), 1.0), 1.0, pan=-0.2)
    bus.add(fsec(T.SEAL_DROP[0]), whoosh(0.4, 400, 2000, 0.5), 1.0, pan=0.6)
    bus.add(fsec(T.SEAL_DROP[1]), seal_thump(1.0), 1.0, pan=0.6)
    # 2. 光のきらめき
    bus.add(fsec(T.WIRES_GLOW[0]), shimmer(fsec(T.WIRES_RISE[1] - T.WIRES_GLOW[0]) + 0.6, 1.0), 1.0)

    def pan_x(x):
        return float(np.clip((x - 22000) / 26000, -0.8, 0.8))

    # 3. 組み立て
    bus.add(fsec(T.KEEL[0] + 6), mallet(0.7, 1.2), 1.0)
    bus.add(fsec(T.KEEL[0] + 8), mallet(0.65, 0.8), 1.0)
    for x, f in zip(S.FRAME_XS, T.rib_frames()):
        bus.add(fsec(f + 4), mallet(rng.uniform(0.9, 1.15), 0.7), 1.0, pan=pan_x(x))
    for k, f in enumerate(T.strake_frames()):
        bus.add(fsec(f + 3), mallet(rng.uniform(1.0, 1.3), 0.55), 1.0, pan=rng.uniform(-0.6, 0.6))
    for k in range(4):
        bus.add(fsec(T.DECKS[0] + k * 2 + 4), mallet(0.8, 0.9), 1.0, pan=-0.3 + 0.2 * k)
    for g, f in zip(S.guns(), T.gun_frames()):
        if rng.random() < 0.55:
            bus.add(fsec(f + 3), iron_clank(0.6), 1.0, pan=pan_x(g["x"]))
    for name, f in T.mast_frames().items():
        bus.add(fsec(f + 6), mallet(0.55, 1.1), 1.0)
        bus.add(fsec(f), whoosh(0.35, 200, 1200, 0.5), 1.0)
    for k in range(8):
        bus.add(fsec(T.YARDS[0] + k * 1.2 + 4), mallet(1.4, 0.45), 1.0, pan=rng.uniform(-0.6, 0.6))
    bus.add(fsec(T.RIGGING[0]), creak(0.8, 0.9), 1.0, pan=-0.3)
    bus.add(fsec(T.RIGGING[0] + 5), creak(0.6, 0.7), 1.0, pan=0.4)
    bus.add(fsec(T.SAILS[0]), whoosh(0.9, 300, 2500, 1.0), 1.0)
    bus.add(fsec(T.SAILS[0] + 3), sail_flap(0.7, 0.6), 1.0)
    for k in range(4):
        bus.add(fsec(T.DECOR[0] + k * 3), chime(86 + [0, 3, 7, 12][k], 0.7), 1.0, pan=-0.5 + 0.3 * k)
    # 4. 紙が燃えて消え、海が満ちる
    a, b = T.PAPER_DISSOLVE
    bus.add(fsec(a), hp(paper(fsec(b - a) + 0.5, 1.0), 1500) * 1.2, 1.0)
    a, b = T.SEA_RISE
    n = int((fsec(b - a) + 1.0) * SR)
    tt = np.arange(n) / SR
    nz = noise(n)
    u = tt / tt[-1]
    rise = (lp(nz, 300) * (1 - u) + lp(nz, 1500) * u) * np.sin(np.pi * np.clip(u, 0, 1)) ** 1.5
    bus.add(fsec(a), rise * 0.6, 1.0)
    bus.add(fsec(b - 6), lp(noise(int(1.5 * SR)), 2500) * np.exp(-np.arange(int(1.5 * SR)) / SR * 3) * 0.5, 1.0)
    t_w = fsec(a) + 0.5
    bed_l = waves_bed(DUR - t_w, 1.0, 3)
    bed_r = waves_bed(DUR - t_w, 1.0, 4)
    fade = np.clip(np.arange(len(bed_l)) / (SR * 2.0), 0, 1)
    bus.add(t_w, bed_l * fade, 1.0, pan=-0.7)
    bus.add(t_w, bed_r * fade, 1.0, pan=0.7)
    # 5. 角灯・船鐘・帆・かもめ
    bus.add(fsec(T.BELL[0]), bell(1.0), 1.0, pan=-0.3)
    bus.add(fsec(T.BELL[0]) + 0.42, bell(0.9), 1.0, pan=-0.3)
    bus.add(fsec(T.SAILS_FILL[0]), sail_flap(1.4, 1.0), 1.0, pan=0.1)
    bus.add(fsec(T.SAILS_FILL[0] + 8), whoosh(1.6, 150, 1200, 1.2), 1.0)
    for f, p in ((344, 0.7), (352, 0.6), (380, -0.6), (462, 0.5)):
        bus.add(fsec(f), gull(1.0), 1.0, pan=p)
    bus.add(fsec(T.SAIL_GO + 10), creak(1.0, 0.6), 1.0, pan=-0.2)
    # 6. 大砲・題字
    for k, f in enumerate(T.SHOTS):
        bus.add(fsec(f), cannon(1.0), 1.0, pan=-0.35 + 0.3 * k)
    bus.add(fsec(T.TITLE[0]) - 1.0, cym_swell(1.0, 1.0), 1.0)
    bus.add(fsec(T.TITLE[0]), taiko_swell(1.0), 1.0)


def main():
    mus = Bus()
    music(mus)
    m = mus.stereo()
    m = apply_reverb(m, 0.35, 2.0, 2.6)
    fx = Bus()
    sfx(fx)
    f = fx.stereo()
    f = apply_reverb(f, 0.18, 1.2, 4.0)
    # 大砲の瞬間は曲を少し下げる（ダッキング）
    duck = np.ones(N)
    for s in T.SHOTS:
        i = int(fsec(s) * SR)
        k = int(1.2 * SR)
        duck[i:i + k] = np.minimum(duck[i:i + k], 0.45 + 0.55 * np.linspace(0, 1, len(duck[i:i + k])))
    m *= duck[:, None]
    mix = m * 0.85 + f * 1.0
    # 最後のフェードアウト
    k = int(0.6 * SR)
    mix[-k:] *= np.linspace(1, 0, k)[:, None]
    mix[:int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))[:, None]
    peak = np.abs(mix).max()
    mix = np.tanh(mix / peak * 1.25) / np.tanh(1.25) * 0.89
    os.makedirs(os.path.join(HERE, "build"), exist_ok=True)
    path = os.path.join(HERE, "build", "audio.wav")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mix * 32767).astype("<i2").tobytes())
    rms = np.sqrt((mix ** 2).mean())
    print(path, f"{DUR:.2f}s", f"rms {20 * np.log10(rms):.1f} dBFS")


if __name__ == "__main__":
    main()
