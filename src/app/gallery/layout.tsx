/**
 * Mode C Layout — Gallery 3D Museum Experience
 *
 * Full-screen layout for the gallery. The 3D Canvas occupies the entire viewport
 * with DOM overlays (HUD, map, content panels) floating on top.
 */

import type { ReactNode } from 'react';

export default function ModeCLayout({ children }: { children: ReactNode }) {
  return (
    <main
      id="main-content"
      className="relative h-screen w-full overflow-hidden bg-black text-white"
    >
      {children}
    </main>
  );
}
