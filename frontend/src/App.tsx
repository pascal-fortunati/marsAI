import { Navigate, Route, Routes } from 'react-router-dom'
import { PalmaresPages } from './pages/PalmaresPages';

function App() {
  return (
    <div className="App">
      <Routes>
          {/* Correction : On redirige de / vers /palmares */}
          <Route path='/' element={<Navigate to="/palmares" replace />} />
          
          {/* La route qui affiche vraiment ta page */}
          <Route path='/palmares' element={<PalmaresPages />} />
          
          {/* Optionnel : Une route "404" au cas où l'utilisateur tape n'importe quoi */}
          <Route path="*" element={<Navigate to="/palmares" replace />} />
      </Routes>
    </div>
  );
}

export default App;