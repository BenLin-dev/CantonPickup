# Review photos — drop them in this folder

Any image you copy into this folder appears on the review wall automatically.
Nothing in the code needs to change.

## Just a photo

```
public/images/reviews/IMG_1234.jpg
```

The photo appears on the wall. Rating defaults to 5 stars.

## A photo with a caption

Add a sidecar file with **the same name** as the photo:

```
public/images/reviews/anna-airport.jpg
public/images/reviews/anna-airport.json
```

```json
{
  "name": "Anna K.",
  "text": "Driver was waiting in arrivals with our name on a sign. Smooth ride to Foshan.",
  "rating": 5,
  "service": "Airport transfer",
  "date": "March 2026",
  "alt": "Airport pickup at Baiyun Airport"
}
```

Only `name` and `text` really matter — everything else is optional.

## A caption without JSON

A `.txt` sidecar works too. The first line becomes the reviewer's name and
everything after it is the review text:

```
public/images/reviews/IMG_1234.txt
```

```
Marco B.
Used CantonPickup three days in a row for factory visits. Always early.
```

## A video review

Put the video in `public/videos/` and the still in this folder with the same
name. The wall will play the video and use the image as the poster.

## Text-only review (no photo)

Add it to `public/data/reviews.manual.json`:

```json
[
  {
    "name": "Peter L.",
    "text": "Booked a full-day driver for meetings in Guangzhou and Foshan.",
    "rating": 5,
    "service": "Full-day private driver",
    "date": "February 2026"
  }
]
```

## Punctuation in review text

Apostrophes are fine exactly as typed: `"the driver's sign"`.

The only characters you need to escape in JSON are a double quote (`\"`) and a
backslash (`\\`). Non-ASCII characters such as `—` or `é` can be typed directly
as long as the file is saved as UTF-8.

---

After adding files, run:

```bash
npm run assets
```

(or just `npm run dev` — the scan runs first every time).
