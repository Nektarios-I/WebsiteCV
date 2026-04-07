/**
 * Unit Tests for useGalleryStore
 *
 * Tests the Zustand store used for Mode C gallery state management.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGalleryStore } from './useGalleryStore';

describe('useGalleryStore', () => {
  beforeEach(() => {
    // Reset the store between tests
    useGalleryStore.getState().resetGallery();
  });

  // ── Initial state ──────────────────────────────────────────────────

  it('starts in the lobby', () => {
    expect(useGalleryStore.getState().currentRoom).toBe('lobby');
  });

  it('starts with lobby as the only visited room', () => {
    const visited = useGalleryStore.getState().visitedRooms;
    expect(visited.size).toBe(1);
    expect(visited.has('lobby')).toBe(true);
  });

  it('starts with map closed', () => {
    expect(useGalleryStore.getState().isMapOpen).toBe(false);
  });

  it('starts with no active exhibit', () => {
    expect(useGalleryStore.getState().activeExhibit).toBeNull();
  });

  it('starts with transitioning false', () => {
    expect(useGalleryStore.getState().isTransitioning).toBe(false);
  });

  it('starts with default player position', () => {
    expect(useGalleryStore.getState().playerPosition).toEqual([0, 1, 0]);
  });

  // ── Room navigation ────────────────────────────────────────────────

  it('setCurrentRoom changes the current room', () => {
    useGalleryStore.getState().setCurrentRoom('projects');
    expect(useGalleryStore.getState().currentRoom).toBe('projects');
  });

  it('setCurrentRoom automatically marks the room as visited', () => {
    useGalleryStore.getState().setCurrentRoom('skills');
    const visited = useGalleryStore.getState().visitedRooms;
    expect(visited.has('skills')).toBe(true);
    expect(visited.has('lobby')).toBe(true);
  });

  it('visiting multiple rooms accumulates in visitedRooms', () => {
    useGalleryStore.getState().setCurrentRoom('projects');
    useGalleryStore.getState().setCurrentRoom('bio');
    useGalleryStore.getState().setCurrentRoom('skills');
    const visited = useGalleryStore.getState().visitedRooms;
    expect(visited.size).toBe(4); // lobby + 3
    expect(visited.has('lobby')).toBe(true);
    expect(visited.has('projects')).toBe(true);
    expect(visited.has('bio')).toBe(true);
    expect(visited.has('skills')).toBe(true);
  });

  // ── Transition state ───────────────────────────────────────────────

  it('setIsTransitioning toggles the transition flag', () => {
    useGalleryStore.getState().setIsTransitioning(true);
    expect(useGalleryStore.getState().isTransitioning).toBe(true);

    useGalleryStore.getState().setIsTransitioning(false);
    expect(useGalleryStore.getState().isTransitioning).toBe(false);
  });

  // ── Map state ──────────────────────────────────────────────────────

  it('toggleMap flips the map open state', () => {
    expect(useGalleryStore.getState().isMapOpen).toBe(false);

    useGalleryStore.getState().toggleMap();
    expect(useGalleryStore.getState().isMapOpen).toBe(true);

    useGalleryStore.getState().toggleMap();
    expect(useGalleryStore.getState().isMapOpen).toBe(false);
  });

  it('setMapOpen sets the map state explicitly', () => {
    useGalleryStore.getState().setMapOpen(true);
    expect(useGalleryStore.getState().isMapOpen).toBe(true);

    useGalleryStore.getState().setMapOpen(false);
    expect(useGalleryStore.getState().isMapOpen).toBe(false);
  });

  // ── Exhibit state ──────────────────────────────────────────────────

  it('setActiveExhibit opens an exhibit', () => {
    useGalleryStore.getState().setActiveExhibit('project/my-app');
    expect(useGalleryStore.getState().activeExhibit).toBe('project/my-app');
  });

  it('setActiveExhibit(null) closes the exhibit panel', () => {
    useGalleryStore.getState().setActiveExhibit('skill/Frontend');
    useGalleryStore.getState().setActiveExhibit(null);
    expect(useGalleryStore.getState().activeExhibit).toBeNull();
  });

  // ── Room visited tracking ──────────────────────────────────────────

  it('markRoomVisited adds a room without changing current room', () => {
    useGalleryStore.getState().markRoomVisited('playground');
    expect(useGalleryStore.getState().visitedRooms.has('playground')).toBe(true);
    // Current room should still be lobby
    expect(useGalleryStore.getState().currentRoom).toBe('lobby');
  });

  // ── Player position ────────────────────────────────────────────────

  it('setPlayerPosition updates the player position', () => {
    useGalleryStore.getState().setPlayerPosition([5, 2, -3]);
    expect(useGalleryStore.getState().playerPosition).toEqual([5, 2, -3]);
  });

  // ── Reset ──────────────────────────────────────────────────────────

  it('resetGallery restores all state to initial values', () => {
    // Modify everything
    useGalleryStore.getState().setCurrentRoom('skills');
    useGalleryStore.getState().setIsTransitioning(true);
    useGalleryStore.getState().setMapOpen(true);
    useGalleryStore.getState().setActiveExhibit('project/x');
    useGalleryStore.getState().setPlayerPosition([10, 10, 10]);

    // Reset
    useGalleryStore.getState().resetGallery();

    const state = useGalleryStore.getState();
    expect(state.currentRoom).toBe('lobby');
    expect(state.isTransitioning).toBe(false);
    expect(state.isMapOpen).toBe(false);
    expect(state.activeExhibit).toBeNull();
    expect(state.visitedRooms.size).toBe(1);
    expect(state.visitedRooms.has('lobby')).toBe(true);
    expect(state.playerPosition).toEqual([0, 1, 0]);
  });
});
