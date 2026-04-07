/**
 * Mode B Layout — Immersive 3D Experience
 *
 * This layout wraps all pages under /immersive.
 * Uses a full-screen layout with no padding — the 3D scene occupies the viewport.
 * An overlay HUD/UI can float on top of the canvas.
 */

import type { ReactNode } from 'react';

export default function ModeBLayout({ children }: { children: ReactNode }) {
  return (
    <main
      id="main-content"
      className="relative h-screen w-full overflow-hidden bg-black text-white"
    >
      {children}
    </main>
  );
}
