import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Inbox, SendIcon } from "lucide-react";
import type { PartnerLogo, SiteSettings } from "./panelTypes";
import { ApiError, apiFetch, apiFetchJson, apiUrl } from "../../lib/api";
import { GhostBtn, PrimaryBtn } from "./panelUi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Input } from "../../components/ui/input";
import {
  AlertDialog,
  AlertDialogActionButton,
  AlertDialogCancelButton,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  ImageIcon,
  TrashIcon,
  Cross2Icon,
  CheckCircledIcon,
  CrossCircledIcon,
  ReloadIcon,
  DownloadIcon,
  Link2Icon,
  Pencil1Icon,
} from "@radix-ui/react-icons";

const EMPTY_LOGOS: PartnerLogo[] = [];
const PARTNER_TINTS = [
  "invert(54%) sepia(78%) saturate(2033%) hue-rotate(222deg) brightness(101%) contrast(98%)",
  "invert(56%) sepia(95%) saturate(2458%) hue-rotate(341deg) brightness(102%) contrast(103%)",
];

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

function isPngLogo(url: string) {
  return /\.png(?:$|\?)/i.test(url);
}

function normalizePartnerLink(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    return parsed.href;
  } catch {
    return null;
  }
}

export function PartnersTab({
  site,
  onSiteChange,
}: {
  site: SiteSettings | null;
  onSiteChange: (s: SiteSettings | null) => void;
}) {
  const { t } = useTranslation();
  const logos = site?.partnersLogos ?? EMPTY_LOGOS;
  const platformBaseUrl = site?.platformBaseUrl ?? null;

  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null);
  const [editLogoUrl, setEditLogoUrl] = useState<string | null>(null);
  const [editLinkDraft, setEditLinkDraft] = useState("");

  const canUpload = files.length > 0 && !busy;

  const appendFiles = (incoming: File[]) => {
    if (incoming.length === 0) return;
    setFiles((prev) => {
      const merged = [...prev];
      for (const f of incoming) {
        const exists = merged.some(
          (m) =>
            m.name === f.name &&
            m.size === f.size &&
            m.lastModified === f.lastModified,
        );
        if (!exists) merged.push(f);
      }
      return merged;
    });
  };

  const byName = useMemo(
    () =>
      [...logos].sort((a, b) =>
        String(a.name ?? "").localeCompare(String(b.name ?? "")),
      ),
    [logos],
  );

  useEffect(() => {
    if (site) return;
    const ac = new AbortController();
    setInitialLoading(true);
    apiFetchJson<{ settings: SiteSettings }>("/api/admin/site", {
      signal: ac.signal,
    })
      .then((r) => onSiteChange(r.settings))
      .catch((e: unknown) => {
        if (!ac.signal.aborted)
          setError(e instanceof Error ? e.message : t("common.error"));
      })
      .finally(() => {
        if (!ac.signal.aborted) setInitialLoading(false);
      });
    return () => ac.abort();
  }, [site, onSiteChange, t]);

  async function upload() {
    if (!canUpload) return;
    setBusy(true);
    setMsg(null);
    setError(null);
    try {
      const fd = new FormData();
      for (const f of files) fd.append("files", f, f.name);
      const res = await apiFetch("/api/admin/partner-logos", {
        method: "POST",
        body: fd,
      });
      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json")
        ? ((await res.json().catch(() => null)) as unknown)
        : null;
      if (!res.ok) throw new ApiError("Upload impossible", res.status, payload);
      onSiteChange((payload as { settings?: SiteSettings }).settings ?? null);
      setFiles([]);
      setMsg(t("panel.partners.added"));
      setTimeout(() => setMsg(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  async function remove(url: string) {
    setBusy(true);
    setMsg(null);
    setError(null);
    try {
      const r = await apiFetchJson<{ settings: SiteSettings }>(
        "/api/admin/partner-logos",
        {
          method: "DELETE",
          body: JSON.stringify({ urls: [url] }),
        },
      );
      onSiteChange(r.settings);
      setMsg(t("panel.partners.removed"));
      setTimeout(() => setMsg(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  async function saveLogoLink() {
    if (!site || !editLogoUrl) return;
    setBusy(true);
    setMsg(null);
    setError(null);
    try {
      const normalized = normalizePartnerLink(editLinkDraft);
      if (editLinkDraft.trim() && !normalized) {
        setError(t("panel.partners.linkInvalid"));
        setBusy(false);
        return;
      }
      const nextLogos = (site.partnersLogos ?? []).map((logo) =>
        logo.url === editLogoUrl ? { ...logo, linkUrl: normalized } : logo,
      );
      let r: { settings: SiteSettings };
      try {
        r = await apiFetchJson<{ settings: SiteSettings }>(
          "/api/admin/partner-logos",
          {
            method: "PUT",
            body: JSON.stringify({ logos: nextLogos }),
          },
        );
      } catch (err) {
        if (!(err instanceof ApiError) || err.status !== 404) throw err;
        r = await apiFetchJson<{ settings: SiteSettings }>("/api/admin/site", {
          method: "PUT",
          body: JSON.stringify({ partnersLogos: nextLogos }),
        });
      }
      onSiteChange(r.settings);
      setMsg(t("panel.partners.linkSaved"));
      setTimeout(() => setMsg(null), 3000);
      setEditLogoUrl(null);
      setEditLinkDraft("");
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  if (initialLoading && !site)
    return (
      <div className="flex items-center justify-center py-24">
        <ReloadIcon className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
        <span className="f-mono text-sm text-muted-foreground">
          {t("common.loading")}
        </span>
      </div>
    );

  return (
    <div className="partners-tab grid gap-5">
      {/* Upload */}
      <Card className="bg-[hsl(var(--card))]">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] border border-white/10">
                <ImageIcon className="h-4 w-4 text-white/70" />
              </div>
              <div>
                <CardTitle className="f-orb text-base">
                  {t("panel.partners.title")}
                </CardTitle>
                <CardDescription className="f-mono text-xs mt-0.5">
                  {t("panel.partners.subtitle")}
                </CardDescription>
              </div>
            </div>
            {files.length > 0 && (
              <GhostBtn small disabled={busy} onClick={() => setFiles([])}>
                <Cross2Icon className="h-3 w-3 mr-1.5" />
                {t("panel.partners.reset")}
              </GhostBtn>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5 flex flex-col gap-4">
          {/* Zone drag & drop */}
          <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/10 cursor-pointer p-8 transition-colors hover:border-white/20 hover:bg-white/[0.02]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.05] border border-white/10">
              <DownloadIcon className="h-4 w-4 text-white/50" />
            </div>
            <div className="text-center">
              <div className="f-mono text-sm text-white/70">
                {files.length > 0
                  ? t("panel.partners.files", { count: files.length })
                  : t("panel.partners.pickFiles")}
              </div>
              <div className="f-mono text-xs text-white/30 mt-1">
                {t("panel.partners.formatsHint")}
              </div>
              <div className="f-mono text-[11px] text-white/35 mt-1">
                {t("panel.partners.multiSelectHint")}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                appendFiles(Array.from(e.target.files ?? []));
                e.currentTarget.value = "";
              }}
              className="sr-only"
              disabled={busy}
            />
          </label>

          {/* Fichiers sélectionnés */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((f, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="f-mono text-xs gap-1.5 pl-2 pr-1.5 py-1"
                >
                  <ImageIcon className="h-3 w-3 shrink-0" />
                  <span className="max-w-[160px] truncate">{f.name}</span>
                  <button
                    onClick={() =>
                      setFiles((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="text-white/30 hover:text-red-400 transition-colors ml-0.5"
                  >
                    <Cross2Icon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 pt-1">
            <PrimaryBtn disabled={!canUpload} onClick={upload}>
              <SendIcon className="h-3.5 w-3.5 mr-1.5" />
              {busy
                ? t("panel.partners.uploading")
                : t("panel.partners.upload")}
            </PrimaryBtn>
            {msg && (
              <span className="f-mono text-sm text-emerald-400 flex items-center gap-1.5">
                <CheckCircledIcon className="h-3.5 w-3.5" /> {msg}
              </span>
            )}
            {error && (
              <span className="f-mono text-sm text-red-400 flex items-center gap-1.5">
                <CrossCircledIcon className="h-3.5 w-3.5" /> {error}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logos en ligne */}
      <Card className="bg-[hsl(var(--card))]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="f-orb text-base">
                {t("panel.partners.online")}
              </CardTitle>
              <CardDescription className="f-mono text-xs mt-0.5">
                Logos actuellement affichés sur le site public
              </CardDescription>
            </div>
            <Badge variant="secondary" className="f-mono tabular-nums">
              {logos.length}
            </Badge>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          {byName.length === 0 ? (
            <div className="py-14 text-center">
              <Inbox className="mx-auto mb-3 h-8 w-8 opacity-20" />
              <p className="f-mono text-sm text-muted-foreground">
                {t("panel.partners.empty")}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {byName.map((l: PartnerLogo, index) => (
                <div
                  key={l.url}
                  className="partner-logo-card group rounded-xl border border-white/8 overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  {/* Aperçu sur fond blanc */}
                  <div className="partner-logo-preview relative h-24 bg-white flex items-center justify-center p-4">
                    <img
                      src={toImgSrc(l.url, platformBaseUrl)}
                      alt={l.name ?? t("panel.partners.partnerAlt")}
                      className="max-h-full max-w-full object-contain"
                      style={
                        isPngLogo(l.url)
                          ? {
                              filter:
                                PARTNER_TINTS[index % PARTNER_TINTS.length],
                            }
                          : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditLogoUrl(l.url);
                        setEditLinkDraft(l.linkUrl ?? "");
                      }}
                      className="partner-logo-edit-btn cursor-pointer absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-white/20 bg-black/65 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <Pencil1Icon className="h-3 w-3" />
                      {t("panel.partners.editLink")}
                    </button>
                  </div>

                  {/* Nom + suppression */}
                  <div className="partner-logo-meta px-3 py-2.5 border-t border-white/8 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="f-orb text-sm font-black truncate">
                        {l.name || t("panel.partners.partnerDefault")}
                      </div>
                      <div className="partner-logo-url f-mono text-[10px] text-white/30 truncate">
                        {l.url}
                      </div>
                      {l.linkUrl ? (
                        <div className="partner-logo-link f-mono mt-1 flex items-center gap-1 text-[10px] text-white/45">
                          <Link2Icon className="h-3 w-3" />
                          <span className="truncate">{l.linkUrl}</span>
                        </div>
                      ) : null}
                    </div>
                    <button
                      onClick={() => setDeleteUrl(l.url)}
                      disabled={busy}
                      className="partner-logo-delete cursor-pointer shrink-0 h-7 w-7 rounded-lg border border-red-500/20 bg-red-500/5 flex items-center justify-center text-red-400/40 transition hover:bg-red-500/15 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
                      title={t("common.delete")}
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog suppression */}
      <AlertDialog
        open={!!deleteUrl}
        onOpenChange={(open) => {
          if (!open) setDeleteUrl(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="f-orb">
              {t("panel.partners.deleteTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="f-mono">
              {t("panel.partners.deleteDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancelButton disabled={busy} className="f-mono">
              {t("common.cancel")}
            </AlertDialogCancelButton>
            <AlertDialogActionButton
              disabled={busy}
              onClick={() => {
                if (deleteUrl) void remove(deleteUrl);
                setDeleteUrl(null);
              }}
              className="f-mono"
            >
              {t("common.delete")}
            </AlertDialogActionButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={!!editLogoUrl}
        onOpenChange={(open) => {
          if (!open) {
            setEditLogoUrl(null);
            setEditLinkDraft("");
          }
        }}
      >
        <DialogContent className="border-white/12 bg-[#0c0c0e] text-white">
          <DialogHeader>
            <DialogTitle className="f-orb">
              {t("panel.partners.editLinkTitle")}
            </DialogTitle>
            <DialogDescription className="f-mono text-white/45">
              {t("panel.partners.editLinkDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Input
              value={editLinkDraft}
              onChange={(e) => setEditLinkDraft(e.target.value)}
              placeholder={t("panel.partners.linkPlaceholder")}
              className="f-mono"
            />
            <p className="f-mono text-xs text-white/35">
              {t("panel.partners.linkHint")}
            </p>
          </div>
          <DialogFooter>
            <GhostBtn
              onClick={() => {
                setEditLogoUrl(null);
                setEditLinkDraft("");
              }}
              className="justify-center"
            >
              {t("common.cancel")}
            </GhostBtn>
            <PrimaryBtn
              disabled={busy}
              onClick={saveLogoLink}
              className="justify-center"
            >
              {busy ? t("common.loading") : t("common.save")}
            </PrimaryBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
