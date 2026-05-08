import type { Meta, StoryObj } from '@storybook/react';
import { TrafficDistributionWidget } from '../../components/widgets/TrafficDistributionWidget';

const meta: Meta<typeof TrafficDistributionWidget> = {
  title: 'Widgets/Traffic Distribution',
  component: TrafficDistributionWidget,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Traffic Distribution widget — grouped bar chart showing Total / External / Internal API traffic over time. Supports optional "View by" filter, Breakdown/Trend toggle, and a configurable legend.',
      },
    },
  },
  argTypes: {
    showFilter:     { control: 'boolean', name: 'Show "View by" filter' },
    showViewToggle: { control: 'boolean', name: 'Show Breakdown/Trend toggle' },
    showLegend:     { control: 'boolean', name: 'Show legend' },
    legendCount: {
      control: { type: 'radio' },
      options: [1, 2, 3],
      name: 'Legend items',
      description: 'How many legend items to show (Total → External → Internal)',
    },
  },
  args: {
    showFilter:     true,
    showViewToggle: true,
    showLegend:     true,
    legendCount:    3,
  },
  render: (args) => (
    <div className="w-full max-w-[860px]">
      <TrafficDistributionWidget {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NoControls: Story = {
  name: 'Chart only (no controls)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-[860px]">
      <TrafficDistributionWidget showFilter={false} showViewToggle={false} showLegend={false} />
    </div>
  ),
};

export const FilterOnly: Story = {
  name: 'With filter, no toggle',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-[860px]">
      <TrafficDistributionWidget showFilter showViewToggle={false} showLegend legendCount={3} />
    </div>
  ),
};

export const ToggleOnly: Story = {
  name: 'With toggle, no filter',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-[860px]">
      <TrafficDistributionWidget showFilter={false} showViewToggle showLegend legendCount={3} />
    </div>
  ),
};

export const OneLegend: Story = {
  name: 'Legend — Total only',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-[860px]">
      <TrafficDistributionWidget showLegend legendCount={1} />
    </div>
  ),
};

export const TwoLegends: Story = {
  name: 'Legend — Total + External',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-[860px]">
      <TrafficDistributionWidget showLegend legendCount={2} />
    </div>
  ),
};

export const FullWidget: Story = {
  name: 'Full widget (all controls + 3 legends)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-[860px]">
      <TrafficDistributionWidget showFilter showViewToggle showLegend legendCount={3} />
    </div>
  ),
};
