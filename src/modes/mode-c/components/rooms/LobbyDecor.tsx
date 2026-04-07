'use client';

/**
 * LobbyDecor — Gallery exhibit decoration + NPC robot viewers
 *
 * Placed inside <Lobby> as children. Adds the following to the
 * 24 × 6 × 24 lobby without blocking any of the 4 doorway paths:
 *
 *  Exhibits:
 *   - "Server Tower" sculpture (NW quadrant)
 *   - "Binary Helix" sculpture (NE quadrant)
 *
 *  Furniture:
 *   - 3 gallery benches (wooden, backless)
 *   - 2 stanchion-rope barriers around the two exhibits
 *
 *  Plants:
 *   - 3 potted plants distributed for greenery
 *
 *  Robot NPC viewers (7 total, 5 colour variants):
 *   - Group A (2): viewing Server Tower exhibit
 *   - Group B (2): one sitting, one explaining near Binary Helix
 *   - Group C (1): solo viewer near east wall
 *   - Group D (1): sitting on bench in SW area
 *   - Group E (1): casual stroller near south-centre
 *
 * Layout keeps a ~3 unit corridor around every door center
 * and a ~2 unit radius around the spawn point (4, 1, 5).
 */

import { Suspense } from 'react';

import { RobotNPC } from './RobotNPC';

/* =================================================================== */
/*  NPC colour palette (avoid yellow — that's the player)              */
/* =================================================================== */
const C_CORAL = '#e06060';
const C_SKY = '#60a8e0';
const C_LIME = '#60c878';
const C_PURPLE = '#8868d0';
const C_TEAL = '#50b8a0';
const C_PINK = '#d060a0';
const C_ORANGE = '#e09040';

/* =================================================================== */
/*  Sub-components — small, focused, no physics (lobby floor handles it)*/
/* =================================================================== */

/** Gallery bench — backless wooden museum seat */
function GalleryBench({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat plank */}
      <mesh castShadow receiveShadow position={[0, 0.38, 0]}>
        <boxGeometry args={[2.0, 0.08, 0.6]} />
        <meshStandardMaterial
          color="#8a7560"
          roughness={0.55}
          metalness={0.02}
        />
      </mesh>
      {/* Left leg pair */}
      <mesh castShadow position={[-0.75, 0.17, 0.18]}>
        <boxGeometry args={[0.08, 0.34, 0.08]} />
        <meshStandardMaterial color="#3a3530" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[-0.75, 0.17, -0.18]}>
        <boxGeometry args={[0.08, 0.34, 0.08]} />
        <meshStandardMaterial color="#3a3530" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Right leg pair */}
      <mesh castShadow position={[0.75, 0.17, 0.18]}>
        <boxGeometry args={[0.08, 0.34, 0.08]} />
        <meshStandardMaterial color="#3a3530" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0.75, 0.17, -0.18]}>
        <boxGeometry args={[0.08, 0.34, 0.08]} />
        <meshStandardMaterial color="#3a3530" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Cross brace */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.6, 0.04, 0.04]} />
        <meshStandardMaterial color="#3a3530" metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Potted plant — terracotta pot with bushy green foliage */
function PottedPlant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.25, 0.2, 0.44, 12]} />
        <meshStandardMaterial color="#b06840" roughness={0.7} metalness={0.0} />
      </mesh>
      {/* Pot rim */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.28, 0.26, 0.06, 12]} />
        <meshStandardMaterial color="#aa6038" roughness={0.6} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 12]} />
        <meshStandardMaterial color="#4a3828" roughness={0.9} />
      </mesh>
      {/* Foliage — layered spheres */}
      <mesh castShadow position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.32, 10, 10]} />
        <meshStandardMaterial color="#3a7a40" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.08, 0.88, 0.06]}>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color="#4a8a48" roughness={0.75} />
      </mesh>
      <mesh castShadow position={[-0.06, 0.82, -0.08]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#328838" roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Single stanchion post — gold metal with ball top */
function StanchionPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base disc */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.04, 12]} />
        <meshStandardMaterial
          color="#8a7a58"
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
      {/* Pole */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.76, 8]} />
        <meshStandardMaterial
          color="#c0a868"
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
      {/* Top ball */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial
          color="#c0a868"
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

/** Velvet rope segment between two XZ positions — catenary-ish sag */
function VelvetRope({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const mx = (from[0] + to[0]) / 2;
  const mz = (from[2] + to[2]) / 2;
  const dx = to[0] - from[0];
  const dz = to[2] - from[2];
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const sagY = 0.58; // rope hangs lower than post tops (0.8)

  return (
    <mesh position={[mx, sagY, mz]} rotation={[0, angle, 0]}>
      <cylinderGeometry args={[0.015, 0.015, len, 6]} />
      <meshStandardMaterial color="#8a2040" roughness={0.7} metalness={0.1} />
    </mesh>
  );
}

/** Stanchion barrier — 4 posts + 4 rope segments in a rectangle */
function StanchionBarrier({
  center,
  halfW,
  halfD,
}: {
  center: [number, number, number];
  /** Half width in X */
  halfW: number;
  /** Half depth in Z */
  halfD: number;
}) {
  const cx = center[0];
  const cz = center[2];

  // Corner positions (Y = 0, posts sit on floor)
  const corners: [number, number, number][] = [
    [cx - halfW, 0, cz - halfD],
    [cx + halfW, 0, cz - halfD],
    [cx + halfW, 0, cz + halfD],
    [cx - halfW, 0, cz + halfD],
  ];

  // Rope positions match post top height area
  const tops: [number, number, number][] = corners.map(
    ([x, , z]) => [x, 0.65, z] as [number, number, number],
  );

  return (
    <group>
      {corners.map((pos, i) => (
        <StanchionPost key={i} position={pos} />
      ))}
      {/* Ropes rotated 90° to be horizontal */}
      {tops.map((from, i) => {
        const to = tops[(i + 1) % tops.length];
        if (!to) return null;
        return <VelvetRope key={`r-${i}`} from={from} to={to} />;
      })}
    </group>
  );
}

/* ── Tech exhibit sculptures ────────────────────────────────── */

/**
 * ServerTower — Abstract "server rack" obelisk on a pedestal
 *
 * Stacked metallic slabs with glowing status LEDs.
 * Represents the CS / tech-museum theme.
 */
function ServerTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pedestal */}
      <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[1.2, 0.6, 1.2]} />
        <meshStandardMaterial color="#4a4a5a" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[1.3, 0.04, 1.3]} />
        <meshStandardMaterial color="#5a5a68" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Server rack tiers */}
      {[0.8, 1.2, 1.6, 2.0].map((y, i) => (
        <group key={i}>
          <mesh castShadow position={[0, y, 0]}>
            <boxGeometry args={[0.7, 0.3, 0.6]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#2a2a3a' : '#35354a'}
              roughness={0.4}
              metalness={0.3}
            />
          </mesh>
          {/* Status LEDs */}
          <mesh position={[0.28, y + 0.08, 0.31]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial
              color={i === 1 ? '#ff4444' : '#44ff88'}
              emissive={i === 1 ? '#ff4444' : '#44ff88'}
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[0.22, y + 0.08, 0.31]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial
              color="#44aaff"
              emissive="#44aaff"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      ))}

      {/* Top antenna */}
      <mesh castShadow position={[0, 2.35, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
        <meshStandardMaterial color="#888" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.6, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color="#44ddff"
          emissive="#44ddff"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Subtle glow */}
      <pointLight
        position={[0, 1.4, 0.4]}
        color="#44aaff"
        intensity={0.08}
        distance={3}
        decay={2}
      />
    </group>
  );
}

/**
 * BinaryHelix — Abstract double-helix sculpture made of floating cubes
 *
 * Two intertwined spirals of small cubes, reminiscent of DNA or
 * streaming binary data. Sits on a circular pedestal.
 */
function BinaryHelix({ position }: { position: [number, number, number] }) {
  const cubes: { x: number; y: number; z: number; color: string }[] = [];
  const steps = 16;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const y = 0.8 + t * 1.8;
    const angle1 = t * Math.PI * 3;
    const angle2 = angle1 + Math.PI;
    const r = 0.25;
    cubes.push({
      x: Math.cos(angle1) * r,
      y,
      z: Math.sin(angle1) * r,
      color: i % 3 === 0 ? '#44ff88' : '#226644',
    });
    cubes.push({
      x: Math.cos(angle2) * r,
      y,
      z: Math.sin(angle2) * r,
      color: i % 3 === 0 ? '#4488ff' : '#224466',
    });
  }

  return (
    <group position={position}>
      {/* Circular pedestal */}
      <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.7, 0.8, 0.5, 16]} />
        <meshStandardMaterial color="#4a4a5a" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.75, 0.72, 0.04, 16]} />
        <meshStandardMaterial color="#5a5a68" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Double helix cubes */}
      {cubes.map((c, i) => (
        <mesh key={i} castShadow position={[c.x, c.y, c.z]}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshStandardMaterial
            color={c.color}
            emissive={c.color}
            emissiveIntensity={0.3}
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Subtle glow */}
      <pointLight
        position={[0, 1.6, 0]}
        color="#44ff88"
        intensity={0.06}
        distance={3}
        decay={2}
      />
    </group>
  );
}

/* =================================================================== */
/*  Main LobbyDecor component                                         */
/* =================================================================== */

/**
 * Top-down reference (24 × 24, origin at center):
 *
 *    North wall (Projects door at x=0, z=-12)
 *  ┌─────────────────────────────────┐
 *  │ Pillar(-9,-9)  🌿Plant   P(9,-9)│
 *  │                                  │
 *  │   [ServerTower]    [BinaryHelix] │  z ≈ -6.5
 *  │   [~~rope~~]       [~~rope~~]    │
 *  │   Bench   🤖🤖     🤖Bench🤖  │  z ≈ -3.5
 *  │                                  │
 *  W door ────────  MAP  ──────── E door
 *  │                                  │
 *  │  🌿        🤖🤖           🤖🌿│  z ≈ 3–5
 *  │  Bench                           │
 *  │ Pillar(-9,9)             P(9,9)  │
 *  └─────────────────────────────────┘
 *    South wall (Playground door at x=0, z=12)
 *
 * Spawn: (4, 1, 5) — SE area kept fairly clear
 */
export function LobbyDecor() {
  return (
    <group>
      {/* ══════════════════════════════════════════════════════ */}
      {/*  EXHIBITS                                              */}
      {/* ══════════════════════════════════════════════════════ */}

      {/* NW — Server Tower with stanchion barrier */}
      <ServerTower position={[-6, 0, -6.5]} />
      <StanchionBarrier center={[-6, 0, -6.5]} halfW={1.1} halfD={1.1} />

      {/* NE — Binary Helix with stanchion barrier */}
      <BinaryHelix position={[6, 0, -6.5]} />
      <StanchionBarrier center={[6, 0, -6.5]} halfW={1.0} halfD={1.0} />

      {/* ══════════════════════════════════════════════════════ */}
      {/*  BENCHES                                               */}
      {/* ══════════════════════════════════════════════════════ */}

      {/* Bench facing Server Tower (NW) */}
      <GalleryBench position={[-5, 0, -3.5]} rotation={0} />

      {/* Bench facing Binary Helix (NE) */}
      <GalleryBench position={[5.5, 0, -3.5]} rotation={0} />

      {/* Bench in SW rest area */}
      <GalleryBench position={[-6, 0, 5]} rotation={Math.PI / 2} />

      {/* ══════════════════════════════════════════════════════ */}
      {/*  PLANTS                                                */}
      {/* ══════════════════════════════════════════════════════ */}

      <PottedPlant position={[4.5, 0, -9.5]} />
      <PottedPlant position={[-9.5, 0, 4]} />
      <PottedPlant position={[9.5, 0, 4.5]} />

      {/* ══════════════════════════════════════════════════════ */}
      {/*  NPC ROBOT VIEWERS                                     */}
      {/*  Wrapped in Suspense — they load Robot.fbx              */}
      {/* ══════════════════════════════════════════════════════ */}
      <Suspense fallback={null}>
        {/*
         * Group A — Two robots viewing the Server Tower (NW)
         * Standing side by side, facing north-west toward the sculpture.
         */}
        <RobotNPC
          position={[-4.2, 0, -4.8]}
          rotation={-0.4}
          color={C_CORAL}
          pose="idle"
        />
        <RobotNPC
          position={[-3.4, 0, -5.4]}
          rotation={-0.6}
          color={C_SKY}
          pose="wave"
        />

        {/*
         * Group B — "Tour guide" explaining the Binary Helix (NE)
         * One sitting on the bench, one standing and gesturing.
         */}
        <RobotNPC
          position={[5.5, 0.38, -3.5]}
          rotation={Math.PI}
          color={C_LIME}
          pose="sitting"
        />
        <RobotNPC
          position={[7, 0, -4.5]}
          rotation={Math.PI * 0.75}
          color={C_PURPLE}
          pose="wave"
        />

        {/*
         * Group C — Solo viewer near east wall
         * Calmly looking at the wall, nodding.
         */}
        <RobotNPC
          position={[8.5, 0, 5]}
          rotation={Math.PI / 2}
          color={C_PINK}
          pose="dance"
        />

        {/*
         * Group D — Resting on the SW bench
         */}
        <RobotNPC
          position={[-6, 0.38, 5]}
          rotation={0}
          color={C_ORANGE}
          pose="sitting"
        />

        {/*
         * Group E — Casual stroller near south-centre
         * Standing, just looking around.
         */}
        <RobotNPC
          position={[-2, 0, 3.5]}
          rotation={-Math.PI / 3}
          color={C_TEAL}
          pose="idle2"
        />
      </Suspense>
    </group>
  );
}
