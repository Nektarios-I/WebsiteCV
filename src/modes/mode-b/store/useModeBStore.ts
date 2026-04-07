/**
 * Mode B Store — Zustand state management for the 3D experience
 *
 * Tracks:
 * - selectedContent: Which content section is active (null = none)
 * - isTransitioning: Whether camera is currently moving
 * - cameraTarget: Target position for camera animation
 */

import { create } from 'zustand';

export type ContentSection =
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'contact'
  | null;

interface CameraPosition {
  position: [number, number, number];
  target: [number, number, number];
}

interface ModeBStore {
  // Content state
  selectedContent: ContentSection;
  setSelectedContent: (content: ContentSection) => void;

  // Camera transition state
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;

  // Camera positions
  cameraTarget: CameraPosition;
  setCameraTarget: (target: CameraPosition) => void;

  // Reset to default view
  resetView: () => void;
}

// Default camera position (hero shot of the desk setup)
const DEFAULT_CAMERA: CameraPosition = {
  position: [0, 2.2, 3.5],
  target: [0, 0.9, -2.5],
};

// Camera positions for each content section
// Updated Sprint 5: targets align with physical interactive objects
export const CAMERA_POSITIONS: Record<
  Exclude<ContentSection, null>,
  CameraPosition
> = {
  // Robot figurine — left side of desk
  about: {
    position: [-2.2, 1.5, -0.8],
    target: [-1.4, 0.85, -2.3],
  },
  // Notebook — right of keyboard on desk
  experience: {
    position: [1.5, 1.6, -1.0],
    target: [0.42, 0.82, -2.35],
  },
  // Ultrawide monitor — center of desk
  projects: {
    position: [0, 1.65, -0.2],
    target: [0, 1.14, -2.58],
  },
  // Vertical side monitor — right of main monitor
  skills: {
    position: [2.2, 1.6, -0.5],
    target: [1.04, 1.03, -2.74],
  },
  // Tablet — right edge of desk
  contact: {
    position: [2.2, 1.4, -0.5],
    target: [1.53, 0.82, -2.4],
  },
};

export const useModeBStore = create<ModeBStore>((set) => ({
  selectedContent: null,
  setSelectedContent: (content) =>
    set({
      selectedContent: content,
      ...(content !== null
        ? { cameraTarget: CAMERA_POSITIONS[content], isTransitioning: true }
        : {}),
    }),

  isTransitioning: false,
  setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),

  cameraTarget: DEFAULT_CAMERA,
  setCameraTarget: (target) => set({ cameraTarget: target }),

  resetView: () =>
    set({
      selectedContent: null,
      cameraTarget: DEFAULT_CAMERA,
      // Explicitly clear transitioning so OrbitControls are never stuck disabled
      // if the R3F frame loop was paused before the lerp could finish.
      isTransitioning: false,
    }),
}));
