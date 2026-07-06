import { useTheme } from '../../contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-200 bg-[#F0F5ED]/60 hover:bg-[#F0F5ED] dark:bg-[#1A2E24]/60 dark:hover:bg-[#1A2E24] border border-[#D8E2D8] dark:border-[#2A3D32]"
      aria-label="Basculer le thème"
      title="Mode clair/sombre"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-[#1A3A2A]" />
      ) : (
        <Sun className="w-5 h-5 text-[#E6A86E]" />
      )}
    </button>
  )
}

export default ThemeToggle

