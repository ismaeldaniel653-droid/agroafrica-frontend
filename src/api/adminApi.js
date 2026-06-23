import api from './axios'

// ===== DASHBOARD =====

export const getDashboardStats = async () => {
  const res = await api.get('/admin/dashboard')
  return res.data
}

export const getStatsByCountry = async () => {
  const res = await api.get('/admin/stats/countries')
  return res.data
}

export const getSalesByMonth = async () => {
  const res = await api.get('/admin/stats/sales')
  return res.data
}

export const getTopSellers = async () => {
  const res = await api.get('/admin/stats/sellers')
  return res.data
}

// ===== USERS =====

export const getUsers = async (params = {}) => {
  const res = await api.get('/admin/users', { params })
  return res.data
}

export const getUser = async (id) => {
  if (!id) throw new Error("Identifiant utilisateur manquant.")
  const res = await api.get(`/admin/users/${id}`)
  return res.data
}

export const updateUser = async (id, data) => {
  if (!id) throw new Error("Identifiant utilisateur requis.")
  const res = await api.put(`/admin/users/${id}`, data)
  return res.data
}

export const deleteUser = async (id) => {
  if (!id) throw new Error("Identifiant utilisateur requis.")
  const res = await api.delete(`/admin/users/${id}`)
  return res.data
}

export const verifyUser = async (id) => {
  if (!id) throw new Error("Identifiant utilisateur requis.")
  const res = await api.patch(`/admin/users/${id}/verify`)
  return res.data
}

export const suspendUser = async (id) => {
  if (!id) throw new Error("Identifiant utilisateur requis.")
  const res = await api.patch(`/admin/users/${id}/suspend`)
  return res.data
}