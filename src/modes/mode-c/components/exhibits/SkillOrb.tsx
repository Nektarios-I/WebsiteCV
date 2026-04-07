'use client';

/**
 * SkillOrb — Display case with glowing orb for a skill category
 *
 * Shows a skill category as a pedestal with:
 * - Glowing octahedron orb (color per category)
 * - Transparent glass dome
 * - Category label above
 * - Floating skill names around the base
 * - Hover glow + cursor change
 * - Click to open ExhibitPanel
 */

import { Text } from '@react-three/drei';
import { useState, useCallback } from 'react';

import { useGalleryStore } from '../../stores/useGalleryStore';
import type { SkillCategoryData } from '../../hooks/useExhibitData';
import { exhibitKey } from '../../hooks/useExhibitData';

/** Cycling palette for skill categories */
const SKILL_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
];

interface SkillOrbProps {
  position: [number, number, number];
  category: SkillCategoryData;
  colorIndex?: number;
}

export function SkillOrb({
  position,
  category,
  colorIndex = 0,
}: SkillOrbProps) {
  const [hovered, setHovered] = useState(false);
  const setActiveExhibit = useGalleryStore((s) => s.setActiveExhibit);
  const activeExhibit = useGalleryStore((s) => s.activeExhibit);
  const isMapOpen = useGalleryStore((s) => s.isMapOpen);

  const glowColor = SKILL_COLORS[colorIndex % SKILL_COLORS.length];

  const handleClick = useCallback(() => {
    if (isMapOpen || activeExhibit) return;
    setActiveExhibit(exhibitKey('skill', category.category));
  }, [isMapOpen, activeExhibit, setActiveExhibit, category.category]);

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  return (
    <group position={position}>
      {/* Pedestal base */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0.4, 0]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[1.4, 0.8, 1.4]} />
        <meshStandardMaterial
          color="#7a8a98"
          roughness={0.3}
          metalness={0.1}
          emissive={hovered ? '#7a8a98' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Glowing technology orb */}
      <mesh
        position={[0, 1.3, 0]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <octahedronGeometry args={[0.4]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={hovered ? 0.8 : 0.5}
        />
      </mesh>

      {/* Glass dome */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.65, 20, 20]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={hovered ? 0.15 : 0.08}
          roughness={0}
          metalness={0.3}
        />
      </mesh>

      {/* Category label above */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.2}
        color="#4a4540"
        anchorX="center"
        anchorY="middle"
      >
        {category.category}
      </Text>

      {/* Skill names floating around the base */}
      {category.skills.slice(0, 5).map((skill, i) => {
        const count = Math.min(category.skills.length, 5);
        const angle = (i / count) * Math.PI * 2;
        const radius = 1.2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        return (
          <Text
            key={skill.name}
            position={[x, 0.9, z]}
            fontSize={0.1}
            color="#6a6a6a"
            anchorX="center"
            anchorY="middle"
          >
            {skill.name}
          </Text>
        );
      })}

      {/* Skill count badge on pedestal front */}
      <Text
        position={[0, 0.85, 0.72]}
        fontSize={0.12}
        color="#8a8a8a"
        anchorX="center"
        anchorY="middle"
      >
        {category.skills.length} skills
      </Text>

      {/* Hover hint */}
      {hovered && (
        <Text
          position={[0, 0.05, 0.75]}
          fontSize={0.1}
          color="#6a6560"
          anchorX="center"
          anchorY="middle"
        >
          Click for details
        </Text>
      )}
    </group>
  );
}
