import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLivreurs, registerLivreur } from '../api/livreurApi'
import Avatar from '../components/Avatar'
import { 
  ArrowLeft, Truck, MapPin, Phone, Star, 
  CheckCircle, Clock, AlertCircle, Loader,
  Shield, Users, Bike, Car, Award
} from 'lucide-react'

// ✅ Configuration des véhicules
const VEHICLES = [
  { value: 'moto-taxi', label: '🛵 Moto-taxi' },
  { value: 'moto', label: '🏍️ Moto personnelle' },
  { value: 'velo', label: '🚲 Vélo' },
  { value: 'voiture', label: '🚗 Voiture' },
]

// ✅ Carte d'un livreur
function LivreurCard({ livreur, onContact }) {
  const lien = `https://wa.me/${livreur.phone || '237000000000'}?text=Bonjour ${encodeURIComponent(livreur.name)}`

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 transition hover:shadow-md" 
         style={{ opacity: livreur.dispo ? 1 : 0.6 }}>
      <div className="flex items-center gap-3 mb-3">
        <Avatar user={livreur} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[var(--text-primary)] truncate">
            {livreur.name}
          </p>
          <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            {livreur.note || '4.5'} · {livreur.livraisons || 0} livraisons
          </p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap ${
          livreur.dispo 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        }`}>
          {livreur.dispo ? '🟢 Dispo' : '🔴 Occupé'}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
        <MapPin size={14} className="shrink-0" />
        <span>{livreur.zone || 'Zone non spécifiée'}</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-[var(--accent-secondary)]">
          Dès {livreur.tarif?.toLocaleString() || '0'} FCFA
        </span>
        {livreur.dispo && (
          <a 
            href={lien} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => onContact?.(livreur)}
            className="bg-[#25D366] hover:bg-[#1FB857] text-white text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1"
          >
            <Phone size={12} /> Contacter
          </a>
        )}
      </div>
    </div>
  )
}

// ✅ Formulaire d'inscription
function FormulaireInscription({ onSuccess }) {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    name: '', 
    phone: '', 
    zone: '', 
    moto: '', 
    tarif: ''
  })

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setError(null)
    
    // Validation
    if (!form.name.trim()) { setError('Nom requis'); return }
    if (!form.phone.trim()) { setError('Téléphone requis'); return }
    if (form.phone.trim().length < 8) { setError('Numéro invalide'); return }
    if (!form.zone.trim()) { setError('Zone requise'); return }
    if (!form.moto) { setError('Type de véhicule requis'); return }
    if (!form.tarif || Number(form.tarif) <= 0) { setError('Tarif valide requis'); return }

    setLoading(true)
    try {
      await registerLivreur(form)
      setSuccess(true)
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }, [form, onSuccess])

  if (success) {
    return (
      <div className="text-center py-10 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
        </div>
        <h3 className="font-extrabold text-[var(--text-primary)] mb-2">Demande envoyée ! 🎉</h3>
        <p className="text-sm text-[var(--text-secondary)]">On vous contacte dans 24h pour validation.</p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 max-w-lg mx-auto">
      <h2 className="font-bold text-[var(--text-primary)] mb-1 text-lg flex items-center gap-2">
        <Truck size={20} className="text-[var(--accent-secondary)]" />
        Devenez livreur AgroAfrica
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-5">Gagnez de l'argent en livrant dans votre quartier</p>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input 
          type="text" 
          placeholder="Nom complet" 
          required
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})}
          className="border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] placeholder-[var(--text-secondary)]/50"
        />

        <input 
          type="tel" 
          placeholder="Numéro WhatsApp" 
          required
          value={form.phone} 
          onChange={e => setForm({...form, phone: e.target.value})}
          className="border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] placeholder-[var(--text-secondary)]/50"
        />

        <input 
          type="text" 
          placeholder="Zone de livraison (ex: Yaoundé Centre)" 
          required
          value={form.zone} 
          onChange={e => setForm({...form, zone: e.target.value})}
          className="border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] placeholder-[var(--text-secondary)]/50"
        />

        <select 
          required 
          value={form.moto} 
          onChange={e => setForm({...form, moto: e.target.value})}
          className="border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
        >
          <option value="">Type de véhicule</option>
          {VEHICLES.map(v => (
            <option key={v.value} value={v.value}>{v.label}</option>
          ))}
        </select>

        <input 
          type="number" 
          placeholder="Tarif de base en FCFA" 
          required
          min="500"
          value={form.tarif} 
          onChange={e => setForm({...form, tarif: e.target.value})}
          className="border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] placeholder-[var(--text-secondary)]/50"
        />

        <button 
          type="submit" 
          disabled={loading}
          className="bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold py-3.5 rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader size={16} className="animate-spin" /> Envoi en cours...</>
          ) : (
            "📋 S'inscrire comme livreur"
          )}
        </button>
      </form>
    </div>
  )
}

// ✅ Statistiques de la plateforme
function StatsSection({ stats }) {
  const defaultStats = useMemo(() => [
    { value: stats?.total || '0', label: 'Livreurs actifs', icon: Users },
    { value: stats?.deliveries || '0', label: 'Livraisons effectuées', icon: Truck },
    { value: stats?.rating || '4.8', label: 'Note moyenne', icon: Star },
    { value: stats?.cities || '0', label: 'Villes couvertes', icon: MapPin },
  ], [stats])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {defaultStats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-3 text-center">
            <Icon size={18} className="mx-auto text-[var(--accent-secondary)] mb-1" />
            <p className="text-lg font-extrabold text-[var(--text-primary)]">{stat.value}</p>
            <p className="text-[10px] text-[var(--text-secondary)]">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}

function Livreur({ 
  className = '',
  showStats = true,
}) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('find')
  const [livreurs, setLivreurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)

  // ✅ Chargement des livreurs
  const loadLivreurs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getLivreurs()
      const list = Array.isArray(res) ? res : res?.livreurs || []
      setLivreurs(list)
      if (res?.stats) setStats(res.stats)
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur de chargement')
      setLivreurs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLivreurs()
  }, [loadLivreurs])

  // ✅ Contact d'un livreur
  const handleContact = useCallback((livreur) => {
    console.log('Contact:', livreur.name)
    // Analytics ou tracking
  }, [])

  // ✅ Livreurs disponibles
  const availableLivreurs = useMemo(() => {
    return livreurs.filter(l => l.dispo !== false)
  }, [livreurs])

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-5 py-6 sm:py-8 ${className}`}>
      {/* Retour */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-[var(--accent-primary)] font-semibold mb-5 hover:underline text-sm transition"
      >
        <ArrowLeft size={16} /> Retour au marché
      </button>

      {/* En-tête */}
      <div className="relative bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-primary)]/80 rounded-3xl p-6 sm:p-8 text-center text-[var(--text-light)] mb-5 sm:mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="text-4xl sm:text-5xl mb-2">🛵</div>
          <h1 className="text-xl sm:text-2xl font-extrabold mb-1">
            Livraison Communautaire
          </h1>
          <p className="text-[var(--text-light)]/70 text-xs sm:text-sm">
            Des livreurs locaux dans chaque quartier
          </p>
        </div>
      </div>

      {/* Statistiques */}
      {showStats && <StatsSection stats={stats} />}

      {/* Onglets */}
      <div className="flex bg-[var(--bg-secondary)] rounded-xl p-1 mb-4 sm:mb-5">
        <button 
          onClick={() => setTab('find')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${
            tab === 'find' 
              ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow' 
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Trouver un livreur
        </button>
        <button 
          onClick={() => setTab('register')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${
            tab === 'register' 
              ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow' 
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Devenir livreur
        </button>
      </div>

      {/* Contenu */}
      {tab === 'find' && (
        <>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size={32} className="text-[var(--accent-primary)] animate-spin" />
              <p className="text-sm text-[var(--text-secondary)] mt-4">Chargement des livreurs...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
              <AlertCircle size={32} className="text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button 
                onClick={loadLivreurs}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition"
              >
                Réessayer
              </button>
            </div>
          ) : livreurs.length === 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-10 text-center">
              <div className="text-4xl mb-3">🛵</div>
              <p className="font-bold text-[var(--text-primary)]">Aucun livreur disponible</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Soyez le premier à rejoindre la communauté !</p>
              <button 
                onClick={() => setTab('register')}
                className="mt-4 bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold px-6 py-2.5 rounded-xl text-sm transition"
              >
                Devenir livreur
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[var(--text-secondary)]">
                  {availableLivreurs.length} livreur{availableLivreurs.length > 1 ? 's' : ''} disponible{availableLivreurs.length > 1 ? 's' : ''}
                </p>
                <button 
                  onClick={loadLivreurs}
                  className="text-xs text-[var(--accent-primary)] hover:underline"
                >
                  🔄 Actualiser
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {livreurs.map(l => (
                  <LivreurCard 
                    key={l._id || l.id} 
                    livreur={l} 
                    onContact={handleContact}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {tab === 'register' && (
        <FormulaireInscription onSuccess={loadLivreurs} />
      )}
    </div>
  )
}

export default Livreur