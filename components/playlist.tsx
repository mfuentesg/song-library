"use client"

import Link from "next/link"
import { useState, useEffect, useContext } from "react"
import { toast } from "sonner"
import { GlobeIcon, LockIcon, Share2Icon, SettingsIcon, Trash2Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlaylistConfigDialog } from "@/components/playlist-config-dialog"
import { Song } from "@/components/song"
import { SongWithPosition, type PlaylistWithSongs } from "@/types/supabase"
import { createClient } from "@/lib/supabase/client"
import { UserContext } from "@/context/auth"
import { DeletePlaylistDialog } from "./playlist-delete-dialog"
import { DraggablePlaylist } from "./draggable-playlist"

function PlaylistBadges({ playlist }: { playlist: PlaylistWithSongs }) {
  return (
    <div className="flex gap-2 justify-center items-center">
      {playlist.is_public ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <GlobeIcon className="mr-1 h-3 w-3" /> Public
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <LockIcon className="mr-1 h-3 w-3" /> Private
        </Badge>
      )}

      {playlist.allow_guest_editing && (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Guest Editing
        </Badge>
      )}
    </div>
  )
}

export function Playlist({
  playlist: originalPlaylist,
  className = ""
}: {
  playlist: PlaylistWithSongs
  className?: string
}) {
  const supabase = createClient()
  const [playlist, setPlaylist] = useState(originalPlaylist)

  const user = useContext(UserContext)
  const isSameOwner = playlist.user_id === user?.id
  const allowDragging = isSameOwner || (playlist.is_public && playlist.allow_guest_editing)

  const [songIds, setSongIds] = useState(playlist.songs.map((song) => song.id))
  const songs = playlist.songs.reduce<{ [key: string]: SongWithPosition }>(
    (acc, song) => ({ ...acc, [song.id]: song }),
    {}
  )

  const hasSongs = songIds.length > 0
  const mappedSongs = songIds.map((songId) => songs[songId])

  const applyNewPlaylistOrder = async (newSongIds: string[]) => {
    const newPlaylistOrder = newSongIds.map((songId, index) => ({
      playlist_id: playlist.id,
      song_id: songId,
      position: index + 1
    }))

    return supabase.from("playlist_songs").upsert(newPlaylistOrder)
  }

  const onPlaylistSort = async (sourceIndex: number, destinationIndex: number) => {
    const newSongIds = Array.from(songIds)
    const [removed] = newSongIds.splice(sourceIndex, 1)

    newSongIds.splice(destinationIndex, 0, removed)
    setSongIds(newSongIds)

    const { error } = await applyNewPlaylistOrder(newSongIds)
    if (error) {
      toast.error("Error reordering playlist")
      return
    }
    toast.info("Playlist reordered")
  }

  const deleteSong = async (songIdToBeDeleted: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("playlist_songs")
      .delete()
      .eq("playlist_id", playlist.id)
      .eq("song_id", songIdToBeDeleted)

    if (error) {
      toast.error("Error deleting song from playlist")
      return
    }

    const newSongIds = songIds.filter((songId) => songId !== songIdToBeDeleted)
    setSongIds(newSongIds)
    await applyNewPlaylistOrder(newSongIds)
    toast.info("Song removed from playlist")
  }

  useEffect(() => {
    const notifyPlaylistUpdate = () => {
      if (toast.getToasts().length !== 0) {
        return
      }

      toast.warning("Playlist updated by somebody else.", {
        dismissible: false,
        action: {
          label: "Refresh",
          onClick: () => {
            window.location.reload()
          }
        }
      })
    }

    const channel = supabase
      .channel(`playlist:${playlist.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "playlists", filter: `id=eq.${playlist.id}` },
        ({ new: newPlaylist }) => {
          setPlaylist((prevPlaylist) => ({
            ...prevPlaylist,
            is_public: newPlaylist.is_public,
            allow_guest_editing: newPlaylist.allow_guest_editing,
            name: newPlaylist.name
          }))
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "playlist_songs",
          filter: `playlist_id=eq.${playlist.id}`
        },
        notifyPlaylistUpdate
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "playlist_songs",
          filter: `playlist_id=eq.${playlist.id}`
        },
        notifyPlaylistUpdate
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [playlist.id, supabase])

  const sharePlaylist = () => {
    if (!playlist.is_public) {
      toast.info("Make the playlist public in settings before sharing.")
      return
    }

    const shareLink = `${window.location.origin}/shared/${playlist.share_code}`
    navigator.clipboard.writeText(shareLink)
    toast.info("The playlist share link has been copied to your clipboard.")
  }

  return (
    <div key={playlist.id} className={cn("space-y-2 p-4 rounded-md bg-muted", className)}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <h3 className="text-lg font-semibold">
            <Link href={`/shared/${playlist.share_code}`} target="_blank">
              {playlist.name}
            </Link>
          </h3>
          <PlaylistBadges playlist={playlist} />
        </div>
        <div className="flex gap-2 ">
          {user && (
            <DeletePlaylistDialog
              playlistId={playlist.id}
              trigger={
                <Button variant="outline" size="sm">
                  <Trash2Icon className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              }
            />
          )}
          {user && (
            <PlaylistConfigDialog
              playlist={playlist}
              trigger={
                <Button variant="outline" size="sm">
                  <SettingsIcon className="h-4 w-4" /> <span className="sr-only">Settings</span>
                </Button>
              }
            />
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={sharePlaylist}
            disabled={!playlist.is_public}
          >
            <Share2Icon className="h-4 w-4" /> <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {!hasSongs && (
          <p className="text-sm text-muted-foreground italic p-4">
            This playlist is empty. Add songs from the library.
          </p>
        )}
        {hasSongs && allowDragging && (
          <DraggablePlaylist
            playlist={playlist}
            songs={mappedSongs}
            onDeleteSong={deleteSong}
            onPlaylistSort={onPlaylistSort}
          />
        )}
        {hasSongs && !allowDragging && (
          <div className="space-y-2">
            {mappedSongs.map((song) => (
              <Song key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
