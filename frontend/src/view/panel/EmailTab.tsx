import { useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { PrimaryBtn } from "./panelUi";

// ── MUI Icons ─────────────────────────────────────────────────────────────────
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SendIcon from "@mui/icons-material/Send";
import SubjectIcon from "@mui/icons-material/Subject";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import TitleIcon from "@mui/icons-material/Title";
import NotesIcon from "@mui/icons-material/Notes";
import CodeIcon from "@mui/icons-material/Code";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CancelIcon from "@mui/icons-material/Cancel";
import RateReviewIcon from "@mui/icons-material/RateReview";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import GavelIcon from "@mui/icons-material/Gavel";
import PersonIcon from "@mui/icons-material/Person";
import FestivalIcon from "@mui/icons-material/Festival";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import LayersIcon from "@mui/icons-material/Layers";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MovieIcon from "@mui/icons-material/Movie";
import { EMAIL_TEMPLATE_NAME } from "../../theme/emailTemplate";
import { EmailSkeleton } from "../../skeletons/EmailSkeleton";

// ── Types ─────────────────────────────────────────────────────────────────────

type LocalizedSubmissionTemplate = { subject?: string; text?: string };
type SubmissionTemplateConfig = {
  fr?: LocalizedSubmissionTemplate;
  en?: LocalizedSubmissionTemplate;
};
type LocalizedDecisionTemplate = {
  subject?: string;
  title?: string;
  body?: string;
};
type DecisionStatus =
  | "pending"
  | "validated"
  | "selected"
  | "refused"
  | "review";
type DecisionTemplatesConfig = Record<
  DecisionStatus,
  { fr?: LocalizedDecisionTemplate; en?: LocalizedDecisionTemplate }
>;
type EditableFieldElement = HTMLInputElement | HTMLTextAreaElement;

const DECISION_STATUSES: DecisionStatus[] = [
  "pending",
  "validated",
  "selected",
  "refused",
  "review",
];

const STATUS_META: Record<
  DecisionStatus,
  {
    color: string;
    bg: string;
    border: string;
    icon: ReactNode;
  }
> = {
  pending: {
    color: "#a1a1aa",
    bg: "rgba(161,161,170,0.08)",
    border: "rgba(161,161,170,0.2)",
    icon: <HourglassEmptyIcon sx={{ fontSize: 14 }} />,
  },
  validated: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    icon: <CheckCircleIcon sx={{ fontSize: 14 }} />,
  },
  selected: {
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.2)",
    icon: <EmojiEventsIcon sx={{ fontSize: 14 }} />,
  },
  refused: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
    icon: <CancelIcon sx={{ fontSize: 14 }} />,
  },
  review: {
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
    icon: <RateReviewIcon sx={{ fontSize: 14 }} />,
  },
};

// ── Variables avec métadonnées ─────────────────────────────────────────────────

type VarMeta = {
  token: string;
  icon: ReactNode;
  description: string;
  badgeColor: string;
  badgeText: string;
  usedIn: ("submission" | "decision")[];
};

type VarGroup = {
  id: string;
  label: string;
  icon: ReactNode;
  accentColor: string;
  vars: VarMeta[];
};

