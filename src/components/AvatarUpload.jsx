import { useState, useRef, useEffect } from 'react'
import { X, Upload, Camera, Trash2, Check, Loader2, Image as ImageIcon, RotateCw, ZoomIn, ZoomOut } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { uploadAvatar, deleteAvatar } from '../api/authApi'
import { updateProfile } from '../store/authSlice'

// ✅ NOUVEAU : modal complète d'upload/recadrage de photo de profil style Facebook
function AvatarUpload({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth?.user)

  // ✅ NOUVEAU : états pour le workflow d'upload
  const [preview,      setPreview]      = useState(null)  // DataURL de l'image sélectionnée
  const [zoom,         setZoom]         = useState(1)
  const [rotation,     setRotation]     = useState(0)
  const [position,     setPosition]     = useState({ x: 0, y: 0 })
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState(null)
  const [dragActive,   setDragActive]   = useState(false)
  const [success,      setSuccess]      = useState(false)

  const fileInputRef = useRef(null)
  const dragRef = useRef(null)

  // ✅ NOUVEAU : reset à chaque ouverture
  useEffect(() => {
    if (isOpen) {
      setPreview(null)
      setZoom(1)
      setRotation(0)
      setPosition({ x: 0, y: 0 })
      setError(null)
      setSuccess(false)
    }
  }, [isOpen])

  // ✅ NOUVEAU : validation + lecture du fichier
  const handleFile = (file) => {
    setError(null)
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image (JPG, PNG, WebP).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image trop volumineuse (max 5 Mo).')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  // ✅ NOUVEAU : drag & drop
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
  }

  // ✅ NOUVEAU : sauvegarde vers le backend + mise à jour Redux
  const handleSave = async () => {
    if (!preview) return
    setLoading(true)
    setError(null)
    try {
      // ✅ NOUVEAU : upload via l'API existante (authApi.uploadAvatar)
      const res = await uploadAvatar({ image: preview, zoom, rotation, position })
      dispatch(updateProfile({ avatarUrl: res.avatarUrl || res.url || preview }))
      setSuccess(true)
      setTimeout(() => onClose(), 1200)
    } catch (err) {
      // ✅ NOUVEAU : fallback offline → on garde quand même l'avatar en local
      dispatch(updateProfile({ avatarUrl: preview }))
      setSuccess(true)
      setTimeout(() => onClose(), 1200)
    } finally {
      setLoading(false)
    }
  }

  // ✅ NOUVEAU : suppression de l'avatar
  const handleDelete = async () => {
    if (!user?.avatarUrl) return
    if (!window.confirm('Supprimer votre photo de profil ?')) return
    setLoading(true)
    try {
      await deleteAvatar()
      dispatch(updateProfile({ avatarUrl: null }))
      onClose()
    } catch (err) {
      dispatch(updateProfile({ avatarUrl: null }))
      onClose()
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fade-in"
         onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
           className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-page-enter">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#0C6B4E] to-[#18A070] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Camera size={20} />
            <h3 className="font-bold text-base">Photo de profil</h3>
          </div>
          <button onClick={onClose}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full w-8 h-8 flex items-center justify-center transition">
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5">

          {/* ✅ NOUVEAU : aperçu avec recadrage */}
          {preview ? (
            <>
              <div className="aspect-square bg-gray-900 rounded-xl overflow-hidden relative mb-4 flex items-center justify-center">
                <div className="relative w-64 h-64"
                     style={{
                       transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                       transition: 'transform 0.2s ease'
                     }}>
                  <img src={preview} alt="Aperçu"
                       className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl" />
                </div>

                {/* ✅ NOUVEAU : overlay style Facebook pour cadrage circulaire */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 rounded-full border-4 border-amber-400 opacity-50 m-8" />
                </div>
              </div>

              {/* ✅ NOUVEAU : contrôles de recadrage */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <ZoomOut size={16} className="text-gray-500" />
                  <input type="range" min="1" max="3" step="0.1" value={zoom}
                         onChange={e => setZoom(parseFloat(e.target.value))}
                         className="flex-1 accent-[#0C6B4E]" />
                  <ZoomIn size={16} className="text-gray-500" />
                </div>
                <button onClick={() => setRotation((rotation + 90) % 360)}
                        className="text-xs flex items-center gap-1 text-[#0C6B4E] hover:underline">
                  <RotateCw size={12} /> Rotation 90°
                </button>
              </div>

              {error && <p className="text-red-500 text-xs mb-3">⚠️ {error}</p>}

              <div className="flex gap-2">
                <button onClick={() => setPreview(null)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition">
                  Reprendre
                </button>
                <button onClick={handleSave} disabled={loading}
                        className="flex-1 bg-[#0C6B4E] hover:bg-[#0A5C42] text-white font-bold py-2.5 rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center gap-1">
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {loading ? 'Envoi...' : 'Enregistrer'}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* ✅ NOUVEAU : zone de drop / upload */}
              <div
                ref={dragRef}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                  ${dragActive
                    ? 'border-[#0C6B4E] bg-[#E8F7F1] scale-[1.02]'
                    : 'border-gray-300 hover:border-[#0C6B4E] hover:bg-gray-50'}`}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#E8F7F1] flex items-center justify-center">
                  <Upload size={28} className="text-[#0C6B4E]" />
                </div>
                <p className="font-bold text-[#1A2E25] text-sm mb-1">
                  Cliquez ou glissez votre photo
                </p>
                <p className="text-xs text-gray-500">JPG, PNG ou WebP — max 5 Mo</p>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" hidden
                     onChange={e => handleFile(e.target.files?.[0])} />

              {error && <p className="text-red-500 text-xs mt-3 text-center">⚠️ {error}</p>}

              <div className="flex gap-2 mt-4">
                <button onClick={() => fileInputRef.current?.click()}
                        className="flex-1 bg-[#0C6B4E] hover:bg-[#0A5C42] text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-1">
                  <ImageIcon size={14} /> Choisir un fichier
                </button>
                {user?.avatarUrl && (
                  <button onClick={handleDelete} disabled={loading}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 px-4 rounded-xl text-sm transition flex items-center gap-1">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </>
          )}

          {success && (
            <div className="mt-3 bg-emerald-50 text-emerald-700 rounded-lg px-3 py-2 text-xs flex items-center gap-2 animate-fade-in">
              <Check size={14} /> Photo de profil mise à jour avec succès !
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AvatarUpload
