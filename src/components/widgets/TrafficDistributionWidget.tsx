import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChartBar, CaretDown } from '@phosphor-icons/react';
import { SubToggle } from '../SubToggle';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChartType = 'grouped-bar' | 'stacked-bar' | 'line' | 'area';

export interface DataPoint {
  date: string;
  total: number;
  external: number;
  internal: number;
}

export interface TrafficDistributionWidgetProps {
  title?: string;
  icon?: ReactNode;
  chartType?: ChartType;
  data?: DataPoint[];
  showFilter?: boolean;
  showViewToggle?: boolean;
  showLegend?: boolean;
  legendCount?: 1 | 2 | 3;
}

// ─── Default data ─────────────────────────────────────────────────────────────

export const DEFAULT_DATA: DataPoint[] = [
  { date: 'Jul 31', total: 158, external: 109, internal: 43 },
  { date: 'Jan 2',  total: 109, external: 30,  internal: 88 },
  { date: 'Jan 3',  total: 99,  external: 48,  internal: 59 },
  { date: 'Jan 4',  total: 80,  external: 48,  internal: 59 },
  { date: 'Jan 5',  total: 121, external: 95,  internal: 27 },
  { date: 'Jan 6',  total: 95,  external: 48,  internal: 59 },
  { date: 'Jan 7',  total: 80,  external: 48,  internal: 59 },
  { date: 'Jan 8',  total: 95,  external: 48,  internal: 59 },
  { date: 'Jan 9',  total: 80,  external: 48,  internal: 59 },
  { date: 'Jan 10', total: 99,  external: 48,  internal: 59 },
  { date: 'Jan 11', total: 158, external: 109, internal: 43 },
  { date: 'Jan 12', total: 95,  external: 48,  internal: 59 },
  { date: 'Jan 13', total: 80,  external: 48,  internal: 59 },
  { date: 'Jan 14', total: 80,  external: 48,  internal: 59 },
  { date: 'Jan 15', total: 95,  external: 48,  internal: 59 },
  { date: 'Jan 16', total: 80,  external: 48,  internal: 59 },
  { date: 'Jan 17', total: 80,  external: 48,  internal: 59 },
  { date: 'Jan 18', total: 95,  external: 48,  internal: 59 },
  { date: 'Jan 19', total: 95,  external: 48,  internal: 59 },
  { date: 'Jan 20', total: 80,  external: 48,  internal: 59 },
  { date: 'Jan 21', total: 80,  external: 48,  internal: 59 },
  { date: 'Jan 22', total: 80,  external: 48,  internal: 59 },
  { date: 'Jan 23', total: 95,  external: 48,  internal: 59 },
  { date: 'Jan 24', total: 158, external: 109, internal: 43 },
  { date: 'Jan 25', total: 80,  external: 48,  internal: 59 },
  { date: 'Jan 26', total: 80,  external: 48,  internal: 59 },
  { date: 'Jan 27', total: 95,  external: 48,  internal: 59 },
  { date: 'Jan 28', total: 80,  external: 48,  internal: 59 },
  { date: 'Dec 29', total: 95,  external: 48,  internal: 59 },
  { date: 'Jan 30', total: 80,  external: 48,  internal: 59 },
];

