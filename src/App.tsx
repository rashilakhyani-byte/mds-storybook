import { useState } from 'react'
import { Toolbar } from './components/Toolbar'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { MetricCards, type MetricKey } from './components/MetricCards'
import { OverviewTab } from './tabs/OverviewTab'
import { PerformanceTab } from './tabs/PerformanceTab'
import { SecurityTab } from './tabs/SecurityTab'
import { ComplianceTab } from './tabs/ComplianceTab'
import { TrafficTab } from './tabs/TrafficTab'
import { AIAssistPanel } from './components/AIAssistPanel'

type TrafficTab = 'overview' | 'resources' | 'endpoints' | 'domain'

const TRAFFIC_TABS: { value: TrafficTab; label: string }[] = [
  { value: 'overview',   label: 'Overview' },
  { value: 'resources',  label: 'Resources' },
  { value: 'endpoints',  label: 'Endpoints' },
  { value: 'domain',     label: 'Domain' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<MetricKey>('traffic')
  const [trafficTab, setTrafficTab] = useState<TrafficTab>('overview')
  const [aiPanelOpen, setAiPanelOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen flex-col bg-white text-text-default">
      <Toolbar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <Header onAiAssistClick={() => setAiPanelOpen(true)} />

          <div className="px-4 pt-4">
            <MetricCards active={activeTab} onSelect={setActiveTab} />
          </div>

          {/* Flat tab bar — only for Traffic */}
          {activeTab === 'traffic' && (
            <div className="flex shrink-0 items-center gap-1 border-b border-stroke-subsection px-4">
              {TRAFFIC_TABS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTrafficTab(value)}
                  className={`relative h-9 px-3 text-[13px] font-medium transition-colors ${
                    trafficTab === value
                      ? 'text-blue-default after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-blue-default after:content-[""]'
                      : 'text-text-subdued hover:text-text-default'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto scroll-thin">
            <div className="flex flex-col gap-4 p-4">
              {activeTab === 'traffic' && trafficTab === 'overview'   && <OverviewTab />}
              {activeTab === 'traffic' && trafficTab === 'resources'  && <TrafficTab activeSubTab="Resources" />}
              {activeTab === 'traffic' && trafficTab === 'endpoints'  && <TrafficTab activeSubTab="Endpoints" />}
              {activeTab === 'traffic' && trafficTab === 'domain'     && <TrafficTab activeSubTab="Resources" />}
              {activeTab === 'performance' && <PerformanceTab />}
              {activeTab === 'security'    && <SecurityTab />}
              {activeTab === 'compliance'  && <ComplianceTab />}
            </div>
          </div>

          <AIAssistPanel open={aiPanelOpen} onClose={() => setAiPanelOpen(false)} />
        </main>
      </div>
    </div>
  )
}
