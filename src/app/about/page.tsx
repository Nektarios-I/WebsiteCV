import type { Metadata } from 'next';

import { AboutClient } from './AboutClient';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Nektarios Ioannou — CS student, ML engineer, builder.',
};

export default function AboutPage() {
  return <AboutClient />;
}
