import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// ✅ NOUVEAU : URL API par défaut (utilisée si VITE_API_URL n'est pas défini)
const API_TARGET = process.env.VITE_API_URL || 'https://agroafrica-backend.onrender.com/api'

export default defineConfig({
  base: '/',

  // ✅ NOUVEAU : proxy dev pour éviter CORS en local
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target:  API_TARGET.replace('/api', ''),    // retire /api pour le target
        changeOrigin: true,
        secure:   true,
        rewrite:  (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png', 'og-image.png'],   // ✅ MODIFIÉ

      // ✅ NOUVEAU : manifeste PWA conforme
      manifest: {
        name:           'AgroAfrica — Marché Africain',
        short_name:     'AgroAfrica',
        description:    'Le marché agricole et artisanal africain — Achetez directement auprès des producteurs',
        theme_color:    '#0C6B4E',
        background_color: '#F5F7F5',
        display:        'standalone',
        orientation:    'portrait-primary',
        start_url:      '/',
        scope:          '/',
        lang:           'fr-FR',
        categories:     ['shopping', 'business', 'lifestyle'],
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
        cleanupOutdatedCaches: true,                  // ✅ NOUVEAU
        clientsClaim: true,                            // ✅ NOUVEAU
        skipWaiting: true,                              // ✅ NOUVEAU
        runtimeCaching: [
          {
            // Pages HTML — NetworkFirst avec fallback offline
            urlPattern: ({ url }) => url.pathname === '/' ||
                                    url.pathname.endsWith('.html') ||
                                    !url.pathname.includes('.'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 30, maxAgeSeconds: 24 * 60 * 60 },
            },
          },
          {
            // Images
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            // JS / CSS (stale-while-revalidate)
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
            },
          },
          {
            // API produits (catalogue public)
            urlPattern: /\/api\/products/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-products-cache',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ✅ SUPPRIMÉ : pas de cache pour /api/auth, /api/orders, /api/payment (sécurité)
        ],
      },

      // ✅ NOUVEAU : manifest débug en dev
      devOptions: {
        enabled: false,   // désactive PWA en dev pour éviter pollution
      },
    }),
  ],

  // ✅ NOUVEAU : build target explicite
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'icons':        ['lucide-react'],
        },
      },
    },
  },

  // ✅ NOUVEAU : preview settings
  preview: {
    port: 4173,
    host: true,
  },
})
