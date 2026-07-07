import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Shield, CheckCircle, Lock, XCircle, 
  Sparkles, QrCode, Copy, Check, Clock, Award,
  ExternalLink, Loader, AlertCircle
} from 'lucide-react'

// ✅ Certificats de démonstration
const DEMO_CERTS = {
  'AGRO-DEMO-001': {
    id: 'AGRO-DEMO-001',
    product: 'Cacao bio Bassa\'a',
    producer: 'Coopérative Bassa\'a',
    origin: 'Littoral, Cameroun 🇨🇲',
    type: 'Bio certifié',
    issued: '2025-06-15',
    expires: '2027-06-15',
    hash: '0x7a3f...9e2b',
    valid: true,
    isDemo: true,
    badge: '🌱 Bio',
    rating: 4.8,
  },
  'AGRO-DEMO-002': {
    id: 'AGRO-DEMO-002',
    product: 'Café Arabica Éthiopie',
    producer: 'Coopérative Sidama',
    origin: 'Sidama, Éthiopie 🇪🇹',
    type: 'Commerce équitable',
    issued: '2025-04-10',
    expires: '2027-04-10',
    hash: '0x4b8f...7c1d',
    valid: true,
    isDemo: true,
    badge: '☕ Premium',
    rating: 4.9,
  },
  'AGRO-DEMO-003': {
    id: 'AGRO-DEMO-003',
    product: 'Panier Tressé Sisal',
    producer: 'Artisans de Thiès',
    origin: 'Thiès, Sénégal 🇸🇳',
    type: 'Artisanat certifié',
    issued: '2025-05-20',
    expires: '2027-05-20',
    hash: '0x9d2e...1a3f',
    valid: true,
    isDemo: true,
    badge: '🧺 Artisanal',
    rating: 4.7,
  },
}

// ✅ Suggestions de certificats
const SUGGESTIONS = ['AGRO-DEMO-001', 'AGRO-DEMO-002', 'AGRO-DEMO-003']

function Certification({ className = '' }) {
  const navigate = useNavigate()
  const [certId, setCertId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  // ✅ Vérification du certificat
  const verifyCert = useCallback(() => {
    setError(null)
    
    if (!certId.trim()) {
      setError('Veuillez entrer un ID de certificat')
      return
    }
    
    setLoading(true)
    setResult(null)
    
    setTimeout(() => {
      const found = DEMO_CERTS[certId.toUpperCase()]
      if (found) {
        setResult(found)
      } else {
        setResult(null)
        setError('Certificat non trouvé sur la blockchain AgroAfrica')
      }
      setLoading(false)
    }, 1200)
  }, [certId])

  // ✅ Copie du hash
  const copyHash = useCallback((hash) => {
    navigator.clipboard?.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  // ✅ Formatage de la date
  const formatDate = useCallback((date) => {
    if (!date || date === '—') return '—'
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })
  }, [])

  // ✅ Vérification si la date est expirée
  const isExpired = useCallback((date) => {
    if (!date || date === '—') return false
    return new Date(date) < new Date()
  }, [])

  // ✅ Suggestions
  const handleSuggestion = useCallback((id) => {
    setCertId(id)
    setError(null)
  }, [])

  return (
    <div className={`max-w-2xl mx-auto px-4 sm:px-5 py-6 sm:py-8 ${className}`}>
      {/* Retour */}
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-[var(--accent-primary)] font-semibold mb-5 hover:underline text-sm transition"
      >
        <ArrowLeft size={16} /> Retour au marché
      </button>

      {/* En-tête */}
      <div className="relative bg-gradient-to-br from-[#0D1F2D] to-[#1A3A52] rounded-3xl p-5 sm:p-6 text-white text-center mb-5 sm:mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="text-3xl sm:text-4xl mb-2">🔗</div>
          <h1 className="text-xl sm:text-2xl font-extrabold mb-1 flex items-center justify-center gap-2">
            Certification Blockchain
            <span className="text-[10px] bg-amber-400 text-[#0D1F2D] px-2 py-0.5 rounded-full font-bold">
              BETA
            </span>
          </h1>
          <p className="text-white/70 text-xs sm:text-sm">
            Vérifiez l'authenticité de n'importe quel produit
          </p>
        </div>
      </div>

      {/* Formulaire de vérification */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 sm:p-5 mb-4 sm:mb-5">
        <h2 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 text-sm sm:text-base">
          <Shield size={18} className="text-[var(--accent-primary)]" />
          Vérifier un certificat
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Ex: AGRO-DEMO-001"
            value={certId}
            onChange={e => setCertId(e.target.value.toUpperCase())}
            className="flex-1 min-w-0 border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] font-mono uppercase placeholder-[var(--text-secondary)]/50"
            onKeyDown={e => e.key === 'Enter' && verifyCert()}
            aria-label="ID du certificat"
          />
          <button
            onClick={verifyCert}
            disabled={!certId || loading}
            className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-[var(--text-light)] font-bold px-5 py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader size={16} className="animate-spin" /> Vérification...</>
            ) : (
              <><Shield size={16} /> Vérifier</>
            )}
          </button>
        </div>

        {/* Suggestions */}
        {!result && !loading && (
          <div className="mt-3">
            <p className="text-xs text-[var(--text-secondary)] mb-1.5">
              💡 Certificats de démonstration :
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map(id => (
                <button
                  key={id}
                  onClick={() => handleSuggestion(id)}
                  className="text-[10px] font-mono bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] px-2 py-1 rounded-lg text-[var(--text-secondary)] transition"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 animate-fade-in">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </div>

      {/* Résultat - Certificat invalide */}
      {result === null && certId && !loading && !error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5 text-center animate-fade-in">
          <XCircle size={32} className="text-red-500 mx-auto mb-2" />
          <p className="font-bold text-red-700 dark:text-red-400">Certificat invalide</p>
          <p className="text-sm text-red-500 dark:text-red-300 mt-1">
            Ce certificat n'existe pas sur la blockchain AgroAfrica
          </p>
        </div>
      )}

      {/* Résultat - Certificat valide */}
      {result && (
        <div className="bg-[var(--bg-card)] rounded-2xl border-2 border-[var(--accent-primary)] p-4 sm:p-5 animate-fade-in">
          {/* En-tête du certificat */}
          <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center">
                <CheckCircle size={22} className="text-[var(--accent-primary)]" />
              </div>
              <div>
                <h3 className="font-extrabold text-[var(--text-primary)] text-sm sm:text-base">
                  Certificat valide ✅
                </h3>
                {result.isDemo && (
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">
                    🧪 Démonstration
                  </span>
                )}
              </div>
            </div>
            {result.badge && (
              <span className="text-xs bg-[var(--bg-secondary)] px-3 py-1 rounded-full font-semibold text-[var(--text-primary)]">
                {result.badge}
              </span>
            )}
          </div>

          {/* Détails du certificat */}
          <div className="space-y-3 mb-4">
            {[
              { label: 'ID', value: result.id, icon: <QrCode size={14} /> },
              { label: 'Produit', value: result.product, icon: <Award size={14} /> },
              { label: 'Producteur', value: result.producer },
              { label: 'Origine', value: result.origin },
              { label: 'Type', value: result.type },
              { 
                label: 'Délivré le', 
                value: formatDate(result.issued),
                icon: <Clock size={14} />
              },
              { 
                label: 'Expire le', 
                value: formatDate(result.expires),
                icon: <Clock size={14} />
              },
            ].map((item, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center py-2 border-b border-[var(--border-color)] last:border-0 gap-3"
              >
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                  {item.icon} {item.label}
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)] text-right truncate">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Hash Blockchain */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Lock size={12} className="text-[var(--accent-secondary)]" />
                <span className="text-xs text-[var(--text-secondary)] font-mono font-bold">
                  Hash Blockchain
                </span>
              </div>
              <button
                onClick={() => copyHash(result.hash)}
                className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition"
                aria-label="Copier le hash"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
            <p className="font-mono text-xs text-[var(--text-primary)] break-all">
              {result.hash}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => window.open(`https://etherscan.io/address/${result.hash}`, '_blank')}
              className="flex-1 bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] font-semibold py-2 rounded-xl text-sm transition flex items-center justify-center gap-1"
            >
              <ExternalLink size={14} /> Voir sur Etherscan
            </button>
            <button 
              onClick={() => {
                setCertId('')
                setResult(null)
                setError(null)
              }}
              className="flex-1 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-[var(--text-light)] font-bold py-2 rounded-xl text-sm transition"
            >
              🔍 Nouvelle vérification
            </button>
          </div>
        </div>
      )}

      {/* Comment ça marche */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl p-4 sm:p-5 mt-4 sm:mt-5">
        <h3 className="font-bold text-[var(--text-primary)] mb-3 text-sm sm:text-base flex items-center gap-2">
          <Sparkles size={18} className="text-[var(--accent-secondary)]" />
          Comment ça marche ?
        </h3>
        <div className="space-y-2">
          {[
            { 
              step: '1', 
              text: 'Le producteur enregistre son produit sur AgroAfrica',
              icon: '📦'
            },
            { 
              step: '2', 
              text: 'Un certificat unique est généré et stocké sur la blockchain',
              icon: '🔗'
            },
            { 
              step: '3', 
              text: "L'acheteur scanne le QR Code ou entre l'ID du certificat",
              icon: '📱'
            },
            { 
              step: '4', 
              text: 'La blockchain confirme l\'authenticité en temps réel',
              icon: '✅'
            },
          ].map((s, index) => (
            <div key={index} className="flex items-start gap-3 p-2 rounded-xl hover:bg-[var(--bg-card)] transition">
              <div className="w-6 h-6 bg-[var(--accent-primary)] rounded-full flex items-center justify-center text-[var(--text-light)] text-[10px] font-bold flex-shrink-0">
                {s.step}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="mr-1">{s.icon}</span> {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Certification