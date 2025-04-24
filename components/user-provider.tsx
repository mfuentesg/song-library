"use client"

import { UserContext } from "@/context/auth"
import { User } from "@supabase/supabase-js"

interface UserProviderProps {
  user: User | null
  children: React.ReactNode
}

export function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
