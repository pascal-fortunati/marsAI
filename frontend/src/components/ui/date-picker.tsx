import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    placeholder?: string;
    className?: string;
    triggerStyle?: React.CSSProperties;
}

type MenuType = "month" | "year" | null;

type DayCell = {
    date: number;
    fullDate: Date;
    isCurrentMonth: boolean;
};

// Libellés statiques utilisés par le calendrier.
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const WEEK_DAYS = ["lu", "ma", "me", "je", "ve", "sa", "di"];
const YEARS = Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => new Date().getFullYear() - i);

// Styles inline partagés pour conserver une apparence homogène.
const styles = {
    panel: {
        background: "rgba(5, 3, 13, 0.95)",
        border: "1px solid rgba(125, 113, 251, 0.35)",
        borderRadius: "20px",
        padding: "20px 24px",
    } satisfies React.CSSProperties,
    pickerBtn: {
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(125, 113, 251, 0.25)",
        color: "rgb(255, 255, 255)",
        padding: "8px 12px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "13px",
        fontFamily: "'Share Tech Mono', monospace",
        fontWeight: "500",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
    } satisfies React.CSSProperties,
    menu: {
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        overflowY: "auto",
        background: "rgba(12, 9, 28, 0.98)",
        border: "1px solid rgba(125, 113, 251, 0.25)",
        borderRadius: "14px",
        zIndex: 90,
        padding: "6px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)",
    } satisfies React.CSSProperties,
    option: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 10px",
        borderRadius: "10px",
        border: "none",
        color: "rgba(255, 255, 255, 0.92)",
        fontSize: "13px",
        fontFamily: "'Share Tech Mono', monospace",
        cursor: "pointer",
        textAlign: "left",
    } satisfies React.CSSProperties,
};

// Convertit une date JS en format ISO simplifié yyyy-mm-dd.
const toYmd = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

