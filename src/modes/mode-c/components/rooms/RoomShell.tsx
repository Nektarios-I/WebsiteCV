'use client';

/**
 * RoomShell — Reusable room structure for non-lobby rooms
 *
 * Provides:
 * - Floor (physics RigidBody) with flat colour + optional tile overlay
 * - Ceiling with flat colour
 * - Walls with flat colour
 * - Baseboard trim (wall-floor junction)
 * - Crown molding (wall-ceiling junction)
 * - 3 solid walls (north, west, east)
 * - 1 south wall with a return doorway + sensor
 * - "← Back to Lobby" label above the return door
 *
 * Each themed room wraps RoomShell and adds its own
 * decorative content as children.
 */

import { Text, Billboard } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import type { ReactNode } from 'react';

import { Baseboard } from './Baseboard';
import { CrownMolding } from './CrownMolding';
import { GalleryFloor, type FloorPattern } from './GalleryFloor';
import { WallWithDoor } from './WallWithDoor';

const WALL_THICKNESS = 0.5;
const DOOR_WIDTH = 3;
const DOOR_HEIGHT = 3.5;

interface RoomShellProps {
  dimensions: [number, number, number];
  floorColor: string;
  wallColor: string;
  ceilingColor: string;
  onReturnDoorEnter: () => void;
  children?: ReactNode;
  /** Baseboard trim color */
  baseboardColor?: string;
  /** Crown molding color */
  crownColor?: string;
  /** Optional tile floor pattern overlay */
  floorPattern?: FloorPattern;
  /** Primary tile colour */
  tileColor1?: string;
  /** Secondary tile colour */
  tileColor2?: string;
  /** Border/trim colour */
  borderColor?: string;
  /** Tile size in world units */
  tileSize?: number;
}

export function RoomShell({
  dimensions,
  floorColor,
  wallColor,
  ceilingColor,
  onReturnDoorEnter,
  children,
  baseboardColor,
  crownColor,
  floorPattern,
  tileColor1,
  tileColor2,
  borderColor,
  tileSize,
}: RoomShellProps) {
  const [width, height, depth] = dimensions;

  const bbColor = baseboardColor ?? wallColor;
  const cmColor = crownColor ?? ceilingColor;

  return (
    <group>
      {/* Floor — thick physics slab. Top surface at Y=0. */}
      <RigidBody type="fixed" colliders="cuboid" friction={1} restitution={0}>
        <mesh receiveShadow position={[0, -0.25, 0]}>
          <boxGeometry args={[width, 0.5, depth]} />
          <meshStandardMaterial
            color={floorColor}
            roughness={0.8}
            metalness={0.02}
          />
        </mesh>
      </RigidBody>

      {/* Extra catch-all collider below the visual floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -3, 0]} visible={false}>
          <boxGeometry args={[width + 4, 4, depth + 4]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>

      {/* Optional tile floor overlay */}
      {floorPattern && tileColor1 && tileColor2 && borderColor && (
        <GalleryFloor
          width={width}
          depth={depth}
          pattern={floorPattern}
          tileColor1={tileColor1}
          tileColor2={tileColor2}
          borderColor={borderColor}
          tileSize={tileSize}
        />
      )}

      {/* Baseboard trim */}
      <Baseboard width={width} depth={depth} color={bbColor} />

      {/* Crown molding */}
      <CrownMolding
        width={width}
        depth={depth}
        roomHeight={height}
        color={cmColor}
      />

      {/* Ceiling */}
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[width, 0.3, depth]} />
        <meshStandardMaterial
          color={ceilingColor}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* North wall — solid */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[0, height / 2, -depth / 2]}>
          <boxGeometry args={[width, height, WALL_THICKNESS]} />
          <meshStandardMaterial
            color={wallColor}
            roughness={0.8}
            metalness={0.01}
          />
        </mesh>
      </RigidBody>

      {/* West wall — solid */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[-width / 2, height / 2, 0]}>
          <boxGeometry args={[WALL_THICKNESS, height, depth]} />
          <meshStandardMaterial
            color={wallColor}
            roughness={0.8}
            metalness={0.01}
          />
        </mesh>
      </RigidBody>

      {/* East wall — solid */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[width / 2, height / 2, 0]}>
          <boxGeometry args={[WALL_THICKNESS, height, depth]} />
          <meshStandardMaterial
            color={wallColor}
            roughness={0.8}
            metalness={0.01}
          />
        </mesh>
      </RigidBody>

      {/* South wall — return doorway to lobby */}
      <WallWithDoor
        position={[0, height / 2, depth / 2]}
        wallWidth={width}
        wallHeight={height}
        doorWidth={DOOR_WIDTH}
        doorHeight={DOOR_HEIGHT}
        axis="x"
        wallColor={wallColor}
        onDoorwayEnter={onReturnDoorEnter}
      />

      {/* Return doorway label */}
      <Billboard position={[0, DOOR_HEIGHT + 0.8, depth / 2]}>
        <Text
          fontSize={0.35}
          color="#5a5550"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#ffffff"
        >
          ← Back to Lobby
        </Text>
      </Billboard>

      {/* Room-specific content */}
      {children}
    </group>
  );
}
