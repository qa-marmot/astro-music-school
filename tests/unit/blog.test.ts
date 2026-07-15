import { describe, it, expect } from 'vitest';
import { formatBlogPost, getAllBlogPosts, getBlogList, getBlogPost, getCategories } from '../../src/lib/blog';
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

  it('eyecatchがない場合はURLを返さない', () => {
    const result = formatBlogPost(mockPost);
    expect(result.eyecatchUrl).toBeUndefined();
  });

  it('eyecatchがある場合はそのURLを返す', () => {
    const postWithEyecatch: BlogPost = {
      ...mockPost,
      eyecatch: { url: '/images/blog/test.jpg', height: 675, width: 1200 },
    };
    const result = formatBlogPost(postWithEyecatch);
    expect(result.eyecatchUrl).toBe('/images/blog/test.jpg');
  });

  it('元のposのプロパティをそのまま保持する', () => {
    const result = formatBlogPost(mockPost);
    expect(result.id).toBe(mockPost.id);
    expect(result.title).toBe(mockPost.title);
    expect(result.category.name).toBe('お知らせ');
  });
});

describe('ローカルブログデータ', () => {
  it('4件の記事と2件のカテゴリを返す', async () => {
    await expect(getAllBlogPosts()).resolves.toHaveLength(4);
    await expect(getCategories()).resolves.toHaveLength(2);
  });

  it('カテゴリで記事を絞り込む', async () => {
    const result = await getBlogList({ categoryId: 'practice' });
    expect(result.totalCount).toBe(2);
    expect(result.contents.every((post) => post.category.id === 'practice')).toBe(true);
  });

  it('limitとoffsetで記事をページングする', async () => {
    const result = await getBlogList({ limit: 2, offset: 1 });
    expect(result.contents).toHaveLength(2);
    expect(result.totalCount).toBe(4);
    expect(result.limit).toBe(2);
    expect(result.offset).toBe(1);
  });

  it('IDから記事を取得する', async () => {
    const post = await getBlogPost('piano-practice-rhythm');
    expect(post.title).toContain('ピアノ初心者');
  });
});
