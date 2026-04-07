/**
 * useRoomTransition — Transition state machine for room changes
 *
 * Handles the full doorway transition flow:
 * 1. Player hits doorway sensor → transitionTo(targetRoom)
 * 2. Fade-in overlay (400ms)
 * 3. Swap current room (unmount old, mount new)
 * 4. Wait for physics to settle (300ms)
 * 5. Fade-out overlay (400ms)
 * 6. Unlock (allow new transitions)
 *
 * Uses a ref-based lock to prevent rapid re-triggers (debounce).
 */

import { useCallback, useRef } from 'react';

import type { RoomId } from '../lib/constants';
import { useGalleryStore } from '../stores/useGalleryStore';

/** Duration of the fade-in/fade-out animation (ms) — matches TransitionOverlay */
const FADE_DURATION = 400;

/**
 * Delay after room swap for physics world to fully settle before fading out (ms).
 * Gives the floor colliders time to register so the player doesn't clip through.
 */
const SETTLE_DELAY = 600;

export function useRoomTransition() {
  const setCurrentRoom = useGalleryStore((s) => s.setCurrentRoom);
  const setIsTransitioning = useGalleryStore((s) => s.setIsTransitioning);
  const lockRef = useRef(false);

  const transitionTo = useCallback(
    (targetRoom: RoomId) => {
      // Debounce: ignore if a transition is already in progress
      if (lockRef.current) return;
      lockRef.current = true;

      // 1. Start fade-in
      setIsTransitioning(true);

      // 2. After fade-in completes, swap to the new room
      setTimeout(() => {
        setCurrentRoom(targetRoom);

        // 3. Wait for physics world to settle, then fade-out
        setTimeout(() => {
          setIsTransitioning(false);

          // 4. Unlock after fade-out animation finishes
          setTimeout(() => {
            lockRef.current = false;
          }, FADE_DURATION);
        }, SETTLE_DELAY);
      }, FADE_DURATION);
    },
    [setCurrentRoom, setIsTransitioning],
  );

  return { transitionTo };
}