const LEGEND_ITEMS = [
  { key: 'total'    as const, label: 'Total',    color: '#008ff8' },
  { key: 'external' as const, label: 'External', color: '#78bbfa' },
  { key: 'internal' as const, label: 'Internal', color: '#cae8ff' },
];

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
    const cpx  = (prev.x + p.x) / 2;
    return `${acc} C${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
  }, '');
}

function areaPath(pts: { x: number; y: number }[], baseY: number): string {
  if (pts.length === 0) return '';
  return `${smoothLinePath(pts)} L${pts[pts.length - 1].x},${baseY} L${pts[0].x},${baseY} Z`;
}

// ─── TrafficChart ─────────────────────────────────────────────────────────────

function TrafficChart({
  data, checked, chartType,
}: {
  data: DataPoint[];
  checked: { total: boolean; external: boolean; internal: boolean };
  chartType: ChartType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const isNarrow  = w < 480;
  const isMedium  = w >= 480 && w < 700;
  const H         = isNarrow ? 160 : isMedium ? 200 : 240;
  const padL      = isNarrow ? 32 : 44;
  const padR      = 8;
  const padT      = 8;
  const padB      = isNarrow ? 40 : 56;
  const labelSize = isNarrow ? 7 : 8.5;
  const yFontSize = isNarrow ? 8 : 10;

  const chartW = Math.max(1, w - padL - padR);
  const chartH = H - padT - padB;
  const baseY  = padT + chartH;
  const maxVal = Math.max(...data.map((d) => d.total), 1);

  const yTicks = [
    { label: '200M', frac: 1 },
    { label: '150M', frac: 0.75 },
    { label: '25M',  frac: 0.125 },
    { label: '0',    frac: 0 },
  ];

  const groupW   = chartW / Math.max(data.length, 1);
  const groupCx  = (i: number) => padL + i * groupW + groupW / 2;
  const scaleH   = (val: number) => (val / maxVal) * chartH;
  const scaleY   = (val: number) => baseY - scaleH(val);

  const barW     = Math.max(2, groupW * 0.22);
  const barGap   = Math.max(1, groupW * 0.04);
  const groupPad = (groupW - 3 * barW - 2 * barGap) / 2;

  const stackBarW = Math.max(4, groupW * 0.5);
  const stackBarX = (i: number) => padL + i * groupW + (groupW - stackBarW) / 2;

  const minLabelSpacing = isNarrow ? 28 : 18;
  const labelStep = Math.max(1, Math.ceil((data.length * minLabelSpacing) / chartW));

  const SERIES = [
    { key: 'total'    as const, color: '#008ff8', strokeW: 2   },
    { key: 'external' as const, color: '#78bbfa', strokeW: 1.5 },
    { key: 'internal' as const, color: '#cae8ff', strokeW: 1.5 },
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
                <line x1={padL} x2={w - padR} y1={y} y2={y}
                  stroke={frac === 0 ? '#c4c7cf' : '#e0e1e9'}
                  strokeDasharray={frac === 0 ? undefined : '3 3'} />
                <text x={padL - 4} y={y + 4} textAnchor="end"
                  fontSize={yFontSize} fill="#6c6e79" fontFamily="'JetBrains Mono',monospace">
                  {label}
                </text>
              </g>
            );
          })}

          {!isNarrow && (
            <text x={12} y={padT + chartH / 2} fontSize="10" fill="#626978" textAnchor="middle"
              transform={`rotate(-90 12 ${padT + chartH / 2})`}>Traffic</text>
          )}

          {/* Grouped bar */}
          {chartType === 'grouped-bar' && data.map((d, gi) => {
            const gx = padL + gi * groupW + groupPad;
            const bars = [
              { h: scaleH(d.total),    color: '#008ff8', show: checked.total    },
              { h: scaleH(d.external), color: '#78bbfa', show: checked.external },
              { h: scaleH(d.internal), color: '#cae8ff', show: checked.internal },
            ];
            return (
              <g key={gi}>
                {bars.map((b, bi) => b.show && b.h > 0 ? (
                  <path key={bi} fill={b.color}
                    d={roundedTopBar(gx + bi * (barW + barGap), baseY - b.h, barW, b.h, Math.min(barW / 2, 3))} />
                ) : null)}
              </g>
            );
          })}

          {/* Stacked bar */}
          {chartType === 'stacked-bar' && data.map((d, gi) => {
            const bx = stackBarX(gi);
            const iH = checked.internal ? scaleH(d.internal) : 0;
            const eH = checked.external ? scaleH(d.external) : 0;
            const tH = checked.total    ? scaleH(d.total)    : 0;
            return (
              <g key={gi}>
                {iH > 0 && <rect x={bx} y={baseY - iH} width={stackBarW} height={iH} fill="#cae8ff" />}
                {eH > 0 && (
                  <path fill="#78bbfa"
                    d={roundedTopBar(bx, baseY - iH - eH, stackBarW, eH, Math.min(stackBarW / 2, 3))} />
                )}
                {tH > 0 && (
                  <path fill="none" stroke="#008ff8" strokeWidth="1.5" strokeDasharray="3 2"
                    d={roundedTopBar(bx, baseY - tH, stackBarW, tH, Math.min(stackBarW / 2, 3))} />
                )}
              </g>
            );
          })}

          {/* Line */}
          {chartType === 'line' && SERIES.map((s) => {
            if (!checked[s.key]) return null;
            const pts = data.map((d, i) => ({ x: groupCx(i), y: scaleY(d[s.key]) }));
            return (
              <path key={s.key} d={smoothLinePath(pts)} fill="none"
                stroke={s.color} strokeWidth={s.strokeW} strokeLinecap="round" strokeLinejoin="round" />
            );
          })}

          {/* Area */}
          {chartType === 'area' && SERIES.map((s, si) => {
            if (!checked[s.key]) return null;
            const pts = data.map((d, i) => ({ x: groupCx(i), y: scaleY(d[s.key]) }));
            return (
              <g key={s.key}>
                <path d={areaPath(pts, baseY)} fill={s.color} opacity={si === 0 ? 0.45 : 0.6} />
                <path d={smoothLinePath(pts)} fill="none"
                  stroke={s.color} strokeWidth={s.strokeW} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            );
          })}

          {/* x-axis date labels */}
          {data.map((d, i) => {
            if (i % labelStep !== 0) return null;
            const cx = groupCx(i);
            const ly = baseY + 8;
            return (
              <text key={i} x={cx} y={ly} fontSize={labelSize} fill="#6c6e79" textAnchor="end"
                transform={`rotate(-55 ${cx} ${ly})`}>{d.date}</text>
            );
          })}
        </svg>
      )}
    </div>
  );
}

// ─── Widget ───────────────────────────────────────────────────────────────────

const BAR_TYPES:  ChartType[] = ['grouped-bar', 'stacked-bar'];
const LINE_TYPES: ChartType[] = ['line', 'area'];

export function TrafficDistributionWidget({
  title          = 'Traffic Distribution',
  icon,
  chartType:     chartTypeProp = 'grouped-bar',
  data           = DEFAULT_DATA,
  showFilter     = true,
  showViewToggle = true,
  showLegend     = true,
  legendCount    = 3,
}: TrafficDistributionWidgetProps) {
  const [viewBy, setViewBy]                     = useState<'Internal – External' | 'Success – Error'>('Internal – External');
  const [showVBDropdown, setShowVBDropdown]      = useState(false);
  const [checked, setChecked]                   = useState({ total: true, external: true, internal: true });
  const [currentChartType, setCurrentChartType] = useState<ChartType>(chartTypeProp);

  useEffect(() => { setCurrentChartType(chartTypeProp); }, [chartTypeProp]);

  const isBarMode  = BAR_TYPES.includes(currentChartType);
  const toggleMode = isBarMode ? 'breakdown' : 'trend';

  function handleToggle(mode: 'breakdown' | 'trend') {
    setCurrentChartType(
      mode === 'breakdown'
        ? (BAR_TYPES.includes(currentChartType)  ? currentChartType : 'grouped-bar')
        : (LINE_TYPES.includes(currentChartType) ? currentChartType : 'line'),
    );
  }

  const visibleLegends = LEGEND_ITEMS.slice(0, legendCount);
  const headerIcon     = icon ?? <ChartBar size={16} className="text-[#626978]" />;

  // Sanitise data coming from the Storybook object control
  const safeData: DataPoint[] = Array.isArray(data)
    ? data.filter((d) => d && typeof d.total === 'number')
    : DEFAULT_DATA;

  return (
    <div className="flex flex-col rounded-[8px] border border-[#eef1f6] bg-white">
      {/* Header */}
      <div className="flex h-10 min-w-0 items-center justify-between gap-2 border-b border-[#eef1f6] px-4">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 text-[#626978]">{headerIcon}</span>
          <span className="truncate text-[14px] font-semibold text-[#626978]">{title}</span>
        </div>

        {(showFilter || showViewToggle) && (
          <div className="flex shrink-0 items-center gap-2">
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
                      <button key={v} onClick={() => { setViewBy(v); setShowVBDropdown(false); }}
                        className={`block w-full px-3 py-1.5 text-left text-[12px] font-medium hover:bg-[#f7f8f9] ${v === viewBy ? 'text-[#0054b6]' : 'text-[#202124]'}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showViewToggle && (
              <SubToggle size="sm" value={toggleMode} onChange={handleToggle}
                options={[
                  { value: 'breakdown', label: 'Breakdown' },
                  { value: 'trend',     label: 'Trend' },
                ]} />
            )}
          </div>
        )}
      </div>

      {/* Chart + Legend */}
      <div className="p-4 pb-3">
        <TrafficChart data={safeData} checked={checked} chartType={currentChartType} />

        {showLegend && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
            {visibleLegends.map((s) => (
              <button key={s.key} onClick={() => setChecked((c) => ({ ...c, [s.key]: !c[s.key] }))}
                className="flex items-center gap-1.5">
                <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-[2px]"
                  style={{ background: checked[s.key] ? '#0054b6' : 'transparent', border: checked[s.key] ? 'none' : '1px solid #a5adbd' }}>
                  {checked[s.key] && (
                    <svg width="8" height="8" viewBox="0 0 8 8">
                      <path d="M1.5 4l1.8 1.8L6.5 2" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="h-[14px] w-[3px] shrink-0 rounded-[1px]" style={{ background: s.color }} />
                <span className="text-[12px] font-semibold text-[#40444c]">{s.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
