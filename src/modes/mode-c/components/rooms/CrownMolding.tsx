'use client';

/**
 * CrownMolding — Decorative trim where walls meet ceiling
 *
 * A thin ledge that runs along the top of each wall,
 * giving the room a finished architectural look.
 */

import { useMemo } from 'react';

interface CrownMoldingProps {
  width: number;
  depth: number;
  roomHeight: number;
  moldingHeight?: number;
  moldingDepth?: number;
  color: string;
}

export function CrownMolding({
  width,
  depth,
  roomHeight,
  moldingHeight = 0.12,
  moldingDepth = 0.1,
  color,
}: CrownMoldingProps) {
  const segments = useMemo(() => {
    const y = roomHeight - moldingHeight / 2;
    const halfW = width / 2;
    const halfD = depth / 2;
    return [
      // North
      {
        pos: [0, y, -(halfD - moldingDepth / 2)] as [number, number, number],
        size: [width, moldingHeight, moldingDepth] as [number, number, number],
      },
      // South
      {
        pos: [0, y, halfD - moldingDepth / 2] as [number, number, number],
        size: [width, moldingHeight, moldingDepth] as [number, number, number],
      },
      // West
      {
        pos: [-(halfW - moldingDepth / 2), y, 0] as [number, number, number],
        size: [moldingDepth, moldingHeight, depth] as [number, number, number],
      },
      // East
      {
        pos: [halfW - moldingDepth / 2, y, 0] as [number, number, number],
        size: [moldingDepth, moldingHeight, depth] as [number, number, number],
      },
    ];
  }, [width, depth, roomHeight, moldingHeight, moldingDepth]);

  return (
    <group>
      {segments.map((seg, i) => (
        <mesh key={i} position={seg.pos}>
          <boxGeometry args={seg.size} />
          <meshStandardMaterial
            color={color}
            roughness={0.25}
            metalness={0.03}
          />
        </mesh>
      ))}
    </group>
  );
}
