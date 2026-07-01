import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Truck } from 'lucide-react'

function Livraison() {
  const navigate = useNavigate()
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-5 hover:underline text-sm">
        <ArrowLeft size={16} /> Retour
      </button>
      <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-3xl p-6 text-[#0D1F2D] mb-5">
        <Truck size={32} className="mb-2" />
        <h1 className="text-2xl font-extrabold mb-2">Livraison</h1>
        <p className="opacity-80">Informations sur la livraison dans 28 pays africains.</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#DDE8E2] p-6 space-y-4">
        <p className="text-sm text-[#4A6355] leading-relaxed">
          AgroAfrica livre dans 28 pays africains. Les frais de livraison varient selon le pays, 
          le poids et le mode de livraison choisi. La livraison est offerte à partir de 25 000 FCFA.
        </p>
      </div>
    </div>
  )
}

export default Livraison