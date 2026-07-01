import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PriceSuggestion from '../components/PriceSuggestion'
import {
  LayoutDashboard, Package as PackageIcon, ShoppingBag,
  Star, TrendingUp, Plus, X, Menu as MenuIcon,
  Eye, Edit, Trash2
} from 'lucide-react'
import Avatar from '../components/Avatar' // ✅ NOUVEAU
import { getSellerStats, getSellerProducts, getSellerOrders, getSellerReviews } from '../api/sellerApi'

// ✅ NOUVEAU : tableaux vides — depuis l'API
const STATS = []
const PRODUCTS = []
const ORDERS = []
const REVIEWS = []

const STATUS_STYLE = {
  'livré':     'bg-green-100 text-green-700',
  'en cours':  'bg-amber-100 text-amber-700',
  'confirmé':  'bg-blue-100  text-blue-700',
  'annulé':    'bg-red-100   text-red-700',
  'actif':     'bg-green-100 text-green-700',
  'rupture':   'bg-red-100   text-red-600',
}

const MENU = [
  { key:'overview',  icon:<LayoutDashboard size={18}/>, label:'Vue générale' },
  { key:'products',  icon:<PackageIcon size={18}/>,    label:'Mes produits' },
  { key:'orders',    icon:<ShoppingBag size={18}/>,    label:'Commandes'    },
  { key:'reviews',   icon:<Star size={18}/>,           label:'Avis clients' },
  { key:'stats',     icon:<TrendingUp size={18}/>,     label:'Statistiques' },
]

