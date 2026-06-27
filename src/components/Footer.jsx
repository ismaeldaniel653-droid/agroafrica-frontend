import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Mail, CheckCircle, Send } from 'lucide-react'

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
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-gradient-to-tr hover:from-[#FD1D1D] hover:to-[#405DE6] hover:scale-110 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                title="Instagram"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#1DA1F2] hover:scale-110 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                title="Twitter / X"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#FF0000] hover:scale-110 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                title="YouTube"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
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

