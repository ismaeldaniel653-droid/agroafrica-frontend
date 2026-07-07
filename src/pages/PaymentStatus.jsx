import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeft, RefreshCw, CheckCircle, Clock3, XCircle,
  Loader, AlertCircle, ShoppingBag, Truck, Package,
  Sparkles, ChevronRight
} from 'lucide-react'
import { checkPaymentStatus } from '../api/paymentApi'

// ✅ Configuration des statuts
const PAYMENT_STATUS_CONFIG = {
  'payé': { label: 'Payé', icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
  'PAID': { label: 'Payé', icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
  'SUCCESS': { label: 'Payé', icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
  'en attente': { label: 'En attente', icon: Clock3, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
  'PENDING': { label: 'En attente', icon: Clock3, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
  'échoué': { label: 'Échoué', icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
  'FAILED': { label: 'Échoué', icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
  'ERROR': { label: 'Erreur', icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
}

const ORDER_STATUS_CONFIG = {
  'confirmé': { label: 'Confirmée', icon: CheckCircle, color: 'text-blue-600 dark:text-blue-400' },
  'en cours': { label: 'En cours', icon: Clock3, color: 'text-amber-600 dark:text-amber-400' },
  'livré': { label: 'Livrée', icon: Package, color: 'text-emerald-600 dark:text-emerald-400' },
  'annulé': { label: 'Annulée', icon: XCircle, color: 'text-red-600 dark:text-red-400' },
}

function PaymentStatus({ 
  className = '',
  refreshInterval = 8000,
  onStatusUpdate,
}) {
  const { orderId } = useParams()
  const navigate = useNavigate()
  
  const [status, setStatus] = useState(null)
  const [orderStatus, setOrderStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [lastUpdated, setLastUpdated] = useState(null)

  // ✅ Récupération du statut
  const fetchStatus = useCallback(async () => {
    if (!orderId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const res = await checkPaymentStatus(orderId)
      const paymentStatus = res.paymentStatus || res.status || 'inconnue'
      const orderStat = res.orderStatus || 'inconnue'
      
      setStatus(paymentStatus)
      setOrderStatus(orderStat)
      setLastUpdated(new Date())
      setRetryCount(0)
      
      if (onStatusUpdate) {
        onStatusUpdate({ paymentStatus, orderStatus: orderStat })
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Impossible de récupérer le statut.'
      setError(errorMsg)
      setRetryCount(prev => prev + 1)
    } finally {
      setLoading(false)
    }
  }, [orderId, onStatusUpdate])

  // ✅ Auto-refresh
  useEffect(() => {
    if (!orderId) return
    
    fetchStatus()
    
    // Arrêter le refresh si le paiement est terminé
    const isFinished = (status === 'payé' || status === 'PAID' || status === 'SUCCESS' || 
                        status === 'échoué' || status === 'FAILED' || status === 'ERROR')
    
    if (isFinished) return
    
    const intervalId = setInterval(fetchStatus, refreshInterval)
    return () => clearInterval(intervalId)
  }, [orderId, fetchStatus, refreshInterval, status])

  // ✅ Redirection si pas d'orderId
  useEffect(() => {
    if (!orderId) {
      navigate('/my-orders')
    }
  }, [orderId, navigate])

  // ✅ Calcul du statut
  const paymentConfig = useMemo(() => {
    if (!status) return null
    return PAYMENT_STATUS_CONFIG[status] || { 
      label: status, 
      icon: Clock3, 
      color: 'text-[var(--text-secondary)]',
      bg: 'bg-[var(--bg-secondary)] border-[var(--border-color)]'
    }
  }, [status])

  const orderConfig = useMemo(() => {
    if (!orderStatus) return null
    return ORDER_STATUS_CONFIG[orderStatus] || { 
      label: orderStatus, 
      icon: Package, 
      color: 'text-[var(--text-secondary)]'
    }
  }, [orderStatus])

  const isFinished = useMemo(() => {
    return status === 'payé' || status === 'PAID' || status === 'SUCCESS' ||
           status === 'échoué' || status === 'FAILED' || status === 'ERROR'
  }, [status])

  const isSuccess = useMemo(() => {
    return status === 'payé' || status === 'PAID' || status === 'SUCCESS'
  }, [status])

  // ✅ Gestion du refresh manuel
  const handleRefresh = useCallback(() => {
    fetchStatus()
  }, [fetchStatus])

  // ✅ Formatage du temps
  const formatTime = useCallback((date) => {
    if (!date) return ''
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }, [])

  if (!orderId) {
    return null
  }

  return (
    <div className={`min-h-screen bg-[var(--bg-secondary)] py-8 sm:py-10 px-4 ${className}`}>
      <div className="max-w-2xl mx-auto">
        {/* Retour */}
        <button
          onClick={() => navigate(-1)}
          className="text-[var(--accent-primary)] font-semibold mb-5 inline-flex items-center gap-2 hover:underline text-sm transition"
        >
          <ArrowLeft size={16} /> Retour
        </button>

        <div className="bg-[var(--bg-card)] rounded-3xl shadow-xl p-6 sm:p-8 border border-[var(--border-color)]">
          {/* En-tête */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-3">
              <div className="text-5xl">💳</div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mb-2">
              Suivi du paiement
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl mx-auto">
              Vérifiez l'état de votre commande et du paiement en temps réel.
            </p>
          </div>

          {/* Numéro de commande */}
          <div className="rounded-3xl border border-[var(--border-color)] p-5 sm:p-6 text-center mb-4">
            <p className="text-xs uppercase text-[var(--text-secondary)] mb-2 tracking-wider">
              Numéro de commande
            </p>
            <p className="text-lg sm:text-xl font-bold text-[var(--accent-primary)] font-mono break-all">
              #{orderId.slice(-8).toUpperCase()}
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]/60 mt-1">
              {lastUpdated && `Dernière mise à jour : ${formatTime(lastUpdated)}`}
            </p>
          </div>

          {/* Statuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Statut paiement */}
            <div className={`rounded-3xl border p-5 sm:p-6 text-center ${paymentConfig?.bg || 'border-[var(--border-color)]'}`}>
              <p className="text-xs uppercase text-[var(--text-secondary)] mb-2 tracking-wider">
                Statut du paiement
              </p>
              {loading ? (
                <div className="flex items-center justify-center gap-3 text-[var(--accent-primary)] py-2">
                  <Loader size={20} className="animate-spin" />
                  <span className="text-sm">Chargement...</span>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-2">
                  <AlertCircle size={24} className="mx-auto mb-1" />
                  <p className="text-sm font-semibold">Erreur</p>
                  <p className="text-xs mt-1">{error}</p>
                </div>
              ) : paymentConfig ? (
                <div className="flex items-center justify-center gap-2">
                  <paymentConfig.icon size={22} className={paymentConfig.color} />
                  <p className={`text-lg sm:text-xl font-bold ${paymentConfig.color}`}>
                    {paymentConfig.label}
                  </p>
                </div>
              ) : (
                <p className="text-base font-semibold text-[var(--text-primary)]">{status || '—'}</p>
              )}
            </div>

            {/* Statut commande */}
            <div className="rounded-3xl border border-[var(--border-color)] p-5 sm:p-6 text-center">
              <p className="text-xs uppercase text-[var(--text-secondary)] mb-2 tracking-wider">
                Statut de la commande
              </p>
              {loading ? (
                <div className="flex items-center justify-center gap-3 text-[var(--accent-primary)] py-2">
                  <Loader size={20} className="animate-spin" />
                  <span className="text-sm">Chargement...</span>
                </div>
              ) : error ? (
                <p className="text-sm text-[var(--text-secondary)]">—</p>
              ) : orderConfig ? (
                <div className="flex items-center justify-center gap-2">
                  <orderConfig.icon size={20} className={orderConfig.color} />
                  <p className={`text-lg sm:text-xl font-bold ${orderConfig.color}`}>
                    {orderConfig.label}
                  </p>
                </div>
              ) : (
                <p className="text-base font-semibold text-[var(--text-primary)]">{orderStatus || '—'}</p>
              )}
            </div>
          </div>

          {/* Message d'état */}
          {isFinished && (
            <div className={`rounded-2xl p-4 mb-6 flex items-start gap-3 ${
              isSuccess 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              {isSuccess ? (
                <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-semibold ${isSuccess ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                  {isSuccess ? '✅ Paiement confirmé !' : '❌ Le paiement a échoué'}
                </p>
                <p className={`text-xs ${isSuccess ? 'text-emerald-600/80 dark:text-emerald-300/80' : 'text-red-600/80 dark:text-red-300/80'}`}>
                  {isSuccess 
                    ? 'Votre commande a été validée. Vous recevrez un email de confirmation.' 
                    : 'Veuillez réessayer ou contacter notre service client.'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Erreur réseau */}
          {error && retryCount > 2 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  ⚠️ Connexion instable
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-300/80">
                  Nous avons du mal à récupérer le statut. Vérifiez votre connexion ou réessayez plus tard.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <ShoppingBag size={16} /> Retour au marché
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="w-full sm:w-auto bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-[var(--text-light)] font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader size={16} className="animate-spin" /> Mise à jour...</>
              ) : (
                <><RefreshCw size={16} /> Rafraîchir</>
              )}
            </button>
          </div>

          {/* Liens supplémentaires */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-[var(--text-secondary)]">
            <button 
              onClick={() => navigate('/my-orders')}
              className="hover:text-[var(--accent-primary)] transition flex items-center gap-1"
            >
              <Package size={12} /> Voir mes commandes
            </button>
            <span className="text-[var(--border-color)]">|</span>
            <button 
              onClick={() => navigate('/service-client')}
              className="hover:text-[var(--accent-primary)] transition flex items-center gap-1"
            >
              <ChevronRight size={12} /> Service client
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentStatus