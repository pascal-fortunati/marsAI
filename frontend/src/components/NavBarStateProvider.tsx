import { useMemo, useState } from "react";
import type {
  NavBarJuryConfig,
  NavBarPanelConfig,
  NavBarState,
} from "./NavBarStateContext";
import { NavBarStateCtx } from "./NavBarStateContext";

export function NavBarStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [panel, setPanel] = useState<NavBarPanelConfig | null>(null);
  const [jury, setJury] = useState<NavBarJuryConfig | null>(null);
  const [isJuryLoading, setIsJuryLoading] = useState(false);

  const value = useMemo<NavBarState>(
    () => ({ panel, jury, setPanel, setJury, isJuryLoading, setIsJuryLoading }),
    [panel, jury, isJuryLoading],
  );
  return (
    <NavBarStateCtx.Provider value={value}>{children}</NavBarStateCtx.Provider>
  );
}
