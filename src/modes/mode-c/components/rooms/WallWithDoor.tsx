'use client';

/**
 * WallWithDoor — A wall segment with a doorway cutout in the center
 *
 * Renders 3 physics collider segments:
 * - Left portion (from wall edge to door edge)
 * - Right portion (from door edge to wall edge)
 * - Top portion (above the door)
 *
 * Also places an invisible sensor collider in the doorway opening
 * for transition detection.
 *
 * Used by both Lobby (4 doorways) and RoomShell (return doorway).
 */

import { RigidBody, CuboidCollider } from '@react-three/rapier';

const DEFAULT_WALL_THICKNESS = 0.5;

interface WallWithDoorProps {
  position: [number, number, number];
  wallWidth: number;
  wallHeight: number;
  doorWidth: number;
  doorHeight: number;
  axis: 'x' | 'z';
  wallColor?: string;
  wallThickness?: number;
  onDoorwayEnter?: () => void;
}

export function WallWithDoor({
  position,
  wallWidth,
  wallHeight,
  doorWidth,
  doorHeight,
  axis,
  wallColor = '#a89e90',
  wallThickness = DEFAULT_WALL_THICKNESS,
  onDoorwayEnter,
}: WallWithDoorProps) {
  const sideWidth = (wallWidth - doorWidth) / 2;
  const topHeight = wallHeight - doorHeight;
  const isX = axis === 'x';

  // Offset for left/right sections along the wall's length axis
  const leftOffset = -(doorWidth / 2 + sideWidth / 2);
  const rightOffset = doorWidth / 2 + sideWidth / 2;

  return (
    <group position={position}>
      {/* Left wall segment */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          receiveShadow
          position={[isX ? leftOffset : 0, 0, isX ? 0 : leftOffset]}
        >
          <boxGeometry
            args={[
              isX ? sideWidth : wallThickness,
              wallHeight,
              isX ? wallThickness : sideWidth,
            ]}
          />
          <meshStandardMaterial color={wallColor} />
        </mesh>
      </RigidBody>

      {/* Right wall segment */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          receiveShadow
          position={[isX ? rightOffset : 0, 0, isX ? 0 : rightOffset]}
        >
          <boxGeometry
            args={[
              isX ? sideWidth : wallThickness,
              wallHeight,
              isX ? wallThickness : sideWidth,
            ]}
          />
          <meshStandardMaterial color={wallColor} />
        </mesh>
      </RigidBody>

      {/* Top segment above door — only if there's space */}
      {topHeight > 0.01 && (
        <RigidBody type="fixed" colliders="cuboid">
          <mesh
            castShadow
            receiveShadow
            position={[0, (doorHeight - wallHeight) / 2 + topHeight / 2, 0]}
          >
            <boxGeometry
              args={[
                isX ? doorWidth : wallThickness,
                topHeight,
                isX ? wallThickness : doorWidth,
              ]}
            />
            <meshStandardMaterial color={wallColor} />
          </mesh>
        </RigidBody>
      )}

      {/* Invisible sensor collider at doorway for transition detection */}
      <CuboidCollider
        sensor
        args={[doorWidth / 2, doorHeight / 2, 0.5]}
        position={[0, doorHeight / 2 - wallHeight / 2, 0]}
        onIntersectionEnter={onDoorwayEnter}
      />
    </group>
  );
}
