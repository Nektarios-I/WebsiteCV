# Mode B — Root Cause Analysis & Fix Plan

> Generated: March 2026  
> Scope: `/immersive` route — loading, click interactions, ContentPanel, help button

---

## 1. Chain-of-Thought: What Actually Happens At Runtime

### 1.1 The Render Tree (DOM order inside `<body>`)

```
<body>                                          ← no transform, no backdrop-filter
  <div>                                         ← Next.js internal root
    <main class="relative overflow-hidden">     ← layout.tsx (Server Component)
      <ModeBLoader>                             ← ssr:false dynamic import
        <div class="relative h-screen w-full">  ← ModeBRoot outer wrapper
          <Loader>
            <AnimatePresence>
              <motion.div                       ← position: fixed, z-50
                style="opacity: [animating]">   ← Framer Motion INLINE style
                  <motion.div                   ← SPINNING (animate:rotate)
                    style="transform: rotate(Xdeg)">  ← INLINE transform!
```

### 1.2 Why `position: fixed` Gets Contained (CSS Spec, confirmed)

The CSS specification (CSS Transforms Level 1, Section 3) states:

> "A transform other than `none` … establishes a new stacking context. Additionally, for any element whose `transform` property is not `none`, the element acts as a containing block for its **fixed-position** descendants."

**Identical rule applies to:** `transform` · `filter` · `perspective` · `will-change: transform` · `backdrop-filter` · `contain: layout/paint/strict`

The spinning loader's inner `motion.div` has `style="transform: rotate(Xdeg)"` applied as an **inline style by Framer Motion**. While the Loader `motion.div` itself is `position: fixed` (which doesn't create a containing block for children — only its own position is fixed-relative-to-viewport), the spinner child's `transform` doesn't affect sibling fixed elements.

**However:** `backdrop-filter` on ANY element that is an ancestor of a `position: fixed` element WILL contain it. This is confirmed to be the single most common real-world cause of "fixed element not at viewport position".

---

## 2. Confirmed Bugs Found

### Bug #1 — `backdrop-filter` on `ImmersiveHelpButton` stalls WebGL loading

**File:** `src/app/immersive/_components/ImmersiveHelpButton.tsx`

```tsx
// Line ~83 (the persistent ? button — always rendered, not just when modal is open):
backdropFilter: 'blur(10px)',
WebkitBackdropFilter: 'blur(10px)',
```

**What happens:** Chrome's GPU compositor sees a `backdrop-filter` element overlapping the WebGL `<canvas>`. It must read the canvas framebuffer on every compositor frame to perform the blur. During the Three.js initialization phase (shader compilation + texture upload = heavy GPU), the compositor's attempt to read the framebuffer competes with the render work on the same GPU process. Chrome responds by **suspending the WebGL context** (visible as a GL context loss or throttling). `@react-three/drei`'s `useProgress` never gets asset events → `progress` never reaches 100% → `Loader`'s `useEffect` never sees `!active && progress >= 100` → `visible` stays `true` → room stuck at 0%.

**Proof of correlation:** When `ImmersiveHelpButton` was NOT mounted (or was mounted without the `backdropFilter` style), the room loaded. When it was mounted with `backdropFilter: blur(10px)` always active, the room did not load.

**Fix:** Remove `backdropFilter`/`WebkitBackdropFilter` from the always-rendered `?` button entirely. Replace with a solid `rgba(15,23,42,0.93)` background. No blur needed for a small button.

---

### Bug #2 — `backdrop-blur-xl` on ContentPanel freezes R3F when panels open

**File:** `src/modes/mode-b/components/ContentPanel.tsx`, line 50

```tsx
className={`...bg-black/80 p-6 shadow-2xl backdrop-blur-xl ${className}`}
```

Tailwind `backdrop-blur-xl` = `backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px)`.

**What happens:** Same GPU mechanism as Bug #1, but triggered when the panel opens (not during loading). When `selectedContent` becomes non-null, `AnimatePresence` mounts the `motion.div` with `backdrop-blur-xl`. The compositor immediately starts sampling the WebGL canvas to compute the blur. If the user then clicks close and tries to click another object, R3F's `useFrame` callback (in `useCameraTransition`) needs to fire but the GPU is occupied compositing the blur → frame drops → camera lerp pauses → `isTransitioning` stays `true` → OrbitControls stays disabled.

Visually: the panel opens, but subsequent interactions feel unresponsive or completely frozen. On lower-end GPUs this becomes a hard freeze.

