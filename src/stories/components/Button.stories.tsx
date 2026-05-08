import type { Meta, StoryObj } from '@storybook/react';
import { ICON_MAP, ICON_NAMES } from '../utils/phosphorIcons';
import { Button, type ButtonVariant, type ButtonSize } from '../../components/ui/Button';

const ICON_SIZE = 12;

function resolveIcon(name: string | undefined) {
  if (!name || name === '(none)') return undefined;
  const Comp = ICON_MAP[name];
  return Comp ? <Comp size={ICON_SIZE} weight="bold" /> : undefined;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'MDS Button — 4 variants × 3 sizes. Use the Leading icon / Trailing icon controls to pick any Phosphor icon.',
      },
    },
  },
  argTypes: {
    variant:          { control: 'select', options: ['primary', 'secondary', 'danger', 'invisible'] },
    size:             { control: 'radio',  options: ['sm', 'md', 'lg'] },
    loading:          { control: 'boolean' },
    disabled:         { control: 'boolean' },
    fullWidth:        { control: 'boolean' },
    children:         { control: 'text' },
    leadingIcon:      { table: { disable: true } },
    trailingIcon:     { table: { disable: true } },
    // Extra args (not component props) — icon name strings
    leadingIconName:  { control: 'select', options: ICON_NAMES, name: 'Leading icon' },
    trailingIconName: { control: 'select', options: ICON_NAMES, name: 'Trailing icon' },
  } as Meta<typeof Button>['argTypes'],
  args: {
    children: 'Button',
    variant: 'secondary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...({ leadingIconName: '(none)', trailingIconName: '(none)' } as any),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => {
    const a = args as typeof args & { leadingIconName?: string; trailingIconName?: string };
    return (
      <Button
        variant={a.variant ?? 'secondary'}
        size={a.size ?? 'md'}
        disabled={a.disabled ?? false}
        loading={a.loading ?? false}
        fullWidth={a.fullWidth ?? false}
        leadingIcon={resolveIcon(a.leadingIconName)}
        trailingIcon={resolveIcon(a.trailingIconName)}
      >
        {String(a.children ?? 'Button')}
      </Button>
    );
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Size — {size}</p>
          <div className="flex flex-wrap items-center gap-3">
            {(['primary', 'secondary', 'danger', 'invisible'] as const).map((v) => (
              <Button key={v} variant={v} size={size} leadingIcon={resolveIcon('Plus')}>
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
        <Button variant="primary"   leadingIcon={resolveIcon('Plus')}           trailingIcon={resolveIcon('CaretDown')}>Add &amp; more</Button>
        <Button variant="secondary" leadingIcon={resolveIcon('MagnifyingGlass')} trailingIcon={resolveIcon('CaretDown')}>Search</Button>
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
        <Button key={name}
          variant={name === 'Trash' ? 'danger' : name === 'X' ? 'invisible' : name === 'Plus' ? 'primary' : 'secondary'}
          leadingIcon={resolveIcon(name)} aria-label={name} />
      ))}
    </div>
  ),
};
