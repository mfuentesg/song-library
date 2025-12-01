"use client"

import React from "react"
import { ChordProParser } from "chordsheetjs"

// List of musical keys for transposition
const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const FLAT_KEYS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

/**
 * Get the semitone offset between two keys
 */
function getKeyOffset(fromKey: string, toKey: string): number {
  const normalizeKey = (key: string): number => {
    const normalized = key.replace("m", "").replace("b", "")
    const isFlat = key.includes("b")
    const keyList = isFlat ? FLAT_KEYS : KEYS
    const index = keyList.findIndex(
      (k) => k.toLowerCase() === normalized.toLowerCase()
    )
    return index >= 0 ? index : 0
  }

  const fromIndex = normalizeKey(fromKey)
  const toIndex = normalizeKey(toKey)
  return (toIndex - fromIndex + 12) % 12
}

/**
 * Transpose a chord by a number of semitones
 */
function transposeChord(chord: string, semitones: number): string {
  if (semitones === 0) return chord
  
  // Match chord root and suffix
  const match = chord.match(/^([A-G][#b]?)(.*)$/)
  if (!match) return chord

  const [, root, suffix] = match
  const isFlat = root.includes("b")
  const keyList = isFlat ? FLAT_KEYS : KEYS
  const currentIndex = keyList.findIndex(
    (k) => k.toLowerCase() === root.toLowerCase()
  )
  
  if (currentIndex < 0) return chord
  
  const newIndex = (currentIndex + semitones + 12) % 12
  return keyList[newIndex] + suffix
}

interface SongSheetProps {
  content: string
  originalKey?: string
  targetKey?: string
  capo?: number
  className?: string
}

export function SongSheet({
  content,
  originalKey,
  targetKey,
  capo = 0,
  className = ""
}: SongSheetProps) {
  const parsedSong = React.useMemo(() => {
    try {
      const parser = new ChordProParser()
      return parser.parse(content)
    } catch {
      return null
    }
  }, [content])

  const lines = React.useMemo(() => {
    if (!parsedSong) return []
    
    // Calculate total transposition
    let semitones = 0
    if (originalKey && targetKey) {
      semitones = getKeyOffset(originalKey, targetKey)
    }
    // Capo raises pitch, so we transpose down
    semitones = (semitones - capo + 12) % 12

    return parsedSong.lines.map((line, lineIndex) => {
      const items = line.items || []
      return {
        key: `line-${lineIndex}`,
        items: items.map((item, itemIndex) => {
          const chordItem = item as { chords?: string; lyrics?: string }
          const chord = chordItem.chords || ""
          const lyrics = chordItem.lyrics || ""
          
          const transposedChord = semitones !== 0 && chord 
            ? transposeChord(chord, semitones)
            : chord

          return {
            key: `item-${itemIndex}`,
            chord: transposedChord,
            lyrics
          }
        })
      }
    })
  }, [parsedSong, originalKey, targetKey, capo])

  if (!content) {
    return (
      <div className={`text-muted-foreground italic ${className}`}>
        No lyrics available
      </div>
    )
  }

  if (!parsedSong) {
    return (
      <div className={`whitespace-pre-wrap ${className}`}>
        {content}
      </div>
    )
  }

  return (
    <div className={`font-mono text-sm ${className}`}>
      {lines.map((line) => (
        <div key={line.key} className="flex flex-wrap min-h-[1.5em]">
          {line.items.length === 0 ? (
            <div className="w-full">&nbsp;</div>
          ) : (
            line.items.map((item) => (
              <span key={item.key} className="inline-block">
                {item.chord && (
                  <span className="text-blue-600 dark:text-blue-400 font-semibold block h-5">
                    {item.chord}
                  </span>
                )}
                {!item.chord && item.lyrics && (
                  <span className="block h-5">&nbsp;</span>
                )}
                <span className="whitespace-pre">{item.lyrics || "\u00A0"}</span>
              </span>
            ))
          )}
        </div>
      ))}
    </div>
  )
}
