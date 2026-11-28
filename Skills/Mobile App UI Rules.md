# rules.md: Android App Design Rules (UI + UX)

> **For AI agents.** Read this file fully before creating or changing ANY UI. These rules override your defaults. Your defaults (purple gradients, glow, cards in cards, emoji icons, "Welcome back 👋") are exactly what makes AI-built apps look AI-built.
>
> Written for Jetpack Compose + Material 3. If the project uses XML Views, Flutter or React Native, keep every principle and map the tokens 1:1.

---

## 0. How to work

1. **Priority order:** Project Brief (§1) → Prime Directives & Banned List (§2–3) → everything else. If a request conflicts with this file, do what was asked, but flag the conflict in one line.
2. **Before building a screen**, write 3 lines as a code comment: (a) the user's single goal on this screen, (b) the one primary action, (c) what is read 1st / 2nd / 3rd.
3. **Tokens only (§17).** Never invent a color, size, radius, or duration inline.
4. **Build states with the screen**: loading, empty, error, offline. Not "later".
5. **Run the checklist (§19) before delivering.** Fix failures; don't just report them.
6. **When unsure, remove.** Professional UI is mostly restraint. Never add decoration, animation, or features that were not requested.
7. **Log decisions** in §20 so the next agent session stays consistent.

---

## 1. Project Design Brief (the human fills this once; agents must not invent it)

Design direction is a human decision. Vague direction produces the statistical average of every app, which is the "AI look". If this section is empty, propose a filled brief with one-line reasons, record it here, then proceed.

```
Product one-liner:
Primary user + context of use (one-handed? outdoors? at night? in a hurry?):
Personality: 3 adjectives it IS / 2 it must NEVER be      (e.g. calm, precise, warm / never loud, childish)
Brand color (hex):                                          (NOT purple/indigo unless deliberately chosen)
Reference apps (2-3) and exactly what to borrow from each:
Themes: light | dark | both        Dynamic color (Material You): off | opt-in toggle
Typeface (one family):
Shape character: crisp (4-8dp) | balanced (8-16dp) | soft (16-28dp)
Density: comfortable | compact
Hero moments (max 1 per flow, where extra expressiveness is allowed):
```

**Defaults if the human has not decided:** both themes, dynamic color off, balanced shape, comfortable density, tinted neutrals + ONE non-purple brand hue (§5), Roboto Flex or Figtree.

---

## 2. Prime Directives

1. **One job per screen, one primary action per screen.** One filled button per screen/region.
2. **Hierarchy comes from type size, weight and spacing**, not from borders, boxes, shadows, or color.
3. **Color is rationed.** Neutrals cover ~90% of the surface. One brand hue. Color always carries meaning.
4. **Content is the hero** (photos, numbers, the user's own data). Chrome recedes.
5. **Consistency beats cleverness.** The same thing looks and behaves the same everywhere.
6. **Space is a material.** Group by proximity; separate with whitespace. Use dividers and containers only when spacing cannot do the job.
7. **Feedback within ~100 ms on every touch.** Motion explains cause and effect; it never decorates.
8. **Design every state**, not just the happy path.
9. **Details are the product:** grid alignment, optical balance, real copy, real data.
10. **Accessible by default.** Legible, well-spaced, high-contrast UI is also what reads as "professional".

---

## 3. Banned list (the AI tells). NEVER ship these

**Visual**
- Purple/indigo/violet as a default brand, including the Material baseline seed `#6750A4`; any purple→blue or purple→pink gradient.
- Gradient backgrounds, gradient buttons, gradient text, aurora/mesh blobs.
- **Glow of any kind:** neon box-shadows, colored shadows, outer glow on buttons/cards/icons, pulsing or "breathing" glow, shine/shimmer sweeps across buttons.
- Glassmorphism / frosted blur as the default surface.
- Card-in-card. Card + border + shadow + big radius stacked together. Every item wrapped in a card.
- Emoji used as icons or decoration (🚀 ✨ 🔥 🎯). Sparkle ✨ on features that are not AI.
- 3D blobs, floating abstract shapes, generic stock/AI illustrations.
- Everything pill-shaped, or everything 24dp-rounded, or mixed radii with no system.
- ALL-CAPS buttons. Bold on everything. 4+ font weights. Text under 12sp.
- Light-gray-on-white text below 4.5:1 contrast.
- "Centered hero + three feature cards" layouts. Dashboards of fake stats.
- Rows of icons each inside its own pastel tinted circle.
- Unthemed Material defaults (baseline purple, default FAB on every screen).
- Hamburger drawer as primary phone navigation. 6+ bottom-nav items.

**Behavior**
- Looping, bouncing, pulsing, or wobbling animations (except real activity indicators).
- Any animation longer than 500 ms (except a deliberate hero moment). Bounce on every tap. Gimmicky parallax.
- Confirmation dialogs for reversible actions (use Undo instead).
- Modals on app start (rate-us, newsletter, upsell).
- Full-screen spinners (use skeletons). Toasts for errors that need action.
- Dark patterns: fake urgency, hidden close buttons, guilt-trip copy, pre-checked consent.

**Copy**
- "Welcome back! 👋", "Oops!", "Something went wrong", "Seamless", "Supercharge", "Unlock", "Elevate", "Revolutionize", "Powerful", "Effortless", "All-in-one".
- Lorem ipsum, "John Doe", "Item 1", suspiciously round fake numbers ("1,234", "$99.99" everywhere).
- Exclamation marks as a personality. Title Case On Every Button.

---

## 4. Layout, grid and spacing

- **4dp grid.** Spacing tokens only: `4, 8, 12, 16, 24, 32, 48`. No 5, 7, 10, 15, 18, 22.
- **Screen margins:** 16dp on compact width (<600dp); 24dp on medium and up.
- **Between sections:** 24-32dp. **Between related items:** 8-12dp. **Label-to-value:** 4dp.
- **One left edge per screen.** Text, icons, and section headers align to the same line. Misaligned edges are the #1 amateur tell.
- **Touch targets ≥ 48×48dp**, with ≥ 8dp between adjacent targets. A 24dp icon sits inside a 48dp target.
- **List rows:** min height 56dp (1 line), 72dp (2 lines), 88dp (3 lines). Don't shrink them to fit more.
- **Thumb zone:** primary actions in the lower half of the screen (bottom bar, bottom sheet, bottom-anchored button); information at the top. Destructive actions never sit where the thumb rests by default.
- **Container padding:** pick one inner padding per container type (usually 16dp) and use it everywhere.
- **Whitespace first.** If a screen looks "off", add or fix spacing before adding any element.
- Long text: 60-75 characters per line max; on wide screens constrain content width (~840dp) or use list-detail.
- Never rely on fixed heights for text containers; let content and font scale drive size.

---

## 5. Color

**Method.** Choose one seed hue → generate a Material 3 tonal palette → map to roles. Never hand-pick random hexes per screen.

- **Brand hue:** one hue only. Primary ≈ tone 40 (light theme) / tone 80 (dark theme).
- **Neutrals:** tinted a few percent toward the brand hue (warm or cool), never dead gray. `surface` ≈ tone 98 light / tone 6 dark. Avoid pure `#FFFFFF` backgrounds and pure `#000000` + pure white text pairs (harsh, causes halation).
- **Text:** `onSurface` ≈ tone 10 (light) / 90 (dark) for primary; `onSurfaceVariant` ≈ tone 30 / 80 for secondary. Only 2 text colors on most screens.
- **Accent budget:** brand color on ≲10% of any screen: primary button, selected nav indicator, key figures, active toggles. Not on headers, borders, icons, and backgrounds all at once.
- **Semantic colors:** success (green), warning (amber), error (red). Reserved for status only. Always paired with an icon or text, never color alone.
- **Layering with surfaces:** use `surfaceContainerLowest → surfaceContainerHighest` to separate layers (background → section → card → dialog). Tonal steps, not shadows or borders.
- **State layers:** hover 8%, focus 10%, pressed 10%, dragged 16% of the content color over the container. Disabled: content 38% opacity, container 12%.
- **Gradients are allowed ONLY for:** (a) a scrim over photos so text stays legible; (b) charts/data; (c) a single-hue tonal shift of ≤ 1-2 tone steps on one hero surface. Never two hues. Never on buttons, text, or whole-screen backgrounds.
- **Dark theme is its own design**, not an inversion: lighter, slightly desaturated brand tones; depth from lighter surfaces instead of shadows; no pure-white large text blocks.
- **Dynamic color:** OFF by default so the brand stays recognizable (Spotify and Airbnb are fixed-brand; Google apps are dynamic). If the brief says opt-in, offer a Settings toggle with a brand fallback.
- **Data viz:** one hue (sequential) or neutral gray + one highlight color. Max 5 categorical colors. Never encode meaning by color alone.
- **Personality starting points (inspiration, not mandate):** trust/finance → deep teal, forest, ink navy; energy/fitness → vermilion, amber; calm/wellness → sage, sea-glass, warm sand; editorial/creative → warm neutrals + one saturated accent (tomato, cobalt); premium → near-black + warm off-white + one restrained accent.

---

## 6. Typography

- **One typeface family.** Roboto Flex is the native-feeling default (variable font, used by Material 3 Expressive). Alternatives: Figtree, Manrope, Source Sans 3, Public Sans. A second display face is allowed for brand moments only.
- **Weights:** 400 body, 500 labels/titles, 600-700 sparingly for display/key numbers. Never more than 3 weights.
- **Use the M3 scale (sp / line height).** Use only 6-7 styles per app:

| Role | Size/Line | Use |
|---|---|---|
| displayLarge / Medium / Small | 57/64, 45/52, 36/44 | Hero numbers, splash-level only |
| headlineLarge / Medium / Small | 32/40, 28/36, 24/32 | Screen titles, big section headers |
| titleLarge | 22/28 | App bar / dialog titles |
| titleMedium / Small | 16/24, 14/20 | Card titles, list headlines |
| bodyLarge | 16/24 | Main reading text |
| bodyMedium / Small | 14/20, 12/16 | Secondary text, captions |
| labelLarge / Medium / Small | 14/20, 12/16, 11/16 | Buttons, chips, nav labels |

- **Hierarchy via contrast of size AND weight**, not decoration. The title should be unmistakably larger or heavier than its body; avoid "everything 14sp medium gray".
- **Sizes in `sp`** so system font scale works. Layouts must survive 200% font scale without clipping.
- **Line height ≥ 1.4×** for body. Scripts such as Bengali, Devanagari, Arabic need ≥ 1.5-1.6× and a tested fallback (Noto Sans <Script>); never clip matras, ascenders or descenders.
- **Numbers:** tabular figures (`fontFeatureSettings = "tnum"`) wherever digits align or update (prices, timers, balances, tables). Big key number + small unit/label.
- **Sentence case** everywhere. Don't add letter-spacing to body; keep M3 defaults. ALL-CAPS only for tiny labels, with +0.5sp tracking.
- Max 2-3 lines for titles in lists; truncate with ellipsis, never shrink font to fit.

---

## 7. Shape, elevation and depth

- **Radius scale (dp):** `0, 4, 8, 12, 16, 20, 28, full`. Pick the shape character in the brief and use 2-3 values consistently (e.g., 12 for cards/inputs, 28 for sheets/dialogs, full for buttons/chips/FABs only if chosen).
- **Nested radius rule:** inner radius = outer radius − padding. Inner corners that are rounder than outer corners look cheap.
- **Elevation levels:** 0 / 1 / 3 / 6 / 8 / 12 dp. Most UI sits at level 0, separated by tonal surface color. Shadows are only for things that truly float: FAB, menus, bottom sheets, dialogs.
- **Shadows:** neutral black, low alpha (≲ 15%), soft. Never colored, never glowing.
- **Dividers:** 1dp `outlineVariant`, only when spacing cannot separate. Default is no divider.
- **Borders:** 1dp `outlineVariant`, only on genuinely outlined components (outlined buttons/fields). Don't combine border + shadow + tonal fill on the same element.
- **Blur:** not a default surface style. Reserve it for rare system-like overlays, and only when legibility holds (and performance is verified).

---

## 8. Icons and imagery

- **One icon set:** Material Symbols (Rounded or Outlined), one weight (400), 24dp. Use *filled* only to indicate selected/active state. Never mix libraries.
- **Icon color** = `onSurfaceVariant` by default; brand/primary only for the active state or one key action.
- **Icon-only buttons** need a `contentDescription` and a clear universal glyph; otherwise add a text label.
- **No emoji in UI chrome.** Ever.
- **Photography/imagery:** real or properly custom. Fixed aspect ratios (16:9, 4:3, 1:1, 3:4), one corner radius token, edge-to-edge in hero spots. Reserve image size to avoid layout shift; show dominant-color or blurhash placeholder.
- **Text over images** requires a scrim gradient (dark to transparent) and ≥ 4.5:1 contrast.
- **Illustration:** only if it's consistent in style, purposeful (empty states, onboarding), and not generic. When in doubt, use type and whitespace instead.
- **App icon:** adaptive icon (foreground + background) plus a monochrome layer for themed icons (Android 13+). Notification small icon: monochrome vector.

---

## 9. Components

### Buttons
- **Hierarchy:** Filled (1 per screen/region) → Tonal (secondary) → Outlined (tertiary) → Text (low emphasis).
- **Size:** 40dp visual height (M3), 48dp touch target. Full-width primary CTA at screen bottom may be 56dp.
- **Label:** `labelLarge`, sentence case, verb + object ("Save changes", "Add habit"). No all-caps, no trailing "!".
- **Shape:** use the single app-wide button shape token.
- **Press feedback:** ripple/state layer, optionally a subtle scale to ~0.97 with a spring. **No glow, no shimmer, no pulse, no gradient fill, no colored shadow.**
- **Loading:** replace the label with a 20dp progress indicator, keep the button width fixed, disable re-taps.
- **Disabled:** 38% content opacity; only disable when you can't explain why. Prefer enabled + inline validation message.
- **Destructive:** error color only after the user intent is clear; prefer Undo to confirmation.

### Text fields
- Persistent labels (outlined or filled; choose one app-wide), 56dp height, helper text under the field.
- **Never use a placeholder as the label.**
- Validate on blur / submit, not every keystroke. Error = message + icon + color (never color alone).
- Correct `KeyboardType`, `ImeAction` (Next/Done), autofill hints, password show/hide, and `imePadding()` so the CTA stays visible above the keyboard.

### Lists and cards
- **Prefer list rows** for dense or homogeneous data. Use **cards only** for self-contained objects with multiple elements or actions (a listing, a post, a media item).
- **Never nest cards.** Never put a card in a card-colored section with a border and a shadow.
- Row anatomy: leading (24dp icon / 40dp avatar / 56dp thumbnail) → headline → supporting text (≤ 2 lines, `onSurfaceVariant`) → trailing meta/action. No dividers by default.
- Swipe actions must be undoable. Long lists use stable keys and contentPadding for insets.

### Navigation
- **Bottom navigation: 3-5 destinations**, icon + label always visible, filled icon + indicator for selected, badge only for real counts. Re-tapping the active tab scrolls to top.
- **Top app bar:** small for detail screens (back arrow), large/collapsing title for top-level lists. ≤ 3 action icons, extra go in overflow. Tonal color change on scroll.
- Top-level destinations show no back arrow. Depth ≤ ~3 levels.
- Tabs only for sibling views of the same content. Navigation rail on ≥ 600dp width.
- **FAB:** only for the screen's single primary "create" action. Not on every screen.

### Dialogs, sheets, snackbars, chips
- **Dialog:** only for critical decisions needing a response; ≤ 2 actions; destructive action names the verb ("Delete 3 photos").
- **Bottom sheet:** secondary content, filters, pickers, action menus; drag handle; top radius per token.
- **Snackbar:** 1 line (2 max), at most one action (Undo/Retry), 4-8 s, positioned above the nav bar/FAB. Use for confirmations, not blocking errors.
- **Chips:** for filters/suggestions only (32dp tall). Not decoration, never a rainbow.
- **Switch vs checkbox:** Switch = immediate effect; checkbox = needs a Save/Submit.

---

## 10. Motion and haptics

- **Purpose test:** every animation must (1) show where something came from/went, (2) confirm a touch, or (3) smooth a state change. If it fails all three, delete it.
- **Spatial changes** (position, size, shape): physics **springs**, damping ≈ 0.8-1.0 (little to no bounce). Slightly bouncier (≈ 0.6-0.7) only in a declared hero moment.
- **Effects** (color, opacity): short tweens, 100-200 ms, standard easing.
- **Durations:** feedback ≤ 100 ms · small 150 ms · component 250-300 ms · full-screen 300-400 ms · exits ~25% faster than enters. Nothing over 500 ms.
- **Shared-element / container transforms** for list → detail and FAB → screen. They build spatial understanding.
- **Predictive back:** support the system back gesture with proper callbacks so the preview animation works.
- **Respect system animation scale** (0 = no animation). Never convey information only through motion.
- **No stagger gimmicks** beyond ≤ 30 ms steps on at most ~5 items. No infinite loops except genuine progress indicators.
- **Haptics:** use platform haptic constants sparingly (toggle, confirm/success, reject, long-press, picker tick). Not on every tap.
- **Success moments** (task done, goal reached, payment sent) deserve the app's one polished flourish. Everything else stays calm.

---

## 11. States (build with every screen)

| State | Rule |
|---|---|
| **Loading** | Skeleton matching the final layout (reserve sizes, no layout shift). Subtle, slow, low-contrast shimmer at most. Spinner only for short in-place actions. Appear within ~100 ms. |
| **Empty** | One simple icon or illustration, a one-line explanation of what belongs here, one action that fills it. No jokes. |
| **Error** | Say what happened + what to do + a Retry. Keep the user's input. Inline for field errors; banner/snackbar for transient; full-screen only if nothing can render. |
| **Offline** | Show cached content with a quiet "Offline" indicator; queue actions; auto-retry on reconnect. |
| **Partial / slow** | Show what you have, then fill in. Optimistic updates with rollback + message on failure. |
| **Success** | Quiet confirmation (snackbar, checkmark morph, haptic). Not a blocking modal. |
| **Permissions** | Ask in context, right when needed, with a one-line reason and a graceful "not now" path. |

---

## 12. Content and microcopy

- **Specific, short, human.** Say what it is and what happens. Write like a careful person, not a brochure.
- **Buttons:** verb + object. Sentence case.
- **Errors:** cause + fix ("Couldn't reach the server. Check your connection and try again.").
- **Empty states / onboarding:** state the benefit in one line; no hype words (see §3).
- **Sample data** must be realistic and varied: real-looking names, uneven numbers, long and short strings, missing optional fields. Test with extremes (very long names, 0 items, 10,000 items).
- **Numbers/dates/currency:** formatted by locale; relative dates for recent items ("2 h ago"), absolute for old ones.
- **Localization:** text can grow 30-40%; support RTL mirroring; never hard-code strings in composables (`strings.xml`).
- Exclamation marks only for genuine celebration, max one.

---

## 13. Psychology → rules (why these rules make an app feel good)

| Principle | Rule applied |
|---|---|
| Aesthetic-usability effect | Pixel-level alignment and consistency make an app feel reliable. Sweat the grid. |
| Von Restorff (isolation) | Only the one thing that matters is visually different: one filled button, one accent. |
| Hick's law | Fewer choices = faster decisions: ≤ 5 nav items, 1 primary + 1 secondary action, progressive disclosure. |
| Fitts's law / thumb zone | Big (≥ 48dp), reachable, bottom-anchored primary actions. |
| Gestalt (proximity, common region) | Group by spacing; related things are close, unrelated things are far. |
| Doherty threshold | Respond in ~100 ms; skeletons and optimistic UI make waits feel shorter. |
| Peak-end rule | Invest polish in the success moment and the end of each flow. |
| Goal-gradient / Zeigarnik | Show progress in multi-step flows; show how close the user is to done. |
| Recognition over recall | Visible labels, remembered inputs, recent items, sensible defaults. |
| Jakob's law | Follow Android conventions (back, bottom nav, sheets) unless there's a strong reason. |
| Trust | Consistency, reversibility (Undo), honest copy, no dark patterns, minimal permissions. |
| Emotional design | Personality lives in a few chosen moments (empty states, success, onboarding), not sprayed everywhere. |

---

## 14. Android platform polish

- **Edge-to-edge:** call `enableEdgeToEdge()`; draw behind transparent system bars; use `Scaffold` inner padding / `WindowInsets.safeDrawing`; scrolling content goes under the nav bar via `contentPadding`. (Enforced for apps targeting SDK 35+; the opt-out stops working at SDK 36, so build for it.)
- **System bar icons** must contrast with the content behind them in both themes.
- **Predictive back:** use `BackHandler` / `PredictiveBackHandler` or the nav library's support; never intercept `onBackPressed()` (it's no longer called when targeting SDK 36 on Android 16).
- **Splash:** use the SplashScreen API: static brand icon on a plain background, no custom animated splash.
- **Gestures:** support swipe-to-refresh, swipe-back, and long-press where users expect them.
- **Sign-in:** Credential Manager / passkeys; follow official third-party brand button guidelines exactly.
- **Notifications:** monochrome small icon, brand accent color, concise title/body, correct channels.
- **Dark mode, font scale, display size, RTL, and rotation** must all work. Don't lock orientation (on Android 16 large screens ignore the lock anyway).

