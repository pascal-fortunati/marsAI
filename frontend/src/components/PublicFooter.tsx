import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { FestivalSettings } from "../config/festival";
import { apiUrl } from "../lib/api";
import { fetchPublicFestivalSettings } from "../lib/siteSettings";

function toImgSrc(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return apiUrl(url);
}

const HIDDEN_ON = ["/panel", "/jury"];

export function PublicFooter() {
  const { pathname } = useLocation();
  const hidden = HIDDEN_ON.some((p) => pathname.startsWith(p));
  const [settings, setSettings] = useState<FestivalSettings | null>(null);

  useEffect(() => {
    if (hidden) return;
    const ac = new AbortController();
    fetchPublicFestivalSettings(ac.signal)
      .then(setSettings)
      .catch(() => {});
    return () => ac.abort();
  }, [hidden]);

  if (hidden) return null;

  const logos = settings?.partnersLogos ?? [];
  const footerText = settings?.footerText ?? null;
  if (logos.length === 0 && !footerText) return null;

  return (
    <footer className="relative z-10 mt-16 border-t border-white/8 bg-[#05030d]/65 backdrop-blur-xl">
      <div className="mx-auto max-w-screen-2xl px-8 py-10">
        {logos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {logos.map((l) => (
              <img
                key={l.url}
                src={toImgSrc(l.url)}
                alt={l.name ?? "Logo partenaire"}
                className="h-10 max-w-[170px] object-contain opacity-70 grayscale transition hover:opacity-95 hover:grayscale-0"
                loading="lazy"
              />
            ))}
          </div>
        )}
        {footerText && (
          <div className="mt-8 text-center">
            <p className="f-mono text-sm text-white/25">{footerText}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
