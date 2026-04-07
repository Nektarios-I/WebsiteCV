/**
 * Mode C Page — /gallery
 *
 * Server Component that exports metadata for SEO.
 * The ModeCLoader client component handles dynamic import with ssr: false.
 */

import { ModeCLoader } from '@/components/loaders/ModeCLoader';

export const metadata = {
  title: 'The Digital Art Gallery',
  description:
    'Explore a 3D museum gallery showcasing portfolio content as interactive art exhibits.',
};

export default function GalleryPage() {
  return <ModeCLoader />;
}
