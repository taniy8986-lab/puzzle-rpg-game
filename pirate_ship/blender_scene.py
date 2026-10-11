"""架空の海賊船の動画シーンを Blender (EEVEE) で組み立てる。

    /opt/bvenv/bin/python blender_scene.py                 # build/pirate_ship.blend を保存
    /opt/bvenv/bin/python blender_scene.py --still 60,200  # テスト静止画（build/stills/）

形状はすべて ship_shape.py（mm）から作り、1 mm = 0.001 Blender 単位 (m) で置く。
巻物の平面図テクスチャは make_textures.py が甲板平面図 DXF から描いたもの。
"""
import math
import os
import random
import sys

import bpy
from mathutils import Euler, Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ship_shape as S  # noqa: E402
import timeline as T  # noqa: E402
from make_textures import PAPER  # noqa: E402

M = 0.001
BUILD = os.path.join(HERE, "build")
TEX = os.path.join(BUILD, "tex")
FONT = os.path.join(BUILD, "fonts", "NotoSerifCJKjp-Bold.otf")
BLEND = os.path.join(BUILD, "pirate_ship.blend")
SEA_Z = S.DRAFT * M                     # 海面（船の計画喫水線）
SUN_SUNSET = Vector((-0.64, 0.77, 0.09)).normalized()   # 夕日の方向（船から見た太陽）
SUN_DAY = Vector((-0.35, -0.45, 0.82)).normalized()
random.seed(7)


# ====================================================================== 基本
def V(x, y, z):
    return Vector((x * M, y * M, z * M))


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "BLENDER_EEVEE"
    sc.render.fps = T.FPS
    sc.frame_start = 0
    sc.frame_end = T.MAIN_END - 1
    sc.render.resolution_x = 1920
    sc.render.resolution_y = 1080
    sc.render.resolution_percentage = 100
    ee = sc.eevee
    ee.taa_render_samples = 8
    ee.use_raytracing = False
    ee.use_shadows = True
    ee.shadow_ray_count = 1
    ee.shadow_step_count = 4
    ee.shadow_resolution_scale = 1.0
    ee.use_fast_gi = False
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.exposure = -0.35
    for look in ("AgX - Medium High Contrast", "Medium High Contrast"):
        try:
            sc.view_settings.look = look
            break
        except TypeError:
            pass
    sc.render.film_transparent = False
    return sc


def link(obj, parent=None):
    bpy.context.scene.collection.objects.link(obj)
    if parent is not None:
        obj.parent = parent
    return obj


def empty(name, loc=(0, 0, 0), parent=None):
    o = bpy.data.objects.new(name, None)
    o.location = loc
    return link(o, parent)


def key(obj, path, frame, value=None, interp=None):
    if value is not None:
        cur = getattr(obj, path)
        if hasattr(cur, "__len__") and not isinstance(value, (int, float, bool)):
            setattr(obj, path, value)
        else:
            setattr(obj, path, value)
    obj.keyframe_insert(path, frame=frame)
    if interp:
        set_interp(obj, path, interp)


def set_interp(idblock, path, interp):
    ad = idblock.animation_data if hasattr(idblock, "animation_data") else None
    if not ad or not ad.action:
        return
    for fc in fcurves_of(ad.action):
        if fc.data_path == path:
            for kp in fc.keyframe_points:
                kp.interpolation = interp


def fcurves_of(action):
    """Blender 5 のレイヤー付きアクションからも F カーブを集める。"""
    if hasattr(action, "fcurves") and action.fcurves is not None:
        try:
            return list(action.fcurves)
        except Exception:
            pass
    out = []
    for layer in getattr(action, "layers", []):
        for strip in layer.strips:
            for bag in strip.channelbags:
                out.extend(bag.fcurves)
    return out


def find_fcurve(idblock, path, index=0):
    ad = idblock.animation_data
    if not ad or not ad.action:
        return None
    for fc in fcurves_of(ad.action):
        if fc.data_path == path and fc.array_index == index:
            return fc
    return None


def socket_key(sock, frame, value):
    sock.default_value = value
    sock.keyframe_insert("default_value", frame=frame)


def hide_until(obj, frame, until_end=None):
    """frame より前は描画しない（until_end 以降も描画しない）。"""
    obj.hide_render = True
    obj.hide_viewport = True
    obj.keyframe_insert("hide_render", frame=0)
    obj.keyframe_insert("hide_viewport", frame=0)
    obj.hide_render = False
    obj.hide_viewport = False
    obj.keyframe_insert("hide_render", frame=int(math.floor(frame)))
    obj.keyframe_insert("hide_viewport", frame=int(math.floor(frame)))
    if until_end is not None:
        obj.hide_render = True
        obj.hide_viewport = True
        obj.keyframe_insert("hide_render", frame=int(until_end))
        obj.keyframe_insert("hide_viewport", frame=int(until_end))


def pop_scale(obj, f0, dur=6, axes=(1, 1, 1), overshoot=1.08):
    """f0 から dur フレームで大きさ 0 → 1（少し行き過ぎて戻る）。"""
    s0 = tuple(0.001 if a else 1.0 for a in axes)
    s1 = tuple(overshoot if a else 1.0 for a in axes)
    obj.scale = s0
    obj.keyframe_insert("scale", frame=f0)
    obj.scale = s1
    obj.keyframe_insert("scale", frame=f0 + dur * 0.7)
    obj.scale = (1, 1, 1)
    obj.keyframe_insert("scale", frame=f0 + dur)
    hide_until(obj, f0)


def slide_in(obj, f0, offset, dur=6):
    base = obj.location.copy()
    obj.location = base + Vector(offset)
    obj.keyframe_insert("location", frame=f0)
    obj.location = base
    obj.keyframe_insert("location", frame=f0 + dur)
    hide_until(obj, f0)


# ====================================================================== メッシュ
class MeshBuilder:
    def __init__(self):
        self.v, self.f, self.mi, self.uv = [], [], [], []

    def add(self, verts, faces, mat=0, uvs=None):
        o = len(self.v)
        self.v.extend(verts)
        for k, face in enumerate(faces):
            self.f.append([i + o for i in face])
            self.mi.append(mat)
            if uvs is not None:
                self.uv.append([uvs[i] for i in face])
            else:
                self.uv.append([(0.0, 0.0)] * len(face))

    def box(self, c, size, mat=0, rot=None):
        cx, cy, cz = c
        sx, sy, sz = (s / 2 for s in size)
        pts = [Vector((x, y, z)) for z in (-sz, sz) for y in (-sy, sy) for x in (-sx, sx)]
        if rot is not None:
            pts = [rot @ p for p in pts]
        pts = [p + Vector((cx, cy, cz)) for p in pts]
        faces = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
        self.add(pts, faces, mat)

    def cyl(self, p0, p1, r0, r1, mat=0, segs=12, caps=True):
        p0, p1 = Vector(p0), Vector(p1)
        ax = (p1 - p0)
        if ax.length < 1e-6:
            return
        ax.normalize()
        u = ax.orthogonal().normalized()
        w = ax.cross(u)
        verts = []
        for p, r in ((p0, r0), (p1, r1)):
            for i in range(segs):
                a = 2 * math.pi * i / segs
                verts.append(p + (u * math.cos(a) + w * math.sin(a)) * r)
        faces = [(i, (i + 1) % segs, segs + (i + 1) % segs, segs + i) for i in range(segs)]
        if caps:
            faces.append(tuple(reversed(range(segs))))
            faces.append(tuple(range(segs, 2 * segs)))
        self.add(verts, faces, mat)

    def grid(self, rows, mat=0, closed_u=False):
        """rows: [[Vector,...], ...] の格子を面にする。"""
        nv, nu = len(rows), len(rows[0])
        verts = [p for r in rows for p in r]
        faces = []
        for j in range(nv - 1):
            for i in range(nu - (0 if closed_u else 1)):
                i2 = (i + 1) % nu
                faces.append((j * nu + i, j * nu + i2, (j + 1) * nu + i2, (j + 1) * nu + i))
        uvs = [(i / max(nu - 1, 1), j / max(nv - 1, 1)) for j in range(nv) for i in range(nu)]
        self.add(verts, faces, mat, uvs)

    def obj(self, name, mats, parent=None, origin=None, smooth=False):
        me = bpy.data.meshes.new(name)
        org = Vector(origin) if origin is not None else Vector((0, 0, 0))
        me.from_pydata([tuple(p - org) for p in map(Vector, self.v)], [], self.f)
        for m in mats:
            me.materials.append(m)
        if self.mi:
            me.polygons.foreach_set("material_index", self.mi)
        uvl = me.uv_layers.new(name="UVMap")
        k = 0
        for poly, uvs in zip(me.polygons, self.uv):
            for li, uv in zip(poly.loop_indices, uvs):
                uvl.data[li].uv = uv
        me.validate()
        me.update()
        if smooth:
            me.shade_smooth()
        o = bpy.data.objects.new(name, me)
        o.location = org
        return link(o, parent)


def curve_obj(name, splines, bevel, mat, parent=None, closed=False, res=2):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = bevel
    cu.bevel_resolution = res
    cu.use_fill_caps = True
    cu.bevel_factor_mapping_end = "SPLINE"
    for pts in splines:
        sp = cu.splines.new("POLY")
        sp.points.add(len(pts) - 1)
        for i, p in enumerate(pts):
            sp.points[i].co = (p[0], p[1], p[2], 1.0)
        sp.use_cyclic_u = closed
    cu.materials.append(mat)
    o = bpy.data.objects.new(name, cu)
    return link(o, parent)


def grow_curve(obj, f0, f1):
    cu = obj.data
    cu.bevel_factor_end = 0.0
    cu.keyframe_insert("bevel_factor_end", frame=f0)
    cu.bevel_factor_end = 1.0
    cu.keyframe_insert("bevel_factor_end", frame=f1)
    hide_until(obj, f0)


# ====================================================================== 材質
def new_mat(name):
    m = bpy.data.materials.new(name)
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    return m, nt, out


def principled(name, color, rough=0.5, metal=0.0, emit=None, emit_strength=0.0, alpha=1.0):
    m, nt, out = new_mat(name)
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if emit is not None:
        b.inputs["Emission Color"].default_value = (*emit, 1)
        b.inputs["Emission Strength"].default_value = emit_strength
    b.inputs["Alpha"].default_value = alpha
    nt.links.new(b.outputs[0], out.inputs[0])
    m.diffuse_color = (*color, 1)
    return m


def bsdf_of(m):
    return next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")


def wood(name, c1, c2, seam_axis="Z", seam=0.28, grain=(0.25, 6.0, 6.0), rough=0.65, seam_dark=0.45):
    """木目と板の継ぎ目（Object 座標）。"""
    m, nt, out = new_mat(name)
    N = nt.nodes
    L = nt.links
    tc = N.new("ShaderNodeTexCoord")
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = grain
    L.new(tc.outputs["Object"], mp.inputs[0])
    nz = N.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 1.6
    nz.inputs["Detail"].default_value = 6.0
    nz.inputs["Distortion"].default_value = 0.6
    L.new(mp.outputs[0], nz.inputs[0])
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*c1, 1)
    ramp.color_ramp.elements[1].color = (*c2, 1)
    L.new(nz.outputs["Fac"], ramp.inputs[0])
    # 継ぎ目
    sep = N.new("ShaderNodeSeparateXYZ")
    L.new(tc.outputs["Object"], sep.inputs[0])
    div = N.new("ShaderNodeMath")
    div.operation = "DIVIDE"
    div.inputs[1].default_value = seam
    L.new(sep.outputs[seam_axis], div.inputs[0])
    fr = N.new("ShaderNodeMath")
    fr.operation = "FRACT"
    L.new(div.outputs[0], fr.inputs[0])
    lt = N.new("ShaderNodeMath")
    lt.operation = "LESS_THAN"
    lt.inputs[1].default_value = 0.06
    L.new(fr.outputs[0], lt.inputs[0])
    flo = N.new("ShaderNodeMath")
    flo.operation = "FLOOR"
    L.new(div.outputs[0], flo.inputs[0])
    wn = N.new("ShaderNodeTexWhiteNoise")
    wn.noise_dimensions = "1D"
    L.new(flo.outputs[0], wn.inputs["W"])
    var = N.new("ShaderNodeMapRange")
    var.inputs["To Min"].default_value = 0.8
    var.inputs["To Max"].default_value = 1.15
    L.new(wn.outputs["Value"], var.inputs[0])
    mul1 = N.new("ShaderNodeMix")
    mul1.data_type = "RGBA"
    mul1.blend_type = "MULTIPLY"
    mul1.inputs["Factor"].default_value = 1.0
    L.new(ramp.outputs[0], mul1.inputs["A"])
    comb = N.new("ShaderNodeCombineXYZ")
    for k in ("X", "Y", "Z"):
        L.new(var.outputs[0], comb.inputs[k])
    L.new(comb.outputs[0], mul1.inputs["B"])
    dark = N.new("ShaderNodeMix")
    dark.data_type = "RGBA"
    dark.blend_type = "MULTIPLY"
    L.new(lt.outputs[0], dark.inputs["Factor"])
    L.new(mul1.outputs["Result"], dark.inputs["A"])
    dark.inputs["B"].default_value = (seam_dark, seam_dark, seam_dark, 1)
    b = N.new("ShaderNodeBsdfPrincipled")
    b.inputs["Roughness"].default_value = rough
    L.new(dark.outputs["Result"], b.inputs["Base Color"])
    L.new(b.outputs[0], out.inputs[0])
    m.diffuse_color = (*c1, 1)
    return m


def emission_mat(name, color, strength):
    m, nt, out = new_mat(name)
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*color, 1)
    e.inputs["Strength"].default_value = strength
    nt.links.new(e.outputs[0], out.inputs[0])
    return m, e


def canvas_mat():
    m, nt, out = new_mat("Canvas")
    N, L = nt.nodes, nt.links
    b = N.new("ShaderNodeBsdfPrincipled")
    b.inputs["Base Color"].default_value = (0.86, 0.79, 0.64, 1)
    b.inputs["Roughness"].default_value = 0.85
    tr = N.new("ShaderNodeBsdfTranslucent")
    tr.inputs["Color"].default_value = (0.95, 0.80, 0.55, 1)
    mix = N.new("ShaderNodeMixShader")
    mix.inputs[0].default_value = 0.35
    L.new(b.outputs[0], mix.inputs[1])
    L.new(tr.outputs[0], mix.inputs[2])
    L.new(mix.outputs[0], out.inputs[0])
    return m


def add_haze(m, near=70.0, far=700.0, color=(0.62, 0.32, 0.22), amount=0.92):
    """カメラからの距離で夕空の色へ溶かす（水平線の境目を消す）。"""
    nt = m.node_tree
    N, L = nt.nodes, nt.links
    out = next(n for n in N if n.type == "OUTPUT_MATERIAL")
    src = out.inputs[0].links[0].from_socket
    cd = N.new("ShaderNodeCameraData")
    mr = N.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = near
    mr.inputs["From Max"].default_value = far
    mr.inputs["To Max"].default_value = amount
    L.new(cd.outputs["View Distance"], mr.inputs[0])
    em = N.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (*color, 1)
    mix = N.new("ShaderNodeMixShader")
    L.new(mr.outputs[0], mix.inputs[0])
    L.new(src, mix.inputs[1])
    L.new(em.outputs[0], mix.inputs[2])
    L.new(mix.outputs[0], out.inputs[0])


def image(path):
    return bpy.data.images.load(path, check_existing=True)


# ====================================================================== 船体
def hull_point(s, z):
    """s, z の外板上の点（舷側上端で切る）。"""
    x = S.hull_x_at(s, z)
    zt = S.rail_z(x)
    if z > zt:
        z = zt
        st, sm = S.stern_x(z), S.stem_x(z)
        s2 = min(max((x - st) / (sm - st), 0.0), 1.0)
        x = S.hull_x_at(s2, z)
        return x, S.halfbreadth_s(s2, z), z
    return x, S.halfbreadth_s(s, z), z


def strake_mesh(z0, z1, ns=110):
    mb = MeshBuilder()
    nz = max(2, int(math.ceil((z1 - z0) / 140.0)))
    ss = [0.5 - 0.5 * math.cos(math.pi * i / ns) for i in range(ns + 1)]
    for side in (1, -1):
        rows = []
        for j in range(nz + 1):
            z = z0 + (z1 - z0) * j / nz
            row = []
            for s in ss:
                x, b, zz = hull_point(s, z)
                row.append(V(x, side * b, zz))
            rows.append(row)
        if side == -1:
            rows = [list(reversed(r)) for r in rows]
        mb.grid(rows)
    # トランサム（船尾の平らな面）
    left, right = [], []
    for j in range(nz + 1):
        z = z0 + (z1 - z0) * j / nz
        x, b, zz = hull_point(0.0, z)
        left.append(V(x, b, zz))
        right.append(V(x, -b, zz))
    if max(p.y for p in left) > 0.05:
        mb.grid([[right[j], left[j]] for j in range(nz + 1)])
    return mb


def section_pts(x, inset, z_top=None):
    """左舷→竜骨→右舷の肋材の中心線。"""
    sec = S.section(x, 40, z_top)
    if not sec:
        return []
    port = [(max(b - inset, 0.0), z) for b, z in sec]
    pts = [V(x, -b, z) for b, z in reversed(port)] + [V(x, b, z) for b, z in port[1:]]
    return pts


def deck_mesh(name_key, zf, xa, xb, n=60):
    mb = MeshBuilder()
    rows = []
    for i in range(n + 1):
        x = xa + (xb - xa) * i / n
        z = zf(x)
        b = S.halfbreadth(x, z)
        if b is None:
            continue
        b = max(b - S.BULWARK_T, 0.0)
        rows.append([V(x, -b, z), V(x, -b / 2, z), V(x, 0, z), V(x, b / 2, z), V(x, b, z)])
    # 行と列を入れ替えて格子にする
    cols = [[r[k] for r in rows] for k in range(5)]
    mb.grid(cols)
    return mb


def bulkhead(x, z0, z1, mb, mat=0):
    """甲板の段の隔壁（x 一定の面）。"""
    pts = []
    n = 12
    for i in range(n + 1):
        z = z0 + (z1 - z0) * i / n
        b = S.halfbreadth(x, z) or 0.0
        pts.append((max(b - S.BULWARK_T, 0), z))
    rows = [[V(x, -b, z), V(x, b, z)] for b, z in pts]
    mb.grid(rows, mat)


