# microCMS スキーマ設計

## 概要

このドキュメントでは Harmony Music School で使用する microCMS のスキーマ設計を定義します。

---

## 1. カテゴリ（categories）

**エンドポイント種別**: リスト形式  
**エンドポイント名**: `categories`

| フィールド ID | フィールド名 | 種別 | 必須 | 説明 |
|-------------|------------|------|------|------|
| name | カテゴリ名 | テキストフィールド | ✅ | 例: お知らせ, レッスン情報, コラム |
| slug | スラッグ | テキストフィールド | ✅ | URLに使うID (英数字・ハイフンのみ) |

**サンプルデータ**:
```json
[
  { "id": "news",   "name": "お知らせ",    "slug": "news" },
  { "id": "lesson", "name": "レッスン情報", "slug": "lesson" },
  { "id": "column", "name": "コラム",      "slug": "column" }
]
```

---

## 2. ブログ（blog）

**エンドポイント種別**: リスト形式  
**エンドポイント名**: `blog`

| フィールド ID | フィールド名 | 種別 | 必須 | 説明 |
|-------------|------------|------|------|------|
| title | タイトル | テキストフィールド | ✅ | 記事タイトル（60文字以内推奨） |
| slug | スラッグ | テキストフィールド | ✅ | URLパス（英数字・ハイフン） |
| excerpt | 抜粋 | テキストエリア | ✅ | 一覧・OGP用の要約（120文字以内推奨） |
| content | 本文 | リッチエディタ | ✅ | 記事本文（HTML） |
| eyecatch | アイキャッチ画像 | 画像 | | OGP・一覧サムネ用（1200×630px推奨） |
| category | カテゴリ | コンテンツ参照（categories） | ✅ | categoriesエンドポイントを参照 |
| tags | タグ | テキストフィールド（複数値） | | 任意のタグ |

**APIクエリ例**:
```
GET /api/v1/blog?orders=-publishedAt&limit=9&offset=0
GET /api/v1/blog?filters=category[equals]{categoryId}&orders=-publishedAt
GET /api/v1/blog/{contentId}
```

---

## 3. 講師（instructors） ※将来拡張用

**エンドポイント種別**: リスト形式  
**エンドポイント名**: `instructors`

| フィールド ID | フィールド名 | 種別 | 必須 | 説明 |
|-------------|------------|------|------|------|
| name | 氏名 | テキストフィールド | ✅ | |
| nameKana | フリガナ | テキストフィールド | ✅ | |
| nameEn | 英語表記 | テキストフィールド | | |
| role | 役職・担当 | テキストフィールド | ✅ | 例: ピアノ科 主任講師 |
| bio | プロフィール | テキストエリア | ✅ | |
| career | 経歴 | テキストエリア | | |
| photo | 写真 | 画像 | | 正方形〜縦型推奨 |
| instruments | 担当楽器 | テキストフィールド（複数値） | ✅ | |

---

## 設定手順

1. **microCMS にログイン** → [https://app.microcms.io/](https://app.microcms.io/)

2. **サービスを作成**（または既存サービスを選択）

3. **categories エンドポイントを作成**
   - 「APIを追加」→「リスト形式」
   - エンドポイント ID: `categories`
   - フィールドを上表に従って追加

4. **blog エンドポイントを作成**
   - 「APIを追加」→「リスト形式」
   - エンドポイント ID: `blog`
   - category フィールドは「コンテンツ参照」→ `categories` を選択

5. **APIキーを取得**
   - 「APIキー」→ コンテンツ取得用のキーをコピー
   - `.env` ファイルに設定:
     ```
     MICROCMS_SERVICE_DOMAIN=your-service-domain
     MICROCMS_API_KEY=your-api-key
     ```

6. **CORS設定**（Cloudflare Pages デプロイ後）
   - 「サービス設定」→「セキュリティ」→ デプロイ先ドメインを許可
