import { describe, it, expect } from 'vitest';
import { sanitizeHtml, safeJsonLd } from '../../src/lib/sanitize';

describe('sanitizeHtml', () => {
  it('空文字を渡すと空文字を返す', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  it('<script>タグを内容ごと除去する', () => {
    const html = '<p>テスト</p><script>alert("xss")</script>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
    expect(result).toContain('テスト');
  });

  it('<iframe>タグを内容ごと除去する', () => {
    const html = '<p>前</p><iframe src="https://evil.example"></iframe><p>後</p>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('<iframe');
    expect(result).toContain('前');
    expect(result).toContain('後');
  });

  it('許可タグ (p, strong 等) はそのまま残す', () => {
    const html = '<p>本文</p><strong>強調</strong><em>斜体</em>';
    const result = sanitizeHtml(html);
    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
    expect(result).toContain('<em>');
  });

  it('許可外タグ (span 以外の不審タグ) はタグのみ除去しテキストを保持', () => {
    const html = '<p>通常</p><blink>点滅テキスト</blink>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('<blink>');
    expect(result).toContain('点滅テキスト');
  });

  it('javascript: スキームの href を除去する', () => {
    const html = '<a href="javascript:alert(1)">リンク</a>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('javascript:');
    expect(result).toContain('リンク');
  });

  it('javascript: の大文字小文字混在でも除去する', () => {
    const html = '<a href="  JaVaScRiPt:alert(1)">悪意リンク</a>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('JaVaScRiPt');
  });

  it('target="_blank" に rel="noopener noreferrer" を付与する', () => {
    const html = '<a href="https://example.com" target="_blank">外部</a>';
    const result = sanitizeHtml(html);
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('既存の rel を上書きして rel="noopener noreferrer" にする', () => {
    const html = '<a href="https://example.com" target="_blank" rel="nofollow">外部</a>';
    const result = sanitizeHtml(html);
    const relMatches = result.match(/rel=/g);
    expect(relMatches).toHaveLength(1); // rel が重複しない
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('許可外属性 (onclick等) を除去する', () => {
    const html = '<p onclick="alert(1)" class="text">テスト</p>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('onclick');
    expect(result).toContain('class="text"'); // class は許可
  });

  it('data: スキームの img src を除去する', () => {
    const html = '<img src="data:text/html,<script>alert(1)</script>" alt="test" />';
    const result = sanitizeHtml(html);
    // src が空になるかタグが処理されている
    expect(result).not.toContain('data:text/html');
  });

  it('通常の img src は保持する', () => {
    const html = '<img src="https://images.microcms-assets.io/test.jpg" alt="テスト" />';
    const result = sanitizeHtml(html);
    expect(result).toContain('src="https://images.microcms-assets.io/test.jpg"');
    expect(result).toContain('alt="テスト"');
  });

  it('h2, h3, ul, li, blockquote は許可される', () => {
    const html = '<h2>見出し</h2><ul><li>項目1</li></ul><blockquote>引用</blockquote>';
    const result = sanitizeHtml(html);
    expect(result).toContain('<h2>');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>');
    expect(result).toContain('<blockquote>');
  });
});

describe('safeJsonLd', () => {
  it('通常のオブジェクトをJSON文字列化する', () => {
    const obj = { '@type': 'MusicSchool', name: 'Test' };
    const result = safeJsonLd(obj);
    const parsed = JSON.parse(result);
    expect(parsed['@type']).toBe('MusicSchool');
  });

  it('</script> を含む文字列を安全にエスケープする', () => {
    const obj = { title: 'タイトル</script><script>alert(1)</script>' };
    const result = safeJsonLd(obj);
    expect(result).not.toContain('</script>');
    expect(result).toContain('<\\/script>');
  });

  it('大文字小文字混在の </SCRIPT> もエスケープする', () => {
    const obj = { desc: '</SCRIPT>' };
    const result = safeJsonLd(obj);
    expect(result).not.toContain('</SCRIPT>');
  });
});
