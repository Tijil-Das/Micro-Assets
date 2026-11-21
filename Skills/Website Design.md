# Website Design.md — Website Design Rules for AI Agents

Binding rules for any agent that builds or edits UI in this project. Read the whole file before writing any code. Re-check Section 21 before saying a page is done.

---

## 0. How to use this file

- **Priority order:** (1) the user's brand and explicit instructions, (2) this file, (3) your own defaults. Your defaults rank last because they are the problem.
- **Why this file exists:** AI output drifts to the statistical average of the web: indigo-to-purple gradients, Inter, a glowing button, three identical cards. Vague prompts like "clean, modern, professional" push every model to the same place. The fix is specific constraints, chosen on purpose. This file supplies them.
- **The one test:** *Would a senior designer at a top product studio ship this without changes?* If any element exists only to look "modern" or "techy", delete it.
- **When unsure, subtract.** Remove the effect, the extra color, the extra card, the extra animation. Polish comes from precision and restraint, not from additions.
- If a rule here conflicts with a user request, do what the user asked and say in one line which rule you bent.

---

## 1. Core principles

1. **Restraint beats decoration.** Premium sites (Stripe, Linear, Vercel, Apple) are quiet. Their effort goes into type, spacing, alignment, and behavior.
2. **Hierarchy first.** Every screen has one focal point and one primary action. Build hierarchy with size, weight, contrast, and space, not with extra colors or boxes.
3. **Consistency through tokens.** Every color, space, radius, shadow, and duration comes from a small named scale (Section 5). No magic numbers in components.
4. **Show the real thing.** Real product screenshots, real photos, real numbers, real names. Linear's pages show the actual interface instead of abstract illustrations; copy that.
5. **Specific over generic.** Specific headline, specific number, specific screenshot. If a sentence or visual could appear on any competitor's site, rewrite it.
6. **Density lives in behavior, not pixels.** The best sites look sparse but every element responds: hover, focus, active, disabled, loading, empty, error. Build all states.
7. **One signature move.** Choose exactly one memorable element (a typographic treatment, one bold color moment, one unusual layout, one custom visual). Everything else stays quiet to support it.
8. **Familiar structure, personal details.** Use conventional patterns for navigation, forms, pricing, checkout (users expect them). Put personality into type, color, imagery, and copy.
9. **Fast is a design feature.** Instant feedback (< 100 ms), small assets, no layout shift. Slow looks cheap.

---

## 2. Hard bans: the "AI tells"

Never ship any of these. Each has a replacement.

| Banned | Do this instead |
|---|---|
| Glowing buttons, colored `box-shadow` glow, neon outlines, pulsing CTAs | Solid fill, 1px border, subtle background shift on hover (Section 10.1) |
| Indigo / violet / purple-to-pink or blue-to-purple gradients (Tailwind `indigo-500` → `purple-600` look) | One deliberately chosen accent hue, flat fills |
| Gradient text on headlines | Solid text color; use weight and size for emphasis |
| Gradient buttons | Flat accent or near-black/near-white primary |
| Blurry gradient orbs / blobs / aurora glows behind the hero | Flat or very subtle same-hue background |
| Glassmorphism cards (translucent + backdrop-blur everywhere) | Solid surface + 1px hairline border. Backdrop blur only on a sticky nav, subtle |
| Emoji as icons or bullets; sparkle (✨) anywhere | One icon set, or no icon |
| Pill badge above the hero ("🚀 Now in beta", "✨ New") | Nothing, or a plain text link line if there is real news |
| Three identical feature cards: colored rounded-square icon + title + two lines | 3 to 5 features, each with real depth (screenshot, demo, or numbers), in varied layouts |
| Everything centered | Left-align by default; center only short statements |
| `rounded-2xl` / `rounded-3xl` on everything | 2 to 3 radius values total, tied to the direction (Section 4) |
| Hover that scales (`scale-105`) and adds `shadow-xl` on every card | Border/background change only; at most a 1–2px shift |
| Bounce, float, wobble, infinite pulse, shimmer loops | Short, purposeful transitions (Section 11) |
| Everything fades up on scroll | Reveal a few key blocks once, 12–24px, then stop |
| Default Inter/Roboto/system font with default weights and spacing | Intentional font choice and tuned tracking (Section 7) |
| Default framework palette used raw (`slate`, `indigo`, `purple`) | Own tokens with tinted neutrals (Section 6) |
| Heavy generic shadows (`shadow-lg/xl/2xl`) | Layered, low-opacity, tinted shadows (Section 9) |
| Dark "cyber" theme: slate-900 + neon cyan/purple | Calm dark theme with tinted near-black and one muted accent (Section 16) |
| Tilted 3D dashboard mockups, floating UI cards, fake device frames | Flat, cropped real screenshot with a hairline border |
| Fake stats ("10K+ users", "99.9% uptime", "4.9★"), fake testimonials, fake logos, stock-face avatars | Real data, or leave the section out. Never invent proof |
| Lorem ipsum, "John Doe", "Acme Inc", "Feature One" | Realistic, domain-specific content |
| Marketing clichés ("Revolutionize", "Unlock", "Supercharge", "Seamless", "Elevate") | Plain, concrete copy (Section 12) |
| Triplet slogans ("Fast. Simple. Secure.") and "Build faster. Ship smarter." headlines | A real claim with a specific benefit |
| Same layout repeated per section: centered heading + subtitle + card grid | Vary section structure and rhythm (Section 14) |
| Colored circle checkmarks (green circle + white check) in every list | Neutral small check or plain bullets |
| Dot-grid / noise / mesh backgrounds added "for texture" | Plain background; texture only if it is the chosen signature |
| Decorative icons on every heading or list item | Icons only where they speed up scanning |
| Em dashes and emoji sprinkled through UI copy | Plain punctuation, no emoji in UI |

---

## 3. Before you write code: the design brief

Output this brief (10 lines max) and keep it at the top of the work. If the user has not given the inputs, **ask once** for the missing ones, or pick sensible values and state them.

```
Product / site type:
Audience (who, what they care about):
Primary goal of the site (one action):
Tone: three adjectives (e.g. calm, precise, warm)
Direction preset (Section 4) + any deviations:
Fonts (display / body / mono):
Color: neutral hue, one accent hue, semantic colors:
Radius / density / motion personality:
Signature element (exactly one):
Reference sites (2-3) and what specifically to borrow from each:
```

Then: create tokens (Section 5) → build layout skeleton in grayscale → add type → add color → add components → add motion → run the review loop (Section 21).

**Build in grayscale first.** If the hierarchy does not work without color, color will not save it.

---

## 4. Direction presets

Pick one preset and commit. Do not blend three. Values are starting points; tune to the brand.

**A. Technical / Minimal** (dev tools, SaaS, B2B, APIs)
- Fonts: Geist or Instrument Sans for UI; Geist Mono or JetBrains Mono for code.
- Neutrals cool, nearly gray (hue 240–270, very low chroma). One accent that is *not* indigo/violet: e.g. teal, green, orange, or a pure blue.
- Radius 6–8px. Borders over shadows. Medium-high density. Product UI is the hero visual.

**B. Editorial / Content-led** (media, portfolios, agencies, blogs, studios)
- Fonts: serif display (Instrument Serif, Newsreader, Fraunces) + neutral sans (Instrument Sans, Geist) or all-sans with strong scale.
- Warm paper neutrals (off-white with a yellow tint), near-black ink. Accent used rarely (ink red, forest, ochre).
- Radius 0–4px. Display type 72–120px, tight tracking. Asymmetric grid, hairline rules, big imagery.

**C. Warm / Friendly** (consumer, education, wellness, community, local services)
- Fonts: Figtree, Plus Jakarta Sans, DM Sans, or Hanken Grotesk.
- Warm off-white, warm gray text, accent in coral / amber / green / clear blue.
- Radius 12–16px. Soft layered shadows. Real photography of real people. One illustration style at most.

**D. Quiet Luxury / Premium** (hospitality, fashion, high-end services, private finance)
- Fonts: refined serif display or light-weight sans; small uppercase labels with +0.08em tracking.
- Mostly neutral palette plus one muted metallic or earth accent.
- Radius 0–2px. Very generous whitespace. Imagery-led. Slow, smooth motion (400–700ms).

**E. Bold / Playful-Modern** (creator tools, consumer apps, youth brands)
- Fonts: chunky grotesque (Bricolage Grotesque, Cabinet Grotesk, Hanken Grotesk at heavy weight).
- Flat saturated colors, max 3 hues. 1.5–2px borders, optional hard offset shadow. Radius 8–12px.
- Still disciplined: one idea per section, strict grid, no glow.

---

## 5. Design tokens (required)

Define once, use everywhere. No raw hex, px, or ms values in components.

