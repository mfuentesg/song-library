"use client"

import { useState, useEffect } from "react"
import { ClockIcon } from "lucide-react"
import { type ClassValue } from "clsx"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { type Tables } from "@/types/database"
import { createClient } from "@/lib/supabase/client"

export function Song({
  song: originalSong,
  className
}: {
  song: Tables<"songs">
  className?: ClassValue
}) {
  const [song, setSong] = useState(originalSong)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`song:${song.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "songs", filter: `id=eq.${song.id}` },
        ({ new: newSong }) => {
          setSong((prevSong) => ({ ...prevSong, ...newSong }))
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, song.id])

  return (
    <Card className={cn(className, "border-2 p-4 py-2")}>
      <CardContent className="flex items-center justify-between px-0">
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="font-medium">{song.title}</h3>
            <p className="text-sm text-muted-foreground">{song.artist}</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline">{song.chord}</Badge>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200 flex items-center"
            >
              <ClockIcon className="mr-1 h-3 w-3" /> {song.bpm} BPM
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
