/**
 * CV data type definitions.
 * These interfaces define the shape of structured CV content
 * stored in /src/data/cv.json.
 */

export interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | 'Present';
  location: string;
  description: string;
  highlights: string[];
  technologies: string[];
  companyUrl?: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
  gpa?: string;
}

export interface CVData {
  name: string;
  title: string;
  bio: string;
  contact: ContactInfo;
  experience: ExperienceEntry[];
  education: EducationEntry[];
}
