import {
  LayoutGrid, Zap, Activity, Shield, FileText, Network, Workflow, Boxes,
  GitBranch, Users, Settings2, BarChart3, Database, Lock, Globe, Clock,
} from 'lucide-react'

const top = [
  { icon: LayoutGrid, label: 'API', active: true },
  { icon: FileText, label: 'Catalog' },
  { icon: Boxes, label: 'Products' },
  { icon: Network, label: 'Topology' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Activity, label: 'Monitor' },
  { icon: Workflow, label: 'Workflows' },
  { icon: GitBranch, label: 'Versions' },
  { icon: Database, label: 'Data' },
  { icon: Zap, label: 'Power' },
  { icon: Shield, label: 'Security' },
  { icon: Lock, label: 'Compliance' },
  { icon: Globe, label: 'Geo' },
  { icon: Users, label: 'Users' },
  { icon: Settings2, label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside className="flex w-10 shrink-0 flex-col items-center justify-between border-r border-stroke-subsection bg-white py-1.5">
      <div className="flex flex-col gap-0.5">
        {top.map((it, i) => (
          <button
            key={i}
            title={it.label}
            className={`grid h-7 w-7 place-items-center rounded ${
              it.active
                ? 'bg-blue-dark text-white'
                : 'text-text-subtle hover:bg-surface-hover'
            }`}
          >
            <it.icon size={16} strokeWidth={1.7} />
          </button>
        ))}
      </div>
      <button className="grid h-7 w-7 place-items-center rounded text-text-subtle hover:bg-surface-hover" title="Recent">
        <Clock size={16} strokeWidth={1.7} />
      </button>
    </aside>
  )
}
