import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, BookOpen, CheckCircle, Store, Package, 
  Smartphone, BarChart, Users, Award, Shield,
  ChevronRight, Sparkles, Clock, TrendingUp, MessageCircle
} from 'lucide-react'

// ✅ Sections du guide
const SECTIONS = [
  {
    icon: Store,
    title: 'Créer votre boutique',
    description: 'Inscrivez-vous et configurez votre espace vendeur en quelques minutes',
    steps: [
      'Créez un compte vendeur sur AgroAfrica',
      'Remplissez vos informations de profil',
      'Ajoutez votre logo et vos coordonnées',
      'Activez votre boutique'
    ],
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
  },
  {
    icon: Package,
    title: 'Publier des produits',
    description: 'Mettez en ligne vos produits de manière professionnelle',
    steps: [
      'Ajoutez des photos de qualité',
      'Rédigez une description détaillée',
      'Fixez un prix compétitif',
      'Précisez le lieu d\'origine'
    ],
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  },
  {
    icon: Smartphone,
    title: 'Gérer les commandes',
    description: 'Suivez et traitez vos commandes en temps réel',
    steps: [
      'Recevez des notifications sur votre téléphone',
      'Confirmez les commandes rapidement',
      'Préparez les colis avec soin',
      'Coordonnez la livraison'
    ],
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
  },
  {
    icon: BarChart,
    title: 'Suivre vos performances',
    description: 'Analysez vos ventes et optimisez votre activité',
    steps: [
      'Consultez vos statistiques quotidiennes',
      'Identifiez vos produits vedettes',
      'Suivez vos revenus',
      'Ajustez votre stratégie'
    ],
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  },
]

// ✅ Conseils supplémentaires
const TIPS = [
  {
    icon: Award,
    title: 'Qualité d\'abord',
    description: 'Des photos et descriptions de qualité augmentent vos ventes de 60%'
  },
  {
    icon: Users,
    title: 'Service client',
    description: 'Répondez rapidement aux questions des acheteurs'
  },
  {
    icon: TrendingUp,
    title: 'Prix compétitifs',
    description: 'Étudiez le marché pour fixer vos prix'
  },
  {
    icon: Clock,
    title: 'Réactivité',
    description: 'Traitez vos commandes sous 48h maximum'
  },
]

function GuideVendeur({ 
  className = '',
  showTips = true,
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">📖</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 rounded-full p-2">
              <BookOpen size={28} className="text-[var(--accent-secondary)]" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              📚 Guide complet
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Guide <span className="text-[var(--accent-secondary)]">vendeur</span>
          </h1>
          <p className="text-[var(--text-light)]/80 text-sm sm:text-base max-w-lg">
            Tout ce qu'il faut savoir pour vendre sur AgroAfrica et réussir votre activité.
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-[var(--accent-primary)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              Bienvenue sur AgroAfrica !
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Ce guide vous accompagne pas à pas pour <strong className="text-[var(--text-primary)]">créer votre boutique</strong>, 
              <strong className="text-[var(--text-primary)]"> publier vos produits</strong> et 
              <strong className="text-[var(--text-primary)]"> développer votre activité</strong> 
              sur notre plateforme. Suivez les sections ci-dessous pour maîtriser tous les aspects de la vente en ligne.
            </p>
          </div>
        </div>
      </div>

      {/* Sections du guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {SECTIONS.map((section, index) => {
          const Icon = section.icon
          return (
            <div 
              key={index} 
              className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 hover:shadow-md transition"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`inline-flex p-2 rounded-xl ${section.color} shrink-0`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {section.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {section.description}
                  </p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {section.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mt-0.5">
                      <CheckCircle size={12} />
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Conseils supplémentaires */}
      {showTips && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Award size={20} className="text-[var(--accent-secondary)]" />
            Conseils pour réussir
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TIPS.map((tip, index) => {
              const Icon = tip.icon
              return (
                <div 
                  key={index} 
                  className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-3 text-center hover:shadow-md transition"
                >
                  <div className="w-10 h-10 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Icon size={18} className="text-[var(--accent-primary)]" />
                  </div>
                  <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1">
                    {tip.title}
                  </h3>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Ressources supplémentaires */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-5 mb-6">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <MessageCircle size={16} className="text-[var(--accent-secondary)]" />
          Besoin d'aide ?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a 
            href="/service-client" 
            className="flex items-center gap-3 p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition"
          >
            <div className="w-8 h-8 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center">
              <Users size={16} className="text-[var(--accent-primary)]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">Service client</p>
              <p className="text-[10px] text-[var(--text-secondary)]">Réponse sous 24h</p>
            </div>
            <ChevronRight size={16} className="ml-auto text-[var(--text-secondary)]" />
          </a>
          <a 
            href="/certification" 
            className="flex items-center gap-3 p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition"
          >
            <div className="w-8 h-8 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center">
              <Shield size={16} className="text-[var(--accent-primary)]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">Certification</p>
              <p className="text-[10px] text-[var(--text-secondary)]">Garantie blockchain</p>
            </div>
            <ChevronRight size={16} className="ml-auto text-[var(--text-secondary)]" />
          </a>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          Prêt à commencer ?
        </h3>
        <p className="text-sm text-[var(--text-primary)]/80 mb-4 max-w-md mx-auto">
          Appliquez ces conseils et lancez votre boutique dès aujourd'hui.
        </p>
        <button 
          onClick={() => navigate('/devenir-vendeur')}
          className="bg-[var(--text-primary)] text-[var(--bg-card)] font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[var(--text-primary)]/80 transition flex items-center gap-2 mx-auto"
        >
          Créer ma boutique <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default GuideVendeur