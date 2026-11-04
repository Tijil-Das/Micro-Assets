# BRIEF: Professional web design principles (read fully, then wait)

You will soon be asked to build a website. This message sets the **design standard** you must hold yourself to. It contains no build instructions yet. After reading it, reply with a 3-line acknowledgement of the principles you'll apply, and then wait for the build brief.

## 1. Context (so your design choices fit)

The site is a showcase for a Class 12 school Computer Science exhibition project: an **Obstacle Avoidance Car** (Arduino robot that detects obstacles with an ultrasonic sensor). Visitors will mostly arrive by **scanning a QR code on a printed handout, on a phone**, a few minutes after seeing the live demo. They are curious students, teachers and parents. They will skim, not study. The site must make a team of school students look like polished engineers, and must make the project feel clever, clear and memorable within seconds.

Visual identity to stay consistent with (the exhibition slides and handout already use it): a **"sonar" concept** (concentric sound-wave rings, radar sweep), deep navy `#0B1F44` / midnight `#071530`, electric blue `#3D8BFF`, cyan glow `#35E0FF`, soft light `#F4F8FF` to white, and orange `#F28C28` used ONLY for obstacles/warnings. Typeface: Segoe UI or a close modern sans-serif.

## 2. Reference sites to emulate (qualities, not copies)

Use these as taste benchmarks. Never copy their layouts, assets or code.
- **Stripe**: confident gradients, perfect typographic hierarchy, technical content made beautiful.
- **Linear**: dark, precise, restrained; glow and depth used sparingly; micro-interactions that feel expensive.
- **Apple product pages**: one idea per screen, huge type, generous whitespace, scroll-driven storytelling.
- **Vercel**: crisp grid, high contrast, fast, minimal chrome, code presented elegantly.
- **Awwwards-style portfolio sites**: bold editorial typography, purposeful motion, strong pacing between sections.

## 3. Design principles (non-negotiable)

**Hierarchy and focus**
1. One clear focal point per screen. A visitor should know what matters within 2 seconds.
2. Establish a strict type scale (for example 14 / 16 / 20 / 28 / 40 / 64 px, fluid with `clamp()`). Headlines big and bold; body text 16 to 18 px, line height 1.5 to 1.7, line length 55 to 75 characters.
3. Lead with the strongest asset (the demo video or hero visual), then photos, then details. Progressive disclosure: skim first, depth on demand.

**Space, grid and rhythm**
4. Generous whitespace; let content breathe. Whitespace is a feature, not waste.
5. A strict grid and a spacing scale (an 8 px base: 8, 16, 24, 32, 48, 64, 96, 128). Never use arbitrary margins.
6. Pace the page: alternate dense and airy sections, and alternate dark and light bands so scrolling has rhythm.

**Color and depth**
7. A disciplined palette: one dominant neutral, one primary accent, one rare highlight (orange). No rainbow UIs.
8. Contrast must meet WCAG AA (4.5:1 for text). Never put text on busy imagery without an overlay.
9. Depth through soft layered shadows, subtle gradients, glass cards (translucent fill + thin border + backdrop blur) and gentle glows. Keep it refined, never gaudy.

**Typography**
10. Maximum two font families (one is enough). Use weight and size contrast, not many styles.
11. Tight tracking and line height on large headlines; comfortable spacing on body. Use real numerals/units formatting (for example "10 cm", "40 kHz") with thin spacing and consistent styling.

**Motion and interaction**
12. Motion must have a purpose: guide attention, show cause and effect, reveal content on scroll. Use 150 to 400 ms, ease-out curves, and small distances (fade plus 12 to 24 px translate).
13. The signature moment: a subtle, performant "sonar ripple" (concentric rings expanding) in the hero. Keep it tasteful and GPU-friendly (`transform`/`opacity` only).
14. Every interactive element needs visible hover, focus and active states. Buttons and cards respond to touch and pointer.
15. Respect `prefers-reduced-motion`: disable or simplify animation for those users.
16. No autoplaying audio, no scroll-jacking, no carousels that hide key content, no intrusive popups.

**Imagery and media**
17. Photos: consistent crop, rounded corners and treatment. Optimize (modern formats, correct sizes, `loading="lazy"`, explicit width/height to prevent layout shift).
18. Videos: poster image, muted/inline playback, lazy loaded, with a fallback; never block the page on a large file.
19. Diagrams and icons: clean, consistent stroke weight, inline SVG where possible. If an asset is missing, use an elegant designed placeholder, never a broken image or empty box.

**Content and UX**
20. Short, scannable copy: headlines under 8 words, paragraphs under 3 lines, plenty of labels. Write like a confident engineer, not a school report.
21. Sticky, minimal navigation with section anchors; a clear primary call-to-action (for example "Watch the demo"); a small, clear footer.
22. Make explanations visual: step-by-step cards, labeled diagrams, interactive reveals (hover/tap to show detail) rather than paragraphs.
23. Add small delighters that suit the topic (for example a "guess the answer, tap to reveal" interaction), but never at the cost of clarity or speed.

**Responsive and mobile-first (critical)**
24. Design for a **360 to 430 px phone first**, then scale up to tablet and desktop. Test at 360, 768, 1024, 1440 px. No horizontal scroll, ever.
25. Touch targets at least 44 x 44 px; thumb-friendly spacing; readable without zooming. Use `viewport-fit=cover` and safe-area insets.
26. Layouts reflow gracefully (grid to a single column); images and media stay within bounds.

**Performance, accessibility, quality**
27. Fast: aim for Lighthouse 90+ on all categories. Minimal JS, no heavy libraries unless essential, inline critical CSS, system or well-subsetted fonts with fallbacks.
28. Semantic HTML (`header`, `nav`, `main`, `section`, `footer`), proper heading order, descriptive `alt` text, labels on all controls, full keyboard operability, visible focus rings.
29. Light and dark themes should both look intentional if supported; otherwise pick one and execute it flawlessly.
30. Zero console errors, no broken links, no layout shift, no placeholder lorem ipsum anywhere.

## 4. Anti-patterns (never do these)

Generic template look; centered-everything walls of text; stock-photo clichés; default browser fonts/buttons; low-contrast gray text; more than 3 accent colors; random emojis as icons; cluttered navbars; tiny text; heavy parallax; auto-rotating carousels; cookie-banner-style popups; fake testimonials or invented statistics; copying any reference site's exact layout.

## 5. Self-review before delivering any build

- Would this look at home next to Stripe or Linear at a glance?
- Is the first screen on a phone striking and clear within 2 seconds?
- Is every section's purpose obvious, with one focal point?
- Are spacing, type scale, colors and corner radii perfectly consistent?
- Does it work at 360 px and at 1440 px, with keyboard only, and with reduced motion on?
- Are all images/videos optimized, lazy loaded and non-shifting?
- Have you checked contrast, alt text, heading order and focus states?
- If you can render it, screenshot it at phone and desktop sizes, inspect, and fix flaws before reporting.

## 6. What to do now

Reply with a 3-line acknowledgement. Do not build anything yet; wait for the build brief, which will tell you exactly what to make and with which technology.
