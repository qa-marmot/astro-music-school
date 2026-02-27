/**
 * microCMS リッチエディタの HTML 出力をサニタイズする
 *
 * 方針:
 * - 許可タグのみ残し、それ以外は除去（タグごと削除ではなくテキストは保持）
 * - 許可属性のみ残す
 * - href / src は javascript: スキームを除去
 * - target="_blank" には rel="noopener noreferrer" を強制付与
 * - <script> / <iframe> / <form> は内容ごと除去
 *
 * ⚠️ Node.js ビルド時（SSG）専用。ブラウザ DOM API は使用しない。
 *    軽量な正規表現ベース実装。複雑なネストには限界があるが、
 *    CMS入力のリッチテキストには十分なレベル。
 */

/** 内容ごと削除するタグ（開始〜終了タグをまるごと除去） */
const BLOCKED_TAGS = ['script', 'iframe', 'form', 'object', 'embed', 'link', 'meta', 'style'];

/** 許可するタグ（これ以外はタグのみ除去・テキストは保持） */
const ALLOWED_TAGS = new Set([
  'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'strong', 'em', 'b', 'i', 'u', 's', 'del', 'ins', 'mark',
  'blockquote', 'pre', 'code',
  'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption',
  'div', 'span', 'figure', 'figcaption',
]);

/** タグごとに許可する属性 */
const ALLOWED_ATTRS: Record<string, string[]> = {
  a:   ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'width', 'height', 'loading'],
  td:  ['colspan', 'rowspan'],
  th:  ['colspan', 'rowspan', 'scope'],
  ol:  ['start', 'type'],
  li:  ['value'],
  '*': ['class', 'id'], // 全タグに許可
};

/** 危険なプロトコルパターン */
const DANGEROUS_PROTOCOL = /^[\s\u0000]*(?:javascript|vbscript|data):/i;

/**
 * 属性値を検証し、危険な値は空文字に置換する
 */
function sanitizeAttrValue(attrName: string, value: string): string {
  const decoded = value.replace(/&#x?[0-9a-f]+;?/gi, '').replace(/\\u[0-9a-f]{4}/gi, '');
  if (['href', 'src', 'action'].includes(attrName)) {
    if (DANGEROUS_PROTOCOL.test(decoded)) return '';
  }
  return value;
}

/**
 * 1つのタグ文字列（<a href="...">など）を属性フィルタリングして返す
 */
function filterAttributes(tagStr: string, tagName: string): string {
  const allowed = [
    ...(ALLOWED_ATTRS[tagName] ?? []),
    ...(ALLOWED_ATTRS['*'] ?? []),
  ];

  // 属性を正規表現で抽出・再構築
  let result = `<${tagName}`;
  const attrPattern = /\s+([\w\-:]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]*)))?/g;
  let match: RegExpExecArray | null;

  while ((match = attrPattern.exec(tagStr)) !== null) {
    const attrName  = match[1].toLowerCase();
    const attrValue = match[2] ?? match[3] ?? match[4] ?? '';

    if (!allowed.includes(attrName)) continue;

    const safe = sanitizeAttrValue(attrName, attrValue);
    result += ` ${attrName}="${safe.replace(/"/g, '&quot;')}"`;
  }

  // target="_blank" があれば rel を強制上書き
  if (result.includes('target="_blank"')) {
    result = result.replace(/\s+rel="[^"]*"/, '');
    result += ' rel="noopener noreferrer"';
  }

  result += tagStr.trimEnd().endsWith('/') ? ' />' : '>';
  return result;
}

/**
 * microCMS リッチエディタ HTML をサニタイズして返す
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  let output = html;

  // 1. ブロック対象タグを内容ごと除去
  for (const tag of BLOCKED_TAGS) {
    const re = new RegExp(`<${tag}[\\s\\S]*?<\\/${tag}>`, 'gi');
    output = output.replace(re, '');
    // 自己クローズの場合も除去
    const reSelf = new RegExp(`<${tag}[^>]*\\/?>`, 'gi');
    output = output.replace(reSelf, '');
  }

  // 2. 残ったタグを許可リストで処理
  output = output.replace(/<(\/?)([\w\-]+)([^>]*)>/g, (full, slash, tagRaw, attrs) => {
    const tag = tagRaw.toLowerCase();

    // 閉じタグ
    if (slash === '/') {
      return ALLOWED_TAGS.has(tag) ? `</${tag}>` : '';
    }

    // 許可タグ → 属性フィルタリング
    if (ALLOWED_TAGS.has(tag)) {
      return filterAttributes(full, tag);
    }

    // 不許可タグ → タグだけ除去（テキストは保持）
    return '';
  });

  return output;
}

/**
 * JSON-LD に埋め込む文字列から </script> インジェクションを防ぐ
 * JSON.stringify の結果をそのまま <script> タグに出力する場合に使用
 */
export function safeJsonLd(obj: Record<string, unknown>): string {
  return JSON.stringify(obj).replace(/<\/script>/gi, '<\\/script>');
}
