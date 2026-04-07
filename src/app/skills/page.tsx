import type { Metadata } from 'next';

import { SkillsClient } from './SkillsClient';

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Technical and soft skills of Nektarios Ioannou.',
};

export default function SkillsPage() {
  return <SkillsClient />;
}
