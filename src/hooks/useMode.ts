/**
 * useMode — Convenience hook for mode state & navigation
 *
 * Combines the app store with the registry so components
 * can access the active mode config and switch modes declaratively.
 */

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useAppStore } from '@/stores/appStore';
import { modes, getModeById } from '@/modes/registry';
import type { ModeConfig } from '@/modes/types';
import { ROUTES } from '@/lib/constants';

interface UseModeReturn {
  /** All registered modes */
  modes: ModeConfig[];

  /** Currently active mode config, or null when on the hub */
  activeMode: ModeConfig | null;

  /** Navigate to a specific mode */
  navigateToMode: (modeId: string) => void;

  /** Return to the hub landing page */
  navigateToHub: () => void;
}

export function useMode(): UseModeReturn {
  const activeModeId = useAppStore((s) => s.activeModeId);
  const setActiveModeId = useAppStore((s) => s.setActiveModeId);
  const router = useRouter();

  const activeMode = activeModeId ? (getModeById(activeModeId) ?? null) : null;

  const navigateToMode = useCallback(
    (modeId: string) => {
      const mode = getModeById(modeId);
      if (!mode) {
        console.warn(`[useMode] Unknown mode id: "${modeId}"`);
        return;
      }
      setActiveModeId(modeId);
      router.push(mode.route);
    },
    [setActiveModeId, router],
  );

  const navigateToHub = useCallback(() => {
    setActiveModeId(null);
    router.push(ROUTES.HUB);
  }, [setActiveModeId, router]);

  return { modes, activeMode, navigateToMode, navigateToHub };
}
