"""切り出したパーツを色付き背景に並べた確認用シート（build/contact_*.png）。"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
for chara in sys.argv[1:]:
    files = sorted((ROOT / "assets" / "chara" / chara).glob("*.png"))
    cell = 300
    cols = 8
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cell, rows * (cell + 20)), (120, 170, 120))
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(files):
        im = Image.open(f)
        im.thumbnail((cell - 10, cell - 10))
        x, y = (i % cols) * cell, (i // cols) * (cell + 20)
        bg = Image.new("RGB", (cell, cell), (90, 150, 210) if i % 2 else (230, 120, 140))
        sheet.paste(bg, (x, y))
        sheet.paste(im, (x + (cell - im.width) // 2, y + cell - im.height), im)
        d.text((x + 4, y + cell + 4), f.stem, fill=(0, 0, 0))
    sheet.save(ROOT / "build" / f"contact_{chara}.png")
