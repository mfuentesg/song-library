import React, { useState } from "react"
import { Search, ListPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Song } from "@/components/song"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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

export default function SongList() {
  const [selectedSongs, setSelectedSongs] = useState<string[]>([])
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false)

  const toggleSongSelection = (songId: string) => {
    setSelectedSongs((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    )
  }

  const clearSelection = () => {
    setSelectedSongs([])
  }

  const createPlaylist = () => {
    if (newPlaylistName.trim() === "") return
    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name: newPlaylistName,
      songs: selectedSongs,
      isPublic: false,
      allowGuestEditing: false,
      shareCode: Math.random().toString(36).substring(2, 10).toUpperCase()
    }

    console.log("New Playlist:", newPlaylist)
    //     setPlaylists([...playlists, newPlaylist])
    setNewPlaylistName("")
    setSelectedSongs([])
    toast.success(`Your playlist "${newPlaylistName}" has been created successfully.`)
  }

  const filteredSongs = initialSongs.filter(
    (song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.chord.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <React.Fragment>
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search songs, artists ..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2 className="text-xl font-semibold mt-6">Song Library</h2>

      <div className="space-y-3">
        {filteredSongs.map((song) => (
          <div className="relative" key={song.id}>
            <Song
              song={song}
              className={cn({
                "bg-purple-50": selectedSongs.includes(song.id),
                "border-2": selectedSongs.includes(song.id),
                "border-purple-200": selectedSongs.includes(song.id)
              })}
            />
            <Checkbox
              className="absolute right-4 top-4"
              checked={selectedSongs.includes(song.id)}
              onCheckedChange={() => {
                toggleSongSelection(song.id)
              }}
            />
          </div>
        ))}
      </div>

      {/* {selectedSongs.length > 0 && (
        <div className="fixed bottom-6 right-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 z-10 animate-in fade-in slide-in-from-bottom-5 max-w-sm w-[90%] border border-border">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-purple-500 text-white border-purple-600">
                  {selectedSongs.length} song{selectedSongs.length !== 1 ? "s" : ""}
                </Badge>
                <span className="text-sm text-muted-foreground">selected</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSelection}
                className="h-7 w-7 rounded-full hover:bg-muted"
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Clear selection</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="New playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="h-9 text-md"
              />
              <Button
                onClick={createPlaylist}
                className="whitespace-nowrap"
                disabled={!newPlaylistName.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )} */}
      {selectedSongs.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center bg-background border border-border rounded-full shadow-md py-2 px-4 gap-3">
            <Badge variant="secondary" className="rounded-full px-3 py-0.5">
              {selectedSongs.length}
            </Badge>

            <Dialog open={isCreatePlaylistOpen} onOpenChange={setIsCreatePlaylistOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <ListPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Playlist</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Playlist</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="playlist-name">Playlist Name</Label>
                    <Input
                      id="playlist-name"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      placeholder="Enter playlist name"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Creating a playlist with {selectedSongs.length} selected song
                      {selectedSongs.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreatePlaylistOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createPlaylist} disabled={!newPlaylistName.trim()}>
                    Create Playlist
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="h-5 w-px bg-border mx-1"></div>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}
