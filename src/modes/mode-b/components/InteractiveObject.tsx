'use client';

/**
 * InteractiveObject.tsx — Clickable 3D object with label
 *
 * A reusable component for interactive hotspots in the scene.
 * Features:
 * - Hover state with color change and scale animation
 * - Click handler that updates Mode B store
 * - Html label that appears on hover
 * - Accessibility-friendly cursor changes
 */

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

import type { ContentSection } from '../store/useModeBStore';
import { CAMERA_POSITIONS, useModeBStore } from '../store/useModeBStore';

interface InteractiveObjectProps {
  /** Position in 3D space */
  position: [number, number, number];
  /** Label text shown on hover */
  label: string;
  /** Optional description */
  description?: string;
  /** Content section this object represents */
  contentType: Exclude<ContentSection, null>;
  /** Object color (default: accent teal) */
  color?: string;
  /** Hover color (default: brighter teal) */
  hoverColor?: string;
  /** Size of the object */
  size?: number;
}

export function InteractiveObject({
  position,
  label,
  description,
  contentType,
  color = '#14b8a6',
  hoverColor = '#5eead4',
  size = 0.15,
}: InteractiveObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { setSelectedContent, setCameraTarget, selectedContent } = useModeBStore();
  const isActive = selectedContent === contentType;

  // Handle click - update store and trigger camera transition
  const handleClick = () => {
    if (isActive) {
      // If already selected, close panel
      useModeBStore.getState().resetView();
    } else {
      // Select this content and move camera
      setSelectedContent(contentType);
      setCameraTarget(CAMERA_POSITIONS[contentType]);
    }
  };

  // Animate scale on hover
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetScale = hovered || isActive ? 1.3 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 10
    );
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        castShadow
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={hovered || isActive ? hoverColor : color}
          emissive={hovered || isActive ? hoverColor : color}
          emissiveIntensity={hovered || isActive ? 0.6 : 0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Pulsing ring effect */}
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[size * 1.2, size * 1.4, 32]} />
        <meshBasicMaterial
          color={isActive ? hoverColor : color}
          transparent
          opacity={hovered || isActive ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Html label */}
      {hovered && !isActive && (
        <Html
          position={[0, size * 2 + 0.1, 0]}
          center
          distanceFactor={10}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div className="whitespace-nowrap rounded-lg bg-black/90 px-3 py-2 text-center backdrop-blur-sm">
            <p className="text-sm font-semibold text-white">{label}</p>
            {description && (
              <p className="mt-0.5 text-xs text-white/60">{description}</p>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
