import React from 'react';
// On importe les composants shadcn (assure-toi qu'ils sont installés)
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// --- DONNÉES ---
const GRAND_PRIX_DATA = [
  { id: 1, title: "Le monstre", director: "Pauline Hiez", country: "France", duration: "1:01", rank: 1 },
  { id: 2, title: "dwmm's life", director: "S.M", country: "Autre", duration: "1:32", rank: 2 },
  { id: 3, title: "ia/humain le début d'un...", director: "doly prane", country: "Maroc", duration: "1:28", rank: 3 },
];

const JURY_DATA = [
  { id: 4, title: "Le monstre", director: "Pauline Hiez", country: "France", time: "0:36" },
  { id: 5, title: "ia/humain le début...", director: "doly prane", country: "Maroc", time: "1:20" },
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
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 animate-in fade-in duration-700">
      
      {/* --- HEADER --- */}
      <header className="text-center mb-16 space-y-4">
        <p className="f-mono text-[10px] tracking-[0.3em] text-accent font-bold uppercase">
          • MARS 2026 • MARSEILLE • RÉSULTATS OFFICIELS
        </p>
        <h1 className="f-orb text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
          Palmarès
        </h1>
        <div className="flex items-center justify-center gap-4 f-mono text-sm opacity-50">
          <span>12 FILMS</span>
          <span className="text-primary">•</span>
          <span>1 LAURÉAT</span>
          <span className="text-primary">•</span>
          <span>FESTIVAL MARSAI 2026</span>
        </div>
      </header>

      {/* --- STATS / BADGES (RADIX/SHADCN) --- */}
      <div className="flex justify-center gap-4 mb-16">
        <Badge variant="outline" className="px-4 py-2 border-primary/30 bg-primary/5 gap-2 hover:bg-primary/10 transition-colors">
          <span className="text-primary font-bold">🏆 1</span>
          <span className="f-orb text-[10px] tracking-widest uppercase">Grand Prix</span>
        </Badge>
        <Badge variant="outline" className="px-4 py-2 border-border bg-secondary/50 gap-2 hover:bg-secondary transition-colors">
          <span className="text-accent font-bold">⭐ 11</span>
          <span className="f-orb text-[10px] tracking-widest uppercase">Prix du Jury</span>
        </Badge>
      </div>

      {/* --- SECTION GRAND PRIX --- */}
      <section className="max-w-7xl mx-auto mb-24">
        <div className="flex items-center gap-4 mb-8">
           <Separator className="flex-1 bg-primary/20" />
           <h2 className="f-orb text-xs tracking-[0.4em] text-primary uppercase font-bold">Grand Prix</h2>
           <Separator className="flex-1 bg-primary/20" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {GRAND_PRIX_DATA.map((film) => (
            <Card key={film.id} className="card-marsai group overflow-hidden border-primary/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-0">
                {/* Visual Placeholder */}
                <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                   <span className="f-mono text-[10px] opacity-20 group-hover:opacity-40 transition-opacity uppercase">Stream_Source_A1</span>
                   
                   {/* Rank Badge */}
                   <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center f-orb text-xs font-bold text-primary-foreground shadow-[0_0_15px_rgba(125,113,251,0.5)]">
                     {film.rank}
                   </div>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-2">
                  <h3 className="f-orb text-lg font-bold group-hover:text-primary transition-colors line-clamp-1 italic">
                    {film.title}
                  </h3>
                  <p className="f-mono text-xs opacity-50 uppercase tracking-wider">
                    {film.director} <span className="text-primary mx-1">/</span> {film.country}
                  </p>
                  <div className="pt-4 flex items-center justify-between text-[10px] f-mono opacity-30 group-hover:opacity-100 transition-opacity">
                    <span>LENGTH: {film.duration}</span>
                    <span className="text-primary">ENCRYPTED_ID_{film.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* --- SECTION PRIX DU JURY --- */}
      <section className="max-w-7xl mx-auto">
        <div className="mb-8">
           <h2 className="f-orb text-xs tracking-[0.4em] text-muted-foreground uppercase font-bold">Prix du Jury • 11 Films</h2>
           <Separator className="mt-4 bg-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {JURY_DATA.map((film) => (
            <Card key={film.id} className="bg-secondary/20 border-border/50 hover:bg-secondary/40 transition-colors cursor-pointer group">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Thumbnail Avatar style */}
                  <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="f-orb text-sm font-medium leading-none mb-1 group-hover:text-primary transition-colors">
                      {film.title}
                    </h4>
                    <p className="f-mono text-[10px] opacity-40 uppercase">
                      {film.director} • {film.country}
                    </p>
                  </div>
                </div>
                <span className="f-mono text-[10px] opacity-30">{film.time}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer minimaliste pour finir la page */}
      <footer className="mt-32 pb-8 text-center opacity-20 f-mono text-[9px] tracking-[0.5em] uppercase">
        End of Transmission — MarsAI 2026
      </footer>
    </div>
  );
};