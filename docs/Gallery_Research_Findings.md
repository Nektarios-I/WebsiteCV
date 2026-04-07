# Gallery Mode — Research Findings (Session 012)

> Research into free tools, libraries, assets, and techniques for improving Mode C.

---

## 1. Gallery Aesthetic (White/Beige Colors)

### Problem

All walls and floors are dark (#1a1a2e, #2a2a3e, #2e2e42) making it hard to see.

### Solution — No External Library Needed

Pure color/material changes in existing code. Change all room surfaces to light gallery tones (white, cream, beige).

### Helpful Tools Already Available

| Tool                                | Source                        | Use Case                                                |
| ----------------------------------- | ----------------------------- | ------------------------------------------------------- |
| `<Environment preset="studio">`     | @react-three/drei (installed) | Soft HDR environment lighting for realistic reflections |
| `<ContactShadows>`                  | @react-three/drei (installed) | Soft floor shadows without expensive shadow maps        |
| `ambientLight` + `directionalLight` | three.js (installed)          | Boost base illumination                                 |

### Environment Presets Available in drei

- `studio` — Soft studio lighting (ideal for gallery)
- `lobby` — Indoor lighting
- `apartment` — Warm interior
- `warehouse` — Large open space

---

## 2. Character Model

### Problem

Current procedural stickman has skin-tone head, gendered features, and isn't visually appealing.

### Options Researched

| Option                    | License              | Format   | Pros                                          | Cons                                              |
| ------------------------- | -------------------- | -------- | --------------------------------------------- | ------------------------------------------------- |
| **Mixamo Y-Bot/X-Bot**    | Free (Adobe account) | FBX→GLTF | Abstract genderless robot, 1000+ animations   | Requires manual download, account, FBX conversion |
| **KayKit Adventurers**    | CC0                  | GLTF     | Cartoony, animated, free                      | Themed characters (not abstract), need download   |
| **Quaternius CC0 Packs**  | CC0                  | GLTF/FBX | Free, variety of styles                       | Most are themed (medieval, sci-fi), not abstract  |
| **Sketchfab Free Models** | Various CC           | GLTF     | Huge variety                                  | Quality varies, often no walk animations          |
| **Improved Procedural**   | N/A                  | Code     | No downloads, tiny bundle, fully customizable | Need to code it ourselves                         |

### Chosen Approach: Enhanced Procedural Character

Redesign `StickmanCharacter.tsx` to be a smooth, abstract, **genderless "bean person"**:

- **Large capsule/sphere head** — marshmallow-like, no hair
- **Simple dot eyes** and curved smile — friendly and goofy
- **Rounded capsule torso** — no gendered features
- **Smooth cylinder limbs** — simple and cartoony
- **Small round feet** — no realistic shoes
- **Single neutral color palette** — white/light gray body, colored accents
- **Better walk animation** — more exaggerated, bouncy, cartoony

Think: "Human: Fall Flat" meets "Among Us" character style.

**Rationale**: No external file dependencies, zero bundle impact, fully customizable, no licensing concerns. The character fits the abstract art gallery theme perfectly.

---

## 3. Movement Physics

### Problem

Character feels "floaty" — doesn't simulate real walking.

### Root Cause

ecctrl floating capsule spring/damping values are too loose:

- `springK: 0.8` (default: 1.2) — too bouncy
- `dampingC: 0.05` (default: 0.08) — not enough damping
- `dragDampingC: 0.08` (default: 0.15) — too much sliding
- `floatHeight: 0.3` — too high off ground

### Solution — ecctrl Props Tuning (No External Library)

| Prop                  | Old       | New  | Effect                        |
| --------------------- | --------- | ---- | ----------------------------- |
| `springK`             | 0.8       | 1.2  | More planted on ground        |
| `dampingC`            | 0.05      | 0.08 | Less vertical oscillation     |
| `dragDampingC`        | 0.08      | 0.15 | Less ice-skating motion       |
| `floatHeight`         | 0.3       | 0.1  | Closer to floor               |
| `maxVelLimit`         | 3         | 2.5  | Slightly slower = less floaty |
| `jumpVel`             | 3.5       | 3    | Lower jumps                   |
| `fallingGravityScale` | (missing) | 2.5  | Falls faster after jump       |
| `accDeltaTime`        | (missing) | 8    | Responsive acceleration       |
| `turnSpeed`           | 8         | 15   | Snappier turning              |

---

## 4. Camera Follow

### Problem

Camera requires manual mouse adjustment, doesn't follow well.

### Solution — ecctrl `FixedCamera` Mode

ecctrl has a built-in `FixedCamera` mode that **automatically rotates the camera behind the character** as they turn. This eliminates the need for manual mouse adjustment.

| Prop              | Old             | New               | Effect                           |
| ----------------- | --------------- | ----------------- | -------------------------------- |
| `mode`            | `null`          | `"FixedCamera"`   | Auto-follows character rotation  |
| `camInitDis`      | -6              | -10               | More distant (panoramic)         |
| `camMaxDis`       | -10             | -14               | Wider zoom-out option            |
| `camMinDis`       | -3              | -6                | Minimum still panoramic          |
| `camInitDir`      | `{x:-0.3, y:0}` | `{x:-0.35, y:0}`  | Slightly higher angle            |
| `camFollowMult`   | (default 11)    | 15                | Smoother follow                  |
| `camLerpMult`     | (default 25)    | 30                | Smoother interpolation           |
| `camTargetPos`    | (default 0,0,0) | `{x:0, y:1, z:0}` | Look slightly above character    |
| `fixedCamRotMult` | (default 1)     | 1.5               | Faster camera rotation to follow |

---

## 5. Future Libraries to Install

| Library                       | Version | Purpose                              | Compatible?                       |
| ----------------------------- | ------- | ------------------------------------ | --------------------------------- |
| `@react-three/postprocessing` | ^3.0.4  | Bloom, Vignette, SSAO, Noise effects | ✅ Works with three 0.183 + R3F 9 |

**Not needed now but planned for Phase G7 (Visual Polish).**

---

## 6. Already Available (No Install Needed)

All these are from `@react-three/drei` ^10.7.7 which we already have:

| Component               | Use Case                                    |
| ----------------------- | ------------------------------------------- |
| `Environment`           | HDR environment maps for realistic lighting |
| `ContactShadows`        | Soft floor shadows                          |
| `MeshReflectorMaterial` | Shiny reflective gallery floor              |
| `Float`                 | Gentle floating animation for objects       |
| `Sparkles`              | Particle effects                            |
| `useTexture`            | Loading textures                            |
| `Text3D`                | 3D text for exhibit labels                  |
| `Lightformer`           | Custom environment lighting shapes          |

---

## Summary

All 4 issues can be fixed with:

1. **Color/material changes** — code only
2. **Procedural character redesign** — code only
3. **ecctrl prop tuning** — code only
4. **ecctrl FixedCamera mode** — code only

**Zero new dependencies needed** for these fixes. The `@react-three/postprocessing` library will be installed later during Phase G7 (Visual Polish).
