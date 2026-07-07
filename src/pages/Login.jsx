import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, register } from '../store/authSlice'
import { 
  User, Lock, Phone, Eye, EyeOff, ArrowLeft,
  Mail, AlertCircle, CheckCircle, Loader,
  Shield, Sparkles
} from 'lucide-react'

// ✅ Configuration des pays
const COUNTRIES = [
  { code: '+237', label: '🇨🇲 Cameroun', flag: '🇨🇲' },
  { code: '+221', label: '🇸🇳 Sénégal', flag: '🇸🇳' },
  { code: '+234', label: '🇳🇬 Nigeria', flag: '🇳🇬' },
  { code: '+233', label: '🇬🇭 Ghana', flag: '🇬🇭' },
  { code: '+225', label: '🇨🇮 Côte d\'Ivoire', flag: '🇨🇮' },
  { code: '+254', label: '🇰🇪 Kenya', flag: '🇰🇪' },
  { code: '+229', label: '🇧🇯 Bénin', flag: '🇧🇯' },
  { code: '+228', label: '🇹🇬 Togo', flag: '🇹🇬' },
]

// ✅ Rôles disponibles
const ROLES = [
  { value: 'acheteur', label: '🛒 Acheteur' },
  { value: 'vendeur', label: '🏪 Vendeur' },
  { value: 'cooperative', label: '🤝 Coopérative' },
]

