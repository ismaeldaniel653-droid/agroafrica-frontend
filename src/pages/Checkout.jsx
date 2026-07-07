import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../store/cartSlice'
import { createOrder } from '../api/orderApi'
import { initiatePayment } from '../api/paymentApi'
import { 
  ArrowLeft, MapPin, Phone, CreditCard, CheckCircle, 
  Truck, Shield, Clock, AlertCircle, Loader, 
  ChevronRight, Wallet, Smartphone
} from 'lucide-react'

// ✅ Configuration des pays
const COUNTRIES = [
  { value: 'Cameroun', label: '🇨🇲 Cameroun', code: 'CM' },
  { value: 'Sénégal', label: '🇸🇳 Sénégal', code: 'SN' },
  { value: 'Nigeria', label: '🇳🇬 Nigeria', code: 'NG' },
  { value: 'Ghana', label: '🇬🇭 Ghana', code: 'GH' },
  { value: "Côte d'Ivoire", label: '🇨🇮 Côte d\'Ivoire', code: 'CI' },
  { value: 'Kenya', label: '🇰🇪 Kenya', code: 'KE' },
  { value: 'Éthiopie', label: '🇪🇹 Éthiopie', code: 'ET' },
  { value: 'Bénin', label: '🇧🇯 Bénin', code: 'BJ' },
  { value: 'Togo', label: '🇹🇬 Togo', code: 'TG' },
]

// ✅ Configuration des méthodes de paiement
const PAYMENT_METHODS = [
  { 
    key: 'mtn', 
    label: 'MTN Mobile Money', 
    flag: '🇨🇲', 
    color: '#FFCC00',
    desc: 'Paiement via MTN MoMo',
    icon: Smartphone,
    type: 'mobile'
  },
  { 
    key: 'orange', 
    label: 'Orange Money', 
    flag: '🇨🇲', 
    color: '#FF6600',
    desc: 'Paiement via Orange Money',
    icon: Smartphone,
    type: 'mobile'
  },
  { 
    key: 'wave', 
    label: 'Wave', 
    flag: '🇸🇳', 
    color: '#1BA672',
    desc: 'Paiement via Wave',
    icon: Smartphone,
    type: 'mobile'
  },
  { 
    key: 'visa', 
    label: 'Visa / Mastercard', 
    flag: '💳', 
    color: '#1A1F71',
    desc: 'Carte bancaire internationale',
    icon: CreditCard,
    type: 'card'
  },
  { 
    key: 'paypal', 
    label: 'PayPal', 
    flag: '🌐', 
    color: '#003087',
    desc: 'Paiement PayPal sécurisé',
    icon: Wallet,
    type: 'online'
  },
]

