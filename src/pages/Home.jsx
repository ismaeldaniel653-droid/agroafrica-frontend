import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../api/productApi'

// TODO: liste vide — les produits viennent uniquement de l'API
const PRODUCTS = []

function Home() {
  const navigate = useNavigate()
  const [activeCat, setActiveCat] = useState('all')
  const [toast, setToast] = useState(null)
  const dispatch = useDispatch()
  // Initialisation avec un tableau vide pour éviter le flash
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await getProducts()
        const incoming = res?.products ?? res
        setProducts(Array.isArray(incoming) ? incoming : [])
      } catch (err) {
        setProducts([])
        console.warn('API produits inaccessible — affichage état vide')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = activeCat === 'all'
    ? products
    : products.filter(p => p.cat === activeCat)

  function handleAddToCart(product) {
    dispatch(addToCart(product))
    setToast(`✅ ${product.name} ajouté !`)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div>
      <Hero />

      <div className="max-w-[1300px] mx-auto px-4 sm:px-5 pb-12">

        <Categories activeCat={activeCat} setActiveCat={setActiveCat} />

        {/* PROMO */}
        <div className="bg-gradient-to-r from-[#0D1F2D] to-[#1A3A52] rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8">
          <div>
            <h3 className="text-white text-lg sm:text-xl font-extrabold mb-1">🎉 Offre de lancement AgroAfrica</h3>
            <p className="text-white/60 text-sm">Première commande : -15% sur tous les produits camerounais</p>
            <span className="inline-block mt-2 bg-amber-400/15 border border-dashed border-amber-400/50 text-amber-400 font-mono font-bold px-4 py-1 rounded-lg text-sm select-all">
              AGRO15CMR
            </span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText('AGRO15CMR')
              // Créer un toast temporaire pour confirmer la copie
              const toastEl = document.createElement('div')
              toastEl.textContent = '✅ Code promo AGRO15CMR copié !'
              toastEl.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#0C6B4E] text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg z-[60] animate-fade-in sm:left-auto sm:right-6 sm:bottom-6'
              document.body.appendChild(toastEl)
              setTimeout(() => {
                toastEl.remove()
              }, 2000)
            }}
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold px-6 py-3 rounded-lg transition whitespace-nowrap"
          >
            Copier le code promo →
          </button>
        </div>

        {/* TITRE */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#E8F7F1]">
          <h2 className="text-base sm:text-lg font-bold">⭐ Produits Vedettes</h2>
          <button
            onClick={() => setActiveCat('all')}
            className="text-xs sm:text-sm text-[#0C6B4E] font-semibold border border-[#0C6B4E] px-3 sm:px-4 py-1.5 rounded-lg hover:bg-[#0C6B4E] hover:text-white transition"
          >
            Voir tout →
          </button>
        </div>

        {/* ÉTAT DE CHARGEMENT */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white border border-[#DDE8E2] rounded-2xl overflow-hidden animate-pulse">
                <div className="h-40 bg-[#E8F0EB]" />
                <div className="p-3 md:p-4 space-y-2">
                  <div className="h-4 bg-[#E8F0EB] rounded w-3/4" />
                  <div className="h-3 bg-[#E8F0EB] rounded w-1/2" />
                  <div className="h-4 bg-[#E8F0EB] rounded w-1/3" />
                  <div className="h-8 bg-[#E8F0EB] rounded w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ÉTAT VIDE */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#DDE8E2]">
            <div className="text-5xl mb-3">🛒</div>
            <p className="font-bold text-[#1A2E25]">Aucun produit disponible pour le moment</p>
            <p className="text-sm text-[#8AADA0] mt-2">Revenez bientôt, de nouveaux produits arrivent chaque jour !</p>
          </div>
        )}

        {/* GRILLE PRODUITS */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map(p => (
              <ProductCard key={p.id || p._id} product={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}

      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 bg-[#0C6B4E] text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg z-50 animate-bounce max-w-[90vw]">
          {toast}
        </div>
      )}
    </div>
  )
}

export default Home