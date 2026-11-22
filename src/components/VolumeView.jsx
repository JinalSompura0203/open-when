import { useRef } from 'react'
import { images } from '../lib/images.js'
import { findLetter } from '../lib/letters.js'
import { LETTERS_PER_PAGE, PAGE_COUNT } from '../lib/constants.js'
import '../styles/volume.css'

const SWIPE_DISTANCE = 50

/** One volume: 4 envelopes per page, 5 pages. */
export default function VolumeView({ vol, page, onPage, onBack, onOpenLetter, isRead }) {
  const touchStartX = useRef(0)
  const go = (p) => onPage(Math.max(0, Math.min(PAGE_COUNT - 1, p)))

  const slots = Array.from({ length: LETTERS_PER_PAGE }, (_, i) => page * LETTERS_PER_PAGE + i + 1)

  return (
    <div className="vwrap">
      <button className="btn" onClick={onBack}>Back to the box</button>
      <h2>Volume {vol} · page {page + 1} of {PAGE_COUNT}</h2>

      <div
        className="grid"
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const d = e.changedTouches[0].clientX - touchStartX.current
          if (Math.abs(d) > SWIPE_DISTANCE) go(page + (d < 0 ? 1 : -1))
        }}
      >
        {slots.map((slot) => {
          const letter = findLetter(vol, slot)
          if (!letter) {
            return (
              <div key={slot} className="mt empty">
                <div className="ph" />
                <em>Letter {slot} is not written yet</em>
              </div>
            )
          }
          return (
            <button key={slot} className={`mt ${isRead(letter) ? 'rd' : ''}`} onClick={() => onOpenLetter(letter)}>
              <img src={images.envelopeThumbnail} alt="" />
              <em>{letter.title}</em>
            </button>
          )
        })}
      </div>

      <div className="pager">
        <button className="btn" onClick={() => go(page - 1)} aria-label="Previous page">‹</button>
        {Array.from({ length: PAGE_COUNT }, (_, i) => (
          <button key={i} className={`dot2 ${i === page ? 'on' : ''}`} onClick={() => go(i)} aria-label={`Page ${i + 1}`} />
        ))}
        <button className="btn" onClick={() => go(page + 1)} aria-label="Next page">›</button>
      </div>
    </div>
  )
}
