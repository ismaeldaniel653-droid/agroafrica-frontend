import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { 
  ShoppingCart, ArrowLeft, Star, MapPin, Shield, 
  Truck, QrCode, CheckCircle, Clock, Package,
  ChevronLeft, ChevronRight, Heart, Share2,
  Loader, AlertCircle, Sparkles
} from 'lucide-react'
import WhatsAppButton from '../components/WhatsAppButton'
import { getProduct } from '../api/productApi'
import Avatar from '../components/Avatar'

// ✅ Configuration des catégories (couleurs)
const CATEGORY_STYLES = {
  agricole: 'from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-800/20',
  artisanat: 'from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/20',
  cooperative: 'from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20',
  default: 'from-gray-50 to-gray-100/50 dark:from-gray-800/30 dark:to-gray-700/20',
}

// ✅ Configuration des badges
const BADGE_CONFIG = {
  bio: { label: '🌱 BIO', color: 'bg-emerald-600 text-white' },
  new: { label: '🆕 NOUVEAU', color: 'bg-blue-600 text-white' },
  promo: { label: '🔥 PROMO', color: 'bg-red-600 text-white' },
  top: { label: '⭐ TOP', color: 'bg-amber-500 text-[var(--text-primary)]' },
  premium: { label: '💎 PREMIUM', color: 'bg-purple-600 text-white' },
}

