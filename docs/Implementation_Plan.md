# 📋 Implementation Plan — WebsiteCV

> **Created:** 2025-07-15  
> **Last Updated:** 2026-03-01  
> **Current Phase:** Phase 6 Complete — Real CV Data Integrated & Gallery Fully Decorated

This document provides a **step-by-step implementation guide** for an LLM to follow when continuing development. Each step includes context, substeps, dependencies, and execution tips.

---

## How to Use This Plan

1. **Before starting work:** Read this document to understand where we are
2. **Pick the next uncompleted step** in sequence (steps are ordered by dependency)
3. **Follow the substeps** exactly — they are designed for atomic commits
4. **Update status** in this file after completing each step
5. **Log progress** in `docs/Progress_Log.md` after each session

### Step Status Legend

| Status | Meaning             |
| ------ | ------------------- |
| ✅     | Complete            |
| 🔄     | In Progress         |
| 🔲     | Not Started         |
| ⏸️     | Blocked (see notes) |

---

## Content Management (NEW — Phase 3.5)

> **IMPORTANT:** Content management is now easy! All content is in one file: `site.config.ts`
>
> **Quick workflow:**
>
> 1. Edit `site.config.ts` (in project root)
> 2. Run `pnpm sync-config`
> 3. Done! Changes appear in the website.
>
> See `docs/Tutorial.md` for detailed instructions.

---

## Phase 1: Remaining Tasks (Content Population)

> **NOTE:** With the new content management system, **all content is edited in `site.config.ts`**. Edit this single file, then run `pnpm sync-config` to update JSON files.

### Step 1.1: Populate Real CV Content ✅ Done

**Status:** ✅ Done (Session 028 — extracted from NektariosCV_Text.txt)  
**Depends on:** User provides real data  
**Estimated effort:** 10-15 minutes

**Completed:**

- Extracted real CV data from `NektariosCV_Text.txt` (Session 028)
- Personal info: Nektarios Ioannou, CompTIA-certified Cyber Security & Network Professional
- 2 experience entries (Applied Technology Solutions, Zenon Microsystems)
- 3 education entries (MSc Cyber Security, BSc Information Technology, Pearson Btec L5)
- All JSON files updated directly, then `site.config.ts` synced in Session 029

**Workflow:**

1. Open `site.config.ts` in project root
2. Edit `PERSONAL` section (name, title, tagline, bio, location)
3. Edit `CONTACT` section (email, phone, links)
4. Edit `EXPERIENCE` array (jobs with company, role, dates, highlights)
5. Edit `EDUCATION` array (schools, degrees, dates)
6. Run `pnpm sync-config` to update JSON files
7. Start dev server: `pnpm dev`

### Step 1.2: Populate Real Projects ✅ Done

**Status:** ✅ Done (Session 028)  
**Depends on:** User provides project data  
**Estimated effort:** 5-10 minutes

**Completed:**

- 4 real projects: Interactive 3D Portfolio, Home Network Lab, CyberSafe Awareness, Threat Detection Dashboard
- Each has real tech stacks, descriptions, and GitHub links
- Images can be added later to `public/images/projects/`

**Workflow:**

1. Open `site.config.ts` in project root
2. Edit `PROJECTS` array (title, description, tech, links, featured flag)
3. Add project images to `public/images/projects/` (if provided)
4. Run `pnpm sync-config`

### Step 1.3: Populate Real Skills ✅ Done

**Status:** ✅ Done (Session 028)  
**Depends on:** User provides skill data  
**Estimated effort:** 5 minutes

**Completed:**

- 6 skill categories: Network & Infrastructure, Cyber Security, Programming & Development, Cloud & DevOps, Operating Systems, Security Tools & Platforms
- Each with proficiency levels and individual skills
- Also added 5 real certifications (CompTIA Security+, Network+, CySA+, etc.)

**Workflow:**

1. Open `site.config.ts` in project root
2. Edit `SKILLS` array (categories and individual skills)
3. Proficiency values: `beginner | intermediate | advanced | expert`
4. Run `pnpm sync-config`

---

## Phase 2: Mode B (Immersive 3D Experience)

> **Goal:** Build an interactive 3D room where users can explore CV content spatially. This is the most complex phase — break into small, testable increments.

### Step 2.1: Research 3D Best Practices ✅

**Status:** Complete (Session 004)  
**Depends on:** None  
**Estimated effort:** 30 min research

**Substeps:**

1. Fetch React Three Fiber documentation (canvas setup, basics)
2. Fetch @react-three/drei documentation (useGLTF, Html, OrbitControls, Environment)
3. Fetch @react-three/rapier documentation (physics setup)
4. Research Bruno Simon's portfolio for interaction patterns
5. Research loading strategies for 3D assets (progressive loading, preload)
6. Document findings in `docs/Research_3D.md` (optional but recommended)

**LLM Tips:**

