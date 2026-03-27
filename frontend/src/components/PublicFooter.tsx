import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { FestivalSettings } from "../config/festival";
import { apiUrl } from "../lib/api";
import { fetchPublicFestivalSettings } from "../lib/siteSettings";

function toImgSrc(url: string, platformBaseUrl?: string | null) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (platformBaseUrl) {
    const withProtocol = /^https?:\/\//i.test(platformBaseUrl)
      ? platformBaseUrl
      : `http://${platformBaseUrl}`;
    try {
      const origin = new URL(withProtocol).origin;
      const rel = url.startsWith("/") ? url : `/${url}`;
      return `${origin}${rel}`;
    } catch {
      // ignore
    }
  }
  return apiUrl(url);
}

const HIDDEN_ON = ["/panel", "/jury"];
const PARTNER_TINTS = [
  "invert(54%) sepia(78%) saturate(2033%) hue-rotate(222deg) brightness(101%) contrast(98%)",
  "invert(56%) sepia(95%) saturate(2458%) hue-rotate(341deg) brightness(102%) contrast(103%)",
];

function isPngLogo(url: string) {
  return /\.png(?:$|\?)/i.test(url);
}

export function PublicFooter() {
  const { pathname, search } = useLocation();
  const hidden = HIDDEN_ON.some((p) => pathname.startsWith(p));
  const previewStandalone =
    new URLSearchParams(search).get("previewHome") === "1";
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
  const platformBaseUrl = settings?.platformBaseUrl;
  if (logos.length === 0) return null;

  return (
    <footer
      className={
        previewStandalone
          ? "relative z-10 mt-4 pb-6"
          : "relative z-10 mt-24 pb-12"
      }
    >
      <div className="mx-auto max-w-screen-2xl px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {logos.map((l, index) => {
            const tintFilter = PARTNER_TINTS[index % PARTNER_TINTS.length];
            const pngLogo = isPngLogo(l.url);
            const targetHref =
              typeof l.linkUrl === "string" && l.linkUrl.trim()
                ? l.linkUrl.trim()
                : null;
            return (
              <a
                key={l.url}
                href={targetHref || undefined}
                target={targetHref ? "_blank" : undefined}
                rel={targetHref ? "noreferrer noopener" : undefined}
                className={targetHref ? "cursor-pointer" : "cursor-default"}
              >
                <img
                  src={toImgSrc(l.url, platformBaseUrl)}
                  alt={l.name ?? "Logo partenaire"}
                  className="h-20 max-w-[300px] object-contain opacity-90 transition hover:opacity-100"
                  style={pngLogo ? { filter: tintFilter } : undefined}
                  loading="lazy"
                />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
