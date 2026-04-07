/**
 * ModeBLoader — Client wrapper for dynamically importing ModeBRoot
 *
 * Separated from the page so the page can remain a Server Component
 * (required for metadata export) while this component uses ssr: false
 * (required for R3F / WebGL).
 */

'use client';

import dynamic from 'next/dynamic';

const ModeBRoot = dynamic(() => import('@/modes/mode-b/components/ModeBRoot'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <p className="animate-pulse text-white/60">Loading 3D experience…</p>
      </div>
    </div>
  ),
});

export function ModeBLoader() {
  return <ModeBRoot />;
}
