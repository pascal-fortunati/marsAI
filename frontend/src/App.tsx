import SubmitPage from "./pages/SubmitPage";
import { Navigate, Route, Routes } from "react-router-dom";
import { MarsBackground } from "./components/MarsBackground";

function App() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <MarsBackground />
      <Routes>
        <Route path="/" element={<Navigate to="/submit" />} />
        <Route path="/submit" element={<SubmitPage />} />
      </Routes>
    </main>
  );
}

export default App;
