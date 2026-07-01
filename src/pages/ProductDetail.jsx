import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { ShoppingCart, ArrowLeft, Star, MapPin, Shield, Truck, QrCode } from 'lucide-react'
import WhatsAppButton from '../components/WhatsAppButton'
import { getProduct } from '../api/productApi'
import Avatar from '../components/Avatar' // ✅ NOUVEAU : import du composant Avatar

// ✅ NOUVEAU : tableau vide — fallback supprimé
const PRODUCTS = []

function ProductDetail() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const dispatch    = useDispatch()
  const [qty, setQty]     = useState(1)
  const [added, setAdded] = useState(false)
  const [tab, setTab]     = useState('desc')

  const [product, setProduct] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProduct(id)
        const p = res.product || res
        setProduct({ ...p, id: p.id || p._id })
      } catch (err) {
        // ✅ NOUVEAU : pas de fallback fictif
        setProduct(null)
      }
    }
    fetch()
  }, [id])

  if (!product) return (
    <div className="text-center py-24 px-4">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-lg font-bold text-[#1A2E25]">Produit introuvable</p>
      <button onClick={() => navigate('/')} className="mt-4 text-[#0C6B4E] font-semibold underline">
        Retour à l'accueil
      </button>
    </div>
  )

  const BG = {
    agricole:    'from-[#E8F7F1] to-[#C8EDDD]',
    artisanat:   'from-[#FEF5E0] to-[#FDDEA0]',
    cooperative: 'from-[#FDEEE8] to-[#F9C4B0]',
    default:     'from-[#E8F0FE] to-[#C2D4FA]',
  }
  const bg = BG[product.cat] || BG.default

  function handleAdd() {
    for (let i = 0; i < qty; i++) dispatch(addToCart(product))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-[1300px] mx-auto px-4 sm:px-5 py-6 sm:py-8">

      {/* RETOUR */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-4 sm:mb-6 hover:underline text-sm"
      >
        <ArrowLeft size={16} /> Retour au marché
      </button>

      {/* DÉTAIL PRODUIT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-10 sm:mb-12">

        {/* IMAGE */}
        <div className={`bg-gradient-to-br ${bg} rounded-3xl flex items-center justify-center text-[100px] sm:text-[120px] h-64 sm:h-80 md:h-96`}>
          {product.emoji || (product.image ? (
            <img src={product.image} alt={product.name} // ✅ NOUVEAU : image + loading lazy
                 loading="lazy" className="w-full h-full object-cover rounded-3xl" />
          ) : '🛍')}
        </div>

        {/* INFOS */}
        <div>
          {product.badge && (
            <span className="inline-block bg-[#0C6B4E] text-white text-xs font-bold px-3 py-1 rounded-lg mb-3">
              {product.badge === 'bio' ? '🌱 BIO' : product.badge === 'new' ? 'NOUVEAU' : product.badge === 'promo' ? 'PROMO' : '⭐ TOP'}
            </span>
          )}

          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E25] mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 text-sm text-[#8AADA0] mb-3">
            <MapPin size={14} /> {product.origin}
          </div>

          {product.reviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={16} fill={i <= product.stars ? '#F0A500' : 'none'} color="#F0A500" />
                ))}
              </div>
              <span className="text-sm text-[#8AADA0]">{product.stars}/5 · ({product.reviews} avis)</span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#D95030]">
              {Number(product.price).toLocaleString()} FCFA
            </span>
            <span className="text-sm text-[#8AADA0]">/ {product.unit}</span>
            {product.oldPrice && (
              <span className="text-base text-[#8AADA0] line-through">
                {Number(product.oldPrice).toLocaleString()} FCFA
              </span>
            )}
          </div>

          {/* ✅ NOUVEAU : vendeur avec photo de profil via composant Avatar */}
          {product.seller && (
            <div className="flex items-center gap-3 bg-[#E8F7F1] rounded-xl px-4 py-3 mb-5">
              <Avatar
                user={product.sellerInfo || { name: product.seller, avatar: product.sellerAvatar }}
                size={40}
                clickable={!!product.sellerInfo?.id}
                onClick={() => product.sellerInfo?.id && navigate(`/seller/${product.sellerInfo.id}`)}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#1A2E25] truncate">{product.seller}</p>
                <p className="text-xs text-[#8AADA0]">Vendeur certifié ✅</p>
              </div>
            </div>
          )}

          {/* QUANTITÉ */}
          <div className="flex items-center gap-3 sm:gap-4 mb-5 flex-wrap">
            <span className="text-sm font-semibold text-[#1A2E25]">Quantité :</span>
            <div className="flex items-center gap-3 border border-[#DDE8E2] rounded-lg px-3 py-2">
              <button onClick={() => setQty(q => Math.max(1, q-1))} className="text-[#0C6B4E] font-bold text-lg hover:text-[#18A070] w-6">−</button>
              <span className="font-bold w-6 text-center">{qty}</span>
              <button onClick={() => setQty(q => q+1)} className="text-[#0C6B4E] font-bold text-lg hover:text-[#18A070] w-6">+</button>
            </div>
            <span className="text-sm text-[#8AADA0]">
              Total : <strong className="text-[#D95030]">{(product.price * qty).toLocaleString()} FCFA</strong>
            </span>
          </div>

          <button
            onClick={handleAdd}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl text-base font-bold transition mb-3
              ${added ? 'bg-[#0C6B4E] text-white' : 'bg-amber-400 hover:bg-amber-500 text-[#0D1F2D]'}`}
          >
            <ShoppingCart size={18} />
            {added ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
          </button>
          <WhatsAppButton product={product} />

          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
            {[
              { icon:<Shield size={16}/>,  text:'Paiement sécurisé' },
              { icon:<Truck size={16}/>,   text:'Livraison 28 pays' },
              { icon:<QrCode size={16}/>,  text:'QR Traçabilité'    },
            ].map((g, i) => (
              <div key={i} className="flex flex-col items-center gap-1 bg-[#F5F7F5] rounded-xl py-3 text-center">
                <span className="text-[#0C6B4E]">{g.icon}</span>
                <span className="text-[10px] text-[#4A6355] font-medium">{g.text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ONGLETS */}
      <div className="mb-4 flex gap-1 sm:gap-2 border-b border-[#DDE8E2] overflow-x-auto">
        {['desc','qr','avis'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition border-b-2 -mb-px whitespace-nowrap
              ${tab === t ? 'border-[#0C6B4E] text-[#0C6B4E]' : 'border-transparent text-[#8AADA0] hover:text-[#1A2E25]'}`}
          >
            {t === 'desc' ? '📋 Description' : t === 'qr' ? '📊 Traçabilité QR' : '⭐ Avis clients'}
          </button>
        ))}
      </div>

      {/* CONTENU ONGLETS */}
      <div className="bg-white border border-[#DDE8E2] rounded-2xl p-5 sm:p-6 mb-8 sm:mb-10">
        {tab === 'desc' && (
          <p className="text-sm text-[#4A6355] leading-relaxed">{product.desc || 'Aucune description disponible.'}</p>
        )}
        {tab === 'qr' && (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">📊</div>
            <h3 className="font-bold text-[#1A2E25] mb-2">Traçabilité complète</h3>
            <p className="text-sm text-[#8AADA0] mb-4">Scannez le QR code pour voir l'origine, le producteur et la certification de ce produit.</p>
            <div className="inline-block bg-[#E8F7F1] border-2 border-[#0C6B4E] rounded-2xl p-6 text-6xl">📱</div>
            <p className="text-xs text-[#8AADA0] mt-3">QR Code disponible à la livraison</p>
          </div>
        )}
        {tab === 'avis' && (
          // ✅ NOUVEAU : état vide + composant Avatar réutilisé
          <div className="space-y-4">
            {(product.reviewsList || []).length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">⭐</div>
                <p className="text-sm text-[#8AADA0]">Aucun avis pour ce produit</p>
              </div>
            ) : (
              product.reviewsList.map((avis, i) => (
                <div key={i} className="flex gap-3 pb-4 border-b border-[#DDE8E2] last:border-0">
                  <Avatar user={avis} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-[#1A2E25]">{avis.name}</span>
                      <span className="text-amber-400 text-xs">{'★'.repeat(avis.note)}</span>
                      <span className="text-xs text-[#8AADA0]">{avis.date}</span>
                    </div>
                    <p className="text-sm text-[#4A6355]">{avis.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ✅ NOUVEAU : produits similaires supprimés (fallback supprimé) */}
    </div>
  )
}

export default ProductDetail
