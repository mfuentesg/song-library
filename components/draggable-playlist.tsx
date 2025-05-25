"use client"

import { useState, memo } from "react"
import { EllipsisIcon } from "lucide-react"
import { toast } from "sonner"
import { DragDropContext, Droppable, DropResult, Draggable } from "@hello-pangea/dnd"

import { createClient } from "@/lib/supabase/client"
import { Song } from "@/components/song"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { type SongWithPosition, type PlaylistWithSongs } from "@/types/supabase"

const DraggableSong = memo(
  ({
    index,
    song,
    onDelete
  }: {
    index: number
    song: SongWithPosition
    onDelete?: (songId: string) => Promise<void>
  }) => {
    const onDeleteHandler = () => {
      onDelete?.(song.id)
    }

    return (
      <Draggable draggableId={song.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`${snapshot.isDragging ? "opacity-70 shadow-lg" : ""}`}
          >
            <div className="flex items-center gap-3 relative" {...provided.dragHandleProps}>
              <Song song={song} className="w-full" />
              {onDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="absolute right-5 top-10">
                    <EllipsisIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onDeleteHandler}>
                      Remove from playlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        )}
      </Draggable>
    )
  }
)

DraggableSong.displayName = "DraggableSong"

export function DraggablePlaylist({
  playlist,
  allowDeletion = false
}: {
  playlist: PlaylistWithSongs
  allowDeletion?: boolean
}) {
  const supabase = createClient()

  const applyNewPlaylistOrder = async (newSongIds: string[]) => {
    const newPlaylistOrder = newSongIds.map((songId, index) => ({
      playlist_id: playlist.id,
      song_id: songId,
      position: index + 1
    }))

    return supabase.from("playlist_songs").upsert(newPlaylistOrder)
  }

  const handleDragEnd = async (result: DropResult<string>) => {
    const { destination, source } = result
    if (!destination) {
      return
    }
    const isSamePosition =
      destination.droppableId === source.droppableId && destination.index === source.index
    const isSamePlaylist = destination.droppableId === source.droppableId
    if (isSamePosition || !isSamePlaylist) {
      return
    }
    const newSongIds = Array.from(songIds)
    const [removed] = newSongIds.splice(source.index, 1)

    newSongIds.splice(destination.index, 0, removed)
    setSongIds(newSongIds)
    const { error } = await applyNewPlaylistOrder(newSongIds)
    if (error) {
      toast.error("Error reordering playlist")
      return
    }
    toast.info("Playlist reordered")
  }

  const deleteSong = (songIdToBeDeleted: string) => async () => {
    const supabase = createClient()
    const { error } = await supabase
      .from("playlist_songs")
      .delete()
      .eq("playlist_id", playlist.id)
      .eq("song_id", songIdToBeDeleted)

    if (error) {
      toast.error("Error deleting song from playlist")
      return
    }

    const newSongIds = songIds.filter((songId) => songId !== songIdToBeDeleted)
    setSongIds(newSongIds)
    await applyNewPlaylistOrder(newSongIds)
    toast.info("Song removed from playlist")
  }

  const sortedSongIds = playlist.songs
    .sort((a, b) => a.position - b.position)
    .map((song) => song.id)
  const [songIds, setSongIds] = useState(sortedSongIds)
  const songs = playlist.songs.reduce<{ [key: string]: SongWithPosition }>(
    (acc, song) => ({ ...acc, [song.id]: song }),
    {}
  )

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div key={playlist.id} className="space-y-2">
        <Droppable droppableId={playlist.id} isCombineEnabled>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-2 ${snapshot.isDraggingOver ? "bg-accent/30" : ""}`}
            >
              {songIds.map((songId, index) => {
                return (
                  <div className="relative" key={songId}>
                    <DraggableSong
                      song={songs[songId]}
                      index={index}
                      onDelete={allowDeletion ? deleteSong(songId) : undefined}
                    />
                  </div>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  )
}
