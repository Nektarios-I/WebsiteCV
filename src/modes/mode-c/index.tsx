import type { ModeConfig } from '@/modes/types';

/**
 * Gallery mode icon — a framed picture icon.
 */
function GalleryIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Outer frame */}
      <rect x="2" y="3" width="20" height="18" rx="2" />
      {/* Mountain landscape (painting content) */}
      <path d="M2 16l5-5 3 3 4-4 8 8" />
      {/* Sun */}
      <circle cx="16" cy="8" r="2" />
    </svg>
  );
}

/**
 * Mode C configuration — "The Digital Art Gallery"
 *
 * A third-person 3D museum/gallery where users explore
 * portfolio content as interactive art exhibits.
 */
export const modeCConfig: ModeConfig = {
  id: 'gallery',
  name: 'The Gallery',
  description: 'Explore a 3D museum with your portfolio displayed as art.',
  icon: GalleryIcon,
  route: '/gallery',
  component: () => import('./components/ModeCRoot'),
  preloadHint: 'none',
  metadata: {
    estimatedLoadSize: '~250KB + physics engine',
    requiresWebGL: true,
    supportsReducedMotion: false,
  },
};
