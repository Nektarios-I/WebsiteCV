'use client';

/**
 * Room.tsx — Aesthetic desk setup scene for Mode B
 *
 * Sprint 1: "The Foundation" — cozy night-time developer workspace
 * - Wide walnut desk with dark metal frame legs
 * - Ultrawide curved monitor with teal screen glow
 * - Dark navy walls with accent wall
 * - Dark wood floor with soft area rug
 * - Warm articulated desk lamp with point light
 * - Mechanical keyboard + mouse + large deskmat
 *
 * Sprint 2: "The Setup" — real workspace feel
 * - Gaming/office chair with seat, backrest, armrests, star base
 * - Vertical side monitor on monitor arm
 * - Headphones on a headphone stand
 * - Coffee mug with animated steam particles
 * - Desktop speakers (pair) flanking the setup
 * - Monitor light bar (BenQ ScreenBar style)
 *
 * Sprint 3: "The Window & Atmosphere" — mood & magic
 * - Large window on back wall with frame, muntins, and sill
 * - Night cityscape gradient behind window
 * - Animated rain droplets on window glass (instanced)
 * - Moonlight volumetric spill through window
 * - Floating golden dust particles in lamp beam
 * - Ceiling pendant lamp for ambient overhead fill
 *
 * Sprint 4: "Personalization & Nature" — alive & storied
 * - Large floor plant (Monstera) in pot beside desk
 * - Small desk succulent in mini pot
 * - Photo frame on desk
 * - Robot figurine / collectible on desk
 * - Framed wall art / poster on right wall
 * - Floating shelf with books on back wall
 *
 * Sprint 5: "Interactive CV Integration" — objects become data portals
 * Sprint 6: "Polish & Magic" — cat, clock, vinyl, cables, sticky notes,
 *   PC tower with water cooling, wall shelves + bookcase
 */

import { Html, MeshReflectorMaterial, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Group } from 'three';

import cvData from '@/data/cv.json';
import projectsData from '@/data/projects.json';
import skillsData from '@/data/skills.json';

import { useModeBStore } from '../store/useModeBStore';

/* ── Dimensions ─────────────────────────────────── */

const ROOM = {
  width: 10,
  depth: 8,
  height: 4,
  wallThickness: 0.1,
};

const DESK = {
  width: 3.5,
  depth: 0.8,
  surfaceThick: 0.04,
  height: 0.75,
  legWidth: 0.06,
  legDepth: 0.06,
  frameInset: 0.08, // how far the metal frame sits from desktop edge
};

const MONITOR = {
  width: 1.4,
  height: 0.42,
  depth: 0.03,
  curve: 0.06, // subtle curve offset at edges
  bezelWidth: 0.02,
  standNeckH: 0.18,
  standNeckW: 0.04,
  standBaseW: 0.28,
  standBaseD: 0.16,
};

const KEYBOARD = {
  width: 0.38,
  depth: 0.13,
  height: 0.015,
  tiltAngle: -0.06, // slight tilt
};

const MOUSE = {
  width: 0.058,
  depth: 0.1,
  height: 0.032,
};

const DESKMAT = {
  width: 0.85,
  depth: 0.38,
  height: 0.003,
};

const LAMP = {
  baseR: 0.06,
  baseH: 0.015,
  armLower: 0.35,
  armUpper: 0.3,
  armThick: 0.015,
  headW: 0.12,
  headD: 0.06,
  headH: 0.03,
};

/* Sprint 2 dimensions */

const SIDE_MONITOR = {
  width: 0.32,
  height: 0.55,
  depth: 0.02,
  bezelWidth: 0.015,
};

const CHAIR = {
  seatW: 0.48,
  seatD: 0.46,
  seatH: 0.06,
  seatY: 0.48, // height of seat center from floor
  backW: 0.46,
  backH: 0.55,
  backThick: 0.04,
  armrestW: 0.06,
  armrestD: 0.26,
  armrestH: 0.22,
  legSpread: 0.28,
  legR: 0.015,
  wheelR: 0.02,
  poleR: 0.025,
  poleH: 0.15,
};

const MUG = {
  topR: 0.035,
  bottomR: 0.03,
  height: 0.09,
  handleR: 0.025,
  handleTube: 0.006,
};

const SPEAKER = {
  width: 0.07,
  height: 0.12,
  depth: 0.08,
  driverR: 0.022,
};

const LIGHTBAR = {
  width: 0.42,
  height: 0.018,
  depth: 0.025,
};

/* Sprint 3 dimensions */

const WINDOW = {
  width: 2.6,
  height: 2.0,
  frameW: 0.06,
  frameD: 0.08,
  sillD: 0.15,
  sillH: 0.04,
  muntinW: 0.025,
  paneRows: 2,
  paneCols: 3,
  centerY: 2.3, // center of window on back wall
};

const PENDANT = {
  cordLength: 1.2,
  cordR: 0.005,
  shadeTopR: 0.02,
  shadeBotR: 0.14,
  shadeH: 0.1,
};

const RAIN_COUNT = 120;

/* Sprint 4 dimensions */

const SHELF = {
  width: 1.2,
  depth: 0.18,
  thick: 0.02,
  bracketH: 0.1,
  bracketW: 0.015,
};

const BOOK = {
  minW: 0.015,
  maxW: 0.035,
  minH: 0.16,
  maxH: 0.22,
  depth: 0.12,
};

/* Sprint 5 dimensions */

const NOTEBOOK = {
  openW: 0.26,
  pageH: 0.18,
  thick: 0.012,
  spineW: 0.01,
};

const TABLET = {
  width: 0.15,
  height: 0.22,
  depth: 0.007,
  bezel: 0.008,
};

/* Sprint 6 dimensions */

const PC_TOWER = {
  width: 0.20,
  height: 0.44,
  depth: 0.42,
};

const BOOKCASE = {
  width: 0.9,
  height: 1.8,
  depth: 0.28,
  shelfCount: 5,
  wallThick: 0.022,
};

const CAT = {
  bodyL: 0.13,
  bodyH: 0.055,
};

/* ── Colors & Materials ─────────────────────────── */

const C = {
  walnut: '#5C3D2E',
  walnutDark: '#4a3225',
  metalDark: '#1a1a1a',
  metalFrame: '#222222',
  wallMain: '#1a1f2e',
  wallAccent: '#3d2b22', // brick accent
  floorWood: '#2a1f17',
  rug: '#252e3d',
  rugBorder: '#1e2530',
  monitorBezel: '#0a0a0a',
  screenGlow: '#14b8a6',
  screenBg: '#0d3d36',
  keycap: '#1c1c1c',
  keycapLight: '#252525',
  deskmat: '#1a1a22',
  deskmatEdge: '#2a2a3a',
  lampMetal: '#2a2a2a',
  lampShade: '#e8dcc8',
  lampWarm: '#ffb347',
  mouseBody: '#1e1e1e',
  chairLeather: '#1a1a1a',
  chairFrame: '#181818',
  chairCushion: '#222222',
  mugCeramic: '#e8ddd0',
  mugCoffee: '#3b1f0e',
  speakerBody: '#1a1a1a',
  speakerDriver: '#2a2a2a',
  speakerGrill: '#111111',
  lightbarBody: '#0f0f0f',
  lightbarGlow: '#fff5e6',
  headphoneBand: '#1c1c1c',
  headphoneCup: '#141414',
  headphoneCushion: '#222222',
  standMetal: '#2a2a2a',
  steam: '#aabbcc',
  windowFrame: '#1e1e1e',
  windowSill: '#2a2520',
  nightSkyTop: '#050510',
  nightSkyBot: '#101830',
  cityLight: '#ffcc66',
  rainDrop: '#88aacc',
  pendantMetal: '#1e1e1e',
  pendantShade: '#222222',
  pendantGlow: '#ffeedd',
  dustGold: '#ffdd88',
  plantPot: '#5a3e2c',
  plantPotRim: '#4a3020',
  plantSoil: '#2a1a0f',
  leafGreen: '#2d5a3d',
  leafDark: '#1e3d28',
  leafLight: '#3a7a4e',
  succulentGreen: '#4a8a5c',
  succulentPot: '#d4c4b0',
  frameWood: '#3a2a1e',
  frameMat: '#e8e0d4',
  photoPlaceholder: '#556677',
  figurineBody: '#cccccc',
  figurineAccent: '#14b8a6',
  posterFrame: '#1e1e1e',
  posterArt: '#1a2a3a',
  shelfWood: '#4a3225',
  bookSpine1: '#8b4513',
  bookSpine2: '#2c3e50',
  bookSpine3: '#c0392b',
  bookSpine4: '#1a5276',
  bookSpine5: '#27ae60',
  bookSpine6: '#7d3c98',
  bookSpine7: '#e67e22',
  pcBody: '#101018',
  pcAcrylic: '#aabbee',
  coolantBlue: '#22ccff',
  catFur: '#c8a878',
  catFurDark: '#9a7658',
  clockFace: '#f0ece0',
  stickyYellow: '#ffee44',
  stickyBlue: '#88ddff',
  stickyPink: '#ff88aa',
  vinylBlack: '#111116',
  notebookCover: '#1c2b3a',
  notebookPage: '#f5f0e8',
  notebookLine: '#ddd8cc',
  notebookSpine: '#14b8a6',
  tabletBody: '#111111',
  tabletScreen: '#0a1628',
  tabletGlow: '#38bdf8',
};

/* ── Main Room ──────────────────────────────────── */

