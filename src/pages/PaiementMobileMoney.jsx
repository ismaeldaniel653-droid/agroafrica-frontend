import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, ShieldCheck, Smartphone } from 'lucide-react'

function PaiementMobileMoney() {
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-5 sm:mb-6 hover:underline text-sm"
      >
        <ArrowLeft size={16} /> Retour
      </button>

      <div className="bg-gradient-to-r from-[#0D1F2D] to-[#1A3A52] rounded-3xl p-5 sm:p-6 text-white mb-5">
        <div className="text-3xl sm:text-4xl mb-2">📱</div>
        <h1 className="text-xl sm:text-2xl font-extrabold mb-1">Paiement Mobile Money</h1>
        <p className="text-white/70 text-xs sm:text-sm">
          Instructions pour payer avec MTN MoMo, Orange Money ou Wave.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-[#DDE8E2] p-4 sm:p-5">
          <h2 className="font-bold text-[#1A2E25] mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Smartphone size={18} className="text-[#0C6B4E]" /> Étapes
          </h2>
          <ul className="space-y-2 text-sm text-[#4A6355]">
            <li>1) Allez sur <span className="font-semibold">Checkout</span> après avoir ajouté vos produits au panier.</li>
            <li>2) Choisissez votre service (MTN MoMo / Orange Money / Wave).</li>
            <li>3) Renseignez votre numéro de téléphone.</li>
            <li>4) Validez la transaction sur votre téléphone (demande de confirmation).</li>
            <li>5) Suivez le statut via la page <span className="font-semibold">Suivi du paiement</span>.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-[#DDE8E2] p-4 sm:p-5">
          <h2 className="font-bold text-[#1A2E25] mb-3 flex items-center gap-2 text-sm sm:text-base">
            <ShieldCheck size={18} className="text-[#0C6B4E]" /> Bonnes pratiques
          </h2>
          <ul className="space-y-2 text-sm text-[#4A6355]">
            <li>Utilisez un numéro actif et à votre nom.</li>
            <li>Vérifiez le montant avant validation.</li>
            <li>En cas d’échec, réessayez depuis Checkout.</li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
          <h2 className="font-bold text-amber-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
            <Phone size={18} className="text-amber-700" /> Besoin d’aide ?
          </h2>
          <p className="text-sm text-amber-900/80">
            Pour assistance, contactez notre service client (WhatsApp) ou passez par la section Aide.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaiementMobileMoney

