import { useEffect, useState, useCallback, useRef, Children } from 'react'
import { useLocation } from 'react-router-dom'

// ✅ Constantes pour les durées d'animation
const EXIT_DURATION = 150
const ENTER_DURATION = 300

function PageTransition({ 
  children, 
  className = '',
  exitDuration = EXIT_DURATION,
  enterDuration = ENTER_DURATION,
  onTransitionStart,
  onTransitionEnd,
  reducedMotion: forceReducedMotion = null,
}) {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState('enter')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)
  const timerRef = useRef(null)
  const containerRef = useRef(null)

  // ✅ Détection de la réduction de mouvement
  useEffect(() => {
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
    // ✅ Nettoyer l'ancien timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (reducedMotion) {
      setDisplayChildren(children)
      setTransitionStage('enter')
      return
    }

    // ✅ Déclencher la transition de sortie
    setTransitionStage('exit')
    
    if (onTransitionStart) {
      onTransitionStart()
    }

    timerRef.current = setTimeout(() => {
      setDisplayChildren(children)
      setTransitionStage('enter')
      
      if (onTransitionEnd) {
        onTransitionEnd()
      }
      timerRef.current = null
    }, exitDuration)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [location.pathname, children, reducedMotion, exitDuration, onTransitionStart, onTransitionEnd])

  // ✅ Marquer le premier render
  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  // ✅ Gestion du focus pour l'accessibilité
  useEffect(() => {
    if (transitionStage === 'enter' && !isFirstRender && containerRef.current) {
      containerRef.current.focus({ preventScroll: true })
    }
  }, [transitionStage, isFirstRender])

  // ✅ Vérification du contenu
  const hasChildren = Children.count(children) > 0

  if (!hasChildren) return null

  // ✅ Construction des classes
  const getTransitionClasses = () => {
    const baseClasses = `transition-all duration-${enterDuration} ease-in-out ${className}`
    
    if (reducedMotion) {
      return 'opacity-100'
    }
    
    const stageClass = transitionStage === 'enter' 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-2'
    
    return `${baseClasses} ${stageClass}`
  }

  return (
    <div 
      ref={containerRef}
      className={getTransitionClasses()}
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

// ✅ Version avec transition en fondu
export const FadePageTransition = ({ children, ...props }) => (
  <PageTransition 
    {...props}
    className="fade-transition"
  >
    {children}
  </PageTransition>
)

// ✅ Version avec transition par glissement
export const SlidePageTransition = ({ children, ...props }) => (
  <PageTransition 
    {...props}
    className="slide-transition"
  >
    {children}
  </PageTransition>
)

// ✅ Version avec transition par zoom
export const ZoomPageTransition = ({ children, ...props }) => (
  <PageTransition 
    {...props}
    className="zoom-transition"
    exitDuration={200}
  >
    {children}
  </PageTransition>
)

export default PageTransition