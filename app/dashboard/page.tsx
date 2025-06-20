import { SongLibrary } from "@/components/song-library"
import { Header } from "@/components/header"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const [playlistsResponse, songsResponse] = await Promise.all([
    supabase
      .from("playlists")
      .select("*, songs:playlist_songs(position, ...songs(*))")
      .order("created_at", { ascending: false })
      .order("position", { ascending: true, referencedTable: "playlist_songs" }),
    supabase.from("songs").select("*").order("created_at", { ascending: false })
  ])

  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4">
        {(playlistsResponse.error || songsResponse.error) && <p>Error loading data</p>}
        {!playlistsResponse.error && !songsResponse.error && (
          <SongLibrary playlists={playlistsResponse.data} songs={songsResponse.data} />
        )}
      </main>
    </>
  )
}
