import { useEffect, useRef, useState } from 'react'

export function MiniLineChart({ data, color }: { data: { x: number; y: number }[]; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect
      setSize({ w: cr.width, h: cr.height })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  const id = `grad-${color.replace('#', '')}`
  const w = size.w
  const h = size.h

  let path = ''
  let area = ''
  if (w > 0 && h > 0 && data.length > 1) {
    const ys = data.map((d) => d.y)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const span = Math.max(1, maxY - minY)
    const top = 4
    const usableH = Math.max(1, h - top)
    const stepX = w / (data.length - 1)
    const points = data.map((d, i) => {
      const x = i * stepX
      const y = top + (1 - (d.y - minY) / span) * usableH
      return [x, y] as const
    })
    path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
    const first = points[0]
    const last = points[points.length - 1]
    area = `M${first[0].toFixed(2)},${h} L${path.slice(1)} L${last[0].toFixed(2)},${h} Z`
  }

  return (
    <div ref={ref} className="h-full w-full">
      {w > 0 && h > 0 && (
        <svg width={w} height={h} className="block">
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {area && <path d={area} fill={`url(#${id})`} />}
          {path && <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />}
        </svg>
      )}
    </div>
  )
}
