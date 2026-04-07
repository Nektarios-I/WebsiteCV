# 📜 Progress Log — WebsiteCV

> **Purpose:** Track what was accomplished in each development session for continuity.  
> **Format:** Each entry documents a single session/prompt interaction.

---

## How to Use This Log

- **After each session:** Add a new entry at the top (newest first)
- **Include:** Date, what was done, files changed, issues encountered, next steps
- **Keep entries concise** — this is a reference, not a novel

---

## Session Log

### Session 029 — 2026-03-01

**Prompt Summary:** Update all metadata files (site.config.ts, robots.txt, package.json, sync-config.ts) to match the real CV data populated in Session 028.

**What Was Done:**

1. **site.config.ts — comprehensive update:**
   - `PERSONAL`: bio synced with cv.json, location → "Nicosia, Cyprus", title simplified to "Computer Science Student"
   - `CONTACT`: email → `ioannou.nektarios@ucy.ac.cy`, phone → `+357 97621017`, website → `https://nektarios-i.github.io`, github → `https://github.com/Nektarios-I`, linkedin cleared
   - `EXPERIENCE`: Replaced single placeholder with 4 real entries (Humeral intern, Humeral freelance, Decathlon, Military)
   - `EDUCATION`: Replaced placeholder with 2 entries (UCY B.Sc. CS, Aradippou HS)
   - `PROJECTS`: Replaced placeholder with 5 real projects (SLJ Pipeline, CMJ Analysis, Kouppi, CV Website, University Projects)
   - `SKILLS`: Replaced Frontend/Backend/DevOps with Proficient/Familiar/Exposure/Soft Skills
   - `CERTIFICATIONS`: Populated with 3 entries (Frontend Web Dev, IELTS, Bouzouki)
   - `SITE_CONFIG`: url → `https://nektarios-i.github.io`, title → "CV", certifications section enabled

2. **robots.txt**: Updated sitemap URL to `https://nektarios-i.github.io/sitemap.xml`

3. **scripts/sync-config.ts**: Added `CERTIFICATIONS` import and certifications sync to cv.json output

4. **package.json**: Added `description` and `author` fields

**Files Modified:** 4

- `site.config.ts` — all personal/contact/experience/education/projects/skills/certifications/site config
- `public/robots.txt` — sitemap URL
- `scripts/sync-config.ts` — certifications support
- `package.json` — description + author

**Validation:** type-check ✅ | unit tests ✅ (83/83 pass)

---

### Session 030 — 2026-03-01

**Prompt Summary:** Update all documentation files in `docs/` folder to reflect the current project state — capture missing session history (022-029), record the failed ready-pack integration attempt, and bring all metadata docs up to date.

**What Was Done:**

1. **Progress_Log.md**: Added entries for sessions 022-029 (8 missing sessions)
2. **Roadmap.md**: Marked content population complete, added Phase 6 (Content & Metadata), updated technical debt
3. **Structure.md**: Updated file tree with all new components (LobbyDecor, RobotNPC, WallPattern, CertificationPlaque, CeilingFixture, DadoRail, WallSconce, GalleryThemeScene)
4. **Implementation_Plan.md**: Marked content steps 1.1-1.3 as Done, updated Phase 5 completion status
5. **Decisions.md**: Added ADR-008 (direct JSON editing), ADR-009 (FBX direct loading), ADR-010 (ready-pack integration failure)
6. **Tech_Stack.md**: Updated test count, added robot model info, noted postprocessing installed, added ready-pack note
7. **Tutorial.md**: Added Gallery mode details, certifications section
8. **Suggestions.md**: Checked off completed items
9. **CONTRIBUTING.md**: Updated for Mode C, certifications, test counts
10. **Gallery_Architecture.md**: Added implementation status notes

**Files Modified:** 10 documentation files

**Validation:** N/A (documentation only)

---

### Session 028 — 2026-02-28

**Prompt Summary:** User attached their real CV text file (`NektariosCV_Text.txt`) and requested: extract info and fill up data files, update decorations/props/art exhibitions for CV content, fix robot crouching animation, fix tile z-fighting glitch in Bio/Skills rooms.

**What Was Done:**

1. **CV Data Integration — all data files populated with real content:**
   - `src/data/cv.json`: 4 experience entries (Humeral intern, Humeral freelance, Decathlon, Military Service), 2 education entries (UCY, Aradippou HS), 3 certifications (Frontend Web Dev, IELTS, Bouzouki), correct contact info
   - `src/data/projects.json`: 5 projects (SLJ Prediction Pipeline, CMJ Jump Analysis, Kouppi Card Game, Interactive CV Website, University CS Projects)
   - `src/data/skills.json`: 4 categories (Proficient: Java/ML/Python, Familiar: C/SQL/HTML-CSS-JS, Exposure: Arch/OS, Soft Skills: 5 entries)
   - `src/data/content/about.mdx`: Real bio and contact information

2. **Robot Animation Fix:**
   - Changed NPC robot animation mappings to use different poses (thumbsup→wave, yes→dance) for variety in lobby NPCs
   - Fixed crouching/sitting animations causing clipping issues

3. **Tile Z-Fighting Fix (Bio/Skills rooms):**
   - Added `polygonOffset`, `polygonOffsetFactor={-1}`, `polygonOffsetUnits={-1}` to GalleryFloor tile and border materials
   - Raised tile `yPos` slightly to prevent z-fighting with physics floor slab

4. **Certifications System:**
   - Created `CertificationPlaque.tsx` exhibit component — gold-trimmed wall-mounted certificate frame with hover glow and click-to-open
   - Transformed PlaygroundRoom into Certifications & Achievements room (file kept as `PlaygroundRoom.tsx`, content replaced)
   - Updated `ExhibitPanel.tsx` with certification data type support
   - Updated `ScreenReaderContent.tsx` to include certifications for accessibility
   - Updated `MapOverlay.tsx` room name to "Certifications"
   - Updated `constants.ts` ROOM_NAMES — playground → "Certifications"

**Files Created:** 1

- `src/modes/mode-c/components/exhibits/CertificationPlaque.tsx`

**Files Modified:** 9

- `src/data/cv.json` — real CV data
- `src/data/projects.json` — real project data
- `src/data/skills.json` — real skills data
- `src/data/content/about.mdx` — real bio
- `src/modes/mode-c/components/rooms/GalleryFloor.tsx` — polygonOffset z-fighting fix
- `src/modes/mode-c/components/rooms/PlaygroundRoom.tsx` — now Certifications room
- `src/modes/mode-c/components/ui/ExhibitPanel.tsx` — certification type
- `src/modes/mode-c/components/ui/ScreenReaderContent.tsx` — certifications a11y
- `src/modes/mode-c/lib/constants.ts` — room name update

**Validation:** type-check ✅ | unit tests ✅ (83/83 pass) | tsc clean

---

### Session 027 — 2026-02-28

**Prompt Summary:** Fix WallPattern visibility issue — patterns not showing because wallOffset was too small. Also investigate Baseboard/CrownMolding door gap issues.

**What Was Done:**

1. **WallPattern Visibility Fix:**
   - Root cause: `wallOffset` was `0.02` — the pattern tiles were being rendered inside the wall mesh, invisible from the room interior
   - Fix: Changed `wallOffset` to `0.28` (half wall thickness 0.25 + 0.03 air gap) — tiles now float correctly on the room-interior surface of the wall
   - Wall patterns now visible on all 4 walls with proper door-gap support

2. **Baseboard/CrownMolding Door Gap Investigation:**
   - Investigated why baseboard and crown molding strips clip through doorway openings
   - Identified that the south wall (door wall) needs gap calculations matching WallWithDoor geometry
   - Documented the issue for future fix (non-blocking — visual only)

**Files Modified:** 1

- `src/modes/mode-c/components/rooms/WallPattern.tsx` — wallOffset 0.02 → 0.28

**Validation:** type-check ✅ | visual verification ✅

---

### Session 026 — 2026-02-28

**Prompt Summary:** Add decorative wall patterns to all gallery rooms — geometric medallion grids on upper walls and wainscoting panels on lower walls.

**What Was Done:**

1. **WallPattern Component** (`WallPattern.tsx`):
   - Two-zone decorative wall treatment rendered as mesh overlay on room walls
   - **Upper zone:** Geometric medallion pattern — octagon + diamond tile grid with configurable accent colors
   - **Lower zone:** Wainscoting — raised rectangular panels (dado panels) for a classic gallery look
   - Supports all 4 wall orientations (N/S/W/E) with automatic door-gap handling for south walls
   - DadoRail separates upper/lower zones visually
   - Configurable: `panelColor`, `accentColor`, `wallWidth`, `wallHeight`, `wallOffset`

2. **Integration into Lobby:**
   - WallPattern applied to all 4 lobby walls with door gaps matching WallWithDoor geometry
   - Warm beige panels with taupe accents matching lobby color scheme

**Files Created:** 1

- `src/modes/mode-c/components/rooms/WallPattern.tsx`

**Files Modified:** 1

- `src/modes/mode-c/components/rooms/Lobby.tsx` — imports and renders WallPattern

**Validation:** type-check ✅ | build ✅ | visual verification ✅

---

### Session 025 — 2026-02-28

**Prompt Summary:** Add additional room architecture components — ceiling light fixtures, dado rails, and wall sconces for richer gallery interiors.

**What Was Done:**

1. **CeilingFixture Component** (`CeilingFixture.tsx`):
   - Decorative ceiling-mounted light with two variants: `'pendant'` (hanging shade + bulb) and `'chandelier'` (ring with candle-style arms)
   - Both variants emit real `pointLight`s with configurable intensity and color
   - Props: `hangLength`, `fixtureColor`, `shadeColor`, `bulbColor`, `lightColor`, `intensity`, `variant`

2. **DadoRail Component** (`DadoRail.tsx`):
   - Horizontal chair-rail molding running along specified walls
   - Visually divides upper/lower wall zones for the wainscoting pattern
   - Default height 1.2m, configurable per-wall (defaults to N/W/E, skipping south door wall)

3. **WallSconce Component** (`WallSconce.tsx`):
   - Wall-mounted decorative light fixture with upward-facing shade and glowing bulb
   - Y-rotation controls which direction the sconce faces
   - Props: `position`, `rotation`, `fixtureColor`, `shadeColor`, `bulbColor`, `lightColor`, `intensity`

**Files Created:** 3

- `src/modes/mode-c/components/rooms/CeilingFixture.tsx`
- `src/modes/mode-c/components/rooms/DadoRail.tsx`
- `src/modes/mode-c/components/rooms/WallSconce.tsx`

**Validation:** type-check ✅ | build ✅

---

### Session 024 — 2026-02-28

**Prompt Summary:** Attempt to integrate a ready-made 3D gallery theme scene (Sketchfab model by denis_cliofas, CC-BY-4.0) to replace procedural lobby geometry. **This did not work as expected.**

**What Was Done:**

1. **Ready-Pack Integration Attempt:**
   - Downloaded a pre-made gallery interior GLTF scene from Sketchfab
   - Created `GalleryThemeScene.tsx` to load the model via `useGLTF`
   - The model includes walls, floor, ceiling, track lighting, benches, lamps, painting frames
   - **Problem:** The pre-made model's geometry didn't align with our physics colliders, room dimensions, or doorway positions
   - **Problem:** The model's style was too different from our procedural aesthetic — mixing pre-made and procedural looked inconsistent
   - **Problem:** The model's scale and coordinate system required significant manual adjustment
   - **Problem:** Physics colliders had to be manually placed to match the model's visual walls — fragile and error-prone

2. **Decision: Stick with Procedural Geometry:**
   - After testing, concluded that the procedural approach (RoomShell + decorative components) provides much better control and consistency
   - The ready-pack model was kept as `GalleryThemeScene.tsx` for reference but is NOT used in the active gallery
   - Instead, we enhanced the procedural rooms with richer decorations (Sessions 025-026)

**Files Created:** 1

- `src/modes/mode-c/components/rooms/GalleryThemeScene.tsx` — kept for reference, not actively used

**Issues Encountered:**

- Pre-made 3D asset pack integration failed due to geometry mismatch with physics system
- Style inconsistency between pre-made and procedural elements
- Scale/coordinate misalignment required too much manual work
- **Lesson learned:** For physics-based interactive environments, procedural geometry with decorative overlays is more reliable than importing complete pre-made scenes

**Validation:** N/A (experiment — no production changes)

---

### Session 023 — 2026-02-28

**Prompt Summary:** Add NPC robot characters to the lobby — small colored robots performing various idle animations to bring the gallery to life.

**What Was Done:**

1. **RobotNPC Component** (`RobotNPC.tsx`):
   - Loads `Robot.fbx` and clones the skeleton via Three.js `SkeletonUtils.clone()`
   - Supports 7 animation poses: idle, sitting, wave, thumbsup, yes, dance, idle2
   - Material color override per instance (7 color variants available)
   - Loops animations continuously for ambient life in the gallery

2. **LobbyDecor Integration:**
   - Added 7 NPC robots across 5 groups (A-E) positioned around the lobby
   - Group A: Robots near the Projects doorway
   - Group B: Robots near the Bio doorway
   - Group C: Robots near the map pedestal
   - Group D: Robots near Skills doorway
   - Group E: Robots near Certifications doorway
   - Each robot has a unique color and animation for visual variety

**Files Created:** 1

- `src/modes/mode-c/components/rooms/RobotNPC.tsx`

**Files Modified:** 1

- `src/modes/mode-c/components/rooms/LobbyDecor.tsx` — added NPC robot groups

**Validation:** type-check ✅ | build ✅ | visual verification ✅

---

### Session 022 — 2026-02-28

**Prompt Summary:** Create lobby decoration system with sculptural exhibits, gallery benches, potted plants, and stanchion-rope barriers to make the lobby feel like a real museum entrance.

**What Was Done:**

1. **LobbyDecor Component** (`LobbyDecor.tsx`, 517 lines):
   - **ServerTower Sculpture:** Tall geometric art installation made of stacked boxes/cylinders representing computer architecture — a signature centerpiece near the Projects doorway
   - **BinaryHelix Sculpture:** Double helix structure made of spheres (1s and 0s) with metallic finish — represents CS/binary data, placed near the Bio doorway
   - **Gallery Benches (3x):** Classic museum bench seating (dark wood/metal frame) placed at rest points around the lobby
   - **Stanchion-Rope Barriers (2x):** Velvet rope barriers (gold posts with red rope) to guide visitor flow and add museum authenticity
   - **Potted Plants (3x):** Decorative ficus-style plants in ceramic pots for organic contrast against geometric architecture

2. **Lobby Integration:**
   - `LobbyDecor` rendered as a child of `Lobby.tsx`
   - All decorations positioned to complement doorways and pathways without blocking navigation
   - Physics colliders added to benches and stanchion posts to prevent walking through them

**Files Created:** 1

- `src/modes/mode-c/components/rooms/LobbyDecor.tsx` (contains ServerTower, BinaryHelix, GalleryBench, PottedPlant, StanchionPost, StanchionBarrier as sub-components)

**Files Modified:** 1

- `src/modes/mode-c/components/rooms/Lobby.tsx` — renders LobbyDecor

**Validation:** type-check ✅ | build ✅ | visual verification ✅

---

### Session 021 — 2026-02-28

**Prompt Summary:** Replace the procedural StickmanCharacter with the Quaternius CC0 robot model (FBX) and integrate walking/running/idle animations driven by ecctrl movement state.

**What Was Done:**

1. **Robot model integration:**
   - Copied `e2e/AnimatedRobot/FBX/Robot.fbx` (3.15 MB) to `public/models/Robot.fbx`
   - Inspected FBX binary — found 15 named animation clips:
     Robot_Idle, Robot_Walking, Robot_Running, Robot_Jump, Robot_Dance,
     Robot_Death, Robot_No, Robot_Punch, Robot_Sitting, Robot_Standing,
     Robot_ThumbsUp, Robot_WalkJump, Robot_Wave, Robot_Yes, Robot_IdleHH2

2. **RobotCharacter component** (`RobotCharacter.tsx`):
   - Uses `useFBX` from drei (no FBX→GLB conversion needed)
   - Uses `useAnimations` from drei for skeletal animation playback
   - Reads `useGame().curAnimation` from ecctrl to detect walk/run/idle/jump
   - `ANIM_MAP` maps ecctrl states → robot clip names with crossfade (0.25s)
   - Scale tuned to 0.006 to fit capsule, rotated 180° to face forward
   - Preloads FBX on module init via `useFBX.preload`
   - Shadows enabled on all meshes

3. **Player.tsx updated:**
   - Replaced `StickmanCharacter` import with `RobotCharacter`
   - `animated={false}` kept — animation managed by RobotCharacter itself

4. **Character index updated:**
   - Exports both `RobotCharacter` and `StickmanCharacter` (kept as fallback)

**Files Created:** 1

- `src/modes/mode-c/components/character/RobotCharacter.tsx`
- `public/models/Robot.fbx` (copied from e2e/AnimatedRobot/)

**Files Modified:** 2

- `src/modes/mode-c/components/character/Player.tsx` — switched to RobotCharacter
- `src/modes/mode-c/components/character/index.ts` — added RobotCharacter export

**Validation:** type-check ✅ | build ✅ (8/8 routes) | unit tests ✅ (83/83 pass) | dev server ✅

