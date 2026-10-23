# 💬 Claude Data Renderer (Export Viewer)

A zero-dependency, local-first web application to render, browse, and search exported chat archives from Claude (Anthropic).

Everything runs 100% locally in your browser. Your exported archives and private chat transcripts are never uploaded to any remote server.

---

## Features

- **Direct ZIP / JSON Archive Import** — Drag & drop or select exported Claude chat archives (`.zip` containing `conversations.json` or standalone `.json`).
- **Faithful Claude Aesthetic** — Modeled after Claude's official interface with both Dark and Light themes.
- **Full Conversation History Browsing** — Sidebar listing of conversations sorted chronologically with easy selection.
- **Search & Filter** — Fast in-memory search across messages and conversations.
- **Artifacts & Markdown Rendering** — Renders markdown formatting, code blocks with syntax highlighting, and conversation bubbles.
- **Zero Backend / Complete Privacy** — Client-side parsing using JSZip and native browser APIs. Works completely offline.

---

## Usage

1. Open [`claude-archive-viewer.html`](./claude-archive-viewer.html) in any modern web browser.
2. Drag and drop your Claude export `.zip` or `conversations.json` file into the viewer.
3. Browse, search, and view your conversation history cleanly.

---

## File Structure

```
Claude-Data-Renderer/
├── claude-archive-viewer.html   # Standalone web app (single file)
├── LICENSE                      # MIT License
└── README.md
```

---

## License

MIT License — free to use, modify, and distribute.
