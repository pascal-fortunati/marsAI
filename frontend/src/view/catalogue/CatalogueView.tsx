import { useState } from 'react';

interface Movie {
    id: number;
    title: string;
    author: string;
    authorDescription: string;
    posterUrl: string;
    embedId: string;
    category: string;
    ia_models: string[];
}

const MOCK_MOVIES: Movie[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: i % 2 === 0 ? "Le monstre" : "la/humain : début d'une romance",
    author: i % 2 === 0 ? "Pauline Miez" : "doly prane",
    authorDescription: i % 2 === 0 ? "Le monstre attaque la ville." : "Une exploration de l'IA dans notre quotidien.",
    posterUrl: `https://picsum.photos/seed/${i + 20}/800/450`,
    embedId: i % 2 === 0 ? "DcOTBiw9v5s" : "Sa4XaSA-9Us",
    category: "Sélection Officielle",
    ia_models: i % 2 === 0 ? ["grok"] : ["Midjourney", "Synthesia"],
}));

export function CatalogueView() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const moviesPerPage = 20;
    const totalPages = Math.ceil(MOCK_MOVIES.length / moviesPerPage);
    const currentMovies = MOCK_MOVIES.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage);

    return (
        /* Le conteneur extérieur qui prend tout l'écran avec un fond sombre */
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">

            {/* Halo */}
            <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Contenu principal */}
            <div className="relative mx-auto max-w-7xl px-5 py-12">

                {/* Header */}
                <header className="mb-16">
                    <div className="flex items-center gap-3 text-sm text-primary uppercase font-bold tracking-widest f-orb mb-4">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        SÉLECTION OFFICIELLE • FESTIVAL MARSAI 2026
                    </div>
                    <h1 className="text-5xl font-black uppercase f-orb tracking-tighter mb-4">
                        Catalogue <span className="bg-gradient-to-r from-[#7d71fb] to-[#ff5c35] text-transparent bg-clip-text">2026</span>
                    </h1>
                    <p className="f-mono text-muted-foreground uppercase text-sm tracking-widest">
                        {"//"} {MOCK_MOVIES.length} fichiers identifiés
                    </p>
                </header>

                {/* Grille de cartes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {currentMovies.map((movie) => (
                        <div
                            key={movie.id}
                            className="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all duration-300 shadow-neon"
                            onClick={() => setSelectedMovie(movie)}
                        >
                            <div className="relative aspect-video overflow-hidden">
                                <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent group-hover:via-background/20 transition-all"></div>

                                {/* Bouton Play Youtube à nos couleurs*/}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-neon transform group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-[#7d71fb] to-[#ff5c35]">
                                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <span className="text-xs text-muted-foreground uppercase f-orb">{movie.category}</span>
                                <h3 className="text-lg font-bold mt-1 uppercase f-orb truncate">{movie.title}</h3>
                                <p className="text-muted-foreground f-mono mt-1 text-sm">{movie.author}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* La pagination */}
                <div className="flex justify-center items-center mt-20 space-x-4 f-mono">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="cursor-pointer text-muted-foreground hover:text-primary disabled:opacity-20 uppercase text-xs tracking-widest"
                    >
                        ← 
                    </button>

                    <div className="flex space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className={`cursor-pointer w-8 h-8 rounded-full border text-xs transition-all ${currentPage === i + 1 ? 'bg-primary border-primary text-primary-foreground font-bold' : 'border-border text-muted-foreground hover:border-primary'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="cursor-pointer text-muted-foreground hover:text-primary disabled:opacity-20 uppercase text-xs tracking-widest"
                    >
                         →
                    </button>
                </div>
            </div>

            {/* Modal avec Embed YouTube */}
            {selectedMovie && (
                <div className="youtube-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="youtube-modal-card bg-card w-full max-w-4xl rounded-xl border border-border relative shadow-2xl overflow-hidden max-h-[90vh]">
                        <button
                            onClick={() => setSelectedMovie(null)}
                            className="youtube-modal-close absolute top-4 right-4 z-20 text-foreground bg-background/60 w-10 h-10 rounded-full flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-lg"
                        >
                            ✕
                        </button>

                        <div className="youtube-video-wrapper relative w-full bg-black h-[min(56.25vw,50vh)] max-h-[50vh] md:h-[min(60vw,55vh)] md:max-h-[55vh]">
                            <iframe
                                className="youtube-iframe absolute inset-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${selectedMovie.embedId}?autoplay=1&rel=0`}
                                title={selectedMovie.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="p-8">
                            <h2 className="text-3xl font-black f-orb uppercase tracking-tighter">{selectedMovie.title}</h2>
                            <p className="f-mono text-primary text-sm uppercase mt-1">
                                {selectedMovie.author} {"//"} YT_STREAM_2026
                            </p>
                            <p className="text-muted-foreground mt-4 leading-relaxed max-w-2xl">
                                {selectedMovie.authorDescription}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}