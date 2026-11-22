import { useState } from 'react'
import { images } from '../lib/images.js'
import { rnd } from '../lib/random.js'

const PETAL_COLOURS = ['#e98ab3', '#f2b6cf', '#a07ad8', '#c9b0ef', '#fff1d6', '#b32a45']

/** The flowers on the envelope, cut into small tiles that fly away. */
function makeFlowerTiles() {
  const cols = 24, rows = 14, w = 76 / cols, h = 47 / rows
  const tiles = []
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = 14 + i * w, y = 3 + j * h
      tiles.push({
        left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`,
        backgroundSize: `${10000 / w}% ${10000 / h}%`,
        backgroundPosition: `${(x / (100 - w)) * 100}% ${(y / (100 - h)) * 100}%`,
        '--dx': `${rnd(-1, 1) * 230 + (x - 50) * 6}px`,
        '--dy': `${rnd(-70, 430)}px`,
        '--r': `${rnd(-320, 320)}deg`,
        '--d': rnd(0, 420),
      })
    }
  }
  return tiles
}

/** The wax seal, cut into 5 random shards that fall down. */
function makeSealShards() {
  const N = 5, cx = 50.1, cy = 58.4, rx = 15, ry = 18.6
  const offset = Math.random() * 6.28
  const angles = Array.from({ length: N }, (_, k) => offset + (k / N) * 6.283 + rnd(-0.2, 0.2))
  angles.push(angles[0] + 6.283)

  const mid = angles.map((a) => [cx + Math.cos(a) * rx * 0.5 + rnd(-1.2, 1.2), cy + Math.sin(a) * ry * 0.5 + rnd(-1.5, 1.5)])
  const out = angles.map((a) => [cx + Math.cos(a) * rx * 1.1, cy + Math.sin(a) * ry * 1.1])
  mid[N] = mid[0]
  out[N] = out[0]

  return Array.from({ length: N }, (_, k) => {
    const arc = [1, 2, 3].map((q) => {
      const a = angles[k] + ((angles[k + 1] - angles[k]) * q) / 4
      return [cx + Math.cos(a) * rx * 1.1, cy + Math.sin(a) * ry * 1.1]
    })
    const poly = [[cx, cy], mid[k], out[k], ...arc, out[k + 1], mid[k + 1]]
      .map((p) => `${p[0].toFixed(1)}% ${p[1].toFixed(1)}%`)
      .join(',')
    const middleAngle = (angles[k] + angles[k + 1]) / 2
    return {
      '--cp': `polygon(${poly})`,
      '--dx': `${Math.cos(middleAngle) * rnd(40, 110)}px`,
      '--dy': `${rnd(150, 330)}px`,
      '--r': `${rnd(-60, 60)}deg`,
    }
  })
}

/** Small crumbs of wax. */
function makeCrumbs() {
  return Array.from({ length: 16 }, () => {
    const s = rnd(6, 15)
    return {
      width: `${s}px`, height: `${s * 0.8}px`,
      '--dx': `${rnd(-170, 170)}px`, '--dy': `${rnd(120, 330)}px`, '--r': `${rnd(-200, 200)}deg`,
    }
  })
}

/** Petals that drift out of the envelope. */
function makePetals() {
  return Array.from({ length: 46 }, (_, i) => ({
    '--c': PETAL_COLOURS[i % PETAL_COLOURS.length],
    marginLeft: `${rnd(-30, 30)}%`,
    '--dx': `${rnd(-300, 300)}px`, '--dy': `${rnd(-120, 380)}px`,
    '--r': `${rnd(-360, 360)}deg`, '--d': rnd(0, 900),
  }))
}

/** All the random pieces, made once per opened letter. */
const makePieces = () => ({
  tiles: makeFlowerTiles(),
  shards: makeSealShards(),
  crumbs: makeCrumbs(),
  petals: makePetals(),
})

export default function SealedEnvelope({ phase, onBreakSeal }) {
  const [pieces] = useState(makePieces)
  const cls = phase === 'crack' ? 'crack' : phase === 'go' ? 'crack go' : ''

  return (
    <div className="wrap">
      <div className={`E ${cls}`} style={{ '--fl': `url(${images.envelopeFlowers})` }}>
        <img src={images.envelope} alt="" />
        <div className="tiles">
          {pieces.tiles.map((style, i) => <div key={i} className="t" style={style} />)}
        </div>
        <img className="th tl" src={images.twineLeft} alt="" />
        <img className="th tr" src={images.twineRight} alt="" />
        {pieces.shards.map((style, i) => <img key={i} className="sh" src={images.waxSeal} alt="" style={style} />)}
        {pieces.crumbs.map((style, i) => <i key={i} className="cr" style={style} />)}
        {pieces.petals.map((style, i) => <i key={i} className="pt" style={style} />)}
        <button className="seal-btn" aria-label="Break the seal" onClick={onBreakSeal} />
      </div>
      <p className="hint">Tap the seal to break it</p>
    </div>
  )
}
