import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Phone, ShieldCheck, Smartphone, 
  CheckCircle, Clock, AlertCircle, ChevronRight,
  Sparkles, Lock, Wallet, Users
} from 'lucide-react'

// ✅ Configuration des services Mobile Money
const SERVICES = [
  {
    id: 'mtn',
    name: 'MTN MoMo',
    color: '#FFCC00',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    icon: '📱',
    countries: ['Cameroun', 'Nigeria', 'Ghana', 'Côte d\'Ivoire']
  },
  {
    id: 'orange',
    name: 'Orange Money',
    color: '#FF6600',
    bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-700 dark:text-orange-400',
    icon: '📱',
    countries: ['Cameroun', 'Sénégal', 'Côte d\'Ivoire', 'Mali']
  },
  {
    id: 'wave',
    name: 'Wave',
    color: '#1BA672',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    icon: '🌊',
    countries: ['Sénégal', 'Côte d\'Ivoire', 'Burkina Faso', 'Mali']
  },
]

// ✅ Étapes du paiement
const STEPS = [
  {
    icon: Smartphone,
    label: 'Choisissez votre service',
    description: 'MTN MoMo, Orange Money ou Wave'
  },
  {
    icon: Phone,
    label: 'Renseignez votre numéro',
    description: 'Le numéro associé à votre compte Mobile Money'
  },
  {
    icon: CheckCircle,
    label: 'Validez la transaction',
    description: 'Confirmez sur votre téléphone'
  },
  {
    icon: Clock,
    label: 'Suivez le statut',
    description: 'Consultez la page de suivi du paiement'
  },
]

function PaiementMobileMoney({ 
  className = '',
  showServices = true,
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
      <div className="relative bg-gradient-to-br from-[var(--bg-nav)] to-[var(--bg-nav)]/90 rounded-3xl p-6 sm:p-8 text-[var(--text-light)] mb-6 overflow-hidden border border-[var(--border-color)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">📱</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 rounded-full p-2">
              <Wallet size={28} className="text-[var(--accent-secondary)]" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              💳 Paiement sécurisé
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 flex items-center gap-2">
            Paiement <span className="text-[var(--accent-secondary)]">Mobile Money</span>
          </h1>
          <p className="text-[var(--text-light)]/80 text-sm sm:text-base max-w-lg">
            Instructions pour payer avec <strong>MTN MoMo</strong>, <strong>Orange Money</strong> ou <strong>Wave</strong>.
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { value: '3', label: 'Services disponibles', icon: Smartphone },
          { value: '8', label: 'Pays couverts', icon: Users },
          { value: '100%', label: 'Transactions sécurisées', icon: ShieldCheck },
          { value: '24/7', label: 'Support client', icon: Phone },
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

      {/* Services disponibles */}
      {showServices && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Smartphone size={20} className="text-[var(--accent-secondary)]" />
            Services disponibles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SERVICES.map((service) => (
              <div 
                key={service.id} 
                className={`${service.bg} border rounded-2xl p-4 text-center hover:shadow-md transition`}
              >
                <div className="text-3xl mb-2">{service.icon}</div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  {service.name}
                </h3>
                <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                  {service.countries.join(' · ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Étapes */}
      {showSteps && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-[var(--accent-secondary)]" />
            Comment payer ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <div 
                  key={index} 
                  className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 relative hover:shadow-md transition"
                >
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--accent-primary)] text-[var(--text-light)] rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center mb-2">
                    <Icon size={18} className="text-[var(--accent-primary)]" />
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

      {/* Bonnes pratiques */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 mb-6">
        <h2 className="font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2 text-sm sm:text-base">
          <ShieldCheck size={18} className="text-[var(--accent-secondary)]" />
          Bonnes pratiques
        </h2>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--accent-primary)] mt-0.5">•</span>
            Utilisez un numéro actif et à votre nom
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--accent-primary)] mt-0.5">•</span>
            Vérifiez le montant avant validation
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--accent-primary)] mt-0.5">•</span>
            En cas d'échec, réessayez depuis Checkout
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--accent-primary)] mt-0.5">•</span>
            Conservez le numéro de transaction pour le suivi
          </li>
        </ul>
      </div>

      {/* Aide */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <Phone size={18} className="text-amber-700 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="font-bold text-amber-800 dark:text-amber-400 mb-1 flex items-center gap-2 text-sm sm:text-base">
              <AlertCircle size={18} className="text-amber-700 dark:text-amber-400" />
              Besoin d'aide ?
            </h2>
            <p className="text-sm text-amber-700/80 dark:text-amber-300/80">
              Pour assistance, contactez notre service client (WhatsApp) ou passez par la section Aide.
            </p>
            <button 
              onClick={() => navigate('/service-client')}
              className="mt-2 text-sm text-amber-700 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
            >
              Contacter le service client <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Badge sécurité */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--text-secondary)]/60">
        <Lock size={12} />
        <span>Transactions sécurisées</span>
        <span>·</span>
        <span>🔒 Chiffrement SSL</span>
        <span>·</span>
        <span>🛡️ Protection des données</span>
      </div>
    </div>
  )
}

export default PaiementMobileMoney