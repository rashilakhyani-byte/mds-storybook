import { useState, useMemo } from 'react';
import { ICON_MAP } from '../utils/phosphorIcons';

interface IconGalleryProps {
  weight?: 'regular' | 'bold' | 'fill' | 'light' | 'thin' | 'duotone';
  size?: number;
}

export function IconGallery({ weight = 'regular', size = 24 }: IconGalleryProps) {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState('');

  const icons = useMemo(() => {
    const q = query.toLowerCase().trim();
    return Object.keys(ICON_MAP)
      .sort()
      .filter((name) => !q || name.toLowerCase().includes(q));
  }, [query]);

  function copyName(name: string) {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(name);
      setTimeout(() => setCopied(''), 1500);
    });
  }

  return (
    <div className="flex flex-col gap-4 p-6 font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-[#202124]">Phosphor Icons</h1>
        <p className="mt-1 text-sm text-[#626978]">
          {Object.keys(ICON_MAP).length} icons · click any icon to copy its name
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#858c9b]"
          width="14" height="14" viewBox="0 0 14 14" fill="none"
        >
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 10L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search icons…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 w-full rounded-md border border-[#cdd2dd] bg-white pl-9 pr-3 text-sm text-[#202124] placeholder-[#858c9b] outline-none focus:border-[#0265dc] focus:ring-2 focus:ring-[#0265dc]/20"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#858c9b] hover:text-[#202124]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-xs text-[#858c9b]">
        {icons.length} {query ? 'results' : 'icons'}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-1">
        {icons.map((name) => {
          const Icon = ICON_MAP[name];
          const isCopied = copied === name;
          return (
            <button
              key={name}
              onClick={() => copyName(name)}
              title={`Click to copy "${name}"`}
              className={[
                'group flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors text-left',
                isCopied
                  ? 'bg-[#e0f2ff] text-[#0054b6]'
                  : 'hover:bg-[#eef1f6] text-[#40444c]',
              ].join(' ')}
            >
              <Icon size={size} weight={weight} />
              <span className="w-full truncate text-center text-[9px] leading-tight text-[#858c9b] group-hover:text-[#626978]">
                {isCopied ? '✓ copied!' : name}
              </span>
            </button>
          );
        })}
      </div>

      {icons.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-[#858c9b]">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="15" cy="15" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M23 23l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-sm">No icons match &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
