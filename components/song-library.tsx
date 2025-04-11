"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Playlist from "@/components/playlist"
import SongList from "./song-list"

export default function SongLibrary() {
  const playlists = [
    {
      id: "playlist-1",
      name: "Acoustic Set",
      songs: ["1", "4", "5"],
      isPublic: true,
      allowGuestEditing: true,
      shareCode: "ACST1234"
    },
    {
      id: "playlist-2",
      name: "Rock Classics",
      songs: ["3", "6", "8"],
      isPublic: false,
      allowGuestEditing: false
    }
  ]
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSong, setNewSong] = useState({ name: "", artist: "", chord: "", bpm: "" })

  const handleAddSong = () => {
    if (!newSong.name || !newSong.artist) {
      toast.warning("Please provide at least a song name and artist.")
      return
    }

    // const bpmValue = newSong.bpm ? Number.parseInt(newSong.bpm) : 0
    // const newSongWithId = {
    //   ...newSong,
    //   id: `${songs.length + 1}`,
    //   bpm: bpmValue || 120 // Default to 120 if not provided or invalid
    // }

    // setSongs([...songs, newSongWithId])
    setNewSong({ name: "", artist: "", chord: "", bpm: "" })
    setIsAddDialogOpen(false)

    toast.success(`"${newSong.name}" has been added to your library.`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" /> Add Song
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Song</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="song-name">Song Name</Label>
                <Input
                  id="song-name"
                  value={newSong.name}
                  onChange={(e) => setNewSong({ ...newSong, name: e.target.value })}
                  placeholder="Enter song name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  value={newSong.artist}
                  onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                  placeholder="Enter artist name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="chord">Primary Chord</Label>
                  <Input
                    id="chord"
                    value={newSong.chord}
                    onChange={(e) => setNewSong({ ...newSong, chord: e.target.value })}
                    placeholder="E.g., Am, C, G"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bpm">BPM</Label>
                  <Input
                    id="bpm"
                    type="number"
                    value={newSong.bpm}
                    onChange={(e) => setNewSong({ ...newSong, bpm: e.target.value })}
                    placeholder="E.g., 120"
                  />
                </div>
              </div>
            </div>
            <Button onClick={handleAddSong}>Add Song</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all-songs">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-songs">All Songs</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value="all-songs" className="space-y-4">
          <SongList />
        </TabsContent>

        <TabsContent value="playlists" className="space-y-6">
          {playlists.map((playlist) => (
            <Playlist playlist={playlist} key={playlist.id} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
