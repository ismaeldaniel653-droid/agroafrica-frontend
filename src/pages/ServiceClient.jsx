import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Headphones } from 'lucide-react'

function ServiceClient() {
  const navigate = useNavigate()
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#0C6B4E] font-semibold mb-5 hover:underline text-sm">
        <ArrowLeft size={16} /> Retour
      </button>
      <div className="bg-gradient-to-r from-[#0C6B4E] to-[#18A070] rounded-3xl p-6 text-white mb-5">
        <Headphones size={32} className="mb-2" />
        <h1 className="text-2xl font-extrabold mb-2">Service client</h1>
        <p className="text-white/70">Nous sommes là pour vous aider.</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#DDE8E2] p-6 space-y-4">
        <p className="text-sm text-[#4A6355] leading-relaxed">
          Contactez notre service client par WhatsApp, email ou téléphone. Nous répondons sous 24h.
        </p>
      </div>
    </div>
  )
}

export default ServiceClient