export function Room() {
  const roomRef = useRef<Group>(null);
  const { setSelectedContent } = useModeBStore();

  // Desk is centered at z = -2.5 (pushed a bit further back for camera space)
  const deskZ = -2.5;
  const deskY = DESK.height;

  return (
    <group ref={roomRef}>
      {/* ─── Floor ─────────────────────────────── */}
      <Floor />

      {/* ─── Area Rug ──────────────────────────── */}
      <AreaRug position={[0, 0.002, deskZ + 0.2]} />

      {/* ─── Walls ─────────────────────────────── */}
      {/* Back wall — dark navy */}
      <Wall
        position={[0, ROOM.height / 2, -ROOM.depth / 2]}
        size={[ROOM.width, ROOM.height, ROOM.wallThickness]}
        color={C.wallMain}
      />
      {/* Left wall — brick accent */}
      <Wall
        position={[-ROOM.width / 2, ROOM.height / 2, 0]}
        size={[ROOM.wallThickness, ROOM.height, ROOM.depth]}
        color={C.wallAccent}
        roughness={0.95}
      />
      {/* Right wall — dark navy */}
      <Wall
        position={[ROOM.width / 2, ROOM.height / 2, 0]}
        size={[ROOM.wallThickness, ROOM.height, ROOM.depth]}
        color={C.wallMain}
      />

      {/* ─── Baseboard trim ────────────────────── */}
      <Baseboard />

      {/* ─── Desk ──────────────────────────────── */}
      <WalnutDesk position={[0, 0, deskZ]} />

      {/* ─── Ultrawide Monitor → Projects ─────── */}
      <UltrawideMonitor
        position={[0, deskY + MONITOR.standNeckH + MONITOR.height / 2, deskZ - DESK.depth / 2 + 0.12]}
        onSelect={() => window.open('/projects', '_blank')}
      />

      {/* ─── Deskmat ───────────────────────────── */}
      <DeskMat position={[0, deskY + DESK.surfaceThick / 2 + DESKMAT.height / 2, deskZ + 0.08]} />

      {/* ─── Keyboard ──────────────────────────── */}
      <Keyboard position={[-0.04, deskY + DESK.surfaceThick / 2 + DESKMAT.height + KEYBOARD.height / 2, deskZ + 0.06]} />

      {/* ─── Mouse ─────────────────────────────── */}
      <Mouse position={[0.28, deskY + DESK.surfaceThick / 2 + DESKMAT.height + MOUSE.height / 2, deskZ + 0.05]} />

      {/* ─── Desk Lamp ─────────────────────────── */}
      <DeskLamp position={[DESK.width / 2 - 0.25, deskY + DESK.surfaceThick / 2, deskZ - 0.15]} />

      {/* ─── LED Strip behind desk (glow) ──────── */}
      <LedStrip position={[0, deskY - 0.05, deskZ - DESK.depth / 2 - 0.02]} width={DESK.width - 0.3} />

      {/* ═══ Sprint 2 Elements ═══════════════════ */}

      {/* ─── Office Chair (rotated to face desk) ── */}
      <OfficeChair position={[0, 0, deskZ + 1.1]} rotation={[0, Math.PI, 0]} />

      {/* ─── Vertical Side Monitor → Skills ────── */}
      <VerticalMonitor
        position={[MONITOR.width / 2 + SIDE_MONITOR.width / 2 + 0.18, deskY + 0.308, deskZ - DESK.depth / 2 + 0.14]}
        onSelect={() => window.open('/skills', '_blank')}
      />

      {/* ─── Headphone Stand + Headphones ──────── */}
      <HeadphoneStand position={[-DESK.width / 2 + 0.2, deskY + DESK.surfaceThick / 2, deskZ + 0.05]} />

      {/* ─── Coffee Mug ────────────────────────── */}
      <CoffeeMug position={[DESK.width / 2 - 0.55, deskY + DESK.surfaceThick / 2, deskZ + 0.12]} />

      {/* ─── Desktop Speakers (pair) ───────────── */}
      <DesktopSpeaker position={[-MONITOR.width / 2 - 0.22, deskY + DESK.surfaceThick / 2, deskZ - 0.18]} />
      <DesktopSpeaker position={[MONITOR.width / 2 + 0.02, deskY + DESK.surfaceThick / 2, deskZ - 0.18]} />

      {/* ─── Monitor Light Bar ─────────────────── */}
      <MonitorLightBar position={[0, deskY + MONITOR.standNeckH + MONITOR.height + 0.01, deskZ - DESK.depth / 2 + 0.12]} />

      {/* ═══ Sprint 3 Elements ═══════════════════ */}

      {/* ─── Window on back wall ───────────────── */}
      <NightWindow position={[-2.2, WINDOW.centerY, -ROOM.depth / 2 + 0.01]} />

      {/* ─── Rain on window ───────────────────── */}
      <RainDroplets position={[-2.2, WINDOW.centerY, -ROOM.depth / 2 + 0.06]} />

      {/* ─── Floating dust particles ──────────── */}
      <DustMotes />

      {/* ─── Ceiling pendant lamp ─────────────── */}
      <PendantLamp position={[0.5, ROOM.height, deskZ + 0.3]} />

      {/* ═══ Sprint 4 Elements ═══════════════════ */}

      {/* ─── Floor Plant (Monstera) ───────────── */}
      <FloorPlant position={[-DESK.width / 2 - 0.5, 0, deskZ - 0.1]} />

      {/* ─── Small Desk Succulent ─────────────── */}
      <DeskSucculent position={[-DESK.width / 2 + 0.5, deskY + DESK.surfaceThick / 2, deskZ - 0.25]} />

      {/* ─── Photo Frame ──────────────────────── */}
      <PhotoFrame position={[DESK.width / 2 - 0.2, deskY + DESK.surfaceThick / 2, deskZ + 0.2]} />

      {/* ─── Robot Figurine → About ───────────── */}
      <RobotFigurine
        position={[-DESK.width / 2 + 0.35, deskY + DESK.surfaceThick / 2, deskZ + 0.22]}
        onSelect={() => window.open('/about', '_blank')}
      />

      {/* ═══ Sprint 5 Elements ═══════════════════ */}

      {/* ─── Open Notebook → Experience ──────────── */}
      <Notebook
        position={[0.42, deskY + DESK.surfaceThick / 2 + 0.006, deskZ + 0.16]}
        onSelect={() => window.open('/experience', '_blank')}
      />

      {/* ─── Tablet → Contact ────────────────────── */}
      <Tablet
        position={[DESK.width / 2 - 0.22, deskY + DESK.surfaceThick / 2, deskZ + 0.1]}
        onSelect={() => window.open('/contact', '_blank')}
      />

      {/* ─── Wall Art / Poster (right wall) ─────── */}
      <WallPoster position={[ROOM.width / 2 - 0.12, 2.2, -2.5]} rotation={[0, -Math.PI / 2, 0]} />
      <WallPoster position={[ROOM.width / 2 - 0.12, 2.2, -1.0]} rotation={[0, -Math.PI / 2, 0]} small />

      {/* ─── Floating Shelf + Books (back wall) ─── */}
      <FloatingShelf position={[2.0, 2.4, -ROOM.depth / 2 + 0.1]} />

      {/* ═══ Sprint 6 Elements ═══════════════════ */}

      {/* ─── PC Tower with water cooling ───────── */}
      <PCTower position={[DESK.width / 2 + 0.25, 0, deskZ + 0.18]} />

      {/* ─── Wall deco shelves (right of window) ── */}
      <WallDecoShelves position={[0.9, 2.85, -ROOM.depth / 2 + 0.08]} />

      {/* ─── Large bookcase (right wall corner) ─── */}
      <WallBookcase
        position={[ROOM.width / 2 - BOOKCASE.depth / 2 - 0.01, BOOKCASE.height / 2, 1.0]}
        rotation={[0, -Math.PI / 2, 0]}
      />


      {/* ─── Cat sleeping on desk corner ───────── */}
      {/* y offset = CAT.bodyH/2 so the sphere bottom clears the desk surface */}
      <Cat position={[DESK.width / 2 - 0.12, deskY + DESK.surfaceThick / 2 + CAT.bodyH / 2 + 0.003, deskZ + 0.28]} />

      {/* ─── Wall clock (right wall) ───────────── */}
      <WallClock position={[ROOM.width / 2 - 0.06, 2.5, 0.6]} rotation={[0, -Math.PI / 2, 0]} />

      {/* ─── Sticky notes on monitor bezel ──────── */}
      <StickyNotes
        monitorBase={[0, deskY + MONITOR.standNeckH + MONITOR.height / 2, deskZ - DESK.depth / 2 + 0.12]}
      />

      {/* ─── Vinyl record player ───────────────── */}
      <VinylPlayer
        position={[-DESK.width / 2 + 0.65, deskY + DESK.surfaceThick / 2, deskZ - 0.22]}
      />

      {/* ─── Cable bundle behind desk ──────────── */}
      <CableBundle deskZ={deskZ} deskY={deskY} />

      {/* ─── Click indicators above each interactable ─── */}
      {/* Ultrawide Monitor → Projects */}
      <ClickIndicator
        position={[0, deskY + MONITOR.standNeckH + MONITOR.height + 0.17, deskZ - DESK.depth / 2 + 0.12]}
        label="Projects"
      />
      {/* Vertical Monitor → Skills */}
      <ClickIndicator
        position={[MONITOR.width / 2 + SIDE_MONITOR.width / 2 + 0.18, deskY + 0.308 + SIDE_MONITOR.height / 2 + 0.15, deskZ - DESK.depth / 2 + 0.14]}
        label="Skills"
      />
      {/* Robot Figurine → About */}
      <ClickIndicator
        position={[-DESK.width / 2 + 0.35, deskY + DESK.surfaceThick / 2 + 0.18, deskZ + 0.22]}
        label="About"
      />
      {/* Notebook → Experience */}
      <ClickIndicator
        position={[0.42, deskY + DESK.surfaceThick / 2 + 0.18, deskZ + 0.16]}
        label="Experience"
      />
      {/* Tablet → Contact */}
      <ClickIndicator
        position={[DESK.width / 2 - 0.22, deskY + DESK.surfaceThick / 2 + 0.18, deskZ + 0.1]}
        label="Contact"
      />

      {/* ─── Whiteboard (interaction guide) ─────── */}
      <Whiteboard position={[-ROOM.width / 2 + 0.03, 1.82, -1.6]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}

/* ── Floor ──────────────────────────────────────── */

function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[ROOM.width, ROOM.depth]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={30}
        roughness={0.85}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color={C.floorWood}
        metalness={0.2}
        mirror={0.35}
      />
    </mesh>
  );
}

/* ── Area Rug ───────────────────────────────────── */

function AreaRug({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Rug body */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[3.2, 2.4]} />
        <meshStandardMaterial color={C.rug} roughness={0.95} metalness={0} />
      </mesh>
      {/* Rug border/edge accent */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.001, 0]}>
        <ringGeometry args={[1.4, 1.55, 4]} />
        <meshStandardMaterial
          color={C.rugBorder}
          roughness={0.95}
          metalness={0}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

/* ── Baseboard Trim ─────────────────────────────── */

function Baseboard() {
  const h = 0.08;
  const t = 0.02;
  return (
    <group>
      {/* Back baseboard */}
      <mesh position={[0, h / 2, -ROOM.depth / 2 + t / 2]}>
        <boxGeometry args={[ROOM.width, h, t]} />
        <meshStandardMaterial color="#141820" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Left baseboard */}
      <mesh position={[-ROOM.width / 2 + t / 2, h / 2, 0]}>
        <boxGeometry args={[t, h, ROOM.depth]} />
        <meshStandardMaterial color="#2e2018" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Right baseboard */}
      <mesh position={[ROOM.width / 2 - t / 2, h / 2, 0]}>
        <boxGeometry args={[t, h, ROOM.depth]} />
        <meshStandardMaterial color="#141820" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
}

/* ── Wall ────────────────────────────────────────── */

interface WallProps {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  roughness?: number;
}

function Wall({ position, size, color = C.wallMain, roughness = 0.88 }: WallProps) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={0.05} />
    </mesh>
  );
}

/* ── Walnut Desk ────────────────────────────────── */

function WalnutDesk({ position }: { position: [number, number, number] }) {
  const legH = DESK.height - DESK.surfaceThick;
  const inset = DESK.frameInset;

  return (
    <group position={position}>
      {/* Desktop surface — walnut */}
      <mesh position={[0, DESK.height, 0]} castShadow receiveShadow>
        <boxGeometry args={[DESK.width, DESK.surfaceThick, DESK.depth]} />
        <meshStandardMaterial color={C.walnut} roughness={0.65} metalness={0.0} />
      </mesh>

      {/* Front edge bevel / lip — darker accent strip */}
      <mesh position={[0, DESK.height - DESK.surfaceThick / 2 - 0.005, DESK.depth / 2 - 0.005]}>
        <boxGeometry args={[DESK.width, 0.01, 0.01]} />
        <meshStandardMaterial color={C.walnutDark} roughness={0.6} metalness={0.0} />
      </mesh>

      {/* Metal frame legs — 4 legs connected by crossbars */}
      {/* Front-left leg */}
      <MetalLeg position={[-DESK.width / 2 + inset, legH / 2, DESK.depth / 2 - inset]} height={legH} />
      {/* Front-right leg */}
      <MetalLeg position={[DESK.width / 2 - inset, legH / 2, DESK.depth / 2 - inset]} height={legH} />
      {/* Back-left leg */}
      <MetalLeg position={[-DESK.width / 2 + inset, legH / 2, -DESK.depth / 2 + inset]} height={legH} />
      {/* Back-right leg */}
      <MetalLeg position={[DESK.width / 2 - inset, legH / 2, -DESK.depth / 2 + inset]} height={legH} />

      {/* Side frame rail — left */}
      <mesh position={[-DESK.width / 2 + inset, legH * 0.35, 0]}>
        <boxGeometry args={[DESK.legWidth, DESK.legWidth, DESK.depth - inset * 2]} />
        <meshStandardMaterial color={C.metalFrame} roughness={0.4} metalness={0.85} />
      </mesh>
      {/* Side frame rail — right */}
      <mesh position={[DESK.width / 2 - inset, legH * 0.35, 0]}>
        <boxGeometry args={[DESK.legWidth, DESK.legWidth, DESK.depth - inset * 2]} />
        <meshStandardMaterial color={C.metalFrame} roughness={0.4} metalness={0.85} />
      </mesh>
    </group>
  );
}

function MetalLeg({ position, height }: { position: [number, number, number]; height: number }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[DESK.legWidth, height, DESK.legDepth]} />
      <meshStandardMaterial color={C.metalDark} roughness={0.35} metalness={0.9} />
    </mesh>
  );
}

/* ── Ultrawide Monitor ──────────────────────────── */

function UltrawideMonitor({
  position,
  onSelect,
}: {
  position: [number, number, number];
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [projIdx, setProjIdx] = useState(0);
  const project = projectsData[projIdx % projectsData.length];

  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onPointerDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Monitor body / bezel */}
      <mesh castShadow>
        <boxGeometry args={[MONITOR.width, MONITOR.height, MONITOR.depth]} />
        <meshStandardMaterial
          color={C.monitorBezel}
          roughness={0.08}
          metalness={0.85}
          emissive={hovered ? C.screenGlow : '#000000'}
          emissiveIntensity={hovered ? 0.06 : 0}
        />
      </mesh>

      {/* Screen face — emissive teal glow */}
      <mesh position={[0, 0, MONITOR.depth / 2 + 0.001]}>
        <planeGeometry args={[MONITOR.width - MONITOR.bezelWidth * 2, MONITOR.height - MONITOR.bezelWidth * 2]} />
        <meshStandardMaterial
          color={C.screenBg}
          emissive={C.screenGlow}
          emissiveIntensity={hovered ? 0.9 : 0.6}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Screen light */}
      <pointLight
        position={[0, 0, 0.15]}
        intensity={hovered ? 5 : 3}
        color={C.screenGlow}
        distance={2.5}
        decay={2}
      />

      {/* Html project carousel — rendered on the screen surface */}
      <Html
        transform
        occlude="blending"
        position={[0, 0.005, MONITOR.depth / 2 + 0.003]}
        scale={0.00275}
        center
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            width: '490px',
            height: '146px',
            color: '#e2e8f0',
            fontFamily: 'ui-monospace, "Cascadia Code", monospace',
            fontSize: '11px',
            padding: '10px 14px',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ color: '#4dd0c4', fontSize: '9px', marginBottom: '5px', letterSpacing: '0.1em' }}>
            ◈&nbsp;PROJECTS&nbsp;[{projIdx + 1}&nbsp;/&nbsp;{projectsData.length}]
          </div>
          <div style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 700, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {project?.title ?? '—'}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '9px', lineHeight: 1.45, marginBottom: '6px', height: '38px', overflow: 'hidden' }}>
            {(project?.description ?? '').substring(0, 120)}{(project?.description?.length ?? 0) > 120 ? '…' : ''}
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {((project as { technologies?: string[] })?.technologies ?? []).slice(0, 4).map((t: string, i: number) => (
              <span key={i} style={{ background: 'rgba(20,184,166,0.18)', color: '#14b8a6', padding: '1px 6px', borderRadius: '3px', fontSize: '8px' }}>
                {t}
              </span>
            ))}
          </div>
          {/* Nav arrows — enable pointer events only here */}
          <div style={{ position: 'absolute', bottom: '8px', right: '10px', display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setProjIdx(i => (i - 1 + projectsData.length) % projectsData.length); }}
              style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid #14b8a6', color: '#14b8a6', padding: '2px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}
            >◀</button>
            <button
              onClick={(e) => { e.stopPropagation(); setProjIdx(i => (i + 1) % projectsData.length); }}
              style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid #14b8a6', color: '#14b8a6', padding: '2px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}
            >▶</button>
          </div>
          <div style={{ position: 'absolute', bottom: '10px', left: '14px', color: '#475569', fontSize: '8px' }}>
            click frame to open ↗
          </div>
        </div>
      </Html>

      {/* Thin chin strip at bottom */}
      <mesh position={[0, -MONITOR.height / 2 + 0.008, MONITOR.depth / 2 + 0.002]}>
        <planeGeometry args={[MONITOR.width * 0.3, 0.008]} />
        <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Stand neck — metal */}
      <mesh position={[0, -MONITOR.height / 2 - MONITOR.standNeckH / 2, 0]} castShadow>
        <boxGeometry args={[MONITOR.standNeckW, MONITOR.standNeckH, MONITOR.standNeckW]} />
        <meshStandardMaterial color={C.metalFrame} roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Stand base — oval/rectangular */}
      <mesh position={[0, -MONITOR.height / 2 - MONITOR.standNeckH, 0.04]} castShadow>
        <boxGeometry args={[MONITOR.standBaseW, 0.015, MONITOR.standBaseD]} />
        <meshStandardMaterial color={C.metalFrame} roughness={0.3} metalness={0.85} />
      </mesh>
    </group>
  );
}

/* ── Desk Mat ───────────────────────────────────── */

function DeskMat({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Mat body */}
      <mesh receiveShadow>
        <boxGeometry args={[DESKMAT.width, DESKMAT.height, DESKMAT.depth]} />
        <meshStandardMaterial color={C.deskmat} roughness={0.92} metalness={0} />
      </mesh>
      {/* Accent edge stitching — top edge */}
      <mesh position={[0, DESKMAT.height / 2 + 0.0005, 0]}>
        <boxGeometry args={[DESKMAT.width + 0.004, 0.001, DESKMAT.depth + 0.004]} />
        <meshStandardMaterial color={C.deskmatEdge} roughness={0.8} metalness={0.1} />
      </mesh>
    </group>
  );
}

/* ── Keyboard ───────────────────────────────────── */

function Keyboard({ position }: { position: [number, number, number] }) {
  // Build a simplified mechanical keyboard with distinct keycap rows
  return (
    <group position={position} rotation={[KEYBOARD.tiltAngle, 0, 0]}>
      {/* Keyboard base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[KEYBOARD.width, KEYBOARD.height, KEYBOARD.depth]} />
        <meshStandardMaterial color="#111111" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Keycap rows (simplified: 5 rows of rectangular strips) */}
      {Array.from({ length: 5 }).map((_, row) => {
        const rowZ = -KEYBOARD.depth / 2 + 0.015 + row * 0.024;
        const rowWidth = row === 4 ? KEYBOARD.width * 0.7 : KEYBOARD.width - 0.02;
        return (
          <mesh
            key={row}
            position={[0, KEYBOARD.height / 2 + 0.003, rowZ]}
            castShadow
          >
            <boxGeometry args={[rowWidth, 0.005, 0.019]} />
            <meshStandardMaterial
              color={row === 2 ? C.keycapLight : C.keycap}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {/* Subtle underglow glow */}
      <pointLight
        position={[0, -0.01, 0]}
        intensity={0.4}
        color={C.screenGlow}
        distance={0.3}
        decay={2}
      />
    </group>
  );
}

/* ── Mouse ──────────────────────────────────────── */

function Mouse({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Mouse body — rounded box approximated with a squished sphere */}
      <mesh castShadow>
        <sphereGeometry args={[MOUSE.width / 2, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={C.mouseBody} roughness={0.25} metalness={0.3} />
      </mesh>
      {/* Mouse base (flat bottom) */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <circleGeometry args={[MOUSE.width / 2, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Scroll wheel */}
      <mesh position={[0, MOUSE.height * 0.7, -MOUSE.depth * 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.015, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  );
}

/* ── Desk Lamp ──────────────────────────────────── */

function DeskLamp({ position }: { position: [number, number, number] }) {
  const lowerAngle = -0.3;
  const upperAngle = 0.5;

  return (
    <group position={position}>
      {/* Base */}
      <mesh castShadow>
        <cylinderGeometry args={[LAMP.baseR, LAMP.baseR * 1.1, LAMP.baseH, 16]} />
        <meshStandardMaterial color={C.lampMetal} roughness={0.35} metalness={0.8} />
      </mesh>

      {/* Lower arm */}
      <group position={[0, LAMP.baseH, 0]} rotation={[lowerAngle, 0, 0]}>
        <mesh position={[0, LAMP.armLower / 2, 0]} castShadow>
          <boxGeometry args={[LAMP.armThick, LAMP.armLower, LAMP.armThick]} />
          <meshStandardMaterial color={C.lampMetal} roughness={0.35} metalness={0.8} />
        </mesh>

        {/* Joint */}
        <group position={[0, LAMP.armLower, 0]}>
          <mesh>
            <sphereGeometry args={[LAMP.armThick * 0.8, 8, 8]} />
            <meshStandardMaterial color={C.lampMetal} roughness={0.35} metalness={0.8} />
          </mesh>

          {/* Upper arm */}
          <group rotation={[upperAngle, 0, 0]}>
            <mesh position={[0, LAMP.armUpper / 2, 0]} castShadow>
              <boxGeometry args={[LAMP.armThick, LAMP.armUpper, LAMP.armThick]} />
              <meshStandardMaterial color={C.lampMetal} roughness={0.35} metalness={0.8} />
            </mesh>

            {/* Lamp head / shade */}
            <group position={[0, LAMP.armUpper, 0]}>
              <mesh castShadow>
                <boxGeometry args={[LAMP.headW, LAMP.headH, LAMP.headD]} />
                <meshStandardMaterial color={C.lampMetal} roughness={0.3} metalness={0.7} />
              </mesh>
              {/* Light bulb glow plane */}
              <mesh position={[0, -LAMP.headH / 2 - 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[LAMP.headW * 0.35, 16]} />
                <meshStandardMaterial
                  color={C.lampWarm}
                  emissive={C.lampWarm}
                  emissiveIntensity={2}
                />
              </mesh>
              {/* Warm point light */}
              <pointLight
                position={[0, -0.08, 0]}
                intensity={12}
                color={C.lampWarm}
                distance={3.5}
                decay={2}
                castShadow
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

/* ── LED Strip (behind desk glow) ───────────────── */

function LedStrip({ position, width }: { position: [number, number, number]; width: number }) {
  return (
    <group position={position}>
      {/* Thin glowing strip */}
      <mesh>
        <boxGeometry args={[width, 0.008, 0.008]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      {/* Accent glow on wall */}
      <pointLight
        position={[0, 0, -0.1]}
        intensity={4}
        color="#8b5cf6"
        distance={2}
        decay={2}
      />
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   Sprint 2 Components
   ═══════════════════════════════════════════════════ */

/* ── Office Chair ───────────────────────────────── */

function OfficeChair({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const numLegs = 5;
  return (
    <group position={position} rotation={rotation}>
      {/* Star base — 5 arms with wheels */}
      {Array.from({ length: numLegs }).map((_, i) => {
        const angle = (i / numLegs) * Math.PI * 2;
        const wx = Math.sin(angle) * CHAIR.legSpread;
        const wz = Math.cos(angle) * CHAIR.legSpread;
        return (
          <group key={i}>
            {/* Arm: group rotated around Y so arm points outward, cylinder is horizontal along X */}
            <group rotation={[0, -angle, 0]}>
              <mesh
                position={[CHAIR.legSpread / 2, CHAIR.wheelR, 0]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <cylinderGeometry args={[CHAIR.legR, CHAIR.legR, CHAIR.legSpread, 6]} />
                <meshStandardMaterial color={C.chairFrame} roughness={0.3} metalness={0.9} />
              </mesh>
            </group>
            {/* Wheel */}
            <mesh position={[wx, CHAIR.wheelR, wz]} rotation={[0, angle, Math.PI / 2]}>
              <cylinderGeometry args={[CHAIR.wheelR, CHAIR.wheelR, 0.025, 8]} />
              <meshStandardMaterial color="#0a0a0a" roughness={0.7} metalness={0.3} />
            </mesh>
          </group>
        );
      })}

      {/* Center pole (gas lift) */}
      <mesh position={[0, CHAIR.wheelR * 2 + CHAIR.poleH / 2, 0]}>
        <cylinderGeometry args={[CHAIR.poleR, CHAIR.poleR * 0.8, CHAIR.poleH, 8]} />
        <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Seat */}
      <mesh position={[0, CHAIR.seatY, 0]} castShadow>
        <boxGeometry args={[CHAIR.seatW, CHAIR.seatH, CHAIR.seatD]} />
        <meshStandardMaterial color={C.chairCushion} roughness={0.75} metalness={0} />
      </mesh>

      {/* Seat cushion top (slightly softer) */}
      <mesh position={[0, CHAIR.seatY + CHAIR.seatH / 2 + 0.005, 0]}>
        <boxGeometry args={[CHAIR.seatW - 0.04, 0.01, CHAIR.seatD - 0.04]} />
        <meshStandardMaterial color={C.chairLeather} roughness={0.8} metalness={0} />
      </mesh>

      {/* Backrest */}
      <mesh
        position={[0, CHAIR.seatY + CHAIR.seatH / 2 + CHAIR.backH / 2 + 0.02, -CHAIR.seatD / 2 + CHAIR.backThick / 2]}
        castShadow
      >
        <boxGeometry args={[CHAIR.backW, CHAIR.backH, CHAIR.backThick]} />
        <meshStandardMaterial color={C.chairLeather} roughness={0.75} metalness={0} />
      </mesh>

      {/* Backrest lumbar curve (bulge) */}
      <mesh
        position={[0, CHAIR.seatY + CHAIR.seatH / 2 + CHAIR.backH * 0.3, -CHAIR.seatD / 2 + CHAIR.backThick + 0.01]}
      >
        <boxGeometry args={[CHAIR.backW - 0.06, 0.12, 0.02]} />
        <meshStandardMaterial color={C.chairCushion} roughness={0.8} metalness={0} />
      </mesh>

      {/* Left armrest */}
      <Armrest position={[-CHAIR.seatW / 2 + 0.04, CHAIR.seatY + CHAIR.armrestH / 2 + CHAIR.seatH / 2, 0]} />
      {/* Right armrest */}
      <Armrest position={[CHAIR.seatW / 2 - 0.04, CHAIR.seatY + CHAIR.armrestH / 2 + CHAIR.seatH / 2, 0]} />
    </group>
  );
}

function Armrest({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Vertical support */}
      <mesh>
        <boxGeometry args={[0.025, CHAIR.armrestH, 0.025]} />
        <meshStandardMaterial color={C.chairFrame} roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Padded top */}
      <mesh position={[0, CHAIR.armrestH / 2, 0.04]}>
        <boxGeometry args={[CHAIR.armrestW, 0.02, CHAIR.armrestD]} />
        <meshStandardMaterial color={C.chairCushion} roughness={0.8} metalness={0} />
      </mesh>
    </group>
  );
}

/* ── Vertical Side Monitor (on arm) ───────────── */

function VerticalMonitor({
  position,
  onSelect,
}: {
  position: [number, number, number];
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const armLength = 0.2;

  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onPointerDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Monitor arm — clamp at desk edge (simplified) */}
      {/* Arm pole — length extended to reach desk surface */}
      <mesh position={[0.08, -0.148, -0.02]}>
        <cylinderGeometry args={[0.015, 0.015, 0.28, 8]} />
        <meshStandardMaterial color={C.metalFrame} roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Horizontal arm segment */}
      <mesh position={[-0.02, 0, -0.02]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, armLength, 8]} />
        <meshStandardMaterial color={C.metalFrame} roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Screen body (portrait orientation) */}
      <mesh castShadow>
        <boxGeometry args={[SIDE_MONITOR.width, SIDE_MONITOR.height, SIDE_MONITOR.depth]} />
        <meshStandardMaterial
          color={C.monitorBezel}
          roughness={0.08}
          metalness={0.85}
          emissive={hovered ? '#00ffaa' : '#000000'}
          emissiveIntensity={hovered ? 0.04 : 0}
        />
      </mesh>

      {/* Screen face — terminal green feel */}
      <mesh position={[0, 0, SIDE_MONITOR.depth / 2 + 0.001]}>
        <planeGeometry
          args={[
            SIDE_MONITOR.width - SIDE_MONITOR.bezelWidth * 2,
            SIDE_MONITOR.height - SIDE_MONITOR.bezelWidth * 2,
          ]}
        />
        <meshStandardMaterial
          color="#0a2a20"
          emissive="#0fa"
          emissiveIntensity={hovered ? 0.5 : 0.3}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Html skills terminal overlay */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, SIDE_MONITOR.depth / 2 + 0.003]}
        scale={0.00245}
        center
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            width: '124px',
            height: '215px',
            color: '#4ade80',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '8.5px',
            padding: '8px',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div style={{ color: '#86efac', fontSize: '7.5px', marginBottom: '6px', letterSpacing: '0.08em' }}>
            ◈ SKILLS.JSON
          </div>
          {skillsData.map((group, gi) => (
            <div key={gi} style={{ marginBottom: '6px' }}>
              <div style={{ color: '#22d3ee', fontSize: '7px', marginBottom: '2px' }}>
                {group.category.toUpperCase()}
              </div>
              {group.skills.map((s: { name: string }, si: number) => (
                <div key={si} style={{ color: '#86efac', fontSize: '8px', paddingLeft: '6px', lineHeight: 1.6 }}>
                  › {s.name}
                </div>
              ))}
            </div>
          ))}
          <div style={{ color: '#166534', fontSize: '7px', marginTop: '4px' }}>
            click to explore ↗
          </div>
        </div>
      </Html>

      {/* Subtle green glow from code screen */}
      <pointLight
        position={[0, 0, 0.1]}
        intensity={hovered ? 2 : 1}
        color="#0fa"
        distance={1.5}
        decay={2}
      />
    </group>
  );
}

/* ── Headphone Stand + Headphones ───────────────── */

function HeadphoneStand({ position }: { position: [number, number, number] }) {
  const standH = 0.26;
  const hookW = 0.1;

  return (
    <group position={position}>
      {/* Stand base plate */}
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.008, 0.08]} />
        <meshStandardMaterial color={C.standMetal} roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Stand pole */}
      <mesh position={[0, standH / 2 + 0.004, 0]}>
        <cylinderGeometry args={[0.01, 0.012, standH, 8]} />
        <meshStandardMaterial color={C.standMetal} roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Hook / top arm */}
      <mesh position={[0, standH + 0.01, hookW / 2 - 0.01]}>
        <boxGeometry args={[0.02, 0.015, hookW]} />
        <meshStandardMaterial color={C.standMetal} roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Rounded tip */}
      <mesh position={[0, standH + 0.01, hookW - 0.01]} rotation={[0, 0, Math.PI / 2]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color={C.standMetal} roughness={0.3} metalness={0.85} />
      </mesh>

      {/* ─ Headphones draped over stand ─ */}
      <group position={[0, standH - 0.02, hookW / 2]}>
        {/* Headband (arc) — simplified as a curved cylinder */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.075, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color={C.headphoneBand} roughness={0.6} metalness={0.2} />
        </mesh>

        {/* Left ear cup */}
        <mesh position={[-0.075, -0.01, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.025, 12]} />
          <meshStandardMaterial color={C.headphoneCup} roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Left cushion */}
        <mesh position={[-0.075, -0.01, 0.014]}>
          <cylinderGeometry args={[0.032, 0.032, 0.004, 12]} />
          <meshStandardMaterial color={C.headphoneCushion} roughness={0.9} metalness={0} />
        </mesh>

        {/* Right ear cup */}
        <mesh position={[0.075, -0.01, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.025, 12]} />
          <meshStandardMaterial color={C.headphoneCup} roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Right cushion */}
        <mesh position={[0.075, -0.01, 0.014]}>
          <cylinderGeometry args={[0.032, 0.032, 0.004, 12]} />
          <meshStandardMaterial color={C.headphoneCushion} roughness={0.9} metalness={0} />
        </mesh>
      </group>
    </group>
  );
}

/* ── Coffee Mug ─────────────────────────────────── */

function CoffeeMug({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Mug body */}
      <mesh position={[0, MUG.height / 2, 0]} castShadow>
        <cylinderGeometry args={[MUG.topR, MUG.bottomR, MUG.height, 16]} />
        <meshStandardMaterial color={C.mugCeramic} roughness={0.4} metalness={0} />
      </mesh>

      {/* Coffee liquid inside (dark disk at top) */}
      <mesh position={[0, MUG.height - 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[MUG.topR - 0.003, 16]} />
        <meshStandardMaterial color={C.mugCoffee} roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Handle — torus section */}
      <mesh position={[MUG.topR + MUG.handleR * 0.5, MUG.height * 0.55, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[MUG.handleR, MUG.handleTube, 8, 12, Math.PI]} />
        <meshStandardMaterial color={C.mugCeramic} roughness={0.4} metalness={0} />
      </mesh>

      {/* Steam particles — animated wisps */}
      <SteamParticles position={[0, MUG.height + 0.01, 0]} />
    </group>
  );
}

/* ── Steam Particles ────────────────────────────── */

const STEAM_COUNT = 6;

function SteamParticles({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Each particle has offset phase & speed
  const particles = useMemo(
    () =>
      Array.from({ length: STEAM_COUNT }).map((_, i) => ({
        phase: (i / STEAM_COUNT) * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.2,
        xDrift: (Math.random() - 0.5) * 0.02,
        zDrift: (Math.random() - 0.5) * 0.02,
      })),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      const life = ((t * p.speed + p.phase) % 1.2); // 0..~1.2 cycle
      const y = life * 0.06;
      const opacity = life < 0.3 ? life / 0.3 : Math.max(0, 1 - (life - 0.3) / 0.9);
      const scale = 0.003 + life * 0.005;

      dummy.position.set(p.xDrift * life * 3, y, p.zDrift * life * 3);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={position}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, STEAM_COUNT]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color={C.steam} transparent opacity={0.25} depthWrite={false} />
      </instancedMesh>
    </group>
  );
}

/* ── Desktop Speaker ────────────────────────────── */

function DesktopSpeaker({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Speaker body */}
      <mesh position={[0, SPEAKER.height / 2, 0]} castShadow>
        <boxGeometry args={[SPEAKER.width, SPEAKER.height, SPEAKER.depth]} />
        <meshStandardMaterial color={C.speakerBody} roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Front grill */}
      <mesh position={[0, SPEAKER.height / 2, SPEAKER.depth / 2 + 0.001]}>
        <planeGeometry args={[SPEAKER.width - 0.008, SPEAKER.height - 0.012]} />
        <meshStandardMaterial color={C.speakerGrill} roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Driver cone (circle on grill) */}
      <mesh position={[0, SPEAKER.height * 0.6, SPEAKER.depth / 2 + 0.003]}>
        <circleGeometry args={[SPEAKER.driverR, 16]} />
        <meshStandardMaterial color={C.speakerDriver} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Small tweeter */}
      <mesh position={[0, SPEAKER.height * 0.82, SPEAKER.depth / 2 + 0.003]}>
        <circleGeometry args={[SPEAKER.driverR * 0.4, 12]} />
        <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Status LED (tiny teal dot) */}
      <mesh position={[0, SPEAKER.height * 0.12, SPEAKER.depth / 2 + 0.003]}>
        <circleGeometry args={[0.003, 8]} />
        <meshStandardMaterial
          color={C.screenGlow}
          emissive={C.screenGlow}
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
}

/* ── Monitor Light Bar (BenQ ScreenBar style) ──── */

function MonitorLightBar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Light bar body — sits on top of monitor */}
      <mesh castShadow>
        <boxGeometry args={[LIGHTBAR.width, LIGHTBAR.height, LIGHTBAR.depth]} />
        <meshStandardMaterial color={C.lightbarBody} roughness={0.15} metalness={0.7} />
      </mesh>

      {/* Light-emitting underside */}
      <mesh position={[0, -LIGHTBAR.height / 2 - 0.001, LIGHTBAR.depth * 0.2]}>
        <planeGeometry args={[LIGHTBAR.width - 0.02, LIGHTBAR.depth * 0.5]} />
        <meshStandardMaterial
          color={C.lightbarGlow}
          emissive={C.lightbarGlow}
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Warm downlight — illuminates the keyboard/desk area */}
      <pointLight
        position={[0, -0.04, 0.05]}
        intensity={4}
        color="#fff0d6"
        distance={1.5}
        decay={2}
      />

      {/* Clip/mount behind monitor top */}
      <mesh position={[0, -0.005, -LIGHTBAR.depth / 2 - 0.008]}>
        <boxGeometry args={[0.03, 0.025, 0.02]} />
        <meshStandardMaterial color={C.lightbarBody} roughness={0.2} metalness={0.7} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   Sprint 3 Components — Window & Atmosphere
   ═══════════════════════════════════════════════════ */

/* ── Night Window ───────────────────────────────── */

function NightWindow({ position }: { position: [number, number, number] }) {
  const halfW = WINDOW.width / 2;
  const halfH = WINDOW.height / 2;
  const fw = WINDOW.frameW;
  const fd = WINDOW.frameD;

  // Pane dimensions (inside frame, split by muntins)
  const paneW = (WINDOW.width - fw * 2 - WINDOW.muntinW * (WINDOW.paneCols - 1)) / WINDOW.paneCols;
  const paneH = (WINDOW.height - fw * 2 - WINDOW.muntinW * (WINDOW.paneRows - 1)) / WINDOW.paneRows;

  return (
    <group position={position}>
      {/* ── Outer frame ─────────────────────── */}
      {/* Top */}
      <mesh position={[0, halfH - fw / 2, 0]} castShadow>
        <boxGeometry args={[WINDOW.width, fw, fd]} />
        <meshStandardMaterial color={C.windowFrame} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -halfH + fw / 2, 0]} castShadow>
        <boxGeometry args={[WINDOW.width, fw, fd]} />
        <meshStandardMaterial color={C.windowFrame} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Left */}
      <mesh position={[-halfW + fw / 2, 0, 0]} castShadow>
        <boxGeometry args={[fw, WINDOW.height, fd]} />
        <meshStandardMaterial color={C.windowFrame} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Right */}
      <mesh position={[halfW - fw / 2, 0, 0]} castShadow>
        <boxGeometry args={[fw, WINDOW.height, fd]} />
        <meshStandardMaterial color={C.windowFrame} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* ── Muntins (dividers) ──────────────── */}
      {/* Vertical muntins */}
      {Array.from({ length: WINDOW.paneCols - 1 }).map((_, i) => {
        const x = -halfW + fw + (i + 1) * (paneW + WINDOW.muntinW) - WINDOW.muntinW / 2;
        return (
          <mesh key={`mv${i}`} position={[x, 0, 0]}>
            <boxGeometry args={[WINDOW.muntinW, WINDOW.height - fw * 2, fd * 0.5]} />
            <meshStandardMaterial color={C.windowFrame} roughness={0.5} metalness={0.4} />
          </mesh>
        );
      })}
      {/* Horizontal muntin */}
      {Array.from({ length: WINDOW.paneRows - 1 }).map((_, i) => {
        const y = -halfH + fw + (i + 1) * (paneH + WINDOW.muntinW) - WINDOW.muntinW / 2;
        return (
          <mesh key={`mh${i}`} position={[0, y, 0]}>
            <boxGeometry args={[WINDOW.width - fw * 2, WINDOW.muntinW, fd * 0.5]} />
            <meshStandardMaterial color={C.windowFrame} roughness={0.5} metalness={0.4} />
          </mesh>
        );
      })}

      {/* ── Window sill ─────────────────────── */}
      <mesh position={[0, -halfH - WINDOW.sillH / 2, WINDOW.sillD / 2 - fd / 2]} castShadow>
        <boxGeometry args={[WINDOW.width + 0.1, WINDOW.sillH, WINDOW.sillD]} />
        <meshStandardMaterial color={C.windowSill} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* ── Night sky backdrop ──────────────── */}
      <NightSkyBackdrop
        width={WINDOW.width - fw * 2 + 0.01}
        height={WINDOW.height - fw * 2 + 0.01}
      />

      {/* ── Moonlight spill through window ──── */}
      <spotLight
        position={[0, 0.5, 1.5]}
        target-position={[0, -1, 3]}
        intensity={3}
        color="#b3d4fc"
        distance={6}
        decay={2}
        angle={0.6}
        penumbra={0.8}
      />
    </group>
  );
}

