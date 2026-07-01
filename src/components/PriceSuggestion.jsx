import { useState } from 'react'
import { Sparkles, TrendingUp, Flame, Loader2, CheckCircle2 } from 'lucide-react'   // ✅ NOUVEAU

function PriceSuggestion() {
  const [form, setForm]         = useState({ product: '', category: '', origin: '' })
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')    // ✅ NOUVEAU

  // ✅ MODIFIÉ : placeholder values "—" qui deviennent réels quand l'API est connectée
  const PRICE_DATA = {
    'cacao':    { min: null, max: null, avg: null },
    'café':     { min: null, max: null, avg: null },
    'miel':     { min: null, max: null, avg: null },
    'huile':    { min: null, max: null, avg: null },
    'tissu':    { min: null, max: null, avg: null },
    'poterie':  { min: null, max: null, avg: null },
    'panier':   { min: null, max: null, avg: null },
    'bijoux':   { min: null, max: null, avg: null },
    'default':  { min: null, max: null, avg: null },
  }

  function analyzePrice() {
    setError('')
    if (!form.product.trim()) {
      setError('Veuillez saisir le nom du produit.')
      return
    }
    setLoading(true)
    // ✅ MODIFIÉ : simulation (à remplacer par Appels API.get('/price-suggestion'))
    setTimeout(() => {
      const key  = Object.keys(PRICE_DATA).find(k => form.product.toLowerCase().includes(k)) || 'default'
      const data = PRICE_DATA[key]

      // ✅ NOUVEAU : si on est en "attente backend", on retourne état neutre
      if (!data.avg) {
        setResult({ pending: true, trend: '—', demand: '—', isBio: form.product.toLowerCase().includes('bio') })
      } else {
        const isBio = form.product.toLowerCase().includes('bio')
        const bonus = isBio ? 1.15 : 1
        setResult({
          min:       Math.round(data.min * bonus),
          max:       Math.round(data.max * bonus),
          suggested: Math.round(data.avg * bonus),
          trend:     '+12% ce mois',
          demand:    'Forte demande',
          isBio
        })
      }
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#DDE8E2] p-4 md:p-5">

      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} className="text-amber-500" />
        <h3 className="font-bold text-[#1A2E25] text-sm md:text-base">IA — Suggestion de prix</h3>
        <span className="text-[10px] md:text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg font-semibold">BETA</span>
      </div>

      <div className="space-y-3 mb-4">
        <input type="text"
               placeholder="Nom du produit (ex: Cacao bio)"
               value={form.product}
               onChange={e => setForm({...form, product: e.target.value})}
               className="w-full border border-[#DDE8E2] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0C6B4E] focus:ring-2 focus:ring-[#0C6B4E]/20 transition" />
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <select value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="border border-[#DDE8E2] rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:border-[#0C6B4E]">
            <option value="">Catégorie</option>
            <option>Agricole</option>
            <option>Artisanat</option>
            <option>Coopérative</option>
          </select>
          <select value={form.origin}
                  onChange={e => setForm({...form, origin: e.target.value})}
                  className="border border-[#DDE8E2] rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:border-[#0C6B4E]">
            <option value="">Pays</option>
            <option>Cameroun</option>
            <option>Sénégal</option>
            <option>Ghana</option>
            <option>Nigeria</option>
          </select>
        </div>

        {error && <p className="text-xs text-red-500 animate-fade-in">⚠️ {error}</p>}

        <button onClick={analyzePrice}
                disabled={!form.product || loading}
                className="w-full bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? 'Analyse en cours...' : 'Analyser le prix optimal'}
        </button>
      </div>

      {result && (
        result.pending ? (
          // ✅ NOUVEAU : état "en attente API backend"
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center animate-fade-in">
            <p className="text-sm font-semibold text-gray-600 mb-1">⏳ Service en cours de déploiement</p>
            <p className="text-xs text-gray-500">L'IA sera connectée prochainement pour vous proposer des fourchettes de prix réelles en temps réel.</p>
          </div>
        ) : (
          <div className="bg-[#E8F7F1] rounded-xl p-4 border border-[#0C6B4E]/20 animate-fade-in">
            <p className="text-xs font-semibold text-[#0C6B4E] mb-3 flex items-center gap-1">
              <CheckCircle2 size={14} /> Analyse IA terminée {result.isBio ? '🌱 +15% Bio' : ''}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-white rounded-lg p-2 text-center">
                <p className="text-[10px] md:text-xs text-[#8AADA0]">Minimum</p>
                <p className="text-sm font-bold text-[#1A2E25]">{result.min.toLocaleString()}</p>
                <p className="text-[10px] text-[#8AADA0]">FCFA</p>
              </div>
              <div className="bg-[#0C6B4E] rounded-lg p-2 text-center">
                <p className="text-[10px] md:text-xs text-white/70">Suggéré</p>
                <p className="text-sm font-bold text-white">{result.suggested.toLocaleString()}</p>
                <p className="text-[10px] text-white/70">FCFA ⭐</p>
              </div>
              <div className="bg-white rounded-lg p-2 text-center">
                <p className="text-[10px] md:text-xs text-[#8AADA0]">Maximum</p>
                <p className="text-sm font-bold text-[#1A2E25]">{result.max.toLocaleString()}</p>
                <p className="text-[10px] text-[#8AADA0]">FCFA</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[10px] md:text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-semibold flex items-center gap-1">
                <TrendingUp size={12} /> {result.trend}
              </span>
              <span className="text-[10px] md:text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-semibold flex items-center gap-1">
                <Flame size={12} /> {result.demand}
              </span>
            </div>
          </div>
        )
      )}

    </div>
  )
}

export default PriceSuggestion
