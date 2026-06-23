import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function PageTransition({ children }) {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState('enter')
  const [reducedMotion, setReducedMotion] = useState(false)   // ✅ NOUVEAU

  // ✅ NOUVEAU : respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      // ✅ NOUVEAU : si l'utilisateur préfère réduire, on switch directement sans animation
      setDisplayChildren(children)
      setTransitionStage('enter')
      return
    }
    setTransitionStage('exit')
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setTransitionStage('enter')
    }, 150)
    return () => clearTimeout(timer)
  }, [location.pathname, children, reducedMotion])

  return (
    <div className={reducedMotion
      // ✅ NOUVEAU : pas de transform si prefers-reduced-motion
      ? 'transition-opacity duration-150 opacity-100'
      : `transition-all duration-300 ease-in-out ${
          transitionStage === 'enter' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
    >
      {displayChildren}
    </div>
  )
}

export default PageTransition
