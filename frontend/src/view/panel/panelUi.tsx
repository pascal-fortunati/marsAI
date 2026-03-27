import { marsaiGradients, withAlpha } from "../../theme/marsai";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

// Type représentant les propriétés d'un bouton dans le panneau
type PanelButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
  small?: boolean;
  className?: string;
};

// Composant représentant un tag dans le panneau
export function Tag({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <Badge
      variant="outline"
      className="f-mono inline-flex rounded-md px-2.5 py-1 text-xs font-semibold"
      style={{
        color,
        background: withAlpha(color, 0.1),
        border: `1px solid ${withAlpha(color, 0.2)}`,
      }}
    >
      {children}
    </Badge>
  );
}

// Composant représentant un bouton primaire dans le panneau
export function PrimaryBtn({
  children,
  disabled,
  onClick,
  small,
  className,
}: PanelButtonProps) {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "cursor-pointer f-mono rounded-xl font-semibold text-white hover:opacity-90",
        small ? "h-9 px-4 text-sm" : "h-11 px-5 text-sm",
        className,
      )}
      style={{ background: marsaiGradients.primary }}
    >
      {children}
    </Button>
  );
}

// Composant représentant un bouton secondaire dans le panneau
export function GhostBtn({
  children,
  disabled,
  onClick,
  small,
  className,
}: PanelButtonProps) {
  return (
    <Button
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "f-mono rounded-xl border-[color:var(--panel-ghost-border)] bg-[color:var(--panel-ghost-bg)] font-medium text-[color:var(--panel-ghost-text)] hover:border-[color:var(--panel-ghost-border-hover)] hover:bg-[color:var(--panel-ghost-bg-hover)] hover:text-[color:var(--panel-ghost-text-hover)]",
        small ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
        className,
      )}
    >
      {children}
    </Button>
  );
}

// Composant utilitaire à mettre en dehors de FilmsTab (ou dans panelUi.tsx)
export function InfoBlock({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value?: string | null;
  multiline?: boolean;
}) {
  const display = String(value || "").trim() || "—";
  return (
    <div className="rounded-lg border border-white/8 bg-white/3 px-3 py-2.5">
      <p className="f-mono text-[11px] text-white/40 mb-1">{label}</p>
      <p
        className={`f-mono text-sm text-white/85 break-all ${multiline ? "whitespace-pre-wrap" : "truncate"}`}
      >
        {display}
      </p>
    </div>
  );
}
