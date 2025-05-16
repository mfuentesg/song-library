import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Playlist not found</h1>
        <p className="text-muted-foreground">
          The playlist are you looking does not exist or is private.
        </p>
        <Button asChild className="mt-4" variant="ghost">
          <Link href="/" className="gap-1">
            <ArrowLeftIcon className="h-4 w-4" /> <span>Back to Home</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
