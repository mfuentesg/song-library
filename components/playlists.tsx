import { Playlist } from "@/components/playlist"
import { createClient } from "@/lib/supabase/server"
import { type PlaylistWithSongs } from "@/types/supabase"

export async function Playlists() {
  const supabase = await createClient()
  const { error, data: playlists } = await supabase
    .from("playlists")
    .select("*, songs(*)")
    .order("created_at", { ascending: true })

  if (error) {
    return <div className="text-center">Error loading playlists.</div>
  }

  if (!Array.isArray(playlists) || playlists.length === 0) {
    return <div className="text-center">No playlists found.</div>
  }

  return playlists.map((playlist: PlaylistWithSongs) => (
    <Playlist playlist={playlist} key={playlist.id} />
  ))
}
