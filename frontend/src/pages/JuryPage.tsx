import { FilmDetail } from '../view/jury/FilmDetail'
import { FilmSearchBar } from '../view/jury/FilmSearchBar'
import { JuryView } from '../view/jury/JuryView'
import { Login } from '../view/jury/Login'
import { TopBar } from '../view/jury/TopBar'
import { VideoPlayer } from '../view/jury/VideoPlayer'
import { VotePanel } from '../view/jury/VotePanel'

// Page du jury
export function JuryPage() {
  return (
    <div>
      <TopBar />
      <Login />
      <FilmSearchBar />
      <JuryView />
      <FilmDetail />
      <VideoPlayer />
      <VotePanel />
    </div>
  )
}