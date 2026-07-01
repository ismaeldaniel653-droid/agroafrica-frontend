import api from './axios'

// Récupérer la traçabilité complète d'un produit via son ID
export const getTraceability = async (id) => {
  // ✅ NOUVEAU : validation de l'identifiant
  if (!id) throw new Error("Identifiant du produit manquant pour la traçabilité.")
  const res = await api.get(`/qr/trace/${id}`)
  return res.data
}

// ✅ NOUVEAU : récupérer le QR code (image) d'un produit
export const getProductQR = async (id) => {
  if (!id) throw new Error("Identifiant du produit manquant.")
  const res = await api.get(`/qr/code/${id}`, { responseType: 'blob' })
  return res.data
}

// ✅ NOUVEAU : générer un certificat blockchain pour un produit (côté producteur)
export const generateCertificate = async (productId) => {
  if (!productId) throw new Error("Identifiant du produit requis.")
  const res = await api.post(`/qr/certificate/${productId}`)
  return res.data
}

// ✅ NOUVEAU : vérifier un certificat blockchain via son ID public
export const verifyCertificate = async (certId) => {
  if (!certId) throw new Error("Identifiant de certificat requis.")
  const res = await api.get(`/qr/verify/${certId}`)
  return res.data
}
