import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Airplane, FunnelSimple, MagnifyingGlass, User, Tag, Clock, Gear, Globe } from '@phosphor-icons/react';
import { Dropdown, type DropdownOption, type DropdownGroup } from '../../components/ui/Dropdown';

const ICON_SIZE = 14;

const SIMPLE_OPTIONS: DropdownOption[] = [
  { value: 'option1', label: 'Option 1', icon: <Airplane size={ICON_SIZE} weight="regular" /> },
  { value: 'option2', label: 'Option 2', icon: <Airplane size={ICON_SIZE} weight="regular" /> },
  { value: 'option3', label: 'Option 3', icon: <Airplane size={ICON_SIZE} weight="regular" /> },
  { value: 'option4', label: 'Option 4', icon: <Airplane size={ICON_SIZE} weight="regular" /> },
  { value: 'option5', label: 'Option 5', icon: <Airplane size={ICON_SIZE} weight="regular" /> },
];

const GROUPED_OPTIONS: DropdownGroup[] = [
  {
    title: 'Group A',
    options: [
      { value: 'search',  label: 'Search',  icon: <MagnifyingGlass size={ICON_SIZE} weight="regular" /> },
      { value: 'filter',  label: 'Filter',  icon: <FunnelSimple    size={ICON_SIZE} weight="regular" /> },
      { value: 'user',    label: 'User',    icon: <User            size={ICON_SIZE} weight="regular" /> },
    ],
  },
  {
    title: 'Group B',
    options: [
      { value: 'tag',     label: 'Tag',     icon: <Tag    size={ICON_SIZE} weight="regular" /> },
      { value: 'clock',   label: 'Clock',   icon: <Clock  size={ICON_SIZE} weight="regular" /> },
      { value: 'settings',label: 'Settings',icon: <Gear   size={ICON_SIZE} weight="regular" /> },
    ],
  },
];

const WITH_STATES: DropdownOption[] = [
  { value: 'active',      label: 'Active item',      icon: <Globe size={ICON_SIZE} weight="regular" /> },
  { value: 'normal',      label: 'Normal item',      icon: <Globe size={ICON_SIZE} weight="regular" /> },
  { value: 'disabled',    label: 'Disabled item',    icon: <Globe size={ICON_SIZE} weight="regular" />, disabled: true },
  { value: 'destructive', label: 'Delete item',      icon: <Globe size={ICON_SIZE} weight="regular" />, destructive: true },
];

const WITH_DESCRIPTIONS: DropdownOption[] = [
  { value: 'a', label: 'Integration Response', description: 'Trigger when integration responds', icon: <Globe size={ICON_SIZE} weight="regular" /> },
  { value: 'b', label: 'Integration Response', description: 'Trigger when integration responds', icon: <Globe size={ICON_SIZE} weight="regular" /> },
  { value: 'c', label: 'Integration Response', description: 'Trigger when integration responds', icon: <Globe size={ICON_SIZE} weight="regular" /> },
];

// ─── Controlled wrapper ────────────────────────────────────────────────────────
function ControlledDropdown(props: React.ComponentProps<typeof Dropdown>) {
  const [val, setVal] = useState<string | string[]>(props.multi ? [] : '');
  return <Dropdown {...props} value={val} onChange={setVal} />;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'MDS Dropdown — single-select and multi-select. Supports inline (label-left) and block (label-top) layouts, grouped options, icons, descriptions, and item states.',
      },
    },
  },
  argTypes: {
    layout:      { control: 'radio',   options: ['inline', 'block'] },
    multi:       { control: 'boolean' },
    required:    { control: 'boolean' },
    disabled:    { control: 'boolean' },
    label:       { control: 'text' },
    placeholder: { control: 'text' },
    note:        { control: 'text' },
    options:     { table: { disable: true } },
    value:       { table: { disable: true } },
    onChange:    { table: { disable: true } },
  },
  args: {
    label: 'Label',
    placeholder: 'Select…',
    layout: 'inline',
    multi: false,
    required: false,
    disabled: false,
  },
  render: (args) => (
    <div className="w-[300px]">
      <ControlledDropdown {...args} options={SIMPLE_OPTIONS} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Playground: Story = {};

export const SingleSelect: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6 w-[300px]">
      <ControlledDropdown label="Label" placeholder="Select…" options={SIMPLE_OPTIONS} layout="inline" />
      <ControlledDropdown label="Label" placeholder="Select…" options={SIMPLE_OPTIONS} layout="inline" value="option3" onChange={() => {}} />
    </div>
  ),
};

export const MultiSelect: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6 w-[300px]">
      <ControlledDropdown label="Label" placeholder="Select options…" options={SIMPLE_OPTIONS} layout="inline" multi />
      <ControlledDropdown label="Label" placeholder="Select options…" options={SIMPLE_OPTIONS} layout="inline" multi value={['option1', 'option3']} onChange={() => {}} />
    </div>
  ),
};

export const BlockLayout: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6 w-[300px]">
      <ControlledDropdown label="Label" placeholder="Placeholder Text" options={SIMPLE_OPTIONS} layout="block" />
      <ControlledDropdown label="Label" placeholder="Select options…" options={SIMPLE_OPTIONS} layout="block" multi />
    </div>
  ),
};

export const GroupedOptions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[300px]">
      <ControlledDropdown label="Category" placeholder="Select…" options={GROUPED_OPTIONS} layout="inline" />
    </div>
  ),
};

export const ItemStates: Story = {
  name: 'Item States (hover / disabled / destructive)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2 w-[300px]">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Click to open — shows all states</p>
      <ControlledDropdown label="Action" placeholder="Select…" options={WITH_STATES} layout="inline" />
    </div>
  ),
};

export const WithDescriptions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[300px]">
      <ControlledDropdown label="Trigger" placeholder="Select…" options={WITH_DESCRIPTIONS} layout="block" />
    </div>
  ),
};

export const Required: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <ControlledDropdown label="Label" placeholder="Required field" options={SIMPLE_OPTIONS} layout="inline" required />
      <ControlledDropdown label="Label" placeholder="Required field" options={SIMPLE_OPTIONS} layout="block" required />
    </div>
  ),
};

export const WithNote: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[300px]">
      <ControlledDropdown label="Label" placeholder="Select…" options={SIMPLE_OPTIONS} layout="block" note="This field is required for form submission." />
    </div>
  ),
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <Dropdown label="Label" placeholder="Disabled" options={SIMPLE_OPTIONS} layout="inline" disabled />
      <Dropdown label="Label" value="option2" placeholder="Disabled with value" options={SIMPLE_OPTIONS} layout="inline" disabled />
    </div>
  ),
};

export const AllLayouts: Story = {
  name: 'All Layouts & Types',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8 p-6 w-[360px]">
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Inline · Single</p>
        <ControlledDropdown label="Label" placeholder="Select…" options={SIMPLE_OPTIONS} layout="inline" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Inline · Multi</p>
        <ControlledDropdown label="Label" placeholder="Select…" options={SIMPLE_OPTIONS} layout="inline" multi />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Block · Single</p>
        <ControlledDropdown label="Label" placeholder="Placeholder Text" options={SIMPLE_OPTIONS} layout="block" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Block · Multi</p>
        <ControlledDropdown label="Label" placeholder="Select options…" options={SIMPLE_OPTIONS} layout="block" multi />
      </div>
    </div>
  ),
};
