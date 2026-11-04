/* ===================================================================
   OBSTACLE AVOIDANCE CAR — INTERACTION, HLS STREAMING, FEEDBACK & ASSETS
   Design: Supabase / Linear / Vercel developer-grade restraint
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroImage();
  initDemoVideo();
  initGallery();
  initThinkAboutThem();
  initAssetTable();
  initFeedbacks();
  initNavigation();
  checkUrlRouting();
});

/* -------------------------------------------------------------------
   1. HERO CAR IMAGE FALLBACK
   ------------------------------------------------------------------- */
function initHeroImage() {
  const carImg = document.getElementById('car-hero-img');
  const placeholder = document.getElementById('car-hero-placeholder');

  if (!carImg) return;

  carImg.addEventListener('load', () => {
    if (carImg.naturalWidth === 0 || carImg.naturalHeight === 0) {
      showCarPlaceholder();
    } else {
      carImg.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
    }
  });

  carImg.addEventListener('error', () => {
    showCarPlaceholder();
  });

  function showCarPlaceholder() {
    carImg.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
  }
}

/* -------------------------------------------------------------------
   2. DEMO VIDEO & HLS STREAMING (.mp4 folder)
   ------------------------------------------------------------------- */
function initDemoVideo() {
  const video = document.getElementById('demo-video');
  const fallbackOverlay = document.getElementById('video-fallback-overlay');
  const hlsSource = './.mp4/index.m3u8';
  const mp4Direct = './.mp4/demo.mp4';

  if (!video) return;

  let streamLoaded = false;

  if (window.Hls && window.Hls.isSupported()) {
    const hls = new window.Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(hlsSource);
    hls.attachMedia(video);

    hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
      streamLoaded = true;
      if (fallbackOverlay) fallbackOverlay.style.display = 'none';
    });

    hls.on(window.Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        tryDirectMp4Fallback();
      }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = hlsSource;
    video.addEventListener('loadedmetadata', () => {
      streamLoaded = true;
      if (fallbackOverlay) fallbackOverlay.style.display = 'none';
    });
    video.addEventListener('error', () => {
      tryDirectMp4Fallback();
    });
  } else {
    tryDirectMp4Fallback();
  }

  function tryDirectMp4Fallback() {
    video.src = mp4Direct;
    video.load();
    video.addEventListener('canplay', () => {
      streamLoaded = true;
      if (fallbackOverlay) fallbackOverlay.style.display = 'none';
    });
    video.addEventListener('error', () => {
      if (!streamLoaded && fallbackOverlay) {
        fallbackOverlay.style.display = 'flex';
      }
    });
  }
}

/* -------------------------------------------------------------------
   3. PHOTO GALLERY LIGHTBOX & FALLBACK
   ------------------------------------------------------------------- */
const galleryCaptions = [
  "Chassis base and drive motors",
  "Motor driver wiring",
  "Arduino Uno R3 board mounting",
  "Servo angular mount",
  "Ultrasonic sensor array",
  "Motor driver control signal wiring",
  "Ultrasonic trigger and echo wiring",
  "Servo pulse signal wiring",
  "Isolated motor power rail",
  "Common ground bus plane",
  "Firmware flashing and test sketch",
  "Sonar pulse ranging calibration",
  "Radar sweep bounds calibration",
  "Threshold logic validation",
  "Reverse and pivot avoidance sequence",
  "Obstacle barrier trial run",
  "Exhibition handout documentation",
  "Finished car demonstration"
];

function initGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  for (let i = 1; i <= 18; i++) {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Photo ${i}: ${galleryCaptions[i-1]}`);

    card.innerHTML = `
      <div class="gallery-media">
        <img class="gallery-img" id="gal-img-${i}" src="./Photo_Gallery/${i}.png" alt="Photo ${i}: ${galleryCaptions[i-1]}" loading="lazy">
        <div class="neutral-placeholder" id="gal-ph-${i}" style="display: none;">
          <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span class="placeholder-subtext">Photo ${i}</span>
        </div>
      </div>
      <div class="gallery-footer">
        <span class="gallery-caption">${galleryCaptions[i-1]}</span>
        <span class="gallery-idx">${i < 10 ? '0' + i : i}</span>
      </div>
    `;

    const img = card.querySelector(`#gal-img-${i}`);
    const ph = card.querySelector(`#gal-ph-${i}`);

    img.addEventListener('error', () => {
      img.style.display = 'none';
      ph.style.display = 'flex';
    });
    img.addEventListener('load', () => {
      if (img.naturalWidth === 0) {
        img.style.display = 'none';
        ph.style.display = 'flex';
      }
    });

    card.addEventListener('click', () => openGalleryLightbox(i));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGalleryLightbox(i);
      }
    });

    galleryGrid.appendChild(card);
  }
}

let currentLightboxIndex = 1;

function openGalleryLightbox(index) {
  currentLightboxIndex = index;
  const modal = document.getElementById('lightbox-modal');
  const title = document.getElementById('lightbox-title');
  const body = document.getElementById('lightbox-body');

  if (!modal || !body) return;

  const caption = galleryCaptions[index - 1];
  title.textContent = `Photo ${index}: ${caption}`;

  body.innerHTML = `
    <div style="text-align: center; max-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <img id="lb-active-img" src="./Photo_Gallery/${index}.png" alt="${caption}" style="max-height: 55vh; max-width: 100%; object-fit: contain; border-radius: 6px; border: 1px solid var(--border);">
      <div id="lb-fallback" style="display: none; padding: 48px; background: var(--bg-subtle); border-radius: 8px; border: 1px solid var(--border-strong); width: 100%;">
        <p style="font-size: 15px; color: var(--fg); font-weight: 500; margin-bottom: 4px;">Photo slot ${index}</p>
        <p style="font-size: 14px; color: var(--fg-2);">${caption}</p>
        <p style="font-size: 13px; color: var(--muted); margin-top: 12px; font-family: var(--font-mono);">Photo_Gallery/${index}.png</p>
      </div>
      <p style="margin-top: 16px; font-size: 14px; color: var(--fg-2);">${caption}</p>
    </div>
  `;

  const activeImg = document.getElementById('lb-active-img');
  const lbFallback = document.getElementById('lb-fallback');
  activeImg.addEventListener('error', () => {
    activeImg.style.display = 'none';
    lbFallback.style.display = 'block';
  });
  activeImg.addEventListener('load', () => {
    if (activeImg.naturalWidth === 0) {
      activeImg.style.display = 'none';
      lbFallback.style.display = 'block';
    }
  });

  modal.classList.add('open');
}

