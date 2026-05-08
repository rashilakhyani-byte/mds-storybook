import { useState, useEffect, useRef } from 'react'
import { X, Send, ChevronRight, Loader2, SquarePen, Monitor, ListFilter, AlertTriangle, BellRing } from 'lucide-react'
import { AISparkleIcon } from './AISparkleIcon'

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'suggestions' | 'free' | 'analyzing' | 'root-cause' | 'impact' | 'remediation' | 'resolved'

type ChatChart = {
  label: string
  data: number[]
  color: string
  xLabels?: [string, string]
  unit?: string
}

type ChatStat = {
  label: string
  value: string
  trend?: 'up-bad' | 'up-good' | 'down-bad' | 'down-good' | 'neutral'
}

type RCAStep = {
  text: string
  detail?: string
  severity?: 'critical' | 'warning' | 'info'
}

type SectionTable = {
  headers: string[]
  rows: Array<{ cells: string[]; trend?: 'up-bad' | 'up-good' | 'neutral' }>
}

type AISummaryCard = {
  status: 'normal' | 'error' | 'warning'
  title: string
  description: string
  metric?: { label: string; value: string; trend: 'up' | 'down' }
}

type RCACard = {
  primaryCause: string
  confidenceScore: number
  eventSequence: Array<{ title: string; subtitle: string }>
  affectedServices: string[]
}

type APIContributorItem = {
  name: string
  subtitle?: string
  badge?: string
  value: string
}

type Section = {
  label: string
  text?: string
  stats?: ChatStat[]
  list?: string[]
  chart?: ChatChart
  chain?: RCAStep[]
  table?: SectionTable
  alert?: { condition: string; threshold: string }
  aiSummary?: AISummaryCard
  rca?: RCACard
  apiContributors?: APIContributorItem[]
}

type FreeMessage = {
  role: 'user' | 'assistant'
  text?: string
  sections?: Section[]
  chart?: ChatChart
  stats?: ChatStat[]
  list?: string[]
  chain?: RCAStep[]
  actions?: string[]
  alert?: { condition: string; threshold: string }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function buildSvgPaths(data: number[], W: number, H: number, pad: number) {
  const max = Math.max(...data), min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (W - pad * 2),
    y: pad + (1 - (v - min) / range) * (H - pad * 2),
  }))
  const line = pts.map((p, i) => {
    if (i === 0) return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    const prev = pts[i - 1]
    const cx = ((prev.x + p.x) / 2).toFixed(1)
    return `C${cx} ${prev.y.toFixed(1)} ${cx} ${p.y.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  }).join(' ')
  const last = pts[pts.length - 1]
  const area = `${line} L${last.x.toFixed(1)} ${H} L${pts[0].x.toFixed(1)} ${H} Z`
  return { pts, line, area }
}

function InlineChart({ chart, uid }: { chart: ChatChart; uid: string }) {
  const W = 320, H = 68, pad = 6
  const { pts, line, area } = buildSvgPaths(chart.data, W, H, pad)
  const gradId = `gcg-${uid}`
  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-baseline justify-between px-3 pt-2.5 pb-0">
        <span className="text-[11px] font-medium text-slate-500">{chart.label}</span>
        <span className="font-['JetBrains_Mono',monospace] text-[13px] font-semibold text-slate-800">
          {chart.data[chart.data.length - 1]}{chart.unit}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" style={{ height: H }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chart.color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={chart.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradId})`} />
        <path d={line} fill="none" stroke={chart.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill={chart.color} />
      </svg>
      {chart.xLabels && (
        <div className="flex justify-between px-3 pb-2 text-[10px] text-slate-400">
          <span>{chart.xLabels[0]}</span>
          <span>{chart.xLabels[1]}</span>
        </div>
      )}
    </div>
  )
}

function StatBadge({ trend }: { trend?: ChatStat['trend'] }) {
  if (!trend || trend === 'neutral') return <span className="text-[10px] text-slate-400">—</span>
  const up = trend.startsWith('up'), bad = trend.endsWith('bad')
  return <span className={`text-[10px] font-bold leading-none ${bad ? 'text-red-500' : 'text-green-600'}`}>{up ? '↑' : '↓'}</span>
}

function InlineStats({ stats }: { stats: ChatStat[] }) {
  const cols = Math.min(stats.length, 3)
  return (
    <div className="mt-2 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border border-slate-200 bg-white px-2 py-2 shadow-sm">
          <div className="mb-0.5 truncate text-[9px] leading-3 text-slate-400">{s.label}</div>
          <div className="flex items-center gap-0.5">
            <span className="truncate font-['JetBrains_Mono',monospace] text-[11px] font-semibold leading-none text-slate-800">{s.value}</span>
            <StatBadge trend={s.trend} />
          </div>
        </div>
      ))}
    </div>
  )
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**'))
          return <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>
        if (part.startsWith('`') && part.endsWith('`'))
          return <code key={i} className="rounded bg-slate-200 px-1 py-0.5 text-[10px] font-medium">{part.slice(1, -1)}</code>
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <div className="mt-2 space-y-1.5 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 text-[12px] text-slate-700">
          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-dark" />
          <RichText text={item} />
        </div>
      ))}
    </div>
  )
}

function RCAChain({ chain }: { chain: RCAStep[] }) {
  const colors: Record<string, string> = {
    critical: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    info: 'border-blue-100 bg-blue-50 text-blue-800',
  }
  return (
    <div className="mt-2 space-y-0.5">
      {chain.map((step, i) => (
        <div key={i} className="flex flex-col items-stretch">
          <div className={`rounded-lg border px-3 py-2 text-[12px] ${colors[step.severity ?? 'info']}`}>
            <div className="font-semibold">{step.text}</div>
            {step.detail && <div className="mt-0.5 text-[11px] opacity-70">{step.detail}</div>}
          </div>
          {i < chain.length - 1 && (
            <div className="py-0.5 text-center text-[13px] text-slate-400">↓</div>
          )}
        </div>
      ))}
    </div>
  )
}

