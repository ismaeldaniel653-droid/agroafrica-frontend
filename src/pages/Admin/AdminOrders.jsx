import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Search, Eye, CheckCircle, XCircle, Clock, Inbox, Loader, 
  ChevronDown, RefreshCw, AlertCircle, TrendingUp, Filter
} from 'lucide-react'
import { getOrders, updateOrderStatus } from '../../api/orderApi'

// ✅ Configuration des statuts
const STATUS_CONFIG = {
  'livré': { 
    label: 'Livré', 
    style: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    icon: <CheckCircle size={12} /> 
  },
  'en cours': { 
    label: 'En cours', 
    style: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    icon: <Clock size={12} /> 
  },
  'confirmé': { 
    label: 'Confirmé', 
    style: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    icon: <CheckCircle size={12} /> 
  },
  'annulé': { 
    label: 'Annulé', 
    style: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    icon: <XCircle size={12} /> 
  },
  'en_attente': { 
    label: 'En attente', 
    style: 'bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-400',
    icon: <Clock size={12} /> 
  },
}

const STATUS_OPTIONS = ['confirmé', 'en cours', 'livré', 'annulé', 'en_attente']

// ✅ Statistiques rapides
const STATS_CARDS = [
  { key: 'livré', label: 'Livrées', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
  { key: 'en cours', label: 'En cours', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
  { key: 'confirmé', label: 'Confirmées', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  { key: 'annulé', label: 'Annulées', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
]

function AdminOrders({ 
  onOrderSelect,
  refreshInterval = 30000, // ✅ Auto-refresh toutes les 30s
}) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilter] = useState('all')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // ✅ Chargement des commandes
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getOrders()
      const list = res?.orders ?? res?.data ?? res ?? []
      setOrders(Array.isArray(list) ? list : [])
      setLastUpdated(new Date())
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors du chargement des commandes')
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

  // ✅ Filtrage des commandes
  const filtered = useMemo(() => {
    return orders.filter(o => {
      const client = o.buyer?.name || o.client || ''
      const id = o._id || o.id || ''
      const status = o.status || ''
      
      const matchesSearch = !search || 
        client.toLowerCase().includes(search.toLowerCase()) || 
        id.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || status === filterStatus
      
      return matchesSearch && matchesStatus
    })
  }, [orders, search, filterStatus])

  // ✅ Statistiques
  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'payé' || o.status === 'livré')
      .reduce((s, o) => s + (o.totalAmount || o.montant || 0), 0)
    
    const countByStatus = (status) => orders.filter(o => o.status === status).length
    
    return { totalRevenue, countByStatus }
  }, [orders])

  // ✅ Mise à jour du statut
  const handleStatusUpdate = useCallback(async (order, newStatus) => {
    const id = order._id || order.id
    if (!id) return
    
    setUpdating(id)
    setError(null)
    
    try {
      await updateOrderStatus(id, newStatus)
      await fetchOrders()
    } catch (err) {
      setError(err?.response?.data?.message || '❌ Erreur lors de la mise à jour')
    } finally {
      setUpdating(null)
    }
  }, [fetchOrders])

  // ✅ Formatage des dates
  const formatDate = useCallback((date) => {
    if (!date) return '—'
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }, [])

  // ✅ Formatage de l'ID
  const formatOrderId = useCallback((id) => {
    if (!id) return '—'
    if (typeof id === 'string' && id.length > 8) {
      return id.slice(-8).toUpperCase()
    }
    return id
  }, [])

  // ✅ Gestion du clic sur une commande
  const handleOrderClick = useCallback((order) => {
    if (onOrderSelect) {
      onOrderSelect(order)
    }
  }, [onOrderSelect])

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader size={32} className="text-[var(--accent-primary)] animate-spin" />
        <p className="text-sm text-[var(--text-secondary)] mt-4">Chargement des commandes...</p>
      </div>
    )
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
            Commandes
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {orders.length} commande{orders.length > 1 ? 's' : ''} au total
            {lastUpdated && (
              <span className="ml-2 text-xs text-[var(--text-secondary)]/60">
                · Mis à jour à {lastUpdated.toLocaleTimeString('fr-FR')}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[var(--accent-primary)]/10 rounded-xl px-4 py-2 border border-[var(--accent-primary)]/20">
            <p className="text-xs text-[var(--text-secondary)]">Revenu total</p>
            <p className="text-lg font-extrabold text-[var(--accent-secondary)]">
              {stats.totalRevenue.toLocaleString()} FCFA
            </p>
          </div>
          <button
            onClick={fetchOrders}
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

      {/* STATS RAPIDES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-5 sm:mb-6">
        {STATS_CARDS.map((stat) => (
          <div 
            key={stat.key} 
            className={`rounded-xl border p-3 ${stat.bg} transition hover:shadow-md`}
          >
            <p className={`text-2xl font-extrabold ${stat.color}`}>
              {stats.countByStatus(stat.key)}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* FILTRES */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-5">
        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 sm:px-4 py-2 w-full sm:max-w-xs">
          <Search size={16} className="text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Rechercher par client ou n° commande..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none text-sm flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 min-w-0"
            aria-label="Rechercher une commande"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide w-full sm:w-auto">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition whitespace-nowrap
              ${filterStatus === 'all' 
                ? 'bg-[var(--accent-primary)] text-[var(--text-light)] border-[var(--accent-primary)]' 
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent-primary)]'
              }`}
          >
            Toutes
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition whitespace-nowrap
                ${filterStatus === status 
                  ? 'bg-[var(--accent-primary)] text-[var(--text-light)] border-[var(--accent-primary)]' 
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent-primary)]'
                }`}
            >
              {STATUS_CONFIG[status]?.label || status}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE ou EMPTY STATE */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 sm:p-16 text-center">
            <Inbox size={48} className="mx-auto text-[var(--text-secondary)]/30 mb-3" />
            <p className="text-sm sm:text-base font-semibold text-[var(--text-primary)] mb-1">
              Aucune commande
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {orders.length === 0 
                ? 'Les commandes apparaîtront ici dès qu\'elles seront passées.' 
                : 'Aucune commande ne correspond à votre recherche.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    N° Commande
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Produits
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Paiement
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filtered.map((order, index) => {
                  const orderId = order._id || order.id || `ORD-${String(index + 1).padStart(4, '0')}`
                  const clientName = order.buyer?.name || order.client || '—'
                  const clientCountry = order.buyer?.country || order.country || ''
                  const productCount = order.items?.length || order.produits || 0
                  const amount = order.totalAmount || order.montant || 0
                  const payMethod = order.paymentMethod || order.payMethod || '—'
                  const status = order.status || 'en_attente'
                  const isUpdating = updating === orderId
                  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG['en_attente']

                  return (
                    <tr 
                      key={orderId} 
                      className="hover:bg-[var(--bg-secondary)] transition cursor-pointer"
                      onClick={() => handleOrderClick(order)}
                    >
                      <td className="px-4 sm:px-5 py-4 font-mono text-xs text-[var(--accent-primary)] font-bold">
                        #{formatOrderId(orderId)}
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {clientName}
                          </p>
                          {clientCountry && (
                            <p className="text-xs text-[var(--text-secondary)]">{clientCountry}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm text-[var(--text-secondary)]">
                        {typeof productCount === 'number' 
                          ? `${productCount} produit${productCount > 1 ? 's' : ''}` 
                          : productCount || '—'}
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm font-bold text-[var(--accent-secondary)]">
                        {amount.toLocaleString()} FCFA
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                          {payMethod}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-xs text-[var(--text-secondary)]">
                        {formatDate(order.createdAt || order.date)}
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${statusConfig.style}`}>
                          {statusConfig.icon} {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <select
                            value={status}
                            onChange={(e) => handleStatusUpdate(order, e.target.value)}
                            disabled={isUpdating}
                            className="text-xs border border-[var(--border-color)] rounded-lg px-2 py-1 bg-[var(--bg-card)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] disabled:opacity-50 cursor-pointer"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {STATUS_CONFIG[s]?.label || s}
                              </option>
                            ))}
                          </select>
                          {isUpdating && (
                            <Loader size={12} className="text-[var(--accent-primary)] animate-spin ml-1" />
                          )}
                          <button 
                            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition p-1.5 ml-1"
                            title="Voir détails"
                            aria-label="Voir détails"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer avec nombre de résultats */}
      {filtered.length > 0 && (
        <div className="mt-4 text-xs text-[var(--text-secondary)] text-center">
          {filtered.length} commande{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}
          {filtered.length !== orders.length && ` sur ${orders.length}`}
        </div>
      )}
    </div>
  )
}

export default AdminOrders