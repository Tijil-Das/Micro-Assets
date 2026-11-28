# ⚡ Skills

> A curated collection of specialized engineering rules, UI/UX design standards, and operational guidelines for AI agents and developers.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](#)

---

## 🎯 Overview

The **Skills** repository houses codified best practices, design constraints, and engineering workflows designed to eliminate the generic drift of AI-generated assets and enforce high craftsmanship standards across projects.

Rather than relying on vague prompts or loose conventions, each skill provides concrete rules, tokens, patterns, and checklists.

---

## 🗂️ Skills Directory

| Skill | Category | Description | Primary Document |
|---|---|---|---|
| **Website Design Rules** | UI/UX & Frontend | Comprehensive design standard and rules for AI agents building web interfaces. Eliminates generic AI design tropes ("AI tells") with strict token scales, typography, layout rhythm, and anti-pattern bans. | [`Website Design.md`](./Website%20Design.md) |
| **Mobile App UI Rules** | Mobile UI/UX | Comprehensive Android & Material 3 (Jetpack Compose) UI/UX design rules for AI agents. Enforces project design briefs, token-only styling, 4dp grid spacing, banned "AI tells", platform polish, accessibility, and pre-delivery checklists. | [`Mobile App UI Rules.md`](./Mobile%20App%20UI%20Rules.md) |

---

## 📖 Featured Skills

### 🎨 [Website Design Rules for AI Agents](./Website%20Design.md)
- **Path:** [`Skills/Website Design.md`](./Website%20Design.md)
- **Focus:** Eliminating generic AI web design output and holding frontend implementations to the standard of top product design studios (Stripe, Linear, Vercel, Apple).
- **Key Sections Covered:**
  - **Core Principles:** Restraint over decoration, hierarchy first, design in grayscale, one signature move.
  - **Hard Bans ("The AI Tells"):** Specific banned aesthetics (neon glows, purple/indigo gradients, float/bounce loops, identical cards, fake proof) with concrete drop-in replacements.
  - **Direction Presets:** Presets for Technical/Minimal, Editorial, Consumer/Warm, and Enterprise interfaces.
  - **Design System Tokens:** Pre-defined palettes, typographic scales, spacing units, radius tokens, and elevation shadows.
  - **Review Loop & Checklist:** Pre-flight checklist to run before marking any UI task as done.

### 📱 [Mobile App UI Rules (Android + Material 3)](./Mobile%20App%20UI%20Rules.md)
- **Path:** [`Skills/Mobile App UI Rules.md`](./Mobile%20App%20UI%20Rules.md)
- **Focus:** Eliminating generic AI mobile app tropes and holding Android (Jetpack Compose + Material 3, or mapped to XML Views / Flutter / React Native) interfaces to top-tier native product standards.
- **Key Sections Covered:**
  - **Project Design Brief & Prime Directives:** Requiring explicit product direction, one job/action per screen, and rationed color.
  - **Banned List ("The AI Tells"):** Strict visual, behavioral, and copy bans (purple baseline `#6750A4`, neon glows, card-in-card, emoji icons, looping animations, hype copy).
  - **4dp Grid, Color, Typography & Shape Tokens:** M3 tonal palettes, Roboto Flex / Figtree type scale, nested radius rule, and `ui/theme/` token-only implementation rules.
  - **States, Motion & Platform Polish:** Built-in loading/empty/error/offline states, spring physics ≤ 400 ms, edge-to-edge, predictive back, TalkBack accessibility, and adaptive window size classes.
  - **Pre-Delivery Checklist & Decision Log:** Mandatory squint/grayscale/robustness audit and persistent §20 decision log.

---

## 📜 License

All files in this folder are licensed under the [MIT License](LICENSE).
