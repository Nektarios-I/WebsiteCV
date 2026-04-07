/**
 * Mode A Root Component — The Minimalist Experience
 *
 * Brittany Chiang-inspired layout:
 * - Desktop (lg+): Two-column layout with sticky sidebar (left) and scrollable content (right)
 * - Mobile (<lg): Single-column with compact sticky header
 *
 * Features:
 * - Active section tracking via Intersection Observer
 * - Framer Motion scroll-triggered section reveals
 * - Data-driven content from JSON files
 */

'use client';

import { ModeANav } from './ModeANav';
import { AboutSection } from './AboutSection';
import { ExperienceSection } from './ExperienceSection';
import { ProjectsSection } from './ProjectsSection';
import { SkillsSection } from './SkillsSection';
import { EducationSection } from './EducationSection';
import { ContactSection } from './ContactSection';
import { useActiveSection } from '@/hooks/useActiveSection';

export default function ModeARoot() {
  const { activeSection, registerSection } = useActiveSection();

  return (
    <div className="mx-auto min-h-screen max-w-screen-xl px-6 md:px-12 lg:px-24">
      <div className="lg:flex lg:justify-between lg:gap-4">
        {/* Sidebar — sticky on desktop, compact header on mobile */}
        <ModeANav activeSection={activeSection} />

        {/* Main content — scrollable */}
        <main id="main-content" className="lg:w-1/2 lg:py-24">
          <AboutSection registerSection={registerSection} />
          <ExperienceSection registerSection={registerSection} />
          <ProjectsSection registerSection={registerSection} />
          <SkillsSection registerSection={registerSection} />
          <EducationSection registerSection={registerSection} />
          <ContactSection registerSection={registerSection} />
        </main>
      </div>
    </div>
  );
}
