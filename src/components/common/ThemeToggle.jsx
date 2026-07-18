import { useTheme } from '../../contexts/ThemeContext'  
import { Sun, Moon } from 'lucide-react'  
  
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()  
  
  return (  
    <button  
      type="button"  
      onClick={toggleTheme}  
      className="p-1.5 rounded-lg transition-colors hover:bg-white/20 text-white"  
      aria-label="Basculer le theme"  
      title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}  
    >  
      {theme === 'light' ? (  
        <Moon className="w-5 h-5" />  
      ) : (  
        <Sun className="w-5 h-5 text-yellow-400" />  
      )}  
    </button>  
  )  
}  
  
export default ThemeToggle 
