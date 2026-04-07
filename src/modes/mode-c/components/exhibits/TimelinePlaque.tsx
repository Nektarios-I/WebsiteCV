'use client';

/**
 * TimelinePlaque — Wall-mounted stone plaque for experience/education
 *
 * Displays a career or education entry as a museum plaque:
 * - Stone/marble texture background
 * - Title, subtitle, date range, short description
 * - Hover glow + cursor change
 * - Click to open ExhibitPanel
 */

import { Text } from '@react-three/drei';
import { useState, useCallback } from 'react';

import { useGalleryStore } from '../../stores/useGalleryStore';
import type { ExperienceData, EducationData } from '../../hooks/useExhibitData';
import { exhibitKey, formatDate } from '../../hooks/useExhibitData';

interface TimelinePlaqueProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  type: 'experience' | 'education';
  data: ExperienceData | EducationData;
}

export function TimelinePlaque({
  position,
  rotation = [0, 0, 0],
  type,
  data,
}: TimelinePlaqueProps) {
  const [hovered, setHovered] = useState(false);
  const setActiveExhibit = useGalleryStore((s) => s.setActiveExhibit);
  const activeExhibit = useGalleryStore((s) => s.activeExhibit);
  const isMapOpen = useGalleryStore((s) => s.isMapOpen);

  const isExperience = type === 'experience';
  const expData = data as ExperienceData;
  const eduData = data as EducationData;

  const title = isExperience
    ? expData.role
    : `${eduData.degree} in ${eduData.field}`;
  const subtitle = isExperience ? expData.company : eduData.institution;
  const dateRange = `${formatDate(data.startDate)} — ${formatDate(data.endDate)}`;
  const plaqueColor = isExperience ? '#8a8070' : '#78808a';
  const innerColor = isExperience ? '#c8c0b4' : '#b8bcc8';

  const handleClick = useCallback(() => {
    if (isMapOpen || activeExhibit) return;
    setActiveExhibit(exhibitKey(type, data.id));
  }, [isMapOpen, activeExhibit, setActiveExhibit, type, data.id]);

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Stone plaque backing */}
      <mesh
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[2.8, 1.8, 0.1]} />
        <meshStandardMaterial
          color={plaqueColor}
          roughness={0.5}
          metalness={0.05}
          emissive={hovered ? plaqueColor : '#000000'}
          emissiveIntensity={hovered ? 0.25 : 0}
        />
      </mesh>

      {/* Inner face — lighter recessed area */}
      <mesh position={[0, 0, 0.055]}>
        <planeGeometry args={[2.5, 1.5]} />
        <meshStandardMaterial color={innerColor} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.4, 0.08]}
        fontSize={0.14}
        color="#3a3530"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.3}
      >
        {title}
      </Text>

      {/* Subtitle (company / institution) */}
      <Text
        position={[0, 0.15, 0.08]}
        fontSize={0.11}
        color="#6a6560"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.3}
      >
        {subtitle}
      </Text>

      {/* Date range */}
      <Text
        position={[0, -0.05, 0.08]}
        fontSize={0.09}
        color="#8a8580"
        anchorX="center"
        anchorY="middle"
      >
        {dateRange}
      </Text>

      {/* Short description */}
      <Text
        position={[0, -0.35, 0.08]}
        fontSize={0.07}
        color="#7a7570"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
        lineHeight={1.3}
      >
        {data.description}
      </Text>

      {/* Hover hint */}
      {hovered && (
        <Text
          position={[0, -0.7, 0.08]}
          fontSize={0.09}
          color="#8a7a6a"
          anchorX="center"
          anchorY="middle"
        >
          Click for details
        </Text>
      )}
    </group>
  );
}
