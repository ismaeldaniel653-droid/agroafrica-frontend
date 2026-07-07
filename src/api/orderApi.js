import api from './axios'

// ============================================
// CONSTANTES
// ============================================

const ORDER_BASE = '/orders'

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

// ✅ Validation des données de commande
const validateOrderData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Détails de commande manquants.')
  }
  
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error('La commande doit contenir au moins un article.')
  }
  
  if (!data.totalAmount || data.totalAmount <= 0) {
    throw new Error('Montant total invalide.')
  }
  
  if (!data.deliveryAddress || typeof data.deliveryAddress !== 'object') {
    throw new Error('Adresse de livraison requise.')
  }
  
  if (!data.paymentMethod) {
    throw new Error('Méthode de paiement requise.')
  }
  
  return true
}

// ✅ Validation du statut
const validateStatus = (status) => {
  const validStatuses = ['confirmé', 'en cours', 'livré', 'annulé', 'en_attente']
  if (!validStatuses.includes(status)) {
    throw new Error(`Statut invalide. Valeurs acceptées: ${validStatuses.join(', ')}`)
  }
  return status
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Crée une nouvelle commande
 * @param {Object} data - Données de la commande
 * @param {Array} data.items - Liste des articles (produit, quantité, prix)
 * @param {number} data.totalAmount - Montant total
 * @param {Object} data.deliveryAddress - Adresse de livraison
 * @param {string} data.paymentMethod - Méthode de paiement
 * @param {string} data.userId - ID de l'utilisateur (optionnel)
 * @returns {Promise<Object>} Commande créée
 */
export const createOrder = async (data) => {
  validateOrderData(data)
  
  // ✅ Nettoyer les données
  const cleanData = {
    items: data.items.map(item => ({
      product: item.product || item.id,
      qty: item.qty || 1,
      price: item.price || 0,
      name: item.name || 'Produit',
    })),
    totalAmount: data.totalAmount,
    deliveryAddress: {
      name: data.deliveryAddress.name || '',
      phone: data.deliveryAddress.phone || '',
      email: data.deliveryAddress.email || '',
      city: data.deliveryAddress.city || '',
      address: data.deliveryAddress.address || '',
      country: data.deliveryAddress.country || 'Cameroun',
      deliveryNotes: data.deliveryAddress.deliveryNotes || '',
    },
    paymentMethod: data.paymentMethod,
    userId: data.userId || null,
  }
  
  try {
    const res = await api.post(ORDER_BASE, cleanData)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur lors de la création de la commande'))
  }
}

/**
 * Récupère les commandes de l'utilisateur connecté
 * @param {Object} params - Paramètres de filtrage
 * @param {string} params.status - Filtrer par statut
 * @param {number} params.limit - Nombre de résultats
 * @param {number} params.page - Pagination
 * @param {string} params.startDate - Date de début
 * @param {string} params.endDate - Date de fin
 * @returns {Promise<Object>} Liste des commandes
 */
export const getOrders = async (params = {}) => {
  try {
    const res = await api.get(ORDER_BASE, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des commandes'))
  }
}

/**
 * Récupère une commande par son ID
 * @param {string} id - ID de la commande
 * @returns {Promise<Object>} Détails de la commande
 */
export const getOrder = async (id) => {
  validateId(id, 'Identifiant de commande manquant.')
  
  try {
    const res = await api.get(`${ORDER_BASE}/${id}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement de la commande'))
  }
}

/**
 * Met à jour le statut d'une commande
 * @param {string} id - ID de la commande
 * @param {string} status - Nouveau statut (confirmé, en cours, livré, annulé, en_attente)
 * @returns {Promise<Object>} Commande mise à jour
 */
export const updateOrderStatus = async (id, status) => {
  validateId(id, 'Identifiant de commande requis.')
  validateStatus(status)
  
  try {
    const res = await api.patch(`${ORDER_BASE}/${id}/status`, { status })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de mise à jour du statut'))
  }
}

/**
 * Annule une commande
 * @param {string} id - ID de la commande
 * @param {string} reason - Raison de l'annulation (optionnel)
 * @returns {Promise<Object>} Commande annulée
 */
export const cancelOrder = async (id, reason = '') => {
  validateId(id, 'Identifiant de commande requis.')
  
  try {
    const res = await api.patch(`${ORDER_BASE}/${id}/cancel`, { reason })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur d\'annulation de la commande'))
  }
}

/**
 * Confirme la réception d'une commande (livrée)
 * @param {string} id - ID de la commande
 * @returns {Promise<Object>} Commande confirmée
 */
export const confirmOrderDelivery = async (id) => {
  validateId(id, 'Identifiant de commande requis.')
  
  try {
    const res = await api.patch(`${ORDER_BASE}/${id}/confirm`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de confirmation de livraison'))
  }
}

/**
 * Récupère les commandes d'un vendeur
 * @param {string} sellerId - ID du vendeur
 * @param {Object} params - Paramètres de filtrage
 * @returns {Promise<Object>} Commandes du vendeur
 */
export const getSellerOrders = async (sellerId, params = {}) => {
  validateId(sellerId, 'Identifiant vendeur requis.')
  
  try {
    const res = await api.get(`${ORDER_BASE}/seller/${sellerId}`, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des commandes du vendeur'))
  }
}

/**
 * Récupère les commandes par statut
 * @param {string} status - Statut des commandes
 * @param {Object} params - Paramètres de pagination
 * @returns {Promise<Object>} Commandes filtrées
 */
export const getOrdersByStatus = async (status, params = {}) => {
  validateStatus(status)
  
  try {
    const res = await api.get(`${ORDER_BASE}/status/${status}`, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des commandes par statut'))
  }
}

/**
 * Récupère les statistiques des commandes
 * @returns {Promise<Object>} Statistiques (total, par statut, revenus, etc.)
 */
export const getOrderStats = async () => {
  try {
    const res = await api.get(`${ORDER_BASE}/stats`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des statistiques'))
  }
}

// ============================================
// EXPORT GROUPÉ
// ============================================

export default {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  confirmOrderDelivery,
  getSellerOrders,
  getOrdersByStatus,
  getOrderStats,
}