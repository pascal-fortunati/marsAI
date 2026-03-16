import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import type { FestivalSettings } from "../config/festival";
import {
  isCatalogueAvailable,
  isPalmaresAvailable,
  isSubmissionOpen,
} from "../config/festival";
import marsAiLogo from "../assets/mars_ai_logo.png";
import { decodeJwtPayload, getStoredToken } from "../lib/api";
import { fetchPublicFestivalSettings } from "../lib/siteSettings";
import { setLanguage } from "../lib/i18n";
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
            className="relative h-11 w-11 rounded-full border text-sm transition-all duration-200"
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
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [settings, setSettings] = useState<FestivalSettings | null>(null);
  const [role, setRole] = useState<string | null>(() => {
    const token = getStoredToken();
    const payload = token ? decodeJwtPayload<{ role?: string }>(token) : null;
    return payload?.role ?? null;
  });
  const { panel, jury } = useNavBarState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

    return (
      <div className="sticky top-0 z-50 border-b border-[#7d71fb]/20 bg-[#05030d]/90 backdrop-blur-xl shadow-[0_4px_60px_rgba(125,113,251,0.07)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7d71fb]/70 to-transparent" />
        <div className="mx-auto max-w-screen-2xl px-8">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl"
              >
                <img
                  src={marsAiLogo}
                  alt="marsAI"
                  className="h-full w-full object-contain"
                />
              </Link>
              <div>
                <div className="f-orb text-base font-black text-white">
                  MARS<span style={{ color: marsaiColors.accent }}>AI</span>
                  <span className="ml-2 text-white/25">·</span>
                  <span className="ml-2 text-white/55">
                    {t("nav.dashboard")}
                  </span>
                </div>
                <div className="f-mono text-xs text-white/28">
                  {stats.loading ? t("common.loading") : subtitle}
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center divide-x divide-white/8">
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
            <LangSwitch currentLang={currentLang} onChange={setLanguage} />
          </div>

          {tabs.length > 0 ? (
            <div className="flex gap-0 border-t border-white/6">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => onTabChange(t.key)}
                  className={`f-mono relative flex items-center gap-2.5 px-6 py-4 text-sm transition-colors ${
                    activeTab === t.key
                      ? "text-[#7d71fb] border-b-2 border-[#7d71fb]"
                      : "text-white hover:text-[#7d71fb] border-b-2 border-transparent hover:border-[#7d71fb]"
                  }`}
                >
                  {t.label}
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
        </div>
      </div>
    );
  }

  if (isJury) {
    if (!showJury) return null;
    const subtitle = jury?.subtitle ?? t("nav.secureAccess");
    const stats = jury?.stats ?? { voted: 0, total: 0, pct: 0, done: false };

    return (
      <div className="sticky top-0 z-50 border-b border-[#7d71fb]/20 bg-[#05030d]/90 backdrop-blur-xl shadow-[0_4px_60px_rgba(125,113,251,0.07)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7d71fb]/70 to-transparent" />
        <div className="mx-auto max-w-screen-2xl px-8">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl"
              >
                <img
                  src={marsAiLogo}
                  alt="marsAI"
                  className="h-full w-full object-contain"
                />
              </Link>
              <div>
                <div className="f-orb text-base font-black text-white">
                  MARS<span style={{ color: marsaiColors.accent }}>AI</span>
                  <span className="mx-2 text-white/25">·</span>
                  <span className="text-white/55">{t("nav.jurySpace")}</span>
                </div>
                <div className="f-mono text-xs text-white/28">{subtitle}</div>
              </div>
            </div>

            <div className="hidden sm:flex items-center divide-x divide-white/8">
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
            <LangSwitch currentLang={currentLang} onChange={setLanguage} />
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
            ? "border-b border-[#7d71fb]/20 bg-[#05030d]/55 backdrop-blur-xl shadow-[0_4px_60px_rgba(125,113,251,0.07)] supports-[backdrop-filter]:bg-[#05030d]/45"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7d71fb]/70 to-transparent" />

        <nav className="mx-auto flex max-w-screen-2xl items-center gap-6 px-8 py-5">
          <Link to="/" className="flex items-center gap-4 shrink-0">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl">
              <img
                src={marsAiLogo}
                alt="marsAI"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="f-orb text-base font-black text-white">
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
            <button
              className="flex flex-col gap-1 p-2 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span
                className={`block h-px w-5 bg-white transition-all duration-300 ${
                  menuOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-white transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-white transition-all duration-300 ${
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
          <div className="f-mono flex flex-col gap-px border-t border-white/8 bg-[#05030d]/95 px-4 py-3 backdrop-blur-xl">
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
