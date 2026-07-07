import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

// ✅ Configuration des logos enrichie
const LOGOS = [
  { 
    id: 'default',
    bg: 'linear-gradient(135deg,#0C6B4E,#18A070)', 
    icon: '🌿', 
    font: 'Playfair Display, serif',
    textColor: '#FFFFFF',
    accentColor: '#F0A500',
    shadowColor: 'rgba(12,107,78,0.3)'
  },
  { 
    id: 'dark',
    bg: '#0D1F2D', 
    icon: '🌍', 
    font: 'Bebas Neue, sans-serif',
    textColor: '#FFFFFF',
    accentColor: '#F0A500',
    shadowColor: 'rgba(13,31,45,0.3)'
  },
  { 
    id: 'light',
    bg: '#FFFFFF', 
    icon: '🌿', 
    font: 'Yeseva One, serif',
    textColor: '#0D1F2D',
    accentColor: '#0C6B4E',
    shadowColor: 'rgba(0,0,0,0.1)',
    border: '1px solid #DDE8E2'
  },
  { 
    id: 'dark-green',
    bg: '#0C1A10', 
    icon: '🌾', 
    font: 'Abril Fatface, serif',
    textColor: '#FFFFFF',
    accentColor: '#F0A500',
    shadowColor: 'rgba(12,26,16,0.3)'
  },
  { 
    id: 'gold',
    bg: '#F0A500', 
    icon: '🏺', 
    font: 'Righteous, sans-serif',
    textColor: '#0D1F2D',
    accentColor: '#063D2A',
    shadowColor: 'rgba(240,165,0,0.3)'
  },
]

function Logo({ 
  size = 'normal', 
  variant = 'default',  // ✅ NOUVEAU : sélectionne un style spécifique
  showIcon = true,      // ✅ NOUVEAU : afficher ou non l'icône
  clickable = true,     // ✅ NOUVEAU : cliquable ou non
  onCustomClick,        // ✅ NOUVEAU : gestionnaire de clic personnalisé
  className = '',       // ✅ NOUVEAU : classes CSS additionnelles
  animated = true,      // ✅ NOUVEAU : animation au hover
  textOnly = false,     // ✅ NOUVEAU : seulement le texte, sans icône
  compact = false,      // ✅ NOUVEAU : version compacte (pour mobile)
}) {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // ✅ Détection de la réduction de mouvement
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // ✅ Trouver le logo par variant ou utiliser l'index
  const logo = useMemo(() => {
    if (variant) {
      const found = LOGOS.find(l => l.id === variant)
      if (found) return found
    }
    return LOGOS[current] || LOGOS[0]
  }, [variant, current])

  // ✅ Taille du logo
  const sizes = useMemo(() => ({
    small: { box: '32px', iconSize: '1rem', textSize: '1.1rem', gap: '6px' },
    normal: { box: '40px', iconSize: '1.3rem', textSize: '1.5rem', gap: '8px' },
    large: { box: '56px', iconSize: '1.8rem', textSize: '2rem', gap: '10px' },
    xl: { box: '72px', iconSize: '2.2rem', textSize: '2.5rem', gap: '12px' },
  }), [])

  const currentSize = sizes[size] || sizes.normal

  // ✅ Gestion du clic
  const handleClick = useCallback(() => {
    if (!clickable) return
    if (onCustomClick) {
      onCustomClick()
    } else {
      navigate('/')
    }
  }, [clickable, onCustomClick, navigate])

  // ✅ Changement de logo (si variant n'est pas spécifié)
  const changeLogo = useCallback(() => {
    if (reducedMotion) return
    setFading(true)
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % LOGOS.length)
      setFading(false)
    }, 200)
  }, [reducedMotion])

  // ✅ Style du conteneur principal
  const containerStyle = {
    opacity: fading ? 0.7 : 1,
    transition: reducedMotion ? 'opacity 0.2s' : 'opacity 0.4s ease, transform 0.4s ease',
    transform: fading && !reducedMotion ? 'scale(0.95)' : 'scale(1)',
    cursor: clickable ? 'pointer' : 'default',
    gap: currentSize.gap,
  }

  // ✅ Style de l'icône
  const iconStyle = {
    width: currentSize.box,
    height: currentSize.box,
    borderRadius: compact ? '8px' : '10px',
    background: logo.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: currentSize.iconSize,
    flexShrink: 0,
    boxShadow: `0 4px 12px ${logo.shadowColor || 'rgba(0,0,0,0.2)'}`,
    border: logo.border || 'none',
    transition: 'transform 0.3s ease',
  }

  // ✅ Style du texte
  const textStyle = {
    fontFamily: logo.font,
    fontSize: currentSize.textSize,
    fontWeight: '800',
    color: logo.textColor || '#FFFFFF',
    lineHeight: 1,
    letterSpacing: '-0.5px',
  }

  return (
    <div 
      className={`flex items-center select-none ${className} ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}`}
      style={containerStyle}
      onClick={handleClick}
      role={clickable ? 'button' : 'img'}
      aria-label="Retour à l'accueil AgroAfrica"
      tabIndex={clickable ? 0 : -1}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleClick()
        }
      }}
      // ✅ NOUVEAU : changement de logo au double-clic
      onDoubleClick={variant ? undefined : changeLogo}
      title={variant ? `Logo ${variant}` : 'Double-cliquez pour changer le style'}
    >
      {/* Icône */}
      {showIcon && !textOnly && (
        <div style={iconStyle} className="icon-container">
          {logo.icon}
        </div>
      )}

      {/* Texte */}
      <div style={textStyle}>
        Agro
        <span style={{ color: logo.accentColor || '#F0A500' }}>
          Africa
        </span>
        {/* ✅ NOUVEAU : indicateur de version */}
        {compact && (
          <span style={{ 
            fontSize: '0.5rem', 
            fontWeight: '400',
            opacity: 0.6,
            marginLeft: '2px',
            verticalAlign: 'super'
          }}>
            ®
          </span>
        )}
      </div>
    </div>
  )
}

export default Logo