```css
:root {
  /* Spacing: 4px base. Use ONLY these. */
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px;  --space-7: 48px; --space-8: 64px;
  --space-9: 96px; --space-10: 128px; --space-11: 160px;

  /* Font families: set per direction preset (Section 4) */
  --font-sans: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-sans);   /* swap for a serif in editorial/luxury */
  --font-mono: "Geist Mono", ui-monospace, monospace;

  /* Type scale (fluid at the top end). Max 7 sizes in use. */
  --text-xs: 12px;  --text-sm: 14px;  --text-base: 16px;  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: clamp(24px, 1.2vw + 18px, 32px);
  --text-3xl: clamp(28px, 2.4vw + 16px, 44px);
  --text-4xl: clamp(36px, 4.5vw + 12px, 64px);
  --text-5xl: clamp(44px, 7vw + 8px, 96px);   /* hero / display only */

  /* Radius: 3 values + full. Pick per direction. */
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 14px; --radius-full: 999px;

  /* Neutrals: tinted, never pure gray. One hue for the whole ramp. */
  --hue: 260;   /* cool=240-270, warm=60-90. Set per brand. */
  --gray-50:  oklch(98.5% 0.004 var(--hue));
  --gray-100: oklch(96.5% 0.005 var(--hue));
  --gray-200: oklch(92.5% 0.006 var(--hue));
  --gray-300: oklch(87%   0.008 var(--hue));
  --gray-400: oklch(72%   0.010 var(--hue));
  --gray-500: oklch(58%   0.012 var(--hue));
  --gray-600: oklch(46%   0.012 var(--hue));
  --gray-700: oklch(37%   0.012 var(--hue));
  --gray-800: oklch(27%   0.012 var(--hue));
  --gray-900: oklch(19%   0.012 var(--hue));
  --gray-950: oklch(14%   0.010 var(--hue));

  /* Accent: ONE hue. Avoid 265–310 (the "AI purple") unless the brand demands it. */
  --accent-hue: 165;
  --accent:       oklch(55% 0.15 var(--accent-hue));
  --accent-hover: oklch(50% 0.15 var(--accent-hue));
  --accent-fg:    oklch(99% 0 0);

  /* Semantic roles: components use ONLY these */
  --bg:            var(--gray-50);
  --bg-subtle:     var(--gray-100);
  --surface:       oklch(100% 0 0);
  --border:        var(--gray-200);
  --border-strong: var(--gray-300);
  --text:          var(--gray-900);
  --text-muted:    var(--gray-600);   /* verify >= 4.5:1 on its background */
  --focus-ring:    var(--accent);

  /* Semantic status: desaturated, never neon */
  --success: oklch(55% 0.12 150);
  --warning: oklch(70% 0.13 80);
  --danger:  oklch(55% 0.18 25);

  /* Shadows: low opacity, tinted by the neutral hue, layered */
  --shadow-xs: 0 1px 2px oklch(20% 0.02 var(--hue) / 0.05);
  --shadow-sm: 0 1px 2px oklch(20% 0.02 var(--hue) / 0.06), 0 2px 6px oklch(20% 0.02 var(--hue) / 0.05);
  --shadow-md: 0 2px 4px oklch(20% 0.02 var(--hue) / 0.05), 0 8px 24px -6px oklch(20% 0.02 var(--hue) / 0.10);
  --shadow-lg: 0 4px 8px oklch(20% 0.02 var(--hue) / 0.05), 0 20px 48px -12px oklch(20% 0.02 var(--hue) / 0.16); /* modals/popovers only */

  /* Motion */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast: 120ms;   /* hover, press */
  --dur-base: 200ms;   /* menus, toggles */
  --dur-slow: 450ms;   /* reveals, page-level */

  /* Layout */
  --container: 1200px;
  --container-narrow: 720px;
  --gutter: clamp(16px, 4vw, 32px);
  --section-y: clamp(64px, 10vw, 128px);
}
```

Hard limits (count them in review): **≤ 2 font families, ≤ 7 font sizes, 1 accent hue, ≤ 3 radius values, ≤ 4 shadow levels, ≤ 3 durations.**

---

## 6. Color

- **Structure: 60 / 30 / 10.** About 60% background neutrals, 30% surfaces and text, ≤ 10% accent. If the accent covers more, it stops being an accent.
- **Tint every neutral** toward one hue (the ramp above). Pure `#000`, `#fff`, and `#808080` grays look flat and generic. Use near-black text (`gray-900/950`) and an off-white background; reserve pure white for raised surfaces.
- **One accent.** It marks primary actions, links, active states, focus, and key data. It does not decorate headings, borders, icons, and backgrounds at the same time.
- **Neutral primary button is valid and premium** (near-black on light, near-white on dark) when the brand has no strong color. Vercel-style restraint works.
- **Semantic colors** (success / warning / danger / info) are used only for status. Keep them desaturated and always pair with an icon or text, never color alone.
- **Contrast:** body text ≥ 4.5:1 (aim for 7:1 on long reading), large text ≥ 3:1, UI boundaries ≥ 3:1. Muted text must still pass.
- **Gradients:** allowed only as (a) a very subtle same-hue background wash (≤ 6% lightness difference), or (b) the single signature move, used in one place. Never on text, buttons, or cards by default. Never purple-pink or blue-purple.
- **Images and color:** let photography carry color; keep UI around it neutral.
- **Do not invent a palette from a mood word.** Start from the brand; if none exists, start from the preset and change only hue.
- **Test in grayscale.** Hierarchy and contrast must survive without hue.

---

## 7. Typography

Typography is 80% of perceived quality. Spend effort here.

**Fonts**
- Use at most 2 families (display + body), or 1 family with a strong weight/size contrast. Add a mono only for code or data.
- Choose on purpose. Good free options: Geist, Instrument Sans, Instrument Serif, Newsreader, Fraunces, Figtree, Plus Jakarta Sans, DM Sans, Manrope, Hanken Grotesk, Bricolage Grotesque, JetBrains Mono, Geist Mono (Google Fonts); Satoshi, General Sans, Cabinet Grotesk (Fontshare).
- Inter is not forbidden (Linear uses it), but "Inter + default weights + default tracking" is a tell. If you use it, tune tracking and weights and pair it with a deliberate scale.
- Self-host or preload, `font-display: swap`, subset to needed glyphs, use variable fonts, limit to 2–3 weights.

**Scale and rhythm**
- Body 16px (17–18px for editorial/reading). Never below 14px for content, never below 12px for anything.
- Body line-height 1.5–1.65. Headings 1.05–1.2. Display (> 64px) 0.95–1.05.
- **Tracking:** display and h1 `-0.03em` to `-0.04em`; h2/h3 `-0.015em` to `-0.025em`; body `0`; small uppercase labels `+0.06em` to `+0.1em` at 11–12px.
- **Weights:** body 400, UI labels 500, headings 500–650. Avoid 800/900 as a default; heavy weights only as a deliberate direction (preset E).
- **Measure:** 60–75 characters per line for paragraphs (`max-width: 65ch`). Hero subheads ≤ 2 lines.
- Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs. Use `font-variant-numeric: tabular-nums` for prices, tables, stats.
- **Sentence case** for headings, buttons, nav. ALL CAPS only for tiny labels.
- Size contrast does the work: hero headline should be at least 3x body. Muted color + smaller size for secondary text, not lighter weight below 400.
- Never center long paragraphs. Never justify text.
- Links in body text: underlined or clearly distinct, with a hover state. Underline offset 2–3px, thickness 1px.
- Max 3 text colors: `--text`, `--text-muted`, accent.

---

## 8. Layout, spacing, grid

- **Grid:** 12 columns on desktop (4 on mobile, 8 tablet). Container `max-width: 1200px` (1280 for dense apps), side padding `--gutter`. Reading columns 640–720px.
- **Spacing scale only.** Every margin, padding, and gap is a token.
- **Proximity rule:** the gap between related items must be clearly smaller than the gap between groups. Use at least 2x (e.g. label→input 8px, field→field 24px, form→next section 64px+).
- **Whitespace is the premium signal.** Section vertical padding: 96–160px desktop, 64–96px mobile (`--section-y`). Do not tighten sections to "fit more".
- **Alignment:** pick strong left edges and hold them. Items in a row share a baseline or a center line. Use optical alignment for icons next to text (nudge 1px if needed).
- **Break symmetry on purpose:** split layouts (5/7 columns), offset images, asymmetric headings with a narrow text column. Perfect centered symmetry everywhere reads as template.
- **Vary section rhythm** (Section 14): never use the same layout twice in a row.
- **Bento grids:** allowed once per page, with unequal cells that carry real content. Do not fill a bento with decorative icons.
- **Cards:** do not put everything in a card. Use whitespace and dividers first; cards only for items that are independent, clickable, or comparable. Never nest cards in cards.
- **Z-pattern/F-pattern:** put the headline and primary action in the top-left reading path; put the proof directly after the claim.
- **Above the fold:** headline, one-line explanation, primary CTA, and a hint of the product or proof. Nothing else competes.

---

## 9. Surfaces: borders, shadows, depth

- **Borders first.** Premium UIs separate surfaces with 1px hairlines at low contrast (`--border`), not with heavy shadows. In dark mode use `rgba(255,255,255,0.06–0.10)`.
- **Shadows:** use the token scale only. Layered, low opacity, tinted by the neutral hue, never pure black. Elevation tells importance: static content 0, cards 0–`xs/sm`, dropdowns `md`, modals `lg`.
- A card has *either* a visible border *or* a soft shadow, rarely both strongly.
- **Concentric radii:** inner radius = outer radius − padding (e.g. 16px card with 8px padding → 8px inner image).
- **Image edges:** add `outline: 1px solid rgb(0 0 0 / 0.06); outline-offset: -1px` to photos and screenshots so they do not bleed into the background.
- **No** neumorphism, no inner glows, no colored drop shadows, no gradient borders, no animated borders.
- Nav blur is the only allowed backdrop blur: `backdrop-filter: blur(12px)` with ~80% opaque background and a 1px bottom border that appears on scroll.

---

## 10. Components

### 10.1 Buttons (no glow, ever)
- Hierarchy: **one** primary per view/section, then secondary (outlined or tinted), then ghost/text.
- Sizes: sm 32px, md 40px, lg 48px tall. Touch targets on mobile ≥ 44px. Padding-x 16/20/24px. Label 14–16px, weight 500–600, sentence case.
- Radius: matches the input radius from the same direction (never pill unless the preset says so).
- **Hover:** background shifts 4–8% in lightness over `--dur-fast`. **Active:** a bit darker, optional `translateY(1px)`. **Focus-visible:** 2px outline in `--focus-ring`, 2px offset. **Disabled:** 50% opacity, `cursor: not-allowed`, no hover effect. **Loading:** inline small spinner, width does not change.
- No gradient fill, no colored shadow, no scale-on-hover, no shine sweep, no bouncing arrow. One small arrow icon that nudges 2px on hover is acceptable.
- Labels say what happens: "Start free trial", "Book a demo", "Download report". Not "Submit", "Click here", "Learn more" (unless it is a quiet text link).

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 40px; padding: 0 var(--space-4);
  font: 500 var(--text-sm)/1 var(--font-sans);
  border: 1px solid transparent; border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease-out),
              border-color var(--dur-fast) var(--ease-out),
              color var(--dur-fast) var(--ease-out),
              transform var(--dur-fast) var(--ease-out);
}
.btn:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
.btn:active { transform: translateY(1px); }
.btn[disabled] { opacity: .5; cursor: not-allowed; }
.btn-primary { background: var(--accent); color: var(--accent-fg); }
.btn-primary:hover { background: var(--accent-hover); }
.btn-secondary { background: var(--surface); color: var(--text); border-color: var(--border-strong); }
.btn-secondary:hover { background: var(--bg-subtle); }
.btn-ghost { background: transparent; color: var(--text); }
.btn-ghost:hover { background: var(--bg-subtle); }
```

### 10.2 Links
Distinct from text by underline or color. Hover changes color/underline thickness. Visible focus. External links may get a small arrow icon.

### 10.3 Cards
```css
.card { background: var(--surface); border: 1px solid var(--border);
        border-radius: var(--radius-lg); padding: var(--space-5); }
