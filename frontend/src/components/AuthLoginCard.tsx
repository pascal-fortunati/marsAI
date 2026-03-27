import marsAiLogo from "../assets/mars_ai_logo.png";
import { apiUrl } from "../lib/api";
import { marsaiColors } from "../theme/marsai";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useTranslation } from "react-i18next";
import { useToast } from "../hooks/use-toast";
import { useEffect, useState } from "react";

export function AuthLoginCard({
  eyebrow,
  title,
  subtitle,
  redirectPath,
}: {
  eyebrow: string;
  title: string;
  subtitle: React.ReactNode;
  redirectPath: string;
}) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLightTheme, setIsLightTheme] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.getAttribute("data-theme") === "light";
  });
  const originParam =
    typeof window !== "undefined"
      ? `&origin=${encodeURIComponent(window.location.origin)}`
      : "";
  const logoMaskStyle = isLightTheme
    ? {
        backgroundColor: "rgba(20, 14, 80, 0.96)",
        WebkitMaskImage: `url("${marsAiLogo}")`,
        maskImage: `url("${marsAiLogo}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }
    : undefined;

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
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card
        className="w-full max-w-sm text-white"
        style={{
          border: isLightTheme
            ? "1px solid rgba(125,113,251,0.28)"
            : "1px solid rgba(255,255,255,0.10)",
          background: isLightTheme
            ? "rgba(255,255,255,0.97)"
            : "rgba(255,255,255,0.03)",
          color: isLightTheme ? "rgba(20,14,80,0.96)" : "#fff",
        }}
      >
        <CardContent className="p-10 text-center">
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl">
            {isLightTheme ? (
              <>
                <img src={marsAiLogo} alt="" className="hidden" />
                <span
                  className="h-full w-full"
                  role="img"
                  aria-label="marsAI"
                  style={logoMaskStyle}
                />
              </>
            ) : (
              <img
                src={marsAiLogo}
                alt="marsAI"
                className="h-full w-full object-contain"
              />
            )}
          </div>
          <div
            className="f-mono text-xs uppercase tracking-[.3em] mb-1"
            style={{
              color: isLightTheme
                ? "rgba(49,40,140,0.56)"
                : "rgba(255,255,255,0.25)",
            }}
          >
            {eyebrow}
          </div>
          <h1
            className="f-orb text-2xl font-black mb-2"
            style={{ color: isLightTheme ? "rgba(20,14,80,0.96)" : "#fff" }}
          >
            {title}
          </h1>
          <p
            className="f-mono text-sm mb-8"
            style={{
              color: isLightTheme
                ? "rgba(49,40,140,0.72)"
                : "rgba(255,255,255,0.35)",
            }}
          >
            {subtitle}
          </p>

          <Button
            asChild
            variant="outline"
            className="f-mono w-full rounded-xl text-sm"
            style={
              isLightTheme
                ? {
                    border: "1px solid rgba(125,113,251,0.4)",
                    background: "linear-gradient(135deg,#7d71fb,#ff5c35)",
                    color: "#fff",
                    boxShadow: "0 0 18px rgba(125,113,251,0.35)",
                  }
                : undefined
            }
          >
            <a
              href={apiUrl(
                `/api/auth/google?redirect=${encodeURIComponent(redirectPath)}${originParam}`,
              )}
              className="flex items-center justify-center gap-3"
              onClick={() =>
                toast({
                  title: t("auth.google"),
                  description: t("common.loading"),
                  kind: "info",
                })
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t("auth.google")}
            </a>
          </Button>

          <div
            className="mt-8 f-mono text-[10px] uppercase tracking-[.28em]"
            style={{ color: marsaiColors.primary, opacity: 0.35 }}
          >
            {t("auth.footerPrefix")}
            <span style={{ color: marsaiColors.accent }}>
              {t("auth.footerAccent")}
            </span>
            {t("auth.footerSuffix")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
