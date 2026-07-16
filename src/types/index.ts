import type { ImageMetadata } from 'astro';

export interface EditorialImage {
  src: ImageMetadata;
  mobileSrc?: ImageMetadata;
  alt: string;
  caption?: string;
  source: 'owned' | 'licensed-stock';
  sourcePage?: string;
  photographer?: string;
  licenseUrl?: string;
  focalPoint?: {
    desktop: string;
    mobile: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  eyecatch?: EditorialImage;
  category: Category;
  tags?: string[];
}

export interface BlogListResponse {
  contents: BlogPost[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface LessonPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  frequency: string;
  price: number;
  trialPrice: number;
  features: string[];
  recommended?: boolean;
}
