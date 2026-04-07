# 🤝 Contributing Guide — WebsiteCV

> **Last Updated:** 2026-03-01

This document covers everything a developer needs to start working on the project: environment setup, coding conventions, architectural rules, and workflow expectations.

---

## Prerequisites

| Tool        | Version | Purpose                                |
| ----------- | ------- | -------------------------------------- |
| **Node.js** | 20+ LTS | Runtime                                |
| **pnpm**    | 9+      | Package manager (fast, disk-efficient) |
| **Git**     | 2.40+   | Version control                        |
| **VS Code** | Latest  | Recommended editor                     |
| **Blender** | 4.0+    | 3D model authoring (Mode B/C only)     |

### Recommended VS Code Extensions

- `dbaeumer.vscode-eslint` — ESLint integration
- `esbenp.prettier-vscode` — Prettier formatting
- `bradlc.vscode-tailwindcss` — Tailwind IntelliSense
- `dsznajder.es7-react-js-snippets` — React snippets
- `pmneo.tsimporter` — TypeScript auto-imports
- `usernamehw.errorlens` — Inline error display

---

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd WebsiteCV

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
# http://localhost:3000
```

---

## Available Scripts

| Script        | Command            | Purpose                                |
| ------------- | ------------------ | -------------------------------------- |
| `dev`         | `pnpm dev`         | Start Next.js dev server (hot reload)  |
| `build`       | `pnpm build`       | Production build                       |
| `start`       | `pnpm start`       | Serve production build locally         |
| `lint`        | `pnpm lint`        | Run ESLint                             |
| `format`      | `pnpm format`      | Run Prettier                           |
| `type-check`  | `pnpm type-check`  | Run TypeScript compiler (no emit)      |
| `test`        | `pnpm test`        | Run Vitest in watch mode (83 tests)    |
| `test:run`    | `pnpm test:run`    | Run Vitest once (CI)                   |
| `test:e2e`    | `pnpm test:e2e`    | Run Playwright E2E tests               |
| `analyze`     | `pnpm analyze`     | Analyze bundle sizes                   |
| `sync-config` | `pnpm sync-config` | Sync site.config.ts → src/data/\*.json |

---

## Coding Conventions

### TypeScript

- **Strict mode** is enabled. No `any` types unless explicitly justified with `// eslint-disable-next-line` + comment.
- Use `interface` for object shapes, `type` for unions/intersections.
- Export types from `/src/types/` for shared interfaces.
- Use `satisfies` operator for data validation:
  ```typescript
  const cv = { ... } satisfies CVData;
  ```

### React Components

- **Functional components only** (no class components).
- Use **named exports** (not default exports) for all components:

  ```typescript
  // ✅ Good
  export function ProjectCard({ project }: Props) { ... }

  // ❌ Bad
  export default function ProjectCard({ project }: Props) { ... }
  ```

- Co-locate component-specific types in the same file.
- Use `React.FC` sparingly — prefer explicit return types or let TS infer.

### File Naming

| Type             | Convention                         | Example                         |
| ---------------- | ---------------------------------- | ------------------------------- |
| Components       | PascalCase                         | `ProjectCard.tsx`               |
| Hooks            | camelCase with `use` prefix        | `useMode.ts`                    |
| Utilities        | camelCase                          | `formatDate.ts`                 |
| Types/Interfaces | camelCase                          | `cv.ts`                         |
| Constants        | camelCase (UPPER_SNAKE for values) | `constants.ts` → `MAX_PROJECTS` |
| Data files       | kebab-case                         | `cv.json`, `projects.json`      |
| MDX content      | kebab-case                         | `my-project.mdx`                |

### Styling (Tailwind)

- Use Tailwind utility classes directly in JSX.
- For complex conditional classes, use `clsx` + `tailwind-merge`:

  ```typescript
  import { twMerge } from 'tailwind-merge';
  import clsx from 'clsx';

  const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
  ```

- Define design tokens in `tailwind.config.ts`, not as raw values.
- No inline `style={}` unless absolutely necessary (e.g., dynamic 3D positioning).

### Imports

Order (enforced by ESLint):

1. React / Next.js
2. Third-party libraries
3. Internal aliases (`@/components/...`, `@/data/...`)
4. Relative imports (avoid when possible — use `@/` alias)

```typescript
// ✅ Good
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useMode } from '@/hooks/useMode';
```

---

## Architectural Rules (Non-Negotiable)

### 1. Mode Isolation

Modes must **never** import from each other:

```
✅ mode-a/ → @/components/ui/Button     (shared primitive)
✅ mode-a/ → @/data/cv.json              (shared data)
✅ mode-b/ → @/hooks/useMode             (shared hook)

❌ mode-a/ → mode-b/components/Scene     (FORBIDDEN)
❌ mode-b/ → mode-a/components/Timeline  (FORBIDDEN)
```

If two modes need the same component, move it to `/src/components/`.

### 2. 3D Libraries Stay in Mode B and Mode C

Three.js, R3F, Drei, Rapier — these must only be imported inside `src/modes/mode-b/`, `src/modes/mode-c/`, and their corresponding `src/app/` route groups. If any of these appear in Mode A's bundle, it's a bug.

**Mode C additionally uses:** `ecctrl`, `@react-three/postprocessing`, `SkeletonUtils` from Three.js.

### 3. Data Layer is Mode-Agnostic

Data files (`/src/data/`) and types (`/src/types/`) must not reference any mode-specific concepts. They represent the content, not the presentation.

### 4. New Mode Checklist

To add a new mode (Mode C "Gallery" was added this way in Session 008):

1. Create `src/modes/mode-x/` with components
2. Create `src/modes/mode-x/index.ts` exporting a `ModeConfig`
3. Add import to `src/modes/registry.ts`
4. Create `src/app/(mode-x)/layout.tsx` and `page.tsx`
5. Update `docs/Structure.md`
6. **That's it.** Hub auto-discovers the mode from the registry.

---

## Git Workflow

### Branch Naming

```
feature/hub-hero-section
feature/mode-a-experience-timeline
feature/mode-b-room-scene
fix/mode-selector-mobile-overflow
docs/update-structure-md
chore/upgrade-next-15
```

### Commit Messages (Conventional Commits)

```
feat(hub): add hero section with profile picture
feat(mode-a): implement experience timeline component
feat(mode-b): add room model with DRACO loading
fix(hub): resolve mode selector overflow on mobile
docs: update Structure.md with new components
chore: upgrade Next.js to 15.1
refactor(mode-a): extract timeline item into separate component
perf(mode-b): compress room model with DRACO
```

### PR Checklist

Before submitting a PR:

- [ ] TypeScript compiles with no errors (`pnpm type-check`)
- [ ] ESLint passes (`pnpm lint`)
- [ ] Prettier formatted (`pnpm format`)
- [ ] No Mode A ↔ Mode B cross-imports
- [ ] Documentation updated (Structure.md, Roadmap.md)
- [ ] Tested on mobile viewport
- [ ] Bundle size impact noted in PR description

---

## Documentation Update Protocol

When you modify code, update the relevant docs:

| Change Type                | Update                      |
| -------------------------- | --------------------------- |
| New component              | Add to `Structure.md`       |
| New library                | Add to `Tech_Stack.md`      |
| Architecture change        | New entry in `Decisions.md` |
| Feature complete / bug fix | Update `Roadmap.md`         |
| New convention             | Update this file            |
