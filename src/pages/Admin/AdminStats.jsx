import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  TrendingUp, ShoppingBag, Percent, Star, BarChart3, PieChart,
  RefreshCw, Loader, AlertCircle, Users, Package, Clock
} from 'lucide-react'
import { getDashboardStats, getSalesByMonth, getTopProducts } from '../../api/adminApi'

// ✅ Configuration des KPI
const KPI_CONFIG = [
  { 
    key: 'revenue',
    label: "Chiffre d'affaires", 
    unit: 'FCFA', 
    icon: TrendingUp, 
    color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-400',
  },
  { 
    key: 'avgOrder',
    label: 'Panier moyen', 
    unit: 'FCFA', 
    icon: ShoppingBag, 
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-400',
  },
  { 
    key: 'conversion',
    label: 'Taux de conversion', 
    unit: '%', 
    icon: Percent, 
    color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-400',
  },
  { 
    key: 'satisfaction',
    label: 'Taux de satisfaction', 
    unit: '/5', 
    icon: Star, 
    color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-400',
  },
]

// ✅ Graphiques config
const CHART_CONFIG = [
  { 
    key: 'sales',
    title: '📊 Évolution des ventes (6 mois)', 
    icon: BarChart3 
  },
  { 
    key: 'categories',
    title: '🌿 Ventes par catégorie', 
    icon: PieChart 
  },
  { 
    key: 'countries',
    title: '🌍 Top pays par revenu', 
    icon: BarChart3 
  },
  { 
    key: 'products',
    title: '🏆 Top 5 produits', 
    icon: BarChart3 
  },
]

function AdminStats({ 
  refreshInterval = 60000,
  onDataLoaded,
}) {
  const [stats, setStats] = useState(null)
  const [salesData, setSalesData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [period, setPeriod] = useState('month') // month, quarter, year

  // ✅ Chargement des données
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Charger les stats en parallèle
      const [statsRes, salesRes, productsRes] = await Promise.all([
        getDashboardStats(),
        getSalesByMonth(period),
        getTopProducts(5)
      ])
      
      setStats(statsRes)
      setSalesData(salesRes || [])
      setTopProducts(productsRes || [])
      setLastUpdated(new Date())
      
      if (onDataLoaded) {
        onDataLoaded({ stats: statsRes, sales: salesRes, products: productsRes })
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }, [period, onDataLoaded])

  // ✅ Auto-refresh
  useEffect(() => {
    fetchData()
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  // ✅ Formatage des KPI
  const kpis = useMemo(() => {
    if (!stats) {
      return KPI_CONFIG.map(config => ({
        ...config,
        value: '—',
        trend: '—',
        pending: true,
      }))
    }
    
    return KPI_CONFIG.map(config => {
      const value = stats[config.key]
      const trend = stats[`${config.key}_trend`]
      
      return {
        ...config,
        value: value ?? '—',
        trend: trend ? `↑ ${trend}%` : '—',
        pending: false,
      }
    })
  }, [stats])

  // ✅ Formatage du prix
  const formatPrice = useCallback((value) => {
    if (value === null || value === undefined) return '—'
    if (typeof value === 'number') {
      return value.toLocaleString()
    }
    return value
  }, [])

  // ✅ Vérifier si des données existent
  const hasData = useMemo(() => {
    if (!stats) return false
    return Object.values(stats).some(v => v > 0)
  }, [stats])

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader size={32} className="text-[var(--accent-primary)] animate-spin" />
        <p className="text-sm text-[var(--text-secondary)] mt-4">Chargement des statistiques...</p>
      </div>
    )
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 sm:mb-7">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mb-1">
            Statistiques
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Analyse détaillée de la plateforme AgroAfrica
            {lastUpdated && (
              <span className="ml-2 text-xs text-[var(--text-secondary)]/60">
                · Mis à jour à {lastUpdated.toLocaleTimeString('fr-FR')}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Période */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] outline-none focus:border-[var(--accent-primary)]"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition disabled:opacity-50"
            aria-label="Rafraîchir"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Bandeau "données en attente" */}
      {!hasData && !loading && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <BarChart3 size={20} className="text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-800 dark:text-blue-400">📊 Données en cours de collecte</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Les graphiques se rempliront automatiquement dès les premières transactions validées.
            </p>
          </div>
        </div>
      )}

      {/* KPI PRINCIPAUX */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon
          const isPending = kpi.pending || kpi.value === '—'
          
          return (
            <div 
              key={index} 
              className={`rounded-2xl p-4 sm:p-5 border ${kpi.color} transition hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon size={20} className={kpi.textColor} />
                {isPending && (
                  <Clock size={12} className="text-[var(--text-secondary)] animate-pulse" />
                )}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                {typeof kpi.value === 'number' ? formatPrice(kpi.value) : kpi.value}
                {kpi.unit && (
                  <span className="text-xs sm:text-sm font-normal text-[var(--text-secondary)] ml-1">
                    {kpi.unit}
                  </span>
                )}
              </div>
              <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] mt-0.5">
                {kpi.label}
              </div>
              <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium mt-2">
                {isPending ? '— en attente' : kpi.trend}
              </div>
            </div>
          )
        })}
      </div>

      {/* GRAPHIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {CHART_CONFIG.map((chart) => {
          const Icon = chart.icon
          const hasChartData = hasData && salesData.length > 0
          
          return (
            <div 
              key={chart.key} 
              className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 sm:p-6 min-h-[280px] flex flex-col"
            >
              <h3 className="font-bold text-[var(--text-primary)] mb-4 text-sm sm:text-base">
                {chart.title}
              </h3>
              
              {hasChartData ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full">
                    {/* ✅ Graphique simple (barres) */}
                    <div className="flex items-end justify-between h-40 gap-2">
                      {salesData.slice(0, 6).map((item, idx) => {
                        const height = Math.max(10, (item.value / Math.max(...salesData.map(d => d.value))) * 100)
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-[var(--accent-primary)]/20 rounded-t-lg transition-all duration-500"
                              style={{ height: `${height}%` }}
                            >
                              <div 
                                className="w-full bg-[var(--accent-primary)] rounded-t-lg"
                                style={{ height: `${height * 0.7}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-[var(--text-secondary)] mt-1">
                              {item.label || item.month || `M${idx + 1}`}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="text-center text-xs text-[var(--text-secondary)] mt-4">
                      {salesData.length} données disponibles
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <Icon size={48} className="text-[var(--text-secondary)]/20 mb-3" />
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Données en attente
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Les graphiques apparaîtront ici dès les premières commandes.
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* TOP PRODUITS */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 sm:p-6">
        <h3 className="font-bold text-[var(--text-primary)] mb-4 text-sm sm:text-base">
          🏆 Top produits
        </h3>
        
        {topProducts.length > 0 ? (
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-3 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--border-color)] transition"
              >
                <span className="text-2xl">{product.emoji || '📦'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {product.sales || 0} ventes
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--accent-secondary)]">
                    {formatPrice(product.revenue)} FCFA
                  </p>
                  {product.trend && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      ↑ {product.trend}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--bg-secondary)] rounded-xl p-8 text-center">
            <Package size={32} className="mx-auto text-[var(--text-secondary)]/30 mb-2" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Aucun produit vendu pour le moment
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Les top produits apparaîtront après les premières ventes.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminStats