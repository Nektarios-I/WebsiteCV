/**
 * /projects — Dedicated projects showcase page.
 *
 * Opens in a new tab when the user clicks the Ultrawide Monitor
 * in the immersive 3D room. Fully server-rendered shell with
 * client-side interactivity handled by ProjectsClient.
 */

import type { Metadata } from 'next';

import { ProjectsClient } from './ProjectsClient';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Interactive showcase of projects by Nektarios Ioannou — Machine Learning, Web Development, and more.',
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
