import { useState } from 'react'
import { Shield, Warning, CaretRight, Database, Broadcast } from '@phosphor-icons/react'
import { SectionCard } from '../components/Card'
import { MiniLineChart } from '../components/MiniLineChart'

const threats = [
  { name: 'JavaScript Security Vulnerability', sev: 'high' },
  { name: 'General Check: Unable to Process Request Body', sev: 'med' },
  { name: 'General Security Assessment Tool', sev: 'med' },
  { name: 'XSS: Cascading Style Sheet Exploitation', sev: 'high' },
  { name: 'General Check: SQL Injection Warning', sev: 'med' },
  { name: 'General Check: SQL Injection Vulnerability', sev: 'high' },
  { name: 'SQLI: Risk of SQL Injection', sev: 'high' },
  { name: 'General Check: SQL Injection Identified', sev: 'med' },
]

const sourcesByDomain = [
  { source: 'api.partner.com', vuln: '24% JavaScript Security Vulnerability', icon: '⊘' },
  { source: 'api.postman.com', vuln: '21% General Security Assessment Tool', icon: '⊘' },
  { source: 'api.stripe.com', vuln: '12% SQLI: Risk of SQL Injection', icon: '⊘' },
  { source: 'prod.acme.io', vuln: '11% General Check: SQL Injection Vulnerability', icon: '⊘' },
  { source: 'prod.acme.io', vuln: '23% General Check: SQL Injection Vulnerability', icon: '⊘' },
  { source: 'prod.acme.io', vuln: '21% General Check: SQL Injection Vulnerability', icon: '⊘' },
  { source: 'uat.acme.io', vuln: '21% SQLI: Risk of SQL Injection', icon: '⊘' },
  { source: 'uat.acme.io', vuln: '15% General Check: SQL Injection Identified', icon: '⊘' },
]

const sourcesByIP = [
  { source: '203.0.113.4', vuln: '24% JavaScript Security Vulnerability', icon: '⊘' },
  { source: '198.51.100.21', vuln: '21% General Security Assessment Tool', icon: '⊘' },
  { source: '192.0.2.55', vuln: '12% SQLI: Risk of SQL Injection', icon: '⊘' },
  { source: '203.0.113.92', vuln: '11% General Check: SQL Injection Vulnerability', icon: '⊘' },
  { source: '198.51.100.7', vuln: '23% General Check: SQL Injection Vulnerability', icon: '⊘' },
  { source: '192.0.2.118', vuln: '21% General Check: SQL Injection Vulnerability', icon: '⊘' },
  { source: '203.0.113.144', vuln: '21% SQLI: Risk of SQL Injection', icon: '⊘' },
  { source: '198.51.100.200', vuln: '15% General Check: SQL Injection Identified', icon: '⊘' },
]

const ipRiskDomain = [
  { ip: '101.42.16.7', risk: 'High', count: '12.4k', desc: 'Known IP Threats' },
  { ip: '203.0.113.92', risk: 'High', count: '9.1k', desc: 'TOR Exit Node' },
  { ip: '198.51.100.21', risk: 'Medium', count: '6.2k', desc: 'Spam Source' },
  { ip: '192.0.2.55', risk: 'Medium', count: '5.7k', desc: 'Open Proxy' },
  { ip: '203.0.113.144', risk: 'Low', count: '3.4k', desc: 'Suspicious' },
]

const sensitive = [
  { type: 'Credit Card Number', source: 'api.partner.com', count: '12.4k', tone: 'high' },
  { type: 'Email Address', source: 'api.postman.com', count: '24.7k', tone: 'med' },
  { type: 'SSN', source: 'prod.acme.io', count: '6.1k', tone: 'high' },
  { type: 'Phone Number', source: 'uat.acme.io', count: '14.2k', tone: 'med' },
  { type: 'IP Address', source: 'api.stripe.com', count: '21.5k', tone: 'low' },
]

