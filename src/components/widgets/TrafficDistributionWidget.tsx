import { useState, useRef, useEffect } from 'react';
import { ChartBar, CaretDown } from '@phosphor-icons/react';
import { SubToggle } from '../SubToggle';

// ─── Data ─────────────────────────────────────────────────────────────────────

const BAR_DATES = [
  'Jul 31','Jan 2','Jan 3','Jan 4','Jan 5','Jan 6','Jan 7','Jan 8','Jan 9','Jan 10',
  'Jan 11','Jan 12','Jan 13','Jan 14','Jan 15','Jan 16','Jan 17','Jan 18','Jan 19','Jan 20',
  'Jan 21','Jan 22','Jan 23','Jan 24','Jan 25','Jan 26','Jan 27','Jan 28','Dec 29','Jan 30',
];

const BAR_DATA = [
  {t:158,e:109,i:43},{t:109,e:30,i:88},{t:99,e:48,i:59},{t:80,e:48,i:59},{t:121,e:95,i:27},
  {t:95,e:48,i:59},{t:80,e:48,i:59},{t:95,e:48,i:59},{t:80,e:48,i:59},{t:99,e:48,i:59},
  {t:158,e:109,i:43},{t:95,e:48,i:59},{t:80,e:48,i:59},{t:80,e:48,i:59},{t:95,e:48,i:59},
  {t:80,e:48,i:59},{t:80,e:48,i:59},{t:95,e:48,i:59},{t:95,e:48,i:59},{t:80,e:48,i:59},
  {t:80,e:48,i:59},{t:80,e:48,i:59},{t:95,e:48,i:59},{t:158,e:109,i:43},{t:80,e:48,i:59},
  {t:80,e:48,i:59},{t:95,e:48,i:59},{t:80,e:48,i:59},{t:95,e:48,i:59},{t:80,e:48,i:59},
];

const LEGEND_ITEMS = [
  { key: 'total'    as const, label: 'Total',    color: '#008ff8' },
  { key: 'external' as const, label: 'External', color: '#78bbfa' },
  { key: 'internal' as const, label: 'Internal', color: '#cae8ff' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrafficDistributionWidgetProps {
  showFilter?: boolean;
  showViewToggle?: boolean;
  showLegend?: boolean;
  legendCount?: 1 | 2 | 3;
}

// ─── Chart helpers ────────────────────────────────────────────────────────────

function roundedTopBar(x: number, y: number, w: number, h: number, r: number): string {
  if (h <= 0) return '';
  const rr = Math.min(r, h, w / 2);
  return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`;
}

function smoothLinePath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return '';
  return pts.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `${acc} C${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
  }, '');
}

// ─── TrafficBarChart ──────────────────────────────────────────────────────────

function TrafficBarChart({
  data, dates, checked, chartMode,
}: {
  data: typeof BAR_DATA;
  dates: string[];
  checked: { total: boolean; external: boolean; internal: boolean };
  chartMode: 'breakdown' | 'trend';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const H = 240, padL = 44, padR = 8, padT = 8, padB = 56;
  const chartW = Math.max(1, w - padL - padR);
  const chartH = H - padT - padB;
  const maxPx = 158;
  const yTicks = [
    { label: '200M', frac: 1 },
    { label: '150M', frac: 0.75 },
    { label: '25M',  frac: 0.125 },
    { label: '0',    frac: 0 },
  ];
  const groupW   = chartW / data.length;
  const barW     = Math.max(3, groupW * 0.22);
  const barGap   = Math.max(1, groupW * 0.04);
  const groupPad = (groupW - 3 * barW - 2 * barGap) / 2;
  const scaleH   = (px: number) => (px / maxPx) * chartH;
  const scaleY   = (px: number) => padT + chartH - scaleH(px);
  const groupCx  = (i: number) => padL + i * groupW + groupW / 2;

  const LINES = [
    { key: 'total'    as const, color: '#008ff8', width: 2 },
    { key: 'external' as const, color: '#78bbfa', width: 1.5 },
    { key: 'internal' as const, color: '#cae8ff', width: 1.5 },
  ];

  return (
    <div ref={ref} style={{ height: H }}>
      {w > 0 && (
        <svg width={w} height={H} className="block">
          {/* y-axis grid + labels */}
          {yTicks.map(({ label, frac }) => {
            const y = padT + chartH - frac * chartH;
            return (
              <g key={label}>
                <line
                  x1={padL} x2={w - padR} y1={y} y2={y}
                  stroke={frac === 0 ? '#c4c7cf' : '#e0e1e9'}
                  strokeDasharray={frac === 0 ? undefined : '3 3'}
                />
                <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#6c6e79" fontFamily="'JetBrains Mono',monospace">
                  {label}
                </text>
              </g>
            );
          })}

          {/* y-axis "Traffic" label */}
          <text
            x={12} y={padT + chartH / 2} fontSize="10" fill="#626978" textAnchor="middle"
            transform={`rotate(-90 12 ${padT + chartH / 2})`}
          >
            Traffic
          </text>

          {/* bars or lines */}
          {chartMode === 'breakdown'
            ? data.map((d, gi) => {
                const gx  = padL + gi * groupW + groupPad;
                const bY  = padT + chartH;
                const bars = [
                  { h: scaleH(d.t), color: '#008ff8', show: checked.total },
                  { h: scaleH(d.e), color: '#78bbfa', show: checked.external },
                  { h: scaleH(d.i), color: '#cae8ff', show: checked.internal },
                ];
                return (
                  <g key={gi}>
                    {bars.map((b, bi) =>
                      b.show && b.h > 0 ? (
                        <path
                          key={bi}
                          d={roundedTopBar(gx + bi * (barW + barGap), bY - b.h, barW, b.h, Math.min(barW / 2, 3))}
                          fill={b.color}
                        />
                      ) : null
                    )}
                  </g>
                );
              })
            : LINES.map((line) => {
                if (!checked[line.key]) return null;
                const key = line.key === 'total' ? 't' : line.key === 'external' ? 'e' : 'i';
                const pts = data.map((d, i) => ({ x: groupCx(i), y: scaleY(d[key]) }));
                return (
                  <path
                    key={line.key}
                    d={smoothLinePath(pts)}
                    fill="none"
                    stroke={line.color}
                    strokeWidth={line.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })
          }

          {/* x-axis date labels */}
          {dates.map((date, i) => {
            const cx = groupCx(i);
            const ly = padT + chartH + 10;
            return (
              <text key={i} x={cx} y={ly} fontSize="8.5" fill="#6c6e79" textAnchor="end" transform={`rotate(-55 ${cx} ${ly})`}>
                {date}
              </text>
            );
          })}
        </svg>
      )}
    </div>
  );
}

// ─── Widget ───────────────────────────────────────────────────────────────────

export function TrafficDistributionWidget({
  showFilter    = true,
  showViewToggle = true,
  showLegend    = true,
  legendCount   = 3,
}: TrafficDistributionWidgetProps) {
  const [viewBy, setViewBy]       = useState<'Internal – External' | 'Success – Error'>('Internal – External');
  const [chartMode, setChartMode] = useState<'breakdown' | 'trend'>('breakdown');
  const [showVBDropdown, setShowVBDropdown] = useState(false);
  const [checked, setChecked] = useState({ total: true, external: true, internal: true });

  const visibleLegends = LEGEND_ITEMS.slice(0, legendCount);

  return (
    <div className="flex flex-col rounded-[8px] border border-[#eef1f6] bg-white">
      {/* Header */}
      <div className="flex h-10 items-center justify-between border-b border-[#eef1f6] px-4">
        <div className="flex items-center gap-1.5">
          <ChartBar size={16} className="text-[#626978]" />
          <span className="text-[14px] font-semibold text-[#626978]">Traffic Distribution</span>
        </div>

        {(showFilter || showViewToggle) && (
          <div className="flex items-center gap-2">
            {/* "View by" filter dropdown */}
            {showFilter && (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowVBDropdown((o) => !o)}
                  className="flex h-[29px] items-center gap-1 rounded border border-[#eef1f6] bg-white px-2 text-[11px] font-medium text-[#202124] hover:bg-[#f7f8f9]"
                >
                  <span className="font-normal text-[#858c9b]">View by</span>
                  <span className="ml-0.5 text-[13px]">{viewBy}</span>
                  <CaretDown size={12} className="ml-0.5 text-[#858c9b]" />
                </button>
                {showVBDropdown && (
                  <div className="absolute right-0 top-8 z-20 min-w-[200px] overflow-hidden rounded-md border border-[#cdd2dd] bg-white shadow-md">
                    {(['Internal – External', 'Success – Error'] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => { setViewBy(v); setShowVBDropdown(false); }}
                        className={`block w-full px-3 py-1.5 text-left text-[12px] font-medium hover:bg-[#f7f8f9] ${v === viewBy ? 'text-[#0054b6]' : 'text-[#202124]'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Breakdown / Trend toggle */}
            {showViewToggle && (
              <SubToggle
                size="sm"
                value={chartMode}
                onChange={setChartMode}
                options={[
                  { value: 'breakdown', label: 'Breakdown' },
                  { value: 'trend',     label: 'Trend' },
                ]}
              />
            )}
          </div>
        )}
      </div>

      {/* Chart + Legend */}
      <div className="p-4 pb-3">
        <TrafficBarChart data={BAR_DATA} dates={BAR_DATES} checked={checked} chartMode={chartMode} />

        {showLegend && (
          <div className="mt-3 flex items-center justify-center gap-6">
            {visibleLegends.map((s) => (
              <button
                key={s.key}
                onClick={() => setChecked((c) => ({ ...c, [s.key]: !c[s.key] }))}
                className="flex items-center gap-1.5"
              >
                <span
                  className="flex h-3 w-3 items-center justify-center rounded-[2px]"
                  style={{
                    background: checked[s.key] ? '#0054b6' : 'transparent',
                    border:     checked[s.key] ? 'none'    : '1px solid #a5adbd',
                  }}
                >
                  {checked[s.key] && (
                    <svg width="8" height="8" viewBox="0 0 8 8">
                      <path d="M1.5 4l1.8 1.8L6.5 2" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="h-[14px] w-[3px] rounded-[1px]" style={{ background: s.color }} />
                <span className="text-[12px] font-semibold text-[#40444c]">{s.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
