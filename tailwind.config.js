/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'oklch(var(--color-brand-primary) / <alpha-value>)',
          hover: 'oklch(var(--color-brand-primary-hover) / <alpha-value>)',
          secondary: 'oklch(var(--color-brand-secondary) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--color-accent-channel) / <alpha-value>)',
          strong: 'oklch(var(--color-accent-strong) / <alpha-value>)',
        },
        canvas: 'oklch(var(--color-bg-canvas) / <alpha-value>)',
        subtle: 'oklch(var(--color-bg-subtle) / <alpha-value>)',
        surface: 'oklch(var(--color-bg-surface) / <alpha-value>)',
        ink: {
          DEFAULT: 'oklch(var(--color-text-primary) / <alpha-value>)',
          secondary: 'oklch(var(--color-text-secondary) / <alpha-value>)',
          muted: 'oklch(var(--color-text-muted) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'oklch(var(--color-border-default) / <alpha-value>)',
          strong: 'oklch(var(--color-border-strong) / <alpha-value>)',
        },
        state: {
          success: 'oklch(var(--color-success) / <alpha-value>)',
          warning: 'oklch(var(--color-warning) / <alpha-value>)',
          error: 'oklch(var(--color-error) / <alpha-value>)',
        },
      },
      fontFamily: {
        serif: ['var(--font-display)'],
        sans: ['var(--font-body)'],
      },
      maxWidth: {
        content: '72rem',
        wide: '80rem',
        narrow: '44rem',
        measure: '42em',
      },
      spacing: {
        '18': '4.5rem',
        'section-mobile': '4rem',
        'section-tablet': '5rem',
        'section-desktop': '6rem',
      },
      borderRadius: { sm: '2px', DEFAULT: '4px', lg: '8px' },
      boxShadow: { sm: 'var(--shadow-sm)', md: 'var(--shadow-md)', overlay: 'var(--shadow-overlay)' },
      transitionDuration: { fast: '120ms', base: '180ms', slow: '240ms' },
      transitionTimingFunction: { atelier: 'var(--ease-out)' },
    },
  },
  plugins: [],
};
