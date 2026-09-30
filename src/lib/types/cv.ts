import { z } from 'zod';

export const BasicsSchema = z.object({
  name: z.string().default(''),
  headline: z.string().default(''),
  email: z.string().email().or(z.literal('')).default(''),
  phone: z.string().default(''),
  location: z.string().default(''),
  website: z.string().url().or(z.literal('')).default(''),
  linkedin: z.string().url().or(z.literal('')).default(''),
  github: z.string().url().or(z.literal('')).default('')
});

export const ExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string().default(''),
  position: z.string().default(''),
  location: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  current: z.boolean().default(false),
  description: z.string().default(''),
  achievements: z.array(z.string()).default([])
});

export const EducationItemSchema = z.object({
  id: z.string(),
  institution: z.string().default(''),
  degree: z.string().default(''),
  field: z.string().default(''),
  startYear: z.string().default(''),
  endYear: z.string().default(''),
  description: z.string().default('')
});

export const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  description: z.string().default(''),
  technologies: z.array(z.string()).default([]),
  url: z.string().url().or(z.literal('')).default(''),
  repoUrl: z.string().url().or(z.literal('')).default('')
});

export const SkillCategorySchema = z.object({
  id: z.string(),
  category: z.string().default(''),
  skills: z.array(z.string()).default([])
});

export const CertificationItemSchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  issuer: z.string().default(''),
  date: z.string().default(''),
  url: z.string().url().or(z.literal('')).default('')
});

export const LanguageItemSchema = z.object({
  id: z.string(),
  language: z.string().default(''),
  proficiency: z.string().default('')
});

export const SectionTypeSchema = z.enum([
  'experience',
  'education',
  'projects',
  'skills',
  'certifications',
  'languages'
]);

export const CVDataSchema = z.object({
  basics: BasicsSchema.default({}),
  summary: z.string().default(''),
  experience: z.array(ExperienceItemSchema).default([]),
  education: z.array(EducationItemSchema).default([]),
  projects: z.array(ProjectItemSchema).default([]),
  skills: z.array(SkillCategorySchema).default([]),
  certifications: z.array(CertificationItemSchema).default([]),
  languages: z.array(LanguageItemSchema).default([])
});

export const ResumeSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1, 'Title is required').default('Untitled CV'),
  template: z.enum(['ats-classic', 'ats-modern', 'ats-brutalist']).default('ats-classic'),
  sectionOrder: z.array(SectionTypeSchema).default([
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'languages'
  ]),
  data: CVDataSchema.default({}),
  createdAt: z.date().or(z.string()).default(() => new Date()),
  updatedAt: z.date().or(z.string()).default(() => new Date())
});

export type Basics = z.infer<typeof BasicsSchema>;
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;
export type EducationItem = z.infer<typeof EducationItemSchema>;
export type ProjectItem = z.infer<typeof ProjectItemSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type CertificationItem = z.infer<typeof CertificationItemSchema>;
export type LanguageItem = z.infer<typeof LanguageItemSchema>;
export type SectionType = z.infer<typeof SectionTypeSchema>;
export type CVData = z.infer<typeof CVDataSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
