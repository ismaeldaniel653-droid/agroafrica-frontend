import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Store, CheckCircle, Users, Globe, 
  TrendingUp, Award, Sparkles, ChevronRight,
  Smartphone, Shield, Package, BarChart
} from 'lucide-react'

// ✅ Avantages pour les vendeurs
const BENEFITS = [
  {
    icon: Globe,
    title: 'Visibilité internationale',
    description: 'Atteignez des acheteurs dans 28 pays africains',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  },
  {
    icon: TrendingUp,
    title: 'Commission réduite',
    description: 'Seulement 5% sur chaque vente, pas de frais cachés',
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
  },
  {
    icon: Shield,
    title: 'Paiement sécurisé',
    description: 'Transactions sécurisées via Mobile Money',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  },
  {
    icon: Users,
    title: 'Communauté active',
    description: 'Rejoignez des milliers de vendeurs certifiés',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
  },
]

// ✅ Étapes d'inscription
const STEPS = [
  { 
    icon: Store, 
    label: 'Créez votre boutique',
    description: 'Inscrivez-vous en 2 minutes'
  },
  { 
    icon: Package, 
    label: 'Publiez vos produits',
    description: 'Ajoutez vos produits avec photos'
  },
  { 
    icon: Smartphone, 
    label: 'Recevez vos commandes',
    description: 'Gérez vos ventes depuis votre téléphone'
  },
  { 
    icon: BarChart, 
    label: 'Suivez vos statistiques',
    description: 'Analysez vos performances en temps réel'
  },
]

// ✅ Témoignages
const TESTIMONIALS = [
  {
    name: 'Marie-Claire',
    product: 'Cacao bio',
    country: '🇨🇲 Cameroun',
    text: 'AgroAfrica m\'a permis de vendre ma production à des acheteurs internationaux. En 3 mois, j\'ai triplé mes revenus !',
    rating: 5,
    avatar: '👩‍🌾'
  },
  {
    name: 'Amadou',
    product: 'Artisanat',
    country: '🇸🇳 Sénégal',
    text: 'Grâce à la plateforme, mes paniers tressés sont maintenant vendus dans 5 pays différents. Une véritable révolution !',
    rating: 5,
    avatar: '🧑‍🎨'
  },
]

function DevenirVendeur({ 
  className = '',
  showTestimonials = true,
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

      {/* En-tête */}
      <div className="relative bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-primary)]/80 rounded-3xl p-6 sm:p-8 text-[var(--text-light)] mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">🏪</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 rounded-full p-2">
              <Store size={28} className="text-[var(--accent-secondary)]" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              🚀 Rejoignez-nous
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 flex items-center gap-2">
            Devenir <span className="text-[var(--accent-secondary)]">vendeur</span>
          </h1>
          <p className="text-[var(--text-light)]/80 text-sm sm:text-base max-w-lg">
            Rejoignez la communauté AgroAfrica et vendez vos produits agricoles et artisanaux dans toute l'Afrique.
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { value: '28', label: 'Pays couverts', icon: Globe },
          { value: '10K+', label: 'Vendeurs actifs', icon: Users },
          { value: '50K+', label: 'Produits vendus', icon: Package },
          { value: '98%', label: 'Satisfaction', icon: Award },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-3 text-center">
              <Icon size={18} className="mx-auto text-[var(--accent-secondary)] mb-1" />
              <p className="text-lg font-extrabold text-[var(--text-primary)]">{stat.value}</p>
              <p className="text-[10px] text-[var(--text-secondary)]">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Description */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-[var(--accent-primary)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              Vendez en ligne en toute simplicité
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Créez votre boutique en ligne en quelques clics. Publiez vos produits, gérez vos commandes 
              et touchez des milliers d'acheteurs dans <strong className="text-[var(--text-primary)]">28 pays africains</strong>. 
              Pas de frais d'inscription, une commission de seulement <strong className="text-[var(--accent-secondary)]">5%</strong> sur chaque vente.
            </p>
          </div>
        </div>
      </div>

      {/* Avantages */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Award size={20} className="text-[var(--accent-secondary)]" />
          Pourquoi vendre sur AgroAfrica ?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div 
                key={index} 
                className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 hover:shadow-md transition"
              >
                <div className={`inline-flex p-2 rounded-xl ${benefit.color} mb-2`}>
                  <Icon size={18} />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Étapes */}
      {showSteps && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-[var(--accent-secondary)]" />
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <div 
                  key={index} 
                  className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 text-center hover:shadow-md transition relative"
                >
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

      {/* Témoignages */}
      {showTestimonials && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Users size={20} className="text-[var(--accent-secondary)]" />
            Ils ont rejoint l'aventure
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {testimonial.country} · {testimonial.product}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="mt-2 text-amber-400 text-xs">
                  {'★'.repeat(testimonial.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          Prêt à lancer votre boutique ?
        </h3>
        <p className="text-sm text-[var(--text-primary)]/80 mb-4 max-w-md mx-auto">
          Rejoignez des milliers de vendeurs qui font confiance à AgroAfrica.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button 
            onClick={() => navigate('/register')}
            className="bg-[var(--text-primary)] text-[var(--bg-card)] font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[var(--text-primary)]/80 transition flex items-center gap-2"
          >
            Créer ma boutique <ChevronRight size={16} />
          </button>
          <button 
            onClick={() => navigate('/contact')}
            className="bg-white/20 text-[var(--text-primary)] font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-white/30 transition backdrop-blur-sm"
          >
            Contacter un conseiller
          </button>
        </div>
        <p className="text-[10px] text-[var(--text-primary)]/60 mt-3">
          ✅ Aucune carte bancaire requise · Démarrage gratuit
        </p>
      </div>
    </div>
  )
}

export default DevenirVendeur