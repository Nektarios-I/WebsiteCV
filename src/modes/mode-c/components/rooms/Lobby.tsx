'use client';

/**
 * Lobby — The central spawn room of the gallery (procedural)
 *
 * Fully procedural room with:
 * - Visible physics floor + checkerboard tile overlay (GalleryFloor)
 * - 4 walls with doorway cutouts leading to themed rooms
 * - Baseboard + Crown molding architectural trim
 * - Decorative corner pillars
 * - Visible ceiling
 * - Interactive map pedestal at centre
 * - Billboard labels above each doorway
 */

import { Text, Billboard } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

import type { RoomId } from '../../lib/constants';
import { ROOM_DIMENSIONS, LOBBY_DOORWAYS } from '../../lib/constants';
import { Baseboard } from './Baseboard';
import { CeilingFixture } from './CeilingFixture';
import { CrownMolding } from './CrownMolding';
import { GalleryFloor } from './GalleryFloor';
import { LobbyDecor } from './LobbyDecor';
import { MapPedestal } from './MapPedestal';
import { WallPattern } from './WallPattern';
import { WallSconce } from './WallSconce';
import { WallWithDoor } from './WallWithDoor';

const [WIDTH, HEIGHT, DEPTH] = ROOM_DIMENSIONS.lobby;
const DOOR_WIDTH = 3;
const DOOR_HEIGHT = 3.5;

interface LobbyProps {
  onDoorwayEnter: (targetRoom: RoomId) => void;
}

/** Decorative pillar — placed at inner corners */
function Pillar({ position }: { position: [number, number, number] }) {
  return (
    <mesh castShadow receiveShadow position={position}>
      <cylinderGeometry args={[0.3, 0.35, HEIGHT, 8]} />
      <meshStandardMaterial color="#d0c8bc" roughness={0.4} metalness={0.05} />
    </mesh>
  );
}

