import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, User as UserIcon, Calendar, Shield, QrCode } from 'lucide-react'
import { getTraceability } from '../api/qrApi'
import Avatar from '../components/Avatar' // ✅ NOUVEAU

function Trace() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const fetchTrace = async () => {
      try {
        const data = await getTraceability(id)
        setData(data)
      } catch (err) {
        setError('Produit introuvable')
      } finally {
        setLoading(false)
      }
    }
    fetchTrace()
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🌿</div>
        <p className="text-[#8AADA0]">Chargement traçabilité...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-[#1A2E25] font-bold">{error}</p>
        <button onClick={() => navigate('/')} className="mt-4 text-[#0C6B4E] hover:underline">
          Retour à l'accueil
        </button>
      </div>
    </div>
  )

  const { product, trace } = data

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-6 sm:py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* RETOUR */}
        <button
          onClick={() => product?.id ? navigate(`/product/${product.id}`) : navigate('/')}
          className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-5 sm:mb-6 hover:underline text-sm"
        >
          <ArrowLeft size={16} /> Retour
        </button>

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#0C6B4E] to-[#18A070] rounded-3xl p-5 sm:p-6 text-center mb-4 sm:mb-5 text-white">
          <div className="text-4xl sm:text-5xl mb-2">📊</div>
          <h1 className="text-lg sm:text-xl font-extrabold mb-1">Traçabilité du produit</h1>
          <p className="text-white/70 text-xs sm:text-sm">Certifié par AgroAfrica</p>
        </div>

        {/* PRODUIT */}
        <div className="bg-white rounded-2xl border border-[#DDE8E2] p-4 sm:p-5 mb-3 sm:mb-4">
          <h2 className="font-extrabold text-[#1A2E25] text-base sm:text-lg mb-4 flex items-center gap-2">
            🌿 {product?.name}
          </h2>
          <div className="space-y-3">

            <div className="flex items-center gap-3 p-3 bg-[#E8F7F1] rounded-xl">
              <MapPin size={18} className="text-[#0C6B4E] flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#8AADA0]">Origine</p>
                <p className="text-sm font-bold text-[#1A2E25] truncate">{trace?.origine}</p>
              </div>
            </div>

            {/* ✅ NOUVEAU : producteur avec sa photo */}
            <div className="flex items-center gap-3 p-3 bg-[#E8F7F1] rounded-xl">
              <Avatar
                user={{ name: trace?.producteur, avatar: trace?.producteurAvatar }}
                size={36}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#8AADA0]">Producteur</p>
                <p className="text-sm font-bold text-[#1A2E25] truncate">{trace?.producteur}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#E8F7F1] rounded-xl">
              <Calendar size={18} className="text-[#0C6B4E] flex-shrink-0" />
              <div>
                <p className="text-xs text-[#8AADA0]">Date de récolte</p>
                <p className="text-sm font-bold text-[#1A2E25]">
                  {trace?.dateRecolte ? new Date(trace.dateRecolte).toLocaleDateString('fr-FR') : '—'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#E8F7F1] rounded-xl">
              <Shield size={18} className="text-[#0C6B4E] flex-shrink-0" />
              <div>
                <p className="text-xs text-[#8AADA0]">Certification</p>
                <p className="text-sm font-bold text-[#1A2E25]">{trace?.certification}</p>
              </div>
            </div>

          </div>
        </div>

        {/* QR */}
        <div className="bg-white rounded-2xl border border-[#DDE8E2] p-4 sm:p-5 text-center mb-3 sm:mb-4">
          <div className="flex items-center gap-2 justify-center mb-3">
            <QrCode size={18} className="text-[#0C6B4E]" />
            <h3 className="font-bold text-[#1A2E25] text-sm sm:text-base">QR Code officiel</h3>
          </div>
          {product?.qrCode ? (
            <img src={product.qrCode} alt="QR Code traçabilité" loading="lazy"
                 className="w-48 h-48 mx-auto rounded-xl" />
          ) : (
            <div className="w-48 h-48 mx-auto bg-[#E8F7F1] rounded-xl flex items-center justify-center">
              <p className="text-[#8AADA0] text-xs">QR Code non disponible</p>
            </div>
          )}
          <p className="text-xs text-[#8AADA0] mt-3">Scannez pour vérifier l'authenticité</p>
        </div>

        <div className="bg-[#E8F7F1] border border-[#0C6B4E]/20 rounded-2xl p-4 text-center">
          <p className="text-sm font-bold text-[#0C6B4E]">
            ✅ Produit certifié par AgroAfrica
          </p>
          <p className="text-xs text-[#8AADA0] mt-1">{trace?.plateforme}</p>
        </div>

      </div>
    </div>
  )
}

export default Trace
