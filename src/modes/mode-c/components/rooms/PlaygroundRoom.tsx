'use client';

/**
 * PlaygroundRoom — Certifications & Achievements showcase
 *
 * Aesthetic: Bright, celebratory atmosphere with warm tones.
 * Certification plaques displayed on walls.
 * Decorative elements (trophy, plant, blocks) for visual interest.
 *
 * Uses triangle floor pattern for a unique, glitch-free look.
 */

import { Text, Billboard } from '@react-three/drei';

import { ROOM_DIMENSIONS } from '../../lib/constants';
import { useExhibitData } from '../../hooks/useExhibitData';
import { CertificationPlaque } from '../exhibits/CertificationPlaque';
import { CeilingFixture } from './CeilingFixture';
import { DadoRail } from './DadoRail';
import { RoomShell } from './RoomShell';
import { WallSconce } from './WallSconce';

interface PlaygroundRoomProps {
  onReturnToLobby: () => void;
}

export function PlaygroundRoom({ onReturnToLobby }: PlaygroundRoomProps) {
  const [width, height, depth] = ROOM_DIMENSIONS.playground;
  const { certifications } = useExhibitData();

  return (
    <RoomShell
      dimensions={ROOM_DIMENSIONS.playground}
      floorColor="#5e6b58"
      wallColor="#a09488"
      ceilingColor="#b8b2a6"
      onReturnDoorEnter={onReturnToLobby}
      baseboardColor="#6a6050"
      crownColor="#ccc4b8"
      floorPattern="triangle"
      tileColor1="#c8b898"
      tileColor2="#90b8a8"
      borderColor="#7a7a68"
      tileSize={1.5}
    >
      {/* ─── Pendant ceiling lights ─── */}
      <CeilingFixture
        position={[-3, height, 0]}
        hangLength={1.3}
        fixtureColor="#8a8878"
        shadeColor="#e0d0b0"
        bulbColor="#fffff0"
        lightColor="#fff8ee"
        intensity={0.35}
      />
      <CeilingFixture
        position={[3, height, 0]}
        hangLength={1.3}
        fixtureColor="#8a8878"
        shadeColor="#e0d0b0"
        bulbColor="#fffff0"
        lightColor="#fff8ee"
        intensity={0.35}
      />

      {/* Accent fill lights */}
      <pointLight position={[-4, 3, -4]} intensity={0.15} color="#fff0dd" />
      <pointLight position={[4, 3, -4]} intensity={0.15} color="#fff0dd" />

      {/* ─── Wall sconces ─── */}
      <WallSconce
        position={[-(width / 2 - 0.3), 3, -4]}
        rotation={[0, Math.PI / 2, 0]}
        lightColor="#fff0dd"
        intensity={0.1}
      />
      <WallSconce
        position={[width / 2 - 0.3, 3, -4]}
        rotation={[0, -Math.PI / 2, 0]}
        lightColor="#fff0dd"
        intensity={0.1}
      />

      {/* ─── Dado rail ─── */}
      <DadoRail width={width} depth={depth} height={1.0} color="#8a7a70" />

      {/* ─── Section label ─── */}
      <Billboard position={[0, height - 0.5, -(depth / 2 - 1)]}>
        <Text fontSize={0.3} color="#8a8580" anchorX="center">
          Certifications & Achievements
        </Text>
      </Billboard>

      {/* ─── Certification plaques on north wall ─── */}
      {certifications.map((cert, i) => {
        const spacing = 3.2;
        const totalWidth = (certifications.length - 1) * spacing;
        const x = -totalWidth / 2 + i * spacing;
        return (
          <CertificationPlaque
            key={cert.id}
            position={[x, 2.8, -(depth / 2 - 0.3)]}
            data={cert}
          />
        );
      })}

      {/* ─── Decorative trophy pedestal (center) ─── */}
      <TrophyPedestal position={[0, 0, 0]} />

      {/* ─── Decorative elements ─── */}
      <AchievementPillar
        position={[-4, 0, -3]}
        color="#c0a858"
        label="9.5/10 GPA"
      />
      <AchievementPillar
        position={[4, 0, -3]}
        color="#b0b8c8"
        label="19.90/20"
      />

      {/* Empty room fallback */}
      {certifications.length === 0 && (
        <Billboard position={[0, 2.5, 0]}>
          <Text fontSize={0.25} color="#aaa5a0" anchorX="center">
            No certifications yet — add them in cv.json
          </Text>
        </Billboard>
      )}
    </RoomShell>
  );
}

/** Trophy on a pedestal — gold cup shape */
function TrophyPedestal({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pedestal base */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <meshStandardMaterial color="#5a5a68" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Pedestal top cap */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[1.3, 0.04, 1.3]} />
        <meshStandardMaterial color="#6a6a78" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Trophy cup */}
      <mesh castShadow position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.25, 0.15, 0.5, 12]} />
        <meshStandardMaterial
          color="#d4a830"
          metalness={0.6}
          roughness={0.2}
          emissive="#d4a830"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Trophy stem */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
        <meshStandardMaterial color="#c0a030" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Trophy base */}
      <mesh position={[0, 0.87, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.06, 12]} />
        <meshStandardMaterial color="#c0a030" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Glow */}
      <pointLight
        position={[0, 1.5, 0]}
        color="#ffe088"
        intensity={0.08}
        distance={3}
        decay={2}
      />
    </group>
  );
}

/** Achievement pillar — a column with a glowing label */
function AchievementPillar({
  position,
  color,
  label,
}: {
  position: [number, number, number];
  color: string;
  label: string;
}) {
  return (
    <group position={position}>
      {/* Pillar */}
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 2, 8]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} />
      </mesh>
      {/* Top sphere */}
      <mesh castShadow position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      {/* Label */}
      <Text
        position={[0, 2.6, 0]}
        fontSize={0.18}
        color="#5a5040"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}
