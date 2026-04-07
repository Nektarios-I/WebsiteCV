'use client';

/**
 * GalleryLoader — Loading screen for Mode C
 *
 * Uses drei's useProgress hook to track asset loading.
 * Fades out once all assets are loaded.
 */

import { useProgress } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useReducedMotion } from '@/hooks';

export function GalleryLoader() {
  const { progress, active } = useProgress();
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active && progress >= 100) {
      const timeout = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [active, progress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black"
          aria-live="polite"
          aria-label={`Loading gallery: ${Math.round(progress)}%`}
        >
          <div className="flex flex-col items-center gap-6">
            {/* Gallery icon */}
            <motion.div
              className="text-4xl"
              animate={reducedMotion ? {} : { scale: [1, 1.1, 1] }}
              transition={
                reducedMotion
                  ? {}
                  : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              🎨
            </motion.div>

            {/* Progress bar */}
            <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-white/80"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <p className="text-sm text-white/50">Preparing the gallery…</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
