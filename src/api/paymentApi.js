import api from './axios'

// ============================================
// CONSTANTES
// ============================================

const PAYMENT_BASE = '/payment'

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

// ✅ Validation de l'ID
const validateId = (id, message = 'Identifiant requis') => {
  if (!id) throw new Error(message)
  return id
}

// ✅ Validation des données de paiement
const validatePaymentData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Données de paiement manquantes.')
  }
  
  if (!data.orderId) {
    throw new Error('Identifiant de commande requis pour le paiement.')
  }
  
  if (!data.method) {
    throw new Error('Méthode de paiement requise (mtn, orange, wave, visa, paypal).')
  }
  
  // Validation spécifique selon la méthode
  if (['mtn', 'orange', 'wave'].includes(data.method)) {
    if (!data.phone) {
      throw new Error('Numéro de téléphone requis pour le Mobile Money.')
    }
    if (data.phone.length < 8) {
      throw new Error('Numéro de téléphone invalide.')
    }
  }
  
  if (data.method === 'visa' && !data.cardToken) {
    throw new Error('Données de carte bancaire requises.')
  }
  
  if (data.amount && data.amount <= 0) {
    throw new Error('Montant invalide.')
  }
  
  return true
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Initie un paiement
 * @param {Object} data - Données de paiement
 * @param {string} data.orderId - ID de la commande
 * @param {string} data.method - Méthode de paiement (mtn, orange, wave, visa, paypal)
 * @param {string} data.phone - Numéro de téléphone (pour Mobile Money)
 * @param {number} data.amount - Montant (optionnel, peut être récupéré depuis la commande)
 * @param {string} data.cardToken - Token de carte (pour Visa)
 * @returns {Promise<Object>} Confirmation du paiement
 */
export const initiatePayment = async (data = {}) => {
  validatePaymentData(data)
  
  // ✅ Nettoyer les données
  const cleanData = {
    orderId: data.orderId,
    method: data.method,
    phone: data.phone || null,
    amount: data.amount || null,
    cardToken: data.cardToken || null,
    country: data.country || 'Cameroun',
    metadata: data.metadata || {},
  }
  
  try {
    const res = await api.post(`${PAYMENT_BASE}/initiate`, cleanData)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur lors de l\'initiation du paiement'))
  }
}

/**
 * Vérifie le statut d'un paiement
 * @param {string} orderId - ID de la commande
 * @returns {Promise<Object>} Statut du paiement
 */
export const checkPaymentStatus = async (orderId) => {
  validateId(orderId, 'Identifiant de commande manquant pour la vérification.')
  
  try {
    const res = await api.get(`${PAYMENT_BASE}/status/${orderId}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de vérification du paiement'))
  }
}

/**
 * Confirme manuellement un paiement (après retour opérateur)
 * @param {string} orderId - ID de la commande
 * @param {Object} payload - Données supplémentaires
 * @param {string} payload.transactionId - ID de la transaction (optionnel)
 * @param {string} payload.reference - Référence de paiement (optionnel)
 * @returns {Promise<Object>} Confirmation
 */
export const confirmPayment = async (orderId, payload = {}) => {
  validateId(orderId, 'Identifiant de commande requis.')
  
  try {
    const res = await api.post(`${PAYMENT_BASE}/confirm/${orderId}`, payload)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de confirmation du paiement'))
  }
}

/**
 * Demande un remboursement
 * @param {string} orderId - ID de la commande
 * @param {string} reason - Raison du remboursement
 * @returns {Promise<Object>} Confirmation du remboursement
 */
export const refundPayment = async (orderId, reason = '') => {
  validateId(orderId, 'Identifiant de commande requis pour un remboursement.')
  
  if (!reason?.trim()) {
    throw new Error('Une raison du remboursement est requise.')
  }
  
  try {
    const res = await api.post(`${PAYMENT_BASE}/refund/${orderId}`, { 
      reason: reason.trim() 
    })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur lors de la demande de remboursement'))
  }
}

/**
 * Récupère l'historique des paiements de l'utilisateur
 * @param {Object} params - Paramètres de filtrage
 * @param {string} params.status - Filtrer par statut (payé, en_attente, échoué)
 * @param {number} params.limit - Nombre de résultats
 * @param {number} params.page - Pagination
 * @param {string} params.startDate - Date de début
 * @param {string} params.endDate - Date de fin
 * @returns {Promise<Object>} Historique des paiements
 */
export const getPaymentHistory = async (params = {}) => {
  try {
    const res = await api.get(`${PAYMENT_BASE}/history`, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement de l\'historique des paiements'))
  }
}

/**
 * Récupère les détails d'un paiement spécifique
 * @param {string} paymentId - ID du paiement
 * @returns {Promise<Object>} Détails du paiement
 */
export const getPaymentDetails = async (paymentId) => {
  validateId(paymentId, 'Identifiant de paiement requis.')
  
  try {
    const res = await api.get(`${PAYMENT_BASE}/${paymentId}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des détails du paiement'))
  }
}

/**
 * Récupère les méthodes de paiement disponibles
 * @param {string} country - Pays (optionnel)
 * @returns {Promise<Array>} Méthodes de paiement disponibles
 */
export const getPaymentMethods = async (country = 'Cameroun') => {
  try {
    const res = await api.get(`${PAYMENT_BASE}/methods`, { 
      params: { country } 
    })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des méthodes de paiement'))
  }
}

/**
 * Vérifie si un paiement est éligible au remboursement
 * @param {string} orderId - ID de la commande
 * @returns {Promise<Object>} Éligibilité au remboursement
 */
export const checkRefundEligibility = async (orderId) => {
  validateId(orderId, 'Identifiant de commande requis.')
  
  try {
    const res = await api.get(`${PAYMENT_BASE}/refund/eligibility/${orderId}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de vérification d\'éligibilité'))
  }
}

// ============================================
// EXPORT GROUPÉ
// ============================================

export default {
  initiatePayment,
  checkPaymentStatus,
  confirmPayment,
  refundPayment,
  getPaymentHistory,
  getPaymentDetails,
  getPaymentMethods,
  checkRefundEligibility,
}