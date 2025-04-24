import React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const keys = [
  "A",
  "Am",
  "A#",
  "A#m",
  "Bb",
  "Bbm",
  "B",
  "Bm",
  "C",
  "Cbm",
  "Cb",
  "Cm",
  "C#",
  "C#m",
  "Db",
  "Dbm",
  "D",
  "Dm",
  "D#",
  "D#m",
  "E",
  "Em",
  "Eb",
  "Ebm",
  "F",
  "Fb",
  "Fbm",
  "Fm",
  "F#",
  "F#m",
  "G",
  "Gm",
  "G#",
  "G#m",
  "Gb",
  "Gbm",
  "Ab",
  "Abm"
] as const

export type Key = (typeof keys)[number]

interface Props {
  value?: Key
  id?: string
  variant?: "dark" | "default"
  onChange?(value: string): void
  className?: string
}

export function ChordSelect({ value, id, className = "", onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className={cn("w-full dark:text-white", className)}>
        <SelectValue data-cy="selected-chord" />
      </SelectTrigger>
      <SelectContent className="w-fit max-h-[200px]" data-cy="chord-list">
        <SelectGroup>
          {keys.map((key) => (
            <SelectItem value={key} key={key}>
              {key}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
