import { Navigate, Route, Routes } from "react-router-dom";
import { JuryPage } from "./pages/JuryPage";
import SkeletonPage from "./pages/SkeletonPage";
import SkeletonLightPage from "./pages/SkeletonLightPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/jury" replace />} />
      <Route path="/jury" element={<JuryPage />} />
      <Route path="/skeleton" element={<SkeletonPage />} />
      <Route path="/skeletonclair" element={<SkeletonLightPage />} />
      <Route path="*" element={<Navigate to="/jury" replace />} />
    </Routes>
  );
}

export default App;
