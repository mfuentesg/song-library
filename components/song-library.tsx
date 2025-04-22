"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import Playlist from "@/components/playlist"
import SongList from "./song-list"
import SongForm from "./song-form"

export default function SongLibrary() {
  const playlists = [
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="whitespace-nowrap">
              <PlusIcon className="mr-2 h-4 w-4" /> Add Song
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Song</DialogTitle>
            </DialogHeader>
            <SongForm />
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
