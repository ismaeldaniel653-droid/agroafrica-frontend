import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Truck, MapPin, Clock, Package, 
  CheckCircle, Globe, ChevronRight, Phone,
  Mail, Shield, AlertCircle
} from 'lucide-react'

// ✅ Configuration des pays
const COUNTRIES = [
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', time: '24-48h' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', time: '48-72h' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', time: '48-72h' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', time: '48-72h' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', time: '48-72h' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', time: '72-96h' },
  { code: 'ET', name: 'Éthiopie', flag: '🇪🇹', time: '72-96h' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', time: '48-72h' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', time: '48-72h' },
]

// ✅ Méthodes de livraison
const DELIVERY_METHODS = [
  {
    icon: Truck,
    title: 'Standard',
    description: 'Livraison classique en 48-96h',
    price: 'À partir de 1 500 FCFA',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  },
  {
    icon: Package,
    title: 'Express',
    description: 'Livraison rapide en 24h',
    price: 'À partir de 3 500 FCFA',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
  },
  {
    icon: Clock,
    title: 'Économique',
    description: 'Livraison économique en 5-7 jours',
    price: 'À partir de 1 000 FCFA',
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
  },
]

// ✅ Avantages
const BENEFITS = [
  {
    icon: Shield,
    title: 'Colis assuré',
    description: 'Chaque colis est assuré jusqu\'à 50 000 FCFA'
  },
  {
    icon: MapPin,
    title: 'Suivi en temps réel',
    description: 'Suivez votre colis à chaque étape'
  },
  {
    icon: Phone,
    title: 'Support 24/7',
    description: 'Une équipe dédiée pour vous accompagner'
  },
]

function Livraison({ 
  className = '',
  showMethods = true,
  showCountries = true,
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">🚚</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 rounded-full p-2">
              <Truck size={28} className="text-[var(--text-primary)]" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              🚚 Livraison rapide
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Livraison <span className="text-[var(--bg-card)]">AgroAfrica</span>
          </h1>
          <p className="text-[var(--text-primary)]/80 text-sm sm:text-base max-w-lg">
            Informations sur la livraison dans <strong>28 pays africains</strong>. 
            Offerts à partir de 25 000 FCFA.
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { value: '28', label: 'Pays couverts', icon: Globe },
          { value: '24-48h', label: 'Délai moyen', icon: Clock },
          { value: '100%', label: 'Colis livrés', icon: CheckCircle },
          { value: '4.9', label: 'Satisfaction', icon: Shield },
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
            <Package size={20} className="text-[var(--accent-primary)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              Livraison dans toute l'Afrique
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              AgroAfrica livre dans <strong className="text-[var(--text-primary)]">28 pays africains</strong>. 
              Les frais de livraison varient selon le pays, le poids et le mode de livraison choisi. 
              La livraison est <strong className="text-[var(--accent-secondary)]">offerte à partir de 25 000 FCFA</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Méthodes de livraison */}
      {showMethods && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Truck size={20} className="text-[var(--accent-secondary)]" />
            Nos modes de livraison
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DELIVERY_METHODS.map((method, index) => {
              const Icon = method.icon
              return (
                <div 
                  key={index} 
                  className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 hover:shadow-md transition"
                >
                  <div className={`inline-flex p-2 rounded-xl ${method.color} mb-2`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                    {method.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {method.description}
                  </p>
                  <p className="text-xs font-semibold text-[var(--accent-secondary)] mt-2">
                    {method.price}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Pays */}
      {showCountries && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-[var(--accent-secondary)]" />
            Pays couverts
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {COUNTRIES.map((country) => (
              <div 
                key={country.code} 
                className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-3 flex items-center gap-2 hover:shadow-md transition"
              >
                <span className="text-lg">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                    {country.name}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)]">{country.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avantages */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Shield size={20} className="text-[var(--accent-secondary)]" />
          Pourquoi choisir AgroAfrica ?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div 
                key={index} 
                className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 text-center hover:shadow-md transition"
              >
                <div className="w-10 h-10 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon size={18} className="text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
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

      {/* Contact */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-5 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center">
              <Mail size={18} className="text-[var(--accent-primary)]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                Une question sur la livraison ?
              </p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                Notre équipe est là pour vous aider
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

export default Livraison