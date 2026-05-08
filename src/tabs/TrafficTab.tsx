import { useState, useEffect, useRef } from 'react'
import { FunnelSimple, CaretUpDown, CaretUp, CaretDown, Plus } from '@phosphor-icons/react'

type Props = { activeSubTab?: 'Resources' | 'Endpoints' }
type Method = 'POST' | 'GET' | 'PUT' | 'NEW' | 'DELETE'
type SortKey = 'lastActive' | 'compliance' | 'successRate' | 'security' | 'regions' | 'dataType' | null
type FilterStep = 'idle' | 'field' | 'operator' | 'value'
type BuiltFilter = { field: string; operator: string; value: string; connector: 'AND' | 'OR' }

const MONO = "'Roboto Mono', 'JetBrains Mono', monospace"

const METHOD_COLOR: Record<Method, string> = {
  POST:   '#1c8cfd',
  GET:    '#16a34a',
  PUT:    '#d97706',
  NEW:    '#0e7490',
  DELETE: '#dc2626',
}

const ALL_METHODS: Method[] = ['POST', 'GET', 'PUT', 'NEW', 'DELETE']

const FILTER_FIELDS = ['Source Type', 'Domain', 'Endpoint', 'Method', 'Status', 'Service', 'Data Type']

const FILTER_OPERATORS = [
  { symbol: '=', label: 'Equals' },
  { symbol: '!=', label: 'Not Equal' },
]

const FILTER_VALUES: Record<string, string[]> = {
  'Source Type': ['API Builder', 'Microservices', 'Gateway logs', 'Spec import (OAS)'],
  'Domain':      ['api.acme.com', 'api2.acme.com'],
  'Method':      ['POST', 'GET', 'PUT', 'DELETE', 'NEW'],
  'Status':      ['Active', 'Shadow'],
  'Service':     ['Payment Service', 'Reporting Service', 'Config Service'],
  'Data Type':   ['Credit Card', 'PCI', 'PR'],
  'Endpoint':    ['v1/transactions', 'v1/cards', 'v1/payments', 'v1/customers'],
}

type Row = {
  id: number; method: Method; resource: string; endpoint: string; traffic: string
  oas: string; oasState: 'linked' | 'create' | 'none'; status: 'Active' | 'Shadow'
  lastActive: string; domain: string; sourceType: string; sourceCount: number
  ip: string; ipCount: number
  compliance: { fail: string; pass: string; failPct: number }
  successRate: { pct: number }
  security: { fail: string; pass: string; failPct: number }
  userAgent: string; region: string; dataTypes: string[]; dataCount: number
}

const FLAGS: Record<string, string> = { Israel: '🇮🇱', Germany: '🇩🇪', USA: '🇺🇸', India: '🇮🇳', Brazil: '🇧🇷' }

