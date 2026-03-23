import React from 'react';
import { Trophy, Star, Zap } from "lucide-react";

// --- DONNÉES ---
// Images de "seed" pour simuler les avatars de la maquette
const GRAND_PRIX = [
  { id: 2, rank: 2, title: "Le monstre", director: "Pauline Hiez", country: "France", duration: "0:06", gradient: "from-[#1a202c]/40 to-[#0A0A10]/60", borderColor: "border-gray-500/30", rankBg: "bg-[#8A9BB2]", avatar: "https://picsum.photos/seed/monstre/150" },
  { id: 1, rank: 1, title: "dwmm's life", director: "s m", country: "Autre", duration: "1:02", gradient: "from-[#423812]/40 to-[#0A0A10]/60", borderColor: "border-yellow-500/50", highlight: true, rankBg: "bg-[#EAB308]", avatar: "https://picsum.photos/seed/dwmm/150" },
  { id: 3, rank: 3, title: "la/humain le début d'...", director: "doly prane", country: "Maroc", duration: "1:28", gradient: "from-[#4a2216]/40 to-[#0A0A10]/60", borderColor: "border-orange-600/30", rankBg: "bg-[#F97316]", avatar: "https://picsum.photos/seed/humain/150" },
];

const JURY_DATA = [
  { id: 4, title: "Le monstre", director: "Pauline Hiez", country: "France", time: "0:06", avatar: "https://picsum.photos/seed/monstre/100" },
  { id: 5, title: "ia/humain le début d'une roma...", director: "doly prane", country: "Maroc", time: "1:20", avatar: "https://picsum.photos/seed/humain/100" },
  { id: 6, title: "Heisenberg", director: "Pauline", country: "France", time: "0:06", avatar: "https://picsum.photos/seed/heisen/100" },
  { id: 7, title: "notre alliée l'IA", director: "alex btc", country: "Italie", time: "1:30", avatar: "https://picsum.photos/seed/alliee/100" },
  { id: 8, title: "Nature sauvage", director: "Emmanuelle DUPAS-MAHE", country: "France", time: "0:15", avatar: "https://picsum.photos/seed/nature/100" },
  { id: 9, title: "la puissance ia", director: "van db", country: "Canada", time: "1:08", avatar: "https://picsum.photos/seed/puissance/100" },
  { id: 10, title: "Le robot gentil", director: "Emmanuelle", country: "France", time: "1:05", avatar: "https://picsum.photos/seed/robot/100" },
  { id: 11, title: "évolution", director: "jean bon", country: "Maroc", time: "1:00", avatar: "https://picsum.photos/seed/evo/100" },
  { id: 12, title: "Le monstre des mars", director: "Pauline", country: "France", time: "0:10", avatar: "https://picsum.photos/seed/mars/100" },
  { id: 13, title: "l'éveil", director: "jean brian", country: "France", time: "0:05", avatar: "https://picsum.photos/seed/eveil/100" },
  { id: 14, title: "le robot maléfique", director: "Emmanuelle", country: "France", time: "0:01", avatar: "https://picsum.photos/seed/malefique/100" },
];

