import { Button } from "@/components/ui/button"
import { GoogleIcon } from "@/components/icons"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default function GoogleLogin() {
  const handleGoogleLogin = async () => {
    "use server"

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

  return (
    <form action={handleGoogleLogin} className="w-full">
      <Button variant="outline" className="w-full bg-white hover:bg-gray-50">
        <GoogleIcon className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
    </form>
  )
}
