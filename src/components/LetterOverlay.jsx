import { useEffect, useRef, useState } from 'react'
import SealedEnvelope from './SealedEnvelope.jsx'
import LetterCard from './LetterCard.jsx'
import '../styles/letter.css'

// Timing after the seal is tapped, in milliseconds.
const PIECES_FLY = 520
const LETTER_SHOWS = 3700

/**
 * Full-screen view for one letter: first a sealed envelope,
 * then (after tapping the seal) the letter itself.
 */
export default function LetterOverlay({ letter, onOpened, onClose }) {
  // 'sealed' -> 'crack' -> 'go' -> 'letter'
  const [phase, setPhase] = useState('sealed')
  const timers = useRef([])

  // Hide the page behind the overlay while it is open.
  useEffect(() => {
    document.body.classList.add('modal')
    return () => {
      document.body.classList.remove('modal')
      timers.current.forEach(clearTimeout)
    }
  }, [])

  const breakSeal = () => {
    setPhase('crack')
    onOpened(letter)
    timers.current.push(setTimeout(() => setPhase('go'), PIECES_FLY))
    timers.current.push(setTimeout(() => setPhase('letter'), LETTER_SHOWS))
  }

  return (
    <div className="ov">
      {phase === 'letter' ? (
        <LetterCard letter={letter} onClose={onClose} />
      ) : (
        <SealedEnvelope phase={phase} onBreakSeal={breakSeal} />
      )}
    </div>
  )
}
