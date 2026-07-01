import api from './axios'

// Créer une commande
export const createOrder = async (data) => {
  // ✅ NOUVEAU : validation minimale avant l'envoi
  if (!data || typeof data !== 'object') {
    throw new Error("Détails de commande manquants.")
  }
  const res = await api.post('/orders', data)
  return res.data
}

// ✅ NOUVEAU : liste des commandes de l'utilisateur connecté
export const getOrders = async (params = {}) => {
  const res = await api.get('/orders', { params })
  return res.data
}

// ✅ NOUVEAU : récupérer une commande par son ID
export const getOrder = async (id) => {
  if (!id) throw new Error("Identifiant de commande manquant.")
  const res = await api.get(`/orders/${id}`)
  return res.data
}

// ✅ NOUVEAU : mettre à jour le statut d'une commande (côté vendeur/admin)
export const updateOrderStatus = async (id, status) => {
  if (!id) throw new Error("Identifiant de commande requis.")
  if (!status) throw new Error("Nouveau statut requis.")
  const res = await api.patch(`/orders/${id}/status`, { status })
  return res.data
}

// ✅ NOUVEAU : annuler une commande
export const cancelOrder = async (id) => {
  if (!id) throw new Error("Identifiant de commande requis.")
  const res = await api.patch(`/orders/${id}/cancel`)
  return res.data
}