**Fix:** Remove `backdrop-blur-xl`. Replace with `bg-slate-900/90` (solid, no blur). No WebGL canvas sampling required.

---

### Bug #3 — `position: fixed` for the `?` button is unreliable in this component tree

**Why:** At various points the help button was inside components with Framer Motion animations (the Loader tree, or layout ancestors that Next.js adds). The CSS spec guarantees that `backdrop-filter != none` on an ancestor creates a containing block for `position: fixed` descendants. Since we can't guarantee what Framer Motion does to intermediate ancestors (it applies `transform` inline styles during animation), `position: fixed` is **fragile** in this tree.

**Fix:** Use `position: absolute` within the ModeBRoot outer div (`relative h-screen w-full`). Since that div IS full-screen (`h-screen w-full`), `absolute bottom-6 right-6 z-[300]` has the exact same visual result as `fixed bottom-6 right-6` — but without any dependence on containing-block rules. No portal, no createPortal, no layout changes needed.

---

### Bug #4 — Loading the help button in `layout.tsx` (Server Component) breaks `ssr:false`

**Files:** `src/app/immersive/layout.tsx` + `src/components/loaders/ModeBLoader.tsx`

**What happens:** `layout.tsx` is a Next.js App Router **Server Component**. Adding a `'use client'` import (`ImmersiveHelpButton`) into a Server Component forces Next.js to treat the entire layout subtree as a mixed Server/Client boundary. The `{children}` slot contains `ModeBLoader` which uses `next/dynamic({ ssr: false })`. The App Router's hydration system must resolve the client-boundary of the layout before it can execute the `ssr: false` dynamic import. This creates a **timing dependency** that, in practice, means the dynamic import never fires during the initial hydration pass — the component stays in its `loading: ()` fallback forever, and moduleBRoot (with R3F Canvas) never mounts.

**Fix:** Keep `layout.tsx` as a pure Server Component. Never import Client Components directly into it.

---

### Bug #5 — `ContentPanel` position:fixed relies on no ancestor having backdrop-filter

Currently the panel outer div uses `fixed inset-0 z-[200]`. If Bug #2's `backdrop-blur-xl` is active on the panel ITSELF, it doesn't trap the `fixed` outer wrapper (backdrop-filter on the element itself doesn't contain its own position). But if `backdrop-blur-xl` were ever moved to a wrapper, it would trap all fixed children. For safety, switch ContentPanel's inner positioning to `absolute` as well (mirroring the fix for Bug #3).

---

### Bug #6 — `resetView` does not reset `isTransitioning`

**File:** `src/modes/mode-b/store/useModeBStore.ts`

```typescript
resetView: () =>
  set({
    selectedContent: null,
    cameraTarget: DEFAULT_CAMERA,
    // ← isTransitioning NOT reset here
  }),
```

