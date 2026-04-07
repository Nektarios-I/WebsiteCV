'use client';

/**
 * Scene.tsx — Main R3F Canvas wrapper for Mode B
 *
 * Sets up the Canvas with:
 * - PCF soft shadows for realistic lighting
 * - DPR clamping for performance
 * - Suspense boundary for async loading states
 */

import { Suspense, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';

interface SceneProps {
  children: ReactNode;
}

export function Scene({ children }: SceneProps) {
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      camera={{
        fov: 45,
        near: 0.1,
        far: 100,
        position: [0, 2, 5],
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      style={{ background: '#0a0a0a' }}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}
