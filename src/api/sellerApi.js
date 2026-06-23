// ✅ NOUVEAU : src/api/sellerApi.js — toutes les routes spécifiques au tableau de bord vendeur
import api from './axios'

// ===== STATS & DASHBOARD =====

// Récupérer toutes les stats du vendeur connecté
export const getSellerStats = async () => {
  const res = await api.get('/seller/stats')
  return res.data
}

// Avis clients reçus
export const getSellerReviews = async () => {
  const res = await api.get('/seller/reviews')
  return res.data
}

// Commandes reçues par le vendeur
export const getSellerOrders = async (params = {}) => {
  const res = await api.get('/seller/orders', { params })
  return res.data
}

// ===== PRODUITS DU VENDEUR =====

// Liste des produits publiés par le vendeur
export const getSellerProducts = async (params = {}) => {
  const res = await api.get('/seller/products', { params })
  return res.data
}

// ✅ NOUVEAU : résoudre un conflit (réapprovisionner un produit en rupture)
export const restockProduct = async (productId, quantity) => {
  if (!productId) throw new Error("Identifiant du produit requis.")
  const res = await api.post(`/seller/products/${productId}/restock`, { quantity })
  return res.data
}

// ===== ESPACE WALLET / AGROAFRICAPAY =====

// Solde du portefeuille du vendeur
export const getWallet = async () => {
  const res = await api.get('/seller/wallet')
  return res.data
}

// ✅ NOUVEAU : envoyer de l'argent depuis le wallet
export const sendMoney = async (data = {}) => {
  if (!data.phone || !data.amount) {
    throw new Error("Numéro destinataire et montant requis.")
  }
  const res = await api.post('/seller/wallet/send', data)
  return res.data
}

// Historique des transactions wallet
export const getTransactions = async () => {
  const res = await api.get('/seller/wallet/transactions')
  return res.data
}

// ===== LIVREURS =====

// Liste des livreurs disponibles dans la zone du vendeur
export const getLivreurs = async (params = {}) => {
  const res = await api.get('/seller/livreurs', { params })
  return res.data
}

// ✅ NOUVEAU : un livreur s'inscrit (formulaire Livreur.jsx)
export const registerLivreur = async (data = {}) => {
  if (!data.name || !data.phone) {
    throw new Error("Nom et numéro WhatsApp requis.")
  }
  const res = await api.post('/seller/livreurs/register', data)
  return res.data
}
