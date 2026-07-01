import { Users, Package, ShoppingBag, TrendingUp, ArrowUp, Sparkles, Loader2 } from 'lucide-react'    // ✅ NOUVEAU

// ✅ MODIFIÉ : toutes les valeurs à 0 (lancement propre) — brancher API plus tard
const STATS = [
  { label:'Revenus totaux',     value:0,     unit:'FCFA', icon:TrendingUp,  color:'bg-green-50 border-green-200',   pending:true },
  { label:'Utilisateurs',       value:0,     unit:'',     icon:Users,       color:'bg-blue-50 border-blue-200',     pending:true },
  { label:'Produits actifs',    value:0,     unit:'',     icon:Package,     color:'bg-amber-50 border-amber-200',   pending:true },
  { label:'Commandes ce mois',  value:0,     unit:'',     icon:ShoppingBag, color:'bg-purple-50 border-purple-200', pending:true },
]

const RECENT_USERS   = []    // ✅ NOUVEAU : vide → à remplir depuis /admin/users
const TOP_PRODUCTS   = []    // ✅ NOUVEAU : vide
const ACTIVE_COUNTRIES = []  // ✅ NOUVEAU : vide

const STATUS_STYLE = {
  'actif':    'bg-green-100 text-green-700',
  'vérifié':  'bg-blue-100  text-blue-700',
  'suspendu': 'bg-red-100   text-red-700',
}

function AdminDashboard() {
  return (
    <div>
      <div className="mb-6 sm:mb-7">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E25] mb-1">
          Tableau de bord 🌍
        </h1>
        <p className="text-sm text-[#8AADA0]">
          Vue globale de la plateforme AgroAfrica
        </p>
      </div>

      {/* ✅ NOUVEAU : bannière "phase de lancement" */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <Sparkles size={20} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">🚀 Phase de lancement</p>
          <p className="text-xs text-amber-700 mt-1">
            Les statistiques seront automatiquement actualisées dès le déploiement des premières commandes.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {STATS.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className={`rounded-2xl p-4 sm:p-5 border ${s.color} relative overflow-hidden`}>
              <div className="flex items-center justify-between mb-2">
                <Icon size={20} className="text-[#0C6B4E]" />
                {s.pending && <Loader2 size={12} className="text-gray-400 animate-spin" />}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#1A2E25]">
                {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                {s.unit && <span className="text-xs sm:text-sm font-normal text-[#8AADA0] ml-1">{s.unit}</span>}
              </div>
              <div className="text-[11px] sm:text-xs text-[#8AADA0] mt-0.5">{s.label}</div>
              <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-2">
                {s.pending ? '— en attente' : `↑ ${s.trend}`}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">

        {/* NOUVEAUX UTILISATEURS */}
        <div className="bg-white rounded-2xl border border-[#DDE8E2] overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#DDE8E2] flex justify-between items-center">
            <h2 className="font-bold text-[#1A2E25] text-sm sm:text-base">👥 Nouveaux utilisateurs</h2>
            <button onClick={() => window.location.assign('/admin/users')}
                    className="text-xs text-[#0C6B4E] font-semibold cursor-pointer hover:underline">
              Voir tout →
            </button>
          </div>
          <div className="divide-y divide-[#DDE8E2]">
            {RECENT_USERS.length === 0 ? (
              <Empty label="Aucun utilisateur inscrit pour le moment" />
            ) : RECENT_USERS.map((u, i) => (
              <div key={i} className="px-4 sm:px-6 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#0C6B4E] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {u.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A2E25] truncate">{u.name}</p>
                  <p className="text-xs text-[#8AADA0] truncate">{u.email}</p>
                </div>
                <span className="text-xs text-[#8AADA0] hidden sm:inline">{u.country}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg whitespace-nowrap ${STATUS_STYLE[u.status]}`}>
                  {u.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TOP PRODUITS */}
        <div className="bg-white rounded-2xl border border-[#DDE8E2] overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#DDE8E2] flex justify-between items-center">
            <h2 className="font-bold text-[#1A2E25] text-sm sm:text-base">🏆 Top produits</h2>
            <button onClick={() => window.location.assign('/admin/products')}
                    className="text-xs text-[#0C6B4E] font-semibold cursor-pointer hover:underline">
              Voir tout →
            </button>
          </div>
          <div className="divide-y divide-[#DDE8E2]">
            {TOP_PRODUCTS.length === 0 ? (
              <Empty label="Aucun produit vendu pour le moment" />
            ) : TOP_PRODUCTS.map((p, i) => (
              <div key={i} className="px-4 sm:px-6 py-3 flex items-center gap-3">
                <span className="text-xl sm:text-2xl">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A2E25] truncate">{p.name}</p>
                  <p className="text-xs text-[#8AADA0]">{p.ventes} ventes</p>
                </div>
                <span className="text-sm font-bold text-[#D95030] whitespace-nowrap">
                  {p.revenus} FCFA
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PAYS ACTIFS */}
      <div className="bg-white rounded-2xl border border-[#DDE8E2] p-4 sm:p-6">
        <h2 className="font-bold text-[#1A2E25] mb-4 text-sm sm:text-base">🌍 Pays actifs sur la plateforme</h2>
        {ACTIVE_COUNTRIES.length === 0 ? (
          <Empty label="Aucun pays actif pour le moment" />
        ) : (
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {ACTIVE_COUNTRIES.map((p, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm ${p.color}`}>
                <span>{p.flag}</span>
                <span className="font-semibold text-[#1A2E25]">{p.name}</span>
                <span className="text-[#8AADA0] text-[10px] sm:text-xs">· {p.users} users</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

// ✅ NOUVEAU : composant interne pour les états vides
function Empty({ label }) {
  return (
    <div className="px-4 sm:px-6 py-8 sm:py-10 text-center">
      <p className="text-3xl mb-2 opacity-50">📊</p>
      <p className="text-xs sm:text-sm text-[#8AADA0]">{label}</p>
    </div>
  )
}

export default AdminDashboard