const ROWS: Row[] = [
  { id: 1,  method: 'POST', resource: 'Transactions',   endpoint: 'v1/transactions',      traffic: '2.3M', oas: 'SavingsAccountAPI',     oasState: 'linked',  status: 'Active', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'API Builder',   sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 2,  method: 'POST', resource: 'Transactions',   endpoint: 'v1/transactions',      traffic: '2.3M', oas: '',                      oasState: 'create',  status: 'Shadow', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'API Builder',   sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 3,  method: 'POST', resource: 'Investments',    endpoint: '/v1/investments/{id}', traffic: '2.3M', oas: 'NotificationServiceAPI', oasState: 'linked',  status: 'Active', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'Microservices', sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 4,  method: 'GET',  resource: 'Authentication', endpoint: 'v1/authentication',   traffic: '5.7M', oas: '',                      oasState: 'none',    status: 'Active', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'API Builder',   sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 5,  method: 'NEW',  resource: 'Cards',          endpoint: 'v1/cards',            traffic: '5.7M', oas: 'AccountStatementAPI',   oasState: 'linked',  status: 'Active', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'API Builder',   sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 6,  method: 'GET',  resource: 'KYC',            endpoint: 'v1/kyc',              traffic: '5.7M', oas: 'AccountStatementAPI',   oasState: 'linked',  status: 'Active', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'API Builder',   sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 7,  method: 'NEW',  resource: 'Cards',          endpoint: 'v1/cards',            traffic: '5.7M', oas: 'KYCVerificationAPI',    oasState: 'linked',  status: 'Active', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'API Builder',   sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 8,  method: 'PUT',  resource: 'Cards',          endpoint: 'v1/cards',            traffic: '5.7M', oas: 'AccountStatementAPI',   oasState: 'linked',  status: 'Active', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'API Builder',   sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 9,  method: 'PUT',  resource: 'Support',        endpoint: 'v1/support',          traffic: '5.7M', oas: '',                      oasState: 'create',  status: 'Shadow', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'API Builder',   sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 10, method: 'POST', resource: 'Cards',          endpoint: 'v1/cards',            traffic: '5.7M', oas: 'AccountStatementAPI',   oasState: 'linked',  status: 'Active', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'API Builder',   sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 11, method: 'PUT',  resource: 'Payments',       endpoint: 'v1/payments',         traffic: '5.7M', oas: '',                      oasState: 'create',  status: 'Shadow', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'API Builder',   sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 12, method: 'PUT',  resource: 'Cards',          endpoint: 'v1/cards',            traffic: '5.7M', oas: 'KYCVerificationAPI',    oasState: 'linked',  status: 'Active', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'API Builder',   sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 13, method: 'GET',  resource: 'Cards',          endpoint: 'v1/cards',            traffic: '5.7M', oas: '',                      oasState: 'create',  status: 'Shadow', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'API Builder',   sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 14, method: 'GET',  resource: 'Customers',      endpoint: 'v1/customers',        traffic: '5.7M', oas: '',                      oasState: 'create',  status: 'Shadow', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'API Builder',   sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 15, method: 'PUT',  resource: 'Investments',    endpoint: 'v1/investments',      traffic: '5.7M', oas: '',                      oasState: 'create',  status: 'Active', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'API Builder',   sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
  { id: 16, method: 'POST', resource: 'Customers',      endpoint: 'v1/customers',        traffic: '5.7M', oas: 'KYCVerificationAPI',    oasState: 'linked',  status: 'Active', lastActive: 'Nov 27, 20:55:05.321', domain: 'api.acme.com', sourceType: 'Microservices', sourceCount: 1, ip: '69.162.81.155', ipCount: 1, compliance: { fail: '22k', pass: '88k', failPct: 20 }, successRate: { pct: 15 }, security: { fail: '66k', pass: '46k', failPct: 60 }, userAgent: 'Safari 14 on macOS 10.15.7', region: 'Israel', dataTypes: ['Credit Card', 'PCI', 'PR'], dataCount: 9 },
]

// ─── CircleProgress ───────────────────────────────────────────────────────────
function CircleProgress({ pct }: { pct: number }) {
  const r = 6, c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  return (
    <div className="flex items-center gap-1">
      <svg width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r={r} fill="none" stroke="#e0e1e9" strokeWidth="2.5" />
        <circle cx="8" cy="8" r={r} fill="none" stroke="#22c55e" strokeWidth="2.5"
          strokeDasharray={`${dash} ${c - dash}`} strokeLinecap="round"
          transform="rotate(-90 8 8)" />
      </svg>
      <span className="text-[11px] font-medium text-text-default" style={{ fontFamily: MONO }}>{pct}%</span>
    </div>
  )
}

// ─── MiniDualBar ─────────────────────────────────────────────────────────────
function MiniDualBar({ a, b, aColor, bColor, failPct }: { a: string; b: string; aColor: string; bColor: string; failPct: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold" style={{ color: aColor, fontFamily: MONO }}>{a}</span>
        <span className="text-[11px] font-semibold" style={{ color: bColor, fontFamily: MONO }}>{b}</span>
      </div>
      <div className="flex h-[3px] w-full overflow-hidden rounded-full">
        <div style={{ width: `${failPct}%`, background: aColor }} />
        <div style={{ width: `${100 - failPct}%`, background: bColor }} />
      </div>
    </div>
  )
}

// ─── MethodFilterDropdown ────────────────────────────────────────────────────
function MethodFilterDropdown({ selected, onToggle }: { selected: Set<Method>; onToggle: (m: Method) => void }) {
  return (
    <div
      className="absolute left-0 top-full z-50 mt-1 min-w-[140px] overflow-hidden rounded-md border border-stroke-subsection bg-white shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {ALL_METHODS.map((method) => (
        <label key={method} className="flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-surface-hover">
          <span
            className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border ${
              selected.has(method) ? 'border-blue-default bg-blue-default' : 'border-stroke-subsection bg-white'
            }`}
            onClick={() => onToggle(method)}
          >
            {selected.has(method) && (
              <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4l1.8 1.8L6.5 2" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            )}
          </span>
          <span className="text-[12px] font-semibold" style={{ color: METHOD_COLOR[method], fontFamily: MONO }}>{method}</span>
        </label>
      ))}
    </div>
  )
}

// ─── FilterChip ──────────────────────────────────────────────────────────────
function FilterChip({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <span className={`shrink-0 rounded bg-white px-2 py-[1px] text-[12px] shadow-sm ${muted ? 'text-text-disabled' : 'text-text-default'}`}>
      {label}
    </span>
  )
}

// ─── ConnectorChip ────────────────────────────────────────────────────────────
function ConnectorChip({ value, onChange }: { value: 'AND' | 'OR'; onChange: (v: 'AND' | 'OR') => void }) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const enter = () => { if (timer.current) clearTimeout(timer.current); setOpen(true) }
  const leave = () => { timer.current = setTimeout(() => setOpen(false), 120) }

  return (
    <div className="relative shrink-0" onMouseEnter={enter} onMouseLeave={leave}>
      <span className="cursor-pointer text-[11px] font-semibold text-blue-default">{value}</span>
      {open && (
        <div
          className="absolute left-0 top-full z-50 overflow-hidden rounded-md border border-stroke-subsection bg-white shadow-md"
          onMouseEnter={enter}
          onMouseLeave={leave}
          onClick={(e) => e.stopPropagation()}
        >
          {(['AND', 'OR'] as const).map((opt) => (
            <button
              key={opt}
              className={`flex w-full items-center px-4 py-1.5 text-left text-[12px] hover:bg-surface-hover ${opt === value ? 'font-semibold text-blue-default' : 'text-text-default'}`}
              onClick={(e) => { e.stopPropagation(); onChange(opt); setOpen(false) }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── main ─────────────────────────────────────────────────────────────────────
export function TrafficTab({ activeSubTab: initialSubTab = 'Resources' }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<'Resources' | 'Endpoints'>(initialSubTab)
  const [filter, setFilter] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [methodFilters, setMethodFilters] = useState<Set<Method>>(new Set())
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const [filterStep, setFilterStep] = useState<FilterStep>('idle')
  const [pendingFilter, setPendingFilter] = useState({ field: '', operator: '' })
  const [builtFilters, setBuiltFilters] = useState<BuiltFilter[]>([])
  const [filterQuery, setFilterQuery] = useState('')
  const [methodConnector, setMethodConnector] = useState<'AND' | 'OR'>('AND')

  const filterAreaRef = useRef<HTMLDivElement>(null)
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setOpenFilter(null)
      const t = e.target as Node
      if (!filterAreaRef.current?.contains(t) && !filterDropdownRef.current?.contains(t)) {
        setFilterStep('idle')
        setPendingFilter({ field: '', operator: '' })
        setFilterQuery('')
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  function toggleMethod(m: Method) {
    setMethodFilters((prev) => {
      const next = new Set(prev)
      next.has(m) ? next.delete(m) : next.add(m)
      return next
    })
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  function selectField(field: string) {
    setPendingFilter({ field, operator: '' })
    setFilterStep('operator')
    setFilterQuery('')
  }

  function selectOperator(op: string) {
    setPendingFilter((prev) => ({ ...prev, operator: op }))
    setFilterStep('value')
    setFilterQuery('')
  }

  function selectValue(value: string) {
    setBuiltFilters((prev) => [...prev, { field: pendingFilter.field, operator: pendingFilter.operator, value, connector: 'AND' }])
    setPendingFilter({ field: '', operator: '' })
    setFilterStep('idle')
    setFilterQuery('')
  }

  function matchFilter(r: Row, f: BuiltFilter) {
    let val = ''
    switch (f.field) {
      case 'Source Type': val = r.sourceType; break
      case 'Domain':      val = r.domain; break
      case 'Method':      val = r.method; break
      case 'Status':      val = r.status; break
      case 'Endpoint':    val = r.endpoint; break
      case 'Service':     val = r.sourceType; break
      case 'Data Type':   val = r.dataTypes[0] ?? ''; break
    }
    if (f.operator === '=')  return val === f.value
    if (f.operator === '!=') return val !== f.value
    return true
  }

  const filtered = ROWS.filter((r) => {
    const searchOk = !filter || r.resource.toLowerCase().includes(filter.toLowerCase()) || r.endpoint.toLowerCase().includes(filter.toLowerCase()) || r.method.toLowerCase().includes(filter.toLowerCase())
    if (!searchOk) return false

    // Build ordered list of conditions + the connector that follows each one
    const conditions: boolean[] = []
    const connectors: ('AND' | 'OR')[] = []
    if (methodFilters.size > 0) {
      conditions.push(methodFilters.has(r.method))
      connectors.push(methodConnector)
    }
    for (const f of builtFilters) {
      conditions.push(matchFilter(r, f))
      connectors.push(f.connector)
    }
    if (conditions.length === 0) return true
    // connectors[i] sits between conditions[i] and conditions[i+1]; last one is unused
    let acc = conditions[0]
    for (let i = 1; i < conditions.length; i++) {
      acc = connectors[i - 1] === 'AND' ? acc && conditions[i] : acc || conditions[i]
    }
    return acc
  })

  const visibleFields = FILTER_FIELDS.filter((f) => !filterQuery || f.toLowerCase().includes(filterQuery.toLowerCase()))
  const visibleValues = (FILTER_VALUES[pendingFilter.field] ?? []).filter((v) => !filterQuery || v.toLowerCase().includes(filterQuery.toLowerCase()))

  const colLabel = activeSubTab === 'Endpoints' ? 'Endpoints' : 'Resources'
  const methodLabel = methodFilters.size > 0 ? `Method (${methodFilters.size})` : 'Method'
  const hasFilters = methodFilters.size > 0 || builtFilters.length > 0

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-stroke-subsection bg-white">

        {/* toolbar */}
        <div className="relative flex h-9 items-stretch border-b border-stroke-subsection">
          <div className="flex items-center px-4 text-[12px] font-medium text-text-default">{activeSubTab}</div>
          <div className="my-2 w-px bg-stroke-subsection" />

          {/* filter input area */}
          <div
            ref={filterAreaRef}
            className="relative mx-2 my-1.5 flex flex-1 cursor-text items-center gap-2 rounded bg-surface-table-header px-4 py-1"
            onClick={() => { if (filterStep === 'idle') setFilterStep('field') }}
          >
            <FunnelSimple size={12} className="shrink-0 text-text-disabled" />

            {/* method filter chip */}
            {methodFilters.size > 0 && (
              <>
                <FilterChip label={`Method = ${Array.from(methodFilters).join(', ')}`} />
                <ConnectorChip value={methodConnector} onChange={setMethodConnector} />
              </>
            )}

            {/* built filter chips */}
            {builtFilters.map((f, i) => (
              <span key={i} className="contents">
                <FilterChip label={`${f.field} ${f.operator} ${f.value}`} />
                <ConnectorChip
                  value={f.connector}
                  onChange={(v) => setBuiltFilters((prev) => prev.map((bf, idx) => idx === i ? { ...bf, connector: v } : bf))}
                />
              </span>
            ))}

            {/* pending chip (while building) */}
            {filterStep === 'operator' && <FilterChip label={pendingFilter.field} muted />}
            {filterStep === 'value'    && <FilterChip label={`${pendingFilter.field} ${pendingFilter.operator}`} muted />}

            {/* always-visible input */}
            <input
              value={filterStep === 'idle' ? filter : filterQuery}
              onChange={(e) => {
                const val = e.target.value
                if (filterStep === 'idle') {
                  setFilter(val)
                } else {
                  setFilterQuery(val)
                }
              }}
              onFocus={() => { if (filterStep === 'idle') { setFilterStep('field'); setFilterQuery('') } }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                  const currentVal = filterStep === 'idle' ? filter : filterQuery
                  if (currentVal === '') {
                    if (builtFilters.length > 0) setBuiltFilters((p) => p.slice(0, -1))
                    else if (methodFilters.size > 0) setMethodFilters((prev) => { const a = Array.from(prev); return new Set(a.slice(0, -1)) })
                  }
                }
              }}
              placeholder={hasFilters || filterStep !== 'idle' ? '' : 'Type to filter'}
              className="min-w-[40px] flex-1 bg-transparent text-[12px] text-text-default outline-none placeholder:text-text-disabled"
              onClick={(e) => e.stopPropagation()}
            />

            {/* filter builder dropdown — full width of filter area */}
            {filterStep !== 'idle' && (
              <div
                ref={filterDropdownRef}
                className="absolute left-0 right-0 top-full z-50 overflow-hidden rounded-md border border-stroke-subsection bg-white shadow-lg"
              >
              {filterStep === 'field' && visibleFields.map((f) => (
                <button
                  key={f}
                  className="flex w-full items-center px-4 py-2 text-left text-[12px] text-text-default hover:bg-surface-hover"
                  onClick={(e) => { e.stopPropagation(); selectField(f) }}
                >
                  {f}
                </button>
              ))}
              {filterStep === 'operator' && FILTER_OPERATORS.map((op) => (
                <button
                  key={op.symbol}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-[12px] text-text-default hover:bg-surface-hover"
                  onClick={(e) => { e.stopPropagation(); selectOperator(op.symbol) }}
                >
                  <span className="w-5 shrink-0 font-mono text-[13px] text-text-subdued">{op.symbol}</span>
                  <span>{op.label}</span>
                </button>
              ))}
              {filterStep === 'value' && visibleValues.map((v) => (
                <button
                  key={v}
                  className="flex w-full items-center px-4 py-2 text-left text-[12px] text-text-default hover:bg-surface-hover"
                  onClick={(e) => { e.stopPropagation(); selectValue(v) }}
                >
                  {v}
                </button>
              ))}
              </div>
            )}
          </div>

          <button className="flex items-center border-l border-stroke-subsection px-3 text-[#8c909e] hover:text-text-default">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <line x1="6"  y1="1"  x2="6"  y2="15" stroke="currentColor" strokeWidth="1" />
              <line x1="11" y1="1"  x2="11" y2="15" stroke="currentColor" strokeWidth="1" />
              <line x1="1"  y1="6"  x2="15" y2="6"  stroke="currentColor" strokeWidth="1" />
              <line x1="1"  y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </div>

        {/* scrollable table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]" style={{ minWidth: 1800 }}>
            <thead>
              <tr className="border-b border-stroke-subsection bg-surface-table-header text-left">

                {/* Method header — with filter dropdown */}
                <th className="group/h relative px-3 py-1.5 text-[11px] font-semibold text-text-subdued whitespace-nowrap"
                    style={{ width: 80, minWidth: 80, position: 'sticky', left: 0, zIndex: 10, background: 'inherit' }}>
                  <div className="flex items-center gap-1">
                    <span>{methodLabel}</span>
                    <button
                      className="opacity-0 group-hover/h:opacity-100 transition-opacity text-text-disabled"
                      onClick={(e) => { e.stopPropagation(); setOpenFilter((o) => (o === 'method' ? null : 'method')) }}
                    >
                      <FunnelSimple size={11} />
                    </button>
                  </div>
                  {openFilter === 'method' && (
                    <MethodFilterDropdown selected={methodFilters} onToggle={toggleMethod} />
                  )}
                </th>

                <Th sticky left={80}  w={200} sortKey={sortKey} dir={sortDir}>{colLabel}</Th>
                <Th w={80}  sortKey={sortKey} dir={sortDir}>Traffic</Th>
                <Th w={190} sortKey={sortKey} dir={sortDir}>OAS</Th>
                <Th w={80}  sortKey={sortKey} dir={sortDir}>Status</Th>
                <Th w={190} col="lastActive"  sortKey={sortKey} dir={sortDir} onSort={handleSort}>Last Active</Th>
                <Th w={130} sortKey={sortKey} dir={sortDir}>Domain</Th>
                <Th w={160} sortKey={sortKey} dir={sortDir}>Source Type</Th>
                <Th w={140} sortKey={sortKey} dir={sortDir}>IP Address</Th>
                <Th w={130} col="compliance"  sortKey={sortKey} dir={sortDir} onSort={handleSort}>Compliance</Th>
                <Th w={110} col="successRate" sortKey={sortKey} dir={sortDir} onSort={handleSort}>Success Rate</Th>
                <Th w={120} col="security"    sortKey={sortKey} dir={sortDir} onSort={handleSort}>Security</Th>
                <Th w={210} sortKey={sortKey} dir={sortDir}>User Agent</Th>
                <Th w={90}  col="regions"     sortKey={sortKey} dir={sortDir} onSort={handleSort}>Regions</Th>
                <Th w={160} col="dataType"    sortKey={sortKey} dir={sortDir} onSort={handleSort}>Data Type</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-stroke-subsection last:border-b-0">
                  <Td sticky left={0} w={80}>
                    <span className="text-[12px] font-semibold" style={{ color: METHOD_COLOR[row.method], fontFamily: MONO }}>{row.method}</span>
                  </Td>
                  <Td sticky left={80} w={200}>
                    <span className="text-[12px] text-text-default">{activeSubTab === 'Endpoints' ? row.endpoint : row.resource}</span>
                  </Td>
                  <Td w={80}>
                    <span style={{ fontFamily: MONO }} className="text-[12px] text-text-default">{row.traffic}</span>
                  </Td>
                  <Td w={190}>
                    {row.oasState === 'linked' && <span className="text-[12px] text-text-default">{row.oas}</span>}
                    {row.oasState === 'create' && (
                      <button className="flex items-center gap-1 rounded-md border border-stroke-subsection bg-white px-2 py-0.5 text-[11px] font-medium text-text-default hover:bg-surface-hover">
                        <Plus size={10} /> Create OAS
                      </button>
                    )}
                    {row.oasState === 'none' && (
                      <span className="rounded bg-surface-hover px-1.5 py-0.5 text-[11px] text-text-disabled">No Design</span>
                    )}
                  </Td>
                  <Td w={80}>
                    <span className={`inline-flex items-center rounded-[4px] px-2 py-[1px] text-[12px] font-medium ${
                      row.status === 'Active' ? 'bg-[#b6f5c4] text-[#191b23]' : 'bg-[#e3e5f0] text-[#444b6b]'
                    }`}>{row.status}</span>
                  </Td>
                  <Td w={190}>
                    <span style={{ fontFamily: MONO }} className="text-[11px] text-text-subdued">{row.lastActive}</span>
                  </Td>
                  <Td w={130}><span className="text-[12px] text-text-default">{row.domain}</span></Td>
                  <Td w={160}>
                    <div className="flex items-center gap-1">
                      <span className="text-[12px] text-text-default">{row.sourceType}</span>
                      {row.sourceCount > 0 && <span className="rounded border border-stroke-subsection px-1 text-[10px] text-text-subdued">+{row.sourceCount}</span>}
                    </div>
                  </Td>
                  <Td w={140}>
                    <div className="flex items-center gap-1">
                      <span style={{ fontFamily: MONO }} className="text-[12px] text-text-default">{row.ip}</span>
                      {row.ipCount > 0 && <span className="rounded border border-stroke-subsection px-1 text-[10px] text-text-subdued">+{row.ipCount}</span>}
                    </div>
                  </Td>
                  <Td w={130}>
                    <MiniDualBar a={row.compliance.fail} b={row.compliance.pass} aColor="#f97316" bColor="#22c55e" failPct={row.compliance.failPct} />
                  </Td>
                  <Td w={110}><CircleProgress pct={row.successRate.pct} /></Td>
                  <Td w={120}>
                    <MiniDualBar a={row.security.fail} b={row.security.pass} aColor="#f97316" bColor="#22c55e" failPct={row.security.failPct} />
                  </Td>
                  <Td w={210}><span className="truncate text-[11px] text-text-subdued">{row.userAgent}</span></Td>
                  <Td w={90}><span className="text-[12px] text-text-default">{FLAGS[row.region] ?? ''} {row.region}</span></Td>
                  <Td w={160}>
                    <div className="flex flex-wrap items-center gap-1">
                      {row.dataTypes.slice(0, 2).map((t) => (
                        <span key={t} className="rounded border border-stroke-subsection px-1.5 py-[1px] text-[10px] text-text-subdued">{t}</span>
                      ))}
                      {row.dataCount > 0 && <span className="rounded border border-stroke-subsection px-1 py-[1px] text-[10px] text-text-subdued">+{row.dataCount}</span>}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Th ──────────────────────────────────────────────────────────────────────
function Th({ children, w, sticky, left, col, sortKey, dir, onSort }: {
  children: React.ReactNode; w: number; sticky?: boolean; left?: number
  col?: SortKey; sortKey?: SortKey; dir?: 'asc' | 'desc'; onSort?: (k: SortKey) => void
}) {
  const stickyStyle = sticky ? { position: 'sticky' as const, left, zIndex: 10, background: 'inherit' } : {}
  const isActive = col && col === sortKey
  return (
    <th className="group/h px-3 py-1.5 text-[11px] font-semibold text-text-subdued whitespace-nowrap"
        style={{ width: w, minWidth: w, ...stickyStyle }}>
      <div className="flex items-center gap-1">
        <span>{children}</span>
        {col && (
          <button
            className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover/h:opacity-100'}`}
            onClick={() => onSort?.(col)}
          >
            {isActive
              ? (dir === 'asc' ? <CaretUp size={10} className="text-blue-dark" /> : <CaretDown size={10} className="text-blue-dark" />)
              : <CaretUpDown size={10} className="text-text-disabled" />}
          </button>
        )}
        {!col && (
          <button className="opacity-0 group-hover/h:opacity-100 transition-opacity">
            <FunnelSimple size={10} className="text-text-disabled" />
          </button>
        )}
      </div>
    </th>
  )
}

// ─── Td ──────────────────────────────────────────────────────────────────────
function Td({ children, w, sticky, left }: { children: React.ReactNode; w: number; sticky?: boolean; left?: number }) {
  const stickyStyle = sticky ? { position: 'sticky' as const, left, zIndex: 5, background: '#ffffff' } : {}
  return (
    <td className="px-3 py-1.5 leading-none" style={{ width: w, minWidth: w, maxWidth: w, ...stickyStyle }}>
      {children}
    </td>
  )
}
