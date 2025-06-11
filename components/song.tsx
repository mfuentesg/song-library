"use client"

import { useState } from "react"
import { ClockIcon } from "lucide-react"
import { type ClassValue } from "clsx"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { type Tables } from "@/types/database"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { PencilIcon, Trash2Icon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { SongFormDialog } from "./song-form"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const SongDeleteAlert = ({
  song,
  trigger,
  onConfirm
}: {
  song: Tables<"songs">
  onConfirm?: () => Promise<void>
  trigger: React.ReactNode
}) => {
  const onConfirmHandler = async () => {
    const supabase = createClient()
    const { error } = await supabase.from("songs").delete().eq("id", song.id)
    if (error) {
      console.error("Failed to delete song:", error)
      return
    }
    toast.success("Song deleted successfully")
    onConfirm?.()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete &quot;
            {song?.title}
            &quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmHandler}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function Song({
  song,
  className,
  onSelect,
  onEdit,
  onDelete,
  selectable = false,
  editable = true
}: {
  song: Tables<"songs">
  selectable?: boolean
  editable?: boolean
  onSelect?: (id: string, isSelected: boolean) => void
  onEdit?: (song: Tables<"songs">) => void
  onDelete?: (songId: string) => void
  className?: ClassValue
}) {
  const [isSelected, setIsSelected] = useState(false)

  const handleSongSelection = (checked: boolean) => {
    setIsSelected(checked)
    onSelect?.(song.id, checked)
  }

  const handleSongDeletion = async () => {
    onDelete?.(song.id)
  }

  return (
    <Card className={cn(className, "border-2 p-4 py-2")}>
      <CardContent className="relative flex items-center justify-between px-0">
        {selectable && (
          <Checkbox
            className="absolute right-0 top-1"
            checked={isSelected}
            onCheckedChange={handleSongSelection}
          />
        )}

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

        {editable && (
          <div className="absolute right-0 bottom-0">
            <SongFormDialog
              initialValue={song}
              title="Edit Song"
              onSubmit={onEdit}
              trigger={
                <Button variant="ghost" onClick={undefined}>
                  <PencilIcon />
                </Button>
              }
            />

            <SongDeleteAlert
              trigger={
                <Button variant="ghost">
                  <Trash2Icon />
                </Button>
              }
              song={song}
              onConfirm={handleSongDeletion}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
