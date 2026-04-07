import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper conflict resolution.
 * Combines clsx for conditional classes with tailwind-merge for deduplication.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'px-6')
 * // => 'py-2 px-6 bg-blue-500' (px-4 is overridden by px-6)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into a human-readable format.
 * Returns the original string unchanged if it is not a parseable date
 * (e.g. sentinel values like "Present" or "Current").
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  // Guard: return sentinel strings (e.g. "Present") as-is
  if (typeof date === 'string') {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return date;
  }
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    ...options,
  };
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(
    typeof date === 'string' ? new Date(date) : date,
  );
}

/**
 * Safely access a potentially undefined value with a fallback.
 */
export function fallback<T>(value: T | undefined | null, defaultValue: T): T {
  return value ?? defaultValue;
}