---

## 15. Accessibility (non-negotiable)

- **Contrast:** text ≥ 4.5:1 (≥ 3:1 for large text ≥ 18sp or bold ≥ 14sp); UI components and icons ≥ 3:1.
- **Touch targets** ≥ 48dp with ≥ 8dp spacing.
- **TalkBack:** meaningful `contentDescription` for informative images/icons; `null` for decorative; merge semantics for rows; logical focus order; use roles (`Role.Button`, `Role.Switch`...) on custom clickables.
- **Never rely on color alone** (add icon/text/shape).
- **Font scale to 200%** and **display size large** without clipping or overlapping.
- Run Accessibility Scanner and Compose accessibility checks before delivery.

---

## 16. Adaptive layouts

- **Window size classes:** Compact < 600dp, Medium 600-839dp, Expanded ≥ 840dp. Phone-first, but never phone-only.
- Compact: bottom nav, single pane. Medium+: navigation rail, list-detail / two panes. Expanded: add a third pane or more whitespace, not stretched content.
- Constrain reading width; don't stretch buttons or text fields across a tablet.
- Test on a small phone (360×640dp), a large phone, a foldable, and a tablet.

---

## 17. Implementation rules (Jetpack Compose)

- **One source of truth:** `ui/theme/` (Color.kt, Type.kt, Shape.kt, Tokens.kt, Theme.kt). Composables read from `MaterialTheme.colorScheme / typography / shapes` and the token objects.
- **Never** hard-code `Color(0x…)`, raw `dp` spacing, raw `sp`, radii, or animation durations inside screens or components. Only token files contain raw numbers.
- **Build the shared components once** and reuse them: `AppButton`, `AppTextField`, `AppCard`, `AppListItem`, `EmptyState`, `ErrorState`, `LoadingSkeleton`, `AppTopBar`. Screens compose those; they don't restyle Material primitives ad hoc.
- Don't copy a Material component and re-skin it per screen. Theme it globally.
- Every composable ships with `@Preview`s for light, dark, and 1.3× font scale; screens also have loading/empty/error previews.
- `LazyColumn`/`LazyGrid` with stable `key`s; images via Coil with explicit sizes; hoist state; avoid layout work in scroll paths.

