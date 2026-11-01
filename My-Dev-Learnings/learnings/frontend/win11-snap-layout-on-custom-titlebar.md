---
title: "Windows 11 Snap Layout Flyout on a Custom Electron Title Bar"
date: 2026-11-01
category: frontend
tags: [electron, windows, win32, snap-layout, titlebar, native-addon, napi, node-gyp, c++, react, ipc]
project: JioTV Max (Windows)
project-context: "Building a frameless Electron app with a fully custom HTML title bar and caption buttons"
discovered-while: "Implementing the maximize/restore button in the custom title bar — the Windows 11 Snap Layouts flyout never appeared on hover because the HTML button is not a real Win32 HTMAXBUTTON"
triggered-by: research
difficulty: advanced
time-to-resolve: ~2 days
status: complete
portfolio-worthy: yes
source-files:
  - "src/native/snap-overlay/snap_overlay.cpp"
  - "src/native/snap-overlay/binding.gyp"
  - "src/main/snap-overlay/SnapController.ts"
  - "src/main/snap-overlay/addonLoader.ts"
  - "src/main/snap-overlay/geometry.ts"
  - "src/renderer/src/components/layout/WindowControls.tsx"
  - "src/renderer/src/components/layout/useSnapOverlay.ts"
  - "src/shared/types.ts"
  - "src/shared/ipc.ts"
commit: ""
---

# Windows 11 Snap Layout Flyout on a Custom Electron Title Bar

---

## The Problem

JioTV Max uses `titleBarStyle: 'hidden'` in Electron — the native title bar is removed and replaced by a fully custom HTML header with manually drawn caption buttons (Minimize, Maximize, Close).

This is the standard way to get a completely custom-looking window on Windows. The problem: **Windows 11's Snap Layouts flyout — the grid that appears when you hover the maximize button — never showed up.** The flyout is a DWM (Desktop Window Manager) feature exclusively triggered when the OS detects a hover over a real Win32 non-client area button tagged `HTMAXBUTTON`. An HTML `<button>` element is just pixels in a Chromium render surface — DWM has no idea it exists.

---

## The Context

### Why the flyout doesn't fire on an HTML button

Windows 11 introduced Snap Layouts in build 22000. The flyout is controlled by DWM entirely at the OS level. It arms itself on a timer when `WM_NCMOUSEMOVE` is received by the top-level window with `wParam == HTMAXBUTTON`. For that signal to exist, the OS must consider the mouse to be over the non-client area maximize button — which only happens if `WM_NCHITTEST` returns `HTMAXBUTTON` for that mouse position.

Chromium handles `WM_NCHITTEST` for its render window children and returns `HTCLIENT` for everything inside the web view. DWM never sees `HTMAXBUTTON`, so the flyout is never triggered.

### The `titleBarStyle: 'hidden'` model in Electron

When you use `titleBarStyle: 'hidden'`:
- The native Win32 caption bar is removed
- Chromium's child render window (`Chrome_RenderWidgetHostHWND`) fills the entire client area
- The CSS class `drag-region` (or `-webkit-app-region: drag`) applied to HTML elements causes Electron to intercept mouse events and call `ReleaseCapture()` + `SendMessage(WM_NCLBUTTONDOWN, HTCAPTION, ...)` on drag, but that's all — `HTMAXBUTTON` is never produced

### DWM flyout triggering mechanism (reverse-engineered)

The flyout arms when:
1. A top-level `HWND` receives `WM_NCMOUSEMOVE` with `wParam == HTMAXBUTTON`
2. DWM's internal timer fires (roughly 400–500 ms of sustained hover)
3. DWM calls `ShowWindow` on its own flyout popup, positioned relative to the button

To make it fire: you must deliver `WM_NCMOUSEMOVE` with `wParam == HTMAXBUTTON` to the **parent (top-level) window** — not to a child window, not to Chromium's render widget.

---

## The Solution

### High-level architecture

Create a **transparent, invisible Win32 child window** ("overlay HWND") that sits exactly on top of the HTML maximize button. This child window:

1. Returns `HTMAXBUTTON` from `WM_NCHITTEST` for every pixel inside it
2. Forwards `WM_NCMOUSEMOVE` (with `wParam == HTMAXBUTTON`) to `DefWindowProcW(hParent, ...)` — this is the critical DWM trigger
3. Forwards `WM_NCMOUSELEAVE` to `DefWindowProcW(hParent, ...)` — this dismisses the flyout
4. Fires JS callbacks for `enter` / `leave` / `down` / `click` events so the HTML button can update its visual state (hover highlight, pressed state)
5. Is otherwise completely transparent — no background paint, `NULL_BRUSH`, no `WS_EX_TRANSPARENT` (which would break hit-testing)

The overlay is a native Node.js addon (`snap_overlay.node`) built with **node-addon-api (NAPI)** and **node-gyp**. The TypeScript layer (`SnapController`) manages its lifecycle, wires IPC, and keeps it in sync with window geometry changes.

### Step-by-step

#### 1. Build the C++ native addon

The addon exposes six functions via NAPI:
- `attach(hwndBuffer, x, y, w, h, callback) → BigInt` — creates the child overlay HWND and attaches it to the parent
- `updateRect(childHwnd, x, y, w, h) → boolean` — repositions the overlay using `SetWindowPos(HWND_TOP, ...)`
- `setVisible(childHwnd, visible) → boolean` — shows/hides with `SW_SHOWNOACTIVATE` / `SW_HIDE`
- `bringToTop(childHwnd) → boolean` — re-asserts Z-order on top of Chromium's render widget
- `debugHitTest(childHwnd, screenX, screenY) → number` — sends `WM_NCHITTEST` for debugging
- `detach(childHwnd) → boolean` — destroys the child HWND and frees resources

Key window creation flags:
```
WS_CHILD | WS_VISIBLE | WS_CLIPSIBLINGS   // child of the Electron top-level HWND
dwExStyle = 0                              // NOT WS_EX_TRANSPARENT (ruins hit-testing)
                                           // NOT WS_EX_NOACTIVATE (breaks DWM snap assist)
hbrBackground = NULL_BRUSH                 // transparent — HTML button shows through
```

#### 2. The WndProc critical path

```
WM_NCHITTEST    → always return HTMAXBUTTON
WM_ERASEBKGND   → return 1 (suppress painting)
WM_PAINT        → ValidateRect only (no drawing)
WM_NCMOUSEMOVE  → set isHovered, emit "enter", TrackMouseEvent(TME_NONCLIENT|TME_LEAVE),
                   then: DefWindowProcW(hParent, WM_NCMOUSEMOVE, wParam, lParam)
                   ↑ THIS IS THE SNAP FLYOUT TRIGGER
WM_NCMOUSELEAVE → clear isHovered/isPressed, emit "leave"/"cancel",
                   then: DefWindowProcW(hParent, WM_NCMOUSELEAVE, wParam, lParam)
WM_NCLBUTTONDOWN → SetCapture(hwnd), emit "down"
WM_LBUTTONUP     → if pressed+inRect → emit "click" else "cancel", ReleaseCapture
```

`WM_MOUSEACTIVATE` returns `MA_ACTIVATE` so clicking the overlay activates the parent window correctly.

#### 3. TypeScript SnapController (Electron main process)

`SnapController` is a per-window singleton:
- Calls `loadSnapAddon()` to require the `.node` binary from multiple candidate paths (dev, packaged `asar.unpacked`, etc.)
- Checks `isWindows11OrNewerBuild()` — snap layouts only exist on build ≥ 22000
- Checks `win.isResizable() && win.isMaximizable()` — overlay is pointless otherwise
- Registers IPC handlers:
  - `snap:get-support` (invoke) → returns `SnapSupportStatus`
  - `snap:update-bounds` (on) → validates bounds payload and calls `updateButtonBounds()`
- Hooks window events: `resize`, `maximize`, `unmaximize`, `moved`, `focus`, `enter-full-screen`, `leave-full-screen`, `minimize`, `restore`, `did-finish-load`, `render-process-gone`, `closed`
- Hides the overlay on fullscreen/minimize, restores on leave/restore

#### 4. React hook `useSnapOverlay` (renderer)

The hook accepts a `React.RefObject<HTMLButtonElement>` pointing at the maximize button. It:
1. Queries `snapLayout.getSupportStatus()` — if not supported, returns `isOverlayMode: false` and the button behaves with normal CSS `:hover`
2. Subscribes to `snapLayout.onStateChange()` for `'idle' | 'hover' | 'pressed'` from native events
3. Monitors the button's pixel bounds using `getBoundingClientRect()` × `window.devicePixelRatio` and sends them over IPC to the main process via `snapLayout.updateBounds()`
4. Schedules bounds re-measurement with RAF + staggered timeouts at 50 ms / 150 ms / 300 ms to capture the settled geometry after Windows' ~150 ms snap/maximize animations
5. Reacts to `ResizeObserver`, `window resize`, `onMaximizedChange`, `onFullscreenChange`, and `onRequestBoundsUpdate` (pushed from main process)
6. Returns `{ isOverlayMode, dataHover, dataPressed }` — applied as `data-*` attributes on the HTML button

#### 5. WindowControls integration

The HTML button uses the returned data attributes:
```tsx
<button
  ref={maxBtnRef}
  data-hover={dataHover}         // "true" when native overlay says enter
  data-pressed={dataPressed}     // "true" when native overlay says down
  className={cn(
    // base styles ...
    isOverlayMode
      ? 'data-[hover=true]:bg-white/[0.08] data-[pressed=true]:bg-white/[0.12]'
      : 'hover:bg-white/[0.08] active:bg-white/[0.12]'  // CSS fallback
  )}
>
  {maximized ? <WindowsRestoreIcon /> : <WindowsMaximizeIcon />}
</button>
```

When `isOverlayMode` is true, CSS `:hover` and `:active` pseudo-classes are intentionally replaced with the `data-*` driven styles because the native overlay window intercepts all pointer events — the HTML button never receives `mouseover` or `mousedown` from the browser.

---

## The Code

### C++ native addon — WndProc (the critical path)

```cpp
static LRESULT CALLBACK OverlayWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
  // ... lookup ctx and hParent from g_overlayMap ...

  switch (msg) {
    case WM_NCHITTEST:
      return HTMAXBUTTON;  // every pixel is a maximize button

    case WM_ERASEBKGND:
      return 1;  // suppress — HTML button shows through

    case WM_PAINT: {
      ValidateRect(hwnd, NULL);
      return 0;
    }

    case WM_NCMOUSEMOVE: {
      if (ctx && !ctx->isHovered) {
        ctx->isHovered = true;
        EmitEvent(ctx, "enter");
      }

      TRACKMOUSEEVENT tme = {};
      tme.cbSize = sizeof(tme);
      tme.dwFlags = TME_NONCLIENT | TME_LEAVE;
      tme.hwndTrack = hwnd;
      TrackMouseEvent(&tme);

      // *** CRITICAL: arm the DWM Snap Layouts flyout ***
      if (hParent && IsWindow(hParent)) {
        return DefWindowProcW(hParent, msg, wParam, lParam);
      }
      break;
    }

    case WM_NCMOUSELEAVE: {
      // clear hover/press state, emit leave/cancel ...

      // *** dismiss the DWM flyout ***
      if (hParent && IsWindow(hParent)) {
        return DefWindowProcW(hParent, msg, wParam, lParam);
      }
      return 0;
    }
    // ... click handling ...
  }
  return DefWindowProcW(hwnd, msg, wParam, lParam);
}
```

### binding.gyp

