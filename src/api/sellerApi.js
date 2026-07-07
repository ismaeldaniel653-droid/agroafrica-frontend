import api from './axios'

// ============================================
// CONSTANTES
// ============================================

const SELLER_BASE = '/seller'

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

// ✅ Validation des données livreur
const validateLivreurData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Données du livreur manquantes.')
  }
  
  if (!data.name?.trim()) {
    throw new Error('Nom complet requis.')
  }
  if (data.name.trim().length < 2) {
    throw new Error('Nom trop court (minimum 2 caractères).')
  }
  
  if (!data.phone?.trim()) {
    throw new Error('Numéro WhatsApp requis.')
  }
  if (data.phone.trim().length < 8) {
    throw new Error('Numéro de téléphone invalide.')
  }
  
  return true
}

// ============================================
// API FUNCTIONS
// ============================================

// ===== STATS & DASHBOARD =====

/**
 * Récupère toutes les statistiques du vendeur connecté
 * @returns {Promise<Object>} Statistiques du vendeur
 */
export const getSellerStats = async () => {
  try {
    const res = await api.get(`${SELLER_BASE}/stats`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des statistiques'))
  }
}

/**
 * Récupère les avis clients du vendeur
 * @param {Object} params - Paramètres de pagination
 * @param {number} params.page - Page
 * @param {number} params.limit - Nombre par page
 * @returns {Promise<Object>} Liste des avis
 */
export const getSellerReviews = async (params = {}) => {
  try {
    const res = await api.get(`${SELLER_BASE}/reviews`, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des avis'))
  }
}

/**
 * Récupère les commandes du vendeur
 * @param {Object} params - Paramètres de filtrage
 * @param {string} params.status - Statut des commandes
 * @param {string} params.startDate - Date de début
 * @param {string} params.endDate - Date de fin
 * @param {number} params.limit - Nombre de résultats
 * @param {number} params.page - Pagination
 * @returns {Promise<Object>} Commandes du vendeur
 */
export const getSellerOrders = async (params = {}) => {
  try {
    const res = await api.get(`${SELLER_BASE}/orders`, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des commandes'))
  }
}

// ===== PRODUITS DU VENDEUR =====

/**
 * Récupère les produits du vendeur connecté
 * @param {Object} params - Paramètres de filtrage
 * @param {string} params.status - Statut du produit (actif, brouillon, rupture)
 * @param {string} params.search - Recherche par nom
 * @param {number} params.limit - Nombre de résultats
 * @param {number} params.page - Pagination
 * @returns {Promise<Object>} Produits du vendeur
 */
export const getSellerProducts = async (params = {}) => {
  try {
    const res = await api.get(`${SELLER_BASE}/products`, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des produits'))
  }
}

/**
 * Réapprovisionne un produit en rupture de stock
 * @param {string} productId - ID du produit
 * @param {number} quantity - Quantité à ajouter
 * @returns {Promise<Object>} Produit mis à jour
 */
export const restockProduct = async (productId, quantity) => {
  validateId(productId, 'Identifiant du produit requis.')
  
  if (!quantity || Number(quantity) <= 0) {
    throw new Error('Quantité valide requise.')
  }
  
  try {
    const res = await api.post(`${SELLER_BASE}/products/${productId}/restock`, { 
      quantity: Number(quantity) 
    })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de réapprovisionnement'))
  }
}

/**
 * Met à jour le statut d'un produit (actif, brouillon, suspendu)
 * @param {string} productId - ID du produit
 * @param {string} status - Nouveau statut
 * @returns {Promise<Object>} Produit mis à jour
 */
export const updateProductStatus = async (productId, status) => {
  validateId(productId, 'Identifiant du produit requis.')
  
  const validStatuses = ['actif', 'brouillon', 'suspendu', 'rupture']
  if (!validStatuses.includes(status)) {
    throw new Error(`Statut invalide. Valeurs acceptées: ${validStatuses.join(', ')}`)
  }
  
  try {
    const res = await api.patch(`${SELLER_BASE}/products/${productId}/status`, { status })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de mise à jour du statut'))
  }
}

// ===== WALLET / AGROAFRICAPAY =====

/**
 * Récupère le solde du portefeuille du vendeur
 * @returns {Promise<Object>} Informations du wallet
 */
export const getWallet = async () => {
  try {
    const res = await api.get(`${SELLER_BASE}/wallet`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement du wallet'))
  }
}

/**
 * Envoie de l'argent depuis le wallet
 * @param {Object} data - Données de transfert
 * @param {string} data.phone - Numéro du destinataire
 * @param {number} data.amount - Montant à envoyer
 * @param {string} data.country - Pays du destinataire (optionnel)
 * @param {string} data.reason - Motif du transfert (optionnel)
 * @returns {Promise<Object>} Confirmation du transfert
 */
export const sendMoney = async (data = {}) => {
  validateSendMoney(data)
  
  // ✅ Nettoyer les données
  const cleanData = {
    phone: data.phone.trim(),
    amount: Number(data.amount),
    country: data.country || 'Cameroun',
    reason: data.reason?.trim() || null,
  }
  
  try {
    const res = await api.post(`${SELLER_BASE}/wallet/send`, cleanData)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur lors du transfert'))
  }
}

/**
 * Récupère l'historique des transactions du wallet
 * @param {Object} params - Paramètres de pagination
 * @param {string} params.type - Type de transaction (credit, debit, all)
 * @param {number} params.limit - Nombre de résultats
 * @param {number} params.page - Pagination
 * @returns {Promise<Object>} Historique des transactions
 */
export const getTransactions = async (params = {}) => {
  try {
    const res = await api.get(`${SELLER_BASE}/wallet/transactions`, { params })
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
export const getTransactionDetails = async (transactionId) => {
  validateId(transactionId, 'Identifiant de transaction requis.')
  
  try {
    const res = await api.get(`${SELLER_BASE}/wallet/transaction/${transactionId}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement de la transaction'))
  }
}

// ===== LIVREURS =====

/**
 * Récupère la liste des livreurs disponibles dans la zone du vendeur
 * @param {Object} params - Paramètres de filtrage
 * @param {string} params.zone - Zone de livraison
 * @param {boolean} params.dispo - Disponibilité
 * @returns {Promise<Object>} Livreurs disponibles
 */
export const getLivreurs = async (params = {}) => {
  try {
    const res = await api.get(`${SELLER_BASE}/livreurs`, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des livreurs'))
  }
}

/**
 * Inscription d'un nouveau livreur
 * @param {Object} data - Données du livreur
 * @param {string} data.name - Nom complet
 * @param {string} data.phone - Numéro WhatsApp
 * @param {string} data.zone - Zone de livraison
 * @param {string} data.moto - Type de véhicule
 * @param {number} data.tarif - Tarif de base
 * @param {string} data.description - Description (optionnel)
 * @returns {Promise<Object>} Livreur enregistré
 */
export const registerLivreur = async (data = {}) => {
  validateLivreurData(data)
  
  // ✅ Nettoyer les données
  const cleanData = {
    name: data.name.trim(),
    phone: data.phone.trim(),
    zone: data.zone?.trim() || '',
    moto: data.moto || 'moto',
    tarif: data.tarif ? Number(data.tarif) : 0,
    description: data.description?.trim() || null,
  }
  
  try {
    const res = await api.post(`${SELLER_BASE}/livreurs/register`, cleanData)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur d\'inscription du livreur'))
  }
}

// ============================================
// EXPORT GROUPÉ
// ============================================

export default {
  // Stats
  getSellerStats,
  getSellerReviews,
  getSellerOrders,
  
  // Products
  getSellerProducts,
  restockProduct,
  updateProductStatus,
  
  // Wallet
  getWallet,
  sendMoney,
  getTransactions,
  getTransactionDetails,
  
  // Livreurs
  getLivreurs,
  registerLivreur,
}