function ProductDetail({ 
  className = '',
  onAddToCart,
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [tab, setTab] = useState('desc')
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isWished, setIsWished] = useState(false)

  // ✅ Chargement du produit
  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getProduct(id)
        const p = res.product || res
        setProduct({ ...p, id: p.id || p._id })
      } catch (err) {
        setError(err?.response?.data?.message || 'Produit introuvable')
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  // ✅ Calculs mémorisés
  const categoryStyle = useMemo(() => {
    return CATEGORY_STYLES[product?.cat] || CATEGORY_STYLES.default
  }, [product?.cat])

  const totalPrice = useMemo(() => {
    return (product?.price || 0) * qty
  }, [product?.price, qty])

  const badgeConfig = useMemo(() => {
    return BADGE_CONFIG[product?.badge] || null
  }, [product?.badge])

  // ✅ Gestion du panier
  const handleAddToCart = useCallback(() => {
    if (!product) return
    
    for (let i = 0; i < qty; i++) {
      if (onAddToCart) {
        onAddToCart(product)
      } else {
        dispatch(addToCart(product))
      }
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }, [product, qty, dispatch, onAddToCart])

  // ✅ Gestion du wishlist
  const toggleWishlist = useCallback(() => {
    setIsWished(!isWished)
  }, [isWished])

  // ✅ Partage
  const shareProduct = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Découvrez ${product?.name} sur AgroAfrica !`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [product])

  // ✅ Formatage du prix
  const formatPrice = useCallback((price) => {
    return price?.toLocaleString() || '0'
  }, [])

  // ✅ Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader size={40} className="text-[var(--accent-primary)] animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  // ✅ Erreur / Produit introuvable
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-lg font-bold text-[var(--text-primary)]">Produit introuvable</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">{error || "Le produit que vous recherchez n'existe pas."}</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 bg-[var(--accent-primary)] text-[var(--text-light)] font-bold px-6 py-2.5 rounded-xl hover:bg-[var(--accent-primary)]/80 transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-[1300px] mx-auto px-4 sm:px-5 py-6 sm:py-8 ${className}`}>
      {/* RETOUR */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-[var(--accent-primary)] font-semibold mb-4 hover:underline text-sm transition"
      >
        <ArrowLeft size={16} /> Retour au marché
      </button>

      {/* DÉTAIL PRODUIT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-10 sm:mb-12">
        {/* IMAGE */}
        <div className={`bg-gradient-to-br ${categoryStyle} rounded-3xl flex items-center justify-center h-64 sm:h-80 md:h-96 overflow-hidden relative`}>
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              loading="lazy" 
              className="w-full h-full object-cover rounded-3xl hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="text-[100px] sm:text-[120px]">{product.emoji || '🛍'}</span>
          )}
          
          {/* Badge */}
          {badgeConfig && (
            <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-lg ${badgeConfig.color}`}>
              {badgeConfig.label}
            </span>
          )}
          
          {/* Boutons Wishlist & Share */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-12 bg-[var(--bg-card)]/80 hover:bg-[var(--bg-card)] p-2 rounded-full shadow-md transition hover:scale-110"
            aria-label="Ajouter aux favoris"
          >
            <Heart size={18} className={isWished ? 'fill-red-500 text-red-500' : 'text-[var(--text-secondary)]'} />
          </button>
          <button
            onClick={shareProduct}
            className="absolute top-3 right-3 bg-[var(--bg-card)]/80 hover:bg-[var(--bg-card)] p-2 rounded-full shadow-md transition hover:scale-110"
            aria-label="Partager"
          >
            <Share2 size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* INFOS */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mb-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
            <MapPin size={14} className="shrink-0" />
            <span>{product.origin || 'Origine non spécifiée'}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => (
                <Star 
                  key={i} 
                  size={16} 
                  fill={i <= (product.stars || 4.5) ? '#F0A500' : 'none'} 
                  color="#F0A500" 
                />
              ))}
            </div>
            <span className="text-sm text-[var(--text-secondary)]">
              {(product.stars || 4.5).toFixed(1)}/5 · ({product.reviews || 0} avis)
            </span>
          </div>

          {/* Prix */}
          <div className="flex items-baseline gap-3 mb-5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--accent-secondary)]">
              {formatPrice(product.price)} FCFA
            </span>
            <span className="text-sm text-[var(--text-secondary)]">/ {product.unit || 'unité'}</span>
            {product.oldPrice && (
              <span className="text-base text-[var(--text-secondary)] line-through">
                {formatPrice(product.oldPrice)} FCFA
              </span>
            )}
          </div>

          {/* Vendeur */}
          {product.seller && (
            <div className="flex items-center gap-3 bg-[var(--accent-primary)]/10 rounded-xl px-4 py-3 mb-5 border border-[var(--accent-primary)]/20">
              <Avatar
                user={product.sellerInfo || { name: product.seller, avatar: product.sellerAvatar }}
                size="md"
                clickable={!!product.sellerInfo?.id}
                onClick={() => product.sellerInfo?.id && navigate(`/seller/${product.sellerInfo.id}`)}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                  {product.seller}
                </p>
                <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                  <CheckCircle size={10} className="text-[var(--accent-primary)]" />
                  Vendeur certifié
                </p>
              </div>
            </div>
          )}

          {/* QUANTITÉ */}
          <div className="flex items-center gap-3 sm:gap-4 mb-5 flex-wrap">
            <span className="text-sm font-semibold text-[var(--text-primary)]">Quantité :</span>
            <div className="flex items-center gap-3 border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-lg px-3 py-2">
              <button 
                onClick={() => setQty(q => Math.max(1, q - 1))} 
                className="text-[var(--accent-primary)] font-bold text-lg hover:text-[var(--accent-secondary)] w-6 transition"
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <span className="font-bold w-6 text-center text-[var(--text-primary)]">{qty}</span>
              <button 
                onClick={() => setQty(q => q + 1)} 
                className="text-[var(--accent-primary)] font-bold text-lg hover:text-[var(--accent-secondary)] w-6 transition"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>
            <span className="text-sm text-[var(--text-secondary)]">
              Total : <strong className="text-[var(--accent-secondary)]">{formatPrice(totalPrice)} FCFA</strong>
            </span>
          </div>

          {/* Boutons */}
          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl text-base font-bold transition mb-3 active:scale-[0.98]
              ${added 
                ? 'bg-[var(--accent-primary)] text-[var(--text-light)]' 
                : 'bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)]'
              }`}
          >
            <ShoppingCart size={18} />
            {added ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
          </button>
          
          <WhatsAppButton product={product} />

          {/* Badges de confiance */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
            {[
              { icon: <Shield size={16} />, text: 'Paiement sécurisé' },
              { icon: <Truck size={16} />, text: 'Livraison 28 pays' },
              { icon: <QrCode size={16} />, text: 'QR Traçabilité' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1 bg-[var(--bg-secondary)] rounded-xl py-3 text-center hover:bg-[var(--bg-secondary)]/80 transition">
                <span className="text-[var(--accent-primary)]">{item.icon}</span>
                <span className="text-[10px] text-[var(--text-secondary)] font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Stock */}
          {product.stock !== undefined && (
            <div className="mt-4 text-xs text-[var(--text-secondary)]">
              {product.stock > 0 ? (
                <span className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-emerald-500" />
                  En stock ({product.stock} disponibles)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500">
                  <AlertCircle size={12} />
                  Rupture de stock
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ONGLETS */}
      <div className="mb-4 flex gap-1 sm:gap-2 border-b border-[var(--border-color)] overflow-x-auto">
        {[
          { key: 'desc', label: '📋 Description' },
          { key: 'qr', label: '📊 Traçabilité QR' },
          { key: 'avis', label: '⭐ Avis clients' },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition border-b-2 -mb-px whitespace-nowrap
              ${tab === item.key 
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' 
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* CONTENU ONGLETS */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 sm:p-6 mb-8 sm:mb-10">
        {tab === 'desc' && (
          <div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {product.description || product.desc || 'Aucune description disponible pour ce produit.'}
            </p>
            {product.origin && (
              <div className="mt-4 p-3 bg-[var(--bg-secondary)] rounded-xl">
                <p className="text-xs text-[var(--text-secondary)]">
                  <MapPin size={12} className="inline mr-1" />
                  Origine : <strong className="text-[var(--text-primary)]">{product.origin}</strong>
                </p>
              </div>
            )}
          </div>
        )}
        
        {tab === 'qr' && (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">📊</div>
            <h3 className="font-bold text-[var(--text-primary)] mb-2">Traçabilité complète</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-md mx-auto">
              Scannez le QR code pour voir l'origine, le producteur et la certification de ce produit.
            </p>
            <div className="inline-block bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)] rounded-2xl p-6 text-6xl">
              📱
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-3">
              QR Code disponible à la livraison
            </p>
          </div>
        )}
        
        {tab === 'avis' && (
          <div className="space-y-4">
            {(product.reviewsList || []).length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">⭐</div>
                <p className="text-sm text-[var(--text-secondary)]">Aucun avis pour ce produit</p>
                <p className="text-xs text-[var(--text-secondary)]/60 mt-1">Soyez le premier à donner votre avis !</p>
              </div>
            ) : (
              product.reviewsList.map((review, index) => (
                <div key={index} className="flex gap-3 pb-4 border-b border-[var(--border-color)] last:border-0">
                  <Avatar user={review} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-[var(--text-primary)]">
                        {review.name || 'Anonyme'}
                      </span>
                      <span className="text-amber-400 text-xs">
                        {'★'.repeat(Math.min(review.note || 5, 5))}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {review.date || 'Date inconnue'}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {review.comment || 'Aucun commentaire'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Produits similaires (optionnel) */}
      {product.similarProducts && product.similarProducts.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-[var(--accent-secondary)]" />
            Produits similaires
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {product.similarProducts.map((similar, index) => (
              <div 
                key={index}
                onClick={() => navigate(`/product/${similar.id || similar._id}`)}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3 text-center hover:shadow-md transition cursor-pointer"
              >
                <div className="text-3xl mb-1">{similar.emoji || '📦'}</div>
                <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                  {similar.name}
                </p>
                <p className="text-xs font-bold text-[var(--accent-secondary)]">
                  {formatPrice(similar.price)} FCFA
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail