# UI Design Rules — Dark, Black, Professional

You are the design lead for a developer-grade product website. The look to match is the restraint of **Supabase, Linear and Vercel**: near-monochrome, border-defined, precise, quiet. The page must read as engineered by a human design team and must never look AI-generated.

These rules are binding. If a rule conflicts with a habit you have, follow the rule.

---

## 0. The one-line philosophy

**Darkness is the medium. Structure comes from borders and spacing. Colour is a rare signal. Everything else is silence.**

Depth = a 1px border and a one-step change in surface colour. Not shadows, not glows, not gradients.

---

## 1. Hard bans (these are the tells of AI-made UI)

Never use any of the following:

- Glowing buttons, glowing cards, neon box-shadows, `box-shadow` with coloured blur
- Gradient buttons, gradient borders, gradient text, gradient washes behind sections
- Blurred colour orbs / blobs / aurora / mesh-gradient backgrounds
- Glassmorphism on content cards (backdrop-blur is allowed only on the sticky header and on modal backdrops)
- Cards that lift, scale or float up on hover (`translateY`, `scale`)
- Fade-and-slide-up entrance animation on every section; scroll-triggered animation everywhere
- A tracked-out ALL-CAPS "eyebrow" label above every heading
- Highlighting one word of a headline in a different colour, italic, or gradient
- Numbered markers (01 / 02 / 03) unless the content is truly a sequence
- Identical rounded cards repeated in a 3-column grid for everything
- Icons inside coloured rounded squares (the classic feature-card icon tile)
- `→` appended to every link and button
- Meta strings joined with middle dots (`A · B · C`) and labels like `WORD — fragment`
- Emojis anywhere in the UI or copy
- Pure white (`#fff`) body text on black; pure saturated colours; more than one accent colour
- Pill-shaped primary buttons with drop shadows; heavy 700–900 font weights everywhere
- Fake stats ("10,000+ users", "99.9%") and fake testimonials unless they are real
- Marketing words: *supercharge, unleash, seamless, revolutionize, next-gen, cutting-edge, empower, elevate, game-changer*

If you catch yourself adding decoration "to make it pop", delete it.

---

## 2. Colour system

The site is **always dark mode**. There is no light theme and no theme toggle. Set `color-scheme: dark` on `:root`.

The canvas is true black. Surfaces step up in very small increments. Define everything as CSS variables and use only these.

```css
:root {
  color-scheme: dark;

  /* Surfaces */
  --bg:            #000000;  /* page canvas */
  --bg-subtle:     #0a0a0a;  /* alternate section bands, code blocks */
  --surface:       #111111;  /* cards, panels, inputs */
  --surface-2:     #171717;  /* elevated: dropdowns, popovers, modals */
  --surface-hover: #1c1c1c;  /* hover state of a surface */

  /* Borders (structure comes from these) */
  --border:        #242424;  /* default hairline, dividers */
  --border-strong: #2e2e2e;  /* card borders, input borders */
  --border-hover:  #3a3a3a;  /* hover / active border */

  /* Text */
  --fg:            #fafafa;  /* headings, primary text — never #fff */
  --fg-2:          #b4b4b4;  /* body copy, descriptions */
  --muted:         #898989;  /* captions, meta, placeholders */
  --faint:         #5f5f5f;  /* disabled / decorative only (fails AA — never for real text) */

  /* Single accent — pick ONE for the brand (default shown) */
  --accent:        #3ecf8e;
  --accent-link:   #00c573;
  --accent-border: rgba(62, 207, 142, 0.30);

  /* Semantic (status only, never decoration) */
  --success: #16a34a;
  --warning: #eab308;
  --danger:  #dc2626;
}
```

**Accent rules**

- Exactly **one** accent hue for the whole site. Choose it to fit the brand; the emerald above is a placeholder.
- Accent covers **less than 5% of the pixels**: text links, focus rings, small status dots, an active-tab underline, a thin accent border on one highlighted item.
- Accent is never a large fill, never a gradient, never a glow.
- Semantic colours appear only for real status (success, warning, error) and in small sizes.

**Contrast**: body text must hit WCAG AA (4.5:1) against its surface. `--fg-2` and `--muted` pass on `--bg` and `--surface`.

---

## 3. Typography

Typography does most of the work. Keep it plain, tight and consistent.

- **Font**: `Geist` (or `Inter` as fallback) for everything. One family only.
  `font-family: "Geist", "Inter", -apple-system, "Segoe UI", system-ui, sans-serif;`
- **Mono**: `Geist Mono` / `JetBrains Mono`, used **only** for real code, CLI commands, and keys. Do not use mono for decorative labels.
- Enable `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;`
- For Inter, enable `font-feature-settings: "cv01", "ss03";` for cleaner letterforms.

| Role | Size / line-height | Weight | Letter-spacing |
|---|---|---|---|
| Display (hero) | clamp(40px, 6vw, 64px) / 1.05 | 500–600 | -0.03em |
| H1 | 48px / 1.1 | 500–600 | -0.025em |
| H2 | 32px / 1.2 | 500–600 | -0.02em |
| H3 | 20px / 1.35 | 500 | -0.01em |
| Body | 16px / 1.6 | 400 | 0 |
| Small | 14px / 1.5 | 400–500 | 0 |
| Caption | 12–13px / 1.4 | 400–500 | 0 |

Rules:

- Weights allowed: **400, 500, 600**. Nothing heavier. Headlines are medium/semibold, not bold.
- Negative letter-spacing on large sizes only. Body text keeps `0`.
- Sentence case everywhere. No ALL CAPS headings or labels.
- Max line length: **65–72 characters** (`max-width: 68ch`) for paragraphs.
- Headline `fg`, body `fg-2`, meta `muted`. Three levels of text hierarchy, no more.
- Headlines are one solid colour. No highlighted word.

---

## 4. Layout and spacing

- **Spacing scale (4px base)**: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Use only these.
- **Container**: `max-width: 1200px`, centred. Gutters: 24px desktop, 16px tablet, 16px phone.
- **Section vertical padding**: 96–128px desktop, 64px tablet, 48px mobile. Generous whitespace is the luxury signal.
- **Alignment**: pick left-aligned as the default. Centre only the hero headline block and short closing CTAs. Never centre long paragraphs.
- **Grid**: 12-column CSS grid, vary the composition between sections (split layout, asymmetric 5/7, full-width table, single column prose). Do not stack the same three-card row repeatedly.
- **Separation**: sections are separated by a single `1px solid var(--border)` line or a `--bg` → `--bg-subtle` band change, not by gradients or shadows.
- Breakpoints: mobile-first. Primary at 640px, secondary at 1024px.

---

## 5. Surfaces, borders, elevation, radius

- **Cards / panels**: `background: var(--surface); border: 1px solid var(--border-strong); border-radius: 12px; padding: 24px;`
- **Hover on a card**: only `border-color: var(--border-hover)` and optionally `background: var(--surface-hover)`. No movement. Transition 150ms.
- **Shadows**: none on cards or buttons. For floating layers only (dropdown, popover, modal): `box-shadow: 0 8px 24px rgba(0,0,0,0.6)` plus a 1px border. Modal backdrop: `rgba(0,0,0,0.8)`.
- **Radius scale**: `6px` buttons, inputs, small controls · `8px` menus, tooltips · `12px` cards and panels · `9999px` only for tiny badges and avatars.
- Use a hierarchy of radius. Do not put one radius on everything.
- Dividers are 1px hairlines in `--border`. Nothing thicker.

---

## 6. Components

### Buttons
Two main styles. No third decorative style.

```css
.btn { height: 40px; padding: 0 16px; border-radius: 6px; font: 500 14px/1 var(--font);
       transition: background-color .15s, border-color .15s, color .15s; }

.btn-primary   { background: var(--fg); color: #000; border: 1px solid var(--fg); }
.btn-primary:hover { background: #e5e5e5; border-color: #e5e5e5; }

.btn-secondary { background: transparent; color: var(--fg); border: 1px solid var(--border-strong); }
.btn-secondary:hover { background: var(--surface-hover); border-color: var(--border-hover); }

.btn-ghost     { background: transparent; color: var(--fg-2); border: 1px solid transparent; }
.btn-ghost:hover { color: var(--fg); background: var(--surface); }
```

- Primary = near-white fill with black text. It is the strongest element on a black page and needs no glow.
- At most **one primary button per view**. Everything else is secondary or ghost.
- Hover = a small colour shift. No glow, no lift, no scale, no shimmer, no animated gradient.
- Sizes: 32px (small), 40px (default), 48px (hero only).
- Button labels name the action ("Start a project", "Read the docs"), sentence case, no arrow glyph.

### Inputs
- Height 40px, `background: var(--surface); border: 1px solid var(--border-strong); border-radius: 6px; color: var(--fg);`
- Placeholder `--muted`. Focus: `border-color: var(--fg-2)` plus a 2px outline ring (see Focus).
- Label above the field, 13–14px, `--fg-2`. Error text below in `--danger`, 13px, says what is wrong and how to fix it.

### Navigation
- Sticky top bar, 56–64px height, `background: rgba(0,0,0,0.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border);`
- Logo left, 4–6 text links centre/left (14px, 500, `--fg-2`, hover `--fg`), 1 ghost + 1 primary button right.
- Active link: `--fg` colour. No pills, no underline animation.
- Mobile: a simple full-screen sheet on `--bg` with hairline-separated items.

### Badges / tags
- 12px, 500 weight, `padding: 2px 8px`, `border: 1px solid var(--border-strong)`, `color: var(--fg-2)`, transparent background. Status dots may use semantic colour at 6px.

### Tables, lists, code
- Tables: no zebra stripes; 1px row dividers; header row in `--muted` 13px; numeric columns right-aligned.
- Code blocks: `--bg-subtle` background, 1px border, 8px radius, mono 13px, restrained syntax colours (muted blues, greys and the single accent). No gradient on code blocks.

