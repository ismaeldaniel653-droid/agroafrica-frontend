import { configureStore } from '@reduxjs/toolkit'
import cartReducer  from './cartSlice'
import authReducer  from './authSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer
  },
  // ✅ NOUVEAU : optionnel — pour de meilleures perfs si tu stockes des images base64
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Les avatars peuvent être de longues chaînes base64, on autorise
        ignoredPaths: ['auth.user.avatar'],
        ignoredActions: ['auth/setAvatar', 'auth/updateProfile/fulfilled'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production'
})
