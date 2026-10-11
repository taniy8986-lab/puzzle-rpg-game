"""プレビュー PNG の一部を切り出して拡大確認する: crop.py in.png out.png x0 y0 x1 y1（0–1 の割合）"""
import sys
from PIL import Image
im = Image.open(sys.argv[1])
x0, y0, x1, y1 = map(float, sys.argv[3:7])
W, H = im.size
im.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H))).save(sys.argv[2])
