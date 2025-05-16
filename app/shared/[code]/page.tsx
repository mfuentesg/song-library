import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Playlist } from "@/components/playlist"

export default async function SharedPlaylistPage({ params }: { params: { code: string } }) {
  const { code } = await params
  const supabase = await createClient()

  const { error, data: playlist } = await supabase
    .from("playlists")
    .select("*, songs:playlist_songs(position, ...songs(*))")
    .filter("share_code", "eq", code)
    .order("created_at", { ascending: true })
    .order("position", { ascending: true, referencedTable: "playlist_songs" })
    .single()

  if (error) {
    return notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>

      <Playlist playlist={playlist} className="bg-white p-0" />
    </div>
  )
}
