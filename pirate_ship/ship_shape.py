"""架空の海賊船（17世紀ガレオン船風・3本マスト・船名なし）の形状定義。

図面 (make_drawings.py) と Blender 動画 (blender_scene.py) の両方がこのモジュールを
読み込み、寸法はすべてここで決める。実在の船の図面ではない。

単位: mm
座標: x = 船首方向が +（船尾材の基準位置付近が 0）
      y = 左舷が +（船の中心線が y = 0）
      z = 上方が +（竜骨下面が z = 0）
外部ライブラリには依存しない（Blender 同梱の Python からもそのまま読める）。
"""
import math

# ---------------------------------------------------------------- 主要目
KEEL_AFT_X = 2600.0      # 竜骨後端（船尾材の根元）
KEEL_FWD_X = 33400.0     # 竜骨前端（船首材の根元）
KEEL_DEPTH = 450.0       # 竜骨の高さ（下面からラベットまで）
KEEL_HALF_W = 220.0      # 竜骨の半幅
DRAFT = 4200.0           # 計画喫水（竜骨下面から）
HALF_BEAM = 5500.0       # 最大半幅（型幅 11 000）

GUN_DECK_Z = 5900.0      # 下甲板（砲甲板）
MAIN_DECK_Z = 7700.0     # 上甲板（中央部）
QUARTER_DECK_Z = 10000.0
POOP_DECK_Z = 12300.0
FORECASTLE_Z = 10400.0
BULWARK_H = 1100.0       # 甲板から手すり上端まで
BULWARK_T = 160.0        # 舷墻の厚さ
PLANK_T = 110.0          # 外板の厚さ
DECK_T = 120.0           # 甲板の厚さ

POOP_FWD_X = 7200.0      # 船尾楼甲板の前端
QD_FWD_X = 15600.0       # 後甲板の前端
FC_AFT_X = 30400.0       # 船首楼甲板の後端
MIDSHIP_X = 18000.0      # 中央横断面の位置


def clamp(v, lo=0.0, hi=1.0):
    return lo if v < lo else hi if v > hi else v


def smoothstep(t):
    t = clamp(t)
    return t * t * (3.0 - 2.0 * t)


def lerp(a, b, t):
    return a + (b - a) * t


def _pchip(xs, ys):
    """単調3次エルミート補間 (Fritsch–Carlson) を返す。"""
    n = len(xs)
    h = [xs[i + 1] - xs[i] for i in range(n - 1)]
    d = [(ys[i + 1] - ys[i]) / h[i] for i in range(n - 1)]
    m = [0.0] * n
    m[0], m[-1] = d[0], d[-1]
    for i in range(1, n - 1):
        if d[i - 1] * d[i] <= 0:
            m[i] = 0.0
        else:
            w1, w2 = 2 * h[i] + h[i - 1], h[i] + 2 * h[i - 1]
            m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i])

    def f(x):
        if x <= xs[0]:
            return ys[0] + m[0] * (x - xs[0])
        if x >= xs[-1]:
            return ys[-1] + m[-1] * (x - xs[-1])
        i = 0
        while xs[i + 1] < x:
            i += 1
        t = (x - xs[i]) / h[i]
        h00 = (1 + 2 * t) * (1 - t) ** 2
        h10 = t * (1 - t) ** 2
        h01 = t * t * (3 - 2 * t)
        h11 = t * t * (t - 1)
        return h00 * ys[i] + h10 * h[i] * m[i] + h01 * ys[i + 1] + h11 * h[i] * m[i + 1]
    return f


# ---------------------------------------------------------------- 船体の形
# 中央横断面の半幅（z → 半幅）。上部は強いタンブルホーム。
_MID_Z = [KEEL_DEPTH, 700, 1200, 2000, 3000, 4200, 5300, 6500, 7600, 8800, 10000, 11200, 12400, 13700]
_MID_B = [KEEL_HALF_W, 1400, 2700, 3900, 4800, 5350, 5500, 5420, 5150, 4800, 4500, 4250, 4050, 3850]
mid_halfbreadth = _pchip(_MID_Z, _MID_B)


