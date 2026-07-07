import { useState, useRef, useEffect } from 'react'
import {
  ShoppingCart,
  User,
  Package,
  Leaf,
  Search,
  Menu,
  X,
  MapPin,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { changeQty, removeFromCart } from '../store/cartSlice'
import { logout } from '../store/authSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import CartDrawer from './CartDrawer'
import ThemeToggle from './common/ThemeToggle'
import { useTheme } from '../contexts/ThemeContext'

const CATS = [
  { id: 'all', label: '☰ Toutes catégories', slug: 'toutes' },
  { id: 'cereales', label: '🌾 Céréales', slug: 'cereales' },
  { id: 'cafe', label: '🍫 Cacao & Café', slug: 'cafe-cacao' },
  { id: 'epices', label: '🌶️ Épices', slug: 'epices' },
  { id: 'tissus', label: '🎨 Tissus', slug: 'tissus' },
  { id: 'poterie', label: '🏺 Poterie', slug: 'poterie' },
  { id: 'vannerie', label: '🧺 Vannerie', slug: 'vannerie' },
  { id: 'miel', label: '🍯 Miel', slug: 'miel' },
  { id: 'bijoux', label: '💎 Bijoux', slug: 'bijoux' },
  { id: 'bio', label: '🌱 Bio', slug: 'bio' },
]

// Helper pour générer un avatar par défaut à partir du nom
const getInitials = (name = '') => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function Navbar() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { theme, toggleTheme } = useTheme()

  // Récupération du panier
  const cartItems = useSelector((state) => state.cart?.items || [])
  const cartCount = cartItems.reduce((s, c) => s + (c.qty || 0), 0)

  // Récupération de l'utilisateur
  const user = useSelector((state) => state.auth?.user) || null
  const avatarUrl = user?.avatarUrl || user?.avatar || null
  const userName = user?.name || user?.fullName || 'Invité'
  const userEmail = user?.email || ''

  // Fermer le dropdown en cliquant ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Gestion de la recherche
  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`)
      setSearchOpen(false)
      setSearch('')
    }
  }

  // Gestion de la catégorie
  const handleCategoryClick = (catId, catSlug) => {
    setActiveCategory(catId)
    navigate(`/?category=${catSlug}`)
  }

  // Gestion de la déconnexion
  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setIsDropdownOpen(false)
  }

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true

  return (
    <>
      {/* TOPBAR */}
      <div className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[11px] md:text-xs text-center py-1.5 px-2 font-medium tracking-wide truncate border-b border-[var(--border-color)]">
        🌍 <span className="hidden sm:inline">Livraison dans</span>{' '}
        <span className="text-[var(--accent-secondary)] font-semibold">28 pays africains</span>{' '}
        <span className="hidden sm:inline">—</span>{' '}
        <span className="sm:hidden">·</span>{' '}
        <span className="text-[var(--accent-primary)]">Paiement Mobile Money</span> 📱
      </div>

      {/* NAVBAR */}
      <nav className="bg-[var(--accent-primary)] sticky top-0 z-50 shadow-lg" role="navigation" aria-label="Navigation principale">
        <div className="max-w-[1300px] mx-auto px-3 md:px-5 h-16 flex items-center gap-2 md:gap-4">
          
          {/* MOBILE BURGER */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-[var(--bg-card)] p-2 rounded-lg hover:bg-black/10 transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-secondary)]"
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>

          {/* LOGO */}
          <div
            onClick={() => navigate('/')}
            className="text-lg sm:text-xl md:text-2xl font-extrabold text-[var(--bg-card)] whitespace-nowrap cursor-pointer flex items-center gap-1.5 md:gap-2 hover:opacity-90 transition"
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          >
            <Leaf size={20} className="text-[var(--accent-secondary)] shrink-0 md:size-[22px]" />
            <span>
              Agro<span className="text-[var(--accent-secondary)]">Africa</span>
            </span>
          </div>

          {/* LOCALISATION */}
          <div className="hidden lg:flex text-[var(--text-secondary)] text-xs flex-col whitespace-nowrap border-l border-[var(--border-color)] pl-3">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> Livrer à
            </span>
            <strong className="text-[var(--bg-card)] text-sm">Yaoundé, CMR</strong>
          </div>

          {/* RECHERCHE DESKTOP */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 rounded-lg overflow-hidden shadow-md"
          >
            <select 
              className="bg-[var(--bg-secondary)] border-none px-3 text-xs min-w-[110px] cursor-pointer outline-none text-[var(--text-primary)] h-full"
              aria-label="Filtre de catégorie"
            >
              <option value="">Tout</option>
              <option value="agricole">🌾 Agricole</option>
              <option value="artisanat">🎨 Artisanat</option>
              <option value="cooperative">🤝 Coopératives</option>
              <option value="cafe">☕ Café/Cacao</option>
            </select>
            <input
              type="text"
              placeholder="Chercher cacao, bogolan, café..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm outline-none text-[var(--text-primary)] min-w-0 bg-[var(--bg-card)]/70"
              aria-label="Rechercher un produit"
            />
            <button
              type="submit"
              className="bg-[var(--accent-secondary)] w-12 flex items-center justify-center text-lg hover:bg-black/10 transition shrink-0"
              aria-label="Lancer la recherche"
            >
              🔍
            </button>
          </form>

          {/* ESPACEUR MOBILE */}
          <div className="flex-1 md:hidden" />

          {/* ICONES */}
          <div className="flex items-center gap-0.5 md:gap-1">
            {/* Recherche mobile */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden text-[var(--bg-card)] p-2 rounded-lg hover:bg-black/10 transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-secondary)]"
              aria-label="Rechercher"
            >
              <Search size={20} />
            </button>

            {/* Panier */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-[var(--bg-card)] px-2 md:px-3 py-1.5 rounded-lg flex flex-col items-center text-[10px] md:text-[11px] gap-0.5 hover:bg-black/10 transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-secondary)]"
              aria-label={`Panier (${cartCount} article${cartCount > 1 ? 's' : ''})`}
            >
              <ShoppingCart size={22} />
              <span className="hidden md:inline text-[10px]">Panier</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 md:right-0 bg-[var(--accent-secondary)] text-[var(--text-primary)] rounded-full min-w-[18px] h-[18px] px-1 text-[10px] font-bold flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* DROPDOWN UTILISATEUR */}
            <div className="relative ml-1" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-[var(--bg-card)] hover:bg-black/10 rounded-lg px-2 py-1 transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-secondary)]"
                title={userName}
                aria-label="Mon compte"
                aria-expanded={isDropdownOpen}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white/30 hover:border-[var(--accent-secondary)] transition-all"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[var(--accent-secondary)] text-[var(--text-primary)] font-bold text-sm flex items-center justify-center border-2 border-white/30 hover:border-[var(--bg-card)] transition-all">
                    {getInitials(userName)}
                  </div>
                )}
                <ChevronDown 
                  size={14} 
                  className={`hidden md:block text-[var(--bg-card)]/80 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Menu déroulant */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-card)] text-[var(--text-primary)] rounded-xl shadow-2xl border border-[var(--border-color)] z-50 overflow-hidden">
                  <div className="p-3 border-b border-[var(--border-color)]">
                    <p className="text-sm font-bold truncate">{userName}</p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{userEmail}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                        🔑 Admin
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate('/profile')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--bg-secondary)] transition text-left"
                  >
                    <User size={16} /> Mon profil
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        navigate('/admin')
                        setIsDropdownOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--bg-secondary)] transition text-left text-purple-600"
                    >
                      <Package size={16} /> Dashboard Admin
                    </button>
                  )}

                  <button
                    onClick={() => {
                      navigate('/my-orders')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--bg-secondary)] transition text-left"
                  >
                    <Package size={16} /> Mes commandes
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left border-t border-[var(--border-color)]"
                  >
                    <LogOut size={16} /> Déconnexion
                  </button>
                </div>
              )}
            </div>

            {/* THÈME */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Commandes (desktop) */}
            <button
              onClick={() => navigate('/my-orders')}
              className="hidden sm:flex text-[var(--bg-card)] px-2 md:px-3 py-1.5 rounded-lg flex-col items-center text-[10px] md:text-[11px] gap-0.5 hover:bg-black/10 transition"
              aria-label="Mes commandes"
            >
              <Package size={22} />
              <span className="hidden md:inline text-[10px]">Commandes</span>
            </button>
          </div>
        </div>

        {/* CATÉGORIES */}
        <div className="bg-[var(--accent-primary)]/95 border-t border-[var(--border-color)]/30">
          <div className="max-w-[1300px] mx-auto px-3 md:px-5 h-10 flex items-center gap-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {CATS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id, cat.slug)}
                className={`text-[12.5px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition snap-start shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-[var(--bg-card)]/30 text-[var(--bg-card)] shadow-md'
                    : 'text-[var(--bg-card)]/80 hover:bg-[var(--bg-card)]/20 hover:text-[var(--bg-card)]'
                }`}
                aria-current={activeCategory === cat.id ? 'page' : undefined}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 animate-fade-in" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-0 left-0 h-full w-[280px] bg-[var(--bg-card)] shadow-2xl animate-slide-in-right flex flex-col"
          >
            <div className="bg-[var(--accent-primary)] text-[var(--bg-card)] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf size={22} className="text-[var(--accent-secondary)]" />
                <span className="font-extrabold text-lg">
                  Agro
                  <span className="text-[var(--accent-secondary)]">Africa</span>
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 hover:bg-black/10 rounded-lg transition"
                aria-label="Fermer le menu"
              >
                <X size={20} />
              </button>
            </div>

            <button
              onClick={() => {
                setMenuOpen(false)
                navigate('/profile')
              }}
              className="flex items-center gap-3 p-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[var(--accent-secondary)] text-[var(--text-primary)] font-bold flex items-center justify-center">
                  {getInitials(userName)}
                </div>
              )}
              <div className="text-left flex-1 min-w-0">
                <p className="font-bold text-[var(--text-primary)] text-sm truncate">{userName}</p>
                <p className="text-xs text-[var(--text-secondary)] truncate">{userEmail || 'Voir mon profil →'}</p>
              </div>
            </button>

            <nav className="flex-1 overflow-y-auto py-2" role="navigation">
              {[
                { icon: '🏠', label: 'Accueil', to: '/' },
                { icon: '📦', label: 'Mes commandes', to: '/my-orders' },
                { icon: '🚚', label: 'Livreurs', to: '/livreurs' },
                { icon: '🛡️', label: 'Certification', to: '/certification' },
                { icon: '💳', label: 'AgroAfrica Pay', to: '/pay' },
                { icon: '🤝', label: 'Devenir vendeur', to: '/devenir-vendeur' },
                { icon: '📞', label: 'Service client', to: '/service-client' },
              ].map((link, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setMenuOpen(false)
                    navigate(link.to)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition text-left"
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </button>
              ))}

              {/* Thème dans le menu mobile */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-color)] mt-2">
                <span className="text-sm text-[var(--text-primary)]">🌓 Thème</span>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition"
                  aria-label="Basculer le thème"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </nav>

            <div className="p-3 border-t border-[var(--border-color)] text-center text-[11px] text-[var(--text-secondary)]">
              © {new Date().getFullYear()} AgroAfrica 🇨🇲
            </div>
          </div>
        </div>
      )}

      {/* RECHERCHE PLEIN ÉCRAN MOBILE */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden bg-[var(--bg-card)] flex flex-col"
          onClick={() => setSearchOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--accent-primary)] px-3 h-16 flex items-center gap-2"
          >
            <form onSubmit={handleSearch} className="flex-1 flex rounded-lg overflow-hidden bg-[var(--bg-card)]/70">
              <input
                autoFocus
                type="text"
                placeholder="Chercher cacao, bogolan, café..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-3 text-sm outline-none text-[var(--text-primary)] bg-transparent"
                aria-label="Rechercher"
              />
              <button 
                type="submit" 
                className="bg-[var(--accent-secondary)] w-12 flex items-center justify-center text-lg hover:bg-black/10 transition"
                aria-label="Lancer la recherche"
              >
                🔍
              </button>
            </form>
            <button
              onClick={() => setSearchOpen(false)}
              className="text-[var(--bg-card)] p-2 rounded-lg hover:bg-white/10 transition"
              aria-label="Fermer la recherche"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {search.trim() === '' ? (
              <>
                <p className="text-xs text-[var(--text-secondary)] mb-3 font-semibold uppercase tracking-wider">
                  🔥 TENDANCES
                </p>
                {['Cacao bio', 'Bogolan', 'Café arabica', 'Miel sauvage', 'Poterie'].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSearch(s)
                      // Soumettre automatiquement après une petite pause
                      setTimeout(() => {
                        navigate(`/?search=${encodeURIComponent(s)}`)
                        setSearchOpen(false)
                      }, 100)
                    }}
                    className="block w-full text-left py-3 px-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition"
                  >
                    🔍 {s}
                  </button>
                ))}
              </>
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">
                Recherche de « <strong className="text-[var(--text-primary)]">{search}</strong> »…
              </p>
            )}
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      <CartDrawer
        cart={cartItems}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onChangeQty={(id, delta) => dispatch(changeQty({ id, delta }))}
        onRemove={(id) => dispatch(removeFromCart(id))}
      />
    </>
  )
}

export default Navbar