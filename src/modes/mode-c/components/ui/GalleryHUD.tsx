'use client';

/**
 * GalleryHUD — Heads-Up Display for Mode C
 *
 * Shows:
 * - Current room name
 * - Map toggle button
 * - Controls hint
 */

import { useGalleryStore } from '../../stores/useGalleryStore';
import { ROOM_NAMES } from '../../lib/constants';

export function GalleryHUD() {
  const currentRoom = useGalleryStore((s) => s.currentRoom);
  const toggleMap = useGalleryStore((s) => s.toggleMap);
  const roomName = ROOM_NAMES[currentRoom];

  return (
    <div className="absolute right-4 bottom-4 z-20 flex flex-col items-end gap-2">
      {/* Room indicator */}
      <div className="pointer-events-none rounded-lg bg-white/70 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm">
        📍 {roomName}
      </div>

      {/* Map button */}
      <button
        onClick={toggleMap}
        className="rounded-lg bg-white/70 px-3 py-1.5 text-sm text-gray-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/90 hover:text-gray-900"
        aria-label="Open gallery map"
      >
        🗺️ Map
      </button>

      {/* Controls hint */}
      <div className="pointer-events-none rounded-lg bg-white/50 px-3 py-1 text-xs text-gray-400 backdrop-blur-sm">
        WASD to move · Mouse to orbit · Shift to sprint · M for map
      </div>
    </div>
  );
}
