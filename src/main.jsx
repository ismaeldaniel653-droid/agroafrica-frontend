import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './index.css'
import App from './App'

// ✅ NOUVEAU : thème couleur du navigateur (barre d'adresse mobile — Android Chrome notamment)
const applyThemeColor = () => {
  const meta = document.createElement('meta')
  meta.name = 'theme-color'
  meta.content = '#0C6B4E'  // vert AgroAfrica (boutons, navbar)
  document.head.appendChild(meta)
}
applyThemeColor()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ NOUVEAU : Provider Redux pour accéder à user/photo partout */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)
