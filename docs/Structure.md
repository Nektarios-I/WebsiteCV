# 📂 Project Structure — WebsiteCV

> **Last Updated:** 2026-03-01
> **Status:** Phase 6 Complete — Real CV Data Integrated

This is the **live map** of the project. Every directory, component, and module is documented here with its purpose and dependencies. This file must be updated whenever new files or directories are added.

---

## Root Overview

```
WebsiteCV/
├── site.config.ts          → ⭐ YOUR CONTENT (edit this file!)
├── docs/                   → Living documentation (you are here)
├── public/                 → Static assets served directly by CDN
├── src/                    → All application source code
├── scripts/                → Build/utility scripts
├── e2e/                    → Playwright E2E tests
├── next.config.ts          → Next.js configuration (MDX, WASM, GLSL, bundle analyzer)
├── postcss.config.mjs      → PostCSS with @tailwindcss/postcss
├── tsconfig.json           → TypeScript compiler options (strict mode)
├── eslint.config.mjs       → ESLint 9 flat config
├── .prettierrc             → Prettier formatting rules
├── commitlint.config.mjs   → Conventional commit enforcement
├── vitest.config.mts       → Vitest unit test configuration
├── vitest.setup.mts        → Vitest setup file
├── playwright.config.ts    → Playwright E2E test configuration
├── .husky/                 → Git hooks (pre-commit, commit-msg)
└── package.json            → Dependencies & scripts
```

> **Important:** Edit `site.config.ts` to change your personal info, then run `pnpm sync-config`.

---

## `/docs` — Living Documentation

| File                           | Purpose                                                         |
| ------------------------------ | --------------------------------------------------------------- |
| `Structure.md`                 | This file. Live project map.                                    |
| `Tech_Stack.md`                | Every tool/library used, per component, with rationale.         |
| `Decisions.md`                 | Architectural Decision Records (ADRs).                          |
| `Roadmap.md`                   | Feature tracker, known bugs, tech debt, future ideas.           |
| `CONTRIBUTING.md`              | Developer setup, coding conventions, PR flow.                   |
| `Implementation_Plan.md`       | Step-by-step implementation guide for LLM/developer continuity. |
| `Progress_Log.md`              | Session-by-session log of completed work and next steps.        |
| `Tutorial.md`                  | Quick start guide for using and customizing the portfolio.      |
| `Suggestions.md`               | Ideas for features and improvements.                            |
| `Gallery_Architecture.md`      | Mode C "Digital Art Gallery" full architecture & phased plan.   |
| `Gallery_Research_Findings.md` | Free tools/libraries/assets research for gallery improvements.  |

---

## `/scripts` — Build & Utility Scripts

| File             | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `sync-config.ts` | Syncs `site.config.ts` to JSON data files |

**Usage:** `pnpm sync-config`

---

## `/public` — Static Assets

```
public/
├── fonts/              → Self-hosted WOFF2 font files (loaded via next/font)
├── images/             → Web-optimized images (favicon, OG, profile photo)
│   └── projects/       → Project screenshot images
├── models/             → 3D assets (Mode B/C only, fetched on-demand)
│   ├── Robot.fbx       → Quaternius CC0 robot model (15 animations)
│   └── gallery-theme/  → Ready-pack GLTF scene (unused, kept for reference)
├── textures/           → KTX2/Basis compressed textures
└── robots.txt          → Search engine crawler instructions
```

**Key Rule:** Nothing in `/public/models/` is bundled by webpack. These are fetched at runtime via `useGLTF` only when Mode B is active.

---

## `/src/app` — Next.js App Router (Routing Layer)

```
src/app/
├── layout.tsx          → Root layout: HTML shell, fonts, metadata, viewport, SkipLink, JsonLd
├── page.tsx            → Hub landing page (delegates to HubLanding component)
├── globals.css         → Global styles, Tailwind v4 @theme, CSS variables
├── sitemap.ts          → Dynamic sitemap generation (Next.js metadata)
├── opengraph-image.tsx → Dynamic OG image generation (Edge runtime)
│
├── minimalist/         → /minimalist — Mode A route
│   ├── layout.tsx      → Mode A layout (minimal, no Canvas)
│   └── page.tsx        → Mode A entry (dynamic import of ModeARoot)
│
├── immersive/          → /immersive — Mode B route
│   ├── layout.tsx      → Mode B layout (full-screen, bg-black, <main> with id)
│   └── page.tsx        → Mode B entry (delegates to ModeBLoader, ssr: false)
│
└── gallery/            → /gallery — Mode C route (NEW)
    ├── layout.tsx      → Mode C layout (full-screen, bg-black)
    └── page.tsx        → Mode C entry (delegates to ModeCLoader, ssr: false)
```

