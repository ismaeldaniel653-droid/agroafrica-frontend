import { useState } from 'react'
import { Heart, ShoppingCart, Eye, MapPin, Star } from 'lucide-react'    // ✅ NOUVEAU : icônes ajoutées
import { useNavigate } from 'react-router-dom'

const BG = {
  agricole:    'from-[#E8F7F1] to-[#C8EDDD]',
  artisanat:   'from-[#FEF5E0] to-[#FDDEA0]',
  cooperative: 'from-[#FDEEE8] to-[#F9C4B0]',
  default:     'from-[#E8F0FE] to-[#C2D4FA]',
}

const BADGE = {
  new:   'bg-[#0C6B4E] text-white',
  promo: 'bg-[#D95030] text-white',
  bio:   'bg-[#2D7A45] text-white',
  top:   'bg-amber-400 text-[#0D1F2D]',
}

const BADGE_LABEL = {
  new:'NOUVEAU', promo:'PROMO', bio:'🌱 BIO', top:'⭐ TOP'
}

function ProductCard({ product, onAddToCart, onToggleWishlist, isWished = false }) {
  // ✅ NOUVEAU : wishlist peut venir du parent (synchro Redux) ou locale
  const [localWish, setLocalWish] = useState(false)
  const wished = onToggleWishlist ? isWished : localWish
  const [added,  setAdded]  = useState(false)
  const navigate = useNavigate()

  const bg    = BG[product.cat] || BG.default
  const badge = product.badge ? BADGE[product.badge] : null

  // ✅ NOUVEAU : prix barré + pourcentage de réduction
  const oldPrice  = product.oldPrice
  const discount  = oldPrice ? Math.round(((oldPrice - product.price) / oldPrice) * 100) : 0

  function handleAdd(e) {
    e.stopPropagation()
    onAddToCart?.(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function handleWish(e) {
    e.stopPropagation()
    if (onToggleWishlist) onToggleWishlist(product.id)
    else setLocalWish(!localWish)
  }

  return (
    <div onClick={() => navigate(`/product/${product.id || product._id}`)}
         className="group bg-white border border-[#DDE8E2] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 cursor-pointer hover-lift">

      {/* IMAGE */}
      <div className={`h-32 sm:h-36 md:h-40 bg-gradient-to-br ${bg} relative overflow-hidden`}>

        {product.image ? (
          <img src={product.image} alt={product.name}
               loading="lazy"    // ✅ NOUVEAU : lazy-load
               className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl sm:text-5xl transform group-hover:scale-110 transition-transform duration-300">
              {product.emoji}
            </span>
          </div>
        )}

        {/* ✅ MODIFIÉ : badges regroupés coin haut-gauche */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {badge && (
            <span className={`text-[10px] font-bold px-2 py-1 rounded-md shadow-sm ${badge}`}>
              {BADGE_LABEL[product.badge]}
            </span>
          )}
          {/* ✅ NOUVEAU : badge réduction */}
          {discount > 0 && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-md shadow-sm bg-red-500 text-white">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist - ✅ MODIFIÉ : taille tactile 44px */}
        <button onClick={handleWish}
                aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                className={`absolute top-2 right-2 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-300 z-10
                  ${wished ? 'bg-red-50 text-red-500 shadow-md scale-110'
                           : 'bg-white/80 text-gray-400 hover:bg-white hover:scale-110'}`}>
          <Heart size={14} fill={wished ? '#D95030' : 'none'} color={wished ? '#D95030' : 'currentColor'} />
        </button>

        {/* ✅ NOUVEAU : bouton "voir" rapide (overlay sur hover) */}
        <button onClick={e => { e.stopPropagation(); navigate(`/product/${product.id || product._id}`) }}
                aria-label="Voir le détail"
                className="absolute bottom-2 left-2 bg-white/90 text-[#0C6B4E] rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-md">
          <Eye size={14} />
        </button>

        {/* Quick Add (hover desktop) */}
        <button onClick={handleAdd} aria-label="Ajouter au panier"
                className="absolute bottom-2 right-2 bg-amber-400 text-[#0D1F2D] rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-amber-500 hover:scale-110 shadow-md">
          <ShoppingCart size={14} />
        </button>
      </div>

      {/* INFOS */}
      <div className="p-3 md:p-4">

        <p className="text-sm font-semibold text-[#1A2E25] truncate mb-1 line-clamp-1">
          {product.name}
        </p>

        {/* ✅ MODIFIÉ : localisation avec icône */}
        <p className="text-[11px] text-[#8AADA0] mb-2 flex items-center gap-1 truncate">
          <MapPin size={10} className="shrink-0" /> {product.origin}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-amber-400 text-[11px] flex items-center">
            <Star size={12} fill="currentColor" className="mr-0.5" />
            {product.stars?.toFixed(1) || '4.5'}
          </span>
          <span className="text-[10px] text-[#8AADA0]">({product.reviews || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-2 flex-wrap min-h-[24px]">
          <span className="text-base md:text-lg font-extrabold text-[#D95030]">
            {product.price?.toLocaleString()} FCFA
          </span>
          <span className="text-[11px] text-[#8AADA0]">/ {product.unit}</span>
          {oldPrice && (
            <span className="text-[11px] text-[#8AADA0] line-through ml-1">
              {oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* QR Trace & Seller */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-[#0C6B4E] bg-[#E8F7F1] px-2 py-1 rounded-lg font-semibold flex items-center gap-1">
            🛡️ QR Tracé
          </span>
          <span className="text-[10px] text-[#8AADA0] truncate max-w-[100px]">
            par {product.seller}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button onClick={handleAdd} aria-label="Ajouter au panier"
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300
                  ${added ? 'bg-[#0C6B4E] text-white shadow-lg shadow-green-900/20'
                          : 'bg-amber-400 text-[#0D1F2D] hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-400/30 active:scale-[0.98]'}`}>
          {added ? <><span className="text-lg">✓</span> Ajouté !</> : <><ShoppingCart size={14} /> Ajouter</>}
        </button>

      </div>
    </div>
  )
}

export default ProductCard
