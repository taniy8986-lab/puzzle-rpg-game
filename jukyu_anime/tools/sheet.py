"""静止画を一覧に並べる（確認用）。 python3 tools/sheet.py build/ep01/stills out.png [列数]"""
import sys, glob
from PIL import Image, ImageDraw
fs = sorted(glob.glob(sys.argv[1] + '/*.png'))
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
w, h = 480, 270
rows = (len(fs) + cols - 1) // cols
o = Image.new('RGB', (cols * (w + 8), rows * (h + 24)), 'white')
d = ImageDraw.Draw(o)
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGB').resize((w, h))
    x, y = (i % cols) * (w + 8), (i // cols) * (h + 24)
    o.paste(im, (x, y))
    d.text((x + 4, y + h + 4), f"{i:02d}  {f.split('/')[-1]}", fill=(0, 0, 0))
o.save(sys.argv[2])
