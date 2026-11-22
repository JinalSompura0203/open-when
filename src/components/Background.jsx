import { useEffect, useMemo, useState } from 'react'
import { images } from '../lib/images.js'
import '../styles/background.css'

// Positions (in image pixels) of the things that move on the two background pictures.
const LAYOUTS = {
  desktop: {
    w: 1920, h: 1080, img: images.backgroundDesktop,
    hearts: [[256, 283], [1599, 892]],
    stamp: [1420, 0, 250, 130],
    seal: [125, 0, 215, 110, 106, 5], // x, y, w, h, centreX, centreY
    nib: [1687, 283],
    clock: [150, 1088, 95], // centreX, centreY, hand length
  },
  mobile: {
    w: 1032, h: 1920, img: images.backgroundMobile,
    hearts: [[722, 255], [885, 1505]],
    stamp: [790, 10, 235, 310],
    seal: [40, 105, 225, 215, 110, 108],
    nib: [875, 589],
    clock: [128, 1838, 100],
  },
}

const pickMode = () =>
  innerWidth <= 900 || innerWidth / innerHeight < 1.1 ? 'mobile' : 'desktop'

/** Percent of the picture width / height. */
const pctW = (c, v) => `${(v / c.w) * 100}%`
const pctH = (c, v) => `${(v / c.h) * 100}%`

/** A small piece of the background picture, cut out so it can be animated. */
function Piece({ c, x, y, w, h, className, style }) {
  return (
    <div
      className={`sp ${className}`}
      style={{
        left: pctW(c, x),
        top: pctH(c, y),
        width: pctW(c, w),
        height: pctH(c, h),
        backgroundImage: `url(${c.img})`,
        backgroundSize: `${(c.w / w) * 100}% ${(c.h / h) * 100}%`,
        backgroundPosition: `${(x / (c.w - w)) * 100}% ${(y / (c.h - h)) * 100}%`,
        ...style,
      }}
    />
  )
}

/** Three random crack lines starting at the centre of the wax seal. */
function makeCracks(cx, cy) {
  return [0, 1, 2].map(() => {
    const a = Math.random() * 6.28
    const pts = [[cx, cy]]
    for (let j = 1; j <= 4; j++) {
      const r = j * 22 + Math.random() * 8
      const b = a + (Math.random() - 0.5) * 0.5
      pts.push([cx + Math.cos(b) * r, cy + Math.sin(b) * r])
    }
    return pts.map((p) => p.join(',')).join(' ')
  })
}

const CHIPS = [
  [-34, 70, -20, 50, '0s'],
  [10, 78, 14, 60, '.5s'],
  [40, 66, 26, 46, '1s'],
]

export default function Background() {
  const [mode, setMode] = useState(pickMode)
  const [size, setSize] = useState({ w: innerWidth, h: innerHeight })

  useEffect(() => {
    const onResize = () => {
      setMode(pickMode())
      setSize({ w: innerWidth, h: innerHeight })
    }
    addEventListener('resize', onResize)
    return () => removeEventListener('resize', onResize)
  }, [])

  const c = LAYOUTS[mode]
  const [sx, sy, sw, sh, cx, cy] = c.seal
  const cracks = useMemo(() => makeCracks(cx, cy), [cx, cy])

  // Cover the whole window, like background-size: cover.
  const scale = Math.max(size.w / c.w, size.h / c.h)
  const [nx, ny] = c.nib
  const [kx, ky, kl] = c.clock

  return (
    <div id="stage" style={{ width: c.w * scale, height: c.h * scale }}>
      <img className="bgi" src={c.img} alt="" />

      {c.hearts.map(([x, y], i) => (
        <Piece key={i} c={c} x={x - 65} y={y - 70} w={130} h={140} className={`heart ${i ? 'b' : ''}`} />
      ))}

      <Piece c={c} x={c.stamp[0]} y={c.stamp[1]} w={c.stamp[2]} h={c.stamp[3]} className="stamp" />

      <Piece
        c={c} x={sx} y={sy} w={sw} h={sh} className="seal"
        style={{ transformOrigin: `${(cx / sw) * 100}% ${(cy / sh) * 100}%` }}
      />
      <svg
        className="crk"
        viewBox={`0 0 ${sw} ${sh}`}
        style={{ left: pctW(c, sx), top: pctH(c, sy), width: pctW(c, sw), height: pctH(c, sh) }}
      >
        {cracks.map((pts, i) => <polyline key={i} points={pts} />)}
      </svg>
      {CHIPS.map(([dx, dy, x, y, delay], i) => (
        <i
          key={i}
          className="chip"
          style={{
            left: pctW(c, sx + cx + dx),
            top: pctH(c, sy + cy + dy),
            width: pctW(c, 9),
            height: pctH(c, 7),
            '--x': `${x}px`,
            '--y': `${y}px`,
            animationDelay: delay,
          }}
        />
      ))}

      <i className="ink" style={{ left: pctW(c, nx), top: pctH(c, ny), width: pctW(c, 15), '--fall': '560%' }} />
      <i className="dot" style={{ left: pctW(c, nx), top: pctH(c, ny + 92), width: pctW(c, 18) }} />

      <i
        className="hand"
        style={{ left: pctW(c, kx - 1.3), top: pctH(c, ky - kl), width: pctW(c, 2.6), height: pctH(c, kl) }}
      />
    </div>
  )
}
