import { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export type CountryDatum = {
  iso: string // ISO_A2 e.g. "FR" — but we match by name as fallback
  name: string
  transactions: number
  unsecure?: boolean
  unsecurePct?: number
  nonCompliantPct?: number
  totalRiskPct?: number
}

type Props = {
  data: CountryDatum[]
  /** When true, unsecure countries get red fill */
  showUnsecure?: boolean
  /** Tooltip variant */
  tooltipKind?: 'transactions' | 'compliance'
}

export function WorldMap({ data, showUnsecure = true, tooltipKind = 'transactions' }: Props) {
  const [hover, setHover] = useState<{ name: string; x: number; y: number; datum?: CountryDatum } | null>(null)

  const byName = new Map(data.map((d) => [d.name.toLowerCase(), d]))

  return (
    <div className="relative h-[360px] w-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 100, center: [10, 30] }}
        width={800}
        height={360}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name: string = geo.properties.name
              const datum = byName.get(name.toLowerCase())
              const isUnsecure = showUnsecure && datum?.unsecure
              const fill = isUnsecure
                ? '#ff7c65'
                : datum
                ? datum.transactions > 100000
                  ? '#1c8cfd'
                  : datum.transactions > 50000
                  ? '#78bbfa'
                  : '#cae8ff'
                : '#eef1f6'
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={(e) => {
                    const r = (e.currentTarget as SVGPathElement).getBoundingClientRect()
                    const parent = (e.currentTarget.ownerSVGElement?.parentElement as HTMLElement | null)?.getBoundingClientRect()
                    setHover({
                      name,
                      x: r.left - (parent?.left ?? 0) + r.width / 2,
                      y: r.top - (parent?.top ?? 0) + r.height / 2,
                      datum,
                    })
                  }}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    default: { fill, stroke: '#ffffff', strokeWidth: 0.5, outline: 'none' },
                    hover: { fill: isUnsecure ? '#d31510' : '#0054b6', stroke: '#ffffff', strokeWidth: 0.5, outline: 'none', cursor: 'pointer' },
                    pressed: { fill, outline: 'none' },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-stroke-subsection bg-white px-2.5 py-1.5 shadow-md"
          style={{ left: hover.x, top: hover.y - 8 }}
        >
          <div className="text-[12px] font-semibold leading-4 text-text-default">{hover.name}</div>
          {hover.datum ? (
            tooltipKind === 'transactions' ? (
              <>
                <div className="text-[11px] text-text-subdued">
                  {hover.datum.transactions.toLocaleString()} transactions
                </div>
                {hover.datum.unsecure && (
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-red-dark">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-medium" />
                    Unsecure traffic
                  </div>
                )}
              </>
            ) : (
              <>
                {hover.datum.nonCompliantPct !== undefined && (
                  <div className="text-[11px] text-text-subdued">{hover.datum.nonCompliantPct}% Non Compliant</div>
                )}
                <div className="text-[11px] text-text-subdued">{(hover.datum.transactions / 1000).toFixed(0)}k Requests</div>
                {hover.datum.totalRiskPct !== undefined && (
                  <div className="text-[11px] text-text-subdued">{hover.datum.totalRiskPct}% of Total Risks</div>
                )}
              </>
            )
          ) : (
            <div className="text-[11px] text-text-subdued">No data</div>
          )}
        </div>
      )}
    </div>
  )
}
