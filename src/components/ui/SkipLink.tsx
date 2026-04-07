'use client';

/**
 * SkipLink — Accessibility component for keyboard navigation
 *
 * Hidden by default, appears on focus (Tab key).
 * Allows keyboard users to skip directly to main content.
 */

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
}

export function SkipLink({
  href = '#main-content',
  children = 'Skip to main content',
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className="focus:bg-accent focus:text-accent-foreground focus:ring-accent sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:ring-2 focus:ring-offset-2 focus:outline-none"
    >
      {children}
    </a>
  );
}
