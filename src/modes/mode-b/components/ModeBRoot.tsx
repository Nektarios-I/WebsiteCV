'use client';

/**
 * Mode B Root Component — The Immersive Experience
 *
 * This is the entry point for Mode B.
 * It wraps the R3F Canvas and all 3D scene components.
 * Dynamically imported with ssr: false to prevent server-side rendering.
 */

import Link from 'next/link';

import { CameraRig } from '../cameras/CameraRig';
import { RoomLights } from '../lights/RoomLights';
import { ImmersiveHelpButton } from '@/app/immersive/_components/ImmersiveHelpButton';
import { ContentPanel } from './ContentPanel';
import { Loader } from './Loader';
import { Room } from './Room';
import { Scene } from './Scene';

export default function ModeBRoot() {
  return (
    <div className="relative h-screen w-full">
      {/* Loading overlay */}
      <Loader />

      {/* Main 3D Scene */}
      <Scene>
        {/* Lighting */}
        <RoomLights />

        {/* Camera controls with transitions */}
        <CameraRig />

        {/* Room environment — interactive objects are embedded in Room */}
        <Room />
      </Scene>

      {/* Content Panel (rendered outside Canvas for proper DOM) */}
      <ContentPanel />

      {/* Help button — portals to <body> so position:fixed is viewport-relative.
          Mounted here (client component) rather than in immersive/layout.tsx
          which must stay a pure Server Component for ssr:false to work. */}
      <ImmersiveHelpButton />

      {/* UI Overlay - Back to Hub button */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 p-4">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-slate-900/95 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Hub
        </Link>
      </div>

      {/* Instructions overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 p-4 text-center">
        <p className="text-xs text-white/40">
          Drag to orbit • Scroll to zoom • Click desk objects to explore
        </p>
      </div>
    </div>
  );
}
