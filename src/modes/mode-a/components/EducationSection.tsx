/**
 * EducationSection — Mode A "Education" display
 *
 * Data-driven from cv.json. Each entry shows:
 * - Date range, Institution, Degree + Field, GPA, Description
 * - Same card-hover pattern as Experience section
 */

'use client';

import { motion } from 'framer-motion';
import cvData from '@/data/cv.json';
import { SectionWrapper } from './SectionWrapper';
import { formatDate } from '@/lib/utils';

interface EducationSectionProps {
  registerSection: (id: string, el: HTMLElement | null) => void;
}

export function EducationSection({ registerSection }: EducationSectionProps) {
  return (
    <SectionWrapper
      id="education"
      label="Education"
      registerSection={registerSection}
    >
      <div className="space-y-2">
        {cvData.education.map((entry) => (
          <motion.div
            key={entry.id}
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
              <h3 className="font-medium leading-snug text-foreground">
                {entry.degree} in {entry.field}
              </h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {entry.institution}
              </p>
              {entry.gpa && (
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
                  GPA: {entry.gpa}
                </p>
              )}
              {entry.description && (
                <p className="mt-2 text-sm leading-normal text-neutral-600 dark:text-neutral-400">
                  {entry.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