function buildVarGroups(t: (key: string) => string): VarGroup[] {
  return [
    {
      id: "artist",
      label: t("panel.email.varGroups.artist"),
      icon: <PersonIcon sx={{ fontSize: 14 }} />,
      accentColor: "#a78bfa",
      vars: [
        {
          token: "{{artist_name}}",
          icon: <PersonIcon sx={{ fontSize: 11 }} />,
          description: t("panel.email.varDescriptions.artistName"),
          badgeColor: "bg-violet-500/15",
          badgeText: "text-violet-300",
          usedIn: ["submission", "decision"],
        },
        {
          token: "{{directorName}}",
          icon: <PersonIcon sx={{ fontSize: 11 }} />,
          description: t("panel.email.varDescriptions.directorNameLegacy"),
          badgeColor: "bg-violet-500/15",
          badgeText: "text-violet-300",
          usedIn: ["submission", "decision"],
        },
      ],
    },
    {
      id: "festival",
      label: t("panel.email.varGroups.festival"),
      icon: <FestivalIcon sx={{ fontSize: 14 }} />,
      accentColor: "#f59e0b",
      vars: [
        {
          token: "{{festival_name}}",
          icon: <FestivalIcon sx={{ fontSize: 11 }} />,
          description: t("panel.email.varDescriptions.festivalName"),
          badgeColor: "bg-amber-500/15",
          badgeText: "text-amber-300",
          usedIn: ["submission", "decision"],
        },
        {
          token: "{{contact_email}}",
          icon: <ContactMailIcon sx={{ fontSize: 11 }} />,
          description: t("panel.email.varDescriptions.contactEmail"),
          badgeColor: "bg-amber-500/15",
          badgeText: "text-amber-300",
          usedIn: ["decision"],
        },
      ],
    },
    {
      id: "film",
      label: t("panel.email.varGroups.film"),
      icon: <MovieIcon sx={{ fontSize: 14 }} />,
      accentColor: "#38bdf8",
      vars: [
        {
          token: "{{filmTitle}}",
          icon: <MovieIcon sx={{ fontSize: 11 }} />,
          description: t("panel.email.varDescriptions.filmTitle"),
          badgeColor: "bg-sky-500/15",
          badgeText: "text-sky-300",
          usedIn: ["submission", "decision"],
        },
      ],
    },
    {
      id: "submission",
      label: t("panel.email.varGroups.submission"),
      icon: <SendIcon sx={{ fontSize: 14 }} />,
      accentColor: "#34d399",
      vars: [
        {
          token: "{{submission_id}}",
          icon: <FingerprintIcon sx={{ fontSize: 11 }} />,
          description: t("panel.email.varDescriptions.submissionId"),
          badgeColor: "bg-emerald-500/15",
          badgeText: "text-emerald-300",
          usedIn: ["submission"],
        },
        {
          token: "{{submissionId}}",
          icon: <FingerprintIcon sx={{ fontSize: 11 }} />,
          description: t("panel.email.varDescriptions.submissionIdLegacy"),
          badgeColor: "bg-emerald-500/15",
          badgeText: "text-emerald-300",
          usedIn: ["submission"],
        },
        {
          token: "{{submission_date}}",
          icon: <CalendarTodayIcon sx={{ fontSize: 11 }} />,
          description: t("panel.email.varDescriptions.submissionDate"),
          badgeColor: "bg-emerald-500/15",
          badgeText: "text-emerald-300",
          usedIn: ["submission"],
        },
      ],
    },
    {
      id: "decision",
      label: t("panel.email.varGroups.decision"),
      icon: <GavelIcon sx={{ fontSize: 14 }} />,
      accentColor: "#60a5fa",
      vars: [
        {
          token: "{{decision_date}}",
          icon: <CalendarTodayIcon sx={{ fontSize: 11 }} />,
          description: t("panel.email.varDescriptions.decisionDate"),
          badgeColor: "bg-blue-500/15",
          badgeText: "text-blue-300",
          usedIn: ["decision"],
        },
        {
          token: "{{stage}}",
          icon: <LayersIcon sx={{ fontSize: 11 }} />,
          description: t("panel.email.varDescriptions.stage"),
          badgeColor: "bg-blue-500/15",
          badgeText: "text-blue-300",
          usedIn: ["decision"],
        },
      ],
    },
  ];
}

// ── Utils ─────────────────────────────────────────────────────────────────────

function parseObject<T>(raw: unknown, fallback: T): T {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw as T;
  if (typeof raw !== "string") return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
      return parsed as T;
  } catch {
    return fallback;
  }
  return fallback;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function LangBlock({ lang }: { lang: "fr" | "en" }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/8 w-fit">
      <span className="text-sm leading-none">
        {lang === "fr" ? "🇫🇷" : "🇬🇧"}
      </span>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-white/50">
        {lang === "fr"
          ? t("panel.email.languageFr")
          : t("panel.email.languageEn")}
      </span>
    </div>
  );
}

