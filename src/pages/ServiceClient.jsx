import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Headphones, Phone, Mail, MessageCircle, 
  Clock, CheckCircle, Shield, ChevronRight, 
  HelpCircle, FileText, MessageSquare, Sparkles
} from 'lucide-react'

// ✅ Canaux de contact
const CONTACT_CHANNELS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    description: 'Réponse sous 5 minutes',
    color: 'bg-[#25D366]',
    textColor: 'text-white',
    link: 'https://wa.me/237699000000?text=Bonjour%20AgroAfrica%20%F0%9F%8C%BF'
  },
  {
    icon: Mail,
    label: 'Email',
    description: 'Réponse sous 24h',
    color: 'bg-blue-500',
    textColor: 'text-white',
    link: 'mailto:support@agroafrica.com'
  },
  {
    icon: Phone,
    label: 'Téléphone',
    description: 'Du lundi au samedi, 8h-20h',
    color: 'bg-emerald-500',
    textColor: 'text-white',
    link: 'tel:+237699000000'
  },
]

// ✅ FAQ
const FAQ = [
  {
    question: 'Comment suivre ma commande ?',
    answer: 'Connectez-vous à votre compte, allez dans "Mes commandes" et cliquez sur le numéro de commande pour voir le suivi en temps réel.'
  },
  {
    question: 'Comment retourner un produit ?',
    answer: 'Vous avez 14 jours après réception pour retourner un produit. Contactez-nous pour initier le retour.'
  },
  {
    question: 'Les paiements sont-ils sécurisés ?',
    answer: 'Oui, tous les paiements sont sécurisés via Mobile Money avec chiffrement SSL.'
  },
  {
    question: 'Comment devenir vendeur ?',
    answer: 'Rendez-vous sur la page "Devenir vendeur" et remplissez le formulaire d\'inscription.'
  },
]

// ✅ Horaires
const HOURS = [
  { day: 'Lundi - Vendredi', hours: '08:00 - 20:00' },
  { day: 'Samedi', hours: '09:00 - 18:00' },
  { day: 'Dimanche', hours: 'Fermé' },
]

function ServiceClient({ 
  className = '',
  showFAQ = true,
  showHours = true,
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">🎧</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 rounded-full p-2">
              <Headphones size={28} className="text-[var(--accent-secondary)]" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              🕐 Disponible 24h/24
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Service <span className="text-[var(--accent-secondary)]">client</span>
          </h1>
          <p className="text-[var(--text-light)]/80 text-sm sm:text-base max-w-lg">
            Nous sommes là pour vous aider. Une question ? Un problème ? Contactez-nous.
          </p>
        </div>
      </div>

      {/* Canaux de contact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {CONTACT_CHANNELS.map((channel, index) => {
          const Icon = channel.icon
          return (
            <a
              key={index}
              href={channel.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${channel.color} rounded-2xl p-4 text-center hover:scale-105 transition-transform duration-300 shadow-md`}
            >
              <Icon size={28} className={`mx-auto mb-2 ${channel.textColor}`} />
              <h3 className={`text-sm font-bold ${channel.textColor}`}>{channel.label}</h3>
              <p className={`text-xs ${channel.textColor}/80`}>{channel.description}</p>
            </a>
          )
        })}
      </div>

      {/* Horaires */}
      {showHours && (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-5 mb-6">
          <h2 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <Clock size={18} className="text-[var(--accent-secondary)]" />
            Horaires d'ouverture
          </h2>
          <div className="space-y-2">
            {HOURS.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-1.5 border-b border-[var(--border-color)] last:border-0">
                <span className="text-sm text-[var(--text-secondary)]">{item.day}</span>
                <span className={`text-sm font-semibold ${item.hours === 'Fermé' ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>
                  {item.hours}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {showFAQ && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <HelpCircle size={20} className="text-[var(--accent-secondary)]" />
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {FAQ.map((item, index) => (
              <div key={index} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 hover:shadow-md transition">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare size={14} className="text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                      {item.question}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Support supplémentaire */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-5 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center">
              <FileText size={18} className="text-[var(--accent-primary)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Centre d'aide
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Consultez nos guides et tutoriels
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/guide-vendeur')}
            className="text-sm text-[var(--accent-primary)] font-semibold hover:underline flex items-center gap-1"
          >
            Voir le guide <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Badges de confiance */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-[var(--text-secondary)]/60">
        <span className="flex items-center gap-1">
          <Shield size={12} /> Support 24/7
        </span>
        <span className="text-[var(--border-color)]">|</span>
        <span className="flex items-center gap-1">
          <CheckCircle size={12} /> Réponse garantie
        </span>
        <span className="text-[var(--border-color)]">|</span>
        <span className="flex items-center gap-1">
          <Sparkles size={12} /> Satisfaction client
        </span>
      </div>
    </div>
  )
}

export default ServiceClient