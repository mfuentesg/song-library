import type React from "react"
import type { Metadata } from "next"
import { Lato } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"

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
  description: "Organize and share your music with fellow musicians"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${lato.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
