
import type { AdminTab, AdminStats } from "./AdminTypes";
import marsAiLogo from "../../assets/mars_ai_logo.png";
import { MarsBackground } from "../../components/MarsBackground";

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
        <div className="min-h-screen relative flex flex-col overflow-hidden" style={{ background: "var(--col-bg)" }}>
            <div className="absolute inset-0 z-0 pointer-events-none">
                <MarsBackground />
            </div>
            <header className="px-12 h-[108px] shrink-0 flex items-center relative z-10" style={{ borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(5,3,13,.94)" }}>
                <div className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-8">
                    <div className="flex items-center gap-2 min-w-[220px]">
                        <img src={marsAiLogo} alt="MarsAI" className="w-[36px] h-[36px] object-contain" />
                        <div className="leading-none">
                            <div className="flex items-center gap-1">
                                <span className="f-orb text-[16px] font-black leading-none tracking-tight">
                                    <span className="text-white">MARS</span>
                                    <span className="text-orange-500">AI</span>
                                </span>
                                <span className="f-mono text-[13px] text-white/40">·</span>
                                <span className="f-mono text-[13px] font-bold text-white/70 tracking-tight">Dashboard</span>
                            </div>
                            <p className="f-mono text-[8px] text-white/32 mt-1">Session active</p>
                        </div>
                    </div>

                    <div className="flex items-stretch justify-self-center min-w-[700px]">
                        {[
                            { value: stats.total, label: "Films", color: "text-white" },
                            { value: `${stats.selected}/50`, label: "Sélectionnés", color: "text-violet-400" },
                            { value: stats.pending, label: "En attente", color: "text-orange-400" },
                            { value: stats.validated, label: "Validés", color: "text-green-400" },
                            { value: stats.review, label: "À revoir", color: "text-purple-400" },
                            { value: stats.refused, label: "Refusés", color: "text-red-400" },
                        ].map(({ value, label, color }, index) => (
                            <div
                                key={label}
                                className="px-7 flex flex-col items-center justify-center"
                                style={{ borderLeft: index === 0 ? "1px solid rgba(255,255,255,.1)" : "none", borderRight: "1px solid rgba(255,255,255,.1)" }}
                            >
                                <span className={`f-orb text-[28px] leading-none font-black ${color}`}>{value}</span>
                                <span className="f-mono text-[11px] text-white/32 tracking-widest uppercase mt-1">{label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 justify-self-end">
                        {[{ code: "FR", flagUrl: "https://flagcdn.com/w80/fr.png" }, { code: "EN", flagUrl: "https://flagcdn.com/w80/gb.png" }].map(({ code, flagUrl }) => (
                            <button
                                key={code}
                                className="flex flex-col items-center gap-1"
                            >
                                <span
                                    className="w-[38px] h-[38px] rounded-full p-[2px] flex items-center justify-center"
                                    style={{ border: "1px solid rgba(125,113,251,.65)", background: "rgba(5, 3, 13, .5)" }}
                                >
                                    <img src={flagUrl} alt={code} className="w-full h-full rounded-full object-cover" />
                                </span>
                                <span className="f-mono text-[9px] text-white/80">{code}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Onglets */}
            <nav className="grid grid-cols-5 px-6 shrink-0 relative z-20 sticky top-[108px] bg-[rgba(5,3,13,0.94)] backdrop-blur" style={{ borderBottom: "1px solid rgba(255, 255, 255, .06)" }}>
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`relative w-full py-4 f-mono text-[13px] tracking-widest uppercase transition-colors flex items-center justify-center gap-2 ${isActive ? "text-[#7d71fb] font-bold" : "text-white/35"}`}
                            style={{ outline: "none", background: "none" }}
                        >
                            {tab.label}
                            {/* Badge rouge si film en attente */}
                            {tab.id === "films" && pendingCount > 0 && (
                                <span className="w-4 h-4 rounded-full f-mono text-[7px] font-bold flex items-center justify-center"
                                    style={{ background: "var(--col-or)", color: "black" }}>
                                    {pendingCount}
                                </span>
                            )}
                            {/* Indicateur onglet actif */}
                            {isActive && (
                                <span
                                    className="absolute left-4 right-4 -bottom-px h-px rounded-t bg-[#7d71fb]"
                                    style={{ boxShadow: "0 0 0 1px #7d71fb55" }}
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Contenu de l'onglet */}
            <main className="flex-1 overflow-y-auto p-6 relative z-10">
                {children}
            </main>
        </div>
    )
}