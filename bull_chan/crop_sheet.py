"""キャラクターシートからパーツを切り出す（全身は背景の白を透過にする）。

使い方: python3 crop_sheet.py <シート画像のパス>
出力: assets/chara/*.png（受け取った画像の派生物なのでリポジトリには入れない）
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).parent / "assets" / "chara"

# (名前, 左, 上, 右, 下, 背景を抜くか)
BODY = [
    ("front", 70, 165, 215, 632, True),
    ("side", 250, 165, 362, 632, True),
    ("back", 400, 165, 560, 632, True),
    ("collapse", 24, 682, 308, 996, True),
    ("alone", 320, 682, 603, 996, True),
]

# 表情パネル（ラベルの帯を避けて切る）
COLS = [634, 852, 1072, 1301]
ROWS = [172, 450, 727]
FACE_W, FACE_H = 202, 222
FACES = [
    ["normal", "smile", "shy", "resolve"],
    ["anxious", "holdback", "tears", "wail"],
    ["despair", "dazed", "scared", "frustrated"],
]


def knock_out_white(img):
    """外周から繋がっている白っぽい画素だけを透明にする。"""
    img = img.convert("RGBA")
    w, h = img.size
    marker = (255, 0, 255, 255)
    flood = img.copy()
    for x in range(w):
        for y in (0, h - 1):
            if sum(flood.getpixel((x, y))[:3]) > 700:
                ImageDraw.floodfill(flood, (x, y), marker, thresh=110)
    for y in range(h):
        for x in (0, w - 1):
            if sum(flood.getpixel((x, y))[:3]) > 700:
                ImageDraw.floodfill(flood, (x, y), marker, thresh=110)
    px, fp = img.load(), flood.load()
    for y in range(h):
        for x in range(w):
            if fp[x, y] == marker:
                px[x, y] = (255, 255, 255, 0)
    return keep_largest(img)


def keep_largest(img):
    """影の残りかすなど、本体から離れた小さな島を消す。"""
    w, h = img.size
    px = img.load()
    seen = bytearray(w * h)
    best = []
    for sy in range(h):
        for sx in range(w):
            if seen[sy * w + sx] or px[sx, sy][3] == 0:
                continue
            comp, stack = [], [(sx, sy)]
            seen[sy * w + sx] = 1
            while stack:
                x, y = stack.pop()
                comp.append((x, y))
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and px[nx, ny][3]:
                        seen[ny * w + nx] = 1
                        stack.append((nx, ny))
            if len(comp) > len(best):
                best = comp
    keep = bytearray(w * h)
    for x, y in best:
        keep[y * w + x] = 1
    for y in range(h):
        for x in range(w):
            if not keep[y * w + x]:
                px[x, y] = (255, 255, 255, 0)
    return img


def main(src):
    sheet = Image.open(src).convert("RGB")
    OUT.mkdir(parents=True, exist_ok=True)
    for name, l, t, r, b, knock in BODY:
        part = sheet.crop((l, t, r, b))
        if knock:
            part = knock_out_white(part)
        part = part.resize((part.width * 3, part.height * 3), Image.LANCZOS)
        part.save(OUT / f"{name}.png")
    for row, names in zip(ROWS, FACES):
        for col, name in zip(COLS, names):
            part = sheet.crop((col, row, col + FACE_W, row + FACE_H))
            part = part.resize((FACE_W * 3, FACE_H * 3), Image.LANCZOS)
            part.save(OUT / f"face_{name}.png")


if __name__ == "__main__":
    main(sys.argv[1])