function FieldLabel({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <Label className="font-mono text-[10px] font-medium tracking-wider text-white/30 uppercase flex items-center gap-1.5">
      {icon && <span className="text-white/20">{icon}</span>}
      {children}
    </Label>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8 bg-[hsl(var(--secondary))]">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--card))] border border-white/10 shrink-0">
        <span className="text-white/50">{icon}</span>
      </div>
      <div>
        <p className="f-orb text-sm text-white/80">{title}</p>
        {description && (
          <p className="font-mono text-[11px] text-white/30 mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/** Sidebar fixe des variables à gauche */
function VariablesSidebar({
  activeFieldId,
  onInsert,
  copiedToken,
  onCopy,
}: {
  activeFieldId: string | null;
  onInsert: (token: string) => void;
  copiedToken: string | null;
  onCopy: (token: string) => void;
}) {
  const { t } = useTranslation();
  const varGroups = buildVarGroups(t);
  const isActive = !!activeFieldId;

  // Détermine si le champ actif est "submission" ou "decision"
  const activeSection = activeFieldId?.startsWith("submission")
    ? "submission"
    : activeFieldId?.startsWith("decision")
      ? "decision"
      : null;

  const hasSubmissionSupport = (group: VarGroup) =>
    group.vars.some((v) => v.usedIn.includes("submission"));
  const hasDecisionSupport = (group: VarGroup) =>
    group.vars.some((v) => v.usedIn.includes("decision"));

  return (
    <div className="w-full shrink-0 flex flex-col rounded-xl border border-white/8 overflow-hidden bg-[hsl(var(--card))] lg:sticky lg:top-47 lg:w-60">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-3 bg-[hsl(var(--secondary))] border-b border-white/8">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(var(--card))] border border-white/10">
          <CodeIcon sx={{ fontSize: 15 }} className="text-white/50" />
        </div>
        <div>
          <p className="f-orb text-xs text-white/70">Variables</p>
          <p className="font-mono text-[10px] text-white/30">
            {t("panel.email.variablesHint")}
          </p>
        </div>
      </div>

      {/* Indicateur champ actif */}
      <div
        className={`px-3.5 py-2 border-b border-white/8 flex items-center gap-2 transition-colors ${
          isActive ? "bg-emerald-500/[0.06]" : "bg-[hsl(var(--card))]"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 transition-colors ${
            isActive ? "bg-emerald-400" : "bg-white/15"
          }`}
        />
        <span
          className={`font-mono text-[10px] leading-snug transition-colors ${
            isActive ? "text-emerald-400/80" : "text-white/25"
          }`}
        >
          {isActive
            ? activeSection === "submission"
              ? t("panel.email.activeSubmissionTemplate")
              : t("panel.email.activeDecisionTemplate")
            : t("panel.email.activeFieldRequired")}
        </span>
      </div>

      {/* Groupes */}
      <div className="divide-y divide-white/[0.05]">
        {varGroups.map((group) => {
          // Griser les groupes non pertinents quand un champ est actif
          const groupRelevant =
            !activeSection ||
            group.vars.some((v) => v.usedIn.includes(activeSection));

          return (
            <div
              key={group.id}
              className={`transition-opacity ${
                !isActive || groupRelevant ? "opacity-100" : "opacity-35"
              }`}
            >
              {/* En-tête groupe */}
              <div className="flex items-center gap-2 px-3.5 py-2 bg-[hsl(var(--secondary))]">
                <span style={{ color: group.accentColor + "99" }}>
                  {group.icon}
                </span>
                <span
                  className="font-mono text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: group.accentColor + "bb" }}
                >
                  {group.label}
                </span>
                <span className="ml-auto inline-flex items-center gap-1">
                  {hasSubmissionSupport(group) && (
                    <span className="rounded border border-emerald-500 bg-emerald-500 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white">
                      SUB
                    </span>
                  )}
                  {hasDecisionSupport(group) && (
                    <span className="rounded border border-sky-500 bg-sky-500 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white">
                      DEC
                    </span>
                  )}
                </span>
              </div>

              {/* Variables */}
              <div className="px-2 py-2 flex flex-col gap-1">
                {group.vars.map((v) => {
                  const varRelevant =
                    !activeSection || v.usedIn.includes(activeSection);
                  return (
                    <div
                      key={v.token}
                      className="group relative rounded-lg p-1.5 hover:bg-[hsl(var(--secondary))] transition-colors"
                    >
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() =>
                            isActive && varRelevant && onInsert(v.token)
                          }
                          disabled={!isActive || !varRelevant}
                          title={
                            !isActive
                              ? t("panel.email.activeFieldRequired")
                              : !varRelevant
                                ? t("panel.email.unavailableForTemplate")
                                : `${t("panel.email.insertToken")} ${v.token}`
                          }
                          className={`
                            relative inline-flex items-center rounded-md px-6 py-1 font-mono text-[10px] font-medium
                            border transition-all w-full justify-center text-center
                            ${v.badgeColor} ${v.badgeText} border-white/10
                            ${
                              isActive && varRelevant
                                ? "hover:brightness-125 cursor-pointer active:scale-[0.98]"
                                : "opacity-40 cursor-not-allowed"
                            }
                          `}
                        >
                          <span className="absolute left-2 opacity-60 shrink-0">
                            {v.icon}
                          </span>
                          <span className="truncate text-[10px] text-center">
                            {v.token}
                          </span>
                          {isActive && varRelevant && (
                            <AddCircleOutlineIcon
                              sx={{ fontSize: 10 }}
                              className="absolute right-2 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity"
                            />
                          )}
                        </button>
                        <p className="font-mono text-[10px] text-white/25 mt-1 pl-1 leading-snug">
                          {v.description}
                        </p>
                      </div>

                      {/* Copier */}
                      <button
                        type="button"
                        onClick={() => onCopy(v.token)}
                        title={t("panel.email.copy")}
                        className="absolute right-2 top-2 p-1 rounded text-white/25 hover:text-white/60 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        {copiedToken === v.token ? (
                          <CheckCircleOutlineIcon
                            sx={{ fontSize: 12 }}
                            className="text-emerald-400"
                          />
                        ) : (
                          <ContentCopyIcon sx={{ fontSize: 12 }} />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-start gap-2 px-3.5 py-3 bg-[hsl(var(--card))] border-t border-white/8">
        <InfoOutlinedIcon
          sx={{ fontSize: 12 }}
          className="text-white/20 mt-0.5 shrink-0"
        />
        <p className="font-mono text-[10px] text-white/25 leading-relaxed">
          {t("panel.email.dynamicReplacedHint")}
        </p>
      </div>
    </div>
  );
}

/** Bloc bilingue FR + EN */
function BilingualBlock({
  langs,
  fields,
  idPrefix,
  registerFieldRef,
  onActivateField,
}: {
  langs: {
    lang: "fr" | "en";
    values: Record<string, string>;
    onChange: (field: string, value: string) => void;
  }[];
  fields: {
    key: string;
    label: string;
    icon: ReactNode;
    multiline?: boolean;
    minH?: string;
  }[];
  idPrefix: string;
  registerFieldRef: (id: string, el: EditableFieldElement | null) => void;
  onActivateField: (id: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2">
      {langs.map(({ lang, values, onChange }, i) => (
        <div
          key={lang}
          className={`flex flex-col gap-3 p-4 ${
            i === 0 ? "border-b border-white/8 sm:border-b-0 sm:border-r" : ""
          }`}
        >
          <LangBlock lang={lang} />
          {fields.map(({ key, label, icon, multiline, minH }) => {
            const fieldId = `${idPrefix}:${lang}:${key}`;
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <FieldLabel icon={icon}>{label}</FieldLabel>
                {multiline ? (
                  <Textarea
                    ref={(el) => registerFieldRef(fieldId, el)}
                    value={values[key] ?? ""}
                    onChange={(e) => onChange(key, e.target.value)}
                    onFocus={() => onActivateField(fieldId)}
                    onClick={() => onActivateField(fieldId)}
                    onKeyUp={() => onActivateField(fieldId)}
                    className={`font-mono text-sm resize-none ${
                      minH ?? "min-h-[100px]"
                    }`}
                    placeholder="…"
                  />
                ) : (
                  <Input
                    ref={(el) => registerFieldRef(fieldId, el)}
                    value={values[key] ?? ""}
                    onChange={(e) => onChange(key, e.target.value)}
                    onFocus={() => onActivateField(fieldId)}
                    onClick={() => onActivateField(fieldId)}
                    onKeyUp={() => onActivateField(fieldId)}
                    className="font-mono text-sm"
                    placeholder="…"
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── EmailTab ──────────────────────────────────────────────────────────────────

export function EmailTab({
  loading,
  saving,
  msg,
  error,
  senderEmail,
  setSenderEmail,
  submissionTemplate,
  setSubmissionTemplate,
  decisionTemplates,
  setDecisionTemplates,
  onSave,
}: {
  loading: boolean;
  saving: boolean;
  msg: string | null;
  error: string | null;
  senderEmail: string;
  setSenderEmail: (v: string) => void;
  submissionTemplate: Record<string, unknown> | null;
  setSubmissionTemplate: (v: Record<string, unknown>) => void;
  decisionTemplates: Record<string, unknown> | null;
  setDecisionTemplates: (v: Record<string, unknown>) => void;
  onSave: () => Promise<void> | void;
}) {
  const { t } = useTranslation();
  const fieldRefs = useRef<Record<string, EditableFieldElement | null>>({});
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const submissionConfig = parseObject<SubmissionTemplateConfig>(
    submissionTemplate,
    { fr: {}, en: {} },
  );
  const decisionConfig = parseObject<DecisionTemplatesConfig>(
    decisionTemplates,
    {
      pending: { fr: {}, en: {} },
      validated: { fr: {}, en: {} },
      selected: { fr: {}, en: {} },
      refused: { fr: {}, en: {} },
      review: { fr: {}, en: {} },
    },
  );

  const setSubmissionField = (
    lang: "fr" | "en",
    field: string,
    value: string,
  ) =>
    setSubmissionTemplate({
      ...submissionConfig,
      [lang]: { ...(submissionConfig[lang] ?? {}), [field]: value },
    });

  const setDecisionField = (
    status: DecisionStatus,
    lang: "fr" | "en",
    field: string,
    value: string,
  ) =>
    setDecisionTemplates({
      ...decisionConfig,
      [status]: {
        ...(decisionConfig[status] ?? {}),
        [lang]: { ...(decisionConfig[status]?.[lang] ?? {}), [field]: value },
      },
    });

  const setFieldById = (fieldId: string, value: string) => {
    const p = fieldId.split(":");
    if (p[0] === "submission" && p.length === 3) {
      setSubmissionField(p[1] as "fr" | "en", p[2], value);
      return;
    }
    if (p[0] === "decision" && p.length === 4) {
      setDecisionField(
        p[1] as DecisionStatus,
        p[2] as "fr" | "en",
        p[3],
        value,
      );
    }
  };

  const getFieldValueById = (fieldId: string) => {
    const p = fieldId.split(":");
    if (p[0] === "submission" && p.length === 3)
      return String(
        submissionConfig?.[p[1] as "fr" | "en"]?.[
          p[2] as keyof LocalizedSubmissionTemplate
        ] ?? "",
      );
    if (p[0] === "decision" && p.length === 4)
      return String(
        decisionConfig?.[p[1] as DecisionStatus]?.[p[2] as "fr" | "en"]?.[
          p[3] as keyof LocalizedDecisionTemplate
        ] ?? "",
      );
    return "";
  };

  const insertVariable = (token: string) => {
    if (!activeFieldId) return;
    const el = fieldRefs.current[activeFieldId];
    const cur = getFieldValueById(activeFieldId);
    const start = el?.selectionStart ?? cur.length;
    const end = el?.selectionEnd ?? cur.length;
    const next = cur.slice(0, start) + token + cur.slice(end);
    setFieldById(activeFieldId, next);
    const pos = start + token.length;
    requestAnimationFrame(() => {
      const t = fieldRefs.current[activeFieldId!];
      t?.focus();
      t?.setSelectionRange(pos, pos);
    });
  };

  const copyToken = (token: string) => {
    void navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  if (loading) {
    return <EmailSkeleton />;
  }

  return (
    <div className="email-tab flex flex-col gap-5 lg:flex-row lg:items-start">
      {/* ══ Sidebar fixe ══ */}
      <VariablesSidebar
        activeFieldId={activeFieldId}
        onInsert={insertVariable}
        copiedToken={copiedToken}
        onCopy={copyToken}
      />

      {/* ══ Contenu principal ══ */}
      <div className="flex-1 min-w-0 grid gap-6">
        <Card className="bg-[hsl(var(--card))]">
          {/* Header */}
          <CardHeader className="flex flex-col items-start justify-between gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06]">
                <EmailIcon sx={{ fontSize: 18 }} className="text-white/60" />
              </div>
              <div>
                <CardTitle className="f-orb text-base text-white">
                  {t("panel.email.title")}
                </CardTitle>
                <p className="font-mono text-xs text-white/30 mt-0.5">
                  {t("panel.email.headerDescription")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {msg && (
                <span className="font-mono text-sm text-emerald-400 flex items-center gap-1.5">
                  <CheckCircleOutlineIcon sx={{ fontSize: 15 }} />
                  {msg}
                </span>
              )}
              {error && (
                <span className="font-mono text-sm text-red-400 flex items-center gap-1.5">
                  <ErrorOutlineIcon sx={{ fontSize: 15 }} />
                  {error}
                </span>
              )}
              <PrimaryBtn disabled={saving} onClick={() => void onSave()}>
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
          </CardHeader>

          <CardContent className="grid gap-6 pt-5">
            {/* Expéditeur */}
            <div className="rounded-xl border border-white/8 overflow-hidden bg-[hsl(var(--card))]">
              <SectionHeader
                icon={<AlternateEmailIcon sx={{ fontSize: 16 }} />}
                title={t("panel.email.senderEmail")}
                description={t("panel.email.senderDescription")}
              />
              <div className="p-4">
                <div className="relative max-w-sm">
                  <AlternateEmailIcon
                    sx={{ fontSize: 15 }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                  />
                  <Input
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="admin@festival.com"
                    className="font-mono pl-8"
                  />
                </div>
              </div>
            </div>

            {/* Template soumission */}
            <div className="rounded-xl border border-white/8 overflow-hidden bg-[hsl(var(--card))]">
              <SectionHeader
                icon={<SendIcon sx={{ fontSize: 16 }} />}
                title={t("panel.email.submissionTemplate")}
                description={`${t("panel.email.submissionDescription")} · ${t("panel.email.finalRenderVia")} ${EMAIL_TEMPLATE_NAME}`}
              />
              <BilingualBlock
                idPrefix="submission"
                registerFieldRef={(id, el) => {
                  fieldRefs.current[id] = el;
                }}
                onActivateField={setActiveFieldId}
                langs={[
                  {
                    lang: "fr",
                    values: {
                      subject: submissionConfig.fr?.subject ?? "",
                      text: submissionConfig.fr?.text ?? "",
                    },
                    onChange: (f, v) => setSubmissionField("fr", f, v),
                  },
                  {
                    lang: "en",
                    values: {
                      subject: submissionConfig.en?.subject ?? "",
                      text: submissionConfig.en?.text ?? "",
                    },
                    onChange: (f, v) => setSubmissionField("en", f, v),
                  },
                ]}
                fields={[
                  {
                    key: "subject",
                    label: t("panel.email.subject"),
                    icon: <SubjectIcon sx={{ fontSize: 11 }} />,
                  },
                  {
                    key: "text",
                    label: t("panel.email.text"),
                    icon: <NotesIcon sx={{ fontSize: 11 }} />,
                    multiline: true,
                  },
                ]}
              />
            </div>

            {/* Templates décision */}
            <div className="rounded-xl border border-white/8 overflow-hidden bg-[hsl(var(--card))]">
              <SectionHeader
                icon={<GavelIcon sx={{ fontSize: 16 }} />}
                title={t("panel.email.decisionTemplates")}
                description={`${t("panel.email.decisionDescription")} — ${t("panel.email.finalRenderVia")} ${EMAIL_TEMPLATE_NAME}`}
              />
              <div className="divide-y divide-white/[0.06]">
                {DECISION_STATUSES.map((status) => {
                  const meta = STATUS_META[status];
                  return (
                    <div key={status}>
                      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[hsl(var(--secondary))] border-b border-white/8">
                        <span style={{ color: meta.color }}>{meta.icon}</span>
                        <span
                          className="font-mono text-[11px] font-semibold uppercase tracking-widest"
                          style={{ color: meta.color }}
                        >
                          {t(`common.status.${status}`)}
                        </span>
                        <span className="ml-auto font-mono text-[10px] text-white/20">
                          {t(`panel.email.statusShort.${status}`)}
                        </span>
                      </div>
                      <BilingualBlock
                        idPrefix={`decision:${status}`}
                        registerFieldRef={(id, el) => {
                          fieldRefs.current[id] = el;
                        }}
                        onActivateField={setActiveFieldId}
                        langs={[
                          {
                            lang: "fr",
                            values: {
                              subject:
                                decisionConfig[status]?.fr?.subject ?? "",
                              title: decisionConfig[status]?.fr?.title ?? "",
                              body: decisionConfig[status]?.fr?.body ?? "",
                            },
                            onChange: (f, v) =>
                              setDecisionField(status, "fr", f, v),
                          },
                          {
                            lang: "en",
                            values: {
                              subject:
                                decisionConfig[status]?.en?.subject ?? "",
                              title: decisionConfig[status]?.en?.title ?? "",
                              body: decisionConfig[status]?.en?.body ?? "",
                            },
                            onChange: (f, v) =>
                              setDecisionField(status, "en", f, v),
                          },
                        ]}
                        fields={[
                          {
                            key: "subject",
                            label: t("panel.email.subject"),
                            icon: <SubjectIcon sx={{ fontSize: 11 }} />,
                          },
                          {
                            key: "title",
                            label: t("panel.email.titleField"),
                            icon: <TitleIcon sx={{ fontSize: 11 }} />,
                          },
                          {
                            key: "body",
                            label: t("panel.email.body"),
                            icon: <ArticleOutlinedIcon sx={{ fontSize: 11 }} />,
                            multiline: true,
                            minH: "min-h-[88px]",
                          },
                        ]}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
