import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Send, ArrowDownLeft, History, 
  Wallet, CreditCard, RefreshCw, AlertCircle,
  CheckCircle, Loader, Users, Globe
} from 'lucide-react'
import { getWallet, getTransactions, sendMoney } from '../api/walletApi'
import Avatar from '../components/Avatar'

// ✅ Configuration des pays
const COUNTRIES = [
  { value: 'Cameroun', label: '🇨🇲 Cameroun', code: 'CM' },
  { value: 'Sénégal', label: '🇸🇳 Sénégal', code: 'SN' },
  { value: 'Nigeria', label: '🇳🇬 Nigeria', code: 'NG' },
  { value: 'Ghana', label: '🇬🇭 Ghana', code: 'GH' },
  { value: "Côte d'Ivoire", label: '🇨🇮 Côte d\'Ivoire', code: 'CI' },
  { value: 'Kenya', label: '🇰🇪 Kenya', code: 'KE' },
  { value: 'Bénin', label: '🇧🇯 Bénin', code: 'BJ' },
  { value: 'Togo', label: '🇹🇬 Togo', code: 'TG' },
]

// ✅ Frais par pays
const getFees = (amount, country) => {
  const baseFee = 0.01 // 1% par défaut
  const countryFees = {
    'Cameroun': 0.005,
    'Sénégal': 0.015,
    'Nigeria': 0.02,
  }
  const feeRate = countryFees[country] || baseFee
  return Math.round(amount * feeRate)
}

function AgroAfricaPay({ 
  onTransactionComplete,
  className = '',
}) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('send')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [balance, setBalance] = useState(0)
  const [accountId, setAccountId] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [form, setForm] = useState({ 
    phone: '', 
    amount: '', 
    country: 'Cameroun',
    reason: '' 
  })

  // ✅ Chargement des données
  const loadData = useCallback(async () => {
    try {
      const [walletData, txData] = await Promise.all([
        getWallet(),
        getTransactions()
      ])
      
      setBalance(walletData?.balance ?? 0)
      setAccountId(walletData?.accountId ?? walletData?.id ?? null)
      setTransactions(Array.isArray(txData) ? txData : txData?.transactions || [])
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur de chargement des données')
      setBalance(0)
      setTransactions([])
    }
  }, [])

  // ✅ Chargement initial
  useEffect(() => {
    loadData()
    
    // Auto-refresh toutes les 30s
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [loadData])

  // ✅ Envoi d'argent
  const handleSend = useCallback(async (e) => {
    e.preventDefault()
    setError(null)
    
    const amount = Number(form.amount)
    
    // Validation
    if (!form.phone.trim()) {
      setError('Numéro de téléphone requis')
      return
    }
    if (form.phone.trim().length < 8) {
      setError('Numéro de téléphone invalide')
      return
    }
    if (!amount || amount < 500) {
      setError('Montant minimum 500 FCFA')
      return
    }
    if (amount > balance) {
      setError('Solde insuffisant')
      return
    }
    
    setLoading(true)
    
    try {
      await sendMoney({ 
        phone: form.phone, 
        amount: amount, 
        country: form.country,
        reason: form.reason.trim() || undefined
      })
      
      setSuccess(true)
      
      if (onTransactionComplete) {
        onTransactionComplete({ type: 'send', amount, phone: form.phone })
      }
      
      // Recharger les données après l'envoi
      await loadData()
      
      // Réinitialiser le formulaire
      setForm(prev => ({ ...prev, phone: '', amount: '', reason: '' }))
      
      setTimeout(() => setSuccess(false), 3000)
      
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors du transfert')
    } finally {
      setLoading(false)
    }
  }, [form, balance, loadData, onTransactionComplete])

  // ✅ Rafraîchissement manuel
  const handleRefresh = useCallback(async () => {
    await loadData()
  }, [loadData])

  // ✅ Formatage du prix
  const formatPrice = useCallback((value) => {
    return value?.toLocaleString() || '0'
  }, [])

  // ✅ Calcul des frais
  const fees = useMemo(() => {
    const amount = Number(form.amount) || 0
    return getFees(amount, form.country)
  }, [form.amount, form.country])

  // ✅ Total à débiter
  const totalToDebit = useMemo(() => {
    const amount = Number(form.amount) || 0
    return amount + fees
  }, [form.amount, fees])

  // ✅ Rendu du solde
  const renderBalance = () => {
    const formattedBalance = formatPrice(balance)
    return (
      <div className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-primary)]/80 rounded-3xl p-5 sm:p-6 text-[var(--text-light)] mb-4 sm:mb-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[var(--text-light)]/70 text-xs sm:text-sm flex items-center gap-1">
              <Wallet size={14} /> Mon solde
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {formattedBalance} FCFA
            </h2>
          </div>
          <div className="text-3xl sm:text-4xl">💳</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white/10 rounded-xl px-3 py-2 text-xs font-mono truncate">
            {accountId || '**** **** ****'}
          </div>
          <div className="bg-white/10 rounded-xl px-2 py-1 flex items-center gap-2">
            <Avatar user={{ name: 'Moi' }} size={24} />
            <span className="text-xs">🇨🇲 Cameroun</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="ml-auto bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition disabled:opacity-50"
            aria-label="Rafraîchir"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    )
  }

  // ✅ Rendu des actions rapides
  const renderQuickActions = () => (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
      {[
        { icon: '📤', label: 'Envoyer', tab: 'send' },
        { icon: '📥', label: 'Recevoir', tab: 'receive' },
        { icon: '📋', label: 'Historique', tab: 'history' },
      ].map((action) => (
        <button 
          key={action.tab} 
          onClick={() => setTab(action.tab)}
          className={`
            bg-[var(--bg-card)] border rounded-2xl py-3 sm:py-4 
            flex flex-col items-center gap-1.5 transition
            ${tab === action.tab 
              ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' 
              : 'border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-secondary)]'
            }
          `}
        >
          <span className="text-xl sm:text-2xl">{action.icon}</span>
          <span className={`text-xs font-semibold ${tab === action.tab ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
            {action.label}
          </span>
        </button>
      ))}
    </div>
  )

  // ✅ Rendu du formulaire d'envoi
  const renderSendForm = () => {
    const amount = Number(form.amount) || 0
    const isDisabled = loading || success

    return (
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5">
        <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 text-sm sm:text-base">
          <Send size={18} className="text-[var(--accent-primary)]" /> Envoyer de l'argent
        </h3>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 flex items-center gap-2 animate-fade-in">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        
        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <p className="font-bold text-[var(--text-primary)]">Transfert réussi ! 🎉</p>
            <p className="text-sm text-[var(--text-secondary)]">L'argent a été envoyé avec succès.</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            {/* Pays */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                Pays destinataire
              </label>
              <select 
                value={form.country} 
                onChange={e => setForm({...form, country: e.target.value})}
                className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                disabled={isDisabled}
              >
                {COUNTRIES.map(country => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Téléphone */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                Numéro destinataire
              </label>
              <input 
                type="tel" 
                placeholder="6XX XXX XXX" 
                required
                value={form.phone} 
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] placeholder-[var(--text-secondary)]/50"
                disabled={isDisabled}
              />
            </div>
            
            {/* Montant */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                Montant (FCFA)
              </label>
              <input 
                type="number" 
                placeholder="Ex: 10000" 
                required 
                min="500"
                value={form.amount} 
                onChange={e => setForm({...form, amount: e.target.value})}
                className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] placeholder-[var(--text-secondary)]/50"
                disabled={isDisabled}
              />
              {amount > 0 && (
                <div className="mt-2 space-y-1 text-xs text-[var(--text-secondary)]">
                  <p>Frais : {formatPrice(fees)} FCFA ({Math.round((fees / (amount || 1)) * 100)}%)</p>
                  <p className="text-[var(--text-primary)] font-medium">
                    Total à débiter : {formatPrice(totalToDebit)} FCFA
                  </p>
                  {amount > balance && (
                    <p className="text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> Solde insuffisant
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Motif (optionnel) */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                Motif (optionnel)
              </label>
              <input 
                type="text" 
                placeholder="Ex: Achat de produits" 
                value={form.reason} 
                onChange={e => setForm({...form, reason: e.target.value})}
                className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] placeholder-[var(--text-secondary)]/50"
                disabled={isDisabled}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isDisabled || amount > balance || amount < 500}
              className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-[var(--text-light)] font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? (
                <><Loader size={16} className="animate-spin" /> Envoi en cours...</>
              ) : (
                <><Send size={16} /> Envoyer maintenant</>
              )}
            </button>
          </form>
        )}
      </div>
    )
  }

  // ✅ Rendu de la réception
  const renderReceive = () => (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 text-center">
      <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center justify-center gap-2 text-sm sm:text-base">
        <ArrowDownLeft size={18} className="text-[var(--accent-primary)]" /> Mon numéro de compte
      </h3>
      <div className="bg-[var(--accent-primary)]/10 rounded-2xl p-6 mb-4 border border-[var(--accent-primary)]/20">
        <p className="font-mono text-xl sm:text-2xl font-bold text-[var(--accent-primary)] mb-1">
          {accountId || 'AA-XXX-XXXX'}
        </p>
        <p className="text-xs text-[var(--text-secondary)]">Partagez ce code pour recevoir</p>
      </div>
      <p className="text-sm text-[var(--text-secondary)]">
        Toute personne peut envoyer de l'argent sur ce numéro depuis n'importe quel pays africain.
      </p>
      <div className="mt-4 flex justify-center gap-4 text-xs text-[var(--text-secondary)]">
        <span className="flex items-center gap-1"><Globe size={12} /> 8 pays</span>
        <span className="flex items-center gap-1"><Users size={12} /> Instantané</span>
      </div>
    </div>
  )

  // ✅ Rendu de l'historique
  const renderHistory = () => (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={18} className="text-[var(--accent-primary)]" />
          <h3 className="font-bold text-[var(--text-primary)] text-sm sm:text-base">
            Historique transactions
          </h3>
        </div>
        {transactions.length > 0 && (
          <span className="text-xs text-[var(--text-secondary)]">
            {transactions.length} transaction{transactions.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {transactions.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-3xl mb-2">📋</div>
          <p className="text-sm text-[var(--text-secondary)]">Aucune transaction pour le moment</p>
          <p className="text-xs text-[var(--text-secondary)]/60 mt-1">
            Vos transactions apparaîtront ici
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border-color)]">
          {transactions.map((t, index) => {
            const isReceived = t.type === 'reçu' || t.type === 'received'
            const isSent = t.type === 'envoyé' || t.type === 'sent'
            
            return (
              <div key={index} className="px-5 py-3 flex items-center gap-3 hover:bg-[var(--bg-secondary)] transition">
                <Avatar 
                  user={{ name: t.name, avatar: t.avatar }} 
                  size={36} 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {t.flag || '🌍'} {t.name || 'Inconnu'}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {t.date || new Date().toLocaleDateString('fr-FR')}
                    {t.reason && <span className="ml-2 text-[var(--text-secondary)]/60">· {t.reason}</span>}
                  </p>
                </div>
                <span className={`text-sm font-bold whitespace-nowrap ${isReceived ? 'text-emerald-600 dark:text-emerald-400' : isSent ? 'text-[var(--accent-secondary)]' : 'text-[var(--text-secondary)]'}`}>
                  {isReceived ? '+' : isSent ? '-' : ''}{t.amount?.toLocaleString() || '0'} FCFA
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <div className={`max-w-md mx-auto px-4 sm:px-5 py-6 sm:py-8 ${className}`}>
      {/* Retour */}
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-[var(--accent-primary)] font-semibold mb-5 sm:mb-6 hover:underline text-sm transition"
      >
        <ArrowLeft size={16} /> Retour au marché
      </button>

      {/* Contenu */}
      {renderBalance()}
      {renderQuickActions()}

      {/* Panneau actif */}
      {tab === 'send' && renderSendForm()}
      {tab === 'receive' && renderReceive()}
      {tab === 'history' && renderHistory()}
    </div>
  )
}

export default AgroAfricaPay