function Dashboard() {
  const navigate    = useNavigate()
  const { user }    = useSelector(state => state.auth)
  const [tab, setTab] = useState('overview')
  // ✅ NOUVEAU : drawer mobile
  const [mobileOpen, setMobileOpen] = useState(false)

  // ✅ NOUVEAU : chargement depuis l'API
  const [stats, setStats]     = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders]   = useState([])
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const load = async () => {
      try { const r = await getSellerStats();    setStats(r?.stats    || []) } catch {}
      try { const r = await getSellerProducts(); setProducts(r?.products || r || []) } catch {}
      try { const r = await getSellerOrders();   setOrders(r?.orders   || r || []) } catch {}
      try { const r = await getSellerReviews();  setReviews(r?.reviews || r || []) } catch {}
    }
    load()
  }, [])

  const MenuButton = ({ m }) => (
    <button
      onClick={() => { setTab(m.key); setMobileOpen(false) }}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition
        ${tab === m.key
          ? 'bg-white/15 text-white'
          : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
    >
      {m.icon}
      {m.label}
    </button>
  )

  return (
    <div className="min-h-screen bg-[#F5F7F5] flex relative">

      {/* ✅ NOUVEAU : bouton hamburger mobile */}
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 bg-[#0C6B4E] text-white p-2.5 rounded-xl shadow-lg">
        <MenuIcon size={20} />
      </button>

      {/* ✅ NOUVEAU : overlay mobile */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)}
             className="lg:hidden fixed inset-0 bg-black/50 z-40"></div>
      )}

      {/* SIDEBAR — ✅ NOUVEAU : responsive drawer mobile */}
      <aside className={`
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300
        w-64 lg:w-60 bg-[#0C6B4E] min-h-screen flex flex-col flex-shrink-0
        fixed lg:sticky top-0 left-0 z-50 lg:z-auto
      `}>

        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xl font-extrabold text-white">
              🌿 Agro<span className="text-amber-400">Africa</span>
            </div>
            <div className="text-xs text-white/50 mt-0.5">Tableau de bord vendeur</div>
          </div>
          {/* ✅ NOUVEAU : close mobile */}
          <button onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* ✅ NOUVEAU : avatar du vendeur (photo de profil) */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
          <Avatar
            user={{ name: user?.name || 'Vendeur', avatar: user?.avatar }}
            size={40}
          />
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-bold truncate">{user?.name || 'Mon compte'}</p>
            <p className="text-white/50 text-xs">Vendeur certifié ✅</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {MENU.map(m => <MenuButton key={m.key} m={m} />)}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition"
          >
            Retour au marché
          </button>
        </div>

      </aside>

      {/* CONTENU */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="pt-12 lg:pt-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E25] mb-1">
              Bonjour {user?.name?.split(' ')[0] || 'à vous'} 👋
            </h1>
            <p className="text-sm text-[#8AADA0] mb-6 sm:mb-7">
              Voici un résumé de votre activité.
            </p>

            {/* ✅ NOUVEAU : stats dynamiques */}
            {stats.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#DDE8E2] p-8 text-center mb-6 sm:mb-8">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm text-[#8AADA0]">Aucune statistique pour le moment</p>
                <p className="text-xs text-[#8AADA0] mt-1">Vos données apparaîtront dès vos premières ventes</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DDE8E2]">
                    <div className="text-xl sm:text-2xl mb-2">{s.icon}</div>
                    <div className="text-base sm:text-xl font-extrabold text-[#1A2E25]">{s.value}</div>
                    <div className="text-xs text-[#8AADA0] mt-0.5">{s.label}</div>
                    {s.trend && (
                      <div className="text-xs text-green-600 font-semibold mt-2">↑ {s.trend}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mb-6"><PriceSuggestion /></div>

            {/* Dernières commandes */}
            <div className="bg-white rounded-2xl border border-[#DDE8E2] overflow-hidden mb-6">
              <div className="px-4 sm:px-6 py-4 border-b border-[#DDE8E2] flex items-center justify-between">
                <h2 className="font-bold text-[#1A2E25] text-sm sm:text-base">📦 Dernières commandes</h2>
                <button onClick={() => setTab('orders')}
                  className="text-xs text-[#0C6B4E] font-semibold hover:underline">
                  Voir tout →
                </button>
              </div>
              {/* ✅ NOUVEAU : état vide */}
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">📦</div>
                  <p className="text-sm text-[#8AADA0]">Aucune commande pour le moment</p>
                </div>
              ) : (
                <div className="divide-y divide-[#DDE8E2]">
                  {orders.slice(0,3).map((o, i) => (
                    <div key={o._id || o.id || i} className="px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-4 flex-wrap">
                      <span className="font-mono text-xs text-[#8AADA0] w-20 sm:w-auto">{o.id}</span>
                      {/* ✅ NOUVEAU : photo du client */}
                      <Avatar user={{ name: o.client, avatar: o.clientAvatar }} size={28} />
                      <span className="text-sm font-semibold flex-1 min-w-[120px]">{o.client}</span>
                      <span className="text-sm text-[#4A6355] flex-1 min-w-[120px]">{o.produit}</span>
                      <span className="text-sm font-bold text-[#D95030]">
                        {Number(o.montant).toLocaleString()} FCFA
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${STATUS_STYLE[o.status] || ''}`}>
                        {o.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rupture */}
            {products.filter(p => p.status === 'rupture').length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5">
                <h3 className="font-bold text-red-700 mb-3 text-sm sm:text-base">⚠️ Produits en rupture de stock</h3>
                {products.filter(p => p.status === 'rupture').map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl">{p.emoji}</span>
                    <span className="text-sm font-semibold text-[#1A2E25] flex-1">{p.name}</span>
                    <button className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition">
                      Réapprovisionner
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRODUITS */}
        {tab === 'products' && (
          <div className="pt-12 lg:pt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E25]">Mes Produits</h1>
              <button onClick={() => navigate('/add-product')}
                className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold px-5 py-2.5 rounded-xl text-sm transition">
                <Plus size={16} /> Ajouter un produit
              </button>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#DDE8E2] p-10 text-center">
                <div className="text-4xl mb-3">🌿</div>
                <p className="font-bold text-[#1A2E25]">Aucun produit pour le moment</p>
                <p className="text-sm text-[#8AADA0] mt-1 mb-4">Commencez par ajouter votre premier produit</p>
                <button onClick={() => navigate('/add-product')}
                  className="bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold px-6 py-2.5 rounded-xl text-sm transition">
                  + Ajouter un produit
                </button>
              </div>
            ) : (
              <>
                {/* ✅ NOUVEAU : cards mobile */}
                <div className="lg:hidden space-y-3">
                  {products.map((p, i) => (
                    <div key={p._id || p.id || i} className="bg-white rounded-2xl border border-[#DDE8E2] p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{p.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#1A2E25] truncate">{p.name}</p>
                          <p className="text-xs text-[#D95030] font-bold">{Number(p.price).toLocaleString()} FCFA</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${STATUS_STYLE[p.status] || ''}`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-[#8AADA0] mb-3">
                        <span>Stock : {p.stock}</span>
                        <span>{p.orders} commandes</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-[#F5F7F5] rounded-lg flex items-center justify-center gap-1 text-xs"><Eye size={14}/> Voir</button>
                        <button className="flex-1 py-2 bg-[#F5F7F5] rounded-lg flex items-center justify-center gap-1 text-xs"><Edit size={14}/> Éditer</button>
                        <button className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-1 text-xs"><Trash2 size={14}/> Suppr</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tableau PC */}
                <div className="hidden lg:block bg-white rounded-2xl border border-[#DDE8E2] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#F5F7F5] border-b border-[#DDE8E2]">
                        <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">PRODUIT</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">PRIX</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">STOCK</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">CMD</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">STATUT</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DDE8E2]">
                      {products.map((p, i) => (
                        <tr key={p._id || p.id || i} className="hover:bg-[#F5F7F5] transition">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{p.emoji}</span>
                              <span className="text-sm font-semibold text-[#1A2E25]">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm font-bold text-[#D95030]">{Number(p.price).toLocaleString()} FCFA</td>
                          <td className="px-5 py-4 text-sm">{p.stock}</td>
                          <td className="px-5 py-4 text-sm">{p.orders}</td>
                          <td className="px-5 py-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${STATUS_STYLE[p.status] || ''}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button className="text-[#8AADA0] hover:text-[#0C6B4E]"><Eye size={16} /></button>
                              <button className="text-[#8AADA0] hover:text-amber-500"><Edit size={16} /></button>
                              <button className="text-[#8AADA0] hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* COMMANDES */}
        {tab === 'orders' && (
          <div className="pt-12 lg:pt-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E25] mb-5 sm:mb-6">Commandes</h1>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#DDE8E2] p-10 text-center">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-sm text-[#8AADA0]">Aucune commande reçue</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#DDE8E2] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F5F7F5] border-b border-[#DDE8E2]">
                      <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">N°</th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">CLIENT</th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">PRODUIT</th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">MONTANT</th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-[#8AADA0]">STATUT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDE8E2]">
                    {orders.map((o, i) => (
                      <tr key={o._id || o.id || i} className="hover:bg-[#F5F7F5]">
                        <td className="px-5 py-4 font-mono text-xs text-[#0C6B4E] font-bold">{o.id}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Avatar user={{ name: o.client, avatar: o.clientAvatar }} size={24} />
                            <span className="text-sm font-semibold">{o.client}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm">{o.produit}</td>
                        <td className="px-5 py-4 text-sm font-bold text-[#D95030]">{Number(o.montant).toLocaleString()} FCFA</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${STATUS_STYLE[o.status] || ''}`}>{o.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* AVIS */}
        {tab === 'reviews' && (
          <div className="pt-12 lg:pt-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E25] mb-5 sm:mb-6">Avis clients</h1>
            {reviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#DDE8E2] p-10 text-center">
                <div className="text-4xl mb-3">⭐</div>
                <p className="text-sm text-[#8AADA0]">Aucun avis pour le moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((avis, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#DDE8E2] p-4 sm:p-5 flex gap-3 sm:gap-4">
                    <Avatar user={avis} size={40} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-bold text-[#1A2E25]">{avis.name}</span>
                        <span className="text-amber-400 text-xs">{'★'.repeat(avis.note)}</span>
                        <span className="text-xs text-[#8AADA0] ml-auto">{avis.date}</span>
                      </div>
                      <p className="text-xs text-[#8AADA0] mb-1">Produit : {avis.produit}</p>
                      <p className="text-sm text-[#4A6355]">{avis.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STATS */}
        {tab === 'stats' && (
          <div className="pt-12 lg:pt-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E25] mb-5 sm:mb-6">Statistiques</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

              <div className="bg-white rounded-2xl border border-[#DDE8E2] p-5 sm:p-6">
                <h3 className="font-bold text-[#1A2E25] mb-4 text-sm sm:text-base">📊 Ventes par produit</h3>
                {products.length === 0 ? (
                  <p className="text-sm text-[#8AADA0] text-center py-6">Aucune donnée</p>
                ) : (
                  <div className="space-y-3">
                    {products.map((p, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-[#4A6355] truncate">{p.emoji} {p.name}</span>
                          <span className="font-bold text-[#1A2E25] whitespace-nowrap">{p.orders || 0} ventes</span>
                        </div>
                        <div className="w-full bg-[#E8F7F1] rounded-full h-2">
                          <div className="bg-[#0C6B4E] h-2 rounded-full transition-all"
                               style={{width: `${Math.min(100, ((p.orders || 0) / Math.max(...products.map(x => x.orders || 1))) * 100)}%`}} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-[#DDE8E2] p-5 sm:p-6">
                <h3 className="font-bold text-[#1A2E25] mb-4 text-sm sm:text-base">💰 Résumé financier</h3>
                <div className="space-y-3">
                  {[
                    { label:'Recettes totales',      value: stats.find(s => s.label?.includes('ecette'))?.value || '0 FCFA', color:'text-green-600'  },
                    { label:'Ce mois-ci',            value: stats.find(s => s.label?.includes('ois'))?.value || '0 FCFA',    color:'text-[#0C6B4E]'  },
                    { label:'En attente',            value: '0 FCFA',    color:'text-amber-600'  },
                    { label:'Commission AgroAfrica', value: '0 FCFA',    color:'text-[#8AADA0]'  },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-[#DDE8E2] last:border-0 gap-3">
                      <span className="text-sm text-[#4A6355]">{item.label}</span>
                      <span className={`text-sm font-bold whitespace-nowrap ${item.color}`}>{item.value}</span>
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
