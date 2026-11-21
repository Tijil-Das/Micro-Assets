import path from 'node:path'

export interface SnapOverlayAddon {
  /**
   * Creates a transparent Win32 child window over the HTML maximize button.
   * @param hwndBuffer - Buffer from BrowserWindow.getNativeWindowHandle()
   * @param x          - Physical client-area x coordinate (pixels)
   * @param y          - Physical client-area y coordinate (pixels)
   * @param width      - Physical width in pixels
   * @param height     - Physical height in pixels
   * @param callback   - Receives 'enter' | 'leave' | 'cancel' | 'down' | 'click'
   * @returns BigInt HWND of the created child window
   */
  attach(
    hwndBuffer: Buffer,
    x: number,
    y: number,
    width: number,
    height: number,
    callback: (event: string) => void
  ): bigint

  /** Repositions the overlay. Call after every resize / maximize / move. */
  updateRect(childHwnd: bigint, x: number, y: number, width: number, height: number): boolean

  /** Shows or hides the overlay window. Hide during fullscreen and minimize. */
  setVisible(childHwnd: bigint, visible: boolean): boolean

  /** Re-asserts the overlay on top of Chromium's render widget in Z-order. */
  bringToTop(childHwnd: bigint): boolean

  /** Debug: sends WM_NCHITTEST at screen coordinates, returns the hit-test value. */
  debugHitTest(childHwnd: bigint, screenX: number, screenY: number): number

  /** Destroys the overlay child window and releases all resources. */
  detach(childHwnd: bigint): boolean
}

let cachedAddon: SnapOverlayAddon | null = null
let hasAttemptedLoad = false

/**
 * Loads the native snap_overlay addon using node-gyp-build.
 *
 * node-gyp-build searches (in order):
 *   1. prebuilds/{platform}-{arch}/*.node  — bundled prebuilt (ships with npm package)
 *   2. build/Release/*.node                — local node-gyp build (for contributors)
 *
 * Returns null on non-Windows or if the addon cannot be loaded.
 */
export function loadSnapAddon(): SnapOverlayAddon | null {
  if (hasAttemptedLoad) return cachedAddon
  hasAttemptedLoad = true

  if (process.platform !== 'win32') return null

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ngb = require('node-gyp-build') as (dir: string) => SnapOverlayAddon
    const addon = ngb(path.join(__dirname, '..'))
    if (typeof addon?.attach === 'function') {
      console.log('[electron-win11-snap-overlay] Native addon loaded successfully.')
      cachedAddon = addon
      return cachedAddon
    }
    console.warn('[electron-win11-snap-overlay] Addon loaded but attach() is missing.')
  } catch (err) {
    console.warn('[electron-win11-snap-overlay] Could not load native addon:', err)
    console.warn('[electron-win11-snap-overlay] Snap Layout flyout will be disabled.')
    console.warn('[electron-win11-snap-overlay] To build from source: node-gyp rebuild')
  }

  return null
}

