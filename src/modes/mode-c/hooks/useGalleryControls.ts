/**
 * useGalleryControls — Keyboard shortcuts for Mode C
 *
 * Handles:
 * - M key: Toggle gallery map overlay
 * - Escape: Close map overlay / close exhibit panel
 *
 * Must be used inside a component mounted when Gallery is active.
 * Listens on document keydown to work regardless of Canvas focus.
 */

import { useEffect } from 'react';

import { useGalleryStore } from '../stores/useGalleryStore';

export function useGalleryControls() {
  const toggleMap = useGalleryStore((s) => s.toggleMap);
  const setMapOpen = useGalleryStore((s) => s.setMapOpen);
  const setActiveExhibit = useGalleryStore((s) => s.setActiveExhibit);
  const isMapOpen = useGalleryStore((s) => s.isMapOpen);
  const activeExhibit = useGalleryStore((s) => s.activeExhibit);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // M key — toggle map
      if (e.key === 'm' || e.key === 'M') {
        // Don't toggle if user is typing in an input
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return;
        }
        e.preventDefault();
        toggleMap();
        return;
      }

      // Escape — close whichever overlay is open
      if (e.key === 'Escape') {
        if (isMapOpen) {
          setMapOpen(false);
          return;
        }
        if (activeExhibit) {
          setActiveExhibit(null);
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleMap, setMapOpen, setActiveExhibit, isMapOpen, activeExhibit]);
}
