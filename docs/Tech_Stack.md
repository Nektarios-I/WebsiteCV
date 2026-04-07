# 🛠 Tech Stack — WebsiteCV

> **Last Updated:** 2026-03-01
> **Status:** Phase 6 Complete — Real CV Data Integrated, Gallery Decorated

This document records every technology used in the project, **where** it's used, and **why** it was chosen over alternatives.

---

## Core Framework

| Tool           | Version                        | Purpose                            | Alternatives Considered |
| -------------- | ------------------------------ | ---------------------------------- | ----------------------- |
| **Next.js**    | 16.1.6 (App Router, Turbopack) | Full-stack React framework         | Astro, Remix, SvelteKit |
| **React**      | 19.2.3                         | UI component library               | Svelte, Vue, Solid      |
| **TypeScript** | 5.9.3 (strict)                 | Type safety across entire codebase | JavaScript + JSDoc      |

**Why Next.js over Astro?**
Astro excels at static content but its island architecture creates friction for full R3F scenes that need shared state. Next.js App Router gives us React Server Components for Mode A performance while maintaining a first-class R3F story for Mode B. Route groups provide natural code splitting boundaries. See [ADR-001](Decisions.md#adr-001).

---

## Styling

| Tool                      | Used In        | Purpose                            | Alternatives Considered                         |
| ------------------------- | -------------- | ---------------------------------- | ----------------------------------------------- |
| **Tailwind CSS**          | All components | Utility-first CSS, design system   | Styled Components, CSS Modules, Vanilla Extract |
| **CSS Variables**         | `globals.css`  | Theme tokens (dark/light)          | Tailwind `darkMode` only                        |
| **Framer Motion**         | Hub, Mode A    | Page transitions, micro-animations | GSAP, React Spring                              |
| **clsx / tailwind-merge** | All components | Conditional class composition      | classnames                                      |

**Why Tailwind?**

- Co-located styles = high cohesion (component logic + styles in same file)
- Tree-shaken: only used classes ship to production
- Design tokens via `@theme inline` in `globals.css` enforce consistency (Tailwind v4 CSS-based config)
- No runtime CSS-in-JS overhead (critical for Mode B performance)

---

## 3D / WebGL (Mode B + Mode C)

| Tool                            | Used In                    | Purpose                                            | Alternatives Considered  |
| ------------------------------- | -------------------------- | -------------------------------------------------- | ------------------------ |
| **@react-three/fiber (R3F)**    | `modes/mode-b/`, `mode-c/` | React renderer for Three.js                        | Raw Three.js, Babylon.js |
| **@react-three/drei**           | `modes/mode-b/`, `mode-c/` | Helper components (Text, Html, Billboard, etc.)    | Custom implementations   |
| **@react-three/rapier**         | `modes/mode-b/`, `mode-c/` | Physics engine (Rust/WASM) — collision, sensors    | Cannon.js, Ammo.js       |
| **Three.js**                    | Transitive dep             | 3D rendering engine                                | —                        |
| **ecctrl**                      | `modes/mode-c/`            | Floating capsule character controller (3rd person) | Custom RigidBody capsule |
| **@react-three/postprocessing** | `modes/mode-c/`            | Post-processing effects (Bloom, Vignette)          | Custom shaders           |
| **Leva**                        | Dev only                   | 3D scene parameter tweaking GUI                    | dat.gui, Tweakpane       |

**Why R3F over raw Three.js?**

- Declarative component model aligns with React mental model
- Automatic disposal (no memory leak management)
- Suspense integration for asset loading
- Huge ecosystem (Drei has 80+ helpers)
- Same React DevTools for debugging

**Why Rapier over Cannon.js?**

- WASM-based (Rust) = 2-10x faster than JS physics
- Deterministic simulation
- Active maintenance and smaller bundle

**Why ecctrl for character controller? (Mode C)**

- Pre-built floating capsule controller with spring/damping physics
- Built for R3F + Rapier ecosystem (same pmndrs maintainers)
- Third-person follow camera with configurable distance/lerp
- KeyboardControls integration (WASD, Space, Shift)
- Mobile joystick support via EcctrlJoystick
- Animation state machine (idle/walk/run/jump)
- Highly configurable: tuning props create "goofy" or "smooth" movement
- Alternative was building 500+ LOC of custom physics character code

---

## 3D Asset Pipeline

| Tool                       | Stage       | Purpose                                                                                       |
| -------------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| **Blender**                | Authoring   | 3D model creation and export                                                                  |
| **gltf-transform**         | Build/CI    | DRACO compression, texture optimization, mesh merging                                         |
| **glTF 2.0 (GLB)**         | Format      | Industry-standard 3D interchange format                                                       |
| **FBX (Robot.fbx)**        | Format      | Quaternius CC0 robot model (15 animations) via `useFBX` — see [ADR-008](Decisions.md#adr-008) |
| **DRACO**                  | Compression | Mesh geometry compression (70-90% size reduction)                                             |
| **KTX2 / Basis Universal** | Compression | GPU-compressed textures (cross-platform)                                                      |

**Pipeline Flow:**

```
Blender (.blend)
  → Export as glTF 2.0 (.glb)
  → gltf-transform optimize (DRACO + KTX2)
  → Place in /public/models/
  → Fetched at runtime by useGLTF
```

> **Note (Session 024 — Ready-Pack Failure):** An attempt was made to integrate a pre-made Sketchfab GLTF gallery scene as a visual upgrade. It failed due to physics collider misalignment, style mismatch with procedural aesthetic, and coordinate chaos. The project stays fully procedural for room geometry, with decorative overlays (`WallPattern`, `CeilingFixture`, `DadoRail`, `WallSconce`, `LobbyDecor`) added as pure React components. See [ADR-009](Decisions.md#adr-009).

---

## State Management

| Tool              | Used In              | Purpose                           | Alternatives Considered           |
| ----------------- | -------------------- | --------------------------------- | --------------------------------- |
| **Zustand**       | `stores/appStore.ts` | Global state (mode, theme, prefs) | Redux Toolkit, Jotai, Context API |
| **React Context** | Theme provider       | Theme propagation                 | —                                 |

**Why Zustand?**

- 1KB gzip, no boilerplate
- Works outside React (useful for 3D event handlers)
- No Provider wrapper needed
- Simple: `const mode = useAppStore(s => s.mode)`

---

## Content & Data

| Tool                | Used In           | Purpose                                      | Alternatives Considered |
| ------------------- | ----------------- | -------------------------------------------- | ----------------------- |
| **JSON data files** | `data/*.json`     | Structured CV data (typed via TS interfaces) | YAML, Sanity CMS        |
| **MDX**             | `data/content/`   | Rich content with embedded React components  | Markdown, Contentlayer  |
| **next-mdx-remote** | Content rendering | Server-side MDX compilation                  | @next/mdx, Contentlayer |

**Why Hybrid (JSON + MDX)?**

- JSON for structured, queryable data (experience entries, skills) — easy to validate with TS
- MDX for narrative content (project write-ups, about page) — supports React components inline
- No external CMS dependency = faster builds, version-controlled content

---

## Development Tools

| Tool            | Purpose                                            |
| --------------- | -------------------------------------------------- |
| **ESLint**      | Code linting (next/core-web-vitals + custom rules) |
| **Prettier**    | Code formatting (consistent style)                 |
| **Husky**       | Git hooks (pre-commit lint/format)                 |
| **lint-staged** | Run linters on staged files only                   |
| **Commitlint**  | Enforce conventional commit messages               |

---

## Testing ✅ Active (83 Tests Passing)

| Tool                      | Purpose                                          | Status        |
| ------------------------- | ------------------------------------------------ | ------------- |
| **Vitest**                | Unit tests for utilities, hooks, data transforms | ✅ 83 tests   |
| **React Testing Library** | Component integration tests (hooks)              | ✅ In use     |
| **Playwright**            | E2E tests (mode switching, navigation, gallery)  | ✅ Configured |
| **Storybook**             | Component visual documentation                   | Low priority  |

**Test Files (5):**

- `src/lib/utils.test.ts` — 12 tests (cn, formatDate, fallback)
- `src/hooks/useMediaQuery.test.ts` — 3 tests
- `src/modes/mode-c/stores/useGalleryStore.test.ts` — 17 tests
- `src/modes/mode-c/hooks/useExhibitData.test.ts` — 20 tests
- `src/modes/mode-c/components/character/__tests__/` — 31 tests (RobotCharacter, Player, camera store)

---

## Deployment & Infrastructure

| Tool                      | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| **Vercel**                | Hosting, CI/CD, Edge Network, Image Optimization |
| **Vercel Analytics**      | Core Web Vitals monitoring                       |
| **Vercel Speed Insights** | Real-user performance data                       |

---

## Bundle Impact Summary

| Layer                | Estimated Size (gzip) | When Loaded             |
| -------------------- | --------------------- | ----------------------- |
| Hub (landing)        | ~25KB                 | Initial page load       |
| Mode A               | ~30KB                 | On mode selection       |
| Mode B (code)        | ~150KB                | On mode selection       |
| Mode B (3D assets)   | ~2-10MB               | Progressive, after code |
| Mode C (code)        | ~250KB                | On mode selection       |
| Mode C (3D assets)   | ~2MB                  | Robot.fbx + textures    |
| Mode C (ecctrl)      | ~20KB                 | With Mode C code        |
| Shared (React, etc.) | ~45KB                 | Initial (shared chunk)  |

---

## Key Constraints

1. **Mode B/C libraries must NEVER appear in Mode A's bundle** — enforced by route groups + dynamic imports
2. **Mode C libraries (ecctrl) must NEVER appear in Mode B's bundle** — separate dynamic import boundaries
3. **No CSS-in-JS runtime** — Tailwind only (zero runtime cost)
4. **All 3D assets fetched at runtime** — never bundled by webpack
5. **Strict TypeScript** — `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`
6. **Core Web Vitals targets:** LCP < 2.5s, FID < 100ms, CLS < 0.1 (Mode A)
