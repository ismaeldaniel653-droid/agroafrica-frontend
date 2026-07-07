import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Users, Package, ShoppingBag, TrendingUp, ArrowUp, Sparkles, Loader2, 
  RefreshCw, AlertCircle, CheckCircle, XCircle 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ✅ Configuration des statistiques (structurée pour l'API)
const STATS_CONFIG = [
  { 
    key: 'revenue',
    label: 'Revenus totaux', 
    unit: 'FCFA', 
    icon: TrendingUp, 
    color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-400',
  },
  { 
    key: 'users',
    label: 'Utilisateurs', 
    unit: '', 
    icon: Users, 
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-400',
  },
  { 
    key: 'products',
    label: 'Produits actifs', 
    unit: '', 
    icon: Package, 
    color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-400',
  },
  { 
    key: 'orders',
    label: 'Commandes ce mois', 
    unit: '', 
    icon: ShoppingBag, 
    color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-400',
  },
]

const STATUS_STYLES = {
  'actif': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  'vérifié': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  'suspendu': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  'en_attente': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
}

function AdminDashboard({ 
  stats: initialStats = null,
  recentUsers: initialUsers = [],
  topProducts: initialProducts = [],
  activeCountries: initialCountries = [],
  isLoading = false,
  onRefresh,
  className = '',
}) {
  const navigate = useNavigate()
  const [stats, setStats] = useState(initialStats)
  const [recentUsers, setRecentUsers] = useState(initialUsers)
  const [topProducts, setTopProducts] = useState(initialProducts)
  const [activeCountries, setActiveCountries] = useState(initialCountries)
  const [loading, setLoading] = useState(isLoading)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // ✅ Mise à jour des données reçues
  useEffect(() => {
    if (initialStats) setStats(initialStats)
    if (initialUsers) setRecentUsers(initialUsers)
    if (initialProducts) setTopProducts(initialProducts)
    if (initialCountries) setActiveCountries(initialCountries)
    setLoading(isLoading)
  }, [initialStats, initialUsers, initialProducts, initialCountries, isLoading])

  // ✅ Rafraîchir les données
  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setLoading(true)
      setError(null)
      try {
        await onRefresh()
        setLastUpdated(new Date())
      } catch (err) {
        setError(err.message || 'Erreur lors du rafraîchissement')
      } finally {
        setLoading(false)
      }
    }
  }, [onRefresh])

  // ✅ Navigation
  const goToUsers = useCallback(() => navigate('/admin/users'), [navigate])
  const goToProducts = useCallback(() => navigate('/admin/products'), [navigate])

  // ✅ Formatage du prix
  const formatPrice = useCallback((value) => {
    return value?.toLocaleString() || '0'
  }, [])

  // ✅ Statistiques calculées
  const statsData = useMemo(() => {
    if (stats) {
      return STATS_CONFIG.map(config => ({
        ...config,
        value: stats[config.key] ?? 0,
        trend: stats[`${config.key}_trend`] || '+0%',
        pending: false,
      }))
    }
    return STATS_CONFIG.map(config => ({
      ...config,
      value: 0,
      trend: '+0%',
      pending: true,
    }))
  }, [stats])

  // ✅ Vérification des données vides
  const hasData = useMemo(() => {
    return stats && Object.values(stats).some(v => v > 0)
  }, [stats])

  return (
    <div className={`${className}`}>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-7">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mb-1 flex items-center gap-2">
            🌍 Tableau de bord
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Vue globale de la plateforme AgroAfrica
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--text-secondary)]">
            {lastUpdated.toLocaleTimeString('fr-FR')}
          </span>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition disabled:opacity-50"
            aria-label="Rafraîchir"
          >
            <RefreshCw size={16} className={`${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Erreur</p>
            <p className="text-xs text-red-600 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Bannière de lancement */}
      {!hasData && !loading && (
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <Sparkles size={20} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-400">🚀 Phase de lancement</p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              Les statistiques seront automatiquement actualisées dès le déploiement des premières commandes.
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 size={32} className="text-[var(--accent-primary)] animate-spin" />
        </div>
      )}

      {/* STATS */}
      {!loading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {statsData.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div 
                  key={i} 
                  className={`rounded-2xl p-4 sm:p-5 border ${stat.color} relative overflow-hidden transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={20} className={stat.textColor} />
                    {stat.pending && (
                      <Loader2 size={12} className="text-[var(--text-secondary)] animate-spin" />
                    )}
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                    {typeof stat.value === 'number' ? formatPrice(stat.value) : stat.value}
                    {stat.unit && (
                      <span className="text-xs sm:text-sm font-normal text-[var(--text-secondary)] ml-1">
                        {stat.unit}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] mt-0.5">
                    {stat.label}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium mt-2">
                    {stat.pending ? '— en attente' : `↑ ${stat.trend}`}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* NOUVEAUX UTILISATEURS */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-color)] flex justify-between items-center">
                <h2 className="font-bold text-[var(--text-primary)] text-sm sm:text-base">
                  👥 Nouveaux utilisateurs
                </h2>
                <button 
                  onClick={goToUsers}
                  className="text-xs text-[var(--accent-primary)] font-semibold hover:underline transition"
                >
                  Voir tout →
                </button>
              </div>
              <div className="divide-y divide-[var(--border-color)] max-h-72 overflow-y-auto">
                {recentUsers.length === 0 ? (
                  <Empty label="Aucun utilisateur inscrit pour le moment" />
                ) : (
                  recentUsers.map((user, i) => (
                    <div key={i} className="px-4 sm:px-6 py-3 flex items-center gap-3 hover:bg-[var(--bg-secondary)] transition">
                      <div className="w-8 h-8 bg-[var(--accent-primary)] rounded-full flex items-center justify-center text-[var(--text-light)] text-xs font-bold shrink-0">
                        {user.name?.[0] || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                          {user.name || 'Inconnu'}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] truncate">
                          {user.email || 'Email non renseigné'}
                        </p>
                      </div>
                      <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">
                        {user.country || '—'}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg whitespace-nowrap ${STATUS_STYLES[user.status] || STATUS_STYLES['en_attente']}`}>
                        {user.status || 'en_attente'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* TOP PRODUITS */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-color)] flex justify-between items-center">
                <h2 className="font-bold text-[var(--text-primary)] text-sm sm:text-base">
                  🏆 Top produits
                </h2>
                <button 
                  onClick={goToProducts}
                  className="text-xs text-[var(--accent-primary)] font-semibold hover:underline transition"
                >
                  Voir tout →
                </button>
              </div>
              <div className="divide-y divide-[var(--border-color)] max-h-72 overflow-y-auto">
                {topProducts.length === 0 ? (
                  <Empty label="Aucun produit vendu pour le moment" />
                ) : (
                  topProducts.map((product, i) => (
                    <div key={i} className="px-4 sm:px-6 py-3 flex items-center gap-3 hover:bg-[var(--bg-secondary)] transition">
                      <span className="text-xl sm:text-2xl">{product.emoji || '📦'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                          {product.name || 'Produit'}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {product.sales || 0} ventes
                        </p>
                      </div>
                      <span className="text-sm font-bold text-[var(--accent-secondary)] whitespace-nowrap">
                        {formatPrice(product.revenue)} FCFA
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* PAYS ACTIFS */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 sm:p-6">
            <h2 className="font-bold text-[var(--text-primary)] mb-4 text-sm sm:text-base">
              🌍 Pays actifs sur la plateforme
            </h2>
            {activeCountries.length === 0 ? (
              <Empty label="Aucun pays actif pour le moment" />
            ) : (
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {activeCountries.map((country, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm ${country.color || 'border-[var(--border-color)]'}`}
                  >
                    <span>{country.flag || '🌍'}</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {country.name || 'Pays'}
                    </span>
                    <span className="text-[var(--text-secondary)] text-[10px] sm:text-xs">
                      · {country.users || 0} users
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ✅ Composant pour les états vides
function Empty({ label }) {
  return (
    <div className="px-4 sm:px-6 py-8 sm:py-10 text-center">
      <p className="text-3xl mb-2 opacity-50">📊</p>
      <p className="text-xs sm:text-sm text-[var(--text-secondary)]">{label}</p>
    </div>
  )
}

// ✅ Version avec chargement automatique des données
export const AdminDashboardWithData = ({ apiBaseUrl, ...props }) => {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${apiBaseUrl}/admin/dashboard`)
      if (!response.ok) throw new Error('Erreur de chargement')
      const data = await response.json()
      
      setStats(data.stats || {})
      setUsers(data.recentUsers || [])
      setProducts(data.topProducts || [])
      setCountries(data.activeCountries || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [apiBaseUrl])

  useEffect(() => {
    if (apiBaseUrl) {
      fetchData()
    }
  }, [apiBaseUrl, fetchData])

  return (
    <AdminDashboard
      stats={stats}
      recentUsers={users}
      topProducts={products}
      activeCountries={countries}
      isLoading={loading}
      error={error}
      onRefresh={fetchData}
      {...props}
    />
  )
}

export default AdminDashboard