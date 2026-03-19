import { useEffect, useState } from 'react';
import { TimeLeft } from "./homeTypes";
import { FESTIVAL_CLOSE_DATE, pad } from './homeHelpers';

// Recalcule le temps restant avant la fin du festival
export function useCountdown(): TimeLeft {
    const calc = (): TimeLeft => {
        const diff = Math.max(0, FESTIVAL_CLOSE_DATE.getTime() - Date.now());
        return {
            jours: Math.floor(diff / 86_400_000),
            heures: Math.floor((diff % 86_400_000) / 3_600_000),
            min: Math.floor((diff % 3_600_000) / 60_000),
            sec: Math.floor((diff % 60_000) / 1000),
        };
    };

    const [time, setTime] = useState<TimeLeft>(calc);

    useEffect(() => {
        const id = setInterval(() => setTime(calc), 1000);
        return () => clearInterval(id);
    }, []);

    return time;
}

// Bloc individuel du compteur de temps
export function TimeBlock({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="f-orb text-3xl md:text-4xl font-black tabular-nums" style={{ color: "var(--col-vi" }}>
                {pad(value)}
            </span>
            <span className="f-mono text-[8px] tracking-widest uppercase text-white/30">
                {label}
            </span>
        </div>
    )
}
