import { ChevronDown, Bell, Settings, User } from 'lucide-react'

export function Toolbar() {
  return (
    <div className="flex h-8 shrink-0 items-center justify-between border-b border-stroke-subsection bg-white px-3">
      <button className="flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[12px] font-medium text-text-default hover:bg-surface-hover">
        <span className="grid h-4 w-4 place-items-center rounded-sm bg-orange-default text-[9px] font-bold text-white">a</span>
        acme-bank
        <ChevronDown size={12} className="text-text-subdued" strokeWidth={2.2} />
      </button>
      <div className="flex items-center gap-1">
        <button className="grid h-6 w-6 place-items-center rounded text-text-subtle hover:bg-surface-hover">
          <User size={14} strokeWidth={1.6} />
        </button>
        <button className="grid h-6 w-6 place-items-center rounded text-text-subtle hover:bg-surface-hover">
          <Bell size={14} strokeWidth={1.6} />
        </button>
        <button className="grid h-6 w-6 place-items-center rounded text-text-subtle hover:bg-surface-hover">
          <Settings size={14} strokeWidth={1.6} />
        </button>
      </div>
    </div>
  )
}
