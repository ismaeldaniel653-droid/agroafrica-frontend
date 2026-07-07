import api from './axios'

// ============================================
// CONSTANTES
// ============================================

const WALLET_BASE = '/wallet'

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

// ✅ Validation des données d'envoi
const validateSendMoney = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Données de transfert manquantes.')
  }
  
  if (!data.phone?.trim()) {
    throw new Error('Numéro destinataire requis.')
  }
  if (data.phone.trim().length < 8) {
    throw new Error('Numéro de téléphone invalide.')
  }
  
  if (!data.amount || Number(data.amount) <= 0) {
    throw new Error('Montant valide requis.')
  }
  if (Number(data.amount) < 500) {
    throw new Error('Montant minimum de 500 FCFA.')
  }
  
  return true
}

// ✅ Validation de l'ID de transaction
const validateTransactionId = (id, message = 'Identifiant de transaction requis') => {
  if (!id) throw new Error(message)
  return id
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Récupère le portefeuille de l'utilisateur connecté
 * @returns {Promise<Object>} Informations du portefeuille (solde, ID, etc.)
 */
export const getWallet = async () => {
  try {
    const res = await api.get(WALLET_BASE)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement du portefeuille'))
  }
}

/**
 * Récupère l'historique des transactions
 * @param {Object} params - Paramètres de filtrage
 * @param {string} params.type - Type de transaction (credit, debit, all)
 * @param {string} params.status - Statut (pending, completed, failed)
 * @param {number} params.limit - Nombre de résultats
 * @param {number} params.page - Pagination
 * @param {string} params.startDate - Date de début
 * @param {string} params.endDate - Date de fin
 * @returns {Promise<Object>} Historique des transactions
 */
export const getTransactions = async (params = {}) => {
  try {
    const res = await api.get(`${WALLET_BASE}/transactions`, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des transactions'))
  }
}

/**
 * Récupère les détails d'une transaction spécifique
 * @param {string} transactionId - ID de la transaction
 * @returns {Promise<Object>} Détails de la transaction
 */
export const getTransaction = async (transactionId) => {
  validateTransactionId(transactionId)
  
  try {
    const res = await api.get(`${WALLET_BASE}/transactions/${transactionId}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement de la transaction'))
  }
}

/**
 * Envoie de l'argent depuis le portefeuille
 * @param {Object} data - Données de transfert
 * @param {string} data.phone - Numéro du destinataire
 * @param {number} data.amount - Montant à envoyer
 * @param {string} data.country - Pays du destinataire (optionnel)
 * @param {string} data.reason - Motif du transfert (optionnel)
 * @param {string} data.pin - Code PIN (optionnel, si sécurisé)
 * @returns {Promise<Object>} Confirmation du transfert
 */
export const sendMoney = async (data) => {
  validateSendMoney(data)
  
  // ✅ Nettoyer les données
  const cleanData = {
    phone: data.phone.trim(),
    amount: Number(data.amount),
    country: data.country || 'Cameroun',
    reason: data.reason?.trim() || null,
    pin: data.pin || null,
  }
  
  try {
    const res = await api.post(`${WALLET_BASE}/send`, cleanData)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur lors du transfert'))
  }
}

/**
 * Demande un retrait depuis le portefeuille
 * @param {Object} data - Données de retrait
 * @param {number} data.amount - Montant à retirer
 * @param {string} data.method - Méthode de retrait (bank, mobile, etc.)
 * @param {string} data.account - Informations du compte
 * @returns {Promise<Object>} Confirmation du retrait
 */
export const withdrawMoney = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Données de retrait manquantes.')
  }
  
  if (!data.amount || Number(data.amount) <= 0) {
    throw new Error('Montant valide requis.')
  }
  if (Number(data.amount) < 1000) {
    throw new Error('Montant minimum de retrait : 1 000 FCFA.')
  }
  
  if (!data.method) {
    throw new Error('Méthode de retrait requise (bank, mobile).')
  }
  
  try {
    const res = await api.post(`${WALLET_BASE}/withdraw`, data)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur lors du retrait'))
  }
}

/**
 * Récupère les statistiques du portefeuille
 * @returns {Promise<Object>} Statistiques (solde total, transactions, etc.)
 */
export const getWalletStats = async () => {
  try {
    const res = await api.get(`${WALLET_BASE}/stats`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des statistiques'))
  }
}

/**
 * Vérifie la disponibilité d'un numéro de téléphone pour transfert
 * @param {string} phone - Numéro de téléphone
 * @param {string} country - Pays (optionnel)
 * @returns {Promise<Object>} Disponibilité
 */
export const checkRecipient = async (phone, country = 'Cameroun') => {
  if (!phone?.trim()) {
    throw new Error('Numéro de téléphone requis.')
  }
  if (phone.trim().length < 8) {
    throw new Error('Numéro de téléphone invalide.')
  }
  
  try {
    const res = await api.get(`${WALLET_BASE}/check-recipient`, {
      params: { phone: phone.trim(), country }
    })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de vérification du destinataire'))
  }
}

/**
 * Annule une transaction en cours (si possible)
 * @param {string} transactionId - ID de la transaction
 * @param {string} reason - Raison de l'annulation (optionnel)
 * @returns {Promise<Object>} Confirmation
 */
export const cancelTransaction = async (transactionId, reason = '') => {
  validateTransactionId(transactionId)
  
  try {
    const res = await api.post(`${WALLET_BASE}/transactions/${transactionId}/cancel`, { 
      reason: reason.trim() || 'Annulé par l\'utilisateur'
    })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur d\'annulation de la transaction'))
  }
}

// ============================================
// EXPORT GROUPÉ
// ============================================

export default {
  getWallet,
  getTransactions,
  getTransaction,
  sendMoney,
  withdrawMoney,
  getWalletStats,
  checkRecipient,
  cancelTransaction,
}