import { useState } from 'react';

// définition du type pour un Film
interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  videoUrl: string;
  duration: string;
  category: string;
}

// simulation de 50 films 
const MOCK_MOVIES: Movie[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `IA Film - ${i + 1}`,
  description: "Une exploration visuelle générée par intelligence artificielle.",
  posterUrl: `https://picsum.photos/seed/${i + 10}/800/450`,
  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  duration: "2m 30s",
  category: "Sélection Officielle",
}));

export default function CatalogueView() {
  // États pour la pagination et la modal
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const moviesPerPage = 20;
  const totalMovies = MOCK_MOVIES.slice(0, 50); // Critère : Max 50 films
  
  // Calcul de la pagination
  const lastIndex = currentPage * moviesPerPage;
  const firstIndex = lastIndex - moviesPerPage;
  const currentMovies = totalMovies.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(totalMovies.length / moviesPerPage);

  return (
    <div className="min-h-screen bg-[#05050f] text-white p-6 md:p-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight uppercase">
          Catalogue <span className="text-purple-500">2026</span>
        </h1>
        <p className="text-gray-400 mt-2">{totalMovies.length} films sélectionnés</p>
      </header>

      {/* Grille de films (Critère 20 films par page) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {currentMovies.map((movie) => (
          <div 
            key={movie.id} 
            className="group cursor-pointer bg-[#0f0f23] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all shadow-lg"
            onClick={() => setSelectedMovie(movie)}
          >
            {/* Poster & Play Icon */}
            <div className="relative aspect-video">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-neon">
                   <span className="ml-1">▶</span>
                 </div>
              </div>
            </div>
            {/* Infos */}
            <div className="p-4">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">{movie.category}</span>
              <h3 className="text-lg font-semibold mt-1 truncate">{movie.title}</h3>
              <div className="flex gap-3 mt-3 text-xs text-gray-500">
                <span>{movie.duration}</span>
                <span>•</span>
                <span>Full HD</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination (Critère 20 par page) */}
      <div className="flex justify-center items-center mt-16 space-x-4">
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className="p-2 disabled:opacity-30 hover:text-purple-500 transition"
        >
          &larr; Précédent
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-8 h-8 rounded-full ${currentPage === i + 1 ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {i + 1}
          </button>
        ))}

        <button 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          className="p-2 disabled:opacity-30 hover:text-purple-500 transition"
        >
          Suivant &rarr;
        </button>
      </div>

      {/* Modal du Lecteur Vidéo (Critère : un lecteur vidéo par entrée) */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-[#0f0f23] w-full max-w-4xl rounded-2xl overflow-hidden relative shadow-2xl">
            <button 
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-10 text-white bg-black/50 w-8 h-8 rounded-full flex items-center justify-center hover:bg-purple-600 transition"
            >
              ✕
            </button>
            <video 
              src={selectedMovie.videoUrl} 
              controls 
              autoPlay 
              className="w-full aspect-video"
            />
            <div className="p-8">
              <h2 className="text-2xl font-bold">{selectedMovie.title}</h2>
              <p className="text-gray-400 mt-2">{selectedMovie.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}