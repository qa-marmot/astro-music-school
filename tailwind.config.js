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
        // Course accent colors
        piano: {
          50:  '#eef3fa',
          100: '#d6e3f3',
          500: '#2c4a7c',
          700: '#1a2d4f',
          900: '#0d1826',
        },
        guitar: {
          50:  '#faf0e6',
          100: '#f0d9bf',
          500: '#8b5e3c',
          700: '#5c3c22',
          900: '#2e1e11',
        },
        violin: {
          50:  '#faeef2',
          100: '#f0d0da',
          500: '#7c2d4a',
          700: '#4f1a2e',
          900: '#280d18',
        },
        vocal: {
          50:  '#e8f4f3',
          100: '#c5e4e2',
          500: '#2a7f7a',
          700: '#1a4f4c',
          900: '#0d2827',
        },
        flute: {
          50:  '#eaf3eb',
          100: '#cae3cc',
          500: '#3d6b47',
          700: '#264230',
          900: '#132118',
        },
      },
      fontFamily: {
        serif:   ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['"Noto Sans JP"', '"Hiragino Kaku Gothic ProN"', 'sans-serif'],
        rounded: ['"M PLUS Rounded 1c"', '"Noto Sans JP"', 'sans-serif'],
      },
      spacing: {
        '18':  '4.5rem',
        '88':  '22rem',
        '128': '32rem',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backgroundImage: {
        'staff-lines': `repeating-linear-gradient(
          to bottom,
          transparent 0px,
          transparent 18px,
          rgba(139, 94, 60, 0.08) 18px,
          rgba(139, 94, 60, 0.08) 19px
        )`,
        'wood-grain': 'linear-gradient(135deg, #8b5e3c 0%, #c49a3c 30%, #8b5e3c 60%, #5c3c22 100%)',
        'ivory-keys': 'linear-gradient(to bottom, #fdfbf7 0%, #f2e8d5 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(-3deg)' },
          '50%':      { transform: 'translateY(-14px) rotate(3deg)' },
        },
        'drift': {
          '0%':   { transform: 'translateX(0) translateY(0) rotate(0deg)' },
          '33%':  { transform: 'translateX(8px) translateY(-5px) rotate(5deg)' },
          '66%':  { transform: 'translateX(-5px) translateY(-10px) rotate(-3deg)' },
          '100%': { transform: 'translateX(0) translateY(0) rotate(0deg)' },
        },
      },
      animation: {
        'float':      'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'drift':      'drift 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
