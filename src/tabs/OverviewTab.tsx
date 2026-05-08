import { useState, useRef, useEffect } from 'react'
import { ChartBar, Cursor, SquaresFour, Globe, Warning, CaretRight, CaretDown } from '@phosphor-icons/react'
import { SubToggle } from '../components/SubToggle'
import { MiniLineChart } from '../components/MiniLineChart'
import { WorldMap } from '../components/WorldMap'
import { overviewCountries } from '../data/countries'

type Props = Record<string, never>

// ─── bar chart data ───────────────────────────────────────────────────────────
const BAR_DATES = [
  'Jul 31','Jan 2','Jan 3','Jan 4','Jan 5','Jan 6','Jan 7','Jan 8','Jan 9','Jan 10',
  'Jan 11','Jan 12','Jan 13','Jan 14','Jan 15','Jan 16','Jan 17','Jan 18','Jan 19','Jan 20',
  'Jan 21','Jan 22','Jan 23','Jan 24','Jan 25','Jan 26','Jan 27','Jan 28','Dec 29','Jan 30',
]
const BAR_DATA = [
  {t:158,e:109,i:43},{t:109,e:30,i:88},{t:99,e:48,i:59},{t:80,e:48,i:59},{t:121,e:95,i:27},
  {t:95,e:48,i:59},{t:80,e:48,i:59},{t:95,e:48,i:59},{t:80,e:48,i:59},{t:99,e:48,i:59},
  {t:158,e:109,i:43},{t:95,e:48,i:59},{t:80,e:48,i:59},{t:80,e:48,i:59},{t:95,e:48,i:59},
  {t:80,e:48,i:59},{t:80,e:48,i:59},{t:95,e:48,i:59},{t:95,e:48,i:59},{t:80,e:48,i:59},
  {t:80,e:48,i:59},{t:80,e:48,i:59},{t:95,e:48,i:59},{t:158,e:109,i:43},{t:80,e:48,i:59},
  {t:80,e:48,i:59},{t:95,e:48,i:59},{t:80,e:48,i:59},{t:95,e:48,i:59},{t:80,e:48,i:59},
]

// ─── sources data ─────────────────────────────────────────────────────────────
const SOURCES = [
  { name: 'example.com',           fillPct: 88, data: mkSpk(0) },
  { name: 'api.postman.com',        fillPct: 72, data: mkSpk(1) },
  { name: 'api.stripe.com',         fillPct: 63, data: mkSpk(2) },
  { name: 'graph.facebook.com',     fillPct: 55, data: mkSpk(3) },
  { name: 'api.github.com',         fillPct: 47, data: mkSpk(4) },
  { name: 'api.twilio.com',         fillPct: 40, data: mkSpk(5) },
  { name: 'analytics.google.com',   fillPct: 34, data: mkSpk(6) },
  { name: 'payment.braintree.com',  fillPct: 28, data: mkSpk(7) },
]
function mkSpk(seed: number) {
  return Array.from({ length: 20 }, (_, i) => ({
    x: i,
    y: 48 + Math.sin(i * 0.5 + seed) * 8 + Math.cos(i * 0.3 + seed * 1.3) * 4,
  }))
}

// ─── status codes ─────────────────────────────────────────────────────────────
const STATUS_CODES = [
  { code: '101', label: 'Switching Protocals',    pct: 6,  count: '30k',  color: '#94a3b8' },
  { code: '200', label: 'OK',                     pct: 35, count: '175k', color: '#67cba2' },
  { code: '304', label: 'Not Modified',           pct: 14, count: '70k',  color: '#1c8cfd' },
  { code: '400', label: 'Bad Request',            pct: 18, count: '90k',  color: '#f97316' },
  { code: '404', label: 'Not Found',              pct: 15, count: '75k',  color: '#ff7c65' },
  { code: '500', label: 'Internal Server Error',  pct: 9,  count: '45k',  color: '#d31510' },
  { code: '503', label: 'Service Unavailable',    pct: 3,  count: '15k',  color: '#9b1515' },
]

// ─── donut segments ───────────────────────────────────────────────────────────
const DONUT_SEGS = [
  { label: 'SOAP',    pct: 0.20, color: '#fbbf24' },
  { label: 'REST',    pct: 0.50, color: '#4ade80' },
  { label: 'GRAPHQL', pct: 0.30, color: '#f0abfc' },
]

