type Props<T extends string> = {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  size?: 'sm' | 'md'
}

export function SubToggle<T extends string>({ options, value, onChange, size = 'md' }: Props<T>) {
  const h = size === 'sm' ? 'h-6' : 'h-7'
  return (
    <div className={`inline-flex ${h} items-center gap-0.5 rounded-md border border-stroke-subsection bg-white p-0.5 shadow-[0_1px_0_rgba(27,31,35,0.04)]`}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`h-full rounded px-2.5 text-[12px] font-medium transition-colors ${
            value === o.value
              ? 'bg-surface-hover text-text-default'
              : 'text-text-subdued hover:text-text-default'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
