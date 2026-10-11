"""架空の海賊船の 2D 図面（DXF, A2, 単位 mm）を作る。

    python3 make_drawings.py            # out/drawings/*.dxf と プレビュー PNG

寸法はすべて ship_shape.py から読む。図面はモデル空間に原寸 (1:1, mm) で描き、
A2 の図枠と表題欄を縮尺倍して重ねる（甲板平面図は中心線 y=0 の実際の位置に描く）。
"""
import math
import os
import sys

import ezdxf
from ezdxf import units
from ezdxf.enums import TextEntityAlignment

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ship_shape as S  # noqa: E402

OUT = os.path.join(HERE, "out", "drawings")
DXF_FONT = "msgothic.ttc"          # CAD 側の日本語フォント（Windows 標準）
A2 = (594.0, 420.0)
DATE = "2026-10-10"
TITLE = "架空の海賊船（17世紀ガレオン船風・3本マスト）"

LAYERS = {  # 名前: (色 ACI, 線の太さ 1/100 mm, 線種)
    "枠": (7, 70, "Continuous"),
    "表題": (7, 35, "Continuous"),
    "外形": (7, 50, "Continuous"),
    "細部": (7, 25, "Continuous"),
    "甲板板": (8, 13, "Continuous"),
    "かくれ線": (8, 18, "HID"),
    "中心線": (1, 18, "CL"),
    "想像線": (6, 18, "PHAN"),
    "喫水線": (5, 35, "Continuous"),
    "帆": (30, 35, "Continuous"),
    "帆布": (30, 13, "Continuous"),
    "索具": (94, 13, "Continuous"),
    "断面": (7, 50, "Continuous"),
    "ハッチング": (8, 13, "Continuous"),
    "寸法": (5, 18, "Continuous"),
    "文字": (7, 25, "Continuous"),
    "引出線": (7, 18, "Continuous"),
}


# ====================================================================== 幾何ヘルパ
def point_in_poly(p, poly):
    x, y = p
    inside = False
    n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % n]
        if (y1 > y) != (y2 > y):
            xi = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
            if xi > x:
                inside = not inside
    return inside


def clip_polyline(pts, occluders, step):
    """occluders（多角形のリスト）に隠れる部分を除いた折れ線のリストを返す。"""
    if not occluders:
        return [pts]
    out, cur = [], []
    for i in range(len(pts) - 1):
        (x1, y1), (x2, y2) = pts[i], pts[i + 1]
        n = max(1, int(math.hypot(x2 - x1, y2 - y1) / step))
        for k in range(n):
            a = (x1 + (x2 - x1) * k / n, y1 + (y2 - y1) * k / n)
            b = (x1 + (x2 - x1) * (k + 1) / n, y1 + (y2 - y1) * (k + 1) / n)
            m = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
            hidden = any(point_in_poly(m, poly) for poly in occluders)
            if hidden:
                if len(cur) > 1:
                    out.append(cur)
                cur = []
            else:
                if not cur:
                    cur = [a]
                cur.append(b)
    if len(cur) > 1:
        out.append(cur)
    return out


def offset_polyline(pts, d):
    """折れ線を左側へ d だけずらす（簡易）。"""
    out = []
    n = len(pts)
    for i in range(n):
        p0 = pts[max(i - 1, 0)]
        p1 = pts[min(i + 1, n - 1)]
        dx, dy = p1[0] - p0[0], p1[1] - p0[1]
        L = math.hypot(dx, dy) or 1.0
        out.append((pts[i][0] - dy / L * d, pts[i][1] + dx / L * d))
    return out


def tapered_spar(p0, p1, d0, d1):
    """円材（マスト・帆桁）の輪郭（閉じた4角形）。"""
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    L = math.hypot(dx, dy) or 1.0
    nx, ny = -dy / L, dx / L
    return [(p0[0] + nx * d0 / 2, p0[1] + ny * d0 / 2), (p1[0] + nx * d1 / 2, p1[1] + ny * d1 / 2),
            (p1[0] - nx * d1 / 2, p1[1] - ny * d1 / 2), (p0[0] - nx * d0 / 2, p0[1] - ny * d0 / 2)]


def rect(x0, y0, x1, y1):
    return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]


def circle_pts(cx, cy, r, n=32):
    return [(cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n)) for i in range(n)]


def interval_minus(a, b, cuts):
    """区間 [a, b] から cuts の区間を除いた区間のリスト。"""
    res = [(a, b)]
    for c0, c1 in cuts:
        nxt = []
        for s0, s1 in res:
            if c1 <= s0 or c0 >= s1:
                nxt.append((s0, s1))
                continue
            if c0 > s0:
                nxt.append((s0, c0))
            if c1 < s1:
                nxt.append((c1, s1))
        res = nxt
    return [r for r in res if r[1] - r[0] > 1.0]


