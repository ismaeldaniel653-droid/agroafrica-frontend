/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './public/**/*.html',
    './components/**/*.{js,jsx}',
    './pages/**/*.{js,jsx}',
  ],
  
  // ✅ Mode JIT (recommandé pour Vercel)
  mode: 'jit',

  // ✅ Support du mode sombre
  darkMode: 'class',

  theme: {
    extend: {
      // ═══════════════════════════════════════════
      // COULEURS
      // ═══════════════════════════════════════════
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
        // ✅ Couleurs du thème (pour compatibilité avec les variables CSS)
        primary: {
          DEFAULT: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          card: 'var(--bg-card)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          light: 'var(--text-light)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
        },
        border: {
          DEFAULT: 'var(--border-color)',
        },
      },

      // ═══════════════════════════════════════════
      // TYPOGRAPHIE
      // ═══════════════════════════════════════════
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },

      // ═══════════════════════════════════════════
      // ANIMATIONS
      // ═══════════════════════════════════════════
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-fast': 'fadeIn 0.2s ease-out',
        'fade-in-slow': 'fadeIn 1s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.4s ease-out',
        'slide-in-down': 'slideInDown 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'page-enter': 'pageEnter 0.3s ease-out',
        'avatar-pop': 'avatarPop 0.4s ease-out',
        'avatar-spin': 'avatarSpin 1s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'scroll-down': 'scrollDown 1.5s ease-in-out infinite',
      },

      // ═══════════════════════════════════════════
      // KEYFRAMES
      // ═══════════════════════════════════════════
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        pageEnter: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        avatarPop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        avatarSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        bounceSoft: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scrollDown: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(8px)', opacity: '0' },
        },
      },

      // ═══════════════════════════════════════════
      // OMBRES
      // ═══════════════════════════════════════════
      boxShadow: {
        'soft': '0 2px 8px rgba(12, 107, 78, 0.08)',
        'medium': '0 4px 16px rgba(12, 107, 78, 0.12)',
        'strong': '0 8px 32px rgba(12, 107, 78, 0.16)',
        'soft-dark': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'medium-dark': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'strong-dark': '0 8px 32px rgba(0, 0, 0, 0.2)',
      },

      // ═══════════════════════════════════════════
      // BORDER RADIUS
      // ═══════════════════════════════════════════
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },

      // ═══════════════════════════════════════════
      // SPACING
      // ═══════════════════════════════════════════
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
        '128': '32rem',
      },

      // ═══════════════════════════════════════════
      // SCREENS
      // ═══════════════════════════════════════════
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },

      // ═══════════════════════════════════════════
      // FONT SIZE
      // ═══════════════════════════════════════════
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '0.875rem' }],
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
    },
  },

  // ═══════════════════════════════════════════
  // PLUGINS
  // ═══════════════════════════════════════════
  plugins: [
    // ✅ Safe area pour iPhone
    function ({ addUtilities }) {
      addUtilities({
        '.pt-safe': { paddingTop: 'env(safe-area-inset-top)' },
        '.pb-safe': { paddingBottom: 'env(safe-area-inset-bottom)' },
        '.pl-safe': { paddingLeft: 'env(safe-area-inset-left)' },
        '.pr-safe': { paddingRight: 'env(safe-area-inset-right)' },
        '.p-safe': {
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        },
      })
    },
    
    // ✅ Plugin pour cacher les scrollbars (si besoin)
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '4px',
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'var(--border-color)',
            borderRadius: '9999px',
          },
        },
      })
    },
  ],
}