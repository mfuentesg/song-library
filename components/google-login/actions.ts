"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const handleLogin = async () => {
  const supabase = await createClient()
  const origin = (await headers()).get("origin")
  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`
    }
  })

  if (error) {
    console.error("Google login error:", error)
    return
  }

  redirect(data.url)
}
