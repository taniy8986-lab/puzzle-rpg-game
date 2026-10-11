"""キャラ画像に白いフチと薄い影を焼き込む（CSS の drop-shadow は 1 コマごとに重いので）。

    python3 tools/outline.py

assets/chara/<キャラ>/*.png → assets/chara_o/<キャラ>/*.png（上下左右に少し余白を足す）
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "chara"
DST = ROOT / "assets" / "chara_o"

for f in sorted(SRC.glob("*/*.png")):
    im = Image.open(f).convert("RGBA")
    a = np.asarray(im).astype(np.float32)
    h, w = a.shape[:2]
    r = max(5.0, h * 0.0075)          # フチの太さ
    pad = int(r + 4)
    A = np.pad(a, ((pad, pad), (pad, pad), (0, 0)))
    alpha = A[..., 3] / 255
    dist = ndimage.distance_transform_edt(alpha < 0.5)
    ring = np.clip(r + 1 - dist, 0, 1)
    out = np.zeros_like(A)
    out[..., :3] = 255
    out[..., 3] = ring * 255
    # 元の絵を上に重ねる
    fa = alpha[..., None]
    out[..., :3] = A[..., :3] * fa + out[..., :3] * (1 - fa)
    out[..., 3] = np.maximum(out[..., 3], A[..., 3])
    dst = DST / f.parent.name / f.name
    dst.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(out.astype(np.uint8), "RGBA").save(dst)
    print(dst.relative_to(ROOT), out.shape[1], out.shape[0], flush=True)
