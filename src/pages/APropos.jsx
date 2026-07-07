import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Leaf, Users, Globe, Shield, 
  CheckCircle, Award, Sparkles, Heart,
  TrendingUp, Coffee, ShoppingBag, MapPin
} from 'lucide-react'

// ✅ Configuration des valeurs
const VALUES = [
  {
    icon: Leaf,
    title: 'Produits authentiques',
    description: 'Directement issus des producteurs locaux, sans intermédiaires',
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
  },
  {
    icon: Shield,
    title: 'Transparence totale',
    description: 'Traçabilité blockchain et certification des produits',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  },
  {
    icon: Globe,
    title: 'Impact communautaire',
    description: 'Soutien aux coopératives et développement local',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
  },
  {
    icon: Users,
    title: 'Commerce équitable',
    description: 'Prix justes pour les producteurs, accessibles pour les acheteurs',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  },
]

// ✅ Statistiques clés
const STATS = [
  { value: '28', label: 'Pays africains', icon: MapPin },
  { value: '10K+', label: 'Producteurs actifs', icon: Users },
  { value: '50K+', label: 'Produits référencés', icon: ShoppingBag },
  { value: '98%', label: 'Satisfaction client', icon: Heart },
]

// ✅ Étapes de la chaîne de valeur
const STEPS = [
  { icon: Coffee, label: 'Récolte', description: 'Produits frais récoltés par nos agriculteurs' },
  { icon: Award, label: 'Certification', description: 'Contrôle qualité et certification' },
  { icon: ShoppingBag, label: 'Mise en ligne', description: 'Référencement sur la plateforme' },
  { icon: CheckCircle, label: 'Livraison', description: 'Expédition rapide vers le monde entier' },
]

function APropos({ 
  className = '',
  showStats = true,
  showValues = true,
  showSteps = true,
}) {
  const navigate = useNavigate()

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-5 py-6 sm:py-8 ${className}`}>
      {/* Retour */}
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-[var(--accent-primary)] font-semibold mb-5 hover:underline text-sm transition"
      >
        <ArrowLeft size={16} /> Retour au marché
      </button>

      {/* Bannière principale */}
      <div className="relative bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-primary)]/80 rounded-3xl p-6 sm:p-8 text-[var(--text-light)] mb-6 overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">🌍</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 rounded-full p-2">
              <Leaf size={28} className="text-[var(--accent-secondary)]" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              🌱 Depuis 2024
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 flex items-center gap-2">
            À propos d'<span className="text-[var(--accent-secondary)]">AgroAfrica</span>
          </h1>
          <p className="text-[var(--text-light)]/80 text-sm sm:text-base max-w-lg">
            Le premier grand marché africain de produits agricoles et artisanaux. 
            Du producteur à l'acheteur, en toute transparence.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 mb-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <Sparkles size={20} className="text-[var(--accent-secondary)]" />
          Notre mission
        </h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          AgroAfrica connecte directement les producteurs, agriculteurs et artisans africains 
          aux acheteurs du monde entier. Notre mission est de <strong className="text-[var(--text-primary)]">valoriser le savoir-faire local</strong>, 
          garantir la <strong className="text-[var(--text-primary)]">transparence des échanges</strong> et promouvoir le 
          <strong className="text-[var(--text-primary)]"> commerce équitable</strong> dans 28 pays africains.
        </p>
      </div>

      {/* Statistiques clés */}
      {showStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {STATS.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index} 
                className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 text-center hover:shadow-md transition"
              >
                <div className="flex justify-center mb-1">
                  <Icon size={20} className="text-[var(--accent-secondary)]" />
                </div>
                <p className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Valeurs */}
      {showValues && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Heart size={20} className="text-[var(--accent-secondary)]" />
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VALUES.map((value, index) => {
              const Icon = value.icon
              return (
                <div 
                  key={index} 
                  className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 hover:shadow-md transition"
                >
                  <div className={`inline-flex p-2 rounded-xl ${value.color} mb-2`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                    {value.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Chaîne de valeur */}
      {showSteps && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-[var(--accent-secondary)]" />
            Comment ça marche
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <div 
                  key={index} 
                  className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 text-center hover:shadow-md transition relative"
                >
                  {/* Numéro d'étape */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--accent-primary)] text-[var(--text-light)] rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center">
                      <Icon size={20} className="text-[var(--accent-primary)]" />
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1">
                    {step.label}
                  </h3>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          Prêt à rejoindre l'aventure ?
        </h3>
        <p className="text-sm text-[var(--text-primary)]/80 mb-4 max-w-md mx-auto">
          Rejoignez des milliers de producteurs et acheteurs qui font confiance à AgroAfrica.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button 
            onClick={() => navigate('/devenir-vendeur')}
            className="bg-[var(--text-primary)] text-[var(--bg-card)] font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[var(--text-primary)]/80 transition"
          >
            Devenir vendeur
          </button>
          <button 
            onClick={() => navigate('/')}
            className="bg-white/20 text-[var(--text-primary)] font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-white/30 transition backdrop-blur-sm"
          >
            Explorer le marché
          </button>
        </div>
      </div>
    </div>
  )
}

export default APropos