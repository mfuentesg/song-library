import { type Tables } from "@/types/database"

export type SongWithPosition = Tables<"songs"> & {
  position: number
}

export type PlaylistWithSongs = Tables<"playlists"> & {
  songs: SongWithPosition[]
}
