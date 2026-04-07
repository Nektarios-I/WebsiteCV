/**
 * Mode Plugin System — Type Definitions
 *
 * Every "experience mode" in the application must conform to this interface.
 * This is the contract that enables the anti-fragile plugin architecture:
 * adding a new mode requires only implementing ModeConfig and registering it.
 */

import type { ComponentType } from 'react';

/**
 * Configuration contract for a display mode.
 *
 * @example
 * // In src/modes/mode-a/index.ts
 * export const modeAConfig: ModeConfig = {
 *   id: 'minimalist',
 *   name: 'The Minimalist',
 *   description: 'Clean, typography-focused experience',
 *   route: '/minimalist',
 *   component: () => import('./components/ModeARoot'),
 *   ...
 * };
 */
export interface ModeConfig {
  /** Unique identifier for this mode */
  id: string;

  /** Human-readable display name */
  name: string;

  /** Short description shown in mode selector */
  description: string;

  /** Icon component for the mode selector */
  icon: ComponentType<{ className?: string }>;

  /** Route path (must match the App Router route group) */
  route: string;

  /**
   * Dynamic import function for the mode's root component.
   * This ensures the mode's code is only loaded when selected.
   */
  component: () => Promise<{ default: ComponentType }>;

  /** When to start preloading this mode's code */
  preloadHint: 'none' | 'hover' | 'viewport';

  /** Metadata for the mode selector UI */
  metadata: {
    /** Approximate bundle size (displayed to user) */
    estimatedLoadSize: string;
    /** Whether this mode requires WebGL support */
    requiresWebGL: boolean;
    /** Whether this mode respects prefers-reduced-motion */
    supportsReducedMotion: boolean;
  };
}

/**
 * Re-export all type definitions used by the mode system.
 */
export type { ComponentType };
