"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { GlobeIcon, LockIcon, CopyIcon } from "lucide-react"

interface PlaylistConfigDialogProps {
  playlist: {
    id: string
    name: string
    songs: string[]
    isPublic?: boolean
    allowGuestEditing?: boolean
    shareCode?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (playlist: {
    id: string
    name: string
    songs: string[]
    isPublic: boolean
    allowGuestEditing: boolean
    shareCode: string
  }) => void
}

export function PlaylistConfigDialog({
  playlist,
  open,
  onOpenChange,
  onSave
}: PlaylistConfigDialogProps) {
  const [name, setName] = useState(playlist.name)
  const [isPublic, setIsPublic] = useState(playlist.isPublic ?? false)
  const [allowGuestEditing, setAllowGuestEditing] = useState(playlist.allowGuestEditing ?? false)
  const [shareCode] = useState(playlist.shareCode ?? generateShareCode())

  function generateShareCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
  }

  function handleSave() {
    onSave({
      ...playlist,
      name,
      isPublic,
      allowGuestEditing,
      shareCode
    })
    onOpenChange(false)
    toast.success("Your playlist settings have been updated successfully.")
  }

  function copyShareLink() {
    const shareLink = `${window.location.origin}/shared-playlist/${shareCode}`
    navigator.clipboard.writeText(shareLink)
    toast.info("The playlist share link has been copied to your clipboard.")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Playlist Settings</DialogTitle>
          <DialogDescription>
            Configure your playlist visibility and sharing options.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Playlist Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
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
              <Switch id="public-visibility" checked={isPublic} onCheckedChange={setIsPublic} />
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
              <Switch
                id="guest-editing"
                checked={allowGuestEditing}
                onCheckedChange={setAllowGuestEditing}
                disabled={!isPublic}
              />
            </div>
          </div>

          {isPublic && (
            <div className="mt-4 space-y-2">
              <Label>Share Code</Label>
              <div className="flex items-center gap-2">
                <Input value={shareCode} readOnly className="font-mono" />
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
