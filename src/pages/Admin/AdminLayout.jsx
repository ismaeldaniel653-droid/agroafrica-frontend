import { useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Package,
  ShoppingBag, TrendingUp, Settings,
  ArrowLeft, Bell, Search, Menu, X
} from 'lucide-react'

const MENU = [
  { path:'/admin',          icon:<LayoutDashboard size={18}/>, label:'Dashboard'   },
  { path:'/admin/users',    icon:<Users size={18}/>,           label:'Utilisateurs'},
  { path:'/admin/products', icon:<Package size={18}/>,         label:'Produits'    },
  { path:'/admin/orders',   icon:<ShoppingBag size={18}/>,     label:'Commandes'   },
  { path:'/admin/stats',    icon:<TrendingUp size={18}/>,      label:'Statistiques'},
  { path:'/admin/settings', icon:<Settings size={18}/>,        label:'Paramètres'  },
]

function AdminLayout() {
  const navigate    = useNavigate()
  const [active, setActive] = useState('/admin')
  // ✅ NOUVEAU : État pour la sidebar mobile (drawer)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { user } = useSelector(state => state.auth)

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />
  }

  // ✅ NOUVEAU : Helper pour naviguer + fermer la sidebar mobile
  function handleNavigate(path) {
    setActive(path)
    navigate(path)
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] flex">

      {/* ✅ NOUVEAU : OVERLAY pour sidebar mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      {/* ✅ NOUVEAU : SIDEBAR — Cachée par défaut sur mobile, drawer */}
      <aside className={`fixed md:static top-0 left-0 h-full w-64 bg-[#0D1F2D] flex flex-col flex-shrink-0 z-50 transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

        {/* LOGO + ✅ NOUVEAU : Bouton fermer sur mobile */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xl font-extrabold text-white">
              🌿 Agro<span className="text-amber-400">Africa</span>
            </div>
            <div className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              Panel Administrateur
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/60 hover:text-white transition"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* PROFIL ADMIN — ✅ NOUVEAU : Utilise les données utilisateur */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center font-bold text-[#0D1F2D] text-sm">
            {user.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-bold truncate">{user.name || 'Administrateur'}</p>
            <p className="text-white/40 text-xs">Super Admin</p>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {MENU.map(m => (
            <button
              key={m.path}
              onClick={() => handleNavigate(m.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition
                ${active === m.path
                  ? 'bg-white/15 text-white'
                  : 'text-white/50 hover:bg-white/10 hover:text-white'}`}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </nav>

        {/* RETOUR */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:bg-white/10 hover:text-white transition"
          >
            <ArrowLeft size={18} /> Retour au marché
          </button>
        </div>

      </aside>

      {/* CONTENU */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ✅ NOUVEAU : TOPBAR ADMIN — Bouton hamburger sur mobile, badge supprimé */}
        <div className="bg-white border-b border-[#DDE8E2] px-4 md:px-8 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            {/* Bouton Hamburger (visible uniquement sur mobile) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-[#1A2E25] hover:text-[#0C6B4E] transition flex-shrink-0"
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>

            <div className="flex items-center gap-2 bg-[#F5F7F5] rounded-xl px-3 md:px-4 py-2 w-full max-w-xs md:w-72">
              <Search size={16} className="text-[#8AADA0] flex-shrink-0" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent outline-none text-sm flex-1 text-[#1A2E25] min-w-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* ✅ NOUVEAU : Badge "3" supprimé — sera ajouté dynamiquement plus tard */}
            <button className="text-[#8AADA0] hover:text-[#0C6B4E] transition" aria-label="Notifications">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-[#0D1F2D] font-bold text-xs">
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
          </div>
        </div>

        {/* ✅ NOUVEAU : Padding responsive pour le contenu */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AdminLayout
