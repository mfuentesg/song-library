"use client"

import { useContext } from "react"
import Link from "next/link"
import { UserMenu, type AuthUser } from "@/components/user-menu"
import { UserContext } from "@/context/auth"

export function Header() {
  const user = useContext(UserContext)

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Song Library</span>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {user && <UserMenu user={user?.user_metadata as AuthUser} />}
          </div>
        </div>
      </div>
    </header>
  )
}
