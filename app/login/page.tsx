"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // eslint-disable-next-line
  const handleSocialLogin = (provider: string) => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 1000)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome to Song Library</CardTitle>
          <CardDescription className="text-center">
            Sign in to access your playlists
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
              className="bg-white hover:bg-gray-50"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("apple")}
              disabled={isLoading}
              className="bg-white hover:bg-gray-50"
            >
              <svg
                className="mr-2 h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.0001 10.9999C16.9999 9.80554 17.5316 8.66211 18.4812 7.87846C17.5842 6.63651 16.1721 5.92418 14.6731 5.90913C13.0997 5.74377 11.5706 6.79546 10.7693 6.79546C9.95151 6.79546 8.69322 5.92535 7.35221 5.95659C5.66781 6.01953 4.12514 6.98419 3.31631 8.49608C1.60089 11.6158 2.90073 16.1602 4.54447 18.5823C5.36502 19.7693 6.33781 21.0952 7.59472 21.0402C8.81839 20.9802 9.28222 20.2202 10.7693 20.2202C12.2421 20.2202 12.6771 21.0402 13.9584 21.0052C15.2821 20.9802 16.1211 19.8143 16.9126 18.6173C17.5461 17.7202 18.0301 16.7133 18.3482 15.6452C17.1871 15.1146 16.4999 14.1058 16.5001 10.9999H17.0001Z"
                  fill="currentColor"
                />
                <path
                  d="M14.8284 4.20022C15.5509 3.31536 15.9329 2.18022 15.9092 1.01172C14.7616 1.06892 13.6828 1.58133 12.9008 2.43842C12.1276 3.28209 11.7365 4.39989 11.7512 5.56022C12.9055 5.57538 14.0618 5.09308 14.8284 4.20022Z"
                  fill="currentColor"
                />
              </svg>
              Continue with Apple
            </Button>
          </div>

          <div className="text-center mt-6">
            <Button variant="ghost" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
