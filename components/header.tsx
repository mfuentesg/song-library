"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"

export function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const isLoginPage = pathname === "/login"

    if (!isLoginPage) {
      const timer = setTimeout(() => {
        setUser({
          name: "John Doe",
          email: "john.doe@example.com"
        })
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setUser(null)
    }
  }, [pathname])

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Song Library</span>
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <UserMenu user={user} />
            </div>
          ) : (
            pathname !== "/login" && (
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}
