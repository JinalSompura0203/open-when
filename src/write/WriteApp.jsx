import { useState } from 'react'
import settings from '../../settings.js'
import { CARD_COLOURS, LETTERS_PER_VOLUME, MAX_WORDS, STICKERS, VOLUME_COUNT } from '../lib/constants.js'
import { buildLetterFile, letterFileName } from '../lib/letterFormat.js'

const countWords = (text) => (text.trim().match(/\S+/g) || []).length

/**
 * A form to write a new letter. It makes the letter file and either
 * opens GitHub ready to save it, or downloads it.
 */
export default function WriteApp() {
  const [title, setTitle] = useState('')
  const [authors, setAuthors] = useState('')
  const [vol, setVol] = useState(1)
  const [slot, setSlot] = useState(1)
  const [card, setCard] = useState('pink')
  const [text, setText] = useState('')
  const [stickers, setStickers] = useState([])
  const [photo, setPhoto] = useState('')
  const [gif, setGif] = useState('')

  const words = countWords(text)
  const tooLong = words > MAX_WORDS
  const ready = words > 0 && !tooLong && title.trim() !== ''

  const repo = (settings.repo || '').trim()
  const hasRepo = repo !== '' && !/YOURUSERNAME/.test(repo)

  const fileName = letterFileName(vol, slot)
  const fileText = buildLetterFile({ title, authors, card, stickers, photo, gif, text })
  const githubUrl = hasRepo
    ? `https://github.com/${repo}/new/main?filename=${encodeURIComponent('letters/' + fileName)}&value=${encodeURIComponent(fileText)}`
    : '#'

  const toggleSticker = (s) =>
    setStickers((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  const download = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([fileText], { type: 'text/plain' }))
    a.download = fileName
    a.click()
  }

  let hint
  if (tooLong) hint = `Please shorten the letter to ${MAX_WORDS} words or fewer.`
  else if (!ready) hint = 'Add a title and write your letter.'
  else if (!hasRepo) hint = 'To use the first button, put your GitHub username and repository name in settings.js (repo).'
  else hint = `GitHub opens with your letter ready. Just click “Commit changes” there. It will be saved as ${fileName}.`

  return (
    <main>
      <h1>Write a letter</h1>

      <label htmlFor="ti">Title</label>
      <input id="ti" maxLength={60} placeholder="Open when you miss me" value={title} onChange={(e) => setTitle(e.target.value)} />

      <label htmlFor="fr">
        From <span className="normal">(for more than one person, separate names with commas)</span>
      </label>
      <input id="fr" placeholder={settings.from || 'Your name'} value={authors} onChange={(e) => setAuthors(e.target.value)} />

      <div className="row">
        <div>
          <label htmlFor="vo">Volume</label>
          <select id="vo" value={vol} onChange={(e) => setVol(Number(e.target.value))}>
            {Array.from({ length: VOLUME_COUNT }, (_, i) => (
              <option key={i} value={i + 1}>Volume {i + 1}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="no">Letter number</label>
          <select id="no" value={slot} onChange={(e) => setSlot(Number(e.target.value))}>
            {Array.from({ length: LETTERS_PER_VOLUME }, (_, i) => (
              <option key={i} value={i + 1}>Letter {i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      <label>Card colour</label>
      <div className="cards">
        {Object.entries(CARD_COLOURS).map(([name, colour]) => (
          <button key={name} type="button" className={name === card ? 'on' : ''} style={{ background: colour }} onClick={() => setCard(name)}>
            {name}
          </button>
        ))}
      </div>

      <label htmlFor="tx">
        Your letter <span className="normal">(up to {MAX_WORDS} words)</span>
      </label>
      <textarea id="tx" placeholder="Write here…" value={text} onChange={(e) => setText(e.target.value)} />
      <div className={`count ${tooLong ? 'bad' : ''}`}>{words} / {MAX_WORDS} words</div>

      <label>Stickers (optional)</label>
      <div className="emo">
        {STICKERS.map((s) => (
          <button key={s} type="button" className={stickers.includes(s) ? 'on' : ''} onClick={() => toggleSticker(s)}>
            {s}
          </button>
        ))}
      </div>

      <details>
        <summary>Add a photo or GIF link (optional)</summary>
        <label htmlFor="ph">Photo link (https://…)</label>
        <input id="ph" value={photo} onChange={(e) => setPhoto(e.target.value)} />
        <label htmlFor="gf">GIF link (https://…)</label>
        <input id="gf" value={gif} onChange={(e) => setGif(e.target.value)} />
      </details>

      <a className={`btn ${ready && hasRepo ? '' : 'off'}`} href={githubUrl} target="_blank" rel="noopener noreferrer">
        Send this letter to the website
      </a>
      <button className="btn alt" type="button" disabled={!ready} onClick={download}>
        Or download the letter file
      </button>
      <small>{hint}</small>
      <small><a href="index.html">← Back to the website</a></small>
    </main>
  )
}
