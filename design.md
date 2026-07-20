# Design — Harmony Music School

Hallmarkで固定した、Harmony Music School全体のEditorial design systemです。
色、書体、CTA、写真処理は全ページで共有し、ページ構造だけを目的に応じて変えます。

## Genre and theme

- Genre: **Editorial**
- Theme route: **custom**
- Vibe: **quiet, precise, musical, contemporary**
- Axes: **light / roman-serif / warm**
- Accent footprint: 3%以下。銅色を全面背景には使わない。
- Gradient、glass、装飾的な影、スクロール演出は使わない。

## Macrostructure family

- Home: **Photographic**。右7列の大型写真に左コピーを1列だけ重ねる。
- Lessons: **Split Studio**。写真5列＋本文6列を交互配置する。
- Trial: **Narrative Workflow**。申込から体験までを事実順に並べる。
- FAQ: **Conversational FAQ**。カテゴリ案内とnative detailsを分離する。
- Blog index/category: **Ecosystem Index**。featured 1件＋記事リスト。
- About、Pricing、Access、Contact、Privacy、404、記事: **Long Document**。

## Colour

- Canvas `oklch(98.2% 0.007 85)`
- Subtle `oklch(95.8% 0.011 80)`
- Surface `oklch(99.2% 0.004 85)`
- Ink `oklch(23% 0.018 255)`
- Ink secondary `oklch(38% 0.020 255)`
- Muted `oklch(45% 0.015 255)`
- Rule `oklch(84% 0.012 255)`
- Brand navy `oklch(31% 0.055 255)`
- Brand dark `oklch(25% 0.045 255)`
- Copper `oklch(62% 0.105 52)`
- Copper strong `oklch(43% 0.090 52)`
- Focus `oklch(48% 0.130 250)`

銅色は現在地、短い罫線、補助的な強調だけに使います。Primary CTAは深紺です。

## Typography

- Display: **Newsreader Variable**（ローカル配信）、日本語はOS明朝へフォールバック。
- Body/UI: **Hiragino Sans / Yu Gothic UI / Yu Gothic**。
- 明朝体はトップH1、短いキーフレーズ、英字ワードマークだけに限定。
- H1 `clamp(2.5rem, 5vw, 4.75rem)`、line-height 1.05。
- H2 `clamp(1.75rem, 3vw, 2.5rem)`、Sans 700。
- 本文16px、line-height 1.75、通常42em、記事65ch。
- 価格、日付、ステップ番号はtabular nums。
- 見出しはroman。装飾目的のeyebrowは使わない。

## Layout and space

- 4px基準のnamed spacingを使う。
- Section depthは `compact / default / feature` の3段階。
- Containerはwide 88rem、standard 74rem、prose 46rem。
- 12列グリッドを基礎に、7:5、5:7など内容に合わせた非対称構成を使う。
- モバイルの情報順はページごとに定義し、CTAラベルは320px以上で折り返さない。

## Photography and surfaces

- 既存8点のライセンス済み写真を使い、captionで「イメージ」と明示する。
- 写真は既定で枠なし、影なし、角丸0〜2px。captionは画像外。
- Heroのみeager/high。下層写真はlazy/async。
- 外枠はフォームなど意味のある面に限定し、カードの入れ子を作らない。

## Motion and states

- Menu、FAQ、button pressだけを120〜220msで動かす。
- `transition-all`、bounce、scroll revealは使わない。
- Focus ringは即時表示。Hoverはfocusとactiveを必ず併設。
- Touch targetは44px以上。`prefers-reduced-motion`ではtransformを停止する。
- 既存フォームのfield、payload、validation、error focus、timeout、二重送信制御は変更しない。

## CTA voice

- Primary: 深紺面＋アイボリー文字。
- Secondary: 深紺の1px outline。
- Tertiary: 文字＋矢印。
- 最終CTAだけ深紺の全面背景。Primaryは体験、Secondaryは一般質問。

## Navigation and footer

- Navigation: **N9-derived edge alignment**。左ワードマーク、主要2リンク、メニュー、体験CTA。
- Menu panel: 罫線主体、外側クリック／Escape／focus復帰を維持。
- Footer: **Ft1 Mast-headed**を3層へ圧縮。ブランド文、必要リンク、確認済み連絡先、著作権、デモ注記。

## Non-negotiable product contracts