export function SecurityTab() {
  const [sourceMode, setSourceMode] = useState<'Domain' | 'IP Address'>('Domain')
  const [sensMode, setSensMode] = useState<'Domain' | 'IP Address'>('Domain')

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <SectionCard
          title="Security Threats"
          icon={<Shield size={14} className="text-text-subtle" />}
        >
          <div className="flex items-center justify-between gap-2 border-b border-stroke-subsection bg-surface-l2 px-3 py-2">
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-text-default">
              <Warning size={13} className="text-red-medium" />
              <span className="font-mono text-[11px] font-semibold">/v1/payments</span>
              <span className="text-text-subdued">is the most targeted API (22% of threats).</span>
            </div>
            <button className="flex items-center gap-0.5 text-[12px] font-medium hover:text-blue-dark">
              View <CaretRight size={13} />
            </button>
          </div>

          <div className="flex flex-col">
            {threats.map((t, i) => (
              <ThreatRow key={i} {...t} />
            ))}
            <div className="flex items-center justify-between border-t border-stroke-subsection px-3 py-1.5 text-[10px] text-text-subdued">
              <span>No. of API Transactions</span>
              <div className="flex w-[260px] justify-between">
                {['0', '4.5K', '7.5K', '10.5K', '13.5K'].map((v) => <span key={v}>{v}</span>)}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Unsecure Sources"
          icon={<Broadcast size={14} className="text-text-subtle" />}
          right={<DomainIPToggle value={sourceMode} onChange={setSourceMode} />}
        >
          <div className="flex items-center justify-between gap-2 border-b border-stroke-subsection bg-surface-l2 px-3 py-2">
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-text-default">
              <Warning size={13} className="text-red-medium" />
              <span className="font-mono text-[11px] font-semibold">{sourceMode === 'Domain' ? 'api.partner.com' : '203.0.113.4'}</span>
              <span className="text-text-subdued">has 68% unsecure traffic.</span>
            </div>
            <button className="flex items-center gap-0.5 text-[12px] font-medium hover:text-blue-dark">
              View <CaretRight size={13} />
            </button>
          </div>
          <div className="flex flex-col">
            {(sourceMode === 'Domain' ? sourcesByDomain : sourcesByIP).map((s, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-stroke-subsection px-3 py-2 last:border-b-0 hover:bg-surface-hover">
                <div className="w-44 truncate text-[12px] font-medium text-text-default">{s.source}</div>
                <BarTrack pct={70 - i * 5} />
                <div className="flex flex-1 items-center gap-1 text-[11px] text-text-subdued">
                  <span className="text-red-medium">⊘</span>
                  {s.vuln}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-stroke-subsection px-3 py-1.5 text-[10px] text-text-subdued">
              <span>No. of Unsecure Transactions</span>
              <div className="flex w-[200px] justify-between">
                {['0', '4.5K', '7.5K', '10.5K', '13.5K'].map((v) => <span key={v}>{v}</span>)}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SectionCard title="IP Risk Profile" icon={<Database size={14} className="text-text-subtle" />}>
          <div className="grid grid-cols-[1fr_70px_60px_120px] gap-3 border-b border-stroke-subsection bg-surface-table-header px-3 py-1.5 text-[11px] font-medium text-text-subdued">
            <span>IP</span><span>Risk</span><span>Count</span><span>Description</span>
          </div>
          <div className="flex flex-col">
            {ipRiskDomain.map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_70px_60px_120px] gap-3 border-b border-stroke-subsection px-3 py-2 text-[12px] last:border-b-0">
                <span className="font-mono text-text-default">{row.ip}</span>
                <span className={
                  row.risk === 'High' ? 'rounded-sm bg-red-subtle px-1 py-0.5 text-[10px] font-semibold text-red-dark w-fit' :
                  row.risk === 'Medium' ? 'rounded-sm bg-orange-medium/30 px-1 py-0.5 text-[10px] font-semibold text-orange-default w-fit' :
                  'rounded-sm bg-green-subtle px-1 py-0.5 text-[10px] font-semibold text-green-dark w-fit'
                }>{row.risk}</span>
                <span className="text-text-default font-medium">{row.count}</span>
                <span className="text-text-subdued">{row.desc}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Sensitive Data Types"
          icon={<Shield size={14} className="text-text-subtle" />}
          right={<DomainIPToggle value={sensMode} onChange={setSensMode} />}
        >
          <div className="grid grid-cols-[1fr_1fr_70px] gap-3 border-b border-stroke-subsection bg-surface-table-header px-3 py-1.5 text-[11px] font-medium text-text-subdued">
            <span>Data Type</span><span>{sensMode}</span><span className="text-right">Count</span>
          </div>
          <div className="flex flex-col">
            {sensitive.map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_70px] items-center gap-3 border-b border-stroke-subsection px-3 py-2 text-[12px] last:border-b-0">
                <span className="font-medium text-text-default">{row.type}</span>
                <span className="font-mono text-text-subdued">{sensMode === 'Domain' ? row.source : `192.0.2.${i + 12}`}</span>
                <span className="text-right font-medium text-text-default">{row.count}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

function ThreatRow({ name }: { name: string; sev: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-stroke-subsection px-3 py-2 last:border-b-0 hover:bg-surface-hover">
      <div className="w-56 truncate text-[12px] font-medium text-text-default">{name}</div>
      <BarTrack pct={Math.random() * 60 + 30} />
      <div className="h-5 w-16 shrink-0">
        <MiniLineChart data={Array.from({ length: 16 }, (_, k) => ({ x: k, y: 50 + Math.sin(k + name.length) * 8 + Math.random() * 4 }))} color="#1c8cfd" />
      </div>
    </div>
  )
}

function BarTrack({ pct }: { pct: number }) {
  const segs = 36
  const filled = Math.round((pct / 100) * segs)
  return (
    <div className="flex flex-1 items-center gap-[2px]">
      {Array.from({ length: segs }).map((_, i) => (
        <span key={i} className="h-2.5 w-[3px] rounded-[1px]" style={{ background: i < filled ? '#1c8cfd' : '#e0e1e9' }} />
      ))}
    </div>
  )
}

function DomainIPToggle({ value, onChange }: { value: 'Domain' | 'IP Address'; onChange: (v: 'Domain' | 'IP Address') => void }) {
  return (
    <div className="inline-flex h-6 items-center gap-0.5 rounded-md border border-stroke-subsection bg-white p-0.5">
      {(['Domain', 'IP Address'] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`h-full rounded px-2 text-[11px] font-medium transition-colors ${
            value === v ? 'bg-surface-hover text-text-default' : 'text-text-subdued hover:text-text-default'
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  )
}
