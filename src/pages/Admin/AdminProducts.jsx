import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, X, Package, Loader } from 'lucide-react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/productApi'

const STATUS_STYLE = {
  'actif':     'bg-green-100 text-green-700',
  'rupture':   'bg-red-100   text-red-600',
  'suspendu':  'bg-red-100   text-red-700',
  'brouillon': 'bg-gray-100  text-gray-600',
}

const CATEGORIES = ['agricole', 'artisanat', 'cooperative']

function AdminProducts() {
  const [search, setSearch]       = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)

  // Modal form state
  const [form, setForm] = useState({
    name: '', price: '', stock: '', category: '', origin: '', description: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await getProducts()
      const list = res?.products ?? res?.data ?? res ?? []
      setProducts(Array.isArray(list) ? list : [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = products.filter(p => {
    const name = p.name?.toLowerCase() || ''
    const seller = p.seller?.name?.toLowerCase() || ''
    const cat = p.category || p.cat || ''
    return (
      (!search || name.includes(search.toLowerCase()) || seller.includes(search.toLowerCase())) &&
      (filterCat === 'all' || cat === filterCat)
    )
  })

  function openModal(product = null) {
    setEditProduct(product)
    setForm({
      name: product?.name || '',
      price: product?.price?.toString() || '',
      stock: product?.stock?.toString() || '',
      category: product?.category || product?.cat || '',
      origin: product?.origin || '',
      description: product?.description || ''
    })
    setShowModal(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const data = {
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        origin: form.origin,
        description: form.description
      }
      if (editProduct) {
        await updateProduct(editProduct._id || editProduct.id, data)
      } else {
        await createProduct(data)
      }
      setShowModal(false)
      await fetchProducts()
    } catch (err) {
      alert(err?.response?.data?.message || '❌ Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Supprimer "${product.name}" ? Cette action est irréversible.`)) return
    try {
      await deleteProduct(product._id || product.id)
      await fetchProducts()
    } catch (err) {
      alert(err?.response?.data?.message || '❌ Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={32} className="text-[#0C6B4E] animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 sm:mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E25]">Produits</h1>
          <p className="text-sm text-[#8AADA0]">
            {products.length} produit{products.length > 1 ? 's' : ''} sur la plateforme
          </p>
        </div>
        <button onClick={() => openModal(null)}
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm transition active:scale-95">
          <Plus size={16} /> <span className="hidden sm:inline">Ajouter un</span> produit
        </button>
      </div>

      {/* FILTRES */}
      {products.length > 0 && (
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-[#DDE8E2] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 flex-1 max-w-xs">
            <Search size={16} className="text-[#8AADA0]" />
            <input type="text" placeholder="Rechercher..."
                   value={search} onChange={e => setSearch(e.target.value)}
                   className="outline-none text-sm flex-1 bg-transparent min-w-0" />
          </div>
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide">
            {['all', ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition whitespace-nowrap
                        ${filterCat === cat ? 'bg-[#0C6B4E] text-white border-[#0C6B4E]'
                                            : 'bg-white text-[#8AADA0] border-[#DDE8E2] hover:border-[#0C6B4E]'}`}>
                {cat === 'all' ? 'Tout' : cat === 'agricole' ? '🌾 Agricole' : cat === 'artisanat' ? '🎨 Artisanat' : '🤝 Coopérative'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-[#DDE8E2] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 sm:p-16 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm sm:text-base font-semibold text-[#1A2E25] mb-1">Aucun produit</p>
            <p className="text-xs sm:text-sm text-[#8AADA0] mb-4">
              {products.length === 0 ? 'Commencez par ajouter le premier produit' : 'Aucun produit ne correspond à votre recherche.'}
            </p>
            <button onClick={() => openModal(null)}
                    className="bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold px-5 py-2.5 rounded-xl text-sm transition">
              + Ajouter un produit
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[#F5F7F5] border-b border-[#DDE8E2]">
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">PRODUIT</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">CATÉGORIE</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">PRIX</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">STOCK</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">VENDEUR</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">STATUT</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE8E2]">
                {filtered.map((p, i) => (
                  <tr key={p._id || p.id || i} className="hover:bg-[#F5F7F5] transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.emoji || '🌿'}</span>
                        <div>
                          <p className="text-sm font-semibold text-[#1A2E25]">{p.name}</p>
                          <p className="text-xs text-[#8AADA0]">{p.origin}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#E8F7F1] text-[#0C6B4E]">
                        {p.category || p.cat}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-[#D95030]">
                      {(p.price || 0).toLocaleString()} FCFA
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4A6355] font-medium">
                      {p.stock || 0} unités
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4A6355]">
                      {p.seller?.name || p.seller || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${STATUS_STYLE[p.status] || 'bg-gray-100 text-gray-600'}`}>
                        {p.status || 'actif'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button className="text-[#8AADA0] hover:text-[#0C6B4E] transition p-1.5" title="Voir" aria-label="Voir">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => openModal(p)}
                                className="text-[#8AADA0] hover:text-amber-500 transition p-1.5" title="Modifier" aria-label="Modifier">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(p)}
                                className="text-[#8AADA0] hover:text-red-500 transition p-1.5" title="Supprimer" aria-label="Supprimer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
             onClick={() => setShowModal(false)}>
          <form onSubmit={handleSave} onClick={e => e.stopPropagation()}
               className="bg-white rounded-2xl w-full max-w-lg p-5 sm:p-6 max-h-[90vh] overflow-y-auto animate-page-enter">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-[#1A2E25] text-base sm:text-lg">
                {editProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              <button type="button" onClick={() => setShowModal(false)}
                      className="text-[#8AADA0] hover:text-red-500 transition p-1.5" aria-label="Fermer">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Nom du produit</label>
                <input type="text" value={form.name}
                       onChange={e => setForm({...form, name: e.target.value})}
                       placeholder="Ex: Cacao bio" required
                       className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E] focus:ring-2 focus:ring-[#0C6B4E]/20 transition" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Prix (FCFA)</label>
                  <input type="number" value={form.price}
                         onChange={e => setForm({...form, price: e.target.value})}
                         placeholder="3500" required min="0"
                         className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E] focus:ring-2 focus:ring-[#0C6B4E]/20 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Stock</label>
                  <input type="number" value={form.stock}
                         onChange={e => setForm({...form, stock: e.target.value})}
                         placeholder="100" required min="0"
                         className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E] focus:ring-2 focus:ring-[#0C6B4E]/20 transition" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Catégorie</label>
                <select value={form.category}
                        onChange={e => setForm({...form, category: e.target.value})}
                        required
                        className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none bg-white">
                  <option value="">Sélectionner</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Origine</label>
                <input type="text" value={form.origin}
                       onChange={e => setForm({...form, origin: e.target.value})}
                       placeholder="Littoral, Cameroun"
                       className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Description</label>
                <textarea rows={3} value={form.description}
                          onChange={e => setForm({...form, description: e.target.value})}
                          placeholder="Description du produit..."
                          className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E] resize-none" />
              </div>
              <button type="submit" disabled={saving}
                      className="w-full bg-[#0C6B4E] hover:bg-[#18A070] text-white font-bold py-3 rounded-xl transition active:scale-[0.98] disabled:opacity-50">
                {saving ? 'Sauvegarde...' : editProduct ? 'Sauvegarder les modifications' : 'Ajouter le produit'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
