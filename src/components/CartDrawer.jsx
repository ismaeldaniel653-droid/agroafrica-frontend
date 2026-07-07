import { useMemo, useCallback, useEffect, useRef } from 'react'
import { 
  X, Trash2, Plus, Minus, ShoppingBag, Truck, Shield, 
  ChevronLeft, Sparkles, AlertCircle 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function CartDrawer({ cart = [], onClose, onChangeQty, onRemove, isOpen }) {
  const navigate = useNavigate()
  const drawerRef = useRef(null)
  const firstFocusRef = useRef(null)

  // ✅ Gestion du scroll du body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100%'
      // Focus sur le drawer
      setTimeout(() => {
        drawerRef.current?.focus()
      }, 100)
    } else {
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
  }, [isOpen])

  // ✅ Fermeture avec touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // ✅ Calculs mémorisés
  const { total, shipping, grandTotal, itemCount, remaining, progressPct } = useMemo(() => {
    const total = cart.reduce((s, c) => s + (c.price || 0) * (c.qty || 0), 0)
    const itemCount = cart.reduce((s, c) => s + (c.qty || 0), 0)
    const freeShippingThreshold = 25000
    const shipping = total >= freeShippingThreshold ? 0 : 1500
    const grandTotal = total + shipping
    const remaining = Math.max(0, freeShippingThreshold - total)
    const progressPct = Math.min(100, (total / freeShippingThreshold) * 100)
    
    return { total, shipping, grandTotal, itemCount, remaining, progressPct }
  }, [cart])

  // ✅ Gestionnaires
  const handleCheckout = useCallback(() => {
    onClose()
    navigate('/checkout')
  }, [onClose, navigate])

  const handleContinueShopping = useCallback(() => {
    onClose()
  }, [onClose])

  // ✅ Formatage du prix
  const formatPrice = useCallback((price) => {
    return price?.toLocaleString() || '0'
  }, [])

  const isEmpty = !cart || cart.length === 0

  // ✅ Produits suggérés (quand panier vide)
  const suggestedProducts = [
    { emoji: '☕', name: 'Café Arabica', price: 4500, id: 'suggest-1' },
    { emoji: '🌶️', name: 'Piment Moulu', price: 2000, id: 'suggest-2' },
    { emoji: '🧺', name: 'Panier Tressé', price: 8200, id: 'suggest-3' },
  ]

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 transition-opacity duration-300
          bg-black/50 backdrop-blur-sm
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden="true"
      />

      {/* DRAWER */}
      <div 
        ref={drawerRef}
        tabIndex={-1}
        className={`
          fixed z-50 shadow-2xl flex flex-col transition-all duration-300 ease-in-out
          bg-[var(--bg-card)] text-[var(--text-primary)]
          md:top-0 md:right-0 md:h-full md:w-[420px] md:max-w-full md:left-auto md:rounded-none
          left-0 right-0 bottom-0 max-h-[90vh] md:max-h-full rounded-t-2xl md:rounded-none
          ${isOpen
            ? 'translate-x-0 translate-y-0'
            : 'md:translate-x-full md:translate-y-0 translate-x-0 translate-y-full'
          }
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Panier d'achat"
      >
        {/* HANDLE MOBILE */}
        <div className="md:hidden pt-2 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-[var(--border-color)] rounded-full" />
        </div>

        {/* HEADER */}
        <div className="bg-[var(--accent-primary)] px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[var(--bg-card)]" />
            <h3 className="text-[var(--bg-card)] font-bold text-base">
              Mon Panier 
              <span className="text-[var(--bg-card)]/70 font-normal ml-1">
                ({itemCount} article{itemCount > 1 ? 's' : ''})
              </span>
            </h3>
          </div>
          <button 
            onClick={onClose}
            ref={firstFocusRef}
            aria-label="Fermer le panier"
            className="bg-white/20 hover:bg-white/30 text-[var(--bg-card)] rounded-full w-8 h-8 flex items-center justify-center transition-all hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-secondary)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* BARRE DE PROGRESSION LIVRAISON GRATUITE */}
        {!isEmpty && (
          <div className="px-5 py-3 bg-[var(--accent-primary)]/10 border-b border-[var(--border-color)] animate-slide-in">
            {remaining === 0 ? (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles size={14} /> 🎉 Livraison gratuite ! 
                <span className="font-normal text-[var(--text-secondary)] ml-1">
                  Profitez de votre commande
                </span>
              </p>
            ) : (
              <>
                <p className="text-xs text-[var(--accent-primary)] font-semibold mb-1.5">
                  Encore <strong className="text-[var(--accent-secondary)]">
                    {formatPrice(remaining)} FCFA
                  </strong> pour la livraison gratuite 🚚
                </p>
                <div className="w-full bg-[var(--border-color)] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)] transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(progressPct, 100)}%` }} 
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isEmpty ? (
            <div className="text-center py-8 flex flex-col items-center justify-center">
              <div className="text-6xl mb-4 opacity-50">🛒</div>
              <p className="font-semibold text-[var(--text-primary)] text-lg">
                Votre panier est vide
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-2 px-4">
                Découvrez nos produits africains authentiques
              </p>
              
              {/* ✅ Suggestions de produits */}
              <div className="mt-6 w-full">
                <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider mb-3">
                  ✨ Suggestions
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {suggestedProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        navigate('/')
                        onClose()
                      }}
                      className="p-3 bg-[var(--bg-secondary)] rounded-xl text-center hover:bg-[var(--accent-primary)]/10 transition group"
                    >
                      <div className="text-2xl mb-1">{product.emoji}</div>
                      <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-[var(--accent-secondary)] font-bold mt-1">
                        {formatPrice(product.price)} FCFA
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleContinueShopping}
                className="mt-6 bg-[var(--accent-primary)] text-[var(--bg-card)] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--accent-primary)]/80 transition"
              >
                Explorer le marché →
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={item.id || index}
                className="flex gap-3 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] animate-fade-in hover:shadow-md transition"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image/Emoji avec badge */}
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-sm">
                    {item.emoji || '📦'}
                  </div>
                  {item.qty > 1 && (
                    <span className="absolute -top-1 -right-1 bg-[var(--accent-secondary)] text-[var(--text-primary)] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      {item.qty}
                    </span>
                  )}
                </div>
                
                {/* Détails */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {item.name || 'Produit'}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">
                    {formatPrice(item.price)} FCFA / {item.unit || 'pièce'}
                  </p>
                  <p className="text-sm font-extrabold text-[var(--accent-secondary)]">
                    {formatPrice((item.price || 0) * (item.qty || 0))} FCFA
                  </p>
                  
                  {/* Contrôles quantité */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
                    <button 
                      onClick={() => onChangeQty?.(item.id, -1)} 
                      aria-label="Diminuer la quantité"
                      className="w-7 h-7 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--accent-primary)]/10 hover:border-[var(--accent-primary)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={(item.qty || 0) <= 1}
                    >
                      <Minus size={12} className="text-[var(--text-primary)]" />
                    </button>
                    
                    <span className="text-sm font-bold w-6 text-center text-[var(--text-primary)]">
                      {item.qty || 0}
                    </span>
                    
                    <button 
                      onClick={() => onChangeQty?.(item.id, 1)} 
                      aria-label="Augmenter la quantité"
                      className="w-7 h-7 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--accent-primary)]/10 hover:border-[var(--accent-primary)] transition-all active:scale-95"
                    >
                      <Plus size={12} className="text-[var(--text-primary)]" />
                    </button>
                    
                    <button 
                      onClick={() => {
                        if (window.confirm(`Retirer "${item.name}" du panier ?`)) {
                          onRemove?.(item.id)
                        }
                      }} 
                      aria-label="Supprimer l'article"
                      className="ml-auto text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-lg transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {!isEmpty && (
          <div 
            className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            {/* Sous-total */}
            <div className="flex justify-between items-center mb-1.5 text-sm">
              <span className="text-[var(--text-secondary)]">Sous-total</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {formatPrice(total)} FCFA
              </span>
            </div>
            
            {/* Livraison */}
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="text-[var(--text-secondary)] flex items-center gap-1">
                <Truck size={12} /> Livraison
              </span>
              <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-primary)]'}`}>
                {shipping === 0 ? 'GRATUIT 🎉' : `${formatPrice(shipping)} FCFA`}
              </span>
            </div>
            
            {/* Total */}
            <div className="flex justify-between items-center mb-4 p-3 bg-[var(--accent-primary)]/10 rounded-xl border border-[var(--accent-primary)]/20">
              <span className="text-sm font-semibold text-[var(--accent-primary)]">Total</span>
              <span className="text-xl font-extrabold text-[var(--accent-secondary)]">
                {formatPrice(grandTotal)} FCFA
              </span>
            </div>
            
            {/* Bouton commander */}
            <button 
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[var(--text-primary)] font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-amber-400/30 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              💳 Passer la commande
            </button>
            
            {/* Continuer les achats */}
            <button 
              onClick={handleContinueShopping}
              className="w-full text-[var(--accent-primary)] text-sm font-medium hover:underline py-2 flex items-center justify-center gap-1 mt-1"
            >
              <ChevronLeft size={16} /> Continuer mes achats
            </button>
            
            {/* Badges de confiance */}
            <div className="flex items-center justify-center gap-3 text-[10px] text-[var(--text-secondary)] mt-2 pt-2 border-t border-[var(--border-color)]">
              <span className="flex items-center gap-1">
                <Shield size={10} /> Paiement sécurisé
              </span>
              <span className="text-[var(--border-color)]">|</span>
              <span>📱 Mobile Money</span>
              <span className="text-[var(--border-color)]">|</span>
              <span className="flex items-center gap-1">
                <AlertCircle size={10} /> 24h/24
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer