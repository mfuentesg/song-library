import React, { useState } from "react"
import { Music, Clock, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

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

  const toggleSongSelection = (songId: string) => {
    setSelectedSongs((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    )
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

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Song Library</h2>
        {selectedSongs.length > 0 && (
          <div className="flex items-center gap-2">
            <Input
              placeholder="New playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="max-w-[200px]"
            />
            <Button onClick={createPlaylist} size="sm">
              Create Playlist
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {filteredSongs.map((song) => (
          <Card
            key={song.id}
            className={`transition-colors ${selectedSongs.includes(song.id) ? "border-primary bg-primary/5" : ""}`}
          >
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className="h-5 w-5 text-muted-foreground" />
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
              <Checkbox
                onCheckedChange={() => {
                  toggleSongSelection(song.id)
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </React.Fragment>
  )
}
