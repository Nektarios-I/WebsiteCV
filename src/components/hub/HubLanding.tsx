/**
 * HubLanding — The Central Hub page
 *
 * This is the "gateway" — the first page every visitor sees.
 * It presents a hero section with the developer's identity,
 * then interactive mode cards to choose an experience.
 *
 * Animations:
 * - Staggered fade-in-up entrance for hero elements
 * - Staggered scale-in for mode cards
 * - Reduced motion: instant display (no animation)
 */

'use client';

import { motion } from 'framer-motion';
import { modes } from '@/modes/registry';
import { ModeCard } from '@/components/hub/ModeCard';
import { SITE, SOCIAL_LINKS } from '@/lib/constants';

/** Stagger parent variant */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

/** Individual item variant — fade in + slide up */
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
} as const;

export function HubLanding() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center px-6 py-20"
    >
      {/* Hero */}
      <motion.header
        className="mb-20 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting */}
        <motion.p
          className="text-accent mb-4 font-mono text-sm tracking-wider"
          variants={itemVariants}
        >
          Hi, my name is
        </motion.p>

        {/* Name */}
        <motion.h1
          className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          variants={itemVariants}
        >
          {SITE.NAME}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="mt-4 text-2xl font-medium text-neutral-500 sm:text-3xl lg:text-4xl"
          variants={itemVariants}
        >
          I build things for the web.
        </motion.p>

        {/* Description */}
        <motion.p
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-balance text-neutral-600 dark:text-neutral-400"
          variants={itemVariants}
        >
          {SITE.DESCRIPTION}
        </motion.p>

        {/* Social links */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-5"
          variants={itemVariants}
        >
          <a
            href={SOCIAL_LINKS.GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-accent text-neutral-500 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>
          <a
            href={SOCIAL_LINKS.LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-accent text-neutral-500 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href={`mailto:${SOCIAL_LINKS.EMAIL}`}
            aria-label="Email"
            className="hover:text-accent text-neutral-500 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </a>
        </motion.div>
      </motion.header>

      {/* Mode Selector */}
      <motion.section
        className="w-full max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="mb-8 text-center text-sm font-semibold tracking-widest text-neutral-500 uppercase dark:text-neutral-400">
          Choose Your Experience
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {modes.map((mode, index) => (
            <ModeCard key={mode.id} mode={mode} index={index} />
          ))}
        </div>
      </motion.section>

      {/* Footer hint */}
      <motion.footer
        className="mt-20 text-center text-xs text-neutral-400 dark:text-neutral-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <p>More modes coming soon. Each offers a unique way to explore.</p>
      </motion.footer>
    </main>
  );
}
