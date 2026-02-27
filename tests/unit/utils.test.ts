import { describe, it, expect } from 'vitest';
import {
  formatDate,
  excerptFromContent,
  toSlug,
  formatPrice,
  getPaginationRange,
} from '../../src/lib/utils';

describe('formatDate', () => {
  it('ISO日付文字列を日本語形式に変換する', () => {
    const result = formatDate('2024-11-01T00:00:00.000Z');
    // タイムゾーンによって日付がずれるため、年と月が含まれることを確認
    expect(result).toMatch(/2024年/);
    expect(result).toMatch(/月/);
    expect(result).toMatch(/日/);
  });

  it('異なる日付で正しくフォーマットされる', () => {
    const result = formatDate('2024-03-15T12:00:00.000Z');
    expect(result).toContain('2024年');
    expect(result).toMatch(/15日|14日/); // UTC/JST差を考慮
  });
});

describe('excerptFromContent', () => {
  it('HTMLタグを除去して本文を返す', () => {
    const html = '<p>これはテストです。</p><h2>見出し</h2>';
    const result = excerptFromContent(html, 200);
    expect(result).toBe('これはテストです。見出し');
  });

  it('指定文字数を超えた場合に切り詰める', () => {
    const longText = '<p>' + 'あ'.repeat(200) + '</p>';
    const result = excerptFromContent(longText, 120);
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(125); // 120文字 + "…"
  });

  it('指定文字数以内の場合はそのまま返す', () => {
    const html = '<p>短いテキスト</p>';
    const result = excerptFromContent(html, 120);
    expect(result).toBe('短いテキスト');
    expect(result.endsWith('…')).toBe(false);
  });
});

describe('toSlug', () => {
  it('スペースをハイフンに変換する', () => {
    expect(toSlug('hello world')).toBe('hello-world');
  });

  it('大文字を小文字に変換する', () => {
    expect(toSlug('Hello World')).toBe('hello-world');
  });

  it('複数のスペースを1つのハイフンにまとめる', () => {
    expect(toSlug('hello   world')).toBe('hello-world');
  });

  it('特殊文字を除去する', () => {
    expect(toSlug('hello! @world#')).toBe('hello-world');
  });
});

describe('formatPrice', () => {
  it('1000以上の数値にカンマを入れる', () => {
    expect(formatPrice(12000)).toBe('¥12,000');
  });

  it('1000未満の数値はカンマなし', () => {
    expect(formatPrice(500)).toBe('¥500');
  });

  it('0を正しくフォーマットする', () => {
    expect(formatPrice(0)).toBe('¥0');
  });
});

describe('getPaginationRange', () => {
  it('ページ数が少ない場合は全ページを返す', () => {
    const range = getPaginationRange(1, 3);
    expect(range).toEqual([1, 2, 3]);
  });

  it('現在ページが中間の場合に省略記号を含む', () => {
    const range = getPaginationRange(5, 10);
    expect(range).toContain('...');
    expect(range[0]).toBe(1);
    expect(range[range.length - 1]).toBe(10);
  });

  it('最初のページでは左側に省略記号なし', () => {
    const range = getPaginationRange(1, 10);
    expect(range[0]).toBe(1);
    expect(range[1]).not.toBe('...');
  });

  it('最後のページでは右側に省略記号なし', () => {
    const range = getPaginationRange(10, 10);
    const lastTwo = range.slice(-2);
    expect(lastTwo[1]).toBe(10);
    expect(lastTwo[0]).not.toBe('...');
  });
});
