import { useState } from 'react'
import { Maximize2, BellPlus, ChevronDown } from 'lucide-react'
import { AISparkleIcon } from './AISparkleIcon'

const ranges = ['Last 1 Month', 'Last 14 Days', 'Last 7 Days'] as const
type Range = (typeof ranges)[number]

export function Header({ onAiAssistClick }: { onAiAssistClick?: () => void }) {
  const [range, setRange] = useState<Range>('Last 7 Days')

  return (
    <div className="flex h-9 shrink-0 items-center justify-between border-b border-stroke-subsection bg-white px-3">
      <div className="flex items-center gap-1.5">
        <button className="grid h-6 w-6 place-items-center rounded text-text-subtle hover:bg-surface-hover">
          <Maximize2 size={13} strokeWidth={1.8} />
        </button>
        <h1 className="text-[14px] font-semibold leading-5 text-text-default">API Insights</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-7 items-center gap-0.5 rounded-md border border-stroke-subsection bg-white p-0.5">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`h-6 rounded px-2.5 text-[12px] font-medium transition-colors ${
                range === r
                  ? 'bg-surface-hover text-text-default'
                  : 'text-text-subdued hover:text-text-default'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <button className="flex h-7 items-center gap-1.5 rounded-md border border-stroke-subsection bg-white px-2.5 text-[12px] font-medium text-text-default hover:bg-surface-hover">
          <span className="text-[10px] font-semibold tracking-wide text-text-subdued">ENV</span>
          Development
          <ChevronDown size={12} className="text-text-subdued" />
        </button>

        <button
          type="button"
          onClick={onAiAssistClick}
          className="flex h-6 items-center gap-1 rounded-md border border-stroke-subsection bg-white px-2 text-[12px] font-medium text-text-default hover:bg-surface-hover"
        >
          <AISparkleIcon size={13} uid="header" />
          AI Assist
        </button>
        <button className="flex h-6 items-center gap-1 rounded-md border border-stroke-subsection bg-white px-2 text-[12px] font-medium text-text-default hover:bg-surface-hover">
          <BellPlus size={12} className="text-text-subtle" />
          Create Alert
        </button>
      </div>
    </div>
  )
}
