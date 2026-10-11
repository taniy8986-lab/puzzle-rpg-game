"""Noto CJK (.ttc) から日本語フェースを .otf として取り出す（DXF プレビュー・Blender 用）。"""
import os
import sys
from fontTools.ttLib import TTCollection

SRC = "/usr/share/fonts/opentype/noto"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "build", "fonts")
FACES = {
    "NotoSansCJK-Regular.ttc": "NotoSansCJKjp-Regular.otf",
    "NotoSansCJK-Bold.ttc": "NotoSansCJKjp-Bold.otf",
    "NotoSerifCJK-Regular.ttc": "NotoSerifCJKjp-Regular.otf",
    "NotoSerifCJK-Bold.ttc": "NotoSerifCJKjp-Bold.otf",
}

os.makedirs(OUT, exist_ok=True)
for src, dst in FACES.items():
    path = os.path.join(OUT, dst)
    if os.path.exists(path):
        continue
    TTCollection(os.path.join(SRC, src)).fonts[0].save(path)   # 0 = JP
    print("wrote", path, file=sys.stderr)
