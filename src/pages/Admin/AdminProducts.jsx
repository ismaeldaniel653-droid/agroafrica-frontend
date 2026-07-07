import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Search, Plus, Edit, Trash2, Eye, X, Package, Loader, 
  RefreshCw, AlertCircle, Filter, ChevronDown 
} from 'lucide-react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/productApi'

// ✅ Configuration des statuts
const STATUS_CONFIG = {
  'actif': { 
    label: 'Actif', 
    style: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
  },
  'rupture': { 
    label: 'Rupture', 
    style: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
  },
  'suspendu': { 
    label: 'Suspendu', 
    style: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
  },
  'brouillon': { 
    label: 'Brouillon', 
    style: 'bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400' 
  },
}

const CATEGORIES = [
  { value: 'agricole', label: '🌾 Agricole' },
  { value: 'artisanat', label: '🎨 Artisanat' },
  { value: 'cooperative', label: '🤝 Coopérative' },
]

// ✅ Statuts disponibles pour le filtre
const STATUS_FILTERS = ['all', ...Object.keys(STATUS_CONFIG)]

function AdminProducts({ 
  onProductSelect,
  refreshInterval = 30000,
}) {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Modal form state
  const [form, setForm] = useState({
    name: '', 
    price: '', 
    stock: '', 
    category: '', 
    origin: '', 
    description: '',
    status: 'actif',
  })

  // ✅ Chargement des produits
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getProducts()
      const list = res?.products ?? res?.data ?? res ?? []
      setProducts(Array.isArray(list) ? list : [])
      setLastUpdated(new Date())
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors du chargement des produits')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ Auto-refresh
  useEffect(() => {
    fetchProducts()
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchProducts, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchProducts, refreshInterval])

  // ✅ Filtrage des produits
  const filtered = useMemo(() => {
    return products.filter(p => {
      const name = p.name?.toLowerCase() || ''
      const seller = p.seller?.name?.toLowerCase() || ''
      const cat = p.category || p.cat || ''
      const status = p.status || 'actif'
      
      const matchesSearch = !search || 
        name.includes(search.toLowerCase()) || 
        seller.includes(search.toLowerCase())
      
      const matchesCategory = filterCat === 'all' || cat === filterCat
      const matchesStatus = filterStatus === 'all' || status === filterStatus
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, search, filterCat, filterStatus])

  // ✅ Statistiques
  const stats = useMemo(() => {
    const totalProducts = products.length
    const activeProducts = products.filter(p => p.status === 'actif').length
    const outOfStock = products.filter(p => p.status === 'rupture' || (p.stock || 0) === 0).length
    
    return { totalProducts, activeProducts, outOfStock }
  }, [products])

  // ✅ Ouverture du modal
  const openModal = useCallback((product = null) => {
    setEditProduct(product)
    setForm({
      name: product?.name || '',
      price: product?.price?.toString() || '',
      stock: product?.stock?.toString() || '',
      category: product?.category || product?.cat || '',
      origin: product?.origin || '',
      description: product?.description || '',
      status: product?.status || 'actif',
    })
    setShowModal(true)
    setError(null)
  }, [])

  // ✅ Sauvegarde du produit
  const handleSave = useCallback(async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    
    try {
      const data = {
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        origin: form.origin.trim(),
        description: form.description.trim(),
        status: form.status,
      }
      
      if (editProduct) {
        await updateProduct(editProduct._id || editProduct.id, data)
      } else {
        await createProduct(data)
      }
      
      setShowModal(false)
      await fetchProducts()
    } catch (err) {
      setError(err?.response?.data?.message || '❌ Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }, [form, editProduct, fetchProducts])

  // ✅ Suppression du produit
  const handleDelete = useCallback(async (product) => {
    if (!window.confirm(`Supprimer "${product.name}" ? Cette action est irréversible.`)) return
    
    try {
      await deleteProduct(product._id || product.id)
      await fetchProducts()
    } catch (err) {
      setError(err?.response?.data?.message || '❌ Erreur lors de la suppression')
    }
  }, [fetchProducts])

  // ✅ Formatage du prix
  const formatPrice = useCallback((price) => {
    return (price || 0).toLocaleString()
  }, [])

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader size={32} className="text-[var(--accent-primary)] animate-spin" />
        <p className="text-sm text-[var(--text-secondary)] mt-4">Chargement des produits...</p>
      </div>
    )
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
            Produits
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {stats.totalProducts} produit{stats.totalProducts > 1 ? 's' : ''} sur la plateforme
            {lastUpdated && (
              <span className="ml-2 text-xs text-[var(--text-secondary)]/60">
                · Mis à jour à {lastUpdated.toLocaleTimeString('fr-FR')}
              </span>
            )}
          </p>
        </div>
        <button 
          onClick={() => openModal(null)}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm transition active:scale-95"
        >
          <Plus size={16} /> <span className="hidden sm:inline">Ajouter un</span> produit
        </button>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-3 text-center">
          <p className="text-2xl font-extrabold text-[var(--text-primary)]">{stats.totalProducts}</p>
          <p className="text-xs text-[var(--text-secondary)]">Total</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-3 text-center">
          <p className="text-2xl font-extrabold text-green-600 dark:text-green-400">{stats.activeProducts}</p>
          <p className="text-xs text-[var(--text-secondary)]">Actifs</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-3 text-center">
          <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">{stats.outOfStock}</p>
          <p className="text-xs text-[var(--text-secondary)]">Rupture</p>
        </div>
      </div>

      {/* FILTRES */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-5">
        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 sm:px-4 py-2 w-full sm:max-w-xs">
          <Search size={16} className="text-[var(--text-secondary)]" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou vendeur..."
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="outline-none text-sm flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 min-w-0"
            aria-label="Rechercher un produit"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide w-full sm:w-auto">
          {/* Filtre catégorie */}
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] outline-none focus:border-[var(--accent-primary)]"
          >
            <option value="all">📂 Tout</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Filtre statut */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] outline-none focus:border-[var(--accent-primary)]"
          >
            <option value="all">📊 Tous</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          {/* Bouton refresh */}
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition disabled:opacity-50"
            aria-label="Rafraîchir"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 sm:p-16 text-center">
            <Package size={48} className="mx-auto text-[var(--text-secondary)]/30 mb-3" />
            <p className="text-sm sm:text-base font-semibold text-[var(--text-primary)] mb-1">
              Aucun produit
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-4">
              {products.length === 0 
                ? 'Commencez par ajouter le premier produit' 
                : 'Aucun produit ne correspond à votre recherche.'}
            </p>
            <button 
              onClick={() => openModal(null)}
              className="bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold px-5 py-2.5 rounded-xl text-sm transition"
            >
              + Ajouter un produit
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Vendeur
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
                {filtered.map((product, index) => {
                  const productId = product._id || product.id || index
                  const statusConfig = STATUS_CONFIG[product.status] || STATUS_CONFIG['actif']
                  const categoryLabel = CATEGORIES.find(c => c.value === (product.category || product.cat))?.label || product.category || product.cat

                  return (
                    <tr 
                      key={productId} 
                      className="hover:bg-[var(--bg-secondary)] transition cursor-pointer"
                      onClick={() => onProductSelect?.(product)}
                    >
                      <td className="px-4 sm:px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{product.emoji || '🌿'}</span>
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">
                              {product.name}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)]">{product.origin}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                          {categoryLabel || '—'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm font-bold text-[var(--accent-secondary)]">
                        {formatPrice(product.price)} FCFA
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm text-[var(--text-secondary)] font-medium">
                        {product.stock || 0} unités
                      </td>
                      <td className="px-4 sm:px-5 py-4 text-sm text-[var(--text-secondary)]">
                        {product.seller?.name || product.seller || '—'}
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${statusConfig.style}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button 
                            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition p-1.5"
                            title="Voir" 
                            aria-label="Voir"
                            onClick={() => onProductSelect?.(product)}
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => openModal(product)}
                            className="text-[var(--text-secondary)] hover:text-amber-500 transition p-1.5"
                            title="Modifier" 
                            aria-label="Modifier"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product)}
                            className="text-[var(--text-secondary)] hover:text-red-500 transition p-1.5"
                            title="Supprimer" 
                            aria-label="Supprimer"
                          >
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
        )}
      </div>

      {/* Footer */}
      {filtered.length > 0 && (
        <div className="mt-4 text-xs text-[var(--text-secondary)] text-center">
          {filtered.length} produit{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
          {filtered.length !== products.length && ` sur ${products.length}`}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <form 
            onSubmit={handleSave} 
            onClick={e => e.stopPropagation()}
            className="bg-[var(--bg-card)] rounded-2xl w-full max-w-lg p-5 sm:p-6 max-h-[90vh] overflow-y-auto animate-page-enter"
          >
            {/* En-tête du modal */}
            <div className="flex items-center justify-between mb-5">
              <h2 id="modal-title" className="font-bold text-[var(--text-primary)] text-base sm:text-lg">
                {editProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="text-[var(--text-secondary)] hover:text-red-500 transition p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Erreur dans le modal */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Nom */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                  Nom du produit *
                </label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="Ex: Cacao bio"
                  required
                  className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition placeholder-[var(--text-secondary)]/50"
                />
              </div>

              {/* Prix et Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                    Prix (FCFA) *
                  </label>
                  <input 
                    type="number" 
                    value={form.price}
                    onChange={e => setForm({...form, price: e.target.value})}
                    placeholder="3500" 
                    required 
                    min="0"
                    className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition placeholder-[var(--text-secondary)]/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                    Stock *
                  </label>
                  <input 
                    type="number" 
                    value={form.stock}
                    onChange={e => setForm({...form, stock: e.target.value})}
                    placeholder="100" 
                    required 
                    min="0"
                    className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition placeholder-[var(--text-secondary)]/50"
                  />
                </div>
              </div>

              {/* Catégorie et Statut */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                    Catégorie *
                  </label>
                  <select 
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                    required
                    className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                  >
                    <option value="">Sélectionner</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                    Statut
                  </label>
                  <select 
                    value={form.status}
                    onChange={e => setForm({...form, status: e.target.value})}
                    className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Origine */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                  Origine
                </label>
                <input 
                  type="text" 
                  value={form.origin}
                  onChange={e => setForm({...form, origin: e.target.value})}
                  placeholder="Littoral, Cameroun"
                  className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition placeholder-[var(--text-secondary)]/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                  Description
                </label>
                <textarea 
                  rows={3} 
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Description du produit..."
                  className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] resize-none placeholder-[var(--text-secondary)]/50"
                />
              </div>

              {/* Bouton de sauvegarde */}
              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-[var(--text-light)] font-bold py-3 rounded-xl transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  editProduct ? 'Sauvegarder les modifications' : 'Ajouter le produit'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default AdminProducts