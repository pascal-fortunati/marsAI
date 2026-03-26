import { useState, useCallback, useEffect, useMemo } from "react";
import { Search, RefreshCw } from "lucide-react";
import FilmRow, { FilmRowModal } from "../components/FilmRow.tsx";
import type { AdminFilm, FilmStatus, DecisionAction, BadgeType } from "../AdminTypes";
import { Combobox } from "../../../components/ui/combobox";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const getToken = () => localStorage.getItem("jwt_token") ?? localStorage.getItem("marsai_token") ?? "";

const STATUS_FILTERS: { value: FilmStatus | "all"; label: string }[] = [
    { value: "all", label: "Tous statuts" },
    { value: "pending", label: "En attente" },
    { value: "validated", label: "Validés" },
    { value: "review", label: "À revoir" },
    { value: "refused", label: "Refusés" },
    { value: "selected", label: "Sélectionnés" },
];

interface FilmTabProps {
    films: AdminFilm[];
    onRefresh: () => void;
}

interface JuryOption {
    id: number;
    name: string;
    email: string;
}

const FALLBACK_JURIES: JuryOption[] = [
    { id: -1, name: "Pauline Hiez", email: "hiezpauline@gmail.com" },
    { id: -2, name: "Emmanuelle Dupas-Mahé", email: "emmanuelle.dupas-mahe@laplateforme.io" },
    { id: -3, name: "Laetitia Quintin", email: "laetitia.quintin@laplateforme.io" },
    { id: -4, name: "Pascal Fortunati", email: "pascal.fortunati@laplateforme.io" },
    { id: -5, name: "Sylvain Malbon", email: "sylvain.malbon@laplateforme.io" },
];

export default function FilmsTab({ films, onRefresh }: FilmTabProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<FilmStatus | "all">("all");
    const [showComments, setShowComments] = useState(false);
    const [selectedFilmId, setSelectedFilmId] = useState<string | null>(null);
    const [selectedFilmIds, setSelectedFilmIds] = useState<string[]>([]);
    const [juries, setJuries] = useState<JuryOption[]>([]);
    const [selectedJuryId, setSelectedJuryId] = useState("");

    // Films filtrés
    const filtered = films.filter((f) => {
        const matchSearch = [f.title, f.director_name, f.director_email, f.country].join(" ").toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || f.status == statusFilter;
        return matchSearch && matchStatus;
    });

    const juryComboboxOptions = useMemo(
        () => juries.map((jury) => ({ value: String(jury.id), label: `${jury.name} · ${jury.email}` })),
        [juries]
    );

    useEffect(() => {
        const selectableFilmIds = new Set(
            films
                .filter((film) => !film.assigned_jury_name)
                .map((film) => film.id)
        );
        setSelectedFilmIds((prev) => prev.filter((filmId) => selectableFilmIds.has(filmId)));
    }, [films]);

    useEffect(() => {
        const token = getToken();
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        void fetch(`${BASE}/api/admin/juries`, { headers })
            .then(async (response) => {
                if (!response.ok) {
                    const payload = await response.text();
                    throw new Error(`GET /api/admin/juries -> ${response.status} ${payload}`);
                }
                const data = await response.json();
                const fetchedJuries = Array.isArray(data?.juries) ? data.juries : [];
                setJuries(fetchedJuries.length > 0 ? fetchedJuries : FALLBACK_JURIES);
            })
            .catch((err) => {
                console.error("[FilmsTab] get juries", err);
                setJuries(FALLBACK_JURIES);
            });
    }, []);

    const handleRowSelect = useCallback((filmId: string, isSelected: boolean) => {
        setSelectedFilmIds((prev) => {
            if (isSelected) {
                if (prev.includes(filmId)) return prev;
                return [...prev, filmId];
            }
            return prev.filter((id) => id !== filmId);
        });
    }, []);

    const handleAssignSelected = useCallback(async () => {
        if (!selectedJuryId || selectedFilmIds.length === 0) return;

        const token = getToken();
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const response = await fetch(`${BASE}/api/admin/jury-assignments`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                jury_user_id: Number(selectedJuryId),
                submission_ids: selectedFilmIds,
            }),
        });

        if (!response.ok) {
            const payload = await response.text();
            throw new Error(`POST /api/admin/jury-assignments -> ${response.status} ${payload}`);
        }

        setSelectedFilmIds([]);
        setSelectedJuryId("");
        onRefresh();
    }, [onRefresh, selectedFilmIds, selectedJuryId]);

    const handleCancelAssign = useCallback(() => {
        setSelectedFilmIds([]);
        setSelectedJuryId("");
    }, []);

    // Envoie la décision admin au backend
    const handleDecision = useCallback(async (
        filmId: string,
        action: DecisionAction,
        badge?: BadgeType
    ) => {
        const token = getToken();
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const response = await fetch(`${BASE}/api/admin/decisions`, {
            method: "POST",
            headers,
            body: JSON.stringify({ submission_id: filmId, decision: action, badge: badge ?? null }),
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Decision update failed (${response.status}): ${errText}`);
        }

        onRefresh();
    }, [onRefresh]);

    // Envoie un email au réalisateur
    const handleEmail = useCallback(async (filmId: string) => {
        await fetch(`${BASE}/api/admin/email/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ submission_id: filmId }),
        });
        onRefresh();
    }, [onRefresh]);


    return (
        <div className="space-y-4">

            {/* Barre de recherche + filtres */}
            <div className="grid grid-cols-[minmax(0,1fr)_260px_160px] items-center gap-3 w-full">
                <div className="relative min-w-0">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                        className="submit-input admin-search-input h-12 pr-4"
                        style={{
                            paddingLeft: "2.5rem",
                            background: "#100d22",
                            borderColor: "rgba(125,113,251,.2)",
                            color: "rgba(255,255,255,.88)",
                        }}
                        placeholder="Rechercher par titre, réalisateur, pays ou ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <Combobox
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value as FilmStatus | "all")}
                        options={STATUS_FILTERS.map(({ value, label }) => ({ value, label }))}
                        placeholder="Tous statuts"
                        searchable={false}
                        className="h-12 w-full rounded-xl px-4 f-mono text-[11px]"
                        contentClassName="rounded-xl border border-white/15 bg-[#07051a]"
                        triggerStyle={{
                            color: "rgba(255,255,255,.88)",
                            border: "1px solid rgba(125,113,251,.2)",
                            background: "#100d22",
                        }}
                    />
                </div>

                <button onClick={onRefresh} className="h-12 px-5 rounded-xl f-mono text-[10px] tracking-widest uppercase inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-80" style={{ border: "1px solid rgba(125,113,251,.35)", color: "rgba(202,195,255,.95)", background: "rgba(125,113,251,.08)" }}>
                    <RefreshCw size={11} />
                    Rafraîchir
                </button>
            </div>

            {selectedFilmIds.length > 0 && (
                <div className="rounded-2xl p-4" style={{ border: "1px solid rgba(255,255,255,.1)", background: "rgba(10,7,28,.72)" }}>
                    <div className="flex items-center gap-4 mb-4">
                        <p className="f-orb text-[14px] text-[#8b7bff]">{selectedFilmIds.length} Film(s) sélectionné(s)</p>
                        <span className="text-white/20">|</span>
                        <p className="f-mono text-[12px] text-white/55">Assigner exclusivement à :</p>
                    </div>

                    <Combobox
                        value={selectedJuryId}
                        onChange={setSelectedJuryId}
                        options={juryComboboxOptions}
                        placeholder="– Choisir un juré –"
                        searchable={false}
                        className="h-12 w-full rounded-xl px-4 f-mono text-[11px]"
                        contentClassName="rounded-xl border border-white/15 bg-[#07051a]"
                        triggerStyle={{
                            color: "rgba(255,255,255,.85)",
                            border: "1px solid rgba(125,113,251,.35)",
                            background: "rgba(8,7,24,.8)",
                        }}
                    />

                    <div className="mt-4 flex items-center gap-3">
                        <button
                            onClick={() => void handleAssignSelected()}
                            disabled={!selectedJuryId}
                            className="h-11 rounded-2xl px-6 f-mono text-[11px] inline-flex items-center justify-center disabled:opacity-45 disabled:cursor-not-allowed"
                            style={{
                                background: "rgba(125,113,251,.42)",
                                color: "rgba(255,255,255,.92)",
                            }}
                        >
                            Assigner
                        </button>

                        <button
                            onClick={handleCancelAssign}
                            className="h-11 rounded-2xl px-6 f-mono text-[11px]"
                            style={{
                                border: "1px solid rgba(125,113,251,.35)",
                                color: "rgba(255,255,255,.75)",
                                background: "rgba(125,113,251,.08)",
                            }}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {/* Barre de progression sélection officielle */}
            <div className="pt-2 pb-1 px-1">
                <div className="flex items-center gap-4">
                    <span className="f-mono text-[15px] text-white/60 tracking-widest">Sélection officielle</span>
                    <div className="flex-1 flex items-center">
                        <div className="w-full h-2 rounded-full bg-white/5 relative overflow-hidden">
                            <div
                                className="absolute left-0 top-0 h-2 rounded-full bg-[#a892fd]"
                                style={{ width: `${Math.min((films.filter(f => f.status === "selected").length / 50) * 100, 100)}%`, transition: 'width 0.4s cubic-bezier(.4,1.2,.4,1)' }}
                            />
                        </div>
                    </div>
                    <span className="f-orb text-[18px] text-[#a892fd] font-bold ml-4">{films.filter(f => f.status === "selected").length}/50</span>
                </div>
            </div>


            {/* Tableau */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,.07)", background: "#070518" }}>
                <div className="overflow-x-auto" style={{ background: "#070518" }}>
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,.07)", background: "#0f0c22" }}>
                                {[
                                    "", "Film · Réalisateur", "Pays · Durée",
                                    "Jury assigné", "Commentaires", "Statut",
                                    "Badge", "Lien YouTube", "E-mail",
                                ].map((h) => (
                                    <th key={h} className="px-3 py-2.5 text-left">
                                        <span className="f-mono text-[8px] tracking-widest uppercase text-white/30">{h}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-10 text-center">
                                        <p className="f-mono text-[10px] text-white/25 tracking-widest">
                                            Aucun film trouvé
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((film) => (
                                    <FilmRow
                                        key={film.id}
                                        film={film}
                                        selected={selectedFilmIds.includes(film.id)}
                                        onToggleSelect={handleRowSelect}
                                        onDecision={handleDecision}
                                        onEmail={handleEmail}
                                        onCommentClick={() => {
                                            setSelectedFilmId(film.id);
                                            setShowComments(true);
                                        }}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedFilmId && (
                <FilmRowModal
                    film={films.find((f) => f.id === selectedFilmId)!}
                    open={showComments}
                    onClose={() => {
                        setShowComments(false);
                        setSelectedFilmId(null);
                    }}
                />
            )}
        </div >
    )

}