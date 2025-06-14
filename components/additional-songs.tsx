import React, { useEffect, useState } from "react"
import { SearchIcon, PlusCircleIcon, MinusCircleIcon } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { type Tables } from "@/types/database"
import { type PlaylistWithSongs } from "@/types/supabase"

export function AdditionalSongs({
  trigger,
  playlist
}: {
  playlist: PlaylistWithSongs
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const supabase = createClient()
  const [songIds, setSongIds] = useState(playlist.songs.map((song) => song.id))
  const [songs, setSongs] = useState<Tables<"songs">[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSongs = (songs ?? []).filter(
    (song) =>
      song.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const fetchSongs = async () => {
      const { error, data: songs } = await supabase
        .from("songs")
        .select("*")
        .order("title", { ascending: true })

      if (error) {
        console.error("Error fetching songs:", error)
        return
      }

      return setSongs(songs)
    }

    if (open) {
      fetchSongs()
    }
  }, [open, supabase])

  const addSongToPlaylist = (songId: string) => async () => {
    setSongIds((prevSongIds) => prevSongIds.concat(songId))
    const { error } = await supabase.from("playlist_songs").insert({
      playlist_id: playlist.id,
      song_id: songId,
      position: songIds.length + 1 // Append to the end of the playlist
    })
    if (error) {
      toast.error("Error adding song to playlist")
      return
    }
    toast.success("Song added to playlist")
  }

  const deleteSongFromPlaylist = (songId: string) => async () => {
    // setSongIds((prevSongIds) => prevSongIds.filter((id) => id !== songId))
    // const { error } = await supabase.from("playlist_songs").delete().match({
    //   playlist_id: playlist.id,
    //   song_id: songId
    // })
    // if (error) {
    //   toast.error("Error deleting song from playlist")
    //   return
    // }
    // toast.success("Song deleted from playlist")

    setSongIds((prevSongIds) => prevSongIds.filter((id) => id !== songId))

    // Get remaining songs and update their positions
    const remainingSongIds = songIds.filter((id) => id !== songId)
    const updatedPositions = remainingSongIds.map((id, index) => ({
      playlist_id: playlist.id,
      song_id: id,
      position: index + 1
    }))

    const { error } = await supabase.rpc("update_playlist_songs", {
      p_playlist_id: playlist.id,
      p_song_id: songId,
      p_positions: updatedPositions
    })

    if (error) {
      // Rollback optimistic update on error
      setSongIds((prevSongIds) => [...prevSongIds, songId])
      toast.error("Error updating playlist")
      return
    }

    toast.success("Song removed from playlist")
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="min-h-[90%]">
        <DrawerHeader>
          <DrawerTitle className="text-center">Add to &quot;{playlist.name}&quot;</DrawerTitle>
          <div className="relative w-full">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search songs, artists ..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </DrawerHeader>
        <div className="space-y-2 p-4 overflow-auto">
          {filteredSongs.map((song) => {
            const isInPlaylist = songIds.includes(song.id)

            return (
              <div
                key={`suggested-song-${song.id}`}
                className="border-1 py-2 px-4 rounded-md shadow-sm flex justify-between items-center"
              >
                <div className="flex flex-col gap-1">
                  <p>{song.title}</p>
                  <p className="text-muted-foreground text-xs">{song.artist}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={
                    isInPlaylist ? deleteSongFromPlaylist(song.id) : addSongToPlaylist(song.id)
                  }
                >
                  {isInPlaylist ? <MinusCircleIcon /> : <PlusCircleIcon />}
                </Button>
              </div>
            )
          })}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
