import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { apiUrl, consumeTokenFromUrlHash } from './lib/api'
import { MarsBackground } from './components/MarsBackground'
import { NavBar } from './components/NavBar'
import { NavBarStateProvider } from './components/NavBarStateProvider'
import { HomePage } from './pages/HomePage'


// Composant principal de l'application
function App() {
  useEffect(() => {
    consumeTokenFromUrlHash()
    const onHashChange = () => consumeTokenFromUrlHash()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <NavBarStateProvider>
      <div className="min-h-full relative">
        <MarsBackground />
        <div className="relative z-10 min-h-full">
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </NavBarStateProvider>
  )
}

export default App