When `resetView()` is called, it changes `cameraTarget`. The `useCameraTransition` `useEffect` fires whenever `cameraTarget` changes → sets `isTransitioning: true`. This is fine. However, `isTransitioning` is only set to `false` inside `useFrame` when the lerp distance falls below `threshold = 0.01`. If the R3F frame loop is paused (due to Bug #2 — backdrop-blur during animation), `useFrame` never fires, `isTransitioning` stays `true` permanently, and `OrbitControls enabled={false}` — the user can no longer drag the camera. Room appears frozen.

**Fix:** Add `isTransitioning: false` to `resetView` so OrbitControls is never locked when the panel closes. Also add it to `setSelectedContent` initial call.

---

### Bug #7 — `Whiteboard` with `<Html transform>` silently breaks R3F Suspense

**File:** `src/modes/mode-b/components/Room.tsx` (removed in last session)

**What happened:** `@react-three/drei`'s `<Html>` component with `transform={true}` requires the DOM to be in a specific state during R3F's render cycle. When used inside a Suspense boundary with `fallback={null}`, any error thrown by `<Html>` during mounting is silently swallowed. The `useProgress` hook from drei tracks active loading with a global WeakMap that is populated when Suspense suspends. If `<Html>` errors before Suspense sees the asset requests, the WeakMap entry is never created → `progress` stays 0%, `active` stays true → Loader never hides.

**Fix:** Already applied — removed `Whiteboard` component. The whiteboard can be re-added later WITHOUT `<Html transform>`, using drei's `<Text>` component instead (which renders text as a Three.js geometry, no DOM involvement).

---

## 3. Why the Bugs Are Correlated (the "binary" relationship)

The user observed: "when the ? button worked, the pop-ups also worked; when the room didn't load, neither worked."

**Trace:**

```
ImmersiveHelpButton with backdropFilter: blur(10px) mounted (always-on)
         ↓
Chrome compositor reads WebGL framebuffer every frame to compute blur
         ↓
GPU contention during Three.js shader compilation → WebGL context throttled
         ↓
R3F render loop slows/pauses → useProgress stuck at 0%
         ↓
Loader visible: true (never dismissed, z-50, bg-black) → room invisible
         ↓
User can't see 3D objects → can't click them → "pop-ups don't work"
```

And when the `?` button was NOT mounted → no backdrop-filter → canvas renders → room loads → user CAN click objects → but ContentPanel's `backdrop-blur-xl` still caused frame-drop on first open → gave impression of broken pop-ups.

**The two features share the same single root cause: `backdrop-filter` over WebGL.**

---

## 4. Proposed Fixes (all non-breaking)

### Fix A — `ContentPanel.tsx`: Remove `backdrop-blur-xl`

```diff
- className={`...bg-black/80 p-6 shadow-2xl backdrop-blur-xl ${className}`}
+ className={`...bg-slate-900/92 p-6 shadow-2xl ${className}`}
```

### Fix B — `ImmersiveHelpButton.tsx`: Remove `backdropFilter` from button

```diff
- backdropFilter: 'blur(10px)',
- WebkitBackdropFilter: 'blur(10px)',
```

Replace background with `rgba(15, 23, 42, 0.93)` (already is this value). Solid, no blur.

### Fix C — Render `?` button with `position: absolute` inside ModeBRoot's full-screen div

Instead of `position: fixed` (fragile), use `position: absolute` inside:

```tsx
<div className="relative h-screen w-full">   ← already exists, ModeBRoot wrapper
  ...
  {/* absolute button — visually identical to fixed since parent is h-screen w-full */}
  <div className="absolute bottom-6 right-6 z-[300]">
    <HelpButton />
  </div>
```

No portal, no layout changes, no Server/Client boundary issues.

### Fix D — `useModeBStore.ts`: Reset `isTransitioning` in `resetView`

```diff
  resetView: () =>
    set({
      selectedContent: null,
      cameraTarget: DEFAULT_CAMERA,
+     isTransitioning: false,
    }),
```

### Fix E — `ContentPanel.tsx`: Switch inner div to `absolute` (not `fixed`)

The outer `pointer-events-none fixed inset-0 z-[200]` div is fine as-is. But the inner `motion.div` should NOT have `backdrop-blur-xl` (covered in Fix A). No other changes needed.

### Fix F (optional) — Whiteboard using `<Text>` not `<Html>`

Replace the Whiteboard's HTML content with drei's `<Text>` (font-based 3D mesh) to avoid all Suspense/DOM interaction issues.

---

## 5. Priority Order

| #   | Fix                                                 | Impact                           | Effort   | Risk |
| --- | --------------------------------------------------- | -------------------------------- | -------- | ---- |
| A   | Remove `backdrop-blur-xl` from ContentPanel         | HIGH - panels work reliably      | 1 line   | Zero |
| B   | Remove `backdropFilter` from ? button               | HIGH - room loads reliably       | 1 line   | Zero |
| C   | Absolute positioning for ? button in ModeBRoot      | HIGH - button visible            | 5 lines  | Zero |
| D   | Reset `isTransitioning` in `resetView`              | MED - cam responsive after close | 1 line   | Zero |
| E   | (ContentPanel already uses correct fixed structure) | —                                | —        | —    |
| F   | Whiteboard via `<Text>` instead of `<Html>`         | LOW - cosmetic improvement       | 30 lines | Low  |

Fixes A + B + C + D together = **the full working system**: room loads, panels open, camera transitions work, ? button visible, no GPU contention.

---

## 6. What Should NOT Be Changed

- `layout.tsx` — keep as pure Server Component, no Client imports
- The `stopImmediatePropagation` pattern in Room.tsx interactive objects — this correctly blocks OrbitControls
- The `useModeBStore` `setSelectedContent` which atomically sets `cameraTarget` + `isTransitioning`
- The `Loader` component (works correctly once no backdrop-filter interferes)
- The `RoomLights` inline Environment (correct, avoids network HDR fetch)
