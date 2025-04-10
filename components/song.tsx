import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { ClassValue } from "clsx"
import { Ref } from "react"

export type song = {
  id: string
  name: string
  artist: string
  chord: string
  bpm: number
}

export function Song({
  song,
  classNames,
  ref
}: {
  song: song
  classNames?: ClassValue
  ref?: Ref<HTMLDivElement> | undefined
}) {
  return (
    <Card className={cn(classNames)} ref={ref}>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-medium">{song.name}</h3>
            <p className="text-sm text-muted-foreground">{song.artist}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="ml-2">
              {song.chord}
            </Badge>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200 flex items-center"
            >
              <Clock className="mr-1 h-3 w-3" /> {song.bpm} BPM
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
