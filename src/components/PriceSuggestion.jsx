import { useState, useCallback, useMemo } from 'react'
import { Sparkles, TrendingUp, Flame, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

// ✅ Configuration des catégories et pays
const CATEGORIES = [
  { value: '', label: 'Catégorie' },
  { value: 'agricole', label: '🌾 Agricole' },
  { value: 'artisanat', label: '🎨 Artisanat' },
  { value: 'cooperative', label: '🤝 Coopérative' },
]

const COUNTRIES = [
  { value: '', label: 'Pays' },
  { value: 'cameroon', label: '🇨🇲 Cameroun' },
  { value: 'senegal', label: '🇸🇳 Sénégal' },
  { value: 'ghana', label: '🇬🇭 Ghana' },
  { value: 'nigeria', label: '🇳🇬 Nigeria' },
  { value: 'ivory-coast', label: '🇨🇮 Côte d\'Ivoire' },
  { value: 'kenya', label: '🇰🇪 Kenya' },
]

// ✅ Données de prix (à remplacer par l'API)
const PRICE_DATA = {
  'cacao': { min: 2500, max: 4500, avg: 3500, unit: 'kg' },
  'café': { min: 3000, max: 6000, avg: 4500, unit: 'kg' },
  'miel': { min: 2000, max: 4000, avg: 3000, unit: 'L' },
  'huile': { min: 1500, max: 3000, avg: 2200, unit: 'L' },
  'tissu': { min: 5000, max: 15000, avg: 10000, unit: 'm' },
  'poterie': { min: 3000, max: 8000, avg: 5500, unit: 'pièce' },
  'panier': { min: 4000, max: 10000, avg: 7000, unit: 'pièce' },
  'bijoux': { min: 2000, max: 8000, avg: 5000, unit: 'pièce' },
  'default': { min: 1000, max: 5000, avg: 3000, unit: 'unité' },
}

function PriceSuggestion({ 
  onPriceAnalyzed, 
  className = '',
  showHistory = true,
  apiBaseUrl = null, // ✅ Pour la connexion API future
}) {
  const [form, setForm] = useState({ product: '', category: '', origin: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([]) // ✅ Historique des recherches

  // ✅ Gestionnaires optimisés
  const handleInputChange = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }, [])

  // ✅ Validation du formulaire
  const validateForm = useCallback(() => {
    if (!form.product.trim()) {
      setError('Veuillez saisir le nom du produit.')
      return false
    }
    if (form.product.trim().length < 2) {
      setError('Le nom du produit doit faire au moins 2 caractères.')
      return false
    }
    return true
  }, [form.product])

  // ✅ Analyse du prix (simulée ou réelle)
  const analyzePrice = useCallback(async () => {
    if (!validateForm()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      // ✅ Si une API est configurée, l'utiliser
      if (apiBaseUrl) {
        const response = await fetch(`${apiBaseUrl}/api/price-suggestion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        
        if (!response.ok) {
          throw new Error('Erreur lors de l\'analyse')
        }
        
        const data = await response.json()
        setResult({
          ...data,
          pending: false,
        })
        
        if (onPriceAnalyzed) {
          onPriceAnalyzed(data)
        }
        
        // Ajouter à l'historique
        setHistory(prev => [{ 
          product: form.product, 
          price: data.suggested,
          date: new Date().toLocaleDateString('fr-FR'),
        }, ...prev].slice(0, 10))
        
        return
      }

      // ✅ Mode simulation (actuel)
      const key = Object.keys(PRICE_DATA).find(k => 
        form.product.toLowerCase().includes(k)
      ) || 'default'
      
      const data = PRICE_DATA[key]
      const isBio = form.product.toLowerCase().includes('bio')
      const bonus = isBio ? 1.15 : 1

      // Simuler une réponse
      setTimeout(() => {
        const resultData = {
          min: Math.round((data.min || 1000) * bonus),
          max: Math.round((data.max || 5000) * bonus),
          suggested: Math.round((data.avg || 3000) * bonus),
          trend: '+12% ce mois',
          demand: 'Forte demande',
          isBio,
          unit: data.unit || 'unité',
          pending: false,
        }
        
        setResult(resultData)
        setLoading(false)
        
        if (onPriceAnalyzed) {
          onPriceAnalyzed(resultData)
        }
        
        setHistory(prev => [{ 
          product: form.product, 
          price: resultData.suggested,
          date: new Date().toLocaleDateString('fr-FR'),
        }, ...prev].slice(0, 10))
      }, 1200)
      
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
      setLoading(false)
    }
  }, [form, validateForm, apiBaseUrl, onPriceAnalyzed])

  // ✅ Réinitialisation du formulaire
  const resetForm = useCallback(() => {
    setForm({ product: '', category: '', origin: '' })
    setResult(null)
    setError('')
  }, [])

  // ✅ Formatage du prix
  const formatPrice = useCallback((price) => {
    return price?.toLocaleString() || '0'
  }, [])

  return (
    <div className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 md:p-5 ${className}`}>
      {/* En-tête */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} className="text-amber-500" />
        <h3 className="font-bold text-[var(--text-primary)] text-sm md:text-base">
          IA — Suggestion de prix
        </h3>
        <span className="text-[10px] md:text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-lg font-semibold">
          BETA
        </span>
      </div>

      {/* Formulaire */}
      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Nom du produit (ex: Cacao bio)"
          value={form.product}
          onChange={(e) => handleInputChange('product', e.target.value)}
          className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition placeholder-[var(--text-secondary)]/50"
          aria-label="Nom du produit"
          onKeyDown={(e) => e.key === 'Enter' && analyzePrice()}
        />
        
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <select
            value={form.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] transition"
            aria-label="Catégorie"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          
          <select
            value={form.origin}
            onChange={(e) => handleInputChange('origin', e.target.value)}
            className="border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] transition"
            aria-label="Pays d'origine"
          >
            {COUNTRIES.map(country => (
              <option key={country.value} value={country.value}>{country.label}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-xs animate-fade-in bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <button
          onClick={analyzePrice}
          disabled={!form.product || loading}
          className="w-full bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? 'Analyse en cours...' : 'Analyser le prix optimal'}
        </button>
      </div>

      {/* Résultat */}
      {result && !result.pending && (
        <div className="bg-[var(--accent-primary)]/10 rounded-xl p-4 border border-[var(--accent-primary)]/20 animate-fade-in">
          <p className="text-xs font-semibold text-[var(--accent-primary)] mb-3 flex items-center gap-1">
            <CheckCircle2 size={14} /> Analyse IA terminée
            {result.isBio && <span className="ml-1 text-emerald-600">🌱 +15% Bio</span>}
          </p>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-[var(--bg-card)] rounded-lg p-2 text-center border border-[var(--border-color)]">
              <p className="text-[10px] md:text-xs text-[var(--text-secondary)]">Minimum</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                {formatPrice(result.min)} FCFA
              </p>
              <p className="text-[10px] text-[var(--text-secondary)]">/{result.unit || 'unité'}</p>
            </div>
            
            <div className="bg-[var(--accent-primary)] rounded-lg p-2 text-center">
              <p className="text-[10px] md:text-xs text-white/70">Suggéré</p>
              <p className="text-sm font-bold text-white">
                {formatPrice(result.suggested)} FCFA
              </p>
              <p className="text-[10px] text-white/70">⭐ /{result.unit || 'unité'}</p>
            </div>
            
            <div className="bg-[var(--bg-card)] rounded-lg p-2 text-center border border-[var(--border-color)]">
              <p className="text-[10px] md:text-xs text-[var(--text-secondary)]">Maximum</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                {formatPrice(result.max)} FCFA
              </p>
              <p className="text-[10px] text-[var(--text-secondary)]">/{result.unit || 'unité'}</p>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {result.trend && (
              <span className="text-[10px] md:text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg font-semibold flex items-center gap-1">
                <TrendingUp size={12} /> {result.trend}
              </span>
            )}
            {result.demand && (
              <span className="text-[10px] md:text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-lg font-semibold flex items-center gap-1">
                <Flame size={12} /> {result.demand}
              </span>
            )}
          </div>
        </div>
      )}

      {/* État "en attente" */}
      {result?.pending && (
        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-color)] text-center animate-fade-in">
          <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
            ⏳ Service en cours de déploiement
          </p>
          <p className="text-xs text-[var(--text-secondary)]/70">
            L'IA sera connectée prochainement pour vous proposer des fourchettes de prix réelles en temps réel.
          </p>
        </div>
      )}

      {/* Historique */}
      {showHistory && history.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
          <p className="text-xs text-[var(--text-secondary)] font-semibold mb-2">
            📋 Historique ({history.length})
          </p>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {history.map((item, index) => (
              <div key={index} className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>{item.product}</span>
                <span className="font-semibold text-[var(--accent-secondary)]">
                  {formatPrice(item.price)} FCFA
                </span>
                <span className="text-[10px]">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PriceSuggestion