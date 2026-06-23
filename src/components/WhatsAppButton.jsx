import { Phone } from 'lucide-react'

// ✅ NOUVEAU : Numéro centralisé (à remplacer via .env en production)
// import.meta.env.VITE_WHATSAPP_NUMBER || '237699000000'
const WHATSAPP_NUMBER = '237699000000'

function WhatsAppButton({ product }) {

  // ✅ NOUVEAU : Sécurité — Si pas de produit ou pas de nom, on n'affiche rien
  if (!product || !product.name) return null

  const message = encodeURIComponent(
    `Bonjour ! Je suis intéressé par "${product.name}" sur AgroAfrica.\n` +
    `Prix : ${product.price?.toLocaleString() || '—'} FCFA par ${product.unit || 'unité'}.\n` +
    `Origine : ${product.origin || 'Non spécifiée'}`
  )

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label={`Contacter ${product.seller || 'le vendeur'} sur WhatsApp`}
      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1FB857] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-green-500/30 active:scale-[0.98]"
    >
      {/* ✅ NOUVEAU : Icône Lucide au lieu de l'emoji pour cohérence visuelle */}
      <Phone size={16} />
      Commander via WhatsApp
    </a>
  )
}

export default WhatsAppButton
