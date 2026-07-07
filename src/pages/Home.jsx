import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../api/productApi'
import { Loader, ShoppingBag, ChevronRight, Sparkles } from 'lucide-react'

function Home({ 
  className = '',
  initialCategory = 'all',
  showPromo = true,
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [activeCat, setActiveCat] = useState(initialCategory)
  const [toast, setToast] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copyToast, setCopyToast] = useState(false)

  // ✅ Chargement des produits
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getProducts()
      const incoming = res?.products ?? res ?? []
      setProducts(Array.isArray(incoming) ? incoming : [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Impossible de charger les produits')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // ✅ Filtrage des produits
  const filtered = useMemo(() => {
    if (activeCat === 'all') return products
    return products.filter(p => (p.cat || p.category) === activeCat)
  }, [products, activeCat])

  // ✅ Gestion du panier
  const handleAddToCart = useCallback((product) => {
    dispatch(addToCart(product))
    setToast(`✅ ${product.name || 'Produit'} ajouté au panier !`)
    setTimeout(() => setToast(null), 3000)
  }, [dispatch])

  // ✅ Copie du code promo
  const handleCopyPromo = useCallback(() => {
    const promoCode = 'AGRO15CMR'
    navigator.clipboard?.writeText(promoCode)
    setCopyToast(true)
    setTimeout(() => setCopyToast(false), 2000)
  }, [])

  // ✅ Nombre de produits
  const productCount = useMemo(() => filtered.length, [filtered])

  return (
    <div className={`${className}`}>
      <Hero />

      <div className="max-w-[1300px] mx-auto px-4 sm:px-5 pb-12">
        {/* Catégories */}
        <Categories 
          activeCat={activeCat} 
          setActiveCat={setActiveCat}
          showCounts={true}
        />

        {/* PROMO */}
        {showPromo && (
          <div className="bg-gradient-to-r from-[var(--bg-nav)] to-[var(--bg-nav)]/90 rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 border border-[var(--border-color)]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={18} className="text-amber-400" />
                <h3 className="text-[var(--text-light)] text-lg sm:text-xl font-extrabold">
                  🎉 Offre de lancement AgroAfrica
                </h3>
              </div>
              <p className="text-[var(--text-light)]/60 text-sm">
                Première commande : <span className="text-amber-400 font-semibold">-15%</span> sur tous les produits camerounais
              </p>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="inline-block bg-amber-400/15 border border-dashed border-amber-400/50 text-amber-400 font-mono font-bold px-4 py-1 rounded-lg text-sm select-all">
                  AGRO15CMR
                </span>
                <button
                  onClick={handleCopyPromo}
                  className="text-xs text-amber-400 hover:text-amber-300 transition font-medium"
                >
                  {copyToast ? '✅ Copié !' : '📋 Copier'}
                </button>
              </div>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold px-6 py-3 rounded-xl transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Découvrir les offres <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* TITRE */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[var(--border-color)]">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span className="text-xl">⭐</span> Produits Vedettes
            <span className="text-xs font-normal text-[var(--text-secondary)] ml-2">
              ({productCount} produit{productCount > 1 ? 's' : ''})
            </span>
          </h2>
          <button
            onClick={() => setActiveCat('all')}
            className="text-xs sm:text-sm text-[var(--accent-primary)] font-semibold border border-[var(--accent-primary)] px-3 sm:px-4 py-1.5 rounded-lg hover:bg-[var(--accent-primary)] hover:text-[var(--text-light)] transition"
          >
            Voir tout →
          </button>
        </div>

        {/* ÉTAT DE CHARGEMENT */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden animate-pulse">
                <div className="h-40 bg-[var(--bg-secondary)]" />
                <div className="p-3 md:p-4 space-y-2">
                  <div className="h-4 bg-[var(--bg-secondary)] rounded w-3/4" />
                  <div className="h-3 bg-[var(--bg-secondary)] rounded w-1/2" />
                  <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/3" />
                  <div className="h-8 bg-[var(--bg-secondary)] rounded w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERREUR */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="font-bold text-red-700 dark:text-red-400">Erreur de chargement</p>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* ÉTAT VIDE */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]">
            <div className="text-5xl mb-3">🛒</div>
            <p className="font-bold text-[var(--text-primary)]">Aucun produit disponible</p>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              {products.length === 0 
                ? 'Revenez bientôt, de nouveaux produits arrivent chaque jour !'
                : 'Aucun produit dans cette catégorie.'
              }
            </p>
            {activeCat !== 'all' && (
              <button
                onClick={() => setActiveCat('all')}
                className="mt-4 text-[var(--accent-primary)] font-semibold hover:underline text-sm"
              >
                Voir tous les produits →
              </button>
            )}
          </div>
        )}

        {/* GRILLE PRODUITS */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map((product) => (
              <ProductCard 
                key={product.id || product._id} 
                product={product} 
                onAddToCart={handleAddToCart}
                size="normal"
              />
            ))}
          </div>
        )}

        {/* BOUTON CHARGER PLUS */}
        {!loading && !error && filtered.length > 10 && (
          <div className="text-center mt-8">
            <button
              onClick={() => {/* Implémenter la pagination */}}
              className="text-[var(--accent-primary)] font-semibold hover:underline text-sm flex items-center justify-center gap-2 mx-auto"
            >
              <Loader size={14} className="animate-spin" />
              Charger plus de produits
            </button>
          </div>
        )}
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 bg-[var(--accent-primary)] text-[var(--text-light)] px-5 py-3 rounded-xl text-sm font-semibold shadow-lg z-50 animate-fade-in max-w-[90vw] flex items-center gap-2">
          <ShoppingBag size={16} />
          {toast}
        </div>
      )}
    </div>
  )
}

export default Home