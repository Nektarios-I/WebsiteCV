import type { ModeConfig } from '@/modes/types';

/**
 * Immersive mode icon — a 3D cube icon.
 */
function ImmersiveIcon({ className }: { className?: string }) {
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
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

/**
 * Mode B configuration — "The Immersive"
 *
 * An interactive 3D experience using React Three Fiber.
 * Features a detailed 3D room/workstation scene.
 */
export const modeBConfig: ModeConfig = {
  id: 'immersive',
  name: 'The Immersive',
  description: 'Interactive 3D experience with a virtual workstation.',
  icon: ImmersiveIcon,
  route: '/immersive',
  component: () => import('./components/ModeBRoot'),
  preloadHint: 'none',
  metadata: {
    estimatedLoadSize: '~150KB + 3D models',
    requiresWebGL: true,
    supportsReducedMotion: false,
  },
};
