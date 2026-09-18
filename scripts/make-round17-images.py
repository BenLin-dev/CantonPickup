"""
Slice this round's generated artwork into the site's image slots.

Two jobs, in one pass:

1. Crop the generator's corner watermark off. It is burned into the lower-right
   of every frame and cannot be switched off with an API flag, so the only
   reliable removal is to cut the bottom strip. `WATERMARK_PX` is measured from
   the delivered 1024x1536 output — raise it if a future model moves the mark.

2. Crop to the aspect ratio each slot actually renders at, instead of letting
   the browser do it. `object-fit: cover` on a 16:9 card is fine for a hero
   photo (you only lose the edges) but it decapitates a portrait, and it means
   the file we ship carries detail nobody will ever see.

Run it from anywhere:

    python scripts/make-round17-images.py
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(r"e:\ai项目\generated-images")

# The burned-in "AI生成 WORKBUDDY" plate lives in the bottom ~76 px of every
# 1024x1536 frame. 92 px clears it with room to spare.
WATERMARK_PX = 92

# (source timestamp stem, destination, target aspect (w, h), vertical bias)
#
# `bias` runs -1..+1 over the strip left after the watermark is cut: +1 keeps
# the top of the frame, -1 the bottom, 0 sits in the middle. Portraits crop
# upward (subjects sit high); interiors sit nearer the middle.
PLAN = [
    # ---- guides ---------------------------------------------------------
    ("08-37-52", "public/images/blog/guangzhou-wholesale-markets-guide.jpg", (16, 9), 0.35),
    ("08-38-10", "public/images/blog/baima-market-guangzhou.jpg", (16, 9), 0.35),
    ("08-38-25", "public/images/blog/canton-fair-first-timer-guide.jpg", (16, 9), -0.15),
    ("08-38-43", "public/images/blog/negotiating-with-chinese-suppliers.jpg", (16, 9), -0.30),
    ("08-38-59", "public/images/blog/business-etiquette-in-china.jpg", (16, 9), 0.20),
    # ---- "See Us in Action" gallery -------------------------------------
    # tall tiles render portrait, so keep them portrait
    ("08-39-19", "public/images/gallery/trunk-loading.jpg", (4, 5), 0.15),
    ("08-40-41", "public/images/gallery/luggage-cart.jpg", (4, 5), 0.20),
    # normal tiles are roughly 16:10 landscape
    ("08-39-54", "public/images/gallery/cabin-mpv.jpg", (8, 5), 0.15),
    ("08-40-11", "public/images/gallery/curbside-wait.jpg", (8, 5), 0.20),
    # wide tiles are about 2:1
    ("08-39-36", "public/images/gallery/name-sign.jpg", (2, 1), 0.10),
    ("08-40-57", "public/images/gallery/terminal-walk.jpg", (2, 1), 0.10),
]

# Longest edge of the shipped file. 1600 keeps a full-bleed hero sharp on a
# retina laptop without shipping a 2.4 MB PNG.
MAX_EDGE = 1600


def find_source(stem: str) -> Path:
    hits = sorted(SRC.glob(f"*{stem}.png"))
    if not hits:
        raise SystemExit(f"source not found for stamp {stem}")
    return hits[0]


def crop_to(src: Image.Image, ratio: tuple[int, int], bias: float) -> Image.Image:
    """
    Centre-crop to `ratio`, biased vertically by `bias` (-1 bottom, +1 top).

    Cropping from a fixed edge is what put the watermark inside the frame last
    time; running the spare space through a signed offset keeps the intent
    readable and makes the direction impossible to get backwards.
    """
    w, h = src.size
    target = ratio[0] / ratio[1]

    if w / h > target:
        # too wide — trim the sides, bias has nothing to act on
        new_w = round(h * target)
        left = round((w - new_w) / 2)
        return src.crop((left, 0, left + new_w, h))

    # too tall — trim top and bottom around a biased centre
    new_h = round(w / target)
    spare = h - new_h
    top = round((1 - bias) / 2 * spare)
    return src.crop((0, top, w, top + new_h))


def main() -> None:
    for stem, dest_rel, ratio, bias in PLAN:
        dest = ROOT / dest_rel
        dest.parent.mkdir(parents=True, exist_ok=True)

        img = Image.open(find_source(stem)).convert("RGB")

        # 1. drop the watermark strip first, so every later crop is clean
        img = img.crop((0, 0, img.width, img.height - WATERMARK_PX))

        # 2. crop to the slot's real aspect ratio
        img = crop_to(img, ratio, bias)

        # 3. downscale if we are still bigger than we need
        if max(img.size) > MAX_EDGE:
            scale = MAX_EDGE / max(img.size)
            img = img.resize(
                (round(img.width * scale), round(img.height * scale)),
                Image.LANCZOS,
            )

        img.save(dest, "JPEG", quality=86, optimize=True, progressive=True)
        print(f"{dest_rel:62} {img.width}x{img.height}  {dest.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
