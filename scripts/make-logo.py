#!/usr/bin/env python
"""CantonPickup logo generator.

Rebuilds the brand lockup as clean vectors from two primitives:

  * the **car mark** — two tapered ribbons (roofline + beltline) traced off
    `原型.png`, the raster logo the client supplied.  Geometry lives in the
    GEOM table below so the shape can be re-tuned without touching the site.
  * the **wordmark** — "CantonPickup" set in Poppins ExtraBold and converted
    to outlines, so the SVG renders identically everywhere and never falls
    back to a system font.

Outputs (all written to `public/`):

  logo.svg                full lockup, for light backgrounds
  logo-inverse.svg        full lockup, for the mid-blue footer / dark panels
  favicon.svg             square badge mark, tuned for 16-48 px

Requires the isolating interpreter (PIL + fontTools):
  C:/Users/Administrator/.workbuddy/binaries/python/envs/default/Scripts/python.exe

Usage:
  python scripts/make-logo.py                # write the assets
  python scripts/make-logo.py --preview      # also dump a preview HTML + variants
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
FONT = ROOT / "scripts" / "Poppins-ExtraBold.ttf"

# ----------------------------------------------------------------- palette
NAVY = "#0B3D7C"        # --c-800, the wordmark's "Canton"
ORANGE = "#F5822E"      # the mark + the wordmark's "Pickup"
NAVY_DEEP = "#072A4E"   # --c-900, badge bed
ON_DARK_MARK = "#FFB37A"  # warm amber, the mark on the mid-blue footer
ON_DARK_B = "#8CC7E8"     # --c-300, "Pickup" on the footer

# ------------------------------------------------------------ car geometry
# Traced off the supplied 105x40 raster logo, rescaled into a 320 x 56 box:
# the car faces right, x = 24 is the rear tip and x = 320 the front tip.
#
#   roof  — the top silhouette, a fastback sweep from tail to nose
#   belt  — the window sill, running under the greenhouse and closing it
#           off at both ends; the negative space between roof and belt is
#           what makes the shape read as a car rather than a wing.
#
# Each entry carries its own stroke weight (tmax, in the 56-unit-tall box)
# and its taper ramps (in / out, as a fraction of arc length).
GEOM = {
    "v1": dict(
        roof=[(24.0, 45.0), (52.0, 34.0), (86.0, 22.0), (118.0, 14.0),
              (156.0, 12.0), (198.0, 18.0), (242.0, 28.0), (284.0, 40.0),
              (320.0, 50.0)],
        roof_tmax=16.0, roof_in=0.085, roof_out=0.20,
        belt=[(60.0, 44.0), (150.0, 40.0), (255.0, 33.5)],
        belt_tmax=5.5, belt_in=0.16, belt_out=0.22,
    ),
    "v2": dict(
        roof=[(26.0, 46.0), (56.0, 35.0), (92.0, 22.0), (124.0, 14.0),
              (162.0, 12.5), (204.0, 18.0), (248.0, 28.0), (288.0, 40.0),
              (320.0, 50.0)],
        roof_tmax=13.0, roof_in=0.09, roof_out=0.22,
        belt=[(72.0, 42.5), (150.0, 38.0), (250.0, 30.5)],
        belt_tmax=4.5, belt_in=0.20, belt_out=0.34,
    ),
}
GEOM_CHOICE = "v2"
MARK_BOX = (320.0, 56.0)
RDP_TOL = 0.22               # polyline simplification tolerance, mark units

# ------------------------------------------------------------------- lockup
WORDMARK = ("Canton", "Pickup")
TRACKING = -22.0            # font units added to every advance (tight tracking)
CAP_TARGET = 100.0          # rendered cap height, in lockup units
CAR_INK_RATIO = 0.80        # mark ink width / wordmark width
CAR_GAP = 0.05              # gap below the mark, as a fraction of the cap height


# ------------------------------------------------------------- ribbon maths
def catmull_rom(points, samples_per_seg=40):
    pts = [points[0]] + list(points) + [points[-1]]
    out = []
    for i in range(1, len(pts) - 2):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[i + 1], pts[i + 2]
        for j in range(samples_per_seg):
            t = j / samples_per_seg
            t2, t3 = t * t, t * t * t
            out.append((
                0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t
                       + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2
                       + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
                0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t
                       + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2
                       + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
            ))
    out.append(points[-1])
    return out


def rdp(points, tol):
    """Douglas-Peucker polyline simplification."""
    if len(points) < 3:
        return list(points)

    def perp(p):
        (px, py), (ax, ay), (bx, by) = p, points[0], points[-1]
        dx, dy = bx - ax, by - ay
        L = math.hypot(dx, dy) or 1.0
        return abs((px - ax) * dy - (py - ay) * dx) / L

    dmax, idx = 0.0, 0
    for i in range(1, len(points) - 1):
        d = perp(points[i])
        if d > dmax:
            dmax, idx = d, i
    if dmax > tol:
        left = rdp(points[:idx + 1], tol)
        right = rdp(points[idx:], tol)
        return left[:-1] + right
    return [points[0], points[-1]]


def _smoothstep(a, b, x):
    if b <= a:
        return 1.0
    t = max(0.0, min(1.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def ribbon(landmarks, tmax, ramp_in, ramp_out, samples=40, tol=RDP_TOL):
    """Return (top_edge, bottom_edge) of a stroke that tapers at both ends."""
    pts = catmull_rom(landmarks, samples)
    cum = [0.0]
    for i in range(1, len(pts)):
        cum.append(cum[-1] + math.dist(pts[i - 1], pts[i]))
    total = cum[-1]

    top, bot = [], []
    n = len(pts)
    for i, (x, y) in enumerate(pts):
        a, b = pts[max(0, i - 1)], pts[min(n - 1, i + 1)]
        tx, ty = b[0] - a[0], b[1] - a[1]
        L = math.hypot(tx, ty) or 1.0
        tx, ty = tx / L, ty / L
        nx, ny = ty, -tx
        if ny > 0:                       # keep the normal pointing up-screen
            nx, ny = -nx, -ny
        s = cum[i] / total
        h = tmax * _smoothstep(0.0, ramp_in, s) \
            * (1.0 - _smoothstep(1.0 - ramp_out, 1.0, s)) / 2.0
        top.append((x + nx * h, y + ny * h))
        bot.append((x - nx * h, y - ny * h))
    return rdp(top, tol), rdp(bot, tol)


def closed_path(top, bot, dec=1):
    def seg(points):
        return " ".join(f"{'M' if i == 0 else 'L'}{x:.{dec}f} {y:.{dec}f}"
                        for i, (x, y) in enumerate(points))
    return f"{seg(top)} {seg(list(reversed(bot)))} Z"


def mark_paths(geom=None, tmax_scale=1.0, with_belt=True):
    g = GEOM[geom or GEOM_CHOICE]
    rt, rb = ribbon(g["roof"], g["roof_tmax"] * tmax_scale,
                    g["roof_in"], g["roof_out"])
    if with_belt:
        bt, bb = ribbon(g["belt"], g["belt_tmax"] * tmax_scale,
                        g["belt_in"], g["belt_out"], 24)
    else:
        bt, bb = [], []
    pts = rt + rb + bt + bb
    ink = (min(p[0] for p in pts), min(p[1] for p in pts),
           max(p[0] for p in pts), max(p[1] for p in pts))
    return closed_path(rt, rb), (closed_path(bt, bb) if bt else ""), ink


# ---------------------------------------------------------------- wordmark
def wordmark_paths():
    """Outline both halves of the wordmark in font units (em = 1000)."""
    font = TTFont(FONT)
    upm = font["head"].unitsPerEm
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]

    def outline(text, start):
        pen = SVGPathPen(gs, ntos=lambda v: f"{v:.1f}")
        x = start
        for ch in text:
            name = cmap[ord(ch)]
            gs[name].draw(TransformPen(pen, (1, 0, 0, 1, x, 0)))
            x += hmtx[name][0] + TRACKING
        return pen.getCommands(), x

    a, mid = outline(WORDMARK[0], 0.0)
    b, end = outline(WORDMARK[1], mid)

    # ink extents of the whole wordmark, in font units
    glyf = font["glyf"]
    ymin, ymax = 1e9, -1e9
    for text in WORDMARK:
        for ch in text:
            g = glyf[cmap[ord(ch)]]
            ymin = min(ymin, g.yMin)
            ymax = max(ymax, g.yMax)
    cap = font["OS/2"].sCapHeight
    return (a, b), (end, ymin, ymax, upm, cap)


# ------------------------------------------------------------------ pieces
def mark_svg_snippet(x, y, w, ink, fill, paths, h=None):
    """A nested <svg> that keeps the mark's own coordinate system intact."""
    ix0, iy0, ix1, iy1 = ink
    ih = w * (iy1 - iy0) / (ix1 - ix0) if h is None else h
    roof, belt = paths
    stretch = '' if h is None else ' preserveAspectRatio="none"'
    body = f'<path d="{roof}" fill="{fill}"/>'
    if belt:
        body += f'<path d="{belt}" fill="{fill}"/>'
    return (f'<svg x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{ih:.2f}" '
            f'viewBox="{ix0:.2f} {iy0:.2f} {ix1 - ix0:.2f} {iy1 - iy0:.2f}"{stretch}>'
            f'{body}</svg>'), ih


