import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Search, Eye, RotateCcw, Loader } from 'lucide-react'
import { getOrders } from '../api/orderApi'
import Avatar from '../components/Avatar'

const STATUS_STYLE = {
  'livré':    'bg-green-100 text-green-700',
  'en cours': 'bg-amber-100 text-amber-700',
  'confirmé': 'bg-blue-100 text-blue-700',
  'annulé':   'bg-red-100 text-red-700',
}

function MyOrders() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  // ✅ NOUVEAU : état dynamique
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders()
        const list = res?.orders ?? res
        setOrders(Array.isArray(list) ? list : [])
      } catch (err) {
        setOrders([])
      }
    }
    fetchOrders()
  }, [])

  const filtered = orders.filter(o => {
    const matchSearch = o.product?.toLowerCase().includes(search.toLowerCase()) ||
                        o.id?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || o.status === filter
    return matchSearch && matchFilter
  })

  const totalSpent = orders.filter(o => o.status !== 'annulé').reduce((s, o) => s + (o.total || 0), 0)

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-6 sm:py-8 px-4">
      <div className="max-w-3xl mx-auto">

        <button onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-5 sm:mb-6 hover:underline text-sm">
          <ArrowLeft size={16} /> Retour au marché
        </button>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E25]">Mes commandes</h1>
            <p className="text-xs sm:text-sm text-[#8AADA0]">
              {orders.length} commande{orders.length !== 1 ? 's' : ''} au total
              {orders.length > 0 && <> • Total : <strong className="text-[#0C6B4E]">{totalSpent.toLocaleString()} FCFA</strong></>}
            </p>
          </div>
          {orders.filter(o => o.status === 'en cours').length > 0 && (
            <div className="bg-[#E8F7F1] rounded-xl px-4 py-2 flex items-center gap-2 self-start">
              <Package size={18} className="text-[#0C6B4E]" />
              <span className="text-sm font-bold text-[#0C6B4E]">
                {orders.filter(o => o.status === 'en cours').length} en cours
              </span>
            </div>
          )}
        </div>

        {/* ✅ NOUVEAU : recherche + filtres masqués si pas de commandes */}
        {orders.length > 0 && (
          <>
            <div className="flex items-center gap-2 bg-white border border-[#DDE8E2] rounded-xl px-4 py-2.5 mb-4 w-full max-w-md">
              <Search size={16} className="text-[#8AADA0]" />
              <input type="text" placeholder="Rechercher une commande..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="outline-none text-sm flex-1 bg-transparent min-w-0" />
            </div>

            <div className="flex gap-2 mb-5 flex-wrap">
              {['all','confirmé','en cours','livré','annulé'].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold border transition
                    ${filter === s ? 'bg-[#0C6B4E] text-white border-[#0C6B4E]' : 'bg-white text-[#8AADA0] border-[#DDE8E2] hover:border-[#0C6B4E]'}`}>
                  {s === 'all' ? 'Toutes' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </>
        )}

        {/* LISTE */}
        <div className="space-y-3">
          {filtered.map((o, i) => (
            <div key={o._id || o.id || i} className="bg-white rounded-2xl border border-[#DDE8E2] p-4 sm:p-5 hover:shadow-md transition">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* ✅ NOUVEAU : Avatar du vendeur */}
                <Avatar
                  user={{ name: o.seller, avatar: o.sellerAvatar, id: o.sellerId }}
                  size={56}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs text-[#0C6B4E] font-bold">{o.id}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${STATUS_STYLE[o.status] || 'bg-gray-100 text-gray-600'}`}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#1A2E25] truncate">{o.product}</p>
                  <p className="text-xs text-[#8AADA0]">par {o.seller} • {o.date}</p>
                </div>
                <div className="text-right ml-auto flex-shrink-0">
                  <p className="text-sm sm:text-base font-extrabold text-[#D95030] whitespace-nowrap">
                    {o.total?.toLocaleString()} FCFA
                  </p>
                  <p className="text-[10px] text-[#8AADA0] mb-2">x{o.qty} • {o.payMethod}</p>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => navigate(`/payment-status/${(o.id || '').replace('#','')}`)}
                      className="text-[#8AADA0] hover:text-[#0C6B4E] transition" title="Suivi">
                      <Eye size={14} />
                    </button>
                    {o.status === 'livré' && (
                      <button className="text-[#8AADA0] hover:text-amber-500 transition" title="Recommander">
                        <RotateCcw size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {o.status !== 'annulé' && (
                <div className="mt-4 flex items-center gap-1">
                  {['confirmé','en cours','livré'].map((step, si) => {
                    const statusOrder = ['annulé','confirmé','en cours','livré']
                    const currentIdx = statusOrder.indexOf(o.status)
                    const stepIdx = statusOrder.indexOf(step)
                    const isActive = currentIdx >= stepIdx
                    return (
                      <div key={si} className="flex-1 flex items-center gap-1">
                        <div className={`h-1.5 flex-1 rounded-full transition-all ${isActive ? 'bg-[#0C6B4E]' : 'bg-[#E8F7F1]'}`} />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}

          {/* ✅ NOUVEAU : état vide explicite */}
          {orders.length === 0 && (
            <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-[#DDE8E2]">
              <div className="text-5xl mb-3">📦</div>
              <p className="font-bold text-[#1A2E25]">Aucune commande pour le moment</p>
              <p className="text-sm text-[#8AADA0] mt-1 mb-4">Commencez vos achats sur le marché !</p>
              <button onClick={() => navigate('/')}
                className="bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold px-6 py-2 rounded-xl text-sm transition">
                Explorer le marché →
              </button>
            </div>
          )}

          {orders.length > 0 && filtered.length === 0 && (
            <div className="text-center py-10 text-sm text-[#8AADA0]">
              Aucune commande ne correspond à votre recherche.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyOrders
