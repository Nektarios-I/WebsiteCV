/**
 * Mode A Layout — Minimalist Experience
 *
 * This route group layout wraps all pages under /minimalist.
 * It provides a clean, full-width canvas with proper dark/light theming.
 * The actual sidebar + content layout is handled by ModeARoot (client component)
 * to enable state-based scroll tracking.
 */

import type { ReactNode } from 'react';

export default function ModeALayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-screen">{children}</div>
  );
}