```json
{
  "targets": [{
    "target_name": "snap_overlay",
    "conditions": [
      ["OS=='win'", {
        "sources": [ "snap_overlay.cpp" ],
        "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
        "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
        "defines": ["UNICODE", "_UNICODE", "WIN32_LEAN_AND_MEAN"],
        "libraries": ["user32.lib"],
        "msvs_settings": {
          "VCCLCompilerTool": {
            "ExceptionHandling": 1,
            "AdditionalOptions": ["/std:c++17"]
          }
        }
      }, {
        "sources": [ "dummy.cpp" ]  // non-Windows stub
      }]
    ]
  }]
}
```

### TypeScript — SnapController (simplified)

```typescript
import { BrowserWindow, ipcMain } from 'electron'
import { isWindows11OrNewerBuild, validateSnapBounds } from './geometry'
import { loadSnapAddon } from './addonLoader'

export class SnapController {
  private static controllers = new Map<number, SnapController>()

  private constructor(private readonly win: BrowserWindow) {
    if (!isWindows11OrNewerBuild() || !win.isResizable()) {
      this.supported = false; return
    }
    this.addon = loadSnapAddon()
    this.supported = !!this.addon
    if (this.supported) this.initWindowListeners()
  }

  public static getOrCreate(win: BrowserWindow): SnapController { /* ... */ }

  public updateButtonBounds(bounds: SnapBounds | null): void {
    if (!bounds || bounds.width <= 0) { this.setOverlayVisibility(false); return }
    if (this.childHwnd === null) {
      const hwndBuf = this.win.getNativeWindowHandle()
      this.childHwnd = this.addon!.attach(hwndBuf, bounds.x, bounds.y,
                                          bounds.width, bounds.height,
                                          (event) => this.handleNativeEvent(event))
    } else {
      this.addon!.updateRect(this.childHwnd, bounds.x, bounds.y, bounds.width, bounds.height)
      this.setOverlayVisibility(!this.win.isFullScreen() && !this.win.isMinimized())
    }
  }

  private handleNativeEvent(event: string): void {
    switch (event) {
      case 'enter':   this.sendState('hover');   break
      case 'leave':
      case 'cancel':  this.sendState('idle');    break
      case 'down':    this.sendState('pressed'); break
      case 'click':
        this.sendState('idle')
        this.toggleMaximize()
        break
    }
  }
}
```

### React hook — useSnapOverlay (simplified)

```typescript
export function useSnapOverlay(buttonRef, maximized) {
  const [isOverlayMode, setIsOverlayMode] = useState(false)
  const [buttonState, setButtonState] = useState<SnapButtonState>('idle')

  // Check platform support
  useEffect(() => {
    bridge?.snapLayout?.getSupportStatus()
      .then(s => setIsOverlayMode(s.supported))
  }, [bridge])

  // Listen to native hover/press/click events
  useEffect(() => {
    if (!isOverlayMode) return
    return bridge.snapLayout.onStateChange(setButtonState)
  }, [bridge, isOverlayMode])

  // Keep the overlay HWND positioned over the HTML button
  useEffect(() => {
    if (!isOverlayMode) return
    const sendBounds = () => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      const scale = window.devicePixelRatio
      bridge.snapLayout.updateBounds({
        x: Math.round(rect.left * scale),
        y: Math.round(rect.top * scale),
        width:  Math.round(rect.right * scale)  - Math.round(rect.left * scale),
        height: Math.round(rect.bottom * scale) - Math.round(rect.top * scale),
      })
    }
    // RAF + staggered timeouts to capture post-animation final position
    const scheduleUpdate = () => {
      requestAnimationFrame(sendBounds)
      setTimeout(sendBounds, 50)
      setTimeout(sendBounds, 150)
      setTimeout(sendBounds, 300)
    }
    scheduleUpdate()
    const ro = new ResizeObserver(scheduleUpdate)
    ro.observe(document.documentElement)
    window.addEventListener('resize', scheduleUpdate)
    return () => { ro.disconnect(); window.removeEventListener('resize', scheduleUpdate) }
  }, [bridge, isOverlayMode, buttonRef])

  return {
    isOverlayMode,
    dataHover:    buttonState === 'hover'   ? 'true' : undefined,
    dataPressed:  buttonState === 'pressed' ? 'true' : undefined,
  }
}
```

---

## Key Takeaways

- **The snap flyout is triggered by `DefWindowProcW(hParent, WM_NCMOUSEMOVE, HTMAXBUTTON, ...)`.** There is no documented API or flag to enable it — you must produce the exact Win32 message sequence that DWM expects.
- **A transparent Win32 child HWND is the only reliable approach.** `WS_EX_TRANSPARENT` would break hit-testing (mouse passes through). `WS_EX_NOACTIVATE` breaks DWM's snap assist. Neither should be set.
- **The overlay HWND must sit on top of Chromium's render widget.** Use `SetWindowPos(HWND_TOP, ...)` without `SWP_NOZORDER` every time you reposition. Re-assert Z-order on every `focus`, `resize`, `moved`, `did-finish-load` window event.
- **CSS `devicePixelRatio` scaling is mandatory for DPI accuracy.** `getBoundingClientRect()` returns CSS pixels; the Win32 child window needs physical pixels. Multiply by `window.devicePixelRatio` and round to integers.
- **Windows 11 snap/maximize animations run ~150 ms.** The button's final settled pixel position cannot be read immediately on a `resize` event. Schedule follow-up measurements at 50 ms, 150 ms, and 300 ms after the trigger.
- **Snap Layouts only exist on Windows 11 (build ≥ 22000).** Always check `os.release()` and fall back gracefully to plain CSS `:hover` on Win 10 and macOS/Linux.

---

## What NOT to Do

- **Do NOT use `WS_EX_TRANSPARENT`.** Despite the intuitive appeal ("make the window see-through"), it routes all mouse messages to the window beneath — the HTML button never gets hover events and the overlay HWND receives no `WM_NCMOUSEMOVE` either. Hit-testing breaks entirely.
- **Do NOT use `WS_EX_NOACTIVATE`.** DWM's snap assist (`WM_GETMINMAXINFO`-based placement) requires the parent window to be activatable. `WS_EX_NOACTIVATE` on the child does not block parent activation but on the parent-level it breaks the snap workflow.
- **Do NOT try to simulate `HTMAXBUTTON` by faking `WM_NCHITTEST` in JavaScript.** Electron doesn't expose a general `WM_NCHITTEST` override. The few things it does support (drag regions) go through a completely different code path and don't reach DWM's snap logic.
- **Do NOT poll `getBoundingClientRect()` in `requestAnimationFrame` every frame.** This creates unnecessary IPC pressure. Only re-measure when actual triggers occur (resize, maximize change, DPI change, main-process push).
- **Do NOT set the overlay window's background to anything other than `NULL_BRUSH`.** Any brush, even white, will paint over the HTML button and make the overlay visually opaque.
- **Do NOT skip the `WM_NCMOUSELEAVE` forward to `hParent`.** Without it, the DWM flyout remains visible after the mouse leaves the button area.

---

## Connections

- [`learnings/backend/office-to-pdf-com-cloudflare-pipeline.md`](../backend/office-to-pdf-com-cloudflare-pipeline.md) — another example of bridging a native OS API from a web-stack app
- Reusable package: [`Electron-Win11-Snap-Overlay`](../../../../Electron-Win11-Snap-Overlay/README.md) — extracted, standalone implementation of this pattern

---

## Portfolio Notes

This is a strong portfolio entry because it required working at three layers simultaneously: Win32 message handling in C++, Electron IPC architecture, and React state management — all to implement a feature that looks like a small UI detail but required deep OS knowledge to ship correctly.

The approach of using a transparent child HWND as an event-relay proxy (rather than trying to intercept messages in the JS layer or modify Electron internals) is the correct, documented-path solution and demonstrates understanding of how Chromium and Win32 interact inside Electron.

Good framing for an interview: *"I needed to trigger a DWM-level OS flyout from an HTML button. The OS only speaks Win32 messages. So I wrote a C++ NAPI addon that creates a thin transparent Win32 child window exactly over the HTML button, which transparently relays the right hit-test and mouse messages to DWM while forwarding hover/click events back to React via Electron IPC."*