def stern_x(z):
    """船尾の輪郭（船尾材〜トランサム）の x。上へ行くほど後ろへ傾く。"""
    if z <= 5200.0:
        return KEEL_AFT_X - 0.29 * z
    return KEEL_AFT_X - 0.29 * 5200.0 - 0.17 * (z - 5200.0)


def stem_x(z):
    """船首材の外側輪郭の x。"""
    if z <= 9600.0:
        t = z / 9600.0
        return KEEL_FWD_X + 5800.0 * (1.0 - (1.0 - t) ** 2)
    return KEEL_FWD_X + 5800.0 + 0.08 * (z - 9600.0)


def transom_ratio(z):
    """トランサム幅 / 中央半幅（ワイングラス形の船尾）。"""
    if z <= 3000.0:
        return 0.0
    if z <= 7000.0:
        return 0.72 * smoothstep((z - 3000.0) / 4000.0)
    return 0.72 + 0.08 * smoothstep((z - 7000.0) / 2000.0)


def main_deck_z(x):
    """上甲板の高さ（舷弧つき）。"""
    a = max(0.0, (x - 19000.0) / 19000.0)
    b = max(0.0, (19000.0 - x) / 19000.0)
    return MAIN_DECK_Z + 700.0 * a * a + 400.0 * b * b


def rail_z(x):
    """舷側上端（手すり上端）の高さ。船尾楼・後甲板・船首楼で段になる。"""
    r = main_deck_z(x) + BULWARK_H
    w = 600.0
    r = lerp(r, QUARTER_DECK_Z + BULWARK_H, smoothstep((QD_FWD_X + w / 2 - x) / w))
    r = lerp(r, POOP_DECK_Z + BULWARK_H, smoothstep((POOP_FWD_X + w / 2 - x) / w))
    r = lerp(r, FORECASTLE_Z + BULWARK_H, smoothstep((x - (FC_AFT_X - w / 2)) / w))
    return r


RAIL_TOP_Z = POOP_DECK_Z + BULWARK_H   # 最も高い手すり（船尾楼）


def hull_x_at(s, z):
    return stern_x(z) + s * (stem_x(z) - stern_x(z))


def halfbreadth_s(s, z):
    """水線方向パラメータ s (0 = 船尾, 1 = 船首) と高さ z での外板外面の半幅。"""
    bm = mid_halfbreadth(z)
    zn = clamp((z - KEEL_DEPTH) / 7000.0)
    sa, sf = 0.38, 0.58
    if s >= sf:
        t = (1.0 - s) / (1.0 - sf)
        pf = 1.7 + 1.9 * zn
        f = 1.0 - (1.0 - t) ** pf
    elif s <= sa:
        t = s / sa
        r = transom_ratio(z)
        pa = 1.5 + 1.8 * clamp((z - KEEL_DEPTH) / 6000.0)
        f = r + (1.0 - r) * (1.0 - (1.0 - t) ** pa)
    else:
        f = 1.0
    return max(bm * f, 0.0)


def halfbreadth(x, z):
    """位置 (x, z) での外板外面の半幅。船体の外なら None。"""
    x0, x1 = stern_x(z), stem_x(z)
    if x < x0 or x > x1 or z < KEEL_DEPTH - 1e-6:
        return None
    return halfbreadth_s((x - x0) / (x1 - x0), z)


def section_zmin(x):
    """横断面が始まる高さ（竜骨上、または船首・船尾材の輪郭）。"""
    if KEEL_AFT_X <= x <= KEEL_FWD_X:
        return KEEL_DEPTH
    lo, hi = KEEL_DEPTH, RAIL_TOP_Z
    if halfbreadth(x, hi) is None:
        return None
    for _ in range(50):
        mid = 0.5 * (lo + hi)
        if halfbreadth(x, mid) is None:
            lo = mid
        else:
            hi = mid
    return max(hi, KEEL_DEPTH)


def section(x, n=40, z_top=None):
    """x 位置の横断面（左舷側）[(y, z), ...]、下から上へ。"""
    z0 = section_zmin(x)
    z1 = rail_z(x) if z_top is None else z_top
    if z0 is None or z1 <= z0:
        return []
    pts = []
    for i in range(n + 1):
        z = z0 + (z1 - z0) * i / n
        b = halfbreadth(x, z)
        if b is not None:
            pts.append((b, z))
    return pts


