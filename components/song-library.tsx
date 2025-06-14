"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Playlists } from "@/components/playlists"
import { SongList } from "@/components/song-list"
import { type PlaylistWithSongs } from "@/types/supabase"
import { type Tables } from "@/types/database"

export function SongLibrary({
  playlists,
  songs
}: {
  playlists: PlaylistWithSongs[]
  songs: Tables<"songs">[]
}) {
  const [activeTab, setActiveTab] = useState<string>("all-songs")

  return (
    <div className="space-y-6">
      <Tabs onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-songs">All Songs</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>

        <TabsContent
          value="all-songs"
          className="space-y-4"
          forceMount
          hidden={activeTab !== "all-songs"}
        >
          <SongList songs={songs} />
        </TabsContent>

        <TabsContent
          value="playlists"
          className="space-y-6"
          forceMount
          hidden={activeTab !== "playlists"}
        >
          <Playlists playlists={playlists} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
