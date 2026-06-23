import { TrendingUp, ShoppingBag, Percent, Star, BarChart3, PieChart } from 'lucide-react'    // ✅ NOUVEAU

// ✅ MODIFIÉ : toutes les valeurs à 0 et marqué "pending" tant que pas connecté à l'API
const KPIS = [
  { label:"Chiffre d'affaires",  value:0,     unit:'FCFA', icon:TrendingUp,  trend:'—',   color:'bg-green-50 border-green-200',   pending:true },
  { label:'Panier moyen',         value:0,     unit:'FCFA', icon:ShoppingBag, trend:'—',   color:'bg-blue-50 border-blue-200',     pending:true },
  { label:'Taux de conversion',   value:0,     unit:'%',    icon:Percent,     trend:'—',   color:'bg-amber-50 border-amber-200',   pending:true },
  { label:'Taux de satisfaction', value:'—',   unit:'/5',   icon:Star,        trend:'—',   color:'bg-purple-50 border-purple-200', pending:true },
]

function AdminStats() {
  return (
    <div>
      <div className="mb-5 sm:mb-7">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E25] mb-1">Statistiques</h1>
        <p className="text-sm text-[#8AADA0]">Analyse détaillée de la plateforme AgroAfrica</p>
      </div>

      {/* ✅ NOUVEAU : bandeau "données en attente" */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <BarChart3 size={20} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-800">📊 Données en cours de collecte</p>
          <p className="text-xs text-blue-700 mt-1">
            Les graphiques se rempliront automatiquement dès les premières transactions validées.
          </p>
        </div>
      </div>

      {/* KPI PRINCIPAUX */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {KPIS.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className={`rounded-2xl p-4 sm:p-5 border ${s.color} relative`}>
              <Icon size={20} className="text-[#0C6B4E] mb-2" />
              <div className="text-xl sm:text-2xl font-extrabold text-[#1A2E25]">
                {s.value} <span className="text-xs sm:text-sm font-normal text-[#8AADA0]">{s.unit}</span>
              </div>
              <div className="text-[11px] sm:text-xs text-[#8AADA0] mt-0.5">{s.label}</div>
              <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-2">
                {s.pending ? '— en attente' : `↑ ${s.trend} ce mois`}
              </div>
            </div>
          )
        })}
      </div>

      {/* ✅ NOUVEAU : empty state général pour tous les graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {[
          { icon: BarChart3, title:'📊 Évolution des ventes (6 mois)' },
          { icon: PieChart,  title:'🌿 Ventes par catégorie' },
          { icon: BarChart3, title:'🌍 Top pays par revenu' },
          { icon: BarChart3, title:'🏆 Top 5 produits' },
        ].map((g, i) => {
          const Icon = g.icon
          return (
            <div key={i} className="bg-white rounded-2xl border border-[#DDE8E2] p-5 sm:p-6 min-h-[280px] flex flex-col">
              <h3 className="font-bold text-[#1A2E25] mb-4 text-sm sm:text-base">{g.title}</h3>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Icon size={48} className="text-gray-200 mb-3" />
                <p className="text-sm font-semibold text-[#1A2E25]">Données en attente</p>
                <p className="text-xs text-[#8AADA0] mt-1">Les graphiques apparaîtront ici dès les premières commandes.</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* PERFORMANCE VENDEURS */}
      <div className="bg-white rounded-2xl border border-[#DDE8E2] p-5 sm:p-6">
        <h3 className="font-bold text-[#1A2E25] mb-4 text-sm sm:text-base">🏪 Performance vendeurs</h3>
        <div className="bg-[#F5F7F5] rounded-xl p-6 sm:p-10 text-center">
          <p className="text-3xl mb-2 opacity-50">🏪</p>
          <p className="text-sm font-semibold text-[#1A2E25]">Aucun vendeur actif pour le moment</p>
          <p className="text-xs text-[#8AADA0] mt-1">Les performances des vendeurs seront accessibles après leurs premières ventes.</p>
        </div>
      </div>

    </div>
  )
}

export default AdminStats
