/**
 * Project/portfolio type definitions.
 */

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  category: ProjectCategory;
  featured: boolean;
  links: {
    live?: string;
    github?: string;
    article?: string;
  };
  image?: string;
  date: string;
}

export type ProjectCategory =
  | 'web'
  | 'mobile'
  | 'backend'
  | 'fullstack'
  | 'design'
  | 'other';
