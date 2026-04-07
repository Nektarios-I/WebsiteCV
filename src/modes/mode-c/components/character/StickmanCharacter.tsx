'use client';

/**
 * StickmanCharacter — Abstract cartoony "bean person" mesh
 *
 * A genderless, abstract, friendly character built from basic
 * Three.js geometry. Think "Human: Fall Flat" meets a gallery mascot.
 *
 * Features:
 * - Large round head with dot eyes and gentle smile
 * - Smooth capsule body — no gendered features
 * - Simple rounded limbs
 * - Neutral white/cream palette with a colored accent
 * - Bouncy walk animation synced to ecctrl movement state
 * - Idle: gentle breathing bob + arm sway
 *
 * Reads ecctrl's useGame store to detect movement state.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGame } from 'ecctrl';
import type * as THREE from 'three';

/** Color palette — neutral, abstract, gallery-friendly */
const COLORS = {
  body: '#e8ddd0', // Warm cream (visible against dark gallery walls)
  accent: '#4a8ab8', // Stronger blue accent
  eyes: '#2a2622', // Dark warm
  smile: '#2a2622', // Dark warm
  shoes: '#8a7a6a', // Dark tan
  cheeks: '#e0a090', // Warm blush
} as const;

export function StickmanCharacter() {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);

  const curAnimation = useGame((state) => state.curAnimation);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const isMoving = curAnimation === 'walk' || curAnimation === 'run';
    const isRunning = curAnimation === 'run';
    const speed = isRunning ? 14 : 10;
    const limbSwing = isMoving ? (isRunning ? 0.7 : 0.5) : 0;
    const bobAmount = isMoving ? 0.06 : 0.015;
    const bobSpeed = isMoving ? speed : 2;

    // Body bob (up/down) — more bounce when walking
    if (bodyRef.current) {
      bodyRef.current.position.y =
        Math.abs(Math.sin(time * bobSpeed)) * bobAmount;
    }

    // Head slight tilt for personality
    if (headRef.current) {
      headRef.current.rotation.z = isMoving
        ? Math.sin(time * speed * 0.5) * 0.04
        : Math.sin(time * 1.2) * 0.03;
      // Subtle look-around when idle
      if (!isMoving) {
        headRef.current.rotation.y = Math.sin(time * 0.5) * 0.08;
      } else {
        headRef.current.rotation.y = 0;
      }
    }

    // Arm swing — opposite to legs for natural walk
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(time * speed) * limbSwing;
      rightArmRef.current.rotation.x = -Math.sin(time * speed) * limbSwing;
      // Idle: gentle pendulum sway
      if (!isMoving) {
        leftArmRef.current.rotation.z = Math.sin(time * 1.5) * 0.05 + 0.08;
        rightArmRef.current.rotation.z =
          -Math.sin(time * 1.5) * 0.05 - 0.08;
        leftArmRef.current.rotation.x = Math.sin(time * 0.8) * 0.03;
        rightArmRef.current.rotation.x = -Math.sin(time * 0.8) * 0.03;
      } else {
        leftArmRef.current.rotation.z = 0.08;
        rightArmRef.current.rotation.z = -0.08;
      }
    }

    // Leg swing — drives the walking motion
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = -Math.sin(time * speed) * limbSwing;
      rightLegRef.current.rotation.x = Math.sin(time * speed) * limbSwing;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={bodyRef}>
        {/* === HEAD === */}
        {/* Large round head — bean/marshmallow shape */}
        <mesh ref={headRef} position={[0, 0.88, 0]} castShadow>
          <sphereGeometry args={[0.24, 20, 20]} />
          <meshStandardMaterial
            color={COLORS.body}
            roughness={0.6}
            metalness={0}
          />
        </mesh>

        {/* Left eye — simple dot */}
        <mesh position={[-0.08, 0.92, 0.2]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color={COLORS.eyes} roughness={0.8} />
        </mesh>

        {/* Right eye — simple dot */}
        <mesh position={[0.08, 0.92, 0.2]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color={COLORS.eyes} roughness={0.8} />
        </mesh>

        {/* Smile — gentle arc */}
        <mesh position={[0, 0.83, 0.22]} rotation={[0.1, 0, 0]}>
          <torusGeometry args={[0.06, 0.012, 8, 12, Math.PI]} />
          <meshStandardMaterial color={COLORS.smile} roughness={0.8} />
        </mesh>

        {/* Subtle cheek blush — left */}
        <mesh position={[-0.15, 0.86, 0.17]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial
            color={COLORS.cheeks}
            transparent
            opacity={0.4}
            roughness={1}
          />
        </mesh>

        {/* Subtle cheek blush — right */}
        <mesh position={[0.15, 0.86, 0.17]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial
            color={COLORS.cheeks}
            transparent
            opacity={0.4}
            roughness={1}
          />
        </mesh>

        {/* === TORSO === */}
        {/* Rounded bean-shaped body */}
        <mesh position={[0, 0.48, 0]} castShadow>
          <capsuleGeometry args={[0.14, 0.28, 10, 20]} />
          <meshStandardMaterial
            color={COLORS.accent}
            roughness={0.5}
            metalness={0.05}
          />
        </mesh>

        {/* === ARMS === */}
        {/* Left arm (pivot at shoulder) */}
        <group ref={leftArmRef} position={[-0.22, 0.6, 0]}>
          {/* Arm */}
          <mesh position={[0, -0.13, 0]} castShadow>
            <capsuleGeometry args={[0.04, 0.18, 8, 12]} />
            <meshStandardMaterial
              color={COLORS.body}
              roughness={0.6}
              metalness={0}
            />
          </mesh>
          {/* Round hand */}
          <mesh position={[0, -0.28, 0]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial
              color={COLORS.body}
              roughness={0.6}
              metalness={0}
            />
          </mesh>
        </group>

        {/* Right arm (pivot at shoulder) */}
        <group ref={rightArmRef} position={[0.22, 0.6, 0]}>
          <mesh position={[0, -0.13, 0]} castShadow>
            <capsuleGeometry args={[0.04, 0.18, 8, 12]} />
            <meshStandardMaterial
              color={COLORS.body}
              roughness={0.6}
              metalness={0}
            />
          </mesh>
          <mesh position={[0, -0.28, 0]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial
              color={COLORS.body}
              roughness={0.6}
              metalness={0}
            />
          </mesh>
        </group>

        {/* === LEGS === */}
        {/* Left leg (pivot at hip) */}
        <group ref={leftLegRef} position={[-0.08, 0.24, 0]}>
          <mesh position={[0, -0.14, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.2, 8, 12]} />
            <meshStandardMaterial
              color={COLORS.body}
              roughness={0.6}
              metalness={0}
            />
          </mesh>
          {/* Round foot */}
          <mesh position={[0, -0.31, 0.02]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial
              color={COLORS.shoes}
              roughness={0.5}
              metalness={0}
            />
          </mesh>
        </group>

        {/* Right leg (pivot at hip) */}
        <group ref={rightLegRef} position={[0.08, 0.24, 0]}>
          <mesh position={[0, -0.14, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.2, 8, 12]} />
            <meshStandardMaterial
              color={COLORS.body}
              roughness={0.6}
              metalness={0}
            />
          </mesh>
          <mesh position={[0, -0.31, 0.02]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial
              color={COLORS.shoes}
              roughness={0.5}
              metalness={0}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
