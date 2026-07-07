
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Package,
  ShoppingBag, TrendingUp, Settings,
  ArrowLeft, Bell, Search, Menu, X,
  LogOut, ChevronDown, User, HelpCircle
} from 'lucide-react'

// ✅ Configuration du menu
const MENU = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/users', icon: Users, label: 'Utilisateurs' },
  { path: '/admin/products', icon: Package, label: 'Produits' },
  { path: '/admin/orders', icon: ShoppingBag, label: 'Commandes' },
  { path: '/admin/stats', icon: TrendingUp, label: 'Statistiques' },
  { path: '/admin/settings', icon: Settings, label: 'Paramètres' },
]

function AdminLayout({ 
  children,
  onLogout,
  className = '',
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector(state => state.auth)

  // ✅ États
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  // ✅ Redirection si non admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  // ✅ Fermer la sidebar sur les écrans larges
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ✅ Fermer les menus avec Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false)
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ✅ Navigation
  const handleNavigate = useCallback((path) => {
    navigate(path)
    setSidebarOpen(false)
    setUserMenuOpen(false)
  }, [navigate])

  // ✅ Déconnexion
  const handleLogout = useCallback(() => {
    if (onLogout) {
      onLogout()
    } else {
      navigate('/login')
    }
    setUserMenuOpen(false)
  }, [onLogout, navigate])

  // ✅ Vérifier si un chemin est actif
  const isActive = useCallback((path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }, [location.pathname])

  // ✅ Initiales de l'utilisateur
  const getUserInitials = useCallback(() => {
    if (!user?.name) return 'A'
    const parts = user.name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }, [user?.name])

  // ✅ Nombre de notifications
  const notificationCount = useMemo(() => {
    return notifications.filter(n => !n.read).length
  }, [notifications])

  return (
    <div className={`min-h-screen bg-[var(--bg-secondary)] flex ${className}`}>
      {/* OVERLAY pour sidebar mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`
          fixed md:static top-0 left-0 h-full w-64 
          bg-[var(--bg-nav)] text-[var(--text-light)]
          flex flex-col flex-shrink-0 z-50 
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        role="navigation"
        aria-label="Menu d'administration"
      >
        {/* LOGO */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xl font-extrabold text-[var(--text-light)] flex items-center gap-1">
              🌿 Agro<span className="text-amber-400">Africa</span>
            </div>
            <div className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Panel Administrateur
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/60 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* PROFIL ADMIN */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center font-bold text-[var(--bg-nav)] text-sm">
            {getUserInitials()}
          </div>
          <div className="min-w-0">
            <p className="text-[var(--text-light)] text-sm font-bold truncate">
              {user?.name || 'Administrateur'}
            </p>
            <p className="text-white/40 text-xs flex items-center gap-1">
              <span className="w-1 h-1 bg-emerald-400 rounded-full" />
              {user?.role || 'Admin'}
            </p>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {MENU.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active 
                    ? 'bg-white/15 text-[var(--text-light)] shadow-md' 
                    : 'text-white/50 hover:bg-white/10 hover:text-white'
                  }
                  focus:outline-none focus:ring-2 focus:ring-amber-400/50
                `}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={18} className={active ? 'text-amber-400' : ''} />
                {item.label}
                {active && (
                  <span className="ml-auto w-1 h-6 bg-amber-400 rounded-full" />
                )}
              </button>
            )
          })}
        </nav>

        {/* BAS DE SIDEBAR */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <button
            onClick={() => handleNavigate('/admin/help')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/40 hover:bg-white/10 hover:text-white transition"
          >
            <HelpCircle size={18} /> Aide
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/40 hover:bg-white/10 hover:text-white transition"
          >
            <ArrowLeft size={18} /> Retour au marché
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="bg-[var(--bg-card)] border-b border-[var(--border-color)] px-4 md:px-8 py-4 flex items-center justify-between gap-3 sticky top-0 z-30">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            {/* Bouton Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition p-1 rounded-lg hover:bg-[var(--bg-secondary)]"
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>

            {/* Barre de recherche */}
            <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-xl px-3 md:px-4 py-2 w-full max-w-xs md:w-72 transition focus-within:ring-2 focus-within:ring-[var(--accent-primary)]">
              <Search size={16} className="text-[var(--text-secondary)] flex-shrink-0" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 min-w-0"
                aria-label="Rechercher dans l'administration"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* Notifications */}
            <button 
              className="relative text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition p-1.5 rounded-lg hover:bg-[var(--bg-secondary)]"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Menu utilisateur */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-[var(--bg-secondary)] transition"
                aria-label="Menu utilisateur"
                aria-expanded={userMenuOpen}
              >
                <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-[var(--bg-nav)] font-bold text-xs">
                  {getUserInitials()}
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-[var(--text-secondary)] transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown utilisateur */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-card)] rounded-xl shadow-2xl border border-[var(--border-color)] overflow-hidden z-50 animate-fade-in-fast">
                  <div className="px-4 py-3 border-b border-[var(--border-color)]">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {user?.name || 'Administrateur'}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      {user?.email || 'admin@agroafrica.com'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigate('/admin/profile')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition text-left"
                  >
                    <User size={16} /> Mon profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left border-t border-[var(--border-color)]"
                  >
                    <LogOut size={16} /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}

// ✅ Export avec vérification des routes
export const ProtectedAdminRoute = ({ children }) => {
  const { user } = useSelector(state => state.auth)
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />
  }
  
  return children
}

export default AdminLayout