# ====================================================================== 図面クラス
class Sheet:
    def __init__(self, name, title, scale, origin, number):
        self.name, self.title, self.S, self.origin, self.number = name, title, scale, origin, number
        doc = ezdxf.new("R2010", setup=False)
        doc.units = units.MM
        doc.header["$INSUNITS"] = 4
        doc.header["$MEASUREMENT"] = 1
        doc.header["$LUNITS"] = 2
        doc.header["$LTSCALE"] = scale
        doc.header["$PSLTSCALE"] = 0
        doc.header["$LWDISPLAY"] = 1
        doc.linetypes.add("CL", pattern=[18.0, 12.0, -2.0, 2.0, -2.0], description="中心線 ____ _ ____")
        doc.linetypes.add("HID", pattern=[4.5, 3.0, -1.5], description="かくれ線 _ _ _")
        doc.linetypes.add("PHAN", pattern=[22.0, 12.0, -2.0, 2.0, -2.0, 2.0, -2.0],
                          description="想像線 ____ _ _ ____")
        for lname, (color, lw, lt) in LAYERS.items():
            doc.layers.add(lname, color=color, lineweight=lw, linetype=lt)
        doc.styles.add("JP", font=DXF_FONT)
        ds = doc.dimstyles.new("JIS")
        ds.dxf.dimtxsty = "JP"
        ds.dxf.dimtxt = 2.5
        ds.dxf.dimasz = 2.5
        ds.dxf.dimscale = scale
        ds.dxf.dimexo = 1.5
        ds.dxf.dimexe = 1.5
        ds.dxf.dimgap = 0.8
        ds.dxf.dimtad = 1
        ds.dxf.dimtih = 0
        ds.dxf.dimtoh = 0
        ds.dxf.dimdec = 0
        ds.dxf.dimclrd = 5
        ds.dxf.dimclre = 5
        ds.dxf.dimclrt = 5
        ds.dxf.dimlwd = 18
        ds.dxf.dimlwe = 18
        self.doc, self.msp = doc, doc.modelspace()
        self.text_boxes = []   # 文字の外接矩形（重なり確認用）

    # --- 座標
    def P(self, px, py):
        return (self.origin[0] + px * self.S, self.origin[1] + py * self.S)

    def h(self, mm):
        return mm * self.S

    # --- 基本図形（モデル座標）
    def pl(self, pts, layer, closed=False):
        if len(pts) >= 2:
            self.msp.add_lwpolyline([(p[0], p[1]) for p in pts], close=closed, dxfattribs={"layer": layer})

    def line(self, a, b, layer):
        self.msp.add_line(a, b, dxfattribs={"layer": layer})

    def circle(self, c, r, layer):
        self.msp.add_circle(c, r, dxfattribs={"layer": layer})

    def arc(self, c, r, a0, a1, layer):
        self.msp.add_arc(c, r, a0, a1, dxfattribs={"layer": layer})

    def hatch(self, pts, layer="ハッチング", pattern="ANSI31", scale=1.0, angle=0.0, solid=False, color=None):
        attrs = {"layer": layer}
        if color is not None:
            attrs["color"] = color
        h = self.msp.add_hatch(dxfattribs=attrs)
        if solid:
            h.set_solid_fill(color=color if color is not None else 7)
        else:
            h.set_pattern_fill(pattern, scale=scale * self.S / 2.0, angle=angle)
        h.paths.add_polyline_path(pts, is_closed=True)

    def text(self, s, pos, size_mm, align="MIDDLE_CENTER", layer="文字", rot=0.0):
        hh = self.h(size_mm)
        t = self.msp.add_text(s, height=hh, rotation=rot, dxfattribs={"layer": layer, "style": "JP"})
        t.set_placement(pos, align=TextEntityAlignment[align])
        # 文字幅の概算（全角 1.36, 半角 0.72 × 字高）で外接矩形を記録
        w = sum(hh * (1.36 if ord(c) > 0x2E7F else 0.72) for c in s)
        ax, ay = pos
        if "LEFT" in align:
            x0 = ax
        elif "RIGHT" in align:
            x0 = ax - w
        else:
            x0 = ax - w / 2
        if "TOP" in align:
            y0 = ay - hh
        elif "BOTTOM" in align:
            y0 = ay
        else:
            y0 = ay - hh / 2
        if abs(rot) < 1e-6:
            self.text_boxes.append((s, x0, y0, x0 + w, y0 + hh))
        return t

    def ptext(self, s, px, py, size_mm, align="MIDDLE_LEFT", layer="文字"):
        return self.text(s, self.P(px, py), size_mm, align, layer)

    def dim(self, p1, p2, base, angle=0.0, text="<>"):
        d = self.msp.add_linear_dim(base=base, p1=p1, p2=p2, angle=angle, dimstyle="JIS",
                                    text=text, dxfattribs={"layer": "寸法"})
        d.render()
        return d

    def balloon(self, num, target, at, r_mm=3.2):
        """番号付き風船と引出線。target は指す点、at は風船の中心（モデル座標）。"""
        r = self.h(r_mm)
        self.circle(at, r, "引出線")
        dx, dy = target[0] - at[0], target[1] - at[1]
        L = math.hypot(dx, dy)
        if L > r:
            self.line((at[0] + dx / L * r, at[1] + dy / L * r), target, "引出線")
        self.circle(target, self.h(0.5), "引出線")
        self.hatch(circle_pts(target[0], target[1], self.h(0.5), 12), solid=True, color=7, layer="引出線")
        self.text(str(num), at, 3.0)

    def label(self, s, target, at, size_mm=2.8, side="LEFT"):
        """引出線つき文字。at は文字の基点（下線の始点）。"""
        hh = self.h(size_mm)
        w = sum(hh * (1.36 if ord(c) > 0x2E7F else 0.72) for c in s) + self.h(1.0)
        if side == "LEFT":   # 文字は at から右へ
            self.line(at, (at[0] + w, at[1]), "引出線")
            self.text(s, (at[0] + self.h(0.5), at[1] + self.h(0.8)), size_mm, "BOTTOM_LEFT")
        else:
            self.line(at, (at[0] - w, at[1]), "引出線")
            self.text(s, (at[0] - self.h(0.5), at[1] + self.h(0.8)), size_mm, "BOTTOM_RIGHT")
        self.line(at, target, "引出線")
        self.circle(target, self.h(0.45), "引出線")

    # --- 図枠・表題欄
    def frame(self, notes, extra_rows=None):
        P = self.P
        self.pl([P(0, 0), P(A2[0], 0), P(*A2), P(0, A2[1])], "表題", closed=True)
        fx0, fy0, fx1, fy1 = 20.0, 10.0, A2[0] - 10.0, A2[1] - 10.0
        self.pl([P(fx0, fy0), P(fx1, fy0), P(fx1, fy1), P(fx0, fy1)], "枠", closed=True)
        # 区分記号（A–D, 1–8）
        cols, rows = 8, 4
        for i in range(cols):
            x = fx0 + (fx1 - fx0) * (i + 0.5) / cols
            for yy in (fy0 - 4.5, fy1 + 4.5):
                self.ptext(str(i + 1), x, yy, 3.0, "MIDDLE_CENTER")
            if i:
                xx = fx0 + (fx1 - fx0) * i / cols
                self.line(P(xx, fy0), P(xx, fy0 - 3), "表題")
                self.line(P(xx, fy1), P(xx, fy1 + 3), "表題")
        for j in range(rows):
            y = fy0 + (fy1 - fy0) * (j + 0.5) / rows
            ch = "DCBA"[j]
            self.ptext(ch, fx0 - 5.0, y, 3.0, "MIDDLE_CENTER")
            self.ptext(ch, fx1 + 5.0, y, 3.0, "MIDDLE_CENTER")
            if j:
                yy = fy0 + (fy1 - fy0) * j / rows
                self.line(P(fx0, yy), P(fx0 - 3, yy), "表題")
                self.line(P(fx1, yy), P(fx1 + 3, yy), "表題")
        # 中心マーク
        for a, b in (((A2[0] / 2, 0), (A2[0] / 2, fy0)), ((A2[0] / 2, fy1), (A2[0] / 2, A2[1])),
                     ((0, A2[1] / 2), (fx0, A2[1] / 2)), ((fx1, A2[1] / 2), (A2[0], A2[1] / 2))):
            self.line(P(*a), P(*b), "枠")

        # 表題欄（右下 170 x 56）
        tx0, tx1 = fx1 - 170.0, fx1
        ty0, ty1 = fy0, fy0 + 56.0
        self.pl([P(tx0, ty0), P(tx1, ty0), P(tx1, ty1), P(tx0, ty1)], "枠", closed=True)
        rows_y = [ty0 + 0, ty0 + 10, ty0 + 20, ty0 + 32, ty0 + 44, ty1]
        for y in rows_y[1:-1]:
            self.line(P(tx0, y), P(tx1, y), "表題")
        lab = 22.0
        self.line(P(tx0 + lab, ty0 + 20), P(tx0 + lab, ty1), "表題")
        # 下 2 段は 4 分割
        for k in range(1, 4):
            x = tx0 + 42.5 * k
            self.line(P(x, ty0), P(x, ty0 + 20), "表題")
        self.ptext("名 称", tx0 + 3, ty0 + 50, 3.0)
        self.ptext(TITLE, tx0 + lab + 3, ty0 + 50, 3.5)
        self.ptext("図 名", tx0 + 3, ty0 + 38, 3.0)
        self.ptext(self.title, tx0 + lab + 3, ty0 + 38, 5.0)
        self.ptext("備 考", tx0 + 3, ty0 + 26, 3.0)
        self.ptext("架空の船のイメージ（実在の船の図面ではない）", tx0 + lab + 3, ty0 + 26, 3.0)
        cells_top = [("縮尺", f"1:{int(self.S)}" if extra_rows is None else extra_rows), ("単位", "mm"),
                     ("用紙", "A2"), ("図番", f"PS-{self.number:03d}")]
        cells_bot = [("作成日", DATE), ("改訂", "0"), ("作図", "ship_shape.py"), ("枚数", f"{self.number}/3")]
        for k, (a, b) in enumerate(cells_top):
            x = tx0 + 42.5 * k
            self.ptext(a, x + 2, ty0 + 17, 2.2)
            self.ptext(b, x + 21.25, ty0 + 12.8, 3.5 if len(b) < 9 else 2.6, "MIDDLE_CENTER")
        for k, (a, b) in enumerate(cells_bot):
            x = tx0 + 42.5 * k
            self.ptext(a, x + 2, ty0 + 7, 2.2)
            self.ptext(b, x + 21.25, ty0 + 2.8, 3.0 if len(b) < 11 else 2.5, "MIDDLE_CENTER")

        # 特記事項（表題欄の上）
        nx0, ny0 = tx0, ty1 + 4.0
        lh = 5.2
        height = lh * (len(notes) + 1) + 4
        self.pl([P(nx0, ny0), P(tx1, ny0), P(tx1, ny0 + height), P(nx0, ny0 + height)], "表題", closed=True)
        self.ptext("特記事項", nx0 + 3, ny0 + height - 4.5, 3.5)
        for i, n in enumerate(notes):
            self.ptext(n, nx0 + 3, ny0 + height - 4.5 - lh * (i + 1), 2.6)
        return (tx0, ny0 + height)   # 表題欄＋特記事項の左上

    def scale_bar(self, px, py, meters, step):
        """縮尺バー（紙面位置 px, py）。"""
        P = self.P
        L = meters * 1000.0 / self.S   # 紙上 mm
        hgt = 2.0
        n = int(meters / step)
        for i in range(n):
            x0 = px + L * i / n
            x1 = px + L * (i + 1) / n
            pts = [P(x0, py), P(x1, py), P(x1, py + hgt), P(x0, py + hgt)]
            self.pl(pts, "表題", closed=True)
            if i % 2 == 0:
                self.hatch(pts, solid=True, color=7, layer="表題")
        for i in range(n + 1):
            self.ptext(f"{int(step * i)}", px + L * i / n, py - 2.5, 2.2, "MIDDLE_CENTER")
        self.ptext("m", px + L + 4, py - 2.5, 2.2, "MIDDLE_CENTER")
        self.ptext(f"S=1:{int(self.S)}", px, py + hgt + 3.5, 2.5, "MIDDLE_LEFT")

    def table(self, px, py, title, rows, col_w=(40.0, 28.0), lh=5.0, align2="RIGHT"):
        """左上 (px, py) から下へ伸びる表。"""
        P = self.P
        w = sum(col_w)
        h = lh * (len(rows) + 1)
        self.pl([P(px, py), P(px + w, py), P(px + w, py - h), P(px, py - h)], "表題", closed=True)
        self.line(P(px, py - lh), P(px + w, py - lh), "表題")
        self.line(P(px + col_w[0], py - lh), P(px + col_w[0], py - h), "表題")
        self.ptext(title, px + w / 2, py - lh / 2, 3.0, "MIDDLE_CENTER")
        for i, (a, b) in enumerate(rows):
            y = py - lh * (i + 1.5)
            if align2 == "LEFT":
                self.ptext(a, px + col_w[0] / 2, y, 2.5, "MIDDLE_CENTER")
                self.ptext(b, px + col_w[0] + 2, y, 2.5)
            else:
                self.ptext(a, px + 2, y, 2.5)
                self.ptext(b, px + w - 2, y, 2.5, "MIDDLE_RIGHT")
            if i:
                self.line(P(px, py - lh * (i + 1)), P(px + w, py - lh * (i + 1)), "細部")
        return h

    def check_overlaps(self):
        bad = []
        b = self.text_boxes
        for i in range(len(b)):
            for j in range(i + 1, len(b)):
                s1, a0, a1, a2, a3 = b[i]
                s2, c0, c1, c2, c3 = b[j]
                if a0 < c2 and c0 < a2 and a1 < c3 and c1 < a3 and {s1, s2} != {"C", "L"}:
                    bad.append((s1, s2))
        return bad

    def save(self):
        os.makedirs(OUT, exist_ok=True)
        path = os.path.join(OUT, self.name + ".dxf")
        self.doc.set_modelspace_vport(height=A2[1] * self.S * 1.05,
                                      center=self.P(A2[0] / 2, A2[1] / 2))
        self.doc.saveas(path)
        return path


# ====================================================================== 共通の形
def hull_profile():
    """側面の船体輪郭（閉じた多角形, (x, z)）。"""
    pts = [(S.stern_x(0.0), 0.0)]
    pts += [(S.stem_x(0.0) + 0, 0.0)]
    zf = S.FORECASTLE_Z + S.BULWARK_H
    for i in range(1, 41):
        z = zf * i / 40
        pts.append((S.stem_x(z), z))
    xa, xb = S.stern_x(S.RAIL_TOP_Z), S.stem_x(zf)
    for i in range(1, 160):
        x = xb - (xb - xa) * i / 160
        pts.append((x, S.rail_z(x)))
    for i in range(0, 31):
        z = S.RAIL_TOP_Z * (1 - i / 30)
        pts.append((S.stern_x(z), z))
    return pts


def front_silhouette(dz=100.0):
    """正面（船尾）方向から見た船体の外形の半幅 [(b, z)]、下から上へ。"""
    out = []
    z = S.KEEL_DEPTH
    while z <= S.RAIL_TOP_Z + 1:
        xa, xb = S.stern_x(z), S.stem_x(z)
        best = 0.0
        for i in range(81):
            x = xa + (xb - xa) * i / 80
            if S.rail_z(x) + 1 < z:
                continue
            b = S.halfbreadth(x, z)
            if b and b > best:
                best = b
        out.append((best, z))
        z += dz
    return out


