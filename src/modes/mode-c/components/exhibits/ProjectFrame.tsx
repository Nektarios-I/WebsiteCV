'use client';

/**
 * ProjectFrame — Wall-mounted painting frame for a project exhibit
 *
 * Displays the project as an artwork in an ornate frame with:
 * - Colored canvas based on project category
 * - Project initial letter as decorative element
 * - Title label below the frame
 * - Hover glow + cursor change
 * - Click to open ExhibitPanel
 */

import { Text } from '@react-three/drei';
import { useState, useCallback } from 'react';

import { useGalleryStore } from '../../stores/useGalleryStore';
import type { ProjectData } from '../../hooks/useExhibitData';
import { exhibitKey } from '../../hooks/useExhibitData';

/** Deterministic color per project category */
const CATEGORY_COLORS: Record<string, string> = {
  web: '#4a7fb5',
  mobile: '#4aa87b',
  fullstack: '#7b5ea7',
  backend: '#b59a4a',
  design: '#b54a7b',
  ml: '#e07b3a',
  other: '#7a8599',
};

interface ProjectFrameProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  project: ProjectData;
}

export function ProjectFrame({
  position,
  rotation = [0, 0, 0],
  project,
}: ProjectFrameProps) {
  const [hovered, setHovered] = useState(false);
  const setActiveExhibit = useGalleryStore((s) => s.setActiveExhibit);
  const activeExhibit = useGalleryStore((s) => s.activeExhibit);
  const isMapOpen = useGalleryStore((s) => s.isMapOpen);

  const canvasColor =
    CATEGORY_COLORS[project.category] ?? CATEGORY_COLORS.other;

  const handleClick = useCallback(() => {
    if (isMapOpen || activeExhibit) return;
    setActiveExhibit(exhibitKey('project', project.id));
  }, [isMapOpen, activeExhibit, setActiveExhibit, project.id]);

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
      {/* Ornate wooden frame */}
      <mesh
        castShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[2.6, 2.0, 0.12]} />
        <meshStandardMaterial
          color="#c9b896"
          roughness={0.35}
          metalness={0.15}
          emissive={hovered ? '#c9b896' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Inner mat (lighter border) */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[2.2, 1.6, 0.02]} />
        <meshStandardMaterial color="#d8d0c4" />
      </mesh>

      {/* Canvas surface — colored per category */}
      <mesh
        position={[0, 0, 0.06]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[2.0, 1.4]} />
        <meshStandardMaterial
          color={canvasColor}
          emissive={canvasColor}
          emissiveIntensity={hovered ? 0.15 : 0.05}
        />
      </mesh>

      {/* Project initial letter — large decorative */}
      <Text
        position={[0, 0.1, 0.07]}
        fontSize={0.55}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {project.title.charAt(0).toUpperCase()}
      </Text>

      {/* Project title below canvas */}
      <Text
        position={[0, -1.25, 0.02]}
        fontSize={0.15}
        color="#5a5550"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
      >
        {project.title}
      </Text>

      {/* Featured badge */}
      {project.featured && (
        <Text
          position={[0.9, 0.85, 0.08]}
          fontSize={0.1}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
        >
          ★ Featured
        </Text>
      )}

      {/* Hover hint */}
      {hovered && (
        <Text
          position={[0, -0.85, 0.08]}
          fontSize={0.1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          Click to view details
        </Text>
      )}
    </group>
  );
}