def build_lockup(mark_colors, text_colors, geom=None):
    """Return (svg_text, width, height)."""
    (pa, pb), (adv, ymin, ymax, upm, cap) = wordmark_paths()
    roof, belt, ink = mark_paths(geom)
    ix0, iy0, ix1, iy1 = ink

    S = CAP_TARGET / cap                       # font units -> lockup units
    wm_w = adv * S
    wm_h = (ymax - ymin) * S
    car_w = CAR_INK_RATIO * wm_w
    car_h = car_w * (iy1 - iy0) / (ix1 - ix0)
    gap = CAR_GAP * CAP_TARGET

    W = wm_w
    H = car_h + gap + wm_h
    baseline = car_h + gap + ymax * S

    car, _ = mark_svg_snippet((W - car_w) / 2, 0.0, car_w, ink, mark_colors[0],
                              (roof, belt))
    body = (f'<g transform="translate(0 {baseline:.2f}) scale({S:.6f} {-S:.6f})">'
            f'<path d="{pa}" fill="{text_colors[0]}"/>'
            f'<path d="{pb}" fill="{text_colors[1]}"/></g>')

    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.2f} {H:.2f}" '
           f'role="img" aria-label="CantonPickup">'
           f'<title>CantonPickup</title>{car}{body}</svg>')
    return svg, W, H


def build_favicon(size=64, pad_ratio=0.0, radius_ratio=0.22, bed=NAVY_DEEP,
                  vstretch=1.0, tmax_scale=1.0, geom=None, with_belt=True):
    """Square badge.

    pad_ratio < 0 lets the mark bleed past the badge edges (clipped to the
    rounded rect); vstretch stretches the mark vertically so the long, low
    car fills more of the square; tmax_scale fattens the strokes.
    """
    roof, belt, ink = mark_paths(geom, tmax_scale, with_belt)
    ix0, iy0, ix1, iy1 = ink
    mark_w = size * (1.0 - pad_ratio * 2)
    mark_h = mark_w * (iy1 - iy0) / (ix1 - ix0) * vstretch
    mx = (size - mark_w) / 2
    my = (size - mark_h) / 2

    car, _ = mark_svg_snippet(mx, my, mark_w, ink, ORANGE, (roof, belt),
                              h=mark_h)
    rx = size * radius_ratio
    clip = ''
    if pad_ratio < 0:
        clip = (f'<clipPath id="b"><rect width="{size}" height="{size}" '
                f'rx="{rx:.2f}"/></clipPath>')
        car = f'<g clip-path="url(#b)">{car}</g>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
            f'{clip}<rect width="{size}" height="{size}" rx="{rx:.2f}" '
            f'fill="{bed}"/>{car}</svg>'), (mx, my, mark_w, mark_h)


# favicon candidate recipes: name -> kwargs for build_favicon
FAVICON_VARIANTS = {
    "plain":  dict(pad_ratio=0.06),
    "bleed":  dict(pad_ratio=-0.18, tmax_scale=1.15),
    "tall":   dict(pad_ratio=-0.12, vstretch=1.55, tmax_scale=1.10),
    "arc":    dict(pad_ratio=-0.08, vstretch=2.30, tmax_scale=1.35,
                   with_belt=False),
}
FAVICON_CHOICE = "tall"

