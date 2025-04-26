"use client"

import React, { useState } from "react"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Song } from "@/components/song"
import { cn } from "@/lib/utils"
import { type Tables } from "@/types/database"
import { PlaylistFormDialog } from "@/components/playlist-form"

export function SongList({ songs }: { songs: Tables<"songs">[] }) {
  const [selectedSongs, setSelectedSongs] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const toggleSongSelection = (songId: string) => () => {
    setSelectedSongs((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    )
  }

  const getSongsBySelection = () => {
    return songs.filter((song) => selectedSongs.includes(song.id))
  }

  const clearSelection = () => {
    setSelectedSongs([])
  }

  const filteredSongs = songs.filter(
    (song) =>
      song.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.chord.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <React.Fragment>
      <div className="relative w-full">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
        {filteredSongs.map((song) => {
          const isSelected = selectedSongs.includes(song.id)

          return (
            <div className="relative" key={song.id} onClick={toggleSongSelection(song.id)}>
              <Song
                song={song}
                className={cn({
                  "bg-purple-50": isSelected,
                  "border-2": isSelected,
                  "border-purple-200": isSelected
                })}
              />
              <Checkbox
                className="absolute right-4 top-4"
                checked={isSelected}
                onCheckedChange={toggleSongSelection(song.id)}
              />
            </div>
          )
        })}
      </div>

      {selectedSongs.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center bg-background border border-border rounded-full shadow-md py-2 px-4 gap-3">
            <Badge variant="secondary" className="rounded-full px-3 py-0.5">
              {selectedSongs.length}
            </Badge>

            <PlaylistFormDialog selectedSongs={getSongsBySelection()} onSubmit={clearSelection} />

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
