import SongLibrary from "@/components/song-library"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Song Library</h1>
        <p className="text-muted-foreground">Organize and share your music collection</p>
      </div>
      <SongLibrary />
    </main>
  )
}
