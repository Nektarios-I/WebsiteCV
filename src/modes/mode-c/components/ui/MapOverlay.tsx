'use client';

/**
 * MapOverlay — Fullscreen 2D gallery map overlay
 *
 * Shows an SVG floor plan of the gallery with:
 * - All 5 rooms as clickable tiles
 * - Current room highlighted with accent border
 * - Visited rooms in full color, unvisited rooms dimmed
 * - Click a room → fade transition → teleport player there
 * - Press Esc or click X to close
 *
 * Layout mirrors the physical gallery layout (top-down view):
 *   Top: Projects | Center: Lobby | Left: Bio | Right: Skills | Bottom: Playground
 */

import { AnimatePresence, motion } from 'framer-motion';

import type { RoomId } from '../../lib/constants';
import { useGalleryStore } from '../../stores/useGalleryStore';
import { useRoomTransition } from '../../hooks/useRoomTransition';

/** Room tile config for the SVG map layout  */
interface MapTile {
  id: RoomId;
  label: string;
  icon: string;
  /** Position in the SVG grid (percentage-based for responsive layout) */
  x: number;
  y: number;
  w: number;
  h: number;
}

const MAP_TILES: MapTile[] = [
  {
    id: 'lobby',
    label: 'Grand Lobby',
    icon: '🏛️',
    x: 160,
    y: 150,
    w: 140,
    h: 140,
  },
  {
    id: 'projects',
    label: 'Projects Gallery',
    icon: '🖼️',
    x: 170,
    y: 20,
    w: 120,
    h: 110,
  },
  {
    id: 'bio',
    label: 'Biography Hall',
    icon: '🗿',
    x: 20,
    y: 160,
    w: 120,
    h: 120,
  },
  {
    id: 'skills',
    label: 'Skills Lab',
    icon: '⚡',
    x: 320,
    y: 160,
    w: 120,
    h: 120,
  },
  {
    id: 'playground',
    label: 'Certifications',
    icon: '🏆',
    x: 180,
    y: 310,
    w: 100,
    h: 100,
  },
];

/** Doorway connector lines between rooms */
const CONNECTORS = [
  { from: { x: 230, y: 150 }, to: { x: 230, y: 130 } }, // Lobby ↔ Projects
  { from: { x: 160, y: 220 }, to: { x: 140, y: 220 } }, // Lobby ↔ Bio
  { from: { x: 300, y: 220 }, to: { x: 320, y: 220 } }, // Lobby ↔ Skills
  { from: { x: 230, y: 290 }, to: { x: 230, y: 310 } }, // Lobby ↔ Playground
];

export function MapOverlay() {
  const isMapOpen = useGalleryStore((s) => s.isMapOpen);
  const currentRoom = useGalleryStore((s) => s.currentRoom);
  const visitedRooms = useGalleryStore((s) => s.visitedRooms);
  const setMapOpen = useGalleryStore((s) => s.setMapOpen);
  const { transitionTo } = useRoomTransition();

  const handleRoomClick = (roomId: RoomId) => {
    if (roomId === currentRoom) return; // Already there
    setMapOpen(false);
    // Small delay so the map close animation plays first
    setTimeout(() => {
      transitionTo(roomId);
    }, 200);
  };

  return (
    <AnimatePresence>
      {isMapOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setMapOpen(false)}
        >
          {/* Map card — stop propagation so clicking inside doesn't close */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative mx-4 w-full max-w-lg rounded-2xl border border-white/10 bg-gray-900/95 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                🗺️ Gallery Map
              </h2>
              <button
                onClick={() => setMapOpen(false)}
                className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close map"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4l12 12M16 4L4 16" />
                </svg>
              </button>
            </div>

            {/* SVG Floor Plan */}
            <svg
              viewBox="0 0 460 430"
              className="w-full"
              role="img"
              aria-label="Gallery floor plan map"
            >
              {/* Connector lines */}
              {CONNECTORS.map((c, i) => (
                <line
                  key={i}
                  x1={c.from.x}
                  y1={c.from.y}
                  x2={c.to.x}
                  y2={c.to.y}
                  stroke="#555"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
              ))}

              {/* Room tiles */}
              {MAP_TILES.map((tile) => {
                const isCurrent = tile.id === currentRoom;
                const isVisited = visitedRooms.has(tile.id);

                return (
                  <g
                    key={tile.id}
                    className="cursor-pointer"
                    onClick={() => handleRoomClick(tile.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Teleport to ${tile.label}${isCurrent ? ' (current)' : ''}${!isVisited ? ' (not visited)' : ''}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRoomClick(tile.id);
                      }
                    }}
                  >
                    {/* Room background */}
                    <rect
                      x={tile.x}
                      y={tile.y}
                      width={tile.w}
                      height={tile.h}
                      rx={8}
                      fill={
                        isCurrent
                          ? 'rgba(68, 170, 221, 0.25)'
                          : isVisited
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(255, 255, 255, 0.03)'
                      }
                      stroke={
                        isCurrent
                          ? '#44aadd'
                          : isVisited
                            ? 'rgba(255, 255, 255, 0.2)'
                            : 'rgba(255, 255, 255, 0.08)'
                      }
                      strokeWidth={isCurrent ? 2.5 : 1.5}
                    />

                    {/* Room icon */}
                    <text
                      x={tile.x + tile.w / 2}
                      y={tile.y + tile.h / 2 - 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="22"
                      opacity={isVisited ? 1 : 0.4}
                    >
                      {tile.icon}
                    </text>

                    {/* Room name */}
                    <text
                      x={tile.x + tile.w / 2}
                      y={tile.y + tile.h / 2 + 16}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="11"
                      fill={
                        isCurrent
                          ? '#44aadd'
                          : isVisited
                            ? 'rgba(255,255,255,0.7)'
                            : 'rgba(255,255,255,0.3)'
                      }
                      fontWeight={isCurrent ? 'bold' : 'normal'}
                    >
                      {tile.label}
                    </text>

                    {/* "YOU ARE HERE" indicator */}
                    {isCurrent && (
                      <text
                        x={tile.x + tile.w / 2}
                        y={tile.y + tile.h / 2 + 32}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="8"
                        fill="#44aadd"
                        fontWeight="bold"
                      >
                        📍 YOU ARE HERE
                      </text>
                    )}

                    {/* Unvisited question mark */}
                    {!isVisited && (
                      <text
                        x={tile.x + tile.w - 14}
                        y={tile.y + 14}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="12"
                        fill="rgba(255,255,255,0.3)"
                      >
                        ?
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-between text-xs text-white/40">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm border border-cyan-400/60 bg-cyan-400/25" />
                  Current
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm border border-white/20 bg-white/8" />
                  Visited
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm border border-white/10 bg-white/3" />
                  Unexplored
                </span>
              </div>
              <span>Press M or Esc to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