**Architecture Note:** Each mode has its own route directory with independent layouts. Mode A never loads Mode B or C runtime, Mode B never loads Mode C, etc. Next.js handles code splitting automatically at the route boundary.

---

## `/src/modes` — ★ Mode Plugin System ★

This is the **core architectural pattern** of the project. Each mode is a self-contained module.

```
src/modes/
├── types.ts            → ModeConfig interface definition
├── registry.ts         → Central registry of all available modes
│
├── mode-a/             → "The Minimalist"
│   ├── index.tsx       → Public API: exports ModeConfig + icon component
│   └── components/     → Mode A-specific React components
│       ├── ModeARoot.tsx       → Root component (two-column layout + section composition)
│       ├── ModeANav.tsx        → Sticky sidebar nav (desktop) / compact header (mobile)
│       ├── SectionWrapper.tsx  → Shared section container (IO registration + whileInView)
│       ├── AboutSection.tsx    → Bio/summary from cv.json
│       ├── ExperienceSection.tsx → Timeline cards from cv.json
│       ├── ProjectsSection.tsx → Project cards from projects.json
│       ├── SkillsSection.tsx   → Categorized skill grid from skills.json
│       ├── EducationSection.tsx → Education entries from cv.json
│       └── ContactSection.tsx  → CTA + footer
│
├── mode-b/             → "The Immersive"
│   ├── index.tsx       → Public API: exports ModeConfig + icon component
│   ├── components/     → 3D scene components
│   │   ├── ModeBRoot.tsx   → Root component (Canvas + overlays)
│   │   ├── Scene.tsx       → R3F Canvas wrapper with Suspense
│   │   ├── Room.tsx        → Procedural room geometry
│   │   ├── Loader.tsx      → Loading screen with useProgress
│   │   ├── InteractiveObject.tsx → Clickable 3D hotspot
│   │   └── ContentPanel.tsx → CV content overlay (data-driven)
│   ├── hooks/          → 3D-specific hooks
│   │   └── useCameraTransition.ts → Smooth camera animation
│   ├── lights/         → Lighting setup components
│   │   └── RoomLights.tsx  → 3-point lighting system
│   ├── cameras/        → Camera rigs and controls
│   │   └── CameraRig.tsx   → OrbitControls with limits
│   ├── physics/        → Physics world config — Rapier (placeholder)
│   └── utils/          → 3D math helpers, loaders (placeholder)
│
└── mode-c/             → "The Digital Art Gallery"
    ├── index.tsx       → Public API: exports ModeConfig + icon component
    ├── components/     → Root + scene components
    │   ├── ModeCRoot.tsx       → Entry point (Canvas + DOM overlays + controls)
    │   ├── GalleryScene.tsx    → R3F Canvas + Physics wrapper
    │   ├── GalleryLights.tsx   → Museum-style lighting
    │   ├── CameraController.tsx → R3F FOV sync from camera store
    │   ├── GalleryPostProcessing.tsx → Bloom + Vignette effects
    │   └── GallerySparkles.tsx → Golden dust mote particles
    ├── components/rooms/ → Room components (lobby + themed rooms)
    │   ├── RoomManager.tsx     → Conditional room rendering
    │   ├── RoomShell.tsx       → Reusable room structure (floor/walls/ceiling)
    │   ├── WallWithDoor.tsx    → Wall with doorway cutout + sensor
    │   ├── Lobby.tsx           → Central spawn room with doorways + decorations
    │   ├── LobbyDecor.tsx      → Lobby decorations (ServerTower, BinaryHelix, benches, plants, stanchions)
    │   ├── RobotNPC.tsx        → NPC robot viewer (cloned FBX, 7 anim poses, color variants)
    │   ├── MapPedestal.tsx     → Glowing holographic map orb (lobby center)
    │   ├── ProjectsRoom.tsx    → Dark gallery with painting frames
    │   ├── BioRoom.tsx         → Marble sculpture hall with pedestals
    │   ├── SkillsRoom.tsx      → Tech lab with display cases
    │   ├── PlaygroundRoom.tsx  → Now "Certifications & Achievements" room
    │   ├── GalleryFloor.tsx    → Tiled floor (5 patterns: checkerboard, herringbone, diamond, marble-grid, parquet)
    │   ├── Baseboard.tsx       → Floor-wall junction trim strip
    │   ├── CrownMolding.tsx    → Ceiling-wall junction decorative ledge
    │   ├── WallPattern.tsx     → Two-zone wall overlay (medallion grid + wainscoting)
    │   ├── DadoRail.tsx        → Horizontal chair-rail molding
    │   ├── CeilingFixture.tsx  → Pendant/chandelier ceiling lights with pointLights
    │   ├── WallSconce.tsx      → Wall-mounted decorative light fixtures
    │   └── GalleryThemeScene.tsx → Ready-pack GLTF scene (unused, kept for reference)
    ├── components/character/ → Player controller + model
    │   ├── Player.tsx          → Ecctrl wrapper (goofy movement, key-based teleport)
    │   ├── RobotCharacter.tsx  → FBX robot model with 15 animations (walk/run/idle/jump)
    │   └── StickmanCharacter.tsx → Procedural cartoony stickman mesh (fallback)
    ├── components/exhibits/ → 3D exhibit components (data-driven)
    │   ├── ProjectFrame.tsx     → Wall-mounted framed project exhibit
    │   ├── SkillOrb.tsx         → Display case with glowing skill orbs
    │   ├── TimelinePlaque.tsx   → Stone plaques for experience/education
    │   └── CertificationPlaque.tsx → Gold-trimmed wall certificate frame
    ├── components/ui/  → DOM overlay components
    │   ├── GalleryHUD.tsx           → Room name, map button, controls hint
    │   ├── MapOverlay.tsx           → SVG floor plan map with room teleport
    │   ├── TransitionOverlay.tsx    → Room fade transitions
    │   ├── GalleryLoader.tsx        → Loading screen with progress
    │   ├── CameraSettingsPanel.tsx  → Camera presets UI + custom sliders
    │   ├── ExhibitPanel.tsx         → Side panel with project/skill/cert details
    │   ├── MobileJoystick.tsx       → Touch joystick for mobile devices
    │   └── ScreenReaderContent.tsx  → Hidden a11y DOM with all CV data
    ├── hooks/
    │   ├── useRoomTransition.ts     → Room transition state machine (debounced)
    │   ├── useGalleryControls.ts    → Keyboard shortcuts (M, Esc)
    │   └── useExhibitData.ts        → Maps JSON data to exhibit format (incl. certifications)
    ├── stores/
    │   ├── useGalleryStore.ts  → Gallery state (rooms, transitions, map, exhibits)
    │   └── useCameraStore.ts   → Camera presets + custom settings (localStorage)
    └── lib/
        ├── constants.ts        → Room dimensions, spawn positions, keyboard map, player config
        └── camera-presets.ts   → 5 camera preset definitions + slider limits
```

