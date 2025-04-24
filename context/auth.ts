"use client"

import { createContext } from "react"
import { User } from "@supabase/supabase-js"

export const UserContext = createContext<User | null>(null)
