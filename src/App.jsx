import { useState } from 'react'
import settings from '../settings.js'
import { letters } from './lib/letters.js'
import { useReadLetters } from './lib/useReadLetters.js'
import Background from './components/Background.jsx'
import PasscodeGate from './components/PasscodeGate.jsx'
import BoxView from './components/BoxView.jsx'
import VolumeView from './components/VolumeView.jsx'
import LetterOverlay from './components/LetterOverlay.jsx'

const PASS_KEY = 'ok'
const hasPassed = () => {
  try {
    return sessionStorage.getItem(PASS_KEY) === '1'
  } catch {
    return false
  }
}

export default function App() {
  const [passed, setPassed] = useState(() => !settings.passcode || hasPassed())
  const [unlocked, setUnlocked] = useState(false) // has the box been opened with the key?
  const [vol, setVol] = useState(null) // which volume is open (1-5), or null for the box
  const [page, setPage] = useState(0)
  const [openLetter, setOpenLetter] = useState(null)
  const { isRead, markRead } = useReadLetters()

  const pass = () => {
    try {
      sessionStorage.setItem(PASS_KEY, '1')
    } catch {
      /* ignore */
    }
    setPassed(true)
  }

  const unread = letters.filter((l) => !isRead(l)).length

  return (
    <>
      <Background />
      <div id="app">
        {!passed ? (
          <PasscodeGate onUnlock={pass} />
        ) : (
          <>
            <header>
              <h1>{settings.siteTitle}</h1>
              <span>{unread ? `${unread} unread letter${unread > 1 ? 's' : ''}` : 'All letters read'}</span>
            </header>
            {vol === null ? (
              <BoxView
                unlocked={unlocked}
                onUnlocked={() => setUnlocked(true)}
                onPickVolume={(v) => {
                  setVol(v)
                  setPage(0)
                }}
                isRead={isRead}
              />
            ) : (
              <VolumeView
                vol={vol}
                page={page}
                onPage={setPage}
                onBack={() => setVol(null)}
                onOpenLetter={setOpenLetter}
                isRead={isRead}
              />
            )}
          </>
        )}
      </div>
      {openLetter && (
        <LetterOverlay letter={openLetter} onOpened={markRead} onClose={() => setOpenLetter(null)} />
      )}
    </>
  )
}
