/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body:    ['"Sora"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        surface: {
          0:   '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
        },
        ink: {
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      boxShadow: {
        'card':       '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(99,102,241,0.18), 0 2px 8px rgba(0,0,0,0.08)',
        'glow':       '0 0 0 3px rgba(99,102,241,0.2)',
        'btn':        '0 2px 8px rgba(99,102,241,0.35)',
        'btn-hover':  '0 6px 24px rgba(99,102,241,0.5)',
      },
      keyframes: {
        'fade-up':    { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'fade-in':    { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'slide-right':{ '0%': { opacity: 0, transform: 'translateX(-16px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
        'shimmer':    { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'float':      { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        'blob':       { '0%,100%': { borderRadius:'60% 40% 30% 70%/60% 30% 70% 40%' }, '50%': { borderRadius:'30% 60% 70% 40%/50% 60% 30% 60%' } },
        'spin-slow':  { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
      },
      animation: {
        'fade-up':     'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':     'fade-in 0.5s ease forwards',
        'slide-right': 'slide-right 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'shimmer':     'shimmer 2s linear infinite',
        'float':       'float 5s ease-in-out infinite',
        'blob':        'blob 10s ease-in-out infinite',
        'spin-slow':   'spin-slow 12s linear infinite',
      },
    },
  },
  plugins: [],
}
