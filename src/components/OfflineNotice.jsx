import { useEffect, useState, useCallback, useMemo, Children } from 'react'
import { useLocation } from 'react-router-dom'

// ✅ Constantes pour les durées d'animation
const ANIMATION_DURATION = 300
const EXIT_DURATION = 150

function PageTransition({ 
  children, 
  className = '', 
  enterClass = 'opacity-100 translate-y-0',
  exitClass = 'opacity-0 translate-y-2',
  duration = ANIMATION_DURATION,
  exitDuration = EXIT_DURATION,
  onTransitionStart,
  onTransitionEnd,
  reducedMotion: forceReducedMotion = null, // ✅ Permet de forcer le mode sans animation
}) {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState('enter')
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  // ✅ Détection de la réduction de mouvement
  useEffect(() => {
    // Si une valeur est forcée, l'utiliser
    if (forceReducedMotion !== null) {
      setReducedMotion(forceReducedMotion)
      return
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    
    const onChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [forceReducedMotion])

  // ✅ Gestion du changement de page
  useEffect(() => {
    // ✅ Si mode réduit, on switch sans animation
    if (reducedMotion) {
      setDisplayChildren(children)
      setTransitionStage('enter')
      return
    }

    // ✅ Déclencher la transition de sortie
    setTransitionStage('exit')
    
    // ✅ Callback de début de transition
    if (onTransitionStart) {
      onTransitionStart()
    }

    // ✅ Attendre la sortie avant de changer le contenu
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setTransitionStage('enter')
      
      // ✅ Callback de fin de transition
      if (onTransitionEnd) {
        onTransitionEnd()
      }
    }, exitDuration)

    return () => clearTimeout(timer)
  }, [location.pathname, children, reducedMotion, exitDuration, onTransitionStart, onTransitionEnd])

  // ✅ Marquer le premier render
  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  // ✅ Construction des classes CSS avec useMemo
  const transitionClasses = useMemo(() => {
    if (reducedMotion) {
      return 'transition-opacity duration-150 opacity-100'
    }

    const baseClasses = `transition-all duration-${duration} ease-in-out ${className}`
    const stageClass = transitionStage === 'enter' ? enterClass : exitClass
    
    return `${baseClasses} ${stageClass}`
  }, [reducedMotion, duration, className, transitionStage, enterClass, exitClass])

  // ✅ Vérification du contenu
  const hasChildren = useMemo(() => {
    return Children.count(children) > 0
  }, [children])

  // ✅ Gestion du focus pour l'accessibilité
  useEffect(() => {
    if (transitionStage === 'enter' && !isFirstRender) {
      // ✅ Focus sur le conteneur pour l'accessibilité
      const container = document.getElementById('page-transition-container')
      if (container && !reducedMotion) {
        container.focus({ preventScroll: true })
      }
    }
  }, [transitionStage, isFirstRender, reducedMotion])

  // ✅ Si pas d'enfants, ne rien afficher
  if (!hasChildren) {
    return null
  }

  return (
    <div 
      id="page-transition-container"
      className={transitionClasses}
      role="group"
      aria-live="polite"
      aria-label="Contenu de la page"
      tabIndex={-1}
      data-transition-state={transitionStage}
      data-reduced-motion={reducedMotion}
    >
      {displayChildren}
    </div>
  )
}

// ✅ Version avec animations plus dynamiques (optionnelle)
export const SlidePageTransition = ({ children, ...props }) => (
  <PageTransition 
    {...props}
    enterClass="opacity-100 translate-y-0"
    exitClass="opacity-0 translate-y-8"
  >
    {children}
  </PageTransition>
)

export const FadePageTransition = ({ children, ...props }) => (
  <PageTransition 
    {...props}
    enterClass="opacity-100"
    exitClass="opacity-0"
  >
    {children}
  </PageTransition>
)

export default PageTransition