"""動画の音を Python だけで合成する（外部の音素材は使わない）。

    python3 tools/make_audio.py build/ch01_cues.json build/ch01_audio.wav
    python3 tools/make_audio.py --previews build/preview      # BGM・効果音の試聴用 WAV

予定表（render.js がページから受け取って書き出す JSON）:
    duration … 全体の長さ（秒）
    bgm      … [{t0, t1, track, gain, fadeIn, fadeOut}]  曲は t0 で頭から始まり、t1 まで繰り返す
    sfx      … [{t, name, gain, pan}]
    voices   … [{t, file, gain}]                          セリフの声（tools/make_voice.py が作った WAV）
    blips    … [{t, voice}]                               文字を打つ「ピッ」音（ほとんど使わない）
声が鳴っている間は BGM を自動で下げる。曲はすべてこのファイルで作ったオリジナル。
"""
import json
import sys
import wave
from math import ceil

import numpy as np
from scipy import signal
from scipy.io import wavfile
from scipy.ndimage import maximum_filter1d, minimum_filter1d, uniform_filter1d

SR = 48000


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(n):
    return np.arange(n) / SR


def noise(n, seed):
    return np.random.default_rng(seed).standard_normal(n)


def sos(kind, f, order=2):
    return signal.butter(order, f, kind, fs=SR, output="sos")


def lp(x, f, o=2):
    return signal.sosfilt(sos("low", f, o), x)


def hp(x, f, o=2):
    return signal.sosfilt(sos("high", f, o), x)


def bp(x, lo, hi, o=2):
    return signal.sosfilt(sos("band", [lo, hi], o), x)


def gate(n, dur, att=0.01, rel=0.1):
    """音の長さ dur で離す ADSR（サステイン 1）。"""
    e = np.ones(n)
    a = max(1, int(att * SR))
    e[:a] = np.linspace(0, 1, a)
    d = int(dur * SR)
    r = max(1, int(rel * SR))
    if d < n:
        e[d:d + r] *= np.linspace(1, 0, min(r, n - d))
        e[d + r:] = 0
    return e


def saw(freq, n, det=0.0, ph=0.0):
    f = np.broadcast_to(np.asarray(freq, dtype=float), (n,)) * (1 + det)
    p = (ph + np.cumsum(f / SR)) % 1.0
    return 2 * p - 1


def sq(freq, n, duty=0.5, ph=0.0):
    f = np.broadcast_to(np.asarray(freq, dtype=float), (n,))
    p = (ph + np.cumsum(f / SR)) % 1.0
    return np.where(p < duty, 1.0, -1.0)


# ====================================================================== 楽器
def bell(f, dur=1.0, vel=1.0):
    n = int((dur + 1.6) * SR)
    t = tt(n)
    x = np.zeros(n)
    for r, a, d in ((1, 1.0, 2.0), (2.0, .38, 3.6), (3.0, .2, 5.0), (4.16, .14, 7.5), (5.43, .08, 10)):
        x += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d)
    return x * np.minimum(1, t / .002) * vel * .28


def epiano(f, dur=.5, vel=1.0):
    n = int((dur + .7) * SR)
    t = tt(n)
    mod = np.sin(2 * np.pi * f * t) * 1.3 * np.exp(-t * 5)
    x = np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 1.4) + .12 * np.sin(4 * np.pi * f * t) * np.exp(-t * 3)
    return x * gate(n, dur, .003, .3) * vel * .26


def piano(f, dur=.6, vel=1.0):
    n = int((dur + 1.4) * SR)
    t = tt(n)
    x = np.zeros(n)
    for k, a in ((1, 1.0), (2, .45), (3, .22), (4, .12), (5, .06)):
        x += a * np.sin(2 * np.pi * f * k * t * (1 + .0004 * k * k)) * np.exp(-t * (1.1 + k * .55))
    x *= gate(n, dur, .002, .45)
    return x * np.minimum(1, t / .003) * vel * .3


def pluck(f, dur=.3, vel=1.0):
    n = int((dur + .45) * SR)
    t = tt(n)
    x = np.sin(2 * np.pi * f * t) + .35 * np.sin(4 * np.pi * f * t) * np.exp(-t * 14) + .18 * np.sin(2 * np.pi * 3.97 * f * t) * np.exp(-t * 22)
    return x * np.exp(-t * 7.5) * np.minimum(1, t / .002) * vel * .34


def marimba(f, dur=.3, vel=1.0):
    n = int((dur + .5) * SR)
    t = tt(n)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 5.5) + .45 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 22) + .12 * np.sin(2 * np.pi * 9.9 * f * t) * np.exp(-t * 45)
    return x * np.minimum(1, t / .001) * vel * .34


def bass(f, dur=.4, vel=1.0):
    n = int((dur + .15) * SR)
    t = tt(n)
    x = np.sin(2 * np.pi * f * t) + .28 * np.sin(4 * np.pi * f * t) + .08 * np.sin(6 * np.pi * f * t)
    return x * gate(n, dur, .006, .08) * (.65 + .35 * np.exp(-t * 5)) * vel * .48


def tuba(f, dur=.25, vel=1.0):
    n = int((dur + .12) * SR)
    s = saw(f, n) * .6 + sq(f, n) * .4
    x = lp(s, 650) * gate(n, dur, .012, .06)
    return x * vel * .42


def bassoon(f, dur=.3, vel=1.0):
    n = int((dur + .12) * SR)
    t = tt(n)
    vib = f * (1 + .004 * np.sin(2 * np.pi * 5.5 * t))
    x = bp(sq(vib, n, .32), 180, 2200) * gate(n, dur, .02, .07)
    return x * vel * .3


def pad(f, dur=2.0, vel=1.0, bright=1600):
    n = int((dur + 1.0) * SR)
    t = tt(n)
    x = np.zeros(n)
    for i, det in enumerate((-.006, 0, .0055)):
        x += saw(f * (1 + .0015 * np.sin(2 * np.pi * (.3 + i * .11) * t)), n, det, ph=i * .31)
    x = lp(x / 3, bright, 2)
    return x * gate(n, dur, .45, .9) * vel * .2


def strings(f, dur=2.0, vel=1.0):
    n = int((dur + .8) * SR)
    t = tt(n)
    vib = 1 + .0035 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / .6)
    x = (saw(f * vib, n, -.004) + saw(f * vib, n, .004, .5)) / 2
    x = lp(x, 2600, 2)
    return x * gate(n, dur, .25, .6) * vel * .2


def brass(f, dur=.5, vel=1.0):
    n = int((dur + .25) * SR)
    t = tt(n)
    s = (saw(f, n, -.003) + saw(f, n, .003, .4)) / 2
    br = np.minimum(1, t / .05) * (.55 + .45 * np.exp(-t * 4))
    x = lp(s, 700) * (1 - br) + lp(s, 3200) * br
    return x * gate(n, dur, .03, .15) * vel * .3


def choir(f, dur=2.0, vel=1.0, vowel="a"):
    n = int((dur + .9) * SR)
    t = tt(n)
    vib = f * (1 + .005 * np.sin(2 * np.pi * 5 * t))
    src = saw(vib, n) * .7 + saw(vib, n, .007, .3) * .3
    fm = {"a": ((800, 1150, 2900), (1, .5, .25)), "o": ((450, 800, 2830), (1, .45, .2))}[vowel]
    x = np.zeros(n)
    for fc, a in zip(*fm):
        x += a * bp(src, fc * .9, fc * 1.1)
    return x * gate(n, dur, .5, .8) * vel * .5


def organ(f, dur=1.0, vel=1.0):
    n = int((dur + .3) * SR)
    t = tt(n)
    x = np.sin(2 * np.pi * f * t) + .6 * np.sin(4 * np.pi * f * t) + .3 * np.sin(6 * np.pi * f * t) + .2 * np.sin(8 * np.pi * f * t)
    x *= 1 + .08 * np.sin(2 * np.pi * 6 * t)
    return x * gate(n, dur, .04, .2) * vel * .12


# ---------------------------------------------------------------- 打楽器
def kick(vel=1.0):
    n = int(.4 * SR)
    t = tt(n)
    f = 45 + 80 * np.exp(-t * 28)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) + .3 * hp(noise(n, 11), 2000) * np.exp(-t * 120)
    return x * vel * .7


def snare(vel=1.0):
    n = int(.3 * SR)
    t = tt(n)
    x = bp(noise(n, 12), 1200, 7000) * np.exp(-t * 18) * .8 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25) * .6
    return x * vel * .45


def hat(vel=1.0):
    n = int(.08 * SR)
    t = tt(n)
    return hp(noise(n, 13), 7000) * np.exp(-t * 70) * vel * .3


def shaker(vel=1.0):
    n = int(.12 * SR)
    t = tt(n)
    e = np.minimum(1, t / .015) * np.exp(-t * 35)
    return bp(noise(n, 14), 4000, 11000) * e * vel * .22


def timpani(f=65, vel=1.0):
    n = int(1.6 * SR)
    t = tt(n)
    fr = f * (1 + .06 * np.exp(-t * 6))
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 2.2) + .4 * bp(noise(n, 15), 80, 500) * np.exp(-t * 14)
    return x * vel * .6


def cymbal(vel=1.0, dur=1.8):
    n = int(dur * SR)
    t = tt(n)
    return hp(noise(n, 16), 5000) * np.exp(-t * 2.6) * vel * .22


def clap(vel=1.0):
    n = int(.25 * SR)
    t = tt(n)
    e = sum(np.exp(-np.maximum(0, t - d) * 60) * (t >= d) for d in (0, .011, .022)) + np.exp(-t * 12) * .5
    return bp(noise(n, 17), 900, 5000) * e * vel * .25


# ====================================================================== 曲（ループ）
NOTES = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}


def chord(name, octave=4):
    """'Am' 'C' 'G7' 'Fmaj7' 'Dm7' 'Bb' など → MIDI 番号のリスト（根音を含む 3〜4 音）"""
    root = name[:2] if len(name) > 1 and name[1] in "#b" else name[:1]
    q = name[len(root):]
    r = 12 * (octave + 1) + NOTES[root]
    if q.startswith("maj7"):
        iv = (0, 4, 7, 11)
    elif q.startswith("m7"):
        iv = (0, 3, 7, 10)
    elif q.startswith("m"):
        iv = (0, 3, 7)
    elif q.startswith("7"):
        iv = (0, 4, 7, 10)
    elif q.startswith("sus4"):
        iv = (0, 5, 7)
    elif q.startswith("dim"):
        iv = (0, 3, 6)
    else:
        iv = (0, 4, 7)
    return [r + i for i in iv]


class Loop:
    """L 秒のループを作る。はみ出した余韻は頭に巻き戻して、つなぎ目なく繰り返せるようにする。"""

    def __init__(self, bpm, beats_per_bar, bars):
        self.beat = 60.0 / bpm
        self.bar = self.beat * beats_per_bar
        self.L = int(round(self.bar * bars * SR))
        self.buf = np.zeros((self.L + SR * 4, 2))

    def add(self, t, x, gain=1.0, pan=0.0):
        i = int(round(t * SR))
        n = min(len(x), len(self.buf) - i)
        gl = np.cos((pan + 1) * np.pi / 4) * gain
        gr = np.sin((pan + 1) * np.pi / 4) * gain
        self.buf[i:i + n, 0] += x[:n] * gl
        self.buf[i:i + n, 1] += x[:n] * gr

    def render(self, reverb=.18, rms_db=-20.0):
        L = self.L
        out = self.buf[:L].copy()
        tail = self.buf[L:]
        k = 0
        while k < len(tail):
            m = min(L, len(tail) - k)
            out[:m] += tail[k:k + m]
            k += m
        if reverb:
            ir = reverb_ir(2.0, 2.6)
            two = np.concatenate([out, out])
            for c in range(2):
                wet = signal.fftconvolve(two[:, c], ir[c])[L:2 * L]
                out[:, c] += reverb * wet
        rms = np.sqrt(np.mean(out ** 2)) + 1e-9
        return out * (10 ** (rms_db / 20) / rms)


_IR = {}


def reverb_ir(sec, decay):
    key = (sec, decay)
    if key not in _IR:
        n = int(sec * SR)
        t = tt(n)
        ir = np.stack([lp(noise(n, 21 + c), 5500) * np.exp(-decay * t) for c in range(2)])
        ir[:, :int(.015 * SR)] = 0
        _IR[key] = ir / np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
    return _IR[key]


def tr_dark():
    lo = Loop(60, 4, 4)
    for b in range(4):
        t0 = b * lo.bar
        for m, g in ((38, .55), (45, .35), (50, .2)):
            lo.add(t0, pad(mtof(m), lo.bar - .1, .9, 700), g, (m - 45) * .03)
        lo.add(t0, kick(.55), .9)
        lo.add(t0 + .28, kick(.35), .9)
    for t, m in ((1.5, 74), (5.0, 77), (7.25, 69), (10.5, 73), (13.0, 74), (14.5, 70)):
        lo.add(t, bell(mtof(m), .8, .55), .8, .3 if m % 2 else -.3)
    sw = noise(int(3 * SR), 30)
    e = np.linspace(0, 1, len(sw)) ** 3
    lo.add(12.6, bp(sw, 300, 3000) * e * .08, 1.0)
    return lo.render(.32, -24)


def tr_title():
    lo = Loop(120, 4, 4)
    prog = ["C", "G", "Am", "F"]
    mel = [(0, 72, .5), (.5, 76, .5), (1, 79, 1), (2, 84, .75), (3, 83, .25), (3.5, 79, .5),
           (4, 79, .5), (4.5, 81, .5), (5, 83, 1), (6, 86, 1.5), (7.5, 84, .5),
           (8, 81, .5), (8.5, 79, .5), (9, 76, 1), (10, 79, 1), (11, 81, 1),
           (12, 77, .5), (12.5, 79, .5), (13, 81, 1), (14, 79, 2)]
    for b, c in enumerate(prog):
        t0 = b * lo.bar
        notes = chord(c, 4)
        for m in notes:
            lo.add(t0, strings(mtof(m), lo.bar - .05, .8), .55)
        for beat in (0, 1.5, 2.5, 3):
            for m in notes:
                lo.add(t0 + beat * lo.beat, brass(mtof(m), .22, .8), .4)
        lo.add(t0, bass(mtof(notes[0] - 24), lo.beat * 1.5), .9)
        lo.add(t0 + 2 * lo.beat, bass(mtof(notes[0] - 24), lo.beat * 1.5), .8)
        lo.add(t0, timpani(mtof(notes[0] - 24), .9), .7)
        for i in range(8):
            lo.add(t0 + i * lo.beat / 2, hat(.6 if i % 2 else .9), .7, .3)
        lo.add(t0 + lo.beat, snare(.8), .6)
        lo.add(t0 + 3 * lo.beat, snare(.8), .6)
        lo.add(t0, kick(.9), .8)
        lo.add(t0 + 2.5 * lo.beat, kick(.7), .8)
    for beat, m, d in mel:
        lo.add(beat * lo.beat, brass(mtof(m), d * lo.beat * .95, 1.0), .75, .1)
    lo.add(0, cymbal(1.0), .8)
    return lo.render(.2, -20)