.card--link:hover { border-color: var(--border-strong); background: var(--bg-subtle); }
```
- Padding 20–32px. Consistent heights in a row only when content allows; never stretch content to fake equality.
- Interactive card: the whole card is one link/target, with a visible focus state.

### 10.4 Forms
- Label above the field, always visible (placeholder is an example, not a label). Helper text below in `--text-muted`.
- Input height 40–44px; font-size ≥ 16px on mobile (prevents iOS zoom). Border `--border-strong`, focus = accent border + 2px ring, error = danger border + message below.
- One column. Group related fields. Mark optional fields, not required ones, when most are required.
- Use correct `type`, `inputmode`, `autocomplete`. Validate inline on blur, keep what the user typed, write errors in plain language ("Enter a valid email like name@company.com").
- Submit button states: default, loading, success. Never disable it without saying why.
- Ask only for what you need. Every extra field costs conversions.

### 10.5 Navigation
- Height 56–72px. Logo left, 3–6 links, one primary CTA right. Sticky; add a 1px bottom border once scrolled.
- Active page indicated. Mobile: full-height sheet or drawer, large targets (≥ 48px rows), CTA inside. Focus trapped, Esc closes.
- No mega-menus unless the site truly has depth. No hamburger on desktop.

### 10.6 Hero
- Headline: a real claim, 4–12 words, left-aligned for product/editorial sites. Subhead: ≤ 2 lines saying what it is and for whom. One primary CTA and at most one secondary.
- Visual: real product UI, real photo, or a custom typographic composition. Not a tilted mock, not floating cards, not an abstract blob.
- Proof strip right below: real customer logos (grayscale, ~60% opacity, uniform height, 24–32px) or a real number. If none exist, omit it.

### 10.7 Icons
- One family (Lucide, Phosphor, or Heroicons), one stroke weight (1.5px), sizes 16/20/24px, `currentColor`, aligned optically with text.
- Do not put icons in colored rounded squares by default. Icons act as punctuation: use only where they speed scanning (nav, status, actions). Decorative icons get `aria-hidden="true"`.
- Mixed-weight or mixed-family icons break the "system" feeling instantly.

### 10.8 Imagery
- Preference order: real photography/screenshots > custom illustration in one consistent style > typography-only > nothing. Generic stock, AI faces, and 3D blobs are last.
- Consistent treatment: same aspect ratios, same crop logic, same color grade, same corner radius.
- Screenshots: crop to the relevant part, realistic data, hairline border (Section 9). Retina-sharp. Do not wrap in fake browser chrome unless it explains context.
- Performance: set `width`/`height`, use `srcset`/`sizes`, AVIF/WebP, lazy-load below the fold, prioritize the hero image.
- If a real asset does not exist yet, use a neutral gray block labeled with what belongs there (e.g. "Product screenshot, 16:10") and flag it as TODO. Never fill with random stock.

### 10.9 Badges and tags
Small (12–13px), 20–24px tall, subtle tinted background with matching text, radius = sm or full per direction. For status or category only. No glow, no emoji.

### 10.10 Tables and data
Left-align text, right-align numbers (tabular nums). Row height 44–56px. Hairline row dividers, no zebra unless dense. Sticky header on long tables. Responsive: horizontal scroll or stacked cards on mobile, never truncation without access.

### 10.11 Modals, popovers, toasts
Modal: center, max-width 480–640px, `--shadow-lg`, scrim at 40–60% opacity (no blur), focus trapped, Esc and outside click close. Toast: bottom-right (desktop), auto-dismiss 4–6s, never for critical errors. Always provide a way to undo destructive actions instead of confirm-spam.

### 10.12 Footer
Max 4 link columns, 14px text, grouped logically, **only real links**. Legal row. Social icons neutral. A footer is not the place for a second marketing pitch.

### 10.13 Pricing
Max 3–4 tiers, one highlighted with a border and a small text label (not glow). Big price, small billing note, short outcome-based feature lists with neutral checks. Monthly/annual toggle if offered. FAQ and objections below. Be honest about limits.

---

## 11. Motion and interaction

Motion confirms, guides, and orients. It never performs.

- **Durations:** micro (hover, press) 120ms, components (menus, toggles, accordions) 200ms, reveals and page-level 400–500ms. Never above 600ms (700ms only for the luxury preset).
- **Easing:** `--ease-out` for entering and hover; `--ease-in-out` for movement between positions. No linear, no bounce, no elastic.
- **Animate only** `transform` and `opacity` (and color/background for hover). Never animate `width`, `height`, `top`, `left`, or `box-shadow` blur on scroll.
- **Scroll reveals:** at most 4–6 elements per page, translate 12–24px, opacity 0 → 1, play **once**, stagger ≤ 60ms. Hero content loads without waiting for scroll.
- **Forbidden:** infinite loops (pulse, float, wiggle, shimmer, gradient shifting), cursor-follow effects, custom cursors, heavy parallax, text scrambling, auto-playing carousels, scroll-jacking.
- **Feedback:** every click acknowledges within 100ms (state change, spinner, optimistic update). Use skeletons for content areas, spinners only inline in buttons.
- **Respect `prefers-reduced-motion`:** replace movement with opacity fades or nothing.
- Keyboard first: every interaction works with Tab, Enter, Space, Esc, arrows where relevant. Show a clear `:focus-visible` ring (never `outline: none` without a replacement).
- Page transitions only if they are fast (< 300ms) and add orientation.

---

## 12. Copy and content (the biggest AI tell after visuals)

- **Write real copy.** Never ship lorem ipsum or generic placeholder text. If you lack facts, ask the user or leave a marked TODO.
- **Headline = a claim, not a slogan.** "Payments infrastructure for the internet" beats "Build faster. Ship smarter." Say what it is, who it is for, and what changes.
- **Be concrete:** numbers, nouns, verbs, outcomes. "Cut onboarding from 2 days to 20 minutes" beats "Streamline your workflow".
- **Banned words and phrases:** revolutionize, unlock, supercharge, elevate, empower, seamless(ly), effortless(ly), cutting-edge, next-gen, game-changer, leverage, harness, streamline, "all-in-one solution", "take it to the next level", "in today's fast-paced world", "welcome to", "we're passionate about", "your journey".
- **Avoid patterns:** triplet slogans, "X, but for Y", rhetorical-question headings, heading + subtitle + three bullets repeated in every section, excessive em dashes, exclamation marks.
- **Voice:** pick one (e.g. direct, warm, dry) and keep it identical across headings, buttons, errors, empty states, emails.
- **Microcopy matters:** error messages say what happened and how to fix it; empty states explain what goes here and offer one action; success states confirm what changed.
- **Social proof must be real:** named people, real roles, real companies, real metrics with context. If none exist, remove the section.
- Short paragraphs (≤ 4 lines), scannable subheads, descriptive link text (never "click here").
- Sentence case. No emoji in UI copy.

---

## 13. UX and psychology rules

These are the reasons good sites feel good. Apply them deliberately.

1. **One goal per page, one primary action per section.** Choice overload (Hick's law) kills action.
2. **Aesthetic-usability effect:** polished sites are judged easier and more trustworthy. Inconsistency (mixed radii, misaligned edges, random spacing) reads as "not credible" within seconds.
3. **Processing fluency:** simple, familiar layouts feel more trustworthy. Use conventional placement (logo top-left, nav top, CTA top-right, search where expected). This is Jakob's law: users spend most of their time on other sites.
4. **Von Restorff:** the one thing that differs from its surroundings gets noticed. Therefore make only the primary action visually distinct; if everything is highlighted, nothing is.
5. **Gestalt:** group with proximity and shared background; separate with space before lines before boxes.
6. **Fitts's law:** important targets are large and close to where attention already is; primary mobile actions sit in the thumb zone; touch targets ≥ 44px.
7. **Progressive disclosure:** show the 80% case, tuck advanced options behind clear affordances (accordions, "Show more", tabs).
8. **Information scent:** links and buttons predict what comes next; headings tell the page's story when read alone.
9. **Social proof near decisions:** place testimonials, logos, and numbers right next to the CTA or pricing, not in a distant section.
10. **Anchoring and clarity in pricing:** highlight the recommended tier, show the real total, no hidden costs, no fake countdown timers.
11. **Peak-end rule:** invest in the moment of success (signup completed, purchase done) and in the empty/error states. Users remember those.
12. **Trust signals:** real names and faces, security/privacy notes at forms, clear contact, readable policies, consistent polish, fast loading.
13. **No dark patterns:** no pre-checked upsells, no disguised ads, no confirm-shaming, no hard-to-find cancel, no fake scarcity.
14. **Design all states:** empty, loading, partial, error, success, offline, disabled, long text, zero results.
15. **Feedback and recovery:** show system status; make destructive actions reversible; keep user input on error.
16. **Reduce cognitive load:** fewer words, fewer colors, fewer type sizes, fewer choices per screen.
17. **Mobile first:** most traffic is mobile. Design the 390px layout first, then expand.
18. **Cookie banners and popups:** minimal, one banner, no autoplay modals, no exit-intent popups.

---

## 14. Page blueprints

Use as a skeleton, not a template. Vary layout from section to section.

**Landing page (product/SaaS)**
1. Nav
2. Hero: claim, subhead, CTA, real product visual
3. Proof strip: real logos or one real number
4. Problem or "what it does" in one tight section (not a card grid)
5. How it works: 3 steps or one narrative with product visuals
6. Features: 3–5 deep blocks, alternating layout (split, full-bleed, bento, list), each with real visuals
7. Testimonial or case study (one strong one, with a name and a number)
8. Pricing (if applicable)
9. FAQ (real objections)
10. Final CTA: one headline, one button
11. Footer

**Section rhythm rules:** alternate dense and airy; alternate left-heavy and right-heavy; include at least one full-bleed visual, one text-only statement section, and one data/proof band. Never repeat the same structure twice in a row. At most one "centered heading + subtitle + grid of cards" block per page.

**App / dashboard:** left or top nav, clear page title and primary action, tables and filters before charts, dense but with 8px rhythm, keyboard shortcuts for frequent actions, designed empty states, skeleton loading, undo over confirm.

**Portfolio / studio:** work is the hero. Minimal UI, big imagery, strong typographic voice, project pages with clear problem → process → result, easy contact.

**Documentation:** left nav, content column 700–760px, right "on this page", excellent code blocks (mono font, copy button, syntax colors that match the brand), search with `/` shortcut.

**E-commerce product page:** large gallery, price + primary CTA visible without scrolling, variant selection clear, shipping/returns near the CTA, real reviews, sticky add-to-cart on mobile.

---

## 15. Responsive

- Breakpoints: 480, 768, 1024, 1280 (min-width, mobile first). Use container queries for components when helpful.
- Fluid type with `clamp()` for headings; fixed sizes for body and UI.
- Gutters 16px mobile, 24px tablet, 32px desktop. No horizontal scroll at any width.
- Test at 360, 390, 768, 1024, 1440, 1920. Check long words, long names, and large system font sizes.
- Hover is an enhancement only; everything works by tap and keyboard.
- Collapse multi-column to a single column in reading order; keep the primary CTA visible without scrolling on mobile; use sticky bottom CTA only for conversion-critical flows.
- Images adapt (`srcset`, `object-fit`), not just shrink.

---

## 16. Dark mode

- Design it, do not invert it. Support `prefers-color-scheme` and a manual toggle.
- Background tinted near-black (`gray-950`, about `#0A0A0B` to `#111113`), not pure `#000`. Raise surfaces by lightness (+3–5% per level) instead of shadows.
- Text near-white (`~#EDEDEF`), muted text at ~65% lightness; check contrast again. Borders `rgba(255,255,255,0.06–0.10)`.
- Slightly reduce accent saturation and increase lightness so it does not vibrate. Re-check semantic colors.
- Shadows nearly invisible; depth via borders and surface lightness. No neon glow.
- Photos may need a slight dim or overlay; logos need dark-mode variants.

