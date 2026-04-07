/**
 * Unit Tests for useExhibitData helpers
 *
 * Tests the pure utility functions exported from useExhibitData.ts:
 * - formatDate
 * - proficiencyToValue
 * - proficiencyToColor
 * - exhibitKey / parseExhibitKey
 */

import { describe, it, expect } from 'vitest';
import {
  formatDate,
  proficiencyToValue,
  proficiencyToColor,
  exhibitKey,
  parseExhibitKey,
} from './useExhibitData';

// ── formatDate ──────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('formats YYYY-MM to abbreviated month + year', () => {
    expect(formatDate('2024-01')).toBe('Jan 2024');
    expect(formatDate('2023-06')).toBe('Jun 2023');
    expect(formatDate('2022-12')).toBe('Dec 2022');
  });

  it('returns "Present" unchanged', () => {
    expect(formatDate('Present')).toBe('Present');
  });

  it('returns year only when no month is provided', () => {
    expect(formatDate('2024')).toBe('2024');
  });

  it('handles all 12 months', () => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    months.forEach((name, i) => {
      const month = String(i + 1).padStart(2, '0');
      expect(formatDate(`2024-${month}`)).toBe(`${name} 2024`);
    });
  });
});

// ── proficiencyToValue ──────────────────────────────────────────────────

describe('proficiencyToValue', () => {
  it('maps expert to 0.95', () => {
    expect(proficiencyToValue('expert')).toBe(0.95);
  });

  it('maps advanced to 0.75', () => {
    expect(proficiencyToValue('advanced')).toBe(0.75);
  });

  it('maps intermediate to 0.5', () => {
    expect(proficiencyToValue('intermediate')).toBe(0.5);
  });

  it('maps beginner to 0.25', () => {
    expect(proficiencyToValue('beginner')).toBe(0.25);
  });

  it('defaults unknown proficiencies to 0.5', () => {
    expect(proficiencyToValue('unknown')).toBe(0.5);
    expect(proficiencyToValue('')).toBe(0.5);
  });
});

// ── proficiencyToColor ──────────────────────────────────────────────────

describe('proficiencyToColor', () => {
  it('maps expert to amber', () => {
    expect(proficiencyToColor('expert')).toBe('#f59e0b');
  });

  it('maps advanced to teal', () => {
    expect(proficiencyToColor('advanced')).toBe('#14b8a6');
  });

  it('maps intermediate to blue', () => {
    expect(proficiencyToColor('intermediate')).toBe('#3b82f6');
  });

  it('maps beginner to gray', () => {
    expect(proficiencyToColor('beginner')).toBe('#9ca3af');
  });

  it('defaults unknown proficiencies to gray-500', () => {
    expect(proficiencyToColor('unknown')).toBe('#6b7280');
  });
});

// ── exhibitKey / parseExhibitKey ────────────────────────────────────────

describe('exhibitKey', () => {
  it('builds a composite key from type and id', () => {
    expect(exhibitKey('project', 'my-app')).toBe('project/my-app');
  });

  it('works with various types', () => {
    expect(exhibitKey('experience', 'acme-corp')).toBe('experience/acme-corp');
    expect(exhibitKey('skill', 'Frontend')).toBe('skill/Frontend');
    expect(exhibitKey('education', 'mit')).toBe('education/mit');
  });
});

describe('parseExhibitKey', () => {
  it('parses a composite key back to type and id', () => {
    expect(parseExhibitKey('project/my-app')).toEqual({
      type: 'project',
      id: 'my-app',
    });
  });

  it('handles keys with slashes in the id', () => {
    expect(parseExhibitKey('project/my/nested/id')).toEqual({
      type: 'project',
      id: 'my/nested/id',
    });
  });

  it('handles keys with no slash', () => {
    expect(parseExhibitKey('project')).toEqual({
      type: 'project',
      id: '',
    });
  });

  it('roundtrips with exhibitKey', () => {
    const key = exhibitKey('experience', 'google');
    const parsed = parseExhibitKey(key);
    expect(parsed.type).toBe('experience');
    expect(parsed.id).toBe('google');
  });
});
