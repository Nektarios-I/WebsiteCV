'use client';

/**
 * RobotNPC — Static non-player robot viewer for lobby decoration
 *
 * Loads the same Robot.fbx as the player character but:
 * - Clones the skeleton properly (SkeletonUtils)
 * - Overrides all mesh materials with a custom body color
 * - Plays a single looping animation (idle, sitting, wave, etc.)
 * - Is NOT interactive / controllable
 *
 * Used in groups inside the lobby to simulate gallery visitors.
 */

import { useFBX, useAnimations } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';

/** Friendly pose name → FBX clip name */
const POSE_CLIPS: Record<string, string> = {
  idle: 'RobotArmature|Robot_Idle',
  sitting: 'RobotArmature|Robot_Sitting',
  wave: 'RobotArmature|Robot_Wave',
  thumbsup: 'RobotArmature|Robot_ThumbsUp',
  yes: 'RobotArmature|Robot_Yes',
  dance: 'RobotArmature|Robot_Dance',
  idle2: 'RobotArmature|Robot_IdleHH2',
};

export type RobotPose = keyof typeof POSE_CLIPS;

interface RobotNPCProps {
  position: [number, number, number];
  /** Y-axis rotation in radians (which direction the robot faces) */
  rotation?: number;
  /** Body color — any CSS color string */
  color: string;
  /** Animation pose to hold (default: idle) */
  pose?: RobotPose;
  /** Scale multiplier (default matches player: 0.0012) */
  scale?: number;
}

/** Scale matching the player's RobotCharacter */
const NPC_SCALE = 0.0012;

// Preload shares cache with RobotCharacter
useFBX.preload('/models/Robot.fbx');

export function RobotNPC({
  position,
  rotation = 0,
  color,
  pose = 'idle',
  scale = NPC_SCALE,
}: RobotNPCProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fbx = useFBX('/models/Robot.fbx');

  // Clone skeleton & override material color
  const { scene: clonedScene, animations } = useMemo(() => {
    const cloned = cloneSkeleton(fbx) as THREE.Group;
    const bodyColor = new THREE.Color(color);

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // Clone material so we don't mutate shared references
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => {
            const mat = (m as THREE.MeshStandardMaterial).clone();
            mat.color.copy(bodyColor);
            return mat;
          });
        } else {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.color.copy(bodyColor);
          mesh.material = mat;
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return { scene: cloned, animations: fbx.animations };
  }, [fbx, color]);

  // Setup animation on the cloned skeleton
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    const clipName: string = POSE_CLIPS[pose] ?? POSE_CLIPS.idle ?? '';
    if (!clipName) return;
    const action = actions[clipName];
    if (action) {
      action.reset().fadeIn(0.1).play();
    }
  }, [actions, pose]);

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      <primitive object={clonedScene} scale={scale} />
    </group>
  );
}
