import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Tag, CheckCircle, Shield, 
  Sparkles, Users, Package, CreditCard,
  ChevronRight, Percent, Wallet, Award
} from 'lucide-react'

// ✅ Forfaits pour les vendeurs
const PLANS = [
  {
    name: 'Découverte',
    price: 'Gratuit',
    period: 'à vie',
    features: [
      '10 produits maximum',
      'Commission 5%',
      'Paiement Mobile Money',
      'Certification blockchain',
    ],
    icon: <Sparkles size={20} />,
    color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    isPopular: false,
  },
  {
    name: 'Premium',
    price: '9 900',
    period: '/mois',
    features: [
      'Produits illimités',
      'Commission 3%',
      'Priorité dans les recherches',
      'Badge "Vendeur certifié"',
      'Support prioritaire',
      'Statistiques avancées',
    ],
    icon: <Award size={20} />,
    color: 'border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20',
    textColor: 'text-amber-600 dark:text-amber-400',
    isPopular: true,
  },
  {
    name: 'Coopérative',
    price: 'Sur devis',
    period: '',
    features: [
      'Compte coopératif',
      'Jusqu\'à 50 vendeurs',
      'Commission 2%',
      'Dashboard personnalisé',
      'Formation incluse',
      'Support dédié',
    ],
    icon: <Users size={20} />,
    color: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20',
    textColor: 'text-purple-600 dark:text-purple-400',
    isPopular: false,
  },
]

// ✅ Avantages
const BENEFITS = [
  {
    icon: Percent,
    title: 'Commission réduite',
    description: 'Seulement 5% sur chaque vente en formule Découverte'
  },
  {
    icon: Shield,
    title: 'Paiement sécurisé',
    description: 'Transactions sécurisées via Mobile Money'
  },
  {
    icon: Wallet,
    title: 'Paiement instantané',
    description: 'Recevez vos fonds sous 48h après livraison'
  },
  {
    icon: Users,
    title: 'Communauté active',
    description: 'Rejoignez des milliers de vendeurs certifiés'
  },
]

// ✅ Comparaison des commissions
const COMMISSION_TABLE = [
  { range: '0 - 100 000 FCFA', rate: '5%', fee: 'Jusqu\'à 5 000 FCFA' },
  { range: '100 000 - 1 000 000 FCFA', rate: '4%', fee: 'De 4 000 à 40 000 FCFA' },
  { range: '1 000 000+ FCFA', rate: '3%', fee: 'À partir de 30 000 FCFA' },
]

function Tarifs({ 
  className = '',
  showPlans = true,
  showCommission = true,
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
      <div className="relative bg-gradient-to-br from-amber-400 to-amber-500 rounded-3xl p-6 sm:p-8 text-[var(--text-primary)] mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">💰</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 rounded-full p-2">
              <Tag size={28} className="text-[var(--text-primary)]" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              💰 Prix transparents
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Tarifs <span className="text-[var(--bg-card)]">AgroAfrica</span>
          </h1>
          <p className="text-[var(--text-primary)]/80 text-sm sm:text-base max-w-lg">
            Nos tarifs pour les vendeurs et acheteurs. Transparence et simplicité.
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { value: '5%', label: 'Commission de base', icon: Percent },
          { value: '3%', label: 'Commission Premium', icon: Award },
          { value: '48h', label: 'Paiement rapide', icon: Wallet },
          { value: '100%', label: 'Satisfaction', icon: Shield },
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
              Des tarifs justes et transparents
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              La vente sur AgroAfrica est <strong className="text-[var(--text-primary)]">gratuite</strong>. 
              Une commission de <strong className="text-[var(--accent-secondary)]">5%</strong> est appliquée sur 
              chaque transaction pour couvrir les frais de plateforme, de paiement sécurisé et de support client. 
              Plus vous vendez, plus la commission diminue !
            </p>
          </div>
        </div>
      </div>

      {/* Forfaits */}
      {showPlans && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Package size={20} className="text-[var(--accent-secondary)]" />
            Forfaits vendeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-[var(--bg-card)] rounded-2xl border-2 p-5 relative ${plan.color} hover:shadow-lg transition`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-2 right-4 bg-amber-400 text-[var(--text-primary)] text-[10px] font-bold px-3 py-0.5 rounded-full">
                    🌟 Populaire
                  </span>
                )}
                <div className={`flex items-center gap-2 mb-3 ${plan.textColor}`}>
                  {plan.icon}
                  <h3 className="font-bold text-base">{plan.name}</h3>
                </div>
                <div className="mb-4">
                  <p className="text-2xl font-extrabold text-[var(--text-primary)]">{plan.price}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{plan.period}</p>
                </div>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <CheckCircle size={12} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigate('/devenir-vendeur')}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition ${
                    plan.isPopular 
                      ? 'bg-amber-400 hover:bg-amber-500 text-[var(--text-primary)]' 
                      : 'border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                  }`}
                >
                  {plan.isPopular ? 'Commencer' : 'En savoir plus'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tableau des commissions */}
      {showCommission && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Percent size={20} className="text-[var(--accent-secondary)]" />
            Barème des commissions
          </h2>
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                    <th className="px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      Chiffre d'affaires
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      Commission estimée
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {COMMISSION_TABLE.map((row, index) => (
                    <tr key={index} className="hover:bg-[var(--bg-secondary)] transition">
                      <td className="px-5 py-3 text-sm font-semibold text-[var(--text-primary)]">
                        {row.range}
                      </td>
                      <td className="px-5 py-3 text-sm font-bold text-[var(--accent-secondary)]">
                        {row.rate}
                      </td>
                      <td className="px-5 py-3 text-sm text-[var(--text-secondary)]">
                        {row.fee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Avantages */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Award size={20} className="text-[var(--accent-secondary)]" />
          Pourquoi vendre sur AgroAfrica ?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div 
                key={index} 
                className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-3 text-center hover:shadow-md transition"
              >
                <div className="w-10 h-10 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon size={18} className="text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1">
                  {benefit.title}
                </h3>
                <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          🚀 Prêt à vendre sur AgroAfrica ?
        </h3>
        <p className="text-sm text-[var(--text-primary)]/80 mb-4 max-w-md mx-auto">
          Rejoignez des milliers de vendeurs et commencez à vendre aujourd'hui.
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

export default Tarifs