```kotlin
// ui/theme/Tokens.kt: the only place raw numbers live
object Space { val xs = 4.dp; val sm = 8.dp; val md = 12.dp; val lg = 16.dp; val xl = 24.dp; val xxl = 32.dp; val xxxl = 48.dp }

object Motion {
    const val Fast = 150; const val Medium = 250; const val Slow = 350
    fun <T> spatial() = spring<T>(dampingRatio = 0.9f, stiffness = Spring.StiffnessMedium) // position, size, shape
    fun <T> effects() = tween<T>(durationMillis = Fast, easing = FastOutSlowInEasing)       // color, alpha
}

// Press feedback: state layer from the component + a subtle spring scale. No glow.
fun Modifier.pressScale(source: InteractionSource, pressedScale: Float = 0.97f) = composed {
    val pressed by source.collectIsPressedAsState()
    val s by animateFloatAsState(if (pressed) pressedScale else 1f, Motion.spatial(), label = "press")
    graphicsLayer { scaleX = s; scaleY = s }
}
```

---

## 18. Reference apps: what to borrow

| App | Borrow this |
|---|---|
| **Google Photos / Maps / Keep / Pixel apps** (Material 3 Expressive) | Best native reference: tonal surfaces, large titles, shape contrast, spring motion, predictive back. |
| **Spotify** | Content art supplies the color; single accent; bold type hierarchy; persistent mini-player; dense lists that still breathe. |
| **Airbnb** | Photography-first; edge-to-edge imagery; one accent; concise type; bottom-sheet filters; calm motion. |
| **Revolut / Monzo / Wise / Cash App** | Number-forward hierarchy: huge key figure, tabular digits, restrained palette, clear transaction rows, haptics on confirmation. |
| **Duolingo / Headspace / Calm** | Personality concentrated in specific moments (characters, celebrations) around a disciplined single-action core loop. Peak-end done well. |
| **Things 3 / Todoist / Bear** | Quiet near-monochrome + one accent, generous whitespace, tiny purposeful animations, gestures. |
| **Linear / Notion / Arc** | Neutral palettes, rigorous alignment and type, speed as a design feature. |
| **Google Play "Best of" winners** (e.g., Partiful, Focus Friend, Notability, Strava, Pocket Casts) | Study what they do on their primary screen: one clear job, uncluttered hierarchy, and a distinctive but disciplined identity. |

