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
}: {
  lang: "fr" | "en";
  isActive: boolean;
  onClick: () => void;
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
      }`}
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
      className="backdrop-blur-[12px] bg-[rgba(5,3,13,0.9)] relative w-full"
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
              <div className="content-stretch flex items-center justify-between px-[148.5px] relative size-full">
                {/* Left Section: Logo + Stats */}
                {/* Left Section: Logo */}
                <div className="flex items-center gap-[16px] shrink-0">
                  <a
                    href="/"
                    className="overflow-clip relative rounded-[16px] shrink-0 size-[56px]"
                    data-name="Link"
                  >
                    <img
                      src={logo}
                      alt="Mars AI logo"
                      className="h-[28px] w-[28px] object-contain"
                    />
                  </a>

                  <div className="content-stretch flex flex-col gap-[2px] items-start leading-[0] min-h-px min-w-px relative">
                    <div className="content-stretch flex gap-[7.69px] items-center relative shrink-0 text-[16px] w-full">
                      <div className="flex flex-col f-orb font-black h-[20px] justify-center relative shrink-0 text-white w-[71.81px]">
                        <p>
                          <span className="leading-[24px]">MARS</span>
                          <span className="leading-[24px] text-[#ff5c35]">
                            AI
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col f-orb font-bold h-[20px] justify-center relative shrink-0 text-[rgba(255,255,255,0.25)] w-[9.195px]">
                        <p className="leading-[24px]">·</p>
                      </div>
                      <div className="flex flex-col f-orb font-black h-[20px] justify-center relative shrink-0 text-[rgba(255,255,255,0.55)] w-[114.707px]">
                        <p className="leading-[24px]">Espace Jury</p>
                      </div>
                    </div>
                    <div className="flex flex-col font-['Share_Tech_Mono:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.28)] w-full">
                      <p className="leading-[16px]">
                        Session active · Accès sécurisé
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center Section: Stats */}
                <div className="flex flex-1 justify-center">
                  <div className="content-stretch flex gap-[21px] items-center relative shrink-0 w-[356.25px]">
                    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
                      {/* Total Films */}
                      <div
                        className="h-[50px] relative shrink-0 w-[81.41px]"
                        data-name="Stat-Films"
                      >
                        <div
                          aria-hidden="true"
                          className="absolute border-[rgba(255,255,255,0.08)] border-r border-solid inset-0 pointer-events-none"
                        />
                        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col f-orb font-black h-[32px] justify-center leading-[0] left-[calc(50%-0.31px)] text-[24px] text-center text-white top-[16px]">
                          <p className="leading-[32px]">{totalFilms}</p>
                        </div>
                        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Share_Tech_Mono:Regular',sans-serif] h-[16px] justify-center leading-[0] left-[calc(50%-0.3px)] not-italic text-[12px] text-[rgba(255,255,255,0.28)] text-center top-[42px]">
                          <p className="leading-[16px]">Films</p>
                        </div>
                      </div>

                      {/* Voted Films */}
                      <div
                        className="h-[50px] relative shrink-0 w-[81.41px]"
                        data-name="Stat-Voted"
                      >
                        <div
                          aria-hidden="true"
                          className="absolute border-[rgba(255,255,255,0.08)] border-r border-solid inset-0 pointer-events-none"
                        />
                        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col f-orb font-black h-[32px] justify-center leading-[0] left-[calc(50%-0.35px)] text-[#22c55e] text-[24px] text-center top-[16px]">
                          <p className="leading-[32px]">{votedFilms}</p>
                        </div>
                        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Share_Tech_Mono:Regular',sans-serif] h-[16px] justify-center leading-[0] left-[calc(50%-0.3px)] not-italic text-[12px] text-[rgba(255,255,255,0.28)] text-center top-[42px]">
                          <p className="leading-[16px]">votés</p>
                        </div>
                      </div>

                      {/* Remaining Films */}
                      <div
                        className="h-[50px] relative shrink-0 w-[100.84px]"
                        data-name="Stat-Remaining"
                      >
                        <div
                          aria-hidden="true"
                          className="absolute border-[rgba(255,255,255,0.08)] border-r border-solid inset-0 pointer-events-none"
                        />
                        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col f-orb font-black h-[32px] justify-center leading-[0] left-[calc(50%-0.34px)] text-[#f59e0b] text-[24px] text-center top-[16px]">
                          <p className="leading-[32px]">{remainingFilms}</p>
                        </div>
                        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Share_Tech_Mono:Regular',sans-serif] h-[16px] justify-center leading-[0] left-[calc(50%-0.32px)] not-italic text-[12px] text-[rgba(255,255,255,0.28)] text-center top-[42px]">
                          <p className="leading-[16px]">restants</p>
                        </div>
                      </div>
                    </div>

                    {/* Progression */}
                    <div className="content-stretch flex flex-col gap-[2px] items-center leading-[0] relative shrink-0 text-center w-[71.59px]">
                      <div className="flex flex-col f-orb font-black justify-center relative shrink-0 text-[#7d71fb] text-[24px] w-full">
                        <p className="leading-[32px]">{progression}%</p>
                      </div>
                      <div className="flex flex-col font-['Share_Tech_Mono:Regular',sans-serif] justify-center not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.28)] w-full">
                        <p className="leading-[16px]">Progression</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: Language Buttons */}
                <div className="content-stretch flex gap-[8px] h-[45px] items-center relative shrink-0 w-[96px]">
                  <FlagButton
                    lang="fr"
                    isActive={currentLang === "fr"}
                    onClick={() => onLangChange("fr")}
                  />
                  <FlagButton
                    lang="en"
                    isActive={currentLang === "en"}
                    onClick={() => onLangChange("en")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
