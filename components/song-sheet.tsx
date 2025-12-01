"use client"

import React from "react"
import { ChordProParser } from "chordsheetjs"

// List of musical keys for transposition (using sharps)
const SHARP_KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
// List of musical keys for transposition (using flats)
const FLAT_KEYS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

/**
 * Extract the root note from a key/chord (e.g., "Am" -> "A", "Dbm" -> "Db")
 */
function extractRoot(key: string): string {
  const match = key.match(/^([A-G][#b]?)/)
  return match ? match[1] : key
}

/**
 * Check if a key uses flats
 */
function usesFlats(key: string): boolean {
  return key.includes("b") && !key.startsWith("B")
}

/**
 * Get the semitone offset between two keys
 */
function getKeyOffset(fromKey: string, toKey: string): number {
  const getKeyIndex = (key: string): number => {
    const root = extractRoot(key)
    const keyList = usesFlats(root) ? FLAT_KEYS : SHARP_KEYS
    const index = keyList.findIndex(
      (k) => k.toLowerCase() === root.toLowerCase()
    )
    return index >= 0 ? index : 0
  }

  const fromIndex = getKeyIndex(fromKey)
  const toIndex = getKeyIndex(toKey)
  return (toIndex - fromIndex + 12) % 12
}

/**
 * Transpose a chord by a number of semitones
 */
function transposeChord(chord: string, semitones: number): string {
  if (semitones === 0) return chord
  
  // Match chord root and suffix (e.g., "Am7" -> root="A", suffix="m7")
  const match = chord.match(/^([A-G][#b]?)(.*)$/)
  if (!match) return chord

  const [, root, suffix] = match
  const keyList = usesFlats(root) ? FLAT_KEYS : SHARP_KEYS
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
