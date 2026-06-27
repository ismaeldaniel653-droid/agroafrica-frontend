import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../store/cartSlice'
import { createOrder } from '../api/orderApi'
import { initiatePayment } from '../api/paymentApi'
import { ArrowLeft, MapPin, Phone, CreditCard, CheckCircle } from 'lucide-react'

function Checkout() {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
  const cartItems = useSelector(state => state.cart.items)
  const total     = cartItems.reduce((s, c) => s + c.price * c.qty, 0)

  const [step,    setStep]    = useState(1)
  const [payment, setPayment] = useState('mtn')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  // ✅ NOUVEAU : valeurs par défaut vides
  const [form,    setForm]    = useState({
    name: '', phone: '', city: '', address: '', country: 'Cameroun'
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleOrder() {
    setLoading(true)
    setError(null)

    const items = cartItems.map(i => ({
      product: i._id || i.id,
      qty: i.qty,
      price: i.price
    }))

    try {
      const res = await createOrder({
        items,
        totalAmount: total,
        paymentMethod: payment,
        deliveryAddress: form
      })

      const order = res.order || res
      const orderId = order._id || order.id

      await initiatePayment({ orderId, method: payment, phone: form.phone })
      setLoading(false)
      dispatch(clearCart())
      navigate(`/payment-status/${orderId}`)
    } catch (err) {
      console.warn('API commande inaccessible', err)
      setError('Impossible de contacter le backend. Réessayez dans quelques instants.')
      setLoading(false)
    }
  }

  // ÉTAPE 3 — SUCCÈS
  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E25] mb-2">
            Commande confirmée ! 🎉
          </h1>
          <p className="text-[#8AADA0] text-sm mb-6">
            Vous recevrez une confirmation par SMS au numéro renseigné.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold py-3 rounded-xl transition"
          >
            Retour au marché 🌿
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-6 sm:py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* RETOUR */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-5 sm:mb-6 hover:underline text-sm">
          <ArrowLeft size={16} /> Retour au panier
        </button>

        {/* ÉTAPES */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          {[
            { num:1, label:'Livraison'  },
            { num:2, label:'Paiement'   },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition
                ${step >= s.num ? 'bg-[#0C6B4E] text-white' : 'bg-[#DDE8E2] text-[#8AADA0]'}`}>
                {s.num}
              </div>
              <span className={`text-xs sm:text-sm font-semibold ${step >= s.num ? 'text-[#0C6B4E]' : 'text-[#8AADA0]'}`}>
                {s.label}
              </span>
              {i < 1 && <div className="w-8 sm:w-12 h-px bg-[#DDE8E2] mx-1"></div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* FORMULAIRE */}
          <div className="lg:col-span-2">

            {/* ÉTAPE 1 — LIVRAISON */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-[#DDE8E2] p-5 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold text-[#1A2E25] mb-4 sm:mb-5 flex items-center gap-2">
                  <MapPin size={20} className="text-[#0C6B4E]" />
                  Adresse de livraison
                </h2>

                <div className="space-y-4">

                  <div>
                    <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Nom complet</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Votre nom"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E] transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Téléphone</label>
                    <div className="flex gap-2">
                      <select name="countryCode" value={form.countryCode || '+237'} onChange={handleChange} className="border border-[#DDE8E2] rounded-xl px-2 sm:px-3 py-3 text-xs sm:text-sm outline-none bg-white flex-shrink-0">
                        <option value="+237">🇨🇲 +237</option>
                        <option value="+221">🇸🇳 +221</option>
                        <option value="+234">🇳🇬 +234</option>
                        <option value="+233">🇬🇭 +233</option>
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="6XX XXX XXX"
                        value={form.phone}
                        onChange={handleChange}
                        className="flex-1 min-w-0 border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E] transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Pays</label>
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E] bg-white transition"
                    >
                      {['Cameroun','Sénégal','Nigeria','Ghana','Côte d\'Ivoire','Kenya','Éthiopie'].map((c,i) => (
                        <option key={i}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Ville</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Yaoundé"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E] transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Adresse complète</label>
                    <textarea
                      name="address"
                      placeholder="Quartier, rue, numéro..."
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E] transition resize-none"
                      required
                    />
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-[#0C6B4E] hover:bg-[#18A070] text-white font-bold py-4 rounded-xl transition"
                  >
                    Continuer vers le paiement →
                  </button>

                </div>
              </div>
            )}

            {/* ÉTAPE 2 — PAIEMENT */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-[#DDE8E2] p-5 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold text-[#1A2E25] mb-4 sm:mb-5 flex items-center gap-2">
                  <CreditCard size={20} className="text-[#0C6B4E]" />
                  Choisir le paiement
                </h2>

                <div className="space-y-3 mb-6">
                  {[
                    { key:'mtn',    label:'MTN Mobile Money',  flag:'🇨🇲', color:'#FFCC00', desc:'Paiement via MTN MoMo'         },
                    { key:'orange', label:'Orange Money',      flag:'🇨🇲', color:'#FF6600', desc:'Paiement via Orange Money'     },
                    { key:'wave',   label:'Wave',              flag:'🇸🇳', color:'#1BA672', desc:'Paiement via Wave'             },
                    { key:'visa',   label:'Visa / Mastercard', flag:'💳', color:'#1A1F71', desc:'Carte bancaire internationale'  },
                    { key:'paypal', label:'PayPal',            flag:'🌐', color:'#003087', desc:'Paiement PayPal sécurisé'       },
                  ].map(p => (
                    <div
                      key={p.key}
                      onClick={() => setPayment(p.key)}
                      className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition
                        ${payment === p.key ? 'border-[#0C6B4E] bg-[#E8F7F1]' : 'border-[#DDE8E2] hover:border-[#0C6B4E]/40'}`}
                    >
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{borderColor: payment === p.key ? '#0C6B4E' : '#DDE8E2'}}>
                        {payment === p.key && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0C6B4E]"></div>
                        )}
                      </div>
                      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{background: p.color}}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1A2E25]">{p.flag} {p.label}</p>
                        <p className="text-xs text-[#8AADA0]">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {['mtn','orange','wave'].includes(payment) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                    <p className="text-xs font-semibold text-amber-700 mb-2">
                      📱 Numéro {payment === 'mtn' ? 'MTN MoMo' : payment === 'orange' ? 'Orange Money' : 'Wave'}
                    </p>
                    <input
                      type="tel"
                      placeholder="6XX XXX XXX"
                      className="w-full border border-amber-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-400 bg-white"
                    />
                    <p className="text-xs text-amber-600 mt-2">
                      ⚠️ Vous recevrez une demande de confirmation sur ce numéro
                    </p>
                  </div>
                )}

                {/* ✅ NOUVEAU : utilise flex-1 (valide Tailwind) au lieu de flex-2 */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-[#DDE8E2] text-[#4A6355] font-semibold py-3 rounded-xl hover:bg-[#F5F7F5] transition"
                  >
                    ← Retour
                  </button>
                  <button
                    onClick={handleOrder}
                    disabled={loading}
                    className="flex-1 bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold py-3 rounded-xl transition disabled:opacity-70"
                  >
                    {loading ? '⏳ Traitement...' : `💳 Payer ${total.toLocaleString()} FCFA`}
                  </button>
                </div>
                {error && (
                  <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
                )}

              </div>
            )}
          </div>

          {/* RÉSUMÉ COMMANDE */}
          <div className="bg-white rounded-2xl border border-[#DDE8E2] p-4 sm:p-5 h-fit lg:sticky lg:top-4">
            <h3 className="font-bold text-[#1A2E25] mb-4 text-sm sm:text-base">🛒 Résumé commande</h3>

            {/* ✅ NOUVEAU : état vide panier */}
            {cartItems.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-[#8AADA0]">Votre panier est vide</p>
                <button onClick={() => navigate('/')}
                  className="mt-3 text-xs text-[#0C6B4E] font-semibold hover:underline">
                  Aller au marché →
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E8F7F1] rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1A2E25] truncate">{item.name}</p>
                        <p className="text-xs text-[#8AADA0]">x{item.qty}</p>
                      </div>
                      <span className="text-xs font-bold text-[#D95030] whitespace-nowrap">
                        {(item.price * item.qty).toLocaleString()} FCFA
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#DDE8E2] pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8AADA0]">Sous-total</span>
                    <span>{total.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8AADA0]">Livraison</span>
                    <span className="text-green-600 font-semibold">Gratuite</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-[#1A2E25] pt-2 border-t border-[#DDE8E2]">
                    <span>Total</span>
                    <span className="text-[#D95030]">{total.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
