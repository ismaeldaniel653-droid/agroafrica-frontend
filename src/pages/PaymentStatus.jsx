import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { CheckCircle, Clock3, XCircle } from 'lucide-react'
import { checkPaymentStatus } from '../api/paymentApi'

function PaymentStatus() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState(null)
  const [orderStatus, setOrderStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let intervalId

    const fetchStatus = async () => {
      setLoading(true)
      try {
        const res = await checkPaymentStatus(orderId)
        setStatus(res.paymentStatus || res.status || 'inconnue')
        setOrderStatus(res.orderStatus || 'inconnue')
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de récupérer le statut.')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    intervalId = setInterval(fetchStatus, 8000)
    return () => clearInterval(intervalId)
  }, [orderId])

  const isPending = status === 'en attente' || status === 'PENDING'
  const isPaid = status === 'payé' || status === 'PAID' || status === 'SUCCESS'
  const hasFailed = status === 'échoué' || status === 'FAILED' || status === 'ERROR'

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-8 sm:py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-8">
        <button
          onClick={() => navigate(-1)}
          className="text-[#0C6B4E] font-semibold mb-5 sm:mb-6 inline-flex items-center gap-2 hover:underline text-sm"
        >
          <ArrowLeft size={16} /> Retour
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2E25] mb-3">Suivi du paiement</h1>
          <p className="text-sm text-[#8AADA0] max-w-xl mx-auto">
            Vérifiez l'état de votre commande et du paiement en temps réel.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5">
          <div className="rounded-3xl border border-[#DDE8E2] p-5 sm:p-6 text-center">
            <p className="text-xs uppercase text-[#8AADA0] mb-3">Numéro de commande</p>
            <p className="text-lg sm:text-xl font-bold text-[#0C6B4E] break-all">{orderId}</p>
          </div>

          <div className="rounded-3xl border border-[#DDE8E2] p-5 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center gap-3 text-[#0C6B4E] py-4">
                <Clock3 size={20} className="animate-spin" />
                <span>Chargement du statut...</span>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-4">
                <XCircle size={32} className="mx-auto mb-2" />
                <p className="font-semibold">Erreur</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-xs uppercase text-[#8AADA0] mb-2">Statut du paiement</p>
                  <p className={`text-xl sm:text-2xl font-bold flex items-center justify-center gap-2 ${
                    isPaid ? 'text-green-600' :
                    isPending ? 'text-amber-600' :
                    hasFailed ? 'text-red-600' : 'text-[#1A2E25]'
                  }`}>
                    {isPaid && <CheckCircle size={20} />}
                    {isPending && <Clock3 size={20} />}
                    {hasFailed && <XCircle size={20} />}
                    {status}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-[#8AADA0] mb-2">Statut de la commande</p>
                  <p className="text-base sm:text-lg font-semibold text-[#0C6B4E] text-center">{orderStatus}</p>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold py-3 px-6 rounded-xl transition"
            >
              Retour au marché
            </button>
            <button
              onClick={async () => {
                setError(null)
                setLoading(true)
                try {
                  const res = await checkPaymentStatus(orderId)
                  setStatus(res.paymentStatus || res.status || 'inconnue')
                  setOrderStatus(res.orderStatus || 'inconnue')
                } catch (err) {
                  setError(err.response?.data?.message || 'Impossible de récupérer le statut.')
                } finally {
                  setLoading(false)
                }
              }}
              className="w-full sm:w-auto bg-[#0C6B4E] hover:bg-[#18A070] text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Rafraîchir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentStatus
