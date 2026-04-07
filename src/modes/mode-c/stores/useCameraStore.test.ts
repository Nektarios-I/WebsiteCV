/**
 * Unit tests for useCameraStore — camera preset management
 */

import { describe, it, expect, beforeEach } from 'vitest';

import { useCameraStore } from './useCameraStore';
import { CAMERA_PRESETS, DEFAULT_CAMERA_SETTINGS } from '../lib/camera-presets';

describe('useCameraStore', () => {
  beforeEach(() => {
    // Reset store state between tests
    useCameraStore.setState({
      activePreset: 'third-person',
      settings: { ...DEFAULT_CAMERA_SETTINGS },
      customSettings: { ...DEFAULT_CAMERA_SETTINGS },
      isPanelOpen: false,
    });
  });

  describe('initial state', () => {
    it('starts with third-person preset', () => {
      const state = useCameraStore.getState();
      expect(state.activePreset).toBe('third-person');
    });

    it('starts with panel closed', () => {
      const state = useCameraStore.getState();
      expect(state.isPanelOpen).toBe(false);
    });

    it('has default camera settings matching third-person preset', () => {
      const state = useCameraStore.getState();
      expect(state.settings.fov).toBe(CAMERA_PRESETS['third-person'].fov);
      expect(state.settings.camInitDis).toBe(CAMERA_PRESETS['third-person'].camInitDis);
    });
  });

  describe('setPreset', () => {
    it('switches to first-person preset', () => {
      useCameraStore.getState().setPreset('first-person');
      const state = useCameraStore.getState();
      expect(state.activePreset).toBe('first-person');
      expect(state.settings.fov).toBe(CAMERA_PRESETS['first-person'].fov);
      expect(state.settings.camInitDis).toBe(CAMERA_PRESETS['first-person'].camInitDis);
    });

    it('switches to panoramic preset', () => {
      useCameraStore.getState().setPreset('panoramic');
      const state = useCameraStore.getState();
      expect(state.activePreset).toBe('panoramic');
      expect(state.settings.camInitDis).toBe(CAMERA_PRESETS.panoramic.camInitDis);
      expect(state.settings.fov).toBe(CAMERA_PRESETS.panoramic.fov);
    });

    it('switches to cinematic preset', () => {
      useCameraStore.getState().setPreset('cinematic');
      const state = useCameraStore.getState();
      expect(state.activePreset).toBe('cinematic');
      expect(state.settings.fov).toBe(CAMERA_PRESETS.cinematic.fov);
    });

    it('switches to top-down preset', () => {
      useCameraStore.getState().setPreset('top-down');
      const state = useCameraStore.getState();
      expect(state.activePreset).toBe('top-down');
      expect(state.settings.camInitDir.x).toBe(CAMERA_PRESETS['top-down'].camInitDir.x);
    });

    it('switches to custom uses customSettings', () => {
      // First set custom settings
      useCameraStore.getState().updateCustomSettings({ fov: 85 });
      // Then switch to a different preset
      useCameraStore.getState().setPreset('first-person');
      // Now switch back to custom
      useCameraStore.getState().setPreset('custom');
      const state = useCameraStore.getState();
      expect(state.activePreset).toBe('custom');
      expect(state.settings.fov).toBe(85);
    });
  });

  describe('updateCustomSettings', () => {
    it('updates FOV', () => {
      useCameraStore.getState().updateCustomSettings({ fov: 90 });
      const state = useCameraStore.getState();
      expect(state.customSettings.fov).toBe(90);
      expect(state.settings.fov).toBe(90);
      expect(state.activePreset).toBe('custom');
    });

    it('updates camInitDis', () => {
      useCameraStore.getState().updateCustomSettings({ camInitDis: -15 });
      const state = useCameraStore.getState();
      expect(state.customSettings.camInitDis).toBe(-15);
      expect(state.settings.camInitDis).toBe(-15);
    });

    it('merges camInitDir properly', () => {
      useCameraStore.getState().updateCustomSettings({
        camInitDir: { x: -1.0, y: 0.5 },
      });
      const state = useCameraStore.getState();
      expect(state.customSettings.camInitDir.x).toBe(-1.0);
      expect(state.customSettings.camInitDir.y).toBe(0.5);
    });

    it('merges camTargetPos properly', () => {
      useCameraStore.getState().updateCustomSettings({
        camTargetPos: { x: 0, y: 2.5, z: 0 },
      });
      const state = useCameraStore.getState();
      expect(state.customSettings.camTargetPos.y).toBe(2.5);
    });

    it('switches to custom preset automatically', () => {
      expect(useCameraStore.getState().activePreset).toBe('third-person');
      useCameraStore.getState().updateCustomSettings({ fov: 80 });
      expect(useCameraStore.getState().activePreset).toBe('custom');
    });
  });

  describe('panel state', () => {
    it('toggles panel open and closed', () => {
      expect(useCameraStore.getState().isPanelOpen).toBe(false);
      useCameraStore.getState().togglePanel();
      expect(useCameraStore.getState().isPanelOpen).toBe(true);
      useCameraStore.getState().togglePanel();
      expect(useCameraStore.getState().isPanelOpen).toBe(false);
    });

    it('sets panel open explicitly', () => {
      useCameraStore.getState().setPanelOpen(true);
      expect(useCameraStore.getState().isPanelOpen).toBe(true);
      useCameraStore.getState().setPanelOpen(false);
      expect(useCameraStore.getState().isPanelOpen).toBe(false);
    });
  });

  describe('resetCamera', () => {
    it('resets to third-person defaults', () => {
      // Mangle state
      useCameraStore.getState().setPreset('panoramic');
      useCameraStore.getState().updateCustomSettings({ fov: 100 });
      // Reset
      useCameraStore.getState().resetCamera();
      const state = useCameraStore.getState();
      expect(state.activePreset).toBe('third-person');
      expect(state.settings.fov).toBe(DEFAULT_CAMERA_SETTINGS.fov);
      expect(state.settings.camInitDis).toBe(DEFAULT_CAMERA_SETTINGS.camInitDis);
      expect(state.customSettings.fov).toBe(DEFAULT_CAMERA_SETTINGS.fov);
    });
  });

  describe('all presets are valid', () => {
    const presetKeys = Object.keys(CAMERA_PRESETS) as Array<
      keyof typeof CAMERA_PRESETS
    >;

    it.each(presetKeys)('preset "%s" has all required fields', (key) => {
      const p = CAMERA_PRESETS[key];
      expect(p.label).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.icon).toBeTruthy();
      expect(typeof p.camInitDis).toBe('number');
      expect(typeof p.camMaxDis).toBe('number');
      expect(typeof p.camMinDis).toBe('number');
      expect(typeof p.fov).toBe('number');
      expect(p.camInitDir).toHaveProperty('x');
      expect(p.camInitDir).toHaveProperty('y');
      expect(p.camTargetPos).toHaveProperty('x');
      expect(p.camTargetPos).toHaveProperty('y');
      expect(p.camTargetPos).toHaveProperty('z');
    });

    it.each(presetKeys)('preset "%s" has valid FOV range (30-100)', (key) => {
      expect(CAMERA_PRESETS[key].fov).toBeGreaterThanOrEqual(30);
      expect(CAMERA_PRESETS[key].fov).toBeLessThanOrEqual(100);
    });

    it.each(presetKeys)('preset "%s" has negative camInitDis', (key) => {
      expect(CAMERA_PRESETS[key].camInitDis).toBeLessThan(0);
    });
  });
});
