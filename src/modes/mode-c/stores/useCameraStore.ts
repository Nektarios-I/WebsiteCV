/**
 * useCameraStore — Zustand store for camera preset management
 *
 * Manages:
 * - activePreset: which preset is currently active
 * - settings: the actual camera numbers being used
 * - customSettings: user's manual camera configuration
 * - isPanelOpen: whether the settings popup is visible
 *
 * Persists to localStorage so camera preference survives refresh.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  CAMERA_PRESETS,
  DEFAULT_CAMERA_SETTINGS,
  type CameraSettings,
  type PresetId,
} from '../lib/camera-presets';

interface CameraStore {
  /** Currently active preset key */
  activePreset: PresetId;
  /** Active camera settings (read by Player & CameraController) */
  settings: CameraSettings;
  /** User's custom camera settings (editable via sliders) */
  customSettings: CameraSettings;
  /** Whether the camera settings popup is open */
  isPanelOpen: boolean;

  /** Switch to a predefined or custom preset */
  setPreset: (preset: PresetId) => void;
  /** Update custom settings (partial merge), also activates 'custom' preset */
  updateCustomSettings: (partial: Partial<CameraSettings>) => void;
  /** Open / close the settings panel */
  togglePanel: () => void;
  setPanelOpen: (open: boolean) => void;
  /** Reset to default third-person */
  resetCamera: () => void;
}

export const useCameraStore = create<CameraStore>()(
  persist(
    (set) => ({
      activePreset: 'third-person',
      settings: { ...DEFAULT_CAMERA_SETTINGS },
      customSettings: { ...DEFAULT_CAMERA_SETTINGS },
      isPanelOpen: false,

      setPreset: (preset) => {
        if (preset === 'custom') {
          set((state) => ({
            activePreset: 'custom',
            settings: { ...state.customSettings },
          }));
        } else {
          const presetData = CAMERA_PRESETS[preset];
          set({
            activePreset: preset,
            settings: {
              camInitDis: presetData.camInitDis,
              camMaxDis: presetData.camMaxDis,
              camMinDis: presetData.camMinDis,
              camInitDir: { ...presetData.camInitDir },
              camTargetPos: { ...presetData.camTargetPos },
              fov: presetData.fov,
            },
          });
        }
      },

      updateCustomSettings: (partial) =>
        set((state) => {
          const newCustom = { ...state.customSettings, ...partial };
          // Merge nested objects properly
          if (partial.camInitDir) {
            newCustom.camInitDir = {
              ...state.customSettings.camInitDir,
              ...partial.camInitDir,
            };
          }
          if (partial.camTargetPos) {
            newCustom.camTargetPos = {
              ...state.customSettings.camTargetPos,
              ...partial.camTargetPos,
            };
          }
          return {
            activePreset: 'custom' as PresetId,
            customSettings: newCustom,
            settings: newCustom,
          };
        }),

      togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
      setPanelOpen: (open) => set({ isPanelOpen: open }),

      resetCamera: () =>
        set({
          activePreset: 'third-person',
          settings: { ...DEFAULT_CAMERA_SETTINGS },
          customSettings: { ...DEFAULT_CAMERA_SETTINGS },
        }),
    }),
    {
      name: 'gallery-camera-settings',
      // Only persist these fields (not isPanelOpen)
      partialize: (state) => ({
        activePreset: state.activePreset,
        settings: state.settings,
        customSettings: state.customSettings,
      }),
    },
  ),
);
