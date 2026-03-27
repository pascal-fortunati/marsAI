import LanguageIcon from "@mui/icons-material/Language";
import EmailIcon from "@mui/icons-material/Email";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { marsaiGradients } from "../../theme/marsai";
import { GhostBtn, PrimaryBtn } from "./panelUi";

export function WelcomeView({
  open,
  saving,
  platformBaseUrl,
  brevoSenderEmail,
  onPlatformBaseUrlChange,
  onBrevoSenderEmailChange,
  onSubmit,
  onSkip,
}: {
  open: boolean;
  saving: boolean;
  platformBaseUrl: string;
  brevoSenderEmail: string;
  onPlatformBaseUrlChange: (v: string) => void;
  onBrevoSenderEmailChange: (v: string) => void;
  onSubmit: () => void | Promise<void>;
  onSkip: () => void;
}) {
  const { t } = useTranslation();
  const [isLightTheme, setIsLightTheme] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.getAttribute("data-theme") === "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    const update = () =>
      setIsLightTheme(root.getAttribute("data-theme") === "light");
    const observer = new MutationObserver(update);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    update();
    return () => observer.disconnect();
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onSkip();
      }}
    >
      <DialogContent
        className="w-[calc(100vw-1rem)] max-w-2xl border-white/12 bg-[#0e0b18] text-white sm:w-full"
        style={{
          borderColor: isLightTheme
            ? "rgba(125,113,251,0.28)"
            : "rgba(255,255,255,0.12)",
          background: isLightTheme ? "#fcfcfe" : "#0e0b18",
          color: isLightTheme ? "rgba(20,14,80,0.96)" : "#fff",
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1 opacity-75"
          style={{ background: marsaiGradients.primaryToAccent }}
        />

        <DialogHeader className="space-y-3">
          <DialogTitle className="f-orb flex items-center gap-2.5 text-xl text-white">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 ring-1 ring-white/10"
              style={{
                boxShadow: isLightTheme
                  ? "inset 0 0 0 1px rgba(125,113,251,0.22)"
                  : undefined,
              }}
            >
              <InfoOutlinedIcon
                sx={{ fontSize: 20 }}
                className={isLightTheme ? "text-[#5645e8]" : "text-purple-300"}
              />
            </div>
            <span
              style={{ color: isLightTheme ? "rgba(20,14,80,0.96)" : "#fff" }}
            >
              {t("panel.welcome.title")}
            </span>
          </DialogTitle>
          <DialogDescription
            className="f-mono text-[15px] leading-relaxed text-white/65"
            style={{ color: isLightTheme ? "rgba(49,40,140,0.74)" : undefined }}
          >
            {t("panel.welcome.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid gap-6">
          <div
            className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5"
            style={{
              borderColor: isLightTheme ? "rgba(125,113,251,0.24)" : undefined,
              background: isLightTheme
                ? "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(240,243,252,0.94))"
                : undefined,
            }}
          >
            <div className="absolute right-0 top-0 h-32 w-32 bg-purple-500/5 blur-3xl" />

            <div className="relative">
              <p
                className="f-mono mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/40"
                style={{
                  color: isLightTheme ? "rgba(49,40,140,0.62)" : undefined,
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
                {t("panel.welcome.stepsTitle")}
              </p>

              <div className="grid gap-3">
                {[
                  { num: "1", text: t("panel.welcome.stepDomain") },
                  { num: "2", text: t("panel.welcome.stepBrevo") },
                  { num: "3", text: t("panel.welcome.stepSiteTab") },
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-3 group">
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 text-xs font-medium text-white/50 ring-1 ring-white/10 transition-all group-hover:bg-white/8 group-hover:text-white/70 group-hover:ring-white/20"
                      style={{
                        background: isLightTheme
                          ? "rgba(255,255,255,0.94)"
                          : undefined,
                        color: isLightTheme
                          ? "rgba(49,40,140,0.72)"
                          : undefined,
                        borderColor: isLightTheme
                          ? "rgba(125,113,251,0.2)"
                          : undefined,
                      }}
                    >
                      {step.num}
                    </div>
                    <p
                      className="f-mono pt-0.5 text-[15px] leading-relaxed text-white/75"
                      style={{
                        color: isLightTheme ? "rgba(20,14,80,0.8)" : undefined,
                      }}
                    >
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="group flex flex-col gap-2.5">
              <Label
                className="f-mono flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/50"
                style={{
                  color: isLightTheme ? "rgba(49,40,140,0.62)" : undefined,
                }}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded bg-white/5 ring-1 ring-white/10 transition-colors group-focus-within:bg-purple-500/10 group-focus-within:ring-purple-500/30">
                  <LanguageIcon
                    sx={{ fontSize: 12 }}
                    className={
                      isLightTheme
                        ? "text-[#5f52ec] transition-colors group-focus-within:text-[#4a3de0]"
                        : "text-white/40 transition-colors group-focus-within:text-purple-400"
                    }
                  />
                </div>
                {t("panel.site.platformBaseUrl")}
              </Label>
              <Input
                value={platformBaseUrl}
                onChange={(e) => onPlatformBaseUrlChange(e.target.value)}
                placeholder={t("panel.site.placeholders.platformBaseUrl")}
                className="f-mono h-11 border-white/10 bg-white/[0.02] transition-all focus:border-purple-500/40 focus:bg-white/[0.04] focus:ring-2 focus:ring-purple-500/20"
                style={{
                  borderColor: isLightTheme
                    ? "rgba(125,113,251,0.28)"
                    : undefined,
                  background: isLightTheme
                    ? "rgba(255,255,255,0.98)"
                    : undefined,
                  color: isLightTheme ? "rgba(20,14,80,0.92)" : undefined,
                }}
              />
            </div>

            <div className="group flex flex-col gap-2.5">
              <Label
                className="f-mono flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/50"
                style={{
                  color: isLightTheme ? "rgba(49,40,140,0.62)" : undefined,
                }}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded bg-white/5 ring-1 ring-white/10 transition-colors group-focus-within:bg-blue-500/10 group-focus-within:ring-blue-500/30">
                  <EmailIcon
                    sx={{ fontSize: 12 }}
                    className={
                      isLightTheme
                        ? "text-[#4d86f5] transition-colors group-focus-within:text-[#2f6ff0]"
                        : "text-white/40 transition-colors group-focus-within:text-blue-400"
                    }
                  />
                </div>
                {t("panel.email.senderEmail")}
              </Label>
              <Input
                value={brevoSenderEmail}
                onChange={(e) => onBrevoSenderEmailChange(e.target.value)}
                placeholder="festival@marsai.fr"
                className="f-mono h-11 border-white/10 bg-white/[0.02] transition-all focus:border-blue-500/40 focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20"
                style={{
                  borderColor: isLightTheme
                    ? "rgba(125,113,251,0.28)"
                    : undefined,
                  background: isLightTheme
                    ? "rgba(255,255,255,0.98)"
                    : undefined,
                  color: isLightTheme ? "rgba(20,14,80,0.92)" : undefined,
                }}
              />
            </div>
          </div>

          <div
            className="flex flex-col-reverse gap-3 border-t border-white/5 pt-5 sm:flex-row sm:justify-end"
            style={{
              borderColor: isLightTheme ? "rgba(125,113,251,0.2)" : undefined,
            }}
          >
            <GhostBtn
              onClick={onSkip}
              className={`justify-center transition-all hover:bg-white/5 ${
                isLightTheme
                  ? "text-[rgba(49,40,140,0.74)] border-[rgba(125,113,251,0.28)]"
                  : ""
              }`}
            >
              {t("panel.welcome.skip")}
            </GhostBtn>
            <PrimaryBtn
              onClick={() => void onSubmit()}
              disabled={saving}
              className="justify-center bg-gradient-to-r from-purple-600 to-blue-600 transition-all hover:from-purple-500 hover:to-blue-500 disabled:from-purple-600/50 disabled:to-blue-600/50"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("panel.welcome.saving")}
                </span>
              ) : (
                t("panel.welcome.save")
              )}
            </PrimaryBtn>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
