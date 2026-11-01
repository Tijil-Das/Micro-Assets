# electron-win11-snap-overlay

> Native Windows 11 Snap Layout flyout for Electron apps with custom title bars.

[![npm](https://img.shields.io/npm/v/electron-win11-snap-overlay)](https://www.npmjs.com/package/electron-win11-snap-overlay)
[![license](https://img.shields.io/npm/l/electron-win11-snap-overlay)](./LICENSE)
[![platform](https://img.shields.io/badge/platform-Windows%2011-blue)](https://www.microsoft.com/windows/windows-11)
[![CI](https://github.com/Tijil-Das/Electron-Win11-Snap-Overlay/actions/workflows/ci.yml/badge.svg)](https://github.com/Tijil-Das/Electron-Win11-Snap-Overlay/actions/workflows/ci.yml)

---

## The Problem

Electron apps built with `titleBarStyle: 'hidden'` draw their own caption buttons in HTML. The Windows 11 **Snap Layouts flyout** — the grid that appears when you hover the maximize button — **never fires on an HTML button**.

The flyout is a DWM (Desktop Window Manager) feature. It only activates when the OS receives `WM_NCMOUSEMOVE` with `wParam == HTMAXBUTTON` on the top-level window. HTML buttons are just pixels inside Chromium's render surface — DWM has no idea they exist.

## The Solution

This package creates a **transparent, borderless Win32 child window** ("overlay HWND") positioned exactly over your HTML maximize button. The overlay:

1. Returns `HTMAXBUTTON` from `WM_NCHITTEST` for every pixel — the OS treats it as the maximize button
2. Forwards `WM_NCMOUSEMOVE` to `DefWindowProcW(hParent, ...)` — **this arms the DWM Snap Layouts flyout**
3. Forwards `WM_NCMOUSELEAVE` to the parent — dismisses the flyout on mouse-out
4. Emits JS events (`enter`, `leave`, `down`, `click`) via NAPI so your HTML button can update its visual state
5. Paints nothing — your HTML button is fully visible beneath it

**Gracefully degrades** to standard CSS `:hover` on Windows 10, macOS, and Linux.

---

## Installation

```bash
npm install electron-win11-snap-overlay
```

The package ships with prebuilt binaries for Windows x64 and arm64 — no build tools required for end users.

> **Building from source** (contributors / unsupported platforms):
> ```bash
> npm install
> node-gyp rebuild
> ```
> Requires [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) with the "Desktop development with C++" workload.

---

## Quick Start

### 1. Main process

```ts
import { BrowserWindow } from 'electron'
import { SnapController } from 'electron-win11-snap-overlay'

const win = new BrowserWindow({
  titleBarStyle: 'hidden', // required — use your own HTML title bar
  // ...
})

// One line. Safe on all platforms.
SnapController.getOrCreate(win)
```

### 2. Preload

```ts
import { contextBridge, ipcRenderer } from 'electron'
import { SNAP_IPC } from 'electron-win11-snap-overlay'

contextBridge.exposeInMainWorld('electronAPI', {
  snapLayout: {
    getSupportStatus: () =>
      ipcRenderer.invoke(SNAP_IPC.getSupport),

    updateBounds: (bounds) =>
      ipcRenderer.send(SNAP_IPC.updateBounds, bounds),

    onStateChange: (cb) => {
      const h = (_e, s) => cb(s)
      ipcRenderer.on(SNAP_IPC.stateChanged, h)
      return () => ipcRenderer.removeListener(SNAP_IPC.stateChanged, h)
    },

    onRequestBoundsUpdate: (cb) => {
      ipcRenderer.on(SNAP_IPC.requestBoundsUpdate, cb)
      return () => ipcRenderer.removeListener(SNAP_IPC.requestBoundsUpdate, cb)
    },
  },
  // ... your other window controls (minimize, close, etc.)
})
```

### 3. Renderer — React

```tsx
import { useRef, useState } from 'react'
import { useSnapOverlay } from 'electron-win11-snap-overlay/renderer'

function WindowControls() {
  const [maximized, setMaximized] = useState(false)
  const maxBtnRef = useRef<HTMLButtonElement>(null)

  const snap   = window.electronAPI?.snapLayout
  const winApi = window.electronAPI

  const { isOverlayMode, dataHover, dataPressed } = useSnapOverlay(
    maxBtnRef,
    snap,
    winApi,      // for onMaximizedChange / onFullscreenChange subscriptions
    maximized
  )

  return (
    <button
      ref={maxBtnRef}
      data-hover={dataHover}
      data-pressed={dataPressed}
      onClick={() => winApi?.maximize()}
      className={
        isOverlayMode
          // CSS :hover/:active don't fire — overlay intercepts pointer events
          ? 'data-[hover=true]:bg-white/10 data-[pressed=true]:bg-white/20'
          // Fallback: normal CSS on Win10, macOS, Linux
          : 'hover:bg-white/10 active:bg-white/20'
      }
    >
      {maximized ? <RestoreIcon /> : <MaximizeIcon />}
    </button>
  )
}
```

### 3. Renderer — Vanilla JS

See [`example/index.html`](./example/index.html) for a complete vanilla JS implementation (no React, no bundler).

---

## Mini-player / compact mode

If your app has a mode where the maximize button is hidden (e.g. a floating mini-player):

```ts
// Hide and offscreen the overlay
SnapController.getByWindowId(win.id)?.setMiniPlayerMode(true)

// Restore when returning to normal mode
SnapController.getByWindowId(win.id)?.setMiniPlayerMode(false)
```

---

## API Reference

### Main process (`electron-win11-snap-overlay`)

#### `SnapController.getOrCreate(win: BrowserWindow): SnapController`

Creates (or returns the existing) controller for the given window. Call once after creating your `BrowserWindow`. Safe on all platforms.

#### `SnapController.getByWindowId(id: number): SnapController | undefined`

Returns the controller for a window by its Electron window id.

#### `controller.isSupported(): boolean`

True when the native overlay is active on this window.

#### `controller.getSupportStatus(): SnapSupportStatus`

Returns `{ supported: boolean, reason?: string }`. The `reason` field explains why support is unavailable (wrong OS version, missing addon, etc.).

#### `controller.setMiniPlayerMode(isMini: boolean): void`

Hides the overlay when entering compact/mini-player mode. Restores it on exit.

#### `controller.dispose(): void`

Destroys the overlay window. Called automatically on `win.on('closed')`.

#### `SNAP_IPC`

```ts
{
  getSupport:          'snap:get-support',          // ipcMain.handle
  updateBounds:        'snap:update-bounds',         // ipcMain.on
  stateChanged:        'snap:state-changed',         // main → renderer
  requestBoundsUpdate: 'snap:request-bounds-update', // main → renderer
}
```

---

### Renderer (`electron-win11-snap-overlay/renderer`)

#### `useSnapOverlay(buttonRef, snapBridge, windowBridge?, maximized?)`

React hook. See [Quick Start](#quick-start) above.

**Parameters:**

| Param | Type | Description |
|---|---|---|
| `buttonRef` | `RefObject<HTMLButtonElement>` | Ref on the maximize/restore button |
| `snapBridge` | `SnapBridgeAPI \| null` | Your preload snap bridge object |
| `windowBridge` | `WindowBridgeAPI \| null` | Optional: for maximize/fullscreen subscriptions |
| `maximized` | `boolean` | Current maximized state — triggers re-measurement on change |

**Returns** `{ isOverlayMode, buttonState, dataHover, dataPressed }`.

---

### Types

```ts
interface SnapBounds { x: number; y: number; width: number; height: number }
type SnapButtonState = 'idle' | 'hover' | 'pressed'
interface SnapSupportStatus { supported: boolean; reason?: string }
```

---

## Graceful Degradation

| Condition | Behaviour |
|---|---|
| Windows 11 (build ≥ 22000) + addon loaded | Full Snap Layouts flyout ✓ |
| Windows 10 or older | `isOverlayMode: false` → CSS `:hover` fallback |
| macOS / Linux | `isOverlayMode: false` → CSS `:hover` fallback |
| `node-gyp` binary missing | `isOverlayMode: false` → CSS `:hover` fallback |
| Window not resizable/maximizable | `isOverlayMode: false` |

No crashes. No errors thrown at the call site. Everything silently degrades.

---

## How It Works

```
Mouse enters overlay HWND
  → WM_NCMOUSEMOVE received by child window
      → DefWindowProcW(hParent, WM_NCMOUSEMOVE, HTMAXBUTTON, lParam)
          → DWM detects HTMAXBUTTON hover on parent → starts flyout timer
              → Snap Layouts flyout appears ✓

Mouse leaves overlay HWND
  → WM_NCMOUSELEAVE → DefWindowProcW(hParent, ...) → flyout dismissed ✓
```

The overlay is transparent (`NULL_BRUSH`, no `WS_EX_TRANSPARENT`) — your HTML button is fully visible beneath it. Z-order is re-asserted on every resize, focus, and move event to keep the overlay above Chromium's render widget.

See the [detailed technical writeup](https://github.com/Tijil-Das/Electron-Win11-Snap-Overlay/wiki) for the full Win32 message flow.

---

## Example

```bash
cd example
npm install
npm start
```

---

## Requirements

| Requirement | Version |
|---|---|
| Electron | ≥ 28 |
| React *(optional, for the hook)* | ≥ 16.8 |
| Windows 11 *(for Snap Layouts flyout)* | build ≥ 22000 |
| Node.js | ≥ 18 |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

[MIT](./LICENSE) © Tijil Das
