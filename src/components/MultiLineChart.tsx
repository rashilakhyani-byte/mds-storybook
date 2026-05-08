import { useEffect, useRef, useState } from 'react'

export type Series = {
  key: string
  color: string
  label: string
}

type Datum = Record<string, number>

export function MultiLineChart({
  data,
  series,
  mode = 'breakdown',
  yMax = 1000,
  yTicks = [0, 250, 500, 750, 1000],
  xLabels,
  xLabelStep = 4,
  yUnit = 'ms',
  yAxisLabel,
}: {
  data: Datum[]
  series: Series[]
  mode?: 'breakdown' | 'trend'
  yMax?: number
  yTicks?: number[]
  xLabels: string[]
  xLabelStep?: number
  yUnit?: string
  yAxisLabel?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect
      setSize({ w: cr.width, h: cr.height })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  const padL = 48
  const padR = 16
  const padT = 12
  const padB = 28

  const w = size.w
  const h = size.h
  const innerW = Math.max(1, w - padL - padR)
  const innerH = Math.max(1, h - padT - padB)

  const xAt = (i: number) => padL + (innerW * i) / Math.max(1, data.length - 1)
  const yAt = (v: number) => padT + innerH - (innerH * v) / yMax

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!data.length) return
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    if (mx < padL || mx > padL + innerW) return setHover(null)
    const ratio = (mx - padL) / innerW
    const i = Math.round(ratio * (data.length - 1))
    setHover({ i, x: mx, y: my })
  }

  return (
    <div ref={ref} className="relative h-full w-full">
      {w > 0 && h > 0 && (
        <svg width={w} height={h} className="block" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={padL} x2={w - padR} y1={yAt(t)} y2={yAt(t)} stroke="#eef1f6" />
              <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fontSize="11" fill="#626978">{t}</text>
            </g>
          ))}
          {yAxisLabel && (
            <text
              x={12}
              y={padT + innerH / 2}
              fontSize="10"
              fill="#626978"
              textAnchor="middle"
              transform={`rotate(-90, 12, ${padT + innerH / 2})`}
            >
              {yAxisLabel}
            </text>
          )}
          {xLabels.map((lab, idx) => {
            const i = idx * xLabelStep
            if (i >= data.length) return null
            return (
              <text key={lab + idx} x={xAt(i)} y={h - 8} textAnchor="middle" fontSize="11" fill="#626978">{lab}</text>
            )
          })}

          {series.map((s) => {
            const path = data
              .map((d, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(2)},${yAt(d[s.key] ?? 0).toFixed(2)}`)
              .join(' ')
            const last = data.length - 1
            const area = `${path} L${xAt(last).toFixed(2)},${(padT + innerH).toFixed(2)} L${xAt(0).toFixed(2)},${(padT + innerH).toFixed(2)} Z`
            const gid = `mlc-grad-${s.key}-${s.color.replace('#', '')}`
            return (
              <g key={s.key}>
                {mode === 'breakdown' && (
                  <>
                    <defs>
                      <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={s.color} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <path d={area} fill={`url(#${gid})`} />
                  </>
                )}
                <path d={path} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              </g>
            )
          })}

          {hover && (
            <line x1={xAt(hover.i)} x2={xAt(hover.i)} y1={padT} y2={padT + innerH} stroke="#c4c7cf" strokeDasharray="3 3" />
          )}
          {hover && series.map((s) => (
            <circle key={s.key} cx={xAt(hover.i)} cy={yAt(data[hover.i][s.key] ?? 0)} r={3} fill={s.color} stroke="#fff" strokeWidth={1.5} />
          ))}
        </svg>
      )}
      {hover && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border border-stroke-subsection bg-white px-2.5 py-1.5 shadow-md"
          style={{ left: Math.min(hover.x + 10, w - 180), top: Math.max(8, hover.y - 60) }}
        >
          <div className="text-[11px] font-medium text-text-subdued">{xLabels[Math.min(xLabels.length - 1, Math.floor(hover.i / xLabelStep))]}</div>
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-2 text-[12px]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
              <span className="text-text-default">{s.label}: {Math.round(data[hover.i][s.key] ?? 0)}{yUnit}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