Pattern common to all of them: **a small token set, one accent, strong type hierarchy, real content, calm motion, obsessive consistency.** None of them look like a template, because each made deliberate choices (§1).

---

## 19. Pre-delivery checklist (agents MUST run this)

**Look**
- [ ] **Squint test:** blur your eyes. Is there one clear focal point and a clear 1st/2nd/3rd reading order?
- [ ] **Grayscale test:** does hierarchy survive without color?
- [ ] **One primary action** (one filled button/FAB) per screen.
- [ ] Brand color covers ≲10% of the screen; no gradients, glow, glass, or emoji (§3 scan).
- [ ] Only tokens used: spacing on 4dp grid, radii from scale, colors from roles, ≤ 3 weights, ≤ 7 text styles.
- [ ] Everything aligns to one left edge; nested radii follow the rule; no card-in-card.
- [ ] Remove-it test: delete each decorative element. If nothing is lost, leave it deleted.

**Behavior**
- [ ] Loading, empty, error, offline, and success states all designed and previewed.
- [ ] Press feedback on every tappable element, with no glow; motion has a purpose and ≤ 400 ms.
- [ ] Back gesture works, edge-to-edge insets are correct, and the keyboard doesn't hide the CTA.
- [ ] Destructive actions have Undo or a clear confirmation.

**Robustness**
- [ ] Works in dark theme, at 1.3× and 2× font scale, at 360dp width, and on tablet/foldable.
- [ ] Contrast ≥ 4.5:1 text / 3:1 UI; targets ≥ 48dp; TalkBack labels present.
- [ ] Realistic sample data tested with long strings, empty lists, and large counts.
- [ ] Copy is specific, sentence case, hype-free; strings externalized.

---

## 20. Decision log (agents append here)

```
YYYY-MM-DD | decision | reason
```
