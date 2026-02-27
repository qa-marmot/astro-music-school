import { describe, it, expect } from 'vitest';
import { formatBlogPost } from '../../src/lib/blog';
import type { BlogPost } from '../../src/types';

const mockPost: BlogPost = {
  id: 'test-id-001',
  createdAt: '2024-01-15T09:00:00.000Z',
  updatedAt: '2024-01-16T09:00:00.000Z',
  publishedAt: '2024-01-15T09:00:00.000Z',
  revisedAt: '2024-01-16T09:00:00.000Z',
  title: 'テスト記事タイトル',
  slug: 'test-article',
  excerpt: 'テスト記事の抜粋文です。',
  content: '<p>本文コンテンツです。</p>',
  category: {
    id: 'news',
    name: 'お知らせ',
    slug: 'news',
  },
};

describe('formatBlogPost', () => {
  it('publishedAtを日本語形式に変換する', () => {
    const result = formatBlogPost(mockPost);
    expect(result.formattedDate).toMatch(/2024年/);
    expect(result.formattedDate).toMatch(/月/);
    expect(result.formattedDate).toMatch(/日/);
  });

  it('eyecatchがない場合はプレースホルダーURLを返す', () => {
    const result = formatBlogPost(mockPost);
    expect(result.eyecatchUrl).toBe('/images/blog-placeholder.jpg');
  });

  it('eyecatchがある場合はそのURLを返す', () => {
    const postWithEyecatch: BlogPost = {
      ...mockPost,
      eyecatch: { url: 'https://images.microcms-assets.io/test.jpg', height: 600, width: 1200 },
    };
    const result = formatBlogPost(postWithEyecatch);
    expect(result.eyecatchUrl).toBe('https://images.microcms-assets.io/test.jpg');
  });

  it('元のposのプロパティをそのまま保持する', () => {
    const result = formatBlogPost(mockPost);
    expect(result.id).toBe(mockPost.id);
    expect(result.title).toBe(mockPost.title);
    expect(result.category.name).toBe('お知らせ');
  });
});
