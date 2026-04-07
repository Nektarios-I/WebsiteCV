/**
 * Application-wide constants.
 * Centralized to avoid magic strings/numbers throughout the codebase.
 *
 * NOTE: Personal info is now sourced from site.config.ts in the project root.
 * Edit site.config.ts to change your name, contact info, etc.
 */

import { PERSONAL, CONTACT, SITE_CONFIG } from '../../site.config';

/** Route paths for each mode */
export const ROUTES = {
  HUB: '/',
  MODE_A: '/minimalist',
  MODE_B: '/immersive',
  MODE_C: '/gallery',
} as const;

/** Responsive breakpoints (matches Tailwind defaults) */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/** Animation duration presets (in seconds) */
export const ANIMATION = {
  FAST: 0.15,
  NORMAL: 0.3,
  SLOW: 0.5,
  PAGE_TRANSITION: 0.4,
} as const;

/** Site metadata — sourced from site.config.ts */
export const SITE = {
  NAME: PERSONAL.name,
  TITLE: SITE_CONFIG.title,
  DESCRIPTION: SITE_CONFIG.description,
  URL: SITE_CONFIG.url,
} as const;

/** Mode A section configuration — controls navigation and scroll tracking */
export const MODE_A_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const;

/** Social / external links — sourced from site.config.ts */
export const SOCIAL_LINKS = {
  GITHUB: CONTACT.github,
  LINKEDIN: CONTACT.linkedin,
  EMAIL: CONTACT.email,
} as const;
