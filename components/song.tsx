"use client"

import { useState } from "react"
import { ClockIcon, SettingsIcon, EyeIcon } from "lucide-react"
import { type ClassValue } from "clsx"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { type Tables, type Json } from "@/types/database"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { SongFormDialog } from "./song-form"
import { SongSheet } from "./song-sheet"
import { ChordSelect, type Key } from "./chord-select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface SongSettings {
  capo?: number
}

function parseSongSettings(settings: Json): SongSettings {
  if (typeof settings === "object" && settings !== null && !Array.isArray(settings)) {
    return {
      capo: typeof settings.capo === "number" ? settings.capo : 0
    }
  }
  return { capo: 0 }
}

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [targetKey, setTargetKey] = useState<string>(song.key)
  const [capo, setCapo] = useState<number>(parseSongSettings(song.settings).capo ?? 0)

  const handleSongSelection = (checked: boolean) => {
    setIsSelected(checked)
    onSelect?.(song.id, checked)
  }

  const handleSongDeletion = async () => {
    onDelete?.(song.id)
  }

  const hasContent = Boolean(song.content)

  return (
    <>
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
              <Badge variant="outline">{song.key}</Badge>
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200 flex items-center"
              >
                <ClockIcon className="mr-1 h-3 w-3" /> {song.bpm} BPM
              </Badge>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 flex">
            {hasContent && (
              <Button variant="ghost" onClick={() => setIsPreviewOpen(true)}>
                <EyeIcon className="h-4 w-4" />
              </Button>
            )}
            {editable && (
              <>
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
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <div>
              <DialogTitle>{song.title}</DialogTitle>
              <p className="text-sm text-muted-foreground">{song.artist}</p>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target-key">Transpose to Key</Label>
                    <ChordSelect
                      id="target-key"
                      value={targetKey as Key}
                      onChange={(value) => setTargetKey(value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capo">Capo</Label>
                    <select
                      id="capo"
                      className="w-full p-2 border rounded-md"
                      value={capo}
                      onChange={(e) => setCapo(Number(e.target.value))}
                    >
                      {Array.from({ length: 13 }, (_, i) => (
                        <option key={i} value={i}>
                          {i === 0 ? "No capo" : `Fret ${i}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">Original: {song.key}</Badge>
                    {targetKey !== song.key && (
                      <Badge variant="outline">Target: {targetKey}</Badge>
                    )}
                    {capo > 0 && <Badge variant="outline">Capo: {capo}</Badge>}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </DialogHeader>
          <div className="mt-4">
            <SongSheet
              content={song.content || ""}
              originalKey={song.key}
              targetKey={targetKey}
              capo={capo}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
