import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ICON_MAP } from '../utils/phosphorIcons';
import { IconPickerInline } from '../utils/IconPickerInline';
import { TrafficDistributionWidget, type ChartType } from '../../components/widgets/TrafficDistributionWidget';

const ICON_SIZE = 16;

function resolveIcon(name: string | null) {
  if (!name || name === '(none)') return undefined;
  const Comp = ICON_MAP[name];
  return Comp ? <Comp size={ICON_SIZE} weight="regular" /> : undefined;
}

// ─── Playground wrapper (needs hooks for icon picker) ─────────────────────────
function PlaygroundWrapper({
  title,
  chartType,
  showFilter,
  showViewToggle,
  showLegend,
  legendCount,
}: {
  title: string;
  chartType: ChartType;
  showFilter: boolean;
  showViewToggle: boolean;
  showLegend: boolean;
  legendCount: 1 | 2 | 3;
}) {
  const [iconName, setIconName] = useState<string | null>('ChartBar');

  return (
    <div className="flex flex-col gap-6 w-full max-w-[900px]">
      <TrafficDistributionWidget
        title={title}
        icon={resolveIcon(iconName)}
        chartType={chartType}
        showFilter={showFilter}
        showViewToggle={showViewToggle}
        showLegend={showLegend}
        legendCount={legendCount}
      />

      {/* Icon picker panel */}
      <div className="rounded-lg border border-[#eef1f6] bg-white p-4 flex flex-col gap-3 shadow-sm w-72">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Header icon</p>
        <IconPickerInline value={iconName} onChange={setIconName} label="Icon" />
      </div>
    </div>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<typeof TrafficDistributionWidget> = {
  title: 'Widgets/Traffic Distribution',
  component: TrafficDistributionWidget,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Traffic Distribution widget — grouped bar chart showing Total / External / Internal API traffic over time. Supports title, swappable header icon, chart type (grouped bar / stacked bar / line / area), optional "View by" filter, Breakdown/Trend toggle, and a configurable legend.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', name: 'Widget title' },
    icon:  { table: { disable: true } },
    chartType: {
      control: 'radio',
      options: ['grouped-bar', 'stacked-bar', 'line', 'area'],
      name: 'Chart type',
      description: 'Grouped Bar · Stacked Bar · Line · Area',
    },
    showFilter:     { control: 'boolean', name: 'Show "View by" filter' },
    showViewToggle: { control: 'boolean', name: 'Show Breakdown/Trend toggle' },
    showLegend:     { control: 'boolean', name: 'Show legend' },
    legendCount: {
      control: { type: 'radio' },
      options: [1, 2, 3],
      name: 'Legend items',
      description: 'How many legend items (Total → External → Internal)',
    },
  },
  args: {
    title:          'Traffic Distribution',
    chartType:      'grouped-bar',
    showFilter:     true,
    showViewToggle: true,
    showLegend:     true,
    legendCount:    3,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <PlaygroundWrapper
      title={String(args.title ?? 'Traffic Distribution')}
      chartType={args.chartType ?? 'grouped-bar'}
      showFilter={args.showFilter ?? true}
      showViewToggle={args.showViewToggle ?? true}
      showLegend={args.showLegend ?? true}
      legendCount={args.legendCount ?? 3}
    />
  ),
};

export const GroupedBar: Story = {
  name: 'Grouped Bar',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-[860px]">
      <TrafficDistributionWidget chartType="grouped-bar" />
    </div>
  ),
};

export const StackedBar: Story = {
  name: 'Stacked Bar',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-[860px]">
      <TrafficDistributionWidget chartType="stacked-bar" />
    </div>
  ),
};

export const LineChart: Story = {
  name: 'Line Chart',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-[860px]">
      <TrafficDistributionWidget chartType="line" />
    </div>
  ),
};

export const AreaChart: Story = {
  name: 'Area Chart',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-[860px]">
      <TrafficDistributionWidget chartType="area" />
    </div>
  ),
};

export const AllChartTypes: Story = {
  name: 'All Chart Types',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-[860px]">
      {([
        { type: 'grouped-bar' as const, label: 'Grouped Bar' },
        { type: 'stacked-bar' as const, label: 'Stacked Bar' },
        { type: 'line'        as const, label: 'Line'        },
        { type: 'area'        as const, label: 'Area'        },
      ]).map(({ type, label }) => (
        <div key={type} className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">{label}</p>
          <TrafficDistributionWidget chartType={type} showFilter={false} showViewToggle={false} legendCount={3} />
        </div>
      ))}
    </div>
  ),
};

export const NoControls: Story = {
  name: 'Chart only (no controls)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-[860px]">
      <TrafficDistributionWidget showFilter={false} showViewToggle={false} showLegend={false} />
    </div>
  ),
};
