"""本番レンダー: 保存済みの .blend からフレームを少しずつ描く（描いたフレームは飛ばす）。

    /opt/bvenv/bin/python render_video.py START END [BLEND]   # build/frames/f_0000.png …

render_all.sh がこれを 24 フレームずつ呼び、間に休みを入れる。
"""
import os
import sys
import time

import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
BLEND = os.path.join(HERE, "build", "pirate_ship.blend")
OUT = os.path.join(HERE, "build", "frames")


def main():
    a, b = int(sys.argv[1]), int(sys.argv[2])
    todo = [f for f in range(a, b) if not os.path.exists(os.path.join(OUT, f"f_{f:04d}.png"))]
    if not todo:
        return
    bpy.ops.wm.open_mainfile(filepath=sys.argv[3] if len(sys.argv) > 3 else BLEND)
    sc = bpy.context.scene
    sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = "PNG"
    os.makedirs(OUT, exist_ok=True)
    for f in todo:
        t = time.time()
        sc.frame_set(f)
        tmp = os.path.join(OUT, f"tmp_{f:04d}.png")
        sc.render.filepath = tmp
        bpy.ops.render.render(write_still=True)
        os.replace(tmp, os.path.join(OUT, f"f_{f:04d}.png"))   # 書き終えてから名前を確定
        print(f"frame {f} {time.time() - t:.1f}s", flush=True)


if __name__ == "__main__":
    main()
