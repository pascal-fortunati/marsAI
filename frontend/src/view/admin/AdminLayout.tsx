import type { AdminTab, AdminStats } from "./AdminTypes";

const TABS: { id: AdminTab; label: string }[] = [
    { id: "films", label: "Films" },
    { id: "site", label: "Site" },
    { id: "partners", label: "Partenaires" },
    { id: "youtube", label: "YouTube" },
    { id: "emails", label: "Emails" },
];

interface AdminLayoutProps {
    stats: AdminStats;
    activeTab: AdminTab;
    onTabChange: (tab: AdminTab) => void;
    pendingCount: number;
    children: React.ReactNode;
}

export default function AdminLayout({
    stats, activeTab, onTabChange, pendingCount, children
}: AdminLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col" style={{ background: "var(--col-bg)" }}>
            <header className="flex items-center justify-between px-6 h-14 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(5,3,13,.95)" }}>
                {/* Logo + titre */}
                <div className="flex items-center gap-3">
                    <span className="f-orb text-sm font-black" style={{
                        background: "linear-gradient(90deg, var(--col-vi), var(--col-or))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        MARSAI
                    </span>
                    <span className="f-mono text-[9px] text-white/30">· Dashboard</span>
                    <span className="f-mono text-[8px] text-green-400/60 ml-2">Session active</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                    {[
                        { value: stats.total, label: "Films", color: "text-white" },
                        { value: `${stats.selected}/50`, label: "Sélectionnés", color: "text-violet-400" },
                        { value: stats.pending, label: "En attente", color: "text-orange-400" },
                        { value: stats.validated, label: "Validés", color: "text-green-400" },
                        { value: stats.review, label: "À revoir", color: "text-purple-400" },
                        { value: stats.refused, label: "Refusés", color: "text-red-400" },
                    ].map(({ value, label, color }) => (
                        <div key={label} className="flex flex-col items-center">
                            <span className={`f-orb text-lg font-black ${color}`}>{value}</span>
                            <span className="f-mono text-[7px] tracking-widest uppercase text-white/25">{label}</span>
                        </div>
                    ))}
                </div>
            </header>

            {/* Onglets */}
            <nav className="flex items-center px-6 shrink-0" style={{ borderBottom: "1px solid rgba(255, 255, 255, .06)" }}>
                {TABS.map((tab) => (
                    <button key={tab.id} onClick={() => onTabChange(tab.id)} className="relative px-6 py-4 f-mono text-[10px] tracking-widest uppercase transition-colors flex items-center gap-2" style={{ color: activeTab === tab.id ? "white" : "rgba(255,255,255,.35)" }}>
                        {tab.label}

                        {/* Badge rouge si film en attente */}
                        {tab.id === "films" && pendingCount > 0 && (
                            <span className="w-4 h-4 rounded-full f-mono text-[7px] font-bold flex items-center justify-center"
                                style={{ background: "var(--col-or)", color: "black" }}>
                                {pendingCount}
                            </span>
                        )}

                        {/* Indicateur onglet actif */}
                        {activeTab === tab.id && (
                            <span
                                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                                style={{ background: "linear-gradient(90deg, var(--col-vi), var(--col-or))" }}
                            />
                        )}
                    </button>
                ))}
            </nav>

            {/* Contenu de l'onglet */}
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    )
}