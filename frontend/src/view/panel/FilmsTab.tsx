import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { Badge, Film, JuryUser, Status } from "./panelTypes";
import { BADGE_CFG, STATUS_CFG } from "./panelConfig";
import { GhostBtn, PrimaryBtn, InfoBlock } from "./panelUi";
import { marsaiColors } from "./panelStyles";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Combobox } from "../../components/ui/combobox";
import { FilmsTableSkeletonRows } from "../../skeletons/FilmsSkeleton";
import { apiFetch } from "../../lib/api";
import {
  Film as FilmIcon,
  UserRound,
  FolderOpen,
  ShieldCheck,
  Play,
  Copy,
  ExternalLink,
} from "lucide-react";

const isFilmAssignable = (film: Film) => (film.assignedJury?.length ?? 0) === 0;

export function FilmsTab({
  films,
  loading,
  onRefresh,
  juryUsers,
  onStatusChange,
  onBadgeChange,
  onSendEmail,
  onAssignBulk,
}: {
  films: Film[];
  loading: boolean;
  onRefresh: () => void;
  juryUsers: JuryUser[];
  onStatusChange: (id: string, s: Status) => Promise<void>;
  onBadgeChange: (id: string, b: Badge) => Promise<void>;
  onSendEmail: (id: string) => Promise<void>;
  onAssignBulk: (
    submissionIds: string[],
    juryUserIds: number[],
  ) => Promise<void>;
}) {
  const { t, i18n } = useTranslation();
  const ALL_VALUE = "__all__";
  const NONE_VALUE = "__none__";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [assignJuryId, setAssignJuryId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignMsg, setAssignMsg] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [commentsFilmId, setCommentsFilmId] = useState<string | null>(null);
  const [detailsFilmId, setDetailsFilmId] = useState<string | null>(null);
  const [assetVideoUrl, setAssetVideoUrl] = useState<string | null>(null);
  const [openingAssetKey, setOpeningAssetKey] = useState<string | null>(null);
  const [copiedAssetKey, setCopiedAssetKey] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const list = useMemo(() => {
    let r = films;
    if (statusFilter) r = r.filter((f) => f.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.director.toLowerCase().includes(q) ||
          f.country.toLowerCase().includes(q) ||
          f.id.toLowerCase().includes(q),
      );
    }
    return r;
  }, [films, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pagedList = list.slice(pageStart, pageStart + PAGE_SIZE);
  const pageItems = useMemo(() => {
    const items: Array<number | "…"> = [];
    for (let p = 1; p <= totalPages; p += 1) {
      if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) items.push(p);
      else if (items[items.length - 1] !== "…") items.push("…");
    }
    return items;
  }, [page, totalPages]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    setSelected((prev) => {
      const allowed = new Set(films.filter(isFilmAssignable).map((f) => f.id));
      const next = new Set([...prev].filter((id) => allowed.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [films]);

  const selectablePageIds = useMemo(
    () => pagedList.filter(isFilmAssignable).map((f) => f.id),
    [pagedList],
  );
  const allChecked =
    selectablePageIds.length > 0 &&
    selectablePageIds.every((id) => selected.has(id));
  const someChecked = selected.size > 0;
  const headerChecked: boolean | "indeterminate" = allChecked
    ? true
    : selected.size > 0
      ? "indeterminate"
      : false;

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allChecked) {
        for (const id of selectablePageIds) next.delete(id);
      } else {
        for (const id of selectablePageIds) next.add(id);
      }
      return next;
    });
  }
  function toggleOne(id: string, assignable: boolean) {
    if (!assignable) return;
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  }

  async function doAssign() {
    if (!assignJuryId || selected.size === 0) return;
    setAssigning(true);
    setAssignMsg(null);
    try {
      await onAssignBulk([...selected], [Number(assignJuryId)]);
      setAssignMsg({
        ok: true,
        text: t("panel.films.assignSuccess", { count: selected.size }),
      });
      setSelected(new Set());
      onRefresh();
    } catch (e) {
      setAssignMsg({
        ok: false,
        text: e instanceof Error ? e.message : t("common.error"),
      });
    } finally {
      setAssigning(false);
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: films.length };
    for (const s of Object.keys(STATUS_CFG))
      c[s] = films.filter((f) => f.status === s).length;
    return c;
  }, [films]);

  const selectedCount = counts.selected ?? 0;

  const statusLabels: Record<Status, string> = {
    pending: t("common.status.pending"),
    validated: t("common.status.validated"),
    refused: t("common.status.refused"),
    review: t("common.status.review"),
    selected: t("common.status.selected"),
  };
  const badgeLabels: Record<NonNullable<Badge>, string> = {
    grand_prix: `${BADGE_CFG.grand_prix.icon} ${t("common.badges.grand_prix")}`,
    prix_jury: `${BADGE_CFG.prix_jury.icon} ${t("common.badges.prix_jury")}`,
  };

  const detailsFilm = useMemo(
    () => films.find((f) => f.id === detailsFilmId) ?? null,
    [films, detailsFilmId],
  );
  const detailsFilmSocials = useMemo(() => {
    if (!detailsFilm?.directorSocials) return [];
    return Object.entries(detailsFilm.directorSocials).filter(
      ([, v]) => String(v || "").trim().length > 0,
    );
  }, [detailsFilm]);

  const [detailsTab, setDetailsTab] = useState<
    "film" | "contact" | "assets" | "legal"
  >("film");

  function handleRowDoubleClick(
    e: MouseEvent<HTMLTableRowElement>,
    id: string,
  ) {
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, [role='button'], [data-slot]"))
      return;
    setDetailsFilmId(id);
  }

  async function handleCopyAsset(url: string | null, key: string) {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedAssetKey(key);
      setTimeout(
        () => setCopiedAssetKey((prev) => (prev === key ? null : prev)),
        1400,
      );
    } catch {
      setCopiedAssetKey(null);
    }
  }

  const getAssetApiPath = (submissionId: string, assetType: string) =>
    `/api/admin/submissions/${encodeURIComponent(submissionId)}/assets/${encodeURIComponent(assetType)}`;

  async function handleOpenAsset({
    submissionId,
    assetType,
    key,
    isVideo,
  }: {
    submissionId: string;
    assetType: "video" | "poster" | "subtitles";
    key: string;
    isVideo: boolean;
  }) {
    setOpeningAssetKey(key);
    try {
      const res = await apiFetch(getAssetApiPath(submissionId, assetType));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      if (isVideo) {
        setAssetVideoUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return objectUrl;
        });
      } else {
        window.open(objectUrl, "_blank", "noopener,noreferrer");
        setTimeout(() => URL.revokeObjectURL(objectUrl), 15000);
      }
    } catch {
      setAssetVideoUrl(null);
    } finally {
      setOpeningAssetKey((prev) => (prev === key ? null : prev));
    }
  }

  const detailsTabs = [
    { id: "film" as const, label: t("panel.films.tabFilm"), icon: FilmIcon },
    {
      id: "contact" as const,
      label: t("panel.films.tabContact"),
      icon: UserRound,
    },
    {
      id: "assets" as const,
      label: t("panel.films.tabAssets"),
      icon: FolderOpen,
    },
    {
      id: "legal" as const,
      label: t("panel.films.tabLegal"),
      icon: ShieldCheck,
    },
  ];

  // Contenu partagé entre mobile et desktop
  const assignPanelContent = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span
          className="f-orb text-base font-black"
          style={{ color: marsaiColors.primary }}
        >
          {t("panel.selectedCount", { count: selected.size })}
        </span>
        <GhostBtn
          onClick={() => {
            setSelected(new Set());
            setAssignMsg(null);
          }}
          className="h-9 px-3"
        >
          {t("panel.cancel")}
        </GhostBtn>
      </div>
      <div className="grid gap-2">
        <span className="f-mono text-xs text-muted-foreground uppercase tracking-wider">
          {t("panel.assignTo")}
        </span>
        <Combobox
          value={assignJuryId}
          onChange={setAssignJuryId}
          placeholder={t("panel.films.chooseJury")}
          searchable={false}
          className="f-mono w-full"
          contentClassName="z-[120]"
          options={juryUsers.map((j) => ({
            value: String(j.id),
            label: `${j.name} · ${j.email}`,
          }))}
        />
      </div>
      <PrimaryBtn
        onClick={doAssign}
        disabled={!assignJuryId || assigning}
        className="w-full justify-center"
      >
        {assigning ? t("panel.assigning") : t("panel.assign")}
      </PrimaryBtn>
      {assignMsg && (
        <span
          className="f-mono text-sm"
          style={{
            color: assignMsg.ok ? marsaiColors.success : marsaiColors.danger,
          }}
        >
          {assignMsg.ok ? "✓" : "✗"} {assignMsg.text}
        </span>
      )}
    </div>
  );

  return (
    <>
      <div>
        <div className="films-tab flex flex-col gap-6">
          {/* ── Toolbar ── */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full flex-1 sm:min-w-72">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("panel.filmsSearch")}
                className="f-mono pl-10"
              />
            </div>
            <Combobox
              value={statusFilter || ALL_VALUE}
              onChange={(v) =>
                setStatusFilter(v === ALL_VALUE ? "" : (v as Status))
              }
              placeholder={t("common.allStatuses")}
              searchable={false}
              className="f-mono w-full sm:w-52"
              options={[
                { value: ALL_VALUE, label: t("common.allStatuses") },
                ...Object.keys(STATUS_CFG).map((k) => ({
                  value: k,
                  label: statusLabels[k as Status],
                })),
              ]}
            />
            <GhostBtn onClick={onRefresh} disabled={loading}>
              {loading ? "…" : t("common.refresh")}
            </GhostBtn>
          </div>

          {/* ── Barre assignation mobile ── */}
          {someChecked && (
            <div className="lg:hidden">
              <Card className="film-table-surface border-white/8 bg-[hsl(var(--card))] shadow-[0_10px_40px_rgba(10,8,30,0.28)]">
                <CardContent className="px-5 py-5">
                  {assignPanelContent}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── Barre progression sélection ── */}
          <div className="flex flex-col gap-3 rounded-xl border px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
            <span className="f-mono text-sm text-muted-foreground shrink-0">
              {t("panel.selectedTitle")}
            </span>
            <div className="flex-1 h-2 rounded-full overflow-hidden bg-muted">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (selectedCount / 50) * 100)}%`,
                  background:
                    selectedCount >= 50
                      ? marsaiColors.danger
                      : `linear-gradient(90deg,${marsaiColors.primary},${marsaiColors.primary2})`,
                }}
              />
            </div>
            <span
              className="f-orb text-base font-black shrink-0"
              style={{
                color:
                  selectedCount >= 50
                    ? marsaiColors.danger
                    : marsaiColors.primary,
              }}
            >
              {t("panel.selectedCountLabel", { count: selectedCount })}
            </span>
          </div>

          {/* ── Table ── */}
          <div className="film-table-surface rounded-xl border border-white/8 bg-[hsl(var(--card))] overflow-x-auto lg:overflow-hidden">
            <table className="min-w-[1080px] w-full border-collapse lg:min-w-0 lg:table-fixed">
              <thead>
                <tr className="border-b border-white/8 bg-white/3 text-left">
                  <th className="px-5 py-4 w-10">
                    <Checkbox
                      checked={headerChecked}
                      onCheckedChange={() => toggleAll()}
                      disabled={selectablePageIds.length === 0}
                      className="film-checkbox border-white/20 bg-white/3 data-[state=checked]:border-[#7d71fb]/80 data-[state=checked]:bg-[#7d71fb] data-[state=checked]:text-white data-[state=checked]:shadow-[0_0_12px_rgba(125,113,251,0.35)]"
                    />
                  </th>
                  {[
                    t("panel.films.columns.filmDirector"),
                    t("panel.films.columns.countryDuration"),
                    t("panel.juryAssigned"),
                    t("panel.films.commentsColumn"),
                    t("panel.status"),
                    t("panel.badge"),
                    t("panel.films.youtubeLink"),
                    t("panel.films.columns.email"),
                  ].map((h) => (
                    <th
                      key={h}
                      className="f-mono px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && <FilmsTableSkeletonRows />}
                {!loading && list.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-16 text-center">
                      <div className="f-orb text-lg font-black text-muted-foreground/50">
                        {t("panel.noFilms")}
                      </div>
                      <div className="f-mono mt-1 text-sm text-muted-foreground/35">
                        {t("panel.noFilmsHelp")}
                      </div>
                    </td>
                  </tr>
                )}
                {!loading &&
                  pagedList.map((f) => {
                    const checked = selected.has(f.id);
                    const assignable = isFilmAssignable(f);
                    const jury = f.assignedJury[0] ?? null;
                    const votes = f.juryVotes ?? [];
                    const voteComments = votes
                      .map((v) => (v.comment || "").trim())
                      .filter(Boolean);

                    return (
                      <tr
                        key={f.id}
                        className="film-row border-b border-white/8 transition-colors hover:bg-white/4 cursor-zoom-in"
                        style={{
                          background: checked
                            ? `${marsaiColors.primary}08`
                            : undefined,
                        }}
                        title={t("panel.films.doubleClickHint")}
                        onDoubleClick={(e) => handleRowDoubleClick(e, f.id)}
                      >
                        <td className="px-3 py-4 w-10">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleOne(f.id, assignable)}
                            disabled={!assignable}
                            className="film-checkbox border-white/20 bg-white/3 data-[state=checked]:border-[#7d71fb]/80 data-[state=checked]:bg-[#7d71fb] data-[state=checked]:text-white data-[state=checked]:shadow-[0_0_12px_rgba(125,113,251,0.35)]"
                          />
                        </td>
                        <td className="px-3 py-4 w-[22%] align-top">
                          <div className="f-orb text-sm font-black truncate">
                            {f.title}
                          </div>
                          <div className="f-mono text-xs text-muted-foreground mt-0.5 truncate">
                            {f.director}
                          </div>
                          <div className="f-mono text-[10px] text-muted-foreground/50 mt-0.5 break-all">
                            {f.id}
                          </div>
                        </td>
                        <td className="px-3 py-4 w-[9%] align-top">
                          <div className="f-mono text-sm">{f.country}</div>
                          <div className="f-mono text-xs text-muted-foreground mt-0.5">
                            {f.duration}
                          </div>
                        </td>
                        <td className="px-3 py-4 w-[14%] align-top">
                          {jury ? (
                            <>
                              <div className="f-mono text-sm truncate">
                                {jury.name}
                              </div>
                              <div className="f-mono text-[10px] text-muted-foreground truncate">
                                {jury.email}
                              </div>
                            </>
                          ) : (
                            <span className="f-mono text-sm text-muted-foreground/40">
                              {t("panel.none")}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-4 w-[16%] align-top">
                          {votes.length > 0 ? (
                            <div className="flex flex-col items-start gap-2">
                              {voteComments.length > 0 ? (
                                <GhostBtn
                                  small
                                  className="max-w-full truncate cursor-pointer"
                                  onClick={() => setCommentsFilmId(f.id)}
                                >
                                  {t("panel.films.viewComments", {
                                    count: voteComments.length,
                                  })}
                                </GhostBtn>
                              ) : (
                                <span className="f-mono text-[11px] text-muted-foreground/50">
                                  {t("panel.films.noComment")}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="f-mono text-sm text-muted-foreground/35">
                              {t("panel.none")}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-4 w-[11%] align-top">
                          <Combobox
                            value={f.status}
                            onChange={(v) => onStatusChange(f.id, v as Status)}
                            placeholder={statusLabels[f.status]}
                            searchable={false}
                            className="f-mono h-8 w-full rounded-lg px-3 text-xs cursor-pointer"
                            triggerStyle={{
                              color: STATUS_CFG[f.status].color,
                              borderColor: `${STATUS_CFG[f.status].color}40`,
                              background: `${STATUS_CFG[f.status].color}0d`,
                            }}
                            options={Object.keys(STATUS_CFG).map((k) => ({
                              value: k,
                              label: statusLabels[k as Status],
                            }))}
                          />
                        </td>
                        <td className="px-3 py-4 w-[12%] align-top">
                          <Combobox
                            value={f.badge ?? NONE_VALUE}
                            onChange={(v) =>
                              onBadgeChange(
                                f.id,
                                (v === NONE_VALUE ? null : v) as Badge,
                              )
                            }
                            placeholder={t("panel.none")}
                            searchable={false}
                            className="f-mono h-8 w-full rounded-lg px-3 text-xs cursor-pointer"
                            triggerStyle={
                              f.badge
                                ? {
                                    color: BADGE_CFG[f.badge].color,
                                    borderColor: `${BADGE_CFG[f.badge].color}40`,
                                    background: `${BADGE_CFG[f.badge].color}0d`,
                                  }
                                : undefined
                            }
                            options={[
                              { value: NONE_VALUE, label: t("panel.none") },
                              ...Object.keys(BADGE_CFG).map((k) => ({
                                value: k,
                                label: badgeLabels[k as NonNullable<Badge>],
                              })),
                            ]}
                          />
                        </td>
                        <td className="px-3 py-4 w-[9%] align-top">
                          {f.youtubePublicId || f.youtubePrivateId ? (
                            <div className="flex flex-col items-start gap-1.5">
                              <a
                                href={`https://youtube.com/watch?v=${f.youtubePublicId || f.youtubePrivateId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="f-mono text-xs underline transition-colors"
                                style={{ color: `${marsaiColors.primary}aa` }}
                                onMouseOver={(e) =>
                                  (e.currentTarget.style.color =
                                    marsaiColors.primary)
                                }
                                onMouseOut={(e) =>
                                  (e.currentTarget.style.color = `${marsaiColors.primary}aa`)
                                }
                              >
                                {t("panel.films.youtubeLink")} ↗
                              </a>
                              <div className="flex items-center gap-1.5">
                                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                                <span className="f-mono text-[11px] text-emerald-400">
                                  {t("panel.films.youtubeOnline")}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="f-mono text-sm text-muted-foreground/40">
                              {t("panel.none")}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-4 w-[7%] align-top">
                          <GhostBtn
                            small
                            className="w-full cursor-pointer"
                            onClick={async () => {
                              setSendingEmailId(f.id);
                              try {
                                await onSendEmail(f.id);
                                onRefresh();
                              } finally {
                                setSendingEmailId((prev) =>
                                  prev === f.id ? null : prev,
                                );
                              }
                            }}
                            disabled={sendingEmailId === f.id}
                          >
                            {sendingEmailId === f.id
                              ? t("panel.films.sendingEmail")
                              : t("panel.films.sendEmail")}
                          </GhostBtn>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {!loading && list.length > PAGE_SIZE && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="icon"
                  className="cursor-pointer f-mono h-8 w-8 rounded-xl border-white/8 bg-white/3 text-sm text-white/70 hover:border-[#7d71fb]/40 hover:bg-white/5 hover:text-white/70 disabled:opacity-20 transition-all"
                >
                  ←
                </Button>
                {pageItems.map((item, index) =>
                  item === "…" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="f-mono px-1 text-xs text-white/30"
                    >
                      {item}
                    </span>
                  ) : (
                    <Button
                      key={`page-${item}`}
                      onClick={() => setPage(item)}
                      variant="outline"
                      size="icon"
                      className="f-mono h-8 w-8 rounded-xl text-xs transition-all duration-200 cursor-pointer"
                      style={{
                        background:
                          page === item
                            ? "linear-gradient(135deg, #7d71fb, #ff5c35)"
                            : "var(--catalogue-pagination-bg)",
                        border:
                          page === item
                            ? "1px solid transparent"
                            : "1px solid var(--catalogue-pagination-border)",
                        color:
                          page === item
                            ? "#fff"
                            : "var(--catalogue-pagination-text)",
                        boxShadow:
                          page === item
                            ? "0 0 16px rgba(125,113,251,0.35)"
                            : "none",
                      }}
                    >
                      {item}
                    </Button>
                  ),
                )}
                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                  size="icon"
                  className="cursor-pointer f-mono h-8 w-8 rounded-xl border-white/8 bg-white/3 text-sm text-white/70 hover:border-[#7d71fb]/40 hover:bg-white/5 hover:text-white/70 disabled:opacity-20 transition-all"
                >
                  →
                </Button>
              </div>
            </div>
          )}

          {/* ── Modals ── */}
          <Dialog
            open={Boolean(commentsFilmId)}
            onOpenChange={(open) => {
              if (!open) setCommentsFilmId(null);
            }}
          >
            <DialogContent className="max-w-2xl border-white/10 bg-[#0c0c0e] text-white">
              <DialogHeader>
                <DialogTitle className="f-orb">
                  {t("panel.films.commentsModalTitle")}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2 flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1">
                {(films.find((f) => f.id === commentsFilmId)?.juryVotes ?? [])
                  .map((v) => ({
                    juryName: v.juryName,
                    action: v.action,
                    comment: (v.comment || "").trim(),
                  }))
                  .filter((v) => v.comment)
                  .map((v, idx) => (
                    <div
                      key={`modal-comment-${idx}`}
                      className="rounded-lg border border-white/10 bg-white/5 p-3"
                    >
                      <div className="f-mono text-[11px] text-white/45">
                        {v.juryName} · {v.action}
                      </div>
                      <div className="f-mono mt-1 text-sm text-white/85 whitespace-pre-wrap">
                        {v.comment}
                      </div>
                    </div>
                  ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={Boolean(detailsFilmId)}
            onOpenChange={(open) => {
              if (!open) {
                setDetailsFilmId(null);
                setDetailsTab("film");
                setAssetVideoUrl((prev) => {
                  if (prev) URL.revokeObjectURL(prev);
                  return null;
                });
                setOpeningAssetKey(null);
                setCopiedAssetKey(null);
              }
            }}
          >
            <DialogContent className="films-details-modal max-w-2xl border-white/10 bg-[#0c0c0e] text-white p-0 overflow-hidden">
              {detailsFilm ? (
                <>
                  <div className="px-6 pt-6 pb-4 border-b border-white/8">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <DialogTitle className="f-orb text-lg font-black truncate">
                          {detailsFilm.title}
                        </DialogTitle>
                        <p className="f-mono text-[11px] text-white/35 mt-0.5 break-all">
                          {detailsFilm.id}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                        <span
                          className="f-mono text-[11px] px-2.5 py-1 rounded-full"
                          style={{
                            color: STATUS_CFG[detailsFilm.status].color,
                            background: `${STATUS_CFG[detailsFilm.status].color}18`,
                            border: `1px solid ${STATUS_CFG[detailsFilm.status].color}40`,
                          }}
                        >
                          {statusLabels[detailsFilm.status]}
                        </span>
                        {detailsFilm.badge && (
                          <span
                            className="f-mono text-[11px] px-2.5 py-1 rounded-full"
                            style={{
                              color: BADGE_CFG[detailsFilm.badge].color,
                              background: `${BADGE_CFG[detailsFilm.badge].color}18`,
                              border: `1px solid ${BADGE_CFG[detailsFilm.badge].color}40`,
                            }}
                          >
                            {badgeLabels[detailsFilm.badge]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex border-b border-white/8 px-6">
                    {detailsTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setDetailsTab(tab.id)}
                          className={`films-details-tab f-mono text-xs py-3 px-4 border-b-2 transition-colors inline-flex items-center gap-1.5 ${detailsTab === tab.id ? "is-active" : ""}`}
                          style={{
                            borderBottomColor:
                              detailsTab === tab.id
                                ? marsaiColors.primary
                                : "transparent",
                          }}
                        >
                          <Icon size={13} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
                    {detailsTab === "film" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 flex items-center gap-2 rounded-lg border border-white/8 bg-white/3 px-3 py-2">
                          <FilmIcon size={14} className="text-white/70" />
                          <span className="f-mono text-xs text-white/70 uppercase tracking-wider">
                            {t("panel.films.modalFilmInfo")}
                          </span>
                        </div>
                        <InfoBlock
                          label={t("panel.films.modalDirector")}
                          value={detailsFilm.director}
                        />
                        <InfoBlock
                          label={t("panel.films.modalSubmittedAt")}
                          value={new Date(
                            detailsFilm.submittedAt,
                          ).toLocaleString(
                            i18n.language?.startsWith("fr") ? "fr-FR" : "en-US",
                          )}
                        />
                        <InfoBlock
                          label={t("panel.films.modalCountryLang")}
                          value={[detailsFilm.country, detailsFilm.language]
                            .filter(Boolean)
                            .join(" · ")}
                        />
                        <InfoBlock
                          label={t("panel.films.modalCategoryDuration")}
                          value={[
                            detailsFilm.category,
                            detailsFilm.year,
                            detailsFilm.duration,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        />
                        {detailsFilm.synopsis && (
                          <div className="col-span-2">
                            <InfoBlock
                              label={t("panel.films.modalSynopsis")}
                              value={detailsFilm.synopsis}
                              multiline
                            />
                          </div>
                        )}
                        {detailsFilm.musicCredits && (
                          <div className="col-span-2">
                            <InfoBlock
                              label={t("panel.films.modalMusicCredits")}
                              value={detailsFilm.musicCredits}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {detailsTab === "contact" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 flex items-center gap-2 rounded-lg border border-white/8 bg-white/3 px-3 py-2">
                          <UserRound size={14} className="text-white/70" />
                          <span className="f-mono text-xs text-white/70 uppercase tracking-wider">
                            {t("panel.films.tabContact")}
                          </span>
                        </div>
                        <InfoBlock
                          label={t("panel.films.modalSubmitter")}
                          value={detailsFilm.director}
                        />
                        <InfoBlock
                          label={t("panel.films.modalEmail")}
                          value={detailsFilm.directorEmail}
                        />
                        {detailsFilm.directorPhone && (
                          <InfoBlock
                            label={t("panel.films.modalPhone")}
                            value={detailsFilm.directorPhone}
                          />
                        )}
                        {detailsFilm.directorBirthdate && (
                          <InfoBlock
                            label={t("panel.films.modalBirthdate")}
                            value={detailsFilm.directorBirthdate}
                          />
                        )}
                        {detailsFilm.directorJob && (
                          <InfoBlock
                            label={t("panel.films.modalJob")}
                            value={detailsFilm.directorJob}
                          />
                        )}
                        {detailsFilm.discoverySource && (
                          <InfoBlock
                            label={t("panel.films.modalDiscovery")}
                            value={detailsFilm.discoverySource}
                          />
                        )}
                        <div className="col-span-2">
                          <InfoBlock
                            label={t("panel.films.modalAddress")}
                            value={
                              [
                                detailsFilm.directorStreet,
                                [
                                  detailsFilm.directorZip,
                                  detailsFilm.directorCity,
                                ]
                                  .filter(Boolean)
                                  .join(" "),
                                detailsFilm.directorCountry,
                              ]
                                .filter(
                                  (v) => String(v || "").trim().length > 0,
                                )
                                .join(", ") || t("panel.none")
                            }
                          />
                        </div>
                        {detailsFilmSocials.length > 0 && (
                          <div className="col-span-2 rounded-lg border border-white/8 bg-white/3 p-3">
                            <p className="f-mono text-[11px] text-white/45 mb-2">
                              {t("panel.films.modalSocials")}
                            </p>
                            <div className="flex flex-col gap-1">
                              {detailsFilmSocials.map(([key, value]) => (
                                <div
                                  key={`social-${key}`}
                                  className="flex items-center gap-2"
                                >
                                  <span className="f-mono text-[11px] text-white/35 w-20 shrink-0">
                                    {key}
                                  </span>
                                  <span className="f-mono text-sm text-white/80 break-all">
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {detailsTab === "assets" && (
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/3 px-3 py-2">
                          <FolderOpen size={14} className="text-white/70" />
                          <span className="f-mono text-xs text-white/70 uppercase tracking-wider">
                            {t("panel.films.tabAssets")}
                          </span>
                        </div>
                        {[
                          {
                            key: "video",
                            label: t("panel.films.modalVideo"),
                            url: detailsFilm.videoUrl,
                            assetType: "video" as const,
                            isVideo: true,
                          },
                          {
                            key: "poster",
                            label: t("panel.films.modalPoster"),
                            url: detailsFilm.posterUrl,
                            assetType: "poster" as const,
                            isVideo: false,
                          },
                          {
                            key: "subtitles",
                            label: t("panel.films.modalSubtitles"),
                            url: detailsFilm.subtitlesUrl,
                            assetType: "subtitles" as const,
                            isVideo: false,
                          },
                        ].map((asset) => (
                          <div
                            key={asset.key}
                            className="rounded-lg border border-white/8 bg-white/3 p-3"
                          >
                            <p className="f-mono text-[11px] text-white/45">
                              {asset.label}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!asset.url}
                                className="f-mono border-white/10 bg-white/5 text-white/85 hover:bg-white/10 disabled:opacity-40"
                                onClick={() => {
                                  if (!asset.url) return;
                                  void handleOpenAsset({
                                    submissionId: detailsFilm.id,
                                    assetType: asset.assetType,
                                    key: asset.key,
                                    isVideo: asset.isVideo,
                                  });
                                }}
                              >
                                {asset.isVideo ? (
                                  <Play size={13} className="mr-1.5" />
                                ) : (
                                  <ExternalLink size={13} className="mr-1.5" />
                                )}
                                {asset.isVideo
                                  ? t("panel.films.modalOpenPlayer")
                                  : t("panel.films.modalOpen")}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!asset.url}
                                className="f-mono border-white/10 bg-white/5 text-white/85 hover:bg-white/10 disabled:opacity-40"
                                onClick={() =>
                                  void handleCopyAsset(asset.url, asset.key)
                                }
                              >
                                <Copy size={13} className="mr-1.5" />
                                {copiedAssetKey === asset.key
                                  ? t("panel.films.modalCopied")
                                  : t("panel.films.modalCopy")}
                              </Button>
                            </div>
                            {!asset.url ? (
                              <p className="f-mono mt-2 text-[10px] text-white/40">
                                {t("panel.films.modalAssetUnavailable")}
                              </p>
                            ) : openingAssetKey === asset.key ? (
                              <p className="f-mono mt-2 text-[10px] text-white/40">
                                {t("panel.films.modalOpening")}
                              </p>
                            ) : null}
                          </div>
                        ))}
                        <InfoBlock
                          label={t("panel.films.modalAiTools")}
                          value={
                            detailsFilm.aiTools.length > 0
                              ? detailsFilm.aiTools.join(", ")
                              : t("panel.none")
                          }
                        />
                        <InfoBlock
                          label={t("panel.films.modalSemanticTags")}
                          value={
                            detailsFilm.semanticTags.length > 0
                              ? detailsFilm.semanticTags.join(", ")
                              : t("panel.none")
                          }
                        />
                      </div>
                    )}
                    {detailsTab === "legal" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 flex items-center gap-2 rounded-lg border border-white/8 bg-white/3 px-3 py-2">
                          <ShieldCheck size={14} className="text-white/70" />
                          <span className="f-mono text-xs text-white/70 uppercase tracking-wider">
                            {t("panel.films.tabLegal")}
                          </span>
                        </div>
                        <InfoBlock
                          label={t("panel.films.modalLegalRef")}
                          value={detailsFilm.legalRefName}
                        />
                        <InfoBlock
                          label={t("panel.films.modalLegalRefEmail")}
                          value={detailsFilm.legalRefEmail}
                        />
                        <div className="col-span-2 rounded-lg border border-white/8 bg-white/3 p-3">
                          <p className="f-mono text-[11px] text-white/45 mb-3">
                            {t("panel.films.modalConsents")}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              {
                                label: t("panel.films.modalConsentRules"),
                                value: detailsFilm.consentRules,
                              },
                              {
                                label: t("panel.films.modalConsentPromo"),
                                value: detailsFilm.consentPromo,
                              },
                              {
                                label: t("panel.films.modalConsentNewsletter"),
                                value: detailsFilm.consentNewsletter,
                              },
                              {
                                label: t("panel.films.modalConsentCopyright"),
                                value: detailsFilm.consentCopyright,
                              },
                              {
                                label: t(
                                  "panel.films.modalConsentRightsConfirmed",
                                ),
                                value: detailsFilm.rightsConfirmed,
                              },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black shrink-0"
                                  style={{
                                    background: value
                                      ? `${marsaiColors.success}20`
                                      : `${marsaiColors.danger}20`,
                                    color: value
                                      ? marsaiColors.success
                                      : marsaiColors.danger,
                                  }}
                                >
                                  {value ? "✓" : "✗"}
                                </span>
                                <span className="f-mono text-sm text-white/70">
                                  {label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </DialogContent>
          </Dialog>

          <Dialog
            open={Boolean(assetVideoUrl)}
            onOpenChange={(open) => {
              if (!open)
                setAssetVideoUrl((prev) => {
                  if (prev) URL.revokeObjectURL(prev);
                  return null;
                });
            }}
          >
            <DialogContent className="max-w-4xl border-white/10 bg-[#0c0c0e] text-white">
              <DialogHeader>
                <DialogTitle className="f-orb">
                  {t("panel.films.modalVideoPreviewTitle")}
                </DialogTitle>
              </DialogHeader>
              {assetVideoUrl && (
                <div className="rounded-lg border border-white/10 bg-black/35 p-2">
                  <video
                    src={assetVideoUrl}
                    controls
                    preload="metadata"
                    className="w-full max-h-[70vh] rounded-md"
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {typeof document !== "undefined"
        ? createPortal(
            <div
              aria-hidden={!someChecked}
              className={[
                "hidden lg:block fixed top-1/2 right-0 -translate-y-1/2 w-[24rem] z-[95]",
                "transition-all duration-300 ease-out",
                "pointer-events-none",
                someChecked
                  ? "translate-x-0 opacity-100 visible"
                  : "translate-x-[130%] opacity-0 invisible",
              ].join(" ")}
            >
              <Card className="film-table-surface max-h-[82vh] overflow-y-auto rounded-l-2xl rounded-r-none border-l border-r-0 border-t border-b border-white/8 bg-[hsl(var(--card))] shadow-[-16px_0_36px_rgba(10,8,30,0.45)] pointer-events-auto">
                <CardContent className="px-5 py-5">
                  {assignPanelContent}
                </CardContent>
              </Card>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
