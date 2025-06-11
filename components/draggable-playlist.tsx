"use client"

import { memo } from "react"
import { GripVerticalIcon } from "lucide-react"
import { DragDropContext, Droppable, DropResult, Draggable } from "@hello-pangea/dnd"

import { Song } from "@/components/song"
import { type SongWithPosition, type PlaylistWithSongs } from "@/types/supabase"

const DraggableSong = memo(({ index, song }: { index: number; song: SongWithPosition }) => {
  return (
    <Draggable draggableId={song.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${snapshot.isDragging ? "opacity-70 shadow-lg" : ""}`}
        >
          <div className="flex items-center gap-3 relative" {...provided.dragHandleProps}>
            <Song song={song} className="w-full" editable={false} />
            <GripVerticalIcon className="absolute top-10 right-5 text-muted-foreground" />
          </div>
        </div>
      )}
    </Draggable>
  )
})

DraggableSong.displayName = "DraggableSong"

export function DraggablePlaylist({
  playlist,
  songs,
  onPlaylistSort
}: {
  playlist: PlaylistWithSongs
  songs: SongWithPosition[]
  onPlaylistSort: (s: number, d: number) => Promise<void>
}) {
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
                    <DraggableSong song={song} index={index} />
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
