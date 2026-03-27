import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import type { FestivalSettings } from "../config/festival";
import {
  isCatalogueAvailable,
  isPalmaresAvailable,
  isSubmissionOpen,
} from "../config/festival";
import { decodeJwtPayload, getStoredToken } from "../lib/api";
import { fetchPublicFestivalSettings } from "../lib/siteSettings";
import { setLanguage } from "../lib/i18n";
import { resolveInitialTheme, setTheme, type ThemeMode } from "../theme/theme";
import { marsaiColors } from "../theme/marsai";
import { useNavBarState } from "./NavBarStateContext";
import { useTranslation } from "react-i18next";

function FlagFR() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 rounded-full">
      <circle cx="12" cy="12" r="12" fill="#fff" />
      <path d="M0 0h8v24H0z" fill="#0055A4" />
      <path d="M16 0h8v24h-8z" fill="#EF4135" />
      <circle
        cx="12"
        cy="12"
        r="11.5"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
      />
    </svg>
  );
}

function FlagEN() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 rounded-full">
      <circle cx="12" cy="12" r="12" fill="#012169" />
      <path d="M0 0 24 24M24 0 0 24" stroke="#fff" strokeWidth="5" />
      <path d="M0 0 24 24M24 0 0 24" stroke="#C8102E" strokeWidth="2.3" />
      <path d="M12 0v24M0 12h24" stroke="#fff" strokeWidth="7" />
      <path d="M12 0v24M0 12h24" stroke="#C8102E" strokeWidth="4" />
      <circle
        cx="12"
        cy="12"
        r="11.5"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
      />
    </svg>
  );
}

function resolveNavLogoSrc(
  siteLogo: string | null | undefined,
  platformBaseUrl: string | null | undefined,
) {
  const raw = String(siteLogo || "").trim();
  if (!raw) return "";
  if (/^data:image\//i.test(raw)) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = String(platformBaseUrl || "").trim() || window.location.origin;
  try {
    return new URL(raw, base).toString();
  } catch {
    return "";
  }
}

function LangSwitch({
  className = "",
  currentLang,
  onChange,
}: {
  className?: string;
  currentLang: "fr" | "en";
  onChange: (lang: "fr" | "en") => void;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {[
        { key: "fr" as const, label: "Français" },
        { key: "en" as const, label: "English" },
      ].map((item) => {
        const active = currentLang === item.key;
        return (
          <button
            key={item.key}
            type="button"
            aria-label={item.label}
            onClick={() => onChange(item.key)}
            className="relative h-11 w-11 cursor-pointer rounded-full border text-sm transition-all duration-200"
            style={{
              borderColor: active
                ? "rgba(125,113,251,0.55)"
                : "rgba(255,255,255,0.15)",
              background: active
                ? "linear-gradient(135deg, rgba(125,113,251,0.22), rgba(255,92,53,0.2))"
                : "rgba(255,255,255,0.04)",
              boxShadow: active ? "0 0 14px rgba(125,113,251,0.25)" : "none",
            }}
          >
            <span className="flex items-center justify-center">
              {item.key === "fr" ? <FlagFR /> : <FlagEN />}
            </span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[#05030d] px-1 text-[8px] leading-3 text-white/75">
              {item.key.toUpperCase()}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ThemeSwitch({
  mode,
  onToggle,
}: {
  mode: ThemeMode;
  onToggle: () => void;
}) {
  const isLight = mode === "light";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isLight ? "Activer thème sombre" : "Activer thème clair"}
      className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border text-sm transition-all duration-200"
      style={{
        borderColor: isLight
          ? "rgba(125, 113, 251, 0.55)"
          : "rgba(125,113,251,0.45)",
        background: isLight
          ? "linear-gradient(135deg, rgba(125, 113, 251, 0.22), rgba(255, 92, 53, 0.2"
          : "linear-gradient(135deg, rgba(125,113,251,0.24), rgba(20,26,46,0.38))",
      }}
    >
      {isLight ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <circle cx="12" cy="12" r="4.5" fill="rgb(255, 92, 53)" />
          <path
            d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6"
            stroke="rgb(255, 92, 53)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M16.8 14.2A7 7 0 0 1 9.8 7.2a6.9 6.9 0 0 1 1.1-3.8 8.4 8.4 0 1 0 9.7 9.7 6.9 6.9 0 0 1-3.8 1.1Z"
            fill="rgb(255, 92, 53)"
          />
        </svg>
      )}
    </button>
  );
}

export function NavBar() {
  const { t, i18n } = useTranslation();
  const currentLang: "fr" | "en" = i18n.language?.startsWith("fr")
    ? "fr"
    : "en";
  const location = useLocation();
  const isPanel = location.pathname.startsWith("/panel");
  const isJury = location.pathname.startsWith("/jury");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
    resolveInitialTheme(),
  );
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [settings, setSettings] = useState<FestivalSettings | null>(null);
  const [failedLogoSrc, setFailedLogoSrc] = useState<string | null>(null);
  const [previewFocusTarget, setPreviewFocusTarget] = useState<string | null>(
    null,
  );
  const previewDraftRef = useRef<string | null>(null);
  const [role, setRole] = useState<string | null>(() => {
    const token = getStoredToken();
    const payload = token ? decodeJwtPayload<{ role?: string }>(token) : null;
    return payload?.role ?? null;
  });
  const { panel, jury } = useNavBarState();
  const previewMode = useMemo(
    () =>
      new URLSearchParams(window.location.search).get("previewHome") === "1",
    [],
  );
  const isLightTheme = themeMode === "light";

  useEffect(() => {
    setTheme(themeMode);
  }, [themeMode]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!previewMode) return;
    const applyDraft = () => {
      try {
        const raw = localStorage.getItem("marsai_preview_home_draft");
        if (!raw || raw === previewDraftRef.current) return;
        previewDraftRef.current = raw;
        const draft = JSON.parse(raw) as Partial<FestivalSettings>;
        const hasSiteLogo = Object.prototype.hasOwnProperty.call(
          draft,
          "siteLogo",
        );
        const hasPlatformBaseUrl = Object.prototype.hasOwnProperty.call(
          draft,
          "platformBaseUrl",
        );
        setSettings((prev) => ({
          ...(prev ?? {
            phase1CloseIso: null,
            phase2CatalogueIso: null,
            phase3PalmaresIso: null,
          }),
          siteLogo: hasSiteLogo
            ? (draft.siteLogo ?? null)
            : (prev?.siteLogo ?? null),
          platformBaseUrl: hasPlatformBaseUrl
            ? (draft.platformBaseUrl ?? null)
            : (prev?.platformBaseUrl ?? null),
        }));
      } catch {
        void 0;
      }
    };
    const id = window.setInterval(applyDraft, 250);
    const startId = window.setTimeout(applyDraft, 30);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(startId);
    };
  }, [previewMode]);

  useEffect(() => {
    if (!previewMode) return;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const payload = event.data as { type?: string; target?: string };
      if (
        payload?.type !== "marsai-preview-focus" ||
        typeof payload.target !== "string"
      )
        return;
      setPreviewFocusTarget(payload.target.trim() || null);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [previewMode]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetchPublicFestivalSettings(ac.signal)
      .then(setSettings)
      .catch(() => {});
    const id = setInterval(() => {
      fetchPublicFestivalSettings(ac.signal)
        .then(setSettings)
        .catch(() => {});
    }, 5 * 60_000);
    return () => {
      window.clearInterval(id);
      ac.abort();
    };
  }, []);

  useEffect(() => {
    const compute = () => {
      const token = getStoredToken();
      const payload = token ? decodeJwtPayload<{ role?: string }>(token) : null;
      setRole(payload?.role ?? null);
    };
    compute();
    window.addEventListener("storage", compute);
    window.addEventListener("hashchange", compute);
    return () => {
      window.removeEventListener("storage", compute);
      window.removeEventListener("hashchange", compute);
    };
  }, []);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    [
      "relative px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300",
      isActive
        ? "text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-gradient-to-r after:from-[#7d71fb] after:to-[#ff5c35]"
        : "text-white hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:h-px hover:after:w-full hover:after:bg-gradient-to-r hover:after:from-[#7d71fb] hover:after:to-[#ff5c35]",
    ].join(" ");

  const showCatalogue = isCatalogueAvailable(nowMs, settings);
  const showPalmares = isPalmaresAvailable(nowMs, settings);
  const showSubmit = isSubmissionOpen(nowMs, settings);
  const showPanel = role === "admin" || role === "moderator";
  const showJury = role === "jury";
  const configuredLogoSrc = resolveNavLogoSrc(
    settings?.siteLogo,
    settings?.platformBaseUrl,
  );
  const navLogoSrc =
    configuredLogoSrc && failedLogoSrc !== configuredLogoSrc
      ? configuredLogoSrc
      : "";
  const logoPreviewClass =
    previewFocusTarget === "siteLogo"
      ? isLightTheme
        ? "ring-4 ring-[#7d71fb] ring-offset-2 ring-offset-[#f4f7ff] shadow-[0_0_42px_rgba(125,113,251,0.45)]"
        : "ring-4 ring-[#7d71fb] ring-offset-2 ring-offset-[#05030d] shadow-[0_0_42px_rgba(125,113,251,0.65)]"
      : "";
  const logoImgStyle = isLightTheme
    ? {
        filter:
          "brightness(0) saturate(100%) invert(8%) sepia(42%) saturate(1827%) hue-rotate(230deg) brightness(72%) contrast(108%)",
      }
    : undefined;
  const logoTextStyle = isLightTheme
    ? { color: "rgba(20, 14, 80, 0.96)" }
    : undefined;
  const logoMaskStyle = isLightTheme
    ? {
        backgroundColor: "rgba(20, 14, 80, 0.96)",
        WebkitMaskImage: `url("${navLogoSrc}")`,
        maskImage: `url("${navLogoSrc}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }
    : undefined;

  if (isPanel) {
    if (!showPanel) return null;
    const subtitle = panel?.subtitle ?? t("nav.sessionActive");
    const stats = panel?.stats ?? {
      filmsTotal: 0,
      selectedText: "0/50",
      pendingCount: 0,
      validatedCount: 0,
      reviewCount: 0,
      refusedCount: 0,
      loading: false,
    };
    const tabs = panel?.tabs ?? [];
    const activeTab = panel?.activeTab ?? "";
    const onTabChange = panel?.onTabChange ?? (() => {});
    const setupIncomplete = Boolean(panel?.setupIncomplete);
    const onOpenSetup = panel?.onOpenSetup ?? (() => {});

    return (
      <div
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
          isLightTheme
            ? "border-[#7d71fb]/15 bg-white/80 shadow-[0_4px_40px_rgba(30,41,59,0.08)]"
            : "border-[#7d71fb]/20 bg-[#05030d]/90 shadow-[0_4px_60px_rgba(125,113,251,0.07)]"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7d71fb]/70 to-transparent" />
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-8">
          <div className="flex items-center justify-between py-4 sm:py-5">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl ${logoPreviewClass}`}
                data-preview-target="siteLogo"
              >
                {navLogoSrc ? (
                  isLightTheme ? (
                    <>
                      <img
                        src={navLogoSrc}
                        alt=""
                        className="hidden"
                        onError={() => {
                          if (navLogoSrc === configuredLogoSrc) {
                            setFailedLogoSrc(configuredLogoSrc);
                          }
                        }}
                      />
                      <span className="h-full w-full" style={logoMaskStyle} />
                    </>
                  ) : (
                    <img
                      src={navLogoSrc}
                      alt="marsAI"
                      className="h-full w-full object-contain"
                      style={logoImgStyle}
                      onError={() => {
                        if (navLogoSrc === configuredLogoSrc) {
                          setFailedLogoSrc(configuredLogoSrc);
                        }
                      }}
                    />
                  )
                ) : null}
              </Link>
              <div>
                <div
                  className="f-orb text-base font-black text-white"
                  style={logoTextStyle}
                >
                  MARS<span style={{ color: marsaiColors.accent }}>AI</span>
                  <span className="ml-2 hidden text-white/25 sm:inline">·</span>
                  <span className="ml-2 hidden text-white/55 sm:inline">
                    {t("nav.dashboard")}
                  </span>
                </div>
                <div className="f-mono hidden text-xs text-white/28 sm:block">
                  {stats.loading ? t("common.loading") : subtitle}
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center divide-x divide-white/8">
              {[
                {
                  label: t("nav.stats.films"),
                  val: stats.filmsTotal,
                  color: "text-white",
                },
                {
                  label: t("nav.stats.selected"),
                  val: stats.selectedText,
                  color: "text-[#7d71fb]",
                },
                {
                  label: t("nav.stats.pending"),
                  val: stats.pendingCount,
                  color: "text-[#f59e0b]",
                },
                {
                  label: t("nav.stats.validated"),
                  val: stats.validatedCount,
                  color: "text-[#22c55e]",
                  hideSm: true,
                },
                {
                  label: t("nav.stats.review"),
                  val: stats.reviewCount,
                  color: "text-[#a855f7]",
                  hideSm: true,
                },
                {
                  label: t("nav.stats.refused"),
                  val: stats.refusedCount,
                  color: "text-[#ef4444]",
                  hideSm: true,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`${
                    s.hideSm ? "hidden lg:block" : ""
                  } px-8 text-center`}
                >
                  <div className={`f-orb text-2xl font-black ${s.color}`}>
                    {s.val}
                  </div>
                  <div className="f-mono text-xs text-white/28 mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {setupIncomplete ? (
                <button
                  type="button"
                  onClick={onOpenSetup}
                  className="f-mono hidden h-9 items-center gap-1.5 rounded-full border border-[#ff5c35]/35 bg-[#ff5c35]/12 px-3 text-[10px] uppercase tracking-widest text-[#ff9f86] transition hover:bg-[#ff5c35]/20 hover:text-[#ffc3b2] sm:inline-flex"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff5c35]" />
                  {t("nav.setup")}
                </button>
              ) : null}
              <LangSwitch currentLang={currentLang} onChange={setLanguage} />
              <ThemeSwitch
                mode={themeMode}
                onToggle={() =>
                  setThemeMode((prev) => (prev === "dark" ? "light" : "dark"))
                }
              />
              <button
                className="flex flex-col gap-1 p-2 md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span
                  className={`block h-px w-5 ${
                    isLightTheme ? "bg-slate-700" : "bg-white"
                  } transition-all duration-300 ${
                    menuOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-px w-5 ${
                    isLightTheme ? "bg-slate-700" : "bg-white"
                  } transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-px w-5 ${
                    isLightTheme ? "bg-slate-700" : "bg-white"
                  } transition-all duration-300 ${
                    menuOpen ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {tabs.length > 0 ? (
            <div className="hidden gap-0 border-t border-white/6 md:flex">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => onTabChange(t.key)}
                  className={`f-mono relative flex min-w-[130px] flex-none cursor-pointer items-center justify-center gap-2 px-3 py-3 text-xs transition-colors sm:flex-1 sm:py-4 sm:text-sm ${
                    activeTab === t.key
                      ? "text-[#7d71fb] border-b-2 border-[#7d71fb]"
                      : "text-white hover:text-[#7d71fb] border-b-2 border-transparent hover:border-[#7d71fb]"
                  }`}
                >
                  <span className="truncate">{t.label}</span>
                  {t.badge != null && t.badge > 0 && (
                    <span
                      className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
                      style={{ background: marsaiColors.accent }}
                    >
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : null}

          {tabs.length > 0 ? (
            <div
              className={`overflow-hidden transition-all duration-300 md:hidden ${
                menuOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              <div
                className={`f-mono flex flex-col gap-px border-t border-white/8 px-2 py-2 backdrop-blur-xl ${
                  isLightTheme ? "bg-white/90" : "bg-[#05030d]/95"
                }`}
              >
                {tabs.map((t) => (
                  <button
                    key={`mobile-${t.key}`}
                    onClick={() => onTabChange(t.key)}
                    className={`flex items-center justify-between rounded px-3 py-2.5 text-xs tracking-widest transition-all ${
                      activeTab === t.key
                        ? "bg-[#7d71fb]/10 text-[#7d71fb]"
                        : isLightTheme
                          ? "text-slate-500 hover:bg-slate-900/5 hover:text-slate-700"
                          : "text-white/40 hover:bg-white/5 hover:text-white/70"
                    }`}
                  >
                    <span>{t.label}</span>
                    {t.badge != null && t.badge > 0 ? (
                      <span
                        className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
                        style={{ background: marsaiColors.accent }}
                      >
                        {t.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
                {setupIncomplete ? (
                  <button
                    type="button"
                    onClick={onOpenSetup}
                    className="mt-1 flex items-center justify-between rounded border border-[#ff5c35]/25 bg-[#ff5c35]/10 px-3 py-2.5 text-xs tracking-widest text-[#ffb39f]"
                  >
                    <span>{t("nav.setup")}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff5c35]" />
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (isJury) {
    if (!showJury) return null;
    const stats = jury?.stats ?? { voted: 0, total: 0, pct: 0, done: false };

    return (
      <div
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
          isLightTheme
            ? "border-[#7d71fb]/15 bg-white/80 shadow-[0_4px_40px_rgba(30,41,59,0.08)]"
            : "border-[#7d71fb]/20 bg-[#05030d]/90 shadow-[0_4px_60px_rgba(125,113,251,0.07)]"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7d71fb]/70 to-transparent" />
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-8">
          <div className="flex items-center justify-between py-4 sm:py-5">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl ${logoPreviewClass}`}
                data-preview-target="siteLogo"
              >
                {navLogoSrc ? (
                  isLightTheme ? (
                    <>
                      <img
                        src={navLogoSrc}
                        alt=""
                        className="hidden"
                        onError={() => {
                          if (navLogoSrc === configuredLogoSrc) {
                            setFailedLogoSrc(configuredLogoSrc);
                          }
                        }}
                      />
                      <span className="h-full w-full" style={logoMaskStyle} />
                    </>
                  ) : (
                    <img
                      src={navLogoSrc}
                      alt="marsAI"
                      className="h-full w-full object-contain"
                      style={logoImgStyle}
                      onError={() => {
                        if (navLogoSrc === configuredLogoSrc) {
                          setFailedLogoSrc(configuredLogoSrc);
                        }
                      }}
                    />
                  )
                ) : null}
              </Link>
              <div>
                <div
                  className="f-orb text-base font-black text-white"
                  style={logoTextStyle}
                >
                  MARS<span style={{ color: marsaiColors.accent }}>AI</span>
                  <span className="mx-2 text-white/25">·</span>
                  <span className="text-white/55">{t("nav.jurySpace")}</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center divide-x divide-white/8">
              {[
                {
                  label: t("nav.stats.films"),
                  val: stats.total,
                  color: "text-white",
                },
                {
                  label: t("jury.voted"),
                  val: stats.voted,
                  color: "text-[#22c55e]",
                },
                {
                  label: t("jury.remaining"),
                  val: Math.max(0, stats.total - stats.voted),
                  color: "text-[#f59e0b]",
                },
                {
                  label: t("nav.stats.progress"),
                  val: `${stats.pct}%`,
                  color: "text-[#7d71fb]",
                },
              ].map((s) => (
                <div key={s.label} className="px-6 text-center">
                  <div className={`f-orb text-2xl font-black ${s.color}`}>
                    {s.val}
                  </div>
                  <div className="f-mono text-xs text-white/28 mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <LangSwitch currentLang={currentLang} onChange={setLanguage} />
              <ThemeSwitch
                mode={themeMode}
                onToggle={() =>
                  setThemeMode((prev) => (prev === "dark" ? "light" : "dark"))
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={[
          "sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? isLightTheme
              ? "border-b border-[#7d71fb]/15 bg-white/72 backdrop-blur-xl shadow-[0_4px_40px_rgba(30,41,59,0.08)] supports-[backdrop-filter]:bg-white/65"
              : "border-b border-[#7d71fb]/20 bg-[#05030d]/55 backdrop-blur-xl shadow-[0_4px_60px_rgba(125,113,251,0.07)] supports-[backdrop-filter]:bg-[#05030d]/45"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7d71fb]/70 to-transparent" />

        <nav className="mx-auto flex max-w-screen-2xl items-center gap-6 px-8 py-5">
          <Link to="/" className="flex items-center gap-4 shrink-0">
            <div
              className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl ${logoPreviewClass}`}
              data-preview-target="siteLogo"
            >
              {navLogoSrc ? (
                isLightTheme ? (
                  <>
                    <img
                      src={navLogoSrc}
                      alt=""
                      className="hidden"
                      onError={() => {
                        if (navLogoSrc === configuredLogoSrc) {
                          setFailedLogoSrc(configuredLogoSrc);
                        }
                      }}
                    />
                    <span className="h-full w-full" style={logoMaskStyle} />
                  </>
                ) : (
                  <img
                    src={navLogoSrc}
                    alt="marsAI"
                    className="h-full w-full object-contain"
                    style={logoImgStyle}
                    onError={() => {
                      if (navLogoSrc === configuredLogoSrc) {
                        setFailedLogoSrc(configuredLogoSrc);
                      }
                    }}
                  />
                )
              ) : null}
            </div>
            <div>
              <div
                className="f-orb text-base font-black text-white"
                style={logoTextStyle}
              >
                MARS<span style={{ color: marsaiColors.accent }}>AI</span>
              </div>
              <div className="f-mono text-xs text-white/28">
                {t("nav.festival")}
                {tick % 2 === 0 ? "▮" : " "}
              </div>
            </div>
          </Link>

          <div className="hidden flex-1 items-center gap-1 md:flex">
            <div className="h-px flex-1 bg-gradient-to-r from-[#7d71fb]/20 to-transparent" />
            <span className="f-mono text-[10px] text-white/28 tracking-widest">
              {t("nav.statusOpen")}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-[#ff5c35]/20 to-transparent" />
          </div>

          <div className="hidden items-center gap-1 md:flex f-mono">
            {showSubmit ? (
              <NavLink to="/submit" className={linkCls}>
                {t("nav.submit")}
              </NavLink>
            ) : null}
            {showCatalogue ? (
              <>
                {showSubmit ? <span className="text-white/10">|</span> : null}
                <NavLink to="/catalogue" className={linkCls}>
                  {t("nav.catalogue")}
                </NavLink>
              </>
            ) : null}
            {showPalmares ? (
              <>
                <span className="text-white/10">|</span>
                <NavLink to="/palmares" className={linkCls}>
                  {t("nav.palmares")}
                </NavLink>
              </>
            ) : null}
            {showJury ? (
              <>
                <span className="text-white/10">|</span>
                <NavLink to="/jury" className={linkCls}>
                  {t("nav.jury")}
                </NavLink>
              </>
            ) : null}
            {showPanel ? (
              <>
                <span className="text-white/10">|</span>
                <NavLink to="/panel" className={linkCls}>
                  {t("nav.panel")}
                </NavLink>
              </>
            ) : null}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <LangSwitch currentLang={currentLang} onChange={setLanguage} />
            <ThemeSwitch
              mode={themeMode}
              onToggle={() =>
                setThemeMode((prev) => (prev === "dark" ? "light" : "dark"))
              }
            />
            <button
              className="flex flex-col gap-1 p-2 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span
                className={`block h-px w-5 ${
                  isLightTheme ? "bg-slate-700" : "bg-white"
                } transition-all duration-300 ${
                  menuOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 ${
                  isLightTheme ? "bg-slate-700" : "bg-white"
                } transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-px w-5 ${
                  isLightTheme ? "bg-slate-700" : "bg-white"
                } transition-all duration-300 ${
                  menuOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>

        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            menuOpen ? "max-h-64" : "max-h-0"
          }`}
        >
          <div
            className={`f-mono flex flex-col gap-px border-t border-white/8 px-4 py-3 backdrop-blur-xl ${
              isLightTheme ? "bg-white/90" : "bg-[#05030d]/95"
            }`}
          >
            {[
              {
                to: "/submit",
                label: `// ${t("nav.submit").toUpperCase()}`,
                show: showSubmit,
              },
              {
                to: "/catalogue",
                label: `// ${t("nav.catalogue").toUpperCase()}`,
                show: showCatalogue,
              },
              {
                to: "/palmares",
                label: `// ${t("nav.palmares").toUpperCase()}`,
                show: showPalmares,
              },
              {
                to: "/jury",
                label: `// ${t("nav.jury").toUpperCase()}`,
                show: showJury,
              },
              {
                to: "/panel",
                label: `// ${t("nav.panel").toUpperCase()}`,
                show: showPanel,
              },
            ]
              .filter((l) => l.show)
              .map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded px-3 py-2.5 text-xs tracking-widest transition-all ${
                      isActive
                        ? "bg-[#7d71fb]/10 text-[#7d71fb]"
                        : isLightTheme
                          ? "text-slate-500 hover:bg-slate-900/5 hover:text-slate-700"
                          : "text-white/40 hover:bg-white/5 hover:text-white/70"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