- Use `fetch_webpage` tool for docs:
  - https://r3f.docs.pmnd.rs/getting-started/introduction
  - https://drei.docs.pmnd.rs/
  - https://rapier.rs/docs/user_guides/javascript/getting_started_js
- Look for code examples of:
  - SSR-safe R3F canvas (ssr: false or dynamic import)
  - Model loading with Suspense
  - Click interactions on 3D objects
  - HTML overlays in 3D space
- Check for common pitfalls (hydration errors, memory leaks)

### Step 2.2: Set Up R3F Canvas Infrastructure ✅

**Status:** Complete (Session 004) — Created Scene.tsx, CameraRig.tsx  
**Depends on:** Step 2.1 (research)  
**Estimated effort:** 1 hour

**Substeps:**

1. Create `src/modes/mode-b/components/Scene.tsx` — the main R3F Canvas component
2. Wrap Canvas in Suspense with loading fallback
3. Add basic fog, background color, and ambient lighting
4. Create `src/modes/mode-b/components/CameraRig.tsx` with OrbitControls
5. Set camera limits (min/max distance, vertical angle limits)
6. Update `ModeBRoot.tsx` to render the Scene
7. Test: Navigate to `/immersive`, verify canvas renders without hydration errors
8. Run `pnpm type-check && pnpm lint && pnpm build` — must pass

**LLM Tips:**

- Use `'use client'` directive on all R3F components
- The page already uses `dynamic` with `ssr: false` — verify this is preserved
- Start minimal: just a colored background + a test Box geometry
- Use drei's `<OrbitControls>` for camera — it handles touch + mouse
- Set `makeDefault` on OrbitControls for automatic camera binding

**Code Pattern:**

```tsx
// Scene.tsx
'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { CameraRig } from './CameraRig';

export function Scene() {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
      <Suspense fallback={null}>
        <CameraRig />
        <ambientLight intensity={0.5} />
        {/* Scene content here */}
      </Suspense>
    </Canvas>
  );
}
```

### Step 2.3: Create Loading Screen ✅

**Status:** Complete (Session 004) — Created Loader.tsx with useProgress + Framer Motion  
**Depends on:** Step 2.2 (canvas works)  
**Estimated effort:** 45 min

**Substeps:**

1. Create `src/modes/mode-b/components/Loader.tsx` using drei's `useProgress`
2. Display percentage + optional progress bar
3. Use Framer Motion for smooth entrance/exit animations
4. Add "Enter Experience" button after loading complete (optional)
5. Wire loader into Scene.tsx Suspense fallback
6. Test with a slow 3G network throttle in DevTools

**LLM Tips:**

- drei's `useProgress` hook gives `progress`, `loaded`, `total`, `active`
- Use CSS `pointer-events: none` on loader overlay when hidden
- Consider `AnimatePresence` for exit animation
- The loader must cover the entire viewport (fixed position, z-50)

### Step 2.4: Create Placeholder Room Geometry ✅

**Status:** Complete (Session 004) — Created Room.tsx with floor, walls, desk, monitor  
**Depends on:** Step 2.2  
**Estimated effort:** 30 min

**Substeps:**

1. Create `src/modes/mode-b/components/Room.tsx` with basic box geometries
2. Add floor (plane), walls (boxes), simple desk (boxes)
3. Use MeshStandardMaterial with neutral colors
4. Add a placeholder "monitor" object (box or plane)
5. Position camera to view the room nicely
6. Test: Verify geometry renders, orbit controls work

**LLM Tips:**

- Use drei's `<Box>`, `<Plane>` for faster prototyping
- Position elements using Three.js coordinate system (Y is up)
- Keep material colors as CSS variables or constants for theming
- This is a **placeholder** — real models come later

### Step 2.5: Add Lighting System ✅

**Status:** Complete (Session 004) — Created RoomLights.tsx with Environment IBL + 3-point lighting  
**Depends on:** Step 2.4 (room exists)  
**Estimated effort:** 30 min

**Substeps:**

1. Create `src/modes/mode-b/lights/RoomLights.tsx`
2. Add ambient light (low intensity, for fill)
3. Add directional light (sun simulation, casts shadows)
4. Add point light (desk lamp simulation)
5. Enable soft shadows using drei's `<SoftShadows>` or `ContactShadows`
6. Configure shadow map quality (balance perf vs quality)
7. Test on mobile — ensure framerate stays above 30fps

**LLM Tips:**

- Shadow maps are expensive — use `shadow-mapSize={[1024, 1024]}` max
- Consider `<BakeShadows>` for static scenes (better perf)
- Use `<Environment preset="apartment">` for quick HDRI lighting
- drei's `<ContactShadows>` is cheaper than real shadows

### Step 2.6: Implement Interactive Objects ✅

**Status:** Complete (Session 004) — Created InteractiveObject.tsx with hover, click, Html labels  
**Depends on:** Step 2.4 (room exists)  
**Estimated effort:** 1 hour

