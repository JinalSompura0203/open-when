import { parseLetter } from './letterFormat.js'
import { VOLUME_COUNT, LETTERS_PER_VOLUME } from './constants.js'

// Vite reads every file in the /letters folder when the site is built,
// so adding a letter file is all that is needed to show a new letter.
const files = import.meta.glob('../../letters/vol*-letter*.txt', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export const letters = Object.entries(files)
  .map(([path, text]) => {
    const m = /vol(\d+)-letter(\d+)\.txt$/.exec(path)
    if (!m) return null
    const vol = Number(m[1])
    const slot = Number(m[2])
    if (vol < 1 || vol > VOLUME_COUNT || slot < 1 || slot > LETTERS_PER_VOLUME) return null
    return parseLetter(text, vol, slot)
  })
  .filter(Boolean)

export const letterKey = (l) => `${l.vol}-${l.slot}`

export const findLetter = (vol, slot) => letters.find((l) => l.vol === vol && l.slot === slot)
