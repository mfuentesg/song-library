import { type Tables } from "@/types/database"

export type PlaylistWithSongs = Tables<"playlists"> & {
  songs: (Tables<"songs"> & { position: number })[]
}