def deck_visible_ranges():
    """平面図で見える甲板の x 範囲。"""
    xs = S.stern_x(S.RAIL_TOP_Z)
    xf = S.stem_x(S.FORECASTLE_Z + S.BULWARK_H)
    return {
        "poop": (xs, S.POOP_FWD_X),
        "quarter": (S.POOP_FWD_X, S.QD_FWD_X),
        "main": (S.QD_FWD_X, S.FC_AFT_X),
        "forecastle": (S.FC_AFT_X, xf),
    }


def rail_inner(x):
    z = S.rail_z(x)
    b = S.halfbreadth(x, z)
    return None if b is None else b - S.BULWARK_T


# ====================================================================== 1. 甲板平面図
def sheet_plan():
    scale = 100.0
    # 紙の左下をモデル座標 (-6900, -25500) に置く → 中心線 y=0 は紙面 y=255mm
    sh = Sheet("01_甲板平面図", "甲板平面図", scale, (-6900.0, -25500.0), 1)
    P = sh.P

    # --- 外形（最大幅）
    outline = S.plan_outline(200)
    port = [(x, y) for x, y in outline]
    star = [(x, -y) for x, y in reversed(outline)]
    sh.pl(port + star, "外形", closed=True)

    # --- 手すり（外・内）
    rail = S.rail_line(240)
    sh.pl([(x, y) for x, y, z in rail], "外形")
    sh.pl([(x, -y) for x, y, z in rail], "外形")
    inner = [(x, max(y - S.BULWARK_T, 0)) for x, y, z in rail]
    sh.pl(inner, "細部")
    sh.pl([(x, -y) for x, y in inner], "細部")
    # 船尾の手すり（トランサム上端）
    xr = rail[0][0]
    sh.line((xr, rail[0][1]), (xr, -rail[0][1]), "外形")
    sh.line((xr + S.BULWARK_T, inner[0][1]), (xr + S.BULWARK_T, -inner[0][1]), "細部")

    # --- 甲板の段（胸壁の手すり）
    for xb in (S.POOP_FWD_X, S.QD_FWD_X, S.FC_AFT_X):
        b = rail_inner(xb)
        for dx in (0.0, 200.0 if xb != S.FC_AFT_X else -200.0):
            sh.line((xb + dx, b), (xb + dx, -b), "外形" if dx == 0 else "細部")
        # 手すり子
        n = int(2 * b / 450)
        for i in range(1, n):
            y = -b + 2 * b * i / n
            x2 = xb + (200.0 if xb != S.FC_AFT_X else -200.0)
            sh.line((xb, y), (x2, y), "甲板板")

    # --- 障害物（甲板板を切る）
    obstacles = []   # (x0, x1, y0, y1, deck)
    for name, x0, x1, hb, deck in S.HATCHES:
        obstacles.append((x0, x1, -hb, hb, deck))
    for mname in S.MAST_ORDER:
        m = S.MASTS[mname]
        r = m["lower"][2] / 2 + 250
        deck = {"fore": "forecastle", "main": "main", "mizzen": "quarter"}[mname]
        obstacles.append((m["x"] - r, m["x"] + r, -r, r, deck))
    cx, cr = S.CAPSTAN
    obstacles.append((cx - cr - 50, cx + cr + 50, -cr - 50, cr + 50, "main"))
    bx, br = S.BINNACLE
    obstacles.append((bx - br, bx + br, -br, br, "quarter"))
    blx, blr = S.BELFRY
    obstacles.append((blx - blr, blx + blr, -blr * 1.4, blr * 1.4, "forecastle"))
    for xt, xbm, yc, w in S.LADDERS:
        deck_l = "main" if xt in (S.QD_FWD_X, S.FC_AFT_X) else "quarter"
        obstacles.append((min(xt, xbm), max(xt, xbm), yc - w / 2, yc + w / 2, deck_l))
    gun_boxes = []
    for g in S.guns():
        if g["tier"] == "lower":
            continue
        deck = "main" if g["tier"] == "upper" else "quarter"
        L, W, H = S.CARRIAGE
        yi = rail_inner(g["x"])
        y_in = g["side"] * (yi - 150 - L)
        y_out = g["side"] * (yi - 150)
        gun_boxes.append((g, y_in, y_out))
        obstacles.append((g["x"] - W / 2, g["x"] + W / 2, min(y_in, y_out), max(y_in, y_out), deck))

    # --- 甲板板（中心線に平行、300 mm ピッチ）
    ranges = deck_visible_ranges()
    pitch = 300.0
    for deck, (xa, xb) in ranges.items():
        xa2 = xa + (S.BULWARK_T + 60 if deck == "poop" else 210.0)
        xb2 = xb - (0.0 if deck == "forecastle" else 10.0)
        if deck == "main":
            xa2, xb2 = xa + 210.0, xb - 210.0
        if deck == "forecastle":
            xa2 = xa + 10.0
        k = 0
        while True:
            y = (k + 0.5) * pitch
            got = False
            for sgn in (1, -1):
                yy = sgn * y
                # 舷墻内側までの x 範囲を探す
                xs_in = []
                n = 240
                for i in range(n + 1):
                    x = xa2 + (xb2 - xa2) * i / n
                    b = rail_inner(x)
                    if b is not None and b - 60 > y:
                        xs_in.append(x)
                if not xs_in:
                    continue
                got = True
                x0, x1 = min(xs_in), max(xs_in)
                cuts = [(o[0], o[1]) for o in obstacles if o[4] == deck and o[2] - 40 < yy < o[3] + 40]
                for s0, s1 in interval_minus(x0, x1, cuts):
                    sh.line((s0, yy), (s1, yy), "甲板板")
            if not got:
                break
            k += 1

    # --- 倉口・天窓（格子）
    for name, x0, x1, hb, deck in S.HATCHES:
        sh.pl(rect(x0, -hb, x1, hb), "外形", closed=True)
        sh.pl(rect(x0 + 120, -hb + 120, x1 - 120, hb - 120), "細部", closed=True)
        g = 220.0
        x = x0 + 120 + g
        while x < x1 - 120:
            sh.line((x, -hb + 120), (x, hb - 120), "甲板板")
            x += g
        y = -hb + 120 + g
        while y < hb - 120:
            sh.line((x0 + 120, y), (x1 - 120, y), "甲板板")
            y += g

    # --- マスト
    for mname in S.MAST_ORDER:
        m = S.MASTS[mname]
        r = m["lower"][2] / 2
        sh.circle((m["x"], 0), r, "外形")
        sh.circle((m["x"], 0), r + 250, "細部")    # マストの帯（パートナー）
        sh.line((m["x"] - r - 450, 0), (m["x"] + r + 450, 0), "細部")

    # --- 車地（キャプスタン）・羅針箱・鐘楼
    sh.circle((cx, 0), cr, "外形")
    sh.circle((cx, 0), cr * 0.55, "細部")
    for i in range(8):
        a = math.pi * 2 * i / 8
        sh.line((cx + cr * 0.55 * math.cos(a), cr * 0.55 * math.sin(a)),
                (cx + cr * math.cos(a), cr * math.sin(a)), "細部")
    sh.pl(rect(bx - br, -br, bx + br, br), "外形", closed=True)
    sh.circle((bx, 0), br * 0.6, "細部")
    sh.pl(rect(blx - blr, -blr * 1.4, blx + blr, blr * 1.4), "外形", closed=True)
    sh.circle((blx, 0), blr * 0.6, "細部")

    # --- はしご
    for xt, xbm, yc, w in S.LADDERS:
        x0, x1 = min(xt, xbm), max(xt, xbm)
        sh.pl(rect(x0, yc - w / 2, x1, yc + w / 2), "外形", closed=True)
        n = int((x1 - x0) / 250)
        for i in range(1, n):
            x = x0 + (x1 - x0) * i / n
            sh.line((x, yc - w / 2), (x, yc + w / 2), "細部")

    # --- 大砲（上甲板・後甲板）と下甲板の砲口
    L, W, H = S.CARRIAGE
    for g, y_in, y_out in gun_boxes:
        x = g["x"]
        sh.pl(rect(x - W / 2, min(y_in, y_out), x + W / 2, max(y_in, y_out)), "外形", closed=True)
        y_axle = y_in + (y_out - y_in) * 0.75
        sh.line((x - W / 2 - 80, y_axle), (x + W / 2 + 80, y_axle), "細部")
        b_out = g["side"] * (S.halfbreadth(x, g["port_z"]) + 500.0)
        b_in = y_in + g["side"] * 150.0
        r0, r1 = S.BARREL_R
        sh.pl(tapered_spar((x, b_in), (x, b_out), 2 * r0 * 0.85, 2 * r1 * 0.85), "外形", closed=True)
        # 砲門（舷墻の切れ目）
        pw = g["port"]
        yo = g["side"] * (rail_inner(x) + S.BULWARK_T)
        yi2 = g["side"] * rail_inner(x)
        sh.line((x - pw / 2, yi2), (x - pw / 2, yo), "細部")
        sh.line((x + pw / 2, yi2), (x + pw / 2, yo), "細部")
    for g in S.guns():
        if g["tier"] != "lower":
            continue
        x = g["x"]
        b = S.halfbreadth(x, g["port_z"])
        sl = S.hull_slope(x, g["port_z"])
        y0 = g["side"] * (b - 50)
        y1 = g["side"] * (b + 650)
        r1 = S.BARREL_R[1]
        sh.pl(rect(x - r1 + sl * 0, min(y0, y1), x + r1, max(y0, y1)), "細部", closed=True)

    # --- 張出し板（チャンネル）と三つ目滑車
    for name, x0, x1, cz, cw in S.CHANNELS:
        for side in (1, -1):
            pts = []
            for i in range(21):
                x = x0 + (x1 - x0) * i / 20
                b = S.halfbreadth(x, cz) or 0
                pts.append((x, side * b))
            outer = [(x, side * (abs(y) + cw)) for x, y in reversed(pts)]
            sh.pl(pts + outer, "外形", closed=True)
    for p0, p1, kind in S.shrouds():
        if kind == "shroud":
            sh.circle((p0[0], p0[1]), 150.0, "細部")

    # --- 船尾回廊（クォーター・ギャラリー）・角灯
    qx0, qx1, qz0, qz1, qo = S.QUARTER_GALLERY
    for side in (1, -1):
        pts = []
        for i in range(13):
            x = qx0 + (qx1 - qx0) * i / 12
            pts.append((x, side * (S.halfbreadth(x, qz0 + 1200) or 0)))
        bulge = []
        for i in range(13):
            x = qx1 - (qx1 - qx0) * i / 12
            t = i / 12
            b = S.halfbreadth(x, qz0 + 1200) or 0
            bulge.append((x, side * (b + qo * math.sin(math.pi * t) ** 0.6)))
        sh.pl(pts + bulge, "外形", closed=True)
    for y, k in S.LANTERNS:
        lx, ly, lz = S.lantern_base(y)
        r = S.LANTERN_R * k
        sh.pl(circle_pts(lx, ly, r, 6), "外形", closed=True)
        sh.circle((lx, ly), r * 0.45, "細部")

    # --- 船首: ビークヘッド・船首像・第一斜檣
    xs0 = S.stem_x(S.BEAK_Z)
    beak = [(x, S.beak_halfwidth(x)) for x in [xs0 + (S.BEAK_TIP_X - xs0) * i / 20 for i in range(21)]]
    sh.pl(beak + [(x, -y) for x, y in reversed(beak)], "外形", closed=True)
    for i in range(1, 6):   # 格子
        f = i / 6
        sh.pl([(x, y * f) for x, y in beak], "甲板板")
        sh.pl([(x, -y * f) for x, y in beak], "甲板板")
    fx, fz = S.FIGUREHEAD
    sh.pl([(S.BEAK_TIP_X - 200, 260), (fx - 150, 330), (fx + 350, 150), (fx + 450, 0), (fx + 350, -150),
           (fx - 150, -330), (S.BEAK_TIP_X - 200, -260)], "外形", closed=True)
    hx, hz = S.BOWSPRIT_HEEL
    tx, tz = S.bowsprit_point(1.0)
    d0, d1 = S.BOWSPRIT_D
    sh.pl(tapered_spar((hx, 0), (tx, 0), d0, d1), "外形", closed=True)

    # --- 帆桁（想像線, 35° 転桁）
    for mast, tier, z, half, d in S.YARDS:
        p, q = S.yard_ends(mast, z, half)
        sh.line((p[0], p[1]), (q[0], q[1]), "想像線")
    p, q = S.sprit_yard_ends()
    sh.line((p[0], p[1]), (q[0], q[1]), "想像線")
    (lx0, lz0), (lx1, lz1), _ = S.LATEEN_YARD
    sh.line((lx0, S.LATEEN_Y), (lx1, S.LATEEN_Y), "想像線")

    # --- 舵
    rz = S.RUDDER_TOP_Z
    rx = S.stern_x(rz)
    sh.pl(rect(rx - 600, -150, rx, 150), "かくれ線", closed=True)

    # --- 中心線
    xa, xb = -3800.0, 48800.0
    sh.line((xa, 0), (xb, 0), "中心線")
    for x in (xa - 500, xb + 500):
        sh.text("C", (x - 120, 0), 4.0)
        sh.text("L", (x + 120, -200), 4.0)

    # --- 方向
    sh.text("船首 →", P(330, 362), 3.5, "MIDDLE_LEFT")
    sh.text("左　舷", (-2600, 7500), 3.5)
    sh.text("右　舷", (-2600, -7500), 3.5)

    # --- 寸法（右舷側の下）
    e = S.extents()
    ylo = -11800.0
    xs_stern, xs_stem = S.stern_x(S.RAIL_TOP_Z), S.stem_x(S.FORECASTLE_Z + S.BULWARK_H)
    chain = [xs_stern, S.MASTS["mizzen"]["x"], S.MASTS["main"]["x"], S.MASTS["fore"]["x"], xs_stem]
    for a, b in zip(chain, chain[1:]):
        sh.dim((a, -6600), (b, -6600), (0, ylo))
    sh.dim((xs_stern, -3600), (xs_stem, -3600), (0, ylo - 1300), text="船体長 <>")
    sh.dim((e["x_aft"], -2000), (e["x_fwd"], -2000), (0, ylo - 2600), text="全長（第一斜檣を含む） <>")
    sh.dim((15000, -S.HALF_BEAM), (15000, S.HALF_BEAM), (15000, 0), angle=90, text="型幅 <>")

    # --- 風船（名称）
    items = [
        (1, (fx + 300, 0), (fx + 1500, 2900), "船首像"),
        (2, ((hx + tx) / 2, 0), ((hx + tx) / 2 + 400, 3600), "第一斜檣"),
        (3, (35600, 1400), (37600, 6500), "船首楼甲板"),
        (4, (blx, 0), (blx + 1800, 2600), "鐘楼"),
        (5, (S.MASTS["fore"]["x"], 400), (33800, 8200), "前檣"),
        (6, (27500, 700), (27500, 7600), "前倉口"),
        (7, (23700, 900), (24500, 7600), "大倉口"),
        (8, (S.MASTS["main"]["x"], 450), (21800, 11300), "大檣"),
        (9, (cx, 500), (18200, 7600), "車地（キャプスタン）"),
        (10, (16300, 2300), (16000, 9300), "はしご"),
        (11, (12000, 3000), (13000, 7900), "後甲板"),
        (12, (S.MASTS["mizzen"]["x"], 320), (10500, 9500), "後檣"),
        (13, (bx, 0), (8800, 7700), "羅針箱"),
        (14, (4200, 900), (5200, 8200), "天窓"),
        (15, (2600, 2500), (3500, 9800), "船尾楼甲板"),
        (16, S.lantern_base(2500)[:2], (300, 7600), "角灯"),
        (17, (2900, 4900), (1500, 9600), "船尾回廊"),
        (18, (20500, -6100), (20500, -9300), "張出し板"),
        (19, (23400, -4700), (23000, -8300), "大砲（上甲板）"),
        (20, (25900, -5900), (26400, -9100), "砲口（下甲板）"),
        (21, (28600, -6000), (29400, -8300), "帆桁（想像線）"),
    ]
    for num, target, at, name in items:
        sh.balloon(num, target, at)

    # --- 図名
    sh.text("甲板平面図", P(30, 392), 7.0, "MIDDLE_LEFT")
    sh.text("S=1:100", P(84, 392), 5.0, "MIDDLE_LEFT")
    sh.scale_bar(30, 372, 10, 1)

    notes = [
        "1. 本図は架空の船のイメージで、実在の船の図面ではない。",
        "2. 寸法の単位は mm。寸法は形状モジュール ship_shape.py で定める。",
        "3. 船の中心線を y=0 とし、実際の位置（原寸の座標）で作図。",
        "4. 帆桁は想像線で、左舷開き 35° に転桁した位置を示す。",
        "5. 上部の甲板を表示。甲板板の目地は 300 mm 間隔。",
    ]
    tl = sh.frame(notes)
    # 名称表（左下）
    rows = [(f"{n}", name) for n, _, _, name in items]
    half = (len(rows) + 1) // 2
    sh.table(24, 98, "名　称", [(a, b) for a, b in rows[:half]], col_w=(9.0, 50.0), align2="LEFT")
    sh.table(86, 98, "名　称", [(a, b) for a, b in rows[half:]], col_w=(9.0, 50.0), align2="LEFT")
    return sh


