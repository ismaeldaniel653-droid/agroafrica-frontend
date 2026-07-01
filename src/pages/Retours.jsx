import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Undo2 } from 'lucide-react'

function Retours() {
  const navigate = useNavigate()
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-5 hover:underline text-sm">
        <ArrowLeft size={16} /> Retour
      </button>
      <div className="bg-gradient-to-r from-[#0C6B4E] to-[#18A070] rounded-3xl p-6 text-white mb-5">
        <Undo2 size={32} className="mb-2" />
        <h1 className="text-2xl font-extrabold mb-2">Retours</h1>
        <p className="text-white/70">Politique de retour et remboursement.</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#DDE8E2] p-6 space-y-4">
        <p className="text-sm text-[#4A6355] leading-relaxed">
          Vous avez 14 jours après réception pour retourner un produit. Les produits doivent être 
          dans leur état d'origine. Contactez notre service client pour initier un retour.
        </p>
      </div>
    </div>
  )
}

export default Retours