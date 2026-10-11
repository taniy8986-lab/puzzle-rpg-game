"""最後のロゴ（3.5 秒）: ブルちゃんのドクロ旗の紋章を立体にしたもの。

    /opt/bvenv/bin/python blender_logo.py                 # build/logo.blend を保存
    /opt/bvenv/bin/python blender_logo.py --still 500,540 # テスト静止画

フレーム番号は本編の続き（timeline.LOGO = 480〜563）。紋章は旗の絵柄と同じ要素:
白いドクロ・茶色のボブヘア（ぱっつん前髪）・ティールの三角ヘアピン・交差した骨。
"""
import math
import os
import sys

import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import timeline as T  # noqa: E402
from blender_scene import (MeshBuilder, emission_mat, find_fcurve, hide_until, link, new_mat,  # noqa: E402
                           principled, reset, socket_key, empty)

BUILD = os.path.join(HERE, "build")
BLEND = os.path.join(BUILD, "logo.blend")
F0, F1 = T.LOGO

BONE = (0.93, 0.90, 0.82)
HAIR = (0.26, 0.15, 0.095)
CLIP = (0.05, 0.55, 0.60)


def bone_mat():
    m = principled("LogoBone", BONE, 0.42)
    b = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    return m


def hair_mat():
    m, nt, out = new_mat("LogoHair")
    N, L = nt.nodes, nt.links
    tc = N.new("ShaderNodeTexCoord")
    mp = N.new("ShaderNodeMapping")          # 縦に流れる毛筋
    mp.inputs["Scale"].default_value = (14.0, 14.0, 0.9)
    L.new(tc.outputs["Object"], mp.inputs[0])
    wv = N.new("ShaderNodeTexNoise")
    wv.inputs["Scale"].default_value = 3.0
    wv.inputs["Detail"].default_value = 4.0
    L.new(mp.outputs[0], wv.inputs["Vector"])
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (HAIR[0] * 0.6, HAIR[1] * 0.6, HAIR[2] * 0.6, 1)
    ramp.color_ramp.elements[1].color = (*HAIR, 1)
    L.new(wv.outputs["Fac"], ramp.inputs[0])
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.25
    L.new(wv.outputs["Fac"], bump.inputs["Height"])
    b = N.new("ShaderNodeBsdfPrincipled")
    b.inputs["Roughness"].default_value = 0.35
    b.inputs["Anisotropic"].default_value = 0.6
    L.new(ramp.outputs[0], b.inputs["Base Color"])
    L.new(bump.outputs[0], b.inputs["Normal"])
    L.new(b.outputs[0], out.inputs[0])
    return m


