import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Mail, CheckCircle, Send } from 'lucide-react'

// ✅ NOUVEAU : icônes SVG inline pour remplacer Font Awesome (non chargé)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/></svg>
)
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
)

function Footer() {
  const currentYear = new Date().getFullYear()
  const updatedAt = 'Janvier 2025'

  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSent, setNewsletterSent] = useState(false)

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (!newsletterEmail.includes('@')) return
    setNewsletterSent(true)
    setTimeout(() => {
      setNewsletterSent(false)
      setNewsletterEmail('')
    }, 3000)
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer
      className="bg-[#0D1F2D] text-white/60 pt-10 md:pt-12 pb-6"
      style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="max-w-[1300px] mx-auto px-4 md:px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* BRAND */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 text-center md:text-left">
            <div className="text-2xl font-extrabold text-white mb-4 flex items-center justify-center md:justify-start gap-2">
              <span className="text-3xl">🌿</span>
              <span>
                Agro<span className="text-amber-400">Africa</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-[260px] md:max-w-[220px] mx-auto md:mx-0 mb-4">
              Le premier grand marché africain de produits agricoles et artisanaux. Du producteur à l'acheteur,
              en toute transparence.
            </p>

            <div className="flex gap-2 justify-center md:justify-start">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#1877F2] hover:scale-110 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                title="Facebook"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-gradient-to-tr hover:from-[#FD1D1D] hover:to-[#405DE6] hover:scale-110 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                title="Instagram"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#1DA1F2] hover:scale-110 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                title="Twitter / X"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#FF0000] hover:scale-110 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                title="YouTube"
                aria-label="YouTube"
              >
                <YouTubeIcon />
              </a>
            </div>
          </div>

          {/* ACHETER */}
          <div className="text-center sm:text-left">
            <h4 className="text-white text-sm font-bold mb-4 flex items-center justify-center sm:justify-start gap-2">
              <span className="w-1 h-4 bg-amber-400 rounded-full"></span>
              Acheter
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="block hover:text-[#7EDCB5] transition">
                  <i className="fas fa-store mr-2"></i>Tous les produits
                </Link>
              </li>
              <li>
                <Link to="/livreurs" className="block hover:text-[#7EDCB5] transition">
                  <i className="fas fa-truck mr-2"></i>Livraison communautaire
                </Link>
              </li>
              <li>
                <Link to="/certification" className="block hover:text-[#7EDCB5] transition">
                  <i className="fas fa-certificate mr-2"></i>Certification Blockchain
                </Link>
              </li>
              <li>
                <Link to="/pay" className="block hover:text-[#7EDCB5] transition">
                  <i className="fas fa-wallet mr-2"></i>AgroAfrica Pay
                </Link>
              </li>
            </ul>
          </div>

          {/* VENDRE */}
          <div className="text-center sm:text-left">
            <h4 className="text-white text-sm font-bold mb-4 flex items-center justify-center sm:justify-start gap-2">
              <span className="w-1 h-4 bg-amber-400 rounded-full"></span>
              Vendre
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/devenir-vendeur"
                  className="block hover:text-amber-400 hover:translate-x-1 transition-all duration-200"
                >
                  <i className="fas fa-user-plus mr-2"></i>Devenir vendeur
                </Link>
              </li>
              <li>
                <Link
                  to="/guide-vendeur"
                  className="block hover:text-amber-400 hover:translate-x-1 transition-all duration-200"
                >
                  <i className="fas fa-book mr-2"></i>Guide vendeur
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="block hover:text-amber-400 hover:translate-x-1 transition-all duration-200"
                >
                  <i className="fas fa-chart-line mr-2"></i>Tableau de bord
                </Link>
              </li>
              <li>
                <Link
                  to="/certification"
                  className="block hover:text-amber-400 hover:translate-x-1 transition-all duration-200"
                >
                  <i className="fas fa-award mr-2"></i>Certification
                </Link>
              </li>
              <li>
                <Link
                  to="/tarifs"
                  className="block hover:text-amber-400 hover:translate-x-1 transition-all duration-200"
                >
                  <i className="fas fa-tag mr-2"></i>Tarifs
                </Link>
              </li>
            </ul>
          </div>

          {/* AIDE */}
          <div className="text-center sm:text-left">
            <h4 className="text-white text-sm font-bold mb-4 flex items-center justify-center sm:justify-start gap-2">
              <span className="w-1 h-4 bg-amber-400 rounded-full"></span>
              Aide
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/service-client"
                  className="block hover:text-amber-400 hover:translate-x-1 transition-all duration-200"
                >
                  <i className="fas fa-headset mr-2"></i>Service client
                </Link>
              </li>
              <li>
                <Link
                  to="/livraison"
                  className="block hover:text-amber-400 hover:translate-x-1 transition-all duration-200"
                >
                  <i className="fas fa-shipping-fast mr-2"></i>Livraison
                </Link>
              </li>
              <li>
                <Link
                  to="/retours"
                  className="block hover:text-amber-400 hover:translate-x-1 transition-all duration-200"
                >
                  <i className="fas fa-undo mr-2"></i>Retours
                </Link>
              </li>
              <li>
                <Link
                  to="/paiement-mobile-money"
                  className="block hover:text-amber-400 hover:translate-x-1 transition-all duration-200"
                >
                  <i className="fas fa-mobile-alt mr-2"></i>Paiement Mobile Money
                </Link>
              </li>
              <li>
                <Link
                  to="/a-propos"
                  className="block hover:text-amber-400 hover:translate-x-1 transition-all duration-200"
                >
                  <i className="fas fa-info-circle mr-2"></i>À propos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center px-2">
            <h4 className="text-white font-bold mb-2 flex items-center justify-center gap-2">
              <Mail size={16} /> Restez informé
            </h4>
            <p className="text-xs text-white/50 mb-4">Recevez nos offres exclusives et actualités</p>

            {newsletterSent ? (
              <div className="flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-300 rounded-lg px-4 py-3 animate-fade-in">
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
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-amber-400 transition min-w-0"
                />
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 text-[#0D1F2D] font-bold px-4 py-2.5 rounded-lg text-sm transition-all hover:scale-105 flex items-center justify-center gap-1 whitespace-nowrap"
                >
                  <Send size={14} />
                  S'inscrire
                </button>
              </form>
            )}
          </div>
        </div>

        {/* PAIEMENTS */}
        <div className="border-t border-white/10 pt-6 mb-6">
          <p className="text-center text-xs text-white/40 mb-4">Moyens de paiement acceptés</p>
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 justify-center max-w-md mx-auto">
            {[
              { label: 'MTN MoMo', color: '#FFCC00', icon: 'fa-mtn' },
              { label: 'Orange Money', color: '#FF6600', icon: 'fa-orange' },
              { label: 'Wave', color: '#1BA672', icon: 'fa-water' },
              { label: 'Visa', color: '#1A1F71', icon: 'fa-cc-visa' },
              { label: 'PayPal', color: '#003087', icon: 'fa-cc-paypal' },
              { label: 'Crypto', color: '#F7931A', icon: 'fa-bitcoin' },
            ].map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-[11px] sm:text-xs text-white font-medium hover:bg-white/10 transition cursor-pointer"
                title={p.label}
              >
                <i className={`fab ${p.icon}`} style={{ color: p.color }}></i>
                <span className="truncate">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 pt-6">
          <div className="text-center mb-4">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-amber-400 transition"
              aria-label="Retour en haut de page"
            >
              <ArrowUp size={14} />
              Retour en haut
            </button>
          </div>

          <p className="text-center text-xs mb-2">
            © {currentYear}{' '}
            <span className="text-amber-400 font-semibold">AgroAfrica</span>{' '}— Fait avec{' '}
            <i className="fas fa-leaf text-green-500"></i> au Cameroun 🇨🇲
          </p>

          <p className="text-center text-[10px] text-white/30 mb-2">Dernière mise à jour : {updatedAt}</p>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-white/40 text-xs">
            <a href="#" className="hover:text-white transition">
              Mentions légales
            </a>
            <span className="hidden sm:inline">·</span>
            <a href="#" className="hover:text-white transition">
              Confidentialité
            </a>
            <span className="hidden sm:inline">·</span>
            <a href="#" className="hover:text-white transition">
              CGU
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