# ====================================================================== 2. 側面図（帆装図）
def side_elements():
    """側面図の要素を (層, 点列, 閉, 種類) で返す。座標は (x, z)。"""
    E = []

    def add(layer, pts, closed=False, kind=""):
        E.append((layer, pts, closed, kind))

    prof = hull_profile()
    add("外形", prof, True, "hull")
    # 竜骨ラベット・船首材/船尾材の内側線
    add("細部", [(S.KEEL_AFT_X - 0.29 * S.KEEL_DEPTH, S.KEEL_DEPTH), (S.KEEL_FWD_X + 300, S.KEEL_DEPTH)])
    add("細部", [(S.stem_x(z) - 420, z) for z in [S.KEEL_DEPTH + i * 200 for i in range(int((S.FORECASTLE_Z) / 200))]])
    add("細部", [(S.stern_x(z) + 380, z) for z in [S.KEEL_DEPTH + i * 200 for i in range(int((5200 - S.KEEL_DEPTH) / 200) + 1)]])
    # 甲板線（かくれ線）
    for name, jp, xa, xb, zf in S.DECKS:
        lo = max(xa, S.stern_x(zf(0.0)) + 200)
        hi = min(xb, S.stem_x(zf(min(xb, 38000.0))) - 200)
        pts = [(lo + (hi - lo) * i / 60, zf(lo + (hi - lo) * i / 60)) for i in range(61)]
        add("かくれ線", pts)
    xs = [S.stern_x(S.GUN_DECK_Z) + 300, S.stem_x(S.GUN_DECK_Z) - 300]
    add("かくれ線", [(xs[0], S.GUN_DECK_Z), (xs[1], S.GUN_DECK_Z)])
    # 腰板（ウェール）
    for base, w in S.WALES:
        xa = S.stern_x(base + w) + 50
        xb = S.stem_x(base) - 60
        top = [(xa + (xb - xa) * i / 80, S.wale_z(xa + (xb - xa) * i / 80, base) + w) for i in range(81)]
        bot = [(x, z - w) for x, z in reversed(top)]
        add("外形", top + bot, True, "wale")
    # 砲門
    for g in S.guns():
        if g["side"] != -1:
            continue
        x, z, p = g["x"], g["port_z"], g["port"]
        add("外形", rect(x - p / 2, z - p / 2, x + p / 2, z + p / 2), True, "port")
        add("細部", circle_pts(x, z, S.BARREL_R[1], 16), True)
    # 張出し板と鎖板
    for name, x0, x1, cz, cw in S.CHANNELS:
        add("外形", rect(x0, cz - 120, x1, cz + 120), True)
    for p0, p1, kind in S.shrouds():
        if kind == "shroud" and p0[1] < 0:
            x, z = p0[0], p0[2]
            add("細部", circle_pts(x, z, 150.0, 12), True)
            add("細部", [(x, z - 150), (x - 150, z - 1500)])
    # 船尾回廊
    qx0, qx1, qz0, qz1, qo = S.QUARTER_GALLERY
    add("外形", [(qx0, qz0), (qx1, qz0), (qx1 - 200, qz1 - 500), (qx0 + 1300, qz1), (qx0 - 300, qz1 - 500)], True)
    for i in range(3):
        wx = qx0 + 350 + i * 750
        add("細部", rect(wx, qz0 + 700, wx + 500, qz0 + 1700), True)
    add("細部", [(qx0 - 150, qz0 + 2100), (qx1 - 150, qz0 + 2100)])
    # 舵
    add("外形", S.rudder_profile(), True)
    # 船首の飾り材・ビークヘッド・船首像
    knee = S.head_knee_profile()
    add("外形", knee)
    add("外形", [(x + 380, z - 500) for x, z in knee[6:]])
    xs0 = S.stem_x(S.BEAK_Z)
    add("外形", [(xs0, S.BEAK_Z), (S.BEAK_TIP_X, S.BEAK_Z)])
    for k, dz in enumerate((700.0, 1300.0)):
        pts = [(xs0 + (S.BEAK_TIP_X - xs0) * i / 20,
                S.BEAK_Z + dz * (1 - (i / 20) ** 1.5) + 200 * (i / 20)) for i in range(21)]
        add("細部", pts)
    fx, fz = S.FIGUREHEAD
    add("外形", [(S.BEAK_TIP_X - 300, S.BEAK_Z - 400), (fx + 300, fz - 600), (fx + 650, fz + 50),
                 (fx + 450, fz + 650), (fx - 100, fz + 900), (fx - 400, fz + 400), (S.BEAK_TIP_X - 300, S.BEAK_Z + 100)], True)
    # 船尾の角灯
    lx, ly, lz = S.lantern_base(0)
    for y, k in S.LANTERNS[:1]:
        r = S.LANTERN_R * k
        hgt = S.LANTERN_H * k
        add("外形", [(lx - r, lz), (lx + r, lz), (lx + r * 1.15, lz + hgt * 0.75), (lx, lz + hgt), (lx - r * 1.15, lz + hgt * 0.75)], True)
        add("細部", [(lx, lz - 200), (lx, lz)])
    # 喫水線
    return E


