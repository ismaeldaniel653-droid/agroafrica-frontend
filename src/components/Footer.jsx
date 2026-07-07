import { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Mail, CheckCircle, Send, Leaf } from 'lucide-react'

// ✅ Icônes réseaux sociaux optimisées
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
  </svg>
)

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

// ✅ Données structurées
const SOCIAL_LINKS = [
  { href: 'https://facebook.com', icon: FacebookIcon, label: 'Facebook', color: '#1877F2' },
  { href: 'https://instagram.com', icon: InstagramIcon, label: 'Instagram', color: '#FD1D1D' },
  { href: 'https://twitter.com', icon: TwitterIcon, label: 'Twitter', color: '#1DA1F2' },
  { href: 'https://youtube.com', icon: YouTubeIcon, label: 'YouTube', color: '#FF0000' },
]

const PAYMENT_METHODS = [
  { label: 'MTN MoMo', emoji: '📱', color: '#FFCC00' },
  { label: 'Orange Money', emoji: '📱', color: '#FF6600' },
  { label: 'Wave', emoji: '🌊', color: '#1BA672' },
  { label: 'Visa', emoji: '💳', color: '#1A1F71' },
  { label: 'PayPal', emoji: '💸', color: '#003087' },
  { label: 'Crypto', emoji: '₿', color: '#F7931A' },
]

const QUICK_LINKS = {
  acheter: [
    { to: '/', label: 'Tous les produits', icon: '🛍️' },
    { to: '/livreurs', label: 'Livraison communautaire', icon: '🚚' },
    { to: '/certification', label: 'Certification Blockchain', icon: '🔗' },
    { to: '/pay', label: 'AgroAfrica Pay', icon: '💳' },
  ],
  vendre: [
    { to: '/devenir-vendeur', label: 'Devenir vendeur', icon: '🤝' },
    { to: '/guide-vendeur', label: 'Guide vendeur', icon: '📖' },
    { to: '/dashboard', label: 'Tableau de bord', icon: '📊' },
    { to: '/certification', label: 'Certification', icon: '🏅' },
    { to: '/tarifs', label: 'Tarifs', icon: '💰' },
  ],
  aide: [
    { to: '/service-client', label: 'Service client', icon: '💬' },
    { to: '/livraison', label: 'Livraison', icon: '📦' },
    { to: '/retours', label: 'Retours', icon: '↩️' },
    { to: '/paiement-mobile-money', label: 'Paiement Mobile Money', icon: '📱' },
    { to: '/a-propos', label: 'À propos', icon: 'ℹ️' },
  ],
}

