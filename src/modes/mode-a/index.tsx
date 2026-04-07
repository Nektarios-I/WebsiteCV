import type { ModeConfig } from '@/modes/types';

/**
 * Minimalist mode icon — a clean document/text icon.
 */
function MinimalistIcon({ className }: { className?: string }) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

/**
 * Mode A configuration — "The Minimalist"
 *
 * A clean, typography-driven, data-centric portfolio view
 * inspired by Brittany Chiang's portfolio design.
 */
export const modeAConfig: ModeConfig = {
  id: 'minimalist',
  name: 'The Minimalist',
  description: 'Clean, typography-focused experience with structured data.',
  icon: MinimalistIcon,
  route: '/minimalist',
  component: () => import('./components/ModeARoot'),
  preloadHint: 'hover',
  metadata: {
    estimatedLoadSize: '~30KB',
    requiresWebGL: false,
    supportsReducedMotion: true,
  },
};