def side_rig():
    """側面図の円材・帆・索具（(x, z) 投影）。"""
    spars, sails, rig = [], [], []
    for name in S.MAST_ORDER:
        m = S.MASTS[name]
        for key in ("lower", "topmast", "tgallant"):
            if not m[key]:
                continue
            z0, z1, d = m[key]
            z0 = max(z0, S.rail_z(m["x"]) - 1100) if key == "lower" else z0
            spars.append(("mast", tapered_spar((S.mast_x(name, z0), z0), (S.mast_x(name, z1), z1), d, d * 0.8)))
        tz, tr = m["top"]
        spars.append(("top", rect(S.mast_x(name, tz) - tr, tz - 200, S.mast_x(name, tz) + tr, tz + 120)))
        if m["crosstree"]:
            cz, cr = m["crosstree"]
            spars.append(("top", rect(S.mast_x(name, cz) - cr, cz - 100, S.mast_x(name, cz) + cr, cz + 60)))
        spars.append(("top", circle_pts(S.mast_x(name, m["truck"]), m["truck"] + 120, 200, 12)))
    for mast, tier, z, half, d in S.YARDS:
        p, q = S.yard_ends(mast, z, half)
        spars.append(("yard", tapered_spar((p[0], z), (q[0], z), d * 0.6, d * 0.6)))
    hx, hz = S.BOWSPRIT_HEEL
    tx, tz = S.bowsprit_point(1.0)
    spars.append(("mast", tapered_spar((hx, hz), (tx, tz), *S.BOWSPRIT_D)))
    p, q = S.sprit_yard_ends()
    spars.append(("yard", tapered_spar((p[0], p[2]), (q[0], q[2]), 200, 200)))
    (lx0, lz0), (lx1, lz1), ld = S.LATEEN_YARD
    spars.append(("yard", tapered_spar((lx0, lz0), (lx1, lz1), ld, ld * 0.6)))

    for key, corners in S.all_square_sails():
        sails.append((key, [(c[0], c[2]) for c in corners]))
    sails.append((("mizzen", "lateen"), list(S.LATEEN_SAIL)))

    for p0, p1, kind in S.shrouds() + S.stays():
        if kind in ("shroud", "topshroud", "tgshroud", "backstay") and p0[1] > 0 and p1[1] > 0:
            continue    # 左舷側は右舷側と重なるので省く
        rig.append([(p0[0], p0[2]), (p1[0], p1[2])])
    # 旗竿と旗
    mx = S.mast_x("main", S.FLAG_POLE[1])
    flag_top = S.FLAG_POLE[1] - 100
    fl, fh = S.FLAG_SIZE
    flag = rect(mx - fl, flag_top - fh, mx, flag_top)
    return spars, sails, rig, flag, (mx, S.FLAG_POLE)


