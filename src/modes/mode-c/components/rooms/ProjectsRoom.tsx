'use client';

/**
 * ProjectsRoom — Dark gallery with wall-mounted project paintings
 *
 * Uses RoomShell (same as Bio/Skills/Playground) for reliable
 * procedural walls, floor, ceiling with physics colliders.
 *
 * Aesthetic: Dark, moody gallery with warm spotlights — classic
 * art-gallery feel. Parquet floor pattern.
 *
 * Each painting is driven by real data from site.config.ts via useExhibitData.
 * Clicking a painting opens the ExhibitPanel with full project details.
 */

import { Text, Billboard } from '@react-three/drei';

import { ROOM_DIMENSIONS } from '../../lib/constants';
import { useExhibitData } from '../../hooks/useExhibitData';
import { ProjectFrame } from '../exhibits/ProjectFrame';
import { CeilingFixture } from './CeilingFixture';
import { DadoRail } from './DadoRail';
import { RoomShell } from './RoomShell';
import { WallSconce } from './WallSconce';

const [WIDTH, HEIGHT, DEPTH] = ROOM_DIMENSIONS.projects;

interface ProjectsRoomProps {
  onReturnToLobby: () => void;
}

/**
 * Wall mounting positions — up to 8 paintings across 3 inner walls.
 * Positioned just inside the room walls.
 */
const FRAME_SLOTS: {
  pos: [number, number, number];
  rot: [number, number, number];
}[] = [
  // North wall (far) — most prominent, seen first
  { pos: [-5, 2.8, -(DEPTH / 2 - 0.4)], rot: [0, 0, 0] },
  { pos: [0, 2.8, -(DEPTH / 2 - 0.4)], rot: [0, 0, 0] },
  { pos: [5, 2.8, -(DEPTH / 2 - 0.4)], rot: [0, 0, 0] },
  // West wall
  { pos: [-(WIDTH / 2 - 0.4), 2.8, -2], rot: [0, Math.PI / 2, 0] },
  { pos: [-(WIDTH / 2 - 0.4), 2.8, 4], rot: [0, Math.PI / 2, 0] },
  // East wall
  { pos: [WIDTH / 2 - 0.4, 2.8, -2], rot: [0, -Math.PI / 2, 0] },
  { pos: [WIDTH / 2 - 0.4, 2.8, 4], rot: [0, -Math.PI / 2, 0] },
];

export function ProjectsRoom({ onReturnToLobby }: ProjectsRoomProps) {
  const { projects } = useExhibitData();

  return (
    <RoomShell
      dimensions={ROOM_DIMENSIONS.projects}
      floorColor="#4a4540"
      wallColor="#6a6058"
      ceilingColor="#3a3530"
      onReturnDoorEnter={onReturnToLobby}
      baseboardColor="#3a3530"
      crownColor="#5a5550"
      floorPattern="parquet"
      tileColor1="#6a6050"
      tileColor2="#5a5040"
      borderColor="#4a4030"
      tileSize={2}
    >
      {/* Warm gallery spotlights */}
      <spotLight
        position={[-5, HEIGHT - 0.5, -4]}
        angle={0.5}
        penumbra={0.6}
        intensity={0.25}
        color="#ffe8cc"
        castShadow
      />
      <spotLight
        position={[5, HEIGHT - 0.5, -4]}
        angle={0.5}
        penumbra={0.6}
        intensity={0.25}
        color="#ffe8cc"
        castShadow
      />
      <spotLight
        position={[0, HEIGHT - 0.5, 3]}
        angle={0.6}
        penumbra={0.5}
        intensity={0.15}
        color="#fff0dd"
        castShadow
      />

      {/* ─── Pendant ceiling light ─── */}
      <CeilingFixture
        position={[0, HEIGHT, 0]}
        hangLength={1.5}
        fixtureColor="#5a5048"
        shadeColor="#8a8078"
        bulbColor="#fff0d0"
        lightColor="#ffe8cc"
        intensity={0.35}
      />

      {/* ─── Wall sconces (west & east walls, between paintings) ─── */}
      <WallSconce
        position={[-(WIDTH / 2 - 0.3), 2.5, 1]}
        rotation={[0, Math.PI / 2, 0]}
        fixtureColor="#5a5048"
        shadeColor="#7a7068"
        bulbColor="#fff0d0"
        lightColor="#ffe8cc"
        intensity={0.1}
      />
      <WallSconce
        position={[WIDTH / 2 - 0.3, 2.5, 1]}
        rotation={[0, -Math.PI / 2, 0]}
        fixtureColor="#5a5048"
        shadeColor="#7a7068"
        bulbColor="#fff0d0"
        lightColor="#ffe8cc"
        intensity={0.1}
      />

      {/* ─── Dado rail ─── */}
      <DadoRail width={WIDTH} depth={DEPTH} height={1.0} color="#504840" />

      {/* Section label */}
      <Billboard position={[0, HEIGHT - 0.5, -(DEPTH / 2 - 1)]}>
        <Text fontSize={0.3} color="#8a8580" anchorX="center">
          Projects Gallery
        </Text>
      </Billboard>

      {/* Data-driven project paintings */}
      {projects.slice(0, FRAME_SLOTS.length).map((project, i) => {
        const slot = FRAME_SLOTS[i];
        if (!slot) return null;
        return (
          <ProjectFrame
            key={project.id}
            position={slot.pos}
            rotation={slot.rot}
            project={project}
          />
        );
      })}

      {/* Empty room fallback */}
      {projects.length === 0 && (
        <Billboard position={[0, 2.5, 0]}>
          <Text fontSize={0.25} color="#aaa5a0" anchorX="center">
            No projects yet — add them in site.config.ts
          </Text>
        </Billboard>
      )}
    </RoomShell>
  );
}
