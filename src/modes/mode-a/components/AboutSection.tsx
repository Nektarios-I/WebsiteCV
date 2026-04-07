/**
 * AboutSection — Mode A "About" content
 *
 * Displays the developer's bio/summary from cv.json.
 * Clean, typography-focused layout with accent-highlighted links.
 */

'use client';

import cvData from '@/data/cv.json';
import { SectionWrapper } from './SectionWrapper';

interface AboutSectionProps {
  registerSection: (id: string, el: HTMLElement | null) => void;
}

export function AboutSection({ registerSection }: AboutSectionProps) {
  return (
    <SectionWrapper id="about" label="About" registerSection={registerSection}>
      <div className="space-y-4 text-neutral-600 dark:text-neutral-400">
        <p className="leading-relaxed">
          {cvData.bio}
        </p>
        <p className="leading-relaxed">
          My core stack for ML work is{' '}
          <span className="font-medium text-foreground">Python</span>{' '}with libraries like{' '}
          <span className="font-medium text-foreground">Scikit-learn</span>,{' '}
          <span className="font-medium text-foreground">PyTorch</span>, and{' '}
          <span className="font-medium text-foreground">Pandas</span>. I also
          build full-stack applications using{' '}
          <span className="font-medium text-foreground">React</span>,{' '}
          <span className="font-medium text-foreground">TypeScript</span>, and{' '}
          <span className="font-medium text-foreground">Next.js</span> — valuing
          clean architecture and interfaces that feel fast and intuitive.
        </p>
        <p className="leading-relaxed">
          Outside of tech, I&apos;m a classically trained bouzouki player and a
          national service veteran — two experiences that deepened my discipline
          and ability to perform under pressure.
        </p>
      </div>
    </SectionWrapper>
  );
}
