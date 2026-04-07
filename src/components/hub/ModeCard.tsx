/**
 * ModeCard — Interactive card for a single experience mode
 *
 * Displays the mode icon, name, description, and metadata badges.
 * On click, navigates to that mode's route.
 *
 * Animations:
 * - Staggered scale-in entrance (via index prop)
 * - Spring-based hover scale + shadow lift
 * - Preload on hover for faster transitions
 */

'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ModeConfig } from '@/modes/types';
import { cn } from '@/lib/utils';

interface ModeCardProps {
  mode: ModeConfig;
  index: number;
}

export function ModeCard({ mode, index }: ModeCardProps) {
  const Icon = mode.icon;

  const handleMouseEnter = useCallback(() => {
    if (mode.preloadHint === 'hover') {
      // Trigger dynamic import prefetch — the import is cached by webpack
      mode.component();
    }
  }, [mode]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0.7 + index * 0.15,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={mode.route}
        onMouseEnter={handleMouseEnter}
        className={cn(
          'group relative flex h-full flex-col items-center rounded-2xl border p-8 text-center transition-all duration-300',
          'border-border bg-surface hover:border-accent/40 hover:shadow-accent/5 hover:shadow-xl',
          'dark:hover:shadow-accent/10',
        )}
      >
        {/* Icon */}
        <div className="group-hover:bg-accent/10 dark:group-hover:bg-accent/10 mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100 transition-colors dark:bg-neutral-900">
          <Icon className="group-hover:text-accent dark:group-hover:text-accent h-8 w-8 text-neutral-700 transition-colors dark:text-neutral-300" />
        </div>

        {/* Name */}
        <h3 className="text-xl font-semibold">{mode.name}</h3>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {mode.description}
        </p>

        {/* Metadata badges */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {mode.metadata.requiresWebGL && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
              WebGL
            </span>
          )}
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            ~{mode.metadata.estimatedLoadSize}
          </span>
        </div>

        {/* Enter CTA */}
        <span className="text-accent mt-5 inline-flex items-center gap-1.5 text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Enter
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </span>
      </Link>
    </motion.div>
  );
}
