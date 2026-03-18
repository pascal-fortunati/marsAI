import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    placeholder?: string;
    className?: string;
    triggerStyle?: React.CSSProperties;
}

export function DatePicker({
    value,
    onChange,
    placeholder = "> Sélectionnez une date",
    className = "submit-input",
    triggerStyle,
}: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const [monthMenuOpen, setMonthMenuOpen] = useState(false);
    const [yearMenuOpen, setYearMenuOpen] = useState(false);
    const monthMenuRef = useRef<HTMLDivElement | null>(null);
    const yearMenuRef = useRef<HTMLDivElement | null>(null);
    const [currentMonth, setCurrentMonth] = useState(() => {
        if (value) {
            const date = new Date(value);
            return new Date(date.getFullYear(), date.getMonth(), 1);
        }
        return new Date();
    });

    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const month = monthNames[currentMonth.getMonth()];
    const year = currentMonth.getFullYear();
    const years = Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => new Date().getFullYear() - i);

    // Récupérer le premier jour du mois et le nombre de jours
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Créer le tableau des jours
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        const prevDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -i);
        days.unshift({
            date: prevDate.getDate(),
            isCurrentMonth: false,
            fullDate: new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate()),
        });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            date: i,
            isCurrentMonth: true,
            fullDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
        });
    }
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push({
            date: i,
            isCurrentMonth: false,
            fullDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i),
        });
    }

    const formatDate = (date: Date | string): string => {
        if (!date) return "";
        const d = typeof date === "string" ? new Date(date) : date;
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const toDateKey = (date: Date): string => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const handleDateClick = (day: { fullDate: Date; isCurrentMonth: boolean }) => {
        const dateString = toDateKey(day.fullDate);
        onChange(dateString);
        setOpen(false);
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const selectedDate = value ? new Date(value) : null;
    const selectedDateString = selectedDate ? formatDate(selectedDate) : "";

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (monthMenuRef.current && !monthMenuRef.current.contains(event.target as Node)) {
                setMonthMenuOpen(false);
            }
            if (!yearMenuRef.current) return;
            if (!yearMenuRef.current.contains(event.target as Node)) {
                setYearMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className={className}
                    style={{
                        textAlign: "left",
                        ...triggerStyle,
                    }}
                    onClick={() => setOpen(true)}
                >
                    {selectedDateString || placeholder}
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-fit"
                align="start"
                style={{
                    background: "rgba(5, 3, 13, 0.95)",
                    border: "1px solid rgba(125, 113, 251, 0.35)",
                    borderRadius: "20px",
                    padding: "20px 24px",
                }}
            >
                <div style={{ minWidth: "280px" }}>
                    {/* Header avec navigation et sélecteurs */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <button
                            onClick={handlePrevMonth}
                            className="p-1.5 hover:opacity-70 transition-opacity flex-shrink-0"
                            style={{ color: "rgba(255, 255, 255, 0.6)" }}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex gap-3 flex-1 justify-center">
                            <div ref={monthMenuRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMonthMenuOpen((prev) => !prev);
                                        setYearMenuOpen(false);
                                    }}
                                    style={{
                                        background: "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(125, 113, 251, 0.25)",
                                        color: "rgb(255, 255, 255)",
                                        padding: "8px 12px",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        fontFamily: "'Share Tech Mono', monospace",
                                        fontWeight: "500",
                                        minWidth: "120px",
                                        textAlign: "left",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "8px",
                                    }}
                                >
                                    {month}
                                    <ChevronRight size={14} style={{ transform: monthMenuOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .15s ease" }} />
                                </button>

                                {monthMenuOpen && (
                                    <div
                                        className="date-picker-year-scroll"
                                        style={{
                                            position: "absolute",
                                            top: "calc(100% + 8px)",
                                            left: 0,
                                            width: "180px",
                                            maxHeight: "220px",
                                            overflowY: "auto",
                                            background: "rgba(12, 9, 28, 0.98)",
                                            border: "1px solid rgba(125, 113, 251, 0.25)",
                                            borderRadius: "14px",
                                            zIndex: 90,
                                            padding: "6px",
                                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)",
                                        }}
                                    >
                                        {monthNames.map((m, i) => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => {
                                                    setCurrentMonth(new Date(currentMonth.getFullYear(), i, 1));
                                                    setMonthMenuOpen(false);
                                                }}
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    padding: "8px 10px",
                                                    borderRadius: "10px",
                                                    border: "none",
                                                    background: i === currentMonth.getMonth() ? "rgba(125, 113, 251, 0.18)" : "transparent",
                                                    color: "rgba(255, 255, 255, 0.92)",
                                                    fontSize: "13px",
                                                    fontFamily: "'Share Tech Mono', monospace",
                                                    cursor: "pointer",
                                                    textAlign: "left",
                                                }}
                                            >
                                                <span style={{ width: "16px", display: "inline-flex", justifyContent: "center", opacity: i === currentMonth.getMonth() ? 1 : 0 }}>
                                                    <Check size={14} />
                                                </span>
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div ref={yearMenuRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setYearMenuOpen((prev) => !prev);
                                        setMonthMenuOpen(false);
                                    }}
                                    style={{
                                        background: "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(125, 113, 251, 0.25)",
                                        color: "rgb(255, 255, 255)",
                                        padding: "8px 12px",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        fontFamily: "'Share Tech Mono', monospace",
                                        fontWeight: "500",
                                        minWidth: "100px",
                                        textAlign: "left",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "8px",
                                    }}
                                >
                                    {year}
                                    <ChevronRight size={14} style={{ transform: yearMenuOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .15s ease" }} />
                                </button>

                                {yearMenuOpen && (
                                    <div
                                        className="date-picker-year-scroll"
                                        style={{
                                            position: "absolute",
                                            top: "calc(100% + 8px)",
                                            left: 0,
                                            width: "160px",
                                            maxHeight: "360px",
                                            overflowY: "auto",
                                            background: "rgba(12, 9, 28, 0.98)",
                                            border: "1px solid rgba(125, 113, 251, 0.25)",
                                            borderRadius: "14px",
                                            zIndex: 90,
                                            padding: "6px",
                                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)",
                                        }}
                                    >
                                        {years.map((y) => (
                                            <button
                                                key={y}
                                                type="button"
                                                onClick={() => {
                                                    setCurrentMonth(new Date(y, currentMonth.getMonth(), 1));
                                                    setYearMenuOpen(false);
                                                }}
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    padding: "8px 10px",
                                                    borderRadius: "10px",
                                                    border: "none",
                                                    background: y === year ? "rgba(125, 113, 251, 0.18)" : "transparent",
                                                    color: "rgba(255, 255, 255, 0.92)",
                                                    fontSize: "13px",
                                                    fontFamily: "'Share Tech Mono', monospace",
                                                    cursor: "pointer",
                                                    textAlign: "left",
                                                }}
                                            >
                                                <span style={{ width: "16px", display: "inline-flex", justifyContent: "center", opacity: y === year ? 1 : 0 }}>
                                                    <Check size={14} />
                                                </span>
                                                {y}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleNextMonth}
                            className="p-1.5 hover:opacity-70 transition-opacity flex-shrink-0"
                            style={{ color: "rgba(255, 255, 255, 0.6)" }}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Affichage du mois et année */}
                    <div
                        className="text-center font-semibold mb-4"
                        style={{
                            fontSize: "14px",
                            color: "rgb(255, 255, 255)",
                            textTransform: "capitalize",
                            letterSpacing: "0.5px",
                        }}
                    >
                        {month} {year}
                    </div>

                    {/* Séparation */}
                    <div
                        style={{
                            height: "1px",
                            background: "rgba(125, 113, 251, 0.2)",
                            margin: "0 0 16px 0",
                        }}
                    />

                    {/* Jours de la semaine */}
                    <div
                        className="grid grid-cols-7 gap-2 text-center mb-3"
                        style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "11px", fontFamily: "'Share Tech Mono', monospace", fontWeight: "500" }}
                    >
                        {["lu", "ma", "me", "je", "ve", "sa", "di"].map((day) => (
                            <div key={day} className="flex items-center justify-center h-6">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grille des dates */}
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day, index) => {
                            const isSelected =
                                selectedDate &&
                                day.fullDate.getDate() === selectedDate.getDate() &&
                                day.fullDate.getMonth() === selectedDate.getMonth() &&
                                day.fullDate.getFullYear() === selectedDate.getFullYear();

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleDateClick(day)}
                                    className="w-8 h-8 text-sm transition-colors flex items-center justify-center"
                                    style={{
                                        color: day.isCurrentMonth
                                            ? "rgb(255, 255, 255)"
                                            : "rgba(255, 255, 255, 0.2)",
                                        background: isSelected
                                            ? "rgba(125, 113, 251, 0.3)"
                                            : "transparent",
                                        border: isSelected
                                            ? "1px solid rgba(125, 113, 251, 0.5)"
                                            : "none",
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

                    {/* Affichage de la date sélectionnée */}
                    {selectedDateString && (
                        <div
                            className="text-center mt-4 pt-3"
                            style={{
                                color: "rgba(255, 255, 255, 0.6)",
                                fontSize: "12px",
                                fontFamily: "'Share Tech Mono', monospace",
                                borderTop: "1px solid rgba(125, 113, 251, 0.15)",
                            }}
                        >
                            {selectedDateString}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
