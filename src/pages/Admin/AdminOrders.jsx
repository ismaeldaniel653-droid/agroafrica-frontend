import { useState, useEffect } from 'react'
import { Search, Eye, CheckCircle, XCircle, Clock, Inbox, Loader, ChevronDown } from 'lucide-react'
import { getOrders, updateOrderStatus } from '../../api/orderApi'

const STATUS_STYLE = {
  'livré':    'bg-green-100 text-green-700',
  'en cours': 'bg-amber-100 text-amber-700',
  'confirmé': 'bg-blue-100 text-blue-700',
  'annulé':   'bg-red-100 text-red-700',
}
const STATUS_ICON = {
  'livré':    <CheckCircle size={12} />,
  'en cours': <Clock size={12} />,
  'confirmé': <CheckCircle size={12} />,
  'annulé':   <XCircle size={12} />,
}

const STATUS_OPTIONS = ['confirmé', 'en cours', 'livré', 'annulé']

function AdminOrders() {
  const [search, setSearch]           = useState('')
  const [filterStatus, setFilter]     = useState('all')
  const [orders, setOrders]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [updating, setUpdating]       = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      // getAllOrders route: GET /orders (admin/vendeur only)
      const res = await getOrders()
      const list = res?.orders ?? res?.data ?? res ?? []
      setOrders(Array.isArray(list) ? list : [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = orders.filter(o => {
    const client = o.buyer?.name || o.client || ''
    const id = o._id || o.id || ''
    const status = o.status || ''
    return (
      (!search || client.toLowerCase().includes(search.toLowerCase()) || id.toLowerCase().includes(search.toLowerCase())) &&
      (filterStatus === 'all' || status === filterStatus)
    )
  })

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'payé' || o.status === 'livré')
    .reduce((s, o) => s + (o.totalAmount || o.montant || 0), 0)

  const countByStatus = (s) => orders.filter(o => o.status === s).length

  async function handleStatusUpdate(order, newStatus) {
    const id = order._id || order.id
    if (!id) return
    setUpdating(id)
    try {
      await updateOrderStatus(id, newStatus)
      await fetchOrders()
    } catch (err) {
      alert(err?.response?.data?.message || '❌ Erreur lors de la mise à jour')
    } finally {
      setUpdating(null)
    }
  }

  const formatDate = (d) => {
    if (!d) return '—'
    const date = new Date(d)
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E25]">Commandes</h1>
          <p className="text-sm text-[#8AADA0]">
            {orders.length} commande{orders.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="bg-[#E8F7F1] rounded-xl px-4 py-2">
          <p className="text-xs text-[#8AADA0]">Revenu total</p>
          <p className="text-lg font-extrabold text-[#0C6B4E]">{totalRevenue.toLocaleString()} FCFA</p>
        </div>
      </div>

      {/* STATS RAPIDES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-5 sm:mb-6">
        {[
          { key: 'livré',    label: 'Livrées',    color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
          { key: 'en cours', label: 'En cours',   color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
          { key: 'confirmé', label: 'Confirmées', color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200' },
          { key: 'annulé',   label: 'Annulées',   color: 'text-red-600',   bg: 'bg-red-50 border-red-200' },
        ].map(s => (
          <div key={s.key} className={`rounded-xl border p-3 ${s.bg}`}>
            <p className={`text-2xl font-extrabold ${s.color}`}>{countByStatus(s.key)}</p>
            <p className="text-xs text-[#8AADA0]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* FILTRES */}
      {orders.length > 0 && (
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-[#DDE8E2] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 flex-1 max-w-xs">
            <Search size={16} className="text-[#8AADA0]" />
            <input type="text" placeholder="Rechercher..."
                   value={search} onChange={e => setSearch(e.target.value)}
                   className="outline-none text-sm flex-1 bg-transparent min-w-0" />
          </div>
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide">
            {['all', ...STATUS_OPTIONS].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition whitespace-nowrap
                        ${filterStatus === s ? 'bg-[#0C6B4E] text-white border-[#0C6B4E]'
                                             : 'bg-white text-[#8AADA0] border-[#DDE8E2] hover:border-[#0C6B4E]'}`}>
                {s === 'all' ? 'Toutes' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TABLE ou EMPTY STATE */}
      <div className="bg-white rounded-2xl border border-[#DDE8E2] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 sm:p-16 text-center">
            <Inbox size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm sm:text-base font-semibold text-[#1A2E25] mb-1">Aucune commande</p>
            <p className="text-xs sm:text-sm text-[#8AADA0]">
              {orders.length === 0 ? 'Les commandes apparaîtront ici dès qu\'elles seront passées.' : 'Aucune commande ne correspond à votre recherche.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[#F5F7F5] border-b border-[#DDE8E2]">
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">N° COMMANDE</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">CLIENT</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">PRODUITS</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">MONTANT</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">PAIEMENT</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">DATE</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">STATUT</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE8E2]">
                {filtered.map((o, i) => {
                  const orderId = o._id || o.id || `#ORD-${String(i + 1).padStart(4, '0')}`
                  const clientName = o.buyer?.name || o.client || '—'
                  const clientCountry = o.buyer?.country || o.country || ''
                  const productCount = o.items?.length || o.produits || 0
                  const amount = o.totalAmount || o.montant || 0
                  const payMethod = o.paymentMethod || o.payMethod || '—'
                  const status = o.status || 'en cours'
                  const isUpdating = updating === orderId

                  return (
                    <tr key={orderId} className="hover:bg-[#F5F7F5] transition">
                      <td className="px-5 py-4 font-mono text-xs text-[#0C6B4E] font-bold">
                        {typeof orderId === 'string' && orderId.length > 8 ? orderId.slice(-8).toUpperCase() : orderId}
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-[#1A2E25]">{clientName}</p>
                          {clientCountry && <p className="text-xs text-[#8AADA0]">{clientCountry}</p>}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4A6355]">
                        {typeof productCount === 'number' ? `${productCount} produit(s)` : productCount || '—'}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-[#D95030]">
                        {amount.toLocaleString()} FCFA
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F5F7F5] text-[#4A6355]">
                          {payMethod}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#8AADA0]">{formatDate(o.createdAt || o.date)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${STATUS_STYLE[status] || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_ICON[status] || <Clock size={12} />} {status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <select
                            value={status}
                            onChange={(e) => handleStatusUpdate(o, e.target.value)}
                            disabled={isUpdating}
                            className="text-xs border border-[#DDE8E2] rounded-lg px-2 py-1 bg-white text-[#4A6355] outline-none focus:border-[#0C6B4E] disabled:opacity-50 cursor-pointer">
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                          {isUpdating && <Loader size={12} className="text-[#0C6B4E] animate-spin ml-1" />}
                          <button className="text-[#8AADA0] hover:text-[#0C6B4E] transition p-1.5 ml-1" title="Voir détails" aria-label="Voir détails">
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
    </div>
  )
}

export default AdminOrders
