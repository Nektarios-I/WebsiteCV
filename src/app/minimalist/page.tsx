/**
 * Mode A Page — /minimalist
 *
 * Dynamically imports the ModeARoot component for code-splitting.
 * The heavy Mode A bundle is only loaded when the user navigates here.
 */

import dynamic from 'next/dynamic';

const ModeARoot = dynamic(() => import('@/modes/mode-a/components/ModeARoot'), {
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <p className="animate-pulse text-neutral-500">
        Loading minimalist experience…
      </p>
    </div>
  ),
});

export const metadata = {
  title: 'Minimalist Experience',
  description:
    'A clean, focused portfolio experience inspired by modern developer portfolios.',
};

export default function MinimalistPage() {
  return <ModeARoot />;
}
