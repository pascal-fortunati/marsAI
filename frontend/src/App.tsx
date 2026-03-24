import { Route, Routes, Navigate } from 'react-router-dom'
import { CataloguePage } from './pages/CataloguePage';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

function AppContent() {
  return (
    <>
      <ThemeToggle />
      <Routes>
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/" element={<Navigate to="/catalogue" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
