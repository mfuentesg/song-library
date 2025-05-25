"use client"

import { memo, useContext } from "react"
import { EllipsisIcon } from "lucide-react"
import { DragDropContext, Droppable, DropResult, Draggable } from "@hello-pangea/dnd"

import { Song } from "@/components/song"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { type SongWithPosition, type PlaylistWithSongs } from "@/types/supabase"
import { UserContext } from "@/context/auth"

const DraggableSong = memo(
  ({
    index,
    song,
    canBeDeleted = false,
    onDelete
  }: {
    index: number
    song: SongWithPosition
    canBeDeleted?: boolean
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
              {canBeDeleted && (
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
  songs,
  onPlaylistSort,
  onDeleteSong
}: {
  playlist: PlaylistWithSongs
  songs: SongWithPosition[]
  onPlaylistSort: (s: number, d: number) => Promise<void>
  onDeleteSong: (songId: string) => Promise<void>
}) {
  const user = useContext(UserContext)
  const isSameOwner = playlist.user_id === user?.id

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

    onPlaylistSort(source.index, destination.index)
  }

  const onDeleteSongHandler = (songId: string) => () => onDeleteSong(songId)

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
              {songs.map((song, index) => {
                return (
                  <div className="relative" key={song.id}>
                    <DraggableSong
                      canBeDeleted={isSameOwner}
                      song={song}
                      index={index}
                      onDelete={onDeleteSongHandler(song.id)}
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
