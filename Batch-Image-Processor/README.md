# 🖼️ Batch Image Processor

A high-performance, zero-dependency browser tool for batch processing, color grading, tone adjusting, transforming, and converting images — completely local, with zero server uploads and zero tracking.

Process dozens or hundreds of images simultaneously directly inside your browser using the Canvas API and Web APIs.

---

## ✨ Features

- **Bulk & Folder Import** — Drag and drop multiple files or select an entire directory at once (`webkitdirectory` support).
- **Color Adjustments** — Fine-tune Hue Rotation (-180° to +180°), Saturation (0% to 200%), and Tint (Hue & Strength overlay).
- **Tone & Exposure Controls** — Adjust Brightness, Contrast, and Exposure in real-time.
- **Creative Effects** — Apply Blur, Sharpening, Vignette, and Noise filters.
- **Quick Transforms** — One-click toggles for Grayscale, Invert, Sepia, Flip Horizontal, Flip Vertical, and Rotate 90°.
- **Smart Resizing** — Keep original size, fit to target width, fit to target height, or fit within bounding box dimensions.
- **Flexible Export Options** — Convert to WebP, JPEG, or PNG with custom compression quality sliders.
- **Instant Preview & Batch Zip** — Live thumbnail grid preview with per-image download buttons or a single-click "Download .zip" export.
- **Dual UI Layouts Included:**
  - `batch-image-processor-v2.html`: Modern split-view workspace with fixed control sidebar and live preview canvas.
  - `batch-image-processor.html`: Classic vertical flow layout.

---

## 🚀 Usage

### Option 1 — Direct Open
Simply double-click or open [`batch-image-processor-v2.html`](./batch-image-processor-v2.html) in any modern browser. No build steps, runtime, or installation required.

### Option 2 — Local Static Server
```bash
# Python 3
python -m http.server 8080

# Node (npx)
npx serve .
```
Navigate to `http://localhost:8080/Batch-Image-Processor/batch-image-processor-v2.html`.

---

## ⚙️ How It Works

1. **In-Memory Reading:** Files are ingested as `Blob` objects and decoded into `HTMLImageElement` instances locally via `URL.createObjectURL`.
2. **Canvas Pipeline:** Adjustments (CSS filters, pixel-level manipulation for noise and sharpening, dimension scaling, and transformations) are rendered into an offscreen `<canvas>` element.
3. **Lossless / Configurable Encoding:** Processed canvases are exported as Blobs via `canvas.toBlob()`.
4. **Local Archiving:** When exporting as a batch `.zip`, files are bundled in-memory using [JSZip](https://stuk.github.io/jszip/) and triggered as a browser download.

---

## 📁 File Structure

```
Batch-Image-Processor/
├── batch-image-processor-v2.html   # Modern split-pane workspace (recommended)
├── batch-image-processor.html      # Classic layout
├── LICENSE                         # MIT License
└── README.md                       # Documentation
```

---

## 🔒 Privacy & Security

- **100% Client-Side:** All image processing runs strictly within browser memory on your device.
- **Zero Network Traffic:** Images are never transmitted over the internet or uploaded to any remote server.
- **Zero Telemetry:** No analytics, trackers, cookies, or remote logging.

---

## 📜 License

MIT License — free to use, modify, and distribute. See [LICENSE](LICENSE) for details.
