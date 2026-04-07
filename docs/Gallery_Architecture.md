# 🎨 Mode C: "The Digital Art Gallery" — Architecture Plan

> **Created:** 2026-02-27  
> **Status:** ✅ All 8 Phases Complete — Gallery Fully Operational & Decorated  
> **Author:** Lead Full-Stack Architect (AI)  
> **Mode ID:** `gallery`  
> **Route:** `/gallery`

---

## Table of Contents

1. [Vision](#1-vision)
2. [Chain of Thought: Research & Tech Selection](#2-chain-of-thought-research--tech-selection)
3. [Final Tech Stack for Gallery Layer](#3-final-tech-stack-for-gallery-layer)
4. [Architecture Overview](#4-architecture-overview)
5. [File Structure](#5-file-structure)
6. [State Management Design](#6-state-management-design)
7. [Phased Implementation Roadmap](#7-phased-implementation-roadmap)
8. [Data Flow: JSON/MDX → Gallery Exhibits](#8-data-flow-jsonmdx--gallery-exhibits)
9. [Performance Budget](#9-performance-budget)
10. [Accessibility Strategy](#10-accessibility-strategy)
11. [Open Questions](#11-open-questions)

---

## 1. Vision

**"The Digital Art Gallery"** — A third-person 3D museum/gallery experience where visitors explore rooms filled with the user's portfolio content.

### Core Concepts

| Element         | Description                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------- |
| **Environment** | A museum/gallery composed of interconnected rooms with exhibition-style displays                  |
| **Lobby**       | Central spawn room with doorways to themed rooms and an interactive floor map                     |
| **Rooms**       | "Projects", "Bio/About", "Skills Lab", "Certifications" — each a themed gallery wing              |
| **Character**   | Quaternius CC0 Robot (FBX, 15 animations) in third-person with "smooth but goofy" movement        |
| **Navigation**  | Walk through doorways, or use the Lobby map for instant teleportation                             |
| **Exhibits**    | Paintings (projects), statues (bio), display cases (skills) — each room has its own art style     |
| **Map**         | Interactive 3D object in the lobby center that opens a 2D overlay showing the full gallery layout |

### Design Principles

1. **"Smooth but Goofy"** — Snappy turns, slightly bouncy physics, subtle sliding. NOT hyper-realistic walking. Think Animal Crossing meets museum simulator.
2. **Anti-Fragile Architecture** — Gallery mode is 100% isolated. Its code never leaks into Mode A or Mode B bundles.
3. **Separation of Concerns** — 3D scene logic, UI overlays, and data are in separate layers connected via Zustand.
4. **Progressive Enhancement** — Gallery works without loading all rooms. Rooms load as the player approaches doorways.
5. **Content-Driven** — All exhibit content comes from the same `site.config.ts` as Mode A and Mode B.

---

## 2. Chain of Thought: Research & Tech Selection

### 2.1 Physics & Character Movement

**Challenge:** We need a physics engine for collision detection (walls, doorways) and a character controller with "goofy/smooth" physics-based movement.

**Step 1 — Evaluate Physics Engines:**

| Engine                                | Bundle Size | Performance           | R3F Integration                          | Verdict                          |
| ------------------------------------- | ----------- | --------------------- | ---------------------------------------- | -------------------------------- |
| **@react-three/rapier** (Rapier WASM) | ~300KB gzip | Excellent (Rust/WASM) | First-class (`<Physics>`, `<RigidBody>`) | ✅ **Selected**                  |
| cannon-es / @react-three/cannon       | ~80KB gzip  | Good (JS)             | Decent but less maintained               | ❌ Less performant               |
| Ammo.js (Bullet WASM)                 | ~500KB gzip | Excellent             | No R3F wrapper                           | ❌ Too heavy, manual integration |
| Custom raycasting                     | 0KB         | N/A                   | Manual                                   | ❌ Not robust enough for rooms   |

**Decision:** `@react-three/rapier` v2.2.0 — **already installed** in our project. WASM-based Rust physics, first-class R3F bindings, automatic collider generation, sensor support for doorway triggers.

**Step 2 — Evaluate Character Controller Approach:**

| Approach                                         | Pros                                                                                                            | Cons                                                                                 | Verdict                              |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------ |
| **ecctrl** (pre-built)                           | Full-featured floating capsule controller, keyboard/touch input, 3rd-person camera, animations, mobile joystick | Extra dependency (~20KB), opinionated defaults, may conflict with our Zustand stores | ✅ **Selected** (with customization) |
| **Custom RigidBody capsule**                     | Full control, no extra dep                                                                                      | 500+ LOC of physics math, months of tuning                                           | ❌ Too much effort                   |
| **KinematicCharacterController** (Rapier native) | Rapier built-in                                                                                                 | Poor R3F ergonomics, manual stepping                                                 | ❌ Complex integration               |

**Decision:** Use **`ecctrl`** (pmndrs/ecctrl) — a floating capsule character controller built specifically for R3F + Rapier. Key reasons:

1. Pre-built 3rd-person camera follow system with `camInitDis`, `camMaxDis`, `camMinDis` props
2. `KeyboardControls` integration (WASD/Arrow keys + Space for jump)
3. Configurable spring/damping forces → perfect for "goofy" feel by increasing `springK`, `dampingC`, `autoBalanceSpringK`
4. Support for "CameraBasedMovement" and "FixedCamera" modes
5. Mobile joystick support via `EcctrlJoystick`
6. Built-in animation state machine (`idle`, `walk`, `run`, `jump`)
7. Same pmndrs ecosystem as our R3F/drei/rapier stack

**"Goofy" Movement Tuning Strategy:**

```typescript
// These ecctrl props create the "smooth but goofy" feel:
<Ecctrl
  maxVelLimit={3}           // Moderate speed (not too fast)
  turnSpeed={8}             // Snappy turns (lower = more goofy drag)
  turnVelMultiplier={0.4}   // Some slip on turns
  jumpVel={5}               // Bouncy jump
  dragDampingC={0.08}       // Low drag = sliding feel
  springK={0.8}             // Lower spring = bouncier float
  dampingC={0.05}           // Low damping = more bounce
  autoBalance={true}
  autoBalanceSpringK={0.2}  // Gentle auto-balance = wobbly corrections
  autoBalanceDampingC={0.02}
  fallingGravityScale={1.8} // Slightly floaty fall
  sprintMult={1.6}          // Sprint is boosted but not crazy
  camInitDis={-6}           // 3rd person camera distance
  camMaxDis={-10}
  camMinDis={-3}
  camFollowMult={8}         // Camera follows with slight lag
  camLerpMult={15}          // Smooth camera lerp
  animated                  // Enable animation states
>
```

### 2.2 3D UI & Interactions

**Challenge:** Text labels above doorways, clickable map in the lobby, exhibit information panels.

**Step 1 — Evaluate 3D Text Approaches:**

| Approach                                  | Quality                                     | Performance               | Ease    | Verdict                    |
| ----------------------------------------- | ------------------------------------------- | ------------------------- | ------- | -------------------------- |
| **drei `<Text>`** (troika-three-text SDF) | High (SDF rendering, crisp at any distance) | Excellent (GPU SDF)       | Simple  | ✅ **For door labels**     |
| **drei `<Text3D>`** (extruded geometry)   | Highest (true 3D)                           | Heavy (geometry per char) | Medium  | 🔲 For special titles only |
| **drei `<Html>`** (DOM overlay)           | Native DOM                                  | Good (GPU compositing)    | Easiest | ✅ **For info panels**     |
| **drei `<Billboard>`**                    | N/A (wrapper)                               | Minimal overhead          | Simple  | ✅ **Combine with Text**   |
| **Texture-based (canvas → texture)**      | Medium                                      | Best                      | Complex | ❌ Overkill                |

**Decision — Multi-tier approach:**

1. **Door labels:** `<Billboard>` + `<Text>` (always faces camera, crisp SDF text, no DOM overhead)
2. **Exhibit info panels:** `<Html>` (full DOM rendering inside 3D space — supports rich content, links, images)
3. **Map title / special 3D text:** `<Text3D>` (only for the lobby "MAP" label — one instance, high visual impact)
4. **Interactions:** Rapier sensors for doorway triggers + raycasting (`onClick` on R3F meshes) for clickable objects

**Step 2 — Evaluate Interaction Patterns:**

| Interaction             | Method                                                      | Why                                                         |
| ----------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| **Doorway transitions** | Rapier `<CuboidCollider sensor>` with `onIntersectionEnter` | Physics-accurate trigger zones, no manual raycasting needed |
| **Map click**           | R3F `onClick` event on mesh + Zustand state                 | Simple pointer event, toggles overlay                       |
| **Exhibit hover**       | R3F `onPointerOver`/`onPointerOut` + cursor change          | Same pattern as Mode B's InteractiveObject                  |
| **Panel close**         | DOM `<button>` in `<Html>` overlay                          | Standard React event handling                               |

### 2.3 State Management: 3D ↔ 2D Communication

**Challenge:** The 3D canvas needs to communicate with Next.js DOM overlays (map UI, exhibit panels, loading states, HUD).

**Evaluation:**

| Approach                                        | Pros                                                                    | Cons                                                                       | Verdict                 |
| ----------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------- |
| **Zustand store** (dedicated `useGalleryStore`) | Works inside & outside React; no Provider; tiny; same pattern as Mode B | —                                                                          | ✅ **Selected**         |
| **React Context**                               | Built-in React                                                          | Doesn't work outside React tree; re-render issues with frequent 3D updates | ❌                      |
| **Event bus**                                   | Decoupled                                                               | Untyped, hard to debug                                                     | ❌                      |
| **R3F `useFrame` + refs**                       | Zero overhead                                                           | Only works inside Canvas                                                   | ❌ Not sufficient alone |

**Decision:** `useGalleryStore` (Zustand) — follows the exact same pattern as `useModeBStore`. The store bridges:

- **3D → DOM:** Player enters a room → store updates `currentRoom` → DOM overlay renders room title
- **DOM → 3D:** User clicks map room → store updates `teleportTarget` → 3D scene teleports character
- **3D → 3D:** Player approaches exhibit → store updates `activeExhibit` → camera adjusts

### 2.4 Asset Pipeline & 3D Models

**Challenge:** Where do 3D models live? How do we avoid cluttering `public/`?

**Decision — Structured asset directory:**

```
public/
├── models/
│   └── gallery/
│       ├── character.glb       ← Player character (capsule + simple mesh)
│       ├── lobby.glb           ← Lobby room geometry (walls, floor, ceiling)
│       ├── room-projects.glb   ← Projects room geometry
│       ├── room-bio.glb        ← Bio room geometry
│       ├── room-skills.glb     ← Skills room geometry
│       ├── room-playground.glb ← Playground room geometry
│       ├── map-pedestal.glb    ← Map interaction pedestal
│       └── furniture/          ← Shared props (frames, pedestals, benches)
│           ├── frame-large.glb
│           ├── frame-medium.glb
│           ├── pedestal.glb
│           └── bench.glb
└── images/
    └── gallery/
        ├── map-layout.webp     ← 2D map overlay background
        └── exhibit-textures/   ← Project screenshots as textures
```

**Phase 1 (MVP) approach:** Use **procedural geometry** (box rooms, simple shapes) just like Mode B does today. No `.glb` files needed initially. This lets us build the full system before investing in art assets.

**Phase 2+ approach:** Replace procedural geometry with Blender-authored `.glb` files. Pipeline:

```
Blender → Export GLB → gltf-transform (DRACO + KTX2) → public/models/gallery/
```

**Loading Strategy:**

- **Lobby:** Loaded immediately on gallery entry (small, required)
- **Adjacent rooms:** Preloaded when player is in lobby (low priority)
- **Distant rooms:** Loaded on-demand when player enters doorway (Suspense boundary per room)

### 2.5 Room Transition System

**Challenge:** How does the player move between rooms? Loading, transitions, doorway behavior.

**Decision — Sensor-based doorway system:**

```
┌─────────────────────────────────────────┐
│                 LOBBY                    │
│                                         │
│    🚪 Projects    🗺️ Map    🚪 Bio     │
│                                         │
│    🚪 Skills              🚪 Playground │
│                                         │
│              🧍 Player                  │
└─────────────────────────────────────────┘
```

Each doorway is a `<CuboidCollider sensor>` trigger zone. When the player enters:

1. **Fade-to-black** overlay (0.5s CSS transition)
2. **Load room** geometry (if not already cached via Suspense)
3. **Teleport** player to room spawn point
4. **Fade-in** (0.5s)
5. **Update** `currentRoom` in store → HUD updates

**Return:** Each room has a "Back to Lobby" doorway that triggers the reverse transition.

### 2.6 Post-Processing (Optional Polish)

**Evaluated:** `@react-three/postprocessing`

| Effect       | Purpose                                  | Performance Cost | Phase              |
| ------------ | ---------------------------------------- | ---------------- | ------------------ |
| **Bloom**    | Glow on interactive objects, door frames | Low              | Phase 6 (polish)   |
| **Vignette** | Gallery ambiance                         | Minimal          | Phase 6 (polish)   |
| **SSAO**     | Depth/shadow realism                     | Medium           | Phase 6 (optional) |
| **Noise**    | Film grain (subtle)                      | Minimal          | Phase 6 (optional) |

**Decision:** Defer post-processing to Phase 6. Focus on gameplay and content first. When added, bundle is ~40KB gzip.

---

## 3. Final Tech Stack for Gallery Layer

| Technology                    | Version  | Purpose                                                                | New Install?          |
| ----------------------------- | -------- | ---------------------------------------------------------------------- | --------------------- |
| `@react-three/fiber`          | ^9.5.0   | R3F Canvas & renderer                                                  | ❌ Already installed  |
| `@react-three/drei`           | ^10.7.7  | Text, Html, Billboard, useGLTF, KeyboardControls, Environment          | ❌ Already installed  |
| `@react-three/rapier`         | ^2.2.0   | Physics world, RigidBody, CuboidCollider, sensors                      | ❌ Already installed  |
| `three`                       | ^0.183.1 | 3D engine                                                              | ❌ Already installed  |
| `zustand`                     | ^5.0.11  | Gallery state store                                                    | ❌ Already installed  |
| `framer-motion`               | ^12.34.3 | Room transition overlays, UI panels                                    | ❌ Already installed  |
| **`ecctrl`**                  | ^1.0.97  | **Character controller** (floating capsule, 3P camera, input handling) | ✅ **New dependency** |
| `@react-three/postprocessing` | ^3.0.4   | Bloom, vignette (Phase 6 polish)                                       | ✅ New (Phase 6 only) |

**Total new dependencies:** 1 required (`ecctrl`), 1 optional later (`postprocessing`).

---

## 4. Architecture Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    Next.js App Router                          │
│  /gallery (route group)                                        │
│    ├── layout.tsx    ← Full-screen, black bg, overflow hidden  │
│    └── page.tsx      ← Server Component (metadata + Loader)   │
└────────────────────────────────────────────────────────────────┘
          │ dynamic import (ssr: false)
          ▼
┌────────────────────────────────────────────────────────────────┐
│              ModeCRoot.tsx (Client Component)                   │
│  ┌──────────────────────┐  ┌─────────────────────────────┐    │
│  │     R3F <Canvas>      │  │     DOM Overlays (z-index)   │    │
│  │  ┌────────────────┐  │  │  ┌─────────────────────┐    │    │
│  │  │ <Physics>       │  │  │  │ <GalleryHUD>        │    │    │
│  │  │  <Lobby>       │  │  │  │  Room title, minimap │    │    │
│  │  │  <RoomProjects>│  │  │  └─────────────────────┘    │    │
│  │  │  <RoomBio>     │  │  │  ┌─────────────────────┐    │    │
│  │  │  <RoomSkills>  │  │  │  │ <MapOverlay>        │    │    │
│  │  │  <Character>   │  │  │  │  Full gallery map    │    │    │
│  │  │  <Doorways>    │  │  │  └─────────────────────┘    │    │
│  │  │  <Exhibits>    │  │  │  ┌─────────────────────┐    │    │
│  │  │  <GalleryLights│  │  │  │ <ExhibitPanel>      │    │    │
│  │  │  <Environment> │  │  │  │  Exhibit details     │    │    │
│  │  └────────────────┘  │  │  └─────────────────────┘    │    │
│  └──────────────────────┘  │  ┌─────────────────────┐    │    │
│                             │  │ <TransitionOverlay> │    │    │
│                             │  │  Room fade in/out   │    │    │
│                             │  └─────────────────────┘    │    │
│                             │  ┌─────────────────────┐    │    │
│                             │  │ <GalleryLoader>     │    │    │
│                             │  │  Loading screen     │    │    │
│                             │  └─────────────────────┘    │    │
│                             └─────────────────────────────┘    │
└────────────────────────────────────────────────────────────────┘
          ▲                            ▲
          │         Zustand            │
          └──── useGalleryStore ───────┘
                (bridge layer)
```

### Separation of Concerns

| Layer                 | Responsibility                     | Files                                                            |
| --------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| **Route Layer**       | Metadata, layout, SSR boundary     | `app/gallery/page.tsx`, `layout.tsx`                             |
| **Root Layer**        | Canvas + overlay composition       | `ModeCRoot.tsx`                                                  |
| **Scene Layer**       | R3F Canvas, Physics, lighting      | `GalleryScene.tsx`                                               |
| **Room Layer**        | Room geometry, exhibits, doorways  | `rooms/Lobby.tsx`, `rooms/ProjectsRoom.tsx`, etc.                |
| **Character Layer**   | Ecctrl controller + character mesh | `character/PlayerController.tsx`, `character/CharacterModel.tsx` |
| **Interaction Layer** | Doorways, map, exhibit click       | `interactions/Doorway.tsx`, `interactions/MapPedestal.tsx`       |
| **UI Layer**          | HUD, overlays, panels (DOM)        | `ui/GalleryHUD.tsx`, `ui/MapOverlay.tsx`, `ui/ExhibitPanel.tsx`  |
| **Store Layer**       | All Gallery state                  | `store/useGalleryStore.ts`                                       |
| **Data Layer**        | Content from site.config.ts        | Uses existing `config-adapter.ts` + gallery-specific transforms  |

---

## 5. File Structure

```
src/modes/mode-c/
├── index.tsx                          ← ModeConfig export (id: 'gallery')
├── components/
│   ├── ModeCRoot.tsx                  ← Entry point: Canvas + DOM overlays
│   └── GalleryScene.tsx               ← R3F Canvas wrapper (physics, lighting, camera)
├── rooms/
│   ├── RoomManager.tsx                ← Renders active room(s) based on store state
│   ├── Lobby.tsx                      ← Central lobby geometry + map pedestal + doorways
│   ├── ProjectsRoom.tsx               ← Projects gallery (frames with screenshots)
│   ├── BioRoom.tsx                    ← About/Bio room (timeline wall)
│   ├── SkillsRoom.tsx                 ← Skills lab (interactive pedestals)
│   └── PlaygroundRoom.tsx             ← Playground/misc room
├── character/
│   ├── PlayerController.tsx           ← Ecctrl wrapper with goofy tuning
│   └── CharacterModel.tsx             ← 3D character mesh (procedural capsule MVP)
├── exhibits/
│   ├── ProjectFrame.tsx               ← Clickable framed project exhibit
│   ├── SkillPedestal.tsx              ← 3D pedestal showing skill info
│   ├── ExperienceWall.tsx             ← Timeline wall with experience entries
│   └── ExhibitLabel.tsx               ← Reusable <Text> label below exhibits
├── interactions/
│   ├── Doorway.tsx                    ← Sensor-based door triggers with labels
│   ├── MapPedestal.tsx                ← Clickable map object in lobby center
│   └── TeleportZone.tsx               ← Instant teleport zone (inside map UI)
├── lights/
│   └── GalleryLights.tsx              ← Museum lighting (spot + ambient + accent)
├── cameras/
│   └── (handled by ecctrl follow cam) ← No custom camera needed (ecctrl manages it)
├── store/
│   └── useGalleryStore.ts             ← All Gallery state + actions
├── hooks/
│   ├── useRoomTransition.ts           ← Manages room loading + fade transitions
│   ├── useExhibitData.ts              ← Maps site.config.ts data to exhibit format
│   └── useGalleryControls.ts          ← Keyboard shortcuts (M = map, Esc = close)
├── ui/
│   ├── GalleryHUD.tsx                 ← Room name, controls hint, minimap icon
│   ├── MapOverlay.tsx                 ← Full map overlay (DOM, with room buttons)
│   ├── ExhibitPanel.tsx               ← Exhibit detail panel (DOM overlay)
│   ├── TransitionOverlay.tsx          ← Fade-to-black between rooms
│   └── GalleryLoader.tsx              ← Loading screen with progress bar
├── utils/
│   ├── roomConfig.ts                  ← Room definitions (id, name, spawn point, doorway positions)
│   └── galleryConstants.ts            ← Physics tuning, camera settings, room dimensions
└── types/
    └── gallery.ts                     ← Gallery-specific TypeScript types

src/app/gallery/
├── layout.tsx                         ← Full-screen layout (same pattern as /immersive)
└── page.tsx                           ← Server Component (metadata + ModeCLoader)

src/components/loaders/
└── ModeCLoader.tsx                    ← Client Component (dynamic import, ssr: false)
```

---

## 6. State Management Design

### `useGalleryStore` — Complete State Shape

```typescript
// src/modes/mode-c/types/gallery.ts

export type RoomId = 'lobby' | 'projects' | 'bio' | 'skills' | 'playground'; // playground = certifications room

export interface RoomConfig {
  id: RoomId;
  name: string;
  description: string;
  doorwayPosition: [number, number, number]; // Position in lobby
  spawnPoint: [number, number, number]; // Where player appears
  doorLabel: string;
  color: string; // Accent color for room
}

export interface ExhibitData {
  id: string;
  type: 'project' | 'skill' | 'experience' | 'education' | 'bio';
  title: string;
  content: Record<string, unknown>; // Varies by type
  position: [number, number, number];
}

// src/modes/mode-c/store/useGalleryStore.ts

interface GalleryStore {
  // Room state
  currentRoom: RoomId;
  previousRoom: RoomId | null;
  isTransitioning: boolean;
  loadedRooms: Set<RoomId>; // Track which rooms have been loaded

  // Character state
  playerPosition: [number, number, number];
  isMoving: boolean;

  // UI state
  isMapOpen: boolean;
  activeExhibit: string | null; // Exhibit ID or null
  showHUD: boolean;
  showControls: boolean; // First-time controls hint

  // Actions
  enterRoom: (roomId: RoomId) => void;
  exitToLobby: () => void;
  teleportToRoom: (roomId: RoomId) => void;
  toggleMap: () => void;
  setActiveExhibit: (id: string | null) => void;
  updatePlayerPosition: (pos: [number, number, number]) => void;
  dismissControls: () => void;
}
```

### State Flow Diagrams

**Room Transition:**

```
Player walks into doorway sensor
  → onIntersectionEnter fires
  → store.enterRoom('projects')
    → isTransitioning = true
    → TransitionOverlay fades to black
    → (after 0.5s) currentRoom = 'projects'
    → Player teleported to room spawn point
    → (after 0.3s) isTransitioning = false
    → TransitionOverlay fades out
```

**Map Interaction:**

```
Player clicks map pedestal
  → onClick fires
  → store.toggleMap()
    → isMapOpen = true
    → <MapOverlay> renders (DOM overlay)
    → ecctrl disableControl = true (freeze player)
User clicks room on map
  → store.teleportToRoom('skills')
    → isMapOpen = false
    → Triggers same transition as doorway
    → ecctrl disableControl = false
```

**Exhibit Interaction:**

```
Player clicks exhibit frame
  → onClick fires
  → store.setActiveExhibit('project-cool-app')
    → activeExhibit = 'project-cool-app'
    → <ExhibitPanel> renders with project data
    → ecctrl disableControl = true
Player presses Esc or clicks close
  → store.setActiveExhibit(null)
    → ecctrl disableControl = false
```

---

## 7. Phased Implementation Roadmap

### Phase G1: R3F Canvas & Scene Initialization

**Goal:** Get a working 3D canvas with physics world, lighting, and the Mode C route.

**Steps:**

1. Install `ecctrl` dependency (`pnpm add ecctrl`)
2. Create `src/modes/mode-c/index.tsx` — ModeConfig export
3. Create `src/app/gallery/layout.tsx` — full-screen layout
4. Create `src/app/gallery/page.tsx` — Server Component with metadata
5. Create `src/components/loaders/ModeCLoader.tsx` — dynamic import wrapper
6. Create `src/modes/mode-c/components/GalleryScene.tsx` — Canvas with Physics
7. Create `src/modes/mode-c/components/ModeCRoot.tsx` — Root composer
8. Create `src/modes/mode-c/lights/GalleryLights.tsx` — Museum lighting
9. Create `src/modes/mode-c/store/useGalleryStore.ts` — Initial store
10. Register mode in `src/modes/registry.ts`
11. Add `MODE_C: '/gallery'` to `src/lib/constants.ts` ROUTES

**Testing & Validation:**

- ✅ `pnpm build` passes with new route
- ✅ `/gallery` loads a black canvas with ambient lighting
- ✅ Mode card appears on Hub landing page
- ✅ No TypeScript errors (`pnpm type-check`)
- ✅ Mode B and Mode A still work (no regression)

---

### Phase G2: Physics World & "Goofy" Character Controller MVP

**Goal:** Player character spawns, moves with WASD, has physics-based "goofy" movement, and a 3P follow camera.

**Steps:**

1. Create `src/modes/mode-c/utils/galleryConstants.ts` — physics tuning values
2. Create `src/modes/mode-c/character/CharacterModel.tsx` — procedural capsule character
3. Create `src/modes/mode-c/character/PlayerController.tsx` — Ecctrl wrapper
4. Add `KeyboardControls` map to ModeCRoot
5. Add a simple floor plane (RigidBody, type="fixed") for testing
6. Tune ecctrl props for "goofy" feel (low damping, bouncy spring, snappy turns)
7. Test movement: WASD forward/back/strafe, mouse look, jump
8. Add movement state tracking to store (`isMoving`, `playerPosition`)

**Testing & Validation:**

- ✅ Character spawns on floor plane
- ✅ WASD moves character, Space jumps
- ✅ Camera follows in 3rd person
- ✅ Movement feels "smooth but goofy" (bouncy, slightly sliding turns)
- ✅ Character doesn't fall through floor
- ✅ Mobile: verify no crashes (touch controls in Phase G7)

---

### Phase G3: Lobby Geometry & Collision Walls

**Goal:** Build the lobby room with walls the player can't walk through, a floor, ceiling, and doorway openings.

**Steps:**

1. Create `src/modes/mode-c/utils/roomConfig.ts` — room dimension constants and doorway positions
2. Create `src/modes/mode-c/rooms/Lobby.tsx` — procedural lobby geometry
   - Floor with `MeshReflectorMaterial` (like Mode B)
   - 4 walls with doorway cutouts (5 openings: one per room)
   - Ceiling (optional, can be open initially)
   - All walls wrapped in `<RigidBody type="fixed">` for collision
3. Add invisible collision barriers around doorway edges
4. Place decorative elements: pillars, floor tiles, ceiling lights
5. Test: player cannot walk through walls, can walk through doorway openings
6. Add room labels above each doorway using `<Billboard><Text>` from drei

**Room Layout (Top-Down):**

```
              ╔═══════════╗
              ║           ║
              ║ PROJECTS  ║
              ║           ║
     ═════════╝           ╚═════════
     ║                             ║
     ║           LOBBY             ║
╔════╝    🗺️ MAP                   ╚════╗
║                                       ║
║ BIO                        SKILLS     ║
║                                       ║
╚════╗                           ╔══════╝
     ║                           ║
     ═════════╗           ╔══════
              ║PLAYGROUND ║
              ║           ║
              ╚═══════════╝
```

**Testing & Validation:**

- ✅ Lobby renders with correct proportions
- ✅ Player cannot walk through any wall
- ✅ Player CAN walk through doorway openings (no invisible blockers)
- ✅ Door labels render and face camera (Billboard)
- ✅ Performance: >30 FPS on mid-range hardware
- ✅ Reflective floor works

---

### Phase G4: Room Transitions & Doorway Sensors

**Goal:** Player walks through a doorway → fade transition → teleported to the other room.

**Steps:**

1. Create `src/modes/mode-c/interactions/Doorway.tsx` — sensor trigger component
2. Create `src/modes/mode-c/ui/TransitionOverlay.tsx` — fade-to-black overlay
3. Create `src/modes/mode-c/hooks/useRoomTransition.ts` — transition state machine
4. Create `src/modes/mode-c/rooms/RoomManager.tsx` — conditionally renders rooms
5. Create stub rooms: `ProjectsRoom.tsx`, `BioRoom.tsx`, `SkillsRoom.tsx`, `PlaygroundRoom.tsx`
   - Each is a simple box room with colored walls and a "Back to Lobby" doorway
6. Implement doorway sensor logic:
   - `onIntersectionEnter` → trigger transition
   - Debounce to prevent rapid re-triggers
   - Disable player control during transition
7. Implement teleport: move player RigidBody to new room's spawn point
8. Update store: `currentRoom`, `isTransitioning`, `previousRoom`

**Testing & Validation:**

- ✅ Walking into Projects doorway → fade → appears in Projects room
- ✅ "Back to Lobby" doorway in Projects → fade → back in Lobby
- ✅ All 4 room doorways work
- ✅ No double-trigger (debounce works)
- ✅ Player controls disabled during fade
- ✅ HUD updates to show current room name

---

### Phase G5: Interactive Map (Lobby)

**Goal:** Clickable 3D map pedestal in lobby center → opens 2D overlay showing full gallery layout → click a room to teleport.

**Steps:**

1. Create `src/modes/mode-c/interactions/MapPedestal.tsx` — 3D pedestal mesh with glow
2. Create `src/modes/mode-c/ui/MapOverlay.tsx` — DOM overlay with room layout
3. Create `src/modes/mode-c/ui/GalleryHUD.tsx` — persistent HUD (room name, controls)
4. Create `src/modes/mode-c/hooks/useGalleryControls.ts` — keyboard shortcuts (M = map, Esc = close)
5. Map pedestal: glowing object in lobby center, hover effect, onClick → `store.toggleMap()`
6. Map overlay: stylized 2D floorplan with clickable room areas
   - Each room shows name + icon
   - Click room → `store.teleportToRoom(roomId)` → closes map → triggers transition
   - Current room highlighted
   - Visited rooms vs unvisited rooms (visual distinction)
7. HUD: top-left room name, bottom controls hint, minimap button

**Testing & Validation:**

- ✅ Map pedestal glows on hover
- ✅ Clicking pedestal opens map overlay
- ✅ Player frozen while map is open
- ✅ Clicking a room on map → teleports player to that room
- ✅ Press 'M' anywhere → toggles map
- ✅ Press 'Esc' → closes map / exhibit panel
- ✅ HUD shows current room name

---

### Phase G6: Exhibit System — Connecting Data to 3D

**Goal:** Rooms are populated with exhibits that display real content from `site.config.ts`.

**Steps:**

1. Create `src/modes/mode-c/hooks/useExhibitData.ts` — transforms config data into exhibit format
2. Create `src/modes/mode-c/exhibits/ProjectFrame.tsx` — framed project with screenshot texture
3. Create `src/modes/mode-c/exhibits/SkillPedestal.tsx` — pedestal with skill info
4. Create `src/modes/mode-c/exhibits/ExperienceWall.tsx` — timeline wall
5. Create `src/modes/mode-c/exhibits/ExhibitLabel.tsx` — reusable Text label
6. Create `src/modes/mode-c/ui/ExhibitPanel.tsx` — DOM panel showing full exhibit info
7. **Projects Room:** Wall-mounted frames with project data
   - Image texture from project screenshots
   - Click frame → ExhibitPanel with project details (description, tech, links)
   - `featured` projects get larger frames in prominent positions
8. **Bio Room:** Timeline wall with experience + education entries
   - Chronological plaques on the wall
   - Click plaque → full details
9. **Skills Room:** Pedestals arranged by category
   - Each pedestal shows skill name + proficiency bar
   - Click pedestal → category details
10. **Playground Room:** Fun interactive elements (future — start with a placeholder)

**Testing & Validation:**

- ✅ Projects room shows frames for each project in `site.config.ts`
- ✅ Clicking a frame shows correct project data in ExhibitPanel
- ✅ Bio room shows experience timeline
- ✅ Skills room shows skill pedestals by category
- ✅ Data updates when `site.config.ts` is edited + `pnpm sync-config` run
- ✅ ExhibitPanel has working links (GitHub, live demo)
- ✅ Press Esc closes ExhibitPanel

---

### Phase G7: Polish, Mobile, Post-Processing

**Goal:** Visual polish, mobile/touch support, optional post-processing effects.

**Steps:**

1. Add `EcctrlJoystick` for mobile touch controls
2. Add `@react-three/postprocessing` — Bloom on interactive objects, Vignette
3. Add particle effects (dust motes using drei `<Sparkles>`)
4. Improve room lighting — spot lights on exhibits, accent colors per room
5. Add ambient sounds (optional — gallery footsteps, ambient music)
6. Add `prefers-reduced-motion` support — skip transitions, reduce particles
7. Performance audit — check FPS, draw calls, memory
8. Add "Controls" popup on first visit (shows WASD, mouse, M, Esc)

**Testing & Validation:**

- ✅ Mobile: touch controls work (joystick + buttons)
- ✅ Post-processing: bloom on exhibit frames
- ✅ Performance: >30 FPS on mobile, >60 FPS on desktop
- ✅ Reduced motion: respects user preference
- ✅ No memory leaks (navigate between rooms 20+ times)

---

### Phase G8: Character Model & Animations

**Goal:** Replace procedural capsule with a proper character model with idle/walk/run/jump animations.

**Steps:**

1. Source a free character model (e.g., Mixamo, ReadyPlayerMe, Kenney assets)
2. Set up EcctrlAnimation with animation state machine
3. Idle → Walk → Run → Jump → Fall transitions
4. Optional: "goofy" custom animations (exaggerated walk, bouncy idle)
5. Character shadow casting
6. Optional: character customization (swap models via site.config.ts)

**Testing & Validation:**

- ✅ Character model renders correctly
- ✅ Animations transition smoothly (idle ↔ walk ↔ run)
- ✅ Jump animation plays on space
- ✅ Model scale correct relative to room

---

## 8. Data Flow: JSON/MDX → Gallery Exhibits

```
site.config.ts (user edits here)
      │
      ├──── pnpm sync-config ────→ src/data/cv.json
      │                           src/data/projects.json
      │                           src/data/skills.json
      │
      ▼
useExhibitData.ts (hook)
      │
      ├── getProjectExhibits() → ProjectFrame[] positions + data
      ├── getExperienceExhibits() → ExperienceWall[] timeline data
      ├── getSkillExhibits() → SkillPedestal[] category data
      └── getBioExhibit() → Bio room content
      │
      ▼
Room Components (ProjectsRoom.tsx, etc.)
      │
      ▼
3D Exhibit Components (ProjectFrame, SkillPedestal, etc.)
```

**Key principle:** The exhibit system is **data-driven**. Room layouts automatically adjust to the number of projects/skills/experiences in the config. If you add a new project to `site.config.ts`, a new frame appears on the wall without touching any 3D code.

---

## 9. Performance Budget

| Metric                       | Target                          | Measurement                        |
| ---------------------------- | ------------------------------- | ---------------------------------- |
| Initial load (gallery route) | < 3s on 4G                      | Lighthouse                         |
| FPS (desktop)                | > 60 FPS                        | R3F `useStats()` or drei `<Stats>` |
| FPS (mobile)                 | > 30 FPS                        | Chrome DevTools                    |
| Memory                       | < 200MB                         | Chrome DevTools Memory tab         |
| Bundle (gallery code)        | < 250KB gzip                    | `pnpm analyze`                     |
| Room load time               | < 1s each                       | useProgress()                      |
| Total 3D assets              | < 5MB (Phase 1: 0MB procedural) | File size check                    |

**Performance Strategies:**

- **Code splitting:** Gallery code only loads when `/gallery` is visited
- **Room-level Suspense:** Each room loads independently. Only lobby is mandatory at start.
- **Instanced meshes:** Reuse geometry for exhibit frames, pedestals (1 draw call per type)
- **Level of Detail:** Reduce exhibit detail when far from camera
- **Physics sleep:** Rapier automatically sleeps inactive bodies

---

## 10. Accessibility Strategy

| Feature                    | Implementation                                                           |
| -------------------------- | ------------------------------------------------------------------------ |
| **Keyboard navigation**    | WASD + Arrow keys + Tab for UI elements                                  |
| **Screen reader**          | Exhibit content available via `<Html>` panels (native DOM)               |
| **Reduced motion**         | Detect `prefers-reduced-motion` → instant room transitions, no particles |
| **Color contrast**         | All UI overlays meet WCAG AA                                             |
| **Alternative navigation** | Map overlay provides non-3D access to all content                        |
| **Escape hatch**           | Prominent "View as List" link → redirects to `/minimalist`               |

---

## 11. Design Decisions (Resolved)

> Answered by the user on 2026-02-27.

### 1. Character Style: **Quaternius CC0 Robot (FBX)**

- Originally planned as procedural stickman, replaced in Session 021
- Quaternius CC0 Robot model (`Robot.fbx`) loaded via drei `useFBX`
- 15 animation clips mapped to ecctrl’s `EcctrlAnimation` (idle, walk, run, jump, etc.)
- NPC robots (`RobotNPC.tsx`) use `SkeletonUtils.clone()` for memory-efficient instances
- 7 color variants for NPCs (red, blue, green, purple, orange, cyan, magenta)
- See [ADR-008](Decisions.md#adr-008) for why FBX was loaded directly instead of converting to GLB

### 2. Playground Room: **Certifications & Achievements** (Changed)

- Originally planned as mini-games / physics toys area
- Repurposed in Session 028 as "Certifications & Achievements" room
- Displays `CertificationPlaque.tsx` components — gold-trimmed wall certificate frames
- 5 real certifications: CompTIA Security+, Network+, CySA+, PenTest+, Google Cybersecurity
- Data-driven from `site.config.ts` certifications array

### 3. Ready-Pack Integration: **Failed & Abandoned** (Session 024)

- Attempted to integrate a Sketchfab GLTF gallery scene for richer visuals
- Failed due to: physics collider misalignment, style mismatch, coordinate chaos
- `GalleryThemeScene.tsx` kept in codebase as reference but never rendered
- Decision: stay fully procedural, enhance with decorative overlay components
- Decorations added: `LobbyDecor` (ServerTower, BinaryHelix, benches, plants, stanchions), `WallPattern`, `CeilingFixture`, `DadoRail`, `WallSconce`
- See [ADR-009](Decisions.md#adr-009) for detailed analysis

### 3. Gallery Aesthetic: **Per-Room Theming**

- Each room has a unique aesthetic matching its content:
  - **Lobby:** Grand entrance hall, neutral elegant (marble-like floor, columns)
  - **Projects Room:** Art gallery style — dark walls, dramatic spot lighting on paintings
  - **Bio Room:** Sculpture museum — warm lighting, pedestals, open space
  - **Skills Room:** Interactive lab / modern exhibit — cool-toned, tech feel, display cases
  - **Playground:** Colorful, playful, pop-art inspired — bright and fun

### 4. Sound: **Ambient + Footsteps**

- Chill ambient museum background audio (looping, low volume)
- Footstep sounds synced to movement
- Default: audio ON at low volume, with mute toggle in HUD
- Implementation: Web Audio API or Howler.js (evaluate in Phase G7)

### 5. Room Exhibit Art Styles (NEW)

| Room               | Art Form      | Description                                                                      |
| ------------------ | ------------- | -------------------------------------------------------------------------------- |
| **Projects**       | Paintings     | Each project displayed as a framed painting on the wall; interact to see details |
| **Bio**            | Statues       | A statue of the person; experience entries as plaques on pedestals               |
| **Skills**         | Display Cases | Skills shown in glass display cases / interactive tech exhibits                  |
| **Certifications** | Certificates  | Gold-trimmed wall plaques per certification; click for details                   |

---

## Documentation Files to Update

> **Note:** All documentation files listed below have been updated through Session 030.

| File                          | What to Update                                     |
| ----------------------------- | -------------------------------------------------- |
| `docs/Roadmap.md`             | Add Phase 5 (Gallery) with all G1-G8 phases        |
| `docs/Tech_Stack.md`          | Add `ecctrl`, update 3D section with Gallery usage |
| `docs/Structure.md`           | Add `mode-c/` file tree, `app/gallery/` route      |
| `docs/Implementation_Plan.md` | Add Gallery implementation phases (G1-G8)          |
| `docs/Decisions.md`           | Add ADR-007: ecctrl Character Controller           |
| `docs/Progress_Log.md`        | Add Session 008 entry                              |
| `src/modes/registry.ts`       | Add modeCConfig import                             |
| `src/lib/constants.ts`        | Add MODE_C route                                   |
