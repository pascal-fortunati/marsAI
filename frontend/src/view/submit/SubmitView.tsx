import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import MovieIcon from "@mui/icons-material/Movie";
import PersonIcon from "@mui/icons-material/Person";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import TheatersIcon from "@mui/icons-material/Theaters";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { AccentTitle, PageHeader } from "../../components/PageHeader";
import { PageShell } from "../../components/PageShell";
import { Button } from "../../components/ui/button";
import { Checkbox as UiCheckbox } from "../../components/ui/checkbox";
import { Calendar } from "../../components/ui/calendar";
import { Input } from "../../components/ui/input";
import { Label as UiLabel } from "../../components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../components/ui/popover";
import { Combobox } from "../../components/ui/combobox";
import { Textarea } from "../../components/ui/textarea";
import * as Flags from "country-flag-icons/react/3x2";

type FlagComponent = ComponentType<SVGProps<SVGSVGElement>>;
import {
    getCountryCode,
    getLanguageFlagCode,
    translateLanguageName,
} from "../../lib/countryMapping";
import { apiFetch } from "../../lib/api";
import {
    fetchPublicSubmissionOptions,
    type SubmissionOptions,
} from "../../lib/siteSettings";
import { useTranslation } from "react-i18next";
import type { ComponentType, SVGProps } from "react";
import { enUS, fr } from "date-fns/locale";
import { useToast } from "../../hooks/use-toast";
import {
    defaultForm,
    STORAGE_KEY,
    type FormData,
    type Step,
} from "./submitTypes";
import {
    fallbackSubmissionOptions,
    formatDateForDisplay,
    fromDateInputValue,
    isAdult,
    orderCountriesForSubmit,
    parseDuration,
    toDateInputValue,
} from "./submitHelpers";

type UploadKind = "video" | "poster" | "subtitles";

function isValidDirectorFullName(value: string) {
    const normalized = value.trim().replace(/\s+/g, " ");
    if (!normalized) return false;
    const parts = normalized.split(" ").filter(Boolean);
    if (parts.length < 2) return false;
    return parts.every((part) => part.replace(/[-']/g, "").length >= 2);
}

function isValidEmail(value: string) {
    const email = value.trim();
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function onlyDigits(value: string) {
    return /^\d+$/.test(value.trim());
}

function isValidPhone(value: string) {
    const digits = value.replace(/[^\d]/g, "");
    return digits.length >= 6 && digits.length <= 20;
}

function isAllowedUploadFile(kind: UploadKind, file: File) {
    const name = file.name.toLowerCase();
    const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
    const mime = String(file.type || "").toLowerCase();
    if (kind === "video") {
        return (
            [".mp4", ".mov"].includes(ext) &&
            ["video/mp4", "video/quicktime"].includes(mime)
        );
    }
    if (kind === "poster") {
        return (
            [".jpg", ".jpeg", ".png", ".gif"].includes(ext) &&
            ["image/jpeg", "image/png", "image/gif"].includes(mime)
        );
    }
    return (
        [".srt", ".vtt"].includes(ext) &&
        [
            "text/plain",
            "text/vtt",
            "application/x-subrip",
            "application/octet-stream",
            "",
        ].includes(mime)
    );
}

// Composant représentant une étiquette de champ de formulaire
function Label({
    children,
    required,
}: {
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <UiLabel className="f-mono mb-1.5 block text-[9px] uppercase tracking-[0.2em] text-white/65">
            {children}
            {required && <span className="ml-1 text-[#ff5c35]">*</span>}
        </UiLabel>
    );
}

// Composant représentant un message d'erreur de champ de formulaire
function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return <p className="f-mono mt-1 text-[9px] text-[#ff5c35]">&gt; {msg}</p>;
}

// Composant représentant une case à cocher dans le formulaire de soumission
function Checkbox({
    checked,
    onChange,
    children,
    required,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <label className="group flex cursor-pointer items-start gap-3">
            <UiCheckbox
                checked={checked}
                onCheckedChange={(v) => onChange(Boolean(v))}
                className="mt-0.5 border-white/20 bg-white/3 data-[state=checked]:border-transparent data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-[#7d71fb] data-[state=checked]:to-[#ff5c35] data-[state=checked]:shadow-[0_0_12px_rgba(125,113,251,0.35)]"
            />
            <span className="f-mono text-xs leading-relaxed text-white/50 group-hover:text-white/70 transition-colors">
                {children}
                {required && <span className="ml-1 text-[#ff5c35]">*</span>}
            </span>
        </label>
    );
}

// Composant représentant un champ de sélection dans le formulaire de soumission
function SelectField({
    value,
    onChange,
    placeholder,
    options,
    className,
    getFlagCode,
    searchable,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    options: string[];
    className?: string;
    getFlagCode?: (v: string) => string | null;
    searchable?: boolean;
}) {
    const getFlag = (name: string) => {
        const code = (getFlagCode ?? getCountryCode)(name);
        if (!code) return null;
        const Flag = (Flags as Record<string, FlagComponent>)[code];
        return Flag ? (
            <Flag className="mr-2 h-3 w-4 shrink-0 rounded-[2px] object-cover shadow-sm" />
        ) : null;
    };

    const uniqueOptions = Array.from(
        new Set(
            options
                .map((option) => String(option).trim())
                .filter((option) => option.length > 0),
        ),
    );

    return (
        <Combobox
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            options={uniqueOptions.map((option) => ({
                value: option,
                label: option,
            }))}
            renderOption={(option) => (
                <div className="flex items-center">
                    {getFlag(option.label)}
                    <span className="truncate">{option.label}</span>
                </div>
            )}
            renderValue={(option) => (
                <div className="flex items-center">
                    {getFlag(option.label)}
                    <span className="truncate">{option.label}</span>
                </div>
            )}
            searchPlaceholder="Rechercher..."
            emptyText="Aucun résultat"
            searchable={Boolean(searchable)}
        />
    );
}

// Composant représentant un sélecteur de tags dans le formulaire de soumission
function TagSelector({
    options,
    selected,
    onChange,
    max,
}: {
    options: string[];
    selected: string[];
    onChange: (v: string[]) => void;
    max?: number;
}) {
    const toggle = (tag: string) => {
        if (selected.includes(tag)) {
            onChange(selected.filter((t) => t !== tag));
        } else if (!max || selected.length < max) {
            onChange([...selected, tag]);
        }
    };
    return (
        <div className="flex flex-wrap gap-1.5">
            {options.map((tag) => {
                const active = selected.includes(tag);
                return (
                    <Button
                        key={tag}
                        type="button"
                        onClick={() => toggle(tag)}
                        variant="outline"
                        size="sm"
                        className="f-mono h-7 rounded-full px-3 text-[9px] uppercase tracking-wider transition-all duration-150"
                        style={{
                            background: active
                                ? "rgba(125,113,251,0.15)"
                                : "rgba(255,255,255,0.02)",
                            border: active
                                ? "1px solid rgba(125,113,251,0.45)"
                                : "1px solid rgba(255,255,255,0.08)",
                            color: active ? "#7d71fb" : "rgba(255,255,255,0.35)",
                            boxShadow: active ? "0 0 10px rgba(125,113,251,0.2)" : "none",
                        }}
                    >
                        {tag}
                    </Button>
                );
            })}
        </div>
    );
}

// Composant représentant une zone de glissement pour télécharger un fichier
function DropZone({
    label,
    kind,
    accept,
    maxMb,
    file,
    onChange,
    required,
    hint,
}: {
    label: string;
    kind: UploadKind;
    accept: string;
    maxMb: number;
    file: File | null;
    onChange: (f: File | null) => void;
    required?: boolean;
    hint?: string;
}) {
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    const validate = (f: File) => {
        if (!isAllowedUploadFile(kind, f)) {
            setError(
                t(
                    `submit.dropzone.invalid${kind === "video"
                        ? "Video"
                        : kind === "poster"
                            ? "Poster"
                            : "Subtitles"
                    }Type`,
                ),
            );
            return false;
        }
        if (f.size > maxMb * 1024 * 1024) {
            setError(t("submit.dropzone.tooLarge", { maxMb }));
            return false;
        }
        setError("");
        return true;
    };

    const handle = (f: File) => {
        if (validate(f)) onChange(f);
    };

    return (
        <div>
            <Label required={required}>{label}</Label>
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const f = e.dataTransfer.files[0];
                    if (f) handle(f);
                }}
                className="relative cursor-pointer overflow-hidden rounded-xl border border-dashed p-6 text-center transition-all duration-200"
                style={{
                    background: dragging
                        ? "rgba(125,113,251,0.08)"
                        : file
                            ? "rgba(34,197,94,0.05)"
                            : "rgba(255,255,255,0.02)",
                    border: dragging
                        ? "1px dashed rgba(125,113,251,0.6)"
                        : file
                            ? "1px dashed rgba(34,197,94,0.4)"
                            : "1px dashed rgba(255,255,255,0.12)",
                    boxShadow: dragging ? "0 0 20px rgba(125,113,251,0.15)" : "none",
                }}
            >
                {file ? (
                    <div>
                        <div className="mb-1 text-2xl text-[#22c55e]">
                            <CheckIcon fontSize="inherit" />
                        </div>
                        <div className="f-orb text-xs font-bold text-[#22c55e]">
                            {file.name}
                        </div>
                        <div className="f-mono mt-0.5 text-[9px] text-white/30">
                            {(file.size / 1024 / 1024).toFixed(1)} {t("submit.units.mb")}
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(null);
                            }}
                            className="f-mono mt-2 text-[9px] uppercase tracking-wider text-[#ff5c35]/60 hover:text-[#ff5c35]"
                        >
                            {t("submit.dropzone.remove")}
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="mb-2 text-3xl opacity-40">
                            <FileUploadIcon fontSize="inherit" />
                        </div>
                        <div className="f-orb text-xs font-bold text-white/50">
                            {t("submit.dropzone.dropOrClick")}
                        </div>
                        <div className="f-mono mt-1 text-[9px] text-white/25">
                            {accept.toUpperCase()} · {t("submit.dropzone.maxMb", { maxMb })}
                        </div>
                        {hint && (
                            <div className="f-mono mt-0.5 text-[8px] text-white/20">
                                {hint}
                            </div>
                        )}
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handle(f);
                    }}
                />
            </div>
            {error && (
                <p className="f-mono mt-1 text-[9px] text-[#ff5c35]">&gt; {error}</p>
            )}
        </div>
    );
}

