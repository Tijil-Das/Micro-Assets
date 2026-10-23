---
title: "Converting .docx / .pptx to PDF via Silent COM Automation with a Cloudflare Worker Cloud Fallback"
date: 2026-07-25
category: backend
tags: [electron, powershell, COM, office, PDF, cloudflare-workers, fallback-pattern, adm-zip]
project: Orbit
project-context: "Orbit needs to render uploaded Word and PowerPoint files as PDFs inside the app viewer without ever showing an Office window to the user."
discovered-while: "Building the document viewer module — needed a reliable way to convert Office files to PDFs on any user machine, including ones without MS Office installed."
triggered-by: research
difficulty: advanced
time-to-resolve: "~1 day"
status: complete
portfolio-worthy: yes
source-files: ["electron/officeConverter.cjs", "electron/env.cjs"]
commit: ""
---

## The Problem

Orbit's document viewer needs to display `.docx` and `.pptx` files as PDFs. Standard approaches — calling `LibreOffice`, shelling out to `unoconv`, or using a Node library like `mammoth` — either require extra software installs, produce poor fidelity, or can't handle PowerPoint at all. The requirement was: use the user's *own* Microsoft Office installation when available, and silently fall back to cloud conversion when it's not — all without ever flashing a window or dialog at the user.

---

## The Context

- **Electron (Node.js main process)** — can spawn child processes and make HTTP requests.  
- **COM Automation** — Windows Component Object Model allows code to programmatically drive GUI applications (Word, Excel, PowerPoint) through their registered COM interfaces. PowerShell has native first-class support for COM via `New-Object -ComObject`.  
- **PowerShell `-EncodedCommand`** — accepts a Base64-encoded UTF-16LE script so you can pass arbitrarily complex scripts as a single command-line argument without quoting hell.  
- **adm-zip** — a pure-JS ZIP reader. `.docx` / `.pptx` files are just ZIP archives; you can inspect their internal structure without opening Office.  
- **Cloudflare Workers** — edge serverless functions that can receive binary `POST` bodies and return binary responses, suitable as a zero-cold-start PDF conversion endpoint.

---

## The Solution

A two-layer pipeline, tried in order:

### Layer 1 — Local COM (primary)

1. **Pre-flight**: Confirm the file exists and has the right extension. If not, fail fast with a typed error code — no fallback attempted.
2. **Image detection** (`.docx` only): Inspect the ZIP structure with `adm-zip` to check if `word/media/` contains any files. This determines the export quality flag (`OptimizeFor`) passed to Word — no Office process is needed for this step.
3. **Build a PowerShell script** (in-memory string) that:
   - Checks the COM registry for `Word.Application` / `PowerPoint.Application`.
   - Creates the COM object.
   - Verifies the app is licensed (checks `Application.Path` — empty if in reduced-functionality mode).
   - Opens the file **invisibly** (no window, no taskbar icon).
   - Calls `ExportAsFixedFormat` to produce the PDF.
   - Quits and releases COM objects properly.
   - Emits a `ORBIT_RESULT:{...}` JSON line to stdout so the Node process can parse the structured result.
4. **Encode the script** as UTF-16LE Base64 and pass it via `powershell.exe -EncodedCommand` — avoids all shell-escaping issues.
5. **Spawn** the PowerShell process with `windowsHide: true` and a `timeoutMs` deadline. Kill with `SIGKILL` if it exceeds the deadline.
6. **Parse** the `ORBIT_RESULT:` line from stdout and return the result.

### Layer 2 — Cloud fallback (automatic)

If Layer 1 fails for *any* reason (Office not installed, not licensed, COM error, timeout):

1. Read the `CLOUDFLARE_WORKER_URL` from `public/Credentials.env` via `env.cjs`.
2. Read the input file into a buffer.
3. `POST` the raw buffer to `<WORKER_URL>?filename=<basename>[&pptx=true]` with `Content-Type: application/octet-stream`.
4. The worker converts and returns a raw PDF buffer.
5. Write the buffer to the resolved output path and return `{ success: true, via: 'cloud' }`.

### Final error

Only surfaced if **both** layers fail. The error message format is:
```
Microsoft Office is not installed locally, and the Cloud Fallback server also failed to process the document: <cloud error>
```

---

## The Code

### Node.js — `officeConverter.cjs` (key excerpts)

