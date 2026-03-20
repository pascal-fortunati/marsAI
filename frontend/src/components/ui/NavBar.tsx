import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { X } from "lucide-react";
import { Button } from "./Button";
import logo from "../../assets/mars_ai_logo.png";

interface NavBarProps {
  totalFilms?: number;
  votedFilms?: number;
  remainingFilms?: number;
  progression?: number;
  currentLang?: "fr" | "en";
  onLangChange?: (lang: "fr" | "en") => void;
}

function FlagButton({
  lang,
  isActive,
  onClick,
  className,
}: {
  lang: "fr" | "en";
  isActive: boolean;
  onClick: () => void;
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
          ? "bg-gradient-to-br from-[rgba(125,113,251,0.22)] to-[rgba(255,92,53,0.2)]"
          : "bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)]"
      } ${className ?? ""}`}
      data-name={`Button - ${isFrench ? "Français" : "English"}`}
      aria-label={`Switch to ${isFrench ? "French" : "English"}`}
    >
      <div
        aria-hidden="true"
        className={`absolute border border-solid inset-0 pointer-events-none rounded-full ${
          isActive
            ? "border-[rgba(125,113,251,0.55)] shadow-[0px_0px_14px_0px_rgba(125,113,251,0.25)]"
            : "border-[rgba(255,255,255,0.15)]"
        }`}
      />

      {/* Flag SVG */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip rounded-full size-[28px] top-1/2">
        <svg className="size-full" viewBox="0 0 28 28" fill="none">
          {isFrench ? (
            // French Flag
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
            // UK Flag
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

      {/* Language Label */}
      <div className="absolute bg-[#05030d] bottom-[-3px] h-[12px] left-[30%] right-[30%] rounded-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[11px] justify-center leading-[0] left-1/2 not-italic text-[7.5px] text-[rgba(255,255,255,0.75)] text-center top-[5.5px]">
          <p className="leading-[12px]">{isFrench ? "FR" : "EN"}</p>
        </div>
      </div>
    </Button>
  );
}

export default function NavBar({
  totalFilms = 12,
  votedFilms = 3,
  remainingFilms = 9,
  progression = 25,
  currentLang = "fr",
  onLangChange = () => {},
}: NavBarProps) {
  return (
    <div
      className="relative w-full bg-slate-950/90 backdrop-blur-[12px]"
      data-name="NavBar"
    >
      <div
        aria-hidden="true"
        className="absolute border-[rgba(125,113,251,0.2)] border-b border-solid inset-0 pointer-events-none shadow-[0px_4px_60px_0px_rgba(125,113,251,0.07)]"
      />

      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center pb-[21px] relative w-full">
          {/* Gradient Divider */}
          <div
            className="bg-gradient-to-r from-[rgba(125,113,251,0)] h-px shrink-0 to-[rgba(125,113,251,0)] via-1/2 via-[rgba(125,113,251,0.7)] w-full"
            data-name="Horizontal Divider"
          />

          <div className="h-[59px] relative shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className="mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-6 lg:px-8">
                {/* Left Section: Logo + text */}
                <div className="flex min-w-0 items-center gap-3 justify-self-start">
                  <a
                    href="/"
                    className="overflow-clip relative rounded-[16px] shrink-0 size-[56px]"
                    data-name="Link"
                  >
                    <img
                      src={logo}
                      alt="Mars AI logo"
                      className="h-full w-full object-contain"
                    />
                  </a>

                  <div className="min-w-0 max-w-[360px] flex flex-col gap-[2px] leading-[0] relative md:max-w-[460px] lg:max-w-none">
                    <div className="min-w-0 flex items-center gap-[7.69px] text-[16px]">
                      <div className="min-w-0 flex-shrink truncate f-orb font-black text-white">
                        <span className="leading-[24px]">MARS</span>
                        <span className="leading-[24px] text-[#ff5c35]">
                          AI
                        </span>
                      </div>
                      <div className="min-w-0 flex-shrink f-orb text-[rgba(255,255,255,0.25)]">
                        <span className="leading-[24px]">·</span>
                      </div>
                      <div className="min-w-0 flex-shrink truncate f-orb font-bold text-[rgba(255,255,255,0.55)]">
                        <span className="leading-[24px]">Espace Jury</span>
                      </div>
                    </div>
                    <div className="min-w-0 text-[12px] text-[rgba(255,255,255,0.28)] max-[900px]:hidden f-mono">
                      <p className="leading-[16px] truncate">
                        Session active · Accès sécurisé
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center Section: Pill on small screens, full stats on large screens */}
                <div className="flex min-w-0 justify-center justify-self-center">
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <Button
                        variant="nav"
                        size="icon"
                        className="lg:hidden flex flex-col items-center gap-1"
                        aria-label="Voir les stats"
                      >
                        <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
                          <span className="h-2 w-2 rounded-full bg-white" />
                          <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                          <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                          <span className="h-2 w-2 rounded-full bg-[#7d71fb]" />
                        </div>
                        <span className="text-xs text-[rgba(255,255,255,0.28)]">
                          stats
                        </span>
                      </Button>
                    </Popover.Trigger>

                    <Popover.Portal>
                      <Popover.Content
                        side="bottom"
                        sideOffset={8}
                        align="center"
                        className="z-50 w-full max-w-xs rounded-xl bg-[#05030d] p-4 shadow-xl"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-white">
                            Stats
                          </p>
                          <Popover.Close asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Fermer"
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </Popover.Close>
                        </div>

                        <div className="mt-4 grid gap-3">
                          <div className="flex items-center justify-between">
                            <span className="f-mono text-sm text-[rgba(255,255,255,0.7)]">
                              Films
                            </span>
                            <span className="f-orb text-lg font-black">
                              {totalFilms}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="f-mono text-sm text-[rgba(255,255,255,0.7)]">
                              Votés
                            </span>
                            <span className="f-orb text-lg font-black text-[#22c55e]">
                              {votedFilms}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="f-mono text-sm text-[rgba(255,255,255,0.7)]">
                              Restants
                            </span>
                            <span className="f-orb text-lg font-black text-[#f59e0b]">
                              {remainingFilms}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="f-mono text-sm text-[rgba(255,255,255,0.7)]">
                              Progression
                            </span>
                            <span className="f-orb text-lg font-black text-[#7d71fb]">
                              {progression}%
                            </span>
                          </div>
                        </div>
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>

                  <div className="hidden lg:flex w-full max-w-[340px] items-center justify-center gap-4 xl:max-w-[380px] xl:gap-5">
                    {/* Total Films */}
                    <div className="flex min-w-[62px] flex-col items-center justify-center gap-1 xl:min-w-[70px]">
                      <div className="f-orb text-[22px] font-black text-white xl:text-[24px]">
                        {totalFilms}
                      </div>
                      <div className="f-mono text-[12px] text-[rgba(255,255,255,0.28)]">
                        Films
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="h-[64px] w-px shrink-0 bg-[rgba(255,255,255,0.2)]"
                    />

                    {/* Voted Films */}
                    <div className="flex min-w-[62px] flex-col items-center justify-center gap-1 xl:min-w-[70px]">
                      <div className="f-orb text-[22px] font-black text-[#22c55e] xl:text-[24px]">
                        {votedFilms}
                      </div>
                      <div className="f-mono text-[12px] text-[rgba(255,255,255,0.28)]">
                        Votés
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="h-[64px] w-px shrink-0 bg-[rgba(255,255,255,0.2)]"
                    />

                    {/* Remaining Films */}
                    <div className="flex min-w-[62px] flex-col items-center justify-center gap-1 xl:min-w-[70px]">
                      <div className="f-orb text-[22px] font-black text-[#f59e0b] xl:text-[24px]">
                        {remainingFilms}
                      </div>
                      <div className="f-mono text-[12px] text-[rgba(255,255,255,0.28)]">
                        Restants
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="h-[64px] w-px shrink-0 bg-[rgba(255,255,255,0.2)]"
                    />

                    {/* Progression */}
                    <div className="flex min-w-[62px] flex-col items-center justify-center gap-1 xl:min-w-[70px]">
                      <div className="f-orb text-[22px] font-black text-[#7d71fb] xl:text-[24px]">
                        {progression}%
                      </div>
                      <div className="f-mono text-[12px] text-[rgba(255,255,255,0.28)]">
                        Progression
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: Language + stats toggle */}
                <div className="content-stretch flex shrink-0 items-center gap-2 justify-self-end">
                  <div className="flex gap-2">
                    <FlagButton
                      lang="fr"
                      isActive={currentLang === "fr"}
                      onClick={() => onLangChange("fr")}
                      className="max-[900px]:h-9 max-[900px]:w-9 max-[426px]:h-8 max-[426px]:w-8"
                    />
                    <FlagButton
                      lang="en"
                      isActive={currentLang === "en"}
                      onClick={() => onLangChange("en")}
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
