"use client"

import { useEffect, useState } from "react"
import { Playlist } from "@/components/playlist"
import { type PlaylistWithSongs } from "@/types/supabase"
import { createClient } from "@/lib/supabase/client"

export function Playlists({ playlists: originalPlaylists }: { playlists: PlaylistWithSongs[] }) {
  const supabase = createClient()
  const [playlists, setPlaylists] = useState<PlaylistWithSongs[]>(originalPlaylists)

  useEffect(() => {
    const channel = supabase
      .channel("playlists")
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "playlists" },
        ({ old: deletedPlaylist }) => {
          setPlaylists((prevPlaylists) =>
            prevPlaylists.filter((playlist) => playlist.id !== deletedPlaylist.id)
          )
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  if (!Array.isArray(playlists) || playlists.length === 0) {
    return <div className="text-center">No playlists found.</div>
  }

  return playlists.map((playlist: PlaylistWithSongs) => (
    <Playlist playlist={playlist} key={playlist.id} />
  ))
}