def ellipsoid(name, c, s, mat, parent, segs=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segs, ring_count=segs // 2, radius=1.0)
    o = bpy.context.object
    o.name = name
    o.location = c
    o.scale = s
    o.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    o.parent = parent
    return o


def rounded_box(name, c, size, mat, parent, bevel=0.12):
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    o = bpy.context.object
    o.name = name
    o.location = c
    o.scale = size
    o.data.materials.append(mat)
    bv = o.modifiers.new("bevel", "BEVEL")
    bv.width = bevel
    bv.segments = 5
    bpy.ops.object.shade_smooth()
    o.parent = parent
    return o


def hair_mesh():
    """ボブヘア: 頭を包む殻。正面の前髪より下を顔の窓として抜く。カメラは -y 側。"""
    nt, nz = 120, 80
    top, bot = 1.22, -0.88
    rows = []
    zs = [top - (top - bot) * j / nz for j in range(nz + 1)]
    for z in zs:
        if z > 0.08:
            rr = math.sqrt(max(1.14 ** 2 - (z - 0.08) ** 2, 0.0004))
        else:
            rr = 1.14 + 0.13 * min((0.08 - z) / 0.96, 1.0) ** 1.6
        row = []
        for i in range(nt):
            th = 2 * math.pi * i / nt
            row.append(Vector((rr * math.sin(th), -rr * math.cos(th), z)))
        rows.append(row)
    verts = [p for r in rows for p in r]
    faces = []
    for j in range(nz):
        for i in range(nt):
            i2 = (i + 1) % nt
            thc = 2 * math.pi * (i + 0.5) / nt
            dth = math.degrees(math.atan2(math.sin(thc), math.cos(thc)))
            zc = (zs[j] + zs[j + 1]) / 2
            bang = 0.33 + 0.035 * abs(((math.degrees(thc) / 7.0) % 2) - 1)
            if abs(dth) < 41 and zc < bang:
                continue        # 顔の窓
            faces.append((j * nt + i, j * nt + i2, (j + 1) * nt + i2, (j + 1) * nt + i))
    # 裾の内巻き（一番下の輪を少し内側へ）
    for i in range(nt):
        verts[nz * nt + i] = verts[nz * nt + i] * 0.93 + Vector((0, 0, 0.04))
    return verts, faces


def build():
    sc = reset()
    sc.frame_start = F0
    sc.frame_end = F1 - 1
    sc.eevee.taa_render_samples = 8
    bm, hm = bone_mat(), hair_mat()
    black = principled("LogoBlack", (0.01, 0.01, 0.012), 0.15)
    white_e, _ = emission_mat("LogoShine", (1, 1, 1), 6.0)
    clip = principled("LogoClip", CLIP, 0.18, 0.3)

    root = empty("Emblem")
    head = empty("Head", parent=root)
    # ドクロ
    ellipsoid("Skull", (0, 0, 0.08), (1.0, 0.95, 0.98), bm, head)
    rounded_box("Jaw", (0, -0.16, -0.66), (1.22, 0.98, 0.62), bm, head, bevel=0.2)
    for sx in (-1, 1):
        ellipsoid(f"Eye{sx}", (0.37 * sx, -0.86, -0.02), (0.27, 0.16, 0.31), black, head)
        ellipsoid(f"Shine{sx}", (0.37 * sx - 0.09, -1.0, 0.09), (0.075, 0.03, 0.085), white_e, head, 16)
        ellipsoid(f"Shine2{sx}", (0.37 * sx + 0.08, -1.0, -0.11), (0.035, 0.02, 0.04), white_e, head, 12)
    bpy.ops.mesh.primitive_cone_add(vertices=3, radius1=0.085, depth=0.06)
    nose = bpy.context.object
    nose.name = "Nose"
    nose.location = (0, -0.98, -0.34)
    nose.rotation_euler = (math.radians(90), math.radians(30), 0)
    nose.data.materials.append(black)
    nose.parent = head
    rounded_box("Mouth", (0, -0.62, -0.7), (0.66, 0.1, 0.22), black, head, bevel=0.05)
    for k in range(5):
        x = -0.24 + 0.12 * k
        rounded_box(f"Tooth{k}", (x, -0.66, -0.7), (0.085, 0.06, 0.18), bm, head, bevel=0.025)
    # ボブヘア
    mb = MeshBuilder()
    v, f = hair_mesh()
    mb.add(v, f, 0)
    hair = mb.obj("Hair", [hm], parent=head, smooth=True)
    sol = hair.modifiers.new("solid", "SOLIDIFY")
    sol.thickness = 0.09
    sol.offset = 0.0
    # 三角のヘアピン（向かって左）
    def on_hair(x, z, out=0.09):
        rr = math.sqrt(max(1.14 ** 2 - (z - 0.08) ** 2, 0.01)) if z > 0.08 else 1.14
        return Vector((x, -math.sqrt(max(rr * rr - x * x, 0.01)) - out, z))

    cx, cz = -0.50, 0.62
    pts = []
    for a in (90, 210, 330):
        r = math.radians(a + 30)
        pts.append(on_hair(cx + 0.25 * math.cos(r), cz + 0.25 * math.sin(r)))
    mb = MeshBuilder()
    for p, q in zip(pts, pts[1:] + pts[:1]):
        mb.cyl(p, q, 0.06, 0.06, 0, segs=12)
    pin = mb.obj("HairClip", [clip], parent=head, smooth=True)
    for k, p in enumerate(pts):
        ellipsoid(f"ClipJoint{k}", p, (0.065, 0.065, 0.065), clip, head, 12)

    # 交差した骨（後ろ）
    bones = []
    for k, sgn in enumerate((1, -1)):
        piv = empty(f"BonePivot{k}", (0, 0.45, -0.1), parent=root)
        mb = MeshBuilder()
        L = 2.05
        mb.cyl(Vector((-L, 0, 0)), Vector((L, 0, 0)), 0.17, 0.17, 0, segs=20)
        bone = mb.obj(f"Bone{k}", [bm], parent=piv, smooth=True)
        for ex in (-L, L):
            for dz in (-0.17, 0.17):
                ellipsoid(f"Knob{k}{ex}{dz}", (ex + 0.06 * (1 if ex > 0 else -1), 0, dz), (0.26, 0.24, 0.26), bm, piv, 24)
        bones.append((piv, sgn))

    # 背景・光
    w = bpy.data.worlds.new("LogoWorld")
    sc.world = w
    try:
        w.use_nodes = True
    except Exception:
        pass
    nt = w.node_tree
    bg = next(n for n in nt.nodes if n.type == "BACKGROUND")
    bg.inputs["Color"].default_value = (0.012, 0.014, 0.025, 1)
    bg.inputs["Strength"].default_value = 1.0
    # 背景の淡い円光
    m, ntm, outm = new_mat("Halo")
    m.surface_render_method = "BLENDED"
    N, Ln = ntm.nodes, ntm.links
    tc = N.new("ShaderNodeTexCoord")
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Location"].default_value = (-0.5, -0.5, 0)
    Ln.new(tc.outputs["UV"], mp.inputs[0])
    ln = N.new("ShaderNodeVectorMath")
    ln.operation = "LENGTH"
    Ln.new(mp.outputs[0], ln.inputs[0])
    rmp = N.new("ShaderNodeMapRange")
    rmp.inputs["From Min"].default_value = 0.5
    rmp.inputs["From Max"].default_value = 0.0
    rmp.inputs["To Max"].default_value = 0.55
    Ln.new(ln.outputs["Value"], rmp.inputs[0])
    em = N.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (0.95, 0.45, 0.16, 1)
    halo_strength = em.inputs["Strength"]
    tr = N.new("ShaderNodeBsdfTransparent")
    mx = N.new("ShaderNodeMixShader")
    Ln.new(rmp.outputs[0], mx.inputs[0])
    Ln.new(tr.outputs[0], mx.inputs[1])
    Ln.new(em.outputs[0], mx.inputs[2])
    Ln.new(mx.outputs[0], outm.inputs[0])
    mb = MeshBuilder()
    mb.grid([[Vector((-4.5, 4, -4.5)), Vector((4.5, 4, -4.5))], [Vector((-4.5, 4, 4.5)), Vector((4.5, 4, 4.5))]])
    halo = mb.obj("Halo", [m])
    halo.location = (0, 0, 0.1)
    socket_key(halo_strength, F0, 0.0)
    socket_key(halo_strength, F0 + 20, 0.45)
    socket_key(halo_strength, F1, 0.35)

    def area(name, loc, energy, color, size, target=(0, 0, 0), shadow=False):
        L2 = bpy.data.lights.new(name, "AREA")
        L2.use_shadow = shadow          # 影は主光源だけ（描画時間のため）
        L2.energy = energy
        L2.color = color
        L2.size = size
        o = link(bpy.data.objects.new(name, L2))
        o.location = loc
        d = Vector(target) - Vector(loc)
        o.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
        return o

    area("Key", (-4, -6, 4), 900, (1.0, 0.86, 0.7), 4, shadow=True)
    area("Fill", (5, -5, -1), 250, (0.6, 0.75, 1.0), 5)
    area("RimL", (-4, 4, 2), 700, (1.0, 0.55, 0.25), 3)
    area("RimR", (4, 4, 2), 600, (0.3, 0.8, 0.85), 3)
    sweep = area("Sweep", (-6, -5, 1.5), 0, (1.0, 0.95, 0.85), 1.5)
    L3 = sweep.data
    for f, x, e in ((F0 + 24, -6, 0), (F0 + 30, -3, 1600), (F0 + 44, 5, 1600), (F0 + 50, 7, 0)):
        sweep.location = (x, -5, 1.5)
        sweep.keyframe_insert("location", frame=f)
        L3.energy = e
        L3.keyframe_insert("energy", frame=f)

    # カメラ
    cam = bpy.data.cameras.new("LogoCam")
    cam.lens = 50
    co = link(bpy.data.objects.new("LogoCam", cam))
    co.location = (0, -10.5, 0.15)
    co.rotation_euler = (math.radians(90), 0, 0)
    sc.camera = co
    # 黒からのフェード（カメラの前の板）
    fm, fnt, fout = new_mat("Fade")
    fm.surface_render_method = "BLENDED"
    fb = fnt.nodes.new("ShaderNodeBsdfPrincipled")
    fb.inputs["Base Color"].default_value = (0, 0, 0, 1)
    fnt.links.new(fb.outputs[0], fout.inputs[0])
    socket_key(fb.inputs["Alpha"], F0, 1.0)
    socket_key(fb.inputs["Alpha"], F0 + 9, 0.0)
    socket_key(fb.inputs["Alpha"], F1 - 12, 0.0)
    socket_key(fb.inputs["Alpha"], F1 - 1, 1.0)
    mb = MeshBuilder()
    mb.grid([[Vector((-2, -2, 0)), Vector((2, -2, 0))], [Vector((-2, 2, 0)), Vector((2, 2, 0))]])
    fade = mb.obj("FadeCard", [fm], parent=co)
    fade.location = (0, 0, -0.6)

    # 動き: 振り向きながら浮かび上がり、骨が交差する
    root.rotation_euler = (0, 0, math.radians(-70))
    root.scale = (0.7, 0.7, 0.7)
    root.location = (0, 0, -0.5)
    for p in ("rotation_euler", "scale", "location"):
        root.keyframe_insert(p, frame=F0)
    root.rotation_euler = (0, 0, math.radians(6))
    root.scale = (1.03, 1.03, 1.03)
    root.location = (0, 0, 0.05)
    for p in ("rotation_euler", "scale", "location"):
        root.keyframe_insert(p, frame=F0 + 18)
    root.rotation_euler = (0, 0, 0)
    root.scale = (1, 1, 1)
    root.location = (0, 0, 0)
    for p in ("rotation_euler", "scale", "location"):
        root.keyframe_insert(p, frame=F0 + 28)
    fc = find_fcurve(root, "rotation_euler", 2)
    mod = fc.modifiers.new("NOISE")
    mod.scale = 30
    mod.strength = math.radians(4)
    mod.use_restricted_range = True
    mod.frame_start = F0 + 28
    mod.frame_end = F1 + 10
    mod.blend_in = 10
    for piv, sgn in bones:
        piv.rotation_euler = (0, 0, 0)
        piv.keyframe_insert("rotation_euler", frame=F0 + 6)
        piv.rotation_euler = (0, sgn * math.radians(40), 0)
        piv.keyframe_insert("rotation_euler", frame=F0 + 20)
        piv.rotation_euler = (0, sgn * math.radians(36), 0)
        piv.keyframe_insert("rotation_euler", frame=F0 + 26)

    # 光のにじみ
    ng = bpy.data.node_groups.new("LogoComp", "CompositorNodeTree")
    ng.interface.new_socket("Image", in_out="OUTPUT", socket_type="NodeSocketColor")
    rl = ng.nodes.new("CompositorNodeRLayers")
    gl = ng.nodes.new("CompositorNodeGlare")
    try:
        gl.inputs["Type"].default_value = "Bloom"
    except Exception:
        pass
    gl.inputs["Threshold"].default_value = 1.0
    gl.inputs["Strength"].default_value = 0.5
    go = ng.nodes.new("NodeGroupOutput")
    ng.links.new(rl.outputs["Image"], gl.inputs["Image"])
    ng.links.new(gl.outputs["Image"], go.inputs[0])
    sc.compositing_node_group = ng
    return sc


def main():
    args = sys.argv[1:]
    build()
    bpy.ops.wm.save_as_mainfile(filepath=BLEND)
    print("saved", BLEND)
    if "--still" in args:
        frames = [int(v) for v in args[args.index("--still") + 1].split(",")]
        sc = bpy.context.scene
        out = os.path.join(BUILD, "stills")
        os.makedirs(out, exist_ok=True)
        for f in frames:
            sc.frame_set(f)
            sc.render.filepath = os.path.join(out, f"logo_{f:04d}.png")
            bpy.ops.render.render(write_still=True)
            print("frame", f, flush=True)


if __name__ == "__main__":
    main()
