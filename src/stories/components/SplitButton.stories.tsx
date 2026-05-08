import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ICON_MAP } from '../utils/phosphorIcons';
import { IconPickerInline } from '../utils/IconPickerInline';
import { SplitButton, type SplitButtonVariant } from '../../components/ui/SplitButton';

const ICON_SIZE = 12;

function resolveIcon(name: string | undefined) {
  if (!name || name === '(none)') return undefined;
  const Comp = ICON_MAP[name];
  return Comp ? <Comp size={ICON_SIZE} weight="bold" /> : undefined;
}

// ─── Playground wrapper ────────────────────────────────────────────────────────
function SplitButtonPlaygroundWrapper({
  variant, disabled, children,
}: {
  variant: SplitButtonVariant;
  disabled: boolean;
  children: string;
}) {
  const [leading, setLeading] = useState<string | null>('MagnifyingGlass');

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <SplitButton
        variant={variant}
        disabled={disabled}
        leadingIcon={resolveIcon(leading ?? undefined)}
      >
        {children}
      </SplitButton>

      <div className="w-72 rounded-lg border border-[#eef1f6] bg-white p-4 flex flex-col gap-3 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Icon slot</p>
        <IconPickerInline value={leading} onChange={setLeading} label="Leading" />
      </div>
    </div>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<typeof SplitButton> = {
  title: 'Components/SplitButton',
  component: SplitButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Split button — left side triggers an action, right chevron opens a dropdown. Use the icon picker in the canvas to choose the leading icon.',
      },
    },
  },
  argTypes: {
    variant:     { control: 'select', options: ['secondary', 'primary', 'danger', 'invisible'] },
    disabled:    { control: 'boolean' },
    children:    { control: 'text' },
    leadingIcon: { table: { disable: true } },
  },
  args: {
    children: 'Button',
    variant: 'secondary',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <SplitButtonPlaygroundWrapper
      variant={args.variant ?? 'secondary'}
      disabled={args.disabled ?? false}
      children={String(args.children ?? 'Button')}
    />
  ),
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      {(
        [
          { variant: 'secondary', icon: 'MagnifyingGlass', label: 'Search'  },
          { variant: 'primary',   icon: 'Plus',            label: 'Create'  },
          { variant: 'danger',    icon: 'Trash',           label: 'Delete'  },
          { variant: 'invisible', icon: 'FunnelSimple',    label: 'Filter'  },
        ] as const
      ).map(({ variant, icon, label }) => (
        <div key={variant} className="flex items-center gap-4">
          <span className="w-20 text-[11px] capitalize text-[#626978]">{variant}</span>
          <SplitButton variant={variant} leadingIcon={resolveIcon(icon)}>{label}</SplitButton>
          <SplitButton variant={variant} leadingIcon={resolveIcon(icon)} disabled>{label}</SplitButton>
        </div>
      ))}
    </div>
  ),
};

export const UseCases: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      <SplitButton variant="primary"   leadingIcon={resolveIcon('Plus')}>New API</SplitButton>
      <SplitButton variant="secondary" leadingIcon={resolveIcon('DownloadSimple')}>Export</SplitButton>
      <SplitButton variant="secondary" leadingIcon={resolveIcon('MagnifyingGlass')}>Search</SplitButton>
      <SplitButton variant="danger"    leadingIcon={resolveIcon('Trash')}>Delete selected</SplitButton>
    </div>
  ),
};
