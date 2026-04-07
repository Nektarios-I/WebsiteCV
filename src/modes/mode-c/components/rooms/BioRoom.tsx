'use client';

/**
 * BioRoom — Biography hall with experience and education exhibits
 *
 * Aesthetic: Warm marble-like tones, classical museum atmosphere.
 * Experience entries displayed as wall plaques on the north wall.
 * Education entries displayed as wall plaques on the west wall.
 * Decorative pedestals for visual interest.
 *
 * Data-driven via useExhibitData → site.config.ts.
 */

import { Text, Billboard } from '@react-three/drei';

import { ROOM_DIMENSIONS } from '../../lib/constants';
import { useExhibitData } from '../../hooks/useExhibitData';
import { TimelinePlaque } from '../exhibits/TimelinePlaque';
import { CeilingFixture } from './CeilingFixture';
import { DadoRail } from './DadoRail';
import { RoomShell } from './RoomShell';
import { WallSconce } from './WallSconce';

interface BioRoomProps {
  onReturnToLobby: () => void;
}

export function BioRoom({ onReturnToLobby }: BioRoomProps) {
  const { experience, education } = useExhibitData();
  const [width, , depth] = ROOM_DIMENSIONS.bio;

  return (
    <RoomShell
      dimensions={ROOM_DIMENSIONS.bio}
      floorColor="#69604e"
      wallColor="#a29688"
      ceilingColor="#bcb4a8"
      onReturnDoorEnter={onReturnToLobby}
      baseboardColor="#6a5a48"
      crownColor="#d0c8bc"
      floorPattern="herringbone"
      tileColor1="#b8a898"
      tileColor2="#9a8a78"
      borderColor="#7a6a58"
      tileSize={1.8}
    >
      {/* Warm ambient light for marble feel */}
      <pointLight position={[-4, 4, -4]} intensity={0.15} color="#fff0dd" />
      <pointLight position={[4, 4, -4]} intensity={0.15} color="#fff0dd" />

      {/* ─── Pendant ceiling light ─── */}
      <CeilingFixture
        position={[0, 6, 0]}
        hangLength={1.8}
        fixtureColor="#7a6a58"
        shadeColor="#c8bca8"
        bulbColor="#fff5e0"
        lightColor="#fff0dd"
        intensity={0.4}
      />

      {/* ─── Wall sconces ─── */}
      <WallSconce
        position={[8.7, 3, -4]}
        rotation={[0, -Math.PI / 2, 0]}
        lightColor="#fff0dd"
        intensity={0.12}
      />
      <WallSconce
        position={[8.7, 3, 4]}
        rotation={[0, -Math.PI / 2, 0]}
        lightColor="#fff0dd"
        intensity={0.12}
      />
      {/* West wall sconces beside education plaques */}
      <WallSconce
        position={[-(width / 2 - 0.3), 3, -4]}
        rotation={[0, Math.PI / 2, 0]}
        lightColor="#fff0dd"
        intensity={0.12}
      />
      <WallSconce
        position={[-(width / 2 - 0.3), 3, 4]}
        rotation={[0, Math.PI / 2, 0]}
        lightColor="#fff0dd"
        intensity={0.12}
      />

      {/* ─── Dado rail ─── */}
      <DadoRail
        width={width}
        depth={depth}
        height={1.2}
        color="#8a7a68"
      />

      {/* ─── Experience section — North wall ─── */}
      <Billboard position={[0, 5, -(depth / 2 - 1)]}>
        <Text fontSize={0.3} color="#8a8580" anchorX="center">
          Work Experience
        </Text>
      </Billboard>

      {experience.map((exp, i) => {
        const spacing = 3.2;
        const totalWidth = (experience.length - 1) * spacing;
        const x = -totalWidth / 2 + i * spacing;
        return (
          <TimelinePlaque
            key={exp.id}
            position={[x, 3, -(depth / 2 - 0.3)]}
            type="experience"
            data={exp}
          />
        );
      })}

      {/* ─── Education section — West wall ─── */}
      <Billboard position={[-(width / 2 - 1), 5, 0]}>
        <Text fontSize={0.3} color="#8a8580" anchorX="center">
          Education
        </Text>
      </Billboard>

      {education.map((edu, i) => {
        const spacing = 3.5;
        const totalDepth = (education.length - 1) * spacing;
        const z = -totalDepth / 2 + i * spacing;
        return (
          <TimelinePlaque
            key={edu.id}
            position={[-(width / 2 - 0.3), 3, z]}
            rotation={[0, Math.PI / 2, 0]}
            type="education"
            data={edu}
          />
        );
      })}

      {/* Decorative pedestals for visual interest */}
      <DecorativePedestal position={[0, 0, 0]} sculptureColor="#c0b8a8" />
      <DecorativePedestal position={[4, 0, 4]} sculptureColor="#b8c0a8" />
      <DecorativePedestal position={[-3, 0, 4]} sculptureColor="#a8b0c0" />

      {/* Empty room fallback */}
      {experience.length === 0 && education.length === 0 && (
        <Billboard position={[0, 3, 0]}>
          <Text fontSize={0.25} color="#aaa5a0" anchorX="center">
            No biography entries yet — add them in site.config.ts
          </Text>
        </Billboard>
      )}
    </RoomShell>
  );
}

/** Decorative pedestal with abstract sphere sculpture */
function DecorativePedestal({
  position,
  sculptureColor,
}: {
  position: [number, number, number];
  sculptureColor: string;
}) {
  return (
    <group position={position}>
      {/* Stone pedestal */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8a8070" />
      </mesh>
      {/* Abstract sculpture (sphere) */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={sculptureColor}
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}
