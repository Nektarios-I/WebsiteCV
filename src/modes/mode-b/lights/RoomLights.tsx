'use client';

/**
 * RoomLights.tsx — Warm/cool contrast lighting for Mode B
 *
 * Sprint 1: "Cozy Night-Time Developer's Dream Studio"
 * - Inline Environment (no external HDR fetch) for reflections
 * - Low ambient fill for moody baseline
 * - Cool moonlight directional (simulates window light)
 * - Warm fill from desk lamp area (supplements lamp's own light)
 * - Soft overhead bounce
 *
 * Note: The desk lamp in Room.tsx provides its own warm pointLight.
 * The LED strip provides its own purple pointLight.
 * The monitor provides its own teal pointLight.
 */

import { Environment, Lightformer } from '@react-three/drei';

export function RoomLights() {
  return (
    <>
      {/*
       * Inline environment map — built from lightformers so no network
       * request is needed. Provides IBL reflections on metal/glass surfaces.
       */}
      <Environment resolution={256} background={false}>
        {/* Dark cool ceiling bounce */}
        <Lightformer
          intensity={0.4}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 5, 0]}
          scale={[12, 12, 1]}
          color="#0a0e1a"
        />
        {/* Warm desk fill from front */}
        <Lightformer
          intensity={0.3}
          rotation={[0, Math.PI, 0]}
          position={[0, 1, 5]}
          scale={[8, 4, 1]}
          color="#1a1008"
        />
        {/* Cool window backlight */}
        <Lightformer
          intensity={0.5}
          position={[0, 1, -6]}
          scale={[8, 4, 1]}
          color="#0a1020"
        />
      </Environment>

      {/* Very low ambient — most light comes from practical sources */}
      <ambientLight intensity={0.12} color="#8899bb" />

      {/* Cool moonlight — simulates light from a window behind the desk */}
      <directionalLight
        position={[1, 5, -5]}
        intensity={0.6}
        color="#b3d4fc"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0001}
      />

      {/* Subtle warm fill from front-right — compensates for dark scene */}
      <directionalLight
        position={[3, 3, 4]}
        intensity={0.25}
        color="#ffe4c4"
      />

      {/* Overhead soft bounce — very dim, prevents total blackness */}
      <pointLight
        position={[0, 3.8, -1]}
        intensity={1.5}
        color="#ffffff"
        distance={8}
        decay={2}
      />

      {/* Rim backlight — separates objects from back wall */}
      <pointLight
        position={[0, 2.5, -4.5]}
        intensity={2}
        color="#667799"
        distance={5}
        decay={2}
      />
    </>
  );
}
