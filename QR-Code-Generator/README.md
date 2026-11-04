# 📱 QR Code Generator CLI

> A fast, zero-telemetry CLI tool to generate high-resolution QR codes from any text or URL string. Simultaneously exports both an infinitely scalable vector `.svg` and an ultra-crisp, print-ready (300 DPI) `.jpg` strictly into its own directory.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Client-Side Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-brightgreen.svg)](#)

---

## 🎯 Overview

Most online QR code generators inject tracking redirects, limit download resolutions, watermark outputs, or upload your data to external servers.

**QR Code Generator CLI** is built according to Micro-Assets principles:
- **100% Offline & Private:** No network requests, analytics, or third-party tracking. All encoding and rendering happen entirely in memory on your machine.
- **Dual Vector & Raster Output:** Generates both a clean, single-path vector `.svg` (infinite scalability) and a 300 DPI high-resolution `.jpg` (print and social media ready).
- **Strict Directory Isolation:** Guaranteed to write all generated files strictly inside this tool's directory, regardless of which working directory you execute the script from.
- **High Error Correction (Level H):** Built with ~30% Reed-Solomon data recovery capability, ensuring QR codes remain scan-resilient even when partially obscured or printed on textured surfaces.

---

## 🚀 Usage

### 1. Interactive CLI Mode (Recommended)

Run the script without arguments. It will prompt you for the text or URL to encode and an optional filename:

```bash
python qr_generator.py
```

```
======================================================
        Micro-Assets QR Code Generator CLI
======================================================

Enter the text or URL to encode:
> https://github.com/Tijil-Das/Micro-Assets
Output filename [press Enter for 'qrcode']: my_qr

[*] Generating QR code...

[+] Successfully generated QR assets in directory:
    Directory : T:\Coding\Micro Assets\QR-Code-Generator

    1. Vector SVG   : my_qr.svg
       - Path       : T:\Coding\Micro Assets\QR-Code-Generator\my_qr.svg
       - Type       : Scalable Vector Graphics (Infinite Resolution)
       - Size       : 13.4 KB

    2. High-Res JPG : my_qr.jpg
       - Path       : T:\Coding\Micro Assets\QR-Code-Generator\my_qr.jpg
       - Resolution : 2700 x 2700 px @ 300 DPI (Print Ready)
       - Quality    : 95% JPEG (4:4:4 Chroma)
       - Size       : 285.6 KB

======================================================
```

### 2. Direct CLI Arguments Mode

Pass your payload directly on the command line:

```bash
# Basic generation (defaults to 'qrcode.svg' and 'qrcode.jpg')
python qr_generator.py "https://example.com"

# Specify custom base filename
python qr_generator.py "https://example.com" -o wifi_login
```

### 3. Windows 1-Click Launcher

Double-click `generate-qr.cmd` or run from Windows Command Prompt:

```cmd
generate-qr.cmd
```

---

## 📦 Output Specifications

| Asset Format | File | Resolution / Specs | Ideal Use Cases |
|---|---|---|---|
| **Vector SVG** | `*.svg` | Scalable vector paths (lossless) | Web graphics, Figma, Adobe Illustrator, CAD, plotting, laser engraving |
| **High-Res JPG** | `*.jpg` | 2400×2400 to 3000×3000 px @ 300 DPI, 95% quality | Print handouts, poster designs, banners, packaging, presentations |

---

## ⚙️ Installation & Requirements

- Python 3.10 or newer
- Dependencies: `qrcode` and `pillow`

```bash
pip install -r requirements.txt
```

---

## 📜 License

Licensed under the [MIT License](LICENSE).