def draw_sail(sh, corners, label, occl_step, clip=None, cloth_axis="x"):
    """帆の輪郭・縫い目・縮帆索を描く。label は帆の中央に置き、縫い目はそこを避ける。"""
    sh.pl(corners, "帆", closed=True)
    xs = [c[0] for c in corners]
    zs = [c[1] for c in corners]
    cxm, czm = sum(xs) / len(xs), sum(zs) / len(zs)
    hh = sh.h(2.8)
    w = sum(hh * (1.36 if ord(c) > 0x2E7F else 0.72) for c in label) + sh.h(2)
    box = rect(cxm - w / 2, czm - hh, cxm + w / 2, czm + hh)
    occ = [box] + (clip or [])
    if len(corners) == 4:
        tl, tr, br, bl = corners
        width_head = math.hypot(tr[0] - tl[0], tr[1] - tl[1])
        # 実幅に対する投影比で縫い目の本数を決める
        n = max(3, int(abs(tr[0] - tl[0]) / (S.SAIL_CLOTH * abs(math.sin(S.YARD_BRACE)) * 1.6)))
        for i in range(1, n):
            t = i / n
            a = (tl[0] + (tr[0] - tl[0]) * t, tl[1] + (tr[1] - tl[1]) * t)
            b = (bl[0] + (br[0] - bl[0]) * t, bl[1] + (br[1] - bl[1]) * t)
            for seg in clip_polyline([a, b], occ, occl_step):
                sh.pl(seg, "帆布")
        # 縮帆索（上から 1/6, 2/6）
        for t in (0.17, 0.32):
            a = (tl[0] + (bl[0] - tl[0]) * t, tl[1] + (bl[1] - tl[1]) * t)
            b = (tr[0] + (br[0] - tr[0]) * t, tr[1] + (br[1] - tr[1]) * t)
            for seg in clip_polyline([a, b], occ, occl_step):
                sh.pl(seg, "帆布")
    else:   # 三角帆: 帆桁と平行でない後縁に平行な縫い目
        a, b, c = corners
        n = 12
        for i in range(1, n):
            t = i / n
            p = (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
            q = (a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t)
            p2 = (q[0] + (p[0] - q[0]) * 1.0, q[1] + (p[1] - q[1]) * 1.0)
            # 帆桁上の点から帆の下縁へ、後縁に平行
            d = (c[0] - b[0], c[1] - b[1])
            # 線 p + s*d と 線 a-c の交点
            ex, ez = c[0] - a[0], c[1] - a[1]
            den = d[0] * ez - d[1] * ex
            if abs(den) < 1e-9:
                continue
            s = ((a[0] - p[0]) * ez - (a[1] - p[1]) * ex) / den
            q2 = (p[0] + s * d[0], p[1] + s * d[1])
            for seg in clip_polyline([p, q2], occ, occl_step):
                sh.pl(seg, "帆布")
    sh.text(label, (cxm, czm), 2.8, "MIDDLE_CENTER")
    return box


def sheet_side():
    scale = 150.0
    # 紙面 (60, 95) をモデル (x=0, z=0) に
    sh = Sheet("02_側面図_帆装図", "側面図（帆装図）", scale, (-95 * scale, -100 * scale), 2)
    P = sh.P
    E = side_elements()
    spars, sails, rig, flag, (fmx, (fp0, fp1)) = side_rig()

    sail_polys = [corners for _, corners in sails]
    step = sh.h(0.4)
    # 船体
    for layer, pts, closed, kind in E:
        sh.pl(pts, layer, closed)
        if kind == "wale":
            sh.hatch(pts, solid=True, color=8)
        if kind == "port":
            sh.hatch(pts, solid=True, color=250)
    # 円材（帆に隠れる部分を除く）
    for kind, poly in spars:
        if kind == "yard":
            sh.pl(poly, "外形", closed=True)
            continue
        pts = poly + [poly[0]]
        for seg in clip_polyline(pts, sail_polys, step):
            sh.pl(seg, "外形")
    # 帆
    for key, corners in sails:
        draw_sail(sh, corners, S.SAIL_JP[key], step)
    # 索具（帆の上に描く）
    for seg in rig:
        sh.pl(seg, "索具")
    # 旗竿・旗（ドクロ）
    sh.line((fmx, fp0), (fmx, fp1), "外形")
    sh.pl(flag, "外形", closed=True)
    fx0, fz0 = flag[0]
    fl, fh = S.FLAG_SIZE
    cxs, czs = fx0 + fl * 0.5, fz0 + fh * 0.58
    sh.circle((cxs, czs), fh * 0.2, "細部")
    for sgn in (1, -1):
        sh.line((cxs - fl * 0.22, czs - fh * 0.38 * 1.0 + 0), (cxs + fl * 0.22, czs - fh * 0.08), "細部") if sgn == 1 else \
            sh.line((cxs - fl * 0.22, czs - fh * 0.08), (cxs + fl * 0.22, czs - fh * 0.38), "細部")
    # 長旗（前檣・後檣）
    for name in ("fore", "mizzen"):
        m = S.MASTS[name]
        x, z = S.mast_x(name, m["truck"]), m["truck"] + 300
        sh.pl([(x, z), (x - 4200, z - 250), (x, z - 500)], "細部", closed=True)

    # 喫水線
    xw0, xw1 = S.stern_x(S.DRAFT), S.stem_x(S.DRAFT)
    sh.line((xw0 - 3000, S.DRAFT), (xw1 + 3000, S.DRAFT), "喫水線")
    tri = [(xw1 + 2300, S.DRAFT), (xw1 + 2000, S.DRAFT + 500), (xw1 + 2600, S.DRAFT + 500)]
    sh.pl(tri, "喫水線", closed=True)
    sh.text("DWL", (xw1 + 3200, S.DRAFT + 380), 2.5, "MIDDLE_LEFT")
    sh.line((-3000, 0), (S.stem_x(0) + 2500, 0), "中心線")
    sh.text("BL", (S.stem_x(0) + 3200, 380), 2.5, "MIDDLE_LEFT")

    # 寸法
    e = S.extents()
    sh.dim((e["x_aft"], 0), (e["x_fwd"], 0), (0, -4800), text="全長（第一斜檣を含む） <>")
    xs_stern, xs_stem = S.stern_x(S.RAIL_TOP_Z), S.stem_x(S.FORECASTLE_Z + S.BULWARK_H)
    chain = [xs_stern, S.MASTS["mizzen"]["x"], S.MASTS["main"]["x"], S.MASTS["fore"]["x"], xs_stem]
    for a, b in zip(chain, chain[1:]):
        sh.dim((a, 0), (b, 0), (0, -2600))
    # 高さ（船尾側, 縦）
    xv = -5000.0
    sh.dim((S.stern_x(0), 0), (S.stern_x(S.DRAFT), S.DRAFT), (xv, 0), angle=90, text="喫水 <>")
    sh.dim((S.stern_x(S.DRAFT), S.DRAFT), (S.stern_x(S.RAIL_TOP_Z), S.RAIL_TOP_Z), (xv, 0), angle=90)
    xv2 = -7600.0
    sh.dim((S.stern_x(0), 0), (fmx, S.MASTS["main"]["truck"]), (xv2, 0), angle=90,
           text="竜骨下面から大檣トラック <>")

    # 風船
    fx, fz = S.FIGUREHEAD
    items = [
        (1, (fx + 300, fz + 300), (fx + 2000, fz + 3500), "船首像"),
        (2, S.bowsprit_point(0.55), (S.bowsprit_point(0.55)[0] + 2600, S.bowsprit_point(0.55)[1] + 300), "第一斜檣"),
        (3, (34000, S.wale_z(34000, 5150) + 150), (41500, 5200), "腰板（ウェール）"),
        (4, (29200, S.GUN_LOWER_Z), (31500, 2300), "砲門"),
        (5, (31000, 9800), (34000, 7800), "張出し板"),
        (6, (2900, 11200), (-3200, 15800), "船尾回廊"),
        (7, (S.stern_x(4000) - 900, 4000), (-1800, 2000), "舵"),
        (8, (S.lantern_base(0)[0], S.RAIL_TOP_Z + 900), (-2600, 18200), "角灯"),
        (9, (fmx - 1200, S.FLAG_POLE[1] - 600), (fmx - 4000, 42200), "ドクロ旗"),
        (10, (S.mast_x("main", 21000) + 700, 20900), (11800, 30500), "檣楼（トップ）"),
        (11, (23300, 15500), (26500, 33000), "横静索"),
        (12, (26000, 23700), (29800, 36800), "支索"),
    ]
    for num, target, at, name in items:
        sh.balloon(num, target, at)

    sh.text("側面図（帆装図）", P(30, 392), 7.0, "MIDDLE_LEFT")
    sh.text("S=1:150", P(113, 392), 5.0, "MIDDLE_LEFT")
    sh.scale_bar(30, 372, 15, 5)

    notes = [
        "1. 本図は架空の船のイメージで、実在の船の図面ではない。",
        "2. 寸法の単位は mm。寸法は形状モジュール ship_shape.py で定める。",
        "3. 右舷側から見た図。帆桁は左舷開き 35° に転桁した状態の投影。",
        "4. 基線 BL は竜骨下面、DWL は計画喫水線。",
        "5. 左舷側の横静索は右舷側と重なるため省略。",
    ]
    tl = sh.frame(notes)
    e = S.extents()
    rows = [
        ("全長（第一斜檣含む）", f"{e['loa']:,.0f}"),
        ("船体長", f"{e['hull_length']:,.0f}"),
        ("水線長", f"{e['lwl']:,.0f}"),
        ("型幅", f"{e['beam']:,.0f}"),
        ("計画喫水", f"{e['draft']:,.0f}"),
        ("水面上の高さ（旗竿）", f"{e['air_draft']:,.0f}"),
        ("マスト", "3 本＋第一斜檣"),
        ("大砲", f"{S.GUN_COUNT} 門"),
        ("帆", f"{len(S.SQUARE_SAILS) + 2} 枚"),
    ]
    sh.table(tl[0], tl[1] + 6 + 5.0 * (len(rows) + 1), "主要目（単位 mm）", rows, col_w=(100.0, 70.0))
    names = [(f"{n}", name) for n, _, _, name in items]
    sh.table(450, 398, "名　称", names[:6], col_w=(9.0, 54.0), align2="LEFT")
    sh.table(450, 360, "名　称", names[6:], col_w=(9.0, 54.0), align2="LEFT")
    return sh


# ====================================================================== 3. 正面図・船尾図・中央横断面図
def front_views(from_bow):
    """正面図 (from_bow=True) / 船尾図 の要素を (層, 点列, 閉) で返す。座標は (u, z)。

    正面図は船首から見るので左舷が右（u = y）、船尾図は右舷が右（u = -y）。
    手前の物が奥の物を隠す（帆・船体の外形で隠線処理）。
    """
    sgn = 1.0 if from_bow else -1.0

    def U(y):
        return sgn * y

    items = []   # (深さ: 手前ほど小, 層, 点列, 閉, 隠す多角形 or None)

    def depth(x):
        return -x if from_bow else x

    # 船体の外形
    sil = front_silhouette()
    hull_poly = [(U(b), z) for b, z in sil] + [(U(-b), z) for b, z in reversed(sil)]
    hull_x = 33000.0 if from_bow else 0.0
    items.append((depth(hull_x), "外形", hull_poly, True, hull_poly))
    # 竜骨
    kw = S.KEEL_HALF_W
    items.append((depth(hull_x) - 1, "外形", rect(-kw, 0, kw, S.KEEL_DEPTH), True, None))
    # 手すり・甲板の線
    if from_bow:
        zf = S.FORECASTLE_Z + S.BULWARK_H
        b = S.halfbreadth(S.FC_AFT_X + 2000, zf)
        items.append((depth(36000), "細部", [(U(-b), zf - 150), (U(b), zf - 150)], False, None))
        for base, w in S.WALES:
            bw = max(S.halfbreadth(x, base) or 0 for x in range(15000, 25000, 500))
            # 船首方向から見ると腰板は外形の縁に沿う短い帯
        # ビークヘッドと船首像
        xs0 = S.stem_x(S.BEAK_Z)
        bh = S.beak_halfwidth(xs0)
        items.append((depth(40000), "外形", [(U(-bh), S.BEAK_Z), (U(bh), S.BEAK_Z), (U(bh * 0.4), S.BEAK_Z + 1300),
                                            (U(-bh * 0.4), S.BEAK_Z + 1300)], True, None))
        fx, fz = S.FIGUREHEAD
        fig = [(U(-450), fz - 700), (U(450), fz - 700), (U(500), fz + 300), (U(0), fz + 900), (U(-500), fz + 300)]
        items.append((depth(fx), "外形", fig, True, fig))
        # 船首材（ニー・オブ・ヘッド）正面
        items.append((depth(38000), "外形", rect(-200, 4200, 200, S.BEAK_Z), True, None))
        # 第一斜檣（正面では短く見える）
        hx, hz = S.BOWSPRIT_HEEL
        tx, tz = S.bowsprit_point(1.0)
        d0, d1 = S.BOWSPRIT_D
        bs = tapered_spar((0, hz), (0, tz), d0, d1)
        items.append((depth(hx + 3000), "外形", bs, True, bs))
        for (key, corners) in S.all_square_sails():
            pass
    else:
        # トランサム: 窓・回廊・紋章板・角灯・舵
        z0, z1 = S.STERN_WINDOW_Z
        for ya, yb in S.STERN_WINDOWS:
            w = rect(U(ya), z0, U(yb), z1)
            items.append((depth(-500), "細部", w, True, None))
            items.append((depth(-500), "細部", [(U((ya + yb) / 2), z0), (U((ya + yb) / 2), z1)], False, None))
        gz = S.STERN_GALLERY_Z
        gb = S.halfbreadth(S.stern_x(gz) + 10, gz) or 3500
        items.append((depth(-700), "外形", rect(-gb, gz - 150, gb, gz + 120), True, None))
        for i in range(-12, 13):
            yy = gb * i / 12.5
            items.append((depth(-700), "細部", [(yy, gz + 120), (yy, gz + 700)], False, None))
        items.append((depth(-700), "細部", [(-gb, gz + 700), (gb, gz + 700)], False, None))
        pz0, pz1 = S.STERN_PANEL_Z
        cxp, czp = 0.0, (pz0 + pz1) / 2
        oval = [(cxp + 1500 * math.cos(a), czp + 560 * math.sin(a)) for a in [i * math.pi / 16 for i in range(32)]]
        items.append((depth(-600), "外形", oval, True, None))
        # トランサムの下端（ワイングラスの船尾）
        zt = 3200.0
        pts = []
        while zt <= S.RAIL_TOP_Z:
            b = S.mid_halfbreadth(zt) * S.transom_ratio(zt)
            pts.append((b, zt))
            zt += 200
        items.append((depth(-400), "細部", [(U(b), z) for b, z in pts], False, None))
        items.append((depth(-400), "細部", [(U(-b), z) for b, z in pts], False, None))
        # 舵
        rud = rect(-170, S.KEEL_DEPTH * 0.3, 170, S.RUDDER_TOP_Z)
        items.append((depth(-900), "外形", rud, True, rud))
        # 船尾回廊（両舷）
        qx0, qx1, qz0, qz1, qo = S.QUARTER_GALLERY
        for side in (1, -1):
            b = S.halfbreadth(qx0 + 800, qz0 + 1200) or 4000
            poly = [(U(side * (b - 200)), qz0), (U(side * (b + qo)), qz0 + 500),
                    (U(side * (b + qo)), qz1 - 800), (U(side * (b - 300)), qz1)]
            items.append((depth(qx0), "外形", poly, True, None))
        # 角灯
        for y, k in S.LANTERNS:
            lx, ly, lz = S.lantern_base(y)
            r = S.LANTERN_R * k
            hgt = S.LANTERN_H * k
            lan = [(U(ly) - r, lz), (U(ly) + r, lz), (U(ly) + r * 1.15, lz + hgt * 0.75), (U(ly), lz + hgt),
                   (U(ly) - r * 1.15, lz + hgt * 0.75)]
            items.append((depth(-900), "外形", lan, True, lan))
            items.append((depth(-900), "細部", [(U(ly) - r * 0.6, lz + hgt * 0.2), (U(ly) + r * 0.6, lz + hgt * 0.2)], False, None))

    # 帆・円材
    for name in S.MAST_ORDER:
        m = S.MASTS[name]
        for key in ("lower", "topmast", "tgallant"):
            if not m[key]:
                continue
            z0, z1, d = m[key]
            sp = rect(-d / 2, z0, d / 2, z1)
            items.append((depth(m["x"]) + 1, "外形", sp, True, sp))
        tz, tr = m["top"]
        top = rect(-tr, tz - 200, tr, tz + 120)
        items.append((depth(m["x"]) - 1, "外形", top, True, top))
        if m["crosstree"]:
            cz, cr = m["crosstree"]
            ct = rect(-cr, cz - 100, cr, cz + 60)
            items.append((depth(m["x"]) - 1, "外形", ct, True, ct))
    for mast, tier, z, half, d in S.YARDS:
        p, q = S.yard_ends(mast, z, half)
        yd = tapered_spar((U(p[1]), z), (U(q[1]), z), d * 0.6, d * 0.6)
        items.append((depth(S.MASTS[mast]["x"]) - 3, "外形", yd, True, yd))
    p, q = S.sprit_yard_ends()
    yd = tapered_spar((U(p[1]), p[2]), (U(q[1]), q[2]), 200, 200)
    items.append((depth(42000), "外形", yd, True, yd))
    for key, corners in S.all_square_sails():
        poly = [(U(c[1]), c[2]) for c in corners]
        dx = S.bowsprit_point(0.72)[0] if key[0] == "bowsprit" else S.MASTS[key[0]]["x"]
        items.append((depth(dx) - 2, "帆", poly, True, poly))
    # 三角帆（ほぼ真横から見る → 細い線）
    (lx0, lz0), (lx1, lz1), ld = S.LATEEN_YARD
    ly = U(S.LATEEN_Y)
    lat = [(ly - 120, lz0), (ly + 120, lz0), (ly + 80, lz1), (ly - 80, lz1)]
    items.append((depth(S.MASTS["mizzen"]["x"]) - 3, "外形", lat, True, lat))
    ls = S.LATEEN_SAIL
    items.append((depth(S.MASTS["mizzen"]["x"]) - 2, "帆", [(ly, ls[0][1]), (ly, ls[1][1]), (ly + 300, ls[2][1])], True, None))
    # 旗竿と旗
    mx = S.MASTS["main"]["x"]
    pole = rect(-60, S.FLAG_POLE[0], 60, S.FLAG_POLE[1])
    items.append((depth(mx), "外形", pole, True, None))
    # 索具
    rig = []
    for p0, p1, kind in S.shrouds() + S.stays():
        rig.append((max(depth(p0[0]), depth(p1[0])), [(U(p0[1]), p0[2]), (U(p1[1]), p1[2])]))
    return items, rig


def draw_front(sh, items, rig, ox, step):
    """手前から順に描き、奥の物は手前の多角形で隠す。ox は u のずらし量。"""
    items = sorted(items, key=lambda t: t[0])
    occluders = []
    out_polys = []

    def shift(pts):
        return [(ox + u, z) for u, z in pts]

    i = 0
    rig = sorted(rig, key=lambda t: t[0])
    ri = 0
    for d, layer, pts, closed, occ in items:
        # この深さより手前の索具を先に描く
        while ri < len(rig) and rig[ri][0] < d:
            for seg in clip_polyline(shift(rig[ri][1]), occluders, step):
                sh.pl(seg, "索具")
            ri += 1
        pp = shift(pts) + ([shift(pts)[0]] if closed else [])
        for seg in clip_polyline(pp, occluders, step):
            sh.pl(seg, layer)
        if occ is not None:
            occluders.append(shift(occ))
            out_polys.append(shift(occ))
    while ri < len(rig):
        for seg in clip_polyline(shift(rig[ri][1]), occluders, step):
            sh.pl(seg, "索具")
        ri += 1
    return occluders


def midship_section(sh, ox, oz, label_side_gap):
    """中央横断面（船尾から見る: 左舷が左）。ox, oz はモデル上の原点（中心線・竜骨下面）。"""
    x = S.MIDSHIP_X

    def Q(y, z):     # 左舷 (+y) を左へ
        return (ox - y, oz + z)

    sec = S.section(x, 80)
    zr = S.rail_z(x)
    outer = [Q(b, z) for b, z in sec]
    outer_s = [Q(-b, z) for b, z in sec]
    # 外板・肋材・内張りの断面
    t1, t2, t3 = S.PLANK_T, S.FRAME_SIZE, 80.0

    def ring(off0, off1, side):
        a = [(b - off0, z) for b, z in sec if b - off0 > S.KEEL_HALF_W * 0.5]
        c = [(b - off1, z) for b, z in sec if b - off1 > S.KEEL_HALF_W * 0.5]
        pa = [Q(side * b, z) for b, z in a]
        pc = [Q(side * b, z) for b, z in reversed(c)]
        return pa + pc

    for side in (1, -1):
        sh.hatch(ring(0, t1, side), pattern="ANSI31", scale=0.25)
        sh.pl(ring(0, t1, side), "断面", closed=True)
        sh.hatch(ring(t1, t1 + t2, side), pattern="ANSI32", scale=0.35)
        sh.pl(ring(t1, t1 + t2, side), "断面", closed=True)
        sh.pl(ring(t1 + t2, t1 + t2 + t3, side), "細部", closed=True)
    # 竜骨・内竜骨・床材
    kw, kd = S.KEEL_HALF_W, S.KEEL_DEPTH
    keel = [Q(-kw, 0), Q(kw, 0), Q(kw, kd + 60), Q(-kw, kd + 60)]
    sh.pl(keel, "断面", closed=True)
    sh.hatch(keel, pattern="ANSI31", scale=0.4)
    kz = kd + t1 + t2
    keelson = [Q(-300, kz), Q(300, kz), Q(300, kz + 420), Q(-300, kz + 420)]
    sh.pl(keelson, "断面", closed=True)
    sh.hatch(keelson, pattern="ANSI31", scale=0.4)
    # 甲板梁・甲板（キャンバー付き）
    decks = [(S.GUN_DECK_Z, "砲甲板"), (S.main_deck_z(x), "上甲板")]
    for zd, nm in decks:
        bi = (S.halfbreadth(x, zd) or 5000) - t1 - t2
        cam = 120.0
        top = [Q(bi * (2 * i / 30 - 1), zd + cam * (1 - (2 * i / 30 - 1) ** 2)) for i in range(31)]
        plank = top + [(p[0], p[1] - S.DECK_T) for p in reversed(top)]
        sh.pl(plank, "断面", closed=True)
        sh.hatch(plank, pattern="ANSI31", scale=0.2)
        beam = [(p[0], p[1] - S.DECK_T) for p in top] + [(p[0], p[1] - S.DECK_T - 300) for p in reversed(top)]
        sh.pl(beam, "断面", closed=True)
        sh.hatch(beam, pattern="ANSI32", scale=0.35)
        # ひざ材
        for side in (1, -1):
            zb = zd - S.DECK_T - 300
            bx = (S.halfbreadth(x, zb) or 5000) - t1 - t2
            knee = [Q(side * bx, zb + 300), Q(side * (bx - 900), zb), Q(side * bx, zb - 900)]
            sh.pl(knee, "細部", closed=True)
        # 支柱
        sh.pl([Q(-130, zd - S.DECK_T - 300), Q(130, zd - S.DECK_T - 300),
               Q(130, (decks[0][0] if zd != decks[0][0] else kz + 420)),
               Q(-130, (decks[0][0] if zd != decks[0][0] else kz + 420))], "細部", closed=True)
    # 手すり
    for side in (1, -1):
        b = S.halfbreadth(x, zr)
        cap = [Q(side * (b + 60), zr), Q(side * (b - t1 - t2 - 60), zr), Q(side * (b - t1 - t2 - 60), zr + 140),
               Q(side * (b + 60), zr + 140)]
        sh.pl(cap, "断面", closed=True)
        sh.hatch(cap, pattern="ANSI31", scale=0.2)
    # 大砲（奥に見える, 下甲板は両舷, 上甲板は右舷）
    L, W, H = S.CARRIAGE
    r0, r1 = S.BARREL_R
    for side, zd, pz in ((1, S.GUN_DECK_Z, S.GUN_LOWER_Z), (-1, S.GUN_DECK_Z, S.GUN_LOWER_Z),
                         (1, S.main_deck_z(x), S.main_deck_z(x) + 520),
                         (-1, S.main_deck_z(x), S.main_deck_z(x) + 520)):
        b = S.halfbreadth(x, pz) - t1 - t2
        y_out = b - 150
        y_in = y_out - L
        car = [Q(side * y_in, zd), Q(side * y_out, zd), Q(side * y_out, zd + H), Q(side * (y_in + 300), zd + H),
               Q(side * y_in, zd + H * 0.6)]
        sh.pl(car, "細部", closed=True)
        for wy in (y_in + 220, y_out - 220):
            sh.circle(Q(side * wy, zd + 170), 170, "細部")
        bar = tapered_spar((side * (y_in + 100), pz), (side * (b + 700), pz), 2 * r0, 2 * r1)
        sh.pl([Q(p[0], p[1]) for p in bar], "外形", closed=True)
        # 砲門
        sh.line(Q(side * (b + t1 + t2), pz - 340), Q(side * (b + t1 + t2 + 300), pz - 340), "細部")
    # 大檣（奥, 破断線で止める）
    mz0, mz1 = S.main_deck_z(x), S.main_deck_z(x) + 3600
    d = S.MASTS["main"]["lower"][2]
    sh.pl([Q(-d / 2, mz0), Q(-d / 2, mz1)], "細部")
    sh.pl([Q(d / 2, mz0), Q(d / 2, mz1)], "細部")
    zz = mz1
    sh.pl([Q(-d / 2 - 150, zz), Q(-d / 6, zz + 180), Q(d / 6, zz - 180), Q(d / 2 + 150, zz)], "細部")
    sh.pl([Q(-d / 2, mz0), Q(-d / 2, S.GUN_DECK_Z)], "かくれ線")
    sh.pl([Q(d / 2, mz0), Q(d / 2, S.GUN_DECK_Z)], "かくれ線")
    # 喫水線・中心線
    b = S.halfbreadth(x, S.DRAFT)
    sh.line(Q(b + 1800, S.DRAFT), Q(-b - 1800, S.DRAFT), "喫水線")
    tri = [Q(b + 1300, S.DRAFT), Q(b + 1000, S.DRAFT + 450), Q(b + 1600, S.DRAFT + 450)]
    sh.pl(tri, "喫水線", closed=True)
    sh.text("DWL", Q(b + 1900, S.DRAFT + 330), 2.2, "MIDDLE_RIGHT")
    sh.line(Q(0, -600), Q(0, zr + 4500), "中心線")
    # 腰板
    for base, w in S.WALES:
        for side in (1, -1):
            zb = S.wale_z(x, base)
            bb = S.halfbreadth(x, zb + w / 2)
            sh.pl([Q(side * bb, zb), Q(side * (bb + 120), zb), Q(side * (bb + 120), zb + w), Q(side * bb, zb + w)],
                  "断面", closed=True)
            sh.hatch([Q(side * bb, zb), Q(side * (bb + 120), zb), Q(side * (bb + 120), zb + w), Q(side * bb, zb + w)],
                     solid=True, color=8)
    return Q


def sheet_front():
    scale = 150.0
    sh = Sheet("03_正面図_船尾図_中央横断面図", "正面図・船尾図・中央横断面図", scale,
               (0.0, 0.0), 3)
    P = sh.P
    step = sh.h(0.35)
    base_py = 92.0    # 竜骨下面の紙面高さ
    # 正面図
    ox1, oz = P(100, base_py)
    items, rig = front_views(True)
    for layer, pts in []:
        pass
    sh.msp  # noqa
    _draw_front_at(sh, items, rig, ox1, oz, step)
    # 船尾図
    ox2, _ = P(250, base_py)
    items, rig = front_views(False)
    _draw_front_at(sh, items, rig, ox2, oz, step)
    for oxx, title in ((ox1, "正面図"), (ox2, "船尾図")):
        sh.text(title, (oxx - sh.h(20), oz - sh.h(17)), 6.0, "MIDDLE_LEFT")
        sh.text("S=1:150", (oxx + sh.h(7), oz - sh.h(17)), 4.0, "MIDDLE_LEFT")
        sh.line((oxx, oz - sh.h(6)), (oxx, oz + 42000), "中心線")
        b = S.HALF_BEAM
        sh.dim((oxx - b, oz + 5300), (oxx + b, oz + 5300), (oxx, oz - sh.h(9)))
        sh.line((oxx - 8000, oz + S.DRAFT), (oxx + 8000, oz + S.DRAFT), "喫水線")
    sh.text("左舷", (ox1 + sh.h(56), oz + sh.h(4)), 3.0)
    sh.text("右舷", (ox1 - sh.h(56), oz + sh.h(4)), 3.0)
    sh.text("右舷", (ox2 + sh.h(56), oz + sh.h(4)), 3.0)
    sh.text("左舷", (ox2 - sh.h(56), oz + sh.h(4)), 3.0)

    # 中央横断面図
    oxs, ozs = P(452, 250)
    Q = midship_section(sh, oxs, ozs, 0)
    x = S.MIDSHIP_X
    sh.text("中央横断面図", P(415, 232), 6.0, "MIDDLE_LEFT")
    sh.text(f"S=1:150（x={x:,.0f} 断面, 船首方向を見る）", P(415, 225), 3.0, "MIDDLE_LEFT")
    zm = S.main_deck_z(x)
    b_deck = S.halfbreadth(x, zm)
    b_max = S.halfbreadth(x, 5300)
    # 型幅・深さ・喫水
    sh.dim(Q(b_max, 5300), Q(-b_max, 5300), Q(0, -1500))
    sh.dim(Q(-b_deck, 0), Q(-b_deck, zm), Q(-b_max - 3000, 0), angle=90, text="深さ <>")
    sh.dim(Q(-b_deck, 0), Q(-b_deck, S.DRAFT), Q(-b_max - 1700, 0), angle=90, text="喫水 <>")
    t1, t2 = S.PLANK_T, S.FRAME_SIZE
    lab = [
        ("竜骨", Q(0, 200), Q(1800, -900), "R"),
        ("内竜骨", Q(-200, S.KEEL_DEPTH + 500), Q(-1300, -900), "L"),
        ("外板", Q(-S.halfbreadth(x, 2400) + 40, 2400), Q(-7700, 1700), "L"),
        ("肋材", Q(-S.halfbreadth(x, 3400) + 200, 3400), Q(-7700, 3000), "L"),
        ("砲甲板", Q(-2200, S.GUN_DECK_Z - 50), Q(-7700, 6100), "L"),
        ("ひざ材", Q(-S.halfbreadth(x, S.GUN_DECK_Z - 900) + 600, S.GUN_DECK_Z - 700), Q(-7700, 4600), "L"),
        ("上甲板", Q(-1600, zm - 50), Q(-7700, 9300), "L"),
        ("舷墻・手すり", Q(-S.halfbreadth(x, S.rail_z(x)) + 100, S.rail_z(x) + 70), Q(-7700, 10500), "L"),
        ("大檣", Q(-300, zm + 2600), Q(-3800, 12100), "L"),
        ("甲板梁", Q(1500, S.GUN_DECK_Z - 260), Q(7700, 8000), "R"),
        ("支柱", Q(0, 3800), Q(7700, 2300), "R"),
        ("大砲（下甲板）", Q(3800, S.GUN_LOWER_Z), Q(7700, 6800), "R"),
        ("大砲（上甲板）", Q(3600, zm + 520), Q(7700, 9600), "R"),
        ("腰板", Q(S.halfbreadth(x, 5300) + 60, S.wale_z(x, 5150) + 150), Q(7700, 5300), "R"),
    ]
    for name, target, at, side in lab:
        # 図の右側の文字は右へ、左側の文字は左へ伸ばす
        if at[0] > oxs:
            at = (at[0] + sh.h(14), at[1])
        sh.label(name, target, at, 2.5, "LEFT" if at[0] > oxs else "RIGHT")

    notes = [
        "1. 本図は架空の船のイメージで、実在の船の図面ではない。",
        "2. 寸法の単位は mm。寸法は形状モジュール ship_shape.py で定める。",
        "3. 帆桁は左舷開き 35° に転桁した状態の投影。",
        "4. 手前の帆・船体に隠れる線は省略（索具は細線）。",
        "5. 断面の木材はハッチングで示す。",
    ]
    sh.frame(notes)
    sh.scale_bar(250, 30, 15, 5)
    return sh


def _draw_front_at(sh, items, rig, ox, oz, step):
    items2 = [(d, layer, [(u, z + oz) for u, z in pts], closed, None if occ is None else [(u, z + oz) for u, z in occ])
              for d, layer, pts, closed, occ in items]
    rig2 = [(d, [(u, z + oz) for u, z in seg]) for d, seg in rig]
    draw_front(sh, items2, rig2, ox, step)


# ====================================================================== プレビュー
def preview(path, png, dpi=200):
    """DXF を PNG に描く（日本語フォントは Noto CJK に置き換えて表示）。"""
    import pathlib
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from ezdxf.addons.drawing import Frontend, RenderContext, config
    from ezdxf.addons.drawing.matplotlib import MatplotlibBackend
    from ezdxf.fonts import fonts

    fonts.font_manager.scan_folder(pathlib.Path(HERE, "build", "fonts"))
    doc = ezdxf.readfile(path)
    doc.styles.get("JP").dxf.font = "NotoSansCJKjp-Regular.otf"
    msp = doc.modelspace()
    sc = doc.header["$LTSCALE"]
    w, h = A2
    fig = plt.figure(figsize=(w / 25.4, h / 25.4), dpi=dpi)
    ax = fig.add_axes([0, 0, 1, 1])
    ctx = RenderContext(doc)
    cfg = config.Configuration(background_policy=config.BackgroundPolicy.WHITE,
                               color_policy=config.ColorPolicy.COLOR,
                               lineweight_scaling=1.0,
                               min_lineweight=0.12)
    Frontend(ctx, MatplotlibBackend(ax), config=cfg).draw_layout(msp, finalize=True)
    # 図枠の外形で表示範囲を合わせる
    xs, ys = [], []
    for e in msp.query("LWPOLYLINE[layer=='表題']"):
        pts = list(e.get_points("xy"))
        if len(pts) == 4:
            xs += [p[0] for p in pts]
            ys += [p[1] for p in pts]
    if xs:
        ax.set_xlim(min(xs), max(xs))
        ax.set_ylim(min(ys), max(ys))
    fig.set_size_inches(w / 25.4, h / 25.4)
    fig.savefig(png, dpi=dpi, facecolor="white")
    plt.close(fig)


def main():
    os.makedirs(OUT, exist_ok=True)
    only = sys.argv[1:] or ["1", "2", "3"]
    makers = {"1": sheet_plan, "2": sheet_side, "3": sheet_front}
    for k in only:
        sh = makers[k]()
        path = sh.save()
        bad = sh.check_overlaps()
        print(path, "text overlaps:", len(bad))
        for a, b in bad[:30]:
            print("   ", a, "|", b)
        preview(path, path.replace(".dxf", "_preview.png"))


if __name__ == "__main__":
    main()
