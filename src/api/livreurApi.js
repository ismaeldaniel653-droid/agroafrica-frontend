import api from './axios'

// Récupérer la liste des livreurs
export const getLivreurs = async () => {
  const res = await api.get('/livreurs')
  return res.data
}

// Enregistrer un nouveau livreur
export const registerLivreur = async (data) => {
  const res = await api.post('/livreurs/register', data)
  return res.data
}