import settings from '../../settings.js'
import { cardImages } from '../lib/images.js'
import { joinNames } from '../lib/letterFormat.js'

/** Only show pictures from safe web links (https) or the site's own assets folder. */
function Picture({ url }) {
  if (!url || !/^(https:\/\/|assets\/)/.test(url)) return null
  return <img src={url} alt="" />
}

/** Longer letters get a smaller font so they still fit on the card. */
function fontSizeFor(text) {
  const n = (text || '').length
  if (n < 250) return '1.9rem'
  if (n < 600) return '1.55rem'
  return '1.3rem'
}

/** The opened letter. */
export default function LetterCard({ letter, onClose }) {
  const card = cardImages[letter.card] || cardImages.white
  // The letter's own "from:" line wins; otherwise use the name in settings.js.
  const from = letter.authors.length ? joinNames(letter.authors) : settings.from

  return (
    <div className="wrap">
      <div className="lt" style={{ backgroundImage: `url(${card})`, fontSize: fontSizeFor(letter.text) }}>
        <div className="tx">{letter.text}</div>
        <div className="stk">{letter.stickers.join(' ')}</div>
        <Picture url={letter.photo} />
        <Picture url={letter.gif} />
        {from && <div>— {from}</div>}
      </div>
      <p>
        <button className="btn" onClick={onClose}>Back to Volume {letter.vol}</button>
      </p>
    </div>
  )
}
