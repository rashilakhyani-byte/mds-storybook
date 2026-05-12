import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  House, MagnifyingGlass, Bell, Gear, User, FileText,
  ChartBar, Lock, Globe, Tag,
} from '@phosphor-icons/react';
import { Tabs, type TabItem } from '../../components/ui/Tabs';

const ICON_SIZE = 14;

// ─── Controlled wrapper (needs useState) ──────────────────────────────────────
function ControlledTabs(props: React.ComponentProps<typeof Tabs>) {
  const [val, setVal] = useState(props.value ?? props.items[0]?.value ?? '');
  const [items, setItems] = useState(props.items);

  function handleClose(value: string) {
    const next = items.filter((i) => i.value !== value);
    setItems(next);
    if (val === value) setVal(next[0]?.value ?? '');
  }

  return (
    <Tabs
      {...props}
      items={items}
      value={val}
      onChange={setVal}
      onClose={handleClose}
    />
  );
}

// ─── Sample datasets ──────────────────────────────────────────────────────────

const SIMPLE_TABS: TabItem[] = [
  { value: 'overview',  label: 'Overview'  },
  { value: 'traffic',   label: 'Traffic'   },
  { value: 'security',  label: 'Security'  },
  { value: 'compliance',label: 'Compliance'},
  { value: 'settings',  label: 'Settings'  },
];

const ICON_TABS: TabItem[] = [
  { value: 'home',     label: 'Home',     icon: <House     size={ICON_SIZE} /> },
  { value: 'search',   label: 'Search',   icon: <MagnifyingGlass size={ICON_SIZE} /> },
  { value: 'alerts',   label: 'Alerts',   icon: <Bell      size={ICON_SIZE} /> },
  { value: 'settings', label: 'Settings', icon: <Gear      size={ICON_SIZE} /> },
  { value: 'profile',  label: 'Profile',  icon: <User      size={ICON_SIZE} /> },
];

const CLOSABLE_TABS: TabItem[] = [
  { value: 'tab1', label: 'Overview',   closable: true },
  { value: 'tab2', label: 'Traffic',    closable: true },
  { value: 'tab3', label: 'Security',   closable: true },
  { value: 'tab4', label: 'Reports',    closable: true },
];

const MANY_TABS: TabItem[] = Array.from({ length: 12 }, (_, i) => ({
  value: `tab${i}`,
  label: ['Overview', 'Traffic', 'Security', 'Compliance', 'Reports', 'Alerts',
          'Settings', 'Users', 'Logs', 'Analytics', 'Billing', 'API Keys'][i],
}));

const MIXED_STATE_TABS: TabItem[] = [
  { value: 'active',   label: 'Active'   },
  { value: 'normal',   label: 'Normal'   },
  { value: 'another',  label: 'Another'  },
  { value: 'disabled', label: 'Disabled', disabled: true },
];

const PANEL_TABS: TabItem[] = [
  { value: 'doc1', label: 'index.ts',      icon: <FileText size={ICON_SIZE} />, closable: true },
  { value: 'doc2', label: 'Button.tsx',    icon: <FileText size={ICON_SIZE} />, closable: true },
  { value: 'doc3', label: 'Tabs.tsx',      icon: <FileText size={ICON_SIZE} />, closable: true },
  { value: 'doc4', label: 'Dropdown.tsx',  icon: <FileText size={ICON_SIZE} />, closable: true },
];

const VERTICAL_TABS: TabItem[] = [
  { value: 'overview',   label: 'Overview',    icon: <ChartBar  size={ICON_SIZE} /> },
  { value: 'security',   label: 'Security',    icon: <Lock      size={ICON_SIZE} /> },
  { value: 'traffic',    label: 'Traffic',     icon: <Globe     size={ICON_SIZE} /> },
  { value: 'tags',       label: 'Tags',        icon: <Tag       size={ICON_SIZE} /> },
  { value: 'settings',   label: 'Settings',    icon: <Gear      size={ICON_SIZE} /> },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'MDS Tabs — **simple** (underline indicator) and **panel** (browser-tab border) variants. Supports horizontal and vertical orientation, optional icons, closable tabs, and scrolling when there are too many tabs to fit.',
      },
    },
  },
  argTypes: {
    orientation: { control: 'radio',   options: ['horizontal', 'vertical'] },
    variant:     { control: 'radio',   options: ['simple', 'panel'] },
    items:       { table: { disable: true } },
    value:       { table: { disable: true } },
    onChange:    { table: { disable: true } },
    onClose:     { table: { disable: true } },
  },
  args: {
    orientation: 'horizontal',
    variant:     'simple',
  },
  render: (args) => (
    <div className="w-full max-w-[600px]">
      <ControlledTabs {...args} items={SIMPLE_TABS} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Playground: Story = {};

export const SimpleHorizontal: Story = {
  name: 'Simple — Horizontal',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-[600px]">
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Default</p>
        <ControlledTabs items={SIMPLE_TABS} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">With icons</p>
        <ControlledTabs items={ICON_TABS} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">With disabled tab</p>
        <ControlledTabs items={MIXED_STATE_TABS} value="active" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Closable tabs</p>
        <ControlledTabs items={CLOSABLE_TABS} />
      </div>
    </div>
  ),
};

export const SimpleVertical: Story = {
  name: 'Simple — Vertical',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Labels only</p>
        <div className="w-[140px] border border-[#eef1f6] rounded-[4px] overflow-hidden">
          <ControlledTabs items={SIMPLE_TABS} orientation="vertical" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">With icons</p>
        <div className="w-[160px] border border-[#eef1f6] rounded-[4px] overflow-hidden">
          <ControlledTabs items={VERTICAL_TABS} orientation="vertical" />
        </div>
      </div>
    </div>
  ),
};

export const PanelVariant: Story = {
  name: 'Panel (browser-tab style)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-[600px]">
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">With close buttons</p>
        <ControlledTabs items={PANEL_TABS} variant="panel" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Without close buttons</p>
        <ControlledTabs
          items={PANEL_TABS.map((t) => ({ ...t, closable: false }))}
          variant="panel"
        />
      </div>
    </div>
  ),
};

export const Scrollable: Story = {
  name: 'Scrollable (overflow)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Horizontal — 12 tabs</p>
        <div className="w-[400px]">
          <ControlledTabs items={MANY_TABS} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Vertical — 12 tabs (fixed height)</p>
        <div className="w-[160px] h-[160px] border border-[#eef1f6] rounded-[4px] overflow-hidden">
          <ControlledTabs items={MANY_TABS} orientation="vertical" />
        </div>
      </div>
    </div>
  ),
};

export const ItemStates: Story = {
  name: 'Item States',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-[500px]">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">
        Active · Normal · Disabled
      </p>
      <ControlledTabs items={MIXED_STATE_TABS} value="active" />
    </div>
  ),
};

export const AllVariants: Story = {
  name: 'All Variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-[600px]">
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Simple · Horizontal</p>
        <ControlledTabs items={ICON_TABS} variant="simple" orientation="horizontal" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Simple · Vertical</p>
        <div className="w-[160px] border border-[#eef1f6] rounded-[4px] overflow-hidden">
          <ControlledTabs items={VERTICAL_TABS} variant="simple" orientation="vertical" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Panel · Horizontal</p>
        <ControlledTabs items={PANEL_TABS} variant="panel" orientation="horizontal" />
      </div>
    </div>
  ),
};
