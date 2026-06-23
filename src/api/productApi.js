import api from './axios'

// ===== LECTURE =====

// Tous les produits
// Nettoyage : Les filtres (params) démarrent vides par défaut => catalogue neuf
export const getProducts = async (params = {}) => {
  const res = await api.get('/products', { params })
  return res.data
}

// Détail d'un produit
export const getProduct = async (id) => {
  if (!id) throw new Error("Identifiant du produit manquant.")
  const res = await api.get(`/products/${id}`)
  return res.data
}

// ✅ NOUVEAU : produits d'un vendeur spécifique (utile pour espace vendeur)
export const getProductsBySeller = async (sellerId, params = {}) => {
  if (!sellerId) throw new Error("Identifiant du vendeur manquant.")
  const res = await api.get(`/products/seller/${sellerId}`, { params })
  return res.data
}

// ✅ NOUVEAU : produits vedettes pour la home
export const getFeaturedProducts = async () => {
  const res = await api.get('/products/featured')
  return res.data
}

// ✅ NOUVEAU : recherche par mot-clé
export const searchProducts = async (query) => {
  if (!query || typeof query !== 'string') return []
  const res = await api.get('/products/search', { params: { q: query } })
  return res.data
}

// ===== ÉCRITURE =====

// Créer un produit
export const createProduct = async (data = {}) => {
  // ✅ NOUVEAU : on accepte un data vide mais on l'envoie quand même
  const res = await api.post('/products', data)
  return res.data
}

// Modifier un produit
export const updateProduct = async (id, data = {}) => {
  if (!id) throw new Error("Identifiant du produit requis pour la mise à jour.")
  const res = await api.put(`/products/${id}`, data)
  return res.data
}

// Supprimer un produit
export const deleteProduct = async (id) => {
  if (!id) throw new Error("Identifiant du produit requis pour la suppression.")
  const res = await api.delete(`/products/${id}`)
  return res.data
}

// ✅ NOUVEAU : upload d'image (utilisé par AddProduct.jsx)
// dataUrl est une chaîne base64 ("data:image/png;base64,…") pour rester simple côté backend
export const uploadImage = async (dataUrl) => {
  if (!dataUrl || typeof dataUrl !== 'string') {
    throw new Error("Image manquante pour l'upload.")
  }
  const res = await api.post('/products/upload-image', { image: dataUrl })
  return res.data  // attendu : { url: 'https://…' }
}

// ===== COMPATIBILITÉ =====

// Backward compatibility — préserve les anciens imports existants
// ✅ NOUVEAU : conserve la rétrocompatibilité pour le reste du projet
export { createOrder, getOrders, getOrder, updateOrderStatus, cancelOrder } from './orderApi'
export { initiatePayment, checkPaymentStatus, confirmPayment, refundPayment, getPaymentHistory } from './paymentApi'
export { getTraceability, getProductQR, generateCertificate, verifyCertificate } from './qrApi'
