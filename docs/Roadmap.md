# 🗺 Roadmap — WebsiteCV

> **Last Updated:** 2026-03-01

This document tracks all features, their status, known bugs, technical debt, and future ideas. It is the single source of truth for "what's next."

---

## Phase Legend

| Phase         | Focus                                        | Target      |
| ------------- | -------------------------------------------- | ----------- |
| **Phase 0**   | Architecture, documentation, project setup   | ✅ Complete |
| **Phase 1**   | Hub + Mode A (Minimalist) — fully functional | ✅ Complete |
| **Phase 2**   | Mode B (Immersive) — MVP 3D scene            | ✅ Complete |
| **Phase 3**   | Polish, a11y, performance, SEO, testing      | ✅ Complete |
| **Phase 3.5** | Content management, tutorial, docs           | ✅ Complete |
| **Phase 4**   | Advanced features, Mode B expansion          | Future      |
| **Phase 5**   | Mode C: "The Digital Art Gallery"            | ✅ Complete |
| **Phase 5.5** | Gallery Decorations & Architecture           | ✅ Complete |
| **Phase 6**   | Real CV Data Integration & Metadata Sync     | ✅ Complete |

---

## Phase 0 — Architecture & Documentation _(Complete ✅)_

| Task                                    | Status  | Notes                                             |
| --------------------------------------- | ------- | ------------------------------------------------- |
| Define project vision & goals           | ✅ Done | See conversation history                          |
| Select tech stack                       | ✅ Done | See [Tech_Stack.md](Tech_Stack.md)                |
| Record architectural decisions          | ✅ Done | See [Decisions.md](Decisions.md)                  |
| Create documentation system             | ✅ Done | Structure, Tech Stack, ADR, Roadmap, Contributing |
| Initialize Next.js 16.1.6 project       | ✅ Done | React 19, Turbopack, App Router                   |
| Configure TypeScript 5.9.3 (strict)     | ✅ Done | noUncheckedIndexedAccess + all strict flags       |
| Configure Tailwind CSS v4               | ✅ Done | CSS-based @theme config (no tailwind.config.ts)   |
| Configure ESLint 9 + Prettier           | ✅ Done | Flat config + prettier-plugin-tailwindcss         |
| Set up Husky + lint-staged + commitlint | ✅ Done | Conventional commits enforced                     |
| Create project folder structure         | ✅ Done | See [Structure.md](Structure.md)                  |
| Create ModeConfig interface + registry  | ✅ Done | Plugin system with 2 modes registered             |
| Set up Zustand store skeleton           | ✅ Done | appStore with mode, theme, mobile menu            |
| Create shared hooks                     | ✅ Done | useMode, useMediaQuery, useReducedMotion          |
| Create Hub landing page                 | ✅ Done | HubLanding + ModeCard components                  |
| Create route layouts + pages            | ✅ Done | /minimalist + /immersive with dynamic imports     |
| Set up MDX infrastructure               | ✅ Done | mdx-components.tsx + sample content               |
| Prepare sample data files (JSON)        | ✅ Done | cv.json, projects.json, skills.json               |
| Production build validation             | ✅ Done | `pnpm build` passes, all routes static            |

---

## Phase 1 — Hub + Mode A (Minimalist) _(Complete ✅)_

| Task                                   | Status         | Notes                                                 |
| -------------------------------------- | -------------- | ----------------------------------------------------- |
| **Hub Landing Page**                   |                |                                                       |
| ├─ Profile picture + hero section      | ✅ Done        | Animated hero with name, tagline, social links        |
| ├─ Mode selector component             | ✅ Done        | Reads from registry, staggered entrance               |
| ├─ Page transitions (Framer Motion)    | ✅ Done        | Staggered fade-in-up, spring hover/tap on cards       |
| └─ Responsive design                   | ✅ Done        | Mobile-first, works at all breakpoints                |
| **Mode A: Layout**                     |                |                                                       |
| ├─ Sidebar/header navigation           | ✅ Done        | Brittany Chiang inspired, sticky sidebar + mobile nav |
| ├─ Section scroll tracking             | ✅ Done        | IntersectionObserver via useActiveSection hook        |
| └─ Responsive breakpoints              | ✅ Done        | Two-column (lg+), single-column + sticky header (<lg) |
| **Mode A: Sections**                   |                |                                                       |
| ├─ About / Bio section                 | ✅ Done        | Data-driven from cv.json                              |
| ├─ Experience timeline                 | ✅ Done        | Card-hover pattern, tech badges, external links       |
| ├─ Projects grid                       | ✅ Done        | Featured flag, GitHub/live links, tech badges         |
| ├─ Skills visualization                | ✅ Done        | Category groups, proficiency dots (4-level)           |
| ├─ Education section                   | ✅ Done        | Same card pattern as experience                       |
| └─ Contact section / footer            | ✅ Done        | CTA button, footer with tech credits + copyright      |
| **Mode A: Content**                    |                |                                                       |
| ├─ Easy content management system      | ✅ Done        | site.config.ts + sync-config script                   |
| ├─ Populate cv.json with real data     | ✅ Done        | Session 028 — real CV from NektariosCV_Text.txt       |
| ├─ Populate projects.json              | ✅ Done        | Session 028 — 5 real projects                         |
| ├─ Populate skills.json                | ✅ Done        | Session 028 — 4 categories from real CV               |
| └─ Write MDX project write-ups         | 🔲 Optional    | Create /content/projects/\*.mdx files                 |
| **Design System**                      |                |                                                       |
| ├─ Typography scale                    | ✅ Done        | Geist + Geist Mono, responsive heading sizes          |
| ├─ Color palette (dark + light)        | ✅ Done        | Teal accent, full neutral scale, CSS variables        |
| ├─ Spacing system                      | ✅ Done        | Tailwind defaults + custom section spacing            |
| └─ Component primitives (Button, Card) | 🔲 Not Started | SectionWrapper created; Button/Card deferred to need  |

---

## Phase 2 — Mode B (Immersive 3D) _(Complete ✅)_

| Task                                 | Status      | Notes                                 |
| ------------------------------------ | ----------- | ------------------------------------- |
| **3D Infrastructure**                |             |                                       |
| ├─ R3F Canvas + Suspense setup       | ✅ Done     | Scene.tsx, ssr: false via ModeBLoader |
| ├─ Camera rig (OrbitControls)        | ✅ Done     | CameraRig.tsx with limits             |
| ├─ Lighting system                   | ✅ Done     | RoomLights.tsx with 3-point lighting  |
| ├─ Physics world (Rapier)            | 🔲 Deferred | Not needed for MVP                    |
| └─ Loading screen / progress bar     | ✅ Done     | Loader.tsx with useProgress           |
| **3D Scene: Room MVP**               |             |                                       |
| ├─ Design room in Blender            | 🔲 Deferred | Using procedural geometry             |
| ├─ Export + DRACO compress           | 🔲 Deferred |                                       |
| ├─ Load room model in R3F            | ✅ Done     | Room.tsx with procedural geometry     |
| ├─ Interactive objects (clickable)   | ✅ Done     | InteractiveObject.tsx                 |
| └─ Hover highlights + cursor changes | ✅ Done     | Emissive material + pointer events    |
| **3D Content Integration**           |             |                                       |
| ├─ HTML overlays (drei Html)         | ✅ Done     | ContentPanel.tsx with CV data         |
| ├─ Smooth camera transitions         | ✅ Done     | useCameraTransition hook              |
| └─ Audio (optional ambient)          | 🔲 Deferred |                                       |
| **State Management**                 |             |                                       |
| └─ Zustand store for Mode B          | ✅ Done     | useModeBStore.ts                      |
| **Asset Pipeline**                   |             |                                       |
| ├─ Set up gltf-transform scripts     | 🔲 Deferred |                                       |
| ├─ KTX2 texture compression          | 🔲 Deferred |                                       |
| └─ Asset loading strategy            | ✅ Done     | Dynamic import with Suspense          |

