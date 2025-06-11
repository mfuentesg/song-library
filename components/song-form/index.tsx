"use client"

import React, { useContext, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChordSelect, type Key } from "@/components/chord-select"
import { createClient } from "@/lib/supabase/client"
import { UserContext } from "@/context/auth"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Tables } from "@/types/database"

export const SongFormDialog = ({
  initialValue,
  title,
  onSubmit,
  trigger
}: {
  initialValue?: Tables<"songs">
  title: string
  onSubmit?: (song: Tables<"songs">) => void
  trigger: React.ReactNode
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const user = useContext(UserContext)

  const formSchema = z.object({
    title: z.string().min(2).max(50),
    artist: z.string().min(2).max(50),
    chord: z.string().min(1).max(6),
    bpm: z.string().max(3)
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artist: "",
      chord: "A",
      bpm: "120"
    }
  })

  const toggleDialog = useCallback(() => {
    setIsAddDialogOpen((prev) => !prev)
    if (!isAddDialogOpen) {
      form.reset({
        title: initialValue?.title ?? "",
        artist: initialValue?.artist ?? "",
        chord: initialValue?.chord ?? "A",
        bpm: initialValue?.bpm?.toString() ?? "120"
      })
    }
  }, [isAddDialogOpen, initialValue, form])

  const handleSubmitSong = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const songData = {
        id: initialValue?.id,
        title: values.title,
        artist: values.artist,
        chord: values.chord,
        bpm: Number.parseInt(values.bpm, 10),
        user_id: user?.id
      }
      const { data, error } = await createClient()
        .from("songs")
        .upsert(songData)
        .select("*")
        .single()

      if (error) {
        return toast.error("Error adding song to library.")
      }

      toggleDialog()
      onSubmit?.(data)
      toast.success(
        `"${values.title}" has been ${songData.id ? "updated" : "created"} successfully.`
      )
    },
    [initialValue?.id, user?.id, toggleDialog, onSubmit]
  )

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent aria-describedby={title}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitSong)} className="grid gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Song Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter song name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter artist name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chord"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Chord</FormLabel>
                    <FormControl>
                      <ChordSelect
                        className="w-full"
                        value={field.value as Key}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bpm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BPM</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Save changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