---

## 17. Accessibility and performance (part of design quality)

- Semantic HTML first (`header`, `nav`, `main`, `section`, `button` vs `a`). One `h1` per page, ordered headings.
- Contrast per Section 6. Visible focus. Full keyboard path. Skip link. Labels for every control. Alt text that describes purpose (empty `alt=""` for decorative images).
- Do not rely on color alone. Respect reduced motion and text scaling. Hit areas ≥ 44px on touch.
- **Targets:** Lighthouse ≥ 95 in all categories, LCP < 2.5s, CLS ≈ 0, INP < 200ms. Keep JS minimal, avoid layout shift (reserve image and embed space), preconnect and preload critical fonts, compress and lazy-load media.
- Accessibility and speed are what make restraint feel *premium* rather than empty.

---

## 18. Craft details (the last 10% that separates pros)

- Consistent concentric radii; consistent icon stroke; consistent image treatment.
- `text-wrap: balance` on headings; no orphan words; no widows in short copy.
- Hover, focus, active, and disabled states on every interactive element; `cursor: pointer` only on real clickables.
- Branded `::selection` color; subtle custom scrollbar only if it does not harm usability.
- Anchor links offset for the sticky header (`scroll-margin-top`). Smooth scroll only if `prefers-reduced-motion` is not set.
- Real favicon (SVG + PNG), `theme-color`, OG image (1200×630) with a designed layout, correct `<title>` and meta description per page.
- Designed 404 and error pages with a path back.
- Print styles for content pages when relevant.
- Numbers in tables and prices use tabular numerals; currency and dates localized.
- Loading shows skeletons that match final layout. Transitions between states do not jump.
- Nothing is "almost aligned". Check with guides. A 1–2px misalignment is visible to trained eyes and reads as sloppy.