---

## Phase 3 — Polish & Production _(Complete ✅)_

| Task                             | Status      | Notes                                |
| -------------------------------- | ----------- | ------------------------------------ |
| **Accessibility**                |             |                                      |
| ├─ Keyboard navigation           | ✅ Done     | SkipLink.tsx + main-content IDs      |
| ├─ Screen reader support         | 🔲 Deferred | Manual testing needed                |
| ├─ Reduced motion support        | ✅ Done     | useReducedMotion hook available      |
| └─ Color contrast compliance     | 🔲 Deferred | Manual audit needed                  |
| **Performance**                  |             |                                      |
| ├─ Lighthouse audit (target 95+) | 🔲 Deferred | Manual - Mode A ready                |
| ├─ Bundle analysis               | ✅ Done     | @next/bundle-analyzer configured     |
| ├─ Image optimization audit      | 🔲 Deferred |                                      |
| └─ 3D performance profiling      | 🔲 Deferred | FPS, draw calls, memory              |
| **SEO**                          |             |                                      |
| ├─ Structured data (JSON-LD)     | ✅ Done     | JsonLd.tsx with Person + ProfilePage |
| ├─ Open Graph meta tags          | ✅ Done     | opengraph-image.tsx (dynamic)        |
| ├─ Sitemap generation            | ✅ Done     | sitemap.ts (Next.js native)          |
| └─ robots.txt                    | ✅ Done     | public/robots.txt                    |
| **Testing**                      |             |                                      |
| ├─ Unit tests (Vitest)           | ✅ Done     | 15 tests for utils + hooks           |
| ├─ Component tests (RTL)         | 🔲 Deferred | Happy-dom ready                      |
| └─ E2E tests (Playwright)        | ✅ Done     | navigation.spec.ts                   |

---

## Phase 3.5 — Content Management & Documentation _(Complete ✅)_

| Task                                  | Status  | Notes                                       |
| ------------------------------------- | ------- | ------------------------------------------- |
| **Content Management System**         |         |                                             |
| ├─ Create unified config file         | ✅ Done | site.config.ts — all content in one place   |
| ├─ Create config adapter              | ✅ Done | config-adapter.ts — bridges to data types   |
| ├─ Create sync script                 | ✅ Done | scripts/sync-config.ts + `pnpm sync-config` |
| └─ Update constants.ts                | ✅ Done | Now imports from site.config.ts             |
| **Documentation**                     |         |                                             |
| ├─ Create quick start tutorial        | ✅ Done | docs/Tutorial.md (5-minute read)            |
| ├─ Research CV website best practices | ✅ Done | Brittany Chiang, Josh Comeau, Bruno Simon   |
| ├─ Create suggestions document        | ✅ Done | docs/Suggestions.md with priorities         |
| └─ Update all metadata files          | ✅ Done | Structure.md, Roadmap.md, Progress_Log.md   |

---

## Phase 4 — Advanced Features (Future)

| Task                                   | Status  | Notes                             |
| -------------------------------------- | ------- | --------------------------------- |
| Mode B: Expand room → multi-area world | 🔲 Idea | Navigate between rooms            |
| Mode B: First-person controls (WASD)   | 🔲 Idea | Bruno Simon style                 |
| Blog section (MDX-powered)             | 🔲 Idea | Technical writing                 |
| Analytics dashboard                    | 🔲 Idea | View count, mode preference stats |
| i18n / Multilingual support            | 🔲 Idea |                                   |
| PWA support                            | 🔲 Idea | Offline access                    |
| Contact form (API route)               | 🔲 Idea | With rate limiting                |
| Storybook component docs               | 🔲 Idea |                                   |
| CI/CD pipeline (GitHub Actions)        | 🔲 Idea | Lint, test, preview deploys       |

---

## Phase 5 — Mode C: "The Digital Art Gallery" _(Complete ✅)_

> **Architecture Plan:** See [Gallery_Architecture.md](Gallery_Architecture.md) for full details.  
> **New Dependency:** `ecctrl` (floating capsule character controller)

