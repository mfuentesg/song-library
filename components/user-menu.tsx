import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOutIcon } from "lucide-react"
import { AvatarImage } from "@radix-ui/react-avatar"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect, RedirectType } from "next/navigation"

export type AuthUser = {
  id: string
  email: string
  name: string
  avatar_url?: string
}

export function UserMenu({ user }: { user: AuthUser }) {
  const handleLogout = async () => {
    "use server"

    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath("/", "layout")
    redirect("/", RedirectType.push)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <Avatar className="h-8 w-8 cursor-pointer border border-primary/20">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:inline-block">{user.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="p-0">
          <form action={handleLogout} className="block p-0">
            <Button variant="ghost" className="py-0 w-full justify-start">
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
