import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { LoginView } from "./LoginView";
import { FilmsTab } from "./FilmsTab";
import { SiteTab } from "./SiteTab";
import { PartnersTab } from "./PartnersTab";
import { YoutubeTab } from "./YoutubeTab";
import { EmailTab } from "./EmailTab";
import { UsersTab } from "./UsersTab";
import { WelcomeView } from "./WelcomeView";
import type { Film, JuryUser, SiteSettings, TabKey, User } from "./panelTypes";
import { isoToLocal, localToIso, parseJsonArray } from "./panelHelpers";
import { resources } from "../../lib/i18nResources";
import { useToast } from "../../hooks/use-toast";
import { FilmsTableSkeletonRows } from "../../skeletons/FilmsSkeleton";
import { UsersSkeleton } from "../../skeletons/UsersSkeleton";
import { SiteSkeleton } from "../../skeletons/SiteSkeleton";
import { YoutubeSkeleton } from "../../skeletons/YoutubeSkeleton";
import { EmailSkeleton } from "../../skeletons/EmailSkeleton";

// Fonction utilitaire pour fusionner deux objets, en priorisant les propriétés de l'objet override
function mergeObject(
  base: unknown,
  override: unknown,
): Record<string, unknown> {
  const b =
    base && typeof base === "object" && !Array.isArray(base)
      ? (base as Record<string, unknown>)
      : {};
  const o =
    override && typeof override === "object" && !Array.isArray(override)
      ? (override as Record<string, unknown>)
      : {};
  const out: Record<string, unknown> = { ...b };
  for (const [k, v] of Object.entries(o)) {
    if (v && typeof v === "object" && !Array.isArray(v))
      out[k] = mergeObject(b[k], v);
    else out[k] = v;
  }
  return out;
}

