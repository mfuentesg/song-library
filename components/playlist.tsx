import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlaylistConfigDialog } from "@/components/playlist-config-dialog"
import { Globe, Lock, Share2, Settings, X, GripVertical, Clock } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type playlist = {
  id: string
  name: string
  songs: string[]
  isPublic?: boolean
  allowGuestEditing?: boolean
  shareCode?: string
}

const initialSongs = [
  { id: "1", name: "Wonderwall", artist: "Oasis", chord: "Am", bpm: 87 },
  { id: "2", name: "Hallelujah", artist: "Leonard Cohen", chord: "C", bpm: 72 },
  { id: "3", name: "Hotel California", artist: "Eagles", chord: "Bm", bpm: 75 },
  { id: "4", name: "Imagine", artist: "John Lennon", chord: "C", bpm: 75 },
  { id: "5", name: "Wish You Were Here", artist: "Pink Floyd", chord: "G", bpm: 66 },
  { id: "6", name: "Stairway to Heaven", artist: "Led Zeppelin", chord: "Am", bpm: 82 },
  { id: "7", name: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", chord: "D", bpm: 98 },
  { id: "8", name: "Smells Like Teen Spirit", artist: "Nirvana", chord: "F", bpm: 116 }
]

export default function Playlist({ playlist }: { playlist: playlist }) {
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  const openPlaylistConfig = () => {
    setIsConfigOpen(true)
  }

  const sharePlaylist = () => {
    if (!playlist.isPublic) {
      toast.info("Make the playlist public in settings before sharing.")
      return
    }

    const shareLink = `${window.location.origin}/shared-playlist/${playlist.shareCode}`
    navigator.clipboard.writeText(shareLink)

    toast.info("The playlist share link has been copied to your clipboard.")
  }

  const removeSongFromPlaylist = (songId: string) => {
    toast.info(`should remove "${songId}" from playlist`)
  }

  return (
    <div key={playlist.id} className="space-y-2 p-4 rounded-md bg-muted">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <h3 className="text-lg font-semibold">{playlist.name}</h3>
          <div className="flex gap-2 justify-center items-center">
            {playlist.isPublic ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Globe className="mr-1 h-3 w-3" /> Public
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                <Lock className="mr-1 h-3 w-3" /> Private
              </Badge>
            )}
            {playlist.allowGuestEditing && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Guest Editing
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2 ">
          <Button variant="outline" size="sm" onClick={openPlaylistConfig}>
            <Settings className="h-4 w-4" />{" "}
            <span className="sr-only sm:not-sr-only">Settings</span>
          </Button>
          <Button variant="outline" size="sm" onClick={sharePlaylist}>
            <Share2 className="h-4 w-4" /> <span className="sr-only sm:not-sr-only">Share</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {playlist.songs.length === 0 ? (
          <p className="text-sm text-muted-foreground italic p-4">
            This playlist is empty. Add songs from the library.
          </p>
        ) : (
          playlist.songs.map((songId) => {
            const song = initialSongs.find((s) => s.id === songId)
            if (!song) return null

            return (
              <Card key={`${playlist.id}-${songId}`}>
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <div>
                      <h3 className="font-medium">{song.name}</h3>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="ml-2">
                        {song.chord}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200 flex items-center"
                      >
                        <Clock className="mr-1 h-3 w-3" /> {song.bpm} BPM
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSongFromPlaylist(songId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
      <PlaylistConfigDialog
        playlist={playlist}
        open={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        onSave={() => toast.info("to save playlist settings")}
      />
    </div>
  )
}
