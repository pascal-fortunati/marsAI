import { Navigate, Route, Routes} from 'react-router-dom'
import { JuryPage } from './pages/JuryPage'

function App() {
  return (
    <Routes>
      <Route path="/jury" element={<JuryPage />} />
    </Routes>
  );
}

export default App;
