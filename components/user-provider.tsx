"use client"

import { UserContext } from "@/context/auth"
import { User } from "@supabase/supabase-js"

interface Props {
  user: User | null
  children: React.ReactNode
}

export function UserProvider({ user, children }: Props) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
