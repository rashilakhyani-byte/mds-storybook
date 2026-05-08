import type { Meta, StoryObj } from '@storybook/react';
import { ICON_MAP, ICON_NAMES } from '../utils/phosphorIcons';
import {
  TrafficDistributionWidget,
  type ChartType,
  DEFAULT_DATA,
} from '../../components/widgets/TrafficDistributionWidget';

const ICON_SIZE = 16;

function resolveIcon(name: string | undefined) {
  if (!name || name === '(none)') return undefined;
  const Comp = ICON_MAP[name];
  return Comp ? <Comp size={ICON_SIZE} weight="regular" /> : undefined;
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
          'Traffic Distribution widget. Edit the **Chart data (JSON)** control to change the graph in real time — each entry needs `date`, `total`, `external`, and `internal` fields.',
      },
    },
  },
  argTypes: {
    title:    { control: 'text',   name: 'Widget title' },
    icon:     { table: { disable: true } },
    iconName: { control: 'select', options: ICON_NAMES, name: 'Header icon' },
    chartType: {
      control: 'radio',
      options: ['grouped-bar', 'stacked-bar', 'line', 'area'],
      name: 'Chart type',
    },
    data: {
      control: { type: 'object' },
      name: 'Chart data (JSON)',
      description: 'Array of { date, total, external, internal }. Edit to update the graph live.',
    },
    showFilter:     { control: 'boolean', name: 'Show "View by" filter' },
    showViewToggle: { control: 'boolean', name: 'Show Breakdown/Trend toggle' },
    showLegend:     { control: 'boolean', name: 'Show legend' },
    legendCount: {
      control: { type: 'radio' },
      options: [1, 2, 3],
      name: 'Legend items',
    },
  } as Meta<typeof TrafficDistributionWidget>['argTypes'],
  args: {
    title:          'Traffic Distribution',
    chartType:      'grouped-bar',
    data:           DEFAULT_DATA,
    showFilter:     true,
    showViewToggle: true,
    showLegend:     true,
    legendCount:    3,
    ...({ iconName: 'ChartBar' } as object),
  },
  render: (args) => {
    const a = args as typeof args & { iconName?: string };
    return (
      <div className="w-full" style={{ maxWidth: 900 }}>
        <TrafficDistributionWidget {...args} icon={resolveIcon(a.iconName)} />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Playground: Story = {};

export const AllChartTypes: Story = {
  name: 'All Chart Types',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-full flex-col gap-8" style={{ maxWidth: 900 }}>
      {([
        { type: 'grouped-bar' as ChartType, label: 'Grouped Bar' },
        { type: 'stacked-bar' as ChartType, label: 'Stacked Bar' },
        { type: 'line'        as ChartType, label: 'Line'        },
        { type: 'area'        as ChartType, label: 'Area'        },
      ]).map(({ type, label }) => (
        <div key={type} className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">{label}</p>
          <TrafficDistributionWidget chartType={type} showFilter={false} showViewToggle={false} legendCount={3} />
        </div>
      ))}
    </div>
  ),
};

export const ResponsiveNarrow: Story = {
  name: 'Responsive — Narrow (375px)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 375 }}>
      <TrafficDistributionWidget />
    </div>
  ),
};

export const ResponsiveMedium: Story = {
  name: 'Responsive — Medium (600px)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 600 }}>
      <TrafficDistributionWidget />
    </div>
  ),
};

export const NoControls: Story = {
  name: 'Chart only',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full" style={{ maxWidth: 900 }}>
      <TrafficDistributionWidget showFilter={false} showViewToggle={false} showLegend={false} />
    </div>
  ),
};
