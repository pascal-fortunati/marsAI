import { Link } from "react-router-dom";
import { marsaiGradients } from "../theme/marsai";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export function NotFoundPage() {
    const { t } = useTranslation();

    useEffect(() => {
        document.title = `marsAI · ${t("meta.notFound")}`;
    }, [t]);

    return (
        <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 text-center overflow-hidden">
            {/* 404 géant en arrière-plan */}
            <div
                className="absolute select-none pointer-events-none"
                aria-hidden="true"
                style={{
                    fontSize: "clamp(160px, 30vw, 380px)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    fontFamily: "'f-orb', sans-serif",
                    background:
                        "linear-gradient(160deg, rgba(255,92,53,0.07) 0%, rgba(125,113,251,0.05) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "blur(0px)",
                    userSelect: "none",
                }}
            >
                404
            </div>

            {/* Ligne de scan horizontale animée */}
            <div
                aria-hidden="true"
                className="absolute left-0 right-0 h-px opacity-20 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(90deg, transparent, #ff5c35, #7d71fb, transparent)",
                    animation: "scanline 3.5s ease-in-out infinite",
                }}
            />

            {/* Contenu centré */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Badge eyebrow */}
                <div className="f-mono inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-4 py-1.5 text-xs tracking-[0.2em] text-white/40 uppercase backdrop-blur">
                    <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background: "#ff5c35", boxShadow: "0 0 6px #ff5c35" }}
                    />
                    {t("notFound.eyebrow")}
                </div>

                {/* Titre */}
                <h1
                    className="f-orb text-4xl font-black tracking-tight text-white sm:text-5xl"
                    style={{ textShadow: "0 0 40px rgba(255,92,53,0.15)" }}
                >
                    {t("notFound.title")}
                </h1>

                {/* Sous-titre */}
                <p className="f-mono max-w-sm text-sm leading-relaxed text-white/35">
                    {t("notFound.subtitle")}
                </p>

                {/* Message secondaire */}
                <p className="f-mono text-xs text-white/20">{t("notFound.message")}</p>

                {/* Actions */}
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                    <Button
                        asChild
                        className="f-orb rounded-full px-7 text-xs font-bold uppercase tracking-widest text-white"
                        style={{ background: marsaiGradients.primaryToAccent }}
                    >
                        <Link to="/">{t("notFound.backHome")}</Link>
                    </Button>
                </div>
            </div>

            <style>{`
        @keyframes scanline {
          0%   { top: 20%; opacity: 0; }
          10%  { opacity: 0.2; }
          50%  { top: 80%; opacity: 0.15; }
          90%  { opacity: 0.2; }
          100% { top: 20%; opacity: 0; }
        }
      `}</style>
        </div>
    );
}
