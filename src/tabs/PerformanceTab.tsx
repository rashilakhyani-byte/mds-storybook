import { useState } from 'react'
import { Lightning, CaretRight, Database, Stack } from '@phosphor-icons/react'
import { SectionCard } from '../components/Card'
import { SubToggle } from '../components/SubToggle'
import { MiniLineChart } from '../components/MiniLineChart'
import { MultiLineChart } from '../components/MultiLineChart'

type SeriesKey = 'avg' | 'max' | 'p95' | 'p99'
const SERIES: { key: SeriesKey; label: string; color: string; value: string }[] = [
  { key: 'avg', label: 'Average Latency', color: '#67cba2', value: '145 ms' },
  { key: 'max', label: 'Max Latency', color: '#ff7c65', value: '201 ms' },
  { key: 'p95', label: 'P95 Latency', color: '#1c8cfd', value: '170 ms' },
  { key: 'p99', label: 'P99 Latency', color: '#a78bfa', value: '270 ms' },
]

function gen(seed: number, base: number, range: number, n = 30) {
  return Array.from({ length: n }, (_, i) => ({
    t: i,
    v: base + Math.sin(i * 0.55 + seed) * range + Math.cos(i * 0.3 + seed * 1.6) * range * 0.6,
  }))
}

const dataMap: Record<SeriesKey, ReturnType<typeof gen>> = {
  avg: gen(1, 250, 30),
  max: gen(2, 700, 80),
  p95: gen(3, 530, 60),
  p99: gen(4, 800, 80),
}

const xLabels = ['Jan 1', 'Jan 5', 'Jan 9', 'Jan 13', 'Jan 17', 'Jan 21', 'Jan 25', 'Jan 29']

const slowApis = [
  { path: '/v1/payments', latency: '800 ms', traffic: '388.23k' },
  { path: '/v1/orders/process', latency: '750 ms', traffic: '128.13k' },
  { path: '/v1/analytics/report', latency: '720 ms', traffic: '213.23k' },
  { path: '/v1/users/search', latency: '720 ms', traffic: '213.23k' },
  { path: '/v1/notifications/send', latency: '700 ms', traffic: '186.23k' },
  { path: '/v1/notifications/send', latency: '700 ms', traffic: '186.23k' },
  { path: '/v1/notifications/send', latency: '700 ms', traffic: '186.23k' },
  { path: '/v1/notifications/send', latency: '700 ms', traffic: '186.23k' },
]

const dbLatency = [
  { name: 'MongoDB', value: 92 },
  { name: 'PostgreSQL', value: 71 },
  { name: 'Redis', value: 35 },
  { name: 'MySQL', value: 65 },
]

const appLatency = [
  { name: 'Payment Service', value: 88 },
  { name: 'Order Service', value: 72 },
  { name: 'User Service', value: 56 },
  { name: 'API Gateway', value: 41 },
]

export function PerformanceTab() {
  const [enabled, setEnabled] = useState<Record<SeriesKey, boolean>>({ avg: true, max: true, p95: true, p99: true })
  const [mode, setMode] = useState<'breakdown' | 'trend'>('breakdown')

  const merged = dataMap.avg.map((_, i) => ({
    t: i,
    avg: dataMap.avg[i].v,
    max: dataMap.max[i].v,
    p95: dataMap.p95[i].v,
    p99: dataMap.p99[i].v,
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[1fr_360px] gap-4">
        <SectionCard
          title="Performance Metrics"
          icon={<Lightning size={14} className="text-text-subtle"  />}
          right={
            <SubToggle
              size="sm"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'breakdown', label: 'Breakdown' },
                { value: 'trend', label: 'Trend' },
              ]}
            />
          }
        >
          <div className="flex justify-center gap-2 py-3">
            {SERIES.map((s) => (
              <button
                key={s.key}
                onClick={() => setEnabled((e) => ({ ...e, [s.key]: !e[s.key] }))}
                className={`flex items-center gap-2 rounded-md border bg-white px-2.5 py-1.5 text-left transition-opacity ${
                  enabled[s.key] ? 'border-stroke-subsection' : 'border-stroke-subsection opacity-50'
                }`}
              >
                <span className={`grid h-3.5 w-3.5 place-items-center rounded-sm border ${enabled[s.key] ? 'border-transparent text-white' : 'border-stroke-section text-transparent'}`} style={{ background: enabled[s.key] ? s.color : 'transparent' }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M2 4.5l1.8 1.8L7.2 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <div className="flex flex-col">
                  <div className="text-[10px] font-medium text-text-subdued">{s.label}</div>
                  <div className="text-[13px] font-semibold text-text-default">{s.value}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="h-[280px] px-3 pb-3">
            <MultiLineChart
              data={merged}
              series={SERIES.filter((s) => enabled[s.key]).map((s) => ({ key: s.key, color: s.color, label: s.label }))}
              mode={mode}
              xLabels={xLabels}
              xLabelStep={4}
              yMax={1000}
              yTicks={[0, 250, 500, 750, 1000]}
              yUnit="ms"
              yAxisLabel="Latency (ms)"
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Top Slow APIs"
          icon={<Lightning size={14} className="text-text-subtle"  />}
        >
          <div className="flex flex-col">
            {slowApis.map((api, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-stroke-subsection px-3 py-2 last:border-b-0 hover:bg-surface-hover">
                <div className="flex flex-1 flex-col">
                  <div className="text-[12px] font-medium text-text-default">{api.path}</div>
                  <div className="text-[11px] text-text-subdued">{api.latency} <span className="ml-1">{api.traffic}</span></div>
                </div>
                <div className="h-6 w-20">
                  <MiniLineChart data={Array.from({ length: 20 }, (_, k) => ({ x: k, y: 50 + Math.sin(k + i) * 8 + Math.random() * 5 }))} color="#1c8cfd" />
                </div>
                <CaretRight size={14} className="text-text-subdued" />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SectionCard title="Latency By Database" icon={<Database size={14} className="text-text-subtle"  />}>
          <div className="flex flex-col gap-2 p-3">
            {dbLatency.map((d) => (
              <BarRow key={d.name} name={d.name} value={d.value} />
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Latency By Application" icon={<Stack size={14} className="text-text-subtle"  />}>
          <div className="flex flex-col gap-2 p-3">
            {appLatency.map((d) => (
              <BarRow key={d.name} name={d.name} value={d.value} />
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

function BarRow({ name, value }: { name: string; value: number }) {
  const segs = 60
  const filled = Math.round((value / 100) * segs)
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 text-[12px] font-medium text-text-default">{name}</div>
      <div className="flex flex-1 items-center gap-[2px]">
        {Array.from({ length: segs }).map((_, i) => (
          <span key={i} className="h-3.5 w-[3px] rounded-[1px]" style={{ background: i < filled ? '#1c8cfd' : '#e0e1e9' }} />
        ))}
      </div>
    </div>
  )
}

