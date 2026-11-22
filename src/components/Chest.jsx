import { images } from '../lib/images.js'

// Outline of each of the five books in the chest picture (1297 x 1213 pixels).
const BOOK_OUTLINES = [
  [[234, 270], [398, 268], [396, 762], [228, 760]],
  [[414, 272], [566, 270], [568, 762], [408, 760]],
  [[580, 272], [732, 270], [738, 762], [578, 760]],
  [[748, 272], [896, 270], [900, 762], [748, 762]],
  [[912, 272], [1068, 270], [1076, 762], [916, 760]],
]

/** The open chest. Each book glows and can be clicked to open that volume. */
export default function Chest({ unreadIn, onPickVolume }) {
  return (
    <div className="ch">
      <img src={images.chestOpen} alt="Open chest with five volumes" />
      <svg viewBox="0 0 1297 1213">
        <defs>
          <linearGradient id="sg">
            <stop offset="0" stopColor="#fff2c0" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff2c0" stopOpacity=".8" />
            <stop offset="1" stopColor="#fff2c0" stopOpacity="0" />
          </linearGradient>
        </defs>
        {BOOK_OUTLINES.map((outline, i) => {
          const vol = i + 1
          const pts = outline.map((p) => p.join(',')).join(' ')
          const xs = outline.map((p) => p[0])
          const minX = Math.min(...xs)
          const maxX = Math.max(...xs)
          const midX = (minX + maxX) / 2
          const delay = { animationDelay: `${i * 0.65}s` }
          const unread = unreadIn(vol)
          return (
            <g key={vol}>
              {/* shine that sweeps across the book */}
              <clipPath id={`c${i}`}><polygon points={pts} /></clipPath>
              <g clipPath={`url(#c${i})`}>
                <rect
                  className="sw" x={minX - 170} y="260" width="150" height="510" fill="url(#sg)"
                  style={{ '--d': `${maxX - minX + 340}px`, ...delay }}
                />
              </g>
              <polygon className="ed" points={pts} style={delay} />
              <polygon className="hit" points={pts} onClick={() => onPickVolume(vol)}>
                <title>Volume {vol}</title>
              </polygon>
              {unread > 0 && (
                <>
                  <circle cx={midX} cy="236" r="24" fill="#7a1f2b" stroke="#fff3e0" strokeWidth="3" />
                  <text x={midX} y="246" textAnchor="middle" fontSize="28" fontWeight="700" fill="#fff3e0" fontFamily="sans-serif">
                    {unread}
                  </text>
                </>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