```js
// ── Encode + run a PowerShell script completely hidden ──────────────────────
function runPowerShell(script, timeoutMs) {
    return new Promise((resolve) => {
        const encoded = Buffer.from(script, 'utf16le').toString('base64');

        const ps = spawn('powershell.exe', [
            '-NonInteractive',
            '-NoProfile',
            '-WindowStyle', 'Hidden',
            '-EncodedCommand', encoded
        ], {
            windowsHide: true,          // OS-level window suppression
            stdio: ['ignore', 'pipe', 'pipe']
        });

        let stdout = '', stderr = '';
        ps.stdout.on('data', d => { stdout += d.toString(); });
        ps.stderr.on('data', d => { stderr += d.toString(); });

        let killed = false;
        const timer = setTimeout(() => {
            killed = true;
            try { ps.kill('SIGKILL'); } catch (_) {}
        }, timeoutMs);

        ps.on('close', (code) => {
            clearTimeout(timer);
            resolve({ exitCode: killed ? -9 : (code ?? -1), stdout: stdout.trim(), stderr: stderr.trim(), timedOut: killed });
        });
    });
}

// ── Detect images in a .docx without launching Word ────────────────────────
function docxHasImages(inputPath) {
    try {
        const zip = new AdmZip(inputPath);
        return zip.getEntries().some(e =>
            !e.isDirectory && e.entryName.startsWith('word/media/')
        );
    } catch (_) {
        return true; // assume images exist → use standard quality
    }
}

// ── Parse the structured result line from the PowerShell script ─────────────
function parseScriptResult(stdout) {
    const line = stdout.split('\n').find(l => l.startsWith('ORBIT_RESULT:'));
    if (!line) return null;
    try { return JSON.parse(line.replace('ORBIT_RESULT:', '').trim()); }
    catch (_) { return null; }
}
```

### PowerShell — Word conversion (inside `buildWordScript()`)

```powershell
$ErrorActionPreference = 'Stop'

function Emit-Result($obj) {
    Write-Host ("ORBIT_RESULT:" + ($obj | ConvertTo-Json -Compress))
}

# 1. Check COM registry
$type = [System.Type]::GetTypeFromProgID('Word.Application')
if ($type -eq $null) {
    Emit-Result @{ success=$false; errorCode='WORD_NOT_FOUND'; error='Word.Application COM class is not registered.' }
    exit 1
}

# 2. Launch hidden
$word = New-Object -ComObject Word.Application
$word.Visible       = $false
$word.DisplayAlerts = 0   # wdAlertsNone

# 3. Check license (Application.Path is empty in reduced-functionality mode)
if ([string]::IsNullOrWhiteSpace($word.Path)) {
    $word.Quit()
    Emit-Result @{ success=$false; errorCode='WORD_NOT_LICENSED'; error='Word is in reduced-functionality mode.' }
    exit 1
}

# 4. Open invisibly
$doc = $word.Documents.Open("C:\\path\\to\\file.docx", $false, $true, $false, '', '', $true, '', '', [System.Reflection.Missing]::Value, '', $false, $false, [System.Reflection.Missing]::Value, $false, [System.Reflection.Missing]::Value)

# 5. Export  (17 = wdExportFormatPDF, 0 = OnScreen/min-size, 1 = Print/standard)
$doc.ExportAsFixedFormat("C:\\path\\to\\output.pdf", 17, $false, 0)

# 6. Cleanup
$doc.Close($false)
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
[System.GC]::Collect()

Emit-Result @{ success=$true; outputPath="C:\\path\\to\\output.pdf" }
exit 0
```

### PowerShell — PowerPoint (inside `buildPptScript()`)

```powershell
# Open with WithWindow=$false
$pres = $ppt.Presentations.Open(
    "C:\\path\\to\\file.pptx",
    [Microsoft.Office.Core.MsoTriState]::msoTrue,   # ReadOnly
    [Microsoft.Office.Core.MsoTriState]::msoFalse,  # Untitled
    [Microsoft.Office.Core.MsoTriState]::msoFalse   # WithWindow = FALSE (hidden)
)

# Export  (2 = ppFixedFormatTypePDF, 1 = ppFixedFormatIntentScreen = minimum size)
$pres.ExportAsFixedFormat("C:\\path\\to\\output.pdf", 2, 1)
```

### Cloud fallback — HTTP POST (raw binary, no form-data)

```js
async function cloudFallbackConversion(inputPath, resolvedOutput, isPptx) {
    const workerUrl = getEnv()['CLOUDFLARE_WORKER_URL'];
    const fileBuffer = fs.readFileSync(inputPath);

    const targetUrl = new URL(workerUrl);
    targetUrl.searchParams.set('filename', path.basename(inputPath));
    if (isPptx) targetUrl.searchParams.set('pptx', 'true');

    const pdfBuffer = await new Promise((resolve, reject) => {
        const req = https.request({
            hostname: targetUrl.hostname,
            path:     targetUrl.pathname + targetUrl.search,
            method:   'POST',
            headers: {
                'Content-Type':   'application/octet-stream',
                'Content-Length': fileBuffer.length
            },
            timeout: 180_000
        }, (res) => {
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => {
                const body = Buffer.concat(chunks);
                res.statusCode >= 200 && res.statusCode < 300
                    ? resolve(body)
                    : reject(new Error(`HTTP ${res.statusCode}: ${body.toString('utf8').slice(0, 300)}`));
            });
        });
        req.write(fileBuffer);
        req.end();
    });

    fs.writeFileSync(resolvedOutput, pdfBuffer);
    return { success: true, outputPath: resolvedOutput, via: 'cloud' };
}
```

