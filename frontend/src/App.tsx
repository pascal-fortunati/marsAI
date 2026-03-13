import { Navigate, Route, Routes } from "react-router-dom";
import { JuryPage } from "./pages/JuryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/jury" replace />} />
      <Route path="/jury" element={<JuryPage />} />
      <Route path="*" element={<Navigate to="/jury" replace />} />
    </Routes>
  );
}

export default App;
