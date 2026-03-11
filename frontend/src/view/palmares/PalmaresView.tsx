import React from 'react';
import { Trophy, Star, Zap, Film } from "lucide-react";

// --- DONNÉES ---
const GRAND_PRIX = [
  { id: 2, rank: 2, title: "Le monstre", director: "Pauline Hiez", country: "France", duration: "0:06", borderColor: "border-gray-500/30", rankBg: "bg-[#4A5568]" },
  { id: 1, rank: 1, title: "dwmm's life", director: "s m", country: "Autre", duration: "1:02", borderColor: "border-yellow-500/50", highlight: true, rankBg: "bg-[#EAB308]" },
  { id: 3, rank: 3, title: "ia/humain le début d'...", director: "doly prane", country: "Maroc", duration: "1:28", borderColor: "border-orange-600/30", rankBg: "bg-[#EA580C]" },
];

const JURY_DATA = [
  { id: 4, title: "Le monstre", director: "Pauline Hiez", country: "France", time: "0:36" },
  { id: 5, title: "ia/humain le début d'une roma...", director: "doly prane", country: "Maroc", time: "1:20" },
  { id: 6, title: "Heisenberg", director: "Pauline", country: "France", time: "2:06" },
  { id: 7, title: "notre alliée l'IA", director: "alex btc", country: "Italie", time: "1:30" },
  { id: 8, title: "Nature sauvage", director: "Emmanuelle", country: "France", time: "4:15" },
  { id: 9, title: "la puissance ia", director: "van db", country: "Canada", time: "1:08" },
  { id: 10, title: "Le robot gentil", director: "Emmanuelle", country: "France", time: "1:05" },
  { id: 11, title: "évolution", director: "jean bon", country: "Maroc", time: "1:00" },
  { id: 12, title: "Le monstre des mars", director: "Pauline", country: "France", time: "0:10" },
  { id: 13, title: "l'éveil", director: "jean brian", country: "France", time: "0:05" },
  { id: 14, title: "le robot maléfique", director: "Emmanuelle", country: "France", time: "0:01" },
];

