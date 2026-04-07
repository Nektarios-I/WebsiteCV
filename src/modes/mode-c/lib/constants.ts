/**
 * Mode C Constants — Gallery configuration values
 *
 * Room dimensions, spawn points, keyboard mapping, and other
 * gallery-specific constants live here.
 */

/** Room identifiers */
export type RoomId = 'lobby' | 'projects' | 'bio' | 'skills' | 'playground';

/** Exhibit identifiers (will expand as exhibits are added) */
export type ExhibitId = string;

/** Human-readable room names */
export const ROOM_NAMES: Record<RoomId, string> = {
  lobby: 'Grand Lobby',
  projects: 'Projects Gallery',
  bio: 'Biography Hall',
  skills: 'Skills Lab',
  playground: 'Certifications',
};

/** Room dimensions (width, height, depth) in Three.js units */
export const ROOM_DIMENSIONS: Record<RoomId, [number, number, number]> = {
  lobby: [24, 6, 24],
  projects: [20, 5, 16],
  bio: [18, 6, 18],
  skills: [20, 5, 16],
  playground: [16, 5, 16],
};

/**
 * Player spawn positions per room [x, y, z]
 *
 * Y = 1 places the capsule just above the natural rest height (~0.75)
 * so the floating spring settles gently without clipping.
 *
 * XZ positions are near the return (south) door in themed rooms
 * so the player faces into the room on arrival.
 * Lobby spawn is offset from the centre to avoid the MapPedestal.
 */
export const SPAWN_POSITIONS: Record<RoomId, [number, number, number]> = {
  lobby: [4, 1, 5],       // SE quadrant — clear of MapPedestal at [0,0,0]
  projects: [0, 1, 6],    // near south return door (theme scene ~±8.2)
  bio: [0, 1, 6],         // near south return door (depth/2 = 9)
  skills: [0, 1, 5],      // near south return door (depth/2 = 8)
  playground: [0, 1, 5],  // near south return door (depth/2 = 8)
};

/** Minimum Y before the spawn guard resets the player */
export const SPAWN_GUARD_MIN_Y = -5;

/** Number of frames to skip after remount before the guard activates */
export const SPAWN_GUARD_GRACE_FRAMES = 30;

/** Doorway definitions — which rooms connect and where the doors are */
export interface DoorwayConfig {
  from: RoomId;
  to: RoomId;
  position: [number, number, number];
  label: string;
}

export const LOBBY_DOORWAYS: DoorwayConfig[] = [
  {
    from: 'lobby',
    to: 'projects',
    position: [0, 1.5, -11],
    label: 'Projects Gallery',
  },
  {
    from: 'lobby',
    to: 'bio',
    position: [-11, 1.5, 0],
    label: 'Biography Hall',
  },
  {
    from: 'lobby',
    to: 'skills',
    position: [11, 1.5, 0],
    label: 'Skills Lab',
  },
  {
    from: 'lobby',
    to: 'playground',
    position: [0, 1.5, 11],
    label: 'Certifications',
  },
];

/**
 * Keyboard map for drei's KeyboardControls
 * These names map to ecctrl's expected control names
 */
export const KEYBOARD_MAP = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] },
];

/** ecctrl character controller tuning — grounded, responsive feel */
export const PLAYER_CONFIG = {
  /** Max velocity (units/sec) */
  maxVelLimit: 2.5,
  /** Turn speed (higher = snappier) */
  turnSpeed: 15,
  /** Sprint multiplier */
  sprintMult: 1.8,
  /** Drag damping — higher = less sliding on ground */
  dragDampingC: 0.15,
  /** Spring constant for floating capsule — higher = more planted */
  springK: 1.2,
  /** Damping for floating capsule oscillation */
  dampingC: 0.08,
  /** Acceleration delta time — responsive acceleration */
  accDeltaTime: 8,
  /** Falling gravity scale — fall faster, less floaty */
  fallingGravityScale: 2.5,
  /** Camera initial distance (negative = behind) — fits inside smaller rooms */
  camInitDis: -7,
  /** Camera max distance */
  camMaxDis: -10,
  /** Camera min distance */
  camMinDis: -3,
  /** Camera initial direction (radians) — drone-like, ~40° above */
  camInitDir: { x: -0.7, y: 0 },
  /** Camera target position — look slightly above character center */
  camTargetPos: { x: 0, y: 1.5, z: 0 },
  /** Camera follow speed multiplier */
  camFollowMult: 15,
  /** Camera lerp speed multiplier */
  camLerpMult: 30,
  /** Capsule half-height */
  capsuleHalfHeight: 0.35,
  /** Capsule radius */
  capsuleRadius: 0.3,
  /** Float height above ground — low for grounded feel */
  floatHeight: 0.1,
} as const;
