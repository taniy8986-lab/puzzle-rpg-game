"""アップ用に表情パネルをもう一段（waifu2x で 2 倍）大きくする。

    python3 tools/upscale_faces.py bull mina

assets/chara/<キャラ>/face_*.png（と bull の tea / wave）を置き換える。
色は waifu2x、透明度は Lanczos で拡大して縁を少し締める。何度も実行しないよう、
高さが 1000 px 以上のものは飛ばす。
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from waifu2x import upscale  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

for who in sys.argv[1:]:
    files = sorted((ROOT / "assets" / "chara" / who).glob("face_*.png"))
    if who == "bull":
        files += [ROOT / "assets" / "chara" / "bull" / n for n in ("tea.png", "wave.png")]
    for f in files:
        im = Image.open(f).convert("RGBA")
        if im.height >= 1000:
            continue
        rgb = upscale(im.convert("RGB"), noise=0)
        a = im.getchannel("A").resize(rgb.size, Image.LANCZOS)
        a = np.asarray(a).astype(np.float32) / 255
        a = np.clip((a - 0.5) * 1.25 + 0.5, 0, 1)
        out = rgb.convert("RGBA")
        out.putalpha(Image.fromarray((a * 255).astype(np.uint8)))
        out.save(f)
        print(f.relative_to(ROOT), out.size, flush=True)
