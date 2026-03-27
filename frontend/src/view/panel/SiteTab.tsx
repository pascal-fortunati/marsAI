import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import { useTranslation } from "react-i18next";
import type { SiteSettings } from "./panelTypes";
import { GhostBtn, PrimaryBtn } from "./panelUi";
import { marsaiColors } from "./panelStyles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
import { Combobox } from "../../components/ui/combobox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import type { FestivalSettings } from "../../config/festival";

// ── MUI Icons ─────────────────────────────────────────────────────────────────
import PublicIcon from "@mui/icons-material/Public";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import TuneIcon from "@mui/icons-material/Tune";
import HomeIcon from "@mui/icons-material/Home";
import ShareIcon from "@mui/icons-material/Share";
import CategoryIcon from "@mui/icons-material/Category";
import TranslateIcon from "@mui/icons-material/Translate";
import FlagIcon from "@mui/icons-material/Flag";
import WorkIcon from "@mui/icons-material/Work";
import ExploreIcon from "@mui/icons-material/Explore";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SearchIcon from "@mui/icons-material/Search";
import PreviewIcon from "@mui/icons-material/Preview";
import ImageIcon from "@mui/icons-material/Image";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import SaveIcon from "@mui/icons-material/Save";
import LanguageIcon from "@mui/icons-material/Language";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LockIcon from "@mui/icons-material/Lock";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import {
  EN_COUNTRY_NAMES,
  EN_LANGUAGE_NAMES,
  FR_COUNTRY_NAMES,
  FR_LANGUAGE_NAMES,
  getCountryCode,
  getLanguageFlagCode,
  translateLanguageName,
} from "../../lib/countryMapping";
import * as Flags from "country-flag-icons/react/3x2";
import { SiteSkeleton } from "../../skeletons/SiteSkeleton";

type FlagComponent = ComponentType<SVGProps<SVGSVGElement>>;

// ─── utils ────────────────────────────────────────────────────────────────────

function parseArr(raw: string): string[] {
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p)
      ? p.map((v) => String(v ?? "").trim()).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

function parseSocials(raw: string): { key: string; label: string }[] {
  try {
    const p = JSON.parse(raw);
    if (!Array.isArray(p)) return [];
    return p
      .map((v) => ({
        key: String(v?.key ?? "").trim(),
        label: String(v?.label ?? "").trim(),
      }))
      .filter((v) => v.key && v.label);
  } catch {
    return [];
  }
}

function toJson(next: unknown[]) {
  return JSON.stringify(next);
}

