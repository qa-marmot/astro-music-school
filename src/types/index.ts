export interface MicroCMSImage {
  url: string;
  height: number;
  width: number;
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
  eyecatch?: MicroCMSImage;
  category: Category;
  tags?: string[];
}

export interface BlogListResponse {
  contents: BlogPost[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface Instructor {
  id: string;
  name: string;
  nameKana: string;
  role: string;
  bio: string;
  photo?: MicroCMSImage;
  instruments: string[];
  career?: string;
}

export interface LessonPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  frequency: string;
  price: number;
  trialPrice: number;
  features: string[];
  recommended?: boolean;
}
