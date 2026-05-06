// Type représentant les actions de vote possibles par les jurys
export type VoteAction = 'validate' | 'refuse' | 'review' | null

// Type représentant les films soumis par les utilisateurs aux élections
export type JuryFilm = {
  id: string
  title: string
  country: string
  duration: string
  synopsis: string
  aiTools: string[]
  youtubeId: string | null
  vote: VoteAction
  comment: string
  status: 'pending' | 'voted'
}