function AlertConfirm({ alert }: { alert: NonNullable<FreeMessage['alert']> }) {
  return (
    <div className="mt-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-[11px] font-bold text-white">✓</div>
        <div>
          <div className="text-[12px] font-semibold text-green-800">Alert Created</div>
          <div className="text-[11px] text-green-600">{alert.condition} · triggers at {alert.threshold}</div>
        </div>
      </div>
    </div>
  )
}

function ActionChips({ actions, onSelect }: { actions: string[]; onSelect: (a: string) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {actions.map((a) => (
        <button
          key={a}
          onClick={() => onSelect(a)}
          className="rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors hover:opacity-80"
          style={{ borderColor: '#cce0f5', background: '#eef5ff', color: '#0054B6' }}
        >
          {a} →
        </button>
      ))}
    </div>
  )
}

function InlineTable({ table }: { table: SectionTable }) {
  const trendIcon = (t?: string) => {
    if (t === 'up-bad') return <span className="font-semibold text-red-500">↑</span>
    if (t === 'up-good') return <span className="font-semibold text-green-600">↑</span>
    if (t === 'down-bad') return <span className="font-semibold text-red-500">↓</span>
    return null
  }
  return (
    <div className="mt-1.5 overflow-hidden rounded-lg border border-slate-200 bg-white text-[11px] shadow-sm">
      <div className="grid border-b border-slate-100 bg-slate-50" style={{ gridTemplateColumns: `repeat(${table.headers.length}, 1fr)` }}>
        {table.headers.map((h) => (
          <div key={h} className="px-3 py-2 font-semibold text-slate-500 uppercase tracking-wide text-[9px]">{h}</div>
        ))}
      </div>
      {table.rows.map((row, i) => (
        <div key={i} className={`grid ${i < table.rows.length - 1 ? 'border-b border-slate-100' : ''}`} style={{ gridTemplateColumns: `repeat(${table.headers.length}, 1fr)` }}>
          {row.cells.map((cell, ci) => (
            <div key={ci} className="px-3 py-2.5 text-slate-700 leading-4">
              {ci === row.cells.length - 1 && row.trend
                ? <span className="flex items-center gap-1">{trendIcon(row.trend)}<span>{cell}</span></span>
                : cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function AISummaryBlock({ card }: { card: AISummaryCard }) {
  const isError = card.status === 'error'
  const isWarning = card.status === 'warning'
  const headerColor = isError ? '#d31510' : isWarning ? '#ec7700' : '#4046CA'
  const IconEl = isError
    ? <BellRing size={13} />
    : isWarning
    ? <AlertTriangle size={13} />
    : <AISparkleIcon size={13} uid={`ais-${card.title.slice(0, 4)}`} />
  const metricBg = card.metric?.trend === 'up' ? '#fde8e8' : '#fde8e8'
  const trendIcon = card.metric?.trend === 'down' ? '↘' : '↗'
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5" style={{ color: headerColor }}>
        {IconEl}
        <span className="text-[12px] font-semibold">AI Summary</span>
      </div>
      <div className="mb-1 text-[14px] font-bold text-slate-900">{card.title}</div>
      <div className="mb-3 text-[12px] leading-[18px] text-slate-500">{card.description}</div>
      {card.metric && (
        <span className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px]" style={{ background: metricBg }}>
          <span className="text-slate-600">{card.metric.label}</span>
          <strong className="text-slate-900">{card.metric.value}</strong>
          <span className="text-red-400">{trendIcon}</span>
        </span>
      )}
    </div>
  )
}

function RCABlock({ card }: { card: RCACard }) {
  const circ = 2 * Math.PI * 5.5
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Monitor size={15} className="text-slate-600" />
        <span className="text-[13px] font-bold text-slate-800">Root Cause Analysis</span>
      </div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Primary Cause</span>
        <div className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="5.5" fill="none" stroke="#e2e8f0" strokeWidth="2" />
            <circle cx="7" cy="7" r="5.5" fill="none" stroke="#1c8cfd" strokeWidth="2"
              strokeDasharray={`${(card.confidenceScore / 100) * circ} ${circ}`}
              strokeLinecap="round" transform="rotate(-90 7 7)" />
          </svg>
          <span className="text-[11px] text-slate-500">Confidence Score <strong className="text-slate-800">{card.confidenceScore}%</strong></span>
        </div>
      </div>
      <div className="mb-4 text-[13px] font-semibold leading-5 text-slate-800">{card.primaryCause}</div>
      <div className="mb-2 text-[11px] text-slate-400">Event Sequence</div>
      <div className="mb-4 space-y-2">
        {card.eventSequence.map((ev, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="mt-3 h-2 w-2 shrink-0 rounded-full bg-blue-dark" />
            <div className="flex-1 rounded-xl bg-slate-100 px-3 py-2.5">
              <div className="text-[12px] font-semibold text-slate-800">{ev.title}</div>
              <div className="text-[11px] text-slate-400">{ev.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-2 text-[11px] text-slate-400">Affected Services</div>
      <div className="space-y-1">
        {card.affectedServices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-[12px] text-slate-700">
            <span className="text-slate-400">•</span><span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function APIContributorsBlock({ items }: { items: APIContributorItem[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <ListFilter size={15} className="text-slate-600" />
        <span className="text-[13px] font-bold text-slate-800">Top API Contributors to Failures</span>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="min-w-0 flex-1 pr-3">
              <div className="text-[12px] font-semibold text-slate-800 truncate">{item.name}</div>
              <div className="mt-0.5 flex items-center gap-1.5">
                {item.badge && (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">{item.badge}</span>
                )}
                {item.subtitle && (
                  <span className="text-[11px] text-slate-400">{item.subtitle}</span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="font-['JetBrains_Mono',monospace] text-[12px] font-semibold text-slate-700">{item.value}</span>
              <ChevronRight size={13} className="text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionBlock({ section, uid }: { section: Section; uid: string }) {
  const hasLabel = !section.aiSummary && !section.rca && !section.apiContributors
  return (
    <div>
      {hasLabel && <div className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">{section.label}</div>}
      {section.aiSummary && <AISummaryBlock card={section.aiSummary} />}
      {section.rca && <RCABlock card={section.rca} />}
      {section.apiContributors && <APIContributorsBlock items={section.apiContributors} />}
      {section.text && <div className="text-[12px] leading-[18px] text-slate-700"><RichText text={section.text} /></div>}
      {section.table && <InlineTable table={section.table} />}
      {section.stats && <InlineStats stats={section.stats} />}
      {section.chart && <InlineChart chart={section.chart} uid={uid} />}
      {section.chain && <RCAChain chain={section.chain} />}
      {section.list && <BulletList items={section.list} />}
      {section.alert && <AlertConfirm alert={section.alert} />}
    </div>
  )
}

// ─── Response generator (6 structured categories) ────────────────────────────

function generateAIResponse(input: string): Omit<FreeMessage, 'role'> {
  const q = input.toLowerCase()

  // ── Cat 3: Security & Compliance Governance ───────────────────────────────
  if (/insecure|shadow.?api|missing.?oas|pii|schema.?deviat|ip.?risk|risky.?ip|compliance|govern|country.*insecure|security.?threat|threat.?summar|which.*attack|tor.*node/.test(q)) {
    return {
      sections: [
        {
          label: 'Risk Summary',
          aiSummary: {
            status: 'error',
            title: '3 critical security issues detected',
            description: 'An active SQL injection attack targets /v1/payments, 2 APIs expose PII without masking, and 5 shadow APIs receive unmonitored traffic.',
            metric: { label: 'Attacker IPs', value: '127', trend: 'up' },
          },
        },
        {
          label: 'Top Threats / Violations',
          chain: [
            { text: 'SQL Injection — /v1/payments', detail: '127 IPs · 24,650 failed reqs · 185.220.101.0/24 subnet (TOR)', severity: 'critical' },
            { text: 'PII Exposure — /v1/users, /v1/orders', detail: 'User emails + card last-4 in unmasked response payloads', severity: 'critical' },
            { text: 'Shadow APIs — 5 endpoints with no OAS or owner', detail: '/v1/legacy-billing, /v1/internal-sync + 3 others', severity: 'warning' },
          ],
        },
        {
          label: 'Affected APIs / Sources / IPs',
          stats: [
            { label: 'Attacker IPs', value: '127', trend: 'up-bad' },
            { label: 'PII Endpoints', value: '2', trend: 'up-bad' },
            { label: 'Shadow APIs', value: '5', trend: 'up-bad' },
          ],
        },
        {
          label: 'Severity / Exposure Level',
          list: [
            '🔴 **Critical** — SQL injection: active exfiltration risk on `/v1/payments`',
            '🔴 **Critical** — PII: `/v1/users` returns unmasked email + card data to external callers',
            '🟡 **High** — Shadow: `/v1/legacy-billing` receiving 340k req/month with zero monitoring',
            '🟡 **High** — Missing OAS on 5 APIs — schema validation and governance disabled',
            '🔵 **Medium** — TOR exit node traffic: Russia (8,240 reqs) + China (5,410 reqs)',
          ],
        },
      ],
      actions: ['Which IPs are highest risk?', 'Where is PII exposed?', 'Show shadow APIs', 'Apply WAF block now'],
    }
  }

  // ── Cat 4: Performance & Dependency Analysis ──────────────────────────────
  if (/slowest|p95|bottleneck|mongodb|timeout|response.?time|depend.*(impact|caus|delay)|which.*api.*slow|timing.?out|which.*service.*slow|is.*slow/.test(q)) {
    return {
      sections: [
        {
          label: 'Performance Summary',
          aiSummary: {
            status: 'warning',
            title: 'P95 latency 46% above baseline',
            description: 'Latency is at 1,200ms — isolated to /v1/payments and directly caused by the SQL injection attack forcing full MongoDB collection scans.',
            metric: { label: 'P95 Latency', value: '1,200ms', trend: 'up' },
          },
        },
        {
          label: 'Bottleneck Detection',
          chain: [
            { text: 'Malformed SQL payloads bypass input validation', severity: 'critical' },
            { text: 'MongoDB forced into full collection scans', detail: 'Query time 480ms avg — normal: 12ms', severity: 'critical' },
            { text: 'DB connection pool exhausted', detail: 'Pool utilization: 94% on /v1/payments', severity: 'warning' },
            { text: 'P95 latency → 1,200ms across all payment clients', severity: 'warning' },
          ],
        },
        {
          label: 'Impacted APIs / Services',
          stats: [
            { label: '/v1/payments', value: '1,200ms P95', trend: 'up-bad' },
            { label: '/v1/search', value: '890ms P95', trend: 'up-bad' },
            { label: '/v1/reports', value: '750ms P95', trend: 'neutral' },
          ],
        },
        {
          label: 'Dependency Insights',
          list: [
            '**MongoDB** — primary bottleneck; full scans taking 480ms due to malformed query payloads',
            '**Elasticsearch** — `/v1/search` elevated at 890ms; likely cold cache — independent of attack',
            '**Connection Pool** — 94% utilized on payments DB; queuing risk at 100%',
            '**Redis cache** — unaffected; hit rate stable at 87%',
            '**Stripe webhooks** — adding ~45ms per transaction; within acceptable range',
          ],
        },
      ],
      actions: ['Why is P95 latency so high?', 'Is MongoDB causing delays?', 'Which APIs are timing out?', 'How do I fix this?'],
    }
  }

  // ── Cat 2: Root Cause & Investigation ────────────────────────────────────
  if (/root.?cause|what.*(caus|happened)|why.*(fail|increas)|latency.*fail|depend.*caus|external.*trigger|what.*changed|which.*service.*cause|why.*spike|correlat|investigate|jan.*25/.test(q)) {
    return {
      sections: [
        {
          label: 'Root Cause Summary',
          aiSummary: {
            status: 'error',
            title: 'Root cause confirmed: SQL injection campaign',
            description: 'Attack from TOR exit node 185.220.101.45 began at 02:14 UTC on Jan 25, escalating from 0 to 520 malicious req/min within 30 minutes — triggering DB failures and latency spikes.',
            metric: { label: 'Failed Reqs', value: '24,650', trend: 'up' },
          },
        },
        {
          label: 'Root Cause Analysis',
          rca: {
            primaryCause: 'SQL injection campaign from TOR exit node 185.220.101.45, began at 02:14 UTC and escalated from 0 to 520 malicious req/min within 30 minutes.',
            confidenceScore: 92,
            eventSequence: [
              { title: 'External traffic surged 2.4×', subtitle: 'From 860 → 2,100 req/min in 8 minutes at 02:14 UTC' },
              { title: 'SQL injection payloads detected', subtitle: 'OR 1=1 -- pattern; 127 IPs from 185.220.101.0/24' },
              { title: 'MongoDB forced into full collection scans', subtitle: '24,650 failed requests over 47 minutes' },
              { title: 'P95 latency spiked to 1,200ms', subtitle: 'Caused by full collection scans per malformed query' },
            ],
            affectedServices: ['/v1/payments', 'MongoDB (payments DB)', '/v1/search (secondary impact)'],
          },
        },
        {
          label: 'Timeline / Trigger Event',
          chart: { label: 'Requests / min', data: [820, 840, 860, 870, 1200, 1800, 2100, 2080, 2050, 2030, 2020, 2010], color: '#ff7c65', xLabels: ['02:00', '02:12'], unit: '' },
        },
        {
          label: 'Affected APIs / Services',
          stats: [
            { label: '/v1/payments', value: '17% errors', trend: 'up-bad' },
            { label: 'MongoDB', value: '480ms/query', trend: 'up-bad' },
            { label: 'Failed Reqs', value: '24,650', trend: 'up-bad' },
          ],
        },
      ],
      actions: ['Show security impact', 'What is the business impact?', 'Show remediation steps', 'Are latency and failures related?'],
    }
  }

  // ── Cat 5: Exploration & Navigation ──────────────────────────────────────
  if (/^(show|filter|open|display)|external.?only|only.*(500|5xx|error)|germany|shadow.?api|high.?latency|insecure.*api.*only/.test(q)) {
    const isExternal = /external/.test(q)
    const is5xx = /500|5xx/.test(q)
    const isGermany = /germany/.test(q)
    const isShadow = /shadow/.test(q)
    const isHighLatency = /high.?latency/.test(q)

    const filterLabel = isExternal ? 'External Traffic Only'
      : is5xx ? '5xx Errors Only'
      : isGermany ? 'Germany Traffic'
      : isShadow ? 'Shadow APIs'
      : isHighLatency ? 'High Latency APIs'
      : 'Filtered View'

    return {
      sections: [
        {
          label: 'Applied Action / Filter',
          text: `Dashboard filtered to **${filterLabel}**. ${isExternal ? 'Showing 94,250 external requests — 65% of total traffic. External sources are driving 22% more errors than internal.' : is5xx ? 'Showing 24,650 failed requests with 5xx status. All concentrated on `/v1/payments`.' : isGermany ? '1,800 requests from Germany — mostly TOR exit nodes involved in the SQL injection campaign.' : isShadow ? '5 shadow APIs identified with no OAS schema, no owner, and unmonitored request traffic.' : isHighLatency ? '3 APIs with P95 latency above 700ms: `/v1/payments`, `/v1/search`, `/v1/reports`.' : 'Filtered view applied.'}`,
        },
        {
          label: 'Updated Dashboard Context',
          stats: isExternal
            ? [{ label: 'External Reqs', value: '94,250', trend: 'neutral' }, { label: 'External Errors', value: '22%', trend: 'up-bad' }, { label: 'Top Source', value: 'postman.com', trend: 'neutral' }]
            : is5xx
            ? [{ label: '5xx Count', value: '24,650', trend: 'up-bad' }, { label: 'Top Endpoint', value: '/v1/payments', trend: 'up-bad' }, { label: 'Peak Error Rate', value: '17%', trend: 'up-bad' }]
            : isShadow
            ? [{ label: 'Shadow APIs', value: '5', trend: 'up-bad' }, { label: 'No Owner', value: '2', trend: 'up-bad' }, { label: 'Unmonitored', value: '100%', trend: 'up-bad' }]
            : [{ label: 'APIs in View', value: '3', trend: 'neutral' }, { label: 'Avg P95', value: '947ms', trend: 'up-bad' }, { label: 'Max P95', value: '1,200ms', trend: 'up-bad' }],
        },
        {
          label: 'Highlighted Insights',
          list: isExternal
            ? ['**api.postman.com** — 34% error rate, 18,400 failed requests (primary attacker)', '**example.com** — 12% error rate, 7,200 failed requests', 'External traffic share grew from 42% → 65% in 7 days']
            : isShadow
            ? ['`/v1/legacy-billing` — 340k req/month, completely unmonitored, no owner assigned', '`/v1/internal-sync` — 0 calls in 94 days — zombie API candidate for decommission', '3 additional endpoints missing OAS schema and governance coverage']
            : ['`/v1/payments` — 1,200ms P95 (attack-induced MongoDB scans)', '`/v1/search` — 890ms P95 (independent — possible cold cache)', '`/v1/reports` — 750ms P95 (acceptable for report generation)'],
        },
        {
          label: 'Drill-down Recommendation',
          text: isExternal ? 'Focus on `api.postman.com` — it\'s generating 34% error rate with TOR-sourced traffic. Recommend blocking 185.220.101.0/24 immediately.'
            : isShadow ? 'Assign owners to `/v1/legacy-billing` and `/v1/internal-sync` first — they carry the highest governance risk.'
            : 'Start with `/v1/payments` — it\'s attack-driven and has the highest impact. `/v1/search` needs a separate cold-start investigation.',
        },
      ],
      actions: ['Show root cause', 'Show remediation steps', 'Drill into top contributor', 'Reset filters'],
    }
  }

  // ── Cat 6: Recommendations, Alerts & Automation ───────────────────────────
  if (/priorit|what.*fix|what.*should|highest.*risk|this.*week|alert.*if|notify.*when|recommend|automate|set.*alert|summar.*health|key.*issue|what.*monitor/.test(q)) {
    const isAlert = /alert.*if|notify.*when|set.*alert/.test(q)

    if (isAlert) {
      return {
        sections: [
          {
            label: 'Priority Summary',
            aiSummary: {
              status: 'normal',
              title: 'Alert configured successfully',
              description: "You'll be notified via email + Slack when error rate exceeds 5% on any monitored endpoint. A 5-minute rolling window prevents noise from transient spikes.",
              metric: { label: 'Threshold', value: '5% errors', trend: 'up' },
            },
          },
          {
            label: 'Severity / Business Impact',
            stats: [
              { label: 'Threshold', value: '5% errors', trend: 'neutral' },
              { label: 'Window', value: '5-min avg', trend: 'neutral' },
              { label: 'Channels', value: 'Email+Slack', trend: 'neutral' },
            ],
          },
          {
            label: 'Recommended Actions',
            list: [
              '**Email** — rashi.lakhyani@apiwiz.com · notified within 30s of threshold breach',
              '**Slack** — #api-alerts · full context + drill-down link included',
              '**Auto-suppress** — during scheduled maintenance windows',
              '**Escalation** — pages on-call if threshold holds for 10+ consecutive minutes',
            ],
          },
          {
            label: 'Alert / Automation Suggestion',
            alert: { condition: 'Error rate > 5% on any endpoint', threshold: '5% over 5-minute rolling window' },
          },
        ],
        actions: ['Set another alert', 'Set latency threshold alert', 'View all active alerts', 'What should I monitor next?'],
      }
    }

    return {
      sections: [
        {
          label: 'Priority Summary',
          aiSummary: {
            status: 'error',
            title: '1 critical incident requires immediate action',
            description: 'The SQL injection attack on /v1/payments is costing $185,400/hr. Blocking the attacker subnet + enabling WAF rules takes ~15 minutes and stops the bleeding.',
            metric: { label: 'Revenue Risk', value: '$185k/hr', trend: 'up' },
          },
        },
        {
          label: 'Severity / Business Impact',
          stats: [
            { label: 'Revenue Risk', value: '$185k/hr', trend: 'up-bad' },
            { label: 'Error Rate', value: '17%', trend: 'up-bad' },
            { label: 'APIs Impacted', value: '1 of 12', trend: 'neutral' },
          ],
        },
        {
          label: 'Recommended Actions',
          list: [
            '🔴 **[P0] Block 185.220.101.0/24** — TOR subnet; 127 attacker IPs, 24,650 failed requests',
            '🔴 **[P0] Enable WAF SQL injection rules** — stops bypass of input validation immediately',
            '🟡 **[P1] Mask PII on /v1/users** — card last-4 exposed in response payloads to external callers',
            '🟡 **[P1] Assign owners to 5 shadow APIs** — unowned, unmonitored, governance gap',
            '🔵 **[P2] Investigate /v1/search latency** — independently elevated at 890ms P95',
          ],
        },
        {
          label: 'Alert / Automation Suggestion',
          chain: [
            { text: 'Auto-block: Add WAF rule for 185.220.101.0/24 on detection', severity: 'critical' },
            { text: 'Alert: Error rate > 5% → Slack #api-alerts + email on-call', severity: 'warning' },
            { text: 'Weekly digest: Shadow API + missing OAS summary every Monday', severity: 'info' },
          ],
        },
      ],
      actions: ['Apply recommended fixes', 'Set up automated alerts', 'Generate incident report', 'Show root cause'],
    }
  }

  // ── Domain failures (specific pattern within Cat 1) ──────────────────────
  if (/domain.*fail|which.*domain|fail.*domain|domain.*caus|domain.*contribut/.test(q)) {
    return {
      sections: [
        {
          label: 'Health Summary',
          text: 'External domains are contributing to the majority of failures in the current traffic.',
        },
        {
          label: 'Top Failure-Contributing Domains',
          table: {
            headers: ['Domain', 'Failure Contribution', 'Trend'],
            rows: [
              { cells: ['api.stripe.com', '32% of total failures', 'Increasing'], trend: 'up-bad' },
              { cells: ['api.postman.com', '21% of total failures', 'Stable'], trend: 'neutral' },
              { cells: ['payments.gateway.io', '14% of total failures', 'Increasing'], trend: 'up-bad' },
            ],
          },
        },
        {
          label: 'Failure Pattern Observed',
          list: [
            'Most failures are coming from external traffic requests',
            '500 and timeout errors increased significantly over the last 7 days',
            'Failure spikes correlate with increased latency from external dependencies',
          ],
        },
        {
          label: 'Most Impacted APIs',
          list: [
            'GetInternationalPayments',
            'PrimaryTransactions',
            'GetDomesticPaymentConsents',
          ],
        },
        {
          label: 'Recommended Action',
          list: [
            'Investigate external dependency latency for **api.stripe.com**',
            'Review timeout handling for payment-related APIs',
            'Monitor external traffic spikes and failure trends closely',
          ],
        },
      ],
      actions: ['Show root cause', 'Which IPs are highest risk?', 'Show remediation steps', 'Set up failure alert'],
    }
  }

  // ── Cat 1: System Health & Monitoring (broad catch-all) ───────────────────
  return {
    sections: [
      {
        label: 'Health Summary',
        aiSummary: {
          status: 'error',
          title: 'Authentication service failing',
          description: 'The /v1/payments endpoint is experiencing a 17% error rate with 500 responses. SQL injection attack from TOR exit node detected. Immediate attention required.',
          metric: { label: 'Error Rate', value: '17%', trend: 'down' },
        },
      },
      {
        label: 'Key Metric Changes',
        stats: [
          { label: 'Error Rate', value: '17%', trend: 'up-bad' },
          { label: 'P95 Latency', value: '1,200ms', trend: 'up-bad' },
          { label: 'Success Rate', value: '83%', trend: 'down-bad' },
        ],
      },
      {
        label: 'Top Contributors',
        apiContributors: [
          { name: 'GetInternationalPaymentConsentsConsentId', subtitle: 'Acme Bank Payments', value: '388.23k' },
          { name: 'GetInternationalPayments', badge: 'Shadow', value: '554.97k' },
          { name: '/v1/transaction', subtitle: 'Acme Bank Payments', value: '193.18k' },
          { name: 'PrimaryTransactions', subtitle: 'Acme Bank Payments', value: '93.18k' },
        ],
      },
      {
        label: 'Impact Overview',
        chart: { label: 'Error Rate (%)', data: [2.1, 2.0, 2.2, 1.9, 2.0, 2.1, 5.2, 11.0, 17.2, 17.0, 16.8, 17.1], color: '#ff7c65', xLabels: ['00:00', '24:00'], unit: '%' },
      },
    ],
    actions: ['Show root cause', 'What is the business impact?', 'Which APIs are failing most?', 'What should I prioritize?'],
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

interface AIAssistPanelProps {
  open: boolean
  onClose: () => void
}

export function AIAssistPanel({ open, onClose }: AIAssistPanelProps) {
  const [step, setStep] = useState<Step>('suggestions')
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('')
  const [appliedCount, setAppliedCount] = useState(0)
  const [freeMessages, setFreeMessages] = useState<FreeMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setStep('suggestions')
      setSelectedSuggestion('')
      setAppliedCount(0)
      setFreeMessages([])
      setInputValue('')
    }
  }, [open])

  useEffect(() => {
    if (step === 'analyzing') {
      const t = setTimeout(() => setStep('root-cause'), 2000)
      return () => clearTimeout(t)
    }
  }, [step])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [step, appliedCount, freeMessages, isTyping])

  const handleSuggestion = (s: string) => { setSelectedSuggestion(s); setStep('analyzing') }
  const handleApply = (idx: number) => {
    if (idx !== appliedCount) return
    const next = appliedCount + 1
    setAppliedCount(next)
    if (next >= 3) setTimeout(() => setStep('resolved'), 400)
  }
  const handleApplyAll = () => { setAppliedCount(3); setTimeout(() => setStep('resolved'), 400) }
  const handleNewChat = () => { setStep('suggestions'); setSelectedSuggestion(''); setAppliedCount(0); setFreeMessages([]); setInputValue('') }

  const sendMessage = (text: string) => {
    const msg = text.trim()
    if (!msg || isTyping) return
    setInputValue('')
    if (step === 'suggestions') setStep('free')
    setFreeMessages((prev) => [...prev, { role: 'user', text: msg }])
    setIsTyping(true)
    setTimeout(() => {
      setFreeMessages((prev) => [...prev, { role: 'assistant', ...generateAIResponse(msg) }])
      setIsTyping(false)
    }, 700)
  }

  const handleSend = () => sendMessage(inputValue)

  const showHistory = step !== 'suggestions'

  if (!open) return null

  return (
    <div
      className="animate-slide-in-right absolute inset-y-0 right-0 z-40 flex w-[380px] flex-col bg-white"
      style={{ boxShadow: '-4px 0 24px rgba(9,30,66,0.15)' }}
    >
      {/* ── Top actions ── */}
      <div className="flex shrink-0 items-center justify-end gap-1 px-3 pt-3">
        <button type="button" onClick={handleNewChat} title="New chat" className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"><SquarePen size={14} /></button>
        <button type="button" onClick={onClose} title="Close" className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"><X size={15} /></button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex flex-1 flex-col overflow-y-auto scroll-thin">
        {step === 'suggestions' ? (

          /* ── Hero / new-chat layout ── */
          <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-10">
            {/* bottom radial glow */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-60"
              style={{ background: 'radial-gradient(ellipse 140% 80% at 50% 100%, rgba(0,84,182,0.10) 0%, transparent 65%)' }}
            />
            {/* floating blue glow centered on text */}
            <div
              className="animate-float-glow pointer-events-none absolute left-1/2"
              style={{ top: 'calc(50% - 100px)', width: '320px', height: '220px', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,84,182,0.18) 0%, rgba(0,84,182,0.06) 55%, transparent 75%)', filter: 'blur(28px)', zIndex: 0 }}
            />
            <div className="relative z-10 flex w-full flex-col items-center">
              {/* Icon */}
              <div className="mb-5">
                <AISparkleIcon size={40} uid="panel" />
              </div>
              {/* Title */}
              <div className="mb-2">
                <span className="text-[21px] font-bold text-slate-900">API Insights AI</span>
              </div>
              {/* Subtitle */}
              <p className="mb-8 text-center text-[13px] leading-5 text-slate-500">
                Your AI companion for API monitoring & security
              </p>
              {/* Suggestion cards */}
              <div className="w-full space-y-2.5">
                {[
                  'What is causing the error spike?',
                  'Summarize any current security threats',
                  'What can you help me with?',
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left text-[13px] font-medium text-slate-700 shadow-sm transition-all hover:shadow hover:bg-blue-subtle/20"
                    style={{ '--tw-border-opacity': 1 } as React.CSSProperties}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,84,182,0.35)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
                  >
                    <span>{s}</span>
                    <ChevronRight size={15} className="shrink-0 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

        ) : (

          /* ── Conversation layout ── */
          <div className="space-y-3 p-4">
            {step !== 'free' && (
            <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-medium" style={{ borderColor: '#cce0f5', background: '#eef5ff', color: '#0054B6' }}>
              <span>⚡</span>
              {step === 'resolved' ? 'Analyzed 47,300 requests · All 3 remediations applied' : 'Anomaly context loaded: /v1/payments · 17% error rate'}
            </div>
            )}

        {/* History */}
        {showHistory && step !== 'free' && (
          <>
            <div className="rounded-xl rounded-tl bg-slate-50 px-3 py-2.5 text-[12px] leading-[18px] text-slate-500">
              I've detected an unusual pattern — the error rate on /v1/payments jumped to 17%, 3× above baseline. Want me to investigate?
            </div>
            <div className="flex justify-end">
              <div className="rounded-xl rounded-tr bg-blue-dark px-3 py-2 text-[12px] font-medium text-white" style={{ maxWidth: '75%' }}>{selectedSuggestion}</div>
            </div>
          </>
        )}

        {/* Analyzing */}
        {step !== 'free' && step === 'analyzing' && (
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-2"><Loader2 size={16} className="animate-spin text-blue-dark" /><span className="text-[13px] font-semibold text-blue-dark">Analyzing...</span></div>
            <p className="mt-1.5 text-[11px] text-slate-400">Scanning error logs, request traces, and security events...</p>
            <div className="mt-2 space-y-1.5">
              {['Error log patterns', 'IP geolocation data', 'Request signatures'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[11px] text-slate-400"><div className="h-1.5 w-1.5 rounded-full bg-blue-medium" />{item}</div>
              ))}
            </div>
          </div>
        )}

        {/* Root cause */}
        {step !== 'free' && ['root-cause', 'impact', 'remediation', 'resolved'].includes(step) && (
          <>
            <div className="rounded border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-semibold text-red-700">🔴  Root Cause Identified</div>
            <div className="rounded-xl rounded-tl bg-slate-50 p-3 text-[13px] leading-5 text-slate-700">
              I found the root cause. Your <code className="rounded bg-slate-200 px-1 py-0.5 text-[11px] font-medium">/v1/payments</code> endpoint is under a <strong>SQL injection attack</strong> originating from a TOR exit node.<br /><br />
              The attacker is sending malformed payloads like <code className="rounded bg-slate-200 px-1 py-0.5 text-[11px]">{'OR 1=1 --'}</code> that bypass your current input validation.
            </div>
            <div className="space-y-2">
              {[
                { label: 'Attacker IP', value: '185.220.101.45', tag: 'TOR Exit Node', tc: 'bg-red-50 text-red-700' },
                { label: 'Attack Type', value: 'SQL Injection', tag: 'OWASP Top 10', tc: 'bg-amber-50 text-amber-700' },
                { label: 'Failed Requests', value: '24,650', tag: 'Last 47 minutes', tc: 'bg-blue-50 text-blue-700' },
              ].map((d) => (
                <div key={d.label} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <div><div className="text-[10px] text-slate-400">{d.label}</div><div className="text-[14px] font-semibold text-slate-800">{d.value}</div></div>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${d.tc}`}>{d.tag}</span>
                </div>
              ))}
            </div>
            {step === 'root-cause' && (
              <button onClick={() => setStep('impact')} className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-[12px] font-medium text-blue-dark shadow-sm transition-colors hover:border-blue-dark hover:bg-blue-subtle/30">
                What's the business impact?<ChevronRight size={14} className="shrink-0 text-slate-400" />
              </button>
            )}
          </>
        )}

        {/* Impact */}
        {step !== 'free' && ['impact', 'remediation', 'resolved'].includes(step) && (
          <>
            <div className="flex justify-end"><div className="rounded-xl rounded-tr bg-blue-dark px-3 py-2 text-[12px] font-medium text-white">What's the business impact?</div></div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <div className="text-[11px] font-medium text-red-500">Estimated Revenue at Risk</div>
              <div className="text-[30px] font-bold leading-9 text-red-700">$185,400</div>
              <div className="text-[10px] text-red-400">/hr at current error rate</div>
            </div>
            <div>
              <div className="mb-2 text-[12px] font-semibold text-slate-600">Attack Chain</div>
              <div className="flex items-center gap-1">
                {[
                  { label: 'TOR Node', sub: '185.220.101.45', c: 'bg-red-50 border-red-200 text-red-700' },
                  { label: '/v1/payments', sub: 'API Endpoint', c: 'bg-amber-50 border-amber-200 text-amber-700' },
                  { label: 'SQL Payload', sub: 'Malformed', c: 'bg-red-50 border-red-200 text-red-700' },
                  { label: 'DB Error', sub: '24,650 fail', c: 'bg-red-50 border-red-200 text-red-700' },
                ].map((n, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className={`rounded border px-1.5 py-1 text-center ${n.c}`}><div className="text-[9px] font-semibold">{n.label}</div><div className="text-[8px] opacity-60">{n.sub}</div></div>
                    {i < 3 && <span className="text-[11px] text-red-400">→</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl rounded-tl bg-slate-50 p-3 text-[12px] leading-[18px] text-slate-600">
              At current rates, this attack costs <strong>$185,400/hr</strong>. The attacker has been probing for 47 minutes.<br /><br />Estimated 4-hour impact: <strong>~$742,000</strong>.
            </div>
            {step === 'impact' && (
              <button onClick={() => setStep('remediation')} className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-[12px] font-medium text-blue-dark shadow-sm transition-colors hover:border-blue-dark hover:bg-blue-subtle/30">
                Show me how to fix this<ChevronRight size={14} className="shrink-0 text-slate-400" />
              </button>
            )}
          </>
        )}

        {/* Remediation */}
        {step !== 'free' && ['remediation', 'resolved'].includes(step) && (
          <>
            <div className="flex justify-end"><div className="rounded-xl rounded-tr bg-blue-dark px-3 py-2 text-[12px] font-medium text-white">Show me how to fix this</div></div>
            <div className="rounded-xl rounded-tl bg-slate-50 p-3 text-[12px] leading-[18px] text-slate-600">Here are 3 targeted remediations to stop the attack immediately. I can apply each one automatically.</div>
            <div className="space-y-2">
              {[
                { num: '01', title: 'Block TOR Exit Nodes', desc: "Block IP range 185.220.101.0/24 via WAF rule.", impact: 'Blocks 100% of current attack traffic' },
                { num: '02', title: 'Rate Limit /v1/payments', desc: 'Limit to 10 req/min per IP. Throttles brute-force.', impact: 'Reduces attack surface by 94%' },
                { num: '03', title: 'Enable WAF SQL Rules', desc: 'Activate SQL injection detection ruleset.', impact: 'Prevents future injection attempts' },
              ].map((r, i) => {
                const applied = i < appliedCount
                return (
                  <div key={r.num} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-blue-dark" style={{ background: '#eef5ff' }}>{r.num}</span>
                          <span className="text-[13px] font-semibold text-slate-800">{r.title}</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-4 text-slate-500">{r.desc}</p>
                        <div className="mt-1.5 inline-block rounded bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">✓ {r.impact}</div>
                      </div>
                      <button onClick={() => handleApply(i)} disabled={applied || step === 'resolved'} style={(!applied && step !== 'resolved') ? { background: '#0054B6' } : undefined}
                        className={`shrink-0 rounded-md px-3 py-1.5 text-[12px] font-semibold transition-all ${applied || step === 'resolved' ? 'bg-green-100 text-green-700' : 'text-white active:scale-95'}`}>
                        {applied || step === 'resolved' ? '✓ Applied' : 'Apply'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            {step === 'remediation' && (
              <button onClick={handleApplyAll} className="w-full rounded-lg py-3 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]" style={{ background: '#0054B6' }}>
                ⚡  Apply All Remediations
              </button>
            )}
          </>
        )}

        {/* Resolved */}
        {step === 'resolved' && (
          <>
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500 text-[16px] font-bold text-white">✓</div>
                <div><div className="text-[15px] font-bold text-green-800">Attack Neutralized</div><div className="text-[12px] text-green-600">All 3 remediations applied in 1m 47s</div></div>
              </div>
            </div>
            <div className="space-y-2">
              {[{ label: 'Error Rate', before: '17%', after: '1.2%' }, { label: 'Success Rate', before: '83%', after: '98.8%' }, { label: 'Blocked IPs', before: '0', after: '127' }].map((m) => (
                <div key={m.label} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <span className="text-[11px] text-slate-500">{m.label}</span>
                  <div className="flex items-center gap-2 text-[13px] font-semibold"><span className="text-red-500">{m.before}</span><span className="text-slate-300">→</span><span className="text-green-600">{m.after}</span></div>
                </div>
              ))}
            </div>
            <div className="rounded-xl rounded-tl bg-slate-50 p-3 text-[12px] leading-[18px] text-slate-600">
              The attack is fully neutralized. I've:
              <ul className="mt-1.5 space-y-0.5 pl-3"><li>• Blocked 185.220.101.0/24 (TOR exit nodes)</li><li>• Applied rate limiting on /v1/payments</li><li>• Enabled WAF SQL injection rules</li></ul>
              <br />Error rate is back to baseline. I'll monitor for 30 minutes.
            </div>
            <div className="space-y-2">
              {['Set up automated monitoring →', 'Generate incident report →'].map((s) => (
                <button key={s} onClick={() => sendMessage(s.replace(' →', ''))} className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-[12px] font-medium text-blue-dark shadow-sm transition-colors hover:bg-blue-subtle/30">
                  {s}<ChevronRight size={14} className="shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          </>
        )}

        {/* Free-form separator */}
        {freeMessages.length > 0 && step !== 'free' && (
          <div className="flex items-center gap-2 py-1">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[10px] text-slate-400">Follow-up questions</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
        )}

        {/* Free-form messages */}
        {freeMessages.map((msg, i) => (
          <div key={i}>
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div className="rounded-xl rounded-tr bg-slate-100 px-3 py-2 text-[12px] font-medium text-slate-700" style={{ maxWidth: '80%' }}>{msg.text}</div>
              </div>
            ) : (
              <div>
                {msg.sections ? (
                  <div className="space-y-4 py-1">
                    {msg.sections.map((section, si) => (
                      <SectionBlock key={si} section={section} uid={`${i}-${si}`} />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="py-1 text-[12px] leading-[18px] text-slate-700"><RichText text={msg.text ?? ''} /></div>
                    {msg.chart && <InlineChart chart={msg.chart} uid={String(i)} />}
                    {msg.chain && <RCAChain chain={msg.chain} />}
                    {msg.stats && <InlineStats stats={msg.stats} />}
                    {msg.list && <BulletList items={msg.list} />}
                    {msg.alert && <AlertConfirm alert={msg.alert} />}
                  </>
                )}
                {msg.actions && <ActionChips actions={msg.actions} onSelect={sendMessage} />}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="rounded-xl rounded-tl bg-slate-50 px-3 py-3">
            <div className="flex items-center gap-1.5">
              {[0, 150, 300].map((delay) => (
                <div key={delay} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: `${delay}ms` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input bar ── */}
      <div className="shrink-0 border-t border-slate-100 bg-white p-3">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Ask about your APIs..."
            className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder-slate-400 outline-none"
          />
          <button onClick={handleSend} disabled={!inputValue.trim() || isTyping} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-dark text-white transition-colors hover:opacity-90 disabled:opacity-40">
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
