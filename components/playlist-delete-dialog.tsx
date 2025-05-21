"use client"

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

import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export function DeletePlaylistDialog({
  playlistId,
  onDelete,
  trigger
}: {
  playlistId: string
  onDelete?: () => void
  trigger?: React.ReactNode
}) {
  const handleDelete = async () => {
    const { error } = await createClient().from("playlists").delete().eq("id", playlistId)

    if (error) {
      toast.error("Failed to delete playlist")
      return
    }

    toast.success("Playlist deleted")
    onDelete?.()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your playlist and all of its
            songs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
