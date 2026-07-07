import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, MapPin, User as UserIcon, Calendar, 
  Shield, QrCode, CheckCircle, Clock, Package,
  Loader, AlertCircle, Leaf, Sparkles, ExternalLink
} from 'lucide-react'
import { getTraceability } from '../api/qrApi'
import Avatar from '../components/Avatar'

// ✅ Configuration des certificats
const CERTIFICATION_CONFIG = {
  'bio': { label: '🌱 Bio', color: 'text-emerald-600 dark:text-emerald-400' },
  'equitable': { label: '🤝 Commerce équitable', color: 'text-blue-600 dark:text-blue-400' },
  'artisanat': { label: '🎨 Artisanat certifié', color: 'text-amber-600 dark:text-amber-400' },
  'qualite': { label: '🏅 Qualité supérieure', color: 'text-purple-600 dark:text-purple-400' },
  'default': { label: '✅ Certifié AgroAfrica', color: 'text-[var(--accent-primary)]' },
}

function Trace({ 
  className = '',
  onError,
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  // ✅ Chargement des données
  useEffect(() => {
    const fetchTrace = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getTraceability(id)
        setData(result)
      } catch (err) {
        const errorMsg = err?.response?.data?.message || 'Produit introuvable'
        setError(errorMsg)
        if (onError) onError(errorMsg)
      } finally {
        setLoading(false)
      }
    }
    fetchTrace()
  }, [id, onError])

  // ✅ Calculs mémorisés
  const certificationConfig = useMemo(() => {
    const certKey = data?.trace?.certification?.toLowerCase() || 'default'
    return CERTIFICATION_CONFIG[certKey] || CERTIFICATION_CONFIG.default
  }, [data?.trace?.certification])

  const formattedDate = useMemo(() => {
    if (!data?.trace?.dateRecolte) return '—'
    const date = new Date(data.trace.dateRecolte)
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })
  }, [data?.trace?.dateRecolte])

  // ✅ Copie du hash
  const copyHash = useCallback(() => {
    if (!data?.trace?.hash) return
    navigator.clipboard?.writeText(data.trace.hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [data?.trace?.hash])

  // ✅ Formatage de l'ID
  const formatId = useCallback((id) => {
    if (!id) return '—'
    if (typeof id === 'string' && id.length > 12) {
      return `${id.slice(0, 6)}...${id.slice(-6)}`
    }
    return id
  }, [])

  // ✅ Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <Loader size={40} className="text-[var(--accent-primary)] animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Chargement de la traçabilité...</p>
        </div>
      </div>
    )
  }

  // ✅ Erreur
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-lg font-bold text-[var(--text-primary)]">Produit introuvable</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            {error || "Le produit que vous recherchez n'existe pas ou n'est pas traçable."}
          </p>
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

  const { product, trace } = data

  return (
    <div className={`min-h-screen bg-[var(--bg-secondary)] py-6 sm:py-8 px-4 ${className}`}>
      <div className="max-w-lg mx-auto">
        {/* RETOUR */}
        <button
          onClick={() => product?.id ? navigate(`/product/${product.id}`) : navigate('/')}
          className="flex items-center gap-2 text-[var(--accent-primary)] font-semibold mb-5 hover:underline text-sm transition"
        >
          <ArrowLeft size={16} /> 
          {product?.id ? 'Retour au produit' : 'Retour au marché'}
        </button>

        {/* HEADER */}
        <div className="relative bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-primary)]/80 rounded-3xl p-5 sm:p-6 text-center mb-4 text-[var(--text-light)] overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="text-4xl sm:text-5xl mb-2">📊</div>
            <h1 className="text-lg sm:text-xl font-extrabold mb-1">
              Traçabilité du produit
            </h1>
            <p className="text-[var(--text-light)]/70 text-xs sm:text-sm flex items-center justify-center gap-1">
              <Shield size={12} /> Certifié par AgroAfrica
            </p>
          </div>
        </div>

        {/* PRODUIT */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 sm:p-5 mb-3">
          <div className="flex items-start gap-3 mb-4">
            <div className="text-3xl">{product?.emoji || '🌿'}</div>
            <div className="flex-1 min-w-0">
              <h2 className="font-extrabold text-[var(--text-primary)] text-base sm:text-lg truncate">
                {product?.name || 'Produit'}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                <Package size={12} /> ID: {formatId(product?.id || trace?.productId)}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
              {product?.category || 'Agricole'}
            </span>
          </div>

          <div className="space-y-3">
            {/* Origine */}
            <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-xl">
              <MapPin size={18} className="text-[var(--accent-primary)] flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[var(--text-secondary)]">Origine</p>
                <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                  {trace?.origine || 'Non spécifiée'}
                </p>
              </div>
            </div>

            {/* Producteur */}
            <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-xl">
              <Avatar
                user={{ name: trace?.producteur, avatar: trace?.producteurAvatar }}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[var(--text-secondary)]">Producteur</p>
                <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                  {trace?.producteur || 'Inconnu'}
                </p>
              </div>
            </div>

            {/* Date de récolte */}
            <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-xl">
              <Calendar size={18} className="text-[var(--accent-primary)] flex-shrink-0" />
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Date de récolte</p>
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {formattedDate}
                </p>
              </div>
            </div>

            {/* Certification */}
            <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-xl">
              <Shield size={18} className="text-[var(--accent-primary)] flex-shrink-0" />
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Certification</p>
                <p className={`text-sm font-bold ${certificationConfig.color}`}>
                  {certificationConfig.label}
                </p>
              </div>
            </div>

            {/* Hash blockchain */}
            {trace?.hash && (
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-xl">
                <div className="text-[var(--accent-primary)] flex-shrink-0">🔗</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--text-secondary)]">Hash Blockchain</p>
                  <p className="text-xs font-mono text-[var(--text-primary)] truncate">
                    {trace.hash}
                  </p>
                </div>
                <button
                  onClick={copyHash}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition p-1"
                  aria-label="Copier le hash"
                >
                  {copied ? <CheckCircle size={14} className="text-emerald-500" /> : <ExternalLink size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* QR CODE */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 sm:p-5 text-center mb-3">
          <div className="flex items-center gap-2 justify-center mb-3">
            <QrCode size={18} className="text-[var(--accent-primary)]" />
            <h3 className="font-bold text-[var(--text-primary)] text-sm sm:text-base">
              QR Code officiel
            </h3>
          </div>
          {trace?.qrCode ? (
            <img 
              src={trace.qrCode} 
              alt="QR Code de traçabilité" 
              loading="lazy"
              className="w-48 h-48 mx-auto rounded-xl border border-[var(--border-color)]" 
            />
          ) : (
            <div className="w-48 h-48 mx-auto bg-[var(--bg-secondary)] rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)]">
              <QrCode size={32} className="text-[var(--text-secondary)]/30" />
              <p className="text-xs text-[var(--text-secondary)] mt-2">QR Code non disponible</p>
            </div>
          )}
          <p className="text-xs text-[var(--text-secondary)] mt-3">
            Scannez pour vérifier l'authenticité du produit
          </p>
        </div>

        {/* Certification finale */}
        <div className="bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle size={18} className="text-[var(--accent-primary)]" />
            <p className="text-sm font-bold text-[var(--accent-primary)]">
              ✅ Produit certifié par AgroAfrica
            </p>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            {trace?.plateforme || 'AgroAfrica — Blockchain sécurisée'}
          </p>
          {trace?.timestamp && (
            <p className="text-[10px] text-[var(--text-secondary)]/60 mt-1">
              Enregistré le {new Date(trace.timestamp).toLocaleString('fr-FR')}
            </p>
          )}
        </div>

        {/* Bouton d'action */}
        <div className="mt-4">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold rounded-xl hover:bg-[var(--bg-secondary)] transition text-sm flex items-center justify-center gap-2"
          >
            <Leaf size={16} /> Retour au marché
          </button>
        </div>
      </div>
    </div>
  )
}

export default Trace