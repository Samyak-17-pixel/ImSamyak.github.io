# Samyak Kumar — Portfolio Website

A personal portfolio site for **marine robotics**, **autonomous underwater vehicles (AUVs)**, and **underwater autonomy** research. It features a **React** + **TypeScript** UI, **React Router** with multiple sections, a **Three.js** (@react-three/fiber) underwater background, scroll-driven **sensor-style HUD** widgets, and **GitHub Actions** deployment to **GitHub Pages**.

**Live site (after deployment):**  
`https://samyak-17-pixel.github.io/Website/`  
(Hash-based routes, e.g. `.../Website/#/about`.)

---

## Table of contents

1. [Features](#features)  
2. [Tech stack](#tech-stack)  
3. [Prerequisites](#prerequisites)  
4. [Getting started](#getting-started)  
5. [Scripts](#scripts)  
6. [Project structure](#project-structure)  
7. [Configuration notes](#configuration-notes)  
8. [Deploying to GitHub Pages](#deploying-to-github-pages)  
9. [Troubleshooting](#troubleshooting)  
10. [License & attribution](#license--attribution)

---

## Features

### Content & navigation

- **Separate routes** for each major section: Home, About, Research, Projects, Experience, Skills, Education, Contact.
- **Full content** for academic profile: research papers (summaries), compact AUV project, SAUVC, work experience, skills, education, awards, leadership, contact links, and CV download.
- **Scroll-to-top** on route change so each section starts at the top of the page.

### Visual & interaction

- **Three.js background** (`MarineScene`): particles, kelp-like strands, bubbles, sonar-style rings, sweep, horizontal AUV-inspired hull, fog, and lighting tuned for an underwater / “abyss lab” look.
- **Custom GLSL-style backdrop** (`UnderwaterBackdrop`) with caustic-like noise and **mouse-reactive** local water distortion (pointer tracked from `window` so UI stays clickable).
- **Click ripples** (`WaterRippleOverlay`) for a water-drop effect on document click.
- **Framer Motion** for page transitions and nav entrance.

### Sensor HUD (decorative)

- Values are **driven by scroll position** (not real hardware): depth increases **0 → `DEPTH_MAX_M` m** (eased) as you scroll down the page; mission phase label updates with scroll.
- **Canvas widgets**: polar “scanning” view, A-scan, imaging patch, side-scan strip, echosounder strip chart; **muted** colors aligned with the dark UI.
- **Read-only / decorative**: `aria-hidden` on HUD; does not replace real instrumentation.

### Build & deploy

- **Vite** for fast dev and optimized production builds.
- **GitHub Actions** workflow (`.github/workflows/deploy.yml`) builds with `npm ci` / `npm run build` and publishes the **`dist`** folder to **GitHub Pages**.

---

## Tech stack

| Area | Technology |
|------|------------|
| UI | React 18, TypeScript |
| Bundler | Vite 6 |
| Routing | React Router 6 (**HashRouter** — reliable on static GitHub Pages without server rewrite rules) |
| 3D | three.js, @react-three/fiber, @react-three/drei |
| Motion | framer-motion |
| Styling | Global CSS (design tokens, responsive HUD) |

Path alias: `@/` → `src/` (see `vite.config.ts`).

---

## Prerequisites

- **Node.js** 18+ (20+ recommended; GitHub Actions uses Node 20).
- **npm** (comes with Node).

Check versions:

```bash
node -v
npm -v
```

---

## Getting started

### Clone the repository

```bash
git clone https://github.com/Samyak-17-pixel/Website.git
cd Website
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Edit files under `src/`; the app hot-reloads.

### Production build (local check)

```bash
npm run build
```

Output is written to **`dist/`**.

### Preview the production build locally

```bash
npm run preview
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check (via Vite) and emit production assets to `dist/` |
| `npm run preview` | Serve `dist/` locally for smoke-testing |

---

## Project structure

```
Website/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages: build + deploy dist/
├── public/
│   └── Samyak_CV.pdf           # CV linked from Contact (add/replace as needed)
├── src/
│   ├── components/
│   │   ├── effects/            # e.g. WaterRippleOverlay
│   │   ├── hud/                # Sensor HUD, canvases, sensorMath
│   │   ├── layout/             # MainLayout, Nav
│   │   ├── three/              # MarineScene, shaders, bubbles, etc.
│   │   └── ui/                 # PageShell, etc.
│   ├── content/                # Structured copy (about, research, …)
│   ├── hooks/                  # useScrollProgressRaf, etc.
│   ├── pages/                  # Route-level page components
│   ├── styles/
│   │   └── global.css
│   ├── App.tsx                 # Routes
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Configuration notes

### `vite.config.ts` — `base`

- **`base: "./"`** — Relative asset paths. Works well for GitHub Pages project sites when opening `index.html` under `/Website/`.
- If you ever see **broken CSS/JS** on Pages, try setting `base: "/Website/"` (repo name must match), then rebuild and redeploy.

### Hash routing

- The app uses **`HashRouter`**. URLs look like:  
  `https://samyak-17-pixel.github.io/Website/#/contact`  
  This avoids needing server-side fallback to `index.html` for client-side routes.

### Sensor HUD depth ceiling

- Maximum displayed depth (and scroll mapping) is set in **`src/components/hud/sensorMath.ts`** as **`DEPTH_MAX_M`** (meters). Adjust for narrative or display preference.

### CV file

- Place the PDF at **`public/Samyak_CV.pdf`** (or update the filename + link in the Contact page / `src/content/contact.ts`).

---

## Deploying to GitHub Pages

### Repository

- Remote: `https://github.com/Samyak-17-pixel/Website.git`

### Enable Pages with GitHub Actions

1. Push the `main` (or `master`) branch to GitHub.
2. In the repo: **Settings → Pages**.
3. **Build and deployment → Source:** select **GitHub Actions** (not “Deploy from a branch” for this workflow).
4. Open the **Actions** tab and confirm the workflow **Deploy to GitHub Pages** succeeds.

The workflow file is **`.github/workflows/deploy.yml`**: it runs `npm ci`, `npm run build`, uploads **`dist`**, and deploys to Pages.

### Published URL

- **Project site:** `https://samyak-17-pixel.github.io/Website/`

First deploy can take a minute after the workflow finishes.

---

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| Blank page or 404 on assets | Set `base: "/Website/"` in `vite.config.ts`, rebuild, redeploy. |
| Routes work locally but not on Pages | Ensure you use **hash** URLs (`#/about`), or configure hosting for SPA fallback (not required with HashRouter). |
| Workflow fails on `npm ci` | Run `npm install` locally, commit an updated `package-lock.json`, push again. |
| Node version errors locally | Use Node 20 LTS to match CI, or align `.nvmrc` / Volta if you add them. |
| HUD feels heavy on old devices | Reduce canvas sizes or HUD panels in CSS / components. |

---

## License & attribution

- **Content** (bio, research descriptions, CV) belongs to **Samyak Kumar**; reuse only with permission.
- **Code** in this repository: unless you add a license file, default copyright applies — consider adding an explicit **LICENSE** (e.g. MIT) if you want open reuse.

Built with [Vite](https://vitejs.dev/), [React](https://react.dev/), [three.js](https://threejs.org/), and [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction).

---

## Author

**Samyak Kumar** — Undergraduate, Naval Architecture and Ocean Engineering, IIT Madras · Marine robotics & AUVs.

Contact and links are on the live **Contact** page of the site.
