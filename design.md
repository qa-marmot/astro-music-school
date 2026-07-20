# Design — Harmony Music School

A locked Hallmark design system for this multi-page site. Every page shares one
visual language; page structure changes only when the page's job changes.

## Genre

Editorial — quiet, local, attentive, and enduring. The site should feel like a
carefully typeset lesson programme, not a SaaS landing-page template.

## Macrostructure family

- Home: **Marquee Hero** with a typography-led fold and the licensed lesson image below it.
- Lessons: **Catalogue** with four instrument rows rather than equal cards.
- Trial: **Narrative Workflow** using the verified application sequence.
- FAQ: **Conversational FAQ** using native details/summary.
- Blog index and category: **Ecosystem Index** with featured, latest, and category surfaces.
- About, pricing, access, contact, privacy, 404, and blog articles: **Long Document**, with tabular or form modules only where the content requires them.

## Theme

- `--color-paper`: `oklch(97.98% 0.0086 84.6)`
- `--color-paper-2`: `oklch(94.8% 0.0148 80.7)`
- `--color-ink`: `oklch(25.3% 0.0063 78.2)`
- `--color-ink-2`: `oklch(42.18% 0.0125 81.8)`
- `--color-rule`: `oklch(86.1% 0.0215 79.1)`
- `--color-accent`: `oklch(66.21% 0.1168 80.1)`
- `--color-focus`: `oklch(47% 0.0927 167.3)`
- Brand forest: `oklch(37.62% 0.0589 161)`

The brass accent is a signal, not a surface: active navigation, one primary CTA,
focus support, and small typographic marks only.

## Typography

- Display: Noto Serif JP, weight 700, normal style.
- Body: Noto Sans JP, weight 400.
- Outlier: Noto Sans JP, weight 700, used only for masthead metadata and compact labels.
- Display tracking: `-0.03em`.
- Type scale anchor: `--text-display: clamp(3rem, 8vw, 5.25rem)`.
- Body measure: 60–70ch for marketing copy and articles.
- Headings are never italic. Section eyebrows are off unless the content is genuinely sequential.

## Spacing

The 4-point named scale lives in `tokens.css`. Pages use named tokens and
deliberately vary section depth rather than repeating equal padding.

## Motion

- Easings: `--ease-out`, `--ease-in`, and `--ease-in-out` from `tokens.css`.
- Reveal pattern: none. Content is present on load.
- Menu, FAQ, and button press feedback only; transform and opacity only.
- Reduced-motion fallback: state changes are immediate; transforms are removed.

## Microinteractions stance

- Silent success where the resulting state is visible.
- Focus rings appear instantly.
- Hover is always paired with focus and active states.
- All touch targets are at least 44px.
- Existing form validation, error focus, sending, timeout, and duplicate-submit behaviour remain unchanged.

## CTA voice

- Primary: compact brass rectangular tab, dark ink, short verb-led label.
- Secondary: forest hairline outline or typographic link.
- Large dark CTA sections are reserved for the final home-page invitation.
- Clickable labels stay on one line from 320px upward.

## Navigation and footer

- Navigation: **N6 Masthead**, adapted as a music-programme heading. Large centred wordmark, quiet context line, navigation rail below, double rule.
- Footer: **Ft4 Dense Colophon**. One typographic closing block with essential links, verified contact data when present, and the single demo disclosure.

## Per-page allowances

- Home and lesson pages may use the existing licensed editorial photography.
- Photo-free pages use type, spacing, and rules for rhythm; no decorative image is added.
- Forms retain their existing fields, IDs, payload, and scripts.
- Blog content retains sanitisation and structured-data control.

## What pages MUST share

- Wordmark and masthead structure.
- Palette, display/body fonts, focus treatment, and CTA voice.
- Hairline divider language and square-to-2px corner treatment.
- Footer colophon and demo disclosure placement.

## What pages MAY differ on

- Macrostructure according to the family above.
- Hero density and image presence.
- Section heading spacing and supporting table/list treatment.

## Exports

### tokens.css

`tokens.css` at the project root is the implementation source of truth.

### Tailwind v4 `@theme`

```css
@theme {
  --color-paper: oklch(97.98% 0.0086 84.6);
  --color-paper-2: oklch(94.8% 0.0148 80.7);
  --color-ink: oklch(25.3% 0.0063 78.2);
  --color-ink-2: oklch(42.18% 0.0125 81.8);
  --color-rule: oklch(86.1% 0.0215 79.1);
  --color-accent: oklch(66.21% 0.1168 80.1);
  --color-focus: oklch(47% 0.0927 167.3);
  --font-display: "Noto Serif JP", "Yu Mincho", ui-serif, serif;
  --font-body: "Noto Sans JP", "Yu Gothic", ui-sans-serif, system-ui, sans-serif;
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
    "paper": { "$value": "oklch(97.98% 0.0086 84.6)", "$type": "color" },
    "paper-2": { "$value": "oklch(94.8% 0.0148 80.7)", "$type": "color" },
    "ink": { "$value": "oklch(25.3% 0.0063 78.2)", "$type": "color" },
    "ink-2": { "$value": "oklch(42.18% 0.0125 81.8)", "$type": "color" },
    "rule": { "$value": "oklch(86.1% 0.0215 79.1)", "$type": "color" },
    "accent": { "$value": "oklch(66.21% 0.1168 80.1)", "$type": "color" },
    "focus": { "$value": "oklch(47% 0.0927 167.3)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Noto Serif JP, Yu Mincho, ui-serif, serif", "$type": "fontFamily" },
    "body": { "$value": "Noto Sans JP, Yu Gothic, ui-sans-serif, system-ui, sans-serif", "$type": "fontFamily" }
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
  --background: 97.98% 0.0086 84.6;
  --foreground: 25.3% 0.0063 78.2;
  --card: 94.8% 0.0148 80.7;
  --card-foreground: 25.3% 0.0063 78.2;
  --primary: 66.21% 0.1168 80.1;
  --primary-foreground: 25.3% 0.0063 78.2;
  --secondary: 92.4% 0.018 80.7;
  --secondary-foreground: 42.18% 0.0125 81.8;
  --muted: 86.1% 0.0215 79.1;
  --muted-foreground: 54.35% 0.015 82.4;
  --border: 86.1% 0.0215 79.1;
  --input: 69.5% 0.026 78;
  --ring: 47% 0.0927 167.3;
  --radius: 2px;
}
```