---

## 19. Framework notes

**Tailwind**
- Do not use default palette classes (`indigo-*`, `purple-*`, `slate-*`) raw. Map your tokens in the theme config and use semantic names (`bg-surface`, `text-muted`, `border-default`, `bg-accent`).
- Avoid by default: `shadow-xl`, `shadow-2xl`, `rounded-3xl`, `bg-gradient-to-*`, `backdrop-blur` on cards, `animate-pulse`, `animate-bounce`, `hover:scale-*`.
- Avoid arbitrary one-off values (`mt-[37px]`); use the spacing scale.

**shadcn/ui, Radix, other component kits**
- Default look (zinc/slate neutrals, 0.5rem radius, Inter, default shadows) is itself a tell. Change the font, neutral hue, radius, shadow tokens, and button styling on day one.
- Keep the accessibility behavior; replace the visuals through tokens.

**General**
- Keep tokens in one file (CSS variables or theme config) and import everywhere. Components reference semantic tokens, never raw values.
- Build small primitives first (Button, Input, Card, Badge, Link, Container, Section, Heading, Text), then compose pages from them.

---

## 20. Reference sites: study these, learn principles (not pixels)

Use for pattern-study. Borrow *why* it works, never copy layout, assets, or copy.

- **Stripe** (stripe.com): plain, specific copy; confident typography; scale as proof; one signature visual idea used sparingly; dense information organized with clarity.
- **Linear** (linear.app): the site feels like the product; real interface views instead of illustrations; restrained palette; tight type; consistent icon system; interaction-dense, visually sparse.
- **Vercel** (vercel.com): monochrome discipline; type-led layout; developer-appropriate density; code and product UI as visuals; restraint earned by brand recognition (do not copy it if you have no brand yet).
- **Apple** (apple.com): enormous type, vast whitespace, product as hero, one idea per scroll section, cinematic pacing.
- **Notion** (notion.com): warm neutrals, friendly custom illustration in one style, clear use cases by audience.
- **Airbnb** (airbnb.com): photography-led, familiar search affordance, rounded friendly UI, strong trust signals.
- **Mercury / Ramp** (mercury.com, ramp.com): finance trust through restraint, clear action orientation, polished product visuals.
- **Raycast / Arc / Cal.com**: confident personality inside a disciplined system; tasteful dark UI; clear product demonstrations.
- **Editorial and studio sites** (browse Awwwards, Godly, Land-book, Mobbin): oversized type, asymmetric grids, hairline rules, image-led storytelling.

What these share: **a small system, applied relentlessly, with one distinctive idea and real content.**

---

## 21. Self-review loop and ship checklist

**Loop (mandatory):**
1. Take screenshots at 390, 768, and 1440 px (use Playwright or the browser tool if available). Look at them at 100%, not thumbnail.
2. Run these tests:
   - **Squint test:** blur the screenshot. Can you still see the primary focal point and the primary action?
   - **Grayscale test:** does hierarchy survive without hue?
   - **Logo-swap test:** replace the logo with a competitor's. If the site still "works" unchanged, it is too generic.
   - **Remove-one test:** delete one decorative element per section. Does anything get worse? If not, leave it deleted.
   - **Alignment test:** overlay guides. Do left edges, baselines, and gutters line up?
   - **Spacing test:** any value not on the scale? Any gap that is not clearly larger between groups than within them?
   - **Token count:** ≤ 2 fonts, ≤ 7 sizes, 1 accent hue, ≤ 3 radii, ≤ 4 shadows, ≤ 3 durations.
   - **Keyboard test:** Tab through the whole page; focus is always visible and logical.
3. Write down the 5 biggest problems found, fix them, re-screenshot. Repeat once.

**Ship checklist:**
- [ ] Design brief filled; one direction preset followed; one signature element
- [ ] No item from the Section 2 ban list is present
- [ ] All colors, spacing, radii, shadows, durations come from tokens
- [ ] Neutrals tinted; one accent; contrast verified; works in grayscale
- [ ] Typography tuned (tracking, line-height, measure, balance); real fonts loaded without layout shift
- [ ] One primary action per view; button states complete; no glow or gradient buttons
- [ ] Real copy, no lorem ipsum, no cliché words, no fabricated proof
- [ ] Real or clearly marked placeholder imagery; consistent treatment; hairline image borders
- [ ] Section layouts vary; rhythm of dense and airy sections
- [ ] All states designed: hover, focus, active, disabled, loading, empty, error, success
- [ ] Motion limited to purposeful transitions; reduced motion respected
- [ ] Responsive at 360 to 1920; no horizontal scroll; touch targets ≥ 44px
- [ ] Accessibility checks pass; Lighthouse ≥ 95; CLS ≈ 0
- [ ] Favicon, OG image, titles, meta, 404 done
- [ ] Dark mode designed (if supported), not inverted

**Final rule:** if you are unsure whether to add something, do not add it. Make what exists more precise instead.
