/**
 * ExperienceSection — Mode A "Experience" timeline
 *
 * Data-driven from cv.json. Each entry shows:
 * - Date range (left) + Role, Company, Description, Technologies (right)
 * - Hover card effect with subtle background
 * - Each entry animates in via whileInView (handled by SectionWrapper parent)
 *
 * Inspired by Brittany Chiang's experience section.
 */

'use client';

import { motion } from 'framer-motion';
import cvData from '@/data/cv.json';
import { SectionWrapper } from './SectionWrapper';
import { formatDate } from '@/lib/utils';

interface ExperienceSectionProps {
  registerSection: (id: string, el: HTMLElement | null) => void;
}

export function ExperienceSection({ registerSection }: ExperienceSectionProps) {
  return (
    <SectionWrapper
      id="experience"
      label="Experience"
      registerSection={registerSection}
    >
      <div className="space-y-2">
        {cvData.experience.map((entry) => (
          <motion.a
            key={entry.id}
            href={entry.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative grid gap-4 rounded-lg p-4 transition-all duration-200 hover:bg-surface-hover sm:grid-cols-8 sm:gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
          >
            {/* Date range */}
            <div className="z-10 flex items-start sm:col-span-2">
              <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
                {formatDate(entry.startDate, { month: 'short', year: 'numeric' })} —{' '}
                {entry.endDate === 'Present'
                  ? 'Present'
                  : formatDate(entry.endDate, { month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Content */}
            <div className="z-10 sm:col-span-6">
              {/* Title */}
              <h3 className="font-medium leading-snug text-foreground">
                {entry.role} ·{' '}
                <span className="inline-flex items-center gap-1 font-medium text-foreground group-hover:text-accent">
                  {entry.company}
                  <svg
                    className="ml-0.5 h-3.5 w-3.5 shrink-0 translate-y-px opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </span>
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm leading-normal text-neutral-600 dark:text-neutral-400">
                {entry.description}
              </p>

              {/* Highlights */}
              <ul className="mt-3 space-y-1">
                {entry.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {highlight}
                  </li>
                ))}
              </ul>

              {/* Technologies */}
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </SectionWrapper>
  );
}
