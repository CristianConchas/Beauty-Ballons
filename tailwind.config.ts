import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:   'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          accent:    'var(--color-accent)',
        },
        wa: {
          DEFAULT: '#25D366',
          dark:    '#1DAB52',
          light:   '#DCF8C6',
        },
        // Fondos cálidos del design system
        bg: {
          base:    'var(--bg-base)',
          warm:    'var(--bg-warm)',
          muted:   'var(--bg-muted)',
          surface: 'var(--bg-surface)',
          dark:    'var(--bg-dark)',
        },
        ink: {
          DEFAULT: 'var(--text-primary)',
          '70':    'var(--text-secondary)',
          '40':    'var(--text-muted)',
        },
        admin: {
          bg:      '#F8FAFC',
          surface: '#FFFFFF',
          border:  '#E2E8F0',
          muted:   '#64748B',
          text:    '#0F172A',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '18':  '4.5rem',
        '88':  '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-md': '0 4px 12px 0 rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'card-lg': '0 10px 30px -5px rgb(0 0 0 / 0.09), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
        'modal':   '0 25px 60px -12px rgb(0 0 0 / 0.25)',
        'wa':      '0 4px 20px rgba(37,211,102,0.40)',
      },
      keyframes: {
        'hero-rise': {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        'dot-blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.2' },
        },
        'fab-ring': {
          '0%':        { transform: 'scale(1)',   opacity: '0.55' },
          '70%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'carousel-scroll': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(var(--carousel-dist, -50%))' },
        },
        'shimmer': {
          from: { backgroundPosition: '200% 0' },
          to:   { backgroundPosition: '-200% 0' },
        },
        'count-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      animation: {
        'hero-rise':        'hero-rise 0.9s cubic-bezier(0.22,1,0.36,1) both',
        'dot-blink':        'dot-blink 2.2s ease infinite',
        'fab-ring':         'fab-ring 2.4s ease-out infinite',
        'carousel-scroll':  'carousel-scroll linear infinite',
        'shimmer':          'shimmer 1.8s linear infinite',
        'count-up':         'count-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in':          'fade-in 0.6s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}

export default config
