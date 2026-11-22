// A letter file looks like this:
//
//   title: Open when you miss me
//   card: pink
//   stickers: ❤️ 🌸
//   from: Om, Jinu        (optional, one or more names)
//   ---
//   The letter text...

export const pad2 = (n) => String(n).padStart(2, '0')

export const letterFileName = (vol, slot) => `vol${vol}-letter${pad2(slot)}.txt`

/** Turn the text of a letter file into a letter object, or null if it is not valid. */
export function parseLetter(text, vol, slot) {
  text = text.replace(/\r/g, '')
  const divider = /^---\s*$/m.exec(text)
  if (!divider) return null

  const head = {}
  text
    .slice(0, divider.index)
    .split('\n')
    .forEach((line) => {
      const i = line.indexOf(':')
      if (i > 0) head[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim()
    })

  return {
    vol,
    slot,
    title: head.title || `Letter ${slot}`,
    card: (head.card || 'pink').toLowerCase(),
    stickers: (head.stickers || '').split(/\s+/).filter(Boolean),
    photo: head.photo || '',
    gif: head.gif || '',
    authors: (head.from || '').split(',').map((s) => s.trim()).filter(Boolean),
    text: text.slice(divider.index + divider[0].length).trim(),
  }
}

/** "Om" -> "Om", ["Om", "Jinu"] -> "Om & Jinu", ["A", "B", "C"] -> "A, B & C" */
export function joinNames(names) {
  if (names.length <= 1) return names[0] || ''
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
}

/** The opposite of parseLetter: build the file text from the form fields. */
export function buildLetterFile({ title, authors, card, stickers, photo, gif, text }) {
  const head = [`title: ${title.trim()}`]
  const names = authors.split(',').map((s) => s.trim()).filter(Boolean)
  if (names.length) head.push(`from: ${names.join(', ')}`)
  head.push(`card: ${card}`)
  if (stickers.length) head.push(`stickers: ${stickers.join(' ')}`)
  if (photo.trim()) head.push(`photo: ${photo.trim()}`)
  if (gif.trim()) head.push(`gif: ${gif.trim()}`)
  return `${head.join('\n')}\n---\n${text.trim()}\n`
}
