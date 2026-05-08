import { ArrowsLeftRight, PresentationChart, ShieldCheckered, CheckCircle } from '@phosphor-icons/react'
import { MiniLineChart } from './MiniLineChart'

export type MetricKey = 'traffic' | 'performance' | 'security' | 'compliance'

const sparkline = (seed: number, n = 30) =>
  Array.from({ length: n }, (_, i) => ({
    x: i,
    y: 50 + Math.sin(i * 0.2 + seed) * 14 + Math.sin(i * 0.09 + seed * 0.5) * 5 + (Math.random() * 2 - 1),
  }))

export function MetricCards({ active, onSelect }: { active: MetricKey; onSelect: (k: MetricKey) => void }) {
  return (
    <div className="flex">
      <Card
        keyName="traffic"
        active={active === 'traffic'}
        onClick={() => onSelect('traffic')}
        icon={<ArrowsLeftRight size={18} />}
        title="Traffic"
        stats={[
          { label: 'Success Rate', value: '83%', size: 'sm' },
          { label: 'Traffic',      value: '145k', size: 'lg' },
          { label: 'Error Rate',   value: '17%',  size: 'sm' },
        ]}
        bar={{ left: 83, right: 17 }}
        chartLabel="Traffic"
        chartData={sparkline(1)}
        chartColor="#1c8cfd"
      />
      <Card
        keyName="performance"
        active={active === 'performance'}
        onClick={() => onSelect('performance')}
        icon={<PresentationChart size={18} />}
        title="Performance"
        stats={[
          { label: 'Avg Latency', value: '125ms',  delta: { value: '-3% vs last month', tone: 'good' } },
          { label: 'P95 Latency', value: '1200ms', delta: { value: '+8% vs last month', tone: 'bad'  } },
        ]}
        chartLabel="Avg Latency"
        chartData={sparkline(5)}
        chartColor="#ff7c65"
      />
      <Card
        keyName="security"
        active={active === 'security'}
        onClick={() => onSelect('security')}
        icon={<ShieldCheckered size={18} />}
        title="Security"
        stats={[
          { label: 'Secure',   value: '100k' },
          { label: 'Unsecure', value: '45k'  },
        ]}
        bar={{ left: 69, right: 31 }}
        chartLabel="Unsecure Traffic"
        chartData={sparkline(7)}
        chartColor="#ff7c65"
      />
      <Card
        keyName="compliance"
        active={active === 'compliance'}
        onClick={() => onSelect('compliance')}
        icon={<CheckCircle size={18} />}
        title="Compliance"
        stats={[
          { label: 'Compliant',     value: '94k' },
          { label: 'Non Compliant', value: '35k' },
        ]}
        bar={{ left: 69, right: 31 }}
        chartLabel="Non Compliant Traffic"
        chartData={sparkline(11)}
        chartColor="#ff7c65"
      />
    </div>
  )
}

type Stat = {
  label: string
  value: string
  size?: 'sm' | 'lg'
  delta?: { value: string; tone: 'good' | 'bad' }
}

function Card({
  active, onClick, icon, title, stats, bar, chartLabel, chartData, chartColor,
}: {
  keyName: MetricKey
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  stats: Stat[]
  bar?: { left: number; right: number }
  chartLabel: string
  chartData: { x: number; y: number }[]
  chartColor: string
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      className={`relative flex flex-1 min-w-0 cursor-pointer flex-col gap-3 p-6 text-left transition-all ${
        active
          ? 'bg-white rounded-t-lg border-t-2 border-t-stroke-active z-10'
          : 'bg-surface-underground border-t border-x border-stroke-subsection'
      }`}
      style={active ? {
        boxShadow: '0px 0px 9px rgba(9,30,66,0.15), 0px 0px 0.5px rgba(9,30,66,0.31)',
        clipPath: 'inset(-20px -20px 0px -20px round 8px 8px 0 0)',
      } : undefined}
    >
      {/* title row */}
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-table-header border border-stroke-subsection">
          <span className="text-text-subtle">{icon}</span>
        </div>
        <span className="text-[18px] font-semibold leading-6 text-text-default">{title}</span>
      </div>

      {/* stats + bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <div className="text-[12px] font-semibold leading-4 text-text-disabled">{s.label}</div>
              <div
                className={`font-semibold font-['JetBrains_Mono',monospace] text-text-default ${
                  s.size === 'lg' ? 'text-[24px] leading-8' : 'text-[18px] leading-6'
                }`}
              >
                {s.value}
              </div>
              {s.delta && (
                <span
                  className={`inline-block w-fit rounded-sm px-1 py-px text-[11px] font-normal leading-4 text-text-stark ${
                    s.delta.tone === 'good' ? 'bg-green-subtle' : 'bg-red-subtle'
                  }`}
                >
                  {s.delta.value}
                </span>
              )}
            </div>
          ))}
        </div>

        {bar && (
          <div className="flex flex-col gap-1">
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
              <div className="h-full bg-blue-default" style={{ width: `${bar.left}%` }} />
              <div className="h-full bg-red-medium" style={{ width: `${bar.right}%` }} />
            </div>
            <div className="flex justify-between text-[12px] font-medium font-['JetBrains_Mono',monospace] text-text-subdued">
              <span>{bar.left}%</span>
              <span>{bar.right}%</span>
            </div>
          </div>
        )}
      </div>

      {/* chart */}
      <div className="flex flex-col gap-0.5 mt-auto">
        <div className="text-[13px] font-medium leading-4 text-text-subdued">{chartLabel}</div>
        <div className="h-14">
          <MiniLineChart data={chartData} color={chartColor} />
        </div>
        <div className="border-t border-chart-grid" />
        <div className="flex justify-between text-[12px] font-normal text-[#6c6e79]">
          <span>April 1st</span>
          <span>April 30th</span>
        </div>
      </div>
    </div>
  )
}
