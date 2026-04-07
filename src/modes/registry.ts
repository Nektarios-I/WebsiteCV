/**
 * Mode Registry
 *
 * Central registry for all experience modes.
 * Adding a new mode is as simple as:
 * 1. Create src/modes/mode-x/ with config + root component
 * 2. Import and add the config here
 *
 * The hub page reads from this registry to render mode cards.
 */

import type { ModeConfig } from '@/modes/types';

import { modeAConfig } from '@/modes/mode-a';
import { modeBConfig } from '@/modes/mode-b';
import { modeCConfig } from '@/modes/mode-c';

/** All registered experience modes, ordered by display priority */
export const modes: ModeConfig[] = [modeAConfig, modeBConfig, modeCConfig];

/** Lookup a mode by its unique id */
export function getModeById(id: string): ModeConfig | undefined {
  return modes.find((m) => m.id === id);
}

/** Lookup a mode by its route path */
export function getModeByRoute(route: string): ModeConfig | undefined {
  return modes.find((m) => m.route === route);
}
