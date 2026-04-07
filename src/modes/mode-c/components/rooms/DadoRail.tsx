'use client';

/**
 * DadoRail — Horizontal chair-rail molding
 *
 * Runs along specified walls at a given height, visually dividing
 * walls into upper and lower zones. Classic gallery / museum detail.
 */

import { useMemo } from 'react';

interface DadoRailProps {
  width: number;
  depth: number;
  /** Height from floor (default 1.2 — standard chair rail) */
  height?: number;
  /** Visible height of the rail strip */
  railHeight?: number;
  /** Projection depth from wall surface */
  railDepth?: number;
  color: string;
  /** Which walls to include (default: north, west, east — skips south door wall) */
  walls?: ('north' | 'south' | 'west' | 'east')[];
}

export function DadoRail({
  width,
  depth,
  height = 1.2,
  railHeight = 0.08,
  railDepth = 0.06,
  color,
  walls = ['north', 'west', 'east'],
}: DadoRailProps) {
  const segments = useMemo(() => {
    const halfW = width / 2;
    const halfD = depth / 2;
    const wallSet = new Set(walls);

    const result: {
      pos: [number, number, number];
      size: [number, number, number];
    }[] = [];

    if (wallSet.has('north')) {
      result.push({
        pos: [0, height, -(halfD - railDepth / 2)],
        size: [width, railHeight, railDepth],
      });
    }
    if (wallSet.has('south')) {
      result.push({
        pos: [0, height, halfD - railDepth / 2],
        size: [width, railHeight, railDepth],
      });
    }
    if (wallSet.has('west')) {
      result.push({
        pos: [-(halfW - railDepth / 2), height, 0],
        size: [railDepth, railHeight, depth],
      });
    }
    if (wallSet.has('east')) {
      result.push({
        pos: [halfW - railDepth / 2, height, 0],
        size: [railDepth, railHeight, depth],
      });
    }

    return result;
  }, [width, depth, height, railHeight, railDepth, walls]);

  return (
    <group>
      {segments.map((seg, i) => (
        <mesh key={i} position={seg.pos} receiveShadow>
          <boxGeometry args={seg.size} />
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
}