---

### Session 020 — 2026-02-28

**Prompt Summary:** Improve gallery floor aesthetics — add tile patterns, baseboards, crown molding, and per-room floor designs to make rooms look like a professional art gallery.

**What Was Done:**

1. **GalleryFloor component** (`GalleryFloor.tsx`):
   - 5 floor patterns: checkerboard, herringbone, diamond, marble-grid, parquet
   - Rendered as individual tile meshes on top of the physics slab
   - Configurable props: tileColor1, tileColor2, borderColor, tileSize, roughness
   - Perimeter border trim tiles + dark grout base layer
   - All geometry is `boxGeometry` — no textures, GPU-friendly

2. **Baseboard component** (`Baseboard.tsx`):
   - Thin darker trim strip along floor-wall junction (all 4 walls)
   - Configurable height, thickness, color

3. **CrownMolding component** (`CrownMolding.tsx`):
   - Decorative ledge at wall-ceiling junction (all 4 walls)
   - Gives rooms a finished architectural look

4. **Per-Room Floor Designs:**
   - **Lobby:** Checkerboard — cream (#c8beb0) + brown (#8a7e70), tile size 2.4, polished (roughness 0.25)
   - **Projects Room:** Marble Grid — warm beige (#c4b8a8) + taupe (#a89888), large tiles
   - **Bio Room:** Herringbone — warm tan (#b8a898) + mocha (#9a8a78), classic museum pattern
   - **Skills Room:** Diamond — cool blue-grey (#a0aab4) + slate (#7a8a96), modern tech aesthetic
   - **Playground:** Parquet — warm honey (#b8a890) + walnut (#9a8a72), playful wood tone

5. **RoomShell updated** with 7 new optional props (floorPattern, tileColor1, tileColor2, borderColor, baseboardColor, crownColor, tileSize)

**Files Created:** 3

- `src/modes/mode-c/components/rooms/GalleryFloor.tsx`
- `src/modes/mode-c/components/rooms/Baseboard.tsx`
- `src/modes/mode-c/components/rooms/CrownMolding.tsx`

**Files Modified:** 5

- `src/modes/mode-c/components/rooms/RoomShell.tsx` — new props + integrates all 3 decorative components
- `src/modes/mode-c/components/rooms/Lobby.tsx` — checkerboard floor + baseboard + crown molding
- `src/modes/mode-c/components/rooms/ProjectsRoom.tsx` — marble-grid design
- `src/modes/mode-c/components/rooms/BioRoom.tsx` — herringbone design
- `src/modes/mode-c/components/rooms/SkillsRoom.tsx` — diamond design
- `src/modes/mode-c/components/rooms/PlaygroundRoom.tsx` — parquet design

**Validation:** type-check ✅ | build ✅ (8/8 routes) | unit tests ✅ (83/83 pass) | dev server ✅

---

### Session 019 — 2026-02-28

**Prompt Summary:** Scan `e2e/AnimatedRobot/` folder (user-provided) to assess if the robot model can be used as a gallery character with walking animation.

**Robot Model Assessment:**

| Property   | Value                                             |
| ---------- | ------------------------------------------------- |
| Source     | Quaternius LowPoly Robot                          |
| License    | **CC0 1.0 (Public Domain)** — free for any use ✅ |
| Folder     | `e2e/AnimatedRobot/`                              |
| Formats    | FBX (3.2 MB), OBJ (168 KB), Blend (1.9 MB)        |
| Materials  | 3: Black, Grey, Main (orange-gold)                |
| Animations | **15 AnimationStacks** in FBX (binary confirmed)  |
| Poly count | Low-poly style (good for web performance)         |
| Aesthetic  | Cute low-poly robot — good for gallery theme      |

**Verdict: YES, usable ✅**. The FBX has 15 animation stacks (likely includes idle, walk, run, etc.). The model is low-poly, free-licensed, and aesthetically suitable.

**Integration Path:**

1. Convert FBX → GLB using `gltf-pipeline` or `gltfjsx`
2. Place GLB in `public/models/robot.glb`
3. Use `gltfjsx` to generate a typed React Three Fiber component
4. Wire animations to ecctrl movement state (idle/walk/run)
5. Replace procedural StickmanCharacter with the robot model

**Alternative Resources (if different models needed):**

- **Mixamo** (https://www.mixamo.com/) — free rigged characters + walk/run/idle animations, auto-retarget
- **Ready Player Me** (https://readyplayer.me/) — custom avatars, GLB export, walk animations via Mixamo
- **Sketchfab** (https://sketchfab.com/search?type=models&q=robot+animated) — search "robot animated walk", filter CC licenses
- **Quaternius** (https://quaternius.com/) — more free CC0 low-poly packs (characters, animals, items)
- **Kenney Assets** (https://kenney.nl/assets) — CC0 game assets including characters
- **Poly Pizza** (https://poly.pizza/) — searchable CC0 3D models
- **Mixamo walk animations** can be retargeted onto any humanoid FBX/GLB model

**No code changes this session** — assessment only.

**Validation:** N/A (research session)

---

### Session 018 — 2026-02-28

**Prompt Summary:** Add camera angle preset system — button on screen opens popup with predefined camera presets (Third Person, First Person, Panoramic, Cinematic, Top Down) plus a custom mode with manual sliders. Settings persist via localStorage.

**What Was Done:**

1. **Camera Presets Library** (`camera-presets.ts`):
   - 5 predefined presets: Third Person, First Person, Panoramic (Bird’s Eye), Cinematic (Low Angle), Top Down
   - Each preset defines: camInitDis, camMaxDis, camMinDis, camInitDir, camTargetPos, FOV
   - Slider limits for custom editor (distance, pitch, FOV, target height)

2. **Camera Store** (`useCameraStore.ts`):
   - Zustand store with `persist` middleware → saves to `localStorage` key `gallery-camera-settings`
   - Manages: activePreset, settings, customSettings, isPanelOpen
   - Actions: setPreset, updateCustomSettings, togglePanel, resetCamera
   - `partialize` avoids persisting isPanelOpen

3. **CameraController** (R3F component):
   - Sits inside Canvas, uses `useThree` to sync FOV from store in real-time
   - Updates camera.fov + updateProjectionMatrix on any FOV change

4. **CameraSettingsPanel** (DOM overlay):
   - Floating 📷 Camera button (bottom-left)
   - Dark popup with preset cards (icon, label, description)
   - Custom mode with 4 sliders: distance, pitch, FOV, target height
   - "Save & Close" button + "Reset" button
   - Click-outside and Escape close the panel
   - Active preset highlighted with blue ring
   - Shows current camera info (preset name, FOV, distance)

5. **Player Integration:**
   - Player.tsx now reads camera props from `useCameraStore` instead of hardcoded PLAYER_CONFIG
   - Ecctrl key includes `activePreset + camInitDis` → forces clean remount on preset change
   - Movement/physics props still from PLAYER_CONFIG, only camera props from store

6. **Tests:** 31 new unit tests for useCameraStore (presets, custom settings, panel toggle, reset, preset validation)

**Files Created:** 4

- `src/modes/mode-c/lib/camera-presets.ts` — preset definitions + types
- `src/modes/mode-c/stores/useCameraStore.ts` — Zustand persist store
- `src/modes/mode-c/components/CameraController.tsx` — R3F FOV sync
- `src/modes/mode-c/components/ui/CameraSettingsPanel.tsx` — popup UI

**Files Modified:** 4

- `src/modes/mode-c/components/character/Player.tsx` — reads camera from store
- `src/modes/mode-c/components/GalleryScene.tsx` — added CameraController
- `src/modes/mode-c/components/ModeCRoot.tsx` — added CameraSettingsPanel
- `src/modes/mode-c/stores/index.ts` — barrel export

**Tests Created:** 1

- `src/modes/mode-c/stores/useCameraStore.test.ts` — 31 tests

**Validation:** type-check ✅ | build ✅ (8/8 routes) | unit tests ✅ (83/83 pass) | dev server ✅

---

### Session 017 — 2026-02-28

**Prompt Summary:** Fix washed-out gallery — all walls/floors invisible due to near-white colors + excessive lighting. Overhaul entire color palette to dark beige/grey tones with proper contrast.

**Root Cause:**
All room colors were in a very narrow light range (#e0–#fa), and combined lighting (ambient 0.7 + directional 1.0 + Environment 0.4 + per-room spotlights 0.8–1.5) washed everything to pure white. Floor, walls, ceiling, and background were all within ~5% luminosity of each other.

**What Was Done:**

1. **Scene Background:**
   - `#f5f0e8` → `#b8b0a4` — warm grey-beige, visible separation from geometry

2. **Global Lighting (GalleryLights.tsx):**
   - Ambient: 0.7 → 0.3 (was blowing out all detail)
   - Directional: 1.0 → 0.5
   - Warm fill: 0.4 → 0.15
   - Bounce: 0.15 → 0.05
   - Environment intensity: 0.4 → 0.15

3. **Lobby Colors:**
   - Floor: `#f0ece4` → `#6b6358` (dark polished stone)
   - Ceiling: `#faf8f4` → `#c4bdb2` (warm light grey)
   - Walls (WallWithDoor default): `#e8e2d6` → `#a89e90` (medium taupe)
   - Pillars: `#e8e2d6` → `#908478`, bases: `#ddd6c8` → `#7d7368`

4. **Projects Room:** floor `#6e6559`, walls `#a5998b`, ceiling `#bfb7ac`; spotlights 1.5ₒ0.6
5. **Bio Room:** floor `#69604e`, walls `#a29688`, ceiling `#bcb4a8`; lights halved; pedestals `#8a8070`
6. **Skills Room:** floor `#5c6870`, walls `#8a96a0`, ceiling `#aab4be`; lights halved
7. **Playground Room:** floor `#5e6b58`, walls `#a09488`, ceiling `#b8b2a6`; lights halved

8. **Exhibit Components:**
   - ProjectFrame inner mat: `#f5f0e8` → `#d8d0c4`
   - TimelinePlaque stone: `#e0d8cc` → `#8a8070`, inner: `#f5f0e8` → `#c8c0b4`
   - SkillOrb pedestal: `#c0ccd8` → `#7a8a98`

9. **Character (StickmanCharacter):**
   - Body: `#f5f0e8` → `#e8ddd0` (cream, visible on dark floors)
   - Accent: `#6ea8d7` → `#4a8ab8` (stronger blue)
   - Shoes: `#b8a89a` → `#8a7a6a` (darker tan)

**Color Contrast Summary:**

- Floors: ~35–45% luminosity (dark stone/wood)
- Walls: ~55–65% luminosity (medium taupe/grey)
- Ceilings: ~70–75% luminosity (light grey)
- Background: ~68% luminosity
- Previous: all 85–98% luminosity (indistinguishable)

**Files Modified:** 11

- `src/modes/mode-c/components/GalleryScene.tsx` — background #b8b0a4, Environment 0.15
- `src/modes/mode-c/components/GalleryLights.tsx` — all intensities halved+
- `src/modes/mode-c/components/rooms/Lobby.tsx` — dark stone floor, taupe walls, grey ceiling/pillars
- `src/modes/mode-c/components/rooms/WallWithDoor.tsx` — default color #a89e90
- `src/modes/mode-c/components/rooms/ProjectsRoom.tsx` — dark floor/walls, reduced lights
- `src/modes/mode-c/components/rooms/BioRoom.tsx` — dark mocha floor/walls, darker pedestals
- `src/modes/mode-c/components/rooms/SkillsRoom.tsx` — dark slate, cool tones, reduced lights
- `src/modes/mode-c/components/rooms/PlaygroundRoom.tsx` — dark sage, warm walls, reduced lights
- `src/modes/mode-c/components/exhibits/ProjectFrame.tsx` — darker inner mat
- `src/modes/mode-c/components/exhibits/TimelinePlaque.tsx` — darker plaque + inner
- `src/modes/mode-c/components/exhibits/SkillOrb.tsx` — darker pedestal
- `src/modes/mode-c/components/character/StickmanCharacter.tsx` — adjusted for contrast

**Validation:** type-check ✅ | lint ✅ | build ✅ (8/8 routes) | unit tests ✅ (52/52 pass) | dev server ✅

---

### Session 016 — 2026-02-28

**Prompt Summary:** Finish all remaining phases of the plan — Phase G8 (Accessibility, Testing & Optimization)

**What Was Done:**

1. **Accessibility — ARIA & Screen Reader:**
   - Added `aria-label` + `role="img"` + `tabIndex={0}` to R3F Canvas
   - Added `role="application"` + `aria-label="Digital Art Gallery"` on root container
   - Created `ScreenReaderContent.tsx` — hidden DOM content with all CV data (projects, experience, education, skills) + keyboard room navigation buttons
   - Added `role="dialog"` + `aria-modal="true"` + `aria-label` to ExhibitPanel
   - Added `aria-live="polite"` + progress label to GalleryLoader
   - Added `aria-label="Return to hub page"` on back-to-hub link
   - GalleryLoader: disabled pulse animation when `prefers-reduced-motion`

2. **Unit Tests (37 new tests, 52 total):**
   - `useGalleryStore.test.ts` — 17 tests: initial state, room navigation, transition, map toggle, exhibit state, room tracking, player position, reset
   - `useExhibitData.test.ts` — 20 tests: formatDate (all months, Present, year-only), proficiencyToValue, proficiencyToColor, exhibitKey/parseExhibitKey roundtrips

3. **E2E Tests:**
   - Created `e2e/gallery.spec.ts` — 3 test suites:
     - Gallery Page: loads, canvas visible, HUD, map button, back link, controls hint
     - Gallery Accessibility: canvas aria-label, screen reader content, dialog role
     - Gallery Map: open/close map overlay

**Files Created:** 4

- `src/modes/mode-c/components/ui/ScreenReaderContent.tsx`
- `src/modes/mode-c/stores/useGalleryStore.test.ts`
- `src/modes/mode-c/hooks/useExhibitData.test.ts`
- `e2e/gallery.spec.ts`

**Files Modified:** 7

- `src/modes/mode-c/components/GalleryScene.tsx` — aria-label, role, tabIndex on Canvas
- `src/modes/mode-c/components/ModeCRoot.tsx` — role=application, ScreenReaderContent, aria-label on back link
- `src/modes/mode-c/components/ui/ExhibitPanel.tsx` — role=dialog, aria-modal
- `src/modes/mode-c/components/ui/GalleryLoader.tsx` — aria-live, reduced motion, useReducedMotion
- `docs/Roadmap.md` — Phase 5 → Complete, Phase G8 tasks marked done
- `docs/Implementation_Plan.md` — Phase G8 marked complete
- `docs/Progress_Log.md` — This session entry

**Validation:** type-check ✅ | lint ✅ (0 errors, 4 warnings) | build ✅ (8/8 routes) | unit tests ✅ (52/52 pass)

---

### Session 015 — 2025-07-29

**Prompt Summary:** Complete Phase G7 remaining items — postprocessing, sparkles, mobile joystick, performance tuning, reduced motion support

**What Was Done:**

1. **Post-Processing Effects (Bloom + Vignette):**
   - Created `GalleryPostProcessing.tsx` — EffectComposer with multisampling=0
   - Bloom: intensity 0.3, threshold 0.6, smoothing 0.4, mipmapBlur for efficient glow
   - Vignette: offset 0.3, darkness 0.4 for cinematic framing
   - `enabled` prop to disable when performance or reduced motion requires it

2. **Particle Dust Motes (Sparkles):**
   - Created `GallerySparkles.tsx` — drei Sparkles component
   - 40 particles, room-dimension-scaled, golden color (#c8b888)
   - Speed 0.15, opacity 0.3 for subtle ambient dust effect
   - Key changes on room transition for fresh particle placement

3. **Mobile Touch Joystick:**
   - Created `MobileJoystick.tsx` — EcctrlJoystick wrapper
   - Touch detection via ontouchstart, maxTouchPoints, pointer:coarse media query
   - Lazy useState initializer (lint-clean), no-render on desktop
   - Joystick left 30/30, size 120, 1 action button right 30/30

4. **Performance Auto-Degradation:**
   - Added `<AdaptiveDpr pixelated />` to Canvas — auto-adjusts pixel ratio
   - Added `<PerformanceMonitor>` with flipflops=3 and onFallback
   - Degraded mode disables: soft shadows → false, antialias → false, ContactShadows hidden
   - `enableEffects` flag: disables postprocessing + sparkles when degraded or reduced motion

5. **Reduced Motion Support:**
   - GalleryScene: `useReducedMotion()` controls postprocessing + sparkles enabled state
   - TransitionOverlay: duration 0 (instant fade) when reduced motion is preferred
   - Effects disable at both levels: prefers-reduced-motion AND performance degradation

**Files Created:** 3

- `src/modes/mode-c/components/GalleryPostProcessing.tsx`
- `src/modes/mode-c/components/GallerySparkles.tsx`
- `src/modes/mode-c/components/ui/MobileJoystick.tsx`

**Files Modified:** 5

- `src/modes/mode-c/components/GalleryScene.tsx` — AdaptiveDpr, PerformanceMonitor, postprocessing, sparkles, reduced motion
- `src/modes/mode-c/components/ModeCRoot.tsx` — Added MobileJoystick import + render
- `src/modes/mode-c/components/ui/TransitionOverlay.tsx` — Reduced motion instant transitions
- `docs/Roadmap.md` — Marked G6 ✅, G7 ✅ complete
- `docs/Implementation_Plan.md` — Updated G7 remaining items to completed

**Validation:** type-check ✅ | lint ✅ (0 errors, 4 warnings) | build ✅ (8/8 routes) | IDE errors ✅ (0)

---

### Session 012 — 2025-07-28

**Prompt Summary:** Address user feedback from gallery testing — fix 4 issues: dark rooms, character model, floaty physics, camera follow

**What Was Done:**

1. **Gallery Aesthetic Overhaul (Light Gallery Colors):**
   - Lobby: floor → warm marble white `#f0ece4`, walls → `#e8e2d6`, ceiling → `#faf8f4`
   - All room colors updated: Projects (cream gallery), Bio (warm marble), Skills (cool white), Playground (pastel)
   - WallWithDoor default color → `#e8e2d6` (light gallery beige)
   - Canvas background → `#f5f0e8` (warm off-white)
   - Pillars redesigned with base + capital (classical gallery columns)
   - GalleryLights: ambient 0.3→0.7, directional 0.8→1.0, added upward bounce light
   - Added `<Environment preset="studio">` for soft HDR reflections
   - Added `<ContactShadows>` for soft floor shadows
   - All label text changed from white-on-dark to dark-on-light
   - HUD, back link, transition overlay updated to light theme

2. **Character Model Redesign (Abstract Bean Person):**
   - Removed gendered features (skin tones, red shoes, blue body)
   - New neutral palette: warm white `#f5f0e8` body, soft blue `#6ea8d7` torso, muted tan feet
   - Added cheek blushes, larger head, smoother proportions
   - Improved animations: head tilt/look-around on idle, bounce walk
   - Run animation faster with more swing, idle has subtle breathing

3. **Movement Physics Fix (Grounded Feel):**
   - `springK`: 0.8→1.2 (more planted on ground)
   - `dampingC`: 0.05→0.08 (less vertical oscillation)
   - `dragDampingC`: 0.08→0.15 (less ice-skating)
   - `floatHeight`: 0.3→0.1 (closer to floor)
   - `maxVelLimit`: 3→2.5, `turnSpeed`: 8→15
   - Added `fallingGravityScale: 2.5` and `accDeltaTime: 8`

4. **Camera Follow Fix (FixedCamera Mode):**
   - Switched from `mode={null}` to `mode="FixedCamera"` — camera auto-follows behind character
   - `camInitDis`: -6→-10 (more distant panoramic view)
   - `camMaxDis`: -10→-14, `camMinDis`: -3→-6
   - Added `camTargetPos: {x:0, y:1, z:0}` (look above character)
   - Added `camFollowMult: 15`, `camLerpMult: 30`, `fixedCamRotMult: 1.5`

5. **Research & Documentation:**
   - Created `docs/Gallery_Research_Findings.md` — thorough research on free assets/libraries
   - Researched: Mixamo, KayKit, Quaternius, Sketchfab, drei helpers, ecctrl API
   - Documented: all 4 fixes needed zero new dependencies

**Files Modified:** 13

- `src/modes/mode-c/components/GalleryScene.tsx` — Environment + ContactShadows
- `src/modes/mode-c/components/GalleryLights.tsx` — Boosted lighting
- `src/modes/mode-c/components/ModeCRoot.tsx` — Light theme link
- `src/modes/mode-c/components/character/StickmanCharacter.tsx` — Full redesign
- `src/modes/mode-c/components/character/Player.tsx` — FixedCamera + physics
- `src/modes/mode-c/components/rooms/Lobby.tsx` — Light colors + pillars
- `src/modes/mode-c/components/rooms/WallWithDoor.tsx` — Default color
- `src/modes/mode-c/components/rooms/RoomShell.tsx` — Label colors
- `src/modes/mode-c/components/rooms/ProjectsRoom.tsx` — Gallery colors
- `src/modes/mode-c/components/rooms/BioRoom.tsx` — Brighter marble tones
- `src/modes/mode-c/components/rooms/SkillsRoom.tsx` — Cool white tones
- `src/modes/mode-c/components/rooms/PlaygroundRoom.tsx` — Pastel tones
- `src/modes/mode-c/components/ui/GalleryHUD.tsx` — Light theme + hint fix
- `src/modes/mode-c/components/ui/TransitionOverlay.tsx` — White fade

**Files Created:** 1

- `docs/Gallery_Research_Findings.md`

**Validation:** type-check ✅ | lint ✅ (0 errors) | build ✅ (8/8 pages)

---

### Session 011 — 2025-07-27

**Prompt Summary:** Implement Phase G5 (Interactive Map) + update all metadata docs

**What Was Done:**

1. **MapPedestal — Interactive 3D Object:**
   - Glowing wireframe icosahedron hovering above a stone pedestal
   - Floats/rotates via useFrame animation
   - Hover: glow intensifies, cursor changes to pointer, label updates
   - Click: opens fullscreen map overlay (store.toggleMap)
   - Replaces the placeholder cylinder in lobby center

2. **MapOverlay — Fullscreen Gallery Map:**
   - Framer Motion animated DOM overlay (bg blur + scale-in card)
   - SVG floor plan with 5 clickable room tiles matching physical layout
   - Current room: cyan accent border + "YOU ARE HERE" indicator
   - Visited rooms: full opacity. Unvisited: dimmed with "?" marker
   - Click room → closes map → fade transition → teleport to room
   - Legend showing current/visited/unexplored visual states
   - Close via X button, click outside, Esc key, or M key

3. **useGalleryControls — Keyboard Shortcuts:**
   - M key: toggle map overlay from anywhere
   - Escape: close map overlay, or close exhibit panel
   - Document-level keydown listener (works regardless of Canvas focus)
   - Skips M key when user is in input/textarea

4. **GalleryHUD Updates:**
   - Added clickable "🗺️ Map" button
   - Updated controls hint: "WASD to move · Mouse to look · M for map"
   - Room indicator now pointer-events-none (non-clickable)

5. **Wiring & Integration:**
   - ModeCRoot: added useGalleryControls hook + MapOverlay component
   - Lobby: MapPedestal replaces placeholder cylinder
   - Z-index layering verified: MapOverlay z-50 > TransitionOverlay z-40 > HUD z-20

6. **Metadata Documentation Updates:**
   - Roadmap.md: G1-G5 all marked ✅ with actual task descriptions
   - Implementation_Plan.md: G1 ✅, G2 ✅, G6(Map) ✅ with implementation details
   - Structure.md: Updated mode-c file tree to match actual directory structure
   - Progress_Log.md: This entry

**Files Created:**

- `src/modes/mode-c/components/rooms/MapPedestal.tsx`
- `src/modes/mode-c/components/ui/MapOverlay.tsx`
- `src/modes/mode-c/hooks/useGalleryControls.ts`

**Files Modified:**

- `src/modes/mode-c/components/ModeCRoot.tsx` — useGalleryControls + MapOverlay
- `src/modes/mode-c/components/rooms/Lobby.tsx` — MapPedestal replaces placeholder
- `src/modes/mode-c/components/ui/GalleryHUD.tsx` — Map button + M key hint
- `src/modes/mode-c/components/ui/index.ts` — MapOverlay export
- `src/modes/mode-c/components/rooms/index.ts` — MapPedestal export
- `src/modes/mode-c/hooks/index.ts` — useGalleryControls export
- `docs/Roadmap.md` — G1-G5 complete
- `docs/Implementation_Plan.md` — G1, G2, G6(Map) complete
- `docs/Structure.md` — Actual mode-c file tree

**Build Status:** ✅ type-check ✅ | lint ✅ (0 errors) | build ✅ (8/8 pages)

**Next Steps:**

- Phase G5(Arch)/G6(Arch): Exhibit System — Connect site.config data to room exhibits
- Phase G7: Visual Polish & Post-Processing
- Phase G8: Accessibility, Testing & Optimization

---

### Session 010 — 2025-07-27

**Prompt Summary:** Implement Phase G3 (Lobby Enhancement) + Phase G4 (Room System & Transitions)

**What Was Done:**

1. **Shared WallWithDoor Component:**
   - Extracted `WallWithDoor` from Lobby into shared component
   - Added `onDoorwayEnter`, `wallColor`, `wallThickness` props
   - CuboidCollider sensor wired to `onIntersectionEnter` callback

2. **Room Transition System:**
   - Created `useRoomTransition` hook — full transition state machine
   - Flow: sensor hit → lockRef → fade-in (400ms) → swap room → settle (300ms) → fade-out → unlock
   - Ref-based debounce prevents rapid re-triggers

3. **Reusable RoomShell Component:**
   - Floor (RigidBody), ceiling, 3 solid walls, 1 south wall with return doorway
   - "← Back to Lobby" Billboard label above return door
   - Accepts dimensions, colors, children for room-specific content

4. **4 Themed Room Stubs:**
   - `ProjectsRoom` — Dark gallery, warm spotlights, painting frames on walls
   - `BioRoom` — Marble/sculpture hall with pedestals and spheres
   - `SkillsRoom` — Tech lab, cool blues, display cases with glowing orbs
   - `PlaygroundRoom` — Bright colors, toy blocks, balls, stacked tower

5. **RoomManager:**
   - Reads `currentRoom` from store, conditionally renders active room
   - Mount/unmount strategy keeps physics world clean
   - Passes `transitionTo` to Lobby, `handleReturnToLobby` to other rooms

6. **Lobby Enhancement (G3):**
   - Wired all 4 doorway sensors to correct target rooms
   - Added decorative corner pillars (4x cylinder geometry)
   - Added central pedestal placeholder (for map in G5)
   - Now accepts `onDoorwayEnter(targetRoom: RoomId)` prop

7. **ModeCRoot + Player Updates:**
   - ModeCRoot now uses `<RoomManager />` instead of manual room rendering
   - Player uses `key={currentRoom}` for clean remount on room change
   - Remount reinitializes ecctrl RigidBody at new spawn position

**Files Created:**

- `src/modes/mode-c/components/rooms/WallWithDoor.tsx`
- `src/modes/mode-c/components/rooms/RoomShell.tsx`
- `src/modes/mode-c/components/rooms/RoomManager.tsx`
- `src/modes/mode-c/components/rooms/ProjectsRoom.tsx`
- `src/modes/mode-c/components/rooms/BioRoom.tsx`
- `src/modes/mode-c/components/rooms/SkillsRoom.tsx`
- `src/modes/mode-c/components/rooms/PlaygroundRoom.tsx`
- `src/modes/mode-c/hooks/useRoomTransition.ts`

**Files Modified:**

- `src/modes/mode-c/components/rooms/Lobby.tsx` — Doorway sensors, decorations, shared WallWithDoor
- `src/modes/mode-c/components/ModeCRoot.tsx` — RoomManager integration
- `src/modes/mode-c/components/character/Player.tsx` — Key-based teleportation
- `src/modes/mode-c/components/rooms/index.ts` — Barrel exports for all rooms
- `src/modes/mode-c/hooks/index.ts` — Barrel export for useRoomTransition
- `docs/Implementation_Plan.md` — G3 ✅, G4 ✅

**Build Status:** ✅ type-check ✅ | lint ✅ (0 errors) | build ✅ (8/8 pages)

**Next Steps:**

- Phase G5: Interactive Map — 3D pedestal in lobby, 2D overlay with room teleportation
- Phase G6: Exhibit System — Connect site.config data to room exhibits
- Phase G7: Visual Polish & Post-Processing
- Phase G8: Accessibility, Testing & Optimization

---

### Session 008 — 2025-07-27

**Prompt Summary:** Architecture & planning for Mode C — "The Digital Art Gallery" (3D museum experience)

**What Was Done:**

1. **Deep Codebase Research:**
   - Analyzed full mode architecture (registry.ts, types.ts, Mode B implementation)
   - Reviewed R3F stack setup, stores, routes, constants, site.config.ts pipeline
   - Mapped all patterns to follow for Mode C scaffolding

2. **Online Library Research:**
   - Fetched `@react-three/rapier` docs — Physics, RigidBody, colliders, sensors
   - Fetched `ecctrl` (pmndrs) docs — floating capsule character controller, all props
   - Fetched `@react-three/drei` docs — Text, Html, Billboard, KeyboardControls
   - Fetched `@react-three/postprocessing` docs — Bloom, Vignette (optional G7)

3. **Gallery Architecture Plan:**
   - Created comprehensive `docs/Gallery_Architecture.md` (~450 lines)
   - Covers: vision, tech research chain-of-thought, tech stack, architecture diagram, complete file tree (~40 files), useGalleryStore interface design, 8-phase roadmap (G1–G8), data flow, performance budget, accessibility strategy, open questions

4. **Key Architectural Decisions:**
   - **ecctrl** over custom RigidBody capsule (saves 500+ LOC of physics math)
   - Sensor-based doorways (CuboidCollider sensor) over manual raycasting
   - Procedural geometry for MVP; Blender GLB models deferred
   - Per-room Suspense boundaries for progressive loading
   - "Goofy" movement via ecctrl prop tuning (springK, dampingC, dragDampingC)

5. **Documentation Updates (all metadata files):**
   - `Roadmap.md` — Added Phase 5 with all G1–G8 sub-phases (~40 tasks)
   - `Tech_Stack.md` — Added ecctrl, Mode C bundle info, updated 3D section
   - `Structure.md` — Added gallery route, full mode-c/ file tree, dependency flow
   - `Implementation_Plan.md` — Added Phase 5 Gallery (G1–G8) with detailed substeps
   - `Decisions.md` — Added ADR-007 (ecctrl character controller choice)
   - `Progress_Log.md` — This entry

**Files Created:**

- `docs/Gallery_Architecture.md` — Master architecture document for Mode C

**Files Modified:**

- `docs/Roadmap.md` — Phase 5 Gallery added
- `docs/Tech_Stack.md` — ecctrl + Mode C bundle info
- `docs/Structure.md` — Full mode-c/ file tree + gallery route
- `docs/Implementation_Plan.md` — Phase 5 (G1–G8) implementation steps
- `docs/Decisions.md` — ADR-007 added

**Dependencies Planned (not yet installed):**

- `ecctrl ^1.0.97` — Floating capsule character controller (install in Phase G1)
- `@react-three/postprocessing` — Optional, Phase G7

**No Code Written:** This was a planning-only session per user request.

**Open Questions for User:**

1. Character style preference (humanoid mesh vs capsule vs abstract shape)?
2. Playground room content (mini-games, sandbox, interactive toys)?
3. Gallery aesthetic (dark moody museum vs clean modern vs colorful playful)?
4. Sound/audio (ambient museum sounds, footsteps — yes/no)?

**Next Steps:**

- Phase G1: Install ecctrl, scaffold route/loader/root/store, register Mode C
- Phase G2: Character controller & movement tuning
- Continue through G3–G8 per Implementation_Plan.md

**Build Status:** ✅ No code changes — planning only

---

### Session 007 — 2025-02-26

**Prompt Summary:** Complete stable initial version, create tutorial/suggestions docs, implement easy content management

**What Was Done:**

1. **Easy Content Management System:**
   - Created `site.config.ts` — Single unified config file for ALL personal information
   - Created `src/lib/config-adapter.ts` — Bridges config to existing data structures
   - Created `scripts/sync-config.ts` — Syncs config to JSON data files
   - Updated `src/lib/constants.ts` — Now imports from site.config.ts
   - Added `pnpm sync-config` script to package.json
   - Installed `tsx` for running TypeScript scripts

2. **Tutorial Documentation:**
   - Created `docs/Tutorial.md` — Quick start guide (5-minute read)
   - Covers: installation, content editing, images, colors, deployment
   - Includes commands reference and troubleshooting

3. **Suggestions & Research:**
   - Created `docs/Suggestions.md` — Feature ideas based on top CV websites
   - Researched Brittany Chiang, Josh Comeau, Lee Robinson, Bruno Simon portfolios
   - Includes priority levels, content suggestions, technical improvements
   - Added implementation checklist for launch

4. **Stable Version Validation:**
   - All TypeScript checks pass
   - All ESLint checks pass (minor warnings in scripts only)
   - Production build successful
   - All 15 unit tests pass

**Files Created:**

- `site.config.ts` — Unified content configuration (root)
- `src/lib/config-adapter.ts` — Config to data adapter
- `scripts/sync-config.ts` — Config sync script
- `docs/Tutorial.md` — Quick start tutorial
- `docs/Suggestions.md` — Feature suggestions and ideas

**Files Modified:**

- `src/lib/constants.ts` — Now imports from site.config.ts
- `package.json` — Added sync-config script, tsx dependency
- `src/data/cv.json` — Now synced from site.config.ts
- `src/data/projects.json` — Now synced from site.config.ts
- `src/data/skills.json` — Now synced from site.config.ts

**Dependencies Added:**

- `tsx` — TypeScript execution for scripts

**Content Management Answer:**

The website now has an easy content management system:

| To change... | Edit this file                          |
| ------------ | --------------------------------------- |
| Everything   | `site.config.ts` (root folder)          |
| Then run     | `pnpm sync-config` to update JSON files |

**Next Steps:**

- Deploy to Vercel
- Add real personal content
- Add profile photo and project images
- Consider implementing blog section

**Build Status:** ✅ Passing

---

### Session 006 — 2025-07-16

**Prompt Summary:** Implement Phase 3 (Polish & Production) — Accessibility, Performance, SEO, Testing

**What Was Done:**

1. **Validated Phase 2.12 build** — `pnpm type-check && pnpm lint && pnpm build` all passing

2. **Step 3.1: Accessibility Features:**
   - Created `src/components/ui/SkipLink.tsx` — keyboard skip navigation component
   - Added `id="main-content"` to `HubLanding.tsx`, `ModeARoot.tsx`, and Mode B layout
   - Changed Mode B layout from `<div>` to `<main>` for semantic HTML
   - Changed HubLanding from `<div>` to `<main>` for semantic HTML

3. **Step 3.2: Performance Optimization:**
   - Installed `@next/bundle-analyzer` for bundle analysis
   - Installed `cross-env` for cross-platform env variables
   - Updated `next.config.ts` with bundle analyzer integration
   - Added `pnpm analyze` script to package.json

4. **Step 3.3: SEO Implementation:**
   - Created `src/components/seo/JsonLd.tsx` — JSON-LD structured data (Person, WebSite, ProfilePage schemas)
   - Created `src/app/opengraph-image.tsx` — dynamic OG image generation with Edge runtime
   - Created `src/app/sitemap.ts` — dynamic sitemap generation
   - Created `public/robots.txt` — crawler instructions with sitemap reference
   - Integrated SkipLink and JsonLd components into root layout

5. **Step 3.4: Testing Setup:**
   - Installed Vitest, @testing-library/react, @testing-library/dom, @vitejs/plugin-react
   - Replaced jsdom with happy-dom for better ESM compatibility
   - Created `vitest.config.mts` with path aliases and happy-dom environment
   - Created `vitest.setup.mts` with cleanup and matchMedia mock
   - Created `src/lib/utils.test.ts` — 12 unit tests for cn, formatDate, fallback
   - Created `src/hooks/useMediaQuery.test.ts` — 3 unit tests for useMediaQuery hook
   - Installed @playwright/test for E2E testing
   - Created `playwright.config.ts` with multi-browser setup
   - Created `e2e/navigation.spec.ts` — Hub navigation and accessibility E2E tests
   - Added test scripts: `test`, `test:run`, `test:coverage`, `test:e2e`

6. **Final Validation:**
   - All 15 unit tests pass: `pnpm test:run`
   - TypeScript: ✅ Clean
   - ESLint: ✅ No errors
   - Build: ✅ Compiled successfully

**Files Created:**

- `src/components/ui/SkipLink.tsx` — Accessibility skip link
- `src/components/seo/JsonLd.tsx` — JSON-LD structured data
- `src/app/opengraph-image.tsx` — Dynamic OG image (Edge runtime)
- `src/app/sitemap.ts` — Dynamic sitemap generation
- `public/robots.txt` — Robot crawler instructions
- `vitest.config.mts` — Vitest configuration
- `vitest.setup.mts` — Vitest setup file
- `src/lib/utils.test.ts` — Utility function tests
- `src/hooks/useMediaQuery.test.ts` — Hook tests
- `playwright.config.ts` — Playwright configuration
- `e2e/navigation.spec.ts` — E2E navigation tests

**Files Modified:**

- `src/app/layout.tsx` — Added SkipLink and JsonLd components
- `src/components/hub/HubLanding.tsx` — Changed to `<main>`, added `id="main-content"`
- `src/modes/mode-a/components/ModeARoot.tsx` — Added `id="main-content"` to main
- `src/app/immersive/layout.tsx` — Changed to `<main>`, added `id="main-content"`
- `next.config.ts` — Added bundle analyzer integration
- `package.json` — Added test scripts and analyze script

**Dependencies Added:**

- `@next/bundle-analyzer` — Bundle analysis
- `cross-env` — Cross-platform env variables
- `vitest` — Unit testing framework
- `@testing-library/react` — React testing utilities
- `@testing-library/dom` — DOM testing utilities
- `@vitejs/plugin-react` — Vite React plugin for Vitest
- `happy-dom` — Fast DOM implementation (ESM-compatible)
- `@playwright/test` — E2E testing framework

**Issues Encountered:**

- jsdom → ESM compatibility errors with Vitest 4 → Switched to happy-dom
- vitest.config.ts → ESM errors → Renamed to vitest.config.mts
- pnpm approve-builds interactive prompt → Works locally, needs manual approval

**Next Steps:**

- Run Playwright browser install: `npx playwright install`
- Run E2E tests: `pnpm test:e2e`
- Populate real CV data (Phase 1.1-1.3) when ready
- Consider Phase 4 features (Blog, Contact Form, Mode C)

**Build Status:** ✅ Passing

---

### Session 005 — 2025-07-15

**Prompt Summary:** Continue Phase 2 — Mode B Zustand store, content panels, camera transitions

**What Was Done:**

1. **Created Zustand Store for Mode B:**
   - `src/stores/useModeBStore.ts` — Mode B state management with:
     - Selected object tracking
     - Content panel visibility
     - Camera target position
     - Actions: selectObject, clearSelection, setContentPanelOpen

2. **Created Content Panel Component:**
   - `src/modes/mode-b/components/ContentPanel.tsx` — CV content overlay with:
     - Dynamic content based on selected object (About, Experience, Projects, Skills, Contact)
     - Animated entrance/exit with Framer Motion AnimatePresence
     - Pulls real data from cv.json, projects.json, skills.json
     - Close button with keyboard support

3. **Created Camera Transition Hook:**
   - `src/hooks/useCameraTransition.ts` — Smooth camera animations with:
     - Configurable duration and easing
     - Position and target interpolation
     - SSR-safe implementation

4. **Updated InteractiveObject:**
   - Wired to Zustand store for selection state
   - Visual feedback when selected (different color)
   - Proper click handling

5. **Updated CameraRig:**
   - Integrated useCameraTransition hook
   - Camera moves to selected object position
   - Smooth transitions between views

6. **Fixed Lint Errors:**
   - Changed all imports to `type` imports where appropriate
   - Removed lucide-react dependency issues
   - Fixed unused variable warnings

**Files Created:**

- `src/stores/useModeBStore.ts`
- `src/modes/mode-b/components/ContentPanel.tsx`
- `src/hooks/useCameraTransition.ts`

**Files Modified:**

- `src/modes/mode-b/components/InteractiveObject.tsx`
- `src/modes/mode-b/cameras/CameraRig.tsx`
- `src/modes/mode-b/components/ModeBRoot.tsx`

**Build Status:** ✅ Passing

---

### Session 004 — 2025-07-15

**Prompt Summary:** Implement Phase 2 — Mode B (Immersive 3D Experience) MVP

**What Was Done:**

1. **Research Phase** - Fetched and analyzed documentation:
   - React Three Fiber: Canvas setup, shadows, dpr, camera config
   - @react-three/drei: Environment (IBL), OrbitControls, Html, useProgress, MeshReflectorMaterial
   - Reviewed existing Mode B skeleton code structure

2. **Created Core R3F Infrastructure:**
   - `Scene.tsx`: Canvas wrapper with soft shadows, dpr clamping, camera config
   - `Loader.tsx`: Loading screen with useProgress hook + Framer Motion animations

3. **Created 3D Room Environment:**
   - `Room.tsx`: Full room geometry with:
     - MeshReflectorMaterial floor for subtle reflections
     - Back and side walls
     - Desk with legs and surface
     - Monitor with screen glow effect

4. **Created Lighting System:**
   - `RoomLights.tsx`: Complete three-point lighting:
     - Environment (city preset) for IBL
     - Ambient fill light
     - Directional key light with shadow mapping (2048px)
     - Fill directional from opposite side
     - Accent point light (teal colored)
     - Backlight for rim effect

5. **Created Camera Controls:**
   - `CameraRig.tsx`: OrbitControls with:
     - Polar angle constraints (avoid below floor)
     - Azimuth angle limits (±60°)
     - Distance constraints (2-8 units)
     - Smooth damping
     - Pan disabled for cleaner UX

6. **Created Interactive System:**
   - `InteractiveObject.tsx`: Reusable clickable hotspot with:
     - Hover state with scale animation (useFrame lerp)
     - Emissive material feedback
     - Pulsing ring effect
     - Html label overlay with drei's Html component
     - Cursor change on hover

7. **Updated ModeBRoot.tsx:**
   - Integrated all components into scene
   - Added 5 interactive hotspots (About, Experience, Projects, Skills, Contact)
   - Added "Back to Hub" link using Next.js Link
   - Added instruction overlay

**Files Created:**

- [src/modes/mode-b/components/Scene.tsx](../src/modes/mode-b/components/Scene.tsx)
- [src/modes/mode-b/components/Loader.tsx](../src/modes/mode-b/components/Loader.tsx)
- [src/modes/mode-b/components/Room.tsx](../src/modes/mode-b/components/Room.tsx)
- [src/modes/mode-b/components/InteractiveObject.tsx](../src/modes/mode-b/components/InteractiveObject.tsx)
- [src/modes/mode-b/lights/RoomLights.tsx](../src/modes/mode-b/lights/RoomLights.tsx)
- [src/modes/mode-b/cameras/CameraRig.tsx](../src/modes/mode-b/cameras/CameraRig.tsx)

**Files Modified:**

- [src/modes/mode-b/components/ModeBRoot.tsx](../src/modes/mode-b/components/ModeBRoot.tsx) — Complete rewrite to integrate all components

**Key Decisions:**

- Used MeshReflectorMaterial for floor instead of custom shader (drei provides optimized solution)
- Environment preset "city" for realistic IBL (production should use self-hosted HDR)
- Interactive objects are placeholder spheres (will be replaced with models in Step 2.9)
- Navigation handlers are placeholders (`handleNavigation`) to avoid lint console warnings
- No physics (Rapier) needed for MVP — will add in Step 2.11 if desired

**Issues Encountered:**

- Lint error: `<a>` element for navigation → Fixed with Next.js `<Link>`
- Lint warnings: console.log in onClick → Fixed with no-op navigation handler

**Next Steps (Phase 2 remaining):**

- Step 2.7: Add Html overlays for detailed info panels
- Step 2.8: Camera transitions (gsap or @react-three/drei CameraShake)
- Step 2.9: Replace placeholder geometry with GLTF models
- Step 2.10: Performance optimization (Instances, Bvh, AdaptiveDpr)
- Step 2.11: Optional physics with @react-three/rapier
- Step 2.12: E2E testing with Playwright

**Build Status:** ✅ Passing

- TypeScript: ✅ Clean
- ESLint: ✅ No errors/warnings
- Build: ✅ Compiled successfully

---

### Session 003 — 2025-07-15

**Prompt Summary:** Create detailed implementation plan and progress log files

**What Was Done:**

1. Analyzed remaining work from Roadmap.md (Phases 2-4)
2. Created `docs/Implementation_Plan.md` with:
   - Detailed step-by-step implementation guide for all remaining phases
   - Substeps broken down for atomic commits
   - LLM tips for each step (research strategies, coding patterns, common pitfalls)
   - Code examples and patterns
   - Appendix with common workflows and checklists
3. Created `docs/Progress_Log.md` (this file)

**Files Created:**

- [docs/Implementation_Plan.md](Implementation_Plan.md) — Full implementation roadmap with ~26 detailed steps
- [docs/Progress_Log.md](Progress_Log.md) — Session tracking (this file)

**Key Decisions:**

- Phase 2 broken into 12 incremental steps (research → canvas → loading → room → lights → interactions → overlays → camera → models → optimization → physics → testing)
- Phase 3 split into 4 areas: accessibility, performance, SEO, testing
- Phase 4 kept as high-level ideas (blog, contact form, Mode C, i18n, PWA, CI/CD)

**Issues Encountered:**

- None

**Next Steps:**

- User should choose: populate real CV data (Step 1.1-1.3) OR proceed to Phase 2 with sample data
- If Phase 2: Start with Step 2.1 (Research 3D Best Practices)

**Build Status:** ✅ Passing (no code changes)

---

### Session 002 — 2025-07-15

**Prompt Summary:** Implement Phase 1 — Hub + Mode A (Minimalist)

**What Was Done:**

1. Fixed data files to match TypeScript interfaces:
   - `cv.json`: Added `id`, `location`, `field`, renamed `summary` → `bio`, fixed `endDate`
   - `projects.json`: Changed `liveUrl`/`repoUrl`/`imageUrl` → `links` object + `image`
   - `skills.json`: Added `category` field to each skill, removed `yearsOfExperience`

2. Enhanced design system:
   - Updated `globals.css` with teal accent colors, new tokens (`--accent-muted`, `--surface`, `--border`), animation keyframes, custom scrollbar, `.gradient-text` utility

3. Updated constants:
   - Added `MODE_A_SECTIONS` array for nav/scroll tracking
   - Added `SOCIAL_LINKS` object

4. Built Hub Landing Page (`HubLanding.tsx`):
   - Staggered fade-in-up hero animation
   - Social icons (GitHub, LinkedIn, Email)
   - Mode selector heading

5. Enhanced ModeCard (`ModeCard.tsx`):
   - Staggered scale-in entrance animation
   - Spring-based hover/tap with shadow lift
   - Animated arrow CTA on hover
   - Accent glow on hover

6. Built Mode A layout system:
   - `ModeANav.tsx`: Sticky sidebar (desktop) with active section indicator, social links, back-to-hub; compact sticky header (mobile) with scrollable pills
   - `useActiveSection.ts`: IntersectionObserver-based scroll tracking hook
   - Updated `minimalist/layout.tsx` with semantic wrapper

7. Created all Mode A section components:
   - `SectionWrapper.tsx`: Shared container with IO registration + whileInView animation
   - `AboutSection.tsx`: Bio display with keyword highlights
   - `ExperienceSection.tsx`: Timeline cards with company links, highlights, tech badges
   - `ProjectsSection.tsx`: Featured badge, GitHub/live links, description, tech badges
   - `SkillsSection.tsx`: Category groups with 4-level proficiency dots
   - `EducationSection.tsx`: Same pattern as experience
   - `ContactSection.tsx`: CTA button, footer with tech credits + copyright

8. Wired ModeARoot.tsx:
   - Two-column layout (lg+), single-column (mobile)
   - Integrated all sections with scroll tracking

9. Fixed build issues:
   - Changed `motion/react` → `framer-motion` imports (8 files)
   - Added `as const` to fix ease array type error

10. Updated documentation:
    - `Roadmap.md`: Marked 18 Phase 1 tasks complete
    - `Structure.md`: Added new files and hooks
    - `Tech_Stack.md`: Updated status

**Files Changed:**

- `src/data/cv.json`, `projects.json`, `skills.json`
- `src/app/globals.css`, `minimalist/layout.tsx`
- `src/lib/constants.ts`
- `src/components/hub/HubLanding.tsx`, `ModeCard.tsx`
- `src/hooks/useActiveSection.ts` (new)
- `src/modes/mode-a/components/ModeARoot.tsx`, `ModeANav.tsx` (new), `SectionWrapper.tsx` (new), `AboutSection.tsx` (new), `ExperienceSection.tsx` (new), `ProjectsSection.tsx` (new), `SkillsSection.tsx` (new), `EducationSection.tsx` (new), `ContactSection.tsx` (new)
- `docs/Roadmap.md`, `Structure.md`, `Tech_Stack.md`

**Issues Encountered:**

- `motion/react` module not found → Package is `framer-motion`, not `motion`
- Ease array type error → Fixed with `as const`

**Build Status:** ✅ Passing

---

### Session 001 — 2025-07-14

**Prompt Summary:** Phase 0 — Architecture, documentation, and environment setup

**What Was Done:**

1. Created project vision and goals
2. Selected tech stack (Next.js 16, React 19, TypeScript 5.9, Tailwind v4, R3F, Zustand)
3. Initialized project with `pnpm create next-app`
4. Configured TypeScript strict mode with additional flags
5. Configured Tailwind CSS v4 (CSS-based @theme)
6. Configured ESLint 9 flat config + Prettier
7. Set up Husky, lint-staged, commitlint
8. Created architecture documentation:
   - `docs/Structure.md`
   - `docs/Tech_Stack.md`
   - `docs/Decisions.md`
   - `docs/Roadmap.md`
   - `docs/CONTRIBUTING.md`
9. Created mode plugin system (`ModeConfig` interface, registry)
10. Created Zustand store skeleton
11. Created shared hooks (useMode, useMediaQuery, useReducedMotion)
12. Created Hub landing page skeleton (HubLanding, ModeCard)
13. Created route layouts and pages (/minimalist, /immersive)
14. Set up MDX infrastructure
15. Created sample data files (cv.json, projects.json, skills.json)
16. Validated production build

**Files Created:**

- All initial project structure (25+ files)
- All documentation files (5 files)
- All type definitions

**Build Status:** ✅ Passing

---

## Template for New Entries

```markdown
### Session XXX — YYYY-MM-DD

**Prompt Summary:** [One-line description of what was requested]

**What Was Done:**

1. [Major task 1]
2. [Major task 2]
   ...

**Files Changed:**

- [file1]
- [file2]
  ...

**Issues Encountered:**

- [Issue 1] → [Resolution]
- None (if no issues)

**Next Steps:**

- [What should happen next]

**Build Status:** ✅ Passing / ❌ Failing (reason)
```
