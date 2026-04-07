/**
 * Unit Tests for hooks/useMediaQuery.ts
 *
 * Tests the useMediaQuery hook behavior.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

describe('useMediaQuery', () => {
  beforeEach(() => {
    // Reset matchMedia mock before each test
    vi.clearAllMocks();
  });

  it('returns false when media query does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(false);
  });

  it('returns true when media query matches', () => {
    // Override the matchMedia mock to return true
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(true);
  });

  it('handles different queries', () => {
    const { result: darkMode } = renderHook(() =>
      useMediaQuery('(prefers-color-scheme: dark)'),
    );
    expect(typeof darkMode.current).toBe('boolean');

    const { result: reducedMotion } = renderHook(() =>
      useMediaQuery('(prefers-reduced-motion: reduce)'),
    );
    expect(typeof reducedMotion.current).toBe('boolean');
  });
});
