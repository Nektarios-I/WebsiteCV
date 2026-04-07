# 🖥️ Mode B: Aesthetic Desk Setup Redesign — Master Design Document

> **Created:** 2026-03-01  
> **Status:** Design Phase — Awaiting Implementation  
> **Purpose:** Transform Mode B from a bare room with floating spheres into a gorgeous, immersive "cozy developer workspace" scene  
> **Approach:** Procedural-first (build in React/Three.js), with Sketchfab/Poly.pizza GLTF models as acceleration where available

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Design Vision](#2-design-vision)
3. [Prioritized Element List (Most → Least Aesthetic Impact)](#3-prioritized-element-list)
4. [CV Content Mapping (Object → Data)](#4-cv-content-mapping)
5. [Available Free 3D Assets (Ready Packs)](#5-available-free-3d-assets)
6. [Implementation Tiers](#6-implementation-tiers)
7. [Technical Constraints & Lessons Learned](#7-technical-constraints--lessons-learned)
8. [Color Palette & Material Reference](#8-color-palette--material-reference)
9. [Camera & Composition](#9-camera--composition)
10. [Reference Inspirations](#10-reference-inspirations)

---

## 1. Current State Analysis

### What Exists Now

The current Mode B scene is extremely minimal:

- **Room:** 10×8×4 unit box — dark `#1a1a1a` walls, `#101010` reflective floor, no ceiling
- **Desk:** A single 2.4×1.0 dark grey desk (`#2a2a2a`) with 4 thin legs
- **Monitor:** A single small monitor (0.9×0.5) with a faint teal glow — positioned on desk
- **Interactive Objects:** 5 floating spheres with teal glow + ring effect (About, Experience, Projects, Skills, Contact)
- **Lighting:** Environment map ("city"), one directional key light, one fill light, one teal accent point light, one backlight
- **Camera:** OrbitControls with angle/distance limits, camera transitions per object
- **Content Panel:** Framer Motion slide-in panel on the right side showing CV data when a sphere is clicked

### Problems

1. **Visually bare** — looks like an unfinished prototype, not an aesthetic portfolio
2. **No atmosphere** — no sense of personality, mood, or craftsmanship
3. **Floating spheres feel disconnected** — they don't relate to any physical object; users don't know what to click
4. **Single small monitor** — doesn't feel like a real workspace
5. **No accessories** — no keyboard, mouse, chair, plants, books, coffee, etc.
6. **Walls are empty** — no shelving, artwork, window, or wall decoration
7. **Floor is flat** — no rug, variation, or grounding element
8. **No depth/layers** — everything is on one plane; no foreground/background visual interest

---

## 2. Design Vision

### Theme: "Cozy Night-Time Developer's Dream Studio"

Imagine the aesthetic of a **lo-fi study beats YouTube thumbnail** crossed with a **Dribbble-worthy developer setup post** — warm lighting, a window showing rain at night, neon accents, plants, a beautiful multi-monitor PC setup, and thoughtful details that tell a story.

### Key Aesthetic Pillars

| Pillar                 | Description                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| **Warm & Cozy**        | Warm amber/orange light from a desk lamp, cool blue moonlight from the window — contrast creates depth |
| **Night Scene**        | Window shows a nighttime cityscape or rain — creates intimacy and atmospheric mood                     |
| **Tech-Forward**       | Ultrawide/dual monitors, mechanical keyboard with underglow, RGB accents — signals competence          |
| **Lived-In**           | Coffee mug, open notebook, sticky notes, headphones — feels like someone actually works here           |
| **Natural Touch**      | Plants (monstera, pothos, small succulent), maybe a cat — breaks the all-tech monotony                 |
| **Clean But Personal** | Well-organized but not sterile — personal items that tell a story (figurine, photo frame, books)       |

### Composition: Front-Facing "Hero Shot"

The camera faces forward, looking at the desk from slightly above and behind (like sitting in the chair looking at the setup). No need to rotate 360° — this is a **cinematic composition**, like a diorama or isometric room. The user can slightly orbit/zoom to explore, but the default view is the "money shot."

---

## 3. Prioritized Element List

> Ordered by **aesthetic impact** — most transformative elements first.  
> Each item has a difficulty estimate and whether it can link to CV data.

### TIER 1: Foundational (Transforms the Scene) ⭐⭐⭐

| #   | Element                           | Description                                                                                                                                                    | Difficulty | CV Link?                                                    |
| --- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------- |
| 1   | **Ultrawide Monitor (Main)**      | Large curved ultrawide monitor as centerpiece. Glowing screen showing Projects carousel. This IS the focal point.                                              | Medium     | ✅ Projects — screen displays project info, arrows to cycle |
| 2   | **Window with Night Rain**        | Large window on the back wall showing a dark cityscape/night sky with animated rain droplets on glass. Creates mood & depth. Subtle blue moonlight streams in. | Hard       | ❌ Atmospheric only                                         |
| 3   | **Warm Desk Lamp**                | Articulated/modern desk lamp with warm amber point light. Creates the signature warm/cool light contrast. Cast soft shadows.                                   | Easy       | ❌ Lighting element                                         |
| 4   | **Gaming/Office Chair**           | Visible behind the desk or to the side — leather/mesh modern chair with armrests. Grounds the scene as a real workspace.                                       | Medium     | ❌ Furniture                                                |
| 5   | **Proper L-Shaped or Wide Desk**  | Replace the tiny 2.4-wide desk with a larger L-shaped desk (or wide 3.5m desk) with better material (walnut wood + dark metal legs).                           | Medium     | ❌ Furniture foundation                                     |
| 6   | **Wall Color & Material Upgrade** | Change from flat `#1a1a1a` to a rich dark navy/charcoal with subtle texture. Maybe a brick accent wall or wood paneling on one wall.                           | Easy       | ❌ Atmosphere                                               |
| 7   | **Floor Upgrade (Wood + Rug)**    | Dark hardwood floor with a soft area rug under the desk/chair area. Rug adds color and warmth.                                                                 | Easy       | ❌ Atmosphere                                               |

### TIER 2: Desktop Accessories (Makes It Believable) ⭐⭐

| #   | Element                       | Description                                                                                            | Difficulty | CV Link?                              |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------- |
| 8   | **Mechanical Keyboard**       | Low-profile mechanical keyboard with subtle key-cap detail. Optional: faint underglow lighting.        | Easy       | ❌ Set dressing                       |
| 9   | **Mouse + Mousepad**          | Ergonomic mouse on a large desk mat / mousepad (dark with accent edge stitching).                      | Easy       | ❌ Set dressing                       |
| 10  | **Second Monitor (Vertical)** | A smaller vertical monitor on a side arm — showing a code editor or terminal. Links to Skills section. | Medium     | ✅ Skills — displays skill categories |
| 11  | **Headphones**                | Over-ear headphones either on a headphone stand or draped on the monitor arm.                          | Easy       | ❌ Personality                        |
| 12  | **Coffee Mug**                | Ceramic mug with steam particles. Small but powerful detail — "someone is here."                       | Easy       | ❌ Atmosphere (maybe Bio trigger)     |
| 13  | **Notebook/Notepad**          | Open notebook with pen — handwritten notes feel. Link to experience timeline.                          | Easy       | ✅ Experience — click opens timeline  |
| 14  | **Desk Lamp (Small)**         | If not already the main lamp — a small LED desk strip or monitor light bar (like BenQ ScreenBar).      | Easy       | ❌ Set dressing                       |

### TIER 3: Personalization & Storytelling ⭐⭐

| #   | Element                                         | Description                                                                       | Difficulty | CV Link?                                                 |
| --- | ----------------------------------------------- | --------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------- |
| 15  | **Potted Plant (Large — Monstera/Fiddle-Leaf)** | Standing plant next to the desk, slightly in corner. Adds life and organic shape. | Easy       | ❌ Atmosphere                                            |
| 16  | **Small Desk Plant (Succulent/Pothos)**         | A small potted succulent or trailing pothos on the desk or shelf.                 | Easy       | ❌ Set dressing                                          |
| 17  | **Bookshelf / Floating Shelves**                | Mounted on the wall with tech books, a small figure, and a photo frame.           | Medium     | ✅ Education — books = degrees/learning                  |
| 18  | **Whiteboard / Cork Board**                     | Wall-mounted board with sticky notes, goals, mind-map.                            | Medium     | ✅ Goals/Bio — displays career goals or "about me" items |
| 19  | **Figurine / Collectible**                      | Small desk figurine (robot, astronaut, retro game character). Personality piece.  | Easy       | ✅ Bio — click to read about personality/interests       |
| 20  | **Photo Frame**                                 | Small photo frame on desk or shelf. Personal touch.                               | Easy       | ❌ Atmosphere                                            |
| 21  | **Wall Art / Poster**                           | Framed art print or motivational poster on the wall.                              | Easy       | ✅ Certifications / achievements                         |
| 22  | **Headphone Stand**                             | Vertical wooden or metal headphone stand next to monitor.                         | Easy       | ❌ Set dressing                                          |

### TIER 4: Ambient & Atmospheric (Creates Magic) ⭐

| #   | Element                                | Description                                                                                                              | Difficulty | CV Link?                          |
| --- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------- | --------------------------------- |
| 23  | **LED Strip / RGB Accent**             | LED strip behind the desk / under shelves casting colored ambient glow (teal/purple). Accent lighting.                   | Easy       | ❌ Atmosphere                     |
| 24  | **Rain Droplets on Window (Animated)** | Animated rain drops sliding down the window glass. Shader or particle effect. Creates the "cozy rainy night" atmosphere. | Hard       | ❌ Atmosphere                     |
| 25  | **Floating Dust Particles**            | Subtle golden dust motes in lamp light beam. Like the GallerySparkles concept.                                           | Easy       | ❌ Atmosphere                     |
| 26  | **Cat**                                | A sleeping or slowly blinking cat curled up on the desk corner or on a cat bed nearby. Animated idle (breathing).        | Hard       | ❌ Personality (Easter egg)       |
| 27  | **Tablet / iPad**                      | A tablet leaning on a stand or flat on desk, displaying a dashboard or portfolio overview.                               | Easy       | ✅ Contact / social links display |
| 28  | **Cable Management Details**           | Subtle cables between monitor/PC/keyboard. Adds realism.                                                                 | Easy       | ❌ Added realism                  |
| 29  | **Desktop PC (Tower)**                 | A visible PC tower under or beside the desk — maybe with a clear side panel showing internal glow.                       | Medium     | ❌ Set dressing                   |
| 30  | **Speakers**                           | Small desktop speakers flanking the monitor.                                                                             | Easy       | ❌ Set dressing                   |
| 31  | **Coaster**                            | A small coaster under the coffee mug. Tiny detail.                                                                       | Easy       | ❌ Set dressing                   |
| 32  | **Ceiling Light**                      | Overhead pendant lamp or track lighting — for ambient fill.                                                              | Easy       | ❌ Lighting                       |
| 33  | **Clock (Wall)**                       | Minimalist wall clock.                                                                                                   | Easy       | ❌ Set dressing                   |
| 34  | **Skybox/Background**                  | Night sky gradient or city skyline visible through window.                                                               | Medium     | ❌ Atmosphere                     |

### TIER 5: Stretch / Easter Eggs

| #   | Element                           | Description                                             | Difficulty | CV Link?                    |
| --- | --------------------------------- | ------------------------------------------------------- | ---------- | --------------------------- |
| 35  | **Vinyl Record Player / Speaker** | Playing music feel — maybe with a album cover.          | Medium     | ❌ Personality              |
| 36  | **Snack / Food Item**             | A snack bowl or snack wrapper.                          | Easy       | ❌ Personality              |
| 37  | **Calendar**                      | Desk or wall calendar showing certifications dates.     | Easy       | ✅ Certifications timeline  |
| 38  | **Sticky Notes**                  | Colorful sticky notes on monitor bezel or wall.         | Easy       | ✅ Quick facts / highlights |
| 39  | **Drawer / Filing Cabinet**       | Under desk storage. Click to open = download resume.    | Medium     | ✅ Resume download          |
| 40  | **Smoke/Steam from Coffee**       | Animated steam rising from coffee mug. particle system. | Easy       | ❌ Atmosphere               |

---

## 4. CV Content Mapping

> How each CV section maps to a physical object in the scene. This replaces the current "floating glowing spheres" with objects that users naturally want to interact with.

| CV Section         | Object                          | Interaction                                                                                          |
| ------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Projects**       | Main Monitor Screen             | Screen shows project carousel. Click arrows to browse projects. Click project for full detail panel. |
| **Skills**         | Vertical Side Monitor           | Shows skill categories in a terminal/IDE style layout. Click a category for details.                 |
| **Experience**     | Notebook / Notepad              | Open notebook with timeline entries. Click to expand experience details.                             |
| **About / Bio**    | Figurine + Photo Frame          | Click the figurine or photo frame to learn about the person behind the setup.                        |
| **Education**      | Bookshelf Books                 | Books on shelf with degree titles on spines. Click a book to see education details.                  |
| **Certifications** | Wall Poster / Certificate Frame | Framed certificates on the wall. Click to see cert details.                                          |
| **Contact**        | Tablet / Phone on desk          | Shows social links, email, phone. Click for contact info.                                            |
| **Goals**          | Whiteboard / Cork Board         | Pinned goals, aspirations, career plans.                                                             |
| **Resume**         | Filing Cabinet Drawer           | Click drawer → triggers resume download.                                                             |

---

## 5. Available Free 3D Assets

> Researched Sketchfab (CC-BY/CC0) and Poly.pizza (CC0) for ready-to-use assets.

### Complete Room Scenes (Sketchfab — CC Attribution)

| Model                   | Author        | Link                                                                                                                           | Notes                                                                                                                                                          |
| ----------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Small Office**        | dylanheyes    | [Sketchfab](https://sketchfab.com/3d-models/small-office-393a8fec31bf41a99a49a57bbcf02ac8)                                     | 101K tris, baked textures, cozy aesthetic, CC-BY. Includes desk, chair, monitor, shelves, plants, light. **Best complete room candidate.**                     |
| **Modern Gaming Setup** | Poly Paradise | [Sketchfab](https://sketchfab.com/3d-models/modern-gaming-setup-ultimate-desk-pc-accessories-1f7156d967ee4d259106e350d184c795) | Dual monitors, gaming chair, keyboard, mouse, headphones, RGB, CC-BY. **Best desk setup only.** Note: a user reported GLTF issues in browser — test carefully. |

### Individual Props (Poly.pizza — CC0, free for any use)

| Prop                 | Author             | Link                                           |
| -------------------- | ------------------ | ---------------------------------------------- |
| Light Desk           | Quaternius         | [poly.pizza](https://poly.pizza/m/uJDWrSJGVH)  |
| Desk (simple)        | Quaternius         | [poly.pizza](https://poly.pizza/m/V86Go2rlnq)  |
| Computer             | Poly by Google     | [poly.pizza](https://poly.pizza/m/2EHvZLax4Y3) |
| Office Chair         | CMHT Oculus        | [poly.pizza](https://poly.pizza/m/dCEsSsJJ1Md) |
| Desktop Computer     | Poly by Google     | [poly.pizza](https://poly.pizza/m/4Q4sEDTCk9X) |
| Monitor              | Poly by Google     | [poly.pizza](https://poly.pizza/m/5qZ5IaClHHw) |
| Dual Monitors on arm | involuntary tsetse | [poly.pizza](https://poly.pizza/m/c9fdvmLhrsT) |
| Notebook             | Zsky               | [poly.pizza](https://poly.pizza/m/UeJDUbgwAU)  |
| Desk Lamp            | Zsky               | [poly.pizza](https://poly.pizza/m/QPSkIimiV6)  |
| Painting Canvas      | Zsky               | [poly.pizza](https://poly.pizza/m/7bj0IgoTsr)  |
| Message Board        | Poly by Google     | [poly.pizza](https://poly.pizza/m/fDpegPgEB0j) |
| L Shaped Desk        | Zsky               | [poly.pizza](https://poly.pizza/m/BfrWTbXWBl)  |
| Computer Desk        | Zsky               | [poly.pizza](https://poly.pizza/m/OhXey2fljr)  |
| Desk Corner          | Kenney             | [poly.pizza](https://poly.pizza/m/LCfBX1FVJr)  |
| Desk Chair           | Kenney             | [poly.pizza](https://poly.pizza/m/CKSz6PB1vO)  |
| Standing Desk        | Zsky               | [poly.pizza](https://poly.pizza/m/dE6BqyF4Ws)  |

### Important: Ready-Pack Lessons Learned (ADR-009)

In Session 024, we tried importing a complete Sketchfab gallery scene and it **FAILED** due to:

- Physics collider misalignment with imported geometry
- Style mismatch with procedural aesthetic
- Scale/coordinate chaos
- Fragile manual collider placement

**Strategy for Mode B:** Mode B does NOT use physics/colliders (it's OrbitControls, not a character controller), so this is much safer. However:

- **Prefer procedural geometry** for items we need to interact with (monitors, notebook, etc.)
- **Use GLTF models as decoration** only where we don't need precise click targets
- **Test any downloaded model** in isolation first before integrating
- **Consider the "Small Office" Sketchfab model as a base**, then replace individual objects with interactive procedural versions

---

## 6. Implementation Tiers

> Suggested groupings for step-by-step implementation. The user will choose which tier to do next.

### Sprint 1: "The Foundation" (Transforms the empty room)

**Estimated difficulty: Medium | Estimated time: 1-2 sessions**

- [ ] Wider desk with walnut wood material + dark metal legs
- [ ] Ultrawide main monitor with glowing screen (emissive plane)
- [ ] Wall color/material upgrade (dark navy + subtle texture)
- [ ] Floor upgrade (dark wood planks + area rug)
- [ ] Warm desk lamp with point light
- [ ] Basic mechanical keyboard flat on desk
- [ ] Mouse + large mousepad/deskmat

### Sprint 2: "The Setup" (Makes it a real workspace)

**Estimated difficulty: Medium | Estimated time: 1-2 sessions**

- [ ] Gaming/office chair (procedural or GLTF)
- [ ] Second vertical monitor (on an arm)
- [ ] Headphones on a headphone stand
- [ ] Coffee mug (with steam particles later)
- [ ] Small desktop speakers (2x flanking monitors)
- [ ] LED strip behind desk (accent lighting)
- [ ] Monitor light bar (BenQ ScreenBar style)

### Sprint 3: "The Window & Atmosphere" (Creates mood)

**Estimated difficulty: Hard | Estimated time: 1-2 sessions**

- [ ] Large window frame on back wall
- [ ] Night sky / cityscape behind window (textured plane or shader)
- [ ] Rain droplets on window glass (animated shader)
- [ ] Moonlight / street light coming through window
- [ ] Floating dust particles in lamp beam
- [ ] Ceiling pendant lamp

### Sprint 4: "Personalization & Nature" (Makes it alive)

**Estimated difficulty: Easy-Medium | Estimated time: 1 session**

- [ ] Large floor plant (Monstera or fiddle-leaf fig)
- [ ] Small desk succulent / pothos
- [ ] Photo frame on desk
- [ ] Figurine / collectible on desk
- [ ] Wall art / posters (framed)
- [ ] Bookshelf or floating shelves with books

### Sprint 5: "Interactive CV Integration" (Links data to objects)

**Estimated difficulty: Hard | Estimated time: 2-3 sessions**

- [ ] Main monitor: Project carousel (cycle with arrows, show project data)
- [ ] Vertical monitor: Skills terminal/IDE display
- [ ] Notebook: Experience timeline (opened notebook pages)
- [ ] Bookshelf: Education (book spines with degree names)
- [ ] Wall certificates: Certifications
- [ ] Whiteboard: Goals / career aspirations
- [ ] Tablet: Contact info / social links
- [ ] Remove all floating spheres (replaced by physical objects)

### Sprint 6: "Polish & Magic" (Easter eggs & delight)

**Estimated difficulty: Easy-Medium | Estimated time: 1 session**

- [ ] Cat sleeping on desk corner (animated breathing)
- [ ] Steam from coffee mug (particle system)
- [ ] Cables between devices (subtle)
- [ ] PC tower under desk with internal glow
- [ ] Sticky notes on monitor bezel
- [ ] Wall clock
- [ ] Vinyl player or small speaker with "playing" indicator

---

## 7. Technical Constraints & Lessons Learned

### From the Ready-Pack Failure (ADR-009)

1. **Mode B is safer than Mode C for GLTF imports** — no physics colliders needed, just click raycasting
2. **Always test downloaded models in isolation** before integrating into the scene
3. **Prefer procedural geometry for interactive objects** — ensures perfect click targets and easy animation
4. **Use GLTF only for decoration** (chair, plants, headphones) where interaction is click-to-highlight at most

### Performance Budget

| Metric                | Target                |
| --------------------- | --------------------- |
| Total scene triangles | < 500K                |
| Texture memory        | < 50MB                |
| Draw calls            | < 100                 |
| FPS (desktop)         | > 60                  |
| FPS (mobile)          | > 30                  |
| Bundle size impact    | < 5MB total 3D assets |

### Technical Approach

1. **Procedural geometry** (Three.js primitives + custom shapes) for:
   - Desk, monitors, keyboard, mouse, lamp, window frame, walls, floor
   - Anything that needs to be interactive or have custom materials

2. **GLTF models** (Sketchfab / Poly.pizza) for:
   - Chair, plants, headphones, books, figurine, photo frame
   - Decoration that doesn't need precise interaction

3. **Shader effects** for:
   - Rain on window (fragment shader or animated texture)
   - Monitor screen glow/content
   - LED underglow / neon strips
   - Steam/particles

4. **drei helpers** for:
   - `<Text>` for labels, book spines, sticky notes
   - `<Html>` for monitor content (real DOM rendered in 3D)
   - `<Float>` for subtle floating animation on decorative elements
   - `<Sparkles>` for dust particles
   - `<useGLTF>` / `<useGLTF.preload>` for any loaded models

---

## 8. Color Palette & Material Reference

### Primary Palette

| Color                      | Hex       | Use                             |
| -------------------------- | --------- | ------------------------------- |
| **Desk (Walnut)**          | `#5C3D2E` | Warm dark wood for desk surface |
| **Desk Legs (Dark Metal)** | `#1a1a1a` | Matte black metal               |
| **Wall (Dark Navy)**       | `#1a1f2e` | Primary wall color              |
| **Accent Wall (Brick)**    | `#3d2b22` | Optional brick texture wall     |
| **Floor (Dark Oak)**       | `#2a1f17` | Dark wood planks                |
| **Rug**                    | `#2e3a4a` | Muted blue-grey rug             |
| **Monitor Bezel**          | `#0a0a0a` | Near-black plastic              |
| **Screen Glow**            | `#14b8a6` | Teal accent (brand color)       |
| **Desk Lamp (Warm)**       | `#ffb347` | Warm amber light                |
| **Moonlight (Cool)**       | `#b3d4fc` | Cool blue fill from window      |
| **LED Strip**              | `#8b5cf6` | Purple accent underglow         |
| **Keyboard Keys**          | `#222222` | Dark grey with subtle variation |
| **Plant Green**            | `#2d5a3d` | Deep green for foliage          |

### Material Types

- **Wood:** roughness 0.7, metalness 0.0, normal map for grain (procedural or texture)
- **Metal (Matte):** roughness 0.6, metalness 0.8
- **Metal (Brushed):** roughness 0.3, metalness 0.9
- **Plastic (Monitor):** roughness 0.1, metalness 0.0
- **Glass (Window):** transparent, IOR 1.5, roughness 0.05, transmission 0.9
- **Fabric (Rug):** roughness 0.95, metalness 0.0
- **Ceramic (Mug):** roughness 0.4, metalness 0.0
- **Emissive (Screens):** emissiveIntensity 0.8-1.5
- **Leather (Chair):** roughness 0.5, metalness 0.0

---

## 9. Camera & Composition

### Default "Hero" View

```
Camera position: [0, 2.5, 4.5]   (slightly above, looking at desk from front)
Camera target:   [0, 1.2, -1.5]  (center of desk area)
FOV: 45°
```

### Composition Layers (Front to Back)

```
Layer 1 (Foreground): Chair back (blurred, frames the shot)
Layer 2 (Main):       Desk surface — monitors, keyboard, mouse, lamp, mug, notebook
Layer 3 (Mid):        Wall — shelves, whiteboard, certificates, clock
Layer 4 (Background): Window — night sky, rain, cityscape
```

### Light Directions

```
Key Light:  Desk lamp (warm amber, from upper-right, casts shadows on desk)
Fill Light: Window moonlight (cool blue, from behind/above, soft)
Accent:     LED strip (purple/teal, behind desk, ambient glow)
Rim Light:  Backlight from window (silhouettes monitor/chair)
```

### Interactive Camera Zones

When the user clicks an interactive object, the camera smoothly transitions to a closer view:

| Object       | Camera Position    | Camera Target       |
| ------------ | ------------------ | ------------------- |
| Main Monitor | `[0, 1.8, 1.5]`    | `[0, 1.5, -2]`      |
| Side Monitor | `[1.5, 1.8, 1.5]`  | `[1.5, 1.5, -2]`    |
| Notebook     | `[-0.8, 1.5, 0.5]` | `[-0.8, 0.9, -1.5]` |
| Bookshelf    | `[-2.5, 2, 1]`     | `[-3, 1.8, -2]`     |
| Whiteboard   | `[2, 2, 1]`        | `[2.5, 2, -3]`      |
| Figurine     | `[0.8, 1.2, 0.5]`  | `[0.8, 0.9, -1.8]`  |
| Wall Certs   | `[0, 2.5, 0.5]`    | `[0, 2.5, -3.5]`    |

---

## 10. Reference Inspirations

### Aesthetic Categories That Informed This Design

1. **"Lo-fi Study Beats" Thumbnail Aesthetic**
   - Warm desk lamp in dark room
   - Window showing rain or night sky
   - Plants, cat, coffee
   - Cozy and focused atmosphere

2. **r/battlestations Top Posts**
   - Ultrawide monitors, clean cable management
   - LED accent lighting (back-of-desk strip)
   - Minimal but warm — not RGB overload
   - Plants (especially monstera)
   - Headphone stand as decorative element

3. **Dribbble "Developer Setup" UI Concepts**
   - Isometric/diorama view of desk setups
   - Warm/cool light contrast
   - Night-time scenes with glowing screens
   - Detailed but organized accessories

4. **Three.js Portfolio Sites**
   - Bruno Simon (car driving through room)
   - Dennis Snellenberg (3D objects linked to projects)
   - Atmos (atmospheric 3D landing page)
   - Key insight: the scene should tell a story, not just display objects

5. **Cyberpunk / Neo-Tokyo Desk Setups**
   - Neon accent colors
   - Dark room with glowing screens
   - High contrast — deep shadows + bright accents
   - We'll take the mood but keep it warmer than full cyberpunk

### Top Sketchfab Inspirations

- **"Small Office" by dylanheyes** — 22K views, 557 likes, CC-BY. Cozy aesthetic, baked lighting, computer + shelves + plant + chair. [Link](https://sketchfab.com/3d-models/small-office-393a8fec31bf41a99a49a57bbcf02ac8)
- **"Modern Gaming Setup" by Poly Paradise** — 7.5K views, 220 likes, CC-BY. Dual monitors, gaming chair, keyboard, mouse, headphones, RGB. [Link](https://sketchfab.com/3d-models/modern-gaming-setup-ultimate-desk-pc-accessories-1f7156d967ee4d259106e350d184c795)

---

## Implementation Notes

### For Each Sprint, the Workflow Is:

1. **Search for a ready-made GLTF model** (Sketchfab/Poly.pizza) for the element
2. **Test it in isolation** — load with `useGLTF`, check scale/position/materials
3. **If the model works well** → integrate it into the scene with proper positioning
4. **If the model doesn't work** (wrong style, broken materials, too heavy) → **build it procedurally** with Three.js primitives + custom materials
5. **For interactive objects** → always procedural, with click handlers and camera transitions
6. **Update ModeBRoot.tsx** to include the new component
7. **Test the full scene** — FPS, visual quality, interaction

### File Structure for New Components

```
src/modes/mode-b/components/
├── Room.tsx              → Room shell (walls, floor, ceiling, window)
├── DeskSetup.tsx         → Desk + all desktop items (monitor, keyboard, etc.)
├── Chair.tsx             → Office/gaming chair
├── WindowScene.tsx       → Window frame + night sky + rain
├── Bookshelf.tsx         → Shelves with books
├── Plants.tsx            → All plant elements
├── Decorations.tsx       → Photo frame, figurine, clock, etc.
├── Lighting.tsx          → Updated desk lamp + ambient + accent
├── InteractiveMonitor.tsx → Main monitor with project carousel
├── InteractiveNotebook.tsx → Notebook with experience data
└── InteractiveObject.tsx  → (existing) — may be refactored or removed
```

---

_This document serves as the master design reference for all Mode B aesthetic improvements. Each implementation session should reference the relevant sprint and element numbers._
