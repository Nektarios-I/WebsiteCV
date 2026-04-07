'use client';

/**
 * WallPattern — Decorative wall-surface overlay for gallery rooms
 *
 * Renders a classic two-zone wall treatment:
 *
 *  ┌──────────────────────────────────────┐  ceiling
 *  │  Upper zone — geometric medallion    │
 *  │  pattern (octagon + diamond grid)    │
 *  │                                      │
 *  ├──────────────────────────────────────┤  dado rail
 *  │  Lower zone — raised rectangular    │
 *  │  wainscoting panels                  │
 *  └──────────────────────────────────────┘  floor
 *
 * Place directly on top of a wall surface. The component is flat
 * (very thin box meshes that sit ~0.02 off the wall face).
 *
 * orientation:
 *   'north' → pattern on wall at z = −depth/2, faces +Z
 *   'south' → pattern on wall at z = +depth/2, faces −Z
 *   'west'  → pattern on wall at x = −width/2, faces +X
 *   'east'  → pattern on wall at x = +width/2, faces −X
 *
 * The component automatically skips a doorway gap in the centre
 * if `doorGap` is provided (width of the opening).
 */

import { useMemo } from 'react';

/* ── Colours ────────────────────────────────────────────────── */

interface WallPatternColors {
  /** Background / base wall area (slightly lighter than wall) */
  base: string;
  /** Wainscoting panel fill */
  panel: string;
  /** Panel border / frame strips */
  frame: string;
  /** Dado rail / separator */
  rail: string;
  /** Upper zone motif shapes */
  motif: string;
  /** Accent diamond colour */
  accent: string;
}

const DEFAULT_COLORS: WallPatternColors = {
  base: '#b0a698',
  panel: '#c0b8ac',
  frame: '#8a8070',
  rail: '#7a7060',
  motif: '#c8c0b4',
  accent: '#9a9080',
};

/* ── Props ──────────────────────────────────────────────────── */

interface WallPatternProps {
  /** Which wall to decorate */
  orientation: 'north' | 'south' | 'west' | 'east';
  /** Room width (X extent) */
  roomWidth: number;
  /** Room depth (Z extent) */
  roomDepth: number;
  /** Room height */
  roomHeight: number;
  /** Dado rail height from floor (default 1.8) */
  dadoHeight?: number;
  /** Width of door gap at center of this wall (0 = no door, default 0) */
  doorGap?: number;
  /** Colour overrides */
  colors?: Partial<WallPatternColors>;
}

/* ── Tile data type ─────────────────────────────────────────── */

interface PanelTile {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  rotZ?: number;
}

/* ── Component ──────────────────────────────────────────────── */

export function WallPattern({
  orientation,
  roomWidth,
  roomDepth,
  roomHeight,
  dadoHeight = 1.8,
  doorGap = 0,
  colors: colorOverrides,
}: WallPatternProps) {
  const c: WallPatternColors = useMemo(
    () => ({ ...DEFAULT_COLORS, ...colorOverrides }),
    [colorOverrides],
  );

  // Wall length depends on orientation
  const wallLen =
    orientation === 'north' || orientation === 'south' ? roomWidth : roomDepth;

  const tiles = useMemo(
    () => generateAllTiles(wallLen, roomHeight, dadoHeight, doorGap, c),
    [wallLen, roomHeight, dadoHeight, doorGap, c],
  );

  // Offset: position flush against the inner wall face
  // Wall meshes are 0.5 thick, centred at the room edge →
  // inner face is 0.25 inward. We place tiles 0.03 in front of that.
  const halfW = roomWidth / 2;
  const halfD = roomDepth / 2;
  const wallOffset = 0.28; // half wall-thickness (0.25) + air gap (0.03)
  const depth = 0.025; // tile thickness

  // Position & rotation of the whole pattern group
  const groupPos: [number, number, number] = (() => {
    switch (orientation) {
      case 'north':
        return [0, roomHeight / 2, -(halfD - wallOffset)];
      case 'south':
        return [0, roomHeight / 2, halfD - wallOffset];
      case 'west':
        return [-(halfW - wallOffset), roomHeight / 2, 0];
      case 'east':
        return [halfW - wallOffset, roomHeight / 2, 0];
    }
  })();

  const groupRot: [number, number, number] = (() => {
    switch (orientation) {
      case 'north':
        return [0, 0, 0]; // already facing +Z
      case 'south':
        return [0, Math.PI, 0]; // flip to face −Z
      case 'west':
        return [0, Math.PI / 2, 0];
      case 'east':
        return [0, -Math.PI / 2, 0];
    }
  })();

  return (
    <group position={groupPos} rotation={groupRot}>
      {tiles.map((t, i) => (
        <mesh
          key={i}
          position={[t.x, t.y - roomHeight / 2, depth / 2]}
          rotation={[0, 0, t.rotZ ?? 0]}
          receiveShadow
        >
          <boxGeometry args={[t.w, t.h, depth]} />
          <meshStandardMaterial
            color={t.color}
            roughness={0.55}
            metalness={0.03}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ================================================================= */
/*  Tile generation                                                    */
/* ================================================================= */

function generateAllTiles(
  wallLen: number,
  wallH: number,
  dadoH: number,
  doorGap: number,
  c: WallPatternColors,
): PanelTile[] {
  const tiles: PanelTile[] = [];

  // Dado rail strip (horizontal line at dado height)
  const railH = 0.06;
  if (doorGap > 0) {
    // Split rail around the gap
    const sideLen = (wallLen - doorGap) / 2;
    if (sideLen > 0.2) {
      tiles.push({
        x: -(doorGap / 2 + sideLen / 2),
        y: dadoH,
        w: sideLen,
        h: railH,
        color: c.rail,
      });
      tiles.push({
        x: doorGap / 2 + sideLen / 2,
        y: dadoH,
        w: sideLen,
        h: railH,
        color: c.rail,
      });
    }
  } else {
    tiles.push({ x: 0, y: dadoH, w: wallLen - 0.2, h: railH, color: c.rail });
  }

  // ── Lower zone — wainscoting panels ──────────────────────
  generateWainscoting(tiles, wallLen, dadoH, doorGap, c);

  // ── Upper zone — geometric motif ─────────────────────────
  generateUpperMotif(tiles, wallLen, wallH, dadoH, doorGap, c);

  return tiles;
}

/* ── Wainscoting (lower wall) ─────────────────────────────── */

function generateWainscoting(
  tiles: PanelTile[],
  wallLen: number,
  dadoH: number,
  doorGap: number,
  c: WallPatternColors,
) {
  const panelH = dadoH - 0.3; // leave some margin top & bottom
  const panelW = 2.2;
  const frameThick = 0.06;
  const gap = 0.35;
  const yCenter = panelH / 2 + 0.15;

  // How many panels fit on each side of the door
  const halfDoor = doorGap / 2;
  const availLen = doorGap > 0 ? wallLen / 2 - halfDoor - gap : wallLen - gap;

  const count = Math.max(1, Math.floor(availLen / (panelW + gap)));
  const actualGap = (availLen - count * panelW) / (count + 1);

  const placePanels = (startX: number, num: number) => {
    for (let i = 0; i < num; i++) {
      const px = startX + actualGap + panelW / 2 + i * (panelW + actualGap);

      // Panel fill
      tiles.push({
        x: px,
        y: yCenter,
        w: panelW - frameThick * 2,
        h: panelH - frameThick * 2,
        color: c.panel,
      });

      // Frame strips (top, bottom, left, right)
      tiles.push({
        x: px,
        y: yCenter + panelH / 2 - frameThick / 2,
        w: panelW,
        h: frameThick,
        color: c.frame,
      });
      tiles.push({
        x: px,
        y: yCenter - panelH / 2 + frameThick / 2,
        w: panelW,
        h: frameThick,
        color: c.frame,
      });
      tiles.push({
        x: px - panelW / 2 + frameThick / 2,
        y: yCenter,
        w: frameThick,
        h: panelH,
        color: c.frame,
      });
      tiles.push({
        x: px + panelW / 2 - frameThick / 2,
        y: yCenter,
        w: frameThick,
        h: panelH,
        color: c.frame,
      });
    }
  };

  if (doorGap > 0) {
    // Left side panels
    placePanels(-(wallLen / 2), count);
    // Right side panels (mirror)
    placePanels(halfDoor, count);
  } else {
    // Centre panels across full wall
    const totalW = count * panelW + (count + 1) * actualGap;
    placePanels(-totalW / 2, count);
  }
}

/* ── Upper motif (above dado rail to ceiling) ─────────────── */

function generateUpperMotif(
  tiles: PanelTile[],
  wallLen: number,
  wallH: number,
  dadoH: number,
  doorGap: number,
  c: WallPatternColors,
) {
  const upperH = wallH - dadoH - 0.2; // leave margin under ceiling
  if (upperH < 0.5) return;

  const motifSize = 1.1; // size of each motif unit
  const spacing = 2.6; // centre-to-centre horizontal spacing
  const yCenter = dadoH + upperH / 2 + 0.1;

  const halfDoor = doorGap / 2;
  const halfWall = wallLen / 2;

  // Determine motif positions across the wall
  const positions: number[] = [];
  const maxSlots = Math.floor(wallLen / spacing);
  const totalSpan = (maxSlots - 1) * spacing;
  const startX = -totalSpan / 2;

  for (let i = 0; i < maxSlots; i++) {
    const px = startX + i * spacing;
    // Skip positions that overlap with the door gap
    if (doorGap > 0 && Math.abs(px) < halfDoor + motifSize * 0.7) continue;
    // Skip positions too close to wall edges
    if (Math.abs(px) > halfWall - motifSize * 0.8) continue;
    positions.push(px);
  }

  for (const px of positions) {
    // ── Octagon approximation: 8-sided by overlapping rotated squares ──
    // Base square
    const s = motifSize * 0.55;
    tiles.push({
      x: px,
      y: yCenter,
      w: s,
      h: s,
      color: c.motif,
    });
    // 45° rotated square (diamond form)
    tiles.push({
      x: px,
      y: yCenter,
      w: s * 0.72,
      h: s * 0.72,
      color: c.motif,
      rotZ: Math.PI / 4,
    });

    // ── Small accent diamond at centre ──
    tiles.push({
      x: px,
      y: yCenter,
      w: s * 0.28,
      h: s * 0.28,
      color: c.accent,
      rotZ: Math.PI / 4,
    });

    // ── Corner accents (4 small squares at octagon perimeter) ──
    const offset = s * 0.42;
    const cornerSize = s * 0.14;
    tiles.push({
      x: px - offset,
      y: yCenter - offset,
      w: cornerSize,
      h: cornerSize,
      color: c.accent,
      rotZ: Math.PI / 4,
    });
    tiles.push({
      x: px + offset,
      y: yCenter - offset,
      w: cornerSize,
      h: cornerSize,
      color: c.accent,
      rotZ: Math.PI / 4,
    });
    tiles.push({
      x: px - offset,
      y: yCenter + offset,
      w: cornerSize,
      h: cornerSize,
      color: c.accent,
      rotZ: Math.PI / 4,
    });
    tiles.push({
      x: px + offset,
      y: yCenter + offset,
      w: cornerSize,
      h: cornerSize,
      color: c.accent,
      rotZ: Math.PI / 4,
    });

    // ── Horizontal & vertical connecting lines between motifs ──
    const lineW = spacing - motifSize * 0.7;
    const lineThick = 0.04;
    if (lineW > 0.3) {
      tiles.push({
        x: px + spacing / 2,
        y: yCenter,
        w: lineW,
        h: lineThick,
        color: c.frame,
      });
    }
  }

  // ── Top border strip along the ceiling edge ──
  const borderH = 0.05;
  if (doorGap > 0) {
    const sideLen = (wallLen - doorGap) / 2;
    if (sideLen > 0.3) {
      tiles.push({
        x: -(halfDoor + sideLen / 2),
        y: wallH - 0.15,
        w: sideLen,
        h: borderH,
        color: c.rail,
      });
      tiles.push({
        x: halfDoor + sideLen / 2,
        y: wallH - 0.15,
        w: sideLen,
        h: borderH,
        color: c.rail,
      });
    }
  } else {
    tiles.push({
      x: 0,
      y: wallH - 0.15,
      w: wallLen - 0.2,
      h: borderH,
      color: c.rail,
    });
  }
}
