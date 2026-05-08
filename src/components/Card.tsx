import type { ReactNode } from 'react'

export function SectionCard({
  title, icon, right, children, className = '',
}: {
  title: string
  icon?: ReactNode
  right?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-lg border border-stroke-subsection bg-white ${className}`}>
      <div className="flex h-9 items-center justify-between border-b border-stroke-subsection px-3">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold leading-4 text-[#626978]">
          {icon}
          {title}
        </div>
        {right}
      </div>
      {children}
    </section>
  )
}
