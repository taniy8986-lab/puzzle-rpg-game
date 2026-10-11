"""動画のタイムライン（24 fps のフレーム番号）。映像 (blender_scene.py) と音 (make_audio.py) が共有する。"""
import ship_shape as S

FPS = 24
MAIN_END = 480            # 本編 20 秒
LOGO = (480, 564)         # ロゴ 3.5 秒
TOTAL = LOGO[1]           # 23.5 秒

# 1. 巻物 → インク → 封蝋
SCROLL = (2, 50)
INK = (44, 90)
SEAL_DROP = (82, 92)      # 92 で押印
# 2. 光るワイヤーが立ち上がる
WIRES_GLOW = (92, 102)
WIRES_RISE = (100, 134)
# 3. 組み立て
KEEL = (134, 144)
RIBS = (142, 162)
STRAKES = (160, 206)
WALES = (204, 210)
DECKS = (206, 220)
GUNS = (218, 231)
MASTS = (229, 241)
YARDS = (239, 249)
RIGGING = (247, 259)
SAILS = (257, 269)
DECOR = (267, 281)        # 金の飾り・角灯・ドクロ旗
WIRES_FADE = (198, 252)
# 4. 紙が消え、海が満ちる
PAPER_DISSOLVE = (282, 306)
SEA_RISE = (290, 326)
SKY = (296, 338)
# 5. 角灯がともり、帆が風をはらんで進む
LANTERNS_ON = (338, 352)
BELL = (340, 352)         # 船鐘 2 打
SAILS_FILL = (348, 380)
SAIL_GO = 358
# 6. 大砲・題字
SHOTS = [410, 421, 432]
TITLE = (446, 468)


def spread(span, n):
    """span を n 個に等分した開始フレーム。"""
    a, b = span
    if n <= 1:
        return [a]
    return [a + (b - a) * i / (n - 1) for i in range(n)]


def rib_frames():
    return spread((RIBS[0], RIBS[1] - 4), len(S.FRAME_XS))


def strake_frames():
    return spread((STRAKES[0], STRAKES[1] - 3), len(S.strake_bounds()) - 1)


def gun_frames():
    """砲ごとの出現フレーム（guns() の順）。"""
    gs = S.guns()
    order = sorted(range(len(gs)), key=lambda i: (gs[i]["tier"] != "lower", gs[i]["x"]))
    fr = spread((GUNS[0], GUNS[1] - 3), len(gs))
    out = [0.0] * len(gs)
    for k, i in enumerate(order):
        out[i] = fr[k]
    return out


def mast_frames():
    return {"mizzen": MASTS[0], "main": MASTS[0] + 3, "fore": MASTS[0] + 6, "bowsprit": MASTS[0] + 8}
