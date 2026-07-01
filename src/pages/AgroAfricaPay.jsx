import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, ArrowDownLeft, History } from 'lucide-react'
import { getWallet, getTransactions, sendMoney } from '../api/walletApi'
import Avatar from '../components/Avatar' // ✅ NOUVEAU

// ✅ NOUVEAU : tableau vide — vient de l'API
const TRANSACTIONS = []

function AgroAfricaPay() {
  const navigate  = useNavigate()
  const [tab,         setTab]         = useState('send')
  const [loading,     setLoading]     = useState(false)
  const [success,     setSuccess]     = useState(false)
  const [balance,     setBalance]     = useState(0)       // ✅ NOUVEAU : solde à 0
  const [accountId,   setAccountId]   = useState(null)   // ✅ NOUVEAU : ID dynamique
  const [transactions,setTransactions]= useState([])
  const [form,        setForm]        = useState({ phone: '', amount: '', country: 'Cameroun' })

  // ✅ NOUVEAU : chargement solde + historique depuis l'API
  useEffect(() => {
    const load = async () => {
      try {
        const w = await getWallet()
        setBalance(w.balance ?? 0)
        setAccountId(w.accountId ?? null)
      } catch { setBalance(0) }
      try {
        const t = await getTransactions()
        setTransactions(Array.isArray(t) ? t : t?.transactions || [])
      } catch { setTransactions([]) }
    }
    load()
  }, [])

  async function handleSend(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await sendMoney({ phone: form.phone, amount: Number(form.amount), country: form.country })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      setForm({ phone: '', amount: '', country: 'Cameroun' })
      // Refresh balance
      const w = await getWallet()
      setBalance(w.balance ?? 0)
    } catch (err) {
      console.warn('Échec envoi', err)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-5 py-6 sm:py-8">

      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-5 sm:mb-6 hover:underline text-sm">
        <ArrowLeft size={16} /> Retour
      </button>

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#0C6B4E] to-[#18A070] rounded-3xl p-5 sm:p-6 text-white mb-4 sm:mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-xs sm:text-sm">Mon solde</p>
            {/* ✅ NOUVEAU : solde à 0 par défaut */}
            <h2 className="text-2xl sm:text-3xl font-extrabold">{balance.toLocaleString()} FCFA</h2>
          </div>
          <div className="text-3xl sm:text-4xl">💳</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="bg-white/10 rounded-xl px-3 py-2 text-xs font-mono truncate">
            {accountId || '**** **** ****'}
          </div>
          {/* ✅ NOUVEAU : avatar du titulaire */}
          <div className="bg-white/10 rounded-xl px-2 py-1 flex items-center gap-2">
            <Avatar user={{ name: 'Moi' }} size={24} />
            <span className="text-xs">🇨🇲 Cameroun</span>
          </div>
        </div>
      </div>

      {/* ACTIONS RAPIDES */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
        {[
          { icon:'📤', label:'Envoyer',   action: () => setTab('send')    },
          { icon:'📥', label:'Recevoir',  action: () => setTab('receive') },
          { icon:'📋', label:'Historique',action: () => setTab('history') },
        ].map((a, i) => (
          <button key={i} onClick={a.action}
            className="bg-white border border-[#DDE8E2] rounded-2xl py-3 sm:py-4 flex flex-col items-center gap-1.5 hover:border-[#0C6B4E] hover:bg-[#E8F7F1] transition">
            <span className="text-xl sm:text-2xl">{a.icon}</span>
            <span className="text-xs font-semibold text-[#1A2E25]">{a.label}</span>
          </button>
        ))}
      </div>

      {/* ENVOYER */}
      {tab === 'send' && (
        <div className="bg-white rounded-2xl border border-[#DDE8E2] p-5">
          <h3 className="font-bold text-[#1A2E25] mb-4 flex items-center gap-2 text-sm sm:text-base">
            <Send size={18} className="text-[#0C6B4E]" /> Envoyer de l'argent
          </h3>
          {success ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-bold text-[#0C6B4E]">Transfert réussi !</p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Pays destinataire</label>
                <select value={form.country} onChange={e => setForm({...form, country: e.target.value})}
                  className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none bg-white">
                  {['Cameroun 🇨🇲','Sénégal 🇸🇳','Nigeria 🇳🇬','Ghana 🇬🇭','Côte d\'Ivoire 🇨🇮','Kenya 🇰🇪'].map((c,i) => (
                    <option key={i}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Numéro destinataire</label>
                <input type="tel" placeholder="6XX XXX XXX" required
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4A6355] mb-1 block">Montant (FCFA)</label>
                <input type="number" placeholder="Ex: 10000" required min="500"
                  value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                  className="w-full border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E]" />
                {form.amount && (
                  <p className="text-xs text-[#8AADA0] mt-1">
                    Frais : {Math.round(Number(form.amount) * 0.01).toLocaleString()} FCFA (1%)
                  </p>
                )}
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#0C6B4E] hover:bg-[#18A070] text-white font-bold py-3 rounded-xl transition disabled:opacity-70">
                {loading ? '⏳ Envoi...' : '📤 Envoyer maintenant'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* RECEVOIR */}
      {tab === 'receive' && (
        <div className="bg-white rounded-2xl border border-[#DDE8E2] p-5 text-center">
          <h3 className="font-bold text-[#1A2E25] mb-4 flex items-center justify-center gap-2 text-sm sm:text-base">
            <ArrowDownLeft size={18} className="text-[#0C6B4E]" /> Mon numéro de compte
          </h3>
          <div className="bg-[#E8F7F1] rounded-2xl p-6 mb-4">
            {/* ✅ NOUVEAU : ID dynamique ou masqué */}
            <p className="font-mono text-xl sm:text-2xl font-bold text-[#0C6B4E] mb-1">
              {accountId || 'AA-XXX-XXXX'}
            </p>
            <p className="text-xs text-[#8AADA0]">Partagez ce code pour recevoir</p>
          </div>
          <p className="text-sm text-[#4A6355]">
            Toute personne peut envoyer de l'argent sur ce numéro depuis n'importe quel pays africain.
          </p>
        </div>
      )}

      {/* HISTORIQUE */}
      {tab === 'history' && (
        <div className="bg-white rounded-2xl border border-[#DDE8E2] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#DDE8E2] flex items-center gap-2">
            <History size={18} className="text-[#0C6B4E]" />
            <h3 className="font-bold text-[#1A2E25] text-sm sm:text-base">Historique transactions</h3>
          </div>
          {/* ✅ NOUVEAU : état vide */}
          {transactions.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-sm text-[#8AADA0]">Aucune transaction pour le moment</p>
            </div>
          ) : (
            <div className="divide-y divide-[#DDE8E2]">
              {transactions.map((t, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3">
                  <Avatar user={{ name: t.name, avatar: t.avatar }} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A2E25] truncate">
                      {t.flag || ''} {t.name}
                    </p>
                    <p className="text-xs text-[#8AADA0]">{t.date}</p>
                  </div>
                  <span className={`text-sm font-bold whitespace-nowrap ${t.type === 'reçu' ? 'text-green-600' : 'text-[#D95030]'}`}>
                    {t.amount} FCFA
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default AgroAfricaPay
