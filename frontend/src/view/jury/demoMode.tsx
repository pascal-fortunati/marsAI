import React from "react";
import { setStoredToken } from "../../lib/api";
import { DEMO_TOKEN } from "../../components/NavBarStateContext";

/**
 * ===== PATCH DEMO: START - Remove entire file to disable demo mode =====
 * Composant temporaire pour activer le mode démo (à supprimer facilement).
 * ===== PATCH DEMO: END =====
 */
export const DemoModeLink: React.FC = () => {
  const handleDemoMode = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setStoredToken(DEMO_TOKEN);
    window.location.reload();
  };

  return (
    <a
      href="#"
      onClick={handleDemoMode}
      style={{
        display: "block",
        marginTop: "-1.5rem",
        marginBottom: "1.5rem",
        textAlign: "center",
        color: "#888",
        fontSize: "0.95em",
        textDecoration: "underline",
        cursor: "pointer",
      }}
      data-testid="demo-mode-link"
    >
      Mode démo (bypass auth)
    </a>
  );
};
