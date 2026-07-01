import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function GuideVendeur() {
  const navigate = useNavigate()
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-5 hover:underline text-sm">
        <ArrowLeft size={16} /> Retour
      </button>
      <div className="bg-gradient-to-r from-[#0C6B4E] to-[#18A070] rounded-3xl p-6 text-white mb-5">
        <h1 className="text-2xl font-extrabold mb-2">Guide vendeur</h1>
        <p className="text-white/70">Tout ce qu'il faut savoir pour vendre sur AgroAfrica.</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#DDE8E2] p-6 space-y-4">
        <p className="text-sm text-[#4A6355] leading-relaxed">
          Consultez notre guide complet pour configurer votre boutique, optimiser vos fiches produits,
          gérer les commandes et développer votre activité sur AgroAfrica.
        </p>
      </div>
    </div>
  )
}

export default GuideVendeur