def tr_memory():
    lo = Loop(72, 3, 8)
    prog = ["F", "C", "Dm", "Bb", "F", "Gm7", "C", "F"]
    mel = [77, 76, 74, 72, 74, 76, 77, 79, 81, 79, 77, 76, 74, 72, 70, 72, 74, 72, 70, 69, 70, 72, 76, 77]
    for b, c in enumerate(prog):
        t0 = b * lo.bar
        notes = chord(c, 4)
        for m in notes:
            lo.add(t0, pad(mtof(m), lo.bar, .7, 1300), .5)
        lo.add(t0, bass(mtof(notes[0] - 12), lo.bar * .9, .7), .6)
        for i in range(3):
            lo.add(t0 + i * lo.beat, bell(mtof(mel[b * 3 + i]), .5, .75 if i == 0 else .55), .7, .15)
        lo.add(t0 + 1.5 * lo.beat, bell(mtof(notes[1] + 12), .3, .25), .5, -.3)
    return lo.render(.3, -21)


def tr_lesson():
    lo = Loop(100, 4, 8)
    prog = ["G", "Em", "C", "D", "G", "Em", "Am", "D"]
    for b, c in enumerate(prog):
        t0 = b * lo.bar
        notes = chord(c, 4)
        arp = [notes[0], notes[1], notes[2], notes[1] + 12 if len(notes) > 2 else notes[0] + 12]
        for i in range(8):
            m = arp[i % 4] + (12 if i in (3, 7) else 0)
            lo.add(t0 + i * lo.beat / 2, marimba(mtof(m), .2, .8 if i % 2 == 0 else .55), .55, .25 if i % 2 else -.25)
        for i in range(4):
            lo.add(t0 + i * lo.beat, pluck(mtof(notes[0] - 24 + (7 if i % 2 else 0)), .3, .9), .8)
        for i in range(16):
            lo.add(t0 + i * lo.beat / 4, shaker(.9 if i % 4 == 2 else .5), .6, .4)
        if b % 2 == 1:
            lo.add(t0 + 3.5 * lo.beat, bell(mtof(notes[2] + 12), .3, .35), .5, .5)
    return lo.render(.15, -21)


def tr_daily():
    lo = Loop(112, 4, 8)
    prog = ["Cmaj7", "Am7", "Dm7", "G7", "Cmaj7", "Am7", "Fmaj7", "G7"]
    mel = [(0, 76), (.5, 79), (1.5, 81), (2.5, 79), (4, 77), (5, 76), (6, 74), (8, 72), (8.5, 74), (9.5, 76), (10.5, 79), (12, 81), (13, 79), (14, 74)]
    for b, c in enumerate(prog):
        t0 = b * lo.bar
        notes = chord(c, 4)
        for beat in (0.5, 1.5, 2.5, 3.5):
            for m in notes:
                lo.add(t0 + beat * lo.beat, epiano(mtof(m), lo.beat * .4, .7), .45)
        for beat, off in ((0, 0), (1.5, 7), (2, 0), (3, 12)):
            lo.add(t0 + beat * lo.beat, bass(mtof(notes[0] - 24 + off), lo.beat * .45, .9), .75)
        lo.add(t0, kick(.8), .7)
        lo.add(t0 + 2 * lo.beat, kick(.7), .7)
        lo.add(t0 + lo.beat, clap(.8), .6)
        lo.add(t0 + 3 * lo.beat, clap(.8), .6)
        for i in range(8):
            lo.add(t0 + i * lo.beat / 2, hat(.5 if i % 2 else .8), .55, .3)
    for half in (0, 16):
        for beat, m in mel:
            lo.add((half + beat) * lo.beat, bell(mtof(m + 12), .35, .5), .45, -.2)
    return lo.render(.14, -21)


def tr_villain():
    lo = Loop(104, 4, 4)
    prog = ["Am", "Am", "Dm", "E"]
    mel = [(0, 69), (.5, 72), (1, 71), (1.5, 68), (2, 69), (3, 64),
           (4, 69), (4.5, 72), (5, 74), (5.5, 72), (6, 71), (7, 68),
           (8, 74), (8.5, 77), (9, 76), (9.5, 74), (10, 72), (11, 69),
           (12, 71), (12.5, 68), (13, 64), (13.5, 68), (14, 71), (15, 76)]
    for b, c in enumerate(prog):
        t0 = b * lo.bar
        notes = chord(c, 3)
        for beat in range(4):
            m = notes[0] - 12 + (7 if beat % 2 else 0)
            lo.add(t0 + beat * lo.beat, tuba(mtof(m), lo.beat * .35, 1.0), .9)
        for beat in (.5, 1.5, 2.5, 3.5):
            for m in notes:
                lo.add(t0 + beat * lo.beat, pluck(mtof(m + 12), .1, .6), .3, .2)
        lo.add(t0 + lo.beat, snare(.7), .5)
        lo.add(t0 + 3 * lo.beat, snare(.7), .5)
        lo.add(t0 + 3.75 * lo.beat, snare(.4), .4)
    for beat, m in mel:
        lo.add(beat * lo.beat, bassoon(mtof(m - 12), lo.beat * .4, 1.0), .8, -.15)
    return lo.render(.14, -21)


def tr_boss():
    lo = Loop(80, 4, 4)
    prog = ["Cm", "Ab", "Fm", "G"]
    for b, c in enumerate(prog):
        t0 = b * lo.bar
        notes = chord(c, 3)
        for m in notes:
            lo.add(t0, brass(mtof(m), lo.bar * .92, .8), .55)
            lo.add(t0, choir(mtof(m + 12), lo.bar, .7, "o"), .35)
            lo.add(t0, organ(mtof(m), lo.bar * .95, .8), .3)
        lo.add(t0, timpani(mtof(notes[0] - 12), 1.0), .9)
        lo.add(t0 + 2 * lo.beat, timpani(mtof(notes[0] - 12), .7), .8)
        lo.add(t0 + 3.5 * lo.beat, timpani(mtof(notes[0] - 12), .5), .7)
        lo.add(t0, bass(mtof(notes[0] - 12), lo.bar * .9, .9), .8)
    lo.add(0, cymbal(.7, 2.5), .6)
    return lo.render(.28, -21)


def tr_tension():
    lo = Loop(90, 4, 4)
    prog = ["Em", "Em", "C", "B"]
    for b, c in enumerate(prog):
        t0 = b * lo.bar
        notes = chord(c, 3)
        pat = [0, 0, 7, 0, 12, 0, 7, 3]
        for i in range(16):
            m = notes[0] + pat[i % 8] - (12 if i % 8 == 0 else 0)
            lo.add(t0 + i * lo.beat / 4, pluck(mtof(m), .1, .7 if i % 4 == 0 else .45), .45, .2 if i % 2 else -.2)
        for m in chord(c, 4):
            lo.add(t0, pad(mtof(m), lo.bar, .6, 1200), .35)
        lo.add(t0, kick(.7), .8)
        lo.add(t0 + .25, kick(.45), .8)
        lo.add(t0 + 2 * lo.beat, kick(.7), .8)
        lo.add(t0 + 2 * lo.beat + .25, kick(.45), .8)
    return lo.render(.18, -22)


def tr_resolve():
    lo = Loop(92, 4, 8)
    prog = ["D", "A", "Bm", "G", "D", "G", "A", "D"]
    for b, c in enumerate(prog):
        t0 = b * lo.bar
        notes = chord(c, 4)
        arp = notes + [notes[0] + 12, notes[1] + 12, notes[0] + 12, notes[2]]
        for i in range(8):
            lo.add(t0 + i * lo.beat / 2, piano(mtof(arp[i % len(arp)]), lo.beat * .45, .7), .6, .2 if i % 2 else -.2)
        for m in notes:
            lo.add(t0, strings(mtof(m - 12), lo.bar, .8), .45)
        lo.add(t0, bass(mtof(notes[0] - 24), lo.bar * .8, .8), .7)
        if b >= 4:
            lo.add(t0, kick(.7), .6)
            lo.add(t0 + 2 * lo.beat, kick(.6), .6)
            lo.add(t0 + lo.beat, snare(.5), .4)
            lo.add(t0 + 3 * lo.beat, snare(.5), .4)
    return lo.render(.2, -21)


def tr_sad():
    lo = Loop(66, 4, 4)
    prog = ["Am", "F", "C", "E"]
    mel = [(0, 76), (1, 72), (2, 74), (3, 76), (4, 77), (5, 76), (6, 74), (7, 72), (8, 72), (9, 71), (10, 72), (11, 76), (12, 75), (13.5, 71), (14, 68), (15, 71)]
    for b, c in enumerate(prog):
        t0 = b * lo.bar
        notes = chord(c, 3)
        for m in chord(c, 4):
            lo.add(t0, pad(mtof(m), lo.bar, .5, 1000), .35)
        for i, m in enumerate([notes[0], notes[1] + 12, notes[2] + 12, notes[1] + 12]):
            lo.add(t0 + i * lo.beat, piano(mtof(m), lo.beat * .9, .55), .5, -.15)
        lo.add(t0, bass(mtof(notes[0] - 12), lo.bar * .9, .6), .6)
    for beat, m in mel:
        lo.add(beat * lo.beat, piano(mtof(m), lo.beat * .9, .75), .6, .15)
    return lo.render(.3, -22)


TRACKS = {"dark": tr_dark, "title": tr_title, "memory": tr_memory, "lesson": tr_lesson, "daily": tr_daily,
          "villain": tr_villain, "boss": tr_boss, "tension": tr_tension, "resolve": tr_resolve, "sad": tr_sad}
_LOOPS = {}


def loop_of(name):
    if name not in _LOOPS:
        _LOOPS[name] = TRACKS[name]()
    return _LOOPS[name]


# ====================================================================== 効果音
def env_ar(n, a, d):
    t = tt(n)
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) * d)


def sweep_sine(f0, f1, dur, curve=2.0):
    n = int(dur * SR)
    k = np.linspace(0, 1, n) ** curve
    f = f0 + (f1 - f0) * k
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def fx_whoosh(dur=.38, lo_=500, hi_=4500, seed=40):
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    x = noise(n, seed)
    a = bp(x, lo_, lo_ * 3) * (1 - t) + bp(x, hi_ / 3, hi_) * t
    return a * np.sin(np.pi * t) ** 2 * .9


