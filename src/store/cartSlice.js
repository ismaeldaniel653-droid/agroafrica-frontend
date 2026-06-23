import { createSlice } from '@reduxjs/toolkit'

// ✅ NOUVEAU : hydratation du panier depuis localStorage (évite de perdre le panier au refresh)
const loadCart = () => {
  try {
    const raw = localStorage.getItem('agro_cart')
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed?.items) ? parsed : { items: [] }
  } catch {
    return { items: [] }
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCart(),
  reducers: {
    addToCart: (state, action) => {
      const productId = action.payload.id || action.payload._id
      const existing = state.items.find(i => i.id === productId)
      if (existing) {
        existing.qty++
      } else {
        state.items.push({ ...action.payload, id: productId, qty: 1 })
      }
      // ✅ NOUVEAU : sauvegarde à chaque mutation
      try { localStorage.setItem('agro_cart', JSON.stringify(state)) } catch {}
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload)
      try { localStorage.setItem('agro_cart', JSON.stringify(state)) } catch {}
    },
    changeQty: (state, action) => {
      const { id, delta } = action.payload
      const item = state.items.find(i => i.id === id)
      if (item) {
        item.qty += delta
        if (item.qty <= 0) {
          state.items = state.items.filter(i => i.id !== id)
        }
      }
      try { localStorage.setItem('agro_cart', JSON.stringify(state)) } catch {}
    },
    clearCart: (state) => {
      state.items = []
      // ✅ NOUVEAU : on garde la trace mais vide
      try { localStorage.setItem('agro_cart', JSON.stringify(state)) } catch {}
    }
  }
})

export const { addToCart, removeFromCart, changeQty, clearCart } = cartSlice.actions
export default cartSlice.reducer
