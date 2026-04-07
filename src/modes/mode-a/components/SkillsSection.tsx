/**
 * SkillsSection — Mode A "Skills" visualization
 *
 * Data-driven from skills.json. Displays skills organized by category
 * with proficiency levels shown as visual indicators.
 *
 * Layout: Category heading + grid of skill pills with proficiency dots.
 */

'use client';

import { motion } from 'framer-motion';
import skillsData from '@/data/skills.json';
import { SectionWrapper } from './SectionWrapper';
import { cn } from '@/lib/utils';
import type { SkillProficiency } from '@/types/skill';

interface SkillsSectionProps {
  registerSection: (id: string, el: HTMLElement | null) => void;
}

/** Map proficiency to number of filled dots (out of 4) */
const proficiencyLevel: Record<SkillProficiency, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

export function SkillsSection({ registerSection }: SkillsSectionProps) {
  return (
    <SectionWrapper
      id="skills"
      label="Skills"
      registerSection={registerSection}
    >
      <div className="space-y-12">
        {skillsData.map((group, groupIndex) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
          >
            {/* Category heading */}
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {group.category}
            </h3>

            {/* Skills grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {group.skills.map((skill) => {
                const level = proficiencyLevel[skill.proficiency as SkillProficiency] ?? 2;
                return (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-surface-hover"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {skill.name}
                    </span>

                    {/* Proficiency dots */}
                    <div className="flex gap-1" aria-label={`Proficiency: ${skill.proficiency}`}>
                      {Array.from({ length: 4 }, (_, i) => (
                        <span
                          key={i}
                          className={cn(
                            'h-2 w-2 rounded-full transition-colors',
                            i < level
                              ? 'bg-accent'
                              : 'bg-neutral-200 dark:bg-neutral-800',
                          )}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
