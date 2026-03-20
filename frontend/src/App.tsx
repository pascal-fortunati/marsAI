import SubmitPage from "./pages/SubmitPage";
import HomeView from "./view/home/HomeView";
import { MarsBackground } from "./components/MarsBackground";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <MarsBackground />
      <div className="relative z-10 w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomeView />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
