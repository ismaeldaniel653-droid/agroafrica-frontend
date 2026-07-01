/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './public/**/*.html',
  ],
  // ✅ NOUVEAU : mode JIT explicite (recommandé Vercel)
  mode: 'jit',

  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT:  '#0C6B4E',
          dark:     '#0A5C42',
          light:    '#18A070',
          accent:   '#F0A500',
          danger:   '#D95030',
          ink:      '#1A2E25',
          cloud:    '#F5F7F5',
          smoke:    '#DDE8E2',
          slate:    '#8AADA0',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      animation: {
        'fade-in':         'fadeIn 0.5s ease-out',
        'slide-in-right':  'slideInRight 0.3s ease-out',
        'slide-in-up':     'slideInUp 0.4s ease-out',
        'shimmer':         'shimmer 2s linear infinite',
        'pulse-glow':      'pulseGlow 2s ease-in-out infinite',
        'page-enter':      'pageEnter 0.3s ease-out',
        'avatar-pop':      'avatarPop 0.4s ease-out',
        'avatar-spin':     'avatarSpin 1s linear infinite',
      },
      keyframes: {
        fadeIn:         { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideInRight:   { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        slideInUp:      { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        shimmer:        { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseGlow:      { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
        pageEnter:      { '0%': { opacity: 0, transform: 'scale(0.96)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        avatarPop:      { '0%': { transform: 'scale(0.8)', opacity: 0 }, '60%': { transform: 'scale(1.05)' }, '100%': { transform: 'scale(1)', opacity: 1 } },
        avatarSpin:     { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
      },
      boxShadow: {
        'soft':   '0 2px 8px rgba(12, 107, 78, 0.08)',
        'medium': '0 4px 16px rgba(12, 107, 78, 0.12)',
        'strong': '0 8px 32px rgba(12, 107, 78, 0.16)',
      },
    },
  },
  plugins: [
    // ✅ NOUVEAU : plugin safe-area iPhone
    function ({ addUtilities }) {
      addUtilities({
        '.pt-safe':    { paddingTop:    'env(safe-area-inset-top)' },
        '.pb-safe':    { paddingBottom: 'env(safe-area-inset-bottom)' },
        '.pl-safe':    { paddingLeft:   'env(safe-area-inset-left)' },
        '.pr-safe':    { paddingRight:  'env(safe-area-inset-right)' },
      })
    },
  ],
}