def sfx_bank():
    S = {}
    S["whoosh"] = fx_whoosh()
    S["whoosh_big"] = fx_whoosh(.85, 160, 2200, 41) * 1.1
    n = int(.12 * SR)
    S["pop"] = sweep_sine(950, 320, .12, .5) * env_ar(n, .003, 30) * .8
    S["click"] = hp(noise(int(.012 * SR), 42), 2500) * env_ar(int(.012 * SR), .0005, 400) * .6
    S["ding"] = bell(mtof(91), .4, 1.0)[: int(1.4 * SR)] * 2.2
    ch = np.zeros(int(1.6 * SR))
    for i, m in enumerate((84, 88, 91, 96)):
        b = bell(mtof(m), .3, .8)[: len(ch) - int(i * .075 * SR)]
        ch[int(i * .075 * SR):int(i * .075 * SR) + len(b)] += b
    S["chime"] = ch * 2
    sp = np.zeros(int(1.2 * SR))
    rng = np.random.default_rng(43)
    for i in range(14):
        st = int(rng.uniform(0, .8) * SR)
        b = bell(mtof(rng.integers(88, 101)), .1, .5)[: len(sp) - st]
        sp[st:st + len(b)] += b * (1 - st / len(sp))
    S["sparkle"] = sp * 1.6
    n = int(.4 * SR)
    S["stamp"] = (sweep_sine(150, 55, .4, .4) * env_ar(n, .002, 14) + lp(noise(n, 44), 2500) * env_ar(n, .001, 45) * .7) * .95
    n = int(1.0 * SR)
    S["impact"] = np.tanh(2.2 * (sweep_sine(110, 38, 1.0, .5) * env_ar(n, .002, 4.5) + bp(noise(n, 45), 200, 4000) * env_ar(n, .001, 22) * .9)) * .8
    n = int(1.6 * SR)
    S["boom"] = (lp(noise(n, 46), 220, 4) * 3 * env_ar(n, .01, 2.6) + np.sin(2 * np.pi * 42 * tt(n)) * env_ar(n, .005, 3.5)) * .75
    n = int(.6 * SR)
    g = np.zeros(n)
    rng = np.random.default_rng(47)
    pos = 0
    while pos < n:
        ln = int(rng.uniform(.02, .07) * SR)
        f = rng.choice([180, 360, 720, 1440, 95])
        seg = sq(f, min(ln, n - pos), .3)
        seg = np.round(seg * 3) / 3
        g[pos:pos + len(seg)] = seg * (rng.uniform(.3, 1) if rng.uniform() > .25 else 0)
        pos += ln
    S["glitch"] = lp(g + hp(noise(n, 48), 3000) * .25, 9000) * .45
    al = np.concatenate([sq(f, int(.24 * SR), .5) * env_ar(int(.24 * SR), .005, 3) for f in (880, 660, 880, 660, 880, 660)])
    S["alarm"] = lp(al, 3500) * .3
    n = int(.5 * SR)
    S["buzz"] = lp(sq(120, n) * .6 + sq(181, n) * .4, 1800) * gate(n, .45, .005, .04) * .35
    n = int(1.5 * SR)
    S["swell"] = hp(noise(n, 49), 1500) * np.linspace(0, 1, n) ** 3 * .55
    S["drop"] = sweep_sine(1100, 140, 1.0, .6) * env_ar(int(1.0 * SR), .005, 2.5) * .45
    S["rise"] = sweep_sine(220, 1300, 1.0, 1.6) * np.linspace(.2, 1, int(1.0 * SR)) * np.exp(-np.linspace(0, 1, int(SR)) * .4) * .35
    n = int(2.6 * SR)
    S["thunder"] = (hp(noise(n, 50), 2000) * env_ar(n, .001, 30) * .8 + lp(noise(n, 51), 300, 4) * 3 * env_ar(n, .05, 1.4)) * .7
    n = int(.9 * SR)
    hb = np.zeros(n)
    for st, a in ((0, 1), (.27, .7)):
        i = int(st * SR)
        m = int(.18 * SR)
        hb[i:i + m] += np.sin(2 * np.pi * 52 * tt(m)) * env_ar(m, .004, 22) * a
    S["heartbeat"] = hb * .9
    n = int(.32 * SR)
    S["page"] = bp(noise(n, 52), 1800, 7000) * (np.sin(np.pi * np.linspace(0, 1, n)) * (.6 + .4 * np.sin(2 * np.pi * 34 * tt(n)))) * .55
    n = int(.03 * SR)
    S["type"] = (bp(noise(n, 53), 1500, 6000) * env_ar(n, .0005, 160) + np.sin(2 * np.pi * 420 * tt(n)) * env_ar(n, .001, 120) * .4) * .5
    n = int(.34 * SR)
    S["slide"] = bp(noise(n, 54), 900, 4500) * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5 * .45
    sh = np.zeros(int(1.3 * SR))
    rng = np.random.default_rng(55)
    for i in range(26):
        st = int(rng.uniform(0, .7) ** 1.6 * SR)
        m = int(rng.uniform(.05, .35) * SR)
        f = rng.uniform(2500, 9000)
        seg = bp(noise(m, 56 + i), f * .9, min(f * 1.1, 23000)) * env_ar(m, .001, rng.uniform(15, 40))
        sh[st:st + m] += seg[: len(sh) - st] * rng.uniform(.4, 1)
    S["shatter"] = (sh + lp(noise(len(sh), 90), 600) * env_ar(len(sh), .001, 12) * .6) * .7
    cs = np.zeros(int(1.2 * SR))
    for st, m in ((0, 96), (.08, 100)):
        b = bell(mtof(m), .3, .8)[: len(cs) - int(st * SR)]
        cs[int(st * SR):int(st * SR) + len(b)] += b
    S["cash"] = cs * 2
    n = int(.18 * SR)
    S["footstep"] = (lp(noise(n, 57), 500) * env_ar(n, .002, 30) * 1.4 + np.sin(2 * np.pi * 70 * tt(n)) * env_ar(n, .002, 35) * .5) * .6
    n = int(.6 * SR)
    t = tt(n)
    puls = np.clip(np.sin(2 * np.pi * 9 * t), 0, 1) ** 2 * np.exp(-t * 3)
    S["snort"] = (bp(noise(n, 58), 250, 1100) * puls * 1.5 + lp(saw(110 + 25 * np.sin(2 * np.pi * 9 * t), n), 600) * puls * .5) * .55
    n = int(2.6 * SR)
    S["wind"] = bp(noise(n, 59), 280, 1300) * np.sin(np.pi * np.linspace(0, 1, n)) ** 2 * (.7 + .3 * np.sin(2 * np.pi * .9 * tt(n))) * .5
    n = int(.02 * SR)
    S["tick"] = bp(noise(n, 60), 2500, 6000) * env_ar(n, .0005, 260) * .6
    fa = np.zeros(int(1.8 * SR))
    for st, ms, d in ((0, (72, 76, 79), .12), (.13, (72, 76, 79), .12), (.26, (72, 76, 79), .12), (.4, (77, 81, 84), .9)):
        for m in ms:
            b = brass(mtof(m), d, 1.0)
            i = int(st * SR)
            fa[i:i + len(b)] += b[: len(fa) - i]
    S["fanfare"] = fa * 1.3
    du = np.zeros(int(1.6 * SR))
    for st in (0, .42):
        i = int(st * SR)
        x = timpani(55, 1.0)[: len(du) - i]
        du[i:i + len(x)] += x
        b = brass(mtof(45), .32, 1.0)
        du[i:i + len(b)] += b[: len(du) - i] * 1.2
    S["dun"] = du * .9
    n = int(.6 * SR)
    t = tt(n)
    S["wobble"] = np.sin(2 * np.pi * np.cumsum(300 + 60 * np.sin(2 * np.pi * 13 * t) * np.exp(-t * 3)) / SR) * env_ar(n, .005, 5) * .45
    no = np.zeros(int(.9 * SR))
    for st, m in ((0, 88), (.11, 95)):
        b = marimba(mtof(m), .2, 1.0)
        i = int(st * SR)
        no[i:i + len(b)] += b[: len(no) - i]
    S["notify"] = no * 1.6
    n = int(.62 * SR)
    t = tt(n)
    S["vibrate"] = lp(sq(160, n), 900) * ((t % .31) < .22) * .25
    n = int(.55 * SR)
    t = tt(n)
    S["pen"] = bp(noise(n, 61), 1200, 4200) * (.5 + .5 * np.abs(np.sin(2 * np.pi * 7 * t))) * np.sin(np.pi * np.linspace(0, 1, n)) * .5
    n = int(.14 * SR)
    S["tape"] = (lp(noise(n, 62), 3000) * env_ar(n, .001, 40) + np.sin(2 * np.pi * 120 * tt(n)) * env_ar(n, .002, 40) * .4) * .7
    sh2 = np.zeros(int(1.0 * SR))
    for i, m in enumerate((84, 88, 91, 96, 100)):
        b = bell(mtof(m), .1, .6)
        st = int(i * .045 * SR)
        sh2[st:st + len(b)] += b[: len(sh2) - st]
    S["shine"] = sh2 * 1.8
    # 正規化（ピーク -6 dBFS）
    for k in S:
        p = np.abs(S[k]).max() + 1e-9
        S[k] = S[k] / p * .5
    return S


