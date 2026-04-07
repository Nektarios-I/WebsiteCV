/**
 * Unit Tests for lib/utils.ts
 *
 * Tests the utility functions: cn, formatDate, fallback
 */

import { describe, it, expect } from 'vitest';
import { cn, formatDate, fallback } from '@/lib/utils';

describe('cn (class name merger)', () => {
  it('merges multiple class strings', () => {
    const result = cn('px-4', 'py-2', 'bg-white');
    expect(result).toBe('px-4 py-2 bg-white');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const result = cn('base', isActive && 'active');
    expect(result).toBe('base active');
  });

  it('filters out falsy values', () => {
    const result = cn('base', false && 'never', null, undefined, 'always');
    expect(result).toBe('base always');
  });

  it('resolves Tailwind conflicts (last wins)', () => {
    const result = cn('px-4 py-2', 'px-6');
    expect(result).toBe('py-2 px-6');
  });

  it('handles empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });
});

describe('formatDate', () => {
  it('formats a date string with defaults', () => {
    const result = formatDate('2024-01-15');
    expect(result).toBe('January 2024');
  });

  it('formats a Date object', () => {
    const date = new Date('2024-06-20');
    const result = formatDate(date);
    expect(result).toBe('June 2024');
  });

  it('respects custom options', () => {
    const result = formatDate('2024-01-15', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    expect(result).toBe('Jan 15, 2024');
  });
});

describe('fallback', () => {
  it('returns value when defined', () => {
    const result = fallback('hello', 'default');
    expect(result).toBe('hello');
  });

  it('returns default for undefined', () => {
    const result = fallback(undefined, 'default');
    expect(result).toBe('default');
  });

  it('returns default for null', () => {
    const result = fallback(null, 'default');
    expect(result).toBe('default');
  });

  it('returns falsy values that are not null/undefined', () => {
    expect(fallback(0, 10)).toBe(0);
    expect(fallback('', 'default')).toBe('');
    expect(fallback(false, true)).toBe(false);
  });
});
