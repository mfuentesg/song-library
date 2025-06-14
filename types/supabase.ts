import { type Database } from "./database"

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"]

export type SongWithPosition = Tables<"songs"> & {
  position: number
}

export type PlaylistWithSongs = Tables<"playlists"> & {
  songs: SongWithPosition[]
}
