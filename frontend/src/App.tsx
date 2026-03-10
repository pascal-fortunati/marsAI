import { Route, Routes, Navigate } from 'react-router-dom'
import { CataloguePage } from './pages/CataloguePage';

function App() {
  return (
    <Routes>
      <Route path="/catalogue" element={<CataloguePage />} />
      <Route path="/" element={<Navigate to="/catalogue" replace />} />
    </Routes>
  );
}

export default App;
