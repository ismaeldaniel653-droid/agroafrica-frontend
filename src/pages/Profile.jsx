import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, updateProfile, fetchProfile } from '../store/authSlice'
import { 
  ArrowLeft, Mail, Phone, MapPin, Lock, LogOut, 
  Edit, Save, ShoppingBag, Loader, CheckCircle,
  AlertCircle, User, Calendar, Shield, ChevronRight
} from 'lucide-react'
import Avatar from '../components/Avatar'
import { getOrders } from '../api/orderApi'

// ✅ Configuration des statuts
const STATUS_CONFIG = {
  'livré': { label: 'Livré', style: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  'en cours': { label: 'En cours', style: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  'confirmé': { label: 'Confirmé', style: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  'annulé': { label: 'Annulé', style: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
}

function Profile({ 
  className = '',
  onLogout,
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, loading } = useSelector(state => state.auth)
  
  const [editing, setEditing] = useState(false)
  const [tab, setTab] = useState('info')
  const [recentOrders, setRecentOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    country: 'Cameroun',
    avatar: null,
  })

  // ✅ Initialisation du formulaire
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        country: user.country || 'Cameroun',
        avatar: user.avatar || user.avatarUrl || null,
      })
    }
  }, [user])

  // ✅ Chargement des commandes récentes
  useEffect(() => {
    if (tab === 'orders') {
      const fetchOrders = async () => {
        setOrdersLoading(true)
        setError(null)
        try {
          const res = await getOrders({ limit: 5 })
          const list = res?.orders ?? res?.data ?? res ?? []
          setRecentOrders(Array.isArray(list) ? list : [])
        } catch (err) {
          setError(err?.response?.data?.message || 'Erreur de chargement des commandes')
          setRecentOrders([])
        } finally {
          setOrdersLoading(false)
        }
      }
      fetchOrders()
    }
  }, [tab])

  // ✅ Déconnexion
  const handleLogout = useCallback(() => {
    if (onLogout) {
      onLogout()
    } else {
      dispatch(logout())
    }
    navigate('/')
  }, [dispatch, navigate, onLogout])

  // ✅ Sauvegarde du profil
  const handleSave = useCallback(async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      await dispatch(updateProfile(form)).unwrap()
      setSuccess(true)
      setEditing(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err?.message || 'Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }, [form, dispatch])

  // ✅ Annulation de l'édition
  const handleCancel = useCallback(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        country: user.country || 'Cameroun',
        avatar: user.avatar || user.avatarUrl || null,
      })
    }
    setEditing(false)
    setError(null)
  }, [user])

  // ✅ Calculs mémorisés
  const totalSpent = useMemo(() => {
    return recentOrders
      .filter(o => o.status !== 'annulé')
      .reduce((s, o) => s + (o.totalAmount || o.total || 0), 0)
  }, [recentOrders])

  const stats = useMemo(() => [
    { label: 'Commandes', value: user?.orderCount ?? recentOrders.length, icon: '📦' },
    { label: 'Dépensés', value: `${(user?.totalSpent ?? totalSpent).toLocaleString()} FCFA`, icon: '💰' },
    { label: 'Favoris', value: user?.favoritesCount ?? 0, icon: '❤️' },
    { label: 'Avis', value: user?.reviewsCount ?? 0, icon: '⭐' },
  ], [user, recentOrders, totalSpent])

  // ✅ Formatage des dates
  const formatDate = useCallback((date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
  }, [])

  // ✅ Formatage de l'ID de commande
  const formatOrderId = useCallback((id) => {
    if (!id) return '—'
    if (typeof id === 'string' && id.length > 8) {
      return id.slice(-8).toUpperCase()
    }
    return id
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader size={32} className="text-[var(--accent-primary)] animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-[var(--bg-secondary)] py-6 sm:py-8 px-4 ${className}`}>
      <div className="max-w-3xl mx-auto">
        {/* Retour */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[var(--accent-primary)] font-semibold mb-5 hover:underline text-sm transition"
        >
          <ArrowLeft size={16} /> Retour au marché
        </button>

        {/* HEADER PROFIL */}
        <div className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary)]/80 rounded-3xl p-5 sm:p-6 text-[var(--text-light)] mb-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex items-center gap-3 sm:gap-4">
            <Avatar
              user={form}
              size="xl"
              editable={editing}
              onUpload={(url) => setForm({ ...form, avatar: url })}
              className="border-2 border-white/30"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold truncate">
                {form.name || 'Votre nom'}
              </h1>
              <p className="text-[var(--text-light)]/70 text-sm truncate flex items-center gap-1">
                <Mail size={14} /> {form.email}
              </p>
              <p className="text-[var(--text-light)]/50 text-xs mt-0.5 truncate flex items-center gap-1">
                <MapPin size={12} /> {[form.city, form.country].filter(Boolean).join(', ') || 'Non renseigné'}
              </p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="bg-white/20 hover:bg-white/30 text-[var(--text-light)] p-2 rounded-xl transition"
              aria-label={editing ? 'Annuler l\'édition' : 'Modifier le profil'}
            >
              {editing ? <X size={18} /> : <Edit size={18} />}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-5 sm:mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-3 sm:p-4 text-center hover:shadow-md transition">
              <div className="text-xl sm:text-2xl mb-1">{stat.icon}</div>
              <div className="text-sm sm:text-lg font-extrabold text-[var(--text-primary)] truncate">
                {stat.value}
              </div>
              <div className="text-[10px] text-[var(--text-secondary)]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Erreur/Succès */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 flex items-center gap-2 animate-fade-in">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 mb-4 flex items-center gap-2 animate-fade-in">
            <CheckCircle size={16} className="text-emerald-500" />
            <p className="text-sm text-emerald-600 dark:text-emerald-400">Profil mis à jour avec succès !</p>
          </div>
        )}

        {/* ONGLETS */}
        <div className="flex gap-2 mb-4 border-b border-[var(--border-color)] overflow-x-auto">
          {[
            { key: 'info', label: '👤 Informations' },
            { key: 'orders', label: '📦 Commandes' },
            { key: 'security', label: '🔒 Sécurité' },
          ].map(item => (
            <button 
              key={item.key} 
              onClick={() => setTab(item.key)}
              className={`px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition border-b-2 -mb-px whitespace-nowrap
                ${tab === item.key 
                  ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' 
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* INFOS */}
        {tab === 'info' && (
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 sm:p-6">
            <h2 className="font-bold text-[var(--text-primary)] mb-4 text-sm sm:text-base flex items-center gap-2">
              <User size={18} className="text-[var(--accent-primary)]" />
              Informations personnelles
            </h2>
            
            <div className="space-y-4 max-w-lg">
              {/* Nom */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                  Nom complet
                </label>
                <div className="flex items-center gap-3 border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 focus-within:border-[var(--accent-primary)] transition">
                  <User size={16} className="text-[var(--text-secondary)]" />
                  <input 
                    type="text" 
                    value={form.name} 
                    disabled={!editing}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Votre nom"
                    className="flex-1 outline-none text-sm bg-transparent disabled:text-[var(--text-secondary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                  Email
                </label>
                <div className="flex items-center gap-3 border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 focus-within:border-[var(--accent-primary)] transition">
                  <Mail size={16} className="text-[var(--text-secondary)]" />
                  <input 
                    type="email" 
                    value={form.email} 
                    disabled={!editing}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="flex-1 outline-none text-sm bg-transparent disabled:text-[var(--text-secondary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50"
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                  Téléphone
                </label>
                <div className="flex items-center gap-3 border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 focus-within:border-[var(--accent-primary)] transition">
                  <Phone size={16} className="text-[var(--text-secondary)]" />
                  <input 
                    type="tel" 
                    value={form.phone} 
                    disabled={!editing}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="+237 ..."
                    className="flex-1 outline-none text-sm bg-transparent disabled:text-[var(--text-secondary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50"
                  />
                </div>
              </div>

              {/* Ville et Pays */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                    Ville
                  </label>
                  <div className="flex items-center gap-3 border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 focus-within:border-[var(--accent-primary)] transition">
                    <MapPin size={16} className="text-[var(--text-secondary)]" />
                    <input 
                      type="text" 
                      value={form.city} 
                      disabled={!editing}
                      onChange={e => setForm({...form, city: e.target.value})}
                      className="flex-1 outline-none text-sm bg-transparent disabled:text-[var(--text-secondary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                    Pays
                  </label>
                  <select 
                    value={form.country} 
                    disabled={!editing}
                    onChange={e => setForm({...form, country: e.target.value})}
                    className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent-primary)] disabled:text-[var(--text-secondary)] text-[var(--text-primary)]"
                  >
                    <option value="Cameroun">🇨🇲 Cameroun</option>
                    <option value="Sénégal">🇸🇳 Sénégal</option>
                    <option value="Nigeria">🇳🇬 Nigeria</option>
                    <option value="Ghana">🇬🇭 Ghana</option>
                    <option value="Côte d'Ivoire">🇨🇮 Côte d'Ivoire</option>
                    <option value="Kenya">🇰🇪 Kenya</option>
                    <option value="Éthiopie">🇪🇹 Éthiopie</option>
                  </select>
                </div>
              </div>

              {/* Boutons d'action */}
              {editing && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button 
                    onClick={handleCancel}
                    className="flex-1 border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold py-3 rounded-xl hover:bg-[var(--bg-secondary)] transition"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-[var(--text-light)] font-bold py-3 rounded-xl transition disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <><Loader size={16} className="animate-spin" /> Sauvegarde...</>
                    ) : (
                      <><Save size={16} /> Enregistrer</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMMANDES */}
        {tab === 'orders' && (
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
              <h2 className="font-bold text-[var(--text-primary)] text-sm sm:text-base flex items-center gap-2">
                <ShoppingBag size={18} className="text-[var(--accent-primary)]" />
                Mes commandes
              </h2>
              <button 
                onClick={() => navigate('/my-orders')}
                className="text-xs text-[var(--accent-primary)] font-semibold hover:underline flex items-center gap-1"
              >
                Voir tout <ChevronRight size={14} />
              </button>
            </div>
            
            {ordersLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader size={24} className="text-[var(--accent-primary)] animate-spin" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-3xl mb-2">📦</div>
                <p className="text-sm text-[var(--text-secondary)]">Aucune commande pour le moment</p>
                <button 
                  onClick={() => navigate('/')}
                  className="mt-4 text-[var(--accent-primary)] font-semibold hover:underline text-sm"
                >
                  Explorer le marché →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-color)]">
                {recentOrders.map((order, index) => {
                  const orderId = order._id || order.id || `ORD-${index + 1}`
                  const amount = order.totalAmount || order.montant || order.total || 0
                  const status = order.status || 'confirmé'
                  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG['confirmé']
                  const productName = order.items?.[0]?.name || order.product || 
                    (order.items ? `${order.items.length} produit(s)` : 'Commande')
                  
                  return (
                    <div 
                      key={orderId} 
                      className="px-5 sm:px-6 py-4 flex items-center gap-4 hover:bg-[var(--bg-secondary)] transition cursor-pointer"
                      onClick={() => navigate(`/payment-status/${orderId}`)}
                    >
                      <div className="w-10 h-10 bg-[var(--accent-primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShoppingBag size={18} className="text-[var(--accent-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                          {productName}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          #{formatOrderId(orderId)} • {formatDate(order.createdAt || order.date)}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-[var(--accent-secondary)] whitespace-nowrap">
                        {amount.toLocaleString()} FCFA
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap ${statusConfig.style}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* SÉCURITÉ */}
        {tab === 'security' && (
          <div className="space-y-4">
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 sm:p-6">
              <h2 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Lock size={18} className="text-[var(--accent-primary)]" />
                Changer le mot de passe
              </h2>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                    Mot de passe actuel
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] placeholder-[var(--text-secondary)]/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                    Nouveau mot de passe
                  </label>
                  <input 
                    type="password" 
                    placeholder="Minimum 8 caractères"
                    className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] placeholder-[var(--text-secondary)]/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                    Confirmer
                  </label>
                  <input 
                    type="password" 
                    placeholder="Retapez le mot de passe"
                    className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] placeholder-[var(--text-secondary)]/50"
                  />
                </div>
                <button className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-[var(--text-light)] font-bold px-6 py-3 rounded-xl transition text-sm">
                  Mettre à jour le mot de passe
                </button>
              </div>
            </div>

            {/* Déconnexion */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-5 sm:p-6">
              <h2 className="font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2 text-sm sm:text-base">
                <LogOut size={18} /> Déconnexion
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Déconnectez-vous de votre compte AgroAfrica.
              </p>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition text-sm"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile