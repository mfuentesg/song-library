import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Playlist } from "@/components/playlist"
import { Header } from "@/components/header"

export default async function SharedPlaylistPage({
  params
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const supabase = await createClient()

  const { error, data: playlist } = await supabase
    .from("playlists")
    .select("*, songs:playlist_songs(position, ...songs(*))")
    .filter("share_code", "eq", code)
    .order("position", { ascending: true, referencedTable: "playlist_songs" })
    .single()

  if (error) {
    return notFound()
  }

  return (
    <>
      <Header />

      <div className="container mx-auto py-8 px-4">
        <Playlist playlist={playlist} className="bg-white p-0" />
      </div>
    </>
  )
}
