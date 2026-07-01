import { useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AvatarUpload from './AvatarUpload'

// Helper pour générer des initiales à partir du nom
const getInitials = (name = '') => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function Avatar({
  user,
  size = 'md',
  online = false,
  clickable = true,
  withRing = false,
  onClick,
  className = '',
  editable = false,    // mode édition avec upload
  onUpload,            // callback après upload
}) {
  const navigate = useNavigate()
  const userFromStore = useSelector(state => state.auth?.user) || null
  const u = user || userFromStore

  const [showUpload, setShowUpload] = useState(false)
  const avatarUrl = u?.avatarUrl || u?.avatar || null
  const userName  = u?.name || u?.fullName || u?.email?.split('@')[0] || '?'

  const SIZES = {
    xs: { box: 'w-7 h-7',  text: 'text-[10px]' },
    sm: { box: 'w-9 h-9',  text: 'text-xs'     },
    md: { box: 'w-11 h-11', text: 'text-sm'    },
    lg: { box: 'w-16 h-16', text: 'text-lg'    },
    xl: { box: 'w-24 h-24', text: 'text-2xl'   },
  }
  const cfg = SIZES[size] || SIZES.md

  const handleClick = () => {
    if (editable) {
      setShowUpload(true)
      return
    }
    if (onClick) onClick()
    else if (clickable) navigate('/profile')
  }

  const handleUploadComplete = (url) => {
    if (onUpload) onUpload(url)
    setShowUpload(false)
  }

  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError,  setImgError]  = useState(false)

  return (
    <>
      <div
        onClick={handleClick}
        className={`relative ${cfg.box} shrink-0 ${clickable ? 'cursor-pointer' : ''} ${className}`}
        title={userName}
        role={clickable ? 'button' : undefined}
        aria-label={clickable ? `Photo de profil de ${userName}` : undefined}
      >
        {avatarUrl && !imgError ? (
          <>
            {!imgLoaded && (
              <div className={`absolute inset-0 rounded-full bg-gray-100 flex items-center justify-center animate-pulse`}>
                <Loader2 size={16} className="text-gray-400 animate-spin" />
              </div>
            )}
            <img
              src={avatarUrl}
              alt={userName}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`${cfg.box} rounded-full object-cover transition-all
                ${clickable ? 'hover:scale-105' : ''}
                ${withRing ? 'ring-2 ring-amber-400 ring-offset-2' : 'border-2 border-white/40'}
                ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </>
        ) : (
          <div
            className={`${cfg.box} rounded-full bg-amber-400 text-[#0D1F2D]
              font-bold ${cfg.text} flex items-center justify-center
              border-2 border-white/40 transition-all
              ${clickable ? 'hover:scale-105' : ''}
              ${withRing ? 'ring-2 ring-amber-400 ring-offset-2' : ''}
              ${!avatarUrl ? 'avatar-gradient' : ''}`}
            style={!avatarUrl ? {
              background: `linear-gradient(135deg,
                hsl(${hashString(userName) % 360}, 70%, 55%),
                hsl(${(hashString(userName) + 60) % 360}, 70%, 45%))`,
              color: 'white'
            } : {}}
          >
            {getInitials(userName)}
          </div>
        )}

        {/* Pastille en ligne */}
        {online && (
          <span className={`absolute bottom-0 right-0 rounded-full bg-emerald-400 border-2 border-white
            ${size === 'xs' ? 'w-2 h-2' : size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
        )}

        {/* Icône caméra pour upload */}
        {editable && (
          <div className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/30 transition-all
            flex items-center justify-center opacity-0 hover:opacity-100">
            <Camera size={size === 'sm' ? 12 : 16} className="text-white" />
          </div>
        )}
      </div>

      {/* Modal d'upload */}
      <AvatarUpload
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={handleUploadComplete}
      />
    </>
  )
}

function hashString(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export default Avatar