# ====================================================================== シーン
class Scene:
    def __init__(self):
        self.sc = reset()
        self.mats = {}
        self.build_materials()
        self.desk = empty("Desk")
        self.ship_root = empty("ShipRoot")          # 前進・浮上
        self.ship = empty("Ship", parent=self.ship_root)   # 波の揺れ・砲撃の反動

    # ------------------------------------------------------------ materials
    def build_materials(self):
        mt = self.mats
        mt["tallow"] = wood("Tallow", (0.60, 0.55, 0.45), (0.52, 0.47, 0.37), seam=0.56, grain=(0.08, 1.2, 1.2), rough=0.8,
                            seam_dark=0.7)
        mt["hull"] = wood("HullWood", (0.13, 0.075, 0.04), (0.07, 0.04, 0.02), seam=0.56)
        mt["upper"] = wood("UpperWorks", (0.30, 0.045, 0.03), (0.20, 0.03, 0.02), seam=0.38, rough=0.55, seam_dark=0.55)
        mt["wale"] = principled("WaleBlack", (0.02, 0.018, 0.016), 0.5)
        mt["deck"] = wood("DeckWood", (0.42, 0.30, 0.18), (0.30, 0.20, 0.11), seam_axis="Y", seam=0.3,
                          grain=(0.15, 4.0, 4.0))
        mt["frame"] = wood("FrameWood", (0.36, 0.22, 0.11), (0.25, 0.15, 0.07), seam=100.0)
        mt["spar"] = wood("SparWood", (0.40, 0.26, 0.13), (0.28, 0.17, 0.08), seam=100.0, grain=(6, 6, 0.3))
        mt["dark"] = principled("DarkWood", (0.05, 0.03, 0.02), 0.6)
        mt["red"] = principled("RedPaint", (0.32, 0.03, 0.02), 0.5)
        mt["gold"] = principled("Gold", (1.0, 0.70, 0.28), 0.28, 1.0)
        mt["iron"] = principled("Iron", (0.035, 0.035, 0.035), 0.45, 0.85)
        mt["rope"] = principled("Rope", (0.07, 0.045, 0.025), 0.9)
        mt["black"] = principled("PortBlack", (0.005, 0.004, 0.004), 0.9)
        mt["canvas"] = canvas_mat()
        m, e = emission_mat("WindowGlow", (1.0, 0.55, 0.2), 0.0)
        mt["window"], self.window_emit = m, e
        m, e = emission_mat("LanternGlass", (1.0, 0.62, 0.25), 0.2)
        mt["lantern"], self.lantern_emit = m, e
        m, e = emission_mat("Wire", (1.0, 0.72, 0.32), 0.0)
        mt["wire"], self.wire_emit = m, e
        # 旗
        m, nt, out = new_mat("Flag")
        tex = nt.nodes.new("ShaderNodeTexImage")
        tex.image = image(os.path.join(TEX, "flag.png"))
        b = nt.nodes.new("ShaderNodeBsdfPrincipled")
        b.inputs["Roughness"].default_value = 0.9
        nt.links.new(tex.outputs[0], b.inputs["Base Color"])
        nt.links.new(b.outputs[0], out.inputs[0])
        mt["flag"] = m
        mt["pennant"] = principled("Pennant", (0.45, 0.02, 0.02), 0.8)

    # ------------------------------------------------------------ 1. 巻物
    def build_paper(self):
        x0, x1, y0, y1 = (v * M for v in PAPER)
        cx = (x0 + x1) / 2
        self.paper_cx = cx
        self.paper_hw_full = (x1 - x0) / 2
        mb = MeshBuilder()
        nx, ny = 64, 4
        rows = [[Vector((x0 + (x1 - x0) * i / nx, y0 + (y1 - y0) * j / ny, 0.0)) for i in range(nx + 1)]
                for j in range(ny + 1)]
        mb.grid(rows)
        m, nt, out = new_mat("Paper")
        m.surface_render_method = "DITHERED"
        N, L = nt.nodes, nt.links
        uv = N.new("ShaderNodeTexCoord")
        parch = N.new("ShaderNodeTexImage")
        parch.image = image(os.path.join(TEX, "parchment.png"))
        ink = N.new("ShaderNodeTexImage")
        ink.image = image(os.path.join(TEX, "ink.png"))
        for t in (parch, ink):
            L.new(uv.outputs["UV"], t.inputs[0])
        sep = N.new("ShaderNodeSeparateXYZ")
        L.new(uv.outputs["Object"], sep.inputs[0])

        def math_node(op, a=None, b=None, va=None, vb=None):
            n = N.new("ShaderNodeMath")
            n.operation = op
            if a is not None:
                L.new(a, n.inputs[0])
            elif va is not None:
                n.inputs[0].default_value = va
            if b is not None:
                L.new(b, n.inputs[1])
            elif vb is not None:
                n.inputs[1].default_value = vb
            return n

        val = {}
        for k, v in (("HalfW", 0.0), ("InkWipe", x0 - 3), ("InkGlow", 0.0), ("Dissolve", -0.2)):
            n = N.new("ShaderNodeValue")
            n.label = k
            n.outputs[0].default_value = v
            val[k] = n
        self.paper_vals = val
        # 巻物が開く範囲
        dx = math_node("SUBTRACT", sep.outputs["X"], vb=cx)
        adx = math_node("ABSOLUTE", dx.outputs[0])
        open_a = math_node("LESS_THAN", adx.outputs[0], val["HalfW"].outputs[0])
        # インクの現れ方（左から、にじみつき）
        nz = N.new("ShaderNodeTexNoise")
        nz.inputs["Scale"].default_value = 0.35
        L.new(uv.outputs["Object"], nz.inputs[0])
        nzs = math_node("MULTIPLY", nz.outputs["Fac"], vb=6.0)
        front = math_node("ADD", val["InkWipe"].outputs[0], nzs.outputs[0])
        d = math_node("SUBTRACT", front.outputs[0], sep.outputs["X"])
        inkm = math_node("MULTIPLY", d.outputs[0], vb=0.5)
        inkm.use_clamp = True
        inka = math_node("MULTIPLY", ink.outputs["Alpha"], inkm.outputs[0])
        col = N.new("ShaderNodeMix")
        col.data_type = "RGBA"
        L.new(inka.outputs[0], col.inputs["Factor"])
        L.new(parch.outputs[0], col.inputs["A"])
        L.new(ink.outputs[0], col.inputs["B"])
        # 溶けて消える（燃えるふち）
        nz2 = N.new("ShaderNodeTexNoise")
        nz2.inputs["Scale"].default_value = 0.09
        nz2.inputs["Detail"].default_value = 4.0
        L.new(uv.outputs["Object"], nz2.inputs[0])
        keep = math_node("GREATER_THAN", nz2.outputs["Fac"], val["Dissolve"].outputs[0])
        edge_hi = math_node("ADD", val["Dissolve"].outputs[0], vb=0.035)
        edge = math_node("LESS_THAN", nz2.outputs["Fac"], edge_hi.outputs[0])
        edge2 = math_node("MULTIPLY", edge.outputs[0], keep.outputs[0])
        alpha = math_node("MULTIPLY", open_a.outputs[0], keep.outputs[0])
        # 発光: 燃えるふち + インクの光
        glow_ink = math_node("MULTIPLY", inka.outputs[0], val["InkGlow"].outputs[0])
        e1 = N.new("ShaderNodeMix")
        e1.data_type = "RGBA"
        e1.inputs["A"].default_value = (0, 0, 0, 1)
        e1.inputs["B"].default_value = (1.0, 0.65, 0.25, 1)
        L.new(glow_ink.outputs[0], e1.inputs["Factor"])
        e2 = N.new("ShaderNodeMix")
        e2.data_type = "RGBA"
        e2.inputs["B"].default_value = (6.0, 1.6, 0.3, 1)
        L.new(edge2.outputs[0], e2.inputs["Factor"])
        L.new(e1.outputs["Result"], e2.inputs["A"])
        b = N.new("ShaderNodeBsdfPrincipled")
        b.inputs["Roughness"].default_value = 0.85
        L.new(col.outputs["Result"], b.inputs["Base Color"])
        L.new(alpha.outputs[0], b.inputs["Alpha"])
        L.new(e2.outputs["Result"], b.inputs["Emission Color"])
        b.inputs["Emission Strength"].default_value = 1.0
        L.new(b.outputs[0], out.inputs[0])
        self.paper = mb.obj("Paper", [m], parent=self.desk)

        # 軸（ローラー）
        rmat = wood("RollPaper", (0.80, 0.68, 0.48), (0.62, 0.48, 0.30), seam_axis="X", seam=0.09,
                    grain=(2, 0.3, 2), rough=0.8, seam_dark=0.75)
        knob = mt_knob = self.mats["dark"]
        R = 0.75
        self.rollers = []
        for sgn in (-1, 1):
            mb = MeshBuilder()
            mb.cyl((0, y0 - 0.3, 0), (0, y1 + 0.3, 0), R, R, 0, segs=24)
            mb.cyl((0, y0 - 1.4, 0), (0, y0 - 0.3, 0), 0.45, 0.45, 1, segs=16)
            mb.cyl((0, y1 + 0.3, 0), (0, y1 + 1.4, 0), 0.45, 0.45, 1, segs=16)
            mb.cyl((0, y0 - 1.9, 0), (0, y0 - 1.4, 0), 0.25, 0.6, 2, segs=16)
            mb.cyl((0, y1 + 1.4, 0), (0, y1 + 1.9, 0), 0.6, 0.25, 2, segs=16)
            o = mb.obj(f"Roller{'L' if sgn < 0 else 'R'}", [rmat, knob, self.mats["gold"]], parent=self.desk,
                       smooth=True)
            o.location = (cx, 0, R)
            self.rollers.append((sgn, o))
        a, b2 = T.SCROLL
        keys = [(a, 0.0), (a + (b2 - a) * 0.15, 0.6), (b2, self.paper_hw_full)]
        for f, hw in keys:
            socket_key(val["HalfW"].outputs[0], f, hw)
            for sgn, o in self.rollers:
                o.location = (cx + sgn * hw, 0, R)
                o.keyframe_insert("location", frame=f)
                o.rotation_euler = (0, sgn * hw / R, 0)
                o.keyframe_insert("rotation_euler", frame=f)
        # インク
        socket_key(val["InkWipe"].outputs[0], T.INK[0], x0 - 7)
        socket_key(val["InkWipe"].outputs[0], T.INK[1], x1 + 1)
        socket_key(val["InkGlow"].outputs[0], T.WIRES_GLOW[0], 0.0)
        socket_key(val["InkGlow"].outputs[0], T.WIRES_GLOW[1], 1.6)
        socket_key(val["InkGlow"].outputs[0], T.WIRES_RISE[1], 0.3)
        # 消える
        socket_key(val["Dissolve"].outputs[0], T.PAPER_DISSOLVE[0], -0.05)
        socket_key(val["Dissolve"].outputs[0], T.PAPER_DISSOLVE[1], 1.05)
        for sgn, o in self.rollers:
            o.scale = (1, 1, 1)
            o.keyframe_insert("scale", frame=T.PAPER_DISSOLVE[0])
            o.scale = (0.001, 0.001, 0.001)
            o.keyframe_insert("scale", frame=T.PAPER_DISSOLVE[0] + 14)
            hide_until(o, 0, T.PAPER_DISSOLVE[1])
        hide_until(self.paper, 0, T.PAPER_DISSOLVE[1] + 1)

        # 封蝋
        sm, nt, out = new_mat("SealWax")
        N, L = nt.nodes, nt.links
        tx = N.new("ShaderNodeTexImage")
        tx.image = image(os.path.join(TEX, "seal_height.png"))
        tx.image.colorspace_settings.name = "Non-Color"
        bump = N.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = 0.9
        bump.inputs["Distance"].default_value = 0.08
        L.new(tx.outputs[0], bump.inputs["Height"])
        bb = N.new("ShaderNodeBsdfPrincipled")
        bb.inputs["Base Color"].default_value = (0.42, 0.025, 0.02, 1)
        bb.inputs["Roughness"].default_value = 0.3
        bb.inputs["Coat Weight"].default_value = 0.4
        L.new(bump.outputs[0], bb.inputs["Normal"])
        L.new(bb.outputs[0], out.inputs[0])
        mb = MeshBuilder()
        r0, h = 1.75, 0.22
        n = 48
        rim = [Vector(((r0 + 0.12 * math.sin(5 * a) + 0.08 * math.sin(11 * a + 1)) * math.cos(a),
                       (r0 + 0.12 * math.sin(5 * a) + 0.08 * math.sin(11 * a + 1)) * math.sin(a), 0))
               for a in [2 * math.pi * i / n for i in range(n)]]
        rings = []
        for k, f in enumerate((1.0, 0.97, 0.9, 0.6, 0.3, 0.0)):
            z = h * (0.0 if k == 0 else 1.0 if k > 1 else 0.8)
            rings.append([Vector((p.x * f, p.y * f, z)) for p in rim])
        verts = [p for r in rings for p in r]
        faces = []
        for j in range(len(rings) - 1):
            for i in range(n):
                faces.append((j * n + i, j * n + (i + 1) % n, (j + 1) * n + (i + 1) % n, (j + 1) * n + i))
        uvs = [((p.x / (r0 * 1.15) + 1) / 2, (p.y / (r0 * 1.15) + 1) / 2) for p in verts]
        mb.add(verts, faces, 0, uvs)
        self.seal = mb.obj("Seal", [sm], parent=self.desk, smooth=True)
        sx, sy = 47.0, -13.2
        f0, f1 = T.SEAL_DROP
        self.seal.location = (sx, sy, 9.0)
        self.seal.rotation_euler = (0.3, -0.2, 0.4)
        self.seal.keyframe_insert("location", frame=f0)
        self.seal.keyframe_insert("rotation_euler", frame=f0)
        self.seal.location = (sx, sy, 0.0)
        self.seal.rotation_euler = (0, 0, 0.25)
        self.seal.keyframe_insert("location", frame=f1)
        self.seal.keyframe_insert("rotation_euler", frame=f1)
        set_interp(self.seal, "location", "LINEAR")
        self.seal.scale = (1, 1, 1)
        self.seal.keyframe_insert("scale", frame=f1 - 0.01)
        self.seal.scale = (1.18, 1.18, 0.55)
        self.seal.keyframe_insert("scale", frame=f1 + 1)
        self.seal.scale = (1, 1, 1)
        self.seal.keyframe_insert("scale", frame=f1 + 5)
        self.seal.keyframe_insert("scale", frame=T.PAPER_DISSOLVE[0] + 4)
        self.seal.scale = (0.001, 0.001, 0.001)
        self.seal.keyframe_insert("scale", frame=T.PAPER_DISSOLVE[0] + 12)
        hide_until(self.seal, f0, T.PAPER_DISSOLVE[1])

    # ------------------------------------------------------------ 2. 光るワイヤー
    def build_wires(self):
        sp = []
        for z in (S.KEEL_DEPTH + 300, 1500, 3000, S.DRAFT, 6000, 8000, 10000, 12000):
            wl = S.waterline(z, 80)
            pts = [hull_point((x - S.stern_x(z)) / (S.stem_x(z) - S.stern_x(z)), z) for x, y in wl]
            pts = [p for p in pts if p[2] >= z - 1]
            if len(pts) < 3:
                continue
            port = [V(x, b, zz) for x, b, zz in pts]
            star = [V(x, -b, zz) for x, b, zz in reversed(pts)]
            sp.append(port + star)
        for x in S.FRAME_XS[::2] + [S.FRAME_XS[-1]]:
            p = section_pts(x, 0)
            if p:
                sp.append(p)
        rail = S.rail_line(160)
        sp.append([V(x, y, z) for x, y, z in rail])
        sp.append([V(x, -y, z) for x, y, z in rail])
        prof = [V(S.stern_x(z), 0, z) for z in [S.RAIL_TOP_Z * i / 20 for i in range(21)]]
        sp.append(list(reversed(prof)) + [V(S.stem_x(0), 0, 0)] +
                  [V(S.stem_x(z), 0, z) for z in [(S.FORECASTLE_Z + S.BULWARK_H) * i / 20 for i in range(1, 21)]])
        for name in S.MAST_ORDER:
            m = S.MASTS[name]
            z0 = m["deck_z"]
            sp.append([V(S.mast_x(name, z0), 0, z0), V(S.mast_x(name, m["truck"]), 0, m["truck"])])
        for mast, tier, z, half, d in S.YARDS:
            p, q = S.yard_ends(mast, z, half)
            sp.append([V(*p), V(*q)])
        hx, hz = S.BOWSPRIT_HEEL
        tx, tz = S.bowsprit_point(1.0)
        sp.append([V(hx, 0, hz), V(tx, 0, tz)])
        self.wires = curve_obj("Wires", sp, 0.045, self.mats["wire"], parent=self.ship, closed=False, res=1)
        w = self.wires
        a, b = T.WIRES_RISE
        w.scale = (1, 1, 0.001)
        w.keyframe_insert("scale", frame=a)
        w.scale = (1, 1, 1)
        w.keyframe_insert("scale", frame=b)
        hide_until(w, T.WIRES_GLOW[0], T.WIRES_FADE[1])
        e = self.wire_emit.inputs["Strength"]
        socket_key(e, T.WIRES_GLOW[0], 2.5)
        socket_key(e, T.WIRES_GLOW[1], 9.0)
        socket_key(e, T.WIRES_RISE[1], 6.0)
        socket_key(e, T.WIRES_FADE[0], 4.0)
        socket_key(e, T.WIRES_FADE[1], 0.0)

    # ------------------------------------------------------------ 3. 組み立て
    def build_keel(self):
        mb = MeshBuilder()
        mb.box(V((S.KEEL_AFT_X + S.KEEL_FWD_X) / 2, 0, (S.KEEL_DEPTH + 150) / 2),
               (V(S.KEEL_FWD_X - S.KEEL_AFT_X, 0, 0).x, 2 * S.KEEL_HALF_W * M, (S.KEEL_DEPTH + 150) * M), 0)
        stem = [V(S.stem_x(z) - 220, 0, z) for z in [i * 400.0 for i in range(0, 30)] if z <= S.FORECASTLE_Z + 900]
        for a, b in zip(stem, stem[1:]):
            mb.box((a + b) / 2, (0.44, 0.46, (b - a).length + 0.05), 0,
                   rot=Vector((0, 0, 1)).rotation_difference(b - a).to_matrix())
        post = [V(S.stern_x(z) + 200, 0, z) for z in [i * 400.0 for i in range(0, 24)] if z <= S.RUDDER_TOP_Z]
        for a, b in zip(post, post[1:]):
            mb.box((a + b) / 2, (0.40, 0.42, (b - a).length + 0.05), 0,
                   rot=Vector((0, 0, 1)).rotation_difference(b - a).to_matrix())
        # 舵
        prof = S.rudder_profile()
        n = len(prof)
        verts = [V(x, -150, z) for x, z in prof] + [V(x, 150, z) for x, z in prof]
        faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))]
        faces += [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
        mb.add(verts, faces, 1)
        o = mb.obj("Keel", [self.mats["frame"], self.mats["dark"]], parent=self.ship)
        slide_in(o, T.KEEL[0], (0, 0, 2.5), dur=8)
        return o

    def build_ribs(self):
        fr = T.rib_frames()
        inset = S.PLANK_T + S.FRAME_SIZE / 2
        for x, f in zip(S.FRAME_XS, fr):
            pts = section_pts(x, inset)
            if not pts:
                continue
            o = curve_obj(f"Rib_{int(x)}", [pts], S.FRAME_SIZE * M / 2, self.mats["frame"], parent=self.ship, res=0)
            o.location = (0, 0, 0)
            slide_in(o, f, (0, 0, -1.5), dur=5)

    def build_strakes(self):
        zs = S.strake_bounds()
        fr = T.strake_frames()
        for k, ((z0, z1), f) in enumerate(zip(zip(zs, zs[1:]), fr)):
            zc = (z0 + z1) / 2
            mat = self.mats["tallow"] if zc < S.DRAFT + 100 else self.mats["hull"] if zc < 8600 else self.mats["upper"]
            mb = strake_mesh(z0, z1)
            o = mb.obj(f"Strake_{k:02d}", [mat], parent=self.ship, smooth=True)
            slide_in(o, f, (0, 0, -0.9), dur=4)
        # 腰板（黒い帯）
        mb = MeshBuilder()
        for base, w in S.WALES:
            for side in (1, -1):
                rows = []
                for zz in (0.0, w):
                    row = []
                    for i in range(121):
                        s = 0.02 + 0.96 * i / 120
                        z = base + zz
                        x = S.hull_x_at(s, z)
                        z2 = S.wale_z(x, base) + zz
                        b = S.halfbreadth(x, z2)
                        if b is None:
                            continue
                        row.append(V(x, side * (b + 60), z2))
                    rows.append(row)
                n = min(len(r) for r in rows)
                rows = [r[:n] for r in rows]
                if side == -1:
                    rows = [list(reversed(r)) for r in rows]
                mb.grid(rows)
        o = mb.obj("Wales", [self.mats["wale"]], parent=self.ship, smooth=True)
        pop_scale(o, T.WALES[0], dur=5, axes=(1, 0, 0), overshoot=1.0)

    def build_decks(self):
        f0 = T.DECKS[0]
        stern_main = S.stern_x(S.MAIN_DECK_Z) + 200
        stem_main = S.stem_x(S.main_deck_z(38000)) - 150
        specs = [
            ("DeckMain", S.main_deck_z, stern_main, stem_main),
            ("DeckQuarter", lambda x: S.QUARTER_DECK_Z, S.stern_x(S.QUARTER_DECK_Z) + 150, S.QD_FWD_X),
            ("DeckPoop", lambda x: S.POOP_DECK_Z, S.stern_x(S.POOP_DECK_Z) + 150, S.POOP_FWD_X),
            ("DeckFore", lambda x: S.FORECASTLE_Z, S.FC_AFT_X, S.stem_x(S.FORECASTLE_Z) - 150),
        ]
        for k, (name, zf, xa, xb) in enumerate(specs):
            mb = deck_mesh(name, zf, xa, xb)
            o = mb.obj(name, [self.mats["deck"]], parent=self.ship)
            sol = o.modifiers.new("t", "SOLIDIFY")
            sol.thickness = S.DECK_T * M
            slide_in(o, f0 + k * 2, (0, 0, 1.2), dur=5)
        # 隔壁・扉
        mb = MeshBuilder()
        bulkhead(S.QD_FWD_X, S.main_deck_z(S.QD_FWD_X), S.QUARTER_DECK_Z, mb, 0)
        bulkhead(S.POOP_FWD_X, S.QUARTER_DECK_Z, S.POOP_DECK_Z, mb, 0)
        bulkhead(S.FC_AFT_X, S.main_deck_z(S.FC_AFT_X), S.FORECASTLE_Z, mb, 0)
        for x, z0, sgn in ((S.QD_FWD_X, S.main_deck_z(S.QD_FWD_X), 1), (S.POOP_FWD_X, S.QUARTER_DECK_Z, 1),
                           (S.FC_AFT_X, S.main_deck_z(S.FC_AFT_X), -1)):
            for y in (-900, 900):
                mb.box(V(x + sgn * 30, y, z0 + 950), (0.08, 0.9, 1.85), 1)
            for y in (-3300, -2600, 2600, 3300):
                mb.box(V(x + sgn * 30, y, z0 + 1300), (0.07, 0.45, 0.5), 2)
            # 胸壁の手すり（金は後で）
            b = (S.halfbreadth(x, z0 + 2200) or 4000) - S.BULWARK_T
        o = mb.obj("Bulkheads", [self.mats["red"], self.mats["dark"], self.mats["black"]], parent=self.ship)
        slide_in(o, f0 + 4, (0, 0, 1.0), dur=5)
        # 倉口・車地・羅針箱・鐘楼・はしご・ビークヘッド
        mb = MeshBuilder()
        deckz = {"main": S.main_deck_z, "quarter": lambda x: S.QUARTER_DECK_Z,
                 "poop": lambda x: S.POOP_DECK_Z, "forecastle": lambda x: S.FORECASTLE_Z}
        for name, x0, x1, hb, deck in S.HATCHES:
            z = deckz[deck]((x0 + x1) / 2)
            mb.box(V((x0 + x1) / 2, 0, z + 150), ((x1 - x0) * M, 2 * hb * M, 0.3), 0)
            g = 220.0
            x = x0 + 150
            while x < x1 - 150:
                mb.box(V(x, 0, z + 310), (0.07, (2 * hb - 300) * M, 0.06), 1)
                x += g
            y = -hb + 150
            while y < hb - 150:
                mb.box(V((x0 + x1) / 2, y, z + 300), ((x1 - x0 - 300) * M, 0.06, 0.06), 1)
                y += g
        cx, cr = S.CAPSTAN
        zc = S.main_deck_z(cx)
        mb.cyl(V(cx, 0, zc), V(cx, 0, zc + 1100), cr * M * 0.8, cr * M * 0.7, 0, segs=16)
        mb.cyl(V(cx, 0, zc + 1100), V(cx, 0, zc + 1300), cr * M, cr * M, 0, segs=16)
        for i in range(8):
            a = 2 * math.pi * i / 8
            mb.cyl(V(cx, 0, zc + 1200), V(cx + 1800 * math.cos(a), 1800 * math.sin(a), zc + 1200), 0.05, 0.05, 1, segs=6)
        bx, br = S.BINNACLE
        mb.box(V(bx, 0, S.QUARTER_DECK_Z + 500), (br * 2 * M, br * 2 * M, 1.0), 0)
        blx, blr = S.BELFRY
        for y in (-blr, blr):
            mb.box(V(blx, y, S.FORECASTLE_Z + 900), (0.15, 0.15, 1.8), 0)
        mb.box(V(blx, 0, S.FORECASTLE_Z + 1850), (0.3, blr * 2 * M + 0.3, 0.15), 0)
        for xt, xbm, yc, w in S.LADDERS:
            zt = S.QUARTER_DECK_Z if xt == S.QD_FWD_X else S.POOP_DECK_Z if xt == S.POOP_FWD_X else S.FORECASTLE_Z
            zb = S.main_deck_z(xbm) if xt in (S.QD_FWD_X, S.FC_AFT_X) else S.QUARTER_DECK_Z
            for yy in (yc - w / 2, yc + w / 2):
                mb.cyl(V(xt, yy, zt), V(xbm, yy, zb), 0.05, 0.05, 0, segs=6)
            for i in range(1, 7):
                t = i / 7
                mb.cyl(V(xt + (xbm - xt) * t, yc - w / 2, zt + (zb - zt) * t),
                       V(xt + (xbm - xt) * t, yc + w / 2, zt + (zb - zt) * t), 0.035, 0.035, 0, segs=6)
        xs0 = S.stem_x(S.BEAK_Z)
        rows = []
        for i in range(21):
            x = xs0 - 300 + (S.BEAK_TIP_X - xs0 + 300) * i / 20
            hw = S.beak_halfwidth(x)
            rows.append([V(x, -hw, S.BEAK_Z), V(x, 0, S.BEAK_Z), V(x, hw, S.BEAK_Z)])
        mb.grid([[r[k] for r in rows] for k in range(3)], 0)
        knee = S.head_knee_profile()
        inner = [(x - 650, z - 250) for x, z in knee]
        poly = knee + list(reversed(inner))
        n = len(poly)
        verts = [V(x, -180, z) for x, z in poly] + [V(x, 180, z) for x, z in poly]
        faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + \
                [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
        mb.add(verts, faces, 2)
        o = mb.obj("DeckFittings", [self.mats["frame"], self.mats["dark"], self.mats["upper"]], parent=self.ship)
        slide_in(o, f0 + 7, (0, 0, 1.5), dur=5)

    def build_guns(self):
        fr = T.gun_frames()
        L, W, H = (v * M for v in S.CARRIAGE)
        r0, r1 = (v * M for v in S.BARREL_R)
        self.gun_muzzles = {}
        for g, f in zip(S.guns(), fr):
            side, x = g["side"], g["x"]
            b = S.halfbreadth(x, g["port_z"])
            pz = g["port_z"] * M
            mb = MeshBuilder()
            p = g["port"] * M
            # 砲門（黒い穴）と赤い蓋
            mb.box(Vector((x * M, side * (b * M + 0.012), pz)), (p, 0.05, p), 1)
            if g["tier"] == "lower":
                hinge = Vector((x * M, side * (b * M + 0.03), pz + p / 2))
                rot = Matrix.Rotation(side * -1.05, 3, "X")
                c = hinge + rot @ Vector((0, side * 0.03, p / 2))
                mb.box(c, (p * 1.05, 0.06, p * 1.05), 2, rot=rot)
                mb.cyl(Vector((x * M, side * (b * M - 0.9), pz)), Vector((x * M, side * (b * M + 0.75), pz)),
                       r0 * 0.9, r1, 0, segs=12)
                mb.cyl(Vector((x * M, side * (b * M + 0.70), pz)), Vector((x * M, side * (b * M + 0.78), pz)),
                       r1 * 1.25, r1 * 1.25, 0, segs=12)
                muzzle = Vector((x * M, side * (b * M + 0.8), pz))
            else:
                dz = g["deck_z"] * M
                yi = (S.halfbreadth(x, g["deck_z"] + 600) - S.BULWARK_T) * M
                cy = side * (yi - 0.15 - L / 2)
                mb.box(Vector((x * M, cy, dz + H / 2)), (W, L, H), 3)
                for dy in (-L * 0.35, L * 0.35):
                    for dx in (-W / 2 - 0.05, W / 2 + 0.05):
                        mb.cyl(Vector((x * M + dx - 0.04, cy + dy, dz + 0.16)),
                               Vector((x * M + dx + 0.04, cy + dy, dz + 0.16)), 0.16, 0.16, 0, segs=10)
                mb.cyl(Vector((x * M, cy - side * L * 0.45, pz - 0.02)), Vector((x * M, side * (b * M + 0.55), pz)),
                       r0 * 0.85, r1 * 0.9, 0, segs=12)
                muzzle = Vector((x * M, side * (b * M + 0.58), pz))
            o = mb.obj(f"Gun_{'P' if side > 0 else 'S'}_{g['tier']}_{int(x)}",
                       [self.mats["iron"], self.mats["black"], self.mats["red"], self.mats["dark"]],
                       parent=self.ship)
            slide_in(o, f, (0, -side * 0.9, 0), dur=4)
            self.gun_muzzles[(side, g["tier"], x)] = muzzle

    def build_masts(self):
        fr = T.mast_frames()
        for name in S.MAST_ORDER:
            m = S.MASTS[name]
            mb = MeshBuilder()
            base = V(S.mast_x(name, m["deck_z"] - 600), 0, m["deck_z"] - 600)

            def P(z):
                return V(S.mast_x(name, z), 0, z)

            for key2, mat in (("lower", 0), ("topmast", 0), ("tgallant", 0)):
                if not m[key2]:
                    continue
                z0, z1, d = m[key2]
                z0 = max(z0, m["deck_z"] - 600) if key2 == "lower" else z0
                mb.cyl(P(z0), P(z1), d * M / 2, d * M / 2 * 0.8, mat, segs=14)
                # 帯
                for t in (0.35, 0.55, 0.75):
                    zz = z0 + (z1 - z0) * t
                    mb.cyl(P(zz - 60), P(zz + 60), d * M / 2 * 1.08, d * M / 2 * 1.08, 1, segs=14)
            tz, tr = m["top"]
            mb.cyl(P(tz - 220), P(tz + 80), tr * M, tr * M, 1, segs=24)
            mb.cyl(P(tz + 80), P(tz + 700), tr * M * 0.98, tr * M * 0.98, 1, segs=24, caps=False)
            if m["crosstree"]:
                cz, cr = m["crosstree"]
                mb.box(P(cz), (0.18, cr * 2 * M, 0.14), 1)
                mb.box(P(cz), (cr * 1.2 * M, 0.18, 0.14), 1)
            mb.cyl(P(m["truck"]), P(m["truck"] + 250), 0.22, 0.22, 2, segs=12)
            if name == "main":
                mb.cyl(V(S.mast_x("main", S.FLAG_POLE[0]), 0, S.FLAG_POLE[0]),
                       V(S.mast_x("main", S.FLAG_POLE[1]), 0, S.FLAG_POLE[1]), 0.06, 0.05, 0, segs=8)
            o = mb.obj(f"Mast_{name}", [self.mats["spar"], self.mats["dark"], self.mats["gold"]], parent=self.ship,
                       origin=base, smooth=False)
            pop_scale(o, fr[name], dur=8, axes=(0, 0, 1), overshoot=1.03)
        hx, hz = S.BOWSPRIT_HEEL
        tx, tz = S.bowsprit_point(1.0)
        mb = MeshBuilder()
        mb.cyl(V(hx, 0, hz), V(tx, 0, tz), S.BOWSPRIT_D[0] * M / 2, S.BOWSPRIT_D[1] * M / 2, 0, segs=14)
        o = mb.obj("Bowsprit", [self.mats["spar"]], parent=self.ship, origin=V(hx, 0, hz))
        pop_scale(o, fr["bowsprit"], dur=8, overshoot=1.02)
        # 張出し板
        mb = MeshBuilder()
        for name, x0, x1, cz, cw in S.CHANNELS:
            for side in (1, -1):
                for i in range(6):
                    xa = x0 + (x1 - x0) * i / 6
                    xb = x0 + (x1 - x0) * (i + 1) / 6
                    xm = (xa + xb) / 2
                    b = S.halfbreadth(xm, cz) or 4000
                    mb.box(V(xm, side * (b + cw / 2), cz), ((xb - xa) * M + 0.01, cw * M, 0.16), 0)
        o = mb.obj("Channels", [self.mats["dark"]], parent=self.ship)
        slide_in(o, T.MASTS[0] + 4, (0, 0, 0.8), dur=5)

    def build_yards(self):
        f0 = T.YARDS[0]
        for k, (mast, tier, z, half, d) in enumerate(S.YARDS):
            p, q = S.yard_ends(mast, z, half)
            p, q = V(*p), V(*q)
            c = (p + q) / 2
            mb = MeshBuilder()
            mb.cyl(c, p, d * M / 2, d * M / 2 * 0.55, 0, segs=10)
            mb.cyl(c, q, d * M / 2, d * M / 2 * 0.55, 0, segs=10)
            o = mb.obj(f"Yard_{mast}_{tier}", [self.mats["spar"]], parent=self.ship, origin=c)
            pop_scale(o, f0 + k * 1.2, dur=5)
        (lx0, lz0), (lx1, lz1), ld = S.LATEEN_YARD
        a, b = V(lx0, S.LATEEN_Y, lz0), V(lx1, S.LATEEN_Y, lz1)
        mb = MeshBuilder()
        mb.cyl(a, b, ld * M / 2, ld * M / 2 * 0.5, 0, segs=10)
        o = mb.obj("Yard_lateen", [self.mats["spar"]], parent=self.ship, origin=(a + b) / 2)
        pop_scale(o, f0 + 8, dur=5)
        p, q = S.sprit_yard_ends()
        p, q = V(*p), V(*q)
        mb = MeshBuilder()
        mb.cyl(p, q, 0.13, 0.13, 0, segs=10)
        o = mb.obj("Yard_sprit", [self.mats["spar"]], parent=self.ship, origin=(p + q) / 2)
        pop_scale(o, f0 + 9, dur=5)

    def build_rigging(self):
        thick, thin = [], []
        for p0, p1, kind in S.shrouds() + S.stays():
            (thick if kind in ("shroud", "stay", "backstay") else thin).append([V(*p0), V(*p1)])
        for p0, p1, kind in S.braces():
            thin.append([V(*p0), V(*p1)])
        # 段索（ラットライン）: 隣り合う横静索の間
        sh = [(V(*a), V(*b)) for a, b, k in S.shrouds() if k == "shroud"]
        for i in range(len(sh) - 1):
            a0, a1 = sh[i]
            b0, b1 = sh[i + 1]
            if (a0 - b0).length > 1.4 or (a0.y > 0) != (b0.y > 0):
                continue
            n = int((a1 - a0).length / 0.45)
            for k in range(2, n - 1, 1):
                t = k / n
                thin.append([a0.lerp(a1, t), b0.lerp(b1, t)])
        a, b = T.RIGGING
        o1 = curve_obj("RiggingStanding", thick, 0.035, self.mats["rope"], parent=self.ship, res=1)
        o2 = curve_obj("RiggingThin", thin, 0.014, self.mats["rope"], parent=self.ship, res=0)
        grow_curve(o1, a, b - 3)
        grow_curve(o2, a + 3, b)

    def sail_object(self, name, corners, normal, f0, grid=(14, 12), depth=None):
        """四隅 [左上, 右上, 右下, 左下] の帆。形状キー Full でふくらむ。"""
        tl, tr, br, bl = (V(*c) for c in corners)
        nu, nv = grid
        width = (tr - tl).length
        D = (depth if depth is not None else S.SAIL_BILLOW) * width
        n = Vector((normal[0], normal[1], 0)).normalized()
        rows_b, rows_f = [], []
        for j in range(nv + 1):
            v = j / nv
            rb, rf = [], []
            for i in range(nu + 1):
                u = i / nu
                top = tl.lerp(tr, u)
                bot = bl.lerp(br, u)
                p = top.lerp(bot, v)
                # 下辺の切れ込み（ローチ）
                p.z += 0.06 * width * (1 - (2 * u - 1) ** 2) * v ** 6
                shape = (1 - (2 * u - 1) ** 2) * (math.sin(math.pi / 2 * v) ** 0.8)
                rb.append(p + n * (0.22 * D * shape) + Vector((0, 0, 0)))
                rf.append(p + n * (D * shape) + Vector((0, 0, 0.0 * v)))
            rows_b.append(rb)
            rows_f.append(rf)
        mb = MeshBuilder()
        mb.grid(rows_b)
        head = (tl + tr) / 2
        o = mb.obj(name, [self.mats["canvas"]], parent=self.ship, origin=head, smooth=True)
        o.shape_key_add(name="Basis")
        sk = o.shape_key_add(name="Full")
        flat = [p - head for r in rows_f for p in r]
        for k, p in enumerate(flat):
            sk.data[k].co = p
        pop_scale(o, f0, dur=7, axes=(0, 0, 1), overshoot=1.0)
        return o, sk

    def build_sails(self):
        f0 = T.SAILS[0]
        self.sail_keys = []
        nrm = S.sail_normal()
        for k, (key2, corners) in enumerate(S.all_square_sails()):
            o, sk = self.sail_object(f"Sail_{key2[0]}_{key2[1]}", corners, nrm, f0 + k * 0.9)
            self.sail_keys.append(sk)
        # ラテン帆（三角）: 右舷へふくらむ
        a, b, c = (V(x, S.LATEEN_Y - 250, z) for x, z in S.LATEEN_SAIL)
        nseg = 12
        rows_b, rows_f = [], []
        for j in range(nseg + 1):
            t = j / nseg
            p0 = a.lerp(c, t)
            p1 = b.lerp(c, t)
            rb, rf = [], []
            for i in range(nseg + 1):
                u = i / nseg
                p = p0.lerp(p1, u)
                w = math.sin(math.pi * u) * math.sin(math.pi * min(t, 0.999)) ** 0.6 * (1 - t) ** 0.3
                rb.append(p + Vector((0, -0.4 * w, 0)))
                rf.append(p + Vector((0, -2.0 * w, 0)))
            rows_b.append(rb)
            rows_f.append(rf)
        mb = MeshBuilder()
        mb.grid(rows_b)
        org = (a + b) / 2
        o = mb.obj("Sail_mizzen_lateen", [self.mats["canvas"]], parent=self.ship, origin=org, smooth=True)
        o.shape_key_add(name="Basis")
        sk = o.shape_key_add(name="Full")
        for k, p in enumerate([p - org for r in rows_f for p in r]):
            sk.data[k].co = p
        pop_scale(o, f0 + 8, dur=7)
        self.sail_keys.append(sk)
        # ふくらむ
        a2, b2 = T.SAILS_FILL
        for k, sk in enumerate(self.sail_keys):
            sk.value = 0.0
            sk.keyframe_insert("value", frame=a2 + k)
            sk.value = 1.05
            sk.keyframe_insert("value", frame=b2 - 8 + k)
            sk.value = 0.95
            sk.keyframe_insert("value", frame=b2 + k)
            fc = find_fcurve(sk.id_data, f'key_blocks["Full"].value')
            if fc is not None and not fc.modifiers:
                mod = fc.modifiers.new("NOISE")
                mod.scale = 6.0
                mod.strength = 0.08
                mod.phase = random.random() * 100
                mod.use_restricted_range = True
                mod.frame_start = b2
                mod.frame_end = 9999

    def build_decor(self):
        f0 = T.DECOR[0]
        gold = self.mats["gold"]
        # 手すりの金の笠木
        rail = S.rail_line(200)
        sp = [[V(x, y + 20, z + 50) for x, y, z in rail], [V(x, -y - 20, z + 50) for x, y, z in rail]]
        for xb in (S.POOP_FWD_X, S.QD_FWD_X, S.FC_AFT_X):
            z = S.rail_z(xb + (300 if xb != S.FC_AFT_X else -300))
            zb = {S.POOP_FWD_X: S.QUARTER_DECK_Z, S.QD_FWD_X: S.QUARTER_DECK_Z, S.FC_AFT_X: S.FORECASTLE_Z}[xb]
            zb = S.POOP_DECK_Z if xb == S.POOP_FWD_X else zb
            b = (S.halfbreadth(xb, zb + 900) or 4000) - S.BULWARK_T
            sp.append([V(xb, -b, zb + 900), V(xb, b, zb + 900)])
        # 上の腰板に沿う金線
        for side in (1, -1):
            pts = []
            for i in range(121):
                s = 0.03 + 0.94 * i / 120
                z = S.WALES[1][0] + S.WALES[1][1] + 250
                x = S.hull_x_at(s, z)
                z2 = S.wale_z(x, S.WALES[1][0]) + S.WALES[1][1] + 250
                b = S.halfbreadth(x, z2)
                if b is not None:
                    pts.append(V(x, side * (b + 25), z2))
            sp.append(pts)
        o = curve_obj("GoldTrim", sp, 0.07, gold, parent=self.ship, res=2)
        grow_curve(o, f0, f0 + 8)
        # 船尾: 窓・回廊・紋章板・船尾回廊
        mb = MeshBuilder()
        z0, z1 = S.STERN_WINDOW_Z
        zc = (z0 + z1) / 2
        xs = S.stern_x(zc)
        for ya, yb in S.STERN_WINDOWS:
            xw = S.stern_x(z0) - 25
            mb.box(V(xw, (ya + yb) / 2, zc), (0.06, (yb - ya) * M, (z1 - z0) * M), 1)
            mb.box(V(xw - 30, (ya + yb) / 2, z1 + 60), (0.1, (yb - ya) * M + 0.2, 0.12), 0)
            mb.box(V(xw - 30, (ya + yb) / 2, z0 - 60), (0.1, (yb - ya) * M + 0.2, 0.12), 0)
            mb.box(V(xw - 30, (ya + yb) / 2, zc), (0.08, 0.06, (z1 - z0) * M), 0)
        gz = S.STERN_GALLERY_Z
        gb = (S.halfbreadth(S.stern_x(gz) + 10, gz) or 3500) * M
        xg = S.stern_x(gz) * M - 0.55
        mb.box(Vector((xg, 0, gz * M)), (1.1, 2 * gb, 0.14), 2)
        mb.box(Vector((xg - 0.5, 0, gz * M + 0.75)), (0.1, 2 * gb, 0.1), 0)
        for i in range(-10, 11):
            mb.cyl(Vector((xg - 0.5, gb * i / 10.5, gz * M)), Vector((xg - 0.5, gb * i / 10.5, gz * M + 0.75)),
                   0.035, 0.035, 0, segs=6)
        pz0, pz1 = S.STERN_PANEL_Z
        zcp = (pz0 + pz1) / 2
        xp = S.stern_x(zcp) * M - 0.04
        ring = [Vector((xp, 1.5 * math.cos(a), zcp * M + 0.56 * math.sin(a))) for a in
                [2 * math.pi * i / 32 for i in range(32)]]
        mb.add(ring + [Vector((xp, 0, zcp * M))], [(i, (i + 1) % 32, 32) for i in range(32)], 0)
        qx0, qx1, qz0, qz1, qo = S.QUARTER_GALLERY
        for side in (1, -1):
            for i in range(4):
                xa = qx0 + (qx1 - qx0) * i / 4
                xb = qx0 + (qx1 - qx0) * (i + 1) / 4
                xm = (xa + xb) / 2
                b = (S.halfbreadth(xm, qz0 + 1200) or 4000)
                bulge = qo * math.sin(math.pi * (i + 0.5) / 4) ** 0.6
                mb.box(V(xm, side * (b + bulge / 2), (qz0 + qz1) / 2), ((xb - xa) * M + 0.02, bulge * M + 0.1,
                                                                       (qz1 - qz0) * M), 3)
                mb.box(V(xm, side * (b + bulge + 40), qz0 + 1300), ((xb - xa) * M * 0.6, 0.06, 0.8), 1)
            mb.box(V((qx0 + qx1) / 2, side * ((S.halfbreadth((qx0 + qx1) / 2, qz1) or 4000) + qo / 2), qz1 + 80),
                   ((qx1 - qx0) * M, qo * M + 0.2, 0.16), 0)
            mb.box(V((qx0 + qx1) / 2, side * ((S.halfbreadth((qx0 + qx1) / 2, qz0) or 4000) + qo / 2), qz0 - 80),
                   ((qx1 - qx0) * M, qo * M + 0.2, 0.16), 0)
        o = mb.obj("SternDecor", [gold, self.mats["window"], self.mats["dark"], self.mats["upper"]], parent=self.ship)
        pop_scale(o, f0 + 2, dur=6, overshoot=1.04)
        # 船首像（金の獅子・簡略形）
        fx, fz = S.FIGUREHEAD
        mb = MeshBuilder()
        mb.cyl(V(fx - 900, 0, fz - 700), V(fx + 200, 0, fz + 200), 0.38, 0.45, 0, segs=14)
        mb.cyl(V(fx + 100, 0, fz + 100), V(fx + 600, 0, fz + 500), 0.55, 0.32, 0, segs=14)
        mb.cyl(V(fx + 500, 0, fz + 450), V(fx + 800, 0, fz + 450), 0.22, 0.12, 0, segs=10)
        for side in (1, -1):
            mb.cyl(V(fx + 300, side * 250, fz - 100), V(fx + 700, side * 250, fz - 500), 0.11, 0.08, 0, segs=8)
        o = mb.obj("Figurehead", [gold], parent=self.ship, origin=V(fx, 0, fz), smooth=True)
        pop_scale(o, f0 + 3, dur=6, overshoot=1.15)
        # 角灯
        self.lantern_objs = []
        for k, (y, sc2) in enumerate(S.LANTERNS):
            lx, ly, lz = S.lantern_base(y)
            base = V(lx, ly, lz)
            r = S.LANTERN_R * M * sc2
            h = S.LANTERN_H * M * sc2
            mb = MeshBuilder()
            mb.cyl(base + Vector((0, 0, -0.25)), base, 0.06, 0.06, 0, segs=8)
            mb.cyl(base, base + Vector((0, 0, 0.12)), r * 0.8, r, 0, segs=6)
            mb.cyl(base + Vector((0, 0, 0.12)), base + Vector((0, 0, h * 0.72)), r, r * 1.15, 1, segs=6, caps=False)
            for i in range(6):
                a = 2 * math.pi * i / 6
                p0 = base + Vector((r * math.cos(a), r * math.sin(a), 0.12))
                p1 = base + Vector((r * 1.15 * math.cos(a), r * 1.15 * math.sin(a), h * 0.72))
                mb.cyl(p0, p1, 0.035, 0.035, 0, segs=5)
            mb.cyl(base + Vector((0, 0, h * 0.72)), base + Vector((0, 0, h)), r * 1.2, 0.05, 0, segs=6)
            mb.cyl(base + Vector((0, 0, h)), base + Vector((0, 0, h + 0.18)), 0.07, 0.02, 0, segs=6)
            o = mb.obj(f"Lantern_{k}", [gold, self.mats["lantern"]], parent=self.ship, origin=base)
            pop_scale(o, f0 + 5 + k, dur=6, overshoot=1.2)
            light = bpy.data.lights.new(f"LanternLight_{k}", "POINT")
            light.color = (1.0, 0.62, 0.28)
            light.energy = 0.0
            light.shadow_soft_size = 0.2
            lo = bpy.data.objects.new(f"LanternLight_{k}", light)
            lo.location = base + Vector((0, 0, h * 0.45))
            link(lo, self.ship)
            self.lantern_objs.append(lo)
        # ドクロ旗
        mx = S.mast_x("main", S.FLAG_POLE[1])
        fl, fh = (v * M for v in S.FLAG_SIZE)
        top = S.FLAG_POLE[1] * M - 0.1
        mb = MeshBuilder()
        nu, nv = 24, 14
        rows = [[Vector((-fl * i / nu, 0, -fh * j / nv)) for i in range(nu + 1)] for j in range(nv + 1)]
        mb.grid(rows)
        for k in range(len(mb.uv)):
            mb.uv[k] = [(1 - u, 1 - v) for u, v in mb.uv[k]]   # 右舷（カメラ側）から正しい向きに見える
        o = mb.obj("JollyRoger", [self.mats["flag"]], parent=self.ship, origin=Vector((0, 0, 0)))
        o.location = (mx * M, 0, top)
        w = o.modifiers.new("wave", "WAVE")
        w.use_normal = True
        w.use_x = True
        w.use_y = False
        w.height = 0.22
        w.width = 1.6
        w.narrowness = 1.5
        w.speed = 0.12
        w.start_position_x = 0.0
        w.time_offset = 0
        pop_scale(o, f0 + 9, dur=6, overshoot=1.1)
        for name in ("fore", "mizzen"):
            mm = S.MASTS[name]
            x, z = S.mast_x(name, mm["truck"]) * M, (mm["truck"] + 250) * M
            mb = MeshBuilder()
            nu = 20
            pts = []
            for i in range(nu + 1):
                t = i / nu
                pts.append([Vector((-4.2 * t, 0, -0.25 + 0.25 * t)), Vector((-4.2 * t, 0, -0.25 - 0.25 * (1 - t) - 0.0))])
            rows = [[p[0] for p in pts], [p[1] for p in pts]]
            mb.grid(rows)
            o2 = mb.obj(f"Pennant_{name}", [self.mats["pennant"]], parent=self.ship)
            o2.location = (x, 0, z)
            w2 = o2.modifiers.new("wave", "WAVE")
            w2.use_normal = True
            w2.use_y = False
            w2.height = 0.2
            w2.width = 1.0
            w2.speed = 0.15
            pop_scale(o2, f0 + 10, dur=6)

    # ------------------------------------------------------------ 4. 海・空
    def build_sea(self):
        bpy.ops.mesh.primitive_plane_add(size=2)
        sea = bpy.context.object
        sea.name = "Ocean"
        oc = sea.modifiers.new("ocean", "OCEAN")
        oc.geometry_mode = "GENERATE"
        oc.resolution = 7
        oc.spatial_size = 60
        oc.repeat_x = 6
        oc.repeat_y = 5
        oc.wave_scale = 0.9
        oc.choppiness = 1.1
        oc.wind_velocity = 9.0
        oc.wave_alignment = 0.4
        oc.wave_direction = 0.3
        oc.use_foam = True
        oc.foam_coverage = 0.04
        oc.foam_layer_name = "foam"
        oc.use_normals = True
        oc.time = 0.0
        oc.keyframe_insert("time", frame=0)
        oc.time = T.MAIN_END / T.FPS * 1.0
        oc.keyframe_insert("time", frame=T.MAIN_END)
        set_interp(sea, 'modifiers["ocean"].time', "LINEAR")
        self.sea = sea
        wm, nt, out = new_mat("Water")
        N, L = nt.nodes, nt.links
        b = N.new("ShaderNodeBsdfPrincipled")
        b.inputs["Base Color"].default_value = (0.004, 0.02, 0.03, 1)
        b.inputs["Roughness"].default_value = 0.1
        b.inputs["IOR"].default_value = 1.33
        at = N.new("ShaderNodeAttribute")
        at.attribute_name = "foam"
        fm = N.new("ShaderNodeMapRange")
        fm.inputs["From Min"].default_value = 0.55
        fm.inputs["From Max"].default_value = 1.0
        L.new(at.outputs["Fac"], fm.inputs[0])
        mix = N.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        L.new(fm.outputs[0], mix.inputs["Factor"])
        mix.inputs["A"].default_value = (0.004, 0.02, 0.03, 1)
        mix.inputs["B"].default_value = (0.75, 0.72, 0.68, 1)
        L.new(mix.outputs["Result"], b.inputs["Base Color"])
        L.new(b.outputs[0], out.inputs[0])
        sea.data.materials.append(wm)
        self.water_mat = wm
        # 生成される格子の大きさから中心を合わせる
        dg = bpy.context.evaluated_depsgraph_get()
        ev = sea.evaluated_get(dg)
        xs = [v.co.x for v in ev.data.vertices]
        ys = [v.co.y for v in ev.data.vertices]
        cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
        self.sea_extent = (max(xs) - min(xs), max(ys) - min(ys))
        sea.location = (22.0 - cx, -40.0 - cy, SEA_Z - 14.0)
        # 遠景の水平な海
        mb = MeshBuilder()
        R = 4000.0
        mb.add([Vector((-R, -R, 0)), Vector((R, -R, 0)), Vector((R, R, 0)), Vector((-R, R, 0))], [(0, 1, 2, 3)], 0)
        fm2 = principled("FarWater", (0.004, 0.02, 0.03), 0.18)
        bsdf_of(fm2).inputs["IOR"].default_value = 1.33
        add_haze(wm)
        add_haze(fm2)
        far = mb.obj("FarSea", [fm2])
        far.location = (0, 0, SEA_Z - 16.0)
        for o in (sea, far):
            o.keyframe_insert("location", frame=T.SEA_RISE[0])
            o.location.z = (SEA_Z if o is sea else SEA_Z - 2.0)
            o.visible_shadow = False
            o.keyframe_insert("location", frame=T.SEA_RISE[1])
            hide_until(o, T.SEA_RISE[0])
        print("ocean extent", self.sea_extent, "verts", len(ev.data.vertices))

    def build_wake(self):
        mb = MeshBuilder()
        Lw = 70.0
        nu, nv = 150, 12
        xs_stern = S.stern_x(S.DRAFT) * M
        # 船尾の後ろの白い帯
        rows = []
        for j in range(nv + 1):
            v = j / nv * 2 - 1
            row = []
            for i in range(nu + 1):
                u = i / nu
                x = xs_stern + 1.0 - Lw * u
                half = 3.0 + 7.0 * u
                row.append(Vector((x, v * half, 0)))
            rows.append(row)
        mb.grid(rows)
        # 船首から斜めに広がる波
        xs_bow = S.stem_x(S.DRAFT) * M
        ang = math.radians(19.0)
        for side in (1, -1):
            rows = []
            for j in range(nv + 1):
                v = j / nv * 2 - 1
                row = []
                for i in range(nu + 1):
                    u = i / nu
                    d = Lw * 1.25 * u
                    cxp = xs_bow - 2.0 - d * math.cos(ang)
                    cyp = side * (S.HALF_BEAM * M * min(1.0, 0.2 + u * 6) + d * math.sin(ang))
                    w = 1.0 + 3.0 * u
                    row.append(Vector((cxp, cyp + v * w, 0)))
                rows.append(row)
            mb.grid(rows)
        wm, nt, out = new_mat("Wake")
        wm.surface_render_method = "BLENDED"
        N, L = nt.nodes, nt.links
        uv = N.new("ShaderNodeUVMap")
        sep = N.new("ShaderNodeSeparateXYZ")
        L.new(uv.outputs[0], sep.inputs[0])
        geo = N.new("ShaderNodeNewGeometry")
        nz = N.new("ShaderNodeTexNoise")
        nz.inputs["Scale"].default_value = 0.45
        nz.inputs["Detail"].default_value = 6
        L.new(geo.outputs["Position"], nz.inputs[0])
        foam = N.new("ShaderNodeMapRange")
        foam.inputs["From Min"].default_value = 0.42
        foam.inputs["From Max"].default_value = 0.62
        L.new(nz.outputs["Fac"], foam.inputs[0])
        # 長さ方向のフェード（u）と、伸びる長さ WakeLen
        val = N.new("ShaderNodeValue")
        val.outputs[0].default_value = 0.0
        self.wake_len = val
        dist = N.new("ShaderNodeMath")
        dist.operation = "SUBTRACT"
        L.new(val.outputs[0], dist.inputs[0])
        L.new(sep.outputs["X"], dist.inputs[1])
        grow = N.new("ShaderNodeMath")
        grow.operation = "MULTIPLY"
        grow.use_clamp = True
        grow.inputs[1].default_value = 8.0
        L.new(dist.outputs[0], grow.inputs[0])
        fade = N.new("ShaderNodeMapRange")
        fade.inputs["From Min"].default_value = 1.0
        fade.inputs["From Max"].default_value = 0.0
        L.new(sep.outputs["X"], fade.inputs[0])
        across = N.new("ShaderNodeMath")
        across.operation = "PINGPONG"
        across.inputs[1].default_value = 0.5
        L.new(sep.outputs["Y"], across.inputs[0])
        edge = N.new("ShaderNodeMapRange")
        edge.inputs["From Min"].default_value = 0.0
        edge.inputs["From Max"].default_value = 0.35
        L.new(across.outputs[0], edge.inputs[0])
        a1 = N.new("ShaderNodeMath")
        a1.operation = "MULTIPLY"
        L.new(foam.outputs[0], a1.inputs[0])
        L.new(fade.outputs[0], a1.inputs[1])
        a2 = N.new("ShaderNodeMath")
        a2.operation = "MULTIPLY"
        L.new(a1.outputs[0], a2.inputs[0])
        L.new(edge.outputs[0], a2.inputs[1])
        a3 = N.new("ShaderNodeMath")
        a3.operation = "MULTIPLY"
        L.new(a2.outputs[0], a3.inputs[0])
        L.new(grow.outputs[0], a3.inputs[1])
        b = N.new("ShaderNodeBsdfPrincipled")
        b.inputs["Base Color"].default_value = (0.85, 0.83, 0.80, 1)
        b.inputs["Roughness"].default_value = 0.6
        L.new(a3.outputs[0], b.inputs["Alpha"])
        L.new(b.outputs[0], out.inputs[0])
        o = mb.obj("Wake", [wm], parent=self.ship_root)
        o.location = (0, 0, SEA_Z + 0.12)
        sw = o.modifiers.new("shrink", "SHRINKWRAP")
        sw.target = self.sea
        sw.wrap_method = "PROJECT"
        sw.use_project_z = True
        sw.use_negative_direction = True
        sw.use_positive_direction = True
        sw.offset = 0.18
        o.visible_shadow = False
        hide_until(o, T.SEA_RISE[1])
        socket_key(val.outputs[0], T.SAIL_GO - 6, 0.0)
        socket_key(val.outputs[0], T.SAIL_GO + 40, 0.45)
        socket_key(val.outputs[0], T.MAIN_END, 1.1)

    def build_world(self):
        w = bpy.data.worlds.new("World")
        self.sc.world = w
        try:
            w.probe_resolution = "1024"
        except Exception:
            pass
        try:
            w.use_nodes = True
        except Exception:
            pass
        nt = w.node_tree
        for n in list(nt.nodes):
            nt.nodes.remove(n)
        N, L = nt.nodes, nt.links
        out = N.new("ShaderNodeOutputWorld")
        tc = N.new("ShaderNodeTexCoord")
        nrm = N.new("ShaderNodeVectorMath")
        nrm.operation = "NORMALIZE"
        L.new(tc.outputs["Generated"], nrm.inputs[0])
        sep = N.new("ShaderNodeSeparateXYZ")
        L.new(nrm.outputs[0], sep.inputs[0])
        mr = N.new("ShaderNodeMapRange")
        mr.inputs["From Min"].default_value = -0.08
        mr.inputs["From Max"].default_value = 0.75
        L.new(sep.outputs["Z"], mr.inputs[0])
        ramp = N.new("ShaderNodeValToRGB")
        cr = ramp.color_ramp
        cr.elements[0].position = 0.0
        cr.elements[0].color = (0.30, 0.10, 0.06, 1)
        cr.elements[1].position = 1.0
        cr.elements[1].color = (0.03, 0.05, 0.16, 1)
        for pos, col in ((0.10, (1.0, 0.36, 0.10, 1)), (0.2, (0.85, 0.26, 0.20, 1)), (0.42, (0.30, 0.13, 0.30, 1)),
                         (0.7, (0.05, 0.06, 0.18, 1))):
            e = cr.elements.new(pos)
            e.color = col
        L.new(mr.outputs[0], ramp.inputs[0])
        # 太陽の光輪
        dot = N.new("ShaderNodeVectorMath")
        dot.operation = "DOT_PRODUCT"
        L.new(nrm.outputs[0], dot.inputs[0])
        dot.inputs[1].default_value = tuple(SUN_SUNSET)
        cl = N.new("ShaderNodeMath")
        cl.operation = "MAXIMUM"
        cl.inputs[1].default_value = 0.0
        L.new(dot.outputs["Value"], cl.inputs[0])
        p1 = N.new("ShaderNodeMath")
        p1.operation = "POWER"
        p1.inputs[1].default_value = 900.0
        L.new(cl.outputs[0], p1.inputs[0])
        p2 = N.new("ShaderNodeMath")
        p2.operation = "POWER"
        p2.inputs[1].default_value = 10.0
        L.new(cl.outputs[0], p2.inputs[0])
        s1 = N.new("ShaderNodeMath")
        s1.operation = "MULTIPLY_ADD"
        s1.inputs[1].default_value = 14.0
        L.new(p1.outputs[0], s1.inputs[0])
        s2 = N.new("ShaderNodeMath")
        s2.operation = "MULTIPLY"
        s2.inputs[1].default_value = 1.0
        L.new(p2.outputs[0], s2.inputs[0])
        L.new(s2.outputs[0], s1.inputs[2])
        sunc = N.new("ShaderNodeVectorMath")
        sunc.operation = "SCALE"
        sunc.inputs[0].default_value = (1.0, 0.62, 0.30)
        L.new(s1.outputs[0], sunc.inputs["Scale"])
        glow = N.new("ShaderNodeVectorMath")      # 係数で頭打ちにならない加算
        glow.operation = "ADD"
        L.new(ramp.outputs[0], glow.inputs[0])
        L.new(sunc.outputs[0], glow.inputs[1])
        # 雲（方向ベクトルを水平面へ投影したノイズ）
        add = N.new("ShaderNodeMath")
        add.operation = "ADD"
        add.inputs[1].default_value = 0.12
        L.new(sep.outputs["Z"], add.inputs[0])
        comb = N.new("ShaderNodeCombineXYZ")
        for ax in ("X", "Y"):
            d = N.new("ShaderNodeMath")
            d.operation = "DIVIDE"
            L.new(sep.outputs[ax], d.inputs[0])
            L.new(add.outputs[0], d.inputs[1])
            L.new(d.outputs[0], comb.inputs[ax])
        mp = N.new("ShaderNodeMapping")
        mp.inputs["Scale"].default_value = (0.9, 2.6, 1)
        L.new(comb.outputs[0], mp.inputs[0])
        cn = N.new("ShaderNodeTexNoise")
        cn.inputs["Scale"].default_value = 1.1
        cn.inputs["Detail"].default_value = 7
        cn.inputs["Roughness"].default_value = 0.62
        L.new(mp.outputs[0], cn.inputs[0])
        cm = N.new("ShaderNodeMapRange")
        cm.inputs["From Min"].default_value = 0.5
        cm.inputs["From Max"].default_value = 0.72
        L.new(cn.outputs["Fac"], cm.inputs[0])
        hz = N.new("ShaderNodeMapRange")       # 雲は低い空だけ
        hz.inputs["From Min"].default_value = 0.42
        hz.inputs["From Max"].default_value = 0.03
        L.new(sep.outputs["Z"], hz.inputs[0])
        hz2 = N.new("ShaderNodeMapRange")
        hz2.inputs["From Min"].default_value = -0.01
        hz2.inputs["From Max"].default_value = 0.04
        L.new(sep.outputs["Z"], hz2.inputs[0])
        cmask = N.new("ShaderNodeMath")
        cmask.operation = "MULTIPLY"
        L.new(cm.outputs[0], cmask.inputs[0])
        L.new(hz.outputs[0], cmask.inputs[1])
        cmask2 = N.new("ShaderNodeMath")
        cmask2.operation = "MULTIPLY"
        L.new(cmask.outputs[0], cmask2.inputs[0])
        L.new(hz2.outputs[0], cmask2.inputs[1])
        ccol = N.new("ShaderNodeMix")
        ccol.data_type = "RGBA"
        L.new(p2.outputs[0], ccol.inputs["Factor"])
        ccol.inputs["A"].default_value = (0.22, 0.10, 0.17, 1)
        ccol.inputs["B"].default_value = (1.4, 0.55, 0.22, 1)
        sky = N.new("ShaderNodeMix")
        sky.data_type = "RGBA"
        L.new(cmask2.outputs[0], sky.inputs["Factor"])
        L.new(glow.outputs[0], sky.inputs["A"])
        L.new(ccol.outputs["Result"], sky.inputs["B"])
        bg_sky = N.new("ShaderNodeBackground")
        L.new(sky.outputs["Result"], bg_sky.inputs["Color"])
        bg_sky.inputs["Strength"].default_value = 0.55
        # 書斎（巻物の場面）
        bg_room = N.new("ShaderNodeBackground")
        bg_room.inputs["Color"].default_value = (0.05, 0.034, 0.022, 1)
        bg_room.inputs["Strength"].default_value = 1.0
        mix = N.new("ShaderNodeMixShader")
        L.new(bg_room.outputs[0], mix.inputs[1])
        L.new(bg_sky.outputs[0], mix.inputs[2])
        L.new(mix.outputs[0], out.inputs[0])
        socket_key(mix.inputs[0], T.SKY[0], 0.0)
        socket_key(mix.inputs[0], T.SKY[1], 1.0)

    def build_lights(self):
        sun = bpy.data.lights.new("Sun", "SUN")
        sun.angle = math.radians(3.4)
        so = link(bpy.data.objects.new("Sun", sun))

        def aim(d):
            return (-d).to_track_quat("-Z", "Y").to_euler()

        sun.color = (1.0, 0.93, 0.82)
        sun.energy = 3.2
        so.rotation_euler = aim(SUN_DAY)
        for f in (0, T.SKY[0]):
            so.keyframe_insert("rotation_euler", frame=f)
            sun.keyframe_insert("energy", frame=f)
            sun.keyframe_insert("color", frame=f)
        so.rotation_euler = aim(SUN_SUNSET)
        sun.color = (1.0, 0.56, 0.26)
        sun.energy = 4.0
        so.keyframe_insert("rotation_euler", frame=T.SKY[1])
        sun.keyframe_insert("energy", frame=T.SKY[1])
        sun.keyframe_insert("color", frame=T.SKY[1])
        # 巻物の場面の柔らかい補助光
        fill = bpy.data.lights.new("Fill", "AREA")
        fill.size = 60
        fill.color = (1.0, 0.85, 0.65)
        fill.energy = 60000
        fo = link(bpy.data.objects.new("Fill", fill))
        fo.location = (22, -30, 60)
        fo.rotation_euler = aim(Vector((0, -0.5, 1)).normalized())
        fill.keyframe_insert("energy", frame=T.WIRES_RISE[1])
        fill.energy = 0.0
        fill.keyframe_insert("energy", frame=T.SKY[1])
        # 夕景で船の影側を少し持ち上げる
        rim = bpy.data.lights.new("SkyFill", "SUN")
        rim.color = (0.55, 0.6, 0.9)
        rim.energy = 0.0
        rim.angle = math.radians(20)
        ro = link(bpy.data.objects.new("SkyFill", rim))
        ro.rotation_euler = aim(Vector((0.2, -1.0, 0.45)).normalized())
        rim.keyframe_insert("energy", frame=T.SKY[0])
        rim.energy = 0.45
        rim.keyframe_insert("energy", frame=T.SKY[1])

    # ------------------------------------------------------------ 5. 浮かぶ・進む
    def animate_ship(self):
        root, ship = self.ship_root, self.ship
        # 浮かぶ
        root.location = (0, 0, 0)
        root.keyframe_insert("location", frame=T.SEA_RISE[1] - 10)
        root.location = (0, 0, 0.55)
        root.keyframe_insert("location", frame=T.SEA_RISE[1] + 4)
        root.location = (0, 0, 0.0)
        root.keyframe_insert("location", frame=T.SEA_RISE[1] + 22)
        # 進む（加速）
        root.keyframe_insert("location", frame=T.SAIL_GO)
        root.location = (2.2, 0, 0.0)
        root.keyframe_insert("location", frame=T.SAIL_GO + 45)
        root.location = (11.0, 0, 0.0)
        root.keyframe_insert("location", frame=T.MAIN_END + 20)
        fc = find_fcurve(root, "location", 0)
        if fc:
            fc.keyframe_points[-1].handle_left_type = "AUTO"
        # 波の揺れ（ノイズ）
        ship.rotation_euler = (0, 0, 0)
        ship.keyframe_insert("rotation_euler", frame=0)
        ship.keyframe_insert("location", frame=0)
        # 砲撃の反動（右舷へ発砲 → 左舷側へ傾く: x 軸回り負）
        for f in T.SHOTS:
            ship.rotation_euler = (0, 0, 0)
            ship.keyframe_insert("rotation_euler", frame=f)
            ship.rotation_euler = (math.radians(-1.3), 0, 0)
            ship.keyframe_insert("rotation_euler", frame=f + 3)
            ship.rotation_euler = (0, 0, 0)
            ship.keyframe_insert("rotation_euler", frame=f + 10)
        for path, idx, strength, scale in (("rotation_euler", 0, math.radians(2.2), 38),
                                           ("rotation_euler", 1, math.radians(1.3), 52),
                                           ("location", 2, 0.22, 30)):
            fc = find_fcurve(ship, path, idx)
            mod = fc.modifiers.new("NOISE")
            mod.scale = scale
            mod.strength = strength * 2
            mod.phase = random.random() * 50
            mod.use_restricted_range = True
            mod.frame_start = T.SEA_RISE[1] - 6
            mod.frame_end = 9999
            mod.blend_in = 24

    def animate_lanterns(self):
        a, b = T.LANTERNS_ON
        e = self.lantern_emit.inputs["Strength"]
        socket_key(e, a, 0.2)
        socket_key(e, b, 22.0)
        we = self.window_emit.inputs["Strength"]
        socket_key(we, a + 2, 0.0)
        socket_key(we, b + 6, 6.0)
        for k, lo in enumerate(self.lantern_objs):
            L = lo.data
            L.energy = 0
            L.keyframe_insert("energy", frame=a + k * 2)
            L.energy = 900
            L.keyframe_insert("energy", frame=b + k * 2)
            fc = find_fcurve(L, "energy")
            if fc:
                mod = fc.modifiers.new("NOISE")
                mod.scale = 3
                mod.strength = 200
                mod.use_restricted_range = True
                mod.frame_start = b + k * 2
                mod.frame_end = 9999

    # ------------------------------------------------------------ 6. 大砲・題字
    def build_cannon_fire(self):
        flash_m, fe = emission_mat("MuzzleFlash", (1.0, 0.55, 0.18), 30.0)
        for k, (f, (_, _, x)) in enumerate(zip(T.SHOTS, S.FIRING_GUNS)):
            muzzle = self.gun_muzzles[(-1, "lower", x)]
            mb = MeshBuilder()
            mb.cyl(Vector((0, 0, 0)), Vector((0, -3.2, 0)), 0.55, 0.05, 0, segs=12)
            fl = mb.obj(f"Flash_{k}", [flash_m], parent=self.ship, origin=Vector((0, 0, 0)))
            fl.location = muzzle
            bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.9)
            ball = bpy.context.object
            ball.name = f"FlashBall_{k}"
            ball.data.materials.append(flash_m)
            ball.parent = self.ship
            ball.location = muzzle + Vector((0, -0.6, 0))
            for o in (fl, ball):
                o.scale = (0.001, 0.001, 0.001)
                o.keyframe_insert("scale", frame=f - 1)
                o.scale = (1.4, 1.4, 1.4)
                o.keyframe_insert("scale", frame=f + 1)
                o.scale = (0.5, 0.5, 0.5)
                o.keyframe_insert("scale", frame=f + 3)
                o.scale = (0.001, 0.001, 0.001)
                o.keyframe_insert("scale", frame=f + 5)
                hide_until(o, f - 1, f + 6)
            light = bpy.data.lights.new(f"FlashLight_{k}", "POINT")
            light.color = (1.0, 0.6, 0.25)
            light.shadow_soft_size = 0.5
            lo = link(bpy.data.objects.new(f"FlashLight_{k}", light), self.ship)
            lo.location = muzzle + Vector((0, -2.0, 0))
            for fr, en in ((f - 1, 0), (f + 1, 120000), (f + 6, 0)):
                light.energy = en
                light.keyframe_insert("energy", frame=fr)
            # 煙
            sm, nt, out = new_mat(f"Smoke_{k}")
            sm.surface_render_method = "BLENDED"
            N, L = nt.nodes, nt.links
            lw = N.new("ShaderNodeLayerWeight")
            lw.inputs["Blend"].default_value = 0.5
            soft = N.new("ShaderNodeMath")
            soft.operation = "POWER"
            soft.inputs[1].default_value = 2.5
            inv = N.new("ShaderNodeMath")
            inv.operation = "SUBTRACT"
            inv.inputs[0].default_value = 1.0
            L.new(lw.outputs["Facing"], inv.inputs[1])
            L.new(inv.outputs[0], soft.inputs[0])
            nz = N.new("ShaderNodeTexNoise")
            nz.inputs["Scale"].default_value = 2.5
            nz.inputs["Detail"].default_value = 4
            nzr = N.new("ShaderNodeMapRange")
            nzr.inputs["From Min"].default_value = 0.35
            nzr.inputs["From Max"].default_value = 0.7
            L.new(nz.outputs["Fac"], nzr.inputs[0])
            a1 = N.new("ShaderNodeMath")
            a1.operation = "MULTIPLY"
            L.new(soft.outputs[0], a1.inputs[0])
            L.new(nzr.outputs[0], a1.inputs[1])
            a2 = N.new("ShaderNodeMath")
            a2.operation = "MULTIPLY"
            L.new(a1.outputs[0], a2.inputs[0])
            socket_key(a2.inputs[1], f, 0.0)
            socket_key(a2.inputs[1], f + 2, 1.0)
            socket_key(a2.inputs[1], f + 30, 0.6)
            socket_key(a2.inputs[1], f + 70, 0.0)
            bs = N.new("ShaderNodeBsdfPrincipled")
            bs.inputs["Base Color"].default_value = (0.66, 0.62, 0.58, 1)
            bs.inputs["Roughness"].default_value = 1.0
            bs.inputs["Emission Color"].default_value = (1.0, 0.5, 0.2, 1)
            socket_key(bs.inputs["Emission Strength"], f, 6.0)
            socket_key(bs.inputs["Emission Strength"], f + 5, 0.0)
            L.new(a2.outputs[0], bs.inputs["Alpha"])
            L.new(bs.outputs[0], out.inputs[0])
            for i in range(14):
                bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1.0)
                p = bpy.context.object
                p.name = f"Smoke_{k}_{i}"
                p.data.materials.append(sm)
                p.parent = self.ship_root
                p.visible_shadow = False
                bpy.ops.object.shade_smooth()
                start = muzzle + Vector((random.uniform(-0.3, 0.3), -0.8, random.uniform(-0.2, 0.2)))
                end = muzzle + Vector((random.uniform(-3.5, 1.5) - 4.0, -random.uniform(4.0, 9.0),
                                       random.uniform(0.5, 3.5)))
                r0, r1 = random.uniform(0.5, 0.9), random.uniform(2.4, 4.2)
                p.location = start
                p.scale = (r0, r0, r0)
                p.keyframe_insert("location", frame=f)
                p.keyframe_insert("scale", frame=f)
                p.location = start.lerp(end, 0.55)
                p.scale = (r1 * 0.7,) * 3
                p.keyframe_insert("location", frame=f + 8)
                p.keyframe_insert("scale", frame=f + 8)
                p.location = end
                p.scale = (r1,) * 3
                p.keyframe_insert("location", frame=f + 70)
                p.keyframe_insert("scale", frame=f + 70)
                hide_until(p, f, f + 72)

    def build_camera(self):
        cam = bpy.data.cameras.new("Camera")
        cam.lens = 50
        cam.clip_start = 0.5
        cam.clip_end = 6000
        co = link(bpy.data.objects.new("Camera", cam))
        self.sc.camera = co
        tgt = empty("CamTarget")
        con = co.constraints.new("TRACK_TO")
        con.target = tgt
        con.track_axis = "TRACK_NEGATIVE_Z"
        con.up_axis = "UP_Y"
        self.cam, self.cam_target = co, tgt
        cx = self.paper_cx
        root_fc = find_fcurve(self.ship_root, "location", 0)

        def sx(f):
            return root_fc.evaluate(f) if root_fc else 0.0

        keys = [
            # frame, camera, target, lens
            (0, (cx, -0.6, 92.0), (cx, 0, 0), 50),
            (T.WIRES_GLOW[0], (cx, -0.6, 90.0), (cx, 0, 0), 50),
            (118, (cx, -40.0, 62.0), (cx - 1.0, 0, 2.0), 45),
            (T.KEEL[0] + 4, (58.0, -46.0, 32.0), (22.0, 0, 4.0), 40),
            (176, (50.0, -40.0, 15.0), (20.0, 0, 5.5), 35),
            (216, (44.0, -46.0, 22.0), (21.0, 0, 8.0), 35),
            (250, (54.0, -58.0, 30.0), (22.0, 0, 15.0), 35),
            (T.DECOR[1], (58.0, -66.0, 25.0), (22.0, 0, 16.0), 35),
            (306, (60.0, -80.0, 20.0), (23.0, 0, 15.0), 35),
            (T.SKY[1], (64.0, -100.0, 13.0), (24.0, 0, 15.0), 35),
            (T.SAIL_GO, (64.0, -98.0, 12.0), (24.0, 0, 15.0), 35),
            (404, (68.0, -88.0, 9.0), (26.0, 0, 14.0), 35),
            (T.MAIN_END, (72.0, -82.0, 8.0), (27.0, 0, 15.5), 35),
        ]
        for f, c, t, lens in keys:
            off = sx(f) if f >= T.SAIL_GO else 0.0
            co.location = (c[0] + off, c[1], c[2])
            tgt.location = (t[0] + off, t[1], t[2])
            cam.lens = lens
            co.keyframe_insert("location", frame=f)
            tgt.keyframe_insert("location", frame=f)
            cam.keyframe_insert("lens", frame=f)
        # 少しの手持ち感
        for idx in range(3):
            fc = find_fcurve(co, "location", idx)
            mod = fc.modifiers.new("NOISE")
            mod.scale = 60
            mod.strength = 0.25
            mod.phase = idx * 13

    def build_title(self):
        cu = bpy.data.curves.new("Title", "FONT")
        cu.body = "海賊船"
        cu.font = bpy.data.fonts.load(FONT)
        cu.size = 1.55
        cu.extrude = 0.05
        cu.bevel_depth = 0.012
        cu.align_x = "CENTER"
        cu.align_y = "CENTER"
        cu.space_character = 1.1
        m = principled("TitleGold", (0.95, 0.58, 0.16), 0.25, 1.0, emit=(1.0, 0.48, 0.10), emit_strength=0.0)
        m.surface_render_method = "DITHERED"
        cu.materials.append(m)
        o = link(bpy.data.objects.new("Title", cu), self.cam)
        o.location = (0, -1.25, -7.0)
        bs = bsdf_of(m)
        a, b = T.TITLE
        socket_key(bs.inputs["Alpha"], a, 0.0)
        socket_key(bs.inputs["Alpha"], a + 10, 1.0)
        socket_key(bs.inputs["Emission Strength"], a, 0.0)
        socket_key(bs.inputs["Emission Strength"], a + 8, 3.0)
        socket_key(bs.inputs["Emission Strength"], b + 4, 0.6)
        # 題字の後ろの淡い影（読みやすくする）
        sm, nt, out = new_mat("TitleShade")
        sm.surface_render_method = "BLENDED"
        N, L = nt.nodes, nt.links
        tc = N.new("ShaderNodeTexCoord")
        mp = N.new("ShaderNodeMapping")
        mp.inputs["Location"].default_value = (-0.5, -0.5, 0)
        L.new(tc.outputs["UV"], mp.inputs[0])
        mp2 = N.new("ShaderNodeMapping")
        mp2.inputs["Scale"].default_value = (1.0, 3.2, 1)
        L.new(mp.outputs[0], mp2.inputs[0])
        ln = N.new("ShaderNodeVectorMath")
        ln.operation = "LENGTH"
        L.new(mp2.outputs[0], ln.inputs[0])
        rmp = N.new("ShaderNodeMapRange")
        rmp.inputs["From Min"].default_value = 0.5
        rmp.inputs["From Max"].default_value = 0.1
        L.new(ln.outputs["Value"], rmp.inputs[0])
        amt = N.new("ShaderNodeMath")
        amt.operation = "MULTIPLY"
        L.new(rmp.outputs[0], amt.inputs[0])
        socket_key(amt.inputs[1], a, 0.0)
        socket_key(amt.inputs[1], a + 10, 0.6)
        tb = N.new("ShaderNodeBsdfPrincipled")
        tb.inputs["Base Color"].default_value = (0.0, 0.0, 0.0, 1)
        L.new(amt.outputs[0], tb.inputs["Alpha"])
        L.new(tb.outputs[0], out.inputs[0])
        mb = MeshBuilder()
        mb.grid([[Vector((-5.2, -1.0, 0)), Vector((5.2, -1.0, 0))], [Vector((-5.2, 1.0, 0)), Vector((5.2, 1.0, 0))]])
        sh = mb.obj("TitleShade", [sm], parent=self.cam)
        sh.location = (0, -1.25, -7.3)
        hide_until(sh, a)
        o.scale = (0.8, 0.8, 0.8)
        o.keyframe_insert("scale", frame=a)
        o.scale = (1, 1, 1)
        o.keyframe_insert("scale", frame=b + 10)
        hide_until(o, a)

    def build_compositor(self):
        sc = self.sc
        ng = bpy.data.node_groups.new("Compositing", "CompositorNodeTree")
        ng.interface.new_socket("Image", in_out="OUTPUT", socket_type="NodeSocketColor")
        N, L = ng.nodes, ng.links
        rl = N.new("CompositorNodeRLayers")
        gl = N.new("CompositorNodeGlare")
        try:
            gl.inputs["Type"].default_value = "Bloom"
        except Exception:
            pass
        gl.inputs["Threshold"].default_value = 1.2
        gl.inputs["Strength"].default_value = 0.6
        gl.inputs["Size"].default_value = 0.6
        gout = N.new("NodeGroupOutput")
        L.new(rl.outputs["Image"], gl.inputs["Image"])
        L.new(gl.outputs["Image"], gout.inputs[0])
        sc.compositing_node_group = ng
        try:
            sc.render.use_compositing = True
        except Exception:
            pass

    # ------------------------------------------------------------ まとめ
    def build(self):
        self.build_paper()
        self.build_wires()
        self.build_keel()
        self.build_ribs()
        self.build_strakes()
        self.build_decks()
        self.build_guns()
        self.build_masts()
        self.build_yards()
        self.build_rigging()
        self.build_sails()
        self.build_decor()
        self.build_world()
        self.build_lights()
        self.build_sea()
        self.animate_ship()
        self.build_wake()
        self.animate_lanterns()
        self.build_cannon_fire()
        self.build_camera()
        self.build_title()
        self.build_compositor()
        # 船体は紙の上（竜骨下面 z=0）。海は SEA_Z まで満ちる。
        return self


def render_stills(frames, out_dir, pct=50, samples=None):
    sc = bpy.context.scene
    sc.render.resolution_percentage = pct
    if samples:
        sc.eevee.taa_render_samples = samples
    os.makedirs(out_dir, exist_ok=True)
    import time
    for f in frames:
        sc.frame_set(f)
        sc.render.filepath = os.path.join(out_dir, f"still_{f:04d}.png")
        t = time.time()
        bpy.ops.render.render(write_still=True)
        print(f"frame {f}: {time.time() - t:.1f}s", flush=True)


def main():
    args = sys.argv[1:]
    Scene().build()
    os.makedirs(BUILD, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=BLEND)
    print("saved", BLEND)
    if "--still" in args:
        frames = [int(v) for v in args[args.index("--still") + 1].split(",")]
        pct = int(args[args.index("--pct") + 1]) if "--pct" in args else 50
        render_stills(frames, os.path.join(BUILD, "stills"), pct)


if __name__ == "__main__":
    main()