**Substeps:**

1. Create `src/modes/mode-b/components/InteractiveObject.tsx` — reusable wrapper
2. Add hover state (scale up slightly, change cursor to pointer)
3. Add click handler that emits an event or calls a callback
4. Create specific objects: `Monitor.tsx`, `Bookshelf.tsx`, `PhotoFrame.tsx`
5. Each object has a `contentType` prop: 'projects' | 'about' | 'skills' | etc.
6. Test: Click object → console.log the contentType

**LLM Tips:**

- Use `@react-three/fiber`'s `onPointerOver`, `onPointerOut`, `onClick` on meshes
- For cursor change: `document.body.style.cursor = 'pointer'`
- Use `<useCursor>` hook from drei for cleaner cursor handling
- Hover glow effect: use `<Outlines>` from drei or a custom shader
- Keep interaction simple — no physics needed yet

**Code Pattern:**

```tsx
function InteractiveObject({ children, onClick }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
      scale={hovered ? 1.05 : 1}
    >
      {children}
    </group>
  );
}
```

### Step 2.7: Add HTML Overlays (Content Panels) 🔲

**Status:** Not Started  
**Depends on:** Step 2.6 (interactive objects work)  
**Estimated effort:** 1.5 hours

**Substeps:**

1. Create `src/modes/mode-b/components/ContentPanel.tsx` using drei's `<Html>`
2. Panel displays CV content based on selected object
3. Use Zustand store to track `selectedContent: 'projects' | 'about' | null`
4. Panel appears when content selected, positioned near the clicked object
5. Add close button on panel
6. Style panel with Tailwind (dark glass-morphism card)
7. Add Framer Motion entrance/exit animation for panel
8. Test: Click monitor → projects panel appears → click close → panel hides

**LLM Tips:**

- drei's `<Html>` component renders DOM inside 3D space
- Use `transform` prop to make it face camera, `distanceFactor` for scaling
- Consider `occlude` prop to hide when behind objects
- Panel content should reuse existing section components if possible
- For complex content, render a modal outside the Canvas (simpler)

### Step 2.8: Implement Camera Transitions 🔲

**Status:** Not Started  
**Depends on:** Step 2.6, Step 2.7  
**Estimated effort:** 1 hour

**Substeps:**

1. Create `src/modes/mode-b/hooks/useCameraTransition.ts`
2. Define camera positions for each content type (monitor view, bookshelf view, etc.)
3. Use drei's `<CameraControls>` or GSAP for smooth camera animation
4. On object click: animate camera to focus position
5. On panel close: animate camera back to default overview
6. Disable OrbitControls during transition, re-enable after
7. Test: Click various objects, verify smooth transitions

**LLM Tips:**

- drei's `<CameraControls>` has built-in smooth transitions
- Alternatively: use `useFrame` with lerp for manual interpolation
- Store target camera positions in constants file
- Consider zoom level — user should still see context around panel
- Add `transitionDuration` to constants for tuning

### Step 2.9: Add 3D Model Support (GLTF) 🔲

**Status:** Not Started  
**Depends on:** Step 2.4  
**Estimated effort:** 1 hour (setup) + model creation time

**Substeps:**

1. Create `public/models/` directory structure
2. Create placeholder `.glb` file (simple desk model from Sketchfab or made in Blender)
3. Install `@types/three` if not present (already installed)
4. Create `src/modes/mode-b/components/DeskModel.tsx` using `useGLTF`
5. Use drei's `<DRACO>` loader for compressed models
6. Add DRACO decoder files to `public/` (from drei CDN or self-hosted)
7. Replace placeholder geometry with loaded model
8. Test: Model loads without errors

**LLM Tips:**

- drei's `useGLTF.preload('/models/desk.glb')` for eager loading
- Check model in Three.js editor first to understand structure
- Use `gltfjsx` CLI tool to generate typed components from models
- Start with a simple model — complex scenes cause performance issues
- For MVP: one room model is enough, don't over-scope

### Step 2.10: Create Asset Optimization Pipeline 🔲

**Status:** Not Started  
**Depends on:** Step 2.9 (models loading)  
**Estimated effort:** 1 hour

**Substeps:**

1. Install `gltf-transform` CLI: `pnpm add -D @gltf-transform/cli`
2. Create `scripts/optimize-models.mjs` script
3. Add DRACO compression to script
4. Add texture optimization (resize, compress)
5. Add `pnpm script` to package.json: `"optimize:models": "node scripts/optimize-models.mjs"`
6. Document asset workflow in `docs/Asset_Pipeline.md`
7. Test: Run script on a model, verify size reduction

**LLM Tips:**

- gltf-transform CLI: `gltf-transform optimize input.glb output.glb --compress draco`
- KTX2 texture compression requires additional setup — defer to Phase 3 if complex
- Recommended model budget: < 1MB per model, < 5MB total scene
- Use `gltf-transform inspect` to analyze model contents

