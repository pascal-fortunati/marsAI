import { useEffect, useState, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import FilmsTab from "./tabs/FilmsTab";
import SiteTab from "./tabs/SiteTab";
import type { AdminTab, AdminFilm, AdminStats } from "./AdminTypes";

// Placeholders pour les onglets non encore développés
const PartnersTab = () => <ComingSoon label="Partenaires" />;
const YouTubeTab = () => <ComingSoon label="YouTube" />;
const EmailsTab = () => <ComingSoon label="Emails" />;

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const getToken = () => localStorage.getItem("jwt_token") ?? localStorage.getItem("marsai_token") ?? "";


export default function AdminView() {
    const [activeTab, setActiveTab] = useState<AdminTab>("films");
    const [films, setFilms] = useState<AdminFilm[]>([]);
    const [stats, setStats] = useState<AdminStats>({
        total: 0, selected: 0, pending: 0, validated: 0, review: 0, refused: 0,
    });
    const [loading, setLoading] = useState(true);

    // Charge les films + stats
    const loadFilms = useCallback(async () => {
        try {
            const token = getToken();
            const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await fetch(`${BASE}/api/admin/films`, { headers });

            if (!res.ok) {
                const payload = await res.text();
                throw new Error(`GET /api/admin/films -> ${res.status} ${payload}`);
            }

            const data = await res.json();
            setFilms(data.films ?? []);
            setStats(data.stats ?? {
                total: 0,
                selected: 0,
                pending: 0,
                validated: 0,
                review: 0,
                refused: 0,
            });
        } catch (err) {
            console.error("[AdminView] loadFilms", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadFilms(); }, [loadFilms]);

    useEffect(() => {
        if (activeTab !== "films") return;

        const intervalId = window.setInterval(() => {
            loadFilms();
        }, 5000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [activeTab, loadFilms]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--col-bg)" }}>
            <p className="f-mono text-[11px] text-white/30 tracking-widest animate-pulse">Chargement...</p>
        </div>
    );

    return (
        <AdminLayout
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            pendingCount={stats.pending}
        >
            {activeTab === "films" && <FilmsTab films={films} onRefresh={loadFilms} />}
            {activeTab === "site" && <SiteTab />}
            {activeTab === "partners" && <PartnersTab />}
            {activeTab === "youtube" && <YouTubeTab />}
            {activeTab === "emails" && <EmailsTab />}
        </AdminLayout>
    );
}

// Placeholder onglet non développé
function ComingSoon({ label }: { label: string }) {
    return (
        <div className="flex items-center justify-center py-20">
            <p className="f-mono text-[11px] text-white/25 tracking-widest">
                Onglet {label} — à venir
            </p>
        </div>
    );
}
