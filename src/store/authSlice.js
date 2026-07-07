import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { 
  loginUser, 
  registerUser, 
  updateProfile as updateProfileApi, 
  getProfile,
  logoutUser,
  changePassword
} from '../api/authApi'

// ✅ Constantes
const STORAGE_KEYS = {
  TOKEN: 'agro_token',
  USER: 'agro_user',
  THEME: 'agro_theme',
}

// ✅ Helper pour charger le user depuis localStorage
const loadUserFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Validation basique du user
    return parsed && typeof parsed === 'object' && parsed.email ? parsed : null
  } catch {
    return null
  }
}

// ✅ Helper pour sauvegarder le user
const saveUserToStorage = (user) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  } catch {
    // Silently fail
  }
}

// ✅ Helper pour le token
const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN)
const setToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
  }
}

// ===== ASYNC THUNKS =====

// CONNEXION
export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUser(data)
      const { token, user } = res
      
      // Sauvegarde
      setToken(token)
      if (user) saveUserToStorage(user)
      
      return { token, user }
    } catch (error) {
      const message = error.response?.data?.message || '❌ Erreur de connexion'
      return rejectWithValue(message)
    }
  }
)

// INSCRIPTION
export const register = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerUser(data)
      const { token, user } = res
      
      // Sauvegarde
      setToken(token)
      if (user) saveUserToStorage(user)
      
      return { token, user }
    } catch (error) {
      const message = error.response?.data?.message || '❌ Erreur d\'inscription'
      return rejectWithValue(message)
    }
  }
)

// RECHARGEMENT DU PROFIL
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProfile()
      const user = res?.user ?? res
      if (user) saveUserToStorage(user)
      return user
    } catch (error) {
      const message = error.response?.data?.message || '❌ Erreur de chargement du profil'
      return rejectWithValue(message)
    }
  }
)

// MISE À JOUR DU PROFIL
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateProfileApi(data)
      const updatedUser = res?.user ?? res ?? data
      saveUserToStorage(updatedUser)
      return updatedUser
    } catch (error) {
      // Fallback local si l'API est indisponible
      console.warn('API updateProfile indisponible, sauvegarde locale uniquement')
      saveUserToStorage(data)
      return data
    }
  }
)

// CHANGEMENT DE MOT DE PASSE
export const changeUserPassword = createAsyncThunk(
  'auth/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const res = await changePassword(data)
      return res
    } catch (error) {
      const message = error.response?.data?.message || '❌ Erreur de changement de mot de passe'
      return rejectWithValue(message)
    }
  }
)

// DÉCONNEXION
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser()
    } catch (error) {
      // Ignorer l'erreur, on déconnecte quand même localement
      console.warn('Erreur lors de la déconnexion serveur:', error)
    }
    // Nettoyage local (fait dans le reducer)
    return null
  }
)

// ===== SLICE =====

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadUserFromStorage(),
    token: getToken(),
    loading: false,
    error: null,
    isAuthenticated: !!getToken(),
  },
  reducers: {
    // ✅ Déconnexion synchrone (fallback)
    logoutLocal: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      setToken(null)
      saveUserToStorage(null)
    },
    
    // ✅ Effacer les erreurs
    clearError: (state) => {
      state.error = null
    },
    
    // ✅ Mise à jour synchrone du profil (hors API)
    setProfile: (state, action) => {
      state.user = { ...(state.user || {}), ...action.payload }
      saveUserToStorage(state.user)
    },
    
    // ✅ Mise à jour rapide de l'avatar
    setAvatar: (state, action) => {
      if (!state.user) state.user = {}
      state.user.avatar = action.payload
      state.user.avatarUrl = action.payload
      saveUserToStorage(state.user)
    },
    
    // ✅ Mise à jour du token
    setTokenAction: (state, action) => {
      state.token = action.payload
      setToken(action.payload)
      state.isAuthenticated = !!action.payload
    },
    
    // ✅ Réinitialisation complète
    resetAuth: (state) => {
      state.user = null
      state.token = null
      state.loading = false
      state.error = null
      state.isAuthenticated = false
      setToken(null)
      saveUserToStorage(null)
    },
  },

  extraReducers: (builder) => {
    builder
      // ===== LOGIN =====
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })

      // ===== REGISTER =====
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })

      // ===== FETCH PROFILE =====
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.user = action.payload
          state.isAuthenticated = true
        }
        state.error = null
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        // Ne pas déconnecter automatiquement
      })

      // ===== UPDATE PROFILE =====
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ===== CHANGE PASSWORD =====
      .addCase(changeUserPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ===== LOGOUT =====
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.loading = false
        state.isAuthenticated = false
        state.error = null
        setToken(null)
        saveUserToStorage(null)
      })
      .addCase(logout.rejected, (state) => {
        // Même si l'API échoue, on déconnecte localement
        state.user = null
        state.token = null
        state.loading = false
        state.isAuthenticated = false
        state.error = null
        setToken(null)
        saveUserToStorage(null)
      })
  },
})

// ===== EXPORTS =====
export const { 
  logoutLocal, 
  clearError, 
  setProfile, 
  setAvatar,
  setTokenAction,
  resetAuth,
} = authSlice.actions

// ✅ Sélecteurs
export const selectUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
export const selectUserRole = (state) => state.auth.user?.role || 'acheteur'
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin'

export default authSlice.reducer