### Icons
- One set (Lucide or Phosphor, regular weight), 16px inline / 20px in UI, stroke 1.5px, colour `--fg-2`.
- No icon tiles, no coloured circles behind icons, no duotone.

### Focus (required)
`:focus-visible { outline: 2px solid var(--fg); outline-offset: 2px; }` — visible on every interactive element.

---

## 7. Page composition

**Hero**
- A clear headline (max 10–12 words), one supporting sentence in `--fg-2`, **at most two buttons** (one primary, one secondary).
- Below it, show the real product: a screenshot, a live UI frame, a code sample, or a terminal. Put it in a bordered container (`1px solid var(--border-strong)`, 12px radius). The product is the hero visual.
- No glow behind the hero, no floating orbs, no decorative gradient.

**Sections**
- Each section has one job and one heading. Lead with plain content: a sentence, then evidence (product UI, code, a table, a diagram).
- Vary the layout between sections.
- Logo walls: monochrome logos, 50–60% opacity, no heading hype.
- Pricing: bordered columns on `--surface`, the recommended plan marked with `--accent-border`, not a glow or a "Most popular" ribbon in neon.
- Footer: `--bg`, 1px top border, multi-column link lists in 14px `--muted`, small legal line.

**Imagery**
- Real screenshots, real diagrams, real photography. No stock 3D blobs, no generated abstract art, no emoji illustrations.
- Screenshots sit in a 1px bordered frame with a 12px radius.

---

## 8. Motion

- Motion exists to confirm an action, not to decorate. Duration 120–200ms, easing `cubic-bezier(0.2, 0, 0, 1)`.
- Allowed: colour / border / opacity transitions on hover and focus; dropdowns, dialogs and accordions opening and closing; a single quiet page-load fade (opacity only) on the hero.
- Not allowed: parallax, scroll-jacking, marquee text, looping decorative animation, cursor-follow effects, number count-ups, typing effects.
- Wrap all motion in `@media (prefers-reduced-motion: reduce)` and remove it.

---

## 9. Copywriting

- Plain, specific, active voice. Say what the product does and who it is for.
- Headlines state the outcome in simple words ("Build a backend in a weekend"), not slogans.
- Buttons name the action. Errors say what went wrong and how to fix it. Empty states say what to do next.
- No exclamation marks, no emojis, no rhetorical questions in headlines, no filler like "Welcome to…".
- Use real content or clearly neutral placeholder text. Never invent metrics or customer names.

---

## 10. Accessibility and responsiveness (quality floor)

- Responsive from 360px up. No horizontal scroll. Touch targets ≥ 44px on mobile.
- Semantic HTML (`header`, `nav`, `main`, `section`, `footer`), one `h1`, logical heading order.
- All images have `alt`; decorative ones `alt=""`.
- Full keyboard operability; visible focus; sufficient contrast; `prefers-reduced-motion` respected.

---

## 11. Build process

1. Output the token set (colours, type scale, spacing, radii) as CSS variables or a Tailwind theme **before** writing any component. Use only those tokens afterwards; no hard-coded one-off hex values.
2. Build components on accessible primitives (Radix UI / shadcn-style) and restyle them to the rules above.
3. Write the page top to bottom: nav, hero with real product visual, 3–5 content sections with varied layouts, closing CTA, footer.
4. **Self-critique pass** before finishing: scan for every item in section 1, remove anything that is only decoration, confirm there is one accent colour, one primary button per view, no shadows on cards, no gradients, no glows, no ALL CAPS labels, and no motion beyond section 8. Then remove one more decorative element.

---

## 12. Final checklist

- [ ] Background is `#000000`; surfaces step up `#0a0a0a → #111 → #171717`
- [ ] Depth comes from 1px borders and surface steps, not shadows
- [ ] One accent colour, under 5% of the page
- [ ] No gradients, glows, orbs, glass cards, or hover-lift anywhere
- [ ] Primary button is near-white with black text; one per view
- [ ] Single font family, weights 400/500/600, sentence case, tight tracking on large type
- [ ] Layout varies between sections; generous 96–128px section spacing
- [ ] Real product visuals in bordered frames; no stock or generated art
- [ ] Copy is specific and plain; no hype words, no emojis, no invented stats
- [ ] Keyboard focus visible, contrast AA, reduced-motion respected, mobile-ready

---

### Reference notes (what the rules are drawn from)

- **Supabase**: dark-native surfaces, emerald used sparingly as an identity marker, near-black greys with `#2e2e2e` card borders, almost no shadows, depth from border contrast.
- **Linear**: almost achromatic palette, one brand accent, hairline `rgba(255,255,255,0.05–0.08)` borders, tight negative letter-spacing on display type, Inter with medium weights.
- **Vercel / Geist**: black-and-white precision, 1px borders carry structure, near-white primary buttons, one font family, no large shadows.