function prevLightbox() {
  currentLightboxIndex = currentLightboxIndex > 1 ? currentLightboxIndex - 1 : 18;
  openGalleryLightbox(currentLightboxIndex);
}

function nextLightbox() {
  currentLightboxIndex = currentLightboxIndex < 18 ? currentLightboxIndex + 1 : 1;
  openGalleryLightbox(currentLightboxIndex);
}

/* -------------------------------------------------------------------
   4. "THINK ABOUT THEM" QUESTIONS — Red Questions & Green Answers
   ------------------------------------------------------------------- */
const thinkQuestions = [
  {
    num: 1,
    q: "On a hot day, will the car misjudge a 50 cm obstacle as nearer or farther?",
    a: "Nearer. Sound travels faster in hot air, so the echo returns sooner. The code assumes a fixed speed of sound, so it calculates a shorter distance. The error is small (a cm or two), but it is always in the “too close” direction."
  },
  {
    num: 2,
    q: "The car reverses with no rear sensor. What could go wrong?",
    a: "The sensor faces forward, so the car backs up blind. It can hit a wall, a person’s foot or another robot behind it. The fix is a rear sensor, or only reversing for a short, safe distance."
  },
  {
    num: 3,
    q: "Why is “turn for 500 ms” an unreliable way to turn a fixed angle?",
    a: "Time isn’t angle. As the battery drains, the motors slow down and the car turns less. Floor grip, wheel slip and uneven motors also change the result. Encoders on the wheels or a gyroscope measure the actual turn instead of guessing it."
  },
  {
    num: 4,
    q: "What happens if you add two more sensors and fire them together?",
    a: "They interfere, because each sensor hears the others’ pings and echoes. This is the same “phantom obstacle” problem as Quiz Q2. The fix is to fire them one at a time, with a short pause between, so each one only listens for its own echo."
  },
  {
    num: 5,
    q: "Why does the code check distance > 0 as well as < 10?",
    a: "When no echo comes back (nothing in range, or the echo is lost), the timing function typically returns 0, which turns into a distance of 0 cm. Without > 0, the car would treat that as an obstacle right in front of it and stop for nothing."
  },
  {
    num: 6,
    q: "Why might the car miss an obstacle only 1 cm away?",
    a: "The HC-SR04 has a blind zone: it can’t measure very short distances (its minimum is around 2 cm). The echo returns while the sensor is still finishing its own ping, so it can’t tell them apart. Objects that close are effectively invisible to it."
  }
];

function initThinkAboutThem() {
  const container = document.getElementById('think-list');
  if (!container) return;

  container.innerHTML = thinkQuestions.map(item => `
    <article class="think-item" id="q${item.num}">
      <div class="think-meta">
        <span class="think-num-badge">${item.num}</span>
        <span class="think-tag">Question ${item.num}</span>
      </div>
      <h3 class="think-q">${item.q}</h3>
      <div class="think-a">
        <p>${item.a}</p>
      </div>
    </article>
  `).join('');
}

/* -------------------------------------------------------------------
   5. ASSETS TABLE & IN-PAGE MODAL VIEWER
   - Clicking ANYWHERE on an asset row shows it
   - Clicking the Download button only downloads and stops propagation
   - Just the tag "Internal docs", no lock icon
   ------------------------------------------------------------------- */
const assetRegistry = [
  {
    id: "wiring",
    file: "Assets/.wiring.png",
    downloadName: "Wiring.png",
    displayName: "Circuit diagram",
    type: "PNG image",
    isInternal: false
  },
  {
    id: "code",
    file: "Assets/.code.ino",
    downloadName: "Code.ino",
    displayName: "Arduino sketch code",
    type: "C++ sketch",
    isInternal: false
  },
  {
    id: "flowchart",
    file: "Assets/flowchart.html",
    downloadName: "Flowchart.html",
    displayName: "Navigation flowchart",
    type: "HTML diagram",
    isInternal: false
  },
  {
    id: "partlist",
    file: "Assets/Partlist.txt",
    downloadName: "Partlist.txt",
    displayName: "Hardware bill of materials",
    type: "Text document",
    isInternal: false
  },
  {
    id: "fullproject",
    file: "Assets/Full Project.md",
    downloadName: "Full Project.md",
    displayName: "Complete project guide",
    type: "Markdown document",
    isInternal: false
  },
  {
    id: "presentation",
    file: "Assets/Presentation.pdf",
    downloadName: "Presentation.pdf",
    displayName: "Exhibition presentation",
    type: "PDF document",
    isInternal: true
  },
  {
    id: "handout",
    file: "Assets/Takeaway Handlet.pdf",
    downloadName: "Takeaway Handlet.pdf",
    displayName: "Visitor takeaway handout",
    type: "PDF document",
    isInternal: true
  }
];

function initAssetTable() {
  const tbody = document.getElementById('assets-tbody');
  if (!tbody) return;

  tbody.innerHTML = assetRegistry.map(asset => `
    <tr class="asset-row" onclick="viewAsset('${asset.id}')" tabindex="0" role="button" aria-label="View ${asset.displayName}">
      <td>
        <div class="asset-title-cell">
          <span class="asset-primary-name">${asset.displayName}</span>
          ${asset.isInternal ? `<span class="asset-badge-internal">Internal docs</span>` : ''}
        </div>
      </td>
      <td style="font-family: var(--font-mono); font-size: 13px; color: var(--muted);">${asset.downloadName}</td>
      <td style="color: var(--muted); font-size: 13px;">${asset.type}</td>
      <td class="asset-actions-cell">
        <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); triggerDownload('${asset.file}', '${asset.downloadName}')">
          Download
        </button>
      </td>
    </tr>
  `).join('');
}

function resolveAssetPath(filePath) {
  if (window.location.pathname.includes('/assets') && !filePath.startsWith('../') && !filePath.startsWith('/')) {
    return '../' + filePath;
  }
  return filePath;
}

function triggerDownload(filePath, targetName) {
  const link = document.createElement('a');
  link.href = resolveAssetPath(filePath);
  link.download = targetName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function viewAsset(assetId) {
  const rawAsset = assetRegistry.find(a => a.id === assetId);
  if (!rawAsset) return;

  const asset = { ...rawAsset, file: resolveAssetPath(rawAsset.file) };

  const modal = document.getElementById('asset-modal');
  const title = document.getElementById('modal-asset-title');
  const body = document.getElementById('modal-asset-body');
  const downloadBtn = document.getElementById('modal-download-btn');

  if (!modal || !body) return;

  title.textContent = `${asset.displayName} (${asset.downloadName})`;
  downloadBtn.onclick = () => triggerDownload(asset.file, asset.downloadName);

  body.innerHTML = `<div style="text-align: center; padding: 48px; color: var(--muted);">Loading content...</div>`;
  modal.classList.add('open');

  if (asset.id === 'wiring') {
    renderImageAsset(asset, body);
  } else if (asset.id === 'flowchart') {
    renderHtmlAsset(asset, body);
  } else if (asset.id === 'code') {
    renderCodeAsset(asset, body);
  } else if (asset.id === 'partlist') {
    renderTextAsset(asset, body);
  } else if (asset.id === 'fullproject') {
    renderMarkdownAsset(asset, body);
  } else if (asset.id === 'presentation') {
    renderPresentationAsset(asset, body);
  } else if (asset.id === 'handout') {
    renderHandoutAsset(asset, body);
  }
}

function renderHtmlAsset(asset, container) {
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 12px; height: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
        <span style="font-size: 13px; color: var(--muted); font-family: var(--font-mono);">${asset.downloadName}</span>
        <a href="${asset.file}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 6px;">
          <span>Open in new tab</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </div>
      <div style="width: 100%; height: 74vh; border: 1px solid var(--border-strong); border-radius: var(--radius-md); overflow: auto; background: #0b0f17; -webkit-overflow-scrolling: touch;">
        <iframe src="${asset.file}" title="${asset.displayName}" style="width: 100%; min-width: 920px; height: 1140px; border: none; display: block;" loading="lazy"></iframe>
      </div>
    </div>
  `;
}

function renderImageAsset(asset, container) {
  container.innerHTML = `
    <div style="text-align: center;">
      <img id="modal-img-elem" src="${asset.file}" alt="${asset.displayName}" style="max-width: 100%; max-height: 60vh; border-radius: 6px; border: 1px solid var(--border);">
      <div id="modal-img-fallback" style="display:none; padding: 48px; background: var(--bg-subtle); border: 1px solid var(--border-strong); border-radius: 8px;">
        <p style="font-size: 15px; color: var(--fg); font-weight: 500; margin-bottom: 6px;">Image asset placeholder</p>
        <p style="color: var(--muted); font-size: 14px;">The file <code>${asset.file}</code> is awaiting content. When you add the image file, it will display here.</p>
      </div>
      <p style="margin-top: 14px; font-size: 13px; color: var(--muted); font-family: var(--font-mono);">${asset.downloadName}</p>
    </div>
  `;
  const img = document.getElementById('modal-img-elem');
  const fb = document.getElementById('modal-img-fallback');
  img.addEventListener('error', () => { img.style.display = 'none'; fb.style.display = 'block'; });
  img.addEventListener('load', () => { if (img.naturalWidth === 0) { img.style.display = 'none'; fb.style.display = 'block'; } });
}

/* -------------------------------------------------------------------
   BEAUTIFUL C++ / ARDUINO SYNTAX HIGHLIGHTER WITH LINE NUMBERS
   ------------------------------------------------------------------- */
function formatCppSyntax(code) {
  const lines = code.split('\n');
  return lines.map((line, idx) => {
    const lineNum = idx + 1;
    let commentHtml = '';
    let codePart = line;

    const commentIdx = line.indexOf('//');
    if (commentIdx !== -1) {
      codePart = line.substring(0, commentIdx);
      const commentText = line.substring(commentIdx);
      commentHtml = `<span class="syn-comment">${escapeHtml(commentText)}</span>`;
    }

    let formatted = '';

    const includeMatch = codePart.match(/^(\s*#include)\s*(<[^>]+>|"[^"]+")/);
    if (includeMatch) {
      const dir = includeMatch[1].replace(/#include/, '<span class="syn-preproc">#include</span>');
      formatted = `${dir} <span class="syn-header">${escapeHtml(includeMatch[2])}</span>`;
    } else {
      const defineMatch = codePart.match(/^(\s*#define)\s+([A-Za-z0-9_]+)(.*)$/);
      if (defineMatch) {
        const dir = defineMatch[1].replace(/#define/, '<span class="syn-preproc">#define</span>');
        const varName = `<span class="syn-var">${defineMatch[2]}</span>`;
        let rest = escapeHtml(defineMatch[3]).replace(/\b\d+(\.\d+)?\b/g, '<span class="syn-num">$&</span>');
        formatted = `${dir} ${varName}${rest}`;
      } else {
        formatted = escapeHtml(codePart);
        formatted = formatted.replace(/\b(void|long|int|float|double|bool|if|else|while|for|return|setup|loop)\b/g, '<span class="syn-keyword">$1</span>');
        formatted = formatted.replace(/\b(Servo)\b/g, '<span class="syn-type">$1</span>');
        formatted = formatted.replace(/\b(OUTPUT|INPUT|HIGH|LOW)\b/g, '<span class="syn-const">$1</span>');
        formatted = formatted.replace(/\b(pinMode|digitalWrite|digitalRead|delayMicroseconds|delay|pulseIn|begin|println|print|attach|write)\b/g, '<span class="syn-fn">$1</span>');
        formatted = formatted.replace(/\b(Serial|Myservo)\b/g, '<span class="syn-obj">$1</span>');
        formatted = formatted.replace(/\b\d+(\.\d+)?\b/g, '<span class="syn-num">$&</span>');
      }
    }

    return `<div class="code-line"><span class="code-line-num">${lineNum}</span><span class="code-line-content">${formatted || '&nbsp;'}${commentHtml}</span></div>`;
  }).join('');
}

function renderCodeAsset(asset, container) {
  fetch(asset.file)
    .then(r => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    })
    .then(text => {
      if (!text || text.trim().length === 0) {
        showCodeEmptyState(asset, container);
      } else {
        container.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
            <span style="font-size: 13px; color: var(--muted); font-family: var(--font-mono);">${asset.downloadName}</span>
            <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(text)}'))">Copy code</button>
          </div>
          <div class="code-wrapper">${formatCppSyntax(text)}</div>
        `;
      }
    })
    .catch(() => showCodeEmptyState(asset, container));
}

