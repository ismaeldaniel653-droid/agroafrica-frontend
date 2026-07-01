import axios from 'axios'

// ✅ NOUVEAU : timeout pour éviter les blocages infinis (Render peut être lent)
const apiBaseURL = (() => {
  // 1. Variable d'environnement explicite (Vercel, etc.)
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL

  // 2. Proxy Vite en développement (évite CORS)
  if (import.meta.env.DEV) return '/api'

  // 3. URL backend Render en production (GitHub Pages, etc.)
  return 'https://agroafrica-backend.onrender.com/api'
})()

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  // ✅ NOUVEAU : 15s — suffisamment long pour Render qui "se réveille" parfois
  timeout: 15000
})

// ✅ MODIFIÉ : ajoute le token automatiquement + accepte aussi "agro_token" en fallback
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token') || localStorage.getItem('agro_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ✅ MODIFIÉ : intercepteur plus robuste — évite les boucles de redirection infinies
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Nettoyage complet (token + profil + cache avatar)
      localStorage.removeItem('token')
      localStorage.removeItem('agro_token')
      localStorage.removeItem('auth_user')
      // ✅ NOUVEAU : redirection safe — évite boucle si on est déjà sur /login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
