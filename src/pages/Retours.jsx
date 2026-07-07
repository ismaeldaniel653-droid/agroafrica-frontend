import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Undo2, Clock, CheckCircle, AlertCircle, 
  Package, Truck, Phone, Mail, ChevronRight,
  Shield, Calendar, FileText, Sparkles
} from 'lucide-react'

// ✅ Étapes de retour
const STEPS = [
  {
    icon: FileText,
    label: '1. Déclarez votre retour',
    description: 'Contactez notre service client avec votre numéro de commande',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  },
  {
    icon: Package,
    label: '2. Préparez le colis',
    description: 'Remettez le produit dans son emballage d\'origine',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
  },
  {
    icon: Truck,
    label: '3. Expédiez',
    description: 'Envoyez le colis à l\'adresse indiquée par notre équipe',
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
  },
  {
    icon: CheckCircle,
    label: '4. Remboursement',
    description: 'Sous 48h après réception du colis',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  },
]

// ✅ Conditions
const CONDITIONS = [
  {
    icon: Clock,
    title: 'Délai de 14 jours',
    description: 'Vous avez 14 jours après réception pour retourner un produit'
  },
  {
    icon: Shield,
    title: 'État d\'origine',
    description: 'Les produits doivent être dans leur état d\'origine, non utilisés'
  },
  {
    icon: Package,
    title: 'Emballage d\'origine',
    description: 'Retournez le produit dans son emballage d\'origine'
  },
  {
    icon: AlertCircle,
    title: 'Exceptions',
    description: 'Certains produits (alimentaires, personnalisés) ne sont pas éligibles'
  },
]

function Retours({ 
  className = '',
  showSteps = true,
  showConditions = true,
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">↩️</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 rounded-full p-2">
              <Undo2 size={28} className="text-[var(--accent-secondary)]" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              🔄 Satisfaction garantie
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Retours <span className="text-[var(--accent-secondary)]">& Remboursements</span>
          </h1>
          <p className="text-[var(--text-light)]/80 text-sm sm:text-base max-w-lg">
            Politique de retour et remboursement pour vos achats sur AgroAfrica.
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { value: '14', label: 'Jours pour retourner', icon: Clock },
          { value: '48h', label: 'Remboursement rapide', icon: CheckCircle },
          { value: '100%', label: 'Satisfaction garantie', icon: Shield },
          { value: '24/7', label: 'Service client', icon: Phone },
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
              Notre politique de retour
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Chez AgroAfrica, votre satisfaction est notre priorité. Vous disposez de 
              <strong className="text-[var(--text-primary)]"> 14 jours</strong> après réception 
              de votre commande pour retourner un produit. Les articles doivent être 
              <strong className="text-[var(--text-primary)]"> dans leur état d'origine</strong>, 
              non utilisés et dans leur emballage d'origine.
            </p>
          </div>
        </div>
      </div>

      {/* Conditions */}
      {showConditions && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Shield size={20} className="text-[var(--accent-secondary)]" />
            Conditions de retour
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CONDITIONS.map((condition, index) => {
              const Icon = condition.icon
              return (
                <div 
                  key={index} 
                  className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 hover:shadow-md transition"
                >
                  <div className={`inline-flex p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] mb-2`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                    {condition.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {condition.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Étapes */}
      {showSteps && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-[var(--accent-secondary)]" />
            Comment retourner un produit ?
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
                  <div className={`inline-flex p-2 rounded-xl ${step.color} mb-2`}>
                    <Icon size={18} />
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

      {/* Exceptions */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle size={18} className="text-amber-700 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-1">
              ⚠️ Exceptions
            </h3>
            <ul className="text-xs text-amber-700/80 dark:text-amber-300/80 space-y-1">
              <li>• Les produits alimentaires périssables ne sont pas éligibles au retour</li>
              <li>• Les articles personnalisés ou sur mesure ne peuvent pas être retournés</li>
              <li>• Les produits d'hygiène (cosmétiques, etc.) doivent être scellés</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center">
              <Phone size={18} className="text-[var(--accent-primary)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Besoin d'aide pour un retour ?
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Notre équipe est disponible 24h/24
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/service-client')}
            className="text-sm text-[var(--accent-primary)] font-semibold hover:underline flex items-center gap-1"
          >
            Contacter le service client <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Retours