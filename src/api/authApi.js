import api from './axios'

// ============================================
// CONSTANTES
// ============================================

const AUTH_BASE = '/auth'

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

// ✅ Validation des données
const validateData = (data, fields = []) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Données invalides')
  }
  for (const field of fields) {
    if (!data[field]) {
      throw new Error(`Le champ "${field}" est requis`)
    }
  }
  return true
}

// ✅ Validation de l'email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    throw new Error('Email invalide')
  }
  return email
}

// ✅ Validation du mot de passe
const validatePassword = (password) => {
  if (!password || password.length < 8) {
    throw new Error('Le mot de passe doit contenir au moins 8 caractères')
  }
  return password
}

// ============================================
// AUTHENTIFICATION
// ============================================

/**
 * Inscription d'un nouvel utilisateur
 * @param {Object} data - Données d'inscription
 * @param {string} data.name - Nom complet
 * @param {string} data.email - Email
 * @param {string} data.password - Mot de passe (min 8 caractères)
 * @param {string} data.phone - Numéro de téléphone (optionnel)
 * @param {string} data.role - Rôle (acheteur, vendeur, cooperative)
 * @returns {Promise<Object>} Token et données utilisateur
 */
export const registerUser = async (data) => {
  validateData(data, ['name', 'email', 'password'])
  validateEmail(data.email)
  validatePassword(data.password)
  
  try {
    const res = await api.post(`${AUTH_BASE}/register`, data)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur lors de l\'inscription'))
  }
}

/**
 * Connexion d'un utilisateur
 * @param {Object} data - Données de connexion
 * @param {string} data.email - Email
 * @param {string} data.password - Mot de passe
 * @returns {Promise<Object>} Token et données utilisateur
 */
export const loginUser = async (data) => {
  validateData(data, ['email', 'password'])
  validateEmail(data.email)
  validatePassword(data.password)
  
  try {
    const res = await api.post(`${AUTH_BASE}/login`, data)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de connexion'))
  }
}

/**
 * Récupère le profil de l'utilisateur connecté
 * @returns {Promise<Object>} Données du profil
 */
export const getProfile = async () => {
  try {
    const res = await api.get(`${AUTH_BASE}/profile`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de chargement du profil'))
  }
}

/**
 * Met à jour le profil utilisateur
 * @param {Object} data - Données à mettre à jour
 * @param {string} data.name - Nom complet
 * @param {string} data.phone - Numéro de téléphone
 * @param {string} data.city - Ville
 * @param {string} data.country - Pays
 * @param {string} data.avatar - URL de l'avatar (base64 ou URL)
 * @returns {Promise<Object>} Profil mis à jour
 */
export const updateProfile = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Aucune donnée de profil fournie.')
  }
  
  // ✅ Nettoyer les données avant l'envoi
  const cleanData = { ...data }
  
  // Supprimer les champs vides ou undefined
  Object.keys(cleanData).forEach(key => {
    if (cleanData[key] === undefined || cleanData[key] === null) {
      delete cleanData[key]
    }
  })
  
  try {
    const res = await api.put(`${AUTH_BASE}/profile`, cleanData)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de mise à jour du profil'))
  }
}

/**
 * Upload de l'avatar (base64)
 * @param {string} dataUrl - Image en base64
 * @returns {Promise<Object>} URL de l'avatar uploadé
 */
export const uploadAvatar = async (dataUrl) => {
  if (!dataUrl || typeof dataUrl !== 'string') {
    throw new Error('Image de profil manquante ou invalide.')
  }
  
  // ✅ Vérifier que c'est bien une image base64
  if (!dataUrl.startsWith('data:image/')) {
    throw new Error('Format d\'image invalide. Utilisez JPG, PNG ou WebP.')
  }
  
  try {
    const res = await api.post(`${AUTH_BASE}/avatar`, { avatar: dataUrl })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur lors de l\'upload de l\'avatar'))
  }
}

/**
 * Supprime l'avatar (retour aux initiales)
 * @returns {Promise<Object>} Confirmation de suppression
 */
export const deleteAvatar = async () => {
  try {
    const res = await api.delete(`${AUTH_BASE}/avatar`)
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur lors de la suppression de l\'avatar'))
  }
}

/**
 * Changement de mot de passe
 * @param {Object} data - Données de changement
 * @param {string} data.currentPassword - Mot de passe actuel
 * @param {string} data.newPassword - Nouveau mot de passe
 * @returns {Promise<Object>} Confirmation
 */
export const changePassword = async (data) => {
  if (!data || !data.currentPassword || !data.newPassword) {
    throw new Error('Mot de passe actuel et nouveau mot de passe requis.')
  }
  
  if (data.newPassword.length < 8) {
    throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères.')
  }
  
  try {
    const res = await api.put(`${AUTH_BASE}/change-password`, {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de changement de mot de passe'))
  }
}

/**
 * Demande de réinitialisation de mot de passe
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object>} Confirmation
 */
export const forgotPassword = async (email) => {
  validateEmail(email)
  
  try {
    const res = await api.post(`${AUTH_BASE}/forgot-password`, { email })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur lors de la demande de réinitialisation'))
  }
}

/**
 * Réinitialisation de mot de passe (avec token)
 * @param {Object} data - Données de réinitialisation
 * @param {string} data.token - Token de réinitialisation
 * @param {string} data.password - Nouveau mot de passe
 * @returns {Promise<Object>} Confirmation
 */
export const resetPassword = async (data) => {
  if (!data || !data.token || !data.password) {
    throw new Error('Token et mot de passe requis.')
  }
  
  validatePassword(data.password)
  
  try {
    const res = await api.post(`${AUTH_BASE}/reset-password`, {
      token: data.token,
      password: data.password,
    })
    return res.data
  } catch (error) {
    throw new Error(handleApiError(error, 'Erreur de réinitialisation du mot de passe'))
  }
}

/**
 * Déconnexion (si le backend supporte)
 * @returns {Promise<Object>} Confirmation
 */
export const logoutUser = async () => {
  try {
    const res = await api.post(`${AUTH_BASE}/logout`)
    return res.data
  } catch (error) {
    // ✅ Même si l'API échoue, on ne bloque pas la déconnexion locale
    console.warn('Erreur lors de la déconnexion serveur:', error)
    return { success: true }
  }
}

// ============================================
// EXPORT GROUPÉ
// ============================================

export default {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  changePassword,
  forgotPassword,
  resetPassword,
  logoutUser,
}
