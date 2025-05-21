import { Playlist } from "@/components/playlist"
import { type PlaylistWithSongs } from "@/types/supabase"

export function Playlists({ playlists }: { playlists: PlaylistWithSongs[] }) {
  if (!Array.isArray(playlists) || playlists.length === 0) {
    return <div className="text-center">No playlists found.</div>
  }

  return playlists.map((playlist: PlaylistWithSongs) => (
    <Playlist playlist={playlist} key={playlist.id} />
  ))
}