# The touch icon is rasterised at 180 px, so it can afford the un-bleeding,
# gentler crop; iOS supplies its own corner mask, hence radius 0.
# The touch icon is the same badge as the favicon (identical crop, identical
# stroke weight — the two must read as one mark), just rasterised large and
# square: iOS applies its own corner mask, so radius 0.
TOUCH_ICON = dict(size=180, radius_ratio=0.0, **FAVICON_VARIANTS["tall"])


def write(path: Path, text: str):
    path.write_text(text + "\n", encoding="utf-8")
    print(f"  {path.name}  {len(text.encode('utf-8')):>6} B")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--preview", action="store_true")
    ap.add_argument("--out", default=str(PUBLIC))
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    print("logo:")
    light, W, H = build_lockup((ORANGE,), (NAVY, ORANGE))
    write(out / "logo.svg", light)

    inverse, Wi, Hi = build_lockup((ON_DARK_MARK,), ("#FFFFFF", ON_DARK_B))
    write(out / "logo-inverse.svg", inverse)

    fav, geom = build_favicon(**FAVICON_VARIANTS[FAVICON_CHOICE])
    write(out / "favicon.svg", fav)

    print(f"  lockup {W:.1f} x {H:.1f}   ratio {W / H:.2f}")
    print(f"  favicon mark box x{geom[0]:.1f} y{geom[1]:.1f} {geom[2]:.1f}x{geom[3]:.1f}")

    if args.preview:
        stage = ROOT.parent / ".workbuddy" / "_logo-out"
        stage.mkdir(parents=True, exist_ok=True)
        for f in ("logo.svg", "logo-inverse.svg", "favicon.svg"):
            (stage / f).write_text((out / f).read_text(encoding="utf-8"), encoding="utf-8")
        for name, kw in FAVICON_VARIANTS.items():
            svg, _ = build_favicon(**kw)
            (stage / f"favicon-{name}.svg").write_text(svg + "\n", encoding="utf-8")
        for k in GEOM:
            svg, _, _ = build_lockup((ORANGE,), (NAVY, ORANGE), geom=k)
            (stage / f"logo-{k}.svg").write_text(svg + "\n", encoding="utf-8")
        apple, _ = build_favicon(**TOUCH_ICON)
        (stage / "apple.svg").write_text(apple + "\n", encoding="utf-8")
        print("  apple.svg -> run qa/make-icon.mjs to rasterise the 180 px PNG")
        write_preview(stage)