BLIP_VOICES = {"bull": 860, "mentor": 215, "baron": 140, "eve": 1020, "hat": 300, "pig": 200, "narrator": 500, "crowd": 600}


def blip(voice, t):
    f0 = BLIP_VOICES.get(voice, 600) * (1 + .06 * (np.sin(t * 9113.7) % 1 - .5))
    n = int(.045 * SR)
    x = (np.sin(2 * np.pi * f0 * tt(n)) * .7 + np.sin(4 * np.pi * f0 * tt(n)) * .2) * env_ar(n, .004, 60)
    return x * .05


# ====================================================================== 合成
def read_voice(path):
    sr, y = wavfile.read(path)
    ints = y.dtype.kind == "i"
    y = y.astype(np.float64)
    if ints:
        y = y / 32768.0
    if y.ndim > 1:
        y = y.mean(axis=1)
    if sr != SR:
        y = signal.resample_poly(y, SR, sr)
    return y


def place(bus, t, x, gain=1.0, pan=0.0):
    i = int(round(t * SR))
    if i < 0:
        x = x[-i:]
        i = 0
    n = min(len(x), len(bus) - i)
    if n <= 0:
        return
    gl = np.cos((pan + 1) * np.pi / 4) * gain
    gr = np.sin((pan + 1) * np.pi / 4) * gain
    bus[i:i + n, 0] += x[:n] * gl
    bus[i:i + n, 1] += x[:n] * gr