def waterline(z, n=120):
    """高さ z の水線（左舷側）[(x, y), ...]、船尾から船首へ。"""
    return [(hull_x_at(i / n, z), halfbreadth_s(i / n, z)) for i in range(n + 1)]


def x_extent_at(z):
    return stern_x(z), stem_x(z)


def max_halfbreadth_plan(x, dz=100.0):
    """平面図で見える最大幅（タンブルホームのため喫水線付近が最も広い）。"""
    best = None
    z = KEEL_DEPTH
    top = rail_z(x)
    while z <= top:
        b = halfbreadth(x, z)
        if b is not None and (best is None or b > best):
            best = b
        z += dz
    return best


def plan_outline(n=160):
    """平面図の外形（左舷側、船尾トランサム上端から船首まで）[(x, y), ...]。"""
    xa = stern_x(RAIL_TOP_Z)
    xb = stem_x(rail_z(stem_x(FORECASTLE_Z + BULWARK_H)))
    pts = []
    for i in range(n + 1):
        x = xa + (xb - xa) * i / n
        b = max_halfbreadth_plan(x)
        if b is not None:
            pts.append((x, b))
    return pts


def rail_line(n=200, inset=0.0):
    """手すり上端の線（左舷側）[(x, y, z)]。inset で内側へずらす。"""
    pts = []
    xa = stern_x(RAIL_TOP_Z)
    xb = stem_x(FORECASTLE_Z + BULWARK_H)
    for i in range(n + 1):
        x = xa + (xb - xa) * i / n
        z = rail_z(x)
        b = halfbreadth(x, z)
        if b is not None:
            pts.append((x, max(b - inset, 0.0), z))
    return pts


# ---------------------------------------------------------------- 甲板
# (名前, 日本語名, x 後端, x 前端, 高さの関数)
DECKS = [
    ("main", "上甲板", -1e9, 1e9, main_deck_z),
    ("quarter", "後甲板", -1e9, QD_FWD_X, lambda x: QUARTER_DECK_Z),
    ("poop", "船尾楼甲板", -1e9, POOP_FWD_X, lambda x: POOP_DECK_Z),
    ("forecastle", "船首楼甲板", FC_AFT_X, 1e9, lambda x: FORECASTLE_Z),
]


def deck_outline(deck, n=80):
    """甲板の外周（舷墻の内側）[(x, y, z)]。左舷側を船尾→船首、右舷を戻る閉じた多角形。"""
    name, _, xa, xb, zf = deck
    # x の範囲を船体内に収める
    za = zf(0.0) if name != "main" else MAIN_DECK_Z
    lo = max(xa, stern_x(zf(max(xa, 0.0))) + 1.0)
    hi = min(xb, stem_x(zf(min(xb, 40000.0))) - 1.0)
    if name == "main":
        lo = stern_x(main_deck_z(0.0)) + 1.0
        hi = stem_x(main_deck_z(stem_x(main_deck_z(38000.0)))) - 1.0
    port = []
    for i in range(n + 1):
        x = lo + (hi - lo) * i / n
        z = zf(x)
        b = halfbreadth(x, z)
        if b is None:
            continue
        port.append((x, max(b - BULWARK_T, 0.0), z))
    star = [(x, -y, z) for (x, y, z) in reversed(port)]
    return port + star


# ---------------------------------------------------------------- 外板・肋材
def strake_bounds():
    """外板の段（下から）の z 境界。"""
    zs = [KEEL_DEPTH]
    z = KEEL_DEPTH
    while z < MAIN_DECK_Z + BULWARK_H + 700:
        z += 560.0
        zs.append(min(z, RAIL_TOP_Z))
    while zs[-1] < RAIL_TOP_Z:
        zs.append(min(zs[-1] + 760.0, RAIL_TOP_Z))
    return zs


FRAME_XS = [3200.0 + 1500.0 * i for i in range(21)]   # 肋材の位置
FRAME_SIZE = 240.0

# 腰板（ウェール）: 上甲板の舷弧に沿う黒い帯
WALES = [(5150.0, 300.0), (7050.0, 260.0)]   # (中央部の下端 z, 幅)


def wale_z(x, base):
    return base + 0.6 * (main_deck_z(x) - MAIN_DECK_Z)


# ---------------------------------------------------------------- 大砲
GUN_LOWER_XS = [9200.0, 12600.0, 16000.0, 19300.0, 22600.0, 25900.0, 29200.0]
GUN_LOWER_Z = GUN_DECK_Z + 550.0         # 砲門中心
GUN_UPPER_XS = [17200.0, 23400.0, 26200.0, 28700.0]   # 上甲板（中央部）
GUN_QD_XS = [11800.0, 14200.0]                         # 後甲板
PORT_LOWER = 640.0     # 砲門の大きさ（下甲板）
PORT_UPPER = 520.0     # 砲門の大きさ（上甲板・後甲板）
BARREL_LEN = 2600.0
BARREL_R = (230.0, 150.0)  # 砲尾・砲口の半径
CARRIAGE = (1300.0, 900.0, 500.0)  # 砲車 長さ・幅・高さ
FIRING_GUNS = [("starboard", "lower", 16000.0), ("starboard", "lower", 22600.0), ("starboard", "lower", 29200.0)]


def guns():
    """全砲の一覧 [{'side': +1/-1, 'x', 'deck_z', 'port_z', 'port', 'tier'}]。"""
    out = []
    for side in (1, -1):
        for x in GUN_LOWER_XS:
            out.append(dict(side=side, x=x, deck_z=GUN_DECK_Z, port_z=GUN_LOWER_Z,
                            port=PORT_LOWER, tier="lower"))
        for x in GUN_UPPER_XS:
            dz = main_deck_z(x)
            out.append(dict(side=side, x=x, deck_z=dz, port_z=dz + 520.0,
                            port=PORT_UPPER, tier="upper"))
        for x in GUN_QD_XS:
            out.append(dict(side=side, x=x, deck_z=QUARTER_DECK_Z,
                            port_z=QUARTER_DECK_Z + 500.0, port=PORT_UPPER, tier="quarter"))
    return out


def hull_slope(x, z, dx=200.0):
    """水平面内での外板の傾き dy/dx（砲門の向きを合わせる）。"""
    a = halfbreadth(x - dx, z)
    b = halfbreadth(x + dx, z)
    if a is None or b is None:
        return 0.0
    return (b - a) / (2 * dx)


# ---------------------------------------------------------------- 甲板上の艤装
HATCHES = [  # (名前, x 後端, x 前端, 半幅, 甲板)
    ("大倉口", 22600.0, 24800.0, 1200.0, "main"),
    ("前倉口", 26800.0, 28200.0, 900.0, "main"),
    ("昇降口", 12900.0, 14100.0, 800.0, "quarter"),
    ("天窓", 3400.0, 5000.0, 900.0, "poop"),
]
CAPSTAN = (17700.0, 700.0)          # (x, 半径) 上甲板
BINNACLE = (8400.0, 380.0)          # 羅針箱 (後甲板)
BELFRY = (30750.0, 650.0)           # 鐘楼 (船首楼後端)
LADDERS = [  # (x 上端, x 下端, y 中心, 幅)
    (QD_FWD_X, QD_FWD_X + 1500.0, 2300.0, 800.0),
    (QD_FWD_X, QD_FWD_X + 1500.0, -2300.0, 800.0),
    (POOP_FWD_X, POOP_FWD_X + 1200.0, 1900.0, 700.0),
    (POOP_FWD_X, POOP_FWD_X + 1200.0, -1900.0, 700.0),
    (FC_AFT_X, FC_AFT_X - 1400.0, 2100.0, 800.0),
    (FC_AFT_X, FC_AFT_X - 1400.0, -2100.0, 800.0),
]

# 横静索を留める張出し板 (チャンネル): (マスト, x 後端, x 前端, z, 張出し)
CHANNELS = [
    ("fore", 29700.0, 33200.0, 9800.0, 850.0),
    ("main", 18300.0, 22800.0, 8250.0, 950.0),
    ("mizzen", 8600.0, 11600.0, 10650.0, 700.0),
]

# 船首の張出し（ビークヘッド）と船首像
BEAK_Z = 9300.0
BEAK_TIP_X = 43400.0
FIGUREHEAD = (43900.0, 9900.0)   # (x, z)


def beak_halfwidth(x):
    x0 = stem_x(BEAK_Z)
    t = clamp((x - x0) / (BEAK_TIP_X - x0))
    return lerp(1900.0, 250.0, t ** 0.8)


def head_knee_profile(n=24):
    """船首材から張出しの先端へ伸びる飾り材（ニー・オブ・ヘッド）の輪郭 [(x, z)]。"""
    pts = []
    for i in range(n + 1):
        t = i / n
        z = lerp(4200.0, BEAK_Z - 200.0, t)
        x = stem_x(z) + (BEAK_TIP_X - 300.0 - stem_x(BEAK_Z)) * t ** 1.6
        pts.append((x, z))
    return pts


# 舵
RUDDER_TOP_Z = 9200.0


def rudder_profile():
    """舵の側面輪郭 [(x, z)]（閉じた多角形）。"""
    pts_post = [(stern_x(z), z) for z in (KEEL_DEPTH * 0.3, 2000.0, 4000.0, 6000.0, RUDDER_TOP_Z)]
    back = []
    for x, z in reversed(pts_post):
        w = lerp(1500.0, 600.0, clamp((z - 0.0) / RUDDER_TOP_Z))
        back.append((x - w, z))
    return pts_post + back


# 船尾の飾り
STERN_WINDOWS = [(-2700.0, -1500.0), (-1300.0, -100.0), (100.0, 1300.0), (1500.0, 2700.0)]  # y 範囲
STERN_WINDOW_Z = (10400.0, 11500.0)
STERN_GALLERY_Z = 10150.0
STERN_PANEL_Z = (11900.0, 13100.0)
QUARTER_GALLERY = (1600.0, 4200.0, 9800.0, 12600.0, 520.0)   # x0, x1, z0, z1, 張出し

# 船尾の角灯 (y, 高さ倍率)
LANTERNS = [(0.0, 1.25), (2500.0, 1.0), (-2500.0, 1.0)]
LANTERN_H = 1100.0
LANTERN_R = 380.0


def lantern_base(y):
    z = RAIL_TOP_Z
    x = stern_x(z) + 350.0
    return (x, y, z + 200.0)


# ---------------------------------------------------------------- マスト・帆桁・帆
DEG = math.pi / 180.0

MASTS = {
    "fore": dict(
        jp="前檣", x=31800.0, rake=0.0, deck_z=FORECASTLE_Z,
        lower=(8200.0, 20200.0, 780.0), top=(18700.0, 1500.0),
        topmast=(17900.0, 29000.0, 520.0), crosstree=(27700.0, 900.0),
        tgallant=(27100.0, 34400.0, 300.0), truck=34500.0,
    ),
    "main": dict(
        jp="大檣", x=20500.0, rake=2.0 * DEG, deck_z=MAIN_DECK_Z,
        lower=(7700.0, 22600.0, 900.0), top=(20900.0, 1700.0),
        topmast=(20000.0, 32200.0, 600.0), crosstree=(30800.0, 1000.0),
        tgallant=(30200.0, 38300.0, 340.0), truck=38400.0,
    ),
    "mizzen": dict(
        jp="後檣", x=10200.0, rake=4.0 * DEG, deck_z=QUARTER_DECK_Z,
        lower=(10000.0, 20600.0, 620.0), top=(19300.0, 1200.0),
        topmast=(18700.0, 26300.0, 400.0), crosstree=None,
        tgallant=None, truck=26400.0,
    ),
}
MAST_ORDER = ["fore", "main", "mizzen"]


def mast_x(name, z):
    """傾斜（後方へのレーキ）を含めたマスト中心の x。"""
    m = MASTS[name]
    return m["x"] - math.tan(m["rake"]) * (z - m["deck_z"])