def write_preview(stage: Path):
    sizes = [16, 24, 32, 48, 64, 128]

    def badge_row(fname):
        return "".join(
            f'<div class="t"><img src="{fname}" style="width:{s}px;height:{s}px">'
            f'<code>{s}px</code></div>' for s in sizes)

    def lockup_row(fname, heights=(26, 32, 40, 56, 88)):
        return "".join(
            f'<div class="t"><img src="{fname}" style="height:{h}px"><code>{h}px</code></div>'
            for h in heights)

    swatches = "".join(
        f'<div class="t"><span class="chip" style="background:{hexv}"></span>'
        f'<code>{name}<br>{hexv}</code></div>'
        for name, hexv in (("navy", NAVY), ("orange", ORANGE),
                           ("navy bed", NAVY_DEEP), ("mark on blue", ON_DARK_MARK),
                           ("pickup on blue", ON_DARK_B)))

    geo_rows = "".join(
        f'<div class="t"><img src="logo-{k}.svg" style="height:64px">'
        f'<code>geometry {k}{" &larr; shipped" if k == GEOM_CHOICE else ""}</code></div>'
        for k in GEOM)

    fav_rows = "".join(
        f'<div class="t"><img src="favicon-{n}.svg" style="width:64px;height:64px">'
        f'<code>{n}{" &larr; shipped" if n == FAVICON_CHOICE else ""}</code></div>'
        for n in FAVICON_VARIANTS)

    def nbytes(name):
        f = stage / name
        return f"{f.stat().st_size:,} B" if f.exists() else "&mdash;"

    html = f"""<!doctype html><meta charset="utf-8">
<title>CantonPickup brand sheet</title>
<style>
 body{{font:13px/1.5 system-ui;margin:0;padding:26px 30px;background:#fff;color:#12283c;
      max-width:900px}}
 h1{{font:800 20px/1.2 system-ui;margin:0 0 4px}}
 .lede{{color:#5b7a95;margin:0 0 24px}}
 h3{{margin:26px 0 10px;font:600 11.5px/1 system-ui;letter-spacing:.1em;
     text-transform:uppercase;color:#5b7a95}}
 .row{{display:flex;align-items:flex-end;gap:20px;flex-wrap:wrap}}
 .t{{text-align:center}} code{{color:#8896a6;font-size:11px;display:block;margin-top:6px;
      line-height:1.35}}
 img{{display:block}}
 .panel{{background:{'#0d69a6'};padding:18px 20px;border-radius:10px}}
 .panel2{{background:{NAVY_DEEP};padding:18px 20px;border-radius:10px}}
 .card{{border:1px solid #e2edf5;border-radius:10px;padding:14px 18px}}
 .bar{{border:1px solid #e2edf5;border-radius:10px;height:76px;display:flex;
       align-items:center;padding:0 20px;gap:16px;background:#fff}}
 .bar .nav{{margin-left:auto;color:#5b7a95;font-size:12px;letter-spacing:.02em}}
 .chip{{display:block;width:56px;height:34px;border-radius:8px;border:1px solid #0001}}
 .note{{color:#5b7a95;font-size:12px;margin:8px 0 0}}
 ul{{color:#5b7a95;font-size:12px;margin:8px 0 0;padding-left:18px}}
</style>

<h1>CantonPickup &mdash; logo &amp; favicon</h1>
<p class="lede">Rebuilt as vectors from the supplied 105&times;40 px raster.
One generated lockup drives the header, the footer and the favicon, so the brand
can never drift between them. Regenerate with <code style="display:inline">python scripts/make-logo.py</code>.</p>

<h3>Lockup &mdash; light</h3>
<div class="card"><img src="logo.svg" style="width:480px"></div>
<div class="row" style="margin-top:12px">{lockup_row('logo.svg')}</div>

<h3>Lockup &mdash; inverse (footer, on #0d69a6)</h3>
<div class="panel"><img src="logo-inverse.svg" style="width:380px"></div>
<div class="row" style="margin-top:12px">
  <div class="panel2"><img src="logo-inverse.svg" style="width:280px"></div>
</div>

<h3>Header simulation &mdash; 76 px bar</h3>
<div class="bar"><img src="logo.svg" style="height:44px">
  <span class="nav">Home &nbsp; Services &nbsp; Vehicles &amp; Pricing &nbsp; Reviews
   &nbsp; About Us &nbsp; FAQs &nbsp; Contact</span></div>

<h3>Favicon &amp; touch icon</h3>
<div class="row">{badge_row('favicon.svg')}
  <div class="t"><img src="apple.svg" style="width:64px;height:64px"><code>apple-touch<br>180 px PNG</code></div>
</div>

<h3>Palette</h3>
<div class="row">{swatches}</div>
<p class="note">Navy is the site's <code style="display:inline">--c-800</code>, orange is
sampled from the supplied raster. On the footer blue the mark flips to amber and
&ldquo;Pickup&rdquo; to <code style="display:inline">--c-300</code>, the same relationship the
previous mark used.</p>

<h3>Rejected alternatives</h3>
<div class="row">{geo_rows}</div>
<div class="row" style="margin-top:14px">{fav_rows}</div>
<p class="note">Geometry v1 carried a heavier roof and a longer sill &mdash; at 26&ndash;32 px
the two strokes merged into one orange bar. v2 thins the roof from 16 to 13 units
and pulls the sill back, so the window gap survives down to 32 px. The favicon
keeps the belt (unlike the &ldquo;arc&rdquo; candidate) so the tab mark is the same
drawing as the letterhead.</p>

<h3>Files</h3>
<ul>
 <li><code style="display:inline">public/logo.svg</code> &mdash; header lockup,
     {nbytes('logo.svg')}</li>
 <li><code style="display:inline">public/logo-inverse.svg</code> &mdash; footer lockup,
     {nbytes('logo-inverse.svg')}</li>
 <li><code style="display:inline">public/favicon.svg</code> &mdash; tab badge,
     {nbytes('favicon.svg')}</li>
 <li><code style="display:inline">public/apple-touch-icon.png</code> &mdash; 180&times;180
     home-screen icon</li>
</ul>
"""
    (stage / "preview.html").write_text(html, encoding="utf-8")
    print(f"  preview -> {stage / 'preview.html'}")


if __name__ == "__main__":
    main()
