/**
 * Global Application Store (Zustand)
 *
 * Manages cross-cutting state that persists across mode transitions:
 * - Which mode is currently active (or hub)
 * - Theme preference (light / dark / system)
 * - UI flags (e.g. mobile menu open)
 *
 * Mode-specific state should live inside each mode's own store or context,
 * NOT here. This store is intentionally thin.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark' | 'system';

interface AppState {
  /** Currently selected mode id, null = hub landing page */
  activeModeId: string | null;

  /** User's theme preference */
  theme: Theme;

  /** Whether the mobile navigation drawer is open */
  isMobileMenuOpen: boolean;
}

interface AppActions {
  setActiveModeId: (id: string | null) => void;
  setTheme: (theme: Theme) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

type AppStore = AppState & AppActions;

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // State
      activeModeId: null,
      theme: 'system',
      isMobileMenuOpen: false,

      // Actions
      setActiveModeId: (id) => set({ activeModeId: id }),
      setTheme: (theme) => set({ theme }),
      toggleMobileMenu: () =>
        set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage),
      /** Only persist user preferences, not transient UI state */
      partialize: (state) => ({
        theme: state.theme,
      }),
    },
  ),
);

// ─── Typed Selectors (avoid re-renders) ──────────────────────────────────────

export const useActiveModeId = () =>
  useAppStore((s) => s.activeModeId);

export const useTheme = () =>
  useAppStore((s) => s.theme);

export const useIsMobileMenuOpen = () =>
  useAppStore((s) => s.isMobileMenuOpen);
