/**
 * CameraController — syncs camera FOV from useCameraStore at runtime
 *
 * Since three.js Camera FOV can be changed after creation, this
 * component listens to the store and applies FOV changes via useThree.
 * The ecctrl camera props (distance, direction, target) are applied
 * declaratively via Player.tsx re-mount.
 */

'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import type { PerspectiveCamera } from 'three';

import { useCameraStore } from '../stores/useCameraStore';

export function CameraController() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const fov = useCameraStore((s) => s.settings.fov);

  useEffect(() => {
    if (camera && 'fov' in camera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, fov]);

  return null;
}