// Composant représentant la vue principale du panneau d'administration
export function PanelView() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { setPanel } = useNavBarState();
  const [tab, setTab] = useState<TabKey>("films");
  const [tabTransitionLoading, setTabTransitionLoading] = useState(false);
  const [sessionTick, setSessionTick] = useState(0);
  const tabTransitionTimerRef = useRef<number | null>(null);

  const [films, setFilms] = useState<Film[]>([]);
  const [filmsLoading, setFilmsLoading] = useState(false);
  const [filmsError, setFilmsError] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [juryUsers, setJuryUsers] = useState<JuryUser[]>([]);

  const [site, setSite] = useState<SiteSettings | null>(null);
  const [siteLoading, setSiteLoading] = useState(false);
  const [siteSaving, setSiteSaving] = useState(false);
  const [siteMsg, setSiteMsg] = useState<string | null>(null);
  const [siteError, setSiteError] = useState<string | null>(null);

  const [phase1Close, setPhase1Close] = useState("");
  const [phase2Catalogue, setPhase2Catalogue] = useState("");
  const [phase3Palmares, setPhase3Palmares] = useState("");
  const [siteLogo, setSiteLogo] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [platformBaseUrl, setPlatformBaseUrl] = useState("");
  const [festivalDescription, setFestivalDescription] = useState("");
  const [categoriesJson, setCategoriesJson] = useState("");
  const [languagesJson, setLanguagesJson] = useState("");
  const [countriesJson, setCountriesJson] = useState("");
  const [jobsJson, setJobsJson] = useState("");
  const [discoveryJson, setDiscoveryJson] = useState("");
  const [aiToolsJson, setAiToolsJson] = useState("");
  const [tagsJson, setTagsJson] = useState("");
  const [socialsJson, setSocialsJson] = useState("");
  const [homeFrJson, setHomeFrJson] = useState("{}");
  const [homeEnJson, setHomeEnJson] = useState("{}");
  const [youtubeChannelId, setYoutubeChannelId] = useState("");
  const [youtubeChannelName, setYoutubeChannelName] = useState("");
  const [youtubeOauthConnected, setYoutubeOauthConnected] = useState(false);
  const [youtubeOauthConnectedAt, setYoutubeOauthConnectedAt] = useState<
    string | null
  >(null);
  const [youtubeDefaultPrivacy, setYoutubeDefaultPrivacy] = useState<
    "private" | "unlisted" | "public"
  >("private");
  const [youtubeAutoCopyrightCheck, setYoutubeAutoCopyrightCheck] =
    useState(true);
  const [youtubeMoveToS3AfterCheck, setYoutubeMoveToS3AfterCheck] =
    useState(false);
  const [youtubeConnecting, setYoutubeConnecting] = useState(false);
  const [youtubeDisconnecting, setYoutubeDisconnecting] = useState(false);
  const [brevoSenderEmail, setBrevoSenderEmail] = useState("");
  const [emailSubmissionReceivedTemplate, setEmailSubmissionReceivedTemplate] =
    useState<Record<string, unknown>>({});
  const [emailDecisionTemplates, setEmailDecisionTemplates] = useState<
    Record<string, unknown>
  >({});
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [welcomeSaving, setWelcomeSaving] = useState(false);
  const [siteSettingsBootstrapped, setSiteSettingsBootstrapped] =
    useState(false);
  const welcomedRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (
      tabParam === "films" ||
      tabParam === "users" ||
      tabParam === "site" ||
      tabParam === "partners" ||
      tabParam === "youtube" ||
      tabParam === "email"
    ) {
      setTab(tabParam);
    }
    if (params.get("youtubeConnected") === "1") {
      toast({
        title: t("panel.youtube.connected"),
        description: t("common.save"),
        kind: "success",
      });
      params.delete("youtubeConnected");
      Promise.resolve().then(() => setSessionTick((v) => v + 1));
    }
    const youtubeError = params.get("youtubeError");
    if (youtubeError) {
      toast({
        title: t("common.error"),
        description: youtubeError,
        kind: "error",
      });
      params.delete("youtubeError");
      setTab("youtube");
    }
    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${
      nextSearch ? `?${nextSearch}` : ""
    }${window.location.hash}`;
    window.history.replaceState(null, "", nextUrl);

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
      Promise.resolve().then(() => setSessionTick((t) => t + 1));
    }
  }, [t, toast]);

  const token = getStoredToken();
  const payload = useMemo(
    () => (token ? decodeJwtPayload<{ role?: string }>(token) : null),
    [token],
  );
  const isAdminLike =
    payload?.role === "admin" || payload?.role === "moderator";
  const isAdmin = payload?.role === "admin";

  const handleTabChange = useCallback(
    (nextTab: TabKey) => {
      if (nextTab === tab) return;
      setTabTransitionLoading(true);
      setTab(nextTab);
      if (tabTransitionTimerRef.current) {
        window.clearTimeout(tabTransitionTimerRef.current);
      }
      tabTransitionTimerRef.current = window.setTimeout(() => {
        setTabTransitionLoading(false);
        tabTransitionTimerRef.current = null;
      }, 550);
    },
    [tab],
  );

  useEffect(
    () => () => {
      if (tabTransitionTimerRef.current) {
        window.clearTimeout(tabTransitionTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!token || !isAdminLike || welcomedRef.current) return;
    toast({
      title: t("nav.sessionActive"),
      description: t("nav.secureAccess"),
      kind: "success",
    });
    welcomedRef.current = true;
  }, [token, isAdminLike, t, toast]);

  useEffect(() => {
    if (token && isAdminLike) return;
    setSiteSettingsBootstrapped(false);
  }, [token, isAdminLike]);

  useEffect(() => {
    if (!token || !isAdminLike) return;
    const ac = new AbortController();
    setFilmsLoading(true);
    setFilmsError(null);
    apiFetchJson<{ items: Film[] }>("/api/admin/submissions", {
      signal: ac.signal,
    })
      .then((r) => setFilms(r.items ?? []))
      .catch((e: unknown) => {
        if (ac.signal.aborted) return;
        if (e instanceof ApiError && (e.status === 401 || e.status === 403))
          setSessionTick((t) => t + 1);
        const message = e instanceof Error ? e.message : t("common.error");
        setFilmsError(message);
        toast({
          title: t("common.error"),
          description: message,
          kind: "error",
        });
        setFilms([]);
      })
      .finally(() => {
        if (!ac.signal.aborted) setFilmsLoading(false);
      });
    return () => ac.abort();
  }, [token, isAdminLike, sessionTick, t, toast]);

  useEffect(() => {
    if (!token || !isAdminLike) return;
    const ac = new AbortController();
    apiFetchJson<{ items: JuryUser[] }>("/api/admin/jury-users", {
      signal: ac.signal,
    })
      .then((r) => setJuryUsers(r.items ?? []))
      .catch(() => {});
    return () => ac.abort();
  }, [token, isAdminLike]);

  useEffect(() => {
    if (!token || !isAdmin || tab !== "users") return;
    const ac = new AbortController();
    setUsersLoading(true);
    apiFetchJson<{ items: User[] }>("/api/users", { signal: ac.signal })
      .then((r) => setUsers(r.items ?? []))
      .catch(() => {})
      .finally(() => {
        if (!ac.signal.aborted) setUsersLoading(false);
      });
    return () => ac.abort();
  }, [token, isAdmin, tab]);

  useEffect(() => {
    if (!token || !isAdminLike) return;
    const ac = new AbortController();
    setSiteLoading(true);
    setSiteError(null);
    apiFetchJson<{ settings: SiteSettings }>("/api/admin/site", {
      signal: ac.signal,
    })
      .then((r) => {
        const s = r.settings;
        setSite(s);
        setPhase1Close(s.phase1CloseIso ? isoToLocal(s.phase1CloseIso) : "");
        setPhase2Catalogue(
          s.phase2CatalogueIso ? isoToLocal(s.phase2CatalogueIso) : "",
        );
        setPhase3Palmares(
          s.phase3PalmaresIso ? isoToLocal(s.phase3PalmaresIso) : "",
        );
        setSiteLogo(s.siteLogo ?? "");
        setHeroImageUrl(s.heroImageUrl ?? "");
        setPlatformBaseUrl(s.platformBaseUrl ?? "");
        setFestivalDescription(s.festivalDescription ?? "");
        setCategoriesJson(
          JSON.stringify(s.submissionCategories ?? [], null, 2),
        );
        setLanguagesJson(JSON.stringify(s.submissionLanguages ?? [], null, 2));
        setCountriesJson(JSON.stringify(s.submissionCountries ?? [], null, 2));
        setJobsJson(JSON.stringify(s.submissionJobs ?? [], null, 2));
        setDiscoveryJson(
          JSON.stringify(s.submissionDiscoverySources ?? [], null, 2),
        );
        setAiToolsJson(
          JSON.stringify(s.submissionAiToolSuggestions ?? [], null, 2),
        );
        setTagsJson(JSON.stringify(s.submissionSemanticTags ?? [], null, 2));
        setSocialsJson(
          JSON.stringify(s.submissionSocialNetworks ?? [], null, 2),
        );
        const homeFrBase = resources.fr.translation.home as Record<
          string,
          unknown
        >;
        const homeEnBase = resources.en.translation.home as Record<
          string,
          unknown
        >;
        const homeFr = mergeObject(homeFrBase, s.homeTranslations?.fr ?? {});
        const homeEn = mergeObject(homeEnBase, s.homeTranslations?.en ?? {});
        setHomeFrJson(JSON.stringify(homeFr, null, 2));
        setHomeEnJson(JSON.stringify(homeEn, null, 2));
        setYoutubeChannelId(s.youtubeChannelId ?? "");
        setYoutubeChannelName(s.youtubeChannelName ?? "");
        setYoutubeOauthConnected(Boolean(s.youtubeOauthConnected));
        setYoutubeOauthConnectedAt(s.youtubeOauthConnectedAt ?? null);
        setYoutubeDefaultPrivacy(s.youtubeDefaultPrivacy ?? "private");
        setYoutubeAutoCopyrightCheck(s.youtubeAutoCopyrightCheck ?? true);
        setYoutubeMoveToS3AfterCheck(s.youtubeMoveToS3AfterCheck ?? false);
        setBrevoSenderEmail(s.brevoSenderEmail ?? "");
        setEmailSubmissionReceivedTemplate(
          (s.emailSubmissionReceivedTemplate as Record<string, unknown>) ?? {},
        );
        setEmailDecisionTemplates(
          (s.emailDecisionTemplates as Record<string, unknown>) ?? {},
        );
      })
      .catch((e: unknown) => {
        if (!ac.signal.aborted)
          setSiteError(e instanceof Error ? e.message : t("common.error"));
      })
      .finally(() => {
        if (!ac.signal.aborted) {
          setSiteLoading(false);
          setSiteSettingsBootstrapped(true);
        }
      });
    return () => ac.abort();
  }, [token, isAdminLike, sessionTick, t]);

  const refreshFilms = async () => {
    const r = await apiFetchJson<{ items: Film[] }>("/api/admin/submissions");
    setFilms(r.items ?? []);
  };

  const updateStatus = async (id: string, status: Film["status"]) => {
    try {
      await apiFetchJson(
        `/api/admin/submissions/${encodeURIComponent(id)}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ status, comment: "" }),
        },
      );
      setFilms((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
      toast({
        title: t("panel.status"),
        description: t("common.save"),
        kind: "success",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : t("common.error");
      toast({
        title: t("common.error"),
        description: message,
        kind: "error",
      });
    }
  };

  const updateBadge = async (id: string, badge: Film["badge"]) => {
    try {
      await apiFetchJson(
        `/api/admin/submissions/${encodeURIComponent(id)}/badge`,
        {
          method: "POST",
          body: JSON.stringify({ badge, prize: null }),
        },
      );
      setFilms((prev) => prev.map((f) => (f.id === id ? { ...f, badge } : f)));
      toast({
        title: t("panel.badge"),
        description: t("common.save"),
        kind: "success",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : t("common.error");
      toast({
        title: t("common.error"),
        description: message,
        kind: "error",
      });
    }
  };

  const sendDecisionEmail = async (id: string) => {
    try {
      await apiFetchJson<{ ok: true }>(
        `/api/admin/submissions/${encodeURIComponent(id)}/send-email`,
        {
          method: "POST",
          body: JSON.stringify({}),
        },
      );
      toast({
        title: t("panel.films.sendEmail"),
        description: t("common.save"),
        kind: "success",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : t("common.error");
      toast({
        title: t("common.error"),
        description: message,
        kind: "error",
      });
    }
  };

  const assignBulk = async (submissionIds: string[], juryUserIds: number[]) => {
    try {
      await apiFetchJson("/api/admin/submissions/assign-jury-bulk", {
        method: "POST",
        body: JSON.stringify({ submissionIds, juryUserIds }),
      });
      await refreshFilms();
      toast({
        title: t("panel.assign"),
        description: t("common.save"),
        kind: "success",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : t("common.error");
      toast({
        title: t("common.error"),
        description: message,
        kind: "error",
      });
      throw e;
    }
  };

  const createUser = async (
    name: string,
    email: string,
    role: "jury" | "moderator",
  ) => {
    try {
      await apiFetchJson("/api/users", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          role,
          baseUrlOverride: window.location.origin,
        }),
      });
      const r = await apiFetchJson<{ items: User[] }>("/api/users");
      setUsers(r.items ?? []);
      toast({
        title: t("panel.users.create"),
        description: t("common.save"),
        kind: "success",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : t("common.error");
      toast({
        title: t("common.error"),
        description: message,
        kind: "error",
      });
      throw e;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiFetchJson(`/api/users/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast({
        title: t("common.delete"),
        description: t("common.save"),
        kind: "success",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : t("common.error");
      toast({
        title: t("common.error"),
        description: message,
        kind: "error",
      });
      throw e;
    }
  };

  const changeUserRole = async (id: string, role: "jury" | "moderator") => {
    try {
      await apiFetchJson(`/api/users/${encodeURIComponent(id)}/role`, {
        method: "PUT",
        body: JSON.stringify({
          role,
          baseUrlOverride: window.location.origin,
        }),
      });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      toast({
        title: t("panel.users.role"),
        description: t("common.save"),
        kind: "success",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : t("common.error");
      toast({
        title: t("common.error"),
        description: message,
        kind: "error",
      });
      throw e;
    }
  };

  const connectYoutubeChannel = async () => {
    setYoutubeConnecting(true);
    try {
      const result = await apiFetchJson<{ url: string }>(
        "/api/admin/youtube/connect",
      );
      if (!result?.url) throw new Error(t("common.error"));
      window.location.assign(result.url);
    } catch (e) {
      const message = e instanceof Error ? e.message : t("common.error");
      toast({
        title: t("common.error"),
        description: message,
        kind: "error",
      });
    } finally {
      setYoutubeConnecting(false);
    }
  };

  const disconnectYoutubeChannel = async () => {
    setYoutubeDisconnecting(true);
    try {
      await apiFetchJson<{ ok: true }>("/api/admin/youtube/connection", {
        method: "DELETE",
      });
      setYoutubeOauthConnected(false);
      setYoutubeOauthConnectedAt(null);
      setYoutubeChannelId("");
      setYoutubeChannelName("");
      setSite((prev) =>
        prev
          ? {
              ...prev,
              youtubeOauthConnected: false,
              youtubeOauthConnectedAt: null,
              youtubeChannelId: null,
              youtubeChannelName: null,
            }
          : prev,
      );
      toast({
        title: t("panel.youtube.disconnected"),
        description: t("common.save"),
        kind: "success",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : t("common.error");
      toast({
        title: t("common.error"),
        description: message,
        kind: "error",
      });
    } finally {
      setYoutubeDisconnecting(false);
    }
  };

  const saveSite = async () => {
    setSiteSaving(true);
    setSiteMsg(null);
    setSiteError(null);
    try {
      const parseSocials = (raw: string) => {
        if (!raw.trim()) return [];
        let p: unknown;
        try {
          p = JSON.parse(raw);
        } catch {
          throw new Error(t("panel.site.socialsInvalidJson"));
        }
        if (!Array.isArray(p))
          throw new Error(t("panel.site.socialsArrayRequired"));
        return (p as { key?: unknown; label?: unknown }[])
          .map((v) => ({
            key: String(v?.key ?? "").trim(),
            label: String(v?.label ?? "").trim(),
          }))
          .filter((v) => v.key && v.label);
      };

      const body = {
        phase1CloseIso: localToIso(phase1Close),
        phase2CatalogueIso: localToIso(phase2Catalogue),
        phase3PalmaresIso: localToIso(phase3Palmares),
        siteLogo: siteLogo || null,
        heroImageUrl: heroImageUrl || null,
        platformBaseUrl: platformBaseUrl || null,
        festivalDescription: festivalDescription || null,
        submissionCategories: parseJsonArray(
          t("panel.site.jsonFields.categories"),
          categoriesJson,
          t("panel.site.jsonInvalid", {
            label: t("panel.site.jsonFields.categories"),
          }),
          t("panel.site.arrayRequired", {
            label: t("panel.site.jsonFields.categories"),
          }),
        ),
        submissionLanguages: parseJsonArray(
          t("panel.site.jsonFields.languages"),
          languagesJson,
          t("panel.site.jsonInvalid", {
            label: t("panel.site.jsonFields.languages"),
          }),
          t("panel.site.arrayRequired", {
            label: t("panel.site.jsonFields.languages"),
          }),
        ),
        submissionCountries: parseJsonArray(
          t("panel.site.jsonFields.countries"),
          countriesJson,
          t("panel.site.jsonInvalid", {
            label: t("panel.site.jsonFields.countries"),
          }),
          t("panel.site.arrayRequired", {
            label: t("panel.site.jsonFields.countries"),
          }),
        ),
        submissionJobs: parseJsonArray(
          t("panel.site.jsonFields.jobs"),
          jobsJson,
          t("panel.site.jsonInvalid", {
            label: t("panel.site.jsonFields.jobs"),
          }),
          t("panel.site.arrayRequired", {
            label: t("panel.site.jsonFields.jobs"),
          }),
        ),
        submissionDiscoverySources: parseJsonArray(
          t("panel.site.jsonFields.discovery"),
          discoveryJson,
          t("panel.site.jsonInvalid", {
            label: t("panel.site.jsonFields.discovery"),
          }),
          t("panel.site.arrayRequired", {
            label: t("panel.site.jsonFields.discovery"),
          }),
        ),
        submissionAiToolSuggestions: parseJsonArray(
          t("panel.site.jsonFields.aiTools"),
          aiToolsJson,
          t("panel.site.jsonInvalid", {
            label: t("panel.site.jsonFields.aiTools"),
          }),
          t("panel.site.arrayRequired", {
            label: t("panel.site.jsonFields.aiTools"),
          }),
        ),
        submissionSemanticTags: parseJsonArray(
          t("panel.site.jsonFields.tags"),
          tagsJson,
          t("panel.site.jsonInvalid", {
            label: t("panel.site.jsonFields.tags"),
          }),
          t("panel.site.arrayRequired", {
            label: t("panel.site.jsonFields.tags"),
          }),
        ),
        submissionSocialNetworks: parseSocials(socialsJson),
        homeTranslations: {
          fr: JSON.parse(homeFrJson),
          en: JSON.parse(homeEnJson),
        },
        youtubeChannelId: youtubeChannelId || null,
        youtubeChannelName: youtubeChannelName || null,
        youtubeDefaultPrivacy,
        youtubeAutoCopyrightCheck,
        youtubeMoveToS3AfterCheck,
        brevoSenderEmail: brevoSenderEmail || null,
        emailSubmissionReceivedTemplate,
        emailDecisionTemplates,
      };
      const r = await apiFetchJson<{ settings: SiteSettings }>(
        "/api/admin/site",
        { method: "PUT", body: JSON.stringify(body) },
      );
      setSite(r.settings);
      setSiteMsg(t("panel.site.saved"));
      toast({
        title: t("panel.site.saved"),
        description: t("common.save"),
        kind: "success",
      });
      setTimeout(() => setSiteMsg(null), 3000);
    } catch (e) {
      const message = e instanceof Error ? e.message : t("common.error");
      setSiteError(message);
      toast({
        title: t("common.error"),
        description: message,
        kind: "error",
      });
    } finally {
      setSiteSaving(false);
    }
  };

  const closeWelcome = () => {
    setWelcomeDismissed(true);
    setShowWelcome(false);
  };

  const saveWelcome = async () => {
    const urlValue = platformBaseUrl.trim();
    const emailValue = brevoSenderEmail.trim();
    if (!urlValue) {
      toast({
        title: t("common.error"),
        description: t("panel.welcome.urlRequired"),
        kind: "error",
      });
      return;
    }
    if (!emailValue) {
      toast({
        title: t("common.error"),
        description: t("panel.welcome.emailRequired"),
        kind: "error",
      });
      return;
    }

    setWelcomeSaving(true);
    try {
      const r = await apiFetchJson<{ settings: SiteSettings }>(
        "/api/admin/site",
        {
          method: "PUT",
          body: JSON.stringify({
            platformBaseUrl: urlValue,
            brevoSenderEmail: emailValue,
          }),
        },
      );
      setSite(r.settings);
      setPlatformBaseUrl(r.settings.platformBaseUrl ?? urlValue);
      setBrevoSenderEmail(r.settings.brevoSenderEmail ?? emailValue);
      toast({
        title: t("panel.welcome.savedTitle"),
        description: t("panel.welcome.savedDescription"),
        kind: "success",
      });
      closeWelcome();
    } catch (e) {
      const message = e instanceof Error ? e.message : t("common.error");
      toast({
        title: t("common.error"),
        description: message,
        kind: "error",
      });
    } finally {
      setWelcomeSaving(false);
    }
  };

  const pendingCount = films.filter((f) => f.status === "pending").length;
  const validatedCount = films.filter((f) => f.status === "validated").length;
  const reviewCount = films.filter((f) => f.status === "review").length;
  const refusedCount = films.filter((f) => f.status === "refused").length;
  const selectedCount = films.filter((f) => f.status === "selected").length;
  const filmsTotal = films.length;
  const setupComplete =
    String(site?.platformBaseUrl ?? "").trim().length > 0 &&
    String(site?.brevoSenderEmail ?? "").trim().length > 0;

  useEffect(() => {
    if (!token || !isAdminLike || !siteSettingsBootstrapped) return;
    if (!setupComplete && !welcomeDismissed) setShowWelcome(true);
    if (setupComplete) {
      setShowWelcome(false);
      setWelcomeDismissed(false);
    }
  }, [
    token,
    isAdminLike,
    siteSettingsBootstrapped,
    setupComplete,
    welcomeDismissed,
  ]);

  useEffect(() => {
    if (!token || !isAdminLike) {
      setPanel(null);
      return;
    }

    const tabs = [
      {
        key: "films",
        label: t("nav.tabs.films"),
        badge: pendingCount || undefined,
      },
      ...(isAdmin ? [{ key: "users", label: t("nav.tabs.users") }] : []),
      { key: "site", label: t("nav.tabs.site") },
      { key: "partners", label: t("nav.tabs.partners") },
      { key: "youtube", label: t("nav.tabs.youtube") },
      { key: "email", label: t("nav.tabs.email") },
    ];

    setPanel({
      subtitle: filmsLoading ? t("common.loading") : t("nav.sessionActive"),
      stats: {
        filmsTotal,
        selectedText: `${selectedCount}/50`,
        pendingCount,
        validatedCount,
        reviewCount,
        refusedCount,
        loading: filmsLoading,
      },
      tabs,
      activeTab: tab,
      onTabChange: (key) => handleTabChange(key as TabKey),
      setupIncomplete: !setupComplete,
      onOpenSetup: () => {
        setShowWelcome(true);
        setWelcomeDismissed(false);
      },
    });
    return () => setPanel(null);
  }, [
    token,
    isAdminLike,
    filmsLoading,
    filmsTotal,
    selectedCount,
    pendingCount,
    validatedCount,
    reviewCount,
    refusedCount,
    tab,
    isAdmin,
    setupComplete,
    setPanel,
    handleTabChange,
    t,
  ]);

  if (!token || !isAdminLike) return <LoginView />;

  return (
    <div className="panel-shell text-white">
      <div className="relative mx-auto max-w-screen-2xl px-3 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
        <WelcomeView
          open={showWelcome}
          saving={welcomeSaving}
          platformBaseUrl={platformBaseUrl}
          brevoSenderEmail={brevoSenderEmail}
          onPlatformBaseUrlChange={setPlatformBaseUrl}
          onBrevoSenderEmailChange={setBrevoSenderEmail}
          onSubmit={saveWelcome}
          onSkip={closeWelcome}
        />
        {filmsError && (
          <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/8 px-5 py-4">
            <p className="f-mono text-sm text-red-400">{filmsError}</p>
          </div>
        )}

        <div
          key={tab}
          className="will-change-transform"
          style={{ animation: "fadeUp 1.00s" }}
        >
          {tabTransitionLoading && tab === "films" ? (
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <table className="w-full">
                <tbody>
                  <FilmsTableSkeletonRows rows={8} />
                </tbody>
              </table>
            </div>
          ) : null}
          {tabTransitionLoading && tab === "users" ? <UsersSkeleton /> : null}
          {tabTransitionLoading && tab === "site" ? <SiteSkeleton /> : null}
          {tabTransitionLoading && tab === "partners" ? <SiteSkeleton /> : null}
          {tabTransitionLoading && tab === "youtube" ? (
            <YoutubeSkeleton />
          ) : null}
          {tabTransitionLoading && tab === "email" ? <EmailSkeleton /> : null}

          {!tabTransitionLoading && tab === "films" && (
            <FilmsTab
              films={films}
              loading={filmsLoading}
              onRefresh={() => setSessionTick((t) => t + 1)}
              juryUsers={juryUsers}
              onStatusChange={updateStatus}
              onBadgeChange={updateBadge}
              onSendEmail={sendDecisionEmail}
              onAssignBulk={assignBulk}
            />
          )}

          {!tabTransitionLoading && tab === "users" && (
            <UsersTab
              users={users}
              loading={usersLoading}
              onRefresh={() => setSessionTick((t) => t + 1)}
              onDelete={deleteUser}
              onCreate={createUser}
              onRoleChange={changeUserRole}
            />
          )}

          {!tabTransitionLoading && tab === "site" && (
            <SiteTab
              loading={siteLoading}
              saving={siteSaving}
              msg={siteMsg}
              error={siteError}
              site={site}
              onSave={saveSite}
              phase1Close={phase1Close}
              setPhase1Close={setPhase1Close}
              phase2Catalogue={phase2Catalogue}
              setPhase2Catalogue={setPhase2Catalogue}
              phase3Palmares={phase3Palmares}
              setPhase3Palmares={setPhase3Palmares}
              siteLogo={siteLogo}
              setSiteLogo={setSiteLogo}
              heroImageUrl={heroImageUrl}
              platformBaseUrl={platformBaseUrl}
              setPlatformBaseUrl={setPlatformBaseUrl}
              setHeroImageUrl={setHeroImageUrl}
              festivalDescription={festivalDescription}
              categoriesJson={categoriesJson}
              setCategoriesJson={setCategoriesJson}
              languagesJson={languagesJson}
              setLanguagesJson={setLanguagesJson}
              countriesJson={countriesJson}
              setCountriesJson={setCountriesJson}
              jobsJson={jobsJson}
              setJobsJson={setJobsJson}
              discoveryJson={discoveryJson}
              setDiscoveryJson={setDiscoveryJson}
              aiToolsJson={aiToolsJson}
              setAiToolsJson={setAiToolsJson}
              tagsJson={tagsJson}
              setTagsJson={setTagsJson}
              socialsJson={socialsJson}
              setSocialsJson={setSocialsJson}
              homeFrJson={homeFrJson}
              setHomeFrJson={setHomeFrJson}
              homeEnJson={homeEnJson}
              setHomeEnJson={setHomeEnJson}
            />
          )}

          {!tabTransitionLoading && tab === "partners" && (
            <PartnersTab site={site} onSiteChange={setSite} />
          )}

          {!tabTransitionLoading && tab === "youtube" && (
            <YoutubeTab
              loading={siteLoading}
              saving={siteSaving}
              msg={siteMsg}
              error={siteError}
              channelId={youtubeChannelId}
              setChannelId={setYoutubeChannelId}
              channelName={youtubeChannelName}
              setChannelName={setYoutubeChannelName}
              oauthConnected={youtubeOauthConnected}
              oauthConnectedAt={youtubeOauthConnectedAt}
              privacy={youtubeDefaultPrivacy}
              setPrivacy={setYoutubeDefaultPrivacy}
              autoCheck={youtubeAutoCopyrightCheck}
              setAutoCheck={setYoutubeAutoCopyrightCheck}
              moveToS3AfterCheck={youtubeMoveToS3AfterCheck}
              setMoveToS3AfterCheck={setYoutubeMoveToS3AfterCheck}
              connecting={youtubeConnecting}
              disconnecting={youtubeDisconnecting}
              onConnect={connectYoutubeChannel}
              onDisconnect={disconnectYoutubeChannel}
              onSave={saveSite}
            />
          )}

          {!tabTransitionLoading && tab === "email" && (
            <EmailTab
              loading={siteLoading}
              saving={siteSaving}
              msg={siteMsg}
              error={siteError}
              senderEmail={brevoSenderEmail}
              setSenderEmail={setBrevoSenderEmail}
              submissionTemplate={emailSubmissionReceivedTemplate}
              setSubmissionTemplate={setEmailSubmissionReceivedTemplate}
              decisionTemplates={emailDecisionTemplates}
              setDecisionTemplates={setEmailDecisionTemplates}
              onSave={saveSite}
            />
          )}
        </div>
      </div>
    </div>
  );
}
