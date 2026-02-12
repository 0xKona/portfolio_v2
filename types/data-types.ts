/**
 * data-types — Shared TypeScript types for portfolio data models.
 * These align with the Amplify schema in amplify/data/resource.ts
 * and serve as the canonical frontend types across the app.
 */

export enum SkillType {
    Language = 'language',
    Framework = 'framework',
    Platform = 'platform',
}

export interface ProjectImage {
    url: string;
    alt: string;
    caption?: string | null;
}

export type ProjectStatus = 'published' | 'draft';

export interface Skill {
    id: string;
    name: string;
    displayName: string;
    lucideIconName?: string | null;
    type?: SkillType | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface Project {
    id: string;
    name: string;
    desc?: string | null;
    images?: (ProjectImage | null | undefined)[] | null;
    video?: string | null;
    skills?: (string | null | undefined)[] | null;
    githubUrl?: string | null;
    demoUrl?: string | null;
    isFeatured: boolean;
    status: ProjectStatus;
    createdAt?: string;
    updatedAt?: string;
}

