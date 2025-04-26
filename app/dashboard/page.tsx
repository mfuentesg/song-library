import { SongLibrary } from "@/components/song-library"
import { Header } from "@/components/header"
import { createClient } from "@/lib/supabase/server"
import { UserProvider } from "@/components/user-provider"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <UserProvider user={user}>
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Song Library</h1>
          <p className="text-muted-foreground">Organize and share your music collection</p>
        </div>
        <SongLibrary />
      </main>
    </UserProvider>
  )
}