function Footer({ updatedAt = 'Janvier 2025' }) {
  const currentYear = new Date().getFullYear()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSent, setNewsletterSent] = useState(false)
  const [newsletterError, setNewsletterError] = useState('')

  // ✅ Gestion de la newsletter
  const handleNewsletter = useCallback((e) => {
    e.preventDefault()
    setNewsletterError('')
    
    const email = newsletterEmail.trim()
    if (!email) {
      setNewsletterError('Veuillez entrer votre email.')
      return
    }
    if (!email.includes('@') || !email.includes('.')) {
      setNewsletterError('Email invalide. Vérifiez le format.')
      return
    }
    
    setNewsletterSent(true)
    setTimeout(() => {
      setNewsletterSent(false)
      setNewsletterEmail('')
    }, 3000)
  }, [newsletterEmail])

  // ✅ Retour en haut
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <footer
      className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] pt-10 md:pt-12 pb-6"
      style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      role="contentinfo"
      aria-label="Pied de page"
    >
      <div className="max-w-[1300px] mx-auto px-4 md:px-5">
        {/* GRID PRINCIPALE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* COLONNE 1 : Logo + Description + Réseaux sociaux */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 text-center md:text-left">
            <div className="text-2xl font-extrabold text-[var(--text-primary)] mb-4 flex items-center justify-center md:justify-start gap-2">
              <Leaf size={24} className="text-[var(--accent-secondary)]" />
              <span>
                Agro<span className="text-[var(--accent-secondary)]">Africa</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-[260px] md:max-w-[220px] mx-auto md:mx-0 mb-4">
              Le premier grand marché africain de produits agricoles et artisanaux. 
              Du producteur à l'acheteur, en toute transparence.
            </p>

            {/* Réseaux sociaux */}
            <div className="flex gap-2 justify-center md:justify-start">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[var(--bg-card)]/10 hover:scale-110 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                    style={{ hover: { backgroundColor: social.color } }}
                    aria-label={social.label}
                    title={social.label}
                  >
                    <Icon />
                  </a>
                )
              })}
            </div>
          </div>

          {/* COLONNE 2 : Acheter */}
          <div className="text-center sm:text-left">
            <h4 className="text-[var(--text-primary)] text-sm font-bold mb-4 flex items-center justify-center sm:justify-start gap-2">
              <span className="w-1 h-4 bg-[var(--accent-secondary)] rounded-full" />
              Acheter
            </h4>
            <ul className="space-y-2.5 text-xs">
              {QUICK_LINKS.acheter.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="block hover:text-[var(--accent-secondary)] hover:translate-x-1 transition-all duration-200"
                  >
                    <span className="mr-2">{link.icon}</span>{link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLONNE 3 : Vendre */}
          <div className="text-center sm:text-left">
            <h4 className="text-[var(--text-primary)] text-sm font-bold mb-4 flex items-center justify-center sm:justify-start gap-2">
              <span className="w-1 h-4 bg-[var(--accent-secondary)] rounded-full" />
              Vendre
            </h4>
            <ul className="space-y-2.5 text-xs">
              {QUICK_LINKS.vendre.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="block hover:text-[var(--accent-secondary)] hover:translate-x-1 transition-all duration-200"
                  >
                    <span className="mr-2">{link.icon}</span>{link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLONNE 4 : Aide */}
          <div className="text-center sm:text-left">
            <h4 className="text-[var(--text-primary)] text-sm font-bold mb-4 flex items-center justify-center sm:justify-start gap-2">
              <span className="w-1 h-4 bg-[var(--accent-secondary)] rounded-full" />
              Aide
            </h4>
            <ul className="space-y-2.5 text-xs">
              {QUICK_LINKS.aide.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="block hover:text-[var(--accent-secondary)] hover:translate-x-1 transition-all duration-200"
                  >
                    <span className="mr-2">{link.icon}</span>{link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="border-t border-[var(--border-color)]/80 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center px-2">
            <h4 className="text-[var(--text-primary)] font-bold mb-2 flex items-center justify-center gap-2">
              <Mail size={16} /> Restez informé
            </h4>
            <p className="text-xs text-[var(--text-secondary)]/70 mb-4">
              Recevez nos offres exclusives et actualités
            </p>

            {newsletterSent ? (
              <div className="flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg px-4 py-3 animate-fade-in">
                <CheckCircle size={16} />
                <span className="text-sm font-medium">Merci ! Vous êtes inscrit 🎉</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="flex-1 bg-[var(--bg-card)]/10 border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/40 outline-none focus:border-[var(--accent-secondary)] transition min-w-0"
                  aria-label="Adresse email"
                />
                <button
                  type="submit"
                  className="bg-[var(--accent-secondary)] hover:bg-amber-500 text-[var(--text-primary)] font-bold px-4 py-2.5 rounded-lg text-sm transition-all hover:scale-105 flex items-center justify-center gap-1 whitespace-nowrap"
                >
                  <Send size={14} />
                  S'inscrire
                </button>
              </form>
            )}
            {newsletterError && (
              <p className="text-red-500 text-xs mt-2">{newsletterError}</p>
            )}
          </div>
        </div>

        {/* MOYENS DE PAIEMENT */}
        <div className="border-t border-[var(--border-color)]/80 pt-6 mb-6">
          <p className="text-center text-xs text-[var(--text-secondary)]/60 mb-4">
            Moyens de paiement acceptés
          </p>
          <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.label}
                className="flex items-center justify-center gap-1.5 bg-[var(--bg-card)]/10 border border-[var(--border-color)] rounded-lg px-2.5 py-2 text-[11px] sm:text-xs text-[var(--text-primary)] font-medium hover:bg-[var(--bg-card)]/20 transition cursor-pointer"
                title={method.label}
              >
                <span>{method.emoji}</span>
                <span className="truncate">{method.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BAS DE PAGE */}
        <div className="border-t border-[var(--border-color)]/80 pt-6">
          <div className="text-center mb-4">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)]/60 hover:text-[var(--accent-secondary)] transition"
              aria-label="Retour en haut de page"
            >
              <ArrowUp size={14} />
              Retour en haut
            </button>
          </div>

          <p className="text-center text-xs mb-2">
            © {currentYear} <span className="text-[var(--accent-secondary)] font-semibold">AgroAfrica</span> 
            {' — '}Fait avec <span className="text-red-500" aria-hidden="true">❤️</span> au Cameroun 🇨🇲
          </p>

          <p className="text-center text-[10px] text-[var(--text-secondary)]/40 mb-2">
            Dernière mise à jour : {updatedAt}
          </p>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[var(--text-secondary)]/50 text-xs">
            <a href="#" className="hover:text-[var(--text-primary)] transition">Mentions légales</a>
            <span className="hidden sm:inline">·</span>
            <a href="#" className="hover:text-[var(--text-primary)] transition">Confidentialité</a>
            <span className="hidden sm:inline">·</span>
            <a href="#" className="hover:text-[var(--text-primary)] transition">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer