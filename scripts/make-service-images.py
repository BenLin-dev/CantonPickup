"""
make-service-images.py — build the six service-card images.

The homepage "Our Services" grid wants one landscape picture per service, and
the card crops with `object-fit: cover`. Making each source the *card's* exact
aspect ratio means nothing is re-cropped in the browser, so the shot you
approve here is the shot that ships.

Five of the six come from the existing photo library in `public/images/hero/`;
the Canton Fair shot has no photo of that venue, so it is generated (a modern
exhibition centre on the Pearl River) and dropped in `_src/`.

Run:
  C:/Users/Administrator/.workbuddy/binaries/python/envs/default/Scripts/python.exe \
      scripts/make-service-images.py

Output: public/images/services/<slug>.jpg — 1600x900, JPEG q88.
Re-running is idempotent: same inputs, same bytes.
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images" / "services"
W, H = 1600, 900

# slug -> source file, vertical bias in [-1, 1] (1 keeps the top of the frame)
PLAN = {
    "airport-transfer": (ROOT / "public/images/hero/airport.jpg", 0.15),
    "private-driver": (ROOT / "public/images/hero/private-driver.jpg", -0.1),
    "business-travel": (ROOT / "public/images/hero/factory.jpg", 0.0),
    "intercity-transfer": (ROOT / "public/images/hero/highway-dusk.jpg", 0.0),
    "canton-fair-transfer": (ROOT / "_src/canton-fair-transfer.png", 1.0),
    "multi-day-sourcing-tour": (ROOT / "public/images/hero/guangzhou-aerial.jpg", 0.1),
}


def crop_to(src: Image.Image, bias: float) -> Image.Image:
    """
    Centre-crop to 16:9.

    `bias` runs from -1 to +1: +1 keeps the *top* of the frame (top = 0),
    -1 keeps the bottom, 0 is a plain centre crop. The sign is easy to get
    backwards — it was, once, and the Canton Fair frame came out shifted down
    with the generator's watermark still inside it.
    """
    w, h = src.size
    target_h = round(w * H / W)
    if target_h > h:  # too wide already — crop horizontally instead
        target_w = round(h * W / H)
        left = round((w - target_w) / 2)
        return src.crop((left, 0, left + target_w, h))
    spare = h - target_h
    top = round((1 - bias) / 2 * spare)
    return src.crop((0, top, w, top + target_h))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for slug, (path, bias) in PLAN.items():
        if not path.exists():
            print(f"  skip  {slug:26} — missing {path.relative_to(ROOT)}")
            continue
        im = Image.open(path).convert("RGB")
        im = crop_to(im, bias).resize((W, H), Image.LANCZOS)
        dest = OUT / f"{slug}.jpg"
        im.save(dest, "JPEG", quality=88, optimize=True, progressive=True)
        print(f"  write {slug:26} {im.size[0]}x{im.size[1]}  {dest.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