export const PalmaresView = () => {
  const [filter, setFilter] = React.useState<'tous' | 'top10'>('tous');
  const filteredJury = filter === 'top10' ? JURY_DATA.slice(0, 10) : JURY_DATA;

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
        .boxed-ui { background: transparent; }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-10 py-4 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/logo_marsai.png" alt="Logo" className="h-10 w-auto object-contain" />
          <div className="flex flex-col leading-none uppercase">
            <span className="font-black text-lg tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">MarsAI</span>
            <span className="text-[7px] tracking-[0.4em] opacity-50">Festival |||</span>
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
          
          <div className="flex gap-3 items-center">
            <div className="w-6 h-6 rounded-full border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] overflow-hidden cursor-pointer transition-transform">
               <img src="https://flagcdn.com/w80/fr.png" alt="FR" className="w-full h-full object-cover" />
            </div>
            <div className="w-6 h-6 rounded-full border border-white/10 overflow-hidden opacity-30 hover:opacity-100 cursor-pointer transition-all">
               <img src="https://flagcdn.com/w80/gb.png" alt="EN" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 py-12 relative z-10">
        
        <div className="boxed-ui relative overflow-hidden">
            
            {/* HEADER */}
            <header className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_#EAB308]" />
                    <p className="text-[10px] tracking-[0.2em] text-yellow-500 font-bold uppercase">MARSAI 2026 • MARSEILLE • RÉSULTATS OFFICIELS</p>
                </div>
                
                <div className="mb-4">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-widest leading-none m-0">Palmarès</h1>
                    <p className="text-[12px] tracking-widest text-white/40 uppercase font-medium mt-4">
                      12 films <span className="mx-2 text-white/20">•</span> 1 lauréats <span className="mx-2 text-white/20">•</span> Festival marsAI 2026
                    </p>
                </div>

                {/* STATS BLOCKS avec l'étoile mauve */}
                <div className="flex gap-4 mt-8">
                  <div className="bg-[#12121A]/80 border border-white/5 rounded-xl px-5 py-3 flex flex-col items-center min-w-[120px]">
                    <span className="flex items-center gap-2 text-yellow-500 font-black text-xl"><Trophy size={18} fill="currentColor"/> 1</span>
                    <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1 font-bold">Grand Prix</span>
                  </div>
                  <div className="bg-[#12121A]/80 border border-white/5 rounded-xl px-5 py-3 flex flex-col items-center min-w-[120px]">
                    <span className="flex items-center gap-2 text-white font-black text-xl"><Star size={18} fill="currentColor" className="text-purple-500"/> 11</span>
                    <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1 font-bold">Prix de Jury</span>
                  </div>
                </div>
            </header>

            <div className="relative flex items-center gap-6 mb-10 mt-16">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-yellow-500/10" />
                <span className="text-[10px] tracking-[0.8em] text-yellow-500/50 uppercase font-black">GRAND PRIX</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-yellow-500/20 to-yellow-500/10" />
            </div>

            {/* PODIUM : Cartes agrandies et ajustées */}
            <section className="mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {GRAND_PRIX.map((film) => (
                        <div key={film.id} 
                             className={`relative p-7 md:p-8 rounded-[2rem] bg-gradient-to-br ${film.gradient} border-2 ${film.borderColor} 
                             ${film.highlight ? 'scale-105 shadow-[0_0_40px_rgba(234,179,8,0.15)] z-20 border-yellow-500/50' : 'opacity-90 hover:opacity-100'} 
                             transition-all duration-500 group overflow-hidden flex items-center gap-6 min-h-[160px]`}>
                            
                            <div className="scan-line opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${film.rankBg} text-white shadow-xl z-30`}>
                                {film.rank}
                            </div>

                            {/* Image de profil agrandie */}
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-white/10 overflow-hidden shrink-0 shadow-inner">
                                <img src={film.avatar} alt={film.title} className="w-full h-full object-cover" />
                            </div>
                            
                            {/* Informations agrandies */}
                            <div className="flex flex-col flex-1 pr-4 overflow-hidden">
                                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight leading-tight mb-1.5 truncate">{film.title}</h3>
                                <div className="text-[11px] text-white/50 font-bold tracking-wider truncate mb-1">
                                  {film.director}
                                </div>
                                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-4">
                                  {film.country}
                                </div>
                                
                                <div>
                                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${film.highlight ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 'bg-white/5 border-white/10 text-white/60'} w-max`}>
                                      <Zap size={12} className={film.highlight ? 'fill-yellow-500' : 'fill-white/60'} />
                                      <span className="text-[11px] font-mono font-bold">{film.duration}</span>
                                  </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="flex items-center gap-8 mb-8 mt-12 uppercase">
                <div className="h-[1px] flex-1 bg-white/5" />
                <h2 className="text-[10px] tracking-[0.5em] text-white/20 font-black shrink-0">PRIX DU JURY • 11 FILMS</h2>
                <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            <h2 className="text-[10px] tracking-[0.5em] text-white/20 font-black uppercase mb-6">PRIX DU JURY • {filteredJury.length} FILMS</h2>

            {/* GRILLE DU JURY améliorée */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJury.map((film) => (
                    <div key={film.id} className="bg-gradient-to-br from-white/5 to-white/1 border border-white/10 rounded-2xl p-5 hover:border-white/30 transition-all group cursor-pointer shadow-lg hover:shadow-xl hover:bg-white/8">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full border border-white/20 overflow-hidden shrink-0 shadow-lg ring-1 ring-yellow-500/20">
                                <img src={film.avatar} alt={film.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-bold group-hover:text-yellow-400 text-white transition-colors uppercase tracking-tight line-clamp-2">{film.title}</h4>
                                <p className="text-[10px] text-white/50 uppercase font-medium tracking-wider mt-1">{film.director}</p>
                                <p className="text-[9px] text-white/30 uppercase tracking-wider">{film.country}</p>
                            </div>
                            <span className="text-[11px] font-mono text-yellow-500/80 font-bold ml-2">{film.time}</span>
                        </div>
                        <div className="h-[1px] bg-white/5 mb-3" />
                        <div className="text-[10px] text-white/40 flex items-center gap-2">
                            <Star size={12} className="text-purple-400" />
                            <span>Prix Jury</span>
                        </div>
                    </div>
                ))}
            </section>

        </div>

        <footer className="mt-16 pb-10 text-center">
          <p className="text-[11px] text-white/35 tracking-[0.08em]">
            La Plateforme x Mobile Film Festival · Marseille 2026
          </p>
          <p className="text-[10px] text-white/20 tracking-[0.06em] mt-1">
            Festival marsAI · Courts-métrages entièrement générés par IA
          </p>
        </footer>
      </main>
    </div>
  );
};