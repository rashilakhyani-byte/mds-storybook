import type { Meta, StoryObj } from '@storybook/react';
import { ICON_MAP, ICON_NAMES } from '../utils/phosphorIcons';
import { SplitButton, type SplitButtonVariant } from '../../components/ui/SplitButton';

const ICON_SIZE = 12;

function resolveIcon(name: string | undefined) {
  if (!name || name === '(none)') return undefined;
  const Comp = ICON_MAP[name];
  return Comp ? <Comp size={ICON_SIZE} weight="bold" /> : undefined;
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
          'Split button — left side triggers an action, right chevron opens a dropdown. Use the Leading icon control to pick any Phosphor icon.',
      },
    },
  },
  argTypes: {
    variant:         { control: 'select', options: ['secondary', 'primary', 'danger', 'invisible'] },
    disabled:        { control: 'boolean' },
    children:        { control: 'text' },
    leadingIcon:     { table: { disable: true } },
    // Extra arg
    leadingIconName: { control: 'select', options: ICON_NAMES, name: 'Leading icon' },
  } as Meta<typeof SplitButton>['argTypes'],
  args: {
    children: 'Button',
    variant: 'secondary',
    disabled: false,
    ...({ leadingIconName: 'MagnifyingGlass' } as object),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => {
    const a = args as typeof args & { leadingIconName?: string };
    return (
      <SplitButton
        variant={a.variant ?? 'secondary'}
        disabled={a.disabled ?? false}
        leadingIcon={resolveIcon(a.leadingIconName)}
      >
        {String(a.children ?? 'Button')}
      </SplitButton>
    );
  },
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
        ] as { variant: SplitButtonVariant; icon: string; label: string }[]
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
