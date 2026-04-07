'use client';

/**
 * Player — Third-person character controller for the Gallery
 *
 * Wraps ecctrl (floating capsule controller) with our tuned props
 * for grounded, responsive movement with a drone-like camera.
 *
 * SpawnGuard: On every render the player's Y position is read from
 * the ecctrl ref. If it has dropped below SPAWN_GUARD_MIN_Y the
 * component schedules a teleport back to the room's spawn point
 * on the NEXT frame (via requestAnimationFrame) to avoid mutating
 * the Rapier world while it is mid-step.
 */

import Ecctrl from 'ecctrl';
import type { CustomEcctrlRigidBody } from 'ecctrl';
import { useRef, useCallback, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import {
  PLAYER_CONFIG,
  SPAWN_POSITIONS,
  SPAWN_GUARD_MIN_Y,
  SPAWN_GUARD_GRACE_FRAMES,
} from '../../lib/constants';
import { useCameraStore } from '../../stores/useCameraStore';
import { useGalleryStore } from '../../stores/useGalleryStore';
import { RobotCharacter } from '../character/RobotCharacter';

/**
 * SpawnGuard — reads player Y each frame (after physics) and
 * schedules a safe reset if the player has fallen through the floor.
 *
 * The actual teleport is deferred to a rAF callback so we never
 * mutate the Rapier world while it is being stepped (which would
 * cause "recursive use" / "took ownership while borrowed" WASM panics).
 */
function SpawnGuard({
  ecctrlRef,
  spawn,
}: {
  ecctrlRef: React.RefObject<CustomEcctrlRigidBody | null>;
  spawn: [number, number, number];
}) {
  const frameCount = useRef(0);
  const needsReset = useRef(false);

  // Deferred reset — runs outside the physics step
  const doReset = useCallback(() => {
    const rb = ecctrlRef.current?.group;
    if (!rb) return;
    try {
      rb.setTranslation({ x: spawn[0], y: spawn[1], z: spawn[2] }, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
    } catch {
      // Rapier body may already be freed during room transition — safe to ignore
    }
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[SpawnGuard] Reset player to spawn [${spawn}]`);
    }
    needsReset.current = false;
  }, [ecctrlRef, spawn]);

  // Check position each frame but only FLAG a reset — don't mutate physics
  useFrame(() => {
    frameCount.current += 1;
    if (frameCount.current < SPAWN_GUARD_GRACE_FRAMES) return;

    const rb = ecctrlRef.current?.group;
    if (!rb) return;

    try {
      const pos = rb.translation();
      if (pos.y < SPAWN_GUARD_MIN_Y && !needsReset.current) {
        needsReset.current = true;
      }
    } catch {
      // Body not ready yet — ignore
    }
  });

  // Process the deferred reset outside the physics step
  useEffect(() => {
    let rafId: number;
    const tick = () => {
      if (needsReset.current) doReset();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [doReset]);

  return null;
}

export function Player() {
  const currentRoom = useGalleryStore((s) => s.currentRoom);
  const spawn = SPAWN_POSITIONS[currentRoom];

  // Camera settings from the camera store (preset or custom)
  const cam = useCameraStore((s) => s.settings);
  const activePreset = useCameraStore((s) => s.activePreset);

  const ecctrlRef = useRef<CustomEcctrlRigidBody>(null);

  return (
    <Ecctrl
      ref={ecctrlRef}
      // Key forces remount when room or camera preset changes
      key={`player-${currentRoom}-${activePreset}-${cam.camInitDis}`}
      // Position — spawn in current room
      position={spawn}
      // Capsule dimensions
      capsuleHalfHeight={PLAYER_CONFIG.capsuleHalfHeight}
      capsuleRadius={PLAYER_CONFIG.capsuleRadius}
      floatHeight={PLAYER_CONFIG.floatHeight}
      // Movement — grounded, responsive feel
      maxVelLimit={PLAYER_CONFIG.maxVelLimit}
      turnSpeed={PLAYER_CONFIG.turnSpeed}
      sprintMult={PLAYER_CONFIG.sprintMult}
      dragDampingC={PLAYER_CONFIG.dragDampingC}
      accDeltaTime={PLAYER_CONFIG.accDeltaTime}
      // Floating spring — planted on ground
      springK={PLAYER_CONFIG.springK}
      dampingC={PLAYER_CONFIG.dampingC}
      // Gravity — fall faster, less floaty
      fallingGravityScale={PLAYER_CONFIG.fallingGravityScale}
      // Camera — from camera preset store
      camInitDis={cam.camInitDis}
      camMaxDis={cam.camMaxDis}
      camMinDis={cam.camMinDis}
      camInitDir={cam.camInitDir}
      camTargetPos={cam.camTargetPos}
      camFollowMult={PLAYER_CONFIG.camFollowMult}
      camLerpMult={PLAYER_CONFIG.camLerpMult}
      // Camera collision with walls
      camCollision={true}
      camCollisionOffset={0.7}
      // Jump tuning — lower, more grounded
      jumpVel={3}
      jumpForceToGroundMult={5}
      // Auto-balance OFF so ecctrl rotates the model group to
      // face the movement direction (walk/turn rotation)
      autoBalance={false}
      // Animations ON — ecctrl updates useGame().curAnimation
      // which RobotCharacter reads for clip crossfading
      animated={true}
    >
      {/* Spawn guard — teleports player back if they fall through the floor */}
      <SpawnGuard ecctrlRef={ecctrlRef} spawn={spawn} />

      {/* Robot model — positioned to align feet with capsule bottom */}
      <group position={[0, -0.5, 0]}>
        <RobotCharacter />
      </group>
    </Ecctrl>
  );
}
