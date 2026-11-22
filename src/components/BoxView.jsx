import { useEffect, useRef, useState } from 'react'
import { images } from '../lib/images.js'
import { letters } from '../lib/letters.js'
import Chest from './Chest.jsx'
import '../styles/box.css'

// Timing of the "unlock the box" animation, in milliseconds.
const KEY_TURNS = 1300
const BOX_SHAKES = 1900
const CHEST_APPEARS = 2700
const DONE = 3900

/**
 * First screen: a closed box with a key. Tapping the key unlocks it and
 * shows the open chest with five volumes.
 */
export default function BoxView({ unlocked, onUnlocked, onPickVolume, isRead }) {
  // 0 = waiting, 1 = key flying, 2 = key turning, 3 = shaking, 4 = chest open
  const [step, setStep] = useState(unlocked ? 4 : 0)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const unlockBox = () => {
    if (step > 0) return
    setStep(1)
    const later = (ms, fn) => timers.current.push(setTimeout(fn, ms))
    later(KEY_TURNS, () => setStep(2))
    later(BOX_SHAKES, () => setStep(3))
    later(CHEST_APPEARS, () => setStep(4))
    later(DONE, onUnlocked)
  }

  const open = step >= 4
  const unreadIn = (vol) => letters.filter((l) => l.vol === vol && !isRead(l)).length

  return (
    <>
      <p className="cap">{unlocked ? 'Choose a volume to begin.' : 'Touch the key to unlock the box.'}</p>
      <div className={`scene ${open ? 'open' : ''}`}>
        <div className={`bx ${step >= 3 && !open ? 'shk' : ''} ${open ? 'out' : ''}`}>
          <img className="box" src={images.boxClosed} alt="Heritage box" />
          <div className={`flash ${step === 2 || step === 3 ? 'on' : ''}`} />
          {!unlocked && (
            <div
              className={`kw ${step >= 1 ? 'fly' : ''} ${step >= 2 ? 'turn' : ''}`}
              role="button"
              aria-label="Unlock the box"
              onClick={unlockBox}
            >
              <img src={images.key} alt="Key" />
            </div>
          )}
        </div>
        <Chest unreadIn={unreadIn} onPickVolume={onPickVolume} />
      </div>
    </>
  )
}
