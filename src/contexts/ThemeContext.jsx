import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

// ✅ Constantes
const STORAGE_KEY = 'agro-theme'
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

// ✅ Types (si vous utilisez TypeScript, décommentez)
// type Theme = typeof THEMES[keyof typeof THEMES]
// type ThemeContextType = {
//   theme: Theme
//   toggleTheme: () => void
//   setTheme: (theme: Theme) => void
//   isDark: boolean
//   isLight: boolean
// }

// ✅ Fonction pour récupérer le thème initial
const getInitialTheme = (): 'light' | 'dark' => {
  // 1. Vérifier si nous sommes dans un navigateur
  if (typeof window === 'undefined') return 'light'

  // 2. Récupérer le thème sauvegardé
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved

  // 3. Vérifier la préférence système
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  // 4. Thème par défaut
  return 'light'
}

// ✅ Écouter les changements de thème système
const subscribeToSystemTheme = (callback: (theme: 'light' | 'dark') => void) => {
  if (typeof window === 'undefined') return () => {}

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light')
  }
  
  // ✅ Support des anciens navigateurs
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  } else {
    // Fallback pour Safari < 14
    mediaQuery.addListener(handler)
    return () => mediaQuery.removeListener(handler)
  }
}

// ✅ Création du contexte avec une valeur par défaut
const ThemeContext = createContext({
  theme: 'light' as 'light' | 'dark',
  toggleTheme: () => {},
  setTheme: (_theme: 'light' | 'dark') => {},
  isDark: false,
  isLight: true,
})

export const ThemeProvider = ({ 
  children, 
  defaultTheme = 'light',
  enableSystem = true,
}) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>(defaultTheme)
  const [isMounted, setIsMounted] = useState(false)

  // ✅ Initialisation du thème
  useEffect(() => {
    const initialTheme = getInitialTheme()
    setThemeState(initialTheme)
    setIsMounted(true)
  }, [])

  // ✅ Écouter les changements système (optionnel)
  useEffect(() => {
    if (!enableSystem || !isMounted) return

    const unsubscribe = subscribeToSystemTheme((systemTheme) => {
      // ✅ Ne changer que si l'utilisateur n'a pas de préférence sauvegardée
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) {
        setThemeState(systemTheme)
      }
    })

    return unsubscribe
  }, [enableSystem, isMounted])

  // ✅ Appliquer le thème au DOM
  useEffect(() => {
    if (!isMounted) return

    const root = document.documentElement
    
    // ✅ Ajouter la classe 'dark' pour Tailwind
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // ✅ Attribut data-theme pour les variables CSS
    root.setAttribute('data-theme', theme)
    
    // ✅ Sauvegarder
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme, isMounted])

  // ✅ Définir un thème spécifique
  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme)
  }, [])

  // ✅ Basculer entre les thèmes
  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  // ✅ Valeurs mémorisées
  const value = useMemo(() => ({
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  }), [theme, toggleTheme, setTheme])

  // ✅ Éviter les flashs de thème
  if (!isMounted) {
    return (
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// ✅ Hook personnalisé avec meilleur message d'erreur
export const useTheme = () => {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error(
      '⚠️ useTheme doit être utilisé à l\'intérieur d\'un ThemeProvider.\n' +
      'Assurez-vous que votre composant est bien enveloppé dans <ThemeProvider>.'
    )
  }
  
  return context
}

// ✅ Utilitaires supplémentaires
export const useThemeClass = (lightClass = '', darkClass = '') => {
  const { theme } = useTheme()
  return theme === 'dark' ? darkClass : lightClass
}

// ✅ Composant pour basculer le thème (prêt à l'emploi)
export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 ${className}`}
      style={{
        backgroundColor: isDark ? '#40916C' : '#D4A373',
      }}
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      role="switch"
      aria-checked={isDark}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isDark ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      <span className="sr-only">
        {isDark ? 'Mode sombre' : 'Mode clair'}
      </span>
    </button>
  )
}

export default ThemeProvider

