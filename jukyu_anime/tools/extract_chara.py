"""3 枚のキャラクターシートから、アニメで使うパーツを切り出す。

    python3 tools/extract_chara.py ブルちゃん.png ミナ.png 押し目おじさん.jpg

・waifu2x で拡大してから、外周につながった白い背景だけを透明にする
・本体から離れた小さな島（キラキラ・ハート・ラベルの残りなど）は消す
・バストアップ（表情）は下端が枠で切れているので、下辺からは背景を抜かない
出力: assets/chara/<キャラ>/*.png（受け取った画像の派生物なのでリポジトリには入れない）
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, str(Path(__file__).resolve().parent))
from waifu2x import upscale  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "chara"

# 表情パネル: (名前, 左, 上, 右, 下)。ラベルの帯より下、パネルの枠より内側で切る
BULL_COLS = [(775, 880), (892, 996), (1008, 1115), (1126, 1231)]
BULL_ROWS = [(90, 233), (272, 415), (455, 597), (639, 781)]
BULL_NAMES = [
    ["smile", "grin", "wink", "excited"],
    ["sparkle", "smug", "think", "surprised"],
    ["puzzled", "sleepy", "sad", "cry"],
    ["shy", "angry", "fist", "relax"],
]
MINA_COLS = [(769, 878), (889, 998), (1009, 1118), (1127, 1237)]
MINA_ROWS = [(88, 219), (261, 395), (436, 571), (611, 746)]
MINA_NAMES = [
    ["smile", "grin", "wink", "excited"],
    ["sparkle", "shy", "think", "surprised"],
    ["burger", "troubled", "sleepy", "teary"],
    ["eat", "fight", "relax", "thanks"],
]
OJI_COLS = [(22, 207), (221, 405), (420, 604), (620, 819), (834, 1018), (1032, 1222)]
OJI_ROW = (972, 1182)
OJI_NAMES = ["normal", "smile", "hot", "surprised", "troubled", "fist"]

# 全身・一枚絵: (キャラ, 名前, 左, 上, 右, 下, 下辺も抜くか, 拡大回数)
PARTS = [
    ("bull", "front", 350, 240, 499, 774, True, 2),
    ("bull", "side", 500, 240, 630, 774, True, 2),
    ("bull", "back", 632, 240, 753, 774, True, 2),
    ("bull", "main", 18, 92, 372, 793, False, 1),
    ("bull", "chibi", 1036, 970, 1215, 1240, True, 2),
    ("bull", "tea", 769, 822, 876, 965, False, 2),
    ("bull", "wave", 886, 822, 993, 965, False, 2),
    ("mina", "front", 385, 228, 512, 670, True, 2),
    ("mina", "side", 514, 228, 626, 670, True, 2),
    ("mina", "back", 628, 228, 756, 670, True, 2),
    ("mina", "main", 12, 96, 404, 690, False, 1),
    ("mina", "chibi", 1018, 862, 1246, 1250, True, 2),
    ("oji", "main", 16, 186, 436, 661, False, 1),
    ("oji", "front", 470, 209, 705, 662, True, 1),
    ("oji", "side", 760, 214, 930, 662, True, 1),
    ("oji", "back", 975, 209, 1205, 662, True, 1),
]


def clean_dotted_lines(rgb):
    """ブルちゃんのシートの、ターンアラウンドの間の水色の点線を白で消す。"""
    a = rgb.astype(np.int32)
    for x0, x1 in ((482, 490), (614, 621)):
        blk = a[:, x0:x1]
        light_blue = (blk.sum(axis=2) > 420) & (blk[..., 2] - blk[..., 0] > 35)
        blk[light_blue] = 255
        a[:, x0:x1] = blk
    return a.astype(np.uint8)


def whiten_border(part, width=4):
    """パネルの枠線（薄いグレー）が本体とつながらないよう、上と左右の縁の明るい画素を白にする。"""
    a = np.asarray(part).copy()
    light = a.min(axis=2) > 165
    band = np.zeros(light.shape, bool)
    band[:width, :] = True
    band[:, :width] = True
    band[:, -width:] = True
    a[band & light] = 255
    return Image.fromarray(a)


def knock_out(img, open_bottom, holes=False, thin=False):
    """外周につながった白っぽい画素を透明にし、いちばん大きい塊だけ残す。
    holes=True なら、脚の間など本体に囲まれた大きな真っ白の領域も抜く。"""
    a = np.asarray(img.convert("RGB")).astype(np.int32)
    h, w, _ = a.shape
    mn = a.min(axis=2)
    mx = a.max(axis=2)
    whiteish = (mn > 226) & (mx - mn < 34)
    lab, _ = ndimage.label(whiteish)
    edge = [lab[0, :], lab[:, 0], lab[:, -1]]
    if open_bottom:
        edge.append(lab[-1, :])
    ids = np.unique(np.concatenate(edge))
    ids = ids[ids > 0]
    bg = np.isin(lab, ids)
    if holes:
        pure = (mn > 244) & (mx - mn < 14)
        lab_h, n_h = ndimage.label(pure & ~bg)
        if n_h:
            sizes = ndimage.sum(np.ones_like(lab_h), lab_h, index=np.arange(1, n_h + 1))
            cy = np.asarray(ndimage.center_of_mass(np.ones_like(lab_h), lab_h, np.arange(1, n_h + 1)))[:, 0]
            # 袖の白いラインは残し、脚の間（下半分）だけ抜く
            big = np.arange(1, n_h + 1)[(sizes > h * w * 0.002) & (cy > h * 0.6)]
            bg |= np.isin(lab_h, big)
    fg = ~bg
    if thin:
        # 枠線の残り（幅 2〜3 px の線）が本体にくっついていたら切り離す
        fg = ndimage.binary_opening(fg, structure=np.ones((3, 3)), iterations=2) | (fg & (mn < 200))
        fg = ndimage.binary_opening(fg, structure=np.ones((3, 3)), iterations=1)
    lab2, n2 = ndimage.label(fg)
    if n2 > 1:
        sizes = ndimage.sum(np.ones_like(lab2), lab2, index=np.arange(1, n2 + 1))
        fg = lab2 == 1 + int(np.argmax(sizes))
    # 縁の白いにじみを半透明にして、色から白を引く
    dist = ndimage.distance_transform_edt(fg)
    band = fg & (dist <= 2.5)
    alpha = np.where(fg, 1.0, 0.0)
    whiteness = (a.sum(axis=2) / 765.0)
    soft = np.clip((1.0 - whiteness) / 0.22, 0.35, 1.0)
    alpha = np.where(band, np.minimum(alpha, soft), alpha)
    alpha = ndimage.gaussian_filter(alpha, 0.6) * fg + 0.0
    rgb = a.astype(np.float32)
    al = np.clip(alpha, 1e-3, 1)[..., None]
    rgb = np.where(band[..., None], np.clip((rgb - (1 - al) * 255) / al, 0, 255), rgb)
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def trim(img, pad=6):
    a = np.asarray(img)[..., 3]
    ys, xs = np.nonzero(a > 8)
    if len(xs) == 0:
        return img
    l, t = max(xs.min() - pad, 0), max(ys.min() - pad, 0)
    r, b = min(xs.max() + pad + 1, img.width), min(ys.max() + 1, img.height)
    if b < img.height:
        b = min(b + pad, img.height)
    return img.crop((l, t, r, b))


def up(img, times):
    for _ in range(times):
        img = upscale(img, noise=1)
    return img


def cut(sheet, box, open_bottom, times, do_trim=True, holes=False):
    part = whiten_border(Image.fromarray(sheet).crop(box), 4 if not do_trim else 9)
    part = up(part, times)
    part = knock_out(part, open_bottom, holes, thin=do_trim)
    return trim(part) if do_trim else part


def save(img, chara, name):
    d = OUT / chara
    d.mkdir(parents=True, exist_ok=True)
    img.save(d / f"{name}.png")
    print(f"{chara}/{name}.png {img.size}")


def faces(sheet, chara, cols, rows, names, times):
    for (t, b), row in zip(rows, names):
        for (l, r), name in zip(cols, row):
            # バストは下端が枠で切れている。高さを揃えるため trim は上と左右だけ
            img = cut(sheet, (l, t, r, b), False, times, do_trim=False)
            save(img, chara, f"face_{name}")


def main(bull_path, mina_path, oji_path):
    bull = clean_dotted_lines(np.asarray(Image.open(bull_path).convert("RGB")))
    mina = np.asarray(Image.open(mina_path).convert("RGB"))
    oji = np.asarray(Image.open(oji_path).convert("RGB"))
    sheets = {"bull": bull, "mina": mina, "oji": oji}
    only = set(sys.argv[4:])
    if not only or "faces" in only:
        faces(bull, "bull", BULL_COLS, BULL_ROWS, BULL_NAMES, 2)
        faces(mina, "mina", MINA_COLS, MINA_ROWS, MINA_NAMES, 2)
        faces(oji, "oji", OJI_COLS, [OJI_ROW], [OJI_NAMES], 2)
    if not only or "parts" in only:
        for chara, name, l, t, r, b, open_bottom, times in PARTS:
            holes = chara == "oji" and name in ("front", "back", "side")
            save(cut(sheets[chara], (l, t, r, b), open_bottom, times, holes=holes), chara, name)


if __name__ == "__main__":
    main(*sys.argv[1:4])
