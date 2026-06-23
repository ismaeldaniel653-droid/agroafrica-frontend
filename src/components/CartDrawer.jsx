import { X, Trash2, Plus, Minus, ShoppingBag, Truck, Shield } from 'lucide-react'    // ✅ NOUVEAU : icônes livraison + sécurité
import { useNavigate } from 'react-router-dom'

function CartDrawer({ cart, onClose, onChangeQty, onRemove, isOpen }) {
  const total    = cart.reduce((s, c) => s + c.price * c.qty, 0)
  // ✅ NOUVEAU : seuils de livraison gratuits réalistes
  const shipping = total >= 25000 ? 0 : 1500
  const grand    = total + shipping
  const navigate = useNavigate()

  // ✅ NOUVEAU : progression vers la livraison gratuite
  const freeShippingThreshold = 25000
  const remaining = Math.max(0, freeShippingThreshold - total)
  const progressPct = Math.min(100, (total / freeShippingThreshold) * 100)

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* DRAWER */}
      {/* ✅ MODIFIÉ : slidable depuis le bas sur mobile, depuis la droite sur desktop */}
      <div className={`fixed z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out bg-white
        md:top-0 md:right-0 md:h-full md:w-[380px] md:max-w-full
        inset-x-0 bottom-0 max-h-[90vh] rounded-t-2xl md:rounded-none
        ${isOpen
          ? 'translate-x-0 translate-y-0 animate-slide-in-right'
          : 'md:translate-x-full md:translate-y-0 translate-x-0 translate-y-full'}`}>

        {/* HANDLE MOBILE - ✅ NOUVEAU : indique qu'on peut glisser */}
        <div className="md:hidden pt-2 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#0C6B4E] to-[#18A070] px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-white" />
            <h3 className="text-white font-bold text-base">
              Mon Panier <span className="text-white/70 font-normal">({cart.length})</span>
            </h3>
          </div>
          <button onClick={onClose}
                  aria-label="Fermer"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all hover:rotate-90">
            <X size={16} />
          </button>
        </div>

        {/* ✅ NOUVEAU : barre de progression livraison gratuite */}
        {cart.length > 0 && (
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
            {remaining === 0 ? (
              <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <Truck size={14}/> 🎉 Vous bénéficiez de la livraison gratuite !
              </p>
            ) : (
              <>
                <p className="text-xs text-[#0C6B4E] font-semibold mb-1.5">
                  Encore <strong>{remaining.toLocaleString()} FCFA</strong> pour la livraison gratuite 🚚
                </p>
                <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                       style={{ width: `${progressPct}%` }} />
                </div>
              </>
            )}
          </div>
        )}

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center">
              <div className="text-6xl mb-4 opacity-50">🛒</div>
              <p className="font-semibold text-[#1A2E25] text-lg">Votre panier est vide</p>
              <p className="text-sm text-[#8AADA0] mt-2 px-4">Découvrez nos produits africains authentiques</p>
              <button onClick={onClose}
                      className="mt-6 bg-[#0C6B4E] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0A5C42] transition">
                Explorer le marché →
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={item.id}
                   className="flex gap-3 p-3 bg-[#F5F7F5] rounded-xl border border-[#DDE8E2] animate-fade-in"
                   style={{ animationDelay: `${index * 50}ms` }}>
                {/* ✅ MODIFIÉ : width/height responsive pour très petits écrans */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#E8F7F1] to-[#C8EDDD] flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-sm">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A2E25] truncate">{item.name}</p>
                  <p className="text-xs text-[#8AADA0] mb-1">{item.price.toLocaleString()} FCFA / {item.unit}</p>
                  <p className="text-sm font-extrabold text-[#D95030]">
                    {(item.price * item.qty).toLocaleString()} FCFA
                  </p>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
                    <button onClick={() => onChangeQty(item.id, -1)} aria-label="Diminuer"
                            className="w-7 h-7 rounded-lg bg-white border border-[#DDE8E2] flex items-center justify-center hover:bg-[#E8F7F1] hover:border-[#0C6B4E] transition-all active:scale-95">
                      <Minus size={12} className="text-[#0C6B4E]" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center text-[#1A2E25]">{item.qty}</span>
                    <button onClick={() => onChangeQty(item.id, 1)} aria-label="Augmenter"
                            className="w-7 h-7 rounded-lg bg-white border border-[#DDE8E2] flex items-center justify-center hover:bg-[#E8F7F1] hover:border-[#0C6B4E] transition-all active:scale-95">
                      <Plus size={12} className="text-[#0C6B4E]" />
                    </button>
                    <button onClick={() => onRemove(item.id)} aria-label="Supprimer"
                            className="ml-auto text-[#8AADA0] hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition-all"
                            title="Supprimer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-[#DDE8E2] bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
               /* ✅ NOUVEAU : respecte la zone sûre iPhone */
               style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
            <div className="flex justify-between items-center mb-1.5 text-sm">
              <span className="text-[#8AADA0]">Sous-total</span>
              <span className="font-semibold text-[#1A2E25]">{total.toLocaleString()} FCFA</span>
            </div>
            {/* ✅ NOUVEAU : ligne livraison */}
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="text-[#8AADA0] flex items-center gap-1">
                <Truck size={12} /> Livraison
              </span>
              <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-[#1A2E25]'}`}>
                {shipping === 0 ? 'GRATUIT 🎉' : `${shipping.toLocaleString()} FCFA`}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4 p-3 bg-gradient-to-r from-[#E8F7F1] to-[#C8EDDD] rounded-xl">
              <span className="text-sm font-semibold text-[#0C6B4E]">Total</span>
              <span className="text-xl font-extrabold text-[#D95030]">{grand.toLocaleString()} FCFA</span>
            </div>
            <button onClick={() => { onClose(); navigate('/checkout') }}
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#0D1F2D] font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-amber-400/30 active:scale-[0.98]">
              💳 Passer la commande
            </button>
            <button onClick={onClose}
                    className="w-full text-[#0C6B4E] text-sm font-medium hover:underline py-2">
              ← Continuer mes achats
            </button>
            {/* ✅ NOUVEAU : badges de confiance */}
            <div className="flex items-center justify-center gap-3 text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1"><Shield size={10}/> Paiement sécurisé</span>
              <span>·</span>
              <span>📱 Mobile Money</span>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

export default CartDrawer
