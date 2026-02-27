# 🎵 Harmony Music School — Webサイト

音楽教室・習い事教室向けのWebサイトです。  
**Astro + Tailwind CSS + microCMS** で構築し、**Cloudflare Pages** にデプロイします。

---

## 技術スタック

| 役割 | 技術 |
|------|------|
| フレームワーク | Astro (SSG) |
| スタイリング | Tailwind CSS |
| CMS | microCMS |
| 開発環境 | Docker |
| 単体テスト | Vitest |
| E2Eテスト | Playwright |
| デプロイ | Cloudflare Pages |

---

## ページ構成

| パス | ページ名 |
|------|---------|
| `/` | トップページ |
| `/about` | 教室紹介・講師紹介 |
| `/lessons` | レッスン内容 |
| `/pricing` | 料金プラン |
| `/trial` | 体験レッスン申込 |
| `/blog` | ブログ一覧 |
| `/blog/[id]` | ブログ詳細 |
| `/blog/category/[id]` | カテゴリ別一覧 |
| `/contact` | お問い合わせ |
| `/faq` | FAQ |
| `/access` | アクセス |

---

## セットアップ手順

### 前提条件

- Node.js 20+
- npm 9+
- Docker（オプション）

### 1. リポジトリの準備

```bash
git clone <your-repo-url>
cd music-school-website
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env` を編集して microCMS の情報を入力してください:

```env
MICROCMS_SERVICE_DOMAIN=your-service-domain   # ← 変更
MICROCMS_API_KEY=your-api-key                  # ← 変更
PUBLIC_SITE_URL=https://your-school.pages.dev  # ← 変更
PUBLIC_SITE_NAME=Harmony Music School          # ← 変更（任意）
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. 開発サーバーの起動

```bash
npm run dev
# http://localhost:4321 でアクセス
```

### Docker を使う場合

```bash
docker compose up dev
# http://localhost:4321 でアクセス
```

---

## microCMS 設定手順

詳細は [`microcms-schema/SCHEMA.md`](./microcms-schema/SCHEMA.md) を参照してください。

### 最小手順

1. [microCMS](https://microcms.io/) でアカウント作成・サービス作成
2. `categories` エンドポイントを作成（リスト形式）
   - `name` (テキスト) / `slug` (テキスト)
3. `blog` エンドポイントを作成（リスト形式）
   - `title`, `slug`, `excerpt`, `content` (リッチエディタ), `eyecatch` (画像), `category` (コンテンツ参照)
4. APIキーを取得して `.env` に設定

> **microCMS なしでの動作確認**  
> 環境変数が未設定の場合、ブログ一覧・詳細ページはサンプルデータで表示されます（開発用フォールバック）。

---

## テスト実行

### 単体テスト（Vitest）

```bash
npm test
# カバレッジ付き
npm run test -- --coverage
```

### E2Eテスト（Playwright）

```bash
# 開発サーバーが起動している状態で
npm run test:e2e

# UIモードで実行
npm run test:e2e:ui
```

> E2EテストはローカルのAstro dev serverに対して実行されます。  
> 初回実行時は `npx playwright install` でブラウザをインストールしてください。

---

## ビルド

```bash
# ローカルビルド
npm run build

# ビルド結果プレビュー
npm run preview

# Docker でビルド
docker compose run --rm build
```

---

## Cloudflare Pages デプロイ手順

### GitHubと連携する場合（推奨）

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → 「Workers & Pages」→「Create application」→「Pages」
2. 「Connect to Git」→ GitHubリポジトリを選択
3. ビルド設定:

   | 項目 | 値 |
   |------|-----|
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

4. 環境変数を Cloudflare Pages の設定画面で追加:
   - `MICROCMS_SERVICE_DOMAIN`
   - `MICROCMS_API_KEY`
   - `PUBLIC_SITE_URL`（`https://xxx.pages.dev` 形式）

5. 「Save and Deploy」をクリック

### Wrangler CLI を使う場合

```bash
npm install -g wrangler
wrangler login
wrangler pages deploy dist --project-name=music-school-website
```

---

## プロジェクト構成

```
/
├── src/
│   ├── components/
│   │   └── common/          # Header, Footer, SEOHead
│   ├── layouts/
│   │   └── BaseLayout.astro # 全ページ共通レイアウト
│   ├── lib/
│   │   ├── microcms.ts      # microCMS クライアント
│   │   ├── blog.ts          # ブログAPI・整形関数
│   │   └── utils.ts         # ユーティリティ関数
│   ├── pages/               # Astro ページ
│   │   ├── index.astro      # トップ
│   │   ├── about.astro      # 教室紹介
│   │   ├── lessons.astro    # レッスン内容
│   │   ├── pricing.astro    # 料金
│   │   ├── trial.astro      # 体験レッスン
│   │   ├── contact.astro    # お問い合わせ
│   │   ├── faq.astro        # FAQ
│   │   ├── access.astro     # アクセス
│   │   ├── 404.astro
│   │   └── blog/
│   │       ├── index.astro         # ブログ一覧
│   │       ├── [id].astro          # 記事詳細
│   │       └── category/[id].astro # カテゴリ絞り込み
│   └── types/
│       └── index.ts         # TypeScript型定義
├── public/
│   └── images/              # 静的画像（OG画像等）
├── tests/
│   ├── unit/                # Vitest 単体テスト
│   └── e2e/                 # Playwright E2Eテスト
├── docker/
│   ├── Dockerfile.dev
│   └── Dockerfile.prod
├── microcms-schema/
│   └── SCHEMA.md            # microCMSスキーマ設計
├── docker-compose.yml
├── astro.config.mjs
├── tailwind.config.js
├── playwright.config.ts
├── vitest.config.ts
└── .env.example
```

---

## カスタマイズガイド

### 教室情報の変更

- **名前・連絡先**: `src/components/common/Footer.astro`, `src/pages/contact.astro`, `src/pages/access.astro`
- **ナビゲーション**: `src/components/common/Header.astro`
- **SEO（サイト名・OGP）**: `src/components/common/SEOHead.astro` + `.env` の `PUBLIC_SITE_NAME`

### カラー・フォントの変更

`tailwind.config.js` の `theme.extend.colors` でブランドカラーを変更できます。

### フォームのバックエンド連携

`src/pages/trial.astro` と `src/pages/contact.astro` の `<script>` ブロック内にある  
`// TODO: 送信処理を実装` の箇所に、Formspree / Cloudflare Workers / EmailJS などのAPIコールを追加してください。

---

## ライセンス

MIT
