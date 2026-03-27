import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import './lib/i18n'
import App from './App.tsx'
import { resolveInitialTheme, applyTheme } from './theme/theme'

applyTheme(resolveInitialTheme())

// Composant principal de l'application
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
