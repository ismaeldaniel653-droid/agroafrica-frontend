import api from './axios'

// ============================================
// CONSTANTES
// ============================================

const ADMIN_BASE = '/admin'

// ============================================
// UTILITAIRES
// ============================================

// ✅ Helper pour gérer les erreurs
const handleApiError = (error, defaultMessage = 'Une erreur est survenue') => {
  if (error.response) {
    // La requête a été faite et le serveur a répondu avec un code d'erreur
    return error.response.data?.message || error.response.data?.error || defaultMessage
  } else if (error.request) {
    // La requête a été faite mais aucune réponse n'a été reçue
    return 'Impossible de contacter le serveur. Vérifiez votre connexion.'
  } else {
    // Une erreur s'est produite lors de la configuration de la requête
    return error.message || defaultMessage
  }
}

// ✅ Helper pour les IDs
const validateId = (id, message = 'Identifiant requis') => {
  if (!id) throw new Error(message)
  return id
}

// ============================================
// DASHBOARD
// ============================================

/**
 * Récupère les statistiques du tableau de bord
 * @returns {Promise<Object>} Statistiques globales
 */
export const getDashboardStats = async () => {
  try {
    const res = await api.get(`${ADMIN_BASE}/dashboard`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des statistiques'))
  }
}

/**
 * Récupère les statistiques par pays
 * @returns {Promise<Array>} Statistiques par pays
 */
export const getStatsByCountry = async () => {
  try {
    const res = await api.get(`${ADMIN_BASE}/stats/countries`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des statistiques par pays'))
  }
}

/**
 * Récupère les ventes par mois
 * @param {Object} params - Paramètres de filtrage (année, etc.)
 * @returns {Promise<Array>} Ventes par mois
 */
export const getSalesByMonth = async (params = {}) => {
  try {
    const res = await api.get(`${ADMIN_BASE}/stats/sales`, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des ventes mensuelles'))
  }
}

/**
 * Récupère les meilleurs vendeurs
 * @param {Object} params - Paramètres (limit, etc.)
 * @returns {Promise<Array>} Meilleurs vendeurs
 */
export const getTopSellers = async (params = {}) => {
  try {
    const res = await api.get(`${ADMIN_BASE}/stats/sellers`, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des meilleurs vendeurs'))
  }
}

// ============================================
// USERS
// ============================================

/**
 * Récupère la liste des utilisateurs
 * @param {Object} params - Paramètres de filtrage (page, limit, search, role, status)
 * @returns {Promise<Object>} Liste des utilisateurs avec pagination
 */
export const getUsers = async (params = {}) => {
  try {
    const res = await api.get(`${ADMIN_BASE}/users`, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des utilisateurs'))
  }
}

/**
 * Récupère un utilisateur par son ID
 * @param {string} id - ID de l'utilisateur
 * @returns {Promise<Object>} Données de l'utilisateur
 */
export const getUser = async (id) => {
  validateId(id, 'Identifiant utilisateur manquant.')
  try {
    const res = await api.get(`${ADMIN_BASE}/users/${id}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement de l\'utilisateur'))
  }
}

/**
 * Met à jour un utilisateur
 * @param {string} id - ID de l'utilisateur
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>} Utilisateur mis à jour
 */
export const updateUser = async (id, data) => {
  validateId(id, 'Identifiant utilisateur requis.')
  try {
    const res = await api.put(`${ADMIN_BASE}/users/${id}`, data)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de mise à jour de l\'utilisateur'))
  }
}

/**
 * Supprime un utilisateur
 * @param {string} id - ID de l'utilisateur
 * @returns {Promise<Object>} Confirmation de suppression
 */
export const deleteUser = async (id) => {
  validateId(id, 'Identifiant utilisateur requis.')
  try {
    const res = await api.delete(`${ADMIN_BASE}/users/${id}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de suppression de l\'utilisateur'))
  }
}

/**
 * Vérifie un utilisateur
 * @param {string} id - ID de l'utilisateur
 * @returns {Promise<Object>} Utilisateur vérifié
 */
export const verifyUser = async (id) => {
  validateId(id, 'Identifiant utilisateur requis.')
  try {
    const res = await api.patch(`${ADMIN_BASE}/users/${id}/verify`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de vérification de l\'utilisateur'))
  }
}

/**
 * Suspend un utilisateur
 * @param {string} id - ID de l'utilisateur
 * @returns {Promise<Object>} Utilisateur suspendu
 */
export const suspendUser = async (id) => {
  validateId(id, 'Identifiant utilisateur requis.')
  try {
    const res = await api.patch(`${ADMIN_BASE}/users/${id}/suspend`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de suspension de l\'utilisateur'))
  }
}

// ============================================
// EXPORT GROUPÉ
// ============================================

export default {
  // Dashboard
  getDashboardStats,
  getStatsByCountry,
  getSalesByMonth,
  getTopSellers,
  // Users
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  verifyUser,
  suspendUser,
}