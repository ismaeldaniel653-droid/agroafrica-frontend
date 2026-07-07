// ═══════════════════════════════════════════
// POSTCSS CONFIGURATION
// ═══════════════════════════════════════════

export default {
  plugins: {
    // ✅ Tailwind CSS
    tailwindcss: {},
    
    // ✅ Autoprefixer (ajoute les préfixes navigateurs)
    autoprefixer: {},
    
    // ✅ Optionnel : postcss-nesting pour les règles CSS imbriquées
    // 'postcss-nesting': {},
    
    // ✅ Optionnel : cssnano pour minifier en production
    // ...(process.env.NODE_ENV === 'production' ? {
    //   cssnano: {
    //     preset: ['default', {
    //       discardComments: {
    //         removeAll: true,
    //       },
    //     }],
    //   },
    // } : {}),
  },
}