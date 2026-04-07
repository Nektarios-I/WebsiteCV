'use client';

/**
 * GalleryScene — Main R3F Canvas wrapper for Mode C
 *
 * Sets up the Canvas with:
 * - Soft shadows for museum lighting
 * - AdaptiveDpr for auto performance scaling
 * - PerformanceMonitor to degrade effects on low FPS
 * - Physics via @react-three/rapier
 * - Post-processing (Bloom + Vignette)
 * - Sparkles dust motes
 * - Suspense boundary for async loading
 * - Reduced motion support
 */

import {
  KeyboardControls,
  Environment,
  ContactShadows,
  AdaptiveDpr,
  PerformanceMonitor,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Suspense, useState, useCallback, type ReactNode } from 'react';

import { useReducedMotion } from '@/hooks';

import { KEYBOARD_MAP } from '../lib/constants';
import { CameraController } from './CameraController';
import { GalleryPostProcessing } from './GalleryPostProcessing';
import { GallerySparkles } from './GallerySparkles';

interface GallerySceneProps {
  children: ReactNode;
}

export function GalleryScene({ children }: GallerySceneProps) {
  const reducedMotion = useReducedMotion();
  const [degraded, setDegraded] = useState(false);

  const handleDecline = useCallback(() => setDegraded(true), []);
  const handleIncline = useCallback(() => setDegraded(false), []);

  // Disable effects when user prefers reduced motion OR performance is poor
  const enableEffects = !reducedMotion && !degraded;

  return (
    <KeyboardControls map={KEYBOARD_MAP}>
      <Canvas
        shadows={degraded ? false : 'soft'}
        dpr={[1, 2]}
        camera={{
          fov: 50,
          near: 0.1,
          far: 200,
          position: [0, 3, 8],
        }}
        gl={{
          antialias: !degraded,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#b8b0a4' }}
        aria-label="3D Art Gallery — use WASD to move, mouse to look around"
        role="img"
        tabIndex={0}
      >
        {/* Three.js scene background — prevents black when camera is outside geometry */}
        <color attach="background" args={['#b8b0a4']} />

        {/* Auto-adjust pixel ratio for low-end devices */}
        <AdaptiveDpr pixelated />

        {/* Monitor FPS to auto-degrade effects */}
        <PerformanceMonitor
          onDecline={handleDecline}
          onIncline={handleIncline}
          flipflops={3}
          onFallback={() => setDegraded(true)}
        />

        <Suspense fallback={null}>
          {/* Soft HDR environment — low intensity to avoid washout */}
          <Environment preset="studio" environmentIntensity={0.15} />

          {/* Soft contact shadows on the floor */}
          {!degraded && (
            <ContactShadows
              position={[0, -0.24, 0]}
              opacity={0.3}
              scale={40}
              blur={2}
              far={10}
              color="#8a8070"
            />
          )}

          {/* Camera controller — syncs FOV from camera store */}
          <CameraController />

          <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60}>
            {children}
          </Physics>

          {/* Floating dust motes */}
          <GallerySparkles enabled={enableEffects} />

          {/* Post-processing — Bloom + Vignette */}
          <GalleryPostProcessing enabled={enableEffects} />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}
