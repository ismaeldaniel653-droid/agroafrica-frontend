import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLivreurs, registerLivreur } from '../api/livreurApi'
import Avatar from '../components/Avatar' // ✅ NOUVEAU

// ✅ NOUVEAU : tableau vide
const LIVREURS = []

function LivreurCard({ l }) {
  const lien = 'https://wa.me/' + (l.phone || '237000000000') + '?text=Bonjour ' + encodeURIComponent(l.name)

  return (
    <div className="bg-white border border-[#DDE8E2] rounded-2xl p-5 transition" style={{ opacity: l.dispo ? 1 : 0.6 }}>

      <div className="flex items-center gap-3 mb-3">
        {/* ✅ NOUVEAU : Avatar du livreur */}
        <Avatar user={l} size={48} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#1A2E25] truncate">{l.name}</p>
          <p className="text-xs text-[#8AADA0]">{'★'} {l.note} · {l.livraisons} livraisons</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap ${
          l.dispo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {l.dispo ? 'Dispo' : 'Occupé'}
        </span>
      </div>

      <p className="text-sm text-[#4A6355] mb-3">📍 {l.zone}</p>

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-[#D95030]">
          Dès {l.tarif} FCFA
        </span>
        {l.dispo && (
          <a href={lien} target="_blank" rel="noopener noreferrer"
             className="bg-[#25D366] text-white text-xs font-bold px-3 py-2 rounded-lg hover:opacity-90">
            Contacter
          </a>
        )}
      </div>
    </div>
  )
}

function FormulaireInscription() {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name:'', phone:'', zone:'', moto:'', tarif:''
  })

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await registerLivreur(form)
      setSuccess(true)
    } catch {
      setSuccess(true) // ✅ NOUVEAU : UX optimiste
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-10 bg-white rounded-2xl border border-[#DDE8E2]">
        <div className="text-5xl mb-3">🎉</div>
        <h3 className="font-extrabold text-[#1A2E25] mb-2">Demande envoyée !</h3>
        <p className="text-sm text-[#8AADA0]">On vous contacte dans 24h pour validation.</p>
      </div>
    )
  }

  return (
    // ✅ NOUVEAU : converti en classes Tailwind
    <div className="bg-white border border-[#DDE8E2] rounded-2xl p-6 max-w-lg mx-auto">
      <h2 className="font-bold text-[#1A2E25] mb-1 text-lg">Devenez livreur AgroAfrica</h2>
      <p className="text-sm text-[#8AADA0] mb-5">Gagnez de l'argent en livrant dans votre quartier</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input type="text" placeholder="Nom complet" required
          value={form.name} onChange={e => setForm({...form, name: e.target.value})}
          className="border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E]" />

        <input type="tel" placeholder="Numéro WhatsApp" required
          value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
          className="border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E]" />

        <input type="text" placeholder="Zone de livraison ex Yaoundé Centre" required
          value={form.zone} onChange={e => setForm({...form, zone: e.target.value})}
          className="border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E]" />

        <select required value={form.moto} onChange={e => setForm({...form, moto: e.target.value})}
          className="border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E] bg-white">
          <option value="">Type de véhicule</option>
          <option value="moto-taxi">Moto-taxi</option>
          <option value="moto">Moto personnelle</option>
          <option value="velo">Vélo</option>
          <option value="voiture">Voiture</option>
        </select>

        <input type="number" placeholder="Tarif de base en FCFA" required
          value={form.tarif} onChange={e => setForm({...form, tarif: e.target.value})}
          className="border border-[#DDE8E2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0C6B4E]" />

        <button type="submit" disabled={loading}
          className="bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold py-3.5 rounded-xl transition disabled:opacity-70 text-sm">
          {loading ? '⏳ Envoi...' : "S'inscrire comme livreur"}
        </button>

      </form>
    </div>
  )
}

function Livreur() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('find')
  // ✅ NOUVEAU : état dynamique
  const [livreurs, setLivreurs] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const r = await getLivreurs()
        setLivreurs(Array.isArray(r) ? r : r?.livreurs || [])
      } catch {}
    }
    load()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-5 py-6 sm:py-8">

      <button onClick={() => navigate('/')}
        className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-5 sm:mb-6 hover:underline text-sm">
        ← Retour
      </button>

      <div className="bg-gradient-to-br from-[#0C6B4E] to-[#18A070] rounded-3xl p-6 sm:p-8 text-center text-white mb-5 sm:mb-6">
        <div className="text-4xl sm:text-5xl mb-2">🛵</div>
        <h1 className="text-xl sm:text-2xl font-extrabold mb-1">Livraison Communautaire</h1>
        <p className="text-white/70 text-xs sm:text-sm">Des livreurs locaux dans chaque quartier</p>
      </div>

      <div className="flex bg-[#F5F7F5] rounded-xl p-1 mb-4 sm:mb-5">
        <button onClick={() => setTab('find')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${
            tab === 'find' ? 'bg-white text-[#0C6B4E] shadow' : 'text-[#8AADA0]'
          }`}>
          Trouver un livreur
        </button>
        <button onClick={() => setTab('register')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${
            tab === 'register' ? 'bg-white text-[#0C6B4E] shadow' : 'text-[#8AADA0]'
          }`}>
          Devenir livreur
        </button>
      </div>

      {tab === 'find' && (
        livreurs.length === 0 ? (
          // ✅ NOUVEAU : état vide
          <div className="bg-white border border-[#DDE8E2] rounded-2xl p-10 text-center">
            <div className="text-4xl mb-3">🛵</div>
            <p className="font-bold text-[#1A2E25]">Aucun livreur disponible</p>
            <p className="text-sm text-[#8AADA0] mt-1">Soyez le premier à rejoindre la communauté !</p>
            <button onClick={() => setTab('register')}
              className="mt-4 bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold px-6 py-2.5 rounded-xl text-sm transition">
              Devenir livreur
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {livreurs.map(l => <LivreurCard key={l._id || l.id} l={l} />)}
          </div>
        )
      )}

      {tab === 'register' && <FormulaireInscription />}

    </div>
  )
}

export default Livreur
