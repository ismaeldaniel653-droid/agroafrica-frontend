/**
 * 🔬 API Santé / Health Check
 * 
 * Utilitaire pour vérifier l'état du backend.
 * Utile pour le monitoring et le débogage.
 */

import api from './axios'

const HEALTH_ENDPOINT = '/health'

/**
 * Vérifie l'état de santé du backend
 * @returns {Promise<{status: string, message: string, timestamp: string}>}
 */
export const checkHealth = async () => {
  try {
    const res = await api.get(HEALTH_ENDPOINT, { timeout: 5000 })
    return {
      status: 'ok',
      message: res.data?.message || 'Backend opérationnel',
      timestamp: new Date().toISOString(),
      data: res.data,
    }
  } catch (error) {
    // Le endpoint /api/health peut ne pas exister sur le backend
    // On vérifie donc si le serveur répond (même avec 404)
    if (error.response) {
      // Le serveur a répondu (peut-être 404) → backend accessible
      if (error.response.status === 404) {
        return {
          status: 'degraded',
          message: 'Backend accessible mais endpoint /health non implémenté',
          timestamp: new Date().toISOString(),
          statusCode: 404,
        }
      }
      return {
        status: 'error',
        message: error.response.data?.message || `Erreur ${error.response.status}`,
        timestamp: new Date().toISOString(),
        statusCode: error.response.status,
      }
    }
    // Pas de réponse du serveur
    return {
      status: 'unreachable',
      message: error.message || 'Backend injoignable',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Vérification rapide (ping) du backend
 * @returns {Promise<boolean>} true si le backend répond
 */
export const pingBackend = async () => {
  try {
    const res = await api.get(HEALTH_ENDPOINT, { timeout: 3000 })
    return res.status < 500
  } catch {
    return false
  }
}

/**
 * Vérification complète de la disponibilité des services
 * @returns {Promise<Object>}
 */
export const fullHealthCheck = async () => {
  const results = {
    backend: { status: 'unknown', latency: 0 },
    api: { status: 'unknown', latency: 0 },
    timestamp: new Date().toISOString(),
  }

  // Test backend
  const backendStart = Date.now()
  try {
    const res = await api.get(HEALTH_ENDPOINT, { timeout: 5000 })
    results.backend = {
      status: res.status < 500 ? 'ok' : 'error',
      latency: Date.now() - backendStart,
      statusCode: res.status,
    }
  } catch (error) {
    results.backend = {
      status: 'error',
      latency: Date.now() - backendStart,
      error: error.message,
    }
  }

  // Test API products
  const apiStart = Date.now()
  try {
    const res = await api.get('/products', { timeout: 5000, params: { limit: 1 } })
    results.api = {
      status: 'ok',
      latency: Date.now() - apiStart,
      statusCode: res.status,
      productsCount: res.data?.total || 0,
    }
  } catch (error) {
    results.api = {
      status: 'error',
      latency: Date.now() - apiStart,
      error: error.message,
    }
  }

  return results
}

export default {
  checkHealth,
  pingBackend,
  fullHealthCheck,
}