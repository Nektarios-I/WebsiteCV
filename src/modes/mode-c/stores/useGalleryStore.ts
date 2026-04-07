/**
 * useGalleryStore — Zustand state management for Mode C (Gallery)
 *
 * Tracks:
 * - currentRoom: Which room the player is in
 * - isTransitioning: Whether a room transition fade is active
 * - isMapOpen: Whether the fullscreen map overlay is shown
 * - activeExhibit: Which exhibit's content panel is open (null = none)
 * - visitedRooms: Set of room IDs the player has entered
 * - playerPosition: Last known player world position (for minimap)
 */

import { create } from 'zustand';

import type { ExhibitId, RoomId } from '../lib/constants';

interface GalleryStore {
  // Room state
  currentRoom: RoomId;
  setCurrentRoom: (room: RoomId) => void;

  // Transition state
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;

  // Map state
  isMapOpen: boolean;
  toggleMap: () => void;
  setMapOpen: (open: boolean) => void;

  // Exhibit state
  activeExhibit: ExhibitId | null;
  setActiveExhibit: (exhibit: ExhibitId | null) => void;

  // Exploration tracking
  visitedRooms: Set<RoomId>;
  markRoomVisited: (room: RoomId) => void;

  // Player world position (for minimap dot)
  playerPosition: [number, number, number];
  setPlayerPosition: (pos: [number, number, number]) => void;

  // Reset
  resetGallery: () => void;
}

const INITIAL_STATE = {
  currentRoom: 'lobby' as RoomId,
  isTransitioning: false,
  isMapOpen: false,
  activeExhibit: null,
  visitedRooms: new Set<RoomId>(['lobby']),
  playerPosition: [0, 1, 0] as [number, number, number],
};

export const useGalleryStore = create<GalleryStore>((set) => ({
  ...INITIAL_STATE,

  setCurrentRoom: (room) =>
    set((state) => ({
      currentRoom: room,
      visitedRooms: new Set([...state.visitedRooms, room]),
    })),

  setIsTransitioning: (transitioning) =>
    set({ isTransitioning: transitioning }),

  toggleMap: () => set((state) => ({ isMapOpen: !state.isMapOpen })),
  setMapOpen: (open) => set({ isMapOpen: open }),

  setActiveExhibit: (exhibit) => set({ activeExhibit: exhibit }),

  markRoomVisited: (room) =>
    set((state) => ({
      visitedRooms: new Set([...state.visitedRooms, room]),
    })),

  setPlayerPosition: (pos) => set({ playerPosition: pos }),

  resetGallery: () =>
    set({
      ...INITIAL_STATE,
      visitedRooms: new Set<RoomId>(['lobby']),
    }),
}));
