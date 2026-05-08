import { useState } from 'react'
import { Globe, MapPin, TrendUp, ChartBar, CaretRight, ArrowsDownUp, BracketsCurly } from '@phosphor-icons/react'
import { SectionCard } from '../components/Card'
import { WorldMap } from '../components/WorldMap'
import { complianceCountries } from '../data/countries'

const MONO = "'Roboto Mono', 'JetBrains Mono', monospace"

const COUNTRY_LIST = [
  { name: 'Germany',        flag: '🇩🇪', pct: 14, k: '12k' },
  { name: 'India',          flag: '🇮🇳', pct: 10, k: '10k' },
  { name: 'Brazil',         flag: '🇧🇷', pct: 8,  k: '10k' },
  { name: 'USA',            flag: '🇺🇸', pct: 8,  k: '10k' },
  { name: 'Sri-lanka',      flag: '🇱🇰', pct: 8,  k: '10k' },
  { name: 'United Kingdom', flag: '🇬🇧', pct: 8,  k: '10k' },
  { name: 'South Africa',   flag: '🇿🇦', pct: 8,  k: '10k' },
  { name: 'Brazil',         flag: '🇧🇷', pct: 8,  k: '10k' },
]

const TOP_APIS = [
  { name: 'GetInternationalPaymentConsentsConsentId', tag: 'Acme Bank Payments',    count: '388.23k' },
  { name: 'GetInternationalPayments',                 tag: 'Loan Sanctions API',     count: '554.97k' },
  { name: 'GetDomesticPaymentConsentsConsentId',      tag: 'Consumer Credit Check',  count: '885.4k'  },
  { name: 'Primary Transactions',                     tag: 'Acme Bank Transactions', count: '193.18k' },
  { name: 'International Transactions',               tag: 'Acme Bank Transactions', count: '93.18k'  },
]

const BREAKUP_ROWS = [
  { label: 'Request Body',  pct: 95 },
  { label: 'Response Body', pct: 88 },
  { label: 'Path',          pct: 65 },
  { label: 'Header',        pct: 58 },
  { label: 'Query',         pct: 42 },
  { label: 'Form',          pct: 30 },
]

const DEV_TABS = ['Request', 'Response', 'Path', 'Header', 'Query', 'Form'] as const
type DevTab = (typeof DEV_TABS)[number]

const DEVIATIONS: Record<DevTab, { field: string; reason: string; count: string }[]> = {
  Header: [
    { field: 'card.securityCode', reason: 'ENUM Value Mismatch',        count: '1.5M' },
    { field: 'card.securityCode', reason: 'Missing Mandatory Parameter', count: '400K' },
    { field: 'loan.interestRate', reason: 'Additional Parameter Found',  count: '300K' },
    { field: 'loan.interestRate', reason: 'Data Type Mismatch',          count: '250K' },
    { field: 'account.number',    reason: 'Additional Parameter Found',  count: '200K' },
    { field: 'account.balance',   reason: 'Additional Parameter Found',  count: '80K'  },
  ],
  Request: [
    { field: 'auth.token',  reason: 'Missing Mandatory Parameter', count: '2.1M' },
    { field: 'auth.scope',  reason: 'ENUM Value Mismatch',         count: '650K' },
    { field: 'user.id',     reason: 'Data Type Mismatch',          count: '320K' },
    { field: 'session.key', reason: 'Additional Parameter Found',  count: '180K' },
    { field: 'request.id',  reason: 'Missing Mandatory Parameter', count: '95K'  },
    { field: 'timestamp',   reason: 'Invalid Format',              count: '40K'  },
  ],
  Response: [
    { field: 'response.status', reason: 'ENUM Value Mismatch',        count: '1.2M' },
    { field: 'response.body',   reason: 'Missing Mandatory Parameter', count: '430K' },
    { field: 'error.code',      reason: 'Data Type Mismatch',          count: '290K' },
    { field: 'error.message',   reason: 'Additional Parameter Found',  count: '150K' },
    { field: 'response.time',   reason: 'Invalid Format',              count: '88K'  },
    { field: 'content.type',    reason: 'Missing Mandatory Parameter', count: '55K'  },
  ],
  Path: [
    { field: '/v1/cards/{id}',    reason: 'Invalid Path Parameter',    count: '890K' },
    { field: '/v1/payments',      reason: 'Missing Mandatory Parameter', count: '560K' },
    { field: '/v1/accounts/{id}', reason: 'ENUM Value Mismatch',       count: '310K' },
    { field: '/v1/transactions',  reason: 'Data Type Mismatch',         count: '220K' },
    { field: '/v1/kyc',           reason: 'Additional Parameter Found', count: '140K' },
    { field: '/v1/auth',          reason: 'Invalid Format',             count: '70K'  },
  ],
  Query: [
    { field: 'page',   reason: 'Data Type Mismatch',          count: '1.1M' },
    { field: 'limit',  reason: 'ENUM Value Mismatch',         count: '500K' },
    { field: 'sort',   reason: 'Invalid Format',              count: '270K' },
    { field: 'filter', reason: 'Additional Parameter Found',  count: '190K' },
    { field: 'search', reason: 'Missing Mandatory Parameter', count: '110K' },
    { field: 'offset', reason: 'Data Type Mismatch',          count: '60K'  },
  ],
  Form: [
    { field: 'form.field1', reason: 'Missing Mandatory Parameter', count: '750K' },
    { field: 'form.data',   reason: 'Data Type Mismatch',          count: '420K' },
    { field: 'form.token',  reason: 'ENUM Value Mismatch',         count: '230K' },
    { field: 'form.submit', reason: 'Invalid Format',              count: '160K' },
    { field: 'form.id',     reason: 'Additional Parameter Found',  count: '90K'  },
    { field: 'form.type',   reason: 'Missing Mandatory Parameter', count: '45K'  },
  ],
}

