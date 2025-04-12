"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GripVerticalIcon, ArrowLeftIcon, ClockIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const sampleSongs = [
  {
    name: "A Ti Me Rindo",
    bpm: 154,
    chord: "F",
    id: "807d0283-7942-4528-8bed-dbe4b98e707f",
    artist: "Hillsong en Español"
  },
  {
    name: "Abre Mis Ojos",
    bpm: 128,
    chord: "E",
    id: "478c659f-b617-4425-9b95-4e69264f91d7",
    artist: "Danilo Montero"
  },
  {
    name: "Al Que Es Digno",
    bpm: 110,
    chord: "D",
    id: "55548072-0df5-451d-86ef-f6ddd796d9d6",
    artist: "Marcos Witt"
  },
  {
    name: "Amor Sin Condición",
    bpm: 167,
    chord: "F",
    id: "44e01f1e-dc36-4b6c-a8bb-f6750699824a",
    artist: "Twice Musica Cristiana"
  },
  {
    name: "Bueno Es Alabar",
    bpm: 119,
    chord: "G",
    id: "3df78ba6-2afe-4064-86d9-cd0c13f2e202",
    artist: "Danilo Montero"
  },
  {
    name: "Con humildad",
    bpm: 117,
    chord: "E",
    id: "d2df3f40-8e27-4e30-9e6d-099b7c7ad816",
    artist: "Coalo Zamorano"
  },
  {
    name: "Con Mis Manos Levantadas",
    bpm: 128,
    chord: "A",
    id: "fb174d44-24b0-4d04-9fdc-a444b9dbf207",
    artist: "Danilo Montero"
  },
  {
    name: "Creo En Ti",
    bpm: 140,
    chord: "D",
    id: "d712d427-4110-4d86-a2a7-29c177971ec2",
    artist: "Julio Melgar"
  },
  {
    name: "Cuan Grande Es Dios",
    bpm: 144,
    chord: "C",
    id: "089f2188-8d9f-4120-9747-596e732652b6",
    artist: "En Espiritu Y En Verdad"
  },
  {
    name: "De Gloria En Gloria",
    bpm: 128,
    chord: "G",
    id: "288a1e8d-8d81-46e0-821c-0e7a13654519",
    artist: "Marco Barrientos"
  },
  {
    name: "Derramo El Perfume (part. Averly Morillo)",
    bpm: 130,
    chord: "Bb",
    id: "617a4104-db57-4db9-8533-bc6d256ddc8f",
    artist: "Montesanto"
  },
  {
    name: "Digno (part. Yvonne Muñoz y Marco Barrientos)",
    bpm: 130,
    chord: "A",
    id: "c2fa5cb4-b5ee-4b7b-b6d5-3324c528d953",
    artist: "Marcos Brunet"
  },
  {
    name: "Dios Poderoso",
    bpm: 116,
    chord: "A#",
    id: "6cccc782-1244-4667-b8d3-dfef0556caa1",
    artist: "La Ibi"
  },
  {
    name: "El Dios Que Adoramos",
    bpm: 110,
    chord: "F#",
    id: "cb5be06d-5652-4996-a139-14e87ef66b26",
    artist: "Sovereign Grace Music"
  },
  {
    name: "Él Es El Rey",
    bpm: 134,
    chord: "G",
    id: "08e4cecd-e09e-45b9-a2ad-0c2b2bca7ee1",
    artist: "Danilo Montero"
  },
  {
    name: "El Señor Es Mi Pastor",
    bpm: 63,
    chord: "C",
    id: "0a5e2535-8fbd-4972-8086-ed69bf9b53e6",
    artist: "Danilo Montero"
  },
  {
    name: "Eres Todo Poderoso",
    bpm: 125,
    chord: "B",
    id: "230e99bf-39ca-4246-9f73-c823cabe2e24",
    artist: "Danilo Montero"
  },
  {
    name: "Glorioso Día",
    bpm: 110,
    chord: "D",
    id: "67c494a1-cb64-4723-812b-59d819614f2c",
    artist: "Passion"
  },
  {
    name: "Gracia Sublime Es",
    bpm: 100,
    chord: "B",
    id: "6479385b-1b84-4ca1-9aef-6e9686a2c82e",
    artist: "En Espiritu Y En Verdad"
  },
  {
    name: "Gracia Sin Fin",
    bpm: 130,
    chord: "A#",
    id: "7d7c6530-7784-4b5b-82a7-63b460c684e5",
    artist: "Alexander González"
  },
  {
    name: "Grande y Fuerte",
    bpm: 150,
    chord: "A",
    id: "28458f53-b48b-4a92-bd45-3a4e66722553",
    artist: "Miel San Marcos"
  },
  {
    name: "Hay Libertad",
    bpm: 148,
    chord: "F",
    id: "41bcdbe3-e192-4080-a897-5bcd6b69e7bb",
    artist: "La Ibi"
  },
  {
    name: "La Casa de Dios",
    bpm: 143,
    chord: "D",
    id: "60c3c5f0-cda4-4bd5-b7f0-c4c7176d7c83",
    artist: "Danilo Montero"
  },
  {
    name: "Lo Harás Otra Vez",
    bpm: 86,
    chord: "A#",
    id: "038e80cc-9ebe-4821-9182-511ce4b76d3a",
    artist: "Elevation Worship"
  },
  {
    name: "No Hay Lugar Más Alto (part. Christine D'Clario)",
    bpm: 136,
    chord: "A",
    id: "6dc14765-3f96-4f59-bb07-b027979bddec",
    artist: "Miel San Marcos"
  },
  {
    name: "Por Siempre",
    bpm: 143,
    chord: "G#",
    id: "c8a07e0a-3659-4898-b4b2-8db680b2fbde",
    artist: "En espíritu y en verdad"
  },
  {
    name: "Revelación",
    bpm: 136,
    chord: "A",
    id: "e510dda1-1e8a-4bf4-b28e-d12d81a509fd",
    artist: "Danilo Montero"
  },
  {
    name: "Rey de Reyes (part. Daniela Barrientos)",
    bpm: 147,
    chord: "D",
    id: "fce12a24-2fd3-4bab-a644-53c24fdcceba",
    artist: "Marco Barrientos"
  },
  {
    name: "Un Siervo Para Tu Gloria",
    bpm: 130,
    chord: "B",
    id: "44e5795e-851d-4dbb-99d6-c90ac5803660",
    artist: "Sovereign Grace Music"
  },
  {
    name: "Somos Iglesia",
    bpm: 75,
    chord: "D#",
    id: "766203bf-5a65-4841-8a90-9a2fa933b423",
    artist: "Un Corazón"
  },
  {
    name: "Somos el Pueblo de Dios",
    bpm: 95,
    chord: "G",
    id: "7bfe48da-6736-4e08-bbf8-5a42b26507f0",
    artist: "Marcos Witt"
  },
  {
    name: "Te Doy Gloria",
    bpm: 136,
    chord: "C",
    id: "f1531d29-03c9-492d-baf6-61949b085b4b",
    artist: "Marco Barrientos"
  },
  {
    name: "Tu Fidelidad",
    bpm: 106,
    chord: "G",
    id: "c129ba51-8f81-430a-b85f-31b9f52734fc",
    artist: "Marcos Witt"
  },
  {
    name: "Tu Mirada",
    bpm: 96,
    chord: "D",
    id: "1124fb77-16a6-47ef-85e9-a9f11afd8fd6",
    artist: "Marcos Witt"
  },
  {
    name: "Tu Nombre, Oh Dios",
    bpm: 127,
    chord: "A",
    id: "f173eab9-ea79-4144-b713-d41fc6529195",
    artist: "Marcos Witt"
  }
]

const samplePlaylists = [
  {
    id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    name: "Culto Domingo",
    songs: [
      "d2df3f40-8e27-4e30-9e6d-099b7c7ad816",
      "288a1e8d-8d81-46e0-821c-0e7a13654519",
      "617a4104-db57-4db9-8533-bc6d256ddc8f"
    ],
    isPublic: true,
    allowGuestEditing: true,
    shareCode: "ACST1234"
  },
  {
    id: "u3v4w5x6-y7z8-a9b0-c1d2-e3f4g5h6i7j8",
    name: "Culto Domingo 19",
    songs: [
      "c2fa5cb4-b5ee-4b7b-b6d5-3324c528d953",
      "6cccc782-1244-4667-b8d3-dfef0556caa1",
      "0a5e2535-8fbd-4972-8086-ed69bf9b53e6"
    ],
    isPublic: false,
    allowGuestEditing: false
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
              <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Home
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
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Home
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
                      <ClockIcon className="mr-1 h-3 w-3" /> {song.bpm} BPM
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
