import { useState, useRef, useEffect } from 'react'
import { 
  ShoppingCart, User, Package, Leaf, 
  Search, Menu, X, MapPin, Bell, LogOut, ChevronDown
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { changeQty, removeFromCart } from '../store/cartSlice'
import { logout } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import CartDrawer from './CartDrawer'

const CATS = [
  '☰ Toutes catégories','🌾 Céréales','🍫 Cacao & Café','🌶️ Épices',
  '🎨 Tissus','🏺 Poterie','🧺 Vannerie','🍯 Miel','💎 Bijoux','🌱 Bio'
]

// ✅ NOUVEAU : helper pour générer un avatar par défaut à partir du nom
const getInitials = (name = '') => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function Navbar() {
  const [search,    setSearch]    = useState('')
  const [activeNav, setActiveNav] = useState(0)
  const [cartOpen,  setCartOpen]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)    // ✅ NOUVEAU : drawer mobile (Menu burger)
  const [searchOpen,setSearchOpen]= useState(false)    // ✅ NOUVEAU : barre recherche plein écran sur mobile
  const navigate = useNavigate()

  const dispatch  = useDispatch()
  const cartItems = useSelector(state => state.cart.items)
  const cartCount = cartItems.reduce((s, c) => s + c.qty, 0)

  // ✅ NOUVEAU : on récupère l'utilisateur depuis le store (authSlice enrichi)
  const user = useSelector(state => state.auth?.user) || null
  const avatarUrl = user?.avatarUrl || user?.avatar || null     // ✅ NOUVEAU
  const userName  = user?.name  || user?.fullName || 'Invité'   // ✅ NOUVEAU

  return (
    <>
      {/* TOPBAR - ✅ NOUVEAU : tronqué sur mobile pour éviter le débordement */}
      <div className="bg-[#0D1F2D] text-[#cde8dc] text-[11px] md:text-xs text-center py-1.5 px-2 font-medium tracking-wide truncate">
        🌍 <span className="hidden sm:inline">Livraison dans</span>{' '}
        <span className="text-amber-400">28 pays africains</span>{' '}
        <span className="hidden sm:inline">—</span>{' '}
        <span className="sm:hidden">·</span>{' '}
        Paiement Mobile Money 📱
      </div>

      {/* NAVBAR */}
      <nav className="bg-[#0C6B4E] sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1300px] mx-auto px-3 md:px-5 h-16 flex items-center gap-2 md:gap-4">

          {/* ============================================ */}
          {/* MOBILE BURGER    ✅ NOUVEAU : ouvre le drawer */}
          {/* ============================================ */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>

          {/* LOGO */}
          <div
            onClick={() => navigate('/')}
            className="text-xl md:text-2xl font-extrabold text-white whitespace-nowrap cursor-pointer flex items-center gap-1.5 md:gap-2"
          >
            <Leaf size={22} className="text-amber-400 shrink-0" />
            <span className="hidden xs:inline">Agro<span className="text-amber-400">Africa</span></span>
          </div>

          {/* ============================================ */}
          {/* LOCALISATION         ✅ NOUVEAU : caché mobile pour gagner de la place */}
          {/* ============================================ */}
          <div className="hidden lg:flex text-[#cde8dc] text-xs flex-col whitespace-nowrap">
            <span className="flex items-center gap-1"><MapPin size={12}/> Livrer à</span>
            <strong className="text-white text-sm">Yaoundé, CMR</strong>
          </div>

          {/* ============================================ */}
          {/* RECHERCHE DESKTOP    ✅ MODIFIÉ : caché sur mobile */}
          {/* ============================================ */}
          <div className="hidden md:flex flex-1 rounded-lg overflow-hidden shadow-md">
            <select className="bg-[#e8f0eb] border-none px-3 text-xs min-w-[110px] cursor-pointer outline-none">
              <option>Tout</option>
              <option>🌾 Agricole</option>
              <option>🎨 Artisanat</option>
              <option>🤝 Coopératives</option>
              <option>☕ Café/Cacao</option>
            </select>
            <input
              type="text"
              placeholder="Chercher cacao, bogolan, café..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 text-sm outline-none text-[#1A2E25] min-w-0"
            />
            <button className="bg-amber-400 w-12 flex items-center justify-center text-lg hover:bg-amber-500 transition shrink-0">
              🔍
            </button>
          </div>

          {/* ESPACEUR MOBILE */}
          <div className="flex-1 md:hidden" />

          {/* ICONES */}
          <div className="flex items-center gap-0.5 md:gap-1">

            {/* ✅ NOUVEAU : loupe recherche mobile */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
              aria-label="Rechercher"
            >
              <Search size={20} />
            </button>

            {/* PANIER */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-white px-2 md:px-3 py-1.5 rounded-lg flex flex-col items-center text-[10px] md:text-[11px] gap-0.5 hover:bg-white/10 transition"
              aria-label={`Panier (${cartCount} article${cartCount>1?'s':''})`}
            >
              <ShoppingCart size={22} />
              <span className="hidden md:inline">Panier</span>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 md:right-1 bg-amber-400 text-[#0D1F2D] rounded-full min-w-[16px] h-4 px-1 text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* ✅ NOUVEAU : DROPDOWN UTILISATEUR (Mon compte + Déconnexion) */}
            <div className="relative ml-1 group">
              <button
                className="flex items-center gap-1 text-white hover:bg-white/10 rounded-lg px-2 py-1 transition"
                title={userName}
                aria-label="Mon compte"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white/30 group-hover:border-amber-400 transition-all"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-amber-400 text-[#0D1F2D] font-bold text-sm flex items-center justify-center border-2 border-white/30 group-hover:border-white transition-all">
                    {getInitials(userName)}
                  </div>
                )}
                <ChevronDown size={14} className="hidden md:block text-white/70 group-hover:text-white transition-colors" />
              </button>

              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-bold text-[#1A2E25] truncate">{userName}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#1A2E25] hover:bg-[#E8F0EB] transition text-left"
                >
                  <User size={16} /> Mon profil
                </button>
                <button
                  onClick={() => { dispatch(logout()); navigate('/') }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition text-left rounded-b-xl"
                >
                  <LogOut size={16} /> Déconnexion
                </button>
              </div>
            </div>

            {/* COMMANDES */}
            <button
              onClick={() => navigate('/my-orders')}
              className="hidden sm:flex text-white px-2 md:px-3 py-1.5 rounded-lg flex-col items-center text-[10px] md:text-[11px] gap-0.5 hover:bg-white/10 transition"
            >
              <Package size={22} />
              <span className="hidden md:inline">Commandes</span>
            </button>

          </div>
        </div>

        {/* NAV2 - Catégories */}
        <div className="bg-[#0A5C42] border-t border-white/10">
          {/* ✅ NOUVEAU : scroll horizontal natif mobile (snap + scrollbar caché) */}
          <div className="max-w-[1300px] mx-auto px-3 md:px-5 h-9 flex items-center gap-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {CATS.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveNav(i)}
                className={`text-[12.5px] font-medium px-3 py-1 rounded whitespace-nowrap transition snap-start shrink-0
                  ${activeNav === i
                    ? 'bg-white/20 text-white'
                    : 'text-[#cde8dc] hover:bg-white/10 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ============================================== */}
      {/* ✅ NOUVEAU : DRAWER MOBILE (Menu burger)         */}
      {/* ============================================== */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden animate-fade-in"
          onClick={() => setMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Drawer */}
          <div
            onClick={e => e.stopPropagation()}
            className="absolute top-0 left-0 h-full w-[280px] bg-white shadow-2xl animate-slide-in-right flex flex-col"
          >
            <div className="bg-[#0C6B4E] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf size={22} className="text-amber-400" />
                <span className="font-extrabold text-lg">Agro<span className="text-amber-400">Africa</span></span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profil */}
            <button
              onClick={() => { setMenuOpen(false); navigate('/profile') }}
              className="flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-400 text-[#0D1F2D] font-bold flex items-center justify-center">
                  {getInitials(userName)}
                </div>
              )}
              <div className="text-left">
                <p className="font-bold text-[#1A2E25] text-sm">{userName}</p>
                <p className="text-xs text-gray-500">Voir mon profil →</p>
              </div>
            </button>

            {/* Liens rapides */}
            <nav className="flex-1 overflow-y-auto py-2">
              {[
                { icon: '🏠', label: 'Accueil',         to: '/' },
                { icon: '📦', label: 'Mes commandes',    to: '/my-orders' },
                { icon: '🚚', label: 'Livreurs',         to: '/livreurs' },
                { icon: '🛡️', label: 'Certification',   to: '/certification' },
                { icon: '💳', label: 'AgroAfrica Pay',  to: '/pay' },
              ].map((l, i) => (
                <button
                  key={i}
                  onClick={() => { setMenuOpen(false); navigate(l.to) }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#1A2E25] hover:bg-[#E8F0EB] transition text-left"
                >
                  <span className="text-lg">{l.icon}</span>
                  {l.label}
                </button>
              ))}
            </nav>

            <div className="p-3 border-t border-gray-100 text-center text-[11px] text-gray-400">
              © {new Date().getFullYear()} AgroAfrica 🇨🇲
            </div>
          </div>
        </div>
      )}

      {/* ============================================== */}
      {/* ✅ NOUVEAU : RECHERCHE PLEIN ÉCRAN MOBILE        */}
      {/* ============================================== */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden bg-white animate-fade-in flex flex-col"
          onClick={() => setSearchOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#0C6B4E] px-3 h-16 flex items-center gap-2"
          >
            <div className="flex-1 flex rounded-lg overflow-hidden bg-white">
              <input
                autoFocus
                type="text"
                placeholder="Chercher cacao, bogolan, café..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-4 py-3 text-sm outline-none text-[#1A2E25]"
              />
              <button className="bg-amber-400 w-12 flex items-center justify-center text-lg">🔍</button>
            </div>
            <button
              onClick={() => setSearchOpen(false)}
              className="text-white p-2 rounded-lg hover:bg-white/10"
              aria-label="Fermer"
            >
              <X size={22} />
            </button>
          </div>

          {/* ✅ NOUVEAU : suggestions instantanées */}
          <div className="flex-1 overflow-y-auto p-4">
            {search.trim() === '' ? (
              <>
                <p className="text-xs text-gray-400 mb-3 font-semibold">TENDANCES</p>
                {['Cacao bio', 'Bogolan', 'Café arabica', 'Miel sauvage', 'Poterie'].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSearch(s)}
                    className="block w-full text-left py-3 px-2 text-sm text-[#1A2E25] hover:bg-gray-50 rounded-lg"
                  >
                    🔍 {s}
                  </button>
                ))}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Recherche de « <strong>{search}</strong> »…
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
