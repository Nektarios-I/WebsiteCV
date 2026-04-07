'use client';

/**
 * MapPedestal — Interactive 3D pedestal in the lobby center
 *
 * A glowing pedestal with a floating holographic map icon.
 * - Hover: glow intensifies
 * - Click: opens the fullscreen map overlay (store.toggleMap)
 *
 * Placed at the lobby center. Only rendered inside the Lobby room.
 */

import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import type { Mesh } from 'three';

import { useGalleryStore } from '../../stores/useGalleryStore';

export function MapPedestal() {
  const toggleMap = useGalleryStore((s) => s.toggleMap);
  const [hovered, setHovered] = useState(false);
  const orbRef = useRef<Mesh>(null);

  // Float animation for the holographic orb
  useFrame((_, delta) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.8;
      orbRef.current.position.y = 1.4 + Math.sin(Date.now() * 0.002) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Stone pedestal base */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.8, 1, 0.8, 8]} />
        <meshStandardMaterial color="#3a3a4e" />
      </mesh>

      {/* Pedestal top plate */}
      <mesh receiveShadow position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.9, 0.8, 0.1, 8]} />
        <meshStandardMaterial color="#4a4a5e" />
      </mesh>

      {/* Clickable holographic orb */}
      <mesh
        ref={orbRef}
        position={[0, 1.4, 0]}
        onClick={(e) => {
          e.stopPropagation();
          toggleMap();
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial
          color={hovered ? '#66ddff' : '#44aadd'}
          emissive={hovered ? '#66ddff' : '#2288aa'}
          emissiveIntensity={hovered ? 1.2 : 0.5}
          transparent
          opacity={0.85}
          wireframe
        />
      </mesh>

      {/* Glow light from the orb */}
      <pointLight
        position={[0, 1.4, 0]}
        intensity={hovered ? 1.5 : 0.6}
        color="#44aadd"
        distance={4}
        decay={2}
      />

      {/* Label */}
      <Billboard position={[0, 2.1, 0]}>
        <Text
          fontSize={0.25}
          color={hovered ? '#ffffff' : '#aaccdd'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {hovered ? 'Click to Open Map' : 'Gallery Map'}
        </Text>
      </Billboard>
    </group>
  );
}