function showCodeEmptyState(asset, container) {
  const verifiedCode = `#include <Servo.h>

Servo Myservo;

#define trigPin 9       // Trig pin of HC-SR04
#define echoPin 8       // Echo pin of HC-SR04
#define MLa 4           // Left motor 1st pin
#define MLb 5           // Left motor 2nd pin
#define MRa 6           // Right motor 1st pin
#define MRb 7           // Right motor 2nd pin

long duration, distance;

void setup() {
    Serial.begin(9600);

    pinMode(MLa, OUTPUT);
    pinMode(MLb, OUTPUT);
    pinMode(MRa, OUTPUT);
    pinMode(MRb, OUTPUT);

    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);

    Myservo.attach(10);
}

void loop()
{
    Serial.begin(9600);

    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);

    digitalWrite(trigPin, HIGH);   // Transmit waves for 10us
    delayMicroseconds(10);

    duration = pulseIn(echoPin, HIGH);  // Receive reflected waves
    distance = duration / 58.2;         // Calculate distance

    Serial.println(distance);
    delay(10);

    if (distance > 15)   // Absence of obstacle
    {
        Myservo.write(90);

        digitalWrite(MRb, HIGH);   // Move forward
        digitalWrite(MRa, LOW);
        digitalWrite(MLb, HIGH);
        digitalWrite(MLa, LOW);
    }
    else if ((distance < 10) && (distance > 0))
    {
        digitalWrite(MRb, LOW);    // Stop
        digitalWrite(MRa, LOW);
        digitalWrite(MLb, LOW);
        digitalWrite(MLa, LOW);

        delay(100);

        Myservo.write(0);          // Scan right
        delay(500);

        Myservo.write(180);        // Scan left
        delay(500);

        Myservo.write(90);         // Center
        delay(500);

        digitalWrite(MRb, LOW);    // Move backward
        digitalWrite(MRa, HIGH);
        digitalWrite(MLb, LOW);
        digitalWrite(MLa, HIGH);

        delay(500);

        digitalWrite(MRb, LOW);    // Stop
        digitalWrite(MRa, LOW);
        digitalWrite(MLb, LOW);
        digitalWrite(MLa, LOW);

        delay(100);

        digitalWrite(MRb, HIGH);   // Move left
        digitalWrite(MRa, LOW);
        digitalWrite(MLa, LOW);
        digitalWrite(MLb, LOW);

        delay(500);
    }
}`;

  container.innerHTML = `
    <div style="background: var(--bg-subtle); border: 1px solid var(--border-strong); border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <p style="font-size: 14px; color: var(--fg); font-weight: 500; margin-bottom: 4px;">Code placeholder (<code>${asset.file}</code>)</p>
      <p style="color: var(--muted); font-size: 13px;">The file on disk is awaiting your custom code. Below is the verified source sketch from the exhibition archive:</p>
    </div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
      <span style="font-size: 13px; color: var(--muted); font-family: var(--font-mono);">${asset.downloadName}</span>
      <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(verifiedCode)}'))">Copy code</button>
    </div>
    <div class="code-wrapper">${formatCppSyntax(verifiedCode)}</div>
  `;
}

function renderTextAsset(asset, container) {
  fetch(asset.file)
    .then(r => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    })
    .then(text => {
      if (!text || text.trim().length === 0) {
        showTextEmptyState(asset, container);
      } else {
        container.innerHTML = `<div class="code-box" style="white-space: pre-wrap;">${escapeHtml(text)}</div>`;
      }
    })
    .catch(() => showTextEmptyState(asset, container));
}

function showTextEmptyState(asset, container) {
  const defaultList = `Obstacle Avoidance Car — Hardware bill of materials
Class 12 Computer Science Exhibition, St. Aloysius School

1. Arduino Uno R3 microcontroller board (ATmega328P, 16 MHz, 5V)
2. HC-SR04 ultrasonic sensor module (40 kHz, 2 cm to 400 cm range)
3. TowerPro SG90 micro servo motor (180 degree radar pivot)
4. L298N dual H-bridge motor driver module
5. 2 geared DC motors with rubber wheels
6. 2WD acrylic robot chassis kit with front castor wheel
7. Solderless prototyping breadboard
8. 9V DC battery pack with snap connector
9. Jumper wires (male-to-male and male-to-female)`;

  container.innerHTML = `
    <div style="background: var(--bg-subtle); border: 1px solid var(--border-strong); border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <p style="font-size: 14px; color: var(--fg); font-weight: 500; margin-bottom: 4px;">Parts list placeholder (<code>${asset.file}</code>)</p>
      <p style="color: var(--muted); font-size: 13px;">File ready on disk. Here is the hardware specification:</p>
    </div>
    <div class="code-box" style="white-space: pre-wrap;">${escapeHtml(defaultList)}</div>
  `;
}