### Phase G1: R3F Canvas & Scene Init ✅

| Task                                   | Status  | Notes                              |
| -------------------------------------- | ------- | ---------------------------------- |
| Install `ecctrl` dependency            | ✅ Done | ecctrl 1.0.97                      |
| Create ModeConfig (mode-c/index.tsx)   | ✅ Done | id: 'gallery', route: '/gallery'   |
| Create app/gallery/ route              | ✅ Done | layout.tsx + page.tsx              |
| Create ModeCLoader                     | ✅ Done | dynamic import, ssr: false         |
| Create GalleryScene (Canvas + Physics) | ✅ Done | R3F Canvas, Rapier Physics world   |
| Create ModeCRoot                       | ✅ Done | Entry point, Canvas + DOM overlays |
| Create GalleryLights                   | ✅ Done | Museum-style lighting              |
| Create useGalleryStore                 | ✅ Done | Room, player, UI state             |
| Register mode in registry.ts           | ✅ Done | Add to modes array                 |
| Add MODE_C to constants.ts ROUTES      | ✅ Done | MODE_C: '/gallery'                 |

### Phase G2: Physics & Goofy Character Controller ✅

| Task                              | Status  | Notes                                   |
| --------------------------------- | ------- | --------------------------------------- |
| Create constants.ts               | ✅ Done | Physics tuning, room dimensions         |
| Create StickmanCharacter.tsx      | ✅ Done | Procedural cartoony stickman            |
| Create Player.tsx (Ecctrl)        | ✅ Done | Ecctrl wrapper with goofy tuning        |
| Add KeyboardControls to ModeCRoot | ✅ Done | WASD + Space + Shift                    |
| Add physics floor plane           | ✅ Done | RigidBody type="fixed"                  |
| Tune "goofy" movement feel        | ✅ Done | Low damping, bouncy spring, snappy turn |

### Phase G3: Lobby Geometry & Collision Walls ✅

| Task                                 | Status  | Notes                                 |
| ------------------------------------ | ------- | ------------------------------------- |
| Create constants.ts                  | ✅ Done | Room definitions, doorway positions   |
| Create Lobby.tsx                     | ✅ Done | Procedural lobby with doorway cutouts |
| Add wall collision (RigidBody fixed) | ✅ Done | WallWithDoor shared component         |
| Add decorative elements              | ✅ Done | Corner pillars, central map pedestal  |
| Add door labels (Billboard + Text)   | ✅ Done | Drei Text SDF above each doorway      |

### Phase G4: Room Transitions & Doorways ✅

| Task                              | Status  | Notes                                   |
| --------------------------------- | ------- | --------------------------------------- |
| Create WallWithDoor.tsx (sensors) | ✅ Done | CuboidCollider sensor + onDoorwayEnter  |
| Create TransitionOverlay.tsx      | ✅ Done | Framer Motion fade-to-black             |
| Create useRoomTransition.ts       | ✅ Done | State machine with ref-based debounce   |
| Create RoomManager.tsx            | ✅ Done | Conditional mount/unmount rendering     |
| Create stub rooms (4 rooms)       | ✅ Done | Themed rooms with RoomShell + back door |
| Create GalleryHUD.tsx             | ✅ Done | Room name + map button + controls hint  |

### Phase G5: Interactive Map ✅

| Task                         | Status  | Notes                                   |
| ---------------------------- | ------- | --------------------------------------- |
| Create MapPedestal.tsx       | ✅ Done | Glowing holographic orb in lobby center |
| Create MapOverlay.tsx        | ✅ Done | SVG floor plan with clickable rooms     |
| Create useGalleryControls.ts | ✅ Done | M = map, Esc = close                    |
| Teleport-to-room from map    | ✅ Done | Click room → fade transition            |

### Phase G6: Exhibit System (Content ↔ 3D) ✅

