# Harmony Music School

音楽教室向けのAstroサイトです。ピアノ、ギター、バイオリン、声楽の個人レッスンと、有料体験レッスンの申込導線を扱います。

Astro 4 / Tailwind CSS / microCMS / Vitest / Playwrightで構成し、Cloudflare Pagesへの静的デプロイを想定しています。

## セットアップ

Node.js 20以上を使用してください。

```bash
npm install
copy .env.example .env
npm run dev
```

開発サーバーは通常 `http://localhost:4321` で起動します。

## デモモードと本番モード

初期値は `PUBLIC_CONTENT_MODE=demo` です。デモモードでは次の安全策が有効になります。

- 全ページにサンプル表示を出し、`noindex,nofollow` にする
- 架空の講師、住所、連絡先、実績を表示しない
- フォーム送信先がない場合は「送信されません」と明示し、成功扱いにしない
- microCMS未設定でもビルドし、ブログは空状態を表示する

本番化する場合は `.env` を次のように設定し、[src/data/site.ts](./src/data/site.ts) に確認済みの教室情報、講師、料金を設定してください。

```env
PUBLIC_CONTENT_MODE=production
PUBLIC_SITE_URL=https://example.com
PUBLIC_SITE_NAME=Harmony Music School
PUBLIC_FORM_ENDPOINT=https://example.com/api/forms
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

本番モードでは、HTTPSの公開URL、フォーム送信先、連絡先、講師が不足しているとビルドを停止します。プライバシーポリシーと料金条件も実際の運用に合わせて確認してください。

## フォームAPI

`/trial` と `/contact` は `PUBLIC_FORM_ENDPOINT` へJSONをPOSTします。HTTP 2xxが返った場合だけ完了表示になります。

```json
{
  "type": "trial",
  "name": "山田 花子",
  "email": "hanako@example.com",
  "instrument": "piano",
  "privacy": "on"
}
```

`type` は `trial` または `contact` です。既存のフォームfield名をそのまま送ります。API側では入力値の再検証、レート制限、スパム対策、適切なCORS設定を行ってください。

## microCMS

ブログだけをmicroCMSで管理します。スキーマは [microcms-schema/SCHEMA.md](./microcms-schema/SCHEMA.md) を参照してください。

- `categories`: `name`, `slug`
- `blog`: `title`, `slug`, `excerpt`, `content`, `eyecatch`, `category`

環境変数がない場合、一覧はHTTP 200の空状態になります。架空のフォールバック記事や詳細ルートは生成しません。

## デザインシステム

- Semantic Color Tokenの正本: [src/styles/global.css](./src/styles/global.css)
- Tailwindとの接続: [tailwind.config.js](./tailwind.config.js)
- 教室・コース・料金: [src/data/site.ts](./src/data/site.ts)
- UI primitive: `src/components/ui/`
- FAQ / Blog component: `src/components/content/`, `src/components/blog/`

本文はNoto Sans JP、見出しはNoto Serif JPを使用します。Primary CTAは「体験レッスン（3,000円）を申し込む」で統一しています。

## テストとビルド

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:a11y
npm run test:visual
```

Visual Regressionの基準画像を意図的に更新する場合だけ、次を実行します。

```bash
npm run test:visual:update
```

Visual Regressionは360、390、768、1024、1280、1440pxで主要9ページを確認します。外部写真の通信差分を除くため、テスト中だけ固定プレースホルダーへ置換します。

## 主なページ

| パス | 内容 |
| --- | --- |
| `/` | トップ |
| `/about` | 教室方針・講師 |
| `/lessons` | 4コース |
| `/pricing` | 体験・月額料金 |
| `/trial` | 体験申込 |
| `/contact` | 一般問い合わせ |
| `/faq` | よくある質問 |
| `/access` | 教室情報・地図 |
| `/blog` | ブログ |
| `/privacy` | プライバシーポリシー |

## デプロイ

Cloudflare PagesではBuild commandを `npm run build`、Output directoryを `dist` に設定し、上記の本番環境変数を登録してください。`PUBLIC_SITE_URL` はcanonical、sitemap、robots、OG URLの基準になります。
