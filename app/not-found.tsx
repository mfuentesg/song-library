import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12 gap-y-2">
      <h1 className="text-3xl">Page not Found</h1>
      <p>The page that are you looking for does not exist</p>
      <Link href="/" className="underline">
        Return Home
      </Link>
    </div>
  )
}
