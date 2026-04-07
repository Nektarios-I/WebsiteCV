/**
 * ModeANav — Sticky sidebar / header navigation for Mode A
 *
 * Desktop (lg+): Sticky left sidebar with:
 *   - Name + title at top
 *   - Navigation links with active section indicator
 *   - Social icons at bottom
 *
 * Mobile (<lg): Compact top header with name and hamburger menu
 *
 * Inspired by Brittany Chiang's portfolio navigation pattern.
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MODE_A_SECTIONS, SOCIAL_LINKS, ROUTES } from '@/lib/constants';
import cvData from '@/data/cv.json';

interface ModeANavProps {
  activeSection: string;
}

export function ModeANav({ activeSection }: ModeANavProps) {
  return (
    <>
      {/* Desktop Sidebar — sticky, only visible on lg+ */}
      <header className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
        {/* Identity */}
        <div>
          <Link href={ROUTES.HUB} className="group">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {cvData.name}
            </h1>
          </Link>
          <h2 className="mt-3 text-lg font-medium tracking-tight text-neutral-600 dark:text-neutral-400">
            {cvData.title}
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-normal text-neutral-500 dark:text-neutral-500">
            {cvData.bio.slice(0, 120)}{cvData.bio.length > 120 ? '…' : ''}
          </p>

          {/* Section Navigation */}
          <nav className="mt-16" aria-label="In-page jump links">
            <ul className="w-max space-y-1">
              {MODE_A_SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={cn(
                        'group flex items-center py-2 transition-all duration-200',
                      )}
                    >
                      {/* Indicator line */}
                      <span
                        className={cn(
                          'mr-4 h-px transition-all duration-200',
                          isActive
                            ? 'w-16 bg-foreground'
                            : 'w-8 bg-neutral-400 group-hover:w-16 group-hover:bg-foreground dark:bg-neutral-600 dark:group-hover:bg-foreground',
                        )}
                      />
                      {/* Label */}
                      <span
                        className={cn(
                          'text-xs font-bold uppercase tracking-widest transition-colors duration-200',
                          isActive
                            ? 'text-foreground'
                            : 'text-neutral-500 group-hover:text-foreground dark:text-neutral-500 dark:group-hover:text-foreground',
                        )}
                      >
                        {section.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom: Social links + back to hub */}
        <div className="flex items-center gap-5">
          <a
            href={SOCIAL_LINKS.GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-neutral-500 transition-colors hover:text-foreground"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
          <a
            href={SOCIAL_LINKS.LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-neutral-500 transition-colors hover:text-foreground"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href={`mailto:${SOCIAL_LINKS.EMAIL}`}
            aria-label="Email"
            className="text-neutral-500 transition-colors hover:text-foreground"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </a>

          <span className="mx-2 h-4 w-px bg-neutral-300 dark:bg-neutral-700" />

          <Link
            href={ROUTES.HUB}
            className="text-xs font-medium text-neutral-500 transition-colors hover:text-accent"
          >
            ← Hub
          </Link>
        </div>
      </header>

      {/* Mobile Header — visible on < lg */}
      <motion.header
        className="sticky top-0 z-40 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md lg:hidden"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <Link href={ROUTES.HUB} className="flex items-center gap-2 text-sm font-medium text-accent">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Hub
          </Link>
          <h1 className="text-sm font-semibold">{cvData.name}</h1>
        </div>

        {/* Scrollable nav pills */}
        <nav className="scrollbar-none -mx-6 mt-3 flex gap-1 overflow-x-auto px-6" aria-label="Section navigation">
          {MODE_A_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                'shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                activeSection === section.id
                  ? 'bg-accent/10 text-accent'
                  : 'text-neutral-500 hover:text-foreground',
              )}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </motion.header>
    </>
  );
}
