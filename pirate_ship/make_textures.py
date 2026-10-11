"""動画用のテクスチャを作る（羊皮紙・セピアインクの甲板平面図・封蝋の紋章・ドクロ旗）。

    python3 make_textures.py      # build/tex/*.png

インクの平面図は make_drawings.py が出力した甲板平面図 DXF をそのまま描く。
紙の範囲は ship_shape の座標 (mm) で PAPER に定め、Blender 側も同じ値を使う。
"""
import math
import os
import pathlib
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ship_shape as S  # noqa: E402

TEX = os.path.join(HERE, "build", "tex")
FONTS = os.path.join(HERE, "build", "fonts")
PLAN_DXF = os.path.join(HERE, "out", "drawings", "01_甲板平面図.dxf")

# 紙の範囲（mm, 船の座標）: x -9500..54500, y -18000..18000（16:9）
PAPER = (-9500.0, 54500.0, -18000.0, 18000.0)
RES = (6144, 3456)
SEPIA = "#4a2c14"


def value_noise(shape, cells, seed):
    rng = np.random.default_rng(seed)
    small = rng.random((cells[1], cells[0])).astype(np.float32)
    im = Image.fromarray((small * 255).astype(np.uint8)).resize(shape, Image.BICUBIC)
    return np.asarray(im, dtype=np.float32) / 255.0


