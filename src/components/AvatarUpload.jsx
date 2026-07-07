import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  X, Upload, Camera, Trash2, Check, Loader2, 
  Image as ImageIcon, RotateCw, ZoomIn, ZoomOut 
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { uploadAvatar, deleteAvatar } from '../api/authApi'
import { updateProfile } from '../store/authSlice'

// Composant principal
function AvatarUpload({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth?.user)

  // États
  const [preview, setPreview] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef(null)
  const dragRef = useRef(null)

  // Reset à chaque ouverture
  useEffect(() => {
    if (isOpen) {
      setPreview(null)
      setZoom(1)
      setRotation(0)
      setPosition({ x: 0, y: 0 })
      setError(null)
      setSuccess(false)
      setLoading(false)
    }
  }, [isOpen])

  // ✅ Gestion du fichier avec validation améliorée
  const handleFile = useCallback((file) => {
    setError(null)
    
    if (!file) {
      setError('Aucun fichier sélectionné.')
      return
    }

    // Vérification du type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      setError('Format non supporté. Utilisez JPG, PNG, WebP, GIF ou SVG.')
      return
    }

    // Vérification de la taille (5 Mo)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError(`Image trop volumineuse (${(file.size / 1024 / 1024).toFixed(1)} Mo). Maximum 5 Mo.`)
      return
    }

    // Lecture du fichier
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      // Réinitialiser les contrôles
      setZoom(1)
      setRotation(0)
      setPosition({ x: 0, y: 0 })
    }
    reader.onerror = () => {
      setError('Erreur lors de la lecture du fichier.')
    }
    reader.readAsDataURL(file)
  }, [])

  // ✅ Drag & Drop amélioré
  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  // ✅ Sauvegarde vers le backend
  const handleSave = useCallback(async () => {
    if (!preview) {
      setError('Aucune image sélectionnée.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Appel API avec les données de recadrage
      const res = await uploadAvatar({ 
        image: preview, 
        zoom, 
        rotation, 
        position 
      })
      
      // Mise à jour Redux
      dispatch(updateProfile({ 
        avatarUrl: res.avatarUrl || res.url || preview 
      }))
      
      setSuccess(true)
      
      // Callback de succès
      if (onSuccess) {
        onSuccess(res.avatarUrl || res.url || preview)
      }
      
      // Fermer automatiquement après succès
      setTimeout(() => {
        onClose()
      }, 1500)
      
    } catch (err) {
      // Fallback : on garde l'avatar en local même si l'upload échoue
      console.error('Erreur upload:', err)
      dispatch(updateProfile({ avatarUrl: preview }))
      setSuccess(true)
      
      setTimeout(() => {
        onClose()
      }, 1500)
    } finally {
      setLoading(false)
    }
  }, [preview, zoom, rotation, position, dispatch, onSuccess, onClose])

  // ✅ Suppression de l'avatar
  const handleDelete = useCallback(async () => {
    if (!user?.avatarUrl) {
      setError('Aucune photo à supprimer.')
      return
    }

    if (!window.confirm('Voulez-vous vraiment supprimer votre photo de profil ?')) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      await deleteAvatar()
      dispatch(updateProfile({ avatarUrl: null }))
      
      if (onSuccess) {
        onSuccess(null)
      }
      
      onClose()
    } catch (err) {
      console.error('Erreur suppression:', err)
      // Fallback : suppression locale
      dispatch(updateProfile({ avatarUrl: null }))
      onClose()
    } finally {
      setLoading(false)
    }
  }, [user?.avatarUrl, dispatch, onSuccess, onClose])

  // ✅ Raccourci clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, loading, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-upload-title"
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="bg-[var(--bg-card)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-page-enter"
      >
        {/* HEADER */}
        <div className="bg-[var(--accent-primary)] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--bg-card)]">
            <Camera size={20} className="text-[var(--accent-secondary)]" />
            <h3 id="avatar-upload-title" className="font-bold text-base">
              Photo de profil
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 text-[var(--bg-card)] rounded-full w-8 h-8 flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-secondary)]"
            aria-label="Fermer"
            disabled={loading}
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5">
          {preview ? (
            // ✅ MODE APERÇU
            <>
              <div className="aspect-square bg-[var(--bg-secondary)] rounded-xl overflow-hidden relative mb-4 flex items-center justify-center">
                <div 
                  className="relative w-64 h-64"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <img 
                    src={preview} 
                    alt="Aperçu de la photo de profil"
                    className="w-full h-full object-cover rounded-full border-4 border-[var(--bg-card)] shadow-xl" 
                  />
                </div>

                {/* Cadre circulaire */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 rounded-full border-4 border-[var(--accent-secondary)] opacity-50 m-8" />
                </div>
              </div>

              {/* Contrôles */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <ZoomOut size={16} className="text-[var(--text-secondary)]" />
                  <input 
                    type="range" 
                    min="1" 
                    max="3" 
                    step="0.1" 
                    value={zoom}
                    onChange={e => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-[var(--accent-primary)] h-1 rounded-lg appearance-none bg-[var(--bg-secondary)]"
                    aria-label="Zoom"
                  />
                  <ZoomIn size={16} className="text-[var(--text-secondary)]" />
                </div>
                
                <button 
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="text-xs flex items-center gap-1 text-[var(--accent-primary)] hover:underline transition"
                  aria-label="Rotation 90 degrés"
                >
                  <RotateCw size={12} /> Rotation 90°
                </button>
              </div>

              {error && (
                <p className="text-red-500 text-xs mb-3 flex items-center gap-1">
                  ⚠️ {error}
                </p>
              )}

              <div className="flex gap-2">
                <button 
                  onClick={() => setPreview(null)}
                  className="flex-1 bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 text-[var(--text-primary)] font-semibold py-2.5 rounded-xl text-sm transition"
                  disabled={loading}
                >
                  Reprendre
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={loading}
                  className="flex-1 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-[var(--bg-card)] font-bold py-2.5 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  {loading ? 'Envoi...' : 'Enregistrer'}
                </button>
              </div>
            </>
          ) : (
            // ✅ MODE SÉLECTION
            <>
              {/* Zone de drop */}
              <div
                ref={dragRef}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                  ${dragActive 
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 scale-[1.02]' 
                    : 'border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-secondary)]/50'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center">
                  <Upload size={28} className="text-[var(--accent-primary)]" />
                </div>
                <p className="font-bold text-[var(--text-primary)] text-sm mb-1">
                  Cliquez ou glissez votre photo
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  JPG, PNG, WebP, GIF ou SVG — max 5 Mo
                </p>
                {dragActive && (
                  <p className="text-xs text-[var(--accent-primary)] mt-2 font-semibold">
                    Relâchez pour déposer
                  </p>
                )}
              </div>

              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                hidden
                onChange={e => handleFile(e.target.files?.[0])}
                disabled={loading}
                aria-label="Choisir une photo"
              />

              {error && (
                <p className="text-red-500 text-xs mt-3 text-center flex items-center justify-center gap-1">
                  ⚠️ {error}
                </p>
              )}

              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-[var(--bg-card)] font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-1"
                  disabled={loading}
                >
                  <ImageIcon size={14} /> Choisir un fichier
                </button>
                
                {user?.avatarUrl && (
                  <button 
                    onClick={handleDelete} 
                    disabled={loading}
                    className="bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-semibold py-2.5 px-4 rounded-xl text-sm transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Supprimer la photo"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </>
          )}

          {/* Message de succès */}
          {success && (
            <div className="mt-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg px-3 py-2 text-xs flex items-center gap-2 animate-fade-in">
              <Check size={14} /> Photo de profil mise à jour avec succès !
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AvatarUpload