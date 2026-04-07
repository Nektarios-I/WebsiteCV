# 📋 Architectural Decision Records — WebsiteCV

> **Last Updated:** 2026-03-01

This document records every significant architectural decision, the context that prompted it, the options considered, and the rationale for the final choice. Decisions are immutable once recorded — if reversed, a new ADR supersedes the old one.

**Format:** Each ADR follows the [Michael Nygard template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

---

## ADR-001: Next.js App Router as Core Framework

**Date:** 2026-02-26
**Status:** Accepted
**Deciders:** Project Lead

### Context

We need a framework that serves two fundamentally different experiences from one codebase:

- **Mode A (Minimalist):** Static/SSR content, SEO-critical, must be fast on low-end devices
- **Mode B (Immersive):** GPU-heavy WebGL experience with React Three Fiber

The framework must ensure Mode B's ~150KB+ bundle never contaminates Mode A's lightweight payload.

### Options Considered

| Option                       | Pros                                                                                                           | Cons                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Next.js 14+ (App Router)** | RSC for zero-JS Mode A pages; route groups for physical code splitting; Vercel-native; first-class R3F support | Opinionated file-based routing; RSC learning curve                                  |
| **Astro**                    | Best static perf; island architecture                                                                          | R3F integration is clunky (islands don't share state well); limited dynamic routing |
| **Remix**                    | Excellent data loading patterns; nested routes                                                                 | No RSC; weaker static generation; R3F requires manual setup                         |
| **SvelteKit**                | Tiny runtime; great DX                                                                                         | Threlte (Svelte Three.js) has smaller ecosystem than R3F; team knowledge gap        |
| **Vite + React (SPA)**       | Maximum flexibility; simple build                                                                              | No SSR/SSG; poor SEO; no route-level code splitting without manual config           |

### Decision

**Next.js 14+ with App Router.**

### Rationale

1. **Route Groups** (`(mode-a)`, `(mode-b)`) provide physical separation at the routing layer — each group gets its own layout, loading states, and bundle.
2. **React Server Components** allow Mode A to render entirely on the server with zero client JavaScript for static sections.
3. **`next/dynamic` with `ssr: false`** ensures Three.js/R3F is only imported client-side when Mode B is selected.
4. **Vercel deployment** is zero-config with automatic edge optimization, ISR, and image CDN.
5. The React ecosystem (R3F, Drei, Rapier, Zustand, Framer Motion) is the most mature for our requirements.

### Consequences

- Must use React (not Svelte, Vue, or Solid)
- File-based routing means directory structure is partially dictated by Next.js conventions
- RSC boundaries require careful planning (can't use hooks in server components)

---

## ADR-002: Mode Plugin Architecture via Registry Pattern

**Date:** 2026-02-26
**Status:** Accepted
**Deciders:** Project Lead

### Context

The project requires an "anti-fragile" architecture where adding a new mode (Mode C, D, etc.) should not require modifying existing modes or the hub logic.

### Options Considered

| Option                        | Pros                                                                                        | Cons                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **Registry Pattern (chosen)** | Modes self-register via typed config objects; hub reads registry dynamically; zero coupling | Slight indirection                           |
| **Hardcoded switch/case**     | Simple; explicit                                                                            | Every new mode requires editing hub + router |
| **File-system convention**    | Auto-discovery; zero config                                                                 | Fragile; hard to type; magic behavior        |
| **Plugin manifest (JSON)**    | Declarative; easy to validate                                                               | Can't express React components; needs loader |

### Decision

**Registry Pattern** with typed `ModeConfig` interface.

### Rationale

```typescript
// Each mode exports a ModeConfig
export interface ModeConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType;
  route: string;
  component: () => Promise<React.ComponentType>;
  preloadHint?: 'none' | 'hover' | 'viewport';
  metadata: {
    estimatedLoadSize: string;
    requiresWebGL: boolean;
    supportsReducedMotion: boolean;
  };
}

// registry.ts just collects them
import { modeAConfig } from './mode-a';
import { modeBConfig } from './mode-b';
export const modes: ModeConfig[] = [modeAConfig, modeBConfig];
```

**Adding Mode C:**

1. Create `src/modes/mode-c/` with components
2. Export a `ModeConfig` from `src/modes/mode-c/index.ts`
3. Add one import line in `registry.ts`
4. Add route group `src/app/(mode-c)/`
5. **Done.** Hub automatically renders Mode C button.

### Consequences

- The hub's `ModeSelector` component iterates over `modes[]` — no hardcoded mode knowledge
- Each mode's `component` field uses dynamic import — automatic code splitting
- The `metadata` field allows the hub to show load size warnings, WebGL compatibility checks, etc.

---

## ADR-003: Zustand for Global State Management

**Date:** 2026-02-26
**Status:** Accepted
**Deciders:** Project Lead

### Context

We need minimal global state: current mode, theme preference, possibly user settings. The state must be accessible from both React components and Three.js event handlers (outside React tree).

### Options Considered

| Option               | Pros                                              | Cons                                              |
| -------------------- | ------------------------------------------------- | ------------------------------------------------- |
| **Zustand**          | 1KB; no Provider; works outside React; simple API | Less structured than Redux                        |
| **Redux Toolkit**    | Mature; DevTools; middleware                      | Overkill for our state size; Provider boilerplate |
| **Jotai**            | Atomic; bottom-up; tiny                           | Requires Provider; less ergonomic for 3D access   |
| **React Context**    | Built-in; no dependency                           | Re-render issues; can't access outside React      |
| **Signals (Preact)** | Zero re-renders; fine-grained                     | Not standard React; experimental                  |

### Decision

**Zustand** for global app state. React Context only for theme propagation (since Next.js provides it).

### Rationale

- Three.js event callbacks (onClick3D, onHover3D) run outside React's lifecycle. Zustand's `getState()` and `subscribe()` work anywhere.
- The store is tiny (~20 lines). Zustand's minimal API matches our minimal state.
- No Provider wrapper = one less component in the tree.

---

## ADR-004: Tailwind CSS as Sole Styling Solution

**Date:** 2026-02-26
**Status:** Accepted
**Deciders:** Project Lead

### Context

We need a styling approach that works for both Mode A (rich typography, responsive layouts) and shared components, without adding runtime overhead that would impact Mode B's frame rate.

### Options Considered

| Option                | Pros                                                 | Cons                                              |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| **Tailwind CSS**      | Zero runtime; co-located; tree-shaken; design tokens | Verbose class strings; learning curve             |
| **CSS Modules**       | Scoped; standard CSS                                 | Separate files (lower cohesion); no design system |
| **Styled Components** | Dynamic styles; theming                              | Runtime CSS injection; bundle size; perf in 3D    |
| **Vanilla Extract**   | Zero runtime; type-safe                              | Build complexity; less ecosystem tooling          |

### Decision

**Tailwind CSS** with `tailwind-merge` for class composition and CSS variables for theme tokens.

### Rationale

- Zero runtime = no impact on Mode B's render loop (critical at 60fps)
- Utility classes are co-located with JSX = high cohesion
- `tailwind.config.ts` serves as a single source of truth for design tokens
- PurgeCSS (built-in) ensures only used styles ship

---

## ADR-005: Hybrid Content Strategy (JSON + MDX)

**Date:** 2026-02-26
**Status:** Accepted
**Deciders:** Project Lead

### Context

CV/portfolio content spans two types:

1. **Structured data** — experience entries, skills, education (list-like, queryable)
2. **Rich narrative** — project write-ups, about page (prose with embedded components)

### Decision

- **JSON files** (`data/cv.json`, `data/projects.json`, `data/skills.json`) for structured data, validated by TypeScript interfaces
- **MDX files** (`data/content/**/*.mdx`) for narrative content, compiled via `next-mdx-remote`

### Rationale

- JSON is trivially type-safe with `satisfies` operator and TS interfaces
- MDX supports React components inline (interactive demos, code blocks)
- Version-controlled content = no CMS dependency, instant builds
- Clear separation: JSON = what you've done, MDX = how you explain it

---

## ADR-006: React Three Fiber + Modular Scene Architecture

**Date:** 2026-02-26
**Status:** Accepted
**Deciders:** Project Lead

### Context

Mode B requires a scalable 3D architecture. The MVP is a single interactive scene (3D room/workstation), but the codebase must support expanding to a full 3D world with navigation between areas.

### Decision

**React Three Fiber** with modular scene composition:

- Separate components for `Lights`, `Camera`, `Physics`, `Objects`
- Scene graph mirrors component tree
- DRACO + KTX2 asset pipeline from day one
- `@react-three/rapier` for WASM-based physics

### Rationale

- **Modularity:** Each 3D concern is a React component. Adding a new room = adding a new component.
- **Scalability:** The "Room" component can become a child of a "World" component later. Camera and physics logic remain unchanged.
- **Performance:** DRACO compression (70-90% mesh reduction) + KTX2 textures ensure fast loading even as scene complexity grows.
- **Developer Experience:** Same React DevTools, same component mental model, same TypeScript safety.

### Consequences

- Three.js is a transitive dependency (large, but tree-shaken by R3F)
- 3D development requires Blender proficiency for model creation
- WebGL fallbacks needed for unsupported browsers (Mode A serves as natural fallback)

---

## ADR-007: ecctrl as Character Controller for Mode C Gallery

**Date:** 2025-07-27  
**Status:** Accepted  
**Deciders:** Project Lead

### Context

Mode C (Gallery) requires third-person character movement through a 3D museum environment. The player needs WASD/arrow-key movement, mouse-look camera, collision with walls, and a "smooth but goofy" physics feel (springy, slight sliding, bouncy). The controller must integrate with the existing `@react-three/rapier` physics engine already in the project.

### Options Considered

| Option                                  | Pros                                                                                                                                                                                       | Cons                                                                                                             |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **ecctrl (chosen)**                     | Pre-built floating capsule controller; same pmndrs ecosystem as R3F/drei/rapier; configurable spring/damping for movement feel; built-in camera follow; ~20KB; joystick support for mobile | Less control over internals; opinionated camera                                                                  |
| **Custom RigidBody capsule**            | Full control over movement; no new dependency                                                                                                                                              | 500+ LOC of physics math; must implement camera follow, ground detection, slope handling manually; high bug risk |
| **Rapier KinematicCharacterController** | Official Rapier API; well-documented                                                                                                                                                       | No React wrapper; raw imperative API; must manually bridge to R3F; no camera system                              |
| **drei CharacterControls**              | From drei (already installed)                                                                                                                                                              | Newer/less mature; less customizable movement feel; limited documentation at time of evaluation                  |

### Decision

**ecctrl** (`@pmndrs/ecctrl`) — floating capsule character controller built on React Three Fiber + Rapier.

### Rationale

1. **Ecosystem alignment:** ecctrl is from the pmndrs collective (same team as R3F, drei, rapier bindings). It's designed to work seamlessly with our existing stack.
2. **"Goofy" feel via props:** The springy floating capsule design naturally produces the playful, slightly bouncy movement the project requires. Key tuning props: `springK`, `dampingC`, `dragDampingC`, `maxVelLimit`, `turnSpeed`.
3. **Massive scope reduction:** Implementing a physics-based character controller from scratch (ground detection, slope handling, step climbing, camera orbit, collision response) would be 500-800 lines of fragile physics code. ecctrl provides all of this out of the box.
4. **Tiny footprint:** ~20KB gzipped — well within our per-mode budget.
5. **Mobile-ready:** Built-in joystick support via `EcctrlJoystick` for future mobile/touch support.

### Consequences

- One new dependency to maintain (`ecctrl ^1.0.97`)
- Camera behavior is somewhat opinionated — orbital follow camera with configurable distance/angle
- Movement feel is tied to ecctrl's floating capsule physics model (advantage for "goofy," but limits realistic movement if ever needed)
- Must stay on compatible `@react-three/rapier` versions (currently both target Rapier 0.14+)

---

## ADR-008: FBX Direct Loading via drei useFBX (No GLB Conversion)

**Date:** 2026-02-27  
**Status:** Accepted  
**Deciders:** Project Lead

### Context

Mode C required a 3D robot character model. The original plan (Gallery_Architecture.md) specified converting the FBX model to GLB using `gltf-pipeline` or `gltfjsx`, then loading the GLB. The robot model (`Robot.fbx` from Quaternius, CC0 license) was pre-existing in the `e2e/AnimatedRobot/` folder with 15 animation FBX files.

### Options Considered

| Option                               | Pros                                                                             | Cons                                                                     |
| ------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **FBX → GLB conversion pipeline**    | Smaller file, DRACO compression, gltfjsx generates typed component               | Extra build step; conversion can lose animation data; toolchain friction |
| **drei useFBX (direct, chosen)**     | Zero conversion; animations load cleanly; simpler pipeline; drei handles caching | Larger asset size; no DRACO; FBX is proprietary format                   |
| **drei useGLTF with manual convert** | GLTF is web standard; better tooling                                             | Must manually verify all 15 animations survive conversion                |

### Decision

**Direct FBX loading** via drei’s `useFBX` hook + `useFBX.preload()`. All 15 animation FBX files loaded via `useAnimations`.

### Rationale

1. **Animation preservation:** The Robot.fbx model has 15 animation clips in separate FBX files. FBX→GLB conversion frequently drops or corrupts animation data, especially clip names and bone mappings.
2. **Simplicity:** `useFBX` works identically to `useGLTF` from the developer’s perspective. No extra conversion scripts needed.
3. **drei handles caching:** `useFBX.preload("/models/Robot.fbx")` caches the asset. Multiple components can reference the same model without re-downloading.
4. **Working immediately:** The FBX loaded correctly on first attempt with all animations intact. No debugging conversion artifacts.

### Consequences

- FBX is larger than compressed GLB (∼2MB vs ∼500KB). Acceptable for Mode C’s target audience (desktop/modern mobile).
- FBX is Autodesk’s proprietary format. If drei drops FBX support, must convert then.
- NPC robots (`RobotNPC.tsx`) use `SkeletonUtils.clone()` to share the loaded FBX across 7 instances efficiently.

---

## ADR-009: Procedural Geometry over Pre-Made 3D Models (Ready-Pack Failure)

**Date:** 2026-02-27  
**Status:** Accepted  
**Deciders:** Project Lead

### Context

During Session 024, an attempt was made to integrate a pre-made "gallery theme scene" (a Sketchfab GLTF model of a museum interior) to replace the procedural room geometry. The goal was to get a more visually rich gallery environment with less code. A `GalleryThemeScene.tsx` component was created to load and render the GLTF model.

### Options Considered

| Option                                                 | Pros                                                      | Cons                                                                                       |
| ------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Pre-made GLTF scene (Sketchfab ready-pack)**         | High visual fidelity; artist-quality environment          | Geometry doesn’t align with physics colliders; style mismatch; coordinate chaos; fragile   |
| **Procedural geometry + decorative overlays (chosen)** | Full control; colliders match perfectly; style-consistent | More code; simpler visual fidelity; requires manual decoration pass                        |
| **Hybrid (ready-pack + manual collider overlay)**      | Best of both worlds in theory                             | Tedious manual collider placement; changes to model break colliders; maintenance nightmare |

### Decision

**Stay fully procedural.** The ready-pack GLTF was abandoned. Instead, the gallery was enhanced with procedural decorations: `LobbyDecor.tsx` (ServerTower, BinaryHelix, benches, plants, stanchions), `WallPattern.tsx` (two-zone wall treatment), `CeilingFixture.tsx`, `DadoRail.tsx`, `WallSconce.tsx`, and `NPC robots`.

### Rationale

1. **Physics alignment:** Procedural Box/Plane geometry has exact 1:1 correspondence with Rapier CuboidColliders. Pre-made models have arbitrary geometry that requires manual collider approximation — error-prone and fragile.
2. **Style consistency:** The existing gallery has a cohesive procedural aesthetic (clean walls, geometric exhibits, glowing accents). The Sketchfab model had a completely different art style that clashed visually.
3. **Scale/coordinate alignment:** The GLTF model’s coordinate system, scale, and origin point didn’t match the existing room dimensions. Fixing this required per-mesh transforms that broke whenever the model was updated.
4. **Maintainability:** With procedural geometry, adding a new room decoration = adding a React component with typed props. With a ready-pack, changes require re-exporting from Blender or the source tool.
5. **Performance:** Procedural geometry is lightweight (<5KB per room). The ready-pack GLTF was 3MB+ with textures.

### Consequences

- `GalleryThemeScene.tsx` is kept in the codebase as a reference but is not rendered.
- Future visual enhancements must be procedural or use small, focused GLTF models (e.g., a single sculpture) rather than complete scene replacements.
- The lesson: for physics-based interactive environments, always build geometry that matches colliders.

---

## ADR-010: Direct JSON Editing Then site.config.ts Sync

**Date:** 2026-02-28  
**Status:** Accepted  
**Deciders:** Project Lead

### Context

The content management pipeline was designed as: `site.config.ts` → `pnpm sync-config` → `src/data/*.json`. However, during Session 028 (CV data integration), all JSON files were edited directly from the extracted CV text, bypassing site.config.ts. This was faster for bulk data entry. Then in Session 029, `site.config.ts` was synced to match the JSON files (source-of-truth was temporarily inverted).

### Decision

**Allow bidirectional editing** — either edit `site.config.ts` and sync down, or edit JSON directly and sync `site.config.ts` up. The canonical pipeline remains `site.config.ts` → JSON, but for bulk data entry, direct JSON editing is acceptable as long as `site.config.ts` is synced afterward.

### Rationale

1. **Pragmatism:** Entering 2 experience entries, 3 education entries, 4 projects, 6 skill categories, and 5 certifications into a TypeScript config file is tedious. JSON is more natural for bulk structured data.
2. **Type safety preserved:** After direct JSON editing, `site.config.ts` was updated to match, so `pnpm type-check` still validates the canonical source.
3. **No tooling change needed:** The `sync-config.ts` script already validates and transforms. Running it after syncing `site.config.ts` confirms consistency.

### Consequences

- Developers must remember to sync `site.config.ts` after direct JSON edits (or the pipeline source becomes stale).
- The JSON files remain the runtime source of truth for the app. `site.config.ts` is the authoring source of truth for humans.
- This is a pragmatic escape hatch, not the recommended workflow for small edits.

```markdown
## ADR-XXX: [Title]

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-XXX
**Deciders:** [Names]

### Context

[What is the issue? What forces are at play?]

### Options Considered

[Table of options with pros/cons]

### Decision

[What was decided]

### Rationale

[Why this option was chosen]

### Consequences

[What becomes easier or harder as a result]
```