def fbm(shape, base, octaves, seed):
    acc = np.zeros((shape[1], shape[0]), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        c = (base[0] * 2 ** o, base[1] * 2 ** o)
        acc += amp * value_noise(shape, c, seed + o)
        tot += amp
        amp *= 0.5
    return acc / tot


def parchment():
    W, H = RES
    n1 = fbm((W, H), (8, 5), 6, 1)
    n2 = fbm((W, H), (3, 2), 3, 11)
    stains = np.clip((fbm((W, H), (5, 3), 4, 21) - 0.58) * 4.0, 0, 1)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    ex = np.minimum(xx, W - 1 - xx) / W
    ey = np.minimum(yy, H - 1 - yy) / H
    edge = np.clip(1.0 - np.minimum(ex * 9.0, ey * 6.0), 0, 1) ** 2
    base = np.array([0.87, 0.77, 0.58], np.float32)
    dark = np.array([0.55, 0.38, 0.20], np.float32)
    t = np.clip(0.35 * n1 + 0.25 * n2 + 0.45 * edge + 0.25 * stains - 0.2, 0, 1)[..., None]
    col = base * (1 - t) + dark * t
    fiber = fbm((W, H), (12, 700), 2, 31)[..., None]
    col *= 0.97 + 0.05 * fiber
    img = Image.fromarray((np.clip(col, 0, 1) * 255).astype(np.uint8))
    img.save(os.path.join(TEX, "parchment.png"))


def ink():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib import font_manager as mfm
    import ezdxf
    from ezdxf.addons.drawing import Frontend, RenderContext, config
    from ezdxf.addons.drawing.matplotlib import MatplotlibBackend

    serif = mfm.FontProperties(fname=os.path.join(FONTS, "NotoSerifCJKjp-Bold.otf"))
    serif_r = mfm.FontProperties(fname=os.path.join(FONTS, "NotoSerifCJKjp-Regular.otf"))
    W, H = RES
    fig = plt.figure(figsize=(W / 100, H / 100), dpi=100)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_axis_off()
    fig.patch.set_alpha(0.0)
    ax.patch.set_alpha(0.0)

    doc = ezdxf.readfile(PLAN_DXF)
    keep = {"外形", "細部", "甲板板", "中心線", "想像線", "かくれ線"}
    ents = [e for e in doc.modelspace() if e.dxf.layer in keep]
    ctx = RenderContext(doc)
    cfg = config.Configuration(background_policy=config.BackgroundPolicy.OFF,
                               color_policy=config.ColorPolicy.CUSTOM, custom_fg_color=SEPIA,
                               lineweight_scaling=8.0, min_lineweight=1.4)
    be = MatplotlibBackend(ax)
    fe = Frontend(ctx, be, config=cfg)
    fe.draw_entities(ents)
    be.finalize()
    x0, x1, y0, y1 = PAPER
    ax.set_xlim(x0, x1)
    ax.set_ylim(y0, y1)
    ax.set_aspect("auto")

    # 二重の飾り枠
    for inset, lw in ((1400, 3.0), (1700, 1.2)):
        ax.add_patch(plt.Rectangle((x0 + inset, y0 + inset), (x1 - x0) - 2 * inset, (y1 - y0) - 2 * inset,
                                   fill=False, ec=SEPIA, lw=lw))
    # 題字
    ax.text(1200, 13900, "海 賊 船", fontproperties=serif, fontsize=150, color=SEPIA, va="center", ha="left")
    ax.text(1400, 10600, "甲板平面図　縮尺 百分之一", fontproperties=serif_r, fontsize=46, color=SEPIA,
            va="center", ha="left")
    ax.text(1400, -15300, "架空の船のイメージ　―　実在の船の図面ではない", fontproperties=serif_r, fontsize=34,
            color=SEPIA, va="center", ha="left")
    # 方位盤（右上）
    cx, cy, R = 49000.0, 11000.0, 4300.0
    for r, lw in ((R, 2.4), (R * 0.93, 1.0), (R * 0.42, 1.2)):
        ax.add_patch(plt.Circle((cx, cy), r, fill=False, ec=SEPIA, lw=lw))
    for i in range(32):
        a = math.pi / 2 - 2 * math.pi * i / 32
        r0 = R * (0.93 if i % 2 else 0.86)
        ax.plot([cx + r0 * math.cos(a), cx + R * math.cos(a)], [cy + r0 * math.sin(a), cy + R * math.sin(a)],
                color=SEPIA, lw=1.0)
    for i in range(16):
        a = math.pi / 2 - 2 * math.pi * i / 16
        L = R * (0.92 if i % 4 == 0 else 0.62 if i % 2 == 0 else 0.45)
        w = R * (0.13 if i % 4 == 0 else 0.09)
        tip = (cx + L * math.cos(a), cy + L * math.sin(a))
        lft = (cx + w * math.cos(a + math.pi / 2), cy + w * math.sin(a + math.pi / 2))
        rgt = (cx + w * math.cos(a - math.pi / 2), cy + w * math.sin(a - math.pi / 2))
        ax.add_patch(plt.Polygon([(cx, cy), lft, tip], closed=True, fc=SEPIA, ec=SEPIA, lw=0.8))
        ax.add_patch(plt.Polygon([(cx, cy), rgt, tip], closed=True, fc=(0, 0, 0, 0), ec=SEPIA, lw=0.8))
    ax.text(cx, cy + R + 900, "北", fontproperties=serif, fontsize=40, color=SEPIA, ha="center", va="center")
    ax.add_patch(plt.Circle((cx, cy), 220, color=SEPIA))
    # 縮尺の目盛（左下）
    sx, sy = 1400.0, -13300.0
    for i in range(10):
        ax.add_patch(plt.Rectangle((sx + i * 1000, sy), 1000, 260, fc=SEPIA if i % 2 == 0 else (0, 0, 0, 0),
                                   ec=SEPIA, lw=1.0))
    ax.text(sx + 10500, sy + 130, "10 m", fontproperties=serif_r, fontsize=26, color=SEPIA, va="center")
    fig.set_size_inches(W / 100, H / 100)
    ax.set_position([0, 0, 1, 1])
    fig.savefig(os.path.join(TEX, "ink.png"), dpi=100, transparent=True)
    plt.close(fig)
    # 線を少しにじませる
    im = Image.open(os.path.join(TEX, "ink.png")).convert("RGBA")
    a = im.getchannel("A").filter(ImageFilter.GaussianBlur(1.0)).point(lambda v: min(255, int(v * 1.5)))
    # 透明部分の色が混ざらないよう、色は全面セピアにしてアルファだけを残す
    out = Image.new("RGBA", im.size, tuple(int(SEPIA[i:i + 2], 16) for i in (1, 3, 5)) + (0,))
    out.putalpha(a)
    out.save(os.path.join(TEX, "ink.png"))


def skull(draw, cx, cy, s, fg, bg):
    """ドクロと交差した骨（単純な図形）。s は頭の半径。"""
    for ang in (35, -35):
        a = math.radians(ang)
        dx, dy = math.cos(a) * s * 2.3, math.sin(a) * s * 2.3
        bx, by = cx, cy + s * 1.3
        draw.line([(bx - dx, by - dy), (bx + dx, by + dy)], fill=fg, width=int(s * 0.38))
        for ex, ey in ((bx - dx, by - dy), (bx + dx, by + dy)):
            for k in (-1, 1):
                ox, oy = -math.sin(a) * s * 0.2 * k, math.cos(a) * s * 0.2 * k
                draw.ellipse([ex + ox - s * 0.24, ey + oy - s * 0.24, ex + ox + s * 0.24, ey + oy + s * 0.24], fill=fg)
    draw.ellipse([cx - s, cy - s * 1.05, cx + s, cy + s * 0.85], fill=fg)
    draw.rounded_rectangle([cx - s * 0.6, cy + s * 0.4, cx + s * 0.6, cy + s * 1.2], radius=s * 0.2, fill=fg)
    for ex in (-0.4, 0.4):
        draw.ellipse([cx + ex * s - s * 0.27, cy - s * 0.25, cx + ex * s + s * 0.27, cy + s * 0.25], fill=bg)
    draw.polygon([(cx, cy + s * 0.3), (cx - s * 0.13, cy + s * 0.55), (cx + s * 0.13, cy + s * 0.55)], fill=bg)
    for k in range(-2, 3):
        draw.line([(cx + k * s * 0.2, cy + s * 0.85), (cx + k * s * 0.2, cy + s * 1.2)], fill=bg, width=max(2, int(s * 0.06)))


def seal():
    """封蝋の高さマップ（白 = 高い）。"""
    N = 1024
    im = Image.new("L", (N, N), 0)
    d = ImageDraw.Draw(im)
    c = N / 2
    d.ellipse([c - 470, c - 470, c + 470, c + 470], fill=150)
    d.ellipse([c - 400, c - 400, c + 400, c + 400], fill=110)
    d.ellipse([c - 380, c - 380, c + 380, c + 380], fill=95)
    skull(d, c, c - 70, 150, 200, 95)
    for i in range(48):
        a = 2 * math.pi * i / 48
        r0, r1 = 405, 455
        d.line([(c + r0 * math.cos(a), c + r0 * math.sin(a)), (c + r1 * math.cos(a), c + r1 * math.sin(a))],
               fill=200, width=10)
    im = im.filter(ImageFilter.GaussianBlur(4))
    im.save(os.path.join(TEX, "seal_height.png"))


def flag():
    """ドクロ旗: ブルちゃん（茶色のボブヘア・ぱっつん前髪・ティールの三角ヘアピン）をかぶせたドクロと交差した骨。

    1 枚の絵を 4 倍の大きさで描いてから縮める（なめらかな輪郭のため）。
    """
    K = 4
    W, H = 1024 * K, 670 * K
    BG = (13, 13, 15)
    BONE = (238, 233, 220)
    HAIR = (96, 68, 52)
    HAIR_D = (62, 43, 33)
    HAIR_L = (150, 112, 86)
    CLIP = (38, 176, 186)
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)

    def P(x, y):
        return (x * K, y * K)

    def ell(cx, cy, rx, ry, fill, draw=d):
        draw.ellipse([P(cx - rx, cy - ry), P(cx + rx, cy + ry)], fill=fill)

    # 交差した骨（ドクロの後ろ）
    cx, cy = 512, 338
    for ang in (36, -36):
        a = math.radians(ang)
        ux, uy = math.cos(a), math.sin(a)
        L = 330
        p0 = (cx - ux * L, cy - uy * L)
        p1 = (cx + ux * L, cy + uy * L)
        d.line([P(*p0), P(*p1)], fill=BONE, width=46 * K)
        for (ex, ey), sgn in ((p0, -1), (p1, 1)):
            nx, ny = -uy, ux
            for k in (-1, 1):
                ell(ex + nx * 22 * k + ux * 8 * sgn, ey + ny * 22 * k + uy * 8 * sgn, 30, 30, BONE)

    # 髪の形（マスク）: 大きな丸い頭 − 顔の窓（前髪の線より下）
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32) / K
    head = ((xx - 512) / 214) ** 2 + ((yy - 292) / 196) ** 2 <= 1.0
    # ボブの裾: 少し外に広がり、内に巻く
    flare = 14 * np.clip((yy - 380) / 90, 0, 1)
    side = (np.abs(xx - 512) <= 214 + flare) & (yy >= 292) & (yy <= 478 - 10 * ((np.abs(xx - 512) - 150) / 70).clip(0, 1))
    hair = (head | side) & (yy <= 478)
    # ぱっつん前髪の線（小さなぎざぎざ）
    bang = 268 + 9 * np.abs(((xx - 512) / 34) % 2 - 1)
    face = (((xx - 512) / 156) ** 2 + ((yy - 372) / 168) ** 2 <= 1.0) & (yy > bang)
    hair &= ~face
    hair_img = Image.fromarray((hair * 255).astype(np.uint8))
    # 縁取り（黒地で目立たせる）
    rim = hair_img.filter(ImageFilter.MaxFilter(1 + 2 * 5 * K // 2 * 2 + 1 if False else 21))
    im.paste((210, 196, 170), mask=rim)

    # ドクロ（顔の窓の中に見える）
    sk = Image.new("RGB", (W, H), BG)
    sd = ImageDraw.Draw(sk)
    ell(512, 330, 168, 158, BONE, sd)
    sd.rounded_rectangle([P(408, 370), P(616, 470)], radius=48 * K, fill=BONE)
    # 大きな目（アニメ風の光つき）
    for ex in (452, 572):
        ell(ex, 338, 46, 52, BG, sd)
        ell(ex - 14, 322, 13, 15, BONE, sd)
        ell(ex + 12, 356, 6, 7, BONE, sd)
    # 鼻と歯
    sd.polygon([P(512, 404), P(499, 386), P(525, 386)], fill=BG)
    sd.rounded_rectangle([P(456, 424), P(568, 456)], radius=10 * K, fill=BG)
    for k in range(1, 6):
        x = 456 + 112 * k / 6
        sd.line([P(x, 426), P(x, 454)], fill=BONE, width=6 * K)
    sd.line([P(458, 440), P(566, 440)], fill=BONE, width=5 * K)
    skull_mask = Image.new("L", (W, H), 0)
    md = ImageDraw.Draw(skull_mask)
    md.ellipse([P(512 - 168, 330 - 158), P(512 + 168, 330 + 158)], fill=255)
    md.rounded_rectangle([P(408, 370), P(616, 470)], radius=48 * K, fill=255)
    im.paste(sk, mask=skull_mask)

    # 髪（毛束の線・天使の輪）
    hl = Image.new("RGB", (W, H), HAIR)
    hd = ImageDraw.Draw(hl)
    for k in range(-7, 8):            # 前髪の毛束（ゆるい弧）
        x1 = 512 + k * 23
        hd.line([P(512 + k * 9, 128), P(512 + k * 17, 200), P(x1, 268)], fill=HAIR_D, width=4 * K, joint="curve")
    for sgn in (-1, 1):                # 横の髪
        for k in range(3):
            x0 = 512 + sgn * (172 + k * 15)
            hd.line([P(512 + sgn * (120 + k * 25), 200), P(x0, 330), P(x0 + sgn * 6, 470)], fill=HAIR_D,
                    width=4 * K, joint="curve")
    hd.arc([P(380, 152), P(644, 318)], start=205, end=335, fill=HAIR_L, width=14 * K)
    im.paste(hl, mask=hair_img)

    # 三角のヘアピン（向かって左の前髪、角が左下を向く）
    c = (406, 222)
    rot = math.radians(30)
    tri = []
    for a in (90, 210, 330):
        r = math.radians(a) + rot
        tri.append(P(c[0] + 40 * math.cos(r), c[1] + 40 * math.sin(r)))
    d2 = ImageDraw.Draw(im)
    d2.polygon(tri, fill=(150, 225, 228))
    inner = [(c[0] * K + (x - c[0] * K) * 0.42, c[1] * K + (y - c[1] * K) * 0.42) for x, y in tri]
    d2.polygon(tri, fill=CLIP)
    d2.polygon(inner, fill=HAIR)
    for p in tri:
        d2.ellipse([p[0] - 5 * K, p[1] - 5 * K, p[0] + 5 * K, p[1] + 5 * K], fill=CLIP)

    im = im.resize((1024, 670), Image.LANCZOS)
    # 布の質感
    arr = np.asarray(im).astype(np.float32)
    tex = fbm((1024, 670), (60, 40), 2, 41)[..., None]
    arr *= 0.965 + 0.07 * tex
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(os.path.join(TEX, "flag.png"))


def main():
    os.makedirs(TEX, exist_ok=True)
    which = sys.argv[1:] or ["parchment", "ink", "seal", "flag"]
    for w in which:
        globals()[w]()
        print("made", w)


if __name__ == "__main__":
    main()
