/**
 * SectionWrapper — Shared wrapper for all Mode A content sections
 *
 * Provides:
 * - Consistent spacing and layout
 * - Intersection Observer registration via data-section attribute
 * - Framer Motion scroll-triggered reveal animation (whileInView)
 * - Accessible aria-label and semantic section element
 */

'use client';

import { type ReactNode, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  id: string;
  label: string;
  registerSection: (id: string, el: HTMLElement | null) => void;
  children: ReactNode;
}

export function SectionWrapper({
  id,
  label,
  registerSection,
  children,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    registerSection(id, ref.current);
    return () => registerSection(id, null);
  }, [id, registerSection]);

  return (
    <motion.section
      ref={ref}
      id={id}
      data-section={id}
      aria-label={label}
      className="scroll-mt-24 py-16 lg:py-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Mobile-only section heading */}
      <h2 className="mb-8 text-sm font-bold uppercase tracking-widest text-foreground lg:hidden">
        {label}
      </h2>
      {children}
    </motion.section>
  );
}
