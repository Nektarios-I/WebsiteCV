/**
 * Camera Presets — predefined camera configurations for Mode C Gallery
 *
 * Each preset defines ecctrl camera props + FOV.
 * Users can pick a preset or create a custom configuration.
 */

export interface CameraSettings {
  /** ecctrl: initial distance from character (negative = behind) */
  camInitDis: number;
  /** ecctrl: max zoom-out distance */
  camMaxDis: number;
  /** ecctrl: min zoom-in distance */
  camMinDis: number;
  /** ecctrl: initial direction in radians { x = pitch, y = yaw } */
  camInitDir: { x: number; y: number };
  /** ecctrl: camera look-at target relative to character */
  camTargetPos: { x: number; y: number; z: number };
  /** Canvas camera field of view (degrees) */
  fov: number;
}

export interface CameraPreset extends CameraSettings {
  label: string;
  description: string;
  icon: string;
}

export type PresetId =
  | 'third-person'
  | 'first-person'
  | 'panoramic'
  | 'cinematic'
  | 'top-down'
  | 'custom';

export const CAMERA_PRESETS: Record<Exclude<PresetId, 'custom'>, CameraPreset> =
  {
    'third-person': {
      label: 'Third Person',
      description: 'Default drone-like view behind the character',
      icon: '🎮',
      camInitDis: -7,
      camMaxDis: -10,
      camMinDis: -3,
      camInitDir: { x: -0.7, y: 0 },
      camTargetPos: { x: 0, y: 1.5, z: 0 },
      fov: 50,
    },
    'first-person': {
      label: 'First Person',
      description: "See through the character's eyes",
      icon: '👁️',
      camInitDis: -0.1,
      camMaxDis: -0.5,
      camMinDis: -0.1,
      camInitDir: { x: -0.05, y: 0 },
      camTargetPos: { x: 0, y: 1.8, z: 0 },
      fov: 70,
    },
    panoramic: {
      label: "Panoramic (Bird's Eye)",
      description: 'High above, looking down at the full scene',
      icon: '🦅',
      camInitDis: -18,
      camMaxDis: -25,
      camMinDis: -10,
      camInitDir: { x: -1.2, y: 0 },
      camTargetPos: { x: 0, y: 0, z: 0 },
      fov: 60,
    },
    cinematic: {
      label: 'Cinematic (Low Angle)',
      description: 'Low dramatic angle for cinematic views',
      icon: '🎬',
      camInitDis: -5,
      camMaxDis: -8,
      camMinDis: -2,
      camInitDir: { x: -0.2, y: 0 },
      camTargetPos: { x: 0, y: 0.8, z: 0 },
      fov: 45,
    },
    'top-down': {
      label: 'Top Down',
      description: 'Directly above, strategy-game perspective',
      icon: '📐',
      camInitDis: -15,
      camMaxDis: -20,
      camMinDis: -8,
      camInitDir: { x: -1.5, y: 0 },
      camTargetPos: { x: 0, y: 0, z: 0 },
      fov: 50,
    },
  };

/** Default camera settings (matches third-person preset) */
export const DEFAULT_CAMERA_SETTINGS: CameraSettings = {
  camInitDis: CAMERA_PRESETS['third-person'].camInitDis,
  camMaxDis: CAMERA_PRESETS['third-person'].camMaxDis,
  camMinDis: CAMERA_PRESETS['third-person'].camMinDis,
  camInitDir: { ...CAMERA_PRESETS['third-person'].camInitDir },
  camTargetPos: { ...CAMERA_PRESETS['third-person'].camTargetPos },
  fov: CAMERA_PRESETS['third-person'].fov,
};

/** Slider constraints for the custom camera editor */
export const CAMERA_LIMITS = {
  camInitDis: { min: -25, max: -0.1, step: 0.5, label: 'Distance' },
  pitch: { min: -1.5, max: 0, step: 0.05, label: 'Pitch (Angle)' },
  fov: { min: 30, max: 100, step: 1, label: 'Field of View' },
  targetHeight: { min: 0, max: 3, step: 0.1, label: 'Look-at Height' },
} as const;
