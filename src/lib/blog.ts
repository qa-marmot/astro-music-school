import { client } from './microcms';
import type { BlogPost, BlogListResponse, Category } from '../types';

const BLOG_ENDPOINT = 'blog';
const CATEGORY_ENDPOINT = 'categories';

export async function getBlogList(params?: {
  limit?: number;
  offset?: number;
  categoryId?: string;
}): Promise<BlogListResponse> {
  if (!client) {
    return { contents: [], totalCount: 0, offset: params?.offset ?? 0, limit: params?.limit ?? 10 };
  }

  const filters = params?.categoryId
    ? `category[equals]${params.categoryId}`
    : undefined;

  const response = await client.getList<BlogPost>({
    endpoint: BLOG_ENDPOINT,
    queries: {
      limit: params?.limit ?? 10,
      offset: params?.offset ?? 0,
      filters,
      orders: '-publishedAt',
    },
  });

  return response;
}

export async function getBlogPost(id: string): Promise<BlogPost> {
  if (!client) throw new Error('microCMS is not configured');
  return client.get<BlogPost>({
    endpoint: BLOG_ENDPOINT,
    contentId: id,
  });
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!client) return [];
  const response = await client.getList<BlogPost>({
    endpoint: BLOG_ENDPOINT,
    queries: { limit: 100, orders: '-publishedAt' },
  });
  return response.contents;
}

export async function getCategories(): Promise<Category[]> {
  if (!client) return [];
  const response = await client.getList<Category>({
    endpoint: CATEGORY_ENDPOINT,
    queries: { limit: 20 },
  });
  return response.contents;
}

/** レスポンスから表示用に整形する */
export function formatBlogPost(post: BlogPost) {
  const date = new Date(post.publishedAt);
  const formatted = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  return {
    ...post,
    formattedDate: formatted,
    eyecatchUrl: post.eyecatch?.url,
  };
}
