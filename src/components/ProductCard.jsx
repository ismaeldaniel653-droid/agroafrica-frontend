import { useState, useCallback, useMemo } from 'react'
import { Heart, ShoppingCart, Eye, MapPin, Star, Check, Truck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ✅ Configuration des styles par catégorie
const BG = {
  agricole: 'from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5',
  artisanat: 'from-amber-100/50 to-amber-200/30',
  cooperative: 'from-blue-100/50 to-blue-200/30',
  default: 'from-gray-100 to-gray-200/50',
}

const BADGE_STYLES = {
  new: 'bg-[var(--accent-primary)] text-[var(--bg-card)]',
  promo: 'bg-red-500 text-white',
  bio: 'bg-emerald-600 text-white',
  top: 'bg-amber-400 text-[var(--text-primary)]',
  premium: 'bg-purple-600 text-white',
}

const BADGE_LABELS = {
  new: '🆕 NOUVEAU',
  promo: '🔥 PROMO',
  bio: '🌱 BIO',
  top: '⭐ TOP',
  premium: '💎 PREMIUM',
}

// ✅ Configuration des tailles
const SIZES = {
  small: { image: 'h-24', padding: 'p-2', fontSize: 'text-xs' },
  normal: { image: 'h-32 sm:h-36 md:h-40', padding: 'p-3 md:p-4', fontSize: 'text-sm' },
  large: { image: 'h-48 sm:h-52 md:h-56', padding: 'p-4 md:p-5', fontSize: 'text-base' },
}

function ProductCard({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isWished = false,
  size = 'normal',
  showQuickView = true,
  className = '',
  onClick,
}) {
  const [localWish, setLocalWish] = useState(false)
  const [added, setAdded] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const navigate = useNavigate()

  // ✅ Déterminer si le produit est dans la wishlist
  const wished = onToggleWishlist ? isWished : localWish

  // ✅ Calculer la réduction
  const discount = useMemo(() => {
    if (product.oldPrice && product.price) {
      return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    }
    return 0
  }, [product.oldPrice, product.price])

  // ✅ Style de la carte
  const bgClass = BG[product.cat] || BG.default
  const sizeConfig = SIZES[size] || SIZES.normal

  // ✅ Gestionnaires optimisés
  const handleAddToCart = useCallback((e) => {
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(product)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }, [product, onAddToCart])

  const handleToggleWishlist = useCallback((e) => {
    e.stopPropagation()
    if (onToggleWishlist) {
      onToggleWishlist(product.id || product._id)
    } else {
      setLocalWish(!localWish)
    }
  }, [product.id, product._id, onToggleWishlist])

  const handleNavigate = useCallback(() => {
    if (onClick) {
      onClick(product)
    } else {
      navigate(`/product/${product.id || product._id}`)
    }
  }, [product, onClick, navigate])

  const handleQuickView = useCallback((e) => {
    e.stopPropagation()
    navigate(`/product/${product.id || product._id}`)
  }, [product.id, product._id, navigate])

  // ✅ Formatage du prix
  const formatPrice = useCallback((price) => {
    return price?.toLocaleString() || '0'
  }, [])

  // ✅ Badge du produit
  const badge = product.badge ? BADGE_STYLES[product.badge] : null
  const badgeLabel = product.badge ? BADGE_LABELS[product.badge] : null

  return (
    <div 
      onClick={handleNavigate}
      className={`
        group bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl 
        overflow-hidden hover:shadow-2xl hover:shadow-[var(--accent-primary)]/10 
        hover:-translate-y-1 md:hover:-translate-y-2 
        transition-all duration-300 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2
        ${className}
      `}
      role="article"
      aria-label={`Produit : ${product.name}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleNavigate()
        }
      }}
    >
      {/* IMAGE */}
      <div className={`${sizeConfig.image} bg-gradient-to-br ${bgClass} relative overflow-hidden`}>
        {product.image ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-[var(--bg-secondary)] animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`
                w-full h-full object-cover 
                transform group-hover:scale-110 transition-transform duration-500
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl transform group-hover:scale-110 transition-transform duration-300">
            {product.emoji || '📦'}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {badge && (
            <span className={`text-[10px] font-bold px-2 py-1 rounded-md shadow-sm ${badge}`}>
              {badgeLabel}
            </span>
          )}
          {discount > 0 && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-md shadow-sm bg-red-500 text-white">
              -{discount}%
            </span>
          )}
          {product.isNew && !badge && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-md shadow-sm bg-[var(--accent-primary)] text-[var(--bg-card)]">
              🆕 NOUVEAU
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className={`
            absolute top-2 right-2 rounded-full w-9 h-9 sm:w-10 sm:h-10 
            flex items-center justify-center transition-all duration-300 z-10
            ${wished 
              ? 'bg-red-50 dark:bg-red-900/30 text-red-500 shadow-md scale-110' 
              : 'bg-[var(--bg-card)]/80 text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:scale-110'
            }
          `}
        >
          <Heart 
            size={14} 
            fill={wished ? '#D95030' : 'none'} 
            color={wished ? '#D95030' : 'currentColor'} 
          />
        </button>

        {/* Quick View */}
        {showQuickView && (
          <button
            onClick={handleQuickView}
            aria-label="Voir le détail"
            className="
              absolute bottom-2 left-2 bg-[var(--bg-card)]/90 text-[var(--accent-primary)] 
              rounded-full w-9 h-9 sm:w-10 sm:h-10 
              flex items-center justify-center 
              opacity-0 group-hover:opacity-100 transition-all duration-300 
              hover:bg-[var(--bg-card)] hover:scale-110 shadow-md
            "
          >
            <Eye size={14} />
          </button>
        )}

        {/* Quick Add */}
        <button
          onClick={handleAddToCart}
          aria-label="Ajouter au panier"
          className="
            absolute bottom-2 right-2 bg-amber-400 text-[var(--text-primary)] 
            rounded-full w-9 h-9 sm:w-10 sm:h-10 
            flex items-center justify-center 
            opacity-0 group-hover:opacity-100 transition-all duration-300 
            hover:bg-amber-500 hover:scale-110 shadow-md
          "
        >
          <ShoppingCart size={14} />
        </button>

        {/* ✅ Indicateur de stock */}
        {product.stock !== undefined && product.stock < 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            ⚡ Plus que {product.stock}
          </div>
        )}
      </div>

      {/* INFOS */}
      <div className={sizeConfig.padding}>
        {/* Nom */}
        <p className={`${sizeConfig.fontSize} font-semibold text-[var(--text-primary)] truncate mb-1 line-clamp-1`}>
          {product.name}
        </p>

        {/* Origine */}
        <p className="text-[11px] text-[var(--text-secondary)] mb-2 flex items-center gap-1 truncate">
          <MapPin size={10} className="shrink-0" /> 
          {product.origin || 'Afrique'}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-amber-400 text-[11px] flex items-center">
            <Star size={12} fill="currentColor" className="mr-0.5" />
            {(product.stars || 4.5).toFixed(1)}
          </span>
          <span className="text-[10px] text-[var(--text-secondary)]">
            ({product.reviews || 0})
          </span>
        </div>

        {/* Prix */}
        <div className="flex items-baseline gap-1 mb-2 flex-wrap min-h-[24px]">
          <span className="text-base md:text-lg font-extrabold text-[var(--accent-secondary)]">
            {formatPrice(product.price)} FCFA
          </span>
          <span className="text-[11px] text-[var(--text-secondary)]">/ {product.unit || 'unité'}</span>
          {product.oldPrice && (
            <span className="text-[11px] text-[var(--text-secondary)] line-through ml-1">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Badges additionnels */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-1 rounded-lg font-semibold flex items-center gap-1">
            <Truck size={10} /> Livraison dispo
          </span>
          <span className="text-[10px] text-[var(--text-secondary)] truncate max-w-[100px]">
            par {product.seller || 'Vendeur'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          aria-label={added ? 'Ajouté au panier' : 'Ajouter au panier'}
          className={`
            w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold 
            transition-all duration-300
            ${added 
              ? 'bg-[var(--accent-primary)] text-[var(--bg-card)] shadow-lg shadow-[var(--accent-primary)]/20' 
              : 'bg-amber-400 text-[var(--text-primary)] hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-400/30 active:scale-[0.98]'
            }
          `}
        >
          {added ? (
            <><Check size={14} /> Ajouté !</>
          ) : (
            <><ShoppingCart size={14} /> Ajouter</>
          )}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
