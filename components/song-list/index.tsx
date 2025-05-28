"use client"

import React, { useState, useEffect } from "react"
import { SearchIcon, Trash2Icon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Song } from "@/components/song"
import { cn } from "@/lib/utils"
import { type Tables } from "@/types/database"
import { PlaylistFormDialog } from "@/components/playlist-form"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const SongDeleteAlert = ({
  song,
  open,
  onOpenChange,
  onConfirm
}: {
  song: Tables<"songs">
  onConfirm?: (id: string) => Promise<void>
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const onConfirmHandler = () => onConfirm?.(song.id)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete &quot;
            {song?.title}
            &quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmHandler}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function SongList({ songs: initialSongs }: { songs: Tables<"songs">[] }) {
  const [songs, setSongs] = useState(initialSongs)
  const [selectedSongs, setSelectedSongs] = useState<string[]>([])
  const [songToDelete, setSongToDelete] = useState<Tables<"songs">>()
  const [alertVisible, setAlertVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel("song:updates")
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "songs" },
        ({ old: deletedSong }) => {
          setSongs((prevSongs) => (prevSongs ?? []).filter((song) => song.id !== deletedSong.id))
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "songs" },
        ({ new: newSong }: { new: Tables<"songs"> }) => {
          setSongs((prevSongs) => (prevSongs ?? []).concat(newSong))
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [setSongs, supabase])

  const toggleSongSelection = (songId: string) => () => {
    setSelectedSongs((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    )
  }

  const handleDelete = async (songId: string) => {
    const { error } = await supabase.from("songs").delete().eq("id", songId)

    setAlertVisible(false)
    setSongToDelete(undefined)

    if (error) {
      toast.error("Failed to delete song")
      return
    }

    toast.success("Song deleted successfully")
  }

  const getSongsBySelection = () => {
    return (songs ?? []).filter((song) => selectedSongs.includes(song.id))
  }

  const clearSelection = () => {
    setSelectedSongs([])
  }

  const toggleDeletionAlert = (song: Tables<"songs">) => () => {
    setSongToDelete(song)
    setAlertVisible(true)
  }

  const filteredSongs = (songs ?? []).filter(
    (song) =>
      song.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
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

      <SongDeleteAlert
        song={songToDelete!}
        open={alertVisible}
        onOpenChange={setAlertVisible}
        onConfirm={handleDelete}
      />

      <div className="space-y-3">
        {filteredSongs.map((song) => {
          const isSelected = selectedSongs.includes(song.id)

          return (
            <div className="relative" key={song.id}>
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

              <div className="absolute right-2 bottom-2">
                <Button variant="ghost" onClick={toggleDeletionAlert(song)}>
                  <Trash2Icon />
                </Button>
              </div>
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