function Checkout({ 
  onOrderComplete,
  className = '',
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.items)
  const user = useSelector(state => state.auth?.user)

  // ✅ Calculs
  const total = useMemo(() => {
    return cartItems.reduce((s, c) => s + (c.price || 0) * (c.qty || 0), 0)
  }, [cartItems])

  const itemCount = useMemo(() => {
    return cartItems.reduce((s, c) => s + (c.qty || 0), 0)
  }, [cartItems])

  // ✅ États
  const [step, setStep] = useState(1)
  const [payment, setPayment] = useState('mtn')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    city: '',
    address: '',
    country: 'Cameroun',
    countryCode: '+237',
    deliveryNotes: '',
  })

  // ✅ Pré-remplir le formulaire avec les données utilisateur
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }))
    }
  }, [user])

  // ✅ Gestion des changements
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }, [error])

  // ✅ Validation du formulaire
  const validateForm = useCallback(() => {
    const errors = {}
    
    if (!form.name.trim()) errors.name = 'Nom requis'
    if (!form.phone.trim()) errors.phone = 'Téléphone requis'
    if (form.phone.trim().length < 8) errors.phone = 'Numéro invalide'
    if (!form.city.trim()) errors.city = 'Ville requise'
    if (!form.address.trim()) errors.address = 'Adresse requise'
    
    return errors
  }, [form])

  // ✅ Création de la commande
  const handleOrder = useCallback(async () => {
    // Validation
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (cartItems.length === 0) {
      setError('Votre panier est vide')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const items = cartItems.map(item => ({
        product: item._id || item.id,
        qty: item.qty,
        price: item.price,
        name: item.name,
      }))

      const orderData = {
        items,
        totalAmount: total,
        paymentMethod: payment,
        deliveryAddress: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          city: form.city,
          address: form.address,
          country: form.country,
          deliveryNotes: form.deliveryNotes,
        },
        userId: user?.id,
      }

      const res = await createOrder(orderData)
      const order = res.order || res
      const orderId = order._id || order.id

      // Initier le paiement
      if (['mtn', 'orange', 'wave'].includes(payment)) {
        await initiatePayment({ 
          orderId, 
          method: payment, 
          phone: form.phone 
        })
      }

      setSuccess(true)
      dispatch(clearCart())

      if (onOrderComplete) {
        onOrderComplete(order)
      }

      // Redirection après succès
      setTimeout(() => {
        navigate(`/payment-status/${orderId}`)
      }, 2000)

    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors de la commande')
      setLoading(false)
    }
  }, [cartItems, total, payment, form, validateForm, dispatch, navigate, onOrderComplete, user])

  // ✅ Redirection si panier vide
  if (cartItems.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4 py-8">
        <div className="bg-[var(--bg-card)] rounded-3xl shadow-xl p-8 sm:p-10 max-w-md w-full text-center border border-[var(--border-color)]">
          <div className="text-6xl mb-4 opacity-50">🛒</div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mb-2">
            Panier vide
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            Ajoutez des produits avant de passer commande.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold py-3 rounded-xl transition"
          >
            Découvrir les produits 🌿
          </button>
        </div>
      </div>
    )
  }

  // ✅ ÉTAPE 3 — SUCCÈS
  if (success) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4 py-8">
        <div className="bg-[var(--bg-card)] rounded-3xl shadow-xl p-8 sm:p-10 max-w-md w-full text-center border border-[var(--border-color)]">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mb-2">
            Commande confirmée ! 🎉
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            Vous recevrez une confirmation par SMS au numéro renseigné.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold py-3 rounded-xl transition"
          >
            Retour au marché 🌿
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-[var(--bg-secondary)] py-6 sm:py-8 px-4 ${className}`}>
      <div className="max-w-5xl mx-auto">
        {/* RETOUR */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-[var(--accent-primary)] font-semibold mb-5 hover:underline text-sm transition"
        >
          <ArrowLeft size={16} /> Retour au panier
        </button>

        {/* ÉTAPES */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          {[
            { num: 1, label: 'Livraison', icon: MapPin },
            { num: 2, label: 'Paiement', icon: CreditCard },
          ].map((s, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition
                ${step >= s.num 
                  ? 'bg-[var(--accent-primary)] text-[var(--text-light)]' 
                  : 'bg-[var(--border-color)] text-[var(--text-secondary)]'
                }
              `}>
                {s.num}
              </div>
              <span className={`text-xs sm:text-sm font-semibold ${step >= s.num ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                {s.label}
              </span>
              {index < 1 && (
                <div className={`w-8 sm:w-12 h-px ${step > s.num ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-color)]'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORMULAIRE */}
          <div className="lg:col-span-2">
            {/* ÉTAPE 1 — LIVRAISON */}
            {step === 1 && (
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-4 sm:mb-5 flex items-center gap-2">
                  <MapPin size={20} className="text-[var(--accent-primary)]" />
                  Adresse de livraison
                </h2>

                <div className="space-y-4">
                  {/* Nom */}
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Votre nom"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] transition placeholder-[var(--text-secondary)]/50"
                      required
                    />
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                      Téléphone *
                    </label>
                    <div className="flex gap-2">
                      <select 
                        name="countryCode" 
                        value={form.countryCode} 
                        onChange={handleChange}
                        className="border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-2 sm:px-3 py-3 text-xs sm:text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] flex-shrink-0"
                      >
                        <option value="+237">🇨🇲 +237</option>
                        <option value="+221">🇸🇳 +221</option>
                        <option value="+234">🇳🇬 +234</option>
                        <option value="+233">🇬🇭 +233</option>
                        <option value="+225">🇨🇮 +225</option>
                        <option value="+254">🇰🇪 +254</option>
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="6XX XXX XXX"
                        value={form.phone}
                        onChange={handleChange}
                        className="flex-1 min-w-0 border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] transition placeholder-[var(--text-secondary)]/50"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="votre@email.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] transition placeholder-[var(--text-secondary)]/50"
                    />
                  </div>

                  {/* Pays et Ville */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                        Pays *
                      </label>
                      <select
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                      >
                        {COUNTRIES.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                        Ville *
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Yaoundé"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] transition placeholder-[var(--text-secondary)]/50"
                        required
                      />
                    </div>
                  </div>

                  {/* Adresse */}
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                      Adresse complète *
                    </label>
                    <textarea
                      name="address"
                      placeholder="Quartier, rue, numéro..."
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] transition resize-none placeholder-[var(--text-secondary)]/50"
                      required
                    />
                  </div>

                  {/* Notes de livraison */}
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                      Notes de livraison (optionnel)
                    </label>
                    <input
                      type="text"
                      name="deliveryNotes"
                      placeholder="Instructions particulières..."
                      value={form.deliveryNotes}
                      onChange={handleChange}
                      className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] transition placeholder-[var(--text-secondary)]/50"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      const errors = validateForm()
                      if (Object.keys(errors).length > 0) {
                        setError('Veuillez remplir tous les champs obligatoires')
                        return
                      }
                      setStep(2)
                    }}
                    className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-[var(--text-light)] font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    Continuer vers le paiement <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ÉTAPE 2 — PAIEMENT */}
            {step === 2 && (
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-4 sm:mb-5 flex items-center gap-2">
                  <CreditCard size={20} className="text-[var(--accent-primary)]" />
                  Choisir le paiement
                </h2>

                <div className="space-y-3 mb-6">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon
                    const isSelected = payment === method.key

                    return (
                      <div
                        key={method.key}
                        onClick={() => setPayment(method.key)}
                        className={`
                          flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition
                          ${isSelected 
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10' 
                            : 'border-[var(--border-color)] hover:border-[var(--accent-primary)]/40'
                          }
                        `}
                      >
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                          style={{ borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)' }}>
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)]" />
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: method.color + '20' }}>
                          <Icon size={16} style={{ color: method.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[var(--text-primary)]">
                            {method.flag} {method.label}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">{method.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Champ téléphone pour Mobile Money */}
                {['mtn', 'orange', 'wave'].includes(payment) && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-5">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
                      📱 Numéro {payment === 'mtn' ? 'MTN MoMo' : payment === 'orange' ? 'Orange Money' : 'Wave'}
                    </p>
                    <input
                      type="tel"
                      placeholder="6XX XXX XXX"
                      className="w-full border border-amber-200 dark:border-amber-700 bg-white dark:bg-[var(--bg-card)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-amber-400"
                      value={form.phone}
                      onChange={handleChange}
                      name="phone"
                    />
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                      <Shield size={12} /> Vous recevrez une demande de confirmation sur ce numéro
                    </p>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 mb-4">
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold py-3 rounded-xl hover:bg-[var(--bg-secondary)] transition"
                  >
                    ← Retour
                  </button>
                  <button
                    onClick={handleOrder}
                    disabled={loading}
                    className="flex-1 bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold py-3 rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><Loader size={16} className="animate-spin" /> Traitement...</>
                    ) : (
                      <>💳 Payer {total.toLocaleString()} FCFA</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RÉSUMÉ COMMANDE */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 sm:p-5 h-fit lg:sticky lg:top-4">
            <h3 className="font-bold text-[var(--text-primary)] mb-4 text-sm sm:text-base flex items-center gap-2">
              🛒 Résumé commande
              <span className="text-xs text-[var(--text-secondary)] font-normal">({itemCount} article{itemCount > 1 ? 's' : ''})</span>
            </h3>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition">
                  <div className="w-10 h-10 bg-[var(--accent-primary)]/10 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                    {item.emoji || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">x{item.qty}</p>
                  </div>
                  <span className="text-xs font-bold text-[var(--accent-secondary)] whitespace-nowrap">
                    {((item.price || 0) * (item.qty || 0)).toLocaleString()} FCFA
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--border-color)] pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Sous-total</span>
                <span className="text-[var(--text-primary)]">{total.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)] flex items-center gap-1">
                  <Truck size={14} /> Livraison
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Gratuite</span>
              </div>
              <div className="flex justify-between text-base font-extrabold pt-2 border-t border-[var(--border-color)]">
                <span className="text-[var(--text-primary)]">Total</span>
                <span className="text-[var(--accent-secondary)]">{total.toLocaleString()} FCFA</span>
              </div>
            </div>

            {/* Badges de confiance */}
            <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
              <div className="flex items-center justify-center gap-4 text-[10px] text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <Shield size={12} /> Paiement sécurisé
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> Livraison 24-48h
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout