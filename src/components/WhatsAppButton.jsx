import { useCallback, useMemo } from 'react'
import { Phone, MessageCircle, ExternalLink, Check } from 'lucide-react'

// ✅ Configuration centralisée
const DEFAULT_WHATSAPP_NUMBER = '237699000000'
const WHATSAPP_URL = 'https://wa.me'

// ✅ Variantes de bouton
const VARIANTS = {
  primary: 'bg-[#25D366] hover:bg-[#1FB857] text-white',
  outline: 'border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white',
  minimal: 'bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20',
  dark: 'bg-[#1A8D4A] hover:bg-[#157A3F] text-white',
}

const SIZES = {
  sm: { padding: 'py-2 px-3', text: 'text-xs', icon: 14 },
  md: { padding: 'py-3 px-4', text: 'text-sm', icon: 16 },
  lg: { padding: 'py-4 px-6', text: 'text-base', icon: 20 },
}

function WhatsAppButton({ 
  product, 
  variant = 'primary',
  size = 'md',
  number = DEFAULT_WHATSAPP_NUMBER,
  message = null, // ✅ Message personnalisé
  showIcon = true,
  showLabel = true,
  label = 'Commander via WhatsApp',
  icon: IconComponent = Phone,
  className = '',
  onClick,
  onSuccess,
  disabled = false,
  fullWidth = true,
}) {
  // ✅ Validation du produit
  const isValid = useMemo(() => {
    if (!product) return false
    return product.name || product.id
  }, [product])

  // ✅ Construction du message
  const whatsappMessage = useMemo(() => {
    if (message) return message
    
    if (!product) return ''
    
    const productName = product.name || 'Produit'
    const price = product.price?.toLocaleString() || '—'
    const unit = product.unit || 'unité'
    const origin = product.origin || 'Non spécifiée'
    const seller = product.seller || 'le vendeur'
    const url = window.location.href || ''
    
    return encodeURIComponent(
      `Bonjour ! Je suis intéressé(e) par "${productName}" sur AgroAfrica.\n` +
      `Prix : ${price} FCFA par ${unit}\n` +
      `Origine : ${origin}\n` +
      `Vendeur : ${seller}\n` +
      `\nLien du produit : ${url}`
    )
  }, [product, message])

  // ✅ Construction de l'URL WhatsApp
  const whatsappUrl = useMemo(() => {
    if (!isValid || !whatsappMessage) return '#'
    
    // ✅ Nettoyer le numéro (garder uniquement les chiffres)
    const cleanNumber = number.replace(/\D/g, '')
    
    // ✅ S'assurer que le numéro a le bon format (sans +)
    const formattedNumber = cleanNumber.startsWith('0') 
      ? cleanNumber.slice(1) 
      : cleanNumber
    
    return `${WHATSAPP_URL}/${formattedNumber}?text=${whatsappMessage}`
  }, [number, whatsappMessage, isValid])

  // ✅ Gestionnaire de clic
  const handleClick = useCallback((e) => {
    if (disabled || !isValid) {
      e.preventDefault()
      return
    }
    
    if (onClick) {
      onClick(e)
    }
    
    if (onSuccess) {
      onSuccess(product)
    }
  }, [disabled, isValid, onClick, onSuccess, product])

  // ✅ Style du bouton
  const buttonStyles = useMemo(() => {
    const variantStyle = VARIANTS[variant] || VARIANTS.primary
    const sizeStyle = SIZES[size] || SIZES.md
    const widthStyle = fullWidth ? 'w-full' : ''
    
    return `${variantStyle} ${sizeStyle.padding} ${sizeStyle.text} ${widthStyle} 
            flex items-center justify-center gap-2 rounded-xl font-bold 
            transition-all duration-300 
            hover:scale-105 hover:shadow-lg hover:shadow-[#25D366]/30 
            active:scale-[0.98] 
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2
            ${className}`
  }, [variant, size, fullWidth, className])

  // ✅ Taille de l'icône
  const iconSize = SIZES[size]?.icon || 16

  // ✅ Si pas de produit valide, ne pas afficher
  if (!isValid) {
    return null
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={buttonStyles}
      aria-label={`Contacter ${product?.seller || 'le vendeur'} sur WhatsApp`}
      aria-disabled={disabled}
      title={`Contacter ${product?.seller || 'le vendeur'} sur WhatsApp`}
    >
      {showIcon && (
        <IconComponent size={iconSize} className="shrink-0" />
      )}
      
      {showLabel && (
        <span className="flex items-center gap-1">
          {label}
          {!disabled && (
            <ExternalLink size={iconSize * 0.6} className="opacity-70" />
          )}
        </span>
      )}
    </a>
  )
}

// ✅ Version simplifiée pour les pages produit
export const SimpleWhatsAppButton = ({ product, number, ...props }) => (
  <WhatsAppButton 
    product={product} 
    number={number}
    variant="primary"
    size="md"
    showIcon={true}
    showLabel={true}
    fullWidth={true}
    {...props}
  />
)

// ✅ Version avec icône MessageCircle
export const ChatWhatsAppButton = ({ product, number, ...props }) => (
  <WhatsAppButton 
    product={product} 
    number={number}
    variant="primary"
    size="md"
    icon={MessageCircle}
    label="Chatter sur WhatsApp"
    {...props}
  />
)

// ✅ Version minimaliste (pour les listes de produits)
export const MinimalWhatsAppButton = ({ product, number, ...props }) => (
  <WhatsAppButton 
    product={product} 
    number={number}
    variant="minimal"
    size="sm"
    icon={Phone}
    label="Contacter"
    showIcon={true}
    fullWidth={false}
    {...props}
  />
)

export default WhatsAppButton