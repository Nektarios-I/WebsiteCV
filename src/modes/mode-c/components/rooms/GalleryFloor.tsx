'use client';

/**
 * GalleryFloor — Tiled floor with patterns for museum rooms
 *
 * Renders a grid of tile meshes on top of the physics floor slab,
 * with configurable patterns:
 *
 * - "checkerboard"  — alternating light/dark tiles (classic gallery)
 * - "herringbone"   — diagonal brick pattern
 * - "diamond"       — rotated square tiles with accent border
 * - "marble-grid"   — large tiles with thin grout lines
 * - "parquet"       — warm wood-tone alternating rectangles
 *
 * Also renders:
 * - Border/trim row around the perimeter
 * - Thin grout lines between tiles (via gaps)
 *
 * All geometry is simple boxGeometry — no textures needed,
 * the visual depth comes from color variation + slight height offset.
 */

import { useMemo } from 'react';

export type FloorPattern =
  | 'checkerboard'
  | 'herringbone'
  | 'diamond'
  | 'marble-grid'
  | 'parquet'
  | 'triangle';

export interface GalleryFloorProps {
  /** Room width (X) */
  width: number;
  /** Room depth (Z) */
  depth: number;
  /** Floor pattern type */
  pattern: FloorPattern;
  /** Primary tile color (lighter) */
  tileColor1: string;
  /** Secondary tile color (darker or accent) */
  tileColor2: string;
  /** Border/trim color */
  borderColor: string;
  /** Tile size in units (default 2) */
  tileSize?: number;
  /** Material roughness (default 0.35) */
  roughness?: number;
}

interface TileData {
  x: number;
  z: number;
  color: string;
  scaleX: number;
  scaleZ: number;
  rotY: number;
  /** When 'triangle', render cylinderGeometry(3) instead of box */
  shape?: 'triangle';
}

export function GalleryFloor({
  width,
  depth,
  pattern,
  tileColor1,
  tileColor2,
  borderColor,
  tileSize = 2,
  roughness = 0.35,
}: GalleryFloorProps) {
  const tiles = useMemo(
    () =>
      generateTiles(width, depth, pattern, tileColor1, tileColor2, tileSize),
    [width, depth, pattern, tileColor1, tileColor2, tileSize],
  );

  const borderTiles = useMemo(
    () => generateBorder(width, depth, borderColor, tileSize),
    [width, depth, borderColor, tileSize],
  );

  const groutGap = 0.04;
  const tileHeight = 0.06;
  const borderHeight = 0.08;
  const yPos = 0.02; // sit above the physics floor slab

  return (
    <group position={[0, yPos, 0]}>
      {/* Main tiles */}
      {tiles.map((tile, i) => (
        <mesh
          key={`t-${i}`}
          position={[tile.x, tileHeight / 2, tile.z]}
          rotation={[0, tile.rotY, 0]}
          receiveShadow
        >
          {tile.shape === 'triangle' ? (
            <cylinderGeometry
              args={[tile.scaleX, tile.scaleX, tileHeight, 3]}
            />
          ) : (
            <boxGeometry
              args={[
                tile.scaleX - groutGap,
                tileHeight,
                tile.scaleZ - groutGap,
              ]}
            />
          )}
          <meshStandardMaterial
            color={tile.color}
            roughness={roughness}
            metalness={0.02}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>
      ))}

      {/* Border trim */}
      {borderTiles.map((tile, i) => (
        <mesh
          key={`b-${i}`}
          position={[tile.x, borderHeight / 2, tile.z]}
          receiveShadow
        >
          <boxGeometry
            args={[
              tile.scaleX - groutGap,
              borderHeight,
              tile.scaleZ - groutGap,
            ]}
          />
          <meshStandardMaterial
            color={tile.color}
            roughness={roughness * 0.8}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>
      ))}

      {/* Grout base — thin dark layer under all tiles */}
      <mesh position={[0, -0.005, 0]} receiveShadow>
        <boxGeometry args={[width - 0.1, 0.01, depth - 0.1]} />
        <meshStandardMaterial color="#4a4540" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Tile generation functions                                          */
/* ------------------------------------------------------------------ */

function generateTiles(
  width: number,
  depth: number,
  pattern: FloorPattern,
  color1: string,
  color2: string,
  tileSize: number,
): TileData[] {
  switch (pattern) {
    case 'checkerboard':
      return generateCheckerboard(width, depth, color1, color2, tileSize);
    case 'herringbone':
      return generateHerringbone(width, depth, color1, color2, tileSize);
    case 'diamond':
      return generateDiamond(width, depth, color1, color2, tileSize);
    case 'marble-grid':
      return generateMarbleGrid(width, depth, color1, color2, tileSize);
    case 'parquet':
      return generateParquet(width, depth, color1, color2, tileSize);
    case 'triangle':
      return generateTriangles(width, depth, color1, color2, tileSize);
    default:
      return generateCheckerboard(width, depth, color1, color2, tileSize);
  }
}

/** Classic alternating light/dark squares */
function generateCheckerboard(
  w: number,
  d: number,
  c1: string,
  c2: string,
  size: number,
): TileData[] {
  const tiles: TileData[] = [];
  const innerW = w - size; // leave room for border
  const innerD = d - size;
  const cols = Math.floor(innerW / size);
  const rows = Math.floor(innerD / size);
  const startX = -(cols * size) / 2 + size / 2;
  const startZ = -(rows * size) / 2 + size / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      tiles.push({
        x: startX + col * size,
        z: startZ + row * size,
        color: (row + col) % 2 === 0 ? c1 : c2,
        scaleX: size,
        scaleZ: size,
        rotY: 0,
      });
    }
  }
  return tiles;
}

