import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/index.js'
import './index.css'
import App from './App'

// ═══════════════════════════════════════════
// META THEME COLOR (pour la barre d'adresse mobile)
// ═══════════════════════════════════════════
const applyThemeColor = (color = '#0C6B4E') => {
  // ✅ Vérifier si le meta existe déjà
  let meta = document.querySelector('meta[name="theme-color"]')
  
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.appendChild(meta)
  }
  
  meta.content = color
}

// ✅ Appliquer la couleur du thème
applyThemeColor('#0C6B4E')

// ═══════════════════════════════════════════
// SERVICE WORKER (PWA) — optionnel
// ═══════════════════════════════════════════
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('✅ Service Worker enregistré avec succès')
      return registration
    } catch (error) {
      console.warn('⚠️ Erreur d\'enregistrement du Service Worker:', error)
    }
  }
}

// ═══════════════════════════════════════════
// LOADER COMPOSANT (pour PersistGate)
// ═══════════════════════════════════════════
const AppLoader = () => (
  <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[var(--text-secondary)]">Chargement de l'application...</p>
    </div>
  </div>
)

// ═══════════════════════════════════════════
// RENDU PRINCIPAL
// ═══════════════════════════════════════════
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error("❌ Élément root introuvable dans le DOM")
}

// ✅ Détection de l'environnement de développement
const isDev = process.env.NODE_ENV === 'development'

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<AppLoader />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
)

// ✅ Enregistrement du Service Worker (en production uniquement)
if (!isDev) {
  registerServiceWorker()
}

// ═══════════════════════════════════════════
// ANALYTICS (optionnel)
// ═══════════════════════════════════════════
// if (!isDev && import.meta.env.VITE_GA_MEASUREMENT_ID) {
//   const script = document.createElement('script')
//   script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`
//   script.async = true
//   document.head.appendChild(script)
// }

// ═══════════════════════════════════════════
// LOGS DE PERFORMANCE (optionnel)
// ═══════════════════════════════════════════
if (isDev) {
  console.log('🌿 AgroAfrica — Mode développement')
  console.log(`📦 Version: ${import.meta.env.VITE_APP_VERSION || '1.0.0'}`)
  console.log(`🕐 Dernier build: ${new Date().toLocaleString('fr-FR')}`)
}

// ═══════════════════════════════════════════
// EXPORT pour les tests (optionnel)
// ═══════════════════════════════════════════
export { registerServiceWorker, applyThemeColor }
