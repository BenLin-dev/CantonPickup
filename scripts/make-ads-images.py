#!/usr/bin/env python
"""
make-ads-images.py — crop site photos into Google Ads image-asset dimensions.

Google Ads "image assets for Search campaigns" accept two aspect ratios and
nothing else:

  * square   1:1     — REQUIRED. Served on Google.com and (via AdSense for
                       Search / Search Partners) on YouTube search.
                       Min 300x300, recommended 1200x1200.
  * landscape 1.91:1 — OPTIONAL but recommended. Same surfaces.
                       Min 600x314, recommended 1200x628.

PNG or JPG, hard cap 5120 KB, and the important content must sit inside the
centre 80% safe area — which is exactly what a centre crop gives you.

Overlays are the number-one rejection reason: text, logos, or a brand mark
burned into the picture will get the asset disapproved. The site's
`public/images/hero|vehicles|services` files are already clean (the generator
watermark is cropped off by `make-round17-images.py` / `make-service-images.py`),
so they can be used as-is. Do NOT use `public/videos/*.jpg` — those posters
carry a burned-in CantonPickup badge on purpose.

Run it with the PIL-enabled interpreter:

  C:/Users/Administrator/.workbuddy/binaries/python/envs/default/Scripts/python.exe \
      scripts/make-ads-images.py --out "E:/ai项目/GoogleAds素材"

Options:
  --bias 0.0    vertical crop bias, -1 keeps the bottom edge, +1 the top
  --quality 90  JPEG quality
  --only airport,hongqi   comma-separated substrings to filter sources
"""

import argparse
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(os.path.dirname(HERE), "public", "images")

# (source path relative to public/images, output slug, vertical bias)
SOURCES = [
    ("hero/airport.jpg", "airport", 0.0),
    ("hero/private-driver.jpg", "private-driver", 0.0),
    ("hero/guangzhou-bluehour.jpg", "guangzhou-bluehour", 0.0),
    ("hero/guangzhou-aerial.jpg", "guangzhou-aerial", 0.15),
    ("hero/chauffeur.jpg", "chauffeur", 0.2),
    ("vehicles/hongqi.jpg", "hongqi-sedan", 0.0),
    ("vehicles/denza-d9.jpg", "denza-d9", 0.0),
    ("services/airport-transfer.jpg", "airport-transfer", 0.0),
]

TARGETS = [
    ("square", 1.0, 1200, 1200),
    ("landscape", 1.91, 1200, 628),
]


def crop_to_ratio(im, ratio, bias):
    """Centre-crop `im` to `ratio`, shifted vertically by `bias` (-1..+1)."""
    w, h = im.size
    if w / h > ratio:
        new_w, new_h = int(round(h * ratio)), h
    else:
        new_w, new_h = w, int(round(w / ratio))

    left = (w - new_w) // 2
    # bias moves the crop window inside the slack that is left over
    slack = h - new_h
    top = int(round(slack * (0.5 - bias * 0.5))) if slack else 0
    top = max(0, min(slack, top))
    return im.crop((left, top, left + new_w, top + new_h))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(HERE, "..", "google-ads-assets"))
    ap.add_argument("--bias", type=float, default=None,
                    help="override the per-source vertical bias")
    ap.add_argument("--quality", type=int, default=90)
    ap.add_argument("--only", default="")
    args = ap.parse_args()

    out_dir = os.path.abspath(args.out)
    os.makedirs(out_dir, exist_ok=True)

    keep = [s.strip().lower() for s in args.only.split(",") if s.strip()]
    sources = [s for s in SOURCES if not keep or any(k in s[1] for k in keep)]

    if not sources:
        print("no sources matched --only", args.only, file=sys.stderr)
        return 1

    rows = []
    for rel, slug, bias in sources:
        src = os.path.join(PUBLIC, rel)
        if not os.path.isfile(src):
            print("MISSING", src, file=sys.stderr)
            continue
        use_bias = args.bias if args.bias is not None else bias
        with Image.open(src) as raw:
            im = raw.convert("RGB")
            src_size = raw.size
            for label, ratio, tw, th in TARGETS:
                tile = crop_to_ratio(im, ratio, use_bias)
                tile = tile.resize((tw, th), Image.LANCZOS)
                name = f"{slug}-{label}-{tw}x{th}.jpg"
                dest = os.path.join(out_dir, name)
                tile.save(dest, "JPEG", quality=args.quality,
                          optimize=True, progressive=True)
                rows.append((name, src_size, tile.size,
                             os.path.getsize(dest) / 1024))

    print(f"source dir : {PUBLIC}")
    print(f"output dir : {out_dir}")
    print()
    print(f"{'file':46s} {'source':>11s}  {'output':>11s}  {'KB':>7s}")
    print("-" * 82)
    for name, s, t, kb in rows:
        print(f"{name:46s} {s[0]}x{s[1]:<6d}  {t[0]}x{t[1]:<6d}  {kb:7.1f}")
    print("-" * 82)
    print(f"{len(rows)} files written")

    over = [r for r in rows if r[3] > 5120]
    if over:
        print("\n!! over the 5120 KB cap:", ", ".join(r[0] for r in over))
    return 0


if __name__ == "__main__":
    sys.exit(main())
