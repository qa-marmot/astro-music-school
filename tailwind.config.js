/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#fdfbf7',
          100: '#f9f4ec',
          200: '#f2e8d5',
        },
        forest: {
          600: '#2d5a3d',
          700: '#234830',
          800: '#1a3623',
          900: '#112418',
        },
        gold: {
          400: '#d4a853',
          500: '#c49a3c',
          600: '#b08a2e',
        },
        charcoal: {
          700: '#3d3d3d',
          800: '#2a2a2a',
          900: '#1a1a1a',
        },
      },
      fontFamily: {
        serif:  ['"Playfair Display"', 'Georgia', 'serif'],
        sans:   ['"Noto Sans JP"', '"Hiragino Kaku Gothic ProN"', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};
