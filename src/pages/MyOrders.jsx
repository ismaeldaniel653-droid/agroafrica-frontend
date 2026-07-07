import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Package, Search, Eye, RotateCcw, Loader,
  Clock, CheckCircle, XCircle, Truck, AlertCircle,
  RefreshCw, Filter, ChevronRight
} from 'lucide-react'
import { getOrders } from '../api/orderApi'
import Avatar from '../components/Avatar'

// ✅ Configuration des statuts
const STATUS_CONFIG = {
  'livré': { 
    label: 'Livré', 
    style: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    icon: <CheckCircle size={12} />,
    order: 3
  },
  'en cours': { 
    label: 'En cours', 
    style: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    icon: <Clock size={12} />,
    order: 2
  },
  'confirmé': { 
    label: 'Confirmé', 
    style: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    icon: <CheckCircle size={12} />,
    order: 1
  },
  'annulé': { 
    label: 'Annulé', 
    style: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    icon: <XCircle size={12} />,
    order: 0
  },
}

const STATUS_ORDER = ['confirmé', 'en cours', 'livré']
const STATUS_FILTERS = ['all', ...Object.keys(STATUS_CONFIG)]

function MyOrders({ 
  className = '',
  refreshInterval = 30000,
  onOrderSelect,
}) {
  const navigate = useNavigate()
  
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // ✅ Chargement des commandes
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getOrders()
      const list = res?.orders ?? res ?? []
      setOrders(Array.isArray(list) ? list : [])
      setLastUpdated(new Date())
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur de chargement des commandes')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ Auto-refresh
  useEffect(() => {
    fetchOrders()
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchOrders, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchOrders, refreshInterval])

  // ✅ Filtrage
  const filtered = useMemo(() => {
    return orders.filter(order => {
      const product = order.product?.toLowerCase() || ''
      const id = order.id?.toLowerCase() || ''
      const status = order.status || 'confirmé'
      
      const matchesSearch = !search || 
        product.includes(search.toLowerCase()) || 
        id.includes(search.toLowerCase())
      
      const matchesFilter = filter === 'all' || status === filter
      
      return matchesSearch && matchesFilter
    })
  }, [orders, search, filter])

  // ✅ Statistiques
  const stats = useMemo(() => {
    const total = orders.length
    const totalSpent = orders
      .filter(o => o.status !== 'annulé')
      .reduce((s, o) => s + (o.total || 0), 0)
    const inProgress = orders.filter(o => o.status === 'en cours').length
    const delivered = orders.filter(o => o.status === 'livré').length
    
    return { total, totalSpent, inProgress, delivered }
  }, [orders])

  // ✅ Gestion du clic sur une commande
  const handleOrderClick = useCallback((order) => {
    if (onOrderSelect) {
      onOrderSelect(order)
    } else {
      navigate(`/payment-status/${(order.id || '').replace('#', '')}`)
    }
  }, [onOrderSelect, navigate])

  // ✅ Formatage du prix
  const formatPrice = useCallback((price) => {
    return price?.toLocaleString() || '0'
  }, [])

  // ✅ Rendu de la barre de progression
  const renderProgressBar = useCallback((status) => {
    const currentIndex = STATUS_ORDER.indexOf(status)
    if (currentIndex === -1) return null
    
    return (
      <div className="mt-4 flex items-center gap-1">
        {STATUS_ORDER.map((step, index) => {
          const isActive = currentIndex >= index
          const statusConfig = STATUS_CONFIG[step]
          return (
            <div key={step} className="flex-1 flex items-center gap-1">
              <div className={`
                h-1.5 flex-1 rounded-full transition-all duration-500
                ${isActive ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-secondary)]'}
              `} />
              {index < STATUS_ORDER.length - 1 && (
                <div className="w-1 h-1 rounded-full bg-[var(--bg-secondary)]" />
              )}
            </div>
          )
        })}
      </div>
    )
  }, [])

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader size={32} className="text-[var(--accent-primary)] animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Chargement de vos commandes...</p>
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

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
              Mes commandes
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {stats.total} commande{stats.total !== 1 ? 's' : ''} au total
              {stats.total > 0 && (
                <> • Total : <strong className="text-[var(--accent-primary)]">
                  {formatPrice(stats.totalSpent)} FCFA
                </strong></>
              )}
              {lastUpdated && (
                <span className="ml-2 text-[10px] text-[var(--text-secondary)]/60">
                  · {lastUpdated.toLocaleTimeString('fr-FR')}
                </span>
              )}
            </p>
          </div>
          
          {stats.inProgress > 0 && (
            <div className="bg-[var(--accent-primary)]/10 rounded-xl px-4 py-2 flex items-center gap-2 self-start border border-[var(--accent-primary)]/20">
              <Clock size={18} className="text-[var(--accent-primary)]" />
              <span className="text-sm font-bold text-[var(--accent-primary)]">
                {stats.inProgress} en cours
              </span>
            </div>
          )}
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchOrders}
              className="ml-auto text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Barre de recherche et filtres */}
        {orders.length > 0 && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 flex-1 max-w-md">
                <Search size={16} className="text-[var(--text-secondary)]" />
                <input 
                  type="text" 
                  placeholder="Rechercher une commande..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="outline-none text-sm flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 min-w-0"
                  aria-label="Rechercher une commande"
                />
              </div>
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition disabled:opacity-50"
                aria-label="Rafraîchir"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="flex gap-2 mb-5 flex-wrap">
              {STATUS_FILTERS.map((status) => {
                const config = STATUS_CONFIG[status]
                const isActive = filter === status
                const count = orders.filter(o => o.status === status).length
                
                return (
                  <button 
                    key={status} 
                    onClick={() => setFilter(status)}
                    className={`
                      px-3 sm:px-4 py-2 rounded-xl text-xs font-bold border transition
                      ${isActive 
                        ? 'bg-[var(--accent-primary)] text-[var(--text-light)] border-[var(--accent-primary)]' 
                        : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent-primary)]'
                      }
                    `}
                  >
                    {status === 'all' ? 'Toutes' : (config?.label || status)}
                    {count > 0 && status !== 'all' && (
                      <span className={`ml-1 ${isActive ? 'text-[var(--text-light)]/70' : 'text-[var(--text-secondary)]/70'}`}>
                        ({count})
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* LISTE DES COMMANDES */}
        <div className="space-y-3">
          {filtered.map((order, index) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG['confirmé']
            const isCancelled = order.status === 'annulé'
            
            return (
              <div 
                key={order._id || order.id || index} 
                className={`
                  bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] 
                  p-4 sm:p-5 hover:shadow-md transition cursor-pointer
                  ${isCancelled ? 'opacity-70' : ''}
                `}
                onClick={() => handleOrderClick(order)}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Avatar vendeur */}
                  <Avatar
                    user={{ 
                      name: order.seller, 
                      avatar: order.sellerAvatar, 
                      id: order.sellerId 
                    }}
                    size="lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs text-[var(--accent-primary)] font-bold">
                        #{order.id?.slice(-8) || '000000'}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg ${statusConfig.style}`}>
                        {statusConfig.icon} {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {order.product || 'Produit'}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      par {order.seller || 'Vendeur'} • {order.date || 'Date inconnue'}
                    </p>
                    {order.tracking && (
                      <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1">
                        <Truck size={10} /> {order.tracking}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right ml-auto flex-shrink-0">
                    <p className="text-sm sm:text-base font-extrabold text-[var(--accent-secondary)] whitespace-nowrap">
                      {formatPrice(order.total)} FCFA
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] mb-2">
                      x{order.qty || 1} • {order.payMethod || 'Mobile Money'}
                    </p>
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOrderClick(order)
                        }}
                        className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition p-1"
                        title="Suivi"
                        aria-label="Suivi de la commande"
                      >
                        <Eye size={14} />
                      </button>
                      {order.status === 'livré' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            // Recommander
                            navigate('/')
                          }}
                          className="text-[var(--text-secondary)] hover:text-amber-500 transition p-1"
                          title="Recommander"
                          aria-label="Recommander ce produit"
                        >
                          <RotateCcw size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Barre de progression */}
                {!isCancelled && renderProgressBar(order.status)}
              </div>
            )
          })}

          {/* État vide */}
          {orders.length === 0 && !loading && (
            <div className="text-center py-12 sm:py-16 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]">
              <div className="text-5xl mb-3">📦</div>
              <p className="font-bold text-[var(--text-primary)]">Aucune commande pour le moment</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1 mb-4">Commencez vos achats sur le marché !</p>
              <button 
                onClick={() => navigate('/')}
                className="bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold px-6 py-2 rounded-xl text-sm transition flex items-center gap-2 mx-auto"
              >
                Explorer le marché <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Aucun résultat */}
          {orders.length > 0 && filtered.length === 0 && (
            <div className="text-center py-10 text-sm text-[var(--text-secondary)]">
              <Search size={24} className="mx-auto text-[var(--text-secondary)]/30 mb-2" />
              Aucune commande ne correspond à votre recherche.
              <button 
                onClick={() => { setSearch(''); setFilter('all') }}
                className="block text-[var(--accent-primary)] hover:underline mt-1"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyOrders