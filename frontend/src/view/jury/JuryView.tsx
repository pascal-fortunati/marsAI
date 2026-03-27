import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ApiError,
  apiFetchJson,
  consumeAuthErrorFromUrl,
  consumeTokenFromUrlHash,
  decodeJwtPayload,
  getStoredToken,
} from "../../lib/api";
import { useNavBarState } from "../../components/NavBarStateContext";
import { JuryLoginView } from "./JuryLoginView";
import { JuryVotePanel } from "./JuryVotePanel";
import type { JuryFilm, VoteAction } from "./juryTypes";
import { JurySidebar } from "./JurySidebar";
import { JuryResponsiveView } from "./JuryResponsiveView";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { marsaiColors } from "../../theme/marsai";
import { useToast } from "../../hooks/use-toast";
import { JurySkeleton } from "../../skeletons/JurySkeleton";

// Composant principal représentant la vue d'un jury
export function JuryView() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { setJury } = useNavBarState();
  const [sessionTick, setSessionTick] = useState(0);
  const [films, setFilms] = useState<JuryFilm[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "voted">("all");
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 1023px)").matches
      : false,
  );
  const welcomedRef = useRef(false);

  useEffect(() => {
    const authError = consumeAuthErrorFromUrl();
    if (authError) {
      toast({
        title: t("common.error"),
        description: authError,
        kind: "error",
      });
    }
    const consumed = consumeTokenFromUrlHash();
    if (consumed || getStoredToken()) {
      Promise.resolve().then(() => setSessionTick((v) => v + 1));
    }
  }, [t, toast]);

  const token = getStoredToken();
  const payload = useMemo(
    () => (token ? decodeJwtPayload<{ role?: string }>(token) : null),
    [token],
  );
  const isJury = payload?.role === "jury";

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!token || !isJury || welcomedRef.current) return;
    toast({
      title: t("nav.sessionActive"),
      description: t("nav.secureAccess"),
      kind: "success",
    });
    welcomedRef.current = true;
  }, [token, isJury, t, toast]);

  useEffect(() => {
    if (!token || !isJury) return;
    const ac = new AbortController();
    Promise.resolve().then(() => {
      setLoading(true);
      setError(null);
    });
    apiFetchJson<{ items: JuryFilm[] }>("/api/jury/submissions", {
      signal: ac.signal,
    })
      .then((r) => {
        const items = r.items ?? [];
        setFilms(items);
        setActiveId((prev) => prev || items[0]?.id || null);
      })
      .catch((e: unknown) => {
        if (ac.signal.aborted) return;
        if (e instanceof ApiError && (e.status === 401 || e.status === 403))
          setSessionTick((v) => v + 1);
        const message = e instanceof Error ? e.message : t("common.error");
        setError(message);
        toast({
          title: t("common.error"),
          description: message,
          kind: "error",
        });
        setFilms([]);
        setActiveId(null);
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });
    return () => ac.abort();
  }, [token, isJury, sessionTick, t, toast]);

  const handleVote = async (
    id: string,
    action: Exclude<VoteAction, null>,
    comment: string,
  ) => {
    try {
      await apiFetchJson(`/api/jury/vote/${encodeURIComponent(id)}`, {
        method: "POST",
        body: JSON.stringify({ action, comment }),
      });
      setFilms((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, vote: action, comment, status: "voted" } : f,
        ),
      );
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        throw new Error(t("jury.voteAlreadySubmitted"));
      }
      throw e;
    }
  };

  const voted = films.filter((f) => f.status === "voted").length;
  const total = films.length;
  const pct = total > 0 ? Math.round((voted / total) * 100) : 0;
  const done = pct === 100 && total > 0;

  const filteredFilms = useMemo(() => {
    let visible = films;
    if (filter === "pending")
      visible = visible.filter((f) => f.status === "pending");
    if (filter === "voted")
      visible = visible.filter((f) => f.status === "voted");
    if (search.trim()) {
      const q = search.toLowerCase();
      visible = visible.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.country.toLowerCase().includes(q),
      );
    }
    return visible;
  }, [films, filter, search]);

  const currentActiveId = filteredFilms.some((f) => f.id === activeId)
    ? activeId
    : (filteredFilms[0]?.id ?? null);

  const nextFilm = useMemo(() => {
    const idx = filteredFilms.findIndex((f) => f.id === currentActiveId);
    return idx >= 0 ? (filteredFilms[idx + 1] ?? null) : null;
  }, [filteredFilms, currentActiveId]);

  useEffect(() => {
    if (!token || !isJury) {
      setJury(null);
      return;
    }
    setJury({
      subtitle: t("nav.secureAccess"),
      stats: { voted, total, pct, done },
    });
    return () => setJury(null);
  }, [token, isJury, voted, total, pct, done, setJury, t]);

  if (!token || !isJury) return <JuryLoginView />;

  const activeFilm =
    filteredFilms.find((f) => f.id === currentActiveId) ?? null;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-screen-2xl px-8 py-8">
        {/* Erreur — Alert shadcn pur variant destructive */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="f-mono text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading initial */}
        {loading && films.length === 0 ? (
          <JurySkeleton />
        ) : /* Aucun film assigné */
        total === 0 ? (
          <Card className="border-white/8 bg-[hsl(var(--card))]">
            <CardContent className="p-16 text-center">
              <div className="text-4xl mb-4 opacity-20">🎬</div>
              <div className="f-orb text-xl font-black text-muted-foreground/50 mb-2">
                {t("jury.noAssignedTitle")}
              </div>
              <div className="f-mono text-sm text-muted-foreground/35">
                {t("jury.noAssignedDesc")}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="border-white/8 bg-[hsl(var(--card))]">
              <CardContent className="p-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="relative flex-1 min-w-0">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                        width="14"
                        height="14"
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
                        placeholder={t("jury.searchPlaceholder")}
                        className="f-mono pl-8 py-2.5 text-sm"
                      />
                    </div>
                    <Tabs
                      value={filter}
                      onValueChange={(v) => setFilter(v as typeof filter)}
                    >
                      <TabsList className="w-full md:w-auto">
                        <TabsTrigger value="all" className="f-mono text-xs">
                          {t("jury.filterAll")}
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="f-mono text-xs">
                          {t("jury.filterPending")}
                        </TabsTrigger>
                        <TabsTrigger value="voted" className="f-mono text-xs">
                          {t("jury.filterVoted")}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                <div className="lg:w-80 w-full flex items-center gap-3">
                  <span className="f-mono text-sm text-muted-foreground shrink-0">
                    {t("nav.stats.progress")}
                  </span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background:
                          pct === 100
                            ? marsaiColors.success
                            : `linear-gradient(90deg,${marsaiColors.primary},${marsaiColors.primary2})`,
                      }}
                    />
                  </div>
                  <span className="f-orb text-sm font-black text-foreground shrink-0">
                    {voted}/{total}
                  </span>
                </div>
              </CardContent>
            </Card>

            {isMobile ? (
              <JuryResponsiveView
                films={filteredFilms}
                activeId={currentActiveId}
                onSelect={setActiveId}
                activeFilm={activeFilm}
                onVote={handleVote}
                onNext={() => nextFilm && setActiveId(nextFilm.id)}
                hasNext={!!nextFilm}
              />
            ) : (
              <div className="flex gap-6 items-start">
                <JurySidebar
                  films={filteredFilms}
                  activeId={currentActiveId}
                  onSelect={setActiveId}
                />

                <div className="flex-1 min-w-0">
                  {activeFilm ? (
                    <JuryVotePanel
                      key={activeFilm.id}
                      film={activeFilm}
                      onVote={handleVote}
                      onNext={() => nextFilm && setActiveId(nextFilm.id)}
                      hasNext={!!nextFilm}
                    />
                  ) : (
                    <Card className="border-white/8 bg-[hsl(var(--card))]">
                      <CardContent className="p-16 text-center">
                        <div className="f-orb text-base font-black text-muted-foreground/40">
                          {t("jury.selectFilm")}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
