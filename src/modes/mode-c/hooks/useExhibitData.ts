/**
 * useExhibitData — Data hook for gallery exhibits
 *
 * Reads from the synced JSON data files and returns typed
 * exhibit data for use in 3D room components.
 *
 * Data pipeline: site.config.ts → pnpm sync-config → src/data/*.json → this hook
 */

import cv from '@/data/cv.json';
import projects from '@/data/projects.json';
import skills from '@/data/skills.json';

// ── Types ──────────────────────────────────────────────────────────────────

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  technologies: string[];
  image: string;
  links: { live?: string; github?: string };
  featured: boolean;
  date: string;
}

export interface ExperienceData {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  highlights: string[];
  technologies: string[];
  companyUrl?: string;
}

export interface EducationData {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description: string;
}

export interface SkillData {
  name: string;
  proficiency: string;
}

export interface SkillCategoryData {
  category: string;
  skills: SkillData[];
}

export interface PersonalData {
  name: string;
  title: string;
  bio: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
  };
}

export interface CertificationData {
  id: string;
  title: string;
  issuer: string;
  description: string;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useExhibitData() {
  return {
    projects: projects as unknown as ProjectData[],
    experience: cv.experience as unknown as ExperienceData[],
    education: cv.education as unknown as EducationData[],
    skills: skills as unknown as SkillCategoryData[],
    certifications:
      ((cv as Record<string, unknown>).certifications as
        | CertificationData[]
        | undefined) ?? ([] as CertificationData[]),
    personal: {
      name: cv.name,
      title: cv.title,
      bio: cv.bio,
      contact: cv.contact,
    } as PersonalData,
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Format YYYY-MM date to human-readable */
export function formatDate(date: string): string {
  if (date === 'Present') return 'Present';
  const parts = date.split('-');
  const year = parts[0] ?? date;
  const month = parts[1];
  if (!month) return year;
  const monthNames = [
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
  return `${monthNames[parseInt(month, 10) - 1] ?? month} ${year}`;
}

/** Map proficiency string to 0–1 value */
export function proficiencyToValue(proficiency: string): number {
  switch (proficiency) {
    case 'expert':
      return 0.95;
    case 'advanced':
      return 0.75;
    case 'intermediate':
      return 0.5;
    case 'beginner':
      return 0.25;
    default:
      return 0.5;
  }
}

/** Map proficiency to display color */
export function proficiencyToColor(proficiency: string): string {
  switch (proficiency) {
    case 'expert':
      return '#f59e0b';
    case 'advanced':
      return '#14b8a6';
    case 'intermediate':
      return '#3b82f6';
    case 'beginner':
      return '#9ca3af';
    default:
      return '#6b7280';
  }
}

/** Build a composite exhibit key to store in activeExhibit */
export function exhibitKey(type: string, id: string): string {
  return `${type}/${id}`;
}

/** Parse composite exhibit key back to type + id */
export function parseExhibitKey(key: string): { type: string; id: string } {
  const slash = key.indexOf('/');
  if (slash === -1) return { type: key, id: '' };
  return { type: key.slice(0, slash), id: key.slice(slash + 1) };
}
