"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Music,
  Search,
  Share2,
  Plus,
  X,
  GripVertical,
  Settings,
  Globe,
  Lock,
  Clock
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  draggable,
  dropTargetForElements,
  monitorForElements
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { PlaylistConfigDialog } from "./playlist-config-dialog"

// Sample initial songs data with BPM
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

export default function SongLibrary() {
  const [songs, setSongs] = useState(initialSongs)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSongs, setSelectedSongs] = useState<string[]>([])
  const [playlists, setPlaylists] = useState<
    {
      id: string
      name: string
      songs: string[]
      isPublic?: boolean
      allowGuestEditing?: boolean
      shareCode?: string
    }[]
  >([
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
  ])
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSong, setNewSong] = useState({ name: "", artist: "", chord: "", bpm: "" })
  const playlistRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [configPlaylist, setConfigPlaylist] = useState<(typeof playlists)[0] | null>(null)
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  const filteredSongs = songs.filter(
    (song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.chord.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleSongSelection = (songId: string) => {
    setSelectedSongs((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    )
  }

  const createPlaylist = () => {
    if (newPlaylistName.trim() === "") return
    if (selectedSongs.length === 0) {
      toast("No songs selected", {
        description: "Please select at least one song for your playlist."
      })
      return
    }

    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name: newPlaylistName,
      songs: selectedSongs,
      isPublic: false,
      allowGuestEditing: false,
      shareCode: Math.random().toString(36).substring(2, 10).toUpperCase()
    }

    setPlaylists([...playlists, newPlaylist])
    setNewPlaylistName("")
    setSelectedSongs([])

    toast("Playlist created", {
      description: `Your playlist "${newPlaylistName}" has been created successfully.`
    })
  }

  // Remove song from playlist
  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              songs: playlist.songs.filter((id) => id !== songId)
            }
          : playlist
      )
    )
  }

  // Share playlist
  const sharePlaylist = (playlistId: string) => {
    const playlist = playlists.find((p) => p.id === playlistId)
    if (!playlist) return

    if (!playlist.isPublic) {
      toast("Playlist is private", {
        description: "Make the playlist public in settings before sharing."
      })
      return
    }

    const shareLink = `${window.location.origin}/shared-playlist/${playlist.shareCode}`
    navigator.clipboard.writeText(shareLink)

    toast("Share link copied", {
      description: "The playlist share link has been copied to your clipboard."
    })
  }

  // Add a new song
  const handleAddSong = () => {
    if (!newSong.name || !newSong.artist) {
      toast("Missing information", {
        description: "Please provide at least a song name and artist."
      })
      return
    }

    const bpmValue = newSong.bpm ? Number.parseInt(newSong.bpm) : 0

    const newSongWithId = {
      ...newSong,
      id: `${songs.length + 1}`,
      bpm: bpmValue || 120 // Default to 120 if not provided or invalid
    }

    setSongs([...songs, newSongWithId])
    setNewSong({ name: "", artist: "", chord: "", bpm: "" })
    setIsAddDialogOpen(false)

    toast("Song added", {
      description: `"${newSong.name}" has been added to your library.`
    })
  }

  // Open playlist configuration
  const openPlaylistConfig = (playlist: (typeof playlists)[0]) => {
    setConfigPlaylist(playlist)
    setIsConfigOpen(true)
  }

  // Save playlist configuration
  const savePlaylistConfig = (updatedPlaylist: (typeof playlists)[0]) => {
    setPlaylists(playlists.map((p) => (p.id === updatedPlaylist.id ? updatedPlaylist : p)))
  }

  // Setup drag and drop for a playlist
  const setupPlaylistDragAndDrop = (playlistId: string) => {
    const playlistElement = playlistRefs.current[playlistId]
    if (!playlistElement) return

    const dropTargetCleanup = dropTargetForElements({
      element: playlistElement,
      getData: () => ({ type: `playlist-${playlistId}` }),
      onDragStart: () => {
        playlistElement.classList.add("bg-accent/50", "p-2", "rounded-md")
      },
      onDragEnter: () => {
        playlistElement.classList.add("border-primary", "border-2")
      },
      onDragLeave: () => {
        playlistElement.classList.remove("border-primary", "border-2")
      },
      onDrop: () => {
        playlistElement.classList.remove(
          "bg-accent/50",
          "p-2",
          "rounded-md",
          "border-primary",
          "border-2"
        )
      }
    })

    // Setup monitor for reordering within playlist
    const monitorCleanup = monitorForElements({
      onDrop({ source, location }) {
        if (source.data.type === "playlist-item" && location.current.dropTargets.length > 0) {
          const targetId = location.current.dropTargets[0].data.type

          if (targetId === `playlist-${playlistId}`) {
            const sourcePlaylistId = source.data.playlistId as string
            const sourceIndex = Number.parseInt(source.data.index as string)
            const targetIndex = location.current.dropTargets[0].data.index
              ? Number.parseInt(location.current.dropTargets[0].data.index as string)
              : playlists.find((p) => p.id === playlistId)?.songs.length || 0

            if (sourcePlaylistId === playlistId) {
              // Reorder within the same playlist
              const playlist = playlists.find((p) => p.id === playlistId)
              if (playlist) {
                const newSongs = [...playlist.songs]
                const [removed] = newSongs.splice(sourceIndex, 1)
                newSongs.splice(targetIndex, 0, removed)

                setPlaylists(
                  playlists.map((p) => (p.id === playlistId ? { ...p, songs: newSongs } : p))
                )
              }
            }
          }
        }
      }
    })

    const cleanup = () => {
      dropTargetCleanup()
      monitorCleanup()
    }

    return cleanup
  }

  // Setup draggable for a playlist item
  const setupPlaylistItemDraggable = (
    element: HTMLElement,
    playlistId: string,
    songId: string,
    index: number
  ) => {
    return draggable({
      element,
      getInitialData: () => ({
        type: "playlist-item",
        playlistId,
        songId,
        index: index.toString()
      }),
      onDragStart: () => {
        element.classList.add("opacity-50")
      },
      onDrop: () => {
        element.classList.remove("opacity-50")
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search songs, artists or chords..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
            <div className="grid gap-4 py-4">
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
                <CardContent className="p-4 flex items-center justify-between">
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
                  <Button variant="ghost" size="sm" onClick={() => toggleSongSelection(song.id)}>
                    {selectedSongs.includes(song.id) ? "Deselect" : "Select"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="playlists" className="space-y-6">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  <h3 className="text-lg font-semibold">{playlist.name}</h3>
                  <div className="flex gap-2 justify-center items-center">
                    {playlist.isPublic ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        <Globe className="mr-1 h-3 w-3" /> Public
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                      >
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
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openPlaylistConfig(playlist)}>
                    <Settings className="h-4 w-4" />{" "}
                    <span className="sr-only sm:not-sr-only">Settings</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => sharePlaylist(playlist.id)}>
                    <Share2 className="h-4 w-4" />{" "}
                    <span className="sr-only sm:not-sr-only">Share</span>
                  </Button>
                </div>
              </div>

              <div
                ref={(element) => {
                  playlistRefs.current[playlist.id] = element
                  if (element) {
                    const cleanup = setupPlaylistDragAndDrop(playlist.id)
                    return () => cleanup?.()
                  }
                }}
                className="space-y-2 pt-2"
              >
                {playlist.songs.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic p-4">
                    This playlist is empty. Add songs from the library.
                  </p>
                ) : (
                  playlist.songs.map((songId, index) => {
                    const song = songs.find((s) => s.id === songId)
                    if (!song) return null

                    return (
                      <Card
                        key={`${playlist.id}-${songId}`}
                        ref={(element) => {
                          if (element) {
                            setupPlaylistItemDraggable(element, playlist.id, songId, index)
                          }
                        }}
                      >
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
                            onClick={() => removeSongFromPlaylist(playlist.id, songId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {configPlaylist && (
        <PlaylistConfigDialog
          playlist={configPlaylist}
          open={isConfigOpen}
          onOpenChange={setIsConfigOpen}
          onSave={savePlaylistConfig}
        />
      )}
    </div>
  )
}
