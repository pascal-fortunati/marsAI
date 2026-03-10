import { useEffect, useMemo, useState } from "react";
import { getParts } from "./homeHelpers";
import type { CParts } from "./homeTypes";

// Composant de bloc de compteur avec affichage animé de la valeur
function CountBlock({ val, label }: { val: number; label: string }) {
  const str = String(val).padStart(2, "0");
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5 sm:gap-2">
      <div
        className="relative flex h-14 w-14 flex-col items-center justify-center overflow-hidden rounded-lg sm:h-16 sm:w-16 sm:rounded-xl md:h-20 md:w-20"
        style={{
          background:
            "linear-gradient(160deg, rgba(125,113,251,0.15) 0%, rgba(5,3,13,0.9) 100%)",
          border: "1px solid rgba(125,113,251,0.3)",
          boxShadow:
            "0 0 20px rgba(125,113,251,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7d71fb]/80 to-transparent" />
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/4" />
        <div className="absolute left-1 top-0 flex h-full flex-col justify-around py-1.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-1.5 w-1 rounded-sm bg-white/8" />
          ))}
        </div>
        <div className="absolute right-1 top-0 flex h-full flex-col justify-around py-1.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-1.5 w-1 rounded-sm bg-white/8" />
          ))}
        </div>
        <span
          key={str}
          className="f-orb text-2xl font-black text-white sm:text-3xl"
          style={{ animation: "flipNum 0.25s ease-out" }}
        >
          {str}
        </span>
      </div>
      <span className="f-mono text-[8px] uppercase tracking-[0.16em] text-white/35 sm:text-[9px] sm:tracking-[0.25em]">
        {label}
      </span>
    </div>
  );
}

// Composant de compteur de temps jusqu'à une date cible
export function Countdown({
  targetIso,
  labels,
}: {
  targetIso: string;
  labels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    closed: string;
  };
}) {
  const ms = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [parts, setParts] = useState<CParts>(() => getParts(ms));
  useEffect(() => {
    const id = setInterval(() => setParts(getParts(ms)), 1000);
    return () => clearInterval(id);
  }, [ms]);
  if (Number.isNaN(ms)) return null;
  if (parts.done)
    return (
      <p className="f-mono text-sm uppercase tracking-widest text-[#ff5c35]">
        {labels.closed}
      </p>
    );
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:flex sm:items-end sm:gap-2">
      <CountBlock val={parts.days} label={labels.days} />
      <span className="f-orb mb-7 hidden text-2xl font-black text-white/20 sm:block">
        :
      </span>
      <CountBlock val={parts.hours} label={labels.hours} />
      <span className="f-orb mb-7 hidden text-2xl font-black text-white/20 sm:block">
        :
      </span>
      <CountBlock val={parts.minutes} label={labels.minutes} />
      <span className="f-orb mb-7 hidden text-2xl font-black text-white/20 sm:block">
        :
      </span>
      <CountBlock val={parts.seconds} label={labels.seconds} />
    </div>
  );
}

// Composant de compteur animé avec affichage de la valeur localeisée
export function AnimCounter({
  to,
  suffix = "",
  locale,
}: {
  to: number;
  suffix?: string;
  locale: string;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = Math.ceil(to / 50);
    const id = setInterval(() => {
      cur = Math.min(cur + step, to);
      setV(cur);
      if (cur >= to) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [to]);
  return (
    <>
      {v.toLocaleString(locale)}
      {suffix}
    </>
  );
}
