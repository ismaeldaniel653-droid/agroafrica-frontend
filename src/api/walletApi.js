import api from './axios'

// Récupérer le portefeuille de l'utilisateur
export const getWallet = async () => {
  const res = await api.get('/wallet')
  return res.data
}

// Récupérer l'historique des transactions
export const getTransactions = async () => {
  const res = await api.get('/wallet/transactions')
  return res.data
}

// Envoyer de l'argent
export const sendMoney = async (data) => {
  const res = await api.post('/wallet/send', data)
  return res.data
}