**Libraries per Mode:**

| Mode   | Libraries                                                  | Approx. Client Bundle |
| ------ | ---------------------------------------------------------- | --------------------- |
| Hub    | React, Framer Motion, Tailwind                             | ~25KB gzip            |
| Mode A | React (RSC where possible), Framer Motion                  | ~30KB gzip            |
| Mode B | @react-three/fiber, @react-three/drei, @react-three/rapier | ~150KB gzip + models  |
| Mode C | R3F, drei, rapier, ecctrl (character controller)           | ~250KB gzip + models  |

---

## `/src/components` — Shared UI Components

```
src/components/
├── hub/                → Hub page components
│   ├── HubLanding.tsx  → Hub landing page (hero + mode selector grid, <main> tag)
│   └── ModeCard.tsx    → Interactive mode selection card (preload on hover)
│
├── ui/                 → Shared UI primitives
│   └── SkipLink.tsx    → Accessibility skip-to-main-content link
│
├── seo/                → SEO components
│   └── JsonLd.tsx      → JSON-LD structured data (Person, WebSite, ProfilePage)
│
└── loaders/            → Dynamic import wrappers
    ├── ModeBLoader.tsx → Client component wrapping ModeBRoot with ssr: false
    └── ModeCLoader.tsx → Client component wrapping ModeCRoot with ssr: false
```

