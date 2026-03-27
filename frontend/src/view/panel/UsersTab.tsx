import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { User, UserRole } from "./panelTypes";
import { GhostBtn, PrimaryBtn, Tag } from "./panelUi";
import { marsaiColors } from "./panelStyles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { DataTable } from "../../components/ui/data-table";
import { Combobox } from "../../components/ui/combobox";
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
import { UsersSkeleton } from "../../skeletons/UsersSkeleton";

// ── MUI Icons ─────────────────────────────────────────────────────────────────
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GavelIcon from "@mui/icons-material/Gavel";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

// ── Icône par rôle ────────────────────────────────────────────────────────────
const ROLE_ICON: Record<UserRole, React.ReactNode> = {
  admin: <AdminPanelSettingsIcon sx={{ fontSize: 14 }} />,
  moderator: <ManageAccountsIcon sx={{ fontSize: 14 }} />,
  jury: <GavelIcon sx={{ fontSize: 14 }} />,
};

const ROLE_COLOR: Record<UserRole, string> = {
  admin: marsaiColors.accent,
  moderator: marsaiColors.warning,
  jury: marsaiColors.primary,
};

export function UsersTab({
  users,
  loading,
  onRefresh,
  onDelete,
  onCreate,
  onRoleChange,
}: {
  users: User[];
  loading: boolean;
  onRefresh: () => void;
  onDelete: (id: string) => Promise<void>;
  onCreate: (
    name: string,
    email: string,
    role: "jury" | "moderator",
  ) => Promise<void>;
  onRoleChange: (id: string, role: "jury" | "moderator") => Promise<void>;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"jury" | "moderator">("jury");
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  const ROLE_LABEL: Record<UserRole, string> = {
    admin: t("panel.users.roles.admin"),
    moderator: t("panel.users.roles.moderator"),
    jury: t("panel.users.roles.jury"),
  };

  const list = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  // Compteurs par rôle
  const roleCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const u of users) c[u.role] = (c[u.role] ?? 0) + 1;
    return c;
  }, [users]);

  async function create() {
    if (!name.trim() || !email.trim()) return;
    setCreating(true);
    try {
      await onCreate(name.trim(), email.trim(), role);
      setName("");
      setEmail("");
    } finally {
      setCreating(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }

  async function changeRole(id: string, nextRole: "jury" | "moderator") {
    setUpdatingRoleId(id);
    try {
      await onRoleChange(id, nextRole);
    } finally {
      setUpdatingRoleId(null);
    }
  }

  const deleteTarget = users.find((u) => u.id === deleteId);

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      {/* ══ Formulaire création ══ */}
      <Card className="h-fit lg:col-span-4 bg-[hsl(var(--card))]">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] border border-white/10">
              <PersonAddIcon sx={{ fontSize: 18 }} className="text-white/70" />
            </div>
            <div>
              <CardTitle className="f-orb text-base">
                {t("panel.users.title")}
              </CardTitle>
              <CardDescription className="f-mono text-xs mt-0.5">
                {t("panel.users.subtitle", "Inviter un membre")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {/* Nom */}
          <div className="flex flex-col gap-1.5">
            <Label className="f-mono text-xs text-white/50 flex items-center gap-1.5">
              <PeopleOutlineIcon
                sx={{ fontSize: 12 }}
                className="text-white/25"
              />
              {t("panel.users.fullName")}
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("panel.users.fullNamePlaceholder")}
              className="f-mono"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label className="f-mono text-xs text-white/50 flex items-center gap-1.5">
              <EmailIcon sx={{ fontSize: 12 }} className="text-white/25" />
              {t("panel.users.email")}
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("panel.users.emailPlaceholder")}
              className="f-mono"
            />
          </div>

          {/* Rôle */}
          <div className="flex flex-col gap-1.5">
            <Label className="f-mono text-xs text-white/50">
              {t("panel.users.role")}
            </Label>
            <Tabs
              value={role}
              onValueChange={(v) => setRole(v as "jury" | "moderator")}
            >
              <TabsList className="w-full">
                <TabsTrigger
                  value="jury"
                  className="f-mono flex-1 text-xs flex items-center gap-1.5"
                >
                  <GavelIcon sx={{ fontSize: 13 }} />
                  {t("panel.users.roles.jury")}
                </TabsTrigger>
                <TabsTrigger
                  value="moderator"
                  className="f-mono flex-1 text-xs flex items-center gap-1.5"
                >
                  <ManageAccountsIcon sx={{ fontSize: 13 }} />
                  {t("panel.users.roles.moderator")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Hint rôle jury */}
          {role === "jury" && (
            <Alert className="border-white/8 bg-white/[0.03]">
              <InfoOutlinedIcon
                sx={{ fontSize: 14 }}
                className="shrink-0"
                style={{ color: `${marsaiColors.primary}99` }}
              />
              <AlertDescription
                className="f-mono text-xs"
                style={{ color: `${marsaiColors.primary}aa` }}
              >
                {t("panel.users.inviteHint")}
              </AlertDescription>
            </Alert>
          )}

          {/* Résumé des membres existants par rôle */}
          {users.length > 0 && (
            <div className="rounded-lg border border-white/8 divide-y divide-white/8 overflow-hidden">
              {(["jury", "moderator", "admin"] as UserRole[])
                .filter((r) => roleCounts[r])
                .map((r) => (
                  <div
                    key={r}
                    className="flex items-center justify-between px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ color: `${ROLE_COLOR[r]}99` }}>
                        {ROLE_ICON[r]}
                      </span>
                      <span className="f-mono text-xs text-white/40">
                        {ROLE_LABEL[r]}
                      </span>
                    </div>
                    <span
                      className="f-mono text-xs font-bold tabular-nums"
                      style={{ color: `${ROLE_COLOR[r]}bb` }}
                    >
                      {roleCounts[r]}
                    </span>
                  </div>
                ))}
            </div>
          )}

          <PrimaryBtn
            onClick={create}
            disabled={creating || !name.trim() || !email.trim()}
          >
            {creating ? (
              <>
                <RefreshIcon
                  sx={{ fontSize: 14 }}
                  className="mr-1.5 animate-spin"
                />
                {t("panel.users.creating")}
              </>
            ) : (
              <>
                <AddIcon sx={{ fontSize: 14 }} className="mr-1.5" />
                {t("panel.users.create")}
              </>
            )}
          </PrimaryBtn>
        </CardContent>
      </Card>

      {/* ══ Liste membres ══ */}
      <div className="flex flex-col gap-4 lg:col-span-8">
        {/* Barre recherche + refresh */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon
              sx={{ fontSize: 16 }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("panel.users.search")}
              className="f-mono pl-9"
            />
          </div>
          <GhostBtn
            onClick={onRefresh}
            disabled={loading}
            className="w-full justify-center sm:w-auto"
          >
            <RefreshIcon
              sx={{ fontSize: 14 }}
              className={`mr-1.5 ${loading ? "animate-spin" : ""}`}
            />
            {t("panel.users.refresh")}
          </GhostBtn>
        </div>

        {/* Table */}
        <Card className="overflow-hidden bg-[hsl(var(--card))]">
          <CardContent className="p-0">
            {loading ? (
              <UsersSkeleton />
            ) : list.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
                <PeopleOutlineIcon
                  sx={{ fontSize: 32 }}
                  className="text-white/10"
                />
                <p className="f-orb text-base font-black text-white/20">
                  {t("panel.users.none")}
                </p>
                {search && (
                  <p className="f-mono text-xs text-white/20">
                    Aucun résultat pour « {search} »
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="divide-y divide-white/8 lg:hidden">
                  {list.map((u) => (
                    <div key={u.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                            style={{
                              background: `${ROLE_COLOR[u.role]}18`,
                              color: ROLE_COLOR[u.role],
                              border: `1px solid ${ROLE_COLOR[u.role]}30`,
                            }}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="f-orb truncate text-sm font-bold text-white">
                              {u.name}
                            </p>
                            <p className="f-mono truncate text-xs text-white/40">
                              {u.email}
                            </p>
                          </div>
                        </div>
                        {u.role === "admin" ? null : (
                          <button
                            onClick={() => setDeleteId(u.id)}
                            title={t("panel.users.delete")}
                            className="h-7 w-7 rounded-lg border border-red-500/20 bg-red-500/5 flex items-center justify-center text-red-400/40 transition-all hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30"
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                          </button>
                        )}
                      </div>
                      <div className="mt-3 grid gap-2">
                        {u.role === "admin" ? (
                          <Tag color={ROLE_COLOR[u.role]}>
                            <span className="flex items-center gap-1">
                              <AdminPanelSettingsIcon sx={{ fontSize: 11 }} />
                              {ROLE_LABEL[u.role]}
                            </span>
                          </Tag>
                        ) : (
                          <Combobox
                            value={u.role}
                            onChange={(v) => {
                              const r = v as "jury" | "moderator";
                              if (r !== u.role) void changeRole(u.id, r);
                            }}
                            options={[
                              { value: "jury", label: ROLE_LABEL.jury },
                              {
                                value: "moderator",
                                label: ROLE_LABEL.moderator,
                              },
                            ]}
                            placeholder={ROLE_LABEL[u.role]}
                            searchable={false}
                            className="h-8 w-full f-mono text-xs"
                            renderValue={(option) =>
                              updatingRoleId === u.id ? (
                                <RefreshIcon
                                  sx={{ fontSize: 12 }}
                                  className="animate-spin"
                                />
                              ) : (
                                <span className="flex items-center gap-1.5">
                                  <span
                                    style={{
                                      color: ROLE_COLOR[u.role as UserRole],
                                    }}
                                  >
                                    {ROLE_ICON[u.role as UserRole]}
                                  </span>
                                  {option.label}
                                </span>
                              )
                            }
                          />
                        )}
                        <span className="f-mono text-[11px] flex items-center gap-1.5">
                          {u.googleSubId ? (
                            <>
                              <CheckCircleOutlineIcon
                                sx={{ fontSize: 14 }}
                                style={{ color: marsaiColors.success }}
                              />
                              <span style={{ color: marsaiColors.success }}>
                                {t("panel.users.googleConnected")}
                              </span>
                            </>
                          ) : (
                            <>
                              <CancelOutlinedIcon
                                sx={{ fontSize: 14 }}
                                className="text-white/20"
                              />
                              <span className="text-white/30">
                                {t("panel.users.googleUnlinked")}
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hidden lg:block">
                  <DataTable
                    data={list}
                    emptyLabel={t("panel.users.none")}
                    columns={[
                      {
                        header: (
                          <span className="f-mono text-xs uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                            <PeopleOutlineIcon sx={{ fontSize: 12 }} />
                            {t("panel.users.columns.name")}
                          </span>
                        ),
                        cell: (u) => (
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                              style={{
                                background: `${ROLE_COLOR[u.role]}18`,
                                color: ROLE_COLOR[u.role],
                                border: `1px solid ${ROLE_COLOR[u.role]}30`,
                              }}
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="f-orb truncate text-sm font-bold">
                                {u.name}
                              </div>
                              <div
                                className="f-mono text-[10px] flex items-center gap-1"
                                style={{ color: `${ROLE_COLOR[u.role]}80` }}
                              >
                                {ROLE_ICON[u.role]}
                                {ROLE_LABEL[u.role]}
                              </div>
                            </div>
                          </div>
                        ),
                      },
                      {
                        header: (
                          <span className="f-mono text-xs uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                            <EmailIcon sx={{ fontSize: 12 }} />
                            {t("panel.users.columns.email")}
                          </span>
                        ),
                        cell: (u) => (
                          <span className="f-mono block max-w-[280px] truncate text-sm text-white/45">
                            {u.email}
                          </span>
                        ),
                      },
                      {
                        header: (
                          <span className="f-mono text-xs uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                            <ManageAccountsIcon sx={{ fontSize: 12 }} />
                            {t("panel.users.columns.role")}
                          </span>
                        ),
                        cell: (u) =>
                          u.role === "admin" ? (
                            <Tag color={ROLE_COLOR[u.role]}>
                              <span className="flex items-center gap-1">
                                <AdminPanelSettingsIcon sx={{ fontSize: 11 }} />
                                {ROLE_LABEL[u.role]}
                              </span>
                            </Tag>
                          ) : (
                            <Combobox
                              value={u.role}
                              onChange={(v) => {
                                const r = v as "jury" | "moderator";
                                if (r !== u.role) void changeRole(u.id, r);
                              }}
                              options={[
                                { value: "jury", label: ROLE_LABEL.jury },
                                {
                                  value: "moderator",
                                  label: ROLE_LABEL.moderator,
                                },
                              ]}
                              placeholder={ROLE_LABEL[u.role]}
                              searchable={false}
                              className="h-8 min-w-[136px] f-mono text-xs"
                              renderValue={(option) =>
                                updatingRoleId === u.id ? (
                                  <RefreshIcon
                                    sx={{ fontSize: 12 }}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <span className="flex items-center gap-1.5">
                                    <span
                                      style={{
                                        color: ROLE_COLOR[u.role as UserRole],
                                      }}
                                    >
                                      {ROLE_ICON[u.role as UserRole]}
                                    </span>
                                    {option.label}
                                  </span>
                                )
                              }
                            />
                          ),
                      },
                      {
                        header: (
                          <span className="f-mono text-xs uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                            <GoogleIcon sx={{ fontSize: 12 }} />
                            {t("panel.users.columns.google")}
                          </span>
                        ),
                        cell: (u) => (
                          <span className="f-mono text-sm flex items-center gap-1.5">
                            {u.googleSubId ? (
                              <>
                                <CheckCircleOutlineIcon
                                  sx={{ fontSize: 14 }}
                                  style={{ color: marsaiColors.success }}
                                />
                                <span style={{ color: marsaiColors.success }}>
                                  {t("panel.users.googleConnected")}
                                </span>
                              </>
                            ) : (
                              <>
                                <CancelOutlinedIcon
                                  sx={{ fontSize: 14 }}
                                  className="text-white/20"
                                />
                                <span className="text-white/30">
                                  {t("panel.users.googleUnlinked")}
                                </span>
                              </>
                            )}
                          </span>
                        ),
                      },
                      {
                        header: "",
                        headerClassName: "w-12",
                        className: "text-right",
                        cell: (u) =>
                          u.role === "admin" ? null : (
                            <button
                              onClick={() => setDeleteId(u.id)}
                              title={t("panel.users.delete")}
                              className="h-7 w-7 rounded-lg border border-red-500/20 bg-red-500/5 flex items-center justify-center text-red-400/40 transition-all hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30"
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                            </button>
                          ),
                      },
                    ]}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer compteur */}
        <div className="flex items-center justify-center gap-4">
          <p className="f-mono text-xs text-white/30">
            {t("panel.users.count", { count: list.length })}
          </p>
          {search && list.length !== users.length && (
            <>
              <span className="text-white/15 text-xs">·</span>
              <p className="f-mono text-xs text-white/20">
                {users.length} au total
              </p>
            </>
          )}
        </div>
      </div>

      {/* ══ Dialog suppression ══ */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="f-orb flex items-center gap-2">
              <WarningAmberIcon
                sx={{ fontSize: 18 }}
                className="text-red-400/70"
              />
              {t("panel.users.deleteTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="f-mono">
              {t("panel.users.deleteDesc")}
              {deleteTarget && (
                <span className="mt-3 flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      background: `${ROLE_COLOR[deleteTarget.role]}18`,
                      color: ROLE_COLOR[deleteTarget.role],
                      border: `1px solid ${ROLE_COLOR[deleteTarget.role]}30`,
                    }}
                  >
                    {deleteTarget.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="f-orb text-sm font-bold text-white">
                      {deleteTarget.name}
                    </p>
                    <p className="f-mono text-xs text-white/40">
                      {deleteTarget.email}
                    </p>
                  </div>
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancelButton disabled={deleting} className="f-mono">
              {t("common.cancel")}
            </AlertDialogCancelButton>
            <AlertDialogActionButton
              disabled={deleting}
              onClick={confirmDelete}
              className="f-mono"
            >
              {deleting ? (
                <>
                  <RefreshIcon
                    sx={{ fontSize: 13 }}
                    className="mr-1.5 animate-spin"
                  />
                  {t("panel.users.deleting")}
                </>
              ) : (
                <>
                  <DeleteOutlineIcon sx={{ fontSize: 13 }} className="mr-1.5" />
                  {t("panel.users.delete")}
                </>
              )}
            </AlertDialogActionButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
