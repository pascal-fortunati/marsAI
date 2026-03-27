import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Combobox } from "../../components/ui/combobox";
import { Checkbox } from "../../components/ui/checkbox";
import { Separator } from "../../components/ui/separator";
import {
  VideoIcon,
  LinkBreak2Icon,
  Link2Icon,
  CheckCircledIcon,
  CrossCircledIcon,
  CalendarIcon,
  LockClosedIcon,
  EyeNoneIcon,
  GlobeIcon,
} from "@radix-ui/react-icons";
import { GhostBtn, PrimaryBtn } from "./panelUi";
import { YoutubeSkeleton } from "../../skeletons/YoutubeSkeleton";

export function YoutubeTab({
  loading,
  saving,
  msg,
  error,
  channelId,
  channelName,
  oauthConnected,
  oauthConnectedAt,
  privacy,
  setPrivacy,
  autoCheck,
  setAutoCheck,
  moveToS3AfterCheck,
  setMoveToS3AfterCheck,
  connecting,
  disconnecting,
  onConnect,
  onDisconnect,
  onSave,
}: {
  loading: boolean;
  saving: boolean;
  msg: string | null;
  error: string | null;
  channelId: string;
  setChannelId: (v: string) => void;
  channelName: string;
  setChannelName: (v: string) => void;
  oauthConnected: boolean;
  oauthConnectedAt: string | null;
  privacy: "private" | "unlisted" | "public";
  setPrivacy: (v: "private" | "unlisted" | "public") => void;
  autoCheck: boolean;
  setAutoCheck: (v: boolean) => void;
  moveToS3AfterCheck: boolean;
  setMoveToS3AfterCheck: (v: boolean) => void;
  connecting: boolean;
  disconnecting: boolean;
  onConnect: () => Promise<void> | void;
  onDisconnect: () => Promise<void> | void;
  onSave: () => Promise<void> | void;
}) {
  const { t, i18n } = useTranslation();

  if (loading) {
    return <YoutubeSkeleton />;
  }

  const privacyOptions = [
    {
      value: "private",
      label: t("panel.youtube.privacy.private"),
      icon: <LockClosedIcon className="h-3.5 w-3.5" />,
    },
    {
      value: "unlisted",
      label: t("panel.youtube.privacy.unlisted"),
      icon: <EyeNoneIcon className="h-3.5 w-3.5" />,
    },
    {
      value: "public",
      label: t("panel.youtube.privacy.public"),
      icon: <GlobeIcon className="h-3.5 w-3.5" />,
    },
  ];

  const avatarSource = (channelName || channelId || "Y").trim();
  const avatarLetter = avatarSource.charAt(0).toUpperCase();
  const displayName = channelName || t("panel.youtube.channelNamePlaceholder");

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7 bg-[hsl(var(--card))]">
          <CardContent className="pt-5 grid gap-4">
            {/* En-tête : icône service + statut */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] border border-white/10">
                  <VideoIcon className="h-4 w-4 text-white/70" />
                </div>
                <div>
                  <p className="f-orb text-sm font-semibold text-white/90">
                    {t("panel.youtube.title")}
                  </p>
                  <p className="f-mono text-[11px] text-white/40 mt-0.5">
                    {t("panel.youtube.subtitle")}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 f-mono text-[11px] border ${
                  oauthConnected
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-600/40 bg-zinc-800/40 text-zinc-400"
                }`}
              >
                {oauthConnected ? (
                  <CheckCircledIcon className="h-3 w-3" />
                ) : (
                  <CrossCircledIcon className="h-3 w-3" />
                )}
                {oauthConnected
                  ? t("panel.youtube.connected")
                  : t("panel.youtube.disconnected")}
              </span>
            </div>

            <Separator className="opacity-40" />

            {/* Canal : avatar + nom */}
            <div className="flex flex-col gap-3 rounded-lg border border-white/8 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center">
              <div className="h-10 w-10 shrink-0 rounded-full border border-white/15 bg-gradient-to-br from-[#7d71fb]/35 to-[#ff5c35]/30 flex items-center justify-center">
                <span className="f-orb text-sm font-black text-white/95">
                  {avatarLetter}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="f-mono text-[10px] uppercase tracking-wider text-white/35 mb-0.5">
                  {t("panel.youtube.channelName")}
                </p>
                <p
                  className={`f-mono text-sm truncate ${
                    channelName ? "text-white/90" : "text-white/25 italic"
                  }`}
                >
                  {displayName}
                </p>
              </div>

              {/* Date de connexion inline à droite */}
              {oauthConnectedAt && (
                <div className="flex items-center gap-1.5 text-white/30 sm:ml-auto shrink-0">
                  <CalendarIcon className="h-3 w-3" />
                  <span className="f-mono text-[10px]">
                    {new Date(oauthConnectedAt).toLocaleDateString(
                      i18n.language?.startsWith("fr") ? "fr-FR" : "en-US",
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Actions connexion */}
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
              <PrimaryBtn
                disabled={connecting || oauthConnected}
                onClick={() => void onConnect()}
                className="w-full justify-center sm:w-auto sm:min-w-[220px]"
              >
                <Link2Icon className="h-3.5 w-3.5 mr-1.5" />
                {connecting
                  ? t("panel.youtube.connecting")
                  : t("panel.youtube.connect")}
              </PrimaryBtn>
              <GhostBtn
                disabled={disconnecting || !oauthConnected}
                onClick={() => void onDisconnect()}
                className="h-11 w-full justify-center sm:w-auto sm:min-w-[220px]"
              >
                <LinkBreak2Icon className="h-3.5 w-3.5 mr-1.5" />
                {disconnecting
                  ? t("panel.youtube.disconnecting")
                  : t("panel.youtube.disconnectChannel")}
              </GhostBtn>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 bg-[hsl(var(--card))]">
          <CardContent className="pt-5 grid gap-5">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="f-orb text-sm text-white/70">
                {t("panel.youtube.defaultPrivacy")}
              </p>
              <PrimaryBtn
                disabled={saving}
                onClick={() => void onSave()}
                className="w-full justify-center sm:w-auto"
              >
                {saving ? t("panel.site.saving") : t("panel.site.save")}
              </PrimaryBtn>
            </div>

            {msg && (
              <span className="f-mono text-sm text-emerald-400 flex items-center gap-1.5">
                <CheckCircledIcon className="h-3.5 w-3.5" />
                {msg}
              </span>
            )}
            {error && (
              <span className="f-mono text-sm text-red-400 flex items-center gap-1.5">
                <CrossCircledIcon className="h-3.5 w-3.5" />
                {error}
              </span>
            )}

            {/* Visibilité par défaut */}
            <div className="grid gap-1.5">
              <Label className="f-mono text-[11px] text-white/40 uppercase tracking-wider">
                {t("panel.youtube.defaultPrivacy")}
              </Label>
              <Combobox
                value={privacy}
                onChange={(v) =>
                  setPrivacy(v as "private" | "unlisted" | "public")
                }
                options={privacyOptions.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                }))}
                placeholder={
                  privacyOptions.find((o) => o.value === privacy)?.label ?? ""
                }
                searchable={false}
                className="f-mono"
                renderOption={(option) => {
                  const opt = privacyOptions.find(
                    (o) => o.value === option.value,
                  );
                  return (
                    <span className="flex items-center gap-2 f-mono">
                      {opt?.icon}
                      {option.label}
                    </span>
                  );
                }}
                renderValue={(option) => {
                  const opt = privacyOptions.find(
                    (o) => o.value === option.value,
                  );
                  return (
                    <span className="flex items-center gap-2">
                      {opt?.icon}
                      {option.label}
                    </span>
                  );
                }}
              />
            </div>

            <Separator className="opacity-40" />

            {/* Automatisation */}
            <div className="grid gap-3">
              <p className="f-mono text-[10px] uppercase tracking-wider text-white/35">
                Automatisation
              </p>

              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={autoCheck}
                  onCheckedChange={(v) => setAutoCheck(Boolean(v))}
                  className="mt-0.5"
                />
                <span className="f-mono text-sm text-white/70 group-hover:text-white/90 transition-colors leading-snug">
                  {t("panel.youtube.autoCheck")}
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={moveToS3AfterCheck}
                  onCheckedChange={(v) => setMoveToS3AfterCheck(Boolean(v))}
                  className="mt-0.5"
                />
                <span className="f-mono text-sm text-white/70 group-hover:text-white/90 transition-colors leading-snug">
                  {t("panel.youtube.moveToS3AfterCheck")}
                </span>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