// Embedded Full Project Markdown (guarantees immediate offline & file:// rendering)
const FULL_PROJECT_MARKDOWN = `# Obstacle Avoidance Robot

Teachers Readiness Programme on Robotics and AI — June 2024
Technology Innovation Hub of IIT Delhi (IHFC) & Council for the Indian School Certificate Examinations (CISCE)

Instructors:
- Dr. Venkat Bokka, IHFC (venkat@ihfc.co.in)
- Ms. Mrinmoyee Choudhuri, IHFC (mrinmoyee@ihfc.co.in)
- Source Code Sketch: Obstacle Avoidance Robot.ino
- Circuit Diagram: Wiring.png

---

## 1. Objective

The objective of this project is to build an obstacle-avoiding robot using an Arduino microcontroller, ultrasonic sensor, and servo motor. This project aims to demonstrate the principles of autonomous navigation by detecting obstacles in the robot's path and adjusting its course accordingly.

---

## 2. Materials Required

| Component | Description |
|---|---|
| Arduino Uno R3 | Microcontroller that processes sensor data and motor logic |
| Ultrasonic Sensor Module (HC-SR04) | Emits 40 kHz acoustic pings to calculate distance |
| Servo Motor (SG90) | Actuator for 180° active angular radar scanning |
| Motor Driver Module (L298N) | Dual H-bridge for bidirectional motor control and current switching |
| DC Motors with Wheels | Geared DC motors for differential drive steering |
| Robot Chassis | 2WD acrylic platform with castor wheel |
| Solderless Breadboard | Fast prototyping and signal distribution |
| Battery Pack | 9V DC battery power supply |
| Jumper Wires | DuPont connectors for circuit wiring |

---

## 3. Procedure

### 3.1 Connecting the Ultrasonic Sensor Module
- VCC Pin: Connect to 5V pin on Arduino.
- GND Pin: Connect to GND pin on Arduino.
- TRIG Pin: Connect to Digital Pin 9 on Arduino (triggers 10 µs pulse).
- ECHO Pin: Connect to Digital Pin 8 on Arduino (measures return flight time).

### 3.2 Connecting the Servo Motor
- Power (VCC): Connects to 5V power supply. (Red)
- Ground (GND): Connects to common ground. (Black/Brown)
- Signal: Connects to PWM pin 10 on Arduino. (Yellow/Orange)

### 3.3 Assemble the Robot Chassis
- Attach DC motors to acrylic base plate.
- Mount wheels to motor drive axles.
- Secure battery pack and L298N motor driver to chassis.

### 3.4 Connect the Motor Driver Module
- Connect IN1 and IN2 to Arduino Pins 7 and 6 (Right Motor MRb, MRa).
- Connect IN3 and IN4 to Arduino Pins 5 and 4 (Left Motor MLb, MLa).
- Connect 9V battery supply to L298N +12V and GND terminals.
- Connect 5V regulated output to Arduino Vin with common ground.

### 3.5 Program the Arduino
- Compile code in Arduino IDE and upload to Uno board.

---

## 4. Pin Connection Summary

| Subsystem | Component Pin | Arduino Uno Pin | Wire Color / Function |
|---|---|---|---|
| Ultrasonic Sensor (HC-SR04) | VCC | 5V | Red |
| Ultrasonic Sensor (HC-SR04) | GND | GND | Black |
| Ultrasonic Sensor (HC-SR04) | TRIG | Digital Pin 9 | Yellow / Green |
| Ultrasonic Sensor (HC-SR04) | ECHO | Digital Pin 8 | Blue / White |
| Servo Motor (SG90) | Power (Vcc) | 5V | Red |
| Servo Motor (SG90) | Ground (Gnd) | GND | Black / Brown |
| Servo Motor (SG90) | Signal | Digital Pin 10 | Yellow / Orange (PWM) |
| L298N Motor Driver | IN1 | Digital Pin 7 | Right Motor Forward (MRb) |
| L298N Motor Driver | IN2 | Digital Pin 6 | Right Motor Reverse (MRa) |
| L298N Motor Driver | IN3 | Digital Pin 5 | Left Motor Forward (MLb) |
| L298N Motor Driver | IN4 | Digital Pin 4 | Left Motor Reverse (MLa) |
| L298N Motor Driver | 5V Out | Vin | Powers Arduino board |
| L298N Motor Driver | GND | GND | Common Ground |
| Battery Pack | Positive (+) | L298N +12V Terminal | Motor driver power |
| Battery Pack | Negative (-) | L298N GND Terminal | Common Ground |

---

## 5. Navigation Algorithm Logic

- Clear Path (Distance > 15 cm): Center servo at 90°, drive both motors forward (MRb=HIGH, MLb=HIGH).
- Obstacle Zone (0 < Distance < 10 cm):
  1. Stop all motors (100 ms).
  2. Active radar scan: sweep servo 0° (right) -> 180° (left) -> 90° (center).
  3. Reverse for 500 ms to create stopping distance.
  4. Stop for 100 ms.
  5. Pivot turn left for 500 ms.
  6. Re-evaluate distance in next cycle.
- Buffer Zone (10 cm to 15 cm): Prevents rapid switching caused by acoustic jitter.

---

## 6. Arduino Code

\`\`\`cpp
#include <Servo.h>

Servo Myservo;

#define trigPin 9       // Trig pin of HC-SR04
#define echoPin 8       // Echo pin of HC-SR04
#define MLa 4           // Left motor 1st pin
#define MLb 5           // Left motor 2nd pin
#define MRa 6           // Right motor 1st pin
#define MRb 7           // Right motor 2nd pin

long duration, distance;

void setup() {
    Serial.begin(9600);

    pinMode(MLa, OUTPUT);
    pinMode(MLb, OUTPUT);
    pinMode(MRa, OUTPUT);
    pinMode(MRb, OUTPUT);

    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);

    Myservo.attach(10);
}

void loop()
{
    Serial.begin(9600);

    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);

    digitalWrite(trigPin, HIGH);   // Transmit waves for 10us
    delayMicroseconds(10);

    duration = pulseIn(echoPin, HIGH);  // Receive reflected waves
    distance = duration / 58.2;         // Calculate distance

    Serial.println(distance);
    delay(10);

    if (distance > 15)   // Absence of obstacle
    {
        Myservo.write(90);

        digitalWrite(MRb, HIGH);   // Move forward
        digitalWrite(MRa, LOW);
        digitalWrite(MLb, HIGH);
        digitalWrite(MLa, LOW);
    }
    else if ((distance < 10) && (distance > 0))
    {
        digitalWrite(MRb, LOW);    // Stop
        digitalWrite(MRa, LOW);
        digitalWrite(MLb, LOW);
        digitalWrite(MLa, LOW);

        delay(100);

        Myservo.write(0);          // Scan right
        delay(500);

        Myservo.write(180);        // Scan left
        delay(500);

        Myservo.write(90);         // Center
        delay(500);

        digitalWrite(MRb, LOW);    // Move backward
        digitalWrite(MRa, HIGH);
        digitalWrite(MLb, LOW);
        digitalWrite(MLa, HIGH);

        delay(500);

        digitalWrite(MRb, LOW);    // Stop
        digitalWrite(MRa, LOW);
        digitalWrite(MLb, LOW);
        digitalWrite(MLa, LOW);

        delay(100);

        digitalWrite(MRb, HIGH);   // Move left
        digitalWrite(MRa, LOW);
        digitalWrite(MLa, LOW);
        digitalWrite(MLb, LOW);

        delay(500);
    }
}
\`\`\`

---

## 7. Conclusion

This project demonstrates the principles of autonomous navigation by detecting obstacles in the robot's path and adjusting its trajectory. Participants acquire practical experience in embedded electronics, acoustic sensors, servo actuation, and H-bridge motor driving.`;

