"use client"

import React, { useContext, useEffect, useState } from "react"
import { SearchIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { type Views } from "@/types/supabase"
import { UserContext } from "@/context/auth"

interface ShareLibraryDialogProps {
  trigger: React.ReactNode
}

export function ShareLibraryDialog({ trigger }: ShareLibraryDialogProps) {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<Views<"user_profiles">[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const user = useContext(UserContext)

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient()
      const { data: users, error } = await supabase.from("user_profiles").select("*")

      if (error) {
        console.error("Error fetching users:", error)
        toast.error("Failed to load users")
        return
      }

      setUsers(users)
    }

    if (open) {
      fetchUsers()
    }
  }, [open, user?.id])

  const filteredUsers = users
    .filter((filteredUser) => filteredUser.id !== user?.id)
    .filter((filteredUser) => filteredUser.email?.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleShare = async (sharedWithId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("shared_libraries").insert({
      owner_id: user?.id as string,
      shared_with_id: sharedWithId
    })

    if (error) {
      if (error.code === "23505") {
        // Unique violation error code
        toast.error("Library already shared with this user")
      } else {
        console.error("Error sharing library:", error)
        toast.error("Failed to share library")
      }
      return
    }

    toast.success("Library shared successfully")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Song Library</DialogTitle>
          <DialogDescription>Share your song library with other users.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users by email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-y-auto max-h-[300px] space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-md border"
              >
                <span className="text-sm truncate">{user.email}</span>
                <button
                  onClick={() => handleShare(user.id!)}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  Share
                </button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
