'use client';

/**
 * WallSconce — Decorative wall-mounted light fixture
 *
 * An elegant bracket with upward-facing shade and glowing bulb.
 * Place against a wall; rotation determines which direction
 * the sconce faces (into the room).
 *
 * Rotation guide (Y-axis):
 *   North wall → rotation=[0, 0, 0]        (faces +Z)
 *   South wall → rotation=[0, Math.PI, 0]   (faces −Z)
 *   West  wall → rotation=[0, Math.PI/2, 0] (faces +X)
 *   East  wall → rotation=[0, -Math.PI/2, 0](faces −X)
 */

interface WallSconceProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  /** Metal bracket color */
  fixtureColor?: string;
  /** Shade / cup color */
  shadeColor?: string;
  /** Emissive bulb color */
  bulbColor?: string;
  /** Emitted light color */
  lightColor?: string;
  /** Light intensity */
  intensity?: number;
}

export function WallSconce({
  position,
  rotation = [0, 0, 0],
  fixtureColor = '#8a7a68',
  shadeColor = '#d4c8b8',
  bulbColor = '#fff5e0',
  lightColor = '#fff8ee',
  intensity = 0.15,
}: WallSconceProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Back plate (flush with wall surface) */}
      <mesh>
        <boxGeometry args={[0.12, 0.22, 0.03]} />
        <meshStandardMaterial
          color={fixtureColor}
          metalness={0.35}
          roughness={0.4}
        />
      </mesh>

      {/* Bracket arm extending from wall */}
      <mesh position={[0, 0.02, 0.07]}>
        <boxGeometry args={[0.04, 0.04, 0.11]} />
        <meshStandardMaterial
          color={fixtureColor}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>

      {/* Upward-facing shade cup */}
      <mesh position={[0, 0.08, 0.12]}>
        <cylinderGeometry args={[0.07, 0.05, 0.08, 12]} />
        <meshStandardMaterial
          color={shadeColor}
          roughness={0.45}
          metalness={0.08}
        />
      </mesh>

      {/* Glowing bulb */}
      <mesh position={[0, 0.14, 0.12]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshStandardMaterial
          color={bulbColor}
          emissive={bulbColor}
          emissiveIntensity={0.7}
        />
      </mesh>

      {/* Light source */}
      <pointLight
        position={[0, 0.2, 0.15]}
        color={lightColor}
        intensity={intensity}
        distance={5}
        decay={2}
      />
    </group>
  );
}
