import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Upload, ImagePlus, X, CheckCircle2, 
  Loader, AlertCircle, Info, Tag, MapPin, Package
} from 'lucide-react'
import { createProduct, uploadImage } from '../api/productApi'
import Avatar from '../components/Avatar'

// ✅ Configuration des catégories
const CATEGORIES = [
  { value: 'agricole', label: '🌾 Agricole' },
  { value: 'artisanat', label: '🎨 Artisanat' },
  { value: 'cooperative', label: '🤝 Coopérative' },
]

// ✅ Configuration des unités
const UNITS = [
  { value: 'kg', label: 'Kilogramme (kg)' },
  { value: 'litre', label: 'Litre' },
  { value: 'pièce', label: 'Pièce' },
  { value: 'mètre', label: 'Mètre' },
  { value: '500g', label: '500g' },
  { value: 'sac', label: 'Sac' },
  { value: 'botte', label: 'Botte' },
  { value: 'sachet', label: 'Sachet' },
]

// ✅ Fonction de validation
const validateForm = (form) => {
  const errors = {}
  
  if (!form.name?.trim()) errors.name = 'Le nom est requis'
  if (form.name?.trim().length < 3) errors.name = 'Minimum 3 caractères'
  
  if (!form.price || form.price <= 0) errors.price = 'Prix valide requis'
  if (form.price && form.price < 100) errors.price = 'Prix minimum 100 FCFA'
  
  if (!form.stock || form.stock < 0) errors.stock = 'Stock valide requis'
  
  if (!form.cat) errors.cat = 'Catégorie requise'
  if (!form.origin?.trim()) errors.origin = 'Origine requise'
  
  return errors
}

