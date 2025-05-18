"use client"

import { Playlist } from "@/components/playlist"
import { type PlaylistWithSongs } from "@/types/supabase"
import { fetchPlaylists } from "./actions"
import { useSupabaseFetch } from "@/hooks/supabase"

export function Playlists() {
  const { data: playlists, error, isLoading } = useSupabaseFetch(fetchPlaylists)

  if (isLoading) {
    return <div className="text-center">loading playlists ...</div>
  }

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
