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
  const stars = React.useMemo(
    () =>
      Array.from({ length: 95 }, (_, i) => ({
        id: i,
        size: Math.random() * 2.8 + 0.8,
        top: Math.random() * 100,
        left: Math.random() * 100,
        color: ['#ffffff', '#60a5fa', '#a78bfa'][Math.floor(Math.random() * 3)],
        opacity: Math.random() * 0.45 + 0.1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5,
      })),
    [],
  );

  return (
    <div className="min-h-screen bg-[#030208] text-white font-sans selection:bg-yellow-500/30 relative overflow-x-hidden">
      
      {/* --- EFFET WAOUH : PLUIE D'ÉTOILES IA --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-transparent blur-[90px] drift-slow" />
        <div className="absolute top-1/3 -right-24 h-[360px] w-[360px] rounded-full bg-gradient-to-br from-yellow-500/15 via-orange-500/10 to-transparent blur-[80px] drift-reverse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:26px_26px] opacity-[0.08]" />

        {stars.map((star) => (
          <div 
            key={star.id}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes scan { from { transform: translateY(-100%); opacity: 0; } 50% { opacity: 0.2; } to { transform: translateY(200%); opacity: 0; } }
        @keyframes revealUp { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes glowBreath { 0%, 100% { box-shadow: 0 0 0 rgba(234,179,8,0); } 50% { box-shadow: 0 0 22px rgba(234,179,8,0.2); } }
        @keyframes driftSlow { from { transform: translate3d(0,0,0); } to { transform: translate3d(18px,-22px,0); } }
        @keyframes driftReverse { from { transform: translate3d(0,0,0); } to { transform: translate3d(-16px,14px,0); } }
        .scan-line { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.05), transparent); animation: scan 4s infinite linear; pointer-events: none; }
        .boxed-ui { background: transparent; }
        .reveal-up { opacity: 0; animation: revealUp .7s ease-out forwards; }
        .glow-breath { animation: glowBreath 2.8s ease-in-out infinite; }
        .drift-slow { animation: driftSlow 8s ease-in-out infinite alternate; }
        .drift-reverse { animation: driftReverse 9s ease-in-out infinite alternate; }
        .hero-shine {
          background: linear-gradient(90deg, #f8fafc 0%, #fef08a 35%, #f8fafc 65%, #f8fafc 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 16px rgba(250, 204, 21, 0.14));
        }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-10 md:px-12 py-[22px] md:py-[26px] border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src="/logo_marsai.png" alt="Logo" className="h-[52px] md:h-[58px] w-auto object-contain" />
          <div className="flex flex-col leading-none uppercase">
            <span className="font-black text-[22px] md:text-[28px] tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">MarsAI</span>
            <span className="text-[8px] tracking-[0.4em] opacity-50">Festival |||</span>
          </div>
        </div>

        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <p className="font-mono text-[10px] tracking-[0.4em] text-white/20 uppercase font-bold">
            SYS:MARS_AI_2026 // <span className="opacity-60 text-white">STATUS:OPEN</span>
          </p>
        </div>

        <div className="flex items-center gap-10 md:gap-11">
          <div className="flex items-center gap-6 text-[11.5px] tracking-[0.2em] font-bold text-white/40 uppercase">
            <a href="#" className="hover:text-white transition-colors">Catalogue</a>
            <span className="opacity-10 text-white">|</span>
            <a href="#" className="text-white border-b-2 border-white pb-1">Palmarès</a>
          </div>
          
          <div className="flex gap-3 items-center">
            <div className="w-[30px] h-[30px] rounded-full border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] overflow-hidden cursor-pointer transition-transform">
               <img src="https://flagcdn.com/w80/fr.png" alt="FR" className="w-full h-full object-cover" />
            </div>
            <div className="w-[30px] h-[30px] rounded-full border border-white/10 overflow-hidden opacity-30 hover:opacity-100 cursor-pointer transition-all">
               <img src="https://flagcdn.com/w80/gb.png" alt="EN" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 py-12 relative z-10">
        
        <div className="boxed-ui relative overflow-hidden">
            
            {/* HEADER */}
            <header className="mb-10 reveal-up" style={{ animationDelay: '0.05s' }}>
              <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_#EAB308]" />
                    <p className="text-[10px] tracking-[0.2em] text-yellow-500 font-bold uppercase">MARSAI 2026 • MARSEILLE • RÉSULTATS OFFICIELS</p>
                </div>
                
                <div className="mb-4">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-[0.06em] leading-none m-0 hero-shine">Palmarès</h1>
                    <p className="text-[12px] tracking-widest text-white/40 uppercase font-medium mt-4">
                      12 films <span className="mx-2 text-white/20">•</span> 1 lauréats <span className="mx-2 text-white/20">•</span> Festival marsAI 2026
                    </p>
                </div>

                {/* STATS BLOCKS avec l'étoile mauve */}
                <div className="flex gap-4 mt-8 reveal-up" style={{ animationDelay: '0.14s' }}>
                  <div className="bg-[#12121A]/80 border border-white/5 rounded-xl px-5 py-3 flex flex-col items-center min-w-[120px] glow-breath">
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

            {/* PODIUM : Hiérarchie visuelle renforcée */}
            <section className="mb-24 reveal-up" style={{ animationDelay: '0.22s' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:items-end">
                {GRAND_PRIX.map((film, index) => (
                        <div key={film.id} 
                     style={{ animationDelay: `${0.24 + index * 0.08}s` }}
                             data-rank={film.rank}
                             className={`relative p-7 md:p-8 rounded-[2rem] bg-gradient-to-br ${film.gradient} border-2 ${film.borderColor} 
                     ${film.highlight ? 'order-1 md:order-2 md:scale-[1.08] md:min-h-[250px] shadow-[0_0_55px_rgba(234,179,8,0.22)] z-20 border-yellow-500/70' : film.rank === 2 ? 'order-2 md:order-1 md:min-h-[220px] opacity-95 hover:opacity-100' : 'order-3 md:order-3 md:min-h-[205px] opacity-95 hover:opacity-100'}
                   transition-all duration-500 group overflow-hidden flex items-center gap-5 md:gap-6 min-h-[185px] reveal-up hover:-translate-y-1`}>
                            
                                <div className="scan-line opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="absolute top-4 left-4 z-20">
                              <span className={`text-[9px] px-2.5 py-1 rounded-full border uppercase tracking-[0.2em] font-black ${film.highlight ? 'bg-yellow-500/15 text-yellow-300 border-yellow-400/40' : 'bg-white/5 text-white/70 border-white/15'}`}>
                                {film.highlight ? 'Grand Prix' : 'Finaliste'}
                              </span>
                            </div>

                            <div className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black ${film.rankBg} text-white shadow-xl z-30 ring-2 ring-white/20`}>
                                {film.rank}
                            </div>

                            {/* Image de profil agrandie */}
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-violet-400/80 overflow-hidden shrink-0 shadow-[0_0_0_2px_rgba(139,92,246,0.34)]">
                                <img src={film.avatar} alt={film.title} className="w-full h-full object-cover" />
                            </div>
                            
                            {/* Informations agrandies */}
                            <div className="flex flex-col flex-1 pr-2 md:pr-4 overflow-hidden">
                                <h3 className={`font-black uppercase tracking-tight leading-tight mb-1.5 truncate ${film.highlight ? 'text-xl md:text-2xl text-yellow-50' : 'text-lg md:text-xl'}`}>{film.title}</h3>
                                <div className="text-[11px] text-white/50 font-bold tracking-wider truncate mb-1">
                                  {film.director}
                                </div>
                                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-4">
                                  {film.country}
                                </div>
                                
                                <div>
                                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${film.highlight ? 'bg-yellow-500/12 border-yellow-400/40 text-yellow-300 shadow-[0_0_18px_rgba(234,179,8,0.2)]' : 'bg-white/5 border-white/10 text-white/60'} w-max`}>
                                      <Zap size={12} className={film.highlight ? 'fill-yellow-500' : 'fill-white/60'} />
                                      <span className="text-[11px] font-mono font-bold">{film.duration}</span>
                                  </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7 mt-12 reveal-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-5 uppercase">
                  <div className="h-[1px] w-12 md:w-20 bg-white/10" />
                  <h2 className="text-[10px] tracking-[0.5em] text-white/20 font-black shrink-0">PRIX DU JURY • {filteredJury.length} FILMS</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilter('tous')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-[0.2em] border transition-all ${filter === 'tous' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/15 hover:bg-white/10'}`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setFilter('top10')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-[0.2em] border transition-all ${filter === 'top10' ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_18px_rgba(234,179,8,0.28)]' : 'bg-white/5 text-white/60 border-white/15 hover:bg-white/10'}`}
                  >
                    Top 10
                  </button>
                </div>
            </div>

            {/* GRILLE DU JURY améliorée */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJury.map((film, index) => (
                    <div
                        key={film.id}
                        style={{ animationDelay: `${0.34 + index * 0.03}s` }}
                        className="bg-gradient-to-br from-white/5 to-white/1 border border-white/10 rounded-2xl p-5 hover:border-white/30 transition-all group cursor-pointer shadow-lg hover:shadow-xl hover:bg-white/8 reveal-up hover:-translate-y-0.5"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full border border-violet-400/80 overflow-hidden shrink-0 shadow-[0_0_0_1px_rgba(139,92,246,0.32)]">
                                <img src={film.avatar} alt={film.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-bold group-hover:text-yellow-400 text-white transition-colors uppercase tracking-tight line-clamp-2">{film.title}</h4>
                                <p className="text-[10px] text-white/50 uppercase font-medium tracking-wider mt-1">{film.director}</p>
                                <p className="text-[9px] text-white/30 uppercase tracking-wider">{film.country}</p>
                            </div>
                            <span className="text-[11px] font-mono text-yellow-500/80 font-bold ml-2">{film.time}</span>
                        </div>
                        <div className="h-[1px] bg-white/5" />
                    </div>
                ))}
            </section>

        </div>

        <footer className="mt-20 pb-14 pt-12 reveal-up" style={{ animationDelay: '0.42s' }}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 xl:gap-16 opacity-95">
            <img
              src="/logo-la-plateforme.svg"
              alt="La Plateforme"
              className="h-10 md:h-12 lg:h-14 w-auto max-w-[42vw]"
            />
            <img
              src="/logo-mobile-film-festival.svg"
              alt="Mobile Film Festival"
              className="h-12 md:h-14 lg:h-16 w-auto max-w-[46vw]"
            />
          </div>
        </footer>

      </main>
    </div>
  );
};