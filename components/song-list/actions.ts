"use server"

import { createClient } from "@/lib/supabase/server"

export const fetchSongs = async () => {
  const supabase = await createClient()
  return supabase.from("songs").select("*")
}