function Login({ 
  redirectTo = '/',
  className = '',
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector(state => state.auth)

  const [mode, setMode] = useState('login')
  const [showPwd, setShowPwd] = useState(false)
  const [countryCode, setCountryCode] = useState('+237')
  const [touched, setTouched] = useState({})
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'acheteur',
  })

  // ✅ Effacer les erreurs quand on change de mode
  useEffect(() => {
    // L'erreur est gérée par Redux, mais on peut la réinitialiser localement
  }, [mode])

  // ✅ Gestion des changements
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [])

  // ✅ Validation du formulaire
  const validateForm = useCallback(() => {
    const errors = {}

    if (mode === 'register') {
      if (!form.name?.trim()) errors.name = 'Nom requis'
      if (form.name?.trim().length < 2) errors.name = 'Minimum 2 caractères'
      
      if (!form.phone?.trim()) errors.phone = 'Téléphone requis'
      if (form.phone?.trim().length < 8) errors.phone = 'Numéro invalide'
      
      if (!form.email?.trim()) errors.email = 'Email requis'
      if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Email invalide'
    }

    if (!form.password?.trim()) errors.password = 'Mot de passe requis'
    if (form.password?.trim().length < 8) errors.password = 'Minimum 8 caractères'

    return errors
  }, [form, mode])

  // ✅ Soumission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      // Marquer tous les champs comme touchés
      const allTouched = Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      setTouched(allTouched)
      return
    }

    try {
      if (mode === 'login') {
        await dispatch(login({ 
          email: form.email.trim(), 
          password: form.password 
        })).unwrap()
      } else {
        const fullPhone = `${countryCode}${form.phone.replace(/\s+/g, '')}`
        await dispatch(register({
          name: form.name.trim(),
          phone: fullPhone,
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        })).unwrap()
      }
      
      setSuccess(true)
      setTimeout(() => {
        navigate(redirectTo)
      }, 1500)
      
    } catch (err) {
      console.error('Auth error:', err)
    }
  }, [form, mode, countryCode, dispatch, navigate, redirectTo, validateForm])

  // ✅ Rendu du champ avec erreur
  const renderField = ({ label, name, type, placeholder, icon: Icon, required = true, options = null }) => {
    const hasError = touched[name] && error
    const value = form[name]

    return (
      <div>
        <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className={`
          flex items-center gap-3 border rounded-xl px-4 py-3 
          transition-all focus-within:ring-2
          ${hasError 
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20' 
            : 'border-[var(--border-color)] focus-within:border-[var(--accent-primary)] focus-within:ring-[var(--accent-primary)]/20'
          }
        `}>
          {Icon && <Icon size={16} className="text-[var(--text-secondary)]" />}
          
          {options ? (
            <select
              name={name}
              value={value}
              onChange={handleChange}
              className="flex-1 outline-none text-sm bg-transparent text-[var(--text-primary)]"
            >
              <option value="">Sélectionner</option>
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : type === 'select' ? (
            <select
              name={name}
              value={value}
              onChange={handleChange}
              className="flex-1 outline-none text-sm bg-transparent text-[var(--text-primary)]"
            >
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              className="flex-1 outline-none text-sm bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50"
              required={required}
              autoComplete={name === 'password' ? (mode === 'login' ? 'current-password' : 'new-password') : 'off'}
            />
          )}
        </div>
        {hasError && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle size={12} /> {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4 py-8 sm:py-12 ${className}`}>
      <div className="w-full max-w-md animate-fade-in">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[var(--accent-primary)] font-semibold mb-6 hover:underline group transition"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </button>

        {/* Main Card */}
        <div className="bg-[var(--bg-card)] rounded-3xl shadow-2xl overflow-hidden border border-[var(--border-color)]">
          {/* HEADER */}
          <div className="relative bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-primary)]/90 to-[var(--accent-primary)] px-6 sm:px-8 py-8 sm:py-10 text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
            
            <div className="relative z-10">
              <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🌿</div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--text-light)] mb-2">
                {mode === 'login' ? 'Bon retour !' : 'Rejoignez AgroAfrica'}
              </h1>
              <p className="text-[var(--text-light)]/80 text-sm">
                {mode === 'login' 
                  ? 'Connectez-vous à votre compte' 
                  : 'Créez votre compte gratuitement'
                }
              </p>
            </div>
          </div>

          {/* TOGGLE */}
          <div className="flex bg-[var(--bg-secondary)] m-4 sm:m-5 rounded-xl overflow-hidden shadow-inner border border-[var(--border-color)]">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-sm font-bold transition-all duration-300 rounded-xl ${
                mode === 'login' 
                  ? 'bg-[var(--bg-card)] shadow-md text-[var(--accent-primary)] scale-105' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-3 text-sm font-bold transition-all duration-300 rounded-xl ${
                mode === 'register' 
                  ? 'bg-[var(--bg-card)] shadow-md text-[var(--accent-primary)] scale-105' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'
              }`}
            >
              S'inscrire
            </button>
          </div>

          {/* SUCCESS */}
          {success && (
            <div className="mx-6 sm:mx-8 mb-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in">
              <CheckCircle size={16} />
              {mode === 'login' ? 'Connexion réussie !' : 'Inscription réussie !'}
            </div>
          )}

          {/* ERROR */}
          {error && !success && (
            <div className="mx-6 sm:mx-8 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-5">
            {/* NOM (register) */}
            {mode === 'register' && renderField({
              label: 'Nom complet',
              name: 'name',
              type: 'text',
              placeholder: 'Votre nom',
              icon: User,
            })}

            {/* TÉLÉPHONE (register) */}
            {mode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <div className={`
                  flex items-center gap-2 sm:gap-3 border rounded-xl px-3 sm:px-4 py-3 
                  transition-all focus-within:ring-2
                  ${touched.phone && error 
                    ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20' 
                    : 'border-[var(--border-color)] focus-within:border-[var(--accent-primary)] focus-within:ring-[var(--accent-primary)]/20'
                  }
                `}>
                  <Phone size={16} className="text-[var(--text-secondary)]" />
                  
                  <select 
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="text-xs sm:text-sm text-[var(--text-secondary)] bg-transparent outline-none border-r border-[var(--border-color)] pr-2 mr-1"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                  
                  <input
                    type="tel"
                    name="phone"
                    placeholder="6XX XXX XXX"
                    value={form.phone}
                    onChange={handleChange}
                    className="flex-1 outline-none text-sm bg-transparent text-[var(--text-primary)] min-w-0 placeholder-[var(--text-secondary)]/50"
                    required
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}
            {renderField({
              label: mode === 'login' ? 'Email ou téléphone' : 'Email',
              name: 'email',
              type: mode === 'login' ? 'text' : 'email',
              placeholder: mode === 'login' ? 'Email ou téléphone' : 'vous@exemple.com',
              icon: Mail,
              required: true,
            })}

            {/* RÔLE (register) */}
            {mode === 'register' && renderField({
              label: 'Je suis',
              name: 'role',
              type: 'select',
              placeholder: 'Sélectionner un rôle',
              options: ROLES,
              icon: Shield,
              required: false,
            })}

            {/* MOT DE PASSE */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className={`
                flex items-center gap-3 border rounded-xl px-4 py-3 
                transition-all focus-within:ring-2
                ${touched.password && error 
                  ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20' 
                  : 'border-[var(--border-color)] focus-within:border-[var(--accent-primary)] focus-within:ring-[var(--accent-primary)]/20'
                }
              `}>
                <Lock size={16} className="text-[var(--text-secondary)]" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  placeholder="Minimum 8 caractères"
                  value={form.password}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50"
                  required
                  minLength={8}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                  aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* BOUTON */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-[var(--text-light)] font-bold py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-95 shadow-md disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader size={16} className="animate-spin" /> Chargement...</>
              ) : mode === 'login' ? (
                'Se connecter'
              ) : (
                "S'inscrire"
              )}
            </button>

            {/* LIEN MODE */}
            <p className="text-center text-xs text-[var(--text-secondary)]">
              {mode === 'login' ? "Pas encore de compte ?" : "Déjà un compte ?"}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login')
                  setTouched({})
                }}
                className="ml-1 text-[var(--accent-primary)] font-semibold hover:underline transition"
              >
                {mode === 'login' ? "S'inscrire" : "Se connecter"}
              </button>
            </p>

            {/* BADGE SÉCURITÉ */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--text-secondary)]/60 pt-2 border-t border-[var(--border-color)]">
              <Sparkles size={12} />
              <span>Connexion sécurisée</span>
              <span>·</span>
              <span>🔒 Chiffrée</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login