| Task                          | Status  | Notes                                 |
| ----------------------------- | ------- | ------------------------------------- |
| Create useExhibitData.ts      | ✅ Done | Session 014 — typed hook + helpers    |
| Create ProjectFrame.tsx       | ✅ Done | Session 014 — wall-mounted frames     |
| Create SkillOrb.tsx           | ✅ Done | Session 014 — display case with orbs  |
| Create TimelinePlaque.tsx     | ✅ Done | Session 014 — stone plaques           |
| Create ExhibitPanel.tsx       | ✅ Done | Session 014 — side panel with layouts |
| Populate rooms with real data | ✅ Done | Session 014 — all rooms data-driven   |

### Phase G7: Polish, Mobile, Post-Processing ✅

| Task                                 | Status  | Notes                                                   |
| ------------------------------------ | ------- | ------------------------------------------------------- |
| Gallery-wide lighting & color rework | ✅ Done | Session 017 — dark beige/grey palette, reduced lighting |
| drei Environment + ContactShadows    | ✅ Done | Session 012 — preset="studio", soft shadows             |
| FixedCamera mode + camera tuning     | ✅ Done | Session 012 — panoramic auto-follow                     |
| Camera presets UI + custom editor    | ✅ Done | Session 018 — 5 presets + sliders, localStorage persist |
| Physics tuning (grounded feel)       | ✅ Done | Session 012 — reduced float, added gravity              |
| Light-theme HUD / overlays           | ✅ Done | Session 012 — white transitions, light HUD              |
| Add mobile joystick (EcctrlJoystick) | ✅ Done | Session 015 — touch devices only                        |
| Add postprocessing (Bloom, Vignette) | ✅ Done | Session 015 — EffectComposer, mipmapBlur                |
| Add particle effects (Sparkles)      | ✅ Done | Session 015 — golden dust motes, room-scaled            |
| Performance audit (AdaptiveDpr)      | ✅ Done | Session 015 — PerformanceMonitor, auto-degrade          |
| Reduced motion support               | ✅ Done | Session 015 — disables effects + instant fade           |
| Tiled floors + baseboard + molding   | ✅ Done | Session 020 — 5 patterns, per-room designs, trim        |

### Phase G8: Character Model & Animations ✅

| Task                                | Status  | Notes                                                             |
| ----------------------------------- | ------- | ----------------------------------------------------------------- |
| Redesign character (bean person)    | ✅ Done | Session 012 — abstract genderless, cartoony                       |
| Procedural idle/walk/run animations | ✅ Done | Session 012 — head tilt, bounce, run speed diff                   |
| Character shadow casting            | ✅ Done | Session 012 — ContactShadows on ground plane                      |
| Upgrade to 3D robot model           | ✅ Done | Session 021 — FBX loaded via drei useFBX, 15 anims, walk/run/idle |

---

## Phase 5.5 — Gallery Decorations & Architecture _(Complete ✅)_

> Sessions 022–027: Rich lobby decorations, room architecture components, wall patterns, and NPC robots.

| Task                                          | Status    | Notes                                                          |
| --------------------------------------------- | --------- | -------------------------------------------------------------- |
| Lobby decoration system (LobbyDecor.tsx)      | ✅ Done   | Session 022 — ServerTower, BinaryHelix sculptures              |
| Gallery benches + stanchion-rope barriers     | ✅ Done   | Session 022 — 3 benches, 2 stanchion barriers, 3 potted plants |
| NPC robot characters in lobby                 | ✅ Done   | Session 023 — 7 robots in 5 groups, cloned FBX, 7 anim poses   |
| Ready-pack 3D model integration attempt       | ❌ Failed | Session 024 — Sketchfab model didn't align with physics/style  |
| Decision: stick with procedural geometry      | ✅ Done   | Session 024 — procedural + decorations is more reliable        |
| Ceiling fixtures (pendant + chandelier)       | ✅ Done   | Session 025 — CeilingFixture.tsx with real pointLights         |
| Dado rails                                    | ✅ Done   | Session 025 — DadoRail.tsx, horizontal chair-rail molding      |
| Wall sconces                                  | ✅ Done   | Session 025 — WallSconce.tsx, wall-mounted light fixtures      |
| Decorative wall patterns (WallPattern.tsx)    | ✅ Done   | Session 026 — geometric medallion + wainscoting, all 4 walls   |
| WallPattern visibility fix                    | ✅ Done   | Session 027 — wallOffset 0.02→0.28                             |
| Baseboard/CrownMolding door gap investigation | 📝 Noted  | Session 027 — non-blocking visual issue documented             |

