'use client';

/**
 * SkillsRoom — Modern tech lab with data-driven skill display cases
 *
 * Aesthetic: Cool blue tones, glass cases with glowing orbs.
 * Each display case represents a skill category from site.config.ts.
 * Clicking a case opens the ExhibitPanel with skill details + proficiency bars.
 */

import { Text, Billboard } from '@react-three/drei';

import { ROOM_DIMENSIONS } from '../../lib/constants';
import { useExhibitData } from '../../hooks/useExhibitData';
import { SkillOrb } from '../exhibits/SkillOrb';
import { CeilingFixture } from './CeilingFixture';
import { DadoRail } from './DadoRail';
import { RoomShell } from './RoomShell';

interface SkillsRoomProps {
  onReturnToLobby: () => void;
}

/** Display case positions — max 6, arranged in two rows */
const ORB_SLOTS: [number, number, number][] = [
  [-5, 0, -4],
  [0, 0, -4],
  [5, 0, -4],
  [-5, 0, 2],
  [0, 0, 2],
  [5, 0, 2],
];

export function SkillsRoom({ onReturnToLobby }: SkillsRoomProps) {
  const { skills } = useExhibitData();

  return (
    <RoomShell
      dimensions={ROOM_DIMENSIONS.skills}
      floorColor="#5c6870"
      wallColor="#8a96a0"
      ceilingColor="#aab4be"
      onReturnDoorEnter={onReturnToLobby}
      baseboardColor="#566270"
      crownColor="#c0c8d2"
      floorPattern="diamond"
      tileColor1="#a0aab4"
      tileColor2="#7a8a96"
      borderColor="#606c78"
      tileSize={2}
    >
      {/* Cool modern lighting */}
      <pointLight position={[-6, 3, -4]} intensity={0.15} color="#cce0ff" />
      <pointLight position={[6, 3, -4]} intensity={0.15} color="#cce0ff" />

      {/* ─── Twin pendant ceiling lights (cool-toned) ─── */}
      <CeilingFixture
        position={[-5, 5, -1]}
        hangLength={1.5}
        fixtureColor="#607080"
        shadeColor="#b0b8c8"
        bulbColor="#e8f0ff"
        lightColor="#f0f4ff"
        intensity={0.3}
      />
      <CeilingFixture
        position={[5, 5, -1]}
        hangLength={1.5}
        fixtureColor="#607080"
        shadeColor="#b0b8c8"
        bulbColor="#e8f0ff"
        lightColor="#f0f4ff"
        intensity={0.3}
      />

      {/* ─── Dado rail ─── */}
      <DadoRail
        width={ROOM_DIMENSIONS.skills[0]}
        depth={ROOM_DIMENSIONS.skills[2]}
        height={1.0}
        color="#6a7a88"
      />

      {/* Section label */}
      <Billboard position={[0, 4.5, -(ROOM_DIMENSIONS.skills[2] / 2 - 1)]}>
        <Text fontSize={0.3} color="#7a8590" anchorX="center">
          Skills Lab
        </Text>
      </Billboard>

      {/* Data-driven skill category display cases */}
      {skills.slice(0, ORB_SLOTS.length).map((category, i) => {
        const pos = ORB_SLOTS[i];
        if (!pos) return null;
        return (
          <SkillOrb
            key={category.category}
            position={pos}
            category={category}
            colorIndex={i}
          />
        );
      })}

      {/* Empty room fallback */}
      {skills.length === 0 && (
        <Billboard position={[0, 2.5, 0]}>
          <Text fontSize={0.25} color="#aaa5a0" anchorX="center">
            No skills yet — add them in site.config.ts
          </Text>
        </Billboard>
      )}
    </RoomShell>
  );
}
