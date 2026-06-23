import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

// Layout & composants globaux
import Navbar        from './components/Navbar'
import Footer        from './components/Footer'
import OfflineNotice from './components/OfflineNotice'

// Pages publiques
import Home           from './pages/Home'
import ProductDetail  from './pages/ProductDetail'
import PaymentStatus  from './pages/PaymentStatus'
import Login          from './pages/Login'
import Checkout       from './pages/Checkout'
import Trace          from './pages/Trace'
import Livreur        from './pages/Livreur'
import Certification  from './pages/Certification'
import AgroAfricaPay  from './pages/AgroAfricaPay'
import Profile        from './pages/Profile'      // ✅ NOUVEAU : profil + photo upload
import MyOrders       from './pages/MyOrders'

// Espace vendeur
import Dashboard     from './pages/Dashboard'
import AddProduct    from './pages/AddProduct'   // ✅ NOUVEAU : ajout produit avec photo

// Admin
import AdminLayout     from './pages/Admin/AdminLayout'
import AdminDashboard  from './pages/Admin/AdminDashboard'
import AdminUsers      from './pages/Admin/AdminUsers'
import AdminProducts   from './pages/Admin/AdminProducts'
import AdminOrders     from './pages/Admin/AdminOrders'
import AdminStats      from './pages/Admin/AdminStats'
import AdminSettings   from './pages/Admin/AdminSettings'

/* Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/* ✅ NOUVEAU : Layout public — Navbar + contenu + Footer */
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

/* ✅ NOUVEAU : détecteur de pages sans Footer (login, checkout, etc.) */
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <OfflineNotice />

      <Routes>

        {/* ════════ PUBLIQUES AVEC NAVBAR + FOOTER ════════ */}
        <Route path="/"             element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/product/:id"  element={<PublicLayout><ProductDetail /></PublicLayout>} />
        <Route path="/checkout"     element={<><Navbar /><Checkout /></>} />
        <Route path="/payment-status/:orderId" element={<PublicLayout><PaymentStatus /></PublicLayout>} />
        <Route path="/trace/:id"    element={<><Navbar /><Trace /></>} />
        <Route path="/livreurs"     element={<PublicLayout><Livreur /></PublicLayout>} />
        <Route path="/certification" element={<PublicLayout><Certification /></PublicLayout>} />
        <Route path="/pay"          element={<><Navbar /><AgroAfricaPay /></>} />
        <Route path="/profile"      element={<PublicLayout><Profile /></PublicLayout>} />
        <Route path="/my-orders"    element={<PublicLayout><MyOrders /></PublicLayout>} />

        {/* ✅ NOUVEAU : page de modification du profil — pas de Footer (état d'édition) */}
        {/* (déjà couverte par /profile ci-dessus, garde seulement la route) */}

        {/* ════════ AUTHENTIFICATION — PLEIN ÉCRAN (sans Navbar/Footer) ════════ */}
        <Route path="/login" element={<Login />} />

        {/* ════════ ESPACE VENDEUR — Layout sombre interne au Dashboard ════════ */}
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/add-product"  element={<AddProduct />} />

        {/* ════════ ADMIN — Layout admin (sidebar dédiée) ════════ */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index            element={<AdminDashboard />} />
          <Route path="users"     element={<AdminUsers />} />
          <Route path="products"  element={<AdminProducts />} />
          <Route path="orders"    element={<AdminOrders />} />
          <Route path="stats"     element={<AdminStats />} />
          <Route path="settings"  element={<AdminSettings />} />
        </Route>

        {/* ═════════ 404 — fallback ═════════ */}
        {/* ✅ NOUVEAU : route catch-all pour éviter un écran blanc */}
        <Route path="*" element={
          <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 max-w-md w-full text-center border border-[#DDE8E2]">
              <div className="text-6xl mb-4">🌿</div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E25] mb-2">
                Page introuvable
              </h1>
              <p className="text-sm text-[#8AADA0] mb-6">
                La page que vous cherchez n'existe pas.
              </p>
              <a href="/"
                 className="inline-block bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold px-6 py-3 rounded-xl transition text-sm">
                Retour à l'accueil
              </a>
            </div>
          </div>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App
