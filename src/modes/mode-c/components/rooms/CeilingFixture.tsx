'use client';

/**
 * CeilingFixture — Decorative ceiling-mounted light fixture
 *
 * Two variants:
 * - 'pendant':     Simple hanging shade with single bulb
 * - 'chandelier':  Ring chandelier with multiple candle-style arms
 *
 * Both emit real pointLight(s) for scene illumination.
 */

import { useMemo } from 'react';

interface CeilingFixtureProps {
  position: [number, number, number];
  /** Distance below the ceiling attachment point the fixture hangs */
  hangLength?: number;
  /** Metal / frame color */
  fixtureColor?: string;
  /** Shade / bowl color */
  shadeColor?: string;
  /** Emissive bulb color */
  bulbColor?: string;
  /** Light emission color */
  lightColor?: string;
  /** Light intensity */
  intensity?: number;
  /** Fixture style */
  variant?: 'pendant' | 'chandelier';
}

export function CeilingFixture({
  position,
  hangLength = 1.5,
  fixtureColor = '#8a7a68',
  shadeColor = '#d4c8b8',
  bulbColor = '#fff8e8',
  lightColor = '#fff8ee',
  intensity = 0.4,
  variant = 'pendant',
}: CeilingFixtureProps) {
  return variant === 'chandelier' ? (
    <Chandelier
      position={position}
      hangLength={hangLength}
      fixtureColor={fixtureColor}
      shadeColor={shadeColor}
      bulbColor={bulbColor}
      lightColor={lightColor}
      intensity={intensity}
    />
  ) : (
    <Pendant
      position={position}
      hangLength={hangLength}
      fixtureColor={fixtureColor}
      shadeColor={shadeColor}
      bulbColor={bulbColor}
      lightColor={lightColor}
      intensity={intensity}
    />
  );
}

/* ── Internal types ────────────────────────────────────────── */

type FixtureInternalProps = Required<Omit<CeilingFixtureProps, 'variant'>>;

/* ── Pendant ───────────────────────────────────────────────── */

function Pendant({
  position,
  hangLength,
  fixtureColor,
  shadeColor,
  bulbColor,
  lightColor,
  intensity,
}: FixtureInternalProps) {
  return (
    <group position={position}>
      {/* Ceiling canopy plate */}
      <mesh>
        <cylinderGeometry args={[0.12, 0.14, 0.05, 16]} />
        <meshStandardMaterial
          color={fixtureColor}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Hanging rod */}
      <mesh position={[0, -hangLength / 2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, hangLength, 8]} />
        <meshStandardMaterial
          color={fixtureColor}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Shade — truncated cone (narrow top, wide bottom) */}
      <mesh position={[0, -hangLength + 0.12, 0]}>
        <cylinderGeometry args={[0.06, 0.22, 0.2, 16]} />
        <meshStandardMaterial
          color={shadeColor}
          roughness={0.5}
          metalness={0.08}
        />
      </mesh>

      {/* Shade rim ring */}
      <mesh
        position={[0, -hangLength + 0.02, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.22, 0.012, 8, 24]} />
        <meshStandardMaterial
          color={fixtureColor}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Glowing bulb */}
      <mesh position={[0, -hangLength + 0.08, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color={bulbColor}
          emissive={bulbColor}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Light source */}
      <pointLight
        position={[0, -hangLength - 0.05, 0]}
        color={lightColor}
        intensity={intensity}
        distance={12}
        decay={2}
        castShadow
      />
    </group>
  );
}

/* ── Chandelier ────────────────────────────────────────────── */

function Chandelier({
  position,
  hangLength,
  fixtureColor,
  shadeColor,
  bulbColor,
  lightColor,
  intensity,
}: FixtureInternalProps) {
  const arms = useMemo(() => {
    const count = 6;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const r = 0.55;
      return { x: Math.cos(angle) * r, z: Math.sin(angle) * r, angle };
    });
  }, []);

  return (
    <group position={position}>
      {/* Ceiling canopy */}
      <mesh>
        <cylinderGeometry args={[0.14, 0.17, 0.06, 16]} />
        <meshStandardMaterial
          color={fixtureColor}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Central rod */}
      <mesh position={[0, -hangLength / 2, 0]}>
        <cylinderGeometry args={[0.025, 0.025, hangLength, 8]} />
        <meshStandardMaterial
          color={fixtureColor}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Central hub sphere */}
      <mesh position={[0, -hangLength, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={fixtureColor}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Decorative ring */}
      <mesh
        position={[0, -hangLength - 0.04, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.55, 0.02, 8, 32]} />
        <meshStandardMaterial
          color={fixtureColor}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Arms with candle cups & glowing bulbs */}
      {arms.map((arm, i) => (
        <group key={i} position={[arm.x, -hangLength - 0.04, arm.z]}>
          {/* Candle cup */}
          <mesh>
            <cylinderGeometry args={[0.04, 0.06, 0.07, 10]} />
            <meshStandardMaterial
              color={shadeColor}
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
          {/* Bulb */}
          <mesh position={[0, 0.06, 0]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial
              color={bulbColor}
              emissive={bulbColor}
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* Primary down-light */}
      <pointLight
        position={[0, -hangLength - 0.15, 0]}
        color={lightColor}
        intensity={intensity}
        distance={15}
        decay={2}
        castShadow
      />
      {/* Secondary fill (softer upward ambiance) */}
      <pointLight
        position={[0, -hangLength + 0.3, 0]}
        color={lightColor}
        intensity={intensity * 0.25}
        distance={8}
        decay={2}
      />
    </group>
  );
}
