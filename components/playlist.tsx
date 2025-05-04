"use client"

import { toast } from "sonner"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { GlobeIcon, LockIcon, Share2Icon, SettingsIcon, GripVerticalIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlaylistConfigDialog } from "@/components/playlist-config-dialog"
import { Song } from "@/components/song"
import { type PlaylistWithSongs } from "@/types/supabase"
import { createClient } from "@/lib/supabase/client"

function PlaylistBadges({ playlist }: { playlist: PlaylistWithSongs }) {
  return (
    <div className="flex gap-2 justify-center items-center">
      {playlist.is_public ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <GlobeIcon className="mr-1 h-3 w-3" /> Public
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <LockIcon className="mr-1 h-3 w-3" /> Private
        </Badge>
      )}

      {playlist.allow_guest_editing && (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Guest Editing
        </Badge>
      )}
    </div>
  )
}

export function Playlist({ playlist }: { playlist: PlaylistWithSongs }) {
  const sharePlaylist = () => {
    if (!playlist.is_public) {
      toast.info("Make the playlist public in settings before sharing.")
      return
    }

    const shareLink = `${window.location.origin}/shared-playlist/${playlist.share_code}`
    navigator.clipboard.writeText(shareLink)
    toast.info("The playlist share link has been copied to your clipboard.")
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

    const supabase = createClient()
    const sourceSong = playlist.songs[source.index]
    const destinationSong = playlist.songs[destination.index]

    const { error } = await supabase.from("playlist_songs").upsert([
      {
        playlist_id: playlist.id,
        song_id: sourceSong.id,
        position: destinationSong.position
      },
      {
        playlist_id: playlist.id,
        song_id: destinationSong.id,
        position: sourceSong.position
      }
    ])

    if (error) {
      toast.error("Error reordering playlist")
      return
    }
    toast.info("Playlist reordered")
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div key={playlist.id} className="space-y-2 p-4 rounded-md bg-muted">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <h3 className="text-lg font-semibold">{playlist.name}</h3>
            <PlaylistBadges playlist={playlist} />
          </div>
          <div className="flex gap-2 ">
            <PlaylistConfigDialog
              playlist={playlist}
              trigger={
                <Button variant="outline" size="sm">
                  <SettingsIcon className="h-4 w-4" />{" "}
                  <span className="sr-only sm:not-sr-only">Settings</span>
                </Button>
              }
            />

            <Button
              variant="outline"
              size="sm"
              onClick={sharePlaylist}
              disabled={!playlist.is_public}
            >
              <Share2Icon className="h-4 w-4" />{" "}
              <span className="sr-only sm:not-sr-only">Share</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {playlist.songs.length === 0 ? (
            <p className="text-sm text-muted-foreground italic p-4">
              This playlist is empty. Add songs from the library.
            </p>
          ) : (
            <div key={playlist.id} className="space-y-2">
              <Droppable droppableId={playlist.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-2 ${snapshot.isDraggingOver ? "bg-accent/30" : ""}`}
                  >
                    {playlist.songs.map((song, index) => {
                      return (
                        <Draggable key={song.id} draggableId={song.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`${snapshot.isDragging ? "opacity-70 shadow-lg" : ""}`}
                            >
                              <div
                                className="flex items-center gap-3 relative"
                                {...provided.dragHandleProps}
                              >
                                <Song
                                  song={song}
                                  className="w-full"
                                  {...provided.dragHandleProps}
                                />
                                <GripVerticalIcon className="text-muted-foreground cursor-move absolute right-5" />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )}
        </div>
      </div>
    </DragDropContext>
  )
}
