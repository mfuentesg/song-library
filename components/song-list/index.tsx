"use client"

import React, { useContext, useState } from "react"
import { SearchIcon, PlusIcon, Share2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ShareLibraryDialog } from "@/components/share-library"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Song } from "@/components/song"
import { cn } from "@/lib/utils"
import { Tables } from "@/types/supabase"
import { PlaylistFormDialog } from "@/components/playlist-form"
import { SongFormDialog } from "../song-form"
import { UserContext } from "@/context/auth"

export function SongList({ songs: initialSongs }: { songs: Tables<"songs">[] }) {
  const [songs, setSongs] = useState(initialSongs)
  const [selectedSongs, setSelectedSongs] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const user = useContext(UserContext)

  const toggleSongSelection = (songId: string, isSelected: boolean) => {
    setSelectedSongs((prev) =>
      !isSelected ? prev.filter((id) => id !== songId) : [...prev, songId]
    )
  }

  const handleDelete = async (songId: string) => {
    setSongs((prevSongs) => (prevSongs ?? []).filter((song) => song.id !== songId))
  }

  const handleSongEdition = (song: Tables<"songs">) => {
    setSongs((prevSongs) => prevSongs.map((s) => (s.id === song.id ? song : s)))
  }

  const handleSongCreation = (song: Tables<"songs">) => {
    setSongs((prevSongs) => [song].concat(prevSongs))
  }

  const getSongsBySelection = () => {
    return (songs ?? []).filter((song) => selectedSongs.includes(song.id))
  }

  const clearSelection = () => {
    setSelectedSongs([])
  }

  const filteredSongs = (songs ?? []).filter(
    (song) =>
      song.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <React.Fragment>
      <div className="flex gap-2 justify-end">
        <ShareLibraryDialog
          trigger={
            <Button variant="outline" size="sm">
              <Share2Icon className="mr-2 h-4 w-4" />
              Share library
            </Button>
          }
        />
        <SongFormDialog
          title="Add New Song"
          trigger={
            <Button size="sm">
              <PlusIcon className="mr-2 h-4 w-4" /> Add Song
            </Button>
          }
          onSubmit={handleSongCreation}
        />
      </div>

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
            <div className="relative" key={song.id}>
              <Song
                selectable
                editable={song.user_id === user?.id}
                onSelect={toggleSongSelection}
                onEdit={handleSongEdition}
                onDelete={handleDelete}
                song={song}
                className={cn({
                  "bg-purple-50": isSelected,
                  "border-2": isSelected,
                  "border-purple-200": isSelected
                })}
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
