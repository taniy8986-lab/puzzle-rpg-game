"""完全版で使うチャート画像を、受け取った元資料PDFから切り出す。

    python3 -I tools/extract_charts.py <元資料.pdf>
      → assets/charts_k/p01.png … p12.png（各ページに1枚ずつ入っている日足・週足・月足の図。2508×1026）

画像は受け取った資料の一部なので、リポジトリには入れない（.gitignore 済み）。
"""
import io
import sys
from pathlib import Path

from PIL import Image
from pypdf import PdfReader

HERE = Path(__file__).resolve().parent.parent
OUT = HERE / "assets" / "charts_k"


def main(pdf):
    OUT.mkdir(parents=True, exist_ok=True)
    r = PdfReader(pdf)
    n = 0
    for i, page in enumerate(r.pages[:12]):
        for im in page.images:
            img = Image.open(io.BytesIO(im.data)).convert("RGB")
            img.save(OUT / f"p{i + 1:02d}.png")
            n += 1
            print(f"p{i + 1:02d}.png {img.size}")
    print(f"{n} 枚 → {OUT}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1])
