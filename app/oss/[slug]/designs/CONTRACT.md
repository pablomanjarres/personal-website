# Per-project OSS hero — design contract

You are redesigning **one** `/oss/<slug>` landing hero. This folder is the seam.
Everything below is a hard boundary: the fonts, the dispatcher, the page, and the
OG route are already wired by the scaffolding agent and shared across all 8
projects. Stay inside your one file (+ its co-located CSS module) and the site
stays green.

---

## 1. Your file + signature (locked)

Edit **only** your stub:

```
app/oss/[slug]/designs/<slug>.tsx
```

where `<slug>` is one of:
`cortex`, `band-of-agents`, `content-pipeline`, `forge`, `archgraph`,
`omegahack`, `localhost-mirror`, `lumen-frontier`.

The default export **must** keep this exact shape — the registry imports it by
default export and the page renders `<Design hero={h} slug={slug} />`:

```tsx
"use client";

import type { Hero } from "../../heroes";
// ...your imports (CSS module, sub-components, hooks)...

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  // ...your bespoke hero...
}
```

Non-negotiable:

- **`"use client"`** stays as the first line. (Keep any heavy rAF/canvas/WebGL
  work in a nested leaf component so it doesn't bloat this boundary, but the file
  itself is a client component.)
- **Default export**, function named `Hero`, props exactly `{ hero: Hero; slug: string }`.
  `Hero` the function and `Hero` the type don't collide — types and values live in
  separate namespaces.
- Do not add or change other exports, props, or the file path.

You **may** add sibling files _inside this `designs/` folder only_ that are clearly
namespaced to your slug (e.g. `cortex.module.css`, `CortexCipherRain.tsx`,
`cortex/useScramble.ts`). Do not create shared-sounding files other agents might
also create.

---

## 2. Styling — scoped only, never global

Global CSS collides across the 8 pages (they all render under the same
`app/oss/layout.tsx` shell). So:

- **Preferred:** a co-located **CSS Module** `<slug>.module.css` imported into
  your component. Class names and `@keyframes` names are hashed/route-scoped by
  Next, so they can't collide with another design.
- **Or** inline `style={{ ... }}` / Tailwind v4 utility classes.
- **Do NOT** add global selectors (plain `.foo {}` in a `.css` you import, or
  edits to `oss.css`/`globals.css`). Do NOT reuse the `.osh-*` class names unless
  you deliberately want the default look — they're owned by the shared `oss.css`.
- `@property` is inherently global (it registers a document-wide custom property).
  If you need one, **name it uniquely per slug** (e.g. `--cortex-angle`, not
  `--angle`) so two designs can never clash. Declaring it inside your CSS module
  is fine.
- All motion must be gated behind `@media (prefers-reduced-motion: reduce)` with
  a sensible static fallback (see your brief).

### Ancestor you inherit
Your hero renders inside `<div class="osh-shell">` which paints a **dark
`#0b0b0e`** background. If your design is light (e.g. omegahack's cream
`#F4EDDD`), your root element must paint its own full-viewport background so the
shell never shows through. Give your root `min-height: 100svh` (or `100vh`).

---

## 3. Fonts — exact CSS var names available to you

The scaffolding agent loaded every family via `next/font/google` in
`app/layout.tsx` and exposed these **per-slug** custom properties on `<html>`
(so they're available everywhere). Use them straight in CSS:
`font-family: var(--font-<slug>-display)` etc. Do **not** import `next/font`
yourself and do **not** touch `app/layout.tsx`.

| slug | `--font-<slug>-display` | `--font-<slug>-body` | `--font-<slug>-mono` |
|------|--------------------------|-----------------------|-----------------------|
| **cortex** | `--font-cortex-display` → Martian Mono | `--font-cortex-body` → Hanken Grotesk | `--font-cortex-mono` → JetBrains Mono |
| **band-of-agents** | `--font-band-of-agents-display` → Fraunces | `--font-band-of-agents-body` → Spectral | `--font-band-of-agents-mono` → Martian Mono |
| **content-pipeline** | `--font-content-pipeline-display` → Anton | `--font-content-pipeline-body` → Saira | `--font-content-pipeline-mono` → Martian Mono |
| **forge** | `--font-forge-display` → Big Shoulders | `--font-forge-body` → IBM Plex Sans | `--font-forge-mono` → IBM Plex Mono |
| **archgraph** | `--font-archgraph-display` → Chakra Petch | `--font-archgraph-body` → Hanken Grotesk | `--font-archgraph-mono` → Martian Mono |
| **omegahack** | `--font-omegahack-display` → Libre Caslon Display | `--font-omegahack-body` → Public Sans | `--font-omegahack-mono` → IBM Plex Mono |
| **localhost-mirror** | `--font-localhost-mirror-display` → Sora | `--font-localhost-mirror-body` → Hanken Grotesk | `--font-localhost-mirror-mono` → JetBrains Mono |
| **lumen-frontier** | `--font-lumen-frontier-display` → Fraunces | `--font-lumen-frontier-body` → Hanken Grotesk | `--font-lumen-frontier-mono` → Space Mono |

Notes:
- Use **only your own slug's three vars.** They alias canonical family vars
  (`--font-martian`, `--font-fraunces`, …) internally; don't depend on the
  canonical names — the alias is the stable contract.
- **Variable-axis fonts** (for `font-variation-settings` hover-morphs): Martian
  Mono exposes `wght` + **`wdth`**; Fraunces exposes `wght` + **`opsz`, `SOFT`,
  `WONK`** (+ italic); Big Shoulders exposes `wght` + **`opsz`**; Hanken Grotesk,
  JetBrains Mono, Saira, Public Sans, Sora are variable `wght`. These are loaded
  with those axes already subset in, so `font-variation-settings: 'wdth' 112`
  (etc.) works.
- **Static fonts** (fixed weights only): Anton `400`; Libre Caslon Display `400`;
  Spectral `200/400/600` (+italic); Chakra Petch `400/500/600/700`; Space Mono
  `400/700` (+italic). Don't request a weight outside these.
- The original 8 slugs got their exact hexes / palette / button effect / hero
  motion / OG treatment from a per-slug **design brief** in `design-briefs-final.json`.
  That file no longer exists, and new slugs never had an entry, so you **write your
  own ~10-line brief** (concept, palette, type trio, signature set-piece, motion
  plan) at the top of your `<slug>.module.css` before coding, and hold yourself to
  the peer bar. The `ship-project` skill (`references/portfolio-wiring.md` step 5)
  spells this out. This contract only covers the shared seam.

---

## 4. Hero content — the `hero` prop

`hero` is the `Hero` object for your slug (defined in `app/oss/heroes.ts`). Render
its copy; do not hardcode strings that duplicate it. Fields:

| field | type | meaning |
|-------|------|---------|
| `hero.kicker` | string | eyebrow, e.g. `"CORTEX · OPEN SOURCE"` |
| `hero.title` | string | project name, e.g. `"Cortex"` |
| `hero.titleLead` | string | first line of the headline |
| `hero.titleMain` | string | second line of the headline |
| `hero.subtitle` | string | the paragraph pitch |
| `hero.note` | string | the run/install line (often contains `code`) |
| `hero.repo` | string | GitHub URL → the primary "Star on GitHub" CTA |
| `hero.live` | string \| null | live-demo URL, or `null` (render the demo CTA only when non-null) |
| `hero.oss` | boolean | `true` → "MIT LICENSED", `false` → "SOURCE AVAILABLE" |

Also available: `slug` (your slug string) — use it for the write-up link
`https://pablomanjarres.com/portfolio/projects/${slug}` and for the background art
path.

### Background art
A full-bleed 1200×-ish PNG for your slug is served from **`/oss/<slug>.png`**
(in `public/oss/`). Reuse it (as a background, texture, or masked layer) or supply
your own canvas/SVG per your brief.

---

## 5. Nav — keep the shape, restyle freely

Every hero keeps the same three-part nav so the site reads as one place. You may
fully restyle it (fonts, color, layout, motion), but keep:

- **Brand** linking to `/`: the mark `✦` + the word `Pablo`.
- **Links:** `Open source` → `/oss`, `Portfolio` → `/portfolio`, and
  `GitHub ↗` → `hero.repo` (external, `target="_blank" rel="noreferrer"`).

Use `next/link` for the internal links (`/`, `/oss`, `/portfolio`); a plain `<a>`
for the external repo link. Also keep a footer with the license tag
(`hero.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"`) and `© 2026 Pablo Manjarres`.

(See `DefaultHero.tsx` in this folder for the exact current markup to preserve
semantically.)

---

## 6. Do NOT edit these shared files

Touch none of these — they are the contract other agents and the build depend on:

- `app/layout.tsx` (fonts + `--font-*` vars)
- `app/oss/layout.tsx` and `app/oss/oss.css`
- `app/oss/[slug]/page.tsx`
- `app/oss/[slug]/designs/registry.ts`
- `app/oss/[slug]/designs/DefaultHero.tsx`
- `app/oss/[slug]/designs/CONTRACT.md` (this file)
- `app/oss/[slug]/opengraph-image.tsx` (owned by the OG agent) and `app/globals.css`
- any other slug's `designs/<other-slug>.tsx` or its module

Your entire change surface = `designs/<your-slug>.tsx` + `designs/<your-slug>.module.css`
(+ optional slug-namespaced leaf components/hooks in this folder).

---

## 7. Definition of done

- `npm run build` is green (do **not** run a dev server — it hangs).
- Your page renders your bespoke hero; every other `/oss/*` page is unchanged.
- Reduced-motion path works; no horizontal body scroll; CTAs point at the real
  `hero.repo` / `hero.live` / write-up URLs.
- The design matches the depth of the peer set (the structural floor and the
  design depth gate live in the `ship-project` skill: `references/portfolio-wiring.md`
  step 5 and `SKILL.md` Phase 4). A page that is only structurally valid is not
  done. valhalla shipped at 70 tsx / 299 css lines, half the thinnest peer, and it
  read as thin; the peer envelope is 134-504 tsx / 637-1073 css.
