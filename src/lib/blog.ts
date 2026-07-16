import type { BlogPost, BlogListResponse, Category } from '../types';
import { blogCategories, blogPosts } from '../data/blog';

export async function getBlogList(params?: {
  limit?: number;
  offset?: number;
  categoryId?: string;
}): Promise<BlogListResponse> {
  const limit = params?.limit ?? 10;
  const offset = params?.offset ?? 0;
  const filtered = params?.categoryId
    ? blogPosts.filter((post) => post.category.id === params.categoryId)
    : blogPosts;

  return {
    contents: filtered.slice(offset, offset + limit),
    totalCount: filtered.length,
    offset,
    limit,
  };
}

export async function getBlogPost(id: string): Promise<BlogPost> {
  const post = blogPosts.find((item) => item.id === id);
  if (!post) throw new Error(`Blog post not found: ${id}`);
  return post;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return [...blogPosts];
}

export async function getCategories(): Promise<Category[]> {
  return [...blogCategories];
}

/** レスポンスから表示用に整形する */
export function formatBlogPost(post: BlogPost) {
  const date = new Date(post.publishedAt);
  const formatted = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  return {
    ...post,
    formattedDate: formatted,
    eyecatchUrl: post.eyecatch?.src.src,
  };
}