const N = 30
const shadowRaw = Array.from({ length: N }, (_, i) => 25 + Math.sin(i * 0.3) * 2.5 + Math.cos(i * 0.5) * 1.5)
const zombieRaw = Array.from({ length: N }, (_, i) => 8 + i * 0.28 + Math.sin(i * 0.4 + 1) * 1.5)

export function ComplianceTab() {
  const [breakupMode, setBreakupMode] = useState<'REST/SOAP' | 'GraphQL'>('REST/SOAP')
  const [devTab, setDevTab] = useState<DevTab>('Header')

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1 */}
      <div className="grid grid-cols-[1fr_2fr_1fr] gap-4">
        <SectionCard
          title="Non-Compliant"
          icon={<BracketsCurly size={14} className="text-text-subtle" />}
        >
          <div className="flex flex-col gap-5 p-4">
            <StatBlock count="135k" label="Shadow Traffic" unsecurePct={10} barPct={60} delta="+8% vs last week" tone="bad" />
            <StatBlock count="35k"  label="Zombie Traffic" unsecurePct={5}  barPct={25} delta="-3% vs last week" tone="good" />
          </div>
        </SectionCard>

        <SectionCard
          title="Zombie - Shadow Distribution"
          icon={<ChartBar size={14} className="text-text-subtle" />}
        >
          <ZombieChart />
        </SectionCard>

        <SectionCard
          title="Top Non-Compliant APIs"
          icon={<MapPin size={14} className="text-text-subtle" />}
        >
          <div className="flex flex-col">
            {TOP_APIS.map((api, i) => (
              <div key={i} className="flex cursor-pointer items-center gap-2 border-b border-stroke-subsection px-3 py-2.5 last:border-b-0 hover:bg-surface-hover">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-medium text-text-default">{api.name}</div>
                  <div className="text-[11px] text-text-subdued">{api.tag}</div>
                </div>
                <span className="shrink-0 text-[12px] font-semibold text-text-default" style={{ fontFamily: MONO }}>{api.count}</span>
                <CaretRight size={13} className="shrink-0 text-text-disabled" />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 gap-4">
        <SectionCard
          title="Non-Compliant Breakup"
          icon={<BracketsCurly size={14} className="text-text-subtle" />}
          right={
            <div className="inline-flex h-6 items-center gap-0.5 rounded-md border border-stroke-subsection bg-white p-0.5">
              {(['REST/SOAP', 'GraphQL'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setBreakupMode(v)}
                  className={`h-full rounded px-2 text-[11px] font-medium transition-colors ${
                    breakupMode === v ? 'bg-surface-hover text-text-default' : 'text-text-subdued hover:text-text-default'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          }
        >
          <div className="flex flex-col">
            {BREAKUP_ROWS.map((row) => (
              <div key={row.label} className="flex items-center gap-3 border-b border-stroke-subsection px-3 py-2 last:border-b-0">
                <div className="w-28 shrink-0 text-[12px] text-text-default">{row.label}</div>
                <BreakupBar pct={row.pct} />
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-stroke-subsection px-3 py-1.5 text-[10px] text-text-subdued">
              <span>No. of API Transactions</span>
              <div className="flex w-[200px] justify-between">
                {['0', '4.5K', '7.5K', '10.5K', '13.5K'].map((v) => <span key={v}>{v}</span>)}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Deviations"
          icon={<TrendUp size={14} className="text-text-subtle" />}
          right={
            <div className="flex self-stretch items-stretch">
              {DEV_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDevTab(tab)}
                  className={`flex items-center border-b-2 px-2.5 text-[11px] font-medium transition-colors ${
                    devTab === tab
                      ? 'border-blue-default text-blue-default'
                      : 'border-transparent text-text-subdued hover:text-text-default'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          }
        >
          <div className="flex flex-col">
            <div className="grid grid-cols-[1fr_1fr_90px] border-b border-stroke-subsection bg-surface-table-header px-3 py-1.5 text-[11px] font-medium text-text-subdued">
              <div className="flex items-center gap-1">Deviation <ArrowsDownUp size={9} className="text-text-disabled" /></div>
              <div className="flex items-center gap-1">Reason <ArrowsDownUp size={9} className="text-text-disabled" /></div>
              <div className="flex items-center justify-end gap-1">Occurrence(s) <ArrowsDownUp size={9} className="text-text-disabled" /></div>
            </div>
            {DEVIATIONS[devTab].map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_90px] items-center border-b border-stroke-subsection px-3 py-2 text-[12px] last:border-b-0 hover:bg-surface-hover">
                <span className="font-mono text-text-default">{row.field}</span>
                <span className="text-text-subdued">{row.reason}</span>
                <span className="text-right font-semibold text-text-default" style={{ fontFamily: MONO }}>{row.count}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Row 3 */}
      <SectionCard
        title="Non-Compliant Countries"
        icon={<Globe size={14} className="text-text-subtle" />}
      >
        <div className="grid grid-cols-[1fr_340px] items-start gap-2 p-3">
          <WorldMap data={complianceCountries} showUnsecure={false} tooltipKind="compliance" />
          <div className="flex flex-col gap-0.5">
            {COUNTRY_LIST.map((c, i) => (
              <div key={i} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-surface-hover">
                <span className="w-4 text-[14px] leading-none">{c.flag}</span>
                <div className="flex-1 text-[12px] font-medium text-text-default">{c.name}</div>
                <div className="w-8 text-right text-[11px] text-text-subdued">{c.pct}%</div>
                <div className="w-7 text-right text-[12px] font-semibold text-text-default">{c.k}</div>
                <CountryBar pct={c.pct} />
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

function StatBlock({
  count, label, unsecurePct, barPct, delta, tone,
}: {
  count: string; label: string; unsecurePct: number; barPct: number; delta: string; tone: 'good' | 'bad'
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[24px] font-semibold leading-8 text-text-default" style={{ fontFamily: MONO }}>{count}</span>
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-text-subdued">{label}</span>
        <div className="flex items-center gap-1 text-[11px] text-text-subdued">
          <UnsecureDonut pct={unsecurePct} />
          <span>{unsecurePct}% Unsecure</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatBar pct={barPct} unsecurePct={unsecurePct} />
        <span className="shrink-0 text-[11px] font-medium text-text-subdued" style={{ fontFamily: MONO }}>{barPct}%</span>
      </div>
      <span className={`inline-block w-fit rounded-sm px-1.5 py-px text-[11px] font-medium text-text-default ${
        tone === 'good' ? 'bg-green-subtle' : 'bg-red-subtle'
      }`}>
        {delta}
      </span>
    </div>
  )
}

function UnsecureDonut({ pct }: { pct: number }) {
  const r = 5, cx = 6, cy = 6, size = 13
  const circumference = 2 * Math.PI * r
  const arc = (pct / 100) * circumference
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f97316" strokeWidth="2"
        strokeDasharray={`${arc} ${circumference - arc}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        strokeLinecap="round"
      />
    </svg>
  )
}

function ZombieChart() {
  const [show, setShow] = useState({ shadow: true, zombie: true })

  const W = 500, H = 200
  const PL = 16, PR = 0, PT = 10, PB = 22
  const pw = W - PL - PR
  const ph = H - PT - PB
  const maxY = 150

  const toX = (i: number) => PL + (i / (N - 1)) * pw
  const toY = (v: number) => PT + (1 - Math.min(v, maxY) / maxY) * ph
  const base = PT + ph

  const linePath = (data: number[]) =>
    data.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')

  const areaPath = (data: number[]) =>
    `${linePath(data)} L${toX(N - 1).toFixed(1)},${base.toFixed(1)} L${PL.toFixed(1)},${base.toFixed(1)} Z`

  const yTicks = [0, 25, 150]
  const midY = (PT + base) / 2

  const toggleSeries = (key: 'shadow' | 'zombie') =>
    setShow((s) => ({ ...s, [key]: !s[key] }))

  return (
    <div className="flex flex-col">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200 }}>
        <defs>
          <linearGradient id="cg-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1749c9" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1749c9" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="cg-zombie" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78bbfa" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#78bbfa" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Y-axis label "Traffic" rotated */}
        <text
          x={0}
          y={0}
          fontSize={9}
          fill="#9ca3af"
          fontFamily={MONO}
          textAnchor="middle"
          transform={`rotate(-90) translate(-${midY.toFixed(0)}, 10)`}
        >
          Traffic
        </text>

        {/* Grid lines + Y tick labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={PL} x2={W - PR} y1={toY(v)} y2={toY(v)} stroke="#e0e1e9" strokeWidth="0.5" />
            <text x={PL - 4} y={toY(v) + 3.5} textAnchor="end" fontSize={9} fill="#9ca3af" fontFamily={MONO}>
              {v === 0 ? '0' : `${v}M`}
            </text>
          </g>
        ))}

        {/* X-axis date labels */}
        <text x={PL} y={H - 5} fontSize={9} fill="#9ca3af" fontFamily={MONO}>Jan 1</text>
        <text x={W - PR} y={H - 5} fontSize={9} fill="#9ca3af" fontFamily={MONO} textAnchor="end">Jan 30</text>

        {/* Series */}
        {show.shadow && (
          <>
            <path d={areaPath(shadowRaw)} fill="url(#cg-shadow)" />
            <path d={linePath(shadowRaw)} fill="none" stroke="#1749c9" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          </>
        )}
        {show.zombie && (
          <>
            <path d={areaPath(zombieRaw)} fill="url(#cg-zombie)" />
            <path d={linePath(zombieRaw)} fill="none" stroke="#78bbfa" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          </>
        )}
      </svg>

      {/* Interactive legend */}
      <div className="flex items-center justify-center gap-6 py-2.5">
        {([
          { key: 'shadow' as const, label: 'Shadow', color: '#1c8cfd' },
          { key: 'zombie' as const, label: 'Zombie', color: '#78bbfa' },
        ]).map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleSeries(key)}
            className="flex items-center gap-1.5"
          >
            <span
              className="flex h-3 w-3 shrink-0 items-center justify-center rounded-[2px]"
              style={{
                background: show[key] ? '#0054b6' : 'transparent',
                border: show[key] ? 'none' : '1px solid #a5adbd',
              }}
            >
              {show[key] && (
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <path d="M1.5 4l1.8 1.8L6.5 2" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="h-[14px] w-[3px] shrink-0 rounded-[1px]" style={{ background: color }} />
            <span className="text-[12px] font-semibold text-[#40444c]">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function StatBar({ pct, unsecurePct = 0 }: { pct: number; unsecurePct?: number }) {
  const segs = 50
  const filled = Math.round((pct / 100) * segs)
  const unsecureSegs = Math.max(1, Math.round((unsecurePct / 100) * filled))
  return (
    <div className="flex flex-1 items-center gap-[2px]">
      {Array.from({ length: segs }).map((_, i) => {
        const bg = i >= filled ? '#e0e1e9' : i >= filled - unsecureSegs ? '#f97316' : '#1c8cfd'
        return <span key={i} className="h-2 flex-1 rounded-[1px]" style={{ background: bg }} />
      })}
    </div>
  )
}

function BreakupBar({ pct }: { pct: number }) {
  const segs = 40
  const filled = Math.round((pct / 100) * segs)
  return (
    <div className="flex flex-1 items-center gap-[2px]">
      {Array.from({ length: segs }).map((_, i) => (
        <span key={i} className="h-2.5 flex-1 rounded-[1px]" style={{ background: i < filled ? '#1c8cfd' : '#e0e1e9' }} />
      ))}
    </div>
  )
}

function CountryBar({ pct }: { pct: number }) {
  const segs = 20
  const filled = Math.max(1, Math.round((pct / 20) * segs))
  return (
    <div className="flex w-[90px] items-center gap-[2px]">
      {Array.from({ length: segs }).map((_, i) => (
        <span key={i} className="h-2 flex-1 rounded-[1px]" style={{ background: i < filled ? '#f97316' : '#e0e1e9' }} />
      ))}
    </div>
  )
}
