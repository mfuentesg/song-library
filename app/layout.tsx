import type React from "react"
import type { Metadata } from "next"
import { Lato } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { PWAUpdate } from "@/components/pwa-update"
import { createClient } from "@/lib/supabase/server"
import { UserProvider } from "@/components/user-provider"

import "./globals.css"

export const runtime = "edge"

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-lato"
})

export const metadata: Metadata = {
  title: "Song Library",
  description: "Organize and share your music with fellow musicians",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Song Library"
  },
  formatDetection: {
    telephone: false
  }
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <html lang="en" className={`${lato.variable}`} suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Song Library" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Song Library" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <UserProvider user={user}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
          </ThemeProvider>
        </UserProvider>
        <Toaster />
        <PWAUpdate />
      </body>
    </html>
  )
}
