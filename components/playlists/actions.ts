"use server"

import { createClient } from "@/lib/supabase/server"

export const fetchPlaylists = async () => {
  const supabase = await createClient()

  return supabase
    .from("playlists")
    .select("*, songs:playlist_songs(position, ...songs(*))")
    .order("created_at", { ascending: true })
    .order("position", { ascending: true, referencedTable: "playlist_songs" })
}
