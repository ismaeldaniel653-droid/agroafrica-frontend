import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import cartReducer from './cartSlice'
import authReducer from './authSlice'

// ===== PERSIST CONFIGURATION =====

// ✅ Configuration pour le panier (persisté)
const cartPersistConfig = {
  key: 'cart',
  storage,
  // On ne persist que certains champs si nécessaire
  // whitelist: ['items'],
}

// ✅ Configuration pour l'auth (persisté)
const authPersistConfig = {
  key: 'auth',
  storage,
  // On ne persist que certains champs (pas le token pour plus de sécurité)
  whitelist: ['user', 'isAuthenticated'],
  // blacklist: ['token', 'loading', 'error'],
}

// ✅ Reducers persistés
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer)
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)

// ===== STORE =====

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    auth: persistedAuthReducer,
  },
  // ✅ Middleware avec gestion des erreurs de sérialisation
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorer les actions de redux-persist
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
        // Ignorer les chemins avec des données non sérialisables
        ignoredPaths: [
          'auth.user.avatar',
          'auth.user.avatarUrl',
          'auth.user.photoURL',
        ],
        // Ignorer certaines actions spécifiques
        ignoredActionPaths: [
          'payload.avatar',
          'payload.avatarUrl',
          'payload.photoURL',
        ],
      },
      // ✅ Thunk pour les appels API
      thunk: {
        extraArgument: {
          // ✅ Ajouter des dépendances si nécessaire
        },
      },
    }).concat(
      // ✅ Ajouter des middlewares personnalisés si besoin
      // loggerMiddleware,
    ),
  
  // ✅ DevTools
  devTools: process.env.NODE_ENV !== 'production',
  
  // ✅ Preloaded state (pour le SSR ou l'hydratation initiale)
  preloadedState: {},
})

// ===== PERSISTOR =====

export const persistor = persistStore(store)

// ===== TYPES (pour TypeScript) =====

// ✅ Inférer le type du store
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

// ===== SÉLECTEURS GLOBAUX =====

// ✅ Sélecteurs combinés
export const selectAppState = (state) => state
export const selectRootState = (state) => state

// ===== MIDDLEWARES PERSONNALISÉS =====

// ✅ Logger middleware (optionnel)
export const loggerMiddleware = (store) => (next) => (action) => {
  console.group(`🎯 ${action.type}`)
  console.log('Action:', action)
  console.log('État avant:', store.getState())
  const result = next(action)
  console.log('État après:', store.getState())
  console.groupEnd()
  return result
}

// ✅ Middleware de suivi des performances (optionnel)
export const performanceMiddleware = (store) => (next) => (action) => {
  const start = performance.now()
  const result = next(action)
  const end = performance.now()
  const duration = end - start
  
  if (duration > 50) {
    console.warn(`⚠️ Action ${action.type} a pris ${duration.toFixed(2)}ms`)
  }
  
  return result
}

// ===== HYDRATION =====

// ✅ Fonction pour réhydrater manuellement (si besoin)
export const rehydrateStore = async () => {
  await persistor.persist()
  return store.getState()
}

// ===== RESET =====

// ✅ Fonction pour réinitialiser le store (déconnexion)
export const resetStore = () => {
  // Vider le persistor
  persistor.purge().then(() => {
    // Réinitialiser les reducers
    store.dispatch({ type: 'RESET_STORE' })
  })
}

// ===== EXPORTS =====
export default store