function renderMarkdownAsset(asset, container) {
  fetch(encodeURI(asset.file))
    .then(r => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    })
    .then(text => {
      if (!text || text.trim().length === 0) {
        displayMarkdownHtml(FULL_PROJECT_MARKDOWN, container);
      } else {
        displayMarkdownHtml(text, container);
      }
    })
    .catch(() => {
      displayMarkdownHtml(FULL_PROJECT_MARKDOWN, container);
    });
}

function displayMarkdownHtml(text, container) {
  const rendered = formatMarkdownContent(text);
  container.innerHTML = `
    <div style="background: var(--surface); border: 1px solid var(--border-strong); border-radius: 8px; padding: 24px; max-height: 72vh; overflow-y: auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--border);">
        <h3 style="font-size: 16px; color: var(--fg); font-weight: 600;">Complete project guide (Full Project.md)</h3>
        <span style="font-size: 12px; color: var(--muted); font-family: var(--font-mono);">Markdown Documentation</span>
      </div>
      <div>${rendered}</div>
    </div>
  `;
}

function formatMarkdownContent(markdown) {
  const codeBlocks = [];
  let processed = markdown.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (match, lang, code) => {
    const placeholder = `%%%CODE_BLOCK_${codeBlocks.length}%%%`;
    codeBlocks.push({ lang: (lang || '').toLowerCase(), code: code });
    return placeholder;
  });

  const lines = processed.split('\n');
  const htmlLines = [];
  let inTable = false;
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (!inTable) {
        if (inList) { htmlLines.push('</ul>'); inList = false; }
        inTable = true;
        htmlLines.push('<div style="overflow-x: auto; margin: 16px 0;"><table class="assets-table" style="width: 100%; border: 1px solid var(--border); border-collapse: collapse;">');
      }
      if (/^\|\s*[-:]+[-| :]*\|$/.test(line.trim())) {
        continue;
      }
      const cells = line.trim().slice(1, -1).split('|').map(c => c.trim());
      const isHeader = (i > 0 && lines[i+1] && /^\|\s*[-:]+[-| :]*\|$/.test(lines[i+1].trim()));
      const tag = isHeader ? 'th' : 'td';
      const cellBg = isHeader ? 'background: var(--surface-2);' : '';
      htmlLines.push('<tr>' + cells.map(c => `<${tag} style="padding: 10px 14px; border: 1px solid var(--border); font-size: 13px; text-align: left; ${cellBg}">${formatInlineMd(c)}</${tag}>`).join('') + '</tr>');
      continue;
    } else if (inTable) {
      htmlLines.push('</table></div>');
      inTable = false;
    }

    if (/^\s*[-*]\s+(.*)$/.test(line)) {
      if (!inList) {
        inList = true;
        htmlLines.push('<ul style="margin: 12px 0 16px 24px; line-height: 1.7; color: var(--fg-2); font-size: 14px;">');
      }
      const item = line.replace(/^\s*[-*]\s+/, '');
      htmlLines.push(`<li style="margin-bottom: 6px;">${formatInlineMd(item)}</li>`);
      continue;
    } else if (inList && line.trim() === '') {
      htmlLines.push('</ul>');
      inList = false;
    }

    if (/^#\s+(.*)$/.test(line)) {
      htmlLines.push(`<h2 style="font-size: 20px; font-weight: 700; color: var(--fg); margin: 24px 0 12px 0; border-bottom: 1px solid var(--border); padding-bottom: 8px;">${formatInlineMd(line.slice(2))}</h2>`);
      continue;
    }
    if (/^##\s+(.*)$/.test(line)) {
      htmlLines.push(`<h3 style="font-size: 16px; font-weight: 600; color: var(--fg); margin: 24px 0 10px 0;">${formatInlineMd(line.slice(3))}</h3>`);
      continue;
    }
    if (/^###\s+(.*)$/.test(line)) {
      htmlLines.push(`<h4 style="font-size: 14px; font-weight: 600; color: var(--fg-2); margin: 18px 0 8px 0;">${formatInlineMd(line.slice(4))}</h4>`);
      continue;
    }

    if (/^---$/.test(line.trim())) {
      htmlLines.push('<hr style="border: 0; border-top: 1px solid var(--border); margin: 24px 0;">');
      continue;
    }

    if (line.trim() === '') {
      htmlLines.push('');
      continue;
    }

    htmlLines.push(`<p style="margin-bottom: 12px; line-height: 1.65; color: var(--fg-2); font-size: 14px;">${formatInlineMd(line)}</p>`);
  }

  if (inTable) htmlLines.push('</table></div>');
  if (inList) htmlLines.push('</ul>');

  let result = htmlLines.join('\n');

  result = result.replace(/%%%CODE_BLOCK_(\d+)%%%/g, (match, idx) => {
    const block = codeBlocks[parseInt(idx, 10)];
    if (!block) return '';
    if (block.lang === 'cpp' || block.lang === 'c' || block.lang === 'ino') {
      return `<div class="code-wrapper" style="margin: 16px 0;">${formatCppSyntax(block.code.trim())}</div>`;
    }
    return `<div class="code-box" style="margin: 16px 0; white-space: pre-wrap; font-family: var(--font-mono); font-size: 13px;">${escapeHtml(block.code.trim())}</div>`;
  });

  return result;

  function formatInlineMd(str) {
    let s = escapeHtml(str);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/`([^`]+)`/g, '<code style="background:var(--bg-subtle); padding:2px 6px; border-radius:4px; font-family:var(--font-mono); font-size:12px; border:1px solid var(--border);">$1</code>');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--accent); text-decoration:underline;">$1</a>');
    return s;
  }
}

const pptSlides = [
  { num: 1, title: "Exhibition project showcase", subtitle: "Obstacle Avoidance Car", body: "A car that sees before it moves.<br><br>Credits: <a href=\"https://github.com/Tijil-Das\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"credit-link\">Tijil Das</a>, Shreyam Chaudhury, Shreyas Chatterjee, Shaurya Gupta<br>Class 12 Science, St. Aloysius School" },
  { num: 2, title: "Did you know: nature invented it first", subtitle: "Acoustic echolocation", body: "Bat: echo provides navigation in darkness.<br>Dolphin: high-frequency clicks bounce off objects.<br>Our car: 40 kHz ultrasonic pings reflect off obstacles.<br><br>Three bodies. One physical principle: listen to the echo." },
  { num: 3, title: "How it sees: sonar echo ranging", subtitle: "HC-SR04 acoustics", body: "40 kHz: silent to human ears (human hearing limit is ~20 kHz).<br>~0.6 ms: round-trip echo time from an obstacle 10 cm away.<br>Equation: distance = (duration × speed of sound) / 2 = duration / 58.2 cm." },
  { num: 4, title: "Hardware subsystems", subtitle: "Component list", body: "1. Arduino Uno R3: processes echo timings and controls motors.<br>2. HC-SR04 and SG90 servo: active angular scanning radar at front.<br>3. L298N motor driver: switches motor polarity and current.<br>4. 2 geared DC motors: differential steering drive.<br>5. 9V power supply: dedicated motor rail with common ground." },
  { num: 5, title: "Decision flow", subtitle: "Threshold conditions", body: "Loop cycle begins with a 10 µs pulse on pin 9.<br>If distance > 15 cm: path is clear, servo centers at 90°, motors drive forward.<br>If 0 < distance < 10 cm: obstacle detected, stop, scan right and left, reverse, turn left, and resume." },
  { num: 6, title: "Meeting an obstacle", subtitle: "Maneuver sequence", body: "1. Stop: all motor pins set to LOW (100 ms).<br>2. Scan right: servo rotates to 0° (500 ms).<br>3. Scan left: servo rotates to 180° (500 ms).<br>4. Center: servo realigns to 90° (500 ms).<br>5. Reverse: motors drive backward for 500 ms.<br>6. Turn left: single-motor pivot turn for 500 ms." },
  { num: 7, title: "Narrow sensor cone", subtitle: "Beam geometry", body: "The ultrasonic transducer sees a narrow cone of approximately 15° width.<br><br>The SG90 servo motor sweeps the sensor across 0° to 180° to detect obstacles outside the central cone." },
  { num: 8, title: "Acoustic edge cases", subtitle: "Environmental physics", body: "Soft cloth absorbs ultrasonic pulses.<br>Steep surfaces reflect sound waves away from the receiver.<br>Thin poles reflect minimal acoustic energy.<br>Higher temperature increases the speed of sound, returning echoes earlier." },
  { num: 9, title: "Engineering challenges", subtitle: "Inductive noise isolation", body: "Challenge: the Arduino microcontroller reset whenever motors started moving.<br><br>Cause: motor startup current caused voltage drops on the logic rail.<br><br>Fix: separated motor power supply from the Arduino 5V logic rail, retaining a shared common ground." },
  { num: 10, title: "Specifications by the numbers", subtitle: "Parameters", body: "10 cm: obstacle detection threshold.<br>180°: servo sweep angle.<br>40 kHz: acoustic carrier frequency.<br>2: drive motors." }
];

let currentSlideIdx = 0;

function renderPresentationAsset(asset, container) {
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 12px; height: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
        <span style="font-size: 13px; color: var(--muted); font-family: var(--font-mono);">${asset.downloadName} (Internal docs)</span>
        <a href="${asset.file}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 6px;">
          <span>Open PDF in new tab</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </div>
      <div style="width: 100%; height: 74vh; border: 1px solid var(--border-strong); border-radius: var(--radius-md); overflow: hidden; background: #121212;">
        <iframe src="${asset.file}" title="${asset.displayName}" style="width: 100%; height: 100%; border: none; display: block;"></iframe>
      </div>
    </div>
  `;
}

