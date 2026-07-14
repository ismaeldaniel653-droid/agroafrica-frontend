import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/index.js'

import { ThemeProvider } from './contexts/ThemeContext'

// Layout & composants globaux
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import OfflineNotice from './components/OfflineNotice'

// ✅ Lazy loading pour les pages (optimisation des performances)
const Home = lazy(() => import('./pages/Home'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const PaymentStatus = lazy(() => import('./pages/PaymentStatus'))
const Login = lazy(() => import('./pages/Login'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Trace = lazy(() => import('./pages/Trace'))
const Livreur = lazy(() => import('./pages/Livreur'))
const Certification = lazy(() => import('./pages/Certification'))
const AgroAfricaPay = lazy(() => import('./pages/AgroAfricaPay'))
const Profile = lazy(() => import('./pages/Profile'))
const MyOrders = lazy(() => import('./pages/MyOrders'))
const PaiementMobileMoney = lazy(() => import('./pages/PaiementMobileMoney'))
const APropos = lazy(() => import('./pages/APropos'))
const DevenirVendeur = lazy(() => import('./pages/DevenirVendeur'))
const GuideVendeur = lazy(() => import('./pages/GuideVendeur'))
const Livraison = lazy(() => import('./pages/Livraison'))
const Retours = lazy(() => import('./pages/Retours'))
const ServiceClient = lazy(() => import('./pages/ServiceClient'))
const Tarifs = lazy(() => import('./pages/Tarifs'))

// Espace vendeur
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AddProduct = lazy(() => import('./pages/AddProduct'))

// Admin
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))
const AdminUsers = lazy(() => import('./pages/Admin/AdminUsers'))
const AdminProducts = lazy(() => import('./pages/Admin/AdminProducts'))
const AdminOrders = lazy(() => import('./pages/Admin/AdminOrders'))
const AdminStats = lazy(() => import('./pages/Admin/AdminStats'))
const AdminSettings = lazy(() => import('./pages/Admin/AdminSettings'))

// ═══════════════════════════════════════════
// SCROLL TO TOP
// ═══════════════════════════════════════════
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

// ═══════════════════════════════════════════
// LOADER COMPONENT
// ═══════════════════════════════════════════
function PageLoader() {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[var(--text-secondary)]">Chargement...</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// LAYOUTS
// ═══════════════════════════════════════════

// ✅ Layout public — Navbar + contenu + Footer
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

// ✅ Layout sans footer (checkout, paiement, etc.)
function MinimalLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </main>
    </>
  )
}

// ✅ Layout plein écran (login, etc.)
function FullscreenLayout({ children }) {
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  )
}

// ═══════════════════════════════════════════
// 404 PAGE
// ═══════════════════════════════════════════
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4">
      <div className="bg-[var(--bg-card)] rounded-3xl shadow-xl p-8 sm:p-10 max-w-md w-full text-center border border-[var(--border-color)]">
        <div className="text-6xl mb-4">🌿</div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mb-2">
          Page introuvable
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          La page que vous cherchez n'existe pas.
        </p>
        <a href="/"
           className="inline-block bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold px-6 py-3 rounded-xl transition text-sm">
          Retour à l'accueil
        </a>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// APP PRINCIPALE
// ═══════════════════════════════════════════
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<PageLoader />} persistor={persistor}>
        <ThemeProvider>
          <BrowserRouter>
            <ScrollToTop />
            <OfflineNotice />

            <Routes>
              {/* ═══ PUBLIQUES AVEC NAVBAR + FOOTER ═══ */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/product/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
              <Route path="/payment-status/:orderId" element={<PublicLayout><PaymentStatus /></PublicLayout>} />
              <Route path="/trace/:id" element={<PublicLayout><Trace /></PublicLayout>} />
              <Route path="/livreurs" element={<PublicLayout><Livreur /></PublicLayout>} />
              <Route path="/certification" element={<PublicLayout><Certification /></PublicLayout>} />
              <Route path="/profile" element={<PublicLayout><Profile /></PublicLayout>} />
              <Route path="/my-orders" element={<PublicLayout><MyOrders /></PublicLayout>} />
              <Route path="/paiement-mobile-money" element={<PublicLayout><PaiementMobileMoney /></PublicLayout>} />
              <Route path="/a-propos" element={<PublicLayout><APropos /></PublicLayout>} />
              <Route path="/devenir-vendeur" element={<PublicLayout><DevenirVendeur /></PublicLayout>} />
              <Route path="/guide-vendeur" element={<PublicLayout><GuideVendeur /></PublicLayout>} />
              <Route path="/livraison" element={<PublicLayout><Livraison /></PublicLayout>} />
              <Route path="/retours" element={<PublicLayout><Retours /></PublicLayout>} />
              <Route path="/service-client" element={<PublicLayout><ServiceClient /></PublicLayout>} />
              <Route path="/tarifs" element={<PublicLayout><Tarifs /></PublicLayout>} />

              {/* ═══ PUBLIQUES SANS FOOTER ═══ */}
              <Route path="/checkout" element={<MinimalLayout><Checkout /></MinimalLayout>} />
              <Route path="/pay" element={<MinimalLayout><AgroAfricaPay /></MinimalLayout>} />

              {/* ═══ AUTHENTIFICATION — PLEIN ÉCRAN ═══ */}
              <Route path="/login" element={<FullscreenLayout><Login /></FullscreenLayout>} />

              {/* ═══ ESPACE VENDEUR ═══ */}
              <Route path="/dashboard" element={<FullscreenLayout><Dashboard /></FullscreenLayout>} />
              <Route path="/add-product" element={<FullscreenLayout><AddProduct /></FullscreenLayout>} />

              {/* ═══ ADMIN — Layout admin ═══ */}
              <Route path="/admin" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminLayout />
                </Suspense>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="stats" element={<AdminStats />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* ═══ 404 — catch-all ═══ */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App