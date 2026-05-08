import { useState, useMemo } from 'react';
import { ICON_MAP } from './phosphorIcons';

interface Props {
  value: string | null;
  onChange: (name: string | null) => void;
  label?: string;
}

export function IconPickerInline({ value, onChange, label = 'Icon' }: Props) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const icons = useMemo(() => {
    const lq = q.toLowerCase().trim();
    return Object.keys(ICON_MAP).sort().filter((n) => !lq || n.toLowerCase().includes(lq));
  }, [q]);

  const SelectedIcon = value ? ICON_MAP[value] : null;

  return (
    <div className="flex flex-col gap-1">
      {/* Trigger button */}
      <div className="flex items-center gap-2">
        <span className="w-20 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#858c9b]">
          {label}
        </span>
        <button
          onClick={() => setOpen((o) => !o)}
          className={[
            'flex h-7 flex-1 items-center gap-2 rounded-md border px-2 text-[11px] transition-colors',
            open
              ? 'border-[#0265dc] bg-[#e0f2ff] text-[#0054b6]'
              : 'border-[#cdd2dd] bg-white text-[#202124] hover:border-[#a5adbd]',
          ].join(' ')}
        >
          {SelectedIcon ? (
            <>
              <SelectedIcon size={12} weight="bold" />
              <span className="flex-1 text-left">{value}</span>
            </>
          ) : (
            <span className="flex-1 text-left text-[#858c9b]">Select icon…</span>
          )}
          <svg
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {value && (
          <button
            onClick={() => onChange(null)}
            title="Remove icon"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#eef1f6] text-[#858c9b] hover:border-[#cdd2dd] hover:text-[#b40000]"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown panel */}
      {open && (
        <div className="flex flex-col gap-2 rounded-lg border border-[#cdd2dd] bg-white p-3 shadow-lg">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#858c9b]" width="11" height="11" viewBox="0 0 12 12" fill="none">
              <circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 9l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              autoFocus
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${Object.keys(ICON_MAP).length} icons…`}
              className="h-7 w-full rounded-md border border-[#cdd2dd] bg-[#f7f8f9] pl-7 pr-3 text-[11px] text-[#202124] placeholder-[#858c9b] outline-none focus:border-[#0265dc]"
            />
            {q && (
              <button onClick={() => setQ('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#858c9b]">
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>

          <p className="text-[9px] text-[#858c9b]">{icons.length} icons</p>

          {/* Grid */}
          <div className="h-48 overflow-y-auto">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(52px,1fr))] gap-0.5">
              {icons.map((name) => {
                const Icon = ICON_MAP[name];
                const active = value === name;
                return (
                  <button
                    key={name}
                    onClick={() => { onChange(active ? null : name); setOpen(false); setQ(''); }}
                    title={name}
                    className={[
                      'flex flex-col items-center gap-1 rounded-md p-1.5 transition-colors',
                      active
                        ? 'bg-[#0054b6] text-white'
                        : 'text-[#40444c] hover:bg-[#eef1f6]',
                    ].join(' ')}
                  >
                    <Icon size={16} weight="regular" />
                    <span className={`w-full truncate text-center text-[7px] leading-tight ${active ? 'text-white' : 'text-[#858c9b]'}`}>
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
            {icons.length === 0 && (
              <p className="py-8 text-center text-[11px] text-[#858c9b]">No icons match &ldquo;{q}&rdquo;</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
