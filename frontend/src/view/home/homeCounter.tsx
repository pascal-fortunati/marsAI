import { useEffect, useState } from 'react';
import { TimeLeft } from "./homeTypes";
import { FESTIVAL_CLOSE_DATE } from './homeHelpers';

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

