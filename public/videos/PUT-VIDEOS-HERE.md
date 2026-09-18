# Videos — everything about a clip lives in *this* folder

Drop the files in, run `npm run assets` (or just `npm run dev` / `npm run build`
— the scan runs first every time), and the clip appears on the homepage. There
is no list to edit anywhere else.

The rule is always the same: **three files sharing a basename**. Poster and
caption are both optional — add only what you have.

---

## 1. A clip hosted on YouTube / Vimeo

```json
public/videos/airport-pickup.json     <- the link + the wording
public/videos/airport-pickup.jpg      <- the thumbnail
```

`airport-pickup.json`:

```json
{
  "title": "Clients pickup at Guangzhou Baiyun airport",
  "caption": "Meet & greet in the arrivals hall, then straight to the hotel",
  "url": "https://youtube.com/shorts/DUJfKv6unPg",
  "order": 1
}
```

| field     | what it does                                                                    |
| --------- | ------------------------------------------------------------------------------- |
| `title`   | the bold line under the card. Defaults to the filename, prettified.              |
| `caption` | the small grey line under the title. Optional.                                   |
| `url`     | the page you copied out of the browser. `/watch?v=`, `youtu.be/`, `/shorts/`, `/embed/` and `/live/` links all work — the gallery rewrites them into a player URL by itself, and works out that it is YouTube or Vimeo on its own. |
| `order`   | optional. Lower = earlier. Without it, clips are shown alphabetically by filename. |
| `poster`  | optional. Point at a picture somewhere else under `public/`, e.g. `/images/hero/airport.jpg`. The sibling `.jpg` in this folder wins if there is one. |

No `.jpg`? The card still shows up, play button on a dark panel.

> **Do not paste a `/shorts/` link as a YouTube *embed* URL** and do not expect
> one to render here — `youtube.com/shorts/…` refuses to load inside a frame.
> Give the plain share link in `url` and let the gallery convert it.

## 2. A clip file you host yourself

```json
public/videos/factory-day.mp4          <- the video      (required)
public/videos/factory-day.jpg          <- the thumbnail  (optional)
public/videos/factory-day.json         <- title/caption  (optional)
```

```json
{
  "title": "A day of factory visits",
  "caption": "Three factories, one morning"
}
```

Supported formats: `.mp4`, `.webm`, `.mov`, `.m4v`, `.ogv`.
`.mp4` (H.264) plays everywhere, so prefer it. Keep files under about 15 MB —
anything longer than a few seconds belongs on YouTube or a CDN instead
(option 1 above).

---

## Making a thumbnail

YouTube's own thumbnails are not usable on this site: a Short's
`maxresdefault` frame carries the creator's burned-in Chinese subtitles, which
reads badly on an all-English page. So the thumbnail is made from a real photo
of the service, with the brand burned in:

```bash
python scripts/make-video-poster.py photo.jpg public/videos/airport-pickup.jpg
python scripts/make-video-poster.py --plain photo.jpg public/videos/airport-pickup.jpg   # wordmark instead of badge
```

It crops to 16:9 (the card's shape) and stamps a blue `CantonPickup` badge in
the bottom-left corner. Any photo sized 4:3 or wider works.

---

## Notes

- Files whose names start with `_` are ignored — handy for scratch copies.
- A clip without a `.json` still appears; the title comes from the filename
  (`airport-pickup.mp4` → "Airport Pickup").
- A `.json` with a `url` but no picture still appears. A stray `.jpg` or `.txt`
  on its own is ignored — it is not a clip.
- Clips load in batches of 6 as the visitor scrolls, so this folder can grow
  without slowing the homepage down.
