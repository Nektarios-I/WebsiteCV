/**
 * useMediaQuery — SSR-safe media query hook
 *
 * Returns true when the given CSS media query matches.
 * Falls back to `false` during SSR / first render to avoid hydration mismatch.
 */

'use client';

import { useSyncExternalStore, useCallback } from 'react';

function getServerSnapshot(): boolean {
  return false;
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
