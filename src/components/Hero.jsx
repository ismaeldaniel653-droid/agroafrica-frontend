import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, TrendingUp, Users, Package, MapPin, Star } from 'lucide-react'

function Hero({ 
  stats = null, // ✅ Données dynamiques optionnelles
  onExploreClick,
  onSellClick 
}) {
  const navigate = useNavigate()

  // ✅ Gestionnaires optimisés
  const handleExplore = useCallback(() => {
    if (onExploreClick) {
      onExploreClick()
    } else {
      navigate('/')
    }
  }, [navigate, onExploreClick])

  const handleSell = useCallback(() => {
    if (onSellClick) {
      onSellClick()
    } else {
      navigate('/login')
    }
  }, [navigate, onSellClick])

  // ✅ Statistiques par défaut (si non fournies)
  const defaultStats = useMemo(() => [
    { 
      value: stats?.activeSellers || '0', 
      label: 'Vendeurs actifs', 
      icon: Users,
      color: 'text-emerald-400' 
    },
    { 
      value: stats?.products || '0', 
      label: 'Produits', 
      icon: Package,
      color: 'text-amber-400' 
    },
    { 
      value: stats?.countries || '28', 
      label: 'Pays', 
      icon: MapPin,
      color: 'text-blue-400' 
    },
    { 
      value: stats?.satisfaction || '98%', 
      label: 'Satisfaction', 
      icon: Star,
      color: 'text-yellow-400' 
    },
  ], [stats])

  return (
    <section 
      className="bg-gradient-to-br from-[var(--accent-primary)] via-[var(--accent-primary)]/90 to-[var(--accent-secondary)]/80 py-12 md:py-24 px-4 md:px-6 text-center relative overflow-hidden"
      aria-label="Bannière principale"
    >
      {/* ✅ Éléments de fond améliorés */}
      <div className="hidden md:block absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl animate-float" style={{ animationDelay: '0s' }}>
          🌿
        </div>
        <div className="absolute top-40 right-20 text-6xl animate-float" style={{ animationDelay: '1s' }}>
          🌾
        </div>
        <div className="absolute bottom-20 left-1/4 text-7xl animate-float" style={{ animationDelay: '2s' }}>
          🍫
        </div>
        <div className="absolute bottom-10 right-1/3 text-5xl animate-float" style={{ animationDelay: '0.5s' }}>
          ☕
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-20">
          🌍
        </div>
      </div>

      {/* ✅ Motif décoratif en arrière-plan */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-400 text-xs font-semibold px-3 md:px-4 py-2 rounded-full mb-6 tracking-wider animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          🌱 Plateforme N°1 en Afrique — Lancée au Cameroun 🇨🇲
        </div>

        {/* Titre principal */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fade-in">
          Le Grand Marché
          <br />
          <span className="text-amber-400 relative inline-block">
            Agricole & Artisanal
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-amber-400/30 rounded-full"></span>
          </span>
          <br />
          de l'Afrique
        </h1>

        {/* Sous-titre */}
        <p className="text-white/80 text-sm md:text-base mb-8 max-w-lg mx-auto leading-relaxed animate-fade-in">
          Achetez directement auprès d'agriculteurs et artisans africains. 
          Paiement Mobile Money, livraison dans 28 pays.
        </p>

        {/* Boutons CTA */}
        <div className="flex gap-3 md:gap-4 justify-center flex-wrap mb-10 md:mb-12 animate-fade-in">
          <button 
            onClick={handleExplore}
            className="group bg-amber-400 text-[#0D1F2D] font-bold px-5 md:px-8 py-3 rounded-xl text-sm md:text-base hover:bg-amber-500 transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[var(--accent-primary)]"
            aria-label="Explorer le marché"
          >
            <span className="flex items-center gap-2">
              🛒 Explorer le marché
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button 
            onClick={handleSell}
            className="group bg-white/10 text-white border border-white/30 font-semibold px-5 md:px-8 py-3 rounded-xl text-sm md:text-base hover:bg-white/20 transition-all hover:scale-105 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[var(--accent-primary)]"
            aria-label="Devenir vendeur"
          >
            <span className="flex items-center gap-2">
              🏪 Devenir vendeur
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* ✅ Statistiques améliorées */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 justify-items-center animate-fade-in">
          {defaultStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index}
                className="text-center p-2 md:p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 w-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Icon size={16} className={stat.color} />
                  <strong className="block text-xl md:text-2xl font-extrabold text-white">
                    {stat.value}
                  </strong>
                </div>
                <span className="text-[10px] md:text-xs text-white/70 font-medium">
                  {stat.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* ✅ Indicateur de défilement */}
        <div className="mt-8 text-white/30 animate-bounce hidden md:block">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full mx-auto flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/30 rounded-full animate-scroll-down"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero