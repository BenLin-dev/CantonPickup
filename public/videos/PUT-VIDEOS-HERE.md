# Videos — drop them in this folder

## A video file

```
public/videos/airport-pickup.mp4              the video
public/videos/airport-pickup.jpg              optional poster image
public/videos/airport-pickup.json             optional caption
```

```json
{
  "title": "Baiyun Airport pickup",
  "caption": "Meet & greet in the arrivals hall"
}
```

Supported formats: `.mp4`, `.webm`, `.mov`, `.m4v`, `.ogv`.
`.mp4` (H.264) plays everywhere, so prefer it.

Keep files under about 15 MB — large videos make the page slow. For anything
longer than a few seconds, host it on a CDN or YouTube and link it instead
(see below).

## A video hosted elsewhere (YouTube, Vimeo, CDN)

Use `public/data/videos.manual.json`:

```json
[
  {
    "title": "A day of factory visits in Foshan",
    "url": "https://www.youtube.com/embed/VIDEO_ID",
    "poster": "/images/hero/factory.jpg",
    "caption": "Three factories, one day"
  }
]
```

`url` is rendered in an embedded player. Leave it out and use `src` instead if
you are pointing at a plain video file on another server.

---

After adding files, run:

```bash
npm run assets
```

(or just `npm run dev` — the scan runs first every time).