// Formate une date au format français dd/mm/yyyy pour l'affichage.
const formatFr = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}/${d.getFullYear()}`;
};

// Construit les 42 cellules (6 semaines) affichées dans la grille du calendrier.
const buildDays = (currentMonth: Date): DayCell[] => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const start = firstDay.getDay();

    const cells: DayCell[] = [];

    // 1) Complète le début de grille avec les jours du mois précédent.
    for (let i = 0; i < start; i++) {
        const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -i);
        cells.unshift({ date: prev.getDate(), fullDate: new Date(prev.getFullYear(), prev.getMonth(), prev.getDate()), isCurrentMonth: false });
    }

    // 2) Ajoute tous les jours du mois courant.
    for (let day = 1; day <= lastDay.getDate(); day++) {
        cells.push({ date: day, fullDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day), isCurrentMonth: true });
    }

    // 3) Complète la fin de grille avec les premiers jours du mois suivant.
    for (let day = 1; cells.length < 42; day++) {
        cells.push({ date: day, fullDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day), isCurrentMonth: false });
    }

    return cells;
};

function SelectorMenu<T extends string | number>({
    open,
    label,
    items,
    isActive,
    onToggle,
    onSelect,
    minWidth,
    width,
    maxHeight,
}: {
    open: boolean;
    label: string;
    items: T[];
    isActive: (item: T, index: number) => boolean;
    onToggle: () => void;
    onSelect: (item: T, index: number) => void;
    minWidth: string;
    width: string;
    maxHeight: string;
}) {
    return (
        <div className="relative">
            {/* Bouton qui ouvre/ferme le menu de sélection (mois ou année). */}
            <button type="button" onClick={onToggle} style={{ ...styles.pickerBtn, minWidth }}>
                {label}
                <ChevronRight size={14} style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .15s ease" }} />
            </button>

            {open && (
                // Liste déroulante des options disponibles.
                <div className="date-picker-year-scroll" style={{ ...styles.menu, width, maxHeight }}>
                    {items.map((item, index) => {
                        const active = isActive(item, index);
                        return (
                            <button
                                key={`${item}`}
                                type="button"
                                onClick={() => onSelect(item, index)}
                                style={{ ...styles.option, background: active ? "rgba(125, 113, 251, 0.18)" : "transparent" }}
                            >
                                <span style={{ width: "16px", display: "inline-flex", justifyContent: "center", opacity: active ? 1 : 0 }}>
                                    <Check size={14} />
                                </span>
                                {item}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function DatePicker({ value, onChange, placeholder = "> Sélectionnez une date", className = "submit-input", triggerStyle }: DatePickerProps) {
    // État global du popover, état du menu actif (mois/année) et ref du header.
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState<MenuType>(null);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    // Initialisation du mois affiché: date sélectionnée si présente, sinon aujourd'hui.
    const [currentMonth, setCurrentMonth] = useState(() => {
        if (!value) return new Date();
        const selected = new Date(value);
        return new Date(selected.getFullYear(), selected.getMonth(), 1);
    });

    // Données dérivées pour l'affichage de la grille et des libellés.
    const days = useMemo(() => buildDays(currentMonth), [currentMonth]);
    const selectedDate = value ? new Date(value) : null;
    const selectedDateString = selectedDate ? formatFr(selectedDate) : "";
    const monthIndex = currentMonth.getMonth();
    const monthLabel = MONTHS[monthIndex];
    const year = currentMonth.getFullYear();

    // Ferme les menus (mois/année) lors d'un clic à l'extérieur de l'en-tête.
    useEffect(() => {
        const onMouseDown = (event: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
                setMenuOpen(null);
            }
        };
        document.addEventListener("mousedown", onMouseDown);
        return () => document.removeEventListener("mousedown", onMouseDown);
    }, []);

    return (
        // Conteneur principal du sélecteur de date.
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {/* Champ déclencheur affichant la date sélectionnée ou le placeholder. */}
                <button className={className} style={{ textAlign: "left", ...triggerStyle }} onClick={() => setOpen(true)}>
                    {value ? formatFr(value) : placeholder}
                </button>
            </PopoverTrigger>

            <PopoverContent className="w-fit" align="start" style={styles.panel}>
                <div style={{ minWidth: "280px" }}>
                    {/* Barre de navigation: mois précédent/suivant + menus mois/année. */}
                    <div className="flex items-center justify-between gap-3 mb-4" ref={wrapRef}>
                        <button
                            onClick={() => setCurrentMonth(new Date(year, monthIndex - 1, 1))}
                            className="p-1.5 hover:opacity-70 transition-opacity flex-shrink-0"
                            style={{ color: "rgba(255, 255, 255, 0.6)" }}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex gap-3 flex-1 justify-center">
                            {/* Sélecteur de mois. */}
                            <SelectorMenu
                                open={menuOpen === "month"}
                                label={monthLabel}
                                items={MONTHS}
                                isActive={(_, index) => index === monthIndex}
                                onToggle={() => setMenuOpen(menuOpen === "month" ? null : "month")}
                                onSelect={(_, index) => {
                                    setCurrentMonth(new Date(year, index, 1));
                                    setMenuOpen(null);
                                }}
                                minWidth="120px"
                                width="180px"
                                maxHeight="220px"
                            />

                            {/* Sélecteur d'année. */}
                            <SelectorMenu
                                open={menuOpen === "year"}
                                label={`${year}`}
                                items={YEARS}
                                isActive={(item) => item === year}
                                onToggle={() => setMenuOpen(menuOpen === "year" ? null : "year")}
                                onSelect={(item) => {
                                    setCurrentMonth(new Date(item, monthIndex, 1));
                                    setMenuOpen(null);
                                }}
                                minWidth="100px"
                                width="160px"
                                maxHeight="360px"
                            />
                        </div>

                        <button
                            onClick={() => setCurrentMonth(new Date(year, monthIndex + 1, 1))}
                            className="p-1.5 hover:opacity-70 transition-opacity flex-shrink-0"
                            style={{ color: "rgba(255, 255, 255, 0.6)" }}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Titre du mois courant affiché au centre. */}
                    <div className="text-center font-semibold mb-4" style={{ fontSize: "14px", color: "rgb(255, 255, 255)", textTransform: "capitalize", letterSpacing: "0.5px" }}>
                        {monthLabel} {year}
                    </div>

                    {/* Séparateur visuel entre navigation et grille. */}
                    <div style={{ height: "1px", background: "rgba(125, 113, 251, 0.2)", margin: "0 0 16px 0" }} />

                    {/* En-têtes des jours de la semaine. */}
                    <div className="grid grid-cols-7 gap-2 text-center mb-3" style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "11px", fontFamily: "'Share Tech Mono', monospace", fontWeight: "500" }}>
                        {WEEK_DAYS.map((day) => (
                            <div key={day} className="flex items-center justify-center h-6">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grille des jours (mois précédent/courant/suivant). */}
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day, index) => {
                            // Détermine si la cellule correspond à la date actuellement sélectionnée.
                            const isSelected =
                                !!selectedDate &&
                                day.fullDate.getDate() === selectedDate.getDate() &&
                                day.fullDate.getMonth() === selectedDate.getMonth() &&
                                day.fullDate.getFullYear() === selectedDate.getFullYear();

                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        // N'autorise la sélection que sur les jours du mois courant.
                                        if (!day.isCurrentMonth) return;
                                        // Remonte la date au parent puis ferme le calendrier.
                                        onChange(toYmd(day.fullDate));
                                        setOpen(false);
                                    }}
                                    className="w-8 h-8 text-sm transition-colors flex items-center justify-center"
                                    style={{
                                        color: day.isCurrentMonth ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.2)",
                                        background: isSelected ? "rgba(125, 113, 251, 0.3)" : "transparent",
                                        border: isSelected ? "1px solid rgba(125, 113, 251, 0.5)" : "none",
                                        borderRadius: "6px",
                                        cursor: day.isCurrentMonth ? "pointer" : "default",
                                        opacity: day.isCurrentMonth ? 1 : 0.35,
                                        fontFamily: "'Share Tech Mono', monospace",
                                        fontSize: "13px",
                                        fontWeight: "500",
                                    }}
                                    disabled={!day.isCurrentMonth}
                                >
                                    {day.date}
                                </button>
                            );
                        })}
                    </div>

                    {/* Rappel textuel de la date choisie en bas du composant. */}
                    {selectedDate && (
                        <div className="text-center mt-4 pt-3" style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "12px", fontFamily: "'Share Tech Mono', monospace", borderTop: "1px solid rgba(125, 113, 251, 0.15)" }}>
                            {selectedDateString}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