---

## Phase 6 — Real CV Data Integration & Metadata Sync _(Complete ✅)_

> Sessions 028–029: Populated all data files with real CV content and synced metadata.

| Task                                      | Status  | Notes                                                          |
| ----------------------------------------- | ------- | -------------------------------------------------------------- |
| Extract data from NektariosCV_Text.txt    | ✅ Done | Session 028 — parsed full CV text file                         |
| Populate cv.json with real experience/edu | ✅ Done | Session 028 — 4 experience, 2 education, 3 certifications      |
| Populate projects.json with real projects | ✅ Done | Session 028 — 5 projects with descriptions                     |
| Populate skills.json with real skills     | ✅ Done | Session 028 — 4 categories (Proficient/Familiar/Exposure/Soft) |
| Update about.mdx with real bio            | ✅ Done | Session 028 — full bio with contact info                       |
| Create CertificationPlaque exhibit        | ✅ Done | Session 028 — gold-trimmed wall-mounted certificate frame      |
| Transform PlaygroundRoom → Certifications | ✅ Done | Session 028 — repurposed with certifications content           |
| Fix robot animation variety               | ✅ Done | Session 028 — NPC animation remapping for lobbby               |
| Fix tile z-fighting in Bio/Skills rooms   | ✅ Done | Session 028 — polygonOffset on GalleryFloor materials          |
| Update site.config.ts with real data      | ✅ Done | Session 029 — comprehensive update of all sections             |
| Update robots.txt sitemap URL             | ✅ Done | Session 029 — https://nektarios-i.github.io/sitemap.xml        |
| Update sync-config.ts for certifications  | ✅ Done | Session 029 — added CERTIFICATIONS import + sync               |
| Update package.json metadata              | ✅ Done | Session 029 — added description + author                       |
| Update all documentation files            | ✅ Done | Session 030 — full docs refresh                                |

---

## Known Bugs

| #   | Description                           | Severity | Status        |
| --- | ------------------------------------- | -------- | ------------- |
| 1   | Gallery all-white washout             | Critical | ✅ Fixed S017 |
| 2   | WallPattern invisible (wallOffset)    | Medium   | ✅ Fixed S027 |
| 3   | Tile z-fighting in Bio/Skills rooms   | Medium   | ✅ Fixed S028 |
| 4   | Baseboard/CrownMolding clips at doors | Low      | 📝 Noted S027 |
| —   | No other critical bugs                | —        | ✅ Clear      |

---

## Technical Debt

| #   | Description                               | Priority  | Notes                                        |
| --- | ----------------------------------------- | --------- | -------------------------------------------- |
| 1   | ~~Replace sample data with real CV info~~ | ✅ Done   | Sessions 028-029 — all data files populated  |
| 2   | Add profile image (/public/images/)       | Medium    | Replace placeholder                          |
| 3   | Test all features manually                | Medium    | Run through full user flow                   |
| 4   | ~~Convert robot FBX → GLB + integrate~~   | ✅ Done   | Session 021 — loaded FBX directly via drei   |
| 5   | ~~Ready-pack integration~~                | ❌ Failed | Session 024 — didn't work, stayed procedural |
| 6   | Add project images to /public/images/     | Medium    | screenshots for project exhibits             |
| 7   | Fix baseboard/crown molding at doors      | Low       | Session 027 — visual clip, non-blocking      |

---

## Update Protocol

When updating this file:

1. Move completed tasks from 🔲 to ✅
2. Add new bugs/debt as discovered
3. Update "Last Updated" date
4. If a phase is complete, add a completion date