def mix(cues):
    N = int(round(cues["duration"] * SR))
    music = np.zeros((N, 2))
    fx = np.zeros((N, 2))
    vox = np.zeros((N, 2))
    activity = np.zeros(N)

    for b in cues.get("bgm", []):
        name = b["track"]
        if name not in TRACKS:
            print(f"警告: 曲 {name} はありません", file=sys.stderr)
            continue
        lo = loop_of(name)
        i0 = int(round(b["t0"] * SR))
        i1 = min(N, int(round(b["t1"] * SR)))
        n = i1 - i0
        if n <= 0:
            continue
        seg = np.tile(lo, (ceil(n / len(lo)), 1))[:n].copy()
        fi = max(1, int(b.get("fadeIn", .3) * SR))
        fo = max(1, int(b.get("fadeOut", 1.0) * SR))
        e = np.ones(n)
        e[:min(fi, n)] = np.linspace(0, 1, min(fi, n)) ** 1.5
        e[max(0, n - fo):] *= np.linspace(1, 0, min(fo, n)) ** 1.5
        music[i0:i1] += seg * (e * b.get("gain", 1.0))[:, None]

    bank = sfx_bank()
    for s in cues.get("sfx", []):
        if s["name"] not in bank:
            print(f"警告: 効果音 {s['name']} はありません", file=sys.stderr)
            continue
        place(fx, s["t"], bank[s["name"]], s.get("gain", 1.0) * .55, s.get("pan", 0.0))

    for v in cues.get("voices", []):
        try:
            y = read_voice(v["file"])
        except (OSError, ValueError) as e:
            print(f"警告: 声 {v.get('file')} を読めません: {e}", file=sys.stderr)
            continue
        y = signal.sosfilt(sos("high", 90), y)
        place(vox, v["t"], y, v.get("gain", 1.0) * 1.15, v.get("pan", 0.0))
        i = int(round(v["t"] * SR))
        activity[max(0, i):min(N, i + len(y))] = 1

    for b in cues.get("blips", []):
        place(vox, b["t"], blip(b.get("voice", "crowd"), b["t"]), b.get("gain", 1.0))
        i = int(round(b["t"] * SR))
        activity[max(0, i - int(.2 * SR)):min(N, i + int(.25 * SR))] = 1

    # 声が鳴っている間は BGM を下げる（-6 dB、かかり 0.12 秒・戻り 0.45 秒）
    att = 1 - np.exp(-1 / (.12 * SR))
    rel = 1 - np.exp(-1 / (.45 * SR))
    tgt = activity
    up = signal.lfilter([rel], [1, -(1 - rel)], tgt)
    env = np.maximum(up, signal.lfilter([att], [1, -(1 - att)], tgt))
    env = np.clip(uniform_filter1d(env, int(.05 * SR)), 0, 1)
    duck = 10 ** (-6 * env / 20)

    # 効果音には少しだけ残響
    ir = reverb_ir(1.2, 4.0)
    for c in range(2):
        fx[:, c] += .12 * signal.fftconvolve(fx[:, c], ir[c])[:N]
        vox[:, c] += .05 * signal.fftconvolve(vox[:, c], ir[c])[:N]

    out = music * .55 * duck[:, None] + fx + vox
    # 全体を少し持ち上げてからリミッター（参考動画と同じくらいの音量にそろえる）
    return limit(out * 10 ** (3.5 / 20))


def limit(x, thr=10 ** (-1.2 / 20)):
    """先読みリミッター（ピーク -1.2 dBFS）。"""
    peak = np.abs(x).max(axis=1)
    w = int(.004 * SR)
    pk = maximum_filter1d(peak, size=2 * w + 1)
    g = np.minimum(1.0, thr / np.maximum(pk, 1e-9))
    g = minimum_filter1d(g, size=2 * w + 1)
    g = uniform_filter1d(g, size=w)
    # 戻りをなめらかに（0.15 秒）
    rel = 1 - np.exp(-1 / (.15 * SR))
    g2 = 1 - signal.lfilter([rel], [1, -(1 - rel)], 1 - g)
    g = np.minimum(g, np.maximum(g2, g))
    y = x * g[:, None]
    return np.clip(y, -thr, thr)


def write(path, st):
    y = (np.clip(st, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(y.tobytes())


def previews(out_dir):
    from pathlib import Path
    d = Path(out_dir)
    d.mkdir(parents=True, exist_ok=True)
    for name in TRACKS:
        lo = loop_of(name)
        reps = ceil(20 * SR / len(lo))
        write(d / f"bgm_{name}.wav", limit(np.tile(lo, (reps, 1))[: 20 * SR] * .9))
    bank = sfx_bank()
    parts = []
    for k, x in bank.items():
        parts.append(np.stack([x, x], axis=1))
        parts.append(np.zeros((int(.4 * SR), 2)))
    write(d / "sfx_all.wav", limit(np.concatenate(parts)))
    print("試聴用:", d, "曲", list(TRACKS), "効果音", list(bank))


if __name__ == "__main__":
    if sys.argv[1] == "--previews":
        previews(sys.argv[2])
    else:
        cues = json.load(open(sys.argv[1]))
        st = mix(cues)
        write(sys.argv[2], st)
        print(f"音: {sys.argv[2]}（{len(st) / SR:.2f} 秒）")
