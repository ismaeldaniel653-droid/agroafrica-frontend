import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, register } from '../store/authSlice'
import { User, Lock, Phone, Eye, EyeOff, ArrowLeft } from 'lucide-react'

function Login() {
  const navigate    = useNavigate()
  const dispatch    = useDispatch()
  const { loading, error } = useSelector(state => state.auth)

  const [mode,    setMode]    = useState('login')
  const [showPwd, setShowPwd] = useState(false)
  
  // ✅ État pour stocker l'indicatif pays séparément
  const [countryCode, setCountryCode] = useState('+237')
  
  const [form,    setForm]    = useState({
    name: '', phone: '', email: '', password: '', role: 'acheteur'
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (mode === 'login') {
        // En mode login, on envoie l'email ou le téléphone saisi dans le champ principal
        await dispatch(login({ email: form.email, password: form.password })).unwrap()
      } else {
        // ✅ CORRECTIF : On combine l'indicatif et le numéro avant l'envoi au backend
        const fullPhoneNumber = `${countryCode}${form.phone.replace(/\s+/g, '')}`
        
        await dispatch(register({
          ...form,
          phone: fullPhoneNumber
        })).unwrap()
      }
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md animate-fade-in">

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-6 hover:underline group transition"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#DDE8E2]">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-[#0C6B4E] via-[#18A070] to-[#0C6B4E] bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite] px-6 sm:px-8 py-8 sm:py-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

            <div className="relative z-10">
              <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🌿</div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2">
                {mode === 'login' ? 'Bon retour !' : 'Rejoignez AgroAfrica'}
              </h1>
              <p className="text-white/80 text-sm">
                {mode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte gratuitement'}
              </p>
            </div>
          </div>

          {/* TOGGLE */}
          <div className="flex bg-[#F5F7F5] m-4 sm:m-5 rounded-xl overflow-hidden shadow-inner border border-[#DDE8E2]">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-sm font-bold transition-all duration-300 rounded-xl ${mode === 'login' ? 'bg-white shadow-md text-[#0C6B4E] scale-105' : 'text-[#8AADA0] hover:text-[#0C6B4E]'}`}
            >
              Se connecter
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-3 text-sm font-bold transition-all duration-300 rounded-xl ${mode === 'register' ? 'bg-white shadow-md text-[#0C6B4E] scale-105' : 'text-[#8AADA0] hover:text-[#0C6B4E]'}`}
            >
              S'inscrire
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mx-6 sm:mx-8 mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-5">

            {/* NOM */}
            {mode === 'register' && (
              <div className="animate-fade-in">
                <label className="text-xs font-semibold text-[#4A6355] mb-2 block">Nom complet</label>
                <div className="flex items-center gap-3 border border-[#DDE8E2] rounded-xl px-4 py-3 focus-within:border-[#0C6B4E] focus-within:ring-2 focus-within:ring-[#0C6B4E]/20 transition-all">
                  <User size={16} className="text-[#8AADA0]" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Votre nom"
                    value={form.name}
                    onChange={handleChange}
                    className="flex-1 outline-none text-sm bg-transparent text-[#1A2E25]"
                    required
                  />
                </div>
              </div>
            )}

            {/* TÉLÉPHONE */}
            {mode === 'register' && (
              <div className="animate-fade-in">
                <label className="text-xs font-semibold text-[#4A6355] mb-2 block">Téléphone (Orange / MTN)</label>
                <div className="flex items-center gap-2 sm:gap-3 border border-[#DDE8E2] rounded-xl px-3 sm:px-4 py-3 focus-within:border-[#0C6B4E] focus-within:ring-2 focus-within:ring-[#0C6B4E]/20 transition-all">
                  <Phone size={16} className="text-[#8AADA0]" />
                  
                  {/* ✅ CORRECTIF : Liaison de la valeur du select à countryCode */}
                  <select 
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="text-xs sm:text-sm text-[#8AADA0] bg-transparent outline-none border-r border-[#DDE8E2] pr-2 mr-1"
                  >
                    <option value="+237">🇨🇲 +237</option>
                    <option value="+221">🇸🇳 +221</option>
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+233">🇬🇭 +233</option>
                  </select>
                  
                  <input
                    type="tel"
                    name="phone"
                    placeholder="6XX XXX XXX"
                    pattern="[0-9]{9}" 
                    title="Le numéro doit contenir exactement 9 chiffres (ex: 677123456)"
                    value={form.phone}
                    onChange={handleChange}
                    className="flex-1 outline-none text-sm bg-transparent text-[#1A2E25] min-w-0"
                    required
                  />
                </div>
              </div>
            )}

            {/* EMAIL / IDENTIFIANT */}
            <div>
              <label className="text-xs font-semibold text-[#4A6355] mb-2 block">
                {mode === 'login' ? 'Email ou Numéro de téléphone' : 'Email'}
              </label>
              <div className="flex items-center gap-3 border border-[#DDE8E2] rounded-xl px-4 py-3 focus-within:border-[#0C6B4E] focus-within:ring-2 focus-within:ring-[#0C6B4E]/20 transition-all">
                <span className="text-[#8AADA0] text-sm">✉️</span>
                <input
                  type={mode === 'login' ? 'text' : 'email'}
                  name="email"
                  placeholder={mode === 'login' ? 'vous@exemple.com ou +237...' : 'vous@exemple.com'}
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm bg-transparent text-[#1A2E25]"
                  required={mode === 'login'} // Rend l'email optionnel à l'inscription si votre backend le permet
                />
              </div>
            </div>

            {/* MOT DE PASSE */}
            <div>
              <label className="text-xs font-semibold text-[#4A6355] mb-2 block">Mot de passe</label>
              <div className="flex items-center gap-3 border border-[#DDE8E2] rounded-xl px-4 py-3 focus-within:border-[#0C6B4E] focus-within:ring-2 focus-within:ring-[#0C6B4E]/20 transition-all">
                <Lock size={16} className="text-[#8AADA0]" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  placeholder="Minimum 8 caractères"
                  value={form.password}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm bg-transparent text-[#1A2E25]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="text-[#8AADA0] hover:text-[#0C6B4E] transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* BOUTON DE SOUMISSION */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0C6B4E] hover:bg-[#18A070] text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-95 shadow-md disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
