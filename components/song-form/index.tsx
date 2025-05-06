"use client"

import React, { useContext, useState } from "react"
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
import { PlusIcon } from "lucide-react"

export const SongFormDialog = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const toggleDialog = () => {
    if (isAddDialogOpen) {
      form.reset()
    }
    setIsAddDialogOpen((prev) => !prev)
  }

  const formSchema = z.object({
    title: z.string().min(2).max(50),
    artist: z.string().min(2).max(50),
    chord: z.string().min(1).max(6),
    bpm: z.string().max(3)
  })
  const user = useContext(UserContext)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artist: "",
      chord: "A",
      bpm: "120"
    }
  })

  const handleAddSong = async (values: z.infer<typeof formSchema>) => {
    const { error } = await createClient()
      .from("songs")
      .insert({
        title: values.title,
        artist: values.artist,
        chord: values.chord,
        bpm: Number.parseInt(values.bpm, 10),
        user_id: user?.id
      })

    if (error) {
      return toast.error("Error adding song to library.")
    }

    toggleDialog()
    toast.success(`"${values.title}" has been added to your library.`)
  }

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>
        <Button className="whitespace-nowrap">
          <PlusIcon className="mr-2 h-4 w-4" /> Add Song
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="create a new song">
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddSong)} className="grid gap-4">
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

            <Button type="submit">Add Song</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
