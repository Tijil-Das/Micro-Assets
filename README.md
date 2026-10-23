# 📦 Micro-Assets

> A curated collection of lightweight micro-tools, single-file browser utilities, terminal scripts, and personal developer learnings.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-success.svg)](#)
[![Client-Side Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-brightgreen.svg)](#)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](#)

---

## 🎯 Overview

**Micro-Assets** brings together focused, zero-bloat utilities designed to do one job cleanly, reliably, and with maximum privacy. The browser tools run entirely on client-side Web APIs (no server tracking, no network calls, no telemetry), the terminal scripts run natively without third-party runtimes, and the dev knowledge base documents real-world architectural learnings and patterns.

---

## 🗂️ Catalog & Structure

| Directory | Type | Description | Tech Stack |
|---|---|---|---|
| [**`Claude-Data-Renderer/`**](./Claude-Data-Renderer) | Web Tool | Local viewer to render, search, and browse exported Claude chat archives (`.zip` / `.json`). | HTML5, CSS3, JSZip, Local APIs |
| [**`SVG-Colour-Inverter/`**](./SVG-Colour-Inverter) | Web Tool | Invert all colours in any SVG with guaranteed zero structural DOM mutations and live comparison preview. | HTML5, DOMParser, XMLSerializer |
| [**`Image-Corner-Rounder/`**](./Image-Corner-Rounder) | Web Tool | Real-time image corner rounding and clipping with multi-image support, live preview, and PNG export. | HTML5, Canvas API |
| [**`Check-Max-File-Size/`**](./Check-Max-File-Size) | CLI Utility | Recursive Windows batch script to scan any folder and pinpoint the largest file and exact byte size. | Windows CMD / Batch |
| [**`My-Dev-Learnings/`**](./My-Dev-Learnings) | Knowledge Base | Structured engineering journal covering real-world mistakes, authentication traps, and patterns. | Markdown, Knowledge Base |

---

## 🚀 Tool Details & Quick Start

### 1. 💬 [Claude Data Renderer](./Claude-Data-Renderer)
- **Path:** [`Claude-Data-Renderer/claude-archive-viewer.html`](./Claude-Data-Renderer/claude-archive-viewer.html)
- **What it does:** Renders exported Claude AI chats in a clean, authentic Claude UI with dark and light themes, in-memory search, conversation jumping, and code highlighting.
- **How to run:** Double-click or open `claude-archive-viewer.html` in any browser. Drag and drop your exported zip or json archive.

### 2. ⬡ [SVG Colour Inverter](./SVG-Colour-Inverter)
- **Path:** [`SVG-Colour-Inverter/SVG-Color-Inverter.html`](./SVG-Colour-Inverter/SVG-Color-Inverter.html)
- **What it does:** Inverts color tokens across presentations attributes, inline styles, and embedded `<style>` tags while preserving element tags, structure, and attributes intact.
- **How to run:** Open `SVG-Color-Inverter.html` in any modern web browser, drop an SVG file, and export the inverted file.

### 3. 🔲 [Image Corner Rounder](./Image-Corner-Rounder)
- **Path:** [`Image-Corner-Rounder/Corner-Rounder.html`](./Image-Corner-Rounder/Corner-Rounder.html)
- **What it does:** Rounds image corners with real-time sliders and presets (Soft, Round, Puffy, Circle). Supports PNG, JPG, WEBP, and GIF batch processing.
- **How to run:** Open `Corner-Rounder.html` in your browser. Drag and drop single or multiple images, adjust corner radius, and download individual files or a batch.

### 4. 📁 [Check Max File Size](./Check-Max-File-Size)
- **Path:** [`Check-Max-File-Size/Check Max File Size.cmd`](./Check-Max-File-Size/Check%20Max%20File%20Size.cmd)
- **What it does:** Quickly finds the single largest file within any target folder (and its nested subfolders) on Windows without needing PowerShell or third-party tools.
- **How to run:** Double-click `Check Max File Size.cmd` or run in Command Prompt:
  ```cmd
  "Check Max File Size.cmd"
  ```
  Enter the path to scan when prompted.

### 5. 🧠 [My Dev Learnings](./My-Dev-Learnings)
- **Path:** [`My-Dev-Learnings/README.md`](./My-Dev-Learnings/README.md)
- **What it does:** A personal engineering repository documenting solutions, debugging steps, and architecture decisions encountered across projects (OAuth sign-in, COM object memory leaks, etc.).
- **How to explore:** Start at [`My-Dev-Learnings/START-HERE.md`](./My-Dev-Learnings/START-HERE.md) or scan [`My-Dev-Learnings/INDEX.md`](./My-Dev-Learnings/INDEX.md).

---

## 🔒 Privacy & Principles

- **100% Client-Side:** All browser tools operate completely on device memory. Zero analytics, zero data transmission, zero tracking.
- **Zero Heavy Toolchains:** No complicated build pipelines or massive `node_modules` folders to run simple utilities.
- **Single-File Portability:** Tools are packaged cleanly so you can download a single HTML file or script and run it anywhere, anytime.

---

## 📜 License

All tools and documentation in this repository are licensed under the [MIT License](LICENSE).
