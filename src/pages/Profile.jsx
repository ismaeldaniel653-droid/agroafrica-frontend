import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, updateProfile, fetchProfile } from '../store/authSlice'
import { ArrowLeft, Mail, Phone, MapPin, Lock, LogOut, Edit, Save, ShoppingBag, Loader } from 'lucide-react'
import Avatar from '../components/Avatar'
import { getOrders } from '../api/orderApi'

function Profile() {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
  const { user, loading } = useSelector(state => state.auth)
  const [editing, setEditing] = useState(false)
  const [tab, setTab] = useState('info')
  const [recentOrders, setRecentOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  // ✅ NOUVEAU : valeurs vides par défaut — l'utilisateur est celui connecté
  const [form, setForm] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city:  user?.city  || '',
    country: user?.country || 'Cameroun',
    avatar: user?.avatar || null,
  })

  // ✅ SUPPRIMÉ : fetchProfile causait une déconnexion automatique (401 interceptor)
  // Le profil est déjà chargé par le thunk login/register
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      name:  user?.name  || prev.name,
      email: user?.email || prev.email,
      phone: user?.phone || prev.phone,
      avatar: user?.avatar || prev.avatar,
    }))
  }, [user])

  // ✅ NOUVEAU : charger les vraies commandes récentes
  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true)
      try {
        const res = await getOrders({ limit: 5 })
        const list = res?.orders ?? res?.data ?? res ?? []
        setRecentOrders(Array.isArray(list) ? list : [])
      } catch {
        setRecentOrders([])
      } finally {
        setOrdersLoading(false)
      }
    }
    if (tab === 'orders') {
      fetchOrders()
    }
  }, [tab])

  function handleLogout() {
    dispatch(logout())
    navigate('/')
  }

  // ✅ MODIFIÉ : stats calculées à partir des vraies commandes + infos user
  const totalSpent = recentOrders
    .filter(o => o.status !== 'annulé')
    .reduce((s, o) => s + (o.totalAmount || o.total || 0), 0)

  const stats = [
    { label:'Commandes', value: user?.orderCount ?? recentOrders.length, icon:'📦' },
    { label:'Dépensés',  value: `${(user?.totalSpent ?? totalSpent).toLocaleString()} FCFA`, icon:'💰' },
    { label:'Favoris',   value: user?.favoritesCount ?? 0, icon:'❤️' },
    { label:'Avis',      value: user?.reviewsCount ?? 0, icon:'⭐' },
  ]

  const STATUS_STYLE = {
    'livré':    'bg-green-100 text-green-700',
    'en cours': 'bg-amber-100 text-amber-700',
    'annulé':   'bg-red-100 text-red-700',
  }

  function handleSave() {
    dispatch(updateProfile(form))
    setEditing(false)
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-6 sm:py-8 px-4">
      <div className="max-w-3xl mx-auto">

        <button onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-5 sm:mb-6 hover:underline text-sm">
          <ArrowLeft size={16} /> Retour au marché
        </button>

        {/* HEADER PROFIL */}
        <div className="bg-gradient-to-r from-[#0C6B4E] to-[#18A070] rounded-3xl p-5 sm:p-6 text-white mb-5 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* ✅ NOUVEAU : composant Avatar cliquable avec upload */}
            <Avatar
              user={form}
              size={64}
              editable={editing}
              onUpload={(url) => setForm({ ...form, avatar: url })}
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold truncate">
                {form.name || 'Votre nom'}
              </h1>
              <p className="text-white/70 text-sm truncate">{form.email}</p>
              <p className="text-white/50 text-xs mt-0.5 truncate">
                📍 {[form.city, form.country].filter(Boolean).join(', ') || 'Non renseigné'}
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        {/* ✅ NOUVEAU : grille responsive — 2 colonnes mobile, 4 PC */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-5 sm:mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#DDE8E2] p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
              <div className="text-sm sm:text-lg font-extrabold text-[#1A2E25] truncate">{s.value}</div>
              <div className="text-[10px] text-[#8AADA0]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ONGLETS */}
        <div className="flex gap-2 mb-4 border-b border-[#DDE8E2] overflow-x-auto">
          {[
            { key:'info',     label:'👤 Informations' },
            { key:'orders',   label:'📦 Commandes'    },
            { key:'security', label:'🔒 Sécurité'     },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition border-b-2 -mb-px whitespace-nowrap
                ${tab === t.key ? 'border-[#0C6B4E] text-[#0C6B4E]' : 'border-transparent text-[#8AADA0] hover:text-[#1A2E25]'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* INFOS */}
        {tab === 'info' && (
          <div className="bg-white rounded-2xl border border-[#DDE8E2] p-5 sm:p-6">
            <h2 className="font-bold text-[#1A2E25] mb-4 sm:mb-5 text-sm sm:text-base">Informations personnelles</h2>
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Nom complet</label>
                <div className="flex items-center gap-3 border border-[#DDE8E2] rounded-xl px-4 py-3 focus-within:border-[#0C6B4E] transition">
                  <input type="text" value={form.name} disabled={!editing}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Votre nom"
                    className="flex-1 outline-none text-sm bg-transparent disabled:text-[#4A6355] text-[#1A2E25]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Email</label>
                <div className="flex items-center gap-3 border border-[#DDE8E2] rounded-xl px-4 py-3 focus-within:border-[#0C6B4E] transition">
                  <Mail size={16} className="text-[#8AADA0]" />
                  <input type="email" value={form.email} disabled={!editing}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="flex-1 outline-none text-sm bg-transparent disabled:text-[#4A6355] text-[#1A2E25]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Téléphone</label>
                <div className="flex items-center gap-3 border border-[#DDE8E2] rounded-xl px-4 py-3 focus-within:border-[#0C6B4E] transition">
                  <Phone size={16} className="text-[#8AADA0]" />
                  <input type="tel" value={form.phone} disabled={!editing}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="+237 ..."
                    className="flex-1 outline-none text-sm bg-transparent disabled:text-[#4A6355] text-[#1A2E25]" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Ville</label>
                  <div className="flex items-center gap-3 border border-[#DDE8E2] rounded-xl px-4 py-3 focus-within:border-[#0C6B4E] transition">
                    <MapPin size={16} className="text-[#8AADA0]" />
                    <input type="text" value={form.city} disabled={!editing}
                      onChange={e => setForm({...form, city: e.target.value})}
                      className="flex-1 outline-none text-sm bg-transparent disabled:text-[#4A6355] text-[#1A2E25]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Pays</label>
                  <select value={form.country} disabled={!editing}
                    onChange={e => setForm({...form, country: e.target.value})}
                    className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none bg-white disabled:text-[#4A6355] text-[#1A2E25]">
                    <option>Cameroun</option>
                    <option>Sénégal</option>
                    <option>Nigeria</option>
                    <option>Ghana</option>
                    <option>Côte d'Ivoire</option>
                    <option>Kenya</option>
                    <option>Éthiopie</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMMANDES */}
        {tab === 'orders' && (
          <div className="bg-white rounded-2xl border border-[#DDE8E2] overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-[#DDE8E2] flex items-center justify-between">
              <h2 className="font-bold text-[#1A2E25] text-sm sm:text-base">📦 Mes commandes</h2>
              <button onClick={() => navigate('/dashboard')}
                className="text-xs text-[#0C6B4E] font-semibold hover:underline">
                Voir tout →
              </button>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-3xl mb-2">📦</div>
                <p className="text-sm text-[#8AADA0]">Aucune commande pour le moment</p>
              </div>
            ) : (
              <div className="divide-y divide-[#DDE8E2]">
                {recentOrders.map((o, i) => {
                  const orderId = o._id || o.id || ''
                  const displayId = typeof orderId === 'string' && orderId.length > 8
                    ? orderId.slice(-8).toUpperCase()
                    : orderId
                  const amount = o.totalAmount || o.montant || o.total || 0
                  const status = o.status || ''
                  const productName = o.items?.[0]?.name || o.product || (o.items ? `${o.items.length} produit(s)` : 'Commande')
                  const createdAt = o.createdAt || o.date
                  const date = createdAt
                    ? new Date(createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
                    : ''
                  return (
                    <div key={orderId || i} className="px-5 sm:px-6 py-4 flex items-center gap-4 hover:bg-[#F5F7F5] transition">
                      <ShoppingBag size={18} className="text-[#0C6B4E]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A2E25] truncate">{productName}</p>
                        <p className="text-xs text-[#8AADA0]">{displayId} • {date}</p>
                      </div>
                      <span className="text-sm font-bold text-[#D95030] whitespace-nowrap">{amount.toLocaleString()} FCFA</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap ${STATUS_STYLE[status] || 'bg-gray-100 text-gray-600'}`}>
                        {status}
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
            <div className="bg-white rounded-2xl border border-[#DDE8E2] p-5 sm:p-6">
              <h2 className="font-bold text-[#1A2E25] mb-4 sm:mb-5 flex items-center gap-2 text-sm sm:text-base">
                <Lock size={18} className="text-[#0C6B4E]" /> Changer le mot de passe
              </h2>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Mot de passe actuel</label>
                  <input type="password" placeholder="••••••••"
                    className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Nouveau mot de passe</label>
                  <input type="password" placeholder="Minimum 8 caractères"
                    className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Confirmer</label>
                  <input type="password" placeholder="Retapez le mot de passe"
                    className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E]" />
                </div>
                <button className="bg-[#0C6B4E] hover:bg-[#18A070] text-white font-bold px-6 py-3 rounded-xl transition text-sm">
                  Mettre à jour le mot de passe
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-red-200 p-5 sm:p-6">
              <h2 className="font-bold text-red-600 mb-2 flex items-center gap-2 text-sm sm:text-base">
                <LogOut size={18} /> Déconnexion
              </h2>
              <p className="text-sm text-[#8AADA0] mb-4">Déconnectez-vous de votre compte AgroAfrica.</p>
              <button onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition text-sm">
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
