"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOutIcon } from "lucide-react"
import { handleLogout } from "./actions"

export type AuthUser = {
  id: string
  email: string
  name: string
  avatar_url?: string
}

export function UserMenu({ user }: { user: AuthUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <span className="hidden text-sm font-medium md:inline-block">{user.name}</span>
          <Avatar className="h-8 w-8 cursor-pointer border border-primary/20">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
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
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