- Astro route、CourseId、PricingPlan、SiteContent、microCMS、form JSONは変更しない。
- SEO、canonical、noindex、robots、JSON-LD、本番validationを維持する。
- `EditorialImage`の最適化、focal point、caption、license metadataを維持する。
- ファイル削除は行わない。

## Exports

### tokens.css

`tokens.css` at the project root is the implementation source of truth.

### Tailwind v4 `@theme`

```css
@theme {
  --color-paper: oklch(98.2% 0.007 85);
  --color-paper-2: oklch(95.8% 0.011 80);
  --color-paper-3: oklch(93.5% 0.014 80);
  --color-surface: oklch(99.2% 0.004 85);
  --color-ink: oklch(23% 0.018 255);
  --color-ink-2: oklch(38% 0.020 255);
  --color-muted: oklch(45% 0.015 255);
  --color-rule: oklch(84% 0.012 255);
  --color-rule-2: oklch(72% 0.016 255);
  --color-brand: oklch(31% 0.055 255);
  --color-accent: oklch(62% 0.105 52);
  --color-accent-ink: oklch(23% 0.018 255);
  --color-focus: oklch(48% 0.130 250);
  --font-display: "Newsreader Variable", "Yu Mincho", ui-serif, serif;
  --font-body: "Hiragino Sans", "Yu Gothic UI", "Yu Gothic", ui-sans-serif, system-ui, sans-serif;
  --spacing-xs: 0.75rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 2.5rem;
  --spacing-2xl: 4rem;
  --spacing-3xl: 6rem;
  --text-md: 1.25rem;
  --text-xl: 1.9531rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### DTCG `tokens.json`

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "paper": { "$value": "oklch(98.2% 0.007 85)", "$type": "color" },
    "paper-2": { "$value": "oklch(95.8% 0.011 80)", "$type": "color" },
    "paper-3": { "$value": "oklch(93.5% 0.014 80)", "$type": "color" },
    "surface": { "$value": "oklch(99.2% 0.004 85)", "$type": "color" },
    "ink": { "$value": "oklch(23% 0.018 255)", "$type": "color" },
    "ink-2": { "$value": "oklch(38% 0.020 255)", "$type": "color" },
    "muted": { "$value": "oklch(45% 0.015 255)", "$type": "color" },
    "rule": { "$value": "oklch(84% 0.012 255)", "$type": "color" },
    "rule-2": { "$value": "oklch(72% 0.016 255)", "$type": "color" },
    "brand": { "$value": "oklch(31% 0.055 255)", "$type": "color" },
    "accent": { "$value": "oklch(62% 0.105 52)", "$type": "color" },
    "accent-ink": { "$value": "oklch(23% 0.018 255)", "$type": "color" },
    "focus": { "$value": "oklch(48% 0.130 250)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Newsreader Variable, Yu Mincho, ui-serif, serif", "$type": "fontFamily" },
    "body": { "$value": "Hiragino Sans, Yu Gothic UI, Yu Gothic, ui-sans-serif, system-ui, sans-serif", "$type": "fontFamily" }
  },
  "space": {
    "xs": { "$value": "0.75rem", "$type": "dimension" },
    "sm": { "$value": "1rem", "$type": "dimension" },
    "md": { "$value": "1.5rem", "$type": "dimension" },
    "lg": { "$value": "2rem", "$type": "dimension" },
    "xl": { "$value": "2.5rem", "$type": "dimension" },
    "2xl": { "$value": "4rem", "$type": "dimension" },
    "3xl": { "$value": "6rem", "$type": "dimension" }
  }
}
```

### shadcn/ui CSS variables

```css
:root {
  --background: 98.2% 0.007 85;
  --foreground: 23% 0.018 255;
  --card: 99.2% 0.004 85;
  --card-foreground: 23% 0.018 255;
  --primary: 31% 0.055 255;
  --primary-foreground: 98.2% 0.007 85;
  --secondary: 95.8% 0.011 80;
  --secondary-foreground: 38% 0.020 255;
  --muted: 93.5% 0.014 80;
  --muted-foreground: 45% 0.015 255;
  --accent: 62% 0.105 52;
  --accent-foreground: 23% 0.018 255;
  --border: 84% 0.012 255;
  --input: 72% 0.016 255;
  --ring: 48% 0.130 250;
  --radius: 4px;
}
```
