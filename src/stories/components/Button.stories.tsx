import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ICON_MAP } from '../utils/phosphorIcons';
import { IconPickerInline } from '../utils/IconPickerInline';
import { Button, type ButtonVariant, type ButtonSize } from '../../components/ui/Button';

const ICON_SIZE = 12;

function renderIcon(name: string | null) {
  if (!name) return undefined;
  const C = ICON_MAP[name];
  return C ? <C size={ICON_SIZE} weight="bold" /> : undefined;
}

// ─── Playground wrapper ────────────────────────────────────────────────────────
function ButtonPlaygroundWrapper({
  variant, size, children, disabled, loading, fullWidth,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  children: string;
  disabled: boolean;
  loading: boolean;
  fullWidth: boolean;
}) {
  const [leading, setLeading]   = useState<string | null>(null);
  const [trailing, setTrailing] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        loading={loading}
        fullWidth={fullWidth}
        leadingIcon={renderIcon(leading)}
        trailingIcon={renderIcon(trailing)}
      >
        {children}
      </Button>

      <div className="w-72 rounded-lg border border-[#eef1f6] bg-white p-4 flex flex-col gap-3 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Icon slots</p>
        <IconPickerInline value={leading}  onChange={setLeading}  label="Leading" />
        <IconPickerInline value={trailing} onChange={setTrailing} label="Trailing" />
      </div>
    </div>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────
function resolveIcon(name: string | undefined) {
  if (!name || name === '(none)') return undefined;
  const Comp = ICON_MAP[name];
  return Comp ? <Comp size={ICON_SIZE} weight="bold" /> : undefined;
}

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'MDS Button — 4 variants × 3 sizes. Use the icon pickers in the canvas to choose leading/trailing icons.',
      },
    },
  },
  argTypes: {
    variant:      { control: 'select', options: ['primary', 'secondary', 'danger', 'invisible'] },
    size:         { control: 'radio',  options: ['sm', 'md', 'lg'] },
    loading:      { control: 'boolean' },
    disabled:     { control: 'boolean' },
    fullWidth:    { control: 'boolean' },
    children:     { control: 'text' },
    leadingIcon:  { table: { disable: true } },
    trailingIcon: { table: { disable: true } },
  },
  args: {
    children: 'Button',
    variant: 'secondary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <ButtonPlaygroundWrapper
      variant={args.variant ?? 'secondary'}
      size={args.size ?? 'md'}
      children={String(args.children ?? 'Button')}
      disabled={args.disabled ?? false}
      loading={args.loading ?? false}
      fullWidth={args.fullWidth ?? false}
    />
  ),
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">
            Size — {size}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {(['primary', 'secondary', 'danger', 'invisible'] as const).map((v) => (
              <Button key={v} variant={v} size={size}
                leadingIcon={resolveIcon('Plus')}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Leading icon</p>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary"   leadingIcon={resolveIcon('Plus')}>New item</Button>
        <Button variant="secondary" leadingIcon={resolveIcon('MagnifyingGlass')}>Search</Button>
        <Button variant="secondary" leadingIcon={resolveIcon('DownloadSimple')}>Export</Button>
        <Button variant="secondary" leadingIcon={resolveIcon('PencilSimple')}>Edit</Button>
        <Button variant="danger"    leadingIcon={resolveIcon('Trash')}>Delete</Button>
        <Button variant="invisible" leadingIcon={resolveIcon('FunnelSimple')}>Filter</Button>
      </div>

      <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Trailing icon</p>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" trailingIcon={resolveIcon('CaretDown')}>Dropdown</Button>
        <Button variant="primary"   trailingIcon={resolveIcon('ArrowRight')}>Continue</Button>
        <Button variant="secondary" trailingIcon={resolveIcon('Export')}>Share</Button>
      </div>

      <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Both icons</p>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary"
          leadingIcon={resolveIcon('Plus')}
          trailingIcon={resolveIcon('CaretDown')}
        >Add &amp; more</Button>
        <Button variant="secondary"
          leadingIcon={resolveIcon('MagnifyingGlass')}
          trailingIcon={resolveIcon('CaretDown')}
        >Search</Button>
      </div>
    </div>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      {(['primary', 'secondary', 'danger', 'invisible'] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-3">
          <span className="w-20 text-[11px] capitalize text-[#626978]">{variant}</span>
          <Button variant={variant} leadingIcon={resolveIcon('Check')}>Rest</Button>
          <Button variant={variant} leadingIcon={resolveIcon('Check')} disabled>Disabled</Button>
          <Button variant={variant} loading>Loading</Button>
        </div>
      ))}
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-72 flex-col gap-3 p-6">
      <Button variant="primary"   fullWidth leadingIcon={resolveIcon('Plus')}>Create new</Button>
      <Button variant="secondary" fullWidth leadingIcon={resolveIcon('MagnifyingGlass')}>Search</Button>
      <Button variant="danger"    fullWidth leadingIcon={resolveIcon('Trash')}>Delete all</Button>
    </div>
  ),
};

export const IconOnly: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-6">
      {['Plus', 'MagnifyingGlass', 'PencilSimple', 'DownloadSimple', 'ArrowCounterClockwise', 'Trash', 'X'].map((name) => (
        <Button key={name} variant={name === 'Trash' ? 'danger' : name === 'X' ? 'invisible' : name === 'Plus' ? 'primary' : 'secondary'}
          leadingIcon={resolveIcon(name)} aria-label={name} />
      ))}
    </div>
  ),
};
