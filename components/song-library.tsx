import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Playlists } from "@/components/playlists"
import { SongList } from "@/components/song-list"
import { createClient } from "@/lib/supabase/server"
import { type Tables } from "@/types/database"
import { SongFormDialog } from "@/components/song-form"

export async function SongLibrary() {
  const supabase = await createClient()
  const { error, data: songs } = await supabase.from("songs").select("*")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <SongFormDialog />
      </div>
      <Tabs defaultValue="all-songs">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-songs">All Songs</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value="all-songs" className="space-y-4">
          {!error && <SongList songs={songs as Tables<"songs">[]} />}
        </TabsContent>

        <TabsContent value="playlists" className="space-y-6">
          <Playlists />
        </TabsContent>
      </Tabs>
    </div>
  )
}
