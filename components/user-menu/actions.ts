"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect, RedirectType } from "next/navigation"

export const handleLogout = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")

  redirect("/", RedirectType.push)
}