/* ── Night Sky / Cityscape Backdrop ─────────────── */

function NightSkyBackdrop({ width, height }: { width: number; height: number }) {
  // Simple layered backdrop: gradient sky + city silhouette + tiny window lights
  return (
    <group position={[0, 0, 0.04]}>
      {/* Sky gradient — dark rainy night */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color='#060810' />
      </mesh>

      {/* Horizon glow — blue-grey rainy haze */}
      <mesh position={[0, -height * 0.25, 0.001]}>
        <planeGeometry args={[width, height * 0.5]} />
        <meshBasicMaterial color='#0d1825' transparent opacity={0.85} />
      </mesh>
      {/* Rain streaks on backdrop (static, for depth) */}
      {Array.from({ length: 40 }).map((_, i) => {
        const rx = (Math.sin(i * 7.9 + 1.1) * 0.48) * width;
        const ry = (Math.cos(i * 5.3 + 0.7) * 0.4) * height;
        return (
          <mesh key={`rs${i}`} position={[rx, ry, 0.003]}>
            <planeGeometry args={[0.003, 0.06 + (i % 4) * 0.02]} />
            <meshBasicMaterial color='#4477aa' transparent opacity={0.25 + (i % 3) * 0.06} />
          </mesh>
        );
      })}

      {/* City silhouette — a row of rectangular "buildings" */}
      <CityScape width={width} baseY={-height * 0.38} />

      {/* Moon */}
      <mesh position={[width * 0.3, height * 0.3, 0.003]}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial color="#ddeeff" />
      </mesh>
      {/* Moon glow halo */}
      <mesh position={[width * 0.3, height * 0.3, 0.002]}>
        <circleGeometry args={[0.18, 16]} />
        <meshBasicMaterial color="#667799" transparent opacity={0.15} />
      </mesh>

      {/* Stars — tiny dots */}
      {Array.from({ length: 20 }).map((_, i) => {
        const sx = (Math.sin(i * 7.3 + 1.2) * 0.45) * width;
        const sy = (Math.cos(i * 5.1 + 3.7) * 0.3 + 0.15) * height;
        const size = 0.005 + (i % 3) * 0.003;
        return (
          <mesh key={`star${i}`} position={[sx, sy, 0.004]}>
            <circleGeometry args={[size, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4 + (i % 4) * 0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── City Silhouette ────────────────────────────── */

function CityScape({ width, baseY }: { width: number; baseY: number }) {
  // Procedural buildings
  const buildings = useMemo(() => {
    const b: { x: number; w: number; h: number; windows: { wx: number; wy: number }[] }[] = [];
    let cursor = -width / 2 + 0.02;
    let idx = 0;
    while (cursor < width / 2 - 0.05) {
      const bw = 0.06 + ((Math.sin(idx * 4.7) + 1) * 0.5) * 0.1;
      const bh = 0.08 + ((Math.cos(idx * 3.2) + 1) * 0.5) * 0.25;
      const gap = 0.01 + ((Math.sin(idx * 6.1) + 1) * 0.5) * 0.02;

      // Generate tiny window lights
      const wins: { wx: number; wy: number }[] = [];
      const cols = Math.floor(bw / 0.025);
      const rows = Math.floor(bh / 0.04);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // ~40% of windows are lit
          if (Math.sin(idx * 11.3 + r * 7.1 + c * 13.7) > 0.2) {
            wins.push({
              wx: -bw / 2 + 0.012 + c * (bw / Math.max(cols, 1)),
              wy: 0.02 + r * 0.035,
            });
          }
        }
      }

      b.push({ x: cursor + bw / 2, w: bw, h: bh, windows: wins });
      cursor += bw + gap;
      idx++;
    }
    return b;
  }, [width]);

  return (
    <group position={[0, baseY, 0.005]}>
      {buildings.map((b, i) => (
        <group key={`bld${i}`}>
          {/* Building body */}
          <mesh position={[b.x, b.h / 2, 0]}>
            <planeGeometry args={[b.w, b.h]} />
            <meshBasicMaterial color="#0a0a15" />
          </mesh>
          {/* Window lights */}
          {b.windows.map((w, j) => (
            <mesh key={`w${j}`} position={[b.x + w.wx, w.wy, 0.001]}>
              <planeGeometry args={[0.008, 0.012]} />
              <meshBasicMaterial
                color={C.cityLight}
                transparent
                opacity={0.5 + Math.sin(i * 3.3 + j * 2.1) * 0.3}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ── Animated Rain Droplets ─────────────────────── */

function RainDroplets({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-compute rain data
  const drops = useMemo(
    () =>
      Array.from({ length: RAIN_COUNT }).map((_, i) => ({
        x: (Math.sin(i * 7.9 + 2.1) * 0.5) * (WINDOW.width - WINDOW.frameW * 2),
        startY: (Math.cos(i * 5.3 + 0.8) * 0.5 + 0.5) * WINDOW.height,
        speed: 0.4 + Math.sin(i * 3.7) * 0.15 + Math.random() * 0.2,
        phase: Math.random(),
        scaleX: 0.001 + Math.random() * 0.001,
        scaleY: 0.008 + Math.random() * 0.012,
        xDrift: Math.sin(i * 11.3) * 0.0003, // slight horizontal drift
      })),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const halfH = (WINDOW.height - WINDOW.frameW * 2) / 2;

    drops.forEach((d, i) => {
      // cycle position
      const cycle = ((t * d.speed + d.phase) % 1.0);
      const y = halfH - cycle * (WINDOW.height - WINDOW.frameW * 2);
      const x = d.x + d.xDrift * t * 10;
      // Fade near edges
      const fade = cycle < 0.05 ? cycle / 0.05 : cycle > 0.9 ? (1 - cycle) / 0.1 : 1;

      dummy.position.set(x, y, 0);
      dummy.scale.set(d.scaleX / 0.005, (d.scaleY / 0.005) * 2.5 * Math.max(fade, 0.3), 1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={position}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, RAIN_COUNT]}>
        <planeGeometry args={[0.005, 0.005]} />
        <meshBasicMaterial
          color='#99ccff'
          transparent
          opacity={0.75}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </group>
  );
}

/* ── Floating Dust Motes ────────────────────────── */

function DustMotes() {
  // Subtle golden dust particles floating near desk lamp area
  return (
    <>
      {/* Main dust cloud near desk lamp warm light cone */}
      <Sparkles
        count={40}
        size={1.5}
        scale={[2.5, 2, 1.5]}
        position={[0.8, 1.6, -2.2]}
        speed={0.15}
        opacity={0.3}
        color={C.dustGold}
      />
      {/* Wider ambient dust in room */}
      <Sparkles
        count={25}
        size={1}
        scale={[5, 3, 4]}
        position={[0, 1.8, -1]}
        speed={0.08}
        opacity={0.15}
        color="#ccbb99"
      />
    </>
  );
}

/* ── Ceiling Pendant Lamp ───────────────────────── */

function PendantLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Ceiling mount plate */}
      <mesh position={[0, -0.005, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.01, 12]} />
        <meshStandardMaterial color={C.pendantMetal} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Cord */}
      <mesh position={[0, -PENDANT.cordLength / 2, 0]}>
        <cylinderGeometry args={[PENDANT.cordR, PENDANT.cordR, PENDANT.cordLength, 6]} />
        <meshStandardMaterial color="#111111" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Shade — truncated cone */}
      <mesh position={[0, -PENDANT.cordLength - PENDANT.shadeH / 2, 0]} castShadow>
        <cylinderGeometry args={[PENDANT.shadeTopR, PENDANT.shadeBotR, PENDANT.shadeH, 16, 1, true]} />
        <meshStandardMaterial
          color={C.pendantShade}
          roughness={0.6}
          metalness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner glow disc (simulates bulb visible from below) */}
      <mesh
        position={[0, -PENDANT.cordLength - PENDANT.shadeH + 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[PENDANT.shadeBotR - 0.01, 12]} />
        <meshStandardMaterial
          color={C.pendantGlow}
          emissive={C.pendantGlow}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Warm overhead point light */}
      <pointLight
        position={[0, -PENDANT.cordLength - PENDANT.shadeH - 0.05, 0]}
        intensity={5}
        color="#ffe8cc"
        distance={4}
        decay={2}
      />
    </group>
  );
}

/* ═══════════════════════════════════════════════════
   Sprint 4 Components — Personalization & Nature
   ═══════════════════════════════════════════════════ */

/* ── Floor Plant (Monstera-style) ───────────────── */

function FloorPlant({ position }: { position: [number, number, number] }) {
  // Large potted plant with multiple leaves at different angles
  const leaves = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => {
        const angle = (i / 7) * Math.PI * 2 + Math.sin(i * 3.1) * 0.3;
        const tilt = 0.3 + Math.sin(i * 2.7) * 0.25;
        const height = 0.5 + Math.sin(i * 4.3) * 0.15;
        const leafScale = 0.8 + Math.sin(i * 5.1) * 0.3;
        const shade = i % 3 === 0 ? C.leafDark : i % 3 === 1 ? C.leafGreen : C.leafLight;
        return { angle, tilt, height, leafScale, shade };
      }),
    []
  );

  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.3, 12]} />
        <meshStandardMaterial color={C.plantPot} roughness={0.8} metalness={0} />
      </mesh>
      {/* Pot rim */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.17, 0.16, 0.02, 12]} />
        <meshStandardMaterial color={C.plantPotRim} roughness={0.75} metalness={0} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.14, 12]} />
        <meshStandardMaterial color={C.plantSoil} roughness={0.95} metalness={0} />
      </mesh>

      {/* Stem cluster */}
      <group position={[0, 0.3, 0]}>
        {leaves.map((leaf, i) => (
          <group key={`leaf${i}`} rotation={[0, leaf.angle, 0]}>
            {/* Stem */}
            <group rotation={[leaf.tilt, 0, 0]}>
              <mesh position={[0, leaf.height / 2, 0]}>
                <cylinderGeometry args={[0.006, 0.008, leaf.height, 6]} />
                <meshStandardMaterial color="#2a4a2a" roughness={0.8} metalness={0} />
              </mesh>
              {/* Leaf blade (elliptical plane) — simplified as a scaled circle */}
              <group position={[0, leaf.height, 0]} rotation={[0.3, 0, 0.2 * (i % 2 === 0 ? 1 : -1)]}>
                <mesh scale={[leaf.leafScale * 0.12, 1, leaf.leafScale * 0.18]} castShadow>
                  <sphereGeometry args={[1, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
                  <meshStandardMaterial
                    color={leaf.shade}
                    roughness={0.7}
                    metalness={0}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ── Desk Succulent ─────────────────────────────── */

function DeskSucculent({ position }: { position: [number, number, number] }) {
  const petals = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const tilt = 0.5 + (i % 2) * 0.2;
        const scale = 0.6 + (i % 3) * 0.15;
        return { angle, tilt, scale };
      }),
    []
  );

  return (
    <group position={position}>
      {/* Mini pot */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.028, 0.04, 10]} />
        <meshStandardMaterial color={C.succulentPot} roughness={0.6} metalness={0} />
      </mesh>
      {/* Soil disk */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.032, 10]} />
        <meshStandardMaterial color={C.plantSoil} roughness={0.95} metalness={0} />
      </mesh>

      {/* Succulent rosette */}
      <group position={[0, 0.045, 0]}>
        {/* Center bud */}
        <mesh>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color="#5a9a6a" roughness={0.7} metalness={0} />
        </mesh>
        {/* Petals / leaves radiating out */}
        {petals.map((p, i) => (
          <group key={`sp${i}`} rotation={[0, p.angle, 0]}>
            <mesh
              position={[0.02 * p.scale, 0, 0]}
              rotation={[0, 0, p.tilt]}
              scale={[p.scale * 0.015, 0.008, 0.01]}
            >
              <sphereGeometry args={[1, 6, 6]} />
              <meshStandardMaterial color={C.succulentGreen} roughness={0.6} metalness={0} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ── Photo Frame ───────────────────────────────── */

function PhotoFrame({ position }: { position: [number, number, number] }) {
  const frameW = 0.1;
  const frameH = 0.08;
  const border = 0.006;
  const matBorder = 0.008;

  return (
    <group position={position}>
      {/* Frame stand — slight lean-back */}
      <group rotation={[-0.15, 0.1, 0]}>
        {/* Frame border */}
        <mesh position={[0, frameH / 2 + 0.005, 0]} castShadow>
          <boxGeometry args={[frameW, frameH, 0.008]} />
          <meshStandardMaterial color={C.frameWood} roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Mat / passepartout */}
        <mesh position={[0, frameH / 2 + 0.005, 0.004]}>
          <planeGeometry args={[frameW - border * 2, frameH - border * 2]} />
          <meshStandardMaterial color={C.frameMat} roughness={0.85} metalness={0} />
        </mesh>
        {/* Photo placeholder */}
        <mesh position={[0, frameH / 2 + 0.005, 0.005]}>
          <planeGeometry args={[frameW - border * 2 - matBorder * 2, frameH - border * 2 - matBorder * 2]} />
          <meshStandardMaterial color={C.photoPlaceholder} roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Back stand leg */}
        <mesh position={[0, 0.02, -0.02]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.006, 0.06, 0.003]} />
          <meshStandardMaterial color={C.frameWood} roughness={0.6} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

/* ── Robot Figurine ─────────────────────────────── */

function RobotFigurine({
  position,
  onSelect,
}: {
  position: [number, number, number];
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onPointerDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Hover glow */}
      {hovered && (
        <pointLight position={[0, 0.06, 0.05]} intensity={3} color={C.figurineAccent} distance={0.4} decay={2} />
      )}
      {/* Body */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[0.03, 0.035, 0.02]} />
        <meshStandardMaterial color={C.figurineBody} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.07, 0]} castShadow>
        <boxGeometry args={[0.025, 0.022, 0.02]} />
        <meshStandardMaterial color={C.figurineBody} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Eyes (2 teal dots) */}
      <mesh position={[-0.006, 0.073, 0.011]}>
        <sphereGeometry args={[0.003, 6, 6]} />
        <meshStandardMaterial
          color={C.figurineAccent}
          emissive={C.figurineAccent}
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0.006, 0.073, 0.011]}>
        <sphereGeometry args={[0.003, 6, 6]} />
        <meshStandardMaterial
          color={C.figurineAccent}
          emissive={C.figurineAccent}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 0.088, 0]}>
        <cylinderGeometry args={[0.002, 0.002, 0.015, 4]} />
        <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Antenna tip */}
      <mesh position={[0, 0.096, 0]}>
        <sphereGeometry args={[0.003, 6, 6]} />
        <meshStandardMaterial
          color={C.figurineAccent}
          emissive={C.figurineAccent}
          emissiveIntensity={1}
        />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.022, 0.04, 0]}>
        <boxGeometry args={[0.008, 0.025, 0.01]} />
        <meshStandardMaterial color={C.figurineBody} roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.022, 0.04, 0]}>
        <boxGeometry args={[0.008, 0.025, 0.01]} />
        <meshStandardMaterial color={C.figurineBody} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.008, 0.012, 0]}>
        <boxGeometry args={[0.01, 0.024, 0.012]} />
        <meshStandardMaterial color="#999999" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0.008, 0.012, 0]}>
        <boxGeometry args={[0.01, 0.024, 0.012]} />
        <meshStandardMaterial color="#999999" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Chest panel accent */}
      <mesh position={[0, 0.042, 0.011]}>
        <planeGeometry args={[0.016, 0.012]} />
        <meshStandardMaterial
          color={C.figurineAccent}
          emissive={C.figurineAccent}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

/* ── Wall Poster / Art ──────────────────────────── */

function WallPoster({
  position,
  rotation = [0, 0, 0],
  small = false,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  small?: boolean;
}) {
  const w = small ? 0.35 : 0.5;
  const h = small ? 0.25 : 0.65;
  const border = 0.02;

  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[w, h, 0.02]} />
        <meshStandardMaterial color={C.posterFrame} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Art area */}
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[w - border * 2, h - border * 2]} />
        <meshStandardMaterial color={C.posterArt} roughness={0.5} metalness={0.05} />
      </mesh>

      {/* Abstract art decoration — geometric shapes */}
      {!small && (
        <>
          {/* Horizontal lines */}
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={`line${i}`} position={[-0.02 + i * 0.04, 0.08, 0.012]}>
              <planeGeometry args={[0.12, 0.003]} />
              <meshBasicMaterial color={C.screenGlow} transparent opacity={0.6 - i * 0.1} />
            </mesh>
          ))}
          {/* Circle accent */}
          <mesh position={[0, -0.1, 0.012]}>
            <ringGeometry args={[0.04, 0.055, 16]} />
            <meshBasicMaterial color={C.screenGlow} transparent opacity={0.4} />
          </mesh>
          {/* Small square */}
          <mesh position={[0.08, 0.15, 0.012]}>
            <planeGeometry args={[0.04, 0.04]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.35} />
          </mesh>
        </>
      )}
      {small && (
        <>
          {/* Simple geometric shapes for smaller poster */}
          <mesh position={[0, 0, 0.012]}>
            <circleGeometry args={[0.06, 16]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.25} />
          </mesh>
          <mesh position={[0.04, -0.03, 0.012]}>
            <planeGeometry args={[0.05, 0.05]} />
            <meshBasicMaterial color={C.screenGlow} transparent opacity={0.2} />
          </mesh>
        </>
      )}
    </group>
  );
}

/* ── Floating Shelf + Books ─────────────────────── */

function FloatingShelf({ position }: { position: [number, number, number] }) {
  const bookColors = [
    C.bookSpine1, C.bookSpine2, C.bookSpine3,
    C.bookSpine4, C.bookSpine5, C.bookSpine6, C.bookSpine7,
  ];

  // Pre-generate books
  const books = useMemo(() => {
    const result: { x: number; w: number; h: number; color: string; lean: number }[] = [];
    let cursor = -SHELF.width / 2 + 0.03;
    let idx = 0;
    while (cursor < SHELF.width / 2 - 0.06 && idx < 12) {
      const w = BOOK.minW + ((Math.sin(idx * 7.3) + 1) * 0.5) * (BOOK.maxW - BOOK.minW);
      const h = BOOK.minH + ((Math.cos(idx * 5.1) + 1) * 0.5) * (BOOK.maxH - BOOK.minH);
      const gap = 0.002 + ((Math.sin(idx * 3.2) + 1) * 0.5) * 0.004;
      const lean = idx === 5 ? 0.08 : idx === 9 ? -0.06 : 0; // some books lean
      const color = bookColors[idx % bookColors.length]!;
      result.push({ x: cursor + w / 2, w, h, color, lean });
      cursor += w + gap;
      idx++;
    }
    return result;
  }, []);

  return (
    <group position={position}>
      {/* Shelf plank */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[SHELF.width, SHELF.thick, SHELF.depth]} />
        <meshStandardMaterial color={C.shelfWood} roughness={0.65} metalness={0} />
      </mesh>

      {/* Shelf brackets (2x, attached to wall) */}
      {[-SHELF.width * 0.3, SHELF.width * 0.3].map((bx, i) => (
        <group key={`bracket${i}`} position={[bx, 0, 0]}>
          {/* Vertical part */}
          <mesh position={[0, -SHELF.bracketH / 2 - SHELF.thick / 2, -SHELF.depth / 2 + SHELF.bracketW]}>
            <boxGeometry args={[SHELF.bracketW, SHELF.bracketH, SHELF.bracketW]} />
            <meshStandardMaterial color={C.metalFrame} roughness={0.3} metalness={0.85} />
          </mesh>
          {/* Horizontal part */}
          <mesh position={[0, -SHELF.thick / 2 - SHELF.bracketW / 2, 0]}>
            <boxGeometry args={[SHELF.bracketW, SHELF.bracketW, SHELF.depth]} />
            <meshStandardMaterial color={C.metalFrame} roughness={0.3} metalness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Books standing on shelf */}
      <group position={[0, SHELF.thick / 2, 0]}>
        {books.map((b, i) => (
          <mesh
            key={`book${i}`}
            position={[b.x, b.h / 2, 0]}
            rotation={[0, 0, b.lean]}
            castShadow
          >
            <boxGeometry args={[b.w, b.h, BOOK.depth]} />
            <meshStandardMaterial color={b.color} roughness={0.7} metalness={0.05} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
/* ═══════════════════════════════════════════════════
   Sprint 5 Components
   ═══════════════════════════════════════════════════ */

/* ── Notebook (open book → Experience) ────────── */

function Notebook({
  position,
  onSelect,
}: {
  position: [number, number, number];
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pageW = NOTEBOOK.openW / 2 - NOTEBOOK.spineW / 2;
  const entries = cvData.experience.slice(0, 3);

  return (
    <group
      position={position}
      rotation={[0, Math.PI * 0.05, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onPointerDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Left page */}
      <mesh position={[-(pageW / 2 + NOTEBOOK.spineW / 2), 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[pageW, NOTEBOOK.pageH]} />
        <meshStandardMaterial color={C.notebookPage} roughness={0.88} metalness={0} />
      </mesh>

      {/* Right page */}
      <mesh position={[(pageW / 2 + NOTEBOOK.spineW / 2), 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[pageW, NOTEBOOK.pageH]} />
        <meshStandardMaterial color={C.notebookPage} roughness={0.88} metalness={0} />
      </mesh>

      {/* Spine */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[NOTEBOOK.spineW, NOTEBOOK.pageH]} />
        <meshStandardMaterial color={C.notebookSpine} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Ruled lines — right page decorative */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh
          key={`line${i}`}
          position={[pageW / 2 + NOTEBOOK.spineW / 2, 0.001, -NOTEBOOK.pageH / 2 + 0.02 + i * 0.022]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[pageW - 0.01, 0.001]} />
          <meshStandardMaterial color={C.notebookLine} roughness={0.9} metalness={0} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Hover glow */}
      {hovered && (
        <pointLight position={[0, 0.08, 0]} intensity={2} color={C.notebookSpine} distance={0.5} decay={2} />
      )}

      {/* Html experience overlay on right page */}
      <Html
        transform
        occlude="blending"
        position={[pageW / 2 + NOTEBOOK.spineW / 2, 0.003, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={0.0018}
        center
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            width: '64px',
            height: '100px',
            fontFamily: 'Georgia, serif',
            fontSize: '5.5px',
            padding: '4px',
            boxSizing: 'border-box',
            color: '#1a1a2e',
            overflow: 'hidden',
          }}
        >
          <div style={{ color: '#14b8a6', fontSize: '5px', fontWeight: 700, marginBottom: '4px', letterSpacing: '0.05em' }}>
            EXPERIENCE
          </div>
          {entries.map((exp, i) => (
            <div key={i} style={{ marginBottom: '4px' }}>
              <div style={{ fontWeight: 700, fontSize: '5px', color: '#0f172a' }}>{exp.company}</div>
              <div style={{ fontSize: '4.5px', color: '#475569', lineHeight: 1.3 }}>{exp.role}</div>
            </div>
          ))}
          <div style={{ color: '#94a3b8', fontSize: '4.5px', marginTop: '3px' }}>click →</div>
        </div>
      </Html>
    </group>
  );
}

/* ── Tablet (→ Contact) ────────────────────────── */

function Tablet({
  position,
  onSelect,
}: {
  position: [number, number, number];
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const contact = cvData.contact;

  return (
    <group
      position={position}
      rotation={[Math.PI / 5, 0, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onPointerDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      {/* Tablet body */}
      <mesh castShadow>
        <boxGeometry args={[TABLET.width, TABLET.height, TABLET.depth]} />
        <meshStandardMaterial
          color={C.tabletBody}
          roughness={0.2}
          metalness={0.8}
          emissive={hovered ? C.tabletGlow : '#000000'}
          emissiveIntensity={hovered ? 0.06 : 0}
        />
      </mesh>

      {/* Screen face */}
      <mesh position={[0, 0, TABLET.depth / 2 + 0.001]}>
        <planeGeometry args={[TABLET.width - TABLET.bezel * 2, TABLET.height - TABLET.bezel * 2]} />
        <meshStandardMaterial
          color={C.tabletScreen}
          emissive={C.tabletGlow}
          emissiveIntensity={hovered ? 0.6 : 0.35}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Screen glow light */}
      <pointLight
        position={[0, 0, 0.05]}
        intensity={hovered ? 2 : 0.8}
        color={C.tabletGlow}
        distance={0.8}
        decay={2}
      />

      {/* Html contact info overlay */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, TABLET.depth / 2 + 0.003]}
        scale={0.00175}
        center
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            width: '82px',
            height: '118px',
            color: '#e0f2fe',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '7.5px',
            padding: '7px',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div style={{ color: '#38bdf8', fontSize: '7px', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.1em' }}>
            CONTACT
          </div>
          <div style={{ marginBottom: '3px', color: '#bae6fd', fontSize: '6.5px' }}>
            ✉ {contact.email}
          </div>
          <div style={{ marginBottom: '3px', color: '#bae6fd', fontSize: '6.5px' }}>
            ☎ {contact.phone}
          </div>
          <div style={{ marginBottom: '3px', color: '#bae6fd', fontSize: '6.5px' }}>
            ⌂ {contact.location}
          </div>
          <div style={{ marginBottom: '3px', color: '#7dd3fc', fontSize: '6px' }}>
            github.com/Nektarios-I
          </div>
          <div style={{ color: '#475569', fontSize: '6px', marginTop: '5px' }}>
            click to expand →
          </div>
        </div>
      </Html>
    </group>
  );
}

/* =======================================================
   Sprint 6 Components — Polish & Magic
   ======================================================= */

/* ── PC Tower with Water Cooling ────────────────── */

function PCTower({ position }: { position: [number, number, number] }) {
  const fanRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (fanRef.current) fanRef.current.rotation.z = state.clock.elapsedTime * 3.5;
  });

  return (
    <group position={position}>
      {/* Main tower body */}
      <mesh position={[0, PC_TOWER.height / 2, 0]} castShadow>
        <boxGeometry args={[PC_TOWER.width, PC_TOWER.height, PC_TOWER.depth]} />
        <meshStandardMaterial color={C.pcBody} roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Tempered glass side panel */}
      <mesh position={[-PC_TOWER.width / 2 - 0.001, PC_TOWER.height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[PC_TOWER.depth - 0.01, PC_TOWER.height - 0.01]} />
        <meshStandardMaterial
          color={C.pcAcrylic}
          transparent
          opacity={0.18}
          roughness={0.04}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Internal RGB glow */}
      <pointLight position={[-PC_TOWER.width * 0.1, PC_TOWER.height / 2, 0]} intensity={5} color="#4422ff" distance={0.6} decay={2} />
      <pointLight position={[-PC_TOWER.width * 0.1, PC_TOWER.height * 0.3, 0]} intensity={3} color={C.coolantBlue} distance={0.5} decay={2} />
      {/* Motherboard glow panel */}
      <mesh position={[-PC_TOWER.width * 0.28, PC_TOWER.height * 0.45, 0.04]}>
        <planeGeometry args={[0.1, 0.14]} />
        <meshStandardMaterial color="#1a2244" emissive="#223366" emissiveIntensity={1.2} />
      </mesh>
      {/* Water CPU block */}
      <mesh position={[-PC_TOWER.width * 0.25, PC_TOWER.height * 0.72, 0.02]}>
        <boxGeometry args={[0.044, 0.044, 0.024]} />
        <meshStandardMaterial color={C.coolantBlue} emissive={C.coolantBlue} emissiveIntensity={2} transparent opacity={0.75} />
      </mesh>
      {/* Coolant tube */}
      <mesh position={[-PC_TOWER.width * 0.25, PC_TOWER.height * 0.62, 0.02]} rotation={[0.5, 0, 0.2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.12, 5]} />
        <meshStandardMaterial color={C.coolantBlue} emissive={C.coolantBlue} emissiveIntensity={1.2} transparent opacity={0.6} />
      </mesh>
      {/* Radiator */}
      <mesh position={[0, PC_TOWER.height - 0.022, PC_TOWER.depth * 0.18]}>
        <boxGeometry args={[PC_TOWER.width - 0.04, 0.018, PC_TOWER.depth * 0.38]} />
        <meshStandardMaterial color="#222234" roughness={0.4} metalness={0.65} />
      </mesh>
      {/* Fan spinner */}
      <group ref={fanRef} position={[0, PC_TOWER.height - 0.008, PC_TOWER.depth * 0.18]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, (i / 5) * Math.PI * 2]}>
            <boxGeometry args={[0.055, 0.007, 0.004]} />
            <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.7} />
          </mesh>
        ))}
      </group>
      {/* Power LED */}
      <mesh position={[0, PC_TOWER.height - 0.05, PC_TOWER.depth / 2 + 0.001]}>
        <circleGeometry args={[0.008, 8]} />
        <meshStandardMaterial color={C.coolantBlue} emissive={C.coolantBlue} emissiveIntensity={3} />
      </mesh>
      {/* USB ports */}
      {([-0.025, 0.025] as number[]).map((xo, i) => (
        <mesh key={i} position={[xo, PC_TOWER.height - 0.075, PC_TOWER.depth / 2 + 0.001]}>
          <boxGeometry args={[0.013, 0.007, 0.001]} />
          <meshStandardMaterial color="#111111" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Wall Decorative Shelves (records, books, figures) */

function WallDecoShelves({ position }: { position: [number, number, number] }) {
  const sw = 2.2;
  const sd = 0.14;
  const yOffsets = [0, -0.46, -0.92];
  const bookColors6 = [C.bookSpine1, C.bookSpine2, C.bookSpine3, C.bookSpine4, C.bookSpine5, C.bookSpine6];

  return (
    <group position={position}>
      {yOffsets.map((dy, si) => (
        <group key={si} position={[0, dy, 0]}>
          {/* Shelf plank */}
          <mesh castShadow>
            <boxGeometry args={[sw, 0.018, sd]} />
            <meshStandardMaterial color={C.shelfWood} roughness={0.65} metalness={0} />
          </mesh>
          {/* Wall brackets */}
          {([-sw * 0.38, sw * 0.38] as number[]).map((bx, bi) => (
            <group key={bi} position={[bx, 0, 0]}>
              <mesh position={[0, -0.062, -sd / 2 + 0.01]}>
                <boxGeometry args={[0.012, 0.115, 0.012]} />
                <meshStandardMaterial color={C.metalFrame} roughness={0.3} metalness={0.85} />
              </mesh>
              <mesh position={[0, -0.011, 0]}>
                <boxGeometry args={[0.012, 0.012, sd]} />
                <meshStandardMaterial color={C.metalFrame} roughness={0.3} metalness={0.85} />
              </mesh>
            </group>
          ))}
          <group position={[0, 0.01, 0]}>
            {/* Vinyl records on top shelf */}
            {si === 0 && Array.from({ length: 6 }).map((_, ri) => (
              <group key={ri} position={[-sw * 0.41 + ri * 0.145, 0.09, 0]} rotation={[0, 0, Math.sin(ri) * 0.06]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.085, 0.085, 0.006, 28]} />
                  <meshStandardMaterial color={C.vinylBlack} roughness={0.2} metalness={0.45} />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.001, 16]} />
                  <meshStandardMaterial color={(['#cc3322', '#2244cc', '#22aa44', '#cc8822', '#882299', '#cc2288'] as string[])[ri % 6]} roughness={0.5} metalness={0} />
                </mesh>
              </group>
            ))}
            {/* Books on all shelves */}
            {([0.24, 0.31, 0.37, 0.43, 0.50, 0.57, 0.64] as number[]).map((bx, bi) => (
              <mesh key={bi} position={[bx, 0.07 + (bi % 2) * 0.008, 0]} castShadow>
                <boxGeometry args={[0.022 + (bi % 3) * 0.006, 0.118 + (bi % 2) * 0.018, sd * 0.82]} />
                <meshStandardMaterial color={bookColors6[(si * 3 + bi) % 6]} roughness={0.7} metalness={0} />
              </mesh>
            ))}
            {/* Astronaut figurine on middle shelf */}
            {si === 1 && (
              <group position={[-0.56, 0, 0]}>
                <mesh position={[0, 0.036, 0]}>
                  <sphereGeometry args={[0.023, 8, 8]} />
                  <meshStandardMaterial color="#dddddd" roughness={0.4} metalness={0.3} />
                </mesh>
                <mesh position={[0, 0.070, 0]}>
                  <sphereGeometry args={[0.017, 8, 8]} />
                  <meshStandardMaterial color="#cccccc" roughness={0.3} metalness={0.4} />
                </mesh>
                <mesh position={[0, 0.072, 0.011]}>
                  <sphereGeometry args={[0.012, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                  <meshStandardMaterial color="#88aadd" transparent opacity={0.55} roughness={0.1} />
                </mesh>
              </group>
            )}
            {/* Mini succulent on bottom shelf */}
            {si === 2 && (
              <group position={[-0.62, 0, 0]}>
                <mesh position={[0, 0.022, 0]}>
                  <cylinderGeometry args={[0.022, 0.018, 0.042, 10]} />
                  <meshStandardMaterial color={C.succulentPot} roughness={0.6} metalness={0} />
                </mesh>
                {Array.from({ length: 5 }).map((_, li) => (
                  <mesh key={li} position={[Math.sin(li * Math.PI * 0.4) * 0.016, 0.052, Math.cos(li * Math.PI * 0.4) * 0.016]} rotation={[Math.PI * 0.2, li * Math.PI * 0.4, 0]}>
                    <sphereGeometry args={[0.009, 6, 6]} />
                    <meshStandardMaterial color={C.succulentGreen} roughness={0.5} metalness={0} />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        </group>
      ))}
    </group>
  );
}

/* ── Wall Bookcase ──────────────────────────────── */

function WallBookcase({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const bw = BOOKCASE.width;
  const bh = BOOKCASE.height;
  const bd = BOOKCASE.depth;
  const wt = BOOKCASE.wallThick;
  const sc = BOOKCASE.shelfCount;
  const shelfGap = (bh - wt * 2) / sc;

  const bookData = useMemo(() =>
    Array.from({ length: sc }, (_, si) =>
      Array.from({ length: 9 }, (_, bi) => ({
        w: 0.022 + Math.abs(Math.sin(si * 7 + bi * 5.1)) * 0.012,
        h: shelfGap * 0.76 + Math.cos(si * 4 + bi * 3.2) * 0.012,
        color: ([C.bookSpine1, C.bookSpine2, C.bookSpine3, C.bookSpine4, C.bookSpine5, C.bookSpine6, C.bookSpine7, '#4a2c2c', '#2c4a3a'] as string[])[(si * 3 + bi) % 9],
      }))
    )
    , [shelfGap, sc]);

  const bookInnerW = bw - wt * 2 - 0.01;

  return (
    <group position={position} rotation={rotation}>
      {/* Cabinet panels */}
      {([
        { pos: [0, bh / 2 - wt / 2, 0] as [number, number, number], size: [bw, wt, bd] as [number, number, number] },
        { pos: [0, -bh / 2 + wt / 2, 0] as [number, number, number], size: [bw, wt, bd] as [number, number, number] },
        { pos: [-bw / 2 + wt / 2, 0, 0] as [number, number, number], size: [wt, bh, bd] as [number, number, number] },
        { pos: [bw / 2 - wt / 2, 0, 0] as [number, number, number], size: [wt, bh, bd] as [number, number, number] },
        { pos: [0, 0, -bd / 2 + wt / 2] as [number, number, number], size: [bw, bh, wt] as [number, number, number] },
      ]).map((p, i) => (
        <mesh key={i} position={p.pos} castShadow>
          <boxGeometry args={p.size} />
          <meshStandardMaterial color={i === 4 ? '#2a1e14' : C.shelfWood} roughness={0.65} metalness={0} />
        </mesh>
      ))}
      {/* Horizontal shelves */}
      {Array.from({ length: sc }).map((_, i) => (
        <mesh key={i} position={[0, -bh / 2 + wt + (i + 0.5) * shelfGap, 0]}>
          <boxGeometry args={[bw - wt * 2, wt, bd - wt]} />
          <meshStandardMaterial color={C.walnutDark} roughness={0.65} metalness={0} />
        </mesh>
      ))}
      {/* Books */}
      {bookData.map((shelf, si) => {
        const shelfY = -bh / 2 + wt + si * shelfGap + wt;
        let curX = -bookInnerW / 2;
        return shelf.map((book, bi) => {
          const x = curX + book.w / 2;
          curX += book.w + 0.004;
          return (
            <mesh key={`b${si}-${bi}`} position={[x, shelfY + book.h / 2 + 0.003, 0]}>
              <boxGeometry args={[book.w, book.h, bd * 0.7]} />
              <meshStandardMaterial color={book.color} roughness={0.7} metalness={0} />
            </mesh>
          );
        });
      })}
    </group>
  );
}


/* ── Cat (sleeping, breathing animation) ────────── */

function Cat({ position }: { position: [number, number, number] }) {
  const bodyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (bodyRef.current) bodyRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 0.75) * 0.04;
  });

  return (
    <group position={position} rotation={[0, -0.5, 0]}>
      <mesh ref={bodyRef} position={[0, CAT.bodyH / 2, 0]} scale={[CAT.bodyL, CAT.bodyH, CAT.bodyL * 0.78]} castShadow>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color={C.catFur} roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[CAT.bodyL * 0.72, CAT.bodyH * 1.05, 0]} castShadow>
        <sphereGeometry args={[0.027, 10, 8]} />
        <meshStandardMaterial color={C.catFur} roughness={0.9} metalness={0} />
      </mesh>
      {([[-0.018, -0.3], [0.018, 0.3]] as [number, number][]).map(([zo, rot], i) => (
        <mesh key={i} position={[CAT.bodyL * 0.73, CAT.bodyH * 1.05 + 0.031, zo]} rotation={[0, 0, rot]}>
          <coneGeometry args={[0.011, 0.022, 4]} />
          <meshStandardMaterial color={C.catFur} roughness={0.9} metalness={0} />
        </mesh>
      ))}
      <mesh position={[-CAT.bodyL * 0.55, CAT.bodyH * 0.3, CAT.bodyL * 0.48]} rotation={[0.4, 0, 0.65]}>
        <cylinderGeometry args={[0.007, 0.011, CAT.bodyL * 0.88, 7]} />
        <meshStandardMaterial color={C.catFurDark} roughness={0.9} metalness={0} />
      </mesh>
      {([-0.01, 0.01] as number[]).map((zo, i) => (
        <mesh key={i} position={[CAT.bodyL * 0.72 + 0.021, CAT.bodyH * 1.04, zo]}>
          <boxGeometry args={[0.005, 0.001, 0.007]} />
          <meshStandardMaterial color="#553322" roughness={0.5} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Wall Clock (real time, animated) ───────────── */

function WallClock({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const hourRef = useRef<THREE.Mesh>(null);
  const minRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const now = new Date();
    const hrs = now.getHours() % 12 + now.getMinutes() / 60;
    const mns = now.getMinutes() + now.getSeconds() / 60;
    if (hourRef.current) hourRef.current.rotation.z = -(hrs / 12) * Math.PI * 2;
    if (minRef.current) minRef.current.rotation.z = -(mns / 60) * Math.PI * 2;
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[0.27, 0.27, 0.018]} />
        <meshStandardMaterial color={C.clockFace} roughness={0.5} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.128, 0.138, 40]} />
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.7} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.105, Math.cos(a) * 0.105, 0.012]}>
            <boxGeometry args={[0.005, 0.014, 0.002]} />
            <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.3} />
          </mesh>
        );
      })}
      <mesh ref={hourRef} position={[0, 0.026, 0.014]}>
        <boxGeometry args={[0.006, 0.054, 0.002]} />
        <meshStandardMaterial color="#111111" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh ref={minRef} position={[0, 0.037, 0.016]}>
        <boxGeometry args={[0.004, 0.075, 0.002]} />
        <meshStandardMaterial color="#222222" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.018]}>
        <cylinderGeometry args={[0.006, 0.006, 0.003, 8]} />
        <meshStandardMaterial color="#cc3333" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

/* ── Sticky Notes on Monitor Bezel ──────────────── */

function StickyNotes({ monitorBase }: { monitorBase: [number, number, number] }) {
  const [mx, my, mz] = monitorBase;
  const botY = my - MONITOR.height / 2 - 0.018;
  const notes = [
    { x: mx - MONITOR.width / 2 + 0.04, color: C.stickyYellow, rot: 0.1 },
    { x: mx - MONITOR.width / 2 + 0.12, color: C.stickyPink, rot: -0.06 },
    { x: mx + MONITOR.width / 2 - 0.09, color: C.stickyBlue, rot: 0.08 },
  ];
  return (
    <>
      {notes.map((n, i) => (
        <mesh key={i} position={[n.x, botY, mz + MONITOR.depth / 2]} rotation={[0, 0, n.rot]}>
          <boxGeometry args={[0.058, 0.055, 0.002]} />
          <meshStandardMaterial color={n.color} roughness={0.88} metalness={0} emissive={n.color} emissiveIntensity={0.08} />
        </mesh>
      ))}
    </>
  );
}

/* ── Vinyl Record Player ────────────────────────── */

function VinylPlayer({ position }: { position: [number, number, number] }) {
  const platterRef = useRef<THREE.Group>(null);
  useFrame((state) => { if (platterRef.current) platterRef.current.rotation.y = state.clock.elapsedTime * 0.45; });
  return (
    <group position={position}>
      <mesh position={[0, 0.013, 0]} castShadow>
        <boxGeometry args={[0.22, 0.026, 0.22]} />
        <meshStandardMaterial color="#130d08" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.089, 0.092, 0.01, 32]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.65} />
      </mesh>
      <group ref={platterRef} position={[0, 0.036, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.005, 32]} />
          <meshStandardMaterial color={C.vinylBlack} roughness={0.12} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.003, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.001, 16]} />
          <meshStandardMaterial color="#bb2222" roughness={0.5} metalness={0} />
        </mesh>
        {([0.038, 0.054, 0.068] as number[]).map((r, i) => (
          <mesh key={i} position={[0, 0.001, 0]}>
            <torusGeometry args={[r, 0.001, 4, 32]} />
            <meshStandardMaterial color="#191919" roughness={0.3} metalness={0.5} />
          </mesh>
        ))}
      </group>
      <mesh position={[0.074, 0.033, -0.064]}>
        <cylinderGeometry args={[0.007, 0.007, 0.009, 8]} />
        <meshStandardMaterial color="#666" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0.06, 0.04, -0.034]} rotation={[0, -0.3, 0.08]}>
        <cylinderGeometry args={[0.003, 0.003, 0.1, 6]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0.085, 0.027, 0.09]}>
        <circleGeometry args={[0.004, 8]} />
        <meshStandardMaterial color="#00bb44" emissive="#00bb44" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

/* ── Cable Bundle ───────────────────────────────── */

function CableBundle({ deskZ, deskY }: { deskZ: number; deskY: number }) {
  return (
    <group>
      <mesh position={[0.14, deskY * 0.5, deskZ - DESK.depth / 2 - 0.03]}>
        <cylinderGeometry args={[0.004, 0.004, deskY, 4]} />
        <meshStandardMaterial color="#111111" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh position={[0.21, deskY * 0.5, deskZ - DESK.depth / 2 - 0.04]}>
        <cylinderGeometry args={[0.003, 0.003, deskY, 4]} />
        <meshStandardMaterial color="#222222" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh position={[MONITOR.width / 2 + 0.04, deskY + 0.04, deskZ - 0.18]} rotation={[0.1, 0, 0.15]}>
        <cylinderGeometry args={[0.002, 0.002, 0.085, 4]} />
        <meshStandardMaterial color="#888888" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh position={[-0.04, deskY + 0.018, deskZ]} rotation={[0.2, 0, 0.1]}>
        <cylinderGeometry args={[0.002, 0.002, 0.12, 4]} />
        <meshStandardMaterial color="#333333" roughness={0.8} metalness={0.3} />
      </mesh>
    </group>
  );
}

/* ── ClickIndicator — bobbing green triangle above interactable objects ── */

function ClickIndicator({
  position,
  label,
}: {
  position: [number, number, number];
  label: string;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 2.2 + position[0]) * 0.04;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Downward-pointing triangle */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.022, 0.055, 3, 1]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={2.2}
          roughness={0.2}
          metalness={0}
        />
      </mesh>

      {/* Small label in world space via Html */}
      <Html
        center
        position={[0, 0.055, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            background: 'rgba(6,10,18,0.82)',
            border: '1px solid rgba(34,197,94,0.55)',
            borderRadius: '4px',
            padding: '2px 7px',
            fontSize: '9px',
            fontFamily: 'ui-monospace, monospace',
            color: '#4ade80',
            whiteSpace: 'nowrap',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </div>
      </Html>

      {/* Subtle green glow */}
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#22c55e" distance={0.6} decay={2} />
    </group>
  );
}

/* ── Whiteboard — lists all available interactions ── */

function Whiteboard({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const W = 0.92;
  const H = 0.62;
  const fw = 0.022; // frame thickness

  const items = [
    { emoji: '🖥️', object: 'Main Screen', page: '/projects' },
    { emoji: '📺', object: 'Side Monitor', page: '/skills' },
    { emoji: '🤖', object: 'Robot Figurine', page: '/about' },
    { emoji: '📓', object: 'Notebook', page: '/experience' },
    { emoji: '📱', object: 'Tablet', page: '/contact' },
  ];

  return (
    <group position={position} rotation={rotation ?? [0, 0, 0]}>
      {/* Outer frame — top */}
      <mesh position={[0, H / 2 - fw / 2, 0.001]}>
        <boxGeometry args={[W, fw, 0.018]} />
        <meshStandardMaterial color="#4a3225" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Outer frame — bottom */}
      <mesh position={[0, -H / 2 + fw / 2, 0.001]}>
        <boxGeometry args={[W, fw, 0.018]} />
        <meshStandardMaterial color="#4a3225" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Outer frame — left */}
      <mesh position={[-W / 2 + fw / 2, 0, 0.001]}>
        <boxGeometry args={[fw, H, 0.018]} />
        <meshStandardMaterial color="#4a3225" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Outer frame — right */}
      <mesh position={[W / 2 - fw / 2, 0, 0.001]}>
        <boxGeometry args={[fw, H, 0.018]} />
        <meshStandardMaterial color="#4a3225" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Whiteboard surface */}
      <mesh>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#f2ede6" roughness={0.88} metalness={0} />
      </mesh>

      {/* Tray ledge at bottom */}
      <mesh position={[0, -H / 2 - 0.005, 0.016]}>
        <boxGeometry args={[W * 0.8, 0.016, 0.028]} />
        <meshStandardMaterial color="#3a2a1e" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Marker glow — subtle warm tint */}
      <pointLight position={[0, 0, 0.15]} intensity={0.6} color="#ccffd8" distance={1.2} decay={2} />

      {/* Html overlay — interaction guide */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, 0.004]}
        scale={0.003}
        center
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            width: '278px',
            height: '184px',
            padding: '12px 14px',
            boxSizing: 'border-box',
            fontFamily: 'ui-monospace, monospace',
            overflow: 'hidden',
          }}
        >
          {/* Title */}
          <div style={{
            fontSize: '10px',
            fontWeight: 700,
            color: '#166534',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            marginBottom: '10px',
            borderBottom: '1.5px solid #86efac',
            paddingBottom: '5px',
          }}>
            🗺 Interactive Objects
          </div>

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {items.map((item) => (
              <div key={item.page} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px' }}>{item.emoji}</span>
                <span style={{ fontSize: '9px', color: '#1a3a28', fontWeight: 600, flex: 1 }}>
                  {item.object}
                </span>
                <span style={{
                  fontSize: '8px',
                  color: '#14532d',
                  background: '#dcfce7',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  border: '0.5px solid #86efac',
                }}>
                  {item.page}
                </span>
              </div>
            ))}
          </div>

          {/* Footer hint */}
          <div style={{
            marginTop: '10px',
            fontSize: '7.5px',
            color: '#6b7280',
            fontStyle: 'italic',
            borderTop: '0.5px solid #d1d5db',
            paddingTop: '5px',
          }}>
            Click any glowing object → opens in new tab
          </div>
        </div>
      </Html>
    </group>
  );
}
