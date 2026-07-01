import { Package } from 'lucide-react'   // ✅ NOUVEAU : icône standardisée

// ✅ MODIFIÉ : counts à 0 (données réelles viendront de l'API)
const CATS = [
  { key:'all',         emoji:'🏪', label:'Tout voir',    count:0 },
  { key:'agricole',    emoji:'🌾', label:'Agricole',     count:0 },
  { key:'artisanat',   emoji:'🎨', label:'Artisanat',    count:0 },
  { key:'cooperative', emoji:'🤝', label:'Coopératives', count:0 },
  { key:'cacao',       emoji:'🍫', label:'Cacao & Café', count:0 },
  { key:'vannerie',    emoji:'🧺', label:'Vannerie',     count:0 },
]

function Categories({ activeCat, setActiveCat }) {
  return (
    <div>
      {/* ✅ MODIFIÉ : grille mobile-first 2 colonnes, wrap à 6 sur desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 my-5 sm:my-7">
        {CATS.map((cat, i) => {
          const isActive = activeCat === cat.key
          return (
            <button
              key={i}
              type="button"                                   // ✅ NOUVEAU : bouton explicite
              onClick={() => setActiveCat(cat.key)}
              aria-pressed={isActive}
              aria-label={`Catégorie ${cat.label}`}
              className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border transition active:scale-95
                hover:-translate-y-0.5 hover:shadow-md
                ${isActive
                  ? 'bg-[#E8F7F1] border-[#0C6B4E] ring-2 ring-[#0C6B4E]/20'
                  : 'bg-white border-[#DDE8E2] hover:border-[#0C6B4E]'}`}
            >
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{cat.emoji}</div>
              <div className="text-[11px] sm:text-xs font-semibold text-[#1A2E25] line-clamp-1">
                {cat.label}
              </div>
              {/* ✅ MODIFIÉ : affichage du compteur plus lisible */}
              <div className="flex items-center justify-center gap-1 text-[10px] text-[#8AADA0] mt-1">
                <Package size={9} />
                <span>
                  {cat.count > 0 ? `${cat.count} produits` : 'Bientôt disponible'}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Categories
