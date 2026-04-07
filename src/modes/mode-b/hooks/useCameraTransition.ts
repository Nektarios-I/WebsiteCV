'use client';

/**
 * useCameraTransition — Hook for smooth camera transitions
 *
 * Uses useFrame to lerp camera position and target
 * when the store's cameraTarget changes.
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

import { useModeBStore } from '../store/useModeBStore';

interface UseCameraTransitionOptions {
  /** Lerp speed (0-1, higher = faster) */
  speed?: number;
  /** Distance threshold to consider transition complete */
  threshold?: number;
}

export function useCameraTransition(options: UseCameraTransitionOptions = {}) {
  const { speed = 0.05, threshold = 0.01 } = options;

  const { camera } = useThree();
  const { cameraTarget, isTransitioning, setIsTransitioning } = useModeBStore();

  const targetPosition = useRef(new THREE.Vector3(...cameraTarget.position));
  const targetLookAt = useRef(new THREE.Vector3(...cameraTarget.target));
  const currentLookAt = useRef(new THREE.Vector3());

  // Update target refs when store changes
  useEffect(() => {
    targetPosition.current.set(...cameraTarget.position);
    targetLookAt.current.set(...cameraTarget.target);
    setIsTransitioning(true);
  }, [cameraTarget, setIsTransitioning]);

  // Animate camera on each frame
  useFrame(() => {
    if (!isTransitioning) return;

    // Lerp position
    camera.position.lerp(targetPosition.current, speed);

    // Lerp look-at target
    currentLookAt.current.lerp(targetLookAt.current, speed);
    camera.lookAt(currentLookAt.current);

    // Check if transition is complete
    const positionDist = camera.position.distanceTo(targetPosition.current);
    const lookAtDist = currentLookAt.current.distanceTo(targetLookAt.current);

    if (positionDist < threshold && lookAtDist < threshold) {
      setIsTransitioning(false);
    }
  });

  return { isTransitioning };
}
