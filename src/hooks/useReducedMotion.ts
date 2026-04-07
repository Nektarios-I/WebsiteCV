/**
 * useReducedMotion — Respects prefers-reduced-motion
 *
 * Returns true when the user has requested reduced motion.
 * Components should disable or simplify animations accordingly.
 */

'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
