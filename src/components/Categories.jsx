import { useMemo, useCallback } from 'react'
import { Package, ChevronRight } from 'lucide-react'

// ✅ Catégories avec icônes et couleurs
const CATEGORIES = [
  { key: 'all', emoji: '🏪', label: 'Tout voir', count: 0, color: 'text-[var(--text-primary)]' },
  { key: 'agricole', emoji: '🌾', label: 'Agricole', count: 0, color: 'text-emerald-600' },
  { key: 'artisanat', emoji: '🎨', label: 'Artisanat', count: 0, color: 'text-amber-600' },
  { key: 'cooperative', emoji: '🤝', label: 'Coopératives', count: 0, color: 'text-blue-600' },
  { key: 'cacao', emoji: '🍫', label: 'Cacao & Café', count: 0, color: 'text-brown-600' },
  { key: 'vannerie', emoji: '🧺', label: 'Vannerie', count: 0, color: 'text-orange-600' },
]

function Categories({ 
  activeCat = 'all', 
  setActiveCat, 
  categories = CATEGORIES,
  showCounts = true,
  className = '',
  onCategoryClick 
}) {
  // ✅ Mémorisation des catégories pour éviter les re-renders
  const memoizedCategories = useMemo(() => categories, [categories])

  // ✅ Gestionnaire de clic optimisé
  const handleCategoryClick = useCallback((catKey) => {
    if (setActiveCat) {
      setActiveCat(catKey)
    }
    if (onCategoryClick) {
      onCategoryClick(catKey)
    }
  }, [setActiveCat, onCategoryClick])

  // ✅ Vérification si une catégorie est active
  const isActive = useCallback((catKey) => activeCat === catKey, [activeCat])

  return (
    <div className={`w-full ${className}`}>
      {/* ✅ En-tête avec lien "Voir tout" */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
          <span className="text-lg">📂</span>
          Catégories
        </h2>
        <button 
          onClick={() => handleCategoryClick('all')}
          className="text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1 font-medium transition"
          aria-label="Voir toutes les catégories"
        >
          Voir tout <ChevronRight size={14} />
        </button>
      </div>

      {/* ✅ Grille responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
        {memoizedCategories.map((cat) => {
          const active = isActive(cat.key)
          const hasItems = cat.count > 0

          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => handleCategoryClick(cat.key)}
              aria-pressed={active}
              aria-label={`Catégorie ${cat.label}${hasItems ? `, ${cat.count} produits` : ', bientôt disponible'}`}
              className={`
                rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center 
                border-2 transition-all duration-200 
                active:scale-95 hover:-translate-y-0.5 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2
                ${active
                  ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/20'
                  : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--accent-primary)]/50'
                }
                ${!hasItems ? 'opacity-60 hover:opacity-80' : ''}
              `}
              disabled={!hasItems && cat.key !== 'all'}
            >
              {/* Émoji */}
              <div className={`
                text-2xl sm:text-3xl mb-1 sm:mb-2 transition-transform duration-200
                ${active ? 'scale-110' : ''}
              `}>
                {cat.emoji}
              </div>

              {/* Label */}
              <div className={`
                text-[11px] sm:text-xs font-semibold line-clamp-1
                ${active ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}
              `}>
                {cat.label}
              </div>

              {/* ✅ Compteur avec icône Package */}
              {showCounts && (
                <div className="flex items-center justify-center gap-1 text-[10px] text-[var(--text-secondary)] mt-1">
                  <Package size={9} className={active ? 'text-[var(--accent-primary)]' : ''} />
                  <span>
                    {hasItems 
                      ? `${cat.count} produit${cat.count > 1 ? 's' : ''}` 
                      : 'Bientôt disponible'
                    }
                  </span>
                </div>
              )}

              {/* ✅ Indicateur de sélection */}
              {active && (
                <div className="mt-1.5 w-6 h-0.5 bg-[var(--accent-primary)] rounded-full mx-auto" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Categories