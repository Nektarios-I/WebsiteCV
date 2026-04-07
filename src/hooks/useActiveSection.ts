/**
 * useActiveSection — Tracks which section is currently in the viewport
 *
 * Uses Intersection Observer (via motion/react's useInView pattern)
 * to determine which Mode A section the user is currently viewing.
 * Returns the active section ID for nav highlight styling.
 *
 * Design:
 * - Each section registers itself via a ref
 * - The section with the highest intersection ratio wins
 * - Falls back to the first section if none meet the threshold
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MODE_A_SECTIONS } from '@/lib/constants';

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>(
    MODE_A_SECTIONS[0]?.id ?? '',
  );

  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  /** Register a section element for tracking */
  const registerSection = useCallback(
    (id: string, element: HTMLElement | null) => {
      if (element) {
        sectionRefs.current.set(id, element);
      } else {
        sectionRefs.current.delete(id);
      }
    },
    [],
  );

  useEffect(() => {
    const elements = sectionRefs.current;
    if (elements.size === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            (!bestEntry ||
              entry.intersectionRatio > bestEntry.intersectionRatio)
          ) {
            bestEntry = entry;
          }
        }

        if (bestEntry?.target instanceof HTMLElement) {
          const sectionId = bestEntry.target.getAttribute('data-section');
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      },
      {
        // rootMargin: negative top to trigger when section enters upper viewport
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const element of elements.values()) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return { activeSection, registerSection };
}
