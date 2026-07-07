import api from './axios'

// ============================================
// CONSTANTES
// ============================================

const LIVREUR_BASE = '/livreurs'

// ============================================
// UTILITAIRES
// ============================================

// ✅ Helper pour gérer les erreurs
const handleApiError = (error, defaultMessage = 'Une erreur est survenue') => {
  if (error.response) {
    return error.response.data?.message || error.response.data?.error || defaultMessage
  } else if (error.request) {
    return 'Impossible de contacter le serveur. Vérifiez votre connexion.'
  } else {
    return error.message || defaultMessage
  }
}

// ✅ Validation des données du livreur
const validateLivreurData = (data) => {
  const errors = []
  
  if (!data.name?.trim()) errors.push('Nom complet requis')
  if (data.name?.trim().length < 2) errors.push('Nom trop court (minimum 2 caractères)')
  
  if (!data.phone?.trim()) errors.push('Numéro de téléphone requis')
  if (data.phone?.trim().length < 8) errors.push('Numéro de téléphone invalide')
  
  if (!data.zone?.trim()) errors.push('Zone de livraison requise')
  
  if (!data.moto) errors.push('Type de véhicule requis')
  
  if (!data.tarif || Number(data.tarif) <= 0) errors.push('Tarif de base valide requis')
  if (Number(data.tarif) < 500) errors.push('Tarif minimum de 500 FCFA')
  
  if (errors.length > 0) {
    throw new Error(errors.join(', '))
  }
  
  return true
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Récupère la liste de tous les livreurs
 * @param {Object} params - Paramètres de filtrage
 * @param {string} params.zone - Filtrer par zone (optionnel)
 * @param {boolean} params.dispo - Filtrer par disponibilité (optionnel)
 * @param {number} params.limit - Nombre de résultats (optionnel)
 * @returns {Promise<Object>} Liste des livreurs
 */
export const getLivreurs = async (params = {}) => {
  try {
    const res = await api.get(LIVREUR_BASE, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des livreurs'))
  }
}

/**
 * Récupère un livreur par son ID
 * @param {string} id - ID du livreur
 * @returns {Promise<Object>} Données du livreur
 */
export const getLivreurById = async (id) => {
  if (!id) throw new Error('Identifiant livreur requis.')
  
  try {
    const res = await api.get(`${LIVREUR_BASE}/${id}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement du livreur'))
  }
}

/**
 * Enregistre un nouveau livreur
 * @param {Object} data - Données du livreur
 * @param {string} data.name - Nom complet
 * @param {string} data.phone - Numéro de téléphone
 * @param {string} data.zone - Zone de livraison
 * @param {string} data.moto - Type de véhicule (moto-taxi, moto, velo, voiture)
 * @param {number} data.tarif - Tarif de base en FCFA
 * @param {string} data.photo - Photo du livreur (optionnel)
 * @param {string} data.description - Description (optionnel)
 * @returns {Promise<Object>} Livreur enregistré
 */
export const registerLivreur = async (data) => {
  // ✅ Validation
  validateLivreurData(data)
  
  // ✅ Nettoyer les données
  const cleanData = {
    name: data.name.trim(),
    phone: data.phone.trim(),
    zone: data.zone.trim(),
    moto: data.moto,
    tarif: Number(data.tarif),
    photo: data.photo || null,
    description: data.description?.trim() || null,
  }
  
  try {
    const res = await api.post(`${LIVREUR_BASE}/register`, cleanData)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur lors de l\'inscription du livreur'))
  }
}

/**
 * Met à jour un livreur
 * @param {string} id - ID du livreur
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>} Livreur mis à jour
 */
export const updateLivreur = async (id, data) => {
  if (!id) throw new Error('Identifiant livreur requis.')
  
  try {
    const res = await api.put(`${LIVREUR_BASE}/${id}`, data)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de mise à jour du livreur'))
  }
}

/**
 * Supprime un livreur
 * @param {string} id - ID du livreur
 * @returns {Promise<Object>} Confirmation de suppression
 */
export const deleteLivreur = async (id) => {
  if (!id) throw new Error('Identifiant livreur requis.')
  
  try {
    const res = await api.delete(`${LIVREUR_BASE}/${id}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de suppression du livreur'))
  }
}

/**
 * Change la disponibilité d'un livreur
 * @param {string} id - ID du livreur
 * @param {boolean} dispo - Disponibilité
 * @returns {Promise<Object>} Livreur mis à jour
 */
export const setLivreurDisponibilite = async (id, dispo) => {
  if (!id) throw new Error('Identifiant livreur requis.')
  
  try {
    const res = await api.patch(`${LIVREUR_BASE}/${id}/disponibilite`, { dispo })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de mise à jour de la disponibilité'))
  }
}

/**
 * Récupère les livreurs disponibles dans une zone
 * @param {string} zone - Zone de livraison
 * @returns {Promise<Array>} Livreurs disponibles
 */
export const getLivreursByZone = async (zone) => {
  if (!zone?.trim()) throw new Error('Zone de livraison requise.')
  
  try {
    const res = await api.get(`${LIVREUR_BASE}/zone/${encodeURIComponent(zone)}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des livreurs par zone'))
  }
}

/**
 * Récupère les statistiques des livreurs
 * @returns {Promise<Object>} Statistiques (total, disponibles, etc.)
 */
export const getLivreurStats = async () => {
  try {
    const res = await api.get(`${LIVREUR_BASE}/stats`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des statistiques'))
  }
}

// ============================================
// EXPORT GROUPÉ
// ============================================

export default {
  getLivreurs,
  getLivreurById,
  registerLivreur,
  updateLivreur,
  deleteLivreur,
  setLivreurDisponibilite,
  getLivreursByZone,
  getLivreurStats,
}