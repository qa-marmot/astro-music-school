/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'rgb(var(--color-brand-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-brand-primary-hover) / <alpha-value>)',
          secondary: 'rgb(var(--color-brand-secondary) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          strong: 'rgb(var(--color-accent-strong) / <alpha-value>)',
        },
        canvas: 'rgb(var(--color-bg-canvas) / <alpha-value>)',
        subtle: 'rgb(var(--color-bg-subtle) / <alpha-value>)',
        surface: 'rgb(var(--color-bg-surface) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'rgb(var(--color-border-default) / <alpha-value>)',
          strong: 'rgb(var(--color-border-strong) / <alpha-value>)',
        },
        state: {
          success: 'rgb(var(--color-success) / <alpha-value>)',
          warning: 'rgb(var(--color-warning) / <alpha-value>)',
          error: 'rgb(var(--color-error) / <alpha-value>)',
        },
        // Compatibility aliases kept while page templates migrate.
        cream: { 50: '#fdfbf7', 100: '#f9f4ec', 200: '#ded5c5' },
        forest: { 600: '#2d5a3d', 700: '#234830', 800: '#1a3623', 900: '#112418' },
        gold: { 400: '#d4a853', 500: '#c49a3c', 600: '#7a5a18' },
        charcoal: { 700: '#3d3d3d', 800: '#2a2a2a', 900: '#1a1a1a' },
      },
      fontFamily: {
        serif: ['"Noto Serif JP"', '"Yu Mincho"', '"Hiragino Mincho ProN"', 'serif'],
        sans: ['"Noto Sans JP"', '"Hiragino Kaku Gothic ProN"', 'sans-serif'],
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
      boxShadow: {
        sm: '0 1px 2px rgba(17, 36, 24, 0.08)',
        md: '0 8px 24px rgba(17, 36, 24, 0.12)',
        overlay: '0 16px 48px rgba(17, 36, 24, 0.18)',
      },
      transitionDuration: { fast: '120ms', base: '180ms', slow: '240ms' },
      transitionTimingFunction: { atelier: 'cubic-bezier(.2,0,0,1)' },
    },
  },
  plugins: [],
};
