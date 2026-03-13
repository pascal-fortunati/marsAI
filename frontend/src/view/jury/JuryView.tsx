import { NavBar } from "../../components/ui/NavBar";
import { LoginView } from "./LoginView";
import { FilmSearchBar } from "./FilmSearchBar";
import { FilmDetail } from "./FilmDetail";
import { VideoPlayer } from "./VideoPlayer";
import { VotePanel } from "./VotePanel";

export function JuryView() {
  return (
    <div>
      <NavBar />
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Jury View (Layout)</h2>
        <p className="mb-6">Espace Jury Complet</p>
        <LoginView />
        <FilmSearchBar />
        <FilmDetail />
        <VideoPlayer />
        <VotePanel />
      </div>
    </div>
  );
}