// Composant représentant la barre d'étape dans le formulaire de soumission
function StepBar({ current }: { current: number }) {
    const { t } = useTranslation();
    const steps = [
        {
            label: t("submit.stepDirector"),
            icon: <PersonIcon fontSize="inherit" />,
        },
        { label: t("submit.stepFilm"), icon: <MovieIcon fontSize="inherit" /> },
        {
            label: t("submit.stepUploads"),
            icon: <FolderOpenIcon fontSize="inherit" />,
        },
        {
            label: t("submit.stepConsents"),
            icon: <FactCheckIcon fontSize="inherit" />,
        },
    ];
    return (
        <div className="flex items-center gap-0">
            {steps.map((s, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                        <div
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-sm transition-all duration-300"
                            style={{
                                background:
                                    i < current
                                        ? "linear-gradient(135deg, #7d71fb, #ff5c35)"
                                        : i === current
                                            ? "rgba(125,113,251,0.2)"
                                            : "var(--submit-step-dot-idle-bg)",
                                border:
                                    i === current
                                        ? "1px solid rgba(125,113,251,0.5)"
                                        : i < current
                                            ? "1px solid transparent"
                                            : "1px solid var(--submit-step-dot-idle-border)",
                                boxShadow:
                                    i === current ? "0 0 16px rgba(125,113,251,0.35)" : "none",
                            }}
                        >
                            {i < current ? <CheckIcon fontSize="inherit" /> : s.icon}
                        </div>
                        <span
                            className="f-mono block max-w-[84px] text-center text-[8px] uppercase tracking-widest"
                            style={{
                                color:
                                    i === current
                                        ? "#7d71fb"
                                        : i < current
                                            ? "var(--submit-step-label-idle)"
                                            : "var(--submit-step-label-upcoming)",
                            }}
                        >
                            {s.label}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <div
                            className="flex-1 mx-2 h-px transition-all duration-500"
                            style={{
                                background:
                                    i < current
                                        ? "linear-gradient(90deg, #7d71fb, #ff5c35)"
                                        : "var(--submit-step-line-idle)",
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

// Composant représentant l'étape de soumission des informations du directeur
function StepDirector({
    form,
    set,
    errors,
    countries,
    jobs,
    discoverySources,
    socialNetworks,
}: {
    form: FormData;
    set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
    errors: Record<string, string>;
    countries: string[];
    jobs: string[];
    discoverySources: string[];
    socialNetworks: { key: string; label: string }[];
}) {
    const { t, i18n } = useTranslation();
    const calendarLocale = useMemo(
        () => (i18n.language?.startsWith("fr") ? fr : enUS),
        [i18n.language],
    );
    const maxBirthdate = useMemo(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 18);
        return d;
    }, []);

    const [calendarMonth, setCalendarMonth] = useState<Date>(
        () => fromDateInputValue(form.dirBirthdate) ?? maxBirthdate,
    );
    const calendarMonthOptions = useMemo(() => {
        const locale = i18n.language?.startsWith("fr") ? "fr-FR" : "en-US";
        const formatter = new Intl.DateTimeFormat(locale, { month: "long" });
        return Array.from({ length: 12 }, (_, monthIndex) => ({
            value: String(monthIndex),
            label: formatter.format(new Date(2026, monthIndex, 1)),
        }));
    }, [i18n.language]);
    const calendarYearOptions = useMemo(() => {
        const currentYear = maxBirthdate.getFullYear();
        const years: { value: string; label: string }[] = [];
        for (let year = currentYear; year >= 1930; year -= 1) {
            years.push({ value: String(year), label: String(year) });
        }
        return years;
    }, []);
    const birthdateDisplay = form.dirBirthdate
        ? formatDateForDisplay(form.dirBirthdate, i18n.language)
        : "";
    return (
        <div
            className="flex flex-col gap-5"
            style={{ animation: "fadeUp 0.4s ease-out both" }}
        >
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label required>{t("submit.labels.fullName")}</Label>
                    <Input
                        className={
                            errors.dirName
                                ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                : ""
                        }
                        value={form.dirName}
                        onChange={(e) => set("dirName", e.target.value)}
                        placeholder={t("submit.placeholders.name")}
                    />
                    <FieldError msg={errors.dirName} />
                </div>
                <div>
                    <Label required>{t("submit.labels.email")}</Label>
                    <Input
                        type="email"
                        className={
                            errors.dirEmail
                                ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                : ""
                        }
                        value={form.dirEmail}
                        onChange={(e) => set("dirEmail", e.target.value)}
                        placeholder={t("submit.placeholders.email")}
                    />
                    <FieldError msg={errors.dirEmail} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label required>{t("submit.labels.phone")}</Label>
                    <Input
                        type="tel"
                        className={
                            errors.dirPhone
                                ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                : ""
                        }
                        value={form.dirPhone}
                        onChange={(e) => set("dirPhone", e.target.value)}
                        placeholder={t("submit.placeholders.phone")}
                    />
                    <FieldError msg={errors.dirPhone} />
                </div>
                <div>
                    <Label required>{t("submit.labels.birthdate")}</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className={`w-full justify-start rounded-xl border border-border bg-input px-[14px] py-[11px] text-left text-xs font-normal normal-case tracking-normal text-foreground/90 shadow-none transition-[border-color,background,box-shadow] duration-200 hover:bg-[#7d71fb]/[0.04] hover:text-foreground ${errors.dirBirthdate
                                        ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                        : "focus-visible:border-[#7d71fb]/50 focus-visible:bg-[#7d71fb]/[0.04] focus-visible:shadow-[0_0_0_3px_rgba(125,113,251,0.08)]"
                                    }`}
                            >
                                {birthdateDisplay || t("submit.placeholders.birthdate")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto border-border bg-popover p-0 text-popover-foreground backdrop-blur-xl"
                            align="start"
                        >
                            <div className="grid grid-cols-2 gap-2 border-b border-border p-2">
                                <Combobox
                                    value={String(calendarMonth.getMonth())}
                                    onChange={(monthValue) =>
                                        setCalendarMonth(
                                            new Date(
                                                calendarMonth.getFullYear(),
                                                Number(monthValue),
                                                1,
                                            ),
                                        )
                                    }
                                    options={calendarMonthOptions}
                                    placeholder={t("submit.placeholders.select")}
                                    searchable={false}
                                    className="capitalize"
                                />
                                <Combobox
                                    value={String(calendarMonth.getFullYear())}
                                    onChange={(yearValue) =>
                                        setCalendarMonth(
                                            new Date(Number(yearValue), calendarMonth.getMonth(), 1),
                                        )
                                    }
                                    options={calendarYearOptions}
                                    placeholder={t("submit.placeholders.select")}
                                    searchable={false}
                                />
                            </div>
                            <Calendar
                                mode="single"
                                locale={calendarLocale}
                                month={calendarMonth}
                                onMonthChange={setCalendarMonth}
                                selected={fromDateInputValue(form.dirBirthdate)}
                                onSelect={(date) => {
                                    if (!date) return;
                                    set("dirBirthdate", toDateInputValue(date));
                                    setCalendarMonth(date);
                                }}
                                fromYear={1930}
                                toYear={maxBirthdate.getFullYear()}
                                toDate={maxBirthdate}
                                className="rounded-xl border border-white/10 bg-transparent text-white"
                                classNames={{ nav: "hidden" }}
                            />
                        </PopoverContent>
                    </Popover>
                    {form.dirBirthdate && !isAdult(form.dirBirthdate) && (
                        <p className="f-mono mt-1 text-[9px] text-[#ff5c35]">
                            {t("submit.hints.age")}
                        </p>
                    )}
                    <FieldError msg={errors.dirBirthdate} />
                </div>
            </div>

            <div>
                <Label required>{t("submit.labels.address")}</Label>
                <Input
                    className={
                        errors.dirStreet
                            ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                            : ""
                    }
                    value={form.dirStreet}
                    onChange={(e) => set("dirStreet", e.target.value)}
                    placeholder={t("submit.placeholders.address")}
                />
                <FieldError msg={errors.dirStreet} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <Label required>{t("submit.labels.zip")}</Label>
                    <Input
                        className={
                            errors.dirZip
                                ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                : ""
                        }
                        value={form.dirZip}
                        onChange={(e) => set("dirZip", e.target.value)}
                        placeholder={t("submit.placeholders.zip")}
                    />
                    <FieldError msg={errors.dirZip} />
                </div>
                <div>
                    <Label required>{t("submit.labels.city")}</Label>
                    <Input
                        className={
                            errors.dirCity
                                ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                : ""
                        }
                        value={form.dirCity}
                        onChange={(e) => set("dirCity", e.target.value)}
                        placeholder={t("submit.placeholders.city")}
                    />
                    <FieldError msg={errors.dirCity} />
                </div>
                <div>
                    <Label required>{t("submit.labels.country")}</Label>
                    <SelectField
                        value={form.dirCountry}
                        onChange={(v) => set("dirCountry", v)}
                        placeholder={t("submit.placeholders.select")}
                        options={countries}
                        searchable
                        className={
                            errors.dirCountry
                                ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                : ""
                        }
                    />
                    <FieldError msg={errors.dirCountry} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label required>{t("submit.labels.job")}</Label>
                    <SelectField
                        value={form.dirJob}
                        onChange={(v) => set("dirJob", v)}
                        placeholder={t("submit.placeholders.select")}
                        options={jobs}
                        className={
                            errors.dirJob
                                ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                : ""
                        }
                    />
                    <FieldError msg={errors.dirJob} />
                </div>
                <div>
                    <Label required>{t("submit.labels.discovery")}</Label>
                    <SelectField
                        value={form.discovery}
                        onChange={(v) => set("discovery", v)}
                        placeholder={t("submit.placeholders.select")}
                        options={discoverySources}
                        className={
                            errors.discovery
                                ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                : ""
                        }
                    />
                    <FieldError msg={errors.discovery} />
                </div>
            </div>

            <div>
                <Label>{t("submit.labels.socials")}</Label>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {socialNetworks.map((sn) => (
                        <div key={sn.key} className="flex items-center gap-2">
                            <span className="f-mono w-20 shrink-0 text-[9px] text-white/30 uppercase tracking-wider">
                                {sn.label}
                            </span>
                            <Input
                                value={form.socials[sn.key] || ""}
                                onChange={(e) =>
                                    set("socials", { ...form.socials, [sn.key]: e.target.value })
                                }
                                placeholder={t("submit.placeholders.social")}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <Label>{t("submit.labels.additional")}</Label>
                <Textarea
                    rows={3}
                    className="resize-none"
                    value={form.additionalInfo}
                    onChange={(e) => set("additionalInfo", e.target.value)}
                    placeholder={t("submit.placeholders.additional")}
                />
            </div>

            <div className="rounded-xl border border-[#7d71fb]/20 bg-[#7d71fb]/5 p-4">
                <div className="f-mono mb-3 text-[9px] uppercase tracking-[0.2em] text-[#7d71fb]/70">
                    &gt; {t("submit.legalRefTitle")}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                    <div>
                        <Label required>{t("submit.labels.legalName")}</Label>
                        <Input
                            className={
                                errors.legalName
                                    ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                    : ""
                            }
                            value={form.legalName}
                            onChange={(e) => set("legalName", e.target.value)}
                            placeholder={t("submit.placeholders.name")}
                        />
                        <FieldError msg={errors.legalName} />
                    </div>
                    <div>
                        <Label required>{t("submit.labels.legalEmail")}</Label>
                        <Input
                            type="email"
                            className={
                                errors.legalEmail
                                    ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                    : ""
                            }
                            value={form.legalEmail}
                            onChange={(e) => set("legalEmail", e.target.value)}
                            placeholder={t("submit.placeholders.email")}
                        />
                        <FieldError msg={errors.legalEmail} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Composant représentant l'étape de soumission des informations du film
function StepFilm({
    form,
    set,
    errors,
    detectedDurationSeconds,
    countries,
    languages,
    categories,
    aiToolSuggestions,
    semanticTags,
}: {
    form: FormData;
    set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
    errors: Record<string, string>;
    detectedDurationSeconds: number | null;
    countries: string[];
    languages: string[];
    categories: string[];
    aiToolSuggestions: string[];
    semanticTags: string[];
}) {
    const { t } = useTranslation();
    const synopsisLen = form.synopsis.length;
    const typedDuration = form.duration ? parseDuration(form.duration) : 0;
    const durationMismatch =
        detectedDurationSeconds !== null &&
        typedDuration > 0 &&
        Math.abs(typedDuration - detectedDurationSeconds) > 2;
    const detectedDurationLabel =
        detectedDurationSeconds !== null
            ? `${Math.floor(detectedDurationSeconds / 60)}:${String(
                detectedDurationSeconds % 60,
            ).padStart(2, "0")}`
            : null;

    return (
        <div
            className="flex flex-col gap-5"
            style={{ animation: "fadeUp 0.4s ease-out both" }}
        >
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label required>{t("submit.labels.title")}</Label>
                    <Input
                        className={
                            errors.title
                                ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                : ""
                        }
                        value={form.title}
                        onChange={(e) => set("title", e.target.value)}
                        placeholder={t("submit.placeholders.title")}
                    />
                    <FieldError msg={errors.title} />
                </div>
                <div>
                    <Label required>{t("submit.labels.duration")}</Label>
                    <Input
                        className={
                            errors.duration
                                ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                : ""
                        }
                        value={form.duration}
                        onChange={(e) => set("duration", e.target.value)}
                        placeholder={t("submit.placeholders.duration")}
                    />
                    {form.duration && parseDuration(form.duration) > 120 && (
                        <p className="f-mono mt-1 text-[9px] text-[#ff5c35]">
                            {t("submit.hints.durationMax")}
                        </p>
                    )}
                    {detectedDurationLabel ? (
                        <p className="f-mono mt-1 text-[9px] text-white/55">
                            {t("submit.hints.detectedDuration", {
                                duration: detectedDurationLabel,
                            })}
                        </p>
                    ) : null}
                    {durationMismatch ? (
                        <p className="f-mono mt-1 text-[9px] text-[#ffb199]">
                            {t("submit.hints.durationMismatch")}
                        </p>
                    ) : null}
                    <FieldError msg={errors.duration} />
                </div>
            </div>

            <div>
                <Label required>
                    {t("submit.labels.synopsis")}{" "}
                    <span className="ml-1 text-white/20">
                        {t("submit.hints.synopsisMax")}
                    </span>
                </Label>
                <Textarea
                    rows={3}
                    className={`resize-none ${errors.synopsis
                            ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                            : ""
                        }`}
                    value={form.synopsis}
                    onChange={(e) => {
                        if (e.target.value.length <= 300) set("synopsis", e.target.value);
                    }}
                    placeholder={t("submit.placeholders.synopsis")}
                />
                <div
                    className="f-mono mt-1 text-right text-[9px]"
                    style={{
                        color: synopsisLen > 280 ? "#ff5c35" : "rgba(255,255,255,0.2)",
                    }}
                >
                    {synopsisLen}/300
                </div>
                <FieldError msg={errors.synopsis} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <Label required>{t("submit.labels.countryProduction")}</Label>
                    <SelectField
                        value={form.country}
                        onChange={(v) => set("country", v)}
                        placeholder={t("submit.placeholders.select")}
                        options={countries}
                        searchable
                        className={
                            errors.country
                                ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                : ""
                        }
                    />
                    <FieldError msg={errors.country} />
                </div>
                <div>
                    <Label required>{t("submit.labels.language")}</Label>
                    <SelectField
                        value={form.language}
                        onChange={(v) => set("language", v)}
                        placeholder={t("submit.placeholders.select")}
                        options={languages}
                        searchable
                        className={
                            errors.language
                                ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                : ""
                        }
                        getFlagCode={getLanguageFlagCode}
                    />
                    <FieldError msg={errors.language} />
                </div>
                <div>
                    <Label required>{t("submit.labels.category")}</Label>
                    <SelectField
                        value={form.category}
                        onChange={(v) => set("category", v)}
                        placeholder={t("submit.placeholders.select")}
                        options={categories}
                        className={
                            errors.category
                                ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                                : ""
                        }
                    />
                    <FieldError msg={errors.category} />
                </div>
            </div>

            <div>
                <Label required>{t("submit.labels.aiTools")}</Label>
                <TagSelector
                    options={aiToolSuggestions}
                    selected={form.aiTools}
                    onChange={(v) => set("aiTools", v)}
                />
                <div className="mt-2 flex gap-2">
                    <Input
                        className="flex-1"
                        value={form.customAiTool}
                        onChange={(e) => set("customAiTool", e.target.value)}
                        placeholder={t("submit.placeholders.otherTool")}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && form.customAiTool.trim()) {
                                set("aiTools", [...form.aiTools, form.customAiTool.trim()]);
                                set("customAiTool", "");
                            }
                        }}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            if (form.customAiTool.trim()) {
                                set("aiTools", [...form.aiTools, form.customAiTool.trim()]);
                                set("customAiTool", "");
                            }
                        }}
                        className="f-mono h-11 rounded-xl border-[#7d71fb]/30 bg-[#7d71fb]/8 px-3 text-[10px] text-[#7d71fb] hover:bg-[#7d71fb]/15"
                    >
                        {t("submit.buttons.add")}
                    </Button>
                </div>
                <FieldError msg={errors.aiTools} />
            </div>

            <div>
                <Label required>
                    {t("submit.labels.tags")}{" "}
                    <span className="ml-1 text-white/20">{t("submit.tagsHint")}</span>
                </Label>
                <TagSelector
                    options={semanticTags}
                    selected={form.semanticTags}
                    onChange={(v) => set("semanticTags", v)}
                />
                <FieldError msg={errors.semanticTags} />
            </div>

            <div>
                <Label required>{t("submit.labels.music")}</Label>
                <Textarea
                    rows={2}
                    className={`resize-none ${errors.musicCredits
                            ? "border-[rgba(255,92,53,0.5)] bg-[rgba(255,92,53,0.04)]"
                            : ""
                        }`}
                    value={form.musicCredits}
                    onChange={(e) => set("musicCredits", e.target.value)}
                    placeholder={t("submit.placeholders.music")}
                />
                <FieldError msg={errors.musicCredits} />
            </div>

            <div className="rounded-xl border border-[#ff5c35]/20 bg-[#ff5c35]/5 p-4">
                <Checkbox
                    checked={form.rightsConfirmed}
                    onChange={(v) => set("rightsConfirmed", v)}
                    required
                >
                    Je confirme détenir l'ensemble des droits sur les éléments soumis
                    (images, sons, musiques, voix) et être en mesure de les céder pour la
                    durée du festival.
                </Checkbox>
            </div>
        </div>
    );
}

// Composant représentant l'étape de soumission des fichiers téléchargés
function StepUploads({
    form,
    set,
    errors,
    onVideoPicked,
}: {
    form: FormData;
    set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
    errors: Record<string, string>;
    onVideoPicked: (file: File | null) => Promise<void> | void;
}) {
    const { t } = useTranslation();
    return (
        <div
            className="flex flex-col gap-6"
            style={{ animation: "fadeUp 0.4s ease-out both" }}
        >
            <div className="rounded-xl border border-[#7d71fb]/15 bg-[#7d71fb]/4 p-3">
                <p className="f-mono text-[9px] leading-relaxed text-white/65">
                    {t("submit.uploads.info")}
                </p>
            </div>

            <DropZone
                kind="video"
                label={t("submit.uploads.videoLabel")}
                accept=".mp4,.mov"
                maxMb={300}
                file={form.videoFile}
                onChange={(f) => void onVideoPicked(f)}
                required
                hint={t("submit.uploads.videoHint")}
            />
            {errors.videoFile && <FieldError msg={errors.videoFile} />}

            <DropZone
                kind="poster"
                label={t("submit.uploads.posterLabel")}
                accept=".jpg,.jpeg,.png,.gif"
                maxMb={2}
                file={form.posterFile}
                onChange={(f) => set("posterFile", f)}
                required
                hint={t("submit.uploads.posterHint")}
            />
            {errors.posterFile && <FieldError msg={errors.posterFile} />}

            <DropZone
                kind="subtitles"
                label={t("submit.uploads.subtitlesLabel")}
                accept=".srt,.vtt"
                maxMb={5}
                file={form.subtitlesFile}
                onChange={(f) => set("subtitlesFile", f)}
                hint={t("submit.uploads.subtitlesHint")}
            />

            <div className="grid gap-2 sm:grid-cols-3">
                {[
                    {
                        icon: <AccessTimeIcon fontSize="inherit" />,
                        label: t("submit.uploads.rules.durationLabel"),
                        val: t("submit.uploads.rules.durationValue"),
                    },
                    {
                        icon: <Inventory2Icon fontSize="inherit" />,
                        label: t("submit.uploads.rules.sizeLabel"),
                        val: t("submit.uploads.rules.sizeValue"),
                    },
                    {
                        icon: <TheatersIcon fontSize="inherit" />,
                        label: t("submit.uploads.rules.formatsLabel"),
                        val: t("submit.uploads.rules.formatsValue"),
                    },
                ].map((r) => (
                    <div
                        key={r.label}
                        className="rounded-xl border border-white/6 bg-white/2 p-3 text-center"
                    >
                        <div className="mb-1 text-xl">{r.icon}</div>
                        <div className="f-mono text-[8px] uppercase tracking-widest text-white/25">
                            {r.label}
                        </div>
                        <div className="f-orb mt-0.5 text-xs font-bold text-white/60">
                            {r.val}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Composant représentant l'étape de soumission des consents
function StepConsents({
    form,
    set,
    errors,
}: {
    form: FormData;
    set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
    errors: Record<string, string>;
}) {
    const { t } = useTranslation();
    return (
        <div
            className="flex flex-col gap-4"
            style={{ animation: "fadeUp 0.4s ease-out both" }}
        >
            <div className="rounded-2xl border border-[#7d71fb]/20 bg-[#7d71fb]/5 p-5">
                <div className="f-mono mb-3 text-[9px] uppercase tracking-[0.2em] text-[#7d71fb]/60">
                    {t("submit.summary.title")}
                </div>
                <div className="grid gap-1.5 sm:grid-cols-2">
                    {[
                        {
                            label: t("submit.summary.film"),
                            val: form.title || t("submit.summary.empty"),
                        },
                        {
                            label: t("submit.summary.director"),
                            val: form.dirName || t("submit.summary.empty"),
                        },
                        {
                            label: t("submit.summary.country"),
                            val: form.country || t("submit.summary.empty"),
                        },
                        {
                            label: t("submit.summary.duration"),
                            val: form.duration || t("submit.summary.empty"),
                        },
                        {
                            label: t("submit.summary.category"),
                            val: form.category || t("submit.summary.empty"),
                        },
                        {
                            label: t("submit.summary.aiTools"),
                            val: form.aiTools.join(", ") || t("submit.summary.empty"),
                        },
                    ].map(({ label, val }) => (
                        <div key={label} className="flex gap-2">
                            <span className="f-mono w-24 shrink-0 text-[9px] uppercase tracking-wider text-white/25">
                                {label}
                            </span>
                            <span className="f-mono text-[9px] text-white/60 truncate">
                                {val}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-white/8 bg-white/2 p-4">
                    <Checkbox
                        checked={form.consentRules}
                        onChange={(v) => set("consentRules", v)}
                        required
                    >
                        {t("submit.consents.rulesPrefix")}{" "}
                        <a
                            href="#"
                            className="text-[#7d71fb] underline hover:text-[#7d71fb]/80"
                        >
                            {t("submit.consents.rulesLink")}
                        </a>
                        . {t("submit.consents.rulesSuffix")}
                    </Checkbox>
                </div>

                <div className="rounded-xl border border-white/8 bg-white/2 p-4">
                    <Checkbox
                        checked={form.consentPromo}
                        onChange={(v) => set("consentPromo", v)}
                        required
                    >
                        {t("submit.consents.promo")}
                    </Checkbox>
                </div>

                <div className="rounded-xl border border-white/8 bg-white/2 p-4">
                    <Checkbox
                        checked={form.consentCopyright}
                        onChange={(v) => set("consentCopyright", v)}
                        required
                    >
                        {t("submit.consents.copyright")}
                    </Checkbox>
                </div>

                <div className="rounded-xl border border-white/8 bg-white/2 p-4">
                    <Checkbox
                        checked={form.consentNewsletter}
                        onChange={(v) => set("consentNewsletter", v)}
                    >
                        {t("submit.consents.newsletter")}
                    </Checkbox>
                </div>
            </div>

            {(errors.consentRules ||
                errors.consentPromo ||
                errors.consentCopyright) && (
                    <div className="rounded-xl border border-[#ff5c35]/25 bg-[#ff5c35]/8 p-3">
                        <p className="f-mono text-[9px] text-[#ff5c35]">
                            {t("submit.errors.consentsRequired")}
                        </p>
                    </div>
                )}

            <div className="rounded-xl border border-white/6 bg-white/2 p-4">
                <p className="f-mono text-[10px] leading-relaxed text-white/30">
                    <span className="inline-flex items-center gap-2">
                        <span className="text-[14px] text-[#ff5c35]">
                            <WarningAmberIcon fontSize="inherit" />
                        </span>
                        <span>
                            {t("submit.warnings.noEditPrefix")}{" "}
                            <span className="text-white/50">
                                {form.dirEmail || t("submit.warnings.fallbackEmail")}
                            </span>
                            {t("submit.warnings.noEditSuffix")}
                        </span>
                    </span>
                    {t("submit.warnings.juryReview")}
                </p>
            </div>
        </div>
    );
}

// Composant représentant l'écran de succès de soumission
function SuccessScreen({
    submissionId,
    email,
    onSubmitAnother,
}: {
    submissionId: string;
    email: string;
    onSubmitAnother: () => void;
}) {
    const { t } = useTranslation();
    return (
        <div
            className="flex flex-col items-center justify-center py-16 text-center"
            style={{ animation: "fadeUp 0.6s ease-out both" }}
        >
            <div
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl"
                style={{
                    background: "linear-gradient(135deg, #7d71fb, #ff5c35)",
                    boxShadow: "0 0 60px rgba(125,113,251,0.4)",
                    animation: "pulseGlow 2s ease-in-out infinite",
                }}
            >
                <svg
                    className="h-10 w-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>

            <div className="f-mono mb-1 text-[10px] uppercase tracking-[0.3em] text-[#7d71fb]">
                {t("submit.doneBadge")}
            </div>
            <h2 className="f-orb text-2xl font-black text-white">
                {t("submit.doneTitle")}
            </h2>
            <p className="f-mono mt-3 max-w-sm text-sm leading-relaxed text-white/40">
                {t("submit.doneText")}
            </p>

            <div className="mt-6 rounded-2xl border border-[#7d71fb]/25 bg-[#7d71fb]/8 px-6 py-4">
                <div className="f-mono text-[9px] uppercase tracking-widest text-[#7d71fb]/60 mb-1">
                    {t("submit.doneSubmissionId")}
                </div>
                <div className="f-orb text-lg font-black text-white">
                    {submissionId}
                </div>
                <div className="f-mono mt-2 text-[9px] text-white/30">
                    {t("submit.doneEmailSentTo")}{" "}
                    <span className="text-white/50">{email}</span>
                </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Button
                    asChild
                    variant="outline"
                    className="f-orb rounded-full border-white/12 bg-white/5 px-6 text-xs uppercase tracking-widest text-white/60 hover:border-white/25 hover:bg-white/7 hover:text-white"
                >
                    <a href="/">{t("submit.backHome")}</a>
                </Button>
                <Button
                    type="button"
                    onClick={onSubmitAnother}
                    className="f-orb group relative overflow-hidden rounded-full px-6 text-xs font-bold uppercase tracking-widest text-white"
                    style={{ background: "linear-gradient(135deg, #7d71fb, #ff5c35)" }}
                >
                    {t("submit.submitAnother")}
                </Button>
            </div>
        </div>
    );
}

function formatDurationSeconds(seconds: number): string {
    const safe = Math.max(0, Math.round(Number(seconds) || 0));
    const min = Math.floor(safe / 60);
    const sec = String(safe % 60).padStart(2, "0");
    return `${min}:${sec}`;
}

function readVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.preload = "metadata";
        video.src = url;
        video.onloadedmetadata = () => {
            const duration = Number(video.duration);
            URL.revokeObjectURL(url);
            if (!Number.isFinite(duration) || duration <= 0) {
                reject(new Error("INVALID_DURATION"));
                return;
            }
            resolve(Math.round(duration));
        };
        video.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("VIDEO_METADATA_ERROR"));
        };
    });
}

// Composant représentant la vue de soumission
export function SubmitView() {
    const { t, i18n } = useTranslation();
    const { toast } = useToast();
    const normalizeOption = (value: string) =>
        String(value)
            .normalize("NFC")
            .replace(/[\u2018\u2019`´]/g, "'")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();
    const fallbackOptions = useMemo(
        () => fallbackSubmissionOptions(i18n.language),
        [i18n.language],
    );
    const [step, setStep] = useState<Step>(0);
    const [submitting, setSubmitting] = useState(false);
    const [submissionId, setSubmissionId] = useState("");
    const [videoDetectedDuration, setVideoDetectedDuration] = useState<
        number | null
    >(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [options, setOptions] = useState<SubmissionOptions>(fallbackOptions);

    // Fusion intelligente des options API avec les traductions locales
    const smartOptions = useMemo(() => {
        const translateCountryList = (apiList: string[], localList: string[]) => {
            // 1. On récupère les traductions locales sous forme de Map (Code -> Nom traduit)
            const codeToLocalName = new Map<string, string>();
            localList.forEach((item) => {
                const code = getCountryCode(item);
                if (code) codeToLocalName.set(code, item);
            });

            return apiList.map((apiItem) => {
                // 2. On essaie de trouver le code de l'item API
                const code = getCountryCode(apiItem);

                // 3. Si on a un code ET qu'on a une traduction locale pour ce code, on l'utilise
                if (code && codeToLocalName.has(code)) {
                    return codeToLocalName.get(code)!;
                }

                // Sinon (item custom ou pas de traduction), on garde l'original
                return apiItem;
            });
        };

        const orderLanguagesForSubmit = (list: string[], lang: string) => {
            const locale = lang?.startsWith("fr") ? "fr-FR" : "en-US";
            const priorityByLang = lang?.startsWith("fr")
                ? ["Français", "Anglais"]
                : ["English", "French"];

            const seen = new Set<string>();
            const unique = list.filter((item) => {
                const key = normalizeOption(item);
                if (!key || seen.has(key)) return false;
                seen.add(key);
                return true;
            });

            const top: string[] = [];
            for (const wanted of priorityByLang) {
                const w = normalizeOption(wanted);
                const match = unique.find((item) => normalizeOption(item) === w);
                if (match && !top.includes(match)) top.push(match);
            }

            const topSet = new Set(top);
            const rest = unique
                .filter((item) => !topSet.has(item))
                .sort((a, b) => a.localeCompare(b, locale, { sensitivity: "base" }));

            return [...top, ...rest];
        };

        const translateLanguageList = (apiList: string[], lang: string) => {
            const target = lang?.startsWith("fr") ? "fr" : "en";
            return apiList.map((item) => translateLanguageName(item, target));
        };

        return {
            ...options,
            countries: orderCountriesForSubmit(
                translateCountryList(options.countries, fallbackOptions.countries),
                i18n.language,
            ),
            languages: orderLanguagesForSubmit(
                translateLanguageList(
                    (options.languages?.length
                        ? options.languages
                        : fallbackOptions.languages) ?? [],
                    i18n.language,
                ),
                i18n.language,
            ),
        };
    }, [options, fallbackOptions, i18n.language]);

    useEffect(() => {
        const ac = new AbortController();
        // On garde setOptions(fallbackOptions) pour éviter un flash vide,
        // mais le smartOptions prendra le relais dès que options sera mis à jour par l'API
        fetchPublicSubmissionOptions(ac.signal)
            .then((o) => {
                if (o) setOptions(o);
            })
            .catch(() => { });
        return () => ac.abort();
    }, [fallbackOptions]);

    const [form, setFormRaw] = useState<FormData>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return { ...defaultForm(), ...JSON.parse(saved) };
        } catch (err) {
            void err;
        }
        return defaultForm();
    });

    useEffect(() => {
        const {
            videoFile: _videoFile,
            posterFile: _posterFile,
            subtitlesFile: _subtitlesFile,
            ...saveable
        } = form;
        void _videoFile;
        void _posterFile;
        void _subtitlesFile;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saveable));
        } catch (err) {
            void err;
        }
    }, [form]);

    const set = useCallback(<K extends keyof FormData>(k: K, v: FormData[K]) => {
        setFormRaw((prev) => ({ ...prev, [k]: v }));
        setErrors((prev) => {
            const n = { ...prev };
            delete n[k];
            return n;
        });
        setSubmitError(null);
    }, []);

    useEffect(() => {
        // Synchronisation du pays du film
        if (form.country && !smartOptions.countries.includes(form.country)) {
            const code = getCountryCode(form.country);
            if (code) {
                const match = smartOptions.countries.find(
                    (c) => getCountryCode(c) === code,
                );
                if (match) set("country", match);
            }
        }
        // Synchronisation du pays du réalisateur
        if (form.dirCountry && !smartOptions.countries.includes(form.dirCountry)) {
            const code = getCountryCode(form.dirCountry);
            if (code) {
                const match = smartOptions.countries.find(
                    (c) => getCountryCode(c) === code,
                );
                if (match) set("dirCountry", match);
            }
        }
        // Synchronisation de la langue du film
        if (form.language && !smartOptions.languages.includes(form.language)) {
            const targetLang = i18n.language?.startsWith("fr") ? "fr" : "en";
            const translated = translateLanguageName(form.language, targetLang);
            const target = normalizeOption(translated);
            const match = smartOptions.languages.find(
                (l) => normalizeOption(l) === target,
            );
            if (match) set("language", match);
        }
    }, [
        smartOptions,
        form.country,
        form.dirCountry,
        form.language,
        i18n.language,
        set,
    ]);

    const validateStep = (s: Step): boolean => {
        const errs: Record<string, string> = {};

        if (s === 0) {
            if (!form.dirName.trim()) errs.dirName = t("submit.errors.requiredName");
            else if (!isValidDirectorFullName(form.dirName))
                errs.dirName = t("submit.errors.invalidFullName");
            if (!form.dirEmail.trim())
                errs.dirEmail = t("submit.errors.requiredEmail");
            else if (!isValidEmail(form.dirEmail))
                errs.dirEmail = t("submit.errors.invalidEmail");
            if (!form.dirPhone.trim())
                errs.dirPhone = t("submit.errors.requiredPhone");
            else if (!isValidPhone(form.dirPhone))
                errs.dirPhone = t("submit.errors.invalidPhone");
            if (!form.dirBirthdate)
                errs.dirBirthdate = t("submit.errors.requiredBirthdate");
            else if (!isAdult(form.dirBirthdate))
                errs.dirBirthdate = t("submit.errors.mustBeAdult");
            if (!form.dirStreet.trim())
                errs.dirStreet = t("submit.errors.requiredAddress");
            if (!form.dirZip.trim()) errs.dirZip = t("submit.errors.requiredZip");
            else if (!onlyDigits(form.dirZip))
                errs.dirZip = t("submit.errors.invalidZip");
            if (!form.dirCity.trim()) errs.dirCity = t("submit.errors.requiredCity");
            if (!form.dirCountry)
                errs.dirCountry = t("submit.errors.requiredCountry");
            if (!form.dirJob) errs.dirJob = t("submit.errors.requiredJob");
            if (!form.discovery)
                errs.discovery = t("submit.errors.requiredDiscovery");
            if (!form.legalName.trim())
                errs.legalName = t("submit.errors.requiredLegalName");
            if (!form.legalEmail.trim())
                errs.legalEmail = t("submit.errors.requiredLegalEmail");
            else if (!isValidEmail(form.legalEmail))
                errs.legalEmail = t("submit.errors.invalidEmail");
        }

        if (s === 1) {
            if (!form.title.trim()) errs.title = t("submit.errors.requiredTitle");
            if (!form.synopsis.trim())
                errs.synopsis = t("submit.errors.requiredSynopsis");
            if (!form.country) errs.country = t("submit.errors.requiredCountry");
            if (!form.language) errs.language = t("submit.errors.requiredLanguage");
            if (!form.category) errs.category = t("submit.errors.requiredCategory");
            if (!form.duration.trim())
                errs.duration = t("submit.errors.requiredDuration");
            else if (parseDuration(form.duration) > 120)
                errs.duration = t("submit.errors.maxDuration");
            else if (
                videoDetectedDuration !== null &&
                Math.abs(parseDuration(form.duration) - videoDetectedDuration) > 2
            )
                errs.duration = t("submit.errors.durationMismatch");
            if (form.aiTools.length === 0)
                errs.aiTools = t("submit.errors.requiredAiTools");
            if (form.semanticTags.length === 0)
                errs.semanticTags = t("submit.errors.requiredTags");
            if (!form.musicCredits.trim())
                errs.musicCredits = t("submit.errors.requiredMusic");
            if (!form.rightsConfirmed)
                errs.rightsConfirmed = t("submit.errors.requiredRights");
        }

        if (s === 2) {
            if (!form.videoFile) errs.videoFile = t("submit.errors.requiredVideo");
            else if (!isAllowedUploadFile("video", form.videoFile))
                errs.videoFile = t("submit.dropzone.invalidVideoType");
            else if (videoDetectedDuration !== null && videoDetectedDuration > 120)
                errs.videoFile = t("submit.errors.maxDuration");
            if (!form.posterFile) errs.posterFile = t("submit.errors.requiredPoster");
            else if (!isAllowedUploadFile("poster", form.posterFile))
                errs.posterFile = t("submit.dropzone.invalidPosterType");
            if (
                form.subtitlesFile &&
                !isAllowedUploadFile("subtitles", form.subtitlesFile)
            ) {
                errs.subtitlesFile = t("submit.dropzone.invalidSubtitlesType");
            }
        }

        if (s === 3) {
            if (!form.consentRules) errs.consentRules = t("submit.errors.required");
            if (!form.consentPromo) errs.consentPromo = t("submit.errors.required");
            if (!form.consentCopyright)
                errs.consentCopyright = t("submit.errors.required");
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const onVideoPicked = useCallback(
        async (file: File | null) => {
            set("videoFile", file as FormData["videoFile"]);
            if (!file) {
                setVideoDetectedDuration(null);
                return;
            }
            try {
                const detected = await readVideoDuration(file);
                setVideoDetectedDuration(detected);
                set("duration", formatDurationSeconds(detected));
            } catch {
                setVideoDetectedDuration(null);
            }
        },
        [set],
    );

    const next = () => {
        if (!validateStep(step)) return;
        if (step < 3) setStep((s) => (s + 1) as Step);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const prev = () => {
        setStep((s) => Math.max(0, s - 1) as Step);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const submit = async () => {
        if (!validateStep(3)) return;
        setSubmitting(true);
        setSubmitError(null);

        try {
            const fd = new window.FormData();

            fd.append("title", form.title);
            fd.append("synopsis", form.synopsis);
            fd.append("country", form.country);
            fd.append("language", form.language);
            fd.append("category", form.category);
            fd.append("year", form.year);
            fd.append("duration", form.duration);
            fd.append("aiTools", JSON.stringify(form.aiTools));
            fd.append("semanticTags", JSON.stringify(form.semanticTags));
            fd.append("musicCredits", form.musicCredits);
            fd.append("rightsConfirmed", String(form.rightsConfirmed));

            fd.append("directorName", form.dirName);
            fd.append("directorEmail", form.dirEmail);
            fd.append("directorPhone", form.dirPhone);
            fd.append("directorStreet", form.dirStreet);
            fd.append("directorZip", form.dirZip);
            fd.append("directorCity", form.dirCity);
            fd.append("directorCountry", form.dirCountry);
            fd.append("directorBirthdate", form.dirBirthdate);
            fd.append("directorJob", form.dirJob);
            fd.append("directorSocials", JSON.stringify(form.socials));
            fd.append("discoverySource", form.discovery);

            fd.append("legalRefName", form.legalName);
            fd.append("legalRefEmail", form.legalEmail);

            fd.append("consentRules", String(form.consentRules));
            fd.append("consentPromo", String(form.consentPromo));
            fd.append("consentNewsletter", String(form.consentNewsletter));
            fd.append("consentCopyright", String(form.consentCopyright));

            if (form.videoFile) fd.append("video", form.videoFile);
            if (form.posterFile) fd.append("poster", form.posterFile);
            if (form.subtitlesFile) fd.append("subtitles", form.subtitlesFile);

            const res = await apiFetch("/api/submissions", {
                method: "POST",
                body: fd,
            });
            const raw = await res.text();
            let data: { id?: string; error?: string } | null = null;
            if (raw) {
                try {
                    data = JSON.parse(raw) as { id?: string; error?: string };
                } catch {
                    data = null;
                }
            }
            if (!res.ok) {
                throw new Error(
                    data?.error ||
                    raw ||
                    `${t("submit.errors.submitFailed")} (HTTP ${res.status})`,
                );
            }
            if (!data?.id || typeof data.id !== "string") {
                throw new Error(
                    raw
                        ? t("submit.errors.invalidServerResponse")
                        : "Réponse vide du serveur",
                );
            }

            setSubmissionId(data.id);
            setFormRaw((prev) => ({
                ...prev,
                videoFile: null,
                posterFile: null,
                subtitlesFile: null,
            }));
            setStep(4);
            window.scrollTo({ top: 0, behavior: "smooth" });
            toast({
                title: t("submit.doneTitle"),
                description: t("submit.doneText"),
                kind: "success",
            });
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : t("submit.errors.unknown");
            setSubmitError(message);
            toast({
                title: t("common.error"),
                description: message,
                kind: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (step === 4) {
        return (
            <PageShell size="sm">
                <SuccessScreen
                    submissionId={submissionId}
                    email={form.dirEmail}
                    onSubmitAnother={() => {
                        setSubmissionId("");
                        setSubmitError(null);
                        setErrors({});
                        setVideoDetectedDuration(null);
                        setStep(0);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                />
            </PageShell>
        );
    }

    return (
        <PageShell size="lg">
            <PageHeader
                eyebrow={t("submit.eyebrow")}
                title={
                    <>
                        {t("submit.titleLead")}{" "}
                        <span className="ml-3">
                            <AccentTitle>{t("submit.titleAccent")}</AccentTitle>
                        </span>
                    </>
                }
                subtitle={t("submit.subtitle")}
            />

            <div
                className="my-8"
                style={{ animation: "fadeUp 0.5s ease-out 0.1s both" }}
            >
                <StepBar current={step} />
            </div>

            {submitError && (
                <div className="mb-4 rounded-2xl border border-[#ff5c35]/25 bg-[#ff5c35]/8 p-4">
                    <div className="f-mono text-[10px] text-[#ff5c35]">
                        &gt; {submitError}
                    </div>
                </div>
            )}

            <div
                className="relative overflow-hidden rounded-3xl p-6 md:p-8"
                style={{
                    background: "var(--submit-surface-bg)",
                    border: "1px solid var(--submit-surface-border)",
                    animation: "fadeUp 0.5s ease-out 0.15s both",
                }}
            >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7d71fb]/40 to-transparent" />

                <div className="mb-6 flex items-center gap-3">
                    <div className="f-mono text-[9px] uppercase tracking-[0.2em] text-[#7d71fb]/60">
                        {t("submit.stepCounter", { current: step + 1, total: 4 })}
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-[#7d71fb]/20 to-transparent" />
                    <div className="f-orb text-sm font-black text-white">
                        {
                            [
                                t("submit.stepDirectorSheet"),
                                t("submit.stepFilmSheet"),
                                t("submit.stepUploads"),
                                t("submit.stepConsents"),
                            ][step]
                        }
                    </div>
                </div>

                {step === 0 && (
                    <StepDirector
                        form={form}
                        set={set}
                        errors={errors}
                        countries={smartOptions.countries}
                        jobs={smartOptions.jobs}
                        discoverySources={smartOptions.discoverySources}
                        socialNetworks={smartOptions.socialNetworks}
                    />
                )}
                {step === 1 && (
                    <StepFilm
                        form={form}
                        set={set}
                        errors={errors}
                        countries={smartOptions.countries}
                        languages={smartOptions.languages}
                        categories={smartOptions.categories}
                        aiToolSuggestions={smartOptions.aiToolSuggestions}
                        semanticTags={smartOptions.semanticTags}
                        detectedDurationSeconds={videoDetectedDuration}
                    />
                )}
                {step === 2 && (
                    <StepUploads
                        form={form}
                        set={set}
                        errors={errors}
                        onVideoPicked={onVideoPicked}
                    />
                )}
                {step === 3 && <StepConsents form={form} set={set} errors={errors} />}

                <div
                    className="mt-5 flex items-center justify-between gap-4"
                    style={{ animation: "fadeUp 0.5s ease-out 0.2s both" }}
                >
                    {step > 0 ? (
                        <Button
                            variant="outline"
                            onClick={prev}
                            className="f-mono rounded-xl px-5 text-[10px] uppercase tracking-widest transition-colors"
                            style={{
                                borderColor: "var(--submit-back-btn-border)",
                                background: "var(--submit-back-btn-bg)",
                                color: "var(--submit-back-btn-text)",
                            }}
                        >
                            {t("submit.back")}
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <Button
                            onClick={next}
                            className="cursor-pointer f-orb group relative overflow-hidden rounded-xl px-7 text-xs font-bold uppercase tracking-widest text-white hover:shadow-[0_0_30px_rgba(125,113,251,0.3)]"
                            style={{
                                background: "linear-gradient(135deg, #7d71fb, #ff5c35)",
                            }}
                        >
                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                            <span className="relative">{t("submit.next")}</span>
                        </Button>
                    ) : (
                        <Button
                            onClick={submit}
                            disabled={submitting}
                            className="cursor-pointer f-orb group relative overflow-hidden rounded-xl px-8 text-xs font-bold uppercase tracking-widest text-white disabled:opacity-60"
                            style={{
                                background: "linear-gradient(135deg, #7d71fb, #ff5c35)",
                                boxShadow: "0 0 40px rgba(125,113,251,0.35)",
                                animation: submitting
                                    ? "none"
                                    : "pulseGlow 2s ease-in-out infinite",
                            }}
                        >
                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                            {submitting ? (
                                <>
                                    <span
                                        className="relative h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                                        style={{ animation: "spin 0.8s linear infinite" }}
                                    />
                                    <span className="relative">{t("submit.submitting")}</span>
                                </>
                            ) : (
                                <span className="relative inline-flex items-center gap-2">
                                    <span className="text-[14px]">
                                        <RocketLaunchIcon fontSize="inherit" />
                                    </span>
                                    <span>{t("submit.submit")}</span>
                                </span>
                            )}
                        </Button>
                    )}
                </div>

                <p
                    className="f-mono mt-4 text-center text-[9px]"
                    style={{ color: "var(--submit-no-edit-hint)" }}
                >
                    {t("submit.noEditHint")}
                </p>
            </div>
        </PageShell>
    );
}
