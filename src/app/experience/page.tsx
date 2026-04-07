import type { Metadata } from 'next';

import { ExperienceClient } from './ExperienceClient';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Work experience and career history of Nektarios Ioannou.',
};

export default function ExperiencePage() {
  return <ExperienceClient />;
}
