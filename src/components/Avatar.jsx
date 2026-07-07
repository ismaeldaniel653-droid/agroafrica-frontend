import { useState, useCallback, useMemo } from 'react'
import { Camera, Loader2, User } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AvatarUpload from './AvatarUpload'

// Helper pour générer des initiales à partir du nom
const getInitials = (name = '') => {
  if (!name || name === 'Invité') return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    // Pour les noms simples, prendre les 2 premières lettres
    const first = parts[0]
    return first.length >= 2 ? first.slice(0, 2).toUpperCase() : first.toUpperCase()
  }
  // Prendre la première lettre du prénom et du nom
  const first = parts[0][0] || ''
  const last = parts[parts.length - 1][0] || ''
  return (first + last).toUpperCase()
}

// Fonction de hachage pour générer des couleurs cohérentes
const hashString = (str = '') => {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

// Palette de couleurs pour les avatars sans image
const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#FF9FF3', '#54A0FF',
  '#5F27CD', '#F368E0', '#01CBC6', '#FF6348',
  '#7BED9F', '#70A1FF', '#FF4757', '#2ED573',
]

const getColorForName = (name) => {
  const hash = hashString(name)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

// Taille des avatars
const SIZES = {
  xs: { box: 'w-7 h-7', text: 'text-[10px]', badge: 'w-1.5 h-1.5' },
  sm: { box: 'w-9 h-9', text: 'text-xs', badge: 'w-2 h-2' },
  md: { box: 'w-11 h-11', text: 'text-sm', badge: 'w-2.5 h-2.5' },
  lg: { box: 'w-16 h-16', text: 'text-lg', badge: 'w-3 h-3' },
  xl: { box: 'w-24 h-24', text: 'text-2xl', badge: 'w-3.5 h-3.5' },
}

function Avatar({
  user,
  size = 'md',
  online = false,
  clickable = true,
  withRing = false,
  onClick,
  className = '',
  editable = false,
  onUpload,
  fallbackIcon = false,
}) {
  const navigate = useNavigate()
  const userFromStore = useSelector(state => state.auth?.user) || null
  
  // Utiliser l'utilisateur fourni ou celui du store
  const u = user || userFromStore
  
  // États
  const [showUpload, setShowUpload] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  
  // Extraction des données utilisateur
  const avatarUrl = u?.avatarUrl || u?.avatar || u?.photoURL || null
  const userName = u?.name || u?.fullName || u?.displayName || u?.email?.split('@')[0] || 'Invité'
  const userEmail = u?.email || ''
  
  // Configuration de la taille
  const cfg = SIZES[size] || SIZES.md
  
  // Couleur cohérente pour l'avatar (mémorisée)
  const bgColor = useMemo(() => getColorForName(userName), [userName])
  
  // Calcul des initiales (mémorisé)
  const initials = useMemo(() => getInitials(userName), [userName])
  
  // Gestion du clic
  const handleClick = useCallback(() => {
    if (editable) {
      setShowUpload(true)
      return
    }
    if (onClick) {
      onClick()
    } else if (clickable) {
      navigate('/profile')
    }
  }, [editable, clickable, onClick, navigate])
  
  // Gestion de l'upload terminé
  const handleUploadComplete = useCallback((url) => {
    if (onUpload) onUpload(url)
    setShowUpload(false)
    // Réinitialiser l'état d'erreur pour le nouvel avatar
    setImgError(false)
    setImgLoaded(false)
  }, [onUpload])
  
  // Réinitialiser l'état d'erreur si l'URL change
  const resetImageState = useCallback(() => {
    setImgLoaded(false)
    setImgError(false)
  }, [])
  
  // Si l'URL change, réinitialiser les états d'image
  useState(() => {
    resetImageState()
  }, [avatarUrl, resetImageState])

  return (
    <>
      <div
        onClick={handleClick}
        className={`
          relative ${cfg.box} shrink-0 
          ${clickable ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''} 
          ${withRing ? 'ring-2 ring-offset-2 ring-[var(--accent-primary)] dark:ring-[var(--accent-secondary)]' : ''}
          ${className}
          group
        `}
        title={`${userName}${userEmail ? ` (${userEmail})` : ''}`}
        role={clickable ? 'button' : 'img'}
        aria-label={`Photo de profil de ${userName}`}
        tabIndex={clickable ? 0 : -1}
        onKeyDown={(e) => {
          if (clickable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        {/* Avatar avec image */}
        {avatarUrl && !imgError ? (
          <>
            {/* Squelette de chargement */}
            {!imgLoaded && (
              <div className={`
                absolute inset-0 rounded-full bg-[var(--bg-secondary)] 
                flex items-center justify-center animate-pulse
              `}>
                <Loader2 size={size === 'xs' ? 12 : size === 'sm' ? 14 : 20} 
                  className="text-[var(--text-secondary)] animate-spin" 
                />
              </div>
            )}
            
            {/* Image */}
            <img
              src={avatarUrl}
              alt={`Avatar de ${userName}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`
                ${cfg.box} rounded-full object-cover
                border-2 border-[var(--bg-card)] shadow-sm
                ${imgLoaded ? 'opacity-100' : 'opacity-0'}
                transition-all duration-300
              `}
              loading="lazy"
            />
          </>
        ) : (
          /* Avatar par défaut avec initiales ou icône */
          <div
            className={`
              ${cfg.box} rounded-full 
              font-bold ${cfg.text} flex items-center justify-center
              border-2 border-[var(--bg-card)] shadow-sm
              transition-all duration-200
              ${clickable ? 'group-hover:shadow-md' : ''}
            `}
            style={{
              backgroundColor: bgColor,
              color: '#FFFFFF',
              textShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
          >
            {fallbackIcon ? (
              <User size={parseInt(cfg.box.replace('w-', '')) * 0.5} className="opacity-80" />
            ) : (
              initials
            )}
          </div>
        )}

        {/* Pastille de statut en ligne */}
        {online && (
          <span className={`
            absolute bottom-0 right-0 rounded-full 
            bg-emerald-500 border-2 border-[var(--bg-card)]
            ${cfg.badge || 'w-2.5 h-2.5'}
            shadow-sm
          `} />
        )}

        {/* Pastille de modification (hover) */}
        {editable && (
          <div className="
            absolute inset-0 rounded-full 
            bg-black/0 group-hover:bg-black/30 
            flex items-center justify-center
            opacity-0 group-hover:opacity-100
            transition-all duration-200
          ">
            <Camera size={size === 'sm' ? 14 : size === 'xs' ? 12 : 18} 
              className="text-white drop-shadow-md" 
            />
          </div>
        )}

        {/* Bordure de focus pour accessibilité */}
        {clickable && (
          <div className="
            absolute -inset-1 rounded-full 
            ring-2 ring-[var(--accent-primary)] opacity-0 
            group-focus:opacity-100
            transition-opacity duration-200
          " />
        )}
      </div>

      {/* Modal d'upload (seulement en mode édition) */}
      {editable && (
        <AvatarUpload
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadComplete}
        />
      )}
    </>
  )
}

export default Avatar