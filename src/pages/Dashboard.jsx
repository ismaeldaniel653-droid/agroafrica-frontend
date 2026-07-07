import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PriceSuggestion from '../components/PriceSuggestion'
import {
  LayoutDashboard, Package as PackageIcon, ShoppingBag,
  Star, TrendingUp, Plus, X, Menu as MenuIcon,
  Eye, Edit, Trash2, RefreshCw, AlertCircle,
  ChevronRight, Clock, Users, DollarSign
} from 'lucide-react'
import Avatar from '../components/Avatar'
import { getSellerStats, getSellerProducts, getSellerOrders, getSellerReviews } from '../api/sellerApi'

// ✅ Configuration des statuts
const STATUS_CONFIG = {
  'livré': { label: 'Livré', style: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  'en cours': { label: 'En cours', style: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  'confirmé': { label: 'Confirmé', style: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  'annulé': { label: 'Annulé', style: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  'actif': { label: 'Actif', style: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  'rupture': { label: 'Rupture', style: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
  'brouillon': { label: 'Brouillon', style: 'bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400' },
}

// ✅ Configuration du menu
const MENU = [
  { key: 'overview', icon: LayoutDashboard, label: 'Vue générale' },
  { key: 'products', icon: PackageIcon, label: 'Mes produits' },
  { key: 'orders', icon: ShoppingBag, label: 'Commandes' },
  { key: 'reviews', icon: Star, label: 'Avis clients' },
  { key: 'stats', icon: TrendingUp, label: 'Statistiques' },
]

function Dashboard({ 
  className = '',
  refreshInterval = 30000,
}) {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  
  const [tab, setTab] = useState('overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)

  // ✅ Chargement des données
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [statsRes, productsRes, ordersRes, reviewsRes] = await Promise.all([
        getSellerStats(),
        getSellerProducts(),
        getSellerOrders(),
        getSellerReviews()
      ])
      
      setStats(statsRes?.stats || statsRes || [])
      setProducts(productsRes?.products || productsRes || [])
      setOrders(ordersRes?.orders || ordersRes || [])
      setReviews(reviewsRes?.reviews || reviewsRes || [])
      setLastUpdated(new Date())
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur de chargement des données')
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ Auto-refresh
  useEffect(() => {
    loadData()
    
    if (refreshInterval > 0) {
      const interval = setInterval(loadData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [loadData, refreshInterval])

  // ✅ Calculs mémorisés
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.montant || 0), 0)
  }, [orders])

  const outOfStockProducts = useMemo(() => {
    return products.filter(p => p.status === 'rupture' || (p.stock || 0) === 0)
  }, [products])

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5)
  }, [orders])

  // ✅ Rendu du bouton de menu
  const MenuButton = useCallback(({ item }) => {
    const Icon = item.icon
    const isActive = tab === item.key
    
    return (
      <button
        onClick={() => { setTab(item.key); setMobileOpen(false) }}
        className={`
          w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition
          ${isActive
            ? 'bg-white/15 text-white shadow-md'
            : 'text-white/60 hover:bg-white/10 hover:text-white'
          }
        `}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon size={18} className={isActive ? 'text-amber-400' : ''} />
        {item.label}
        {isActive && (
          <span className="ml-auto w-1 h-6 bg-amber-400 rounded-full" />
        )}
      </button>
    )
  }, [tab])

  // ✅ Formatage du prix
  const formatPrice = useCallback((value) => {
    return value?.toLocaleString() || '0'
  }, [])

  if (loading && !stats.length && !products.length) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-[var(--bg-secondary)] flex relative ${className}`}>
      {/* Bouton hamburger mobile */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 bg-[var(--accent-primary)] text-[var(--text-light)] p-2.5 rounded-xl shadow-lg"
        aria-label="Ouvrir le menu"
      >
        <MenuIcon size={20} />
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300
        w-64 lg:w-60 bg-[var(--accent-primary)] min-h-screen flex flex-col flex-shrink-0
        fixed lg:sticky top-0 left-0 z-50 lg:z-auto
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xl font-extrabold text-[var(--text-light)]">
              🌿 Agro<span className="text-amber-400">Africa</span>
            </div>
            <div className="text-xs text-white/50 mt-0.5">Tableau de bord vendeur</div>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white/70 hover:text-white transition"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profil vendeur */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
          <Avatar
            user={{ name: user?.name || 'Vendeur', avatar: user?.avatar }}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[var(--text-light)] text-sm font-bold truncate">
              {user?.name || 'Mon compte'}
            </p>
            <p className="text-white/50 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              Vendeur certifié
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {MENU.map(item => (
            <MenuButton key={item.key} item={item} />
          ))}
        </nav>

        {/* Bas de sidebar */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition"
          >
            Retour au marché
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Erreur */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 flex items-center gap-2 animate-fade-in">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="pt-12 lg:pt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                Bonjour {user?.name?.split(' ')[0] || 'à vous'} 👋
              </h1>
              {lastUpdated && (
                <span className="text-xs text-[var(--text-secondary)]">
                  Dernière mise à jour : {lastUpdated.toLocaleTimeString('fr-FR')}
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-6 sm:mb-7">
              Voici un résumé de votre activité.
            </p>

            {/* Stats */}
            {stats.length === 0 ? (
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-8 text-center mb-6 sm:mb-8">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm text-[var(--text-secondary)]">Aucune statistique pour le moment</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Vos données apparaîtront dès vos premières ventes</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 border border-[var(--border-color)] hover:shadow-md transition">
                    <div className="text-2xl sm:text-3xl mb-2">{stat.icon || '📈'}</div>
                    <div className="text-base sm:text-xl font-extrabold text-[var(--text-primary)]">
                      {stat.value}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5">{stat.label}</div>
                    {stat.trend && (
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                        ↑ {stat.trend}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Price Suggestion */}
            <div className="mb-6"><PriceSuggestion /></div>

            {/* Dernières commandes */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden mb-6">
              <div className="px-4 sm:px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
                <h2 className="font-bold text-[var(--text-primary)] text-sm sm:text-base flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[var(--accent-primary)]" />
                  Dernières commandes
                </h2>
                <button 
                  onClick={() => setTab('orders')}
                  className="text-xs text-[var(--accent-primary)] font-semibold hover:underline flex items-center gap-1"
                >
                  Voir tout <ChevronRight size={14} />
                </button>
              </div>
              
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">📦</div>
                  <p className="text-sm text-[var(--text-secondary)]">Aucune commande pour le moment</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-color)]">
                  {recentOrders.map((order, index) => {
                    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG['en cours']
                    return (
                      <div key={order._id || order.id || index} className="px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-4 flex-wrap hover:bg-[var(--bg-secondary)] transition">
                        <span className="font-mono text-xs text-[var(--text-secondary)] w-20 sm:w-auto">
                          #{order.id?.slice(-6) || '000000'}
                        </span>
                        <Avatar user={{ name: order.client, avatar: order.clientAvatar }} size="sm" />
                        <span className="text-sm font-semibold flex-1 min-w-[80px] text-[var(--text-primary)]">
                          {order.client}
                        </span>
                        <span className="text-sm text-[var(--text-secondary)] flex-1 min-w-[80px]">
                          {order.produit}
                        </span>
                        <span className="text-sm font-bold text-[var(--accent-secondary)]">
                          {formatPrice(order.montant)} FCFA
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${statusConfig.style}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Rupture de stock */}
            {outOfStockProducts.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 sm:p-5">
                <h3 className="font-bold text-red-700 dark:text-red-400 mb-3 text-sm sm:text-base flex items-center gap-2">
                  <AlertCircle size={18} /> Produits en rupture de stock
                </h3>
                <div className="space-y-2">
                  {outOfStockProducts.map((product, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-white dark:bg-[var(--bg-card)] rounded-xl">
                      <span className="text-xl sm:text-2xl">{product.emoji || '📦'}</span>
                      <span className="text-sm font-semibold text-[var(--text-primary)] flex-1">
                        {product.name}
                      </span>
                      <button 
                        onClick={() => navigate(`/edit-product/${product._id || product.id}`)}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-semibold transition"
                      >
                        Réapprovisionner
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PRODUITS */}
        {tab === 'products' && (
          <div className="pt-12 lg:pt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                Mes Produits
              </h1>
              <button 
                onClick={() => navigate('/add-product')}
                className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold px-5 py-2.5 rounded-xl text-sm transition active:scale-[0.98]"
              >
                <Plus size={16} /> Ajouter un produit
              </button>
            </div>

            {products.length === 0 ? (
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-10 text-center">
                <div className="text-4xl mb-3">🌿</div>
                <p className="font-bold text-[var(--text-primary)]">Aucun produit pour le moment</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1 mb-4">Commencez par ajouter votre premier produit</p>
                <button 
                  onClick={() => navigate('/add-product')}
                  className="bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold px-6 py-2.5 rounded-xl text-sm transition"
                >
                  + Ajouter un produit
                </button>
              </div>
            ) : (
              <>
                {/* Version mobile (cards) */}
                <div className="lg:hidden space-y-3">
                  {products.map((product, index) => {
                    const statusConfig = STATUS_CONFIG[product.status] || STATUS_CONFIG['actif']
                    return (
                      <div key={product._id || product.id || index} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{product.emoji || '📦'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[var(--text-primary)] truncate">{product.name}</p>
                            <p className="text-xs font-bold text-[var(--accent-secondary)]">
                              {formatPrice(product.price)} FCFA
                            </p>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${statusConfig.style}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-3">
                          <span>Stock : {product.stock || 0}</span>
                          <span>{product.orders || 0} commandes</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center gap-1 text-xs text-[var(--text-primary)] hover:bg-[var(--border-color)] transition">
                            <Eye size={14}/> Voir
                          </button>
                          <button className="flex-1 py-2 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center gap-1 text-xs text-[var(--text-primary)] hover:bg-[var(--border-color)] transition">
                            <Edit size={14}/> Éditer
                          </button>
                          <button className="flex-1 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center gap-1 text-xs hover:bg-red-100 dark:hover:bg-red-900/30 transition">
                            <Trash2 size={14}/> Suppr
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Version desktop (tableau) */}
                <div className="hidden lg:block bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                          <th className="px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                            Produit
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                            Prix
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                            Cmd
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-color)]">
                        {products.map((product, index) => {
                          const statusConfig = STATUS_CONFIG[product.status] || STATUS_CONFIG['actif']
                          return (
                            <tr key={product._id || product.id || index} className="hover:bg-[var(--bg-secondary)] transition">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{product.emoji || '📦'}</span>
                                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                                    {product.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-sm font-bold text-[var(--accent-secondary)]">
                                {formatPrice(product.price)} FCFA
                              </td>
                              <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">
                                {product.stock || 0}
                              </td>
                              <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">
                                {product.orders || 0}
                              </td>
                              <td className="px-5 py-4">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${statusConfig.style}`}>
                                  {statusConfig.label}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  <button className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition">
                                    <Eye size={16} />
                                  </button>
                                  <button className="text-[var(--text-secondary)] hover:text-amber-500 transition">
                                    <Edit size={16} />
                                  </button>
                                  <button className="text-[var(--text-secondary)] hover:text-red-500 transition">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* COMMANDES */}
        {tab === 'orders' && (
          <div className="pt-12 lg:pt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                Commandes
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-secondary)]">
                  Total : {formatPrice(totalRevenue)} FCFA
                </span>
                <button 
                  onClick={loadData}
                  disabled={loading}
                  className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-10 text-center">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-sm text-[var(--text-secondary)]">Aucune commande reçue</p>
              </div>
            ) : (
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                        <th className="px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                          N°
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                          Produit
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {orders.map((order, index) => {
                        const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG['en cours']
                        return (
                          <tr key={order._id || order.id || index} className="hover:bg-[var(--bg-secondary)] transition">
                            <td className="px-5 py-4 font-mono text-xs text-[var(--accent-primary)] font-bold">
                              #{order.id?.slice(-6) || '000000'}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <Avatar user={{ name: order.client, avatar: order.clientAvatar }} size="sm" />
                                <span className="text-sm font-semibold text-[var(--text-primary)]">
                                  {order.client}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">
                              {order.produit}
                            </td>
                            <td className="px-5 py-4 text-sm font-bold text-[var(--accent-secondary)]">
                              {formatPrice(order.montant)} FCFA
                            </td>
                            <td className="px-5 py-4">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${statusConfig.style}`}>
                                {statusConfig.label}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AVIS */}
        {tab === 'reviews' && (
          <div className="pt-12 lg:pt-0">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                Avis clients
              </h1>
              <span className="text-sm text-[var(--text-secondary)]">
                {reviews.length} avis
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-10 text-center">
                <div className="text-4xl mb-3">⭐</div>
                <p className="text-sm text-[var(--text-secondary)]">Aucun avis pour le moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 sm:p-5 flex gap-3 sm:gap-4 hover:shadow-md transition">
                    <Avatar user={{ name: review.name, avatar: review.avatar }} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-bold text-[var(--text-primary)]">{review.name}</span>
                        <span className="text-amber-400 text-xs">
                          {'★'.repeat(Math.min(review.note || 5, 5))}
                          {'☆'.repeat(Math.max(0, 5 - (review.note || 5)))}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)] ml-auto">{review.date}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mb-1">
                        Produit : {review.produit}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STATISTIQUES */}
        {tab === 'stats' && (
          <div className="pt-12 lg:pt-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mb-5 sm:mb-6">
              Statistiques
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Ventes par produit */}
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 sm:p-6">
                <h3 className="font-bold text-[var(--text-primary)] mb-4 text-sm sm:text-base flex items-center gap-2">
                  <TrendingUp size={18} className="text-[var(--accent-primary)]" />
                  Ventes par produit
                </h3>
                {products.length === 0 ? (
                  <p className="text-sm text-[var(--text-secondary)] text-center py-6">Aucune donnée</p>
                ) : (
                  <div className="space-y-3">
                    {products.map((product, index) => {
                      const maxOrders = Math.max(...products.map(p => p.orders || 0), 1)
                      const percentage = ((product.orders || 0) / maxOrders) * 100
                      return (
                        <div key={index}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-[var(--text-secondary)] truncate">
                              {product.emoji || '📦'} {product.name}
                            </span>
                            <span className="font-bold text-[var(--text-primary)] whitespace-nowrap">
                              {product.orders || 0} ventes
                            </span>
                          </div>
                          <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-[var(--accent-primary)] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Résumé financier */}
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 sm:p-6">
                <h3 className="font-bold text-[var(--text-primary)] mb-4 text-sm sm:text-base flex items-center gap-2">
                  <DollarSign size={18} className="text-[var(--accent-primary)]" />
                  Résumé financier
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Recettes totales', value: formatPrice(totalRevenue), color: 'text-emerald-600 dark:text-emerald-400' },
                    { label: 'Ce mois-ci', value: formatPrice(orders.reduce((sum, o) => {
                      const date = new Date(o.date)
                      const now = new Date()
                      if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
                        return sum + (o.montant || 0)
                      }
                      return sum
                    }, 0)), color: 'text-[var(--accent-primary)]' },
                    { label: 'En attente', value: formatPrice(orders.filter(o => o.status === 'en cours' || o.status === 'confirmé').reduce((sum, o) => sum + (o.montant || 0), 0)), color: 'text-amber-600 dark:text-amber-400' },
                    { label: 'Commission AgroAfrica', value: `${formatPrice(Math.round(totalRevenue * 0.05))}`, color: 'text-[var(--text-secondary)]' },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-[var(--border-color)] last:border-0 gap-3">
                      <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                      <span className={`text-sm font-bold whitespace-nowrap ${item.color}`}>{item.value} FCFA</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard