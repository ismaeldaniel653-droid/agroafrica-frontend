import api from './axios'

// ============================================
// CONSTANTES
// ============================================

const QR_BASE = '/qr'

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

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Récupère la traçabilité complète d'un produit via son ID
 * @param {string} id - ID du produit
 * @returns {Promise<Object>} Données de traçabilité
 */
export const getTraceability = async (id) => {
  validateId(id, 'Identifiant du produit manquant pour la traçabilité.')
  
  try {
    const res = await api.get(`${QR_BASE}/trace/${id}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement de la traçabilité'))
  }
}

/**
 * Récupère le QR code (image) d'un produit
 * @param {string} id - ID du produit
 * @param {Object} options - Options de l'image
 * @param {number} options.width - Largeur du QR code
 * @param {number} options.height - Hauteur du QR code
 * @returns {Promise<Blob>} Image du QR code
 */
export const getProductQR = async (id, options = {}) => {
  validateId(id, 'Identifiant du produit manquant.')
  
  try {
    const res = await api.get(`${QR_BASE}/code/${id}`, { 
      params: options,
      responseType: 'blob' 
    })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement du QR code'))
  }
}

/**
 * Génère un certificat blockchain pour un produit (côté producteur)
 * @param {string} productId - ID du produit
 * @param {Object} data - Données supplémentaires du certificat
 * @param {string} data.batchNumber - Numéro de lot (optionnel)
 * @param {string} data.certificationType - Type de certification (bio, équitable, etc.)
 * @returns {Promise<Object>} Certificat généré
 */
export const generateCertificate = async (productId, data = {}) => {
  validateId(productId, 'Identifiant du produit requis.')
  
  try {
    const res = await api.post(`${QR_BASE}/certificate/${productId}`, {
      batchNumber: data.batchNumber || null,
      certificationType: data.certificationType || 'standard',
      ...data
    })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de génération du certificat'))
  }
}

/**
 * Vérifie un certificat blockchain via son ID public
 * @param {string} certId - ID du certificat
 * @returns {Promise<Object>} Détails du certificat vérifié
 */
export const verifyCertificate = async (certId) => {
  validateId(certId, 'Identifiant de certificat requis.')
  
  try {
    const res = await api.get(`${QR_BASE}/verify/${certId}`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de vérification du certificat'))
  }
}

/**
 * Récupère tous les certificats d'un producteur
 * @param {string} producerId - ID du producteur
 * @param {Object} params - Paramètres de pagination
 * @returns {Promise<Object>} Liste des certificats
 */
export const getProducerCertificates = async (producerId, params = {}) => {
  validateId(producerId, 'Identifiant du producteur requis.')
  
  try {
    const res = await api.get(`${QR_BASE}/certificates/${producerId}`, { params })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des certificats'))
  }
}

/**
 * Révoke un certificat (annulation)
 * @param {string} certId - ID du certificat
 * @param {string} reason - Raison de la révocation
 * @returns {Promise<Object>} Confirmation
 */
export const revokeCertificate = async (certId, reason = '') => {
  validateId(certId, 'Identifiant de certificat requis.')
  
  if (!reason?.trim()) {
    throw new Error('Une raison de révocation est requise.')
  }
  
  try {
    const res = await api.patch(`${QR_BASE}/revoke/${certId}`, { 
      reason: reason.trim() 
    })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de révocation du certificat'))
  }
}

/**
 * Récupère les statistiques de traçabilité
 * @returns {Promise<Object>} Statistiques
 */
export const getTraceabilityStats = async () => {
  try {
    const res = await api.get(`${QR_BASE}/stats`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement des statistiques de traçabilité'))
  }
}

/**
 * Vérifie la validité d'un QR code (scan)
 * @param {string} qrData - Données du QR code scanné
 * @returns {Promise<Object>} Résultat de la vérification
 */
export const scanQRCode = async (qrData) => {
  if (!qrData) {
    throw new Error('Données QR code manquantes.')
  }
  
  try {
    const res = await api.post(`${QR_BASE}/scan`, { data: qrData })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de scan du QR code'))
  }
}

/**
 * Génère un QR code personnalisé pour un produit
 * @param {string} productId - ID du produit
 * @param {Object} options - Options de personnalisation
 * @param {string} options.color - Couleur du QR code
 * @param {string} options.bgColor - Couleur de fond
 * @param {number} options.size - Taille (en pixels)
 * @returns {Promise<Blob>} Image du QR code
 */
export const generateCustomQR = async (productId, options = {}) => {
  validateId(productId, 'Identifiant du produit requis.')
  
  try {
    const res = await api.post(`${QR_BASE}/custom`, {
      productId,
      color: options.color || '#0C6B4E',
      bgColor: options.bgColor || '#FFFFFF',
      size: options.size || 300,
    }, { responseType: 'blob' })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de génération du QR code personnalisé'))
  }
}

// ============================================
// EXPORT GROUPÉ
// ============================================

export default {
  getTraceability,
  getProductQR,
  generateCertificate,
  verifyCertificate,
  getProducerCertificates,
  revokeCertificate,
  getTraceabilityStats,
  scanQRCode,
  generateCustomQR,
}
