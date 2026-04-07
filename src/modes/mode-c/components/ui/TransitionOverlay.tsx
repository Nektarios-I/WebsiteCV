'use client';

/**
 * TransitionOverlay — Fade overlay for room transitions
 *
 * Renders a full-screen white overlay that fades in/out when the player
 * walks through a doorway or teleports via the map.
 * Respects prefers-reduced-motion — instant transition (no animation).
 */

import { AnimatePresence, motion } from 'framer-motion';

import { useReducedMotion } from '@/hooks';

import { useGalleryStore } from '../../stores/useGalleryStore';

export function TransitionOverlay() {
  const isTransitioning = useGalleryStore((s) => s.isTransitioning);
  const reducedMotion = useReducedMotion();

  const duration = reducedMotion ? 0 : 0.4;

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration, ease: 'easeInOut' }}
          className="pointer-events-none fixed inset-0 z-40 bg-white"
        />
      )}
    </AnimatePresence>
  );
}
