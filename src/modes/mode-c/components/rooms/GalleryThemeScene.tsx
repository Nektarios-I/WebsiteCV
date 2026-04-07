'use client';

/**
 * GalleryThemeScene — Loads the full Theme 1 glTF scene
 *
 * Used in the Lobby to display the full "Art Gallery" model from
 * Sketchfab (denis_cliofas, CC-BY-4.0). The scene includes:
 *   - Walls, Floor, Ceiling with PBR textures
 *   - Track lighting on ceiling wires (24 spotlights)
 *   - Benches (wood + concrete base)
 *   - Lamp fixtures with emissive accents
 *   - Painting frame placeholders
 *
 * The model is centered at origin and scaled to fit the lobby.
 * Physics collision is still handled by the existing RigidBody
 * walls/floor — this component provides the VISUAL layer only.
 */

import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import type * as THREE from 'three';

const MODEL_PATH = '/models/gallery-theme/scene.gltf';

// Preload immediately
useGLTF.preload(MODEL_PATH);

interface GalleryThemeSceneProps {
  /** Uniform scale applied to the loaded scene (default: 1) */
  scale?: number;
  /** Y position offset (default: 0) */
  yOffset?: number;
  /** Whether to show paintings (can be replaced with custom content) */
  showPaintings?: boolean;
}

export function GalleryThemeScene({
  scale = 1,
  yOffset = 0,
  showPaintings = true,
}: GalleryThemeSceneProps) {
  const { scene } = useGLTF(MODEL_PATH);

  // Clone so we don't mutate the cached original
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }

      // Optionally hide paintings so we can overlay our own content
      if (
        !showPaintings &&
        child.name &&
        (child.name.includes('Paiting') || child.name.includes('Painting'))
      ) {
        child.visible = false;
      }
    });

    return clone;
  }, [scene, showPaintings]);

  return (
    <group position={[0, yOffset, 0]} scale={[scale, scale, scale]}>
      <primitive object={clonedScene} />
    </group>
  );
}
