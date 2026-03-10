import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { PalmaresPages } from './pages/PalmaresPages'; // On appelle ta page

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path='/' element={<Navigate to="/" replace />} />
          <Route path='/palmares' element={<PalmaresPages />} />
      </Routes>
    </div>
  );
}

export default App;