window.prevSlide = function() {
  if (currentSlideIdx > 0) {
    currentSlideIdx--;
    updatePresentationSlide(assetRegistry.find(a => a.id === 'presentation'), document.getElementById('modal-asset-body'));
  }
};

window.nextSlide = function() {
  if (currentSlideIdx < pptSlides.length - 1) {
    currentSlideIdx++;
    updatePresentationSlide(assetRegistry.find(a => a.id === 'presentation'), document.getElementById('modal-asset-body'));
  }
};

function renderHandoutAsset(asset, container) {
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 12px; height: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
        <span style="font-size: 13px; color: var(--muted); font-family: var(--font-mono);">${asset.downloadName} (Internal docs)</span>
        <a href="${asset.file}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 6px;">
          <span>Open PDF in new tab</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </div>
      <div style="width: 100%; height: 74vh; border: 1px solid var(--border-strong); border-radius: var(--radius-md); overflow: hidden; background: #121212;">
        <iframe src="${asset.file}" title="${asset.displayName}" style="width: 100%; height: 100%; border: none; display: block;"></iframe>
      </div>
    </div>
  `;
}

/* -------------------------------------------------------------------
   6. VISITOR FEEDBACK SYSTEM (Indexed & Connected to CF Worker)
   ------------------------------------------------------------------- */
const FEEDBACK_CONFIG = window.ROBOT_CONFIG || {
  // Cloudflare Worker URL endpoint
  workerUrl: "https://obstacle-car-feedback-worker.tijil.workers.dev",
  // Passcode expected by the Cloudflare Worker bearer check
  passcode: "aloysius-robotics-2026",
  // Database file in Website/Data
  dataPath: "./Data/feedbacks.json"
};

let localFeedbacks = [];

function initFeedbacks() {
  loadFeedbacks();

  const form = document.getElementById('feedback-form');
  if (form) {
    form.addEventListener('submit', handleFeedbackSubmit);
  }
}

function loadFeedbacks() {
  const grid = document.getElementById('feedback-grid');
  if (!grid) return;

  fetch(FEEDBACK_CONFIG.dataPath + '?t=' + Date.now())
    .then(r => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        localFeedbacks = data;
        renderFeedbackGrid(localFeedbacks);
      } else {
        renderFeedbackGrid([]);
      }
    })
    .catch(() => {
      renderFeedbackGrid(localFeedbacks);
    });
}

function renderFeedbackGrid(feedbacks) {
  const grid = document.getElementById('feedback-grid');
  if (!grid) return;

  if (!feedbacks || feedbacks.length === 0) {
    grid.innerHTML = `
      <div class="feedback-empty">
        <p style="font-size: 15px; color: var(--fg); font-weight: 500; margin-bottom: 6px;">No feedback entries yet</p>
        <p style="font-size: 14px; color: var(--muted); margin-bottom: 16px;">Be the first visitor to share your review of our exhibition demonstration.</p>
        <button class="btn btn-primary btn-sm" onclick="openFeedbackPanel()">Write feedback</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = feedbacks.map(item => `
    <div class="feedback-card">
      <div>
        <div class="feedback-header">
          <span class="feedback-author">${escapeHtml(item.name || "Anonymous")}</span>
          <span class="feedback-role">${escapeHtml(item.role || "Visitor")}</span>
        </div>
        <p class="feedback-body">${escapeHtml(item.message || "")}</p>
      </div>
      <div class="feedback-date">${escapeHtml(item.date || "Exhibition 2026")}</div>
    </div>
  `).join('');
}

