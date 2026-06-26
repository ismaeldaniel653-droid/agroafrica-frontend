import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function DevenirVendeur() {
  const navigate = useNavigate()
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-5 hover:underline text-sm">
        <ArrowLeft size={16} /> Retour
      </button>
      <div className="bg-gradient-to-r from-[#0C6B4E] to-[#18A070] rounded-3xl p-6 text-white mb-5">
        <h1 className="text-2xl font-extrabold mb-2">Devenir vendeur</h1>
        <p className="text-white/70">Rejoignez la communauté AgroAfrica et vendez vos produits.</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#DDE8E2] p-6">
        <p className="text-sm text-[#4A6355] leading-relaxed">
          Créez votre boutique en ligne en quelques clics. Publiez vos produits, gérez vos commandes 
          et touchez des milliers d'acheteurs dans 28 pays africains. Inscrivez-vous dès maintenant !
        </p>
      </div>
    </div>
  )
}

export default DevenirVendeur