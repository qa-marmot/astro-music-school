/**
 * 日付文字列を日本語形式にフォーマット
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year  = date.getFullYear();
  const month = date.getMonth() + 1;
  const day   = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 記事の本文から抜粋を生成（HTMLタグを除去）
 */
export function excerptFromContent(html: string, length = 120): string {
  const text = html.replace(/<[^>]*>/g, '');
  return text.length > length ? text.slice(0, length) + '…' : text;
}

/**
 * スラッグを安全な文字列に変換
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * 料金を日本語の円表記にフォーマット
 */
export function formatPrice(price: number): string {
  return `¥${price.toLocaleString('ja-JP')}`;
}

/**
 * ページネーション用のページ番号配列を生成
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  delta = 2
): (number | '...')[] {
  const range: (number | '...')[] = [];
  const left  = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  range.push(1);
  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < totalPages - 1) range.push('...');
  if (totalPages > 1) range.push(totalPages);

  return range;
}
