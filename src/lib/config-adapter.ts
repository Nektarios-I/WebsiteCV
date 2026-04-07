/**
 * Config Adapter
 *
 * Bridges the new site.config.ts with existing data structures.
 * This allows components to use either source seamlessly.
 */

import {
  PERSONAL,
  CONTACT,
  EXPERIENCE,
  EDUCATION,
  PROJECTS,
  SKILLS,
  SITE_CONFIG,
  CERTIFICATIONS,
  TESTIMONIALS,
  RESUME,
} from '../../site.config';

import type { CVData, ExperienceEntry, EducationEntry } from '@/types/cv';
import type { ProjectEntry, ProjectCategory } from '@/types/project';

/**
 * Get CV data from site.config.ts
 */
export function getCV(): CVData {
  return {
    name: PERSONAL.name,
    title: PERSONAL.title,
    bio: PERSONAL.bio,
    contact: {
      email: CONTACT.email,
      phone: CONTACT.phone || undefined,
      location: PERSONAL.location,
      website: CONTACT.website,
      linkedin: CONTACT.linkedin,
      github: CONTACT.github,
    },
    experience: EXPERIENCE.map((exp) => ({
      id: exp.id,
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate,
      location: exp.location,
      description: exp.description,
      highlights: [...exp.highlights],
      technologies: [...exp.technologies],
      companyUrl: exp.companyUrl,
    })) as ExperienceEntry[],
    education: EDUCATION.map((edu) => ({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: edu.gpa || undefined,
      description: edu.description || undefined,
    })) as EducationEntry[],
  };
}

/**
 * Get projects from site.config.ts
 */
export function getProjects(): ProjectEntry[] {
  return PROJECTS.map((proj) => ({
    id: proj.id,
    title: proj.title,
    description: proj.description,
    longDescription: proj.longDescription,
    category: proj.category as ProjectCategory,
    technologies: [...proj.technologies],
    image: proj.image,
    links: {
      live: proj.liveUrl || undefined,
      github: proj.githubUrl || undefined,
    },
    featured: proj.featured,
    date: proj.date,
  }));
}

/**
 * Get skills from site.config.ts
 */
export function getSkills() {
  return SKILLS.map((group) => ({
    category: group.category,
    skills: group.skills.map((skill) => ({
      name: skill.name,
      category: 'other' as const, // Default category
      proficiency: skill.proficiency as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    })),
  }));
}

/**
 * Get site metadata
 */
export function getSiteConfig() {
  return {
    name: PERSONAL.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    themeColor: SITE_CONFIG.themeColor,
  };
}

/**
 * Get social links
 */
export function getSocialLinks() {
  return {
    github: CONTACT.github,
    linkedin: CONTACT.linkedin,
    email: CONTACT.email,
    twitter: CONTACT.twitter || undefined,
  };
}

/**
 * Get resume config
 */
export function getResumeConfig() {
  return RESUME;
}

/**
 * Get certifications
 */
export function getCertifications() {
  return [...CERTIFICATIONS];
}

/**
 * Get testimonials
 */
export function getTestimonials() {
  return [...TESTIMONIALS];
}

/**
 * Check if a section is enabled
 */
export function isSectionEnabled(section: keyof typeof SITE_CONFIG.sections): boolean {
  return SITE_CONFIG.sections[section] ?? true;
}
