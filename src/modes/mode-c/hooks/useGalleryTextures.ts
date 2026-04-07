'use client';

/**
 * useGalleryTextures — Loads PBR texture sets from Theme 1
 *
 * Returns texture maps for floor, walls, ceiling from the gallery
 * theme pack. Each set includes baseColor, normal, and
 * metallicRoughness maps.
 *
 * Used by RoomShell and individual rooms to apply professional
 * PBR materials instead of flat colors on their surfaces.
 *
 * Textures are loaded from /models/gallery-theme/textures/.
 */

import { useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

const BASE = '/models/gallery-theme/textures';

/** Texture set for a surface (baseColor + normal + metallicRoughness) */
export interface PBRTextureSet {
  map: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
  /** The combined metallic(B)+roughness(G) map */
  metalnessMap: THREE.Texture;
}

// Preload all textures
useTexture.preload(`${BASE}/Floor_baseColor.png`);
useTexture.preload(`${BASE}/Floor_normal.png`);
useTexture.preload(`${BASE}/Floor_metallicRoughness.png`);
useTexture.preload(`${BASE}/Walls_baseColor.png`);
useTexture.preload(`${BASE}/Walls_normal.png`);
useTexture.preload(`${BASE}/Walls_metallicRoughness.png`);
useTexture.preload(`${BASE}/Ceilling_baseColor.png`);
useTexture.preload(`${BASE}/Ceilling_normal.png`);
useTexture.preload(`${BASE}/Ceilling_metallicRoughness.png`);

/**
 * Configure texture for tiling on room surfaces.
 * Sets wrapping to RepeatWrapping and adjusts repeat based on room size.
 */
function configureTexture(
  tex: THREE.Texture,
  repeatX: number,
  repeatY: number,
) {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  // Ensure anisotropic filtering for quality at oblique angles
  tex.anisotropy = 8;
  return tex;
}

export interface GalleryTexturesResult {
  floor: PBRTextureSet;
  walls: PBRTextureSet;
  ceiling: PBRTextureSet;
}

/**
 * Hook that loads the gallery PBR textures and configures them
 * for tiling on room surfaces.
 *
 * @param roomWidth  Room width (X axis) for repeat calculation
 * @param roomDepth  Room depth (Z axis) for repeat calculation
 * @param roomHeight Room height (Y axis) for wall repeat
 * @param tilesPerUnit How many texture repeats per world unit (default 0.25)
 */
export function useGalleryTextures(
  roomWidth: number,
  roomDepth: number,
  roomHeight: number,
  tilesPerUnit = 0.25,
): GalleryTexturesResult {
  // Load all textures (suspends until ready)
  const floorBase = useTexture(`${BASE}/Floor_baseColor.png`);
  const floorNormal = useTexture(`${BASE}/Floor_normal.png`);
  const floorMR = useTexture(`${BASE}/Floor_metallicRoughness.png`);

  const wallsBase = useTexture(`${BASE}/Walls_baseColor.png`);
  const wallsNormal = useTexture(`${BASE}/Walls_normal.png`);
  const wallsMR = useTexture(`${BASE}/Walls_metallicRoughness.png`);

  const ceilBase = useTexture(`${BASE}/Ceilling_baseColor.png`);
  const ceilNormal = useTexture(`${BASE}/Ceilling_normal.png`);
  const ceilMR = useTexture(`${BASE}/Ceilling_metallicRoughness.png`);

  return useMemo(() => {
    // Floor tiles across width × depth
    const floorRepX = roomWidth * tilesPerUnit;
    const floorRepZ = roomDepth * tilesPerUnit;

    // Wall tiles: room width × height for N/S, depth × height for E/W
    // We use the larger dimension for a reasonable average
    const wallRepX = Math.max(roomWidth, roomDepth) * tilesPerUnit;
    const wallRepY = roomHeight * tilesPerUnit;

    // Ceiling same as floor
    const ceilRepX = roomWidth * tilesPerUnit;
    const ceilRepZ = roomDepth * tilesPerUnit;

    return {
      floor: {
        map: configureTexture(floorBase.clone(), floorRepX, floorRepZ),
        normalMap: configureTexture(floorNormal.clone(), floorRepX, floorRepZ),
        roughnessMap: configureTexture(floorMR.clone(), floorRepX, floorRepZ),
        metalnessMap: configureTexture(floorMR.clone(), floorRepX, floorRepZ),
      },
      walls: {
        map: configureTexture(wallsBase.clone(), wallRepX, wallRepY),
        normalMap: configureTexture(wallsNormal.clone(), wallRepX, wallRepY),
        roughnessMap: configureTexture(wallsMR.clone(), wallRepX, wallRepY),
        metalnessMap: configureTexture(wallsMR.clone(), wallRepX, wallRepY),
      },
      ceiling: {
        map: configureTexture(ceilBase.clone(), ceilRepX, ceilRepZ),
        normalMap: configureTexture(ceilNormal.clone(), ceilRepX, ceilRepZ),
        roughnessMap: configureTexture(ceilMR.clone(), ceilRepX, ceilRepZ),
        metalnessMap: configureTexture(ceilMR.clone(), ceilRepX, ceilRepZ),
      },
    };
  }, [
    roomWidth,
    roomDepth,
    roomHeight,
    tilesPerUnit,
    floorBase,
    floorNormal,
    floorMR,
    wallsBase,
    wallsNormal,
    wallsMR,
    ceilBase,
    ceilNormal,
    ceilMR,
  ]);
}