# 横帆の帆桁: (マスト, 段, z, 半長, 直径)
YARDS = [
    ("fore", "course", 17900.0, 8300.0, 420.0),
    ("fore", "topsail", 26300.0, 5900.0, 300.0),
    ("fore", "topgallant", 32300.0, 3400.0, 180.0),
    ("main", "course", 20100.0, 9800.0, 480.0),
    ("main", "topsail", 29200.0, 6900.0, 340.0),
    ("main", "topgallant", 36000.0, 3900.0, 200.0),
    ("mizzen", "topsail", 25200.0, 3600.0, 220.0),
]
# 後檣の三角帆 (ラテン) の帆桁: 前端・後端 (x, z)
LATEEN_YARD = ((15800.0, 13600.0), (1200.0, 27200.0), 360.0)
LATEEN_Y = 520.0   # 帆桁はマストの左舷側に吊る

# 第一斜檣 (バウスプリット)
BOWSPRIT_HEEL = (34000.0, 10300.0)
BOWSPRIT_ANGLE = 32.0 * DEG
BOWSPRIT_LEN = 14500.0
BOWSPRIT_D = (650.0, 330.0)


def bowsprit_point(t):
    hx, hz = BOWSPRIT_HEEL
    return (hx + t * BOWSPRIT_LEN * math.cos(BOWSPRIT_ANGLE),
            hz + t * BOWSPRIT_LEN * math.sin(BOWSPRIT_ANGLE))


SPRIT_YARD = (0.72, 15200.0, 5600.0, 300.0)   # (斜檣上の位置 t, z, 半長, 直径)

# 横帆: (マスト, 段, 上辺 z, 上辺半幅, 下辺 z, 下辺半幅)
SQUARE_SAILS = [
    ("fore", "course", 17700.0, 8100.0, 12300.0, 8600.0),
    ("fore", "topsail", 26100.0, 5700.0, 18900.0, 7900.0),
    ("fore", "topgallant", 32100.0, 3200.0, 27000.0, 5400.0),
    ("main", "course", 19900.0, 9600.0, 10600.0, 10200.0),
    ("main", "topsail", 29000.0, 6700.0, 21100.0, 9400.0),
    ("main", "topgallant", 35800.0, 3700.0, 30000.0, 6400.0),
    ("mizzen", "topsail", 25000.0, 3400.0, 19700.0, 4400.0),
]
SPRITSAIL = (15000.0, 5400.0, 9800.0, 5800.0)   # 上辺 z, 半幅, 下辺 z, 半幅
LATEEN_SAIL = [(15500.0, 13800.0), (1500.0, 26700.0), (-800.0, 14300.0)]   # (x, z) 三点
SAIL_BILLOW = 0.13     # 風をはらんだときのふくらみ（帆幅に対する比）

# ドクロ旗（大檣のトラックの上）
FLAG_POLE = (38400.0, 40500.0)
FLAG_SIZE = (4800.0, 3100.0)   # 長さ（後方へ）, 高さ。絵柄はブルちゃんのドクロ旗


def sail_x(mast, z):
    """横帆の面の x（帆桁のすぐ前）。"""
    return mast_x(mast, z) + 450.0


# 帆桁の転桁角。風は左舷後方から受け、左舷側の桁端が前へ出る（全図・動画で共通）。
YARD_BRACE = -35.0 * DEG
SAIL_OFFSET = 450.0     # 帆面はマスト中心より前方
SAIL_CLOTH = 610.0      # 帆布の幅（縫い目の間隔）


def brace_point(cx, cy, fwd, across, phi=None):
    """マスト中心 (cx, cy) から、転桁した帆桁の座標系 (前方 fwd, 横 across) の点を返す。"""
    phi = YARD_BRACE if phi is None else phi
    c, s = math.cos(phi), math.sin(phi)
    return (cx + fwd * c - across * s, cy + fwd * s + across * c)


def yard_ends(mast, z, half):
    """転桁した横帆の帆桁両端 ((x, y, z) 左舷端, 右舷端)。"""
    mx = mast_x(mast, z)
    p = brace_point(mx, 0.0, 0.0, half)
    q = brace_point(mx, 0.0, 0.0, -half)
    return (p[0], p[1], z), (q[0], q[1], z)


def square_sail_corners(mast, head_z, head_half, foot_z, foot_half):
    """横帆の四隅 [左上, 右上, 右下, 左下]（左 = 左舷）。転桁済み・ふくらみなし。"""
    out = []
    for z, h in ((head_z, head_half), (head_z, -head_half), (foot_z, -foot_half), (foot_z, foot_half)):
        mx = mast_x(mast, z)
        x, y = brace_point(mx, 0.0, SAIL_OFFSET, h)
        out.append((x, y, z))
    return out


def sail_normal():
    """横帆が風をはらむ向き（水平の単位ベクトル）。"""
    return (math.cos(YARD_BRACE), math.sin(YARD_BRACE))


def sprit_yard_ends():
    t, z, half, d = SPRIT_YARD
    bx, _ = bowsprit_point(t)
    p = brace_point(bx, 0.0, 0.0, half)
    q = brace_point(bx, 0.0, 0.0, -half)
    return (p[0], p[1], z), (q[0], q[1], z)


def spritsail_corners():
    t, _, _, _ = SPRIT_YARD
    bx, _ = bowsprit_point(t)
    hz, hh, fz, fh = SPRITSAIL
    out = []
    for z, h in ((hz, hh), (hz, -hh), (fz, -fh), (fz, fh)):
        x, y = brace_point(bx, 0.0, 250.0, h)
        out.append((x, y, z))
    return out


def all_square_sails():
    """[(名前, 四隅)]。名前は (マスト, 段)。"""
    out = [((m, t), square_sail_corners(m, hz, hh, fz, fh)) for m, t, hz, hh, fz, fh in SQUARE_SAILS]
    out.append((("bowsprit", "spritsail"), spritsail_corners()))
    return out


SAIL_JP = {
    ("fore", "course"): "前檣下帆", ("fore", "topsail"): "前檣中帆", ("fore", "topgallant"): "前檣上帆",
    ("main", "course"): "大檣下帆", ("main", "topsail"): "大檣中帆", ("main", "topgallant"): "大檣上帆",
    ("mizzen", "topsail"): "後檣中帆", ("mizzen", "lateen"): "後檣三角帆",
    ("bowsprit", "spritsail"): "斜檣帆",
}


# ---------------------------------------------------------------- 静索
def _channel(name):
    for c in CHANNELS:
        if c[0] == name:
            return c
    raise KeyError(name)


def shrouds():
    """横静索・上部横静索を [(p0, p1, 種類)] で返す（p = (x, y, z)）。"""
    out = []
    counts = {"fore": 5, "main": 6, "mizzen": 4}
    for name in MAST_ORDER:
        m = MASTS[name]
        _, cx0, cx1, cz, cw = _channel(name)
        n = counts[name]
        top_z, top_r = m["top"]
        r_mast = m["lower"][2] / 2
        for side in (1, -1):
            for i in range(n):
                x = cx0 + (cx1 - cx0) * (i + 0.5) / n
                b = halfbreadth(x, cz) or halfbreadth(x, cz - 500) or 3000.0
                p0 = (x, side * (b + cw - 120.0), cz + 380.0)
                zt = top_z - 350.0
                p1 = (mast_x(name, zt) + (i - (n - 1) / 2) * 90.0, side * r_mast, zt)
                out.append((p0, p1, "shroud"))
            # 上部横静索（トップの縁 → トップマスト頭）
            tm0, tm1, tmd = m["topmast"]
            zt2 = (m["crosstree"][0] - 250.0) if m["crosstree"] else tm1 - 600.0
            for i in range(3):
                xo = (i - 1) * 380.0
                p0 = (mast_x(name, top_z) + xo, side * top_r * 0.92, top_z)
                p1 = (mast_x(name, zt2) + xo * 0.15, side * tmd / 2, zt2)
                out.append((p0, p1, "topshroud"))
            if m["tgallant"]:
                cz2, cr2 = m["crosstree"]
                g0, g1, gd = m["tgallant"]
                for i in range(2):
                    xo = (i - 0.5) * 300.0
                    p0 = (mast_x(name, cz2) + xo, side * cr2 * 0.9, cz2)
                    p1 = (mast_x(name, g1 - 500.0), side * gd / 2, g1 - 500.0)
                    out.append((p0, p1, "tgshroud"))
    return out


def stays():
    """縦静索（前方へ張る支索・後方の後支索）[(p0, p1, 種類)]。"""
    out = []
    F, M, Z = MASTS["fore"], MASTS["main"], MASTS["mizzen"]

    def mp(name, z):
        return (mast_x(name, z), 0.0, z)

    bx, bz = bowsprit_point(0.35)
    out.append((mp("fore", F["top"][0] - 300), (bx, 0.0, bz), "stay"))
    tx, tz = bowsprit_point(0.97)
    out.append((mp("fore", F["crosstree"][0] - 200), (tx, 0.0, tz), "stay"))
    tx2, tz2 = bowsprit_point(0.80)
    out.append((mp("fore", F["tgallant"][1] - 400), (tx2, 0.0, tz2), "stay"))
    out.append((mp("main", M["top"][0] - 300), (32600.0, 0.0, FORECASTLE_Z + 500), "stay"))
    out.append((mp("main", M["crosstree"][0] - 200), mp("fore", F["top"][0] + 200), "stay"))
    out.append((mp("main", M["tgallant"][1] - 400), mp("fore", F["crosstree"][0] + 100), "stay"))
    out.append((mp("mizzen", Z["top"][0] - 300), mp("main", MAIN_DECK_Z + 3200), "stay"))
    out.append((mp("mizzen", Z["topmast"][1] - 500), mp("main", M["top"][0] + 200), "stay"))
    # 後支索（トップマスト頭 → 舷側）
    for name, xs in (("fore", (28800.0, 29700.0)), ("main", (16800.0, 17600.0)),
                     ("mizzen", (6400.0, 7200.0))):
        m = MASTS[name]
        zt = (m["crosstree"][0] - 250.0) if m["crosstree"] else m["topmast"][1] - 600.0
        for side in (1, -1):
            for x in xs:
                z = rail_z(x) - 300.0
                b = halfbreadth(x, z) or 4000.0
                out.append(((mast_x(name, zt), side * 250.0, zt), (x, side * (b + 120.0), z), "backstay"))
    return out


def braces():
    """動索の一部（帆桁の端から後方へ引く転桁索）[(p0, p1, 種類)]。"""
    out = []
    for mast, tier, z, half, d in YARDS:
        if tier == "topgallant":
            continue
        ends = yard_ends(mast, z, half)
        if mast == "fore":
            tgt = (mast_x("main", MASTS["main"]["top"][0] - 1200), 1200.0, MASTS["main"]["top"][0] - 1200)
        elif mast == "main":
            tgt = (6200.0, 3600.0, RAIL_TOP_Z)
        else:
            tgt = (0.0, 2800.0, RAIL_TOP_Z)
        for side, p in zip((1, -1), ends):
            out.append((p, (tgt[0], side * tgt[1], tgt[2]), "brace"))
    return out


# ---------------------------------------------------------------- 全体寸法
def extents():
    """全長などの主な寸法 (mm)。"""
    x_aft = min(stern_x(RAIL_TOP_Z), LATEEN_SAIL[2][0], LATEEN_YARD[1][0])
    tip = bowsprit_point(1.0)
    return dict(
        loa=tip[0] - x_aft,                      # 全長（第一斜檣を含む）
        hull_length=stem_x(FORECASTLE_Z + BULWARK_H) - stern_x(RAIL_TOP_Z),
        lwl=stem_x(DRAFT) - stern_x(DRAFT),
        beam=2 * HALF_BEAM,
        draft=DRAFT,
        air_draft=FLAG_POLE[1] - DRAFT,
        x_aft=x_aft, x_fwd=tip[0],
        main_truck=MASTS["main"]["truck"],
    )


GUN_COUNT = len(guns())

if __name__ == "__main__":
    e = extents()
    for k, v in e.items():
        print(f"{k:12s} {v:10.0f}")
    print("guns", GUN_COUNT, "strakes", len(strake_bounds()) - 1)
    for z in (1000, 3000, DRAFT, 6000, 8000, 11000):
        print(z, [round(halfbreadth(x, z) or -1) for x in range(0, 42000, 3000)])
