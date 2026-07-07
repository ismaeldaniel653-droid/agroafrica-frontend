import api from './axios'

// ============================================
// CONSTANTES
// ============================================

const PRODUCT_BASE = '/products'

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

// ✅ Validation des données produit
const validateProductData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Données du produit manquantes.')
  }
  
  if (!data.name?.trim()) {
    throw new Error('Nom du produit requis.')
  }
  if (data.name?.trim().length < 3) {
    throw new Error('Nom du produit trop court (minimum 3 caractères).')
  }
  
  if (!data.price || data.price <= 0) {
    throw new Error('Prix valide requis.')
  }
  if (data.price < 100) {
    throw new Error('Prix minimum de 100 FCFA.')
  }
  
  if (data.stock === undefined || data.stock === null || data.stock < 0) {
    throw new Error('Stock valide requis (0 ou plus).')
  }
  
  if (!data.category) {
    throw new Error('Catégorie requise (agricole, artisanat, cooperative).')
  }
  
  return true
}

// ✅ Validation de l'image
const validateImage = (dataUrl) => {
  if (!dataUrl || typeof dataUrl !== 'string') {
    throw new Error('Image manquante.')
  }
  
  // Vérifier que c'est une image base64 valide
  if (!dataUrl.startsWith('data:image/')) {
    throw new Error('Format d\'image invalide. Utilisez JPG, PNG ou WebP.')
  }
  
  // Vérifier la taille approximative (max 5MB)
  const sizeInBytes = (dataUrl.length * 3) / 4
  if (sizeInBytes > 5 * 1024 * 1024) {
    throw new Error('Image trop volumineuse (max 5 Mo).')
  }
  
  return true
}

// ============================================
// API FUNCTIONS
// ============================================

// ===== LECTURE =====

/**
 * Récupère tous les produits avec filtres
 * @param {Object} params - Paramètres de filtrage
 * @param {string} params.category - Filtrer par catégorie
 * @param {string} params.search - Recherche par mot-clé
 * @param {number} params.minPrice - Prix minimum
 * @param {number} params.maxPrice - Prix maximum
 * @param {string} params.status - Statut du produit (actif, brouillon, etc.)
 * @param {number} params.limit - Nombre de résultats
 * @param {number} params.page - Pagination
 * @returns {Promise<Object>} Liste des produits
 */
export const getProducts = async (params = {}) => {
  try {
    const res = await api.get(PRODUCT_BASE, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des produits'))
  }
}

/**
 * Récupère un produit par son ID
 * @param {string} id - ID du produit
 * @returns {Promise<Object>} Détails du produit
 */
export const getProduct = async (id) => {
  validateId(id, 'Identifiant du produit manquant.')
  
  try {
    const res = await api.get(`${PRODUCT_BASE}/${id}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement du produit'))
  }
}

/**
 * Récupère les produits d'un vendeur spécifique
 * @param {string} sellerId - ID du vendeur
 * @param {Object} params - Paramètres de filtrage
 * @returns {Promise<Object>} Produits du vendeur
 */
export const getProductsBySeller = async (sellerId, params = {}) => {
  validateId(sellerId, 'Identifiant du vendeur manquant.')
  
  try {
    const res = await api.get(`${PRODUCT_BASE}/seller/${sellerId}`, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des produits du vendeur'))
  }
}

/**
 * Récupère les produits vedettes pour la page d'accueil
 * @param {number} limit - Nombre de produits à récupérer
 * @returns {Promise<Array>} Produits vedettes
 */
export const getFeaturedProducts = async (limit = 10) => {
  try {
    const res = await api.get(`${PRODUCT_BASE}/featured`, { params: { limit } })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des produits vedettes'))
  }
}

/**
 * Recherche des produits par mot-clé
 * @param {string} query - Mot-clé de recherche
 * @param {Object} params - Paramètres supplémentaires (catégorie, etc.)
 * @returns {Promise<Array>} Produits trouvés
 */
export const searchProducts = async (query, params = {}) => {
  if (!query || typeof query !== 'string') {
    return { products: [], total: 0 }
  }
  
  try {
    const res = await api.get(`${PRODUCT_BASE}/search`, { 
      params: { q: query.trim(), ...params } 
    })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur lors de la recherche'))
  }
}

/**
 * Récupère les catégories disponibles
 * @returns {Promise<Array>} Liste des catégories
 */
export const getCategories = async () => {
  try {
    const res = await api.get(`${PRODUCT_BASE}/categories`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des catégories'))
  }
}

// ===== ÉCRITURE =====

/**
 * Crée un nouveau produit
 * @param {Object} data - Données du produit
 * @param {string} data.name - Nom du produit
 * @param {number} data.price - Prix en FCFA
 * @param {number} data.stock - Quantité en stock
 * @param {string} data.category - Catégorie (agricole, artisanat, cooperative)
 * @param {string} data.origin - Origine du produit
 * @param {string} data.description - Description
 * @param {string} data.image - URL de l'image (optionnel)
 * @param {string} data.unit - Unité de mesure (kg, litre, pièce, etc.)
 * @param {string} data.status - Statut (actif, brouillon, etc.)
 * @returns {Promise<Object>} Produit créé
 */
export const createProduct = async (data = {}) => {
  validateProductData(data)
  
  // ✅ Nettoyer les données
  const cleanData = {
    name: data.name.trim(),
    price: Number(data.price),
    stock: Number(data.stock),
    category: data.category,
    origin: data.origin?.trim() || '',
    description: data.description?.trim() || '',
    image: data.image || null,
    unit: data.unit || 'unité',
    status: data.status || 'actif',
    emoji: data.emoji || null,
    sellerId: data.sellerId || null,
  }
  
  try {
    const res = await api.post(PRODUCT_BASE, cleanData)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur lors de la création du produit'))
  }
}

/**
 * Met à jour un produit existant
 * @param {string} id - ID du produit
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>} Produit mis à jour
 */
export const updateProduct = async (id, data = {}) => {
  validateId(id, 'Identifiant du produit requis pour la mise à jour.')
  
  if (!data || typeof data !== 'object') {
    throw new Error('Données de mise à jour manquantes.')
  }
  
  // ✅ Nettoyer les données (ne garder que les champs présents)
  const cleanData = { ...data }
  if (cleanData.name) cleanData.name = cleanData.name.trim()
  if (cleanData.price) cleanData.price = Number(cleanData.price)
  if (cleanData.stock !== undefined) cleanData.stock = Number(cleanData.stock)
  if (cleanData.origin) cleanData.origin = cleanData.origin.trim()
  if (cleanData.description) cleanData.description = cleanData.description.trim()
  
  try {
    const res = await api.put(`${PRODUCT_BASE}/${id}`, cleanData)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de mise à jour du produit'))
  }
}

/**
 * Supprime un produit
 * @param {string} id - ID du produit
 * @returns {Promise<Object>} Confirmation de suppression
 */
export const deleteProduct = async (id) => {
  validateId(id, 'Identifiant du produit requis pour la suppression.')
  
  try {
    const res = await api.delete(`${PRODUCT_BASE}/${id}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de suppression du produit'))
  }
}

/**
 * Upload d'une image pour un produit
 * @param {string} dataUrl - Image en base64
 * @returns {Promise<Object>} URL de l'image uploadée
 */
export const uploadImage = async (dataUrl) => {
  validateImage(dataUrl)
  
  try {
    const res = await api.post(`${PRODUCT_BASE}/upload-image`, { image: dataUrl })
    return res.data // attendu : { url: 'https://…' }
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur lors de l\'upload de l\'image'))
  }
}

/**
 * Met à jour le statut d'un produit (actif, brouillon, suspendu)
 * @param {string} id - ID du produit
 * @param {string} status - Nouveau statut
 * @returns {Promise<Object>} Produit mis à jour
 */
export const updateProductStatus = async (id, status) => {
  validateId(id, 'Identifiant du produit requis.')
  
  const validStatuses = ['actif', 'brouillon', 'suspendu', 'rupture']
  if (!validStatuses.includes(status)) {
    throw new Error(`Statut invalide. Valeurs acceptées: ${validStatuses.join(', ')}`)
  }
  
  try {
    const res = await api.patch(`${PRODUCT_BASE}/${id}/status`, { status })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de mise à jour du statut'))
  }
}

// ============================================
// EXPORT GROUPÉ
// ============================================

// ✅ Ré-export des autres APIs pour compatibilité
export { 
  createOrder, 
  getOrders, 
  getOrder, 
  updateOrderStatus, 
  cancelOrder 
} from './orderApi'

export { 
  initiatePayment, 
  checkPaymentStatus, 
  confirmPayment, 
  refundPayment, 
  getPaymentHistory 
} from './paymentApi'

export { 
  getTraceability, 
  getProductQR, 
  generateCertificate, 
  verifyCertificate 
} from './qrApi'

// ✅ Export par défaut
export default {
  getProducts,
  getProduct,
  getProductsBySeller,
  getFeaturedProducts,
  searchProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  updateProductStatus,
}