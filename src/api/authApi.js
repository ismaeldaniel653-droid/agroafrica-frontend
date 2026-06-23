import api from './axios'

// ===== AUTHENTIFICATION =====

// Inscription
export const registerUser = async (data) => {
  const res = await api.post('/auth/register', data)
  return res.data
}

// Connexion
export const loginUser = async (data) => {
  const res = await api.post('/auth/login', data)
  return res.data
}

// Profil courant
export const getProfile = async () => {
  const res = await api.get('/auth/profile')
  return res.data
}

// ✅ NOUVEAU : mise à jour du profil (nom, ville, pays, téléphone, avatar…)
export const updateProfile = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error("Aucune donnée de profil fournie.")
  }
  const res = await api.put('/auth/profile', data)
  return res.data
}

// ✅ NOUVEAU : upload avatar seul (utile si vous voulez un endpoint dédié)
export const uploadAvatar = async (dataUrl) => {
  if (!dataUrl || typeof dataUrl !== 'string') {
    throw new Error("Image de profil manquante.")
  }
  // On envoie en JSON (base64) pour rester simple côté backend
  const res = await api.post('/auth/avatar', { avatar: dataUrl })
  return res.data
}

// ✅ NOUVEAU : suppression de l'avatar (retour aux initiales)
export const deleteAvatar = async () => {
  const res = await api.delete('/auth/avatar')
  return res.data
}