---

## `/src/data` — Content Layer

```
src/data/
├── cv.json             → Structured CV (education, experience, contact)
├── projects.json       → Portfolio project entries
├── skills.json         → Skills with categories and proficiency
└── content/            → Rich content (MDX)
    ├── about.mdx       → Extended bio / about page
    └── projects/       → Per-project detailed write-ups
        └── project-slug.mdx
```

**Data files** use TypeScript interfaces defined in `/src/types/` for type safety.

---

## `/src/hooks` — Shared React Hooks

| Hook                     | Purpose                                            |
| ------------------------ | -------------------------------------------------- |
| `useMode.ts`             | Get/set current active mode                        |
| `useMediaQuery.ts`       | Responsive breakpoint detection                    |
| `useReducedMotion.ts`    | Respect `prefers-reduced-motion`                   |
| `useActiveSection.ts`    | IntersectionObserver-based section scroll tracking |
| `useCameraTransition.ts` | Smooth 3D camera position/target animations        |

---

## `/src/stores` — Global State (Zustand)

| Store                | Purpose                                                       |
| -------------------- | ------------------------------------------------------------- |
| `appStore.ts`        | Mode selection, theme preference, user settings               |
| `useModeBStore.ts`   | Mode B state (selected object, content panel)                 |
| `useGalleryStore.ts` | Mode C state (rooms, transitions, map, exhibits) — in mode-c/ |
| `useCameraStore.ts`  | Camera presets, custom settings, localStorage — in mode-c/    |

---

## `/src/lib` — Utilities & Configuration

| File                | Purpose                                             |
| ------------------- | --------------------------------------------------- |
| `constants.ts`      | App-wide constants (imports from site.config.ts)    |
| `config-adapter.ts` | Bridges site.config.ts to component data structures |
| `utils.ts`          | Pure helper functions (formatting, classnames)      |
| `utils.test.ts`     | Unit tests for utility functions (Vitest)           |
| `mdx.ts`            | MDX compilation and rendering utilities             |

---

## `/src/types` — TypeScript Type Definitions

| File         | Purpose                                              |
| ------------ | ---------------------------------------------------- |
| `index.ts`   | Barrel re-export of all types                        |
| `cv.ts`      | Interfaces for CV data (Experience, Education, etc.) |
| `project.ts` | Project entry interface, categories                  |
| `skill.ts`   | Skill interface, categories, proficiency levels      |

---

## `/e2e` — E2E Tests (Playwright)

| File                 | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `navigation.spec.ts` | Hub navigation, mode switching, a11y tests |

---

## Dependency Flow (Coupling Map)

```
Hub Page
  ├── reads from: /src/data/cv.json
  ├── uses: /src/components/hub/*
  ├── uses: /src/components/ui/*
  └── reads: /src/modes/registry.ts → ModeConfig[]

Mode A
  ├── reads from: /src/data/* (all content files)
  ├── uses: /src/components/ui/* (shared primitives)
  ├── uses: /src/modes/mode-a/components/* (own components)
  └── does NOT import: anything from mode-b/

Mode B
  ├── reads from: /src/data/* (for content overlay)
  ├── uses: /src/modes/mode-b/* (own 3D components)
  ├── fetches: /public/models/* (at runtime)
  └── does NOT import: anything from mode-a/ or mode-c/

Mode C
  ├── reads from: /src/data/* (for exhibit content)
  ├── uses: /src/modes/mode-c/* (own 3D + UI components)
  ├── uses: ecctrl (character controller, mode-c only)
  ├── fetches: /public/models/gallery/* (at runtime, per-room)
  └── does NOT import: anything from mode-a/ or mode-b/
```

**Rule:** Modes may import from `/src/components/ui/`, `/src/data/`, `/src/hooks/`, `/src/lib/`, and `/src/types/`. Modes must **never** import from each other.
