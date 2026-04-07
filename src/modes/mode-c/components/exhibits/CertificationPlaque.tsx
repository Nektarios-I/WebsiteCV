'use client';

/**
 * CertificationPlaque — Wall-mounted certificate display
 *
 * Displays a certification/achievement as a framed certificate:
 * - Gold-trimmed frame on a parchment-colored background
 * - Title, issuer, description
 * - Hover glow + cursor change
 * - Click to open ExhibitPanel
 */

import { Text } from '@react-three/drei';
import { useState, useCallback } from 'react';

import { useGalleryStore } from '../../stores/useGalleryStore';
import type { CertificationData } from '../../hooks/useExhibitData';
import { exhibitKey } from '../../hooks/useExhibitData';

interface CertificationPlaqueProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  data: CertificationData;
}

export function CertificationPlaque({
  position,
  rotation = [0, 0, 0],
  data,
}: CertificationPlaqueProps) {
  const [hovered, setHovered] = useState(false);
  const setActiveExhibit = useGalleryStore((s) => s.setActiveExhibit);
  const activeExhibit = useGalleryStore((s) => s.activeExhibit);
  const isMapOpen = useGalleryStore((s) => s.isMapOpen);

  const handleClick = useCallback(() => {
    if (isMapOpen || activeExhibit) return;
    setActiveExhibit(exhibitKey('certification', data.id));
  }, [isMapOpen, activeExhibit, setActiveExhibit, data.id]);

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
      {/* Ornate gold frame */}
      <mesh
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[2.4, 1.6, 0.08]} />
        <meshStandardMaterial
          color="#c0a058"
          roughness={0.3}
          metalness={0.4}
          emissive={hovered ? '#c0a058' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Parchment inner face */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[2.1, 1.3]} />
        <meshStandardMaterial color="#f5f0e0" />
      </mesh>

      {/* Certificate seal (gold circle) */}
      <mesh position={[0, 0.35, 0.05]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial
          color="#d4a830"
          emissive="#d4a830"
          emissiveIntensity={0.2}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.1, 0.06]}
        fontSize={0.11}
        color="#3a3020"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.9}
        textAlign="center"
      >
        {data.title}
      </Text>

      {/* Issuer */}
      <Text
        position={[0, -0.12, 0.06]}
        fontSize={0.08}
        color="#6a6050"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.9}
      >
        {data.issuer}
      </Text>

      {/* Description */}
      <Text
        position={[0, -0.35, 0.06]}
        fontSize={0.065}
        color="#8a8070"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
        lineHeight={1.3}
      >
        {data.description}
      </Text>

      {/* Hover hint */}
      {hovered && (
        <Text
          position={[0, -0.6, 0.06]}
          fontSize={0.08}
          color="#a09060"
          anchorX="center"
          anchorY="middle"
        >
          Click for details
        </Text>
      )}
    </group>
  );
}
