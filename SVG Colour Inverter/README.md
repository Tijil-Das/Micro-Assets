# ⬡ SVG Colour Inverter

A zero-dependency, browser-based tool that inverts every colour in an SVG file — with **zero structural changes** guaranteed.

No installs. No servers. No uploads to any third party. Drop in an SVG, click invert, download.

---

## Features

- **Drag & drop or click-to-browse** file loading
- **Side-by-side preview** — original and inverted, rendered live in the browser
- **Structural integrity check** — tag counts are compared before and after; any mismatch is flagged in the log
- **Comprehensive colour format support:**
  - `#rgb` and `#rrggbb` hex
  - `rgb()` and `rgba()` — including `%`-based values
  - `hsl()` and `hsla()`
  - All 140+ CSS named colours (`red`, `cornflowerblue`, `papayawhip`, …)
- **All SVG colour surfaces covered:**
  - Presentation attributes — `fill`, `stroke`, `stop-color`, `flood-color`, `color`
  - Inline `style="..."` attributes
  - `<style>` CSS blocks embedded in the SVG
- **Granular toggle controls** — choose which attribute types and colour formats to process
- **Transparency preservation options** — keep `none` and fully-transparent `rgba(..., 0)` values untouched
- **Operation log** — timestamped trace of every processing step
- **One-click download** — output saved as `originalname_inverted.svg`

---

## Usage

1. Open `SVG-Color-Inverter.html` in any modern browser — no server required.
2. Drop your `.svg` file onto the drop zone, or click it to browse.
3. Adjust the toggle controls if needed (defaults cover most cases).
4. Click **Invert Colours**.
5. Review the side-by-side preview and the operation log.
6. Click **Download Inverted SVG**.

---

## Toggle Controls

| Control | What it does |
|---|---|
| `fill` | Invert `fill` presentation attributes |
| `stroke` | Invert `stroke` presentation attributes |
| `stops` | Invert `stop-color` (gradient stops) |
| `inline style` | Invert colours inside `style="..."` attributes |
| `style blocks` | Invert colours inside `<style>` elements |
| `keep none` | Leave `fill="none"` / `stroke="none"` untouched |
| `keep rgba` | Leave fully-transparent `rgba(..., 0)` values untouched |
| `hex` | Process `#rrggbb` / `#rgb` tokens |
| `rgb` | Process `rgb()` / `rgba()` tokens |
| `hsl` | Process `hsl()` / `hsla()` tokens |
| `named` | Process CSS named colour keywords |

---

## How It Works

The tool processes the SVG entirely in-browser using the native DOM APIs — no canvas, no filters, no external libraries.

```
SVG string
   │
   ▼
DOMParser  →  SVG DOM tree
   │
   ▼
Walk every element
   ├─ presentation attributes  (fill, stroke, stop-color, …)
   ├─ inline style attributes  (style="fill:#fff")
   └─ <style> block text       (CSS rules)
         │
         ▼
      For each colour token:
         hex  →  parse R,G,B  →  255-R, 255-G, 255-B  →  hex
         rgb  →  same arithmetic
         hsl  →  convert to RGB  →  invert  →  output as hex
        named →  look up RGB table  →  invert  →  output as hex
   │
   ▼
XMLSerializer  →  output SVG string
   │
   ▼
Structural check  (input tag count === output tag count)
   │
   ▼
Blob URL  →  preview + download
```

The SVG's structure — tag names, nesting, `id`, `class`, `d`, `transform`, `viewBox`, `xmlns`, and every non-colour attribute — is never read for mutation. Only the resolved string value of colour-bearing attributes and CSS text is rewritten.

---

## Supported Browsers

Any modern browser with `DOMParser`, `XMLSerializer`, and `Blob` URL support.

| Browser | Minimum version |
|---|---|
| Chrome / Edge | 88+ |
| Firefox | 85+ |
| Safari | 14+ |

---

## Limitations

- **`currentColor`** — inherits colour from context at render time; skipped (cannot be inverted statically).
- **`var(--custom-prop)`** — CSS custom properties are skipped; the property definition itself would need to be traced.
- **`url(#id)` references** — paint server references (`linearGradient`, `pattern`, etc.) are not followed by the attribute parser, but the stops inside those elements are processed when `stops` is enabled.
- **Raster content** — embedded `<image>` pixel data is not modified.
- **External stylesheets** — `<?xml-stylesheet?>` or `<link>` references to external CSS are not fetched or processed.

---

## File Structure

```
svg-color-inverter.html   ← the entire tool; self-contained, no dependencies
README.md
```

Everything lives in one HTML file. There is no build step, no `node_modules`, and no runtime dependencies. The only network request is an optional Google Fonts load for the UI typefaces — the inversion logic works fully offline.

---

## License

MIT — do whatever you like with it.
