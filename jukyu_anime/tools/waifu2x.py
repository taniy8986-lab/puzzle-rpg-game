"""waifu2x（upconv_7 / art）を numpy だけで動かして、アニメ絵を 2 倍に拡大する。

    python3 tools/waifu2x.py 入力.png 出力.png [--noise 0|1|2]

モデルは nagadomi/waifu2x（MIT License）の JSON 版を raw.githubusercontent.com から取ってきて
build/models/ に置く（初回のみ）。
"""
import json
import sys
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent.parent
MODEL_DIR = HERE / "build" / "models"
URL = "https://raw.githubusercontent.com/nagadomi/waifu2x/master/models/upconv_7/art/{}"
PAD = 7       # 3x3 の畳み込み 6 段で 12 px 縮むぶん＋逆畳み込みで 2 px
TILE = 256


def load_model(noise):
    name = "scale2.0x_model.json" if noise == 0 else f"noise{noise}_scale2.0x_model.json"
    path = MODEL_DIR / name
    if not path.exists():
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(URL.format(name), path)
    layers = []
    for L in json.loads(path.read_text()):
        w = np.asarray(L["weight"], dtype=np.float32)
        b = np.asarray(L["bias"], dtype=np.float32)
        layers.append((L["class_name"], w, b))
    return layers


def conv3x3(x, w, b):
    """x: (C, H, W) → (O, H-2, W-2)。9 回の行列積で畳み込む。"""
    c, h, wd = x.shape
    o = w.shape[0]
    out = np.zeros((o, (h - 2) * (wd - 2)), dtype=np.float32)
    for ky in range(3):
        for kx in range(3):
            patch = x[:, ky:ky + h - 2, kx:kx + wd - 2].reshape(c, -1)
            out += w[:, :, ky, kx] @ patch
    out += b[:, None]
    out = np.where(out > 0, out, out * 0.1)  # LeakyReLU(0.1)
    return out.reshape(o, h - 2, wd - 2)


def deconv4x4s2(x, w, b):
    """SpatialFullConvolution(k=4, stride=2, pad=3)。w: (In, Out, 4, 4)。出力は 2H-4。"""
    c, h, wd = x.shape
    o = w.shape[1]
    full = np.zeros((o, 2 * h + 2, 2 * wd + 2), dtype=np.float32)
    flat = x.reshape(c, -1)
    for ky in range(4):
        for kx in range(4):
            contrib = (w[:, :, ky, kx].T @ flat).reshape(o, h, wd)
            full[:, ky:ky + 2 * h:2, kx:kx + 2 * wd:2] += contrib
    out = full[:, 3:3 + 2 * h - 4, 3:3 + 2 * wd - 4]
    return out + b[:, None, None]


def run_tile(layers, x):
    for kind, w, b in layers:
        x = conv3x3(x, w, b) if kind == "nn.SpatialConvolutionMM" else deconv4x4s2(x, w, b)
    return x


def upscale(img, noise=1):
    layers = load_model(noise)
    rgb = np.asarray(img.convert("RGB"), dtype=np.float32).transpose(2, 0, 1) / 255.0
    _, h, w = rgb.shape
    src = np.pad(rgb, ((0, 0), (PAD, PAD), (PAD, PAD)), mode="edge")
    out = np.zeros((3, h * 2, w * 2), dtype=np.float32)
    for y in range(0, h, TILE):
        for x in range(0, w, TILE):
            th, tw = min(TILE, h - y), min(TILE, w - x)
            tile = src[:, y:y + th + 2 * PAD, x:x + tw + 2 * PAD]
            out[:, 2 * y:2 * (y + th), 2 * x:2 * (x + tw)] = run_tile(layers, tile)
    out = (np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8).transpose(1, 2, 0)
    return Image.fromarray(out)


if __name__ == "__main__":
    noise = int(sys.argv[sys.argv.index("--noise") + 1]) if "--noise" in sys.argv else 1
    upscale(Image.open(sys.argv[1]), noise).save(sys.argv[2])
