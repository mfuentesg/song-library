"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GripVerticalIcon, ArrowLeft, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const sampleSongs = [
  { id: "1", name: "Wonderwall", artist: "Oasis", chord: "Am", bpm: 87 },
  { id: "2", name: "Hallelujah", artist: "Leonard Cohen", chord: "C", bpm: 72 },
  { id: "3", name: "Hotel California", artist: "Eagles", chord: "Bm", bpm: 75 },
  { id: "4", name: "Imagine", artist: "John Lennon", chord: "C", bpm: 75 },
  { id: "5", name: "Wish You Were Here", artist: "Pink Floyd", chord: "G", bpm: 66 },
  { id: "6", name: "Stairway to Heaven", artist: "Led Zeppelin", chord: "Am", bpm: 82 },
  { id: "7", name: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", chord: "D", bpm: 98 },
  { id: "8", name: "Smells Like Teen Spirit", artist: "Nirvana", chord: "F", bpm: 116 }
]

const samplePlaylists = [
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
    allowGuestEditing: false,
    shareCode: "ROCK5678"
  }
]

export default function SharedPlaylistPage() {
  const params = useParams()
  const shareCode = params.code as string
  const [playlist, setPlaylist] = useState<(typeof samplePlaylists)[0] | null>(null)
  const [songs, setSongs] = useState<typeof sampleSongs>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const playlistRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPlaylist = () => {
      setLoading(true)

      setTimeout(() => {
        const foundPlaylist = samplePlaylists.find((p) => p.shareCode === shareCode)

        if (!foundPlaylist || !foundPlaylist.isPublic) {
          setError("Playlist not found or is private")
          setLoading(false)
          return
        }

        setPlaylist(foundPlaylist)

        const playlistSongs = foundPlaylist.songs
          .map((songId) => sampleSongs.find((s) => s.id === songId))
          .filter((song) => song !== undefined) as typeof sampleSongs

        setSongs(playlistSongs)
        setLoading(false)
      }, 500)
    }

    fetchPlaylist()
  }, [shareCode])

  // Setup draggable for a playlist item
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading playlist...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the playlist.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Playlist not found</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button asChild className="mt-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{playlist?.name}</h1>
            <p className="text-muted-foreground">Shared Playlist</p>
          </div>

          {playlist?.allowGuestEditing && (
            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
              You can reorder songs
            </Badge>
          )}
        </div>
      </div>

      <div ref={playlistRef} className="space-y-2">
        {songs.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">This playlist is empty.</p>
        ) : (
          songs.map((song) => (
            <Card key={song.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {playlist?.allowGuestEditing && (
                    <GripVerticalIcon className="h-5 w-5 text-muted-foreground cursor-move" />
                  )}
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
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
