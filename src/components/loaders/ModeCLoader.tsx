/**
 * ModeCLoader — Client wrapper for dynamically importing ModeCRoot
 *
 * Separated from the page so the page can remain a Server Component
 * (required for metadata export) while this component uses ssr: false
 * (required for R3F / WebGL / Physics).
 */

'use client';

import dynamic from 'next/dynamic';

const ModeCRoot = dynamic(() => import('@/modes/mode-c/components/ModeCRoot'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <p className="animate-pulse text-white/60">Entering the gallery…</p>
      </div>
    </div>
  ),
});

export function ModeCLoader() {
  return <ModeCRoot />;
}
