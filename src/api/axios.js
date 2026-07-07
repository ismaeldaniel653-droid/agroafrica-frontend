import axios from 'axios'

// ============================================
// CONSTANTES
// ============================================

const DEFAULT_TIMEOUT = 15000
const TOKEN_KEY = 'agro_token'
const USER_KEY = 'auth_user'
const REFRESH_TOKEN_KEY = 'agro_refresh_token'

// ============================================
// CONFIGURATION DE L'URL DE BASE
// ============================================

// ✅ Logger conditionnel (désactivé en production)
const devLog = (...args) => {
  if (import.meta.env.DEV) console.log(...args)
}

const getBaseURL = () => {
  // 1. Variable d'environnement explicite (priorité)
  if (import.meta.env.VITE_API_URL) {
    devLog('🌐 API URL (VITE_API_URL):', import.meta.env.VITE_API_URL)
    return import.meta.env.VITE_API_URL
  }

  // 2. Proxy Vite en développement (évite CORS)
  if (import.meta.env.DEV) {
    devLog('🌐 API URL (DEV): /api')
    return '/api'
  }

  // 3. URL backend Render en production
  const productionURL = 'https://agroafrica-backend.onrender.com/api'
  devLog('🌐 API URL (PROD):', productionURL)
  return productionURL
}

// ============================================
// CRÉATION DE L'INSTANCE AXIOS
// ============================================

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: DEFAULT_TIMEOUT,
  withCredentials: true, // ✅ Important pour les cookies de session si utilisés
})

// ============================================
// INTERCEPTEUR REQUÊTE
// ============================================

api.interceptors.request.use(
  (config) => {
    // ✅ Récupération du token
    const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // ✅ Ajout du type de contenu si nécessaire (FormData)
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    devLog(`🚀 [${config.method?.toUpperCase()}] ${config.url}`, config.data || '')

    return config
  },
  (error) => {
    devLog('❌ Erreur de requête:', error)
    return Promise.reject(error)
  }
)

// ============================================
// INTERCEPTEUR RÉPONSE
// ============================================

// ✅ Gestion des tokens de rafraîchissement
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => {
    // ✅ Logging en développement
    if (import.meta.env.DEV) {
      console.log(`✅ [${response.config.method?.toUpperCase()}] ${response.config.url} - ${response.status}`)
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // ✅ Éviter les boucles infinies
    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    // ✅ Gestion des erreurs 401 (non authentifié)
    if (error.response?.status === 401) {
      // ✅ Ne pas rediriger si déjà sur /login
      if (window.location.pathname !== '/login') {
        // ✅ Nettoyer le localStorage
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem('token')
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        
        // ✅ Redirection avec message
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        window.location.href = `/login?returnUrl=${returnUrl}`
      }
      return Promise.reject(error)
    }

    // ✅ Gestion des erreurs 429 (rate limiting / trop de requêtes)
    if (error.response?.status === 429) {
      devLog('⏳ Trop de requêtes:', error.config.url)
      error.message = 'Trop de tentatives. Veuillez patienter quelques instants avant de réessayer.'
    }

    // ✅ Gestion des erreurs 403 (accès interdit)
    if (error.response?.status === 403) {
      devLog('⛔ Accès interdit:', error.response.data?.message || 'Permission refusée')
      error.message = error.response.data?.message || 'Accès interdit. Vous n\'avez pas les permissions nécessaires.'
    }

    // ✅ Gestion des erreurs 404
    if (error.response?.status === 404) {
      console.warn('🔍 Ressource non trouvée:', error.config.url)
    }

    // ✅ Gestion des erreurs 500
    if (error.response?.status >= 500) {
      console.error('🔥 Erreur serveur:', error.response.data?.message || 'Erreur interne')
    }

    // ✅ Gestion des erreurs de timeout
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.warn('⏱️ Timeout:', error.config.url)
      // Optionnel: retourner une erreur plus explicite
      error.message = 'Le serveur met trop de temps à répondre. Veuillez réessayer.'
    }

    // ✅ Gestion des erreurs réseau
    if (!error.response) {
      console.error('🌐 Erreur réseau:', error.message)
      error.message = 'Impossible de contacter le serveur. Vérifiez votre connexion.'
    }

    return Promise.reject(error)
  }
)

// ============================================
// UTILITAIRES EXPORTÉS
// ============================================

// ✅ Fonction pour définir le token manuellement
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

// ✅ Fonction pour obtenir le token
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token')
}

// ✅ Fonction pour supprimer le token
export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem('token')
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// ✅ Fonction pour mettre à jour l'URL de base (utile pour les environnements dynamiques)
export const setBaseURL = (url) => {
  api.defaults.baseURL = url
}

// ✅ Fonction pour intercepter les erreurs globalement
export const onApiError = (callback) => {
  // Permet d'ajouter un gestionnaire d'erreur global
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      await callback(error)
      return Promise.reject(error)
    }
  )
}

// ============================================
// EXPORT
// ============================================

export default api