function openFeedbackPanel() {
  const modal = document.getElementById('feedback-modal');
  if (modal) {
    modal.classList.add('open');
    const nameInput = document.getElementById('fb-name');
    if (nameInput) setTimeout(() => nameInput.focus(), 100);
  }
}

function closeFeedbackPanel() {
  const modal = document.getElementById('feedback-modal');
  if (modal) modal.classList.remove('open');
  const alertBox = document.getElementById('fb-alert');
  if (alertBox) alertBox.style.display = 'none';
}

async function handleFeedbackSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('fb-name');
  const roleSelect = document.getElementById('fb-role');
  const msgInput = document.getElementById('fb-message');
  const submitBtn = document.getElementById('fb-submit-btn');
  const alertBox = document.getElementById('fb-alert');

  const name = nameInput.value.trim();
  const role = roleSelect.value;
  const message = msgInput.value.trim();

  if (!name || !message) {
    showFeedbackAlert("Please provide your name and feedback message.", "danger");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  const payload = {
    name: name,
    role: role,
    message: message,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    timestamp: Date.now()
  };

  try {
    const res = await fetch(FEEDBACK_CONFIG.workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FEEDBACK_CONFIG.passcode}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      const savedItem = data.feedback || payload;
      localFeedbacks.unshift(savedItem);
      renderFeedbackGrid(localFeedbacks);

      nameInput.value = '';
      msgInput.value = '';
      closeFeedbackPanel();
      alert("Thank you! Your feedback has been submitted.");
    } else {
      const err = await res.json().catch(() => ({ error: "Failed to submit to worker" }));
      // Fallback: save locally in session
      localFeedbacks.unshift(payload);
      renderFeedbackGrid(localFeedbacks);
      nameInput.value = '';
      msgInput.value = '';
      closeFeedbackPanel();
      alert("Feedback saved locally! (Worker note: " + (err.error || "Verify Cloudflare endpoint") + ")");
    }
  } catch (err) {
    // Graceful offline fallback
    localFeedbacks.unshift(payload);
    renderFeedbackGrid(localFeedbacks);
    nameInput.value = '';
    msgInput.value = '';
    closeFeedbackPanel();
    alert("Feedback recorded! (Worker offline or local preview mode).");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit feedback";
  }
}

function showFeedbackAlert(msg, type) {
  const alertBox = document.getElementById('fb-alert');
  if (alertBox) {
    alertBox.textContent = msg;
    alertBox.style.display = 'block';
    alertBox.style.color = type === 'danger' ? 'var(--danger)' : 'var(--success)';
  }
}

/* -------------------------------------------------------------------
   7. NAVIGATION & URL ROUTING (Indexed child paths & anchors)
   ------------------------------------------------------------------- */
function checkUrlRouting() {
  const hash = window.location.hash;
  const search = window.location.search;
  const path = window.location.pathname;

  if (hash === '#write-feedback' || search.includes('action=write') || path.includes('/feedback/write')) {
    setTimeout(openFeedbackPanel, 200);
  } else if (hash === '#feedback' || path.includes('/feedback')) {
    setTimeout(() => {
      const sec = document.getElementById('feedback');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  } else if (hash === '#think-about-them' || hash.startsWith('#q') || path.includes('/think-about-them')) {
    setTimeout(() => {
      const target = document.querySelector(hash || '#think-about-them');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal('asset-modal');
    closeModal('lightbox-modal');
    closeFeedbackPanel();
  } else if (e.key === 'ArrowLeft') {
    const lbModal = document.getElementById('lightbox-modal');
    if (lbModal && lbModal.classList.contains('open')) prevLightbox();
  } else if (e.key === 'ArrowRight') {
    const lbModal = document.getElementById('lightbox-modal');
    if (lbModal && lbModal.classList.contains('open')) nextLightbox();
  }
});

function initNavigation() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      links.classList.toggle('nav-open');
    });

    links.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('nav-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!links.contains(e.target) && !toggle.contains(e.target)) {
        links.classList.remove('nav-open');
      }
    });
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.openGalleryLightbox = openGalleryLightbox;
window.prevLightbox = prevLightbox;
window.nextLightbox = nextLightbox;
window.viewAsset = viewAsset;
window.triggerDownload = triggerDownload;
window.closeModal = closeModal;
window.openFeedbackPanel = openFeedbackPanel;
window.closeFeedbackPanel = closeFeedbackPanel;
