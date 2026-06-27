import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LOGOS = [
  { bg: 'linear-gradient(135deg,#0C6B4E,#18A070)', icon: '🌿', font: 'Playfair Display, serif' },
  { bg: '#0D1F2D',                          icon: '🌍', font: 'Bebas Neue, sans-serif'    },
  { bg: 'white',                            icon: '🌿', font: 'Yeseva One, serif'         },
  { bg: '#0C1A10',                          icon: '🌾', font: 'Abril Fatface, serif'      },
  { bg: '#F0A500',                          icon: '🏺', font: 'Righteous, sans-serif'     },
]

function Logo({ size = 'normal' }) {
  const navigate  = useNavigate()
  const [current, setCurrent] = useState(0)
  const [fading,  setFading]  = useState(false)
  // ✅ NOUVEAU : respect prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // ✅ SUPPRIMÉ : logo fixe — pas de changement automatique

  const logo     = LOGOS[current]
  const isSmall  = size === 'small'

  return (
    <div onClick={() => navigate('/')}
         className="cursor-pointer flex items-center gap-2 select-none"
         style={{
           opacity:    fading ? 0.7 : 1,
           transition: reducedMotion ? 'opacity 0.2s' : 'opacity 0.4s ease, transform 0.4s ease',
           transform:  fading && !reducedMotion ? 'scale(0.95)' : 'scale(1)',
         }}
         role="button" aria-label="Retour à l'accueil AgroAfrica">

      <div style={{
             width:        isSmall ? '32px' : '40px',
             height:       isSmall ? '32px' : '40px',
             borderRadius: '10px',
             background:   logo.bg,
             display:      'flex', alignItems: 'center', justifyContent: 'center',
             fontSize:     isSmall ? '1rem' : '1.3rem',
             flexShrink:   0,
             boxShadow:    '0 4px 12px rgba(0,0,0,0.2)',
             border:       logo.bg === 'white' ? '1px solid #DDE8E2' : 'none',
           }}>
        {logo.icon}
      </div>

      <div style={{
             fontFamily:    logo.font,
             fontSize:      isSmall ? '1.1rem' : '1.5rem',
             fontWeight:    '800',
             color:         'white',
             lineHeight:    1,
             letterSpacing: '-0.5px',
           }}>
        Agro<span style={{ color: '#F0A500' }}>Africa</span>
      </div>
    </div>
  )
}

export default Logo
