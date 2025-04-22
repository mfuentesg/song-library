"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function SongForm() {
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
    toast.success(`"${newSong.name}" has been added to your library.`)
  }

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}
