/**
 * Mode B Page — /immersive
 *
 * The ModeBLoader client component handles dynamic import with ssr: false.
 * This page remains a Server Component so metadata can be exported.
 */

import { ModeBLoader } from '@/components/loaders/ModeBLoader';

export const metadata = {
  title: 'Immersive 3D Experience',
  description:
    'An interactive 3D portfolio experience built with React Three Fiber.',
};

export default function ImmersivePage() {
  return <ModeBLoader />;
}
