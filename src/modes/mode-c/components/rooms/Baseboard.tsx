'use client';

/**
 * Baseboard — Decorative trim along the bottom of walls
 *
 * Adds a thin strip of darker material at floor level along
 * the room perimeter. Classic gallery detail that makes rooms
 * feel finished and professional.
 */

import { useMemo } from 'react';

interface BaseboardProps {
  width: number;
  depth: number;
  height?: number;
  thickness?: number;
  color: string;
}

export function Baseboard({
  width,
  depth,
  height = 0.15,
  thickness = 0.08,
  color,
}: BaseboardProps) {
  const segments = useMemo(() => {
    const halfW = width / 2;
    const halfD = depth / 2;
    // 4 wall-length strips (inside the walls)
    return [
      // North
      { pos: [0, height / 2, -(halfD - thickness / 2)] as [number, number, number], size: [width, height, thickness] as [number, number, number] },
      // South
      { pos: [0, height / 2, halfD - thickness / 2] as [number, number, number], size: [width, height, thickness] as [number, number, number] },
      // West
      { pos: [-(halfW - thickness / 2), height / 2, 0] as [number, number, number], size: [thickness, height, depth] as [number, number, number] },
      // East
      { pos: [halfW - thickness / 2, height / 2, 0] as [number, number, number], size: [thickness, height, depth] as [number, number, number] },
    ];
  }, [width, depth, height, thickness]);

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
