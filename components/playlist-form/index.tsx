"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useContext } from "react"
import { UserContext } from "@/context/auth"
import { type Tables } from "@/types/database"
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog"
import { ListMusicIcon } from "lucide-react"

export function PlaylistFormDialog({
  selectedSongs,
  onSubmit
}: {
  selectedSongs: Tables<"songs">[]
  onSubmit?: () => void
}) {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    setOpen((prev) => !prev)
  }

  const user = useContext(UserContext)
  const formSchema = z.object({
    name: z.string().min(2).max(50)
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    }
  })

  const handleAddPlaylist = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      return
    }

    const { error } = await createClient().rpc("create_playlist_with_songs", {
      name: values.name,
      user_id: user.id,
      song_ids: selectedSongs.map((song) => song.id)
    })

    if (error) {
      return toast.error("Error adding playlist.")
    }

    form.reset()
    toggleOpen()
    toast.success(`"${values.name}" has been added to your playlists.`)
    onSubmit?.()
  }

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <ListMusicIcon className="h-4 w-4" />
          <span>Create Playlist</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="create a new playlist">
        <DialogHeader>
          <DialogTitle>Create Playlist</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddPlaylist)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Playlist Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter playlist name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-muted-foreground">
              Creating a playlist with {selectedSongs.length} selected song
              {selectedSongs.length !== 1 ? "s" : ""}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Create Playlist</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
