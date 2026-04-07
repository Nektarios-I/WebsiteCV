'use client';

/**
 * ModeCRoot — The Digital Art Gallery
 *
 * Entry point for Mode C. Wraps the R3F Canvas, Physics,
 * and all gallery scene components. Dynamically imported
 * with ssr: false via ModeCLoader.
 */

import Link from 'next/link';

import { ROUTES } from '@/lib/constants';

import { useGalleryControls } from '../hooks/useGalleryControls';
import { GalleryScene } from './GalleryScene';
import { RoomManager } from './rooms/RoomManager';
import { Player } from './character/Player';
import { GalleryLights } from './GalleryLights';
import { GalleryLoader } from './ui/GalleryLoader';
import { GalleryHUD } from './ui/GalleryHUD';
import { MapOverlay } from './ui/MapOverlay';
import { ExhibitPanel } from './ui/ExhibitPanel';
import { CameraSettingsPanel } from './ui/CameraSettingsPanel';
import { MobileJoystick } from './ui/MobileJoystick';
import { ScreenReaderContent } from './ui/ScreenReaderContent';
import { TransitionOverlay } from './ui/TransitionOverlay';

export default function ModeCRoot() {
  // Keyboard shortcuts (M = map, Esc = close)
  useGalleryControls();

  return (
    <div className="relative h-screen w-full" role="application" aria-label="Digital Art Gallery">
      {/* Loading overlay */}
      <GalleryLoader />

      {/* Main 3D Scene */}
      <GalleryScene>
        {/* Lighting */}
        <GalleryLights />

        {/* Player character (ecctrl controller + stickman) */}
        <Player />

        {/* Active room — managed by RoomManager */}
        <RoomManager />
      </GalleryScene>

      {/* DOM Overlays */}
      <GalleryHUD />
      <CameraSettingsPanel />
      <MapOverlay />
      <ExhibitPanel />
      <TransitionOverlay />
      <MobileJoystick />

      {/* Screen reader accessible content */}
      <ScreenReaderContent />

      {/* Back to Hub */}
      <Link
        href={ROUTES.HUB}
        className="absolute top-4 left-4 z-30 rounded-lg bg-white/70 px-4 py-2 text-sm text-gray-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/90 hover:text-gray-900"
        aria-label="Return to hub page"
      >
        ← Back to Hub
      </Link>
    </div>
  );
}
