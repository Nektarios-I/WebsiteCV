/**
 * ContactSection — Mode A "Contact" footer section
 *
 * Provides a call-to-action with email link and social links.
 * Serves as both the contact section and the page footer.
 */

'use client';

import { SectionWrapper } from './SectionWrapper';
import { SOCIAL_LINKS } from '@/lib/constants';
import cvData from '@/data/cv.json';

interface ContactSectionProps {
  registerSection: (id: string, el: HTMLElement | null) => void;
}

export function ContactSection({ registerSection }: ContactSectionProps) {
  return (
    <SectionWrapper
      id="contact"
      label="Contact"
      registerSection={registerSection}
    >
      <div className="max-w-md">
        <h3 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Get In Touch
        </h3>
        <p className="mt-4 leading-relaxed text-neutral-600 dark:text-neutral-400">
          I&apos;m currently open to new opportunities. Whether you have a
          question, a project idea, or just want to say hello — my inbox is
          always open.
        </p>

        <a
          href={`mailto:${SOCIAL_LINKS.EMAIL}`}
          className="mt-8 inline-flex items-center gap-2 rounded-lg border border-accent px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
        >
          Say Hello
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </a>
      </div>

      {/* Footer */}
      <footer className="mt-24 border-t border-border pt-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            Built with{' '}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-600 hover:text-accent dark:text-neutral-400"
            >
              Next.js
            </a>
            ,{' '}
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-600 hover:text-accent dark:text-neutral-400"
            >
              Tailwind CSS
            </a>
            , and{' '}
            <a
              href="https://motion.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-600 hover:text-accent dark:text-neutral-400"
            >
              Framer Motion
            </a>
            . Deployed on{' '}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-600 hover:text-accent dark:text-neutral-400"
            >
              Vercel
            </a>
            .
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            © {new Date().getFullYear()} {cvData.name}
          </p>
        </div>
      </footer>
    </SectionWrapper>
  );
}
