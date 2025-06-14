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
import { cn } from "@/lib/utils"

interface ShareLibraryDialogProps {
  trigger: React.ReactNode
}

export function ShareLibraryDialog({ trigger }: ShareLibraryDialogProps) {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<Views<"user_profiles">[]>([])
  const [sharedUsers, setSharedUsers] = useState<string[]>([])
  const [sharedUsersDetails, setSharedUsersDetails] = useState<Views<"user_profiles">[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const user = useContext(UserContext)

  const fetchSharedUsers = async () => {
    if (!user?.id) return

    const supabase = createClient()
    const { data: sharedLibraries, error } = await supabase
      .from("shared_libraries")
      .select("shared_with_id")
      .eq("owner_id", user.id)

    if (error) {
      console.error("Error fetching shared users:", error)
      return
    }

    const sharedWithIds = sharedLibraries.map((share) => share.shared_with_id)
    setSharedUsers(sharedWithIds)

    // Fetch user details for shared users
    if (sharedWithIds.length > 0) {
      const { data: usersDetails, error: usersError } = await supabase
        .from("user_profiles")
        .select("*")
        .in("id", sharedWithIds)

      if (usersError) {
        console.error("Error fetching shared users details:", usersError)
        return
      }

      setSharedUsersDetails(usersDetails || [])
    } else {
      setSharedUsersDetails([])
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm) {
        setUsers([])
        return
      }

      setIsLoading(true)
      const supabase = createClient()
      const { data: users, error } = await supabase
        .from("user_profiles")
        .select("*")
        .or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .neq("id", user?.id || "")
        .limit(10)

      if (error) {
        console.error("Error fetching users:", error)
        toast.error("Failed to load users")
        return
      }

      setUsers(users || [])
      setIsLoading(false)
    }

    const debounceTimer = setTimeout(() => {
      if (open) {
        fetchUsers()
      }
    }, 300) // Debounce search for 300ms

    return () => clearTimeout(debounceTimer)
  }, [open, searchTerm, user?.id])

  useEffect(() => {
    if (open) {
      fetchSharedUsers()
    }
  }, [open, user?.id])

  const isUserShared = (userId: string) => sharedUsers.includes(userId)

  const handleShare = async (sharedWithId: string) => {
    if (!user?.id) {
      toast.error("You must be logged in to share your library")
      return
    }

    const supabase = createClient()
    const { error } = await supabase.from("shared_libraries").insert({
      owner_id: user.id,
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

    await fetchSharedUsers()
    toast.success("Library shared successfully")
  }

  const handleUnshare = async (sharedWithId: string) => {
    if (!user?.id) return

    const supabase = createClient()
    const { error } = await supabase
      .from("shared_libraries")
      .delete()
      .match({ owner_id: user.id, shared_with_id: sharedWithId })

    if (error) {
      console.error("Error removing share:", error)
      toast.error("Failed to remove share")
      return
    }

    await fetchSharedUsers()
    toast.success("User removed from shared library")
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
          {sharedUsersDetails.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Users with access</h4>
              <div className="space-y-2">
                {sharedUsersDetails.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-md border border-green-200 bg-green-50"
                  >
                    <div className="flex flex-col">
                      <span className="flex flex-col text-sm truncate">
                        <span>{user.full_name}</span>
                        <span className="text-muted-foreground text-xs">{user.email}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => handleUnshare(user.id!)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Revoke access
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            {isLoading ? (
              <div className="text-center p-4 text-sm text-muted-foreground">Loading users...</div>
            ) : searchTerm && users.length === 0 ? (
              <div className="text-center p-4 text-sm text-muted-foreground">No users found</div>
            ) : !searchTerm ? (
              <div className="text-center p-4 text-sm text-muted-foreground">
                Type to search for users
              </div>
            ) : (
              users.map((user) => {
                if (!user.id) return null
                const isShared = isUserShared(user.id)
                return (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-md border",
                      isShared && "border-green-200 bg-green-50"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="flex flex-col text-sm truncate">
                        <span>{user.full_name}</span>
                        <span className="text-muted-foreground text-xs">{user.email}</span>
                      </span>
                      {isShared && <span className="text-xs text-green-600">Already shared</span>}
                    </div>
                    <button
                      onClick={() => (isShared ? handleUnshare(user.id!) : handleShare(user.id!))}
                      className={cn(
                        "text-xs hover:text-blue-700",
                        isShared ? "text-red-500 hover:text-red-700" : "text-blue-500"
                      )}
                    >
                      {isShared ? "Remove" : "Share"}
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
