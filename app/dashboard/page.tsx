import { SongLibrary } from "@/components/song-library"
import { Header } from "@/components/header"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const [playlistsResponse, songsResponse] = await Promise.all([
    supabase
      .from("playlists")
      .select("*, songs:playlist_songs(position, ...songs(*))")
      .order("created_at", { ascending: true })
      .order("position", { ascending: true, referencedTable: "playlist_songs" }),
    supabase.from("songs").select("*")
  ])

  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Song Library</h1>
          <p className="text-muted-foreground">Organize and share your music collection</p>
        </div>
        {(playlistsResponse.error || songsResponse.error) && <p>Error loading data</p>}
        {!playlistsResponse.error && !songsResponse.error && (
          <SongLibrary playlists={playlistsResponse.data} songs={songsResponse.data} />
        )}
      </main>
    </>
  )
}
