import type { Meta, StoryObj } from '@storybook/react';
import { ICON_MAP, ICON_NAMES } from '../utils/phosphorIcons';
import { TrafficDistributionWidget, type ChartType } from '../../components/widgets/TrafficDistributionWidget';

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
          'Traffic Distribution widget — grouped bar chart showing Total / External / Internal API traffic over time. Use the Controls panel to change the title, header icon, chart type, and visibility of each section.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', name: 'Widget title' },
    icon:  { table: { disable: true } },
    // Extra arg — icon name string resolved to ReactNode in render
    iconName: { control: 'select', options: ICON_NAMES, name: 'Header icon' },
    chartType: {
      control: 'radio',
      options: ['grouped-bar', 'stacked-bar', 'line', 'area'],
      name: 'Chart type',
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
  } as Meta<typeof TrafficDistributionWidget>['argTypes'],
  args: {
    title:          'Traffic Distribution',
    chartType:      'grouped-bar',
    showFilter:     true,
    showViewToggle: true,
    showLegend:     true,
    legendCount:    3,
    ...({ iconName: 'ChartBar' } as object),
  },
  render: (args) => {
    const a = args as typeof args & { iconName?: string };
    return (
      <div className="w-full max-w-[860px]">
        <TrafficDistributionWidget
          {...args}
          icon={resolveIcon(a.iconName)}
        />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Playground: Story = {};

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

export const NoControls: Story = {
  name: 'Chart only (no controls)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-[860px]">
      <TrafficDistributionWidget showFilter={false} showViewToggle={false} showLegend={false} />
    </div>
  ),
};