### Step 2.11: Add Physics (Optional for MVP) 🔲

**Status:** Not Started  
**Depends on:** Step 2.9  
**Estimated effort:** 1.5 hours

> **Note:** Physics is optional for MVP. Skip if time-constrained.

**Substeps:**

1. Create `src/modes/mode-b/physics/PhysicsWorld.tsx` wrapper
2. Wrap scene in `<Physics>` provider from @react-three/rapier
3. Add `<RigidBody type="fixed">` to room/floor
4. Add simple physics objects for testing (falling box)
5. Configure gravity and damping
6. Test: Objects fall realistically, collide with floor

**LLM Tips:**

- Rapier is WASM-based — may have SSR issues, use dynamic import
- Start with `type="fixed"` for static geometry (walls, floor)
- Use `type="dynamic"` only for moving objects
- Physics adds significant bundle size — measure impact

### Step 2.12: Final Integration & Testing 🔲

**Status:** Not Started  
**Depends on:** All Step 2.x  
**Estimated effort:** 1 hour

**Substeps:**

1. Test full flow: Hub → Click Mode B → Loading → Room → Click objects → View content → Return to Hub
2. Test on mobile (touch controls, performance)
3. Test reduced motion (respect `prefers-reduced-motion`)
4. Run `pnpm type-check && pnpm lint && pnpm build`
5. Profile with Chrome DevTools (memory, FPS)
6. Fix any issues found
7. Update Roadmap.md — mark Phase 2 complete

**LLM Tips:**

