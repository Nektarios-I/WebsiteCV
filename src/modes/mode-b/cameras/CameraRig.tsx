'use client';

/**
 * CameraRig.tsx — Camera controls for Mode B
 *
 * Uses drei's OrbitControls with constraints to:
 * - Allow orbiting within reasonable bounds
 * - Enable smooth damping for natural feel
 * - Limit zoom range to keep scene in view
 * - Integrates with camera transition system
 */

import { OrbitControls } from '@react-three/drei';

import { useCameraTransition } from '../hooks/useCameraTransition';
import { useModeBStore } from '../store/useModeBStore';

export function CameraRig() {
  const { cameraTarget, isTransitioning } = useModeBStore();

  // Use camera transition hook for smooth camera movement
  useCameraTransition({ speed: 0.08 });

  return (
    <OrbitControls
      // Disable during camera transitions for smooth animation
      enabled={!isTransitioning}
      // Set target to follow camera transitions
      target={cameraTarget.target}
      // Vertical angle constraints
      minPolarAngle={Math.PI / 5} // ~36 degrees from top
      maxPolarAngle={Math.PI / 2.1} // ~86 degrees, near horizon
      // Horizontal angle constraints
      minAzimuthAngle={-Math.PI / 2.5} // ~-72 degrees
      maxAzimuthAngle={Math.PI / 2.5} // ~+72 degrees
      // Distance constraints
      minDistance={2}
      maxDistance={8}
      // Smooth damping
      enableDamping
      dampingFactor={0.05}
      // Disable panning for cleaner UX
      enablePan={false}
      // Smooth zoom
      zoomSpeed={0.5}
    />
  );
}
