"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export function PWAUpdate() {
  useEffect(() => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) =>
        console.log("Service Worker registration successful with scope: ", registration.scope)
      )
      .catch((err) => console.log("Service Worker registration failed: ", err))

    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
    })

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        toast.info("New version available", {
          action: {
            label: "Reload",
            onClick: () => window.location.reload()
          }
        })
      })
    }
  }, [])

  return null
}