function AddProduct({ 
  onSuccess,
  onCancel,
  className = '',
}) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [form, setForm] = useState({
    name: '', 
    price: '', 
    stock: '', 
    unit: 'kg',
    cat: 'agricole', 
    origin: '', 
    description: '', 
    image: ''
  })
  const [errors, setErrors] = useState({})
  const [imageFile, setImageFile] = useState(null)

  // ✅ Nettoyer l'URL de prévisualisation
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  // ✅ Gestion des changements
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Effacer l'erreur du champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  // ✅ Gestion de l'image
  const handleImageChange = useCallback((file) => {
    if (!file) return
    
    // Validation
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('Image trop volumineuse (max 5 Mo)')
      return
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setError('Format non supporté (JPG, PNG, WebP ou GIF)')
      return
    }
    
    setError(null)
    const localUrl = URL.createObjectURL(file)
    setPreviewImage(localUrl)
    setImageFile(file)
  }, [])

  // ✅ Drag & Drop
  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleImageChange(file)
  }, [handleImageChange])

  const removeImage = useCallback(() => {
    if (previewImage && previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage)
    }
    setPreviewImage(null)
    setImageFile(null)
    setForm(prev => ({ ...prev, image: '' }))
  }, [previewImage])

  // ✅ Soumission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setError(null)
    
    // Validation
    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Scroll vers la première erreur
      const firstErrorField = Object.keys(validationErrors)[0]
      const element = document.querySelector(`[name="${firstErrorField}"]`)
      if (element) element.focus()
      return
    }
    
    setLoading(true)
    
    try {
      let imageUrl = form.image
      
      // Upload de l'image si présente
      if (imageFile) {
        try {
          const formData = new FormData()
          formData.append('image', imageFile)
          imageUrl = await uploadImage(formData)
        } catch (uploadError) {
          console.warn('Upload failed, using local preview:', uploadError)
          imageUrl = previewImage || ''
        }
      }
      
      // Création du produit
      const productData = {
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        unit: form.unit,
        category: form.cat,
        origin: form.origin.trim(),
        description: form.description.trim(),
        image: imageUrl,
      }
      
      await createProduct(productData)
      
      setSuccess(true)
      
      if (onSuccess) {
        onSuccess(productData)
      }
      
      // Redirection après succès
      setTimeout(() => {
        navigate('/admin/products')
      }, 2000)
      
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors de la création du produit')
    } finally {
      setLoading(false)
    }
  }, [form, imageFile, previewImage, navigate, onSuccess])

  // ✅ Annulation
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel()
    } else {
      navigate('/admin/products')
    }
  }, [onCancel, navigate])

  // ✅ Rendu de succès
  if (success) {
    return (
      <div className={`min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-4 py-8 ${className}`}>
        <div className="bg-[var(--bg-card)] rounded-3xl shadow-xl p-8 sm:p-10 max-w-md w-full text-center border border-[var(--border-color)]">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mb-2">
            Produit ajouté ! 🎉
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Votre produit est maintenant visible sur le marché.
          </p>
          <button 
            onClick={() => navigate('/admin/products')}
            className="w-full bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold py-3 rounded-xl transition active:scale-[0.98]"
          >
            Voir tous les produits
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-[var(--bg-secondary)] py-6 sm:py-8 px-4 ${className}`}>
      <div className="max-w-2xl mx-auto">
        {/* Retour */}
        <button 
          onClick={handleCancel}
          className="flex items-center gap-2 text-[var(--accent-primary)] font-semibold mb-5 sm:mb-6 hover:underline text-sm transition"
        >
          <ArrowLeft size={16} /> Retour aux produits
        </button>

        {/* Carte principale */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 sm:p-6 shadow-sm">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                Ajouter un produit
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Remplissez les informations de votre produit
              </p>
            </div>
            <Package size={24} className="text-[var(--accent-secondary)]" />
          </div>

          {/* Erreur générale */}
          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-center gap-2 animate-fade-in">
              <AlertCircle size={16} className="text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Upload image */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">
                Photo du produit
              </label>
              
              {previewImage ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--accent-primary)] bg-[var(--bg-secondary)]">
                  <img 
                    src={previewImage} 
                    alt="Aperçu du produit" 
                    className="w-full h-56 object-cover" 
                  />
                  <button 
                    type="button" 
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition hover:scale-110"
                    aria-label="Supprimer l'image"
                  >
                    <X size={16} />
                  </button>
                  <label className="absolute bottom-2 right-2 bg-[var(--bg-card)] text-[var(--accent-primary)] rounded-full px-3 py-1.5 text-xs font-bold cursor-pointer hover:bg-[var(--bg-secondary)] transition shadow-md">
                    Changer
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageChange(e.target.files?.[0])}
                      className="hidden" 
                    />
                  </label>
                </div>
              ) : (
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-2xl p-6 sm:p-8 
                    text-center cursor-pointer transition-all
                    ${isDragging 
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 scale-[1.02]' 
                      : 'border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-secondary)]/50'
                    }
                  `}
                  onClick={() => document.getElementById('image-input')?.click()}
                >
                  <input 
                    id="image-input"
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleImageChange(e.target.files?.[0])}
                    className="hidden" 
                  />
                  <ImagePlus size={32} className="text-[var(--text-secondary)] mx-auto mb-2" />
                  <p className="text-sm text-[var(--text-secondary)]">
                    {isDragging ? '📥 Relâchez pour déposer' : 'Cliquez ou glissez une photo'}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]/60 mt-1">
                    PNG, JPG, WebP ou GIF • Max 5 Mo
                  </p>
                </div>
              )}
            </div>

            {/* Nom */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                Nom du produit *
              </label>
              <input 
                type="text" 
                name="name" 
                placeholder="Ex : Cacao bio Bassa'a" 
                required
                value={form.name} 
                onChange={handleChange}
                className={`
                  w-full border rounded-xl px-4 py-3 text-sm 
                  bg-[var(--bg-secondary)] text-[var(--text-primary)]
                  outline-none transition placeholder-[var(--text-secondary)]/50
                  ${errors.name 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-[var(--border-color)] focus:border-[var(--accent-primary)]'
                  }
                `}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

            {/* Prix et Stock */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                  Prix (FCFA) *
                </label>
                <input 
                  type="number" 
                  name="price" 
                  placeholder="3500" 
                  required 
                  min="100"
                  value={form.price} 
                  onChange={handleChange}
                  className={`
                    w-full border rounded-xl px-4 py-3 text-sm 
                    bg-[var(--bg-secondary)] text-[var(--text-primary)]
                    outline-none transition placeholder-[var(--text-secondary)]/50
                    ${errors.price 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[var(--border-color)] focus:border-[var(--accent-primary)]'
                    }
                  `}
                />
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.price}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                  Stock *
                </label>
                <input 
                  type="number" 
                  name="stock" 
                  placeholder="100" 
                  required 
                  min="0"
                  value={form.stock} 
                  onChange={handleChange}
                  className={`
                    w-full border rounded-xl px-4 py-3 text-sm 
                    bg-[var(--bg-secondary)] text-[var(--text-primary)]
                    outline-none transition placeholder-[var(--text-secondary)]/50
                    ${errors.stock 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[var(--border-color)] focus:border-[var(--accent-primary)]'
                    }
                  `}
                />
                {errors.stock && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.stock}
                  </p>
                )}
              </div>
            </div>

            {/* Unité et Catégorie */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                  Unité
                </label>
                <select 
                  name="unit" 
                  value={form.unit} 
                  onChange={handleChange}
                  className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                >
                  {UNITS.map(unit => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                  Catégorie *
                </label>
                <select 
                  name="cat" 
                  value={form.cat} 
                  onChange={handleChange}
                  className={`
                    w-full border rounded-xl px-4 py-3 text-sm 
                    bg-[var(--bg-secondary)] text-[var(--text-primary)]
                    outline-none transition
                    ${errors.cat 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[var(--border-color)] focus:border-[var(--accent-primary)]'
                    }
                  `}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.cat && (
                  <p className="text-xs text-red-500 mt-1">{errors.cat}</p>
                )}
              </div>
            </div>

            {/* Origine */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                Origine *
              </label>
              <input 
                type="text" 
                name="origin" 
                placeholder="Ex : Littoral, Cameroun 🇨🇲" 
                required
                value={form.origin} 
                onChange={handleChange}
                className={`
                  w-full border rounded-xl px-4 py-3 text-sm 
                  bg-[var(--bg-secondary)] text-[var(--text-primary)]
                  outline-none transition placeholder-[var(--text-secondary)]/50
                  ${errors.origin 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-[var(--border-color)] focus:border-[var(--accent-primary)]'
                  }
                `}
              />
              {errors.origin && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.origin}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                Description
              </label>
              <textarea 
                name="description" 
                rows={4}
                placeholder="Décrivez votre produit : qualité, méthode de culture, certifications..."
                value={form.description} 
                onChange={handleChange}
                className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] resize-none placeholder-[var(--text-secondary)]/50"
              />
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                type="button" 
                onClick={handleCancel}
                className="flex-1 border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold py-3 rounded-xl hover:bg-[var(--bg-secondary)] transition"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)] font-bold py-3 rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Publication...
                  </>
                ) : (
                  '🌿 Publier le produit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProduct