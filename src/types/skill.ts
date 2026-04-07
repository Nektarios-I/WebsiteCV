/**
 * Skill type definitions.
 */

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
  icon?: string;
}

export type SkillCategory =
  | 'language'
  | 'framework'
  | 'tool'
  | 'database'
  | 'cloud'
  | 'design'
  | 'other';

export type SkillProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';