// ─── geo-location ─────────────────────────────────────────────────────────────
const FLAGS: Record<string, string> = {
  France: '🇫🇷', Israel: '🇮🇱', Mexico: '🇲🇽', 'Sri Lanka': '🇱🇰',
  'United Kingdom': '🇬🇧', 'South Africa': '🇿🇦', Brazil: '🇧🇷',
}
const geoList = overviewCountries
  .filter((c) => !c.unsecure && c.unsecurePct !== undefined)
  .sort((a, b) => b.transactions - a.transactions)
  .slice(0, 7)
const geoMax = Math.max(...geoList.map((c) => c.transactions))

// ─── main component ───────────────────────────────────────────────────────────
export function OverviewTab(_: Props) {
  const [viewBy, setViewBy] = useState<'Internal - External' | 'Success - Error'>('Internal - External')
  const [chartMode, setChartMode] = useState<'breakdown' | 'trend'>('breakdown')
  const [sourceView, setSourceView] = useState<'Domains' | 'IP Address'>('Domains')
  const [showVBDropdown, setShowVBDropdown] = useState(false)
  const [showSourceDropdown, setShowSourceDropdown] = useState(false)
  const [checked, setChecked] = useState({ total: true, external: true, internal: true })

  return (
    <div className="flex flex-col gap-4">
      {/* row 1 — left: failing apis + traffic by type | right: traffic distribution */}
      <div className="flex gap-4">
        {/* left column — stretches to match right height */}
        <div className="flex w-[300px] shrink-0 flex-col gap-3">
          {/* failing apis */}
          <div className="flex h-[72px] shrink-0 items-center justify-between rounded-lg border border-stroke-subsection bg-white px-4">
            <div className="flex flex-col">
              <div className="text-[28px] font-bold leading-8 text-text-default">132</div>
              <div className="text-[12px] font-medium text-text-subdued">Failing APIs</div>
            </div>
            <button className="flex h-[26px] items-center gap-0.5 rounded border border-stroke-subsection bg-white px-2.5 text-[12px] font-medium text-text-default shadow-[0_1px_0_rgba(27,31,35,0.04)] hover:bg-surface-hover">
              View <CaretRight size={13} className="text-text-subtle" />
            </button>
          </div>

          {/* traffic by type — flex-1 to fill remaining height */}
          <div className="flex flex-1 flex-col rounded-lg border border-stroke-subsection bg-white">
            <div className="flex shrink-0 items-center border-b border-stroke-subsection px-4 py-2">
              <div className="flex items-center gap-1.5">
                <SquaresFour size={24} className="text-[#626978]" />
                <span className="text-[14px] font-semibold leading-[20px] text-[#626978]">Traffic by Type</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
              <SemiDonut />
              <div className="flex items-center justify-center gap-5">
                {DONUT_SEGS.map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-[11px] font-medium text-text-subdued">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* right — traffic distribution */}
        <div className="min-w-0 flex-1 rounded-lg border border-stroke-subsection bg-white">
          <div className="flex h-10 items-center justify-between border-b border-stroke-subsection px-4">
            <div className="flex items-center gap-1.5">
              <ChartBar size={16} className="text-text-subtle" />
              <span className="text-[14px] font-semibold text-text-subdued">Traffic Distribution</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowVBDropdown((o) => !o)}
                  className="flex h-[29px] items-center gap-1 rounded border border-stroke-subsection bg-white px-2 text-[11px] font-medium text-text-default hover:bg-surface-hover"
                >
                  <span className="font-normal text-text-subdued">View by</span>
                  <span className="ml-0.5 text-[13px]">{viewBy}</span>
                  <CaretDown size={12} className="ml-0.5 text-text-subdued" />
                </button>
                {showVBDropdown && (
                  <div className="absolute right-0 top-8 z-20 min-w-[200px] overflow-hidden rounded-md border border-stroke-subsection bg-white shadow-md">
                    {(['Internal - External', 'Success - Error'] as const).map((v) => (
                      <button key={v} onClick={() => { setViewBy(v); setShowVBDropdown(false) }}
                        className={`block w-full px-3 py-1.5 text-left text-[12px] font-medium hover:bg-surface-hover ${v === viewBy ? 'text-blue-dark' : 'text-text-default'}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <SubToggle size="sm" value={chartMode} onChange={setChartMode}
                options={[{ value: 'breakdown', label: 'Breakdown' }, { value: 'trend', label: 'Trend' }]} />
            </div>
          </div>
          <div className="p-4 pb-3">
            <TrafficBarChart data={BAR_DATA} dates={BAR_DATES} checked={checked} chartMode={chartMode} />
            <div className="mt-3 flex items-center justify-center gap-6">
              {([
                { key: 'total' as const,    label: 'Total',    color: '#008ff8' },
                { key: 'external' as const, label: 'External', color: '#78bbfa' },
                { key: 'internal' as const, label: 'Internal', color: '#cae8ff' },
              ]).map((s) => (
                <button key={s.key} onClick={() => setChecked((c) => ({ ...c, [s.key]: !c[s.key] }))}
                  className="flex items-center gap-1.5">
                  <span className="flex h-3 w-3 items-center justify-center rounded-[2px]"
                    style={{ background: checked[s.key] ? '#0054b6' : 'transparent', border: checked[s.key] ? 'none' : '1px solid #a5adbd' }}>
                    {checked[s.key] && (
                      <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4l1.8 1.8L6.5 2" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </span>
                  <span className="h-[14px] w-[3px] rounded-[1px]" style={{ background: s.color }} />
                  <span className="text-[12px] font-semibold text-[#40444c]">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* row 2 — sources + status code breakup (same height via items-stretch default) */}
      <div className="flex gap-4">
        {/* sources */}
        <div className="flex w-[740px] shrink-0 flex-col rounded-lg border border-stroke-subsection bg-white">
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-stroke-subsection px-4">
            <div className="flex items-center gap-1.5">
              <Cursor size={14} className="text-[#626978]" />
              <span className="text-[13px] font-semibold text-[#626978]">Sources</span>
            </div>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowSourceDropdown((o) => !o)} className="flex h-6 items-center gap-1 text-[11px]">
                <span className="font-normal text-text-subdued">View by</span>
                <span className="ml-0.5 font-semibold text-text-default">{sourceView}</span>
                <CaretDown size={11} className="text-text-subdued" />
              </button>
              {showSourceDropdown && (
                <div className="absolute right-0 top-7 z-20 min-w-[140px] overflow-hidden rounded-md border border-stroke-subsection bg-white shadow-md">
                  {(['Domains', 'IP Address'] as const).map((v) => (
                    <button key={v} onClick={() => { setSourceView(v); setShowSourceDropdown(false) }}
                      className={`block w-full px-3 py-1.5 text-left text-[12px] font-medium hover:bg-surface-hover ${v === sourceView ? 'text-blue-dark' : 'text-text-default'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            {SOURCES.map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-1 hover:bg-surface-hover">
                <div className="w-[130px] shrink-0 text-[12px] font-medium text-text-default">{s.name}</div>
                <div className="min-w-0 flex-1"><SegmentedBarLong fillPct={s.fillPct} /></div>
                <div className="h-7 w-20 shrink-0"><MiniLineChart data={s.data} color="#1c8cfd" /></div>
              </div>
            ))}
            {/* x-axis */}
            <div className="flex items-center gap-3 px-4 pb-2 pt-1">
              <div className="w-[130px] shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="mb-1 h-px bg-stroke-subsection" />
                <div className="flex justify-between">
                  {['0', '4.5K', '7.5K', '10.5K', '13.5K'].map((label) => (
                    <span key={label} className="text-[10px] font-['JetBrains_Mono',monospace] text-text-subdued">{label}</span>
                  ))}
                </div>
              </div>
              <div className="w-20 shrink-0" />
            </div>
          </div>
        </div>

        {/* status code breakup — flex-1 takes remaining space */}
        <div className="flex min-w-0 flex-1 flex-col rounded-lg border border-stroke-subsection bg-white">
          <div className="flex h-10 shrink-0 items-center border-b border-stroke-subsection px-4">
            <div className="flex items-center gap-1.5">
              <Globe size={14} className="text-[#626978]" strokeWidth={1.8} />
              <span className="text-[13px] font-semibold text-[#626978]">Status Code Breakup</span>
            </div>
          </div>
          {/* alert banner */}
          <div className="mx-4 mt-3 flex shrink-0 items-center justify-between rounded border border-stroke-subsection bg-surface-l2 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Warning size={13} className="shrink-0 text-orange-default" />
              <span className="text-[12px] font-medium text-text-default">~45% of requests are failing (4xx + 5xx)</span>
            </div>
            <button className="flex items-center gap-0.5 text-[12px] font-medium text-text-default hover:text-blue-dark">
              View <CaretRight size={13} />
            </button>
          </div>
          {/* donut LEFT, list RIGHT */}
          <div className="flex flex-1 items-center gap-8 px-4 py-3">
            <div className="shrink-0">
              <StatusDonut codes={STATUS_CODES} />
            </div>
            <div className="flex w-[300px] shrink-0 flex-col">
              {STATUS_CODES.map((s) => (
                <div key={s.code} className="flex items-center gap-2 py-1">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                  <span className="w-7 shrink-0 text-[11px] font-semibold text-text-subdued">{s.code}</span>
                  <span className="flex-1 text-[12px] font-medium text-text-default">{s.label}</span>
                  <span className="w-7 text-right text-[12px] font-medium text-text-subdued">{s.pct}%</span>
                  <span className="w-9 text-right text-[12px] font-semibold text-text-default">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* row 3 — geo-location */}
      <div className="rounded-lg border border-stroke-subsection bg-white">
        <div className="flex h-9 items-center border-b border-stroke-subsection px-3">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-text-default">
            <Globe size={14} className="text-text-subtle" strokeWidth={1.8} />
            Geo-Location
          </div>
        </div>
        {/* alert — padded, not edge-to-edge */}
        <div className="mx-4 my-3 flex items-center justify-between rounded-md border border-stroke-subsection bg-surface-l2 px-3 py-2">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-text-default">
            <Warning size={13} className="text-orange-default" />
            <span className="font-semibold">3 countries</span>
            <span className="text-text-subdued">causing 28% of failures</span>
          </div>
          <button className="flex items-center gap-0.5 text-[12px] font-medium text-text-default hover:text-blue-dark">
            View <CaretRight size={13} />
          </button>
        </div>
        {/* map + country list card */}
        <div className="grid grid-cols-[1fr_360px] items-stretch gap-3 px-4 pb-4">
          <WorldMap data={overviewCountries} showUnsecure tooltipKind="transactions" />
          <div className="overflow-hidden rounded-lg border border-stroke-subsection bg-white shadow-[0_2px_8px_rgba(9,30,66,0.10),0_0_1px_rgba(9,30,66,0.08)]">
            {geoList.map((c) => {
              const pct = c.unsecurePct ?? Math.round((c.transactions / geoMax) * 100)
              const k = c.transactions >= 1000 ? `${Math.round(c.transactions / 1000)}k` : String(c.transactions)
              return (
                <div key={c.name} className="flex items-center gap-3 border-b border-stroke-subsection px-4 py-3 last:border-b-0 hover:bg-surface-hover">
                  <span className="text-[16px] leading-none">{FLAGS[c.name] ?? '🏳️'}</span>
                  <div className="flex-1 text-[13px] font-medium text-text-default">{c.name}</div>
                  <div className="text-right text-[12px] font-medium text-text-subtle">{pct}%</div>
                  <div className="w-10 text-right text-[13px] font-semibold text-text-default">{k}</div>
                  <GeoBar pct={pct} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SemiDonut ────────────────────────────────────────────────────────────────
function SemiDonut() {
  const W = 182, H = 90
  const cx = W / 2, cy = H
  const outerR = 84, innerR = 74
  const midR = (outerR + innerR) / 2   // 79 — arc center radius
  const strokeW = outerR - innerR       // 10 — thin stroke

  function arcD(startAngle: number, endAngle: number) {
    const r1 = (startAngle - 90) * (Math.PI / 180)
    const r2 = (endAngle - 90) * (Math.PI / 180)
    const x1 = cx + midR * Math.cos(r1), y1 = cy + midR * Math.sin(r1)
    const x2 = cx + midR * Math.cos(r2), y2 = cy + midR * Math.sin(r2)
    const large = endAngle - startAngle > 180 ? 1 : 0
    return `M${x1},${y1} A${midR},${midR} 0 ${large},1 ${x2},${y2}`
  }

  const GAP = 6
  let angle = 270
  const segs = DONUT_SEGS.map((s) => {
    const span = s.pct * 180
    const start = angle + GAP / 2
    const end = angle + span - GAP / 2
    angle += span
    return { ...s, d: arcD(start, end) }
  })

  return (
    <div style={{ width: W, height: H }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        {segs.map((s) => (
          <path key={s.label} d={s.d} fill="none" stroke={s.color} strokeWidth={strokeW} strokeLinecap="round" />
        ))}
        <text x={cx} y={68} textAnchor="middle" fontSize="22" fontWeight="700" fontFamily="'JetBrains Mono',monospace" fill="#191b23">145k</text>
        <text x={cx} y={84} textAnchor="middle" fontSize="12" fontFamily="Inter,sans-serif" fill="#6c6e79">Total Traffic</text>
      </svg>
    </div>
  )
}

// ─── StatusDonut — stroke-based thin arcs ─────────────────────────────────────
function StatusDonut({ codes }: { codes: typeof STATUS_CODES }) {
  const SIZE = 200, cx = SIZE / 2, cy = SIZE / 2
  const midR = 80, strokeW = 12
  const GAP = 2
  const total = codes.reduce((s, c) => s + c.pct, 0)

  function arcPath(startDeg: number, endDeg: number) {
    const toRad = (d: number) => (d - 90) * (Math.PI / 180)
    const x1 = cx + midR * Math.cos(toRad(startDeg))
    const y1 = cy + midR * Math.sin(toRad(startDeg))
    const x2 = cx + midR * Math.cos(toRad(endDeg))
    const y2 = cy + midR * Math.sin(toRad(endDeg))
    const large = endDeg - startDeg > 180 ? 1 : 0
    return `M${x1},${y1} A${midR},${midR} 0 ${large},1 ${x2},${y2}`
  }

  let angle = 0
  const segs = codes.map((c) => {
    const span = (c.pct / total) * 360
    const start = angle + GAP / 2
    const end = angle + span - GAP / 2
    angle += span
    return { ...c, d: arcPath(start, end) }
  })

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ overflow: 'visible' }}>
      {segs.map((s) => (
        <path key={s.code} d={s.d} fill="none" stroke={s.color} strokeWidth={strokeW} strokeLinecap="round" />
      ))}
      <text x={cx} y={cy - 6}  textAnchor="middle" fontSize="22" fontWeight="700" fontFamily="'JetBrains Mono',monospace" fill="#202124">45%</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="12" fontFamily="Inter,sans-serif" fill="#626978">Error Rate</text>
    </svg>
  )
}

// ─── TrafficBarChart ──────────────────────────────────────────────────────────
function roundedTopBar(x: number, y: number, w: number, h: number, r: number): string {
  if (h <= 0) return ''
  const rr = Math.min(r, h, w / 2)
  return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`
}

function smoothLinePath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return ''
  return pts.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x},${p.y}`
    const prev = pts[i - 1]
    const cpx = (prev.x + p.x) / 2
    return `${acc} C${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`
  }, '')
}

function TrafficBarChart({
  data, dates, checked, chartMode,
}: {
  data: typeof BAR_DATA
  dates: string[]
  checked: { total: boolean; external: boolean; internal: boolean }
  chartMode: 'breakdown' | 'trend'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  const H = 240, padL = 44, padR = 8, padT = 8, padB = 56
  const chartW = Math.max(1, w - padL - padR)
  const chartH = H - padT - padB
  const maxPx = 158
  const yTicks = [{ label: '200M', frac: 1 }, { label: '150M', frac: 0.75 }, { label: '25M', frac: 0.125 }, { label: '0', frac: 0 }]
  const groupW = chartW / data.length
  const barW = Math.max(3, groupW * 0.22)
  const barGap = Math.max(1, groupW * 0.04)
  const groupPad = (groupW - 3 * barW - 2 * barGap) / 2
  const scaleH = (px: number) => (px / maxPx) * chartH
  const scaleY = (px: number) => padT + chartH - scaleH(px)
  const groupCx = (i: number) => padL + i * groupW + groupW / 2

  const LINES = [
    { key: 'total' as const,    color: '#008ff8', width: 2 },
    { key: 'external' as const, color: '#78bbfa', width: 1.5 },
    { key: 'internal' as const, color: '#cae8ff', width: 1.5 },
  ]

  return (
    <div ref={ref} style={{ height: H }}>
      {w > 0 && (
        <svg width={w} height={H} className="block">
          {/* y-axis grid + labels */}
          {yTicks.map(({ label, frac }) => {
            const y = padT + chartH - frac * chartH
            return (
              <g key={label}>
                <line x1={padL} x2={w - padR} y1={y} y2={y} stroke={frac === 0 ? '#c4c7cf' : '#e0e1e9'} strokeDasharray={frac === 0 ? undefined : '3 3'} />
                <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#6c6e79" fontFamily="'JetBrains Mono',monospace">{label}</text>
              </g>
            )
          })}
          <text x={12} y={padT + chartH / 2} fontSize="10" fill="#626978" textAnchor="middle" transform={`rotate(-90 12 ${padT + chartH / 2})`}>Traffic</text>

          {/* bars or lines */}
          {chartMode === 'breakdown'
            ? data.map((d, gi) => {
                const gx = padL + gi * groupW + groupPad
                const bY = padT + chartH
                const bars = [
                  { h: scaleH(d.t), color: '#008ff8', show: checked.total },
                  { h: scaleH(d.e), color: '#78bbfa', show: checked.external },
                  { h: scaleH(d.i), color: '#cae8ff', show: checked.internal },
                ]
                return (
                  <g key={gi}>
                    {bars.map((b, bi) => b.show && b.h > 0 ? (
                      <path key={bi} d={roundedTopBar(gx + bi * (barW + barGap), bY - b.h, barW, b.h, Math.min(barW / 2, 3))} fill={b.color} />
                    ) : null)}
                  </g>
                )
              })
            : LINES.map((line) => {
                if (!checked[line.key]) return null
                const pts = data.map((d, i) => ({ x: groupCx(i), y: scaleY(d[line.key === 'total' ? 't' : line.key === 'external' ? 'e' : 'i']) }))
                return <path key={line.key} d={smoothLinePath(pts)} fill="none" stroke={line.color} strokeWidth={line.width} strokeLinecap="round" strokeLinejoin="round" />
              })
          }

          {/* x-axis date labels — all dates rotated */}
          {dates.map((date, i) => {
            const cx = groupCx(i)
            const ly = padT + chartH + 10
            return (
              <text key={i} x={cx} y={ly} fontSize="8.5" fill="#6c6e79" textAnchor="end" transform={`rotate(-55 ${cx} ${ly})`}>{date}</text>
            )
          })}
        </svg>
      )}
    </div>
  )
}

// ─── SegmentedBarLong ─────────────────────────────────────────────────────────
function SegmentedBarLong({ fillPct }: { fillPct: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [containerW, setContainerW] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setContainerW(e.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  const segW = 3, segGap = 2
  const segs = containerW > 0 ? Math.floor((containerW + segGap) / (segW + segGap)) : 0
  const filled = Math.round((fillPct / 100) * segs)
  return (
    <div ref={ref} className="flex items-center gap-[2px]">
      {Array.from({ length: segs }).map((_, i) => (
        <span key={i} className="h-2 w-[3px] rounded-[1px]" style={{ background: i < filled ? '#1c8cfd' : '#e0e1e9' }} />
      ))}
    </div>
  )
}

// ─── GeoBar ───────────────────────────────────────────────────────────────────
function GeoBar({ pct }: { pct: number }) {
  const segs = 24
  const filled = Math.round((pct / 100) * segs)
  return (
    <div className="flex w-[110px] items-center gap-[2px]">
      {Array.from({ length: segs }).map((_, i) => (
        <span key={i} className="h-2.5 w-[3px] rounded-[1px]" style={{ background: i < filled ? '#1c8cfd' : '#e0e1e9' }} />
      ))}
    </div>
  )
}
