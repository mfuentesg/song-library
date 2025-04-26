"use client"

import { toast } from "sonner"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GlobeIcon, LockIcon, Share2Icon, SettingsIcon, GripVerticalIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlaylistConfigDialog } from "@/components/playlist-config-dialog"
import { Song } from "@/components/song"
import { type PlaylistWithSongs } from "@/types/supabase"

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (result: any) => {
    const { destination, source } = result

    // If dropped outside a droppable area
    if (!destination) {
      return
    }

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    // Handle reordering within a playlist
    if (destination.droppableId === source.droppableId) {
      // const playlistId = destination.droppableId
      const newSongs = Array.from(playlist.songs)
      const [removed] = newSongs.splice(source.index, 1)
      newSongs.splice(destination.index, 0, removed)

      // setPlaylists(playlists.map((p) => (p.id === playlistId ? { ...p, songs: newSongs } : p)))
      toast.info("Playlist reordered")
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div key={playlist.id} className="space-y-2 p-4 rounded-md bg-muted">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <h3 className="text-lg font-semibold">{playlist.name}</h3>
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

            <Button variant="outline" size="sm" onClick={sharePlaylist}>
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
                    {playlist.songs.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic p-4">
                        This playlist is empty. Add songs from the library.
                      </p>
                    ) : (
                      playlist.songs.map((song, index) => {
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
                      })
                    )}
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
