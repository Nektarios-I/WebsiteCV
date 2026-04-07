/**
 * Sync Config Script
 *
 * This script syncs site.config.ts to the JSON data files.
 * Run this after editing site.config.ts to update the JSON files.
 *
 * Usage: npx tsx scripts/sync-config.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import {
  PERSONAL,
  CONTACT,
  EXPERIENCE,
  EDUCATION,
  PROJECTS,
  SKILLS,
  CERTIFICATIONS,
} from '../site.config';

const dataDir = join(__dirname, '../src/data');

// Generate cv.json
const cvData = {
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
  })),
  education: EDUCATION.map((edu) => ({
    id: edu.id,
    institution: edu.institution,
    degree: edu.degree,
    field: edu.field,
    startDate: edu.startDate,
    endDate: edu.endDate,
    gpa: edu.gpa || undefined,
    description: edu.description || undefined,
  })),
  certifications: CERTIFICATIONS.map((cert) => ({
    id: cert.id,
    name: cert.name,
    issuer: cert.issuer,
    date: cert.date || undefined,
    url: cert.url || undefined,
    badge: cert.badge || undefined,
  })),
};

writeFileSync(
  join(dataDir, 'cv.json'),
  JSON.stringify(cvData, null, 2),
  'utf-8',
);
console.log('✅ cv.json updated');

// Generate projects.json
const projectsData = PROJECTS.map((proj) => ({
  id: proj.id,
  title: proj.title,
  description: proj.description,
  longDescription: proj.longDescription,
  category: proj.category,
  technologies: [...proj.technologies],
  image: proj.image,
  links: {
    live: proj.liveUrl || undefined,
    github: proj.githubUrl || undefined,
  },
  featured: proj.featured,
  date: proj.date,
}));

writeFileSync(
  join(dataDir, 'projects.json'),
  JSON.stringify(projectsData, null, 2),
  'utf-8',
);
console.log('✅ projects.json updated');

// Generate skills.json
const skillsData = SKILLS.map((group) => ({
  category: group.category,
  skills: group.skills.map((skill) => ({
    name: skill.name,
    category: 'other',
    proficiency: skill.proficiency,
  })),
}));

writeFileSync(
  join(dataDir, 'skills.json'),
  JSON.stringify(skillsData, null, 2),
  'utf-8',
);
console.log('✅ skills.json updated');

console.log('\n🎉 All data files synced from site.config.ts!');
