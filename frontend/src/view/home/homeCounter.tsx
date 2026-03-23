import { useEffect, useState } from 'react';
import { TimeLeft } from "./homeTypes";
import { pad } from './homeHelpers';

// Recalcule le temps restant avant la fin du festival
export function useCountdown(targetDate: Date): TimeLeft {
    const calc = (): TimeLeft => {
        const diff = Math.max(0, targetDate.getTime() - Date.now());
        return {
            jours: Math.floor(diff / 86_400_000),
            heures: Math.floor((diff % 86_400_000) / 3_600_000),
            min: Math.floor((diff % 3_600_000) / 60_000),
            sec: Math.floor((diff % 60_000) / 1000),
        };
    };

    const [time, setTime] = useState<TimeLeft>(calc());

    useEffect(() => {
        const id = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    return time;
}

// Bloc individuel du compteur de temps
export function TimeBlock({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className="w-full rounded-xl px-3 py-3 text-center"
                style={{
                    border: "1px solid rgba(125,113,251,.35)",
                    background: "rgba(12, 8, 30, .78)",
                    boxShadow: "inset 0 0 12px rgba(125,113,251,.14)",
                }}
            >
                <span
                    key={value}
                    className="f-orb text-4xl font-black tabular-nums leading-none inline-block"
                    style={{
                        color: "rgba(255,255,255,.92)",
                        animation: "flipNum 0.25s ease-out",
                    }}
                >
                    {pad(value)}
                </span>
            </div>
            <span className="f-mono text-[8px] tracking-[0.2rem] uppercase text-white/35">
                {label}
            </span>
        </div>
    );
}
