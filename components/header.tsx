import Link from "next/link"
import { UserMenu, type AuthUser } from "@/components/user-menu"
import { createClient } from "@/lib/supabase/server"

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Song Library</span>
        </Link>

        {!error && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <UserMenu user={user?.user_metadata as AuthUser} />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