function parseHome(raw: string): Record<string, unknown> {
  try {
    const p = JSON.parse(raw);
    return p && typeof p === "object" && !Array.isArray(p)
      ? (p as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

function setByPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  const keys = path.split(".");
  const next = { ...obj };
  let cur = next;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const child = cur[k];
    cur[k] =
      child && typeof child === "object" && !Array.isArray(child)
        ? { ...(child as Record<string, unknown>) }
        : {};
    cur = cur[k] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
  return next;
}

function daysInMonth(year: number, monthOneBased: number): number {
  return new Date(year, monthOneBased, 0).getDate();
}

function buildYmd(year: number, monthOneBased: number, day: number): string {
  const maxDay = daysInMonth(year, monthOneBased);
  const safeDay = Math.max(1, Math.min(maxDay, day));
  return `${String(year).padStart(4, "0")}-${String(monthOneBased).padStart(
    2,
    "0",
  )}-${String(safeDay).padStart(2, "0")}`;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const YEARS = Array.from({ length: 23 }, (_, i) => String(2020 + i));
const MONTHS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);

// ─── ListEditor ───────────────────────────────────────────────────────────────

function ListEditor({
  title,
  hint,
  values,
  onChange,
  placeholder,
  addLabel,
  removeLabel,
  icon,
}: {
  title: string;
  hint?: string;
  values: string[];
  onChange: (n: string[]) => void;
  placeholder: string;
  addLabel: string;
  removeLabel: string;
  icon?: React.ReactNode;
}) {
  const [draft, setDraft] = useState("");
  function add() {
    const v = draft.trim();
    if (!v) return;
    onChange([...values, v]);
    setDraft("");
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-white/40">{icon}</span>}
          <Label className="f-mono text-xs text-white/50">{title}</Label>
        </div>
        <Badge
          variant="secondary"
          className="f-mono text-xs tabular-nums px-2 py-0.5"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          {values.length} entrée{values.length !== 1 ? "s" : ""}
        </Badge>
      </div>
      {hint && <p className="f-mono text-xs text-white/30">{hint}</p>}
      {values.length > 0 && (
        <div className="rounded-lg border border-white/8 divide-y divide-white/8 overflow-hidden">
          {values.map((v, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 group hover:bg-white/[0.02] transition-colors"
            >
              <span className="f-mono text-xs text-white/20 w-5 shrink-0 text-center tabular-nums">
                {i + 1}
              </span>
              <Input
                value={v}
                onChange={(e) => {
                  const n = [...values];
                  n[i] = e.target.value;
                  onChange(n.filter(Boolean));
                }}
                className="f-mono border-0 bg-transparent shadow-none focus-visible:ring-0 h-7 p-0 text-sm flex-1"
              />
              <button
                onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                title={removeLabel}
                className="shrink-0 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded"
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </button>
            </div>
          ))}
        </div>
      )}
      {values.length === 0 && (
        <div className="rounded-lg border border-dashed border-white/10 px-4 py-5 flex flex-col items-center gap-1.5 text-center">
          <span className="text-white/15">
            {icon ?? <LocalOfferIcon sx={{ fontSize: 20 }} />}
          </span>
          <p className="f-mono text-xs text-white/25">
            Aucune entrée pour l'instant
          </p>
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className="f-mono text-sm"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={add}
          disabled={!draft.trim()}
          className="f-mono shrink-0"
        >
          <AddIcon sx={{ fontSize: 14 }} className="mr-1.5" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}

function ChecklistEditor({
  title,
  hint,
  values,
  allOptions,
  onChange,
  searchPlaceholder,
  selectAllLabel,
  clearAllLabel,
  getFlagCode,
  getValueKey,
}: {
  title: string;
  hint?: string;
  values: string[];
  allOptions: string[];
  onChange: (n: string[]) => void;
  searchPlaceholder: string;
  selectAllLabel: string;
  clearAllLabel: string;
  getFlagCode?: (value: string) => string | null;
  getValueKey?: (value: string) => string;
}) {
  const [query, setQuery] = useState("");
  const valueKey = useCallback(
    (value: string) =>
      (getValueKey?.(value) ?? String(value || "")).trim().toLowerCase(),
    [getValueKey],
  );
  const selectedSet = useMemo(
    () =>
      new Set(
        values
          .map((v) => valueKey(String(v)))
          .map((v) => String(v).trim())
          .filter(Boolean),
      ),
    [values, valueKey],
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allOptions;
    return allOptions.filter((item) => item.toLowerCase().includes(q));
  }, [allOptions, query]);

  const toggle = (item: string, checked: boolean) => {
    const next = new Set(selectedSet);
    const key = valueKey(item);
    if (checked) next.add(key);
    else next.delete(key);
    onChange(allOptions.filter((name) => next.has(valueKey(name))));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="f-mono text-xs text-[color:var(--panel-subtle-text)]">
          {title}
        </Label>
        <Badge
          variant="secondary"
          className="f-mono text-xs tabular-nums"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          {selectedSet.size} / {allOptions.length} sélectionné
          {selectedSet.size !== 1 ? "s" : ""}
        </Badge>
      </div>
      {hint && (
        <p className="f-mono text-xs text-[color:var(--panel-muted-text)]">
          {hint}
        </p>
      )}

      {/* Barre de recherche avec icône */}
      <div className="relative">
        <SearchIcon
          sx={{ fontSize: 15 }}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[color:var(--panel-muted-text)]"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="f-mono text-sm pl-8"
        />
      </div>

      {/* Boutons select all / clear all avec icônes */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          className="f-mono h-8 text-xs"
          onClick={() => onChange([...allOptions])}
        >
          <CheckBoxIcon sx={{ fontSize: 13 }} className="mr-1.5" />
          {selectAllLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="f-mono h-8 text-xs"
          onClick={() => onChange([])}
        >
          <CheckBoxOutlineBlankIcon sx={{ fontSize: 13 }} className="mr-1.5" />
          {clearAllLabel}
        </Button>
        {query && (
          <span className="f-mono ml-auto text-xs text-[color:var(--panel-muted-text)]">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="rounded-lg border border-white/8 p-2">
        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/[0.04] cursor-pointer transition-colors"
            >
              <Checkbox
                checked={selectedSet.has(valueKey(item))}
                onCheckedChange={(v) => toggle(item, Boolean(v))}
                className="h-4 w-4 border-[color:var(--panel-checkbox-border)] bg-[color:var(--panel-checkbox-bg)] data-[state=checked]:border-[#7d71fb]/80 data-[state=checked]:bg-[#7d71fb] data-[state=checked]:text-white data-[state=checked]:shadow-[0_0_12px_rgba(125,113,251,0.35)]"
              />
              {(() => {
                const code = getFlagCode?.(item);
                if (!code) return null;
                const Flag = (Flags as Record<string, FlagComponent>)[code];
                return Flag ? (
                  <Flag className="h-3 w-4 shrink-0 rounded-[2px] object-cover shadow-sm" />
                ) : null;
              })()}
              <span className="f-mono text-xs text-[color:var(--panel-strong-text)]">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// SocialsEditor
function SocialsEditor({
  values,
  onChange,
  keyPlaceholder,
  labelPlaceholder,
  addLabel,
  removeLabel,
  keyTitle,
  labelTitle,
}: {
  title: string;
  hint: string;
  values: { key: string; label: string }[];
  onChange: (n: { key: string; label: string }[]) => void;
  keyPlaceholder: string;
  labelPlaceholder: string;
  addLabel: string;
  removeLabel: string;
  keyTitle: string;
  labelTitle: string;
}) {
  const [draftKey, setDraftKey] = useState("");
  const [draftLabel, setDraftLabel] = useState("");
  function add() {
    const k = draftKey.trim().toLowerCase().replace(/\s+/g, "_");
    const l = draftLabel.trim();
    if (!k || !l || values.some((v) => v.key === k)) return;
    onChange([...values, { key: k, label: l }]);
    setDraftKey("");
    setDraftLabel("");
  }
  return (
    <div className="flex flex-col gap-3">
      {values.length === 0 && (
        <div className="rounded-lg border border-dashed border-white/10 px-4 py-5 flex flex-col items-center gap-1.5 text-center">
          <ShareIcon sx={{ fontSize: 20 }} className="text-white/15" />
          <p className="f-mono text-xs text-white/25">
            Aucun réseau social configuré
          </p>
        </div>
      )}
      {values.length > 0 && (
        <div className="rounded-lg border border-white/8 overflow-hidden">
          <div className="grid grid-cols-[110px_1fr_32px] gap-2 px-3 py-2 bg-white/[0.03] border-b border-white/8">
            <span className="f-mono text-[10px] uppercase tracking-wider text-white/30">
              {keyTitle}
            </span>
            <span className="f-mono text-[10px] uppercase tracking-wider text-white/30">
              {labelTitle}
            </span>
          </div>
          {values.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-[110px_1fr_32px] items-center gap-2 px-3 py-2.5 border-b border-white/8 last:border-0 group hover:bg-white/[0.02] transition-colors"
            >
              <Badge
                variant="outline"
                className="f-mono text-[10px] justify-center truncate border-white/10"
              >
                {item.key}
              </Badge>
              <Input
                value={item.label}
                onChange={(e) => {
                  const n = [...values];
                  n[i] = { ...n[i], label: e.target.value };
                  onChange(n.filter((v) => v.key && v.label));
                }}
                className="f-mono border-0 bg-transparent shadow-none focus-visible:ring-0 h-7 p-0 text-sm"
              />
              <button
                onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                title={removeLabel}
                className="text-white/20 hover:text-red-400 transition-colors justify-self-center opacity-0 group-hover:opacity-100 p-1 rounded"
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={draftKey}
          onChange={(e) => setDraftKey(e.target.value)}
          placeholder={keyPlaceholder}
          className="f-mono text-sm w-28 shrink-0"
        />
        <Input
          value={draftLabel}
          onChange={(e) => setDraftLabel(e.target.value)}
          placeholder={labelPlaceholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className="f-mono text-sm flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={add}
          disabled={!draftKey.trim() || !draftLabel.trim()}
          className="f-mono shrink-0"
        >
          <AddIcon sx={{ fontSize: 14 }} className="mr-1.5" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}

/** Pill de langue avec drapeau emoji */
function LangPill({
  lang,
  active,
  onClick,
}: {
  lang: "fr" | "en";
  active: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  const emoji = lang === "fr" ? "🇫🇷" : "🇬🇧";
  const label =
    lang === "fr" ? t("panel.site.languageFr") : t("panel.site.languageEn");
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg f-mono text-xs font-medium transition-all
        ${
          active
            ? "bg-white/10 text-white border border-white/20 shadow-sm"
            : "text-white/40 border border-transparent hover:text-white/60 hover:bg-white/[0.04]"
        }
      `}
    >
      <span className="text-sm leading-none">{emoji}</span>
      {label}
    </button>
  );
}

/** Icône par section d'option */
const OPTION_ICONS: Record<string, React.ReactNode> = {
  categories: <CategoryIcon sx={{ fontSize: 14 }} />,
  languages: <TranslateIcon sx={{ fontSize: 14 }} />,
  countries: <FlagIcon sx={{ fontSize: 14 }} />,
  jobs: <WorkIcon sx={{ fontSize: 14 }} />,
  discovery: <ExploreIcon sx={{ fontSize: 14 }} />,
  aiTools: <SmartToyIcon sx={{ fontSize: 14 }} />,
  tags: <LocalOfferIcon sx={{ fontSize: 14 }} />,
};

/** Icône et couleur par phase */
const PHASE_META = [
  {
    icon: <LockIcon sx={{ fontSize: 15 }} />,
    labelKey: "panel.site.phaseMeta.submissionClose",
  },
  {
    icon: <MenuBookIcon sx={{ fontSize: 15 }} />,
    labelKey: "panel.site.phaseMeta.catalogueOpen",
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 15 }} />,
    labelKey: "panel.site.phaseMeta.palmares",
  },
];

// ─── SiteTab ──────────────────────────────────────────────────────────────────

export function SiteTab({
  loading,
  saving,
  msg,
  error,
  site,
  onSave,
  phase1Close,
  setPhase1Close,
  phase2Catalogue,
  setPhase2Catalogue,
  phase3Palmares,
  setPhase3Palmares,
  siteLogo,
  setSiteLogo,
  heroImageUrl,
  platformBaseUrl,
  setPlatformBaseUrl,
  setHeroImageUrl,
  festivalDescription,
  categoriesJson,
  setCategoriesJson,
  languagesJson,
  setLanguagesJson,
  countriesJson,
  setCountriesJson,
  jobsJson,
  setJobsJson,
  discoveryJson,
  setDiscoveryJson,
  aiToolsJson,
  setAiToolsJson,
  tagsJson,
  setTagsJson,
  socialsJson,
  setSocialsJson,
  homeFrJson,
  setHomeFrJson,
  homeEnJson,
  setHomeEnJson,
}: {
  loading: boolean;
  saving: boolean;
  msg: string | null;
  error: string | null;
  site: SiteSettings | null;
  onSave: () => void;
  phase1Close: string;
  setPhase1Close: (v: string) => void;
  phase2Catalogue: string;
  setPhase2Catalogue: (v: string) => void;
  phase3Palmares: string;
  setPhase3Palmares: (v: string) => void;
  siteLogo: string;
  setSiteLogo: (v: string) => void;
  heroImageUrl: string;
  platformBaseUrl: string;
  setPlatformBaseUrl: (v: string) => void;
  setHeroImageUrl: (v: string) => void;
  festivalDescription: string;
  categoriesJson: string;
  setCategoriesJson: (v: string) => void;
  languagesJson: string;
  setLanguagesJson: (v: string) => void;
  countriesJson: string;
  setCountriesJson: (v: string) => void;
  jobsJson: string;
  setJobsJson: (v: string) => void;
  discoveryJson: string;
  setDiscoveryJson: (v: string) => void;
  aiToolsJson: string;
  setAiToolsJson: (v: string) => void;
  tagsJson: string;
  setTagsJson: (v: string) => void;
  socialsJson: string;
  setSocialsJson: (v: string) => void;
  homeFrJson: string;
  setHomeFrJson: (v: string) => void;
  homeEnJson: string;
  setHomeEnJson: (v: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const [editorSection, setEditorSection] = useState<
    "home" | "submission" | "festival"
  >("home");
  const [optionTab, setOptionTab] = useState("categories");
  const [homeLang, setHomeLang] = useState<"fr" | "en">("fr");
  const [previewKey, setPreviewKey] = useState(1);
  const previewFrameRef = useRef<HTMLIFrameElement | null>(null);
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  });

  const categories = parseArr(categoriesJson);
  const languages = parseArr(languagesJson);
  const countries = parseArr(countriesJson);
  const jobs = parseArr(jobsJson);
  const discovery = parseArr(discoveryJson);
  const aiTools = parseArr(aiToolsJson);
  const tags = parseArr(tagsJson);
  const socials = parseSocials(socialsJson);
  const homeFr = parseHome(homeFrJson);
  const homeEn = parseHome(homeEnJson);
  const homeActive = homeLang === "fr" ? homeFr : homeEn;

  const allCountryOptions = useMemo(
    () =>
      (i18n.language?.startsWith("fr") ? FR_COUNTRY_NAMES : EN_COUNTRY_NAMES)
        .map((v) => String(v).trim())
        .filter(Boolean),
    [i18n.language],
  );
  const allLanguageOptions = useMemo(
    () =>
      (i18n.language?.startsWith("fr") ? FR_LANGUAGE_NAMES : EN_LANGUAGE_NAMES)
        .map((v) => String(v).trim())
        .filter(Boolean),
    [i18n.language],
  );

  const previewData: Partial<FestivalSettings> = useMemo(() => {
    const toIso = (raw: string): string | null => {
      if (!raw.trim()) return null;
      const ms = new Date(raw).getTime();
      return Number.isNaN(ms) ? null : new Date(ms).toISOString();
    };
    return {
      phase1CloseIso: toIso(phase1Close),
      phase2CatalogueIso: toIso(phase2Catalogue),
      phase3PalmaresIso: toIso(phase3Palmares),
      siteLogo: siteLogo || null,
      heroImageUrl: heroImageUrl || null,
      platformBaseUrl: platformBaseUrl || null,
      festivalDescription: festivalDescription || null,
      homeTranslations: {
        fr: parseHome(homeFrJson),
        en: parseHome(homeEnJson),
      },
    };
  }, [
    phase1Close,
    phase2Catalogue,
    phase3Palmares,
    siteLogo,
    heroImageUrl,
    platformBaseUrl,
    festivalDescription,
    homeFrJson,
    homeEnJson,
  ]);

  const monthLabelFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(
        i18n.language?.startsWith("fr") ? "fr-FR" : "en-US",
        { month: "long" },
      ),
    [i18n.language],
  );
  const phaseDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(
        i18n.language?.startsWith("fr") ? "fr-FR" : "en-US",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      ),
    [i18n.language],
  );

  const phases = [
    {
      label: t("panel.site.phase1"),
      color: marsaiColors.primary,
      val: phase1Close,
      set: setPhase1Close,
      meta: PHASE_META[0],
    },
    {
      label: t("panel.site.phase2"),
      color: marsaiColors.warning,
      val: phase2Catalogue,
      set: setPhase2Catalogue,
      meta: PHASE_META[1],
    },
    {
      label: t("panel.site.phase3"),
      color: marsaiColors.accent,
      val: phase3Palmares,
      set: setPhase3Palmares,
      meta: PHASE_META[2],
    },
  ].map((p) => {
    const [datePart = "", timePart = "00:00"] = (p.val || "").split("T");
    const [yearPart = "", monthPart = "", dayPart = ""] = datePart.split("-");
    const now = new Date();
    const baseYear = Number.parseInt(yearPart || "", 10);
    const baseMonth = Number.parseInt(monthPart || "", 10);
    const baseDay = Number.parseInt(dayPart || "", 10);
    const effectiveYear = Number.isInteger(baseYear)
      ? baseYear
      : now.getFullYear();
    const effectiveMonth =
      Number.isInteger(baseMonth) && baseMonth >= 1 && baseMonth <= 12
        ? baseMonth
        : now.getMonth() + 1;
    const effectiveDay =
      Number.isInteger(baseDay) && baseDay >= 1 ? baseDay : now.getDate();
    const maxDays = daysInMonth(effectiveYear, effectiveMonth);
    const dayOptions = Array.from({ length: maxDays }, (_, i) =>
      String(i + 1).padStart(2, "0"),
    );
    const [hourPart = "00", minutePart = "00"] = timePart.split(":");
    const withDate = (y: number, m: number, d: number) => buildYmd(y, m, d);
    const safeDay = Math.max(1, Math.min(maxDays, effectiveDay));
    const phaseDate = new Date(
      effectiveYear,
      effectiveMonth - 1,
      safeDay,
      Number.parseInt((hourPart || "00").slice(0, 2), 10) || 0,
      Number.parseInt((minutePart || "00").slice(0, 2), 10) || 0,
    );
    const formattedDate = Number.isNaN(phaseDate.getTime())
      ? `${String(safeDay).padStart(2, "0")}/${String(effectiveMonth).padStart(
          2,
          "0",
        )}/${effectiveYear} ${(hourPart || "00").slice(0, 2)}:${(
          minutePart || "00"
        ).slice(0, 2)}`
      : phaseDateFormatter.format(phaseDate);
    return {
      ...p,
      datePart,
      timePart: (timePart || "00:00").slice(0, 5),
      yearPart: yearPart || String(effectiveYear),
      monthPart: monthPart || String(effectiveMonth).padStart(2, "0"),
      dayPart: String(Math.max(1, Math.min(maxDays, effectiveDay))).padStart(
        2,
        "0",
      ),
      dayOptions,
      hourPart: (hourPart || "00").slice(0, 2),
      minutePart: (minutePart || "00").slice(0, 2),
      formattedDate,
      setYear: (year: string) => {
        const n = Number.parseInt(year, 10);
        if (!Number.isInteger(n)) return;
        p.set(
          `${withDate(n, effectiveMonth, effectiveDay)}T${(
            timePart || "00:00"
          ).slice(0, 5)}`,
        );
      },
      setMonth: (month: string) => {
        const n = Number.parseInt(month, 10);
        if (!Number.isInteger(n) || n < 1 || n > 12) return;
        p.set(
          `${withDate(effectiveYear, n, effectiveDay)}T${(
            timePart || "00:00"
          ).slice(0, 5)}`,
        );
      },
      setDay: (day: string) => {
        const n = Number.parseInt(day, 10);
        if (!Number.isInteger(n) || n < 1) return;
        p.set(
          `${withDate(effectiveYear, effectiveMonth, n)}T${(
            timePart || "00:00"
          ).slice(0, 5)}`,
        );
      },
      setHour: (hour: string) =>
        p.set(
          `${withDate(effectiveYear, effectiveMonth, effectiveDay)}T${hour}:${(
            minutePart || "00"
          ).slice(0, 2)}`,
        ),
      setMinute: (minute: string) =>
        p.set(
          `${withDate(effectiveYear, effectiveMonth, effectiveDay)}T${(
            hourPart || "00"
          ).slice(0, 2)}:${minute}`,
        ),
    };
  });

  const listFields = [
    {
      id: "categories",
      label: t("panel.site.jsonFields.categories"),
      values: categories,
      setter: (n: string[]) => setCategoriesJson(toJson(n)),
      ph: t("panel.site.placeholders.categories"),
    },
    {
      id: "languages",
      label: t("panel.site.jsonFields.languages"),
      values: languages,
      setter: (n: string[]) => setLanguagesJson(toJson(n)),
      ph: t("panel.site.placeholders.languages"),
    },
    {
      id: "countries",
      label: t("panel.site.jsonFields.countries"),
      values: countries,
      setter: (n: string[]) => setCountriesJson(toJson(n)),
      ph: t("panel.site.placeholders.countries"),
    },
    {
      id: "jobs",
      label: t("panel.site.jsonFields.jobs"),
      values: jobs,
      setter: (n: string[]) => setJobsJson(toJson(n)),
      ph: t("panel.site.placeholders.jobs"),
    },
    {
      id: "discovery",
      label: t("panel.site.jsonFields.discovery"),
      values: discovery,
      setter: (n: string[]) => setDiscoveryJson(toJson(n)),
      ph: t("panel.site.placeholders.discovery"),
    },
    {
      id: "aiTools",
      label: t("panel.site.jsonFields.aiTools"),
      values: aiTools,
      setter: (n: string[]) => setAiToolsJson(toJson(n)),
      ph: t("panel.site.placeholders.aiTools"),
    },
    {
      id: "tags",
      label: t("panel.site.jsonFields.tags"),
      values: tags,
      setter: (n: string[]) => setTagsJson(toJson(n)),
      ph: t("panel.site.placeholders.tags"),
    },
  ];
  const currentOption =
    listFields.find((f) => f.id === optionTab) ?? listFields[0];

  const homeTextFields = [
    "eyebrow",
    "terminal",
    "title1",
    "title2",
    "title3",
    "heroText",
    "ctaSubmit",
    "ctaCatalogue",
    "palmaresCta",
    "timeline",
    "statsNumbers.countries",
    "statsNumbers.filmsExpected",
    "statsNumbers.visitors",
    "place",
    "featureTitle1",
    "featureTitle2",
    "featureText",
    "featureCta",
    "themeTitle",
    "themeQuote",
  ];

  const homeFieldLabelKeys: Record<string, string> = {
    eyebrow: "panel.site.homeFieldLabels.eyebrow",
    terminal: "panel.site.homeFieldLabels.terminal",
    title1: "panel.site.homeFieldLabels.title1",
    title2: "panel.site.homeFieldLabels.title2",
    title3: "panel.site.homeFieldLabels.title3",
    heroText: "panel.site.homeFieldLabels.heroText",
    ctaSubmit: "panel.site.homeFieldLabels.ctaSubmit",
    ctaCatalogue: "panel.site.homeFieldLabels.ctaCatalogue",
    timeline: "panel.site.homeFieldLabels.timeline",
    themeTitle: "panel.site.homeFieldLabels.themeTitle",
    themeQuote: "panel.site.homeFieldLabels.themeQuote",
    featureTitle1: "panel.site.homeFieldLabels.featureTitle1",
    featureTitle2: "panel.site.homeFieldLabels.featureTitle2",
    featureText: "panel.site.homeFieldLabels.featureText",
    featureCta: "panel.site.homeFieldLabels.featureCta",
    palmaresCta: "panel.site.homeFieldLabels.palmaresCta",
    place: "panel.site.homeFieldLabels.place",
    "statsNumbers.countries": "panel.site.homeFieldLabels.statsCountries",
    "statsNumbers.filmsExpected":
      "panel.site.homeFieldLabels.statsFilmsExpected",
    "statsNumbers.visitors": "panel.site.homeFieldLabels.statsVisitors",
  };

  const previewTargetByHomePath: Record<string, string> = {
    eyebrow: "home.eyebrowText",
    terminal: "home.terminal",
    title1: "home.title1",
    title2: "home.title2",
    title3: "home.title3",
    heroText: "home.heroText",
    ctaSubmit: "home.ctaZone",
    ctaCatalogue: "home.ctaZone",
    timeline: "home.timeline",
    themeTitle: "home.themeTitle",
    themeQuote: "home.themeQuote",
    featureTitle1: "home.featureTitle1",
    featureTitle2: "home.featureTitle2",
    featureText: "home.featureText",
    palmaresCta: "home.ctaZone",
    featureCta: "home.featureSection",
    place: "home.place",
    "statsNumbers.countries": "home.statsNumbers.countries",
    "statsNumbers.filmsExpected": "home.statsNumbers.filmsExpected",
    "statsNumbers.visitors": "home.statsNumbers.visitors",
  };

  const sendPreviewFocus = (target: string) => {
    previewFrameRef.current?.contentWindow?.postMessage(
      { type: "marsai-preview-focus", target },
      window.location.origin,
    );
    if (target === "home.eyebrowText") {
      previewFrameRef.current?.contentWindow?.postMessage(
        { type: "marsai-preview-focus", target: "home.eyebrow" },
        window.location.origin,
      );
    }
  };

  function updateHomeText(lang: "fr" | "en", path: string, value: string) {
    const raw = lang === "fr" ? homeFr : homeEn;
    const next = setByPath(raw, path, value);
    if (lang === "fr") setHomeFrJson(JSON.stringify(next));
    else setHomeEnJson(JSON.stringify(next));
  }
  function updateHomeTags(lang: "fr" | "en", values: string[]) {
    const raw = lang === "fr" ? homeFr : homeEn;
    const next = setByPath(raw, "featureTags", values);
    if (lang === "fr") setHomeFrJson(JSON.stringify(next));
    else setHomeEnJson(JSON.stringify(next));
  }

  useEffect(() => {
    localStorage.setItem(
      "marsai_preview_home_draft",
      JSON.stringify(previewData),
    );
  }, [previewData]);

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () =>
      setPreviewTheme(
        root.getAttribute("data-theme") === "light" ? "light" : "dark",
      );
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    updateTheme();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const frame = previewFrameRef.current;
    if (!frame) return;
    try {
      frame.contentDocument?.documentElement?.setAttribute(
        "data-theme",
        previewTheme,
      );
    } catch {
      void 0;
    }
  }, [previewTheme]);

  if (loading) return <SiteSkeleton />;

  return (
    <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch">
      {/* ══ Éditeur 7/12 ══ */}
      <div className="lg:col-span-7 flex flex-col gap-0 h-full">
        <Card className="overflow-hidden h-full flex flex-col bg-[hsl(var(--card))]">
          {/* ── Header ── */}
          <CardHeader className="pb-0 pt-4 px-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] border border-white/10">
                  <PublicIcon sx={{ fontSize: 18 }} className="text-white/70" />
                </div>
                <div>
                  <CardTitle className="f-orb text-base">
                    {t("panel.site.editorTitle")}
                  </CardTitle>
                  <CardDescription className="f-mono text-xs mt-0.5">
                    {t("panel.site.editorHint")}
                  </CardDescription>
                </div>
              </div>

              {/* Feedback + Save */}
              <div className="flex items-center gap-3">
                {msg && (
                  <span className="f-mono text-sm text-emerald-400 flex items-center gap-1.5">
                    <CheckCircleIcon sx={{ fontSize: 15 }} />
                    {msg}
                  </span>
                )}
                {error && (
                  <span className="f-mono text-sm text-red-400 flex items-center gap-1.5">
                    <ErrorIcon sx={{ fontSize: 15 }} />
                    {error}
                  </span>
                )}
                <PrimaryBtn onClick={onSave} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshIcon
                        sx={{ fontSize: 14 }}
                        className="mr-1.5 animate-spin"
                      />
                      {t("panel.site.saving")}
                    </>
                  ) : (
                    <>
                      <SaveIcon sx={{ fontSize: 14 }} className="mr-1.5" />
                      {t("panel.site.save")}
                    </>
                  )}
                </PrimaryBtn>
              </div>
            </div>

            {/* ── Onglets navigation principaux ── */}
            <div className="mt-4">
              <Tabs
                value={editorSection}
                onValueChange={(v) =>
                  setEditorSection(v as typeof editorSection)
                }
              >
                <TabsList className="w-full justify-start rounded-none border-b border-white/8 bg-transparent p-0 h-auto">
                  {(
                    [
                      {
                        id: "home",
                        icon: <HomeIcon sx={{ fontSize: 14 }} />,
                        label: t("panel.site.sections.home"),
                      },
                      {
                        id: "submission",
                        icon: <TuneIcon sx={{ fontSize: 14 }} />,
                        label: t("panel.site.sections.submission"),
                      },
                      {
                        id: "festival",
                        icon: <EventIcon sx={{ fontSize: 14 }} />,
                        label: t("panel.site.sections.festival"),
                      },
                    ] as const
                  ).map((s) => (
                    <TabsTrigger
                      key={s.id}
                      value={s.id}
                      className="f-mono flex cursor-pointer items-center gap-1.5 rounded-none border-b-2 border-transparent px-4 pb-3 pt-1 text-xs text-[color:var(--panel-tab-text)] data-[state=active]:border-[color:var(--panel-tab-active-border)] data-[state=active]:bg-transparent data-[state=active]:text-[color:var(--panel-tab-active-text)]"
                    >
                      {s.icon}
                      {s.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          {/* ── Contenu scrollable ── */}
          <CardContent className="p-0">
            <div className="max-h-none">
              <div className="p-4">
                <Tabs
                  value={editorSection}
                  onValueChange={(v) =>
                    setEditorSection(v as typeof editorSection)
                  }
                >
                  {/* ════════════ HOME ════════════ */}
                  <TabsContent
                    value="home"
                    className="mt-0 flex flex-col gap-5"
                  >
                    {/* Champs hero + footer */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="flex flex-col gap-1.5">
                        <Label className="f-mono text-xs text-white/50 flex items-center gap-1.5">
                          <ImageIcon
                            sx={{ fontSize: 13 }}
                            className="text-white/30"
                          />
                          {i18n.language?.startsWith("fr")
                            ? "Logo du site"
                            : "Site logo"}
                        </Label>
                        <Input
                          value={siteLogo}
                          onChange={(e) => setSiteLogo(e.target.value)}
                          onFocus={() => sendPreviewFocus("siteLogo")}
                          placeholder={
                            i18n.language?.startsWith("fr")
                              ? "https://.../logo.png"
                              : "https://.../logo.png"
                          }
                          className="f-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="f-mono text-xs text-white/50 flex items-center gap-1.5">
                          <ImageIcon
                            sx={{ fontSize: 13 }}
                            className="text-white/30"
                          />
                          {t("panel.site.hero")}
                        </Label>
                        <Input
                          value={heroImageUrl}
                          onChange={(e) => setHeroImageUrl(e.target.value)}
                          onFocus={() => sendPreviewFocus("heroImageUrl")}
                          placeholder={t("panel.site.placeholders.hero")}
                          className="f-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="f-mono text-xs text-white/50 flex items-center gap-1.5">
                          <TextFieldsIcon
                            sx={{ fontSize: 13 }}
                            className="text-white/30"
                          />
                          {t("panel.site.platformBaseUrl")}
                        </Label>
                        <Input
                          value={platformBaseUrl}
                          onChange={(e) => setPlatformBaseUrl(e.target.value)}
                          onFocus={() => sendPreviewFocus("platformBaseUrl")}
                          placeholder={t(
                            "panel.site.placeholders.platformBaseUrl",
                          )}
                          className="f-mono"
                        />
                      </div>
                    </div>

                    {/* ── Bloc textes home ── */}
                    <div className="rounded-xl border border-white/8 overflow-hidden">
                      {/* Header du bloc avec switcher de langue bien visible */}
                      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/8">
                        <div className="flex items-center gap-2">
                          <LanguageIcon
                            sx={{ fontSize: 15 }}
                            className="text-white/40"
                          />
                          <div>
                            <p className="f-orb text-sm">
                              {t("panel.site.homeTextTitle")}
                            </p>
                            <p className="f-mono text-xs text-white/30 mt-0.5">
                              {t("panel.site.homeTextHint")}
                            </p>
                          </div>
                        </div>

                        {/* Switcher langue amélioré */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/8">
                          <LangPill
                            lang="fr"
                            active={homeLang === "fr"}
                            onClick={() => setHomeLang("fr")}
                          />
                          <LangPill
                            lang="en"
                            active={homeLang === "en"}
                            onClick={() => setHomeLang("en")}
                          />
                        </div>
                      </div>

                      {/* Indicateur de langue active */}
                      <div
                        className="px-4 py-2 border-b border-white/6 flex items-center gap-2"
                        style={{
                          background:
                            homeLang === "fr"
                              ? "rgba(0, 82, 204, 0.06)"
                              : "rgba(204, 0, 0, 0.04)",
                        }}
                      >
                        <span className="text-base leading-none">
                          {homeLang === "fr" ? "🇫🇷" : "🇬🇧"}
                        </span>
                        <span className="f-mono text-[10px] uppercase tracking-wider text-white/30">
                          {t("panel.site.editingInProgress")}{" "}
                          <strong className="text-white/50">
                            {homeLang === "fr"
                              ? t("panel.site.languageFr")
                              : t("panel.site.languageEn")}
                          </strong>
                        </span>
                      </div>

                      <div className="p-4 grid gap-4">
                        {homeTextFields.map((path) => (
                          <div key={path} className="flex flex-col gap-1.5">
                            <Label className="f-mono text-[10px] uppercase tracking-wider text-white/30">
                              {t(homeFieldLabelKeys[path] ?? path)}
                            </Label>
                            {["heroText", "featureText", "themeQuote"].includes(
                              path,
                            ) ? (
                              <Textarea
                                rows={3}
                                value={String(
                                  getByPath(homeActive, path) ?? "",
                                )}
                                onChange={(e) =>
                                  updateHomeText(homeLang, path, e.target.value)
                                }
                                onFocus={() =>
                                  sendPreviewFocus(
                                    previewTargetByHomePath[path] ??
                                      `home.${path}`,
                                  )
                                }
                                className="f-mono text-sm resize-none"
                              />
                            ) : (
                              <Input
                                value={String(
                                  getByPath(homeActive, path) ?? "",
                                )}
                                onChange={(e) =>
                                  updateHomeText(homeLang, path, e.target.value)
                                }
                                onFocus={() =>
                                  sendPreviewFocus(
                                    previewTargetByHomePath[path] ??
                                      `home.${path}`,
                                  )
                                }
                                className="f-mono text-sm"
                              />
                            )}
                          </div>
                        ))}
                        <div>
                          <ListEditor
                            title={t("panel.site.festivalKeywordsTitle")}
                            icon={<LocalOfferIcon sx={{ fontSize: 13 }} />}
                            values={
                              Array.isArray(
                                getByPath(homeActive, "featureTags"),
                              )
                                ? (
                                    getByPath(
                                      homeActive,
                                      "featureTags",
                                    ) as string[]
                                  ).map(String)
                                : []
                            }
                            onChange={(next) => updateHomeTags(homeLang, next)}
                            placeholder={t("panel.site.placeholders.tags")}
                            addLabel={t("panel.site.addOption")}
                            removeLabel={t("panel.site.removeOption")}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* ════════════ SUBMISSION ════════════ */}
                  <TabsContent
                    value="submission"
                    className="mt-0 flex flex-col gap-5"
                  >
                    {/* Listes d'options */}
                    <div className="rounded-xl border border-white/8 overflow-hidden">
                      <div className="px-4 py-3 bg-white/[0.02] border-b border-white/8">
                        <p className="f-orb text-sm flex items-center gap-2">
                          <TuneIcon
                            sx={{ fontSize: 15 }}
                            className="text-white/40"
                          />
                          {t("panel.site.optionsTitle")}
                        </p>
                        <p className="f-mono text-xs text-white/30 mt-0.5 ml-[23px]">
                          {t("panel.site.optionsCompactHint")}
                        </p>
                      </div>
                      <div className="p-4 flex flex-col gap-4">
                        {/* Tabs avec icônes par catégorie */}
                        <Tabs value={optionTab} onValueChange={setOptionTab}>
                          <TabsList className="h-auto flex-wrap gap-1 rounded-xl border border-white/8 bg-white/[0.04] p-1">
                            {listFields.map((lf) => (
                              <TabsTrigger
                                key={lf.id}
                                value={lf.id}
                                className="f-mono flex cursor-pointer items-center gap-1.5 rounded-lg border border-transparent text-xs text-[color:var(--panel-tab-text)] data-[state=active]:border-[#7d71fb]/45 data-[state=active]:bg-[#7d71fb]/20 data-[state=active]:text-[color:var(--panel-tab-active-text)]"
                              >
                                <span className="opacity-80">
                                  {OPTION_ICONS[lf.id]}
                                </span>
                                {lf.label}
                                <Badge
                                  variant="secondary"
                                  className="tab-count f-mono text-[10px] ml-0.5 tabular-nums"
                                  style={{
                                    background: "var(--panel-tab-count-bg)",
                                    color: "var(--panel-tab-count-text)",
                                  }}
                                >
                                  {lf.values.length}
                                </Badge>
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </Tabs>

                        {currentOption &&
                          (currentOption.id === "countries" ||
                          currentOption.id === "languages" ? (
                            <ChecklistEditor
                              title={currentOption.label}
                              values={currentOption.values}
                              allOptions={
                                currentOption.id === "countries"
                                  ? allCountryOptions
                                  : allLanguageOptions
                              }
                              onChange={currentOption.setter}
                              searchPlaceholder={currentOption.ph}
                              selectAllLabel={t("panel.site.selectAll")}
                              clearAllLabel={t("panel.site.clearAll")}
                              getFlagCode={
                                currentOption.id === "countries"
                                  ? getCountryCode
                                  : getLanguageFlagCode
                              }
                              getValueKey={
                                currentOption.id === "countries"
                                  ? (value) =>
                                      getCountryCode(value) ??
                                      String(value || "")
                                        .trim()
                                        .toLowerCase()
                                  : (value) =>
                                      translateLanguageName(
                                        String(value || ""),
                                        "en",
                                      )
                                        .trim()
                                        .toLowerCase()
                              }
                            />
                          ) : (
                            <ListEditor
                              title={currentOption.label}
                              icon={OPTION_ICONS[currentOption.id]}
                              values={currentOption.values}
                              onChange={currentOption.setter}
                              placeholder={currentOption.ph}
                              addLabel={t("panel.site.addOption")}
                              removeLabel={t("panel.site.removeOption")}
                            />
                          ))}
                      </div>
                    </div>

                    {/* Réseaux sociaux */}
                    <div className="rounded-xl border border-white/8 overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/8">
                        <ShareIcon
                          sx={{ fontSize: 15 }}
                          className="text-white/40"
                        />
                        <div>
                          <p className="f-orb text-sm">
                            {t("panel.site.jsonFields.socials")}
                          </p>
                          <p className="f-mono text-xs text-white/30 mt-0.5">
                            {t("panel.site.socialsHint")}
                          </p>
                        </div>
                      </div>
                      <div className="p-4">
                        <SocialsEditor
                          title={t("panel.site.jsonFields.socials")}
                          hint={t("panel.site.socialsHint")}
                          values={socials}
                          onChange={(next) => setSocialsJson(toJson(next))}
                          keyPlaceholder={t(
                            "panel.site.placeholders.socialKey",
                          )}
                          labelPlaceholder={t(
                            "panel.site.placeholders.socialLabel",
                          )}
                          addLabel={t("panel.site.addOption")}
                          removeLabel={t("panel.site.removeOption")}
                          keyTitle={t("panel.site.socialKey")}
                          labelTitle={t("panel.site.socialLabel")}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* ════════════ FESTIVAL ════════════ */}
                  <TabsContent value="festival" className="mt-0">
                    <div className="rounded-xl border border-white/8 overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/8">
                        <EventIcon
                          sx={{ fontSize: 15 }}
                          className="text-white/40"
                        />
                        <div>
                          <p className="f-orb text-sm">
                            {t("panel.site.phasesTitle")}
                          </p>
                          <p className="f-mono text-xs text-white/30 mt-0.5">
                            {t("panel.site.phasesHint")}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col gap-4">
                        {phases.map((p) => (
                          <div
                            key={p.label}
                            className="rounded-2xl border border-white/10 px-4 py-4 flex flex-col gap-4 bg-white/[0.02]"
                            style={{
                              boxShadow: `inset 0 0 0 1px ${p.color}22`,
                            }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <span
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10"
                                  style={{
                                    color: `${p.color}cc`,
                                    background: `${p.color}14`,
                                  }}
                                >
                                  {p.meta.icon}
                                </span>
                                <Label
                                  className="f-mono text-[11px] uppercase tracking-wider"
                                  style={{ color: `${p.color}d9` }}
                                >
                                  {t(p.meta.labelKey)}
                                </Label>
                              </div>
                              <span
                                className="f-mono text-[10px] uppercase tracking-widest rounded-md px-2 py-1 border"
                                style={{
                                  color: `${p.color}cc`,
                                  borderColor: `${p.color}55`,
                                  background: `${p.color}14`,
                                }}
                              >
                                {p.label}
                              </span>
                            </div>

                            <div className="flex flex-nowrap items-stretch gap-3 overflow-x-auto pb-1">
                              <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3 shrink-0">
                                <div className="mb-2 flex items-center gap-1.5">
                                  <CalendarTodayIcon
                                    sx={{ fontSize: 13 }}
                                    className="text-white/35 shrink-0"
                                  />
                                  <span className="f-mono text-[10px] uppercase tracking-wider text-white/45">
                                    {t("panel.site.selectDate")}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Combobox
                                    value={p.dayPart}
                                    onChange={p.setDay}
                                    options={p.dayOptions.map((day) => ({
                                      value: day,
                                      label: day,
                                    }))}
                                    placeholder={p.dayPart}
                                    searchable={false}
                                    className="f-mono h-8 w-[92px] text-xs"
                                    contentClassName="min-w-[108px]"
                                  />
                                  <span className="f-mono text-[10px] text-white/30">
                                    /
                                  </span>
                                  <Combobox
                                    value={p.monthPart}
                                    onChange={p.setMonth}
                                    options={MONTHS.map((month) => ({
                                      value: month,
                                      label: monthLabelFormatter.format(
                                        new Date(2026, Number(month) - 1, 1),
                                      ),
                                    }))}
                                    placeholder={monthLabelFormatter.format(
                                      new Date(
                                        2026,
                                        Number(p.monthPart) - 1,
                                        1,
                                      ),
                                    )}
                                    searchable={false}
                                    className="f-mono h-8 w-[148px] text-xs"
                                    contentClassName="min-w-[170px]"
                                  />
                                  <span className="f-mono text-[10px] text-white/30">
                                    /
                                  </span>
                                  <Combobox
                                    value={p.yearPart}
                                    onChange={p.setYear}
                                    options={YEARS.map((year) => ({
                                      value: year,
                                      label: year,
                                    }))}
                                    placeholder={p.yearPart}
                                    searchable={false}
                                    className="f-mono h-8 w-[96px] text-xs"
                                    contentClassName="min-w-[108px]"
                                  />
                                </div>
                              </div>

                              <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3 shrink-0">
                                <div className="mb-2 flex items-center gap-1.5">
                                  <AccessTimeIcon
                                    sx={{ fontSize: 13 }}
                                    className="text-white/35 shrink-0"
                                  />
                                  <span className="f-mono text-[10px] uppercase tracking-wider text-white/45">
                                    {t("panel.site.selectHour")}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Combobox
                                    value={p.hourPart}
                                    onChange={p.setHour}
                                    options={HOURS.map((hour) => ({
                                      value: hour,
                                      label: t("panel.site.timeHour", {
                                        value: hour,
                                      }),
                                    }))}
                                    placeholder={t("panel.site.selectHour")}
                                    searchable={false}
                                    className="f-mono h-8 w-[96px] text-xs"
                                    contentClassName="min-w-[126px]"
                                  />
                                  <span className="f-mono text-xs text-white/35">
                                    :
                                  </span>
                                  <Combobox
                                    value={p.minutePart}
                                    onChange={p.setMinute}
                                    options={MINUTES.map((minute) => ({
                                      value: minute,
                                      label: t("panel.site.timeMinute", {
                                        value: minute,
                                      }),
                                    }))}
                                    placeholder={t("panel.site.selectMinute")}
                                    searchable={false}
                                    className="f-mono h-8 w-[96px] text-xs"
                                    contentClassName="min-w-[126px]"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="rounded-lg border border-white/8 bg-black/20 px-3 py-2">
                              <span className="f-mono text-[10px] text-white/40">
                                {i18n.language?.startsWith("fr")
                                  ? "Date (FR)"
                                  : "Localized date"}
                                &nbsp;:
                              </span>
                              <span className="f-mono text-[11px] text-white/70 ml-1.5 tabular-nums">
                                {p.formattedDate}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══ Preview 5/12 ══ */}
      <div className="lg:col-span-5 h-full">
        <Card className="overflow-hidden h-full flex flex-col bg-[hsl(var(--card))]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] border border-white/10">
                  <PreviewIcon
                    sx={{ fontSize: 18 }}
                    className="text-white/70"
                  />
                </div>
                <div>
                  <CardTitle className="f-orb text-base">
                    {t("panel.site.previewTitle")}
                  </CardTitle>
                  <CardDescription className="f-mono text-xs mt-0.5">
                    {t("panel.site.previewIframeHint")}
                  </CardDescription>
                </div>
              </div>
              <GhostBtn
                small
                onClick={() => setPreviewKey((v) => v + 1)}
                disabled={saving}
              >
                <RefreshIcon
                  sx={{ fontSize: 14 }}
                  className={`mr-1.5 ${saving ? "animate-spin" : ""}`}
                />
                {t("panel.site.refresh")}
              </GhostBtn>
            </div>
          </CardHeader>
          <Separator />
          <div className="flex-1 min-h-0">
            <div className="p-3 h-full">
              <div className="overflow-hidden rounded-xl border border-white/8 h-full">
                <iframe
                  ref={previewFrameRef}
                  key={previewKey}
                  title="home-preview"
                  src={`/?previewHome=1&lang=${homeLang}&previewMobile=1&theme=${previewTheme}&v=${previewKey}`}
                  className="w-full h-full border-0"
                  scrolling="yes"
                  onLoad={() => {
                    try {
                      previewFrameRef.current?.contentDocument?.documentElement?.setAttribute(
                        "data-theme",
                        previewTheme,
                      );
                    } catch {
                      void 0;
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {!site && (
            <div className="px-4 py-3 border-t border-white/8">
              <p className="f-mono text-xs text-white/30">
                {t("panel.site.noData")}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
