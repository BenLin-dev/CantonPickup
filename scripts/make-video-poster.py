#!/usr/bin/env python
"""
make-video-poster.py — build a watermarked 9:16 poster for a video clip.

A clip's thumbnail lives in `public/videos/` next to the clip itself, under the
same basename — `baiyun-airport-pickup.jpg` beside `baiyun-airport-pickup.json`
— and `scripts/scan-assets.mjs` picks it up from there. YouTube's own
thumbnails are not usable for this site: a Short's `maxresdefault` is a 16:9
frame with the creator's burned-in Chinese subtitles and marketing captions on
it, which reads badly on an all-English page. So the poster is made here from
a real photo of the service, with the brand burned in.

Run it with the PIL-enabled interpreter:

  C:/Users/Administrator/.workbuddy/binaries/python/envs/default/Scripts/python.exe \
      scripts/make-video-poster.py photo.jpg public/videos/baiyun-airport-pickup.jpg

Options:
  --text CantonPickup     watermark wording (default: CantonPickup)
  --bias 0.12             vertical crop bias: 1 keeps the top, -1 the bottom
  --pill / --plain        blue badge (default) or a plain white wordmark

Notes:
  * The card in `VideoGallery.vue` is `aspect-ratio: 9 / 16`, so the crop is
    portrait 9:16 (`--ratio 16:9` for a wide card) and nothing is re-cropped
    by `background-size: cover` afterwards.
  * Poppins Bold is fetched once into this folder so the watermark matches the
    site's heading face; Century Gothic Bold / Arial Bold are fallbacks.
  * The filename must match the clip's sidecar / video file, or the scan will
    treat the picture as a separate (poster-less) entry.
"""

import argparse
import os
import sys

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONT_NAME = "Poppins-Bold.ttf"
FONT_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf"
FALLBACKS = [
    r"C:\Windows\Fonts\GOTHICB.TTF",
    r"C:\Windows\Fonts\arialbd.ttf",
]
BRAND = (18, 85, 155)  # --c-700
# The card in `VideoGallery.vue` is `aspect-ratio: 9 / 16` (Shorts are shot
# vertically), so the poster is built portrait. `--ratio 16:9` is still
# available for a wide card elsewhere.
OUT_W, OUT_H = 1080, 1920


def load_font(size):
    """Poppins Bold from next to this script, else a system fallback."""
    local = os.path.join(HERE, FONT_NAME)
    if not os.path.exists(local):
        try:
            import urllib.request

            urllib.request.urlretrieve(FONT_URL, local)
            print(f"fetched {FONT_NAME}")
        except Exception as err:  # offline is fine, we have fallbacks
            print(f"! could not fetch Poppins ({err}) — using a system font")
    for path in [local, *FALLBACKS]:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size), path
            except Exception:
                continue
    return ImageFont.load_default(), "default"


def crop_to_ratio(im, bias=0.0):
    """Centre-crop to OUT_W:OUT_H (portrait 9:16 by default).

    `bias` 1.0 keeps the top of a landscape source, -1.0 the bottom. For a
    portrait target the crop almost always comes off the *width* of a landscape
    photo, so `bias` still decides which horizontal band survives.
    """
    w, h = im.size
    target = OUT_W / OUT_H
    if w / h > target:
        # too wide — trim the sides (centred; a bias would pick left/right)
        want = int(round(h * target))
        left = (w - want) // 2
        return im.crop((left, 0, left + want, h))
    # too tall (or already right) — trim top/bottom, `bias` chooses the band
    want = int(round(w / target))
    slack = h - want
    top = int(slack * (0.5 - bias * 0.5))
    return im.crop((0, top, w, top + want))


def darken_bottom(im, start=0.52, strength=0.62, power=1.5):
    """Fade the lower part of the frame so white text always reads."""
    w, h = im.size
    mask = Image.new("L", (1, h))
    px = mask.load()
    for y in range(h):
        t = max(0.0, min(1.0, (y / h - start) / (1 - start)))
        px[0, y] = int(255 * strength * (t ** power))
    return Image.composite(Image.new("RGB", (w, h), (0, 0, 0)), im, mask.resize((w, h)))


def watermark(im, text, font, pill=True, size=44, pad=36):
    d = ImageDraw.Draw(im)
    l, t, r, b = d.textbbox((0, 0), text, font=font)
    tw, th = r - l, b - t

    if pill:
        x0, y0 = pad, im.height - pad - th - 26
        x1, y1 = x0 + tw + 40, y0 + th + 26
        badge = Image.new("RGBA", (x1 - x0, y1 - y0), (0, 0, 0, 0))
        ImageDraw.Draw(badge).rounded_rectangle(
            (0, 0, x1 - x0 - 1, y1 - y0 - 1),
            radius=(y1 - y0) // 2,
            fill=(*BRAND, 232),
        )
        im.paste(badge, (x0, y0), badge)
        d.text((x0 + 20 - l, y0 + 13 - t), text, font=font, fill=(255, 255, 255))
        return im

    x, y = pad - l, im.height - pad - b
    for dx, dy in ((0, 3), (2, 2), (-2, 2), (3, 0), (-3, 0)):
        d.text((x + dx, y + dy), text, font=font, fill=(6, 32, 56))
    d.text((x, y), text, font=font, fill=(255, 255, 255))
    return im


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("src", help="source photo (any size; 4:3 or wider works best)")
    ap.add_argument("out", help="destination jpg")
    ap.add_argument("--text", default="CantonPickup")
    ap.add_argument("--bias", type=float, default=0.12)
    ap.add_argument("--plain", action="store_true", help="plain wordmark instead of the badge")
    args = ap.parse_args()

    font, font_path = load_font(44)
    print(f"font: {font_path}")

    src = Image.open(args.src).convert("RGB")
    print(f"source: {src.size}")

    im = crop_to_ratio(src, args.bias).resize((OUT_W, OUT_H), Image.LANCZOS)
    im = darken_bottom(im, strength=0.34 if not args.plain else 0.62)
    im = watermark(im, args.text, font, pill=not args.plain)

    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    im.save(args.out, "JPEG", quality=88, optimize=True, progressive=True)
    size_kb = os.path.getsize(args.out) / 1024
    print(f"wrote {args.out} — {OUT_W}x{OUT_H}, {size_kb:.0f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
