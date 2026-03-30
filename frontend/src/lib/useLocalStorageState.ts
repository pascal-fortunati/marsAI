import { useEffect, useState } from "react";

export function useLocalStorageState<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === "undefined") return initialValue;

        try {
            const stored = window.localStorage.getItem(key);
            return stored ? (JSON.parse(stored) as T) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Ignore les erreurs d'écriture dans localStorage
        }
    }, [key, value]);

    return [value, setValue] as const;
}