/** Diagonal brick — rectangular tiles laid at 45° angles */
function generateHerringbone(
  w: number,
  d: number,
  c1: string,
  c2: string,
  size: number,
): TileData[] {
  const tiles: TileData[] = [];
  const tileW = size;
  const tileH = size * 0.5;
  const halfW = (w - size) / 2;
  const halfD = (d - size) / 2;
  const step = tileH * 0.7; // diagonal step

  let idx = 0;
  for (let z = -halfD; z < halfD; z += step) {
    for (let x = -halfW; x < halfW; x += step) {
      const isEven = idx % 2 === 0;
      tiles.push({
        x,
        z,
        color: isEven ? c1 : c2,
        scaleX: isEven ? tileW : tileH,
        scaleZ: isEven ? tileH : tileW,
        rotY: 0,
      });
      idx++;
    }
    idx++; // offset row alternation
  }
  return tiles;
}

/** Diamond pattern — squares rotated 45° with contrasting center */
function generateDiamond(
  w: number,
  d: number,
  c1: string,
  c2: string,
  size: number,
): TileData[] {
  const tiles: TileData[] = [];
  const innerW = w - size;
  const innerD = d - size;
  const dSize = size * 0.85;
  const step = dSize * 0.707; // √2/2 for rotated squares
  const halfW = innerW / 2;
  const halfD = innerD / 2;

  let rowIdx = 0;
  for (let z = -halfD; z < halfD; z += step) {
    let colIdx = 0;
    for (let x = -halfW; x < halfW; x += step) {
      tiles.push({
        x,
        z,
        color: (rowIdx + colIdx) % 3 === 0 ? c2 : c1,
        scaleX: dSize,
        scaleZ: dSize,
        rotY: Math.PI / 4,
      });
      colIdx++;
    }
    rowIdx++;
  }
  return tiles;
}

/** Large marble-like tiles with visible grout joints */
function generateMarbleGrid(
  w: number,
  d: number,
  c1: string,
  c2: string,
  size: number,
): TileData[] {
  const tiles: TileData[] = [];
  const bigSize = size * 1.5;
  const innerW = w - size;
  const innerD = d - size;
  const cols = Math.floor(innerW / bigSize);
  const rows = Math.floor(innerD / bigSize);
  const startX = -(cols * bigSize) / 2 + bigSize / 2;
  const startZ = -(rows * bigSize) / 2 + bigSize / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Subtle color variation — every 3rd tile is the accent color
      const isAccent = (row * cols + col) % 5 === 0;
      tiles.push({
        x: startX + col * bigSize,
        z: startZ + row * bigSize,
        color: isAccent ? c2 : c1,
        scaleX: bigSize,
        scaleZ: bigSize,
        rotY: 0,
      });
    }
  }
  return tiles;
}

/** Parquet-style — alternating rectangular tiles in groups */
function generateParquet(
  w: number,
  d: number,
  c1: string,
  c2: string,
  size: number,
): TileData[] {
  const tiles: TileData[] = [];
  const plankW = size * 0.5;
  const plankD = size;
  const innerW = w - size;
  const innerD = d - size;
  const halfW = innerW / 2;
  const halfD = innerD / 2;

  let blockRow = 0;
  for (let z = -halfD; z < halfD; z += plankD) {
    let blockCol = 0;
    for (let x = -halfW; x < halfW; x += plankD) {
      const isHorizontal = (blockRow + blockCol) % 2 === 0;
      // Each block has 2 planks
      for (let p = 0; p < 2; p++) {
        const offsetX = isHorizontal ? 0 : (p - 0.5) * plankW;
        const offsetZ = isHorizontal ? (p - 0.5) * plankW : 0;
        tiles.push({
          x: x + plankD / 2 + offsetX,
          z: z + plankD / 2 + offsetZ,
          color: p === 0 ? c1 : c2,
          scaleX: isHorizontal ? plankD : plankW,
          scaleZ: isHorizontal ? plankW : plankD,
          rotY: 0,
        });
      }
      blockCol++;
    }
    blockRow++;
  }
  return tiles;
}

/** Equilateral triangle mosaic — alternating up/down triangles */
function generateTriangles(
  w: number,
  d: number,
  c1: string,
  c2: string,
  size: number,
): TileData[] {
  const tiles: TileData[] = [];
  const s = size;
  const triH = (s * Math.sqrt(3)) / 2; // height of equilateral triangle
  const R = (s / Math.sqrt(3)) * 0.92; // circumradius, 8 % smaller for grout gap

  const margin = size * 0.55;
  const halfW = w / 2 - margin;
  const halfD = d / 2 - margin;

  const cols = Math.floor((2 * halfW) / (s / 2));
  const rows = Math.floor((2 * halfD) / triH);
  const ofsX = -(cols * (s / 2)) / 2 + s / 4;
  const ofsZ = -(rows * triH) / 2 + triH / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isUp = (r + c) % 2 === 0;
      tiles.push({
        x: ofsX + c * (s / 2),
        z: ofsZ + r * triH + (isUp ? -triH / 6 : triH / 6),
        color: (r * cols + c) % 3 === 0 ? c2 : c1,
        scaleX: R,
        scaleZ: R,
        rotY: isUp ? 0 : Math.PI,
        shape: 'triangle' as const,
      });
    }
  }
  return tiles;
}

/** Border/trim tiles around the room perimeter */
function generateBorder(
  w: number,
  d: number,
  color: string,
  tileSize: number,
): TileData[] {
  const tiles: TileData[] = [];
  const borderW = tileSize * 0.4;
  const halfW = w / 2 - borderW / 2;
  const halfD = d / 2 - borderW / 2;

  // Generate border along all 4 edges
  const stepSize = tileSize * 0.8;

  // North & South edges
  for (let x = -halfW + borderW; x < halfW - borderW; x += stepSize) {
    tiles.push({
      x,
      z: -halfD,
      color,
      scaleX: stepSize,
      scaleZ: borderW,
      rotY: 0,
    });
    tiles.push({
      x,
      z: halfD,
      color,
      scaleX: stepSize,
      scaleZ: borderW,
      rotY: 0,
    });
  }

  // West & East edges
  for (let z = -halfD + borderW; z < halfD - borderW; z += stepSize) {
    tiles.push({
      x: -halfW,
      z,
      color,
      scaleX: borderW,
      scaleZ: stepSize,
      rotY: 0,
    });
    tiles.push({
      x: halfW,
      z,
      color,
      scaleX: borderW,
      scaleZ: stepSize,
      rotY: 0,
    });
  }

  // 4 corner pieces
  const corners: [number, number][] = [
    [-halfW, -halfD],
    [halfW, -halfD],
    [-halfW, halfD],
    [halfW, halfD],
  ];
  for (const [cx, cz] of corners) {
    tiles.push({
      x: cx,
      z: cz,
      color,
      scaleX: borderW,
      scaleZ: borderW,
      rotY: 0,
    });
  }

  return tiles;
}
