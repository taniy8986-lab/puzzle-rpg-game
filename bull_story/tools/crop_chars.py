"""キャラクターシートから立ち絵・表情を切り出す（背景は透過にする）。

使い方:
    python3 tools/crop_chars.py --bull ブルちゃん.png --baron 空売り男爵.png --pig サングラスの豚.png \
        --eve イブちゃん表情.png --hat ハットおじさん表情.png --hatbody ハットおじさん全身.png

出力: assets/chara/<キャラ>_<部位>.png（受け取った画像の派生物なのでリポジトリには入れない）
座標は受け取ったシートの画素位置（左, 上, 右, 下）。
"""
import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps
from scipy import ndimage

OUT = Path(__file__).resolve().parent.parent / "assets" / "chara"

# (部位名, 左, 上, 右, 下, 背景を抜くか, 拡大率, 足元の影を消す帯の高さ)
SHEETS = {
    "bull": [
        ("face_big", 20, 178, 470, 668, True, 2, 0),
        ("front", 535, 108, 755, 664, True, 2, 18),
        ("side", 795, 108, 990, 664, True, 2, 18),
        ("back", 1010, 108, 1212, 664, True, 2, 18),
        ("e_normal", 25, 986, 207, 1203, True, 3, 0),
        ("e_smile", 224, 986, 406, 1203, True, 3, 0),
        ("e_trouble", 424, 986, 606, 1203, True, 3, 0),
        ("e_sleepy", 612, 986, 802, 1203, True, 3, 0),
        ("e_surprise", 826, 986, 1008, 1203, True, 3, 0),
        ("e_cry", 1043, 986, 1227, 1203, True, 3, 0),
        ("hood", 226, 766, 434, 878, False, 2, 0),
    ],
    "baron": [
        ("face_big", 17, 168, 445, 676, True, 2, 0),
        ("front", 462, 203, 757, 672, True, 2, 22),
        ("side", 770, 205, 995, 672, True, 2, 22),
        ("back", 978, 205, 1236, 672, True, 2, 22),
        ("e_normal", 24, 984, 216, 1222, True, 3, 0),
        ("e_scheme", 228, 984, 420, 1222, True, 3, 0),
        ("e_laugh", 431, 984, 622, 1222, True, 3, 0),
        ("e_rage", 633, 984, 825, 1222, True, 3, 0),
        ("e_shock", 836, 984, 1029, 1222, True, 3, 0),
        ("e_sore", 1040, 984, 1232, 1222, True, 3, 0),
        ("medal", 470, 778, 660, 880, False, 2, 0),
    ],
    "pig": [
        ("main", 35, 150, 600, 916, True, 2, 30),
        ("front", 685, 66, 990, 470, True, 2, 18),
        ("side", 1050, 60, 1292, 470, True, 2, 18),
        ("back", 1355, 66, 1632, 470, True, 2, 18),
        ("e_smirk", 668, 538, 1002, 768, True, 3, 0),
        ("e_angry", 1022, 538, 1314, 768, True, 3, 0),
        ("e_shock", 1342, 528, 1648, 768, True, 3, 0),
        ("glasses", 690, 820, 970, 910, True, 2, 0),
    ],
    "hatbody": [
        ("front", 214, 66, 482, 662, True, 2, 16),
        ("side", 644, 62, 816, 662, True, 2, 16),
        ("back", 1004, 60, 1260, 660, True, 2, 16),
    ],
}

# 表情パネル（矩形のまま使う。パネルの枠とラベルの帯は避ける）
GRIDS = {
    "eve": {
        "cols": [(20, 358), (376, 716), (732, 1073), (1090, 1429)],
        "rows": [(60, 338), (390, 666), (716, 1020)],
        "names": [["normal", "smile", "laugh", "shy"],
                  ["wink", "scheme", "smirk", "angry"],
                  ["surprise", "anxious", "cry", "despair"]],
    },
    "hat": {
        "cols": [(30, 392), (404, 762), (774, 1132), (1144, 1506)],
        "rows": [(77, 342), (384, 648), (690, 960)],
        "names": [["normal", "smile", "laugh", "proud"],
                  ["scheme", "smirk", "cackle", "angry"],
                  ["surprise", "anxious", "cry", "despair"]],
    },
}


def knock_out(rgb, shadow_band=0, lo=26.0, hi=70.0):
    """外周から繋がっている背景色の画素を透明にし、輪郭は色を戻して半透明にする。"""
    a = rgb.astype(np.float32)
    h, w, _ = a.shape
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    # 外周のうち明るい画素だけで背景色を決める（衣装が外周にかかるシートがあるため）
    light = border[border.min(axis=1) > 200]
    bg = np.median(light if len(light) else border, axis=0)
    dist = np.abs(a - bg).max(axis=2)
    bgish = dist < lo
    if shadow_band:
        # 足元の影（彩度の低い薄いグレー）も背景として扱う
        mx, mn = a.max(axis=2), a.min(axis=2)
        gray = (mx - mn < 22) & (mx > 150)
        band = np.zeros_like(bgish)
        band[h - shadow_band:] = True
        bgish |= gray & band
    lab, _ = ndimage.label(bgish)
    edge_labels = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    edge_labels = edge_labels[edge_labels > 0]
    bgmask = np.isin(lab, edge_labels)
    # 枠線や影で外周から切り離された背景（脚の間・パネル枠の内側）も、外周の近くにあれば背景にする
    for i, sl in enumerate(ndimage.find_objects(lab), start=1):
        if sl is None or i in edge_labels:
            continue
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        if min(y0, x0, h - y1, w - x1) <= 6:
            comp = lab[sl] == i
            if dist[sl][comp].mean() < 16:
                bgmask[sl] |= comp
    # 本体（最大の島）だけ残す
    fg = ~bgmask
    flab, n = ndimage.label(fg)
    if n > 1:
        sizes = ndimage.sum(fg, flab, range(1, n + 1))
        keep = np.argmax(sizes) + 1
        fg = flab == keep
        fg = ndimage.binary_fill_holes(fg) & ~(bgmask & ~ndimage.binary_fill_holes(fg))
    alpha = fg.astype(np.float32)
    # 背景に接する輪郭 2px は距離に応じて半透明にし、背景色を差し引いて白いフチを消す
    ring = fg & ~ndimage.binary_erosion(fg, iterations=2)
    k = np.clip((dist - lo * 0.5) / (hi - lo * 0.5), 0.0, 1.0)
    alpha[ring] = k[ring]
    safe = np.maximum(alpha, 1e-3)[..., None]
    col = (a - (1.0 - alpha[..., None]) * bg) / safe
    col = np.where(alpha[..., None] > 0, np.clip(col, 0, 255), 0)
    out = np.dstack([col, alpha * 255.0]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def upscale(img, k):
    """乗算済みアルファで拡大してから戻す（フチの色にじみを防ぐ）。"""
    if k == 1:
        return img
    a = np.asarray(img).astype(np.float32) / 255.0
    pm = a.copy()
    pm[..., :3] *= pm[..., 3:4]
    w, h = img.size
    chans = [Image.fromarray((pm[..., i] * 255).astype(np.uint8)).resize((w * k, h * k), Image.LANCZOS) for i in range(4)]
    big = np.dstack([np.asarray(c).astype(np.float32) / 255.0 for c in chans])
    al = np.maximum(big[..., 3:4], 1e-4)
    big[..., :3] = np.where(big[..., 3:4] > 0.002, big[..., :3] / al, 0)
    res = Image.fromarray((np.clip(big, 0, 1) * 255).astype(np.uint8), "RGBA")
    return res.filter(ImageFilter.UnsharpMask(radius=1.6, percent=60, threshold=2))


def eyes_only(img):
    """男爵の顔アップから、赤く光る目だけを残したシルエットを作る（第1章の闇の中の目）。"""
    a = np.asarray(img).astype(np.float32)
    rgb, al = a[..., :3], a[..., 3]
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    h, w = al.shape
    yy, xx = np.mgrid[0:h, 0:w]
    # 目のある帯（フードの鼻面の左右）だけ探す
    zone = (yy > h * 0.10) & (yy < h * 0.205) & (((xx > w * 0.20) & (xx < w * 0.45)) | ((xx > w * 0.58) & (xx < w * 0.82)))
    red = (r > 120) & (r > g * 1.9) & (r > b * 1.7) & zone
    red = ndimage.binary_dilation(red, iterations=1)
    glow = ndimage.gaussian_filter(red.astype(np.float32), 6) * 2.2
    out = np.zeros_like(a)
    out[..., 0] = 10
    out[..., 1] = 8
    out[..., 2] = 12
    out[..., 3] = al
    eye = red.astype(np.float32)
    out[..., 0] = np.maximum(out[..., 0], eye * np.clip(r * 1.25, 0, 255))
    out[..., 1] = np.maximum(out[..., 1], eye * g * 0.6)
    out[..., 2] = np.maximum(out[..., 2], eye * b * 0.6)
    # 目のまわりの赤い光
    gl = np.clip(glow, 0, 1)
    out[..., 0] = np.clip(out[..., 0] + gl * 200, 0, 255)
    out[..., 3] = np.clip(np.maximum(out[..., 3], gl * 255), 0, 255)
    return Image.fromarray(out.astype(np.uint8), "RGBA")


def main():
    ap = argparse.ArgumentParser()
    for k in ("bull", "baron", "pig", "eve", "hat", "hatbody"):
        ap.add_argument(f"--{k}", required=True)
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)

    for who, parts in SHEETS.items():
        sheet = Image.open(getattr(args, who)).convert("RGB")
        name = "hat" if who == "hatbody" else who
        for part, l, t, r, b, knock, k, shadow in parts:
            crop = sheet.crop((l, t, r, b))
            img = knock_out(np.asarray(crop), shadow) if knock else crop.convert("RGBA")
            img = upscale(img, k)
            img.save(OUT / f"{name}_{part}.png")
            if who == "baron" and part == "face_big":
                eyes_only(img).save(OUT / "baron_eyes.png")
        if who == "baron":
            # 師匠の写真立て用（男爵の高笑いの顔をセピアにして、昔の笑顔の写真に見せる）
            face = sheet.crop((462, 1046, 596, 1172)).resize((536, 504), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=2))
            sep = ImageOps.colorize(ImageOps.grayscale(face), (52, 34, 20), (250, 228, 190), mid=(170, 128, 86))
            sep.save(OUT / "mentor_photo.png")
            face.save(OUT / "mentor_photo_color.png")   # 正体を明かす場面で、セピアから色が戻る

    for who, g in GRIDS.items():
        sheet = Image.open(getattr(args, who)).convert("RGB")
        for (t, b), names in zip(g["rows"], g["names"]):
            for (l, r), part in zip(g["cols"], names):
                upscale(sheet.crop((l, t, r, b)).convert("RGBA"), 2).save(OUT / f"{who}_e_{part}.png")
    print("書き出し:", OUT)


if __name__ == "__main__":
    main()
