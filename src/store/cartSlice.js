import { createSlice } from '@reduxjs/toolkit'

// ✅ Constantes
const STORAGE_KEY = 'agro_cart'

// ✅ Helper pour charger le panier depuis localStorage
const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw)
    
    // Validation de la structure
    if (!parsed || typeof parsed !== 'object') return { items: [] }
    if (!Array.isArray(parsed.items)) return { items: [] }
    
    // Validation des items
    const validItems = parsed.items.filter(item => 
      item && typeof item === 'object' && (item.id || item._id)
    )
    
    return { items: validItems }
  } catch (error) {
    console.warn('Erreur de chargement du panier:', error)
    return { items: [] }
  }
}

// ✅ Helper pour sauvegarder le panier
const saveCart = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('Erreur de sauvegarde du panier:', error)
  }
}

// ✅ Helper pour trouver un produit par ID
const findItem = (items, productId) => {
  return items.find(item => item.id === productId)
}

// ✅ Helper pour générer un ID unique si manquant
const getProductId = (product) => {
  return product.id || product._id || `temp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
}

// ✅ Initialisation
const initialState = loadCart()

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // ✅ Ajouter au panier
    addToCart: (state, action) => {
      const product = action.payload
      const productId = getProductId(product)
      
      // Normaliser le produit
      const normalizedProduct = {
        ...product,
        id: productId,
        qty: 1,
        // S'assurer que les champs importants existent
        price: product.price || 0,
        name: product.name || 'Produit',
      }
      
      const existing = findItem(state.items, productId)
      
      if (existing) {
        existing.qty += 1
      } else {
        state.items.push(normalizedProduct)
      }
      
      saveCart(state)
    },
    
    // ✅ Ajouter avec quantité spécifique
    addToCartQty: (state, action) => {
      const { product, quantity = 1 } = action.payload
      const productId = getProductId(product)
      
      // Normaliser le produit
      const normalizedProduct = {
        ...product,
        id: productId,
        qty: quantity,
        price: product.price || 0,
        name: product.name || 'Produit',
      }
      
      const existing = findItem(state.items, productId)
      
      if (existing) {
        existing.qty += quantity
      } else {
        state.items.push(normalizedProduct)
      }
      
      saveCart(state)
    },
    
    // ✅ Retirer du panier
    removeFromCart: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter(item => item.id !== productId)
      saveCart(state)
    },
    
    // ✅ Modifier la quantité
    changeQty: (state, action) => {
      const { id, delta } = action.payload
      const item = findItem(state.items, id)
      
      if (item) {
        const newQty = (item.qty || 1) + delta
        if (newQty <= 0) {
          state.items = state.items.filter(i => i.id !== id)
        } else {
          item.qty = newQty
        }
        saveCart(state)
      }
    },
    
    // ✅ Définir une quantité exacte
    setQty: (state, action) => {
      const { id, quantity } = action.payload
      const item = findItem(state.items, id)
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.id !== id)
        } else {
          item.qty = quantity
        }
        saveCart(state)
      }
    },
    
    // ✅ Vider le panier
    clearCart: (state) => {
      state.items = []
      saveCart(state)
    },
    
    // ✅ Supprimer les articles sélectionnés
    removeSelected: (state, action) => {
      const ids = action.payload
      state.items = state.items.filter(item => !ids.includes(item.id))
      saveCart(state)
    },
    
    // ✅ Mettre à jour un article spécifique
    updateItem: (state, action) => {
      const { id, updates } = action.payload
      const item = findItem(state.items, id)
      
      if (item) {
        Object.assign(item, updates)
        saveCart(state)
      }
    },
    
    // ✅ Réinitialiser le panier (force)
    resetCart: () => {
      localStorage.removeItem(STORAGE_KEY)
      return { items: [] }
    },
  },
})

// ===== SÉLECTEURS =====

// ✅ Sélecteur de base
export const selectCart = (state) => state.cart
export const selectCartItems = (state) => state.cart.items

// ✅ Nombre total d'articles
export const selectCartCount = (state) => {
  return state.cart.items.reduce((sum, item) => sum + (item.qty || 0), 0)
}

// ✅ Prix total
export const selectCartTotal = (state) => {
  return state.cart.items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0)
}

// ✅ Vérifier si un produit est dans le panier
export const selectIsInCart = (productId) => (state) => {
  return state.cart.items.some(item => item.id === productId)
}

// ✅ Quantité d'un produit spécifique
export const selectItemQuantity = (productId) => (state) => {
  const item = state.cart.items.find(item => item.id === productId)
  return item?.qty || 0
}

// ✅ Vérifier si le panier est vide
export const selectIsCartEmpty = (state) => {
  return state.cart.items.length === 0
}

// ✅ Vérifier si le panier est vide
export const selectCartItemsCount = (state) => {
  return state.cart.items.length
}

// ===== EXPORTS =====
export const { 
  addToCart, 
  addToCartQty,
  removeFromCart, 
  changeQty, 
  setQty,
  clearCart,
  removeSelected,
  updateItem,
  resetCart,
} = cartSlice.actions

export default cartSlice.reducer