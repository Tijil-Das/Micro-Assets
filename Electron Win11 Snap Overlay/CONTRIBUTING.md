# Contributing

Thanks for your interest in contributing!

---

## Development Setup

```bash
# 1. Clone the repo
git clone https://github.com/Tijil-Das/Electron-Win11-Snap-Overlay.git
cd Electron-Win11-Snap-Overlay

# 2. Install dependencies
npm install

# 3. Build the native C++ addon (requires Visual Studio Build Tools on Windows)
npm run build:native

# 4. Compile TypeScript
npm run build
```

**Build Tools requirement:** The native addon requires the "Desktop development with C++" workload from [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022). MSVC with C++17 support is needed.

---

## Running the Example

```bash
cd example
npm install   # links the local package
npm start     # launches Electron
```

The example uses vanilla JS — no bundler, no React — so it starts immediately.

---

## Project Structure

```
src/
├── native/
│   ├── snap_overlay.cpp   Win32 + NAPI addon (Windows only)
│   └── dummy.cpp          Non-Windows stub
├── types.ts               Shared TypeScript types (SnapBounds, SnapButtonState, etc.)
├── addonLoader.ts         Loads snap_overlay.node via node-gyp-build
├── geometry.ts            isWindows11OrNewer, validateSnapBounds, cssToPhysicalRect
├── SnapController.ts      Main-process controller + IPC handlers
├── useSnapOverlay.ts      React hook (renderer)
├── index.ts               Main process entry point
└── renderer.ts            Renderer entry point
binding.gyp                node-gyp build definition (references src/native/*.cpp)
```

---

## Making Changes

### TypeScript

- Run `npm run build` after changes
- Strict TypeScript (`"strict": true`) — all types must be explicit
- No `any`, no `@ts-ignore` unless genuinely unavoidable (add a comment explaining why)

### C++ (native addon)

- Standard: C++17
- All public NAPI functions must handle exceptions via try/catch and return a sensible value on failure
- Keep the `OverlayWndProc` message handling minimal — only handle messages listed in the switch, pass everything else to `DefWindowProcW`
- Any new Win32 API calls should be commented with why they are needed

---

## Pull Request Guidelines

1. **One concern per PR** — separate bugfixes from features
2. **Update `CHANGELOG.md`** under a new `[Unreleased]` section
3. **Update the README** if you change any public API
4. **Test on Windows 11** — this is the primary platform. If you don't have access, note it in the PR and CI will cover basic checks
5. **Keep commit messages clear** — `fix: overlay Z-order lost after minimize` is good; `stuff` is not

---

## Reporting Issues

Please include:
- Windows version (`winver` output, e.g. "Windows 11 build 26100")
- Electron version
- Node.js version
- The full error message / console output
- Whether you're using a prebuilt binary or built from source

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