- Use React DevTools Profiler to find re-render issues
- Check Three.js stats panel (drei's `<Stats>`) for FPS/memory
- Test with "Slow 3G" network throttle for loading UX
- Ensure no console errors or warnings

---

## Phase 3: Polish & Production

> **Goal:** Make the site production-ready with accessibility, performance, SEO, and testing.

### Step 3.1: Accessibility Audit & Fixes ✅

**Status:** Complete (Session 006)  
**Depends on:** Phase 2 complete  
**Estimated effort:** 2 hours

**Substeps:**

1. ~~Install axe-core: `pnpm add -D @axe-core/react`~~ (deferred)
2. ~~Run axe audit on all pages~~ (deferred)
3. Fix keyboard navigation (focus order, skip links) ✅
4. Add ARIA labels to interactive elements ✅
5. ~~Add screen reader announcements for mode switches~~ (deferred)
6. ~~Test with VoiceOver (macOS) or NVDA (Windows)~~ (deferred)
7. Implement `prefers-reduced-motion` across all animations ✅ (hook exists: useReducedMotion)
8. ~~Verify color contrast meets WCAG AA (4.5:1 for text)~~ (deferred)

**Completed:**

- Created `src/components/ui/SkipLink.tsx` for keyboard skip navigation
- Added `id="main-content"` to HubLanding, ModeARoot, and Mode B layout
- All pages now have proper skip link targets

**LLM Tips:**

- Use `pnpm add -D eslint-plugin-jsx-a11y` and add to ESLint config
- Focus order should match visual order
- 3D scenes are inherently inaccessible — provide skip link to Mode A
- Use `role="application"` on Canvas with keyboard instruction overlay

### Step 3.2: Performance Optimization ✅

**Status:** Complete (Session 006)  
**Depends on:** Phase 2 complete  
**Estimated effort:** 2 hours

**Substeps:**

1. ~~Run Lighthouse audit on Mode A (target: 95+ performance)~~ (deferred - manual task)
2. Analyze bundle with `@next/bundle-analyzer` ✅
3. Verify Mode B code doesn't appear in Mode A bundle ✅ (dynamic imports ensure separation)
4. ~~Optimize images (webp, responsive srcset)~~ (deferred)
5. Add font `display: swap` (already done) ✅
6. Verify lazy loading works for dynamic imports ✅
7. ~~For Mode B: reduce draw calls, use instancing for repeated objects~~ (deferred)
8. ~~Test on low-end device (4x CPU slowdown in DevTools)~~ (manual)

**Completed:**

- Installed `@next/bundle-analyzer` and `cross-env`
- Added `pnpm analyze` script for bundle analysis
- Updated `next.config.ts` with bundle analyzer integration

**LLM Tips:**

- Install bundle analyzer: `pnpm add -D @next/bundle-analyzer`
- Update `next.config.ts` to enable analyzer
- Look for unexpectedly large chunks
- Target metrics: LCP < 2.5s, FID < 100ms, CLS < 0.1
- 3D perf: aim for 60fps on desktop, 30fps on mobile

### Step 3.3: SEO Implementation ✅

**Status:** Complete (Session 006)  
**Depends on:** Content populated (Step 1.x) or sample data acceptable  
**Estimated effort:** 1.5 hours

**Substeps:**

1. Add JSON-LD structured data (Person + CreativeWork schemas) ✅
2. Create `src/app/opengraph-image.tsx` for dynamic OG images ✅
3. Verify all pages have unique titles and descriptions ✅
4. Create `public/sitemap.xml` or use Next.js generateSitemap ✅
5. Create `public/robots.txt` ✅
6. ~~Test with Google Rich Results Test~~ (manual)
7. ~~Test with Facebook Sharing Debugger~~ (manual)
8. ~~Test with Twitter Card Validator~~ (manual)

**Completed:**

- Created `src/components/seo/JsonLd.tsx` with Person, WebSite, and ProfilePage schemas
- Created `src/app/opengraph-image.tsx` for dynamic OG image generation (Edge runtime)
- Created `src/app/sitemap.ts` for dynamic sitemap generation
- Created `public/robots.txt` with sitemap reference
- Integrated JsonLd component into root layout

**LLM Tips:**

- Use Next.js 16's file-based metadata (opengraph-image.tsx)
- JSON-LD goes in a `<script type="application/ld+json">` in layout
- For sitemap: use `next-sitemap` package or manual file
- Schema.org types: `Person`, `WebSite`, `CreativeWork`

### Step 3.4: Testing Setup ✅

**Status:** Complete (Session 006)  
**Depends on:** Core functionality complete  
**Estimated effort:** 2 hours

**Substeps:**

1. Install Vitest: `pnpm add -D vitest @testing-library/react happy-dom` ✅
2. Configure Vitest in `vitest.config.mts` ✅
3. Write unit tests for utilities (`cn`, `formatDate`, `fallback`) ✅
4. Write unit tests for hooks (`useMediaQuery`, `useReducedMotion`) ✅
5. Install Playwright: `pnpm add -D @playwright/test` ✅
6. Write E2E test: Hub → Mode A navigation ✅
7. Write E2E test: Hub → Mode B → back to Hub ✅
8. Add test scripts to package.json ✅
9. Run all tests, ensure passing ✅ (83 unit tests pass as of Session 029)

**Completed:**

- Installed Vitest, @testing-library/react, happy-dom, @vitejs/plugin-react
- Created `vitest.config.mts` with path aliases and happy-dom environment
- Created `vitest.setup.mts` with cleanup and matchMedia mock
- Created `src/lib/utils.test.ts` with 12 tests for cn, formatDate, fallback
- Created `src/hooks/useMediaQuery.test.ts` with 3 tests
- Installed Playwright and created `playwright.config.ts`
- Created `e2e/navigation.spec.ts` with Hub navigation and accessibility tests
- Added scripts: `test`, `test:run`, `test:coverage`, `test:e2e`
- **Session 016:** Added 37 gallery tests (useGalleryStore + useExhibitData)
- **Session 018:** Added 31 more tests (RobotCharacter, Player, camera store)
- **Total:** 83 unit tests across 5 test files, all passing

**LLM Tips:**

- Start with utility tests — they're simplest
- For hook tests, use `@testing-library/react`'s `renderHook`
- Playwright E2E: focus on critical user paths
- Set up CI later (GitHub Actions) — for now, local testing is enough

---

## Phase 4: Advanced Features (Future)

> **Status:** Ideas only — implement after Phase 3 based on priorities

### Step 4.1: Blog Section 🔲

- Add `/blog` route with MDX-powered posts
- Create blog index page with post previews
- Add post reading time, publish date, tags
- Add syntax highlighting for code blocks

### Step 4.2: Contact Form 🔲

- Create API route `/api/contact`
- Add rate limiting (upstash/ratelimit or similar)
- Form with name, email, message fields
- Send email via Resend or SendGrid

### Step 4.3: Mode C — Gallery (3D Museum) ✅ Planned

- **Moved to Phase 5** — see detailed Gallery implementation plan below
- Architecture document: `docs/Gallery_Architecture.md`
- 8 sub-phases (G1–G8) with full step-by-step instructions

### Step 4.4: Internationalization 🔲

- Set up `next-intl` or similar
- Create translation files for 2+ languages
- Add language switcher to Hub

### Step 4.5: PWA Support 🔲

- Add manifest.json
- Configure service worker
- Add offline fallback page

### Step 4.6: CI/CD Pipeline 🔲

- Create `.github/workflows/ci.yml`
- Run lint, type-check, tests on PR
- Deploy preview to Vercel on PR
- Deploy to production on merge to main

---

## Phase 5: Gallery Mode — "The Digital Art Gallery" (Mode C)

> **Status:** ✅ All 8 Sub-Phases Complete — Gallery Fully Operational & Decorated  
> **Goal:** Build a 3D museum/gallery that users explore in third-person, discovering CV content as interactive exhibits.  
> **Architecture:** See `docs/Gallery_Architecture.md` for full details (tech research, state design, file tree, performance budget).  
> **New dependency:** `ecctrl` (floating capsule character controller) — see ADR-007.

### Phase G1: Foundation & Scaffolding ✅

**Status:** Complete  
**Depends on:** Phase 3.5 complete (current state)  
**Estimated effort:** 1–2 hours

**Substeps:**

1. Install `ecctrl`: `pnpm add ecctrl`
2. Create route `src/app/(modes)/gallery/page.tsx` — Server Component with metadata
3. Create `src/modes/mode-c/ModeCLoader.tsx` — `next/dynamic` with `ssr: false`
4. Create `src/modes/mode-c/ModeCRoot.tsx` — Canvas + Suspense + Physics wrapper
5. Register Mode C in `src/modes/registry.ts` (add `modeCConfig`)
6. Add `MODE_C: '/gallery'` to `src/lib/constants.ts` ROUTES
7. Create `src/modes/mode-c/stores/useGalleryStore.ts` — Zustand store skeleton
8. Create barrel exports: `src/modes/mode-c/index.ts`, `components/index.ts`, `hooks/index.ts`
9. **Test:** Navigate to `/gallery`, see blank Canvas. Run `pnpm type-check && pnpm lint && pnpm build`.

**LLM Tips:**

- Follow Mode B patterns exactly — same dynamic import / SSR-safe approach
- The Physics provider from `@react-three/rapier` wraps the entire scene
- Start with `<Physics gravity={[0, -9.81, 0]}>` and a test Box with RigidBody
- useGalleryStore interface is defined in `Gallery_Architecture.md` Section 6

---

### Phase G2: Character Controller & Movement ✅

**Status:** Complete  
**Depends on:** G1  
**Estimated effort:** 1–2 hours

**Substeps:**

1. Create `src/modes/mode-c/components/Player.tsx` — ecctrl-based character
2. Configure ecctrl props for "goofy" movement feel:
   - `maxVelLimit={3}`, `turnSpeed={8}`, `sprintMult={1.6}`
   - `dragDampingC={0.08}`, `springK={0.8}`, `dampingC={0.05}`
   - `camInitDis={-6}`, `camMaxDis={-10}`, `camMinDis={-3}`
3. Add capsule mesh as placeholder character body (inside ecctrl)
4. Create `src/modes/mode-c/hooks/usePlayerControls.ts` — keyboard binding via drei `<KeyboardControls>`
5. Add a ground plane with RigidBody type="fixed" + CuboidCollider
6. Test WASD + mouse-look movement on the ground plane
7. Tune movement params until it feels "smooth but goofy" (springy, slight slide)
8. **Test:** Player can walk around. Camera follows. No clipping through ground. `pnpm build` passes.

**LLM Tips:**

- ecctrl expects to be placed inside `<Physics>` — it creates its own RigidBody
- The `<KeyboardControls>` from drei should wrap the Canvas or be inside it
- Start with default ecctrl props, then tune incrementally
- Test at 60fps — physics feel changes dramatically at low framerates

---

### Phase G3: Lobby Room Construction ✅

**Status:** Complete  
**Depends on:** G2  
**Estimated effort:** 1.5–2 hours

**Substeps:**

1. Create `src/modes/mode-c/components/rooms/Lobby.tsx` — the starting room
2. Build lobby geometry: floor (Box), 4 walls (Box), ceiling (optional)
3. Add RigidBody type="fixed" colliders to all surfaces
4. Create 4 doorway openings in walls (gaps in geometry)
5. Create `src/modes/mode-c/components/rooms/Doorway.tsx`:
   - Visual arch/frame geometry
   - CuboidCollider with `sensor` prop for detection
   - drei `<Text>` label above each door ("Projects", "About Me", "Skills", "Playground")
6. Add ambient + point lighting to the lobby
7. Set player spawn position to lobby center
8. Create `src/modes/mode-c/lib/constants.ts` — room dimensions, door positions, spawn points
9. **Test:** Player spawns in lobby, can walk to doors, sees labels. Colliders prevent walking through walls.

**LLM Tips:**

- Use drei `<Text>` (not Text3D) for door labels — much lighter
- Doorway sensor: `<CuboidCollider sensor args={[1, 2, 0.5]} onIntersectionEnter={handleEnter} />`
- Keep room dimensions reasonable: ~20×20×5 units
- Use `<Billboard>` wrapper on text so labels always face player

---

### Phase G4: Room System & Transitions ✅

**Status:** Complete  
**Depends on:** G3  
**Estimated effort:** 2–3 hours

**Substeps:**

1. Create room components:
   - `src/modes/mode-c/components/rooms/ProjectsRoom.tsx`
   - `src/modes/mode-c/components/rooms/BioRoom.tsx`
   - `src/modes/mode-c/components/rooms/SkillsRoom.tsx`
   - `src/modes/mode-c/components/rooms/PlaygroundRoom.tsx`
2. Each room: unique geometry shape, walls with colliders, doorway back to lobby
3. Create `src/modes/mode-c/components/rooms/RoomManager.tsx`:
   - Reads `currentRoom` from useGalleryStore
   - Renders only the active room (conditional mount/unmount)
   - Wraps each room in `<Suspense>` boundary
4. Create `src/modes/mode-c/hooks/useRoomTransition.ts`:
   - Sensor-triggered transition flow: sensor hit → fade out (Framer Motion overlay) → update store → teleport player → fade in
   - Set `isTransitioning: true` during fade to block input
5. Wire doorway sensors to room transitions
6. Add return doorways in each room back to lobby
7. **Test:** Walk through each door → fade → arrive in correct room → walk back to lobby.

**LLM Tips:**

- Fade overlay is a DOM element (`<AnimatePresence>` + `motion.div`) layered on top of Canvas
- Teleport player by updating ecctrl position ref or re-mounting with new position
- Keep room geometry simple for now — detail comes in G6
- Don't render rooms the player isn't in — massive performance win

---

### Phase G5: Exhibit System & Content Integration ✅

**Status:** Complete (Sessions 014 + 028)  
**Depends on:** G4  
**Estimated effort:** 2–3 hours

**Completed:**

1. ✅ Created `src/modes/mode-c/hooks/useExhibitData.ts` — reads from `src/data/*.json`, maps to exhibit format
2. ✅ Created exhibit components:
   - `ProjectFrame.tsx` — wall-mounted framed project exhibits with glow + click
   - `SkillOrb.tsx` — display case with glowing skill orbs per category
   - `TimelinePlaque.tsx` — stone plaques for experience/education timeline
   - `CertificationPlaque.tsx` — gold-trimmed wall certificate frame (Session 028)
3. ✅ Created `ExhibitPanel.tsx` — side panel overlay with project/skill/cert details
4. ✅ Created `CameraSettingsPanel.tsx` — camera presets UI with custom sliders
5. ✅ Populated rooms with real CV data (Session 028):
   - Projects Room: 4 real project frames
   - Bio Room: 2 experience + 3 education plaques
   - Skills Room: 6 skill category orb displays
   - PlaygroundRoom → "Certifications & Achievements" with 5 real certification plaques
6. ✅ Data flow: `site.config.ts` → `pnpm sync-config` → `src/data/*.json` → `useExhibitData` → room components

**LLM Tips:**

- Data flow: `site.config.ts` → `pnpm sync-config` → `src/data/*.json` → `useExhibitData` → room components
- Use drei `<Html>` for content panels — it's positioned in 3D space but renders DOM
- Proximity detection: simple `useFrame` distance check (player pos vs exhibit pos) is fine for < 20 exhibits
- Store `activeExhibit` in useGalleryStore to coordinate panel state

---

### Phase G6: Interactive Map & Navigation ✅

**Status:** Complete  
**Depends on:** G4  
**Estimated effort:** 1.5–2 hours

**Substeps:**

1. Created `src/modes/mode-c/components/rooms/MapPedestal.tsx`:
   - 3D glowing holographic orb on pedestal in lobby center
   - Hover: glow intensifies, cursor changes, label updates
   - Click: toggle map overlay via store.toggleMap()
2. Created `src/modes/mode-c/components/ui/MapOverlay.tsx`:
   - DOM overlay (Framer Motion animated panel)
   - SVG-based top-down floor plan with 5 room tiles
   - Shows all rooms, current room highlighted (cyan accent), player indicator
   - Click room → close map → fade transition → teleport
   - Visited rooms full color, unvisited rooms dimmed with "?" marker
   - Legend showing current/visited/unexplored states
3. Created `src/modes/mode-c/hooks/useGalleryControls.ts`:
   - M key = toggle map from anywhere
   - Esc = close map or exhibit panel
   - Document-level keydown listener (works even when Canvas has focus)
4. Updated `GalleryHUD.tsx` with clickable Map button
5. Room visit tracking already in useGalleryStore (`visitedRooms` Set)
6. Unvisited rooms shown dimmed with "?" on map
7. **Tested:** M → map opens → click room → teleport. Map button in HUD. Esc closes.

**LLM Tips:**

- Map is pure DOM — no 3D rendering needed
- Use SVG for the floor plan — simple shapes, easy to style
- Player dot position: derive from useGalleryStore `currentRoom` (room-level, not exact position)
- Visited state persists for the session only (reset on page leave)

---

### Phase G7: Visual Polish & Post-Processing _(Partial)_

**Status:** Complete (Sessions 012 + 015)  
**Depends on:** G5, G6  
**Estimated effort:** ~~1–2 hours remaining~~ Done

**Completed (Session 012):**

1. ✅ Gallery-wide color/lighting rework — dark beige/grey palette, reduced lighting (Session 017 fix)
2. ✅ drei `<Environment preset="studio">` + `<ContactShadows>` added to GalleryScene
3. ✅ Character visual redesign — abstract bean person with idle/walk/run animations
4. ✅ Camera tuning — ecctrl FixedCamera mode, panoramic auto-follow
5. ✅ Physics tuning — grounded feel, reduced float, gravity scale
6. ✅ Light-theme HUD, overlays, and back-link styling
7. ✅ Per-room lighting improvements (warm/cool/dramatic per theme)

**Remaining (Completed Session 015):**

1. ✅ `@react-three/postprocessing` Bloom + Vignette — GalleryPostProcessing.tsx
2. ✅ Particle effects — GallerySparkles.tsx (drei Sparkles, golden dust motes)
3. ✅ Mobile joystick — MobileJoystick.tsx (EcctrlJoystick, touch detection)
4. ✅ AdaptiveDpr + PerformanceMonitor — auto-degrade shadows, effects on low FPS
5. ✅ Reduced motion — disables postprocessing, sparkles, instant room transitions
6. **Test:** `pnpm type-check` ✅ | `pnpm lint` ✅ (0 errors) | `pnpm build` ✅ (8/8 routes)

**LLM Tips:**

- drei `<Environment preset="apartment">` gives nice ambient lighting for free
- Bloom only on emissive materials — set `emissiveIntensity` on highlight meshes
- Use `<AdaptiveDpr>` from drei to auto-adjust quality for low-end devices
- Keep draw calls low: merged geometries, instanced meshes where possible

---

### Phase G8: Accessibility, Testing & Optimization ✅

**Status:** Complete (Session 016)  
**Depends on:** G7  
**Estimated effort:** ~~2–3 hours~~ Done

**Completed:**

1. ✅ Accessibility:
   - `aria-label` + `role="img"` on Canvas container
   - `role="application"` + `aria-label` on gallery root container
   - Tab-through room navigation (ScreenReaderContent with keyboard buttons)
   - Screen reader: hidden DOM content with all exhibits (projects, experience, education, skills)
   - `role="dialog"` + `aria-modal` on ExhibitPanel
   - `aria-live="polite"` on GalleryLoader with progress
   - `aria-label` on back-to-hub link
   - Reduced motion: GalleryLoader pulse animation disabled
2. ✅ GalleryHUD: Already exists from G4 — has aria-label on map button
3. ✅ Loading optimization: AdaptiveDpr + PerformanceMonitor (G7)
4. ✅ Tests:
   - Unit: useGalleryStore (17 tests), useExhibitData helpers (20 tests)
   - E2E: gallery.spec.ts (navigation, accessibility, map overlay)
   - Total: 52 unit tests passing, E2E gallery spec created
5. ✅ Performance: PerformanceMonitor auto-degrades; build passes; 8/8 static routes
6. **Test:** All 83 unit tests pass (as of Session 029). Build succeeds. Lint clean.

---

## Appendix: Common Patterns & Tips

### Starting a New Implementation Session

1. Read this plan to find the next uncompleted step
2. Read the latest entry in `Progress_Log.md`
3. Run `pnpm type-check && pnpm lint` to verify clean state
4. Mark the step as 🔄 In Progress
5. Follow substeps
6. Test thoroughly
7. Mark step as ✅ Complete
8. Update `Progress_Log.md`

### When Encountering Errors

1. **Read the error message carefully** — TypeScript errors are usually clear
2. **Check docs** — use `fetch_webpage` for library documentation
3. **Search for solutions** — common patterns exist for most issues
4. **Try alternative approaches** — if one way doesn't work, revert and try another
5. **Don't retry the same fix** — if it failed twice, it's wrong

### Code Quality Checklist

Before completing any step, verify:

- [ ] `pnpm type-check` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes
- [ ] No console errors in browser
- [ ] Mobile responsive (test at 375px width)
- [ ] Dark mode works
- [ ] Reduced motion respected (if animations involved)

### File Organization

- **Components:** Place in the most specific location (mode-specific > shared)
- **Hooks:** In `src/hooks/` if shared, in `src/modes/[mode]/hooks/` if mode-specific
- **Types:** In `src/types/` with barrel export
- **Data:** In `src/data/` as JSON files
- **Constants:** In `src/lib/constants.ts`
- **Utilities:** In `src/lib/utils.ts`

---

## Update Log

| Date       | Updated By | Changes                                                                                                                                                                          |
| ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2025-07-15 | LLM        | Initial plan created covering Phases 1-4                                                                                                                                         |
| 2025-07-27 | LLM        | Added Phase 5: Gallery (G1–G8), updated Step 4.3                                                                                                                                 |
| 2026-03-01 | LLM        | Marked Steps 1.1–1.3 ✅ Done (real CV data, Session 028). Phase G5 ✅ Complete. Updated test count to 83. Updated Phase 5 status to all-complete. Added Session 022–030 context. |
