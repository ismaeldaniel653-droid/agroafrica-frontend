import api from './axios'

// Initier un paiement (Mobile Money, Carte, etc.)
// Nettoyage : Les données de paiement (data) commencent avec un objet vide sécurisé par défaut
export const initiatePayment = async (data = {}) => {
  const res = await api.post('/payment/initiate', data)
  return res.data
}

// Vérifier le statut d'un paiement via un identifiant de commande
// Sécurité : Vérifie qu'un identifiant de commande valide est fourni avant l'appel API
export const checkPaymentStatus = async (orderId) => {
  if (!orderId) throw new Error("Identifiant de commande manquant pour la vérification.")
  const res = await api.get(`/payment/status/${orderId}`)
  return res.data
}

// ✅ NOUVEAU : confirmer manuellement un paiement (utile côté UI après retour opérateur)
export const confirmPayment = async (orderId, payload = {}) => {
  if (!orderId) throw new Error("Identifiant de commande requis.")
  const res = await api.post(`/payment/confirm/${orderId}`, payload)
  return res.data
}

// ✅ NOUVEAU : demander un remboursement
export const refundPayment = async (orderId, reason) => {
  if (!orderId) throw new Error("Identifiant de commande requis pour un remboursement.")
  const res = await api.post(`/payment/refund/${orderId}`, { reason })
  return res.data
}

// ✅ NOUVEAU : historique des paiements de l'utilisateur
export const getPaymentHistory = async (params = {}) => {
  const res = await api.get('/payment/history', { params })
  return res.data
}

