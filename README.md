# Samyak Kumar — Portfolio Website

A personal portfolio for **marine robotics**, **autonomous underwater vehicles (AUVs)** and **underwater autonomy** research, built as one continuous **dive**: scrolling descends from the surface (0 m) to the abyss (1000 m). Each section is presented through one of the underwater sensors Samyak has worked with.

**Live site:** `https://samyak-17-pixel.github.io/Website/` (hash routes, e.g. `.../Website/#/research`)

---

## Table of contents

1. [The dive](#the-dive)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Getting started](#getting-started)
5. [Scripts](#scripts)
6. [Project structure](#project-structure)
7. [Editing content](#editing-content)
8. [Configuration notes](#configuration-notes)
9. [Deploying to GitHub Pages](#deploying-to-github-pages)
10. [Troubleshooting](#troubleshooting)
11. [License & attribution](#license--attribution)

---

## The dive

| Depth | Section | Sensor | What it does |
|------:|---------|--------|--------------|
| 0 m | Surface (hero) | Underwater GPS (USBL) | Reticle acquires a position fix over IIT Madras |
| 20 m | About | IMU | Attitude indicator follows the cursor and scroll speed |
| 45 m | Telemetry | Depth sensor | Live depth/pressure column + rolling counters |
| 80 m | AUV fleet | Imaging sonar | 3D models revealed inside a sonar fan |
| 150 m | Research | Forward-scan sonar | Elevation-ambiguous arcs accumulate into a structure |
| 250 m | Projects | DVL | Four-beam bottom lock over scrolling terrain |
| 400 m | Experience | Side-scan sonar | Copper waterfall spine; each role is a "contact" |
| 600 m | Skills | Acoustic transponders | LBL ping network; hovering a card lights its beacon |
| 800 m | Education | IMU + DVL | Dead-reckoning track; each fix collapses its uncertainty |
| 1000 m | Contact | Acoustic modem | FSK waveform transmitting a real bitstream |

The section list, depths and sensors live in **`src/content/sections.ts`**. Everything that navigates (top nav, depth gauge, instrument rail, command palette) reads from it.

---

## Features

### Navigation
- **Single long-scroll page** with **shareable deep links**: `#/research` opens the dive at that section, and the URL follows you as you scroll.
- **Top nav** (sliding active pill, mobile drawer), **depth gauge** on the left (click a marker to dive there), **instrument rail** on the right (all nine sensors, with the active one lit and showing live readouts).
- **Command palette:** <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> to jump to sections, papers, AUVs or contact links.
- **Detail pages:** `#/research/<slug>` (paper breakdown with sticky table of contents and methodology pipeline) and `#/models/<slug>` (orbitable 3D viewer with hull/sonar render modes and spec sheet).

### Visuals & motion
- **Depth-reactive three.js background:** light shafts and caustics fade as you descend; bioluminescent plankton appears in the deep; marine snow streams upward while you scroll; the seafloor rises into view at the bottom.
- **GSAP ScrollTrigger + Lenis** smooth scrolling: split-letter titles, scrubbed text, sonar-sweep reveals, rolling odometers.
- **Sonar-reticle cursor**, click ripples, a first-visit **"system boot" intro** (once per session, skippable), and a sonar-ping route transition.

### Performance & accessibility
- **Adaptive quality** (`src/lib/quality.ts`): particle counts and DPR scale down on phones and low-power devices.
- **`prefers-reduced-motion`** turns off smooth scroll, the intro and the cursor; scroll animations are skipped and canvases render a single still frame.
- Sensor canvases only animate while on screen. 3D models and detail pages are lazy-loaded.
- 3D models are **Draco-compressed GLB** (~0.5 MB each, down from 58–86 MB STL).

---

## Tech stack

| Area | Technology |
|------|------------|
| UI | React 18, TypeScript |
| Bundler | Vite 6 |
| Routing | React Router 6 (**HashRouter** for static GitHub Pages) |
| 3D | three.js, @react-three/fiber, @react-three/drei |
| Motion | GSAP + ScrollTrigger, Lenis, framer-motion |
| Styling | Plain CSS with design tokens (`src/styles/`) |
| Model pipeline | glTF-Transform + meshoptimizer + Draco (`scripts/stl-to-glb.mjs`) |

Path alias: `@/` → `src/`.

---

## Getting started

```bash
git clone https://github.com/Samyak-17-pixel/Website.git
cd Website
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Emit production assets to `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run models -- <in.stl> <out.glb> [ratio]` | Convert a binary STL to a simplified, Draco-compressed GLB (`ratio` = fraction of triangles kept, default 0.12) |

Example: `npm run models -- ~/cad/TIMI.stl public/models/timi.glb 0.18`

---

## Project structure

```
src/
├── App.tsx                    # Routes: dive, /:section, /research/:slug, /models/:slug
├── content/                   # All copy, plus sections.ts (dive registry), auvs.ts, stats.ts
├── sections/                  # One component per dive section
├── pages/                     # DivePage + detail pages
├── components/
│   ├── sensors/               # Animated sensor canvases + icons
│   ├── hud/                   # Depth gauge, instrument rail, mobile depth pill, telemetry math
│   ├── auv/                   # GLB model + viewer
│   ├── three/                 # Background scene (backdrop shader, particles, bioluminescence…)
│   ├── nav/                   # Command palette
│   ├── effects/               # Cursor, intro, ripples, route wipe
│   ├── layout/                # MainLayout, Nav
│   └── ui/                    # SectionFrame, SplitTitle, Reveal, GlowCard, Odometer…
├── lib/                       # Scroll/depth store, smooth scroll, quality tier, navigation helpers
└── styles/                    # tokens, base, chrome, sections, detail
public/
├── models/                    # dhwani.glb, timi.glb, mako.glb
├── draco/                     # Self-hosted Draco decoder
└── Samyak_CV.pdf
scripts/stl-to-glb.mjs         # CAD → web model converter
```

---

## Editing content

- Text lives in **`src/content/*.ts`**; the components only lay it out.
- **Add a section:** add an entry to `SECTIONS` in `src/content/sections.ts`, create a component in `src/sections/` wrapped in `SectionFrame` with the same `id`, and render it in `src/pages/DivePage.tsx`.
- **Telemetry numbers:** `src/content/stats.ts`.
- **AUVs:** `src/content/auvs.ts` (description, sensors, model path).
- **Papers:** `src/content/research.ts` (`papers` normalises both papers for the cards and detail pages).

---

## Configuration notes

- **`base: "./"`** in `vite.config.ts` uses relative asset paths, which suits GitHub Pages project sites. If assets 404 on Pages, try `base: "/Website/"`.
- **Hash routing** (`#/contact`) avoids needing a server-side SPA fallback.
- **Max depth** is `MAX_DEPTH_M` in `src/content/sections.ts`.
- **CV:** `public/Samyak_CV.pdf` (filename set in `src/content/contact.ts`).
- CAD sources (`*.stl`, `*.step`) are git-ignored; keep them outside the repo and convert with `npm run models`.

---

## Deploying to GitHub Pages

1. Push `main` to GitHub.
2. **Settings → Pages → Build and deployment → Source:** select **GitHub Actions**.
3. The workflow `.github/workflows/deploy.yml` runs `npm ci`, `npm run build`, and deploys `dist/`.

Published at `https://samyak-17-pixel.github.io/Website/`.

---

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| Blank page or 404 on assets | Set `base: "/Website/"` in `vite.config.ts`, rebuild, redeploy. |
| 3D models don't load | Check that `public/draco/` was deployed and that the GLB paths in `src/content/auvs.ts` are correct. |
| Workflow fails on `npm ci` | Run `npm install` locally, commit the updated `package-lock.json`, push again. |
| `npm run models` fails with a `sharp` error | Run it with Node 20+, or keep using the script as-is (it avoids the modules that need `sharp`). |
| Scrolling feels sluggish on an old laptop | The quality tier is chosen automatically; reduce `byTier(...)` counts in `MarineScene.tsx` if needed. |

---

## License & attribution

- **Content** (bio, research descriptions, CV, CAD models) belongs to **Samyak Kumar**; reuse only with permission.
- **Code:** default copyright applies unless a LICENSE file is added.

Built with [Vite](https://vitejs.dev/), [React](https://react.dev/), [three.js](https://threejs.org/), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [GSAP](https://gsap.com/) and [Lenis](https://lenis.darkroom.engineering/).

---

## Author

**Samyak Kumar** — Undergraduate, Naval Architecture and Ocean Engineering, IIT Madras · Marine robotics & AUVs.
