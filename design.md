# Design — Harmony Music School

A locked Hallmark design system for this multi-page site. Every page shares one
visual language; page structure changes only when the page's job changes.

## Genre

Editorial — warm, local, attentive, and enduring. The site should feel like a
quiet neighbourhood music atelier with the care of a typeset lesson programme,
not an austere journal or a SaaS landing-page template.

## Macrostructure family

- Home: **Marquee Hero** with a warm image-led split; the lesson photograph and
  primary decision are visible in the same first composition.
- Lessons: **Catalogue** with four instrument rows rather than equal cards.
- Trial: **Narrative Workflow** using the verified application sequence.
- FAQ: **Conversational FAQ** using native details/summary.
- Blog index and category: **Ecosystem Index** with featured, latest, and category surfaces.
- About, pricing, access, contact, privacy, 404, and blog articles: **Long Document**, with tabular or form modules only where the content requires them.

## Theme

- `--color-paper`: `oklch(97.4% 0.014 80)`
- `--color-paper-2`: `oklch(94.2% 0.024 76)`
- `--color-paper-3`: `oklch(91.5% 0.032 73)`
- `--color-ink`: `oklch(27% 0.025 57)`
- `--color-ink-2`: `oklch(42% 0.03 58)`
- `--color-rule`: `oklch(84% 0.03 70)`
- `--color-accent`: `oklch(67% 0.115 78)`
- `--color-focus`: `oklch(45% 0.1 165)`
- Brand forest: `oklch(38.8% 0.065 158)`

The brass accent is a signal, not a surface: active navigation, one primary CTA,
focus support, and small typographic marks only.

## Typography

- Display: Noto Serif JP, weight 700, normal style.
- Body: Noto Sans JP, weight 400.
- Outlier: Noto Sans JP, weight 700, used only for masthead metadata and compact labels.
- Display tracking: `-0.03em`.
- Type scale anchor: `--text-display: clamp(2.5rem, 5vw, 3.75rem)`.
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

- Primary: compact brass button with a restrained 6px corner, dark warm ink, and a short verb-led label.
- Secondary: forest hairline outline or typographic link.
- Strong CTA sections use a warm oatmeal surface with forest type; dark full-bleed bands are avoided.
- Clickable labels stay on one line from 320px upward.

## Navigation and footer

- Navigation: **N6 Masthead**, softened for a neighbourhood atelier. A modest centred wordmark, warm context strip, navigation rail, and single light rule.
- Footer: **Ft4 Dense Colophon** on a warm paper surface. One typographic closing block with essential links, verified contact data when present, and the single demo disclosure.

## Per-page allowances

- Home and lesson pages may use the existing licensed editorial photography.
- Photo-free pages use type, spacing, and rules for rhythm; no decorative image is added.
- Forms retain their existing fields, IDs, payload, and scripts.
- Blog content retains sanitisation and structured-data control.

## What pages MUST share

- Wordmark and masthead structure.
- Palette, display/body fonts, focus treatment, and CTA voice.
- Warm hairline dividers and a restrained 4–8px corner treatment for images, forms, and bounded panels.
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
  --color-paper: oklch(97.4% 0.014 80);
  --color-paper-2: oklch(94.2% 0.024 76);
  --color-paper-3: oklch(91.5% 0.032 73);
  --color-surface: oklch(99.2% 0.007 76);
  --color-ink: oklch(27% 0.025 57);
  --color-ink-2: oklch(42% 0.03 58);
  --color-muted: oklch(50.5% 0.025 62);
  --color-rule: oklch(84% 0.03 70);
  --color-rule-2: oklch(70% 0.04 65);
  --color-brand: oklch(38.8% 0.065 158);
  --color-accent: oklch(67% 0.115 78);
  --color-focus: oklch(45% 0.1 165);
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
    "paper": { "$value": "oklch(97.4% 0.014 80)", "$type": "color" },
    "paper-2": { "$value": "oklch(94.2% 0.024 76)", "$type": "color" },
    "paper-3": { "$value": "oklch(91.5% 0.032 73)", "$type": "color" },
    "surface": { "$value": "oklch(99.2% 0.007 76)", "$type": "color" },
    "ink": { "$value": "oklch(27% 0.025 57)", "$type": "color" },
    "ink-2": { "$value": "oklch(42% 0.03 58)", "$type": "color" },
    "muted": { "$value": "oklch(50.5% 0.025 62)", "$type": "color" },
    "rule": { "$value": "oklch(84% 0.03 70)", "$type": "color" },
    "rule-2": { "$value": "oklch(70% 0.04 65)", "$type": "color" },
    "brand": { "$value": "oklch(38.8% 0.065 158)", "$type": "color" },
    "accent": { "$value": "oklch(67% 0.115 78)", "$type": "color" },
    "focus": { "$value": "oklch(45% 0.1 165)", "$type": "color" }
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
  --background: 97.4% 0.014 80;
  --foreground: 27% 0.025 57;
  --card: 94.2% 0.024 76;
  --card-foreground: 27% 0.025 57;
  --primary: 67% 0.115 78;
  --primary-foreground: 27% 0.025 57;
  --secondary: 91.5% 0.032 73;
  --secondary-foreground: 42% 0.03 58;
  --muted: 84% 0.03 70;
  --muted-foreground: 50.5% 0.025 62;
  --border: 84% 0.03 70;
  --input: 70% 0.04 65;
  --ring: 45% 0.1 165;
  --radius: 8px;
}
```
