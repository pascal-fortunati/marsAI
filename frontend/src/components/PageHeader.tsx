import { marsaiColors, marsaiGradients, withAlpha } from "../theme/marsai";

type PageHeaderSize = "md" | "lg" | "xl";

const titleCls: Record<PageHeaderSize, string> = {
  md: "text-3xl md:text-4xl",
  lg: "text-4xl md:text-5xl",
  xl: "text-6xl md:text-7xl",
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  color = marsaiColors.primary,
  size = "md",
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  color?: string;
  size?: PageHeaderSize;
}) {
  return (
    <div style={{ animation: "fadeUp 0.5s ease-out 0.1s both" }}>
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ background: color }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ background: color }}
          />
        </span>
        <span
          className="f-mono text-[10px] uppercase tracking-[0.25em]"
          style={{ color }}
        >
          {eyebrow}
        </span>
      </div>
      <h1 className={`f-orb font-black text-white ${titleCls[size]}`}>
        {title}
      </h1>
      {subtitle ? (
        <p className="f-mono mt-2 text-sm text-white/35">{subtitle}</p>
      ) : null}
      <div
        className="mt-6 h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${withAlpha(
            color,
            0.6
          )}, transparent)`,
        }}
      />
    </div>
  );
}

export function AccentTitle({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="bg-clip-text text-transparent"
      style={{
        backgroundImage: marsaiGradients.primaryToAccent,
        backgroundSize: "200% auto",
        animation: "shimText 3s linear infinite",
      }}
    >
      {children}
    </span>
  );
}
