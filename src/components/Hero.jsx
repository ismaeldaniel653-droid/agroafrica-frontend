import { useNavigate } from 'react-router-dom'

function Hero() {
  const navigate = useNavigate()
  
  return (
    <div className="bg-gradient-to-br from-[#063D2A] via-[#0C6B4E] to-[#18A070] py-12 md:py-24 px-4 md:px-6 text-center relative overflow-hidden">
      
      {/* ✅ NOUVEAU : Emojis de fond masqués sur mobile pour éviter le chevauchement */}
      <div className="hidden md:block absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-8xl">🌿</div>
        <div className="absolute top-40 right-20 text-6xl">🌾</div>
        <div className="absolute bottom-20 left-1/4 text-7xl">🍫</div>
        <div className="absolute bottom-10 right-1/3 text-5xl">☕</div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">

        {/* Badge */}
        <span className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-400 text-xs font-semibold px-3 md:px-4 py-2 rounded-full mb-6 tracking-wider animate-fade-in">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
          🌱 Plateforme N°1 en Afrique — Lancée au Cameroun 🇨🇲
        </span>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fade-in">
          Le Grand Marché<br/>
          <span className="text-amber-400">Agricole & Artisanal</span><br/>
          de l'Afrique
        </h1>

        {/* ✅ NOUVEAU : Sous-titre neutre (sans mention des 28 pays qui sera ajoutée plus tard) */}
        <p className="text-white/75 text-sm md:text-base mb-8 max-w-lg mx-auto leading-relaxed animate-fade-in">
          Bientôt disponible : Achetez directement auprès d'agriculteurs et artisans africains. Paiement Mobile Money, livraison dans 28 pays.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-3 md:gap-4 justify-center flex-wrap mb-10 md:mb-12 animate-fade-in">
          <button 
            onClick={() => navigate('/')}
            className="group bg-amber-400 text-[#0D1F2D] font-bold px-5 md:px-8 py-3 rounded-xl text-sm md:text-base hover:bg-amber-500 transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-400/30"
          >
            <span className="flex items-center gap-2">
              🛒 Explorer le marché
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="group bg-white/10 text-white border border-white/30 font-semibold px-5 md:px-8 py-3 rounded-xl text-sm md:text-base hover:bg-white/20 transition-all hover:scale-105 backdrop-blur-sm"
          >
            <span className="flex items-center gap-2">
              🏪 Devenir vendeur
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </div>

        {/* ✅ NOUVEAU : Statistiques remises à zéro */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 justify-items-center animate-fade-in">
          {[
            { num:'0',     label:'Vendeurs actifs' },
            { num:'0',     label:'Produits'        },
            { num:'0',     label:'Pays (objectif : 28)' },
            { num:'—',     label:'Satisfaction'    },
          ].map((s, i) => (
            <div key={i} className="text-center p-2 md:p-4">
              <strong className="block text-2xl md:text-3xl font-extrabold text-white mb-1">{s.num}</strong>
              <span className="text-[11px] md:text-sm text-white/70">{s.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Hero
