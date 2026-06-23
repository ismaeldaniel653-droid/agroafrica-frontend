import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, registerUser, updateProfile as updateProfileApi, getProfile } from '../api/authApi'

// ✅ NOUVEAU : helper pour charger le user depuis localStorage (avec gestion d'erreur)
const loadUserFromStorage = () => {
  try {
    const raw = localStorage.getItem('auth_user')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Sécurité : on accepte uniquement un objet utilisateur valide
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

// CONNEXION
export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUser(data)
      localStorage.setItem('token', res.token)
      // ✅ NOUVEAU : on stocke aussi le user pour persister la session
      if (res.user) {
        localStorage.setItem('auth_user', JSON.stringify(res.user))
      }
      return res
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '❌ Erreur connexion')
    }
  }
)

// INSCRIPTION
export const register = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerUser(data)
      localStorage.setItem('token', res.token)
      // ✅ NOUVEAU : persistance du user (incluant avatar initial si fourni)
      if (res.user) {
        localStorage.setItem('auth_user', JSON.stringify(res.user))
      }
      return res
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '❌ Erreur inscription')
    }
  }
)

// ✅ MODIFIÉ : mise à jour du profil vers l'API réelle + fallback local
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      // Appel API réel pour sauvegarder le profil
      const res = await updateProfileApi(data)
      const updatedUser = res?.user ?? res ?? data
      localStorage.setItem('auth_user', JSON.stringify(updatedUser))
      return updatedUser
    } catch (error) {
      // Fallback local si l'API est indisponible
      localStorage.setItem('auth_user', JSON.stringify(data))
      return data
    }
  }
)

// ✅ NOUVEAU : recharger le profil depuis l'API (utilisé au montage de Profile)
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProfile()
      const user = res?.user ?? res
      if (user) {
        localStorage.setItem('auth_user', JSON.stringify(user))
      }
      return user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '❌ Erreur chargement profil')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    // ✅ NOUVEAU : hydratation depuis localStorage au démarrage
    user:    loadUserFromStorage(),
    token:   localStorage.getItem('token') || null,
    loading: false,
    error:   null
  },
  reducers: {
    // ✅ MODIFIÉ : supprime aussi auth_user (et l'avatar sauvegardé séparément)
    logout: (state) => {
      state.user  = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('auth_user')
    },
    clearError: (state) => {
      state.error = null
    },

    // ✅ NOUVEAU : mise à jour synchrone du profil (utilisable hors API)
    setProfile: (state, action) => {
      state.user = { ...(state.user || {}), ...action.payload }
      try {
        localStorage.setItem('auth_user', JSON.stringify(state.user))
      } catch {}
    },

    // ✅ NOUVEAU : mise à jour rapide de l'avatar uniquement
    setAvatar: (state, action) => {
      if (!state.user) state.user = {}
      state.user.avatar = action.payload
      try {
        localStorage.setItem('auth_user', JSON.stringify(state.user))
      } catch {}
    }
  },

  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload.user
        state.token   = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload.user
        state.token   = action.payload.token
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

      // ✅ NOUVEAU : updateProfile async (sauvegarde sync locale dans le thunk)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })

      // ✅ NOUVEAU : fetchProfile (recharger le profil depuis l'API)
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })
  }
})

export const { logout, clearError, setProfile, setAvatar } = authSlice.actions
export default authSlice.reducer
