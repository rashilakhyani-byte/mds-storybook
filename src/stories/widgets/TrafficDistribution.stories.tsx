import type { Meta, StoryObj } from '@storybook/react';
import { ICON_MAP, ICON_NAMES } from '../utils/phosphorIcons';
import {
  TrafficDistributionWidget,
  type ChartType,
  type DataPoint,
  DEFAULT_DATA,
  DEFAULT_DATES,
} from '../../components/widgets/TrafficDistributionWidget';

const ICON_SIZE = 16;

function resolveIcon(name: string | undefined) {
  if (!name || name === '(none)') return undefined;
  const Comp = ICON_MAP[name];
  return Comp ? <Comp size={ICON_SIZE} weight="regular" /> : undefined;
}

// ─── Data profiles ────────────────────────────────────────────────────────────

function makeProfile(
  pattern: 'current' | 'spike' | 'growth' | 'decline' | 'flat',
): { data: DataPoint[]; dates: string[] } {
  const n = 30;
  const dates = DEFAULT_DATES.slice(0, n);

  if (pattern === 'current') return { data: DEFAULT_DATA, dates };

  const data: DataPoint[] = Array.from({ length: n }, (_, i) => {
    let t = 0, e = 0, inn = 0;
    const frac = i / (n - 1);
    switch (pattern) {
      case 'spike': {
        const base = 60 + Math.sin(i * 0.4) * 15;
        const spike = i >= 10 && i <= 14 ? 180 - Math.abs(i - 12) * 30 : 0;
        t = Math.round(base + spike);
        e = Math.round(t * 0.6);
        inn = Math.round(t * 0.3);
        break;
      }
      case 'growth': {
        t   = Math.round(40 + frac * 130 + Math.sin(i * 0.5) * 8);
        e   = Math.round(t * 0.65);
        inn = Math.round(t * 0.28);
        break;
      }
      case 'decline': {
        t   = Math.round(170 - frac * 110 + Math.sin(i * 0.5) * 8);
        e   = Math.round(t * 0.6);
        inn = Math.round(t * 0.3);
        break;
      }
      case 'flat': {
        t   = Math.round(80 + Math.sin(i * 0.3) * 5);
        e   = Math.round(t * 0.55);
        inn = Math.round(t * 0.3);
        break;
      }
    }
    return { t: Math.max(0, t), e: Math.max(0, e), i: Math.max(0, inn) };
  });

  return { data, dates };
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
          'Traffic Distribution widget — shows Total / External / Internal API traffic over time. Supports 4 chart types, swappable header icon, editable title, custom data profiles, and live JSON preview of the underlying data.',
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
    // data / dates hidden — controlled via dataProfile
    data:  { table: { disable: true } },
    dates: { table: { disable: true } },
    dataProfile: {
      control: 'select',
      options: ['current', 'spike', 'growth', 'decline', 'flat'],
      name: 'Data profile',
      description: 'Preset dataset: Current · Spike · Growth · Decline · Flat',
    },
    showDataJson:   { control: 'boolean', name: 'Show data as JSON' },
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
    showFilter:     true,
    showViewToggle: true,
    showLegend:     true,
    legendCount:    3,
    ...({ iconName: 'ChartBar', dataProfile: 'current', showDataJson: false } as object),
  },
  render: (args) => {
    const a = args as typeof args & {
      iconName?: string;
      dataProfile?: 'current' | 'spike' | 'growth' | 'decline' | 'flat';
      showDataJson?: boolean;
    };
    const profile = makeProfile(a.dataProfile ?? 'current');
    return (
      <div className="flex w-full flex-col gap-4" style={{ maxWidth: 900 }}>
        <TrafficDistributionWidget
          {...args}
          icon={resolveIcon(a.iconName)}
          data={profile.data}
          dates={profile.dates}
        />
        {a.showDataJson && (
          <div className="rounded-[6px] border border-[#eef1f6] bg-[#f7f8f9]">
            <div className="flex items-center gap-2 border-b border-[#eef1f6] px-4 py-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#858c9b]">Data — JSON</span>
              <span className="rounded bg-[#eef1f6] px-1.5 py-0.5 text-[10px] font-medium text-[#626978]">
                {profile.data.length} points
              </span>
            </div>
            <pre className="overflow-x-auto p-4 text-[11px] leading-[18px] text-[#202124]">
              {JSON.stringify(
                profile.data.map((d, i) => ({ date: profile.dates[i], total: d.t, external: d.e, internal: d.i })),
                null,
                2,
              )}
            </pre>
          </div>
        )}
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

export const DataProfiles: Story = {
  name: 'Data Profiles',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-full flex-col gap-8" style={{ maxWidth: 900 }}>
      {(['current', 'spike', 'growth', 'decline', 'flat'] as const).map((p) => {
        const { data, dates } = makeProfile(p);
        return (
          <div key={p} className="flex flex-col gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">{p}</p>
            <TrafficDistributionWidget data={data} dates={dates} showFilter={false} showViewToggle={false} />
          </div>
        );
      })}
    </div>
  ),
};

export const WithJsonPanel: Story = {
  name: 'With JSON data panel',
  parameters: { controls: { disable: true } },
  render: () => {
    const { data, dates } = makeProfile('current');
    return (
      <div className="flex w-full flex-col gap-4" style={{ maxWidth: 900 }}>
        <TrafficDistributionWidget data={data} dates={dates} />
        <div className="rounded-[6px] border border-[#eef1f6] bg-[#f7f8f9]">
          <div className="flex items-center gap-2 border-b border-[#eef1f6] px-4 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#858c9b]">Data — JSON</span>
            <span className="rounded bg-[#eef1f6] px-1.5 py-0.5 text-[10px] font-medium text-[#626978]">{data.length} points</span>
          </div>
          <pre className="overflow-x-auto p-4 text-[11px] leading-[18px] text-[#202124]">
            {JSON.stringify(
              data.map((d, i) => ({ date: dates[i], total: d.t, external: d.e, internal: d.i })),
              null,
              2,
            )}
          </pre>
        </div>
      </div>
    );
  },
};

export const ResponsiveNarrow: Story = {
  name: 'Responsive — Narrow (375px)',
  parameters: {
    controls: { disable: true },
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <div style={{ width: 375 }}>
      <TrafficDistributionWidget showFilter showViewToggle showLegend legendCount={3} />
    </div>
  ),
};

export const ResponsiveMedium: Story = {
  name: 'Responsive — Medium (600px)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 600 }}>
      <TrafficDistributionWidget showFilter showViewToggle showLegend legendCount={3} />
    </div>
  ),
};

export const NoControls: Story = {
  name: 'Chart only (no controls)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full" style={{ maxWidth: 900 }}>
      <TrafficDistributionWidget showFilter={false} showViewToggle={false} showLegend={false} />
    </div>
  ),
};
