const SPACING_TOKENS = [
  { name: 'spacing-0', value: 0 },
  { name: 'spacing-25', value: 2 },
  { name: 'spacing-50', value: 4 },
  { name: 'spacing-75', value: 6 },
  { name: 'spacing-100', value: 8 },
  { name: 'spacing-125', value: 10 },
  { name: 'spacing-150', value: 12 },
  { name: 'spacing-175', value: 14 },
  { name: 'spacing-200', value: 16 },
  { name: 'spacing-225', value: 18 },
  { name: 'spacing-250', value: 20 },
  { name: 'spacing-300', value: 24 },
  { name: 'spacing-350', value: 28 },
  { name: 'spacing-400', value: 32 },
  { name: 'spacing-450', value: 36 },
  { name: 'spacing-500', value: 40 },
  { name: 'spacing-600', value: 48 },
  { name: 'spacing-700', value: 56 },
  { name: 'spacing-800', value: 64 },
  { name: 'spacing-900', value: 72 },
  { name: 'spacing-1000', value: 80 },
  { name: 'spacing-1200', value: 96 },
  { name: 'spacing-1400', value: 112 },
  { name: 'spacing-1600', value: 128 },
  { name: 'spacing-1800', value: 144 },
  { name: 'spacing-2000', value: 160 },
];

export function Spacing() {
  return (
    <div className="space-y-8 p-6 font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-[#202124]">MDS Spacing</h1>
        <p className="mt-1 text-sm text-[#626978]">
          Primitive spacing scale from the Mystic Design System
        </p>
      </div>

      <div className="rounded-xl border border-[#eef1f6] bg-white overflow-hidden">
        {SPACING_TOKENS.map(({ name, value }) => (
          <div
            key={name}
            className="flex items-center gap-6 border-b border-[#eef1f6] px-6 py-3 last:border-none"
          >
            <div className="w-36 shrink-0">
              <p className="font-mono text-[11px] font-medium text-[#626978]">{name}</p>
              <p className="text-[10px] text-[#858c9b]">{value}px</p>
            </div>
            <div className="flex items-center gap-3 flex-1">
              <div
                className="h-4 rounded-sm bg-[#0265dc] shrink-0"
                style={{ width: Math.max(value, 1) }}
              />
              <span className="text-[11px] text-[#858c9b]">{value}px</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
