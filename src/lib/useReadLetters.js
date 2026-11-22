import { useCallback, useState } from 'react'
import { letterKey } from './letters.js'

// Remembers which letters were opened, in this browser only.
// The storage key "read" is the same one the old site used, so nothing is lost.
const STORAGE_KEY = 'read'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function useReadLetters() {
  const [read, setRead] = useState(load)

  const isRead = useCallback((letter) => Boolean(read[letterKey(letter)]), [read])

  const markRead = useCallback((letter) => {
    setRead((prev) => {
      const next = { ...prev, [letterKey(letter)]: 1 }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* private window: just don't remember */
      }
      return next
    })
  }, [])

  return { isRead, markRead }
}