export function Lobby({ onDoorwayEnter }: LobbyProps) {
  return (
    <group>
      {/* ===== FLOOR ===== */}
      {/* Thick visible physics slab — top surface at Y=0 */}
      <RigidBody type="fixed" colliders="cuboid" friction={1} restitution={0}>
        <mesh receiveShadow position={[0, -0.25, 0]}>
          <boxGeometry args={[WIDTH, 0.5, DEPTH]} />
          <meshStandardMaterial
            color="#e0d8cc"
            roughness={0.8}
            metalness={0.02}
          />
        </mesh>
      </RigidBody>

      {/* Extra catch-all collider below the visual floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -3, 0]} visible={false}>
          <boxGeometry args={[WIDTH + 4, 4, DEPTH + 4]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>

      {/* Checkerboard tile overlay — sits on top of the physics slab */}
      <GalleryFloor
        width={WIDTH}
        depth={DEPTH}
        pattern="checkerboard"
        tileColor1="#d4ccc0"
        tileColor2="#b8b0a4"
        borderColor="#8a8070"
      />

      {/* ===== CEILING ===== */}
      <mesh position={[0, HEIGHT, 0]}>
        <boxGeometry args={[WIDTH, 0.3, DEPTH]} />
        <meshStandardMaterial color="#f0ece6" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* ===== WALLS WITH DOORWAYS ===== */}

      {/* North wall → Projects Gallery */}
      <WallWithDoor
        position={[0, HEIGHT / 2, -DEPTH / 2]}
        wallWidth={WIDTH}
        wallHeight={HEIGHT}
        doorWidth={DOOR_WIDTH}
        doorHeight={HEIGHT}
        axis="x"
        wallColor="#a89e90"
        onDoorwayEnter={() => onDoorwayEnter('projects')}
      />

      {/* South wall → Playground */}
      <WallWithDoor
        position={[0, HEIGHT / 2, DEPTH / 2]}
        wallWidth={WIDTH}
        wallHeight={HEIGHT}
        doorWidth={DOOR_WIDTH}
        doorHeight={HEIGHT}
        axis="x"
        wallColor="#a89e90"
        onDoorwayEnter={() => onDoorwayEnter('playground')}
      />

      {/* West wall → Biography Hall */}
      <WallWithDoor
        position={[-WIDTH / 2, HEIGHT / 2, 0]}
        wallWidth={DEPTH}
        wallHeight={HEIGHT}
        doorWidth={DOOR_WIDTH}
        doorHeight={HEIGHT}
        axis="z"
        wallColor="#a89e90"
        onDoorwayEnter={() => onDoorwayEnter('bio')}
      />

      {/* East wall → Skills Lab */}
      <WallWithDoor
        position={[WIDTH / 2, HEIGHT / 2, 0]}
        wallWidth={DEPTH}
        wallHeight={HEIGHT}
        doorWidth={DOOR_WIDTH}
        doorHeight={HEIGHT}
        axis="z"
        wallColor="#a89e90"
        onDoorwayEnter={() => onDoorwayEnter('skills')}
      />

      {/* ===== ARCHITECTURAL TRIM ===== */}
      <Baseboard width={WIDTH} depth={DEPTH} color="#8a8070" />
      <CrownMolding
        width={WIDTH}
        depth={DEPTH}
        roomHeight={HEIGHT}
        color="#c8c0b4"
      />

      {/* ===== WALL PATTERNS (decorative overlay on all 4 walls) ===== */}
      <WallPattern
        orientation="north"
        roomWidth={WIDTH}
        roomDepth={DEPTH}
        roomHeight={HEIGHT}
        doorGap={DOOR_WIDTH}
        colors={{
          base: '#b0a698',
          panel: '#c2bab0',
          frame: '#8a8070',
          rail: '#7a7060',
          motif: '#c8c0b4',
          accent: '#9a9080',
        }}
      />
      <WallPattern
        orientation="south"
        roomWidth={WIDTH}
        roomDepth={DEPTH}
        roomHeight={HEIGHT}
        doorGap={DOOR_WIDTH}
        colors={{
          base: '#b0a698',
          panel: '#c2bab0',
          frame: '#8a8070',
          rail: '#7a7060',
          motif: '#c8c0b4',
          accent: '#9a9080',
        }}
      />
      <WallPattern
        orientation="west"
        roomWidth={WIDTH}
        roomDepth={DEPTH}
        roomHeight={HEIGHT}
        doorGap={DOOR_WIDTH}
        colors={{
          base: '#b0a698',
          panel: '#c2bab0',
          frame: '#8a8070',
          rail: '#7a7060',
          motif: '#c8c0b4',
          accent: '#9a9080',
        }}
      />
      <WallPattern
        orientation="east"
        roomWidth={WIDTH}
        roomDepth={DEPTH}
        roomHeight={HEIGHT}
        doorGap={DOOR_WIDTH}
        colors={{
          base: '#b0a698',
          panel: '#c2bab0',
          frame: '#8a8070',
          rail: '#7a7060',
          motif: '#c8c0b4',
          accent: '#9a9080',
        }}
      />

      {/* ===== DECORATIVE PILLARS ===== */}
      <Pillar position={[-9, HEIGHT / 2, -9]} />
      <Pillar position={[9, HEIGHT / 2, -9]} />
      <Pillar position={[-9, HEIGHT / 2, 9]} />
      <Pillar position={[9, HEIGHT / 2, 9]} />

      {/* ===== LIGHTING ===== */}
      <ambientLight intensity={0.15} />
      <spotLight
        position={[-6, HEIGHT - 0.5, -6]}
        angle={0.6}
        penumbra={0.5}
        intensity={0.2}
        color="#fff5e6"
        castShadow
      />
      <spotLight
        position={[6, HEIGHT - 0.5, 6]}
        angle={0.6}
        penumbra={0.5}
        intensity={0.2}
        color="#fff5e6"
        castShadow
      />

      {/* ===== CHANDELIER ===== */}
      <CeilingFixture
        position={[0, HEIGHT, 0]}
        variant="chandelier"
        hangLength={2.0}
        fixtureColor="#8a7a60"
        shadeColor="#c8bca8"
        bulbColor="#fff5e0"
        lightColor="#fff8ee"
        intensity={0.5}
      />

      {/* ===== WALL SCONCES ===== */}
      {/* North wall (faces +Z into room) */}
      <WallSconce
        position={[7, 3, -11.7]}
        rotation={[0, 0, 0]}
        lightColor="#fff5e6"
      />
      {/* South wall (faces −Z) */}
      <WallSconce
        position={[-7, 3, 11.7]}
        rotation={[0, Math.PI, 0]}
        lightColor="#fff5e6"
      />
      {/* West wall (faces +X) */}
      <WallSconce
        position={[-11.7, 3, -7]}
        rotation={[0, Math.PI / 2, 0]}
        lightColor="#fff5e6"
      />
      {/* East wall (faces −X) */}
      <WallSconce
        position={[11.7, 3, 7]}
        rotation={[0, -Math.PI / 2, 0]}
        lightColor="#fff5e6"
      />

      {/* ===== DOORWAY LABELS ===== */}
      {LOBBY_DOORWAYS.map((door) => (
        <Billboard
          key={door.to}
          position={[door.position[0], DOOR_HEIGHT + 0.8, door.position[2]]}
        >
          <Text
            fontSize={0.4}
            color="#4a4540"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#ffffff"
          >
            {door.label}
          </Text>
        </Billboard>
      ))}

      {/* ===== MAP PEDESTAL ===== */}
      <MapPedestal />

      {/* ===== GALLERY DECORATIONS & NPC VIEWERS ===== */}
      <LobbyDecor />
    </group>
  );
}
