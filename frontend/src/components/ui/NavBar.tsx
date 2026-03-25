import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { X, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import darkLogo from "../../assets/marsai_logo.png";
import lightLogo from "../../assets/marsai_logo-clair.png";
import { toggleTheme, getStoredTheme, type Theme } from "../../lib/theme";

interface NavBarProps {
  totalFilms?: number;
  votedFilms?: number;
  reviewFilms?: number;
  refusedFilms?: number;
  remainingFilms?: number;
  progression?: number;
  currentLang?: "fr" | "en";
  onLangChange?: (lang: "fr" | "en") => void;
}

function FlagButton({
  lang,
  isActive,
  onClick,
  ariaLabel,
  className,
}: {
  lang: "fr" | "en";
  isActive: boolean;
  onClick: () => void;
  ariaLabel: string;
  className?: string;
}) {
  const isFrench = lang === "fr";

  return (
    <Button
      onClick={onClick}
      variant={isActive ? "default" : "ghost"}
      size="icon"
      className={`relative rounded-full shrink-0 h-[44px] w-[44px] transition-all ${
        isActive
          ? "bg-gradient-to-tr from-indigo-400/40 to-orange-500/35"
          : "bg-secondary/60 hover:bg-secondary"
      } ${className ?? ""}`}
      data-name={`Button - ${isFrench ? "Français" : "English"}`}
      aria-label={ariaLabel}
    >
      <div
        aria-hidden="true"
        className={`absolute border border-solid inset-0 pointer-events-none rounded-full ${
          isActive
            ? "border-indigo-400/70 shadow-lg shadow-indigo-400/45 animate-pulse"
            : "border-border"
        }`}
      />

      {/* Drapeau SVG */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip rounded-full size-[28px] top-1/2">
        <svg className="size-full" viewBox="0 0 28 28" fill="none">
          {isFrench ? (
            // Drapeau francais
            <>
              <circle cx="14" cy="14" r="14" fill="white" />
              <rect width="9.33" height="28" fill="#0055A4" />
              <rect x="18.67" width="9.33" height="28" fill="#EF4135" />
              <circle
                cx="14"
                cy="14"
                r="13.42"
                stroke="white"
                strokeOpacity="0.35"
                strokeWidth="1.16"
                fill="none"
              />
            </>
          ) : (
            // Drapeau britannique
            <>
              <circle cx="14" cy="14" r="14" fill="#012169" />
              <g>
                <path
                  d="M0 0L28 28M28 0L0 28"
                  stroke="white"
                  strokeWidth="5.83"
                />
                <path
                  d="M0 0L28 28M28 0L0 28"
                  stroke="#C8102E"
                  strokeWidth="2.68"
                />
              </g>
              <g>
                <path d="M14 0V28M0 14H28" stroke="white" strokeWidth="8.17" />
                <path
                  d="M14 0V28M0 14H28"
                  stroke="#C8102E"
                  strokeWidth="4.67"
                />
              </g>
              <circle
                cx="14"
                cy="14"
                r="13.42"
                stroke="white"
                strokeOpacity="0.35"
                strokeWidth="1.16"
                fill="none"
              />
            </>
          )}
        </svg>
      </div>

      {/* Libelle langue */}
      <div className="absolute bottom-[-3px] h-[12px] left-[30%] right-[30%] rounded-full bg-card border border-border">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[11px] justify-center leading-[0] left-1/2 not-italic text-[7.5px] text-foreground text-center top-[5.5px]">
          <p className="leading-[12px]">{isFrench ? "FR" : "EN"}</p>
        </div>
      </div>
    </Button>
  );
}

export default function NavBar({
  totalFilms = 12,
  votedFilms = 3,
  reviewFilms = 2,
  refusedFilms = 1,
  remainingFilms = 9,
  progression = 25,
  currentLang = "fr",
  onLangChange = () => {},
}: NavBarProps) {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<Theme>(getStoredTheme());
  const logo = theme === "light" ? lightLogo : darkLogo;
  const logoClassName = "h-full w-full object-contain";
  const navBackgroundClass =
    theme === "light" ? "bg-[#f8f9fa]/95" : "bg-background/95";

  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 w-full ${navBackgroundClass} backdrop-blur-[12px]`}
      data-name="NavBar"
    >
      <div
        aria-hidden="true"
        className="absolute border-border border-b border-solid inset-0 pointer-events-none shadow-2xl shadow-black/15"
      />

      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center pb-[21px] relative w-full">
          {/* Separateur degrade */}
          <div
            className="bg-gradient-to-r from-transparent h-px shrink-0 to-transparent via-1/2 via-primary/70 w-full"
            data-name="Horizontal Divider"
          />

          <div className="h-[59px] relative shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className="mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-6 lg:px-8">
                {/* Section gauche : logo + texte */}
                <div className="flex min-w-0 items-center gap-3 justify-self-start">
                  <a
                    href="/"
                    className="relative shrink-0 size-[56px]"
                    data-name="Link"
                  >
                    <img
                      src={logo}
                      alt="Mars AI logo"
                      className={logoClassName}
                    />
                  </a>

                  <div className="min-w-0 max-w-[360px] flex flex-col gap-[2px] leading-[0] relative md:max-w-[460px] lg:max-w-none">
                    <div className="min-w-0 flex items-center gap-[7.69px] text-[16px]">
                      <div className="min-w-0 flex-shrink truncate f-orb font-black text-foreground">
                        <span className="leading-[24px]">MARS</span>
                        <span className="leading-[24px] text-orange-500">
                          AI
                        </span>
                      </div>
                      <div className="min-w-0 flex-shrink f-orb text-muted-foreground">
                        <span className="leading-[24px]">·</span>
                      </div>
                      <div className="min-w-0 flex-shrink truncate f-orb font-bold text-foreground/85">
                        <span className="leading-[24px]">
                          {t("nav.jurySpace")}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 text-[12px] text-muted-foreground max-[900px]:hidden f-mono">
                      <p className="leading-[16px] truncate">
                        {t("nav.secureAccess")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section centrale : pastille sur petit ecran, statistiques completes sur grand ecran */}
                <div className="flex min-w-0 justify-center justify-self-center">
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <Button
                        variant="nav"
                        size="icon"
                        className="lg:hidden flex flex-col items-center gap-1"
                        aria-label={
                          currentLang === "fr" ? "Voir les stats" : "View stats"
                        }
                      >
                        <div className="flex items-center gap-1 rounded-full bg-secondary/80 border border-border px-2 py-1">
                          <span className="h-2 w-2 rounded-full bg-white" />
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          <span className="h-2 w-2 rounded-full bg-rose-400" />
                          <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                          <span className="h-2 w-2 rounded-full bg-violet-400" />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Stats
                        </span>
                      </Button>
                    </Popover.Trigger>

                    <Popover.Portal>
                      <Popover.Content
                        side="bottom"
                        sideOffset={8}
                        align="center"
                        className="z-50 w-full max-w-xs rounded-xl bg-card border border-border p-4 shadow-xl"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">
                            Stats
                          </p>
                          <Popover.Close asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={
                                currentLang === "fr" ? "Fermer" : "Close"
                              }
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </Popover.Close>
                        </div>

                        <div className="mt-4 grid gap-3">
                          <div className="flex items-center justify-between">
                            <span className="f-mono text-sm text-muted-foreground">
                              {t("nav.stats.films")}
                            </span>
                            <span className="f-orb text-lg font-black text-foreground">
                              {totalFilms}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="f-mono text-sm text-muted-foreground">
                              {t("jury.filterVoted")}
                            </span>
                            <span className="f-orb text-lg font-black text-emerald-400">
                              {votedFilms}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="f-mono text-sm text-muted-foreground">
                              {t("jury.filterPending")}
                            </span>
                            <span className="f-orb text-lg font-black text-amber-400">
                              {reviewFilms}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="f-mono text-sm text-muted-foreground">
                              {t("jury.filterRefused")}
                            </span>
                            <span className="f-orb text-lg font-black text-rose-400">
                              {refusedFilms}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="f-mono text-sm text-muted-foreground">
                              {t("jury.filterRemaining")}
                            </span>
                            <span className="f-orb text-lg font-black text-muted-foreground">
                              {remainingFilms}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="f-mono text-sm text-muted-foreground">
                              {t("nav.stats.progress")}
                            </span>
                            <span className="f-orb text-lg font-black text-violet-400">
                              {progression}%
                            </span>
                          </div>
                        </div>
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>

                  <div className="hidden lg:flex w-full max-w-[520px] items-center justify-center gap-4 xl:max-w-[580px] xl:gap-5">
                    {/* Total films */}
                    <div className="flex min-w-[62px] flex-col items-center justify-center gap-1 xl:min-w-[70px]">
                      <div className="f-orb text-[22px] font-black text-foreground xl:text-[24px]">
                        {totalFilms}
                      </div>
                      <div className="f-mono text-[12px] text-muted-foreground">
                        {t("nav.stats.films")}
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="h-[64px] w-px shrink-0 bg-border"
                    />

                    {/* Films votes */}
                    <div className="flex min-w-[62px] flex-col items-center justify-center gap-1 xl:min-w-[70px]">
                      <div className="f-orb text-[22px] font-black text-emerald-400 xl:text-[24px]">
                        {votedFilms}
                      </div>
                      <div className="f-mono text-[12px] text-muted-foreground">
                        {t("jury.filterVoted")}
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="h-[64px] w-px shrink-0 bg-border"
                    />

                    {/* Films a revoir */}
                    <div className="flex min-w-[62px] flex-col items-center justify-center gap-1 xl:min-w-[70px]">
                      <div className="f-orb text-[22px] font-black text-amber-400 xl:text-[24px]">
                        {reviewFilms}
                      </div>
                      <div className="f-mono text-[12px] text-muted-foreground">
                        {t("jury.filterPending")}
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="h-[64px] w-px shrink-0 bg-border"
                    />

                    {/* Films refuses */}
                    <div className="flex min-w-[62px] flex-col items-center justify-center gap-1 xl:min-w-[70px]">
                      <div className="f-orb text-[22px] font-black text-rose-400 xl:text-[24px]">
                        {refusedFilms}
                      </div>
                      <div className="f-mono text-[12px] text-muted-foreground">
                        {t("jury.filterRefused")}
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="h-[64px] w-px shrink-0 bg-border"
                    />

                    {/* Films restants */}
                    <div className="flex min-w-[62px] flex-col items-center justify-center gap-1 xl:min-w-[70px]">
                      <div className="f-orb text-[22px] font-black text-muted-foreground xl:text-[24px]">
                        {remainingFilms}
                      </div>
                      <div className="f-mono text-[12px] text-muted-foreground">
                        {t("jury.filterRemaining")}
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="h-[64px] w-px shrink-0 bg-border"
                    />

                    {/* Progression */}
                    <div className="flex min-w-[62px] flex-col items-center justify-center gap-1 xl:min-w-[70px]">
                      <div className="f-orb text-[22px] font-black text-violet-400 xl:text-[24px]">
                        {progression}%
                      </div>
                      <div className="f-mono text-[12px] text-muted-foreground">
                        {t("nav.stats.progress")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section droite : langue + bascule theme + bascule statistiques */}
                <div className="content-stretch flex shrink-0 items-center gap-2 justify-self-end">
                  <div className="flex gap-2">
                    {/* Bouton bascule theme */}
                    <Button
                      onClick={handleThemeToggle}
                      variant="ghost"
                      size="icon"
                      className={`relative rounded-full shrink-0 h-[44px] w-[44px] transition-all hover:bg-secondary/30 active:bg-secondary/50 ${
                        theme === "light"
                          ? "text-amber-500"
                          : "text-muted-foreground"
                      }`}
                      aria-label={
                        theme === "dark"
                          ? currentLang === "fr"
                            ? "Mode clair"
                            : "Light mode"
                          : currentLang === "fr"
                            ? "Mode sombre"
                            : "Dark mode"
                      }
                      title={
                        theme === "dark"
                          ? currentLang === "fr"
                            ? "Passer au mode clair"
                            : "Switch to light mode"
                          : currentLang === "fr"
                            ? "Passer au mode sombre"
                            : "Switch to dark mode"
                      }
                    >
                      {theme === "dark" ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </Button>

                    {/* Boutons de langue */}
                    <FlagButton
                      lang="fr"
                      isActive={currentLang === "fr"}
                      onClick={() => onLangChange("fr")}
                      ariaLabel={
                        currentLang === "fr"
                          ? "Basculer en français"
                          : "Switch to French"
                      }
                      className="max-[900px]:h-9 max-[900px]:w-9 max-[426px]:h-8 max-[426px]:w-8"
                    />
                    <FlagButton
                      lang="en"
                      isActive={currentLang === "en"}
                      onClick={() => onLangChange("en")}
                      ariaLabel={
                        currentLang === "fr"
                          ? "Basculer en anglais"
                          : "Switch to English"
                      }
                      className="max-[900px]:h-9 max-[900px]:w-9 max-[426px]:h-8 max-[426px]:w-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