export const PalmaresView = () => {
  return (
    <div className="min-h-screen bg-[#030208] text-white font-sans selection:bg-yellow-500/30 relative overflow-x-hidden">
      
      {/* --- EFFET WAOUH : PLUIE D'ÉTOILES IA --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(100)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              backgroundColor: ['#ffffff', '#60a5fa', '#a78bfa'][Math.floor(Math.random() * 3)],
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.4 + 0.1,
              animationDuration: (Math.random() * 3 + 2) + 's',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes scan { from { transform: translateY(-100%); opacity: 0; } 50% { opacity: 0.2; } to { transform: translateY(200%); opacity: 0; } }
        .scan-line { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.05), transparent); animation: scan 4s infinite linear; pointer-events: none; }
        .boxed-ui { border: 1px solid rgba(255, 255, 255, 0.05); background: rgba(10, 10, 15, 0.4); backdrop-filter: blur(20px); }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-10 py-4 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/logo_marsai.png" alt="Logo" className="h-10 w-auto object-contain" />
          <div className="flex flex-col leading-none uppercase italic">
            <span className="font-black text-lg tracking-tighter">MarsAI</span>
            <span className="text-[7px] tracking-[0.4em] opacity-30">Festival |||</span>
          </div>
        </div>

        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <p className="font-mono text-[9px] tracking-[0.4em] text-white/20 uppercase font-bold">
            SYS:MARS_AI_2026 // <span className="opacity-60 text-white">STATUS:OPEN</span>
          </p>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6 text-[10px] tracking-[0.2em] font-bold text-white/40 uppercase">
            <a href="#" className="hover:text-white transition-colors">Catalogue</a>
            <span className="opacity-10 text-white">|</span>
            <a href="#" className="text-white border-b-2 border-white pb-1">Palmarès</a>
          </div>
          
          {/* DRAPEAUX EN IMAGES */}
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] overflow-hidden cursor-pointer hover:scale-110 transition-transform">
               <img src="https://flagcdn.com/w80/fr.png" alt="FR" className="w-full h-full object-cover scale-125" />
            </div>
            <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden opacity-30 hover:opacity-100 cursor-pointer transition-all hover:scale-110">
               <img src="https://flagcdn.com/w80/gb.png" alt="EN" className="w-full h-full object-cover scale-125" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1300px] mx-auto px-6 py-16 relative z-10">
        
        {/* LE BOX DU CHEF */}
        <div className="boxed-ui rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden">
            
            {/* HEADER MODÉRÉ */}
            <header className="mb-14">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_#EAB308]" />
                    <p className="text-[10px] tracking-[0.4em] text-yellow-500 font-bold uppercase italic">MARSAI 2026 • RÉSULTATS OFFICIELS</p>
                </div>
                <div className="relative inline-block">
                    <div className="absolute -top-4 -left-8 w-4 h-4 border-t border-l border-white/10 opacity-30" />
                    <div className="absolute -bottom-4 -right-8 w-4 h-4 border-b border-r border-white/10 opacity-30" />
                    <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-none m-0">Palmarès</h1>
                </div>
                <p className="text-[11px] tracking-[0.4em] text-white/20 uppercase mt-4 font-bold italic">Festival International marsAI 2026</p>
            </header>

            {/* SÉPARATEUR GRAND PRIX */}
            <div className="relative flex items-center gap-6 mb-12">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-yellow-500/20" />
                <span className="text-[10px] tracking-[0.8em] text-yellow-500/50 uppercase font-black italic">GRAND PRIX</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-yellow-500/20 to-yellow-500/20" />
            </div>

            {/* PODIUM : RECTANGLES ALIGNÉS (3 colonnes) */}
            <section className="mb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {GRAND_PRIX.map((film) => (
                        <div key={film.id} 
                             className={`relative p-8 rounded-[2rem] bg-[#0A0A10]/60 border-2 ${film.borderColor} 
                             ${film.highlight ? 'scale-105 shadow-[0_0_50px_rgba(234,179,8,0.1)] z-20 border-yellow-500/50' : 'opacity-80 hover:opacity-100'} 
                             transition-all duration-500 group overflow-hidden`}>
                            
                            <div className="scan-line opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className={`absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${film.rankBg} text-white shadow-xl z-30`}>
                                {film.rank}
                            </div>

                            <div className="flex flex-col items-center md:items-start">
                                <div className={`w-full aspect-video rounded-2xl border border-white/10 overflow-hidden bg-neutral-900 mb-6 shadow-inner`}>
                                    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center text-white/5"><Film /></div>
                                </div>
                                
                                <div className="w-full pr-10">
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter leading-tight mb-1 truncate">{film.title}</h3>
                                    <p className="text-[10px] text-white/40 uppercase font-black mb-0.5 truncate">{film.director}</p>
                                    <p className="text-[10px] text-white/20 uppercase mb-5 tracking-widest">{film.country}</p>
                                    
                                    <div className="inline-flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                                        <Zap size={11} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-[11px] font-mono text-yellow-500 font-bold">{film.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SÉPARATEUR JURY */}
            <div className="flex items-center gap-8 mb-12 uppercase italic">
                <div className="h-[1px] flex-1 bg-white/5" />
                <h2 className="text-[10px] tracking-[0.5em] text-white/20 font-black shrink-0">PRIX DU JURY • 11 FILMS</h2>
                <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            {/* GRILLE DU JURY */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {JURY_DATA.map((film) => (
                    <div key={film.id} className="bg-[#0B0B12]/50 border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:bg-[#15151F] transition-all group cursor-pointer shadow-lg">
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-12 h-12 rounded-full border border-white/5 bg-neutral-900 shrink-0" />
                            <div>
                                <h4 className="text-[13px] font-black group-hover:text-orange-500 transition-colors uppercase italic mb-0.5 tracking-tight">{film.title}</h4>
                                <p className="text-[9px] text-white/30 uppercase font-bold tracking-tighter truncate max-w-[150px]">{film.director} • {film.country}</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-mono text-white/10">{film.time}</span>
                    </div>
                ))}
            </section>

            <footer className="mt-32 text-center opacity-10">
                <p className="text-[9px] tracking-[0.8em] uppercase font-black italic">Transmission Terminal // marsAI 2026</p>
            </footer>
        </div>
      </main>
    </div>
  );
};