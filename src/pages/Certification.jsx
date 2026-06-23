import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, CheckCircle, Lock, XCircle } from 'lucide-react'

// ✅ NOUVEAU : exemples explicitement marqués "démo"
const DEMO_CERTS = {
  'AGRO-DEMO-001': {
    product:    '[DÉMO] Cacao bio Bassa\'a',
    producer:   '[DÉMO] Coop. Bassa\'a',
    origin:     'Littoral, Cameroun',
    type:       'Bio certifié (exemple)',
    issued:     '—',
    expires:    '—',
    hash:       '0xDEMO000000000000000000000000000000000000',
    valid:      true,
    isDemo:     true
  }
}

function Certification() {
  const navigate = useNavigate()
  const [certId, setCertId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  function verifyCert() {
    setLoading(true)
    setTimeout(() => {
      // ✅ NOUVEAU : n'accepte que les IDs démo explicitement marqués
      setResult(DEMO_CERTS[certId] || null)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-5 py-6 sm:py-8">

      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-5 sm:mb-6 hover:underline text-sm">
        <ArrowLeft size={16} /> Retour
      </button>

      <div className="bg-gradient-to-r from-[#0D1F2D] to-[#1A3A52] rounded-3xl p-5 sm:p-6 text-white text-center mb-5 sm:mb-6">
        <div className="text-3xl sm:text-4xl mb-2">🔗</div>
        <h1 className="text-xl sm:text-2xl font-extrabold mb-1">Certification Blockchain</h1>
        <p className="text-white/70 text-xs sm:text-sm">Vérifiez l'authenticité de n'importe quel produit</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#DDE8E2] p-4 sm:p-5 mb-4 sm:mb-5">
        <h2 className="font-bold text-[#1A2E25] mb-4 flex items-center gap-2 text-sm sm:text-base">
          <Shield size={18} className="text-[#0C6B4E]" />
          Vérifier un certificat
        </h2>
        {/* ✅ NOUVEAU : stack vertical sur mobile */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Ex: AGRO-DEMO-001"
            value={certId}
            onChange={e => setCertId(e.target.value.toUpperCase())}
            className="flex-1 min-w-0 border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E] font-mono"
          />
          <button
            onClick={verifyCert}
            disabled={!certId || loading}
            className="bg-[#0C6B4E] hover:bg-[#18A070] text-white font-bold px-5 py-3 rounded-xl transition disabled:opacity-50 text-sm whitespace-nowrap">
            {loading ? '⏳ Vérification...' : '🔍 Vérifier'}
          </button>
        </div>
        <p className="text-xs text-[#8AADA0] mt-2">
          Aucun certificat actif. La blockchain sera alimentée par les premiers vendeurs certifiés.
        </p>
      </div>

      {result === null && certId && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
          <XCircle size={32} className="text-red-500 mx-auto mb-2" />
          <p className="font-bold text-red-700">Certificat invalide</p>
          <p className="text-sm text-red-500 mt-1">Ce certificat n'existe pas sur la blockchain AgroAfrica</p>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-2xl border-2 border-[#0C6B4E] p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <CheckCircle size={22} className="text-[#0C6B4E]" />
            <h3 className="font-extrabold text-[#0C6B4E] text-sm sm:text-base">
              Certificat valide ✅
              {result.isDemo && <span className="ml-2 text-xs text-amber-600 font-bold">(démo)</span>}
            </h3>
          </div>

          <div className="space-y-3 mb-4">
            {[
              { label:'Produit',    value: result.product  },
              { label:'Producteur', value: result.producer },
              { label:'Origine',    value: result.origin   },
              { label:'Type',       value: result.type     },
              { label:'Délivré le', value: result.issued   },
              { label:'Expire le',  value: result.expires  },
            ].map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-[#DDE8E2] last:border-0 gap-3">
                <span className="text-xs text-[#8AADA0] flex-shrink-0">{item.label}</span>
                <span className="text-sm font-semibold text-[#1A2E25] text-right truncate">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#0D1F2D] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Lock size={12} className="text-amber-400" />
              <span className="text-xs text-amber-400 font-mono font-bold">Hash Blockchain</span>
            </div>
            <p className="font-mono text-xs text-green-400 break-all">{result.hash}</p>
          </div>
        </div>
      )}

      <div className="bg-[#F5F7F5] rounded-2xl p-4 sm:p-5 mt-4 sm:mt-5">
        <h3 className="font-bold text-[#1A2E25] mb-3 text-sm sm:text-base">🔗 Comment ça marche ?</h3>
        <div className="space-y-2">
          {[
            { step:'1', text:'Le producteur enregistre son produit sur AgroAfrica' },
            { step:'2', text:'Un certificat unique est généré et stocké sur la blockchain' },
            { step:'3', text:'L\'acheteur scanne le QR Code ou entre l\'ID du certificat' },
            { step:'4', text:'La blockchain confirme l\'authenticité en temps réel' },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#0C6B4E] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {s.step}
              </div>
              <p className="text-sm text-[#4A6355]">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Certification
