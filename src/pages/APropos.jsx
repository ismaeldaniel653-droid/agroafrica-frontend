import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function APropos() {
  const navigate = useNavigate()
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-5 hover:underline text-sm">
        <ArrowLeft size={16} /> Retour
      </button>
      <div className="bg-gradient-to-r from-[#0C6B4E] to-[#18A070] rounded-3xl p-6 text-white mb-5">
        <h1 className="text-2xl font-extrabold mb-2">À propos d'AgroAfrica</h1>
        <p className="text-white/70">Le premier grand marché africain de produits agricoles et artisanaux.</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#DDE8E2] p-6">
        <p className="text-sm text-[#4A6355] leading-relaxed">
          AgroAfrica connecte directement les producteurs, agriculteurs et artisans africains aux acheteurs 
          du monde entier. Notre mission est de valoriser le savoir-faire local, garantir la transparence 
          des échanges et promouvoir le commerce équitable dans 28 pays africains.
        </p>
      </div>
    </div>
  )
}

export default APropos