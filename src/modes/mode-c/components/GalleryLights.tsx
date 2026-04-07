'use client';

/**
 * GalleryLights — Ambient + directional lighting for the gallery
 *
 * Each room will eventually have its own lighting overrides,
 * but these provide the base illumination.
 */

export function GalleryLights() {
  return (
    <>
      {/* Ambient fill — moderate to keep detail visible */}
      <ambientLight intensity={0.3} color="#e8e0d4" />

      {/* Main directional light (skylight, from above) */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.5}
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Warm fill from opposite side */}
      <directionalLight
        position={[-8, 12, -8]}
        intensity={0.15}
        color="#fff5e6"
      />

      {/* Subtle upward bounce light for gallery feel */}
      <directionalLight
        position={[0, -2, 0]}
        intensity={0.05}
        color="#d8d0c4"
      />
    </>
  );
}
