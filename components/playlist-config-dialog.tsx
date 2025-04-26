"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { GlobeIcon, LockIcon, CopyIcon } from "lucide-react"
import { type PlaylistWithSongs } from "@/types/supabase"
import { createClient } from "@/lib/supabase/client"
import { useForm } from "react-hook-form"
import {
  Form,
  FormItem,
  FormControl,
  FormLabel,
  FormField,
  FormMessage
} from "@/components/ui/form"
import { useContext, useState } from "react"
import { UserContext } from "@/context/auth"

interface Props {
  playlist: PlaylistWithSongs
  trigger?: React.ReactNode
}

export function PlaylistConfigDialog({ playlist, trigger }: Props) {
  const [open, setOpen] = useState(false)

  const formSchema = z.object({
    name: z.string().min(2).max(50),
    isPublic: z.boolean(),
    allowGuestEditing: z.boolean()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: playlist.name,
      isPublic: playlist.is_public ?? false,
      allowGuestEditing: playlist.allow_guest_editing ?? false
    }
  })

  const user = useContext(UserContext)
  const isPublic = form.watch("isPublic")
  const allowGuestEditing = form.watch("allowGuestEditing")

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient()
    const { error } = await supabase
      .from("playlists")
      .update({
        name: values.name,
        is_public: values.isPublic,
        allow_guest_editing: values.allowGuestEditing,
        user_id: user?.id
      })
      .eq("id", playlist.id)

    if (error) {
      return toast.error("Failed to update playlist settings.")
    }
    setOpen(false)
    toast.success("Your playlist settings have been updated successfully.")
  }

  function copyShareLink() {
    const shareLink = `${window.location.origin}/shared-playlist/${playlist.share_code}`
    navigator.clipboard.writeText(shareLink)
    toast.info("The playlist share link has been copied to your clipboard.")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-[425px]" aria-describedby="playlist settings">
        <DialogHeader>
          <DialogTitle>Playlist Settings</DialogTitle>
          <DialogDescription>
            Configure your playlist visibility and sharing options.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
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
              </div>

              <div className="grid gap-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-visibility">Public Visibility</Label>
                    <div className="text-sm text-muted-foreground">
                      {isPublic ? (
                        <div className="flex items-center text-green-600">
                          <GlobeIcon className="mr-1 h-3 w-3" />
                          <span>Anyone with the link can view</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-600">
                          <LockIcon className="mr-1 h-3 w-3" />
                          <span>Only you can view</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            id="public-visibility"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="guest-editing">Guest Editing</Label>
                    <div className="text-sm text-muted-foreground">
                      {allowGuestEditing ? (
                        <span>Guests can reorder songs</span>
                      ) : (
                        <span>Only you can reorder songs</span>
                      )}
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="allowGuestEditing"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            id="guest-editing"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!isPublic}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {isPublic && (
                <div className="mt-4 space-y-2">
                  <Label>Share Code</Label>
                  <div className="flex items-center gap-2">
                    <Input value={playlist.share_code ?? ""} readOnly className="font-mono" />
                    <Button variant="outline" size="icon" onClick={copyShareLink}>
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this code to share your playlist with others.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
