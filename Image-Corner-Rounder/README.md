# 🔲 Corner Rounder

A lightweight, zero-dependency browser tool for rounding image corners — no server, no uploads, no nonsense.

Everything runs locally in your browser using the Canvas API. Your images never leave your device.

---

## Features

- **Drag & drop or click to upload** — supports PNG, JPG, WEBP, and GIF
- **Multi-image support** — process as many images as you want at once
- **Live preview** — rounded corners update in real time as you move the slider
- **Radius slider** — fine-tune from 0% (sharp) to 50% (perfect circle)
- **Quick presets** — None / Soft / Round / Puffy / Circle for fast picks
- **Per-image download** — export each image individually as a transparent PNG
- **Download All** — grab every processed image in one click
- **Checkerboard preview background** — so transparency is clearly visible
- **No backend** — 100% client-side, works offline once the page is loaded

---

## Usage

### Option 1 — Open directly

Just download [`Corner-Rounder.html`](./Corner-Rounder.html) and open it in any modern browser. That's it.

### Option 2 — Serve locally

```bash
# Python 3
python -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080`.

### Option 3 — GitHub Pages

Fork this repo, enable GitHub Pages from the repo settings (source: `main` branch, root), and your tool will be live at:

```
https://<your-username>.github.io/<repo-name>/
```

---

## How It Works

Corner rounding is done entirely via the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API):

1. The uploaded image is drawn onto an offscreen `<canvas>`
2. A clipping path with rounded corners is applied using `quadraticCurveTo`
3. The corner radius is calculated as a **percentage of the shorter image dimension**, so it scales correctly regardless of image size or aspect ratio
4. The result is exported as a PNG (with alpha transparency) via `canvas.toDataURL('image/png')`

---

## Browser Support

Works in all modern browsers. No polyfills needed.

| Browser | Support |
|---------|---------|
| Chrome / Edge | ✅ |
| Firefox | ✅ |
| Safari | ✅ |
| Mobile (iOS / Android) | ✅ |

---

## File Structure

```
corner-rounder/
└── corner-rounder.html   # The entire tool — single self-contained file
└── README.md
```

---

## Privacy

No data ever leaves your device. There is no backend, no analytics, no tracking, and no network requests made during image processing. Files are read and processed entirely in-memory via the browser's Canvas API.

---

## License

MIT — free to use, modify, and distribute.