### IPC registration (Electron main process)

```js
function registerOfficeConverterIpc(ipcMain) {
    ipcMain.handle('office:docx-to-pdf', async (_event, { inputPath, outputPath, timeoutMs }) =>
        convertDocxToPdf(inputPath, outputPath, timeoutMs)
    );
    ipcMain.handle('office:pptx-to-pdf', async (_event, { inputPath, outputPath, timeoutMs }) =>
        convertPptxToPdf(inputPath, outputPath, timeoutMs)
    );
}
```

---

## Key Takeaways

- **COM Automation via PowerShell is the highest-fidelity way to convert Office documents on Windows** — it uses the exact same rendering engine as "Print to PDF" inside Office itself. No third-party library can match it.
- **`-EncodedCommand` solves all quoting problems** — encode your PowerShell script as UTF-16LE → Base64 and pass it as a single argument; Windows file paths with spaces and backslashes stop being a problem.
- **`windowsHide: true` alone isn't enough** — you also need `$app.Visible = $false`, `$app.DisplayAlerts = 0`, and hidden window flags on `Open()`/`Presentations.Open()`. Belt-and-suspenders is correct here.
- **Check `Application.Path` to detect unlicensed/deactivated Office** — when Office is in reduced-functionality mode, `Word.Application` still creates successfully but `Application.Path` returns an empty string. This is the only reliable activation check without triggering a visible dialog.
- **adm-zip lets you inspect `.docx` ZIP internals without spawning Word** — use it for cheap pre-conversion decisions (e.g., quality mode selection) that would otherwise require a full COM round-trip.
- **Emit structured JSON on a sentinel line (`ORBIT_RESULT:`)** — parsing stdout line-by-line for a prefixed JSON blob is far more robust than relying on exit codes alone, especially since PowerShell can swallow non-zero exit codes in some situations.

---

## What NOT to Do

- **Don't use `$word.Visible = $false` without also hiding the document window** — for Word you must pass `Visible=$false` to `Documents.Open()` separately; the application-level flag doesn't cascade to document windows.
- **Don't rely solely on `exit 1` for error detection** — PowerShell error handling is complex and `$ErrorActionPreference = 'Stop'` can still produce output before the exit. Always emit a structured result line and parse that.
- **Don't forget to release COM objects** — failing to call `[System.Runtime.InteropServices.Marshal]::ReleaseComObject()` and `[System.GC]::Collect()` can leave `WINWORD.EXE` / `POWERPNT.EXE` zombie processes. Do it in every code path, including error paths.
- **Don't use `multipart/form-data` for the cloud endpoint** — the Cloudflare Worker receives a raw binary POST body. Wrapping it in form-data requires the worker to parse it; raw `application/octet-stream` is simpler and faster on both ends.
- **Don't attempt cloud fallback for pre-flight errors** — if the file doesn't exist or has the wrong extension, there's nothing to upload. Fail fast before hitting the network.

---

## Connections

- [`electron/env.cjs`](../../Orbit/electron/env.cjs) — loads `CLOUDFLARE_WORKER_URL` from `public/Credentials.env` with simple `KEY=VALUE` parsing and module-level caching.
- [`electron/officeConverter.cjs`](../../Orbit/electron/officeConverter.cjs) — full source of the module.
- Related concept to document separately: the Cloudflare Worker itself (receives raw binary, runs LibreOffice/unoconv serverside, returns PDF buffer).

---

## Portfolio Notes

This is a strong system design story: **graceful degradation with silent fallback**. The interesting decision is the layering order — local-first is better UX (faster, offline-capable, higher fidelity) and the cloud is a silent safety net rather than the primary path. The COM silence stack (five separate suppression mechanisms working together) is an unusual depth of knowledge that demonstrates real Windows platform expertise. The `adm-zip`-based image detection as a cheap pre-conversion optimisation hint is a nice example of avoiding unnecessary work.

The IPC channel design (`office:docx-to-pdf`, `office:pptx-to-pdf`) is clean: fire-and-forget from the renderer, structured result object back — fits naturally into Electron's `ipcMain.handle` / `ipcRenderer.invoke` pattern.
